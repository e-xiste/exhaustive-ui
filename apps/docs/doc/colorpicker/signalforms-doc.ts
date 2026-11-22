import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { ColorPickerModule } from '@exhaustive-ui/core/colorpicker';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, ColorPickerModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                ColorPicker can also be used with <a href="https://angular.dev/guide/forms/signals/overview" target="_blank" rel="noopener noreferrer" class="doc-link">Angular Signal Forms</a>, the <i>&#64;angular/forms/signals</i> API of Angular 21
                and newer. The form model is a signal, <i>form()</i> declares its validators and the <i>[formField]</i> directive binds the component to a field. The field also sets the <i>invalid</i> state of the component, so the component is
                styled as invalid before any interaction, while the messages below appear once the field is touched or the form is submitted.
            </p>
        </app-docsectiontext>
        <p-toast />
        <div class="card flex justify-center">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4">
                <div class="flex flex-col items-center gap-2">
                    <p-colorpicker [formField]="exampleForm.color" defaultColor="989898" />
                    @let color = exampleForm.color();
                    @if (color.invalid() && color.touched()) {
                        <p-message severity="error" size="small" variant="simple">Color is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
        <app-code></app-code>
    `
})
export class SignalFormsDoc {
    messageService = inject(MessageService);

    model = signal({ color: '' });

    exampleForm = form(this.model, (f) => {
        required(f.color);
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.exampleForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm().reset({ color: '' });
        });
    }
}
