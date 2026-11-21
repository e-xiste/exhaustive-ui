import { afterEach, describe, expect, it, vi } from 'vitest';
import { DomHandler } from './domhandler';

// Headless Chromium hides native scrollbars, so the measured size is 0 either way.
// Check that the measuring element is styled to show scrollbars while it is attached.
function captureMeasureStyle(measure: () => number) {
    const appendChild = document.body.appendChild.bind(document.body);
    let overflow: { x: string; y: string } | undefined;

    vi.spyOn(document.body, 'appendChild').mockImplementation(<T extends Node>(node: T) => {
        const result = appendChild(node);
        const style = getComputedStyle(node as unknown as Element);
        overflow = { x: style.overflowX, y: style.overflowY };
        return result;
    });

    measure();

    return overflow;
}

describe('DomHandler', () => {
    afterEach(() => {
        (DomHandler as any).calculatedScrollbarWidth = null;
        (DomHandler as any).calculatedScrollbarHeight = null;
    });

    it('calculateScrollbarWidth measures an element that shows scrollbars without a stylesheet (optimus-ui#634)', () => {
        expect(captureMeasureStyle(() => DomHandler.calculateScrollbarWidth())).toEqual({ x: 'scroll', y: 'scroll' });
    });

    it('calculateScrollbarHeight measures an element that shows scrollbars without a stylesheet (optimus-ui#224)', () => {
        expect(captureMeasureStyle(() => DomHandler.calculateScrollbarHeight())).toEqual({ x: 'scroll', y: 'scroll' });
    });

    it('calculateScrollbarHeight caches the height, not the width (optimus-ui#224)', () => {
        const height = DomHandler.calculateScrollbarHeight();

        expect((DomHandler as any).calculatedScrollbarHeight).toBe(height);
        expect((DomHandler as any).calculatedScrollbarWidth).toBeNull();
    });

    it('getScrollableParents crosses shadow roots to the host instead of throwing (optimus-ui#172)', () => {
        const scroller = document.createElement('div');
        scroller.style.overflow = 'auto';
        const host = document.createElement('div');
        scroller.appendChild(host);
        document.body.appendChild(scroller);
        // a popup trigger rendered by a component with ViewEncapsulation.ShadowDom
        const button = document.createElement('button');
        host.attachShadow({ mode: 'open' }).appendChild(button);

        try {
            let parents: Element[] = [];
            expect(() => (parents = DomHandler.getScrollableParents(button))).not.toThrow();
            expect(parents).toContain(scroller);
            expect(DomHandler.getParents(button)).toContain(host);
            expect(DomHandler.getParents(button).some((node: Node) => node.nodeType === Node.DOCUMENT_FRAGMENT_NODE)).toBe(false);
        } finally {
            scroller.remove();
        }
    });
});
