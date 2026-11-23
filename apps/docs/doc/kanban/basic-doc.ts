import { Component } from '@angular/core';
import { KanbanColumn, KanbanModule } from '@exhaustive-ui/core/kanban';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface Task {
    id: number;
    title: string;
}

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [KanbanModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Kanban displays <i>columns</i>, each with an <i>id</i>, a <i>title</i> and its <i>items</i>. Drag a card to reorder it in its column or to move it to another column, with the mouse, a finger or the keyboard. The board updates
                <i>columns</i> with new arrays after every move, so bind it two-way with <i>[(columns)]</i>. <i>dataKey</i> names the field that identifies a card, and <i>itemLabel</i> the field displayed by the default card, <i>title</i> by default.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-kanban [(columns)]="columns" dataKey="id" ariaLabel="Basic board" />
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    columns: KanbanColumn<Task>[] = [
        {
            id: 'todo',
            title: 'To do',
            items: [
                { id: 1, title: 'Write the release notes' },
                { id: 2, title: 'Update the screenshots' },
                { id: 3, title: 'Answer the support tickets' }
            ]
        },
        {
            id: 'doing',
            title: 'In progress',
            items: [
                { id: 4, title: 'Fix the login redirect' },
                { id: 5, title: 'Translate the onboarding' }
            ]
        },
        { id: 'review', title: 'Review', items: [{ id: 6, title: 'Dark mode for the settings page' }] },
        { id: 'done', title: 'Done', items: [{ id: 7, title: 'Set up the staging server' }] }
    ];
}
