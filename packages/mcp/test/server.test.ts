import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PROMPT_NAMES, TOOL_NAMES } from '../src/tools';
import { createExhaustiveUiMcpServer } from '../src/server';
import { fixtureSource } from './helpers';

describe('MCP server', () => {
    const client = new Client({ name: 'test-client', version: '0.0.0' });
    let close: () => Promise<void>;

    beforeAll(async () => {
        const server = await createExhaustiveUiMcpServer({ source: fixtureSource(), version: '0.0.0-test', env: {} });
        const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

        await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
        close = async () => {
            await client.close();
            await server.close();
        };
    });

    afterAll(async () => {
        await close();
    });

    it('announces itself', () => {
        expect(client.getServerVersion()).toMatchObject({ name: '@exhaustive-ui/mcp', version: '0.0.0-test' });
        expect(client.getServerCapabilities()).toMatchObject({ tools: {}, resources: {}, prompts: {} });
    });

    it('registers the eight tools with read-only annotations', async () => {
        const { tools } = await client.listTools();

        expect(tools.map((tool) => tool.name).sort()).toEqual([...TOOL_NAMES].sort());
        expect(tools.every((tool) => tool.annotations?.readOnlyHint === true)).toBe(true);
        expect(tools.find((tool) => tool.name === 'search')?.inputSchema.properties).toHaveProperty('query');
    });

    it('calls a tool and returns text plus structured content', async () => {
        const result = await client.callTool({ name: 'list', arguments: { kind: 'components', limit: 2 } });

        expect(result.isError).toBeFalsy();
        expect(result.structuredContent).toMatchObject({ kind: 'components', total: 5, limit: 2, offset: 0 });
        expect(JSON.parse((result.content as { text: string }[])[0]!.text)).toEqual(result.structuredContent);
    });

    it('applies the schema defaults and rejects invalid arguments', async () => {
        const defaults = await client.callTool({ name: 'list', arguments: {} });

        expect(defaults.structuredContent).toMatchObject({ kind: 'components', limit: 50 });

        const invalid = await client.callTool({ name: 'search', arguments: { query: '' } });

        expect(invalid.isError).toBe(true);
    });

    it('returns tool errors as error results, not protocol errors', async () => {
        const result = await client.callTool({ name: 'get_component', arguments: { component: 'does-not-exist' } });

        expect(result.isError).toBe(true);
        expect(result.structuredContent).toMatchObject({ error: expect.stringContaining('not found') });
    });

    it('lists static resources and resource templates', async () => {
        const { resources } = await client.listResources();
        const uris = resources.map((resource) => resource.uri);

        expect(uris).toEqual(
            expect.arrayContaining([
                'exhaustive-ui://docs/llms.txt',
                'exhaustive-ui://docs/llms-full.txt',
                'exhaustive-ui://docs/manifest.json',
                'exhaustive-ui://docs/components.json',
                'exhaustive-ui://docs/components/button.md',
                'exhaustive-ui://docs/components/button/api.json',
                'exhaustive-ui://docs/pages/installation.md'
            ])
        );

        const { resourceTemplates } = await client.listResourceTemplates();

        expect(resourceTemplates.map((template) => template.name).sort()).toEqual(['component-api', 'component-docs', 'example-docs', 'guide-docs']);
    });

    it('reads static, component, API, guide and example resources', async () => {
        const llms = await client.readResource({ uri: 'exhaustive-ui://docs/llms.txt' });

        expect(llms.contents[0]).toMatchObject({ mimeType: 'text/plain', text: expect.stringContaining('# ExhaustiveUI') });

        const docs = await client.readResource({ uri: 'exhaustive-ui://docs/components/button.md' });

        expect(docs.contents[0]).toMatchObject({ mimeType: 'text/markdown', text: expect.stringContaining('# Angular Button Component') });

        const api = await client.readResource({ uri: 'exhaustive-ui://docs/components/select/api.json' });
        const parsed = JSON.parse((api.contents[0] as { text: string }).text);

        expect(parsed).toMatchObject({ name: 'select', import: '@exhaustive-ui/core/select' });
        expect(parsed.compiled[0].selector).toBe('p-select');

        const guide = await client.readResource({ uri: 'exhaustive-ui://docs/pages/installation.md' });

        expect((guide.contents[0] as { text: string }).text).toContain('# Installation');

        const example = await client.readResource({ uri: 'exhaustive-ui://docs/examples/button/basic.md' });

        expect((example.contents[0] as { text: string }).text).toContain('<p-button label="Submit" />');
    });

    it('completes component names in resource templates', async () => {
        const completion = await client.complete({ ref: { type: 'ref/resource', uri: 'exhaustive-ui://docs/components/{component}.md' }, argument: { name: 'component', value: 't' } });

        expect(completion.completion.values).toEqual(['tabs', 'tooltip']);
    });

    it('registers the prompts', async () => {
        const { prompts } = await client.listPrompts();

        expect(prompts.map((prompt) => prompt.name).sort()).toEqual([...PROMPT_NAMES].sort());

        const prompt = await client.getPrompt({ name: 'use_component', arguments: { component: 'table', goal: 'lazy loading' } });

        expect(prompt.messages[0]?.content).toMatchObject({ type: 'text', text: expect.stringContaining('Component: table') });
        expect((prompt.messages[0]?.content as { text: string }).text).toContain('Goal: lazy loading');
    });
});
