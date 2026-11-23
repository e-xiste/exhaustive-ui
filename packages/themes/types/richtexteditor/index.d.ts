/**
 *
 * RichTextEditor Design Tokens
 *
 * @module richtexteditor
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace RichTextEditorTokenSections {
    interface Root {
        /**
         * Background
         *
         * @designToken richtexteditor.background
         */
        background?: string;
        /**
         * Background in disabled state
         *
         * @designToken richtexteditor.disabled.background
         */
        disabledBackground?: string;
        /**
         * Background of the filled variant
         *
         * @designToken richtexteditor.filled.background
         */
        filledBackground?: string;
        /**
         * Background of the filled variant while focused
         *
         * @designToken richtexteditor.filled.focus.background
         */
        filledFocusBackground?: string;
        /**
         * Border color
         *
         * @designToken richtexteditor.border.color
         */
        borderColor?: string;
        /**
         * Border color while hovered
         *
         * @designToken richtexteditor.hover.border.color
         */
        hoverBorderColor?: string;
        /**
         * Border color while the editable area is focused
         *
         * @designToken richtexteditor.focus.border.color
         */
        focusBorderColor?: string;
        /**
         * Border color in invalid state
         *
         * @designToken richtexteditor.invalid.border.color
         */
        invalidBorderColor?: string;
        /**
         * Text color
         *
         * @designToken richtexteditor.color
         */
        color?: string;
        /**
         * Text color in disabled state
         *
         * @designToken richtexteditor.disabled.color
         */
        disabledColor?: string;
        /**
         * Shadow
         *
         * @designToken richtexteditor.shadow
         */
        shadow?: string;
        /**
         * Border radius
         *
         * @designToken richtexteditor.border.radius
         */
        borderRadius?: string;
        /**
         * Transition duration
         *
         * @designToken richtexteditor.transition.duration
         */
        transitionDuration?: string;
        focusRing?: {
            /**
             * Focus ring width of the root while the editable area is focused
             *
             * @designToken richtexteditor.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of the root while the editable area is focused
             *
             * @designToken richtexteditor.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of the root while the editable area is focused
             *
             * @designToken richtexteditor.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of the root while the editable area is focused
             *
             * @designToken richtexteditor.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of the root while the editable area is focused
             *
             * @designToken richtexteditor.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface Toolbar {
        /**
         * Background of the toolbar
         *
         * @designToken richtexteditor.toolbar.background
         */
        background?: string;
        /**
         * Border color between the toolbar and the content
         *
         * @designToken richtexteditor.toolbar.border.color
         */
        borderColor?: string;
        /**
         * Padding of the toolbar
         *
         * @designToken richtexteditor.toolbar.padding
         */
        padding?: string;
        /**
         * Gap between the buttons of the toolbar
         *
         * @designToken richtexteditor.toolbar.gap
         */
        gap?: string;
    }

    interface Separator {
        /**
         * Color of a separator
         *
         * @designToken richtexteditor.separator.background
         */
        background?: string;
        /**
         * Height of a separator
         *
         * @designToken richtexteditor.separator.height
         */
        height?: string;
        /**
         * Margin of a separator
         *
         * @designToken richtexteditor.separator.margin
         */
        margin?: string;
    }

    interface Button {
        /**
         * Size of a toolbar button
         *
         * @designToken richtexteditor.button.size
         */
        size?: string;
        /**
         * Border radius of a toolbar button
         *
         * @designToken richtexteditor.button.border.radius
         */
        borderRadius?: string;
        /**
         * Color of a toolbar button
         *
         * @designToken richtexteditor.button.color
         */
        color?: string;
        /**
         * Background of a hovered toolbar button
         *
         * @designToken richtexteditor.button.hover.background
         */
        hoverBackground?: string;
        /**
         * Color of a hovered toolbar button
         *
         * @designToken richtexteditor.button.hover.color
         */
        hoverColor?: string;
        /**
         * Background of a pressed toolbar button
         *
         * @designToken richtexteditor.button.active.background
         */
        activeBackground?: string;
        /**
         * Color of a pressed toolbar button
         *
         * @designToken richtexteditor.button.active.color
         */
        activeColor?: string;
        /**
         * Size of a toolbar button icon
         *
         * @designToken richtexteditor.button.icon.size
         */
        iconSize?: string;
        /**
         * Font size of the letters of a toolbar button
         *
         * @designToken richtexteditor.button.font.size
         */
        fontSize?: string;
        focusRing?: {
            /**
             * Focus ring width of a toolbar button
             *
             * @designToken richtexteditor.button.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of a toolbar button
             *
             * @designToken richtexteditor.button.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of a toolbar button
             *
             * @designToken richtexteditor.button.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of a toolbar button
             *
             * @designToken richtexteditor.button.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of a toolbar button
             *
             * @designToken richtexteditor.button.focus.ring.shadow
             */
            shadow?: string;
        };
        sm?: {
            /**
             * Size of a toolbar button in the small size
             *
             * @designToken richtexteditor.button.sm.size
             */
            size?: string;
        };
        lg?: {
            /**
             * Size of a toolbar button in the large size
             *
             * @designToken richtexteditor.button.lg.size
             */
            size?: string;
        };
    }

    interface Content {
        /**
         * Padding of the editable area
         *
         * @designToken richtexteditor.content.padding
         */
        padding?: string;
        /**
         * Minimum height of the editable area
         *
         * @designToken richtexteditor.content.min.height
         */
        minHeight?: string;
        /**
         * Font size of the editable area
         *
         * @designToken richtexteditor.content.font.size
         */
        fontSize?: string;
        /**
         * Line height of the editable area
         *
         * @designToken richtexteditor.content.line.height
         */
        lineHeight?: string;
        /**
         * Space between two blocks of the content
         *
         * @designToken richtexteditor.content.gap
         */
        gap?: string;
        /**
         * Color of the placeholder
         *
         * @designToken richtexteditor.content.placeholder.color
         */
        placeholderColor?: string;
        sm?: {
            /**
             * Font size of the small size
             *
             * @designToken richtexteditor.content.sm.font.size
             */
            fontSize?: string;
            /**
             * Padding of the small size
             *
             * @designToken richtexteditor.content.sm.padding
             */
            padding?: string;
        };
        lg?: {
            /**
             * Font size of the large size
             *
             * @designToken richtexteditor.content.lg.font.size
             */
            fontSize?: string;
            /**
             * Padding of the large size
             *
             * @designToken richtexteditor.content.lg.padding
             */
            padding?: string;
        };
    }

    interface Heading {
        /**
         * Color of the headings
         *
         * @designToken richtexteditor.heading.color
         */
        color?: string;
        /**
         * Font weight of the headings
         *
         * @designToken richtexteditor.heading.font.weight
         */
        fontWeight?: string;
        /**
         * Line height of the headings
         *
         * @designToken richtexteditor.heading.line.height
         */
        lineHeight?: string;
        h1?: {
            /**
             * Font size of a heading 1
             *
             * @designToken richtexteditor.heading.h1.font.size
             */
            fontSize?: string;
        };
        h2?: {
            /**
             * Font size of a heading 2
             *
             * @designToken richtexteditor.heading.h2.font.size
             */
            fontSize?: string;
        };
        h3?: {
            /**
             * Font size of a heading 3
             *
             * @designToken richtexteditor.heading.h3.font.size
             */
            fontSize?: string;
        };
    }

    interface Link {
        /**
         * Color of a link
         *
         * @designToken richtexteditor.link.color
         */
        color?: string;
        /**
         * Color of a hovered link
         *
         * @designToken richtexteditor.link.hover.color
         */
        hoverColor?: string;
    }

    interface Code {
        /**
         * Color of inline code
         *
         * @designToken richtexteditor.code.color
         */
        color?: string;
        /**
         * Border radius of inline code
         *
         * @designToken richtexteditor.code.border.radius
         */
        borderRadius?: string;
        /**
         * Padding of inline code
         *
         * @designToken richtexteditor.code.padding
         */
        padding?: string;
        /**
         * Font size of inline code and code blocks
         *
         * @designToken richtexteditor.code.font.size
         */
        fontSize?: string;
        /**
         * Background of inline code
         *
         * @designToken richtexteditor.code.background
         */
        background?: string;
    }

    interface CodeBlock {
        /**
         * Border radius of a code block
         *
         * @designToken richtexteditor.code.block.border.radius
         */
        borderRadius?: string;
        /**
         * Padding of a code block
         *
         * @designToken richtexteditor.code.block.padding
         */
        padding?: string;
        /**
         * Background of a code block
         *
         * @designToken richtexteditor.code.block.background
         */
        background?: string;
        /**
         * Text color of a code block
         *
         * @designToken richtexteditor.code.block.color
         */
        color?: string;
    }

    interface Blockquote {
        /**
         * Text color of a quote
         *
         * @designToken richtexteditor.blockquote.color
         */
        color?: string;
        /**
         * Width of the border of a quote
         *
         * @designToken richtexteditor.blockquote.border.width
         */
        borderWidth?: string;
        /**
         * Padding of a quote
         *
         * @designToken richtexteditor.blockquote.padding
         */
        padding?: string;
        /**
         * Border color of a quote
         *
         * @designToken richtexteditor.blockquote.border.color
         */
        borderColor?: string;
    }

    interface LinkPanel {
        /**
         * Background of the link panel
         *
         * @designToken richtexteditor.link.panel.background
         */
        background?: string;
        /**
         * Border color of the link panel
         *
         * @designToken richtexteditor.link.panel.border.color
         */
        borderColor?: string;
        /**
         * Text color of the link panel
         *
         * @designToken richtexteditor.link.panel.color
         */
        color?: string;
        /**
         * Border radius of the link panel
         *
         * @designToken richtexteditor.link.panel.border.radius
         */
        borderRadius?: string;
        /**
         * Shadow of the link panel
         *
         * @designToken richtexteditor.link.panel.shadow
         */
        shadow?: string;
        /**
         * Padding of the link panel
         *
         * @designToken richtexteditor.link.panel.padding
         */
        padding?: string;
        /**
         * Gap between the elements of the link panel
         *
         * @designToken richtexteditor.link.panel.gap
         */
        gap?: string;
        /**
         * Width of the link panel
         *
         * @designToken richtexteditor.link.panel.width
         */
        width?: string;
        /**
         * Color of the error message of the link panel
         *
         * @designToken richtexteditor.link.panel.error.color
         */
        errorColor?: string;
    }

    interface LinkInput {
        /**
         * Background of the link input
         *
         * @designToken richtexteditor.link.input.background
         */
        background?: string;
        /**
         * Border color of the link input
         *
         * @designToken richtexteditor.link.input.border.color
         */
        borderColor?: string;
        /**
         * Border color of the focused link input
         *
         * @designToken richtexteditor.link.input.focus.border.color
         */
        focusBorderColor?: string;
        /**
         * Border color of the link input in invalid state
         *
         * @designToken richtexteditor.link.input.invalid.border.color
         */
        invalidBorderColor?: string;
        /**
         * Text color of the link input
         *
         * @designToken richtexteditor.link.input.color
         */
        color?: string;
        /**
         * Placeholder color of the link input
         *
         * @designToken richtexteditor.link.input.placeholder.color
         */
        placeholderColor?: string;
        /**
         * Border radius of the link input
         *
         * @designToken richtexteditor.link.input.border.radius
         */
        borderRadius?: string;
        /**
         * Padding of the link input
         *
         * @designToken richtexteditor.link.input.padding
         */
        padding?: string;
        focusRing?: {
            /**
             * Focus ring width of the link input
             *
             * @designToken richtexteditor.link.input.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of the link input
             *
             * @designToken richtexteditor.link.input.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of the link input
             *
             * @designToken richtexteditor.link.input.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of the link input
             *
             * @designToken richtexteditor.link.input.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of the link input
             *
             * @designToken richtexteditor.link.input.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface LinkButton {
        /**
         * Padding of a link panel button
         *
         * @designToken richtexteditor.link.button.padding
         */
        padding?: string;
        /**
         * Border radius of a link panel button
         *
         * @designToken richtexteditor.link.button.border.radius
         */
        borderRadius?: string;
        /**
         * Color of a link panel button
         *
         * @designToken richtexteditor.link.button.color
         */
        color?: string;
        /**
         * Background of a hovered link panel button
         *
         * @designToken richtexteditor.link.button.hover.background
         */
        hoverBackground?: string;
        /**
         * Background of the apply button
         *
         * @designToken richtexteditor.link.button.apply.background
         */
        applyBackground?: string;
        /**
         * Background of the hovered apply button
         *
         * @designToken richtexteditor.link.button.apply.hover.background
         */
        applyHoverBackground?: string;
        /**
         * Color of the apply button
         *
         * @designToken richtexteditor.link.button.apply.color
         */
        applyColor?: string;
        /**
         * Font weight of a link panel button
         *
         * @designToken richtexteditor.link.button.font.weight
         */
        fontWeight?: string;
        focusRing?: {
            /**
             * Focus ring width of a link panel button
             *
             * @designToken richtexteditor.link.button.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of a link panel button
             *
             * @designToken richtexteditor.link.button.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of a link panel button
             *
             * @designToken richtexteditor.link.button.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of a link panel button
             *
             * @designToken richtexteditor.link.button.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of a link panel button
             *
             * @designToken richtexteditor.link.button.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface Footer {
        /**
         * Padding of the footer
         *
         * @designToken richtexteditor.footer.padding
         */
        padding?: string;
        /**
         * Text color of the footer
         *
         * @designToken richtexteditor.footer.color
         */
        color?: string;
        /**
         * Font size of the footer
         *
         * @designToken richtexteditor.footer.font.size
         */
        fontSize?: string;
        /**
         * Border color between the content and the footer
         *
         * @designToken richtexteditor.footer.border.color
         */
        borderColor?: string;
        /**
         * Color of the count when the limit is reached
         *
         * @designToken richtexteditor.footer.limit.color
         */
        limitColor?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<RichTextEditorDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _RichTextEditor Design Tokens_
 *
 * @group components
 * @module richtexteditor
 * @see
 * --- ---
 * **Compatible Libraries**
 *
 * [ExhaustiveUI](https://exhaustive-ui.com/theming/styled)
 *
 */
export interface RichTextEditorDesignTokens extends DesignTokens<RichTextEditorDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: RichTextEditorTokenSections.Root;
    /**
     * Used to pass tokens of the toolbar section
     */
    toolbar?: RichTextEditorTokenSections.Toolbar;
    /**
     * Used to pass tokens of the separator section
     */
    separator?: RichTextEditorTokenSections.Separator;
    /**
     * Used to pass tokens of the button section
     */
    button?: RichTextEditorTokenSections.Button;
    /**
     * Used to pass tokens of the content section
     */
    content?: RichTextEditorTokenSections.Content;
    /**
     * Used to pass tokens of the heading section
     */
    heading?: RichTextEditorTokenSections.Heading;
    /**
     * Used to pass tokens of the link section
     */
    link?: RichTextEditorTokenSections.Link;
    /**
     * Used to pass tokens of the code section
     */
    code?: RichTextEditorTokenSections.Code;
    /**
     * Used to pass tokens of the code block section
     */
    codeBlock?: RichTextEditorTokenSections.CodeBlock;
    /**
     * Used to pass tokens of the blockquote section
     */
    blockquote?: RichTextEditorTokenSections.Blockquote;
    /**
     * Used to pass tokens of the link panel section
     */
    linkPanel?: RichTextEditorTokenSections.LinkPanel;
    /**
     * Used to pass tokens of the link input section
     */
    linkInput?: RichTextEditorTokenSections.LinkInput;
    /**
     * Used to pass tokens of the link button section
     */
    linkButton?: RichTextEditorTokenSections.LinkButton;
    /**
     * Used to pass tokens of the footer section
     */
    footer?: RichTextEditorTokenSections.Footer;
}
