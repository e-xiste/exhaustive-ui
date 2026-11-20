import { describe, expect, it } from 'vitest';
import { resolveConfig } from '../src/config';
import { DocsFetchError, DocsNotFoundError } from '../src/errors';
import { CachedSource, FallbackSource, MemorySource, RemoteSource, SnapshotSource, assertDocsPath, createDocsSource } from '../src/source';
import { FIXTURE_DIR, fakeFetch, fixtureSource, forbiddenFetch } from './helpers';

describe('assertDocsPath', () => {
    it('accepts the generated docs files only', () => {
        expect(assertDocsPath('components.json')).toBe('components.json');
        expect(assertDocsPath('components/button.md')).toBe('components/button.md');
        expect(assertDocsPath('pages/installation.md')).toBe('pages/installation.md');
        expect(() => assertDocsPath('../package.json')).toThrow(DocsNotFoundError);
        expect(() => assertDocsPath('components/../../etc/passwd')).toThrow(DocsNotFoundError);
        expect(() => assertDocsPath('components/button.json')).toThrow(DocsNotFoundError);
    });
});

describe('SnapshotSource', () => {
    it('reads files from the snapshot directory', async () => {
        const text = await fixtureSource().readText('components/button.md');

        expect(text).toContain('# Angular Button Component');
    });

    it('reports missing documents as not found', async () => {
        await expect(fixtureSource().readText('components/nope.md')).rejects.toBeInstanceOf(DocsNotFoundError);
    });
});

describe('RemoteSource', () => {
    const options = { baseUrl: 'https://docs.example/', timeoutMs: 1000 };

    it('builds URLs under /llms/ of the docs site', () => {
        expect(new RemoteSource(options).urlFor('components/button.md')).toBe('https://docs.example/llms/components/button.md');
    });

    it('returns the body of a successful response', async () => {
        const fetchImpl = fakeFetch();
        const text = await new RemoteSource({ ...options, fetchImpl }).readText('llms.txt');

        expect(text).toContain('# ExhaustiveUI');
        expect(fetchImpl.calls).toEqual(['https://docs.example/llms/llms.txt']);
    });

    it('treats the SPA HTML fallback as not found', async () => {
        const fetchImpl = fakeFetch({ 'components/missing.md': { contentType: 'text/html; charset=utf-8', body: '<!DOCTYPE html><html></html>' } });

        await expect(new RemoteSource({ ...options, fetchImpl }).readText('components/missing.md')).rejects.toBeInstanceOf(DocsNotFoundError);
    });

    it('treats HTTP 404 as not found and other errors as fetch errors', async () => {
        const fetchImpl = fakeFetch({ 'components/a.md': { status: 404, body: 'nope' }, 'components/b.md': { status: 503, body: 'down' } });
        const source = new RemoteSource({ ...options, fetchImpl });

        await expect(source.readText('components/a.md')).rejects.toBeInstanceOf(DocsNotFoundError);
        await expect(source.readText('components/b.md')).rejects.toBeInstanceOf(DocsFetchError);
    });

    it('wraps network failures in a fetch error', async () => {
        await expect(new RemoteSource({ ...options, fetchImpl: forbiddenFetch }).readText('llms.txt')).rejects.toBeInstanceOf(DocsFetchError);
    });
});

describe('CachedSource', () => {
    it('serves repeated reads from memory until the TTL expires', async () => {
        let now = 0;
        const fetchImpl = fakeFetch();
        const cached = new CachedSource(new RemoteSource({ baseUrl: 'https://docs.example', timeoutMs: 1000, fetchImpl }), { ttlMs: 1000, now: () => now });

        await cached.readText('llms.txt');
        await cached.readText('llms.txt');
        expect(fetchImpl.calls).toHaveLength(1);

        now = 1500;
        await cached.readText('llms.txt');
        expect(fetchImpl.calls).toHaveLength(2);
        expect(cached.stats()).toMatchObject({ entries: 1, hits: 1, misses: 2 });
    });

    it('dedupes concurrent reads of the same document', async () => {
        const fetchImpl = fakeFetch();
        const cached = new CachedSource(new RemoteSource({ baseUrl: 'https://docs.example', timeoutMs: 1000, fetchImpl }), { ttlMs: 1000 });

        await Promise.all([cached.readText('manifest.json'), cached.readText('manifest.json'), cached.readText('manifest.json')]);
        expect(fetchImpl.calls).toHaveLength(1);
    });

    it('keeps serving the stale copy when a refresh fails', async () => {
        let now = 0;
        let failing = false;
        const fetchImpl = fakeFetch({
            'llms.txt': () => (failing ? { status: 500, body: 'down' } : { body: 'fresh copy' })
        });
        const cached = new CachedSource(new RemoteSource({ baseUrl: 'https://docs.example', timeoutMs: 1000, fetchImpl }), { ttlMs: 1000, now: () => now });

        expect(await cached.readText('llms.txt')).toBe('fresh copy');

        now = 5000;
        failing = true;
        expect(await cached.readText('llms.txt')).toBe('fresh copy');
        expect(fetchImpl.calls).toHaveLength(2);
    });

    it('propagates the error when there is nothing cached', async () => {
        const cached = new CachedSource(new RemoteSource({ baseUrl: 'https://docs.example', timeoutMs: 1000, fetchImpl: forbiddenFetch }), { ttlMs: 1000 });

        await expect(cached.readText('llms.txt')).rejects.toBeInstanceOf(DocsFetchError);
    });
});

describe('FallbackSource', () => {
    it('falls back to the snapshot when the live site is unreachable', async () => {
        const remote = new RemoteSource({ baseUrl: 'https://docs.example', timeoutMs: 1000, fetchImpl: forbiddenFetch });
        const source = new FallbackSource(remote, fixtureSource());

        expect(await source.readText('components/button.md')).toContain('# Angular Button Component');
        expect(source.status()).toMatchObject({ primary: 'remote', fallback: 'snapshot', fallbackReads: 1 });
        expect(source.status().lastFallbackReason).toContain('Cannot reach');
    });

    it('prefers the live document when both answer', async () => {
        const remote = new RemoteSource({ baseUrl: 'https://docs.example', timeoutMs: 1000, fetchImpl: fakeFetch({ 'llms.txt': { body: 'live version' } }) });
        const source = new FallbackSource(remote, new MemorySource(new Map([['llms.txt', 'snapshot version']])));

        expect(await source.readText('llms.txt')).toBe('live version');
        expect(source.status().fallbackReads).toBe(0);
    });

    it('reports not found when neither source has the document', async () => {
        const remote = new RemoteSource({ baseUrl: 'https://docs.example', timeoutMs: 1000, fetchImpl: fakeFetch() });
        const source = new FallbackSource(remote, fixtureSource());

        await expect(source.readText('components/unknown.md')).rejects.toBeInstanceOf(DocsNotFoundError);
    });

    it('reports the live failure when the snapshot lacks the document', async () => {
        const remote = new RemoteSource({ baseUrl: 'https://docs.example', timeoutMs: 1000, fetchImpl: forbiddenFetch });
        const source = new FallbackSource(remote, new MemorySource());

        await expect(source.readText('llms.txt')).rejects.toBeInstanceOf(DocsFetchError);
    });

    it('stops retrying the live site for a cool-down after a connection failure', async () => {
        let now = 0;
        let reachable = false;
        const fetchImpl = fakeFetch({ 'llms.txt': () => ({ body: 'live version' }) });
        const remote = new RemoteSource({ baseUrl: 'https://docs.example', timeoutMs: 1000, fetchImpl: (input, init) => (reachable ? fetchImpl(input, init) : forbiddenFetch(input, init)) });
        const source = new FallbackSource(remote, fixtureSource(), { cooldownMs: 60_000, now: () => now });

        expect(await source.readText('llms.txt')).toContain('# ExhaustiveUI');
        expect(source.status().primarySkippedUntil).toBe(new Date(60_000).toISOString());

        reachable = true;
        now = 30_000;
        expect(await source.readText('llms.txt')).toContain('# ExhaustiveUI');
        expect(fetchImpl.calls).toHaveLength(0);
        expect(source.status().fallbackReads).toBe(2);

        now = 61_000;
        expect(await source.readText('llms.txt')).toBe('live version');
        expect(fetchImpl.calls).toHaveLength(1);
        expect(source.status().primarySkippedUntil).toBeUndefined();
    });

    it('still asks the live site during the cool-down when the snapshot lacks the document', async () => {
        let now = 0;
        const fetchImpl = fakeFetch({ 'llms.txt': () => ({ body: 'live version' }) });
        let reachable = false;
        const remote = new RemoteSource({ baseUrl: 'https://docs.example', timeoutMs: 1000, fetchImpl: (input, init) => (reachable ? fetchImpl(input, init) : forbiddenFetch(input, init)) });
        const source = new FallbackSource(remote, new MemorySource(), { cooldownMs: 60_000, now: () => now });

        await expect(source.readText('llms.txt')).rejects.toBeInstanceOf(DocsFetchError);

        reachable = true;
        now = 10_000;
        expect(await source.readText('llms.txt')).toBe('live version');
    });
});

describe('createDocsSource', () => {
    it('uses the snapshot alone in offline mode', async () => {
        const config = resolveConfig({ EXHAUSTIVE_UI_MCP_OFFLINE: '1', EXHAUSTIVE_UI_MCP_SNAPSHOT_DIR: FIXTURE_DIR });
        const configured = createDocsSource(config, forbiddenFetch);

        expect(await configured.source.readText('llms.txt')).toContain('# ExhaustiveUI');
        expect(configured.status()).toMatchObject({ mode: 'offline', snapshotDir: FIXTURE_DIR });
    });

    it('reads the live site first and reports the cache and fallback state', async () => {
        const fetchImpl = fakeFetch();
        const config = resolveConfig({ EXHAUSTIVE_UI_DOCS_URL: 'https://docs.example/', EXHAUSTIVE_UI_MCP_CACHE_TTL: '60', EXHAUSTIVE_UI_MCP_SNAPSHOT_DIR: FIXTURE_DIR });
        const configured = createDocsSource(config, fetchImpl);

        await configured.source.readText('llms.txt');
        await configured.source.readText('llms.txt');

        expect(fetchImpl.calls).toEqual(['https://docs.example/llms/llms.txt']);
        expect(configured.status()).toMatchObject({ mode: 'remote', docsUrl: 'https://docs.example', cacheTtlSeconds: 60, cache: { entries: 1, hits: 1, misses: 1 }, fallback: { fallbackReads: 0 } });
    });

    it('refuses offline mode without a snapshot directory', () => {
        expect(() => createDocsSource(resolveConfig({}, { offline: true, snapshotDir: undefined }))).toThrow(/snapshot/);
    });
});

describe('resolveConfig', () => {
    it('applies defaults and parses the environment', () => {
        const config = resolveConfig({});

        expect(config.docsUrl).toBe('https://exhaustive-ui.com');
        expect(config.cacheTtlMs).toBe(15 * 60 * 1000);
        expect(config.fetchTimeoutMs).toBe(10000);
        expect(config.offline).toBe(false);
        expect(config.snapshotDir).toMatch(/[\\/]data$/);

        const custom = resolveConfig({ EXHAUSTIVE_UI_DOCS_URL: 'http://localhost:4200/', EXHAUSTIVE_UI_MCP_CACHE_TTL: '0', EXHAUSTIVE_UI_MCP_FETCH_TIMEOUT: 'abc', EXHAUSTIVE_UI_MCP_OFFLINE: 'true' });

        expect(custom).toMatchObject({ docsUrl: 'http://localhost:4200', cacheTtlMs: 0, fetchTimeoutMs: 10000, offline: true });
    });
});
