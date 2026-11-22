import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'optimus-rename-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>Then replace these names in the TypeScript sources, stylesheets, <i>angular.json</i> and the Tailwind CSS configuration:</p>
            <ul class="leading-relaxed">
                <li>
                    <i>&#64;openng/optimus-ui-themes</i>, <i>-tailwindcss</i>, <i>-locale</i>, <i>-styled</i>, <i>-styles</i>, <i>-utils</i> and <i>-motion</i> become <i>&#64;exhaustive-ui/themes</i>, <i>tailwindcss</i>, <i>locale</i>, <i>styled</i>,
                    <i>styles</i>, <i>utils</i> and <i>motion</i>, subpaths included.
                </li>
                <li><i>&#64;openng/optimus-ui</i> becomes <i>&#64;exhaustive-ui/core</i>, subpaths included: <i>&#64;openng/optimus-ui/button</i> becomes <i>&#64;exhaustive-ui/core/button</i>. Replace the longer names first.</li>
                <li><i>provideOptimus</i> becomes <i>provideExhaustive</i>.</li>
                <li>The <i>Optimus</i> configuration service becomes <i>Exhaustive</i>.</li>
                <li><i>OptimusConfigType</i> becomes <i>ExhaustiveConfigType</i>, and <i>OPTIMUS_CONFIG</i> becomes <i>EXHAUSTIVE_CONFIG</i>.</li>
            </ul>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <p>
                On Linux, GNU sed can do it in one pass over the files that mention Optimus UI. It replaces whole words only, so a name such as <i>OptimusTheme</i> stays, but a comment that says "Optimus UI" becomes "Exhaustive UI": review the result
                with <i>git diff</i>.
            </p>
            <app-code [code]="sedCode" [hideToggleCode]="true"></app-code>
        </app-docsectiontext>
    `
})
export class OptimusRenameDoc {
    code: Code = {
        typescript: `// Before
import { ApplicationConfig } from '@angular/core';
import { Optimus, provideOptimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [provideOptimus({ theme: { preset: Aura } })]
};

// After
import { ApplicationConfig } from '@angular/core';
import { Exhaustive, provideExhaustive } from '@exhaustive-ui/core/config';
import Aura from '@exhaustive-ui/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [provideExhaustive({ theme: { preset: Aura } })]
};`
    };

    sedCode: Code = {
        command: `git grep -lE "optimus-ui|Optimus|OPTIMUS_CONFIG" -- src angular.json '*.config.*' | xargs sed -i -E \\
  -e 's#@openng/optimus-ui-(themes|tailwindcss|locale|styled|styles|utils|motion)#@exhaustive-ui/\\1#g' \\
  -e 's#@openng/optimus-ui#@exhaustive-ui/core#g' \\
  -e 's#\\bprovideOptimus\\b#provideExhaustive#g' \\
  -e 's#\\bOptimusConfigType\\b#ExhaustiveConfigType#g' \\
  -e 's#\\bOPTIMUS_CONFIG\\b#EXHAUSTIVE_CONFIG#g' \\
  -e 's#\\bOptimus\\b#Exhaustive#g'`
    };
}
