import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'v22-onpush-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>
                Every component uses <i>OnPush</i> change detection, except Table, TreeTable and DynamicDialog, which stay Eager on purpose because they render objects that applications commonly mutate in place. An OnPush component refreshes when one
                of its inputs gets a new value, when it handles an event, or when a signal it reads changes. It does not see a change made inside an array or an object it already holds.
            </p>
            <p>
                The symptom is a component that does not update: options added with <i>push()</i> that do not appear in a Select, a Tree node renamed in place, a chart that keeps its old data. Give the component a new array or object, or keep the
                data in a signal.
            </p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <p>
                Templates use the built-in <i>&#64;if</i>, <i>&#64;for</i> and <i>&#64;switch</i> control flow, and option lists, menus, Paginator and DatePicker reuse their rows when the data is replaced instead of recreating them. Replacing the
                array is therefore cheap, and no NG0955 or NG0956 warning comes from the library.
            </p>
        </app-docsectiontext>
    `
})
export class V22OnPushDoc {
    code: Code = {
        typescript: `// Before: the Select does not show the new option under OnPush
this.cities.push({ name: 'Paris', code: 'PRS' });

// After: a new array
this.cities = [...this.cities, { name: 'Paris', code: 'PRS' }];

// Or a signal, bound with [options]="cities()"
cities = signal<City[]>([]);
this.cities.update((cities) => [...cities, { name: 'Paris', code: 'PRS' }]);`
    };
}
