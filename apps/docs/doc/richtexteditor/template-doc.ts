import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'template-doc',
    standalone: true,
    imports: [FormsModule, RichTextEditorModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                The <i>toolbar</i> template replaces the whole toolbar. It receives the Tiptap <i>editor</i>, undefined while Tiptap loads, an <i>isActive</i> function, the <i>disabled</i> state and <i>openLink</i> to open the link panel. Use the
                Tiptap commands, such as <i>editor.chain().focus().toggleBold().run()</i>. A custom toolbar takes care of its own keyboard support.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-rich-text-editor [(ngModel)]="html" ariaLabel="Message">
                <ng-template #toolbar let-editor let-isActive="isActive" let-disabled="disabled" let-openLink="openLink">
                    <div class="flex gap-2 flex-wrap">
                        <button pButton type="button" size="small" [outlined]="!isActive('bold')" [attr.aria-pressed]="isActive('bold')" [disabled]="disabled" (click)="editor?.chain().focus().toggleBold().run()">
                            <span pButtonLabel>Bold</span>
                        </button>
                        <button pButton type="button" size="small" [outlined]="!isActive('blockquote')" [attr.aria-pressed]="isActive('blockquote')" [disabled]="disabled" (click)="editor?.chain().focus().toggleBlockquote().run()">
                            <span pButtonLabel>Quote</span>
                        </button>
                        <button pButton type="button" size="small" [outlined]="true" [disabled]="disabled" (click)="openLink()"><span pButtonLabel>Link</span></button>
                    </div>
                </ng-template>
            </p-rich-text-editor>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDoc {
    html: string | null = '<p>A toolbar made of ExhaustiveUI buttons.</p>';
}
