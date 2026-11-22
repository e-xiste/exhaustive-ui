import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'v22-behavior-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>These changes compile without error but can change what users see, or what a test asserts. Most come from fixes of bugs inherited from PrimeNG and Optimus UI. The issue numbers in the changelog are Optimus UI's.</p>
            <h3>Forms</h3>
            <ul class="leading-relaxed">
                <li>InputText: when <i>[invalid]</i> is bound, it alone decides the invalid style; the automatic <i>ng-invalid ng-dirty</i> border no longer applies on top of it.</li>
                <li>
                    InputNumber: a keystroke that would make the formatted value longer than <i>maxlength</i> is rejected instead of truncating the text. The native <i>min</i>/<i>max</i> attributes are gone; the bounds stay in
                    <i>aria-valuemin</i>/<i>aria-valuemax</i>.
                </li>
                <li>Select: a Select inside a disabled <i>&lt;fieldset&gt;</i> is disabled, except inside the fieldset's first <i>&lt;legend&gt;</i>, as for native controls.</li>
                <li>Select, MultiSelect and CascadeSelect use the SVG spinner of Button as their default loading icon, instead of the <i>pi-spin</i> icon class.</li>
                <li>PickList: moving items sets <i>source</i> and <i>target</i> to new arrays and emits <i>sourceChange</i>/<i>targetChange</i>, so <i>[(source)]</i>/<i>[(target)]</i> bindings follow.</li>
                <li>TreeTable: the selection change can fire once per intermediate step while a checkbox propagates.</li>
                <li>DatePicker: the <i>data-date</i> attribute of day cells uses a 1-based month.</li>
                <li>AutoFocus: the native <i>autofocus</i> attribute is only rendered when autofocus is on; Button and the other components no longer carry it by default.</li>
            </ul>
            <h3>Overlays and menus</h3>
            <ul class="leading-relaxed">
                <li>Overlays are placed against the viewport without its scrollbars, so an overlay at the right edge no longer goes under the vertical scrollbar.</li>
                <li>Tooltip honours the global <i>overlayAppendTo</i> option.</li>
                <li>TieredMenu: with <i>autoDisplay</i>, submenus open on hover from the start, without a first click. A popup TieredMenu gives the focus back to its trigger when an item is picked.</li>
                <li>ContextMenu: showing a context menu closes any other one that is open.</li>
                <li>ConfirmPopup: an <i>accepticon</i>/<i>rejecticon</i> template replaces the <i>acceptIcon</i>/<i>rejectIcon</i> class instead of rendering next to it, as in ConfirmDialog.</li>
            </ul>
            <h3>Accessibility markup</h3>
            <ul class="leading-relaxed">
                <li>Stepper: the <i>tablist</i> role is on <i>p-step-list</i>. Splitter: the <i>separator</i> role is on the focusable gutter handle.</li>
                <li>FocusTrap sentinels are no longer <i>aria-hidden</i>. ConfirmDialog no longer puts a <i>role</i> on the <i>p-dialog</i> host.</li>
                <li>Table announces keyboard column and row moves through the new <i>aria.columnMoved</i> and <i>aria.rowMoved</i> translation keys. A custom <i>aria</i> translation without them falls back to English.</li>
            </ul>
            <h3>Theming and display</h3>
            <ul class="leading-relaxed">
                <li>A token overridden under <i>colorScheme.light</i> wins over the preset's top-level token, as it already did in dark mode. A top-level override passed to <i>definePreset</i>, <i>updatePreset</i> or <i>usePreset</i> still wins.</li>
                <li>MeterGroup: meter widths use the exact percentage; labels keep the rounded value.</li>
                <li>ToggleSwitch has no <i>size</i> input any more: it had no effect.</li>
            </ul>
        </app-docsectiontext>
    `
})
export class V22BehaviorDoc {}
