import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf-8'));
const server = read('../server.json');
const pkg = read('../package.json');

describe('server.json (MCP registry)', () => {
    // The registry proves that the npm package belongs to the server by comparing the two names.
    it('has the name the npm package declares', () => {
        expect(server.name).toBe(pkg.mcpName);
        expect(server.packages[0].identifier).toBe(pkg.name);
    });

    it('is bumped with the package', () => {
        expect(server.version).toBe(pkg.version);
        expect(server.packages[0].version).toBe(pkg.version);
    });

    it('fits the limits of the registry', () => {
        expect(server.description.length).toBeLessThanOrEqual(100);
        expect(server.title.length).toBeLessThanOrEqual(100);
    });
});
