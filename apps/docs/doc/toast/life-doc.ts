import { Component } from '@angular/core';
import { MessageService } from '@exhaustive-ui/core/api';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    selector: 'life-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, ToastModule, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>A toast disappears after 3000ms by default, set the <i>life</i> option on either the message or the Toast to override this. The option of the message has precedence.</p>
        </app-docsectiontext>
        <div class="card flex justify-center gap-2">
            <p-toast [life]="10000" />
            <p-button (click)="showLife()" label="10 Seconds" />
            <p-button (click)="showLifeLong()" label="20 Seconds" severity="secondary" />
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class LifeDoc {
    constructor(private messageService: MessageService) {}

    showLife() {
        this.messageService.add({ severity: 'info', summary: 'Life', detail: 'I show for 10000ms' });
    }

    showLifeLong() {
        this.messageService.add({ severity: 'info', summary: 'Life', detail: 'I show for 20000ms', life: 20000 });
    }
}
