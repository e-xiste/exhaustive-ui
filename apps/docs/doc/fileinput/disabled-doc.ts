import { Component } from '@angular/core';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'disabled-doc',
    standalone: true,
    imports: [FileInputModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>When <i>disabled</i> is present, files can no longer be added or removed.</p>
        </app-docsectiontext>
        <div class="card">
            <p-file disabled />
        </div>
        <app-code></app-code>
    `
})
export class DisabledDoc {}
