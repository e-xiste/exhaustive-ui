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
                The chips are the options of a horizontal <i>listbox</i>, followed by a text input. Label the component with a <i>label</i> element pointing at <i>inputId</i>, with <i>ariaLabelledBy</i> or with <i>ariaLabel</i>: the input and the
                list get the same name (the list falls back to the <i>listLabel</i> text). Each chip reports its position in the list, and the list is described by the keys that remove a chip. The remove icon is hidden from screen readers, since the
                keyboard removes the focused chip. A polite live region announces the chips added and removed, duplicates, rejected values and the <i>max</i> limit.
            </p>
            <p>All these texts can be replaced, or translated, with the <i>labels</i> input.</p>
        </app-docsectiontext>

        <app-code [code]="code" [hideToggleCode]="true" [hideCodeSandbox]="true" [hideStackBlitz]="true"></app-code>

        <h3>Input Keyboard Support</h3>
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
                        <td><i>enter</i></td>
                        <td>Adds the text as a chip. On an empty input, the key is left to the form.</td>
                    </tr>
                    <tr>
                        <td><i>tab</i></td>
                        <td>Moves the focus to the next field, adding the text first when addOnTab is set.</td>
                    </tr>
                    <tr>
                        <td><i>backspace</i></td>
                        <td>On an empty input, moves the focus to the last chip.</td>
                    </tr>
                    <tr>
                        <td><i>left arrow</i></td>
                        <td>At the start of the input, moves the focus to the last chip (right arrow in a right-to-left layout).</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>Chip Keyboard Support</h3>
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
                        <td><i>left arrow</i></td>
                        <td>Moves the focus to the previous chip.</td>
                    </tr>
                    <tr>
                        <td><i>right arrow</i></td>
                        <td>Moves the focus to the next chip, or to the input after the last chip.</td>
                    </tr>
                    <tr>
                        <td><i>home</i> / <i>end</i></td>
                        <td>Moves the focus to the first or the last chip.</td>
                    </tr>
                    <tr>
                        <td><i>backspace</i></td>
                        <td>Removes the chip and moves the focus to the previous one.</td>
                    </tr>
                    <tr>
                        <td><i>delete</i></td>
                        <td>Removes the chip and moves the focus to the next one.</td>
                    </tr>
                    <tr>
                        <td><i>enter</i> / <i>space</i></td>
                        <td>Emits onChipClick.</td>
                    </tr>
                    <tr>
                        <td><i>escape</i></td>
                        <td>Moves the focus back to the input.</td>
                    </tr>
                    <tr>
                        <td>any character</td>
                        <td>Moves the focus to the input, where the character is typed.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p>The arrows are mirrored in a right-to-left layout. When the last chip is removed, the focus goes back to the input.</p>
    </div>`
})
export class AccessibilityDoc {
    code: Code = {
        html: `<label for="tags">Tags</label>
<p-inputchips inputId="tags" />

<span id="recipients">Recipients</span>
<p-inputchips ariaLabelledBy="recipients" />

<p-inputchips ariaLabel="Keywords" [labels]="{ addedMessage: '{0} ajouté', removedMessage: '{0} supprimé' }" />`
    };
}
