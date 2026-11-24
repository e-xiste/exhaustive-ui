import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, RichTextEditorModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                RichTextEditor can also be used with <a href="https://angular.dev/guide/forms/signals/overview" target="_blank" rel="noopener noreferrer" class="doc-link">Angular Signal Forms</a>. The <i>[formField]</i> directive binds the component
                to a field holding the HTML, null when empty, so <i>required</i> works. To limit the length, use the <i>maxLength</i> input of the component, which counts the characters of the text, rather than the <i>maxLength</i> validator, which
                would count the HTML tags.
            </p>
        </app-docsectiontext>
        <p-toast />
        <div class="card">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label id="sf-label" class="font-medium">Review</label>
                    @let review = reviewForm.review();
                    <p-rich-text-editor [formField]="reviewForm.review" ariaLabelledBy="sf-label" [toolbar]="['bold', 'italic', 'blockquote']" [maxLength]="280" [showCount]="true" minHeight="5rem" />
                    @if (review.invalid() && review.touched()) {
                        <p-message severity="error" size="small" variant="simple">A review is required.</p-message>
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

    model = signal<{ review: string | null }>({ review: null });

    reviewForm = form(this.model, (f) => {
        required(f.review);
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.reviewForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.reviewForm().reset({ review: null });
        });
    }
}
