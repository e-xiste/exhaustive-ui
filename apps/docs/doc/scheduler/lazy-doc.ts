import { Component, signal } from '@angular/core';
import { SchedulerEvent, SchedulerModule, SchedulerViewChangeEvent } from '@exhaustive-ui/core/scheduler';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'lazy-doc',
    standalone: true,
    imports: [SchedulerModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                <i>onViewChange</i> is emitted once at start, then each time the view or the visible range changes, with the <i>view</i>, the first visible day as <i>start</i> and the exclusive <i>end</i> of the range. Use it to load only the events
                of the range from the server. The demo below simulates a request of 400 milliseconds.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p class="mt-0 mb-4 text-sm text-muted-color" aria-live="polite">{{ loading() ? 'Loading…' : status() }}</p>
            <p-scheduler [events]="events()" (onViewChange)="load($event)" />
        </div>
        <app-code></app-code>
    `
})
export class LazyDoc {
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
