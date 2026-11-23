import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'filled-doc',
    standalone: true,
    imports: [FormsModule, InputChipsModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Specify the <i>variant</i> property as <i>filled</i> to display the component with a higher visual emphasis than the default <i>outlined</i> style.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-input-chips [(ngModel)]="value" variant="filled" ariaLabel="Filled" placeholder="Add a tag" />
        </div>
        <app-code></app-code>
    `
})
export class FilledDoc {
    value: string[] = [];
}
