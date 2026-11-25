import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from '@exhaustive-ui/core/dialog';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { SelectModule } from '@exhaustive-ui/core/select';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface City {
    name: string;
    code: string;
}

@Component({
    selector: 'overlaysinside-doc',
    standalone: true,
    imports: [FormsModule, DialogModule, ButtonModule, SelectModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                When a Dialog contains components with an overlay such as Select, the overlay cannot exceed the boundaries of the Dialog, whose content scrolls. Set the <i>appendTo</i> property of the component to <i>body</i> to display the overlay
                above the Dialog.
            </p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-button (click)="showDialog()" label="Show" />
            <p-dialog header="Select a City" [modal]="true" [(visible)]="visible" [style]="{ width: '25rem' }">
                <div class="flex py-2 justify-center">
                    <p-select appendTo="body" [options]="cities" [(ngModel)]="selectedCity" placeholder="Select a City" optionLabel="name" ariaLabel="City" class="w-full" />
                </div>
            </p-dialog>
        </div>
        <app-code></app-code>
    `
})
export class OverlaysInsideDoc implements OnInit {
    cities: City[] | undefined;

    selectedCity: City | undefined;

    visible: boolean = false;

    ngOnInit() {
        this.cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
    }

    showDialog() {
        this.visible = true;
    }
}
