/**
 *
 * Tour Design Tokens
 *
 * @module tour
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace TourTokenSections {
    interface Root {
        /**
         * Transition duration of root
         *
         * @designToken tour.transition.duration
         */
        transitionDuration?: string;
    }

    interface Mask {
        /**
         * Background of mask
         *
         * @designToken tour.mask.background
         */
        background?: string;
    }

    interface Spotlight {
        /**
         * Shadow of spotlight
         *
         * @designToken tour.spotlight.shadow
         */
        shadow?: string;
    }

    interface Card {
        /**
         * Background of card
         *
         * @designToken tour.card.background
         */
        background?: string;
        /**
         * Border color of card
         *
         * @designToken tour.card.border.color
         */
        borderColor?: string;
        /**
         * Color of card
         *
         * @designToken tour.card.color
         */
        color?: string;
        /**
         * Border radius of card
         *
         * @designToken tour.card.border.radius
         */
        borderRadius?: string;
        /**
         * Shadow of card
         *
         * @designToken tour.card.shadow
         */
        shadow?: string;
        /**
         * Padding of card
         *
         * @designToken tour.card.padding
         */
        padding?: string;
        /**
         * Width of card
         *
         * @designToken tour.card.width
         */
        width?: string;
        /**
         * Gap of card
         *
         * @designToken tour.card.gap
         */
        gap?: string;
        /**
         * @deprecated since 22.8.5, the card no longer shows a focus ring: it is the target of the focus when a step opens, not a control.
         */
        focusRing?: {
            /**
             * Focus ring width of card
             *
             * @designToken tour.card.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of card
             *
             * @designToken tour.card.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of card
             *
             * @designToken tour.card.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of card
             *
             * @designToken tour.card.focus.ring.offset
             */
            offset?: string;
        };
    }

    interface Arrow {
        /**
         * Size of arrow
         *
         * @designToken tour.arrow.size
         */
        size?: string;
    }

    interface Header {
        /**
         * Gap of header
         *
         * @designToken tour.header.gap
         */
        gap?: string;
    }

    interface Title {
        /**
         * Font size of title
         *
         * @designToken tour.title.font.size
         */
        fontSize?: string;
        /**
         * Font weight of title
         *
         * @designToken tour.title.font.weight
         */
        fontWeight?: string;
    }

    interface Footer {
        /**
         * Gap of footer
         *
         * @designToken tour.footer.gap
         */
        gap?: string;
    }

    interface Counter {
        /**
         * Color of counter
         *
         * @designToken tour.counter.color
         */
        color?: string;
        /**
         * Font size of counter
         *
         * @designToken tour.counter.font.size
         */
        fontSize?: string;
    }

    interface Dot {
        /**
         * Size of dot
         *
         * @designToken tour.dot.size
         */
        size?: string;
        /**
         * Gap of dot
         *
         * @designToken tour.dot.gap
         */
        gap?: string;
        /**
         * Background of dot
         *
         * @designToken tour.dot.background
         */
        background?: string;
        /**
         * Active background of dot
         *
         * @designToken tour.dot.active.background
         */
        activeBackground?: string;
        /**
         * Active width of dot
         *
         * @designToken tour.dot.active.width
         */
        activeWidth?: string;
    }

    interface Actions {
        /**
         * Gap of actions
         *
         * @designToken tour.actions.gap
         */
        gap?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<TourDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Tour Design Tokens_
 *
 * @group components
 * @module tour
 * @see
 * --- ---
 * **Compatible Libraries**
 *
 * [ExhaustiveUI](https://exhaustive-ui.com/theming/styled)
 *
 */
export interface TourDesignTokens extends DesignTokens<TourDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: TourTokenSections.Root;
    /**
     * Used to pass tokens of the mask section
     */
    mask?: TourTokenSections.Mask;
    /**
     * Used to pass tokens of the spotlight section
     */
    spotlight?: TourTokenSections.Spotlight;
    /**
     * Used to pass tokens of the card section
     */
    card?: TourTokenSections.Card;
    /**
     * Used to pass tokens of the arrow section
     */
    arrow?: TourTokenSections.Arrow;
    /**
     * Used to pass tokens of the header section
     */
    header?: TourTokenSections.Header;
    /**
     * Used to pass tokens of the title section
     */
    title?: TourTokenSections.Title;
    /**
     * Used to pass tokens of the footer section
     */
    footer?: TourTokenSections.Footer;
    /**
     * Used to pass tokens of the counter section
     */
    counter?: TourTokenSections.Counter;
    /**
     * Used to pass tokens of the dot section
     */
    dot?: TourTokenSections.Dot;
    /**
     * Used to pass tokens of the actions section
     */
    actions?: TourTokenSections.Actions;
}
