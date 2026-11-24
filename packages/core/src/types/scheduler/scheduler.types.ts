import { TemplateRef } from '@angular/core';
import type { PassThrough, PassThroughOption } from '@exhaustive-ui/core/api';
import type { ButtonPassThrough } from '@exhaustive-ui/core/types/button';
import type { PopoverPassThrough } from '@exhaustive-ui/core/types/popover';
import type { SelectButtonPassThrough } from '@exhaustive-ui/core/types/selectbutton';

/**
 * Custom passthrough(pt) options.
 * @template I Type of instance.
 *
 * @see {@link Scheduler.pt}
 * @group Interface
 */
export interface SchedulerPassThroughOptions<I = unknown> {
    /**
     * Used to pass attributes to the root's DOM element.
     */
    root?: PassThroughOption<HTMLElement, I>;
    /**
     * Used to pass attributes to the header toolbar's DOM element.
     */
    header?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the navigation group's DOM element.
     */
    navigation?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the Today Button component.
     * @see {@link ButtonPassThrough}
     */
    pcTodayButton?: ButtonPassThrough;
    /**
     * Used to pass attributes to the previous Button component.
     * @see {@link ButtonPassThrough}
     */
    pcPrevButton?: ButtonPassThrough;
    /**
     * Used to pass attributes to the next Button component.
     * @see {@link ButtonPassThrough}
     */
    pcNextButton?: ButtonPassThrough;
    /**
     * Used to pass attributes to the title's DOM element.
     */
    title?: PassThroughOption<HTMLHeadingElement, I>;
    /**
     * Used to pass attributes to the view switcher SelectButton component.
     * @see {@link SelectButtonPassThrough}
     */
    pcViewSwitcher?: SelectButtonPassThrough;
    /**
     * Used to pass attributes to the month grid's DOM element.
     */
    month?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the row of weekday names.
     */
    weekdays?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to a weekday name's DOM element.
     */
    weekday?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to a week row of the month grid.
     */
    week?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to a day cell of the month grid.
     */
    day?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the day number of a cell.
     */
    dayNumber?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to an event's DOM element.
     */
    event?: PassThroughOption<HTMLButtonElement, I>;
    /**
     * Used to pass attributes to the time of an event.
     */
    eventTime?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the title of an event.
     */
    eventTitle?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the resize handle of an event.
     */
    resizeHandle?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the "+N more" button of a month cell.
     */
    more?: PassThroughOption<HTMLButtonElement, I>;
    /**
     * Used to pass attributes to the Popover component that lists the events of a day.
     * @see {@link PopoverPassThrough}
     */
    pcPopover?: PopoverPassThrough;
    /**
     * Used to pass attributes to the list of events inside the popover.
     */
    popoverList?: PassThroughOption<HTMLUListElement, I>;
    /**
     * Used to pass attributes to the week and day time grid's DOM element.
     */
    timeGrid?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the row of column headers of the time grid.
     */
    columnHeaders?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to a column header of the time grid.
     */
    columnHeader?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the all-day row of the time grid.
     */
    allDay?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to a day cell of the all-day row.
     */
    allDayCell?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the scrollable body of the time grid.
     */
    body?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the column of hour labels.
     */
    timeGutter?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to an hour label.
     */
    timeLabel?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to a day column of the time grid.
     */
    column?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to a time slot.
     */
    slot?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the current time line.
     */
    nowIndicator?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the highlight of a range being selected.
     */
    selection?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the agenda's DOM element.
     */
    agenda?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to a day group of the agenda.
     */
    agendaDay?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the date heading of an agenda day.
     */
    agendaDate?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the event list of an agenda day.
     */
    agendaList?: PassThroughOption<HTMLUListElement, I>;
    /**
     * Used to pass attributes to the empty message of the agenda.
     */
    empty?: PassThroughOption<HTMLDivElement, I>;
}

/**
 * Defines valid pass-through options in Scheduler component.
 * @see {@link SchedulerPassThroughOptions}
 *
 * @template I Type of instance.
 */
export type SchedulerPassThrough<I = unknown> = PassThrough<I, SchedulerPassThroughOptions<I>>;

/**
 * Layout of the Scheduler.
 * - `month`: a grid of the weeks of the month.
 * - `week`: a time grid of the days of the week.
 * - `day`: a time grid of a single day.
 * - `agenda`: a list of the upcoming events, grouped by day.
 * @group Types
 */
export type SchedulerView = 'month' | 'week' | 'day' | 'agenda';

/**
 * An event displayed by the Scheduler.
 * @group Interface
 */
export interface SchedulerEvent {
    /**
     * Unique identifier of the event.
     */
    id: string | number;
    /**
     * Title of the event.
     */
    title: string;
    /**
     * Start of the event.
     */
    start: Date;
    /**
     * End of the event, exclusive. Defaults to one hour after the start, or to the end of the day for all-day events.
     */
    end?: Date;
    /**
     * Whether the event lasts whole days. All-day events are displayed in the all-day row of the week and day views.
     */
    allDay?: boolean;
    /**
     * Background color of the event, as a hex, rgb(), hsl() or named CSS color. The text color is chosen automatically, dark or light, for contrast.
     */
    color?: string;
    /**
     * Text color of the event, to override the automatic choice.
     */
    textColor?: string;
    /**
     * Whether the event can be moved and resized, overriding the editable input of the component.
     */
    editable?: boolean;
    /**
     * Any data of the application.
     */
    data?: any;
}

/**
 * Custom texts of the Scheduler. `{0}` and `{1}` are replaced by values.
 * @group Interface
 */
export interface SchedulerLabels {
    /**
     * Label of the button that shows the current date.
     */
    today: string;
    /**
     * Accessible label of the previous button.
     */
    previous: string;
    /**
     * Accessible label of the next button.
     */
    next: string;
    /**
     * Accessible label of the view switcher.
     */
    views: string;
    /**
     * Name of the month view.
     */
    month: string;
    /**
     * Name of the week view.
     */
    week: string;
    /**
     * Name of the day view.
     */
    day: string;
    /**
     * Name of the agenda view.
     */
    agenda: string;
    /**
     * Label of the all-day row.
     */
    allDay: string;
    /**
     * Text of the button that shows the hidden events of a month cell, `{0}` is the number of hidden events.
     */
    more: string;
    /**
     * Accessible label of the "more" button, `{0}` is the number of hidden events and `{1}` the date.
     */
    moreAriaLabel: string;
    /**
     * Text of the button at the top of a day of the week and day views that lists the events ending before dayStartHour, `{0}` is their number.
     */
    earlier: string;
    /**
     * Accessible label of the "earlier" button, `{0}` is the number of events, `{1}` the first time shown and `{2}` the date.
     */
    earlierAriaLabel: string;
    /**
     * Text of the button at the bottom of a day of the week and day views that lists the events starting after dayEndHour, `{0}` is their number.
     */
    later: string;
    /**
     * Accessible label of the "later" button, `{0}` is the number of events, `{1}` the last time shown and `{2}` the date.
     */
    laterAriaLabel: string;
    /**
     * Number of events in the accessible label of a month cell, `{0}` is the number.
     */
    eventCount: string;
    /**
     * Message of the agenda when the range has no events.
     */
    noEvents: string;
    /**
     * Title of the week view in announcements, `{0}` is the first day.
     */
    weekOf: string;
    /**
     * Announcement after an event is moved or resized, `{0}` is its title and `{1}` its new time.
     */
    moved: string;
    /**
     * Accessible description of editable events.
     */
    editableHint: string;
}

/**
 * Event of a click on a day or a time slot, and of a selected range.
 * @group Events
 */
export interface SchedulerDateClickEvent {
    /**
     * Browser event.
     */
    originalEvent?: Event;
    /**
     * Start of the day or slot.
     */
    start: Date;
    /**
     * End of the day or slot, exclusive.
     */
    end: Date;
    /**
     * Whether whole days were clicked or selected, true in the month view and the all-day row.
     */
    allDay: boolean;
}

/**
 * Event of a selection of a range of days or slots.
 * @group Events
 */
export type SchedulerRangeSelectEvent = SchedulerDateClickEvent;

/**
 * Event of a click on an event.
 * @group Events
 */
export interface SchedulerEventClickEvent {
    /**
     * Browser event.
     */
    originalEvent?: Event;
    /**
     * Clicked event.
     */
    event: SchedulerEvent;
}

/**
 * Event emitted after an event is moved or resized. The component does not change the events: update the array with the new dates.
 * @group Events
 */
export interface SchedulerEventChangeEvent {
    /**
     * Browser event.
     */
    originalEvent?: Event;
    /**
     * The moved or resized event, unchanged.
     */
    event: SchedulerEvent;
    /**
     * New start.
     */
    start: Date;
    /**
     * New end, exclusive.
     */
    end: Date;
    /**
     * Start before the change.
     */
    oldStart: Date;
    /**
     * End before the change.
     */
    oldEnd: Date;
    /**
     * Whether the event was moved or resized.
     */
    type: 'move' | 'resize';
}

/**
 * Event emitted when the view or the visible range changes, and once at start, to load the events of the range.
 * @group Events
 */
export interface SchedulerViewChangeEvent {
    /**
     * Current view.
     */
    view: SchedulerView;
    /**
     * First visible day.
     */
    start: Date;
    /**
     * End of the visible range, exclusive.
     */
    end: Date;
}

/**
 * Context of the event template.
 * @group Interface
 */
export interface SchedulerEventTemplateContext {
    /**
     * The event.
     */
    $implicit: SchedulerEvent;
    /**
     * The event.
     */
    event: SchedulerEvent;
    /**
     * Current view.
     */
    view: SchedulerView;
    /**
     * Formatted time of the event, empty for all-day events.
     */
    timeText: string;
    /**
     * Whether the event is displayed in the all-day row or in a month cell.
     */
    allDay: boolean;
}

/**
 * Context of the header template.
 * @group Interface
 */
export interface SchedulerHeaderTemplateContext {
    /**
     * Formatted title of the visible range.
     */
    $implicit: string;
    /**
     * Formatted title of the visible range.
     */
    title: string;
    /**
     * Current view.
     */
    view: SchedulerView;
    /**
     * First visible day.
     */
    start: Date;
    /**
     * End of the visible range, exclusive.
     */
    end: Date;
    /**
     * Shows the current date.
     */
    today: () => void;
    /**
     * Shows the previous range.
     */
    prev: () => void;
    /**
     * Shows the next range.
     */
    next: () => void;
    /**
     * Changes the view.
     */
    changeView: (view: SchedulerView) => void;
}

/**
 * Defines valid templates in Scheduler.
 * @group Templates
 */
export interface SchedulerTemplates {
    /**
     * Custom content of an event, rendered inside its button: do not put interactive elements in it.
     * @param {SchedulerEventTemplateContext} context - event context.
     */
    event(context: SchedulerEventTemplateContext): TemplateRef<SchedulerEventTemplateContext>;
    /**
     * Custom header, replacing the toolbar.
     * @param {SchedulerHeaderTemplateContext} context - header context.
     */
    header(context: SchedulerHeaderTemplateContext): TemplateRef<SchedulerHeaderTemplateContext>;
}
