import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TourModule, TourStep } from '@exhaustive-ui/core/tour';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'placement-doc',
    standalone: true,
    imports: [TourModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                The card is displayed below the target by default. The <i>placement</i> of the tour, or of a step, puts it on another side: <i>top</i>, <i>right</i>, <i>bottom</i>, <i>left</i>, <i>auto</i> for the side with the most room, or
                <i>center</i>. When the card does not fit, it flips to the opposite side, then to the side with the most room, and it always stays inside the screen. In right-to-left documents, <i>left</i> and <i>right</i> are swapped.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-6">
            <div id="tour-placement-target" class="flex items-center justify-center w-40 h-24 rounded-border bg-primary text-primary-contrast font-semibold">Target</div>
            <p-button label="Show the placements" icon="pi pi-play" (onClick)="visible = true" />
            <p-tour [steps]="steps" [(visible)]="visible" />
        </div>
        <app-code></app-code>
    `
})
export class PlacementDoc {
    visible = false;

    steps: TourStep[] = [
        { target: '#tour-placement-target', placement: 'top', title: 'Top', content: 'The card is above the target.' },
        { target: '#tour-placement-target', placement: 'right', title: 'Right', content: 'The card is on the right of the target.' },
        { target: '#tour-placement-target', placement: 'bottom', title: 'Bottom', content: 'The card is below the target.' },
        { target: '#tour-placement-target', placement: 'left', title: 'Left', content: 'The card is on the left of the target.' },
        { target: '#tour-placement-target', placement: 'auto', title: 'Auto', content: 'The card is on the side with the most room.' }
    ];
}
