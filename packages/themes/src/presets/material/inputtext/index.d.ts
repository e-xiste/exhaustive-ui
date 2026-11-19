import type { StyleOptions } from '@exhaustive-ui/styled';
import type { InputTextTokenSections } from '@exhaustive-ui/themes/types/inputtext';

export * from '@exhaustive-ui/themes/types/inputtext';

declare const root: InputTextTokenSections.Root;
declare const css: InputTextTokenSections.CSS;
declare const _default: {
    root: InputTextTokenSections.Root;
    css: (options: StyleOptions) => string;
};

export { css, _default as default, root };
