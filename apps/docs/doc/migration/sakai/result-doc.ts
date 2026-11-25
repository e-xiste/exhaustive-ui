import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';

@Component({
    selector: 'sakai-result-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <ul class="leading-relaxed">
                <li><b>migrate-from-primeng</b> changed 38 files: imports, <code>providePrimeNG</code>, the theme import, the Tailwind CSS plugin, the icon font.</li>
                <li><b>Its report</b> listed 32 references in 11 files to review: links to the images of PrimeTek, file names and texts that say PrimeNG, and one variable name. None had to change for the build.</li>
                <li><b>The v22 migrations</b> changed 7 files: 28 <code>styleClass</code> became <code>class</code>.</li>
                <li><b>The build failed once</b>, and not because of the library: TypeScript 6, which comes with Angular 22, stops on the <code>baseUrl</code> option. One line in <code>tsconfig.json</code> fixed it.</li>
            </ul>
            <p>
                Both versions were then built, and their 24 routes opened in Chrome. The visible text has the same length on every route, the heights of the pages differ by one pixel at most, and the console shows no JavaScript error. The select, the
                multi select, the autocomplete, the date picker, the column filter, and the create and delete dialogs of the CRUD page give the same results.
            </p>
            <p>The initial bundle went from 1.75 MB to 1.85 MB, uncompressed. That includes the move to Angular 22, so the part of the library is not known.</p>
        </app-docsectiontext>
    `
})
export class SakaiResultDoc {}
