import { Component } from '@angular/core';
import { ProgressBarModule } from '@exhaustive-ui/core/progressbar';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [ProgressBarModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>ProgressBar is used with the <i>value</i> property.</p>
        </app-docsectiontext>
        <div class="card">
            <p-progress-bar aria-label="Task progress" [value]="50" />
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {}
