import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'reactiveforms-doc',
    standalone: true,
    imports: [ReactiveFormsModule, FileInputModule, ToastModule, MessageModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>FileInput can also be used with reactive forms. In this case, the <i>formControlName</i> property is used to bind the component to a form control.</p>
        </app-docsectiontext>
        <p-toast />
        <div class="card">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label id="documents-label" class="font-medium">Documents</label>
                    <p-file-input formControlName="documents" ariaLabelledBy="documents-label" size="small" [maxFiles]="3" [invalid]="isInvalid('documents')" />
                    @if (isInvalid('documents')) {
                        <p-message severity="error" size="small" variant="simple">At least one document is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit" class="self-start"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
        <app-code></app-code>
    `
})
export class ReactiveFormsDoc {
    messageService = inject(MessageService);

    exampleForm: FormGroup;

    formSubmitted: boolean = false;

    constructor(private fb: FormBuilder) {
        this.exampleForm = this.fb.group({
            documents: [[], Validators.required]
        });
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm.reset({ documents: [] });
            this.formSubmitted = false;
        }
    }

    isInvalid(controlName: string) {
        const control = this.exampleForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
    }
}
