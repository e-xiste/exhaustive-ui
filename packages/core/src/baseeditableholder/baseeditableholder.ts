import { booleanAttribute, computed, Directive, input, signal, untracked } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { BaseModelHolder } from '@exhaustive-ui/core/basemodelholder';

@Directive({ standalone: true })
export class BaseEditableHolder<PT = any> extends BaseModelHolder<PT> implements ControlValueAccessor {
    /**
     * There must be a value (if set).
     * @defaultValue false
     * @group Props
     */
    required = input(undefined, { transform: booleanAttribute });
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
    /**
     * When present, it specifies that the component should have disabled state style.
     * @defaultValue false
     * @group Props
     */
    disabled = input(undefined, { transform: booleanAttribute });
    /**
     * When present, it specifies that the name of the input.
     * @defaultValue undefined
     * @group Props
     */
    name = input<string | undefined>();

    _disabled = signal<boolean>(false);

    $disabled = computed(() => this.disabled() || this._disabled());

    onModelChange: Function = () => {};

    onModelTouched: Function = () => {};

    writeDisabledState(value: boolean) {
        this._disabled.set(value);
    }

    writeControlValue(value: any, setModelValue?: (value: any) => void) {
        // NOOP - this method should be overridden in the derived classes
    }

    /**** Angular ControlValueAccessors ****/
    writeValue(value: any) {
        // Forms can call writeValue from a reactive context (e.g. a consumer effect); the signals read
        // while applying the value must not become dependencies of that context.
        untracked(() => this.writeControlValue(value, this.writeModelValue.bind(this)));
    }

    registerOnChange(fn: Function) {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function) {
        this.onModelTouched = fn;
    }

    setDisabledState(val: boolean) {
        this.writeDisabledState(val);
        this.cd.markForCheck();
    }
}
