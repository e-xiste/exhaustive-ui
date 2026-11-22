import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { findConfigPropertyAccessesInHtml, findConfigPropertyAccessesInTypeScript, renameConfigProperty } from '../../utils/config-signal';
import { SKIP_DIRS } from '../../utils/package-json';

const TARGET = { className: 'Exhaustive', from: 'inputStyle', to: 'inputVariant', configCalls: ['provideExhaustive', 'setConfig'] } as const;

/**
 * The global `inputStyle` option, deprecated since v20 in favor of `inputVariant` (same values,
 * `'outlined' | 'filled'`), is removed in this version:
 *
 * - `provideExhaustive({ inputStyle: 'filled' })` and `config.setConfig({ inputStyle })` become
 *   `inputVariant`;
 * - `config.inputStyle()` / `config.inputStyle.set(v)` on the `Exhaustive` service become
 *   `config.inputVariant()` / `config.inputVariant.set(v)` (both are signals).
 *
 * The receiver rules are those of config-overlay-options-signal: only a receiver provably holding the
 * service is rewritten. Accesses on a receiver that only looks like a config object, template
 * bindings that read it, and config objects that set both names are reported for manual review.
 * The `inputStyle` inputs of AutoComplete, Checkbox, DatePicker, InputNumber and Password (inline
 * style of their inner input) are unrelated and never touched.
 */
export default function (): Rule {
    return (tree: Tree, context: SchematicContext) => {
        let filesChanged = 0;
        let renamed = 0;
        const leftovers: string[] = [];

        tree.visit((path) => {
            if (SKIP_DIRS.test(path)) {
                return;
            }
            if (path.endsWith('.html')) {
                const html = tree.read(path)?.toString();
                for (const line of html === undefined ? [] : findConfigPropertyAccessesInHtml(html, TARGET.from)) {
                    leftovers.push(`${path}:${line}`);
                }
                return;
            }
            if (!(path.endsWith('.ts') || path.endsWith('.mts')) || path.endsWith('.d.ts')) {
                return;
            }
            const original = tree.read(path)?.toString();
            if (original === undefined) {
                return;
            }
            const result = renameConfigProperty(path, original, TARGET);
            if (result.changed) {
                tree.overwrite(path, result.text);
                filesChanged++;
                renamed += result.renamed;
                context.logger.info(`${path}: renamed ${result.renamed} use(s) of the inputStyle option to inputVariant`);
            }
            for (const line of [...result.leftovers, ...findConfigPropertyAccessesInTypeScript(path, original, TARGET.from)]) {
                leftovers.push(`${path}:${line}`);
            }
        });

        if (renamed > 0) {
            context.logger.info(`Renamed ${renamed} use(s) of the global inputStyle option to inputVariant across ${filesChanged} file(s).`);
        } else {
            context.logger.info('No uses of the global inputStyle option were found to rename.');
        }

        if (leftovers.length > 0) {
            context.logger.warn(`Found ${leftovers.length} inputStyle use(s) that need manual review — if they refer to the global configuration, use inputVariant (same values) instead:`);
            for (const leftover of leftovers) {
                context.logger.warn(`  ${leftover}`);
            }
        }

        return tree;
    };
}
