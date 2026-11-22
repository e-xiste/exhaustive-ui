import { Component } from '@angular/core';
import { DrawerModule } from '@exhaustive-ui/core/drawer';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { AvatarModule } from '@exhaustive-ui/core/avatar';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'template-doc',
    standalone: true,
    imports: [DrawerModule, ButtonModule, AvatarModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Drawer is customizable by <i>header</i>, <i>content</i>, <i>footer</i> templates.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-drawer [(visible)]="visible" [closable]="false">
                <ng-template #header>
                    <div class="flex items-center gap-2">
                        <p-avatar image="https://exhaustive-ui.com/demo/avatar/amyelsner.png" shape="circle" />
                        <span class="font-bold">Amy Elsner</span>
                    </div>
                </ng-template>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                </p>
                <ng-template #footer>
                    <div class="flex items-center gap-2">
                        <button pButton class="w-full" outlined>
                            <i class="pi pi-user" pButtonIcon></i>
                            <span pButtonLabel>Account</span>
                        </button>
                        <button pButton class="w-full" severity="danger" text>
                            <i class="pi pi-sign-out" pButtonIcon></i>
                            <span pButtonLabel>Logout</span>
                        </button>
                    </div>
                </ng-template>
            </p-drawer>
            <button pButton (click)="visible = true" aria-label="Open drawer">
                <i class="pi pi-plus" pButtonIcon></i>
            </button>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDoc {
    visible: boolean = false;
}
