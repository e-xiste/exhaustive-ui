import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTextModule } from '@exhaustive-ui/core/inputtext';
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
        <p-table [rowTrackBy]="trackRow" [value]="rows" [lazy]="true" [scrollable]="true" scrollHeight="300px" [rows]="20" [virtualScroll]="true" [virtualScrollItemSize]="40" [totalRecords]="1000" (onLazyLoad)="load($event)">
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
    // the rows not loaded yet are undefined: track them by position
    trackRow = (index: number, row: any) => row?.id ?? 'pending-' + index;

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

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <p-table [rowTrackBy]="trackRow" [value]="rows()" [lazy]="true" [scrollable]="true" scrollHeight="400px" [rows]="20" [virtualScroll]="true" [virtualScrollItemSize]="40" (onLazyLoad)="load($event)">
            <ng-template #header>
                <tr>
                    <th>Name</th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr style="height: 40px" class="data-row">
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
            <ng-template #loadingbody>
                <tr style="height: 40px" class="skeleton-row">
                    <td>...</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class LazyVirtualLoadingComponent {
    // the rows not loaded yet are undefined: track them by position
    trackRow = (index: number, row: any) => row?.id ?? 'pending-' + index;

    rows = signal<any[]>(Array.from({ length: 2000 }));
    responseDelay = 0;

    load(event: TableLazyLoadEvent) {
        const first = event.first ?? 0;
        const last = event.last ?? first + 20;
        setTimeout(() => {
            const next = [...this.rows()];
            for (let i = first; i < last; i++) next[i] = { id: i, name: 'Name ' + i };
            this.rows.set(next);
        }, this.responseDelay);
    }
}

describe('Table lazy virtual scroll loading body (optimus-ui#543)', () => {
    it('shows the loading body rows while the rows reached by a fast scroll are loading', async () => {
        const fixture = await mount(LazyVirtualLoadingComponent);
        await tick(50);
        await fixture.whenStable();
        expect(fixture.nativeElement.querySelectorAll('.data-row').length).toBeGreaterThan(0);

        fixture.componentInstance.responseDelay = 1000;
        const scroller = fixture.nativeElement.querySelector('.p-virtualscroller') as HTMLElement;
        scroller.scrollTop = scroller.scrollHeight;
        scroller.dispatchEvent(new Event('scroll'));
        await tick(20);
        await fixture.whenStable();
        expect(fixture.nativeElement.querySelectorAll('.skeleton-row').length).toBeGreaterThan(0);
        expect(fixture.nativeElement.querySelectorAll('.data-row').length).toBe(0);

        // the scroll delay is over but the data has not arrived yet
        await tick(400);
        await fixture.whenStable();
        expect(fixture.nativeElement.querySelectorAll('.skeleton-row').length).toBeGreaterThan(0);
        expect(fixture.nativeElement.querySelectorAll('.data-row').length).toBe(0);

        await tick(1000);
        await fixture.whenStable();
        expect(fixture.nativeElement.querySelectorAll('.data-row').length).toBeGreaterThan(0);
        expect(fixture.nativeElement.querySelector('.data-row td').textContent).toContain('Name 19');
        fixture.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <div style="height: 400px; display: flex; flex-direction: column">
            <div style="height: 50px; flex: none">toolbar</div>
            <p-table [value]="rows" [scrollable]="true" scrollHeight="flex" [virtualScroll]="true" [virtualScrollItemSize]="40" style="flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column">
                <ng-template #header>
                    <tr>
                        <th>Name</th>
                    </tr>
                </ng-template>
                <ng-template #body let-row>
                    <tr style="height: 40px" class="data-row">
                        <td>{{ row.name }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
class VirtualFlexComponent {
    rows = makeRows(1000);
}

describe('Table virtual scroll with a flex scroll height (optimus-ui#617)', () => {
    it('renders a window of rows inside a scroller that fills the flex parent', async () => {
        const fixture = await mount(VirtualFlexComponent);
        await tick(50);
        await fixture.whenStable();

        const scroller = fixture.nativeElement.querySelector('.p-virtualscroller') as HTMLElement;
        const rows = fixture.nativeElement.querySelectorAll('.data-row').length;
        expect(scroller.getBoundingClientRect().height).toBeGreaterThan(300);
        expect(scroller.getBoundingClientRect().height).toBeLessThanOrEqual(350);
        expect(scroller.scrollHeight).toBeGreaterThan(30000);
        expect(rows).toBeGreaterThan(5);
        expect(rows).toBeLessThan(100);

        scroller.scrollTop = 20000;
        scroller.dispatchEvent(new Event('scroll'));
        await tick(50);
        await fixture.whenStable();
        const firstVisible = fixture.nativeElement.querySelector('.data-row td').textContent.trim();
        expect(Number(firstVisible.replace('Name ', ''))).toBeGreaterThan(400);
        fixture.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <p-table #dt [value]="rows" [scrollable]="true" scrollHeight="400px" [virtualScroll]="true" [virtualScrollItemSize]="40" [globalFilterFields]="['name']">
            <ng-template #header>
                <tr>
                    <th>Name</th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr style="height: 40px" class="data-row">
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr class="empty-row">
                    <td>No data</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class VirtualFilterComponent {
    @ViewChild('dt') table!: Table;
    rows = makeRows(1000);
}

describe('Table virtual scroll and a filter without match (optimus-ui#796)', () => {
    it('shows the rows again when the filter matches after an empty result', async () => {
        const fixture = await mount(VirtualFilterComponent);
        await tick(50);
        const scroller = fixture.nativeElement.querySelector('.p-virtualscroller') as HTMLElement;
        scroller.scrollTop = 4000;
        scroller.dispatchEvent(new Event('scroll'));
        await tick(50);
        await fixture.whenStable();

        fixture.componentInstance.table.filterGlobal('nothing matches', 'contains');
        await tick(400);
        await fixture.whenStable();
        expect(fixture.nativeElement.querySelectorAll('.data-row').length).toBe(0);
        expect(fixture.nativeElement.querySelectorAll('.empty-row').length).toBe(1);

        fixture.componentInstance.table.filterGlobal('Name 1', 'contains');
        await tick(400);
        await fixture.whenStable();
        await tick(50);
        await fixture.whenStable();

        const rendered = fixture.nativeElement.querySelectorAll('.data-row').length;
        expect(rendered).toBeGreaterThan(5);
        expect(fixture.nativeElement.querySelectorAll('.empty-row').length).toBe(0);
        // 111 matches of 40px
        expect(scroller.scrollHeight).toBeGreaterThan(4000);

        fixture.componentInstance.table.filterGlobal('', 'contains');
        await tick(400);
        await fixture.whenStable();
        await tick(50);
        expect(scroller.scrollHeight).toBeGreaterThan(39000);
        expect(fixture.nativeElement.querySelectorAll('.data-row').length).toBeGreaterThan(5);
        fixture.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <div style="width: 500px">
            <p-table [value]="rows" [scrollable]="true" scrollHeight="400px" [virtualScroll]="true" [virtualScrollItemSize]="40">
                <ng-template #header>
                    <tr>
                        <th pFrozenColumn style="min-width: 120px">Id</th>
                        <th pFrozenColumn style="min-width: 120px">Name</th>
                        <th pFrozenColumn style="min-width: 120px">Code</th>
                        @for (c of extra; track c) {
                            <th style="min-width: 200px">Extra {{ c }}</th>
                        }
                    </tr>
                </ng-template>
                <ng-template #body let-row>
                    <tr style="height: 40px" class="data-row">
                        <td pFrozenColumn>{{ row.id }}</td>
                        <td pFrozenColumn>{{ row.name }}</td>
                        <td pFrozenColumn>{{ row.code }}</td>
                        @for (c of extra; track c) {
                            <td>{{ row.name }} {{ c }}</td>
                        }
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
class VirtualFrozenComponent {
    rows = makeRows(2000);
    extra = [1, 2, 3, 4];
}

describe('Table virtual scroll with frozen columns (optimus-ui#799, optimus-ui#890)', () => {
    it('follows the scroll position, upwards as well as downwards', async () => {
        const fixture = await mount(VirtualFrozenComponent);
        await tick(50);
        await fixture.whenStable();
        const scroller = fixture.nativeElement.querySelector('.p-virtualscroller') as HTMLElement;
        const firstRenderedId = () => Number((fixture.nativeElement.querySelector('.data-row td') as HTMLElement).textContent!.trim());
        const scrollTo = async (top: number) => {
            scroller.scrollTop = top;
            scroller.dispatchEvent(new Event('scroll'));
            await new Promise((resolve) => requestAnimationFrame(resolve));
            await fixture.whenStable();
            await tick(20);
        };

        await scrollTo(40000);
        expect(scroller.scrollTop).toBe(40000);

        for (let top = 40000; top >= 36000; top -= 200) {
            await scrollTo(top);
            expect(scroller.scrollTop).toBe(top);
            const first = firstRenderedId();
            // the rendered window starts at or before the first visible row and covers the viewport
            expect(first).toBeLessThanOrEqual(top / 40);
            expect(first).toBeGreaterThan(top / 40 - 40);
        }
        fixture.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <p-table id="outer" [value]="rows" dataKey="id" [showGridlines]="true" [expandedRowKeys]="expanded">
            <ng-template #header>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr class="outer-row">
                    <td>{{ row.id }}</td>
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
            <ng-template #expandedrow let-row>
                <tr class="expansion-row">
                    <td colspan="2">
                        <p-table id="inner" [value]="orders">
                            <ng-template #header>
                                <tr>
                                    <th>Order</th>
                                    <th>Amount</th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-order>
                                <tr class="inner-row">
                                    <td>{{ order.id }}</td>
                                    <td>{{ order.amount }}</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </td>
                </tr>
            </ng-template>
            <ng-template #footer>
                <tr>
                    <td id="footer-first">Total</td>
                    <td id="footer-last">3</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class GridlinesExpansionFooterComponent {
    rows = makeRows(2);
    expanded: Record<string, boolean> = { '1': true };
    orders = [
        { id: 'o1', amount: 1 },
        { id: 'o2', amount: 2 }
    ];
}

describe('Table gridlines with an expanded row and a footer (optimus-ui#951)', () => {
    it('keeps the bottom border of the table and of the nested table rows', async () => {
        const fixture = await mount(GridlinesExpansionFooterComponent);
        await tick(20);
        const el = fixture.nativeElement as HTMLElement;
        expect(el.querySelectorAll('.expansion-row').length).toBe(1);

        const footer = el.querySelector('#footer-first') as HTMLElement;
        expect(getComputedStyle(footer).borderBottomWidth).toBe('1px');
        expect(getComputedStyle(el.querySelector('#footer-last') as HTMLElement).borderBottomWidth).toBe('1px');

        // the nested table has no gridlines: the rules of the outer table must not leak into it
        const innerCells = Array.from(el.querySelectorAll('.inner-row td')) as HTMLElement[];
        const outerCellWidth = getComputedStyle(el.querySelector('.outer-row td') as HTMLElement).borderLeftWidth;
        expect(outerCellWidth).toBe('1px');
        for (const cell of innerCells) {
            expect(getComputedStyle(cell).borderLeftWidth).toBe('0px');
            expect(getComputedStyle(cell).borderBottomWidth).toBe('1px');
        }
        fixture.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <p-table [value]="rows" [scrollable]="true" scrollHeight="200px">
            <ng-template #header>
                <tr>
                    <th>Name</th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr style="height: 40px">
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
            <ng-template #footer>
                <tr>
                    <td id="sticky-footer">Total</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class ScrollableFooterComponent {
    rows = makeRows(50);
}

describe('Table scrollable footer (optimus-ui#679)', () => {
    it('keeps the footer at the bottom of the scroll viewport', async () => {
        const fixture = await mount(ScrollableFooterComponent);
        const container = fixture.nativeElement.querySelector('.p-datatable-table-container') as HTMLElement;
        const footer = fixture.nativeElement.querySelector('#sticky-footer') as HTMLElement;
        expect(container.scrollHeight).toBeGreaterThan(1000);

        const bottom = () => Math.round(container.getBoundingClientRect().bottom - footer.getBoundingClientRect().bottom);
        expect(Math.abs(bottom())).toBeLessThanOrEqual(1);
        container.scrollTop = 500;
        await new Promise((resolve) => requestAnimationFrame(resolve));
        expect(Math.abs(bottom())).toBeLessThanOrEqual(1);
        fixture.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <p-table [value]="rows" responsiveLayout="stack" [breakpoint]="breakpoint" [showGridlines]="true">
            <ng-template #header>
                <tr>
                    <th>Name</th>
                    <th>Code</th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr>
                    <td><span class="p-datatable-column-title">Name</span>{{ row.name }}</td>
                    <td><span class="p-datatable-column-title">Code</span>{{ row.code }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class StackComponent {
    rows = makeRows(2);
    breakpoint = '100000px';
}

describe('Table responsive stack layout (optimus-ui#814)', () => {
    it('stacks the cells below the breakpoint', async () => {
        const fixture = await mount(StackComponent);
        const el = fixture.nativeElement as HTMLElement;
        const cells = Array.from(el.querySelectorAll('tbody td')) as HTMLElement[];

        expect(getComputedStyle(el.querySelector('thead th') as HTMLElement).display).toBe('none');
        expect(getComputedStyle(cells[0]).display).toBe('flex');
        expect(cells[0].getBoundingClientRect().top).toBeLessThan(cells[1].getBoundingClientRect().top);
        expect(getComputedStyle(cells[0].querySelector('.p-datatable-column-title') as HTMLElement).display).toBe('block');
        // gridlines: the last cell of a stacked row only keeps its bottom border
        expect(getComputedStyle(cells[1]).borderTopWidth).toBe('0px');
        expect(getComputedStyle(cells[1]).borderLeftWidth).toBe('0px');
        expect(getComputedStyle(cells[1]).borderRightWidth).toBe('0px');
        fixture.nativeElement.remove();
    });

    it('keeps the table layout and hides the column titles above the breakpoint', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({ imports: [StackComponent], providers: [provideZonelessChangeDetection()] }).compileComponents();
        const fixture = TestBed.createComponent(StackComponent);
        fixture.componentInstance.breakpoint = '10px';
        document.body.appendChild(fixture.nativeElement);
        await fixture.whenStable();
        const el = fixture.nativeElement as HTMLElement;
        const cells = Array.from(el.querySelectorAll('tbody td')) as HTMLElement[];

        expect(getComputedStyle(el.querySelector('thead th') as HTMLElement).display).toBe('table-cell');
        expect(getComputedStyle(cells[0]).display).toBe('table-cell');
        expect(getComputedStyle(cells[0].querySelector('.p-datatable-column-title') as HTMLElement).display).toBe('none');
        fixture.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <div style="width: 500px">
            <p-table [value]="rows" [scrollable]="true" scrollHeight="300px">
                <ng-template #header>
                    <tr>
                        <th id="h-name" style="min-width: 200px" pFrozenColumn rowspan="2">Name</th>
                        <th id="h-id" style="min-width: 100px" pFrozenColumn>Id</th>
                        <th style="min-width: 200px" rowspan="2">Country</th>
                        <th style="min-width: 200px" rowspan="2">Company</th>
                    </tr>
                    <tr>
                        <th id="h-other" pFrozenColumn>Other header</th>
                    </tr>
                </ng-template>
                <ng-template #body let-row>
                    <tr>
                        <td pFrozenColumn>{{ row.name }}</td>
                        <td id="b-id" pFrozenColumn>{{ row.id }}</td>
                        <td>{{ row.code }}</td>
                        <td>{{ row.code }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
class FrozenRowspanComponent {
    rows = makeRows(3);
}

describe('Table frozen columns in a multi-row header (optimus-ui#711)', () => {
    it('places a frozen cell of the second header row after the frozen cell spanning both rows', async () => {
        const fixture = await mount(FrozenRowspanComponent);
        await tick(50);
        await fixture.whenStable();
        const el = fixture.nativeElement as HTMLElement;
        const name = el.querySelector('#h-name') as HTMLElement;
        const id = el.querySelector('#h-id') as HTMLElement;
        const other = el.querySelector('#h-other') as HTMLElement;

        expect(parseFloat(getComputedStyle(id).insetInlineStart)).toBe(name.offsetWidth);
        expect(parseFloat(getComputedStyle(other).insetInlineStart)).toBe(name.offsetWidth);
        expect(parseFloat(getComputedStyle(el.querySelector('#b-id') as HTMLElement).insetInlineStart)).toBe(name.offsetWidth);

        // still in place when the table is scrolled horizontally
        const container = el.querySelector('.p-datatable-table-container') as HTMLElement;
        container.scrollLeft = 200;
        await new Promise((resolve) => requestAnimationFrame(resolve));
        expect(Math.round(other.getBoundingClientRect().left - container.getBoundingClientRect().left)).toBe(name.offsetWidth);
        fixture.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule, FormsModule, InputTextModule],
    template: `
        <p-table [value]="rows" dataKey="id" editMode="row" [editingRowKeys]="editing">
            <ng-template #body let-row>
                <tr [pEditableRow]="row">
                    <td>
                        <p-cellEditor>
                            <ng-template #input><input pInputText class="row-input" [(ngModel)]="row.name" /></ng-template>
                            <ng-template #output>{{ row.name }}</ng-template>
                        </p-cellEditor>
                    </td>
                    <td>
                        <p-cellEditor>
                            <ng-template #input><input pInputText class="row-input" [(ngModel)]="row.code" /></ng-template>
                            <ng-template #output>{{ row.code }}</ng-template>
                        </p-cellEditor>
                    </td>
                    <td>
                        <p-cellEditor>
                            <ng-template #input><input pInputText class="row-input" [(ngModel)]="row.id" /></ng-template>
                            <ng-template #output>{{ row.id }}</ng-template>
                        </p-cellEditor>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class WholeTableEditingComponent {
    rows = makeRows(600);
    editing: Record<string, boolean> = Object.fromEntries(this.rows.map((row) => [row.id, true]));
}

describe('Table whole table editing with pInputText cells (optimus-ui#493)', () => {
    it('renders hundreds of editing rows without a stack overflow', async () => {
        const errors: unknown[] = [];
        const onError = (event: ErrorEvent) => errors.push(event.error);
        window.addEventListener('error', onError);
        const consoleError = vi.spyOn(console, 'error');
        try {
            const fixture = await mount(WholeTableEditingComponent);
            await tick(50);
            expect(fixture.nativeElement.querySelectorAll('input.row-input').length).toBe(1800);
            expect(errors).toEqual([]);
            expect(consoleError.mock.calls.filter((args) => String(args[0]).includes('RangeError') || args.some((a) => a instanceof RangeError))).toEqual([]);
            fixture.nativeElement.remove();
        } finally {
            window.removeEventListener('error', onError);
            consoleError.mockRestore();
        }
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <p-table #dt [value]="rows">
            <ng-template #header>
                <tr>
                    <th>Name</th>
                    <th>Verified</th>
                </tr>
                <tr>
                    <th><p-columnFilter type="text" field="name" [showMenu]="false" /></th>
                    <th><p-columnFilter type="boolean" field="verified" /></th>
                </tr>
            </ng-template>
            <ng-template #body let-row>
                <tr class="data-row">
                    <td>{{ row.name }}</td>
                    <td>{{ row.verified }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class BooleanFilterComponent {
    @ViewChild('dt') table!: Table;
    rows = makeRows(6).map((row, i) => ({ ...row, verified: i % 2 === 0 }));
}

describe('Table boolean column filter (optimus-ui#684)', () => {
    // since v18 the binary checkbox gives true and false, the "any" state is the clear button next to it
    it('filters on true and false, and back to any with the clear button', async () => {
        const fixture = await mount(BooleanFilterComponent);
        const el = fixture.nativeElement as HTMLElement;
        const box = () => el.querySelector('p-columnfilter:nth-of-type(1) input[type="checkbox"], th:nth-child(2) input[type="checkbox"]') as HTMLInputElement;
        const rows = () => el.querySelectorAll('.data-row').length;
        const click = async () => {
            box().click();
            await fixture.whenStable();
            await tick(10);
            await fixture.whenStable();
        };

        expect(rows()).toBe(6);
        await click();
        expect(rows()).toBe(3);
        expect((fixture.componentInstance.table._filters() as any).verified.value).toBe(true);
        await click();
        expect(rows()).toBe(3);
        expect((fixture.componentInstance.table._filters() as any).verified.value).toBe(false);
        (el.querySelector('th:nth-child(2) p-button button') as HTMLButtonElement).click();
        await fixture.whenStable();
        await tick(10);
        await fixture.whenStable();
        expect(rows()).toBe(6);
        expect((fixture.componentInstance.table._filters() as any).verified.value).toBe(null);
        // the checkbox shows the indeterminate (minus) icon again
        expect(box().closest('p-checkbox')!.querySelector('[data-p-icon="minus"]')).toBeTruthy();
        fixture.nativeElement.remove();
    });
});

describe('Table text column filter applied when leaving the input (optimus-ui#862)', () => {
    const type = async (fixture: ComponentFixture<any>, input: HTMLInputElement, value: string) => {
        input.focus();
        input.value = value;
        input.dispatchEvent(new Event('input'));
        await fixture.whenStable();
    };

    it('filters the rows when the typed value is left with a click outside', async () => {
        const fixture = await mount(BooleanFilterComponent);
        const el = fixture.nativeElement as HTMLElement;
        const input = el.querySelector('th input[type="text"]') as HTMLInputElement;

        await type(fixture, input, 'Name 3');
        expect(el.querySelectorAll('.data-row').length).toBe(6);
        input.blur();
        await fixture.whenStable();
        await tick(10);
        await fixture.whenStable();

        expect(el.querySelectorAll('.data-row').length).toBe(1);
        fixture.nativeElement.remove();
    });

    it('does not load a lazy table again when the value applied with Enter is left', async () => {
        const fixture = await mount(LazyTableComponent);
        await tick(10);
        await fixture.whenStable();
        fixture.componentInstance.events = [];
        const input = fixture.nativeElement.querySelector('p-columnfilter input') as HTMLInputElement;

        await type(fixture, input, 'Name 1');
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
        await fixture.whenStable();
        input.blur();
        await fixture.whenStable();
        await tick(20);
        expect(fixture.componentInstance.events.length).toBe(1);

        // focusing and leaving without a change does not load either
        input.focus();
        input.blur();
        await fixture.whenStable();
        await tick(20);
        expect(fixture.componentInstance.events.length).toBe(1);
        fixture.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <p-table [value]="rows" dataKey="group" rowGroupMode="subheader" groupRowsBy="group" [expandedRowKeys]="expanded" [scrollable]="true" scrollHeight="400px" [virtualScroll]="true" [virtualScrollItemSize]="40">
            <ng-template #groupheader let-row let-expanded="expanded">
                <tr class="group-header" style="height: 40px">
                    <td>
                        <button type="button" [pRowToggler]="row">toggle</button>
                        {{ row.group }}
                    </td>
                </tr>
            </ng-template>
            <ng-template #expandedrow let-row>
                <tr class="data-row" style="height: 40px">
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class VirtualExpandableGroupsComponent {
    rows = makeRows(600).map((row) => ({ ...row, group: 'G' + Math.floor(row.id / 30) }));
    expanded: Record<string, boolean> = Object.fromEntries(Array.from({ length: 20 }, (_, i) => ['G' + i, true]));
}

describe('Table expandable row groups with virtual scroll (optimus-ui#783)', () => {
    it('renders one group header per group in the rendered rows, also after scrolling', async () => {
        const fixture = await mount(VirtualExpandableGroupsComponent);
        await tick(50);
        await fixture.whenStable();
        const el = fixture.nativeElement as HTMLElement;
        for (let i = 0; i < 20 && !el.querySelector('.group-header'); i++) {
            await tick(20);
            await fixture.whenStable();
        }
        const check = () => {
            const headers = Array.from(el.querySelectorAll('.group-header')).map((h) => h.textContent!.replace('toggle', '').trim());
            expect(headers.length).toBeGreaterThan(0);
            expect(new Set(headers).size).toBe(headers.length);
        };
        check();

        const scroller = el.querySelector('.p-virtualscroller') as HTMLElement;
        scroller.scrollTop = 8000;
        scroller.dispatchEvent(new Event('scroll'));
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await tick(50);
        await fixture.whenStable();
        check();
        fixture.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <div id="host" style="height: 400px; width: 600px; display: flex; flex-direction: column">
            <p-table [value]="rows()" [lazy]="true" [scrollable]="true" scrollHeight="flex" [virtualScroll]="true" [virtualScrollItemSize]="40" [virtualScrollDelay]="0" [rows]="30" [rowTrackBy]="trackRow" (onLazyLoad)="load($event)">
                <ng-template #body let-row>
                    <tr style="height: 40px" class="data-row">
                        <td>{{ row?.name }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
class LazyVirtualFlexResizeComponent {
    // the rows not loaded yet are undefined: track them by position
    trackRow = (index: number, row: any) => row?.id ?? 'pending-' + index;

    rows = signal<any[]>(Array.from({ length: 1000 }));

    load(event: TableLazyLoadEvent) {
        const first = event.first ?? 0;
        const last = event.last ?? first + 30;
        setTimeout(() => {
            const next = [...this.rows()];
            for (let i = first; i < last; i++) next[i] = { id: i, name: 'Name ' + i };
            this.rows.set(next);
        });
    }
}

describe('Table lazy virtual scroll with a flex height resized (optimus-ui#750)', () => {
    // the report is Firefox only: this keeps the Chromium behaviour
    it('keeps the scroll position and the rows when the container is resized', async () => {
        const fixture = await mount(LazyVirtualFlexResizeComponent);
        await tick(100);
        await fixture.whenStable();
        const el = fixture.nativeElement as HTMLElement;
        const scroller = el.querySelector('.p-virtualscroller') as HTMLElement;
        scroller.scrollTop = 2000;
        scroller.dispatchEvent(new Event('scroll'));
        await tick(100);
        await fixture.whenStable();
        expect(scroller.scrollTop).toBe(2000);
        (el.querySelector('#host') as HTMLElement).style.height = '300px';
        window.dispatchEvent(new Event('resize'));
        await tick(300);
        await fixture.whenStable();
        await tick(100);
        expect(scroller.scrollTop).toBe(2000);
        expect(el.querySelectorAll('.data-row').length).toBeGreaterThan(0);
        fixture.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <div style="height: 400px; display: flex; flex-direction: column">
            <p-table [value]="rows()" [lazy]="true" [scrollable]="true" scrollHeight="flex" [virtualScroll]="true" [virtualScrollItemSize]="40" [rows]="30" (onLazyLoad)="load($event)">
                <ng-template #body let-row>
                    <tr style="height: 40px" class="data-row">
                        <td>{{ row.name }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
class LazyVirtualGrowingComponent {
    // the total is unknown: the rows are appended as the user scrolls down
    rows = signal<any[]>([]);
    requests: TableLazyLoadEvent[] = [];

    load(event: TableLazyLoadEvent) {
        this.requests.push(event);
        const rows = this.rows();
        if ((event.last ?? 0) >= rows.length && rows.length < 300) {
            setTimeout(() => this.rows.set([...rows, ...Array.from({ length: 30 }, (_, i) => ({ id: rows.length + i, name: 'Name ' + (rows.length + i) }))]), 20);
        }
    }
}

describe('Table lazy virtual scroll with rows appended (optimus-ui#686)', () => {
    it('keeps the scroll position when the next rows are appended', async () => {
        const fixture = await mount(LazyVirtualGrowingComponent);
        await tick(100);
        await fixture.whenStable();
        const el = fixture.nativeElement as HTMLElement;
        const scroller = el.querySelector('.p-virtualscroller') as HTMLElement;
        expect(fixture.componentInstance.rows().length).toBeGreaterThan(0);

        for (let round = 0; round < 3; round++) {
            const length = fixture.componentInstance.rows().length;
            const requests = fixture.componentInstance.requests.length;
            const top = length * 40 - 400;
            scroller.scrollTop = top;
            scroller.dispatchEvent(new Event('scroll'));
            // the lazy scroll delay is 250ms
            await tick(500);
            await fixture.whenStable();
            await tick(50);

            expect(fixture.componentInstance.rows().length).toBeGreaterThan(length);
            expect(scroller.scrollTop).toBe(top);
            const names = Array.from(el.querySelectorAll('.data-row td')).map((td) => td.textContent!.trim());
            expect(names).toContain('Name ' + (length - 1));
            // the scroller initializes again with the new rows: it must not request the first page again
            const firsts = fixture.componentInstance.requests.slice(requests).map((request) => request.first);
            expect(firsts.length).toBeGreaterThan(0);
            expect(firsts).not.toContain(0);
        }
        fixture.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TableModule],
    template: `
        <p-table #dt [value]="rows" [scrollable]="true" [scrollHeight]="scrollHeight()" [virtualScroll]="true" [virtualScrollItemSize]="40" [globalFilterFields]="['name']">
            <ng-template #body let-row>
                <tr style="height: 40px" class="data-row">
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class VirtualDynamicHeightComponent {
    @ViewChild('dt') table!: Table;
    rows = makeRows(1000);
    scrollHeight = signal('300px');
}

describe('Table virtual scroll with a changed scroll height (optimus-ui#365)', () => {
    it('keeps the new scroll height after a filter is applied and cleared', async () => {
        const fixture = await mount(VirtualDynamicHeightComponent);
        await tick(50);
        await fixture.whenStable();
        const scroller = fixture.nativeElement.querySelector('.p-virtualscroller') as HTMLElement;
        const height = () => Math.round(scroller.getBoundingClientRect().height);
        expect(height()).toBe(300);

        fixture.componentInstance.scrollHeight.set('200px');
        await tick(50);
        await fixture.whenStable();
        expect(height()).toBe(200);

        fixture.componentInstance.table.filterGlobal('Name 999', 'contains');
        await tick(400);
        await fixture.whenStable();
        await tick(50);
        expect(height()).toBeLessThan(200);

        fixture.componentInstance.table.filterGlobal('', 'contains');
        await tick(400);
        await fixture.whenStable();
        await tick(50);
        expect(height()).toBe(200);
        fixture.nativeElement.remove();
    });
});
