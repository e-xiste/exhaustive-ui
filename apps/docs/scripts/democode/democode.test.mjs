import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { buildDemoComponent } from './component.mjs';
import { CORE_TYPES, DEMOS_JSON, typecheckDemos } from './typecheck.mjs';

const DOC = `import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { DeferredDemo } from '@/components/demo/deferreddemo';
import { Code } from '@/domain/code';
import { AppConfigService } from '@/service/appconfigservice';
import { ProductService } from '@/service/productservice';
import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Table, TableModule } from '@exhaustive-ui/core/table';

interface Row {
    name: string;
}

interface Unused {
    id: number;
}

@Component({
    selector: 'sample-doc',
    standalone: true,
    imports: [TableModule, ReactiveFormsModule, AppCode, AppDocSectionText, DeferredDemo],
    template: \`
        <app-docsectiontext><p>Text</p></app-docsectiontext>
        <p-deferred-demo (load)="loadDemoData()">
            <form [formGroup]="form"><p-table [value]="rows" /></form>
        </p-deferred-demo>
        <app-code [code]="code"></app-code>
    \`
})
export class SampleDoc {
    rows: Row[];

    table: Table;

    form: FormGroup;

    configService = inject(AppConfigService);

    themeEffect = effect(() => {
        if (this.configService.transitionComplete()) this.refresh();
    });

    constructor(
        private productService: ProductService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef
    ) {
        this.form = this.fb.group({ name: ['', Validators.required] });
    }

    loadDemoData() {
        this.refresh();
    }

    refresh() {
        this.productService.getProductsMini().then((rows) => {
            this.rows = rows;
            this.cd.markForCheck();
        });
    }

    code: Code = {
        typescript: \`...\`
    };
}
`;

describe('demo component', () => {
    const demo = buildDemoComponent({ content: DOC, filePath: '/docs/doc/sample/sample-doc.ts', className: 'SampleDemo', template: '<form [formGroup]="form"><p-table [value]="rows" /></form>' });
    const ts = demo.typescript;

    it('keeps the imports the demo uses and drops the docs-only ones', () => {
        assert.match(ts, /^import \{ Component, inject, OnInit \} from '@angular\/core';/);
        assert.match(ts, /import \{ FormBuilder, FormGroup, ReactiveFormsModule, Validators \} from '@angular\/forms';/);
        assert.match(ts, /import \{ TableModule \} from '@exhaustive-ui\/core\/table';/);
        assert.doesNotMatch(ts, /AppCode|AppDocSectionText|DeferredDemo|AppConfigService|@\/domain\/code|ChangeDetectorRef|\bTable\b(?!Module)/);
    });

    it('turns constructor injection into inject() and keeps the constructor body', () => {
        assert.match(ts, /private productService = inject\(ProductService\);\n    private fb = inject\(FormBuilder\);/);
        assert.match(ts, /constructor\(\) \{\n        this\.form = this\.fb\.group/);
        assert.doesNotMatch(ts, /markForCheck|private cd\b/);
    });

    it('drops the docs-only members and what only they use', () => {
        assert.doesNotMatch(ts, /configService|themeEffect|code: Code|interface Unused/);
        assert.match(ts, /interface Row \{/);
    });

    it('runs the deferred loading on init, renames the class and provides the services', () => {
        assert.match(ts, /export class SampleDemo implements OnInit \{/);
        assert.match(ts, /ngOnInit\(\) \{\n        this\.refresh\(\);/);
        assert.match(ts, /providers: \[ProductService\]/);
        assert.deepEqual(demo.services, ['ProductService']);
    });
});

const missing = [!fs.existsSync(CORE_TYPES) && 'packages/core/dist is not built (pnpm run build:exhaustive-ui && pnpm run build:lib)', !fs.existsSync(DEMOS_JSON) && 'public/demos.json is missing (node scripts/build-demo-code.mjs)'].filter(Boolean);

describe('demos.json', () => {
    it('has demos that type-check against the built library', { skip: missing.length > 0 && missing.join('; '), timeout: 600_000 }, () => {
        const { demos } = JSON.parse(fs.readFileSync(DEMOS_JSON, 'utf-8'));
        const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'democode-'));
        try {
            const { errors, total } = typecheckDemos(demos, outDir);
            const failing = Object.entries(errors);
            assert.ok(total > 800, `only ${total} demos`);
            assert.equal(failing.length, 0, `${failing.length} demos do not type-check:\n${failing.map(([key, list]) => `${key}\n    ${list.join('\n    ')}`).join('\n')}`);
        } finally {
            fs.rmSync(outDir, { recursive: true, force: true });
        }
    });
});
