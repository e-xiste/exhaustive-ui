import * as fs from 'fs';
import * as path from 'path';

/**
 * Compares what each component passes to its templates with the context types it declares.
 * A template query reads `contentChild<TemplateRef<Context>>('name')`; the component renders it with
 * `*ngTemplateOutlet="template(); context: { ... }"`. The keys of every literal context passed to a template
 * must be exactly the keys of its context type, across all the places that render it.
 */

const sourceFiles = (dir, files = []) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name !== '__screenshots__') sourceFiles(file, files);
        } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts') && !entry.name.endsWith('.d.ts')) files.push(file);
    }
    return files;
};

/** Text between the brace at `open` and its matching closing brace. */
export function braceBody(source, open) {
    let depth = 0;
    for (let i = open; i < source.length; i++) {
        if (source[i] === '{') depth++;
        else if (source[i] === '}' && --depth === 0) return source.slice(open + 1, i);
    }
    return '';
}

/** Keys of an object literal or interface body, ignoring the keys of nested objects. */
export function topLevelKeys(body) {
    const text = body.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    const keys = new Set();
    let depth = 0;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if ('{(['.includes(c)) depth++;
        else if ('})]'.includes(c)) depth--;
        else if (depth === 0 && (i === 0 || /[,;\n{ ]/.test(text[i - 1]))) {
            const match = /^\s*([$\w]+)\??\s*:/.exec(text.slice(i));
            if (match) {
                keys.add(match[1]);
                i += match[0].length - 1;
            }
        }
    }
    return keys;
}

function readInterfaces(files) {
    const interfaces = new Map();
    for (const file of files) {
        const source = fs.readFileSync(file, 'utf-8');
        for (const match of source.matchAll(/export interface (\w+)(?:<[^{]*?>)?(?:\s+extends\s+([^{]+))?\s*\{/g)) {
            const parents = (match[2] ?? '')
                .split(',')
                .map((p) => p.trim().split('<')[0])
                .filter(Boolean);
            interfaces.set(match[1], { keys: topLevelKeys(braceBody(source, match.index + match[0].length - 1)), parents });
        }
    }
    const keysOf = (name) => {
        const entry = interfaces.get(name);
        if (!entry) return undefined;
        const keys = new Set(entry.keys);
        for (const parent of entry.parents) for (const key of keysOf(parent) ?? []) keys.add(key);
        return keys;
    };
    return keysOf;
}

const QUERY = /(\w+)\s*=\s*contentChild\s*<\s*(?:Nullable<\s*)?TemplateRef<\s*([\w$]+)(?:<[^>]*>)?\s*>[^(]*\(\s*'(\w+)'/g;
const LEGACY = /(\w+)\s*=\s*computed<[^=]*?=>[\s\S]{0,200}?getType\(\)\s*===\s*'(\w+)'/g;
const OUTLET = /\*ngTemplateOutlet="([^"]+)"|\[ngTemplateOutlet\]="([^"]+)"(?:\s*\[ngTemplateOutletContext\]="([^"]+)")?/g;

/**
 * @param {string} srcDir packages/core/src
 * @returns {{ file: string, template: string, type: string, problem: string }[]}
 */
export function checkTemplateContexts(srcDir) {
    const files = sourceFiles(srcDir);
    const keysOf = readInterfaces(files);
    const problems = [];
    let checked = 0;
    for (const file of files) {
        const source = fs.readFileSync(file, 'utf-8');
        const templates = new Map();
        const names = new Map();
        for (const [, property, type, name] of source.matchAll(QUERY)) {
            templates.set(name, type);
            names.set(property, name);
        }
        if (!templates.size) continue;
        for (const [, property, name] of source.matchAll(LEGACY)) if (!names.has(property)) names.set(property, name);

        const passed = new Map();
        for (const match of source.matchAll(OUTLET)) {
            let expression = match[1] ?? match[2];
            let context = match[3];
            if (match[1] && expression.includes(';')) {
                const [head, rest] = [expression.slice(0, expression.indexOf(';')), expression.slice(expression.indexOf(';') + 1)];
                expression = head;
                context = rest.includes('context:') ? rest.slice(rest.indexOf('context:') + 8).trim() : undefined;
            }
            const rendered = new Set([...expression.matchAll(/(\w+)\(\)/g)].map((m) => names.get(m[1])).filter(Boolean));
            for (const name of rendered) {
                if (!passed.has(name)) passed.set(name, { keys: new Set(), dynamic: false });
                const entry = passed.get(name);
                if (context === undefined) continue;
                if (context.startsWith('{')) for (const key of topLevelKeys(context.slice(1, context.lastIndexOf('}')))) entry.keys.add(key);
                else entry.dynamic = true;
            }
        }

        for (const [name, type] of templates) {
            const relative = path.relative(srcDir, file);
            const usage = passed.get(name);
            if (type === 'any') {
                problems.push({ file: relative, template: name, type, problem: 'the context type is any: use void or a context interface' });
                continue;
            }
            // Rendered by another component (a child it is passed to): checked where it is rendered
            if (!usage || usage.dynamic) continue;
            const declared = type === 'void' ? new Set() : keysOf(type);
            if (!declared) {
                problems.push({ file: relative, template: name, type, problem: `the context type ${type} is not an interface of the library` });
                continue;
            }
            checked++;
            const missing = [...usage.keys].filter((k) => !declared.has(k));
            const extra = [...declared].filter((k) => !usage.keys.has(k));
            if (missing.length) problems.push({ file: relative, template: name, type, problem: `passes ${missing.join(', ')}, not declared in ${type}` });
            if (extra.length) problems.push({ file: relative, template: name, type, problem: `${type} declares ${extra.join(', ')}, never passed` });
        }
    }
    return { checked, problems };
}
