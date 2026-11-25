# LLMs.txt

LLM-optimized documentation endpoints for ExhaustiveUI components.

## AI coding agents

`@exhaustive-ui/core` ships its own guide for AI coding agents: `node_modules/@exhaustive-ui/core/AGENTS.md` gives the rules that matter when writing code with the library (imports, canonical tags, templates,
signals, OnPush), the PrimeNG habits to drop, and links to a card per component in `llms/cards/`. Coding agents read `node_modules`, so this works without any setup, and always matches the installed version. To make sure
your agent reads it first, mention it in the `AGENTS.md` or `CLAUDE.md` of your project. `ng add` offers to do it, and the `ai-config` schematic does it in a project that already uses ExhaustiveUI: it adds the MCP
server to the configuration of each tool you name (`claude-code`, `cursor`, `gemini-cli`, `open-ai-codex`, `vscode`) and a section to its instructions, without touching what the files already contain.

```bash
ng generate @exhaustive-ui/core:ai-config --tool=claude-code --tool=cursor
```

Or add the lines yourself:

```typescript
<!-- AGENTS.md or CLAUDE.md -->
This project uses ExhaustiveUI. Before writing code with it, read node_modules/@exhaustive-ui/core/AGENTS.md,
then the card of each component you use. After changing templates, run: npx -y @exhaustive-ui/mcp check
```

A component card is a 2 to 16 KB summary: the import, the tag, the inputs the examples use with their type and default, the outputs, every template with the context it receives, and one complete example. The same cards are published
at [/llms/cards/<name>.md](https://exhaustive-ui.com/llms/cards/select.md), returned first by the `get_component` tool of the MCP server, and bundled in the Agent Skill. The site version of the guide is
[/llms/AGENTS.md](https://exhaustive-ui.com/llms/AGENTS.md).

After writing templates, an agent (or you) can check them against the API with the `check` command of the MCP package. It reads the `.html` files and the inline templates under `src`, and reports, with file and line:
PrimeNG tags and imports with their replacement, unknown or miscased inputs, invalid values, inputs removed in v22, and template names that the component does not have. It exits with 1 on errors, so it also fits in a CI pipeline or a
pre-commit hook.

```bash
npx -y @exhaustive-ui/mcp check

src/app/orders.component.ts:3  error  "primeng/dropdown" is a PrimeNG package; ExhaustiveUI uses "@exhaustive-ui/core/select".
src/app/orders.component.ts:11  error  "colour" is not an input of Select.
src/app/orders.component.ts:13  error  <p-select> has no #selecteditem template: names are case sensitive, write #selectedItem.
3 errors, 0 warnings in 12 files.
```

## /llms.txt

The [llms.txt](https://llmstxt.org/) file is an industry standard that helps AI models better understand and navigate the ExhaustiveUI documentation. It lists key pages in a
structured format, making it easier for LLMs to retrieve relevant information.

[

](https://exhaustive-ui.com/llms/llms.txt)

## /llms-full.txt

The `llms-full.txt` file is a complete list of all the pages in the ExhaustiveUI documentation. It is used to help AI models understand the entire documentation set.

[

](https://exhaustive-ui.com/llms/llms-full.txt)

## .md extension

Add a `.md` to a page's URL to display a Markdown version of that page.

[

](https://exhaustive-ui.com/llms/components/button.md)

## Agent Skill

The markdown files above are also bundled as an [Agent Skill](https://agentskills.io), the `SKILL.md` format supported by coding agents such as Claude Code,
Codex, Cursor and OpenCode. Once installed, the agent reads the component docs, API tables and guides from disk whenever it works on ExhaustiveUI code, instead of fetching them from this site each time.

Install it with the [skills CLI](https://skills.sh/docs/cli), which asks which agents to set it up for.

```bash
npx skills add https://exhaustive-ui.com

# update to the latest docs
npx skills update exhaustive-ui
```

By default the skill is installed into the current project, so your team gets it too. Add `-g` to install it for your user instead. You can also download the zip and extract it into a folder named `exhaustive-ui` in your
agent's skills directory.

[

](https://exhaustive-ui.com/llms/exhaustive-ui-skill.zip)

## MCP Server

[@exhaustive-ui/mcp](https://www.npmjs.com/package/@exhaustive-ui/mcp) is a
[Model Context Protocol](https://modelcontextprotocol.io) server that gives coding agents such as Claude Code, Cursor, Claude Desktop, VS Code Copilot and Codex
tools to query this documentation instead of guessing from PrimeNG memory: list and search components, read a component's docs and API, fetch a complete code example, read the setup guides, and validate an Angular template against the
compiled API (unknown inputs or outputs, invalid literal values, unsupported two-way bindings, deprecated inputs, PrimeNG imports and selectors).

The server reads the files described on this page from the live site, so it always reflects the deployed documentation without reinstalling the package, and keeps them in memory for 15 minutes. A snapshot of the same files is bundled
in the package and used when the network is unavailable.

Register it with Claude Code:

```bash
claude mcp add exhaustive-ui -s user -- npx -y @exhaustive-ui/mcp
```

Or add it to the MCP configuration of your client (`.cursor/mcp.json`, `claude_desktop_config.json`, `.vscode/mcp.json` with a `servers` key, ...):

```typescript
{
  "mcpServers": {
    "exhaustive-ui": {
      "command": "npx",
      "args": ["-y", "@exhaustive-ui/mcp"]
    }
  }
}
```

The server exposes the `list`, `search`, `get_component`, `get_guide`, `get_example`, `get_setup`, `validate_usage` and `version` tools, the Markdown files of this page as MCP resources, and
prompts for the usual tasks (use a component, build a form, theme a component, migrate from PrimeNG, audit usage). Set `EXHAUSTIVE_UI_DOCS_URL` to read another deployment of the docs, for instance a local `ng serve`, and
`EXHAUSTIVE_UI_MCP_OFFLINE=1` to only use the bundled snapshot. The package README lists every option.

## Manifest

[/llms/manifest.json](https://exhaustive-ui.com/llms/manifest.json) describes every component, directive, NgModule, service and exported type as structured data, for tools that need exact facts rather than prose:
MCP servers, code generators, linters and design tool integrations. It is generated from the Angular metadata in the compiled library, so selectors and inputs match what the compiler accepts.

Each entry point lists its import path, NgModule, services and exported types. Each component or directive lists its selector, inputs with type, allowed values, default, transform and two-way binding, outputs with payload type,
templates with their context type, methods, forms support and pass-through keys.

```typescript
{
  "schemaVersion": 1,
  "entryPoints": [
    {
      "name": "button",
      "import": "@exhaustive-ui/core/button",
      "modules": ["ButtonModule"],
      "declarations": [
        {
          "kind": "component",
          "className": "Button",
          "selector": "p-button",
          "inputs": [
            { "name": "severity", "type": "ButtonSeverity", "values": ["success", "info", "warn", "danger", "secondary", "contrast", "help", "primary"] },
            { "name": "raised", "type": "boolean", "default": "false", "transform": "booleanAttribute" }
          ],
          "outputs": [{ "name": "onClick", "payload": "MouseEvent" }],
          "templates": [{ "name": "icon", "context": "ButtonIconTemplateContext" }]
        }
      ]
    }
  ]
}
```

