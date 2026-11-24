import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Exhaustive } from '@exhaustive-ui/core/config';
import type { SchedulerDateClickEvent, SchedulerEvent, SchedulerEventChangeEvent, SchedulerEventClickEvent, SchedulerViewChangeEvent } from '@exhaustive-ui/core/types/scheduler';
import { Scheduler } from './scheduler';
import { addMonths, layoutDay, normalizeEvent, parseColor, textColorFor } from './scheduler-utils';

// Thursday 3 December 2026
const DATE = new Date(2026, 11, 3, 9, 0);

const at = (day: number, hour: number, minute = 0, month = 11) => new Date(2026, month, day, hour, minute);

const flush = () => new Promise((resolve) => setTimeout(resolve, 20));

const key = (event: KeyboardEventInit & { key: string }) => new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...event });

const pointer = (type: string, x: number, y: number, extra: PointerEventInit = {}) => new PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 1, pointerType: 'mouse', button: 0, isPrimary: true, ...extra });

@Component({
    standalone: true,
    imports: [Scheduler],
    template: `
        <p-scheduler [events]="events()" [date]="date" locale="en-GB" [narrowView]="null">
            <ng-template #event let-event let-time="timeText" let-view="view">
                <span class="custom-event">{{ event.title }} / {{ view }} / {{ time }}</span>
            </ng-template>
        </p-scheduler>
    `
})
class EventTemplateHost {
    date = DATE;
    events = signal<SchedulerEvent[]>([{ id: 1, title: 'Review', start: at(3, 10), end: at(3, 11) }]);
}

@Component({
    standalone: true,
    imports: [Scheduler],
    template: `
        <p-scheduler [date]="date" locale="en-GB" [narrowView]="null">
            <ng-template #header let-title let-next="next" let-view="view">
                <div class="custom-header">
                    <span class="custom-title">{{ title }}</span>
                    <span class="custom-view">{{ view }}</span>
                    <button class="custom-next" (click)="next()">next</button>
                </div>
            </ng-template>
        </p-scheduler>
    `
})
class HeaderTemplateHost {
    date = DATE;
}

describe('Scheduler', () => {
    let fixture: ComponentFixture<Scheduler>;
    let component: Scheduler;
    let host: HTMLElement;
    let style: HTMLStyleElement;

    beforeEach(async () => {
        style = document.createElement('style');
        style.textContent = ':root { --p-scheduler-slot-height: 20px; --p-scheduler-time-label-width: 60px; } p-scheduler { display: block; width: 900px; }';
        document.head.appendChild(style);

        await TestBed.configureTestingModule({
            imports: [Scheduler, EventTemplateHost, HeaderTemplateHost],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(Scheduler);
        component = fixture.componentInstance;
        host = fixture.nativeElement;
        document.body.appendChild(host);
        fixture.componentRef.setInput('date', DATE);
        fixture.componentRef.setInput('locale', 'en-GB');
        fixture.componentRef.setInput('narrowView', null);
        fixture.detectChanges();
    });

    afterEach(() => {
        style.remove();
        host.remove();
    });

    const render = async () => {
        await fixture.whenStable();
        fixture.detectChanges();
        await flush();
        fixture.detectChanges();
    };

    const setEvents = async (events: SchedulerEvent[]) => {
        fixture.componentRef.setInput('events', events);
        await render();
    };

    const setView = async (view: string) => {
        fixture.componentRef.setInput('view', view);
        await render();
    };

    const cell = (day: number, month = 12) => host.querySelector(`[data-p-day="2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}"]`) as HTMLElement;

    const eventButton = (id: string | number) => host.querySelector(`[data-p-event="${id}"]`) as HTMLElement;

    const nameOf = (element: Element | null) => element?.querySelector('.p-hidden-accessible')?.textContent?.trim();

    describe('Month view', () => {
        it('should render an ARIA grid with the weekdays and the weeks of the month', async () => {
            await render();
            const grid = host.querySelector('[role="grid"]') as HTMLElement;
            expect(grid).toBeTruthy();
            expect(host.classList).toContain('p-scheduler');
            expect(grid.querySelectorAll('[role="columnheader"]').length).toBe(7);
            // December 2026 starts on Tuesday: Sunday 29 November to Saturday 2 January
            expect(grid.querySelectorAll('[role="row"]').length).toBe(6);
            expect(grid.querySelectorAll('[role="gridcell"]').length).toBe(35);
            expect(grid.getAttribute('aria-labelledby')).toBe(component.titleId);
            expect(host.querySelector('.p-scheduler-title')?.textContent?.trim()).toBe('December 2026');
        });

        it('should mark today and the days of other months', async () => {
            fixture.componentRef.setInput('date', new Date());
            await render();
            const today = host.querySelector('[aria-current="date"]') as HTMLElement;
            expect(today).toBeTruthy();
            expect(today.getAttribute('tabindex')).toBe('0');
            expect(today.getAttribute('aria-selected')).toBe('true');
            fixture.componentRef.setInput('date', DATE);
            await render();
            expect(cell(30, 11).classList).toContain('p-scheduler-day-outside');
            expect(cell(3).classList).not.toContain('p-scheduler-day-outside');
        });

        it('should start the week on firstDayOfWeek', async () => {
            fixture.componentRef.setInput('firstDayOfWeek', 1);
            await render();
            const headers = host.querySelectorAll('[role="columnheader"]');
            expect(headers[0].getAttribute('aria-label')).toBe('Monday');
            expect((host.querySelector('[role="gridcell"]') as HTMLElement).getAttribute('data-p-day')).toBe('2026-11-30');
        });

        it('should take firstDayOfWeek from the translation configuration', async () => {
            TestBed.inject(Exhaustive).setTranslation({ firstDayOfWeek: 1 });
            await render();
            expect(host.querySelector('[role="columnheader"]')?.getAttribute('aria-label')).toBe('Monday');
            TestBed.inject(Exhaustive).setTranslation({ firstDayOfWeek: 0 });
        });

        it('should hide the weekends', async () => {
            fixture.componentRef.setInput('showWeekends', false);
            await render();
            expect(host.querySelectorAll('[role="columnheader"]').length).toBe(5);
            expect(cell(5)).toBeNull();
            expect(cell(4)).toBeTruthy();
        });

        it('should list the events of a day and hide the overflow behind a more button', async () => {
            fixture.componentRef.setInput('maxEventsPerDay', 2);
            await setEvents([
                { id: 'a', title: 'Standup', start: at(3, 9), end: at(3, 9, 15) },
                { id: 'b', title: 'Lunch', start: at(3, 12), end: at(3, 13) },
                { id: 'c', title: 'Review', start: at(3, 15), end: at(3, 16) },
                { id: 'd', title: 'Holiday', start: at(3, 0), allDay: true }
            ]);
            const day = cell(3);
            const events = day.querySelectorAll('.p-scheduler-event');
            expect(events.length).toBe(2);
            // all-day events come first
            expect(events[0].textContent).toContain('Holiday');
            expect(events[1].textContent).toContain('09:00');
            const more = day.querySelector('.p-scheduler-more') as HTMLButtonElement;
            expect(more.textContent?.trim()).toBe('+2 more');
            expect(more.getAttribute('aria-label')).toBe('2 more events on Thursday, 3 December 2026');
            expect(nameOf(day)).toBe('Thursday, 3 December 2026, 4 events');

            more.click();
            await render();
            const popover = document.querySelector('.p-popover') as HTMLElement;
            expect(popover).toBeTruthy();
            expect(popover.querySelectorAll('.p-scheduler-event').length).toBe(4);
            expect(more.getAttribute('aria-expanded')).toBe('true');
            component.morePopover()?.hide();
            await render();
        });

        it('should show multi-day events in every day they cover', async () => {
            await setEvents([{ id: 'trip', title: 'Trip', start: at(7, 0), end: at(9, 0), allDay: true }]);
            expect(cell(7).querySelector('.p-scheduler-event')).toBeTruthy();
            expect(cell(8).querySelector('.p-scheduler-event')?.classList).toContain('p-scheduler-event-continues-before');
            // the end of an all-day event is exclusive
            expect(cell(9).querySelector('.p-scheduler-event')).toBeNull();
        });

        it('should emit onDateClick when a day is clicked', async () => {
            const spy = vi.fn();
            component.onDateClick.subscribe(spy);
            cell(10).click();
            const event: SchedulerDateClickEvent = spy.mock.calls[0][0];
            expect(event.start).toEqual(new Date(2026, 11, 10));
            expect(event.end).toEqual(new Date(2026, 11, 11));
            expect(event.allDay).toBe(true);
        });
    });

    describe('Navigation', () => {
        it('should emit onViewChange with the visible range at start and on navigation', async () => {
            const spy = vi.fn();
            const fresh = TestBed.createComponent(Scheduler);
            fresh.componentInstance.onViewChange.subscribe(spy);
            fresh.componentRef.setInput('date', DATE);
            fresh.componentRef.setInput('narrowView', null);
            fresh.detectChanges();
            await fresh.whenStable();
            const first: SchedulerViewChangeEvent = spy.mock.calls[0][0];
            expect(first.view).toBe('month');
            expect(first.start).toEqual(new Date(2026, 10, 29));
            expect(first.end).toEqual(new Date(2027, 0, 3));

            fresh.componentInstance.next();
            fresh.detectChanges();
            await fresh.whenStable();
            const second: SchedulerViewChangeEvent = spy.mock.calls[spy.mock.calls.length - 1][0];
            // January 2027 starts on Friday
            expect(second.start).toEqual(new Date(2026, 11, 27));
            fresh.destroy();
        });

        it('should move by month, week, day and agenda period and announce the new range', async () => {
            component.next();
            await render();
            expect(component.date().getMonth()).toBe(0);
            expect(host.querySelector('[aria-live]')?.textContent).toContain('January 2027');
            component.prev();
            await setView('week');
            component.next();
            await render();
            expect(component.date()).toEqual(new Date(2026, 11, 10, 9));
            expect(host.querySelector('[aria-live]')?.textContent).toContain('Week of 6 Dec 2026');
            await setView('day');
            component.prev();
            await render();
            expect(component.date().getDate()).toBe(9);
            await setView('agenda');
            fixture.componentRef.setInput('agendaDays', 7);
            component.next();
            await render();
            expect(component.date().getDate()).toBe(16);
        });

        it('should go back to the current date', async () => {
            component.today();
            await render();
            const now = new Date();
            expect(component.date().toDateString()).toBe(now.toDateString());
        });

        it('should switch views with the view switcher', async () => {
            const buttons = host.querySelectorAll('.p-togglebutton');
            expect(buttons.length).toBe(4);
            (buttons[1] as HTMLElement).click();
            await render();
            expect(component.view()).toBe('week');
            expect(host.querySelector('.p-scheduler-time-grid')).toBeTruthy();
        });

        it('should only offer the given views', async () => {
            fixture.componentRef.setInput('views', ['month']);
            await render();
            expect(host.querySelector('.p-selectbutton')).toBeNull();
        });

        it('should use the labels and the today translation', async () => {
            TestBed.inject(Exhaustive).setTranslation({ today: "Aujourd'hui" });
            await render();
            expect(host.querySelector('.p-scheduler-navigation')?.textContent).toContain("Aujourd'hui");
            fixture.componentRef.setInput('labels', { today: 'Now', month: 'Mois' });
            await render();
            expect(host.querySelector('.p-scheduler-navigation')?.textContent).toContain('Now');
            expect(host.querySelector('.p-selectbutton')?.textContent).toContain('Mois');
            TestBed.inject(Exhaustive).setTranslation({ today: 'Today' });
        });

        it('should use the clock of the locale or hour12', async () => {
            await setEvents([{ id: 1, title: 'Review', start: at(3, 9), end: at(3, 14) }]);
            expect(nameOf(eventButton(1))).toBe('Review, Thu 3 Dec 09:00 – 14:00');
            fixture.componentRef.setInput('locale', 'en-US');
            await render();
            expect(nameOf(eventButton(1))).toBe('Review, Thu, Dec 3 9:00 AM – 2:00 PM');
            fixture.componentRef.setInput('hour12', false);
            await render();
            expect(nameOf(eventButton(1))).toBe('Review, Thu, Dec 3 09:00 – 14:00');
        });

        it('should format the title in the locale', async () => {
            fixture.componentRef.setInput('locale', 'fr-FR');
            await render();
            expect(host.querySelector('.p-scheduler-title')?.textContent?.trim()).toBe('décembre 2026');
            await setView('week');
            expect(host.querySelector('.p-scheduler-title')?.textContent?.trim()).toBe('29 nov. – 5 déc. 2026');
        });
    });

    describe('Week and day views', () => {
        beforeEach(async () => {
            await setView('week');
        });

        it('should render labelled day columns and the slots', async () => {
            const columns = host.querySelectorAll('[data-p-column]');
            expect(columns.length).toBe(7);
            const first = columns[0] as HTMLElement;
            const header = document.getElementById(first.getAttribute('aria-labelledby')!);
            expect(nameOf(header)).toBe('Sunday, 29 November 2026');
            expect(first.querySelectorAll('[data-p-slot]').length).toBe(48);
            expect(first.querySelector('[data-p-slot]')?.getAttribute('aria-label')).toBe('Sunday, 29 November 2026, 00:00 – 00:30');
            expect(host.querySelector('.p-scheduler-all-day')).toBeTruthy();
        });

        it('should follow slotDuration, dayStartHour and dayEndHour', async () => {
            fixture.componentRef.setInput('slotDuration', 60);
            fixture.componentRef.setInput('dayStartHour', 8);
            fixture.componentRef.setInput('dayEndHour', 18);
            await render();
            const slots = host.querySelectorAll('[data-p-column] [data-p-slot]');
            expect(slots.length).toBe(70);
            expect(slots[0].getAttribute('aria-label')).toContain('08:00 – 09:00');
        });

        it('should display a single day in the day view', async () => {
            await setView('day');
            expect(host.querySelectorAll('[data-p-column]').length).toBe(1);
            expect(host.querySelector('.p-scheduler-title')?.textContent?.trim()).toBe('Thursday, 3 December 2026');
        });

        it('should lay out overlapping events side by side', async () => {
            await setEvents([
                { id: 1, title: 'A', start: at(3, 10), end: at(3, 12) },
                { id: 2, title: 'B', start: at(3, 11), end: at(3, 13) },
                { id: 3, title: 'C', start: at(3, 14), end: at(3, 15) }
            ]);
            const a = eventButton(1);
            const b = eventButton(2);
            const c = eventButton(3);
            expect(a.style.width).toBe('50%');
            expect(b.style.width).toBe('50%');
            expect(b.style.insetInlineStart).toBe('50%');
            expect(c.style.width).toBe('100%');
            expect(parseFloat(a.style.top)).toBeCloseTo((10 / 24) * 100, 3);
            expect(parseFloat(a.style.height)).toBeCloseTo((2 / 24) * 100, 3);
        });

        it('should keep the title and the time of an event of one slot on one line', async () => {
            await setEvents([
                { id: 1, title: 'Standup', start: at(3, 9), end: at(3, 9, 15) },
                { id: 2, title: 'Sync', start: at(3, 10), end: at(3, 10, 30) },
                { id: 3, title: 'Review', start: at(3, 11), end: at(3, 12) }
            ]);
            expect(eventButton(1).classList).toContain('p-scheduler-event-compact');
            expect(eventButton(2).classList).toContain('p-scheduler-event-compact');
            expect(eventButton(3).classList).not.toContain('p-scheduler-event-compact');
            // the 15 minutes event is still tall enough for one line of text
            const title = eventButton(1).querySelector('.p-scheduler-event-title') as HTMLElement;
            expect(eventButton(1).getBoundingClientRect().height).toBeGreaterThanOrEqual(title.getBoundingClientRect().height);
            expect(getComputedStyle(eventButton(1)).flexWrap).toBe('nowrap');
        });

        it('should put all-day and multi-day events in the all-day row', async () => {
            await setEvents([
                { id: 'off', title: 'Day off', start: at(4, 0), allDay: true },
                { id: 'conf', title: 'Conference', start: at(1, 9), end: at(2, 18) },
                { id: 'call', title: 'Call', start: at(4, 10), end: at(4, 10, 30) }
            ]);
            const allDay = host.querySelector('.p-scheduler-all-day') as HTMLElement;
            expect(allDay.querySelector('[data-p-event="off"]')).toBeTruthy();
            expect(allDay.querySelectorAll('[data-p-event="conf"]').length).toBe(2);
            expect(allDay.querySelector('[data-p-event="call"]')).toBeNull();
            expect(host.querySelector('[data-p-column] [data-p-event="call"]')).toBeTruthy();
        });

        it('should show the current time line on today', async () => {
            fixture.componentRef.setInput('date', new Date());
            await render();
            expect(host.querySelector('.p-scheduler-now-indicator')).toBeTruthy();
            fixture.componentRef.setInput('nowIndicator', false);
            await render();
            expect(host.querySelector('.p-scheduler-now-indicator')).toBeNull();
        });

        it('should emit onSlotClick when a slot is clicked or activated with Enter', async () => {
            const spy = vi.fn();
            component.onSlotClick.subscribe(spy);
            const slot = host.querySelector('[data-p-column="2026-12-03"] [data-p-slot="20"]') as HTMLElement;
            slot.click();
            expect(spy.mock.calls[0][0].start).toEqual(at(3, 10));
            expect(spy.mock.calls[0][0].end).toEqual(at(3, 10, 30));
            expect(spy.mock.calls[0][0].allDay).toBe(false);
            await render();
            slot.focus();
            slot.dispatchEvent(key({ key: 'Enter' }));
            expect(spy).toHaveBeenCalledTimes(2);
        });

        it('should scroll to scrollToHour', async () => {
            const body = host.querySelector('.p-scheduler-body') as HTMLElement;
            expect(body.scrollTop).toBeGreaterThan(0);
        });
    });

    describe('Events', () => {
        it('should label the events with their title and time', async () => {
            await setEvents([
                { id: 1, title: 'Review', start: at(3, 10), end: at(3, 11) },
                { id: 2, title: 'Holiday', start: at(4, 0), allDay: true }
            ]);
            expect(nameOf(eventButton(1))).toBe('Review, Thu 3 Dec 10:00 – 11:00');
            expect(nameOf(eventButton(2))).toBe('Holiday, Fri 4 Dec, All day');
            expect(eventButton(1).tagName).toBe('BUTTON');
        });

        it('should default the end to one hour later', async () => {
            await setEvents([{ id: 1, title: 'Call', start: at(3, 10) }]);
            expect(nameOf(eventButton(1))).toBe('Call, Thu 3 Dec 10:00 – 11:00');
        });

        it('should emit onEventClick', async () => {
            const spy = vi.fn();
            component.onEventClick.subscribe(spy);
            const dateSpy = vi.fn();
            component.onDateClick.subscribe(dateSpy);
            const event = { id: 1, title: 'Review', start: at(3, 10), end: at(3, 11) };
            await setEvents([event]);
            eventButton(1).click();
            const emitted: SchedulerEventClickEvent = spy.mock.calls[0][0];
            expect(emitted.event).toBe(event);
            expect(dateSpy).not.toHaveBeenCalled();
        });

        it('should pick a readable text color for a custom color', async () => {
            await setEvents([
                { id: 1, title: 'Light', start: at(3, 10), color: '#fde047' },
                { id: 2, title: 'Dark', start: at(4, 12), color: '#1e3a8a' },
                { id: 3, title: 'Named', start: at(7, 14), color: 'navy' },
                { id: 4, title: 'Forced', start: at(8, 16), color: '#1e3a8a', textColor: 'yellow' }
            ]);
            expect(eventButton(1).style.color).toBe('rgb(0, 0, 0)');
            expect(eventButton(2).style.color).toBe('rgb(255, 255, 255)');
            expect(eventButton(3).style.color).toBe('rgb(255, 255, 255)');
            expect(eventButton(4).style.color).toBe('yellow');
            expect(eventButton(1).classList).toContain('p-scheduler-event-colored');
        });

        it('should never change the events', async () => {
            const event = { id: 1, title: 'Review', start: at(3, 10), end: at(3, 11), editable: true };
            const events = [event];
            await setEvents(events);
            eventButton(1).dispatchEvent(key({ key: 'ArrowRight', altKey: true }));
            await render();
            expect(event.start).toEqual(at(3, 10));
            expect(events.length).toBe(1);
        });
    });

    describe('Keyboard', () => {
        it('should move the focus across the days with the arrow keys', async () => {
            const start = cell(3);
            start.focus();
            start.dispatchEvent(key({ key: 'ArrowRight' }));
            await render();
            expect(document.activeElement).toBe(cell(4));
            expect(cell(4).getAttribute('tabindex')).toBe('0');
            expect(cell(3).getAttribute('tabindex')).toBe('-1');
            cell(4).dispatchEvent(key({ key: 'ArrowDown' }));
            await render();
            expect(document.activeElement).toBe(cell(11));
            cell(11).dispatchEvent(key({ key: 'Home' }));
            await render();
            expect(document.activeElement).toBe(cell(6));
            cell(6).dispatchEvent(key({ key: 'End' }));
            await render();
            expect(document.activeElement).toBe(cell(12));
        });

        it('should return from the second day of an overnight event to a slot of that day with Escape', async () => {
            await setView('week');
            await setEvents([{ id: 1, title: 'Night shift', start: at(3, 22), end: at(4, 2) }]);
            const segment = host.querySelector('[data-p-column="2026-12-04"] [data-p-event="1"]') as HTMLElement;
            segment.focus();
            segment.dispatchEvent(key({ key: 'Escape' }));
            await render();
            expect(document.activeElement).toBe(host.querySelector('[data-p-column="2026-12-04"] [data-p-slot="0"]'));
        });

        it('should change the month when the focus leaves it', async () => {
            cell(3).focus();
            cell(3).dispatchEvent(key({ key: 'PageDown' }));
            await render();
            expect(component.date().getMonth()).toBe(0);
            expect(document.activeElement?.getAttribute('data-p-day')).toBe('2027-01-03');
            expect(host.querySelector('[aria-live]')?.textContent).toContain('January 2027');
        });

        it('should emit onDateClick on Enter', async () => {
            const spy = vi.fn();
            component.onDateClick.subscribe(spy);
            cell(3).focus();
            cell(3).dispatchEvent(key({ key: 'Enter' }));
            expect(spy.mock.calls[0][0].start).toEqual(new Date(2026, 11, 3));
        });

        it('should select a range of days with Shift and the arrow keys', async () => {
            fixture.componentRef.setInput('selectable', true);
            await render();
            const spy = vi.fn();
            component.onRangeSelect.subscribe(spy);
            cell(3).focus();
            cell(3).dispatchEvent(key({ key: 'ArrowRight', shiftKey: true }));
            await render();
            cell(4).dispatchEvent(key({ key: 'ArrowRight', shiftKey: true }));
            await render();
            expect(cell(4).getAttribute('aria-selected')).toBe('true');
            expect(cell(3).classList).toContain('p-scheduler-day-selected');
            cell(5).dispatchEvent(key({ key: 'Enter' }));
            expect(spy.mock.calls[0][0]).toEqual(expect.objectContaining({ start: new Date(2026, 11, 3), end: new Date(2026, 11, 6), allDay: true }));
        });

        it('should move the focus across the slots of the time grid', async () => {
            await setView('week');
            const slot = host.querySelector('[data-p-column="2026-12-03"] [data-p-slot="16"]') as HTMLElement;
            expect(slot.getAttribute('tabindex')).toBe('0');
            slot.focus();
            slot.dispatchEvent(key({ key: 'ArrowDown' }));
            await render();
            expect(document.activeElement?.getAttribute('data-p-slot')).toBe('17');
            (document.activeElement as HTMLElement).dispatchEvent(key({ key: 'ArrowRight' }));
            await render();
            expect(document.activeElement?.closest('[data-p-column]')?.getAttribute('data-p-column')).toBe('2026-12-04');
        });

        it('should move an editable event with Alt and the arrow keys', async () => {
            fixture.componentRef.setInput('editable', true);
            await setView('week');
            await setEvents([{ id: 1, title: 'Review', start: at(3, 10), end: at(3, 11) }]);
            const spy = vi.fn();
            component.onEventChange.subscribe(spy);
            eventButton(1).dispatchEvent(key({ key: 'ArrowDown', altKey: true }));
            let change: SchedulerEventChangeEvent = spy.mock.calls[0][0];
            expect(change.start).toEqual(at(3, 10, 30));
            expect(change.end).toEqual(at(3, 11, 30));
            expect(change.oldStart).toEqual(at(3, 10));
            expect(change.type).toBe('move');
            eventButton(1).dispatchEvent(key({ key: 'ArrowRight', altKey: true }));
            change = spy.mock.calls[1][0];
            expect(change.start).toEqual(at(4, 10));
            eventButton(1).dispatchEvent(key({ key: 'ArrowDown', altKey: true, shiftKey: true }));
            change = spy.mock.calls[2][0];
            expect(change.type).toBe('resize');
            expect(change.start).toEqual(at(3, 10));
            expect(change.end).toEqual(at(3, 11, 30));
            await render();
            expect(host.querySelector('[aria-live]')?.textContent).toContain('Review moved to Thu 3 Dec 10:00 – 11:30');
        });

        it('should keep an event moved or resized with the keyboard within the visible hours', async () => {
            fixture.componentRef.setInput('editable', true);
            fixture.componentRef.setInput('dayStartHour', 8);
            fixture.componentRef.setInput('dayEndHour', 18);
            await setView('week');
            await setEvents([
                { id: 1, title: 'Early', start: at(3, 8), end: at(3, 9) },
                { id: 2, title: 'Late', start: at(3, 17, 30), end: at(3, 18) }
            ]);
            const spy = vi.fn();
            component.onEventChange.subscribe(spy);
            eventButton(1).dispatchEvent(key({ key: 'ArrowUp', altKey: true }));
            eventButton(2).dispatchEvent(key({ key: 'ArrowDown', altKey: true }));
            eventButton(2).dispatchEvent(key({ key: 'ArrowDown', altKey: true, shiftKey: true }));
            expect(spy).not.toHaveBeenCalled();
            eventButton(2).dispatchEvent(key({ key: 'ArrowUp', altKey: true }));
            expect(spy.mock.calls[0][0].start).toEqual(at(3, 17));
        });

        it('should list the events outside the visible hours behind a button on the edge of the day', async () => {
            await setView('week');
            await setEvents([
                { id: 1, title: 'Early', start: at(3, 6), end: at(3, 7) },
                { id: 2, title: 'Late', start: at(3, 19), end: at(3, 20) },
                { id: 3, title: 'Overlap', start: at(3, 7), end: at(3, 9) }
            ]);
            // the whole day is shown: no button
            expect(host.querySelector('.p-scheduler-outside-more')).toBeNull();

            fixture.componentRef.setInput('dayStartHour', 8);
            fixture.componentRef.setInput('dayEndHour', 18);
            await render();
            const before = host.querySelectorAll<HTMLButtonElement>('.p-scheduler-outside-more-before');
            const after = host.querySelectorAll<HTMLButtonElement>('.p-scheduler-outside-more-after');
            expect(before.length).toBe(1);
            expect(after.length).toBe(1);
            // the event that overlaps the visible hours stays in the grid
            expect(before[0].textContent?.trim()).toBe('1 earlier');
            expect(after[0].textContent?.trim()).toBe('1 later');
            expect(before[0].getAttribute('aria-label')).toBe('1 events before 08:00 on Thursday, 3 December 2026');
            expect(before[0].getAttribute('aria-expanded')).toBe('false');

            before[0].click();
            await render();
            expect(before[0].getAttribute('aria-expanded')).toBe('true');
            expect(after[0].getAttribute('aria-expanded')).toBe('false');
            const listed = [...document.querySelectorAll('.p-popover [data-p-event]')].map((el) => el.getAttribute('data-p-event'));
            expect(listed).toEqual(['1']);
        });

        it('should move an event by days and weeks in the month view', async () => {
            fixture.componentRef.setInput('editable', true);
            await setEvents([{ id: 1, title: 'Review', start: at(3, 10), end: at(3, 11) }]);
            const spy = vi.fn();
            component.onEventChange.subscribe(spy);
            eventButton(1).dispatchEvent(key({ key: 'ArrowRight', altKey: true }));
            eventButton(1).dispatchEvent(key({ key: 'ArrowDown', altKey: true }));
            expect(spy.mock.calls[0][0].start).toEqual(at(4, 10));
            expect(spy.mock.calls[1][0].start).toEqual(at(10, 10));
        });

        it('should not move events that are not editable', async () => {
            fixture.componentRef.setInput('editable', true);
            await setEvents([{ id: 1, title: 'Fixed', start: at(3, 10), editable: false }]);
            const spy = vi.fn();
            component.onEventChange.subscribe(spy);
            eventButton(1).dispatchEvent(key({ key: 'ArrowRight', altKey: true }));
            expect(spy).not.toHaveBeenCalled();
            expect(eventButton(1).hasAttribute('aria-describedby')).toBe(false);
        });

        it('should describe how to move editable events', async () => {
            fixture.componentRef.setInput('editable', true);
            await setEvents([{ id: 1, title: 'Review', start: at(3, 10) }]);
            const hint = document.getElementById(eventButton(1).getAttribute('aria-describedby')!);
            expect(hint?.textContent).toContain('Alt and arrow keys');
        });

        it('should move between events with the arrow keys and back to the day with Escape', async () => {
            await setEvents([
                { id: 1, title: 'A', start: at(3, 10) },
                { id: 2, title: 'B', start: at(3, 12) }
            ]);
            eventButton(1).focus();
            eventButton(1).dispatchEvent(key({ key: 'ArrowDown' }));
            expect(document.activeElement).toBe(eventButton(2));
            eventButton(2).dispatchEvent(key({ key: 'Escape' }));
            await render();
            expect(document.activeElement).toBe(cell(3));
        });
    });

    describe('Pointer', () => {
        const center = (element: Element) => {
            const rect = element.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        };

        const slotCenter = (day: string, index: number) => center(host.querySelector(`[data-p-column="${day}"] [data-p-slot="${index}"]`)!);

        beforeEach(async () => {
            fixture.componentRef.setInput('editable', true);
            fixture.componentRef.setInput('selectable', true);
            fixture.componentRef.setInput('scrollToHour', 0);
            fixture.componentRef.setInput('scrollHeight', '2000px');
            await setView('week');
        });

        it('should move an event by drag and drop, snapping to the slots', async () => {
            await setEvents([{ id: 1, title: 'Review', start: at(3, 10), end: at(3, 11) }]);
            const spy = vi.fn();
            component.onEventChange.subscribe(spy);
            const from = slotCenter('2026-12-03', 20);
            const to = slotCenter('2026-12-04', 24);
            eventButton(1).dispatchEvent(pointer('pointerdown', from.x, from.y));
            document.dispatchEvent(pointer('pointermove', from.x + 10, from.y + 10));
            document.dispatchEvent(pointer('pointermove', to.x, to.y));
            await render();
            expect(host.querySelector('.p-scheduler-ghost')).toBeTruthy();
            expect(eventButton(1).classList).toContain('p-scheduler-event-dragging');
            document.dispatchEvent(pointer('pointerup', to.x, to.y));
            await render();
            const change: SchedulerEventChangeEvent = spy.mock.calls[0][0];
            expect(change.start).toEqual(at(4, 12));
            expect(change.end).toEqual(at(4, 13));
            expect(host.querySelector('.p-scheduler-ghost')).toBeNull();
        });

        it('should resize an event from its bottom edge', async () => {
            await setEvents([{ id: 1, title: 'Review', start: at(3, 10), end: at(3, 11) }]);
            const spy = vi.fn();
            component.onEventChange.subscribe(spy);
            const handle = host.querySelector('.p-scheduler-resize-handle') as HTMLElement;
            const from = center(handle);
            const to = slotCenter('2026-12-03', 25);
            handle.dispatchEvent(pointer('pointerdown', from.x, from.y));
            document.dispatchEvent(pointer('pointermove', to.x, to.y - 5));
            document.dispatchEvent(pointer('pointerup', to.x, to.y - 5));
            const change: SchedulerEventChangeEvent = spy.mock.calls[0][0];
            expect(change.type).toBe('resize');
            expect(change.start).toEqual(at(3, 10));
            expect(change.end).toEqual(at(3, 12, 30));
        });

        it('should keep onEventClick for a click without movement', async () => {
            await setEvents([{ id: 1, title: 'Review', start: at(3, 10), end: at(3, 11) }]);
            const change = vi.fn();
            const click = vi.fn();
            component.onEventChange.subscribe(change);
            component.onEventClick.subscribe(click);
            const point = center(eventButton(1));
            eventButton(1).dispatchEvent(pointer('pointerdown', point.x, point.y));
            document.dispatchEvent(pointer('pointerup', point.x, point.y));
            eventButton(1).click();
            expect(change).not.toHaveBeenCalled();
            expect(click).toHaveBeenCalledTimes(1);
        });

        it('should select a range of slots by dragging across them', async () => {
            const spy = vi.fn();
            component.onRangeSelect.subscribe(spy);
            const from = slotCenter('2026-12-02', 18);
            const to = slotCenter('2026-12-02', 21);
            const slot = host.querySelector('[data-p-column="2026-12-02"] [data-p-slot="18"]') as HTMLElement;
            slot.dispatchEvent(pointer('pointerdown', from.x, from.y));
            document.dispatchEvent(pointer('pointermove', to.x, to.y));
            await render();
            expect(host.querySelector('.p-scheduler-selection')).toBeTruthy();
            document.dispatchEvent(pointer('pointerup', to.x, to.y));
            expect(spy.mock.calls[0][0]).toEqual(expect.objectContaining({ start: at(2, 9), end: at(2, 11), allDay: false }));
        });

        it('should move an event between days of the month view', async () => {
            await setView('month');
            await setEvents([{ id: 1, title: 'Review', start: at(3, 10), end: at(3, 11) }]);
            const spy = vi.fn();
            component.onEventChange.subscribe(spy);
            const from = center(eventButton(1));
            const to = center(cell(16));
            eventButton(1).dispatchEvent(pointer('pointerdown', from.x, from.y));
            document.dispatchEvent(pointer('pointermove', to.x, to.y));
            await render();
            expect(cell(16).querySelector('.p-scheduler-ghost')).toBeTruthy();
            document.dispatchEvent(pointer('pointerup', to.x, to.y));
            expect(spy.mock.calls[0][0].start).toEqual(at(16, 10));
            expect(spy.mock.calls[0][0].end).toEqual(at(16, 11));
        });

        it('should cancel a drag with Escape', async () => {
            await setEvents([{ id: 1, title: 'Review', start: at(3, 10), end: at(3, 11) }]);
            const spy = vi.fn();
            component.onEventChange.subscribe(spy);
            const from = slotCenter('2026-12-03', 20);
            const to = slotCenter('2026-12-03', 26);
            eventButton(1).dispatchEvent(pointer('pointerdown', from.x, from.y));
            document.dispatchEvent(pointer('pointermove', to.x, to.y));
            document.dispatchEvent(key({ key: 'Escape' }));
            document.dispatchEvent(pointer('pointerup', to.x, to.y));
            expect(spy).not.toHaveBeenCalled();
        });

        it('should cancel a drag with Escape pressed on the dragged event, without a click', async () => {
            await setEvents([{ id: 1, title: 'Review', start: at(3, 10), end: at(3, 11) }]);
            const change = vi.fn();
            const click = vi.fn();
            component.onEventChange.subscribe(change);
            component.onEventClick.subscribe(click);
            const from = slotCenter('2026-12-03', 20);
            const to = slotCenter('2026-12-03', 26);
            eventButton(1).focus();
            eventButton(1).dispatchEvent(pointer('pointerdown', from.x, from.y));
            document.dispatchEvent(pointer('pointermove', to.x, to.y));
            await render();
            expect(host.querySelector('.p-scheduler-ghost')).toBeTruthy();
            // the focused event receives the key, as after a real mouse down
            eventButton(1).dispatchEvent(key({ key: 'Escape' }));
            await render();
            expect(host.querySelector('.p-scheduler-ghost')).toBeNull();
            document.dispatchEvent(pointer('pointerup', to.x, to.y));
            eventButton(1).click();
            expect(change).not.toHaveBeenCalled();
            expect(click).not.toHaveBeenCalled();
            await flush();
            eventButton(1).click();
            expect(click).toHaveBeenCalledTimes(1);
        });

        it('should not drag events when editable is false', async () => {
            fixture.componentRef.setInput('editable', false);
            await setEvents([{ id: 1, title: 'Review', start: at(3, 10), end: at(3, 11) }]);
            const spy = vi.fn();
            component.onEventChange.subscribe(spy);
            const from = slotCenter('2026-12-03', 20);
            const to = slotCenter('2026-12-03', 26);
            eventButton(1).dispatchEvent(pointer('pointerdown', from.x, from.y));
            document.dispatchEvent(pointer('pointermove', to.x, to.y));
            document.dispatchEvent(pointer('pointerup', to.x, to.y));
            expect(spy).not.toHaveBeenCalled();
            expect(host.querySelector('.p-scheduler-resize-handle')).toBeNull();
        });
    });

    describe('Agenda', () => {
        beforeEach(async () => {
            await setView('agenda');
        });

        it('should be a group named by the title, not a landmark', async () => {
            await setEvents([{ id: 1, title: 'Review', start: at(3, 10), end: at(3, 11) }]);
            const agenda = host.querySelector('.p-scheduler-agenda') as HTMLElement;
            expect(agenda.getAttribute('role')).toBe('group');
            expect(agenda.getAttribute('aria-labelledby') || agenda.getAttribute('aria-label')).toBeTruthy();
            expect(host.querySelector('[role="region"]')).toBeNull();
        });

        it('should group the upcoming events by day', async () => {
            await setEvents([
                { id: 1, title: 'Review', start: at(3, 10), end: at(3, 11) },
                { id: 2, title: 'Holiday', start: at(5, 0), allDay: true },
                { id: 3, title: 'Past', start: at(1, 10) }
            ]);
            const days = host.querySelectorAll('.p-scheduler-agenda-day');
            expect(days.length).toBe(2);
            expect(days[0].querySelector('.p-scheduler-agenda-date')?.textContent).toContain('Thursday, 3 December 2026');
            expect(days[0].querySelector('.p-scheduler-event-time')?.textContent).toBe('10:00 – 11:00');
            expect(days[1].querySelector('.p-scheduler-event-time')?.textContent).toBe('All day');
            const list = days[0].querySelector('ul') as HTMLElement;
            expect(document.getElementById(list.getAttribute('aria-labelledby')!)).toBeTruthy();
            expect(eventButton(3)).toBeNull();
        });

        it('should show a message when there are no events', async () => {
            await setEvents([]);
            expect(host.querySelector('.p-scheduler-empty')?.textContent).toContain('No events in this period');
        });

        it('should move between events with the up and down arrows', async () => {
            await setEvents([
                { id: 1, title: 'A', start: at(3, 10) },
                { id: 2, title: 'B', start: at(4, 10) }
            ]);
            eventButton(1).focus();
            eventButton(1).dispatchEvent(key({ key: 'ArrowDown' }));
            expect(document.activeElement).toBe(eventButton(2));
        });
    });

    describe('Responsive', () => {
        it('should switch to the narrow view under the breakpoint', async () => {
            const narrow = TestBed.createComponent(Scheduler);
            narrow.componentRef.setInput('breakpoint', '100000px');
            narrow.componentRef.setInput('date', DATE);
            narrow.detectChanges();
            await narrow.whenStable();
            expect(narrow.componentInstance.view()).toBe('agenda');
            narrow.destroy();
        });
    });

    describe('Responsive start', () => {
        it('should emit onViewChange once, for the narrow view, on a narrow screen', async () => {
            const narrow = TestBed.createComponent(Scheduler);
            const spy = vi.fn();
            narrow.componentInstance.onViewChange.subscribe(spy);
            narrow.componentRef.setInput('breakpoint', '100000px');
            narrow.componentRef.setInput('date', DATE);
            narrow.detectChanges();
            await narrow.whenStable();
            narrow.detectChanges();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.calls[0][0].view).toBe('agenda');
            narrow.destroy();
        });

        it('should follow a change of the breakpoint', async () => {
            const wide = TestBed.createComponent(Scheduler);
            wide.componentRef.setInput('breakpoint', '1px');
            wide.componentRef.setInput('date', DATE);
            wide.detectChanges();
            await wide.whenStable();
            expect(wide.componentInstance.view()).toBe('month');
            wide.componentRef.setInput('breakpoint', '100000px');
            wide.detectChanges();
            await wide.whenStable();
            expect(wide.componentInstance.view()).toBe('agenda');
            // wide again: back to the view before the narrow one
            wide.componentRef.setInput('breakpoint', '1px');
            wide.detectChanges();
            await wide.whenStable();
            expect(wide.componentInstance.view()).toBe('month');
            wide.destroy();
        });
    });

    describe('Templates', () => {
        it('should render the event template with its context', async () => {
            const templateFixture = TestBed.createComponent(EventTemplateHost);
            templateFixture.detectChanges();
            await templateFixture.whenStable();
            const custom = templateFixture.nativeElement.querySelector('.custom-event');
            expect(custom.textContent).toBe('Review / month / 10:00');
            expect(custom.closest('button').querySelector('.p-hidden-accessible').textContent).toBe('Review, Thu 3 Dec 10:00 – 11:00');
            expect(custom.closest('[aria-hidden]')).toBeTruthy();
        });

        it('should replace the header with the header template', async () => {
            const templateFixture = TestBed.createComponent(HeaderTemplateHost);
            templateFixture.detectChanges();
            await templateFixture.whenStable();
            const element: HTMLElement = templateFixture.nativeElement;
            expect(element.querySelector('.p-scheduler-header')).toBeNull();
            expect(element.querySelector('.custom-title')?.textContent).toBe('December 2026');
            expect(element.querySelector('.custom-view')?.textContent).toBe('month');
            expect(element.querySelector('[role="grid"]')?.getAttribute('aria-label')).toBe('December 2026');
            (element.querySelector('.custom-next') as HTMLElement).click();
            templateFixture.detectChanges();
            await templateFixture.whenStable();
            expect(element.querySelector('.custom-title')?.textContent).toBe('January 2027');
        });
    });

    describe('Pass-through and unstyled', () => {
        it('should apply the pass-through options', async () => {
            fixture.componentRef.setInput('pt', { root: { class: 'custom-root' }, day: { 'data-test': 'cell' }, event: { class: 'custom-event-class' } });
            await setEvents([{ id: 1, title: 'Review', start: at(3, 10) }]);
            expect(host.classList).toContain('custom-root');
            expect(host.querySelector('[role="gridcell"]')?.getAttribute('data-test')).toBe('cell');
            expect(eventButton(1).classList).toContain('custom-event-class');
        });

        it('should drop the classes in unstyled mode', async () => {
            fixture.componentRef.setInput('unstyled', true);
            await setEvents([{ id: 1, title: 'Review', start: at(3, 10) }]);
            expect(host.classList).not.toContain('p-scheduler');
            expect(host.querySelector('.p-scheduler-day')).toBeNull();
            expect(host.querySelector('[role="grid"]')).toBeTruthy();
            expect(eventButton(1)).toBeTruthy();
        });

        it('should become a labelled region with ariaLabel', async () => {
            fixture.componentRef.setInput('ariaLabel', 'Team calendar');
            await render();
            expect(host.getAttribute('role')).toBe('region');
            expect(host.getAttribute('aria-label')).toBe('Team calendar');
        });
    });

    describe('Edge cases', () => {
        it('should ignore events without a valid start', async () => {
            await setEvents([{ id: 1, title: 'Broken', start: new Date('invalid') }, null as any, { id: 2, title: 'Fine', start: at(3, 10) }]);
            expect(eventButton(1)).toBeNull();
            expect(eventButton(2)).toBeTruthy();
        });

        it('should accept a null events input', async () => {
            fixture.componentRef.setInput('events', null);
            await render();
            expect(host.querySelectorAll('.p-scheduler-event').length).toBe(0);
        });
    });
});

describe('Scheduler utils', () => {
    it('should resolve the end of the events', () => {
        expect(normalizeEvent({ id: 1, title: '', start: at(3, 10) }, 0, false)!.end).toEqual(at(3, 11));
        expect(normalizeEvent({ id: 1, title: '', start: at(3, 10), allDay: true }, 0, false)!.end).toEqual(new Date(2026, 11, 4));
        // an inclusive end inside the last day is extended to the end of that day
        expect(normalizeEvent({ id: 1, title: '', start: at(3, 0), end: at(5, 23, 59), allDay: true }, 0, false)!.end).toEqual(new Date(2026, 11, 6));
        expect(normalizeEvent({ id: 1, title: '', start: at(3, 0), end: at(6, 0), allDay: true }, 0, false)!.end).toEqual(new Date(2026, 11, 6));
        expect(normalizeEvent({ id: 1, title: '', start: at(3, 10), end: at(4, 11) }, 0, false)!.allDayRow).toBe(true);
    });

    it('should clamp the day when adding months', () => {
        expect(addMonths(new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 28));
    });

    it('should spread an event over the free columns', () => {
        const items = [
            normalizeEvent({ id: 1, title: '', start: at(3, 9), end: at(3, 12) }, 0, false)!,
            normalizeEvent({ id: 2, title: '', start: at(3, 9), end: at(3, 10) }, 1, false)!,
            normalizeEvent({ id: 3, title: '', start: at(3, 9, 30), end: at(3, 10, 30) }, 2, false)!,
            normalizeEvent({ id: 4, title: '', start: at(3, 11), end: at(3, 12) }, 3, false)!
        ];
        const segments = layoutDay(items, new Date(2026, 11, 3), 0, 24);
        const byId = (id: number) => segments.find((s) => s.item.event.id === id)!;
        expect(byId(1).width).toBeCloseTo(100 / 3);
        expect(byId(2).left).toBeCloseTo(100 / 3);
        expect(byId(3).left).toBeCloseTo(200 / 3);
        // the 11:00 event shares the group but the two columns on its right are free
        expect(byId(4).left).toBeCloseTo(100 / 3);
        expect(byId(4).width).toBeCloseTo(200 / 3);
    });

    it('should clip events to the hours of the day', () => {
        const item = normalizeEvent({ id: 1, title: '', start: at(3, 6), end: at(3, 10) }, 0, false)!;
        const [segment] = layoutDay([item], new Date(2026, 11, 3), 8, 18);
        expect(segment.isStart).toBe(false);
        expect(segment.top).toBe(0);
        expect(segment.height).toBeCloseTo(20);
    });

    it('should place the events on the hour lines on the days of a daylight saving time change', () => {
        // the days of the year that do not last 24 hours in the time zone of the browser, if it has daylight saving time
        const days: Date[] = [];
        for (let date = new Date(2026, 0, 1); date.getFullYear() === 2026; date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)) {
            const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
            if (next.getTime() - date.getTime() !== 86_400_000) days.push(date);
        }
        for (const day of [new Date(2026, 11, 3), ...days]) {
            const at10 = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 10);
            const item = normalizeEvent({ id: 1, title: '', start: at10, end: new Date(at10.getTime() + 3_600_000) }, 0, false)!;
            const [segment] = layoutDay([item], day, 0, 24);
            expect(segment.top).toBeCloseTo((10 / 24) * 100);
            expect(segment.height).toBeCloseTo((1 / 24) * 100);
        }
    });

    it('should give an overnight event a segment on each day', () => {
        const item = normalizeEvent({ id: 1, title: '', start: at(3, 22), end: at(4, 2) }, 0, false)!;
        const [first] = layoutDay([item], new Date(2026, 11, 3), 0, 24);
        const [second] = layoutDay([item], new Date(2026, 11, 4), 0, 24);
        expect(first.isEnd).toBe(false);
        expect(first.top + first.height).toBeCloseTo(100);
        expect(second.isStart).toBe(false);
        expect(second.top).toBe(0);
        expect(second.height).toBeCloseTo((2 / 24) * 100);
    });

    it('should choose the text color with the best contrast', () => {
        expect(parseColor('#abc')).toEqual([170, 187, 204]);
        expect(parseColor('rgb(10, 20, 30)')).toEqual([10, 20, 30]);
        expect(parseColor('nope')).toBeNull();
        expect(textColorFor([255, 255, 255])).toBe('#000000');
        expect(textColorFor([0, 0, 0])).toBe('#ffffff');
        // white is at 4.46:1 on indigo 500, black at 4.7:1
        expect(textColorFor([99, 102, 241])).toBe('#000000');
        expect(textColorFor([30, 58, 138])).toBe('#ffffff');
    });
});
