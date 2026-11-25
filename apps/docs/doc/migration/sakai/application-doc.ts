import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'sakai-application-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                PrimeNG 22 is <a href="https://primeui.dev/nextchapter" target="_blank" rel="noopener noreferrer" class="doc-link">no longer open source</a>. PrimeNG 21 stays MIT and still receives security fixes, but it declares Angular 21 as its
                peer dependency. An application on PrimeNG 21 that wants Angular 22 can buy PrimeNG 22 or use its <a href="https://primeui.dev/licenses/community" target="_blank" rel="noopener noreferrer" class="doc-link">Community license</a> under
                its conditions, move to <a href="https://github.com/openng-org/optimus-ui" target="_blank" rel="noopener noreferrer" class="doc-link">Optimus UI</a>, the community fork, or move to ExhaustiveUI. The
                <a [routerLink]="'/comparison'" class="doc-link">comparison</a> helps to choose; this page shows the last one.
            </p>
            <p>
                The application is <a href="https://github.com/primefaces/sakai-ng" target="_blank" rel="noopener noreferrer" class="doc-link">sakai-ng</a> 21.0.0, the MIT licensed admin template of PrimeTek: 77 source files, about 18,700 lines, 81
                different <code>p-*</code> tags, and 37 files that mention PrimeNG. It was migrated on 2026-11-25 to ExhaustiveUI 22.9.0. ExhaustiveUI is our library, so check what matters to you.
            </p>
        </app-docsectiontext>
    `
})
export class SakaiApplicationDoc {}
