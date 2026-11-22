import { AppDocPtViewer, getPTOptions } from '@/components/doc/app.docptviewer';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FileUploadModule } from '@exhaustive-ui/core/fileupload';

@Component({
    selector: 'fileupload-pt-viewer',
    standalone: true,
    imports: [CommonModule, AppDocPtViewer, FileUploadModule],
    template: `
        <app-docptviewer [docs]="docs">
            <div class="w-full">
                <p-file-upload name="demo[]" url="https://exhaustive-ui.com/api/upload" [multiple]="true" accept="image/*" [maxFileSize]="1000000">
                    <ng-template #empty>
                        <span>Drag and drop files to here to upload.</span>
                    </ng-template>
                </p-file-upload>
            </div>
        </app-docptviewer>
    `
})
export class PTViewer {
    docs = [
        {
            data: getPTOptions('FileUpload'),
            key: 'FileUpload'
        }
    ];
}
