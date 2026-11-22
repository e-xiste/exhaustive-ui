import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'optimus-packages-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>Each package has a counterpart with the same content and the same subpaths:</p>
            <ul class="leading-relaxed">
                <li><i>&#64;openng/optimus-ui</i> becomes <i>&#64;exhaustive-ui/core</i></li>
                <li><i>&#64;openng/optimus-ui-themes</i> becomes <i>&#64;exhaustive-ui/themes</i></li>
                <li><i>&#64;openng/optimus-ui-tailwindcss</i> becomes <i>&#64;exhaustive-ui/tailwindcss</i></li>
                <li><i>&#64;openng/optimus-ui-locale</i> becomes <i>&#64;exhaustive-ui/locale</i></li>
                <li><i>&#64;openng/optimus-ui-styled</i>, <i>-styles</i>, <i>-utils</i> and <i>-motion</i> become <i>&#64;exhaustive-ui/styled</i>, <i>styles</i>, <i>utils</i> and <i>motion</i></li>
                <li><i>&#64;openng/icons</i> stays: ExhaustiveUI uses the same icon set.</li>
            </ul>
            <p>Remove the Optimus UI packages your project lists and add their counterparts. Most projects list only the core package, the themes and sometimes the Tailwind CSS plugin; the others come with them.</p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
        </app-docsectiontext>
    `
})
export class OptimusPackagesDoc {
    code: Code = {
        command: `npm uninstall @openng/optimus-ui @openng/optimus-ui-themes @openng/optimus-ui-tailwindcss
npm install @exhaustive-ui/core@22 @exhaustive-ui/themes@22 @exhaustive-ui/tailwindcss@22`
    };
}
