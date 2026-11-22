import { Component } from '@angular/core';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'invalid-doc',
    standalone: true,
    imports: [FileInputModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>The invalid state is applied using the <i>invalid</i> property to indicate failed validation.</p>
        </app-docsectiontext>
        <div class="card">
            <p-file [invalid]="files.length === 0" (onSelect)="files = $event.items" />
        </div>
        <app-code></app-code>
    `
})
export class InvalidDoc {
    files: unknown[] = [];
}
