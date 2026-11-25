/**
 * Cloudflare Pages Function in front of the static site, for the clients that read Markdown (coding agents).
 *
 * - A page requested with `Accept: text/markdown` is answered with its Markdown version (`/table/` -> `/table.md`).
 * - A missing .md, .txt or .json file is a short 404, instead of the HTML page of the app.
 *
 * Everything else is the static asset. _routes.json keeps the assets that never need this away from the function.
 */
const DATA_FILE = /\.(?:md|txt|json)$/i;
const FILE = /\.[a-z0-9]+$/i;

/** The weight of a media type in an Accept header; undefined when the header does not name it. */
function quality(accept, type) {
    for (const range of accept.split(',')) {
        const [name, ...parameters] = range.split(';').map((part) => part.trim().toLowerCase());
        if (name !== type) continue;
        const q = parameters.find((parameter) => parameter.startsWith('q='));
        const value = q ? Number(q.slice(2)) : 1;
        return Number.isFinite(value) ? value : 0;
    }
    return undefined;
}

/** Browsers never name text/markdown; agents that do list it first, or with a higher weight than text/html. */
export function prefersMarkdown(accept) {
    const markdown = quality(accept ?? '', 'text/markdown');
    return !!markdown && markdown >= (quality(accept, 'text/html') ?? 0);
}

/** The Markdown version of a page, `/index.md` for the home page; undefined for a file. */
export function markdownPath(pathname) {
    const path = pathname.replace(/\/+$/, '');
    if (FILE.test(path)) return undefined;
    return path ? `${path}.md` : '/index.md';
}

function withVary(response) {
    const varied = new Response(response.body, response);
    varied.headers.append('Vary', 'Accept');
    return varied;
}

/** Tells search engines that the Markdown version of a page is not another page. */
function withCanonical(response, pathname, origin) {
    const canonical = new Response(response.body, response);
    const page = pathname.replace(/\.md$/, '/').replace(/^\/index\/$/, '/');
    canonical.headers.set('Link', `<${origin}${page}>; rel="canonical"`);
    return canonical;
}

function isMarkdown(response) {
    return response.ok && response.headers.get('Content-Type')?.startsWith('text/markdown');
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const reads = request.method === 'GET' || request.method === 'HEAD';
        const markdown = reads ? markdownPath(url.pathname) : undefined;

        if (markdown && prefersMarkdown(request.headers.get('Accept'))) {
            // no conditional headers: they carry the validators of the HTML page
            const response = await env.ASSETS.fetch(new Request(new URL(markdown, url), { method: request.method }));
            if (isMarkdown(response)) return withVary(withCanonical(response, markdown, url.origin));
        }

        const response = await env.ASSETS.fetch(request);

        if (reads && response.status === 404 && DATA_FILE.test(url.pathname)) {
            return new Response(`Not found: ${url.pathname}\nIndex of the documentation: ${url.origin}/llms.txt\n`, { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        }
        if (reads && isMarkdown(response) && !url.pathname.startsWith('/llms/')) return withCanonical(response, url.pathname, url.origin);
        return markdown && response.headers.get('Content-Type')?.startsWith('text/html') ? withVary(response) : response;
    }
};
