import { Component } from '@angular/core';
import { KanbanColumn, KanbanColumnReorderEvent, KanbanModule } from '@exhaustive-ui/core/kanban';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface Task {
    id: number;
    title: string;
}

@Component({
    selector: 'reordercolumns-doc',
    standalone: true,
    imports: [KanbanModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                <i>reorderColumns</i> adds a drag handle to the header of every column. Drag it to move the column, or focus it and use Space or Enter, the left and right arrow keys, and Space or Enter again. The board emits
                <i>onColumnReorder</i> with the column, its previous and its new index once the columns are updated.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-kanban [(columns)]="columns" dataKey="id" reorderColumns (onColumnReorder)="onReorder($event)" ariaLabel="Board with reorderable columns" />
            <p class="mt-4 mb-0 text-sm text-muted-color">Order: {{ order }}</p>
        </div>
        <app-code></app-code>
    `
})
export class ReorderColumnsDoc {
    columns: KanbanColumn<Task>[] = [
        { id: 'todo', title: 'To do', items: [{ id: 1, title: 'Draft the newsletter' }] },
        { id: 'doing', title: 'In progress', items: [{ id: 2, title: 'Record the demo video' }] },
        { id: 'blocked', title: 'Blocked', items: [{ id: 3, title: 'Legal review of the terms' }] },
        { id: 'done', title: 'Done', items: [] }
    ];

    order = this.columns.map((column) => column.title).join(', ');

    onReorder(event: KanbanColumnReorderEvent<Task>) {
        this.order = event.columns.map((column) => column.title).join(', ');
    }
}
