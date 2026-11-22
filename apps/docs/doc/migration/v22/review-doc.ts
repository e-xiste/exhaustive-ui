import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'v22-review-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Each migration prints the files it changed, then the places it left for you, with the file and line. These are the cases it reports and what to do with them.</p>
            <ul class="leading-relaxed">
                <li><b>Programmatic access to a removed or renamed name</b>, such as <i>drawer.showCloseIcon = true</i> or <i>table.selectAllChange.subscribe(...)</i>: use the new name, and the Signals API described below.</li>
                <li><b>A tag that binds both the old and the new name</b>: keep the new one and delete the old one, after checking which value you meant.</li>
                <li>
                    <b>A Table <i>[(selectAll)]</i> two-way binding</b>, which relied on the renamed <i>selectAllChange</i>: bind <i>[selectAll]="selectAll"</i> and <i>(onSelectAllChange)="selectAll = $event.checked"</i>.
                </li>
                <li>
                    <b>A MultiSelect that already projects a <i>chipicon</i> template</b> next to <i>removetokenicon</i>: keep one of them.
                </li>
                <li>
                    <b>A configuration object that sets both <i>inputStyle</i> and <i>inputVariant</i></b
                    >, or a receiver the migration cannot prove to be the <i>Exhaustive</i> service: set <i>inputVariant</i> only.
                </li>
                <li>
                    <b>Imports of rendering internals that are no longer exported</b>: the <i>SelectItem</i> option component of Select (the <i>SelectItem</i> interface of <i>&#64;exhaustive-ui/core/api</i> is unchanged), Menu's <i>SafeHtmlPipe</i>,
                    <i>MapperPipe</i>, <i>RadioControlRegistry</i> and <i>MenubarService</i>. Remove the import; the components no longer need them from you.
                </li>
            </ul>
            <p>Coding agents can check the result with the <i>validate_usage</i> tool of the <i>&#64;exhaustive-ui/mcp</i> server, which names the replacement of every input removed or renamed in v22, and follow its <i>update_to_v22</i> prompt.</p>
        </app-docsectiontext>
    `
})
export class V22ReviewDoc {}
