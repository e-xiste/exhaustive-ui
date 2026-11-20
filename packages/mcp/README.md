# @exhaustive-ui/mcp

[Model Context Protocol](https://modelcontextprotocol.io/) server for the [ExhaustiveUI](https://exhaustive-ui.com) Angular component library (`@exhaustive-ui/core`).

It gives coding agents (Claude Code, Cursor, Claude Desktop, VS Code, Codex...) tools to read the ExhaustiveUI documentation and compiled API instead of guessing from PrimeNG memory: list and search components, read a component's docs and API, fetch complete code examples, read the setup guides and validate Angular templates against the real inputs, outputs and allowed values.

```bash
npx -y @exhaustive-ui/mcp
```

The package also exposes the `exhaustive-ui-mcp` bin when installed globally or through a package manager. Node.js 20 or later is required.

## Setup

### Claude Code

```bash
claude mcp add exhaustive-ui -s user -- npx -y @exhaustive-ui/mcp
```

Project-only setup (writes `.mcp.json` in the current project):

```bash
claude mcp add exhaustive-ui -- npx -y @exhaustive-ui/mcp
```

### Cursor

Add `.cursor/mcp.json` in a project or edit `~/.cursor/mcp.json`:

```json
{
    "mcpServers": {
        "exhaustive-ui": {
            "command": "npx",
            "args": ["-y", "@exhaustive-ui/mcp"]
        }
    }
}
```

### Claude Desktop

Edit `claude_desktop_config.json` (Settings > Developer > Edit Config):

```json
{
    "mcpServers": {
        "exhaustive-ui": {
            "command": "npx",
            "args": ["-y", "@exhaustive-ui/mcp"]
        }
    }
}
```

### VS Code

Add `.vscode/mcp.json` in a project or configure the same server globally:

```json
{
    "servers": {
        "exhaustive-ui": {
            "command": "npx",
            "args": ["-y", "@exhaustive-ui/mcp"]
        }
    }
}
```

### Codex

```bash
codex mcp add exhaustive-ui -- npx -y @exhaustive-ui/mcp
```

Or add it to `~/.codex/config.toml`:

```toml
[mcp_servers.exhaustive-ui]
command = "npx"
args = ["-y", "@exhaustive-ui/mcp"]
```

## Tools

| Tool             | Purpose                                                                                                                                                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `list`           | List components, directives, guides, code examples or MCP resources (`kind`, `limit`, `offset`).                                                                                                                                                              |
| `search`         | Search component docs, guides, API members (inputs, outputs, templates, PT keys, CSS classes, tokens) and code examples (`query`, `scope`).                                                                                                                    |
| `get_component`  | Read a component: selectors, import path, sections, available examples; optionally its API and compiled declarations (`includeApi`), example code (`includeExamples`) and the full Markdown document (`detail: "full"`). Accepts a batch of up to 10 `components`. |
| `get_guide`      | Read a guide by name or route (`installation`, `configuration`, `theming/styled`, `tailwind`, `guides/accessibility`...), optionally one `section` or the full document.                                                                                        |
| `get_example`    | Return one complete, source-backed code example of a component (a standalone Angular component with template and imports), by `section` or feature `variant`.                                                                                                 |
| `get_setup`      | Return the setup guidance for an `environment`: `angular-cli` (default), `configuration`, `styled`, `unstyled`, `tailwind`, `icons`, `custom-icons`, `passthrough`.                                                                                             |
| `validate_usage` | Check an Angular template or component source against the compiled API of a component: unknown inputs and outputs, invalid literal values, unsupported two-way bindings, deprecated inputs, wrong selectors and PrimeNG imports. Accepts a batch of `usages`. |
| `version`        | Return the server version, the documented library version, where the docs are read from (live site, cache, offline snapshot) and the registered tools, resources and prompts.                                                                                 |

Component names are resolved loosely: `button`, `p-button`, `Button`, `[pTooltip]`, `@exhaustive-ui/core/select`, a docs URL, and the PrimeNG names of renamed components (`dropdown`, `calendar`, `sidebar`, `overlaypanel`, `inputswitch`, `tabview`...) all work.

Every tool answers with `structuredContent` and the same JSON serialized in its text content, so clients that only forward text see the whole answer.

## Resources and prompts

Static resources:

- `exhaustive-ui://docs/llms.txt`
- `exhaustive-ui://docs/llms-full.txt`
- `exhaustive-ui://docs/manifest.json`
- `exhaustive-ui://docs/components.json`

Resource templates:

- `component-docs`: `exhaustive-ui://docs/components/{component}.md`
- `component-api`: `exhaustive-ui://docs/components/{component}/api.json`
- `guide-docs`: `exhaustive-ui://docs/pages/{guide}.md`
- `example-docs`: `exhaustive-ui://docs/examples/{component}/{section}.md`

Prompts: `use_component`, `build_form`, `theme_component`, `migrate_from_primeng`, `audit_component_usage`.

## Where the docs come from

The docs site publishes machine-readable documentation under [`/llms/`](https://exhaustive-ui.com/llms): `llms.txt`, `llms-full.txt`, `manifest.json` (compiled selectors, inputs, outputs, templates, PT keys of every entry point), `components.json` (sections, examples and API of every component, plus the guides), and one Markdown file per component and guide.

The server reads these files from the live site at runtime and keeps them in memory for 15 minutes, so it always reflects the deployed documentation without republishing the package. A snapshot of the same files is bundled in the package (`data/`) and used when the site cannot be reached; after a connection failure the site is not retried for a minute so an offline session stays responsive. The `version` tool reports which source answered.

## Environment variables

| Variable                          | Default                             | Purpose                                                                        |
| --------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------ |
| `EXHAUSTIVE_UI_DOCS_URL`          | `https://exhaustive-ui.com` | Docs site to read from, for instance a local `ng serve` of the docs app.       |
| `EXHAUSTIVE_UI_MCP_CACHE_TTL`     | `900`                               | Seconds a fetched document is reused before it is fetched again.               |
| `EXHAUSTIVE_UI_MCP_FETCH_TIMEOUT` | `10000`                             | Milliseconds before a request to the docs site is abandoned.                   |
| `EXHAUSTIVE_UI_MCP_OFFLINE`       | unset                               | Set to `1` to never contact the site and only use the bundled snapshot.        |
| `EXHAUSTIVE_UI_MCP_SNAPSHOT_DIR`  | the package's `data/` directory     | Directory of the offline snapshot (a copy of the site's `/llms/` directory).   |

Example, Claude Code pointed at a local docs server:

```bash
claude mcp add exhaustive-ui -e EXHAUSTIVE_UI_DOCS_URL=http://localhost:4200 -- npx -y @exhaustive-ui/mcp
```

## Programmatic use

```ts
import { createExhaustiveUiMcpServer } from '@exhaustive-ui/mcp';

const server = await createExhaustiveUiMcpServer({ config: { docsUrl: 'http://localhost:4200' } });
// connect `server` to any @modelcontextprotocol/sdk transport
```

## Development

```bash
pnpm --filter @exhaustive-ui/mcp build   # builds data/ from apps/docs/public/llms (or downloads it), then bundles dist/
pnpm --filter @exhaustive-ui/mcp test    # vitest, against the fixture snapshot in test/fixtures (no network)
```

## Links

- [ExhaustiveUI documentation](https://exhaustive-ui.com/)
- [LLM documentation endpoints](https://exhaustive-ui.com/llms)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [GitHub repository](https://github.com/e-xiste/exhaustive-ui)

## License

MIT
