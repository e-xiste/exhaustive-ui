import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TourModule, TourStep } from '@exhaustive-ui/core/tour';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'spotlight-doc',
    standalone: true,
    imports: [TourModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                <i>spotlightPadding</i> and <i>spotlightRadius</i> size the cut-out around the target, in pixels, for the whole tour or for one step. The highlighted target stays clickable unless <i>disableInteraction</i> is set. A click on the mask
                closes the tour with <i>dismissableMask</i>, and <i>closeOnEscape</i> controls the Escape key.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-6">
            <div class="flex gap-6 items-center">
                <p-button id="tour-spotlight-round" icon="pi pi-heart" [rounded]="true" ariaLabel="Favorite" />
                <p-button id="tour-spotlight-locked" label="Delete account" severity="danger" (onClick)="deleted = deleted + 1" />
            </div>
            <p-button label="Start the tour" icon="pi pi-play" (onClick)="visible = true" />
            <p-tour [steps]="steps" [(visible)]="visible" [dismissableMask]="true" />
        </div>
        <app-code></app-code>
    `
})
export class SpotlightDoc {
    visible = false;

    deleted = 0;

    steps: TourStep[] = [
        { target: '#tour-spotlight-round', spotlightPadding: 6, spotlightRadius: 999, title: 'Round spotlight', content: 'The cut-out follows the shape of the button.' },
        { target: '#tour-spotlight-locked', disableInteraction: true, title: 'Not clickable', content: 'This button cannot be clicked while the step is displayed. Click the mask to close the tour.' }
    ];
}
