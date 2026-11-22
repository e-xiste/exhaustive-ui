import { Component, inject } from '@angular/core';
import { MessageService } from '@exhaustive-ui/core/api';
import { FormsModule } from '@angular/forms';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'templatedrivenforms-doc',
    standalone: true,
    imports: [FormsModule, FileInputModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>The value is an array of files, empty when nothing is selected, so <i>required</i> works as on the other fields. Resetting the form clears the files.</p>
        </app-docsectiontext>
        <p-toast />
        <div class="card">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label id="receipts-label" class="font-medium">Receipts</label>
                    <p-file #model="ngModel" [(ngModel)]="receipts" name="receipts" ariaLabelledBy="receipts-label" size="small" accept="image/*,.pdf" [invalid]="model.invalid && exampleForm.submitted" required />
                    @if (model.invalid && exampleForm.submitted) {
                        <p-message severity="error" size="small" variant="simple">At least one receipt is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit" class="self-start"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDrivenFormsDoc {
    messageService = inject(MessageService);

    receipts: File[] = [];

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
