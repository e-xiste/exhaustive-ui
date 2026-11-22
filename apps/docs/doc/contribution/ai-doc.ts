import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'ai-contributions-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Contributions written with AI coding agents are welcome, on the same terms as any other: the pull request is yours. You understand the change and can answer questions about it in review, it is scoped to one problem, and it comes with
                tests that fail without the fix. The repository ships what agents need: the <i>&#64;exhaustive-ui/mcp</i> server, the <i>exhaustive-ui</i> agent skill and the LLM docs, generated from this site.
            </p>
        </app-docsectiontext>
    `
})
export class AiContributionsDoc {}
