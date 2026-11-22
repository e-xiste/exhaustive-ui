import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputNumberModule } from '@exhaustive-ui/core/inputnumber';
import { IftaLabelModule } from '@exhaustive-ui/core/iftalabel';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'iftalabel-doc',
    standalone: true,
    imports: [FormsModule, RouterModule, InputNumberModule, IftaLabelModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>IftaLabel is used to create infield top aligned labels. Visit <a routerLink="/iftalabel">IftaLabel</a> documentation for more information.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-ifta-label>
                <p-input-number [(ngModel)]="value" inputId="price_input" mode="currency" currency="USD" locale="en-US" />
                <label for="price_input">Price</label>
            </p-ifta-label>
        </div>
        <app-code></app-code>
    `
})
export class IftaLabelDoc {
    value: number | undefined;
}
