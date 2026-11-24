import { Component, inject, signal } from '@angular/core';
import { form, FormField, submit, validate } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { SliderModule } from '@exhaustive-ui/core/slider';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, SliderModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Slider can also be used with <a href="https://angular.dev/guide/forms/signals/overview" target="_blank" rel="noopener noreferrer" class="doc-link">Angular Signal Forms</a>, the <i>&#64;angular/forms/signals</i> API of Angular 21 and
                newer. The form model is a signal, <i>form()</i> declares its validators and the <i>[formField]</i> directive binds the component to a field. The field also sets the <i>invalid</i> and <i>touched</i> states of the component, so it is
                styled as invalid once the field is touched or the form is submitted, like the messages below.
            </p>
        </app-docsectiontext>
        <p-toast />
        <div class="card flex justify-center">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-4">
                    <p-slider [formField]="exampleForm.value" class="w-56" ariaLabel="Volume" />
                    @let value = exampleForm.value();
                    @if (value.invalid() && value.touched()) {
                        <p-message severity="error" size="small" variant="simple">Must be greater than 25.</p-message>
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

    model = signal({ value: 0 });

    exampleForm = form(this.model, (f) => {
        // min() would also set the start of the slider range, so the lower bound is checked by a validator
        validate(f.value, ({ value }) => (value() > 25 ? null : { kind: 'min' }));
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.exampleForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm().reset({ value: 0 });
        });
    }
}
