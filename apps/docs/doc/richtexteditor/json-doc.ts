import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'json-doc',
    standalone: true,
    imports: [FormsModule, JsonPipe, RichTextEditorModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                With <i>format="json"</i> the value is the JSON document of Tiptap instead of HTML. It is easier to store, to validate and to render on another platform, and it keeps every attribute of the content. The <i>onTextChange</i> event gives
                the HTML, the plain text and the JSON whatever the format.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col gap-4">
            <p-rich-text-editor [(ngModel)]="doc" format="json" [toolbar]="['bold', 'italic', '|', 'bulletList', 'orderedList']" ariaLabel="Checklist" />
            <pre class="m-0 p-4 rounded-border bg-surface-100 dark:bg-surface-800 text-sm overflow-auto max-h-64" tabindex="0" aria-label="JSON value">{{ doc | json }}</pre>
        </div>
        <app-code></app-code>
    `
})
export class JsonDoc {
    doc: Record<string, any> | null = {
        type: 'doc',
        content: [
            { type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Before the release' }] },
            {
                type: 'orderedList',
                attrs: { start: 1 },
                content: [
                    { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Run the tests' }] }] },
                    { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Update the changelog' }] }] }
                ]
            }
        ]
    };
}
