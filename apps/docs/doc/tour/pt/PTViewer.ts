import { AppDocPtViewer } from '@/components/doc/app.docptviewer';
import { getPTOptions } from '@/components/doc/app.docptviewer';
import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TourModule, TourStep } from '@exhaustive-ui/core/tour';

@Component({
    selector: 'tour-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, TourModule, ButtonModule],
    template: `
        <app-docptviewer [docs]="docs">
            <p-button id="tour-pt-target" label="Start the tour" icon="pi pi-play" (onClick)="visible = true" />
            <p-tour [steps]="steps" [(visible)]="visible" />
        </app-docptviewer>
    `
})
export class PTViewer {
    visible = false;

    steps: TourStep[] = [
        { target: '#tour-pt-target', title: 'Pass through', content: 'Every part of the card can receive attributes through pt.' },
        { title: 'Centered step', content: 'A step without target is displayed in the middle of the screen.' }
    ];

    docs = [{ data: getPTOptions('Tour'), key: 'Tour' }];
}
