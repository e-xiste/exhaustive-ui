import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'templatedrivenforms-doc',
    standalone: true,
    imports: [FormsModule, RichTextEditorModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>The value is null while the editor is empty, so <i>required</i> works as on the other fields. The control is marked as touched when the editable area loses the focus.</p>
        </app-docsectiontext>
        <p-toast />
        <div class="card">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label id="td-label" class="font-medium">Message</label>
                    <p-rich-text-editor
                        #model="ngModel"
                        [(ngModel)]="message"
                        name="message"
                        ariaLabelledBy="td-label"
                        [toolbar]="['bold', 'italic', 'link']"
                        minHeight="5rem"
                        [invalid]="model.invalid && (model.touched || exampleForm.submitted)"
                        required
                    />
                    @if (model.invalid && (model.touched || exampleForm.submitted)) {
                        <p-message severity="error" size="small" variant="simple">A message is required.</p-message>
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

    message: string | null = null;

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
