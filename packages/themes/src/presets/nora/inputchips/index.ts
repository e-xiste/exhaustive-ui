import type { InputChipsDesignTokens, InputChipsTokenSections } from '@exhaustive-ui/themes/types/inputchips';

export const root: InputChipsTokenSections.Root = {
    background: '{form.field.background}',
    disabledBackground: '{form.field.disabled.background}',
    filledBackground: '{form.field.filled.background}',
    filledHoverBackground: '{form.field.filled.hover.background}',
    filledFocusBackground: '{form.field.filled.focus.background}',
    borderColor: '{form.field.border.color}',
    hoverBorderColor: '{form.field.hover.border.color}',
    focusBorderColor: '{form.field.focus.border.color}',
    invalidBorderColor: '{form.field.invalid.border.color}',
    color: '{form.field.color}',
    disabledColor: '{form.field.disabled.color}',
    placeholderColor: '{form.field.placeholder.color}',
    invalidPlaceholderColor: '{form.field.invalid.placeholder.color}',
    shadow: '{form.field.shadow}',
    paddingX: '{form.field.padding.x}',
    paddingY: '{form.field.padding.y}',
    borderRadius: '{form.field.border.radius}',
    focusRing: {
        width: '{form.field.focus.ring.width}',
        style: '{form.field.focus.ring.style}',
        color: '{form.field.focus.ring.color}',
        offset: '{form.field.focus.ring.offset}',
        shadow: '{form.field.focus.ring.shadow}'
    },
    transitionDuration: '{form.field.transition.duration}'
};

export const chip: InputChipsTokenSections.Chip = {
    borderRadius: '{border.radius.xs}'
};

export const colorScheme: InputChipsTokenSections.ColorScheme = {
    light: {
        chip: {
            focusBackground: '{surface.300}',
            focusColor: '{surface.900}'
        }
    },
    dark: {
        chip: {
            focusBackground: '{surface.600}',
            focusColor: '{surface.0}'
        }
    }
};

export default {
    root,
    chip,
    colorScheme
} satisfies InputChipsDesignTokens;
