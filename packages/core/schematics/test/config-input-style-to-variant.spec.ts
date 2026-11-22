import { describe, expect, it } from 'vitest';
import { createAppTree, createMigrationRunner } from './helpers';

async function run(files: Record<string, string>) {
    const runner = createMigrationRunner();
    const warnings: string[] = [];
    runner.logger.subscribe((entry) => {
        if (entry.level === 'warn') {
            warnings.push(entry.message);
        }
    });
    const result = await runner.runSchematic('config-input-style-to-variant', {}, createAppTree(files));
    return { read: (path: string) => result.readContent(path), warnings: warnings.join('\n') };
}

describe('config-input-style-to-variant', () => {
    it('renames inputStyle in provideExhaustive() and setConfig() config objects', async () => {
        const { read } = await run({
            '/src/app/app.config.ts': `import { provideExhaustive } from '@exhaustive-ui/core/config';\n\nexport const appConfig = {\n    providers: [provideExhaustive({ ripple: true, inputStyle: 'filled' })]\n};\n`,
            '/src/app/setup.ts': `import { Exhaustive } from '@exhaustive-ui/core/config';\n\nexport function setup(config: Exhaustive, inputStyle: 'filled' | 'outlined') {\n    config.setConfig({ inputStyle });\n    config.setConfig({ 'inputStyle': 'outlined' });\n}\n`
        });
        expect(read('/src/app/app.config.ts')).toContain(`provideExhaustive({ ripple: true, inputVariant: 'filled' })`);
        const setup = read('/src/app/setup.ts');
        expect(setup).toContain('config.setConfig({ inputVariant: inputStyle });');
        expect(setup).toContain(`config.setConfig({ 'inputVariant': 'outlined' });`);
    });

    it('renames reads and writes of the Exhaustive signal', async () => {
        const { read } = await run({
            '/src/app/app.component.ts': `import { inject } from '@angular/core';\nimport { Exhaustive } from '@exhaustive-ui/core/config';\n\nexport class AppComponent {\n    config = inject(Exhaustive);\n\n    toggle() {\n        this.config.inputStyle.set(this.config.inputStyle() === 'filled' ? 'outlined' : 'filled');\n    }\n}\n`
        });
        expect(read('/src/app/app.component.ts')).toContain(`this.config.inputVariant.set(this.config.inputVariant() === 'filled' ? 'outlined' : 'filled');`);
    });

    it('leaves component inputStyle inputs and unrelated objects alone', async () => {
        const source = `import { AutoComplete } from '@exhaustive-ui/core/autocomplete';\n\nexport class AppComponent {\n    style = { inputStyle: 'x' };\n    read(ac: AutoComplete) {\n        return ac.inputStyle();\n    }\n}\n`;
        const html = `<p-autocomplete [inputStyle]="{ width: '100%' }"></p-autocomplete>\n`;
        const { read, warnings } = await run({ '/src/app/app.component.ts': source, '/src/app/app.component.html': html });
        expect(read('/src/app/app.component.ts')).toBe(source);
        expect(read('/src/app/app.component.html')).toBe(html);
        expect(warnings).toBe('');
    });

    it('reports a config object that sets both names and template reads of the option', async () => {
        const source = `import { provideExhaustive } from '@exhaustive-ui/core/config';\n\nexport const providers = [\n    provideExhaustive({ inputVariant: 'filled', inputStyle: 'outlined' })\n];\n`;
        const { read, warnings } = await run({ '/src/app/providers.ts': source, '/src/app/app.component.html': `<div>\n    {{ config.inputStyle() }}\n</div>\n` });
        expect(read('/src/app/providers.ts')).toBe(source);
        expect(warnings).toContain('/src/app/providers.ts:4');
        expect(warnings).toContain('/src/app/app.component.html:2');
    });
});
