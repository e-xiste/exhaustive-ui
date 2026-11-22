import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'primeng-manual-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Besides the places listed in the report, check these by hand:</p>
            <ul class="leading-relaxed">
                <li><b>The icon font name.</b> A stylesheet that names the font directly, as in <i>font-family: 'primeicons'</i>, now needs <i>'openng-icons'</i>. The schematic does not touch declaration values.</li>
                <li><b>Local variables named after PrimeNG</b>, such as <i>primeng = inject(PrimeNG)</i>: the type is renamed, the variable name is yours to keep or change.</li>
                <li><b>Module paths passed to other functions</b>, such as <i>jest.mock('primeng/button')</i> or <i>vi.mock()</i>: only imports, dynamic imports and <i>require()</i> are rewritten. These appear in the report.</li>
                <li><b>Build and deployment files</b> outside the TypeScript sources and stylesheets: Dockerfiles, CI scripts, CDN links to PrimeNG or PrimeIcons.</li>
                <li>
                    <b>PrimeTek products</b> such as templates or the theme designer are not part of ExhaustiveUI. A preset built with them is a plain <i>definePreset()</i> object and keeps working once its imports point to
                    <i>&#64;exhaustive-ui/themes</i>.
                </li>
            </ul>
        </app-docsectiontext>
    `
})
export class PrimengManualDoc {}
