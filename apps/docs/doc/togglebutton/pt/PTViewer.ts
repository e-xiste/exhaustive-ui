import { CommonModule } from '@angular/common';
import { AppDocPtViewer } from '@/components/doc/app.docptviewer';
import { getPTOptions } from '@/components/doc/app.docptviewer';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from '@exhaustive-ui/core/togglebutton';

@Component({
    selector: 'togglebutton-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, ToggleButtonModule, FormsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <p-toggle-button [(ngModel)]="checked" onLabel="Yes" offLabel="No" onIcon="pi pi-check" offIcon="pi pi-times"></p-toggle-button>
        </app-docptviewer>
    `
})
export class PTViewer {
    checked: boolean = false;

    docs = [{ data: getPTOptions('ToggleButton'), key: 'ToggleButton' }];
}
