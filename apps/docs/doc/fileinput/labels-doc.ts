import { Component } from '@angular/core';
import { FileInputLabels, FileInputModule } from '@exhaustive-ui/core/fileinput';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'labels-doc',
    standalone: true,
    imports: [FileInputModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Every text of the component, error messages and screen reader announcements included, can be replaced through <i>labels</i>. Missing keys keep their English default. Placeholders such as <i>{{ '{0}' }}</i> receive the values. Sizes
                use the <i>fileSizeTypes</i> units of the locale.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-file-input [labels]="labels" [maxFileSize]="2000000" hint="2 Mo maximum par fichier" />
        </div>
        <app-code></app-code>
    `
})
export class LabelsDoc {
    labels: Partial<FileInputLabels> = {
        dropzone: 'Déposez vos fichiers ici ou',
        browse: 'parcourez',
        remove: 'Retirer',
        maxFileSizeError: 'Trop lourd : {0}, maximum {1}',
        addedMessage: '{0} fichier(s) ajouté(s)',
        removedMessage: '{0} retiré',
        listLabel: 'Fichiers sélectionnés'
    };
}
