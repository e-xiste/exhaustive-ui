import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from '@exhaustive-ui/core/api';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { SpeedDialModule } from '@exhaustive-ui/core/speeddial';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'semicircle-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, SpeedDialModule, ToastModule, RouterModule],
    template: `
        <app-docsectiontext>
            <p>When <i>type</i> is defined as <i>semi-circle</i>, items are displayed in a half-circle around the button.</p>
        </app-docsectiontext>
        <div class="card">
            <div style="position: relative; height: 500px">
                <p-toast />
                <p-speed-dial [model]="items" ariaLabel="Actions" [radius]="80" type="semi-circle" direction="down" [style]="{ position: 'absolute', left: 'calc(50% - 2rem)', top: 0 }" />
                <p-speed-dial [model]="items" ariaLabel="Actions" [radius]="80" type="semi-circle" direction="right" [style]="{ position: 'absolute', top: 'calc(50% - 2rem)', left: 0 }" />
                <p-speed-dial [model]="items" ariaLabel="Actions" [radius]="80" type="semi-circle" direction="left" [style]="{ position: 'absolute', top: 'calc(50% - 2rem)', right: 0 }" />
                <p-speed-dial [model]="items" ariaLabel="Actions" [radius]="80" type="semi-circle" direction="up" [style]="{ position: 'absolute', left: 'calc(50% - 2rem)', bottom: 0 }" />
            </div>
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class SemiCircleDoc implements OnInit {
    items: MenuItem[] | undefined;

    constructor(private messageService: MessageService) {}

    ngOnInit() {
        this.items = [
            {
                icon: 'pi pi-pencil',
                command: () => {
                    this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
                }
            },
            {
                icon: 'pi pi-refresh',
                command: () => {
                    this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
                }
            },
            {
                icon: 'pi pi-trash',
                command: () => {
                    this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
                }
            },
            {
                icon: 'pi pi-upload',
                routerLink: ['/fileupload']
            },
            {
                icon: 'pi pi-external-link',
                target: '_blank',
                url: 'https://angular.dev'
            }
        ];
    }
}
