import { Component } from '@angular/core';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'validation-doc',
    standalone: true,
    imports: [FileInputModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                <i>accept</i> takes extensions such as <i>.pdf</i> and MIME types such as <i>image/*</i>. <i>maxFileSize</i> and <i>minFileSize</i> limit the size of each file, <i>maxFiles</i> the number of files, existing files included, and
                <i>maxTotalSize</i> the size of all the files together, in bytes. A rejected file stays in the list with the reason next to it until the user removes it, and it is not part of the value. Use <i>hint</i> to state the rules under the
                dropzone.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-file-input accept="image/*,.pdf" [maxFileSize]="5000000" [maxFiles]="5" [maxTotalSize]="15000000" hint="Images and PDF · 5 MB per file · 5 files and 15 MB in total" />
        </div>
        <app-code></app-code>
    `
})
export class ValidationDoc {}
