import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'sakai-commands-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, RouterModule],
    template: `
        <app-docsectiontext>
            <p>Start from a clean working tree, with a build that passes.</p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <p>
                <code>--force</code> and <code>--legacy-peer-deps</code> are there for the same reason: PrimeNG 21 wants Angular 21, and it is still installed at that point. The third command removes it. The
                <a [routerLink]="'/migration/primeng'" class="doc-link">migration guide</a> details each step; it lacked the second flag until this migration.
            </p>
        </app-docsectiontext>
    `
})
export class SakaiCommandsDoc {
    code: Code = {
        command: `ng update @angular/core@22 @angular/cli@22 --force
npm install @exhaustive-ui/core@22 --legacy-peer-deps
ng generate @exhaustive-ui/core:migrate-from-primeng
ng update @exhaustive-ui/core --migrate-only --from=3.0.0`
    };
}
