import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { FloatLabelModule } from '@exhaustive-ui/core/floatlabel';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { SelectModule } from '@exhaustive-ui/core/select';

@Component({
    selector: 'sizes-doc',
    standalone: true,
    imports: [FormsModule, AppCode, AppDocSectionText, FloatLabelModule, InputTextModule, SelectModule],
    template: `
        <app-docsectiontext>
            <p>The label follows the <i>small</i> and <i>large</i> sizes of the field it wraps, in every variant: its inset, its font size and, for the <i>in</i> variant, the vertical room left for it.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-6">
            <div class="flex flex-wrap justify-center items-end gap-4">
                <p-floatlabel variant="in">
                    <input pInputText id="small_input" pSize="small" [(ngModel)]="value1" autocomplete="off" />
                    <label for="small_input">Small</label>
                </p-floatlabel>
                <p-floatlabel variant="in">
                    <input pInputText id="normal_input" [(ngModel)]="value2" autocomplete="off" />
                    <label for="normal_input">Normal</label>
                </p-floatlabel>
                <p-floatlabel variant="in">
                    <input pInputText id="large_input" pSize="large" [(ngModel)]="value3" autocomplete="off" />
                    <label for="large_input">Large</label>
                </p-floatlabel>
            </div>
            <div class="flex flex-wrap justify-center items-end gap-4">
                <p-floatlabel variant="on">
                    <p-select [(ngModel)]="city1" inputId="small_select" [options]="cities" size="small" class="w-56" />
                    <label for="small_select">Small</label>
                </p-floatlabel>
                <p-floatlabel variant="on">
                    <p-select [(ngModel)]="city2" inputId="normal_select" [options]="cities" class="w-56" />
                    <label for="normal_select">Normal</label>
                </p-floatlabel>
                <p-floatlabel variant="on">
                    <p-select [(ngModel)]="city3" inputId="large_select" [options]="cities" size="large" class="w-56" />
                    <label for="large_select">Large</label>
                </p-floatlabel>
            </div>
        </div>
        <app-code></app-code>
    `
})
export class SizesDoc {
    value1: string | undefined;

    value2: string | undefined;

    value3: string | undefined;

    city1: string | undefined;

    city2: string | undefined;

    city3: string | undefined;

    cities = ['New York', 'Rome', 'London', 'Istanbul', 'Paris'];
}
