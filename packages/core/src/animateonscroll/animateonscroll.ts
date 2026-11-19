import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, booleanAttribute, computed, Directive, input, NgModule, numberAttribute, signal } from '@angular/core';
import { addClass, removeClass } from '@exhaustive-ui/utils';
import { BaseComponent } from '@exhaustive-ui/core/basecomponent';

interface AnimateOnScrollOptions {
    root?: HTMLElement | null;
    rootMargin?: string;
    threshold?: number;
}

/**
 * AnimateOnScroll is used to apply animations to elements when entering or leaving the viewport during scrolling.
 * @group Components
 */
@Directive({
    selector: '[pAnimateOnScroll]',
    host: {
        '[class.p-animateonscroll]': 'true'
    }
})
export class AnimateOnScroll extends BaseComponent {
    /**
     * Selector to define the CSS class for enter animation.
     * @group Props
     */
    readonly enterClass = input<string | undefined>();
    /**
     * Selector to define the CSS class for leave animation.
     * @group Props
     */
    readonly leaveClass = input<string | undefined>();
    /**
     * Specifies the root option of the IntersectionObserver API.
     * @group Props
     */
    readonly root = input<HTMLElement | undefined | null>();
    /**
     * Specifies the rootMargin option of the IntersectionObserver API.
     * @group Props
     */
    readonly rootMargin = input<string | undefined>();
    /**
     * Specifies the threshold option of the IntersectionObserver API
     * @group Props
     */
    readonly threshold = input<number | undefined, unknown>(0.5, { transform: numberAttribute });
    /**
     * Whether the scroll event listener should be removed after initial run.
     * @group Props
     */
    readonly once = input<boolean, unknown>(false, { transform: booleanAttribute });

    observer = signal<IntersectionObserver | undefined>(undefined);

    resetObserver = signal<any>(undefined);

    isObserverActive = signal<boolean>(false);

    animationState = signal<any>(undefined);

    animationEndListener = signal<VoidFunction | null | undefined>(undefined);

    constructor() {
        super();
        afterNextRender(() => {
            this.bindIntersectionObserver();
        });
    }

    onInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.renderer.setStyle(this.el.nativeElement, 'opacity', this.enterClass() ? '0' : '');
        }
    }

    options = computed<AnimateOnScrollOptions>(() => {
        return {
            root: this.root(),
            rootMargin: this.rootMargin(),
            threshold: this.threshold() || 0.5
        };
    });

    bindIntersectionObserver() {
        this.observer.set(
            new IntersectionObserver(([entry]) => {
                if (this.isObserverActive()) {
                    if (entry.boundingClientRect.top > 0) {
                        entry.isIntersecting ? this.enter() : this.leave();
                    }
                } else if (entry.isIntersecting) {
                    this.enter();
                }

                this.isObserverActive.set(true);
            }, this.options())
        );

        setTimeout(() => this.observer()?.observe(this.el.nativeElement), 0);

        // Reset

        this.resetObserver.set(
            new IntersectionObserver(
                ([entry]) => {
                    if (entry.boundingClientRect.top > 0 && !entry.isIntersecting) {
                        this.el.nativeElement.style.opacity = this.enterClass() ? '0' : '';
                        removeClass(this.el.nativeElement, [this.enterClass(), this.leaveClass()]);

                        this.resetObserver().unobserve(this.el.nativeElement);
                    }

                    this.animationState.set(undefined);
                },
                { ...this.options(), threshold: 0 }
            )
        );
    }

    enter() {
        const enterClass = this.enterClass();

        if (this.animationState() !== 'enter' && enterClass) {
            this.el.nativeElement.style.opacity = '';
            removeClass(this.el.nativeElement, this.leaveClass());
            addClass(this.el.nativeElement, enterClass);

            this.once() && this.unbindIntersectionObserver();

            this.bindAnimationEvents();
            this.animationState.set('enter');
        }
    }

    leave() {
        const leaveClass = this.leaveClass();

        if (this.animationState() !== 'leave' && leaveClass) {
            this.el.nativeElement.style.opacity = this.enterClass() ? '0' : '';
            removeClass(this.el.nativeElement, this.enterClass());
            addClass(this.el.nativeElement, leaveClass);

            this.bindAnimationEvents();
            this.animationState.set('leave');
        }
    }

    bindAnimationEvents() {
        if (!this.animationEndListener()) {
            this.animationEndListener.set(
                this.renderer.listen(this.el.nativeElement, 'animationend', () => {
                    removeClass(this.el.nativeElement, [this.enterClass(), this.leaveClass()]);
                    !this.once() && this.resetObserver().observe(this.el.nativeElement);
                    this.unbindAnimationEvents();
                })
            );
        }
    }

    unbindAnimationEvents() {
        const animationEndListener = this.animationEndListener();

        if (animationEndListener) {
            animationEndListener();
            this.animationEndListener.set(null);
        }
    }

    unbindIntersectionObserver() {
        this.observer()?.unobserve(this.el.nativeElement);
        this.resetObserver()?.unobserve(this.el.nativeElement);
        this.isObserverActive.set(false);
    }

    onDestroy() {
        this.unbindAnimationEvents();
        this.unbindIntersectionObserver();
    }
}

@NgModule({
    imports: [AnimateOnScroll],
    exports: [AnimateOnScroll]
})
export class AnimateOnScrollModule {}
