import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'sakai-check-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <p>
                On sakai-ng, it found two mistakes that the PrimeNG version already had: a <code>display</code> attribute that AutoComplete does not have, and an <code>#option</code> template that OrderList ignores. It also reported six inputs of
                <code>routerLink</code> by mistake, which is fixed in 22.9.1.
            </p>
        </app-docsectiontext>
    `
})
export class SakaiCheckDoc {
    code: Code = {
        command: `npx -y @exhaustive-ui/mcp check`
    };
}
