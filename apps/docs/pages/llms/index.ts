import { LlmsTxtDoc } from '@/doc/llms/llmstxt-doc';
import { LlmsFullTxtDoc } from '@/doc/llms/llmsfulltxt-doc';
import { MarkdownExtensionDoc } from '@/doc/llms/markdownextension-doc';
import { AgentSkillDoc } from '@/doc/llms/agentskill-doc';
import { McpDoc } from '@/doc/llms/mcp-doc';
import { ManifestDoc } from '@/doc/llms/manifest-doc';
import { AgentsDoc } from '@/doc/llms/agents-doc';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    selector: 'llms-demo',
    standalone: true,
    imports: [AppDoc],
    template: ` <app-doc docTitle="LLMs.txt - ExhaustiveUI" header="LLMs.txt" description="LLM-optimized documentation endpoints for ExhaustiveUI components." [docs]="docs" docType="page"></app-doc> `
})
export class LLMsDemo {
    docs = [
        {
            id: 'agents',
            label: 'AI coding agents',
            component: AgentsDoc
        },
        {
            id: 'llmstxt',
            label: '/llms.txt',
            component: LlmsTxtDoc
        },
        {
            id: 'llmsfulltxt',
            label: '/llms-full.txt',
            component: LlmsFullTxtDoc
        },
        {
            id: 'markdown',
            label: '.md extension',
            component: MarkdownExtensionDoc
        },
        {
            id: 'agentskill',
            label: 'Agent Skill',
            component: AgentSkillDoc
        },
        {
            id: 'mcp',
            label: 'MCP Server',
            component: McpDoc
        },
        {
            id: 'manifest',
            label: 'Manifest',
            component: ManifestDoc
        }
    ];
}
