import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { KanbanCardMoveEvent, KanbanColumn, KanbanColumnReorderEvent } from '@exhaustive-ui/core/types/kanban';
import { Kanban } from './kanban';

interface Task {
    id: number;
    title: string;
    priority?: string;
}

const board = (): KanbanColumn<Task>[] => [
    {
        id: 'todo',
        title: 'To do',
        items: [
            { id: 1, title: 'Task A' },
            { id: 2, title: 'Task B' },
            { id: 3, title: 'Task C' }
        ]
    },
    { id: 'doing', title: 'In progress', items: [{ id: 4, title: 'Task D' }], limit: 2 },
    { id: 'review', title: 'Review', items: [], collapsed: false },
    { id: 'done', title: 'Done', items: [{ id: 5, title: 'Task E' }] }
];

const flush = () => new Promise((resolve) => setTimeout(resolve));

const key = (el: Element, k: string, init: KeyboardEventInit = {}) => {
    const event = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...init });
    el.dispatchEvent(event);
    return event;
};

@Component({
    standalone: true,
    imports: [Kanban],
    template: `
        <p-kanban [(columns)]="columns" dataKey="id" (onCardMove)="moves.push($event)" (onColumnReorder)="reorders.push($event)" [reorderColumns]="reorder()">
            <ng-template #card let-item let-column="column" let-index="index">
                <span class="custom-card">{{ item.title }} - {{ column.id }} - {{ index }}</span>
            </ng-template>
            <ng-template #columnHeader let-column let-count="count" let-limit="limit">
                <span class="custom-header">{{ column.title }} ({{ count }}{{ limit ? '/' + limit : '' }})</span>
            </ng-template>
            <ng-template #columnFooter let-column>
                <span class="custom-footer">{{ column.id }} footer</span>
            </ng-template>
            <ng-template #empty let-column>
                <span class="custom-empty">Nothing in {{ column.title }}</span>
            </ng-template>
        </p-kanban>
    `
})
class TemplateHost {
    columns = board();
    moves: KanbanCardMoveEvent<Task>[] = [];
    reorders: KanbanColumnReorderEvent<Task>[] = [];
    reorder = signal(false);
}

describe('Kanban', () => {
    let fixture: ComponentFixture<Kanban<Task>>;
    let component: Kanban<Task>;
    let host: HTMLElement;

    const render = async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        await flush();
        fixture.detectChanges();
    };

    const columnEls = () => Array.from(host.querySelectorAll<HTMLElement>('.p-kanban-column'));
    const cards = (columnIndex: number) => Array.from(columnEls()[columnIndex].querySelectorAll<HTMLElement>('.p-kanban-card'));
    const cardTexts = (columnIndex: number) => cards(columnIndex).map((card) => card.textContent!.trim());
    const live = () => host.querySelector('[aria-live]')!.textContent!.replace(/ /g, '').trim();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Kanban, TemplateHost],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(Kanban<Task>);
        component = fixture.componentInstance;
        host = fixture.nativeElement;
        fixture.componentRef.setInput('columns', board());
        fixture.componentRef.setInput('dataKey', 'id');
        document.body.appendChild(host);
        await render();
    });

    afterEach(() => {
        host.remove();
    });

    describe('Rendering', () => {
        it('should render the columns and their cards', () => {
            expect(host.classList).toContain('p-kanban');
            expect(columnEls().length).toBe(4);
            expect(host.querySelectorAll('.p-kanban-column-title')[1].textContent).toBe('In progress');
            expect(cardTexts(0)).toEqual(['Task A', 'Task B', 'Task C']);
            expect(cardTexts(3)).toEqual(['Task E']);
        });

        it('should show the count, and the limit as "1 / 2"', () => {
            const counts = host.querySelectorAll('.p-kanban-column-count');
            expect(counts[0].querySelector('[aria-hidden]')!.textContent).toBe('3');
            expect(counts[1].querySelector('[aria-hidden]')!.textContent).toBe('1 / 2');
            expect(counts[1].querySelector('.p-hidden-accessible')!.textContent).toBe('1 of 2 cards');
        });

        it('should mark full and over limit columns', async () => {
            const columns = board();
            columns[1].items.push({ id: 6, title: 'Task F' });
            fixture.componentRef.setInput('columns', columns);
            await render();
            expect(host.querySelectorAll('.p-kanban-column-count')[1].classList).toContain('p-kanban-column-count-full');
            columns[1] = { ...columns[1], items: [...columns[1].items, { id: 7, title: 'Task G' }] };
            fixture.componentRef.setInput('columns', [...columns]);
            await render();
            expect(columnEls()[1].classList).toContain('p-kanban-column-over-limit');
            expect(host.querySelectorAll('.p-kanban-column-count')[1].querySelector('.p-hidden-accessible')!.textContent).toBe('3 of 2 cards, over the limit');
        });

        it('should show the empty message in an empty column', () => {
            expect(columnEls()[2].querySelector('.p-kanban-empty')!.textContent!.trim()).toBe('No cards');
            const content = columnEls()[2].querySelector('.p-kanban-column-content')!;
            expect(content.getAttribute('role')).toBe('group');
            expect(content.getAttribute('aria-label')).toBe('Review, 0 cards');
        });

        it('should use itemLabel as a field or a function', async () => {
            fixture.componentRef.setInput('itemLabel', (item: Task) => `#${item.id} ${item.title}`);
            await render();
            expect(cardTexts(0)[0]).toBe('#1 Task A');
            fixture.componentRef.setInput('itemLabel', 'id');
            await render();
            expect(cardTexts(0)[0]).toBe('1');
        });

        it('should apply scrollHeight to the board', async () => {
            fixture.componentRef.setInput('scrollHeight', '20rem');
            await render();
            expect(host.querySelector<HTMLElement>('.p-kanban-board')!.style.height).toBe('20rem');
            expect(host.classList).toContain('p-kanban-scrollable');
        });

        it('should work without dataKey, by reference', async () => {
            fixture.componentRef.setInput('dataKey', undefined);
            await render();
            expect(cardTexts(0)).toEqual(['Task A', 'Task B', 'Task C']);
            key(cards(0)[0], ' ');
            key(cards(0)[0], 'ArrowDown');
            await render();
            key(cards(0)[1], 'Enter');
            await render();
            expect(component.columns()[0].items.map((item) => item.title)).toEqual(['Task B', 'Task A', 'Task C']);
        });
    });

    describe('Accessibility', () => {
        it('should render columns as labelled regions with a list of cards', () => {
            const column = columnEls()[0];
            expect(column.getAttribute('role')).toBe('region');
            const title = host.querySelector('#' + column.getAttribute('aria-labelledby'));
            expect(title!.textContent).toContain('To do');
            const list = column.querySelector('[role="list"]')!;
            expect(list.getAttribute('aria-label')).toBe('To do, 3 cards');
            expect(list.querySelectorAll('[role="listitem"]').length).toBe(3);
        });

        it('should make cards focusable buttons described by the instructions', () => {
            const card = cards(0)[0];
            expect(card.getAttribute('role')).toBe('button');
            expect(card.getAttribute('tabindex')).toBe('0');
            expect(card.getAttribute('aria-pressed')).toBe('false');
            const instructions = host.querySelector('#' + card.getAttribute('aria-describedby'));
            expect(instructions!.textContent).toContain('Space or Enter');
        });

        it('should label the board with ariaLabel', async () => {
            expect(host.getAttribute('role')).toBeNull();
            fixture.componentRef.setInput('ariaLabel', 'Sprint board');
            await render();
            expect(host.getAttribute('role')).toBe('group');
            expect(host.getAttribute('aria-label')).toBe('Sprint board');
        });

        it('should replace texts with labels', async () => {
            fixture.componentRef.setInput('labels', { empty: 'Rien', pickedUp: 'Pris {0}' });
            await render();
            expect(columnEls()[2].querySelector('.p-kanban-empty')!.textContent!.trim()).toBe('Rien');
            key(cards(0)[0], ' ');
            await render();
            expect(live()).toBe('Pris Task A');
        });
    });

    describe('Keyboard dragging', () => {
        it('should pick up a card with Space and announce its position', async () => {
            key(cards(0)[1], ' ');
            await render();
            expect(cards(0)[1].getAttribute('aria-pressed')).toBe('true');
            expect(cards(0)[1].classList).toContain('p-kanban-card-grabbed');
            expect(live()).toBe('Picked up Task B, position 2 of 3 in To do');
        });

        it('should move a card within its column with the arrow keys and drop it with Enter', async () => {
            const moves: KanbanCardMoveEvent<Task>[] = [];
            component.onCardMove.subscribe((event) => moves.push(event));
            cards(0)[0].focus();
            key(cards(0)[0], 'Enter');
            await render();
            key(cards(0)[0], 'ArrowDown');
            await render();
            expect(cardTexts(0)).toEqual(['Task B', 'Task A', 'Task C']);
            expect(live()).toBe('Moved to To do, position 2 of 3');
            expect(component.columns()[0].items[0].title).toBe('Task A');
            expect(document.activeElement!.textContent!.trim()).toBe('Task A');
            key(cards(0)[1], 'Enter');
            await render();
            expect(component.columns()[0].items.map((item) => item.title)).toEqual(['Task B', 'Task A', 'Task C']);
            expect(moves.length).toBe(1);
            expect(moves[0]).toEqual(expect.objectContaining({ fromIndex: 0, toIndex: 1 }));
            expect(moves[0].fromColumn.id).toBe('todo');
            expect(moves[0].toColumn.id).toBe('todo');
            expect(moves[0].item.title).toBe('Task A');
            expect(live()).toBe('Dropped Task A in To do, position 2 of 3');
        });

        it('should move a card to the next column with ArrowRight and keep the focus on it', async () => {
            const moves: KanbanCardMoveEvent<Task>[] = [];
            component.onCardMove.subscribe((event) => moves.push(event));
            cards(0)[2].focus();
            key(cards(0)[2], ' ');
            await render();
            key(cards(0)[2], 'ArrowRight');
            await render();
            expect(cardTexts(0)).toEqual(['Task A', 'Task B']);
            expect(cardTexts(1)).toEqual(['Task D', 'Task C']);
            expect(live()).toBe('Moved to In progress, position 2 of 2');
            expect(document.activeElement!.textContent!.trim()).toBe('Task C');
            key(cards(1)[1], ' ');
            await render();
            expect(moves[0]).toEqual(expect.objectContaining({ fromIndex: 2, toIndex: 1 }));
            expect(moves[0].fromColumn.items.length).toBe(2);
            expect(moves[0].toColumn.items.map((item) => item.title)).toEqual(['Task D', 'Task C']);
            expect(moves[0].columns).toBe(component.columns());
        });

        it('should emit onCardMove after the model is updated', async () => {
            let seen: number | undefined;
            component.onCardMove.subscribe(() => (seen = component.columns()[0].items.length));
            key(cards(0)[0], ' ');
            key(cards(0)[0], 'ArrowRight');
            await render();
            key(cards(1)[0], ' ');
            expect(seen).toBe(2);
        });

        it('should restore the card with Escape', async () => {
            const moves: KanbanCardMoveEvent<Task>[] = [];
            component.onCardMove.subscribe((event) => moves.push(event));
            cards(0)[0].focus();
            key(cards(0)[0], ' ');
            await render();
            key(cards(0)[0], 'ArrowRight');
            await render();
            expect(cardTexts(1)).toContain('Task A');
            key(cards(1)[0], 'Escape');
            await render();
            expect(cardTexts(0)).toEqual(['Task A', 'Task B', 'Task C']);
            expect(cardTexts(1)).toEqual(['Task D']);
            expect(moves.length).toBe(0);
            expect(live()).toBe('Cancelled, Task A returned to To do, position 1 of 3');
            expect(document.activeElement!.textContent!.trim()).toBe('Task A');
        });

        it('should refuse a column at its limit and announce it', async () => {
            key(cards(0)[0], ' ');
            key(cards(0)[0], 'ArrowRight');
            await render();
            expect(cardTexts(1)).toEqual(['Task A', 'Task D']);
            key(cards(1)[0], 'Enter');
            await render();
            expect(component.columns()[1].items.length).toBe(2);
            key(cards(0)[0], ' ');
            await render();
            key(cards(0)[0], 'ArrowRight');
            await render();
            expect(live()).toBe('In progress is full, 2 of 2 cards');
            expect(cardTexts(0)).toEqual(['Task B', 'Task C']);
            expect(cardTexts(1)).toEqual(['Task A', 'Task D']);
        });

        it('should refuse a move rejected by canDrop', async () => {
            const canDrop = vi.fn((item: Task, from: KanbanColumn<Task>, to: KanbanColumn<Task>) => !(from.id === 'todo' && to.id === 'doing'));
            fixture.componentRef.setInput('canDrop', canDrop);
            await render();
            key(cards(0)[0], ' ');
            key(cards(0)[0], 'ArrowRight');
            await render();
            expect(canDrop).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }), expect.objectContaining({ id: 'todo' }), expect.objectContaining({ id: 'doing' }));
            expect(live()).toBe('Task A can not be moved to In progress');
            expect(cardTexts(0)).toContain('Task A');
        });

        it('should skip collapsed columns', async () => {
            const columns = board();
            columns[1].collapsed = true;
            fixture.componentRef.setInput('columns', columns);
            await render();
            key(cards(0)[0], ' ');
            key(cards(0)[0], 'ArrowRight');
            await render();
            expect(cardTexts(2)).toEqual(['Task A']);
            expect(live()).toBe('Moved to Review, position 1 of 1');
        });

        it('should move to the top and the bottom with Home and End', async () => {
            key(cards(0)[0], ' ');
            key(cards(0)[0], 'End');
            await render();
            expect(cardTexts(0)).toEqual(['Task B', 'Task C', 'Task A']);
            key(cards(0)[2], 'Home');
            await render();
            expect(cardTexts(0)).toEqual(['Task A', 'Task B', 'Task C']);
        });

        it('should stop at the first and last positions', async () => {
            key(cards(0)[0], ' ');
            key(cards(0)[0], 'ArrowUp');
            await render();
            expect(cardTexts(0)).toEqual(['Task A', 'Task B', 'Task C']);
            expect(live()).toBe('Moved to To do, position 1 of 3');
            key(cards(0)[0], 'ArrowLeft');
            await render();
            expect(cardTexts(0)).toEqual(['Task A', 'Task B', 'Task C']);
        });

        it('should flip ArrowLeft and ArrowRight in RTL', async () => {
            host.setAttribute('dir', 'rtl');
            const before = cardTexts(1);
            key(cards(0)[0], ' ');
            key(cards(0)[0], 'ArrowLeft');
            await render();
            expect(cardTexts(1)).toEqual(['Task A', ...before]);
        });

        it('should cancel when the card loses the focus', async () => {
            const outside = document.createElement('button');
            document.body.appendChild(outside);
            cards(0)[0].focus();
            key(cards(0)[0], ' ');
            await render();
            outside.focus();
            await render();
            expect(component.grab()).toBeNull();
            expect(live()).toContain('Cancelled');
            outside.remove();
        });

        it('should not pick up cards of a disabled column or board', async () => {
            const columns = board();
            columns[0].disabled = true;
            fixture.componentRef.setInput('columns', columns);
            await render();
            expect(cards(0)[0].getAttribute('aria-disabled')).toBe('true');
            expect(cards(0)[0].hasAttribute('aria-describedby')).toBe(false);
            key(cards(0)[0], ' ');
            expect(component.grab()).toBeNull();
            fixture.componentRef.setInput('columns', board());
            fixture.componentRef.setInput('disabled', true);
            await render();
            key(cards(0)[0], ' ');
            expect(component.grab()).toBeNull();
        });

        it('should refuse moving a card into a disabled column', async () => {
            const columns = board();
            columns[1].disabled = true;
            fixture.componentRef.setInput('columns', columns);
            await render();
            key(cards(0)[0], ' ');
            key(cards(0)[0], 'ArrowRight');
            await render();
            expect(live()).toBe('Task A can not be moved to In progress');
        });

        it('should move the focus between cards with the arrow keys when nothing is picked up', async () => {
            cards(0)[0].focus();
            key(cards(0)[0], 'ArrowDown');
            expect(document.activeElement).toBe(cards(0)[1]);
            key(cards(0)[1], 'ArrowRight');
            expect(document.activeElement).toBe(cards(1)[0]);
            key(cards(1)[0], 'ArrowRight');
            expect(document.activeElement).toBe(cards(3)[0]);
            key(cards(3)[0], 'ArrowUp');
            expect(document.activeElement).toBe(cards(3)[0]);
        });

        it('should ignore keys coming from elements inside a card', async () => {
            const inner = document.createElement('span');
            cards(0)[0].appendChild(inner);
            key(inner, ' ');
            expect(component.grab()).toBeNull();
        });
    });

    describe('Pointer dragging', () => {
        const drop = (fromId: string, previousIndex: number, toId: string, currentIndex: number, item: Task) =>
            component.onCardDrop({ previousContainer: { data: fromId }, container: { data: toId }, previousIndex, currentIndex, item: { data: item } } as any);

        it('should move a card to another column and emit onCardMove', () => {
            const moves: KanbanCardMoveEvent<Task>[] = [];
            component.onCardMove.subscribe((event) => moves.push(event));
            drop('todo', 1, 'done', 0, component.columns()[0].items[1]);
            expect(component.columns()[0].items.map((item) => item.id)).toEqual([1, 3]);
            expect(component.columns()[3].items.map((item) => item.id)).toEqual([2, 5]);
            expect(moves[0]).toEqual(expect.objectContaining({ fromIndex: 1, toIndex: 0 }));
            expect(live()).toBe('');
        });

        it('should update the columns immutably', () => {
            const before = component.columns();
            drop('todo', 0, 'todo', 2, before[0].items[0]);
            const after = component.columns();
            expect(after).not.toBe(before);
            expect(after[0]).not.toBe(before[0]);
            expect(after[3]).toBe(before[3]);
            expect(before[0].items.map((item) => item.id)).toEqual([1, 2, 3]);
            expect(after[0].items.map((item) => item.id)).toEqual([2, 3, 1]);
        });

        it('should ignore a drop at the same place', () => {
            const spy = vi.fn();
            component.onCardMove.subscribe(spy);
            const before = component.columns();
            drop('todo', 1, 'todo', 1, before[0].items[1]);
            expect(component.columns()).toBe(before);
            expect(spy).not.toHaveBeenCalled();
        });

        it('should refuse to enter a full column, a disabled column and a column rejected by canDrop', async () => {
            const item = component.columns()[0].items[0];
            const predicate = (to: string) => component.enterPredicate({ data: item, dropContainer: { data: 'todo' } } as any, { data: to } as any);
            expect(predicate('doing')).toBe(true);
            expect(predicate('todo')).toBe(true);
            const columns = board();
            columns[1].items.push({ id: 6, title: 'Task F' });
            columns[3].disabled = true;
            fixture.componentRef.setInput('columns', columns);
            fixture.componentRef.setInput('canDrop', (_: Task, __: KanbanColumn, to: KanbanColumn) => to.id !== 'review');
            await render();
            expect(predicate('doing')).toBe(false);
            expect(predicate('done')).toBe(false);
            expect(predicate('review')).toBe(false);
        });

        it('should show and announce a refused column while a card is dragged over it', async () => {
            const columns = board();
            columns[1].items.push({ id: 6, title: 'Task F' });
            fixture.componentRef.setInput('columns', columns);
            await render();
            const target = cards(1)[0];
            const rect = target.getBoundingClientRect();
            component.onDragStarted();
            component.onCardDragMoved({ pointerPosition: { x: rect.left + 5, y: rect.top + 5 }, source: { data: columns[0].items[0], dropContainer: { data: 'todo' } } } as any);
            await render();
            expect(columnEls()[1].classList).toContain('p-kanban-column-refused');
            expect(live()).toBe('In progress is full, 2 of 2 cards');
            expect(host.classList).toContain('p-kanban-dragging');
            component.onDragEnded();
            await render();
            expect(columnEls()[1].classList).not.toContain('p-kanban-column-refused');
            expect(host.classList).not.toContain('p-kanban-dragging');
        });

        it('should put the card back when it is released over a column that refuses it', async () => {
            const columns = board();
            columns[1].items.push({ id: 6, title: 'Task F' });
            fixture.componentRef.setInput('columns', columns);
            await render();
            const spy = vi.fn();
            component.onCardMove.subscribe(spy);
            const rect = cards(1)[0].getBoundingClientRect();
            component.onDragStarted();
            component.onCardDragMoved({ pointerPosition: { x: rect.left + 5, y: rect.top + 5 }, source: { data: columns[0].items[0], dropContainer: { data: 'todo' } } } as any);
            component.onDragEnded();
            drop('todo', 0, 'review', 0, columns[0].items[0]);
            expect(spy).not.toHaveBeenCalled();
            expect(component.columns()).toBe(columns);
            component.onDragStarted();
            component.onDragEnded();
            drop('todo', 0, 'review', 0, columns[0].items[0]);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('should not emit onCardClick right after a drag', () => {
            const spy = vi.fn();
            component.onCardClick.subscribe(spy);
            component.onDragEnded();
            cards(0)[0].click();
            expect(spy).not.toHaveBeenCalled();
        });

        it('should cancel a keyboard move when a pointer drag starts', async () => {
            key(cards(0)[0], ' ');
            key(cards(0)[0], 'ArrowRight');
            await render();
            component.onDragStarted();
            await render();
            expect(component.grab()).toBeNull();
            expect(cardTexts(0)).toEqual(['Task A', 'Task B', 'Task C']);
        });

        it('should apply the drag start delay', async () => {
            expect(component.dragStartDelay()).toEqual({ touch: 250, mouse: 0 });
        });
    });

    describe('Columns', () => {
        it('should emit onCardClick with the card and its column', () => {
            const spy = vi.fn();
            component.onCardClick.subscribe(spy);
            cards(3)[0].click();
            expect(spy).toHaveBeenCalledWith(expect.objectContaining({ item: expect.objectContaining({ id: 5 }), column: expect.objectContaining({ id: 'done' }) }));
        });

        it('should collapse and expand a column', async () => {
            const spy = vi.fn();
            component.onColumnToggle.subscribe(spy);
            expect(host.querySelector('.p-kanban-column-toggle')).toBeNull();
            fixture.componentRef.setInput('collapsible', true);
            await render();
            const toggle = columnEls()[0].querySelector<HTMLButtonElement>('.p-kanban-column-toggle')!;
            expect(toggle.getAttribute('aria-expanded')).toBe('true');
            expect(toggle.getAttribute('aria-label')).toBe('Collapse To do');
            expect(host.querySelector('#' + toggle.getAttribute('aria-controls'))).toBe(columnEls()[0].querySelector('[role="list"]'));
            toggle.click();
            await render();
            expect(component.columns()[0].collapsed).toBe(true);
            expect(columnEls()[0].classList).toContain('p-kanban-column-collapsed');
            expect(columnEls()[0].querySelector('[role="list"]')).toBeNull();
            const collapsedToggle = columnEls()[0].querySelector<HTMLButtonElement>('.p-kanban-column-toggle')!;
            expect(collapsedToggle.getAttribute('aria-expanded')).toBe('false');
            expect(collapsedToggle.getAttribute('aria-label')).toBe('Expand To do');
            expect(spy).toHaveBeenCalledWith(expect.objectContaining({ collapsed: true, column: expect.objectContaining({ id: 'todo', collapsed: true }) }));
            collapsedToggle.click();
            await render();
            expect(cards(0).length).toBe(3);
        });

        it('should show the add card button and emit onAddCard', async () => {
            const spy = vi.fn();
            component.onAddCard.subscribe(spy);
            expect(host.querySelector('.p-kanban-add-button')).toBeNull();
            fixture.componentRef.setInput('showAddButton', true);
            await render();
            const buttons = host.querySelectorAll<HTMLButtonElement>('.p-kanban-add-button');
            expect(buttons.length).toBe(4);
            expect(buttons[0].getAttribute('aria-label')).toBe('Add card to To do');
            expect(buttons[0].textContent!.trim()).toBe('Add card');
            buttons[3].click();
            expect(spy).toHaveBeenCalledWith({ column: expect.objectContaining({ id: 'done' }) });
        });

        it('should disable the add card button of a full column', async () => {
            const columns = board();
            columns[1].items.push({ id: 6, title: 'Task F' });
            fixture.componentRef.setInput('columns', columns);
            fixture.componentRef.setInput('showAddButton', true);
            await render();
            const buttons = host.querySelectorAll<HTMLButtonElement>('.p-kanban-add-button');
            expect(buttons[0].disabled).toBe(false);
            expect(buttons[1].disabled).toBe(true);
        });

        it('should reorder columns with the keyboard', async () => {
            const spy = vi.fn();
            component.onColumnReorder.subscribe(spy);
            expect(host.querySelector('.p-kanban-column-handle')).toBeNull();
            fixture.componentRef.setInput('reorderColumns', true);
            await render();
            let handle = columnEls()[0].querySelector<HTMLButtonElement>('.p-kanban-column-handle')!;
            expect(handle.getAttribute('aria-label')).toBe('Move column To do');
            expect(host.querySelector('#' + handle.getAttribute('aria-describedby'))!.textContent).toContain('left and right');
            handle.focus();
            key(handle, 'Enter');
            await render();
            expect(handle.getAttribute('aria-pressed')).toBe('true');
            expect(live()).toBe('Picked up column To do, position 1 of 4');
            key(handle, 'ArrowRight');
            await render();
            expect(columnEls()[1].querySelector('.p-kanban-column-title')!.textContent).toBe('To do');
            expect(live()).toBe('Column moved to position 2 of 4');
            handle = columnEls()[1].querySelector<HTMLButtonElement>('.p-kanban-column-handle')!;
            expect(document.activeElement).toBe(handle);
            key(handle, ' ');
            await render();
            expect(component.columns().map((column) => column.id)).toEqual(['doing', 'todo', 'review', 'done']);
            expect(spy).toHaveBeenCalledWith(expect.objectContaining({ fromIndex: 0, toIndex: 1, column: expect.objectContaining({ id: 'todo' }) }));
            expect(live()).toBe('Dropped column To do at position 2 of 4');
        });

        it('should cancel a column move with Escape', async () => {
            fixture.componentRef.setInput('reorderColumns', true);
            await render();
            const handle = columnEls()[0].querySelector<HTMLButtonElement>('.p-kanban-column-handle')!;
            handle.focus();
            key(handle, ' ');
            key(handle, 'End');
            await render();
            expect(columnEls()[3].querySelector('.p-kanban-column-title')!.textContent).toBe('To do');
            key(columnEls()[3].querySelector('.p-kanban-column-handle')!, 'Escape');
            await render();
            expect(component.columns().map((column) => column.id)).toEqual(['todo', 'doing', 'review', 'done']);
            expect(columnEls()[0].querySelector('.p-kanban-column-title')!.textContent).toBe('To do');
            expect(live()).toBe('Cancelled, column To do returned to position 1 of 4');
        });

        it('should reorder columns with the pointer', async () => {
            const spy = vi.fn();
            component.onColumnReorder.subscribe(spy);
            component.onColumnDrop({ previousIndex: 3, currentIndex: 0, item: { data: 'done' } } as any);
            expect(component.columns().map((column) => column.id)).toEqual(['done', 'todo', 'doing', 'review']);
            expect(spy).toHaveBeenCalledWith(expect.objectContaining({ fromIndex: 3, toIndex: 0 }));
        });

        it('should hide the column handles of a disabled board', async () => {
            fixture.componentRef.setInput('reorderColumns', true);
            fixture.componentRef.setInput('disabled', true);
            await render();
            expect(host.querySelector('.p-kanban-column-handle')).toBeNull();
            expect(host.classList).toContain('p-kanban-disabled');
        });
    });

    describe('Templates', () => {
        let hostFixture: ComponentFixture<TemplateHost>;
        let el: HTMLElement;

        beforeEach(async () => {
            hostFixture = TestBed.createComponent(TemplateHost);
            el = hostFixture.nativeElement;
            document.body.appendChild(el);
            hostFixture.detectChanges();
            await hostFixture.whenStable();
        });

        afterEach(() => el.remove());

        it('should render the card, header, footer and empty templates with their context', () => {
            expect(el.querySelector('.custom-card')!.textContent).toBe('Task A - todo - 0');
            expect(el.querySelectorAll('.custom-header')[1].textContent).toBe('In progress (1/2)');
            expect(el.querySelectorAll('.custom-footer')[3].textContent).toBe('done footer');
            expect(el.querySelector('.custom-empty')!.textContent).toBe('Nothing in Review');
            expect(el.querySelector('.p-kanban-column-title')).toBeNull();
        });

        it('should update the two-way bound columns after a move', async () => {
            const card = el.querySelector<HTMLElement>('.p-kanban-card')!;
            card.focus();
            key(card, ' ');
            key(card, 'ArrowRight');
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            key(document.activeElement!, 'Enter');
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            const app = hostFixture.componentInstance;
            expect(app.columns[1].items.map((item) => item.id)).toEqual([1, 4]);
            expect(app.moves.length).toBe(1);
            expect(el.querySelectorAll('.custom-header')[1].textContent).toBe('In progress (2/2)');
        });
    });

    describe('Pass Through and unstyled', () => {
        it('should pass attributes through pt', async () => {
            fixture.componentRef.setInput('pt', {
                root: { 'data-test': 'root' },
                column: { class: 'pt-column' },
                card: { class: 'pt-card' },
                columnHeader: { 'data-test': 'header' },
                empty: { class: 'pt-empty' }
            });
            await render();
            expect(host.getAttribute('data-test')).toBe('root');
            expect(columnEls()[0].classList).toContain('pt-column');
            expect(cards(0)[0].classList).toContain('pt-card');
            expect(host.querySelector('.p-kanban-column-header')!.getAttribute('data-test')).toBe('header');
            expect(host.querySelector('.p-kanban-empty')!.classList).toContain('pt-empty');
        });

        it('should render without classes when unstyled', async () => {
            fixture.componentRef.setInput('unstyled', true);
            await render();
            expect(host.classList).not.toContain('p-kanban');
            expect(host.querySelector('.p-kanban-column')).toBeNull();
            expect(host.querySelectorAll('[role="listitem"]').length).toBe(5);
        });
    });
});
