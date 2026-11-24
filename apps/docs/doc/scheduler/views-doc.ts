import { Component } from '@angular/core';
import { SchedulerEvent, SchedulerModule, SchedulerView } from '@exhaustive-ui/core/scheduler';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'views-doc',
    standalone: true,
    imports: [SchedulerModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                The <i>view</i> is <i>month</i>, <i>week</i>, <i>day</i> or <i>agenda</i>, and it is two-way bindable like the visible <i>date</i>. The view switcher of the header offers the <i>views</i> input, in its order. The week and day views
                are time grids: timed events are placed by their hours and the overlapping ones sit side by side, while all-day events and events of 24 hours or more go to the all-day row. <i>slotDuration</i> sets the length of a slot in minutes, 30
                by default, <i>dayStartHour</i> and <i>dayEndHour</i> the visible hours, the events outside them being listed by a button on the top or bottom edge of the day, and a red line marks the current time unless <i>nowIndicator</i> is false.
                <i>showWeekends</i> hides Saturdays and Sundays. The agenda lists the events of the next <i>agendaDays</i> days, grouped by day.
            </p>
            <p>Under the <i>breakpoint</i> width, 640px by default, the month and week views are replaced by the <i>narrowView</i>, the agenda by default; set it to <i>null</i> to keep the view on small screens.</p>
        </app-docsectiontext>
        <div class="card">
            <p-scheduler [events]="events" [(view)]="view" [slotDuration]="30" [dayStartHour]="7" [dayEndHour]="21" [scrollToHour]="8" />
        </div>
        <app-code></app-code>
    `
})
export class ViewsDoc {
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
