import { ComponentsDoc } from '@/doc/guides/naming/components-doc';
import { DirectivesDoc } from '@/doc/guides/naming/directives-doc';
import { LegacyDoc } from '@/doc/guides/naming/legacy-doc';
import { TemplatesDoc } from '@/doc/guides/naming/templates-doc';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    selector: 'naming-demo',
    standalone: true,
    imports: [AppDoc],
    template: `<app-doc
        docTitle="Naming Conventions - ExhaustiveUI"
        header="Naming Conventions"
        description="How components, directives and templates are named in ExhaustiveUI. Tests check these rules on every change."
        [docs]="docs"
        docType="page"
    ></app-doc>`
})
export class NamingDemoComponent {
    docs = [
        { id: 'components', label: 'Components', component: ComponentsDoc },
        { id: 'directives', label: 'Directives', component: DirectivesDoc },
        { id: 'templates', label: 'Templates', component: TemplatesDoc },
        { id: 'legacy', label: 'Legacy Spellings', component: LegacyDoc }
    ];
}
