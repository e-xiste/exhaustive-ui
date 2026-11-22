import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FloatLabelModule } from '@exhaustive-ui/core/floatlabel';
import { IconFieldModule } from '@exhaustive-ui/core/iconfield';
import { InputIconModule } from '@exhaustive-ui/core/inputicon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'floatlabel-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, RouterModule, FormsModule, FloatLabelModule, IconFieldModule, InputIconModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>FloatLabel visually integrates a label with its form element. Visit <a routerLink="/floatlabel">FloatLabel</a> documentation for more information.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <p-float-label>
                <p-icon-field>
                    <p-input-icon class="pi pi-search" />
                    <input pInputText id="over_label" [(ngModel)]="value1" autocomplete="off" />
                </p-icon-field>
                <label for="over_label">Over Label</label>
            </p-float-label>

            <p-float-label variant="in">
                <p-icon-field>
                    <p-input-icon class="pi pi-search" />
                    <input pInputText id="in_label" [(ngModel)]="value2" autocomplete="off" />
                </p-icon-field>
                <label for="in_label">In Label</label>
            </p-float-label>

            <p-float-label variant="on">
                <p-icon-field>
                    <p-input-icon class="pi pi-search" />
                    <input pInputText id="on_label" [(ngModel)]="value3" autocomplete="off" />
                </p-icon-field>
                <label for="on_label">On Label</label>
            </p-float-label>
        </div>
        <app-code></app-code>
    `
})
export class FloatLabelDoc {
    value1: string | undefined;

    value2: string | undefined;

    value3: string | undefined;
}
