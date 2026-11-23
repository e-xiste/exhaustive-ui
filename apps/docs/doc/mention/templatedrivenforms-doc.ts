import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'templatedrivenforms-doc',
    standalone: true,
    imports: [FormsModule, MentionModule, ButtonModule, MessageModule, ToastModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>The value is the plain text, so the usual validators such as <i>required</i> and <i>maxlength</i> work as on a textarea.</p>
        </app-docsectiontext>
        <p-toast />
        <div class="card">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="td-comment" class="font-medium">Comment</label>
                    <p-mention #model="ngModel" [(ngModel)]="comment" name="comment" inputId="td-comment" [suggestions]="suggestions" (onSearch)="search($event)" [rows]="3" [invalid]="model.invalid && exampleForm.submitted" required fluid />
                    @if (model.invalid && exampleForm.submitted) {
                        <p-message severity="error" size="small" variant="simple">A comment is required.</p-message>
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

    comment = '';

    users = ['amyelsner', 'annafali', 'bernardodominic', 'ionibowcher', 'xuxuefeng'];

    suggestions: string[] = [];

    search(event: MentionSearchEvent) {
        this.suggestions = this.users.filter((user) => user.startsWith(event.query.toLowerCase()));
    }

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
