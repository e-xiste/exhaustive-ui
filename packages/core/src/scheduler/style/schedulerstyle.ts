import { Injectable } from '@angular/core';
import { style as scheduler_style } from '@exhaustive-ui/styles/scheduler';
import { BaseStyle } from '@exhaustive-ui/core/base';

const dayClasses = (day: any) => ({
    'p-scheduler-today': day?.today,
    'p-scheduler-weekend': day?.weekend
});

const MODE_CLASSES = { day: 'p-scheduler-event-chip', time: 'p-scheduler-event-block', list: 'p-scheduler-event-item' };

const classes = {
    root: ({ instance }) => [
        'p-scheduler p-component',
        `p-scheduler-${instance.view()}-view`,
        {
            'p-scheduler-editable': instance.editable(),
            'p-scheduler-selectable': instance.selectable()
        }
    ],
    header: 'p-scheduler-header',
    navigation: 'p-scheduler-navigation',
    navIcon: 'p-scheduler-nav-icon',
    title: 'p-scheduler-title',
    month: 'p-scheduler-month',
    weekdays: 'p-scheduler-weekdays',
    weekday: 'p-scheduler-weekday',
    week: 'p-scheduler-week',
    day: ({ instance, day }) => [
        'p-scheduler-day',
        dayClasses(day),
        {
            'p-scheduler-day-outside': day.outside,
            'p-scheduler-day-selected': !!instance.selection() && instance.isDaySelected(day)
        }
    ],
    dayNumber: ({ day }) => ['p-scheduler-day-number', dayClasses(day)],
    more: 'p-scheduler-more',
    event: ({ instance, segment, mode }) => [
        'p-scheduler-event',
        MODE_CLASSES[mode],
        {
            'p-scheduler-event-colored': !!segment.item.event.color && mode !== 'list',
            'p-scheduler-event-allday': segment.item.allDayRow,
            'p-scheduler-event-editable': segment.item.editable && mode !== 'list',
            'p-scheduler-event-dragging': instance.dragPreview()?.item.event.id === segment.item.event.id && mode !== 'list',
            'p-scheduler-event-continues-before': !segment.isStart,
            'p-scheduler-event-continues-after': !segment.isEnd
        }
    ],
    eventDot: 'p-scheduler-event-dot',
    eventContent: 'p-scheduler-event-content',
    eventTime: 'p-scheduler-event-time',
    eventTitle: 'p-scheduler-event-title',
    resizeHandle: 'p-scheduler-resize-handle',
    ghost: ({ mode }) => ['p-scheduler-event p-scheduler-ghost', MODE_CLASSES[mode]],
    popoverHeader: 'p-scheduler-popover-header',
    popoverList: 'p-scheduler-popover-list',
    timeGrid: 'p-scheduler-time-grid',
    columnHeaders: 'p-scheduler-column-headers',
    corner: 'p-scheduler-corner',
    columnHeader: ({ day }) => ['p-scheduler-column-header', dayClasses(day)],
    columnWeekday: 'p-scheduler-column-weekday',
    columnNumber: ({ day }) => ['p-scheduler-column-number', dayClasses(day)],
    allDay: 'p-scheduler-all-day',
    allDayLabel: 'p-scheduler-all-day-label',
    allDayCell: ({ day }) => ['p-scheduler-all-day-cell', dayClasses(day)],
    body: 'p-scheduler-body',
    bodyContent: 'p-scheduler-body-content',
    timeGutter: 'p-scheduler-time-gutter',
    timeLabel: 'p-scheduler-time-label',
    column: ({ day }) => ['p-scheduler-column', dayClasses(day)],
    slot: ({ slot }) => ['p-scheduler-slot', { 'p-scheduler-slot-hour': slot.hour }],
    nowIndicator: 'p-scheduler-now-indicator',
    selection: 'p-scheduler-selection',
    agenda: 'p-scheduler-agenda',
    agendaDay: ({ day }) => ['p-scheduler-agenda-day', dayClasses(day)],
    agendaDate: ({ day }) => ['p-scheduler-agenda-date', dayClasses(day)],
    agendaList: 'p-scheduler-agenda-list',
    empty: 'p-scheduler-empty'
};

@Injectable()
export class SchedulerStyle extends BaseStyle {
    name = 'scheduler';

    style = scheduler_style;

    classes = classes;
}

/**
 *
 * Scheduler is an event calendar with month, week, day and agenda views, drag and drop and keyboard editing.
 *
 * [Live Demo](https://exhaustive-ui.com/scheduler/)
 *
 * @module schedulerstyle
 *
 */
export enum SchedulerClasses {
    /**
     * Class name of the root element
     */
    root = 'p-scheduler',
    /**
     * Class name of the header toolbar
     */
    header = 'p-scheduler-header',
    /**
     * Class name of the navigation buttons group
     */
    navigation = 'p-scheduler-navigation',
    /**
     * Class name of the title
     */
    title = 'p-scheduler-title',
    /**
     * Class name of the month grid
     */
    month = 'p-scheduler-month',
    /**
     * Class name of the row of weekday names
     */
    weekdays = 'p-scheduler-weekdays',
    /**
     * Class name of a weekday name
     */
    weekday = 'p-scheduler-weekday',
    /**
     * Class name of a week row
     */
    week = 'p-scheduler-week',
    /**
     * Class name of a day cell
     */
    day = 'p-scheduler-day',
    /**
     * Class name of the day number
     */
    dayNumber = 'p-scheduler-day-number',
    /**
     * Class name of the "+N more" button
     */
    more = 'p-scheduler-more',
    /**
     * Class name of an event
     */
    event = 'p-scheduler-event',
    /**
     * Class name of the time of an event
     */
    eventTime = 'p-scheduler-event-time',
    /**
     * Class name of the title of an event
     */
    eventTitle = 'p-scheduler-event-title',
    /**
     * Class name of the resize handle of an event
     */
    resizeHandle = 'p-scheduler-resize-handle',
    /**
     * Class name of the preview of a dragged event
     */
    ghost = 'p-scheduler-ghost',
    /**
     * Class name of the time grid
     */
    timeGrid = 'p-scheduler-time-grid',
    /**
     * Class name of a column header
     */
    columnHeader = 'p-scheduler-column-header',
    /**
     * Class name of the all-day row
     */
    allDay = 'p-scheduler-all-day',
    /**
     * Class name of a cell of the all-day row
     */
    allDayCell = 'p-scheduler-all-day-cell',
    /**
     * Class name of the scrollable body of the time grid
     */
    body = 'p-scheduler-body',
    /**
     * Class name of the column of hour labels
     */
    timeGutter = 'p-scheduler-time-gutter',
    /**
     * Class name of a day column
     */
    column = 'p-scheduler-column',
    /**
     * Class name of a time slot
     */
    slot = 'p-scheduler-slot',
    /**
     * Class name of the current time line
     */
    nowIndicator = 'p-scheduler-now-indicator',
    /**
     * Class name of the highlight of a selected range
     */
    selection = 'p-scheduler-selection',
    /**
     * Class name of the agenda
     */
    agenda = 'p-scheduler-agenda',
    /**
     * Class name of the date of an agenda day
     */
    agendaDate = 'p-scheduler-agenda-date',
    /**
     * Class name of the empty message
     */
    empty = 'p-scheduler-empty'
}
