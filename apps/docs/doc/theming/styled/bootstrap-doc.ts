import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Component } from '@angular/core';

@Component({
    selector: 'bootstrap-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Bootstrap has a <i>reboot</i> utility to reset the CSS of the standard elements. If you include it, import it in a layer that comes before the ExhaustiveUI one.</p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class BootstrapDoc {
    code = {
        typescript: `@layer bootstrap-reboot, exhaustive;

@import "bootstrap-reboot.css" layer(bootstrap-reboot);`
    };
}
