import { Component } from '@angular/core';
import { MenuItem, MessageService } from '@exhaustive-ui/core/api';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { SplitButtonModule } from '@exhaustive-ui/core/splitbutton';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'template-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, SplitButtonModule, ToastModule, RouterModule],
    template: `
        <app-docsectiontext>
            <p>SplitButton has a default action button and a collection of additional options defined by the <i>model</i> property based on MenuModel API.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-toast />
            <p-split-button label="Save" (onClick)="save()" severity="contrast" [model]="items">
                <ng-template #content>
                    <span class="flex items-center font-bold">
                        <img alt="logo" src="logo-icon.svg" style="height: 1rem; margin-right: 0.5rem" />
                        <span>ExhaustiveUI</span>
                    </span>
                </ng-template>
            </p-split-button>
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class TemplateDoc {
    items: MenuItem[];

    constructor(private messageService: MessageService) {
        this.items = [
            {
                label: 'Update',
                command: () => {
                    this.update();
                }
            },
            {
                label: 'Delete',
                command: () => {
                    this.delete();
                }
            },
            { label: 'Angular.dev', url: 'https://angular.dev' },
            { separator: true },
            { label: 'Upload', routerLink: ['/fileupload'] }
        ];
    }

    save() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Saved' });
    }

    update() {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated' });
    }

    delete() {
        this.messageService.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted' });
    }
}
