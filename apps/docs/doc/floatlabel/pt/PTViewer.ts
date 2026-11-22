import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from '@exhaustive-ui/core/floatlabel';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    selector: 'floatlabel-pt-viewer',
    standalone: true,
    imports: [CommonModule, FormsModule, AppDocPtViewer, FloatLabelModule, InputTextModule],
    template: `
        <app-docptviewer [docs]="docs">
            <p-float-label>
                <input pInputText id="username" [(ngModel)]="value" autocomplete="off" />
                <label for="username">Username</label>
            </p-float-label>
        </app-docptviewer>
    `
})
export class PTViewer {
    value: string | null = null;

    docs = [
        {
            data: getPTOptions('FloatLabel'),
            key: 'FloatLabel'
        }
    ];
}
