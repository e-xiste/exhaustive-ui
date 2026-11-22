import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from '@exhaustive-ui/core/datepicker';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'template-doc',
    standalone: true,
    imports: [FormsModule, DatePickerModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>DatePicker accepts custom content using <i>header</i> and <i>footer</i> templates.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-date-picker [(ngModel)]="date">
                <ng-template #header>Header</ng-template>
                <ng-template #footer>Footer</ng-template>
            </p-date-picker>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDoc {
    date: Date[] | undefined;
}
