import { Component } from '@angular/core';
import { KanbanColumn, KanbanModule } from '@exhaustive-ui/core/kanban';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface Task {
    id: number;
    title: string;
}

const tasks = (from: number, count: number, prefix: string): Task[] => Array.from({ length: count }, (_, i) => ({ id: from + i, title: `${prefix} ${i + 1}` }));

@Component({
    selector: 'scroll-doc',
    standalone: true,
    imports: [KanbanModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                When the columns do not fit, they shrink to their minimum width, then the board scrolls horizontally, with a thin scrollbar, and fades out the edges that hide columns. <i>scrollHeight</i> gives the board a height: the cards of each
                column then scroll under its header, which stays visible. While a card is dragged near an edge, the board and the column scroll. On small screens a column takes most of the width and the board snaps from a column to the next one.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-kanban [(columns)]="columns" dataKey="id" scrollHeight="24rem" ariaLabel="Scrollable board" />
        </div>
        <app-code></app-code>
    `
})
export class ScrollDoc {
    columns: KanbanColumn<Task>[] = [
        { id: 'backlog', title: 'Backlog', items: tasks(1, 12, 'Story') },
        { id: 'todo', title: 'To do', items: tasks(100, 6, 'Task') },
        { id: 'doing', title: 'In progress', items: tasks(200, 3, 'Feature') },
        { id: 'review', title: 'Review', items: tasks(300, 2, 'Change') },
        { id: 'qa', title: 'QA', items: tasks(400, 2, 'Test') },
        { id: 'done', title: 'Done', items: tasks(500, 9, 'Release') }
    ];
}
