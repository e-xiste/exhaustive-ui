import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    effect,
    ElementRef,
    inject,
    input,
    linkedSignal,
    LOCALE_ID,
    model,
    NgModule,
    numberAttribute,
    output,
    signal,
    TemplateRef,
    untracked,
    viewChild,
    ViewEncapsulation
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SharedModule, Translation } from '@exhaustive-ui/core/api';
import { PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseComponent } from '@exhaustive-ui/core/basecomponent';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { Button } from '@exhaustive-ui/core/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@exhaustive-ui/core/icons';
import { Popover } from '@exhaustive-ui/core/popover';
import { SelectButton } from '@exhaustive-ui/core/selectbutton';
import type {
    SchedulerDateClickEvent,
    SchedulerEvent,
    SchedulerEventChangeEvent,
    SchedulerEventClickEvent,
    SchedulerEventTemplateContext,
    SchedulerHeaderTemplateContext,
    SchedulerLabels,
    SchedulerPassThrough,
    SchedulerRangeSelectEvent,
    SchedulerView,
    SchedulerViewChangeEvent
} from '@exhaustive-ui/core/types/scheduler';
import { isRTL, uuid } from '@exhaustive-ui/utils';
import {
    addDays,
    addMonths,
    atMinutes,
    compareEvents,
    DAY,
    dayDiff,
    dayKey,
    format,
    isSameDay,
    isValidDate,
    isWeekend,
    layoutDay,
    LIGHT_TEXT,
    minutesOfDay,
    MINUTE,
    NormalizedEvent,
    normalizeEvent,
    overlaps,
    parseColor,
    startOfDay,
    startOfMonth,
    startOfWeek,
    textColorFor,
    TimedSegment
} from './scheduler-utils';
import { SchedulerStyle } from './style/schedulerstyle';

/**
 * Default texts of Scheduler.
 * @group Constants
 */
export const SCHEDULER_DEFAULT_LABELS: SchedulerLabels = {
    today: 'Today',
    previous: 'Previous',
    next: 'Next',
    views: 'View',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    agenda: 'Agenda',
    allDay: 'All day',
    more: '+{0} more',
    moreAriaLabel: '{0} more events on {1}',
    eventCount: '{0} events',
    noEvents: 'No events in this period',
    weekOf: 'Week of {0}',
    moved: '{0} moved to {1}',
    editableHint: 'Alt and arrow keys move the event, Alt Shift and up or down arrow resize it'
};

/** A visible day. */
export interface SchedulerDay {
    key: string;
    date: Date;
    number: number;
    today: boolean;
    outside: boolean;
    weekend: boolean;
    label: string;
    weekday: string;
    headerId: string;
}

/** An event in a day cell, the all-day row, the agenda or the popover. */
export interface SchedulerDaySegment {
    key: string;
    item: NormalizedEvent;
    isStart: boolean;
    isEnd: boolean;
    timeText: string;
}

/** A time slot of the time grid. */
export interface SchedulerSlot {
    index: number;
    minutes: number;
    hour: boolean;
    label: string;
}

type SegmentMode = 'day' | 'time' | 'list';

type DragArea = 'time' | 'day' | 'allday';

interface DragState {
    mode: 'move' | 'resize' | 'select';
    area: DragArea;
    item?: NormalizedEvent;
    pointerId: number;
    pointerType: string;
    x: number;
    y: number;
    lastX: number;
    lastY: number;
    origin: { day: Date; minutes: number };
    active: boolean;
    timer?: any;
}

interface DragPreview {
    item: NormalizedEvent;
    start: Date;
    end: Date;
}

interface SchedulerSelection {
    start: Date;
    end: Date;
    allDay: boolean;
}

const LONG_PRESS = 350;
const DRAG_THRESHOLD = 4;
const AUTOSCROLL_EDGE = 40;

/**
 * Scheduler is an event calendar with month, week, day and agenda views. Events are moved and resized by drag and drop or with the keyboard, and the component emits the changes for the application to apply.
 * @group Components
 */
@Component({
    selector: 'p-scheduler',
    standalone: true,
    imports: [NgTemplateOutlet, FormsModule, SharedModule, BindModule, Button, SelectButton, Popover, ChevronLeftIcon, ChevronRightIcon],
    template: `
        @if (showHeader()) {
            @if (headerTemplate()) {
                <ng-container *ngTemplateOutlet="headerTemplate()!; context: headerContext()" />
            } @else {
                <div [class]="cx('header')" [pBind]="ptm('header')">
                    <div [class]="cx('navigation')" [pBind]="ptm('navigation')">
                        <p-button [label]="labelOf('today')" severity="secondary" variant="outlined" size="small" (onClick)="today()" [pt]="ptm('pcTodayButton')" [unstyled]="unstyled()" />
                        <p-button severity="secondary" variant="text" rounded size="small" [ariaLabel]="labelOf('previous')" (onClick)="prev()" [pt]="ptm('pcPrevButton')" [unstyled]="unstyled()">
                            <ng-template #icon>
                                <svg data-p-icon="chevron-left" [class]="cx('navIcon')" />
                            </ng-template>
                        </p-button>
                        <p-button severity="secondary" variant="text" rounded size="small" [ariaLabel]="labelOf('next')" (onClick)="next()" [pt]="ptm('pcNextButton')" [unstyled]="unstyled()">
                            <ng-template #icon>
                                <svg data-p-icon="chevron-right" [class]="cx('navIcon')" />
                            </ng-template>
                        </p-button>
                    </div>
                    <div [class]="cx('title')" [attr.id]="titleId" [pBind]="ptm('title')">{{ title() }}</div>
                    @if (viewOptions().length > 1) {
                        <span [attr.id]="viewsLabelId" class="p-hidden-accessible">{{ labelOf('views') }}</span>
                        <p-selectbutton
                            [options]="viewOptions()"
                            optionLabel="label"
                            optionValue="value"
                            [allowEmpty]="false"
                            size="small"
                            [ngModel]="view()"
                            (ngModelChange)="changeView($event)"
                            [ngModelOptions]="{ standalone: true }"
                            [ariaLabelledBy]="viewsLabelId"
                            [pt]="ptm('pcViewSwitcher')"
                            [unstyled]="unstyled()"
                        />
                    }
                </div>
            }
        }

        @switch (view()) {
            @case ('month') {
                <div
                    #grid
                    [class]="cx('month')"
                    role="grid"
                    [attr.aria-labelledby]="hasTitle() ? titleId : undefined"
                    [attr.aria-label]="hasTitle() ? undefined : title()"
                    [attr.aria-multiselectable]="selectable() || undefined"
                    [style.--p-scheduler-columns]="columnCount()"
                    (keydown)="onMonthKeydown($event)"
                    [pBind]="ptm('month')"
                >
                    <div role="row" [class]="cx('weekdays')" [pBind]="ptm('weekdays')">
                        @for (weekday of weekdays(); track weekday.key) {
                            <div role="columnheader" [class]="cx('weekday')" [attr.aria-label]="weekday.long" [pBind]="ptm('weekday')">{{ weekday.short }}</div>
                        }
                    </div>
                    @for (week of weeks(); track week.key) {
                        <div role="row" [class]="cx('week')" [pBind]="ptm('week')">
                            @for (day of week.days; track day.key) {
                                <div
                                    role="gridcell"
                                    [class]="cx('day', { day })"
                                    [attr.data-p-day]="day.key"
                                    [attr.tabindex]="day.key === tabbableKey() ? 0 : -1"
                                    [attr.aria-selected]="isDaySelected(day)"
                                    [attr.aria-current]="day.today ? 'date' : undefined"
                                    (click)="onDayClick($event, day)"
                                    (pointerdown)="onDayPointerDown($event, day, 'day')"
                                    (focus)="onCellFocus(day)"
                                    [pBind]="ptm('day')"
                                >
                                    <span [class]="cx('dayNumber', { day })" aria-hidden="true" [pBind]="ptm('dayNumber')">{{ day.number }}</span>
                                    <span class="p-hidden-accessible">{{ dayCellLabel(day) }}</span>
                                    @if (monthCells().get(day.key); as cell) {
                                        @for (segment of cell.visible; track segment.key) {
                                            <ng-container *ngTemplateOutlet="eventTemplateRef; context: { $implicit: segment, mode: 'day' }" />
                                        }
                                        @if (cell.hidden > 0) {
                                            <button
                                                type="button"
                                                [class]="cx('more')"
                                                aria-haspopup="dialog"
                                                [attr.aria-expanded]="moreDay()?.key === day.key"
                                                [attr.aria-label]="formatLabel('moreAriaLabel', cell.hidden, day.label)"
                                                (click)="openMore($event, day)"
                                                (keydown)="onInnerKeydown($event, day)"
                                                (pointerdown)="$event.stopPropagation()"
                                                [pBind]="ptm('more')"
                                            >
                                                {{ formatLabel('more', cell.hidden) }}
                                            </button>
                                        }
                                    }
                                    @for (segment of ghostDaySegments(day.key); track segment.key) {
                                        <ng-container *ngTemplateOutlet="ghostTemplateRef; context: { $implicit: segment }" />
                                    }
                                </div>
                            }
                        </div>
                    }
                </div>
            }
            @case ('agenda') {
                <div [class]="cx('agenda')" [attr.aria-labelledby]="hasTitle() ? titleId : undefined" [attr.aria-label]="hasTitle() ? undefined : title()" role="region" (keydown)="onListKeydown($event)" [pBind]="ptm('agenda')">
                    @for (group of agendaGroups(); track group.key) {
                        <div [class]="cx('agendaDay', { day: group.day })" [pBind]="ptm('agendaDay')">
                            <div [class]="cx('agendaDate', { day: group.day })" [attr.id]="group.day.headerId" [pBind]="ptm('agendaDate')">{{ group.day.label }}</div>
                            <ul [class]="cx('agendaList')" [attr.aria-labelledby]="group.day.headerId" [pBind]="ptm('agendaList')">
                                @for (segment of group.segments; track segment.key) {
                                    <li>
                                        <ng-container *ngTemplateOutlet="eventTemplateRef; context: { $implicit: segment, mode: 'list' }" />
                                    </li>
                                }
                            </ul>
                        </div>
                    } @empty {
                        <div [class]="cx('empty')" [pBind]="ptm('empty')">{{ labelOf('noEvents') }}</div>
                    }
                </div>
            }
            @default {
                <div [class]="cx('timeGrid')" [style.--p-scheduler-columns]="columns().length" [pBind]="ptm('timeGrid')">
                    <div [class]="cx('columnHeaders')" [pBind]="ptm('columnHeaders')">
                        <div [class]="cx('corner')"></div>
                        @for (column of columns(); track column.key) {
                            <div [class]="cx('columnHeader', { day: column })" [attr.id]="column.headerId" [pBind]="ptm('columnHeader')">
                                <span class="p-hidden-accessible">{{ column.label }}</span>
                                <span [class]="cx('columnWeekday')" aria-hidden="true">{{ column.weekday }}</span>
                                <span [class]="cx('columnNumber', { day: column })" aria-hidden="true">{{ column.number }}</span>
                            </div>
                        }
                    </div>
                    <div [class]="cx('allDay')" [pBind]="ptm('allDay')">
                        <div [class]="cx('allDayLabel')">{{ labelOf('allDay') }}</div>
                        @for (column of columns(); track column.key) {
                            <div
                                [class]="cx('allDayCell', { day: column })"
                                role="group"
                                [attr.aria-label]="labelOf('allDay') + ', ' + column.label"
                                [attr.data-p-allday]="column.key"
                                (click)="onAllDayClick($event, column)"
                                (pointerdown)="onDayPointerDown($event, column, 'allday')"
                                [pBind]="ptm('allDayCell')"
                            >
                                @for (segment of allDaySegments().get(column.key); track segment.key) {
                                    <ng-container *ngTemplateOutlet="eventTemplateRef; context: { $implicit: segment, mode: 'day' }" />
                                }
                                @for (segment of ghostAllDaySegments(column.key); track segment.key) {
                                    <ng-container *ngTemplateOutlet="ghostTemplateRef; context: { $implicit: segment }" />
                                }
                            </div>
                        }
                    </div>
                    <div #body [class]="cx('body')" [style.max-height]="scrollHeight()" (keydown)="onTimeGridKeydown($event)" [pBind]="ptm('body')">
                        <div [class]="cx('bodyContent')" [style.--p-scheduler-slots]="slots().length">
                            <div [class]="cx('timeGutter')" aria-hidden="true" [pBind]="ptm('timeGutter')">
                                @for (slot of slots(); track slot.index) {
                                    <div [class]="cx('timeLabel', { slot })" [pBind]="ptm('timeLabel')">{{ slot.hour ? slot.label : '' }}</div>
                                }
                            </div>
                            @for (column of columns(); track column.key) {
                                <div [class]="cx('column', { day: column })" role="group" [attr.aria-labelledby]="column.headerId" [attr.data-p-column]="column.key" (pointerdown)="onSlotPointerDown($event, column)" [pBind]="ptm('column')">
                                    @for (slot of slots(); track slot.index) {
                                        <div
                                            role="button"
                                            [class]="cx('slot', { slot, day: column })"
                                            [attr.tabindex]="column.key === tabbableKey() && slot.index === activeSlot() ? 0 : -1"
                                            [attr.aria-label]="slotLabel(column, slot)"
                                            [attr.data-p-slot]="slot.index"
                                            (click)="handleSlotClick($event, column, slot)"
                                            (focus)="onSlotFocus(column, slot)"
                                            [pBind]="ptm('slot')"
                                        ></div>
                                    }
                                    @for (segment of timedSegments().get(column.key); track segment.key) {
                                        <ng-container *ngTemplateOutlet="eventTemplateRef; context: { $implicit: segment, mode: 'time' }" />
                                    }
                                    @for (segment of ghostTimedSegments(column); track segment.key) {
                                        <div [class]="cx('ghost', { mode: 'time' })" aria-hidden="true" [style.top.%]="segment.top" [style.height.%]="segment.height" [style]="colorStyle(segment.item)">
                                            <span [class]="cx('eventTime')">{{ timeRange(segment.item.start, segment.item.end) }}</span>
                                        </div>
                                    }
                                    @if (selectionIn(column); as range) {
                                        <div [class]="cx('selection')" aria-hidden="true" [style.top.%]="range.top" [style.height.%]="range.height" [pBind]="ptm('selection')"></div>
                                    }
                                    @if (column.today && nowTop() !== null) {
                                        <div [class]="cx('nowIndicator')" aria-hidden="true" [style.top.%]="nowTop()" [pBind]="ptm('nowIndicator')"></div>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
        }

        <ng-template #eventTemplateRef let-segment let-mode="mode">
            <button
                type="button"
                [class]="cx('event', { segment, mode })"
                [attr.data-p-event]="segment.item.event.id"
                [attr.tabindex]="mode === 'time' && !segment.isStart ? -1 : 0"
                [style]="segmentStyle(segment, mode)"
                [attr.aria-describedby]="segment.item.editable && mode !== 'list' ? hintId : undefined"
                (click)="handleEventClick($event, segment.item)"
                (keydown)="onEventKeydown($event, segment, mode)"
                (pointerdown)="onEventPointerDown($event, segment, mode)"
                (contextmenu)="onContextMenu($event)"
                [pBind]="ptm('event')"
            >
                <span class="p-hidden-accessible">{{ eventLabel(segment.item) }}</span>
                @if (eventTemplate()) {
                    <span [class]="cx('eventContent')" aria-hidden="true">
                        <ng-container *ngTemplateOutlet="eventTemplate()!; context: eventContext(segment, mode)" />
                    </span>
                } @else {
                    @if (mode === 'list') {
                        <span [class]="cx('eventDot')" [style.background]="segment.item.event.color" aria-hidden="true"></span>
                        <span [class]="cx('eventTime')" aria-hidden="true" [pBind]="ptm('eventTime')">{{ segment.timeText }}</span>
                        <span [class]="cx('eventTitle')" aria-hidden="true" [pBind]="ptm('eventTitle')">{{ segment.item.event.title }}</span>
                    } @else if (mode === 'time') {
                        <span [class]="cx('eventTitle')" aria-hidden="true" [pBind]="ptm('eventTitle')">{{ segment.item.event.title }}</span>
                        <span [class]="cx('eventTime')" aria-hidden="true" [pBind]="ptm('eventTime')">{{ timeRange(segment.item.start, segment.item.end) }}</span>
                    } @else {
                        @if (segment.timeText) {
                            <span [class]="cx('eventTime')" aria-hidden="true" [pBind]="ptm('eventTime')">{{ segment.timeText }}</span>
                        }
                        <span [class]="cx('eventTitle')" aria-hidden="true" [pBind]="ptm('eventTitle')">{{ segment.item.event.title }}</span>
                    }
                }
                @if (mode === 'time' && segment.isEnd && segment.item.editable) {
                    <span [class]="cx('resizeHandle')" aria-hidden="true" (pointerdown)="onResizePointerDown($event, segment)" [pBind]="ptm('resizeHandle')"></span>
                }
            </button>
        </ng-template>

        <ng-template #ghostTemplateRef let-segment>
            <div [class]="cx('ghost', { mode: 'day' })" aria-hidden="true" [style]="colorStyle(segment.item)">
                <span [class]="cx('eventTitle')">{{ segment.item.event.title }}</span>
            </div>
        </ng-template>

        <p-popover #morePopover [ariaLabel]="moreDay()?.label" (onHide)="onMoreHide()" [pt]="ptm('pcPopover')" [unstyled]="unstyled()">
            @if (moreDay(); as day) {
                <div [class]="cx('popoverHeader')">{{ day.label }}</div>
                <ul [class]="cx('popoverList')" (keydown)="onListKeydown($event)" [pBind]="ptm('popoverList')">
                    @for (segment of monthCells().get(day.key)?.all; track segment.key; let first = $first) {
                        <li>
                            <button
                                type="button"
                                [class]="cx('event', { segment, mode: 'list' })"
                                [attr.data-p-event]="segment.item.event.id"
                                [attr.autofocus]="first ? true : undefined"
                                (click)="handleEventClick($event, segment.item); morePopover.hide()"
                                [pBind]="ptm('event')"
                            >
                                <span class="p-hidden-accessible">{{ eventLabel(segment.item) }}</span>
                                @if (eventTemplate()) {
                                    <span [class]="cx('eventContent')" aria-hidden="true">
                                        <ng-container *ngTemplateOutlet="eventTemplate()!; context: eventContext(segment, 'list')" />
                                    </span>
                                } @else {
                                    <span [class]="cx('eventDot')" [style.background]="segment.item.event.color" aria-hidden="true"></span>
                                    <span [class]="cx('eventTime')" aria-hidden="true">{{ segment.timeText }}</span>
                                    <span [class]="cx('eventTitle')" aria-hidden="true">{{ segment.item.event.title }}</span>
                                }
                            </button>
                        </li>
                    }
                </ul>
            }
        </p-popover>

        <span [attr.id]="hintId" hidden>{{ labelOf('editableHint') }}</span>
        <span class="p-hidden-accessible" aria-live="polite" aria-atomic="true">{{ announcement() }}</span>
    `,
    providers: [SchedulerStyle, { provide: PARENT_INSTANCE, useExisting: Scheduler }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[attr.data-p-view]': 'view()',
        '[attr.aria-label]': 'ariaLabel()',
        '[attr.role]': 'ariaLabel() ? "region" : undefined'
    },
    hostDirectives: [Bind]
})
export class Scheduler extends BaseComponent<SchedulerPassThrough> {
    componentName = 'Scheduler';

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(SchedulerStyle);

    private readonly appLocale = inject(LOCALE_ID);

    private readonly translation = toSignal(this.config.translationObserver, { initialValue: this.config.translation as Translation });

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));

        // Before the range effect below, so that a narrow screen starts on the narrow view without a first onViewChange of the wide one.
        effect((onCleanup) => {
            const breakpoint = this.breakpoint();
            if (isPlatformBrowser(this.platformId)) {
                untracked(() => this.bindMediaQuery(breakpoint, onCleanup));
            }
        });

        effect(() => {
            const view = this.view();
            const start = this.rangeStart();
            const end = this.rangeEnd();
            const key = `${view}|${start.getTime()}|${end.getTime()}`;
            if (key !== this.lastRangeKey) {
                this.lastRangeKey = key;
                untracked(() => this.onViewChange.emit({ view, start, end }));
            }
        });

        effect(() => {
            const view = this.view();
            if (view === 'week' || view === 'day') {
                untracked(() => afterNextRender(() => this.scrollToTime(), { injector: this.injector }));
            }
        });
    }

    /******************** Inputs ********************/

    /**
     * Events to display. The component never changes them: apply the changes emitted by onEventChange to the array.
     * @defaultValue []
     * @group Props
     */
    readonly events = input<SchedulerEvent[] | null | undefined>([]);
    /**
     * Current view, two-way bindable.
     * @defaultValue 'month'
     * @group Props
     */
    readonly view = model<SchedulerView>('month');
    /**
     * Date of the visible range, two-way bindable. Defaults to the current date.
     * @group Props
     */
    readonly date = model<Date>(new Date());
    /**
     * Views offered by the view switcher, in this order. The switcher is hidden when there is only one.
     * @defaultValue ['month', 'week', 'day', 'agenda']
     * @group Props
     */
    readonly views = input<SchedulerView[]>(['month', 'week', 'day', 'agenda']);
    /**
     * BCP 47 locale of the dates and times, such as `fr-FR`. Defaults to the LOCALE_ID of the application.
     * @group Props
     */
    readonly locale = input<string | undefined>();
    /**
     * First day of the week, 0 for Sunday to 6 for Saturday. Defaults to firstDayOfWeek of the translation configuration.
     * @group Props
     */
    readonly firstDayOfWeek = input<number | undefined, unknown>(undefined, { transform: (value: unknown) => (value === undefined || value === null || value === '' ? undefined : numberAttribute(value)) });
    /**
     * Whether times use a 12-hour clock. Defaults to the convention of the locale.
     * @group Props
     */
    readonly hour12 = input<boolean | undefined>();
    /**
     * Duration of a time slot of the week and day views, in minutes. Drag and drop snaps to it.
     * @defaultValue 30
     * @group Props
     */
    readonly slotDuration = input<number, unknown>(30, { transform: numberAttribute });
    /**
     * First hour displayed in the week and day views.
     * @defaultValue 0
     * @group Props
     */
    readonly dayStartHour = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * Hour at which the week and day views end, exclusive.
     * @defaultValue 24
     * @group Props
     */
    readonly dayEndHour = input<number, unknown>(24, { transform: numberAttribute });
    /**
     * Hour scrolled to when the week or day view is shown.
     * @defaultValue 8
     * @group Props
     */
    readonly scrollToHour = input<number, unknown>(8, { transform: numberAttribute });
    /**
     * Maximum height of the time grid, which scrolls beyond it.
     * @defaultValue '36rem'
     * @group Props
     */
    readonly scrollHeight = input<string>('36rem');
    /**
     * Whether Saturdays and Sundays are displayed in the month and week views.
     * @defaultValue true
     * @group Props
     */
    readonly showWeekends = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether a line marks the current time in the week and day views.
     * @defaultValue true
     * @group Props
     */
    readonly nowIndicator = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether events can be moved and resized, with the pointer or the keyboard. An event can override it with its own editable property.
     * @defaultValue false
     * @group Props
     */
    readonly editable = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether a range of days or slots can be selected by dragging across them, or with Shift and the arrow keys, to emit onRangeSelect.
     * @defaultValue false
     * @group Props
     */
    readonly selectable = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Maximum number of events in a cell of the month view. The others are behind a "+N more" button that lists them all in a popover.
     * @defaultValue 3
     * @group Props
     */
    readonly maxEventsPerDay = input<number, unknown>(3, { transform: numberAttribute });
    /**
     * Number of days listed by the agenda view, from the date.
     * @defaultValue 30
     * @group Props
     */
    readonly agendaDays = input<number, unknown>(30, { transform: numberAttribute });
    /**
     * View shown instead of the month and week views on narrow screens, null to keep the view.
     * @defaultValue 'agenda'
     * @group Props
     */
    readonly narrowView = input<SchedulerView | null>('agenda');
    /**
     * Width under which the screen counts as narrow, a CSS length.
     * @defaultValue '640px'
     * @group Props
     */
    readonly breakpoint = input<string>('640px');
    /**
     * Whether the header toolbar is displayed.
     * @defaultValue true
     * @group Props
     */
    readonly showHeader = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Texts of the component, merged with the defaults. The today text defaults to the today key of the translation configuration.
     * @group Props
     */
    readonly labels = input<Partial<SchedulerLabels> | undefined>();
    /**
     * Accessible label of the component, which then becomes a region landmark.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();

    /******************** Outputs ********************/

    /**
     * Callback to invoke when an event is clicked or activated with Enter.
     * @param {SchedulerEventClickEvent} event - Custom event.
     * @group Emits
     */
    readonly onEventClick = output<SchedulerEventClickEvent>();
    /**
     * Callback to invoke when a day is clicked, in the month view or the all-day row.
     * @param {SchedulerDateClickEvent} event - Custom event.
     * @group Emits
     */
    readonly onDateClick = output<SchedulerDateClickEvent>();
    /**
     * Callback to invoke when a time slot of the week or day view is clicked.
     * @param {SchedulerDateClickEvent} event - Custom event.
     * @group Emits
     */
    readonly onSlotClick = output<SchedulerDateClickEvent>();
    /**
     * Callback to invoke when a range of days or slots is selected, when selectable.
     * @param {SchedulerRangeSelectEvent} event - Custom event.
     * @group Emits
     */
    readonly onRangeSelect = output<SchedulerRangeSelectEvent>();
    /**
     * Callback to invoke after an event is moved or resized. Update the events with the new dates.
     * @param {SchedulerEventChangeEvent} event - Custom event.
     * @group Emits
     */
    readonly onEventChange = output<SchedulerEventChangeEvent>();
    /**
     * Callback to invoke when the view or the visible range changes, and once at start, to load the events of the range.
     * @param {SchedulerViewChangeEvent} event - Custom event.
     * @group Emits
     */
    readonly onViewChange = output<SchedulerViewChangeEvent>();

    /******************** Templates ********************/

    /**
     * Custom content of an event.
     * @param {SchedulerEventTemplateContext} context - event context.
     * @group Templates
     */
    readonly eventTemplate = contentChild<TemplateRef<SchedulerEventTemplateContext>>('event', { descendants: false });
    /**
     * Custom header, replacing the toolbar.
     * @param {SchedulerHeaderTemplateContext} context - header context.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<SchedulerHeaderTemplateContext>>('header', { descendants: false });

    readonly morePopover = viewChild<Popover>('morePopover');

    readonly body = viewChild<ElementRef<HTMLElement>>('body');

    /******************** State ********************/

    readonly titleId = uuid('pn_id_') + '_title';

    readonly viewsLabelId = uuid('pn_id_') + '_views';

    readonly hintId = uuid('pn_id_') + '_hint';

    readonly announcement = signal('');

    /** Day of the cell or slot that has the keyboard focus. */
    readonly activeDate = linkedSignal(() => startOfDay(isValidDate(this.date()) ? this.date() : new Date()));

    /** Slot that has the keyboard focus in the time grid. */
    readonly activeSlot = linkedSignal(() => this.clampSlot(Math.floor(((this.scrollToHour() - this.startHour()) * 60) / this.slot())));

    readonly selection = signal<SchedulerSelection | null>(null);

    readonly dragPreview = signal<DragPreview | null>(null);

    readonly moreDay = signal<SchedulerDay | null>(null);

    readonly now = signal(new Date());

    private lastRangeKey = '';

    private drag: DragState | null = null;

    private removeDragListeners: (() => void)[] = [];

    private autoScrollFrame: any = null;

    private suppressClick = false;

    private moreTrigger: HTMLElement | null = null;

    private nowTimer: any = null;

    private viewBeforeNarrow: SchedulerView | null = null;

    private keyboardAnchor: { day: Date; slot: number } | null = null;

    private colorCache = new Map<string, string>();

    private canvasContext: CanvasRenderingContext2D | null | undefined;

    /******************** Computed ********************/

    readonly mergedLabels = computed<SchedulerLabels>(() => {
        const translation = this.translation();
        return { ...SCHEDULER_DEFAULT_LABELS, ...(translation?.today ? { today: translation.today } : {}), ...(this.labels() ?? {}) };
    });

    readonly resolvedLocale = computed(() => this.locale() || this.appLocale || 'en-US');

    readonly weekStart = computed(() => {
        const value = this.firstDayOfWeek() ?? this.translation()?.firstDayOfWeek ?? 0;
        return ((Math.trunc(value) % 7) + 7) % 7;
    });

    readonly slot = computed(() => Math.max(5, Math.min(240, this.slotDuration() || 30)));

    readonly startHour = computed(() => Math.max(0, Math.min(23, Math.floor(this.dayStartHour() || 0))));

    readonly endHour = computed(() => Math.max(this.startHour() + 1, Math.min(24, Math.ceil(this.dayEndHour() || 24))));

    private readonly formatters = computed(() => {
        const locale = this.resolvedLocale();
        const hour12 = this.hour12();
        const make = (options: Intl.DateTimeFormatOptions) => {
            try {
                return new Intl.DateTimeFormat(locale, options);
            } catch {
                return new Intl.DateTimeFormat('en-US', options);
            }
        };
        const cycle = make({ hour: 'numeric', ...(hour12 === undefined ? {} : { hour12 }) }).resolvedOptions().hourCycle;
        const twentyFourHours = cycle === 'h23' || cycle === 'h24';
        return {
            longDate: make({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
            shortDate: make({ weekday: 'short', day: 'numeric', month: 'short' }),
            dayMonthYear: make({ day: 'numeric', month: 'short', year: 'numeric' }),
            monthYear: make({ month: 'long', year: 'numeric' }),
            weekdayShort: make({ weekday: 'short' }),
            weekdayLong: make({ weekday: 'long' }),
            time: make({ hour: twentyFourHours ? '2-digit' : 'numeric', minute: '2-digit', ...(hour12 === undefined ? {} : { hour12 }) })
        };
    });

    readonly rangeStart = computed(() => {
        const date = isValidDate(this.date()) ? this.date() : new Date();
        switch (this.view()) {
            case 'month':
                return startOfWeek(startOfMonth(date), this.weekStart());
            case 'week':
                return startOfWeek(date, this.weekStart());
            default:
                return startOfDay(date);
        }
    });

    readonly rangeEnd = computed(() => {
        const start = this.rangeStart();
        const date = isValidDate(this.date()) ? this.date() : new Date();
        switch (this.view()) {
            case 'month': {
                const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                return addDays(startOfWeek(lastDay, this.weekStart()), 7);
            }
            case 'week':
                return addDays(start, 7);
            case 'agenda':
                return addDays(start, Math.max(1, Math.floor(this.agendaDays() || 30)));
            default:
                return addDays(start, 1);
        }
    });

    /** Visible days, without the weekends when they are hidden in the month and week views. */
    readonly days = computed<SchedulerDay[]>(() => {
        const start = this.rangeStart();
        const count = dayDiff(start, this.rangeEnd());
        const view = this.view();
        const month = (isValidDate(this.date()) ? this.date() : new Date()).getMonth();
        const today = this.now();
        const { longDate, weekdayShort } = this.formatters();
        const hideWeekends = !this.showWeekends() && (view === 'month' || view === 'week');
        const days: SchedulerDay[] = [];
        for (let i = 0; i < count; i++) {
            const date = addDays(start, i);
            if (hideWeekends && isWeekend(date)) continue;
            const key = dayKey(date);
            days.push({
                key,
                date,
                number: date.getDate(),
                today: isSameDay(date, today),
                outside: view === 'month' && date.getMonth() !== month,
                weekend: isWeekend(date),
                label: longDate.format(date),
                weekday: weekdayShort.format(date),
                headerId: `${this.titleId}_${key}`
            });
        }
        return days;
    });

    readonly dayByKey = computed(() => new Map(this.days().map((day) => [day.key, day])));

    readonly columns = computed(() => this.days());

    readonly columnCount = computed(() => (this.showWeekends() ? 7 : 5));

    readonly weekdays = computed(() => {
        const { weekdayShort, weekdayLong } = this.formatters();
        const start = startOfWeek(new Date(2026, 0, 4), this.weekStart());
        const result: { key: number; short: string; long: string }[] = [];
        for (let i = 0; i < 7; i++) {
            const date = addDays(start, i);
            if (!this.showWeekends() && isWeekend(date)) continue;
            result.push({ key: date.getDay(), short: weekdayShort.format(date), long: weekdayLong.format(date) });
        }
        return result;
    });

    readonly weeks = computed(() => {
        const weeks: { key: string; days: SchedulerDay[] }[] = [];
        const start = this.rangeStart();
        for (const day of this.days()) {
            const index = Math.floor(dayDiff(start, day.date) / 7);
            (weeks[index] ||= { key: day.key, days: [] }).days.push(day);
        }
        return weeks.filter(Boolean);
    });

    readonly normalized = computed<NormalizedEvent[]>(() => {
        const editable = this.editable();
        return (this.events() ?? [])
            .map((event, index) => normalizeEvent(event, index, editable))
            .filter((item): item is NormalizedEvent => !!item)
            .sort(compareEvents);
    });

    /** Events of the visible range. */
    readonly visibleEvents = computed(() => {
        const start = this.rangeStart();
        const end = this.rangeEnd();
        return this.normalized().filter((item) => overlaps(item.start, item.end, start, end));
    });

    readonly monthCells = computed(() => {
        const cells = new Map<string, { visible: SchedulerDaySegment[]; all: SchedulerDaySegment[]; hidden: number }>();
        if (this.view() !== 'month') return cells;
        const max = Math.max(1, Math.floor(this.maxEventsPerDay() || 3));
        const events = this.visibleEvents();
        for (const day of this.days()) {
            const all = this.daySegments(events, day.date, false);
            cells.set(day.key, { all, visible: all.slice(0, max), hidden: Math.max(0, all.length - max) });
        }
        return cells;
    });

    readonly allDaySegments = computed(() => {
        const result = new Map<string, SchedulerDaySegment[]>();
        const view = this.view();
        if (view !== 'week' && view !== 'day') return result;
        const events = this.visibleEvents().filter((item) => item.allDayRow);
        for (const day of this.days()) {
            result.set(day.key, this.daySegments(events, day.date, false));
        }
        return result;
    });

    readonly timedSegments = computed(() => {
        const result = new Map<string, TimedSegment[]>();
        const view = this.view();
        if (view !== 'week' && view !== 'day') return result;
        const events = this.visibleEvents().filter((item) => !item.allDayRow);
        for (const day of this.days()) {
            result.set(day.key, layoutDay(events, day.date, this.startHour(), this.endHour()));
        }
        return result;
    });

    readonly agendaGroups = computed(() => {
        if (this.view() !== 'agenda') return [];
        const events = this.visibleEvents();
        return this.days()
            .map((day) => ({ key: day.key, day, segments: this.daySegments(events, day.date, true) }))
            .filter((group) => group.segments.length > 0);
    });

    readonly slots = computed<SchedulerSlot[]>(() => {
        const slot = this.slot();
        const startMinutes = this.startHour() * 60;
        const endMinutes = this.endHour() * 60;
        const { time } = this.formatters();
        const result: SchedulerSlot[] = [];
        for (let minutes = startMinutes, index = 0; minutes < endMinutes; minutes += slot, index++) {
            result.push({ index, minutes, hour: minutes % 60 === 0, label: time.format(atMinutes(new Date(2026, 0, 1), minutes)) });
        }
        return result;
    });

    readonly nowTop = computed(() => {
        if (!this.nowIndicator()) return null;
        const minutes = minutesOfDay(this.now());
        const start = this.startHour() * 60;
        const end = this.endHour() * 60;
        if (minutes < start || minutes >= end) return null;
        return ((minutes - start) / (end - start)) * 100;
    });

    /** Key of the day whose cell or slot is in the tab order. */
    readonly tabbableKey = computed(() => {
        const key = dayKey(this.activeDate());
        if (this.dayByKey().has(key)) return key;
        const today = this.days().find((day) => day.today);
        return (today ?? this.days()[0])?.key;
    });

    readonly title = computed(() => {
        const { monthYear, dayMonthYear, longDate } = this.formatters();
        const start = this.rangeStart();
        switch (this.view()) {
            case 'month':
                return monthYear.format(isValidDate(this.date()) ? this.date() : new Date());
            case 'day':
                return longDate.format(start);
            case 'week': {
                const days = this.days();
                return this.formatRange(dayMonthYear, days[0]?.date ?? start, days[days.length - 1]?.date ?? start);
            }
            default:
                return this.formatRange(dayMonthYear, start, addDays(this.rangeEnd(), -1));
        }
    });

    /** Whether the default header, with its title, is displayed. */
    readonly hasTitle = computed(() => this.showHeader() && !this.headerTemplate());

    readonly viewOptions = computed(() => {
        const labels = this.mergedLabels();
        return (this.views() ?? []).map((value) => ({ value, label: labels[value] }));
    });

    readonly headerContext = computed<SchedulerHeaderTemplateContext>(() => ({
        $implicit: this.title(),
        title: this.title(),
        view: this.view(),
        start: this.rangeStart(),
        end: this.rangeEnd(),
        today: () => this.today(),
        prev: () => this.prev(),
        next: () => this.next(),
        changeView: (view: SchedulerView) => this.changeView(view)
    }));

    readonly ghostTimedSegments = (column: SchedulerDay) => {
        const preview = this.dragPreview();
        if (!preview || preview.item.allDayRow || (this.view() !== 'week' && this.view() !== 'day')) return [];
        const item = { ...preview.item, start: preview.start, end: preview.end };
        return layoutDay([item], column.date, this.startHour(), this.endHour());
    };

    readonly ghostDaySegments = (key: string) => (this.view() === 'month' ? this.ghostFor(key, false) : []);

    readonly ghostAllDaySegments = (key: string) => this.ghostFor(key, true);

    /******************** Lifecycle ********************/

    onAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) return;
        const window = this.document.defaultView;
        this.nowTimer = window?.setInterval(() => this.now.set(new Date()), MINUTE);
    }

    onDestroy() {
        this.document.defaultView?.clearInterval(this.nowTimer);
        this.endDrag();
    }

    /******************** Navigation ********************/

    /**
     * Shows the current date.
     * @group Method
     */
    today() {
        this.date.set(new Date());
        this.announceNavigation();
    }

    /**
     * Shows the previous range: month, week, day or agenda period.
     * @group Method
     */
    prev() {
        this.navigate(-1);
    }

    /**
     * Shows the next range: month, week, day or agenda period.
     * @group Method
     */
    next() {
        this.navigate(1);
    }

    /**
     * Changes the view.
     * @param {SchedulerView} view - New view.
     * @group Method
     */
    changeView(view: SchedulerView) {
        if (!view || view === this.view()) return;
        this.viewBeforeNarrow = null;
        this.selection.set(null);
        this.view.set(view);
        this.announceNavigation();
    }

    private navigate(direction: number) {
        const date = isValidDate(this.date()) ? this.date() : new Date();
        let next: Date;
        switch (this.view()) {
            case 'month':
                next = addMonths(date, direction);
                break;
            case 'week':
                next = addDays(date, 7 * direction);
                break;
            case 'agenda':
                next = addDays(date, Math.max(1, Math.floor(this.agendaDays() || 30)) * direction);
                break;
            default:
                next = addDays(date, direction);
                while (!this.showWeekends() && isWeekend(next)) next = addDays(next, direction);
        }
        this.selection.set(null);
        this.date.set(next);
        this.announceNavigation();
    }

    private announceNavigation() {
        const view = this.view();
        const { dayMonthYear } = this.formatters();
        this.announce(view === 'week' ? format(this.labelOf('weekOf'), dayMonthYear.format(this.days()[0]?.date ?? this.rangeStart())) : this.title());
    }

    /******************** Template helpers ********************/

    labelOf(key: keyof SchedulerLabels): string {
        return this.mergedLabels()[key];
    }

    formatLabel(key: keyof SchedulerLabels, ...values: (string | number)[]) {
        return format(this.labelOf(key), ...values);
    }

    formatTime(date: Date) {
        return this.formatters().time.format(date);
    }

    timeRange(start: Date, end: Date) {
        return `${this.formatTime(start)} – ${this.formatTime(end)}`;
    }

    /**
     * Accessible name of an event, such as "Review, Tue 3 Dec 10:00 – 11:00".
     */
    eventLabel(item: NormalizedEvent) {
        return `${item.event.title}, ${this.describeTime(item.start, item.end, item.allDay)}`;
    }

    describeTime(start: Date, end: Date, allDay: boolean) {
        const { shortDate } = this.formatters();
        if (allDay) {
            const last = addDays(end, -1);
            return isSameDay(start, last) ? `${shortDate.format(start)}, ${this.labelOf('allDay')}` : this.formatRange(shortDate, start, last);
        }
        if (isSameDay(start, end) || (end.getTime() - startOfDay(end).getTime() === 0 && end.getTime() - start.getTime() <= DAY)) {
            return `${shortDate.format(start)} ${this.timeRange(start, end)}`;
        }
        return `${shortDate.format(start)} ${this.formatTime(start)} – ${shortDate.format(end)} ${this.formatTime(end)}`;
    }

    dayCellLabel(day: SchedulerDay) {
        const count = this.monthCells().get(day.key)?.all.length ?? 0;
        return count ? `${day.label}, ${this.formatLabel('eventCount', count)}` : day.label;
    }

    slotLabel(day: SchedulerDay, slot: SchedulerSlot) {
        return `${day.label}, ${this.timeRange(atMinutes(day.date, slot.minutes), atMinutes(day.date, slot.minutes + this.slot()))}`;
    }

    isDaySelected(day: SchedulerDay) {
        const selection = this.selection();
        if (selection) {
            return overlaps(day.date, addDays(day.date, 1), selection.start, selection.end);
        }
        return day.key === this.tabbableKey();
    }

    selectionIn(column: SchedulerDay) {
        const selection = this.selection();
        if (!selection || selection.allDay || !isSameDay(selection.start, column.date)) return null;
        const start = this.startHour() * 60;
        const total = this.endHour() * 60 - start;
        const from = minutesOfDay(selection.start);
        const to = isSameDay(selection.start, selection.end) ? minutesOfDay(selection.end) : 24 * 60;
        return { top: ((from - start) / total) * 100, height: ((to - from) / total) * 100 };
    }

    eventContext(segment: SchedulerDaySegment | TimedSegment, mode: SegmentMode): SchedulerEventTemplateContext {
        const item = segment.item;
        const timeText = mode === 'time' ? this.timeRange(item.start, item.end) : ((segment as SchedulerDaySegment).timeText ?? '');
        return { $implicit: item.event, event: item.event, view: this.view(), timeText, allDay: mode === 'day' };
    }

    segmentStyle(segment: SchedulerDaySegment | TimedSegment, mode: SegmentMode) {
        const style: Record<string, string> = mode === 'list' ? {} : this.colorStyle(segment.item);
        if (mode === 'time') {
            const timed = segment as TimedSegment;
            style['top'] = `${timed.top}%`;
            style['height'] = `${timed.height}%`;
            style['inset-inline-start'] = `${timed.left}%`;
            style['width'] = `${timed.width}%`;
        }
        return style;
    }

    /** Whether a segment of the time grid lasts one slot or less, too short for the title and the time on two lines. */
    isCompact(segment: TimedSegment) {
        return segment.end.getTime() - segment.start.getTime() <= this.slot() * MINUTE;
    }

    colorStyle(item: NormalizedEvent): Record<string, string> {
        const color = item.event.color;
        if (!color) return {};
        return { background: color, 'border-color': color, color: item.event.textColor || this.textColorOf(color) };
    }

    /******************** Events ********************/

    handleEventClick(event: MouseEvent, item: NormalizedEvent) {
        event.stopPropagation();
        if (this.suppressClick) return;
        this.onEventClick.emit({ originalEvent: event, event: item.event });
    }

    onDayClick(event: MouseEvent, day: SchedulerDay) {
        if (this.suppressClick) return;
        this.activeDate.set(day.date);
        this.onDateClick.emit({ originalEvent: event, start: day.date, end: addDays(day.date, 1), allDay: true });
    }

    onAllDayClick(event: MouseEvent, day: SchedulerDay) {
        if (this.suppressClick) return;
        this.onDateClick.emit({ originalEvent: event, start: day.date, end: addDays(day.date, 1), allDay: true });
    }

    handleSlotClick(event: Event, day: SchedulerDay, slot: SchedulerSlot) {
        if (this.suppressClick) return;
        this.activeDate.set(day.date);
        this.activeSlot.set(slot.index);
        const start = atMinutes(day.date, slot.minutes);
        this.onSlotClick.emit({ originalEvent: event, start, end: atMinutes(day.date, slot.minutes + this.slot()), allDay: false });
    }

    onCellFocus(day: SchedulerDay) {
        if (!isSameDay(day.date, this.activeDate())) this.activeDate.set(day.date);
    }

    onSlotFocus(day: SchedulerDay, slot: SchedulerSlot) {
        if (!isSameDay(day.date, this.activeDate())) this.activeDate.set(day.date);
        if (this.activeSlot() !== slot.index) this.activeSlot.set(slot.index);
    }

    onContextMenu(event: Event) {
        if (this.drag?.active) event.preventDefault();
    }

    openMore(event: MouseEvent, day: SchedulerDay) {
        event.stopPropagation();
        this.moreTrigger = event.currentTarget as HTMLElement;
        this.moreDay.set(day);
        this.morePopover()?.toggle(event, event.currentTarget);
    }

    onMoreHide() {
        const active = this.document.activeElement as HTMLElement | null;
        const trigger = this.moreTrigger;
        this.moreDay.set(null);
        if (trigger && (!active || active === this.document.body || active.closest('.p-popover'))) {
            trigger.focus();
        }
    }

    /******************** Keyboard ********************/

    onMonthKeydown(event: KeyboardEvent) {
        const target = event.target as HTMLElement;
        if (!target.hasAttribute('data-p-day')) return;
        const day = this.activeDate();
        const rtl = isRTL(this.el.nativeElement);
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowRight': {
                const step = (event.key === 'ArrowRight') !== rtl ? 1 : -1;
                this.moveDayFocus(this.skipHidden(addDays(day, step), step), event.shiftKey);
                break;
            }
            case 'ArrowUp':
            case 'ArrowDown':
                this.moveDayFocus(addDays(day, event.key === 'ArrowDown' ? 7 : -7), event.shiftKey);
                break;
            case 'Home':
            case 'End': {
                const week = this.weeks().find((w) => w.days.some((d) => isSameDay(d.date, day)));
                const target = event.key === 'Home' ? week?.days[0] : week?.days[week.days.length - 1];
                if (target) this.moveDayFocus(target.date, event.shiftKey);
                break;
            }
            case 'PageUp':
            case 'PageDown':
                this.moveDayFocus(addMonths(day, (event.key === 'PageDown' ? 1 : -1) * (event.shiftKey ? 12 : 1)), false);
                break;
            case 'Enter':
            case ' ': {
                const selection = this.selection();
                if (selection && this.selectable()) {
                    this.emitRangeSelect(event, selection);
                } else {
                    this.onDateClick.emit({ originalEvent: event, start: day, end: addDays(day, 1), allDay: true });
                }
                break;
            }
            case 'Escape':
                if (!this.selection()) return;
                this.clearSelection();
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    onTimeGridKeydown(event: KeyboardEvent) {
        const target = event.target as HTMLElement;
        if (!target.hasAttribute('data-p-slot')) return;
        const day = this.activeDate();
        const slot = this.activeSlot();
        const rtl = isRTL(this.el.nativeElement);
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
                this.moveSlotFocus(day, this.clampSlot(slot + (event.key === 'ArrowDown' ? 1 : -1)), event.shiftKey);
                break;
            case 'ArrowLeft':
            case 'ArrowRight': {
                const step = (event.key === 'ArrowRight') !== rtl ? 1 : -1;
                this.moveSlotFocus(this.skipHidden(addDays(day, step), step), slot, false);
                break;
            }
            case 'Home':
            case 'End':
                this.moveSlotFocus(day, event.key === 'Home' ? 0 : this.slots().length - 1, event.shiftKey);
                break;
            case 'PageUp':
            case 'PageDown':
                this.moveSlotFocus(addDays(day, (event.key === 'PageDown' ? 1 : -1) * (this.view() === 'week' ? 7 : 1)), slot, false);
                break;
            case 'Enter':
            case ' ': {
                const selection = this.selection();
                if (selection && this.selectable()) {
                    this.emitRangeSelect(event, selection);
                } else {
                    const minutes = this.slots()[slot]?.minutes ?? 0;
                    this.onSlotClick.emit({ originalEvent: event, start: atMinutes(day, minutes), end: atMinutes(day, minutes + this.slot()), allDay: false });
                }
                break;
            }
            case 'Escape':
                if (!this.selection()) return;
                this.clearSelection();
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    /** Arrow keys on the "+N more" button go back to the grid. */
    onInnerKeydown(event: KeyboardEvent, day: SchedulerDay) {
        if (event.key === 'Escape') {
            event.stopPropagation();
            this.focusDay(day.date);
        }
    }

    onEventKeydown(event: KeyboardEvent, segment: SchedulerDaySegment | TimedSegment, mode: SegmentMode) {
        const item = segment.item;
        const rtl = isRTL(this.el.nativeElement);
        const arrow = event.key.startsWith('Arrow');
        if (mode === 'list') {
            return;
        }
        event.stopPropagation();
        if (event.altKey && arrow && item.editable) {
            event.preventDefault();
            const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
            const sign = (horizontal ? (event.key === 'ArrowRight') !== rtl : event.key === 'ArrowDown') ? 1 : -1;
            if (mode === 'time') {
                if (horizontal) {
                    const days = this.skipHiddenDelta(item.start, sign);
                    this.emitChange(event, item, addDays(item.start, days), addDays(item.end, days), 'move');
                } else if (event.shiftKey) {
                    // like the resize handle, the end stays within the visible hours of its day
                    const endDay = startOfDay(new Date(item.end.getTime() - 1));
                    const lastEnd = atMinutes(endDay, this.endHour() * 60).getTime();
                    let end = Math.max(item.end.getTime() + sign * this.slot() * MINUTE, item.start.getTime() + this.slot() * MINUTE);
                    if (item.end.getTime() <= lastEnd) end = Math.min(end, lastEnd);
                    this.emitChange(event, item, item.start, new Date(end), 'resize');
                } else {
                    // like a drag, the start stays within the visible hours, so that the event does not leave the grid
                    const day = startOfDay(item.start);
                    const duration = item.end.getTime() - item.start.getTime();
                    const first = atMinutes(day, this.startHour() * 60).getTime();
                    const last = atMinutes(day, this.endHour() * 60 - Math.min(this.slot(), duration / MINUTE)).getTime();
                    let start = item.start.getTime() + sign * this.slot() * MINUTE;
                    if (item.start.getTime() >= first && item.start.getTime() <= last) start = Math.max(first, Math.min(last, start));
                    this.emitChange(event, item, new Date(start), new Date(start + duration), 'move');
                }
            } else {
                const days = horizontal ? this.skipHiddenDelta(item.start, sign) : this.view() === 'month' ? sign * 7 : 0;
                if (days) this.emitChange(event, item, addDays(item.start, days), addDays(item.end, days), 'move');
            }
            return;
        }
        if (arrow && !event.altKey) {
            event.preventDefault();
            const step = event.key === 'ArrowDown' || (event.key === 'ArrowRight') !== rtl ? 1 : -1;
            const container = (event.currentTarget as HTMLElement).closest('.p-scheduler-month, .p-scheduler-time-grid') ?? this.el.nativeElement;
            const buttons = Array.from(container.querySelectorAll('[data-p-event]')).filter((el: any) => el.getAttribute('tabindex') !== '-1') as HTMLElement[];
            const index = buttons.indexOf(event.currentTarget as HTMLElement);
            buttons[index + step]?.focus();
            return;
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            if (mode === 'time') {
                this.moveSlotFocus(startOfDay((segment as TimedSegment).start), this.clampSlot(Math.floor((minutesOfDay((segment as TimedSegment).start) - this.startHour() * 60) / this.slot())), false);
            } else if (this.view() === 'month') {
                const cell = (event.currentTarget as HTMLElement).closest('[data-p-day]') as HTMLElement | null;
                const day = cell && this.dayByKey().get(cell.getAttribute('data-p-day')!);
                if (day) this.focusDay(day.date);
            }
        }
    }

    /** Up and down arrows move between the events of the agenda and the popover. */
    onListKeydown(event: KeyboardEvent) {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        const container = event.currentTarget as HTMLElement;
        const buttons = Array.from(container.querySelectorAll('[data-p-event]')) as HTMLElement[];
        const index = buttons.indexOf(this.document.activeElement as HTMLElement);
        if (index === -1) return;
        event.preventDefault();
        buttons[Math.max(0, Math.min(buttons.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)))]?.focus();
    }

    private moveDayFocus(date: Date, extend: boolean) {
        this.updateKeyboardSelection(extend, date, 0, true);
        this.focusDay(date);
    }

    private moveSlotFocus(date: Date, slot: number, extend: boolean) {
        if (extend && !isSameDay(date, this.activeDate())) extend = false;
        this.updateKeyboardSelection(extend, date, slot, false);
        this.activeSlot.set(slot);
        this.focusDay(date);
    }

    private updateKeyboardSelection(extend: boolean, date: Date, slot: number, allDay: boolean) {
        if (!extend || !this.selectable()) {
            this.keyboardAnchor = null;
            if (this.selection()) this.selection.set(null);
            return;
        }
        if (!this.keyboardAnchor) {
            this.keyboardAnchor = { day: this.activeDate(), slot: this.activeSlot() };
        }
        const anchor = this.keyboardAnchor;
        if (allDay) {
            const [a, b] = anchor.day.getTime() <= date.getTime() ? [anchor.day, date] : [date, anchor.day];
            this.selection.set({ start: startOfDay(a), end: addDays(startOfDay(b), 1), allDay: true });
        } else {
            const from = Math.min(anchor.slot, slot);
            const to = Math.max(anchor.slot, slot);
            const slots = this.slots();
            this.selection.set({ start: atMinutes(date, slots[from].minutes), end: atMinutes(date, slots[to].minutes + this.slot()), allDay: false });
        }
    }

    private focusDay(date: Date) {
        const day = startOfDay(date);
        const visible = this.dayByKey().has(dayKey(day));
        this.activeDate.set(day);
        if (!visible) {
            this.date.set(day);
            this.activeDate.set(day);
            this.announceNavigation();
        }
        afterNextRender(
            () => {
                const host = this.el.nativeElement as HTMLElement;
                const key = dayKey(day);
                const target = this.view() === 'month' ? host.querySelector<HTMLElement>(`[data-p-day="${key}"]`) : host.querySelector<HTMLElement>(`[data-p-column="${key}"] [data-p-slot="${this.activeSlot()}"]`);
                target?.focus();
                if (target && this.view() !== 'month') target.scrollIntoView?.({ block: 'nearest' });
            },
            { injector: this.injector }
        );
    }

    private clearSelection() {
        this.keyboardAnchor = null;
        this.selection.set(null);
    }

    private emitRangeSelect(event: Event | undefined, selection: SchedulerSelection) {
        this.onRangeSelect.emit({ originalEvent: event, start: selection.start, end: selection.end, allDay: selection.allDay });
        this.clearSelection();
    }

    private emitChange(event: Event | undefined, item: NormalizedEvent, start: Date, end: Date, type: 'move' | 'resize') {
        if (start.getTime() === item.start.getTime() && end.getTime() === item.end.getTime()) return;
        this.onEventChange.emit({ originalEvent: event, event: item.event, start, end, oldStart: item.start, oldEnd: item.end, type });
        this.announce(format(this.labelOf('moved'), item.event.title, this.describeTime(start, end, item.allDay)));
        if (event instanceof KeyboardEvent) {
            const id = String(item.event.id);
            afterNextRender(
                () => {
                    const host = this.el.nativeElement as HTMLElement;
                    const target = Array.from(host.querySelectorAll<HTMLElement>('[data-p-event]')).find((el) => el.getAttribute('data-p-event') === id && el.getAttribute('tabindex') !== '-1');
                    target?.focus();
                },
                { injector: this.injector }
            );
        }
    }

    /******************** Pointer ********************/

    onEventPointerDown(event: PointerEvent, segment: SchedulerDaySegment | TimedSegment, mode: SegmentMode) {
        if (mode === 'list') return;
        event.stopPropagation();
        if (event.button !== 0 || !segment.item.editable) return;
        const area: DragArea = mode === 'time' ? 'time' : this.view() === 'month' ? 'day' : 'allday';
        this.startDrag(event, 'move', area, segment.item);
    }

    onResizePointerDown(event: PointerEvent, segment: TimedSegment) {
        event.stopPropagation();
        if (event.button !== 0) return;
        event.preventDefault();
        this.startDrag(event, 'resize', 'time', segment.item, true);
    }

    onSlotPointerDown(event: PointerEvent, _column: SchedulerDay) {
        if (event.button !== 0 || !this.selectable()) return;
        this.startDrag(event, 'select', 'time');
    }

    onDayPointerDown(event: PointerEvent, _day: SchedulerDay, area: 'day' | 'allday') {
        if (event.button !== 0 || !this.selectable()) return;
        this.startDrag(event, 'select', area);
    }

    private startDrag(event: PointerEvent, mode: DragState['mode'], area: DragArea, item?: NormalizedEvent, immediate = false) {
        if (!isPlatformBrowser(this.platformId)) return;
        this.endDrag();
        const origin = this.positionAt(area, event.clientX, event.clientY);
        if (!origin) return;
        this.drag = { mode, area, item, pointerId: event.pointerId, pointerType: event.pointerType, x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, origin, active: false };
        if (event.pointerType === 'touch' && !immediate) {
            this.drag.timer = setTimeout(() => this.activateDrag(), LONG_PRESS);
        }
        const doc = this.document;
        const listen = (type: string, handler: (e: any) => void, options?: AddEventListenerOptions) => {
            doc.addEventListener(type, handler, options);
            this.removeDragListeners.push(() => doc.removeEventListener(type, handler, options));
        };
        listen('pointermove', (e: PointerEvent) => this.onDragMove(e));
        listen('pointerup', (e: PointerEvent) => this.onDragEnd(e, true));
        listen('pointercancel', (e: PointerEvent) => this.onDragEnd(e, false));
        listen('touchmove', (e: TouchEvent) => this.drag?.active && e.cancelable && e.preventDefault(), { passive: false });
        // In the capture phase: the dragged event has the focus, and its own Escape handler would stop the key first.
        listen(
            'keydown',
            (e: KeyboardEvent) => {
                if (e.key === 'Escape' && this.drag?.active) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.cancelDrag();
                }
            },
            { capture: true }
        );
    }

    private onDragMove(event: PointerEvent) {
        const drag = this.drag;
        if (!drag || event.pointerId !== drag.pointerId) return;
        drag.lastX = event.clientX;
        drag.lastY = event.clientY;
        if (!drag.active) {
            const distance = Math.hypot(event.clientX - drag.x, event.clientY - drag.y);
            if (distance < DRAG_THRESHOLD) return;
            if (drag.pointerType === 'touch' && drag.mode !== 'resize') {
                this.endDrag();
                return;
            }
            this.activateDrag();
        }
        event.preventDefault();
        this.updateDrag();
    }

    private onDragEnd(event: PointerEvent, commit: boolean) {
        const drag = this.drag;
        if (!drag || event.pointerId !== drag.pointerId) return;
        if (drag.active) {
            if (commit) {
                this.updateDrag();
                const preview = this.dragPreview();
                const selection = this.selection();
                if (drag.mode === 'select' && selection) {
                    this.emitRangeSelect(event, selection);
                } else if (preview && drag.item) {
                    this.emitChange(event, drag.item, preview.start, preview.end, drag.mode === 'resize' ? 'resize' : 'move');
                }
            } else if (drag.mode === 'select') {
                this.clearSelection();
            }
            this.suppressClick = true;
            setTimeout(() => (this.suppressClick = false));
        }
        this.endDrag();
    }

    private activateDrag() {
        const drag = this.drag;
        if (!drag || drag.active) return;
        drag.active = true;
        clearTimeout(drag.timer);
        this.morePopover()?.hide();
        if (drag.mode === 'select') this.keyboardAnchor = null;
        this.updateDrag();
        if (drag.area === 'time') this.autoScroll();
    }

    /** Escape during a drag: drops the preview and the selection, and ignores the click of the pointer release. */
    private cancelDrag() {
        if (this.drag?.mode === 'select') this.clearSelection();
        this.suppressClick = true;
        this.document.addEventListener('pointerup', () => setTimeout(() => (this.suppressClick = false)), { once: true, capture: true });
        this.endDrag();
    }

    private endDrag() {
        if (this.drag) {
            clearTimeout(this.drag.timer);
        }
        this.drag = null;
        this.removeDragListeners.forEach((remove) => remove());
        this.removeDragListeners = [];
        if (this.autoScrollFrame !== null) {
            this.document.defaultView?.cancelAnimationFrame(this.autoScrollFrame);
            this.autoScrollFrame = null;
        }
        if (this.dragPreview()) this.dragPreview.set(null);
    }

    private autoScroll() {
        const window = this.document.defaultView;
        if (!window) return;
        const step = () => {
            const drag = this.drag;
            const body = this.body()?.nativeElement;
            if (!drag?.active || !body) {
                this.autoScrollFrame = null;
                return;
            }
            const rect = body.getBoundingClientRect();
            let delta = 0;
            if (drag.lastY < rect.top + AUTOSCROLL_EDGE) delta = -Math.ceil((rect.top + AUTOSCROLL_EDGE - drag.lastY) / 4);
            else if (drag.lastY > rect.bottom - AUTOSCROLL_EDGE) delta = Math.ceil((drag.lastY - rect.bottom + AUTOSCROLL_EDGE) / 4);
            if (delta) {
                const before = body.scrollTop;
                body.scrollTop += delta;
                if (body.scrollTop !== before) this.updateDrag();
            }
            this.autoScrollFrame = window.requestAnimationFrame(step);
        };
        this.autoScrollFrame = window.requestAnimationFrame(step);
    }

    private updateDrag() {
        const drag = this.drag;
        if (!drag?.active) return;
        const position = this.positionAt(drag.area, drag.lastX, drag.lastY, drag.mode === 'select' ? drag.origin.day : undefined);
        if (!position) return;
        const slot = this.slot();
        const snap = (minutes: number) => Math.round(minutes / slot) * slot;
        const item = drag.item;
        if (drag.mode === 'select') {
            if (drag.area === 'time') {
                const floor = (minutes: number) => Math.floor(minutes / slot) * slot;
                const a = floor(drag.origin.minutes);
                const b = floor(Math.min(position.minutes, this.endHour() * 60 - 1));
                this.selection.set({ start: atMinutes(drag.origin.day, Math.min(a, b)), end: atMinutes(drag.origin.day, Math.max(a, b) + slot), allDay: false });
            } else {
                const [a, b] = drag.origin.day.getTime() <= position.day.getTime() ? [drag.origin.day, position.day] : [position.day, drag.origin.day];
                this.selection.set({ start: a, end: addDays(b, 1), allDay: true });
            }
            return;
        }
        if (!item) return;
        let start = item.start;
        let end = item.end;
        if (drag.mode === 'resize') {
            const minimum = item.start.getTime() + slot * MINUTE;
            const candidate = atMinutes(position.day, snap(position.minutes));
            end = new Date(Math.max(candidate.getTime(), minimum));
        } else if (drag.area === 'time') {
            const days = dayDiff(drag.origin.day, position.day);
            const duration = item.end.getTime() - item.start.getTime();
            const min = this.startHour() * 60;
            const max = this.endHour() * 60 - Math.min(slot, duration / MINUTE);
            const minutes = Math.max(min, Math.min(max, snap(minutesOfDay(item.start) + position.minutes - drag.origin.minutes)));
            start = atMinutes(addDays(startOfDay(item.start), days), minutes);
            end = new Date(start.getTime() + duration);
        } else {
            const days = dayDiff(drag.origin.day, position.day);
            start = addDays(item.start, days);
            end = addDays(item.end, days);
        }
        const preview = this.dragPreview();
        if (!preview || preview.start.getTime() !== start.getTime() || preview.end.getTime() !== end.getTime()) {
            this.dragPreview.set({ item, start, end });
        }
    }

    /**
     * Day and minutes under the pointer, from the geometry of the columns or cells, so that it works under the dragged element too.
     */
    private positionAt(area: DragArea, x: number, y: number, lockedDay?: Date): { day: Date; minutes: number } | null {
        const host = this.el.nativeElement as HTMLElement;
        const attribute = area === 'time' ? 'data-p-column' : area === 'day' ? 'data-p-day' : 'data-p-allday';
        let elements = Array.from(host.querySelectorAll<HTMLElement>(`[${attribute}]`));
        if (lockedDay && area === 'time') {
            elements = elements.filter((el) => el.getAttribute(attribute) === dayKey(lockedDay));
        }
        if (!elements.length) return null;
        let best: HTMLElement | null = null;
        let bestDistance = Infinity;
        let bestRect: DOMRect | null = null;
        for (const element of elements) {
            const rect = element.getBoundingClientRect();
            const dx = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
            const dy = area === 'time' ? 0 : y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;
            const distance = dx * dx + dy * dy;
            if (distance < bestDistance) {
                best = element;
                bestDistance = distance;
                bestRect = rect;
            }
        }
        const day = best && this.dayByKey().get(best.getAttribute(attribute)!);
        if (!day || !bestRect) return null;
        let minutes = 0;
        if (area === 'time') {
            const start = this.startHour() * 60;
            const total = this.endHour() * 60 - start;
            const ratio = bestRect.height ? Math.max(0, Math.min(1, (y - bestRect.top) / bestRect.height)) : 0;
            minutes = start + ratio * total;
        }
        return { day: day.date, minutes };
    }

    /******************** Internals ********************/

    private daySegments(events: NormalizedEvent[], day: Date, list: boolean): SchedulerDaySegment[] {
        const dayStart = startOfDay(day);
        const dayEnd = addDays(dayStart, 1);
        const result: SchedulerDaySegment[] = [];
        for (const item of events) {
            if (!overlaps(item.start, item.end, dayStart, dayEnd)) continue;
            const isStart = item.start.getTime() >= dayStart.getTime();
            const isEnd = item.end.getTime() <= dayEnd.getTime();
            let timeText = '';
            if (list) {
                timeText = item.allDay || (!isStart && !isEnd) ? this.labelOf('allDay') : !isStart ? `– ${this.formatTime(item.end)}` : !isEnd ? `${this.formatTime(item.start)} –` : this.timeRange(item.start, item.end);
            } else if (!item.allDay && isStart) {
                timeText = this.formatTime(item.start);
            }
            result.push({ key: `${item.event.id}|${dayKey(day)}`, item, isStart, isEnd, timeText });
        }
        return result;
    }

    private ghostFor(key: string, allDayRow: boolean): SchedulerDaySegment[] {
        const preview = this.dragPreview();
        if (!preview || (allDayRow && !preview.item.allDayRow)) return [];
        const day = this.dayByKey().get(key);
        if (!day || !overlaps(preview.start, preview.end, day.date, addDays(day.date, 1))) return [];
        return [{ key: 'ghost', item: preview.item, isStart: true, isEnd: true, timeText: '' }];
    }

    private formatRange(formatter: Intl.DateTimeFormat, start: Date, end: Date) {
        if (isSameDay(start, end)) return formatter.format(start);
        const range = (formatter as any).formatRange;
        if (typeof range === 'function') {
            try {
                return range.call(formatter, start, end);
            } catch {
                // fall back below
            }
        }
        return `${formatter.format(start)} – ${formatter.format(end)}`;
    }

    private skipHidden(date: Date, step: number) {
        let next = date;
        const view = this.view();
        if (!this.showWeekends() && (view === 'month' || view === 'week')) {
            while (isWeekend(next)) next = addDays(next, step);
        }
        return next;
    }

    private skipHiddenDelta(date: Date, step: number) {
        return dayDiff(startOfDay(date), this.skipHidden(addDays(startOfDay(date), step), step));
    }

    private clampSlot(slot: number) {
        const count = Math.max(1, Math.ceil(((this.endHour() - this.startHour()) * 60) / this.slot()));
        return Math.max(0, Math.min(count - 1, isNaN(slot) ? 0 : slot));
    }

    private scrollToTime() {
        const body = this.body()?.nativeElement;
        if (!body) return;
        const start = this.startHour();
        const total = this.endHour() - start;
        const ratio = Math.max(0, Math.min(1, (this.scrollToHour() - start) / total));
        const content = body.firstElementChild as HTMLElement | null;
        body.scrollTop = (content?.scrollHeight ?? body.scrollHeight) * ratio;
    }

    private textColorOf(color: string) {
        const cached = this.colorCache.get(color);
        if (cached) return cached;
        let rgb = parseColor(color);
        if (!rgb && isPlatformBrowser(this.platformId)) {
            if (this.canvasContext === undefined) {
                try {
                    this.canvasContext = this.document.createElement('canvas').getContext('2d');
                } catch {
                    this.canvasContext = null;
                }
            }
            if (this.canvasContext) {
                this.canvasContext.fillStyle = '#000000';
                this.canvasContext.fillStyle = color;
                rgb = parseColor(String(this.canvasContext.fillStyle));
            }
        }
        const text = rgb ? textColorFor(rgb) : LIGHT_TEXT;
        this.colorCache.set(color, text);
        return text;
    }

    private bindMediaQuery(breakpoint: string, onCleanup: (cleanup: () => void) => void) {
        const window = this.document.defaultView;
        if (!window?.matchMedia) return;
        let query: MediaQueryList;
        try {
            query = window.matchMedia(`(max-width: ${breakpoint})`);
        } catch {
            return;
        }
        const apply = (narrow: boolean) => {
            const narrowView = this.narrowView();
            if (!narrowView) return;
            const view = this.view();
            if (narrow && (view === 'month' || view === 'week') && view !== narrowView) {
                this.viewBeforeNarrow = view;
                this.view.set(narrowView);
            } else if (!narrow && this.viewBeforeNarrow && this.view() === narrowView) {
                this.view.set(this.viewBeforeNarrow);
                this.viewBeforeNarrow = null;
            }
        };
        apply(query.matches);
        const listener = (event: MediaQueryListEvent) => apply(event.matches);
        query.addEventListener?.('change', listener);
        onCleanup(() => query.removeEventListener?.('change', listener));
    }

    private announce(message: string) {
        this.announcement.set(message);
    }
}

@NgModule({
    imports: [Scheduler, SharedModule],
    exports: [Scheduler, SharedModule]
})
export class SchedulerModule {}
