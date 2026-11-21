import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLazyLoadEvent } from '@exhaustive-ui/core/types/table';
import { Table, TableModule } from './table';

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

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <p-table [value]="rows" [columns]="cols" [reorderableColumns]="true" stateStorage="session" stateKey="issue-563">
            <ng-template #header let-columns>
                <tr>
                    @for (col of columns; track col.field) {
                        <th pReorderableColumn>{{ col.header }}</th>
                    }
                </tr>
            </ng-template>
            <ng-template #body let-row let-columns="columns">
                <tr>
                    @for (col of columns; track col.field) {
                        <td>{{ row[col.field] }}</td>
                    }
                </tr>
            </ng-template>
        </p-table>
    `
})
class StatefulReorderComponent {
    cols = [
        { field: 'a', header: 'A' },
        { field: 'b', header: 'B' },
        { field: 'c', header: 'C' }
    ];
    rows = [{ a: 'a1', b: 'b1', c: 'c1' }];
}

describe('Table stateful column reorder (optimus-ui#563)', () => {
    const headers = (fixture: ComponentFixture<any>) => Array.from(fixture.nativeElement.querySelectorAll('th')).map((th: any) => th.textContent.trim());

    afterEach(() => window.sessionStorage.removeItem('issue-563'));

    it('restores the saved order and still reorders the columns afterwards', async () => {
        window.sessionStorage.setItem('issue-563', JSON.stringify({ columnOrder: ['c', 'a', 'b'] }));
        const fixture = await mount(StatefulReorderComponent);
        expect(headers(fixture)).toEqual(['C', 'A', 'B']);

        const first = fixture.nativeElement.querySelector('th') as HTMLElement;
        first.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight', key: 'ArrowRight', ctrlKey: true, bubbles: true, cancelable: true }));
        await fixture.whenStable();
        fixture.detectChanges();
        await tick(10);

        expect(headers(fixture)).toEqual(['A', 'C', 'B']);
        expect(JSON.parse(window.sessionStorage.getItem('issue-563')!).columnOrder).toEqual(['a', 'c', 'b']);
        fixture.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <p-table [value]="rows()" [paginator]="true" [rows]="10" stateStorage="session" stateKey="issue-813">
            <ng-template #body let-row>
                <tr>
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class StatefulPageComponent {
    rows = signal<any[]>([]);
}

describe('Table stateful page with an initially empty value (optimus-ui#813)', () => {
    afterEach(() => window.sessionStorage.removeItem('issue-813'));

    it('shows the saved page once the data arrives', async () => {
        window.sessionStorage.setItem('issue-813', JSON.stringify({ first: 20, rows: 10 }));
        const fixture = await mount(StatefulPageComponent);
        fixture.componentInstance.rows.set(makeRows(50));
        await fixture.whenStable();
        await tick(10);
        await fixture.whenStable();

        expect(fixture.nativeElement.querySelector('tbody td').textContent.trim()).toBe('Name 20');
        expect(fixture.nativeElement.querySelector('[aria-current="page"]')?.textContent.trim()).toBe('3');
        fixture.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule, FormsModule],
    template: `
        <p-table #dt [value]="rows" dataKey="id">
            <ng-template #body let-row let-rowIndex="rowIndex">
                <tr>
                    <td [pEditableColumn]="row" pEditableColumnField="name" [pEditableColumnRowIndex]="rowIndex">
                        <p-cellEditor>
                            <ng-template #input><input class="editor" [(ngModel)]="row.name" /></ng-template>
                            <ng-template #output
                                ><span class="output">{{ row.name }}</span></ng-template
                            >
                        </p-cellEditor>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class EditableFilterComponent {
    @ViewChild('dt') table!: Table;
    rows = makeRows(6);
}

describe('Table editable cells and filtering (optimus-ui#537)', () => {
    it('does not put a cell in edit mode when filtering changes its row', async () => {
        const fixture = await mount(EditableFilterComponent);
        expect(fixture.nativeElement.querySelectorAll('input.editor').length).toBe(0);

        fixture.componentInstance.table.filter('Name 3', 'name', 'contains');
        await fixture.whenStable();
        await tick(400);
        await fixture.whenStable();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(1);
        expect(fixture.nativeElement.querySelectorAll('input.editor').length).toBe(0);
        expect(fixture.componentInstance.table.editingCell()).toBeFalsy();
        fixture.nativeElement.remove();
    });
});
