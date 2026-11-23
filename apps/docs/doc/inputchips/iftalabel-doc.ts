import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { IftaLabelModule } from '@exhaustive-ui/core/iftalabel';
import { RouterModule } from '@angular/router';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'iftalabel-doc',
    standalone: true,
    imports: [FormsModule, InputChipsModule, IftaLabelModule, RouterModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>IftaLabel is used to create infield top aligned labels. Visit <a routerLink="/iftalabel">IftaLabel</a> documentation for more information.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-ifta-label>
                <p-input-chips [(ngModel)]="value" inputId="skills" class="w-72" />
                <label for="skills">Skills</label>
            </p-ifta-label>
        </div>
        <app-code></app-code>
    `
})
export class IftaLabelDoc {
    value: string[] = ['Angular'];
}
