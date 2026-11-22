import { CDK_DRAG_CONFIG, CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    InjectionToken,
    NgModule,
    TemplateRef,
    ViewEncapsulation,
    booleanAttribute,
    computed,
    forwardRef,
    inject,
    input,
    linkedSignal,
    numberAttribute,
    signal,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { equals, findLastIndex, findSingle, focus, getFirstFocusableElement, isEmpty, isFunction, isNotEmpty, isPrintableCharacter, resolveFieldData, uuid } from '@exhaustive-ui/utils';
import { FilterService, Footer, Header, PrimeTemplate, ScrollerOptions, SharedModule } from '@exhaustive-ui/core/api';
import { PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseEditableHolder } from '@exhaustive-ui/core/baseeditableholder';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { Checkbox } from '@exhaustive-ui/core/checkbox';
import { IconField } from '@exhaustive-ui/core/iconfield';
import { BlankIcon, CheckIcon, SearchIcon } from '@exhaustive-ui/core/icons';
import { InputIcon } from '@exhaustive-ui/core/inputicon';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { Ripple } from '@exhaustive-ui/core/ripple';
import { Scroller, ScrollerLazyLoadEvent } from '@exhaustive-ui/core/scroller';
import { Nullable } from '@exhaustive-ui/core/ts-helpers';
import {
    ListBoxPassThrough,
    ListboxChangeEvent,
    ListboxCheckIconTemplateContext,
    ListboxCheckmarkTemplateContext,
    ListboxClickEvent,
    ListboxDoubleClickEvent,
    ListboxFilterEvent,
    ListboxFilterOptions,
    ListboxFilterTemplateContext,
    ListboxFooterTemplateContext,
    ListboxGroupTemplateContext,
    ListboxHeaderTemplateContext,
    ListboxItemTemplateContext,
    ListboxLoaderTemplateContext,
    ListboxSelectAllChangeEvent
} from '@exhaustive-ui/core/types/listbox';
import { ListBoxStyle } from './style/listboxstyle';

const LISTBOX_INSTANCE = new InjectionToken<Listbox>('LISTBOX_INSTANCE');

export const LISTBOX_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Listbox),
    multi: true
};
/**
 * ListBox is used to select one or more values from a list of items.
 * @group Components
 */
@Component({
    selector: 'p-listbox, p-listBox, p-list-box',
    imports: [CommonModule, Ripple, Scroller, InputIcon, SearchIcon, Checkbox, CheckIcon, IconField, InputText, BlankIcon, FormsModule, SharedModule, DragDropModule, BindModule],
    template: `
        <span
            #firstHiddenFocusableElement
            role="presentation"
            class="p-hidden-accessible p-hidden-focusable"
            [tabindex]="!$disabled() ? tabindex() : -1"
            (focus)="onFirstHiddenFocus($event)"
            [attr.data-p-hidden-focusable]="true"
            [pBind]="ptm('hiddenFirstFocusableElement')"
        >
        </span>
        @if (headerFacet() || headerTemplate() || _headerTemplate()) {
            <div [class]="cx('header')" [pBind]="ptm('header')">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate(); context: { $implicit: modelValue(), options: visibleOptions() }"></ng-container>
            </div>
        }
        @if ((checkbox() && multiple() && showToggleAll()) || filter()) {
            <div [class]="cx('header')" [pBind]="ptm('header')">
                @if (checkbox() && multiple() && showToggleAll()) {
                    <p-checkbox
                        #headerchkbox
                        (onChange)="onToggleAll($event)"
                        [class]="cx('optionCheckIcon')"
                        [ngModel]="allSelected()"
                        [ngModelOptions]="{ standalone: true }"
                        [disabled]="$disabled()"
                        [tabindex]="-1"
                        [variant]="config.inputVariant() === 'filled' ? 'filled' : 'outlined'"
                        [binary]="true"
                        [attr.aria-label]="toggleAllAriaLabel()"
                        [pt]="ptm('pcCheckbox')"
                        [unstyled]="unstyled()"
                    >
                        @if (checkIconTemplate() || _checkIconTemplate()) {
                            <ng-template #icon>
                                <ng-template *ngTemplateOutlet="checkIconTemplate() || _checkIconTemplate(); context: { $implicit: allSelected() }"></ng-template>
                            </ng-template>
                        }
                    </p-checkbox>
                }
                @if (filterTemplate() || _filterTemplate()) {
                    <ng-container *ngTemplateOutlet="filterTemplate() || _filterTemplate(); context: { options: filterOptions() }"></ng-container>
                } @else {
                    @if (filter()) {
                        <p-iconfield [pt]="ptm('pcFilterContainer')" hostName="listbox" [unstyled]="unstyled()">
                            <input
                                #filterInput
                                pInputText
                                type="text"
                                [class]="cx('pcFilter')"
                                role="searchbox"
                                [value]="_filterValue() || ''"
                                [attr.disabled]="$disabled() ? '' : undefined"
                                [attr.aria-controls]="_id() + '_list'"
                                [attr.aria-activedescendant]="focusedOptionId()"
                                [attr.placeholder]="filterPlaceholder()"
                                [attr.aria-label]="ariaFilterLabel()"
                                [attr.tabindex]="!$disabled() && !focused() ? tabindex() : -1"
                                (input)="onFilterChange($event)"
                                (keydown)="onFilterKeyDown($event)"
                                (blur)="onFilterBlur($event)"
                                [pt]="ptm('pcFilter')"
                                [unstyled]="unstyled()"
                                hostName="listbox"
                            />
                            <p-inputicon [pt]="ptm('pcFilterIconContainer')" [unstyled]="unstyled()">
                                @if (!filterIconTemplate() && !_filterIconTemplate()) {
                                    <svg data-p-icon="search" [attr.aria-hidden]="true" [pBind]="ptm('filterIcon')" />
                                }
                                @if (filterIconTemplate() || _filterIconTemplate()) {
                                    <span [attr.aria-hidden]="true">
                                        <ng-template *ngTemplateOutlet="filterIconTemplate() || _filterIconTemplate()"></ng-template>
                                    </span>
                                }
                            </p-inputicon>
                        </p-iconfield>
                    }
                    <span role="status" [pBind]="ptm('hiddenFilterResult')" [attr.aria-live]="'polite'" class="p-hidden-accessible" [attr.data-p-hidden-accessible]="true">
                        {{ filterResultMessageText() }}
                    </span>
                }
            </div>
        }
        <div
            #container
            [class]="cn(cx('listContainer'), listStyleClass())"
            [ngStyle]="listStyle()"
            [style.max-height]="virtualScroll() ? 'auto' : scrollHeight() || 'auto'"
            cdkDropList
            [cdkDropListData]="cdkDropData()"
            (cdkDropListDropped)="drop($event)"
            (cdkDropListEntered)="onDragEntered()"
            (cdkDropListExited)="onDragExited()"
            [pBind]="ptm('listContainer')"
        >
            @if (hasFilter() && isEmpty()) {
                <div [class]="cx('emptyMessage')" [pBind]="ptm('emptyMessage')">
                    @if (!emptyFilterTemplate() && !_emptyFilterTemplate() && !_emptyTemplate() && !emptyTemplate()) {
                        {{ emptyFilterMessageText() }}
                    } @else {
                        <ng-container #emptyFilter *ngTemplateOutlet="emptyFilterTemplate() || _emptyFilterTemplate() || _emptyTemplate() || emptyTemplate()"></ng-container>
                    }
                </div>
            } @else if (!hasFilter() && isEmpty()) {
                <div [class]="cx('emptyMessage')" [pBind]="ptm('emptyMessage')">
                    @if (!emptyTemplate() && !_emptyTemplate()) {
                        {{ emptyMessage() }}
                    } @else {
                        <ng-container #empty *ngTemplateOutlet="emptyTemplate() || _emptyTemplate()"></ng-container>
                    }
                </div>
            } @else {
                @if (virtualScroll()) {
                    <p-scroller
                        [pt]="ptm('virtualScroller')"
                        hostName="listbox"
                        #scroller
                        [items]="visibleOptions()"
                        [style]="{ height: scrollHeight() }"
                        [itemSize]="virtualScrollItemSize()"
                        [autoSize]="true"
                        [lazy]="lazy()"
                        [options]="virtualScrollOptions()"
                        (onLazyLoad)="onLazyLoad.emit($event)"
                        [tabindex]="scrollerTabIndex()"
                    >
                        <ng-template #content let-items let-scrollerOptions="options">
                            <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: items, options: scrollerOptions }"></ng-container>
                        </ng-template>
                        @if (loaderTemplate() || _loaderTemplate()) {
                            <ng-template #loader let-scrollerOptions="options">
                                <ng-container *ngTemplateOutlet="loaderTemplate() || _loaderTemplate(); context: { options: scrollerOptions }"></ng-container>
                            </ng-template>
                        }
                    </p-scroller>
                }
                @if (!virtualScroll()) {
                    <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: visibleOptions(), options: {} }"></ng-container>
                }

                <ng-template #buildInItems let-items let-scrollerOptions="options">
                    <ul
                        #list
                        [id]="_id() + '_list'"
                        [class]="cx('list')"
                        role="listbox"
                        [tabindex]="-1"
                        [attr.aria-multiselectable]="true"
                        [ngClass]="scrollerOptions.contentStyleClass"
                        [style]="scrollerOptions.contentStyle"
                        [attr.aria-activedescendant]="focused() ? focusedOptionId() : undefined"
                        [attr.aria-label]="ariaLabel()"
                        [attr.aria-labelledby]="ariaLabelledBy()"
                        [attr.aria-disabled]="$disabled()"
                        (focus)="onListFocus($event)"
                        (blur)="onListBlur($event)"
                        (keydown)="onListKeyDown($event)"
                        [pBind]="ptm('list')"
                    >
                        @for (option of items; track $index; let i = $index) {
                            @if (isOptionGroup(option)) {
                                <li
                                    [attr.id]="_id() + '_' + getOptionIndex(i, scrollerOptions)"
                                    [class]="cx('optionGroup')"
                                    [pBind]="getPTOptions(option.optionGroup, scrollerOptions, i, 'optionGroup')"
                                    [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }"
                                    role="option"
                                    cdkDrag
                                    [cdkDragData]="option"
                                    [cdkDragDisabled]="!dragdrop()"
                                    (cdkDragStarted)="isDragging.set(true)"
                                    (cdkDragEnded)="isDragging.set(false)"
                                >
                                    @if (!groupTemplate() && !_groupTemplate()) {
                                        <span>{{ getOptionGroupLabel(option.optionGroup) }}</span>
                                    }
                                    <ng-container *ngTemplateOutlet="groupTemplate() || _groupTemplate(); context: { $implicit: option.optionGroup }"></ng-container>
                                </li>
                            }
                            @if (!isOptionGroup(option)) {
                                <li
                                    pRipple
                                    [class]="cx('option', { option, i, scrollerOptions })"
                                    role="option"
                                    [attr.id]="_id() + '_' + getOptionIndex(i, scrollerOptions)"
                                    [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }"
                                    [attr.aria-label]="getOptionLabel(option)"
                                    [attr.aria-selected]="isSelected(option)"
                                    [attr.aria-disabled]="isOptionDisabled(option)"
                                    [attr.aria-setsize]="ariaSetSize()"
                                    [attr.ariaPosInset]="getAriaPosInset(getOptionIndex(i, scrollerOptions))"
                                    [attr.data-p-selected]="isSelected(option)"
                                    [attr.data-p-focused]="focusedOptionIndex() === getOptionIndex(i, scrollerOptions)"
                                    [attr.data-p-disabled]="isOptionDisabled(option)"
                                    [pBind]="getPTOptions(option, scrollerOptions, i, 'option')"
                                    (click)="onOptionSelect($event, option, getOptionIndex(i, scrollerOptions))"
                                    (dblclick)="onOptionDoubleClick($event, option)"
                                    (mousedown)="onOptionMouseDown($event, getOptionIndex(i, scrollerOptions))"
                                    (mouseenter)="onOptionMouseEnter($event, getOptionIndex(i, scrollerOptions))"
                                    (touchend)="onOptionTouchEnd()"
                                    cdkDrag
                                    [cdkDragData]="option"
                                    [cdkDragDisabled]="!dragdrop()"
                                    (cdkDragStarted)="isDragging.set(true)"
                                    (cdkDragEnded)="isDragging.set(false)"
                                >
                                    @if (checkbox() && multiple()) {
                                        <p-checkbox
                                            [class]="cx('optionCheckIcon')"
                                            [ngModel]="isSelected(option)"
                                            [ngModelOptions]="{ standalone: true }"
                                            [readonly]="true"
                                            [disabled]="$disabled() || isOptionDisabled(option)"
                                            [tabindex]="-1"
                                            [variant]="config.inputVariant() === 'filled' ? 'filled' : 'outlined'"
                                            [binary]="true"
                                            [ariaLabel]="getOptionLabel(option)"
                                            [pt]="ptm('pcCheckbox')"
                                            hostName="listbox"
                                            [unstyled]="unstyled()"
                                        >
                                            @if (checkIconTemplate() || _checkIconTemplate()) {
                                                <ng-template #icon>
                                                    <ng-template *ngTemplateOutlet="checkIconTemplate() || _checkIconTemplate(); context: { $implicit: isSelected(option) }"></ng-template>
                                                </ng-template>
                                            }
                                        </p-checkbox>
                                    }
                                    @if (checkmark()) {
                                        @if (!checkmarkTemplate() && !_checkmarkTemplate()) {
                                            @if (!isSelected(option)) {
                                                <svg data-p-icon="blank" [class]="cx('optionBlankIcon')" [pBind]="ptm('optionBlankIcon')" />
                                            }
                                            @if (isSelected(option)) {
                                                <svg data-p-icon="check" [class]="cx('optionCheckIcon')" [pBind]="ptm('optionCheckIcon')" />
                                            }
                                        }
                                        <ng-container *ngTemplateOutlet="checkmarkTemplate() || _checkmarkTemplate(); context: { implicit: isSelected(option) }"></ng-container>
                                    }
                                    @if (!itemTemplate() && !_itemTemplate()) {
                                        <span>{{ getOptionLabel(option) }}</span>
                                    }
                                    <ng-container
                                        *ngTemplateOutlet="
                                            itemTemplate() || _itemTemplate();
                                            context: {
                                                $implicit: option,
                                                index: getOptionIndex(i, scrollerOptions),
                                                selected: isSelected(option),
                                                disabled: isOptionDisabled(option)
                                            }
                                        "
                                    ></ng-container>
                                </li>
                            }
                        }
                    </ul>
                </ng-template>
            }
        </div>
        @if (footerFacet() || footerTemplate() || _footerTemplate()) {
            <div>
                <ng-content select="p-footer"></ng-content>
                <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate(); context: { $implicit: modelValue(), options: visibleOptions() }"></ng-container>
            </div>
        }
        @if (isEmpty()) {
            <span role="status" aria-live="polite" class="p-hidden-accessible" [pBind]="ptm('hiddenEmptyMessage')">
                {{ emptyMessage() }}
            </span>
        }
        <span role="status" aria-live="polite" class="p-hidden-accessible" [pBind]="ptm('hiddenSelectedMessage')">
            {{ selectedMessageText() }}
        </span>
        <span
            #lastHiddenFocusableElement
            role="presentation"
            class="p-hidden-accessible p-hidden-focusable"
            [tabindex]="!$disabled() ? tabindex() : -1"
            (focus)="onLastHiddenFocus($event)"
            [attr.data-p-hidden-focusable]="true"
            [pBind]="ptm('hiddenLastFocusableEl')"
        >
        </span>
    `,
    providers: [
        LISTBOX_VALUE_ACCESSOR,
        ListBoxStyle,
        {
            provide: CDK_DRAG_CONFIG,
            useValue: {
                zIndex: 1200
            }
        },
        { provide: LISTBOX_INSTANCE, useExisting: Listbox },
        { provide: PARENT_INSTANCE, useExisting: Listbox }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.id]': '_id()',
        '[class]': "cx('root')",
        '[attr.data-p]': 'containerDataP()'
    },
    hostDirectives: [Bind]
})
export class Listbox extends BaseEditableHolder<ListBoxPassThrough> {
    filterService = inject(FilterService);

    componentName = 'Listbox';

    readonly hostName = input<any>('');

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcListbox: Listbox | undefined = inject(LISTBOX_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
    }

    /**
     * Unique identifier of the component.
     * @group Props
     */
    readonly id = input<string | undefined>();
    /**
     * Text to display when the search is active. Defaults to global value in i18n translation configuration.
     * @group Props
     * @defaultValue '{0} results are available'
     */
    readonly searchMessage = input<string | undefined>();
    /**
     * Text to display when filtering does not return any results. Defaults to global value in i18n translation configuration.
     * @group Props
     * @defaultValue 'No selected item'
     */
    readonly emptySelectionMessage = input<string | undefined>();
    /**
     * Text to be displayed in hidden accessible field when options are selected. Defaults to global value in i18n translation configuration.
     * @group Props
     * @defaultValue '{0} items selected'
     */
    readonly selectionMessage = input<string | undefined>();
    /**
     * Whether to focus on the first visible or selected element when the overlay panel is shown.
     * @group Props
     */
    readonly autoOptionFocus = input<boolean | undefined, unknown>(true, { transform: booleanAttribute });
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string | undefined>();
    /**
     * When enabled, the focused option is selected.
     * @group Props
     */
    readonly selectOnFocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When enabled, the hovered option will be focused.
     * @group Props
     */
    readonly focusOnHover = input<boolean | undefined, unknown>(true, { transform: booleanAttribute });
    /**
     * Text to display when filtering.
     * @group Props
     */
    readonly filterMessage = input<string | undefined>();
    /**
     * Fields used when filtering the options, defaults to optionLabel.
     * @group Props
     */
    readonly filterFields = input<any[] | undefined>();
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    readonly lazy = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    readonly virtualScroll = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Height of an item in the list for VirtualScrolling.
     * @group Props
     */
    readonly virtualScrollItemSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    readonly virtualScrollOptions = input<ScrollerOptions | undefined>();
    /**
     * Height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    readonly scrollHeight = input<string>('14rem');
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(0, { transform: numberAttribute });
    /**
     * When specified, allows selecting multiple values.
     * @group Props
     */
    readonly multiple = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Inline style of the list element.
     * @group Props
     */
    readonly listStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the list element.
     * @group Props
     */
    readonly listStyleClass = input<string | undefined>();
    /**
     * When present, it specifies that the element value cannot be changed.
     * @group Props
     */
    readonly readonly = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When specified, allows selecting items with checkboxes.
     * @group Props
     */
    readonly checkbox = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * When specified, displays a filter input at header.
     * @group Props
     */
    readonly filter = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
     * @group Props
     */
    readonly filterBy = input<string | undefined>();
    /**
     * Defines how the items are filtered.
     * @group Props
     */
    readonly filterMatchMode = input<'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte' | string>('contains');
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    readonly filterLocale = input<string | undefined>();
    /**
     * Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    readonly metaKeySelection = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * A property to uniquely identify a value in options.
     * @group Props
     */
    readonly dataKey = input<string | undefined>();
    /**
     * Whether header checkbox is shown in multiple mode.
     * @group Props
     */
    readonly showToggleAll = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Name of the label field of an option.
     * @group Props
     */
    readonly optionLabel = input<string | undefined>();
    /**
     * Name of the value field of an option.
     * @group Props
     */
    readonly optionValue = input<string | undefined>();
    /**
     * Name of the options field of an option group.
     * @group Props
     */
    readonly optionGroupChildren = input<string | undefined>('items');
    /**
     * Name of the label field of an option group.
     * @group Props
     */
    readonly optionGroupLabel = input<string | undefined>('label');
    /**
     * Name of the disabled field of an option or function to determine disabled state.
     * @group Props
     */
    readonly optionDisabled = input<string | ((item: any) => boolean) | undefined>();
    /**
     * Defines a string that labels the filter input.
     * @group Props
     */
    readonly ariaFilterLabel = input<string | undefined>();
    /**
     * Defines placeholder of the filter input.
     * @group Props
     */
    readonly filterPlaceholder = input<string | undefined>();
    /**
     * Text to display when filtering does not return any results.
     * @group Props
     */
    readonly emptyFilterMessage = input<string | undefined>();
    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    readonly emptyMessage = input<string | undefined>();
    /**
     * Whether to display options as grouped when nested options are provided.
     * @group Props
     */
    readonly group = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * An array of selectitems to display as the available options.
     * @group Props
     */
    readonly options = input<any[]>();
    /**
     * When specified, filter displays with this value.
     * @group Props
     */
    readonly filterValue = input<string>();
    /**
     * Whether all data is selected.
     * @group Props
     */
    readonly selectAll = input<boolean | undefined | null>(null);
    /**
     * Whether to displays rows with alternating colors.
     * @group Props
     * @defaultValue false
     */
    readonly striped = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the selected option will be add highlight class.
     * @group Props
     * @defaultValue true
     */
    readonly highlightOnSelect = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether the selected option will be shown with a check mark.
     * @group Props
     * @defaultValue false
     */
    readonly checkmark = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether to enable dragdrop based reordering.
     * @group Props
     */
    readonly dragdrop = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Array to use for CDK drop list data binding. When not provided, uses options array.
     * @group Props
     */
    readonly dropListData = input<any[] | undefined>();

    /**
     * Computed property for stable CDK drop list data reference
     */
    cdkDropData = computed(() => {
        return this.dropListData() || this._options();
    });
    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });
    /**
     * Callback to invoke on value change.
     * @param {ListboxChangeEvent} event - Custom change event.
     * @group Emits
     */
    readonly onChange = output<ListboxChangeEvent>();
    /**
     * Callback to invoke when option is clicked.
     * @param {ListboxClickEvent} event - Custom click event.
     * @group Emits
     */
    readonly onClick = output<ListboxClickEvent>();
    /**
     * Callback to invoke when option is double clicked.
     * @param {ListboxDoubleClickEvent} event - Custom double click event.
     * @group Emits
     */
    readonly onDblClick = output<ListboxDoubleClickEvent>();
    /**
     * Callback to invoke when data is filtered.
     * @param {ListboxFilterEvent} event - Custom filter event.
     * @group Emits
     */
    readonly onFilter = output<ListboxFilterEvent>();
    /**
     * Callback to invoke when component receives focus.
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    readonly onFocus = output<FocusEvent>();
    /**
     * Callback to invoke when component loses focus.
     * @param {FocusEvent} event - Blur event.
     * @group Emits
     */
    readonly onBlur = output<FocusEvent>();
    /**
     * Callback to invoke when all data is selected.
     * @param {ListboxSelectAllChangeEvent} event - Custom select event.
     * @group Emits
     */
    readonly onSelectAllChange = output<ListboxSelectAllChangeEvent>();
    /**
     * Emits on lazy load.
     * @param {ScrollerLazyLoadEvent} event - Scroller lazy load event.
     * @group Emits
     */
    readonly onLazyLoad = output<ScrollerLazyLoadEvent>();
    /**
     * Emits on item is dropped.
     * @param {CdkDragDrop<string[]>} event - Scroller lazy load event.
     * @group Emits
     */
    readonly onDrop = output<CdkDragDrop<string[]>>();

    readonly headerCheckboxViewChild = viewChild<Nullable<ElementRef>>('headerchkbox');

    readonly filterViewChild = viewChild<Nullable<ElementRef>>('filterInput');

    readonly lastHiddenFocusableElement = viewChild.required<ElementRef>('lastHiddenFocusableElement');

    readonly firstHiddenFocusableElement = viewChild.required<ElementRef>('firstHiddenFocusableElement');

    readonly scroller = viewChild<Nullable<Scroller>>('scroller');

    readonly listViewChild = viewChild<Nullable<ElementRef>>('list');

    readonly containerViewChild = viewChild<Nullable<ElementRef>>('container');

    readonly headerFacet = contentChild(Header);

    readonly footerFacet = contentChild(Footer);

    /**
     * Custom item template.
     * @param {ListboxItemTemplateContext} context - item context.
     * @see {@link ListboxItemTemplateContext}
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<ListboxItemTemplateContext>>('item', { descendants: false });

    /**
     * Custom group template.
     * @param {ListboxGroupTemplateContext} context - group context.
     * @see {@link ListboxGroupTemplateContext}
     * @group Templates
     */
    readonly groupTemplate = contentChild<TemplateRef<ListboxGroupTemplateContext>>('group', { descendants: false });

    /**
     * Custom header template.
     * @param {ListboxHeaderTemplateContext} context - header context.
     * @see {@link ListboxHeaderTemplateContext}
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<ListboxHeaderTemplateContext>>('header', { descendants: false });

    /**
     * Custom filter template.
     * @param {ListboxFilterTemplateContext} context - filter context.
     * @see {@link ListboxFilterTemplateContext}
     * @group Templates
     */
    readonly filterTemplate = contentChild<TemplateRef<ListboxFilterTemplateContext>>('filter', { descendants: false });

    /**
     * Custom footer template.
     * @param {ListboxFooterTemplateContext} context - footer context.
     * @see {@link ListboxFooterTemplateContext}
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<ListboxFooterTemplateContext>>('footer', { descendants: false });

    /**
     * Custom empty filter message template.
     * @group Templates
     */
    readonly emptyFilterTemplate = contentChild<TemplateRef<void>>('emptyfilter', { descendants: false });

    /**
     * Custom empty message template.
     * @group Templates
     */
    readonly emptyTemplate = contentChild<TemplateRef<void>>('empty', { descendants: false });

    /**
     * Custom filter icon template.
     * @group Templates
     */
    readonly filterIconTemplate = contentChild<TemplateRef<void>>('filtericon', { descendants: false });

    /**
     * Custom check icon template.
     * @param {ListboxCheckIconTemplateContext} context - check icon context.
     * @see {@link ListboxCheckIconTemplateContext}
     * @group Templates
     */
    readonly checkIconTemplate = contentChild<TemplateRef<ListboxCheckIconTemplateContext>>('checkicon', { descendants: false });

    /**
     * Custom checkmark icon template.
     * @param {ListboxCheckmarkTemplateContext} context - checkmark context.
     * @see {@link ListboxCheckmarkTemplateContext}
     * @group Templates
     */
    readonly checkmarkTemplate = contentChild<TemplateRef<ListboxCheckmarkTemplateContext>>('checkmark', { descendants: false });

    /**
     * Custom loader template.
     * @param {ListboxLoaderTemplateContext} context - loader context.
     * @see {@link ListboxLoaderTemplateContext}
     * @group Templates
     */
    readonly loaderTemplate = contentChild<TemplateRef<ListboxLoaderTemplateContext>>('loader', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    _itemTemplate = computed<TemplateRef<ListboxItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => !['group', 'header', 'filter', 'footer', 'empty', 'emptyfilter', 'filtericon', 'checkicon', 'checkmark', 'loader'].includes(item.getType()))
                .at(-1)?.template
    );

    _groupTemplate = computed<TemplateRef<ListboxGroupTemplateContext> | undefined>(() => this.findTemplate('group'));

    _headerTemplate = computed<TemplateRef<ListboxHeaderTemplateContext> | undefined>(() => this.findTemplate('header'));

    _filterTemplate = computed<TemplateRef<ListboxFilterTemplateContext> | undefined>(() => this.findTemplate('filter'));

    _footerTemplate = computed<TemplateRef<ListboxFooterTemplateContext> | undefined>(() => this.findTemplate('footer'));

    _emptyFilterTemplate = computed<TemplateRef<void> | undefined>(() => this.findTemplate('emptyfilter'));

    _emptyTemplate = computed<TemplateRef<void> | undefined>(() => this.findTemplate('empty'));

    _filterIconTemplate = computed<TemplateRef<void> | undefined>(() => this.findTemplate('filtericon'));

    _checkIconTemplate = computed<TemplateRef<ListboxCheckIconTemplateContext> | undefined>(() => this.findTemplate('checkicon'));

    _checkmarkTemplate = computed<TemplateRef<ListboxCheckmarkTemplateContext> | undefined>(() => this.findTemplate('checkmark'));

    _loaderTemplate = computed<TemplateRef<ListboxLoaderTemplateContext> | undefined>(() => this.findTemplate('loader'));

    public _filterValue = linkedSignal<string | null | undefined>(() => this.filterValue() ?? null);

    filterOptions = computed<ListboxFilterOptions | undefined>(() =>
        this.filterBy()
            ? {
                  filter: (value) => this.onFilterChange(value),
                  reset: () => this.resetFilter()
              }
            : undefined
    );

    public value = signal<any | undefined | null>(undefined);

    public optionTouched = signal<boolean | undefined | null>(undefined);

    translation = toSignal(this.config.translationObserver, { initialValue: this.config.translation });

    focused = signal<boolean | undefined>(undefined);

    scrollerTabIndex = signal<string>('0');

    _componentStyle = inject(ListBoxStyle);

    _id = computed(() => this.id() || uuid('pn_id_'));

    focusedOptionId = computed(() => (this.focusedOptionIndex() !== -1 ? `${this._id()}_${this.focusedOptionIndex()}` : null));

    filterResultMessageText = computed(() => (isNotEmpty(this.visibleOptions()) ? this.filterMessageText().replaceAll('{0}', this.visibleOptions().length) : this.emptyFilterMessageText()));

    filterMessageText = computed(() => this.filterMessage() || this.translation().searchMessage || '');

    searchMessageText = computed(() => this.searchMessage() || this.translation().searchMessage || '');

    emptyFilterMessageText = computed(() => this.emptyFilterMessage() || this.translation().emptySearchMessage || this.translation().emptyFilterMessage || '');

    selectionMessageText = computed(() => this.selectionMessage() || this.translation().selectionMessage || '');

    emptySelectionMessageText = computed(() => this.emptySelectionMessage() || this.translation().emptySelectionMessage || '');

    selectedMessageText = computed(() => (this.hasSelectedOption() ? this.selectionMessageText().replaceAll('{0}', this.multiple() ? this.modelValue().length : '1') : this.emptySelectionMessageText()));

    ariaSetSize = computed(() => this.visibleOptions().filter((option) => !this.isOptionGroup(option)).length);

    virtualScrollerDisabled = computed(() => !this.virtualScroll());

    searchFields = computed(() => this.filterBy()?.split(',') || this.filterFields() || [this.optionLabel()]);

    toggleAllAriaLabel = computed(() => (this.translation().aria ? this.translation().aria[this.allSelected() ? 'selectAll' : 'unselectAll'] : undefined));

    searchValue = signal<string | undefined>(undefined);

    searchTimeout = signal<any>(undefined);

    _options = linkedSignal<any>(() => this.options() ?? null);

    startRangeIndex = signal<number>(-1);

    focusedOptionIndex = signal<number>(-1);

    isDragging = signal<boolean>(false);

    @HostListener('focusout', ['$event'])
    onHostFocusOut(event: FocusEvent) {
        this.onFocusout(event);
    }

    visibleOptions = computed(() => {
        const options = this.group() ? this.flatOptions(this._options()) : this._options() || [];
        return this._filterValue() ? this.filterService.filter(options, this.searchFields(), this._filterValue(), this.filterMatchMode(), this.filterLocale()) : options;
    });

    onInit() {
        this.autoUpdateModel();
    }

    private findTemplate(type: string) {
        return this.templates()
            .filter((item) => item.getType() === type)
            .at(-1)?.template;
    }

    flatOptions(options) {
        return (options || []).reduce((result, option, index) => {
            result.push({ optionGroup: option, group: true, index });

            const optionGroupChildren = this.getOptionGroupChildren(option);

            optionGroupChildren && optionGroupChildren.forEach((o) => result.push(o));

            return result;
        }, []);
    }

    autoUpdateModel() {
        if (this.selectOnFocus() && this.autoOptionFocus() && !this.hasSelectedOption() && !this.multiple()) {
            const focusedOptionIndex = this.findFirstFocusedOptionIndex();
            this.focusedOptionIndex.set(focusedOptionIndex);
            this.onOptionSelect(null, this.visibleOptions()[this.focusedOptionIndex()]);
        }
    }
    /**
     * Updates the model value.
     * @group Method
     */
    public updateModel(value, event?) {
        this.value.set(value);
        this.writeModelValue(value);
        this.onModelChange(value);

        this.onChange.emit({ originalEvent: event, value: this.value() });
    }

    removeOption(option) {
        return this.modelValue().filter((val) => !equals(val, this.getOptionValue(option), this.equalityKey() || ''));
    }

    onOptionSelect(event, option, index = -1) {
        if (this.$disabled() || this.isOptionDisabled(option) || this.readonly()) {
            return;
        }

        event && this.onClick.emit({ originalEvent: event, option, value: this.value() });
        this.multiple() ? this.onOptionSelectMultiple(event, option) : this.onOptionSelectSingle(event, option);
        this.optionTouched.set(false);
        index !== -1 && this.focusedOptionIndex.set(index);
    }

    onOptionSelectMultiple(event, option) {
        let selected = this.isSelected(option);
        let value: any[] = [];
        let metaSelection = this.optionTouched() ? false : this.metaKeySelection();

        if (metaSelection) {
            let metaKey = event.metaKey || event.ctrlKey;

            if (selected) {
                value = metaKey ? this.removeOption(option) : [this.getOptionValue(option)];
            } else {
                value = metaKey ? this.modelValue() || [] : [];
                value = [...(value || []), this.getOptionValue(option)];
            }
        } else {
            value = selected ? this.removeOption(option) : [...(this.modelValue() || []), this.getOptionValue(option)];
        }

        this.updateModel(value, event);
    }

    onOptionSelectSingle(event, option) {
        let selected = this.isSelected(option);
        let valueChanged = false;
        let value = null;
        let metaSelection = this.optionTouched() ? false : this.metaKeySelection();

        if (metaSelection) {
            let metaKey = event.metaKey || event.ctrlKey;

            if (selected) {
                if (metaKey) {
                    value = null;
                    valueChanged = true;
                }
            } else {
                value = this.getOptionValue(option);
                valueChanged = true;
            }
        } else {
            value = selected ? null : this.getOptionValue(option);
            valueChanged = true;
        }

        if (valueChanged) {
            this.updateModel(value, event);
        }
    }

    onOptionSelectRange(event, start = -1, end = -1) {
        start === -1 && (start = this.findNearestSelectedOptionIndex(end, true));
        end === -1 && (end = this.findNearestSelectedOptionIndex(start));

        if (start !== -1 && end !== -1) {
            const rangeStart = Math.min(start, end);
            const rangeEnd = Math.max(start, end);
            const value = this.visibleOptions()
                .slice(rangeStart, rangeEnd + 1)
                .filter((option) => this.isValidOption(option))
                .map((option) => this.getOptionValue(option));

            this.updateModel(value, event);
        }
    }

    onToggleAll(event) {
        if (this.$disabled() || this.readonly()) {
            return;
        }
        focus(this.headerCheckboxViewChild()?.nativeElement);

        if (this.selectAll() !== null) {
            this.onSelectAllChange.emit({
                originalEvent: event,
                checked: !this.allSelected()
            });
        } else {
            // pre-selected disabled options stay selected either way
            const isSelectedDisabled = (option) => !this.isOptionGroup(option) && this.isOptionDisabled(option) && this.isSelected(option);
            const value = this.allSelected()
                ? this.visibleOptions()
                      .filter((option) => isSelectedDisabled(option))
                      .map((option) => this.getOptionValue(option))
                : this.visibleOptions()
                      .filter((option) => this.isValidOption(option) || isSelectedDisabled(option))
                      .map((option) => this.getOptionValue(option));

            this.updateModel(value, event);
            this.onChange.emit({ originalEvent: event, value: this.value() });
        }
    }

    allSelected = computed(() => (this.selectAll() !== null ? this.selectAll() : isNotEmpty(this.visibleOptions()) && this.visibleOptions().every((option) => this.isOptionGroup(option) || this.isOptionDisabled(option) || this.isSelected(option))));

    onOptionTouchEnd() {
        if (this.$disabled()) {
            return;
        }

        this.optionTouched.set(true);
    }

    onOptionMouseDown(event: MouseEvent, index: number) {
        this.changeFocusedOptionIndex(event, index);
    }

    onOptionMouseEnter(event: MouseEvent, index: number) {
        if (this.focusOnHover() && this.focused()) {
            this.changeFocusedOptionIndex(event, index);
        }
    }

    onOptionDoubleClick(event: MouseEvent, option: any) {
        if (this.$disabled() || this.isOptionDisabled(option) || this.readonly()) {
            return;
        }

        this.onDblClick.emit({
            originalEvent: event,
            option: option,
            value: this.value()
        });
    }

    onFirstHiddenFocus(event: FocusEvent) {
        focus(this.listViewChild()?.nativeElement);
        const firstFocusableEl = getFirstFocusableElement(this.el?.nativeElement, ':not([data-p-hidden-focusable="true"])');
        const lastHiddenFocusableElement = this.lastHiddenFocusableElement();
        const firstHiddenFocusableElement = this.firstHiddenFocusableElement();
        lastHiddenFocusableElement.nativeElement.tabIndex = isEmpty(firstFocusableEl) ? -1 : undefined;
        firstHiddenFocusableElement.nativeElement.tabIndex = -1;
    }

    onLastHiddenFocus(event: FocusEvent) {
        const relatedTarget = event.relatedTarget;

        if (relatedTarget === this.listViewChild()?.nativeElement) {
            const firstFocusableEl = <any>getFirstFocusableElement(this.el?.nativeElement, ':not([data-p-hidden-focusable="true"])');

            focus(firstFocusableEl);
            this.firstHiddenFocusableElement().nativeElement.tabIndex = undefined;
        } else {
            focus(this.firstHiddenFocusableElement().nativeElement);
        }
        this.lastHiddenFocusableElement().nativeElement.tabIndex = -1;
    }

    onFocusout(event: FocusEvent) {
        const lastHiddenFocusableElement = this.lastHiddenFocusableElement();
        const firstHiddenFocusableElement = this.firstHiddenFocusableElement();
        if (!this.el.nativeElement.contains(event.relatedTarget)) {
            firstHiddenFocusableElement.nativeElement.tabIndex = lastHiddenFocusableElement.nativeElement.tabIndex = undefined;
            this.scrollerTabIndex.set('0');
        }
    }

    onListFocus(event: FocusEvent) {
        this.focused.set(true);
        const focusedOptionIndex = this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : this.findSelectedOptionIndex();
        this.focusedOptionIndex.set(focusedOptionIndex);
        this.scrollInView(focusedOptionIndex);
        this.onFocus.emit(event);

        this.scrollerTabIndex.set('-1');
    }

    onListBlur(event: FocusEvent) {
        this.focused.set(false);
        this.focusedOptionIndex.set(-1);
        this.startRangeIndex.set(-1);
        this.searchValue.set('');
        this.onBlur.emit(event);
    }

    onFilterChange(event: Event) {
        let value: string = (event.target as HTMLInputElement).value?.trim();
        this._filterValue.set(value);
        this.focusedOptionIndex.set(-1);
        this.startRangeIndex.set(-1);
        this.onFilter.emit({ originalEvent: event, filter: this._filterValue() });

        !this.virtualScrollerDisabled() && this.scroller()?.scrollToIndex(0);
    }

    onFilterBlur(event: FocusEvent) {
        this.focusedOptionIndex.set(-1);
        this.startRangeIndex.set(-1);
    }

    onListKeyDown(event: KeyboardEvent) {
        const target = event.target as HTMLElement;
        // keys typed in a field of an item template (input, editor...) belong to that field
        if (target !== event.currentTarget && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) {
            return;
        }

        const metaKey = event.metaKey || event.ctrlKey;

        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onArrowUpKey(event);
                break;

            case 'Home':
                this.onHomeKey(event);
                break;

            case 'End':
                this.onEndKey(event);
                break;

            case 'PageDown':
                this.onPageDownKey(event);
                break;

            case 'PageUp':
                this.onPageUpKey(event);
                break;

            case 'Enter':
            case 'Space':
            case 'NumpadEnter':
                this.onSpaceKey(event);
                break;

            case 'Tab':
                //NOOP
                break;

            case 'ShiftLeft':
            case 'ShiftRight':
                this.onShiftKey();
                break;

            default:
                if (this.multiple() && event.code === 'KeyA' && metaKey) {
                    const value = this.visibleOptions()
                        .filter((option) => this.isValidOption(option))
                        .map((option) => this.getOptionValue(option));

                    this.updateModel(value, event);

                    event.preventDefault();
                    break;
                }

                if (!metaKey && isPrintableCharacter(event.key)) {
                    this.searchOptions(event, event.key);
                    event.preventDefault();
                }

                break;
        }
    }

    onFilterKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onArrowUpKey(event);
                break;

            case 'ArrowLeft':
            case 'ArrowRight':
                this.onArrowLeftKey(event, true);
                break;

            case 'Home':
                this.onHomeKey(event, true);
                break;

            case 'End':
                this.onEndKey(event, true);
                break;

            case 'Enter':
                this.onEnterKey(event);
                break;

            case 'ShiftLeft':
            case 'ShiftRight':
                this.onShiftKey();
                break;

            default:
                break;
        }
    }

    onArrowDownKey(event: KeyboardEvent) {
        const optionIndex = this.focusedOptionIndex() !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex()) : this.findFirstFocusedOptionIndex();

        if (this.multiple() && event.shiftKey) {
            this.onOptionSelectRange(event, this.startRangeIndex(), optionIndex);
        }

        this.changeFocusedOptionIndex(event, optionIndex);
        event.preventDefault();
    }

    onArrowUpKey(event: KeyboardEvent) {
        const optionIndex = this.focusedOptionIndex() !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex()) : this.findLastFocusedOptionIndex();

        if (this.multiple() && event.shiftKey) {
            this.onOptionSelectRange(event, optionIndex, this.startRangeIndex());
        }

        this.changeFocusedOptionIndex(event, optionIndex);
        event.preventDefault();
    }

    onArrowLeftKey(event: KeyboardEvent, pressedInInputText = false) {
        pressedInInputText && this.focusedOptionIndex.set(-1);
    }

    onHomeKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        if (pressedInInputText) {
            (event.currentTarget as HTMLInputElement).setSelectionRange(0, 0);
            this.focusedOptionIndex.set(-1);
        } else {
            let metaKey = event.metaKey || event.ctrlKey;
            let optionIndex = this.findFirstOptionIndex();

            if (this.multiple() && event.shiftKey && metaKey) {
                this.onOptionSelectRange(event, optionIndex, this.startRangeIndex());
            }

            this.changeFocusedOptionIndex(event, optionIndex);
        }

        event.preventDefault();
    }

    onEndKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        if (pressedInInputText) {
            const target = event.currentTarget as HTMLInputElement;
            const len = target.value.length;

            target.setSelectionRange(len, len);
            this.focusedOptionIndex.set(-1);
        } else {
            let metaKey = event.metaKey || event.ctrlKey;
            let optionIndex = this.findLastOptionIndex();

            if (this.multiple() && event.shiftKey && metaKey) {
                this.onOptionSelectRange(event, this.startRangeIndex(), optionIndex);
            }

            this.changeFocusedOptionIndex(event, optionIndex);
        }

        event.preventDefault();
    }

    onPageDownKey(event: KeyboardEvent) {
        this.changeFocusedOptionIndex(event, this.findPageOptionIndex(1));
        event.preventDefault();
    }

    onPageUpKey(event: KeyboardEvent) {
        this.changeFocusedOptionIndex(event, this.findPageOptionIndex(-1));
        event.preventDefault();
    }

    /**
     * Index of the option one page away from the focused option: a page is the number of options the
     * list shows at once, so PageDown/PageUp move the focus like a scroll of the list.
     */
    findPageOptionIndex(direction: 1 | -1): number {
        const focusedIndex = this.focusedOptionIndex();
        const firstIndex = this.findFirstOptionIndex();
        const lastIndex = this.findLastOptionIndex();

        if (focusedIndex === -1) {
            return direction > 0 ? firstIndex : lastIndex;
        }

        const container = this.containerViewChild()?.nativeElement as HTMLElement | undefined;
        const option = findSingle(this.listViewChild()?.nativeElement, `li[id="${this.focusedOptionId()}"]`) as HTMLElement | null;
        const optionHeight = this.virtualScroll() ? this.virtualScrollItemSize() : option?.offsetHeight;
        const pageSize = container?.clientHeight && optionHeight ? Math.max(1, Math.floor(container.clientHeight / optionHeight)) : 10;
        const index = focusedIndex + direction * pageSize;

        if (direction > 0) {
            return index >= lastIndex ? lastIndex : this.findNextOptionIndex(index - 1);
        }

        return index <= firstIndex ? firstIndex : this.findPrevOptionIndex(index + 1);
    }

    onEnterKey(event) {
        if (this.focusedOptionIndex() !== -1) {
            if (this.multiple() && event.shiftKey) this.onOptionSelectRange(event, this.focusedOptionIndex());
            else this.onOptionSelect(event, this.visibleOptions()[this.focusedOptionIndex()]);
        }

        event.preventDefault();
    }

    onSpaceKey(event: KeyboardEvent) {
        this.onEnterKey(event);
    }

    onShiftKey() {
        const focusedOptionIndex = this.focusedOptionIndex();
        this.startRangeIndex.set(focusedOptionIndex);
    }

    getOptionGroupChildren(optionGroup) {
        return this.optionGroupChildren() ? resolveFieldData(optionGroup, this.optionGroupChildren()) : optionGroup.items;
    }

    getOptionGroupLabel(optionGroup: any) {
        return this.optionGroupLabel() ? resolveFieldData(optionGroup, this.optionGroupLabel()) : optionGroup && optionGroup.label !== undefined ? optionGroup.label : optionGroup;
    }

    getOptionLabel(option) {
        return this.optionLabel() ? resolveFieldData(option, this.optionLabel()) : option.label != undefined ? option.label : option;
    }

    getOptionIndex(index, scrollerOptions) {
        return this.virtualScrollerDisabled() ? index : scrollerOptions && scrollerOptions.getItemOptions(index)['index'];
    }

    getOptionValue(option: any) {
        return this.optionValue() ? resolveFieldData(option, this.optionValue()) : !this.optionLabel() && option && option.value !== undefined ? option.value : option;
    }

    getAriaPosInset(index: number) {
        return (
            (this.optionGroupLabel()
                ? index -
                  this.visibleOptions()
                      .slice(0, index)
                      .filter((option) => this.isOptionGroup(option)).length
                : index) + 1
        );
    }

    getPTOptions(option: any, itemOptions: any, index: number, key: string) {
        return this.ptm(key, {
            context: {
                selected: this.isSelected(option),
                focused: this.focusedOptionIndex() === this.getOptionIndex(index, itemOptions),
                disabled: this.isOptionDisabled(option)
            }
        });
    }

    hasSelectedOption = computed(() => isNotEmpty(this.modelValue()));

    isOptionGroup(option) {
        return this.optionGroupLabel() && option.optionGroup && option.group;
    }

    changeFocusedOptionIndex(event, index) {
        if (this.focusedOptionIndex() !== index) {
            this.focusedOptionIndex.set(index);
            this.scrollInView();

            if (this.selectOnFocus() && !this.multiple()) {
                this.onOptionSelect(event, this.visibleOptions()[index]);
            }
        }
    }

    searchOptions(event, char) {
        this.searchValue.set((this.searchValue() || '') + char);

        let optionIndex = -1;
        let matched = false;

        if (this.focusedOptionIndex() !== -1) {
            optionIndex = this.visibleOptions()
                .slice(this.focusedOptionIndex())
                .findIndex((option) => this.isOptionMatched(option));
            optionIndex =
                optionIndex === -1
                    ? this.visibleOptions()
                          .slice(0, this.focusedOptionIndex())
                          .findIndex((option) => this.isOptionMatched(option))
                    : optionIndex + this.focusedOptionIndex();
        } else {
            optionIndex = this.visibleOptions().findIndex((option) => this.isOptionMatched(option));
        }

        if (optionIndex !== -1) {
            matched = true;
        }

        if (optionIndex === -1 && this.focusedOptionIndex() === -1) {
            optionIndex = this.findFirstFocusedOptionIndex();
        }

        if (optionIndex !== -1) {
            this.changeFocusedOptionIndex(event, optionIndex);
        }

        if (this.searchTimeout()) {
            clearTimeout(this.searchTimeout());
        }

        this.searchTimeout.set(
            setTimeout(() => {
                this.searchValue.set('');
                this.searchTimeout.set(null);
            }, 500)
        );

        return matched;
    }

    isOptionMatched(option) {
        return this.isValidOption(option) && this.getOptionLabel(option)?.toLocaleLowerCase(this.filterLocale()).startsWith(this.searchValue()?.toLocaleLowerCase(this.filterLocale()));
    }

    scrollInView(index = -1) {
        const id = index !== -1 ? `${this._id()}_${index}` : this.focusedOptionId();
        const element = findSingle(this.listViewChild()?.nativeElement, `li[id="${id}"]`);

        if (element) {
            element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        } else if (!this.virtualScrollerDisabled()) {
            this.virtualScroll() && this.scroller()?.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex());
        }
    }

    findFirstOptionIndex() {
        return this.visibleOptions().findIndex((option) => this.isValidOption(option));
    }

    findLastOptionIndex() {
        return findLastIndex(this.visibleOptions(), (option) => this.isValidOption(option));
    }

    findFirstFocusedOptionIndex() {
        const selectedIndex = this.findFirstSelectedOptionIndex();

        return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    }

    findLastFocusedOptionIndex() {
        const selectedIndex = this.findLastSelectedOptionIndex();

        return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    }

    findLastSelectedOptionIndex() {
        return this.hasSelectedOption() ? findLastIndex(this.visibleOptions(), (option) => this.isValidSelectedOption(option)) : -1;
    }

    findNextOptionIndex(index) {
        const matchedOptionIndex =
            index < this.visibleOptions().length - 1
                ? this.visibleOptions()
                      .slice(index + 1)
                      .findIndex((option) => this.isValidOption(option))
                : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index;
    }

    findNextSelectedOptionIndex(index) {
        const matchedOptionIndex =
            this.hasSelectedOption() && index < this.visibleOptions().length - 1
                ? this.visibleOptions()
                      .slice(index + 1)
                      .findIndex((option) => this.isValidSelectedOption(option))
                : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : -1;
    }

    findPrevSelectedOptionIndex(index) {
        const matchedOptionIndex = this.hasSelectedOption() && index > 0 ? findLastIndex(this.visibleOptions().slice(0, index), (option) => this.isValidSelectedOption(option)) : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex : -1;
    }

    findFirstSelectedOptionIndex() {
        return this.hasSelectedOption() ? this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option)) : -1;
    }

    findPrevOptionIndex(index) {
        const matchedOptionIndex = index > 0 ? findLastIndex(this.visibleOptions().slice(0, index), (option) => this.isValidOption(option)) : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    }

    findSelectedOptionIndex() {
        if (this.$filled()) {
            if (this.multiple()) {
                for (let index = this.modelValue().length - 1; index >= 0; index--) {
                    const value = this.modelValue()[index];
                    const matchedOptionIndex = this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option) && this.isEquals(value, this.getOptionValue(option)));

                    if (matchedOptionIndex > -1) return matchedOptionIndex;
                }
            } else {
                return this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option));
            }
        }

        return -1;
    }

    findNearestSelectedOptionIndex(index, firstCheckUp = false) {
        let matchedOptionIndex = -1;

        if (this.hasSelectedOption()) {
            if (firstCheckUp) {
                matchedOptionIndex = this.findPrevSelectedOptionIndex(index);
                matchedOptionIndex = matchedOptionIndex === -1 ? this.findNextSelectedOptionIndex(index) : matchedOptionIndex;
            } else {
                matchedOptionIndex = this.findNextSelectedOptionIndex(index);
                matchedOptionIndex = matchedOptionIndex === -1 ? this.findPrevSelectedOptionIndex(index) : matchedOptionIndex;
            }
        }

        return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    }

    equalityKey = computed(() => (this.optionValue() ? null : this.dataKey()));

    isValidSelectedOption(option) {
        return this.isValidOption(option) && this.isSelected(option);
    }

    isOptionDisabled(option: any) {
        const optionDisabled = this.optionDisabled();
        if (isFunction(optionDisabled)) {
            return (optionDisabled as (item: any) => boolean)(option);
        }
        return optionDisabled ? resolveFieldData(option, optionDisabled as string) : false;
    }

    isEquals(value1, value2) {
        return equals(value1, value2, this.equalityKey() || '');
    }

    isSelected(option) {
        const optionValue = this.getOptionValue(option);

        if (this.multiple()) return (this.modelValue() || []).some((value) => this.isEquals(value, optionValue));
        else return this.isEquals(this.modelValue(), optionValue);
    }

    isValidOption(option) {
        return option && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
    }

    isEmpty = computed(() => !this._options()?.length || !this.visibleOptions()?.length);

    hasFilter = computed(() => this._filterValue() && (this._filterValue()?.trim().length || 0) > 0);

    resetFilter() {
        const filterViewChild = this.filterViewChild();
        if (filterViewChild && filterViewChild.nativeElement) {
            filterViewChild.nativeElement.value = '';
        }

        this._filterValue.set(null);
    }

    onDragEntered() {
        this.isDragging.set(true);
        this.el.nativeElement.setAttribute('p-listbox-dragging', 'true');
    }

    onDragExited() {
        this.isDragging.set(false);
        this.el.nativeElement.setAttribute('p-listbox-dragging', 'false');
    }

    drop(event: CdkDragDrop<string[]>) {
        this.isDragging.set(false);
        if (event) {
            // If dragdrop is enabled and same container (reordering), automatically handle reordering
            if (this.dragdrop() && event.previousContainer === event.container) {
                const currentOptions = [...this._options()];
                moveItemInArray(currentOptions, event.previousIndex, event.currentIndex);
                this._options.set(currentOptions);
                this.changeFocusedOptionIndex(event, event.currentIndex);

                // Update model value if needed for selection preservation
                if (this.modelValue()) {
                    this.writeModelValue(this.modelValue());
                    this.onModelChange(this.modelValue());
                }
            }

            // Always emit the event for custom handling
            this.onDrop.emit(event);
        }
    }

    containerDataP = computed(() =>
        this.cn({
            invalid: this.invalid(),
            disabled: this.$disabled()
        })
    );

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        this.value.set(value);
        setModelValue(this.value());
    }
}

@NgModule({
    imports: [Listbox, SharedModule],
    exports: [Listbox, SharedModule]
})
export class ListboxModule {}
