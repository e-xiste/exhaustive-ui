import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'primeng-checklist-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <ul class="leading-relaxed">
                <li>Angular 22 installed, and no <i>primeng</i>, <i>&#64;primeuix/*</i>, <i>primeicons</i>, <i>tailwindcss-primeui</i> or <i>primelocale</i> left in any <i>package.json</i>.</li>
                <li>The report of <i>migrate-from-primeng</i> handled, then the report of the v22 migrations.</li>
                <li>Icons render: the stylesheet is <i>&#64;openng/icons/openng-icons.css</i> and nothing names the <i>primeicons</i> font.</li>
                <li>With a CSS layer configured, your overrides still apply: the <i>&#64;layer</i> names match the theme's <i>cssLayer</i> order.</li>
                <li>The application compiles and its tests pass, after the code changes of the migration guide to v22.</li>
                <li>PrimeFlex, if used, migrated with <i>migrate-from-primeflex</i>.</li>
            </ul>
        </app-docsectiontext>
    `
})
export class PrimengChecklistDoc {}
