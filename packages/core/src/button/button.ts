import { CommonModule } from '@angular/common';
import {
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    Directive,
    effect,
    inject,
    InjectionToken,
    input,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    contentChildren,
    output
} from '@angular/core';
import { addClass, createElement, findSingle, isEmpty } from '@exhaustive-ui/utils';
import { PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { AutoFocus } from '@exhaustive-ui/core/autofocus';
import { BadgeModule } from '@exhaustive-ui/core/badge';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { Fluid } from '@exhaustive-ui/core/fluid';
import { SpinnerIcon } from '@exhaustive-ui/core/icons';
import { Ripple } from '@exhaustive-ui/core/ripple';
import type { ButtonIconTemplateContext, ButtonLoadingIconTemplateContext, ButtonPassThrough, ButtonProps, ButtonSeverity } from '@exhaustive-ui/core/types/button';
import { ButtonStyle } from './style/buttonstyle';

const BUTTON_INSTANCE = new InjectionToken<Button>('BUTTON_INSTANCE');

const BUTTON_DIRECTIVE_INSTANCE = new InjectionToken<ButtonDirective>('BUTTON_DIRECTIVE_INSTANCE');

const BUTTON_LABEL_INSTANCE = new InjectionToken<ButtonLabel>('BUTTON_LABEL_INSTANCE');

const BUTTON_ICON_INSTANCE = new InjectionToken<ButtonIcon>('BUTTON_ICON_INSTANCE');

export type ButtonIconPosition = 'left' | 'right' | 'top' | 'bottom';

const INTERNAL_BUTTON_CLASSES = {
    button: 'p-button',
    component: 'p-component',
    iconOnly: 'p-button-icon-only',
    disabled: 'p-disabled',
    loading: 'p-button-loading',
    labelOnly: 'p-button-loading-label-only'
} as const;

@Directive({
    selector: '[pButtonLabel]',
    providers: [ButtonStyle, { provide: BUTTON_LABEL_INSTANCE, useExisting: ButtonLabel }, { provide: PARENT_INSTANCE, useExisting: ButtonLabel }],
    host: {
        '[class.p-button-label]': '!$unstyled() && true'
    },
    hostDirectives: [Bind]
})
export class ButtonLabel extends BaseComponent {
    componentName = 'ButtonLabel';

    /**
     * Used to pass attributes to DOM elements inside the pButtonLabel.
     * @defaultValue undefined
     * @deprecated use pButtonLabelPT instead.
     * @group Props
     */
    ptButtonLabel = input<any>();
    /**
     * Used to pass attributes to DOM elements inside the pButtonLabel.
     * @defaultValue undefined
     * @group Props
     */
    pButtonLabelPT = input<any>();
    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    pButtonLabelUnstyled = input<boolean | undefined>();

    $pcButtonLabel: ButtonLabel | undefined = inject(BUTTON_LABEL_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        effect(() => {
            const pt = this.ptButtonLabel() || this.pButtonLabelPT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pButtonLabelUnstyled() && this.directiveUnstyled.set(this.pButtonLabelUnstyled());
        });

        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
    }
}

@Directive({
    selector: '[pButtonIcon]',
    providers: [ButtonStyle, { provide: BUTTON_ICON_INSTANCE, useExisting: ButtonIcon }, { provide: PARENT_INSTANCE, useExisting: ButtonIcon }],
    host: {
        '[class.p-button-icon]': '!$unstyled() && true'
    },
    hostDirectives: [Bind]
})
export class ButtonIcon extends BaseComponent {
    componentName = 'ButtonIcon';

    /**
     * Used to pass attributes to DOM elements inside the pButtonIcon.
     * @defaultValue undefined
     * @deprecated use pButtonIconPT instead.
     * @group Props
     */
    ptButtonIcon = input<any>();
    /**
     * Used to pass attributes to DOM elements inside the pButtonIcon.
     * @defaultValue undefined
     * @group Props
     */
    pButtonIconPT = input<any>();
    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    pButtonUnstyled = input<boolean | undefined>();

    $pcButtonIcon: ButtonIcon | undefined = inject(BUTTON_ICON_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        effect(() => {
            const pt = this.ptButtonIcon() || this.pButtonIconPT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pButtonUnstyled() && this.directiveUnstyled.set(this.pButtonUnstyled());
        });

        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
    }
}
/**
 * Button directive is an extension to button component.
 * @group Components
 */
@Directive({
    selector: '[pButton]',
    providers: [ButtonStyle, { provide: BUTTON_DIRECTIVE_INSTANCE, useExisting: ButtonDirective }, { provide: PARENT_INSTANCE, useExisting: ButtonDirective }],
    host: {
        '[class.p-button-icon-only]': '!$unstyled() && isIconOnly()',
        '[class.p-button-text]': ' !$unstyled() && isTextButton()'
    },
    hostDirectives: [Bind]
})
export class ButtonDirective extends BaseComponent {
    componentName = 'Button';

    $pcButtonDirective: ButtonDirective | undefined = inject(BUTTON_DIRECTIVE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ButtonStyle);

    /**
     * Used to pass attributes to DOM elements inside the Button component.
     * @defaultValue undefined
     * @deprecated use pButtonPT instead.
     * @group Props
     */
    ptButtonDirective = input<ButtonPassThrough>();
    /**
     * Used to pass attributes to DOM elements inside the Button component.
     * @defaultValue undefined
     * @group Props
     */
    pButtonPT = input<ButtonPassThrough>();
    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    pButtonUnstyled = input<boolean | undefined>();

    readonly hostName = input<any>('');

    constructor() {
        super();
        effect(() => {
            const pt = this.ptButtonDirective() || this.pButtonPT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pButtonUnstyled() && this.directiveUnstyled.set(this.pButtonUnstyled());
        });

        effect(() => {
            const unstyled = this.$unstyled();

            untracked(() => {
                if (this.initialized() && unstyled) {
                    this.setStyleClass();
                }
            });
        });

        effect(() => {
            this._label();

            untracked(() => {
                if (this.initialized()) {
                    this.updateLabel();
                    this.updateIcon();
                    this.setStyleClass();
                }
            });
        });

        effect(() => {
            this._icon();
            this._loading();
            this.iconPos();
            this.loadingIcon();

            untracked(() => {
                if (this.initialized()) {
                    this.updateIcon();
                    this.setStyleClass();
                }
            });
        });

        effect(() => {
            this._severity();
            this.text();
            this.plain();
            this.raised();
            this.size();
            this.outlined();
            this.rounded();
            this.hasFluid();

            untracked(() => {
                if (this.initialized()) {
                    this.setStyleClass();
                }
            });
        });

        afterNextRender(() => {
            if (!this.$unstyled()) {
                this._appliedClasses = this.getStyleClass();
                addClass(this.htmlElement, this._appliedClasses.join(' '));
            }

            this.createIcon();
            this.createLabel();
            this.initialized.set(true);
        });

        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptm('root'));
    }

    /**
     * Add a textual class to the button without a background initially.
     * @group Props
     */
    readonly text = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a plain textual class to the button without a background initially.
     * @group Props
     */
    readonly plain = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a shadow to indicate elevation.
     * @group Props
     */
    readonly raised = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Defines the size of the button.
     * @group Props
     */
    readonly size = input<'small' | 'large' | undefined>();

    /**
     * Add a border class without a background initially.
     * @group Props
     */
    readonly outlined = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a circular border radius to the button.
     * @group Props
     */
    readonly rounded = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Position of the icon.
     * @group Props
     */
    readonly iconPos = input<ButtonIconPosition>('left');

    /**
     * Icon to display in loading state.
     * @group Props
     */
    readonly loadingIcon = input<string | undefined>();

    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });

    private iconSignal = contentChild(ButtonIcon);

    private labelSignal = contentChild(ButtonLabel);

    isIconOnly = computed(() => !!(!this.labelSignal() && this.iconSignal()));

    public readonly _label = computed<string | undefined>(() => this.label() || this.buttonProps()?.label);

    public readonly _icon = computed<string | undefined>(() => this.icon() || this.buttonProps()?.icon);

    public readonly _loading = computed<boolean | undefined>(() => this.loading() || this.buttonProps()?.loading);

    private readonly _severity = computed<ButtonSeverity>(() => this.severity() || this.buttonProps()?.severity);

    public initialized = signal<boolean | undefined>(undefined);

    private get htmlElement(): HTMLElement {
        return this.el.nativeElement as HTMLElement;
    }

    private _internalClasses: string[] = Object.values(INTERNAL_BUTTON_CLASSES);

    private _appliedClasses: string[] = [];

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    isTextButton = computed(() => !!(!this.iconSignal() && this.labelSignal() && this.text()));

    /**
     * Text of the button.
     * @deprecated use pButtonLabel directive instead.
     * @group Props
     */
    readonly label = input<string | undefined>();

    /**
     * Name of the icon.
     * @deprecated use pButtonIcon directive instead
     * @group Props
     */
    readonly icon = input<string>();

    /**
     * Whether the button is in loading state.
     * @group Props
     */
    readonly loading = input<boolean>(false);

    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @deprecated assign props directly to the button element.
     * @group Props
     */
    readonly buttonProps = input<ButtonProps>();

    /**
     * Defines the style of the button.
     * @group Props
     */
    readonly severity = input<ButtonSeverity>();

    spinnerIcon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="p-icon-spin">
        <g clip-path="url(#clip0_417_21408)">
            <path
                d="M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z"
                fill="currentColor"
            />
        </g>
        <defs>
            <clipPath id="clip0_417_21408">
                <rect width="14" height="14" fill="white" />
            </clipPath>
        </defs>
    </svg>`;

    getStyleClass(): string[] {
        const styleClass: string[] = [INTERNAL_BUTTON_CLASSES.button, INTERNAL_BUTTON_CLASSES.component];

        if (this._icon() && !this._label() && isEmpty(this.htmlElement.textContent)) {
            styleClass.push(INTERNAL_BUTTON_CLASSES.iconOnly);
        }

        if (this._loading()) {
            styleClass.push(INTERNAL_BUTTON_CLASSES.disabled, INTERNAL_BUTTON_CLASSES.loading);

            if (!this._icon() && this._label()) {
                styleClass.push(INTERNAL_BUTTON_CLASSES.labelOnly);
            }

            if (this._icon() && !this._label() && !isEmpty(this.htmlElement.textContent)) {
                styleClass.push(INTERNAL_BUTTON_CLASSES.iconOnly);
            }
        }

        if (this.text()) {
            styleClass.push('p-button-text');
        }

        if (this._severity()) {
            styleClass.push(`p-button-${this._severity()}`);
        }

        if (this.plain()) {
            styleClass.push('p-button-plain');
        }

        if (this.raised()) {
            styleClass.push('p-button-raised');
        }

        if (this.size()) {
            styleClass.push(`p-button-${this.size()}`);
        }

        if (this.outlined()) {
            styleClass.push('p-button-outlined');
        }

        if (this.rounded()) {
            styleClass.push('p-button-rounded');
        }

        if (this.size() === 'small') {
            styleClass.push('p-button-sm');
        }

        if (this.size() === 'large') {
            styleClass.push('p-button-lg');
        }

        if (this.hasFluid()) {
            styleClass.push('p-button-fluid');
        }

        return this.$unstyled() ? [] : styleClass;
    }

    readonly hasFluid = computed(() => this.fluid() ?? !!this.pcFluid);

    setStyleClass() {
        const styleClass = this.getStyleClass();
        this.removeExistingSeverityClass();

        // also drop the variant classes (outlined, text, raised, size...) applied by the previous call
        this.htmlElement.classList.remove(...this._internalClasses, ...this._appliedClasses);
        this.htmlElement.classList.add(...styleClass);
        this._appliedClasses = styleClass;
    }

    removeExistingSeverityClass() {
        const severityArray = ['success', 'info', 'warn', 'danger', 'help', 'primary', 'secondary', 'contrast'];
        const existingSeverityClass = this.htmlElement.classList.value.split(' ').find((cls) => severityArray.some((severity) => cls === `p-button-${severity}`));

        if (existingSeverityClass) {
            this.htmlElement.classList.remove(existingSeverityClass);
        }
    }

    createLabel() {
        const created = findSingle(this.htmlElement, '[data-pc-section="buttonlabel"]');
        if (!created && this._label()) {
            let labelElement = <HTMLElement>createElement('span', { class: this.cx('label'), 'p-bind': this.ptm('buttonlabel'), 'aria-hidden': this._icon() && !this._label() ? 'true' : null });
            labelElement.appendChild(this.document.createTextNode(this._label() as string));
            this.htmlElement.appendChild(labelElement);
        }
    }

    createIcon() {
        const created = findSingle(this.htmlElement, '[data-pc-section="buttonicon"]');
        if (!created && (this._icon() || this._loading())) {
            let iconPosClass = this._label() && !this.$unstyled() ? 'p-button-icon-' + this.iconPos() : null;
            let iconClass = !this.$unstyled() && this.getIconClass();
            let iconElement: HTMLElement = <HTMLElement>createElement('span', { class: this.cn(this.cx('icon'), iconPosClass, iconClass), 'aria-hidden': 'true', 'p-bind': this.ptm('buttonicon') });

            if (!this.loadingIcon() && this._loading()) {
                iconElement.innerHTML = this.spinnerIcon;
            }

            this.htmlElement.insertBefore(iconElement, this.htmlElement.firstChild);
        }
    }

    updateLabel() {
        let labelElement = findSingle(this.htmlElement, '[data-pc-section="buttonlabel"]');

        if (!this._label()) {
            labelElement && this.htmlElement.removeChild(labelElement);
            return;
        }

        labelElement ? (labelElement.textContent = this._label() as string) : this.createLabel();
    }

    updateIcon() {
        let iconElement = findSingle(this.htmlElement, '[data-pc-section="buttonicon"]');
        let labelElement = findSingle(this.htmlElement, '[data-pc-section="buttonlabel"]');

        if (this._loading() && !this.loadingIcon() && iconElement) {
            iconElement.innerHTML = this.spinnerIcon;
        } else if (iconElement?.innerHTML) {
            iconElement.innerHTML = '';
        }

        if (iconElement && !this.$unstyled()) {
            if (this.iconPos()) {
                iconElement.className = 'p-button-icon ' + (labelElement ? 'p-button-icon-' + this.iconPos() : '') + ' ' + this.getIconClass();
            } else {
                iconElement.className = 'p-button-icon ' + this.getIconClass();
            }
        } else {
            this.createIcon();
        }
    }

    getIconClass() {
        return this._loading() ? 'p-button-loading-icon ' + (this.loadingIcon() ? this.loadingIcon() : 'p-icon') : this._icon() || 'p-hidden';
    }

    onDestroy() {
        this.initialized.set(false);
    }
}
/**
 * Button is an extension to standard button element with icons and theming.
 * @group Components
 */
@Component({
    selector: 'p-button',
    imports: [CommonModule, Ripple, AutoFocus, SpinnerIcon, BadgeModule, SharedModule, Bind],
    template: `
        <button
            [attr.type]="type() || buttonProps()?.type"
            [attr.aria-label]="ariaLabel() || buttonProps()?.ariaLabel"
            [attr.aria-expanded]="ariaExpanded()"
            [attr.aria-controls]="ariaControls()"
            [ngStyle]="style() || buttonProps()?.style"
            [disabled]="disabled() || loading() || buttonProps()?.disabled"
            [class]="cn(cx('root'), styleClass(), buttonProps()?.styleClass)"
            (click)="onClick.emit($event)"
            (focus)="onFocus.emit($event)"
            (blur)="onBlur.emit($event)"
            pRipple
            [attr.tabindex]="tabindex() || buttonProps()?.tabindex"
            [pAutoFocus]="autofocus() || buttonProps()?.autofocus"
            [pBind]="ptm('root')"
            [attr.data-p]="dataP()"
            [attr.data-p-disabled]="disabled() || loading() || buttonProps()?.disabled"
            [attr.data-p-severity]="severity() || buttonProps()?.severity"
        >
            <ng-content></ng-content>
            <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate()"></ng-container>
            @if (loading() || buttonProps()?.loading) {
                @if (!loadingIconTemplate() && !_loadingIconTemplate()) {
                    @if (loadingIcon() || buttonProps()?.loadingIcon) {
                        <span [class]="cn(cx('loadingIcon'), 'pi-spin', loadingIcon() || buttonProps()?.loadingIcon)" [pBind]="ptm('loadingIcon')" [attr.aria-hidden]="true"></span>
                    }
                    @if (!(loadingIcon() || buttonProps()?.loadingIcon)) {
                        <svg data-p-icon="spinner" [class]="cn(cx('loadingIcon'), cx('spinnerIcon'))" [pBind]="ptm('loadingIcon')" [spin]="true" [attr.aria-hidden]="true" />
                    }
                }
                @if (loadingIconTemplate() || _loadingIconTemplate()) {
                    <ng-template *ngTemplateOutlet="loadingIconTemplate() || _loadingIconTemplate(); context: { class: cx('loadingIcon'), pt: ptm('loadingIcon') }"></ng-template>
                }
            }
            @if (!(loading() || buttonProps()?.loading)) {
                @if ((icon() || buttonProps()?.icon) && !iconTemplate() && !_iconTemplate()) {
                    <span [class]="cn(cx('icon'), icon() || buttonProps()?.icon)" [pBind]="ptm('icon')" [attr.data-p]="dataIconP()"></span>
                }
                @if (!icon() && (iconTemplate() || _iconTemplate())) {
                    <ng-template *ngTemplateOutlet="iconTemplate() || _iconTemplate(); context: { class: cx('icon'), pt: ptm('icon') }"></ng-template>
                }
            }
            @if (!contentTemplate() && !_contentTemplate() && (label() || buttonProps()?.label)) {
                <span [class]="cx('label')" [attr.aria-hidden]="(icon() || buttonProps()?.icon) && !(label() || buttonProps()?.label)" [pBind]="ptm('label')" [attr.data-p]="dataLabelP()">{{ label() || buttonProps()?.label }}</span>
            }
            @if (!contentTemplate() && !_contentTemplate() && (badge() || buttonProps()?.badge)) {
                <p-badge [value]="badge() || buttonProps()?.badge" [severity]="badgeSeverity() || buttonProps()?.badgeSeverity" [pt]="ptm('pcBadge')" [unstyled]="unstyled()"></p-badge>
            }
        </button>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ButtonStyle, { provide: BUTTON_INSTANCE, useExisting: Button }, { provide: PARENT_INSTANCE, useExisting: Button }],
    hostDirectives: [Bind]
})
export class Button extends BaseComponent<ButtonPassThrough> {
    componentName = 'Button';

    readonly hostName = input<any>('');

    $pcButton: Button | undefined = inject(BUTTON_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(ButtonStyle);

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptm('host'));
    }

    /**
     * Type of the button.
     * @group Props
     */
    readonly type = input<string>('button');

    /**
     * Value of the badge.
     * @group Props
     */
    readonly badge = input<string | undefined>();

    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Add a shadow to indicate elevation.
     * @group Props
     */
    readonly raised = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a circular border radius to the button.
     * @group Props
     */
    readonly rounded = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a textual class to the button without a background initially.
     * @group Props
     */
    readonly text = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a plain textual class to the button without a background initially.
     * @group Props
     */
    readonly plain = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a border class without a background initially.
     * @group Props
     */
    readonly outlined = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a link style to the button.
     * @group Props
     */
    readonly link = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Add a tabindex to the button.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * Defines the size of the button.
     * @group Props
     */
    readonly size = input<'small' | 'large' | undefined>();

    /**
     * Specifies the variant of the component.
     * @group Props
     */
    readonly variant = input<'outlined' | 'text' | undefined>();

    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null | undefined>();

    /**
     * Class of the element.
     * @group Props
     */
    readonly styleClass = input<string | undefined>();

    /**
     * Severity type of the badge.
     * @group Props
     * @defaultValue secondary
     */
    readonly badgeSeverity = input<'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined>('secondary');

    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();
    /**
     * Value of the aria-expanded attribute of the button, for a button that shows or hides an element.
     * @group Props
     */
    readonly ariaExpanded = input<boolean | undefined>();
    /**
     * Id of the element the button controls, set as its aria-controls attribute.
     * @group Props
     */
    readonly ariaControls = input<string | undefined>();

    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Position of the icon.
     * @group Props
     */
    readonly iconPos = input<ButtonIconPosition>('left');

    /**
     * Name of the icon.
     * @group Props
     */
    readonly icon = input<string | undefined>();

    /**
     * Text of the button.
     * @group Props
     */
    readonly label = input<string | undefined>();

    /**
     * Whether the button is in loading state.
     * @group Props
     */
    readonly loading = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Icon to display in loading state.
     * @group Props
     */
    readonly loadingIcon = input<string | undefined>();

    /**
     * Defines the style of the button.
     * @group Props
     */
    readonly severity = input<ButtonSeverity>();

    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly buttonProps = input<ButtonProps>();

    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });

    /**
     * Callback to execute when button is clicked.
     * This event is intended to be used with the <p-button> component. Using a regular <button> element, use (click).
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onClick = output<MouseEvent>();

    /**
     * Callback to execute when button is focused.
     * This event is intended to be used with the <p-button> component. Using a regular <button> element, use (focus).
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    readonly onFocus = output<FocusEvent>();

    /**
     * Callback to execute when button loses focus.
     * This event is intended to be used with the <p-button> component. Using a regular <button> element, use (blur).
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    readonly onBlur = output<FocusEvent>();

    /**
     * Custom content template.
     * @group Templates
     **/
    readonly contentTemplate = contentChild<TemplateRef<void>>('content');

    /**
     * Custom loading icon template.
     * @group Templates
     **/
    readonly loadingIconTemplate = contentChild<TemplateRef<ButtonLoadingIconTemplateContext>>('loadingicon');

    /**
     * Custom icon template.
     * @group Templates
     **/
    readonly iconTemplate = contentChild<TemplateRef<ButtonIconTemplateContext>>('icon');

    readonly templates = contentChildren(PrimeTemplate);

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    readonly hasFluid = computed(() => this.fluid() ?? !!this.pcFluid);

    readonly hasIcon = computed(() => this.icon() || this.buttonProps()?.icon || this.iconTemplate() || this._iconTemplate() || this.loadingIcon() || this.loadingIconTemplate() || this._loadingIconTemplate());

    readonly _contentTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() !== 'icon' && item.getType() !== 'loadingicon')
                .at(-1)?.template
    );

    readonly _iconTemplate = computed<TemplateRef<ButtonIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'icon')
                .at(-1)?.template
    );

    readonly _loadingIconTemplate = computed<TemplateRef<ButtonLoadingIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'loadingicon')
                .at(-1)?.template
    );

    readonly dataP = computed(() =>
        this.cn({
            [this.size() as string]: this.size(),
            'icon-only': this.hasIcon() && !this.label() && !this.badge(),
            loading: this.loading(),
            fluid: this.hasFluid(),
            rounded: this.rounded(),
            raised: this.raised(),
            outlined: this.outlined() || this.variant() === 'outlined',
            text: this.text() || this.variant() === 'text',
            link: this.link(),
            vertical: (this.iconPos() === 'top' || this.iconPos() === 'bottom') && this.label()
        })
    );

    readonly dataIconP = computed(() =>
        this.cn({
            [this.iconPos()]: this.iconPos(),
            [this.size() as string]: this.size()
        })
    );

    readonly dataLabelP = computed(() =>
        this.cn({
            [this.size() as string]: this.size(),
            'icon-only': this.hasIcon() && !this.label() && !this.badge()
        })
    );
}

@NgModule({
    imports: [CommonModule, ButtonDirective, Button, SharedModule, ButtonLabel, ButtonIcon],
    exports: [ButtonDirective, Button, ButtonLabel, ButtonIcon, SharedModule]
})
export class ButtonModule {}
