import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from '@exhaustive-ui/core/iftalabel';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'invalid-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, FormsModule, IftaLabelModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>When the form element is invalid, the label is also highlighted.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-ifta-label>
                <input pInputText id="username" [(ngModel)]="value" [invalid]="!value" autocomplete="off" />
                <label for="username">Username</label>
            </p-ifta-label>
        </div>
        <app-code></app-code>
    `
})
export class InvalidDoc {
    value: string | undefined;
}
