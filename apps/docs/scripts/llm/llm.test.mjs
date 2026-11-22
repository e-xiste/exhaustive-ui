import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { checkRenames } from './agents.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../../..');
const LLMS_DIR = path.resolve(__dirname, '../../public/llms');
const CORE_DIST = path.join(ROOT, 'packages/core/dist');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));

describe('component cards', () => {
    const cards = readJson(path.join(LLMS_DIR, 'cards/index.json'));
    const card = (name) => fs.readFileSync(path.join(LLMS_DIR, 'cards', `${name}.md`), 'utf-8');

    it('exist for every documented component with selectors, and stay short', () => {
        const manifest = readJson(path.join(LLMS_DIR, 'manifest.json'));
        const { components } = readJson(path.join(LLMS_DIR, 'components.json'));
        const withSelectors = new Set(manifest.entryPoints.filter((e) => e.declarations?.length).map((e) => e.name));
        const expected = components.map((c) => c.name).filter((name) => withSelectors.has(name));

        assert.deepEqual(cards.map((c) => c.name).sort(), expected.sort());
        for (const { name } of cards) assert.ok(card(name).length < 20000, `${name}.md is ${card(name).length} characters`);
    });

    it('give the import, the canonical tag first, and the template names and contexts of the code', () => {
        const select = card('select');

        assert.match(select, /import \{ Select \} from '@exhaustive-ui\/core\/select';/);
        assert.match(select, /## `p-select`: Select/);
        assert.match(select, /- `#selectedItem`: context \{ \$implicit: T \}/);
        assert.match(card('datepicker'), /## `p-date-picker` \(also `p-datePicker`, `p-datepicker`, legacy\): DatePicker/);
        assert.match(card('table'), /- `#body`: context \{ \$implicit: T, rowIndex: number,/);
        assert.match(card('table'), /### `p-cell-editor`[^\n]*\n\n[\s\S]*?- `#input`: no context/);
        assert.match(card('treetable'), /- `TreeTableRowNode`: \{ node: TreeNode<T>, parent: [^}]*level: number, visible: boolean \}/);
    });
});

describe('AGENTS.md', () => {
    it('names only selectors that exist', () => {
        assert.doesNotThrow(() => checkRenames(readJson(path.join(LLMS_DIR, 'manifest.json'))));
    });

    it('is published on the site with a link to every card', () => {
        const agents = fs.readFileSync(path.join(LLMS_DIR, 'AGENTS.md'), 'utf-8');
        for (const { name } of readJson(path.join(LLMS_DIR, 'cards/index.json'))) assert.ok(agents.includes(`https://exhaustive-ui.com/llms/cards/${name}.md`), name);
    });

    it('is shipped in @exhaustive-ui/core with the cards it links to', { skip: !fs.existsSync(path.join(CORE_DIST, 'AGENTS.md')) && 'packages/core/dist has no AGENTS.md: run pnpm --filter @exhaustive-ui/core build:llms' }, () => {
        const agents = fs.readFileSync(path.join(CORE_DIST, 'AGENTS.md'), 'utf-8');
        const links = [...agents.matchAll(/\]\((llms\/cards\/[\w-]+\.md)\)/g)].map((m) => m[1]);

        assert.ok(links.length > 80, `${links.length} cards linked`);
        for (const link of links) assert.ok(fs.existsSync(path.join(CORE_DIST, link)), link);
        assert.match(agents, new RegExp(`^# ExhaustiveUI ${readJson(path.join(ROOT, 'packages/core/package.json')).version.replace(/\./g, '\\.')}:`));
    });
});

describe('the documentation examples', () => {
    const MCP_DIST = path.join(ROOT, 'packages/mcp/dist/index.mjs');

    it('pass `exhaustive-ui-mcp check` without error', { skip: !fs.existsSync(MCP_DIST) && 'packages/mcp is not built' }, async () => {
        const { buildCatalog, checkProject } = await import(MCP_DIST);
        const catalog = buildCatalog(readJson(path.join(LLMS_DIR, 'components.json')), readJson(path.join(LLMS_DIR, 'manifest.json')));
        const docsDir = path.resolve(__dirname, '../..');
        const { files, issues } = await checkProject(catalog, [path.join(docsDir, 'doc'), path.join(docsDir, 'pages')]);
        const errors = issues
            .filter((issue) => issue.severity === 'error')
            // <p-deferred-demo> is a component of the site; the migration guides show PrimeNG code on purpose
            .filter((issue) => issue.name !== '<p-deferred-demo>' && !issue.file.includes(`${path.sep}migration${path.sep}`))
            .map((issue) => `${path.relative(docsDir, issue.file)}:${issue.line} ${issue.message}`);

        assert.ok(files > 1000, `only ${files} files checked`);
        assert.deepEqual(errors, []);
    });
});
