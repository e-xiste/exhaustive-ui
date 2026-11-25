import { AppDoc } from '@/components/doc/app.doc';
import { SakaiApplicationDoc } from '@/doc/migration/sakai/application-doc';
import { SakaiChangesDoc } from '@/doc/migration/sakai/changes-doc';
import { SakaiCheckDoc } from '@/doc/migration/sakai/check-doc';
import { SakaiCommandsDoc } from '@/doc/migration/sakai/commands-doc';
import { SakaiResultDoc } from '@/doc/migration/sakai/result-doc';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    imports: [AppDoc],
    template: `<app-doc
        docTitle="Move a PrimeNG 21 application to Angular 22 - ExhaustiveUI"
        header="Moving a PrimeNG 21 application to Angular 22"
        description="A real migration, with its numbers: sakai-ng, an admin template of 24 routes, from PrimeNG 21 to ExhaustiveUI 22 and Angular 22."
        [docs]="docs"
        docType="page"
    ></app-doc>`
})
export class MigrationSakaiDemo {
    docs = [
        { id: 'application', label: 'The application', component: SakaiApplicationDoc },
        { id: 'commands', label: 'The commands', component: SakaiCommandsDoc },
        { id: 'result', label: 'What happened', component: SakaiResultDoc },
        { id: 'changes', label: 'What another application may have to change', component: SakaiChangesDoc },
        { id: 'check', label: 'Checking the templates', component: SakaiCheckDoc }
    ];
}
