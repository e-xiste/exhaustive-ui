import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'ngadd-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, RouterModule],
    template: `
        <app-docsectiontext>
            <p>The recommended way to add ExhaustiveUI to an Angular CLI workspace is a single command.</p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <p>The schematic asks which theme preset you want and then does the rest:</p>
            <ul class="leading-relaxed">
                <li>adds <i>&#64;exhaustive-ui/core</i> and <i>&#64;exhaustive-ui/themes</i> to your dependencies</li>
                <li>wires <i>provideExhaustive</i> into your root providers with the chosen preset, in <i>app.config.ts</i> or your root NgModule</li>
                <li>installs the packages</li>
            </ul>
            <p>Pass the preset up front to skip the prompt, or skip the install step if you want to run it yourself:</p>
            <app-code [code]="flagsCode" [hideToggleCode]="true"></app-code>
            <p>
                If the schematic cannot find a providers array to update it prints the three manual steps instead of guessing, so nothing in your workspace is rewritten unexpectedly. If it detects an existing <i>primeng</i> or
                <i>&#64;openng/optimus-ui</i> dependency it changes nothing and fails with an error rather than reporting success, and points you at the <i>migrate-from-primeng</i> or <i>migrate-from-optimus</i> schematic, described in the
                <a [routerLink]="'/migration/primeng'" class="doc-link">PrimeNG</a> and <a [routerLink]="'/migration/optimus'" class="doc-link">Optimus UI</a> migration guides. It does not run that schematic for you. The Angular CLI installs
                <i>&#64;exhaustive-ui/core</i> before the schematic runs, so the dependency stays in your <i>package.json</i> — the migration schematic needs it there.
            </p>
        </app-docsectiontext>
    `
})
export class NgAddDoc {
    code: Code = {
        command: `ng add @exhaustive-ui/core`
    };

    flagsCode: Code = {
        command: `# Choose the preset without the prompt — Aura, Lara, Material or Nora
ng add @exhaustive-ui/core --theme=Lara

# Wire everything up but do not run the package install
ng add @exhaustive-ui/core --skip-install

# Target a specific project in a multi-project workspace
ng add @exhaustive-ui/core --project=admin`
    };
}
