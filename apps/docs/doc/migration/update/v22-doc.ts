import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'update-v22-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, RouterModule],
    template: `
        <app-docsectiontext>
            <p>
                ExhaustiveUI v22 is the first major of the fork. It requires Angular 22 and moves the whole library to the Angular Signals API. Templates keep working as before; code that reaches into a component instance reads inputs with a call and
                writes two-way properties with <i>.set()</i>, and components use OnPush change detection. <i>ng update</i> applies nine migrations to templates and code and reports what it left for review.
            </p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <p>
                The <a [routerLink]="'/migration/v22'" class="doc-link">migration guide to v22</a> covers the update steps from an ExhaustiveUI prerelease, PrimeNG v21 or Optimus UI, each migration and its report, the code changes, and the behavior
                and type changes.
            </p>
        </app-docsectiontext>
    `
})
export class UpdateV22Doc {
    code: Code = {
        command: `ng update @angular/core@22 @angular/cli@22
ng update @exhaustive-ui/core@22`
    };
}
