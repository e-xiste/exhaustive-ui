import { CommonModule } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    forwardRef,
    inject,
    InjectionToken,
    Injector,
    input,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    ViewEncapsulation,
    contentChild,
    contentChildren,
    viewChild,
    output
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { getSelection } from '@exhaustive-ui/utils';
import { PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { AutoFocus } from '@exhaustive-ui/core/autofocus';
import { PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseInput } from '@exhaustive-ui/core/baseinput';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { AngleDownIcon, AngleUpIcon, TimesIcon } from '@exhaustive-ui/core/icons';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { Nullable } from '@exhaustive-ui/core/ts-helpers';
import type { InputNumberInputEvent, InputNumberPassThrough } from '@exhaustive-ui/core/types/inputnumber';
import { InputNumberStyle } from './style/inputnumberstyle';

const INPUTNUMBER_INSTANCE = new InjectionToken<InputNumber>('INPUTNUMBER_INSTANCE');

export const INPUTNUMBER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputNumber),
    multi: true
};
/**
 * InputNumber is an input component to provide numerical input.
 * @group Components
 */
@Component({
    selector: 'p-inputNumber, p-inputnumber, p-input-number',
    imports: [CommonModule, InputText, AutoFocus, TimesIcon, AngleUpIcon, AngleDownIcon, SharedModule, BindModule],
    template: `
        <input
            pInputText
            #input
            [attr.id]="inputId()"
            role="spinbutton"
            [class]="cn(cx('pcInputText'), inputStyleClass())"
            [value]="formattedValue()"
            [ngStyle]="inputStyle()"
            [variant]="$variant()"
            [invalid]="invalid()"
            [attr.aria-valuemin]="min()"
            [attr.aria-valuemax]="max()"
            [attr.aria-valuenow]="value()"
            [attr.placeholder]="placeholder()"
            [attr.aria-label]="ariaLabel()"
            [attr.aria-labelledby]="ariaLabelledBy()"
            [attr.aria-describedby]="ariaDescribedBy()"
            [attr.title]="title()"
            [pSize]="size()"
            [attr.size]="inputSize()"
            [attr.name]="name()"
            [attr.autocomplete]="autocomplete()"
            [attr.maxlength]="maxlength()"
            [attr.minlength]="minlength()"
            [attr.tabindex]="tabindex()"
            [attr.aria-required]="ariaRequired()"
            [attr.step]="step() ?? 1"
            [attr.required]="required() ? '' : undefined"
            [attr.readonly]="readonly() ? '' : undefined"
            [attr.disabled]="$disabled() ? '' : undefined"
            inputmode="decimal"
            (input)="onUserInput($event)"
            (keydown)="onInputKeyDown($event)"
            (keypress)="onInputKeyPress($event)"
            (paste)="onPaste($event)"
            (click)="onInputClick()"
            (focus)="onInputFocus($event)"
            (blur)="onInputBlur($event)"
            [pt]="ptm('pcInputText')"
            [unstyled]="unstyled()"
            [pAutoFocus]="autofocus()"
            [fluid]="hasFluid"
            [attr.data-p]="dataP()"
        />
        @if (buttonLayout() != 'vertical' && showClear() && value()) {
            @if (!clearIconTemplate() && !_clearIconTemplate()) {
                <svg data-p-icon="times" [pBind]="ptm('clearIcon')" [class]="cx('clearIcon')" (click)="clear()" />
            }
            @if (clearIconTemplate() || _clearIconTemplate()) {
                <span [pBind]="ptm('clearIcon')" (click)="clear()" [class]="cx('clearIcon')">
                    <ng-template *ngTemplateOutlet="clearIconTemplate() || _clearIconTemplate()"></ng-template>
                </span>
            }
        }
        @if (showButtons() && buttonLayout() === 'stacked') {
            <span [pBind]="ptm('buttonGroup')" [class]="cx('buttonGroup')" [attr.data-p]="dataP()">
                <button
                    type="button"
                    [pBind]="ptm('incrementButton')"
                    [class]="cn(cx('incrementButton'), incrementButtonClass())"
                    [attr.disabled]="$disabled() ? '' : undefined"
                    tabindex="-1"
                    (mousedown)="onUpButtonMouseDown($event)"
                    (mouseup)="onUpButtonMouseUp()"
                    (mouseleave)="onUpButtonMouseLeave()"
                    (keydown)="onUpButtonKeyDown($event)"
                    (keyup)="onUpButtonKeyUp()"
                    [attr.aria-hidden]="true"
                    [attr.data-p]="dataP()"
                >
                    @if (incrementButtonIcon()) {
                        <span [pBind]="ptm('incrementButtonIcon')" [ngClass]="incrementButtonIcon()"></span>
                    }
                    @if (!incrementButtonIcon()) {
                        @if (!incrementButtonIconTemplate() && !_incrementButtonIconTemplate()) {
                            <svg data-p-icon="angle-up" [pBind]="ptm('incrementButtonIcon')" />
                        }
                        <ng-template *ngTemplateOutlet="incrementButtonIconTemplate() || _incrementButtonIconTemplate()"></ng-template>
                    }
                </button>
                <button
                    type="button"
                    [pBind]="ptm('decrementButton')"
                    [class]="cn(cx('decrementButton'), decrementButtonClass())"
                    [attr.disabled]="$disabled() ? '' : undefined"
                    tabindex="-1"
                    [attr.aria-hidden]="true"
                    (mousedown)="onDownButtonMouseDown($event)"
                    (mouseup)="onDownButtonMouseUp()"
                    (mouseleave)="onDownButtonMouseLeave()"
                    (keydown)="onDownButtonKeyDown($event)"
                    (keyup)="onDownButtonKeyUp()"
                    [attr.data-p]="dataP()"
                >
                    @if (decrementButtonIcon()) {
                        <span [pBind]="ptm('decrementButtonIcon')" [ngClass]="decrementButtonIcon()"></span>
                    }
                    @if (!decrementButtonIcon()) {
                        @if (!decrementButtonIconTemplate() && !_decrementButtonIconTemplate()) {
                            <svg data-p-icon="angle-down" [pBind]="ptm('decrementButtonIcon')" />
                        }
                        <ng-template *ngTemplateOutlet="decrementButtonIconTemplate() || _decrementButtonIconTemplate()"></ng-template>
                    }
                </button>
            </span>
        }
        @if (showButtons() && buttonLayout() !== 'stacked') {
            <button
                type="button"
                [pBind]="ptm('incrementButton')"
                [class]="cn(cx('incrementButton'), incrementButtonClass())"
                [attr.disabled]="$disabled() ? '' : undefined"
                tabindex="-1"
                [attr.aria-hidden]="true"
                (mousedown)="onUpButtonMouseDown($event)"
                (mouseup)="onUpButtonMouseUp()"
                (mouseleave)="onUpButtonMouseLeave()"
                (keydown)="onUpButtonKeyDown($event)"
                (keyup)="onUpButtonKeyUp()"
                [attr.data-p]="dataP()"
            >
                @if (incrementButtonIcon()) {
                    <span [pBind]="ptm('incrementButtonIcon')" [ngClass]="incrementButtonIcon()"></span>
                }
                @if (!incrementButtonIcon()) {
                    @if (!incrementButtonIconTemplate() && !_incrementButtonIconTemplate()) {
                        <svg data-p-icon="angle-up" [pBind]="ptm('incrementButtonIcon')" />
                    }
                    <ng-template *ngTemplateOutlet="incrementButtonIconTemplate() || _incrementButtonIconTemplate()"></ng-template>
                }
            </button>
        }
        @if (showButtons() && buttonLayout() !== 'stacked') {
            <button
                type="button"
                [pBind]="ptm('decrementButton')"
                [class]="cn(cx('decrementButton'), decrementButtonClass())"
                [attr.disabled]="$disabled() ? '' : undefined"
                tabindex="-1"
                [attr.aria-hidden]="true"
                (mousedown)="onDownButtonMouseDown($event)"
                (mouseup)="onDownButtonMouseUp()"
                (mouseleave)="onDownButtonMouseLeave()"
                (keydown)="onDownButtonKeyDown($event)"
                (keyup)="onDownButtonKeyUp()"
                [attr.data-p]="dataP()"
            >
                @if (decrementButtonIcon()) {
                    <span [pBind]="ptm('decrementButtonIcon')" [ngClass]="decrementButtonIcon()"></span>
                }
                @if (!decrementButtonIcon()) {
                    @if (!decrementButtonIconTemplate() && !_decrementButtonIconTemplate()) {
                        <svg data-p-icon="angle-down" [pBind]="ptm('decrementButtonIcon')" />
                    }
                    <ng-template *ngTemplateOutlet="decrementButtonIconTemplate() || _decrementButtonIconTemplate()"></ng-template>
                }
            </button>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [INPUTNUMBER_VALUE_ACCESSOR, InputNumberStyle, { provide: INPUTNUMBER_INSTANCE, useExisting: InputNumber }, { provide: PARENT_INSTANCE, useExisting: InputNumber }],
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class InputNumber extends BaseInput<InputNumberPassThrough> {
    readonly injector = inject(Injector);

    componentName = 'InputNumber';

    $pcInputNumber: InputNumber | undefined = inject(INPUTNUMBER_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    _componentStyle = inject(InputNumberStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
    }

    /**
     * Displays spinner buttons.
     * @group Props
     */
    showButtons = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether to format the value.
     * @group Props
     */
    format = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Layout of the buttons, valid values are "stacked" (default), "horizontal" and "vertical".
     * @group Props
     */
    buttonLayout = input<string>('stacked');
    /**
     * Identifier of the focus input to match a label defined for the component.
     * @group Props
     */
    inputId = input<string | undefined>();
    /**
     * Advisory information to display on input.
     * @group Props
     */
    placeholder = input<string | undefined>();
    /**
     * Specifies tab order of the element.
     * @group Props
     */
    tabindex = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Title text of the input text.
     * @group Props
     */
    title = input<string | undefined>();
    /**
     * Specifies one or more IDs in the DOM that labels the input field.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>();
    /**
     * Specifies one or more IDs in the DOM that describes the input field.
     * @group Props
     */
    ariaDescribedBy = input<string | undefined>();
    /**
     * Used to define a string that labels the input element.
     * @group Props
     */
    ariaLabel = input<string | undefined>();
    /**
     * Used to indicate that user input is required on an element before a form can be submitted.
     * @group Props
     */
    ariaRequired = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    autocomplete = input<string | undefined>();
    /**
     * Style class of the increment button.
     * @group Props
     */
    incrementButtonClass = input<string | undefined>();
    /**
     * Style class of the decrement button.
     * @group Props
     */
    decrementButtonClass = input<string | undefined>();
    /**
     * Style class of the increment button.
     * @group Props
     */
    incrementButtonIcon = input<string | undefined>();
    /**
     * Style class of the decrement button.
     * @group Props
     */
    decrementButtonIcon = input<string | undefined>();
    /**
     * When present, it specifies that an input field is read-only.
     * @group Props
     */
    readonly = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Determines whether the input field is empty.
     * @group Props
     */
    allowEmpty = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Locale to be used in formatting.
     * @group Props
     */
    locale = input<string | undefined>();
    /**
     * The locale matching algorithm to use. Possible values are "lookup" and "best fit"; the default is "best fit". See Locale Negotiation for details.
     * @group Props
     */
    localeMatcher = input<any>();
    /**
     * Defines the behavior of the component, valid values are "decimal" and "currency".
     * @group Props
     */
    mode = input<string | any>('decimal');
    /**
     * The currency to use in currency formatting. Possible values are the ISO 4217 currency codes, such as "USD" for the US dollar, "EUR" for the euro, or "CNY" for the Chinese RMB. There is no default value; if the style is "currency", the currency property must be provided.
     * @group Props
     */
    currency = input<string | undefined>();
    /**
     * How to display the currency in currency formatting. Possible values are "symbol" to use a localized currency symbol such as €, ü"code" to use the ISO currency code, "name" to use a localized currency name such as "dollar"; the default is "symbol".
     * @group Props
     */
    currencyDisplay = input<string | undefined | any>();
    /**
     * Whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators.
     * @group Props
     */
    useGrouping = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * The minimum number of fraction digits to use. Possible values are from 0 to 20; the default for plain number and percent formatting is 0; the default for currency formatting is the number of minor unit digits provided by the ISO 4217 currency code list (2 if the list doesn't provide that information).
     * @group Props
     */
    minFractionDigits = input<number | undefined, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });
    /**
     * The maximum number of fraction digits to use. Possible values are from 0 to 20; the default for plain number formatting is the larger of minimumFractionDigits and 3; the default for currency formatting is the larger of minimumFractionDigits and the number of minor unit digits provided by the ISO 4217 currency code list (2 if the list doesn't provide that information).
     * @group Props
     */
    maxFractionDigits = input<number | undefined, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });
    /**
     * Text to display before the value.
     * @group Props
     */
    prefix = input<string | undefined>();
    /**
     * Text to display after the value.
     * @group Props
     */
    suffix = input<string | undefined>();
    /**
     * Inline style of the input field.
     * @group Props
     */
    inputStyle = input<any>();
    /**
     * Style class of the input field.
     * @group Props
     */
    inputStyleClass = input<string | undefined>();
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
     * Callback to invoke on input.
     * @param {InputNumberInputEvent} event - Custom input event.
     * @group Emits
     */
    readonly onInput = output<InputNumberInputEvent>();
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
     * Callback to invoke on input key press.
     * @param {KeyboardEvent} event - Keyboard event.
     * @group Emits
     */
    readonly onKeyDown = output<KeyboardEvent>();
    /**
     * Callback to invoke when clear token is clicked.
     * @group Emits
     */
    readonly onClear = output<void>();

    /**
     * Custom clear icon template.
     * @group Templates
     */
    readonly clearIconTemplate = contentChild<Nullable<TemplateRef<void>>>('clearicon', { descendants: false });
    /**
     * Custom increment button icon template.
     * @group Templates
     */
    readonly incrementButtonIconTemplate = contentChild<Nullable<TemplateRef<void>>>('incrementbuttonicon', { descendants: false });

    /**
     * Custom decrement button icon template.
     * @group Templates
     */
    readonly decrementButtonIconTemplate = contentChild<Nullable<TemplateRef<void>>>('decrementbuttonicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

    readonly _clearIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'clearicon')
                .at(-1)?.template
    );

    readonly _incrementButtonIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'incrementbuttonicon')
                .at(-1)?.template
    );

    readonly _decrementButtonIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'decrementbuttonicon')
                .at(-1)?.template
    );

    value = signal<Nullable<number>>(undefined);

    focused = signal<Nullable<boolean>>(undefined);

    groupChar = computed<string>(() => new Intl.NumberFormat(this.locale(), { useGrouping: true }).format(1000000).trim().replace(this._numeral(), '').charAt(0));

    prefixChar = computed<string>(() => {
        if (this.prefix()) {
            return this.prefix() as string;
        }

        const formatter = new Intl.NumberFormat(this.locale(), {
            style: this.mode(),
            currency: this.currency(),
            currencyDisplay: this.currencyDisplay()
        });
        return formatter.format(1).split('1')[0];
    });

    suffixChar = computed<string>(() => {
        if (this.suffix()) {
            return this.suffix() as string;
        }

        const formatter = new Intl.NumberFormat(this.locale(), {
            style: this.mode(),
            currency: this.currency(),
            currencyDisplay: this.currencyDisplay(),
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        return formatter.format(1).split('1')[1];
    });

    isSpecialChar = signal<Nullable<boolean>>(undefined);

    timer = signal<any>(undefined);

    lastValue = signal<Nullable<string>>(undefined);

    blurChangePending = signal<boolean>(false);

    pasted = signal<Nullable<{ value: string; selectionStart: number | null; selectionEnd: number | null; data: string }>>(null);

    _numeral = computed<RegExp>(() => {
        const numerals = [...new Intl.NumberFormat(this.locale(), { useGrouping: false }).format(9876543210)].reverse();
        return new RegExp(`[${numerals.join('')}]`, 'g');
    });

    numberFormat = computed<any>(() => {
        const options = this.getOptions();
        // Remove any properties with undefined or invalid values to let Intl.NumberFormat use defaults
        const cleanOptions = Object.fromEntries(Object.entries(options).filter(([_key, value]) => value !== undefined));
        return new Intl.NumberFormat(this.locale(), cleanOptions);
    });

    _decimal = computed<RegExp>(() => this.getDecimalExpression());

    _decimalChar = computed<string>(() => this.getDecimalChar());

    _group = computed<RegExp>(() => this.getGroupingExpression());

    _minusSign = computed<RegExp>(() => this.getMinusSignExpression());

    _currency = computed<RegExp>(() => this.getCurrencyExpression());

    _prefix = computed<RegExp>(() => this.getPrefixExpression());

    _suffix = computed<RegExp>(() => this.getSuffixExpression());

    _index = computed<(d: any) => number | undefined>(() => {
        const numerals = [...new Intl.NumberFormat(this.locale(), { useGrouping: false }).format(9876543210)].reverse();
        const index = new Map(numerals.map((d, i) => [d, i]));
        return (d: any) => index.get(d);
    });

    private ngControl = signal<NgControl | null>(null);

    onInit() {
        this.ngControl.set(this.injector.get(NgControl, null, { optional: true }));
    }

    getOptions = computed(() => {
        // Validate fraction digits according to Intl.NumberFormat specifications
        // Handle potential NaN, Infinity, or invalid values
        const validateFractionDigits = (value: number | undefined, min: number, max: number) => {
            if (value == null || isNaN(value) || !isFinite(value)) {
                return undefined;
            }
            return Math.max(min, Math.min(max, Math.floor(value)));
        };

        const minFractionDigits = validateFractionDigits(this.minFractionDigits(), 0, 20);
        const maxFractionDigits = validateFractionDigits(this.maxFractionDigits(), 0, 100);

        // Ensure minFractionDigits <= maxFractionDigits
        const validatedMinFractionDigits = minFractionDigits != null && maxFractionDigits != null && minFractionDigits > maxFractionDigits ? maxFractionDigits : minFractionDigits;

        return {
            localeMatcher: this.localeMatcher(),
            style: this.mode(),
            currency: this.currency(),
            currencyDisplay: this.currencyDisplay(),
            useGrouping: this.useGrouping(),
            minimumFractionDigits: validatedMinFractionDigits,
            maximumFractionDigits: maxFractionDigits
        };
    });

    escapeRegExp(text: string): string {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

    getDecimalExpression(): RegExp {
        const decimalChar = this.getDecimalChar();
        return new RegExp(`[${decimalChar}]`, 'g');
    }
    getDecimalChar(): string {
        const formatter = new Intl.NumberFormat(this.locale(), { ...this.getOptions(), useGrouping: false });
        return formatter
            .format(1.1)
            .replace(this._currency() as RegExp | string, '')
            .trim()
            .replace(this._numeral(), '');
    }

    getGroupingExpression(): RegExp {
        return new RegExp(`[${this.groupChar()}]`, 'g');
    }

    getMinusSignExpression(): RegExp {
        const formatter = new Intl.NumberFormat(this.locale(), { useGrouping: false });
        return new RegExp(`[${formatter.format(-1).trim().replace(this._numeral(), '')}]`, 'g');
    }

    getCurrencyExpression(): RegExp {
        if (this.currency()) {
            const formatter = new Intl.NumberFormat(this.locale(), {
                style: 'currency',
                currency: this.currency(),
                currencyDisplay: this.currencyDisplay(),
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            return new RegExp(`[${formatter.format(1).replace(/\s/g, '').replace(this._numeral(), '').replace(this._group(), '')}]`, 'g');
        }

        return new RegExp(`[]`, 'g');
    }

    getPrefixExpression(): RegExp {
        return new RegExp(`${this.escapeRegExp(this.prefixChar() || '')}`, 'g');
    }

    getSuffixExpression(): RegExp {
        return new RegExp(`${this.escapeRegExp(this.suffixChar() || '')}`, 'g');
    }

    formatValue(value: any) {
        if (value != null) {
            if (value === '-') {
                // Minus sign
                return value;
            }

            if (this.format()) {
                let formatter = new Intl.NumberFormat(this.locale(), this.getOptions());
                let formattedValue = formatter.format(value);

                if (this.prefix() && value != this.prefix()) {
                    formattedValue = this.prefix() + formattedValue;
                }

                if (this.suffix() && value != this.suffix()) {
                    formattedValue = formattedValue + this.suffix();
                }

                return formattedValue;
            }

            return value.toString();
        }

        return '';
    }

    parseValue(text: any) {
        const suffixRegex = this._suffix() ? new RegExp(this._suffix(), '') : /(?:)/;
        const prefixRegex = this._prefix() ? new RegExp(this._prefix(), '') : /(?:)/;
        const currencyRegex = this._currency() ? new RegExp(this._currency() as RegExp | string, '') : /(?:)/;

        let filteredText = text
            .replace(suffixRegex, '')
            .replace(prefixRegex, '')
            .trim()
            .replace(/\s/g, '')
            .replace(currencyRegex, '')
            .replace(this._group(), '')
            .replace(this._minusSign(), '-')
            .replace(this._decimal(), '.')
            .replace(this._numeral(), this._index());

        if (filteredText) {
            if (filteredText === '-')
                // Minus sign
                return filteredText;

            let parsedValue = +filteredText;
            return isNaN(parsedValue) ? null : parsedValue;
        }

        return null;
    }

    repeat(event: Event, interval: number | null, dir: number) {
        if (this.readonly()) {
            return;
        }

        let i = interval || 500;

        this.clearTimer();
        this.timer.set(
            setTimeout(() => {
                this.repeat(event, 40, dir);
            }, i)
        );

        this.spin(event, dir);
    }

    spin(event: Event, dir: number) {
        let step = (this.step() ?? 1) * dir;
        let currentValue = this.parseValue(this.input().nativeElement.value) || 0;
        let sum: number | string = (currentValue as number) + step;
        if (typeof sum === 'number') {
            // round the sum to the decimals of its operands: 0.2 + 0.1 must give 0.3, not 0.30000000000000004
            const decimalsOf = (operand: number) => {
                const [mantissa, exponent] = String(operand).split('e-');
                return (mantissa.split('.')[1]?.length ?? 0) + (exponent ? +exponent : 0);
            };
            sum = +sum.toFixed(Math.min(Math.max(decimalsOf(currentValue as number), decimalsOf(step)), 100));
        }
        let newValue = this.validateValue(sum);
        const max = this.maxlength();
        if (max && max < this.formatValue(newValue).length) {
            return;
        }

        this.updateInput(newValue, null, 'spin', null);
        this.updateModel(event, newValue);

        this.handleOnInput(event, currentValue, newValue);
    }

    clear() {
        this.value.set(null);
        this.onModelChange(this.value());
        this.onClear.emit();
    }

    onUpButtonMouseDown(event: MouseEvent) {
        if (event.button === 2) {
            this.clearTimer();
            return;
        }

        if (!this.$disabled()) {
            this.input().nativeElement.focus();
            this.repeat(event, null, 1);
            event.preventDefault();
        }
    }

    onUpButtonMouseUp() {
        if (!this.$disabled()) {
            this.clearTimer();
        }
    }

    onUpButtonMouseLeave() {
        if (!this.$disabled()) {
            this.clearTimer();
        }
    }

    onUpButtonKeyDown(event: KeyboardEvent) {
        if (event.keyCode === 32 || event.keyCode === 13) {
            this.repeat(event, null, 1);
        }
    }

    onUpButtonKeyUp() {
        if (!this.$disabled()) {
            this.clearTimer();
        }
    }

    onDownButtonMouseDown(event: MouseEvent) {
        if (event.button === 2) {
            this.clearTimer();
            return;
        }
        if (!this.$disabled()) {
            this.input().nativeElement.focus();
            this.repeat(event, null, -1);
            event.preventDefault();
        }
    }

    onDownButtonMouseUp() {
        if (!this.$disabled()) {
            this.clearTimer();
        }
    }

    onDownButtonMouseLeave() {
        if (!this.$disabled()) {
            this.clearTimer();
        }
    }

    onDownButtonKeyUp() {
        if (!this.$disabled()) {
            this.clearTimer();
        }
    }

    onDownButtonKeyDown(event: KeyboardEvent) {
        if (event.keyCode === 32 || event.keyCode === 13) {
            this.repeat(event, null, -1);
        }
    }

    onUserInput(event: Event) {
        if (this.readonly()) {
            return;
        }

        const target = event.target as HTMLInputElement;
        const { inputType, data } = event as InputEvent;

        if (inputType === 'insertFromPaste' && this.pasted()) {
            this.insertPasted(event, target);
        } else if (this.isSpecialChar()) {
            target.value = this.lastValue() as string;
        } else if (inputType === 'insertText' && data && this.lastValue() != null) {
            // Soft keyboards insert text without a keypress, where characters are filtered: undo the raw insertion
            // and insert the accepted characters the way onInputKeyPress does.
            const caret = Math.max((target.selectionStart ?? data.length) - data.length, 0);
            target.value = this.lastValue() as string;
            target.setSelectionRange(caret, caret);

            for (const char of data) {
                const isDecimalSign = this.isDecimalSign(char);
                const isMinusSign = this.isMinusSign(char);

                if ((char >= '0' && char <= '9') || isDecimalSign || isMinusSign) {
                    this.insert(event, char, { isDecimalSign, isMinusSign });
                }
            }
        }
        this.isSpecialChar.set(false);
    }

    onInputKeyDown(event: KeyboardEvent) {
        if (this.readonly()) {
            return;
        }

        this.lastValue.set((event.target as HTMLInputElement).value);
        if ((event as KeyboardEvent).shiftKey || (event as KeyboardEvent).altKey) {
            this.isSpecialChar.set(true);
            return;
        }

        let selectionStart = (event.target as HTMLInputElement).selectionStart as number;
        let selectionEnd = (event.target as HTMLInputElement).selectionEnd as number;
        let inputValue = (event.target as HTMLInputElement).value as string;
        let newValueStr: any = null;

        if (event.altKey) {
            event.preventDefault();
        }

        const input = this.input();
        switch (event.key) {
            case 'ArrowUp':
                this.spin(event, 1);
                event.preventDefault();
                break;

            case 'ArrowDown':
                this.spin(event, -1);
                event.preventDefault();
                break;

            case 'ArrowLeft':
                for (let index = selectionStart; index <= inputValue.length; index++) {
                    const previousCharIndex = index === 0 ? 0 : index - 1;
                    if (this.isNumeralChar(inputValue.charAt(previousCharIndex))) {
                        this.input().nativeElement.setSelectionRange(index, index);
                        break;
                    }
                }
                break;

            case 'ArrowRight':
                for (let index = selectionEnd; index >= 0; index--) {
                    if (this.isNumeralChar(inputValue.charAt(index))) {
                        this.input().nativeElement.setSelectionRange(index, index);
                        break;
                    }
                }
                break;

            case 'Tab':
            case 'Enter':
                newValueStr = this.validateValue(this.parseValue(this.input().nativeElement.value));
                input.nativeElement.value = this.formatValue(newValueStr);
                input.nativeElement.setAttribute('aria-valuenow', newValueStr);
                this.updateModel(event, newValueStr);
                break;

            case 'Backspace': {
                event.preventDefault();

                if (selectionStart === selectionEnd) {
                    if ((selectionStart == 1 && this.prefix()) || (selectionStart == inputValue.length && this.suffix())) {
                        break;
                    }

                    const deleteChar = inputValue.charAt(selectionStart - 1);
                    const { decimalCharIndex, decimalCharIndexWithoutPrefix } = this.getDecimalCharIndexes(inputValue);

                    if (this.isNumeralChar(deleteChar)) {
                        const decimalLength = this.getDecimalLength(inputValue);

                        if (this._group().test(deleteChar)) {
                            this._group().lastIndex = 0;
                            newValueStr = inputValue.slice(0, selectionStart - 2) + inputValue.slice(selectionStart - 1);
                        } else if (this._decimal().test(deleteChar)) {
                            this._decimal().lastIndex = 0;

                            if (decimalLength) {
                                this.input().nativeElement.setSelectionRange(selectionStart - 1, selectionStart - 1);
                            } else {
                                newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
                            }
                        } else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                            const insertedText = this.isDecimalMode() && (this.minFractionDigits() || 0) < decimalLength ? '' : '0';
                            newValueStr = inputValue.slice(0, selectionStart - 1) + insertedText + inputValue.slice(selectionStart);
                        } else if (decimalCharIndexWithoutPrefix === 1) {
                            newValueStr = inputValue.slice(0, selectionStart - 1) + '0' + inputValue.slice(selectionStart);
                            newValueStr = (this.parseValue(newValueStr) as number) > 0 ? newValueStr : '';
                        } else {
                            newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
                        }
                    } else if (this.mode() === 'currency' && this._currency() && deleteChar.search(this._currency() as RegExp) != -1) {
                        newValueStr = inputValue.slice(1);
                    }

                    this.updateValue(event, newValueStr, null, 'delete-single');
                } else {
                    newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
                    this.updateValue(event, newValueStr, null, 'delete-range');
                }

                break;
            }

            case 'Delete':
                event.preventDefault();

                if (selectionStart === selectionEnd) {
                    if ((selectionStart == 0 && this.prefix()) || (selectionStart == inputValue.length - 1 && this.suffix())) {
                        break;
                    }
                    const deleteChar = inputValue.charAt(selectionStart);
                    const { decimalCharIndex, decimalCharIndexWithoutPrefix } = this.getDecimalCharIndexes(inputValue);

                    if (this.isNumeralChar(deleteChar)) {
                        const decimalLength = this.getDecimalLength(inputValue);

                        if (this._group().test(deleteChar)) {
                            this._group().lastIndex = 0;
                            newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 2);
                        } else if (this._decimal().test(deleteChar)) {
                            this._decimal().lastIndex = 0;

                            if (decimalLength) {
                                this.input().nativeElement.setSelectionRange(selectionStart + 1, selectionStart + 1);
                            } else {
                                newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
                            }
                        } else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                            const insertedText = this.isDecimalMode() && (this.minFractionDigits() || 0) < decimalLength ? '' : '0';
                            newValueStr = inputValue.slice(0, selectionStart) + insertedText + inputValue.slice(selectionStart + 1);
                        } else if (decimalCharIndexWithoutPrefix === 1) {
                            newValueStr = inputValue.slice(0, selectionStart) + '0' + inputValue.slice(selectionStart + 1);
                            newValueStr = (this.parseValue(newValueStr) as number) > 0 ? newValueStr : '';
                        } else {
                            newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
                        }
                    }

                    this.updateValue(event, newValueStr as string, null, 'delete-back-single');
                } else {
                    newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
                    this.updateValue(event, newValueStr, null, 'delete-range');
                }
                break;

            case 'Home':
                if (this.min()) {
                    this.updateModel(event, this.min());
                    event.preventDefault();
                }
                break;

            case 'End':
                if (this.max()) {
                    this.updateModel(event, this.max());
                    event.preventDefault();
                }
                break;

            default:
                break;
        }

        this.onKeyDown.emit(event);
    }

    onInputKeyPress(event: KeyboardEvent) {
        if (this.readonly()) {
            return;
        }

        let code = event.which || event.keyCode;
        if (code == 13) {
            return;
        }
        event.preventDefault();

        let char = String.fromCharCode(code);
        let isDecimalSign = this.isDecimalSign(char);
        const isMinusSign = this.isMinusSign(char);

        if (!isDecimalSign && event.code === 'NumpadDecimal') {
            isDecimalSign = true;
            char = this._decimalChar();
            code = char.charCodeAt(0);
        }
        const { value, selectionStart, selectionEnd } = this.input().nativeElement;
        const newValue = this.parseValue(value + char);
        const newValueStr = newValue != null ? newValue.toString() : '';
        const selectedValue = value.substring(selectionStart as number, selectionEnd as number);
        const selectedValueParsed = this.parseValue(selectedValue);
        const selectedValueStr = selectedValueParsed != null ? selectedValueParsed.toString() : '';

        if (selectionStart !== selectionEnd && selectedValueStr.length > 0) {
            this.insert(event, char, { isDecimalSign, isMinusSign });
            return;
        }

        const max = this.maxlength();

        if (max && newValueStr.length > max) {
            return;
        }

        if ((48 <= code && code <= 57) || isMinusSign || isDecimalSign) {
            this.insert(event, char, { isDecimalSign, isMinusSign });
        }
    }

    onPaste(event: ClipboardEvent) {
        if (!this.$disabled() && !this.readonly()) {
            // Let the native paste land (cancelling it flags the input as paste-preventing) and sanitize it in onUserInput
            const { value, selectionStart, selectionEnd } = event.target as HTMLInputElement;
            const data = (event.clipboardData || (this.document as any).defaultView['clipboardData']).getData('Text');
            this.pasted.set({ value, selectionStart, selectionEnd, data });
        }
    }

    insertPasted(event: Event, target: HTMLInputElement) {
        const { value, selectionStart, selectionEnd } = this.pasted()!;
        let data = this.pasted()!.data;
        this.pasted.set(null);
        target.value = value;
        target.setSelectionRange(selectionStart ?? value.length, selectionEnd ?? value.length);

        if (this.inputId() === 'integeronly' && /[^\d-]/.test(data)) {
            return;
        }
        if (data) {
            if (this.maxlength()) {
                data = data.toString().substring(0, this.maxlength() as number);
            }

            let filteredData = this.parseValue(data);
            if (filteredData != null) {
                this.insert(event, filteredData.toString());
            }
        }
    }

    allowMinusSign = computed(() => {
        const min = this.min();

        return min == null || min < 0;
    });

    isMinusSign(char: string) {
        if (this._minusSign().test(char) || char === '-') {
            this._minusSign().lastIndex = 0;
            return true;
        }

        return false;
    }

    isDecimalSign(char: string) {
        if (this._decimal().test(char)) {
            this._decimal().lastIndex = 0;
            return true;
        }

        return false;
    }

    isDecimalMode = computed(() => this.mode() === 'decimal');

    getDecimalCharIndexes(val: string) {
        let decimalCharIndex = val.search(this._decimal());
        this._decimal().lastIndex = 0;

        const filteredVal = val
            .replace(this._prefix() as RegExp, '')
            .trim()
            .replace(/\s/g, '')
            .replace(this._currency() as RegExp, '');
        const decimalCharIndexWithoutPrefix = filteredVal.search(this._decimal());
        this._decimal().lastIndex = 0;

        return { decimalCharIndex, decimalCharIndexWithoutPrefix };
    }

    getCharIndexes(val: string) {
        const decimalCharIndex = val.search(this._decimal());
        this._decimal().lastIndex = 0;
        const minusCharIndex = val.search(this._minusSign());
        this._minusSign().lastIndex = 0;
        const suffixCharIndex = val.search(this._suffix() as RegExp);
        (this._suffix() as RegExp).lastIndex = 0;
        const currencyCharIndex = val.search(this._currency() as RegExp);
        (this._currency() as RegExp).lastIndex = 0;

        return { decimalCharIndex, minusCharIndex, suffixCharIndex, currencyCharIndex };
    }

    insert(event: Event, text: string, sign = { isDecimalSign: false, isMinusSign: false }) {
        const minusCharIndexOnText = text.search(this._minusSign());
        this._minusSign().lastIndex = 0;
        if (!this.allowMinusSign() && minusCharIndexOnText !== -1) {
            return;
        }

        const input = this.input();
        let selectionStart: any = input?.nativeElement.selectionStart;
        let selectionEnd: any = input?.nativeElement.selectionEnd;
        let inputValue = input?.nativeElement.value.trim();
        const { decimalCharIndex, minusCharIndex, suffixCharIndex, currencyCharIndex } = this.getCharIndexes(inputValue);
        let newValueStr;

        if (sign.isMinusSign) {
            if (selectionStart === 0) {
                newValueStr = inputValue;
                if (minusCharIndex === -1 || selectionEnd !== 0) {
                    newValueStr = this.insertText(inputValue, text, 0, selectionEnd);
                }

                this.updateValue(event, newValueStr, text, 'insert');
            }
        } else if (sign.isDecimalSign) {
            if (decimalCharIndex > 0 && selectionStart === decimalCharIndex) {
                this.updateValue(event, inputValue, text, 'insert');
            } else if (decimalCharIndex > selectionStart && decimalCharIndex < selectionEnd) {
                newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
                this.updateValue(event, newValueStr, text, 'insert');
            } else if (decimalCharIndex === -1 && this.maxFractionDigits()) {
                // a decimal separator typed in an empty input starts the fraction of 0
                newValueStr = inputValue ? this.insertText(inputValue, text, selectionStart, selectionEnd) : '0' + text;
                this.updateValue(event, newValueStr, inputValue ? text : newValueStr, 'insert');
            }
        } else {
            const maxFractionDigits = this.numberFormat().resolvedOptions().maximumFractionDigits;
            const operation = selectionStart !== selectionEnd ? 'range-insert' : 'insert';

            if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                if (selectionStart + text.length - (decimalCharIndex + 1) <= maxFractionDigits) {
                    const charIndex = currencyCharIndex >= selectionStart ? currencyCharIndex - 1 : suffixCharIndex >= selectionStart ? suffixCharIndex : inputValue.length;

                    newValueStr = inputValue.slice(0, selectionStart) + text + inputValue.slice(selectionStart + text.length, charIndex) + inputValue.slice(charIndex);
                    this.updateValue(event, newValueStr, text, operation);
                }
            } else {
                newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
                this.updateValue(event, newValueStr, text, operation);
            }
        }
    }

    insertText(value: string, text: string, start: number, end: number) {
        let textSplit = text === '.' ? text : text.split('.');

        if (textSplit.length === 2) {
            const decimalCharIndex = value.slice(start, end).search(this._decimal());
            this._decimal().lastIndex = 0;
            return decimalCharIndex > 0 ? value.slice(0, start) + this.formatValue(text) + value.slice(end) : value || this.formatValue(text);
        } else if (end - start === value.length) {
            return this.formatValue(text);
        } else if (start === 0) {
            return text + value.slice(end);
        } else if (end === value.length) {
            return value.slice(0, start) + text;
        } else {
            return value.slice(0, start) + text + value.slice(end);
        }
    }

    deleteRange(value: string, start: number, end: number) {
        let newValueStr;

        if (end - start === value.length) newValueStr = '';
        else if (start === 0) newValueStr = value.slice(end);
        else if (end === value.length) newValueStr = value.slice(0, start);
        else newValueStr = value.slice(0, start) + value.slice(end);

        return newValueStr;
    }

    initCursor() {
        const input = this.input();
        let selectionStart: any = input?.nativeElement.selectionStart;
        let selectionEnd: any = input?.nativeElement.selectionEnd;
        let inputValue = input?.nativeElement.value;
        let valueLength = inputValue.length;
        let index: any = null;

        // remove prefix
        let prefixLength = (this.prefixChar() || '').length;
        inputValue = inputValue.replace(this._prefix() as RegExp, '');

        // Will allow selecting whole prefix. But not a part of it.
        // Negative values will trigger clauses after this to fix the cursor position.
        if (selectionStart === selectionEnd || selectionStart !== 0 || selectionEnd < prefixLength) {
            selectionStart -= prefixLength;
        }

        let char = inputValue.charAt(selectionStart);
        if (this.isNumeralChar(char)) {
            return selectionStart + prefixLength;
        }

        //left
        let i = selectionStart - 1;
        while (i >= 0) {
            char = inputValue.charAt(i);
            if (this.isNumeralChar(char)) {
                index = i + prefixLength;
                break;
            } else {
                i--;
            }
        }

        if (index !== null) {
            input?.nativeElement.setSelectionRange(index + 1, index + 1);
        } else {
            i = selectionStart;
            while (i < valueLength) {
                char = inputValue.charAt(i);
                if (this.isNumeralChar(char)) {
                    index = i + prefixLength;
                    break;
                } else {
                    i++;
                }
            }

            if (index !== null) {
                input?.nativeElement.setSelectionRange(index, index);
            }
        }

        return index || 0;
    }

    onInputClick() {
        const currentValue = this.input().nativeElement.value;

        if (!this.readonly() && currentValue !== getSelection()) {
            this.initCursor();
        }
    }

    isNumeralChar(char: string) {
        if (char.length === 1 && (this._numeral().test(char) || this._decimal().test(char) || this._group().test(char) || this._minusSign().test(char))) {
            this.resetRegex();
            return true;
        }

        return false;
    }

    resetRegex() {
        this._numeral().lastIndex = 0;
        this._decimal().lastIndex = 0;
        this._group().lastIndex = 0;
        this._minusSign().lastIndex = 0;
    }

    updateValue(event: Event, valueStr: Nullable<string>, insertedValueStr: Nullable<string>, operation: Nullable<string>) {
        let currentValue = this.input().nativeElement.value;
        let newValue: any = null;

        if (valueStr != null) {
            newValue = this.parseValue(valueStr);
            newValue = !newValue && !this.allowEmpty() ? 0 : newValue;
            // maxlength counts the characters of the formatted value, as the spin buttons do: reject an insertion beyond it
            const maxlength = this.maxlength();
            if (maxlength && currentValue && (operation === 'insert' || operation === 'range-insert') && this.formatValue(newValue).length > maxlength) {
                return;
            }
            this.updateInput(newValue, insertedValueStr, operation, valueStr);

            this.handleOnInput(event, currentValue, newValue);
        }
    }

    handleOnInput(event: Event, currentValue: string, newValue: any) {
        if (this.isValueChanged(currentValue, newValue)) {
            const inputEl = (this.input() as ElementRef).nativeElement;
            // updateInput() already rendered the value; reformatting it would drop an in-progress fraction such as '0,'.
            if (this.parseValue(inputEl.value) !== newValue) {
                inputEl.value = this.formatValue(newValue);
            }
            this.input().nativeElement.setAttribute('aria-valuenow', newValue);
            this.updateModel(event, newValue);
            this.onInput.emit({ originalEvent: event, value: newValue, formattedValue: currentValue });
        }
    }

    isValueChanged(currentValue: string, newValue: string) {
        if (newValue === null && currentValue !== null) {
            return true;
        }

        if (newValue != null) {
            let parsedCurrentValue = typeof currentValue === 'string' ? this.parseValue(currentValue) : currentValue;
            return newValue !== parsedCurrentValue;
        }

        return false;
    }

    validateValue(value: number | string) {
        if (value === '-' || value == null) {
            return null;
        }
        const min = this.min();
        const max = this.max();

        if (min != null && (value as number) < min) {
            return this.min();
        }

        if (max != null && (value as number) > max) {
            return max;
        }

        return value;
    }

    updateInput(value: any, insertedValueStr: Nullable<string>, operation: Nullable<string>, valueStr: Nullable<string>) {
        insertedValueStr = insertedValueStr || '';

        const input = this.input();
        let inputValue = input?.nativeElement.value;
        let newValue = this.formatValue(value);
        let currentLength = inputValue.length;

        if (newValue !== valueStr) {
            newValue = this.concatValues(newValue, valueStr as string);
        }

        if (currentLength === 0) {
            input.nativeElement.value = newValue;
            input.nativeElement.setSelectionRange(0, 0);
            const index = this.initCursor();
            const selectionEnd = index + insertedValueStr.length;
            input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
        } else {
            let selectionStart: any = input.nativeElement.selectionStart;
            let selectionEnd: any = input.nativeElement.selectionEnd;
            const maxlength = this.maxlength();
            if (maxlength && newValue.length > maxlength) {
                newValue = newValue.slice(0, maxlength);
                selectionStart = Math.min(selectionStart, maxlength);
                selectionEnd = Math.min(selectionEnd, maxlength);
            }

            if (maxlength && maxlength < newValue.length) {
                return;
            }

            input.nativeElement.value = newValue;
            let newLength = newValue.length;

            if (operation === 'range-insert') {
                const startValue = this.parseValue((inputValue || '').slice(0, selectionStart));
                const startValueStr = startValue !== null ? startValue.toString() : '';
                const startExpr = startValueStr.split('').join(`(${this.groupChar()})?`);
                const sRegex = new RegExp(startExpr, 'g');
                sRegex.test(newValue);

                const tExpr = insertedValueStr.split('').join(`(${this.groupChar()})?`);
                const tRegex = new RegExp(tExpr, 'g');
                tRegex.test(newValue.slice(sRegex.lastIndex));

                selectionEnd = sRegex.lastIndex + tRegex.lastIndex;
                input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
            } else if (newLength === currentLength) {
                if (operation === 'insert' || operation === 'delete-back-single') input.nativeElement.setSelectionRange(selectionEnd + 1, selectionEnd + 1);
                else if (operation === 'delete-single') input.nativeElement.setSelectionRange(selectionEnd - 1, selectionEnd - 1);
                else if (operation === 'delete-range' || operation === 'spin') input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
            } else if (operation === 'delete-back-single') {
                let prevChar = inputValue.charAt(selectionEnd - 1);
                let nextChar = inputValue.charAt(selectionEnd);
                let diff = currentLength - newLength;
                let isGroupChar = this._group().test(nextChar);

                if (isGroupChar && diff === 1) {
                    selectionEnd += 1;
                } else if (!isGroupChar && this.isNumeralChar(prevChar)) {
                    selectionEnd += -1 * diff + 1;
                }

                this._group().lastIndex = 0;
                input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
            } else if (inputValue === '-' && operation === 'insert') {
                input.nativeElement.setSelectionRange(0, 0);
                const index = this.initCursor();
                const selectionEnd = index + insertedValueStr.length + 1;
                input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
            } else {
                selectionEnd = selectionEnd + (newLength - currentLength);
                input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
            }
        }

        input.nativeElement.setAttribute('aria-valuenow', value);
    }

    concatValues(val1: string, val2: string) {
        if (val1 && val2) {
            let decimalCharIndex = val2.search(this._decimal());
            this._decimal().lastIndex = 0;

            if (this.suffixChar()) {
                return decimalCharIndex !== -1 ? val1.replace(this.suffixChar(), '').split(this._decimal())[0] + val2.replace(this.suffixChar(), '').slice(decimalCharIndex) + this.suffixChar() : val1;
            } else {
                return decimalCharIndex !== -1 ? val1.split(this._decimal())[0] + val2.slice(decimalCharIndex) : val1;
            }
        }
        return val1;
    }

    getDecimalLength(value: string) {
        if (value) {
            const valueSplit = value.split(this._decimal());

            if (valueSplit.length === 2) {
                return valueSplit[1]
                    .replace(this._suffix() as RegExp, '')
                    .trim()
                    .replace(/\s/g, '')
                    .replace(this._currency() as RegExp, '').length;
            }
        }

        return 0;
    }

    onInputFocus(event: Event) {
        this.focused.set(true);
        this.onFocus.emit(event);
    }

    onInputBlur(event: Event) {
        this.focused.set(false);

        const newValueNumber = this.validateValue(this.parseValue(this.input().nativeElement.value));
        const newValueString: any = newValueNumber?.toString();
        this.input().nativeElement.value = this.formatValue(newValueString);
        this.input().nativeElement.setAttribute('aria-valuenow', newValueString);
        this.updateModel(event, newValueNumber);
        this.onModelTouched();
        this.onBlur.emit(event);
    }

    formattedValue = computed(() => {
        const val = !this.value() && !this.allowEmpty() ? 0 : this.value();
        // While editing, keep the typed text when it already holds this value (e.g. '0,' after deleting the last fraction digit).
        if (this.focused()) {
            const inputValue = this.input()?.nativeElement.value;
            if (inputValue && this.parseValue(inputValue) === val) {
                return inputValue;
            }
        }
        return this.formatValue(val);
    });

    updateModel(event: Event, value: any) {
        const isBlurUpdateOnMode = this.ngControl()?.control?.updateOn === 'blur';

        if (this.value() !== value) {
            this.value.set(value);

            if (!(isBlurUpdateOnMode && this.focused())) {
                this.blurChangePending.set(false);
                this.onModelChange(value);
            } else {
                this.blurChangePending.set(true);
            }
        } else if (isBlurUpdateOnMode && !this.focused() && this.blurChangePending()) {
            // report the change deferred while focused, but not a blur without an edit (it would mark the control dirty)
            this.blurChangePending.set(false);
            this.onModelChange(value);
        }
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        this.value.set(value ? Number(value) : value);
        setModelValue(value);
    }

    clearTimer() {
        if (this.timer()) {
            clearInterval(this.timer());
        }
    }

    dataP = computed(() =>
        this.cn({
            invalid: this.invalid(),
            disabled: this.$disabled(),
            focus: this.focused(),
            fluid: this.hasFluid,
            filled: this.$variant() === 'filled',
            empty: !this.$filled(),
            [this.size() as string]: this.size(),
            [this.buttonLayout()]: this.showButtons() && this.buttonLayout()
        })
    );
}

@NgModule({
    imports: [InputNumber, SharedModule],
    exports: [InputNumber, SharedModule]
})
export class InputNumberModule {}
