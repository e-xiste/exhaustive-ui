import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'editorvs-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterLink],
    template: `
        <app-docsectiontext>
            <p>
                ExhaustiveUI has two rich text editors. <a routerLink="/editor" class="doc-link">Editor</a> wraps Quill and stays available unchanged for the applications that use it.
                <a routerLink="/richtexteditor" class="doc-link">RichTextEditor</a> is the newer one, built on Tiptap and ProseMirror, which are actively maintained: its toolbar is themed with the design tokens and follows the WAI-ARIA toolbar
                pattern, links are edited in an inline panel, the value can be HTML or JSON, a character limit is built in, and Tiptap extensions can be added. Prefer RichTextEditor for new forms.
            </p>
        </app-docsectiontext>
    `
})
export class EditorVsDoc {}
