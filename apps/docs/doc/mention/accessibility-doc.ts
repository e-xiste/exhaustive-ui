import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'accessibility-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText],
    template: ` <div>
        <app-docsectiontext>
            <h3>Screen Reader</h3>
            <p>
                Mention follows the <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" target="_blank" rel="noopener noreferrer" class="doc-link">combobox pattern</a> with a listbox popup, while the focus stays in the field. The field has
                <i>aria-autocomplete="list"</i>; while suggestions are shown, <i>aria-controls</i> points to the listbox and <i>aria-activedescendant</i> to the highlighted option, which has <i>aria-selected</i> along with its position in the list
                (<i>aria-posinset</i>, <i>aria-setsize</i>). The single-line input has the <i>combobox</i> role and <i>aria-expanded</i>. A textarea cannot take the combobox role in HTML, so the multiline field keeps its native textbox role with the
                same attributes, as GitHub and Slack comment boxes do.
            </p>
            <p>
                A polite live region announces the number of suggestions, the empty message and the loading state. Its texts come from <i>searchMessage</i>, <i>emptyMessage</i> and <i>loadingMessage</i>, or from the <i>searchMessage</i> and
                <i>emptySearchMessage</i> keys of the translation configuration, and the listbox is labelled with the <i>aria.listLabel</i> key. Give the field a name with a <i>label</i> and <i>inputId</i>, <i>ariaLabelledBy</i> or <i>ariaLabel</i>,
                and describe it with <i>ariaDescribedBy</i>.
            </p>
        </app-docsectiontext>

        <app-code [code]="code" [hideToggleCode]="true" [hideCodeSandbox]="true" [hideStackBlitz]="true"></app-code>

        <h3>Keyboard Support</h3>
        <div class="doc-tablewrapper">
            <table class="doc-table">
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Function</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><i>trigger</i> such as <i>&#64;</i></td>
                        <td>Typed at the start of a word, opens the suggestions; the following characters filter them.</td>
                    </tr>
                    <tr>
                        <td><i>down arrow</i></td>
                        <td>Highlights the next suggestion.</td>
                    </tr>
                    <tr>
                        <td><i>up arrow</i></td>
                        <td>Highlights the previous suggestion.</td>
                    </tr>
                    <tr>
                        <td><i>page down</i> / <i>page up</i></td>
                        <td>Highlights the last or the first suggestion.</td>
                    </tr>
                    <tr>
                        <td><i>enter</i> / <i>tab</i></td>
                        <td>Inserts the highlighted suggestion. Without one, enter inserts a new line and tab moves the focus as usual.</td>
                    </tr>
                    <tr>
                        <td><i>escape</i></td>
                        <td>Closes the suggestions; they stay closed until the caret leaves the mention.</td>
                    </tr>
                    <tr>
                        <td><i>space</i></td>
                        <td>Ends the mention and closes the suggestions.</td>
                    </tr>
                    <tr>
                        <td><i>home</i> / <i>end</i>, <i>left</i> / <i>right arrow</i></td>
                        <td>Move the caret in the text, opening the suggestions again when it enters a mention.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`
})
export class AccessibilityDoc {
    code: Code = {
        html: `<label for="comment">Comment</label>
<p-mention inputId="comment" [suggestions]="suggestions" (onSearch)="search($event)" />

<span id="title-label">Task title</span>
<p-mention ariaLabelledBy="title-label" [multiline]="false" [suggestions]="suggestions" (onSearch)="search($event)" />`
    };
}
