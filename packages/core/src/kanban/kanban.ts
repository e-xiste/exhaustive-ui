import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDragMove, CdkDropList, DragStartDelay } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgTemplateOutlet } from '@angular/common';
import { afterNextRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, inject, input, linkedSignal, model, NgModule, output, signal, TemplateRef, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { BarsIcon, ChevronDownIcon, ChevronRightIcon, PlusIcon } from '@exhaustive-ui/core/icons';
import type {
    KanbanAddCardEvent,
    KanbanCanDrop,
    KanbanCardClickEvent,
    KanbanCardMoveEvent,
    KanbanCardTemplateContext,
    KanbanColumn,
    KanbanColumnReorderEvent,
    KanbanColumnTemplateContext,
    KanbanColumnToggleEvent,
    KanbanLabels,
    KanbanPassThrough
} from '@exhaustive-ui/core/types/kanban';
import { resolveFieldData, uuid } from '@exhaustive-ui/utils';
import { KanbanStyle } from './style/kanbanstyle';

/**
 * Default texts of Kanban.
 * @group Constants
 */
export const KANBAN_DEFAULT_LABELS: KanbanLabels = {
    cardInstructions: 'Press Space or Enter to pick up the card. While it is picked up, the arrow keys move it, Space or Enter drops it and Escape cancels the move.',
    columnInstructions: 'Press Space or Enter to pick up the column. While it is picked up, the left and right arrow keys move it, Space or Enter drops it and Escape cancels the move.',
    pickedUp: 'Picked up {0}, position {1} of {2} in {3}',
    moved: 'Moved to {0}, position {1} of {2}',
    dropped: 'Dropped {0} in {1}, position {2} of {3}',
    cancelled: 'Cancelled, {0} returned to {1}, position {2} of {3}',
    limitReached: '{0} is full, {1} of {2} cards',
    dropRefused: '{0} can not be moved to {1}',
    columnPickedUp: 'Picked up column {0}, position {1} of {2}',
    columnMoved: 'Column moved to position {0} of {1}',
    columnDropped: 'Dropped column {0} at position {1} of {2}',
    columnCancelled: 'Cancelled, column {0} returned to position {1} of {2}',
    addCard: 'Add card',
    addCardTo: 'Add card to {0}',
    collapse: 'Collapse {0}',
    expand: 'Expand {0}',
    moveColumn: 'Move column {0}',
    empty: 'No cards',
    count: '{0} cards',
    countLimit: '{0} of {1} cards',
    overLimit: 'over the limit'
};

const format = (text: string, ...values: (string | number)[]) => values.reduce<string>((acc, value, index) => acc.replace(`{${index}}`, String(value)), text);

type CardGrab = { kind: 'card'; key: any; item: any; originColumnId: string; originIndex: number };
type ColumnGrab = { kind: 'column'; columnId: string; originIndex: number };

/**
 * Kanban is a task board: cards are dragged within a column and from a column to another one, with the pointer or the keyboard. It supports work in progress limits, drop rules, collapsible and reorderable columns, and announces every move to screen readers.
 * @group Components
 */
@Component({
    selector: 'p-kanban',
    standalone: true,
    imports: [NgTemplateOutlet, SharedModule, BindModule, CdkDropList, CdkDrag, CdkDragHandle, CdkScrollable, PlusIcon, BarsIcon, ChevronDownIcon, ChevronRightIcon],
    template: `
        <div
            [class]="cx('board')"
            cdkScrollable
            cdkDropList
            cdkDropListOrientation="horizontal"
            [cdkDropListDisabled]="!canReorderColumns()"
            [cdkDropListAutoScrollStep]="10"
            (cdkDropListDropped)="onColumnDrop($event)"
            [style.height]="scrollHeight()"
            [pBind]="ptm('board')"
        >
            @for (column of view(); track column.id; let columnIndex = $index) {
                <section
                    [class]="cx('column', { column })"
                    role="region"
                    [attr.aria-labelledby]="columnDomId(column) + '_title'"
                    [attr.data-p-column-id]="column.id"
                    [attr.data-p-collapsed]="!!column.collapsed"
                    cdkDrag
                    cdkDragLockAxis="x"
                    [cdkDragData]="column.id"
                    [cdkDragDisabled]="!canReorderColumns()"
                    [cdkDragStartDelay]="dragStartDelay()"
                    cdkDragPreviewClass="p-kanban-column-preview"
                    (cdkDragStarted)="onDragStarted()"
                    (cdkDragEnded)="onDragEnded()"
                    [pBind]="ptm('column')"
                >
                    <div [class]="cx('columnHeader')" [pBind]="ptm('columnHeader')">
                        @if (canReorderColumns()) {
                            <button
                                type="button"
                                cdkDragHandle
                                [class]="cx('columnHandle', { column })"
                                [attr.id]="columnDomId(column) + '_handle'"
                                [attr.aria-label]="format(labelOf('moveColumn'), column.title)"
                                [attr.aria-describedby]="uid + '_column_instructions'"
                                [attr.aria-pressed]="isColumnGrabbed(column) ? 'true' : 'false'"
                                (keydown)="onColumnHandleKeydown($event, column)"
                                (blur)="onGrabBlur()"
                                [pBind]="ptm('columnHandle')"
                            >
                                <svg data-p-icon="bars" aria-hidden="true" />
                            </button>
                        }
                        @if (collapsible()) {
                            <button
                                type="button"
                                [class]="cx('columnToggle')"
                                [attr.id]="columnDomId(column) + '_toggle'"
                                [attr.aria-label]="format(labelOf(column.collapsed ? 'expand' : 'collapse'), column.title)"
                                [attr.aria-expanded]="!column.collapsed"
                                [attr.aria-controls]="column.collapsed ? undefined : columnDomId(column) + '_list'"
                                (click)="toggleColumn(column)"
                                [pBind]="ptm('columnToggle')"
                            >
                                @if (column.collapsed) {
                                    <svg data-p-icon="chevron-right" aria-hidden="true" />
                                } @else {
                                    <svg data-p-icon="chevron-down" aria-hidden="true" />
                                }
                            </button>
                        }
                        <div [class]="cx('columnHeading')" [attr.id]="columnDomId(column) + '_title'">
                            @if (columnHeaderTemplate()) {
                                <ng-container *ngTemplateOutlet="columnHeaderTemplate()!; context: columnContext(column)" />
                            } @else {
                                <span [class]="cx('columnTitle')" [pBind]="ptm('columnTitle')">{{ column.title }}</span>
                                <span [class]="cx('columnCount', { column })" [pBind]="ptm('columnCount')">
                                    <span aria-hidden="true">{{ column.limit != null ? column.items.length + ' / ' + column.limit : column.items.length }}</span>
                                    <span class="p-hidden-accessible">{{ countText(column) }}</span>
                                </span>
                            }
                        </div>
                    </div>
                    @if (!column.collapsed) {
                        <div
                            [class]="cx('columnContent', { column })"
                            [attr.role]="column.items.length ? 'list' : 'group'"
                            [attr.aria-label]="column.title + ', ' + countText(column)"
                            [attr.aria-disabled]="isColumnDisabled(column) || undefined"
                            cdkDropList
                            [id]="columnDomId(column) + '_list'"
                            [cdkDropListData]="column.id"
                            [cdkDropListConnectedTo]="dropListIds()"
                            [cdkDropListDisabled]="isColumnDisabled(column)"
                            [cdkDropListEnterPredicate]="enterPredicate"
                            (cdkDropListDropped)="onCardDrop($event)"
                            [pBind]="ptm('columnContent')"
                        >
                            @for (item of column.items; track keyOf(item); let index = $index) {
                                <div
                                    [class]="cx('cardItem')"
                                    role="listitem"
                                    cdkDrag
                                    [cdkDragData]="item"
                                    [cdkDragDisabled]="isColumnDisabled(column)"
                                    [cdkDragStartDelay]="dragStartDelay()"
                                    cdkDragPreviewClass="p-kanban-card-preview"
                                    (cdkDragStarted)="onDragStarted()"
                                    (cdkDragMoved)="onCardDragMoved($event)"
                                    (cdkDragEnded)="onDragEnded()"
                                    [pBind]="ptm('cardItem')"
                                >
                                    <div
                                        [class]="cx('card', { item, column })"
                                        role="button"
                                        [attr.id]="cardDomId(item)"
                                        [attr.tabindex]="0"
                                        [attr.aria-roledescription]="'draggable card'"
                                        [attr.aria-describedby]="isColumnDisabled(column) ? undefined : uid + '_card_instructions'"
                                        [attr.aria-pressed]="isCardGrabbed(item) ? 'true' : 'false'"
                                        [attr.aria-disabled]="isColumnDisabled(column) || undefined"
                                        [attr.data-p-grabbed]="isCardGrabbed(item)"
                                        (keydown)="onCardKeydown($event, item, column, index)"
                                        (click)="onCardClicked($event, item, column)"
                                        (blur)="onGrabBlur()"
                                        [pBind]="ptm('card')"
                                    >
                                        @if (cardTemplate()) {
                                            <ng-container *ngTemplateOutlet="cardTemplate()!; context: cardContext(item, column, index)" />
                                        } @else {
                                            {{ labelOfItem(item) }}
                                        }
                                    </div>
                                </div>
                            } @empty {
                                <div [class]="cx('empty')" [pBind]="ptm('empty')">
                                    @if (emptyTemplate()) {
                                        <ng-container *ngTemplateOutlet="emptyTemplate()!; context: columnContext(column)" />
                                    } @else {
                                        {{ labelOf('empty') }}
                                    }
                                </div>
                            }
                        </div>
                        @if (columnFooterTemplate() || showAddButton()) {
                            <div [class]="cx('columnFooter')" [pBind]="ptm('columnFooter')">
                                @if (columnFooterTemplate()) {
                                    <ng-container *ngTemplateOutlet="columnFooterTemplate()!; context: columnContext(column)" />
                                }
                                @if (showAddButton()) {
                                    <button
                                        type="button"
                                        [class]="cx('addButton')"
                                        [attr.aria-label]="format(labelOf('addCardTo'), column.title)"
                                        [disabled]="isColumnDisabled(column) || isFull(column)"
                                        (click)="onAddCard.emit({ column })"
                                        [pBind]="ptm('addButton')"
                                    >
                                        <svg data-p-icon="plus" aria-hidden="true" />
                                        <span>{{ labelOf('addCard') }}</span>
                                    </button>
                                }
                            </div>
                        }
                    }
                </section>
            }
        </div>
        <span class="p-hidden-accessible" [attr.id]="uid + '_card_instructions'">{{ labelOf('cardInstructions') }}</span>
        @if (canReorderColumns()) {
            <span class="p-hidden-accessible" [attr.id]="uid + '_column_instructions'">{{ labelOf('columnInstructions') }}</span>
        }
        <span class="p-hidden-accessible" aria-live="assertive" aria-atomic="true">{{ announcement() }}</span>
    `,
    providers: [KanbanStyle, { provide: PARENT_INSTANCE, useExisting: Kanban }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP()',
        '[attr.role]': "ariaLabel() || ariaLabelledBy() ? 'group' : undefined",
        '[attr.aria-label]': 'ariaLabel()',
        '[attr.aria-labelledby]': 'ariaLabelledBy()'
    },
    hostDirectives: [Bind]
})
export class Kanban<T = any> extends BaseComponent<KanbanPassThrough> {
    componentName = 'Kanban';

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(KanbanStyle);

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
    }

    /******************** Inputs ********************/

    /**
     * Columns of the board with their cards. The board updates it with new arrays after every move, so it can be bound two-way with `[(columns)]`.
     * @defaultValue []
     * @group Props
     */
    readonly columns = model<KanbanColumn<T>[]>([]);
    /**
     * Name of the field that uniquely identifies a card. Without it, cards are identified by reference.
     * @group Props
     */
    readonly dataKey = input<string | undefined>();
    /**
     * Name of the field, or a function, that gives the text of a card: shown by the default card and used in the announcements.
     * @defaultValue 'title'
     * @group Props
     */
    readonly itemLabel = input<string | ((item: T) => string)>('title');
    /**
     * Decides whether a card can move from a column to another one. Moves within a column are always allowed.
     * @group Props
     */
    readonly canDrop = input<KanbanCanDrop<T> | undefined>();
    /**
     * Whether columns can be reordered with a drag handle in their header.
     * @defaultValue false
     * @group Props
     */
    readonly reorderColumns = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether columns have a button to collapse them.
     * @defaultValue false
     * @group Props
     */
    readonly collapsible = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether to show an add card button at the bottom of every column.
     * @defaultValue false
     * @group Props
     */
    readonly showAddButton = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether nothing can be dragged.
     * @defaultValue false
     * @group Props
     */
    readonly disabled = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Height of the board, such as `30rem`. The cards of a column then scroll under its header.
     * @group Props
     */
    readonly scrollHeight = input<string | undefined>();
    /**
     * Delay before a drag starts, in milliseconds. The touch delay lets the board scroll on mobile.
     * @defaultValue { touch: 250, mouse: 0 }
     * @group Props
     */
    readonly dragStartDelay = input<DragStartDelay>({ touch: 250, mouse: 0 });
    /**
     * Texts of the component, merged with the English defaults.
     * @group Props
     */
    readonly labels = input<Partial<KanbanLabels> | undefined>();
    /**
     * Accessible name of the board.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();
    /**
     * Identifier of the element that labels the board.
     * @group Props
     */
    readonly ariaLabelledBy = input<string | undefined>();

    /******************** Outputs ********************/

    /**
     * Callback to invoke when a card is moved, after the columns are updated.
     * @param {KanbanCardMoveEvent} event - Custom card move event.
     * @group Emits
     */
    readonly onCardMove = output<KanbanCardMoveEvent<T>>();
    /**
     * Callback to invoke when a card is clicked.
     * @param {KanbanCardClickEvent} event - Custom card click event.
     * @group Emits
     */
    readonly onCardClick = output<KanbanCardClickEvent<T>>();
    /**
     * Callback to invoke when a column is moved, after the columns are updated.
     * @param {KanbanColumnReorderEvent} event - Custom column reorder event.
     * @group Emits
     */
    readonly onColumnReorder = output<KanbanColumnReorderEvent<T>>();
    /**
     * Callback to invoke when the add card button of a column is clicked.
     * @param {KanbanAddCardEvent} event - Custom add card event.
     * @group Emits
     */
    readonly onAddCard = output<KanbanAddCardEvent<T>>();
    /**
     * Callback to invoke when a column is collapsed or expanded, after the columns are updated.
     * @param {KanbanColumnToggleEvent} event - Custom column toggle event.
     * @group Emits
     */
    readonly onColumnToggle = output<KanbanColumnToggleEvent<T>>();

    /******************** Templates ********************/

    /**
     * Custom content of a card.
     * @param {KanbanCardTemplateContext} context - card context.
     * @group Templates
     */
    readonly cardTemplate = contentChild<TemplateRef<KanbanCardTemplateContext<T>>>('card', { descendants: false });
    /**
     * Custom title and count of a column header.
     * @param {KanbanColumnTemplateContext} context - column context.
     * @group Templates
     */
    readonly columnHeaderTemplate = contentChild<TemplateRef<KanbanColumnTemplateContext<T>>>('columnHeader', { descendants: false });
    /**
     * Custom footer of a column, above the add card button.
     * @param {KanbanColumnTemplateContext} context - column context.
     * @group Templates
     */
    readonly columnFooterTemplate = contentChild<TemplateRef<KanbanColumnTemplateContext<T>>>('columnFooter', { descendants: false });
    /**
     * Custom content of an empty column.
     * @param {KanbanColumnTemplateContext} context - column context.
     * @group Templates
     */
    readonly emptyTemplate = contentChild<TemplateRef<KanbanColumnTemplateContext<T>>>('empty', { descendants: false });

    /******************** State ********************/

    /**
     * Columns as displayed: the columns input, or the preview of a keyboard move.
     */
    readonly view = linkedSignal<KanbanColumn<T>[]>(() => this.columns() ?? []);

    readonly grab = signal<CardGrab | ColumnGrab | null>(null);

    readonly announcement = signal('');

    readonly dragging = signal(false);

    readonly refusedColumnId = signal<string | null>(null);

    readonly uid = uuid('pn_id_');

    readonly format = format;

    readonly mergedLabels = computed<KanbanLabels>(() => ({ ...KANBAN_DEFAULT_LABELS, ...(this.labels() ?? {}) }));

    readonly canReorderColumns = computed(() => this.reorderColumns() && !this.disabled());

    readonly dropListIds = computed(() => this.view().map((column) => this.columnDomId(column) + '_list'));

    readonly dataP = computed(() =>
        this.cn({
            disabled: this.disabled(),
            dragging: this.dragging(),
            scrollable: !!this.scrollHeight()
        })
    );

    private domIds = new Map<any, string>();

    private objectKeys = new WeakMap<object, number>();

    private keyCounter = 0;

    private refocusing = false;

    private lastDragEnd = 0;

    private releasedOverRefused = false;

    private announceToggle = false;

    /**
     * Stable reference given to the drop lists: whether the dragged card can enter a column.
     */
    readonly enterPredicate = (drag: CdkDrag<T>, drop: CdkDropList<string>) => this.canMoveTo(drag.data, drag.dropContainer.data, drop.data);

    /******************** Template helpers ********************/

    labelOf(key: keyof KanbanLabels): string {
        return this.mergedLabels()[key];
    }

    labelOfItem(item: T): string {
        const field = this.itemLabel();
        if (typeof field === 'function') {
            return field(item) ?? '';
        }
        if (item !== null && typeof item === 'object') {
            const value = resolveFieldData(item, field);
            return value == null ? '' : String(value);
        }
        return item == null ? '' : String(item);
    }

    /**
     * Identity of a card: its dataKey field, or the card itself.
     */
    keyOf(item: T): any {
        const dataKey = this.dataKey();
        if (dataKey && item !== null && typeof item === 'object') {
            return resolveFieldData(item, dataKey);
        }
        return item;
    }

    cardDomId(item: T): string {
        let key = this.keyOf(item);
        if (key !== null && typeof key === 'object') {
            let id = this.objectKeys.get(key);
            if (id === undefined) {
                id = ++this.keyCounter;
                this.objectKeys.set(key, id);
            }
            return `${this.uid}_card_o${id}`;
        }
        let id = this.domIds.get(key);
        if (!id) {
            id = `${this.uid}_card_${++this.keyCounter}`;
            this.domIds.set(key, id);
        }
        return id;
    }

    columnDomId(column: KanbanColumn<T>): string {
        const key = 'column:' + column.id;
        let id = this.domIds.get(key);
        if (!id) {
            id = `${this.uid}_col_${++this.keyCounter}`;
            this.domIds.set(key, id);
        }
        return id;
    }

    countText(column: KanbanColumn<T>): string {
        const count = column.items.length;
        if (column.limit == null) {
            return format(this.labelOf('count'), count);
        }
        const text = format(this.labelOf('countLimit'), count, column.limit);
        return count > column.limit ? `${text}, ${this.labelOf('overLimit')}` : text;
    }

    isFull(column: KanbanColumn<T>): boolean {
        return column.limit != null && column.items.length >= column.limit;
    }

    isOverLimit(column: KanbanColumn<T>): boolean {
        return column.limit != null && column.items.length > column.limit;
    }

    isColumnDisabled(column: KanbanColumn<T>): boolean {
        return this.disabled() || !!column.disabled;
    }

    isCardGrabbed(item: T): boolean {
        const grab = this.grab();
        return grab?.kind === 'card' && grab.key === this.keyOf(item);
    }

    isColumnGrabbed(column: KanbanColumn<T>): boolean {
        const grab = this.grab();
        return grab?.kind === 'column' && grab.columnId === column.id;
    }

    cardContext(item: T, column: KanbanColumn<T>, index: number): KanbanCardTemplateContext<T> {
        return { $implicit: item, column, index, grabbed: this.isCardGrabbed(item) };
    }

    columnContext(column: KanbanColumn<T>): KanbanColumnTemplateContext<T> {
        return { $implicit: column, count: column.items.length, limit: column.limit, overLimit: this.isOverLimit(column) };
    }

    /******************** Rules ********************/

    /**
     * Whether a card can move from a column to another one, according to the disabled state, the limit and canDrop.
     */
    canMoveTo(item: T, fromId: string, toId: string): boolean {
        return this.refusal(item, fromId, toId) === null;
    }

    private refusal(item: T, fromId: string, toId: string): 'disabled' | 'limit' | 'rule' | null {
        if (fromId === toId) {
            return null;
        }
        const columns = this.columns() ?? [];
        const from = columns.find((column) => column.id === fromId);
        const to = columns.find((column) => column.id === toId);
        if (!from || !to || this.isColumnDisabled(to)) {
            return 'disabled';
        }
        const count = to.items.filter((other) => this.keyOf(other) !== this.keyOf(item)).length;
        if (to.limit != null && count >= to.limit) {
            return 'limit';
        }
        const canDrop = this.canDrop();
        if (canDrop && !canDrop(item, from, to)) {
            return 'rule';
        }
        return null;
    }

    private refusalMessage(item: T, toId: string, reason: 'disabled' | 'limit' | 'rule'): string {
        const to = this.view().find((column) => column.id === toId);
        if (!to) return '';
        if (reason === 'limit') {
            return format(this.labelOf('limitReached'), to.title, to.items.length, to.limit!);
        }
        return format(this.labelOf('dropRefused'), this.labelOfItem(item), to.title);
    }

    /******************** Pointer ********************/

    onDragStarted() {
        if (this.grab()) {
            this.cancelGrab(false);
        }
        this.releasedOverRefused = false;
        this.dragging.set(true);
    }

    onDragEnded() {
        this.releasedOverRefused = this.refusedColumnId() !== null;
        this.dragging.set(false);
        this.refusedColumnId.set(null);
        this.lastDragEnd = Date.now();
    }

    onCardDragMoved(event: CdkDragMove<T>) {
        const { x, y } = event.pointerPosition;
        const target = this.document.elementFromPoint?.(x, y) as HTMLElement | null;
        const columnEl = target?.closest?.('[data-p-column-id]') as HTMLElement | null;
        const toId = columnEl && this.el.nativeElement.contains(columnEl) ? columnEl.getAttribute('data-p-column-id') : null;
        const fromId = event.source.dropContainer.data as unknown as string;
        const reason = toId && columnEl!.getAttribute('data-p-collapsed') !== 'true' ? this.refusal(event.source.data, fromId, toId) : null;
        const refused = reason ? toId : null;
        if (refused !== this.refusedColumnId()) {
            this.refusedColumnId.set(refused);
            if (refused && reason) {
                this.announce(this.refusalMessage(event.source.data, refused, reason));
            }
        }
    }

    onCardDrop(event: CdkDragDrop<string, string, T>) {
        const fromId = event.previousContainer.data;
        const toId = event.container.data;
        const releasedOverRefused = this.releasedOverRefused;
        this.releasedOverRefused = false;
        // released over a column that refuses the card: the card goes back, it does not land in the last column it passed
        if (releasedOverRefused || !this.canMoveTo(event.item.data, fromId, toId)) {
            return;
        }
        if (fromId === toId && event.previousIndex === event.currentIndex) {
            return;
        }
        const next = this.moveCard(this.columns() ?? [], fromId, event.previousIndex, toId, event.currentIndex);
        this.commitCardMove(event.item.data, fromId, event.previousIndex, next);
        const to = next.find((column) => column.id === toId)!;
        this.announce(format(this.labelOf('dropped'), this.labelOfItem(event.item.data), to.title, event.currentIndex + 1, to.items.length));
    }

    onColumnDrop(event: CdkDragDrop<unknown, unknown, string>) {
        if (event.previousIndex === event.currentIndex) {
            return;
        }
        const next = this.moveColumn(this.columns() ?? [], event.previousIndex, event.currentIndex);
        this.commitColumnMove(event.item.data, event.previousIndex, next);
    }

    onCardClicked(event: MouseEvent, item: T, column: KanbanColumn<T>) {
        if (Date.now() - this.lastDragEnd < 100) {
            return;
        }
        this.onCardClick.emit({ originalEvent: event, item, column });
    }

    /******************** Keyboard ********************/

    onCardKeydown(event: KeyboardEvent, item: T, column: KanbanColumn<T>, index: number) {
        const grab = this.grab();
        const key = event.key;

        if (grab?.kind === 'card' && grab.key === this.keyOf(item)) {
            switch (key) {
                case 'ArrowUp':
                    this.moveGrabbedWithin(column, index, index - 1);
                    break;
                case 'ArrowDown':
                    this.moveGrabbedWithin(column, index, index + 1);
                    break;
                case 'Home':
                    this.moveGrabbedWithin(column, index, 0);
                    break;
                case 'End':
                    this.moveGrabbedWithin(column, index, column.items.length - 1);
                    break;
                case 'ArrowLeft':
                case 'ArrowRight':
                    this.moveGrabbedAcross(item, column, index, this.horizontalStep(key));
                    break;
                case ' ':
                case 'Enter':
                    this.dropGrabbedCard();
                    break;
                case 'Escape':
                    this.cancelGrab(true);
                    break;
                case 'Tab':
                    return;
                default:
                    return;
            }
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (grab || event.target !== event.currentTarget) {
            return;
        }

        switch (key) {
            case ' ':
            case 'Enter':
                if (this.isColumnDisabled(column)) {
                    return;
                }
                this.grab.set({ kind: 'card', key: this.keyOf(item), item, originColumnId: column.id, originIndex: index });
                this.announce(format(this.labelOf('pickedUp'), this.labelOfItem(item), index + 1, column.items.length, column.title));
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                this.focusSibling(column, index + (key === 'ArrowUp' ? -1 : 1));
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
                this.focusAdjacentColumn(column, index, this.horizontalStep(key));
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    onColumnHandleKeydown(event: KeyboardEvent, column: KanbanColumn<T>) {
        const grab = this.grab();
        const columns = this.view();
        const index = columns.findIndex((other) => other.id === column.id);

        if (grab?.kind === 'column' && grab.columnId === column.id) {
            let target = index;
            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowRight':
                    target = index + this.horizontalStep(event.key);
                    break;
                case 'Home':
                    target = 0;
                    break;
                case 'End':
                    target = columns.length - 1;
                    break;
                case ' ':
                case 'Enter':
                    this.dropGrabbedColumn();
                    event.preventDefault();
                    return;
                case 'Escape':
                    this.cancelGrab(true);
                    event.preventDefault();
                    return;
                default:
                    return;
            }
            event.preventDefault();
            target = Math.max(0, Math.min(columns.length - 1, target));
            if (target !== index) {
                this.refocusing = true;
                this.view.set(this.moveColumn(columns, index, target));
                this.focusAfterRender(this.columnDomId(column) + '_handle');
            }
            this.announce(format(this.labelOf('columnMoved'), target + 1, columns.length));
            return;
        }

        if (!grab && (event.key === ' ' || event.key === 'Enter')) {
            event.preventDefault();
            this.grab.set({ kind: 'column', columnId: column.id, originIndex: index });
            this.announce(format(this.labelOf('columnPickedUp'), column.title, index + 1, columns.length));
        }
    }

    onGrabBlur() {
        if (this.grab() && !this.refocusing) {
            this.cancelGrab(true, false);
        }
    }

    toggleColumn(column: KanbanColumn<T>) {
        const collapsed = !column.collapsed;
        const next = (this.columns() ?? []).map((other) => (other.id === column.id ? { ...other, collapsed } : other));
        this.columns.set(next);
        this.onColumnToggle.emit({ column: next.find((other) => other.id === column.id)!, collapsed });
    }

    private horizontalStep(key: string): number {
        const host = this.el.nativeElement as HTMLElement;
        const rtl = typeof getComputedStyle === 'function' && getComputedStyle(host).direction === 'rtl';
        const step = key === 'ArrowLeft' ? -1 : 1;
        return rtl ? -step : step;
    }

    private moveGrabbedWithin(column: KanbanColumn<T>, index: number, target: number) {
        const count = column.items.length;
        target = Math.max(0, Math.min(count - 1, target));
        if (target !== index) {
            const item = column.items[index];
            this.refocusing = true;
            this.view.set(this.moveCard(this.view(), column.id, index, column.id, target));
            this.focusAfterRender(this.cardDomId(item));
        }
        this.announce(format(this.labelOf('moved'), column.title, target + 1, count));
    }

    private moveGrabbedAcross(item: T, column: KanbanColumn<T>, index: number, step: number) {
        const grab = this.grab() as CardGrab;
        const columns = this.view();
        let position = columns.findIndex((other) => other.id === column.id) + step;
        while (columns[position]?.collapsed) {
            position += step;
        }
        const target = columns[position];
        if (!target) {
            return;
        }
        const reason = this.refusalAgainst(item, grab.originColumnId, target);
        if (reason) {
            this.announce(this.refusalMessage(item, target.id, reason));
            return;
        }
        const toIndex = Math.min(index, target.items.length);
        this.refocusing = true;
        const next = this.moveCard(columns, column.id, index, target.id, toIndex);
        this.view.set(next);
        this.focusAfterRender(this.cardDomId(item));
        this.announce(format(this.labelOf('moved'), target.title, toIndex + 1, target.items.length + 1));
    }

    /**
     * Rules checked against the columns being previewed, so that the limit counts the cards already moved there.
     */
    private refusalAgainst(item: T, originId: string, to: KanbanColumn<T>): 'disabled' | 'limit' | 'rule' | null {
        if (to.id === originId) {
            return null;
        }
        const origin = (this.columns() ?? []).find((column) => column.id === originId);
        if (!origin || this.isColumnDisabled(to)) {
            return 'disabled';
        }
        if (to.limit != null && to.items.length >= to.limit) {
            return 'limit';
        }
        const canDrop = this.canDrop();
        const original = (this.columns() ?? []).find((column) => column.id === to.id) ?? to;
        if (canDrop && !canDrop(item, origin, original)) {
            return 'rule';
        }
        return null;
    }

    private dropGrabbedCard() {
        const grab = this.grab() as CardGrab;
        const next = this.view();
        this.grab.set(null);
        const position = this.locate(next, grab.key);
        if (!position) return;
        const to = next[position.columnIndex];
        const moved = to.id !== grab.originColumnId || position.index !== grab.originIndex;
        if (moved) {
            this.commitCardMove(grab.item, grab.originColumnId, grab.originIndex, next);
        }
        this.announce(format(this.labelOf('dropped'), this.labelOfItem(grab.item), to.title, position.index + 1, to.items.length));
    }

    private dropGrabbedColumn() {
        const grab = this.grab() as ColumnGrab;
        const next = this.view();
        this.grab.set(null);
        const index = next.findIndex((column) => column.id === grab.columnId);
        if (index !== grab.originIndex) {
            this.commitColumnMove(grab.columnId, grab.originIndex, next);
        }
        this.announce(format(this.labelOf('columnDropped'), next[index].title, index + 1, next.length));
    }

    private cancelGrab(announce: boolean, refocus = true) {
        const grab = this.grab();
        if (!grab) return;
        this.grab.set(null);
        const columns = this.columns() ?? [];
        const changed = this.view() !== columns;
        this.view.set(columns);
        if (grab.kind === 'card') {
            const column = columns.find((other) => other.id === grab.originColumnId);
            if (refocus && changed) {
                this.refocusing = true;
                this.focusAfterRender(this.cardDomId(grab.item));
            }
            if (announce && column) {
                this.announce(format(this.labelOf('cancelled'), this.labelOfItem(grab.item), column.title, grab.originIndex + 1, column.items.length));
            }
        } else {
            const column = columns[grab.originIndex];
            if (refocus && changed && column) {
                this.refocusing = true;
                this.focusAfterRender(this.columnDomId(column) + '_handle');
            }
            if (announce && column) {
                this.announce(format(this.labelOf('columnCancelled'), column.title, grab.originIndex + 1, columns.length));
            }
        }
    }

    private focusSibling(column: KanbanColumn<T>, index: number) {
        const item = column.items[index];
        if (item !== undefined) {
            this.focusElement(this.cardDomId(item));
        }
    }

    private focusAdjacentColumn(column: KanbanColumn<T>, index: number, step: number) {
        const columns = this.view();
        let position = columns.findIndex((other) => other.id === column.id) + step;
        while (columns[position] && (columns[position].collapsed || !columns[position].items.length)) {
            position += step;
        }
        const target = columns[position];
        if (target) {
            this.focusElement(this.cardDomId(target.items[Math.min(index, target.items.length - 1)]));
        }
    }

    private focusElement(id: string) {
        (this.el.nativeElement as HTMLElement).querySelector<HTMLElement>(`[id="${id}"]`)?.focus();
    }

    private focusAfterRender(id: string) {
        afterNextRender(
            () => {
                this.focusElement(id);
                this.refocusing = false;
            },
            { injector: this.injector }
        );
    }

    /******************** Model ********************/

    private locate(columns: KanbanColumn<T>[], key: any): { columnIndex: number; index: number } | null {
        for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
            const index = columns[columnIndex].items.findIndex((item) => this.keyOf(item) === key);
            if (index > -1) return { columnIndex, index };
        }
        return null;
    }

    private moveCard(columns: KanbanColumn<T>[], fromId: string, fromIndex: number, toId: string, toIndex: number): KanbanColumn<T>[] {
        const from = columns.find((column) => column.id === fromId);
        const to = columns.find((column) => column.id === toId);
        if (!from || !to) return columns;
        const item = from.items[fromIndex];
        if (fromId === toId) {
            const items = [...from.items];
            items.splice(fromIndex, 1);
            items.splice(toIndex, 0, item);
            return columns.map((column) => (column.id === fromId ? { ...column, items } : column));
        }
        const fromItems = from.items.filter((_, index) => index !== fromIndex);
        const toItems = [...to.items];
        toItems.splice(Math.min(toIndex, toItems.length), 0, item);
        return columns.map((column) => (column.id === fromId ? { ...column, items: fromItems } : column.id === toId ? { ...column, items: toItems } : column));
    }

    private moveColumn(columns: KanbanColumn<T>[], fromIndex: number, toIndex: number): KanbanColumn<T>[] {
        const next = [...columns];
        const [column] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, column);
        return next;
    }

    private commitCardMove(item: T, fromId: string, fromIndex: number, next: KanbanColumn<T>[]) {
        this.columns.set(next);
        const position = this.locate(next, this.keyOf(item));
        if (!position) return;
        this.onCardMove.emit({
            item,
            fromColumn: next.find((column) => column.id === fromId)!,
            toColumn: next[position.columnIndex],
            fromIndex,
            toIndex: position.index,
            columns: next
        });
    }

    private commitColumnMove(columnId: string, fromIndex: number, next: KanbanColumn<T>[]) {
        this.columns.set(next);
        const toIndex = next.findIndex((column) => column.id === columnId);
        this.onColumnReorder.emit({ column: next[toIndex], fromIndex, toIndex, columns: next });
    }

    private announce(message: string) {
        this.announceToggle = !this.announceToggle;
        this.announcement.set(this.announceToggle ? message : message + ' ');
    }
}

@NgModule({
    imports: [Kanban, SharedModule],
    exports: [Kanban, SharedModule]
})
export class KanbanModule {}
