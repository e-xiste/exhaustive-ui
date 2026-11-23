import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TourModule, TourStep, TourStepChangeEvent } from '@exhaustive-ui/core/tour';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'controlled-doc',
    standalone: true,
    imports: [TourModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                The current step is the two-way <i>activeIndex</i> property: set it to start the tour at a given step or to move it from outside. <i>onStepChange</i> is emitted on every new step, <i>onFinish</i> when the user completes the tour and
                <i>onClose</i>, with its reason, when the tour is closed before its end. The component also has <i>start(index)</i>, <i>next()</i>, <i>prev()</i>, <i>goTo(index)</i>, <i>close()</i> and <i>refresh()</i> methods.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-6">
            <div class="flex flex-wrap justify-center gap-2">
                @for (step of steps; track step.title; let i = $index) {
                    <p-button [id]="'tour-controlled-' + i" [label]="'Start at step ' + (i + 1)" severity="secondary" (onClick)="startAt(i)" />
                }
            </div>
            <p class="m-0 text-muted-color" aria-live="polite">{{ status }}</p>
            <p-tour [steps]="steps" [(visible)]="visible" [(activeIndex)]="activeIndex" (onStepChange)="onStepChange($event)" (onFinish)="status = 'Tour completed'" (onClose)="status = 'Tour closed (' + $event.reason + ')'" />
        </div>
        <app-code></app-code>
    `
})
export class ControlledDoc {
    visible = false;

    activeIndex = 0;

    status = 'Not started';

    steps: TourStep[] = [
        { target: '#tour-controlled-0', title: 'Step 1', content: 'The first button starts the tour here.' },
        { target: '#tour-controlled-1', title: 'Step 2', content: 'The second button starts the tour here.' },
        { target: '#tour-controlled-2', title: 'Step 3', content: 'The third button starts the tour here.' }
    ];

    startAt(index: number) {
        this.activeIndex = index;
        this.visible = true;
        this.status = `Step ${index + 1}`;
    }

    onStepChange(event: TourStepChangeEvent) {
        this.status = `Step ${event.index + 1}, coming from step ${event.previousIndex + 1}`;
    }
}
