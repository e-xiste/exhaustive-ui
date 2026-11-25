import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'comparison-exhaustiveui-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <ul class="leading-relaxed">
                <li><b>You come from PrimeNG v21</b>, want Angular 22, and need a license without conditions: see the <a [routerLink]="'/migration/primeng'" class="doc-link">migration guide</a>.</li>
                <li><b>You want every component on Signals now</b>, with schematics for the migration.</li>
                <li><b>You work with coding agents</b> and want the API of the installed version in the package, an MCP server and a validator of templates: see <a [routerLink]="'/llms'" class="doc-link">LLMs</a>.</li>
            </ul>
        </app-docsectiontext>
    `
})
export class ComparisonExhaustiveDoc {}
