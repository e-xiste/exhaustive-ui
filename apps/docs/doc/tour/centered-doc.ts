import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TourModule, TourStep } from '@exhaustive-ui/core/tour';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'centered-doc',
    standalone: true,
    imports: [TourModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                A step without <i>target</i> is displayed in the middle of the screen, for a welcome or a closing message. A step whose target is not found, an element that is not rendered yet for example, is centered too and a warning is logged;
                with <i>missingTarget</i> set to <i>skip</i>, the tour moves on to the following step instead.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-6">
            <p-button id="tour-centered-profile" label="Your profile" icon="pi pi-user" severity="secondary" />
            <p-button label="Start the tour" icon="pi pi-play" (onClick)="visible = true" />
            <p-tour [steps]="steps" [(visible)]="visible" />
        </div>
        <app-code></app-code>
    `
})
export class CenteredDoc {
    visible = false;

    steps: TourStep[] = [
        { title: 'Welcome aboard', content: 'This short tour shows you around. It takes less than a minute.' },
        { target: '#tour-centered-profile', title: 'Your profile', content: 'Add a picture and tell your team what you work on.' },
        { target: '#tour-centered-not-rendered', title: 'Missing target', content: 'This target does not exist, so the step is centered.' },
        { title: 'You are all set', content: 'Restart the tour at any time from the help menu.' }
    ];
}
