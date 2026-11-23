import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorInitEvent, RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { Editor, Mark, mergeAttributes } from '@tiptap/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

/**
 * A mark that renders <mark>, toggled with Ctrl+Shift+H.
 */
const Highlight = Mark.create({
    name: 'highlight',
    parseHTML: () => [{ tag: 'mark' }],
    renderHTML: ({ HTMLAttributes }) => ['mark', mergeAttributes(HTMLAttributes), 0],
    addKeyboardShortcuts() {
        return { 'Mod-Shift-h': () => this.editor.commands.toggleMark(this.name) };
    }
});

@Component({
    selector: 'extensions-doc',
    standalone: true,
    imports: [FormsModule, RichTextEditorModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                <i>extensions</i> adds Tiptap extensions to the StarterKit, the text alignment and the link support that the component already includes: your own nodes, marks and shortcuts, or any of the open source Tiptap extensions. The
                <i>onInit</i> event gives the Tiptap editor once it is created, to run commands from your own buttons. This example adds a highlight mark, toggled with <i>Ctrl+Shift+H</i> or the button.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col gap-4">
            <p-rich-text-editor [(ngModel)]="html" [extensions]="extensions" (onInit)="onInit($event)" ariaLabel="Notes" />
            <p-button label="Highlight the selection" severity="secondary" size="small" class="self-start" [disabled]="!editor()" (onClick)="toggleHighlight()" />
        </div>
        <app-code></app-code>
    `
})
export class ExtensionsDoc {
    extensions = [Highlight];

    editor = signal<Editor | undefined>(undefined);

    html: string | null = '<p>Select some words, then press <mark>Ctrl+Shift+H</mark> to highlight them.</p>';

    onInit(event: RichTextEditorInitEvent<Editor>) {
        this.editor.set(event.editor);
    }

    toggleHighlight() {
        this.editor()?.chain().focus().toggleMark('highlight').run();
    }
}
