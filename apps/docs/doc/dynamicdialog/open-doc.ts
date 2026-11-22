import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from '@exhaustive-ui/core/dynamicdialog';
import { ProductListDemo } from './productlistdemo';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'open-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>The <i>open</i> method of the <i>DialogService</i> is used to open a Dialog. First parameter is the component to load and second one is the configuration object to customize the Dialog.</p>
            <p>It returns the <i>DynamicDialogRef</i> of the new dialog, or <i>null</i> when a dialog with the same component is already open, unless <i>duplicate</i> is enabled in the configuration.</p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `,
    providers: [DialogService]
})
export class OpenDoc {
    constructor(public dialogService: DialogService) {}

    ref: DynamicDialogRef | undefined;

    show() {
        this.ref = this.dialogService.open(ProductListDemo, { header: 'Select a Product' });
    }

    code: Code = {
        typescript: `
import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from '@exhaustive-ui/core/dynamicdialog';
import { ProductListDemo } from './productlistdemo';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: \`<p-button (click)="show()" label="Show" />\`,
    imports: [ButtonModule],
    providers: [DialogService]
})
export class DynamicDialogDemo {

    ref: DynamicDialogRef | undefined;

    constructor(public dialogService: DialogService) {}

    show() {
        this.ref = this.dialogService.open(ProductListDemo, { header: 'Select a Product'});
    }
}`
    };
}
