import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'limits-doc',
    standalone: true,
    imports: [FormsModule, InputChipsModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p><i>max</i> limits the number of chips and <i>maxChipLength</i> the length of each chip; values beyond the limits are not added and screen readers hear why. Set <i>allowDuplicate</i> to accept the same value more than once.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-4">
            <p-input-chips [(ngModel)]="keywords" [max]="3" [maxChipLength]="12" ariaLabel="Keywords" placeholder="Up to 3 keywords of 12 characters" class="w-full md:w-[30rem]" />
            <p-input-chips [(ngModel)]="votes" allowDuplicate ariaLabel="Votes" class="w-full md:w-[30rem]" />
        </div>
        <app-code></app-code>
    `
})
export class LimitsDoc {
    keywords: string[] = ['design'];

    votes: string[] = ['yes', 'yes', 'no'];
}
