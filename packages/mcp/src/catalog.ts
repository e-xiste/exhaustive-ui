import { RESOURCE_BASE_URI } from './config';
import { ToolError } from './errors';
import type { DocsSource } from './source';
import { compact, expandTerm, shortTitle, slugify, unique } from './text';
import type { Catalog, CodeLanguage, ComponentEntry, ComponentsJson, DirectiveEntry, GuideEntry, ManifestEntryPoint, ManifestJson, RawSection, SectionEntry } from './types';

/** Names PrimeNG users (and older ExhaustiveUI versions) may still use for a component. */
export const COMPONENT_ALIASES: Record<string, string> = {
    calendar: 'datepicker',
    chips: 'autocomplete',
    'data-table': 'table',
    datatable: 'table',
    dropdown: 'select',
    'file-input': 'fileinput',
    'inplace-editor': 'inplace',
    inputswitch: 'toggleswitch',
    mentions: 'mention',
    overlaypanel: 'popover',
    sidebar: 'drawer',
    tabview: 'tabs',
    virtualscroller: 'scroller'
};

export interface BuildCatalogOptions {
    resourceBaseUri?: string;
}

/** Normalize the two generated indexes into one catalog. */
export function buildCatalog(componentsJson: ComponentsJson, manifest: ManifestJson, options: BuildCatalogOptions = {}): Catalog {
    const base = (options.resourceBaseUri ?? RESOURCE_BASE_URI).replace(/\/+$/, '');
    const site = manifest.site.replace(/\/+$/, '');
    const entryPoints = new Map<string, ManifestEntryPoint>(manifest.entryPoints.map((entryPoint) => [entryPoint.name, entryPoint]));
    const guideNames = new Set(componentsJson.pages.map((page) => page.name));

    const guides: GuideEntry[] = componentsJson.pages.map((page) => ({
        kind: 'guide',
        name: page.name,
        title: page.title,
        description: page.description ?? '',
        route: `/${page.path}`,
        publicUrl: `${site}/${page.path}`,
        markdownUrl: `${site}/llms/pages/${page.name}.md`,
        docPath: `pages/${page.name}.md`,
        resourceUri: `${base}/pages/${page.name}.md`,
        sections: page.sections.map(normalizeSection)
    }));

    const components: ComponentEntry[] = componentsJson.components
        // The generator lists every docs route as a component, including the LLMs page itself: a route with no compiled
        // entry point and no code example documents nothing from the library.
        .filter((component) => entryPoints.has(component.name) || (!guideNames.has(component.name) && component.sections.some((section) => section.examples?.typescript || section.examples?.html)))
        .map((component) => {
            const entryPoint = entryPoints.get(component.name);
            const declarations = (entryPoint?.declarations ?? []).filter((declaration) => !declaration.internal);

            return {
                kind: 'component',
                name: component.name,
                title: component.title,
                description: component.description ?? '',
                route: `/${component.name}`,
                publicUrl: `${site}/${component.name}`,
                markdownUrl: `${site}/llms/components/${component.name}.md`,
                docPath: `components/${component.name}.md`,
                cardPath: `cards/${component.name}.md`,
                cardUrl: `${site}/llms/cards/${component.name}.md`,
                resourceUri: `${base}/components/${component.name}.md`,
                apiResourceUri: `${base}/components/${component.name}/api.json`,
                import: entryPoint?.import,
                modules: entryPoint?.modules ?? [],
                selectors: unique(declarations.flatMap((declaration) => splitSelectors(declaration.selector))),
                declarations,
                sections: component.sections.map(normalizeSection),
                api: component.api ?? {}
            };
        });

    const componentNames = new Set(components.map((component) => component.name));
    const directives: DirectiveEntry[] = manifest.entryPoints.flatMap((entryPoint) =>
        (entryPoint.declarations ?? [])
            .filter((declaration) => !declaration.internal)
            .filter((declaration) => declaration.kind === 'directive' && declaration.selector)
            .map((declaration) => ({
                className: declaration.className,
                selector: declaration.selector!,
                entryPoint: entryPoint.name,
                import: entryPoint.import,
                description: declaration.description,
                component: componentNames.has(entryPoint.name) ? entryPoint.name : undefined
            }))
    );

    const parts: ComponentEntry[] = manifest.entryPoints
        .filter((entryPoint) => !componentNames.has(entryPoint.name) && !entryPoint.name.startsWith('icons/') && entryPoint.declarations?.some((declaration) => declaration.selector))
        .map((entryPoint) => {
            const declarations = (entryPoint.declarations ?? []).filter((declaration) => !declaration.internal);
            const title = declarations[0]!.className;

            return {
                kind: 'component',
                name: entryPoint.name,
                title,
                description: entryPoint.description ?? '',
                route: `/${entryPoint.name}`,
                publicUrl: `${site}/${entryPoint.name}`,
                markdownUrl: `${site}/llms/components/${entryPoint.name}.md`,
                docPath: `components/${entryPoint.name}.md`,
                cardPath: `cards/${entryPoint.name}.md`,
                cardUrl: `${site}/llms/cards/${entryPoint.name}.md`,
                resourceUri: `${base}/components/${entryPoint.name}.md`,
                apiResourceUri: `${base}/components/${entryPoint.name}/api.json`,
                import: entryPoint.import,
                modules: entryPoint.modules ?? [],
                selectors: unique(declarations.flatMap((declaration) => splitSelectors(declaration.selector))),
                declarations,
                sections: [],
                api: {}
            };
        });

    return {
        libraryVersion: manifest.version,
        docsVersion: componentsJson.version,
        generatedAt: componentsJson.generatedAt,
        site,
        components,
        parts,
        guides,
        directives
    };
}

function normalizeSection(section: RawSection): SectionEntry {
    const examples = section.examples ?? undefined;
    const [code, codeLanguage] = pickCode(examples);

    return {
        id: section.id,
        label: section.label,
        description: section.description || undefined,
        hasCode: code !== undefined,
        codeLanguage,
        code
    };
}

function pickCode(examples: RawSection['examples']): [string | undefined, CodeLanguage | undefined] {
    if (examples?.typescript?.trim()) {
        return [examples.typescript, 'typescript'];
    }

    if (examples?.html?.trim()) {
        return [examples.html, 'html'];
    }

    if (examples?.command?.trim()) {
        return [examples.command, 'bash'];
    }

    return [undefined, undefined];
}

/** "p-autoComplete, p-autocomplete, p-auto-complete" -> three selectors. */
export function splitSelectors(selector: string | undefined): string[] {
    return (selector ?? '')
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);
}

/** Attribute name of an attribute selector ("[pTooltip]" -> "pTooltip"), or undefined for element selectors. */
export function attributeSelectorName(selector: string): string | undefined {
    const match = /^\[([^\]=]+)(?:=[^\]]*)?\]$/.exec(selector.trim());

    return match?.[1];
}

/** Every spelling under which a component can be requested. */
function componentKeys(component: ComponentEntry): string[] {
    const keys = [component.name, shortTitle(component.title), component.import?.split('/').pop() ?? ''];

    for (const selector of component.selectors) {
        const attribute = attributeSelectorName(selector);

        keys.push(attribute ?? selector, (attribute ?? selector).replace(/^p-?/i, ''));
    }

    for (const declaration of component.declarations) {
        keys.push(declaration.className);
    }

    return unique(keys.map(compact).filter(Boolean));
}

/** Resolve a component by name, title, selector, class name, alias, route or URL. */
export function findComponent(catalog: Catalog, query: string): ComponentEntry {
    const raw = query.trim();
    const lastSegment = raw
        .replace(/^https?:\/\/[^/]+/, '')
        .replace(/^exhaustive-ui:\/\/docs/, '')
        .replace(/\.md$/, '')
        .replace(/\/api\.json$/, '')
        .split('/')
        .filter(Boolean)
        .pop();
    const candidates = unique([raw, lastSegment ?? raw].map(compact).filter(Boolean));
    const aliased = candidates.map((candidate) => COMPONENT_ALIASES[candidate]).filter((name): name is string => !!name);

    for (const candidate of [...candidates, ...aliased.map(compact)]) {
        const exact = catalog.components.find((component) => component.name === candidate) ?? catalog.components.find((component) => componentKeys(component).includes(candidate));

        if (exact) {
            return exact;
        }
    }

    const suggestions = suggestComponents(catalog, raw);

    throw new ToolError(`Component "${query}" not found.${suggestions.length ? ` Did you mean: ${suggestions.join(', ')}?` : ''}`, {
        component: query,
        suggestions,
        nextCall: { tool: 'list', arguments: { kind: 'components' } }
    });
}

export function suggestComponents(catalog: Catalog, query: string, limit = 5): string[] {
    const needle = compact(query);
    const terms = expandTerm(query).map(compact);
    const scored = catalog.components
        .map((component) => {
            const keys = componentKeys(component);
            let score = 0;

            if (needle && keys.some((key) => key.startsWith(needle) || needle.startsWith(key))) {
                score += 10;
            }

            if (needle && keys.some((key) => editDistance(key, needle) <= Math.max(1, Math.floor(needle.length / 4)))) {
                score += 8;
            }

            if (needle && keys.some((key) => key.includes(needle) || needle.includes(key))) {
                score += 5;
            }

            if (needle.length >= 4 && keys.some((key) => key.slice(0, 4) === needle.slice(0, 4))) {
                score += 3;
            }

            if (terms.some((term) => keys.some((key) => key.includes(term)))) {
                score += 2;
            }

            return { name: component.name, score };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

    return scored.slice(0, limit).map((entry) => entry.name);
}

/** Levenshtein distance, for "did you mean" suggestions on short names. */
function editDistance(a: string, b: string): number {
    if (a === b) {
        return 0;
    }

    let previous = Array.from({ length: b.length + 1 }, (_, index) => index);

    for (let i = 1; i <= a.length; i++) {
        const current = [i];

        for (let j = 1; j <= b.length; j++) {
            current[j] = Math.min(previous[j]! + 1, current[j - 1]! + 1, previous[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
        }

        previous = current;
    }

    return previous[b.length]!;
}

/** Resolve a guide by name ("installation"), route ("theming/styled"), title, markdown path or URL. */
export function findGuide(catalog: Catalog, query: string): GuideEntry {
    const normalized = normalizeGuidePath(query);
    const last = normalized.split('/').pop() ?? normalized;
    const byPath = catalog.guides.filter((guide) => guideKeys(guide).includes(normalized));

    if (byPath.length === 1) {
        return byPath[0]!;
    }

    const byName = catalog.guides.filter((guide) => [guide.name, slugify(guide.title), compact(guide.title)].includes(last) || compact(guide.name) === compact(last));

    if (byName.length === 1) {
        return byName[0]!;
    }

    const candidates = byPath.length > 1 ? byPath : byName;

    if (candidates.length > 1) {
        throw new ToolError(`Guide "${query}" is ambiguous. Use the full route of one of the candidates.`, {
            guide: query,
            candidates: candidates.map((guide) => ({ name: guide.name, title: guide.title, route: guide.route, resourceUri: guide.resourceUri }))
        });
    }

    throw new ToolError(`Guide "${query}" not found.`, {
        guide: query,
        availableGuides: catalog.guides.map((guide) => guide.route.slice(1)),
        nextCall: { tool: 'list', arguments: { kind: 'guides' } }
    });
}

function guideKeys(guide: GuideEntry): string[] {
    return unique([guide.name, guide.route.slice(1), guide.docPath.replace(/\.md$/, ''), slugify(guide.title)].map(normalizeGuidePath));
}

function normalizeGuidePath(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/^exhaustive-ui:\/\/docs\//, '')
        .replace(/^https?:\/\/[^/]+\//, '')
        .replace(/^llms\/pages\//, '')
        .replace(/^pages\//, '')
        .replace(/\.md$/, '')
        .split('/')
        .map(slugify)
        .filter(Boolean)
        .join('/');
}

/** Resolve a section of a component or guide by id or label; undefined when nothing matches. */
export function findSection(sections: readonly SectionEntry[], query: string): SectionEntry | undefined {
    const needle = compact(query);

    return sections.find((section) => compact(section.id) === needle || compact(section.label) === needle) ?? sections.find((section) => slugify(section.label).includes(slugify(query)));
}

export function requireSection(sections: readonly SectionEntry[], query: string): SectionEntry {
    const section = findSection(sections, query);

    if (!section) {
        throw new ToolError(`Section "${query}" not found.`, { section: query, availableSections: sections.map((entry) => entry.id) });
    }

    return section;
}

/** Loads and caches the catalog; a rebuild only happens when the source hands back different index documents. */
export class CatalogLoader {
    private cached: { components: string; manifest: string; catalog: Catalog } | undefined;

    constructor(
        private readonly source: DocsSource,
        private readonly options: BuildCatalogOptions = {}
    ) {}

    async load(): Promise<Catalog> {
        const [components, manifest] = await Promise.all([this.source.readText('components.json'), this.source.readText('manifest.json')]);

        if (this.cached && this.cached.components === components && this.cached.manifest === manifest) {
            return this.cached.catalog;
        }

        const catalog = buildCatalog(parseJson<ComponentsJson>(components, 'components.json'), parseJson<ManifestJson>(manifest, 'manifest.json'), this.options);

        this.cached = { components, manifest, catalog };

        return catalog;
    }
}

function parseJson<T>(text: string, name: string): T {
    try {
        return JSON.parse(text) as T;
    } catch (error) {
        throw new Error(`${name} is not valid JSON: ${(error as Error).message}`);
    }
}
