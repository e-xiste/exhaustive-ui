import { TemplateRef } from '@angular/core';
import { PassThrough, PassThroughOption } from '@exhaustive-ui/core/api';

/**
 * Custom passthrough(pt) options.
 * @template I Type of instance.
 *
 * @see {@link Kanban.pt}
 * @group Interface
 */
export interface KanbanPassThroughOptions<I = unknown> {
    /**
     * Used to pass attributes to the root's DOM element.
     */
    root?: PassThroughOption<HTMLElement, I>;
    /**
     * Used to pass attributes to the horizontally scrolling board that holds the columns.
     */
    board?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to a column's DOM element.
     */
    column?: PassThroughOption<HTMLElement, I>;
    /**
     * Used to pass attributes to a column header's DOM element.
     */
    columnHeader?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to a column title's DOM element.
     */
    columnTitle?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the card count of a column.
     */
    columnCount?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the drag handle button of a column.
     */
    columnHandle?: PassThroughOption<HTMLButtonElement, I>;
    /**
     * Used to pass attributes to the collapse button of a column.
     */
    columnToggle?: PassThroughOption<HTMLButtonElement, I>;
    /**
     * Used to pass attributes to the list of cards of a column.
     */
    columnContent?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to a column footer's DOM element.
     */
    columnFooter?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the list item that holds a card.
     */
    cardItem?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to a card's DOM element.
     */
    card?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the empty message of a column.
     */
    empty?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the add card button of a column.
     */
    addButton?: PassThroughOption<HTMLButtonElement, I>;
}

/**
 * Defines valid pass-through options in Kanban component.
 * @see {@link KanbanPassThroughOptions}
 *
 * @template I Type of instance.
 */
export type KanbanPassThrough<I = unknown> = PassThrough<I, KanbanPassThroughOptions<I>>;

/**
 * A column of the board.
 * @template T Type of the cards.
 * @group Interface
 */
export interface KanbanColumn<T = any> {
    /**
     * Unique identifier of the column.
     */
    id: string;
    /**
     * Title of the column, also its accessible name.
     */
    title: string;
    /**
     * Cards of the column, in display order.
     */
    items: T[];
    /**
     * Work in progress limit: the column shows its count as "3 / 5" and refuses the cards dropped beyond the limit.
     */
    limit?: number;
    /**
     * Whether the column is collapsed to a narrow strip.
     */
    collapsed?: boolean;
    /**
     * Whether the cards of the column can not be dragged, and the column refuses dropped cards.
     */
    disabled?: boolean;
    /**
     * Any data of the application, for templates.
     */
    data?: any;
}

/**
 * Decides whether a card can move from a column to another one.
 * @template T Type of the cards.
 * @group Types
 */
export type KanbanCanDrop<T = any> = (item: T, from: KanbanColumn<T>, to: KanbanColumn<T>) => boolean;

/**
 * Texts of the component. `{0}`, `{1}`... are replaced by values.
 * @group Interface
 */
export interface KanbanLabels {
    /**
     * Instructions read with a card, linked with aria-describedby.
     */
    cardInstructions: string;
    /**
     * Instructions read with the drag handle of a column.
     */
    columnInstructions: string;
    /**
     * Announced when a card is picked up. {0} card, {1} position, {2} number of cards, {3} column.
     */
    pickedUp: string;
    /**
     * Announced when a picked up card moves. {0} column, {1} position, {2} number of cards.
     */
    moved: string;
    /**
     * Announced when a card is dropped. {0} card, {1} column, {2} position, {3} number of cards.
     */
    dropped: string;
    /**
     * Announced when a move is cancelled. {0} card, {1} column, {2} position, {3} number of cards.
     */
    cancelled: string;
    /**
     * Announced when a column refuses a card because of its limit. {0} column, {1} number of cards, {2} limit.
     */
    limitReached: string;
    /**
     * Announced when a column refuses a card. {0} card, {1} column.
     */
    dropRefused: string;
    /**
     * Announced when a column is picked up. {0} column, {1} position, {2} number of columns.
     */
    columnPickedUp: string;
    /**
     * Announced when a picked up column moves. {0} position, {1} number of columns.
     */
    columnMoved: string;
    /**
     * Announced when a column is dropped. {0} column, {1} position, {2} number of columns.
     */
    columnDropped: string;
    /**
     * Announced when a column move is cancelled. {0} column, {1} position, {2} number of columns.
     */
    columnCancelled: string;
    /**
     * Text of the add card button.
     */
    addCard: string;
    /**
     * Accessible name of the add card button. {0} column.
     */
    addCardTo: string;
    /**
     * Accessible name of the collapse button. {0} column.
     */
    collapse: string;
    /**
     * Accessible name of the expand button. {0} column.
     */
    expand: string;
    /**
     * Accessible name of the drag handle of a column. {0} column.
     */
    moveColumn: string;
    /**
     * Message of an empty column.
     */
    empty: string;
    /**
     * Count read by screen readers. {0} number of cards.
     */
    count: string;
    /**
     * Count with a limit read by screen readers. {0} number of cards, {1} limit.
     */
    countLimit: string;
    /**
     * Added to the count when a column holds more cards than its limit.
     */
    overLimit: string;
}

/**
 * Custom card move event, emitted after the columns are updated.
 * @template T Type of the cards.
 * @see {@link Kanban.onCardMove}
 * @group Events
 */
export interface KanbanCardMoveEvent<T = any> {
    /**
     * The moved card.
     */
    item: T;
    /**
     * Column the card comes from, as it is after the move.
     */
    fromColumn: KanbanColumn<T>;
    /**
     * Column the card is moved to, as it is after the move. The same column as fromColumn for a reorder.
     */
    toColumn: KanbanColumn<T>;
    /**
     * Index of the card in its original column.
     */
    fromIndex: number;
    /**
     * Index of the card in its new column.
     */
    toIndex: number;
    /**
     * All the columns after the move.
     */
    columns: KanbanColumn<T>[];
}

/**
 * Custom card click event.
 * @template T Type of the cards.
 * @see {@link Kanban.onCardClick}
 * @group Events
 */
export interface KanbanCardClickEvent<T = any> {
    /**
     * Browser event.
     */
    originalEvent: Event;
    /**
     * The clicked card.
     */
    item: T;
    /**
     * Column of the card.
     */
    column: KanbanColumn<T>;
}

/**
 * Custom column reorder event, emitted after the columns are updated.
 * @template T Type of the cards.
 * @see {@link Kanban.onColumnReorder}
 * @group Events
 */
export interface KanbanColumnReorderEvent<T = any> {
    /**
     * The moved column.
     */
    column: KanbanColumn<T>;
    /**
     * Original index of the column.
     */
    fromIndex: number;
    /**
     * New index of the column.
     */
    toIndex: number;
    /**
     * All the columns after the move.
     */
    columns: KanbanColumn<T>[];
}

/**
 * Custom add card event.
 * @template T Type of the cards.
 * @see {@link Kanban.onAddCard}
 * @group Events
 */
export interface KanbanAddCardEvent<T = any> {
    /**
     * Column of the clicked add card button.
     */
    column: KanbanColumn<T>;
}

/**
 * Custom column toggle event, emitted after the columns are updated.
 * @template T Type of the cards.
 * @see {@link Kanban.onColumnToggle}
 * @group Events
 */
export interface KanbanColumnToggleEvent<T = any> {
    /**
     * The toggled column, as it is after the change.
     */
    column: KanbanColumn<T>;
    /**
     * Whether the column is now collapsed.
     */
    collapsed: boolean;
}

/**
 * Context of the card template.
 * @template T Type of the cards.
 * @group Interface
 */
export interface KanbanCardTemplateContext<T = any> {
    /**
     * The card.
     */
    $implicit: T;
    /**
     * Column of the card.
     */
    column: KanbanColumn<T>;
    /**
     * Index of the card in its column.
     */
    index: number;
    /**
     * Whether the card is picked up with the keyboard.
     */
    grabbed: boolean;
}

/**
 * Context of the column header, column footer and empty templates.
 * @template T Type of the cards.
 * @group Interface
 */
export interface KanbanColumnTemplateContext<T = any> {
    /**
     * The column.
     */
    $implicit: KanbanColumn<T>;
    /**
     * Number of cards of the column.
     */
    count: number;
    /**
     * Work in progress limit of the column.
     */
    limit: number | undefined;
    /**
     * Whether the column holds more cards than its limit.
     */
    overLimit: boolean;
}

/**
 * Defines valid templates in Kanban.
 * @group Templates
 */
export interface KanbanTemplates<T = any> {
    /**
     * Custom content of a card.
     * @param {KanbanCardTemplateContext} context - card context.
     */
    card(context: KanbanCardTemplateContext<T>): TemplateRef<KanbanCardTemplateContext<T>>;
    /**
     * Custom title and count of a column header.
     * @param {KanbanColumnTemplateContext} context - column context.
     */
    columnHeader(context: KanbanColumnTemplateContext<T>): TemplateRef<KanbanColumnTemplateContext<T>>;
    /**
     * Custom footer of a column, above the add card button.
     * @param {KanbanColumnTemplateContext} context - column context.
     */
    columnFooter(context: KanbanColumnTemplateContext<T>): TemplateRef<KanbanColumnTemplateContext<T>>;
    /**
     * Custom content of an empty column.
     * @param {KanbanColumnTemplateContext} context - column context.
     */
    empty(context: KanbanColumnTemplateContext<T>): TemplateRef<KanbanColumnTemplateContext<T>>;
}
