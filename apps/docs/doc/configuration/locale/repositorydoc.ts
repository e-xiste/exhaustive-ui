import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'repository-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>
                Ready to use settings for locales are available as the <i>&#64;exhaustive-ui/locale</i> package, maintained in the
                <a href="https://github.com/e-xiste/exhaustive-ui/tree/main/packages/locale" target="_blank" rel="noopener noreferrer">ExhaustiveUI</a> repository. We'd appreciate if you could contribute translations to the repository and share them
                with the rest of the community.
            </p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
        </app-docsectiontext>
    `
})
export class RepositoryDoc {
    code: Code = {
        typescript: `import { de } from '@exhaustive-ui/locale/js/de.js';

provideExhaustive({
    translation: de
})`
    };
}
