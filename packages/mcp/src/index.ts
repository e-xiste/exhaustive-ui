#!/usr/bin/env node
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SERVER_NAME, readPackageVersion, runExhaustiveUiMcpServer } from './server';

export { DEFAULT_CACHE_TTL_SECONDS, DEFAULT_DOCS_URL, DEFAULT_FETCH_TIMEOUT_MS, RESOURCE_BASE_URI, resolveConfig } from './config';
export { buildCatalog, CatalogLoader, findComponent, findGuide, findSection } from './catalog';
export { CachedSource, FallbackSource, MemorySource, RemoteSource, SnapshotSource, createDocsSource } from './source';
export { searchCatalog } from './search';
export { validateComponentUsage, type UsageIssue } from './validate';
export { PROMPT_NAMES, RESOURCE_TEMPLATE_NAMES, STATIC_RESOURCE_URIS, TOOL_NAMES } from './tools';
export { SERVER_NAME, componentApi, createExhaustiveUiMcpServer, createToolContext, readPackageVersion, runExhaustiveUiMcpServer, type CreateServerOptions } from './server';
export type { Catalog, ComponentEntry, DirectiveEntry, DocsSource, FetchLike, GuideEntry, SectionEntry, ServerConfig, SourceStatus, ToolContext, ToolResult } from './server';

const HELP = `${SERVER_NAME}: Model Context Protocol server for the ExhaustiveUI Angular component library.

Usage: exhaustive-ui-mcp [--help] [--version]

The server speaks MCP over stdio; register it in your MCP client, for example:
  claude mcp add exhaustive-ui -- npx -y @exhaustive-ui/mcp

Environment variables:
  EXHAUSTIVE_UI_DOCS_URL           Docs site to read from (default https://exhaustive-ui.e-xiste.com)
  EXHAUSTIVE_UI_MCP_CACHE_TTL      Seconds a fetched document is reused (default 900)
  EXHAUSTIVE_UI_MCP_FETCH_TIMEOUT  Milliseconds before a request to the docs site is abandoned (default 10000)
  EXHAUSTIVE_UI_MCP_OFFLINE        Set to 1 to only use the offline snapshot bundled with the package
  EXHAUSTIVE_UI_MCP_SNAPSHOT_DIR   Directory of the offline snapshot (default: the package's data/ directory)
`;

function isCliEntrypoint(): boolean {
    const entry = process.argv[1];

    if (!entry) {
        return false;
    }

    try {
        return realpathSync(entry) === realpathSync(fileURLToPath(import.meta.url));
    } catch {
        return false;
    }
}

if (isCliEntrypoint()) {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log(HELP);
    } else if (args.includes('--version') || args.includes('-v')) {
        console.log(readPackageVersion());
    } else {
        runExhaustiveUiMcpServer().catch((error: unknown) => {
            console.error(`Failed to start ${SERVER_NAME}:`, error);
            process.exit(1);
        });
    }
}
