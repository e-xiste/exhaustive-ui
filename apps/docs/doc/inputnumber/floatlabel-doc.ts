import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputNumberModule } from '@exhaustive-ui/core/inputnumber';
import { FloatLabelModule } from '@exhaustive-ui/core/floatlabel';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'floatlabel-doc',
    standalone: true,
    imports: [FormsModule, RouterModule, InputNumberModule, FloatLabelModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                A floating label appears on top of the input field when focused. Visit
                <a routerLink="/floatlabel">FloatLabel</a> documentation for more information.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <p-float-label>
                <p-input-number [(ngModel)]="value1" inputId="over_label" mode="currency" currency="USD" locale="en-US" />
                <label for="over_label">Over Label</label>
            </p-float-label>

            <p-float-label variant="in">
                <p-input-number [(ngModel)]="value2" inputId="in_label" mode="currency" currency="USD" locale="en-US" />
                <label for="in_label">In Label</label>
            </p-float-label>

            <p-float-label variant="on">
                <p-input-number [(ngModel)]="value3" inputId="on_label" mode="currency" currency="USD" locale="en-US" />
                <label for="on_label">On Label</label>
            </p-float-label>
        </div>
        <app-code></app-code>
    `
})
export class FloatlabelDoc {
    value1: number | undefined;

    value2: number | undefined;

    value3: number | undefined;
}
