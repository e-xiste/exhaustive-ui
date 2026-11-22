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
    const result = await runner.runSchematic('removed-exports', {}, createAppTree(files));
    return { read: (path: string) => result.readContent(path), warnings: warnings.join('\n') };
}

describe('removed-exports', () => {
    it('renames Password_VALUE_ACCESSOR and its uses', async () => {
        const { read } = await run({
            '/src/app/providers.ts': `import { Password, Password_VALUE_ACCESSOR } from '@exhaustive-ui/core/password';\n\nexport const providers = [Password_VALUE_ACCESSOR];\nexport const ref = { Password_VALUE_ACCESSOR: 1, Password };\n`,
            '/src/app/aliased.ts': `import { Password_VALUE_ACCESSOR as ACCESSOR } from '@exhaustive-ui/core/password';\n\nexport const providers = [ACCESSOR];\n`
        });
        expect(read('/src/app/providers.ts')).toBe(
            `import { Password, PASSWORD_VALUE_ACCESSOR } from '@exhaustive-ui/core/password';\n\nexport const providers = [PASSWORD_VALUE_ACCESSOR];\nexport const ref = { Password_VALUE_ACCESSOR: 1, Password };\n`
        );
        expect(read('/src/app/aliased.ts')).toBe(`import { PASSWORD_VALUE_ACCESSOR as ACCESSOR } from '@exhaustive-ui/core/password';\n\nexport const providers = [ACCESSOR];\n`);
    });

    it('drops InplaceDisplay/InplaceContent from imports and turns their elements into spans', async () => {
        const { read } = await run({
            '/src/app/app.ts': [
                `import { Component } from '@angular/core';`,
                `import { Inplace, InplaceContent, InplaceDisplay } from '@exhaustive-ui/core/inplace';`,
                ``,
                `@Component({`,
                `    selector: 'app-root',`,
                `    imports: [Inplace, InplaceDisplay, InplaceContent],`,
                `    template: \`<p-inplace><p-inplacedisplay pInplaceDisplay>View</p-inplacedisplay><p-inplaceContent pInplaceContent><input /></p-inplaceContent></p-inplace>\``,
                `})`,
                `export class App {}`,
                ``
            ].join('\n'),
            '/src/app/only.ts': `import { InplaceDisplay } from '@exhaustive-ui/core/inplace';\nimport { Other } from './other';\n\nexport const list = [InplaceDisplay, Other];\n`,
            '/src/app/app.html': `<p-inplace>\n    <p-inplacedisplay pInplaceDisplay>View</p-inplacedisplay>\n    <p-inplacecontent pInplaceContent><input /></p-inplacecontent>\n</p-inplace>\n`
        });
        const ts = read('/src/app/app.ts');
        expect(ts).toContain(`import { Inplace } from '@exhaustive-ui/core/inplace';`);
        expect(ts).toContain(`imports: [Inplace],`);
        expect(ts).toContain('<p-inplace><span pInplaceDisplay>View</span><span pInplaceContent><input /></span></p-inplace>');
        expect(read('/src/app/only.ts')).toBe(`import { Other } from './other';\n\nexport const list = [Other];\n`);
        expect(read('/src/app/app.html')).toBe(`<p-inplace>\n    <span pInplaceDisplay>View</span>\n    <span pInplaceContent><input /></span>\n</p-inplace>\n`);
    });

    it('reports imports of the exports that became internal', async () => {
        const { read, warnings } = await run({
            '/src/app/app.ts': `import { Select, SelectItem } from '@exhaustive-ui/core/select';\nimport { SelectItem as Option } from '@exhaustive-ui/core/api';\nimport { MenubarService } from '@exhaustive-ui/core/menubar';\n\nexport const x: Option[] = [];\n`
        });
        expect(read('/src/app/app.ts')).toContain(`import { Select, SelectItem } from '@exhaustive-ui/core/select';`);
        expect(warnings).toContain('/src/app/app.ts:1');
        expect(warnings).toContain('/src/app/app.ts:3');
        expect(warnings).not.toContain('/src/app/app.ts:2');
    });
});
