import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'mcp-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>
                <a href="https://www.npmjs.com/package/@exhaustive-ui/mcp" target="_blank" rel="noopener noreferrer" class="doc-link">&#64;exhaustive-ui/mcp</a> is a
                <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" class="doc-link">Model Context Protocol</a> server that gives coding agents such as Claude Code, Cursor, Claude Desktop, VS Code Copilot and Codex
                tools to query this documentation instead of guessing from PrimeNG memory: list and search components, read a component's docs and API, fetch a complete code example, read the setup guides, and validate an Angular template against the
                compiled API (unknown inputs or outputs, invalid literal values, unsupported two-way bindings, deprecated inputs, PrimeNG imports and selectors).
            </p>
            <p>
                The server reads the files described on this page from the live site, so it always reflects the deployed documentation without reinstalling the package, and keeps them in memory for 15 minutes. A snapshot of the same files is bundled
                in the package and used when the network is unavailable.
            </p>
            <p>Register it with Claude Code:</p>
            <app-code [code]="claudeCode" [hideToggleCode]="true"></app-code>
            <p>Or add it to the MCP configuration of your client (<i>.cursor/mcp.json</i>, <i>claude_desktop_config.json</i>, <i>.vscode/mcp.json</i> with a <i>servers</i> key, ...):</p>
            <app-code [code]="jsonConfig" [hideToggleCode]="true"></app-code>
            <p>
                The server exposes the <i>list</i>, <i>search</i>, <i>get_component</i>, <i>get_guide</i>, <i>get_example</i>, <i>get_setup</i>, <i>validate_usage</i> and <i>version</i> tools, the Markdown files of this page as MCP resources, and
                prompts for the usual tasks (use a component, build a form, theme a component, migrate from PrimeNG, audit usage). Set <i>EXHAUSTIVE_UI_DOCS_URL</i> to read another deployment of the docs, for instance a local <i>ng serve</i>, and
                <i>EXHAUSTIVE_UI_MCP_OFFLINE=1</i> to only use the bundled snapshot. The package README lists every option.
            </p>
        </app-docsectiontext>
    `
})
export class McpDoc {
    claudeCode: Code = {
        command: `claude mcp add exhaustive-ui -s user -- npx -y @exhaustive-ui/mcp`
    };

    jsonConfig: Code = {
        typescript: `{
  "mcpServers": {
    "exhaustive-ui": {
      "command": "npx",
      "args": ["-y", "@exhaustive-ui/mcp"]
    }
  }
}`
    };
}
