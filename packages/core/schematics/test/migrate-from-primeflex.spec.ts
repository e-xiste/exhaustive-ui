import { describe, expect, it } from 'vitest';
import { createAppTree, createRunner, DEFAULT_PKG } from './helpers';

const PRIMEFLEX_PKG = {
    ...DEFAULT_PKG,
    dependencies: {
        '@angular/core': '^21.0.0',
        primeflex: '^3.3.1'
    }
};

describe('migrate-from-primeflex', () => {
    it('translates PrimeFlex classes in a static class attribute', async () => {
        const runner = createRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<div class="grid col-6 md:col-4 flex align-items-center">x</div>\n`
        });
        const result = await runner.runSchematic('migrate-from-primeflex', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).toContain('grid grid-cols-12 gap-4');
        expect(html).toContain('col-span-6');
        expect(html).toContain('md:col-span-4');
        expect(html).toContain('items-center');
        expect(html).not.toMatch(/\bcol-6\b/);
        expect(html).not.toContain('align-items-center');
    });

    it('translates string literals inside [ngClass] bindings but leaves the expression structure', async () => {
        const runner = createRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<div [ngClass]="{ 'grid col-6': isActive, 'p-2': other }">x</div>\n`
        });
        const result = await runner.runSchematic('migrate-from-primeflex', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).toContain(`'grid grid-cols-12 gap-4 col-span-6': isActive`);
        expect(html).toContain(`'p-2': other`);
    });

    it('does not touch single-class bindings like [class.grid]', async () => {
        const runner = createRunner();
        const content = `<div [class.grid]="on">x</div>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('migrate-from-primeflex', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('translates PrimeFlex classes inside an inline component template', async () => {
        const runner = createRunner();
        const tree = createAppTree({
            '/src/app/card.component.ts':
                `import { Component } from '@angular/core';\n` + '@Component({\n    selector: \'app-card\',\n    template: `<section class="grid col-12"><p class="p-2">hi</p></section>`\n})\n' + `export class CardComponent {}\n`
        });
        const result = await runner.runSchematic('migrate-from-primeflex', {}, tree);
        const ts = result.readContent('/src/app/card.component.ts');
        expect(ts).toContain('class="grid grid-cols-12 gap-4 col-span-12"');
    });

    it('does not rewrite non-template string literals in TypeScript', async () => {
        const runner = createRunner();
        const content = `export const mode = 'grid';\nexport const action = 'reset';\n`;
        const tree = createAppTree({ '/src/app/config.ts': content });
        const result = await runner.runSchematic('migrate-from-primeflex', {}, tree);
        expect(result.readContent('/src/app/config.ts')).toBe(content);
    });

    it('does not touch node_modules or dist', async () => {
        const runner = createRunner();
        const content = `<div class="grid col-6">x</div>\n`;
        const tree = createAppTree({
            '/node_modules/pkg/tpl.html': content,
            '/dist/app/tpl.html': content
        });
        const result = await runner.runSchematic('migrate-from-primeflex', {}, tree);
        expect(result.readContent('/node_modules/pkg/tpl.html')).toBe(content);
        expect(result.readContent('/dist/app/tpl.html')).toBe(content);
    });

    describe('Tailwind version', () => {
        const SOURCE = `<div class="shadow-1 hover:shadow-2 border-round-xs border-round-sm border-round-left-sm shadow-3">x</div>\n`;
        const withTailwind = (range: string) => ({ ...PRIMEFLEX_PKG, devDependencies: { tailwindcss: range } });

        it('produces Tailwind v4 names when Tailwind is not installed yet', async () => {
            const runner = createRunner();
            const tree = createAppTree({ '/src/app/app.html': SOURCE }, PRIMEFLEX_PKG);
            const result = await runner.runSchematic('migrate-from-primeflex', {}, tree);
            expect(result.readContent('/src/app/app.html')).toBe(`<div class="shadow-xs hover:shadow-sm rounded-xs rounded-sm rounded-l-sm shadow-md">x</div>\n`);
        });

        it('produces Tailwind v4 names for a Tailwind v4 workspace', async () => {
            const runner = createRunner();
            const tree = createAppTree({ '/src/app/app.html': SOURCE }, withTailwind('^4.1.0'));
            const result = await runner.runSchematic('migrate-from-primeflex', {}, tree);
            expect(result.readContent('/src/app/app.html')).toContain('class="shadow-xs hover:shadow-sm rounded-xs rounded-sm rounded-l-sm shadow-md"');
        });

        it('keeps the Tailwind v3 names for a Tailwind v3 workspace', async () => {
            const runner = createRunner();
            const tree = createAppTree({ '/src/app/app.html': SOURCE }, withTailwind('^3.4.10'));
            const result = await runner.runSchematic('migrate-from-primeflex', {}, tree);
            expect(result.readContent('/src/app/app.html')).toContain('class="shadow-sm hover:shadow rounded-sm rounded rounded-l shadow-md"');
        });

        it('lets the tailwindVersion option override the detected version', async () => {
            const runner = createRunner();
            const tree = createAppTree({ '/src/app/app.html': SOURCE }, withTailwind('^4.1.0'));
            const result = await runner.runSchematic('migrate-from-primeflex', { tailwindVersion: 3 }, tree);
            expect(result.readContent('/src/app/app.html')).toContain('class="shadow-sm hover:shadow rounded-sm rounded rounded-l shadow-md"');
        });
    });

    it('restricts translation to the requested path', async () => {
        const runner = createRunner();
        const tree = createAppTree({
            '/src/app/in.html': `<div class="col-6">x</div>\n`,
            '/other/out.html': `<div class="col-6">x</div>\n`
        });
        const result = await runner.runSchematic('migrate-from-primeflex', { path: 'src/app' }, tree);
        expect(result.readContent('/src/app/in.html')).toContain('col-span-6');
        expect(result.readContent('/other/out.html')).toBe(`<div class="col-6">x</div>\n`);
    });

    it('warns about the PrimeFlex dependency and CSS import that remain after translation', async () => {
        const runner = createRunner();
        const tree = createAppTree(
            {
                '/src/app/app.html': `<div class="col-6">x</div>\n`,
                '/src/styles.scss': `@import "primeflex/primeflex.css";\nbody { margin: 0; }\n`
            },
            PRIMEFLEX_PKG
        );
        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });
        await runner.runSchematic('migrate-from-primeflex', {}, tree);
        const combined = warnings.join('\n');
        expect(combined).toContain('PrimeFlex classes were translated');
        expect(combined).toContain('/package.json');
        expect(combined).toContain('/src/styles.scss');
    });

    it('reports nothing to translate on a PrimeFlex-free workspace', async () => {
        const runner = createRunner();
        const infos: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'info') {
                infos.push(entry.message);
            }
        });
        await runner.runSchematic('migrate-from-primeflex', {}, createAppTree());
        expect(infos.join('\n')).toContain('No PrimeFlex classes were found to translate.');
    });
});
