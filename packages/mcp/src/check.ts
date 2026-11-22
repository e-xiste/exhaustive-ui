import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { COMPONENT_ALIASES } from './catalog';
import { scanElements, scanImports } from './template';
import { shortTitle, slugify } from './text';
import type { Catalog, ComponentEntry, ManifestDeclaration } from './types';
import { LEGACY_IMPORT_PATTERN, declarationsOn, selectorIndex, validateComponentUsage, type UsageIssue } from './validate';

/**
 * `exhaustive-ui-mcp check`: validate every template of a project against the ExhaustiveUI API, the way an agent calls
 * validate_usage, but for all the components of all the files at once, with file and line. Meant to run after an agent
 * (or a person) writes templates: PrimeNG tags and imports, unknown inputs and outputs, removed v22 inputs, misspelled
 * template names.
 */

export interface CheckIssue extends UsageIssue {
    file: string;
    line: number;
    component?: string;
}

interface Region {
    code: string;
    offset: number;
}

/** Packages renamed from PrimeNG, beyond `primeng/*` itself (handled by LEGACY_IMPORT_PATTERN). */
const RENAMED_PACKAGES: [RegExp, (source: string) => string][] = [
    [/^@primeuix\/(themes|styled|styles|utils|motion)(\/.*)?$/, (source) => source.replace(/^@primeuix\//, '@exhaustive-ui/')],
    [/^primeicons(\/.*)?$/, () => '@openng/icons'],
    [/^tailwindcss-primeui$/, () => '@exhaustive-ui/tailwindcss'],
    [/^primelocale(\/.*)?$/, (source) => source.replace(/^primelocale/, '@exhaustive-ui/locale')]
];

/** Components that also pick a template by the type of a node (`<ng-template #person>` for nodes of type person). */
const NODE_TYPE_TEMPLATES = new Set(['Tree', 'OrganizationChart']);

const TAG = /<!--[\s\S]*?-->|<(\/?)([A-Za-z][\w.-]*)((?:\s+(?:[^\s<>"'=/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'<>]+))?))*)\s*(\/?)>/g;
const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

/** The parts of a file that are Angular templates: the whole file for .html, the inline `template:` literals for .ts. */
function templateRegions(file: string, code: string): Region[] {
    if (file.endsWith('.html')) {
        return [{ code, offset: 0 }];
    }

    return [...code.matchAll(/\btemplate\s*:\s*`((?:[^`\\]|\\.)*)`/g)].map((match) => ({ code: match[1]!, offset: match.index! + match[0].indexOf('`') + 1 }));
}

const lineAt = (code: string, offset: number) => code.slice(0, offset).split('\n').length;

/** `primeng/dropdown` -> `@exhaustive-ui/core/select`: the entry point of the component, renamed or not. */
function coreImport(catalog: Catalog, source: string): string {
    const subpath = source.replace(/^(?:@primeng\/[^/]+|@openng\/optimus-ui|optimus-ui|primeng)\/?/, '');
    if (!subpath) return '@exhaustive-ui/core';
    const name = COMPONENT_ALIASES[slugify(subpath)] ?? subpath;
    const component = catalog.components.find((candidate) => candidate.name === name);
    return component?.import ?? `@exhaustive-ui/core/${subpath}`;
}

function checkImports(catalog: Catalog, code: string): Omit<CheckIssue, 'file' | 'line'>[] {
    const issues: Omit<CheckIssue, 'file' | 'line'>[] = [];

    for (const statement of scanImports(code)) {
        const renamed = RENAMED_PACKAGES.find(([pattern]) => pattern.test(statement.source));

        if (LEGACY_IMPORT_PATTERN.test(statement.source) || renamed) {
            const target = renamed ? renamed[1](statement.source) : coreImport(catalog, statement.source);

            issues.push({
                kind: 'import-mismatch',
                severity: 'error',
                name: statement.source,
                message: `"${statement.source}" is a PrimeNG package; ExhaustiveUI uses "${target}".`,
                suggestion: target
            });
        }
    }

    return issues;
}

/** `<ng-template #name>` and `pTemplate="name"` placed inside a component must name one of its templates. */
function checkTemplateNames(catalog: Catalog, region: Region): { offset: number; issue: Omit<CheckIssue, 'file' | 'line'> }[] {
    const index = selectorIndex(catalog);
    const found: { offset: number; issue: Omit<CheckIssue, 'file' | 'line'> }[] = [];
    const stack: { name: string; declaration?: ManifestDeclaration; component?: ComponentEntry }[] = [];

    for (const match of region.code.matchAll(TAG)) {
        if (match[0].startsWith('<!--')) continue;
        const [, closing, name, , selfClosing] = match as unknown as [string, string, string, string, string];
        const lower = name!.toLowerCase();

        if (closing) {
            const at = stack.map((entry) => entry.name).lastIndexOf(lower);
            if (at >= 0) stack.length = at;
            continue;
        }

        const element = scanElements(match[0])[0];

        if (lower === 'ng-template' && element) {
            const host = [...stack].reverse().find((entry) => entry.declaration);
            const reference = element.attributes.find((attribute) => attribute.kind === 'reference');
            const legacy = element.attributes.find((attribute) => attribute.name === 'pTemplate');
            const templateName = legacy?.value ?? reference?.name;
            const templates = host?.declaration?.templates ?? [];

            if (legacy) {
                found.push({
                    offset: match.index!,
                    issue: { kind: 'legacy-template', severity: 'warning', name: `pTemplate="${legacy.value}"`, component: host?.component?.name, message: `pTemplate is legacy: write <ng-template #${legacy.value}>.`, suggestion: `#${legacy.value}` }
                });
            }

            const free = host?.declaration && NODE_TYPE_TEMPLATES.has(host.declaration.className);

            // A template referenced elsewhere (`*ngIf="x; else other"`, `[ngTemplateOutlet]="other"`) is a local one.
            const local = !!reference && !legacy && new RegExp(`(?:\\b(?:else|then)\\s+${reference.name}\\b|="\\s*${reference.name}\\s*[";])`).test(region.code);

            if (host && templateName && templates.length && !free && !local && !templates.some((template) => template.name === templateName)) {
                const sameCase = templates.find((template) => template.name.toLowerCase() === templateName.toLowerCase());
                const selector = host.name;

                found.push({
                    offset: match.index!,
                    issue: sameCase
                        ? {
                              kind: 'template-name',
                              severity: 'error',
                              name: `#${templateName}`,
                              component: host.component?.name,
                              message: `<${selector}> has no #${templateName} template: names are case sensitive, write #${sameCase.name}.`,
                              suggestion: `#${sameCase.name}`
                          }
                        : {
                              kind: 'unknown-template',
                              severity: 'warning',
                              name: `#${templateName}`,
                              component: host.component?.name,
                              message: `<${selector}> has no #${templateName} template, so it ignores this one. Its templates: ${templates.map((template) => `#${template.name}`).join(', ')}.`
                          }
                });
            }
        }

        if (!selfClosing && !VOID_ELEMENTS.has(lower)) {
            const ref = element ? declarationsOn(element, index).find((candidate) => candidate.declaration.templates?.length) : undefined;
            stack.push({ name: lower, declaration: ref?.declaration, component: ref?.component });
        }
    }

    return found;
}

/** Unknown `p-*` tags: PrimeNG names (p-dropdown, p-calendar...) and misspellings. */
function checkUnknownTags(catalog: Catalog, region: Region): { offset: number; issue: Omit<CheckIssue, 'file' | 'line'> }[] {
    const index = selectorIndex(catalog);
    const found: { offset: number; issue: Omit<CheckIssue, 'file' | 'line'> }[] = [];

    for (const match of region.code.matchAll(TAG)) {
        const name = match[2];
        if (!name || match[1] || !/^p-/i.test(name) || index.elements.has(name.toLowerCase())) continue;

        const target = COMPONENT_ALIASES[slugify(name.replace(/^p-/i, ''))];
        const component = target ? catalog.components.find((candidate) => candidate.name === target) : undefined;
        const suggestion = component?.selectors.find((selector) => /^p-/.test(selector));

        found.push({
            offset: match.index!,
            issue: {
                kind: 'unknown-selector',
                severity: 'error',
                name: `<${name}>`,
                component: component?.name,
                message: component ? `<${name}> is the PrimeNG name of ${shortTitle(component.title)}; ExhaustiveUI uses <${suggestion}>.` : `<${name}> is not an ExhaustiveUI component.`,
                suggestion: suggestion ? `<${suggestion}>` : undefined
            }
        });
    }

    return found;
}

/** Reported by checkSource itself, with more context than validateComponentUsage has on a single element. */
const SKIPPED_KINDS = new Set(['import-mismatch', 'selector-not-found', 'unknown-selector', 'selector-mismatch']);

/** Validate one file. */
export function checkSource(catalog: Catalog, file: string, code: string): CheckIssue[] {
    const issues: CheckIssue[] = [];
    const index = selectorIndex(catalog);

    if (file.endsWith('.ts')) {
        for (const issue of checkImports(catalog, code)) issues.push({ ...issue, file, line: lineAt(code, Math.max(code.indexOf(`'${issue.name}'`), code.indexOf(`"${issue.name}"`), 0)) });
    }

    for (const region of templateRegions(file, code)) {
        for (const { offset, issue } of [...checkUnknownTags(catalog, region), ...checkTemplateNames(catalog, region)]) issues.push({ ...issue, file, line: lineAt(code, region.offset + offset) });

        // Each element on its own, so that every issue points to the line of the attribute it is about.
        for (const match of region.code.matchAll(TAG)) {
            if (match[1] || match[0].startsWith('<!--')) continue;
            const element = scanElements(match[0])[0];
            if (!element) continue;

            for (const component of new Set(declarationsOn(element, index).map((ref) => ref.component))) {
                for (const issue of validateComponentUsage(catalog, component, match[0])) {
                    if (SKIPPED_KINDS.has(issue.kind)) continue;
                    const attribute = issue.name ? element.attributes.find((candidate) => candidate.name === issue.name) : undefined;
                    const at = attribute ? match[0].indexOf(attribute.raw) : 0;
                    issues.push({ ...issue, file, component: component.name, line: lineAt(code, region.offset + match.index! + Math.max(at, 0)) });
                }
            }
        }
    }

    const seen = new Set<string>();
    return issues
        .filter((issue) => {
            const key = `${issue.line}|${issue.kind}|${issue.name}|${issue.message}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        })
        .sort((a, b) => a.line - b.line);
}

const SKIPPED_DIRECTORIES = new Set(['node_modules', 'dist', 'build', 'coverage', 'out-tsc', 'tmp']);

async function collectFiles(target: string, files: string[] = []): Promise<string[]> {
    const info = await stat(target);

    if (info.isFile()) {
        if (/\.(html|ts)$/.test(target) && !target.endsWith('.d.ts')) files.push(target);
        return files;
    }

    for (const entry of await readdir(target, { withFileTypes: true })) {
        if (entry.name.startsWith('.') || SKIPPED_DIRECTORIES.has(entry.name)) continue;
        await collectFiles(path.join(target, entry.name), files);
    }

    return files;
}

/** Validate every .html and .ts file under the given paths. */
export async function checkProject(catalog: Catalog, targets: string[]): Promise<{ files: number; issues: CheckIssue[] }> {
    const files: string[] = [];
    for (const target of targets) await collectFiles(target, files);

    const issues: CheckIssue[] = [];
    for (const file of files) issues.push(...checkSource(catalog, file, await readFile(file, 'utf8')));

    return { files: files.length, issues };
}

/** Human readable report, one issue per line, like a compiler. */
export function formatCheckReport(result: { files: number; issues: CheckIssue[] }, cwd = process.cwd()): string {
    const errors = result.issues.filter((issue) => issue.severity === 'error').length;
    const warnings = result.issues.length - errors;
    const lines = result.issues.map((issue) => `${path.relative(cwd, issue.file)}:${issue.line}  ${issue.severity}  ${issue.message}${issue.suggestion && !issue.message.includes(issue.suggestion) ? ` Use: ${issue.suggestion}` : ''}`);

    lines.push(
        result.issues.length
            ? `${errors} error${errors === 1 ? '' : 's'}, ${warnings} warning${warnings === 1 ? '' : 's'} in ${result.files} file${result.files === 1 ? '' : 's'}.`
            : `No ExhaustiveUI issue found in ${result.files} file${result.files === 1 ? '' : 's'}.`
    );

    return lines.join('\n');
}
