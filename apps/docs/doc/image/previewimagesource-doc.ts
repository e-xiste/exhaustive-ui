import { Component } from '@angular/core';
import { ImageModule } from '@exhaustive-ui/core/image';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'previewimagesource-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, ImageModule],
    template: `
        <app-docsectiontext>
            <p>A different image is displayed in the preview with the <i>previewImageSrc</i> property, for example a thumbnail on the page and the full size image in the preview.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-image src="https://exhaustive-ui.com/demo/galleria/galleria11s.jpg" previewImageSrc="https://exhaustive-ui.com/demo/galleria/galleria11.jpg" alt="Image" width="250" [preview]="true" />
        </div>
        <app-code></app-code>
    `
})
export class PreviewImageSourceDoc {}
