import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    InjectionToken,
    input,
    linkedSignal,
    model,
    NgModule,
    NgZone,
    numberAttribute,
    signal,
    TemplateRef,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { MotionEvent, MotionOptions } from '@exhaustive-ui/motion';
import { addStyle, appendChild, getOuterHeight, getOuterWidth, getViewport, removeClass, setAttribute, uuid } from '@exhaustive-ui/utils';
import { OverlayService, PrimeTemplate, SharedModule, TranslationKeys } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { Button, ButtonProps } from '@exhaustive-ui/core/button';
import { blockBodyScroll, DomHandler, unblockBodyScroll } from '@exhaustive-ui/core/dom';
import { FocusTrap } from '@exhaustive-ui/core/focustrap';
import { TimesIcon, WindowMaximizeIcon, WindowMinimizeIcon } from '@exhaustive-ui/core/icons';
import { MotionModule } from '@exhaustive-ui/core/motion';
import { Nullable, VoidListener } from '@exhaustive-ui/core/ts-helpers';
import { DialogPassThrough } from '@exhaustive-ui/core/types/dialog';
import { ZIndexUtils } from '@exhaustive-ui/core/utils';
import { DialogStyle } from './style/dialogstyle';

const DIALOG_INSTANCE = new InjectionToken<Dialog>('DIALOG_INSTANCE');

/**
 * Dialog is a container to display content in an overlay window.
 * @group Components
 */
@Component({
    selector: 'p-dialog',
    imports: [CommonModule, Button, FocusTrap, TimesIcon, WindowMaximizeIcon, WindowMinimizeIcon, SharedModule, Bind, MotionModule],
    template: `
        @if (renderMask()) {
            <div
                [class]="cn(cx('mask'), maskStyleClass())"
                [style]="sx('mask')"
                [ngStyle]="maskStyle()"
                [pBind]="ptm('mask')"
                [pMotion]="maskVisible()"
                [pMotionAppear]="true"
                [pMotionEnterActiveClass]="modal() ? 'p-overlay-mask-enter-active' : ''"
                [pMotionLeaveActiveClass]="modal() ? 'p-overlay-mask-leave-active' : ''"
                [pMotionOptions]="computedMaskMotionOptions()"
                (pMotionOnAfterLeave)="onMaskAfterLeave()"
                [attr.data-p-scrollblocker-active]="modal() || blockScroll()"
                [attr.data-p]="dataP()"
            >
                @if (renderDialog()) {
                    <div
                        #container
                        [class]="cn(cx('root'), styleClass())"
                        [style]="sx('root')"
                        [ngStyle]="_style()"
                        [pBind]="ptm('root')"
                        pFocusTrap
                        [pFocusTrapDisabled]="focusTrap() === false"
                        [pMotion]="visible()"
                        [pMotionAppear]="true"
                        [pMotionName]="'p-dialog'"
                        [pMotionOptions]="computedMotionOptions()"
                        (pMotionOnBeforeEnter)="onBeforeEnter($event)"
                        (pMotionOnAfterEnter)="onAfterEnter($event)"
                        (pMotionOnBeforeLeave)="onBeforeLeave($event)"
                        (pMotionOnAfterLeave)="onAfterLeave($event)"
                        [attr.role]="role()"
                        [attr.aria-labelledby]="computedAriaLabelledBy()"
                        [attr.aria-modal]="true"
                        [attr.data-p]="dataP()"
                    >
                        @if (_headlessTemplate() || headlessTemplate() || headlessT()) {
                            <ng-container *ngTemplateOutlet="_headlessTemplate() || headlessTemplate() || headlessT()"></ng-container>
                        } @else {
                            @if (resizable()) {
                                <div [class]="cx('resizeHandle')" [pBind]="ptm('resizeHandle')" [style.z-index]="90" (mousedown)="initResize($event)"></div>
                            }
                            @if (showHeader()) {
                                <div #titlebar [class]="cx('header')" [pBind]="ptm('header')" (mousedown)="initDrag($event)">
                                    @if (!_headerTemplate() && !headerTemplate() && !headerT()) {
                                        <span [id]="headerId()" [class]="cx('title')" [pBind]="ptm('title')">{{ header() }}</span>
                                    }
                                    <ng-container *ngTemplateOutlet="_headerTemplate() || headerTemplate() || headerT(); context: { ariaLabelledBy: computedAriaLabelledBy() }"></ng-container>
                                    <div [class]="cx('headerActions')" [pBind]="ptm('headerActions')">
                                        @if (maximizable()) {
                                            <p-button
                                                [pt]="ptm('pcMaximizeButton')"
                                                [styleClass]="cx('pcMaximizeButton')"
                                                [ariaLabel]="maximized() ? minimizeLabel : maximizeLabel"
                                                (onClick)="maximize()"
                                                (keydown.enter)="maximize()"
                                                [tabindex]="maximizable() ? '0' : '-1'"
                                                [buttonProps]="maximizeButtonProps()"
                                                [unstyled]="unstyled()"
                                                [attr.data-pc-group-section]="'headericon'"
                                            >
                                                <ng-template #icon>
                                                    @if (maximizeIcon() && !_maximizeiconTemplate() && !_minimizeiconTemplate()) {
                                                        <span [ngClass]="maximized() ? minimizeIcon() : maximizeIcon()"></span>
                                                    }
                                                    @if (!maximizeIcon() && !maximizeButtonProps()?.icon) {
                                                        @if (!maximized() && !_maximizeiconTemplate() && !maximizeIconTemplate() && !maximizeIconT()) {
                                                            <svg data-p-icon="window-maximize" />
                                                        }
                                                        @if (maximized() && !_minimizeiconTemplate() && !minimizeIconTemplate() && !minimizeIconT()) {
                                                            <svg data-p-icon="window-minimize" />
                                                        }
                                                    }
                                                    @if (!maximized()) {
                                                        <ng-template *ngTemplateOutlet="_maximizeiconTemplate() || maximizeIconTemplate() || maximizeIconT()"></ng-template>
                                                    }
                                                    @if (maximized()) {
                                                        <ng-template *ngTemplateOutlet="_minimizeiconTemplate() || minimizeIconTemplate() || minimizeIconT()"></ng-template>
                                                    }
                                                </ng-template>
                                            </p-button>
                                        }
                                        @if (closable()) {
                                            <p-button
                                                [pt]="ptm('pcCloseButton')"
                                                [styleClass]="cx('pcCloseButton')"
                                                [ariaLabel]="closeAriaLabel() || closeButtonProps()?.ariaLabel || closeLabel"
                                                (onClick)="close($event)"
                                                (keydown.enter)="close($event)"
                                                [tabindex]="closeTabindex()"
                                                [buttonProps]="closeButtonProps()"
                                                [unstyled]="unstyled()"
                                                [attr.data-pc-group-section]="'headericon'"
                                            >
                                                <ng-template #icon>
                                                    @if (!_closeiconTemplate() && !closeIconTemplate() && !closeIconT() && !closeButtonProps()?.icon) {
                                                        @if (closeIcon()) {
                                                            <span [class]="closeIcon()"></span>
                                                        }
                                                        @if (!closeIcon()) {
                                                            <svg data-p-icon="times" />
                                                        }
                                                    }
                                                    @if (_closeiconTemplate() || closeIconTemplate() || closeIconT()) {
                                                        <span>
                                                            <ng-template *ngTemplateOutlet="_closeiconTemplate() || closeIconTemplate() || closeIconT()"></ng-template>
                                                        </span>
                                                    }
                                                </ng-template>
                                            </p-button>
                                        }
                                    </div>
                                </div>
                            }
                            <div #content [class]="cn(cx('content'), contentStyleClass())" [ngStyle]="contentStyle()" [pBind]="ptm('content')">
                                <ng-content></ng-content>
                                <ng-container *ngTemplateOutlet="_contentTemplate() || contentTemplate() || contentT()"></ng-container>
                            </div>
                            @if (_footerTemplate() || footerTemplate() || footerT()) {
                                <div #footer [class]="cx('footer')" [pBind]="ptm('footer')">
                                    <ng-content select="p-footer"></ng-content>
                                    <ng-container *ngTemplateOutlet="_footerTemplate() || footerTemplate() || footerT()"></ng-container>
                                </div>
                            }
                        }
                    </div>
                }
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [DialogStyle, { provide: DIALOG_INSTANCE, useExisting: Dialog }, { provide: PARENT_INSTANCE, useExisting: Dialog }],
    hostDirectives: [Bind]
})
export class Dialog extends BaseComponent<DialogPassThrough> {
    componentName = 'Dialog';

    hostName = input<string>('');

    $pcDialog: Dialog | undefined = inject(DIALOG_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptm('host'));
    }

    /**
     * Title text of the dialog.
     * @group Props
     */
    header = input<string | undefined>(undefined);
    /**
     * Enables dragging to change the position using header.
     * @group Props
     */
    draggable = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Enables resizing of the content.
     * @group Props
     */
    resizable = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Style of the content section.
     * @group Props
     */
    contentStyle = input<any>();
    /**
     * Style class of the content.
     * @group Props
     */
    contentStyleClass = input<string | undefined>(undefined);
    /**
     * Defines if background should be blocked when dialog is displayed.
     * @group Props
     */
    modal = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Specifies if pressing escape key should hide the dialog.
     * @group Props
     */
    closeOnEscape = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Specifies if clicking the modal background should hide the dialog.
     * @group Props
     */
    dismissableMask = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Adds a close icon to the header to hide the dialog.
     * @group Props
     */
    closable = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Object literal to define widths per screen size.
     * @group Props
     */
    breakpoints = input<any>();
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass = input<string | undefined>(undefined);
    /**
     * Style class of the mask.
     * @group Props
     */
    maskStyleClass = input<string | undefined>(undefined);
    /**
     * Style of the mask.
     * @group Props
     */
    maskStyle = input<{ [klass: string]: any } | null | undefined>(undefined);
    /**
     * Whether to show the header or not.
     * @group Props
     */
    showHeader = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether background scroll should be blocked when dialog is visible.
     * @group Props
     */
    blockScroll = input<boolean, unknown>(false, { transform: booleanAttribute });
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
     * Minimum value for the left coordinate of dialog in dragging.
     * @group Props
     */
    minX = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * Minimum value for the top coordinate of dialog in dragging.
     * @group Props
     */
    minY = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * When enabled, first focusable element receives focus on show.
     * @group Props
     */
    focusOnShow = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether the dialog can be displayed full screen.
     * @group Props
     */
    maximizable = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Keeps dialog in the viewport.
     * @group Props
     */
    keepInViewport = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * When enabled, can only focus on elements inside the dialog.
     * @group Props
     */
    focusTrap = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * The motion options for the mask.
     * @group Props
     */
    maskMotionOptions = input<MotionOptions | undefined>(undefined);

    computedMaskMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('maskMotion'),
            ...this.maskMotionOptions()
        };
    });
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
     * Name of the close icon.
     * @group Props
     */
    closeIcon = input<string | undefined>(undefined);
    /**
     * Defines a string that labels the close button for accessibility.
     * @group Props
     */
    closeAriaLabel = input<string | undefined>(undefined);
    /**
     * Index of the close button in tabbing order.
     * @group Props
     */
    closeTabindex = input<string>('0');
    /**
     * Name of the minimize icon.
     * @group Props
     */
    minimizeIcon = input<string | undefined>(undefined);
    /**
     * Name of the maximize icon.
     * @group Props
     */
    maximizeIcon = input<string | undefined>(undefined);
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    closeButtonProps = input<ButtonProps>({
        severity: 'secondary',
        variant: 'text',
        rounded: true
    });
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    maximizeButtonProps = input<ButtonProps>({
        severity: 'secondary',
        variant: 'text',
        rounded: true
    });
    /**
     * Specifies the visibility of the dialog.
     * Emits `visibleChange` with the new value to notify changes in the visibility state of the component.
     * @defaultValue false
     * @group Props
     */
    visible = model<boolean>(false);
    /**
     * Inline style of the component.
     * @group Props
     */
    style = input<any>();
    /**
     * Position of the dialog.
     * @group Props
     */
    position = input<'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright'>();
    /**
     * Role attribute of html element.
     * @group Emits
     */
    role = input<string>('dialog');
    /**
     * Identifier of the element that labels the dialog. Defaults to the id of the generated header title.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>(undefined);
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);
    /**
     * Callback to invoke when dialog is shown.
     * @group Emits
     */
    readonly onShow = output<any>();
    /**
     * Callback to invoke when dialog is hidden.
     * @group Emits
     */
    readonly onHide = output<any>();
    /**
     * Callback to invoke when dialog resizing is initiated.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onResizeInit = output<MouseEvent>();
    /**
     * Callback to invoke when dialog resizing is completed.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onResizeEnd = output<MouseEvent>();
    /**
     * Callback to invoke when dialog dragging is completed.
     * @param {DragEvent} event - Drag event.
     * @group Emits
     */
    readonly onDragEnd = output<DragEvent>();
    /**
     * Callback to invoke when dialog maximized or unmaximized.
     * @group Emits
     */
    readonly onMaximize = output<any>();

    readonly headerViewChild = viewChild<Nullable<ElementRef>>('titlebar');

    readonly contentViewChild = viewChild<Nullable<ElementRef>>('content');

    readonly footerViewChild = viewChild<Nullable<ElementRef>>('footer');
    /**
     * Header template.
     * @group Templates
     */
    headerTemplate = input<TemplateRef<void> | undefined>(undefined, { alias: 'content' });
    /**
     * Content template.
     * @group Templates
     */
    contentTemplate = input<TemplateRef<void> | undefined>(undefined);
    /**
     * Footer template.
     * @group Templates
     */
    footerTemplate = input<TemplateRef<void> | undefined>(undefined);
    /**
     * Close icon template.
     * @group Templates
     */
    closeIconTemplate = input<TemplateRef<void> | undefined>(undefined);
    /**
     * Maximize icon template.
     * @group Templates
     */
    maximizeIconTemplate = input<TemplateRef<void> | undefined>(undefined);
    /**
     * Minimize icon template.
     * @group Templates
     */
    minimizeIconTemplate = input<TemplateRef<void> | undefined>(undefined);
    /**
     * Headless template.
     * @group Templates
     */
    headlessTemplate = input<TemplateRef<void> | undefined>(undefined);

    /**
     * Custom header template.
     * @group Templates
     */
    readonly _headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Custom content template.
     * @group Templates
     */
    readonly _contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    readonly _footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });

    /**
     * Custom close icon template.
     * @group Templates
     */
    readonly _closeiconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });

    /**
     * Custom maximize icon template.
     * @group Templates
     */
    readonly _maximizeiconTemplate = contentChild<TemplateRef<void>>('maximizeicon', { descendants: false });

    /**
     * Custom minimize icon template.
     * @group Templates
     */
    readonly _minimizeiconTemplate = contentChild<TemplateRef<void>>('minimizeicon', { descendants: false });

    /**
     * Custom headless template.
     * @group Templates
     */
    readonly _headlessTemplate = contentChild<TemplateRef<void>>('headless', { descendants: false });

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    renderMask = linkedSignal<boolean, boolean>({
        source: this.visible,
        computation: (visible, previous) => visible || (previous?.value ?? false)
    });

    renderDialog = linkedSignal<boolean, boolean>({
        source: this.visible,
        computation: (visible, previous) => visible || (previous?.value ?? false)
    });

    maskVisible = linkedSignal<boolean, boolean | undefined>({
        source: this.visible,
        computation: (visible, previous) => visible || previous?.value
    });

    container = signal<Nullable<HTMLElement>>(null);

    wrapper = signal<Nullable<HTMLElement>>(undefined);

    dragging = signal<boolean | undefined>(undefined);

    // the title span carrying this id is not rendered without a header or with a headless template
    headerId = computed<string | null>(() => (this.header() !== null && this.showHeader() && !this._headlessTemplate() && !this.headlessTemplate() && !this.headlessT() ? this.id + '_header' : null));

    computedAriaLabelledBy = computed<string | null>(() => this.ariaLabelledBy() ?? this.headerId());

    documentDragListener = signal<VoidListener>(undefined);

    documentDragEndListener = signal<VoidListener>(undefined);

    resizing = signal<boolean | undefined>(undefined);

    documentResizeListener = signal<VoidListener>(undefined);

    documentResizeEndListener = signal<VoidListener>(undefined);

    documentEscapeListener = signal<VoidListener>(undefined);

    maskClickListener = signal<VoidListener>(undefined);

    lastPageX = signal<number | undefined>(undefined);

    lastPageY = signal<number | undefined>(undefined);

    maximized = signal<boolean | undefined>(undefined);

    id: string = uuid('pn_id_');

    _style = linkedSignal<any, any>({
        source: this.style,
        computation: (style, previous) => (style ? { ...style } : (previous?.value ?? {}))
    });

    originalStyle = linkedSignal<any, any>({
        source: this.style,
        computation: (style, previous) => (style ? style : previous?.value)
    });

    styleElement = signal<any>(undefined);

    _componentStyle = inject(DialogStyle);

    headerT = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    contentT = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => !['header', 'footer', 'closeicon', 'maximizeicon', 'minimizeicon', 'headless'].includes(item.getType()))
                .at(-1)?.template
    );

    footerT = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    closeIconT = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'closeicon')
                .at(-1)?.template
    );

    maximizeIconT = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'maximizeicon')
                .at(-1)?.template
    );

    minimizeIconT = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'minimizeicon')
                .at(-1)?.template
    );

    headlessT = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'headless')
                .at(-1)?.template
    );

    private zIndexForLayering = signal<number | undefined>(undefined);

    private previouslyFocusedElement: HTMLElement | null = null;

    get maximizeLabel(): string {
        return this.config.getTranslation(TranslationKeys.ARIA)['maximizeLabel'];
    }

    get minimizeLabel(): string {
        return this.config.getTranslation(TranslationKeys.ARIA)['minimizeLabel'];
    }

    get closeLabel(): string {
        return this.config.getTranslation(TranslationKeys.ARIA)['close'];
    }
    zone: NgZone = inject(NgZone);

    private overlayService: OverlayService = inject(OverlayService);

    onInit() {
        if (this.breakpoints()) {
            this.createStyle();
        }
    }

    readonly templates = contentChildren(PrimeTemplate);

    _focus(focusParentElement?: HTMLElement): boolean {
        if (focusParentElement) {
            let _focusableElements = DomHandler.getFocusableElements(focusParentElement);
            if (_focusableElements && _focusableElements.length > 0) {
                this.zone.runOutsideAngular(() => {
                    setTimeout(() => _focusableElements[0].focus(), 5);
                });
                return true;
            }
        }

        return false;
    }

    focus(focusParentElement: HTMLElement = this.contentViewChild()?.nativeElement) {
        let focused = this._focus(focusParentElement);

        if (!focused) {
            focused = this._focus(this.footerViewChild()?.nativeElement);
            if (!focused) {
                focused = this._focus(this.headerViewChild()?.nativeElement);
                if (!focused) {
                    // nothing focusable inside: focus the dialog itself so focus does not stay behind the mask
                    const container = this.container();
                    if (container) {
                        container.setAttribute('tabindex', '-1');
                        this.zone.runOutsideAngular(() => {
                            setTimeout(() => container.focus(), 5);
                        });
                    }
                }
            }
        }
    }

    close(event: Event) {
        this.visible.set(false);
        event.preventDefault();
    }

    enableModality() {
        if (this.closable() && this.dismissableMask()) {
            this.maskClickListener.set(
                this.renderer.listen(this.wrapper(), 'mousedown', (event: any) => {
                    const wrapper = this.wrapper();
                    if (wrapper && wrapper.isSameNode(event.target)) {
                        this.close(event);
                    }
                })
            );
        }

        if (this.modal()) {
            blockBodyScroll();
        }
    }

    disableModality() {
        if (this.wrapper()) {
            if (this.dismissableMask()) {
                this.unbindMaskClickListener();
            }

            // for nested dialogs w/modal
            const scrollBlockers = document.querySelectorAll('[data-p-scrollblocker-active="true"]');

            if (this.modal() && scrollBlockers && scrollBlockers.length == 1) {
                unblockBodyScroll();
            }
        }
    }

    maximize() {
        this.maximized.update((maximized) => !maximized);

        if (!this.modal() && !this.blockScroll()) {
            if (this.maximized()) {
                blockBodyScroll();
            } else {
                unblockBodyScroll();
            }
        }

        this.onMaximize.emit({ maximized: this.maximized() });
    }

    unbindMaskClickListener() {
        const maskClickListener = this.maskClickListener();
        if (maskClickListener) {
            maskClickListener();
            this.maskClickListener.set(null);
        }
    }

    moveOnTop() {
        if (this.autoZIndex()) {
            ZIndexUtils.set('modal', this.container(), this.baseZIndex() + this.config.zIndex.modal);
            (this.wrapper() as HTMLElement).style.zIndex = String(parseInt((this.container() as HTMLDivElement).style.zIndex, 10) - 1);
        } else {
            this.zIndexForLayering.set(ZIndexUtils.generateZIndex('modal', (this.baseZIndex() ?? 0) + this.config.zIndex.modal));
        }
    }

    createStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.styleElement() && !this.$unstyled()) {
                const styleElement = this.renderer.createElement('style');
                this.styleElement.set(styleElement);
                styleElement.type = 'text/css';
                setAttribute(styleElement, 'nonce', this.config?.csp()?.nonce);
                this.renderer.appendChild(this.document.head, styleElement);
                const breakpoints = this.breakpoints();
                let innerHTML = '';
                for (let breakpoint in breakpoints) {
                    innerHTML += `
                        @media screen and (max-width: ${breakpoint}) {
                            .p-dialog[${this.id}]:not(.p-dialog-maximized) {
                                width: ${breakpoints[breakpoint]} !important;
                            }
                        }
                    `;
                }

                this.renderer.setProperty(styleElement, 'innerHTML', innerHTML);
                setAttribute(styleElement, 'nonce', this.config?.csp()?.nonce);
            }
        }
    }

    initDrag(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const closestDiv = target.closest('div');

        if (closestDiv?.getAttribute('data-pc-section') === 'headeractions') {
            return;
        }

        if (this.draggable()) {
            this.dragging.set(true);
            this.lastPageX.set(event.pageX);
            this.lastPageY.set(event.pageY);

            this.document.body.setAttribute('data-p-unselectable-text', 'true');
            !this.$unstyled() && addStyle(this.document.body, { 'user-select': 'none' });
        }
    }

    onDrag(event: MouseEvent) {
        if (this.dragging() && this.container()) {
            const containerWidth = getOuterWidth(this.container() as HTMLDivElement);
            const containerHeight = getOuterHeight(this.container() as HTMLDivElement);
            const deltaX = event.pageX - (this.lastPageX() as number);
            const deltaY = event.pageY - (this.lastPageY() as number);
            const offset = this.container()!.getBoundingClientRect();
            // Drop the position margin only once the dialog really moves, so a plain header click does not shift it
            this.container()!.style.margin = '0';

            const containerComputedStyle = getComputedStyle(this.container() as HTMLDivElement);

            const leftMargin = parseFloat(containerComputedStyle.marginLeft);
            const topMargin = parseFloat(containerComputedStyle.marginTop);

            const leftPos = offset.left + deltaX - leftMargin;
            const topPos = offset.top + deltaY - topMargin;
            const viewport = getViewport();

            this.container()!.style.position = 'fixed';

            if (this.keepInViewport()) {
                if (leftPos >= this.minX() && leftPos + containerWidth < viewport.width) {
                    this._style().left = `${leftPos}px`;
                    this.lastPageX.set(event.pageX);
                    this.container()!.style.left = `${leftPos}px`;
                }

                if (topPos >= this.minY() && topPos + containerHeight < viewport.height) {
                    this._style().top = `${topPos}px`;
                    this.lastPageY.set(event.pageY);
                    this.container()!.style.top = `${topPos}px`;
                }
            } else {
                this.lastPageX.set(event.pageX);
                this.container()!.style.left = `${leftPos}px`;
                this.lastPageY.set(event.pageY);
                this.container()!.style.top = `${topPos}px`;
            }

            this.overlayService.emitParentDrag(this.container()!);
        }
    }

    endDrag(event: DragEvent) {
        if (this.dragging()) {
            this.dragging.set(false);
            this.document.body.removeAttribute('data-p-unselectable-text');
            !this.$unstyled() && (this.document.body.style['user-select'] = '');
            this.onDragEnd.emit(event);
        }
    }

    resetPosition() {
        (this.container() as HTMLDivElement).style.position = '';
        (this.container() as HTMLDivElement).style.left = '';
        (this.container() as HTMLDivElement).style.top = '';
        (this.container() as HTMLDivElement).style.margin = '';
    }

    //backward compatibility
    center() {
        this.resetPosition();
    }

    initResize(event: MouseEvent) {
        if (this.resizable()) {
            this.resizing.set(true);
            this.lastPageX.set(event.pageX);
            this.lastPageY.set(event.pageY);

            this.document.body.setAttribute('data-p-unselectable-text', 'true');
            !this.$unstyled() && addStyle(this.document.body, { 'user-select': 'none' });
            this.onResizeInit.emit(event);
        }
    }

    onResize(event: MouseEvent) {
        if (this.resizing()) {
            let deltaX = event.pageX - (this.lastPageX() as number);
            let deltaY = event.pageY - (this.lastPageY() as number);
            let containerWidth = getOuterWidth(this.container() as HTMLDivElement);
            let containerHeight = getOuterHeight(this.container() as HTMLDivElement);
            const contentViewChild = this.contentViewChild();
            let contentHeight = getOuterHeight(contentViewChild?.nativeElement);
            let newWidth = containerWidth + deltaX;
            let newHeight = containerHeight + deltaY;
            let minWidth = (this.container() as HTMLDivElement).style.minWidth;
            let minHeight = (this.container() as HTMLDivElement).style.minHeight;
            let offset = (this.container() as HTMLDivElement).getBoundingClientRect();
            let viewport = getViewport();
            let hasBeenDragged = !parseInt((this.container() as HTMLDivElement).style.top) || !parseInt((this.container() as HTMLDivElement).style.left);
            const style = this._style();

            if (hasBeenDragged) {
                newWidth += deltaX;
                newHeight += deltaY;
            }

            if ((!minWidth || newWidth > parseInt(minWidth)) && offset.left + newWidth < viewport.width) {
                style.width = newWidth + 'px';
                (this.container() as HTMLDivElement).style.width = style.width;
            }

            if ((!minHeight || newHeight > parseInt(minHeight)) && offset.top + newHeight < viewport.height) {
                (<ElementRef>contentViewChild).nativeElement.style.height = contentHeight + newHeight - containerHeight + 'px';

                if (style.height) {
                    style.height = newHeight + 'px';
                    (this.container() as HTMLDivElement).style.height = style.height;
                }
            }

            this.lastPageX.set(event.pageX);
            this.lastPageY.set(event.pageY);
        }
    }

    resizeEnd(event: MouseEvent) {
        if (this.resizing()) {
            this.resizing.set(false);
            this.document.body.removeAttribute('data-p-unselectable-text');
            !this.$unstyled() && (this.document.body.style['user-select'] = '');
            this.onResizeEnd.emit(event);
        }
    }

    bindGlobalListeners() {
        if (this.draggable()) {
            this.bindDocumentDragListener();
            this.bindDocumentDragEndListener();
        }

        if (this.resizable()) {
            this.bindDocumentResizeListeners();
        }

        if (this.closeOnEscape() && this.closable()) {
            this.bindDocumentEscapeListener();
        }
    }

    unbindGlobalListeners() {
        this.unbindDocumentDragListener();
        this.unbindDocumentDragEndListener();
        this.unbindDocumentResizeListeners();
        this.unbindDocumentEscapeListener();
    }

    bindDocumentDragListener() {
        if (!this.documentDragListener()) {
            this.zone.runOutsideAngular(() => {
                this.documentDragListener.set(this.renderer.listen(this.document.defaultView, 'mousemove', this.onDrag.bind(this)));
            });
        }
    }

    unbindDocumentDragListener() {
        const documentDragListener = this.documentDragListener();
        if (documentDragListener) {
            documentDragListener();
            this.documentDragListener.set(null);
        }
    }

    bindDocumentDragEndListener() {
        if (!this.documentDragEndListener()) {
            this.zone.runOutsideAngular(() => {
                this.documentDragEndListener.set(this.renderer.listen(this.document.defaultView, 'mouseup', this.endDrag.bind(this)));
            });
        }
    }

    unbindDocumentDragEndListener() {
        const documentDragEndListener = this.documentDragEndListener();
        if (documentDragEndListener) {
            documentDragEndListener();
            this.documentDragEndListener.set(null);
        }
    }

    bindDocumentResizeListeners() {
        if (!this.documentResizeListener() && !this.documentResizeEndListener()) {
            this.zone.runOutsideAngular(() => {
                this.documentResizeListener.set(this.renderer.listen(this.document.defaultView, 'mousemove', this.onResize.bind(this)));
                this.documentResizeEndListener.set(this.renderer.listen(this.document.defaultView, 'mouseup', this.resizeEnd.bind(this)));
            });
        }
    }

    unbindDocumentResizeListeners() {
        const documentResizeListener = this.documentResizeListener();
        const documentResizeEndListener = this.documentResizeEndListener();
        if (documentResizeListener && documentResizeEndListener) {
            documentResizeListener();
            documentResizeEndListener();
            this.documentResizeListener.set(null);
            this.documentResizeEndListener.set(null);
        }
    }

    bindDocumentEscapeListener() {
        const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : 'document';

        this.documentEscapeListener.set(
            this.renderer.listen(documentTarget, 'keydown', (event) => {
                if (event.key == 'Escape') {
                    const container = this.container();
                    if (!container) {
                        return;
                    }
                    const currentZIndex = ZIndexUtils.getCurrent();
                    if (parseInt(container.style.zIndex) == currentZIndex || this.zIndexForLayering() == currentZIndex) {
                        this.close(event);
                    }
                }
            })
        );
    }

    unbindDocumentEscapeListener() {
        const documentEscapeListener = this.documentEscapeListener();
        if (documentEscapeListener) {
            documentEscapeListener();
            this.documentEscapeListener.set(null);
        }
    }

    appendContainer() {
        if (this.$appendTo() !== 'self') {
            appendChild(this.$appendTo() || this.document.body, this.wrapper() as HTMLElement);
        }
    }

    restoreAppend() {
        if (this.container() && this.$appendTo() !== 'self') {
            this.renderer.appendChild(this.el.nativeElement, this.wrapper());
        }
    }

    onBeforeEnter(event: MotionEvent) {
        this.previouslyFocusedElement = this.document.activeElement as HTMLElement | null;
        this.container.set(event.element as HTMLDivElement);
        this.wrapper.set(this.container()?.parentElement);
        this.$attrSelector && this.container()?.setAttribute(this.$attrSelector, '');
        this.appendContainer();
        this.moveOnTop();
        this.bindGlobalListeners();
        this.container()?.setAttribute(this.id, '');

        if (this.modal()) {
            this.enableModality();
        }
    }

    onAfterEnter() {
        if (this.focusOnShow()) {
            this.focus();
        }

        this.onShow.emit({});
    }

    onBeforeLeave() {
        if (this.modal()) {
            this.maskVisible.set(false);
        }
    }

    onAfterLeave() {
        const container = this.container();
        const previouslyFocusedElement = this.previouslyFocusedElement;
        this.previouslyFocusedElement = null;
        // return focus to the element that had it before the dialog opened, unless the app moved it elsewhere
        if (previouslyFocusedElement?.isConnected && (!this.document.activeElement || this.document.activeElement === this.document.body || container?.contains(this.document.activeElement))) {
            previouslyFocusedElement.focus();
        }

        this.onContainerDestroy();
        this.renderDialog.set(false);

        if (this.modal()) {
            this.renderMask.set(false);
        } else {
            this.maskVisible.set(false);
        }

        this.onHide.emit({});
    }

    onMaskAfterLeave() {
        if (!this.renderDialog()) {
            this.renderMask.set(false);
        }
    }

    onContainerDestroy() {
        this.unbindGlobalListeners();
        this.dragging.set(false);

        if (this.maximized()) {
            removeClass(this.document.body, 'p-overflow-hidden');
            this.document.body.style.removeProperty('--scrollbar-width');
            this.maximized.set(false);
        }

        if (this.modal()) {
            this.disableModality();
        }

        if (this.container() && this.autoZIndex()) {
            ZIndexUtils.clear(this.container());
        }
        const zIndexForLayering = this.zIndexForLayering();
        if (zIndexForLayering) {
            ZIndexUtils.revertZIndex(zIndexForLayering);
        }

        this.container.set(null);
        this.wrapper.set(null);

        const originalStyle = this.originalStyle();
        this._style.set(originalStyle ? { ...originalStyle } : {});
    }

    destroyStyle() {
        const styleElement = this.styleElement();
        if (styleElement) {
            this.renderer.removeChild(this.document.head, styleElement);
            this.styleElement.set(null);
        }
    }

    onDestroy() {
        if (this.container()) {
            this.restoreAppend();
            this.onContainerDestroy();
        }

        this.destroyStyle();
    }

    dataP = computed(() =>
        this.cn({
            maximized: this.maximized(),
            modal: this.modal()
        })
    );
}

@NgModule({
    imports: [Dialog, SharedModule],
    exports: [Dialog, SharedModule]
})
export class DialogModule {}
