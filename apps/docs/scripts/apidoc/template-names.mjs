import * as fs from 'fs';
import * as path from 'path';

const CLASS = /export class (\w+)/g;
const QUERY = /(?:readonly\s+)?(\w+)\s*=\s*contentChild(?:ren)?\s*(?:<[^\n(]*>)?\s*\(\s*'(\w+)'/g;

/**
 * Maps each component class to its template queries: property name -> the name written in <ng-template #name>.
 * @param {string} srcDir packages/core/src
 * @returns {Map<string, Map<string, string>>}
 */
export function readTemplateNames(srcDir) {
    const result = new Map();
    const visit = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const file = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                visit(file);
            } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts') && !entry.name.endsWith('.d.ts')) {
                readFile(fs.readFileSync(file, 'utf-8'), result);
            }
        }
    };
    visit(srcDir);
    return result;
}

/**
 * @param {string} source
 * @param {Map<string, Map<string, string>>} result
 */
export function readFile(source, result) {
    const classes = [...source.matchAll(CLASS)].map((match) => ({ index: match.index, name: match[1] }));
    for (const match of source.matchAll(QUERY)) {
        const owner = classes.filter((cls) => cls.index < match.index).at(-1);
        if (!owner) continue;
        if (!result.has(owner.name)) result.set(owner.name, new Map());
        result.get(owner.name).set(match[1], match[2]);
    }
    return result;
}
