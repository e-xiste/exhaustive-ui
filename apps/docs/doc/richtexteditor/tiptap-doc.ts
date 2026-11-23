import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'tiptap-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                RichTextEditor is built on <a href="https://tiptap.dev" target="_blank" rel="noopener noreferrer" class="doc-link">Tiptap</a> and ProseMirror. Install the four open source Tiptap packages it uses, all MIT licensed; no Tiptap account,
                key or paid extension is needed. They are optional peer dependencies of ExhaustiveUI, so only the applications that use RichTextEditor install them. Tiptap is loaded in the browser only, on first use: during server-side rendering the
                component renders an empty placeholder.
            </p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class TiptapDoc {
    code: Code = {
        command: `npm install @tiptap/core @tiptap/pm @tiptap/starter-kit @tiptap/extension-text-align`
    };
}
