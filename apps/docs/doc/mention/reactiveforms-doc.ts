import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'reactiveforms-doc',
    standalone: true,
    imports: [ReactiveFormsModule, MentionModule, ButtonModule, MessageModule, ToastModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Mention can also be used with reactive forms. In this case, the <i>formControlName</i> property is used to bind the component to a form control.</p>
        </app-docsectiontext>
        <p-toast />
        <div class="card">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="rf-message" class="font-medium">Message</label>
                    <p-mention formControlName="message" inputId="rf-message" [suggestions]="suggestions" (onSearch)="search($event)" [rows]="3" [invalid]="isInvalid('message')" fluid />
                    @if (isInvalid('message')) {
                        <p-message severity="error" size="small" variant="simple">Mention at least one person.</p-message>
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

    users = ['amyelsner', 'annafali', 'bernardodominic', 'ionibowcher', 'xuxuefeng'];

    suggestions: string[] = [];

    exampleForm: FormGroup;

    formSubmitted = false;

    constructor(private fb: FormBuilder) {
        this.exampleForm = this.fb.group({
            message: ['', [Validators.required, Validators.pattern(/(^|\s)@\S+/)]]
        });
    }

    search(event: MentionSearchEvent) {
        this.suggestions = this.users.filter((user) => user.startsWith(event.query.toLowerCase()));
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm.reset({ message: '' });
            this.formSubmitted = false;
        }
    }

    isInvalid(controlName: string) {
        const control = this.exampleForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
    }
}
