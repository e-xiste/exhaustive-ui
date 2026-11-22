import { Component, OnInit } from '@angular/core';
import { MenuItem } from '@exhaustive-ui/core/api';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { ToolbarModule } from '@exhaustive-ui/core/toolbar';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { SplitButtonModule } from '@exhaustive-ui/core/splitbutton';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { IconFieldModule } from '@exhaustive-ui/core/iconfield';
import { InputIconModule } from '@exhaustive-ui/core/inputicon';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, ToolbarModule, ButtonModule, SplitButtonModule, InputTextModule, IconFieldModule, InputIconModule],
    template: `
        <app-docsectiontext>
            <p>
                Toolbar is a grouping component for buttons and other content. Its content can be placed inside the
                <i>start</i>, <i>center</i> and <i>end</i> sections.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-toolbar>
                <ng-template #start>
                    <p-button icon="pi pi-plus" ariaLabel="New" class="mr-2" text severity="secondary" />
                    <p-button icon="pi pi-print" ariaLabel="Print" class="mr-2" text severity="secondary" />
                    <p-button icon="pi pi-upload" ariaLabel="Upload" text severity="secondary" />
                </ng-template>
                <ng-template #center>
                    <p-icon-field iconPosition="left">
                        <p-input-icon class="pi pi-search" />
                        <input type="text" pInputText placeholder="Search" />
                    </p-icon-field>
                </ng-template>
                <ng-template #end>
                    <p-split-button label="Save" [model]="items" />
                </ng-template>
            </p-toolbar>
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc implements OnInit {
    items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'Update',
                icon: 'pi pi-refresh'
            },
            {
                label: 'Delete',
                icon: 'pi pi-times'
            }
        ];
    }
}
