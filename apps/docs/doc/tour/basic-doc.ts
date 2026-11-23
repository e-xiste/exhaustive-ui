import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { TourModule, TourStep } from '@exhaustive-ui/core/tour';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [TourModule, ButtonModule, InputTextModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                A tour is a list of <i>steps</i>. Each step highlights its <i>target</i>, a CSS selector, an element or a function that returns one, and explains it in a card with a title and a text. The <i>visible</i> property starts and stops the
                tour; the card has a step counter, progress dots, back, next and close buttons. The mask darkens the page around a spotlight that follows the target when the page scrolls or the layout changes.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col gap-6">
            <div class="flex flex-wrap items-center gap-2 p-3 border border-surface rounded-border">
                <p-button id="tour-basic-new" label="New" icon="pi pi-plus" size="small" />
                <input id="tour-basic-search" pInputText placeholder="Search" aria-label="Search" class="flex-1 min-w-40" />
                <p-button id="tour-basic-settings" icon="pi pi-cog" severity="secondary" size="small" ariaLabel="Settings" />
            </div>
            <div class="flex justify-center">
                <p-button label="Start the tour" icon="pi pi-play" (onClick)="visible = true" />
            </div>
            <p-tour [steps]="steps" [(visible)]="visible" />
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    visible = false;

    steps: TourStep[] = [
        { target: '#tour-basic-new', title: 'Create a document', content: 'Start a new document from a blank page or a template.' },
        { target: '#tour-basic-search', title: 'Search', content: 'Find any document by its name or its content.' },
        { target: '#tour-basic-settings', title: 'Settings', content: 'Change the language, the theme and your notifications.' }
    ];
}
