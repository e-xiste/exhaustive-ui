import { Injectable } from '@angular/core';
import { style as kanban_style } from '@exhaustive-ui/styles/kanban';
import { BaseStyle } from '@exhaustive-ui/core/base';

const classes = {
    root: ({ instance }) => [
        'p-kanban p-component',
        {
            'p-kanban-disabled': instance.disabled(),
            'p-kanban-dragging': instance.dragging(),
            'p-kanban-scrollable': !!instance.scrollHeight()
        }
    ],
    board: 'p-kanban-board',
    column: ({ instance, column }) => [
        'p-kanban-column',
        {
            'p-kanban-column-collapsed': !!column.collapsed,
            'p-kanban-column-disabled': instance.isColumnDisabled(column),
            'p-kanban-column-over-limit': instance.isOverLimit(column),
            'p-kanban-column-refused': instance.refusedColumnId() === column.id,
            'p-kanban-column-grabbed': instance.isColumnGrabbed(column)
        }
    ],
    columnHeader: 'p-kanban-column-header',
    columnHeading: 'p-kanban-column-heading',
    columnTitle: 'p-kanban-column-title',
    columnCount: ({ instance, column }) => ['p-kanban-column-count', { 'p-kanban-column-count-full': instance.isFull(column), 'p-kanban-column-count-over-limit': instance.isOverLimit(column) }],
    columnHandle: 'p-kanban-column-action p-kanban-column-handle',
    columnToggle: 'p-kanban-column-action p-kanban-column-toggle',
    columnContent: 'p-kanban-column-content',
    columnFooter: 'p-kanban-column-footer',
    cardItem: 'p-kanban-card-item',
    card: ({ instance, item, column }) => [
        'p-kanban-card',
        {
            'p-kanban-card-grabbed': instance.isCardGrabbed(item),
            'p-kanban-card-disabled': instance.isColumnDisabled(column)
        }
    ],
    empty: 'p-kanban-empty',
    addButton: 'p-kanban-add-button'
};

@Injectable()
export class KanbanStyle extends BaseStyle {
    name = 'kanban';

    style = kanban_style;

    classes = classes;
}

/**
 *
 * Kanban is a task board: cards are dragged within a column and from a column to another one, with the pointer or the keyboard.
 *
 * [Live Demo](https://exhaustive-ui.com/kanban/)
 *
 * @module kanbanstyle
 *
 */
export enum KanbanClasses {
    /**
     * Class name of the root element
     */
    root = 'p-kanban',
    /**
     * Class name of the scrolling board
     */
    board = 'p-kanban-board',
    /**
     * Class name of a column
     */
    column = 'p-kanban-column',
    /**
     * Class name of a column header
     */
    columnHeader = 'p-kanban-column-header',
    /**
     * Class name of a column title
     */
    columnTitle = 'p-kanban-column-title',
    /**
     * Class name of the card count of a column
     */
    columnCount = 'p-kanban-column-count',
    /**
     * Class name of the drag handle of a column
     */
    columnHandle = 'p-kanban-column-handle',
    /**
     * Class name of the collapse button of a column
     */
    columnToggle = 'p-kanban-column-toggle',
    /**
     * Class name of the card list of a column
     */
    columnContent = 'p-kanban-column-content',
    /**
     * Class name of a column footer
     */
    columnFooter = 'p-kanban-column-footer',
    /**
     * Class name of the list item that holds a card
     */
    cardItem = 'p-kanban-card-item',
    /**
     * Class name of a card
     */
    card = 'p-kanban-card',
    /**
     * Class name of the empty message of a column
     */
    empty = 'p-kanban-empty',
    /**
     * Class name of the add card button
     */
    addButton = 'p-kanban-add-button'
}

export interface KanbanStyle extends BaseStyle {}
