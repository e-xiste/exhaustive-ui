import { DeferredDemo } from '@/components/demo/deferreddemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { NodeService } from '@/service/nodeservice';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeNode } from '@exhaustive-ui/core/api';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { TreeTableModule } from '@exhaustive-ui/core/treetable';

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'edit-doc',
    standalone: true,
    imports: [FormsModule, TreeTableModule, InputTextModule, DeferredDemo, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Cell editing is enabled by adding the <i>ttEditableColumn</i> directive to a cell and defining the <i>input</i> and <i>output</i> templates of a <i>p-tree-table-cell-editor</i> in it. Clicking the cell displays the input, the enter
                and escape keys or a click outside close it.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-deferred-demo (load)="loadDemoData()">
                <p-tree-table [value]="files" [columns]="cols" [scrollable]="true" [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template #header let-columns>
                        <tr>
                            @for (col of columns; track col) {
                                <th>{{ col.header }}</th>
                            }
                        </tr>
                    </ng-template>
                    <ng-template #body let-rowNode let-rowData="rowData" let-columns="columns">
                        <tr [ttRow]="rowNode">
                            @for (col of columns; let first = $first; track col) {
                                <td [ttEditableColumn]="rowData" [ttEditableColumnField]="col.field" [ttEditableColumnDisabled]="first">
                                    @if (first) {
                                        <div class="flex items-center gap-2">
                                            <p-tree-table-toggler [rowNode]="rowNode" />
                                            <span>{{ rowData[col.field] }}</span>
                                        </div>
                                    } @else {
                                        <p-tree-table-cell-editor>
                                            <ng-template #input>
                                                <input pInputText type="text" [(ngModel)]="rowData[col.field]" [attr.aria-label]="col.header" class="w-full" />
                                            </ng-template>
                                            <ng-template #output>{{ rowData[col.field] }}</ng-template>
                                        </p-tree-table-cell-editor>
                                    }
                                </td>
                            }
                        </tr>
                    </ng-template>
                </p-tree-table>
            </p-deferred-demo>
        </div>
        <app-code></app-code>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditDoc {
    files!: TreeNode[];

    cols!: Column[];

    constructor(private nodeService: NodeService) {}

    loadDemoData() {
        this.nodeService.getFilesystem().then((files) => (this.files = files));

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'size', header: 'Size' },
            { field: 'type', header: 'Type' }
        ];
    }
}
