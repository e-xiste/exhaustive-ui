import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'maxlength-doc',
    standalone: true,
    imports: [FormsModule, RichTextEditorModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                <i>maxLength</i> limits the number of characters of the text, the formatting is not counted. Typing stops at the limit and a longer paste is cut, while a longer value written by the form is kept. <i>showCount</i> displays the count
                under the editor, linked to the editable area with <i>aria-describedby</i>, and the limit is announced to screen readers once reached. <i>minHeight</i> and <i>maxHeight</i> size the editable area.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col gap-2">
            <label id="bio-label" class="font-medium">Short bio</label>
            <p-rich-text-editor [(ngModel)]="html" [maxLength]="160" [showCount]="true" [toolbar]="['bold', 'italic', 'link']" ariaLabelledBy="bio-label" minHeight="5rem" maxHeight="12rem" />
        </div>
        <app-code></app-code>
    `
})
export class MaxLengthDoc {
    html: string | null = '<p>Front-end developer who writes <strong>accessible</strong> Angular components.</p>';
}
