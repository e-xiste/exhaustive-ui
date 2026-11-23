import { TemplateRef } from '@angular/core';
import { PassThrough, PassThroughOption } from '@exhaustive-ui/core/api';

/**
 * Custom passthrough(pt) options.
 * @template I Type of instance.
 *
 * @see {@link RichTextEditor.pt}
 * @group Interface
 */
export interface RichTextEditorPassThroughOptions<I = unknown> {
    /**
     * Used to pass attributes to the root's DOM element.
     */
    root?: PassThroughOption<HTMLElement, I>;
    /**
     * Used to pass attributes to the toolbar's DOM element.
     */
    toolbar?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to a toolbar button's DOM element.
     */
    button?: PassThroughOption<HTMLButtonElement, I>;
    /**
     * Used to pass attributes to a toolbar button icon's DOM element.
     */
    buttonIcon?: PassThroughOption<SVGElement | HTMLSpanElement, I>;
    /**
     * Used to pass attributes to a toolbar separator's DOM element.
     */
    separator?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the content's DOM element, the container of the editable area.
     */
    content?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the link panel's DOM element.
     */
    linkPanel?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the link input's DOM element.
     */
    linkInput?: PassThroughOption<HTMLInputElement, I>;
    /**
     * Used to pass attributes to the buttons of the link panel.
     */
    linkButton?: PassThroughOption<HTMLButtonElement, I>;
    /**
     * Used to pass attributes to the footer's DOM element.
     */
    footer?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the character count's DOM element.
     */
    count?: PassThroughOption<HTMLSpanElement, I>;
}

/**
 * Defines valid pass-through options in RichTextEditor component.
 * @see {@link RichTextEditorPassThroughOptions}
 *
 * @template I Type of instance.
 */
export type RichTextEditorPassThrough<I = unknown> = PassThrough<I, RichTextEditorPassThroughOptions<I>>;

/**
 * A button of the toolbar. `textAlign` adds the four alignment buttons.
 * @group Types
 */
export type RichTextEditorToolbarItem =
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strike'
    | 'code'
    | 'heading1'
    | 'heading2'
    | 'heading3'
    | 'bulletList'
    | 'orderedList'
    | 'blockquote'
    | 'codeBlock'
    | 'link'
    | 'textAlign'
    | 'alignLeft'
    | 'alignCenter'
    | 'alignRight'
    | 'alignJustify'
    | 'undo'
    | 'redo'
    | 'clear';

/**
 * Items of the toolbar, in order. `'|'` draws a separator between two groups of buttons.
 * @group Types
 */
export type RichTextEditorToolbar = (RichTextEditorToolbarItem | '|')[];

/**
 * Format of the value: an HTML string, or the JSON document of Tiptap.
 * @group Types
 */
export type RichTextEditorFormat = 'html' | 'json';

/**
 * Texts of the component. Every key is optional in the `labels` input and merged with the English defaults.
 * @group Interface
 */
export interface RichTextEditorLabels {
    /**
     * Accessible name of the toolbar.
     */
    toolbar: string;
    /**
     * Bold button.
     */
    bold: string;
    /**
     * Italic button.
     */
    italic: string;
    /**
     * Underline button.
     */
    underline: string;
    /**
     * Strikethrough button.
     */
    strike: string;
    /**
     * Inline code button.
     */
    code: string;
    /**
     * Heading 1 button.
     */
    heading1: string;
    /**
     * Heading 2 button.
     */
    heading2: string;
    /**
     * Heading 3 button.
     */
    heading3: string;
    /**
     * Bullet list button.
     */
    bulletList: string;
    /**
     * Numbered list button.
     */
    orderedList: string;
    /**
     * Quote button.
     */
    blockquote: string;
    /**
     * Code block button.
     */
    codeBlock: string;
    /**
     * Link button and title of the link panel.
     */
    link: string;
    /**
     * Align left button.
     */
    alignLeft: string;
    /**
     * Align center button.
     */
    alignCenter: string;
    /**
     * Align right button.
     */
    alignRight: string;
    /**
     * Justify button.
     */
    alignJustify: string;
    /**
     * Undo button.
     */
    undo: string;
    /**
     * Redo button.
     */
    redo: string;
    /**
     * Clear formatting button.
     */
    clear: string;
    /**
     * Label of the URL field of the link panel.
     */
    linkUrl: string;
    /**
     * Button that applies the link.
     */
    linkApply: string;
    /**
     * Button that removes the link.
     */
    linkRemove: string;
    /**
     * Button that closes the link panel.
     */
    linkCancel: string;
    /**
     * Error shown when the URL is not valid.
     */
    linkInvalid: string;
    /**
     * Character count, `{0}` is the number of characters and `{1}` the maximum.
     */
    count: string;
    /**
     * Character count without a maximum, `{0}` is the number of characters.
     */
    countNoLimit: string;
    /**
     * Announced when the maximum number of characters is reached, `{0}` is the maximum.
     */
    limitReached: string;
}

/**
 * Custom init event.
 * @template E Type of the Tiptap editor, `Editor` from `@tiptap/core`.
 * @see {@link RichTextEditor.onInit}
 * @group Events
 */
export interface RichTextEditorInitEvent<E = any> {
    /**
     * The Tiptap editor instance.
     */
    editor: E;
}

/**
 * Custom text change event.
 * @template E Type of the Tiptap editor, `Editor` from `@tiptap/core`.
 * @see {@link RichTextEditor.onTextChange}
 * @group Events
 */
export interface RichTextEditorTextChangeEvent<E = any> {
    /**
     * Content as HTML, null when the editor is empty.
     */
    htmlValue: string | null;
    /**
     * Content as plain text.
     */
    textValue: string;
    /**
     * Content as a Tiptap JSON document.
     */
    jsonValue: Record<string, any>;
    /**
     * The Tiptap editor instance.
     */
    editor: E;
}

/**
 * Custom selection change event.
 * @template E Type of the Tiptap editor, `Editor` from `@tiptap/core`.
 * @see {@link RichTextEditor.onSelectionChange}
 * @group Events
 */
export interface RichTextEditorSelectionChangeEvent<E = any> {
    /**
     * Start position of the selection in the document.
     */
    from: number;
    /**
     * End position of the selection in the document.
     */
    to: number;
    /**
     * Whether the selection is collapsed to a caret.
     */
    empty: boolean;
    /**
     * The Tiptap editor instance.
     */
    editor: E;
}

/**
 * Custom focus and blur event.
 * @template E Type of the Tiptap editor, `Editor` from `@tiptap/core`.
 * @see {@link RichTextEditor.onFocus}
 * @see {@link RichTextEditor.onBlur}
 * @group Events
 */
export interface RichTextEditorFocusEvent<E = any> {
    /**
     * Browser event.
     */
    originalEvent: FocusEvent;
    /**
     * The Tiptap editor instance.
     */
    editor: E;
}

/**
 * Context of the toolbar template.
 * @template E Type of the Tiptap editor, `Editor` from `@tiptap/core`.
 * @group Interface
 */
export interface RichTextEditorToolbarTemplateContext<E = any> {
    /**
     * The Tiptap editor instance, undefined while it loads.
     */
    $implicit: E | undefined;
    /**
     * The Tiptap editor instance, undefined while it loads.
     */
    editor: E | undefined;
    /**
     * Whether a mark or a node is active at the selection, as `editor.isActive`. Read it in the template: the context is renewed after every change.
     */
    isActive: (name: string | Record<string, any>, attributes?: Record<string, any>) => boolean;
    /**
     * Whether the editor is disabled or readonly.
     */
    disabled: boolean;
    /**
     * Opens the link panel of the component.
     */
    openLink: () => void;
}

/**
 * Defines valid templates in RichTextEditor.
 * @group Templates
 */
export interface RichTextEditorTemplates {
    /**
     * Custom toolbar, replaces the default one.
     * @param {RichTextEditorToolbarTemplateContext} context - toolbar context.
     */
    toolbar(context: RichTextEditorToolbarTemplateContext): TemplateRef<RichTextEditorToolbarTemplateContext>;
}
