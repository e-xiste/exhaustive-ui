import { CommonModule, DOCUMENT } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    HostListener,
    inject,
    InjectionToken,
    input,
    isSignal,
    NgModule,
    Renderer2,
    signal,
    TemplateRef,
    untracked,
    viewChild,
    ViewEncapsulation,
    contentChild,
    contentChildren
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MotionEvent, MotionOptions } from '@exhaustive-ui/motion';
import { absolutePosition, addClass, appendChild, findSingle, focus, getOffset, isIOS, isTouchDevice, removeClass } from '@exhaustive-ui/utils';
import { Confirmation, ConfirmationService, OverlayService, PrimeTemplate, SharedModule, TranslationKeys } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { blockBodyScroll, ConnectedOverlayScrollHandler, unblockBodyScroll } from '@exhaustive-ui/core/dom';
import { FocusTrap } from '@exhaustive-ui/core/focustrap';
import { MotionModule } from '@exhaustive-ui/core/motion';
import { Nullable, VoidListener } from '@exhaustive-ui/core/ts-helpers';
import { ConfirmPopupContentTemplateContext, ConfirmPopupHeadlessTemplateContext, ConfirmPopupPassThrough } from '@exhaustive-ui/core/types/confirmpopup';
import { ZIndexUtils } from '@exhaustive-ui/core/utils';
import { Subject } from 'rxjs';
import { ConfirmPopupStyle } from './style/confirmpopupstyle';

const CONFIRMPOPUP_INSTANCE = new InjectionToken<ConfirmPopup>('CONFIRMPOPUP_INSTANCE');

/**
 * ConfirmPopup displays a confirmation overlay displayed relatively to its target.
 * @group Components
 */
@Component({
    selector: 'p-confirm-popup, p-confirmpopup',
    imports: [CommonModule, SharedModule, ButtonModule, FocusTrap, Bind, MotionModule],
    providers: [ConfirmPopupStyle, { provide: CONFIRMPOPUP_INSTANCE, useExisting: ConfirmPopup }, { provide: PARENT_INSTANCE, useExisting: ConfirmPopup }],
    hostDirectives: [Bind],
    template: `
        @if (render()) {
            <div
                [pMotion]="computedVisible()"
                [pMotionAppear]="true"
                [pMotionName]="'p-anchored-overlay'"
                [pMotionOptions]="computedMotionOptions()"
                (pMotionOnBeforeEnter)="onBeforeEnter($event)"
                (pMotionOnAfterLeave)="onAfterLeave()"
                pFocusTrap
                [pBind]="ptm('root')"
                [class]="cn(cx('root'), styleClass())"
                [ngStyle]="style()"
                role="alertdialog"
                (click)="onOverlayClick($event)"
            >
                @if (headlessTemplate() || _headlessTemplate()) {
                    <ng-container *ngTemplateOutlet="headlessTemplate() || _headlessTemplate(); context: { $implicit: confirmation() }"></ng-container>
                } @else {
                    <div #content [pBind]="ptm('content')" [class]="cx('content')">
                        @if (contentTemplate() || _contentTemplate()) {
                            <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate(); context: { $implicit: confirmation() }"></ng-container>
                        } @else {
                            @if (confirmation()?.icon) {
                                <i [pBind]="ptm('icon')" [class]="cx('icon')"></i>
                            }
                            <span [pBind]="ptm('message')" [class]="cx('message')">{{ confirmation()?.message }}</span>
                        }
                    </div>
                    <div [pBind]="ptm('footer')" [class]="cx('footer')">
                        @if (confirmation()?.rejectVisible !== false) {
                            <p-button
                                type="button"
                                [label]="rejectButtonLabel()"
                                (onClick)="onReject()"
                                [pt]="ptm('pcRejectButton')"
                                [class]="cx('pcRejectButton')"
                                [styleClass]="confirmation()?.rejectButtonStyleClass"
                                [size]="confirmation()?.rejectButtonProps?.size || 'small'"
                                [text]="confirmation()?.rejectButtonProps?.text || false"
                                [attr.aria-label]="rejectButtonLabel()"
                                [buttonProps]="getRejectButtonProps()"
                                [autofocus]="autoFocusReject()"
                                [unstyled]="unstyled()"
                            >
                                <ng-template #icon>
                                    @if (confirmation()?.rejectIcon && !rejectIconTemplate() && !_rejectIconTemplate()) {
                                        <i [class]="confirmation()?.rejectIcon"></i>
                                    }
                                    <ng-template *ngTemplateOutlet="rejectIconTemplate() || _rejectIconTemplate()"></ng-template>
                                </ng-template>
                            </p-button>
                        }
                        @if (confirmation()?.acceptVisible !== false) {
                            <p-button
                                type="button"
                                [label]="acceptButtonLabel()"
                                (onClick)="onAccept()"
                                [pt]="ptm('pcAcceptButton')"
                                [class]="cx('pcAcceptButton')"
                                [styleClass]="confirmation()?.acceptButtonStyleClass"
                                [size]="confirmation()?.acceptButtonProps?.size || 'small'"
                                [attr.aria-label]="acceptButtonLabel()"
                                [buttonProps]="getAcceptButtonProps()"
                                [autofocus]="autoFocusAccept()"
                                [unstyled]="unstyled()"
                            >
                                <ng-template #icon>
                                    @if (confirmation()?.acceptIcon && !acceptIconTemplate() && !_acceptIconTemplate()) {
                                        <i [class]="confirmation()?.acceptIcon"></i>
                                    }
                                    <ng-template *ngTemplateOutlet="acceptIconTemplate() || _acceptIconTemplate()"></ng-template>
                                </ng-template>
                            </p-button>
                        }
                    </div>
                }
            </div>
        }
    `,

    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ConfirmPopup extends BaseComponent<ConfirmPopupPassThrough> {
    el = inject(ElementRef);
    private confirmationService = inject(ConfirmationService);
    renderer = inject(Renderer2);
    overlayService = inject(OverlayService);
    document = inject<Document>(DOCUMENT);

    componentName = 'ConfirmPopup';

    $pcConfirmPopup: ConfirmPopup | undefined = inject(CONFIRMPOPUP_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Optional key to match the key of confirm object, necessary to use when component tree has multiple confirm dialogs.
     * @group Props
     */
    key = input<string | undefined>();
    /**
     * Element to receive the focus when the popup gets visible, valid values are "accept", "reject", and "none".
     * @group Props
     */
    defaultFocus = input<string>('accept');
    /**
     * Whether to automatically manage layering.
     * @group Props
     */
    autoZIndex = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Inline style of the component.
     * @group Props
     */
    style = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass = input<string | undefined>();
    /**
     * Defines if the component is visible.
     * @group Props
     */
    visible = input<boolean>();

    private _visible = signal<boolean>(false);

    computedVisible = computed(() => this.visible() ?? this._visible());

    render = signal<boolean>(false);

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
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'body'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>('body');

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    container = signal<HTMLElement | null | undefined>(undefined);

    confirmation = signal<Nullable<Confirmation>>(undefined);

    autoFocusAccept = signal<boolean>(false);

    autoFocusReject = signal<boolean>(false);

    /**
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<Nullable<TemplateRef<ConfirmPopupContentTemplateContext>>>('content', { descendants: false });

    /**
     * Custom accept icon template.
     * @group Templates
     */
    readonly acceptIconTemplate = contentChild<Nullable<TemplateRef<void>>>('accepticon', { descendants: false });

    /**
     * Custom reject icon template.
     * @group Templates
     */
    readonly rejectIconTemplate = contentChild<Nullable<TemplateRef<void>>>('rejecticon', { descendants: false });

    /**
     * Custom headless template.
     * @group Templates
     */
    readonly headlessTemplate = contentChild<Nullable<TemplateRef<ConfirmPopupHeadlessTemplateContext>>>('headless', { descendants: false });

    acceptButtonViewChild = viewChild('acceptButton', { read: ElementRef });

    rejectButtonViewChild = viewChild('rejectButton', { read: ElementRef });

    _contentTemplate = computed<TemplateRef<ConfirmPopupContentTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'content')
                .at(-1)?.template
    );

    _acceptIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'accepticon')
                .at(-1)?.template
    );

    _rejectIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'rejecticon')
                .at(-1)?.template
    );

    _headlessTemplate = computed<TemplateRef<ConfirmPopupHeadlessTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'headless')
                .at(-1)?.template
    );

    documentClickListener = signal<VoidListener>(undefined);

    documentResizeListener = signal<VoidListener>(undefined);

    scrollHandler = signal<Nullable<ConnectedOverlayScrollHandler>>(undefined);

    private window: Window = this.document.defaultView as Window;

    _componentStyle = inject(ConfirmPopupStyle);

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptm('host'));
        this.confirmationService.requireConfirmation$.pipe(takeUntilDestroyed()).subscribe((confirmation) => {
            if (!confirmation) {
                this.hide();
                return;
            }

            if (this.computedVisible()) {
                requestAnimationFrame(() => {
                    this.alignOverlay();
                    this.alignArrow();
                });
            }

            if (confirmation.key === this.key()) {
                if (confirmation.accept) {
                    confirmation.acceptEvent = new Subject();
                    confirmation.acceptEvent.subscribe(confirmation.accept as () => void);
                }

                if (confirmation.reject) {
                    confirmation.rejectEvent = new Subject();
                    confirmation.rejectEvent.subscribe(confirmation.reject as () => void);
                }

                this.confirmation.set(confirmation);
                this._visible.set(true);
            }
        });

        effect(() => {
            if (this.computedVisible()) {
                untracked(() => {
                    if (!this.render()) {
                        this.render.set(true);
                    }
                });
            }
        });
    }

    readonly templates = contentChildren(PrimeTemplate);

    /**
     * Whether the body scroll is blocked by the blockScroll option of the shown confirmation.
     */
    private scrollBlocked = false;

    option(name: string, k?: string) {
        const confirmation: { [key: string]: any } = this.confirmation() ?? {};
        const source: { [key: string]: any } = Object.prototype.hasOwnProperty.call(confirmation, name) ? confirmation : this;

        if (Object.prototype.hasOwnProperty.call(source, name)) {
            const value: any = isSignal(source[name]) ? source[name]() : source[name];
            if (k) {
                return value?.[k];
            }
            return value;
        }

        return undefined;
    }

    @HostListener('document:keydown.Escape', ['$event'])
    onEscapeKeydown(event: KeyboardEvent) {
        const confirmation = this.confirmation();
        if (confirmation && confirmation.closeOnEscape !== false) {
            this.onReject();
        }
    }

    onBeforeEnter(event: MotionEvent) {
        if (this.confirmation()) {
            const focus = this.option('defaultFocus');
            this.autoFocusAccept.set(focus === 'accept');
            this.autoFocusReject.set(focus === 'reject');
        }

        if (this.confirmation()?.blockScroll && !this.scrollBlocked) {
            blockBodyScroll();
            this.scrollBlocked = true;
        }

        this.container.set(event.element as HTMLElement);
        this.appendOverlay();
        this.alignOverlay();
        this.alignArrow();
        this.setZIndex();
        this.handleFocus();
        this.bindListeners();
    }

    handleFocus() {
        const defaultFocus = this.option('defaultFocus');

        if (defaultFocus && (this.acceptButtonViewChild() || this.rejectButtonViewChild())) {
            const focusEl = <HTMLButtonElement>(defaultFocus === 'accept' ? findSingle(this.acceptButtonViewChild()?.nativeElement, '[data-pc-section="root"]') : findSingle(this.rejectButtonViewChild()?.nativeElement, '[data-pc-section="root"]'));
            focusEl.focus();
        }
    }

    onAfterLeave() {
        this.autoFocusAccept.set(false);
        this.autoFocusReject.set(false);
        this.restoreAppend();
        this.onContainerDestroy();
    }

    getAcceptButtonProps = computed(() => this.option('acceptButtonProps'));

    getRejectButtonProps = computed(() => this.option('rejectButtonProps'));

    alignOverlay() {
        const confirmation = this.confirmation();
        if (!confirmation || !confirmation.target) {
            return;
        }

        absolutePosition(this.container()!, confirmation.target as HTMLElement, false);
    }

    setZIndex() {
        if (this.autoZIndex()) {
            ZIndexUtils.set('overlay', this.container(), this.config.zIndex.overlay);
        }
    }

    alignArrow() {
        const container = this.container();
        const containerOffset = <any>getOffset(container);
        const targetOffset = <any>getOffset(this.confirmation()?.target as any);
        let arrowLeft = 0;

        if (containerOffset && targetOffset && containerOffset.left < targetOffset.left) {
            arrowLeft = targetOffset.left - containerOffset.left;
        }
        if (container) {
            (container as HTMLDivElement).style.setProperty('--p-confirmpopup-arrow-left', `${arrowLeft}px`);
        }

        if (containerOffset && targetOffset && containerOffset.top < targetOffset.top) {
            (container as HTMLElement).setAttribute('data-p-confirmpopup-flipped', 'true');
            !this.$unstyled() && addClass(container as HTMLDivElement, 'p-confirm-popup-flipped');
        } else if (container) {
            // realigned under a new target: drop the flip left by a previous one
            (container as HTMLElement).removeAttribute('data-p-confirmpopup-flipped');
            removeClass(container as HTMLDivElement, 'p-confirm-popup-flipped');
        }
    }

    appendOverlay() {
        if (this.$appendTo() && this.$appendTo() !== 'self') {
            // Keep the text direction set on p-confirmpopup (or an ancestor) once moved out of it
            const dir = (this.el.nativeElement as HTMLElement).closest('[dir]')?.getAttribute('dir');
            if (dir) {
                this.container()!.setAttribute('dir', dir);
            }

            if (this.$appendTo() === 'body') {
                appendChild(this.document.body, this.container()!);
            } else {
                appendChild(this.$appendTo(), this.container()!);
            }
        }
    }

    restoreAppend() {
        const container = this.container();
        if (container && this.$appendTo() !== 'self') {
            appendChild(this.el.nativeElement, container);
        }

        this.onContainerDestroy();
    }

    hide() {
        this._visible.set(false);
    }

    onAccept() {
        const confirmation = this.confirmation();
        if (confirmation?.acceptEvent) {
            confirmation.acceptEvent.next(undefined);
        }

        this.hide();
        focus(confirmation?.target as any);
    }

    onReject() {
        const confirmation = this.confirmation();
        if (confirmation?.rejectEvent) {
            confirmation.rejectEvent.next(undefined);
        }

        this.hide();
        focus(confirmation?.target as any);
    }

    onOverlayClick(event: MouseEvent) {
        this.overlayService.add({
            originalEvent: event,
            target: this.el.nativeElement
        });
    }

    bindListeners(): void {
        /*
         * Called inside `setTimeout` to avoid listening to the click event that appears when `confirm` is first called(bubbling).
         * Need wait when bubbling event up and hang the handler on the next tick.
         * This is the case when eventTarget and confirmation.target do not match when the `confirm` method is called.
         */
        setTimeout(() => {
            this.bindDocumentClickListener();
            this.bindDocumentResizeListener();
            this.bindScrollListener();
        });
    }

    unbindListeners() {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener()) {
            let documentEvent = isIOS() ? 'touchstart' : 'click';
            const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : this.document;

            this.documentClickListener.set(
                this.renderer.listen(documentTarget, documentEvent, (event) => {
                    const confirmation = this.confirmation();
                    if (confirmation && confirmation.dismissableMask !== false) {
                        const container = this.container();
                        let targetElement = <HTMLElement>confirmation.target;
                        if (container !== event.target && !container?.contains(event.target) && targetElement !== event.target && !targetElement.contains(event.target)) {
                            this.hide();
                        }
                    }
                })
            );
        }
    }

    unbindDocumentClickListener() {
        const documentClickListener = this.documentClickListener();
        if (documentClickListener) {
            documentClickListener();
            this.documentClickListener.set(null);
        }
    }

    onWindowResize() {
        if (this.computedVisible() && !isTouchDevice()) {
            this.hide();
        }
    }

    bindDocumentResizeListener() {
        if (!this.documentResizeListener()) {
            this.documentResizeListener.set(this.renderer.listen(this.window, 'resize', this.onWindowResize.bind(this)));
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
        let scrollHandler = this.scrollHandler();
        if (!scrollHandler) {
            scrollHandler = new ConnectedOverlayScrollHandler(this.confirmation()?.target, () => {
                if (this.computedVisible()) {
                    this.hide();
                }
            });
            this.scrollHandler.set(scrollHandler);
        }

        scrollHandler.bindScrollListener();
    }

    unbindScrollListener() {
        const scrollHandler = this.scrollHandler();
        if (scrollHandler) {
            scrollHandler.unbindScrollListener();
        }
    }

    unsubscribeConfirmationSubscriptions() {
        const confirmation = this.confirmation();
        if (confirmation) {
            if (confirmation.acceptEvent) {
                confirmation.acceptEvent.unsubscribe();
            }

            if (confirmation.rejectEvent) {
                confirmation.rejectEvent.unsubscribe();
            }
        }
    }

    onContainerDestroy() {
        if (this.scrollBlocked) {
            unblockBodyScroll();
            this.scrollBlocked = false;
        }

        this.unbindListeners();
        this.unsubscribeConfirmationSubscriptions();

        if (this.autoZIndex()) {
            ZIndexUtils.clear(this.container());
        }

        this.confirmation.set(null);
        this.render.set(false);
        this.container.set(null);
    }

    acceptButtonLabel = computed<string>(() => this.confirmation()?.acceptLabel || this.confirmation()?.acceptButtonProps?.label || this.config.getTranslation(TranslationKeys.ACCEPT));

    rejectButtonLabel = computed<string>(() => this.confirmation()?.rejectLabel || this.confirmation()?.rejectButtonProps?.label || this.config.getTranslation(TranslationKeys.REJECT));

    onDestroy() {
        this.restoreAppend();
    }
}

@NgModule({
    imports: [ConfirmPopup, SharedModule],
    exports: [ConfirmPopup, SharedModule]
})
export class ConfirmPopupModule {}
