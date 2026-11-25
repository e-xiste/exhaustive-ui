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
            <p>Custom content can be placed above and below the calendar with the <i>header</i> and <i>footer</i> templates.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-date-picker [(ngModel)]="date" ariaLabel="Date">
                <ng-template #header><div class="font-semibold pb-2">Departure date</div></ng-template>
                <ng-template #footer><div class="text-sm pt-2">Times are in Coordinated Universal Time (UTC).</div></ng-template>
            </p-date-picker>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDoc {
    date: Date | undefined;
}
