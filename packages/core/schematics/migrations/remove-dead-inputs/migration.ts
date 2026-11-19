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
 * `inputId` on ToggleButton was stored but never read: the host element is the button itself and
 * there has been no inner input element left to identify.
 * The deprecated `showTransitionOptions`/`hideTransitionOptions` on Popover were stored but never
 * read: its show/hide animation is driven by `motionOptions`. `ariaCloseLabel` on Popover was stored
 * but never read either: the popover renders no close button to label.
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
    { selector: 'p-togglebutton', names: ['inputId'] },
    { selector: 'p-toggleButton', names: ['inputId'] },
    { selector: 'p-toggle-button', names: ['inputId'] },
    { selector: 'p-popover', names: ['showTransitionOptions', 'hideTransitionOptions', 'ariaCloseLabel'] }
];

/**
 * Removed input names whose programmatic reads/writes are reported for manual review. OverlayBadge's
 * `size` is left out on purpose: a name-only scan cannot tell an OverlayBadge instance's `size` apart
 * from the countless other `size` properties (Map#size, DOM sizes, option objects) in an application.
 * Fieldset's, Panel's and Accordion's `transitionOptions` is left out too: the same input is still alive on other
 * components (p-dialog, p-drawer, ...), so a name-only scan cannot tell their reads apart.
 * ToggleButton's `inputId` is left out for the same reason: every other form component still exposes
 * a working `inputId`. Popover's `ariaCloseLabel` is left out as well: Dialog and Drawer still read it.
 */
const LEFTOVER_SCAN_NAMES: readonly string[] = Array.from(new Set(REMOVED_INPUT_GROUPS.flatMap((group) => group.names))).filter((name) => name !== 'size' && name !== 'transitionOptions' && name !== 'inputId' && name !== 'ariaCloseLabel');

/**
 * Removes usages of inputs that stopped doing anything before being deleted from
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
 * ariaCloseLabel, stored but never read since the popover renders no close button.
 *
 * `name="..."`/`[name]="..."` template bindings on `p-toast`/`p-toastItem`/`p-message`/`p-overlay`/
 * `p-colorPicker`/`p-colorpicker`/`p-color-picker`/`p-overlayBadge`/`p-overlay-badge`/`p-overlaybadge`/`p-fieldset`/`p-panel`/`p-accordion`/
 * `p-scrollTop`/`p-scrolltop`/`p-scroll-top`/`p-togglebutton`/`p-toggleButton`/`p-toggle-button` are removed
 * `p-colorPicker`/`p-colorpicker`/`p-color-picker`/`p-overlayBadge`/`p-overlay-badge`/`p-overlaybadge`/`p-fieldset`/`p-panel`/
 * `p-scrollTop`/`p-scrolltop`/`p-scroll-top`/`p-togglebutton`/`p-toggleButton`/`p-toggle-button`/`p-popover` are removed
 * automatically — safe to delete outright, since the values they passed were already unused.
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
