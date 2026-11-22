import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'primeng-v22-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                After the switch, the application runs on ExhaustiveUI v22, which differs from PrimeNG v21 in ways the compiler and your tests will show. The <a [routerLink]="'/migration/v22'" class="doc-link">migration guide to v22</a>
                details each of them:
            </p>
            <ul class="leading-relaxed">
                <li>Inputs, two-way properties, outputs and queries are signals: code holding a component instance reads inputs with a call and writes two-way properties with <i>.set()</i>.</li>
                <li>Components use OnPush change detection, except Table, TreeTable and DynamicDialog: give them new arrays and objects, or signals, rather than mutating bound data.</li>
                <li>Deprecated and inactive inputs are removed or renamed, <i>styleClass</i> becomes <i>class</i> on most components; the v22 migrations rewrite these bindings and report the rest.</li>
                <li>Hundreds of bugs inherited from PrimeNG v21 are fixed, each with a regression test; a few of them change a visible behavior.</li>
            </ul>
        </app-docsectiontext>
    `
})
export class PrimengV22Doc {}
