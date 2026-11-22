import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'primeng-schematic-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>The schematic visits every file of the workspace except <i>node_modules</i>, build output and the files your <i>.gitignore</i> excludes.</p>
            <h3>Dependencies</h3>
            <p>In every <i>package.json</i> of the workspace, including <i>overrides</i> and <i>resolutions</i>, each package is replaced by its counterpart:</p>
            <ul class="leading-relaxed">
                <li><i>primeng</i> becomes <i>&#64;exhaustive-ui/core</i></li>
                <li>
                    <i>&#64;primeuix/themes</i>, <i>&#64;primeuix/styled</i>, <i>&#64;primeuix/styles</i>, <i>&#64;primeuix/utils</i> and <i>&#64;primeuix/motion</i> become <i>&#64;exhaustive-ui/themes</i>, <i>&#64;exhaustive-ui/styled</i>,
                    <i>&#64;exhaustive-ui/styles</i>, <i>&#64;exhaustive-ui/utils</i> and <i>&#64;exhaustive-ui/motion</i>
                </li>
                <li><i>tailwindcss-primeui</i> becomes <i>&#64;exhaustive-ui/tailwindcss</i></li>
                <li><i>primelocale</i> becomes <i>&#64;exhaustive-ui/locale</i></li>
                <li><i>primeicons</i> becomes <i>&#64;openng/icons</i></li>
            </ul>
            <h3>TypeScript</h3>
            <p>
                Imports, dynamic imports and <i>require()</i> calls are rewritten, subpaths included (<i>primeng/button</i> becomes <i>&#64;exhaustive-ui/core/button</i>, <i>&#64;primeuix/themes/aura</i> becomes
                <i>&#64;exhaustive-ui/themes/aura</i>), and so is the Tailwind CSS configuration file. The configuration API is renamed where it is imported: <i>providePrimeNG</i> becomes <i>provideExhaustive</i>, the <i>PrimeNG</i> service becomes
                <i>Exhaustive</i>, <i>PrimeNGConfigType</i> becomes <i>ExhaustiveConfigType</i>, and the <i>PrimeIcons</i> constants become <i>OpenngIcons</i>.
            </p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <h3>Stylesheets and angular.json</h3>
            <p>
                <i>&#64;import</i>, <i>&#64;use</i>, <i>&#64;plugin</i> and <i>url()</i> references in stylesheets, and the <i>styles</i> and <i>scripts</i> entries of <i>angular.json</i> and <i>project.json</i>, follow the new package names.
                <i>primeicons/primeicons.css</i> becomes <i>&#64;openng/icons/openng-icons.css</i>; the <i>pi pi-*</i> classes in templates do not change.
            </p>
            <h3>CSS cascade layer</h3>
            <p>
                When the theme sets <i>cssLayer</i>, the <i>primeng</i> layer becomes <i>exhaustive</i> in its <i>name</i> and <i>order</i>, <i>primeng-overwrites</i> becomes <i>exhaustive-overwrites</i>, and the matching
                <i>&#64;layer</i> declarations in your stylesheets are renamed too, so your overrides keep their place in the layer order. With <i>cssLayer: true</i>, the configuration does not change, and only the stylesheets are renamed.
            </p>
            <h3>The report</h3>
            <p>
                The schematic ends with the places that still mention <i>primeng</i>, <i>primeicons</i>, <i>&#64;primeuix</i>, <i>tailwindcss-primeui</i> or <i>primelocale</i>, with the file and line: templates, Markdown, JSON or code it does not
                rewrite. Lockfiles are left out of the report, since the install regenerates them.
            </p>
        </app-docsectiontext>
    `
})
export class PrimengSchematicDoc {
    code: Code = {
        typescript: `// Before
import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [providePrimeNG({ theme: { preset: Aura } })]
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
