import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ServerConfig } from './config';
import { DocsFetchError, DocsNotFoundError, describeError } from './errors';

/**
 * Where the machine-readable docs come from. Paths are relative to the `/llms/` directory of the docs site:
 * `components.json`, `manifest.json`, `llms.txt`, `llms-full.txt`, `components/<name>.md`, `pages/<name>.md`.
 */
export interface DocsSource {
    readonly kind: string;
    readText(docsPath: string): Promise<string>;
}

const DOCS_PATH_PATTERN = /^(?:components\.json|manifest\.json|llms\.txt|llms-full\.txt|(?:components|pages)\/[a-z0-9][a-z0-9._-]*\.md)$/;

/** Reject anything that is not one of the generated docs files, so a crafted resource URI cannot read elsewhere. */
export function assertDocsPath(docsPath: string): string {
    if (!DOCS_PATH_PATTERN.test(docsPath)) {
        throw new DocsNotFoundError(docsPath, `"${docsPath}" is not a generated docs file`);
    }

    return docsPath;
}

/** In-memory documents, for tests and embedding. */
export class MemorySource implements DocsSource {
    readonly kind = 'memory';

    constructor(private readonly documents: Map<string, string> = new Map()) {}

    async readText(docsPath: string): Promise<string> {
        const text = this.documents.get(assertDocsPath(docsPath));

        if (text === undefined) {
            throw new DocsNotFoundError(docsPath);
        }

        return text;
    }
}

/** The offline snapshot produced at build time by scripts/prebuild.mjs. */
export class SnapshotSource implements DocsSource {
    readonly kind = 'snapshot';

    constructor(readonly directory: string) {}

    async readText(docsPath: string): Promise<string> {
        const file = path.join(this.directory, assertDocsPath(docsPath));

        try {
            return await readFile(file, 'utf8');
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                throw new DocsNotFoundError(docsPath, `Document "${docsPath}" is not in the offline snapshot`);
            }

            throw new DocsFetchError(docsPath, `Cannot read "${docsPath}" from the offline snapshot: ${describeError(error)}`, { cause: error });
        }
    }
}

export type FetchLike = (input: string, init?: { signal?: AbortSignal; headers?: Record<string, string> }) => Promise<{ ok: boolean; status: number; headers: { get(name: string): string | null }; text(): Promise<string> }>;

export interface RemoteSourceOptions {
    baseUrl: string;
    timeoutMs: number;
    fetchImpl?: FetchLike;
    userAgent?: string;
}

/** The live docs site. A not-found path is served as the SPA shell with HTTP 200, so HTML answers are treated as misses. */
export class RemoteSource implements DocsSource {
    readonly kind = 'remote';
    private readonly fetchImpl: FetchLike;

    constructor(private readonly options: RemoteSourceOptions) {
        this.fetchImpl = options.fetchImpl ?? (globalThis.fetch as unknown as FetchLike);
    }

    urlFor(docsPath: string): string {
        return `${this.options.baseUrl.replace(/\/+$/, '')}/llms/${assertDocsPath(docsPath)}`;
    }

    async readText(docsPath: string): Promise<string> {
        const url = this.urlFor(docsPath);
        let response: Awaited<ReturnType<FetchLike>>;

        try {
            response = await this.fetchImpl(url, {
                signal: AbortSignal.timeout(this.options.timeoutMs),
                headers: {
                    accept: 'text/markdown, text/plain, application/json;q=0.9, */*;q=0.1',
                    'user-agent': this.options.userAgent ?? '@exhaustive-ui/mcp'
                }
            });
        } catch (error) {
            throw new DocsFetchError(docsPath, `Cannot reach ${url}: ${describeError(error)}`, { cause: error });
        }

        if (response.status === 404) {
            throw new DocsNotFoundError(docsPath, `${url} answered HTTP 404`);
        }

        if (!response.ok) {
            throw new DocsFetchError(docsPath, `${url} answered HTTP ${response.status}`);
        }

        const text = await response.text();

        if (/text\/html/i.test(response.headers.get('content-type') ?? '') || /^\s*<(?:!doctype|html)/i.test(text)) {
            throw new DocsNotFoundError(docsPath, `${url} is not published (the site answered with its HTML shell)`);
        }

        return text;
    }
}

interface CacheEntry {
    value: string;
    expiresAt: number;
}

export interface CachedSourceOptions {
    ttlMs: number;
    now?: () => number;
}

/** Remembers documents for a TTL, dedupes concurrent reads, and serves a stale copy when a refresh fails. */
export class CachedSource implements DocsSource {
    readonly kind: string;
    private readonly entries = new Map<string, CacheEntry>();
    private readonly pending = new Map<string, Promise<string>>();
    private readonly now: () => number;
    private hits = 0;
    private misses = 0;

    constructor(
        private readonly inner: DocsSource,
        private readonly options: CachedSourceOptions
    ) {
        this.kind = inner.kind;
        this.now = options.now ?? Date.now;
    }

    async readText(docsPath: string): Promise<string> {
        const cached = this.entries.get(docsPath);

        if (cached && cached.expiresAt > this.now()) {
            this.hits++;

            return cached.value;
        }

        const inFlight = this.pending.get(docsPath);

        if (inFlight) {
            return inFlight;
        }

        this.misses++;

        const request = this.inner
            .readText(docsPath)
            .then((value) => {
                this.entries.set(docsPath, { value, expiresAt: this.now() + this.options.ttlMs });

                return value;
            })
            .catch((error: unknown) => {
                if (cached) {
                    // Keep serving what we have rather than failing: the docs change rarely.
                    this.entries.set(docsPath, { value: cached.value, expiresAt: this.now() + this.options.ttlMs });

                    return cached.value;
                }

                throw error;
            })
            .finally(() => {
                this.pending.delete(docsPath);
            });

        this.pending.set(docsPath, request);

        return request;
    }

    invalidate(): void {
        this.entries.clear();
    }

    stats(): { entries: number; hits: number; misses: number; ttlMs: number } {
        return { entries: this.entries.size, hits: this.hits, misses: this.misses, ttlMs: this.options.ttlMs };
    }
}

export interface FallbackStatus {
    primary: string;
    fallback: string;
    fallbackReads: number;
    lastFallbackAt?: string;
    lastFallbackReason?: string;
    /** Set while the primary is skipped after a connection failure. */
    primarySkippedUntil?: string;
}

export interface FallbackSourceOptions {
    /** After a connection failure the primary is not retried for this long, so an offline session stays responsive. */
    cooldownMs?: number;
    now?: () => number;
}

export const DEFAULT_FALLBACK_COOLDOWN_MS = 60_000;

/** Reads from the primary source and falls back to the secondary one when the primary fails for any reason. */
export class FallbackSource implements DocsSource {
    readonly kind: string;
    private readonly cooldownMs: number;
    private readonly now: () => number;
    private fallbackReads = 0;
    private lastFallbackAt: string | undefined;
    private lastFallbackReason: string | undefined;
    private primarySkippedUntil = 0;

    constructor(
        private readonly primary: DocsSource,
        private readonly fallback: DocsSource,
        options: FallbackSourceOptions = {}
    ) {
        this.kind = `${primary.kind}+${fallback.kind}`;
        this.cooldownMs = options.cooldownMs ?? DEFAULT_FALLBACK_COOLDOWN_MS;
        this.now = options.now ?? Date.now;
    }

    async readText(docsPath: string): Promise<string> {
        if (this.primarySkippedUntil > this.now()) {
            try {
                return await this.readFallback(docsPath, undefined);
            } catch {
                // The snapshot lacks it: the live site is the only hope, cool-down or not.
            }
        }

        try {
            return await this.primary.readText(docsPath);
        } catch (primaryError) {
            if (primaryError instanceof DocsFetchError) {
                this.primarySkippedUntil = this.now() + this.cooldownMs;
            }

            try {
                return await this.readFallback(docsPath, primaryError);
            } catch (fallbackError) {
                // A document missing from both places is a not-found; otherwise report why the live site failed.
                throw primaryError instanceof DocsNotFoundError && fallbackError instanceof DocsNotFoundError ? fallbackError : primaryError;
            }
        }
    }

    private async readFallback(docsPath: string, primaryError: unknown): Promise<string> {
        const text = await this.fallback.readText(docsPath);

        this.fallbackReads++;
        this.lastFallbackAt = new Date().toISOString();

        if (primaryError !== undefined) {
            this.lastFallbackReason = describeError(primaryError);
        }

        return text;
    }

    status(): FallbackStatus {
        return {
            primary: this.primary.kind,
            fallback: this.fallback.kind,
            fallbackReads: this.fallbackReads,
            lastFallbackAt: this.lastFallbackAt,
            lastFallbackReason: this.lastFallbackReason,
            primarySkippedUntil: this.primarySkippedUntil > this.now() ? new Date(this.primarySkippedUntil).toISOString() : undefined
        };
    }
}

export interface SourceStatus {
    mode: 'remote' | 'offline';
    docsUrl: string;
    cacheTtlSeconds: number;
    snapshotDir?: string;
    fallback?: FallbackStatus;
    cache?: { entries: number; hits: number; misses: number };
}

export interface ConfiguredSource {
    source: DocsSource;
    status(): SourceStatus;
}

/** The runtime source: the live site behind a TTL cache, falling back to the offline snapshot (or the snapshot alone when offline). */
export function createDocsSource(config: ServerConfig, fetchImpl?: FetchLike): ConfiguredSource {
    const snapshot = config.snapshotDir ? new SnapshotSource(config.snapshotDir) : undefined;

    if (config.offline) {
        if (!snapshot) {
            throw new Error('Offline mode needs an offline snapshot directory (EXHAUSTIVE_UI_MCP_SNAPSHOT_DIR).');
        }

        return {
            source: snapshot,
            status: () => ({ mode: 'offline', docsUrl: config.docsUrl, cacheTtlSeconds: 0, snapshotDir: snapshot.directory })
        };
    }

    const remote = new CachedSource(new RemoteSource({ baseUrl: config.docsUrl, timeoutMs: config.fetchTimeoutMs, fetchImpl }), { ttlMs: config.cacheTtlMs });
    const fallback = snapshot ? new FallbackSource(remote, snapshot) : undefined;

    return {
        source: fallback ?? remote,
        status: () => ({
            mode: 'remote',
            docsUrl: config.docsUrl,
            cacheTtlSeconds: Math.round(config.cacheTtlMs / 1000),
            snapshotDir: snapshot?.directory,
            fallback: fallback?.status(),
            cache: remote.stats()
        })
    };
}
