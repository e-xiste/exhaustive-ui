import type { StyleOptions } from '@exhaustive-ui/styled';
import type { ButtonTokenSections } from '@exhaustive-ui/themes/types/button';

export * from '@exhaustive-ui/themes/types/button';

declare const root: ButtonTokenSections.Root;
declare const colorScheme: ButtonTokenSections.ColorScheme;
declare const css: ButtonTokenSections.CSS;
declare const _default: {
    root: ButtonTokenSections.Root;
    colorScheme: ButtonTokenSections.ColorScheme;
    css: (options: StyleOptions) => string;
};

export { colorScheme, css, _default as default, root };
