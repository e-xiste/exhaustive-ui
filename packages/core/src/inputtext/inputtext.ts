import { afterNextRender, booleanAttribute, computed, Directive, effect, HostListener, inject, input, NgModule } from '@angular/core';
import { NgControl } from '@angular/forms';
import { PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseModelHolder } from '@exhaustive-ui/core/basemodelholder';
import { Bind } from '@exhaustive-ui/core/bind';
import { Fluid } from '@exhaustive-ui/core/fluid';
import { InputTextPassThrough } from '@exhaustive-ui/core/types/inputtext';
import { InputTextStyle } from './style/inputtextstyle';

/**
 * InputText directive is an extension to standard input element with theming.
 * @group Components
 */
@Directive({
    selector: '[pInputText]',
    host: {
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP()',
        '[attr.data-p-invalid]': '$invalid()'
    },
    providers: [InputTextStyle, { provide: PARENT_INSTANCE, useExisting: InputText }],
    hostDirectives: [Bind]
})
export class InputText extends BaseModelHolder<InputTextPassThrough> {
    componentName = 'InputText';

    readonly hostName = input<any>('');

    /**
     * Used to pass attributes to DOM elements inside the InputText component.
     * @defaultValue undefined
     * @group Props
     */
    pInputTextPT = input<InputTextPassThrough>();
    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    pInputTextUnstyled = input<boolean | undefined>();

    bindDirectiveInstance = inject(Bind, { self: true });

    ngControl = inject(NgControl, { optional: true, self: true });

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    /**
     * Defines the size of the component.
     * @group Props
     */
    readonly pSize = input<'large' | 'small' | undefined>();
    /**
     * Specifies the input variant of the component.
     * @defaultValue undefined
     * @group Props
     */
    variant = input<'filled' | 'outlined' | undefined>();
    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });
    /**
     * When present, it specifies that the component should have invalid state style.
     * @defaultValue false
     * @group Props
     */
    invalid = input(undefined, { transform: booleanAttribute });
    /**
     * Whether the field has been touched. Signal Forms sets it through `[formField]`: the invalid style and `aria-invalid` then wait until the field is touched, or the form is submitted, like the error messages. Left unset, `invalid` applies at once.
     * @defaultValue undefined
     * @group Props
     */
    touched = input<boolean | undefined, unknown>(undefined, { transform: (value: unknown) => (value == null ? undefined : booleanAttribute(value)) });
    /**
     * The invalid state shown by the component: `invalid`, once the field is touched when `touched` is set; undefined when `invalid` is unset.
     * @group Props
     */
    readonly $invalid = computed<boolean | undefined>(() => {
        const invalid = this.invalid();
        // undefined keeps the ng-invalid fallback of the fields that have one
        return invalid === undefined ? undefined : invalid && this.touched() !== false;
    });

    $variant = computed(() => this.variant() || this.config.inputVariant());

    _componentStyle = inject(InputTextStyle);

    constructor() {
        super();
        effect(() => {
            const pt = this.pInputTextPT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pInputTextUnstyled() && this.directiveUnstyled.set(this.pInputTextUnstyled());
        });

        afterNextRender(() => {
            this.writeModelValue(this.ngControl?.value ?? this.el.nativeElement.value);
        });

        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptm('root'));
    }

    onDoCheck() {
        this.writeModelValue(this.ngControl?.value ?? this.el.nativeElement.value);
    }

    @HostListener('input')
    onInput() {
        this.writeModelValue(this.ngControl?.value ?? this.el.nativeElement.value);
    }

    readonly hasFluid = computed(() => this.fluid() ?? !!this.pcFluid);

    readonly dataP = computed(() =>
        this.cn({
            invalid: this.$invalid(),
            fluid: this.hasFluid(),
            filled: this.$variant() === 'filled',
            [this.pSize() as string]: this.pSize()
        })
    );
}

@NgModule({
    imports: [InputText],
    exports: [InputText]
})
export class InputTextModule {}
