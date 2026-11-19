import { describe, expect, it } from 'vitest';
import { createAppTree, createMigrationRunner } from './helpers';

describe('remove-dead-inputs', () => {
    it('removes showTransformOptions/hideTransformOptions/showTransitionOptions/hideTransitionOptions from p-toast', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toast showTransformOptions="translateY(100%)" [hideTransformOptions]="hideTf" showTransitionOptions="300ms" hideTransitionOptions="250ms" [life]="3000"></p-toast>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransformOptions');
        expect(html).not.toContain('TransitionOptions');
        expect(html).toBe(`<p-toast [life]="3000"></p-toast>\n`);
    });

    it('removes the same inputs from p-toastItem', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toastItem [showTransformOptions]="a" [hideTransformOptions]="b" [message]="msg"></p-toastItem>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toastItem [message]="msg"></p-toastItem>\n`);
    });

    it('removes showTransitionOptions/hideTransitionOptions from p-message', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-message showTransitionOptions="300ms" [hideTransitionOptions]="hideTf" [severity]="'info'"></p-message>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransitionOptions');
        expect(html).toBe(`<p-message [severity]="'info'"></p-message>\n`);
    });

    it('removes showTransitionOptions/hideTransitionOptions from p-overlay', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-overlay [(visible)]="visible" showTransitionOptions=".12s ease" [hideTransitionOptions]="hideTf"></p-overlay>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransitionOptions');
        expect(html).toBe(`<p-overlay [(visible)]="visible"></p-overlay>\n`);
    });

    it('removes showTransitionOptions/hideTransitionOptions from p-colorpicker and its aliases', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-colorpicker [(ngModel)]="color" showTransitionOptions=".12s ease" [hideTransitionOptions]="hideTf"></p-colorpicker>\n<p-colorPicker [showTransitionOptions]="showTf" [inline]="true"></p-colorPicker>\n<p-color-picker hideTransitionOptions=".1s linear" format="rgb"></p-color-picker>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransitionOptions');
        expect(html).toBe(`<p-colorpicker [(ngModel)]="color"></p-colorpicker>\n<p-colorPicker [inline]="true"></p-colorPicker>\n<p-color-picker format="rgb"></p-color-picker>\n`);
    });

    it('removes showTransitionOptions/hideTransitionOptions from p-scrolltop and its aliases', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-scrolltop showTransitionOptions=".3s" [hideTransitionOptions]="hideTf" [threshold]="200"></p-scrolltop>\n<p-scrollTop [showTransitionOptions]="showTf" target="parent"></p-scrollTop>\n<p-scroll-top hideTransitionOptions=".1s linear" icon="pi pi-arrow-up"></p-scroll-top>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransitionOptions');
        expect(html).toBe(`<p-scrolltop [threshold]="200"></p-scrolltop>\n<p-scrollTop target="parent"></p-scrollTop>\n<p-scroll-top icon="pi pi-arrow-up"></p-scroll-top>\n`);
    });

    it('removes the deprecated size from p-overlayBadge while keeping badgeSize', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-overlayBadge size="large" badgeSize="large" severity="danger"><i class="pi pi-bell"></i></p-overlayBadge>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-overlayBadge badgeSize="large" severity="danger"><i class="pi pi-bell"></i></p-overlayBadge>\n`);
    });

    it('removes a bound [size] from p-overlay-badge', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-overlay-badge [size]="badgeSize" [value]="count"></p-overlay-badge>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-overlay-badge [value]="count"></p-overlay-badge>\n`);
    });

    it('removes the deprecated size from p-overlaybadge', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-overlaybadge value="2" size="xlarge"></p-overlaybadge>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-overlaybadge value="2"></p-overlaybadge>\n`);
    });

    it('removes the deprecated transitionOptions from p-fieldset while keeping motionOptions', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-fieldset legend="Header" [toggleable]="true" transitionOptions="200ms ease-in" [motionOptions]="motion"></p-fieldset>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-fieldset legend="Header" [toggleable]="true" [motionOptions]="motion"></p-fieldset>\n`);
    });

    it('removes a bound [transitionOptions] from p-fieldset', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-fieldset [transitionOptions]="transition" [(collapsed)]="collapsed"></p-fieldset>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-fieldset [(collapsed)]="collapsed"></p-fieldset>\n`);
    });

    it('removes the deprecated transitionOptions from p-panel while keeping motionOptions', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-panel header="Header" [toggleable]="true" transitionOptions="200ms ease-in" [motionOptions]="motion"></p-panel>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-panel header="Header" [toggleable]="true" [motionOptions]="motion"></p-panel>\n`);
    });

    it('removes a bound [transitionOptions] from p-panel', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-panel [transitionOptions]="transition" [(collapsed)]="collapsed"></p-panel>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-panel [(collapsed)]="collapsed"></p-panel>\n`);
    });

    it('does not remove transitionOptions from p-dialog', async () => {
        const runner = createMigrationRunner();
        const content = `<p-dialog transitionOptions="200ms ease-in"></p-dialog>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('removes the deprecated transitionOptions from p-accordion while keeping motionOptions', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-accordion value="0" transitionOptions="200ms ease-in" [motionOptions]="motion"></p-accordion>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-accordion value="0" [motionOptions]="motion"></p-accordion>\n`);
    });

    it('removes a bound [transitionOptions] from p-accordion', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-accordion [transitionOptions]="transition" [(value)]="active" [multiple]="true"></p-accordion>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-accordion [(value)]="active" [multiple]="true"></p-accordion>\n`);
    });

    it('removes inputId from p-togglebutton and its aliases', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-togglebutton [(ngModel)]="checked" inputId="tb1" onLabel="Yes"></p-togglebutton>\n<p-toggleButton [inputId]="id" [onLabel]="on"></p-toggleButton>\n<p-toggle-button inputId="tb3"></p-toggle-button>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-togglebutton [(ngModel)]="checked" onLabel="Yes"></p-togglebutton>\n<p-toggleButton [onLabel]="on"></p-toggleButton>\n<p-toggle-button></p-toggle-button>\n`);
    });

    it('keeps inputId on form components that still read it', async () => {
        const runner = createMigrationRunner();
        const content = `<p-toggleswitch inputId="ts1"></p-toggleswitch>\n<p-checkbox [inputId]="id"></p-checkbox>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('does not report a programmatic transitionOptions access as a leftover', async () => {
        const runner = createMigrationRunner();
        const content = `export class Foo {\n    read(panel: { transitionOptions: string }) {\n        return panel.transitionOptions;\n    }\n}\n`;
        const tree = createAppTree({ '/src/app/foo.ts': content });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });

        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/foo.ts')).toBe(content);
        expect(warnings).toEqual([]);
    });

    it('does not report a programmatic inputId access as a leftover', async () => {
        const runner = createMigrationRunner();
        const content = `export class Foo {\n    label(control: { inputId: string }) {\n        return control.inputId;\n    }\n}\n`;
        const tree = createAppTree({ '/src/app/foo.ts': content });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });

        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/foo.ts')).toBe(content);
        expect(warnings).toEqual([]);
    });

    it('does not report a programmatic size access as a leftover', async () => {
        const runner = createMigrationRunner();
        const content = `export class Foo {\n    count() {\n        return new Map().size;\n    }\n}\n`;
        const tree = createAppTree({ '/src/app/foo.ts': content });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });

        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/foo.ts')).toBe(content);
        expect(warnings).toEqual([]);
    });

    it('does not remove a similarly-named attribute on an unrelated selector', async () => {
        const runner = createMigrationRunner();
        const content = `<p-other showTransformOptions="x"></p-other>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('does not remove a bare attribute name that only shares a suffix (data-showTransformOptions)', async () => {
        const runner = createMigrationRunner();
        const content = `<p-toast data-showTransformOptions="x" [life]="3000"></p-toast>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('does not corrupt a dead input name that only appears as text inside a different attribute value', async () => {
        const runner = createMigrationRunner();
        const content = `<p-toast [tooltip]="'toggle the showTransformOptions flag'" [life]="3000"></p-toast>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('removes an unquoted bare-value attribute (showTransformOptions=translateY)', async () => {
        const runner = createMigrationRunner();
        const content = `<p-toast showTransformOptions=translateY [life]="3000"></p-toast>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toast [life]="3000"></p-toast>\n`);
    });

    it('removes the bindings inside an inline component template', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/card.component.ts':
                `import { Component } from '@angular/core';\n` +
                '@Component({\n' +
                "    selector: 'app-card',\n" +
                '    template: `<p-toast showTransformOptions="translateY(100%)" [life]="3000"></p-toast>`\n' +
                '})\n' +
                `export class CardComponent {}\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const ts = result.readContent('/src/app/card.component.ts');
        expect(ts).not.toContain('showTransformOptions');
        expect(ts).toContain('<p-toast [life]="3000"></p-toast>');
    });

    it('reports a leftover for a programmatic property access, without modifying the file', async () => {
        const runner = createMigrationRunner();
        const content =
            `import { Component, ViewChild } from '@angular/core';\n` +
            `import { Toast } from '@exhaustive-ui/core/toast';\n\n` +
            `@Component({ selector: 'app-x', template: '' })\n` +
            `export class XComponent {\n` +
            `    @ViewChild(Toast) toast!: Toast;\n\n` +
            `    ngAfterViewInit() {\n` +
            `        console.log(this.toast.showTransformOptions);\n` +
            `    }\n` +
            `}\n`;
        const tree = createAppTree({ '/src/app/x.component.ts': content });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });

        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/x.component.ts')).toBe(content);
        const combined = warnings.join('\n');
        expect(combined).toContain('showTransformOptions');
        expect(combined).toContain('/src/app/x.component.ts:9');
    });

    it('does not rewrite non-template string literals in TypeScript', async () => {
        const runner = createMigrationRunner();
        const content = `export const label = '<p-toast showTransformOptions="x"></p-toast>';\n`;
        const tree = createAppTree({ '/src/app/config.ts': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/config.ts')).toBe(content);
    });

    it('removes a dead input inside a double-quoted inline template whose HTML attributes need escaped quotes', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/card.component.ts':
                `import { Component } from '@angular/core';\n` +
                '@Component({\n' +
                "    selector: 'app-card',\n" +
                '    template: "<p-toast showTransformOptions=\\"translateY(100%)\\" [life]=\\"3000\\"></p-toast>"\n' +
                '})\n' +
                `export class CardComponent {}\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const ts = result.readContent('/src/app/card.component.ts');
        expect(ts).not.toContain('showTransformOptions');
        expect(ts).toContain('template: "<p-toast [life]=\\"3000\\"></p-toast>"');
    });

    it('does not rewrite a `template` property nested inside providers metadata', async () => {
        const runner = createMigrationRunner();
        const content =
            `import { Component } from '@angular/core';\n` +
            '@Component({\n' +
            "    selector: 'app-card',\n" +
            '    template: \'<p-toast [life]="3000"></p-toast>\',\n' +
            "    providers: [{ provide: 'TPL', useValue: { template: '<p-toast showTransformOptions=\"x\"></p-toast>' } }]\n" +
            '})\n' +
            `export class CardComponent {}\n`;
        const tree = createAppTree({ '/src/app/card.component.ts': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/card.component.ts')).toBe(content);
    });

    it('does not rewrite a `template` property belonging to a non-Component decorator', async () => {
        const runner = createMigrationRunner();
        const content = `function CustomDecorator(config: { template: string }) {\n` + '    return () => {};\n' + '}\n\n' + '@CustomDecorator({ template: \'<p-toast showTransformOptions="x"></p-toast>\' })\n' + `export class NotAComponent {}\n`;
        const tree = createAppTree({ '/src/app/not-a-component.ts': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/not-a-component.ts')).toBe(content);
    });

    it('does not touch node_modules or dist', async () => {
        const runner = createMigrationRunner();
        const content = `<p-toast showTransformOptions="x"></p-toast>\n`;
        const tree = createAppTree({
            '/node_modules/pkg/tpl.html': content,
            '/dist/app/tpl.html': content
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/node_modules/pkg/tpl.html')).toBe(content);
        expect(result.readContent('/dist/app/tpl.html')).toBe(content);
    });

    it('reports nothing on a workspace with no usage of the removed inputs', async () => {
        const runner = createMigrationRunner();
        const infos: string[] = [];
        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'info') {
                infos.push(entry.message);
            } else if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });
        await runner.runSchematic('remove-dead-inputs', {}, createAppTree());
        expect(infos.join('\n')).toContain('No bindings for the removed inputs were found to remove.');
        expect(warnings.join('\n')).toBe('');
    });
});
