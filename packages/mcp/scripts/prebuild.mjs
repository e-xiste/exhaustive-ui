/**
 * Build the offline snapshot shipped in `data/`.
 *
 * The server reads the live docs site at runtime; the snapshot is only the fallback used when the network is
 * unavailable. It is produced from the LLM docs the docs app generates in `apps/docs/public/llms` (build:manifest and
 * build:llm-docs). When that directory is missing, for instance when the package is built on its own, the same files
 * are downloaded from the deployed site instead.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(PACKAGE_ROOT, 'data');
const LOCAL_LLMS_DIR = path.resolve(PACKAGE_ROOT, '../../apps/docs/public/llms');
const DEFAULT_DOCS_URL = 'https://exhaustive-ui.com';
const STATIC_FILES = ['components.json', 'manifest.json', 'llms.txt', 'llms-full.txt'];

function docsUrl() {
    return (process.env.EXHAUSTIVE_UI_DOCS_URL || DEFAULT_DOCS_URL).replace(/\/+$/, '');
}

function resetDataDir() {
    fs.rmSync(DATA_DIR, { recursive: true, force: true });
    fs.mkdirSync(path.join(DATA_DIR, 'components'), { recursive: true });
    fs.mkdirSync(path.join(DATA_DIR, 'pages'), { recursive: true });
}

function writeSnapshotMeta(meta) {
    const components = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'components.json'), 'utf-8'));
    const manifest = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'manifest.json'), 'utf-8'));

    fs.writeFileSync(
        path.join(DATA_DIR, 'snapshot.json'),
        JSON.stringify(
            {
                generatedAt: new Date().toISOString(),
                libraryVersion: manifest.version,
                docsGeneratedAt: components.generatedAt,
                components: components.components.length,
                guides: components.pages.length,
                ...meta
            },
            null,
            2
        ),
        'utf-8'
    );
}

function copyLocal() {
    for (const file of STATIC_FILES) {
        fs.copyFileSync(path.join(LOCAL_LLMS_DIR, file), path.join(DATA_DIR, file));
    }

    for (const dir of ['components', 'pages']) {
        const source = path.join(LOCAL_LLMS_DIR, dir);

        for (const file of fs.readdirSync(source).filter((name) => name.endsWith('.md'))) {
            fs.copyFileSync(path.join(source, file), path.join(DATA_DIR, dir, file));
        }
    }

    writeSnapshotMeta({ source: 'local', origin: path.relative(PACKAGE_ROOT, LOCAL_LLMS_DIR) });
}

async function download(relativePath) {
    const url = `${docsUrl()}/llms/${relativePath}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    const body = await response.text();

    if (!response.ok || /^\s*<(?:!doctype|html)/i.test(body)) {
        throw new Error(`Cannot download ${url}: HTTP ${response.status}${response.ok ? ' (SPA fallback page)' : ''}`);
    }

    return body;
}

async function downloadRemote() {
    for (const file of STATIC_FILES) {
        fs.writeFileSync(path.join(DATA_DIR, file), await download(file), 'utf-8');
    }

    const components = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'components.json'), 'utf-8'));
    const targets = [...components.components.map((c) => `components/${c.name}.md`), ...components.pages.map((p) => `pages/${p.name}.md`)];
    let failed = 0;

    for (let i = 0; i < targets.length; i += 8) {
        await Promise.all(
            targets.slice(i, i + 8).map(async (target) => {
                try {
                    fs.writeFileSync(path.join(DATA_DIR, target), await download(target), 'utf-8');
                } catch (error) {
                    failed++;
                    console.warn(`   ! ${error.message}`);
                }
            })
        );
    }

    if (failed > 0) {
        console.warn(`   ${failed} markdown file(s) could not be downloaded; the snapshot is incomplete for them.`);
    }

    writeSnapshotMeta({ source: 'remote', origin: docsUrl() });
}

async function main() {
    console.log('📦 Building the @exhaustive-ui/mcp offline snapshot...');
    resetDataDir();

    if (STATIC_FILES.every((file) => fs.existsSync(path.join(LOCAL_LLMS_DIR, file)))) {
        copyLocal();
        console.log(`✓ Snapshot copied from ${path.relative(process.cwd(), LOCAL_LLMS_DIR)}`);
    } else {
        console.log(`   ${path.relative(process.cwd(), LOCAL_LLMS_DIR)} is missing (run \`pnpm --filter docs build:docs\` to generate it).`);
        console.log(`   Downloading the snapshot from ${docsUrl()} instead...`);
        await downloadRemote();
        console.log(`✓ Snapshot downloaded from ${docsUrl()}`);
    }

    const meta = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'snapshot.json'), 'utf-8'));
    console.log(`   @exhaustive-ui/core ${meta.libraryVersion}: ${meta.components} components, ${meta.guides} guides`);
}

main().catch((error) => {
    console.error(`✗ ${error.message}`);
    process.exit(1);
});
