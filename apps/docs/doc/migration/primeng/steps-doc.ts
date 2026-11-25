import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'primeng-steps-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <ol class="leading-relaxed">
                <li>Update Angular to 22. PrimeNG v21 declares Angular 21 as its peer dependency, so the Angular CLI refuses the update while <i>primeng</i> is installed: pass <i>--force</i>. The next step removes <i>primeng</i>.</li>
                <li>
                    Install ExhaustiveUI and run the <i>migrate-from-primeng</i> schematic. It rewrites the workspace, then installs the new dependencies. While <i>primeng</i> is installed, npm refuses the Angular CDK 22 that ExhaustiveUI needs: pass
                    <i>--legacy-peer-deps</i> to this one install.
                </li>
                <li>Run the v22 migrations. The workspace did not go through <i>ng update</i>, so they are run explicitly, from the version before v22.</li>
                <li>Read both reports, fix the compiler errors, then build and run your tests.</li>
            </ol>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <p>The schematic takes two options: <i>--skip-install</i> leaves the install to you, and <i>--force</i> skips the PrimeNG version check.</p>
        </app-docsectiontext>
    `
})
export class PrimengStepsDoc {
    code: Code = {
        command: `ng update @angular/core@22 @angular/cli@22 --force
npm install @exhaustive-ui/core@22 --legacy-peer-deps
ng generate @exhaustive-ui/core:migrate-from-primeng
ng update @exhaustive-ui/core --migrate-only --from=3.0.0`
    };
}
