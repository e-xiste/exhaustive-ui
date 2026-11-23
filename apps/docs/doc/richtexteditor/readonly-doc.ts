import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'readonly-doc',
    standalone: true,
    imports: [FormsModule, RichTextEditorModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>When <i>readonly</i> is present, the content can be read, selected and copied but not changed. The toolbar is hidden and the editable area stays focusable for screen readers.</p>
        </app-docsectiontext>
        <div class="card">
            <p-rich-text-editor [(ngModel)]="html" [readonly]="true" ariaLabel="Terms of service" />
        </div>
        <app-code></app-code>
    `
})
export class ReadOnlyDoc {
    html: string | null = '<h3>Terms of service</h3><p>By using the service you agree to these terms. They can be <strong>read and copied</strong> but not edited.</p>';
}
