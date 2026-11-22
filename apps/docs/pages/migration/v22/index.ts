import { V22BehaviorDoc } from '@/doc/migration/v22/behavior-doc';
import { V22ChecklistDoc } from '@/doc/migration/v22/checklist-doc';
import { V22MigrationsDoc } from '@/doc/migration/v22/migrations-doc';
import { V22OnPushDoc } from '@/doc/migration/v22/onpush-doc';
import { V22OverviewDoc } from '@/doc/migration/v22/overview-doc';
import { V22PrerequisitesDoc } from '@/doc/migration/v22/prerequisites-doc';
import { V22RemovedApiDoc } from '@/doc/migration/v22/removedapi-doc';
import { V22ReviewDoc } from '@/doc/migration/v22/review-doc';
import { V22SignalsDoc } from '@/doc/migration/v22/signals-doc';
import { V22StepsDoc } from '@/doc/migration/v22/steps-doc';
import { V22TypesDoc } from '@/doc/migration/v22/types-doc';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    standalone: true,
    imports: [AppDoc],
    template: `<app-doc
        docTitle="Migrating to v22 - ExhaustiveUI"
        header="Migrating to v22"
        description="Moving an application to ExhaustiveUI v22: Angular 22, the Signals API, OnPush and the automated migrations."
        [docs]="docs"
        docType="page"
    ></app-doc>`
})
export class MigrationV22Demo {
    docs = [
        { id: 'overview', label: 'Overview', component: V22OverviewDoc },
        { id: 'prerequisites', label: 'Before you start', component: V22PrerequisitesDoc },
        { id: 'steps', label: 'Update steps', component: V22StepsDoc },
        { id: 'migrations', label: 'Automated migrations', component: V22MigrationsDoc },
        { id: 'review', label: 'Reviewing the report', component: V22ReviewDoc },
        { id: 'signals', label: 'Code using a component instance', component: V22SignalsDoc },
        { id: 'onpush', label: 'OnPush change detection', component: V22OnPushDoc },
        { id: 'removed-api', label: 'Removed TypeScript API', component: V22RemovedApiDoc },
        { id: 'behavior', label: 'Behavior changes', component: V22BehaviorDoc },
        { id: 'types', label: 'Type changes', component: V22TypesDoc },
        { id: 'checklist', label: 'Checklist', component: V22ChecklistDoc }
    ];
}
