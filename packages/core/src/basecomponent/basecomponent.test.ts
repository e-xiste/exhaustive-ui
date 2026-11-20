import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import { TableModule } from '@exhaustive-ui/core/table';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TableModule],
    template: `
        <p-table [value]="rows">
            <ng-template #body let-row>
                <tr>
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class TestGlobalPTTableComponent {
    rows = [{ name: 'Row 1' }];
}

describe('BaseComponent global PassThrough', () => {
    it('applies the global table PT to the Table sections (optimus-ui#25)', async () => {
        TestBed.configureTestingModule({
            imports: [TestGlobalPTTableComponent],
            providers: [provideZonelessChangeDetection(), provideExhaustive({ pt: { table: { tableContainer: { style: { border: '3px solid red' } }, table: { 'data-test': 'table' } } } })]
        });
        const fixture = TestBed.createComponent(TestGlobalPTTableComponent);
        await fixture.whenStable();

        const container = fixture.nativeElement.querySelector('.p-datatable-table-container') as HTMLElement;
        const table = fixture.nativeElement.querySelector('table') as HTMLTableElement;

        expect(container.style.border).toBe('3px solid red');
        expect(table.hasAttribute('tablecontainer')).toBe(false);
        expect(table.getAttribute('data-test')).toBe('table');
    });
});
