import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from '@exhaustive-ui/core/inputgroup';
import { InputGroupAddonModule } from '@exhaustive-ui/core/inputgroupaddon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    selector: 'inputgroup-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, InputGroupModule, InputGroupAddonModule, InputTextModule, FormsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <p-input-group>
                <p-input-group-addon>
                    <i class="pi pi-user"></i>
                </p-input-group-addon>
                <input pInputText [(ngModel)]="value" placeholder="Username" />
            </p-input-group>
        </app-docptviewer>
    `
})
export class PTViewer {
    value: number | null = null;

    docs = [
        {
            data: getPTOptions('InputGroup'),
            key: 'InputGroup'
        },
        {
            data: getPTOptions('InputGroupAddon'),
            key: 'InputGroupAddon'
        }
    ];
}
