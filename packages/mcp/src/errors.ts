/** A tool request that cannot be fulfilled; the structured content is returned to the client next to the message. */
export class ToolError extends Error {
    constructor(
        message: string,
        public readonly structuredContent: Record<string, unknown> = {}
    ) {
        super(message);
        this.name = 'ToolError';
    }
}

/** The docs source has no such document (HTTP 404, SPA fallback page, or missing snapshot file). */
export class DocsNotFoundError extends Error {
    constructor(
        public readonly path: string,
        message = `Document "${path}" not found`
    ) {
        super(message);
        this.name = 'DocsNotFoundError';
    }
}

/** The docs source could not be reached or answered with an error. */
export class DocsFetchError extends Error {
    constructor(
        public readonly path: string,
        message: string,
        options?: { cause?: unknown }
    ) {
        super(message, options);
        this.name = 'DocsFetchError';
    }
}

/** First line of an error message, with local filesystem paths redacted. */
export function describeError(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);

    return (
        message
            .split(/\r?\n/, 1)[0]!
            .trim()
            .replace(/(?:[A-Za-z]:\\|\/(?:Users|private|tmp|var|home|root)\/)[^\s]+/g, '[redacted path]') || 'Tool request failed unexpectedly.'
    );
}
