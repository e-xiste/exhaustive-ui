import type { StyleOptions } from '@exhaustive-ui/styled';
import type { RatingTokenSections } from '@exhaustive-ui/themes/types/rating';

export * from '@exhaustive-ui/themes/types/rating';

declare const root: RatingTokenSections.Root;
declare const icon: RatingTokenSections.Icon;
declare const css: RatingTokenSections.CSS;
declare const _default: {
    root: RatingTokenSections.Root;
    icon: RatingTokenSections.Icon;
    css: (options: StyleOptions) => string;
};

export { css, _default as default, icon, root };
