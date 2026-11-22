import { Component, inject, signal } from '@angular/core';
import { form, FormField, minLength, submit } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, FileInputModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                FileInput can also be used with <a href="https://angular.dev/guide/forms/signals/overview" target="_blank" rel="noopener noreferrer" class="doc-link">Angular Signal Forms</a>. The <i>[formField]</i> directive binds the component to a
                field holding an array of files. Signal Forms' <i>required</i> does not treat an empty array as empty, so use <i>minLength(field, 1)</i> to require at least one file.
            </p>
        </app-docsectiontext>
        <p-toast />
        <div class="card">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label id="photos-label" class="font-medium">Photos</label>
                    <p-file-input [formField]="listingForm.photos" variant="images" accept="image/*" [maxFiles]="4" ariaLabelledBy="photos-label" />
                    @let photos = listingForm.photos();
                    @if (photos.invalid() && photos.touched()) {
                        <p-message severity="error" size="small" variant="simple">Add at least one photo.</p-message>
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

    model = signal<{ photos: File[] }>({ photos: [] });

    listingForm = form(this.model, (f) => {
        minLength(f.photos, 1);
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.listingForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.listingForm().reset({ photos: [] });
        });
    }
}
