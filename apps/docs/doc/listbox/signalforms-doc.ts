import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { ListboxModule } from '@exhaustive-ui/core/listbox';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface City {
    name: string;
    code: string;
}

@Component({
    selector: 'signalforms-doc',
    standalone: true,
    imports: [FormField, ListboxModule, ButtonModule, ToastModule, MessageModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Listbox can also be used with <a href="https://angular.dev/guide/forms/signals/overview" target="_blank" rel="noopener noreferrer" class="doc-link">Angular Signal Forms</a>, the <i>&#64;angular/forms/signals</i> API of Angular 21 and
                newer. The form model is a signal, <i>form()</i> declares its validators and the <i>[formField]</i> directive binds the component to a field. The field also sets the <i>invalid</i> state of the component, so the component is styled as
                invalid before any interaction, while the messages below appear once the field is touched or the form is submitted.
            </p>
        </app-docsectiontext>
        <p-toast />
        <div class="card flex justify-center">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4 sm:w-56">
                <div class="flex flex-col gap-1">
                    <p-listbox [options]="cities" [formField]="exampleForm.selectedCity" optionLabel="name" class="w-full md:w-56" />
                    @let selectedCity = exampleForm.selectedCity();
                    @if (selectedCity.invalid() && selectedCity.touched()) {
                        <p-message severity="error" size="small" variant="simple">City is required.</p-message>
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

    cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    model = signal<{ selectedCity: City | null }>({ selectedCity: null });

    exampleForm = form(this.model, (f) => {
        required(f.selectedCity);
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.exampleForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm().reset({ selectedCity: null });
        });
    }
}
