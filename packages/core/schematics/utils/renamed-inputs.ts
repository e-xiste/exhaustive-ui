import * as ts from 'typescript';
import { encodeLiteralBody, escapeRegExp, findOpeningTags, isDirectComponentTemplateProperty, maskQuotedValues } from './removed-inputs';
import { rewriteTag as rewriteClassAliasOnTag } from './styleclass';

interface Edit {
    start: number;
    end: number;
    replacement: string;
}

export interface InputRename {
    /** The deprecated input name, e.g. 'showCloseIcon'. */
    from: string;
    /** The input (or native attribute) that replaces it, e.g. 'closable'. */
    to: string;
}

export interface SelectorInputRename {
    /**
     * The selector these renames apply to: an element name, e.g. 'p-drawer', or an attribute
     * directive selector, e.g. '[pTooltip]', matching any element that carries the attribute.
     */
    selector: string;
    renames: readonly InputRename[];
    /** Tag names (as written in the template) on which these renames must not be applied. */
    skipTag?: (tagName: string) => boolean;
}

export interface InputRenameResult {
    text: string;
    changed: boolean;
    /** `from → to` for every binding rewritten. */
    renamed: string[];
    /** 1-based line numbers (relative to the scanned text) of tags left untouched because the new name is already bound there. */
    conflictLines: number[];
}

/**
 * Matches the *name* of an attribute or binding for `name` on an opening tag: `name="..."`, bare
 * `name`, `[name]="..."` or `[(name)]="..."`. Group 1 is the opening bracket(s), group 2 the closing
 * ones. Meant to run against a quote-masked copy of the tag (see `maskQuotedValues`), so text that
 * merely appears inside another attribute's quoted value never matches.
 */
function nameRegex(name: string): RegExp {
    return new RegExp(`(?<=\\s)(\\[\\(|\\[|)${escapeRegExp(name)}(\\)\\]|\\]|)(?=\\s*=|[\\s/>])`, 'g');
}

function hasAttribute(masked: string, name: string): boolean {
    const regex = nameRegex(name);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(masked))) {
        // a bracket pair must be balanced: `[name` without `]` is part of something else
        if (match[1].length === match[2].length) {
            return true;
        }
    }
    return false;
}

/**
 * Renames the deprecated input bindings of a single opening tag. When the replacement name is
 * already bound on the same tag, the deprecated binding is left in place and the tag is reported as
 * a conflict — combining the two values is a decision only the author can make. A `class` target
 * reuses the styleClass → class logic, which can also merge two static values into one `class`.
 */
function renameOnTag(tag: string, renames: readonly InputRename[]): { text: string; renamed: string[]; conflict: boolean } {
    let text = tag;
    const renamed: string[] = [];
    let conflict = false;

    for (const { from, to } of renames) {
        if (!hasAttribute(maskQuotedValues(text), from)) {
            continue;
        }
        if (to === 'class') {
            const result = rewriteClassAliasOnTag(text, from);
            text = result.text;
            conflict ||= result.conflict;
            for (let i = 0; i < result.rewritten; i++) {
                renamed.push(`${from} → ${to}`);
            }
            continue;
        }
        const masked = maskQuotedValues(text);
        if (hasAttribute(masked, to)) {
            conflict = true;
            continue;
        }
        const edits: Edit[] = [];
        const regex = nameRegex(from);
        let match: RegExpExecArray | null;
        while ((match = regex.exec(masked))) {
            if (match[1].length !== match[2].length) {
                continue;
            }
            edits.push({ start: match.index, end: match.index + match[0].length, replacement: `${match[1]}${to}${match[2]}` });
            renamed.push(`${from} → ${to}`);
        }
        edits.sort((a, b) => b.start - a.start);
        for (const edit of edits) {
            text = text.slice(0, edit.start) + edit.replacement + text.slice(edit.end);
        }
    }

    return { text, renamed, conflict };
}

function lineOf(text: string, offset: number): number {
    let line = 1;
    for (let i = 0; i < offset && i < text.length; i++) {
        if (text[i] === '\n') {
            line++;
        }
    }
    return line;
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
 * Renames deprecated input bindings, scoped per-selector, in an HTML fragment (a standalone template
 * file or the body of an inline component template).
 */
export function renameInputsInHtml(html: string, groups: readonly SelectorInputRename[]): InputRenameResult {
    // keyed by tag start: several groups can match the same tag (an element carrying both pButton and
    // pTooltip, or two groups of the same directive), so their renames are applied one after the other
    const tags = new Map<number, { end: number; text: string; conflict: boolean }>();
    const renamed: string[] = [];

    for (const group of groups) {
        for (const tag of findOpeningTags(html, group.selector)) {
            if (group.skipTag?.(tag.name)) {
                continue;
            }
            const current = tags.get(tag.start) ?? { end: tag.end, text: html.slice(tag.start, tag.end), conflict: false };
            const result = renameOnTag(current.text, group.renames);
            renamed.push(...result.renamed);
            tags.set(tag.start, { end: tag.end, text: result.text, conflict: current.conflict || result.conflict });
        }
    }

    const edits: Edit[] = [];
    const conflictLines: number[] = [];
    for (const [start, tag] of tags) {
        if (tag.text !== html.slice(start, tag.end)) {
            edits.push({ start, end: tag.end, replacement: tag.text });
        }
        if (tag.conflict) {
            conflictLines.push(lineOf(html, start));
        }
    }
    conflictLines.sort((a, b) => a - b);

    if (edits.length === 0) {
        return { text: html, changed: false, renamed, conflictLines };
    }
    return { text: applyEdits(html, edits), changed: true, renamed, conflictLines };
}

/**
 * Same rename, applied only inside the `template` string literal of an `@Component` decorator.
 * Conflict lines are reported relative to the whole TypeScript file.
 */
export function renameInputsInTypeScript(fileName: string, text: string, groups: readonly SelectorInputRename[]): InputRenameResult {
    const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
    const edits: Edit[] = [];
    const renamed: string[] = [];
    const conflictLines: number[] = [];

    const visit = (node: ts.Node): void => {
        if (ts.isPropertyAssignment(node) && isDirectComponentTemplateProperty(node) && ts.isStringLiteralLike(node.initializer)) {
            const initializer = node.initializer;
            const result = renameInputsInHtml(initializer.text, groups);
            if (result.changed) {
                edits.push({ start: initializer.getStart(sourceFile), end: initializer.getEnd(), replacement: encodeLiteralBody(initializer, result.text) });
                renamed.push(...result.renamed);
            }
            const templateLine = lineOf(text, initializer.getStart(sourceFile));
            conflictLines.push(...result.conflictLines.map((line) => templateLine + line - 1));
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);

    if (edits.length === 0) {
        return { text, changed: false, renamed, conflictLines };
    }
    return { text: applyEdits(text, edits), changed: true, renamed, conflictLines };
}
