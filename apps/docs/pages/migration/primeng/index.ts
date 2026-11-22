import { PrimengChecklistDoc } from '@/doc/migration/primeng/checklist-doc';
import { PrimengManualDoc } from '@/doc/migration/primeng/manual-doc';
import { PrimengOverviewDoc } from '@/doc/migration/primeng/overview-doc';
import { PrimengPrerequisitesDoc } from '@/doc/migration/primeng/prerequisites-doc';
import { PrimengSchematicDoc } from '@/doc/migration/primeng/schematic-doc';
import { PrimengStepsDoc } from '@/doc/migration/primeng/steps-doc';
import { PrimengV22Doc } from '@/doc/migration/primeng/v22-doc';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    standalone: true,
    imports: [AppDoc],
    template: `<app-doc
        docTitle="Migrating from PrimeNG - ExhaustiveUI"
        header="Migrating from PrimeNG"
        description="Moving a PrimeNG v21 application to ExhaustiveUI with the migrate-from-primeng schematic and the v22 migrations."
        [docs]="docs"
        docType="page"
    ></app-doc>`
})
export class MigrationPrimengDemo {
    docs = [
        { id: 'overview', label: 'Overview', component: PrimengOverviewDoc },
        { id: 'prerequisites', label: 'Before you start', component: PrimengPrerequisitesDoc },
        { id: 'steps', label: 'Migration steps', component: PrimengStepsDoc },
        { id: 'schematic', label: 'What the schematic changes', component: PrimengSchematicDoc },
        { id: 'manual', label: 'Manual checks', component: PrimengManualDoc },
        { id: 'v22', label: 'What changes in v22', component: PrimengV22Doc },
        { id: 'checklist', label: 'Checklist', component: PrimengChecklistDoc }
    ];
}
