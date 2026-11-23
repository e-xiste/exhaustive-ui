/**
 *
 * Scheduler Design Tokens
 *
 * @module scheduler
 *
 */

import type { ColorScheme as CS, DesignTokens, ExtendedCSS, ExtendedTokens } from '..';

/**
 * Design Token Sections
 */
export declare namespace SchedulerTokenSections {
    interface Root {
        /**
         * Background
         *
         * @designToken scheduler.background
         */
        background?: string;
        /**
         * Border color
         *
         * @designToken scheduler.border.color
         */
        borderColor?: string;
        /**
         * Border radius
         *
         * @designToken scheduler.border.radius
         */
        borderRadius?: string;
        /**
         * Text color
         *
         * @designToken scheduler.color
         */
        color?: string;
        /**
         * Gap between the header and the view
         *
         * @designToken scheduler.gap
         */
        gap?: string;
        /**
         * Transition duration
         *
         * @designToken scheduler.transition.duration
         */
        transitionDuration?: string;
    }

    interface Header {
        /**
         * Gap between the header items
         *
         * @designToken scheduler.header.gap
         */
        gap?: string;
        /**
         * Padding
         *
         * @designToken scheduler.header.padding
         */
        padding?: string;
    }

    interface Title {
        /**
         * Font size
         *
         * @designToken scheduler.title.font.size
         */
        fontSize?: string;
        /**
         * Font weight
         *
         * @designToken scheduler.title.font.weight
         */
        fontWeight?: string;
        /**
         * Text color
         *
         * @designToken scheduler.title.color
         */
        color?: string;
    }

    interface Grid {
        /**
         * Color of the grid lines
         *
         * @designToken scheduler.grid.border.color
         */
        borderColor?: string;
        /**
         * Color of the lines between the slots inside an hour
         *
         * @designToken scheduler.grid.slot.border.color
         */
        slotBorderColor?: string;
    }

    interface Weekday {
        /**
         * Text color
         *
         * @designToken scheduler.weekday.color
         */
        color?: string;
        /**
         * Font size
         *
         * @designToken scheduler.weekday.font.size
         */
        fontSize?: string;
        /**
         * Font weight
         *
         * @designToken scheduler.weekday.font.weight
         */
        fontWeight?: string;
        /**
         * Padding
         *
         * @designToken scheduler.weekday.padding
         */
        padding?: string;
    }

    interface Day {
        /**
         * Padding
         *
         * @designToken scheduler.day.padding
         */
        padding?: string;
        /**
         * Gap between the events
         *
         * @designToken scheduler.day.gap
         */
        gap?: string;
        /**
         * Minimum height of a cell
         *
         * @designToken scheduler.day.min.height
         */
        minHeight?: string;
        /**
         * Text color of the days of other months
         *
         * @designToken scheduler.day.outside.color
         */
        outsideColor?: string;
        /**
         * Background of the days of other months
         *
         * @designToken scheduler.day.outside.background
         */
        outsideBackground?: string;
        /**
         * Background of the selected days
         *
         * @designToken scheduler.day.selected.background
         */
        selectedBackground?: string;
        /**
         * Focus ring
         */
        focusRing?: {
            /**
             * Focus ring width
             *
             * @designToken scheduler.day.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style
             *
             * @designToken scheduler.day.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color
             *
             * @designToken scheduler.day.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset
             *
             * @designToken scheduler.day.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow
             *
             * @designToken scheduler.day.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface DayNumber {
        /**
         * Size of the circle around the day number
         *
         * @designToken scheduler.day.number.size
         */
        size?: string;
        /**
         * Font size
         *
         * @designToken scheduler.day.number.font.size
         */
        fontSize?: string;
        /**
         * Font weight
         *
         * @designToken scheduler.day.number.font.weight
         */
        fontWeight?: string;
        /**
         * Text color
         *
         * @designToken scheduler.day.number.color
         */
        color?: string;
        /**
         * Border radius
         *
         * @designToken scheduler.day.number.border.radius
         */
        borderRadius?: string;
    }

    interface Today {
        /**
         * Background of the number of the current day
         *
         * @designToken scheduler.today.number.background
         */
        numberBackground?: string;
        /**
         * Text color of the number of the current day
         *
         * @designToken scheduler.today.number.color
         */
        numberColor?: string;
        /**
         * Font weight of the number of the current day
         *
         * @designToken scheduler.today.font.weight
         */
        fontWeight?: string;
    }

    interface Event {
        /**
         * Default background
         *
         * @designToken scheduler.event.background
         */
        background?: string;
        /**
         * Default text color
         *
         * @designToken scheduler.event.color
         */
        color?: string;
        /**
         * Default color of the accent border
         *
         * @designToken scheduler.event.border.color
         */
        borderColor?: string;
        /**
         * Width of the accent border
         *
         * @designToken scheduler.event.border.width
         */
        borderWidth?: string;
        /**
         * Border radius
         *
         * @designToken scheduler.event.border.radius
         */
        borderRadius?: string;
        /**
         * Padding
         *
         * @designToken scheduler.event.padding
         */
        padding?: string;
        /**
         * Font size
         *
         * @designToken scheduler.event.font.size
         */
        fontSize?: string;
        /**
         * Font weight of the title
         *
         * @designToken scheduler.event.font.weight
         */
        fontWeight?: string;
        /**
         * Gap between the time and the title
         *
         * @designToken scheduler.event.gap
         */
        gap?: string;
        /**
         * Shadow on hover
         *
         * @designToken scheduler.event.hover.shadow
         */
        hoverShadow?: string;
        /**
         * Opacity of an event while its preview is dragged
         *
         * @designToken scheduler.event.dragging.opacity
         */
        draggingOpacity?: string;
        /**
         * Focus ring
         */
        focusRing?: {
            /**
             * Focus ring width
             *
             * @designToken scheduler.event.focus.ring.width
             */
            width?: string;
            /**
             * Focus ring style
             *
             * @designToken scheduler.event.focus.ring.style
             */
            style?: string;
            /**
             * Focus ring color
             *
             * @designToken scheduler.event.focus.ring.color
             */
            color?: string;
            /**
             * Focus ring offset
             *
             * @designToken scheduler.event.focus.ring.offset
             */
            offset?: string;
            /**
             * Focus ring shadow
             *
             * @designToken scheduler.event.focus.ring.shadow
             */
            shadow?: string;
        };
    }

    interface More {
        /**
         * Text color
         *
         * @designToken scheduler.more.color
         */
        color?: string;
        /**
         * Text color on hover
         *
         * @designToken scheduler.more.hover.color
         */
        hoverColor?: string;
        /**
         * Background on hover
         *
         * @designToken scheduler.more.hover.background
         */
        hoverBackground?: string;
        /**
         * Font size
         *
         * @designToken scheduler.more.font.size
         */
        fontSize?: string;
        /**
         * Font weight
         *
         * @designToken scheduler.more.font.weight
         */
        fontWeight?: string;
        /**
         * Padding
         *
         * @designToken scheduler.more.padding
         */
        padding?: string;
        /**
         * Border radius
         *
         * @designToken scheduler.more.border.radius
         */
        borderRadius?: string;
    }

    interface Slot {
        /**
         * Height of a time slot
         *
         * @designToken scheduler.slot.height
         */
        height?: string;
        /**
         * Background of a slot on hover
         *
         * @designToken scheduler.slot.hover.background
         */
        hoverBackground?: string;
    }

    interface TimeLabel {
        /**
         * Text color
         *
         * @designToken scheduler.time.label.color
         */
        color?: string;
        /**
         * Font size
         *
         * @designToken scheduler.time.label.font.size
         */
        fontSize?: string;
        /**
         * Width of the column of hour labels
         *
         * @designToken scheduler.time.label.width
         */
        width?: string;
    }

    interface ColumnHeader {
        /**
         * Padding
         *
         * @designToken scheduler.column.header.padding
         */
        padding?: string;
        /**
         * Text color of the weekday
         *
         * @designToken scheduler.column.header.color
         */
        color?: string;
        /**
         * Font size of the weekday
         *
         * @designToken scheduler.column.header.font.size
         */
        fontSize?: string;
        /**
         * Font size of the day number
         *
         * @designToken scheduler.column.header.number.font.size
         */
        numberFontSize?: string;
        /**
         * Font weight of the day number
         *
         * @designToken scheduler.column.header.number.font.weight
         */
        numberFontWeight?: string;
    }

    interface AllDay {
        /**
         * Minimum height of the all-day row
         *
         * @designToken scheduler.all.day.min.height
         */
        minHeight?: string;
        /**
         * Text color of the label
         *
         * @designToken scheduler.all.day.label.color
         */
        labelColor?: string;
        /**
         * Font size of the label
         *
         * @designToken scheduler.all.day.label.font.size
         */
        labelFontSize?: string;
    }

    interface NowIndicator {
        /**
         * Color of the current time line
         *
         * @designToken scheduler.now.indicator.color
         */
        color?: string;
        /**
         * Thickness of the current time line
         *
         * @designToken scheduler.now.indicator.size
         */
        size?: string;
    }

    interface Selection {
        /**
         * Background of a selected range
         *
         * @designToken scheduler.selection.background
         */
        background?: string;
        /**
         * Border color of a selected range
         *
         * @designToken scheduler.selection.border.color
         */
        borderColor?: string;
    }

    interface Agenda {
        /**
         * Padding
         *
         * @designToken scheduler.agenda.padding
         */
        padding?: string;
        /**
         * Gap between the days
         *
         * @designToken scheduler.agenda.gap
         */
        gap?: string;
        /**
         * Text color of a date
         *
         * @designToken scheduler.agenda.date.color
         */
        dateColor?: string;
        /**
         * Font weight of a date
         *
         * @designToken scheduler.agenda.date.font.weight
         */
        dateFontWeight?: string;
        /**
         * Padding of a date
         *
         * @designToken scheduler.agenda.date.padding
         */
        datePadding?: string;
        /**
         * Border color below a date
         *
         * @designToken scheduler.agenda.date.border.color
         */
        dateBorderColor?: string;
        /**
         * Padding of an event
         *
         * @designToken scheduler.agenda.item.padding
         */
        itemPadding?: string;
        /**
         * Gap inside an event
         *
         * @designToken scheduler.agenda.item.gap
         */
        itemGap?: string;
        /**
         * Border radius of an event
         *
         * @designToken scheduler.agenda.item.border.radius
         */
        itemBorderRadius?: string;
        /**
         * Background of an event on hover
         *
         * @designToken scheduler.agenda.item.hover.background
         */
        itemHoverBackground?: string;
        /**
         * Text color of the time
         *
         * @designToken scheduler.agenda.time.color
         */
        timeColor?: string;
        /**
         * Width of the time column
         *
         * @designToken scheduler.agenda.time.width
         */
        timeWidth?: string;
        /**
         * Size of the color dot
         *
         * @designToken scheduler.agenda.dot.size
         */
        dotSize?: string;
    }

    interface Popover {
        /**
         * Width of the popover
         *
         * @designToken scheduler.popover.width
         */
        width?: string;
        /**
         * Gap between the events
         *
         * @designToken scheduler.popover.gap
         */
        gap?: string;
        /**
         * Font weight of the date
         *
         * @designToken scheduler.popover.header.font.weight
         */
        headerFontWeight?: string;
    }

    interface Empty {
        /**
         * Text color
         *
         * @designToken scheduler.empty.color
         */
        color?: string;
        /**
         * Padding
         *
         * @designToken scheduler.empty.padding
         */
        padding?: string;
    }

    /* Supports */
    type ColorScheme = CS<SchedulerDesignTokens>;
    type CSS = ExtendedCSS;
    type Extend = ExtendedTokens;
}

/**
 *
 * _Scheduler Design Tokens_
 *
 * @group components
 * @module scheduler
 * @see
 * --- ---
 * **Compatible Libraries**
 *
 * [ExhaustiveUI](https://exhaustive-ui.com/theming/styled)
 *
 */
export interface SchedulerDesignTokens extends DesignTokens<SchedulerDesignTokens> {
    /**
     * Used to pass tokens of the root section
     */
    root?: SchedulerTokenSections.Root;
    /**
     * Used to pass tokens of the header section
     */
    header?: SchedulerTokenSections.Header;
    /**
     * Used to pass tokens of the title section
     */
    title?: SchedulerTokenSections.Title;
    /**
     * Used to pass tokens of the grid section
     */
    grid?: SchedulerTokenSections.Grid;
    /**
     * Used to pass tokens of the weekday section
     */
    weekday?: SchedulerTokenSections.Weekday;
    /**
     * Used to pass tokens of the day section
     */
    day?: SchedulerTokenSections.Day;
    /**
     * Used to pass tokens of the day number section
     */
    dayNumber?: SchedulerTokenSections.DayNumber;
    /**
     * Used to pass tokens of the today section
     */
    today?: SchedulerTokenSections.Today;
    /**
     * Used to pass tokens of the event section
     */
    event?: SchedulerTokenSections.Event;
    /**
     * Used to pass tokens of the more section
     */
    more?: SchedulerTokenSections.More;
    /**
     * Used to pass tokens of the slot section
     */
    slot?: SchedulerTokenSections.Slot;
    /**
     * Used to pass tokens of the time label section
     */
    timeLabel?: SchedulerTokenSections.TimeLabel;
    /**
     * Used to pass tokens of the column header section
     */
    columnHeader?: SchedulerTokenSections.ColumnHeader;
    /**
     * Used to pass tokens of the all day section
     */
    allDay?: SchedulerTokenSections.AllDay;
    /**
     * Used to pass tokens of the now indicator section
     */
    nowIndicator?: SchedulerTokenSections.NowIndicator;
    /**
     * Used to pass tokens of the selection section
     */
    selection?: SchedulerTokenSections.Selection;
    /**
     * Used to pass tokens of the agenda section
     */
    agenda?: SchedulerTokenSections.Agenda;
    /**
     * Used to pass tokens of the popover section
     */
    popover?: SchedulerTokenSections.Popover;
    /**
     * Used to pass tokens of the empty section
     */
    empty?: SchedulerTokenSections.Empty;
}
