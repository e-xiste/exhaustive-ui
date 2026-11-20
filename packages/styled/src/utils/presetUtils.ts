import { deepMerge, isObject } from '@exhaustive-ui/utils/object';

type Preset = Record<string, any>;

const NON_TOKEN_KEYS = ['colorScheme', 'extend', 'css'];

function getLeafPaths(value: Preset, prefix: string[] = []): string[][] {
    return Object.entries(value).flatMap(([key, v]) => (isObject(v) ? getLeafPaths(v, [...prefix, key]) : [[...prefix, key]]));
}

function hasPath(value: any, path: string[]): boolean {
    return path.reduce((acc, key) => (isObject(acc) && key in acc ? acc[key] : undefined), value) !== undefined;
}

function omitPath(value: any, [key, ...rest]: string[]): any {
    if (!isObject(value) || !(key in value)) return value;

    const { [key]: child, ...others } = value as Preset;

    if (rest.length === 0) return others;

    const omitted = omitPath(child, rest);

    return isObject(omitted) && Object.keys(omitted).length === 0 ? others : { ...others, [key]: omitted };
}

/**
 * A token set at the top level of a later preset overrides the same token in the `colorScheme.light`
 * of an earlier one: drop it from there, since `colorScheme.light` takes precedence over the top level
 * within a single preset.
 */
function dropOverriddenLightTokens(target: any, source: any): any {
    if (!isObject(target) || !isObject(source)) return target;

    const result: Preset = { ...target };

    Object.keys(source).forEach((key) => {
        if (key !== 'colorScheme' && isObject(result[key]) && isObject((source as Preset)[key])) {
            result[key] = dropOverriddenLightTokens(result[key], (source as Preset)[key]);
        }
    });

    const light = result.colorScheme?.light;

    if (isObject(light)) {
        const paths = Object.keys(source)
            .filter((key) => !NON_TOKEN_KEYS.includes(key))
            .flatMap((key) => (isObject((source as Preset)[key]) ? getLeafPaths((source as Preset)[key], [key]) : [[key]]));
        const sourceLight = (source as Preset).colorScheme?.light;
        const newLight = paths.reduce((acc, path) => (hasPath(sourceLight, path) ? acc : omitPath(acc, path)), light);

        result.colorScheme = { ...result.colorScheme, light: newLight };
    }

    return result;
}

export function mergePresets(...presets: Preset[]): Preset {
    return presets.reduce((acc, preset, i) => (i === 0 ? preset : deepMerge(dropOverriddenLightTokens(acc, preset), preset)), {});
}
