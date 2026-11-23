import { Component, inject, signal } from '@angular/core';
import { form, FormField, maxLength, required, submit } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, MentionModule, ButtonModule, MessageModule, ToastModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Mention can also be used with <a href="https://angular.dev/guide/forms/signals/overview" target="_blank" rel="noopener noreferrer" class="doc-link">Angular Signal Forms</a>. The <i>[formField]</i> directive binds the component to a
                field holding the text. The field also sets the <i>invalid</i> state of the component, so the component is styled as invalid before any interaction, while the message appears once the field is touched or the form is submitted.
            </p>
        </app-docsectiontext>
        <p-toast />
        <div class="card">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="sf-note" class="font-medium">Note</label>
                    @let note = noteForm.note();
                    <p-mention [formField]="noteForm.note" inputId="sf-note" [suggestions]="suggestions()" (onSearch)="search($event)" [rows]="3" fluid />
                    @if (note.invalid() && note.touched()) {
                        <p-message severity="error" size="small" variant="simple">A note of at most 140 characters is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit" class="self-start"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
        <app-code></app-code>
    `
})
export class SignalFormsDoc {
    messageService = inject(MessageService);

    users = ['amyelsner', 'annafali', 'bernardodominic', 'ionibowcher', 'xuxuefeng'];

    suggestions = signal<string[]>([]);

    model = signal<{ note: string }>({ note: '' });

    noteForm = form(this.model, (f) => {
        required(f.note);
        maxLength(f.note, 140);
    });

    search(event: MentionSearchEvent) {
        this.suggestions.set(this.users.filter((user) => user.startsWith(event.query.toLowerCase())));
    }

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.noteForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.noteForm().reset({ note: '' });
        });
    }
}
