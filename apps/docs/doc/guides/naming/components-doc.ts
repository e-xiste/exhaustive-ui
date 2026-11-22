import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'components-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>
                A component is written as an element whose name is <i>p-</i> followed by the name of the component in kebab case: every word of the name is separated by a hyphen, as the
                <a href="https://angular.dev/style-guide" target="_blank" rel="noopener noreferrer" class="doc-link">Angular style guide</a> recommends. A name made of a single word stays one word, such as <i>p-checkbox</i>, <i>p-listbox</i> or
                <i>p-menubar</i>. The parts of a component follow the same rule.
            </p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class ComponentsDoc {
    code: Code = {
        html: `<p-date-picker [(ngModel)]="date" />
<p-multi-select [options]="cities" [(ngModel)]="selectedCities" />

<p-icon-field>
    <p-input-icon class="pi pi-search" />
    <input pInputText placeholder="Search" />
</p-icon-field>

<p-tabs value="0">
    <p-tab-list>
        <p-tab value="0">Header I</p-tab>
    </p-tab-list>
    <p-tab-panels>
        <p-tab-panel value="0">Content I</p-tab-panel>
    </p-tab-panels>
</p-tabs>`
    };
}
