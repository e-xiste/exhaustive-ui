import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AutoFocusModule } from '@exhaustive-ui/core/autofocus';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { CheckboxModule } from '@exhaustive-ui/core/checkbox';
import { FocusTrapModule } from '@exhaustive-ui/core/focustrap';
import { IconFieldModule } from '@exhaustive-ui/core/iconfield';
import { InputIconModule } from '@exhaustive-ui/core/inputicon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [FormsModule, AppCode, AppDocSectionText, AutoFocusModule, ButtonModule, CheckboxModule, FocusTrapModule, IconFieldModule, InputIconModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>FocusTrap is applied to a container element with the <i>pFocusTrap</i> directive.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <div pFocusTrap class="w-full sm:w-80 flex flex-col gap-6">
                <p-icon-field>
                    <p-input-icon>
                        <i class="pi pi-user"></i>
                    </p-input-icon>
                    <input type="text" pInputText id="input" [(ngModel)]="name" type="text" placeholder="Name" [pAutoFocus]="true" [fluid]="true" />
                </p-icon-field>

                <p-icon-field>
                    <p-input-icon>
                        <i class="pi pi-envelope"> </i>
                    </p-input-icon>
                    <input type="text" pInputText id="email" [(ngModel)]="email" type="email" placeholder="Email" [fluid]="true" />
                </p-icon-field>

                <div class="flex items-center gap-2">
                    <p-checkbox id="accept" [(ngModel)]="accept" name="accept" value="Accept" />
                    <label for="accept">I agree to the terms and conditions.</label>
                </div>

                <p-button type="submit" label="Submit" class="mt-2" styleClass="w-full" />
            </div>
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    name: string = '';

    email: string = '';

    accept: boolean = false;
}
