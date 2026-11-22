import { Component } from '@angular/core';
import { MenuItem } from '@exhaustive-ui/core/api';
import { InputGroupModule } from '@exhaustive-ui/core/inputgroup';
import { InputGroupAddonModule } from '@exhaustive-ui/core/inputgroupaddon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { MenuModule } from '@exhaustive-ui/core/menu';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'button-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, InputGroupModule, InputGroupAddonModule, InputTextModule, ButtonModule, MenuModule],
    template: `
        <app-docsectiontext>
            <p>Buttons can be placed at either side of an input element.</p>
        </app-docsectiontext>
        <div class="card flex flex-col md:flex-row gap-4">
            <p-input-group>
                <p-button label="Search" />
                <input pInputText placeholder="Keyword" />
            </p-input-group>

            <p-input-group>
                <input pInputText placeholder="Keyword" />
                <p-input-group-addon>
                    <p-button icon="pi pi-search" severity="secondary" variant="text" (click)="menu.toggle($event)" />
                </p-input-group-addon>
            </p-input-group>
            <p-menu #menu [model]="items" popup styleClass="min-w-fit!" />

            <p-input-group>
                <p-input-group-addon>
                    <p-button icon="pi pi-check" severity="secondary" />
                </p-input-group-addon>
                <input pInputText placeholder="Vote" />
                <p-input-group-addon>
                    <p-button icon="pi pi-times" severity="secondary" />
                </p-input-group-addon>
            </p-input-group>
        </div>
        <app-code></app-code>
    `
})
export class ButtonDoc {
    items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [{ label: 'Web Search' }, { label: 'AI Assistant' }, { label: 'History' }];
    }
}
