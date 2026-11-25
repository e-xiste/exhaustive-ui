import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';

@Component({
    selector: 'comparison-others-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <ul class="leading-relaxed">
                <li><b>You want a company behind the library</b>, with a support contract: PrimeNG.</li>
                <li><b>You want the smallest change from PrimeNG v21</b>, or a larger community of contributors: Optimus UI.</li>
                <li><b>You follow Material Design</b>, or want the library of the Angular team: Angular Material.</li>
                <li><b>You need a large user base</b> and years of answers online: Angular Material or PrimeNG.</li>
            </ul>
        </app-docsectiontext>
    `
})
export class ComparisonOthersDoc {}
