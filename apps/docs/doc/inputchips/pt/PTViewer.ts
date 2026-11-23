import { AppDocPtViewer } from '@/components/doc/app.docptviewer';
import { getPTOptions } from '@/components/doc/app.docptviewer';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';

@Component({
    selector: 'inputchips-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, FormsModule, InputChipsModule],
    template: `
        <app-docptviewer [docs]="docs">
            <p-inputchips [(ngModel)]="value" ariaLabel="Tags" placeholder="Add a tag" />
        </app-docptviewer>
    `
})
export class PTViewer {
    value: string[] = ['angular', 'signals'];

    docs = [{ data: getPTOptions('InputChips'), key: 'InputChips' }];
}
