/**
 * Type-checks the standalone components of public/demos.json against the built library.
 *
 * Each demo is laid out the way StackBlitz receives it: the component at src/app/<key>.ts and its
 * metadata.extFiles / metadata.routeFiles at their own paths. `@exhaustive-ui/core/*` resolves to the
 * declarations of packages/core/dist, `@/*` to the StackBlitz files first and then to apps/docs.
 *
 * Usage: node scripts/democode/typecheck.mjs [outDir]  (prints a summary and writes <outDir>/result.json)
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DOCS_DIR = path.resolve(__dirname, '../..');
export const ROOT = path.resolve(DOCS_DIR, '../..');
export const DEMOS_JSON = path.join(DOCS_DIR, 'public/demos.json');
export const CORE_TYPES = path.join(ROOT, 'packages/core/dist/types');

/** Unused declarations do not make a demo wrong: they are reported apart and never fail it. */
export const IGNORED_CODES = new Set([6133, 6192, 6196, 6198]);

const writeFile = (file, content) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
};

/**
 * @param {Record<string, any>} demos the `demos` map of demos.json
 * @param {string} outDir a scratch directory
 * @returns {{ errors: Record<string, string[]>, unused: Record<string, string[]>, total: number }}
 */
export function typecheckDemos(demos, outDir) {
    fs.mkdirSync(outDir, { recursive: true });
    const nodeModules = path.join(outDir, 'node_modules');
    if (!fs.existsSync(nodeModules)) fs.symlinkSync(path.join(ROOT, 'node_modules'), nodeModules, 'dir');

    // One directory per demo, so that the extFiles and routeFiles of two demos never collide
    const entries = [];
    for (const [key, demo] of Object.entries(demos)) {
        const dir = path.join(outDir, 'demos', key);
        fs.rmSync(dir, { recursive: true, force: true });
        const file = path.join(dir, 'src/app', `${key}.ts`);
        writeFile(file, demo.code.typescript);
        for (const extra of [...(demo.metadata?.extFiles ?? []), ...(demo.metadata?.routeFiles ?? [])]) {
            writeFile(path.join(dir, extra.path), extra.content);
        }
        entries.push({ key, dir, file });
    }

    const baseOptions = {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ES2022,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        strict: false,
        noEmit: true,
        skipLibCheck: true,
        noUnusedLocals: true,
        lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
        types: []
    };
    const libPaths = {
        '@exhaustive-ui/core': [path.join(CORE_TYPES, 'exhaustive-ui-core.d.ts')],
        '@exhaustive-ui/core/*': [path.join(CORE_TYPES, 'exhaustive-ui-core-*.d.ts')]
    };

    // `@/*` depends on the demo directory, so each demo gets its own program; they share parsed library files
    const host = ts.createCompilerHost(baseOptions);
    const cache = new Map();
    const getSourceFile = host.getSourceFile.bind(host);
    host.getSourceFile = (fileName, ...rest) => {
        if (fileName.startsWith(outDir + path.sep + 'demos')) return getSourceFile(fileName, ...rest);
        if (!cache.has(fileName)) cache.set(fileName, getSourceFile(fileName, ...rest));
        return cache.get(fileName);
    };

    const errors = {};
    const unused = {};
    for (const { key, dir, file } of entries) {
        const options = { ...baseOptions, paths: { ...libPaths, '@/*': [path.join(dir, 'src/*'), path.join(DOCS_DIR, '*')] } };
        const program = ts.createProgram({ rootNames: [file], options, host });
        for (const diag of ts.getPreEmitDiagnostics(program)) {
            if (diag.file && !diag.file.fileName.startsWith(dir + path.sep)) continue;
            const where = diag.file ? `${path.relative(dir, diag.file.fileName)}:${diag.file.getLineAndCharacterOfPosition(diag.start).line + 1} ` : '';
            const target = IGNORED_CODES.has(diag.code) ? unused : errors;
            (target[key] ??= []).push(`${where}TS${diag.code}: ${ts.flattenDiagnosticMessageText(diag.messageText, ' ').slice(0, 300)}`);
        }
    }
    return { errors, unused, total: entries.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const outDir = process.argv[2] ? path.resolve(process.argv[2]) : fs.mkdtempSync(path.join(os.tmpdir(), 'democheck-'));
    const { demos } = JSON.parse(fs.readFileSync(DEMOS_JSON, 'utf-8'));
    const result = typecheckDemos(demos, outDir);
    fs.writeFileSync(path.join(outDir, 'result.json'), JSON.stringify(result, null, 1));
    const codes = {};
    for (const list of Object.values(result.errors)) {
        for (const line of list) {
            const code = /TS(\d+)/.exec(line)[1];
            codes[code] = (codes[code] ?? 0) + 1;
        }
    }
    console.log(`demos with errors: ${Object.keys(result.errors).length} / ${result.total}`, codes);
    console.log(`demos with unused declarations: ${Object.keys(result.unused).length}`);
    console.log(`details: ${path.join(outDir, 'result.json')}`);
}
