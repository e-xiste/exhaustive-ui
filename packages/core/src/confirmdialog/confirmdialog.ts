import { CommonModule } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    InjectionToken,
    input,
    model,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    ViewEncapsulation,
    contentChild,
    contentChildren,
    output,
    viewChild
} from '@angular/core';
import { Confirmation, ConfirmationService, ConfirmEventType, Footer, PrimeTemplate, SharedModule, TranslationKeys } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { Button, ButtonProps } from '@exhaustive-ui/core/button';
import { Dialog } from '@exhaustive-ui/core/dialog';
import { Nullable } from '@exhaustive-ui/core/ts-helpers';
import { ConfirmDialogHeaderTemplateContext, ConfirmDialogHeadlessTemplateContext, ConfirmDialogMessageTemplateContext, ConfirmDialogPassThrough } from '@exhaustive-ui/core/types/confirmdialog';
import { Subject, Subscription } from 'rxjs';
import { ConfirmDialogStyle } from './style/confirmdialogstyle';

const CONFIRMDIALOG_INSTANCE = new InjectionToken<ConfirmDialog>('CONFIRMDIALOG_INSTANCE');

/**
 * ConfirmDialog uses a Dialog UI that is integrated with the Confirmation API.
 * @group Components
 */
@Component({
    selector: 'p-confirm-dialog, p-confirmDialog, p-confirmdialog',
    imports: [CommonModule, Button, Dialog, SharedModule, Bind],
    template: `
        <p-dialog
            [pt]="pt()"
            #dialog
            [visible]="visible()"
            (visibleChange)="onVisibleChange($event)"
            [role]="'alertdialog'"
            [closable]="option('closable')"
            [styleClass]="cn(cx('root'), styleClass())"
            [modal]="option('modal')"
            [header]="option('header')"
            [closeOnEscape]="option('closeOnEscape')"
            [blockScroll]="option('blockScroll')"
            [appendTo]="$appendTo()"
            [position]="option('position')"
            [style]="style()"
            [breakpoints]="breakpoints()"
            [dismissableMask]="option('dismissableMask')"
            [draggable]="option('draggable')"
            [baseZIndex]="baseZIndex()"
            [autoZIndex]="autoZIndex()"
            [maskStyleClass]="cn(cx('mask'), maskStyleClass())"
            [unstyled]="unstyled()"
            [focusOnShow]="!option('defaultFocus')"
            [closeButtonProps]="_closeButtonProps()"
            (onShow)="onDialogShow()"
            (onHide)="onDialogHide()"
        >
            @if (headlessTemplate() || _headlessTemplate()) {
                <ng-template #headless>
                    <ng-container
                        *ngTemplateOutlet="
                            headlessTemplate() || _headlessTemplate();
                            context: {
                                $implicit: confirmation(),
                                onAccept: onAccept.bind(this),
                                onReject: onReject.bind(this)
                            }
                        "
                    ></ng-container>
                </ng-template>
            } @else {
                @if (headerTemplate() || _headerTemplate()) {
                    <ng-template #header let-ariaLabelledBy="ariaLabelledBy">
                        <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate(); context: { ariaLabelledBy: ariaLabelledBy }"></ng-container>
                    </ng-template>
                }

                <ng-template #content>
                    @if (iconTemplate() || _iconTemplate()) {
                        <ng-template *ngTemplateOutlet="iconTemplate() || _iconTemplate()"></ng-template>
                    } @else if (!iconTemplate() && !_iconTemplate() && !_messageTemplate() && !messageTemplate()) {
                        @if (option('icon')) {
                            <i [ngClass]="cx('icon')" [class]="option('icon')" [pBind]="ptm('icon')"></i>
                        }
                    }
                    @if (messageTemplate() || _messageTemplate()) {
                        <ng-template *ngTemplateOutlet="messageTemplate() || _messageTemplate(); context: { $implicit: confirmation() }"></ng-template>
                    } @else {
                        <span [class]="cx('message')" [pBind]="ptm('message')" [innerHTML]="option('message')"> </span>
                    }
                </ng-template>
            }
            <ng-template #footer>
                @if (footerTemplate() || _footerTemplate() || footerFacet()) {
                    <ng-content select="p-footer"></ng-content>
                    <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate()"></ng-container>
                }
                @if (!footerTemplate() && !_footerTemplate() && !footerFacet()) {
                    @if (option('rejectVisible')) {
                        <p-button
                            #rejectButton
                            [pt]="ptm('pcRejectButton')"
                            [label]="rejectButtonLabel"
                            (onClick)="onReject()"
                            [styleClass]="getButtonStyleClass('pcRejectButton', 'rejectButtonStyleClass')"
                            [ariaLabel]="option('rejectButtonProps', 'ariaLabel')"
                            [buttonProps]="getRejectButtonProps()"
                            [unstyled]="unstyled()"
                        >
                            <ng-template #icon>
                                @if (option('rejectIcon') && !rejectIconTemplate() && !_rejectIconTemplate()) {
                                    <i [class]="option('rejectIcon')" [pBind]="ptm('pcRejectButton')['icon']"></i>
                                }
                                <ng-template *ngTemplateOutlet="rejectIconTemplate() || _rejectIconTemplate()"></ng-template>
                            </ng-template>
                        </p-button>
                    }
                    @if (option('acceptVisible')) {
                        <p-button
                            #acceptButton
                            [pt]="ptm('pcAcceptButton')"
                            [label]="acceptButtonLabel"
                            (onClick)="onAccept()"
                            [styleClass]="getButtonStyleClass('pcAcceptButton', 'acceptButtonStyleClass')"
                            [ariaLabel]="option('acceptButtonProps', 'ariaLabel')"
                            [buttonProps]="getAcceptButtonProps()"
                            [unstyled]="unstyled()"
                        >
                            <ng-template #icon>
                                @if (option('acceptIcon') && !_acceptIconTemplate() && !acceptIconTemplate()) {
                                    <i [class]="option('acceptIcon')" [pBind]="ptm('pcAcceptButton')['icon']"></i>
                                }
                                <ng-template *ngTemplateOutlet="acceptIconTemplate() || _acceptIconTemplate()"></ng-template>
                            </ng-template>
                        </p-button>
                    }
                }
            </ng-template>
        </p-dialog>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ConfirmDialogStyle, { provide: CONFIRMDIALOG_INSTANCE, useExisting: ConfirmDialog }, { provide: PARENT_INSTANCE, useExisting: ConfirmDialog }],
    hostDirectives: [Bind]
})
export class ConfirmDialog extends BaseComponent<ConfirmDialogPassThrough> {
    private confirmationService = inject(ConfirmationService);

    componentName = 'ConfirmDialog';

    $pcConfirmDialog: ConfirmDialog | undefined = inject(CONFIRMDIALOG_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Title text of the dialog.
     * @group Props
     */
    header = input<string | undefined>(undefined);
    /**
     * Icon to display next to message.
     * @group Props
     */
    icon = input<string | undefined>(undefined);
    /**
     * Message of the confirmation.
     * @group Props
     */
    message = input<string | undefined>(undefined);
    /**
     * Inline style of the element.
     * @group Props
     */
    style = input<{ [klass: string]: any } | null | undefined>(undefined);
    /**
     * Class of the element.
     * @group Props
     */
    styleClass = input<string | undefined>(undefined);
    /**
     * Specify the CSS class(es) for styling the mask element
     * @group Props
     */
    maskStyleClass = input<string | undefined>(undefined);
    /**
     * Icon of the accept button.
     * @group Props
     */
    acceptIcon = input<string | undefined>(undefined);
    /**
     * Label of the accept button.
     * @group Props
     */
    acceptLabel = input<string | undefined>(undefined);
    /**
     * Visibility of the accept button.
     * @group Props
     */
    acceptVisible = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Icon of the reject button.
     * @group Props
     */
    rejectIcon = input<string | undefined>(undefined);
    /**
     * Label of the reject button.
     * @group Props
     */
    rejectLabel = input<string | undefined>(undefined);
    /**
     * Visibility of the reject button.
     * @group Props
     */
    rejectVisible = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Style class of the accept button.
     * @group Props
     */
    acceptButtonStyleClass = input<string | undefined>(undefined);
    /**
     * Style class of the reject button.
     * @group Props
     */
    rejectButtonStyleClass = input<string | undefined>(undefined);
    /**
     * Specifies if pressing escape key should hide the dialog.
     * @group Props
     */
    closeOnEscape = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Specifies if clicking the modal background should hide the dialog.
     * @group Props
     */
    dismissableMask = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Determines whether scrolling behavior should be blocked within the component.
     * @group Props
     */
    blockScroll = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Adds a close icon to the header to hide the dialog.
     * @group Props
     */
    closable = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'body'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>('body');
    /**
     * Optional key to match the key of confirm object, necessary to use when component tree has multiple confirm dialogs.
     * @group Props
     */
    key = input<string | undefined>(undefined);
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
     * Object literal to define widths per screen size.
     * @group Props
     */
    breakpoints = input<any>();
    /**
     * Defines if background should be blocked when dialog is displayed.
     * @group Props
     */
    modal = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Current visible state as a boolean.
     * Emits `visibleChange` with the new value when the dialog is shown or hidden.
     * @group Props
     */
    visible = model<any>(undefined);
    /**
     *  Allows getting the position of the component.
     * @group Props
     */
    position = input<'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright'>('center');
    /**
     * Enables dragging to change the position using header.
     * @group Props
     */
    draggable = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Callback to invoke when dialog is hidden.
     * @param {ConfirmEventType} enum - Custom confirm event.
     * @group Emits
     */
    readonly onHide = output<ConfirmEventType | undefined>();

    _componentStyle = inject(ConfirmDialogStyle);

    /**
     * Custom header template.
     * @param context - header template context.
     * @group Templates
     */
    readonly headerTemplate = contentChild<Nullable<TemplateRef<ConfirmDialogHeaderTemplateContext>>>('header', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    readonly footerTemplate = contentChild<Nullable<TemplateRef<void>>>('footer', { descendants: false });

    /**
     * Custom reject icon template.
     * @group Templates
     */
    readonly rejectIconTemplate = contentChild<Nullable<TemplateRef<void>>>('rejecticon', { descendants: false });

    /**
     * Custom accept icon template.
     * @group Templates
     */
    readonly acceptIconTemplate = contentChild<Nullable<TemplateRef<void>>>('accepticon', { descendants: false });

    /**
     * Custom message template.
     * @group Templates
     */
    readonly messageTemplate = contentChild<Nullable<TemplateRef<ConfirmDialogMessageTemplateContext>>>('message', { descendants: false });

    /**
     * Custom icon template.
     * @group Templates
     */
    readonly iconTemplate = contentChild<Nullable<TemplateRef<void>>>('icon', { descendants: false });

    /**
     * Custom headless template.
     * @group Templates
     */
    readonly headlessTemplate = contentChild<Nullable<TemplateRef<ConfirmDialogHeadlessTemplateContext>>>('headless', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    readonly footerFacet = contentChild(Footer);

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

    _rejectIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'rejecticon')
                .at(-1)?.template
    );

    _acceptIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'accepticon')
                .at(-1)?.template
    );

    _messageTemplate = computed<TemplateRef<ConfirmDialogMessageTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'message')
                .at(-1)?.template
    );

    _iconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'icon')
                .at(-1)?.template
    );

    _headlessTemplate = computed<TemplateRef<ConfirmDialogHeadlessTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'headless')
                .at(-1)?.template
    );

    confirmation = signal<Nullable<Confirmation>>(undefined);

    readonly dialogViewChild = viewChild<Dialog>('dialog');

    _closeButtonProps = computed<ButtonProps>(() => ({ severity: 'secondary', variant: 'text', rounded: true, ...this.confirmation()?.closeButtonProps }));

    readonly acceptButtonViewChild = viewChild('acceptButton', { read: ElementRef });

    readonly rejectButtonViewChild = viewChild('rejectButton', { read: ElementRef });

    subscription: Subscription;

    translationSubscription: Subscription | undefined;

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptm('host'));
        this.subscription = this.confirmationService.requireConfirmation$.subscribe((confirmation) => {
            if (!confirmation) {
                this.hide();
                return;
            }
            if (confirmation.key === this.key()) {
                this.confirmation.set(confirmation);

                if (confirmation.accept) {
                    confirmation.acceptEvent = new Subject();
                    confirmation.acceptEvent.subscribe(confirmation.accept as () => void);
                }

                if (confirmation.reject) {
                    confirmation.rejectEvent = new Subject();
                    confirmation.rejectEvent.subscribe(confirmation.reject as () => void);
                }

                this.visible.set(true);
            }
        });
    }

    onInit() {
        this.translationSubscription = this.config.translationObserver.subscribe(() => {
            if (this.visible()) {
                this.cd.markForCheck();
            }
        });
    }

    option(name: string, k?: string) {
        const confirmation: { [key: string]: any } = this.confirmation() ?? {};
        const source: { [key: string]: any } = Object.prototype.hasOwnProperty.call(confirmation, name) ? confirmation : this;

        if (Object.prototype.hasOwnProperty.call(source, name)) {
            const value = k ? source[name]?.[k] : source[name];
            return typeof value === 'function' ? value() : value;
        }

        return undefined;
    }

    getButtonStyleClass(cx: string, opt: string): string {
        const cxClass = this.cx(cx);
        const optionClass = this.option(opt);

        return [cxClass, optionClass].filter(Boolean).join(' ');
    }

    close() {
        const confirmation = this.confirmation();
        if (confirmation?.rejectEvent) {
            confirmation.rejectEvent.next(ConfirmEventType.CANCEL);
        }

        this.hide(ConfirmEventType.CANCEL, confirmation);
    }

    hide(type?: ConfirmEventType, confirmation: Nullable<Confirmation> = this.confirmation()) {
        this.onHide.emit(type);
        // A callback of the answered confirmation may have requested a new one: keep the dialog open for it.
        if (this.confirmation() === confirmation) {
            this.visible.set(false);
        }
        // Unsubscribe from confirmation events when the dialogue is closed, because events are created when the dialogue is opened.
        this.unsubscribeConfirmationEvents(confirmation);
    }

    /**
     * Applies the defaultFocus of the confirmation ('accept', 'reject', 'close' or 'none') once the dialog is shown.
     * Without defaultFocus the inner Dialog focuses its first focusable element itself (focusOnShow).
     */
    onDialogShow() {
        const defaultFocus = this.option('defaultFocus');
        let target: HTMLElement | null | undefined;

        if (defaultFocus === 'accept') {
            target = this.acceptButtonViewChild()?.nativeElement;
        } else if (defaultFocus === 'reject') {
            target = this.rejectButtonViewChild()?.nativeElement;
        } else if (defaultFocus === 'close') {
            target = this.dialogViewChild()?.container()?.querySelector('[data-pc-group-section="headericon"]');
        }

        const focusable = target?.matches('button') ? target : target?.querySelector('button');
        focusable?.focus();
    }

    onDialogHide() {
        this.confirmation.set(null);
    }

    onDestroy() {
        this.subscription.unsubscribe();
        // Unsubscribe from confirmation events if the dialogue is opened and this component is somehow destroyed.
        this.unsubscribeConfirmationEvents();

        if (this.translationSubscription) {
            this.translationSubscription.unsubscribe();
        }
    }

    onVisibleChange(value: boolean) {
        if (!value) {
            this.close();
        } else {
            this.visible.set(value);
        }
    }

    onAccept() {
        const confirmation = this.confirmation();
        if (confirmation && confirmation.acceptEvent) {
            confirmation.acceptEvent.next(undefined);
        }
        this.hide(ConfirmEventType.ACCEPT, confirmation);
    }

    onReject() {
        const confirmation = this.confirmation();
        if (confirmation && confirmation.rejectEvent) {
            confirmation.rejectEvent.next(ConfirmEventType.REJECT);
        }

        this.hide(ConfirmEventType.REJECT, confirmation);
    }

    unsubscribeConfirmationEvents(confirmation: Nullable<Confirmation> = this.confirmation()) {
        if (confirmation) {
            confirmation.acceptEvent?.unsubscribe();
            confirmation.rejectEvent?.unsubscribe();
        }
    }

    get acceptButtonLabel(): string {
        return this.option('acceptLabel') || this.getAcceptButtonProps()?.label || this.config.getTranslation(TranslationKeys.ACCEPT);
    }

    get rejectButtonLabel(): string {
        return this.option('rejectLabel') || this.getRejectButtonProps()?.label || this.config.getTranslation(TranslationKeys.REJECT);
    }

    getAcceptButtonProps() {
        return this.option('acceptButtonProps');
    }

    getRejectButtonProps() {
        return this.option('rejectButtonProps');
    }
}

@NgModule({
    imports: [ConfirmDialog, SharedModule],
    exports: [ConfirmDialog, SharedModule]
})
export class ConfirmDialogModule {}
