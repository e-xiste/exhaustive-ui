import { Component } from '@angular/core';
import { MessageService } from '@exhaustive-ui/core/api';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    selector: 'target-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, ToastModule, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>A page may have multiple Toast components. Set the same <i>key</i> on a message and on a Toast to display the message in that Toast only.</p>
        </app-docsectiontext>
        <div class="card flex justify-center gap-2">
            <p-toast key="toast1" position="top-right" />
            <p-toast key="toast2" position="bottom-right" />
            <p-button (click)="showToast1()" label="Top" />
            <p-button (click)="showToast2()" label="Bottom" severity="warn" />
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class TargetDoc {
    constructor(private messageService: MessageService) {}

    showToast1() {
        this.messageService.clear();
        this.messageService.add({ key: 'toast1', severity: 'success', summary: 'Success', detail: 'key: toast1' });
    }

    showToast2() {
        this.messageService.clear();
        this.messageService.add({ key: 'toast2', severity: 'warn', summary: 'Warning', detail: 'key: toast2' });
    }
}
