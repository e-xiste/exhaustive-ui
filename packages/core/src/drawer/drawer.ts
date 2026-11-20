import { CommonModule } from '@angular/common';
import {
    afterEveryRender,
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
    numberAttribute,
    signal,
    TemplateRef,
    ViewEncapsulation,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { MotionEvent, MotionOptions } from '@exhaustive-ui/motion';
import { addClass, appendChild, removeClass, setAttribute } from '@exhaustive-ui/utils';
import { PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { Button, ButtonProps } from '@exhaustive-ui/core/button';
import { blockBodyScroll, unblockBodyScroll } from '@exhaustive-ui/core/dom';
import { FocusTrapModule } from '@exhaustive-ui/core/focustrap';
import { TimesIcon } from '@exhaustive-ui/core/icons';
import { MotionModule } from '@exhaustive-ui/core/motion';
import { Nullable, VoidListener } from '@exhaustive-ui/core/ts-helpers';
import { DrawerPassThrough } from '@exhaustive-ui/core/types/drawer';
import { ZIndexUtils } from '@exhaustive-ui/core/utils';
import { DrawerStyle } from './style/drawerstyle';

const DRAWER_INSTANCE = new InjectionToken<Drawer>('DRAWER_INSTANCE');

/**
 * Sidebar is a panel component displayed as an overlay at the edges of the screen.
 * @group Components
 */
@Component({
    selector: 'p-drawer',
    imports: [CommonModule, Button, TimesIcon, SharedModule, Bind, FocusTrapModule, MotionModule],
    providers: [DrawerStyle, { provide: DRAWER_INSTANCE, useExisting: Drawer }, { provide: PARENT_INSTANCE, useExisting: Drawer }],
    hostDirectives: [Bind],
    template: `
        @if (modalVisible()) {
            <div
                #container
                [pBind]="ptm('root')"
                [pMotion]="visible()"
                [pMotionAppear]="true"
                [pMotionEnterActiveClass]="$enterAnimation()"
                [pMotionLeaveActiveClass]="$leaveAnimation()"
                [pMotionOptions]="computedMotionOptions()"
                (pMotionOnBeforeEnter)="onBeforeEnter($event)"
                (pMotionOnBeforeLeave)="onBeforeLeave()"
                (pMotionOnAfterLeave)="onAfterLeave($event)"
                [class]="cn(cx('root'), styleClass())"
                [style]="style()"
                role="complementary"
                (keydown)="onKeyDown($event)"
                pFocusTrap
                [attr.data-p]="dataP()"
                [attr.data-p-open]="visible()"
                [attr.data-p-scrollblocker-active]="modal() && blockScroll()"
            >
                @if (headlessTemplate() || _headlessTemplate()) {
                    <ng-container *ngTemplateOutlet="headlessTemplate() || _headlessTemplate()"></ng-container>
                } @else {
                    <div [pBind]="ptm('header')" [ngClass]="cx('header')" [attr.data-pc-section]="'header'">
                        <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate()"></ng-container>
                        @if (header()) {
                            <div [pBind]="ptm('title')" [class]="cx('title')">{{ header() }}</div>
                        }
                        @if (closable()) {
                            <p-button
                                [pt]="ptm('pcCloseButton')"
                                [ngClass]="cx('pcCloseButton')"
                                (onClick)="close($event)"
                                (keydown.enter)="close($event)"
                                [buttonProps]="closeButtonProps()"
                                [ariaLabel]="ariaCloseLabel()"
                                [attr.data-pc-group-section]="'iconcontainer'"
                                [unstyled]="unstyled()"
                            >
                                <ng-template #icon>
                                    @if (!closeIconTemplate() && !_closeIconTemplate()) {
                                        <svg data-p-icon="times" [attr.data-pc-section]="'closeicon'" />
                                    }
                                    <ng-template *ngTemplateOutlet="closeIconTemplate() || _closeIconTemplate()"></ng-template>
                                </ng-template>
                            </p-button>
                        }
                    </div>

                    <div [pBind]="ptm('content')" [ngClass]="cx('content')" [attr.data-pc-section]="'content'">
                        <ng-content></ng-content>
                        <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate()"></ng-container>
                    </div>

                    @if (footerTemplate() || _footerTemplate()) {
                        <div [pBind]="ptm('footer')" [ngClass]="cx('footer')" [attr.data-pc-section]="'footer'">
                            <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate()"></ng-container>
                        </div>
                    }
                }
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class Drawer extends BaseComponent<DrawerPassThrough> {
    componentName = 'Drawer';

    $pcDrawer: Drawer | undefined = inject(DRAWER_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptm('host')));
    }
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);
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
     * Whether to block scrolling of the document when drawer is active.
     * @group Props
     */
    blockScroll = input<boolean, unknown>(false, { transform: booleanAttribute });
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
     * Aria label of the close icon.
     * @group Props
     */
    ariaCloseLabel = input<string | undefined>(undefined);
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
     * Whether an overlay mask is displayed behind the drawer.
     * @group Props
     */
    modal = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    closeButtonProps = input<ButtonProps>({ severity: 'secondary', text: true, rounded: true });
    /**
     * Whether to dismiss drawer on click of the mask.
     * @group Props
     */
    dismissible = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Specifies if pressing escape key should hide the drawer.
     * @group Props
     */
    closeOnEscape = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * The visible property is an input that determines the visibility of the component.
     * Emits `visibleChange` with the new value when the visibility of the component changes.
     * @defaultValue false
     * @group Props
     */
    visible = model<boolean>(false);

    /**
     * Specifies the position of the drawer, valid values are "left", "right", "bottom" and "top".
     * @defaultValue 'left'
     * @group Props
     */
    position = input<'left' | 'right' | 'bottom' | 'top' | 'full'>('left');
    /**
     * Adds a close icon to the header to hide the dialog.
     * @defaultValue false
     * @group Props
     */
    fullScreen = input<boolean>(false);

    $enterAnimation = computed(() => (this.fullScreen() ? 'p-drawer-enter-full' : `p-drawer-enter-${this.position()}`));

    $leaveAnimation = computed(() => (this.fullScreen() ? 'p-drawer-leave-full' : `p-drawer-leave-${this.position()}`));

    /**
     * Title content of the dialog.
     * @group Props
     */
    header = input<string | undefined>(undefined);
    /**
     * Style of the mask.
     * @group Props
     */
    maskStyle = input<{ [klass: string]: any } | null | undefined>(undefined);
    /**
     * Whether to display close button.
     * @group Props
     * @defaultValue true
     */
    closable = input<boolean, unknown>(true, { transform: booleanAttribute });
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

    modalVisible = linkedSignal<boolean, boolean>({
        source: this.visible,
        computation: (visible, previous) => visible || (previous?.value ?? false)
    });

    container = signal<Nullable<HTMLDivElement>>(undefined);

    mask = signal<Nullable<HTMLDivElement>>(undefined);

    maskClickListener = signal<VoidListener>(undefined);

    documentEscapeListener = signal<VoidListener>(undefined);

    animationEndListener = signal<VoidListener>(undefined);

    _componentStyle = inject(DrawerStyle);

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });
    /**
     * Custom footer template.
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });
    /**
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });
    /**
     * Custom close icon template.
     * @group Templates
     */
    readonly closeIconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });
    /**
     * Custom headless template to replace the entire drawer content.
     * @group Templates
     */
    readonly headlessTemplate = contentChild<TemplateRef<void>>('headless', { descendants: false });

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    _headerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    _footerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    _contentTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => !['header', 'footer', 'closeicon', 'headless'].includes(item.getType()))
                .at(-1)?.template
    );

    _closeIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'closeicon')
                .at(-1)?.template
    );

    _headlessTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'headless')
                .at(-1)?.template
    );

    readonly templates = contentChildren(PrimeTemplate);

    onKeyDown(event: KeyboardEvent) {
        if (event.code === 'Escape') {
            this.hide(false);
        }
    }

    show() {
        const container = this.container();
        container?.setAttribute(this.$attrSelector, '');

        if (this.autoZIndex()) {
            ZIndexUtils.set('modal', container, this.baseZIndex() || this.config.zIndex.modal);
        }

        if (this.modal()) {
            this.enableModality();
        }

        this.onShow.emit({});
    }

    hide(emit: boolean = true) {
        if (emit) {
            this.onHide.emit({});
        }

        if (this.modal()) {
            this.disableModality();
        }
    }

    close(event: Event) {
        this.hide();
        this.visible.set(false);
        event.preventDefault();
    }

    enableModality() {
        const activeDrawers = this.document.querySelectorAll('[data-p-open="true"]');
        const activeDrawersLength = activeDrawers.length;
        const zIndex = activeDrawersLength == 1 ? String(parseInt((this.container() as HTMLDivElement).style.zIndex) - 1) : String(parseInt((activeDrawers[activeDrawersLength - 1] as HTMLElement).style.zIndex) - 1);

        if (!this.mask()) {
            const mask: Nullable<HTMLDivElement> = this.renderer.createElement('div');
            this.mask.set(mask);

            if (mask) {
                const style = `z-index: ${zIndex};${this.getMaskStyle()}`;
                setAttribute(mask, 'style', style);
                setAttribute(mask, 'data-p', this.dataP());
                addClass(mask, this.cx('mask'));
            }

            if (this.dismissible()) {
                this.maskClickListener.set(
                    this.renderer.listen(mask, 'click', (event: any) => {
                        if (this.dismissible()) {
                            this.close(event);
                        }
                    })
                );
            }

            this.renderer.appendChild(this.document.body, mask);
            if (this.blockScroll()) {
                blockBodyScroll();
            }
        }
    }

    getMaskStyle = computed(() => {
        const maskStyle = this.maskStyle();
        return maskStyle
            ? Object.entries(maskStyle)
                  .map(([key, value]) => `${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}: ${value}`)
                  .join('; ')
            : '';
    });

    disableModality() {
        const mask = this.mask();
        // The mask leave animation is already running (started by close() or by the panel leave)
        if (mask && !this.animationEndListener()) {
            !this.$unstyled() && removeClass(mask, 'p-overlay-mask-enter-active');
            !this.$unstyled() && addClass(mask, 'p-overlay-mask-leave-active');
            const { animationName, animationDuration } = getComputedStyle(mask);
            if (animationName === 'none' || parseFloat(animationDuration) === 0) {
                // No leave animation runs (unstyled, animations disabled or overridden): animationend would never fire
                this.destroyModal();
            } else {
                this.animationEndListener.set(this.renderer.listen(mask, 'animationend', this.destroyModal.bind(this)));
            }
        }
    }

    destroyModal() {
        this.unbindMaskClickListener();

        const mask = this.mask();
        if (mask) {
            this.renderer.removeChild(this.document.body, mask);
        }

        if (this.blockScroll()) {
            unblockBodyScroll();
        }

        this.unbindAnimationEndListener();
        this.mask.set(null);
    }

    onBeforeEnter(event: MotionEvent) {
        this.container.set(event.element as HTMLDivElement);
        this.appendContainer();
        this.show();

        if (this.closeOnEscape()) {
            this.bindDocumentEscapeListener();
        }
    }

    onBeforeLeave() {
        // Fade the mask out together with the panel, also when visible is set to false from outside
        if (this.modal()) {
            this.disableModality();
        }
    }

    onAfterLeave() {
        this.hide(false);
        ZIndexUtils.clear(this.container());
        this.unbindGlobalListeners();
        this.modalVisible.set(false);
        this.container.set(null);
    }

    appendContainer() {
        if (this.$appendTo() && this.$appendTo() !== 'self') {
            if (this.$appendTo() === 'body') {
                appendChild(this.document.body, this.container()!);
            } else {
                appendChild(this.$appendTo(), this.container()!);
            }
        }
    }

    bindDocumentEscapeListener() {
        const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : this.document;

        this.documentEscapeListener.set(
            this.renderer.listen(documentTarget, 'keydown', (event) => {
                if (event.which == 27) {
                    const container = this.container();
                    if (parseInt((container as HTMLDivElement)?.style.zIndex) === ZIndexUtils.get(container)) {
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

    unbindMaskClickListener() {
        const maskClickListener = this.maskClickListener();
        if (maskClickListener) {
            maskClickListener();
            this.maskClickListener.set(null);
        }
    }

    unbindGlobalListeners() {
        this.unbindMaskClickListener();
        this.unbindDocumentEscapeListener();
    }

    unbindAnimationEndListener() {
        const animationEndListener = this.animationEndListener();
        if (animationEndListener && this.mask()) {
            animationEndListener();
            this.animationEndListener.set(null);
        }
    }

    onDestroy() {
        if (this.visible() && this.modal()) {
            this.destroyModal();
        }

        const container = this.container();
        if (this.$appendTo() && container) {
            this.renderer.appendChild(this.el.nativeElement, container);
        }

        if (container && this.autoZIndex()) {
            ZIndexUtils.clear(container);
        }

        this.container.set(null);
        this.unbindGlobalListeners();
        this.unbindAnimationEndListener();
    }

    dataP = computed(() =>
        this.cn({
            'full-screen': this.position() === 'full',
            [this.position()]: this.position(),
            open: this.visible(),
            modal: this.modal()
        })
    );
}

@NgModule({
    imports: [Drawer, SharedModule],
    exports: [Drawer, SharedModule]
})
export class DrawerModule {}
