// Makes the build's asset URLs root-relative in every prerendered page.
//
// Angular writes them relative (`href="chunk-X.js"`) and relies on `<base href="/">`. Cloudflare Pages
// turns `<link rel="modulepreload">` into HTTP `Link` headers (Early Hints), and those resolve against
// the page URL, not the base: on /button/ the browser preloaded /button/chunk-X.js, got index.html
// back and logged "Failed to load module script". Root-relative URLs are right in both places.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.argv[2] ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist/docs/browser');
const ASSET = /(\s(?:href|src)=")((?:chunk|main|polyfills|scripts|styles)-[A-Za-z0-9_-]+\.(?:js|css)")/g;

function* htmlFiles(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* htmlFiles(file);
        else if (entry.name.endsWith('.html')) yield file;
    }
}

let pages = 0;
let urls = 0;
for (const file of htmlFiles(root)) {
    const html = fs.readFileSync(file, 'utf8');
    let count = 0;
    const next = html.replace(ASSET, (_, attr, url) => (count++, `${attr}/${url}`));
    if (count) {
        fs.writeFileSync(file, next);
        pages++;
        urls += count;
    }
}
console.log(`absolute-asset-urls: ${urls} URLs in ${pages} pages`);
