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
    borderRadius: '{border.radius.sm}'
};

export const colorScheme: InputChipsTokenSections.ColorScheme = {
    light: {
        chip: {
            focusBackground: '{surface.300}',
            focusColor: '{surface.950}'
        }
    },
    dark: {
        chip: {
            focusBackground: '{surface.600}',
            focusColor: '{surface.0}'
        }
    }
};

export const css: InputChipsTokenSections.CSS = /*css*/ `
.p-inputchips-input.p-variant-filled {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border: 1px solid transparent;
    background: dt('inputchips.filled.background') no-repeat;
    background-image: linear-gradient(to bottom, dt('inputchips.focus.border.color'), dt('inputchips.focus.border.color')), linear-gradient(to bottom, dt('inputchips.border.color'), dt('inputchips.border.color'));
    background-size: 0 2px, 100% 1px;
    background-position: 50% 100%, 50% 100%;
    background-origin: border-box;
    transition: background-size 0.3s cubic-bezier(0.64, 0.09, 0.08, 1);
}

.p-inputchips:not(.p-disabled):hover .p-inputchips-input.p-variant-filled {
    background: dt('inputchips.filled.hover.background') no-repeat;
    background-image: linear-gradient(to bottom, dt('inputchips.focus.border.color'), dt('inputchips.focus.border.color')), linear-gradient(to bottom, dt('inputchips.hover.border.color'), dt('inputchips.hover.border.color'));
    background-size: 0 2px, 100% 1px;
    background-position: 50% 100%, 50% 100%;
    background-origin: border-box;
    border-color: transparent;
}

.p-inputchips:not(.p-disabled).p-focus .p-inputchips-input.p-variant-filled {
    outline: 0 none;
    background: dt('inputchips.filled.focus.background') no-repeat;
    background-image: linear-gradient(to bottom, dt('inputchips.focus.border.color'), dt('inputchips.focus.border.color')), linear-gradient(to bottom, dt('inputchips.border.color'), dt('inputchips.border.color'));
    background-size: 100% 2px, 100% 1px;
    background-position: 50% 100%, 50% 100%;
    background-origin: border-box;
    border-color: transparent;
}

.p-inputchips.p-invalid .p-inputchips-input.p-variant-filled {
    background-image: linear-gradient(to bottom, dt('inputchips.invalid.border.color'), dt('inputchips.invalid.border.color')), linear-gradient(to bottom, dt('inputchips.invalid.border.color'), dt('inputchips.invalid.border.color'));
}
`;

export default {
    root,
    chip,
    colorScheme,
    css
} satisfies InputChipsDesignTokens;
