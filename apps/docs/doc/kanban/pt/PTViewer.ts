import { AppDocPtViewer } from '@/components/doc/app.docptviewer';
import { getPTOptions } from '@/components/doc/app.docptviewer';
import { Component } from '@angular/core';
import { KanbanColumn, KanbanModule } from '@exhaustive-ui/core/kanban';

@Component({
    selector: 'kanban-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, KanbanModule],
    template: `
        <app-docptviewer [docs]="docs">
            <p-kanban class="w-full" [(columns)]="columns" dataKey="id" collapsible reorderColumns showAddButton ariaLabel="Pass through board" />
        </app-docptviewer>
    `
})
export class PTViewer {
    columns: KanbanColumn[] = [
        { id: 'todo', title: 'To do', items: [{ id: 1, title: 'Write the tests' }] },
        { id: 'doing', title: 'In progress', limit: 2, items: [{ id: 2, title: 'Review the design' }] },
        { id: 'done', title: 'Done', items: [] }
    ];

    docs = [{ data: getPTOptions('Kanban'), key: 'Kanban' }];
}
