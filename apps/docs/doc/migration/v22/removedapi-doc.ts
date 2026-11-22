import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'v22-removed-api-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>These removals have no migration: they only appear in TypeScript code, and the compiler points at each use.</p>
            <ul class="leading-relaxed">
                <li><i>OverlayOptions.showTransitionOptions</i>/<i>hideTransitionOptions</i> and <i>DynamicDialogConfig.rtl</i>/<i>transitionOptions</i>: nothing read them. Use <i>motionOptions</i>.</li>
                <li>
                    <i>&#64;exhaustive-ui/utils</i>: <i>classNames</i> becomes <i>cn</i>, <i>createStyleAsString</i> becomes <i>createStyleMarkup</i>, <i>createStyleTag</i> becomes <i>createStyleElement</i>, <i>mergeKeys</i> becomes <i>deepMerge</i>.
                </li>
                <li><i>&#64;exhaustive-ui/styled</i>: <i>getDirective</i> on the theme service becomes <i>getComponent</i>.</li>
                <li>
                    Sub components that render the inside of a component (<i>ContextMenuSub</i>, <i>TieredMenuSub</i>, <i>MenuItemContent</i>, <i>MultiSelectItem</i>, <i>ToastItem</i>, <i>TableBody</i>, <i>TTBody</i>, <i>UITreeNode</i>, the Galleria
                    parts...), <i>PARENT_INSTANCE</i> and the pre-signals helpers of <i>&#64;exhaustive-ui/core/utils</i> are still exported in v22 but tagged <i>&#64;internal</i>. They are not public API and can change in a minor release.
                </li>
            </ul>
        </app-docsectiontext>
    `
})
export class V22RemovedApiDoc {}
