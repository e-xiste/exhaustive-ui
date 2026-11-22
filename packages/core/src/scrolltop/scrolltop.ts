import { CommonModule, isPlatformBrowser } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, input, NgModule, numberAttribute, signal, TemplateRef, ViewEncapsulation, contentChild, contentChildren } from '@angular/core';
import { MotionEvent, MotionOptions } from '@exhaustive-ui/motion';
import { getWindowScrollTop } from '@exhaustive-ui/utils';
import { PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { Button, ButtonProps } from '@exhaustive-ui/core/button';
import { ChevronUpIcon } from '@exhaustive-ui/core/icons';
import { MotionDirective } from '@exhaustive-ui/core/motion';
import { ScrollTopIconTemplateContext, ScrollTopPassThrough } from '@exhaustive-ui/core/types/scrolltop';
import { ZIndexUtils } from '@exhaustive-ui/core/utils';
import { ScrollTopStyle } from './style/scrolltopstyle';

/**
 * ScrollTop gets displayed after a certain scroll position and used to navigates to the top of the page quickly.
 * @group Components
 */
@Component({
    selector: 'p-scroll-top, p-scrollTop, p-scrolltop',
    imports: [CommonModule, ChevronUpIcon, Button, SharedModule, MotionDirective],
    template: `
        @if (render()) {
            <p-button
                [pMotion]="visible()"
                [pMotionAppear]="true"
                [pMotionName]="'p-scrolltop'"
                [pMotionOptions]="computedMotionOptions()"
                (pMotionOnBeforeEnter)="onBeforeEnter($event)"
                (pMotionOnBeforeLeave)="onBeforeLeave()"
                (pMotionOnAfterLeave)="onAfterLeave()"
                [ariaLabel]="buttonAriaLabel() || buttonProps()?.ariaLabel || scrollTopLabel()"
                (click)="onClick()"
                [pt]="ptm('pcButton')"
                [styleClass]="cn(cx('root'), styleClass())"
                [ngStyle]="style()"
                type="button"
                [buttonProps]="buttonProps()"
                [unstyled]="unstyled()"
            >
                <ng-template #icon>
                    @if (!iconTemplate() && !_iconTemplate()) {
                        @if (this.icon()) {
                            <span [class]="cn(cx('icon'), this.icon())"></span>
                        }
                        @if (!this.icon()) {
                            <svg data-p-icon="chevron-up" [class]="cx('icon')" />
                        }
                    } @else {
                        <ng-template *ngTemplateOutlet="iconTemplate() || _iconTemplate(); context: { styleClass: cx('icon') }"></ng-template>
                    }
                </ng-template>
            </p-button>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ScrollTopStyle, { provide: PARENT_INSTANCE, useExisting: ScrollTop }],
    hostDirectives: [Bind]
})
export class ScrollTop extends BaseComponent<ScrollTopPassThrough> {
    componentName = 'ScrollTop';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
    }

    /**
     * Class of the element.
     * @group Props
     */
    readonly styleClass = input<string | undefined>();
    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Target of the ScrollTop.
     * @group Props
     */
    readonly target = input<'window' | 'parent' | undefined>('window');
    /**
     * Defines the threshold value of the vertical scroll position of the target to toggle the visibility.
     * @group Props
     */
    readonly threshold = input<number, unknown>(400, { transform: numberAttribute });
    /**
     * Name of the icon or JSX.Element for icon.
     * @group Props
     */
    readonly icon = input<string | undefined>();
    /**
     * Defines the scrolling behavior, "smooth" adds an animation and "auto" scrolls with a jump.
     * @group Props
     */
    readonly behavior = input<'auto' | 'smooth' | undefined>('smooth');
    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });
    /**
     * Establishes a string value that labels the scroll-top button.
     * @group Props
     */
    readonly buttonAriaLabel = input<string | undefined>();

    /**
     * Fallback name of the icon-only button, from the aria.scrollTop locale key.
     */
    scrollTopLabel(): string | undefined {
        return this.config.translation.aria?.scrollTop;
    }
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly buttonProps = input<ButtonProps>({ rounded: true });
    /**
     * Custom icon template.
     * @param {ScrollTopIconTemplateContext} context - icon context.
     * @see {@link ScrollTopIconTemplateContext}
     * @group Templates
     */
    readonly iconTemplate = contentChild<TemplateRef<ScrollTopIconTemplateContext>>('icon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    readonly _iconTemplate = computed<TemplateRef<ScrollTopIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'icon')
                .at(-1)?.template
    );

    documentScrollListener = signal<VoidFunction | null | undefined>(undefined);

    parentScrollListener = signal<VoidFunction | null | undefined>(undefined);

    visible = signal<boolean>(false);

    render = signal<boolean>(false);

    overlay = signal<any>(undefined);

    _componentStyle = inject(ScrollTopStyle);

    onInit() {
        if (this.target() === 'window') this.bindDocumentScrollListener();
        else if (this.target() === 'parent') this.bindParentScrollListener();
    }

    onClick() {
        let scrollElement = this.target() === 'window' ? this.document.defaultView : this.el.nativeElement.parentElement;
        scrollElement.scroll({
            top: 0,
            behavior: this.behavior()
        });
    }

    onBeforeEnter(event: MotionEvent) {
        const overlay = event.element as HTMLElement;
        this.overlay.set(overlay);
        overlay.style.position = this.target() === 'parent' ? 'sticky' : 'fixed';
        ZIndexUtils.set('overlay', overlay, this.config.zIndex.overlay);
    }

    onBeforeLeave() {
        ZIndexUtils.clear(this.overlay());
        this.overlay.set(null);
    }

    onAfterLeave() {
        this.render.set(false);
    }

    checkVisibility(scrollY: number) {
        if (scrollY > this.threshold()) {
            this.visible.set(true);
            if (!this.render()) {
                this.render.set(true);
            }
        } else {
            this.visible.set(false);
        }
    }

    bindParentScrollListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.el.nativeElement.parentElement) {
                // Not attached yet, e.g. projected in an @if block of the parent component (ScrollPanel).
                afterNextRender(
                    () => {
                        if (this.el.nativeElement.parentElement && !this.parentScrollListener()) this.bindParentScrollListener();
                    },
                    { injector: this.injector }
                );
                return;
            }

            this.parentScrollListener.set(
                this.renderer.listen(this.el.nativeElement.parentElement, 'scroll', () => {
                    this.checkVisibility(this.el.nativeElement.parentElement.scrollTop);
                })
            );
        }
    }

    bindDocumentScrollListener() {
        if (isPlatformBrowser(this.platformId)) {
            this.documentScrollListener.set(
                this.renderer.listen(this.document.defaultView, 'scroll', () => {
                    this.checkVisibility(getWindowScrollTop());
                })
            );
        }
    }

    unbindParentScrollListener() {
        const parentScrollListener = this.parentScrollListener();
        if (parentScrollListener) {
            parentScrollListener();
            this.parentScrollListener.set(null);
        }
    }

    unbindDocumentScrollListener() {
        const documentScrollListener = this.documentScrollListener();
        if (documentScrollListener) {
            documentScrollListener();
            this.documentScrollListener.set(null);
        }
    }

    onDestroy() {
        if (this.target() === 'window') this.unbindDocumentScrollListener();
        else if (this.target() === 'parent') this.unbindParentScrollListener();

        if (this.overlay()) {
            ZIndexUtils.clear(this.overlay());
            this.overlay.set(null);
        }
    }
}

@NgModule({
    imports: [ScrollTop, SharedModule],
    exports: [ScrollTop, SharedModule]
})
export class ScrollTopModule {}
