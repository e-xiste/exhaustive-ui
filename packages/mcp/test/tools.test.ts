import { describe, expect, it } from 'vitest';
import { RemoteSource } from '../src/source';
import { getComponentTool, getExampleTool, getGuideTool, getSetupTool, guard, listTool, searchTool, validateUsageTool, versionTool, type ToolResult } from '../src/tools';
import { fixtureContext, forbiddenFetch, memorySource } from './helpers';

const ctx = fixtureContext();

function structured<T = Record<string, any>>(result: ToolResult): T {
    return result.structuredContent as T;
}

describe('every tool result', () => {
    it('serializes the structured content as its text content', async () => {
        const result = await listTool(ctx, { kind: 'guides', limit: 2, offset: 0 });

        expect(result.isError).toBeUndefined();
        expect(result.content).toHaveLength(1);
        expect(JSON.parse(result.content[0]!.text)).toEqual(result.structuredContent);
        expect(result.structuredContent.summary).toBe('2 of 4 guides returned.');
    });

    it('turns thrown tool errors into error results', async () => {
        const result = await guard(() => getComponentTool(ctx, { component: 'nope', includeApi: false, includeExamples: false, detail: 'compact' }));

        expect(result.isError).toBe(true);
        expect(structured(result).error).toContain('"nope" not found');
    });
});

describe('list', () => {
    it('lists components with their selectors and resource URIs', async () => {
        const result = structured(await listTool(ctx, { kind: 'components', limit: 50, offset: 0 }));

        expect(result.total).toBe(5);
        expect(result.items[0]).toMatchObject({ name: 'button', selectors: ['p-button', '[pButton]', '[pButtonIcon]', '[pButtonLabel]'], import: '@exhaustive-ui/core/button', resourceUri: 'exhaustive-ui://docs/components/button.md' });
    });

    it('paginates', async () => {
        const result = structured(await listTool(ctx, { kind: 'components', limit: 2, offset: 3 }));

        expect(result.items.map((item: any) => item.name)).toEqual(['tabs', 'tooltip']);
        expect(result).toMatchObject({ total: 5, limit: 2, offset: 3 });
    });

    it('lists directives, guides, examples and resources', async () => {
        expect(structured(await listTool(ctx, { kind: 'directives', limit: 50, offset: 0 })).items).toContainEqual(
            expect.objectContaining({ className: 'Tooltip', selector: '[pTooltip]', import: '@exhaustive-ui/core/tooltip', component: 'tooltip' })
        );
        expect(structured(await listTool(ctx, { kind: 'guides', limit: 50, offset: 0 })).items.map((item: any) => item.route)).toEqual(['/installation', '/configuration', '/theming/styled', '/tailwind']);

        const examples = structured(await listTool(ctx, { kind: 'examples', limit: 200, offset: 0 }));

        expect(examples.items).toContainEqual(expect.objectContaining({ component: 'button', section: 'basic', nextCall: { tool: 'get_example', arguments: { component: 'button', section: 'basic' } } }));
        expect(examples.items.find((item: any) => item.section === 'accessibility')).toBeUndefined();

        const resources = structured(await listTool(ctx, { kind: 'resources', limit: 200, offset: 0 }));

        expect(resources.items.map((item: any) => item.uri)).toEqual(
            expect.arrayContaining(['exhaustive-ui://docs/llms.txt', 'exhaustive-ui://docs/manifest.json', 'exhaustive-ui://docs/components/button.md', 'exhaustive-ui://docs/components/button/api.json', 'exhaustive-ui://docs/pages/installation.md'])
        );
    });
});

describe('search', () => {
    it('ranks the component whose name matches first', async () => {
        const result = structured(await searchTool(ctx, { query: 'tooltip', scope: 'all', limit: 10, offset: 0 }));

        expect(result.results[0]).toMatchObject({ type: 'component', name: 'tooltip', nextCall: { tool: 'get_component', arguments: { component: 'tooltip' } } });
    });

    it('finds components by feature words and reports the matched snippets', async () => {
        const result = structured(await searchTool(ctx, { query: 'badge severity', scope: 'components', limit: 10, offset: 0 }));

        expect(result.results[0].name).toBe('button');
        expect(result.results[0].matchedTerms).toEqual(expect.arrayContaining(['badge', 'severity']));
        expect(result.results[0].matches.length).toBeGreaterThan(0);
    });

    it('finds guides', async () => {
        const result = structured(await searchTool(ctx, { query: 'install npm', scope: 'guides', limit: 10, offset: 0 }));

        expect(result.results[0]).toMatchObject({ type: 'guide', name: 'installation', nextCall: { tool: 'get_guide', arguments: { guide: 'installation' } } });
    });

    it('searches API members', async () => {
        const result = structured(await searchTool(ctx, { query: 'onLazyLoad', scope: 'api', limit: 10, offset: 0 }));

        expect(result.results[0]).toMatchObject({ type: 'api', component: 'select', member: 'emit', name: 'onLazyLoad' });
    });

    it('searches examples', async () => {
        const result = structured(await searchTool(ctx, { query: 'button group', scope: 'examples', limit: 10, offset: 0 }));

        expect(result.results[0]).toMatchObject({ type: 'example', component: 'button', section: 'buttongroup', nextCall: { tool: 'get_example', arguments: { component: 'button', section: 'buttongroup' } } });
    });

    it('returns an empty page for nonsense', async () => {
        const result = structured(await searchTool(ctx, { query: 'xyzzyplugh', scope: 'all', limit: 10, offset: 0 }));

        expect(result.total).toBe(0);
        expect(result.results).toEqual([]);
    });
});

describe('get_component', () => {
    const base = { includeApi: false, includeExamples: false, detail: 'compact' as const };

    it('returns a compact description with the available examples', async () => {
        const { component } = structured(await getComponentTool(ctx, { ...base, component: 'p-button' }));

        expect(component).toMatchObject({ name: 'button', title: 'Angular Button Component', import: '@exhaustive-ui/core/button', resourceUri: 'exhaustive-ui://docs/components/button.md' });
        expect(component.declarations).toContainEqual({ kind: 'component', className: 'Button', selector: 'p-button', forms: undefined, standalone: true });
        expect(component.sections.map((section: any) => section.id)).toContain('basic');
        expect(component.examplesAvailable).toContainEqual(expect.objectContaining({ section: 'basic', nextCall: { tool: 'get_example', arguments: { component: 'button', section: 'basic' } } }));
        expect(component.api).toBeUndefined();
        expect(component.examples).toBeUndefined();
        expect(component.document).toBeUndefined();
    });

    it('restricts to the requested sections', async () => {
        const { component } = structured(await getComponentTool(ctx, { ...base, component: 'button', sections: ['Basic', 'badge'] }));

        expect(component.sections.map((section: any) => section.id)).toEqual(['basic', 'badge']);
    });

    it('fails on unknown sections', async () => {
        const result = await guard(() => getComponentTool(ctx, { ...base, component: 'button', sections: ['nope'] }));

        expect(result.isError).toBe(true);
        expect(structured(result).availableSections).toContain('basic');
    });

    it('includes the API and compiled declarations on demand', async () => {
        const { component } = structured(await getComponentTool(ctx, { ...base, component: 'select', includeApi: true }));

        expect(component.api.props.map((prop: any) => prop.name)).toContain('options');
        expect(component.api.emits.map((emit: any) => emit.name)).toContain('onChange');
        expect(component.compiled[0]).toMatchObject({ className: 'Select', selector: 'p-select', forms: true });
        expect(component.compiled[0].inputs).toContainEqual(expect.objectContaining({ name: 'filterMatchMode', values: expect.arrayContaining(['contains', 'startsWith']) }));
    });

    it('includes example code on demand', async () => {
        const { component } = structured(await getComponentTool(ctx, { ...base, component: 'button', includeExamples: true }));

        expect(component.examples.find((example: any) => example.section === 'basic').code).toContain('<p-button label="Submit" />');
    });

    it('returns the Markdown document with detail "full"', async () => {
        const { component } = structured(await getComponentTool(ctx, { ...base, component: 'button', detail: 'full' }));

        expect(component.document).toContain('# Angular Button Component');
    });

    it('handles batches of components', async () => {
        const result = structured(await getComponentTool(ctx, { ...base, components: [{ component: 'button' }, { component: 'nope' }, 42] }));

        expect(result).toMatchObject({ total: 3, succeeded: 1, failed: 2 });
        expect(result.results[0]).toMatchObject({ index: 0, status: 'success', component: { name: 'button' } });
        expect(result.results[1]).toMatchObject({ index: 1, status: 'error' });
        expect(result.results[1].error).toContain('not found');
        expect(result.results[2]).toMatchObject({ index: 2, status: 'error' });
    });

    it('rejects mixing the batch and single forms', async () => {
        const result = await guard(() => getComponentTool(ctx, { ...base, component: 'button', components: [{ component: 'button' }] }));

        expect(result.isError).toBe(true);
        expect(structured(result).error).toContain('not both');
    });
});

describe('get_guide', () => {
    it('returns the guide sections by route', async () => {
        const { guide } = structured(await getGuideTool(ctx, { guide: 'theming/styled', detail: 'compact' }));

        expect(guide).toMatchObject({ name: 'styled', title: 'Styled Mode', route: '/theming/styled', resourceUri: 'exhaustive-ui://docs/pages/styled.md' });
        expect(guide.sections.length).toBeGreaterThan(0);
        expect(guide.document).toBeUndefined();
    });

    it('focuses on a section and returns the full document on demand', async () => {
        const { guide } = structured(await getGuideTool(ctx, { guide: 'installation', section: 'download', detail: 'full' }));

        expect(guide.section).toMatchObject({ id: 'download-', hasCode: true, codeLanguage: 'bash' });
        expect(guide.section.code).toContain('npm install @exhaustive-ui/core');
        expect(guide.document).toContain('# Installation');
    });
});

describe('get_example', () => {
    it('defaults to the basic example', async () => {
        const result = structured(await getExampleTool(ctx, { component: 'button' }));

        expect(result).toMatchObject({ component: 'button', section: 'basic', codeLanguage: 'typescript', import: '@exhaustive-ui/core/button' });
        expect(result.code).toContain('<p-button label="Submit" />');
    });

    it('resolves sections by label', async () => {
        expect(structured(await getExampleTool(ctx, { component: 'button', section: 'Button Group' })).section).toBe('buttongroup');
    });

    it('resolves variants through feature words', async () => {
        expect(structured(await getExampleTool(ctx, { component: 'tabs', variant: 'lazy loading' })).section).toBe('lazy');
        expect(structured(await getExampleTool(ctx, { component: 'tooltip', variant: 'positions' })).section).toBe('position');
    });

    it('falls back to a section with code when the requested one has none', async () => {
        const result = await guard(() => getExampleTool(ctx, { component: 'button', section: 'accessibility' }));

        expect(result.isError).toBe(true);
        expect(structured(result)).toMatchObject({ component: 'button', requestedSection: 'accessibility', sourceBackedCodeAvailable: true, apiAvailable: true });
        expect(structured(result).sectionsWithCode).toContain('basic');
        expect(structured(result).suggestedSections.length).toBeGreaterThan(0);
    });

    it('explains itself when nothing matches', async () => {
        const result = await guard(() => getExampleTool(ctx, { component: 'button', section: 'teleportation' }));

        expect(result.isError).toBe(true);
        expect(structured(result).error).toContain('teleportation');
        expect(structured(result).availableSections).toContain('basic');
    });
});

describe('get_setup', () => {
    it('returns the installation guide with its document by default', async () => {
        const result = structured(await getSetupTool(ctx, {}));

        expect(result.environment).toBe('angular-cli');
        expect(result.guide).toMatchObject({ name: 'installation' });
        expect(result.guide.document).toContain('npm install @exhaustive-ui/core');
        expect(result.relatedGuides.map((guide: any) => guide.environment)).toContain('tailwind');
    });

    it('maps environment aliases to guides', async () => {
        expect(structured(await getSetupTool(ctx, { environment: 'Tailwind CSS' })).guide.name).toBe('tailwind');
        expect(structured(await getSetupTool(ctx, { environment: 'theme' })).guide.name).toBe('styled');
        expect(structured(await getSetupTool(ctx, { environment: 'config' })).guide.name).toBe('configuration');
        expect(structured(await getSetupTool(ctx, { environment: 'theming/styled' })).guide.name).toBe('styled');
    });

    it('rejects unknown environments with the valid list', async () => {
        const result = await guard(() => getSetupTool(ctx, { environment: 'vue' }));

        expect(result.isError).toBe(true);
        expect(structured(result).validEnvironments).toContain('angular-cli');
    });
});

describe('validate_usage', () => {
    it('accepts a valid template', async () => {
        const result = await validateUsageTool(ctx, { component: 'button', code: `<p-button label="Save" icon="pi pi-check" severity="danger" [loading]="busy" (onClick)="save($event)" pTooltip="Save" />` });

        expect(result.isError).toBeUndefined();
        expect(structured(result)).toMatchObject({ component: 'button', valid: true, issues: [] });
    });

    it('reports unknown inputs, outputs and invalid literal values', async () => {
        const result = await validateUsageTool(ctx, { component: 'p-button', code: `<p-button label="Save" colour="red" severity="purple" [variant]="'ghost'" (onPress)="save()"></p-button>` });
        const issues = structured(result).issues;

        expect(result.isError).toBe(true);
        expect(structured(result).valid).toBe(false);
        expect(issues).toContainEqual(expect.objectContaining({ kind: 'unknown-prop', name: 'colour', severity: 'error' }));
        expect(issues).toContainEqual(expect.objectContaining({ kind: 'invalid-enum-value', name: 'severity', allowedValues: expect.stringContaining('danger') }));
        expect(issues).toContainEqual(expect.objectContaining({ kind: 'invalid-enum-value', name: 'variant', allowedValues: 'outlined, text' }));
        expect(issues).toContainEqual(expect.objectContaining({ kind: 'unknown-output', name: 'onPress', allowedEvents: 'onBlur, onClick, onFocus' }));
        expect(result.content[0]!.text).toContain('unknown-prop colour');
    });

    it('ignores interpolated values, native events, Angular directives and aria attributes', async () => {
        const result = await validateUsageTool(ctx, { component: 'button', code: `<p-button *ngIf="ready" #save label="{{ label }}" severity="{{ level }}" (click)="go()" [ngClass]="cls" aria-label="Save" data-test="save" class="m-2" />` });

        expect(structured(result).valid).toBe(true);
    });

    it('checks directives applied to native elements without flagging native attributes', async () => {
        const valid = await validateUsageTool(ctx, { component: 'inputtext', code: `<input pInputText type="text" placeholder="Name" [(ngModel)]="name" pSize="small" [invalid]="form.invalid" />` });

        expect(structured(valid).valid).toBe(true);

        const invalid = await validateUsageTool(ctx, { component: 'inputtext', code: `<input pInputText pSize="huge" [rounded]="true" />` });

        expect(structured(invalid).issues).toContainEqual(expect.objectContaining({ kind: 'invalid-enum-value', name: 'pSize', allowedValues: 'large, small' }));
        expect(structured(invalid).issues).toContainEqual(expect.objectContaining({ kind: 'unknown-prop', name: 'rounded' }));
    });

    it('validates two-way bindings and deprecated inputs', async () => {
        const result = await validateUsageTool(ctx, { component: 'tabs', code: `<p-tabs [(value)]="active" [(scrollable)]="scroll"></p-tabs>` });

        expect(structured(result).issues).toEqual([expect.objectContaining({ kind: 'two-way-binding-unsupported', name: 'scrollable' })]);

        const deprecated = await validateUsageTool(ctx, { component: 'button', code: `<p-button badge="2" badgeClass="p-badge-danger" />` });

        expect(deprecated.isError).toBeUndefined();
        expect(structured(deprecated)).toMatchObject({ valid: true });
        expect(structured(deprecated).issues).toEqual([expect.objectContaining({ kind: 'deprecated-prop', name: 'badgeClass', severity: 'warning' })]);
    });

    it('warns when ngModel is bound to a component without forms support', async () => {
        const result = await validateUsageTool(ctx, { component: 'button', code: `<p-button [(ngModel)]="value" />` });

        expect(structured(result).issues).toEqual([expect.objectContaining({ kind: 'forms-unsupported', severity: 'warning' })]);

        const select = await validateUsageTool(ctx, { component: 'select', code: `<p-select [options]="cities" [(ngModel)]="city" optionLabel="name" />` });

        expect(structured(select).valid).toBe(true);
        expect(structured(select).issues).toEqual([]);
    });

    it('flags PrimeNG imports and PascalCase tags', async () => {
        const result = await validateUsageTool(ctx, {
            component: 'select',
            code: `import { DropdownModule } from 'primeng/dropdown';\n@Component({ template: '<Select [options]="cities"></Select>' }) class Demo {}`
        });
        const issues = structured(result).issues;

        expect(issues).toContainEqual(expect.objectContaining({ kind: 'import-mismatch', name: 'primeng/dropdown', suggestion: expect.stringContaining("'@exhaustive-ui/core/dropdown'") }));
        expect(issues).toContainEqual(expect.objectContaining({ kind: 'selector-mismatch', name: 'Select', suggestion: 'p-select' }));
    });

    it('flags unknown p- selectors and reports when the component is not used at all', async () => {
        const wrong = await validateUsageTool(ctx, { component: 'select', code: `<p-dropdown [options]="cities"></p-dropdown>` });

        expect(structured(wrong).issues).toEqual([expect.objectContaining({ kind: 'unknown-selector', name: 'p-dropdown', suggestion: 'p-select' })]);

        const unused = await validateUsageTool(ctx, { component: 'select', code: `<div class="card"><p-button label="Hi" /></div>` });

        expect(unused.isError).toBeUndefined();
        expect(structured(unused).issues).toEqual([expect.objectContaining({ kind: 'selector-not-found', severity: 'warning' })]);
    });

    it('handles batches of usages', async () => {
        const result = structured(
            await validateUsageTool(ctx, {
                usages: [
                    { component: 'button', code: '<p-button label="A" />' },
                    { component: 'button', code: '<p-button nope="1" />' },
                    { component: 'ghost', code: '<p-ghost />' }
                ]
            })
        );

        expect(result).toMatchObject({ total: 3, succeeded: 1, failed: 2 });
        expect(result.results[0]).toMatchObject({ index: 0, status: 'success', valid: true });
        expect(result.results[1]).toMatchObject({ index: 1, status: 'error', valid: false });
        expect(result.results[2]).toMatchObject({ index: 2, status: 'error' });
    });
});

describe('version', () => {
    it('describes the server, the docs and the source', async () => {
        const result = structured(await versionTool(ctx));

        expect(result.server).toEqual({ name: '@exhaustive-ui/mcp', version: '0.0.0-test' });
        expect(result.data).toMatchObject({ libraryVersion: '3.0.0-alpha.0', site: 'https://exhaustive-ui.com', counts: { components: 5, directives: 5, guides: 4 } });
        expect(result.tools).toEqual(['list', 'search', 'get_component', 'get_guide', 'get_example', 'get_setup', 'validate_usage', 'version']);
        expect(result.resources.static).toContain('exhaustive-ui://docs/llms.txt');
        expect(result.prompts).toContain('use_component');
    });

    it('still answers when the docs cannot be loaded', async () => {
        const broken = fixtureContext(new RemoteSource({ baseUrl: 'https://docs.example', timeoutMs: 100, fetchImpl: forbiddenFetch }));
        const result = await versionTool(broken);

        expect(result.isError).toBeUndefined();
        expect(structured(result).data.error).toContain('Cannot reach');
    });
});

describe('with an in-memory source', () => {
    it('works without touching the filesystem', async () => {
        const memory = fixtureContext(memorySource());
        const result = structured(await getExampleTool(memory, { component: 'tooltip', section: 'delay' }));

        expect(result.code).toContain('pTooltip');
    });
});
