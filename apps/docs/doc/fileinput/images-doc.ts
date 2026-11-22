import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileInputModule, FileInputUploadHandler } from '@exhaustive-ui/core/fileinput';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'images-doc',
    standalone: true,
    imports: [FormsModule, FileInputModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                The <i>images</i> variant shows the files as a grid of square thumbnails, for a gallery, a listing or a product page. The first image is marked as the cover, the progress of an upload is drawn over its thumbnail, and the add tile,
                which also accepts dropped files, stays at the end of the grid until <i>maxFiles</i> is reached.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-file-input variant="images" accept="image/*" [maxFiles]="6" [maxFileSize]="5000000" [uploadHandler]="upload" [(ngModel)]="photos" />
        </div>
        <app-code></app-code>
    `
})
export class ImagesDoc {
    photos: File[] = [];

    upload: FileInputUploadHandler = (file, { signal, progress }) =>
        new Promise((resolve) => {
            let percent = 0;
            const timer = setInterval(() => {
                percent += 8;
                progress(percent);
                if (percent >= 100) {
                    clearInterval(timer);
                    resolve({ name: file.name });
                }
            }, 120);
            signal.addEventListener('abort', () => clearInterval(timer));
        });
}
