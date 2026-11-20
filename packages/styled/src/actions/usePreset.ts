import Theme from '../config/index';
import { mergePresets } from '../utils/presetUtils';

export default function usePreset<T extends Record<string, unknown>>(...presets: T[]): T {
    const newPreset = mergePresets(...presets);

    Theme.setPreset(newPreset);

    return newPreset as T;
}
