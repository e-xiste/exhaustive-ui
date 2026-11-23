import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule, RichTextEditorToolbar } from '@exhaustive-ui/core/richtexteditor';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'toolbar-doc',
    standalone: true,
    imports: [FormsModule, RichTextEditorModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                The <i>toolbar</i> input lists the buttons in order, and <i>'|'</i> separates two groups. The buttons are <i>bold</i>, <i>italic</i>, <i>underline</i>, <i>strike</i>, <i>code</i>, <i>heading1</i>, <i>heading2</i>, <i>heading3</i>,
                <i>bulletList</i>, <i>orderedList</i>, <i>blockquote</i>, <i>codeBlock</i>, <i>link</i>, <i>alignLeft</i>, <i>alignCenter</i>, <i>alignRight</i>, <i>alignJustify</i>, <i>undo</i>, <i>redo</i> and <i>clear</i>; <i>textAlign</i> adds
                the four alignments. An empty array hides the toolbar, the shortcuts keep working.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col gap-2">
            <label id="toolbar-label" class="font-medium">Announcement</label>
            <p-rich-text-editor [(ngModel)]="html" [toolbar]="toolbar" ariaLabelledBy="toolbar-label" />
        </div>
        <app-code></app-code>
    `
})
export class ToolbarDoc {
    toolbar: RichTextEditorToolbar = ['heading2', 'heading3', '|', 'bold', 'italic', 'code', '|', 'textAlign', '|', 'bulletList', 'codeBlock', '|', 'clear'];

    html: string | null = '<h2 style="text-align: center">A centered title</h2><p>Select text and use the toolbar: the alignment buttons apply to headings and paragraphs.</p>';
}
