import { PrimengLicenseDoc } from '@/doc/migration/primeng/license-doc';
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
        docTitle="Migrate from PrimeNG to an MIT library for Angular 22 - ExhaustiveUI"
        header="Migrating from PrimeNG"
        description="PrimeNG v22 is no longer MIT. Move a PrimeNG v21 application to ExhaustiveUI, its MIT continuation for Angular 22, with one schematic and the ng update migrations."
        [docs]="docs"
        docType="page"
    ></app-doc>`
})
export class MigrationPrimengDemo {
    docs = [
        { id: 'license', label: 'PrimeNG license change: your options', component: PrimengLicenseDoc },
        { id: 'overview', label: 'Overview', component: PrimengOverviewDoc },
        { id: 'prerequisites', label: 'Before you start', component: PrimengPrerequisitesDoc },
        { id: 'steps', label: 'Migration steps', component: PrimengStepsDoc },
        { id: 'schematic', label: 'What the schematic changes', component: PrimengSchematicDoc },
        { id: 'manual', label: 'Manual checks', component: PrimengManualDoc },
        { id: 'v22', label: 'What changes in v22', component: PrimengV22Doc },
        { id: 'checklist', label: 'Checklist', component: PrimengChecklistDoc }
    ];
}
