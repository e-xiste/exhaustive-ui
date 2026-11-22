import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [FormsModule, FileInputModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                FileInput is bound with <i>ngModel</i>, and its value is the array of selected files. Files are added by clicking the dropzone, with the keyboard, by drag and drop, or by pasting them, a screenshot for example, while the component has
                the focus. Dropping a folder adds the files it contains and keeps their relative path. Without an <i>url</i> or an <i>uploadHandler</i>, nothing is uploaded: the files stay in the value, ready to be sent with the form.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-file [(ngModel)]="files" />
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    files: File[] = [];
}
