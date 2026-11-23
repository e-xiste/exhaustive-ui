import type { MentionDesignTokens, MentionTokenSections } from '@exhaustive-ui/themes/types/mention';

export const root: MentionTokenSections.Root = {
    transitionDuration: '{form.field.transition.duration}'
};

export const overlay: MentionTokenSections.Overlay = {
    background: '{overlay.select.background}',
    borderColor: '{overlay.select.border.color}',
    borderRadius: '{overlay.select.border.radius}',
    color: '{overlay.select.color}',
    shadow: '{overlay.select.shadow}',
    width: '16rem'
};

export const list: MentionTokenSections.List = {
    padding: '{list.padding}',
    gap: '{list.gap}'
};

export const option: MentionTokenSections.Option = {
    focusBackground: '{list.option.focus.background}',
    color: '{list.option.color}',
    focusColor: '{list.option.focus.color}',
    padding: '{list.option.padding}',
    borderRadius: '{list.option.border.radius}',
    gap: '0.5rem'
};

export const emptyMessage: MentionTokenSections.EmptyMessage = {
    padding: '{list.option.padding}'
};

export const colorScheme: MentionTokenSections.ColorScheme = {
    light: {
        emptyMessage: {
            color: '{surface.600}'
        }
    },
    dark: {
        emptyMessage: {
            color: '{surface.400}'
        }
    }
};

export default {
    root,
    overlay,
    list,
    option,
    emptyMessage,
    colorScheme
} satisfies MentionDesignTokens;
