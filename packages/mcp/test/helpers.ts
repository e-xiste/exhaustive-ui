import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createToolContext } from '../src/server';
import { MemorySource, SnapshotSource, type DocsSource, type FetchLike } from '../src/source';
import type { ToolContext } from '../src/tools';

export const FIXTURE_DIR = fileURLToPath(new URL('./fixtures/llms', import.meta.url));

export function fixtureSource(): SnapshotSource {
    return new SnapshotSource(FIXTURE_DIR);
}

/** Every fixture file as an in-memory map, for sources that must not touch the filesystem. */
export function fixtureDocuments(): Map<string, string> {
    const documents = new Map<string, string>();

    for (const file of readdirSync(FIXTURE_DIR, { recursive: true, encoding: 'utf8' })) {
        const absolute = path.join(FIXTURE_DIR, file);

        if (file.endsWith('.json') || file.endsWith('.txt') || file.endsWith('.md')) {
            documents.set(file.split(path.sep).join('/'), readFileSync(absolute, 'utf8'));
        }
    }

    return documents;
}

export function memorySource(): MemorySource {
    return new MemorySource(fixtureDocuments());
}

export function fixtureContext(source: DocsSource = fixtureSource()): ToolContext {
    return createToolContext({ source, version: '0.0.0-test', env: {} });
}

/** A fetch stub that must never be called: the suite runs offline. */
export const forbiddenFetch: FetchLike = async (input) => {
    throw new Error(`Unexpected network request to ${input}`);
};

export interface FakeResponseInit {
    status?: number;
    contentType?: string;
    body: string;
}

/** A fetch stub serving the fixture documents (or custom answers) and recording the requested URLs. */
export function fakeFetch(answers: Record<string, FakeResponseInit | (() => FakeResponseInit)> = {}, documents = fixtureDocuments()): FetchLike & { calls: string[] } {
    const calls: string[] = [];
    const fetchImpl = (async (input: string) => {
        calls.push(input);

        const relative = input.replace(/^.*\/llms\//, '');
        const answer = answers[relative];
        const init = typeof answer === 'function' ? answer() : answer;
        const body = init?.body ?? documents.get(relative);
        const status = init?.status ?? (body === undefined ? 200 : 200);
        const contentType = init?.contentType ?? (relative.endsWith('.json') ? 'application/json' : 'text/plain; charset=utf-8');

        return {
            ok: status >= 200 && status < 300,
            status,
            headers: { get: (name: string) => (name.toLowerCase() === 'content-type' ? contentType : null) },
            text: async () => body ?? '<!DOCTYPE html><html><body>SPA fallback</body></html>'
        };
    }) as FetchLike & { calls: string[] };

    fetchImpl.calls = calls;

    return fetchImpl;
}
