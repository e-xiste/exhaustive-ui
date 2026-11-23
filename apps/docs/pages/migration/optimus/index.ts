import { OptimusChecklistDoc } from '@/doc/migration/optimus/checklist-doc';
import { OptimusLayerDoc } from '@/doc/migration/optimus/layer-doc';
import { OptimusOverviewDoc } from '@/doc/migration/optimus/overview-doc';
import { OptimusPackagesDoc } from '@/doc/migration/optimus/packages-doc';
import { OptimusPrerequisitesDoc } from '@/doc/migration/optimus/prerequisites-doc';
import { OptimusRenameDoc } from '@/doc/migration/optimus/rename-doc';
import { OptimusV22Doc } from '@/doc/migration/optimus/v22-doc';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    standalone: true,
    imports: [AppDoc],
    template: `<app-doc
        docTitle="Migrate from Optimus UI to ExhaustiveUI for Angular 22 - ExhaustiveUI"
        header="Migrating from Optimus UI"
        description="Move an Optimus UI v2 application to ExhaustiveUI, the MIT fork for Angular 22 rebuilt on Signals: one schematic for the package and configuration renames, then the ng update migrations."
        [docs]="docs"
        docType="page"
    ></app-doc>`
})
export class MigrationOptimusDemo {
    docs = [
        { id: 'overview', label: 'Overview', component: OptimusOverviewDoc },
        { id: 'prerequisites', label: 'Before you start', component: OptimusPrerequisitesDoc },
        { id: 'steps', label: 'Migration steps', component: OptimusPackagesDoc },
        { id: 'schematic', label: 'What the schematic changes', component: OptimusRenameDoc },
        { id: 'css-layer', label: 'CSS layer', component: OptimusLayerDoc },
        { id: 'v22', label: 'v22 migrations', component: OptimusV22Doc },
        { id: 'checklist', label: 'Checklist', component: OptimusChecklistDoc }
    ];
}
