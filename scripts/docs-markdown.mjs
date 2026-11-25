/**
 * Writes the Markdown documentation to a directory, as published on the `docs-markdown` branch.
 *
 * The documentation is generated at build time (apps/docs/public/llms, git-ignored), so the repository itself holds
 * little more than READMEs. Documentation indexes that read a Git repository, like Context7 (see context7.json), read
 * that branch instead. Run after the docs build: `node scripts/docs-markdown.mjs <out-dir>`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(ROOT, 'apps/docs/public/llms');
const SITE = 'https://exhaustive-ui.com';

const outDir = process.argv[2];
if (!outDir) {
    throw new Error('Usage: node scripts/docs-markdown.mjs <out-dir>');
}

const README = `# ExhaustiveUI documentation

Markdown documentation of [ExhaustiveUI](${SITE}), generated from the [main branch](https://github.com/e-xiste/exhaustive-ui). Do not edit: the files are overwritten on every deployment of the site.

- [\`AGENTS.md\`](AGENTS.md): the rules that matter when writing code with the library, and the index of the components
- [\`pages\`](pages): installation, configuration, theming, migration and the other guides
- [\`components\`](components): one page per component, with its examples and API
`;

/** Links of the site (`](/installation)`) become absolute: they mean nothing on a Git branch. */
function absolutize(markdown) {
    return markdown.replace(/\]\(\/(?!\/)/g, `](${SITE}/`);
}

function copyMarkdown(from, to) {
    const files = fs.readdirSync(from).filter((file) => file.endsWith('.md'));
    if (!files.length) {
        throw new Error(`No Markdown file in ${from}: build the docs first.`);
    }
    fs.mkdirSync(to, { recursive: true });
    for (const file of files) {
        fs.writeFileSync(path.join(to, file), absolutize(fs.readFileSync(path.join(from, file), 'utf8')));
    }
    return files.length;
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'README.md'), README);
fs.writeFileSync(path.join(outDir, 'AGENTS.md'), absolutize(fs.readFileSync(path.join(SOURCE, 'AGENTS.md'), 'utf8')));
fs.copyFileSync(path.join(ROOT, 'context7.json'), path.join(outDir, 'context7.json'));
fs.copyFileSync(path.join(ROOT, 'LICENSE.md'), path.join(outDir, 'LICENSE.md'));
const pages = copyMarkdown(path.join(SOURCE, 'pages'), path.join(outDir, 'pages'));
const components = copyMarkdown(path.join(SOURCE, 'components'), path.join(outDir, 'components'));

console.log(`Wrote ${pages} pages and ${components} components to ${outDir}`);
