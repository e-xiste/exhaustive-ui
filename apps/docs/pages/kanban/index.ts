import { AccessibilityDoc } from '@/doc/kanban/accessibility-doc';
import { AddCardDoc } from '@/doc/kanban/addcard-doc';
import { BasicDoc } from '@/doc/kanban/basic-doc';
import { CollapsibleDoc } from '@/doc/kanban/collapsible-doc';
import { ImportDoc } from '@/doc/kanban/import-doc';
import { LimitsDoc } from '@/doc/kanban/limits-doc';
import { PersistDoc } from '@/doc/kanban/persist-doc';
import { ReorderColumnsDoc } from '@/doc/kanban/reordercolumns-doc';
import { ScrollDoc } from '@/doc/kanban/scroll-doc';
import { TemplateDoc } from '@/doc/kanban/template-doc';
import { PTComponent } from '@/doc/kanban/pt/PTComponent';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    template: `<app-doc
        docTitle="Angular Kanban Component - ExhaustiveUI"
        header="Kanban"
        description="Kanban is a task board. Cards are dragged within a column and from a column to another one, with the mouse, a finger or the keyboard, with work in progress limits, drop rules, collapsible and reorderable columns, and every move announced to screen readers."
        [docs]="docs"
        [apiDocs]="['Kanban']"
        [ptDocs]="ptComponent"
        themeDocs="kanban"
    ></app-doc>`,
    standalone: true,
    imports: [AppDoc]
})
export class KanbanDemo {
    ptComponent = PTComponent;
    docs = [
        { id: 'import', label: 'Import', component: ImportDoc },
        { id: 'basic', label: 'Basic', component: BasicDoc },
        { id: 'template', label: 'Template', component: TemplateDoc },
        { id: 'limits', label: 'Limits and Rules', component: LimitsDoc },
        { id: 'addcard', label: 'Add Card', component: AddCardDoc },
        { id: 'collapsible', label: 'Collapsible Columns', component: CollapsibleDoc },
        { id: 'reordercolumns', label: 'Column Reorder', component: ReorderColumnsDoc },
        { id: 'scroll', label: 'Scroll', component: ScrollDoc },
        { id: 'persist', label: 'Saving Moves', component: PersistDoc },
        { id: 'accessibility', label: 'Accessibility', component: AccessibilityDoc }
    ];
}
