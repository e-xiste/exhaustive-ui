import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'invalid-doc',
    standalone: true,
    imports: [FormsModule, InputChipsModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>The invalid state is applied using the <i>invalid</i> property to indicate failed validation.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center gap-4">
            <p-inputchips [(ngModel)]="value1" [invalid]="value1.length === 0" ariaLabel="Tags" placeholder="Tags" />
            <p-inputchips [(ngModel)]="value2" [invalid]="value2.length === 0" variant="filled" ariaLabel="Tags" placeholder="Tags" />
        </div>
        <app-code></app-code>
    `
})
export class InvalidDoc {
    value1: string[] = [];

    value2: string[] = [];
}
