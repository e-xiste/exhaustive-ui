import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'agents-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>
                <i>&#64;exhaustive-ui/core</i> ships its own guide for AI coding agents: <i>node_modules/&#64;exhaustive-ui/core/AGENTS.md</i> gives the rules that matter when writing code with the library (imports, canonical tags, templates,
                signals, OnPush), the PrimeNG habits to drop, and links to a card per component in <i>llms/cards/</i>. Coding agents read <i>node_modules</i>, so this works without any setup, and always matches the installed version. To make sure
                your agent reads it first, mention it in the <i>AGENTS.md</i> or <i>CLAUDE.md</i> of your project. <i>ng add</i> offers to do it, and the <i>ai-config</i> schematic does it in a project that already uses ExhaustiveUI: it adds the MCP
                server to the configuration of each tool you name (<i>claude-code</i>, <i>cursor</i>, <i>gemini-cli</i>, <i>open-ai-codex</i>, <i>vscode</i>) and a section to its instructions, without touching what the files already contain.
            </p>
            <app-code [code]="schematic" [hideToggleCode]="true"></app-code>
            <p>Or add the lines yourself:</p>
            <app-code [code]="instructions" [hideToggleCode]="true"></app-code>
            <p>
                A component card is a 2 to 16 KB summary: the import, the tag, the inputs the examples use with their type and default, the outputs, every template with the context it receives, and one complete example. The same cards are published
                at <a href="/llms/cards/select.md" target="_blank" class="doc-link">/llms/cards/&lt;name&gt;.md</a>, returned first by the <i>get_component</i> tool of the MCP server, and bundled in the Agent Skill. The site version of the guide is
                <a href="/llms/AGENTS.md" target="_blank" class="doc-link">/llms/AGENTS.md</a>.
            </p>
            <p>
                After writing templates, an agent (or you) can check them against the API with the <i>check</i> command of the MCP package. It reads the <i>.html</i> files and the inline templates under <i>src</i>, and reports, with file and line:
                PrimeNG tags and imports with their replacement, unknown or miscased inputs, invalid values, inputs removed in v22, and template names that the component does not have. It exits with 1 on errors, so it also fits in a CI pipeline or a
                pre-commit hook.
            </p>
            <app-code [code]="check" [hideToggleCode]="true"></app-code>
        </app-docsectiontext>
    `
})
export class AgentsDoc {
    schematic: Code = {
        command: `ng generate @exhaustive-ui/core:ai-config --tool=claude-code --tool=cursor`
    };

    instructions: Code = {
        typescript: `<!-- AGENTS.md or CLAUDE.md -->
This project uses ExhaustiveUI. Before writing code with it, read node_modules/@exhaustive-ui/core/AGENTS.md,
then the card of each component you use. After changing templates, run: npx -y @exhaustive-ui/mcp check`
    };

    check: Code = {
        command: `npx -y @exhaustive-ui/mcp check

src/app/orders.component.ts:3  error  "primeng/dropdown" is a PrimeNG package; ExhaustiveUI uses "@exhaustive-ui/core/select".
src/app/orders.component.ts:11  error  "colour" is not an input of Select.
src/app/orders.component.ts:13  error  <p-select> has no #selecteditem template: names are case sensitive, write #selectedItem.
3 errors, 0 warnings in 12 files.`
    };
}
