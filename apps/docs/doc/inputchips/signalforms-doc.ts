import { Component, inject, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, submit } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, InputChipsModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                InputChips can also be used with <a href="https://angular.dev/guide/forms/signals/overview" target="_blank" rel="noopener noreferrer" class="doc-link">Angular Signal Forms</a>. The <i>[formField]</i> directive binds the component to a
                field holding an array of strings. Signal Forms' <i>required</i> does not treat an empty array as empty, so use <i>minLength(field, 1)</i> to require a chip; <i>maxLength</i> on the field limits the number of chips, while
                <i>maxChipLength</i> limits the length of each chip.
            </p>
        </app-docsectiontext>
        <p-toast />
        <div class="card flex justify-center">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4 w-full md:w-[30rem]">
                <div class="flex flex-col gap-2">
                    <label for="topics-sf" class="font-medium">Topics</label>
                    <p-input-chips [formField]="articleForm.topics" inputId="topics-sf" [maxChipLength]="20" fluid />
                    @let topics = articleForm.topics();
                    @if (topics.invalid() && topics.touched()) {
                        <p-message severity="error" size="small" variant="simple">Add between one and three topics.</p-message>
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

    model = signal<{ topics: string[] }>({ topics: [] });

    articleForm = form(this.model, (f) => {
        minLength(f.topics, 1);
        maxLength(f.topics, 3);
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.articleForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.articleForm().reset({ topics: [] });
        });
    }
}
