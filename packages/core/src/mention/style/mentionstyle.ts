import { Injectable } from '@angular/core';
import { style as mention_style } from '@exhaustive-ui/styles/mention';
import { BaseStyle } from '@exhaustive-ui/core/base';

const style = /*css*/ `
${mention_style}

/* For Exhaustive */
p-mention.ng-invalid.ng-dirty .p-mention-input {
    border-color: dt('textarea.invalid.border.color');
}

p-mention.ng-invalid.ng-dirty .p-mention-input::placeholder {
    color: dt('textarea.invalid.placeholder.color');
}
`;

const classes = {
    root: ({ instance }) => [
        'p-mention p-component p-inputwrapper',
        {
            'p-invalid': instance.$invalid(),
            'p-disabled': instance.$disabled(),
            'p-focus': instance.focused(),
            'p-inputwrapper-filled': instance.$filled(),
            'p-inputwrapper-focus': instance.focused() && !instance.$disabled(),
            'p-mention-open': instance.overlayVisible(),
            'p-mention-fluid': instance.hasFluid
        }
    ],
    pcTextarea: 'p-mention-input',
    pcInputText: 'p-mention-input',
    anchor: 'p-mention-anchor',
    overlay: ({ instance }) => ['p-mention-overlay p-component-overlay p-component', { 'p-input-filled': instance.$variant() === 'filled' }],
    listContainer: 'p-mention-list-container',
    list: 'p-mention-list',
    option: ({ instance, index }) => ({
        'p-mention-option': true,
        'p-focus': instance.focusedOptionIndex() === index
    }),
    optionLabel: 'p-mention-option-label',
    emptyMessage: 'p-mention-empty-message',
    loader: 'p-mention-loader',
    loaderIcon: 'p-mention-loader-icon'
};

const inlineStyles = {
    root: { position: 'relative' },
    anchor: { position: 'absolute', pointerEvents: 'none' }
};

@Injectable()
export class MentionStyle extends BaseStyle {
    name = 'mention';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * Mention suggests users, tags or commands while typing a trigger such as @ or # in a textarea or an input.
 *
 * [Live Demo](https://exhaustive-ui.com/mention/)
 *
 * @module mentionstyle
 *
 */
export enum MentionClasses {
    /**
     * Class name of the root element
     */
    root = 'p-mention',
    /**
     * Class name of the textarea or input element
     */
    input = 'p-mention-input',
    /**
     * Class name of the invisible element the overlay is aligned with
     */
    anchor = 'p-mention-anchor',
    /**
     * Class name of the overlay element
     */
    overlay = 'p-mention-overlay',
    /**
     * Class name of the list container element
     */
    listContainer = 'p-mention-list-container',
    /**
     * Class name of the list element
     */
    list = 'p-mention-list',
    /**
     * Class name of the option element
     */
    option = 'p-mention-option',
    /**
     * Class name of the default option label
     */
    optionLabel = 'p-mention-option-label',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'p-mention-empty-message',
    /**
     * Class name of the loader element
     */
    loader = 'p-mention-loader'
}

export interface MentionStyle extends BaseStyle {}
