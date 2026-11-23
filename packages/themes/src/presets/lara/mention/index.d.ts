import type { MentionTokenSections } from '@exhaustive-ui/themes/types/mention';

export * from '@exhaustive-ui/themes/types/mention';

declare const root: MentionTokenSections.Root;
declare const overlay: MentionTokenSections.Overlay;
declare const list: MentionTokenSections.List;
declare const option: MentionTokenSections.Option;
declare const emptyMessage: MentionTokenSections.EmptyMessage;
declare const colorScheme: MentionTokenSections.ColorScheme;
declare const _default: {
    root: MentionTokenSections.Root;
    overlay: MentionTokenSections.Overlay;
    list: MentionTokenSections.List;
    option: MentionTokenSections.Option;
    emptyMessage: MentionTokenSections.EmptyMessage;
    colorScheme: MentionTokenSections.ColorScheme;
};

export { colorScheme, emptyMessage, list, option, overlay, root, _default as default };
