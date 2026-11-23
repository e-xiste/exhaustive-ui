import { Component } from '@angular/core';
import { KanbanAddCardEvent, KanbanColumn, KanbanModule } from '@exhaustive-ui/core/kanban';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface Task {
    id: number;
    title: string;
}

@Component({
    selector: 'addcard-doc',
    standalone: true,
    imports: [KanbanModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                <i>showAddButton</i> adds an "Add card" button at the bottom of every column. It emits <i>onAddCard</i> with the column, and the application creates the card, often after a dialog; set the new columns to display it. The button is
                disabled in a disabled column and in a column that reached its limit.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-kanban [(columns)]="columns" dataKey="id" showAddButton (onAddCard)="addCard($event)" ariaLabel="Board with add buttons" />
        </div>
        <app-code></app-code>
    `
})
export class AddCardDoc {
    nextId = 4;

    columns: KanbanColumn<Task>[] = [
        { id: 'ideas', title: 'Ideas', items: [{ id: 1, title: 'A mobile app' }] },
        {
            id: 'planned',
            title: 'Planned',
            limit: 2,
            items: [
                { id: 2, title: 'Two-factor authentication' },
                { id: 3, title: 'Public API' }
            ]
        },
        { id: 'shipped', title: 'Shipped', items: [] }
    ];

    addCard({ column }: KanbanAddCardEvent<Task>) {
        const card = { id: this.nextId, title: `New card ${this.nextId++}` };
        this.columns = this.columns.map((c) => (c.id === column.id ? { ...c, items: [...c.items, card] } : c));
    }
}
