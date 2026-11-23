import { AccessibilityDoc } from '@/doc/richtexteditor/accessibility-doc';
import { BasicDoc } from '@/doc/richtexteditor/basic-doc';
import { DisabledDoc } from '@/doc/richtexteditor/disabled-doc';
import { EditorVsDoc } from '@/doc/richtexteditor/editorvs-doc';
import { ExtensionsDoc } from '@/doc/richtexteditor/extensions-doc';
import { ImportDoc } from '@/doc/richtexteditor/import-doc';
import { InvalidDoc } from '@/doc/richtexteditor/invalid-doc';
import { JsonDoc } from '@/doc/richtexteditor/json-doc';
import { MaxLengthDoc } from '@/doc/richtexteditor/maxlength-doc';
import { ReactiveFormsDoc } from '@/doc/richtexteditor/reactiveforms-doc';
import { ReadOnlyDoc } from '@/doc/richtexteditor/readonly-doc';
import { SignalFormsDoc } from '@/doc/richtexteditor/signalforms-doc';
import { TemplateDoc } from '@/doc/richtexteditor/template-doc';
import { TemplateDrivenFormsDoc } from '@/doc/richtexteditor/templatedrivenforms-doc';
import { TiptapDoc } from '@/doc/richtexteditor/tiptap-doc';
import { ToolbarDoc } from '@/doc/richtexteditor/toolbar-doc';
import { PTComponent } from '@/doc/richtexteditor/pt/PTComponent';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    template: `<app-doc
        docTitle="Angular RichTextEditor Component - ExhaustiveUI"
        header="RichTextEditor"
        description="RichTextEditor is a rich text editor built on Tiptap and ProseMirror, with a themed toolbar that follows the WAI-ARIA toolbar pattern, inline link editing, HTML or JSON values and a character limit. It works with every kind of Angular form."
        [docs]="docs"
        [apiDocs]="['RichTextEditor']"
        [ptDocs]="ptComponent"
        themeDocs="richtexteditor"
    ></app-doc>`,
    standalone: true,
    imports: [AppDoc]
})
export class RichTextEditorDemo {
    ptComponent = PTComponent;
    docs = [
        { id: 'import', label: 'Import', component: ImportDoc },
        { id: 'tiptap', label: 'Tiptap', component: TiptapDoc },
        { id: 'editorvs', label: 'Editor vs RichTextEditor', component: EditorVsDoc },
        { id: 'basic', label: 'Basic', component: BasicDoc },
        { id: 'toolbar', label: 'Toolbar', component: ToolbarDoc },
        { id: 'json', label: 'JSON Output', component: JsonDoc },
        { id: 'maxlength', label: 'Character Limit', component: MaxLengthDoc },
        { id: 'readonly', label: 'ReadOnly', component: ReadOnlyDoc },
        { id: 'template', label: 'Template', component: TemplateDoc },
        { id: 'extensions', label: 'Extensions', component: ExtensionsDoc },
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
