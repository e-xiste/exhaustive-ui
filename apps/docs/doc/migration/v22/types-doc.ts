import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'v22-types-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Some types now describe what the components actually emit or accept. Code that relied on the old types may need a cast or a narrower check.</p>
            <ul class="leading-relaxed">
                <li>Table <i>onFilter</i>: <i>filters</i> is typed <i>FilterMetadata | FilterMetadata[]</i>.</li>
                <li>TreeTable <i>TreeTableLazyLoadEvent</i>: <i>first</i> is a <i>number</i> and <i>last</i> an optional <i>number</i>, as in <i>TableLazyLoadEvent</i>.</li>
                <li>CascadeSelect: <i>options</i> is typed as an array, and the value accepts an object.</li>
                <li>Dialog and ConfirmDialog: <i>pt.root</i> is typed as the options of the root element.</li>
                <li>Chart <i>onDataSelect</i> emits the new exported <i>ChartDataSelectEvent</i> type.</li>
                <li><i>Confirmation</i> accepts <i>draggable</i>, and DatePicker <i>hourFormat</i> also accepts a number.</li>
            </ul>
        </app-docsectiontext>
    `
})
export class V22TypesDoc {}
