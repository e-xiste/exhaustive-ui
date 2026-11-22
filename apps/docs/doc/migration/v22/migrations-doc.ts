import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'v22-migrations-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                <i>ng update</i> applies nine migrations to the templates (inline and external) and the TypeScript code of every project in the workspace. Each one only touches the ExhaustiveUI elements and APIs it knows, and reports what it cannot
                rewrite safely.
            </p>
            <ul class="leading-relaxed">
                <li>
                    <b>styleclass-to-class</b>: <i>styleClass</i>/<i>[styleClass]</i> becomes <i>class</i>/<i>[class]</i> on the ~60 components whose deprecated <i>styleClass</i> input was removed, such as Tag, Card, Select, Table, DatePicker, Panel,
                    AvatarGroup and InputGroupAddon.
                </li>
                <li>
                    <b>renamed-inputs</b>: Drawer <i>showCloseIcon</i> becomes <i>closable</i> and <i>ariaCloseLabel</i> becomes <i>closeAriaLabel</i>; Paginator <i>dropdownAppendTo</i> becomes <i>appendTo</i>; Password <i>maxLength</i> becomes
                    <i>maxlength</i>; AutoComplete <i>minLength</i> becomes <i>minQueryLength</i>; TreeSelect <i>containerStyleClass</i>/<i>containerStyle</i> become <i>class</i>/<i>style</i>; TreeTable <i>virtualRowHeight</i> becomes
                    <i>virtualScrollItemSize</i>; Listbox and MultiSelect <i>filterPlaceHolder</i> becomes <i>filterPlaceholder</i>; ImageCompare <i>ariaLabelledby</i> becomes <i>ariaLabelledBy</i>; Dialog <i>[content]</i>, which set the header
                    template, becomes <i>[headerTemplate]</i>; the <i>pt*</i> pass-through aliases of pButton, pButtonLabel, pButtonIcon, pBadge, pInputText and pTooltip become <i>pButtonPT</i>, <i>pButtonLabelPT</i>, <i>pButtonIconPT</i>,
                    <i>pBadgePT</i>, <i>pInputTextPT</i> and <i>pTooltipPT</i>; pBadge <i>size</i> on a plain element becomes <i>badgeSize</i>.
                </li>
                <li>
                    <b>renamed-outputs</b>: OrderList <i>onFilterEvent</i> becomes <i>onFilter</i>; Table <i>selectAllChange</i> becomes <i>onSelectAllChange</i>; MultiSelect <i>onPanelShow</i>/<i>onPanelHide</i> become <i>onShow</i>/<i>onHide</i>.
                    The payloads are unchanged, so handlers reading <i>$event</i> keep working.
                </li>
                <li><b>renamed-templates</b>: the MultiSelect <i>removetokenicon</i> template becomes <i>chipicon</i>, with the same context.</li>
                <li>
                    <b>remove-dead-inputs</b>: removes the bindings of about eighty inputs that had already stopped doing anything, such as the <i>*TransitionOptions</i> inputs (replaced by <i>motionOptions</i>), <i>autoZIndex</i>/<i>baseZIndex</i>
                    on sub menus, Table <i>frozenColumns</i>/<i>frozenWidth</i>, the ConfirmDialog aria labels and the <i>trackBy</i> inputs of DataView, OrderList and PickList.
                </li>
                <li><b>remove-dead-outputs</b>: removes Overlay <i>onAnimationStart</i>/<i>onAnimationDone</i> and MenubarSub <i>menuFocus</i>/<i>menuBlur</i>/<i>menuKeydown</i>.</li>
                <li><b>config-overlay-options-signal</b>: <i>Exhaustive.overlayOptions</i> is a signal. Assignments become <i>.set()</i> and reads become calls.</li>
                <li><b>config-input-style-to-variant</b>: the global <i>inputStyle</i> option becomes <i>inputVariant</i> (same values), in <i>provideExhaustive()</i>/<i>setConfig()</i> objects and on the <i>Exhaustive</i> service.</li>
                <li>
                    <b>removed-exports</b>: <i>Password_VALUE_ACCESSOR</i> becomes <i>PASSWORD_VALUE_ACCESSOR</i>; the removed <i>InplaceDisplay</i>/<i>InplaceContent</i> wrappers are dropped from imports and their elements become
                    <i>&lt;span&gt;</i>.
                </li>
            </ul>
        </app-docsectiontext>
    `
})
export class V22MigrationsDoc {}
