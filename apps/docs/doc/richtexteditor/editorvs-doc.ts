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
                <a routerLink="/richtexteditor" class="doc-link">RichTextEditor</a> is built on Tiptap and ProseMirror and adds what Editor does not have: a toolbar that follows the WAI-ARIA toolbar pattern, with a single tab stop and the arrow keys,
                links edited in an inline panel that checks the URL, a value in HTML or in Tiptap JSON, a character limit with a count, and Tiptap extensions for your own content. Prefer RichTextEditor for new forms. Both values are HTML, but Quill
                and Tiptap do not write the same markup, lists for example, so check the stored content before moving an existing field from one to the other.
            </p>
        </app-docsectiontext>
    `
})
export class EditorVsDoc {}
