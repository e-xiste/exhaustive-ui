import { Rule } from '@angular-devkit/schematics';
import { PRIMENG_SOURCE } from '../utils/mappings';
import { migrateWorkspace } from '../utils/migrate-workspace';
import { Schema } from './schema';

/**
 * Migrates a PrimeNG v21 workspace to ExhaustiveUI. The v22 `ng update` migrations then run with
 * `ng update @exhaustive-ui/core --migrate-only --from=3.0.0`.
 */
export function migrateFromPrimeng(options: Schema): Rule {
    return migrateWorkspace(
        {
            source: PRIMENG_SOURCE,
            packageName: 'primeng',
            minMajor: 21,
            tooOldMessage: (major) => `Found primeng v${major}. ExhaustiveUI is API-compatible with primeng v21 — upgrade first (ng update primeng@21), then re-run this migration. Use --force to skip this check.`,
            leftoverPattern: /primeng|primeicons|@primeuix|tailwindcss-primeui|primelocale/i,
            leftoverLabel: 'primeng/primeicons/@primeuix/tailwindcss-primeui/primelocale',
            guideUrl: 'https://exhaustive-ui.com/migration/primeng'
        },
        options
    );
}
