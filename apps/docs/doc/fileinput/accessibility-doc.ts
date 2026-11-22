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
                The dropzone, the add tile and the avatar are buttons that open the native file picker, which stays hidden. Describe them with <i>ariaLabelledBy</i> or <i>ariaLabel</i>; the <i>hint</i> is linked to the dropzone with
                <i>aria-describedby</i>. The file list is labelled, every action button names its file, for example "Remove report.pdf", and progress bars use the <i>progressbar</i> role. A polite live region announces the files added and rejected,
                finished and failed uploads, and removed files.
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
                        <td><i>tab</i></td>
                        <td>Moves focus to the dropzone, then to the action buttons of each file.</td>
                    </tr>
                    <tr>
                        <td><i>enter</i> / <i>space</i></td>
                        <td>Opens the file picker from the dropzone, the add tile or the avatar, or runs the focused action.</td>
                    </tr>
                    <tr>
                        <td><i>ctrl</i> / <i>cmd</i> + <i>v</i></td>
                        <td>Adds the files of the clipboard while the component has the focus.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p>When a file is removed, the focus moves to the next action button, or back to the dropzone.</p>
    </div>`
})
export class AccessibilityDoc {
    code: Code = {
        html: `<span id="attachments">Attachments</span>
<p-file ariaLabelledBy="attachments" hint="PDF only, 5 MB maximum" />

<p-file variant="avatar" ariaLabel="Profile picture" />`
    };
}
