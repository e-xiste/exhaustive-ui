import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { ColorPickerModule } from '@exhaustive-ui/core/colorpicker';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'reactiveforms-doc',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ColorPickerModule, ButtonModule, MessageModule, ToastModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>ColorPicker can also be used with reactive forms. In this case, the <i>formControlName</i> property is used to bind the component to a form control.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-toast />
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                <div class="flex flex-col items-center gap-2">
                    <p-color-picker formControlName="color" defaultColor="989898" />
                    @if (isInvalid('color')) {
                        <p-message severity="error" size="small" variant="simple">Color is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
        <app-code></app-code>
    `
})
export class ReactiveFormsDoc {
    messageService = inject(MessageService);

    exampleForm: FormGroup;

    formSubmitted = false;

    constructor(private fb: FormBuilder) {
        this.exampleForm = this.fb.group({
            color: ['', Validators.required]
        });
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm.reset();
            this.formSubmitted = false;
        }
    }

    isInvalid(controlName: string) {
        const control = this.exampleForm.get(controlName);
        return control?.invalid && this.formSubmitted;
    }
}
