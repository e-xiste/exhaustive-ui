import { Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { DrawerModule } from '@exhaustive-ui/core/drawer';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'position-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, DrawerModule, ButtonModule, FormsModule],
    template: `
        <app-docsectiontext>
            <p>Drawer location is configured with the <i>position</i> property that can take <i>left</i>, <i>right</i>, <i>top</i> and <i>bottom</i> as a value.</p>
        </app-docsectiontext>
        <div class="card">
            <p-drawer header="Left Drawer" [(visible)]="visible1" position="left">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                </p>
            </p-drawer>

            <p-drawer header="Right Drawer" [(visible)]="visible2" position="right">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                </p>
            </p-drawer>

            <p-drawer header="Top Drawer" [(visible)]="visible3" position="top" [style]="{ height: 'auto' }">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                </p>
            </p-drawer>

            <p-drawer header="Bottom Drawer" [(visible)]="visible4" position="bottom" [style]="{ height: 'auto' }">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                </p>
            </p-drawer>
            <div class="flex gap-2 justify-center">
                <p-button type="button" (click)="visible1 = true" icon="pi pi-arrow-right" ariaLabel="Open left drawer" />
                <p-button type="button" (click)="visible2 = true" icon="pi pi-arrow-left" ariaLabel="Open right drawer" />
                <p-button type="button" (click)="visible3 = true" icon="pi pi-arrow-down" ariaLabel="Open top drawer" />
                <p-button type="button" (click)="visible4 = true" icon="pi pi-arrow-up" ariaLabel="Open bottom drawer" />
            </div>
        </div>
        <app-code></app-code>
    `
})
export class PositionDoc {
    visible1: boolean = false;

    visible2: boolean = false;

    visible3: boolean = false;

    visible4: boolean = false;
}
