import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { findConfigPropertyLeftoversInHtml, findConfigPropertyLeftoversInTypeScript, rewriteConfigPropertyToSignal } from '../../utils/config-signal';
import { SKIP_DIRS } from '../../utils/package-json';

const TARGET = { className: 'Exhaustive', property: 'overlayOptions' } as const;

/**
 * `Exhaustive.overlayOptions` turned from a plain object property into a `signal<OverlayOptions>()`
 * in this version, so that Overlay's option resolution is reactive like the other config signals
 * (`overlayAppendTo`, `ripple`, `unstyled`, ...). Configuration through `setConfig()` /
 * `provideExhaustive()` is unchanged; only direct programmatic access to the property needs updating:
 *
 * - `config.overlayOptions = value` becomes `config.overlayOptions.set(value)`
 * - `config.overlayOptions.x` / `{ ...config.overlayOptions }` become `config.overlayOptions().x` / `{ ...config.overlayOptions() }`
 *
 * Both are rewritten automatically wherever the receiver is provably the `Exhaustive` service in
 * the same file (typed as `Exhaustive`, or initialized with `inject(Exhaustive)`). Accesses on a
 * receiver that only looks like a config object, writes that have no `.set()` equivalent
 * (compound assignments, nested member writes, `delete`), and template bindings that read the
 * property are reported for manual review instead.
 */
export default function (): Rule {
    return (tree: Tree, context: SchematicContext) => {
        let filesChanged = 0;
        let writes = 0;
        let reads = 0;
        const leftovers: string[] = [];

        tree.visit((path) => {
            if (SKIP_DIRS.test(path)) {
                return;
            }
            if (path.endsWith('.html')) {
                const html = tree.read(path)?.toString();
                for (const line of html === undefined ? [] : findConfigPropertyLeftoversInHtml(html, TARGET.property)) {
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
            const result = rewriteConfigPropertyToSignal(path, original, TARGET);
            if (result.changed) {
                tree.overwrite(path, result.text);
                filesChanged++;
                writes += result.writes;
                reads += result.reads;
                context.logger.info(`${path}: rewrote ${result.writes} write(s) and ${result.reads} read(s) of Exhaustive.overlayOptions`);
            }
            for (const line of [...result.leftovers, ...findConfigPropertyLeftoversInTypeScript(path, original, TARGET.property)]) {
                leftovers.push(`${path}:${line}`);
            }
        });

        if (writes + reads > 0) {
            context.logger.info(`Rewrote ${writes} write(s) and ${reads} read(s) of Exhaustive.overlayOptions across ${filesChanged} file(s) — it is a signal now.`);
        } else {
            context.logger.info('No programmatic usages of Exhaustive.overlayOptions were found to rewrite.');
        }

        if (leftovers.length > 0) {
            context.logger.warn(`Found ${leftovers.length} overlayOptions access(es) that need manual review — if the receiver is the Exhaustive config service, write it with .set(value)/.update(fn) and read it with a () call:`);
            for (const leftover of leftovers) {
                context.logger.warn(`  ${leftover}`);
            }
        }

        return tree;
    };
}
