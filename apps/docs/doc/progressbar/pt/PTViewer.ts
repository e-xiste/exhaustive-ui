import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProgressBarModule } from '@exhaustive-ui/core/progressbar';

@Component({
    selector: 'progressbar-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, ProgressBarModule],
    template: `
        <app-docptviewer [docs]="docs">
            <div class="w-full">
                <p-progress-bar aria-label="Task progress" [value]="50"></p-progress-bar>
            </div>
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('ProgressBar'),
            key: 'ProgressBar'
        }
    ];
}
