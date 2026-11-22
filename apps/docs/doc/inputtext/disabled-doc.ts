import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'disabled-doc',
    standalone: true,
    imports: [FormsModule, InputTextModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>When <i>disabled</i> is present, the element cannot be edited and focused.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <input pInputText [disabled]="true" [(ngModel)]="value" aria-label="Name" />
        </div>
        <app-code></app-code>
    `
})
export class DisabledDoc {
    value: string | undefined = 'Disabled';
}
