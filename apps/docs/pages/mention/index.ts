import { AccessibilityDoc } from '@/doc/mention/accessibility-doc';
import { AsyncDoc } from '@/doc/mention/async-doc';
import { BasicDoc } from '@/doc/mention/basic-doc';
import { DisabledDoc } from '@/doc/mention/disabled-doc';
import { FilledDoc } from '@/doc/mention/filled-doc';
import { ImportDoc } from '@/doc/mention/import-doc';
import { InvalidDoc } from '@/doc/mention/invalid-doc';
import { ReactiveFormsDoc } from '@/doc/mention/reactiveforms-doc';
import { SignalFormsDoc } from '@/doc/mention/signalforms-doc';
import { SingleLineDoc } from '@/doc/mention/singleline-doc';
import { SizesDoc } from '@/doc/mention/sizes-doc';
import { TemplateDoc } from '@/doc/mention/template-doc';
import { TemplateDrivenFormsDoc } from '@/doc/mention/templatedrivenforms-doc';
import { TriggersDoc } from '@/doc/mention/triggers-doc';
import { PTComponent } from '@/doc/mention/pt/PTComponent';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    template: `<app-doc
        docTitle="Angular Mention Component - ExhaustiveUI"
        header="Mention"
        description="Mention suggests users, tags or commands while a trigger such as @ or # is typed in a textarea or an input, and inserts the chosen suggestion in the text. Its value is plain text, and it works with every kind of Angular form."
        [docs]="docs"
        [apiDocs]="['Mention']"
        [ptDocs]="ptComponent"
        themeDocs="mention"
    ></app-doc>`,
    standalone: true,
    imports: [AppDoc]
})
export class MentionDemo {
    ptComponent = PTComponent;
    docs = [
        { id: 'import', label: 'Import', component: ImportDoc },
        { id: 'basic', label: 'Basic', component: BasicDoc },
        { id: 'triggers', label: 'Multiple Triggers', component: TriggersDoc },
        { id: 'template', label: 'Template', component: TemplateDoc },
        { id: 'async', label: 'Async Search', component: AsyncDoc },
        { id: 'singleline', label: 'Single Line', component: SingleLineDoc },
        { id: 'filled', label: 'Filled', component: FilledDoc },
        { id: 'sizes', label: 'Sizes', component: SizesDoc },
        { id: 'disabled', label: 'Disabled', component: DisabledDoc },
        { id: 'invalid', label: 'Invalid', component: InvalidDoc },
        {
            id: 'forms',
            label: 'Forms',
            children: [
                { id: 'templatedriven', label: 'Template Driven', component: TemplateDrivenFormsDoc },
                { id: 'reactive', label: 'Reactive Forms', component: ReactiveFormsDoc },
                { id: 'signalforms', label: 'Signal Forms', component: SignalFormsDoc }
            ]
        },
        { id: 'accessibility', label: 'Accessibility', component: AccessibilityDoc }
    ];
}
