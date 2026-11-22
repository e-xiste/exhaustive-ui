import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

// The naming rules documented on /guides/naming
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../../../..');
const srcDir = path.join(root, 'packages/core/src');
const docsDir = path.join(root, 'apps/docs');

// Classes whose name is not the public name of the component
const PUBLIC_NAMES = { UIChart: 'Chart', UITreeNode: 'TreeNode', TTSortIcon: 'TreeTableSortIcon', TTCheckbox: 'TreeTableCheckbox', TTHeaderCheckbox: 'TreeTableHeaderCheckbox' };

const kebab = (name) =>
    'p-' +
    name
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();

const walk = (dir, filter, files = []) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name !== 'node_modules' && entry.name !== 'dist') walk(file, filter, files);
        } else if (filter(entry.name)) files.push(file);
    }
    return files;
};

const DECLARATION = /@(Component|Directive)\(\{((?:(?!@Component|@Directive)[\s\S])*?)\}\)\s*(?:export\s+)?class (\w+)/g;
const declarations = [];
for (const file of walk(srcDir, (name) => name.endsWith('.ts') && !name.endsWith('.test.ts') && !name.endsWith('.d.ts'))) {
    if (file.includes(`${path.sep}icons${path.sep}`)) continue;
    for (const match of fs.readFileSync(file, 'utf-8').matchAll(DECLARATION)) {
        const selector = match[2].match(/selector:\s*'([^']+)'/)?.[1];
        if (selector) declarations.push({ kind: match[1], className: match[3], selectors: selector.split(',').map((s) => s.trim()), file: path.relative(root, file) });
    }
}
const elements = (selectors) => selectors.filter((s) => /^p-[A-Za-z-]+$/.test(s));
const components = declarations.filter((d) => d.kind === 'Component' && elements(d.selectors).length);
const canonical = new Set(components.map((c) => elements(c.selectors)[0]));
// Elements of the documentation site itself, not of the library
const SITE_ELEMENTS = new Set(['p-deferred-demo']);
const legacy = new Map(
    components.flatMap((c) =>
        elements(c.selectors)
            .slice(1)
            .map((s) => [s, elements(c.selectors)[0]])
    )
);

describe('naming conventions', () => {
    it('finds the components', () => {
        assert.ok(components.length > 100, `only ${components.length} components found`);
    });

    it('names every component element p- plus its name in kebab case, first in the selector', () => {
        const problems = [];
        for (const { className, selectors, file } of components) {
            const expected = kebab(PUBLIC_NAMES[className] ?? className);
            if (elements(selectors)[0] !== expected) problems.push(`${className} (${file}): the selector must start with ${expected}, found "${selectors.join(', ')}"`);
        }
        assert.deepEqual(problems, []);
    });

    it('names every directive attribute p or tt plus its name in camel case', () => {
        const problems = [];
        for (const { className, selectors, file } of declarations) {
            for (const selector of selectors) {
                for (const [, attribute] of selector.matchAll(/\[(\w+)\]/g)) {
                    if (!/^(p|tt)[A-Z]\w*$/.test(attribute)) problems.push(`${className} (${file}): [${attribute}]`);
                }
            }
        }
        assert.deepEqual(problems, []);
    });

    it('uses only the kebab case element names in the documentation', () => {
        const problems = [];
        const files = [...walk(path.join(docsDir, 'doc'), (n) => n.endsWith('.ts')), ...walk(path.join(docsDir, 'pages'), (n) => n.endsWith('.ts'))];
        for (const file of files) {
            const source = fs.readFileSync(file, 'utf-8');
            for (const [, tag] of source.matchAll(/<\/?(p-[A-Za-z][A-Za-z-]*)(?=[\s>/])/g)) {
                if (legacy.has(tag)) problems.push(`${path.relative(root, file)}: <${tag}> instead of <${legacy.get(tag)}>`);
                else if (!canonical.has(tag) && !SITE_ELEMENTS.has(tag)) problems.push(`${path.relative(root, file)}: <${tag}> is not a component`);
            }
        }
        assert.deepEqual([...new Set(problems)], []);
    });
});
