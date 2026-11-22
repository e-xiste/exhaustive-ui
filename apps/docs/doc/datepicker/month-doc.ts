import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from '@exhaustive-ui/core/datepicker';

@Component({
    selector: 'month-doc',
    standalone: true,
    imports: [FormsModule, DatePickerModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Month only picker is enabled by specifying <i>view</i> as <i>month</i> in addition to a suitable <i>dateFormat</i>.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-date-picker [(ngModel)]="date" view="month" dateFormat="mm/yy" [readonlyInput]="true" />
        </div>
        <app-code></app-code>
    `
})
export class MonthDoc {
    date: Date[] | undefined;
}
