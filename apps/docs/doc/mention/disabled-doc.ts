import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule } from '@exhaustive-ui/core/mention';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'disabled-doc',
    standalone: true,
    imports: [FormsModule, MentionModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>When <i>disabled</i> is present, the field cannot be edited or focused. With <i>readonly</i>, the text can be selected but not changed, and no panel opens.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-4">
            <p-mention [(ngModel)]="text" disabled [rows]="2" [cols]="40" ariaLabel="Disabled comment" />
            <p-mention [(ngModel)]="text" readonly [rows]="2" [cols]="40" ariaLabel="Read-only comment" />
        </div>
        <app-code></app-code>
    `
})
export class DisabledDoc {
    text = 'Thanks @amyelsner, merged in #release';
}
