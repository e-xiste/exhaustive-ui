import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    Directive,
    effect,
    ElementRef,
    forwardRef,
    HostListener,
    inject,
    InjectionToken,
    input,
    NgModule,
    NgZone,
    numberAttribute,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MotionOptions } from '@exhaustive-ui/motion';
import { absolutePosition, addClass, hasClass, isTouchDevice, removeClass } from '@exhaustive-ui/utils';
import { OverlayOptions, OverlayService, PrimeTemplate, SharedModule, TranslationKeys } from '@exhaustive-ui/core/api';
import { AutoFocus } from '@exhaustive-ui/core/autofocus';
import { PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseEditableHolder } from '@exhaustive-ui/core/baseeditableholder';
import { BaseInput } from '@exhaustive-ui/core/baseinput';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { ConnectedOverlayScrollHandler, DomHandler } from '@exhaustive-ui/core/dom';
import { Fluid } from '@exhaustive-ui/core/fluid';
import { EyeIcon, EyeSlashIcon, TimesIcon } from '@exhaustive-ui/core/icons';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { Overlay } from '@exhaustive-ui/core/overlay';
import { Nullable, VoidListener } from '@exhaustive-ui/core/ts-helpers';
import type { PasswordIconTemplateContext, PasswordPassThrough } from '@exhaustive-ui/core/types/password';
import { Subscription } from 'rxjs';
import { PasswordStyle } from './style/passwordstyle';

const PASSWORD_DIRECTIVE_INSTANCE = new InjectionToken<PasswordDirective>('PASSWORD_DIRECTIVE_INSTANCE');

const PASSWORD_INSTANCE = new InjectionToken<Password>('PASSWORD_INSTANCE');

type Meter = {
    strength: string;
    width: string;
};
/**
 * Password directive.
 * @group Components
 */
const DEFAULT_MEDIUM_REGEX = '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})';

const DEFAULT_STRONG_REGEX = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})';

/**
 * Adds the password strength meter to a native input: `<input type="password" pPassword />`.
 */
@Directive({
    selector: '[pPassword]',
    host: {
        '[class]': "cx('rootDirective')"
    },
    providers: [PasswordStyle, { provide: PASSWORD_DIRECTIVE_INSTANCE, useExisting: PasswordDirective }, { provide: PARENT_INSTANCE, useExisting: PasswordDirective }],
    hostDirectives: [Bind]
})
export class PasswordDirective extends BaseEditableHolder {
    zone = inject(NgZone);

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcPasswordDirective: PasswordDirective | undefined = inject(PASSWORD_DIRECTIVE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    /**
     * Used to pass attributes to DOM elements inside the Password component.
     * @defaultValue undefined
     * @group Props
     */
    pPasswordPT = input<PasswordPassThrough | undefined>();
    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    pPasswordUnstyled = input<boolean | undefined>();
    /**
     * Text to prompt password entry. Defaults to Exhaustive I18N API configuration.
     * @group Props
     */
    promptLabel = input<string>('Enter a password');
    /**
     * Text for a weak password. Defaults to PrimeNG I18N API configuration.
     * @group Props
     */
    weakLabel = input<string>('Weak');
    /**
     * Text for a medium password. Defaults to Exhaustive I18N API configuration.
     * @group Props
     */
    mediumLabel = input<string>('Medium');
    /**
     * Text for a strong password. Defaults to Exhaustive I18N API configuration.
     * @group Props
     */
    strongLabel = input<string>('Strong');
    /**
     * Regex value for medium regex. When mediumRegex or strongRegex is set, the strength is graded with the regexes like the p-password component,
     * otherwise with a score based on the length and the character classes.
     * @defaultValue undefined
     * @group Props
     */
    mediumRegex = input<string | undefined>();
    /**
     * Regex value for strong regex. When mediumRegex or strongRegex is set, the strength is graded with the regexes like the p-password component,
     * otherwise with a score based on the length and the character classes.
     * @defaultValue undefined
     * @group Props
     */
    strongRegex = input<string | undefined>();
    /**
     * Whether to show the strength indicator or not.
     * @group Props
     */
    feedback = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Sets the visibility of the password field.
     * @defaultValue false
     * @type boolean
     * @group Props
     */
    showPassword = input<boolean | undefined>();
    /**
     * Specifies the input variant of the component.
     * @defaultValue 'outlined'
     * @group Props
     */
    variant = input<'filled' | 'outlined' | undefined>();
    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue false
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });
    /**
     * Specifies the size of the component.
     * @defaultValue undefined
     * @group Props
     */
    size = input<'large' | 'small' | undefined>(undefined, { alias: 'pSize' });

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    $variant = computed(() => this.variant() || this.config.inputVariant());

    readonly hasFluid = computed(() => this.fluid() ?? !!this.pcFluid);

    panel = signal<Nullable<HTMLDivElement>>(undefined);

    meter = signal<Nullable<HTMLDivElement>>(undefined);

    info = signal<Nullable<HTMLDivElement>>(undefined);

    content = signal<Nullable<HTMLDivElement>>(undefined);

    label = signal<Nullable<HTMLLabelElement>>(undefined);

    scrollHandler = signal<Nullable<ConnectedOverlayScrollHandler>>(undefined);

    documentResizeListener = signal<VoidListener>(undefined);

    _componentStyle = inject(PasswordStyle);

    constructor() {
        super();

        effect(() => {
            const pt = this.pPasswordPT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pPasswordUnstyled() && this.directiveUnstyled.set(this.pPasswordUnstyled());
        });

        effect(() => {
            const show = this.showPassword();
            if (show !== undefined) {
                untracked(() => (this.el.nativeElement.type = show ? 'text' : 'password'));
            }
        });

        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
    }

    @HostListener('input', ['$event'])
    onInput(e: Event) {
        this.writeModelValue(this.el.nativeElement.value);
    }

    createPanel() {
        if (isPlatformBrowser(this.platformId)) {
            const panel = this.renderer.createElement('div');
            this.renderer.addClass(panel, 'p-password-overlay');
            this.renderer.addClass(panel, 'p-component');
            this.panel.set(panel);

            const content = this.renderer.createElement('div');
            this.renderer.addClass(content, 'p-password-content');
            this.renderer.appendChild(panel, content);
            this.content.set(content);

            const meter = this.renderer.createElement('div');
            this.renderer.addClass(meter, 'p-password-meter');
            this.renderer.appendChild(content, meter);
            this.meter.set(meter);

            const label = this.renderer.createElement('div');
            this.renderer.addClass(label, 'p-password-meter-label');
            this.renderer.appendChild(meter, label);
            this.label.set(label);

            const info = this.renderer.createElement('div');
            this.renderer.addClass(info, 'p-password-meter-text');
            this.renderer.setProperty(info, 'textContent', this.promptLabel());
            this.renderer.appendChild(content, info);
            this.info.set(info);

            this.renderer.setStyle(panel, 'minWidth', `${this.el.nativeElement.offsetWidth}px`);
            this.renderer.appendChild(document.body, panel);
            this.updateMeter();
        }
    }

    showOverlay() {
        if (this.feedback()) {
            if (!this.panel()) {
                this.createPanel();
            }

            const panel = this.panel()!;
            this.renderer.setStyle(panel, 'zIndex', String(++DomHandler.zindex));
            this.renderer.setStyle(panel, 'display', 'block');
            this.zone.runOutsideAngular(() => {
                setTimeout(() => {
                    addClass(this.panel()!, 'p-connected-overlay-visible');
                    this.bindScrollListener();
                    this.bindDocumentResizeListener();
                }, 1);
            });
            absolutePosition(panel, this.el.nativeElement);
        }
    }

    hideOverlay() {
        const panel = this.panel();
        if (this.feedback() && panel) {
            addClass(panel, 'p-connected-overlay-hidden');
            removeClass(panel, 'p-connected-overlay-visible');
            this.unbindScrollListener();
            this.unbindDocumentResizeListener();

            this.zone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.onDestroy();
                }, 150);
            });
        }
    }

    @HostListener('focus')
    onFocus() {
        this.showOverlay();
    }

    @HostListener('blur')
    onBlur() {
        this.hideOverlay();
    }

    labelSignal = signal('');

    strength = signal<'weak' | 'medium' | 'strong' | null>(null);

    @HostListener('keyup', ['$event'])
    onKeyup(e: Event) {
        if (this.feedback()) {
            let value = (e.target as HTMLInputElement).value,
                label: string | null = null,
                meterPos: string | null = null;

            let strength: 'weak' | 'medium' | 'strong' | null = null;

            if (value.length === 0) {
                label = this.promptLabel();
                meterPos = '0px 0px';
            } else {
                var score = this.mediumRegex() || this.strongRegex() ? this.testRegexStrength(value) : this.testStrength(value);

                if (score < 30) {
                    label = this.weakLabel();
                    meterPos = '0px -10px';
                    strength = 'weak';
                } else if (score >= 30 && score < 80) {
                    label = this.mediumLabel();
                    meterPos = '0px -20px';
                    strength = 'medium';
                } else if (score >= 80) {
                    label = this.strongLabel();
                    meterPos = '0px -30px';
                    strength = 'strong';
                }
            }

            this.labelSignal.set(label!);
            this.strength.set(strength);
            this.updateMeter();

            const panel = this.panel();
            if (!panel || !hasClass(panel, 'p-connected-overlay-visible')) {
                this.showOverlay();
            }

            const meter = this.meter();
            if (meter) {
                this.renderer.setStyle(meter, 'backgroundPosition', meterPos);
            }

            const info = this.info();
            if (info) {
                info.textContent = label;
            }
        }
    }

    updateMeter() {
        const meterLabel = this.label();
        const info = this.info();
        if (this.labelSignal() && meterLabel && info) {
            // The strength comes from the score, not from the (possibly translated) label text,
            // and is drawn on the meter label like the p-password component does.
            const strength = this.strength();

            ['weak', 'medium', 'strong'].forEach((level) => this.renderer.removeClass(meterLabel, this.strengthClass(level)));
            if (strength) {
                this.renderer.addClass(meterLabel, this.strengthClass(strength));
                this.renderer.setStyle(meterLabel, 'width', this.getWidth(strength));
            } else {
                this.renderer.removeStyle(meterLabel, 'width');
            }
            info.textContent = this.labelSignal();
        }
    }

    getWidth(label: string) {
        return label === 'weak' ? '33.33%' : label === 'medium' ? '66.66%' : label === 'strong' ? '100%' : '';
    }

    strengthClass(label) {
        return `p-password-meter${label ? `-${label}` : ''}`;
    }

    testStrength(str: string) {
        let grade: number = 0;
        let val: Nullable<RegExpMatchArray>;

        val = str.match('[0-9]');
        grade += this.normalize(val ? val.length : 1 / 4, 1) * 25;

        val = str.match('[a-zA-Z]');
        grade += this.normalize(val ? val.length : 1 / 2, 3) * 10;

        val = str.match('[!@#$%^&*?_~.,;=]');
        grade += this.normalize(val ? val.length : 1 / 6, 1) * 35;

        val = str.match('[A-Z]');
        grade += this.normalize(val ? val.length : 1 / 6, 1) * 30;

        grade *= str.length / 8;

        return grade > 100 ? 100 : grade;
    }

    testRegexStrength(str: string) {
        if (new RegExp(this.strongRegex() || DEFAULT_STRONG_REGEX).test(str)) return 100;
        if (new RegExp(this.mediumRegex() || DEFAULT_MEDIUM_REGEX).test(str)) return 50;
        return 0;
    }

    normalize(x: number, y: number) {
        let diff = x - y;

        if (diff <= 0) return x / y;
        else return 1 + 0.5 * (x / (x + y / 4));
    }

    bindScrollListener() {
        if (!this.scrollHandler()) {
            this.scrollHandler.set(
                new ConnectedOverlayScrollHandler(this.el.nativeElement, () => {
                    if (hasClass(this.panel()!, 'p-connected-overlay-visible')) {
                        this.hideOverlay();
                    }
                })
            );
        }

        this.scrollHandler()!.bindScrollListener();
    }

    unbindScrollListener() {
        const scrollHandler = this.scrollHandler();
        if (scrollHandler) {
            scrollHandler.unbindScrollListener();
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

    onWindowResize() {
        if (!isTouchDevice()) {
            this.hideOverlay();
        }
    }

    onDestroy() {
        const panel = this.panel();
        if (panel) {
            const scrollHandler = this.scrollHandler();
            if (scrollHandler) {
                scrollHandler.destroy();
                this.scrollHandler.set(null);
            }

            this.unbindDocumentResizeListener();

            this.renderer.removeChild(this.document.body, panel);
            this.panel.set(null);
            this.meter.set(null);
            this.info.set(null);
        }
    }
}

export const PASSWORD_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Password),
    multi: true
};
/**
 * Password displays strength indicator for password fields.
 * @group Components
 */
@Component({
    selector: 'p-password',
    imports: [CommonModule, InputText, AutoFocus, TimesIcon, EyeSlashIcon, EyeIcon, Overlay, SharedModule, BindModule],
    template: `
        <input
            #input
            [attr.label]="label()"
            [attr.aria-label]="ariaLabel()"
            [attr.aria-labelledBy]="ariaLabelledBy()"
            [attr.id]="inputId()"
            [attr.tabindex]="tabindex()"
            pInputText
            [pSize]="size()"
            [ngStyle]="inputStyle()"
            [class]="cn(cx('pcInputText'), inputStyleClass())"
            [attr.type]="unmasked() ? 'text' : 'password'"
            [attr.placeholder]="placeholder()"
            [attr.autocomplete]="autocomplete()"
            [value]="value()"
            [variant]="$variant()"
            [attr.name]="name()"
            [attr.maxlength]="maxlength()"
            [attr.minlength]="minlength()"
            [attr.required]="required() ? '' : undefined"
            [attr.disabled]="$disabled() ? '' : undefined"
            [attr.readonly]="readonly() ? '' : undefined"
            [invalid]="$invalid()"
            (input)="onInput($event)"
            (focus)="onInputFocus($event)"
            (blur)="onInputBlur($event)"
            (keyup)="onKeyUp($event)"
            [pAutoFocus]="autofocus()"
            [pt]="ptm('pcInputText')"
            [unstyled]="unstyled()"
        />
        @if (showClear() && value() != null && !readonly()) {
            @if (!clearIconTemplate() && !_clearIconTemplate()) {
                <svg data-p-icon="times" [class]="cx('clearIcon')" (click)="clear()" [pBind]="ptm('clearIcon')" />
            }
            <span (click)="clear()" [class]="cx('clearIcon')" [pBind]="ptm('clearIcon')">
                <ng-template *ngTemplateOutlet="clearIconTemplate() || _clearIconTemplate()"></ng-template>
            </span>
        }

        @if (toggleMask()) {
            @if (unmasked()) {
                @if (!hideIconTemplate() && !_hideIconTemplate()) {
                    <svg
                        data-p-icon="eyeslash"
                        [class]="cx('maskIcon')"
                        [pBind]="ptm('maskIcon')"
                        (click)="onMaskToggle()"
                        tabindex="0"
                        role="button"
                        [attr.aria-label]="maskToggleAriaLabel()"
                        (keydown.enter)="onMaskToggleKeydown($event)"
                        (keydown.space)="onMaskToggleKeydown($event)"
                    />
                }
                @if (hideIconTemplate() || _hideIconTemplate()) {
                    <span (click)="onMaskToggle()" tabindex="0" role="button" [attr.aria-label]="maskToggleAriaLabel()" (keydown.enter)="onMaskToggleKeydown($event)" (keydown.space)="onMaskToggleKeydown($event)" [pBind]="ptm('maskIcon')">
                        <ng-template *ngTemplateOutlet="hideIconTemplate() || _hideIconTemplate(); context: { class: cx('maskIcon') }"></ng-template>
                    </span>
                }
            }
            @if (!unmasked()) {
                @if (!showIconTemplate() && !_showIconTemplate()) {
                    <svg
                        data-p-icon="eye"
                        [class]="cx('unmaskIcon')"
                        [pBind]="ptm('unmaskIcon')"
                        (click)="onMaskToggle()"
                        tabindex="0"
                        role="button"
                        [attr.aria-label]="maskToggleAriaLabel()"
                        (keydown.enter)="onMaskToggleKeydown($event)"
                        (keydown.space)="onMaskToggleKeydown($event)"
                    />
                }
                @if (showIconTemplate() || _showIconTemplate()) {
                    <span (click)="onMaskToggle()" tabindex="0" role="button" [attr.aria-label]="maskToggleAriaLabel()" (keydown.enter)="onMaskToggleKeydown($event)" (keydown.space)="onMaskToggleKeydown($event)" [pBind]="ptm('unmaskIcon')">
                        <ng-template *ngTemplateOutlet="showIconTemplate() || _showIconTemplate(); context: { class: cx('unmaskIcon') }"></ng-template>
                    </span>
                }
            }
        }

        <p-overlay #overlay [hostAttrSelector]="$attrSelector" [(visible)]="overlayVisible" [options]="overlayOptions()" [target]="'@parent'" [appendTo]="$appendTo()" [unstyled]="unstyled()" [pt]="ptm('pcOverlay')" [motionOptions]="motionOptions()">
            <ng-template #content>
                <div [class]="cx('overlay')" [style]="sx('overlay')" (click)="onOverlayClick($event)" [pBind]="ptm('overlay')" [attr.data-p]="overlayDataP()">
                    <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate()"></ng-container>
                    @if (contentTemplate() || _contentTemplate()) {
                        <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate()"></ng-container>
                    } @else {
                        <div [class]="cx('content')" [pBind]="ptm('content')">
                            <div [class]="cx('meter')" [pBind]="ptm('meter')">
                                <div [class]="cx('meterLabel')" [ngStyle]="{ width: meter()?.width ?? '' }" [pBind]="ptm('meterLabel')" [attr.data-p]="meterDataP()"></div>
                            </div>
                            <div [class]="cx('meterText')" [pBind]="ptm('meterText')">{{ infoText() }}</div>
                        </div>
                    }
                    <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate()"></ng-container>
                </div>
            </ng-template>
        </p-overlay>
    `,
    providers: [PASSWORD_VALUE_ACCESSOR, PasswordStyle, { provide: PASSWORD_INSTANCE, useExisting: Password }, { provide: PARENT_INSTANCE, useExisting: Password }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[style]': "sx('root')",
        '[attr.data-p]': 'containerDataP()'
    },
    hostDirectives: [Bind]
})
export class Password extends BaseInput<PasswordPassThrough> {
    componentName = 'Password';

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcPassword: Password | undefined = inject(PASSWORD_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
    }

    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    ariaLabel = input<string | undefined>();
    /**
     * Specifies one or more IDs in the DOM that labels the input field.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>();
    /**
     * Label of the input for accessibility.
     * @group Props
     */
    label = input<string | undefined>();
    /**
     * Text to prompt password entry. Defaults to Exhaustive I18N API configuration.
     * @group Props
     */
    promptLabel = input<string | undefined>();
    /**
     * Regex value for medium regex.
     * @group Props
     */
    mediumRegex = input<string>(DEFAULT_MEDIUM_REGEX);
    /**
     * Regex value for strong regex.
     * @group Props
     */
    strongRegex = input<string>(DEFAULT_STRONG_REGEX);
    /**
     * Text for a weak password. Defaults to Exhaustive I18N API configuration.
     * @group Props
     */
    weakLabel = input<string | undefined>();
    /**
     * Text for a medium password. Defaults to Exhaustive I18N API configuration.
     * @group Props
     */
    mediumLabel = input<string | undefined>();
    /**
     * Text for a strong password. Defaults to Exhaustive I18N API configuration.
     * @group Props
     */
    strongLabel = input<string | undefined>();
    /**
     * Identifier of the accessible input element.
     * @group Props
     */
    inputId = input<string | undefined>();
    /**
     * Whether to show the strength indicator or not.
     * @group Props
     */
    feedback = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * When present, it specifies that an input field is read-only.
     * @group Props
     */
    readonly = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether to show an icon to display the password as plain text.
     * @group Props
     */
    toggleMask = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Style class of the input field.
     * @group Props
     */
    inputStyleClass = input<string | undefined>();
    /**
     * Inline style of the input field.
     * @group Props
     */
    inputStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Specify automated assistance in filling out password by browser.
     * @group Props
     */
    autocomplete = input<string | undefined>();
    /**
     * Advisory information to display on input.
     * @group Props
     */
    placeholder = input<string | undefined>();
    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    showClear = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>('self');
    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);
    /**
     * Whether to use overlay API feature. The properties of overlay API can be used like an object in it.
     * @group Props
     */
    overlayOptions = input<OverlayOptions | undefined>();
    /**
     * Callback to invoke when the component receives focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onFocus = output<Event>();
    /**
     * Callback to invoke when the component loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onBlur = output<Event>();
    /**
     * Callback to invoke when clear button is clicked.
     * @group Emits
     */
    readonly onClear = output<any>();

    readonly input = viewChild.required<ElementRef>('input');

    /**
     * Custom template of content.
     * @group Templates
     */
    readonly contentTemplate = contentChild<Nullable<TemplateRef<void>>>('content', { descendants: false });

    /**
     * Custom template of footer.
     * @group Templates
     */
    readonly footerTemplate = contentChild<Nullable<TemplateRef<void>>>('footer', { descendants: false });

    /**
     * Custom template of header.
     * @group Templates
     */
    readonly headerTemplate = contentChild<Nullable<TemplateRef<void>>>('header', { descendants: false });

    /**
     * Custom template of clear icon.
     * @group Templates
     */
    readonly clearIconTemplate = contentChild<Nullable<TemplateRef<void>>>('clearicon', { descendants: false });

    /**
     * Custom template of hide icon.
     * @param {PasswordIconTemplateContext} context - icon context.
     * @see {@link PasswordIconTemplateContext}
     * @group Templates
     */
    readonly hideIconTemplate = contentChild<Nullable<TemplateRef<PasswordIconTemplateContext>>>('hideicon', { descendants: false });

    /**
     * Custom template of show icon.
     * @param {PasswordIconTemplateContext} context - icon context.
     * @see {@link PasswordIconTemplateContext}
     * @group Templates
     */
    readonly showIconTemplate = contentChild<Nullable<TemplateRef<PasswordIconTemplateContext>>>('showicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    readonly _contentTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => !['header', 'footer', 'clearicon', 'hideicon', 'showicon'].includes(item.getType()))
                .at(-1)?.template
    );

    readonly _footerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    readonly _headerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    readonly _clearIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'clearicon')
                .at(-1)?.template
    );

    readonly _hideIconTemplate = computed<TemplateRef<PasswordIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'hideicon')
                .at(-1)?.template
    );

    readonly _showIconTemplate = computed<TemplateRef<PasswordIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'showicon')
                .at(-1)?.template
    );

    overlayVisible = signal<boolean>(false);

    meter = signal<Nullable<Meter>>(undefined);

    infoText = signal<Nullable<string>>(undefined);

    focused = signal<boolean>(false);

    unmasked = signal<boolean>(false);

    mediumCheckRegExp = computed(() => new RegExp(this.mediumRegex()));

    strongCheckRegExp = computed(() => new RegExp(this.strongRegex()));

    value = signal<Nullable<string>>(null);

    translationSubscription = signal<Nullable<Subscription>>(undefined);

    _componentStyle = inject(PasswordStyle);

    overlayService = inject(OverlayService);

    onInit() {
        this.infoText.set(this.promptText());
        this.translationSubscription.set(
            this.config.translationObserver.subscribe(() => {
                this.updateUI(this.value() || '');
            })
        );
    }

    onInput(event: Event) {
        this.value.set((event.target as HTMLInputElement).value);
        this.onModelChange(this.value());
    }

    onInputFocus(event: Event) {
        this.focused.set(true);
        if (this.feedback()) {
            this.overlayVisible.set(true);
        }

        this.onFocus.emit(event);
    }

    onInputBlur(event: Event) {
        this.focused.set(false);
        if (this.feedback()) {
            this.overlayVisible.set(false);
        }

        this.onModelTouched();
        this.onBlur.emit(event);
    }

    onKeyUp(event: KeyboardEvent) {
        if (this.feedback()) {
            let value = (event.target as HTMLInputElement).value;
            this.updateUI(value);

            if (event.code === 'Escape') {
                this.overlayVisible() && this.overlayVisible.set(false);

                return;
            }

            if (!this.overlayVisible()) {
                this.overlayVisible.set(true);
            }
        }
    }

    updateUI(value: string) {
        let label = null;
        let meter: { strength: string; width: string } | null = null;

        switch (this.testStrength(value)) {
            case 1:
                label = this.weakText();
                meter = {
                    strength: 'weak',
                    width: '33.33%'
                };
                break;

            case 2:
                label = this.mediumText();
                meter = {
                    strength: 'medium',
                    width: '66.66%'
                };
                break;

            case 3:
                label = this.strongText();
                meter = {
                    strength: 'strong',
                    width: '100%'
                };
                break;

            default:
                label = this.promptText();
                meter = null;
                break;
        }

        this.meter.set(meter);
        this.infoText.set(label);
    }

    onMaskToggle() {
        this.unmasked.update((unmasked) => !unmasked);
    }

    onMaskToggleKeydown(event: Event) {
        event.preventDefault();
        this.onMaskToggle();
    }

    maskToggleAriaLabel() {
        const aria = this.config.translation.aria as Record<string, string | undefined> | undefined;
        return this.unmasked() ? (aria?.['passwordHide'] ?? 'Hide Password') : (aria?.['passwordShow'] ?? 'Show Password');
    }

    onOverlayClick(event: Event) {
        this.overlayService.add({
            originalEvent: event,
            target: this.el.nativeElement
        });
    }

    testStrength(str: string) {
        let level = 0;

        if (this.strongCheckRegExp().test(str)) level = 3;
        else if (this.mediumCheckRegExp().test(str)) level = 2;
        else if (str.length) level = 1;

        return level;
    }

    promptText() {
        return this.promptLabel() || this.getTranslation(TranslationKeys.PASSWORD_PROMPT);
    }

    weakText() {
        return this.weakLabel() || this.getTranslation(TranslationKeys.WEAK);
    }

    mediumText() {
        return this.mediumLabel() || this.getTranslation(TranslationKeys.MEDIUM);
    }

    strongText() {
        return this.strongLabel() || this.getTranslation(TranslationKeys.STRONG);
    }

    getTranslation(option: string) {
        return this.config.getTranslation(option);
    }

    clear() {
        this.value.set(null);
        this.onModelChange(this.value());
        this.writeValue(this.value());
        this.onClear.emit(undefined);
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        if (value === undefined) this.value.set(null);
        else this.value.set(value);

        if (this.feedback()) this.updateUI(this.value() || '');
        setModelValue(this.value());
    }

    onDestroy() {
        const translationSubscription = this.translationSubscription();
        if (translationSubscription) {
            translationSubscription.unsubscribe();
        }
    }

    containerDataP = computed(() =>
        this.cn({
            fluid: this.hasFluid
        })
    );

    meterDataP = computed(() =>
        this.cn({
            [this.meter()?.strength as string]: this.meter()?.strength
        })
    );

    overlayDataP = computed(() =>
        this.cn({
            ['overlay-' + this.$appendTo()]: 'overlay-' + this.$appendTo()
        })
    );
}

@NgModule({
    imports: [Password, PasswordDirective, SharedModule, BindModule],
    exports: [PasswordDirective, Password, SharedModule, BindModule]
})
export class PasswordModule {}
