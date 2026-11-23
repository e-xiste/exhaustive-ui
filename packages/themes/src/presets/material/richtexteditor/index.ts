import type { RichTextEditorDesignTokens, RichTextEditorTokenSections } from '@exhaustive-ui/themes/types/richtexteditor';

export const root: RichTextEditorTokenSections.Root = {
    background: '{form.field.background}',
    disabledBackground: '{form.field.disabled.background}',
    filledBackground: '{form.field.filled.background}',
    filledFocusBackground: '{form.field.filled.focus.background}',
    borderColor: '{form.field.border.color}',
    hoverBorderColor: '{form.field.hover.border.color}',
    focusBorderColor: '{form.field.focus.border.color}',
    invalidBorderColor: '{form.field.invalid.border.color}',
    color: '{form.field.color}',
    disabledColor: '{form.field.disabled.color}',
    shadow: '{form.field.shadow}',
    borderRadius: '{form.field.border.radius}',
    transitionDuration: '{form.field.transition.duration}',
    focusRing: {
        width: '{form.field.focus.ring.width}',
        style: '{form.field.focus.ring.style}',
        color: '{form.field.focus.ring.color}',
        offset: '{form.field.focus.ring.offset}',
        shadow: '{form.field.focus.ring.shadow}'
    }
};

export const toolbar: RichTextEditorTokenSections.Toolbar = {
    background: 'transparent',
    borderColor: '{content.border.color}',
    padding: '0.375rem',
    gap: '0.125rem'
};

export const separator: RichTextEditorTokenSections.Separator = {
    background: '{content.border.color}',
    height: '1.25rem',
    margin: '0 0.25rem'
};

export const button: RichTextEditorTokenSections.Button = {
    size: '2rem',
    borderRadius: '{content.border.radius}',
    color: '{text.muted.color}',
    hoverBackground: '{content.hover.background}',
    hoverColor: '{text.hover.color}',
    activeBackground: '{highlight.background}',
    activeColor: '{highlight.color}',
    iconSize: '1.125rem',
    fontSize: '0.875rem',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    },
    sm: {
        size: '1.75rem'
    },
    lg: {
        size: '2.25rem'
    }
};

export const content: RichTextEditorTokenSections.Content = {
    padding: '0.75rem 1rem',
    minHeight: '8rem',
    fontSize: '1rem',
    lineHeight: '1.6',
    gap: '0.75em',
    placeholderColor: '{form.field.placeholder.color}',
    sm: {
        fontSize: '{form.field.sm.font.size}',
        padding: '0.5rem 0.75rem'
    },
    lg: {
        fontSize: '{form.field.lg.font.size}',
        padding: '1rem 1.25rem'
    }
};

export const heading: RichTextEditorTokenSections.Heading = {
    color: '{text.color}',
    fontWeight: '600',
    lineHeight: '1.3',
    h1: {
        fontSize: '1.75em'
    },
    h2: {
        fontSize: '1.4em'
    },
    h3: {
        fontSize: '1.2em'
    }
};

export const link: RichTextEditorTokenSections.Link = {
    color: '{primary.color}',
    hoverColor: '{primary.hover.color}'
};

export const code: RichTextEditorTokenSections.Code = {
    color: '{text.color}',
    borderRadius: '{border.radius.sm}',
    padding: '0.125em 0.375em',
    fontSize: '0.875em'
};

export const codeBlock: RichTextEditorTokenSections.CodeBlock = {
    borderRadius: '{content.border.radius}',
    padding: '0.75rem 1rem'
};

export const blockquote: RichTextEditorTokenSections.Blockquote = {
    color: '{text.muted.color}',
    borderWidth: '3px',
    padding: '0 0 0 1rem'
};

export const linkPanel: RichTextEditorTokenSections.LinkPanel = {
    background: '{overlay.popover.background}',
    borderColor: '{overlay.popover.border.color}',
    color: '{overlay.popover.color}',
    borderRadius: '{overlay.popover.border.radius}',
    shadow: '{overlay.popover.shadow}',
    padding: '{overlay.popover.padding}',
    gap: '0.5rem',
    width: '22rem'
};

export const linkInput: RichTextEditorTokenSections.LinkInput = {
    background: '{form.field.background}',
    borderColor: '{form.field.border.color}',
    focusBorderColor: '{form.field.focus.border.color}',
    invalidBorderColor: '{form.field.invalid.border.color}',
    color: '{form.field.color}',
    placeholderColor: '{form.field.placeholder.color}',
    borderRadius: '{form.field.border.radius}',
    padding: '{form.field.padding.y} {form.field.padding.x}',
    focusRing: {
        width: '{form.field.focus.ring.width}',
        style: '{form.field.focus.ring.style}',
        color: '{form.field.focus.ring.color}',
        offset: '{form.field.focus.ring.offset}',
        shadow: '{form.field.focus.ring.shadow}'
    }
};

export const linkButton: RichTextEditorTokenSections.LinkButton = {
    padding: '0.375rem 0.75rem',
    borderRadius: '{content.border.radius}',
    color: '{text.color}',
    hoverBackground: '{content.hover.background}',
    applyBackground: '{primary.color}',
    applyHoverBackground: '{primary.hover.color}',
    applyColor: '{primary.contrast.color}',
    fontWeight: '500',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const footer: RichTextEditorTokenSections.Footer = {
    padding: '0.375rem 1rem',
    color: '{text.muted.color}',
    fontSize: '0.875rem',
    borderColor: '{content.border.color}'
};

export const colorScheme: RichTextEditorTokenSections.ColorScheme = {
    light: {
        code: {
            background: '{surface.100}'
        },
        codeBlock: {
            background: '{surface.100}',
            color: '{surface.800}'
        },
        blockquote: {
            borderColor: '{surface.300}'
        },
        footer: {
            limitColor: '{red.600}'
        },
        linkPanel: {
            errorColor: '{red.600}'
        }
    },
    dark: {
        code: {
            background: '{surface.800}'
        },
        codeBlock: {
            background: '{surface.800}',
            color: '{surface.100}'
        },
        blockquote: {
            borderColor: '{surface.600}'
        },
        footer: {
            limitColor: '{red.400}'
        },
        linkPanel: {
            errorColor: '{red.400}'
        }
    }
};

export default {
    root,
    toolbar,
    separator,
    button,
    content,
    heading,
    link,
    code,
    codeBlock,
    blockquote,
    linkPanel,
    linkInput,
    linkButton,
    footer,
    colorScheme
} satisfies RichTextEditorDesignTokens;
