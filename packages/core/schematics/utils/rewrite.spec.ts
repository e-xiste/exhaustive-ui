import { describe, expect, it } from 'vitest';
import { OPTIMUS_SOURCE } from './mappings';
import { renameStylesheetLayers, rewriteSource } from './rewrite';

const rw = (text: string) => rewriteSource('/src/test.ts', text);

describe('rewriteSource — module specifiers', () => {
    it('rewrites primeng and @primeuix import paths', () => {
        const { text, changed } = rw(`import { ButtonModule } from 'primeng/button';\n` + `import { MessageService } from 'primeng/api';\n` + `import Aura from '@primeuix/themes/aura';\n`);
        expect(changed).toBe(true);
        expect(text).toContain(`from '@exhaustive-ui/core/button'`);
        expect(text).toContain(`from '@exhaustive-ui/core/api'`);
        expect(text).toContain(`import Aura from '@exhaustive-ui/themes/aura'`);
    });

    it('rewrites export-from and dynamic import()', () => {
        const { text } = rw(`export { ButtonModule } from 'primeng/button';\n` + `const mod = await import('primeng/chart');\n`);
        expect(text).toContain(`export { ButtonModule } from '@exhaustive-ui/core/button'`);
        expect(text).toContain(`import('@exhaustive-ui/core/chart')`);
    });

    it('preserves quote style and leaves unrelated modules untouched', () => {
        const { text } = rw(`import { X } from "primeng/table";\nimport 'chart.js';\n`);
        expect(text).toContain(`from "@exhaustive-ui/core/table"`);
        expect(text).toContain(`import 'chart.js';`);
    });

    it('rewrites the primeicons stylesheet import to the renamed file', () => {
        const { text, changed } = rw(`import 'primeicons/primeicons.css';\n`);
        expect(changed).toBe(true);
        expect(text).toContain(`import '@openng/icons/openng-icons.css';`);
    });

    it('reports changed: false for untouched files', () => {
        const input = `import { Component } from '@angular/core';\n`;
        const result = rw(input);
        expect(result.changed).toBe(false);
        expect(result.text).toBe(input);
    });
});

describe('rewriteSource — identifier renames', () => {
    it('renames providePrimeNG import and its usages', () => {
        const { text } = rw(`import { providePrimeNG } from 'primeng/config';\n` + `export const appConfig = { providers: [providePrimeNG({ ripple: true })] };\n`);
        expect(text).toContain(`import { provideExhaustive } from '@exhaustive-ui/core/config'`);
        expect(text).toContain(`provideExhaustive({ ripple: true })`);
        expect(text).not.toContain('providePrimeNG');
    });

    it('renames the PrimeNG class and PrimeNGConfigType, including type positions', () => {
        const { text } = rw(`import { PrimeNG, PrimeNGConfigType } from 'primeng/config';\n` + `import { inject } from '@angular/core';\n` + `const config: PrimeNGConfigType = {};\n` + `const svc = inject(PrimeNG);\n`);
        expect(text).toContain(`import { Exhaustive, ExhaustiveConfigType } from '@exhaustive-ui/core/config'`);
        expect(text).toContain(`const config: ExhaustiveConfigType = {}`);
        expect(text).toContain(`inject(Exhaustive)`);
    });

    it('only rewrites the imported name for aliased imports', () => {
        const { text } = rw(`import { PrimeNG as Cfg } from 'primeng/config';\n` + `const svc: Cfg = null!;\n`);
        expect(text).toContain(`import { Exhaustive as Cfg } from '@exhaustive-ui/core/config'`);
        expect(text).toContain(`const svc: Cfg = null!;`);
    });

    it('does not rename identifiers that are not imported from primeng', () => {
        const { text, changed } = rw(`class PrimeNG {}\nconst x = new PrimeNG();\n`);
        expect(changed).toBe(false);
        expect(text).toContain('class PrimeNG {}');
    });

    it('renames the PrimeIcons constants class and its usages', () => {
        const { text } = rw(`import { PrimeIcons } from 'primeng/api';\n` + `const item = { icon: PrimeIcons.PLUS };\n`);
        expect(text).toContain(`import { OpenngIcons } from '@exhaustive-ui/core/api'`);
        expect(text).toContain(`icon: OpenngIcons.PLUS`);
        expect(text).not.toContain('PrimeIcons');
    });

    it('does not touch strings, comments, or property names', () => {
        const { text } = rw(`import { PrimeNG } from 'primeng/config';\n` + `// PrimeNG is great\n` + `const label = 'PrimeNG';\n` + `const obj = { PrimeNG: 1 };\n` + `const y = obj.PrimeNG;\n` + `const svc = new PrimeNG();\n`);
        expect(text).toContain(`// PrimeNG is great`);
        expect(text).toContain(`const label = 'PrimeNG';`);
        expect(text).toContain(`const obj = { PrimeNG: 1 };`);
        expect(text).toContain(`const y = obj.PrimeNG;`);
        expect(text).toContain(`const svc = new Exhaustive();`);
    });

    it('expands shorthand property usages', () => {
        const { text } = rw(`import { PrimeNG } from 'primeng/config';\nconst box = { PrimeNG };\n`);
        expect(text).toContain(`const box = { PrimeNG: Exhaustive };`);
    });

    it('renames re-exports', () => {
        const { text } = rw(`export { providePrimeNG } from 'primeng/config';\n`);
        expect(text).toContain(`export { provideExhaustive } from '@exhaustive-ui/core/config';`);
    });

    it('renames a local re-export of the imported symbol', () => {
        const { text } = rw(`import { PrimeNG } from 'primeng/config';\nexport { PrimeNG };\n`);
        expect(text).toContain(`export { Exhaustive };`);
        expect(text).not.toMatch(/\bPrimeNG\b/);
    });

    it('renames an aliased local re-export of the imported symbol', () => {
        const { text } = rw(`import { PrimeNG } from 'primeng/config';\nexport { PrimeNG as Legacy };\n`);
        expect(text).toContain(`export { Exhaustive as Legacy };`);
    });

    it('leaves a pure export alias untouched', () => {
        const { text } = rw(`import { PrimeNG } from 'primeng/config';\n` + `const x = new PrimeNG();\n` + `export { x as PrimeNG };\n`);
        expect(text).toContain(`export { x as PrimeNG };`);
        expect(text).toContain(`const x = new Exhaustive();`);
    });

    it('falls back to an aliased import when the original name is shadowed elsewhere', () => {
        const { text } = rw(`import { PrimeNG } from 'primeng/config';\n` + `const svc = new PrimeNG();\n` + `function g(PrimeNG: number) { return PrimeNG + 1; }\n`);
        expect(text).toContain(`import { Exhaustive as PrimeNG } from '@exhaustive-ui/core/config';`);
        expect(text).toContain(`const svc = new PrimeNG();`);
        expect(text).toContain(`function g(PrimeNG: number) { return PrimeNG + 1; }`);
    });

    it('does not corrupt a destructuring property key that matches the imported name', () => {
        const { text } = rw(`import { PrimeNG } from 'primeng/config';\n` + `const { PrimeNG: renamed } = getObj();\n` + `const svc = new PrimeNG();\n`);
        expect(text).toContain(`const { PrimeNG: renamed } = getObj();`);
        expect(text).toContain(`const svc = new Exhaustive();`);
    });
});

describe('rewriteSource — cssLayer names', () => {
    it('rewrites the primeng token in cssLayer name and order', () => {
        const { text, changed } = rw(
            `import { providePrimeNG } from 'primeng/config';\n` + `export const appConfig = { providers: [providePrimeNG({ theme: { preset: Aura, options: { cssLayer: { name: 'primeng', order: 'theme, base, primeng' } } } })] };\n`
        );
        expect(changed).toBe(true);
        expect(text).toContain(`name: 'exhaustive'`);
        expect(text).toContain(`order: 'theme, base, exhaustive'`);
        expect(text).not.toContain(`primeng'`);
    });

    it('only rewrites the standalone primeng token, preserving other layer names', () => {
        const { text } = rw(`const c = { cssLayer: { order: 'tailwind-base, primeng, tailwind-utilities' } };\n`);
        expect(text).toContain(`order: 'tailwind-base, exhaustive, tailwind-utilities'`);
    });

    it('preserves the quote style of the layer strings', () => {
        const { text } = rw(`const c = { cssLayer: { name: "primeng" } };\n`);
        expect(text).toContain(`name: "exhaustive"`);
    });

    it('rewrites cssLayer even without any primeng imports in the file', () => {
        const { text, changed } = rw(`export const opts = { cssLayer: { name: 'primeng' } };\n`);
        expect(changed).toBe(true);
        expect(text).toContain(`name: 'exhaustive'`);
    });

    it('leaves cssLayer untouched when it holds no primeng token', () => {
        const input = `const c = { cssLayer: { name: 'app', order: 'theme, app' } };\n`;
        const { text, changed } = rw(input);
        expect(changed).toBe(false);
        expect(text).toBe(input);
    });

    it('ignores a primeng token in a string that is not a cssLayer name/order', () => {
        const input = `const c = { cssLayer: { name: 'app', label: 'primeng theme' } };\n`;
        const { text, changed } = rw(input);
        expect(changed).toBe(false);
        expect(text).toBe(input);
    });

    it('does not treat a boolean cssLayer as an object', () => {
        const input = `const c = { cssLayer: true };\n`;
        const { changed } = rw(input);
        expect(changed).toBe(false);
    });

    it('rewrites custom layer names carrying the primeng token, like primeng-overwrites', () => {
        const { text } = rw(`const c = { cssLayer: { name: 'primeng', order: 'theme, base, primeng, primeng-overwrites' } };\n`);
        expect(text).toContain(`order: 'theme, base, exhaustive, exhaustive-overwrites'`);
    });

    it('collects the renamed layer tokens for the stylesheet pass', () => {
        const { layerRenames } = rw(`const c = { cssLayer: { name: 'primeng', order: 'theme, base, primeng, primeng-overwrites' } };\n`);
        expect(layerRenames.get('primeng')).toBe('exhaustive');
        expect(layerRenames.get('primeng-overwrites')).toBe('exhaustive-overwrites');
        expect(layerRenames.size).toBe(2);
    });

    it('collects the default layer rename when cssLayer is true, without editing the config', () => {
        const { changed, layerRenames } = rw(`const c = { cssLayer: true };\n`);
        expect(changed).toBe(false);
        expect(layerRenames.get('primeng')).toBe('exhaustive');
    });

    it('collects the default layer rename when cssLayer only sets the order', () => {
        const { text, layerRenames } = rw(`const c = { cssLayer: { order: 'theme, base, primeng' } };\n`);
        expect(text).toContain(`order: 'theme, base, exhaustive'`);
        expect(layerRenames.get('primeng')).toBe('exhaustive');
    });

    it('rewrites the optimus layer token with the Optimus UI source', () => {
        const { text, layerRenames } = rewriteSource('/src/test.ts', `const c = { cssLayer: { name: 'optimus', order: 'theme, base, optimus, primeng' } };\n`, OPTIMUS_SOURCE);
        expect(text).toContain(`name: 'exhaustive', order: 'theme, base, exhaustive, primeng'`);
        expect(layerRenames.get('optimus')).toBe('exhaustive');
        expect(layerRenames.has('primeng')).toBe(false);
    });

    it('collects no layer renames when cssLayer holds no primeng token', () => {
        const { layerRenames } = rw(`const c = { cssLayer: { name: 'app', order: 'theme, app' } };\n`);
        expect(layerRenames.size).toBe(0);
    });
});

describe('renameStylesheetLayers', () => {
    const RENAMES = new Map([
        ['primeng', 'exhaustive'],
        ['primeng-overwrites', 'exhaustive-overwrites']
    ]);

    it('renames a renamed layer in an @layer block declaration', () => {
        const { text, changed } = renameStylesheetLayers(`@layer primeng-overwrites {\n    .btn { color: red; }\n}\n`, RENAMES);
        expect(changed).toBe(true);
        expect(text).toBe(`@layer exhaustive-overwrites {\n    .btn { color: red; }\n}\n`);
    });

    it('renames layers in an @layer ordering statement', () => {
        const { text } = renameStylesheetLayers(`@layer theme, base, primeng, primeng-overwrites;\n`, RENAMES);
        expect(text).toBe(`@layer theme, base, exhaustive, exhaustive-overwrites;\n`);
    });

    it('renames the layer of an @import ... layer(...) clause', () => {
        const { text } = renameStylesheetLayers(`@import url(theme.css) layer(primeng);\n`, RENAMES);
        expect(text).toBe(`@import url(theme.css) layer(exhaustive);\n`);
    });

    it('does not rename the primeng token inside a longer layer name without its own rename', () => {
        const { text, changed } = renameStylesheetLayers(`@layer primeng-extras;\n`, new Map([['primeng', 'exhaustive']]));
        expect(changed).toBe(false);
        expect(text).toBe(`@layer primeng-extras;\n`);
    });

    it('leaves matching tokens outside @layer and layer() contexts alone', () => {
        const input = `.primeng-overwrites { color: red; }\n/* primeng */\n.a { content: 'primeng'; }\n`;
        const { text, changed } = renameStylesheetLayers(input, RENAMES);
        expect(changed).toBe(false);
        expect(text).toBe(input);
    });

    it('is a no-op when there are no renames', () => {
        const input = `@layer primeng { .btn { color: red; } }\n`;
        const { text, changed } = renameStylesheetLayers(input, new Map());
        expect(changed).toBe(false);
        expect(text).toBe(input);
    });
});
