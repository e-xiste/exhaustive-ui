import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'v22-checklist-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <ul class="leading-relaxed">
                <li>Angular 22 installed, and <i>ng update</i> (or <i>--migrate-only --from=3.0.0</i>) run on a clean working tree.</li>
                <li>Every place listed in the migration report handled.</li>
                <li>The project compiles: inputs are read with a call, two-way properties written with <i>.set()</i>, removed TypeScript API replaced.</li>
                <li>No <i>styleClass</i>, removed input or <i>pt*</i> alias left in templates: <i>validate_usage</i> of the MCP server can check this.</li>
                <li>Screens that change data bound to a component show the change: new arrays and objects, or signals, rather than in-place mutation.</li>
                <li>Behavior changes reviewed against your tests and screenshots.</li>
                <li>Signal Forms, if you adopt them: a required field shows as invalid before any interaction, because <i>[invalid]</i> cannot be bound next to <i>[formField]</i>. A fix is planned in a v22 minor release.</li>
            </ul>
        </app-docsectiontext>
    `
})
export class V22ChecklistDoc {}
