import { fileURLToPath } from 'node:url';

export const DEFAULT_DOCS_URL = 'https://exhaustive-ui.e-xiste.com';
export const DEFAULT_CACHE_TTL_SECONDS = 15 * 60;
export const DEFAULT_FETCH_TIMEOUT_MS = 10_000;
export const RESOURCE_BASE_URI = 'exhaustive-ui://docs';

/** Package-relative path of the offline snapshot written by scripts/prebuild.mjs (works from src/ and from dist/). */
export const DEFAULT_SNAPSHOT_DIR = fileURLToPath(new URL('../data', import.meta.url));

export interface ServerConfig {
    /** Base URL of the docs site; the machine-readable docs live under `${docsUrl}/llms/`. */
    docsUrl: string;
    /** How long a fetched document is reused before it is fetched again. */
    cacheTtlMs: number;
    /** Per-request timeout for the docs site. */
    fetchTimeoutMs: number;
    /** When true the live site is never contacted and only the snapshot is used. */
    offline: boolean;
    /** Directory holding the offline snapshot; undefined disables the fallback. */
    snapshotDir: string | undefined;
}

export type Env = Record<string, string | undefined>;

export function resolveConfig(env: Env = process.env, overrides: Partial<ServerConfig> = {}): ServerConfig {
    return {
        docsUrl: (overrides.docsUrl ?? env.EXHAUSTIVE_UI_DOCS_URL ?? DEFAULT_DOCS_URL).replace(/\/+$/, ''),
        cacheTtlMs: overrides.cacheTtlMs ?? parseNumber(env.EXHAUSTIVE_UI_MCP_CACHE_TTL, DEFAULT_CACHE_TTL_SECONDS) * 1000,
        fetchTimeoutMs: overrides.fetchTimeoutMs ?? parseNumber(env.EXHAUSTIVE_UI_MCP_FETCH_TIMEOUT, DEFAULT_FETCH_TIMEOUT_MS),
        offline: overrides.offline ?? parseBoolean(env.EXHAUSTIVE_UI_MCP_OFFLINE),
        snapshotDir: 'snapshotDir' in overrides ? overrides.snapshotDir : (env.EXHAUSTIVE_UI_MCP_SNAPSHOT_DIR ?? DEFAULT_SNAPSHOT_DIR)
    };
}

function parseNumber(value: string | undefined, fallback: number): number {
    if (value === undefined || value.trim() === '') {
        return fallback;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function parseBoolean(value: string | undefined): boolean {
    return value !== undefined && ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}
