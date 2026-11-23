import { AppDocPtViewer } from '@/components/doc/app.docptviewer';
import { getPTOptions } from '@/components/doc/app.docptviewer';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';

@Component({
    selector: 'richtexteditor-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, FormsModule, RichTextEditorModule],
    template: `
        <app-docptviewer [docs]="docs">
            <p-rich-text-editor class="w-full" [(ngModel)]="html" [showCount]="true" [maxLength]="200" ariaLabel="Pass through example" />
        </app-docptviewer>
    `
})
export class PTViewer {
    html: string | null = '<p>Rich <strong>text</strong> editor.</p>';

    docs = [{ data: getPTOptions('RichTextEditor'), key: 'RichTextEditor' }];
}
