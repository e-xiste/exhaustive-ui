import * as ts from 'typescript';
import { encodeLiteralBody, escapeRegExp, findOpeningTags, isDirectComponentTemplateProperty, maskQuotedValues } from './removed-inputs';

interface Edit {
    start: number;
    end: number;
    replacement: string;
}

export interface OutputRename {
    /** The removed output name, e.g. 'onPanelShow'. */
    from: string;
    /** The output that replaces it, e.g. 'onShow'. */
    to: string;
}

export interface SelectorOutputRename {
    /** The element selector these renames apply to, e.g. 'p-multiselect'. */
    selector: string;
    renames: readonly OutputRename[];
}

export interface OutputRenameResult {
    text: string;
    changed: boolean;
    /** `from → to` for every binding rewritten. */
    renamed: string[];
}

/**
 * Matches the name of an event binding for `name` on an opening tag: `(name)="..."` or the
 * canonical `on-name="..."` form. Group 1 is what precedes the name, group 2 what follows it. Meant
 * to run against a quote-masked copy of the tag (see `maskQuotedValues`), so text inside another
 * attribute's quoted value never matches.
 */
function eventRegex(name: string): RegExp {
    return new RegExp(`(?<=\\s)(\\(|on-)${escapeRegExp(name)}(\\)|)(?=\\s*=)`, 'g');
}

/**
 * Renames the event bindings of a single opening tag. Binding the same output twice is valid
 * Angular, so a tag that already listens to the new name is renamed as well: both handlers keep
 * running, as they did before.
 */
function renameOnTag(tag: string, renames: readonly OutputRename[]): { text: string; renamed: string[] } {
    let text = tag;
    const renamed: string[] = [];

    for (const { from, to } of renames) {
        const masked = maskQuotedValues(text);
        const edits: Edit[] = [];
        const regex = eventRegex(from);
        let match: RegExpExecArray | null;
        while ((match = regex.exec(masked))) {
            // `(name` without `)` or `on-name)` is part of something else
            if ((match[1] === '(') !== (match[2] === ')')) {
                continue;
            }
            edits.push({ start: match.index, end: match.index + match[0].length, replacement: `${match[1]}${to}${match[2]}` });
            renamed.push(`${from} → ${to}`);
        }
        text = applyEdits(text, edits);
    }

    return { text, renamed };
}

function applyEdits(text: string, edits: Edit[]): string {
    edits.sort((a, b) => b.start - a.start);
    let result = text;
    for (const edit of edits) {
        result = result.slice(0, edit.start) + edit.replacement + result.slice(edit.end);
    }
    return result;
}

/**
 * Renames output bindings, scoped per-selector, in an HTML fragment (a standalone template file or
 * the body of an inline component template).
 */
export function renameOutputsInHtml(html: string, groups: readonly SelectorOutputRename[]): OutputRenameResult {
    const edits: Edit[] = [];
    const renamed: string[] = [];

    for (const group of groups) {
        for (const tag of findOpeningTags(html, group.selector)) {
            const result = renameOnTag(html.slice(tag.start, tag.end), group.renames);
            if (result.renamed.length > 0) {
                edits.push({ start: tag.start, end: tag.end, replacement: result.text });
                renamed.push(...result.renamed);
            }
        }
    }

    if (edits.length === 0) {
        return { text: html, changed: false, renamed };
    }
    return { text: applyEdits(html, edits), changed: true, renamed };
}

/** Same rename, applied only inside the `template` string literal of an `@Component` decorator. */
export function renameOutputsInTypeScript(fileName: string, text: string, groups: readonly SelectorOutputRename[]): OutputRenameResult {
    const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
    const edits: Edit[] = [];
    const renamed: string[] = [];

    const visit = (node: ts.Node): void => {
        if (ts.isPropertyAssignment(node) && isDirectComponentTemplateProperty(node) && ts.isStringLiteralLike(node.initializer)) {
            const initializer = node.initializer;
            const result = renameOutputsInHtml(initializer.text, groups);
            if (result.changed) {
                edits.push({ start: initializer.getStart(sourceFile), end: initializer.getEnd(), replacement: encodeLiteralBody(initializer, result.text) });
                renamed.push(...result.renamed);
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);

    if (edits.length === 0) {
        return { text, changed: false, renamed };
    }
    return { text: applyEdits(text, edits), changed: true, renamed };
}

/**
 * Finds tags of `selector` carrying a two-way binding `[(name)]` in an HTML fragment. Returns the
 * 1-based line of each.
 */
export function findTwoWayBindings(html: string, selector: string, name: string): number[] {
    const lines: number[] = [];
    const regex = new RegExp(`(?<=\\s)\\[\\(${escapeRegExp(name)}\\)\\](?=\\s*=)`);
    for (const tag of findOpeningTags(html, selector)) {
        if (regex.test(maskQuotedValues(html.slice(tag.start, tag.end)))) {
            lines.push(html.slice(0, tag.start).split('\n').length);
        }
    }
    return lines;
}

/** Same scan inside the inline `template` literals of a TypeScript file; returns 1-based lines within the file. */
export function findTwoWayBindingsInTypeScript(fileName: string, text: string, selector: string, name: string): number[] {
    const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
    const lines: number[] = [];
    const visit = (node: ts.Node): void => {
        if (ts.isPropertyAssignment(node) && isDirectComponentTemplateProperty(node) && ts.isStringLiteralLike(node.initializer)) {
            const templateLine = sourceFile.getLineAndCharacterOfPosition(node.initializer.getStart(sourceFile)).line + 1;
            lines.push(...findTwoWayBindings(node.initializer.text, selector, name).map((line) => templateLine + line - 1));
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    return lines;
}
