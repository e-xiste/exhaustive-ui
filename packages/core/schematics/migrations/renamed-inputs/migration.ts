import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SKIP_DIRS } from '../../utils/package-json';
import { findLeftoversInTypeScript } from '../../utils/removed-outputs';
import { renameInputsInHtml, renameInputsInTypeScript, SelectorInputRename } from '../../utils/renamed-inputs';

const AUTOCOMPLETE = ['p-autoComplete', 'p-autocomplete', 'p-auto-complete'];
const TREESELECT = ['p-treeSelect', 'p-treeselect', 'p-tree-select'];
const TREETABLE = ['p-treeTable', 'p-treetable', 'p-tree-table'];

/**
 * Deprecated input aliases removed in this version, each replaced by the input (or native
 * attribute) its deprecation notice already pointed to:
 * Drawer's `showCloseIcon` → `closable` (the close button rendered only when both were true, and
 * both default to true); Paginator's `dropdownAppendTo` → `appendTo`; Password's `maxLength` →
 * `maxlength`; AutoComplete's `minLength` → `minQueryLength` (the default minimum stays 1);
 * TreeSelect's `containerStyleClass` → `class` and `containerStyle` → `style`; TreeTable's
 * `virtualRowHeight` → `virtualScrollItemSize`.
 */
export const RENAMED_INPUT_GROUPS: readonly SelectorInputRename[] = [
    { selector: 'p-drawer', renames: [{ from: 'showCloseIcon', to: 'closable' }] },
    { selector: 'p-paginator', renames: [{ from: 'dropdownAppendTo', to: 'appendTo' }] },
    { selector: 'p-password', renames: [{ from: 'maxLength', to: 'maxlength' }] },
    ...AUTOCOMPLETE.map((selector) => ({ selector, renames: [{ from: 'minLength', to: 'minQueryLength' }] })),
    ...TREESELECT.map((selector) => ({
        selector,
        renames: [
            { from: 'containerStyleClass', to: 'class' },
            { from: 'containerStyle', to: 'style' }
        ]
    })),
    ...TREETABLE.map((selector) => ({ selector, renames: [{ from: 'virtualRowHeight', to: 'virtualScrollItemSize' }] }))
];

/**
 * Names searched for in TypeScript code outside templates (e.g. `drawer.showCloseIcon()` on a
 * queried instance), reported for manual review. `maxLength` and `minLength` are left out: they are
 * common DOM/validator property names and would mostly report unrelated code.
 */
const LEFTOVER_SCAN_NAMES = ['showCloseIcon', 'dropdownAppendTo', 'containerStyleClass', 'virtualRowHeight'];

/**
 * Rewrites template bindings of the removed deprecated input aliases listed in
 * {@link RENAMED_INPUT_GROUPS} to their replacement, keeping the binding form (`name="..."`,
 * `[name]="..."`) and value. A tag that already binds the replacement name is left untouched and
 * reported, since only the author can decide how the two values combine (static `class` values
 * are the exception: they are merged into one `class` attribute).
 */
export default function (): Rule {
    return (tree: Tree, context: SchematicContext) => {
        let filesChanged = 0;
        let renamedCount = 0;
        const conflicts: string[] = [];
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
            const result = isHtml ? renameInputsInHtml(original, RENAMED_INPUT_GROUPS) : renameInputsInTypeScript(path, original, RENAMED_INPUT_GROUPS);
            if (result.changed) {
                tree.overwrite(path, result.text);
                filesChanged++;
                renamedCount += result.renamed.length;
                context.logger.info(`${path}: renamed ${result.renamed.join(', ')}`);
            }
            conflicts.push(...result.conflictLines.map((line) => `${path}:${line}`));
            if (!isHtml) {
                leftovers.push(...findLeftoversInTypeScript(path, result.text, LEFTOVER_SCAN_NAMES).map((line) => `${path}:${line}`));
            }
        });

        if (renamedCount > 0) {
            context.logger.info(`Renamed ${renamedCount} deprecated input binding(s) across ${filesChanged} file(s).`);
        } else {
            context.logger.info('No bindings of the removed deprecated input aliases were found to rename.');
        }
        if (conflicts.length > 0) {
            context.logger.warn(`Found ${conflicts.length} tag(s) binding both a removed deprecated input and its replacement — merge them by hand:`);
            for (const conflict of conflicts) {
                context.logger.warn(`  ${conflict}`);
            }
        }
        if (leftovers.length > 0) {
            context.logger.warn(`Found ${leftovers.length} programmatic reference(s) to a removed deprecated input that need manual review:`);
            for (const leftover of leftovers) {
                context.logger.warn(`  ${leftover}`);
            }
        }
        return tree;
    };
}
