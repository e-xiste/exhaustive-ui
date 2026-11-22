import { describe, expect, it } from 'vitest';
import { createAppTree, createMigrationRunner } from './helpers';

async function run(files: Record<string, string>) {
    const runner = createMigrationRunner();
    const logs: string[] = [];
    runner.logger.subscribe((entry) => logs.push(entry.message));
    const result = await runner.runSchematic('renamed-inputs', {}, createAppTree(files));
    return { result, logs };
}

describe('renamed-inputs', () => {
    it('renames showCloseIcon to closable on p-drawer, static and bound', async () => {
        const { result } = await run({
            '/src/app/app.html': `<p-drawer [(visible)]="visible" showCloseIcon="false"></p-drawer>\n<p-drawer [showCloseIcon]="canClose" header="x"></p-drawer>\n`
        });
        expect(result.readContent('/src/app/app.html')).toBe(`<p-drawer [(visible)]="visible" closable="false"></p-drawer>\n<p-drawer [closable]="canClose" header="x"></p-drawer>\n`);
    });

    it('renames dropdownAppendTo, maxLength, minLength and virtualRowHeight on their selectors', async () => {
        const { result } = await run({
            '/src/app/app.html': [
                `<p-paginator [rows]="10" dropdownAppendTo="body"></p-paginator>`,
                `<p-password [(ngModel)]="pwd" [maxLength]="20"></p-password>`,
                `<p-autoComplete [minLength]="3"></p-autoComplete>`,
                `<p-autocomplete minLength="2"></p-autocomplete>`,
                `<p-auto-complete [minLength]="n"></p-auto-complete>`,
                `<p-treeTable [virtualRowHeight]="40"></p-treeTable>`,
                `<p-tree-table virtualRowHeight="30"></p-tree-table>`,
                ''
            ].join('\n')
        });
        expect(result.readContent('/src/app/app.html')).toBe(
            [
                `<p-paginator [rows]="10" appendTo="body"></p-paginator>`,
                `<p-password [(ngModel)]="pwd" [maxlength]="20"></p-password>`,
                `<p-autoComplete [minQueryLength]="3"></p-autoComplete>`,
                `<p-autocomplete minQueryLength="2"></p-autocomplete>`,
                `<p-auto-complete [minQueryLength]="n"></p-auto-complete>`,
                `<p-treeTable [virtualScrollItemSize]="40"></p-treeTable>`,
                `<p-tree-table virtualScrollItemSize="30"></p-tree-table>`,
                ''
            ].join('\n')
        );
    });

    it('renames containerStyleClass to class (merging a static class) and containerStyle to style on p-treeselect', async () => {
        const { result } = await run({
            '/src/app/app.html': `<p-treeSelect class="w-full" containerStyleClass="mine" [containerStyle]="{ width: '20rem' }"></p-treeSelect>\n<p-tree-select [containerStyleClass]="cls"></p-tree-select>\n`
        });
        expect(result.readContent('/src/app/app.html')).toBe(`<p-treeSelect class="w-full mine" [style]="{ width: '20rem' }"></p-treeSelect>\n<p-tree-select [class]="cls"></p-tree-select>\n`);
    });

    it('leaves a tag that already binds the replacement untouched and reports it', async () => {
        const html = `<div>\n<p-drawer [showCloseIcon]="a" [closable]="b"></p-drawer>\n</div>\n`;
        const { result, logs } = await run({ '/src/app/app.html': html });
        expect(result.readContent('/src/app/app.html')).toBe(html);
        expect(logs.some((l) => l.includes('/src/app/app.html:2'))).toBe(true);
    });

    it('does not touch other selectors, other attributes or quoted values', async () => {
        const html = `<input [maxLength]="5" minLength="2" />\n<p-select showCloseIcon="false"></p-select>\n<p-drawer [ariaLabel]="'showCloseIcon'" data-showCloseIcon="x"></p-drawer>\n<p-password-strength maxLength="3"></p-password-strength>\n`;
        const { result } = await run({ '/src/app/app.html': html });
        expect(result.readContent('/src/app/app.html')).toBe(html);
    });

    it('renames inside inline component templates and reports programmatic reads', async () => {
        const { result, logs } = await run({
            '/src/app/app.ts': `import { Component } from '@angular/core';\n@Component({\n    selector: 'app-root',\n    template: \`<p-paginator [dropdownAppendTo]="target"></p-paginator>\`\n})\nexport class App {\n    read(p: any) {\n        return p.dropdownAppendTo();\n    }\n}\n`
        });
        const ts = result.readContent('/src/app/app.ts');
        expect(ts).toContain('<p-paginator [appendTo]="target"></p-paginator>');
        expect(ts).toContain('p.dropdownAppendTo()');
        expect(logs.some((l) => l.includes('/src/app/app.ts:8'))).toBe(true);
    });

    it('renames filterPlaceHolder, ariaLabelledby and ariaCloseLabel to the spelling the other components use', async () => {
        const { result } = await run({
            '/src/app/app.html': [
                `<p-listbox filterPlaceHolder="Search"></p-listbox>`,
                `<p-multiselect [filterPlaceHolder]="placeholder"></p-multiselect>`,
                `<p-select filterPlaceHolder="kept"></p-select>`,
                `<p-imagecompare ariaLabelledby="label"></p-imagecompare>`,
                `<p-drawer [ariaCloseLabel]="closeLabel" [(visible)]="open"></p-drawer>`,
                `<p-dialog [content]="headerTpl" [contentTemplate]="body"></p-dialog>`,
                ''
            ].join('\n')
        });
        expect(result.readContent('/src/app/app.html')).toBe(
            [
                `<p-listbox filterPlaceholder="Search"></p-listbox>`,
                `<p-multiselect [filterPlaceholder]="placeholder"></p-multiselect>`,
                `<p-select filterPlaceHolder="kept"></p-select>`,
                `<p-imagecompare ariaLabelledBy="label"></p-imagecompare>`,
                `<p-drawer [closeAriaLabel]="closeLabel" [(visible)]="open"></p-drawer>`,
                `<p-dialog [headerTemplate]="headerTpl" [contentTemplate]="body"></p-dialog>`,
                ''
            ].join('\n')
        );
    });

    it('renames the deprecated pass-through aliases of attribute directives on any element', async () => {
        const { result } = await run({
            '/src/app/app.html': [
                `<button pButton [ptButtonDirective]="pt" pTooltip="Save" [ptTooltip]="tipPt">`,
                `    <span pButtonLabel [ptButtonLabel]="labelPt">Save</span>`,
                `    <i pButtonIcon ptButtonIcon="x"></i>`,
                `</button>`,
                `<input pInputText [ptInputText]="inputPt" [pTooltip]="tip" />`,
                `<p-avatar pBadge [ptBadgeDirective]="badgePt" value="2"></p-avatar>`,
                `<div [ptTooltip]="kept" [ptButtonDirective]="kept"></div>`,
                ''
            ].join('\n')
        });
        expect(result.readContent('/src/app/app.html')).toBe(
            [
                `<button pButton [pButtonPT]="pt" pTooltip="Save" [pTooltipPT]="tipPt">`,
                `    <span pButtonLabel [pButtonLabelPT]="labelPt">Save</span>`,
                `    <i pButtonIcon pButtonIconPT="x"></i>`,
                `</button>`,
                `<input pInputText [pInputTextPT]="inputPt" [pTooltip]="tip" />`,
                `<p-avatar pBadge [pBadgePT]="badgePt" value="2"></p-avatar>`,
                `<div [ptTooltip]="kept" [ptButtonDirective]="kept"></div>`,
                ''
            ].join('\n')
        );
    });

    it('renames pBadge size to badgeSize on plain elements only', async () => {
        const { result } = await run({
            '/src/app/app.html': [
                `<i class="pi pi-bell" pBadge value="2" size="large"></i>`,
                `<button [pBadge]="true" [size]="badgeSize"></button>`,
                `<p-avatar pBadge value="4" size="xlarge"></p-avatar>`,
                `<input pBadge size="10" />`,
                `<span size="large"></span>`,
                ''
            ].join('\n')
        });
        expect(result.readContent('/src/app/app.html')).toBe(
            [
                `<i class="pi pi-bell" pBadge value="2" badgeSize="large"></i>`,
                `<button [pBadge]="true" [badgeSize]="badgeSize"></button>`,
                `<p-avatar pBadge value="4" size="xlarge"></p-avatar>`,
                `<input pBadge size="10" />`,
                `<span size="large"></span>`,
                ''
            ].join('\n')
        );
    });
});
