import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'comparison-libraries-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <h3>PrimeNG</h3>
            <p>
                PrimeNG 22 and later are <a href="https://primeui.dev/nextchapter" target="_blank" rel="noopener noreferrer" class="doc-link">no longer released as open source</a>. A commercial license is perpetual, per developer, with a year of
                updates: $599 until 2026-12-31, then $799 (<a href="https://primeui.dev/pricing" target="_blank" rel="noopener noreferrer" class="doc-link">pricing</a>). The
                <a href="https://primeui.dev/licenses/community" target="_blank" rel="noopener noreferrer" class="doc-link">Community license</a> is free for individuals and students on their own projects, and for organizations with fewer than 5
                developers, fewer than 10 employees, less than $1M of annual revenue and no more than $3M of outside capital, public bodies and schools excluded. The versions up to 21 stay MIT and
                <a href="https://github.com/primefaces/primeng" target="_blank" rel="noopener noreferrer" class="doc-link">receive security fixes</a>.
            </p>
            <h3>Optimus UI</h3>
            <p>
                <a href="https://github.com/openng-org/optimus-ui" target="_blank" rel="noopener noreferrer" class="doc-link">Optimus UI</a> is the community fork of PrimeNG v21, and the project ExhaustiveUI comes from. It stays closer to PrimeNG's
                API, and moves its components to Signals one at a time.
            </p>
            <h3>Angular Material</h3>
            <p>
                <a href="https://material.angular.dev" target="_blank" rel="noopener noreferrer" class="doc-link">Angular Material</a> is made by the Angular team and follows Material Design. It has fewer components, and the strongest guarantee of
                following Angular.
            </p>
            <h3>ExhaustiveUI</h3>
            <p>
                80+ components under the MIT license, all on the Signals API, with majors that follow Angular's. It is a young project with one main maintainer and few users: that is its main risk. What limits it: the license lets anyone continue the
                code, every release is published from public CI with npm provenance, and the API stays close to PrimeNG's. The <a [routerLink]="'/philosophy'" class="doc-link">philosophy page</a> sets out what the project commits to.
            </p>
        </app-docsectiontext>
    `
})
export class ComparisonLibrariesDoc {}
