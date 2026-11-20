import { MajorVersionsDoc } from '@/doc/migration/update/major-versions-doc';
import { NgUpdateDoc } from '@/doc/migration/update/ng-update-doc';
import { UpdateOverviewDoc } from '@/doc/migration/update/overview-doc';
import { UpdateV22Doc } from '@/doc/migration/update/v22-doc';
import { ReleaseNotesDoc } from '@/doc/migration/update/release-notes-doc';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    standalone: true,
    imports: [AppDoc],
    template: `<app-doc docTitle="Update ExhaustiveUI - ExhaustiveUI" header="Update ExhaustiveUI" description="Updating an ExhaustiveUI project to a newer version with ng update." [docs]="docs" docType="page"></app-doc>`
})
export class MigrationUpdateDemo {
    docs = [
        {
            id: 'overview',
            label: 'Overview',
            component: UpdateOverviewDoc
        },
        {
            id: 'updating',
            label: 'Updating',
            component: NgUpdateDoc
        },
        {
            id: 'angular-compatibility',
            label: 'Angular Version Compatibility',
            component: MajorVersionsDoc
        },
        {
            id: 'v22',
            label: 'Updating to v22',
            component: UpdateV22Doc
        },
        {
            id: 'release-notes',
            label: 'Release Notes',
            component: ReleaseNotesDoc
        }
    ];
}
