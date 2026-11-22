import { Component, inject } from '@angular/core';
import { MessageService } from '@exhaustive-ui/core/api';
import { FileInputModule, FileInputUploadEvent, FileInputUploadHandler } from '@exhaustive-ui/core/fileinput';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';

@Component({
    selector: 'upload-doc',
    standalone: true,
    imports: [FileInputModule, ToastModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Each file is uploaded in its own request, with its own progress bar, as soon as it is added. Set <i>url</i> to post the files with <i>HttpClient</i>, which requires <i>provideHttpClient()</i>, or pass an <i>uploadHandler</i> function
                to upload them yourself, straight to cloud storage for example. The handler receives the file, an <i>AbortSignal</i> and a <i>progress</i> callback, and returns a promise of the server response. At most <i>concurrency</i> files upload
                at the same time, 3 by default. An upload in progress can be canceled, and a failed or canceled upload can be retried. Set <i>auto</i> to false to start the uploads with the <i>upload()</i> method instead.
            </p>
            <p>The demo below simulates the server. Files with "error" in their name fail.</p>
        </app-docsectiontext>
        <p-toast />
        <div class="card">
            <p-file [uploadHandler]="upload" (onUpload)="onUpload($event)" />
        </div>
        <app-code></app-code>
        <app-docsectiontext>
            <p>Posting to an endpoint only needs its url. The form data field is named <i>file</i>, or the value of <i>fieldName</i>.</p>
        </app-docsectiontext>
        <app-code [code]="urlCode" [hideToggleCode]="true" [hideStackBlitz]="true"></app-code>
    `
})
export class UploadDoc {
    messageService = inject(MessageService);

    upload: FileInputUploadHandler = (file, { signal, progress }) =>
        new Promise((resolve, reject) => {
            let percent = 0;
            const timer = setInterval(() => {
                percent += 100000 / Math.max(file.size, 200000);
                progress(percent);
                if (file.name.includes('error') && percent > 50) {
                    clearInterval(timer);
                    reject(new Error('The server answered 500'));
                } else if (percent >= 100) {
                    clearInterval(timer);
                    resolve({ name: file.name });
                }
            }, 150);
            signal.addEventListener('abort', () => clearInterval(timer));
        });

    onUpload(event: FileInputUploadEvent) {
        this.messageService.add({ severity: 'success', summary: 'Uploaded', detail: event.item.name, life: 2000 });
    }

    urlCode: Code = {
        html: `<p-file url="/api/upload" fieldName="document" [headers]="headers" withCredentials />`
    };
}
