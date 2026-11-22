import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { SKIP_DIRS } from '../../utils/package-json';
import { applyExportChangesToTypeScript, ExportChanges, replaceElementsInHtml } from '../../utils/removed-exports';

/**
 * Public API exports changed in this version:
 * - `Password_VALUE_ACCESSOR` is renamed `PASSWORD_VALUE_ACCESSOR`, like every other value accessor;
 * - the `InplaceDisplay`/`InplaceContent` components are removed: Inplace projects the
 *   `[pInplaceDisplay]`/`[pInplaceContent]` attributes, and the `<p-inplacedisplay>`/
 *   `<p-inplacecontent>` elements were empty wrappers. In templates they become a `<span>` (an
 *   unknown element is inline too, so the layout is unchanged), and they are dropped from imports;
 * - rendering internals are no longer exported from their entry point: the `SelectItem` option
 *   component of Select (the `SelectItem` interface of `@exhaustive-ui/core/api` is unaffected),
 *   Menu's `SafeHtmlPipe`, RadioButton's `RadioControlRegistry` and Menubar's `MenubarService`.
 *   Password's unused `MapperPipe` is removed. Their imports are reported.
 */
export const EXPORT_CHANGES: ExportChanges = {
    renamed: { '@exhaustive-ui/core/password': { Password_VALUE_ACCESSOR: 'PASSWORD_VALUE_ACCESSOR' } },
    dropped: { '@exhaustive-ui/core/inplace': ['InplaceDisplay', 'InplaceContent'] },
    unexported: {
        '@exhaustive-ui/core/select': ['SelectItem'],
        '@exhaustive-ui/core/menu': ['SafeHtmlPipe'],
        '@exhaustive-ui/core/password': ['MapperPipe'],
        '@exhaustive-ui/core/radiobutton': ['RadioControlRegistry'],
        '@exhaustive-ui/core/menubar': ['MenubarService']
    },
    elements: { 'p-inplacedisplay': 'span', 'p-inplaceDisplay': 'span', 'p-inplacecontent': 'span', 'p-inplaceContent': 'span' }
};

export default function (): Rule {
    return (tree: Tree, context: SchematicContext) => {
        let filesChanged = 0;
        const leftovers: string[] = [];

        tree.visit((path) => {
            if (SKIP_DIRS.test(path)) {
                return;
            }
            const isHtml = path.endsWith('.html');
            if (!isHtml && !((path.endsWith('.ts') || path.endsWith('.mts')) && !path.endsWith('.d.ts'))) {
                return;
            }
            const original = tree.read(path)?.toString();
            if (original === undefined) {
                return;
            }
            if (isHtml) {
                const result = replaceElementsInHtml(original, EXPORT_CHANGES.elements);
                if (result.replaced.length > 0) {
                    tree.overwrite(path, result.text);
                    filesChanged++;
                    context.logger.info(`${path}: ${result.replaced.join(', ')}`);
                }
                return;
            }
            const result = applyExportChangesToTypeScript(path, original, EXPORT_CHANGES);
            if (result.changed) {
                tree.overwrite(path, result.text);
                filesChanged++;
                context.logger.info(`${path}: ${result.applied.join(', ')}`);
            }
            leftovers.push(...result.leftovers.map((line) => `${path}:${line}`));
        });

        context.logger.info(filesChanged > 0 ? `Updated ${filesChanged} file(s) for the renamed and removed exports.` : 'No uses of the renamed or removed exports were found.');
        if (leftovers.length > 0) {
            context.logger.warn(
                `Found ${leftovers.length} import(s) of SelectItem (the Select option component), SafeHtmlPipe, MapperPipe, RadioControlRegistry or MenubarService, which are no longer exported — they were rendering internals, remove them or use your own:`
            );
            for (const leftover of leftovers) {
                context.logger.warn(`  ${leftover}`);
            }
        }
        return tree;
    };
}
