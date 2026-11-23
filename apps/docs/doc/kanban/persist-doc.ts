import { Component } from '@angular/core';
import { KanbanCardMoveEvent, KanbanColumn, KanbanModule } from '@exhaustive-ui/core/kanban';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';

interface Task {
    id: number;
    title: string;
}

@Component({
    selector: 'persist-doc',
    standalone: true,
    imports: [KanbanModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                <i>onCardMove</i> is emitted once a card is dropped, with the pointer or the keyboard, after the columns are updated. It holds the <i>item</i>, the <i>fromColumn</i> and <i>toColumn</i> as they are after the move, the
                <i>fromIndex</i> and <i>toIndex</i>, and all the <i>columns</i>: send the change to the server from there. A keyboard move only emits when the card is dropped, not at every arrow key, and Escape emits nothing.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-kanban [(columns)]="columns" dataKey="id" (onCardMove)="onCardMove($event)" ariaLabel="Board that saves its moves" />
            <ul class="mt-4 mb-0 text-sm text-muted-color list-none p-0" aria-label="Saved moves">
                @for (line of log; track $index) {
                    <li>{{ line }}</li>
                } @empty {
                    <li>Move a card to see the request.</li>
                }
            </ul>
        </div>
        <app-code></app-code>
        <app-docsectiontext>
            <p>With a server, keep the previous columns to put the card back when the request fails.</p>
        </app-docsectiontext>
        <app-code [code]="serverCode" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
    `
})
export class PersistDoc {
    columns: KanbanColumn<Task>[] = [
        {
            id: 'todo',
            title: 'To do',
            items: [
                { id: 1, title: 'Order the new laptops' },
                { id: 2, title: 'Book the team offsite' }
            ]
        },
        { id: 'doing', title: 'In progress', items: [{ id: 3, title: 'Hire a designer' }] },
        { id: 'done', title: 'Done', items: [] }
    ];

    log: string[] = [];

    onCardMove(event: KanbanCardMoveEvent<Task>) {
        this.log = [`PATCH /api/tasks/${event.item.id} { "status": "${event.toColumn.id}", "position": ${event.toIndex} }`, ...this.log].slice(0, 4);
    }

    serverCode: Code = {
        typescript: `private http = inject(HttpClient);

columns = signal<KanbanColumn<Task>[]>(columnsFromTheServer);
private saved = this.columns();

onCardMove({ item, toColumn, toIndex, columns }: KanbanCardMoveEvent<Task>) {
    const previous = this.saved;
    this.http.patch(\`/api/tasks/\${item.id}\`, { status: toColumn.id, position: toIndex }).subscribe({
        next: () => (this.saved = columns),
        error: () => this.columns.set(previous)
    });
}`,
        html: `<p-kanban [(columns)]="columns" dataKey="id" (onCardMove)="onCardMove($event)" />`
    };
}
