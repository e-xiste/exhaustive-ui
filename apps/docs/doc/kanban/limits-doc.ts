import { Component } from '@angular/core';
import { KanbanCanDrop, KanbanColumn, KanbanModule } from '@exhaustive-ui/core/kanban';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface Task {
    id: number;
    title: string;
}

@Component({
    selector: 'limits-doc',
    standalone: true,
    imports: [KanbanModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                The <i>limit</i> of a column is its work in progress limit: the header shows the count as "2 / 3", the count turns orange when the column is full and red when it holds more cards than its limit, and the column refuses the cards
                dropped beyond it. While a card is dragged over a column that refuses it, the column gets a dashed red border and screen readers hear the reason. A <i>disabled</i> column neither gives nor takes cards.
            </p>
            <p>
                <i>canDrop</i> decides any other rule. It receives the card, the column it comes from and the column it would go to, and returns false to refuse the move; moves within a column are always allowed. Here a card can only reach
                <i>Done</i> from <i>Review</i>, and the <i>Archived</i> column is disabled.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-kanban [(columns)]="columns" dataKey="id" [canDrop]="canDrop" ariaLabel="Board with limits" />
        </div>
        <app-code></app-code>
    `
})
export class LimitsDoc {
    columns: KanbanColumn<Task>[] = [
        {
            id: 'todo',
            title: 'To do',
            items: [
                { id: 1, title: 'Plan the sprint' },
                { id: 2, title: 'Interview a customer' },
                { id: 3, title: 'Clean the backlog' }
            ]
        },
        {
            id: 'doing',
            title: 'In progress',
            limit: 3,
            items: [
                { id: 4, title: 'New pricing page' },
                { id: 5, title: 'Invoice emails' }
            ]
        },
        { id: 'review', title: 'Review', limit: 1, items: [{ id: 6, title: 'Search filters' }] },
        { id: 'done', title: 'Done', items: [] },
        { id: 'archived', title: 'Archived', disabled: true, items: [{ id: 7, title: 'Old landing page' }] }
    ];

    canDrop: KanbanCanDrop<Task> = (item, from, to) => to.id !== 'done' || from.id === 'review';
}
