import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'installation-icons-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                ExhaustiveUI components ship their own SVG icons, so an icon library is optional: install one only for the icons you add yourself, through an <i>icon</i> input or a template. Every example in this documentation uses the
                <i>pi pi-&#123;icon&#125;</i> classes from <a [routerLink]="'/icons'" class="doc-link">OpenNG Icons</a>; install it if you want the demos to look the way they do here.
            </p>
            <app-code [code]="installCode" [hideToggleCode]="true" class="block mb-4"></app-code>
            <p>Then import the stylesheet, either from your global stylesheet or from the <i>styles</i> array in <i>angular.json</i>.</p>
            <app-code [code]="importCode" [hideToggleCode]="true"></app-code>
        </app-docsectiontext>
    `
})
export class InstallationIconsDoc {
    installCode: Code = {
        command: `npm install @openng/icons`
    };

    importCode: Code = {
        scss: `@import "@openng/icons/openng-icons.css";`
    };
}
