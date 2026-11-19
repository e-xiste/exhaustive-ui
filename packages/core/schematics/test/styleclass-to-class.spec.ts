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

    it('does not rewrite styleClass on p-panelmenu', async () => {
        const runner = createMigrationRunner();
        const content = `<p-panelmenu [model]="items" styleClass="my-menu"></p-panelmenu>\n`;
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
});
