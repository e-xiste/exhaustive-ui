import { Injectable } from '@angular/core';
import { style as richtexteditor_style } from '@exhaustive-ui/styles/richtexteditor';
import { BaseStyle } from '@exhaustive-ui/core/base';

const classes = {
    root: ({ instance }) => [
        'p-richtexteditor p-component',
        {
            'p-richtexteditor-fluid': instance.hasFluid,
            'p-richtexteditor-filled': instance.$variant() === 'filled',
            'p-richtexteditor-sm': instance.size() === 'small',
            'p-richtexteditor-lg': instance.size() === 'large',
            'p-richtexteditor-focus': instance.focused(),
            'p-richtexteditor-empty': instance.empty(),
            'p-richtexteditor-readonly': instance.readonly(),
            'p-invalid': instance.$invalid(),
            'p-disabled': instance.$disabled()
        }
    ],
    toolbar: 'p-richtexteditor-toolbar',
    button: ({ active }) => ['p-richtexteditor-button', { 'p-richtexteditor-button-active': active }],
    buttonIcon: ({ name }) => ['p-richtexteditor-button-icon', `p-richtexteditor-icon-${name}`],
    separator: 'p-richtexteditor-separator',
    content: 'p-richtexteditor-content',
    editor: 'p-richtexteditor-editor',
    linkPanel: 'p-richtexteditor-link-panel',
    linkLabel: 'p-richtexteditor-link-label',
    linkInput: 'p-richtexteditor-link-input',
    linkError: 'p-richtexteditor-link-error',
    linkActions: 'p-richtexteditor-link-actions',
    linkButton: ({ kind }) => ['p-richtexteditor-link-button', `p-richtexteditor-link-${kind}`],
    footer: 'p-richtexteditor-footer',
    count: ({ instance }) => ['p-richtexteditor-count', { 'p-richtexteditor-count-limit': !!instance.maxLength() && instance.characters() >= instance.maxLength() }]
};

@Injectable()
export class RichTextEditorStyle extends BaseStyle {
    name = 'richtexteditor';

    style = richtexteditor_style;

    classes = classes;
}

/**
 *
 * RichTextEditor is a rich text editor built on Tiptap, with a themed and accessible toolbar.
 *
 * [Live Demo](https://exhaustive-ui.com/richtexteditor/)
 *
 * @module richtexteditorstyle
 *
 */
export enum RichTextEditorClasses {
    /**
     * Class name of the root element
     */
    root = 'p-richtexteditor',
    /**
     * Class name of the toolbar element
     */
    toolbar = 'p-richtexteditor-toolbar',
    /**
     * Class name of a toolbar button
     */
    button = 'p-richtexteditor-button',
    /**
     * Class name of a toolbar button icon
     */
    buttonIcon = 'p-richtexteditor-button-icon',
    /**
     * Class name of a toolbar separator
     */
    separator = 'p-richtexteditor-separator',
    /**
     * Class name of the content element
     */
    content = 'p-richtexteditor-content',
    /**
     * Class name of the editable element
     */
    editor = 'p-richtexteditor-editor',
    /**
     * Class name of the link panel
     */
    linkPanel = 'p-richtexteditor-link-panel',
    /**
     * Class name of the link input
     */
    linkInput = 'p-richtexteditor-link-input',
    /**
     * Class name of a link panel button
     */
    linkButton = 'p-richtexteditor-link-button',
    /**
     * Class name of the footer
     */
    footer = 'p-richtexteditor-footer',
    /**
     * Class name of the character count
     */
    count = 'p-richtexteditor-count'
}

export interface RichTextEditorStyle extends BaseStyle {}
