import type { KanbanTokenSections } from '@exhaustive-ui/themes/types/kanban';

export * from '@exhaustive-ui/themes/types/kanban';

declare const root: KanbanTokenSections.Root;
declare const board: KanbanTokenSections.Board;
declare const column: KanbanTokenSections.Column;
declare const columnHeader: KanbanTokenSections.ColumnHeader;
declare const columnCount: KanbanTokenSections.ColumnCount;
declare const columnAction: KanbanTokenSections.ColumnAction;
declare const card: KanbanTokenSections.Card;
declare const placeholder: KanbanTokenSections.Placeholder;
declare const preview: KanbanTokenSections.Preview;
declare const empty: KanbanTokenSections.Empty;
declare const addButton: KanbanTokenSections.AddButton;
declare const colorScheme: KanbanTokenSections.ColorScheme;
declare const _default: {
    root: KanbanTokenSections.Root;
    board: KanbanTokenSections.Board;
    column: KanbanTokenSections.Column;
    columnHeader: KanbanTokenSections.ColumnHeader;
    columnCount: KanbanTokenSections.ColumnCount;
    columnAction: KanbanTokenSections.ColumnAction;
    card: KanbanTokenSections.Card;
    placeholder: KanbanTokenSections.Placeholder;
    preview: KanbanTokenSections.Preview;
    empty: KanbanTokenSections.Empty;
    addButton: KanbanTokenSections.AddButton;
    colorScheme: KanbanTokenSections.ColorScheme;
};

export { addButton, board, card, colorScheme, column, columnAction, columnCount, columnHeader, empty, placeholder, preview, root, _default as default };
