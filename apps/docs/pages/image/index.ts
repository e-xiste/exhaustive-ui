import { AccessibilityDoc } from '@/doc/image/accessibility-doc';
import { BasicDoc } from '@/doc/image/basic-doc';
import { ImportDoc } from '@/doc/image/import-doc';
import { PreviewDoc } from '@/doc/image/preview-doc';
import { PreviewImageSourceDoc } from '@/doc/image/previewimagesource-doc';
import { TemplateDoc } from '@/doc/image/template-doc';
import { PTComponent } from '@/doc/image/pt/PTComponent';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    template: `<app-doc
        docTitle="Angular Image Component - ExhaustiveUI"
        header="Image"
        description="Displays an image with preview and tranformation options."
        [docs]="docs"
        [apiDocs]="['Image']"
        [ptDocs]="ptComponent"
        themeDocs="image"
    ></app-doc> `,
    standalone: true,
    imports: [AppDoc]
})
export class ImageDemo {
    docs = [
        {
            id: 'import',
            label: 'Import',
            component: ImportDoc
        },
        {
            id: 'basic',
            label: 'Basic',
            component: BasicDoc
        },
        {
            id: 'preview',
            label: 'Preview',
            component: PreviewDoc
        },
        {
            id: 'previewimagesource',
            label: 'Preview Image Source',
            component: PreviewImageSourceDoc
        },
        {
            id: 'template',
            label: 'Template',
            component: TemplateDoc
        },
        {
            id: 'accessibility',
            label: 'Accessibility',
            component: AccessibilityDoc
        }
    ];

    ptComponent = PTComponent;
}
