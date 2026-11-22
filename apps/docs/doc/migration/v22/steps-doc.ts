import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'v22-steps-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, RouterModule],
    template: `
        <app-docsectiontext>
            <h3>From an ExhaustiveUI alpha or release candidate</h3>
            <p>Update Angular, then ExhaustiveUI. Every installed <i>&#64;exhaustive-ui/*</i> package moves to 22.0.0 together, and the migrations run.</p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <h3>From PrimeNG v21</h3>
            <p>
                Update Angular to 22, install ExhaustiveUI and run the <i>migrate-from-primeng</i> schematic. It swaps the <i>primeng</i>, <i>&#64;primeuix/*</i> and PrimeIcons dependencies, rewrites the imports (<i>primeng/button</i> becomes
                <i>&#64;exhaustive-ui/core/button</i>) and renames the configuration API (<i>providePrimeNG</i> becomes <i>provideExhaustive</i>). The workspace did not go through <i>ng update</i>, so run the v22 migrations explicitly afterwards.
            </p>
            <app-code [code]="primengCode" [hideToggleCode]="true"></app-code>
            <p>
                Projects on PrimeNG v20 or older upgrade to PrimeNG v21 first; the schematic checks the version and refuses otherwise. The <a [routerLink]="'/migration/primeng'" class="doc-link">PrimeNG migration guide</a> details each step,
                including the <i>--force</i> the Angular update needs while <i>primeng</i> is installed.
            </p>
            <h3>From Optimus UI v2</h3>
            <p>
                Optimus UI v2 has the PrimeNG v21 API under other package names. The <i>migrate-from-optimus</i> schematic swaps its packages for their <i>&#64;exhaustive-ui/*</i> counterparts and renames the imports, the configuration API and the
                CSS layer; then run the v22 migrations explicitly. The <a [routerLink]="'/migration/optimus'" class="doc-link">Optimus UI migration guide</a> details each step.
            </p>
            <app-code [code]="migrateOnlyCode" [hideToggleCode]="true"></app-code>
            <h3>Then</h3>
            <ol class="leading-relaxed">
                <li>Read the report the migrations printed, see <i>Reviewing the report</i> below.</li>
                <li>Fix the TypeScript errors: most come from the Signals API and the removed TypeScript API.</li>
                <li>Check the screens that mutate data bound to a component, which no longer refresh under OnPush.</li>
                <li>Read the behavior changes, then build and run your tests.</li>
            </ol>
        </app-docsectiontext>
    `
})
export class V22StepsDoc {
    code: Code = {
        command: `ng update @angular/core@22 @angular/cli@22
ng update @exhaustive-ui/core@22`
    };

    primengCode: Code = {
        command: `ng update @angular/core@22 @angular/cli@22 --force
npm install @exhaustive-ui/core@22
ng generate @exhaustive-ui/core:migrate-from-primeng
ng update @exhaustive-ui/core --migrate-only --from=3.0.0`
    };

    migrateOnlyCode: Code = {
        command: `npm install @exhaustive-ui/core@22
ng generate @exhaustive-ui/core:migrate-from-optimus
ng update @exhaustive-ui/core --migrate-only --from=3.0.0`
    };
}
