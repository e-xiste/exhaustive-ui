import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkProject, checkSource, formatCheckReport } from '../src/check';
import { fixtureContext } from './helpers';

const catalog = await fixtureContext().catalog();

const issuesOf = (file: string, code: string) => checkSource(catalog, file, code).map(({ kind, severity, line, suggestion }) => ({ kind, severity, line, suggestion }));

describe('checkSource', () => {
    it('reports PrimeNG imports with the ExhaustiveUI entry point, renamed components included', () => {
        const code = ["import { TableModule } from 'primeng/table';", "import { DropdownModule } from 'primeng/dropdown';", "import Aura from '@primeuix/themes/aura';", "import { Select } from '@exhaustive-ui/core/select';"].join('\n');

        expect(issuesOf('a.ts', code)).toEqual([
            { kind: 'import-mismatch', severity: 'error', line: 1, suggestion: '@exhaustive-ui/core/table' },
            { kind: 'import-mismatch', severity: 'error', line: 2, suggestion: '@exhaustive-ui/core/select' },
            { kind: 'import-mismatch', severity: 'error', line: 3, suggestion: '@exhaustive-ui/themes/aura' }
        ]);
    });

    it('reports PrimeNG tags with their replacement, and unknown p- tags', () => {
        const html = '<p-dropdown [options]="cities" />\n<p-nothing />';

        expect(issuesOf('a.html', html)).toEqual([
            { kind: 'unknown-selector', severity: 'error', line: 1, suggestion: '<p-select>' },
            { kind: 'unknown-selector', severity: 'error', line: 2, suggestion: undefined }
        ]);
    });

    it('points each unknown or miscased input to its own line', () => {
        const html = '<p-select\n    [options]="cities"\n    [colour]="\'red\'"\n    optionlabel="name" />';

        expect(issuesOf('a.html', html)).toEqual([
            { kind: 'unknown-prop', severity: 'error', line: 3, suggestion: undefined },
            { kind: 'input-case', severity: 'error', line: 4, suggestion: 'optionLabel' }
        ]);
    });

    it('checks the template names placed inside a component', () => {
        const html = [
            '<p-select [options]="cities">',
            '    <ng-template #selectedItem let-city>{{ city.name }}</ng-template>',
            '    <ng-template #row let-city>{{ city.name }}</ng-template>',
            '    <ng-template #item let-city>{{ city.name }}</ng-template>',
            '    <ng-template pTemplate="header">Cities</ng-template>',
            '</p-select>',
            '<ng-template #row>outside any component</ng-template>'
        ].join('\n');

        expect(issuesOf('a.html', html)).toEqual([
            { kind: 'template-name', severity: 'error', line: 2, suggestion: '#selecteditem' },
            { kind: 'unknown-template', severity: 'warning', line: 3, suggestion: undefined },
            { kind: 'legacy-template', severity: 'warning', line: 5, suggestion: '#header' }
        ]);
    });

    it('accepts a template the component does not know when the template itself uses it', () => {
        const html = '<p-select [options]="cities">\n    <ng-template #item let-city>\n        <span *ngIf="city.name; else empty">{{ city.name }}</span>\n        <ng-template #empty>-</ng-template>\n    </ng-template>\n</p-select>';

        expect(issuesOf('a.html', html)).toEqual([]);
    });

    it('reads the inline templates of a component source, with the line in the file', () => {
        const code = ['@Component({', '    template: `', '        <p-button label="Save" [severity]="\'loud\'" />', '    `', '})', 'export class Demo {}'].join('\n');

        expect(issuesOf('demo.ts', code)).toEqual([{ kind: 'invalid-enum-value', severity: 'error', line: 3, suggestion: undefined }]);
    });

    it('accepts valid templates, Angular form directives and template variables', () => {
        const html = '<p-select [options]="cities" [(ngModel)]="city" required [formField]="form.city" />\n<input pInputText minlength="2" email />\n<p-select><ng-template pTemplate="item" let-city let-i="index">{{ city }}</ng-template></p-select>';

        expect(checkSource(catalog, 'a.html', html).filter((issue) => issue.severity === 'error')).toEqual([]);
    });
});

describe('checkProject', () => {
    it('walks the .html and .ts files, skipping node_modules, and reports them like a compiler', async () => {
        const root = mkdtempSync(path.join(tmpdir(), 'eui-check-'));
        mkdirSync(path.join(root, 'app'));
        mkdirSync(path.join(root, 'node_modules'));
        writeFileSync(path.join(root, 'app', 'a.component.html'), '<p-calendar />');
        writeFileSync(path.join(root, 'app', 'ok.component.html'), '<p-button label="Save" />');
        writeFileSync(path.join(root, 'node_modules', 'lib.html'), '<p-calendar />');

        const result = await checkProject(catalog, [root]);

        expect(result.files).toBe(2);
        expect(result.issues).toHaveLength(1);
        expect(formatCheckReport(result, root)).toBe(`${path.join('app', 'a.component.html')}:1  error  <p-calendar> is not an ExhaustiveUI component.\n1 error, 0 warnings in 2 files.`);
    });
});
