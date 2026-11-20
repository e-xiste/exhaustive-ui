import { describe, expect, it } from 'vitest';
import { createAppTree, createMigrationRunner } from './helpers';

describe('styleclass-to-class', () => {
    it('rewrites a static styleClass to class when there is no existing class attribute', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toast styleClass="my-toast"></p-toast>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toast class="my-toast"></p-toast>\n`);
    });

    it('merges a static styleClass into an existing static class attribute', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toast class="existing" styleClass="my-toast"></p-toast>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toast class="existing my-toast"></p-toast>\n`);
    });

    it('rewrites an unquoted static styleClass to a quoted class when there is no existing class attribute', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toast styleClass=my-toast></p-toast>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toast class="my-toast"></p-toast>\n`);
    });

    it('merges a quoted static styleClass into an existing unquoted class attribute', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toast class=existing styleClass="my-toast"></p-toast>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toast class="existing my-toast"></p-toast>\n`);
    });

    it('merges an unquoted static styleClass into an existing quoted class attribute', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toast class="existing" styleClass=my-toast></p-toast>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toast class="existing my-toast"></p-toast>\n`);
    });

    it('rewrites a bound [styleClass] to [class] when there is no existing class binding', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toast [styleClass]="myClass"></p-toast>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toast [class]="myClass"></p-toast>\n`);
    });

    it('rewrites an unquoted bound [styleClass] to a quoted [class] when there is no existing class binding', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toast [styleClass]=myClass></p-toast>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toast [class]="myClass"></p-toast>\n`);
    });

    it('leaves [styleClass] in place and reports a conflict when [class] is already bound', async () => {
        const runner = createMigrationRunner();
        const content = `<p-toast [class]="otherClass" [styleClass]="myClass"></p-toast>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });

        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
        expect(warnings.join('\n')).toContain('/src/app/app.html:1');
    });

    it('does not rewrite styleClass text that only appears inside a different attribute value', async () => {
        const runner = createMigrationRunner();
        const content = `<p-toast aria-label='styleClass="do not edit"'></p-toast>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('does not touch styleClass on selectors outside MIGRATED_SELECTORS', async () => {
        const runner = createMigrationRunner();
        const content = `<p-button styleClass="my-button"></p-button>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('rewrites styleClass inside an inline component template', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/card.component.ts':
                `import { Component } from '@angular/core';\n` + '@Component({\n' + "    selector: 'app-card',\n" + '    template: `<p-toast styleClass="my-toast" [life]="3000"></p-toast>`\n' + '})\n' + `export class CardComponent {}\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        const ts = result.readContent('/src/app/card.component.ts');
        expect(ts).toContain('<p-toast class="my-toast" [life]="3000"></p-toast>');
        expect(ts).not.toContain('styleClass');
    });

    it('does not rewrite non-template string literals in TypeScript', async () => {
        const runner = createMigrationRunner();
        const content = `export const label = '<p-toast styleClass="x"></p-toast>';\n`;
        const tree = createAppTree({ '/src/app/config.ts': content });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/config.ts')).toBe(content);
    });

    it('rewrites styleClass inside a double-quoted inline template whose HTML attributes need escaped quotes', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/card.component.ts':
                `import { Component } from '@angular/core';\n` + '@Component({\n' + "    selector: 'app-card',\n" + '    template: "<p-toast styleClass=\\"my-toast\\" [life]=\\"3000\\"></p-toast>"\n' + '})\n' + `export class CardComponent {}\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        const ts = result.readContent('/src/app/card.component.ts');
        expect(ts).toContain('template: "<p-toast class=\\"my-toast\\" [life]=\\"3000\\"></p-toast>"');
        expect(ts).not.toContain('styleClass');
    });

    it('rewrites styleClass inside a single-quoted inline template whose HTML attributes need escaped quotes', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/card.component.ts':
                `import { Component } from '@angular/core';\n` + '@Component({\n' + "    selector: 'app-card',\n" + "    template: '<p-toast styleClass=\\'my-toast\\' [life]=\\'3000\\'></p-toast>'\n" + '})\n' + `export class CardComponent {}\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        const ts = result.readContent('/src/app/card.component.ts');
        expect(ts).toContain("template: '<p-toast class=\\'my-toast\\' [life]=\\'3000\\'></p-toast>'");
        expect(ts).not.toContain('styleClass');
    });

    it('does not rewrite a `template` property nested inside providers metadata', async () => {
        const runner = createMigrationRunner();
        const content =
            `import { Component } from '@angular/core';\n` +
            '@Component({\n' +
            "    selector: 'app-card',\n" +
            "    template: '<p-toast></p-toast>',\n" +
            "    providers: [{ provide: 'TPL', useValue: { template: '<p-toast styleClass=\"x\"></p-toast>' } }]\n" +
            '})\n' +
            `export class CardComponent {}\n`;
        const tree = createAppTree({ '/src/app/card.component.ts': content });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/card.component.ts')).toBe(content);
    });

    it('does not rewrite a `template` property belonging to a non-Component decorator', async () => {
        const runner = createMigrationRunner();
        const content = `function CustomDecorator(config: { template: string }) {\n` + '    return () => {};\n' + '}\n\n' + '@CustomDecorator({ template: \'<p-toast styleClass="x"></p-toast>\' })\n' + `export class NotAComponent {}\n`;
        const tree = createAppTree({ '/src/app/not-a-component.ts': content });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/not-a-component.ts')).toBe(content);
    });

    it('does not touch node_modules or dist', async () => {
        const runner = createMigrationRunner();
        const content = `<p-toast styleClass="x"></p-toast>\n`;
        const tree = createAppTree({
            '/node_modules/pkg/tpl.html': content,
            '/dist/app/tpl.html': content
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/node_modules/pkg/tpl.html')).toBe(content);
        expect(result.readContent('/dist/app/tpl.html')).toBe(content);
    });

    it('rewrites a static styleClass to class on p-message', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-message severity="error" styleClass="my-message"></p-message>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-message severity="error" class="my-message"></p-message>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-message', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-message [styleClass]="myClass"></p-message>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-message [class]="myClass"></p-message>\n`);
    });

    it('rewrites a static styleClass to class on p-tag', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-tag severity="success" styleClass="my-tag"></p-tag>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-tag severity="success" class="my-tag"></p-tag>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-tag', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-tag [styleClass]="myClass"></p-tag>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-tag [class]="myClass"></p-tag>\n`);
    });

    it('merges styleClass into an existing static class on p-tag', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-tag class="existing" styleClass="my-tag"></p-tag>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-tag class="existing my-tag"></p-tag>\n`);
    });

    it('rewrites a static styleClass to class on p-skeleton', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-skeleton width="10rem" styleClass="mb-2"></p-skeleton>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-skeleton width="10rem" class="mb-2"></p-skeleton>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-skeleton', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-skeleton [styleClass]="myClass"></p-skeleton>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-skeleton [class]="myClass"></p-skeleton>\n`);
    });

    it('merges styleClass into an existing static class on p-skeleton', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-skeleton class="existing" styleClass="mb-2"></p-skeleton>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-skeleton class="existing mb-2"></p-skeleton>\n`);
    });

    it('rewrites a static styleClass to class on p-card', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-card header="Title" styleClass="my-card"></p-card>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-card header="Title" class="my-card"></p-card>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-card', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-card [styleClass]="myClass"></p-card>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-card [class]="myClass"></p-card>\n`);
    });

    it('merges styleClass into an existing static class on p-card', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-card class="flex-1" styleClass="border shadow-none"></p-card>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-card class="flex-1 border shadow-none"></p-card>\n`);
    });

    it('rewrites a static styleClass to class on p-radiobutton', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-radiobutton name="group" styleClass="my-radio"></p-radiobutton>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-radiobutton name="group" class="my-radio"></p-radiobutton>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-radiobutton', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-radiobutton [styleClass]="myClass"></p-radiobutton>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-radiobutton [class]="myClass"></p-radiobutton>\n`);
    });

    it('merges styleClass into an existing static class on p-radiobutton', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-radiobutton class="existing" styleClass="my-radio"></p-radiobutton>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-radiobutton class="existing my-radio"></p-radiobutton>\n`);
    });

    it('rewrites styleClass on the p-radioButton and p-radio-button aliases', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-radioButton styleClass="a"></p-radioButton>\n<p-radio-button [styleClass]="b"></p-radio-button>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-radioButton class="a"></p-radioButton>\n<p-radio-button [class]="b"></p-radio-button>\n`);
    });

    it('rewrites a static styleClass to class on p-progressbar', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-progressbar [value]="50" styleClass="h-1"></p-progressbar>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-progressbar [value]="50" class="h-1"></p-progressbar>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-progressBar and p-progress-bar', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-progressBar [styleClass]="barClass"></p-progressBar>\n<p-progress-bar [styleClass]="otherClass" />\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-progressBar [class]="barClass"></p-progressBar>\n<p-progress-bar [class]="otherClass" />\n`);
    });

    it('merges styleClass into an existing static class on p-progressbar in an inline template', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.ts': `@Component({ template: \`<p-progressbar class="w-full" styleClass="!h-1.5 !rounded-full" />\` })\nexport class App {}\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.ts')).toBe(`@Component({ template: \`<p-progressbar class="w-full !h-1.5 !rounded-full" />\` })\nexport class App {}\n`);
    });

    it('rewrites a static styleClass to class on p-divider', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-divider layout="vertical" styleClass="m-0"></p-divider>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-divider layout="vertical" class="m-0"></p-divider>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-divider', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-divider [styleClass]="myClass"></p-divider>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-divider [class]="myClass"></p-divider>\n`);
    });

    it('merges styleClass into an existing static class on p-divider', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-divider class="existing" styleClass="m-0"></p-divider>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-divider class="existing m-0"></p-divider>\n`);
    });

    it('rewrites a static styleClass to class on p-progressspinner', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-progressspinner strokeWidth="4" styleClass="my-spinner"></p-progressspinner>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-progressspinner strokeWidth="4" class="my-spinner"></p-progressspinner>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-progressspinner', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-progressspinner [styleClass]="myClass"></p-progressspinner>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-progressspinner [class]="myClass"></p-progressspinner>\n`);
    });

    it('merges styleClass into an existing static class on p-progressspinner', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-progressspinner class="existing" styleClass="my-spinner"></p-progressspinner>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-progressspinner class="existing my-spinner"></p-progressspinner>\n`);
    });

    it('rewrites styleClass on the p-progressSpinner and p-progress-spinner aliases', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-progressSpinner styleClass="a"></p-progressSpinner>\n<p-progress-spinner [styleClass]="b"></p-progress-spinner>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-progressSpinner class="a"></p-progressSpinner>\n<p-progress-spinner [class]="b"></p-progress-spinner>\n`);
    });

    it('rewrites a static styleClass to class on p-timeline', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-timeline [value]="events" align="alternate" styleClass="customized-timeline"></p-timeline>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-timeline [value]="events" align="alternate" class="customized-timeline"></p-timeline>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-timeline', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-timeline [value]="events" [styleClass]="myClass"></p-timeline>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-timeline [value]="events" [class]="myClass"></p-timeline>\n`);
    });

    it('merges styleClass into an existing static class on p-timeline', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-timeline class="existing" styleClass="customized-timeline"></p-timeline>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-timeline class="existing customized-timeline"></p-timeline>\n`);
    });

    it('rewrites a static styleClass to class on p-toolbar', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toolbar styleClass="my-toolbar"></p-toolbar>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toolbar class="my-toolbar"></p-toolbar>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-toolbar', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toolbar [styleClass]="myClass"></p-toolbar>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toolbar [class]="myClass"></p-toolbar>\n`);
    });

    it('merges styleClass into an existing static class on p-toolbar', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toolbar class="existing" styleClass="my-toolbar"></p-toolbar>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toolbar class="existing my-toolbar"></p-toolbar>\n`);
    });

    it('rewrites a static styleClass to class on p-chip', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-chip label="Action" styleClass="my-chip"></p-chip>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-chip label="Action" class="my-chip"></p-chip>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-chip', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-chip [styleClass]="myClass"></p-chip>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-chip [class]="myClass"></p-chip>\n`);
    });

    it('merges styleClass into an existing static class on p-chip', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-chip class="existing" styleClass="my-chip"></p-chip>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-chip class="existing my-chip"></p-chip>\n`);
    });

    it('rewrites a static styleClass to class on p-avatar', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-avatar label="JD" styleClass="my-avatar"></p-avatar>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-avatar label="JD" class="my-avatar"></p-avatar>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-avatar', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-avatar [styleClass]="myClass"></p-avatar>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-avatar [class]="myClass"></p-avatar>\n`);
    });

    it('rewrites a static styleClass to class on p-toggleswitch', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toggleswitch styleClass="my-toggle"></p-toggleswitch>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toggleswitch class="my-toggle"></p-toggleswitch>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-toggleswitch', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toggleswitch [styleClass]="myClass"></p-toggleswitch>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toggleswitch [class]="myClass"></p-toggleswitch>\n`);
    });

    it('rewrites styleClass on ToggleSwitch selector aliases', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toggleSwitch styleClass="camel"></p-toggleSwitch>\n<p-toggle-switch styleClass="kebab"></p-toggle-switch>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toggleSwitch class="camel"></p-toggleSwitch>\n<p-toggle-switch class="kebab"></p-toggle-switch>\n`);
    });

    it('rewrites styleClass on p-colorpicker', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-colorpicker [styleClass]="myClass"></p-colorpicker>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-colorpicker [class]="myClass"></p-colorpicker>\n`);
    });

    it('merges styleClass into an existing static class on p-colorpicker', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-colorpicker class="existing" styleClass="my-colorpicker"></p-colorpicker>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-colorpicker class="existing my-colorpicker"></p-colorpicker>\n`);
    });

    it('rewrites styleClass on the p-colorPicker and p-color-picker aliases', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-colorPicker styleClass="a"></p-colorPicker>\n<p-color-picker [styleClass]="b"></p-color-picker>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-colorPicker class="a"></p-colorPicker>\n<p-color-picker [class]="b"></p-color-picker>\n`);
    });

    it('rewrites a static styleClass to class on p-togglebutton', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-togglebutton styleClass="my-toggle"></p-togglebutton>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-togglebutton class="my-toggle"></p-togglebutton>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-togglebutton', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-togglebutton [styleClass]="myClass"></p-togglebutton>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-togglebutton [class]="myClass"></p-togglebutton>\n`);
    });

    it('rewrites styleClass on the p-toggleButton and p-toggle-button aliases', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toggleButton styleClass="a"></p-toggleButton>\n<p-toggle-button [styleClass]="b"></p-toggle-button>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toggleButton class="a"></p-toggleButton>\n<p-toggle-button [class]="b"></p-toggle-button>\n`);
    });

    it('switches quotes when the merged class value contains the existing class quote character', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-chip class='a' styleClass="it's"></p-chip>\n<p-chip class=b styleClass='say-"hi"'></p-chip>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-chip class="a it's"></p-chip>\n<p-chip class='b say-"hi"'></p-chip>\n`);
    });

    it('leaves styleClass in place and reports a conflict when the merged class value contains both quote characters', async () => {
        const runner = createMigrationRunner();
        const content = `<p-chip label="x"\n    class='it"s' styleClass="it's"></p-chip>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });

        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
        expect(warnings.join('\n')).toContain('/src/app/app.html:1');
    });

    it('rewrites a static styleClass to class on p-inputgroup', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-inputgroup styleClass="my-group"></p-inputgroup>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-inputgroup class="my-group"></p-inputgroup>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-inputgroup', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-inputgroup [styleClass]="myClass"></p-inputgroup>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-inputgroup [class]="myClass"></p-inputgroup>\n`);
    });

    it('merges styleClass into an existing static class on p-inputgroup', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-inputgroup class="existing" styleClass="my-group"></p-inputgroup>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-inputgroup class="existing my-group"></p-inputgroup>\n`);
    });

    it('rewrites styleClass on the p-inputGroup and p-input-group aliases', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-inputGroup styleClass="a"></p-inputGroup>\n<p-input-group [styleClass]="b"></p-input-group>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-inputGroup class="a"></p-inputGroup>\n<p-input-group [class]="b"></p-input-group>\n`);
    });

    it('rewrites a static styleClass to class on p-iconfield', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-iconfield styleClass="my-field"><input /></p-iconfield>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-iconfield class="my-field"><input /></p-iconfield>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-iconfield', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-iconfield [styleClass]="myClass"><input /></p-iconfield>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-iconfield [class]="myClass"><input /></p-iconfield>\n`);
    });

    it('rewrites styleClass on the p-iconField and p-icon-field aliases', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-iconField styleClass="a"></p-iconField>\n<p-icon-field [styleClass]="b"></p-icon-field>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-iconField class="a"></p-iconField>\n<p-icon-field [class]="b"></p-icon-field>\n`);
    });

    it('merges styleClass into an existing static class on p-inputicon', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-inputicon class="pi pi-search" styleClass="my-icon" />\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-inputicon class="pi pi-search my-icon" />\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-inputicon', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-inputicon [styleClass]="myClass" />\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-inputicon [class]="myClass" />\n`);
    });

    it('rewrites styleClass on the p-inputIcon alias', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-inputIcon styleClass="a"></p-inputIcon>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-inputIcon class="a"></p-inputIcon>\n`);
    });

    it('rewrites a static styleClass to class on p-metergroup', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-metergroup styleClass="my-meter"></p-metergroup>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-metergroup class="my-meter"></p-metergroup>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-metergroup', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-metergroup [styleClass]="myClass"></p-metergroup>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-metergroup [class]="myClass"></p-metergroup>\n`);
    });

    it('merges styleClass into an existing static class on p-metergroup', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-metergroup class="existing" styleClass="my-meter"></p-metergroup>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-metergroup class="existing my-meter"></p-metergroup>\n`);
    });

    it('rewrites styleClass on the p-meterGroup and p-meter-group aliases', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-meterGroup styleClass="a"></p-meterGroup>\n<p-meter-group [styleClass]="b"></p-meter-group>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-meterGroup class="a"></p-meterGroup>\n<p-meter-group [class]="b"></p-meter-group>\n`);
    });

    it('rewrites a static styleClass to class on p-inplace', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-inplace styleClass="my-inplace"></p-inplace>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-inplace class="my-inplace"></p-inplace>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-inplace', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-inplace [styleClass]="myClass"></p-inplace>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-inplace [class]="myClass"></p-inplace>\n`);
    });

    it('merges styleClass into an existing static class on p-inplace', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-inplace class="existing" styleClass="my-inplace"></p-inplace>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-inplace class="existing my-inplace"></p-inplace>\n`);
    });

    it('rewrites a static styleClass to class on p-terminal', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-terminal welcomeMessage="Welcome" prompt="$ " styleClass="my-terminal"></p-terminal>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-terminal welcomeMessage="Welcome" prompt="$ " class="my-terminal"></p-terminal>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-terminal', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-terminal [styleClass]="myClass"></p-terminal>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-terminal [class]="myClass"></p-terminal>\n`);
    });

    it('merges styleClass into an existing static class on p-terminal', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-terminal class="existing" styleClass="my-terminal"></p-terminal>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-terminal class="existing my-terminal"></p-terminal>\n`);
    });

    it('rewrites a static styleClass to class on p-blockui', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-blockui styleClass="my-blockui"></p-blockui>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-blockui class="my-blockui"></p-blockui>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-blockui', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-blockui [styleClass]="myClass"></p-blockui>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-blockui [class]="myClass"></p-blockui>\n`);
    });

    it('merges styleClass into an existing static class on p-blockui', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-blockui class="existing" styleClass="my-blockui"></p-blockui>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-blockui class="existing my-blockui"></p-blockui>\n`);
    });

    it('rewrites styleClass on the p-blockUI and p-block-ui aliases', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-blockUI styleClass="a"></p-blockUI>\n<p-block-ui [styleClass]="b"></p-block-ui>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-blockUI class="a"></p-blockUI>\n<p-block-ui [class]="b"></p-block-ui>\n`);
    });

    it('rewrites a static styleClass to class on p-badge', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-badge value="2" severity="danger" styleClass="my-badge"></p-badge>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-badge value="2" severity="danger" class="my-badge"></p-badge>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-badge', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-badge [styleClass]="item.badgeStyleClass" [value]="item.badge" />\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-badge [class]="item.badgeStyleClass" [value]="item.badge" />\n`);
    });

    it('merges styleClass into an existing static class on p-badge', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-badge class="existing" styleClass="my-badge"></p-badge>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-badge class="existing my-badge"></p-badge>\n`);
    });

    it('rewrites a static styleClass to class on p-checkbox', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-checkbox styleClass="my-checkbox"></p-checkbox>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-checkbox class="my-checkbox"></p-checkbox>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-checkbox', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-checkbox [styleClass]="myClass"></p-checkbox>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-checkbox [class]="myClass"></p-checkbox>\n`);
    });

    it('merges styleClass into an existing static class on p-checkbox', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-checkbox class="existing" styleClass="my-checkbox"></p-checkbox>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-checkbox class="existing my-checkbox"></p-checkbox>\n`);
    });

    it('rewrites styleClass on the p-checkBox and p-check-box aliases', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-checkBox styleClass="a"></p-checkBox>\n<p-check-box [styleClass]="b"></p-check-box>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-checkBox class="a"></p-checkBox>\n<p-check-box [class]="b"></p-check-box>\n`);
    });

    it('rewrites a static styleClass to class on p-panel', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-panel header="Header" styleClass="my-panel"></p-panel>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-panel header="Header" class="my-panel"></p-panel>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-panel', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-panel [styleClass]="myClass" [toggleable]="true"></p-panel>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-panel [class]="myClass" [toggleable]="true"></p-panel>\n`);
    });

    it('merges styleClass into an existing static class on p-panel', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-panel class="existing" styleClass="my-panel"></p-panel>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-panel class="existing my-panel"></p-panel>\n`);
    });

    it('does not rewrite styleClass on p-menu', async () => {
        const runner = createMigrationRunner();
        const content = `<p-menu [model]="items" styleClass="my-menu"></p-menu>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('rewrites a static styleClass to class on p-dock', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-dock [model]="items" position="top" styleClass="my-dock"></p-dock>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-dock [model]="items" position="top" class="my-dock"></p-dock>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-dock', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-dock [model]="items" [styleClass]="dockClass"></p-dock>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-dock [model]="items" [class]="dockClass"></p-dock>\n`);
    });

    it('merges styleClass into an existing static class on p-dock', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-dock class="existing" styleClass="my-dock"></p-dock>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-dock class="existing my-dock"></p-dock>\n`);
    });

    it('rewrites a static styleClass to class on p-accordion', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-accordion value="0" styleClass="my-accordion"></p-accordion>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-accordion value="0" class="my-accordion"></p-accordion>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-accordion', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-accordion [styleClass]="accordionClass" [(value)]="active"></p-accordion>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-accordion [class]="accordionClass" [(value)]="active"></p-accordion>\n`);
    });

    it('merges styleClass into an existing static class on p-accordion', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-accordion class="existing" styleClass="my-accordion"></p-accordion>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-accordion class="existing my-accordion"></p-accordion>\n`);
    });

    it('rewrites a static styleClass to class on p-knob', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-knob [(ngModel)]="value" [size]="150" styleClass="pointer-events-none"></p-knob>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-knob [(ngModel)]="value" [size]="150" class="pointer-events-none"></p-knob>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-knob', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-knob [(ngModel)]="value" [styleClass]="myClass"></p-knob>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-knob [(ngModel)]="value" [class]="myClass"></p-knob>\n`);
    });

    it('merges styleClass into an existing static class on p-knob', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-knob class="existing" styleClass="my-knob"></p-knob>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-knob class="existing my-knob"></p-knob>\n`);
    });

    it('rewrites a static styleClass to class on p-splitter', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-splitter styleClass="my-splitter"></p-splitter>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-splitter class="my-splitter"></p-splitter>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-splitter', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-splitter [styleClass]="myClass"></p-splitter>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-splitter [class]="myClass"></p-splitter>\n`);
    });

    it('merges styleClass into an existing static class on p-splitter', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-splitter class="existing" styleClass="my-splitter"></p-splitter>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-splitter class="existing my-splitter"></p-splitter>\n`);
    });

    it('rewrites a static styleClass to class on p-scrollpanel', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-scrollpanel [style]="{ height: '200px' }" styleClass="my-panel"><p>content</p></p-scrollpanel>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-scrollpanel [style]="{ height: '200px' }" class="my-panel"><p>content</p></p-scrollpanel>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-scrollPanel and p-scroll-panel', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-scrollPanel [styleClass]="panelClass"></p-scrollPanel>\n<p-scroll-panel [styleClass]="panelClass"></p-scroll-panel>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-scrollPanel [class]="panelClass"></p-scrollPanel>\n<p-scroll-panel [class]="panelClass"></p-scroll-panel>\n`);
    });

    it('merges styleClass into an existing static class on p-scrollpanel', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-scrollpanel class="existing" styleClass="my-panel"></p-scrollpanel>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-scrollpanel class="existing my-panel"></p-scrollpanel>\n`);
    });

    it('rewrites a static styleClass to class on p-image', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-image src="image.jpg" alt="Image" width="250" styleClass="my-image"></p-image>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-image src="image.jpg" alt="Image" width="250" class="my-image"></p-image>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-image', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-image [src]="src" [preview]="true" [styleClass]="imageClass"></p-image>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-image [src]="src" [preview]="true" [class]="imageClass"></p-image>\n`);
    });

    it('merges styleClass into an existing static class on p-image', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-image class="existing" styleClass="my-image"></p-image>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-image class="existing my-image"></p-image>\n`);
    });

    it('rewrites a static styleClass to class on p-editor', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-editor [(ngModel)]="text" styleClass="my-editor" [style]="{ height: '320px' }"></p-editor>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-editor [(ngModel)]="text" class="my-editor" [style]="{ height: '320px' }"></p-editor>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-editor', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-editor [(ngModel)]="text" [styleClass]="editorClass"></p-editor>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-editor [(ngModel)]="text" [class]="editorClass"></p-editor>\n`);
    });

    it('merges styleClass into an existing static class on p-editor', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-editor class="existing" styleClass="my-editor"></p-editor>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-editor class="existing my-editor"></p-editor>\n`);
    });

    it('rewrites a static styleClass to class on p-slider', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-slider formControlName="value" styleClass="w-56" />\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-slider formControlName="value" class="w-56" />\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-slider', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-slider [(ngModel)]="value" [styleClass]="myClass"></p-slider>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-slider [(ngModel)]="value" [class]="myClass"></p-slider>\n`);
    });

    it('merges styleClass into an existing static class on p-slider', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-slider class="existing" styleClass="my-slider"></p-slider>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-slider class="existing my-slider"></p-slider>\n`);
    });

    it('rewrites a static styleClass to class on p-paginator', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-paginator [rows]="10" [totalRecords]="120" styleClass="my-paginator"></p-paginator>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-paginator [rows]="10" [totalRecords]="120" class="my-paginator"></p-paginator>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-paginator', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-paginator [rows]="10" [totalRecords]="120" [styleClass]="myClass"></p-paginator>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-paginator [rows]="10" [totalRecords]="120" [class]="myClass"></p-paginator>\n`);
    });

    it('merges styleClass into an existing static class on p-paginator', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-paginator class="existing" styleClass="my-paginator"></p-paginator>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-paginator class="existing my-paginator"></p-paginator>\n`);
    });

    it('rewrites a static styleClass to class on p-organizationchart', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-organizationchart [value]="data" styleClass="my-chart"></p-organizationchart>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-organizationchart [value]="data" class="my-chart"></p-organizationchart>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-organizationChart', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-organizationChart [value]="data" [collapsible]="true" [styleClass]="chartClass"></p-organizationChart>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-organizationChart [value]="data" [collapsible]="true" [class]="chartClass"></p-organizationChart>\n`);
    });

    it('merges styleClass into an existing static class on p-organization-chart', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-organization-chart class="existing" styleClass="my-chart" [value]="data"></p-organization-chart>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-organization-chart class="existing my-chart" [value]="data"></p-organization-chart>\n`);
    });

    it('rewrites a static styleClass to class on p-carousel', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-carousel [value]="products" [numVisible]="3" styleClass="my-carousel"></p-carousel>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-carousel [value]="products" [numVisible]="3" class="my-carousel"></p-carousel>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-carousel', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-carousel [value]="products" [styleClass]="carouselClass"></p-carousel>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-carousel [value]="products" [class]="carouselClass"></p-carousel>\n`);
    });

    it('merges styleClass into an existing static class on p-carousel', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-carousel class="existing" styleClass="my-carousel"></p-carousel>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-carousel class="existing my-carousel"></p-carousel>\n`);
    });

    it('rewrites a static styleClass to class on p-dataview', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-dataview [value]="products" styleClass="my-dataview" [paginator]="true" [rows]="5"></p-dataview>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-dataview [value]="products" class="my-dataview" [paginator]="true" [rows]="5"></p-dataview>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-dataView and p-data-view', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-dataView [value]="products" [styleClass]="dataviewClass"></p-dataView>\n<p-data-view [value]="products" [styleClass]="dataviewClass"></p-data-view>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-dataView [value]="products" [class]="dataviewClass"></p-dataView>\n<p-data-view [value]="products" [class]="dataviewClass"></p-data-view>\n`);
    });

    it('merges styleClass into an existing static class on p-dataview', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-dataview class="existing" styleClass="my-dataview"></p-dataview>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-dataview class="existing my-dataview"></p-dataview>\n`);
    });

    it('rewrites a static styleClass to class on p-splitbutton', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-splitbutton label="Save" [model]="items" styleClass="my-splitbutton"></p-splitbutton>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-splitbutton label="Save" [model]="items" class="my-splitbutton"></p-splitbutton>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-splitButton and p-split-button', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-splitButton label="Save" [model]="items" [styleClass]="myClass"></p-splitButton>\n<p-split-button [model]="items" [styleClass]="myClass" [menuStyleClass]="menuClass"></p-split-button>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-splitButton label="Save" [model]="items" [class]="myClass"></p-splitButton>\n<p-split-button [model]="items" [class]="myClass" [menuStyleClass]="menuClass"></p-split-button>\n`);
    });

    it('merges styleClass into an existing static class on p-splitbutton', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-splitbutton class="existing" styleClass="my-splitbutton"></p-splitbutton>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-splitbutton class="existing my-splitbutton"></p-splitbutton>\n`);
    });

    it('rewrites a static styleClass to class on p-password', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-password [(ngModel)]="value" styleClass="my-password"></p-password>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-password [(ngModel)]="value" class="my-password"></p-password>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-password', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-password [(ngModel)]="value" [toggleMask]="true" [styleClass]="passwordClass"></p-password>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-password [(ngModel)]="value" [toggleMask]="true" [class]="passwordClass"></p-password>\n`);
    });

    it('merges styleClass into an existing static class on p-password', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-password class="existing" styleClass="my-password" [(ngModel)]="value"></p-password>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-password class="existing my-password" [(ngModel)]="value"></p-password>\n`);
    });

    it('rewrites a static styleClass to class on p-inputnumber', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-inputnumber [(ngModel)]="value" styleClass="my-inputnumber"></p-inputnumber>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-inputnumber [(ngModel)]="value" class="my-inputnumber"></p-inputnumber>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-inputNumber', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-inputNumber [(ngModel)]="value" [showButtons]="true" [styleClass]="inputNumberClass"></p-inputNumber>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-inputNumber [(ngModel)]="value" [showButtons]="true" [class]="inputNumberClass"></p-inputNumber>\n`);
    });

    it('merges styleClass into an existing static class on p-input-number', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-input-number class="existing" styleClass="my-inputnumber" [(ngModel)]="value"></p-input-number>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-input-number class="existing my-inputnumber" [(ngModel)]="value"></p-input-number>\n`);
    });

    it('rewrites a static styleClass to class on p-menubar', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-menubar [model]="items" styleClass="my-menubar"></p-menubar>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-menubar [model]="items" class="my-menubar"></p-menubar>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-menubar', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-menubar [model]="items" [styleClass]="menubarClass" [autoDisplay]="false"></p-menubar>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-menubar [model]="items" [class]="menubarClass" [autoDisplay]="false"></p-menubar>\n`);
    });

    it('merges styleClass into an existing static class on p-menubar', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-menubar class="existing" styleClass="my-menubar"></p-menubar>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-menubar class="existing my-menubar"></p-menubar>\n`);
    });

    it('rewrites a static styleClass to class on p-panelmenu', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-panelmenu [model]="items" styleClass="w-full md:w-80" [multiple]="true"></p-panelmenu>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-panelmenu [model]="items" class="w-full md:w-80" [multiple]="true"></p-panelmenu>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-panelMenu and p-panel-menu', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-panelMenu [model]="items" [styleClass]="menuClass"></p-panelMenu>\n<p-panel-menu [model]="items" styleClass="my-menu"></p-panel-menu>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-panelMenu [model]="items" [class]="menuClass"></p-panelMenu>\n<p-panel-menu [model]="items" class="my-menu"></p-panel-menu>\n`);
    });

    it('merges styleClass into an existing static class on p-panelmenu', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-panelmenu class="existing" styleClass="my-menu" [model]="items"></p-panelmenu>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-panelmenu class="existing my-menu" [model]="items"></p-panelmenu>\n`);
    });

    it('rewrites a static styleClass to class on p-megamenu', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-megamenu [model]="items" styleClass="my-megamenu"></p-megamenu>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-megamenu [model]="items" class="my-megamenu"></p-megamenu>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-megaMenu and p-mega-menu', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-megaMenu [model]="items" [styleClass]="menuClass"></p-megaMenu>\n<p-mega-menu orientation="vertical" [styleClass]="menuClass"></p-mega-menu>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-megaMenu [model]="items" [class]="menuClass"></p-megaMenu>\n<p-mega-menu orientation="vertical" [class]="menuClass"></p-mega-menu>\n`);
    });

    it('merges styleClass into an existing static class on p-megamenu', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-megamenu class="existing" styleClass="my-megamenu" [model]="items"></p-megamenu>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-megamenu class="existing my-megamenu" [model]="items"></p-megamenu>\n`);
    });

    it('rewrites a static styleClass to class on p-cascadeselect', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-cascadeselect [(ngModel)]="city" [options]="countries" styleClass="my-cascadeselect"></p-cascadeselect>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-cascadeselect [(ngModel)]="city" [options]="countries" class="my-cascadeselect"></p-cascadeselect>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-cascadeSelect', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-cascadeSelect [options]="countries" [styleClass]="cascadeClass" [showClear]="true"></p-cascadeSelect>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-cascadeSelect [options]="countries" [class]="cascadeClass" [showClear]="true"></p-cascadeSelect>\n`);
    });

    it('merges styleClass into an existing static class on p-cascade-select', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-cascade-select class="existing" styleClass="my-cascadeselect" [options]="countries"></p-cascade-select>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-cascade-select class="existing my-cascadeselect" [options]="countries"></p-cascade-select>\n`);
    });

    it('reports nothing on a workspace with no usage of styleClass on the migrated selectors', async () => {
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
        await runner.runSchematic('styleclass-to-class', {}, createAppTree());
        expect(infos.join('\n')).toContain('No usages of styleClass on the migrated selectors were found to rewrite.');
        expect(warnings.join('\n')).toBe('');
    });

    it('rewrites a static styleClass to class on p-datepicker', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-datepicker [(ngModel)]="date" styleClass="my-datepicker"></p-datepicker>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-datepicker [(ngModel)]="date" class="my-datepicker"></p-datepicker>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-datePicker and p-date-picker', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-datePicker [(ngModel)]="date" [styleClass]="pickerClass"></p-datePicker>\n<p-date-picker inline [styleClass]="pickerClass"></p-date-picker>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-datePicker [(ngModel)]="date" [class]="pickerClass"></p-datePicker>\n<p-date-picker inline [class]="pickerClass"></p-date-picker>\n`);
    });

    it('merges styleClass into an existing static class on p-datepicker', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-datepicker class="existing" styleClass="my-datepicker" [showIcon]="true"></p-datepicker>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-datepicker class="existing my-datepicker" [showIcon]="true"></p-datepicker>\n`);
    });

    it('rewrites a static styleClass to class on p-tree', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-tree [value]="files" styleClass="w-full md:w-120"></p-tree>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-tree [value]="files" class="w-full md:w-120"></p-tree>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-tree but leaves p-treetable and p-treeNode alone', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-tree [value]="files" [styleClass]="treeClass"></p-tree>\n<p-treetable [value]="files" styleClass="table"></p-treetable>\n<p-treeNode styleClass="node"></p-treeNode>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-tree [value]="files" [class]="treeClass"></p-tree>\n<p-treetable [value]="files" styleClass="table"></p-treetable>\n<p-treeNode styleClass="node"></p-treeNode>\n`);
    });

    it('merges styleClass into an existing static class on p-tree', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-tree class="existing" styleClass="my-tree" [value]="files"></p-tree>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-tree class="existing my-tree" [value]="files"></p-tree>\n`);
    });

    it('rewrites a static styleClass to class on p-select', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-select [options]="cities" [(ngModel)]="city" styleClass="w-full md:w-56"></p-select>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-select [options]="cities" [(ngModel)]="city" class="w-full md:w-56"></p-select>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-select', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-select [options]="cities" optionLabel="name" [styleClass]="selectClass"></p-select>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-select [options]="cities" optionLabel="name" [class]="selectClass"></p-select>\n`);
    });

    it('merges styleClass into an existing static class on p-select', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-select class="existing" styleClass="w-full" [options]="cities"></p-select>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-select class="existing w-full" [options]="cities"></p-select>\n`);
    });

    it('leaves styleClass on p-selectbutton and p-select-button untouched while rewriting p-select', async () => {
        const runner = createMigrationRunner();
        const content = `<p-selectbutton [options]="states" styleClass="keep"></p-selectbutton>\n<p-select-button [options]="states" [styleClass]="keepClass"></p-select-button>\n<p-select [options]="cities" styleClass="rewrite"></p-select>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(
            `<p-selectbutton [options]="states" styleClass="keep"></p-selectbutton>\n<p-select-button [options]="states" [styleClass]="keepClass"></p-select-button>\n<p-select [options]="cities" class="rewrite"></p-select>\n`
        );
    });

    it('rewrites a static styleClass to class on p-listbox', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-listbox [options]="cities" styleClass="w-full md:w-56"></p-listbox>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-listbox [options]="cities" class="w-full md:w-56"></p-listbox>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-listBox and p-list-box', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-listBox [options]="cities" [styleClass]="listClass"></p-listBox>\n<p-list-box [multiple]="true" [styleClass]="listClass"></p-list-box>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-listBox [options]="cities" [class]="listClass"></p-listBox>\n<p-list-box [multiple]="true" [class]="listClass"></p-list-box>\n`);
    });

    it('merges styleClass into an existing static class on p-listbox', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-listbox class="existing" styleClass="my-listbox" [options]="cities"></p-listbox>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-listbox class="existing my-listbox" [options]="cities"></p-listbox>\n`);
    });

    it('rewrites a static styleClass to class on p-orderlist', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-orderlist [value]="products" styleClass="w-full"></p-orderlist>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-orderlist [value]="products" class="w-full"></p-orderlist>\n`);
    });

    it('rewrites a bound [styleClass] to [class] on p-orderList and p-order-list', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-orderList [value]="products" [styleClass]="listClass"></p-orderList>\n<p-order-list [dragdrop]="true" [styleClass]="listClass"></p-order-list>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-orderList [value]="products" [class]="listClass"></p-orderList>\n<p-order-list [dragdrop]="true" [class]="listClass"></p-order-list>\n`);
    });

    it('merges styleClass into an existing static class on p-orderlist', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-orderlist class="existing" styleClass="my-orderlist" [value]="products"></p-orderlist>\n`
        });
        const result = await runner.runSchematic('styleclass-to-class', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-orderlist class="existing my-orderlist" [value]="products"></p-orderlist>\n`);
    });
});
