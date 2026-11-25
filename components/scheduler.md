# Angular Scheduler Component

Scheduler is a free event calendar with month, week, day and agenda views. Events are moved and resized by drag and drop or with the keyboard, and the visible range can be loaded lazily. It has no calendar library dependency.

## Accessibility

Screen Reader The month view is an ARIA grid labelled by the title, with a columnheader per weekday and a gridcell per day. A cell is named by its full date and its number of events, the current date has aria-current="date" and the focused or selected days aria-selected . The agenda is a group labelled by the title, so several schedulers on a page do not add landmarks. In the week and day views, each day column is a group labelled by its column header and each slot a button named by its date and hours, such as "Thursday, 3 December 2026, 10:00 – 10:30". Events are buttons named by their title and time, "Review, Thu 3 Dec 10:00 – 11:00", and editable events are described by how to move them with the keyboard. The "+N more" button names the number of hidden events and their day, and opens a dialog that lists them all. A polite live region announces the new range after a navigation, "December 2026" or "Week of 29 Nov 2026", and every moved or resized event. Set ariaLabel to make the component a labelled region.

## Basic

Scheduler displays the events of a month by default. An event has an id , a title , a start date and an optional end , exclusive, which defaults to one hour later. Set allDay for events that last whole days, and color to give an event its own background: the text turns dark or light by itself to stay readable. A cell shows up to maxEventsPerDay events, 3 by default, and a "+N more" button opens the full list of the day. The dates are plain JavaScript dates, without any calendar library.

```typescript
import { Component } from '@angular/core';
import { SchedulerEvent, SchedulerModule } from '@exhaustive-ui/core/scheduler';

@Component({
    template: `
        <div class="card">
            <p-scheduler [events]="events" />
        </div>
    `,
    standalone: true,
    imports: [SchedulerModule]
})
export class SchedulerBasicDemo {
    events: SchedulerEvent[] = [];

    constructor() {
        const today = new Date();
        const day = (offset: number, hour = 0, minute = 0) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset, hour, minute);
        this.events = [
            { id: 1, title: 'Team standup', start: day(0, 9), end: day(0, 9, 15) },
            { id: 2, title: 'Design review', start: day(0, 11), end: day(0, 12), color: '#6366f1' },
            { id: 3, title: 'Lunch with Ana', start: day(0, 12, 30), end: day(0, 13, 30), color: '#fbbf24' },
            { id: 4, title: 'Release 22.8', start: day(0, 16), end: day(0, 17) },
            { id: 5, title: 'Conference', start: day(2), end: day(5), allDay: true, color: '#0f766e' },
            { id: 6, title: 'Dentist', start: day(-3, 8, 30), end: day(-3, 9, 15), color: '#e11d48' },
            { id: 7, title: 'Sprint planning', start: day(7, 10), end: day(7, 12) },
            { id: 8, title: 'Birthday', start: day(9), allDay: true, color: '#f472b6' }
        ];
    }
}
```

## Drag and Resize

With editable , events are moved by drag and drop, between days and slots, and resized from their bottom edge in the week and day views. The pointer snaps to the slots and the time grid scrolls when the pointer nears its edges. On touch screens, a long press picks the event up, so that the page still scrolls. An event can opt out with its own editable property. Escape cancels a drag. The component never changes the events: onEventChange gives the event, its new start and end , and the old ones, and the application updates its array, after asking the server for example. With selectable , dragging across empty days or slots emits onRangeSelect , which the demo below uses to create an event.

```typescript
import { Component, signal } from '@angular/core';
import { SchedulerEvent, SchedulerEventChangeEvent, SchedulerModule, SchedulerRangeSelectEvent } from '@exhaustive-ui/core/scheduler';

@Component({
    template: `
        <div class="card">
            <p-scheduler [events]="events()" view="week" editable selectable [dayStartHour]="7" [dayEndHour]="20" (onEventChange)="onEventChange($event)" (onRangeSelect)="onRangeSelect($event)" />
        </div>
    `,
    standalone: true,
    imports: [SchedulerModule]
})
export class SchedulerEditableDemo {
    events = signal<SchedulerEvent[]>([]);

    private nextId = 100;

    constructor() {
        const today = new Date();
        const day = (offset: number, hour = 0, minute = 0) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset, hour, minute);
        this.events.set([
            { id: 1, title: 'Team standup', start: day(0, 9), end: day(0, 9, 30) },
            { id: 2, title: 'Design review', start: day(0, 10), end: day(0, 11, 30), color: '#6366f1' },
            { id: 3, title: 'Focus time', start: day(1, 13), end: day(1, 16), color: '#0f766e' },
            { id: 4, title: 'Board meeting', start: day(-1, 14), end: day(-1, 15), editable: false, color: '#475569' },
            { id: 5, title: 'Offsite', start: day(2), allDay: true, color: '#f97316' }
        ]);
    }

    onEventChange({ event, start, end }: SchedulerEventChangeEvent) {
        this.events.update((events) => events.map((e) => (e.id === event.id ? { ...e, start, end } : e)));
    }

    onRangeSelect({ start, end, allDay }: SchedulerRangeSelectEvent) {
        this.events.update((events) => [...events, { id: this.nextId++, title: 'New event', start, end, allDay }]);
    }
}
```

## Lazy Loading

onViewChange is emitted once at start, then each time the view or the visible range changes, with the view , the first visible day as start and the exclusive end of the range. Use it to load only the events of the range from the server. The demo below simulates a request of 400 milliseconds.

```typescript
import { Component, signal } from '@angular/core';
import { SchedulerEvent, SchedulerModule, SchedulerViewChangeEvent } from '@exhaustive-ui/core/scheduler';

@Component({
    template: `
        <div class="card">
            <p class="mt-0 mb-4 text-sm text-muted-color" aria-live="polite">{{ loading() ? 'Loading…' : status() }}</p>
            <p-scheduler [events]="events()" (onViewChange)="load($event)" />
        </div>
    `,
    standalone: true,
    imports: [SchedulerModule]
})
export class SchedulerLazyDemo {
    events = signal<SchedulerEvent[]>([]);

    loading = signal(false);

    status = signal('');

    private request = 0;

    load({ start, end }: SchedulerViewChangeEvent) {
        const request = ++this.request;
        this.loading.set(true);
        setTimeout(() => {
            if (request !== this.request) return;
            this.events.set(this.fakeServer(start, end));
            this.loading.set(false);
            this.status.set(`${this.events().length} events loaded from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`);
        }, 400);
    }

    private fakeServer(start: Date, end: Date): SchedulerEvent[] {
        const events: SchedulerEvent[] = [];
        const titles = ['Standup', 'Review', 'Planning', 'Support', 'Demo'];
        for (let date = new Date(start); date < end; date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)) {
            const seed = date.getDate() + date.getMonth() * 31;
            if (date.getDay() === 0 || date.getDay() === 6 || seed % 3 === 0) continue;
            const hour = 9 + (seed % 7);
            events.push({ id: `${date.toDateString()}`, title: titles[seed % titles.length], start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour), end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour + 1) });
        }
        return events;
    }
}
```

## Locale

Dates and times are formatted with Intl.DateTimeFormat in the locale , which defaults to the LOCALE_ID of the application; hour12 forces a 12 or 24-hour clock. firstDayOfWeek , from 0 for Sunday to 6 for Saturday, defaults to the firstDayOfWeek of the translation configuration, and the Today button to its today text. Every other text, the view names and the screen reader messages included, can be replaced through labels . Like any JavaScript date, the dates are read and displayed in the time zone of the browser: convert the dates of another time zone before passing them. The time grid follows the clock, so on the days of a daylight saving time change the events stay on their hour lines, and a day is always one calendar day when navigating or moving an event. The translation configuration sets the first day of the week and the Today text for every Scheduler, DatePicker included.

```typescript
import { Component } from '@angular/core';
import { SchedulerEvent, SchedulerLabels, SchedulerModule } from '@exhaustive-ui/core/scheduler';

@Component({
    template: `
        <div class="card">
            <p-scheduler [events]="events" locale="fr-FR" [firstDayOfWeek]="1" [labels]="labels" />
        </div>
    `,
    standalone: true,
    imports: [SchedulerModule]
})
export class SchedulerLocaleDemo {
    labels: Partial<SchedulerLabels> = {
        today: "Aujourd'hui",
        previous: 'Précédent',
        next: 'Suivant',
        views: 'Vue',
        month: 'Mois',
        week: 'Semaine',
        day: 'Jour',
        agenda: 'Agenda',
        allDay: 'Toute la journée',
        more: '+{0} autres',
        moreAriaLabel: '{0} autres événements le {1}',
        eventCount: '{0} événements',
        noEvents: 'Aucun événement sur cette période',
        weekOf: 'Semaine du {0}',
        moved: '{0} déplacé au {1}',
        editableHint: 'Alt et les flèches déplacent l’événement, Alt Maj et haut ou bas le redimensionnent'
    };

    events: SchedulerEvent[] = [];

    constructor() {
        const today = new Date();
        const day = (offset: number, hour = 0, minute = 0) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset, hour, minute);
        this.events = [
            { id: 1, title: 'Réunion d’équipe', start: day(0, 9), end: day(0, 10) },
            { id: 2, title: 'Déjeuner', start: day(1, 12, 30), end: day(1, 14), color: '#fbbf24' },
            { id: 3, title: 'Congés', start: day(4), end: day(8), allDay: true, color: '#0f766e' }
        ];
    }
}
```

## Template

The event template replaces the content of an event and receives the event, the view , the formatted timeText and whether it is displayed as an all-day chip. It is rendered inside the button of the event, so it must not contain interactive elements. The header template replaces the toolbar and receives the title , the view , the range and the today , prev , next and changeView functions.

```typescript
import { Component } from '@angular/core';
import { SchedulerEvent, SchedulerModule } from '@exhaustive-ui/core/scheduler';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <div class="card">
            <p-scheduler [events]="events" view="week" [dayStartHour]="8" [dayEndHour]="19" [narrowView]="null">
                <ng-template #header let-title let-view="view" let-prev="prev" let-next="next" let-today="today" let-changeView="changeView">
                    <div class="flex flex-wrap items-center gap-2 p-3">
                        <p-button icon="pi pi-chevron-left" severity="secondary" text rounded ariaLabel="Previous week" (onClick)="prev()" />
                        <p-button icon="pi pi-chevron-right" severity="secondary" text rounded ariaLabel="Next week" (onClick)="next()" />
                        <span class="font-semibold text-lg flex-1">{{ title }}</span>
                        <p-button label="Today" size="small" outlined (onClick)="today()" />
                        <p-button [label]="view === 'week' ? 'Day' : 'Week'" size="small" severity="secondary" (onClick)="changeView(view === 'week' ? 'day' : 'week')" />
                    </div>
                </ng-template>
                <ng-template #event let-event let-time="timeText" let-allDay="allDay">
                    <span class="flex flex-col gap-1 overflow-hidden">
                        <span class="font-semibold truncate">{{ event.data?.icon }} {{ event.title }}</span>
                        @if (!allDay) {
                            <span class="truncate">{{ time }}</span>
                        }
                        @if (event.data?.room) {
                            <span class="truncate italic">{{ event.data.room }}</span>
                        }
                    </span>
                </ng-template>
            </p-scheduler>
        </div>
    `,
    standalone: true,
    imports: [SchedulerModule, ButtonModule]
})
export class SchedulerTemplateDemo {
    events: SchedulerEvent[] = [];

    constructor() {
        const today = new Date();
        const day = (offset: number, hour = 0, minute = 0) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset, hour, minute);
        this.events = [
            { id: 1, title: 'Design review', start: day(0, 10), end: day(0, 12), color: '#6366f1', data: { icon: '🎨', room: 'Room Ada' } },
            { id: 2, title: 'Lunch', start: day(0, 12, 30), end: day(0, 13, 30), color: '#fbbf24', data: { icon: '🥗' } },
            { id: 3, title: 'Interview', start: day(1, 14), end: day(1, 15, 30), data: { icon: '🤝', room: 'Room Grace' } },
            { id: 4, title: 'Hackathon', start: day(-1), end: day(1), allDay: true, color: '#0f766e', data: { icon: '🚀' } }
        ];
    }
}
```

## Week and Day

The view is month , week , day or agenda , and it is two-way bindable like the visible date . The view switcher of the header offers the views input, in its order. The week and day views are time grids: timed events are placed by their hours and the overlapping ones sit side by side, while all-day events and events of 24 hours or more go to the all-day row. slotDuration sets the length of a slot in minutes, 30 by default, dayStartHour and dayEndHour the visible hours, the events outside them being listed by a button on the top or bottom edge of the day, and a red line marks the current time unless nowIndicator is false. showWeekends hides Saturdays and Sundays. The agenda lists the events of the next agendaDays days, grouped by day. Under the breakpoint width, 640px by default, the month and week views are replaced by the narrowView , the agenda by default; set it to null to keep the view on small screens.

```typescript
import { Component } from '@angular/core';
import { SchedulerEvent, SchedulerModule, SchedulerView } from '@exhaustive-ui/core/scheduler';

@Component({
    template: `
        <div class="card">
            <p-scheduler [events]="events" [(view)]="view" [slotDuration]="30" [dayStartHour]="7" [dayEndHour]="21" [scrollToHour]="8" />
        </div>
    `,
    standalone: true,
    imports: [SchedulerModule]
})
export class SchedulerViewsDemo {
    view: SchedulerView = 'week';

    events: SchedulerEvent[] = [];

    constructor() {
        const today = new Date();
        const day = (offset: number, hour = 0, minute = 0) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset, hour, minute);
        this.events = [
            { id: 1, title: 'Team standup', start: day(0, 9), end: day(0, 9, 30) },
            { id: 2, title: 'Design review', start: day(0, 10), end: day(0, 11, 30), color: '#6366f1' },
            { id: 3, title: 'Customer call', start: day(0, 11), end: day(0, 12) },
            { id: 4, title: 'Pairing', start: day(0, 11, 30), end: day(0, 13), color: '#0f766e' },
            { id: 5, title: 'Gym', start: day(1, 7, 30), end: day(1, 8, 30), color: '#f97316' },
            { id: 6, title: 'Workshop', start: day(-1, 14), end: day(-1, 17), color: '#a855f7' },
            { id: 7, title: 'Public holiday', start: day(2), allDay: true, color: '#e11d48' },
            { id: 8, title: 'Interview', start: day(2, 15), end: day(2, 16) },
            { id: 9, title: 'Night flight', start: day(1, 22), end: day(1, 23, 30), color: '#0284c7' }
        ];
    }
}
```

## Scheduler

Scheduler is an event calendar with month, week, day and agenda views. Events are moved and resized by drag and drop or with the keyboard, and the component emits the changes for the application to apply.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | SchedulerPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| events | SchedulerEvent[] | [] | Events to display. The component never changes them: apply the changes emitted by onEventChange to the array. |
| view | SchedulerView | 'month' | Current view, two-way bindable. |
| date | Date | new Date() | Date of the visible range, two-way bindable. Defaults to the current date. |
| views | SchedulerView[] | ['month', 'week', 'day', 'agenda'] | Views offered by the view switcher, in this order. The switcher is hidden when there is only one. |
| locale | string | - | BCP 47 locale of the dates and times, such as  `fr-FR` . Defaults to the LOCALE_ID of the application. |
| firstDayOfWeek | number | - | First day of the week, 0 for Sunday to 6 for Saturday. Defaults to firstDayOfWeek of the translation configuration. |
| hour12 | boolean | - | Whether times use a 12-hour clock. Defaults to the convention of the locale. |
| slotDuration | number | 30 | Duration of a time slot of the week and day views, in minutes. Drag and drop snaps to it. |
| dayStartHour | number | 0 | First hour displayed in the week and day views. |
| dayEndHour | number | 24 | Hour at which the week and day views end, exclusive. |
| scrollToHour | number | 8 | Hour scrolled to when the week or day view is shown. |
| scrollHeight | string | '36rem' | Maximum height of the time grid, which scrolls beyond it. |
| showWeekends | boolean | true | Whether Saturdays and Sundays are displayed in the month and week views. |
| nowIndicator | boolean | true | Whether a line marks the current time in the week and day views. |
| editable | boolean | false | Whether events can be moved and resized, with the pointer or the keyboard. An event can override it with its own editable property. |
| selectable | boolean | false | Whether a range of days or slots can be selected by dragging across them, or with Shift and the arrow keys, to emit onRangeSelect. |
| maxEventsPerDay | number | 3 | Maximum number of events in a cell of the month view. The others are behind a "+N more" button that lists them all in a popover. |
| agendaDays | number | 30 | Number of days listed by the agenda view, from the date. |
| narrowView | SchedulerView | 'agenda' | View shown instead of the month and week views on narrow screens, null to keep the view. |
| breakpoint | string | '640px' | Width under which the screen counts as narrow, a CSS length. |
| showHeader | boolean | true | Whether the header toolbar is displayed. |
| labels | Partial<SchedulerLabels> | - | Texts of the component, merged with the defaults. The today text defaults to the today key of the translation configuration. |
| ariaLabel | string | - | Accessible label of the component, which then becomes a region landmark. |

### Emits

| Name | Parameters | Description |
|------|------------|-------------|
| onEventClick | event: SchedulerEventClickEvent | Callback to invoke when an event is clicked or activated with Enter. |
| onDateClick | event: SchedulerDateClickEvent | Callback to invoke when a day is clicked, in the month view or the all-day row. |
| onSlotClick | event: SchedulerDateClickEvent | Callback to invoke when a time slot of the week or day view is clicked. |
| onRangeSelect | event: SchedulerDateClickEvent | Callback to invoke when a range of days or slots is selected, when selectable. |
| onEventChange | event: SchedulerEventChangeEvent | Callback to invoke after an event is moved or resized. Update the events with the new dates. |
| onViewChange | event: SchedulerViewChangeEvent | Callback to invoke when the view or the visible range changes, and once at start, to load the events of the range. |

### Templates

| Name | Type | Description |
|------|------|-------------|
| event | TemplateRef<SchedulerEventTemplateContext> | Custom content of an event. |
| header | TemplateRef<SchedulerHeaderTemplateContext> | Custom header, replacing the toolbar. |

### Methods

| Name | Parameters | Return Type | Description |
|------|------------|-------------|-------------|
| today |  | void | Shows the current date. |
| prev |  | void | Shows the previous range: month, week, day or agenda period. |
| next |  | void | Shows the next range: month, week, day or agenda period. |
| changeView | view: SchedulerView | void | Changes the view. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| root | PassThroughOption<HTMLElement, I> | Used to pass attributes to the root's DOM element. |
| header | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the header toolbar's DOM element. |
| navigation | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the navigation group's DOM element. |
| pcTodayButton | ButtonPassThrough | Used to pass attributes to the Today Button component. |
| pcPrevButton | ButtonPassThrough | Used to pass attributes to the previous Button component. |
| pcNextButton | ButtonPassThrough | Used to pass attributes to the next Button component. |
| title | PassThroughOption<HTMLHeadingElement, I> | Used to pass attributes to the title's DOM element. |
| pcViewSwitcher | SelectButtonPassThrough | Used to pass attributes to the view switcher SelectButton component. |
| month | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the month grid's DOM element. |
| weekdays | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the row of weekday names. |
| weekday | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to a weekday name's DOM element. |
| week | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to a week row of the month grid. |
| day | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to a day cell of the month grid. |
| dayNumber | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the day number of a cell. |
| event | PassThroughOption<HTMLButtonElement, I> | Used to pass attributes to an event's DOM element. |
| eventTime | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the time of an event. |
| eventTitle | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the title of an event. |
| resizeHandle | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the resize handle of an event. |
| more | PassThroughOption<HTMLButtonElement, I> | Used to pass attributes to the "+N more" button of a month cell. |
| pcPopover | PopoverPassThrough | Used to pass attributes to the Popover component that lists the events of a day. |
| popoverList | PassThroughOption<HTMLUListElement, I> | Used to pass attributes to the list of events inside the popover. |
| timeGrid | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the week and day time grid's DOM element. |
| columnHeaders | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the row of column headers of the time grid. |
| columnHeader | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to a column header of the time grid. |
| allDay | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the all-day row of the time grid. |
| allDayCell | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to a day cell of the all-day row. |
| body | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the scrollable body of the time grid. |
| timeGutter | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the column of hour labels. |
| timeLabel | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to an hour label. |
| column | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to a day column of the time grid. |
| slot | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to a time slot. |
| nowIndicator | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the current time line. |
| selection | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the highlight of a range being selected. |
| agenda | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the agenda's DOM element. |
| agendaDay | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to a day group of the agenda. |
| agendaDate | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the date heading of an agenda day. |
| agendaList | PassThroughOption<HTMLUListElement, I> | Used to pass attributes to the event list of an agenda day. |
| empty | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the empty message of the agenda. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-scheduler | Class name of the root element |
| p-scheduler-header | Class name of the header toolbar |
| p-scheduler-navigation | Class name of the navigation buttons group |
| p-scheduler-title | Class name of the title |
| p-scheduler-month | Class name of the month grid |
| p-scheduler-weekdays | Class name of the row of weekday names |
| p-scheduler-weekday | Class name of a weekday name |
| p-scheduler-week | Class name of a week row |
| p-scheduler-day | Class name of a day cell |
| p-scheduler-day-number | Class name of the day number |
| p-scheduler-more | Class name of the "+N more" button |
| p-scheduler-outside-more | Class name of the button listing the events outside the hours shown, with p-scheduler-outside-more-before or -after |
| p-scheduler-event | Class name of an event |
| p-scheduler-event-time | Class name of the time of an event |
| p-scheduler-event-title | Class name of the title of an event |
| p-scheduler-resize-handle | Class name of the resize handle of an event |
| p-scheduler-ghost | Class name of the preview of a dragged event |
| p-scheduler-time-grid | Class name of the time grid |
| p-scheduler-column-header | Class name of a column header |
| p-scheduler-all-day | Class name of the all-day row |
| p-scheduler-all-day-cell | Class name of a cell of the all-day row |
| p-scheduler-body | Class name of the scrollable body of the time grid |
| p-scheduler-time-gutter | Class name of the column of hour labels |
| p-scheduler-column | Class name of a day column |
| p-scheduler-slot | Class name of a time slot |
| p-scheduler-now-indicator | Class name of the current time line |
| p-scheduler-selection | Class name of the highlight of a selected range |
| p-scheduler-agenda | Class name of the agenda |
| p-scheduler-agenda-date | Class name of the date of an agenda day |
| p-scheduler-empty | Class name of the empty message |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| scheduler.background | --p-scheduler-background | Background |
| scheduler.border.color | --p-scheduler-border-color | Border color |
| scheduler.border.radius | --p-scheduler-border-radius | Border radius |
| scheduler.color | --p-scheduler-color | Text color |
| scheduler.gap | --p-scheduler-gap | Gap between the header and the view |
| scheduler.transition.duration | --p-scheduler-transition-duration | Transition duration |
| scheduler.header.gap | --p-scheduler-header-gap | Gap between the header items |
| scheduler.header.padding | --p-scheduler-header-padding | Padding |
| scheduler.title.font.size | --p-scheduler-title-font-size | Font size |
| scheduler.title.font.weight | --p-scheduler-title-font-weight | Font weight |
| scheduler.title.color | --p-scheduler-title-color | Text color |
| scheduler.grid.border.color | --p-scheduler-grid-border-color | Color of the grid lines |
| scheduler.grid.slot.border.color | --p-scheduler-grid-slot-border-color | Color of the lines between the slots inside an hour |
| scheduler.weekday.color | --p-scheduler-weekday-color | Text color |
| scheduler.weekday.font.size | --p-scheduler-weekday-font-size | Font size |
| scheduler.weekday.font.weight | --p-scheduler-weekday-font-weight | Font weight |
| scheduler.weekday.padding | --p-scheduler-weekday-padding | Padding |
| scheduler.day.padding | --p-scheduler-day-padding | Padding |
| scheduler.day.gap | --p-scheduler-day-gap | Gap between the events |
| scheduler.day.min.height | --p-scheduler-day-min-height | Minimum height of a cell |
| scheduler.day.outside.color | --p-scheduler-day-outside-color | Text color of the days of other months |
| scheduler.day.outside.background | --p-scheduler-day-outside-background | Background of the days of other months |
| scheduler.day.selected.background | --p-scheduler-day-selected-background | Background of the selected days |
| scheduler.day.focus.ring.width | --p-scheduler-day-focus-ring-width | Focus ring width |
| scheduler.day.focus.ring.style | --p-scheduler-day-focus-ring-style | Focus ring style |
| scheduler.day.focus.ring.color | --p-scheduler-day-focus-ring-color | Focus ring color |
| scheduler.day.focus.ring.offset | --p-scheduler-day-focus-ring-offset | Focus ring offset |
| scheduler.day.focus.ring.shadow | --p-scheduler-day-focus-ring-shadow | Focus ring shadow |
| scheduler.day.number.size | --p-scheduler-day-number-size | Size of the circle around the day number |
| scheduler.day.number.font.size | --p-scheduler-day-number-font-size | Font size |
| scheduler.day.number.font.weight | --p-scheduler-day-number-font-weight | Font weight |
| scheduler.day.number.color | --p-scheduler-day-number-color | Text color |
| scheduler.day.number.border.radius | --p-scheduler-day-number-border-radius | Border radius |
| scheduler.today.number.background | --p-scheduler-today-number-background | Background of the number of the current day |
| scheduler.today.number.color | --p-scheduler-today-number-color | Text color of the number of the current day |
| scheduler.today.font.weight | --p-scheduler-today-font-weight | Font weight of the number of the current day |
| scheduler.event.background | --p-scheduler-event-background | Default background |
| scheduler.event.color | --p-scheduler-event-color | Default text color |
| scheduler.event.border.color | --p-scheduler-event-border-color | Default color of the accent border |
| scheduler.event.border.width | --p-scheduler-event-border-width | Width of the accent border |
| scheduler.event.border.radius | --p-scheduler-event-border-radius | Border radius |
| scheduler.event.padding | --p-scheduler-event-padding | Padding |
| scheduler.event.font.size | --p-scheduler-event-font-size | Font size |
| scheduler.event.font.weight | --p-scheduler-event-font-weight | Font weight of the title |
| scheduler.event.gap | --p-scheduler-event-gap | Gap between the time and the title |
| scheduler.event.hover.shadow | --p-scheduler-event-hover-shadow | Shadow on hover |
| scheduler.event.dragging.opacity | --p-scheduler-event-dragging-opacity | Opacity of an event while its preview is dragged |
| scheduler.event.focus.ring.width | --p-scheduler-event-focus-ring-width | Focus ring width |
| scheduler.event.focus.ring.style | --p-scheduler-event-focus-ring-style | Focus ring style |
| scheduler.event.focus.ring.color | --p-scheduler-event-focus-ring-color | Focus ring color |
| scheduler.event.focus.ring.offset | --p-scheduler-event-focus-ring-offset | Focus ring offset |
| scheduler.event.focus.ring.shadow | --p-scheduler-event-focus-ring-shadow | Focus ring shadow |
| scheduler.more.color | --p-scheduler-more-color | Text color |
| scheduler.more.hover.color | --p-scheduler-more-hover-color | Text color on hover |
| scheduler.more.hover.background | --p-scheduler-more-hover-background | Background on hover |
| scheduler.more.font.size | --p-scheduler-more-font-size | Font size |
| scheduler.more.font.weight | --p-scheduler-more-font-weight | Font weight |
| scheduler.more.padding | --p-scheduler-more-padding | Padding |
| scheduler.more.border.radius | --p-scheduler-more-border-radius | Border radius |
| scheduler.slot.height | --p-scheduler-slot-height | Height of a time slot |
| scheduler.slot.hover.background | --p-scheduler-slot-hover-background | Background of a slot on hover |
| scheduler.time.label.color | --p-scheduler-time-label-color | Text color |
| scheduler.time.label.font.size | --p-scheduler-time-label-font-size | Font size |
| scheduler.time.label.width | --p-scheduler-time-label-width | Width of the column of hour labels |
| scheduler.column.header.padding | --p-scheduler-column-header-padding | Padding |
| scheduler.column.header.color | --p-scheduler-column-header-color | Text color of the weekday |
| scheduler.column.header.font.size | --p-scheduler-column-header-font-size | Font size of the weekday |
| scheduler.column.header.number.font.size | --p-scheduler-column-header-number-font-size | Font size of the day number |
| scheduler.column.header.number.font.weight | --p-scheduler-column-header-number-font-weight | Font weight of the day number |
| scheduler.all.day.min.height | --p-scheduler-all-day-min-height | Minimum height of the all-day row |
| scheduler.all.day.label.color | --p-scheduler-all-day-label-color | Text color of the label |
| scheduler.all.day.label.font.size | --p-scheduler-all-day-label-font-size | Font size of the label |
| scheduler.now.indicator.color | --p-scheduler-now-indicator-color | Color of the current time line |
| scheduler.now.indicator.size | --p-scheduler-now-indicator-size | Thickness of the current time line |
| scheduler.selection.background | --p-scheduler-selection-background | Background of a selected range |
| scheduler.selection.border.color | --p-scheduler-selection-border-color | Border color of a selected range |
| scheduler.agenda.padding | --p-scheduler-agenda-padding | Padding |
| scheduler.agenda.gap | --p-scheduler-agenda-gap | Gap between the days |
| scheduler.agenda.date.color | --p-scheduler-agenda-date-color | Text color of a date |
| scheduler.agenda.date.font.weight | --p-scheduler-agenda-date-font-weight | Font weight of a date |
| scheduler.agenda.date.padding | --p-scheduler-agenda-date-padding | Padding of a date |
| scheduler.agenda.date.border.color | --p-scheduler-agenda-date-border-color | Border color below a date |
| scheduler.agenda.item.padding | --p-scheduler-agenda-item-padding | Padding of an event |
| scheduler.agenda.item.gap | --p-scheduler-agenda-item-gap | Gap inside an event |
| scheduler.agenda.item.border.radius | --p-scheduler-agenda-item-border-radius | Border radius of an event |
| scheduler.agenda.item.hover.background | --p-scheduler-agenda-item-hover-background | Background of an event on hover |
| scheduler.agenda.time.color | --p-scheduler-agenda-time-color | Text color of the time |
| scheduler.agenda.time.width | --p-scheduler-agenda-time-width | Width of the time column |
| scheduler.agenda.dot.size | --p-scheduler-agenda-dot-size | Size of the color dot |
| scheduler.popover.width | --p-scheduler-popover-width | Width of the popover |
| scheduler.popover.gap | --p-scheduler-popover-gap | Gap between the events |
| scheduler.popover.header.font.weight | --p-scheduler-popover-header-font-weight | Font weight of the date |
| scheduler.empty.color | --p-scheduler-empty-color | Text color |
| scheduler.empty.padding | --p-scheduler-empty-padding | Padding |

