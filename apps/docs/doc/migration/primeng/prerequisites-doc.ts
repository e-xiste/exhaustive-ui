import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'primeng-prerequisites-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <ul class="leading-relaxed">
                <li>
                    <b>PrimeNG v21.</b> ExhaustiveUI shares its API. On v20 or older, upgrade to v21 first with PrimeNG's own update guides; the schematic checks the installed version and stops otherwise. On PrimeNG v22, the schematic runs, but the
                    features PrimeNG added after v21 have no ExhaustiveUI equivalent: check the compiler errors and the report.
                </li>
                <li><b>A clean git working tree</b>, so every change can be reviewed and reverted on its own, and a build and test run that passes before you start.</li>
                <li><b>PrimeFlex</b>, if the project uses it, is not migrated by this schematic. Run <i>migrate-from-primeflex</i> afterwards to move its classes to Tailwind CSS; the schematic reminds you when it finds PrimeFlex.</li>
            </ul>
        </app-docsectiontext>
    `
})
export class PrimengPrerequisitesDoc {}
