import { Component } from '@angular/core';
import { MessageService } from '@exhaustive-ui/core/api';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { FileUpload, FileUploadHandlerEvent, FileUploadModule } from '@exhaustive-ui/core/fileupload';
import { ToastModule } from '@exhaustive-ui/core/toast';

@Component({
    selector: 'custom-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, FileUploadModule, ToastModule],
    template: `
        <app-docsectiontext>
            <p>
                When <i>customUpload</i> is enabled, the component does not send the files: the Upload button calls <i>uploadHandler</i> with the selected files, to upload them with your own service. Call the <i>clear</i> method once they are
                processed.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-toast />
            <p-file-upload #uploader name="demo[]" [customUpload]="true" (uploadHandler)="upload($event, uploader)" accept="image/*" [multiple]="true" maxFileSize="1000000">
                <ng-template #empty>
                    <div>Drag and drop files to here to upload.</div>
                </ng-template>
            </p-file-upload>
        </div>
        <app-code></app-code>
    `,
    providers: [MessageService]
})
export class CustomDoc {
    constructor(private messageService: MessageService) {}

    async upload(event: FileUploadHandlerEvent, uploader: FileUpload) {
        for (const file of event.files) {
            const content = await file.arrayBuffer();
            // send the content with your own service here
            this.messageService.add({ severity: 'info', summary: file.name, detail: `${content.byteLength} bytes processed` });
        }
        uploader.clear();
    }
}
