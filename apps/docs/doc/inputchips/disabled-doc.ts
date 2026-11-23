import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'disabled-doc',
    standalone: true,
    imports: [FormsModule, InputChipsModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>When <i>disabled</i> is present, the element cannot be edited and focused. With <i>readonly</i>, the chips can still be focused and read, but not added or removed.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-4">
            <p-input-chips [(ngModel)]="value1" disabled ariaLabel="Disabled" />
            <p-input-chips [(ngModel)]="value2" readonly ariaLabel="Readonly" />
        </div>
        <app-code></app-code>
    `
})
export class DisabledDoc {
    value1: string[] = ['disabled'];

    value2: string[] = ['readonly'];
}
