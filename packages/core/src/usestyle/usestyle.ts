import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { setAttribute, setAttributes } from '@exhaustive-ui/utils';

let _id = 0;

@Injectable({ providedIn: 'root' })
export class UseStyle {
    document: Document = inject(DOCUMENT);

    /**
     * Shadow roots (ViewEncapsulation.ShadowDom hosts) that contain components, with the number of those components.
     * Styles added to the document head do not reach inside them, so every style is copied into them as well.
     */
    private shadowRoots = new Map<ShadowRoot, number>();

    use(css, options: any = {}) {
        let isLoaded = false;
        let cssRef = css;
        let styleRef: HTMLStyleElement | null = null;

        const { immediate = true, manual = false, name = `style_${++_id}`, id = undefined, media = undefined, nonce = undefined, first = false, props = {} } = options;

        if (!this.document) return;
        styleRef = (this.document.querySelector(`style[data-exhaustive-style-id="${name}"]`) || (id && this.document.getElementById(id)) || this.document.createElement('style')) as HTMLStyleElement;

        if (styleRef) {
            if (!styleRef.isConnected) {
                cssRef = css;

                const HEAD = this.document.head;

                setAttribute(styleRef, 'nonce', nonce);

                first && HEAD.firstChild ? HEAD.insertBefore(styleRef, HEAD.firstChild) : HEAD.appendChild(styleRef);
                setAttributes(styleRef, {
                    type: 'text/css',
                    media,
                    nonce,
                    'data-exhaustive-style-id': name
                });
            }

            if (styleRef.textContent !== cssRef) {
                styleRef.textContent = cssRef;
            }

            this.shadowRoots.forEach((_, shadowRoot) => this.copyStyle(styleRef as HTMLStyleElement, shadowRoot, first));
        }

        return {
            id,
            name,
            el: styleRef,
            css: cssRef
        };
    }

    /**
     * Copies the loaded styles into the shadow root that contains `el` and keeps them in sync, until `detach` is called as many times.
     * Does nothing when `el` is not inside a shadow root.
     */
    attach(el: Node | undefined): ShadowRoot | undefined {
        const shadowRoot = this.getShadowRoot(el);

        if (shadowRoot) {
            const count = this.shadowRoots.get(shadowRoot) ?? 0;

            if (count === 0) {
                this.document.head.querySelectorAll<HTMLStyleElement>('style[data-exhaustive-style-id]').forEach((style) => this.copyStyle(style, shadowRoot));
            }

            this.shadowRoots.set(shadowRoot, count + 1);
        }

        return shadowRoot;
    }

    detach(shadowRoot: ShadowRoot | undefined) {
        const count = shadowRoot && this.shadowRoots.get(shadowRoot);

        if (shadowRoot && count) {
            count > 1 ? this.shadowRoots.set(shadowRoot, count - 1) : this.shadowRoots.delete(shadowRoot);
        }
    }

    /**
     * Removes the style named `name` from the document and from the shadow roots.
     */
    remove(name: string) {
        const selector = `style[data-exhaustive-style-id="${name}"]`;

        this.document?.querySelector(selector)?.remove();
        this.shadowRoots.forEach((_, shadowRoot) => shadowRoot.querySelector(selector)?.remove());
    }

    private getShadowRoot(el: Node | undefined): ShadowRoot | undefined {
        const root: any = el?.getRootNode?.();

        return root && root !== this.document && root.nodeType === 11 && root.host ? root : undefined;
    }

    private copyStyle(style: HTMLStyleElement, shadowRoot: ShadowRoot, first = false) {
        const copy = shadowRoot.querySelector(`style[data-exhaustive-style-id="${style.getAttribute('data-exhaustive-style-id')}"]`);

        if (!copy) {
            const clone = style.cloneNode(true) as HTMLStyleElement;

            first && shadowRoot.firstChild ? shadowRoot.insertBefore(clone, shadowRoot.firstChild) : shadowRoot.appendChild(clone);
        } else if (copy.textContent !== style.textContent) {
            copy.textContent = style.textContent;
        }
    }
}
