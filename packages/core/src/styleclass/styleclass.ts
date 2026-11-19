import { booleanAttribute, Directive, ElementRef, HostListener, NgModule, NgZone, OnDestroy, Renderer2, inject, input, signal } from '@angular/core';
import { addClass, getTargetElement, hasClass, isElement, removeClass } from '@exhaustive-ui/utils';
import { VoidListener } from '@exhaustive-ui/core/ts-helpers';

/**
 * StyleClass manages css classes declaratively to during enter/leave animations or just to toggle classes on an element.
 * @group Components
 */
@Directive({
    selector: '[pStyleClass]'
})
export class StyleClass implements OnDestroy {
    el = inject(ElementRef);
    renderer = inject(Renderer2);
    private zone = inject(NgZone);

    /**
     * Selector to define the target element. Available selectors are '@next', '@prev', '@parent' and '@grandparent'.
     * @group Props
     */
    readonly selector = input<string | undefined>(undefined, { alias: 'pStyleClass' });
    /**
     * Style class to add when item begins to get displayed.
     * @group Props
     */
    readonly enterFromClass = input<string | undefined>();
    /**
     * Style class to add during enter animation.
     * @group Props
     */
    readonly enterActiveClass = input<string | undefined>();
    /**
     * Style class to add when item begins to get displayed.
     * @group Props
     */
    readonly enterToClass = input<string | undefined>();
    /**
     * Style class to add when item begins to get hidden.
     * @group Props
     */
    readonly leaveFromClass = input<string | undefined>();
    /**
     * Style class to add during leave animation.
     * @group Props
     */
    readonly leaveActiveClass = input<string | undefined>();
    /**
     * Style class to add when leave animation is completed.
     * @group Props
     */
    readonly leaveToClass = input<string | undefined>();
    /**
     * Whether to trigger leave animation when outside of the element is clicked.
     * @group Props
     */
    readonly hideOnOutsideClick = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Adds or removes a class when no enter-leave animation is required.
     * @group Props
     */
    readonly toggleClass = input<string | undefined>();
    /**
     * Whether to trigger leave animation when escape key pressed.
     * @group Props
     */
    readonly hideOnEscape = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether to trigger leave animation when the target element resized.
     * @group Props
     */
    readonly hideOnResize = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Target element to listen resize. Valid values are "window", "document" or target element selector.
     * @group Props
     */
    readonly resizeSelector = input<string | undefined>();

    documentClickListener = signal<VoidListener>(undefined);

    documentKeydownListener = signal<VoidListener>(undefined);

    windowResizeListener = signal<VoidListener>(undefined);

    resizeObserver = signal<ResizeObserver | undefined>(undefined);

    target = signal<HTMLElement | null | undefined>(undefined);

    enterListener = signal<VoidListener>(undefined);

    leaveListener = signal<VoidListener>(undefined);

    animating = signal<boolean | undefined>(undefined);

    _resizeTarget = signal<any>(undefined);

    @HostListener('click')
    clickListener() {
        if (!this.target()) {
            this.target.set(getTargetElement(this.selector(), this.el.nativeElement) as HTMLElement);
        }

        if (this.toggleClass()) {
            this.toggle();
        } else {
            if ((this.target() as HTMLElement)?.offsetParent === null) this.enter();
            else this.leave();
        }
    }

    toggle() {
        if (hasClass(this.target()!, this.toggleClass() as string)) removeClass(this.target()!, this.toggleClass() as string);
        else addClass(this.target()!, this.toggleClass() as string);
    }

    enter() {
        const enterFromClass = this.enterFromClass();
        const enterActiveClass = this.enterActiveClass();

        if (enterActiveClass) {
            if (!this.animating()) {
                this.animating.set(true);

                if (enterActiveClass.includes('slidedown')) {
                    (this.target() as HTMLElement).style.height = '0px';
                    removeClass(this.target()!, enterFromClass || 'hidden');
                    (this.target() as HTMLElement).style.maxHeight = (this.target() as HTMLElement).scrollHeight + 'px';
                    addClass(this.target()!, enterFromClass || 'hidden');
                    (this.target() as HTMLElement).style.height = '';
                }

                addClass(this.target()!, enterActiveClass);
                if (enterFromClass) {
                    removeClass(this.target()!, enterFromClass);
                }

                this.enterListener.set(
                    this.renderer.listen(this.target()!, 'animationend', () => {
                        removeClass(this.target()!, this.enterActiveClass() as string);
                        const enterToClass = this.enterToClass();
                        if (enterToClass) {
                            addClass(this.target()!, enterToClass);
                        }
                        const enterListener = this.enterListener();
                        enterListener && enterListener();

                        if (this.enterActiveClass()?.includes('slidedown')) {
                            (this.target() as HTMLElement).style.maxHeight = '';
                        }
                        this.animating.set(false);
                    })
                );
            }
        } else {
            if (enterFromClass) {
                removeClass(this.target()!, enterFromClass);
            }

            const enterToClass = this.enterToClass();
            if (enterToClass) {
                addClass(this.target()!, enterToClass);
            }
        }

        if (this.hideOnOutsideClick()) {
            this.bindDocumentClickListener();
        }

        if (this.hideOnEscape()) {
            this.bindDocumentKeydownListener();
        }

        if (this.hideOnResize()) {
            this.bindResizeListener();
        }
    }

    leave() {
        const leaveFromClass = this.leaveFromClass();
        const leaveActiveClass = this.leaveActiveClass();

        if (leaveActiveClass) {
            if (!this.animating()) {
                this.animating.set(true);
                addClass(this.target()!, leaveActiveClass);
                if (leaveFromClass) {
                    removeClass(this.target()!, leaveFromClass);
                }

                this.leaveListener.set(
                    this.renderer.listen(this.target()!, 'animationend', () => {
                        removeClass(this.target()!, this.leaveActiveClass() as string);
                        const leaveToClass = this.leaveToClass();
                        if (leaveToClass) {
                            addClass(this.target()!, leaveToClass);
                        }
                        const leaveListener = this.leaveListener();
                        leaveListener && leaveListener();
                        this.animating.set(false);
                    })
                );
            }
        } else {
            if (leaveFromClass) {
                removeClass(this.target()!, leaveFromClass);
            }

            const leaveToClass = this.leaveToClass();
            if (leaveToClass) {
                addClass(this.target()!, leaveToClass);
            }
        }

        if (this.hideOnOutsideClick()) {
            this.unbindDocumentClickListener();
        }

        if (this.hideOnEscape()) {
            this.unbindDocumentKeydownListener();
        }

        if (this.hideOnResize()) {
            this.unbindResizeListener();
        }
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener()) {
            this.documentClickListener.set(
                this.renderer.listen(this.el.nativeElement.ownerDocument, 'click', (event) => {
                    if (!this.isVisible() || getComputedStyle(this.target() as HTMLElement).getPropertyValue('position') === 'static') this.unbindDocumentClickListener();
                    else if (this.isOutsideClick(event)) this.leave();
                })
            );
        }
    }

    bindDocumentKeydownListener() {
        if (!this.documentKeydownListener()) {
            this.zone.runOutsideAngular(() => {
                this.documentKeydownListener.set(
                    this.renderer.listen(this.el.nativeElement.ownerDocument, 'keydown', (event) => {
                        const { key, keyCode, which, type } = event;
                        if (!this.isVisible() || getComputedStyle(this.target() as HTMLElement).getPropertyValue('position') === 'static') this.unbindDocumentKeydownListener();
                        if (this.isVisible() && key === 'Escape' && keyCode === 27 && which === 27) this.leave();
                    })
                );
            });
        }
    }

    isVisible() {
        return (this.target() as HTMLElement).offsetParent !== null;
    }

    isOutsideClick(event: MouseEvent) {
        return !this.el.nativeElement.isSameNode(event.target) && !this.el.nativeElement.contains(event.target) && !(this.target() as HTMLElement).contains(<HTMLElement>event.target);
    }

    unbindDocumentClickListener() {
        const documentClickListener = this.documentClickListener();
        if (documentClickListener) {
            documentClickListener();
            this.documentClickListener.set(null);
        }
    }

    unbindDocumentKeydownListener() {
        const documentKeydownListener = this.documentKeydownListener();
        if (documentKeydownListener) {
            documentKeydownListener();
            this.documentKeydownListener.set(null);
        }
    }

    bindResizeListener() {
        this._resizeTarget.set(getTargetElement(this.resizeSelector()));
        if (isElement(this._resizeTarget())) {
            this.bindElementResizeListener();
        } else {
            this.bindWindowResizeListener();
        }
    }

    unbindResizeListener() {
        this.unbindWindowResizeListener();
        this.unbindElementResizeListener();
    }

    bindWindowResizeListener() {
        if (!this.windowResizeListener()) {
            this.zone.runOutsideAngular(() => {
                this.windowResizeListener.set(
                    this.renderer.listen(window, 'resize', () => {
                        if (!this.isVisible()) {
                            this.unbindWindowResizeListener();
                        } else {
                            this.leave();
                        }
                    })
                );
            });
        }
    }

    unbindWindowResizeListener() {
        const windowResizeListener = this.windowResizeListener();
        if (windowResizeListener) {
            windowResizeListener();
            this.windowResizeListener.set(null);
        }
    }

    bindElementResizeListener() {
        if (!this.resizeObserver() && this._resizeTarget()) {
            let isFirstResize = true;
            const resizeObserver = new ResizeObserver(() => {
                if (isFirstResize) {
                    isFirstResize = false;
                    return;
                }

                if (this.isVisible()) {
                    this.leave();
                }
            });
            resizeObserver.observe(this._resizeTarget());
            this.resizeObserver.set(resizeObserver);
        }
    }

    unbindElementResizeListener() {
        const resizeObserver = this.resizeObserver();
        if (resizeObserver) {
            resizeObserver.disconnect();
            this.resizeObserver.set(undefined);
        }
    }

    ngOnDestroy() {
        this.target.set(null);
        this._resizeTarget.set(null);

        this.unbindDocumentClickListener();
        this.unbindDocumentKeydownListener();
        this.unbindResizeListener();
    }
}

@NgModule({
    imports: [StyleClass],
    exports: [StyleClass]
})
export class StyleClassModule {}
