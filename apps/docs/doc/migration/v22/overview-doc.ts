import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'v22-overview-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                ExhaustiveUI v22 requires Angular 22 and moves every component and directive to the Angular Signals API. Templates bind as before: <i>[name]</i>, <i>[(name)]</i> and <i>(name)</i> keep working. Most of the work is done by
                <i>ng update</i>. What is left is code that reaches into a component instance, data mutated in place under OnPush components, and the few places the migrations report.
            </p>
            <p>This guide covers three starting points:</p>
            <ul class="leading-relaxed">
                <li><b>A v22 alpha or release candidate</b> of ExhaustiveUI: update to 22.0.0 with <i>ng update</i>, which runs the migrations. They leave code that is already migrated as it is, so running them again is safe.</li>
                <li><b>PrimeNG v21</b>: switch to ExhaustiveUI with the <i>migrate-from-primeng</i> schematic, then run the v22 migrations explicitly.</li>
                <li><b>Optimus UI v2</b>, which shares the PrimeNG v21 API: swap the packages and imports, then run the v22 migrations explicitly.</li>
            </ul>
            <p>
                Updating later within v22, or to a future major, is covered by the <a [routerLink]="'/migration/update'" class="doc-link">update guide</a>. Every breaking change below is also listed in the
                <a href="https://github.com/e-xiste/exhaustive-ui/blob/main/CHANGELOG.md" target="_blank" rel="noopener noreferrer" class="doc-link">changelog</a>.
            </p>
        </app-docsectiontext>
    `
})
export class V22OverviewDoc {}
