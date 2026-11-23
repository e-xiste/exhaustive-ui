import { Component } from '@angular/core';
import { KanbanColumn, KanbanModule } from '@exhaustive-ui/core/kanban';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface Task {
    id: number;
    title: string;
}

@Component({
    selector: 'collapsible-doc',
    standalone: true,
    imports: [KanbanModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                <i>collapsible</i> adds a button to the header of every column that folds it into a narrow strip with its title and its count. The board sets the <i>collapsed</i> property of the column and emits <i>onColumnToggle</i>; set
                <i>collapsed</i> in the columns to start with a folded column. A collapsed column does not take dropped cards, and the keyboard moves skip it.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-kanban [(columns)]="columns" dataKey="id" collapsible ariaLabel="Board with collapsible columns" />
        </div>
        <app-code></app-code>
    `
})
export class CollapsibleDoc {
    columns: KanbanColumn<Task>[] = [
        {
            id: 'backlog',
            title: 'Backlog',
            collapsed: true,
            items: [
                { id: 1, title: 'Offline mode' },
                { id: 2, title: 'Keyboard shortcuts' },
                { id: 3, title: 'Audit log' }
            ]
        },
        { id: 'todo', title: 'To do', items: [{ id: 4, title: 'Onboarding checklist' }] },
        { id: 'doing', title: 'In progress', items: [{ id: 5, title: 'Usage based billing' }] },
        { id: 'done', title: 'Done', items: [{ id: 6, title: 'Single sign-on' }] }
    ];
}
