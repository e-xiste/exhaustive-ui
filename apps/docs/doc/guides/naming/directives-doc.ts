import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'directives-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>
                A directive enhances an element you write yourself, so it is an attribute, not an element. Its name is <i>p</i> followed by the name of the directive in camel case, as Angular attributes are: <i>pInputText</i> on an input,
                <i>pButton</i> on a button, <i>pTooltip</i> on any element. There is no <i>p-input-text</i> element: InputText is the <i>pInputText</i> directive.
            </p>
            <p>The directives that only make sense inside a TreeTable row keep the <i>tt</i> prefix of TreeTable, such as <i>ttRow</i> and <i>ttSortableColumn</i>.</p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class DirectivesDoc {
    code: Code = {
        html: `<input pInputText [(ngModel)]="value" />
<textarea pTextarea [(ngModel)]="text"></textarea>
<button pButton pTooltip="Save the form" type="submit"><span pButtonLabel>Save</span></button>`
    };
}
