import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { IftaLabelModule } from '@exhaustive-ui/core/iftalabel';
import { RouterModule } from '@angular/router';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'iftalabel-doc',
    standalone: true,
    imports: [FormsModule, InputTextModule, IftaLabelModule, RouterModule, AppCodeModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>IftaLabel is used to create infield top aligned labels. Visit <a routerLink="/iftalabel">IftaLabel</a> documentation for more information.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-ifta-label>
                <input pInputText id="username" [(ngModel)]="value" autocomplete="off" />
                <label for="username">Username</label>
            </p-ifta-label>
        </div>
        <app-code></app-code>
    `
})
export class IftaLabelDoc {
    value: string | undefined;
}
