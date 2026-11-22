import { readFileSync } from 'node:fs';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { CatalogLoader, findComponent, findGuide, requireSection } from './catalog';
import { RESOURCE_BASE_URI, resolveConfig, type Env, type ServerConfig } from './config';
import { createDocsSource, type DocsSource, type FetchLike, type SourceStatus } from './source';
import {
    PROMPT_NAMES,
    getComponentInput,
    getComponentTool,
    getExampleInput,
    getExampleTool,
    getGuideInput,
    getGuideTool,
    getSetupInput,
    getSetupTool,
    guard,
    listInput,
    listTool,
    searchInput,
    searchTool,
    validateUsageInput,
    validateUsageTool,
    versionInput,
    versionTool,
    type ToolContext
} from './tools';
import type { Catalog, ComponentEntry } from './types';

export const SERVER_NAME = '@exhaustive-ui/mcp';

export interface CreateServerOptions {
    /** Environment to read EXHAUSTIVE_UI_* variables from; defaults to process.env. */
    env?: Env;
    /** Explicit configuration, taking precedence over the environment. */
    config?: Partial<ServerConfig>;
    /** Replace the configured docs source entirely (tests, embedding). */
    source?: DocsSource;
    /** Custom fetch for the live site (tests). */
    fetchImpl?: FetchLike;
    version?: string;
}

const readOnly = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const;

export function readPackageVersion(): string {
    try {
        const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version?: string };

        return pkg.version ?? '0.0.0';
    } catch {
        return '0.0.0';
    }
}

/** Build the tool context: configured docs source, catalog loader and status reporting. */
export function createToolContext(options: CreateServerOptions = {}): ToolContext {
    const config = resolveConfig(options.env ?? process.env, options.config);
    const configured = options.source ? { source: options.source, status: (): SourceStatus => ({ mode: 'offline', docsUrl: config.docsUrl, cacheTtlSeconds: 0 }) } : createDocsSource(config, options.fetchImpl);
    const loader = new CatalogLoader(configured.source);

    return {
        serverName: SERVER_NAME,
        serverVersion: options.version ?? readPackageVersion(),
        source: configured.source,
        catalog: () => loader.load(),
        sourceStatus: () => configured.status()
    };
}

export async function createExhaustiveUiMcpServer(options: CreateServerOptions = {}): Promise<McpServer> {
    const ctx = createToolContext(options);
    const server = new McpServer({ name: SERVER_NAME, version: ctx.serverVersion, title: 'ExhaustiveUI docs' }, { capabilities: { tools: {}, resources: {}, prompts: {} } });

    registerTools(server, ctx);
    registerResources(server, ctx);
    registerPrompts(server);

    return server;
}

export async function runExhaustiveUiMcpServer(options: CreateServerOptions = {}): Promise<void> {
    const server = await createExhaustiveUiMcpServer(options);
    const transport = new StdioServerTransport();

    await server.connect(transport);
    console.error(`${SERVER_NAME} running on stdio`);
}

// ---------------------------------------------------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------------------------------------------------

function registerTools(server: McpServer, ctx: ToolContext): void {
    server.registerTool(
        'list',
        {
            title: 'List ExhaustiveUI docs',
            description: 'List the ExhaustiveUI components, directives, guides, code examples or MCP resources.',
            inputSchema: listInput,
            annotations: readOnly
        },
        (input) => guard(() => listTool(ctx, input))
    );

    server.registerTool(
        'search',
        {
            title: 'Search ExhaustiveUI docs',
            description: 'Search the ExhaustiveUI component docs, guides, API members (inputs, outputs, templates, PT keys, tokens) and code examples.',
            inputSchema: searchInput,
            annotations: readOnly
        },
        (input) => guard(() => searchTool(ctx, input))
    );

    server.registerTool(
        'get_component',
        {
            title: 'Get component docs',
            description: 'Read the docs of an ExhaustiveUI component: sections, available examples, and optionally its API, compiled declarations and full Markdown document. Accepts a batch of up to 10 components.',
            inputSchema: getComponentInput,
            annotations: readOnly
        },
        (input) => guard(() => getComponentTool(ctx, input))
    );

    server.registerTool(
        'get_guide',
        {
            title: 'Get guide docs',
            description: 'Read an ExhaustiveUI guide (installation, configuration, theming, Tailwind, icons, pass through, accessibility, migration...).',
            inputSchema: getGuideInput,
            annotations: readOnly
        },
        (input) => guard(() => getGuideTool(ctx, input))
    );

    server.registerTool(
        'get_example',
        {
            title: 'Get a code example',
            description: 'Return one complete, source-backed code example of a component (a standalone Angular component with its template and imports).',
            inputSchema: getExampleInput,
            annotations: readOnly
        },
        (input) => guard(() => getExampleTool(ctx, input))
    );

    server.registerTool(
        'get_setup',
        {
            title: 'Get setup docs',
            description: 'Return the installation and setup guidance for ExhaustiveUI in an Angular project (Angular CLI by default; also configuration, styled/unstyled theming, Tailwind, icons, pass through).',
            inputSchema: getSetupInput,
            annotations: readOnly
        },
        (input) => guard(() => getSetupTool(ctx, input))
    );

    server.registerTool(
        'validate_usage',
        {
            title: 'Validate component usage',
            description:
                'Check an Angular template or component source against the compiled API of an ExhaustiveUI component: unknown inputs and outputs, invalid literal values, unsupported two-way bindings, deprecated inputs, inputs and outputs removed or renamed in v22 (with their replacement), wrong selectors and PrimeNG imports. Accepts a batch of up to 10 usages.',
            inputSchema: validateUsageInput,
            annotations: readOnly
        },
        (input) => guard(() => validateUsageTool(ctx, input))
    );

    server.registerTool(
        'version',
        {
            title: 'ExhaustiveUI MCP version',
            description: 'Return the server version, the documented library version, where the docs are read from (live site or offline snapshot) and the registered tools, resources and prompts.',
            inputSchema: versionInput,
            annotations: readOnly
        },
        () => guard(() => versionTool(ctx))
    );
}

// ---------------------------------------------------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------------------------------------------------

const STATIC_RESOURCES: { name: string; file: string; title: string; description: string; mimeType: string }[] = [
    { name: 'llms-txt', file: 'llms.txt', title: 'ExhaustiveUI llms.txt', description: 'Index of the ExhaustiveUI guides and components with their URLs.', mimeType: 'text/plain' },
    { name: 'llms-full-txt', file: 'llms-full.txt', title: 'ExhaustiveUI llms-full.txt', description: 'The complete ExhaustiveUI documentation in one Markdown file.', mimeType: 'text/plain' },
    {
        name: 'manifest',
        file: 'manifest.json',
        title: 'ExhaustiveUI API manifest',
        description: 'Compiled metadata of every entry point of @exhaustive-ui/core: selectors, inputs, outputs, templates, pass-through keys, services and types.',
        mimeType: 'application/json'
    },
    { name: 'components-index', file: 'components.json', title: 'ExhaustiveUI components index', description: 'Every component with its documentation sections, examples and API, plus the guides.', mimeType: 'application/json' }
];

function registerResources(server: McpServer, ctx: ToolContext): void {
    for (const resource of STATIC_RESOURCES) {
        const uri = `${RESOURCE_BASE_URI}/${resource.file}`;

        server.registerResource(resource.name, uri, { title: resource.title, description: resource.description, mimeType: resource.mimeType }, async () => ({
            contents: [{ uri, mimeType: resource.mimeType, text: await ctx.source.readText(resource.file) }]
        }));
    }

    server.registerResource(
        'component-docs',
        new ResourceTemplate(`${RESOURCE_BASE_URI}/components/{component}.md`, {
            list: async () => ({
                resources: (await ctx.catalog()).components.map((component) => ({ uri: component.resourceUri, name: component.name, title: component.title, description: component.description, mimeType: 'text/markdown' }))
            }),
            complete: { component: completeComponent(ctx) }
        }),
        { title: 'ExhaustiveUI component docs', description: 'Generated Markdown documentation of one component (examples, API tables, pass-through options, theming).', mimeType: 'text/markdown' },
        async (uri, variables) => {
            const component = findComponent(await ctx.catalog(), variable(variables.component));

            return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: await ctx.source.readText(component.docPath) }] };
        }
    );

    server.registerResource(
        'component-api',
        new ResourceTemplate(`${RESOURCE_BASE_URI}/components/{component}/api.json`, {
            list: async () => ({
                resources: (await ctx.catalog()).components.map((component) => ({ uri: component.apiResourceUri, name: `${component.name}-api`, title: `${component.title} API`, mimeType: 'application/json' }))
            }),
            complete: { component: completeComponent(ctx) }
        }),
        { title: 'ExhaustiveUI component API', description: 'API of one component as JSON: documented members and compiled declarations.', mimeType: 'application/json' },
        async (uri, variables) => {
            const component = findComponent(await ctx.catalog(), variable(variables.component));

            return { contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(componentApi(component), null, 2) }] };
        }
    );

    server.registerResource(
        'guide-docs',
        new ResourceTemplate(`${RESOURCE_BASE_URI}/pages/{guide}.md`, {
            list: async () => ({
                resources: (await ctx.catalog()).guides.map((guide) => ({ uri: guide.resourceUri, name: guide.name, title: guide.title, description: guide.description, mimeType: 'text/markdown' }))
            }),
            complete: {
                guide: async (value) => {
                    const prefix = value.toLowerCase();

                    return (await ctx.catalog()).guides.map((guide) => guide.name).filter((name) => name.startsWith(prefix));
                }
            }
        }),
        { title: 'ExhaustiveUI guide docs', description: 'Generated Markdown of one guide.', mimeType: 'text/markdown' },
        async (uri, variables) => {
            const guide = findGuide(await ctx.catalog(), variable(variables.guide));

            return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: await ctx.source.readText(guide.docPath) }] };
        }
    );

    server.registerResource(
        'example-docs',
        new ResourceTemplate(`${RESOURCE_BASE_URI}/examples/{component}/{section}.md`, {
            list: undefined,
            complete: {
                component: completeComponent(ctx),
                section: async (value, context) => {
                    const componentName = context?.arguments?.component;

                    if (!componentName) {
                        return [];
                    }

                    const component = findComponent(await ctx.catalog(), componentName);
                    const prefix = value.toLowerCase();

                    return component.sections
                        .filter((section) => section.hasCode)
                        .map((section) => section.id)
                        .filter((id) => id.toLowerCase().startsWith(prefix));
                }
            }
        }),
        { title: 'ExhaustiveUI examples', description: 'One code example of a component, as Markdown.', mimeType: 'text/markdown' },
        async (uri, variables) => {
            const component = findComponent(await ctx.catalog(), variable(variables.component));
            const section = requireSection(component.sections, variable(variables.section));
            const text = [
                `# ${component.title}: ${section.label}`,
                '',
                section.description ?? '',
                '',
                `Source: ${component.resourceUri}`,
                '',
                section.hasCode ? `\`\`\`${section.codeLanguage}\n${section.code}\n\`\`\`` : '_This section has no code example._'
            ].join('\n');

            return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text }] };
        }
    );
}

function completeComponent(ctx: ToolContext): (value: string) => Promise<string[]> {
    return async (value) => {
        const prefix = value.toLowerCase();

        return (await ctx.catalog()).components
            .map((component) => component.name)
            .filter((name) => name.startsWith(prefix))
            .slice(0, 50);
    };
}

function variable(value: string | string[] | undefined): string {
    const single = Array.isArray(value) ? value[0] : value;

    if (!single) {
        throw new Error('Missing resource template variable');
    }

    return single;
}

export function componentApi(component: ComponentEntry): Record<string, unknown> {
    return {
        name: component.name,
        title: component.title,
        import: component.import,
        modules: component.modules,
        selectors: component.selectors,
        api: component.api,
        compiled: component.declarations
    };
}

// ---------------------------------------------------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------------------------------------------------

const PROMPTS: Record<(typeof PROMPT_NAMES)[number], { title: string; description: string; steps: string[] }> = {
    use_component: {
        title: 'Use an ExhaustiveUI component',
        description: 'Add an ExhaustiveUI component to an Angular app correctly, from its documented API and examples.',
        steps: [
            'Call get_component for the component (includeApi: true when you need inputs, outputs or templates).',
            'Call get_example for the closest documented example and adapt it; keep the `@exhaustive-ui/core/<name>` import.',
            'Call validate_usage on the template you wrote before answering.'
        ]
    },
    build_form: {
        title: 'Build a form with ExhaustiveUI',
        description: 'Build an Angular form (reactive or template-driven) with ExhaustiveUI form components.',
        steps: [
            'Call search with scope "components" for the inputs the form needs (inputtext, select, datepicker, checkbox, ...).',
            'Call get_example with section "reactiveforms" or "forms" for each component to see the documented form integration.',
            'Call validate_usage on the final template.'
        ]
    },
    theme_component: {
        title: 'Theme an ExhaustiveUI component',
        description: 'Customize a component with design tokens, pass-through attributes, CSS classes or Tailwind.',
        steps: [
            'Call get_setup with environment "styled" (or "unstyled", "tailwind", "passthrough") for the theming model.',
            'Call get_component with includeApi: true and read its pt keys, styles (CSS classes) and tokens.',
            'Prefer design tokens (dt input or theme preset) over overriding CSS classes.'
        ]
    },
    migrate_from_primeng: {
        title: 'Migrate from PrimeNG',
        description: 'Plan the migration of PrimeNG (or Optimus UI) code to ExhaustiveUI.',
        steps: [
            'ExhaustiveUI v22 requires Angular v22: the workspace must be on PrimeNG v21, then updated to Angular v22, before running `ng generate @exhaustive-ui/core:migrate-from-primeng`.',
            'Call get_guide for "faq" (migration notes) and get_setup for "angular-cli".',
            'For each PrimeNG component used, call get_component with the PrimeNG name: renamed components (dropdown, calendar, sidebar, overlaypanel, inputswitch, tabview...) resolve to their ExhaustiveUI equivalent.',
            'Replace `primeng/<name>` imports with `@exhaustive-ui/core/<name>` and call validate_usage on each migrated template.'
        ]
    },
    update_to_v22: {
        title: 'Update to ExhaustiveUI v22',
        description: 'Update an application to ExhaustiveUI v22 (Angular v22, Signals API) and fix what ng update leaves for review.',
        steps: [
            'Call get_guide for "v22" (the migration guide to v22) and follow its update steps for the starting point: an ExhaustiveUI prerelease, PrimeNG v21 or Optimus UI.',
            'Update Angular first (`ng update @angular/core@22 @angular/cli@22`), then run `ng update @exhaustive-ui/core@22`; its nine migrations rewrite styleClass to class, renamed inputs, outputs and templates, bindings of removed inputs and outputs, and the configuration API, and print what they left for review. Handle each reported place as the "Reviewing the report" section of the guide describes.',
            'In TypeScript code that holds a component instance (viewChild, ViewChild, injected component), read inputs as signals (`table.selection()`), write two-way properties with `.set()` (`drawer.visible.set(true)`), and call signal queries.',
            'Components are OnPush (except Table, TreeTable and DynamicDialog): pass new arrays or objects, or signals, instead of mutating data bound to them in place.',
            'Call validate_usage on each template that uses a `p-*` element: removed or renamed v22 inputs are reported with their replacement.'
        ]
    },
    audit_component_usage: {
        title: 'Audit ExhaustiveUI usage',
        description: 'Review application code for ExhaustiveUI API mismatches.',
        steps: [
            'Collect every template that uses a `p-*` element or `p*` directive.',
            'Call validate_usage with "usages" batches of up to 10 { component, code } items.',
            'Fix errors first (unknown inputs/outputs, invalid values, PrimeNG imports), then review warnings (deprecated inputs).'
        ]
    }
};

function registerPrompts(server: McpServer): void {
    for (const name of PROMPT_NAMES) {
        const prompt = PROMPTS[name];

        server.registerPrompt(
            name,
            {
                title: prompt.title,
                description: prompt.description,
                argsSchema: { component: z.string().optional().describe('Component name'), goal: z.string().optional().describe('What the user wants to achieve') }
            },
            ({ component, goal }) => ({
                messages: [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: [
                                `${prompt.description}${component ? ` Component: ${component}.` : ''}`,
                                goal ? `Goal: ${goal}` : '',
                                '',
                                'Use the ExhaustiveUI MCP tools rather than memory of PrimeNG:',
                                ...prompt.steps.map((step, index) => `${index + 1}. ${step}`)
                            ]
                                .filter((line) => line !== undefined)
                                .join('\n')
                        }
                    }
                ]
            })
        );
    }
}

export type { Catalog, ComponentEntry, DirectiveEntry, GuideEntry, SectionEntry } from './types';
export type { DocsSource, FetchLike, SourceStatus } from './source';
export type { ServerConfig } from './config';
export type { ToolContext, ToolResult } from './tools';
