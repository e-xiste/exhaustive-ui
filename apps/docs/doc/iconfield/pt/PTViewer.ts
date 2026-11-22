import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from '@exhaustive-ui/core/iconfield';
import { InputIconModule } from '@exhaustive-ui/core/inputicon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    selector: 'iconfield-pt-viewer',
    standalone: true,
    imports: [CommonModule, FormsModule, AppDocPtViewer, IconFieldModule, InputIconModule, InputTextModule],
    template: `
        <app-docptviewer [docs]="docs">
            <p-icon-field>
                <p-input-icon class="pi pi-search" />
                <input pInputText [(ngModel)]="value" placeholder="Search" />
            </p-icon-field>
        </app-docptviewer>
    `
})
export class PTViewer {
    value: string | null = null;

    docs = [
        {
            data: getPTOptions('IconField'),
            key: 'IconField'
        },
        {
            data: getPTOptions('InputIcon'),
            key: 'InputIcon'
        }
    ];
}
