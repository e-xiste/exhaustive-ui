import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'primeng-license-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                PrimeNG v21 is the last version published under the MIT license. From v22, PrimeTek distributes PrimeNG under its own commercial license, with a free Community license for individuals, students and small organizations that meet its
                conditions; see
                <a href="https://primeui.dev/nextchapter" target="_blank" rel="noopener noreferrer">their announcement</a> for the terms. Releases already published under MIT stay MIT.
            </p>
            <p>An application on PrimeNG v21 has three ways forward:</p>
            <ul class="leading-relaxed">
                <li><b>Stay on PrimeNG v21.</b> Nothing to do today: PrimeTek keeps publishing security fixes for it. Other bugs are no longer fixed there, and it does not support Angular 22 and later.</li>
                <li><b>Move to PrimeNG v22 or later</b> under PrimeTek's license, if your organisation qualifies for the Community license or buys a commercial license.</li>
                <li>
                    <b>Move to an MIT fork of v21.</b> <a href="https://github.com/openng-org/optimus-ui" target="_blank" rel="noopener noreferrer">Optimus UI</a> is the community fork; ExhaustiveUI forks Optimus UI and ships for Angular 22, with the
                    components on Signals and close to 400 inherited bugs fixed. This guide covers the move to ExhaustiveUI; from Optimus UI, follow the <a [routerLink]="'/migration/optimus'" class="doc-link">Optimus UI guide</a> instead.
                </li>
            </ul>
        </app-docsectiontext>
    `
})
export class PrimengLicenseDoc {}
