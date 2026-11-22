import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputGroupModule } from '@exhaustive-ui/core/inputgroup';
import { InputGroupAddonModule } from '@exhaustive-ui/core/inputgroupaddon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { FloatLabelModule } from '@exhaustive-ui/core/floatlabel';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'floatlabel-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, FormsModule, RouterModule, InputGroupModule, InputGroupAddonModule, InputTextModule, FloatLabelModule],
    template: `
        <app-docsectiontext>
            <p>
                FloatLabel visually integrates a label with its form element. Visit
                <a routerLink="/floatlabel">FloatLabel</a> documentation for more information.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col md:items-end md:flex-row gap-4">
            <p-input-group>
                <p-input-group-addon>
                    <i class="pi pi-user"></i>
                </p-input-group-addon>
                <p-float-label>
                    <input pInputText id="over_label" [(ngModel)]="value1" />
                    <label for="over_label">Over Label</label>
                </p-float-label>
            </p-input-group>

            <p-input-group>
                <p-input-group-addon>$</p-input-group-addon>
                <p-float-label variant="in">
                    <input pInputText id="in_label" [(ngModel)]="value2" />
                    <label for="in_label">In Label</label>
                </p-float-label>
                <p-input-group-addon>.00</p-input-group-addon>
            </p-input-group>

            <p-input-group>
                <p-input-group-addon>www</p-input-group-addon>
                <p-float-label variant="on">
                    <input pInputText id="on_label" [(ngModel)]="value3" />
                    <label for="on_label">On Label</label>
                </p-float-label>
            </p-input-group>
        </div>
        <app-code></app-code>
    `
})
export class FloatLabelDoc {
    value1: string | undefined;

    value2: string | undefined;

    value3: string | undefined;
}
