import { Component, inject, signal } from '@angular/core';
import { form, FormField, submit, validate } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { KnobModule } from '@exhaustive-ui/core/knob';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, KnobModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Knob can also be used with <a href="https://angular.dev/guide/forms/signals/overview" target="_blank" rel="noopener noreferrer" class="doc-link">Angular Signal Forms</a>, the <i>&#64;angular/forms/signals</i> API of Angular 21 and
                newer. The form model is a signal, <i>form()</i> declares its validators and the <i>[formField]</i> directive binds the component to a field. The field also sets the <i>invalid</i> and <i>touched</i> states of the component, so it is
                styled as invalid once the field is touched or the form is submitted, like the messages below.
            </p>
        </app-docsectiontext>
        <p-toast />
        <div class="card flex justify-center">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col items-center gap-4">
                <div class="flex flex-col items-center gap-1">
                    <p-knob [formField]="exampleForm.value" />
                    @let value = exampleForm.value();
                    @if (value.invalid() && (value.dirty() || value.touched())) {
                        @if (value.getError('min')) {
                            <p-message severity="error" size="small" variant="simple">Value must be greater than 25.</p-message>
                        }
                        @if (value.getError('max')) {
                            <p-message severity="error" size="small" variant="simple">Must be less than 75.</p-message>
                        }
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

    model = signal({ value: 15 });

    exampleForm = form(this.model, (f) => {
        // min() and max() would also set the range of the knob, so the bounds are checked by a validator
        validate(f.value, ({ value }) => (value() < 25 ? { kind: 'min' } : value() > 75 ? { kind: 'max' } : null));
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.exampleForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm().reset({ value: 15 });
        });
    }
}
