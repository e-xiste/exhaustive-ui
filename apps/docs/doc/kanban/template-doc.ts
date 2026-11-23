import { Component } from '@angular/core';
import { AvatarModule } from '@exhaustive-ui/core/avatar';
import { KanbanColumn, KanbanModule } from '@exhaustive-ui/core/kanban';
import { TagModule } from '@exhaustive-ui/core/tag';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface Issue {
    id: string;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    tags: string[];
    assignee: { name: string; image: string };
}

@Component({
    selector: 'template-doc',
    standalone: true,
    imports: [KanbanModule, AvatarModule, TagModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                The <i>card</i> template replaces the content of a card and receives the card as the implicit variable, with its <i>column</i>, its <i>index</i> and a <i>grabbed</i> flag, true while the card is picked up with the keyboard. The
                <i>columnHeader</i> template replaces the title and the count of a column, <i>columnFooter</i> adds content at its bottom and <i>empty</i> replaces the message of an empty column; they receive the column, its <i>count</i>, its
                <i>limit</i> and an <i>overLimit</i> flag.
            </p>
            <p>A card is a button that picks up the card: keep the content of the template static, without links or buttons, and open the details of a card with <i>onCardClick</i>.</p>
        </app-docsectiontext>
        <div class="card">
            <p-kanban [(columns)]="columns" dataKey="id" ariaLabel="Issues">
                <ng-template #columnHeader let-column let-count="count">
                    <span class="w-2 h-2 rounded-full shrink-0" [style.background]="column.data.color" aria-hidden="true"></span>
                    <span class="font-semibold">{{ column.title }}</span>
                    <span class="ml-auto text-sm text-muted-color">{{ count }}</span>
                </ng-template>
                <ng-template #card let-issue>
                    <div class="flex flex-col gap-3">
                        <div class="flex items-center justify-between gap-2">
                            <span class="text-sm text-muted-color">{{ issue.id }}</span>
                            <p-tag [value]="issue.priority" [severity]="severity(issue.priority)" />
                        </div>
                        <span class="font-medium">{{ issue.title }}</span>
                        <div class="flex items-center justify-between gap-2">
                            <div class="flex flex-wrap gap-1">
                                @for (tag of issue.tags; track tag) {
                                    <span class="text-xs px-2 py-0.5 rounded-border bg-surface-100 dark:bg-surface-800">{{ tag }}</span>
                                }
                            </div>
                            <p-avatar [image]="issue.assignee.image" shape="circle" [ariaLabel]="issue.assignee.name" />
                        </div>
                    </div>
                </ng-template>
                <ng-template #empty>
                    <span>Drop an issue here</span>
                </ng-template>
            </p-kanban>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDoc {
    columns: KanbanColumn<Issue>[] = [
        {
            id: 'backlog',
            title: 'Backlog',
            data: { color: '#64748b' },
            items: [
                { id: 'EX-101', title: 'Export the report as CSV', priority: 'Low', tags: ['reports'], assignee: { name: 'Amy Elsner', image: 'https://exhaustive-ui.com/demo/avatar/amyelsner.png' } },
                { id: 'EX-102', title: 'Remember the last opened tab', priority: 'Medium', tags: ['ux'], assignee: { name: 'Asiya Javayant', image: 'https://exhaustive-ui.com/demo/avatar/asiyajavayant.png' } }
            ]
        },
        {
            id: 'doing',
            title: 'In progress',
            data: { color: '#2563eb' },
            items: [{ id: 'EX-98', title: 'Payment fails with 3-D Secure', priority: 'High', tags: ['bug', 'billing'], assignee: { name: 'Onyama Limba', image: 'https://exhaustive-ui.com/demo/avatar/onyamalimba.png' } }]
        },
        { id: 'review', title: 'Review', data: { color: '#9333ea' }, items: [] },
        {
            id: 'done',
            title: 'Done',
            data: { color: '#16a34a' },
            items: [{ id: 'EX-90', title: 'Upgrade to Angular 22', priority: 'Medium', tags: ['chore'], assignee: { name: 'Ioni Bowcher', image: 'https://exhaustive-ui.com/demo/avatar/ionibowcher.png' } }]
        }
    ];

    severity(priority: Issue['priority']) {
        return priority === 'High' ? 'danger' : priority === 'Medium' ? 'warn' : 'secondary';
    }
}
