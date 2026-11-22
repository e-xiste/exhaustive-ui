import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from '@exhaustive-ui/core/datepicker';

@Component({
    selector: 'fluid-doc',
    standalone: true,
    imports: [FormsModule, DatePickerModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>The fluid prop makes the component take up the full width of its container when set to true.</p>
        </app-docsectiontext>
        <div class="card">
            <p-date-picker [(ngModel)]="date" fluid ariaLabel="Date" />
        </div>
        <app-code></app-code>
    `
})
export class FluidDoc {
    date: Date | undefined;
}
