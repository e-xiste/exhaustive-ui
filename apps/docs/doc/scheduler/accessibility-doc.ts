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
                The month view is an ARIA <i>grid</i> labelled by the title, with a <i>columnheader</i> per weekday and a <i>gridcell</i> per day. A cell is named by its full date and its number of events, the current date has
                <i>aria-current="date"</i> and the focused or selected days <i>aria-selected</i>. The agenda is a group labelled by the title, so several schedulers on a page do not add landmarks. In the week and day views, each day column is a group
                labelled by its column header and each slot a button named by its date and hours, such as "Thursday, 3 December 2026, 10:00 – 10:30". Events are buttons named by their title and time, "Review, Thu 3 Dec 10:00 – 11:00", and editable
                events are described by how to move them with the keyboard. The "+N more" button names the number of hidden events and their day, and opens a dialog that lists them all. A polite live region announces the new range after a navigation,
                "December 2026" or "Week of 29 Nov 2026", and every moved or resized event. Set <i>ariaLabel</i> to make the component a labelled region.
            </p>
        </app-docsectiontext>

        <app-code [code]="code" [hideToggleCode]="true" [hideCodeSandbox]="true" [hideStackBlitz]="true"></app-code>

        <h3>Keyboard Support</h3>
        <p>The month grid and the time grid each have a single tab stop, on the focused day or slot, followed by the events.</p>
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
                        <td>Moves the focus to the toolbar, the focused day or slot, then to each event.</td>
                    </tr>
                    <tr>
                        <td><i>left arrow</i> / <i>right arrow</i></td>
                        <td>On a day or a slot, moves the focus to the previous or next day, changing the range at its edges. On an event, moves the focus to the previous or next event.</td>
                    </tr>
                    <tr>
                        <td><i>up arrow</i> / <i>down arrow</i></td>
                        <td>Moves the focus one week up or down in the month view, one slot in the week and day views, and to the previous or next event on an event, in the agenda or in the popover.</td>
                    </tr>
                    <tr>
                        <td><i>home</i> / <i>end</i></td>
                        <td>Moves the focus to the first or last day of the week, or to the first or last slot of the day.</td>
                    </tr>
                    <tr>
                        <td><i>page up</i> / <i>page down</i></td>
                        <td>
                            Moves the focus to the same day of the previous or next month, with <i>shift</i> of the previous or next year. In the time grid, moves the focus to the same slot of the previous or next week in the week view, and of the
                            previous or next day in the day view.
                        </td>
                    </tr>
                    <tr>
                        <td><i>enter</i> / <i>space</i></td>
                        <td>On a day or a slot, emits onDateClick or onSlotClick, or onRangeSelect when a range is selected. On an event, emits onEventClick. On the "+N more" button, opens the list of the events of the day.</td>
                    </tr>
                    <tr>
                        <td><i>shift</i> + <i>arrow</i></td>
                        <td>With <i>selectable</i>, extends the selected range of days or slots from the focused one.</td>
                    </tr>
                    <tr>
                        <td><i>alt</i> + <i>arrow</i></td>
                        <td>With <i>editable</i>, moves the focused event by one day with left and right, and by one slot in the time grid or one week in the month view with up and down.</td>
                    </tr>
                    <tr>
                        <td><i>alt</i> + <i>shift</i> + <i>up arrow</i> / <i>down arrow</i></td>
                        <td>With <i>editable</i>, makes the focused event of the time grid one slot shorter or longer.</td>
                    </tr>
                    <tr>
                        <td><i>escape</i></td>
                        <td>Clears the selected range, cancels a drag, returns from an event to its day or slot, and closes the popover.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p>Every drag and drop has a keyboard equivalent, so that moving, resizing and selecting do not need a pointer.</p>
    </div>`
})
export class AccessibilityDoc {
    code: Code = {
        html: `<p-scheduler ariaLabel="Team calendar" [events]="events" editable selectable />`
    };
}
