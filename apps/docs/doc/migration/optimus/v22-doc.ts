import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'optimus-v22-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, RouterModule],
    template: `
        <app-docsectiontext>
            <p>After <i>migrate-from-optimus</i>, run the v22 migrations. The workspace did not go through <i>ng update</i>, so they are run explicitly, from the version before v22:</p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <p>
                They rewrite the templates and code for the inputs, outputs and templates removed or renamed in v22, and for the configuration options that became signals or changed name, such as <i>inputStyle</i>, now <i>inputVariant</i>. They
                report what they cannot rewrite. The <a [routerLink]="'/migration/v22'" class="doc-link">migration guide to v22</a> then covers the code changes: signal inputs, <i>model()</i> and signal queries in every component, OnPush change
                detection, and the behavior and type changes.
            </p>
        </app-docsectiontext>
    `
})
export class OptimusV22Doc {
    code: Code = {
        command: `ng update @exhaustive-ui/core --migrate-only --from=3.0.0`
    };
}
