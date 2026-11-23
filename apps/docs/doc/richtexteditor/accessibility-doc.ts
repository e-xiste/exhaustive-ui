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
                The editable area has the <i>textbox</i> role with <i>aria-multiline</i>, and is named with <i>ariaLabelledBy</i> or <i>ariaLabel</i>; <i>ariaDescribedBy</i> links a hint or an error message. It also reports <i>aria-invalid</i>,
                <i>aria-required</i>, <i>aria-readonly</i>, <i>aria-disabled</i> and the placeholder with <i>aria-placeholder</i>. The toolbar follows the
                <a href="https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/" target="_blank" rel="noopener noreferrer" class="doc-link">WAI-ARIA toolbar pattern</a>: it has the <i>toolbar</i> role, a label and <i>aria-controls</i>, and only one button
                is in the tab order. Every button has a label, its shortcut in <i>aria-keyshortcuts</i>, and the formatting buttons tell whether they apply to the selection with <i>aria-pressed</i>. A button that cannot apply, such as undo with
                nothing to undo, has <i>aria-disabled</i>. The link panel is a labelled dialog whose field has a visible label and an error message linked with <i>aria-describedby</i>. When <i>showCount</i> is set, the count describes the editable
                area and reaching <i>maxLength</i> is announced. Every text can be replaced through <i>labels</i>.
            </p>
        </app-docsectiontext>

        <app-code [code]="code" [hideToggleCode]="true" [hideCodeSandbox]="true" [hideStackBlitz]="true"></app-code>

        <h3>Toolbar Keyboard Support</h3>
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
                        <td><i>tab</i></td>
                        <td>Moves the focus to the last focused button of the toolbar, then to the editable area.</td>
                    </tr>
                    <tr>
                        <td><i>right arrow</i> / <i>left arrow</i></td>
                        <td>Moves the focus to the next or previous button, wrapping around. Reversed in right-to-left.</td>
                    </tr>
                    <tr>
                        <td><i>home</i> / <i>end</i></td>
                        <td>Moves the focus to the first or last button.</td>
                    </tr>
                    <tr>
                        <td><i>enter</i> / <i>space</i></td>
                        <td>Runs the focused button, the focus stays on it.</td>
                    </tr>
                    <tr>
                        <td><i>escape</i></td>
                        <td>Moves the focus back to the editable area.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>Editable Area Keyboard Support</h3>
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
                        <td><i>alt</i> + <i>F10</i></td>
                        <td>Moves the focus to the toolbar.</td>
                    </tr>
                    <tr>
                        <td><i>ctrl</i> / <i>cmd</i> + <i>b</i>, <i>i</i>, <i>u</i></td>
                        <td>Toggles bold, italic and underline.</td>
                    </tr>
                    <tr>
                        <td><i>ctrl</i> / <i>cmd</i> + <i>shift</i> + <i>s</i>, <i>ctrl</i> / <i>cmd</i> + <i>e</i></td>
                        <td>Toggles strikethrough and inline code.</td>
                    </tr>
                    <tr>
                        <td><i>ctrl</i> / <i>cmd</i> + <i>alt</i> + <i>1</i> to <i>3</i></td>
                        <td>Toggles a heading of level 1 to 3.</td>
                    </tr>
                    <tr>
                        <td><i>ctrl</i> / <i>cmd</i> + <i>shift</i> + <i>8</i>, <i>7</i>, <i>b</i></td>
                        <td>Toggles a bullet list, a numbered list and a quote.</td>
                    </tr>
                    <tr>
                        <td><i>ctrl</i> / <i>cmd</i> + <i>alt</i> + <i>c</i></td>
                        <td>Toggles a code block.</td>
                    </tr>
                    <tr>
                        <td><i>ctrl</i> / <i>cmd</i> + <i>k</i></td>
                        <td>Opens the link panel when the toolbar has a link button.</td>
                    </tr>
                    <tr>
                        <td><i>ctrl</i> / <i>cmd</i> + <i>shift</i> + <i>l</i>, <i>e</i>, <i>r</i>, <i>j</i></td>
                        <td>Aligns the block left, center, right or justified.</td>
                    </tr>
                    <tr>
                        <td><i>ctrl</i> / <i>cmd</i> + <i>z</i>, <i>ctrl</i> / <i>cmd</i> + <i>shift</i> + <i>z</i></td>
                        <td>Undoes and redoes.</td>
                    </tr>
                    <tr>
                        <td><i>tab</i> / <i>shift</i> + <i>tab</i></td>
                        <td>In a list, indents or outdents the item. Elsewhere, moves the focus out of the editor.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>Link Panel Keyboard Support</h3>
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
                        <td>Applies the URL typed in the field.</td>
                    </tr>
                    <tr>
                        <td><i>escape</i></td>
                        <td>Closes the panel and moves the focus back to the editable area.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`
})
export class AccessibilityDoc {
    code: Code = {
        html: `<label id="body-label">Message</label>
<p-rich-text-editor ariaLabelledBy="body-label" ariaDescribedBy="body-hint" />
<small id="body-hint">Markdown shortcuts are supported.</small>`
    };
}
