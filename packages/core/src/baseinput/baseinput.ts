import { booleanAttribute, computed, Directive, inject, input } from '@angular/core';
import { BaseEditableHolder } from '@exhaustive-ui/core/baseeditableholder';
import { Fluid } from '@exhaustive-ui/core/fluid';

/**
 * Angular Signal Forms bind the constraints of a field to the inputs of the same name: min and max
 * take the value type of the field (a string for a select, a Date for a date picker) and pattern
 * takes the RegExp list of the field. These inputs keep the types they had for the templates and
 * accept those values, dropping the ones they cannot render as an HTML attribute.
 */
function toNumberConstraint(value: unknown): number | null | undefined {
    if (value === null) {
        return null;
    }
    if (value === undefined) {
        return undefined;
    }
    if (typeof value === 'number') {
        return value;
    }

    return typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value)) ? Number(value) : undefined;
}

function toPatternConstraint(value: string | readonly RegExp[] | null | undefined): string | null | undefined {
    // A Signal Forms pattern matches anywhere in the value while the HTML attribute must match it
    // whole, so the field keeps validating it and no attribute is rendered.
    return Array.isArray(value) ? undefined : (value as string | null | undefined);
}

@Directive({ standalone: true })
export class BaseInput<PT = any> extends BaseEditableHolder<PT> {
    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue false
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });
    /**
     * Specifies the input variant of the component.
     * @defaultValue 'outlined'
     * @group Props
     */
    variant = input<'filled' | 'outlined' | undefined>();
    /**
     * Specifies the size of the component.
     * @defaultValue undefined
     * @group Props
     */
    size = input<'large' | 'small' | undefined>();
    /**
     * Specifies the visible width of the input element in characters.
     * @defaultValue undefined
     * @group Props
     */
    inputSize = input<number | null | undefined>();
    /**
     * Specifies the value must match the pattern.
     * @defaultValue undefined
     * @group Props
     */
    pattern = input<string | null | undefined, string | readonly RegExp[] | null | undefined>(undefined, { transform: toPatternConstraint });
    /**
     * The value must be greater than or equal to the value.
     * @defaultValue undefined
     * @group Props
     */
    min = input<number | null | undefined, unknown>(undefined, { transform: toNumberConstraint });
    /**
     * The value must be less than or equal to the value.
     * @defaultValue undefined
     * @group Props
     */
    max = input<number | null | undefined, unknown>(undefined, { transform: toNumberConstraint });
    /**
     * Unless the step is set to the any literal, the value must be min + an integral multiple of the step.
     * @defaultValue undefined
     * @group Props
     */
    step = input<number | null | undefined>();
    /**
     * The number of characters (code points) must not be less than the value of the attribute, if non-empty.
     * @defaultValue undefined
     * @group Props
     */
    minlength = input<number | null | undefined>();
    /**
     * The number of characters (code points) must not exceed the value of the attribute.
     * @defaultValue undefined
     * @group Props
     */
    maxlength = input<number | null | undefined>();

    $variant = computed(() => this.variant() || this.config.inputVariant());

    get hasFluid() {
        return this.fluid() ?? !!this.pcFluid;
    }
}
