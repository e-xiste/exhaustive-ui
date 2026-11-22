import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'optimus-packages-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <ol class="leading-relaxed">
                <li>Install ExhaustiveUI and run the <i>migrate-from-optimus</i> schematic. It rewrites the workspace, then installs the new dependencies.</li>
                <li>Run the v22 migrations. The workspace did not go through <i>ng update</i>, so they are run explicitly, from the version before v22.</li>
                <li>Read both reports, fix the compiler errors, then build and run your tests.</li>
            </ol>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <p>
                The schematic checks that <i>&#64;openng/optimus-ui</i> v2 is installed. It takes two options: <i>--skip-install</i> leaves the install to you, and <i>--force</i> skips the version check. Like <i>ng update</i>, run it on a clean
                working tree so its changes can be reviewed with <i>git diff</i>.
            </p>
        </app-docsectiontext>
    `
})
export class OptimusPackagesDoc {
    code: Code = {
        command: `npm install @exhaustive-ui/core@22
ng generate @exhaustive-ui/core:migrate-from-optimus
ng update @exhaustive-ui/core --migrate-only --from=3.0.0`
    };
}
