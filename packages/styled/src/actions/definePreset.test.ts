import { describe, expect, it } from 'vitest';
import ThemeUtils from '../utils/themeUtils';
import definePreset from './definePreset';

const defaults = {
    variable: {
        prefix: 'p',
        selector: ':root,:host',
        excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi
    },
    options: { prefix: 'p', darkModeSelector: 'system', cssLayer: false }
};

function lightValue(componentPreset: any, variable: string) {
    const { css } = ThemeUtils.getPreset({ name: 'menubar', preset: componentPreset, options: {}, params: undefined, set: { layerNames: () => {} }, defaults, selector: undefined });
    const lightCss = css.split('@media')[0];
    const matches = [...lightCss.matchAll(new RegExp(`${variable}:([^;}]+)`, 'g'))];

    // The last declaration in the rule wins.
    return matches.at(-1)?.[1];
}

describe('definePreset precedence', () => {
    const base = {
        components: {
            menubar: {
                item: { color: '{navigation.item.color}' },
                submenu: { background: '{content.background}' },
                colorScheme: {
                    light: { submenu: { background: '#ffffff' } },
                    dark: { submenu: { background: '#000000' } }
                }
            }
        }
    };

    it('lets a colorScheme.light override win over a top-level preset token (optimus-ui#1754)', () => {
        const preset: any = definePreset(base as any, { components: { menubar: { colorScheme: { light: { item: { color: 'red' } } } } } } as any);

        expect(lightValue(preset.components.menubar, '--p-menubar-item-color')).toBe('red');
    });

    it('still lets a top-level override win over a colorScheme.light preset token', () => {
        const preset: any = definePreset(base as any, { components: { menubar: { submenu: { background: 'pink' } } } } as any);

        expect(lightValue(preset.components.menubar, '--p-menubar-submenu-background')).toBe('pink');
        expect(preset.components.menubar.colorScheme.dark.submenu.background).toBe('#000000');
    });

    it('keeps colorScheme.light over the top level within a single preset', () => {
        expect(lightValue(base.components.menubar, '--p-menubar-submenu-background')).toBe('#ffffff');
    });
});
