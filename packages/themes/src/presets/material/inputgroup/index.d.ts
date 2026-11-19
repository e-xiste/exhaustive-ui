import type { StyleOptions } from '@exhaustive-ui/styled';
import type { InputGroupTokenSections } from '@exhaustive-ui/themes/types/inputgroup';

export * from '@exhaustive-ui/themes/types/inputgroup';

declare const addon: InputGroupTokenSections.Addon;
declare const css: InputGroupTokenSections.CSS;
declare const _default: {
    addon: InputGroupTokenSections.Addon;
    css: (options: StyleOptions) => string;
};

export { addon, css, _default as default };
