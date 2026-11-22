import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SKIP_DIRS } from '../../utils/package-json';
import { renameTemplatesInHtml, renameTemplatesInTypeScript, SelectorTemplateRename } from '../../utils/renamed-templates';

/**
 * Templates removed in this version in favor of the name their deprecation pointed to. MultiSelect's
 * `removetokenicon` → `chipicon`: both received the same `{ class }` context and rendered the same
 * chip remove icon (chipicon won when both were given).
 */
export const RENAMED_TEMPLATE_GROUPS: readonly SelectorTemplateRename[] = ['p-multiSelect', 'p-multiselect', 'p-multi-select'].map((selector) => ({ selector, renames: [{ from: 'removetokenicon', to: 'chipicon' }] }));

/**
 * Renames the templates listed in {@link RENAMED_TEMPLATE_GROUPS} inside the matching elements:
 * `<ng-template #removetokenicon>` and `<ng-template pTemplate="removetokenicon">` become
 * `#chipicon` / `pTemplate="chipicon"`. An element that already projects a `chipicon` template is
 * reported instead: the removed one was never rendered there, delete it by hand.
 */
export default function (): Rule {
    return (tree: Tree, context: SchematicContext) => {
        let filesChanged = 0;
        let renamedCount = 0;
        const conflicts: string[] = [];

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
            const result = isHtml ? renameTemplatesInHtml(original, RENAMED_TEMPLATE_GROUPS) : renameTemplatesInTypeScript(path, original, RENAMED_TEMPLATE_GROUPS);
            if (result.changed) {
                tree.overwrite(path, result.text);
                filesChanged++;
                renamedCount += result.renamed.length;
                context.logger.info(`${path}: renamed ${result.renamed.join(', ')} template(s)`);
            }
            conflicts.push(...result.conflictLines.map((line) => `${path}:${line}`));
        });

        if (renamedCount > 0) {
            context.logger.info(`Renamed ${renamedCount} template(s) across ${filesChanged} file(s).`);
        } else {
            context.logger.info('No removed templates were found to rename.');
        }
        if (conflicts.length > 0) {
            context.logger.warn(`Found ${conflicts.length} p-multiselect element(s) projecting both a removetokenicon and a chipicon template — only chipicon was rendered, delete the removetokenicon one:`);
            for (const conflict of conflicts) {
                context.logger.warn(`  ${conflict}`);
            }
        }
        return tree;
    };
}
