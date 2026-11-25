import { AppDoc } from '@/components/doc/app.doc';
import { ComparisonExhaustiveDoc } from '@/doc/comparison/exhaustiveui-doc';
import { ComparisonLibrariesDoc } from '@/doc/comparison/libraries-doc';
import { ComparisonOthersDoc } from '@/doc/comparison/others-doc';
import { ComparisonOverviewDoc } from '@/doc/comparison/overview-doc';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    imports: [AppDoc],
    template: `<app-doc
        docTitle="Comparison - ExhaustiveUI"
        header="Choosing an Angular component library"
        description="ExhaustiveUI next to PrimeNG, Optimus UI and Angular Material: license, Angular version, maintainers, and when another library suits you better."
        [docs]="docs"
        docType="page"
    ></app-doc>`
})
export class ComparisonDemo {
    docs = [
        {
            id: 'overview',
            label: 'Overview',
            component: ComparisonOverviewDoc
        },
        {
            id: 'libraries',
            label: 'The Libraries',
            component: ComparisonLibrariesDoc
        },
        {
            id: 'others',
            label: 'When Another Library Suits You Better',
            component: ComparisonOthersDoc
        },
        {
            id: 'exhaustiveui',
            label: 'When ExhaustiveUI Suits You',
            component: ComparisonExhaustiveDoc
        }
    ];
}
