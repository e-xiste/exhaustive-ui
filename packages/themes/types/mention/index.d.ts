/**
 *
 * Mention Design Tokens
 *
 * @module mention
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace MentionTokenSections {
    interface Root {
        /**
         * Transition duration of the options
         *
         * @designToken mention.transition.duration
         */
        transitionDuration?: string;
    }

    interface Overlay {
        /**
         * Background of overlay
         *
         * @designToken mention.overlay.background
         */
        background?: string;
        /**
         * Border color of overlay
         *
         * @designToken mention.overlay.border.color
         */
        borderColor?: string;
        /**
         * Border radius of overlay
         *
         * @designToken mention.overlay.border.radius
         */
        borderRadius?: string;
        /**
         * Color of overlay
         *
         * @designToken mention.overlay.color
         */
        color?: string;
        /**
         * Shadow of overlay
         *
         * @designToken mention.overlay.shadow
         */
        shadow?: string;
        /**
         * Width of the overlay when it opens at the caret
         *
         * @designToken mention.overlay.width
         */
        width?: string;
    }

    interface List {
        /**
         * Padding of list
         *
         * @designToken mention.list.padding
         */
        padding?: string;
        /**
         * Gap of list
         *
         * @designToken mention.list.gap
         */
        gap?: string;
    }

    interface Option {
        /**
         * Focus background of option
         *
         * @designToken mention.option.focus.background
         */
        focusBackground?: string;
        /**
         * Color of option
         *
         * @designToken mention.option.color
         */
        color?: string;
        /**
         * Focus color of option
         *
         * @designToken mention.option.focus.color
         */
        focusColor?: string;
        /**
         * Padding of option
         *
         * @designToken mention.option.padding
         */
        padding?: string;
        /**
         * Border radius of option
         *
         * @designToken mention.option.border.radius
         */
        borderRadius?: string;
        /**
         * Gap between the parts of an option, an avatar and a name for instance
         *
         * @designToken mention.option.gap
         */
        gap?: string;
    }

    interface EmptyMessage {
        /**
         * Padding of empty message and loader
         *
         * @designToken mention.empty.message.padding
         */
        padding?: string;
        /**
         * Color of empty message and loader
         *
         * @designToken mention.empty.message.color
         */
        color?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<MentionDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Mention Design Tokens_
 *
 * @group components
 * @module mention
 * @see
 * --- ---
 * **Compatible Libraries**
 *
 * [ExhaustiveUI](https://exhaustive-ui.com/theming/styled)
 *
 */
export interface MentionDesignTokens extends DesignTokens<MentionDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: MentionTokenSections.Root;
    /**
     * Used to pass tokens of the overlay section
     */
    overlay?: MentionTokenSections.Overlay;
    /**
     * Used to pass tokens of the list section
     */
    list?: MentionTokenSections.List;
    /**
     * Used to pass tokens of the option section
     */
    option?: MentionTokenSections.Option;
    /**
     * Used to pass tokens of the empty message section
     */
    emptyMessage?: MentionTokenSections.EmptyMessage;
}
