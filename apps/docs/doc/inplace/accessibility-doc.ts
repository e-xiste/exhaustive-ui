import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'accessibility-doc',
    standalone: true,
    imports: [AppDocSectionText, RouterModule],
    template: ` <div>
        <app-docsectiontext>
            <h3>Screen Reader</h3>
            <p>Inplace component defines <i>aria-live</i> as "polite" by default, since any valid attribute is passed to the main container aria roles and attributes of the root element can be customized easily.</p>
            <p>Display element uses <i>button</i> role in view mode.</p>
            <p>Closable inplace components display a close button whose <i>aria-label</i> is defined with the <i>closeAriaLabel</i> property.</p>
            <h3>View Mode Keyboard Support</h3>
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
                            <td>Switches to content.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3>Close Button Keyboard Support</h3>
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
                            <td>Switches to display.</td>
                        </tr>
                        <tr>
                            <td><i>space</i></td>
                            <td>Switches to display.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </app-docsectiontext>
    </div>`
})
export class AccessibilityDoc {}
