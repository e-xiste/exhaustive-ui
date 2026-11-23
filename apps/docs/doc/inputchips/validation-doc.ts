import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule, InputChipsRejectEvent } from '@exhaustive-ui/core/inputchips';
import { MessageModule } from '@exhaustive-ui/core/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'validation-doc',
    standalone: true,
    imports: [FormsModule, InputChipsModule, MessageModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p><i>transform</i> turns each value into the text of its chip, here in lowercase, and <i>validate</i> decides whether it can be added. A rejected value stays in the input so that it can be corrected, and <i>onReject</i> tells why.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-2">
            <label for="recipients" class="font-medium self-start md:self-center">Recipients</label>
            <p-input-chips [(ngModel)]="recipients" inputId="recipients" separator="," [transform]="lowercase" [validate]="isEmail" [invalid]="!!error()" (onReject)="onReject($event)" (onAdd)="error.set('')" class="w-full md:w-[30rem]" />
            @if (error()) {
                <p-message severity="error" size="small" variant="simple">{{ error() }}</p-message>
            }
        </div>
        <app-code></app-code>
    `
})
export class ValidationDoc {
    recipients: string[] = ['ada@example.com'];

    error = signal('');

    lowercase = (value: string) => value.toLowerCase();

    isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    onReject(event: InputChipsRejectEvent) {
        this.error.set(event.reason === 'duplicate' ? `${event.value} is already a recipient.` : `${event.value} is not an email address.`);
    }
}
