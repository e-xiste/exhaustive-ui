import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'optimus-overview-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                ExhaustiveUI is a fork of Optimus UI, itself the MIT continuation of PrimeNG v21. An Optimus UI v2 application already runs on Angular 22 and uses the same components, selectors, CSS classes, design tokens and
                <i>&#64;openng/icons</i> icons. Moving it across takes two steps:
            </p>
            <ol class="leading-relaxed">
                <li><b>The rename</b>: the <i>&#64;openng/optimus-ui*</i> packages become <i>&#64;exhaustive-ui/*</i>, and the four names of the configuration API change. There is no schematic for it; it is a find and replace.</li>
                <li>
                    <b>The v22 changes</b>: the Signals API everywhere, OnPush and the API cleanup of ExhaustiveUI v22. The <i>ng update</i> migrations do most of it, and the
                    <a [routerLink]="'/migration/v22'" class="doc-link">migration guide to v22</a> covers the rest.
                </li>
            </ol>
        </app-docsectiontext>
    `
})
export class OptimusOverviewDoc {}
