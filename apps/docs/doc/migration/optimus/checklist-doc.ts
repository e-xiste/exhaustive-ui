import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'optimus-checklist-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <ul class="leading-relaxed">
                <li>No <i>&#64;openng/optimus-ui*</i> package left in any <i>package.json</i>, and the report of <i>migrate-from-optimus</i> handled.</li>
                <li><i>provideExhaustive</i>, <i>Exhaustive</i>, <i>ExhaustiveConfigType</i> and <i>EXHAUSTIVE_CONFIG</i> in place of the Optimus names.</li>
                <li>With a CSS layer configured, your overrides still apply.</li>
                <li>The v22 migrations run and their report handled.</li>
                <li>The application compiles and its tests pass, after the code changes of the migration guide to v22.</li>
            </ul>
        </app-docsectiontext>
    `
})
export class OptimusChecklistDoc {}
