import type { FileInputDesignTokens, FileInputTokenSections } from '@exhaustive-ui/themes/types/fileinput';

export const root: FileInputTokenSections.Root = {
    gap: '0.75rem',
    transitionDuration: '{form.field.transition.duration}'
};

export const dropzone: FileInputTokenSections.Dropzone = {
    background: '{form.field.background}',
    borderColor: '{form.field.border.color}',
    hoverBorderColor: '{form.field.hover.border.color}',
    activeBorderColor: '{primary.color}',
    color: '{form.field.color}',
    invalidBorderColor: '{form.field.invalid.border.color}',
    disabledBackground: '{form.field.disabled.background}',
    disabledColor: '{form.field.disabled.color}',
    borderRadius: '{form.field.border.radius}',
    padding: '1.75rem 1.25rem',
    gap: '0.5rem',
    fontWeight: '600',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    },
    sm: {
        padding: '1rem',
        fontSize: '{form.field.sm.font.size}'
    },
    lg: {
        padding: '2.5rem 1.5rem',
        fontSize: '{form.field.lg.font.size}'
    }
};

export const icon: FileInputTokenSections.Icon = {
    color: '{text.muted.color}',
    size: '1.5rem'
};

export const hint: FileInputTokenSections.Hint = {
    color: '{text.muted.color}',
    fontSize: '0.875rem'
};

export const list: FileInputTokenSections.List = {
    borderColor: '{form.field.border.color}',
    borderRadius: '{form.field.border.radius}'
};

export const item: FileInputTokenSections.Item = {
    padding: '0.625rem 0.75rem',
    gap: '0.75rem',
    borderColor: '{content.border.color}'
};

export const thumbnail: FileInputTokenSections.Thumbnail = {
    size: '2.5rem',
    borderRadius: '{content.border.radius}',
    background: '{content.hover.background}',
    color: '{text.muted.color}'
};

export const meta: FileInputTokenSections.Meta = {
    color: '{text.muted.color}',
    fontSize: '0.75rem',
    gap: '0.5rem'
};

export const progress: FileInputTokenSections.Progress = {
    height: '0.25rem',
    borderRadius: '2px',
    background: '{content.border.color}',
    valueBackground: '{primary.color}'
};

export const status: FileInputTokenSections.Status = {};

export const action: FileInputTokenSections.Action = {
    size: '2rem',
    borderRadius: '{content.border.radius}',
    color: '{text.muted.color}',
    hoverColor: '{text.color}',
    hoverBackground: '{content.hover.background}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const summary: FileInputTokenSections.Summary = {
    gap: '0.75rem',
    color: '{text.muted.color}',
    fontSize: '0.875rem'
};

export const grid: FileInputTokenSections.Grid = {
    gap: '0.625rem',
    itemMinWidth: '7.5rem'
};

export const tile: FileInputTokenSections.Tile = {
    borderRadius: '{form.field.border.radius}',
    borderColor: '{content.border.color}',
    errorBorderColor: '{form.field.invalid.border.color}',
    background: '{content.hover.background}',
    overlayBackground: 'rgba(2, 6, 23, 0.55)',
    overlayColor: '#ffffff',
    errorOverlayBackground: 'rgba(127, 29, 29, 0.8)',
    actionBackground: 'rgba(255, 255, 255, 0.92)',
    actionColor: '{surface.900}'
};

export const avatar: FileInputTokenSections.Avatar = {
    size: '6rem',
    background: '{content.hover.background}',
    borderColor: '{form.field.border.color}',
    color: '{text.muted.color}',
    squareBorderRadius: '{content.border.radius}',
    overlayBackground: 'rgba(2, 6, 23, 0.55)',
    overlayColor: '#ffffff'
};

export const colorScheme: FileInputTokenSections.ColorScheme = {
    light: {
        dropzone: {
            activeBackground: '{surface.50}'
        },
        item: {
            errorBackground: '{red.50}'
        },
        status: {
            successColor: '{green.600}',
            errorColor: '{red.600}'
        }
    },
    dark: {
        dropzone: {
            activeBackground: '{surface.800}'
        },
        item: {
            errorBackground: 'color-mix(in srgb, {red.400}, transparent 88%)'
        },
        status: {
            successColor: '{green.400}',
            errorColor: '{red.400}'
        }
    }
};

export default {
    root,
    dropzone,
    icon,
    hint,
    list,
    item,
    thumbnail,
    meta,
    progress,
    status,
    action,
    summary,
    grid,
    tile,
    avatar,
    colorScheme
} satisfies FileInputDesignTokens;
