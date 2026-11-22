/**
 *
 * FloatLabel Design Tokens
 *
 * @module floatlabel
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace FloatLabelTokenSections {
    interface Root {
        /**
         * Color of root
         *
         * @designToken floatlabel.color
         */
        color?: string;
        /**
         * Focus color of root
         *
         * @designToken floatlabel.focus.color
         */
        focusColor?: string;
        /**
         * Active color of root
         *
         * @designToken floatlabel.active.color
         */
        activeColor?: string;
        /**
         * Invalid color of root
         *
         * @designToken floatlabel.invalid.color
         */
        invalidColor?: string;
        /**
         * Transition duration of root
         *
         * @designToken floatlabel.transition.duration
         */
        transitionDuration?: string;
        /**
         * Position x of root
         *
         * @designToken floatlabel.position.x
         */
        positionX?: string;
        /**
         * Position y of root
         *
         * @designToken floatlabel.position.y
         */
        positionY?: string;
        /**
         * Font weight of root
         *
         * @designToken floatlabel.font.weight
         */
        fontWeight?: string;
        /**
         * Active of root
         */
        active?: {
            /**
             * Active font size of root
             *
             * @designToken floatlabel.active.font.size
             */
            fontSize?: string;
            /**
             * Active font weight of root
             *
             * @designToken floatlabel.active.font.weight
             */
            fontWeight?: string;
        };
        /**
         * Sm of root
         */
        sm?: {
            /**
             * Sm position x of root
             *
             * @designToken floatlabel.sm.position.x
             */
            positionX?: string;
            /**
             * Sm position y of root
             *
             * @designToken floatlabel.sm.position.y
             */
            positionY?: string;
            /**
             * Sm font size of root
             *
             * @designToken floatlabel.sm.font.size
             */
            fontSize?: string;
            /**
             * Sm active of root
             */
            active?: {
                /**
                 * Sm active font size of root
                 *
                 * @designToken floatlabel.sm.active.font.size
                 */
                fontSize?: string;
            };
        };
        /**
         * Lg of root
         */
        lg?: {
            /**
             * Lg position x of root
             *
             * @designToken floatlabel.lg.position.x
             */
            positionX?: string;
            /**
             * Lg position y of root
             *
             * @designToken floatlabel.lg.position.y
             */
            positionY?: string;
            /**
             * Lg font size of root
             *
             * @designToken floatlabel.lg.font.size
             */
            fontSize?: string;
            /**
             * Lg active of root
             */
            active?: {
                /**
                 * Lg active font size of root
                 *
                 * @designToken floatlabel.lg.active.font.size
                 */
                fontSize?: string;
            };
        };
    }

    interface Over {
        /**
         * Active of over
         */
        active?: {
            /**
             * Active top of over
             *
             * @designToken floatlabel.over.active.top
             */
            top?: string;
        };
    }

    interface In {
        /**
         * Input of in
         */
        input?: {
            /**
             * Input padding top of in
             *
             * @designToken floatlabel.in.input.padding.top
             */
            paddingTop?: string;
            /**
             * Input padding bottom of in
             *
             * @designToken floatlabel.in.input.padding.bottom
             */
            paddingBottom?: string;
        };
        /**
         * Active of in
         */
        active?: {
            /**
             * Active top of in
             *
             * @designToken floatlabel.in.active.top
             */
            top?: string;
        };
        /**
         * Sm of in
         */
        sm?: {
            /**
             * Sm input of in
             */
            input?: {
                /**
                 * Sm input padding top of in
                 *
                 * @designToken floatlabel.in.sm.input.padding.top
                 */
                paddingTop?: string;
                /**
                 * Sm input padding bottom of in
                 *
                 * @designToken floatlabel.in.sm.input.padding.bottom
                 */
                paddingBottom?: string;
            };
            /**
             * Sm active of in
             */
            active?: {
                /**
                 * Sm active top of in
                 *
                 * @designToken floatlabel.in.sm.active.top
                 */
                top?: string;
            };
        };
        /**
         * Lg of in
         */
        lg?: {
            /**
             * Lg input of in
             */
            input?: {
                /**
                 * Lg input padding top of in
                 *
                 * @designToken floatlabel.in.lg.input.padding.top
                 */
                paddingTop?: string;
                /**
                 * Lg input padding bottom of in
                 *
                 * @designToken floatlabel.in.lg.input.padding.bottom
                 */
                paddingBottom?: string;
            };
            /**
             * Lg active of in
             */
            active?: {
                /**
                 * Lg active top of in
                 *
                 * @designToken floatlabel.in.lg.active.top
                 */
                top?: string;
            };
        };
    }

    interface On {
        /**
         * Border radius of on
         *
         * @designToken floatlabel.on.border.radius
         */
        borderRadius?: string;
        /**
         * Active of on
         */
        active?: {
            /**
             * Active background of on
             *
             * @designToken floatlabel.on.active.background
             */
            background?: string;
            /**
             * Active padding of on
             *
             * @designToken floatlabel.on.active.padding
             */
            padding?: string;
        };
    }

    /* Static Sections */
    type ColorScheme = CS<FloatLabelDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _FloatLabel Design Tokens_
 *
 * @group components
 * @module floatlabel
 * @see
 * --- ---
 * **Compatible Libraries**
 *
 * [ExhaustiveUI](https://exhaustive-ui.com/theming/styled)
 *
 */
export interface FloatLabelDesignTokens extends DesignTokens<FloatLabelDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: FloatLabelTokenSections.Root;
    /**
     * Used to pass tokens of the over section
     */
    over?: FloatLabelTokenSections.Over;
    /**
     * Used to pass tokens of the in section
     */
    in?: FloatLabelTokenSections.In;
    /**
     * Used to pass tokens of the on section
     */
    on?: FloatLabelTokenSections.On;
}
