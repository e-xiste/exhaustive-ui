import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    InjectionToken,
    input,
    linkedSignal,
    model,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { findIndexInList, setAttribute, uuid } from '@exhaustive-ui/utils';
import { FilterService, PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { ButtonModule, ButtonProps } from '@exhaustive-ui/core/button';
import { AngleDoubleDownIcon, AngleDoubleUpIcon, AngleDownIcon, AngleUpIcon } from '@exhaustive-ui/core/icons';
import { Listbox, ListboxChangeEvent } from '@exhaustive-ui/core/listbox';
import { Ripple } from '@exhaustive-ui/core/ripple';
import { Nullable } from '@exhaustive-ui/core/ts-helpers';
import { OrderListFilterEvent, OrderListFilterOptions, OrderListFilterTemplateContext, OrderListItemTemplateContext, OrderListPassThrough, OrderListSelectionChangeEvent } from '@exhaustive-ui/core/types/orderlist';
import { OrderListStyle } from './style/orderliststyle';

const ORDERLIST_INSTANCE = new InjectionToken<OrderList>('ORDERLIST_INSTANCE');

/**
 * OrderList is used to manage the order of a collection.
 * @group Components
 */
@Component({
    selector: 'p-orderList, p-orderlist, p-order-list',
    imports: [CommonModule, ButtonModule, Ripple, DragDropModule, AngleDoubleDownIcon, AngleDoubleUpIcon, AngleUpIcon, AngleDownIcon, Listbox, FormsModule, SharedModule, Bind],
    template: `
        <div [pBind]="ptm('controls')" [class]="cx('controls')">
            <button [pt]="ptm('pcMoveUpButton')" type="button" [disabled]="moveDisabled()" pButton pRipple (click)="moveUp()" [attr.aria-label]="moveUpAriaLabel()" [buttonProps]="getButtonProps('up')" hostName="orderlist" [unstyled]="unstyled()">
                @if (!moveUpIconTemplate() && !_moveUpIconTemplate()) {
                    <svg data-p-icon="angle-up" pButtonIcon [pt]="ptm('pcMoveUpButton')['icon']" />
                }
                <ng-template *ngTemplateOutlet="moveUpIconTemplate() || _moveUpIconTemplate()"></ng-template>
            </button>
            <button [pt]="ptm('pcMoveTopButton')" type="button" [disabled]="moveDisabled()" pButton pRipple (click)="moveTop()" [attr.aria-label]="moveTopAriaLabel()" [buttonProps]="getButtonProps('top')" hostName="orderlist" [unstyled]="unstyled()">
                @if (!moveTopIconTemplate() && !_moveTopIconTemplate()) {
                    <svg data-p-icon="angle-double-up" pButtonIcon [pt]="ptm('pcMoveTopButton')['icon']" />
                }
                <ng-template *ngTemplateOutlet="moveTopIconTemplate() || _moveTopIconTemplate()"></ng-template>
            </button>
            <button
                [pt]="ptm('pcMoveDownButton')"
                type="button"
                [disabled]="moveDisabled()"
                pButton
                pRipple
                (click)="moveDown()"
                [attr.aria-label]="moveDownAriaLabel()"
                [buttonProps]="getButtonProps('down')"
                hostName="orderlist"
                [unstyled]="unstyled()"
            >
                @if (!moveDownIconTemplate() && !_moveDownIconTemplate()) {
                    <svg data-p-icon="angle-down" pButtonIcon [pt]="ptm('pcMoveDownButton')['icon']" />
                }
                <ng-template *ngTemplateOutlet="moveDownIconTemplate() || _moveDownIconTemplate()"></ng-template>
            </button>
            <button
                [pt]="ptm('pcMoveBottomButton')"
                type="button"
                [disabled]="moveDisabled()"
                pButton
                pRipple
                (click)="moveBottom()"
                [attr.aria-label]="moveBottomAriaLabel()"
                [buttonProps]="getButtonProps('bottom')"
                hostName="orderlist"
                [unstyled]="unstyled()"
            >
                @if (!moveBottomIconTemplate() && !_moveBottomIconTemplate()) {
                    <svg data-p-icon="angle-double-down" pButtonIcon [pt]="ptm('pcMoveBottomButton')['icon']" />
                }
                <ng-template *ngTemplateOutlet="moveBottomIconTemplate() || _moveBottomIconTemplate()"></ng-template>
            </button>
        </div>
        <p-listbox
            [pt]="ptm('pcListbox')"
            #listelement
            [multiple]="true"
            [options]="value()"
            [ngModel]="selection()"
            [ngModelOptions]="{ standalone: true }"
            [optionLabel]="optionLabel() ?? dataKey() ?? 'name'"
            [id]="id + '_list'"
            [listStyle]="listStyle()"
            [striped]="stripedRows()"
            [tabindex]="tabindex()"
            (onFocus)="onListFocus($event)"
            (onBlur)="onListBlur($event)"
            (onChange)="onChangeSelection($event)"
            [ariaLabel]="ariaLabel()"
            [disabled]="disabled()"
            [metaKeySelection]="metaKeySelection()"
            [scrollHeight]="scrollHeight()"
            [autoOptionFocus]="autoOptionFocus()"
            [focusOnHover]="focusOnHover()"
            [filter]="filterBy()"
            [filterBy]="filterBy()"
            [filterLocale]="filterLocale()"
            [filterMatchMode]="filterMatchMode()"
            [filterPlaceHolder]="filterPlaceholder()"
            [ariaFilterLabel]="ariaFilterLabel()"
            (onFilter)="onFilterKeyup($event.originalEvent)"
            [dragdrop]="dragdrop()"
            (onDrop)="onDrop($event)"
            hostName="orderlist"
            [unstyled]="unstyled()"
        >
            @if (headerTemplate() || _headerTemplate()) {
                <ng-template #header>
                    <ng-template *ngTemplateOutlet="headerTemplate() || _headerTemplate()"></ng-template>
                </ng-template>
            }
            @if (itemTemplate() || _itemTemplate()) {
                <ng-template #item let-option let-selected="selected" let-index="index">
                    <ng-template *ngTemplateOutlet="itemTemplate() || _itemTemplate(); context: { $implicit: option, selected: selected, index: index }"></ng-template>
                </ng-template>
            }
            @if (emptyMessageTemplate() || _emptyMessageTemplate()) {
                <ng-template #empty>
                    <ng-template *ngTemplateOutlet="emptyMessageTemplate() || _emptyMessageTemplate()"></ng-template>
                </ng-template>
            }
            @if (emptyFilterMessageTemplate() || _emptyFilterMessageTemplate()) {
                <ng-template #emptyfilter>
                    <ng-template *ngTemplateOutlet="emptyFilterMessageTemplate() || _emptyFilterMessageTemplate()"></ng-template>
                </ng-template>
            }
            @if (filterIconTemplate() || _filterIconTemplate()) {
                <ng-template #filtericon>
                    <ng-template *ngTemplateOutlet="filterIconTemplate() || _filterIconTemplate()"></ng-template>
                </ng-template>
            }
            @if (filterTemplate() || _filterTemplate()) {
                <ng-template #filter let-options="options">
                    <ng-template *ngTemplateOutlet="filterTemplate() || _filterTemplate(); context: { options: options }"></ng-template>
                </ng-template>
            }
        </p-listbox>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [OrderListStyle, { provide: ORDERLIST_INSTANCE, useExisting: OrderList }, { provide: PARENT_INSTANCE, useExisting: OrderList }],
    host: {
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class OrderList extends BaseComponent<OrderListPassThrough> {
    componentName = 'OrderList';

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcOrderList: OrderList | undefined = inject(ORDERLIST_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
    }
    /**
     * Text for the caption.
     * @group Props
     */
    readonly header = input<string | undefined>();

    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();

    /**
     * Specifies one or more IDs in the DOM that labels the input field.
     * @group Props
     */
    readonly ariaLabelledBy = input<string | undefined>();

    /**
     * Inline style of the list element.
     * @group Props
     */
    readonly listStyle = input<{ [klass: string]: any } | null | undefined>();

    /**
     * A boolean value that indicates whether the component should be responsive.
     * @group Props
     */
    readonly responsive = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * When specified displays an input field to filter the items on keyup and decides which fields to search against.
     * @group Props
     */
    readonly filterBy = input<string | undefined>();

    /**
     * Placeholder of the filter input.
     * @group Props
     */
    readonly filterPlaceholder = input<string | undefined>();

    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    readonly filterLocale = input<string | undefined>();

    /**
     * When true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    readonly metaKeySelection = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Whether to enable dragdrop based reordering.
     * @group Props
     */
    readonly dragdrop = input<boolean, unknown>(false, { transform: booleanAttribute });

    /**
     * Defines the location of the buttons with respect to the list.
     * @group Props
     */
    readonly controlsPosition = input<'left' | 'right'>('left');

    /**
     * Defines a string that labels the filter input.
     * @group Props
     */
    readonly ariaFilterLabel = input<string | undefined>();

    /**
     * Defines how the items are filtered.
     * @group Props
     */
    readonly filterMatchMode = input<'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte'>('contains');

    /**
     * Indicates the width of the screen at which the component should change its behavior.
     * @group Props
     */
    readonly breakpoint = input<string>('960px');

    /**
     * Whether to displays rows with alternating colors.
     * @group Props
     */
    readonly stripedRows = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity.
     * @group Props
     */
    readonly trackBy = input<Function>((index: number, item: any) => item);

    /**
     * Height of the viewport, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    readonly scrollHeight = input('14rem');

    /**
     * Whether to focus on the first visible or selected element.
     * @group Props
     */
    readonly autoOptionFocus = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * When enabled, the hovered option will be focused.
     * @group Props
     */
    readonly focusOnHover = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Name of the field that uniquely identifies the record in the data.
     * @group Props
     */
    readonly dataKey = input<string | undefined>();
    /**
     * Name of the label field of an option, used to display it and to search it with the keyboard. Defaults to dataKey, then to 'name'.
     * @group Props
     */
    readonly optionLabel = input<string | undefined>();
    /**
     * A list of values that are currently selected. Two-way bindable with `[(selection)]`: `selectionChange` is emitted with the new selection when it changes.
     * @group Props
     */
    readonly selection = model<any[]>([]);

    /**
     * Array of values to be displayed in the component.
     * It represents the data source for the list of items.
     * @group Props
     */
    readonly value = input<any[] | undefined>();

    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly buttonProps = input<ButtonProps>({ severity: 'secondary' });

    /**
     * Used to pass all properties of the ButtonProps to the move up button inside the component.
     * @group Props
     */
    readonly moveUpButtonProps = input<ButtonProps>();

    /**
     * Used to pass all properties of the ButtonProps to the move top button inside the component.
     * @group Props
     */
    readonly moveTopButtonProps = input<ButtonProps>();

    /**
     * Used to pass all properties of the ButtonProps to the move down button inside the component.
     * @group Props
     */
    readonly moveDownButtonProps = input<ButtonProps>();

    /**
     * Used to pass all properties of the ButtonProps to the move bottom button inside the component.
     * @group Props
     */
    readonly moveBottomButtonProps = input<ButtonProps>();

    /**
     * Callback to invoke when list is reordered.
     * @param {*} any - list instance.
     * @group Emits
     */
    readonly onReorder = output<any>();

    /**
     * Callback to invoke when selection changes.
     * @param {OrderListSelectionChangeEvent} event - Custom change event.
     * @group Emits
     */
    readonly onSelectionChange = output<OrderListSelectionChangeEvent>();

    /**
     * Callback to invoke when filtering occurs.
     * @param {OrderListFilterEvent} event - Custom filter event.
     * @group Emits
     */
    readonly onFilterEvent = output<OrderListFilterEvent>();

    /**
     * Callback to invoke when the list is focused
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onFocus = output<Event>();

    /**
     * Callback to invoke when the list is blurred
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onBlur = output<Event>();

    readonly listViewChild = viewChild.required<Listbox>('listelement');

    readonly filterViewChild = viewChild<Nullable<ElementRef>>('filter');

    /**
     * Custom item template.
     * @param {OrderListItemTemplateContext} context - item context.
     * @see {@link OrderListItemTemplateContext}
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<OrderListItemTemplateContext>>('item', { descendants: false });

    /**
     * Custom empty template.
     * @group Templates
     */
    readonly emptyMessageTemplate = contentChild<TemplateRef<void>>('empty', { descendants: false });

    /**
     * Custom empty filter template.
     * @group Templates
     */
    readonly emptyFilterMessageTemplate = contentChild<TemplateRef<void>>('emptyfilter', { descendants: false });

    /**
     * Custom filter template.
     * @param {OrderListFilterTemplateContext} context - filter context.
     * @see {@link OrderListFilterTemplateContext}
     * @group Templates
     */
    readonly filterTemplate = contentChild<TemplateRef<OrderListFilterTemplateContext>>('filter', { descendants: false });

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Custom move up icon template.
     * @group Templates
     */
    readonly moveUpIconTemplate = contentChild<TemplateRef<void>>('moveupicon', { descendants: false });

    /**
     * Custom move top icon template.
     * @group Templates
     */
    readonly moveTopIconTemplate = contentChild<TemplateRef<void>>('movetopicon', { descendants: false });

    /**
     * Custom move down icon template.
     * @group Templates
     */
    readonly moveDownIconTemplate = contentChild<TemplateRef<void>>('movedownicon', { descendants: false });

    /**
     * Custom move bottom icon template.
     * @group Templates
     */
    readonly moveBottomIconTemplate = contentChild<TemplateRef<void>>('movebottomicon', { descendants: false });

    /**
     * Custom filter icon template.
     * @group Templates
     */
    readonly filterIconTemplate = contentChild<TemplateRef<void>>('filtericon', { descendants: false });

    translation = toSignal(this.config.translationObserver, { initialValue: this.config.translation });

    moveUpAriaLabel = computed(() => (this.translation().aria ? this.translation().aria.moveUp : undefined));

    moveTopAriaLabel = computed(() => (this.translation().aria ? this.translation().aria.moveTop : undefined));

    moveDownAriaLabel = computed(() => (this.translation().aria ? this.translation().aria.moveDown : undefined));

    moveBottomAriaLabel = computed(() => (this.translation().aria ? this.translation().aria.moveBottom : undefined));

    _componentStyle = inject(OrderListStyle);

    filterOptions = computed<Nullable<OrderListFilterOptions>>(() =>
        this.filterBy()
            ? {
                  filter: (value) => this.onFilterKeyup(value),
                  reset: () => this.resetFilter()
              }
            : undefined
    );

    movedUp = signal<Nullable<boolean>>(undefined);

    movedDown = signal<Nullable<boolean>>(undefined);

    styleElement = signal<any>(undefined);

    id: string = uuid('pn_id_');

    public filterValue = signal<Nullable<string>>(undefined);

    public visibleOptions = linkedSignal<any[] | undefined, Nullable<any[]>>({
        source: this.value,
        computation: (value, previous) =>
            untracked(() => {
                if (this.filterValue()) {
                    return this.filterService.filter(value as any[], (this.filterBy() as string).split(','), this.filterValue(), this.filterMatchMode(), this.filterLocale());
                } else if (this.dragdrop()) {
                    // Initialize visibleOptions for drag&drop even when no filtering is active
                    return [...(value || [])];
                }
                return previous?.value;
            })
    });

    filterService = inject(FilterService);

    getButtonProps(direction: string) {
        switch (direction) {
            case 'up':
                return { ...this.buttonProps(), ...this.moveUpButtonProps() };
            case 'top':
                return { ...this.buttonProps(), ...this.moveTopButtonProps() };
            case 'down':
                return { ...this.buttonProps(), ...this.moveDownButtonProps() };
            case 'bottom':
                return { ...this.buttonProps(), ...this.moveBottomButtonProps() };
            default:
                return this.buttonProps();
        }
    }

    onInit() {
        if (this.responsive()) {
            this.createStyle();
        }
    }

    readonly templates = contentChildren(PrimeTemplate);

    _itemTemplate = computed<TemplateRef<OrderListItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => !['empty', 'emptyfilter', 'filter', 'header', 'moveupicon', 'movetopicon', 'movedownicon', 'movebottomicon', 'filtericon'].includes(item.getType()))
                .at(-1)?.template
    );

    _emptyMessageTemplate = computed<TemplateRef<void> | undefined>(() => this.findTemplate('empty'));

    _emptyFilterMessageTemplate = computed<TemplateRef<void> | undefined>(() => this.findTemplate('emptyfilter'));

    _filterTemplate = computed<TemplateRef<OrderListFilterTemplateContext> | undefined>(() => this.findTemplate('filter'));

    _headerTemplate = computed<TemplateRef<void> | undefined>(() => this.findTemplate('header'));

    _moveUpIconTemplate = computed<TemplateRef<void> | undefined>(() => this.findTemplate('moveupicon'));

    _moveTopIconTemplate = computed<TemplateRef<void> | undefined>(() => this.findTemplate('movetopicon'));

    _moveDownIconTemplate = computed<TemplateRef<void> | undefined>(() => this.findTemplate('movedownicon'));

    _moveBottomIconTemplate = computed<TemplateRef<void> | undefined>(() => this.findTemplate('movebottomicon'));

    _filterIconTemplate = computed<TemplateRef<void> | undefined>(() => this.findTemplate('filtericon'));

    private findTemplate(type: string) {
        return this.templates()
            .filter((item) => item.getType() === type)
            .at(-1)?.template;
    }

    onChangeSelection(e: ListboxChangeEvent) {
        //binding
        this.selection.set(e.value);

        //event
        this.onSelectionChange.emit({ originalEvent: e.originalEvent, value: e.value });
    }

    onFilterKeyup(event: Event) {
        this.filterValue.set(((<HTMLInputElement>event.target).value.trim() as any).toLocaleLowerCase(this.filterLocale()));
        this.filter();

        this.onFilterEvent.emit({
            originalEvent: event,
            value: this.visibleOptions() as any[]
        });
    }

    filter() {
        let searchFields: string[] = (this.filterBy() as string).split(',');
        this.visibleOptions.set(this.filterService.filter(this.value() as any[], searchFields, this.filterValue(), this.filterMatchMode(), this.filterLocale()));
    }

    /**
     * Callback to invoke on filter reset.
     * @group Method
     */
    public resetFilter() {
        this.filterValue.set('');
        this.listViewChild().resetFilter();
    }

    isItemVisible(item: any): boolean | undefined {
        const filterValue = this.filterValue();
        if (filterValue && filterValue.trim().length) {
            const visibleOptions = this.visibleOptions() as any[];
            for (let i = 0; i < visibleOptions.length; i++) {
                if (item == visibleOptions[i]) {
                    return true;
                }
            }
        } else {
            return true;
        }
    }

    isSelected(item: any) {
        return findIndexInList(item, this.selection()) !== -1;
    }

    isEmpty = computed(() => {
        const visibleOptions = this.visibleOptions();
        const value = this.value();
        return this.filterValue() ? !visibleOptions || visibleOptions.length === 0 : !value || value.length === 0;
    });

    moveUp() {
        const value = this.value();
        if (this.selection() && value instanceof Array) {
            // Sort selection by their current index to process them from top to bottom
            const sortedSelection = this.sortByIndexInList(this.selection(), value);

            for (let selectedItem of sortedSelection) {
                let selectedItemIndex: number = findIndexInList(selectedItem, value);
                // Only move if not at top and there's a valid position above
                if (selectedItemIndex > 0) {
                    let movedItem = value[selectedItemIndex];
                    let temp = value[selectedItemIndex - 1];
                    value[selectedItemIndex - 1] = movedItem;
                    value[selectedItemIndex] = temp;
                }
                // Don't break - continue with other items even if one can't move
            }

            if (this.dragdrop()) {
                if (this.filterValue()) {
                    this.filter();
                } else if (this.visibleOptions()) {
                    // Update visibleOptions to match value when no filtering
                    this.visibleOptions.set([...value]);
                }
            }

            this.movedUp.set(true);
            this.onReorder.emit(this.selection());
        }
        this.listViewChild().cd?.markForCheck();
    }

    moveTop() {
        const value = this.value();
        if (this.selection()) {
            for (let i = this.selection().length - 1; i >= 0; i--) {
                let selectedItem = this.selection()[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, value || []);

                if (selectedItemIndex != 0 && value instanceof Array) {
                    let movedItem = value.splice(selectedItemIndex, 1)[0];
                    value.unshift(movedItem);
                } else {
                    break;
                }
            }

            if (this.dragdrop()) {
                if (this.filterValue()) {
                    this.filter();
                } else if (this.visibleOptions()) {
                    // Update visibleOptions to match value when no filtering
                    this.visibleOptions.set([...(value || [])]);
                }
            }

            this.onReorder.emit(this.selection());
            setTimeout(() => {
                this.listViewChild().scrollInView(0);
            });
        }
        this.listViewChild().cd?.markForCheck();
    }

    moveDown() {
        const value = this.value();
        if (this.selection() && value instanceof Array) {
            const sortedSelection = this.sortByIndexInList(this.selection(), value).reverse();

            for (let selectedItem of sortedSelection) {
                let selectedItemIndex: number = findIndexInList(selectedItem, value);
                if (selectedItemIndex < value.length - 1) {
                    let movedItem = value[selectedItemIndex];
                    let temp = value[selectedItemIndex + 1];
                    value[selectedItemIndex + 1] = movedItem;
                    value[selectedItemIndex] = temp;
                }
            }

            if (this.dragdrop()) {
                if (this.filterValue()) {
                    this.filter();
                } else if (this.visibleOptions()) {
                    this.visibleOptions.set([...value]);
                }
            }

            this.movedDown.set(true);
            this.onReorder.emit(this.selection());
        }

        this.listViewChild().cd?.markForCheck();
    }

    moveBottom() {
        const value = this.value();
        if (this.selection()) {
            for (let i = 0; i < this.selection().length; i++) {
                let selectedItem = this.selection()[i];
                let selectedItemIndex: number = findIndexInList(selectedItem, value || []);

                if (value instanceof Array && selectedItemIndex != value.length - 1) {
                    let movedItem = value.splice(selectedItemIndex, 1)[0];
                    value.push(movedItem);
                } else {
                    break;
                }
            }

            if (this.dragdrop()) {
                if (this.filterValue()) {
                    this.filter();
                } else if (this.visibleOptions()) {
                    this.visibleOptions.set([...(value || [])]);
                }
            }

            this.onReorder.emit(this.selection());
            this.listViewChild().scrollInView(value?.length ? value.length - 1 : 0);
        }
        this.listViewChild().cd?.markForCheck();
    }

    onDrop(event: CdkDragDrop<string[]>) {
        let previousIndex = event.previousIndex;
        let currentIndex = event.currentIndex;
        const value = this.value();

        // Store the original state before any modifications
        const originalValue = [...(value || [])];
        const visibleOptions = this.visibleOptions();
        const originalVisibleOptions = visibleOptions ? [...visibleOptions] : null;

        if (previousIndex !== currentIndex) {
            // Determine items to move
            let itemsToMove: any[] = [];

            // Check if dragged item is in selected items AND we have multiple selections
            if (this.selection() && this.selection().length > 1 && findIndexInList(event.item.data, this.selection()) !== -1) {
                // Multi-selection: Move all selected items
                itemsToMove = [...this.selection()];

                // For multi-selection, restore original state to undo Listbox's automatic reordering
                if (value) {
                    value.length = 0;
                    value.push(...originalValue);
                }
                if (originalVisibleOptions && this.visibleOptions()) {
                    this.visibleOptions.set([...originalVisibleOptions]);
                }

                // Sort items by their index in the array to maintain relative order
                itemsToMove = this.sortByIndexInList(itemsToMove, value || []);

                // Calculate how many selected items are before the drop position
                let itemsBefore = 0;
                for (const item of itemsToMove) {
                    const itemIndex = findIndexInList(item, value || []);
                    if (itemIndex !== -1 && itemIndex < currentIndex) {
                        itemsBefore++;
                    }
                }

                // Remove all selected items (in reverse order to avoid index shifting)
                for (let i = itemsToMove.length - 1; i >= 0; i--) {
                    const itemIndex = findIndexInList(itemsToMove[i], value || []);
                    if (itemIndex !== -1) {
                        value?.splice(itemIndex, 1);
                    }
                }

                // Calculate the final target index
                // If we're dragging down, we need to subtract the number of items that were before the target
                const targetIndex = Math.max(0, currentIndex - itemsBefore);

                // Insert all selected items at the target position
                for (let i = 0; i < itemsToMove.length; i++) {
                    value?.splice(targetIndex + i, 0, itemsToMove[i]);
                }
                // Update visibleOptions to match value
                if (this.dragdrop()) {
                    if (this.filterValue()) {
                        this.filter();
                    } else if (this.visibleOptions()) {
                        this.visibleOptions.set([...(value || [])]);
                    }
                }

                // Ensure change detection runs
                this.cd?.markForCheck();

                this.onReorder.emit(itemsToMove);
            } else {
                // Single item: Move only the dragged item (let Listbox handle it)
                itemsToMove = [event.item.data];

                if (this.filterValue()) {
                    previousIndex = findIndexInList(event.item.data, value || []);
                    currentIndex = findIndexInList(this.visibleOptions()?.[currentIndex], value || []);
                }

                moveItemInArray(value as any[], previousIndex, currentIndex);

                // Sync visibleOptions for non-filtered case
                if (this.dragdrop() && this.visibleOptions() && !this.filterValue()) {
                    this.visibleOptions.set([...(value || [])]);
                }

                this.onReorder.emit([event.item.data]);
            }
        }
    }

    // Helper method to sort items by their index in a list
    private sortByIndexInList(items: any[], list: any[]): any[] {
        return items.sort((a, b) => {
            const indexA = findIndexInList(a, list);
            const indexB = findIndexInList(b, list);
            return indexA - indexB;
        });
    }

    onListFocus(event: any) {
        this.onFocus.emit(event);
    }

    onListBlur(event: any) {
        this.onBlur.emit(event);
    }

    getVisibleOptions = computed(() => {
        const visibleOptions = this.visibleOptions();
        const value = this.value();
        return visibleOptions && visibleOptions.length > 0 ? visibleOptions : value && value.length > 0 ? value : null;
    });

    moveDisabled = computed(() => {
        if (this.disabled() || !this.selection().length) {
            return true;
        }
    });

    createStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.styleElement()) {
                this.renderer.setAttribute(this.el.nativeElement.children[0], this.id, '');
                this.styleElement.set(this.renderer.createElement('style'));
                this.renderer.setAttribute(this.styleElement(), 'type', 'text/css');
                setAttribute(this.styleElement(), 'nonce', this.config?.csp()?.nonce);
                this.renderer.appendChild(this.document.head, this.styleElement());

                let innerHTML = `
                    @media screen and (max-width: ${this.breakpoint()}) {
                        .p-orderlist[${this.$attrSelector}] {
                            flex-direction: column;
                        }

                        .p-orderlist[${this.$attrSelector}] .p-orderlist-controls {
                            padding: var(--content-padding);
                            flex-direction: row;
                        }

                        .p-orderlist[${this.$attrSelector}] .p-orderlist-controls .p-button {
                            margin-right: var(--inline-spacing);
                            margin-bottom: 0;
                        }

                        .p-orderlist[${this.$attrSelector}] .p-orderlist-controls .p-button:last-child {
                            margin-right: 0;
                        }
                    }
                `;
                this.renderer.setProperty(this.styleElement(), 'innerHTML', innerHTML);
                setAttribute(this.styleElement(), 'nonce', this.config?.csp()?.nonce);
            }
        }
    }

    destroyStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.styleElement()) {
                this.renderer.removeChild(this.document, this.styleElement());
                this.styleElement.set(null);
                ``;
            }
        }
    }

    onDestroy() {
        this.destroyStyle();
    }
}

@NgModule({
    imports: [OrderList, SharedModule],
    exports: [OrderList, SharedModule]
})
export class OrderListModule {}
