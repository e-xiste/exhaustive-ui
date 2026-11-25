import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    selector: 'markdownextension-doc',
    standalone: true,
    imports: [AppDocSectionText, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>
                Add <code>.md</code> to the address of a page to read its Markdown version: <code>/button.md</code>, <code>/migration/primeng.md</code>. Clients that ask for Markdown with the <code>Accept: text/markdown</code> header, as several
                coding agents do, receive it at the normal address, and the HTML pages link to it with <code>rel="alternate"</code>.
            </p>
            <a href="/button.md" target="_blank">
                <p-button label="Open /button.md" />
            </a>
        </app-docsectiontext>
    `
})
export class MarkdownExtensionDoc {}
