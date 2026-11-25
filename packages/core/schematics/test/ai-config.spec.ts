import { describe, expect, it } from 'vitest';
import { createAppTree, createRunner } from './helpers';

const GUIDE = 'node_modules/@exhaustive-ui/core/AGENTS.md';
const SERVER = { command: 'npx', args: ['-y', '@exhaustive-ui/mcp'] };

async function run(tool: string[] | undefined, overrides: Record<string, string> = {}) {
    const runner = createRunner();
    const logs: string[] = [];
    runner.logger.subscribe((entry) => logs.push(`${entry.level}: ${entry.message}`));
    const tree = await runner.runSchematic('ai-config', { tool }, createAppTree(overrides));
    return { tree, logs: logs.join('\n') };
}

describe('ai-config', () => {
    it.each([
        ['claude-code', 'CLAUDE.md', '.mcp.json', 'mcpServers'],
        ['cursor', 'AGENTS.md', '.cursor/mcp.json', 'mcpServers'],
        ['gemini-cli', 'GEMINI.md', '.gemini/settings.json', 'mcpServers'],
        ['vscode', 'AGENTS.md', '.vscode/mcp.json', 'servers']
    ])('%s: writes %s and %s', async (tool, instructions, config, key) => {
        const { tree } = await run([tool]);
        expect(tree.readContent(instructions)).toContain(GUIDE);
        expect(JSON.parse(tree.readContent(config))).toEqual({ [key]: { 'exhaustive-ui': SERVER } });
    });

    it('open-ai-codex: writes AGENTS.md and .codex/config.toml', async () => {
        const { tree } = await run(['open-ai-codex']);
        expect(tree.readContent('AGENTS.md')).toContain(GUIDE);
        expect(tree.readContent('.codex/config.toml')).toBe('[mcp_servers.exhaustive-ui]\ncommand = "npx"\nargs = ["-y", "@exhaustive-ui/mcp"]\n');
    });

    it.each([[undefined], [[]], [['none']]])('%j: changes nothing', async (tool) => {
        const { tree, logs } = await run(tool as string[] | undefined);
        expect(tree.files.sort()).toEqual(createAppTree().files.sort());
        expect(logs).toContain('No AI tool selected');
    });

    it('ignores "none" when a tool is selected too', async () => {
        const { tree } = await run(['none', 'claude-code']);
        expect(tree.exists('.mcp.json')).toBe(true);
    });

    it('several tools share one AGENTS.md section', async () => {
        const { tree } = await run(['cursor', 'vscode', 'open-ai-codex']);
        expect(tree.readContent('AGENTS.md').split(GUIDE)).toHaveLength(2);
    });

    it('keeps the existing instructions, servers, comments and settings', async () => {
        const { tree } = await run(['claude-code', 'vscode', 'gemini-cli', 'open-ai-codex'], {
            '/CLAUDE.md': '# My rules\n\nUse tabs.',
            '/.mcp.json': JSON.stringify({ mcpServers: { 'angular-cli': { command: 'npx', args: ['-y', '@angular/cli', 'mcp'] } } }, null, 2),
            '/.vscode/mcp.json': '{\n  // servers of the team\n  "servers": { "other": { "command": "x" } },\n  "inputs": []\n}\n',
            '/.gemini/settings.json': '{ "theme": "dark" }\n',
            '/.codex/config.toml': 'model = "x"\n\n[mcp_servers.angular-cli]\ncommand = "npx"\n'
        });

        expect(tree.readContent('/CLAUDE.md')).toMatch(/^# My rules\n\nUse tabs\.\n\n<!-- exhaustive-ui:start -->/);
        const claude = JSON.parse(tree.readContent('/.mcp.json'));
        expect(Object.keys(claude.mcpServers)).toEqual(['angular-cli', 'exhaustive-ui']);
        const vscode = tree.readContent('/.vscode/mcp.json');
        expect(vscode).toContain('// servers of the team');
        expect(vscode).toContain('"other"');
        expect(vscode).toContain('"inputs": []');
        expect(vscode).toContain('"exhaustive-ui"');
        expect(JSON.parse(tree.readContent('/.gemini/settings.json'))).toEqual({ theme: 'dark', mcpServers: { 'exhaustive-ui': SERVER } });
        expect(tree.readContent('/.codex/config.toml')).toMatch(/^model = "x"\n\n\[mcp_servers\.angular-cli\]\ncommand = "npx"\n\n\[mcp_servers\.exhaustive-ui\]\n/);
    });

    it('is idempotent and leaves a customized server alone', async () => {
        const tools = ['claude-code', 'cursor', 'gemini-cli', 'open-ai-codex', 'vscode'];
        const first = await run(tools, { '/.cursor/mcp.json': '{ "mcpServers": { "exhaustive-ui": { "command": "bunx" } } }' });
        const before = Object.fromEntries(first.tree.files.map((file) => [file, first.tree.readContent(file)]));
        const second = await createRunner().runSchematic('ai-config', { tool: tools }, first.tree);
        expect(Object.fromEntries(second.files.map((file) => [file, second.readContent(file)]))).toEqual(before);
        expect(JSON.parse(second.readContent('/.cursor/mcp.json')).mcpServers['exhaustive-ui']).toEqual({ command: 'bunx' });
    });

    it('does not repeat hand-written instructions', async () => {
        const content = `Read ${GUIDE} first.\n`;
        const { tree } = await run(['cursor'], { '/AGENTS.md': content });
        expect(tree.readContent('/AGENTS.md')).toBe(content);
    });

    it('writes to AGENTS.md when CLAUDE.md imports it', async () => {
        const { tree } = await run(['claude-code'], { '/CLAUDE.md': '@AGENTS.md\n', '/AGENTS.md': '# Rules\n' });
        expect(tree.readContent('/CLAUDE.md')).toBe('@AGENTS.md\n');
        expect(tree.readContent('/AGENTS.md')).toContain(GUIDE);
    });

    it('extends .claude/CLAUDE.md and .gemini/GEMINI.md when they are the ones in use', async () => {
        const { tree } = await run(['claude-code', 'gemini-cli'], { '/.claude/CLAUDE.md': '# A\n', '/.gemini/GEMINI.md': '# B\n' });
        expect(tree.readContent('/.claude/CLAUDE.md')).toContain(GUIDE);
        expect(tree.readContent('/.gemini/GEMINI.md')).toContain(GUIDE);
        expect(tree.exists('/CLAUDE.md')).toBe(false);
        expect(tree.exists('/GEMINI.md')).toBe(false);
    });

    it('keeps CRLF line endings', async () => {
        const { tree } = await run(['cursor'], { '/AGENTS.md': '# Rules\r\n' });
        expect(tree.readContent('/AGENTS.md').replace(/\r\n/g, '')).not.toContain('\n');
    });

    it.each(['{ "mcpServers": [', '[]', '{ "mcpServers": "x" }'])('warns and leaves a config file it cannot extend alone: %s', async (content) => {
        const { tree, logs } = await run(['claude-code'], { '/.mcp.json': content });
        expect(tree.readContent('/.mcp.json')).toBe(content);
        expect(logs).toContain('warn: Could not update .mcp.json');
        expect(tree.readContent('/CLAUDE.md')).toContain(GUIDE);
    });

    it('fills an empty config file', async () => {
        const { tree } = await run(['claude-code'], { '/.mcp.json': '\n' });
        expect(JSON.parse(tree.readContent('/.mcp.json'))).toEqual({ mcpServers: { 'exhaustive-ui': SERVER } });
    });
});

describe('ng-add --ai', () => {
    it('configures the selected tools', async () => {
        const tree = await createRunner().runSchematic('ng-add', { skipInstall: true, ai: ['claude-code'] }, createAppTree());
        expect(tree.readContent('/CLAUDE.md')).toContain(GUIDE);
        expect(tree.exists('/.mcp.json')).toBe(true);
    });

    it('configures nothing by default', async () => {
        const tree = await createRunner().runSchematic('ng-add', { skipInstall: true }, createAppTree());
        expect(tree.exists('/CLAUDE.md')).toBe(false);
        expect(tree.exists('/AGENTS.md')).toBe(false);
    });
});
