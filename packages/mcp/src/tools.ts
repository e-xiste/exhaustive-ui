import { z } from 'zod';
import { findComponent, findGuide, findSection, requireSection } from './catalog';
import { RESOURCE_BASE_URI } from './config';
import { ToolError, describeError } from './errors';
import { searchCatalog } from './search';
import type { DocsSource, SourceStatus } from './source';
import { compact, expandTerm, slugify, unique } from './text';
import type { Catalog, ComponentEntry, GuideEntry, SectionEntry } from './types';
import { formatIssues, validateComponentUsage } from './validate';

// ---------------------------------------------------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------------------------------------------------

export interface ToolResult {
    [key: string]: unknown;
    content: { type: 'text'; text: string }[];
    structuredContent: Record<string, unknown>;
    isError?: boolean;
}

/**
 * Every tool answers with structured content plus its JSON serialization as text, so clients that only forward text
 * content still see the whole answer. `summary` is a one-line description of the result.
 */
export function ok(structured: Record<string, unknown>, summary: string): ToolResult {
    const structuredContent = { summary, ...structured };

    return { content: [{ type: 'text', text: JSON.stringify(structuredContent, null, 2) }], structuredContent };
}

export function fail(message: string, structured: Record<string, unknown> = {}): ToolResult {
    const structuredContent = { summary: message, error: message, ...structured };

    return { content: [{ type: 'text', text: JSON.stringify(structuredContent, null, 2) }], structuredContent, isError: true };
}

/** Turn thrown errors into error results instead of protocol failures. */
export async function guard(run: () => Promise<ToolResult>): Promise<ToolResult> {
    try {
        return await run();
    } catch (error) {
        return error instanceof ToolError ? fail(error.message, error.structuredContent) : fail(describeError(error));
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------------------------------------------------

export interface ToolContext {
    serverName: string;
    serverVersion: string;
    source: DocsSource;
    catalog(): Promise<Catalog>;
    sourceStatus(): SourceStatus;
}

export const TOOL_NAMES = ['list', 'search', 'get_component', 'get_guide', 'get_example', 'get_setup', 'validate_usage', 'version'] as const;

export const STATIC_RESOURCE_URIS = [`${RESOURCE_BASE_URI}/llms.txt`, `${RESOURCE_BASE_URI}/llms-full.txt`, `${RESOURCE_BASE_URI}/manifest.json`, `${RESOURCE_BASE_URI}/components.json`];

export const RESOURCE_TEMPLATE_NAMES = ['component-docs', 'component-api', 'guide-docs', 'example-docs'];

export const PROMPT_NAMES = ['use_component', 'build_form', 'theme_component', 'migrate_from_primeng', 'audit_component_usage'] as const;

// ---------------------------------------------------------------------------------------------------------------------
// Input schemas
// ---------------------------------------------------------------------------------------------------------------------

export const listInput = {
    kind: z.enum(['components', 'directives', 'guides', 'examples', 'resources']).default('components').describe('What to list.'),
    limit: z.number().int().min(1).max(200).default(50),
    offset: z.number().int().min(0).default(0)
};

export const searchInput = {
    query: z.string().min(1).describe('Free text: component names, features ("lazy loading"), API members ("onRowSelect"), guide topics.'),
    scope: z
        .enum(['all', 'components', 'guides', 'api', 'examples'])
        .default('all')
        .describe('"all" searches components and guides; "api" searches inputs, outputs, templates, methods, PT keys, CSS classes and tokens; "examples" searches code examples.'),
    limit: z.number().int().min(1).max(50).default(10),
    offset: z.number().int().min(0).default(0)
};

const componentRequest = z.object({
    component: z.string().min(1).describe('Component name, selector, class name or docs URL (e.g. "button", "p-button", "Table", "dropdown").'),
    sections: z.array(z.string()).optional().describe('Restrict to these section ids or labels.'),
    includeApi: z.boolean().default(false).describe('Include the API (inputs, outputs, templates, methods, PT keys, CSS classes, tokens) and compiled declarations.'),
    includeExamples: z.boolean().default(false).describe('Include the code of every example section.'),
    detail: z.enum(['compact', 'full']).default('compact').describe('"full" also returns the complete Markdown document.')
});

export const getComponentInput = {
    ...componentRequest.shape,
    component: componentRequest.shape.component.optional(),
    components: z.array(z.unknown()).max(10).optional().describe('Batch form: up to 10 single-component requests.')
};

export const getGuideInput = {
    guide: z.string().min(1).describe('Guide name or route: "installation", "configuration", "theming/styled", "tailwind", "guides/accessibility"...'),
    section: z.string().optional().describe('Section id or label to focus on.'),
    detail: z.enum(['compact', 'full']).default('compact').describe('"full" also returns the complete Markdown document.')
};

export const getExampleInput = {
    component: z.string().min(1),
    section: z.string().optional().describe('Section id or label ("basic", "lazy", "Template"...). Defaults to the first section with code.'),
    variant: z.string().optional().describe('Feature hint used when no section matches ("outlined", "severity", "icons"...).')
};

export const getSetupInput = {
    environment: z.string().optional().describe('What to set up: "angular-cli" (default), "configuration", "styled", "unstyled", "tailwind", "icons", "custom-icons", "passthrough".')
};

const usageRequest = z.object({
    component: z.string().min(1),
    code: z.string().min(1).describe('Angular template or component source using the component.')
});

export const validateUsageInput = {
    component: usageRequest.shape.component.optional(),
    code: usageRequest.shape.code.optional(),
    usages: z.array(z.unknown()).max(10).optional().describe('Batch form: up to 10 { component, code } items.')
};

export const versionInput = {};

type ListInput = z.infer<z.ZodObject<typeof listInput>>;
type SearchInput = z.infer<z.ZodObject<typeof searchInput>>;
type ComponentRequest = z.infer<typeof componentRequest>;
type GetComponentInput = z.infer<z.ZodObject<typeof getComponentInput>>;
type GetGuideInput = z.infer<z.ZodObject<typeof getGuideInput>>;
type GetExampleInput = z.infer<z.ZodObject<typeof getExampleInput>>;
type GetSetupInput = z.infer<z.ZodObject<typeof getSetupInput>>;
type UsageRequest = z.infer<typeof usageRequest>;
type ValidateUsageInput = z.infer<z.ZodObject<typeof validateUsageInput>>;

// ---------------------------------------------------------------------------------------------------------------------
// Summaries shared by several tools
// ---------------------------------------------------------------------------------------------------------------------

function componentSummary(component: ComponentEntry): Record<string, unknown> {
    return {
        name: component.name,
        title: component.title,
        description: component.description,
        selectors: component.selectors,
        import: component.import,
        modules: component.modules,
        resourceUri: component.resourceUri,
        apiResourceUri: component.apiResourceUri,
        publicUrl: component.publicUrl,
        markdownUrl: component.markdownUrl
    };
}

function guideSummary(guide: GuideEntry): Record<string, unknown> {
    return {
        name: guide.name,
        title: guide.title,
        description: guide.description,
        route: guide.route,
        resourceUri: guide.resourceUri,
        publicUrl: guide.publicUrl,
        markdownUrl: guide.markdownUrl
    };
}

function sectionSummary(section: SectionEntry): Record<string, unknown> {
    return { id: section.id, label: section.label, description: section.description, hasCode: section.hasCode, codeLanguage: section.codeLanguage };
}

function exampleCall(component: ComponentEntry, section: SectionEntry): Record<string, unknown> {
    return { tool: 'get_example', arguments: { component: component.name, section: section.id } };
}

export function resourceEntries(catalog: Catalog): Record<string, unknown>[] {
    const base = RESOURCE_BASE_URI;
    const entries: Record<string, unknown>[] = [
        { uri: `${base}/llms.txt`, type: 'index', name: 'llms.txt', title: 'ExhaustiveUI llms.txt', mimeType: 'text/plain', publicUrl: `${catalog.site}/llms/llms.txt` },
        { uri: `${base}/llms-full.txt`, type: 'index', name: 'llms-full.txt', title: 'ExhaustiveUI llms-full.txt', mimeType: 'text/plain', publicUrl: `${catalog.site}/llms/llms-full.txt` },
        { uri: `${base}/manifest.json`, type: 'manifest', name: 'manifest.json', title: 'ExhaustiveUI API manifest', mimeType: 'application/json', publicUrl: `${catalog.site}/llms/manifest.json` },
        { uri: `${base}/components.json`, type: 'index', name: 'components.json', title: 'ExhaustiveUI components index', mimeType: 'application/json', publicUrl: `${catalog.site}/llms/components.json` }
    ];

    for (const component of catalog.components) {
        entries.push({ uri: component.resourceUri, type: 'component', name: component.name, title: component.title, mimeType: 'text/markdown', publicUrl: component.markdownUrl });
        entries.push({ uri: component.apiResourceUri, type: 'component-api', name: component.name, title: `${component.title} API`, mimeType: 'application/json' });
    }

    for (const guide of catalog.guides) {
        entries.push({ uri: guide.resourceUri, type: 'guide', name: guide.name, title: guide.title, mimeType: 'text/markdown', publicUrl: guide.markdownUrl });
    }

    return entries;
}

// ---------------------------------------------------------------------------------------------------------------------
// list
// ---------------------------------------------------------------------------------------------------------------------

export async function listTool(ctx: ToolContext, input: ListInput): Promise<ToolResult> {
    const catalog = await ctx.catalog();
    let items: Record<string, unknown>[];

    switch (input.kind) {
        case 'components':
            items = catalog.components.map(componentSummary);
            break;
        case 'directives':
            items = catalog.directives.map((directive) => ({ ...directive }));
            break;
        case 'guides':
            items = catalog.guides.map(guideSummary);
            break;
        case 'examples':
            items = catalog.components.flatMap((component) =>
                component.sections.filter((section) => section.hasCode).map((section) => ({ component: component.name, section: section.id, title: section.label, codeLanguage: section.codeLanguage, nextCall: exampleCall(component, section) }))
            );
            break;
        case 'resources':
            items = resourceEntries(catalog);
            break;
    }

    const page = items.slice(input.offset, input.offset + input.limit);

    return ok({ kind: input.kind, total: items.length, limit: input.limit, offset: input.offset, items: page }, `${page.length} of ${items.length} ${input.kind} returned.`);
}

// ---------------------------------------------------------------------------------------------------------------------
// search
// ---------------------------------------------------------------------------------------------------------------------

export async function searchTool(ctx: ToolContext, input: SearchInput): Promise<ToolResult> {
    const catalog = await ctx.catalog();
    const hits = searchCatalog(catalog, input.query, input.scope);
    const page = hits.slice(input.offset, input.offset + input.limit);

    return ok({ query: input.query, scope: input.scope, total: hits.length, limit: input.limit, offset: input.offset, results: page }, `${page.length} of ${hits.length} result${hits.length === 1 ? '' : 's'} for "${input.query}".`);
}

// ---------------------------------------------------------------------------------------------------------------------
// get_component
// ---------------------------------------------------------------------------------------------------------------------

export async function getComponentTool(ctx: ToolContext, input: GetComponentInput): Promise<ToolResult> {
    if (input.components !== undefined) {
        if (input.component !== undefined || input.sections !== undefined || input.includeApi || input.includeExamples || input.detail !== 'compact') {
            throw new ToolError('Use either the single-component fields or "components", not both.');
        }

        return batch(input.components, componentRequest, 'component', (item) => getSingleComponent(ctx, item));
    }

    if (!input.component) {
        throw new ToolError('"component" is required.');
    }

    return getSingleComponent(ctx, { ...input, component: input.component });
}

async function getSingleComponent(ctx: ToolContext, input: ComponentRequest): Promise<ToolResult> {
    const catalog = await ctx.catalog();
    const component = findComponent(catalog, input.component);
    const sections = input.sections?.length ? input.sections.map((query) => requireSection(component.sections, query)) : component.sections;
    const withCode = sections.filter((section) => section.hasCode);
    const document = input.detail === 'full' ? await ctx.source.readText(component.docPath) : undefined;

    const result: Record<string, unknown> = {
        ...componentSummary(component),
        route: component.route,
        declarations: component.declarations.map((declaration) => ({ kind: declaration.kind, className: declaration.className, selector: declaration.selector, forms: declaration.forms, standalone: declaration.standalone })),
        sections: sections.map(sectionSummary),
        examplesAvailable: withCode.map((section) => ({ section: section.id, title: section.label, codeLanguage: section.codeLanguage, nextCall: exampleCall(component, section) }))
    };

    if (input.includeExamples) {
        result.examples = withCode.map((section) => ({ section: section.id, title: section.label, description: section.description, codeLanguage: section.codeLanguage, code: section.code }));
    }

    if (input.includeApi) {
        result.api = component.api;
        result.compiled = component.declarations;
    }

    if (document !== undefined) {
        result.document = document;
    }

    const next = withCode[0] ? ` Next: get_example ${JSON.stringify({ component: component.name, section: withCode[0].id })}.` : '';

    return ok({ component: result }, `${component.title}: ${sections.length} section${sections.length === 1 ? '' : 's'}, ${withCode.length} with code; source ${component.resourceUri}.${next}`);
}

// ---------------------------------------------------------------------------------------------------------------------
// get_guide
// ---------------------------------------------------------------------------------------------------------------------

export async function getGuideTool(ctx: ToolContext, input: GetGuideInput): Promise<ToolResult> {
    const catalog = await ctx.catalog();
    const guide = findGuide(catalog, input.guide);
    const section = input.section ? requireSection(guide.sections, input.section) : undefined;
    const document = input.detail === 'full' ? await ctx.source.readText(guide.docPath) : undefined;

    return ok(
        {
            guide: {
                ...guideSummary(guide),
                section: section ? { ...sectionSummary(section), code: section.code } : undefined,
                sections: guide.sections.map(sectionSummary),
                document
            }
        },
        `${guide.title} guide: ${guide.sections.length} section${guide.sections.length === 1 ? '' : 's'}; source ${guide.resourceUri}.`
    );
}

// ---------------------------------------------------------------------------------------------------------------------
// get_example
// ---------------------------------------------------------------------------------------------------------------------

/** Section ids the usual feature words map to. */
const VARIANT_SECTIONS: Record<string, string[]> = {
    basic: ['basic'],
    default: ['basic'],
    primary: ['basic'],
    danger: ['severity'],
    error: ['severity', 'invalid'],
    warning: ['severity'],
    success: ['severity'],
    busy: ['loading'],
    spinner: ['loading'],
    outline: ['outlined'],
    icon: ['icons', 'icon'],
    size: ['sizes'],
    small: ['sizes'],
    large: ['sizes'],
    pagination: ['paginator', 'page'],
    page: ['paginator'],
    paging: ['paginator'],
    sorting: ['sort', 'singlecolumnsort', 'multiplecolumnssort'],
    sortable: ['sort', 'singlecolumnsort'],
    filtering: ['filter', 'filterbasic', 'filteradvanced'],
    filters: ['filter', 'filterbasic'],
    select: ['selection', 'singleselection', 'multipleselection', 'checkboxselection', 'radiobuttonselection'],
    selected: ['selection'],
    checkbox: ['checkboxselection', 'checkbox'],
    form: ['reactiveforms', 'forms', 'templatedrivenforms'],
    forms: ['reactiveforms', 'forms', 'templatedrivenforms'],
    reactive: ['reactiveforms'],
    ngmodel: ['templatedrivenforms', 'forms'],
    lazy: ['lazy', 'lazyload', 'virtualscroll'],
    virtual: ['virtualscroll', 'lazy'],
    template: ['template', 'templates', 'customtemplate'],
    templating: ['template'],
    disabled: ['disabled'],
    invalid: ['invalid'],
    accessible: ['accessibility']
};

export async function getExampleTool(ctx: ToolContext, input: GetExampleInput): Promise<ToolResult> {
    const catalog = await ctx.catalog();
    const component = findComponent(catalog, input.component);
    const withCode = component.sections.filter((section) => section.hasCode);

    if (withCode.length === 0) {
        throw new ToolError(`No code example is available for ${component.title}.`, exampleFailure(component, input, undefined));
    }

    const query = input.section ?? input.variant;
    let section: SectionEntry | undefined;

    if (query) {
        section = findSection(component.sections, query) ?? bestSection(component.sections, [input.section, input.variant]);
    } else {
        section = withCode.find((entry) => compact(entry.id) === 'basic') ?? withCode[0];
    }

    if (!section) {
        throw new ToolError(`No section of ${component.title} matches ${describeRequest(input)}.`, exampleFailure(component, input, undefined));
    }

    if (!section.hasCode) {
        const alternative = input.variant ? bestSection(withCode, [input.variant]) : undefined;

        if (alternative) {
            section = alternative;
        } else {
            throw new ToolError(`Section "${section.id}" of ${component.title} has no code example.`, exampleFailure(component, input, section));
        }
    }

    return ok(
        {
            component: component.name,
            title: component.title,
            section: section.id,
            sectionTitle: section.label,
            requestedSection: input.section,
            requestedVariant: input.variant,
            description: section.description,
            codeLanguage: section.codeLanguage,
            code: section.code,
            import: component.import,
            resourceUri: component.resourceUri,
            publicUrl: component.publicUrl
        },
        `${component.title} "${section.label}" example (${section.codeLanguage}).`
    );
}

function describeRequest(input: GetExampleInput): string {
    return [input.section ? `section "${input.section}"` : '', input.variant ? `variant "${input.variant}"` : ''].filter(Boolean).join(' and ') || 'the request';
}

function bestSection(sections: readonly SectionEntry[], hints: (string | undefined)[]): SectionEntry | undefined {
    const terms = unique(
        hints
            .filter((hint): hint is string => !!hint)
            .flatMap((hint) => {
                const slug = slugify(hint);

                return [slug, ...(VARIANT_SECTIONS[slug] ?? []), ...slug.split('-').flatMap((part) => [part, ...(VARIANT_SECTIONS[part] ?? []), ...expandTerm(part)])];
            })
            .map(compact)
            .filter((term) => term.length > 1)
    );

    const scored = sections
        .map((section, index) => {
            const keys = [compact(section.id), compact(section.label)];
            const text = `${section.label} ${section.description ?? ''}`.toLowerCase();
            let score = 0;

            if (keys.some((key) => terms.includes(key))) {
                score += 100;
            }

            if (keys.some((key) => terms.some((term) => term.length > 3 && (key.includes(term) || term.includes(key))))) {
                score += 60;
            }

            if (terms.some((term) => term.length > 3 && text.includes(term))) {
                score += 30;
            }

            if (score > 0 && section.hasCode) {
                score += 10;
            }

            return { section, index, score };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score || a.index - b.index);

    return scored[0]?.section;
}

function exampleFailure(component: ComponentEntry, input: GetExampleInput, selected: SectionEntry | undefined): Record<string, unknown> {
    const withCode = component.sections.filter((section) => section.hasCode);
    const suggested = bestSection(withCode, [input.section, input.variant]);
    const props = (component.api.props ?? []).filter((prop) => !/^aria/i.test(prop.name));
    const hints = unique([input.section, input.variant].filter((hint): hint is string => !!hint).flatMap((hint) => expandTerm(hint)));

    return {
        component: component.name,
        requestedSection: input.section ?? selected?.id,
        requestedVariant: input.variant,
        availableSections: component.sections.map((section) => section.id),
        sectionsWithCode: withCode.map((section) => section.id),
        suggestedSections: unique([suggested?.id, ...withCode.slice(0, 5).map((section) => section.id)].filter((id): id is string => !!id)),
        suggestedApiProps: props
            .filter((prop) => hints.some((hint) => slugify(prop.name).includes(hint) || (prop.description ?? '').toLowerCase().includes(hint)))
            .slice(0, 8)
            .map((prop) => ({ name: prop.name, type: prop.type, description: prop.description })),
        apiAvailable: props.length > 0,
        sourceBackedCodeAvailable: withCode.length > 0,
        componentResourceUri: component.resourceUri,
        apiResourceUri: component.apiResourceUri,
        nextCall: suggested ? exampleCall(component, suggested) : { tool: 'get_component', arguments: { component: component.name, includeApi: true } }
    };
}

// ---------------------------------------------------------------------------------------------------------------------
// get_setup
// ---------------------------------------------------------------------------------------------------------------------

const SETUP_ENVIRONMENTS: { environment: string; guide: string; aliases: string[] }[] = [
    { environment: 'angular-cli', guide: 'installation', aliases: ['angular', 'cli', 'ng', 'npm', 'pnpm', 'yarn', 'install', 'installation', 'setup', 'getting-started', 'quickstart', 'start', 'default'] },
    { environment: 'configuration', guide: 'configuration', aliases: ['config', 'configure', 'provideexhaustiveui', 'providers', 'app-config', 'ripple', 'zindex', 'locale', 'translation'] },
    { environment: 'styled', guide: 'theming/styled', aliases: ['theme', 'themes', 'theming', 'preset', 'presets', 'aura', 'lara', 'nora', 'material', 'design-tokens', 'tokens', 'dark-mode', 'css-variables'] },
    { environment: 'unstyled', guide: 'theming/unstyled', aliases: ['headless', 'no-theme'] },
    { environment: 'tailwind', guide: 'tailwind', aliases: ['tailwindcss', 'tailwind-css', 'tw'] },
    { environment: 'icons', guide: 'icons', aliases: ['icon', 'openng-icons', 'primeicons'] },
    { environment: 'custom-icons', guide: 'customicons', aliases: ['customicons', 'custom-icon', 'font-awesome', 'material-icons', 'svg-icons'] },
    { environment: 'passthrough', guide: 'passthrough', aliases: ['pass-through', 'pt'] }
];

export async function getSetupTool(ctx: ToolContext, input: GetSetupInput): Promise<ToolResult> {
    const catalog = await ctx.catalog();
    const requested = input.environment?.trim();
    const key = compact(requested ?? 'angular-cli');
    const match = SETUP_ENVIRONMENTS.find((entry) => compact(entry.environment) === key || entry.aliases.some((alias) => compact(alias) === key));
    let guide: GuideEntry | undefined;

    if (match) {
        guide = findGuide(catalog, match.guide);
    } else if (requested) {
        try {
            guide = findGuide(catalog, requested);
        } catch {
            guide = undefined;
        }
    }

    if (!guide) {
        throw new ToolError(`Setup environment "${requested}" is unsupported. Valid environments: ${SETUP_ENVIRONMENTS.map((entry) => entry.environment).join(', ')}.`, {
            environment: requested,
            validEnvironments: SETUP_ENVIRONMENTS.map((entry) => entry.environment),
            candidates: SETUP_ENVIRONMENTS.map((entry) => ({ environment: entry.environment, guide: entry.guide, aliases: entry.aliases }))
        });
    }

    const document = await ctx.source.readText(guide.docPath);

    return ok(
        {
            environment: match?.environment ?? guide.name,
            guide: { ...guideSummary(guide), sections: guide.sections.map(sectionSummary), document },
            relatedGuides: SETUP_ENVIRONMENTS.filter((entry) => entry.guide !== match?.guide).map((entry) => ({ environment: entry.environment, nextCall: { tool: 'get_setup', arguments: { environment: entry.environment } } }))
        },
        `${guide.title} setup docs returned (${match?.environment ?? guide.name}).`
    );
}

// ---------------------------------------------------------------------------------------------------------------------
// validate_usage
// ---------------------------------------------------------------------------------------------------------------------

export async function validateUsageTool(ctx: ToolContext, input: ValidateUsageInput): Promise<ToolResult> {
    if (input.usages !== undefined) {
        if (input.component !== undefined || input.code !== undefined) {
            throw new ToolError('Use either the single usage fields or "usages", not both.');
        }

        return batch(input.usages, usageRequest, 'usage', (item) => validateSingleUsage(ctx, item));
    }

    if (!input.component || !input.code) {
        throw new ToolError('"component" and "code" are required.');
    }

    return validateSingleUsage(ctx, { component: input.component, code: input.code });
}

async function validateSingleUsage(ctx: ToolContext, input: UsageRequest): Promise<ToolResult> {
    const catalog = await ctx.catalog();
    const component = findComponent(catalog, input.component);
    const issues = validateComponentUsage(catalog, component, input.code);
    const errors = issues.filter((issue) => issue.severity === 'error');
    const structured = { component: component.name, title: component.title, selectors: component.selectors, valid: errors.length === 0, issues, apiResourceUri: component.apiResourceUri };

    if (errors.length > 0) {
        return fail(formatIssues(component.title, issues), structured);
    }

    return ok(structured, issues.length > 0 ? `${component.title} usage is valid, with ${issues.length} warning${issues.length === 1 ? '' : 's'}.` : `${component.title} usage is valid against the compiled API.`);
}

// ---------------------------------------------------------------------------------------------------------------------
// version
// ---------------------------------------------------------------------------------------------------------------------

export async function versionTool(ctx: ToolContext): Promise<ToolResult> {
    const status = ctx.sourceStatus();
    let data: Record<string, unknown>;

    try {
        const catalog = await ctx.catalog();

        data = {
            libraryVersion: catalog.libraryVersion,
            docsVersion: catalog.docsVersion,
            generatedAt: catalog.generatedAt,
            site: catalog.site,
            counts: {
                components: catalog.components.length,
                directives: catalog.directives.length,
                guides: catalog.guides.length,
                examples: catalog.components.reduce((sum, component) => sum + component.sections.filter((section) => section.hasCode).length, 0)
            }
        };
    } catch (error) {
        data = { error: describeError(error) };
    }

    return ok(
        {
            server: { name: ctx.serverName, version: ctx.serverVersion },
            data,
            source: status,
            tools: [...TOOL_NAMES],
            resources: { static: STATIC_RESOURCE_URIS, templates: RESOURCE_TEMPLATE_NAMES },
            prompts: [...PROMPT_NAMES]
        },
        `${ctx.serverName} ${ctx.serverVersion}; ${TOOL_NAMES.length} tools; docs from ${status.mode === 'offline' ? 'the offline snapshot' : status.docsUrl}.`
    );
}

// ---------------------------------------------------------------------------------------------------------------------
// Batch helper
// ---------------------------------------------------------------------------------------------------------------------

async function batch<T>(items: unknown[], schema: z.ZodType<T>, label: string, run: (item: T) => Promise<ToolResult>): Promise<ToolResult> {
    if (items.length === 0) {
        throw new ToolError(`"${label}s" must contain at least one item.`);
    }

    const results: Record<string, unknown>[] = [];

    for (const [index, item] of items.entries()) {
        const parsed = schema.safeParse(item);

        if (!parsed.success) {
            results.push({ index, status: 'error', error: `Invalid ${label} item: ${parsed.error.issues.map((issue) => `${issue.path.join('.') || label}: ${issue.message}`).join('; ')}.` });
            continue;
        }

        const result = await guard(() => run(parsed.data));

        results.push({ index, status: result.isError ? 'error' : 'success', ...result.structuredContent });
    }

    const succeeded = results.filter((result) => result.status === 'success').length;

    return ok({ total: results.length, succeeded, failed: results.length - succeeded, results }, `${succeeded} of ${results.length} ${label} request${results.length === 1 ? '' : 's'} succeeded.`);
}
