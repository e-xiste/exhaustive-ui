import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    HostListener,
    inject,
    input,
    NgModule,
    NgZone,
    numberAttribute,
    signal,
    TemplateRef,
    ViewEncapsulation,
    ViewRef,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { MotionEvent, MotionOptions } from '@exhaustive-ui/motion';
import { $dt } from '@exhaustive-ui/styled';
import { absolutePosition, addClass, appendChild, findSingle, getOffset, isIOS, isTouchDevice } from '@exhaustive-ui/utils';
import { OverlayService, PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { ConnectedOverlayScrollHandler } from '@exhaustive-ui/core/dom';
import { MotionModule } from '@exhaustive-ui/core/motion';
import { Nullable, VoidListener } from '@exhaustive-ui/core/ts-helpers';
import { PopoverContentTemplateContext, PopoverPassThrough } from '@exhaustive-ui/core/types/popover';
import { ZIndexUtils } from '@exhaustive-ui/core/utils';
import { Subscription } from 'rxjs';
import { PopoverStyle } from './style/popoverstyle';

/**
 * Popover is a container component that can overlay other components on page.
 * @group Components
 */
@Component({
    selector: 'p-popover',
    imports: [CommonModule, SharedModule, Bind, MotionModule],
    providers: [PopoverStyle, { provide: PARENT_INSTANCE, useExisting: Popover }],
    hostDirectives: [Bind],
    template: `
        @if (render()) {
            <div
                [pBind]="ptm('root')"
                [class]="cn(cx('root'), styleClass())"
                [style]="sx('root')"
                [ngStyle]="style()"
                (click)="onOverlayClick($event)"
                role="dialog"
                [attr.aria-modal]="overlayVisible()"
                [attr.aria-label]="ariaLabel()"
                [attr.aria-labelledBy]="ariaLabelledBy()"
                [pMotion]="overlayVisible()"
                pMotionName="p-anchored-overlay"
                [pMotionAppear]="true"
                (pMotionOnEnter)="onAnimationStart($event)"
                (pMotionOnAfterLeave)="onAnimationEnd()"
                [pMotionOptions]="computedMotionOptions()"
            >
                <div [pBind]="ptm('content')" [class]="cx('content')" (click)="onContentClick($event)" (mousedown)="onContentClick($event)">
                    <ng-content></ng-content>
                    <ng-template *ngTemplateOutlet="contentTemplate() || _contentTemplate(); context: { closeCallback: onCloseClick.bind(this) }"></ng-template>
                </div>
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class Popover extends BaseComponent<PopoverPassThrough> {
    componentName = 'Popover';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptm('host')));
    }

    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    ariaLabel = input<string | undefined>(undefined);
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>(undefined);
    /**
     * Enables to hide the overlay when outside is clicked.
     * @group Props
     */
    dismissable = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Inline style of the component.
     * @group Props
     */
    style = input<{ [klass: string]: any } | null | undefined>(undefined);
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass = input<string | undefined>(undefined);
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>('body');
    /**
     * Whether to automatically manage layering.
     * @group Props
     */
    autoZIndex = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    baseZIndex = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * When enabled, first button receives focus on show.
     * @group Props
     */
    focusOnShow = input<boolean, unknown>(true, { transform: booleanAttribute });
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
     * Callback to invoke when an overlay becomes visible.
     * @group Emits
     */
    readonly onShow = output<any>();
    /**
     * Callback to invoke when an overlay gets hidden.
     * @group Emits
     */
    readonly onHide = output<any>();

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    container = signal<Nullable<HTMLDivElement>>(undefined);

    overlayVisible = signal<boolean>(false);

    render = signal<boolean>(false);

    selfClick = signal<boolean>(false);

    documentClickListener = signal<VoidListener>(undefined);

    target = signal<any>(undefined);

    scrollHandler = signal<Nullable<ConnectedOverlayScrollHandler>>(undefined);

    documentResizeListener = signal<VoidListener>(undefined);

    /**
     * Custom content template.
     * @param {PopoverContentTemplateContext} context - content context.
     * @see {@link PopoverContentTemplateContext}
     * @group Templates
     */
    readonly contentTemplate = contentChild<Nullable<TemplateRef<PopoverContentTemplateContext>>>('content', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    readonly _contentTemplate = computed<TemplateRef<PopoverContentTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'content')
                .at(-1)?.template
    );

    destroyCallback = signal<Nullable<Function>>(undefined);

    overlayEventListener = signal<Nullable<(event?: any) => void>>(undefined);

    overlaySubscription = signal<Subscription | undefined>(undefined);

    _componentStyle = inject(PopoverStyle);

    zone = inject(NgZone);

    overlayService = inject(OverlayService);

    bindDocumentClickListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentClickListener()) {
                let documentEvent = isIOS() ? 'touchstart' : 'click';
                const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : this.document;

                this.documentClickListener.set(
                    this.renderer.listen(documentTarget, documentEvent, (event) => {
                        if (!this.dismissable()) {
                            return;
                        }

                        const target = this.target();
                        if (!this.container()?.contains(event.target) && target !== event.target && !target.contains(event.target) && !this.selfClick()) {
                            this.hide();
                        }

                        this.selfClick.set(false);
                    })
                );
            }
        }
    }

    unbindDocumentClickListener() {
        const documentClickListener = this.documentClickListener();
        if (documentClickListener) {
            documentClickListener();
            this.documentClickListener.set(null);
            this.selfClick.set(false);
        }
    }

    /**
     * Toggles the visibility of the panel.
     * @param {Event} event - Browser event
     * @param {Target} target - Target element.
     * @group Method
     */
    toggle(event: any, target?: any) {
        if (this.overlayVisible()) {
            if (this.hasTargetChanged(event, target)) {
                this.destroyCallback.set(() => {
                    this.show(null, target || event.currentTarget || event.target);
                });
            }

            this.hide();
        } else {
            this.show(event, target);
        }
    }
    /**
     * Displays the panel.
     * @param {Event} event - Browser event
     * @param {Target} target - Target element.
     * @group Method
     */
    show(event: any, target?: any) {
        target && event && event.stopPropagation();

        // Clear container if it exists from previous show
        if (this.container() && !this.overlayVisible()) {
            this.container.set(null);
        }

        this.target.set(target || event.currentTarget || event.target);
        this.overlayVisible.set(true);
        this.render.set(true);
    }

    onOverlayClick(event: MouseEvent) {
        this.overlayService.add({
            originalEvent: event,
            target: this.el.nativeElement
        });

        this.selfClick.set(true);
    }

    onContentClick(event: MouseEvent) {
        const targetElement = event.target as HTMLElement;
        this.selfClick.set(event.offsetX < targetElement.clientWidth && event.offsetY < targetElement.clientHeight);
    }

    hasTargetChanged(event: any, target: any) {
        return this.target() != null && this.target() !== (target || event.currentTarget || event.target);
    }

    appendOverlay() {
        if (this.$appendTo() && this.$appendTo() !== 'self') {
            if (this.$appendTo() === 'body') {
                appendChild(this.document.body, this.container()!);
            } else {
                appendChild(this.$appendTo(), this.container()!);
            }
        }
    }

    restoreAppend() {
        const container = this.container();
        if (container && this.$appendTo() && this.$appendTo() !== 'self') {
            appendChild(this.el.nativeElement, container);
        }
    }

    setZIndex() {
        if (this.autoZIndex()) {
            ZIndexUtils.set('overlay', this.container(), this.baseZIndex() + this.config.zIndex.overlay);
        }
    }

    align() {
        const container = this.container();
        const target = this.target();
        if (target && container) {
            absolutePosition(container, target, false);

            const containerOffset = <any>getOffset(container);
            const targetOffset = <any>getOffset(target);
            const borderRadius = this.document.defaultView?.getComputedStyle(container).getPropertyValue('border-radius');
            let arrowLeft = 0;

            if (containerOffset.left < targetOffset.left) {
                arrowLeft = targetOffset.left - containerOffset.left - parseFloat(borderRadius!) * 2;
            }
            container.style.setProperty($dt('popover.arrow.left').name, `${arrowLeft}px`);

            if (containerOffset.top < targetOffset.top) {
                container.setAttribute('data-p-popover-flipped', 'true');
                !this.$unstyled() && addClass(container, 'p-popover-flipped');
            }
        }
    }

    onAnimationStart(event: MotionEvent) {
        const container = event.element as HTMLDivElement;
        this.container.set(container);
        container?.setAttribute(this.$attrSelector, '');
        this.appendOverlay();
        this.align();
        this.setZIndex();
        this.bindDocumentClickListener();
        this.bindDocumentResizeListener();
        this.bindScrollListener();

        if (this.focusOnShow()) {
            this.focus();
        }

        this.overlayEventListener.set((e) => {
            const container = this.container();
            if (container && container.contains(e.target)) {
                this.selfClick.set(true);
            }
        });

        this.overlaySubscription.set(this.overlayService.clickObservable.subscribe(this.overlayEventListener()!));
        this.onShow.emit(null);
    }

    onAnimationEnd() {
        if (!this.overlayVisible()) {
            const destroyCallback = this.destroyCallback();
            if (destroyCallback) {
                destroyCallback();
                this.destroyCallback.set(null);
            }

            const overlaySubscription = this.overlaySubscription();
            if (overlaySubscription) {
                overlaySubscription.unsubscribe();
            }

            if (this.autoZIndex()) {
                ZIndexUtils.clear(this.container());
            }

            this.onContainerDestroy();
            this.onHide.emit({});
            this.render.set(false);
            this.container.set(null);
        }
    }

    focus() {
        let focusable = <any>findSingle(this.container()!, '[autofocus]');
        if (focusable) {
            this.zone.runOutsideAngular(() => {
                setTimeout(() => focusable.focus(), 5);
            });
        }
    }
    /**
     * Hides the panel.
     * @group Method
     */
    hide() {
        this.overlayVisible.set(false);
    }

    onCloseClick(event: MouseEvent) {
        this.hide();
        event.preventDefault();
    }

    @HostListener('document:keydown.escape', ['$event'])
    onEscapeKeydown(_event: KeyboardEvent) {
        this.hide();
    }

    onWindowResize() {
        if (this.overlayVisible() && !isTouchDevice()) {
            this.hide();
        }
    }

    bindDocumentResizeListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentResizeListener()) {
                const window = this.document.defaultView as Window;
                this.documentResizeListener.set(this.renderer.listen(window, 'resize', this.onWindowResize.bind(this)));
            }
        }
    }

    unbindDocumentResizeListener() {
        const documentResizeListener = this.documentResizeListener();
        if (documentResizeListener) {
            documentResizeListener();
            this.documentResizeListener.set(null);
        }
    }

    bindScrollListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.scrollHandler()) {
                this.scrollHandler.set(
                    new ConnectedOverlayScrollHandler(this.target(), () => {
                        if (this.overlayVisible()) {
                            this.hide();
                        }
                    })
                );
            }

            this.scrollHandler()!.bindScrollListener();
        }
    }

    unbindScrollListener() {
        const scrollHandler = this.scrollHandler();
        if (scrollHandler) {
            scrollHandler.unbindScrollListener();
        }
    }

    onContainerDestroy() {
        if (!(this.cd as ViewRef).destroyed) {
            this.target.set(null);
        }

        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
    }

    onDestroy() {
        const scrollHandler = this.scrollHandler();
        if (scrollHandler) {
            scrollHandler.destroy();
            this.scrollHandler.set(null);
        }

        if (this.container() && this.autoZIndex()) {
            ZIndexUtils.clear(this.container());
        }

        if (!(this.cd as ViewRef).destroyed) {
            this.target.set(null);
        }

        this.destroyCallback.set(null);
        if (this.container()) {
            this.restoreAppend();
            this.onContainerDestroy();
        }

        const overlaySubscription = this.overlaySubscription();
        if (overlaySubscription) {
            overlaySubscription.unsubscribe();
        }
    }
}

@NgModule({
    imports: [Popover, SharedModule],
    exports: [Popover, SharedModule]
})
export class PopoverModule {}
