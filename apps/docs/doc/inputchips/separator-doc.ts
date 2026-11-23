import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'separator-doc',
    standalone: true,
    imports: [FormsModule, InputChipsModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>A <i>separator</i>, a string or a regular expression, splits the text into several chips as it is typed or pasted. Pasting several lines always adds one chip per line. Try pasting <i>red, green, blue</i> below.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-4">
            <p-input-chips [(ngModel)]="colors" separator="," ariaLabel="Colors" placeholder="Comma separated" class="w-full md:w-[30rem]" />
            <p-input-chips [(ngModel)]="emails" [separator]="pattern" ariaLabel="Recipients" placeholder="Separated by a comma, a semicolon or a space" class="w-full md:w-[30rem]" />
        </div>
        <app-code></app-code>
    `
})
export class SeparatorDoc {
    colors: string[] = [];

    emails: string[] = [];

    pattern = /[,;\s]/;
}
