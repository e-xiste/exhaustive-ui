import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'templates-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>
                A template is an <i>ng-template</i> placed inside the component, with a reference that names it, such as <i>#header</i> or <i>#item</i>. The Templates section of the API reference of each component lists the exact names, read from the
                source code of the component, with the context each template receives through <i>let-</i> variables. Names are case sensitive: write them exactly as listed, for example <i>#disabledDate</i> on the DatePicker.
            </p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class TemplatesDoc {
    code: Code = {
        html: `<p-table [value]="products">
    <ng-template #header let-columns>
        <tr>
            <th>Name</th>
            <th>Price</th>
        </tr>
    </ng-template>
    <ng-template #body let-product let-rowIndex="rowIndex">
        <tr>
            <td>{{ product.name }}</td>
            <td>{{ product.price }}</td>
        </tr>
    </ng-template>
</p-table>`
    };
}
