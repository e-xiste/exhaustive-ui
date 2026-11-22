import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { FloatLabelModule } from '@exhaustive-ui/core/floatlabel';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    selector: 'variants-doc',
    standalone: true,
    imports: [FormsModule, AppCode, AppDocSectionText, FloatLabelModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>The <i>variant</i> property defines the position of the label. Default value is <i>over</i>, whereas <i>in</i> and <i>on</i> are the alternatives.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <p-float-label variant="in">
                <input pInputText id="in_label" [(ngModel)]="value1" autocomplete="off" />
                <label for="in_label">In Label</label>
            </p-float-label>

            <p-float-label variant="on">
                <input pInputText id="on_label" [(ngModel)]="value2" autocomplete="off" />
                <label for="on_label">On Label</label>
            </p-float-label>
        </div>
        <app-code></app-code>
    `
})
export class VariantsDoc {
    value1: string | undefined;

    value2: string | undefined;
}
