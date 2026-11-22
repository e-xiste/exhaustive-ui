import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { readFile, readTemplateNames } from './template-names.mjs';

// Reads the API docs, so run `pnpm --filter docs build:apidoc` first
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../../../../packages/core/src');
const apiDocs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../doc/apidoc/index.json'), 'utf-8'));
const templateNames = readTemplateNames(srcDir);

describe('readFile', () => {
    it('maps each template query to the name written in <ng-template #name>, per class', () => {
        const source = `
export class Picker {
    readonly disabledDateTemplate = contentChild<TemplateRef<Ctx<string>>>('disabledDate', { descendants: false });
    readonly _iconTemplate = contentChild<Nullable<TemplateRef<void>>>('icon');
    readonly panels = contentChildren<TemplateRef<void>>('panel');
    readonly header = contentChild(Header);
}
export class Other {
    readonly itemTemplate = contentChild<TemplateRef<any>>('item');
}`;
        const result = readFile(source, new Map());
        assert.deepEqual(Object.fromEntries(result.get('Picker')), { disabledDateTemplate: 'disabledDate', _iconTemplate: 'icon', panels: 'panel' });
        assert.deepEqual(Object.fromEntries(result.get('Other')), { itemTemplate: 'item' });
    });
});

describe('template API docs', () => {
    const documented = [];
    for (const module of Object.values(apiDocs)) {
        for (const [className, component] of Object.entries(module.components ?? {})) {
            documented.push([className, new Set((component.templates?.values ?? []).map((t) => t.name))]);
        }
    }

    it('documents every template of every component under the name the code reads', () => {
        const problems = [];
        for (const [className, names] of documented) {
            const real = new Set(templateNames.get(className)?.values() ?? []);
            for (const name of real) if (!names.has(name)) problems.push(`${className}: #${name} is not documented (add a JSDoc comment with @group Templates)`);
            for (const name of names) if (!real.has(name)) problems.push(`${className}: #${name} is documented but the component does not read it`);
        }
        assert.deepEqual(problems, []);
    });

    it('lists only real templates in the <Component>Templates interfaces', () => {
        const byDir = new Map();
        for (const dir of fs.readdirSync(srcDir)) {
            const names = new Set();
            const full = path.join(srcDir, dir);
            if (!fs.statSync(full).isDirectory()) continue;
            const result = readTemplateNames(full);
            for (const queries of result.values()) for (const name of queries.values()) names.add(name);
            byDir.set(dir, names);
        }
        const problems = [];
        for (const [moduleName, module] of Object.entries(apiDocs)) {
            const templates = module.types?.templates?.values;
            if (!templates || !byDir.has(moduleName)) continue;
            for (const { name } of templates) if (!byDir.get(moduleName).has(name)) problems.push(`${moduleName}: ${name} is not a template of the component`);
        }
        assert.deepEqual(problems, []);
    });
});
