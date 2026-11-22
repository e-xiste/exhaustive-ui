import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { checkTemplateContexts, topLevelKeys } from './template-contexts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../../../../packages/core/src');

describe('topLevelKeys', () => {
    it('reads the keys of an object literal, not those of nested objects', () => {
        assert.deepEqual([...topLevelKeys(' $implicit: items, options: { rows: items, columns: cols() }, active: isActive(a, b) ')], ['$implicit', 'options', 'active']);
    });

    it('reads optional keys and skips comments', () => {
        assert.deepEqual([...topLevelKeys('\n    /** Row. */\n    $implicit: T;\n    rowspan?: number;\n')], ['$implicit', 'rowspan']);
    });
});

describe('template contexts', () => {
    it('passes to every template exactly the context its type declares', () => {
        const { checked, problems } = checkTemplateContexts(srcDir);
        assert.ok(checked > 250, `only ${checked} templates checked`);
        assert.deepEqual(
            problems.map((p) => `${p.file} #${p.template}: ${p.problem}`),
            []
        );
    });
});
