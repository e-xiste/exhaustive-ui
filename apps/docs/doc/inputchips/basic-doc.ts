import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [FormsModule, InputChipsModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                InputChips is bound with <i>ngModel</i> and its value is an array of strings. Type a value and press <i>Enter</i> to add it as a chip; the text is trimmed and a value that is already in the list is not added twice. Click the icon of a
                chip, or press <i>Backspace</i> in the empty input and then <i>Backspace</i> again, to remove it.
            </p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-inputchips [(ngModel)]="tags" ariaLabel="Tags" placeholder="Add a tag" class="w-full md:w-[30rem]" />
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    tags: string[] = ['angular', 'signals'];
}
