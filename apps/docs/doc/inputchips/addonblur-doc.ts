import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'addonblur-doc',
    standalone: true,
    imports: [FormsModule, InputChipsModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>With <i>addOnBlur</i>, the text left in the input becomes a chip when the component loses the focus. With <i>addOnTab</i>, the Tab key adds it before moving the focus to the next field.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-4">
            <p-input-chips [(ngModel)]="blurValues" addOnBlur ariaLabel="Add on blur" placeholder="Type and click outside" class="w-full md:w-[30rem]" />
            <p-input-chips [(ngModel)]="tabValues" addOnTab ariaLabel="Add on tab" placeholder="Type and press Tab" class="w-full md:w-[30rem]" />
        </div>
        <app-code></app-code>
    `
})
export class AddOnBlurDoc {
    blurValues: string[] = [];

    tabValues: string[] = [];
}
