import { Component } from '@angular/core';
import { MeterGroupModule } from '@exhaustive-ui/core/metergroup';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [MeterGroupModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>MeterGroup requires a <i>value</i> as the data to display where each item in the collection should be a type of <i>MeterItem</i>.</p>
        </app-docsectiontext>
        <div class="card">
            <p-meter-group [value]="value" aria-label="Storage usage" />
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    value = [{ label: 'Space used', value: 15, color: 'var(--p-primary-color)' }];
}
