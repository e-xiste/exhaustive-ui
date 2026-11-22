import { Component, inject } from '@angular/core';
import { MessageService } from '@exhaustive-ui/core/api';
import { FileInputExistingFile, FileInputModule, FileInputRemoveExistingEvent } from '@exhaustive-ui/core/fileinput';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'existing-doc',
    standalone: true,
    imports: [FileInputModule, ToastModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                When a form edits a record, pass the files already stored on the server to <i>existing</i>. They are listed before the new files, with a download button when they have a <i>url</i> and a delete button. Deleting one emits
                <i>onRemoveExisting</i>: delete the file on the server from there. Existing files count toward <i>maxFiles</i> and are not part of the value.
            </p>
        </app-docsectiontext>
        <p-toast />
        <div class="card">
            <p-file [existing]="attachments" (onRemoveExisting)="onRemoveExisting($event)" />
        </div>
        <app-code></app-code>
    `
})
export class ExistingDoc {
    messageService = inject(MessageService);

    attachments: FileInputExistingFile[] = [
        { id: 1, name: 'signed-contract.pdf', size: 1240000, type: 'application/pdf' },
        { id: 2, name: 'facade.jpg', size: 312000, type: 'image/jpeg', url: 'https://exhaustive-ui.com/demo/galleria/galleria1.jpg' }
    ];

    onRemoveExisting(event: FileInputRemoveExistingEvent) {
        this.messageService.add({ severity: 'info', summary: 'Delete on the server', detail: event.file.name, life: 3000 });
    }
}
