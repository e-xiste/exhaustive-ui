import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { markdownRoutes } from './markdown-pages.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const read = (file) => fs.readFileSync(path.join(REPO, file), 'utf8');
const json = (file) => JSON.parse(read(file));

const PLUGIN = 'plugins/exhaustive-ui';
const TEMPLATE = 'templates/angular';
const core = json('packages/core/package.json');

describe('the Claude Code plugin', () => {
    const skill = read(`${PLUGIN}/skills/exhaustive-ui/SKILL.md`);

    it('is the one the marketplace lists', () => {
        const [plugin] = json('.claude-plugin/marketplace.json').plugins;
        assert.equal(plugin.source, `./${PLUGIN}`);
        assert.equal(plugin.name, json(`${PLUGIN}/.claude-plugin/plugin.json`).name);
    });

    it('starts the published MCP server', () => {
        const { args } = json(`${PLUGIN}/.claude-plugin/plugin.json`).mcpServers['exhaustive-ui'];
        assert.equal(args.at(-1), json('packages/mcp/package.json').name);
    });

    it('names existing MCP tools and schematics in its skill', () => {
        const tools = read('packages/mcp/src/server.ts') + read('packages/mcp/src/tools.ts');
        for (const tool of ['search', 'get_component', 'get_example', 'get_guide', 'validate_usage']) {
            assert.ok(skill.includes(`\`${tool}\``) && tools.includes(`'${tool}'`), tool);
        }
        const schematics = Object.keys(json('packages/core/schematics/collection.json').schematics);
        const used = [...skill.matchAll(/@exhaustive-ui\/core:([\w-]+)/g)].map((match) => match[1]);
        assert.ok(used.length > 0);
        for (const name of used) assert.ok(schematics.includes(name), name);
    });

    it('links to existing Markdown pages in its skill', () => {
        const routes = markdownRoutes(json('apps/docs/public/llms/components.json'));
        const links = [...skill.matchAll(/https:\/\/exhaustive-ui\.com\/((?!llms)[\w/-]+)\.md/g)].map((match) => match[1]);
        assert.ok(links.length > 0);
        for (const link of links) assert.ok(routes.has(link), link);
    });

    it('names the current major', () => {
        const major = core.version.split('.')[0];
        assert.ok(skill.includes(`version ${major} requires Angular ${major}`));
    });
});

describe('the starter template', () => {
    const { dependencies } = json(`${TEMPLATE}/package.json`);
    const major = (range) => range.match(/\d+/)[0];

    it('is on the current major of ExhaustiveUI and Angular', () => {
        for (const name of ['@exhaustive-ui/core', '@exhaustive-ui/themes', '@angular/core']) assert.equal(major(dependencies[name]), major(core.version), name);
    });

    it('configures the MCP server for each editor', () => {
        for (const [file, key] of [
            ['.mcp.json', 'mcpServers'],
            ['.cursor/mcp.json', 'mcpServers'],
            ['.vscode/mcp.json', 'servers']
        ]) {
            assert.deepEqual(json(`${TEMPLATE}/${file}`)[key]['exhaustive-ui'].args, ['-y', '@exhaustive-ui/mcp'], file);
        }
    });

    it('has the instructions for agents', () => {
        for (const file of ['AGENTS.md', 'CLAUDE.md']) assert.match(read(`${TEMPLATE}/${file}`), /node_modules\/@exhaustive-ui\/core\/AGENTS\.md/);
    });
});
