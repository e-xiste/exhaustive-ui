import { AppDocPtViewer } from '@/components/doc/app.docptviewer';
import { getPTOptions } from '@/components/doc/app.docptviewer';
import { Component } from '@angular/core';
import { FileInputExistingFile, FileInputModule } from '@exhaustive-ui/core/fileinput';

@Component({
    selector: 'fileinput-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, FileInputModule],
    template: `
        <app-docptviewer [docs]="docs">
            <p-file class="w-full" hint="Any file, 5 MB maximum" [existing]="existing" />
        </app-docptviewer>
    `
})
export class PTViewer {
    existing: FileInputExistingFile[] = [{ id: 1, name: 'signed-contract.pdf', size: 1240000, type: 'application/pdf' }];

    docs = [{ data: getPTOptions('FileInput'), key: 'FileInput' }];
}
