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
                Every column is a region named by its title, holding a list whose label also gives the count, such as "In progress, 2 of 3 cards", or a group with the same label when the column is empty. Each card is a list item holding a focusable
                element with the <i>button</i> role, described with <i>aria-describedby</i> by the instructions to move it, and with <i>aria-pressed</i> true while it is picked up. The count of a column reads "2 of 3 cards" instead of "2 / 3", and
                "over the limit" when it is exceeded.
            </p>
            <p>
                A card can be moved with the keyboard alone, and an assertive live region announces each step: "Picked up Task A, position 2 of 5 in To do", "Moved to In progress, position 1 of 3", "Dropped Task A in In progress, position 1 of 3" or
                "Cancelled, Task A returned to To do, position 2 of 5". A refused move is announced with its reason, such as "Review is full, 1 of 1 cards", and so is a full column a card is dragged over with the pointer. The column drag handles, the
                collapse buttons and the add card buttons name their column, for example "Add card to Done". Name the board with <i>ariaLabel</i> or <i>ariaLabelledBy</i>, and translate every text with <i>labels</i>.
            </p>
        </app-docsectiontext>

        <app-code [code]="code" [hideToggleCode]="true" [hideCodeSandbox]="true" [hideStackBlitz]="true"></app-code>

        <h3>Card Keyboard Support</h3>
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
                        <td>Moves focus to the next card, column button or add card button. Leaving a picked up card cancels its move.</td>
                    </tr>
                    <tr>
                        <td><i>space</i> / <i>enter</i></td>
                        <td>Picks up the focused card, or drops the picked up card where it is.</td>
                    </tr>
                    <tr>
                        <td><i>up arrow</i> / <i>down arrow</i></td>
                        <td>Moves the picked up card one position up or down in its column. Without a picked up card, moves focus to the previous or next card.</td>
                    </tr>
                    <tr>
                        <td><i>left arrow</i> / <i>right arrow</i></td>
                        <td>
                            Moves the picked up card to the previous or next column, skipping collapsed columns, unless the column refuses it. Without a picked up card, moves focus to the card at the same position in the previous or next column.
                            Reversed in right-to-left layouts.
                        </td>
                    </tr>
                    <tr>
                        <td><i>home</i> / <i>end</i></td>
                        <td>Moves the picked up card to the top or the bottom of its column.</td>
                    </tr>
                    <tr>
                        <td><i>escape</i></td>
                        <td>Cancels the move and puts the card back where it was.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>Column Handle Keyboard Support</h3>
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
                        <td><i>space</i> / <i>enter</i></td>
                        <td>Picks up the column, or drops the picked up column where it is.</td>
                    </tr>
                    <tr>
                        <td><i>left arrow</i> / <i>right arrow</i></td>
                        <td>Moves the picked up column one position to the left or the right.</td>
                    </tr>
                    <tr>
                        <td><i>home</i> / <i>end</i></td>
                        <td>Moves the picked up column to the first or the last position.</td>
                    </tr>
                    <tr>
                        <td><i>escape</i></td>
                        <td>Cancels the move and puts the column back where it was.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p>The changes are only emitted when the card or the column is dropped, so a cancelled keyboard move never reaches <i>onCardMove</i> or <i>onColumnReorder</i>.</p>
    </div>`
})
export class AccessibilityDoc {
    code: Code = {
        html: `<h2 id="sprint">Sprint 42</h2>
<p-kanban [(columns)]="columns" ariaLabelledBy="sprint" [labels]="{ addCard: 'Ajouter une carte', empty: 'Aucune carte' }" />`
    };
}
