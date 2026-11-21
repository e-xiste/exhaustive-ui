import { Base } from '@exhaustive-ui/core/base';
import { Theme } from '@exhaustive-ui/styled';

/*
 * The Angular unit-test builder runs every test file in ONE browser document (vitest `isolate: false`), and it
 * executes this setup file before each test file. Whatever a file leaves behind (a theme preset kept in the Theme
 * singleton, component <style> tags, fixtures appended to <body>, a body scroll lock, a scrolled window) changes the
 * layout seen by the files that run after it. Record the pristine document once, and restore it after every file.
 */
const BASELINE = Symbol.for('exhaustive-ui/test-document-baseline');
const attributesOf = (element: Element) => Array.from(element.attributes).map(({ name, value }) => [name, value]);
const globals = globalThis as any;

globals[BASELINE] ??= {
    head: new Set(Array.from(document.head.childNodes)),
    body: new Set(Array.from(document.body.childNodes)),
    htmlAttributes: attributesOf(document.documentElement),
    bodyAttributes: attributesOf(document.body)
};

afterAll(() => {
    const baseline = globals[BASELINE];

    for (const parent of [document.head, document.body]) {
        const initial: Set<Node> = parent === document.head ? baseline.head : baseline.body;
        Array.from(parent.childNodes)
            .filter((node) => !initial.has(node))
            .forEach((node) => node.parentNode?.removeChild(node));
    }

    for (const [element, attributes] of [
        [document.documentElement, baseline.htmlAttributes],
        [document.body, baseline.bodyAttributes]
    ] as [Element, string[][]][]) {
        Array.from(element.attributes).forEach(({ name }) => element.removeAttribute(name));
        attributes.forEach(([name, value]) => element.setAttribute(name, value));
    }

    Theme._theme = undefined;
    Theme._tokens = {};
    Theme.clearLoadedStyleNames();
    Base.clearLoadedStyleNames();

    (document.activeElement as HTMLElement | null)?.blur?.();
    window.scrollTo(0, 0);
});
