import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'philosophy-ai-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: `
        <app-docsectiontext>
            <p>ExhaustiveUI is maintained with AI coding agents, and we say so plainly. They do a large part of the work that a small project could not otherwise afford:</p>
            <ul>
                <li>reproducing reported bugs in a real browser, then fixing them with a regression test;</li>
                <li>migrating components, such as the move to Signals;</li>
                <li>auditing the library: server rendering, strict template type checking, accessibility with axe on every documentation page, color contrast in every theme;</li>
                <li>checking that the documentation, the API tables and every generated example match the code.</li>
            </ul>
            <p>
                AI output is not trusted on its own word. Every change goes through the same gates: about 8,800 unit tests, a type check of every documentation example, a format check and CI on every commit, then a review before it is merged.
                Packages are built and published by CI, with npm provenance, never from a personal machine.
            </p>
            <p>
                The other half is making the library usable by AI. Agents tend to write PrimeNG code from memory. ExhaustiveUI ships an MCP server, an agent skill and a compact card per component, so they read the real API of the installed version,
                and a validator that names the replacement of every removed input. The <a [routerLink]="'/llms'" class="doc-link">AI agents guide</a> explains how to set them up.
            </p>
        </app-docsectiontext>
    `
})
export class PhilosophyAiDoc {}
