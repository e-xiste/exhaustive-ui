import type { KanbanDesignTokens, KanbanTokenSections } from '@exhaustive-ui/themes/types/kanban';

export const root: KanbanTokenSections.Root = {
    transitionDuration: '{form.field.transition.duration}'
};

export const board: KanbanTokenSections.Board = {
    gap: '1rem',
    padding: '0.25rem 0.25rem 0.75rem 0.25rem'
};

export const column: KanbanTokenSections.Column = {
    borderColor: '{content.border.color}',
    borderRadius: '{content.border.radius}',
    width: '18rem',
    minWidth: '16rem',
    collapsedWidth: '3rem',
    padding: '0.75rem',
    gap: '0.5rem'
};

export const columnHeader: KanbanTokenSections.ColumnHeader = {
    padding: '0 0 0.75rem 0',
    gap: '0.5rem',
    color: '{text.color}',
    fontWeight: '600'
};

export const columnCount: KanbanTokenSections.ColumnCount = {
    padding: '0.125rem 0.5rem',
    borderRadius: '1rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '{text.color}'
};

export const columnAction: KanbanTokenSections.ColumnAction = {
    size: '1.75rem',
    borderRadius: '{content.border.radius}',
    color: '{text.muted.color}',
    hoverColor: '{text.color}',
    grabbedBackground: '{highlight.background}',
    grabbedColor: '{highlight.color}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const card: KanbanTokenSections.Card = {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    borderRadius: '{content.border.radius}',
    padding: '0.75rem',
    color: '{text.color}',
    shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    grabbedBorderColor: '{primary.color}',
    grabbedShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    disabledColor: '{text.muted.color}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const placeholder: KanbanTokenSections.Placeholder = {
    borderColor: '{primary.color}',
    borderRadius: '{content.border.radius}'
};

export const preview: KanbanTokenSections.Preview = {
    shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
};

export const empty: KanbanTokenSections.Empty = {
    padding: '1.25rem 0.75rem',
    color: '{text.muted.color}',
    fontSize: '0.875rem',
    borderRadius: '{content.border.radius}'
};

export const addButton: KanbanTokenSections.AddButton = {
    padding: '0.5rem 0.75rem',
    gap: '0.5rem',
    borderRadius: '{content.border.radius}',
    color: '{text.muted.color}',
    hoverColor: '{text.color}',
    fontWeight: '500',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const colorScheme: KanbanTokenSections.ColorScheme = {
    light: {
        column: {
            background: '{surface.100}',
            overLimitBorderColor: '{red.500}',
            overLimitBackground: '{red.50}',
            refusedBorderColor: '{red.600}',
            dropTargetBackground: '{surface.200}'
        },
        columnCount: {
            background: '{surface.200}',
            fullBackground: '{orange.100}',
            fullColor: '{orange.800}',
            overLimitBackground: '{red.100}',
            overLimitColor: '{red.800}'
        },
        columnAction: {
            hoverBackground: '{surface.200}'
        },
        card: {
            hoverBorderColor: '{surface.300}',
            disabledBackground: '{surface.50}'
        },
        placeholder: {
            background: 'color-mix(in srgb, {primary.color}, transparent 90%)'
        },
        empty: {
            borderColor: '{surface.300}'
        },
        addButton: {
            hoverBackground: '{surface.200}'
        }
    },
    dark: {
        column: {
            background: '{surface.950}',
            overLimitBorderColor: '{red.400}',
            overLimitBackground: 'color-mix(in srgb, {red.400}, transparent 90%)',
            refusedBorderColor: '{red.400}',
            dropTargetBackground: '{surface.800}'
        },
        columnCount: {
            background: '{surface.800}',
            fullBackground: 'color-mix(in srgb, {orange.400}, transparent 84%)',
            fullColor: '{orange.300}',
            overLimitBackground: 'color-mix(in srgb, {red.400}, transparent 84%)',
            overLimitColor: '{red.300}'
        },
        columnAction: {
            hoverBackground: '{surface.800}'
        },
        card: {
            hoverBorderColor: '{surface.600}',
            disabledBackground: '{surface.950}'
        },
        placeholder: {
            background: 'color-mix(in srgb, {primary.color}, transparent 84%)'
        },
        empty: {
            borderColor: '{surface.700}'
        },
        addButton: {
            hoverBackground: '{surface.800}'
        }
    }
};

export default {
    root,
    board,
    column,
    columnHeader,
    columnCount,
    columnAction,
    card,
    placeholder,
    preview,
    empty,
    addButton,
    colorScheme
} satisfies KanbanDesignTokens;
