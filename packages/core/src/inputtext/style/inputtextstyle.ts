import { Injectable } from '@angular/core';
import { style as inputtext_style } from '@exhaustive-ui/styles/inputtext';
import { BaseStyle } from '@exhaustive-ui/core/base';

const style = /*css*/ `
    ${inputtext_style}

    /* For Exhaustive: the ng-invalid fallback applies only while [invalid] is not bound */
    .p-inputtext.ng-invalid.ng-dirty:not([data-p-invalid]) {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.ng-invalid.ng-dirty:not([data-p-invalid])::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }
`;

const classes = {
    root: ({ instance }) => [
        'p-inputtext p-component',
        {
            'p-filled': instance.$filled(),
            'p-inputtext-sm p-inputfield-sm': instance.pSize() === 'small',
            'p-inputtext-lg p-inputfield-lg': instance.pSize() === 'large',
            'p-invalid': instance.invalid(),
            'p-variant-filled': instance.$variant() === 'filled',
            'p-inputtext-fluid': instance.hasFluid()
        }
    ]
};

@Injectable()
export class InputTextStyle extends BaseStyle {
    name = 'inputtext';

    style = style;

    classes = classes;
}

/**
 *
 * InputText renders a text field to enter data.
 *
 * [Live Demo](https://exhaustive-ui.com/inputtext/)
 *
 * @module inputtextstyle
 *
 */
export enum InputTextClasses {
    /**
     * The class of root element
     */
    root = 'p-inputtext'
}

export interface InputTextStyle extends BaseStyle {}
