import { AccessibilityDoc } from '@/doc/scheduler/accessibility-doc';
import { BasicDoc } from '@/doc/scheduler/basic-doc';
import { EditableDoc } from '@/doc/scheduler/editable-doc';
import { ImportDoc } from '@/doc/scheduler/import-doc';
import { LazyDoc } from '@/doc/scheduler/lazy-doc';
import { LocaleDoc } from '@/doc/scheduler/locale-doc';
import { TemplateDoc } from '@/doc/scheduler/template-doc';
import { ViewsDoc } from '@/doc/scheduler/views-doc';
import { PTComponent } from '@/doc/scheduler/pt/PTComponent';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    template: `<app-doc
        docTitle="Angular Scheduler Component - ExhaustiveUI"
        header="Scheduler"
        description="Scheduler is a free event calendar with month, week, day and agenda views. Events are moved and resized by drag and drop or with the keyboard, and the visible range can be loaded lazily. It has no calendar library dependency."
        [docs]="docs"
        [apiDocs]="['Scheduler']"
        [ptDocs]="ptComponent"
        themeDocs="scheduler"
    ></app-doc>`,
    standalone: true,
    imports: [AppDoc]
})
export class SchedulerDemo {
    ptComponent = PTComponent;
    docs = [
        { id: 'import', label: 'Import', component: ImportDoc },
        { id: 'basic', label: 'Basic', component: BasicDoc },
        { id: 'views', label: 'Week and Day', component: ViewsDoc },
        { id: 'editable', label: 'Drag and Resize', component: EditableDoc },
        { id: 'lazy', label: 'Lazy Loading', component: LazyDoc },
        { id: 'template', label: 'Template', component: TemplateDoc },
        { id: 'locale', label: 'Locale', component: LocaleDoc },
        { id: 'accessibility', label: 'Accessibility', component: AccessibilityDoc }
    ];
}
