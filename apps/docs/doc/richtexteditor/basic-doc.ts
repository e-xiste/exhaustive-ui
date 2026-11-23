import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [FormsModule, RichTextEditorModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                RichTextEditor is bound with <i>ngModel</i> and its value is an HTML string, or null when the editor is empty. The usual shortcuts work: <i>Ctrl+B</i> for bold, <i>Ctrl+I</i> for italic, <i>Ctrl+K</i> for a link, and Markdown
                shortcuts such as <i>#</i> for a heading or <i>-</i> for a list. Label the editable area with <i>ariaLabelledBy</i> or <i>ariaLabel</i>.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col gap-2">
            <label id="basic-label" class="font-medium">Description</label>
            <p-rich-text-editor [(ngModel)]="html" ariaLabelledBy="basic-label" placeholder="Describe the product" />
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    html: string | null =
        '<h2>Release notes</h2><p>The editor supports <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strikethrough</s>, <code>inline code</code> and <a href="https://exhaustive-ui.com">links</a>.</p><ul><li><p>Bullet lists</p></li><li><p>and numbered lists</p></li></ul><blockquote><p>Quotes stand out from the text.</p></blockquote>';
}
