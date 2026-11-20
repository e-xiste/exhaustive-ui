import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SKIP_DIRS } from '../../utils/package-json';
import { findLeftoversInTypeScript } from '../../utils/removed-outputs';
import { removeDeadInputsInHtml, removeDeadInputsInTypeScript, SelectorInputRemoval } from '../../utils/removed-inputs';

/**
 * Inputs removed in this version, scoped per-selector: `showTransformOptions`/
 * `hideTransformOptions`/`showTransitionOptions`/`hideTransitionOptions` on Toast/ToastItem had
 * already stopped doing anything once the show/hide animation moved to the shared Motion
 * directive, which does not take transform/transition options through the toast API.
 * `showTransitionOptions`/`hideTransitionOptions` on Message were dead for the same reason: the
 * show/hide animation is driven by `motionOptions`, which has no transition-options equivalent.
 * `showTransitionOptions`/`hideTransitionOptions` on Overlay were stored but never read: its
 * show/hide animation is driven by `motionOptions` too.
 * `showTransitionOptions`/`hideTransitionOptions` on ColorPicker were stored but never read either:
 * its overlay animation is driven by `motionOptions`.
 * The deprecated `size` on OverlayBadge was stored and logged a deprecation warning but never
 * forwarded to the inner badge: only `badgeSize` ever sized it.
 * The deprecated `transitionOptions` on Fieldset, Panel and Accordion was stored but never read: their toggle
 * animation is driven by `motionOptions`.
 * The deprecated `showTransitionOptions`/`hideTransitionOptions` on ScrollTop were stored but never
 * read: its show/hide animation is driven by `motionOptions`.
 * The deprecated `showTransitionOptions`/`hideTransitionOptions` on ConfirmPopup were stored but never
 * read: its overlay animation is driven by `motionOptions`.
 * `inputId` on ToggleButton was stored but never read: the host element is the button itself and
 * there has been no inner input element left to identify.
 * The deprecated `showTransitionOptions`/`hideTransitionOptions` on Popover were stored but never
 * read: its show/hide animation is driven by `motionOptions`. `ariaCloseLabel` on Popover was stored
 * but never read either: the popover renders no close button to label.
 * The deprecated `showTransitionOptions`/`hideTransitionOptions` on Image were stored but never read:
 * its preview animation is driven by `motionOptions`/`maskMotionOptions`. `modalEnterAnimation`/
 * `modalLeaveAnimation` on Image were stored but never read either: the mask motion classes are fixed.
 * The deprecated `transitionOptions` on Drawer was stored but never read: its slide animation is
 * driven by `motionOptions`.
 * The deprecated `showTransitionOptions`/`hideTransitionOptions` on Menu were stored but never read:
 * its popup animation is driven by `motionOptions`.
 * The deprecated `showTransitionOptions`/`hideTransitionOptions` on SplitButton were stored but never
 * read: its menu animation is driven by `motionOptions`. `plain` on SplitButton was stored but never
 * read either: neither the root class nor the inner buttons ever received it. SplitButton's `dir`
 * was never read either, but it is deliberately left out of this list: a `dir`/`[dir]` binding on the
 * selector keeps working as the host element's native `dir` attribute, so there is nothing to remove.
 * The deprecated `showTransitionOptions`/`hideTransitionOptions` on Password were stored but never
 * read: its overlay animation is driven by `motionOptions`.
 * The deprecated `badgeClass` on Button was stored but never read: the inner badge is styled through
 * `badgeSeverity` only.
 * `autoZIndex`/`baseZIndex`/`popup` on ContextMenuSub were stored but never read: the layering of the
 * context menu overlay is handled by the parent ContextMenu, and a context menu sub list is never a popup.
 * The deprecated `showTransitionOptions`/`hideTransitionOptions` on TieredMenu were stored but never
 * read: its popup animation is driven by `motionOptions`.
 * `autoZIndex`/`baseZIndex` on Menubar were only forwarded to MenubarSub, which never read them (the
 * mobile menu layers with the configured `zIndex.menu` directly), and MenubarSub's own `autoZIndex`/
 * `baseZIndex`/`mobileActive`/`ariaLabel`/`ariaLabelledBy` were never read either (Menubar sets the aria
 * attributes on the root list itself and `mobileActive` was only passed down to nested submenus).
 * The deprecated `transitionOptions` and `tabindex` on PanelMenu were only forwarded to its internal lists,
 * which never read them: the toggle animation is driven by `motionOptions` and the sub list host always
 * sets its own `tabindex="-1"`.
 * `disabled`/`queryMatches` on MegaMenuSub were stored but never read: the parent MegaMenu applies the
 * disabled tabindex itself and the mobile classes read MegaMenu's own `queryMatches`.
 * The deprecated `showTransitionOptions`/`hideTransitionOptions` and `containerClass` on Galleria were
 * stored but never read: its animations are driven by `motionOptions`/`maskMotionOptions` and no
 * element ever received the container class.
 * `removeStyleClass` on FileUpload was stored but never read: the file remove buttons are styled through
 * the PassThrough API only.
 * `inputLabel`/`emptyMessage` on CascadeSelect were never read: the hidden input is labelled by `ariaLabel`/`ariaLabelledBy`, and the only consumer of `emptyMessage` was an `emptyMessageText` getter nothing rendered.
 * The deprecated `showTransitionOptions`/`hideTransitionOptions` on DatePicker were stored but never read:
 * its overlay animation is driven by `motionOptions`.
 * The deprecated `transitionOptions` on Dialog only delayed the focus of the first focusable element, which
 * already runs once the enter animation driven by `motionOptions` is over, and `rtl` on Dialog was stored
 * but never read.
 * `closeAriaLabel`, `acceptAriaLabel`, `rejectAriaLabel`, `rtl`, `transitionOptions` and `focusTrap` on
 * ConfirmDialog were stored but never read or forwarded to the inner dialog, and its `defaultFocus` was only
 * read by `getElementToFocus()`, which nothing called.
 */
const REMOVED_INPUT_GROUPS: readonly SelectorInputRemoval[] = [
    { selector: 'p-toast', names: ['showTransformOptions', 'hideTransformOptions', 'showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-toastItem', names: ['showTransformOptions', 'hideTransformOptions', 'showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-message', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-overlay', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-colorPicker', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-colorpicker', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-color-picker', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-overlayBadge', names: ['size'] },
    { selector: 'p-overlay-badge', names: ['size'] },
    { selector: 'p-overlaybadge', names: ['size'] },
    { selector: 'p-fieldset', names: ['transitionOptions'] },
    { selector: 'p-panel', names: ['transitionOptions'] },
    { selector: 'p-accordion', names: ['transitionOptions'] },
    { selector: 'p-scrollTop', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-scrolltop', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-scroll-top', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-confirmpopup', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-togglebutton', names: ['inputId'] },
    { selector: 'p-toggleButton', names: ['inputId'] },
    { selector: 'p-toggle-button', names: ['inputId'] },
    { selector: 'p-popover', names: ['showTransitionOptions', 'hideTransitionOptions', 'ariaCloseLabel'] },
    { selector: 'p-image', names: ['showTransitionOptions', 'hideTransitionOptions', 'modalEnterAnimation', 'modalLeaveAnimation'] },
    { selector: 'p-drawer', names: ['transitionOptions'] },
    { selector: 'p-menu', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-splitbutton', names: ['showTransitionOptions', 'hideTransitionOptions', 'plain'] },
    { selector: 'p-splitButton', names: ['showTransitionOptions', 'hideTransitionOptions', 'plain'] },
    { selector: 'p-split-button', names: ['showTransitionOptions', 'hideTransitionOptions', 'plain'] },
    { selector: 'p-password', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-button', names: ['badgeClass'] },
    { selector: 'p-contextMenuSub', names: ['autoZIndex', 'baseZIndex', 'popup'] },
    { selector: 'p-contextmenu-sub', names: ['autoZIndex', 'baseZIndex', 'popup'] },
    { selector: 'p-tieredMenu', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-tieredmenu', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-tiered-menu', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-menubar', names: ['autoZIndex', 'baseZIndex'] },
    { selector: 'p-menubarSub', names: ['autoZIndex', 'baseZIndex', 'mobileActive', 'ariaLabel', 'ariaLabelledBy'] },
    { selector: 'p-menubarsub', names: ['autoZIndex', 'baseZIndex', 'mobileActive', 'ariaLabel', 'ariaLabelledBy'] },
    { selector: 'p-panelMenu', names: ['transitionOptions', 'tabindex'] },
    { selector: 'p-panelmenu', names: ['transitionOptions', 'tabindex'] },
    { selector: 'p-panel-menu', names: ['transitionOptions', 'tabindex'] },
    { selector: 'p-megaMenuSub', names: ['disabled', 'queryMatches'] },
    { selector: 'p-megamenu-sub', names: ['disabled', 'queryMatches'] },
    { selector: 'p-galleria', names: ['showTransitionOptions', 'hideTransitionOptions', 'containerClass'] },
    { selector: 'p-fileupload', names: ['removeStyleClass'] },
    { selector: 'p-fileUpload', names: ['removeStyleClass'] },
    { selector: 'p-cascadeSelect', names: ['inputLabel', 'emptyMessage'] },
    { selector: 'p-cascadeselect', names: ['inputLabel', 'emptyMessage'] },
    { selector: 'p-cascade-select', names: ['inputLabel', 'emptyMessage'] },
    { selector: 'p-datePicker', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-datepicker', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-date-picker', names: ['showTransitionOptions', 'hideTransitionOptions'] },
    { selector: 'p-dialog', names: ['transitionOptions', 'rtl'] },
    { selector: 'p-confirmDialog', names: ['closeAriaLabel', 'acceptAriaLabel', 'rejectAriaLabel', 'rtl', 'transitionOptions', 'focusTrap', 'defaultFocus'] },
    { selector: 'p-confirmdialog', names: ['closeAriaLabel', 'acceptAriaLabel', 'rejectAriaLabel', 'rtl', 'transitionOptions', 'focusTrap', 'defaultFocus'] },
    { selector: 'p-confirm-dialog', names: ['closeAriaLabel', 'acceptAriaLabel', 'rejectAriaLabel', 'rtl', 'transitionOptions', 'focusTrap', 'defaultFocus'] }
];

/**
 * Removed input names whose programmatic reads/writes are reported for manual review. OverlayBadge's
 * `size` is left out on purpose: a name-only scan cannot tell an OverlayBadge instance's `size` apart
 * from the countless other `size` properties (Map#size, DOM sizes, option objects) in an application.
 * Fieldset's, Panel's, Accordion's and Drawer's `transitionOptions` is left out too: the same input is still alive on
 * other components (p-stepper, ...), so a name-only scan cannot tell their reads apart.
 * ToggleButton's `inputId` is left out for the same reason: every other form component still exposes
 * a working `inputId`. Popover's `ariaCloseLabel` is left out as well: Dialog and Drawer still read it.
 * SplitButton's `plain` is left out too: Button and pButton still expose a working `plain`.
 * ContextMenuSub's `autoZIndex`, `baseZIndex` and `popup` are left out too: ContextMenu itself and every
 * other overlay component still expose them.
 * Menubar's and MenubarSub's `autoZIndex`/`baseZIndex`/`mobileActive`/`ariaLabel`/`ariaLabelledBy` are left
 * out as well: Menu, TieredMenu, ContextMenu and most other components still expose working inputs of
 * the same names.
 * PanelMenu's `tabindex` is left out too: it is a native attribute and an input on many other components.
 * MegaMenuSub's `disabled` and `queryMatches` are left out too: `disabled` is a live input almost
 * everywhere and MegaMenu itself still exposes `queryMatches`.
 * CascadeSelect's `emptyMessage` is left out too: Select, Listbox, Table and other components still read it.
 * ConfirmDialog's `closeAriaLabel`, `focusTrap` and `defaultFocus` are left out too: Dialog still reads
 * `closeAriaLabel` and `focusTrap`, and ConfirmPopup still reads `defaultFocus`.
 */
const LEFTOVER_SCAN_NAMES: readonly string[] = Array.from(new Set(REMOVED_INPUT_GROUPS.flatMap((group) => group.names))).filter(
    (name) =>
        ![
            'size',
            'transitionOptions',
            'inputId',
            'ariaCloseLabel',
            'plain',
            'autoZIndex',
            'baseZIndex',
            'popup',
            'disabled',
            'queryMatches',
            'mobileActive',
            'ariaLabel',
            'ariaLabelledBy',
            'tabindex',
            'emptyMessage',
            'closeAriaLabel',
            'focusTrap',
            'defaultFocus'
        ].includes(name)
);

/**
 * Removes usages of inputs that stopped doing anything before being deleted from
 * @exhaustive-ui/core in this version. The removed inputs are listed per selector in
 * {@link REMOVED_INPUT_GROUPS}; the header comment of this file explains why each of them was dead.
 * @exhaustive-ui/core in this version: Toast/ToastItem's showTransformOptions, hideTransformOptions,
 * showTransitionOptions and hideTransitionOptions, dead since the show/hide animation moved to the
 * shared Motion directive (which has no equivalent transform/transition-options input); and
 * Message's showTransitionOptions/hideTransitionOptions, dead for the same reason; Overlay's
 * showTransitionOptions/hideTransitionOptions, stored but never read; ColorPicker's
 * showTransitionOptions/hideTransitionOptions, stored but never read either; OverlayBadge's
 * deprecated size, never forwarded to the inner badge (badgeSize is the input that sizes it);
 * Fieldset's, Panel's and Accordion's deprecated transitionOptions, stored but never read (motionOptions drives the toggle animation);
 * ScrollTop's deprecated showTransitionOptions/hideTransitionOptions, stored but never read
 * (motionOptions drives the show/hide animation); ToggleButton's inputId, stored but never read
 * since the host element became the button itself; and Popover's deprecated
 * showTransitionOptions/hideTransitionOptions (motionOptions drives the show/hide animation) and
 * ariaCloseLabel, stored but never read since the popover renders no close button; Image's deprecated
 * showTransitionOptions/hideTransitionOptions (motionOptions drives the preview animation) and
 * modalEnterAnimation/modalLeaveAnimation, stored but never read since the mask motion classes are fixed;
 * Drawer's deprecated transitionOptions, stored but never read (motionOptions drives the slide
 * animation); Password's deprecated showTransitionOptions/hideTransitionOptions, stored but never
 * read (motionOptions drives the overlay animation); Button's deprecated badgeClass, stored but
 * never read (badgeSeverity styles the inner badge); ContextMenuSub's autoZIndex/baseZIndex/popup,
 * stored but never read (the parent ContextMenu handles layering); TieredMenu's deprecated
 * showTransitionOptions/hideTransitionOptions (motionOptions drives the popup animation);
 * Menubar's autoZIndex/baseZIndex plus MenubarSub's autoZIndex/baseZIndex/mobileActive/ariaLabel/
 * ariaLabelledBy, never read (the mobile menu layers with zIndex.menu); PanelMenu's transitionOptions
 * and tabindex, forwarded to internal lists that never read them; MegaMenuSub's disabled and
 * queryMatches, never read (MegaMenu handles both itself); Galleria's deprecated
 * showTransitionOptions/hideTransitionOptions plus its never-applied containerClass; FileUpload's
 * removeStyleClass, never read (the remove buttons are styled through PassThrough); CascadeSelect's
 * inputLabel and emptyMessage, never read; DatePicker's deprecated
 * showTransitionOptions/hideTransitionOptions (motionOptions drives the overlay animation); Dialog's deprecated transitionOptions and never-read rtl; and ConfirmDialog's closeAriaLabel,
 * acceptAriaLabel, rejectAriaLabel, rtl, transitionOptions, focusTrap and defaultFocus, never read.
 *
 * `name="..."`/`[name]="..."` template bindings on those selectors are removed automatically —
 * safe to delete outright, since the values they passed were already unused.
 * Programmatic reads/writes of the same property name elsewhere (e.g. on a `@ViewChild`-queried
 * instance) are reported for manual review instead of being rewritten automatically.
 */
export default function (): Rule {
    return (tree: Tree, context: SchematicContext) => {
        let filesChanged = 0;
        let attrsRemoved = 0;
        const leftovers: string[] = [];

        tree.visit((path) => {
            if (SKIP_DIRS.test(path)) {
                return;
            }
            if (path.endsWith('.html')) {
                const original = tree.read(path)?.toString();
                if (original === undefined) {
                    return;
                }
                const result = removeDeadInputsInHtml(original, REMOVED_INPUT_GROUPS);
                if (result.changed) {
                    tree.overwrite(path, result.text);
                    filesChanged++;
                    attrsRemoved += result.removed.length;
                    context.logger.info(`${path}: removed ${result.removed.join(', ')} binding(s)`);
                }
            } else if (path.endsWith('.ts') || path.endsWith('.mts')) {
                const original = tree.read(path)?.toString();
                if (original === undefined) {
                    return;
                }
                const result = removeDeadInputsInTypeScript(path, original, REMOVED_INPUT_GROUPS);
                let text = original;
                if (result.changed) {
                    text = result.text;
                    tree.overwrite(path, text);
                    filesChanged++;
                    attrsRemoved += result.removed.length;
                    context.logger.info(`${path}: removed ${result.removed.join(', ')} binding(s) from inline template`);
                }
                const lines = findLeftoversInTypeScript(path, text, LEFTOVER_SCAN_NAMES);
                for (const line of lines) {
                    leftovers.push(`${path}:${line}`);
                }
            }
        });

        if (attrsRemoved > 0) {
            context.logger.info(`Removed ${attrsRemoved} dead input template binding(s) across ${filesChanged} file(s) — they had already stopped doing anything.`);
        } else {
            context.logger.info('No bindings for the removed inputs were found to remove.');
        }

        if (leftovers.length > 0) {
            context.logger.warn(
                `Found ${leftovers.length} reference(s) to the removed showTransformOptions/hideTransformOptions/showTransitionOptions/hideTransitionOptions inputs that need manual review — these had already stopped doing anything and can likely be deleted:`
            );
            for (const leftover of leftovers) {
                context.logger.warn(`  ${leftover}`);
            }
        }

        return tree;
    };
}
