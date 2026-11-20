import { mergePresets } from '../utils/presetUtils';

export default function definePreset<T extends Record<string, unknown>>(...presets: T[]): T {
    return mergePresets(...presets) as T;
}
