import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'sizes-doc',
    standalone: true,
    imports: [FormsModule, InputChipsModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>InputChips provides <i>small</i> and <i>large</i> sizes as alternatives to the base.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-4">
            <p-input-chips [(ngModel)]="value1" size="small" ariaLabel="Small" placeholder="Small" />
            <p-input-chips [(ngModel)]="value2" ariaLabel="Normal" placeholder="Normal" />
            <p-input-chips [(ngModel)]="value3" size="large" ariaLabel="Large" placeholder="Large" />
        </div>
        <app-code></app-code>
    `
})
export class SizesDoc {
    value1: string[] = ['small'];

    value2: string[] = ['normal'];

    value3: string[] = ['large'];
}
