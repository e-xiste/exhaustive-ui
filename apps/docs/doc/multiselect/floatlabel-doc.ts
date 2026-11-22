import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MultiSelectModule } from '@exhaustive-ui/core/multiselect';
import { FloatLabelModule } from '@exhaustive-ui/core/floatlabel';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface City {
    name: string;
    code: string;
}

@Component({
    selector: 'floatlabel-doc',
    standalone: true,
    imports: [FormsModule, RouterModule, MultiSelectModule, FloatLabelModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                A floating label appears on top of the input field when focused. Visit
                <a routerLink="/floatlabel">FloatLabel</a> documentation for more information.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <p-float-label class="w-full md:w-80">
                <p-multi-select id="over_label" [(ngModel)]="value1" [options]="cities" optionLabel="name" filter [maxSelectedLabels]="3" class="w-full" />
                <label for="over_label">Over Label</label>
            </p-float-label>

            <p-float-label class="w-full md:w-80" variant="in">
                <p-multi-select id="in_label" [(ngModel)]="value2" [options]="cities" optionLabel="name" filter [maxSelectedLabels]="3" class="w-full" />
                <label for="in_label">In Label</label>
            </p-float-label>

            <p-float-label class="w-full md:w-80" variant="on">
                <p-multi-select id="on_label" [(ngModel)]="value3" [options]="cities" optionLabel="name" filter [maxSelectedLabels]="3" class="w-full" />
                <label for="on_label">On Label</label>
            </p-float-label>
        </div>
        <app-code></app-code>
    `
})
export class FloatLabelDoc implements OnInit {
    cities!: City[];

    value1!: City[];

    value2!: City[];

    value3!: City[];

    ngOnInit() {
        this.cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
    }
}
