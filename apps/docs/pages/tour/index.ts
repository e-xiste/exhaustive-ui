import { AccessibilityDoc } from '@/doc/tour/accessibility-doc';
import { BasicDoc } from '@/doc/tour/basic-doc';
import { CenteredDoc } from '@/doc/tour/centered-doc';
import { ControlledDoc } from '@/doc/tour/controlled-doc';
import { ImportDoc } from '@/doc/tour/import-doc';
import { LabelsDoc } from '@/doc/tour/labels-doc';
import { PlacementDoc } from '@/doc/tour/placement-doc';
import { SpotlightDoc } from '@/doc/tour/spotlight-doc';
import { TemplateDoc } from '@/doc/tour/template-doc';
import { WithoutMaskDoc } from '@/doc/tour/withoutmask-doc';
import { PTComponent } from '@/doc/tour/pt/PTComponent';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    template: `<app-doc
        docTitle="Angular Tour Component - ExhaustiveUI"
        header="Tour"
        description="Tour guides the user through the interface, one step at a time: a spotlight highlights an element and a card next to it explains it, with a step counter and back and next buttons. It is an accessible dialog that follows its target when the page scrolls or the layout changes."
        [docs]="docs"
        [apiDocs]="['Tour']"
        [ptDocs]="ptComponent"
        themeDocs="tour"
    ></app-doc>`,
    standalone: true,
    imports: [AppDoc]
})
export class TourDemo {
    ptComponent = PTComponent;
    docs = [
        { id: 'import', label: 'Import', component: ImportDoc },
        { id: 'basic', label: 'Basic', component: BasicDoc },
        { id: 'placement', label: 'Placement', component: PlacementDoc },
        { id: 'centered', label: 'Centered Step', component: CenteredDoc },
        { id: 'template', label: 'Template', component: TemplateDoc },
        { id: 'controlled', label: 'Controlled', component: ControlledDoc },
        { id: 'withoutmask', label: 'Without Mask', component: WithoutMaskDoc },
        { id: 'spotlight', label: 'Spotlight', component: SpotlightDoc },
        { id: 'labels', label: 'Labels', component: LabelsDoc },
        { id: 'accessibility', label: 'Accessibility', component: AccessibilityDoc }
    ];
}
