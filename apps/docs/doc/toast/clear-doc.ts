import { Component } from '@angular/core';
import { MessageService } from '@exhaustive-ui/core/api';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    selector: 'clear-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, ToastModule, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>
                Clicking the close icon removes a message. The <i>clear</i> method of the <i>messageService</i> does the same programmatically: without arguments it removes all the messages, with a key it only removes the messages of the Toast with
                the same key.
            </p>
        </app-docsectiontext>
        <div class="card flex justify-center gap-2">
            <p-toast key="myKey" />
            <p-button (click)="show()" label="Show" />
            <p-button (click)="clear()" label="Clear" severity="secondary" />
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class ClearDoc {
    constructor(private messageService: MessageService) {}

    show() {
        this.messageService.add({ key: 'myKey', severity: 'success', summary: 'Message 1', detail: 'Message Content' });
    }

    clear() {
        this.messageService.clear('myKey');
    }
}
