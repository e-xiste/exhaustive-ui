import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { FloatLabelModule } from '@exhaustive-ui/core/floatlabel';
import { RouterModule } from '@angular/router';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'floatlabel-doc',
    standalone: true,
    imports: [FormsModule, InputChipsModule, FloatLabelModule, RouterModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>A floating label appears on top of the input field when focused. Visit <a routerLink="/floatlabel">FloatLabel</a> documentation for more information.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <p-floatlabel>
                <p-inputchips [(ngModel)]="value1" inputId="over_label" />
                <label for="over_label">Over Label</label>
            </p-floatlabel>

            <p-floatlabel variant="in">
                <p-inputchips [(ngModel)]="value2" inputId="in_label" />
                <label for="in_label">In Label</label>
            </p-floatlabel>

            <p-floatlabel variant="on">
                <p-inputchips [(ngModel)]="value3" inputId="on_label" />
                <label for="on_label">On Label</label>
            </p-floatlabel>
        </div>
        <app-code></app-code>
    `
})
export class FloatLabelDoc {
    value1: string[] = [];

    value2: string[] = [];

    value3: string[] = [];
}
