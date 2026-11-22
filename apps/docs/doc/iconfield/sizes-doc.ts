import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from '@exhaustive-ui/core/iconfield';
import { InputIconModule } from '@exhaustive-ui/core/inputicon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'sizes-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, FormsModule, IconFieldModule, InputIconModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>IconField is compatible with the pSize setting of the input field.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-4">
            <p-icon-field>
                <p-input-icon class="pi pi-search" />
                <input pInputText [(ngModel)]="value1" placeholder="Small" pSize="small" />
            </p-icon-field>

            <p-icon-field>
                <input pInputText [(ngModel)]="value2" placeholder="Normal" />
                <p-input-icon class="pi pi-user" />
            </p-icon-field>

            <p-icon-field>
                <p-input-icon class="pi pi-lock" />
                <input pInputText [(ngModel)]="value3" placeholder="Large" pSize="large" />
                <p-input-icon class="pi pi-spin pi-spinner" />
            </p-icon-field>
        </div>
        <app-code></app-code>
    `
})
export class SizesDoc {
    value1 = null;

    value2 = null;

    value3 = null;
}
