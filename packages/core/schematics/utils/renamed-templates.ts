import * as ts from 'typescript';
import { encodeLiteralBody, escapeRegExp, findOpeningTags, isDirectComponentTemplateProperty } from './removed-inputs';

interface Edit {
    start: number;
    end: number;
    replacement: string;
}

export interface SelectorTemplateRename {
    /** The element selector whose projected templates are renamed, e.g. 'p-multiselect'. */
    selector: string;
    renames: ReadonlyArray<{ from: string; to: string }>;
}

export interface TemplateRenameResult {
    text: string;
    changed: boolean;
    /** `from → to` for every template renamed. */
    renamed: string[];
    /** 1-based lines of elements left untouched because they already project the new template name. */
    conflictLines: number[];
}

/** `#name` / `ref-name` template reference, or `pTemplate="name"`. Group 1 is the prefix, group 2 the suffix. */
function templateNameRegex(name: string): RegExp {
    const escaped = escapeRegExp(name);
    return new RegExp(`(?<=\\s)(#|ref-|pTemplate\\s*=\\s*["'])${escaped}(?=["'\\s/>=])`, 'g');
}

/**
 * Finds the range of the content of every `selector` element: from the end of its opening tag to
 * the start of its matching closing tag (nested elements of the same selector are skipped over).
 * Self-closing elements have no content.
 */
function findElementBodies(html: string, selector: string): Array<{ tagStart: number; start: number; end: number }> {
    const bodies: Array<{ tagStart: number; start: number; end: number }> = [];
    const openings = findOpeningTags(html, selector).filter((tag) => !/\/\s*>$/.test(html.slice(tag.start, tag.end)));
    const closeRegex = new RegExp(`</${escapeRegExp(selector)}\\s*>`, 'g');
    const closings = [...html.matchAll(closeRegex)].map((match) => match.index);

    for (const opening of openings) {
        let depth = 0;
        const events = [...openings.filter((other) => other.start > opening.start).map((other) => ({ at: other.start, open: true })), ...closings.filter((at) => at > opening.end).map((at) => ({ at, open: false }))].sort((a, b) => a.at - b.at);
        for (const event of events) {
            if (event.open) {
                depth++;
            } else if (depth === 0) {
                bodies.push({ tagStart: opening.start, start: opening.end, end: event.at });
                break;
            } else {
                depth--;
            }
        }
    }
    return bodies;
}

/**
 * Renames the templates projected into the elements of each selector: `<ng-template #from>` and
 * `<ng-template pTemplate="from">` become `#to` / `pTemplate="to"`. An element that already
 * projects a `to` template is left untouched and reported, since the component only ever rendered
 * one of the two.
 */
export function renameTemplatesInHtml(html: string, groups: readonly SelectorTemplateRename[]): TemplateRenameResult {
    const edits: Edit[] = [];
    const renamed: string[] = [];
    const conflictLines: number[] = [];

    for (const group of groups) {
        for (const body of findElementBodies(html, group.selector)) {
            const content = html.slice(body.start, body.end);
            for (const { from, to } of group.renames) {
                const matches = [...content.matchAll(templateNameRegex(from))];
                if (matches.length === 0) {
                    continue;
                }
                if (templateNameRegex(to).test(content)) {
                    conflictLines.push(html.slice(0, body.tagStart).split('\n').length);
                    continue;
                }
                for (const match of matches) {
                    const start = body.start + match.index + match[1].length;
                    edits.push({ start, end: start + from.length, replacement: to });
                    renamed.push(`${from} → ${to}`);
                }
            }
        }
    }

    if (edits.length === 0) {
        return { text: html, changed: false, renamed, conflictLines };
    }
    edits.sort((a, b) => b.start - a.start);
    let text = html;
    for (const edit of edits) {
        text = text.slice(0, edit.start) + edit.replacement + text.slice(edit.end);
    }
    return { text, changed: true, renamed, conflictLines };
}

/** Same rename, applied only inside the `template` string literal of an `@Component` decorator. */
export function renameTemplatesInTypeScript(fileName: string, text: string, groups: readonly SelectorTemplateRename[]): TemplateRenameResult {
    const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
    const edits: Edit[] = [];
    const renamed: string[] = [];
    const conflictLines: number[] = [];

    const visit = (node: ts.Node): void => {
        if (ts.isPropertyAssignment(node) && isDirectComponentTemplateProperty(node) && ts.isStringLiteralLike(node.initializer)) {
            const initializer = node.initializer;
            const result = renameTemplatesInHtml(initializer.text, groups);
            if (result.changed) {
                edits.push({ start: initializer.getStart(sourceFile), end: initializer.getEnd(), replacement: encodeLiteralBody(initializer, result.text) });
                renamed.push(...result.renamed);
            }
            const templateLine = sourceFile.getLineAndCharacterOfPosition(initializer.getStart(sourceFile)).line + 1;
            conflictLines.push(...result.conflictLines.map((line) => templateLine + line - 1));
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);

    if (edits.length === 0) {
        return { text, changed: false, renamed, conflictLines };
    }
    edits.sort((a, b) => b.start - a.start);
    let result = text;
    for (const edit of edits) {
        result = result.slice(0, edit.start) + edit.replacement + result.slice(edit.end);
    }
    return { text: result, changed: true, renamed, conflictLines };
}
