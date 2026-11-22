import { Rule } from '@angular-devkit/schematics';
import { OPTIMUS_SOURCE } from '../utils/mappings';
import { migrateWorkspace } from '../utils/migrate-workspace';
import { Schema } from './schema';

/**
 * Migrates an Optimus UI v2 workspace to ExhaustiveUI: the @openng/optimus-ui* packages, their
 * imports, the configuration API (provideOptimus, Optimus, OptimusConfigType, OPTIMUS_CONFIG) and the
 * `optimus` CSS layer. @openng/icons is shared and stays. The v22 `ng update` migrations then run
 * with `ng update @exhaustive-ui/core --migrate-only --from=3.0.0`.
 */
export function migrateFromOptimus(options: Schema): Rule {
    return migrateWorkspace(
        {
            source: OPTIMUS_SOURCE,
            packageName: '@openng/optimus-ui',
            minMajor: 2,
            tooOldMessage: (major) => `Found @openng/optimus-ui v${major}. This migration starts from Optimus UI v2 on Angular 22 — update Optimus UI first, then re-run it. Use --force to skip this check.`,
            leftoverPattern: /optimus-ui|\b(provideOptimus|Optimus|OptimusConfigType|OPTIMUS_CONFIG)\b/,
            leftoverLabel: '@openng/optimus-ui/Optimus',
            guideUrl: 'https://exhaustive-ui.com/migration/optimus'
        },
        options
    );
}
