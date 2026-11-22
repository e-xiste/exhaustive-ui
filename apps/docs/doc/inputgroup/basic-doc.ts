import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from '@exhaustive-ui/core/inputgroup';
import { InputGroupAddonModule } from '@exhaustive-ui/core/inputgroupaddon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { InputNumberModule } from '@exhaustive-ui/core/inputnumber';
import { SelectModule } from '@exhaustive-ui/core/select';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface City {
    name: string;
    code: string;
}
@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, FormsModule, InputGroupModule, InputGroupAddonModule, InputTextModule, InputNumberModule, SelectModule],
    template: `
        <app-docsectiontext>
            <p>A group is created by wrapping the input and add-ons with the <i>p-input-group</i> component. Each add-on element is defined as a child of <i>p-input-group-addon</i> component.</p>
        </app-docsectiontext>
        <div class="card grid grid-cols-1 md:grid-cols-2 gap-4">
            <p-input-group>
                <p-input-group-addon>
                    <i class="pi pi-user"></i>
                </p-input-group-addon>
                <input pInputText [(ngModel)]="text1" placeholder="Username" />
            </p-input-group>

            <p-input-group>
                <p-input-group-addon>$</p-input-group-addon>
                <p-input-number [(ngModel)]="number" placeholder="Price" />
                <p-input-group-addon>.00</p-input-group-addon>
            </p-input-group>

            <p-input-group>
                <p-input-group-addon>www</p-input-group-addon>
                <input pInputText [(ngModel)]="text2" placeholder="Website" />
            </p-input-group>

            <p-input-group>
                <p-input-group-addon>
                    <i class="pi pi-map"></i>
                </p-input-group-addon>
                <p-select [(ngModel)]="selectedCity" [options]="cities" optionLabel="name" placeholder="City" />
            </p-input-group>
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    text1: string | undefined;

    text2: string | undefined;

    number: string | undefined;

    selectedCity: City | undefined;

    cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
}
