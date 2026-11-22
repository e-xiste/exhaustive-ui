import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SKIP_DIRS } from '../../utils/package-json';
import { findLeftoversInTypeScript } from '../../utils/removed-outputs';
import { findTwoWayBindings, findTwoWayBindingsInTypeScript, renameOutputsInHtml, renameOutputsInTypeScript, SelectorOutputRename } from '../../utils/renamed-outputs';

const ORDERLIST = ['p-orderList', 'p-orderlist', 'p-order-list'];
const MULTISELECT = ['p-multiSelect', 'p-multiselect', 'p-multi-select'];

/**
 * Outputs renamed in this version to the name the other components already use. The payloads are
 * unchanged, so `$event` keeps the same shape:
 * OrderList's `onFilterEvent` → `onFilter` (still an `OrderListFilterEvent`), Table's
 * `selectAllChange` → `onSelectAllChange` (still `{ originalEvent, checked }`, as on Listbox and
 * MultiSelect), MultiSelect's `onPanelShow`/`onPanelHide` → `onShow`/`onHide` (still the overlay's
 * animation event, the payload Select's `onShow`/`onHide` emit too).
 */
export const RENAMED_OUTPUT_GROUPS: readonly SelectorOutputRename[] = [
    ...ORDERLIST.map((selector) => ({ selector, renames: [{ from: 'onFilterEvent', to: 'onFilter' }] })),
    { selector: 'p-table', renames: [{ from: 'selectAllChange', to: 'onSelectAllChange' }] },
    ...MULTISELECT.map((selector) => ({
        selector,
        renames: [
            { from: 'onPanelShow', to: 'onShow' },
            { from: 'onPanelHide', to: 'onHide' }
        ]
    }))
];

/** Names searched for in TypeScript code outside templates (e.g. `multiSelect.onPanelShow.subscribe(...)`), reported for manual review. */
const LEFTOVER_SCAN_NAMES = ['onFilterEvent', 'selectAllChange', 'onPanelShow', 'onPanelHide'];

/**
 * Rewrites `(old)="..."` event bindings of the outputs listed in {@link RENAMED_OUTPUT_GROUPS} to
 * their new name, keeping the handler expression. A `[(selectAll)]` two-way binding on p-table
 * relied on the old `selectAllChange` name; it is reported for manual review, since the event
 * carries `{ originalEvent, checked }` rather than a boolean and the two-way form never assigned the
 * right value: bind `[selectAll]` and `(onSelectAllChange)="selectAll = $event.checked"` instead.
 */
export default function (): Rule {
    return (tree: Tree, context: SchematicContext) => {
        let filesChanged = 0;
        let renamedCount = 0;
        const twoWay: string[] = [];
        const leftovers: string[] = [];

        tree.visit((path) => {
            if (SKIP_DIRS.test(path)) {
                return;
            }
            const isHtml = path.endsWith('.html');
            if (!isHtml && !path.endsWith('.ts') && !path.endsWith('.mts')) {
                return;
            }
            const original = tree.read(path)?.toString();
            if (original === undefined) {
                return;
            }
            const result = isHtml ? renameOutputsInHtml(original, RENAMED_OUTPUT_GROUPS) : renameOutputsInTypeScript(path, original, RENAMED_OUTPUT_GROUPS);
            if (result.changed) {
                tree.overwrite(path, result.text);
                filesChanged++;
                renamedCount += result.renamed.length;
                context.logger.info(`${path}: renamed ${result.renamed.join(', ')}`);
            }
            const twoWayLines = isHtml ? findTwoWayBindings(result.text, 'p-table', 'selectAll') : findTwoWayBindingsInTypeScript(path, result.text, 'p-table', 'selectAll');
            twoWay.push(...twoWayLines.map((line) => `${path}:${line}`));
            if (!isHtml) {
                leftovers.push(...findLeftoversInTypeScript(path, result.text, LEFTOVER_SCAN_NAMES).map((line) => `${path}:${line}`));
            }
        });

        if (renamedCount > 0) {
            context.logger.info(`Renamed ${renamedCount} output binding(s) across ${filesChanged} file(s).`);
        } else {
            context.logger.info('No bindings of the renamed outputs were found to rename.');
        }
        if (twoWay.length > 0) {
            context.logger.warn(`Found ${twoWay.length} p-table [(selectAll)] binding(s): the change event is now onSelectAllChange and carries { originalEvent, checked }, so bind [selectAll]="x" (onSelectAllChange)="x = $event.checked" instead:`);
            for (const entry of twoWay) {
                context.logger.warn(`  ${entry}`);
            }
        }
        if (leftovers.length > 0) {
            context.logger.warn(`Found ${leftovers.length} programmatic reference(s) to a renamed output (onFilterEvent → onFilter, selectAllChange → onSelectAllChange, onPanelShow/onPanelHide → onShow/onHide) that need manual review:`);
            for (const leftover of leftovers) {
                context.logger.warn(`  ${leftover}`);
            }
        }
        return tree;
    };
}
