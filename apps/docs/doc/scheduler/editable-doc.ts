import { Component, signal } from '@angular/core';
import { SchedulerEvent, SchedulerEventChangeEvent, SchedulerModule, SchedulerRangeSelectEvent } from '@exhaustive-ui/core/scheduler';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'editable-doc',
    standalone: true,
    imports: [SchedulerModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                With <i>editable</i>, events are moved by drag and drop, between days and slots, and resized from their bottom edge in the week and day views. The pointer snaps to the slots and the time grid scrolls when the pointer nears its edges.
                On touch screens, a long press picks the event up, so that the page still scrolls. An event can opt out with its own <i>editable</i> property. Escape cancels a drag.
            </p>
            <p>
                The component never changes the events: <i>onEventChange</i> gives the event, its new <i>start</i> and <i>end</i>, and the old ones, and the application updates its array, after asking the server for example. With <i>selectable</i>,
                dragging across empty days or slots emits <i>onRangeSelect</i>, which the demo below uses to create an event.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-scheduler [events]="events()" view="week" editable selectable [dayStartHour]="7" [dayEndHour]="20" (onEventChange)="onEventChange($event)" (onRangeSelect)="onRangeSelect($event)" />
        </div>
        <app-code></app-code>
    `
})
export class EditableDoc {
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
