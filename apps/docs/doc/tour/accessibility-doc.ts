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
                The card is an element with the <i>dialog</i> role, labelled by the title of the step with <i>aria-labelledby</i> and described by its text with <i>aria-describedby</i>; a step without title is labelled by its counter, for example
                "Step 2 of 5". With the mask, the dialog is modal, <i>aria-modal</i> is true and the focus stays in the card; without mask, it is a non-modal dialog. The mask, the spotlight, the arrow and the progress dots are hidden from assistive
                technologies, and the visible "2 / 5" counter is read as "Step 2 of 5". A polite live region announces each new step with its title. Every text can be translated through <i>labels</i>.
            </p>
            <p>
                When the tour starts, the focus moves into the card; when a step changes, it stays on the button the user pressed, or moves to the card. When the tour ends, the focus returns to the element that had it before, usually the button that
                started the tour. A custom <i>step</i> template gives <i>titleId</i> and <i>contentId</i> to its title and text to keep the dialog labelled.
            </p>
            <p>The transitions of the spotlight and the card are disabled, and the target is scrolled into view without smooth scrolling, when the user prefers reduced motion.</p>
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
                        <td><i>tab</i></td>
                        <td>Moves focus to the next focusable element of the card. With the mask, the focus cycles inside the card.</td>
                    </tr>
                    <tr>
                        <td><i>shift</i> + <i>tab</i></td>
                        <td>Moves focus to the previous focusable element of the card.</td>
                    </tr>
                    <tr>
                        <td><i>enter</i> / <i>space</i></td>
                        <td>Activates the focused button: back, next, done or close.</td>
                    </tr>
                    <tr>
                        <td><i>right arrow</i></td>
                        <td>Goes to the next step while the card has the focus, the previous step in right-to-left documents. Disabled with <i>keyboardNavigation</i> set to false.</td>
                    </tr>
                    <tr>
                        <td><i>left arrow</i></td>
                        <td>Goes to the previous step while the card has the focus, the next step in right-to-left documents.</td>
                    </tr>
                    <tr>
                        <td><i>escape</i></td>
                        <td>Closes the tour, unless <i>closeOnEscape</i> is false.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`
})
export class AccessibilityDoc {
    code: Code = {
        html: `<p-button label="Take the tour" (onClick)="visible = true" />

<p-tour [steps]="steps" [(visible)]="visible" [labels]="{ next: 'Suivant', prev: 'Retour', done: 'Terminer' }" />`
    };
}
