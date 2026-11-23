import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { IconFieldModule } from '@exhaustive-ui/core/iconfield';
import { InputIconModule } from '@exhaustive-ui/core/inputicon';
import { RouterModule } from '@angular/router';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'iconfield-doc',
    standalone: true,
    imports: [FormsModule, InputChipsModule, IconFieldModule, InputIconModule, RouterModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>InputChips works with <a routerLink="/iconfield">IconField</a> and InputIcon to show an icon at the start of the field.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-iconfield class="w-full md:w-[30rem]">
                <p-inputicon class="pi pi-tag" />
                <p-inputchips [(ngModel)]="value" ariaLabel="Labels" placeholder="Labels" fluid />
            </p-iconfield>
        </div>
        <app-code></app-code>
    `
})
export class IconFieldDoc {
    value: string[] = [];
}
