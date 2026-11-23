import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TourLabels, TourModule, TourStep } from '@exhaustive-ui/core/tour';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'labels-doc',
    standalone: true,
    imports: [TourModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Every text of the component, screen reader announcements included, can be replaced through <i>labels</i>. Missing keys keep their English default; the close button uses the <i>aria.close</i> text of the locale. Placeholders such as
                <i>{{ '{0}' }}</i> receive the values. <i>showCounter</i> and <i>showDots</i> hide the counter and the dots.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-6">
            <p-button id="tour-labels-share" label="Partager" icon="pi pi-share-alt" severity="secondary" />
            <p-button label="Lancer la visite" icon="pi pi-play" (onClick)="visible = true" />
            <p-tour [steps]="steps" [(visible)]="visible" [labels]="labels" />
        </div>
        <app-code></app-code>
    `
})
export class LabelsDoc {
    visible = false;

    labels: Partial<TourLabels> = {
        next: 'Suivant',
        prev: 'Retour',
        done: 'Terminer',
        close: 'Fermer',
        counter: '{0} sur {1}',
        stepLabel: 'Étape {0} sur {1}',
        stepMessage: 'Étape {0} sur {1} : {2}'
    };

    steps: TourStep[] = [
        { title: 'Bienvenue', content: 'Découvrez les nouveautés en deux étapes.' },
        { target: '#tour-labels-share', title: 'Partager', content: 'Invitez vos collègues à modifier le document.' }
    ];
}
