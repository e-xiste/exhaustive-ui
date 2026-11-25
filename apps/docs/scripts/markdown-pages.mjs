/**
 * Publishes the Markdown version of the pages at the address of the page (`/table/` -> `/table.md`), and llms.txt at
 * the root of the site, where clients look for it. The files come from public/llms (build-llm-docs.mjs).
 *
 * Also adds the link to the Markdown version to the prerendered HTML, and a 404.html: without one, Cloudflare Pages
 * answers any unknown address with the home page and a 200. Run after `ng build`: `node scripts/markdown-pages.mjs [browser-dir]`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { componentRoute } from './llm/routes.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** The route of each page that has a Markdown version, with the file of public/llms that holds it. */
export function markdownRoutes({ components, pages }) {
    return new Map([
        ...components.map(({ name }) => [componentRoute(name), `components/${name}.md`]),
        // a guide wins over a component document of the same name: it is the one shown at that address
        ...pages.map(({ path: route }) => [route, `pages/${route.split('/').pop()}.md`])
    ]);
}

export function addAlternateLink(html, route) {
    const link = `<link rel="alternate" type="text/markdown" href="/${route}.md">`;
    return html.includes(link) ? html : html.replace('</head>', `${link}</head>`);
}

function main(browserDir) {
    const llms = path.join(browserDir, 'llms');
    const routes = markdownRoutes(JSON.parse(fs.readFileSync(path.join(llms, 'components.json'), 'utf8')));

    for (const [route, file] of routes) {
        const page = path.join(browserDir, route, 'index.html');
        if (!fs.existsSync(page)) throw new Error(`/${route} has a Markdown version but is not prerendered.`);
        fs.copyFileSync(path.join(llms, file), path.join(browserDir, `${route}.md`));
        fs.writeFileSync(page, addAlternateLink(fs.readFileSync(page, 'utf8'), route));
    }

    fs.copyFileSync(path.join(llms, 'llms.txt'), path.join(browserDir, 'llms.txt'));
    fs.copyFileSync(path.join(llms, 'llms-full.txt'), path.join(browserDir, 'llms-full.txt'));
    fs.copyFileSync(path.join(llms, 'llms.txt'), path.join(browserDir, 'index.md'));
    const home = path.join(browserDir, 'index.html');
    fs.writeFileSync(home, addAlternateLink(fs.readFileSync(home, 'utf8'), 'index'));

    // the client-side shell: the app shows its own "not found" page, and still opens a route that is not prerendered
    fs.copyFileSync(path.join(browserDir, 'index.csr.html'), path.join(browserDir, '404.html'));

    console.log(`markdown-pages: ${routes.size} pages, llms.txt, llms-full.txt and 404.html`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main(path.resolve(process.argv[2] ?? path.join(ROOT, 'dist/docs/browser')));
}
