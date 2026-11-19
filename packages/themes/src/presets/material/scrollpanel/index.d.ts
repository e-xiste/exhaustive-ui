import type { ScrollPanelTokenSections } from '@exhaustive-ui/themes/types/scrollpanel';

export * from '@exhaustive-ui/themes/types/scrollpanel';

declare const root: ScrollPanelTokenSections.Root;
declare const bar: ScrollPanelTokenSections.Bar;
declare const colorScheme: ScrollPanelTokenSections.ColorScheme;
declare const css: ScrollPanelTokenSections.CSS;
declare const _default: {
    root: ScrollPanelTokenSections.Root;
    bar: ScrollPanelTokenSections.Bar;
    colorScheme: ScrollPanelTokenSections.ColorScheme;
    css: string;
};

export { bar, colorScheme, css, _default as default, root };
