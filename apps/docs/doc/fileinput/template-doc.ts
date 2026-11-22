import { Component } from '@angular/core';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'template-doc',
    standalone: true,
    imports: [FileInputModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                The <i>dropzone</i> template replaces the content of the dropzone and receives an <i>open</i> function and an <i>active</i> flag, true while files are dragged over it. The <i>item</i> template replaces a row of the list and receives
                the item with its <i>remove</i>, <i>retry</i> and <i>cancel</i> functions.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-file accept=".csv,.xlsx">
                <ng-template #dropzone let-active="active">
                    <i class="pi pi-file-excel !text-3xl text-muted-color"></i>
                    <span class="font-semibold">{{ active ? 'Release to import' : 'Import a spreadsheet' }}</span>
                    <span class="text-sm text-muted-color">CSV or Excel</span>
                </ng-template>
                <ng-template #item let-item let-remove="remove">
                    <i class="pi pi-table text-muted-color"></i>
                    <span class="flex-1 truncate">{{ item.name }}</span>
                    <p-button icon="pi pi-times" severity="secondary" text rounded [ariaLabel]="'Remove ' + item.name" (onClick)="remove()" />
                </ng-template>
            </p-file>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDoc {}
