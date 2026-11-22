import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'v22-signals-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>
                Every input is an <i>input()</i>, every two-way property a <i>model()</i>, every output an <i>output()</i> and every query a signal query. No <i>&#64;Input</i>, <i>&#64;Output</i>, <i>&#64;ViewChild</i> or
                <i>&#64;ContentChild</i> decorator is left. Templates are not affected, and the migrations do not rewrite this kind of code: the compiler points at each place.
            </p>
            <ul class="leading-relaxed">
                <li>Read an input by calling it: <i>table.first()</i>, not <i>table.first</i>.</li>
                <li>Inputs can no longer be assigned from code. Bind them in the template to a field or a signal of your component, and change that instead.</li>
                <li>
                    Two-way properties are <i>model()</i> signals: write them with <i>.set()</i>, as in <i>drawer.visible.set(true)</i>. The value and change-event pairs became models, for example <i>first</i>, <i>rows</i> and <i>selection</i> on
                    Table and TreeTable, and <i>visible</i> on Dialog, Drawer and Galleria. <i>[(x)]</i> bindings keep working.
                </li>
                <li>Outputs are <i>OutputEmitterRef</i>s: <i>.subscribe()</i> still works, <i>.pipe()</i> and the other <i>EventEmitter</i> members do not. Use <i>outputToObservable()</i> when you need an observable.</li>
                <li>Public child references of a component are signal queries too, and are read with a call.</li>
                <li>The global configuration is a set of signals on the <i>Exhaustive</i> service: <i>config.ripple.set(true)</i>, <i>config.inputVariant()</i>.</li>
            </ul>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
        </app-docsectiontext>
    `
})
export class V22SignalsDoc {
    code: Code = {
        typescript: `// Before
@ViewChild(Table) table!: Table;
@ViewChild(Drawer) drawer!: Drawer;

reset() {
    const first = this.table.first;
    this.table.selection = [];
    this.drawer.visible = false;
    this.config.ripple = true;
}

// After
table = viewChild.required(Table);
drawer = viewChild.required(Drawer);

reset() {
    const first = this.table().first();
    this.table().selection.set([]);
    this.drawer().visible.set(false);
    this.config.ripple.set(true);
}`
    };
}
