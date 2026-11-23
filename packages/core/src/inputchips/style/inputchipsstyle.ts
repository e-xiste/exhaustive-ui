import { Injectable } from '@angular/core';
import { style as inputchips_style } from '@exhaustive-ui/styles/inputchips';
import { BaseStyle } from '@exhaustive-ui/core/base';

const style = /*css*/ `
${inputchips_style}

/* For Exhaustive */
p-inputchips.ng-invalid.ng-dirty .p-inputchips-input,
p-input-chips.ng-invalid.ng-dirty .p-inputchips-input {
    border-color: dt('inputchips.invalid.border.color');
}

p-inputchips.ng-invalid.ng-dirty .p-inputchips-input-field::placeholder,
p-input-chips.ng-invalid.ng-dirty .p-inputchips-input-field::placeholder {
    color: dt('inputchips.invalid.placeholder.color');
}
`;

const classes = {
    root: ({ instance }) => [
        'p-inputchips p-component p-inputwrapper',
        {
            'p-invalid': instance.$invalid(),
            'p-focus': instance.focused(),
            'p-inputwrapper-filled': instance.$filled() || !!instance.inputValue(),
            'p-inputwrapper-focus': instance.focused() && !instance.$disabled(),
            'p-inputchips-fluid': instance.hasFluid
        }
    ],
    container: ({ instance }) => [
        'p-inputchips-input',
        {
            'p-disabled': instance.$disabled(),
            'p-variant-filled': instance.$variant() === 'filled',
            'p-inputchips-input-sm p-inputfield-sm': instance.size() === 'small',
            'p-inputchips-input-lg p-inputfield-lg': instance.size() === 'large'
        }
    ],
    list: 'p-inputchips-list',
    chipItem: ({ instance, index }) => [
        'p-inputchips-chip-item',
        {
            'p-focus': instance.focusedIndex() === index
        }
    ],
    pcChip: 'p-inputchips-chip',
    chipLabel: 'p-chip-label p-inputchips-chip-label',
    chipIcon: 'p-chip-remove-icon p-inputchips-chip-icon',
    input: 'p-inputchips-input-field'
};

@Injectable()
export class InputChipsStyle extends BaseStyle {
    name = 'inputchips';

    style = style;

    classes = classes;
}

/**
 *
 * InputChips enters several free-text values, each shown as a chip.
 *
 * [Live Demo](https://exhaustive-ui.com/inputchips/)
 *
 * @module inputchipsstyle
 *
 */
export enum InputChipsClasses {
    /**
     * Class name of the root element
     */
    root = 'p-inputchips',
    /**
     * Class name of the field box that holds the chips and the text input
     */
    container = 'p-inputchips-input',
    /**
     * Class name of the list of chips
     */
    list = 'p-inputchips-list',
    /**
     * Class name of the list item of a chip
     */
    chipItem = 'p-inputchips-chip-item',
    /**
     * Class name of a chip
     */
    pcChip = 'p-inputchips-chip',
    /**
     * Class name of the label of a chip
     */
    chipLabel = 'p-inputchips-chip-label',
    /**
     * Class name of the remove icon of a chip
     */
    chipIcon = 'p-inputchips-chip-icon',
    /**
     * Class name of the text input
     */
    input = 'p-inputchips-input-field'
}

export interface InputChipsStyle extends BaseStyle {}
