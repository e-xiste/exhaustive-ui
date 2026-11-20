import { Injectable } from '@angular/core';
import { style as iconfield_style } from '@exhaustive-ui/styles/iconfield';
import { BaseStyle } from '@exhaustive-ui/core/base';

const style = /*css*/ `
    ${iconfield_style}

    /* For Exhaustive (iconPosition="right" puts the icon at the inline end whatever its DOM position) */
    .p-iconfield.p-iconfield-right .p-inputicon {
        inset-inline-start: auto;
        inset-inline-end: dt('form.field.padding.x');
    }

    .p-iconfield.p-iconfield-right .p-inputtext,
    .p-iconfield.p-iconfield-right .p-inputwrapper .p-inputtext {
        padding-inline-start: dt('form.field.padding.x');
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }
`;

const classes = {
    root: ({ instance }) => [
        'p-iconfield',
        {
            'p-iconfield-left': instance.iconPosition() == 'left',
            'p-iconfield-right': instance.iconPosition() == 'right'
        }
    ]
};

@Injectable()
export class IconFieldStyle extends BaseStyle {
    name = 'iconfield';

    style = style;

    classes = classes;
}

/**
 *
 * IconField wraps an input and an icon.
 *
 * [Live Demo](https://exhaustive-ui.com/iconfield/)
 *
 * @module iconfieldstyle
 *
 */
export enum IconFieldClasses {
    /**
     * Class name of the root element
     */
    root = 'p-iconfield'
}

export interface IconFieldStyle extends BaseStyle {}
