import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'disabled-doc',
    standalone: true,
    imports: [FormsModule, RichTextEditorModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>When <i>disabled</i> is present, the editor and its toolbar cannot be focused or changed.</p>
        </app-docsectiontext>
        <div class="card">
            <p-rich-text-editor [(ngModel)]="html" [disabled]="true" ariaLabel="Disabled editor" />
        </div>
        <app-code></app-code>
    `
})
export class DisabledDoc {
    html: string | null = '<p>This content is disabled.</p>';
}
