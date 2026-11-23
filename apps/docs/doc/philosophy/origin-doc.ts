import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';

@Component({
    selector: 'philosophy-origin-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                In June 2026 PrimeTek archived the PrimeNG repository and moved future major versions, starting with v22, to a commercial license. They explained their reasoning in
                <a href="https://primeui.dev/nextchapter" target="_blank" rel="noopener noreferrer">their own announcement</a>, and it is worth reading. Maintaining a component library of this size for a decade, largely for free, is genuinely hard,
                and we do not think the decision was made lightly.
            </p>
            <p>
                The OpenNG community answered first, with <a href="https://github.com/openng-org/optimus-ui" target="_blank" rel="noopener noreferrer">Optimus UI</a>: a fork of the last MIT licensed version of PrimeNG, v21. ExhaustiveUI is a fork of
                Optimus UI, so it carries the same code, the same history and the same license.
            </p>
            <p>Another fork needs a reason. Ours is a different pace and a different scope:</p>
            <ul>
                <li><strong>Modernize everything at once.</strong> Every component moved to Signals, OnPush and the built-in control flow for Angular 22, instead of one component at a time.</li>
                <li><strong>Clear the inherited backlog.</strong> Bugs carried over from PrimeNG and Optimus UI are reproduced, fixed and covered by a test, and the documentation is checked against the code.</li>
                <li><strong>Let AI carry a real share of the work</strong>, and make the library easy for AI coding agents to use correctly. The section below explains how.</li>
            </ul>
            <p>ExhaustiveUI is not an official fork. It is not endorsed by PrimeTek or by the OpenNG team, and it stays MIT.</p>
        </app-docsectiontext>
    `
})
export class PhilosophyOriginDoc {}
