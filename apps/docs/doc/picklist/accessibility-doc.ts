import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'accessibility-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, RouterModule],
    template: ` <app-docsectiontext>
        <h3>Screen Reader</h3>
        <p>
            Value to describe the source listbox and target listbox can be provided with <i>sourceAriaLabel</i> and <i>targetAriaLabel</i> props, which default to <i>sourceHeader</i> and <i>targetHeader</i>. The list elements has a
            <i>listbox</i> role with the <i>aria-multiselectable</i> attribute. Each list item has an <i>option</i> role with <i>aria-selected</i> and <i>aria-disabled</i> as their attributes.
        </p>
        <p>
            Controls buttons are <i>button</i> elements with an <i>aria-label</i> that refers to the <i>aria.moveTop</i>, <i>aria.moveUp</i>, <i>aria.moveDown</i>, <i>aria.moveBottom</i>, <i>aria.moveToTarget</i>, <i>aria.moveAllToTarget</i>,
            <i>aria.moveToSource</i> and <i>aria.moveAllToSource</i> properties of the <a href="/configuration/#locale">locale</a> API by default. They can be overridden with <i>topButtonAriaLabel</i>, <i>upButtonAriaLabel</i>,
            <i>downButtonAriaLabel</i>, <i>bottomButtonAriaLabel</i>, <i>rightButtonAriaLabel</i>, <i>allRightButtonAriaLabel</i>, <i>leftButtonAriaLabel</i> and <i>allLeftButtonAriaLabel</i>. The buttons can be customized with <i>buttonProps</i>,
            <i>moveTopButtonProps</i>, <i>moveUpButtonProps</i>, <i>moveDownButtonProps</i>, <i>moveBottomButtonProps</i>, <i>moveToTargetProps</i>, <i>moveAllToTargetProps</i>, <i>moveToSourceProps</i> and <i>moveAllToSourceProps</i>.
        </p>

        <app-code [code]="code" [hideToggleCode]="true"></app-code>

        <h3>PickList Keyboard Support</h3>
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
                        <td>Moves focus to the first selected option, if there is none then first option receives the focus.</td>
                    </tr>
                    <tr>
                        <td><i>up arrow</i></td>
                        <td>Moves focus to the previous option.</td>
                    </tr>
                    <tr>
                        <td><i>down arrow</i></td>
                        <td>Moves focus to the next option.</td>
                    </tr>
                    <tr>
                        <td><i>enter</i></td>
                        <td>Toggles the selected state of the focused option.</td>
                    </tr>
                    <tr>
                        <td><i>space</i></td>
                        <td>Toggles the selected state of the focused option.</td>
                    </tr>
                    <tr>
                        <td><i>home</i></td>
                        <td>Moves focus to the first option.</td>
                    </tr>
                    <tr>
                        <td><i>end</i></td>
                        <td>Moves focus to the last option.</td>
                    </tr>
                    <tr>
                        <td><i>shift</i> + <i>down arrow</i></td>
                        <td>Moves focus to the next option and toggles the selection state.</td>
                    </tr>
                    <tr>
                        <td><i>shift</i> + <i>up arrow</i></td>
                        <td>Moves focus to the previous option and toggles the selection state.</td>
                    </tr>
                    <tr>
                        <td><i>shift</i> + <i>space</i></td>
                        <td>Selects the items between the most recently selected option and the focused option.</td>
                    </tr>
                    <tr>
                        <td><i>control</i> + <i>shift</i> + <i>home</i></td>
                        <td>Selects the focused options and all the options up to the first one.</td>
                    </tr>
                    <tr>
                        <td><i>control</i> + <i>shift</i> + <i>end</i></td>
                        <td>Selects the focused options and all the options down to the first one.</td>
                    </tr>
                    <tr>
                        <td><i>control</i> + <i>a</i></td>
                        <td>Selects all options.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <h3>Buttons Keyboard Support</h3>
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
                        <td>Executes button action.</td>
                    </tr>
                    <tr>
                        <td><i>space</i></td>
                        <td>Executes button action.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </app-docsectiontext>`
})
export class AccessibilityDoc {
    code: Code = {
        html: `<p-pick-list sourceAriaLabel="Available cities" targetAriaLabel="Selected cities" />`
    };
}
