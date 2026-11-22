import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem, MessageService } from '@exhaustive-ui/core/api';
import { SplitButtonModule } from '@exhaustive-ui/core/splitbutton';
import { ToastModule } from '@exhaustive-ui/core/toast';

@Component({
    selector: 'sizes-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, SplitButtonModule, ToastModule, RouterModule],
    template: `
        <app-docsectiontext>
            <p>SplitButton provides <i>small</i> and <i>large</i> sizes as alternatives to the standard.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center items-center gap-4">
            <p-toast />
            <p-split-button label="Small" [model]="items" (onClick)="save('info')" size="small" />
            <p-split-button label="Normal" [model]="items" (onClick)="save('info')" />
            <p-split-button label="Large" [model]="items" (onClick)="save('info')" size="large" />
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class SizesDoc {
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

    items: MenuItem[];

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
