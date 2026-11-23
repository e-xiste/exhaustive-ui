import { AppDocPtViewer } from '@/components/doc/app.docptviewer';
import { getPTOptions } from '@/components/doc/app.docptviewer';
import { Component } from '@angular/core';
import { SchedulerEvent, SchedulerModule } from '@exhaustive-ui/core/scheduler';

@Component({
    selector: 'scheduler-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, SchedulerModule],
    template: `
        <app-docptviewer [docs]="docs">
            <p-scheduler class="w-full" [events]="events" [narrowView]="null" />
        </app-docptviewer>
    `
})
export class PTViewer {
    events: SchedulerEvent[] = [];

    docs = [{ data: getPTOptions('Scheduler'), key: 'Scheduler' }];

    constructor() {
        const today = new Date();
        const day = (offset: number, hour = 0) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset, hour);
        this.events = [
            { id: 1, title: 'Design review', start: day(0, 10), end: day(0, 11) },
            { id: 2, title: 'Conference', start: day(2), end: day(4), allDay: true, color: '#0f766e' }
        ];
    }
}
