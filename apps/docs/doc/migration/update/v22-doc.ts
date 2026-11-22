import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'update-v22-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>
                ExhaustiveUI v22 is the first major of the fork. It requires Angular v22 and moves the whole library to the Angular Signals API. Templates keep working as before: inputs are still bound with <i>[name]</i>, two-way bindings with
                <i>[(name)]</i>, and outputs with <i>(name)</i>. What changes is code that reaches into a component instance.
            </p>
            <ul class="leading-relaxed">
                <li>Inputs are signal inputs: read them as <i>component.name()</i> rather than <i>component.name</i>, and set them through a template binding rather than by assignment.</li>
                <li>Two-way properties such as <i>visible</i>, <i>value</i> or <i>selection</i> are <i>model()</i> signals; call <i>.set()</i> on them from code.</li>
                <li>Template and child queries are signal queries (<i>contentChild()</i>, <i>viewChild()</i>, ...), read with a call as well.</li>
                <li>Components use <i>OnPush</i> change detection, except Table, TreeTable and DynamicDialog. State shared with them should be passed through inputs or signals rather than mutated in place.</li>
                <li>Templates use the built-in <i>&#64;if</i> / <i>&#64;for</i> control flow, and option lists, menus and paginators track rows by position, so replacing the model no longer recreates every row.</li>
            </ul>
            <p>Run the update with <i>ng update</i>; it applies the automated migrations shipped with v22 to your templates and code:</p>
            <app-code [code]="code" [hideToggleCode]="true"></app-code>
            <ul class="leading-relaxed">
                <li><b>styleclass-to-class</b>: <i>styleClass</i> becomes the native <i>class</i> attribute on the components that dropped the input.</li>
                <li>
                    <b>renamed-inputs</b>: deprecated aliases are renamed to their replacement, e.g. <i>showCloseIcon</i> to <i>closable</i> on Drawer, <i>minLength</i> to <i>minQueryLength</i> on AutoComplete, <i>virtualRowHeight</i> to
                    <i>virtualScrollItemSize</i> on TreeTable, <i>filterPlaceHolder</i> to <i>filterPlaceholder</i> on Listbox and MultiSelect.
                </li>
                <li>
                    <b>renamed-outputs</b>: outputs are renamed to the name the other components use, with the same event payload: <i>onFilterEvent</i> to <i>onFilter</i> on OrderList, <i>selectAllChange</i> to <i>onSelectAllChange</i> on Table,
                    <i>onPanelShow</i>/<i>onPanelHide</i> to <i>onShow</i>/<i>onHide</i> on MultiSelect.
                </li>
                <li><b>remove-dead-inputs</b> and <b>remove-dead-outputs</b>: bindings of inputs and outputs that already had no effect are removed.</li>
                <li><b>config-overlay-options-signal</b>: <i>overlayOptions</i> on the global configuration is a signal; assignments become <i>.set()</i> and reads become calls.</li>
                <li><b>config-input-style-to-variant</b>: the global <i>inputStyle</i> option, deprecated since v20, becomes <i>inputVariant</i> in <i>provideExhaustive()</i> and on the configuration service.</li>
            </ul>
            <p>Each migration prints the files it changed and the places it left for you to review, with file and line numbers.</p>
            <p>A workspace that has just switched to ExhaustiveUI, from PrimeNG with the <i>migrate-from-primeng</i> schematic or from Optimus UI, did not go through <i>ng update</i>. Run the migrations explicitly:</p>
            <app-code [code]="migrateOnlyCode" [hideToggleCode]="true"></app-code>
        </app-docsectiontext>
    `
})
export class UpdateV22Doc {
    code: Code = {
        command: `ng update @angular/core@22 @angular/cli@22
ng update @exhaustive-ui/core@22`
    };

    migrateOnlyCode: Code = {
        command: `ng update @exhaustive-ui/core --migrate-only --from=3.0.0`
    };
}
