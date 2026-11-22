/**
 *
 * FileInput Design Tokens
 *
 * @module fileinput
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace FileInputTokenSections {
    interface Root {
        /**
         * Gap between the dropzone, the summary and the file list
         *
         * @designToken fileinput.gap
         */
        gap?: string;
        /**
         * Transition duration
         *
         * @designToken fileinput.transition.duration
         */
        transitionDuration?: string;
    }

    interface Dropzone {
        /**
         * Background
         *
         * @designToken fileinput.dropzone.background
         */
        background?: string;
        /**
         * Border color
         *
         * @designToken fileinput.dropzone.border.color
         */
        borderColor?: string;
        /**
         * Border color while hovered
         *
         * @designToken fileinput.dropzone.hover.border.color
         */
        hoverBorderColor?: string;
        /**
         * Border color while files are dragged over
         *
         * @designToken fileinput.dropzone.active.border.color
         */
        activeBorderColor?: string;
        /**
         * Background while files are dragged over
         *
         * @designToken fileinput.dropzone.active.background
         */
        activeBackground?: string;
        /**
         * Text color
         *
         * @designToken fileinput.dropzone.color
         */
        color?: string;
        /**
         * Border color in invalid state
         *
         * @designToken fileinput.dropzone.invalid.border.color
         */
        invalidBorderColor?: string;
        /**
         * Background in disabled state
         *
         * @designToken fileinput.dropzone.disabled.background
         */
        disabledBackground?: string;
        /**
         * Text color in disabled state
         *
         * @designToken fileinput.dropzone.disabled.color
         */
        disabledColor?: string;
        /**
         * Border radius
         *
         * @designToken fileinput.dropzone.border.radius
         */
        borderRadius?: string;
        /**
         * Padding
         *
         * @designToken fileinput.dropzone.padding
         */
        padding?: string;
        /**
         * Gap between the icon, the label and the hint
         *
         * @designToken fileinput.dropzone.gap
         */
        gap?: string;
        /**
         * Font weight of the label
         *
         * @designToken fileinput.dropzone.font.weight
         */
        fontWeight?: string;
        focusRing?: {
            /**
             * Focus ring width of the dropzone
             *
             * @designToken fileinput.dropzone.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of the dropzone
             *
             * @designToken fileinput.dropzone.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of the dropzone
             *
             * @designToken fileinput.dropzone.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of the dropzone
             *
             * @designToken fileinput.dropzone.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of the dropzone
             *
             * @designToken fileinput.dropzone.focus.ring.shadow
             */
            shadow?: string;
        };
        sm?: {
            /**
             * Padding of the small size
             *
             * @designToken fileinput.dropzone.sm.padding
             */
            padding?: string;
            /**
             * Font size of the small size
             *
             * @designToken fileinput.dropzone.sm.font.size
             */
            fontSize?: string;
        };
        lg?: {
            /**
             * Padding of the large size
             *
             * @designToken fileinput.dropzone.lg.padding
             */
            padding?: string;
            /**
             * Font size of the large size
             *
             * @designToken fileinput.dropzone.lg.font.size
             */
            fontSize?: string;
        };
    }

    interface Icon {
        /**
         * Color of the dropzone icon
         *
         * @designToken fileinput.icon.color
         */
        color?: string;
        /**
         * Size of the dropzone icon
         *
         * @designToken fileinput.icon.size
         */
        size?: string;
    }

    interface Hint {
        /**
         * Color of the hint
         *
         * @designToken fileinput.hint.color
         */
        color?: string;
        /**
         * Font size of the hint
         *
         * @designToken fileinput.hint.font.size
         */
        fontSize?: string;
    }

    interface List {
        /**
         * Border color of the file list
         *
         * @designToken fileinput.list.border.color
         */
        borderColor?: string;
        /**
         * Border radius of the file list
         *
         * @designToken fileinput.list.border.radius
         */
        borderRadius?: string;
    }

    interface Item {
        /**
         * Padding of a file row
         *
         * @designToken fileinput.item.padding
         */
        padding?: string;
        /**
         * Gap inside a file row
         *
         * @designToken fileinput.item.gap
         */
        gap?: string;
        /**
         * Separator color between rows
         *
         * @designToken fileinput.item.border.color
         */
        borderColor?: string;
        /**
         * Background of a row in error
         *
         * @designToken fileinput.item.error.background
         */
        errorBackground?: string;
    }

    interface Thumbnail {
        /**
         * Size of a thumbnail
         *
         * @designToken fileinput.thumbnail.size
         */
        size?: string;
        /**
         * Border radius of a thumbnail
         *
         * @designToken fileinput.thumbnail.border.radius
         */
        borderRadius?: string;
        /**
         * Background of a thumbnail
         *
         * @designToken fileinput.thumbnail.background
         */
        background?: string;
        /**
         * Color of the file extension shown in a thumbnail
         *
         * @designToken fileinput.thumbnail.color
         */
        color?: string;
    }

    interface Meta {
        /**
         * Color of the size and status line
         *
         * @designToken fileinput.meta.color
         */
        color?: string;
        /**
         * Font size of the size and status line
         *
         * @designToken fileinput.meta.font.size
         */
        fontSize?: string;
        /**
         * Gap inside the size and status line
         *
         * @designToken fileinput.meta.gap
         */
        gap?: string;
    }

    interface Progress {
        /**
         * Height of a progress bar
         *
         * @designToken fileinput.progress.height
         */
        height?: string;
        /**
         * Border radius of a progress bar
         *
         * @designToken fileinput.progress.border.radius
         */
        borderRadius?: string;
        /**
         * Track color of a progress bar
         *
         * @designToken fileinput.progress.background
         */
        background?: string;
        /**
         * Value color of a progress bar
         *
         * @designToken fileinput.progress.value.background
         */
        valueBackground?: string;
    }

    interface Status {
        /**
         * Color of the uploaded status
         *
         * @designToken fileinput.status.success.color
         */
        successColor?: string;
        /**
         * Color of error messages
         *
         * @designToken fileinput.status.error.color
         */
        errorColor?: string;
    }

    interface Action {
        /**
         * Size of a row action button
         *
         * @designToken fileinput.action.size
         */
        size?: string;
        /**
         * Border radius of a row action button
         *
         * @designToken fileinput.action.border.radius
         */
        borderRadius?: string;
        /**
         * Color of a row action button
         *
         * @designToken fileinput.action.color
         */
        color?: string;
        /**
         * Color of a hovered row action button
         *
         * @designToken fileinput.action.hover.color
         */
        hoverColor?: string;
        /**
         * Background of a hovered row action button
         *
         * @designToken fileinput.action.hover.background
         */
        hoverBackground?: string;
        focusRing?: {
            /**
             * Focus ring width of the action
             *
             * @designToken fileinput.action.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style of the action
             *
             * @designToken fileinput.action.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color of the action
             *
             * @designToken fileinput.action.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset of the action
             *
             * @designToken fileinput.action.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow of the action
             *
             * @designToken fileinput.action.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface Summary {
        /**
         * Gap inside the upload summary
         *
         * @designToken fileinput.summary.gap
         */
        gap?: string;
        /**
         * Color of the upload summary
         *
         * @designToken fileinput.summary.color
         */
        color?: string;
        /**
         * Font size of the upload summary
         *
         * @designToken fileinput.summary.font.size
         */
        fontSize?: string;
    }

    interface Grid {
        /**
         * Gap between image tiles
         *
         * @designToken fileinput.grid.gap
         */
        gap?: string;
        /**
         * Minimum width of an image tile
         *
         * @designToken fileinput.grid.item.min.width
         */
        itemMinWidth?: string;
    }

    interface Tile {
        /**
         * Border radius of an image tile
         *
         * @designToken fileinput.tile.border.radius
         */
        borderRadius?: string;
        /**
         * Border color of an image tile
         *
         * @designToken fileinput.tile.border.color
         */
        borderColor?: string;
        /**
         * Border color of an image tile in error
         *
         * @designToken fileinput.tile.error.border.color
         */
        errorBorderColor?: string;
        /**
         * Background of an image tile
         *
         * @designToken fileinput.tile.background
         */
        background?: string;
        /**
         * Background of the progress overlay
         *
         * @designToken fileinput.tile.overlay.background
         */
        overlayBackground?: string;
        /**
         * Text color of the overlays
         *
         * @designToken fileinput.tile.overlay.color
         */
        overlayColor?: string;
        /**
         * Background of the error overlay
         *
         * @designToken fileinput.tile.error.overlay.background
         */
        errorOverlayBackground?: string;
        /**
         * Background of the tile action buttons and badge
         *
         * @designToken fileinput.tile.action.background
         */
        actionBackground?: string;
        /**
         * Color of the tile action buttons and badge
         *
         * @designToken fileinput.tile.action.color
         */
        actionColor?: string;
    }

    interface Avatar {
        /**
         * Size of the avatar
         *
         * @designToken fileinput.avatar.size
         */
        size?: string;
        /**
         * Background of the avatar
         *
         * @designToken fileinput.avatar.background
         */
        background?: string;
        /**
         * Border color of the avatar
         *
         * @designToken fileinput.avatar.border.color
         */
        borderColor?: string;
        /**
         * Icon color of an empty avatar
         *
         * @designToken fileinput.avatar.color
         */
        color?: string;
        /**
         * Border radius of the square avatar
         *
         * @designToken fileinput.avatar.square.border.radius
         */
        squareBorderRadius?: string;
        /**
         * Background of the avatar overlay
         *
         * @designToken fileinput.avatar.overlay.background
         */
        overlayBackground?: string;
        /**
         * Text color of the avatar overlay
         *
         * @designToken fileinput.avatar.overlay.color
         */
        overlayColor?: string;
    }

    /* Static Sections */
    type ColorScheme = CS<FileInputDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _FileInput Design Tokens_
 *
 * @group components
 * @module fileinput
 * @see
 * --- ---
 * **Compatible Libraries**
 *
 * [ExhaustiveUI](https://exhaustive-ui.com/theming/styled)
 *
 */
export interface FileInputDesignTokens extends DesignTokens<FileInputDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: FileInputTokenSections.Root;
    /**
     * Used to pass tokens of the dropzone section
     */
    dropzone?: FileInputTokenSections.Dropzone;
    /**
     * Used to pass tokens of the icon section
     */
    icon?: FileInputTokenSections.Icon;
    /**
     * Used to pass tokens of the hint section
     */
    hint?: FileInputTokenSections.Hint;
    /**
     * Used to pass tokens of the list section
     */
    list?: FileInputTokenSections.List;
    /**
     * Used to pass tokens of the item section
     */
    item?: FileInputTokenSections.Item;
    /**
     * Used to pass tokens of the thumbnail section
     */
    thumbnail?: FileInputTokenSections.Thumbnail;
    /**
     * Used to pass tokens of the meta section
     */
    meta?: FileInputTokenSections.Meta;
    /**
     * Used to pass tokens of the progress section
     */
    progress?: FileInputTokenSections.Progress;
    /**
     * Used to pass tokens of the status section
     */
    status?: FileInputTokenSections.Status;
    /**
     * Used to pass tokens of the action section
     */
    action?: FileInputTokenSections.Action;
    /**
     * Used to pass tokens of the summary section
     */
    summary?: FileInputTokenSections.Summary;
    /**
     * Used to pass tokens of the grid section
     */
    grid?: FileInputTokenSections.Grid;
    /**
     * Used to pass tokens of the tile section
     */
    tile?: FileInputTokenSections.Tile;
    /**
     * Used to pass tokens of the avatar section
     */
    avatar?: FileInputTokenSections.Avatar;
}
