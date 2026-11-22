import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';

@Component({
    selector: 'legacy-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Earlier versions accepted several spellings of the same element, such as <i>p-datePicker</i> and <i>p-datepicker</i> for <i>p-date-picker</i>, without the kebab case form being available everywhere. These spellings still work in v22,
                so existing templates keep working, but the documentation, the examples and the generated code only use the kebab case form. Every component accepts the kebab case form.
            </p>
        </app-docsectiontext>
        <div class="doc-tablewrapper">
            <table class="doc-table">
                <thead>
                    <tr>
                        <th>Use</th>
                        <th>Instead of</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><i>p-date-picker</i></td>
                        <td><i>p-datePicker</i>, <i>p-datepicker</i></td>
                    </tr>
                    <tr>
                        <td><i>p-input-icon</i></td>
                        <td><i>p-inputIcon</i>, <i>p-inputicon</i></td>
                    </tr>
                    <tr>
                        <td><i>p-file-upload</i></td>
                        <td><i>p-fileUpload</i>, <i>p-fileupload</i></td>
                    </tr>
                    <tr>
                        <td><i>p-tree-table</i></td>
                        <td><i>p-treeTable</i>, <i>p-treetable</i></td>
                    </tr>
                    <tr>
                        <td><i>p-sort-icon</i></td>
                        <td><i>p-sortIcon</i></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
})
export class LegacyDoc {}
