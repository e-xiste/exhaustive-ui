import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'download-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>
                Prefer to wire things up yourself? Install the packages from the <a href="https://www.npmjs.com/package/@exhaustive-ui/core" target="_blank" rel="noopener noreferrer">npm registry</a> directly. The next section covers the provider
                setup that <i>ng add</i> would have written for you.
            </p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class DownloadDoc {
    code: Code = {
        command: `# Using npm
npm install @exhaustive-ui/core @exhaustive-ui/themes

# Using yarn
yarn add @exhaustive-ui/core @exhaustive-ui/themes

# Using pnpm
pnpm add @exhaustive-ui/core @exhaustive-ui/themes`
    };
}
