import { describe, expect, it } from 'vitest';
import { createAppTree, createMigrationRunner } from './helpers';

async function run(files: Record<string, string>) {
    const runner = createMigrationRunner();
    const logs: string[] = [];
    runner.logger.subscribe((entry) => logs.push(entry.message));
    const result = await runner.runSchematic('renamed-templates', {}, createAppTree(files));
    return { result, logs };
}

describe('renamed-templates', () => {
    it('renames the removetokenicon template of p-multiselect to chipicon', async () => {
        const { result } = await run({
            '/src/app/app.html': [
                `<p-multiselect [options]="cities">`,
                `    <ng-template #removetokenicon let-class="class"><i [class]="class" class="pi pi-times"></i></ng-template>`,
                `</p-multiselect>`,
                `<p-multiSelect [options]="cities"><ng-template pTemplate="removetokenicon">x</ng-template></p-multiSelect>`,
                `<p-autocomplete><ng-template #removetokenicon>kept</ng-template></p-autocomplete>`,
                ''
            ].join('\n')
        });
        expect(result.readContent('/src/app/app.html')).toBe(
            [
                `<p-multiselect [options]="cities">`,
                `    <ng-template #chipicon let-class="class"><i [class]="class" class="pi pi-times"></i></ng-template>`,
                `</p-multiselect>`,
                `<p-multiSelect [options]="cities"><ng-template pTemplate="chipicon">x</ng-template></p-multiSelect>`,
                `<p-autocomplete><ng-template #removetokenicon>kept</ng-template></p-autocomplete>`,
                ''
            ].join('\n')
        );
    });

    it('reports an element that already projects a chipicon template', async () => {
        const html = `<div>\n<p-multiselect>\n<ng-template #removetokenicon>a</ng-template>\n<ng-template #chipicon>b</ng-template>\n</p-multiselect>\n</div>\n`;
        const { result, logs } = await run({ '/src/app/app.html': html });
        expect(result.readContent('/src/app/app.html')).toBe(html);
        expect(logs.some((l) => l.includes('/src/app/app.html:2'))).toBe(true);
    });

    it('renames inside inline component templates', async () => {
        const { result } = await run({
            '/src/app/app.ts': `import { Component } from '@angular/core';\n@Component({\n    selector: 'app-root',\n    template: \`<p-multi-select><ng-template #removetokenicon>x</ng-template></p-multi-select>\`\n})\nexport class App {}\n`
        });
        expect(result.readContent('/src/app/app.ts')).toContain('<p-multi-select><ng-template #chipicon>x</ng-template></p-multi-select>');
    });
});
