import { describe, expect, it } from 'vitest';
import { REMOVED_INPUT_GROUPS } from '../../core/schematics/migrations/remove-dead-inputs/migration';
import { REMOVED_OUTPUT_GROUPS } from '../../core/schematics/migrations/remove-dead-outputs/migration';
import { RENAMED_INPUT_GROUPS } from '../../core/schematics/migrations/renamed-inputs/migration';
import { MIGRATED_SELECTORS } from '../../core/schematics/migrations/styleclass-to-class/migration';
import { DEAD_INPUTS, DEAD_OUTPUTS, RENAMED, STYLE_CLASS_REMOVED } from '../src/v22';

const key = (selector: string) => selector.toLowerCase().replace(/^p-/, '').replace(/-/g, '');

/** The validator hints must stay in step with the ng update migrations shipped in @exhaustive-ui/core. */
describe('v22 data matches the ng update migrations', () => {
    it('styleClass removals', () => {
        expect([...STYLE_CLASS_REMOVED].sort()).toEqual([...new Set(MIGRATED_SELECTORS.map(key))].sort());
    });

    it('renamed inputs', () => {
        const fromMigrations: Record<string, Record<string, string>> = {};

        for (const group of RENAMED_INPUT_GROUPS) {
            for (const { from, to } of group.renames) {
                (fromMigrations[key(group.selector)] ??= {})[from.toLowerCase()] = to;
            }
        }

        // maxLength → maxlength only changes case: the validator compares names case-insensitively already.
        delete fromMigrations.password;
        expect(RENAMED).toEqual(fromMigrations);
    });

    it('dead inputs', () => {
        const fromMigrations: Record<string, string[]> = {};

        for (const group of REMOVED_INPUT_GROUPS) {
            const names = (fromMigrations[key(group.selector)] ??= []);

            for (const name of group.names) {
                if (!names.includes(name)) {
                    names.push(name);
                }
            }
        }

        expect(DEAD_INPUTS).toEqual(fromMigrations);
    });

    it('dead outputs', () => {
        expect(Object.values(DEAD_OUTPUTS).flat().sort()).toEqual(REMOVED_OUTPUT_GROUPS.flatMap((group) => [...group.names]).sort());
    });
});
