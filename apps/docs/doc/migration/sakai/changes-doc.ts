import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'sakai-changes-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, RouterModule],
    template: `
        <app-docsectiontext>
            <p>sakai-ng calls methods on its component instances, such as <code>dt.filterGlobal()</code>, but reads and writes none of their inputs. An application that does has more to change.</p>
            <p>Component instances have signals. A template binds as before; code that holds an instance does not:</p>
            <app-code [code]="signals" [hideToggleCode]="true"></app-code>
            <p>Components are OnPush, except Table, TreeTable and DynamicDialog. A list changed in place is no longer seen:</p>
            <app-code [code]="onPush" [hideToggleCode]="true"></app-code>
            <p>The paths of the modules in mocks, such as <code>vi.mock('primeng/button')</code>, are in the report. The <a [routerLink]="'/migration/v22'" class="doc-link">guide to v22</a> lists the rest.</p>
        </app-docsectiontext>
    `
})
export class SakaiChangesDoc {
    signals: Code = {
        typescript: `// Before
this.table.first = 0;

// After, with a viewChild() query
this.table().first.set(0);`
    };

    onPush: Code = {
        typescript: `// Before
this.options.push(option);

// After
this.options = [...this.options, option];`
    };
}
