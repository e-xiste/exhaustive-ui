# Angular Kanban Component

Kanban is a task board. Cards are dragged within a column and from a column to another one, with the mouse, a finger or the keyboard, with work in progress limits, drop rules, collapsible and reorderable columns, and every move announced to screen readers.

## Accessibility

Screen Reader Every column is a group named by its title, rather than a landmark, so that two boards on a page never repeat landmarks such as "To do". It holds a list whose label also gives the count, such as "In progress, 2 of 3 cards", or a group with the same label when the column is empty. Each card is a list item holding a focusable element with the button role, described with aria-describedby by the instructions to move it, and with aria-pressed true while it is picked up. The count of a column reads "2 of 3 cards" instead of "2 / 3", and "over the limit" when it is exceeded. A card can be moved with the keyboard alone, and an assertive live region announces each step: "Picked up Task A, position 2 of 5 in To do", "Moved to In progress, position 1 of 3", "Dropped Task A in In progress, position 1 of 3" or "Cancelled, Task A returned to To do, position 2 of 5". A refused move is announced with its reason, such as "Review is full, 1 of 1 cards", and so is a full column a card is dragged over with the pointer. The column drag handles, the collapse buttons and the add card buttons name their column, for example "Add card to Done". Name the board with ariaLabel or ariaLabelledBy , and translate every text with labels .

## Add Card

showAddButton adds an "Add card" button at the bottom of every column. It emits onAddCard with the column, and the application creates the card, often after a dialog; set the new columns to display it. The button is disabled in a disabled column and in a column that reached its limit.

```typescript
import { Component } from '@angular/core';
import { KanbanAddCardEvent, KanbanColumn, KanbanModule } from '@exhaustive-ui/core/kanban';

interface Task {
    id: number;
    title: string;
}

@Component({
    template: `
        <div class="card">
            <p-kanban [(columns)]="columns" dataKey="id" showAddButton (onAddCard)="addCard($event)" ariaLabel="Board with add buttons" />
        </div>
    `,
    standalone: true,
    imports: [KanbanModule]
})
export class KanbanAddcardDemo {
    nextId = 4;

    columns: KanbanColumn<Task>[] = [
        { id: 'ideas', title: 'Ideas', items: [{ id: 1, title: 'A mobile app' }] },
        {
            id: 'planned',
            title: 'Planned',
            limit: 2,
            items: [
                { id: 2, title: 'Two-factor authentication' },
                { id: 3, title: 'Public API' }
            ]
        },
        { id: 'shipped', title: 'Shipped', items: [] }
    ];

    addCard({ column }: KanbanAddCardEvent<Task>) {
        const card = { id: this.nextId, title: `New card ${this.nextId++}` };
        this.columns = this.columns.map((c) => (c.id === column.id ? { ...c, items: [...c.items, card] } : c));
    }
}
```

## Basic

Kanban displays columns , each with an id , a title and its items . Drag a card to reorder it in its column or to move it to another column, with the mouse, a finger or the keyboard. The board updates columns with new arrays after every move, so bind it two-way with [(columns)] . dataKey names the field that identifies a card, and itemLabel the field displayed by the default card, title by default.

```typescript
import { Component } from '@angular/core';
import { KanbanColumn, KanbanModule } from '@exhaustive-ui/core/kanban';

interface Task {
    id: number;
    title: string;
}

@Component({
    template: `
        <div class="card">
            <p-kanban [(columns)]="columns" dataKey="id" ariaLabel="Basic board" />
        </div>
    `,
    standalone: true,
    imports: [KanbanModule]
})
export class KanbanBasicDemo {
    columns: KanbanColumn<Task>[] = [
        {
            id: 'todo',
            title: 'To do',
            items: [
                { id: 1, title: 'Write the release notes' },
                { id: 2, title: 'Update the screenshots' },
                { id: 3, title: 'Answer the support tickets' }
            ]
        },
        {
            id: 'doing',
            title: 'In progress',
            items: [
                { id: 4, title: 'Fix the login redirect' },
                { id: 5, title: 'Translate the onboarding' }
            ]
        },
        { id: 'review', title: 'Review', items: [{ id: 6, title: 'Dark mode for the settings page' }] },
        { id: 'done', title: 'Done', items: [{ id: 7, title: 'Set up the staging server' }] }
    ];
}
```

## Collapsible Columns

collapsible adds a button to the header of every column that folds it into a narrow strip, as tall as the board, with its count and its title written vertically. A click anywhere on the strip unfolds it, and its button stays the way to do it with the keyboard. The board sets the collapsed property of the column and emits onColumnToggle ; set collapsed in the columns to start with a folded column. A collapsed column does not take dropped cards, and the keyboard moves skip it.

```typescript
import { Component } from '@angular/core';
import { KanbanColumn, KanbanModule } from '@exhaustive-ui/core/kanban';

interface Task {
    id: number;
    title: string;
}

@Component({
    template: `
        <div class="card">
            <p-kanban [(columns)]="columns" dataKey="id" collapsible ariaLabel="Board with collapsible columns" />
        </div>
    `,
    standalone: true,
    imports: [KanbanModule]
})
export class KanbanCollapsibleDemo {
    columns: KanbanColumn<Task>[] = [
        {
            id: 'backlog',
            title: 'Backlog',
            collapsed: true,
            items: [
                { id: 1, title: 'Offline mode' },
                { id: 2, title: 'Keyboard shortcuts' },
                { id: 3, title: 'Audit log' }
            ]
        },
        {
            id: 'todo',
            title: 'To do',
            items: [
                { id: 4, title: 'Onboarding checklist' },
                { id: 5, title: 'Export to PDF' }
            ]
        },
        { id: 'doing', title: 'In progress', limit: 3, items: [{ id: 6, title: 'Usage based billing' }] },
        { id: 'done', title: 'Done', collapsed: true, items: [{ id: 7, title: 'Single sign-on' }] }
    ];
}
```

## Limits and Rules

The limit of a column is its work in progress limit: the header shows the count as "2 / 3", the count turns orange when the column is full and red when it holds more cards than its limit, and the column refuses the cards dropped beyond it. While a card is dragged over a column that refuses it, the column gets a dashed red border and screen readers hear the reason. A disabled column neither gives nor takes cards. canDrop decides any other rule. It receives the card, the column it comes from and the column it would go to, and returns false to refuse the move; moves within a column are always allowed. Here a card can only reach Done from Review , and the Archived column is disabled.

```typescript
import { Component } from '@angular/core';
import { KanbanCanDrop, KanbanColumn, KanbanModule } from '@exhaustive-ui/core/kanban';

interface Task {
    id: number;
    title: string;
}

@Component({
    template: `
        <div class="card">
            <p-kanban [(columns)]="columns" dataKey="id" [canDrop]="canDrop" ariaLabel="Board with limits" />
        </div>
    `,
    standalone: true,
    imports: [KanbanModule]
})
export class KanbanLimitsDemo {
    columns: KanbanColumn<Task>[] = [
        {
            id: 'todo',
            title: 'To do',
            items: [
                { id: 1, title: 'Plan the sprint' },
                { id: 2, title: 'Interview a customer' },
                { id: 3, title: 'Clean the backlog' }
            ]
        },
        {
            id: 'doing',
            title: 'In progress',
            limit: 3,
            items: [
                { id: 4, title: 'New pricing page' },
                { id: 5, title: 'Invoice emails' }
            ]
        },
        { id: 'review', title: 'Review', limit: 1, items: [{ id: 6, title: 'Search filters' }] },
        { id: 'done', title: 'Done', items: [] },
        { id: 'archived', title: 'Archived', disabled: true, items: [{ id: 7, title: 'Old landing page' }] }
    ];

    canDrop: KanbanCanDrop<Task> = (item, from, to) => to.id !== 'done' || from.id === 'review';
}
```

## Saving Moves

onCardMove is emitted once a card is dropped, with the pointer or the keyboard, after the columns are updated. It holds the item , the fromColumn and toColumn as they are after the move, the fromIndex and toIndex , and all the columns : send the change to the server from there. A keyboard move only emits when the card is dropped, not at every arrow key, and Escape emits nothing. With a server, keep the previous columns to put the card back when the request fails.

```typescript
import { Component } from '@angular/core';
import { KanbanCardMoveEvent, KanbanColumn, KanbanModule } from '@exhaustive-ui/core/kanban';

interface Task {
    id: number;
    title: string;
}

@Component({
    template: `
        <div class="card">
            <p-kanban [(columns)]="columns" dataKey="id" (onCardMove)="onCardMove($event)" ariaLabel="Board that saves its moves" />
            <ul class="mt-4 mb-0 text-sm text-muted-color list-none p-0" aria-label="Saved moves">
                @for (line of log; track $index) {
                    <li>{{ line }}</li>
                } @empty {
                    <li>Move a card to see the request.</li>
                }
            </ul>
        </div>
    `,
    standalone: true,
    imports: [KanbanModule]
})
export class KanbanPersistDemo {
    columns: KanbanColumn<Task>[] = [
        {
            id: 'todo',
            title: 'To do',
            items: [
                { id: 1, title: 'Order the new laptops' },
                { id: 2, title: 'Book the team offsite' }
            ]
        },
        { id: 'doing', title: 'In progress', items: [{ id: 3, title: 'Hire a designer' }] },
        { id: 'done', title: 'Done', items: [] }
    ];

    log: string[] = [];

    onCardMove(event: KanbanCardMoveEvent<Task>) {
        this.log = [`PATCH /api/tasks/${event.item.id} { "status": "${event.toColumn.id}", "position": ${event.toIndex} }`, ...this.log].slice(0, 4);
    }
}
```

## Column Reorder

reorderColumns adds a drag handle to the header of every column. Drag it to move the column, or focus it and use Space or Enter, the left and right arrow keys, and Space or Enter again. The board emits onColumnReorder with the column, its previous and its new index once the columns are updated.

```typescript
import { Component } from '@angular/core';
import { KanbanColumn, KanbanColumnReorderEvent, KanbanModule } from '@exhaustive-ui/core/kanban';

interface Task {
    id: number;
    title: string;
}

@Component({
    template: `
        <div class="card">
            <p-kanban [(columns)]="columns" dataKey="id" reorderColumns (onColumnReorder)="onReorder($event)" ariaLabel="Board with reorderable columns" />
            <p class="mt-4 mb-0 text-sm text-muted-color">Order: {{ order }}</p>
        </div>
    `,
    standalone: true,
    imports: [KanbanModule]
})
export class KanbanReordercolumnsDemo {
    columns: KanbanColumn<Task>[] = [
        { id: 'todo', title: 'To do', items: [{ id: 1, title: 'Draft the newsletter' }] },
        { id: 'doing', title: 'In progress', items: [{ id: 2, title: 'Record the demo video' }] },
        { id: 'blocked', title: 'Blocked', items: [{ id: 3, title: 'Legal review of the terms' }] },
        { id: 'done', title: 'Done', items: [] }
    ];

    order = this.columns.map((column) => column.title).join(', ');

    onReorder(event: KanbanColumnReorderEvent<Task>) {
        this.order = event.columns.map((column) => column.title).join(', ');
    }
}
```

## Scroll

When the columns do not fit, they shrink to their minimum width, then the board scrolls horizontally, with a thin scrollbar, and fades out the edges that hide columns. scrollHeight gives the board a height: the cards of each column then scroll under its header, which stays visible. While a card is dragged near an edge, the board and the column scroll. On small screens a column takes most of the width and the board snaps from a column to the next one.

```typescript
import { Component } from '@angular/core';
import { KanbanColumn, KanbanModule } from '@exhaustive-ui/core/kanban';

interface Task {
    id: number;
    title: string;
}

const tasks = (from: number, count: number, prefix: string): Task[] => Array.from({ length: count }, (_, i) => ({ id: from + i, title: `${prefix} ${i + 1}` }));

@Component({
    template: `
        <div class="card">
            <p-kanban [(columns)]="columns" dataKey="id" scrollHeight="24rem" ariaLabel="Scrollable board" />
        </div>
    `,
    standalone: true,
    imports: [KanbanModule]
})
export class KanbanScrollDemo {
    columns: KanbanColumn<Task>[] = [
        { id: 'backlog', title: 'Backlog', items: tasks(1, 12, 'Story') },
        { id: 'todo', title: 'To do', items: tasks(100, 6, 'Task') },
        { id: 'doing', title: 'In progress', items: tasks(200, 3, 'Feature') },
        { id: 'review', title: 'Review', items: tasks(300, 2, 'Change') },
        { id: 'qa', title: 'QA', items: tasks(400, 2, 'Test') },
        { id: 'done', title: 'Done', items: tasks(500, 9, 'Release') }
    ];
}
```

## Template

The card template replaces the content of a card and receives the card as the implicit variable, with its column , its index and a grabbed flag, true while the card is picked up with the keyboard. The columnHeader template replaces the title and the count of a column, columnFooter adds content at its bottom and empty replaces the message of an empty column; they receive the column, its count , its limit and an overLimit flag. A card is a button that picks up the card: keep the content of the template static, without links or buttons, and open the details of a card with onCardClick .

```typescript
import { Component } from '@angular/core';
import { AvatarModule } from '@exhaustive-ui/core/avatar';
import { KanbanColumn, KanbanModule } from '@exhaustive-ui/core/kanban';
import { TagModule } from '@exhaustive-ui/core/tag';

interface Issue {
    id: string;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    tags: string[];
    assignee: { name: string; image: string };
}

@Component({
    template: `
        <div class="card">
            <p-kanban [(columns)]="columns" dataKey="id" ariaLabel="Issues">
                <ng-template #columnHeader let-column let-count="count">
                    <span class="w-2 h-2 rounded-full shrink-0" [style.background]="column.data.color" aria-hidden="true"></span>
                    <span class="font-semibold">{{ column.title }}</span>
                    <span class="ml-auto text-sm text-muted-color">{{ count }}</span>
                </ng-template>
                <ng-template #card let-issue>
                    <div class="flex flex-col gap-3">
                        <div class="flex items-center justify-between gap-2">
                            <span class="text-sm text-muted-color">{{ issue.id }}</span>
                            <p-tag [value]="issue.priority" [severity]="severity(issue.priority)" />
                        </div>
                        <span class="font-medium">{{ issue.title }}</span>
                        <div class="flex items-center justify-between gap-2">
                            <div class="flex flex-wrap gap-1">
                                @for (tag of issue.tags; track tag) {
                                    <span class="text-xs px-2 py-0.5 rounded-border bg-surface-100 dark:bg-surface-800">{{ tag }}</span>
                                }
                            </div>
                            <p-avatar [image]="issue.assignee.image" shape="circle" [ariaLabel]="issue.assignee.name" />
                        </div>
                    </div>
                </ng-template>
                <ng-template #empty>
                    <span>Drop an issue here</span>
                </ng-template>
            </p-kanban>
        </div>
    `,
    standalone: true,
    imports: [KanbanModule, AvatarModule, TagModule]
})
export class KanbanTemplateDemo {
    columns: KanbanColumn<Issue>[] = [
        {
            id: 'backlog',
            title: 'Backlog',
            data: { color: '#64748b' },
            items: [
                { id: 'EX-101', title: 'Export the report as CSV', priority: 'Low', tags: ['reports'], assignee: { name: 'Amy Elsner', image: 'https://exhaustive-ui.com/demo/avatar/amyelsner.png' } },
                { id: 'EX-102', title: 'Remember the last opened tab', priority: 'Medium', tags: ['ux'], assignee: { name: 'Asiya Javayant', image: 'https://exhaustive-ui.com/demo/avatar/asiyajavayant.png' } }
            ]
        },
        {
            id: 'doing',
            title: 'In progress',
            data: { color: '#2563eb' },
            items: [{ id: 'EX-98', title: 'Payment fails with 3-D Secure', priority: 'High', tags: ['bug', 'billing'], assignee: { name: 'Onyama Limba', image: 'https://exhaustive-ui.com/demo/avatar/onyamalimba.png' } }]
        },
        { id: 'review', title: 'Review', data: { color: '#9333ea' }, items: [] },
        {
            id: 'done',
            title: 'Done',
            data: { color: '#16a34a' },
            items: [{ id: 'EX-90', title: 'Upgrade to Angular 22', priority: 'Medium', tags: ['chore'], assignee: { name: 'Ioni Bowcher', image: 'https://exhaustive-ui.com/demo/avatar/ionibowcher.png' } }]
        }
    ];

    severity(priority: Issue['priority']) {
        return priority === 'High' ? 'danger' : priority === 'Medium' ? 'warn' : 'secondary';
    }
}
```

## Kanban

Kanban is a task board: cards are dragged within a column and from a column to another one, with the pointer or the keyboard. It supports work in progress limits, drop rules, collapsible and reorderable columns, and announces every move to screen readers.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | KanbanPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| columns | KanbanColumn<T>[] | [] | Columns of the board with their cards. The board updates it with new arrays after every move, so it can be bound two-way with  `[(columns)]` . |
| dataKey | string | - | Name of the field that uniquely identifies a card. Without it, cards are identified by reference. |
| itemLabel | string \| ((item: T) => string) | 'title' | Name of the field, or a function, that gives the text of a card: shown by the default card and used in the announcements. |
| canDrop | KanbanCanDrop<T> | - | Decides whether a card can move from a column to another one. Moves within a column are always allowed. |
| reorderColumns | boolean | false | Whether columns can be reordered with a drag handle in their header. |
| collapsible | boolean | false | Whether columns have a button to collapse them. |
| showAddButton | boolean | false | Whether to show an add card button at the bottom of every column. |
| disabled | boolean | false | Whether nothing can be dragged. |
| scrollHeight | string | - | Height of the board, such as  `30rem` . The cards of a column then scroll under its header. |
| dragStartDelay | DragStartDelay | { touch: 250, mouse: 0 } | Delay before a drag starts, in milliseconds. The touch delay lets the board scroll on mobile. |
| labels | Partial<KanbanLabels> | - | Texts of the component, merged with the English defaults. |
| ariaLabel | string | - | Accessible name of the board. |
| ariaLabelledBy | string | - | Identifier of the element that labels the board. |

### Emits

| Name | Parameters | Description |
|------|------------|-------------|
| onCardMove | event: KanbanCardMoveEvent<T | Callback to invoke when a card is moved, after the columns are updated. |
| onCardClick | event: KanbanCardClickEvent<T | Callback to invoke when a card is clicked. |
| onColumnReorder | event: KanbanColumnReorderEvent<T | Callback to invoke when a column is moved, after the columns are updated. |
| onAddCard | event: KanbanAddCardEvent<T | Callback to invoke when the add card button of a column is clicked. |
| onColumnToggle | event: KanbanColumnToggleEvent<T | Callback to invoke when a column is collapsed or expanded, after the columns are updated. |

### Templates

| Name | Type | Description |
|------|------|-------------|
| card | TemplateRef<KanbanCardTemplateContext<T>> | Custom content of a card. |
| columnHeader | TemplateRef<KanbanColumnTemplateContext<T>> | Custom title and count of a column header. |
| columnFooter | TemplateRef<KanbanColumnTemplateContext<T>> | Custom footer of a column, above the add card button. |
| empty | TemplateRef<KanbanColumnTemplateContext<T>> | Custom content of an empty column. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| root | PassThroughOption<HTMLElement, I> | Used to pass attributes to the root's DOM element. |
| board | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the horizontally scrolling board that holds the columns. |
| column | PassThroughOption<HTMLElement, I> | Used to pass attributes to a column's DOM element. |
| columnHeader | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to a column header's DOM element. |
| columnTitle | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to a column title's DOM element. |
| columnCount | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the card count of a column. |
| columnHandle | PassThroughOption<HTMLButtonElement, I> | Used to pass attributes to the drag handle button of a column. |
| columnToggle | PassThroughOption<HTMLButtonElement, I> | Used to pass attributes to the collapse button of a column. |
| columnContent | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the list of cards of a column. |
| columnFooter | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to a column footer's DOM element. |
| cardItem | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the list item that holds a card. |
| card | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to a card's DOM element. |
| empty | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the empty message of a column. |
| addButton | PassThroughOption<HTMLButtonElement, I> | Used to pass attributes to the add card button of a column. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-kanban | Class name of the root element |
| p-kanban-board | Class name of the scrolling board |
| p-kanban-column | Class name of a column |
| p-kanban-column-header | Class name of a column header |
| p-kanban-column-title | Class name of a column title |
| p-kanban-column-count | Class name of the card count of a column |
| p-kanban-column-handle | Class name of the drag handle of a column |
| p-kanban-column-toggle | Class name of the collapse button of a column |
| p-kanban-column-content | Class name of the card list of a column |
| p-kanban-column-footer | Class name of a column footer |
| p-kanban-card-item | Class name of the list item that holds a card |
| p-kanban-card | Class name of a card |
| p-kanban-empty | Class name of the empty message of a column |
| p-kanban-add-button | Class name of the add card button |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| kanban.transition.duration | --p-kanban-transition-duration | Transition duration |
| kanban.board.gap | --p-kanban-board-gap | Gap between the columns |
| kanban.board.padding | --p-kanban-board-padding | Padding of the board, around the columns |
| kanban.column.background | --p-kanban-column-background | Background of a column |
| kanban.column.border.color | --p-kanban-column-border-color | Border color of a column |
| kanban.column.border.radius | --p-kanban-column-border-radius | Border radius of a column |
| kanban.column.width | --p-kanban-column-width | Width of a column |
| kanban.column.min.width | --p-kanban-column-min-width | Minimum width of a column |
| kanban.column.collapsed.width | --p-kanban-column-collapsed-width | Width of a collapsed column |
| kanban.column.padding | --p-kanban-column-padding | Padding of a column |
| kanban.column.gap | --p-kanban-column-gap | Gap between the cards |
| kanban.column.over.limit.border.color | --p-kanban-column-over-limit-border-color | Border color of a column holding more cards than its limit |
| kanban.column.over.limit.background | --p-kanban-column-over-limit-background | Background of a column holding more cards than its limit |
| kanban.column.refused.border.color | --p-kanban-column-refused-border-color | Border color of a column that refuses the dragged card |
| kanban.column.drop.target.background | --p-kanban-column-drop-target-background | Background of the card list while a card is dragged over it |
| kanban.column.collapsed.hover.background | --p-kanban-column-collapsed-hover-background | Background of a collapsed column on hover |
| kanban.column.header.padding | --p-kanban-column-header-padding | Padding of a column header |
| kanban.column.header.gap | --p-kanban-column-header-gap | Gap between the items of a column header |
| kanban.column.header.color | --p-kanban-column-header-color | Text color of a column header |
| kanban.column.header.font.weight | --p-kanban-column-header-font-weight | Font weight of a column title |
| kanban.column.count.padding | --p-kanban-column-count-padding | Padding of a card count |
| kanban.column.count.border.radius | --p-kanban-column-count-border-radius | Border radius of a card count |
| kanban.column.count.font.size | --p-kanban-column-count-font-size | Font size of a card count |
| kanban.column.count.font.weight | --p-kanban-column-count-font-weight | Font weight of a card count |
| kanban.column.count.background | --p-kanban-column-count-background | Background of a card count |
| kanban.column.count.color | --p-kanban-column-count-color | Text color of a card count |
| kanban.column.count.full.background | --p-kanban-column-count-full-background | Background of a card count at the limit |
| kanban.column.count.full.color | --p-kanban-column-count-full-color | Text color of a card count at the limit |
| kanban.column.count.over.limit.background | --p-kanban-column-count-over-limit-background | Background of a card count over the limit |
| kanban.column.count.over.limit.color | --p-kanban-column-count-over-limit-color | Text color of a card count over the limit |
| kanban.column.action.size | --p-kanban-column-action-size | Size of the drag handle and collapse buttons |
| kanban.column.action.border.radius | --p-kanban-column-action-border-radius | Border radius of the drag handle and collapse buttons |
| kanban.column.action.color | --p-kanban-column-action-color | Color of the drag handle and collapse buttons |
| kanban.column.action.hover.color | --p-kanban-column-action-hover-color | Color of the drag handle and collapse buttons while hovered |
| kanban.column.action.hover.background | --p-kanban-column-action-hover-background | Background of the drag handle and collapse buttons while hovered |
| kanban.column.action.grabbed.background | --p-kanban-column-action-grabbed-background | Background of a drag handle while its column is picked up |
| kanban.column.action.grabbed.color | --p-kanban-column-action-grabbed-color | Color of a drag handle while its column is picked up |
| kanban.column.action.focus.ring.width | --p-kanban-column-action-focus-ring-width | Focus ring width of the column buttons |
| kanban.column.action.focus.ring.style | --p-kanban-column-action-focus-ring-style | Focus ring style of the column buttons |
| kanban.column.action.focus.ring.color | --p-kanban-column-action-focus-ring-color | Focus ring color of the column buttons |
| kanban.column.action.focus.ring.offset | --p-kanban-column-action-focus-ring-offset | Focus ring offset of the column buttons |
| kanban.column.action.focus.ring.shadow | --p-kanban-column-action-focus-ring-shadow | Focus ring shadow of the column buttons |
| kanban.card.background | --p-kanban-card-background | Background of a card |
| kanban.card.border.color | --p-kanban-card-border-color | Border color of a card |
| kanban.card.hover.border.color | --p-kanban-card-hover-border-color | Border color of a card while hovered |
| kanban.card.border.radius | --p-kanban-card-border-radius | Border radius of a card |
| kanban.card.padding | --p-kanban-card-padding | Padding of a card |
| kanban.card.color | --p-kanban-card-color | Text color of a card |
| kanban.card.shadow | --p-kanban-card-shadow | Shadow of a card |
| kanban.card.grabbed.border.color | --p-kanban-card-grabbed-border-color | Border color of a card picked up with the keyboard |
| kanban.card.grabbed.shadow | --p-kanban-card-grabbed-shadow | Shadow of a card picked up with the keyboard |
| kanban.card.disabled.background | --p-kanban-card-disabled-background | Background of a card in a disabled column |
| kanban.card.disabled.color | --p-kanban-card-disabled-color | Text color of a card in a disabled column |
| kanban.card.focus.ring.width | --p-kanban-card-focus-ring-width | Focus ring width of a card |
| kanban.card.focus.ring.style | --p-kanban-card-focus-ring-style | Focus ring style of a card |
| kanban.card.focus.ring.color | --p-kanban-card-focus-ring-color | Focus ring color of a card |
| kanban.card.focus.ring.offset | --p-kanban-card-focus-ring-offset | Focus ring offset of a card |
| kanban.card.focus.ring.shadow | --p-kanban-card-focus-ring-shadow | Focus ring shadow of a card |
| kanban.placeholder.background | --p-kanban-placeholder-background | Background of the drop placeholder |
| kanban.placeholder.border.color | --p-kanban-placeholder-border-color | Border color of the drop placeholder |
| kanban.placeholder.border.radius | --p-kanban-placeholder-border-radius | Border radius of the drop placeholder |
| kanban.preview.shadow | --p-kanban-preview-shadow | Shadow of the dragged card or column |
| kanban.empty.padding | --p-kanban-empty-padding | Padding of the empty message |
| kanban.empty.color | --p-kanban-empty-color | Text color of the empty message |
| kanban.empty.font.size | --p-kanban-empty-font-size | Font size of the empty message |
| kanban.empty.border.color | --p-kanban-empty-border-color | Border color of the empty message |
| kanban.empty.border.radius | --p-kanban-empty-border-radius | Border radius of the empty message |
| kanban.add.button.padding | --p-kanban-add-button-padding | Padding of the add card button |
| kanban.add.button.gap | --p-kanban-add-button-gap | Gap between the icon and the text of the add card button |
| kanban.add.button.border.radius | --p-kanban-add-button-border-radius | Border radius of the add card button |
| kanban.add.button.color | --p-kanban-add-button-color | Text color of the add card button |
| kanban.add.button.hover.color | --p-kanban-add-button-hover-color | Text color of the add card button while hovered |
| kanban.add.button.hover.background | --p-kanban-add-button-hover-background | Background of the add card button while hovered |
| kanban.add.button.font.weight | --p-kanban-add-button-font-weight | Font weight of the add card button |
| kanban.add.button.focus.ring.width | --p-kanban-add-button-focus-ring-width | Focus ring width of the add card button |
| kanban.add.button.focus.ring.style | --p-kanban-add-button-focus-ring-style | Focus ring style of the add card button |
| kanban.add.button.focus.ring.color | --p-kanban-add-button-focus-ring-color | Focus ring color of the add card button |
| kanban.add.button.focus.ring.offset | --p-kanban-add-button-focus-ring-offset | Focus ring offset of the add card button |
| kanban.add.button.focus.ring.shadow | --p-kanban-add-button-focus-ring-shadow | Focus ring shadow of the add card button |

