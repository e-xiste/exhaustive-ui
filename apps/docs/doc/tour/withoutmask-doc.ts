import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { TourModule, TourStep } from '@exhaustive-ui/core/tour';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'withoutmask-doc',
    standalone: true,
    imports: [TourModule, ButtonModule, InputTextModule, FormsModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                With <i>mask</i> set to false, the page stays usable while the tour runs: the target keeps its ring, the card is a non-modal dialog and the focus is not trapped in it. Use it for hints the user follows while working, here filling a
                field.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-6">
            <input id="tour-nomask-name" pInputText [(ngModel)]="name" placeholder="Project name" aria-label="Project name" />
            <p-button label="Show the hint" icon="pi pi-play" (onClick)="visible = true" />
            <p-tour [steps]="steps" [(visible)]="visible" [mask]="false" />
        </div>
        <app-code></app-code>
    `
})
export class WithoutMaskDoc {
    visible = false;

    name = '';

    steps: TourStep[] = [{ target: '#tour-nomask-name', placement: 'right', title: 'Name your project', content: 'You can type in the field while this hint is open.' }];
}
