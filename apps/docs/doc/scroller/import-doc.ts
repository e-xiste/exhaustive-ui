import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'import-doc',
    standalone: true,
    imports: [AppCode],
    template: `<app-code [code]="code" [hideToggleCode]="true"></app-code>`
})
export class ImportDoc {
    code: Code = {
        typescript: `import { Scroller } from '@exhaustive-ui/core/scroller';`
    };
}
