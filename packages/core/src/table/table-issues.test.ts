import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLazyLoadEvent } from '@exhaustive-ui/core/types/table';
import { TableModule } from './table';

const tick = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

async function mount<T>(type: new (...args: any[]) => T): Promise<ComponentFixture<T>> {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({ imports: [type], providers: [provideZonelessChangeDetection()] }).compileComponents();
    const fixture = TestBed.createComponent(type);
    document.body.appendChild(fixture.nativeElement);
    await fixture.whenStable();
    return fixture;
}

function makeRows(count: number) {
    return Array.from({ length: count }, (_, i) => ({ id: i, name: 'Name ' + i, code: 'C' + (i % 7) }));
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <p-table [value]="rows()" [lazy]="true" [paginator]="true" [rows]="10" [totalRecords]="totalRecords()" [loading]="loading()" [sortField]="sortField" [sortOrder]="sortOrder" (onLazyLoad)="load($event)" dataKey="id">
            <ng-template #header>
                <tr>
                    <th pSortableColumn="name" id="sort-name">Name</th>
                    <th>Code</th>
                </tr>
                <tr>
                    <th><p-columnFilter type="text" field="name" [showMenu]="false" /></th>
                    <th></th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr>
                    <td>{{ row.name }}</td>
                    <td>{{ row.code }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class LazyTableComponent {
    rows = signal<any[]>([]);
    totalRecords = signal(0);
    loading = signal(true);
    sortField: string | undefined = undefined;
    sortOrder = 1;
    events: TableLazyLoadEvent[] = [];

    load(event: TableLazyLoadEvent) {
        this.events.push(event);
        this.loading.set(true);
        // server side answer, the consumer mirrors the sort it received
        setTimeout(() => {
            this.sortField = event.sortField as string;
            this.sortOrder = event.sortOrder ?? 1;
            this.rows.set(makeRows(10));
            this.totalRecords.set(100);
            this.loading.set(false);
        });
    }
}

describe('Table lazy loading counts', () => {
    it('emits one lazy load on init (optimus-ui#927)', async () => {
        const fixture = await mount(LazyTableComponent);
        await tick(10);
        await fixture.whenStable();
        expect(fixture.componentInstance.events.length).toBe(1);
        fixture.nativeElement.remove();
    });

    it('emits one lazy load per server side sort, without a loop when the consumer mirrors the sort (optimus-ui#712)', async () => {
        const fixture = await mount(LazyTableComponent);
        await tick(10);
        await fixture.whenStable();
        fixture.componentInstance.events = [];

        fixture.nativeElement.querySelector('#sort-name').click();
        await fixture.whenStable();
        await tick(20);
        await fixture.whenStable();
        await tick(20);

        expect(fixture.componentInstance.events.length).toBe(1);
        expect(fixture.componentInstance.events[0].sortField).toBe('name');
        fixture.nativeElement.remove();
    });

    it('emits one lazy load when a new filter value is applied with Enter (optimus-ui#884)', async () => {
        const fixture = await mount(LazyTableComponent);
        await tick(10);
        await fixture.whenStable();
        fixture.componentInstance.events = [];

        const input = fixture.nativeElement.querySelector('p-columnfilter input') as HTMLInputElement;
        input.value = 'Name 1';
        input.dispatchEvent(new Event('input'));
        await fixture.whenStable();
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
        await fixture.whenStable();
        await tick(400);
        await fixture.whenStable();

        expect(fixture.componentInstance.events.length).toBe(1);
        expect((fixture.componentInstance.events[0].filters as any).name.value).toBe('Name 1');
        fixture.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <p-table [value]="rows" [lazy]="true" [scrollable]="true" scrollHeight="300px" [rows]="20" [virtualScroll]="true" [virtualScrollItemSize]="40" [totalRecords]="1000" (onLazyLoad)="load($event)">
            <ng-template #header>
                <tr>
                    <th>Name</th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr style="height: 40px">
                    <td>{{ row?.name }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class LazyVirtualTableComponent {
    rows: any[] = Array.from({ length: 1000 });
    events: TableLazyLoadEvent[] = [];

    load(event: TableLazyLoadEvent) {
        this.events.push(event);
        const first = event.first ?? 0;
        const last = event.last ?? first + 20;
        setTimeout(() => {
            const next = [...this.rows];
            for (let i = first; i < last; i++) next[i] = { id: i, name: 'Name ' + i };
            this.rows = next;
        });
    }
}

describe('Table lazy virtual scroll counts', () => {
    it('emits one lazy load on init without scrolling (optimus-ui#788)', async () => {
        const fixture = await mount(LazyVirtualTableComponent);
        await tick(50);
        await fixture.whenStable();
        await tick(50);
        expect(fixture.componentInstance.events.length).toBe(1);
        fixture.nativeElement.remove();
    });
});
