import { describe, expect, it } from 'vitest';
import { VERSIONS } from '../utils/mappings';
import { createAppTree, createRunner, DEFAULT_PKG } from './helpers';

const OPTIMUS_PKG = {
    ...DEFAULT_PKG,
    dependencies: {
        '@angular/core': '^22.1.2',
        '@openng/optimus-ui': '^2.0.2',
        '@openng/optimus-ui-themes': '^2.0.2',
        '@openng/optimus-ui-tailwindcss': '^2.0.2',
        '@openng/icons': '^1.0.0'
    }
};

const APP_CONFIG_OPTIMUS = `import { ApplicationConfig } from '@angular/core';
import { provideOptimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [provideOptimus({ theme: { preset: Aura } })]
};
`;

function optimusTree(extraFiles: Record<string, string> = {}, pkg: object = OPTIMUS_PKG) {
    return createAppTree({ '/src/app/app.config.ts': APP_CONFIG_OPTIMUS, ...extraFiles }, pkg);
}

async function run(tree: ReturnType<typeof optimusTree>, options: object = {}) {
    const runner = createRunner();
    const logs: string[] = [];
    runner.logger.subscribe((entry) => logs.push(entry.message));
    const result = await runner.runSchematic('migrate-from-optimus', { skipInstall: true, ...options }, tree);
    return { result, log: logs.join('\n') };
}

describe('migrate-from-optimus', () => {
    it('aborts when @openng/optimus-ui is not installed', async () => {
        const tree = createAppTree({}, DEFAULT_PKG);
        await expect(createRunner().runSchematic('migrate-from-optimus', { skipInstall: true }, tree)).rejects.toThrow(/@openng\/optimus-ui is not installed/);
    });

    it('aborts on Optimus UI v1, and proceeds with --force', async () => {
        const pkg = { ...OPTIMUS_PKG, dependencies: { ...OPTIMUS_PKG.dependencies, '@openng/optimus-ui': '^1.4.0' } };
        await expect(createRunner().runSchematic('migrate-from-optimus', { skipInstall: true }, optimusTree({}, pkg))).rejects.toThrow(/v1/);
        const { result } = await run(optimusTree({}, pkg), { force: true });
        expect(result.readContent('/src/app/app.config.ts')).toContain('provideExhaustive');
    });

    it('swaps the dependencies and keeps @openng/icons', async () => {
        const { result } = await run(optimusTree());
        const pkg = JSON.parse(result.readContent('/package.json'));
        expect(pkg.dependencies['@exhaustive-ui/core']).toBe(VERSIONS['@exhaustive-ui/core']);
        expect(pkg.dependencies['@exhaustive-ui/themes']).toBe(VERSIONS['@exhaustive-ui/themes']);
        expect(pkg.dependencies['@exhaustive-ui/tailwindcss']).toBe(VERSIONS['@exhaustive-ui/tailwindcss']);
        expect(pkg.dependencies['@openng/icons']).toBe('^1.0.0');
        expect(Object.keys(pkg.dependencies).filter((name) => name.includes('optimus'))).toEqual([]);
    });

    it('rewrites imports and the configuration API', async () => {
        const { result } = await run(
            optimusTree({
                '/src/app/settings.service.ts':
                    `import { inject, InjectionToken } from '@angular/core';\n` +
                    `import { Optimus, OptimusConfigType, OPTIMUS_CONFIG } from '@openng/optimus-ui/config';\n` +
                    `import { ButtonModule } from '@openng/optimus-ui/button';\n` +
                    `import { definePreset } from '@openng/optimus-ui-themes';\n` +
                    `export class SettingsService {\n` +
                    `    config = inject(Optimus);\n` +
                    `    initial = inject(OPTIMUS_CONFIG);\n` +
                    `    update(options: OptimusConfigType) {\n` +
                    `        this.config.setConfig(options);\n` +
                    `    }\n` +
                    `}\n`
            })
        );
        expect(result.readContent('/src/app/app.config.ts')).toBe(`import { ApplicationConfig } from '@angular/core';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import Aura from '@exhaustive-ui/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [provideExhaustive({ theme: { preset: Aura } })]
};
`);
        const service = result.readContent('/src/app/settings.service.ts');
        expect(service).toContain(`import { Exhaustive, ExhaustiveConfigType, EXHAUSTIVE_CONFIG } from '@exhaustive-ui/core/config';`);
        expect(service).toContain(`import { ButtonModule } from '@exhaustive-ui/core/button';`);
        expect(service).toContain(`import { definePreset } from '@exhaustive-ui/themes';`);
        expect(service).toContain('inject(Exhaustive)');
        expect(service).toContain('inject(EXHAUSTIVE_CONFIG)');
        expect(service).toContain('options: ExhaustiveConfigType');
    });

    it('leaves identifiers that are not imported from Optimus UI alone', async () => {
        const source = `class Optimus {}\nexport const prime = new Optimus();\n`;
        const { result } = await run(optimusTree({ '/src/app/local.ts': source }));
        expect(result.readContent('/src/app/local.ts')).toBe(source);
    });

    it('rewrites stylesheet and angular.json references', async () => {
        const tree = optimusTree({ '/src/styles.css': `@import 'tailwindcss';\n@import '@openng/optimus-ui-tailwindcss';\n@import '@openng/icons/openng-icons.css';\n` });
        const angularJson = JSON.parse(tree.readContent('/angular.json'));
        angularJson.projects.app.architect = { build: { options: { styles: ['node_modules/@openng/optimus-ui-themes/some.css', 'src/styles.css'] } } };
        tree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));

        const { result } = await run(tree);
        expect(result.readContent('/src/styles.css')).toBe(`@import 'tailwindcss';\n@import '@exhaustive-ui/tailwindcss';\n@import '@openng/icons/openng-icons.css';\n`);
        expect(result.readContent('/angular.json')).toContain('node_modules/@exhaustive-ui/themes/some.css');
    });

    it('renames the default optimus layer in stylesheets when cssLayer is enabled without a name', async () => {
        const { result } = await run(
            optimusTree({
                '/src/app/app.config.ts': APP_CONFIG_OPTIMUS.replace('{ preset: Aura }', '{ preset: Aura, options: { cssLayer: true } }'),
                '/src/styles.css': `@layer tailwind-base, optimus, tailwind-utilities;\n@layer optimus {\n    .p-button { margin: 0; }\n}\n`
            })
        );
        expect(result.readContent('/src/app/app.config.ts')).toContain('cssLayer: true');
        expect(result.readContent('/src/styles.css')).toBe(`@layer tailwind-base, exhaustive, tailwind-utilities;\n@layer exhaustive {\n    .p-button { margin: 0; }\n}\n`);
    });

    it('leaves @layer declarations alone when no CSS layer is configured', async () => {
        const styles = `@layer theme, optimus;\n`;
        const { result } = await run(optimusTree({ '/src/styles.css': styles }));
        expect(result.readContent('/src/styles.css')).toBe(styles);
    });

    it('reports leftovers and points to the guide', async () => {
        const { log } = await run(optimusTree({ '/src/app/app.component.html': `<!-- built with @openng/optimus-ui -->\n<p-button label="Save" />\n` }));
        expect(log).toContain('/src/app/app.component.html:1');
        expect(log).toContain('https://exhaustive-ui.com/migration/optimus');
    });

    it('says so when there is nothing left to review', async () => {
        const { log } = await run(optimusTree());
        expect(log).toContain('No leftover @openng/optimus-ui/Optimus references found');
    });
});
