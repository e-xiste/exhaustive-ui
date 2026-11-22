import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from '@exhaustive-ui/core/datepicker';
import { InputMaskModule } from '@exhaustive-ui/core/inputmask';

@Component({
    selector: 'mask-doc',
    standalone: true,
    imports: [FormsModule, DatePickerModule, InputMaskModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>DatePicker can be used with the <i>pInputMask</i> directive to enforce a specific input format.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-date-picker [(ngModel)]="date" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" pInputMask="99/99/9999" ariaLabel="Date" />
        </div>
        <app-code></app-code>
    `
})
export class MaskDoc {
    date: Date | undefined;
}
