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
            <p>The schematic visits every file of the workspace except <i>node_modules</i>, build output and the files your <i>.gitignore</i> excludes.</p>
            <h3>Dependencies</h3>
            <p>In every <i>package.json</i> of the workspace, each package is replaced by its counterpart, which has the same content and the same subpaths:</p>
            <ul class="leading-relaxed">
                <li><i>&#64;openng/optimus-ui</i> becomes <i>&#64;exhaustive-ui/core</i></li>
                <li>
                    <i>&#64;openng/optimus-ui-themes</i>, <i>-tailwindcss</i>, <i>-locale</i>, <i>-styled</i>, <i>-styles</i>, <i>-utils</i> and <i>-motion</i> become <i>&#64;exhaustive-ui/themes</i>, <i>tailwindcss</i>, <i>locale</i>, <i>styled</i>,
                    <i>styles</i>, <i>utils</i> and <i>motion</i>
                </li>
                <li><i>&#64;openng/icons</i> stays: ExhaustiveUI uses the same icon set.</li>
            </ul>
            <h3>TypeScript</h3>
            <p>
                Imports, dynamic imports and <i>require()</i> calls are rewritten, subpaths included (<i>&#64;openng/optimus-ui/button</i> becomes <i>&#64;exhaustive-ui/core/button</i>), and so is the Tailwind CSS configuration file. The
                configuration API is renamed where it is imported from Optimus UI, along with every use in the file: <i>provideOptimus</i> becomes <i>provideExhaustive</i>, the <i>Optimus</i> service becomes <i>Exhaustive</i>,
                <i>OptimusConfigType</i> becomes <i>ExhaustiveConfigType</i> and <i>OPTIMUS_CONFIG</i> becomes <i>EXHAUSTIVE_CONFIG</i>. A class of your own that happens to be named <i>Optimus</i> is left alone.
            </p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <h3>Stylesheets and angular.json</h3>
            <p><i>&#64;import</i>, <i>&#64;use</i>, <i>&#64;plugin</i> and <i>url()</i> references in stylesheets, and the <i>styles</i> and <i>scripts</i> entries of <i>angular.json</i> and <i>project.json</i>, follow the new package names.</p>
            <h3>The report</h3>
            <p>
                The schematic ends with the places that still mention <i>optimus-ui</i>, <i>Optimus</i>, <i>provideOptimus</i>, <i>OptimusConfigType</i> or <i>OPTIMUS_CONFIG</i>, with the file and line: templates, Markdown, comments, or module paths
                passed to other functions, such as <i>jest.mock()</i>. Lockfiles are left out, since the install regenerates them.
            </p>
        </app-docsectiontext>
    `
})
export class OptimusRenameDoc {
    code: Code = {
        typescript: `// Before
import { ApplicationConfig } from '@angular/core';
import { provideOptimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [provideOptimus({ theme: { preset: Aura } })]
};

// After
import { ApplicationConfig } from '@angular/core';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import Aura from '@exhaustive-ui/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [provideExhaustive({ theme: { preset: Aura } })]
};`
    };
}
