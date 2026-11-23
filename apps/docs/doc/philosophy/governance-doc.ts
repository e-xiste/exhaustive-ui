import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'philosophy-governance-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                Everything happens in the open, in the <a href="https://github.com/e-xiste/exhaustive-ui" target="_blank" rel="noopener noreferrer">repository</a>. There is no private roadmap and no internal issue tracker. What you see in the issues,
                the discussions and the <a [routerLink]="'/roadmap'" class="doc-link">roadmap</a> is the whole plan.
            </p>
            <p>
                Today the project has a single maintainer, who reviews and merges every change and cuts the releases. Pull requests are welcome from anyone; the <a [routerLink]="'/contribution'" class="doc-link">contribution guide</a> explains how to
                send one. If regular contributors appear, we would rather share merge rights with them than route everything through one person.
            </p>
            <p>
                Versions follow Angular: ExhaustiveUI 22 targets Angular 22. Breaking changes are avoided within a major and come with an <i>ng update</i> migration when a major requires them. The names we inherited that no longer fit, the package
                scope, the CSS cascade layer and the icon library, were changed once, in 22.0, with the <a [routerLink]="'/migration/primeng'" class="doc-link">PrimeNG</a> and
                <a [routerLink]="'/migration/optimus'" class="doc-link">Optimus UI</a> migration schematics, rather than dripping renames across releases.
            </p>
        </app-docsectiontext>
    `
})
export class PhilosophyGovernanceDoc {}
