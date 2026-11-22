import * as ts from 'typescript';
import { encodeLiteralBody, escapeRegExp, isDirectComponentTemplateProperty } from './removed-inputs';

interface Edit {
    start: number;
    end: number;
    replacement: string;
}

export interface ExportChanges {
    /** Entry point → { old name → new name } for exports renamed in this version. */
    renamed: Record<string, Record<string, string>>;
    /** Entry point → names removed with no replacement in code; their imports and `imports: [...]` entries are dropped. */
    dropped: Record<string, readonly string[]>;
    /** Entry point → names no longer exported; their imports are reported for manual review. */
    unexported: Record<string, readonly string[]>;
    /** Removed wrapper elements → the plain element that replaces them in templates. */
    elements: Record<string, string>;
}

export interface ExportChangeResult {
    text: string;
    changed: boolean;
    /** Human-readable description of each rewrite. */
    applied: string[];
    /** 1-based lines that need manual review. */
    leftovers: number[];
}

function applyEdits(text: string, edits: Edit[]): string {
    edits.sort((a, b) => b.start - a.start);
    let result = text;
    for (const edit of edits) {
        result = result.slice(0, edit.start) + edit.replacement + result.slice(edit.end);
    }
    return result;
}

/** Replaces the opening and closing tags of the removed wrapper elements with their plain replacement. */
export function replaceElementsInHtml(html: string, elements: Record<string, string>): { text: string; replaced: string[] } {
    const replaced: string[] = [];
    let text = html;
    for (const [element, replacement] of Object.entries(elements)) {
        text = text.replace(new RegExp(`<(/?)${escapeRegExp(element)}(?=[\\s/>])`, 'g'), (_match, slash: string) => {
            if (!slash) {
                replaced.push(`<${element}> → <${replacement}>`);
            }
            return `<${slash}${replacement}`;
        });
    }
    return { text, replaced };
}

/**
 * Applies the export changes to one TypeScript file: renames the imports (and every use) of renamed
 * exports, drops the imports and `imports: [...]` entries of dropped ones, replaces the removed
 * wrapper elements in inline templates and reports imports of names that are no longer exported.
 * An aliased import (`import { Old as Mine }`) only has its imported name renamed.
 */
export function applyExportChangesToTypeScript(fileName: string, text: string, changes: ExportChanges): ExportChangeResult {
    const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
    const edits: Edit[] = [];
    const applied: string[] = [];
    const leftovers: number[] = [];
    const renamedLocals = new Map<string, string>();
    const droppedLocals = new Set<string>();
    const lineOf = (node: ts.Node) => sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;

    for (const statement of sourceFile.statements) {
        if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
            continue;
        }
        const entry = statement.moduleSpecifier.text;
        const bindings = statement.importClause?.namedBindings;
        if (!bindings || !ts.isNamedImports(bindings)) {
            continue;
        }
        const renamed = changes.renamed[entry] ?? {};
        const dropped = changes.dropped[entry] ?? [];
        const unexported = changes.unexported[entry] ?? [];
        const kept: ts.ImportSpecifier[] = [];

        for (const specifier of bindings.elements) {
            const imported = (specifier.propertyName ?? specifier.name).text;
            if (renamed[imported]) {
                const target = specifier.propertyName ?? specifier.name;
                edits.push({ start: target.getStart(sourceFile), end: target.getEnd(), replacement: renamed[imported] });
                if (!specifier.propertyName) {
                    renamedLocals.set(imported, renamed[imported]);
                }
                applied.push(`${imported} → ${renamed[imported]}`);
                kept.push(specifier);
            } else if (dropped.includes(imported)) {
                droppedLocals.add(specifier.name.text);
                applied.push(`removed ${imported}`);
            } else {
                if (unexported.includes(imported)) {
                    leftovers.push(lineOf(specifier));
                }
                kept.push(specifier);
            }
        }

        if (kept.length !== bindings.elements.length) {
            if (kept.length === 0 && !statement.importClause?.name) {
                const end = text[statement.getEnd()] === '\n' ? statement.getEnd() + 1 : statement.getEnd();
                edits.push({ start: statement.getStart(sourceFile), end, replacement: '' });
            } else {
                // rebuild the specifier list; renamed specifiers are rewritten here rather than by their own edit
                for (let i = edits.length - 1; i >= 0; i--) {
                    if (edits[i].start >= bindings.getStart(sourceFile) && edits[i].end <= bindings.getEnd()) {
                        edits.splice(i, 1);
                    }
                }
                const list = kept.map((specifier) => {
                    const imported = (specifier.propertyName ?? specifier.name).text;
                    const name = renamed[imported] ?? imported;
                    return specifier.propertyName ? `${name} as ${specifier.name.text}` : name;
                });
                edits.push({ start: bindings.getStart(sourceFile), end: bindings.getEnd(), replacement: `{ ${list.join(', ')} }` });
            }
        }
    }

    const visit = (node: ts.Node): void => {
        if (ts.isIdentifier(node) && renamedLocals.has(node.text) && !ts.isImportSpecifier(node.parent)) {
            const isPropertyName = (ts.isPropertyAccessExpression(node.parent) && node.parent.name === node) || (ts.isPropertyAssignment(node.parent) && node.parent.name === node);
            if (!isPropertyName) {
                edits.push({ start: node.getStart(sourceFile), end: node.getEnd(), replacement: renamedLocals.get(node.text)! });
            }
        } else if (ts.isArrayLiteralExpression(node) && droppedLocals.size > 0) {
            const elements = node.elements;
            const isDropped = (element: ts.Expression) => ts.isIdentifier(element) && droppedLocals.has(element.text);
            if (elements.length > 0 && elements.every(isDropped)) {
                edits.push({ start: elements[0].getStart(sourceFile), end: elements[elements.length - 1].getEnd(), replacement: '' });
            } else {
                elements.forEach((element, index) => {
                    if (!isDropped(element)) {
                        return;
                    }
                    // remove the element with the separator after it, or before it when only dropped elements follow
                    const keptAfter = elements.slice(index + 1).some((other) => !isDropped(other));
                    const start = keptAfter ? element.getStart(sourceFile) : elements[index - 1].getEnd();
                    const end = keptAfter ? elements[index + 1].getStart(sourceFile) : element.getEnd();
                    edits.push({ start, end, replacement: '' });
                });
            }
        } else if (ts.isPropertyAssignment(node) && isDirectComponentTemplateProperty(node) && ts.isStringLiteralLike(node.initializer)) {
            const result = replaceElementsInHtml(node.initializer.text, changes.elements);
            if (result.replaced.length > 0) {
                edits.push({ start: node.initializer.getStart(sourceFile), end: node.initializer.getEnd(), replacement: encodeLiteralBody(node.initializer, result.text) });
                applied.push(...result.replaced);
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);

    if (edits.length === 0) {
        return { text, changed: false, applied, leftovers };
    }
    return { text: applyEdits(text, edits), changed: true, applied, leftovers };
}
