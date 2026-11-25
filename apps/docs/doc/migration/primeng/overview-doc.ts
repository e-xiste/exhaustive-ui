import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'primeng-overview-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                ExhaustiveUI is an MIT fork of PrimeNG v21, the last PrimeNG release published under the MIT license, by way of Optimus UI. The components, their selectors, the <i>p-*</i> CSS classes, the design tokens and the <i>pi pi-*</i> icon
                classes are the same, so a PrimeNG v21 application moves across in two parts:
            </p>
            <ol class="leading-relaxed">
                <li><b>The switch</b>: other package names, a configuration API named after ExhaustiveUI, another icon package and another default CSS layer name. The <i>migrate-from-primeng</i> schematic does it.</li>
                <li>
                    <b>The v22 changes</b>: Angular 22, the Signals API, OnPush and the API cleanup of ExhaustiveUI v22. The <i>ng update</i> migrations do most of it, and the
                    <a [routerLink]="'/migration/v22'" class="doc-link">migration guide to v22</a> covers the rest.
                </li>
            </ol>
            <p>No license is needed. A PrimeTek license or subscription for PrimeNG, its templates or its theme designer does not carry over, and is not required.</p>
            <p>For a real migration with its numbers, see the <a [routerLink]="'/migration/sakai'" class="doc-link">case study of sakai-ng</a>.</p>
        </app-docsectiontext>
    `
})
export class PrimengOverviewDoc {}
