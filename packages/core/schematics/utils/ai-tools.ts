import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { JSONFile } from '@schematics/angular/utility/json-file';
import { AiTool } from '../ai-config/schema';

const SERVER_NAME = 'exhaustive-ui';
const SERVER = { command: 'npx', args: ['-y', '@exhaustive-ui/mcp'] };

/** What marks instructions as already mentioning the library's guide, in our section or a hand-written one. */
const GUIDE_PATH = 'node_modules/@exhaustive-ui/core/AGENTS.md';

const INSTRUCTIONS = `<!-- exhaustive-ui:start -->
## ExhaustiveUI

This project uses ExhaustiveUI (\`@exhaustive-ui/core\`). Its API is close to PrimeNG but not the same: before writing code with it, read \`${GUIDE_PATH}\`, then the card of each component you use. After changing templates, run \`npx -y @exhaustive-ui/mcp check\`.
<!-- exhaustive-ui:end -->
`;

interface ToolConfig {
    instructions: (tree: Tree) => string;
    mcp: { path: string; key: 'mcpServers' | 'servers' | 'toml' };
}

const agentsMd = () => 'AGENTS.md';

const TOOLS: Record<Exclude<AiTool, 'none'>, ToolConfig> = {
    'claude-code': { instructions: claudeInstructions, mcp: { path: '.mcp.json', key: 'mcpServers' } },
    cursor: { instructions: agentsMd, mcp: { path: '.cursor/mcp.json', key: 'mcpServers' } },
    'gemini-cli': { instructions: geminiInstructions, mcp: { path: '.gemini/settings.json', key: 'mcpServers' } },
    'open-ai-codex': { instructions: agentsMd, mcp: { path: '.codex/config.toml', key: 'toml' } },
    vscode: { instructions: agentsMd, mcp: { path: '.vscode/mcp.json', key: 'servers' } }
};

/** The existing CLAUDE.md, or AGENTS.md when that CLAUDE.md only imports it (`@AGENTS.md`). */
function claudeInstructions(tree: Tree): string {
    const path = ['CLAUDE.md', '.claude/CLAUDE.md'].find((candidate) => tree.exists(candidate)) ?? 'CLAUDE.md';
    const importsAgentsMd = /^\s*@(?:\.\.?\/)?AGENTS\.md\s*$/m.test(tree.read(path)?.toString() ?? '');
    return importsAgentsMd ? 'AGENTS.md' : path;
}

/** `ng generate ai-config` of the Angular CLI writes .gemini/GEMINI.md: extend it rather than add a second file. */
function geminiInstructions(tree: Tree): string {
    return !tree.exists('GEMINI.md') && tree.exists('.gemini/GEMINI.md') ? '.gemini/GEMINI.md' : 'GEMINI.md';
}

/**
 * Adds the ExhaustiveUI MCP server and a section of instructions to the files each selected tool
 * reads. Existing content is kept: files are extended, never replaced, and what is already there
 * is left alone. A file that cannot be extended is reported and skipped.
 */
export function configureAiTools(tree: Tree, context: SchematicContext, tools: readonly AiTool[] = []): void {
    for (const tool of tools) {
        if (tool === 'none') {
            continue;
        }
        const config = TOOLS[tool];
        addInstructions(tree, context, config.instructions(tree));
        const { path, key } = config.mcp;
        if (key === 'toml') {
            addTomlServer(tree, context, path);
        } else {
            addJsonServer(tree, context, path, key);
        }
    }
}

function addInstructions(tree: Tree, context: SchematicContext, path: string): void {
    if (!tree.exists(path)) {
        tree.create(path, INSTRUCTIONS);
        context.logger.info(`Created ${path} with the ExhaustiveUI instructions.`);
        return;
    }
    const content = tree.read(path)!.toString();
    if (content.includes(GUIDE_PATH)) {
        return;
    }
    tree.overwrite(path, append(content, INSTRUCTIONS));
    context.logger.info(`Added the ExhaustiveUI instructions to ${path}.`);
}

function addJsonServer(tree: Tree, context: SchematicContext, path: string, key: 'mcpServers' | 'servers'): void {
    if (!tree.read(path)?.toString().trim()) {
        const content = JSON.stringify({ [key]: { [SERVER_NAME]: SERVER } }, null, 2) + '\n';
        if (tree.exists(path)) {
            tree.overwrite(path, content);
        } else {
            tree.create(path, content);
        }
        context.logger.info(`Added the ExhaustiveUI MCP server to ${path}.`);
        return;
    }
    try {
        // JSONFile keeps the comments and the formatting of the file.
        const file = new JSONFile(tree, path);
        if (file.get([key, SERVER_NAME]) !== undefined) {
            return;
        }
        file.modify([key, SERVER_NAME], SERVER);
        context.logger.info(`Added the ExhaustiveUI MCP server to ${path}.`);
    } catch {
        context.logger.warn(`Could not update ${path}. Add the server to its "${key}" yourself:\n  "${SERVER_NAME}": ${JSON.stringify(SERVER)}`);
    }
}

function addTomlServer(tree: Tree, context: SchematicContext, path: string): void {
    const table = `[mcp_servers.${SERVER_NAME}]\ncommand = "${SERVER.command}"\nargs = ${JSON.stringify(SERVER.args).replace(',', ', ')}\n`;
    const content = tree.read(path)?.toString();
    if (content === undefined) {
        tree.create(path, table);
    } else if (/^\s*\[\s*mcp_servers\s*\.\s*["']?exhaustive-ui["']?\s*\]/m.test(content)) {
        return;
    } else {
        tree.overwrite(path, append(content, table));
    }
    context.logger.info(`Added the ExhaustiveUI MCP server to ${path}.`);
}

/** Appends a block after one blank line, with the line endings of the file. */
function append(content: string, block: string): string {
    const eol = content.includes('\r\n') ? '\r\n' : '\n';
    const base = content.trimEnd();
    return (base ? base + eol + eol : '') + block.replace(/\n/g, eol);
}
