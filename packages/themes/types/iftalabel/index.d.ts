/**
 *
 * IftaLabel Design Tokens
 *
 * @module iftalabel
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace IftaLabelTokenSections {
    interface Root {
        /**
         * Color of root
         *
         * @designToken iftalabel.color
         */
        color?: string;
        /**
         * Focus color of root
         *
         * @designToken iftalabel.focus.color
         */
        focusColor?: string;
        /**
         * Invalid color of root
         *
         * @designToken iftalabel.invalid.color
         */
        invalidColor?: string;
        /**
         * Transition duration of root
         *
         * @designToken iftalabel.transition.duration
         */
        transitionDuration?: string;
        /**
         * Position x of root
         *
         * @designToken iftalabel.position.x
         */
        positionX?: string;
        /**
         * Top of root
         *
         * @designToken iftalabel.top
         */
        top?: string;
        /**
         * Font size of root
         *
         * @designToken iftalabel.font.size
         */
        fontSize?: string;
        /**
         * Font weight of root
         *
         * @designToken iftalabel.font.weight
         */
        fontWeight?: string;
        /**
         * Sm of root
         */
        sm?: {
            /**
             * Sm position x of root
             *
             * @designToken iftalabel.sm.position.x
             */
            positionX?: string;
            /**
             * Sm top of root
             *
             * @designToken iftalabel.sm.top
             */
            top?: string;
            /**
             * Sm font size of root
             *
             * @designToken iftalabel.sm.font.size
             */
            fontSize?: string;
        };
        /**
         * Lg of root
         */
        lg?: {
            /**
             * Lg position x of root
             *
             * @designToken iftalabel.lg.position.x
             */
            positionX?: string;
            /**
             * Lg top of root
             *
             * @designToken iftalabel.lg.top
             */
            top?: string;
            /**
             * Lg font size of root
             *
             * @designToken iftalabel.lg.font.size
             */
            fontSize?: string;
        };
    }

    interface Input {
        /**
         * Padding top of input
         *
         * @designToken iftalabel.input.padding.top
         */
        paddingTop?: string;
        /**
         * Padding bottom of input
         *
         * @designToken iftalabel.input.padding.bottom
         */
        paddingBottom?: string;
        /**
         * Sm of input
         */
        sm?: {
            /**
             * Sm padding top of input
             *
             * @designToken iftalabel.input.sm.padding.top
             */
            paddingTop?: string;
            /**
             * Sm padding bottom of input
             *
             * @designToken iftalabel.input.sm.padding.bottom
             */
            paddingBottom?: string;
        };
        /**
         * Lg of input
         */
        lg?: {
            /**
             * Lg padding top of input
             *
             * @designToken iftalabel.input.lg.padding.top
             */
            paddingTop?: string;
            /**
             * Lg padding bottom of input
             *
             * @designToken iftalabel.input.lg.padding.bottom
             */
            paddingBottom?: string;
        };
    }

    /* Static Sections */
    type ColorScheme = CS<IftaLabelDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _IftaLabel Design Tokens_
 *
 * @group components
 * @module iftalabel
 * @see
 * --- ---
 * **Compatible Libraries**
 *
 * [ExhaustiveUI](https://exhaustive-ui.com/theming/styled)
 *
 */
export interface IftaLabelDesignTokens extends DesignTokens<IftaLabelDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: IftaLabelTokenSections.Root;
    /**
     * Used to pass tokens of the input section
     */
    input?: IftaLabelTokenSections.Input;
}
