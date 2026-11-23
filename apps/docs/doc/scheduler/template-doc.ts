import { Component } from '@angular/core';
import { SchedulerEvent, SchedulerModule } from '@exhaustive-ui/core/scheduler';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'template-doc',
    standalone: true,
    imports: [SchedulerModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                The <i>event</i> template replaces the content of an event and receives the event, the <i>view</i>, the formatted <i>timeText</i> and whether it is displayed as an all-day chip. It is rendered inside the button of the event, so it
                must not contain interactive elements. The <i>header</i> template replaces the toolbar and receives the <i>title</i>, the <i>view</i>, the range and the <i>today</i>, <i>prev</i>, <i>next</i> and <i>changeView</i> functions.
            </p>
        </app-docsectiontext>
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
        <app-code></app-code>
    `
})
export class TemplateDoc {
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
