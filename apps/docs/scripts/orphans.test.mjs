import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const DOCS = fileURLToPath(new URL('..', import.meta.url));
const IGNORED = new Set(['node_modules', 'dist', '.angular']);

function sources(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const entryPath = path.join(dir, entry.name);
        if (entry.isDirectory()) return IGNORED.has(entry.name) ? [] : sources(entryPath);
        return entry.name.endsWith('.ts') ? [entryPath] : [];
    });
}

/** The doc files a source uses: an import counts when the imported name appears elsewhere in the source. */
function usedFiles(filePath) {
    const source = ts.createSourceFile(filePath, fs.readFileSync(filePath, 'utf8'), ts.ScriptTarget.Latest, true);
    const resolve = (specifier) => (specifier.startsWith('@/') ? path.join(DOCS, specifier.slice(2)) : specifier.startsWith('.') ? path.join(path.dirname(filePath), specifier) : undefined);
    const candidates = (base) => [`${base}.ts`, path.join(base, 'index.ts')];
    const imported = new Map();
    const used = new Set();

    const visit = (node) => {
        if (ts.isImportDeclaration(node)) {
            const base = resolve(node.moduleSpecifier.text);
            const bindings = node.importClause?.namedBindings;
            if (base && bindings && ts.isNamedImports(bindings)) {
                bindings.elements.forEach((element) => imported.set(element.name.text, candidates(base)));
            }
            return;
        }
        if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
            const base = resolve(node.moduleSpecifier.text);
            if (base) candidates(base).forEach((file) => used.add(file));
        }
        if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && ts.isStringLiteralLike(node.arguments[0])) {
            const base = resolve(node.arguments[0].text);
            if (base) candidates(base).forEach((file) => used.add(file));
        }
        if (ts.isIdentifier(node)) imported.get(node.text)?.forEach((file) => used.add(file));
        ts.forEachChild(node, visit);
    };
    visit(source);

    return used;
}

describe('the doc files', () => {
    it('are all shown on the site', () => {
        const files = sources(DOCS);
        const used = new Set(files.flatMap((file) => [...usedFiles(file)]));
        const orphans = files.filter((file) => file.startsWith(path.join(DOCS, 'doc') + path.sep) && !used.has(file)).map((file) => path.relative(DOCS, file));

        assert.deepEqual(orphans, []);
    });
});
