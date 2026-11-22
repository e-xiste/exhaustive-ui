import { AccessibilityDoc } from '@/doc/fileinput/accessibility-doc';
import { AvatarDoc } from '@/doc/fileinput/avatar-doc';
import { BasicDoc } from '@/doc/fileinput/basic-doc';
import { DisabledDoc } from '@/doc/fileinput/disabled-doc';
import { ExistingDoc } from '@/doc/fileinput/existing-doc';
import { ImagesDoc } from '@/doc/fileinput/images-doc';
import { ImportDoc } from '@/doc/fileinput/import-doc';
import { InvalidDoc } from '@/doc/fileinput/invalid-doc';
import { LabelsDoc } from '@/doc/fileinput/labels-doc';
import { ReactiveFormsDoc } from '@/doc/fileinput/reactiveforms-doc';
import { SignalFormsDoc } from '@/doc/fileinput/signalforms-doc';
import { SizesDoc } from '@/doc/fileinput/sizes-doc';
import { TemplateDoc } from '@/doc/fileinput/template-doc';
import { TemplateDrivenFormsDoc } from '@/doc/fileinput/templatedrivenforms-doc';
import { UploadDoc } from '@/doc/fileinput/upload-doc';
import { ValidationDoc } from '@/doc/fileinput/validation-doc';
import { PTComponent } from '@/doc/fileinput/pt/PTComponent';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    template: `<app-doc
        docTitle="Angular FileInput Component - ExhaustiveUI"
        header="FileInput"
        description="FileInput selects files by drag and drop, paste or the file picker, validates each file and uploads it with its own progress. It has a list, an images and an avatar variant, and works with every kind of Angular form."
        [docs]="docs"
        [apiDocs]="['FileInput']"
        [ptDocs]="ptComponent"
        themeDocs="fileinput"
    ></app-doc>`,
    standalone: true,
    imports: [AppDoc]
})
export class FileInputDemo {
    ptComponent = PTComponent;
    docs = [
        { id: 'import', label: 'Import', component: ImportDoc },
        { id: 'basic', label: 'Basic', component: BasicDoc },
        { id: 'upload', label: 'Upload', component: UploadDoc },
        { id: 'validation', label: 'Validation', component: ValidationDoc },
        { id: 'images', label: 'Images', component: ImagesDoc },
        { id: 'avatar', label: 'Avatar', component: AvatarDoc },
        { id: 'existing', label: 'Existing Files', component: ExistingDoc },
        { id: 'template', label: 'Template', component: TemplateDoc },
        { id: 'sizes', label: 'Sizes', component: SizesDoc },
        { id: 'labels', label: 'Labels', component: LabelsDoc },
        { id: 'disabled', label: 'Disabled', component: DisabledDoc },
        { id: 'invalid', label: 'Invalid', component: InvalidDoc },
        {
            id: 'forms',
            label: 'Forms',
            children: [
                { id: 'templatedriven', label: 'Template Driven', component: TemplateDrivenFormsDoc },
                { id: 'reactive', label: 'Reactive Forms', component: ReactiveFormsDoc },
                { id: 'signalforms', label: 'Signal Forms', component: SignalFormsDoc }
            ]
        },
        { id: 'accessibility', label: 'Accessibility', component: AccessibilityDoc }
    ];
}
