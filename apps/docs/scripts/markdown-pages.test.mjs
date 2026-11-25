import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { addAlternateLink, markdownRoutes } from './markdown-pages.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');

// the worker is a module for Cloudflare; Node only reads a .js file as one through a data URL
const source = fs.readFileSync(path.join(PUBLIC, '_worker.js'), 'utf8');
const { default: worker, markdownPath, prefersMarkdown } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

const FILES = {
    '/table/': ['text/html; charset=utf-8', '<h1>Table</h1>'],
    '/table.md': ['text/markdown; charset=utf-8', '# Table'],
    '/roadmap/': ['text/html; charset=utf-8', '<h1>Roadmap</h1>'],
    '/': ['text/html; charset=utf-8', '<h1>Home</h1>'],
    '/index.md': ['text/markdown; charset=utf-8', '# Home'],
    '/llms.txt': ['text/plain; charset=utf-8', 'index']
};

function get(pathname, accept) {
    const env = {
        ASSETS: {
            fetch: async (request) => {
                const [type, body] = FILES[new URL(request.url).pathname] ?? [];
                return body ? new Response(body, { headers: { 'Content-Type': type } }) : new Response('<h1>404</h1>', { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
            }
        }
    };
    return worker.fetch(new Request(`https://exhaustive-ui.com${pathname}`, { headers: accept ? { Accept: accept } : {} }), env);
}

const BROWSER = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';
const AGENT = 'text/markdown, text/html, */*';

describe('the Accept header', () => {
    it('selects Markdown only when it is named, and not less wanted than HTML', () => {
        assert.equal(prefersMarkdown(AGENT), true);
        assert.equal(prefersMarkdown('text/markdown'), true);
        assert.equal(prefersMarkdown('text/html;q=0.8, text/markdown'), true);
        assert.equal(prefersMarkdown(BROWSER), false);
        assert.equal(prefersMarkdown('*/*'), false);
        assert.equal(prefersMarkdown(null), false);
        assert.equal(prefersMarkdown('text/html, text/markdown;q=0.5'), false);
        assert.equal(prefersMarkdown('text/markdown;q=0'), false);
    });

    it('applies to pages, not to files', () => {
        assert.equal(markdownPath('/table/'), '/table.md');
        assert.equal(markdownPath('/theming/styled'), '/theming/styled.md');
        assert.equal(markdownPath('/'), '/index.md');
        assert.equal(markdownPath('/llms.txt'), undefined);
    });
});

describe('the worker', () => {
    it('answers an agent with the Markdown of the page', async () => {
        for (const [pathname, body] of [
            ['/table/', '# Table'],
            ['/table', '# Table'],
            ['/', '# Home']
        ]) {
            const response = await get(pathname, AGENT);
            assert.equal(await response.text(), body);
            assert.match(response.headers.get('Content-Type'), /^text\/markdown/);
            assert.equal(response.headers.get('Vary'), 'Accept');
        }
    });

    it('names the HTML page as the canonical one', async () => {
        for (const [pathname, accept, page] of [
            ['/table.md', undefined, '/table/'],
            ['/table/', AGENT, '/table/'],
            ['/', AGENT, '/']
        ]) {
            assert.equal((await get(pathname, accept)).headers.get('Link'), `<https://exhaustive-ui.com${page}>; rel="canonical"`);
        }
    });

    it('answers a browser with the HTML of the page', async () => {
        const response = await get('/table/', BROWSER);
        assert.equal(await response.text(), '<h1>Table</h1>');
        assert.equal(response.headers.get('Vary'), 'Accept');
    });

    it('answers with HTML when the page has no Markdown version', async () => {
        assert.equal(await (await get('/roadmap/', AGENT)).text(), '<h1>Roadmap</h1>');
    });

    it('leaves files alone', async () => {
        const response = await get('/llms.txt', AGENT);
        assert.equal(await response.text(), 'index');
        assert.equal(response.headers.get('Vary'), null);
    });

    it('answers a missing data file with a text 404 that points to the index', async () => {
        const response = await get('/llms/components/dropdown.md', AGENT);
        assert.equal(response.status, 404);
        assert.match(response.headers.get('Content-Type'), /^text\/plain/);
        assert.match(await response.text(), /\/llms\.txt/);
    });

    it('keeps the HTML 404 for a missing page', async () => {
        const response = await get('/nothing', BROWSER);
        assert.equal(response.status, 404);
        assert.match(response.headers.get('Content-Type'), /^text\/html/);
    });
});

describe('the Markdown pages', () => {
    const routes = markdownRoutes(JSON.parse(fs.readFileSync(path.join(PUBLIC, 'llms/components.json'), 'utf8')));

    it('exist at the address of a prerendered page', () => {
        const prerendered = new Set(fs.readFileSync(path.join(ROOT, 'router/routes.txt'), 'utf8').split('\n'));
        assert.deepEqual(
            [...routes.keys()].filter((route) => !prerendered.has(`/${route}`)),
            []
        );
    });

    it('cover the pages, but the few without a Markdown document', () => {
        const without = fs
            .readFileSync(path.join(ROOT, 'router/routes.txt'), 'utf8')
            .split('\n')
            .filter((route) => route && route !== '/' && !routes.has(route.slice(1)));
        assert.deepEqual(without, ['/bind', '/filterservice', '/playground', '/roadmap']);
    });

    it('are copied from existing files', () => {
        for (const file of routes.values()) assert.ok(fs.existsSync(path.join(PUBLIC, 'llms', file)), file);
    });

    it('are linked once from the HTML', () => {
        const html = addAlternateLink('<html><head></head></html>', 'table');
        assert.equal(html, '<html><head><link rel="alternate" type="text/markdown" href="/table.md"></head></html>');
        assert.equal(addAlternateLink(html, 'table'), html);
    });
});

describe('_routes.json', () => {
    it('is valid for Cloudflare Pages', () => {
        const { version, include, exclude } = JSON.parse(fs.readFileSync(path.join(PUBLIC, '_routes.json'), 'utf8'));
        assert.equal(version, 1);
        assert.ok(include.length >= 1 && include.length + exclude.length <= 100);
        for (const rule of [...include, ...exclude]) assert.ok(rule.startsWith('/') && rule.length <= 100, rule);
    });
});

describe('the component cards', () => {
    it('have no unfilled placeholder', () => {
        const cards = path.join(PUBLIC, 'llms/cards');
        for (const file of fs.readdirSync(cards).filter((name) => name.endsWith('.md'))) {
            assert.ok(!fs.readFileSync(path.join(cards, file), 'utf8').includes('${input.'), file);
        }
    });
});
