import { describe, expect, it } from 'vitest';
import { CatalogLoader, attributeSelectorName, findComponent, findGuide, findSection, splitSelectors } from '../src/catalog';
import { ToolError } from '../src/errors';
import { MemorySource } from '../src/source';
import type { Catalog } from '../src/types';
import { fixtureDocuments, fixtureSource } from './helpers';

async function loadCatalog(): Promise<Catalog> {
    return new CatalogLoader(fixtureSource()).load();
}

describe('buildCatalog', () => {
    it('normalizes components, guides and directives from the generated indexes', async () => {
        const catalog = await loadCatalog();

        expect(catalog.libraryVersion).toBe('22.0.0-alpha.3');
        expect(catalog.site).toBe('https://exhaustive-ui.com');
        expect(catalog.components.map((component) => component.name)).toEqual(['button', 'inputtext', 'select', 'tabs', 'tooltip']);
        expect(catalog.guides.map((guide) => guide.route)).toEqual(['/installation', '/configuration', '/theming/styled', '/tailwind']);
        expect(catalog.directives.map((directive) => directive.selector)).toEqual(['[pButton]', '[pButtonIcon]', '[pButtonLabel]', '[pInputText]', '[pTooltip]']);
    });

    it('drops the docs pages the generator lists as components', async () => {
        const catalog = await loadCatalog();

        expect(catalog.components.find((component) => component.name === 'llms')).toBeUndefined();
    });

    it('describes a component with its selectors, import, resource URIs and sections', async () => {
        const button = findComponent(await loadCatalog(), 'button');

        expect(button.selectors).toEqual(['p-button', '[pButton]', '[pButtonIcon]', '[pButtonLabel]']);
        expect(button.import).toBe('@exhaustive-ui/core/button');
        expect(button.modules).toEqual(['ButtonModule']);
        expect(button.resourceUri).toBe('exhaustive-ui://docs/components/button.md');
        expect(button.apiResourceUri).toBe('exhaustive-ui://docs/components/button/api.json');
        expect(button.publicUrl).toBe('https://exhaustive-ui.com/button');
        expect(button.markdownUrl).toBe('https://exhaustive-ui.com/llms/components/button.md');
        expect(button.docPath).toBe('components/button.md');
        expect(button.sections.map((section) => section.id)).toContain('basic');
        expect(button.sections.find((section) => section.id === 'basic')).toMatchObject({ hasCode: true, codeLanguage: 'typescript' });
        expect(button.sections.find((section) => section.id === 'accessibility')).toMatchObject({ hasCode: false });
    });

    it('describes a guide with its route-derived URLs', async () => {
        const styled = findGuide(await loadCatalog(), 'theming/styled');

        expect(styled).toMatchObject({ name: 'styled', route: '/theming/styled', publicUrl: 'https://exhaustive-ui.com/theming/styled', docPath: 'pages/styled.md', resourceUri: 'exhaustive-ui://docs/pages/styled.md' });
    });
});

describe('CatalogLoader', () => {
    it('reuses the catalog while the index documents are unchanged', async () => {
        const loader = new CatalogLoader(fixtureSource());
        const first = await loader.load();
        const second = await loader.load();

        expect(second).toBe(first);
    });

    it('rebuilds the catalog when an index document changes', async () => {
        const documents = fixtureDocuments();
        const loader = new CatalogLoader(new MemorySource(documents));
        const first = await loader.load();

        documents.set('components.json', documents.get('components.json')!.replace('"version": "1.0.0"', '"version": "1.0.1"'));

        const second = await loader.load();

        expect(second).not.toBe(first);
        expect(second.docsVersion).toBe('1.0.1');
    });
});

describe('findComponent', () => {
    it('resolves names, selectors, class names, aliases and URLs', async () => {
        const catalog = await loadCatalog();

        expect(findComponent(catalog, 'button').name).toBe('button');
        expect(findComponent(catalog, 'Button').name).toBe('button');
        expect(findComponent(catalog, 'p-button').name).toBe('button');
        expect(findComponent(catalog, '<p-select>').name).toBe('select');
        expect(findComponent(catalog, 'pTooltip').name).toBe('tooltip');
        expect(findComponent(catalog, '[pInputText]').name).toBe('inputtext');
        expect(findComponent(catalog, 'InputText').name).toBe('inputtext');
        expect(findComponent(catalog, 'dropdown').name).toBe('select');
        expect(findComponent(catalog, 'TabView').name).toBe('tabs');
        expect(findComponent(catalog, 'https://exhaustive-ui.com/select').name).toBe('select');
        expect(findComponent(catalog, 'exhaustive-ui://docs/components/tabs.md').name).toBe('tabs');
        expect(findComponent(catalog, '@exhaustive-ui/core/tooltip').name).toBe('tooltip');
    });

    it('throws a tool error with suggestions for unknown components', async () => {
        const catalog = await loadCatalog();

        try {
            findComponent(catalog, 'buton');
            expect.unreachable('should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(ToolError);
            expect((error as ToolError).message).toContain('"buton" not found');
            expect((error as ToolError).structuredContent.suggestions).toEqual(['button']);
        }
    });
});

describe('findGuide', () => {
    it('resolves names, routes, titles and URLs', async () => {
        const catalog = await loadCatalog();

        expect(findGuide(catalog, 'installation').name).toBe('installation');
        expect(findGuide(catalog, 'Installation').name).toBe('installation');
        expect(findGuide(catalog, '/theming/styled').name).toBe('styled');
        expect(findGuide(catalog, 'styled').name).toBe('styled');
        expect(findGuide(catalog, 'Styled Mode').name).toBe('styled');
        expect(findGuide(catalog, 'https://exhaustive-ui.com/tailwind').name).toBe('tailwind');
        expect(findGuide(catalog, 'exhaustive-ui://docs/pages/configuration.md').name).toBe('configuration');
        expect(findGuide(catalog, 'pages/configuration.md').name).toBe('configuration');
    });

    it('lists the available guides when nothing matches', async () => {
        const catalog = await loadCatalog();

        try {
            findGuide(catalog, 'nope');
            expect.unreachable('should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(ToolError);
            expect((error as ToolError).structuredContent.availableGuides).toEqual(['installation', 'configuration', 'theming/styled', 'tailwind']);
        }
    });
});

describe('findSection', () => {
    it('matches ids and labels loosely', async () => {
        const button = findComponent(await loadCatalog(), 'button');

        expect(findSection(button.sections, 'basic')?.id).toBe('basic');
        expect(findSection(button.sections, 'Button Group')?.id).toBe('buttongroup');
        expect(findSection(button.sections, 'group')?.id).toBe('buttongroup');
        expect(findSection(button.sections, 'nope')).toBeUndefined();
    });
});

describe('selectors', () => {
    it('splits comma-separated selectors and extracts attribute names', () => {
        expect(splitSelectors('p-autoComplete, p-autocomplete, p-auto-complete')).toEqual(['p-autoComplete', 'p-autocomplete', 'p-auto-complete']);
        expect(splitSelectors(undefined)).toEqual([]);
        expect(attributeSelectorName('[pTooltip]')).toBe('pTooltip');
        expect(attributeSelectorName('[pButton][type=button]')).toBeUndefined();
        expect(attributeSelectorName('p-button')).toBeUndefined();
    });
});
