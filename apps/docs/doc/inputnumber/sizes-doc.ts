import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from '@exhaustive-ui/core/inputnumber';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'sizes-doc',
    standalone: true,
    imports: [FormsModule, InputNumberModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>InputNumber provides <i>small</i> and <i>large</i> sizes as alternatives to the base.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-4">
            <p-input-number [(ngModel)]="value1" size="small" placeholder="Small" mode="currency" currency="USD" locale="en-US" ariaLabel="Small" />
            <p-input-number [(ngModel)]="value2" placeholder="Normal" mode="currency" currency="USD" locale="en-US" ariaLabel="Normal" />
            <p-input-number [(ngModel)]="value3" size="large" placeholder="Large" mode="currency" currency="USD" locale="en-US" ariaLabel="Large" />
        </div>
        <app-code></app-code>
    `
})
export class SizesDoc {
    value1!: number;

    value2!: number;

    value3!: number;
}
