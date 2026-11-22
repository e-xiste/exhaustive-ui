import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'v22-prerequisites-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <ul class="leading-relaxed">
                <li>
                    <b>Angular 22.</b> The peer dependencies are <i>^22.0.0</i>. Update Angular first with the <a href="https://angular.dev/update-guide" target="_blank" rel="noopener noreferrer" class="doc-link">Angular update guide</a>, and use the
                    Node.js and TypeScript versions it requires.
                </li>
                <li><b>A clean git working tree.</b> Commit or stash your work, so the changes made by the migrations can be reviewed, and reverted, on their own.</li>
                <li><b>A build and test run that passes</b> before you start, so anything that breaks afterwards comes from the update.</li>
                <li><b>PrimeFlex</b>, if the project uses it: it is not part of the update. The <i>migrate-from-primeflex</i> schematic translates its classes to Tailwind CSS, as a separate step.</li>
            </ul>
        </app-docsectiontext>
    `
})
export class V22PrerequisitesDoc {}
