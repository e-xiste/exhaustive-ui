import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'invalid-doc',
    standalone: true,
    imports: [FormsModule, RichTextEditorModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>The invalid state is applied with the <i>invalid</i> property, which also sets <i>aria-invalid</i> on the editable area.</p>
        </app-docsectiontext>
        <div class="card">
            <p-rich-text-editor [(ngModel)]="html" [invalid]="!html" ariaLabel="Comment" placeholder="A comment is required" minHeight="5rem" />
        </div>
        <app-code></app-code>
    `
})
export class InvalidDoc {
    html: string | null = null;
}
