import Theme from '../config/index';
import { mergePresets } from '../utils/presetUtils';

export default function updatePreset<T extends Record<string, unknown>>(...presets: T[]): T {
    const newPreset = mergePresets(Theme.getPreset(), ...presets);

    Theme.setPreset(newPreset);

    return newPreset as T;
}
