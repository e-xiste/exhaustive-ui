import { Component } from '@angular/core';
import { MenuItem, MessageService } from '@exhaustive-ui/core/api';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { SplitButtonModule } from '@exhaustive-ui/core/splitbutton';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'outlined-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, SplitButtonModule, ToastModule, RouterModule],
    template: `
        <app-docsectiontext>
            <p>Outlined buttons display a border without a background initially.</p>
        </app-docsectiontext>
        <div class="card flex justify-center flex-wrap gap-4">
            <p-toast />
            <p-split-button label="Primary" [model]="items" (onClick)="save('info')" outlined />
            <p-split-button label="Secondary" [model]="items" (onClick)="save('info')" outlined severity="secondary" />
            <p-split-button label="Success" [model]="items" (onClick)="save('info')" outlined severity="success" />
            <p-split-button label="Info" [model]="items" (onClick)="save('info')" outlined severity="info" />
            <p-split-button label="Warning" [model]="items" (onClick)="save('info')" outlined severity="warn" />
            <p-split-button label="Help" [model]="items" (onClick)="save('info')" outlined severity="help" />
            <p-split-button label="Danger" [model]="items" (onClick)="save('info')" outlined severity="danger" />
            <p-split-button label="Contrast" [model]="items" (onClick)="save('info')" outlined severity="contrast" />
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class OutlinedDoc {
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

    save(severity: string) {
        this.messageService.add({ severity: severity, summary: 'Success', detail: 'Data Saved' });
    }

    update() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Updated' });
    }

    delete() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Deleted' });
    }
}
