import { Component } from '@angular/core';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'sizes-doc',
    standalone: true,
    imports: [FileInputModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>FileInput provides <i>small</i> and <i>large</i> sizes as alternatives to the default, like the other form fields.</p>
        </app-docsectiontext>
        <div class="card flex flex-col gap-4">
            <p-file size="small" />
            <p-file />
            <p-file size="large" />
        </div>
        <app-code></app-code>
    `
})
export class SizesDoc {}
