import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'migration-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule],
    template: `
        <app-docsectiontext>
            <p>
                PrimeFlex class names map closely onto Tailwind's, so most of the work is mechanical. PrimeTek's
                <a href="https://www.npmjs.com/package/primeclt" target="_blank" rel="noopener noreferrer">primeclt</a> ships a <i>pf2tw</i> command that does the conversion, and it works on any codebase — it rewrites class names and does not care
                which component library you use.
            </p>
            <app-code [code]="code1" [hideToggleCode]="true" [hideCodeSandbox]="true" [hideStackBlitz]="true"></app-code>
            <p class="mt-4">Run <i>pf2tw</i> in a directory containing the files to convert.</p>
            <app-code [code]="code2" [hideToggleCode]="true" [hideCodeSandbox]="true" [hideStackBlitz]="true"></app-code>
            <p class="mt-4">
                <i>pf2tw</i> was written for Tailwind v3. Tailwind v4 renamed a few of the utilities it produces, for example <i>shadow-sm</i> to <i>shadow-xs</i>, <i>rounded</i> to <i>rounded-sm</i> and <i>flex-grow</i> to <i>grow</i>. On Tailwind
                v4, check the converted classes against the <a href="https://tailwindcss.com/docs/upgrade-guide#renamed-utilities" target="_blank" rel="noopener noreferrer">renamed utilities</a> list of the Tailwind upgrade guide.
            </p>
            <p class="mt-4">A handful of PrimeFlex classes have no Tailwind counterpart and are left alone. Replace them with flexbox or grid utilities by hand:</p>
            <ul class="leading-loose">
                <li>formgrid</li>
                <li>formgroup</li>
                <li>formgroup-inline</li>
                <li>col</li>
                <li>col-fixed</li>
                <li>field</li>
                <li>field-checkbox</li>
                <li>field-radiobutton</li>
                <li>reset</li>
            </ul>
        </app-docsectiontext>
    `
})
export class MigrationDoc {
    code1: Code = {
        command: `npm install -g primeclt`
    };

    code2: Code = {
        command: `prime pf2tw`
    };
}
