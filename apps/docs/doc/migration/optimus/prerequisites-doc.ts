import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'optimus-prerequisites-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <ul class="leading-relaxed">
                <li><b>Optimus UI v2 on Angular 22.</b> An application still on Optimus UI v1 updates to v2 first, following Optimus UI's documentation.</li>
                <li><b>A clean git working tree</b>, so the rename and the migrations can be reviewed on their own, and a build and test run that passes before you start.</li>
            </ul>
        </app-docsectiontext>
    `
})
export class OptimusPrerequisitesDoc {}
