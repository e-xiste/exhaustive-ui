import { Component } from '@angular/core';
import { SchedulerEvent, SchedulerModule } from '@exhaustive-ui/core/scheduler';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [SchedulerModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Scheduler displays the <i>events</i> of a month by default. An event has an <i>id</i>, a <i>title</i>, a <i>start</i> date and an optional <i>end</i>, exclusive, which defaults to one hour later. Set <i>allDay</i> for events that last
                whole days, and <i>color</i> to give an event its own background: the text turns dark or light by itself to stay readable. A cell shows up to <i>maxEventsPerDay</i> events, 3 by default, and a "+N more" button opens the full list of
                the day. The dates are plain JavaScript dates, without any calendar library.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-scheduler [events]="events" />
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
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
