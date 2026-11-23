/**
 *
 * Kanban Design Tokens
 *
 * @module kanban
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace KanbanTokenSections {
    interface Root {
        /**
         * Transition duration
         *
         * @designToken kanban.transition.duration
         */
        transitionDuration?: string;
    }

    interface Board {
        /**
         * Gap between the columns
         *
         * @designToken kanban.board.gap
         */
        gap?: string;
        /**
         * Padding of the board, around the columns
         *
         * @designToken kanban.board.padding
         */
        padding?: string;
    }

    interface Column {
        /**
         * Background of a column
         *
         * @designToken kanban.column.background
         */
        background?: string;
        /**
         * Border color of a column
         *
         * @designToken kanban.column.border.color
         */
        borderColor?: string;
        /**
         * Border radius of a column
         *
         * @designToken kanban.column.border.radius
         */
        borderRadius?: string;
        /**
         * Width of a column
         *
         * @designToken kanban.column.width
         */
        width?: string;
        /**
         * Minimum width of a column
         *
         * @designToken kanban.column.min.width
         */
        minWidth?: string;
        /**
         * Width of a collapsed column
         *
         * @designToken kanban.column.collapsed.width
         */
        collapsedWidth?: string;
        /**
         * Padding of a column
         *
         * @designToken kanban.column.padding
         */
        padding?: string;
        /**
         * Gap between the cards
         *
         * @designToken kanban.column.gap
         */
        gap?: string;
        /**
         * Border color of a column holding more cards than its limit
         *
         * @designToken kanban.column.over.limit.border.color
         */
        overLimitBorderColor?: string;
        /**
         * Background of a column holding more cards than its limit
         *
         * @designToken kanban.column.over.limit.background
         */
        overLimitBackground?: string;
        /**
         * Border color of a column that refuses the dragged card
         *
         * @designToken kanban.column.refused.border.color
         */
        refusedBorderColor?: string;
        /**
         * Background of the card list while a card is dragged over it
         *
         * @designToken kanban.column.drop.target.background
         */
        dropTargetBackground?: string;
        /**
         * Background of a collapsed column on hover
         *
         * @designToken kanban.column.collapsed.hover.background
         */
        collapsedHoverBackground?: string;
    }

    interface ColumnHeader {
        /**
         * Padding of a column header
         *
         * @designToken kanban.column.header.padding
         */
        padding?: string;
        /**
         * Gap between the items of a column header
         *
         * @designToken kanban.column.header.gap
         */
        gap?: string;
        /**
         * Text color of a column header
         *
         * @designToken kanban.column.header.color
         */
        color?: string;
        /**
         * Font weight of a column title
         *
         * @designToken kanban.column.header.font.weight
         */
        fontWeight?: string;
    }

    interface ColumnCount {
        /**
         * Padding of a card count
         *
         * @designToken kanban.column.count.padding
         */
        padding?: string;
        /**
         * Border radius of a card count
         *
         * @designToken kanban.column.count.border.radius
         */
        borderRadius?: string;
        /**
         * Font size of a card count
         *
         * @designToken kanban.column.count.font.size
         */
        fontSize?: string;
        /**
         * Font weight of a card count
         *
         * @designToken kanban.column.count.font.weight
         */
        fontWeight?: string;
        /**
         * Background of a card count
         *
         * @designToken kanban.column.count.background
         */
        background?: string;
        /**
         * Text color of a card count
         *
         * @designToken kanban.column.count.color
         */
        color?: string;
        /**
         * Background of a card count at the limit
         *
         * @designToken kanban.column.count.full.background
         */
        fullBackground?: string;
        /**
         * Text color of a card count at the limit
         *
         * @designToken kanban.column.count.full.color
         */
        fullColor?: string;
        /**
         * Background of a card count over the limit
         *
         * @designToken kanban.column.count.over.limit.background
         */
        overLimitBackground?: string;
        /**
         * Text color of a card count over the limit
         *
         * @designToken kanban.column.count.over.limit.color
         */
        overLimitColor?: string;
    }

    interface ColumnAction {
        /**
         * Size of the drag handle and collapse buttons
         *
         * @designToken kanban.column.action.size
         */
        size?: string;
        /**
         * Border radius of the drag handle and collapse buttons
         *
         * @designToken kanban.column.action.border.radius
         */
        borderRadius?: string;
        /**
         * Color of the drag handle and collapse buttons
         *
         * @designToken kanban.column.action.color
         */
        color?: string;
        /**
         * Color of the drag handle and collapse buttons while hovered
         *
         * @designToken kanban.column.action.hover.color
         */
        hoverColor?: string;
        /**
         * Background of the drag handle and collapse buttons while hovered
         *
         * @designToken kanban.column.action.hover.background
         */
        hoverBackground?: string;
        /**
         * Background of a drag handle while its column is picked up
         *
         * @designToken kanban.column.action.grabbed.background
         */
        grabbedBackground?: string;
        /**
         * Color of a drag handle while its column is picked up
         *
         * @designToken kanban.column.action.grabbed.color
         */
        grabbedColor?: string;
        focusRing?: {
            /**
             * Focus ring width of the column buttons
             *
             * @designToken kanban.column.action.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of the column buttons
             *
             * @designToken kanban.column.action.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of the column buttons
             *
             * @designToken kanban.column.action.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of the column buttons
             *
             * @designToken kanban.column.action.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of the column buttons
             *
             * @designToken kanban.column.action.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface Card {
        /**
         * Background of a card
         *
         * @designToken kanban.card.background
         */
        background?: string;
        /**
         * Border color of a card
         *
         * @designToken kanban.card.border.color
         */
        borderColor?: string;
        /**
         * Border color of a card while hovered
         *
         * @designToken kanban.card.hover.border.color
         */
        hoverBorderColor?: string;
        /**
         * Border radius of a card
         *
         * @designToken kanban.card.border.radius
         */
        borderRadius?: string;
        /**
         * Padding of a card
         *
         * @designToken kanban.card.padding
         */
        padding?: string;
        /**
         * Text color of a card
         *
         * @designToken kanban.card.color
         */
        color?: string;
        /**
         * Shadow of a card
         *
         * @designToken kanban.card.shadow
         */
        shadow?: string;
        /**
         * Border color of a card picked up with the keyboard
         *
         * @designToken kanban.card.grabbed.border.color
         */
        grabbedBorderColor?: string;
        /**
         * Shadow of a card picked up with the keyboard
         *
         * @designToken kanban.card.grabbed.shadow
         */
        grabbedShadow?: string;
        /**
         * Background of a card in a disabled column
         *
         * @designToken kanban.card.disabled.background
         */
        disabledBackground?: string;
        /**
         * Text color of a card in a disabled column
         *
         * @designToken kanban.card.disabled.color
         */
        disabledColor?: string;
        focusRing?: {
            /**
             * Focus ring width of a card
             *
             * @designToken kanban.card.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of a card
             *
             * @designToken kanban.card.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of a card
             *
             * @designToken kanban.card.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of a card
             *
             * @designToken kanban.card.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of a card
             *
             * @designToken kanban.card.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface Placeholder {
        /**
         * Background of the drop placeholder
         *
         * @designToken kanban.placeholder.background
         */
        background?: string;
        /**
         * Border color of the drop placeholder
         *
         * @designToken kanban.placeholder.border.color
         */
        borderColor?: string;
        /**
         * Border radius of the drop placeholder
         *
         * @designToken kanban.placeholder.border.radius
         */
        borderRadius?: string;
    }

    interface Preview {
        /**
         * Shadow of the dragged card or column
         *
         * @designToken kanban.preview.shadow
         */
        shadow?: string;
    }

    interface Empty {
        /**
         * Padding of the empty message
         *
         * @designToken kanban.empty.padding
         */
        padding?: string;
        /**
         * Text color of the empty message
         *
         * @designToken kanban.empty.color
         */
        color?: string;
        /**
         * Font size of the empty message
         *
         * @designToken kanban.empty.font.size
         */
        fontSize?: string;
        /**
         * Border color of the empty message
         *
         * @designToken kanban.empty.border.color
         */
        borderColor?: string;
        /**
         * Border radius of the empty message
         *
         * @designToken kanban.empty.border.radius
         */
        borderRadius?: string;
    }

    interface AddButton {
        /**
         * Padding of the add card button
         *
         * @designToken kanban.add.button.padding
         */
        padding?: string;
        /**
         * Gap between the icon and the text of the add card button
         *
         * @designToken kanban.add.button.gap
         */
        gap?: string;
        /**
         * Border radius of the add card button
         *
         * @designToken kanban.add.button.border.radius
         */
        borderRadius?: string;
        /**
         * Text color of the add card button
         *
         * @designToken kanban.add.button.color
         */
        color?: string;
        /**
         * Text color of the add card button while hovered
         *
         * @designToken kanban.add.button.hover.color
         */
        hoverColor?: string;
        /**
         * Background of the add card button while hovered
         *
         * @designToken kanban.add.button.hover.background
         */
        hoverBackground?: string;
        /**
         * Font weight of the add card button
         *
         * @designToken kanban.add.button.font.weight
         */
        fontWeight?: string;
        focusRing?: {
            /**
             * Focus ring width of the add card button
             *
             * @designToken kanban.add.button.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of the add card button
             *
             * @designToken kanban.add.button.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of the add card button
             *
             * @designToken kanban.add.button.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of the add card button
             *
             * @designToken kanban.add.button.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of the add card button
             *
             * @designToken kanban.add.button.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    /* Static Sections */
    type ColorScheme = CS<KanbanDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Kanban Design Tokens_
 *
 * @group components
 * @module kanban
 * @see
 * --- ---
 * **Compatible Libraries**
 *
 * [ExhaustiveUI](https://exhaustive-ui.com/theming/styled)
 *
 */
export interface KanbanDesignTokens extends DesignTokens<KanbanDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: KanbanTokenSections.Root;
    /**
     * Used to pass tokens of the board section
     */
    board?: KanbanTokenSections.Board;
    /**
     * Used to pass tokens of the column section
     */
    column?: KanbanTokenSections.Column;
    /**
     * Used to pass tokens of the column header section
     */
    columnHeader?: KanbanTokenSections.ColumnHeader;
    /**
     * Used to pass tokens of the column count section
     */
    columnCount?: KanbanTokenSections.ColumnCount;
    /**
     * Used to pass tokens of the column action section
     */
    columnAction?: KanbanTokenSections.ColumnAction;
    /**
     * Used to pass tokens of the card section
     */
    card?: KanbanTokenSections.Card;
    /**
     * Used to pass tokens of the placeholder section
     */
    placeholder?: KanbanTokenSections.Placeholder;
    /**
     * Used to pass tokens of the preview section
     */
    preview?: KanbanTokenSections.Preview;
    /**
     * Used to pass tokens of the empty section
     */
    empty?: KanbanTokenSections.Empty;
    /**
     * Used to pass tokens of the add button section
     */
    addButton?: KanbanTokenSections.AddButton;
}
