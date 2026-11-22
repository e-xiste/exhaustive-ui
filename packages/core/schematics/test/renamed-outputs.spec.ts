import { describe, expect, it } from 'vitest';
import { createAppTree, createMigrationRunner } from './helpers';

async function run(files: Record<string, string>) {
    const runner = createMigrationRunner();
    const logs: string[] = [];
    runner.logger.subscribe((entry) => logs.push(entry.message));
    const result = await runner.runSchematic('renamed-outputs', {}, createAppTree(files));
    return { result, logs };
}

describe('renamed-outputs', () => {
    it('renames the outputs on their selectors and keeps the handler and $event', async () => {
        const { result } = await run({
            '/src/app/app.html': [
                `<p-orderlist [value]="items" (onFilterEvent)="filtered($event.value)"></p-orderlist>`,
                `<p-order-list on-onFilterEvent="filtered($event)"></p-order-list>`,
                `<p-table [value]="rows" [selectAll]="all" (selectAllChange)="toggleAll($event.checked)"></p-table>`,
                `<p-multiselect [options]="opts" (onPanelShow)="opened($event)" (onPanelHide)='closed()'></p-multiselect>`,
                `<p-multiSelect (onPanelShow)="opened($event)" (onShow)="other()"></p-multiSelect>`,
                ''
            ].join('\n')
        });
        expect(result.readContent('/src/app/app.html')).toBe(
            [
                `<p-orderlist [value]="items" (onFilter)="filtered($event.value)"></p-orderlist>`,
                `<p-order-list on-onFilter="filtered($event)"></p-order-list>`,
                `<p-table [value]="rows" [selectAll]="all" (onSelectAllChange)="toggleAll($event.checked)"></p-table>`,
                `<p-multiselect [options]="opts" (onShow)="opened($event)" (onHide)='closed()'></p-multiselect>`,
                `<p-multiSelect (onShow)="opened($event)" (onShow)="other()"></p-multiSelect>`,
                ''
            ].join('\n')
        );
    });

    it('does not touch other selectors, inputs or quoted values', async () => {
        const html = `<p-select (onPanelShow)="a()"></p-select>\n<p-listbox (selectAllChange)="b()"></p-listbox>\n<p-multiselect [onPanelShow]="x" (onChange)="log('onPanelShow')"></p-multiselect>\n`;
        const { result } = await run({ '/src/app/app.html': html });
        expect(result.readContent('/src/app/app.html')).toBe(html);
    });

    it('renames inside inline templates and reports [(selectAll)] and programmatic references', async () => {
        const { result, logs } = await run({
            '/src/app/app.ts': `import { Component } from '@angular/core';\n@Component({\n    selector: 'app-root',\n    template: \`<p-multiselect (onPanelHide)="closed()"></p-multiselect>\n<p-table [(selectAll)]="all"></p-table>\`\n})\nexport class App {\n    listen(ms: any) {\n        ms.onPanelShow.subscribe(() => {});\n    }\n}\n`
        });
        const ts = result.readContent('/src/app/app.ts');
        expect(ts).toContain('<p-multiselect (onHide)="closed()"></p-multiselect>');
        expect(ts).toContain('[(selectAll)]="all"');
        expect(logs.some((l) => l.includes('/src/app/app.ts:5'))).toBe(true);
        expect(logs.some((l) => l.includes('/src/app/app.ts:9'))).toBe(true);
    });
});
