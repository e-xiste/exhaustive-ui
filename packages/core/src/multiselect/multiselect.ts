import { CommonModule } from '@angular/common';
import {
    afterEveryRender,
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    forwardRef,
    inject,
    InjectionToken,
    input,
    linkedSignal,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MotionOptions } from '@exhaustive-ui/motion';
import { deepEquals, equals, findLastIndex, findSingle, focus, getFirstFocusableElement, getFocusableElements, getLastFocusableElement, isArray, isNotEmpty, isPrintableCharacter, resolveFieldData, uuid } from '@exhaustive-ui/utils';
import { FilterService, Footer, OverlayOptions, PrimeTemplate, ScrollerOptions, SharedModule, TranslationKeys } from '@exhaustive-ui/core/api';
import { AutoFocus } from '@exhaustive-ui/core/autofocus';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseEditableHolder } from '@exhaustive-ui/core/baseeditableholder';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { Checkbox } from '@exhaustive-ui/core/checkbox';
import { Chip } from '@exhaustive-ui/core/chip';
import { DomHandler, unblockBodyScroll } from '@exhaustive-ui/core/dom';
import { Fluid } from '@exhaustive-ui/core/fluid';
import { IconField } from '@exhaustive-ui/core/iconfield';
import { CheckIcon, ChevronDownIcon, SearchIcon, TimesIcon } from '@exhaustive-ui/core/icons';
import { InputIcon } from '@exhaustive-ui/core/inputicon';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { Overlay } from '@exhaustive-ui/core/overlay';
import { Scroller } from '@exhaustive-ui/core/scroller';
import { Tooltip } from '@exhaustive-ui/core/tooltip';
import { Nullable } from '@exhaustive-ui/core/ts-helpers';
import {
    MultiSelectBlurEvent,
    MultiSelectChangeEvent,
    MultiSelectChipIconTemplateContext,
    MultiSelectDropdownIconTemplateContext,
    MultiSelectFilterEvent,
    MultiSelectFilterOptions,
    MultiSelectFilterTemplateContext,
    MultiSelectFocusEvent,
    MultiSelectGroupTemplateContext,
    MultiSelectHeaderCheckboxIconTemplateContext,
    MultiSelectItemCheckboxIconTemplateContext,
    MultiSelectItemTemplateContext,
    MultiSelectLazyLoadEvent,
    MultiSelectLoaderTemplateContext,
    MultiSelectPassThrough,
    MultiSelectRemoveEvent,
    MultiSelectSelectAllChangeEvent,
    MultiSelectSelectedItemsTemplateContext
} from '@exhaustive-ui/core/types/multiselect';
import { ObjectUtils } from '@exhaustive-ui/core/utils';
import { MultiSelectStyle } from './style/multiselectstyle';

const MULTISELECT_INSTANCE = new InjectionToken<MultiSelect>('MULTISELECT_INSTANCE');
const MULTISELECT_ITEM_INSTANCE = new InjectionToken<MultiSelectItem>('MULTISELECT_ITEM_INSTANCE');

export const MULTISELECT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiSelect),
    multi: true
};

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'li[pMultiSelectItem]',
    imports: [CommonModule, Checkbox, FormsModule, SharedModule],
    template: `
        <p-checkbox [ngModel]="selected()" [ngModelOptions]="{ standalone: true }" [binary]="true" [tabindex]="-1" [variant]="variant()" [ariaLabel]="label()" [pt]="getPTOptions('pcOptionCheckbox')" [unstyled]="unstyled()">
            @if (itemCheckboxIconTemplate()) {
                <ng-template #icon let-klass="class">
                    <ng-template *ngTemplateOutlet="itemCheckboxIconTemplate(); context: { checked: selected(), class: klass }"></ng-template>
                </ng-template>
            }
        </p-checkbox>
        @if (!template()) {
            <span>{{ label() ?? 'empty' }}</span>
        }
        <ng-container *ngTemplateOutlet="template(); context: { $implicit: option() }"></ng-container>
    `,
    encapsulation: ViewEncapsulation.None,
    providers: [MultiSelectStyle],
    host: {
        '[style.height.px]': 'itemSize()',
        '[attr.aria-label]': 'label()',
        role: 'option',
        '[attr.aria-setsize]': 'ariaSetSize()',
        '[attr.aria-posinset]': 'ariaPosInset()',
        '[attr.aria-selected]': 'selected()',
        '[attr.data-p-selected]': 'selected()',
        '[attr.data-p-focused]': 'focused()',
        '[attr.data-p-highlight]': 'selected()',
        '[attr.data-p-disabled]': 'disabled()',
        '[attr.aria-checked]': 'selected()',
        '(click)': 'onOptionClick($event)',
        '(mouseenter)': 'onOptionMouseEnter($event)',
        '[class]': "cx('option')"
    }
})
export class MultiSelectItem extends BaseComponent {
    $pcMultiSelectItem: MultiSelectItem | undefined = inject(MULTISELECT_ITEM_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    hostName = 'MultiSelect';

    getPTOptions(key) {
        return this.ptm(key, {
            context: {
                selected: this.selected(),
                focused: this.focused(),
                disabled: this.disabled()
            }
        });
    }

    option = input<any>();

    selected = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    label = input<string | undefined>();

    disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    itemSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    focused = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    ariaPosInset = input<string | undefined>();

    ariaSetSize = input<string | undefined>();

    variant = input<'outlined' | 'filled' | undefined>();

    template = input<TemplateRef<MultiSelectItemTemplateContext> | undefined>();

    itemCheckboxIconTemplate = input<TemplateRef<MultiSelectItemCheckboxIconTemplateContext> | undefined>();

    highlightOnSelect = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly onClick = output<any>();

    readonly onMouseEnter = output<any>();

    _componentStyle = inject(MultiSelectStyle);

    onOptionClick(event: Event) {
        this.onClick.emit({
            originalEvent: event,
            option: this.option(),
            selected: this.selected()
        });
        event.stopPropagation();
        event.preventDefault();
    }

    onOptionMouseEnter(event: Event) {
        this.onMouseEnter.emit({
            originalEvent: event,
            option: this.option(),
            selected: this.selected()
        });
    }
}

/**
 * MultiSelect is used to select multiple items from a collection.
 * @group Components
 */
@Component({
    selector: 'p-multiSelect, p-multiselect, p-multi-select',
    imports: [CommonModule, MultiSelectItem, Overlay, SharedModule, Tooltip, Scroller, AutoFocus, CheckIcon, SearchIcon, TimesIcon, ChevronDownIcon, IconField, InputIcon, InputText, Chip, Checkbox, FormsModule, BindModule],
    hostDirectives: [Bind],
    template: `
        <div class="p-hidden-accessible" [attr.data-p-hidden-accessible]="true" [pBind]="ptm('hiddenInputContainer')">
            <input
                #focusInput
                [pTooltip]="tooltip()"
                [pTooltipUnstyled]="unstyled()"
                [tooltipPosition]="tooltipPosition()"
                [positionStyle]="tooltipPositionStyle()"
                [tooltipStyleClass]="tooltipStyleClass()"
                [attr.aria-disabled]="$disabled()"
                [attr.id]="inputId()"
                role="combobox"
                [attr.aria-label]="ariaLabel()"
                [attr.aria-labelledby]="ariaLabelledBy()"
                [attr.aria-haspopup]="'listbox'"
                [attr.aria-expanded]="_overlayVisible() ?? false"
                [attr.aria-controls]="_overlayVisible() ? _id() + '_list' : null"
                [attr.tabindex]="!$disabled() ? tabindex() : -1"
                [attr.aria-activedescendant]="focused() ? focusedOptionId() : undefined"
                (focus)="onInputFocus($event)"
                (blur)="onInputBlur($event)"
                (keydown)="onKeyDown($event)"
                [pAutoFocus]="autofocus()"
                [attr.value]="modelValue()"
                [attr.name]="name()"
                [attr.required]="required() ? '' : undefined"
                [attr.disabled]="$disabled() ? '' : undefined"
                [pBind]="ptm('hiddenInput')"
            />
        </div>
        <div
            [pBind]="ptm('labelContainer')"
            [class]="cx('labelContainer')"
            [pTooltip]="tooltip()"
            [pTooltipUnstyled]="unstyled()"
            (mouseleave)="labelContainerMouseLeave()"
            [tooltipDisabled]="_disableTooltip()"
            [tooltipPosition]="tooltipPosition()"
            [positionStyle]="tooltipPositionStyle()"
            [tooltipStyleClass]="tooltipStyleClass()"
        >
            <div [pBind]="ptm('label')" [class]="cx('label')" [attr.data-p]="labelDataP()">
                @if (!selectedItemsTemplate() && !_selectedItemsTemplate()) {
                    @if (display() === 'comma') {
                        <ng-container>{{ label() || 'empty' }}</ng-container>
                    }
                    @if (display() === 'chip') {
                        @if (chipSelectedItems() && chipSelectedItems().length === maxSelectedLabels()) {
                            {{ getSelectedItemsLabel() }}
                        } @else {
                            @for (item of chipSelectedItems(); track $index; let i = $index) {
                                <div #token [pBind]="ptm('chipItem')" [class]="cx('chipItem')">
                                    <p-chip
                                        [pt]="ptm('pcChip')"
                                        [unstyled]="unstyled()"
                                        [class]="cx('pcChip')"
                                        [label]="getLabelByValue(item)"
                                        [removable]="!$disabled() && !readonly()"
                                        (onRemove)="removeOption(item, $event)"
                                        [removeIcon]="chipIcon()"
                                    >
                                        @if (chipIconTemplate() || _chipIconTemplate() || removeTokenIconTemplate() || _removeTokenIconTemplate()) {
                                            <ng-template #removeicon>
                                                @if (!$disabled() && !readonly()) {
                                                    @if (chipIconTemplate() || _chipIconTemplate() || removeTokenIconTemplate() || _removeTokenIconTemplate()) {
                                                        <span [class]="cx('chipIcon')" (click)="removeOption(item, $event)" [attr.aria-hidden]="true" [pBind]="ptm('chipIcon')">
                                                            <ng-container
                                                                *ngTemplateOutlet="chipIconTemplate() || _chipIconTemplate() || removeTokenIconTemplate() || _removeTokenIconTemplate(); context: { class: 'p-multiselect-chip-icon' }"
                                                            ></ng-container>
                                                        </span>
                                                    }
                                                }
                                            </ng-template>
                                        }
                                    </p-chip>
                                </div>
                            }
                        }
                        @if (!modelValue() || modelValue().length === 0) {
                            <ng-container>{{ placeholder() || 'empty' }}</ng-container>
                        }
                    }
                }
                @if (selectedItemsTemplate() || _selectedItemsTemplate()) {
                    <ng-container *ngTemplateOutlet="selectedItemsTemplate() || _selectedItemsTemplate(); context: { $implicit: selectedOptions(), removeChip: removeOption.bind(this) }"></ng-container>
                    @if (!modelValue() || modelValue().length === 0) {
                        <ng-container>{{ placeholder() || 'empty' }}</ng-container>
                    }
                }
            </div>
        </div>
        @if (isVisibleClearIcon()) {
            @if (!clearIconTemplate() && !_clearIconTemplate()) {
                <svg data-p-icon="times" [pBind]="ptm('clearIcon')" [class]="cx('clearIcon')" (click)="clear($event)" [attr.aria-hidden]="true" />
            }
            @if (clearIconTemplate() || _clearIconTemplate()) {
                <span [pBind]="ptm('clearIcon')" [class]="cx('clearIcon')" (click)="clear($event)" [attr.aria-hidden]="true">
                    <ng-template *ngTemplateOutlet="clearIconTemplate() || _clearIconTemplate()"></ng-template>
                </span>
            }
        }
        <div [pBind]="ptm('dropdown')" [class]="cx('dropdown')">
            @if (loading()) {
                @if (loadingIconTemplate() || _loadingIconTemplate()) {
                    <ng-container *ngTemplateOutlet="loadingIconTemplate() || _loadingIconTemplate()"></ng-container>
                }
                @if (!loadingIconTemplate() && !_loadingIconTemplate()) {
                    @if (loadingIcon()) {
                        <span [pBind]="ptm('loadingIcon')" [class]="cn(cx('loadingIcon'), 'pi-spin ' + loadingIcon())" [attr.aria-hidden]="true"></span>
                    }
                    @if (!loadingIcon()) {
                        <span [pBind]="ptm('loadingIcon')" [class]="cn(cx('loadingIcon'), 'pi pi-spinner pi-spin')" [attr.aria-hidden]="true"></span>
                    }
                }
            } @else {
                @if (!dropdownIconTemplate() && !_dropdownIconTemplate()) {
                    @if (dropdownIcon()) {
                        <span [pBind]="ptm('dropdownIcon')" [class]="cx('dropdownIcon')" [ngClass]="dropdownIcon()" [attr.aria-hidden]="true" [attr.data-p]="dropdownIconDataP()"></span>
                    }
                    @if (!dropdownIcon()) {
                        <svg data-p-icon="chevron-down" [pBind]="ptm('dropdownIcon')" [class]="cx('dropdownIcon')" [attr.aria-hidden]="true" [attr.data-p]="dropdownIconDataP()" />
                    }
                }
                @if (dropdownIconTemplate() || _dropdownIconTemplate()) {
                    <span [pBind]="ptm('dropdownIcon')" [class]="cx('dropdownIcon')" [attr.aria-hidden]="true">
                        <ng-template *ngTemplateOutlet="dropdownIconTemplate() || _dropdownIconTemplate(); context: { dataP: dropdownIconDataP() }"></ng-template>
                    </span>
                }
            }
        </div>
        <p-overlay
            #overlay
            [hostAttrSelector]="$attrSelector"
            [(visible)]="_overlayVisible"
            [options]="overlayOptions()"
            [target]="'@parent'"
            [appendTo]="$appendTo()"
            [unstyled]="unstyled()"
            [pt]="ptm('pcOverlay')"
            [motionOptions]="motionOptions()"
            (onBeforeEnter)="onOverlayBeforeEnter($event)"
            (onAfterLeave)="onOverlayAfterLeave($event)"
            (onHide)="onOverlayHide($event)"
        >
            <ng-template #content>
                <div [pBind]="ptm('overlay')" [attr.data-p]="overlayDataP()" [attr.id]="_id() + '_list'" [class]="cn(cx('overlay'), panelStyleClass())" [ngStyle]="panelStyle()">
                    <span
                        #firstHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [attr.tabindex]="0"
                        (focus)="onFirstHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                        [pBind]="ptm('firstHiddenFocusableEl')"
                    >
                    </span>
                    <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate()"></ng-container>
                    @if (showHeader()) {
                        <div [pBind]="ptm('header')" [class]="cx('header')">
                            <ng-content select="p-header"></ng-content>
                            @if (filterTemplate() || _filterTemplate()) {
                                <ng-container *ngTemplateOutlet="filterTemplate() || _filterTemplate(); context: { options: filterOptions() }"></ng-container>
                            } @else {
                                @if (showToggleAll() && !selectionLimit()) {
                                    <p-checkbox
                                        [pt]="getHeaderCheckboxPTOptions('pcHeaderCheckbox')"
                                        [ngModel]="allSelected()"
                                        [ngModelOptions]="{ standalone: true }"
                                        [ariaLabel]="toggleAllAriaLabel()"
                                        [binary]="true"
                                        (onChange)="onToggleAll($event)"
                                        [variant]="$variant()"
                                        [disabled]="$disabled()"
                                        [unstyled]="unstyled()"
                                        #headerCheckbox
                                    >
                                        <ng-template #icon let-klass="class">
                                            @if (!headerCheckboxIconTemplate() && !_headerCheckboxIconTemplate() && allSelected()) {
                                                <svg data-p-icon="check" [class]="klass" [pBind]="getHeaderCheckboxPTOptions('pcHeaderCheckbox.icon')" />
                                            }
                                            <ng-template
                                                *ngTemplateOutlet="
                                                    headerCheckboxIconTemplate() || _headerCheckboxIconTemplate();
                                                    context: {
                                                        checked: allSelected(),
                                                        partialSelected: partialSelected(),
                                                        class: klass
                                                    }
                                                "
                                            ></ng-template>
                                        </ng-template>
                                    </p-checkbox>
                                }

                                @if (filter()) {
                                    <p-iconfield [pt]="ptm('pcFilterContainer')" [class]="cx('pcFilterContainer')" [unstyled]="unstyled()">
                                        <input
                                            #filterInput
                                            pInputText
                                            [pt]="ptm('pcFilter')"
                                            [variant]="$variant()"
                                            type="text"
                                            [attr.autocomplete]="autocomplete()"
                                            role="searchbox"
                                            [attr.aria-owns]="_id() + '_list'"
                                            [attr.aria-activedescendant]="focusedOptionId()"
                                            [value]="_filterValue() || ''"
                                            (input)="onFilterInputChange($event)"
                                            (keydown)="onFilterKeyDown($event)"
                                            (click)="onInputClick($event)"
                                            (blur)="onFilterBlur($event)"
                                            [class]="cx('pcFilter')"
                                            [attr.disabled]="$disabled() ? '' : undefined"
                                            [attr.placeholder]="filterPlaceHolder()"
                                            [attr.aria-label]="ariaFilterLabel()"
                                            [unstyled]="unstyled()"
                                        />
                                        <p-inputicon [pt]="ptm('pcFilterIconContainer')" [unstyled]="unstyled()">
                                            @if (!filterIconTemplate() && !_filterIconTemplate()) {
                                                <svg data-p-icon="search" [pBind]="ptm('filterIcon')" />
                                            }
                                            @if (filterIconTemplate() || _filterIconTemplate()) {
                                                <span [pBind]="ptm('filterIcon')" class="p-multiselect-filter-icon">
                                                    <ng-template *ngTemplateOutlet="filterIconTemplate() || _filterIconTemplate()"></ng-template>
                                                </span>
                                            }
                                        </p-inputicon>
                                    </p-iconfield>
                                }
                            }
                        </div>
                    }
                    <div [pBind]="ptm('listContainer')" [class]="cx('listContainer')" [style.max-height]="virtualScroll() ? 'auto' : scrollHeight() || 'auto'">
                        @if (virtualScroll()) {
                            <p-scroller
                                #scroller
                                [items]="visibleOptions()"
                                [style]="{ height: scrollHeight() }"
                                [itemSize]="virtualScrollItemSize()"
                                [autoSize]="true"
                                [tabindex]="-1"
                                [lazy]="lazy()"
                                (onLazyLoad)="onLazyLoad.emit($event)"
                                [options]="virtualScrollOptions()"
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
                            <ul #items [pBind]="ptm('list')" [class]="cn(cx('list'), scrollerOptions.contentStyleClass)" [style]="scrollerOptions.contentStyle" role="listbox" aria-multiselectable="true" [attr.aria-label]="listLabel()">
                                @for (option of items; track $index; let i = $index) {
                                    @if (isOptionGroup(option)) {
                                        <li [pBind]="ptm('optionGroup')" [attr.id]="_id() + '_' + getOptionIndex(i, scrollerOptions)" [class]="cx('optionGroup')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option">
                                            @if (!groupTemplate() && !_groupTemplate() && option.optionGroup) {
                                                <span>{{ getOptionGroupLabel(option.optionGroup) }}</span>
                                            }
                                            @if (option.optionGroup && (groupTemplate() || _groupTemplate())) {
                                                <ng-container [ngTemplateOutlet]="groupTemplate() || _groupTemplate()" [ngTemplateOutletContext]="{ $implicit: option.optionGroup }"></ng-container>
                                            }
                                        </li>
                                    }
                                    @if (!isOptionGroup(option)) {
                                        <li
                                            pMultiSelectItem
                                            pRipple
                                            [pBind]="getPTOptions(option, scrollerOptions, i, 'option')"
                                            [id]="_id() + '_' + getOptionIndex(i, scrollerOptions)"
                                            [option]="option"
                                            [selected]="isSelected(option)"
                                            [label]="getOptionLabel(option)"
                                            [disabled]="isOptionDisabled(option)"
                                            [template]="itemTemplate() || _itemTemplate()"
                                            [itemCheckboxIconTemplate]="itemCheckboxIconTemplate() || _itemCheckboxIconTemplate()"
                                            [itemSize]="scrollerOptions.itemSize"
                                            [focused]="focusedOptionIndex() === getOptionIndex(i, scrollerOptions)"
                                            [ariaPosInset]="getAriaPosInset(getOptionIndex(i, scrollerOptions))"
                                            [ariaSetSize]="ariaSetSize()"
                                            [variant]="$variant()"
                                            [highlightOnSelect]="highlightOnSelect()"
                                            (onClick)="onOptionSelect($event, false, getOptionIndex(i, scrollerOptions))"
                                            (onMouseEnter)="onOptionMouseEnter($event, getOptionIndex(i, scrollerOptions))"
                                            [pt]="pt()"
                                            [unstyled]="unstyled()"
                                        ></li>
                                    }
                                }

                                @if (hasFilter() && isEmpty()) {
                                    <li [pBind]="ptm('emptyMessage')" [class]="cx('emptyMessage')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option">
                                        @if (!emptyFilterTemplate() && !_emptyFilterTemplate() && !emptyTemplate() && !_emptyTemplate()) {
                                            {{ emptyFilterMessageLabel() }}
                                        } @else {
                                            <ng-container *ngTemplateOutlet="emptyFilterTemplate() || _emptyFilterTemplate() || emptyTemplate() || _emptyTemplate()"></ng-container>
                                        }
                                    </li>
                                }
                                @if (!hasFilter() && isEmpty()) {
                                    <li [pBind]="ptm('emptyMessage')" [class]="cx('emptyMessage')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option">
                                        @if (!emptyTemplate() && !_emptyTemplate()) {
                                            {{ emptyMessageLabel() }}
                                        } @else {
                                            <ng-container *ngTemplateOutlet="emptyTemplate() || _emptyTemplate()"></ng-container>
                                        }
                                    </li>
                                }
                            </ul>
                        </ng-template>
                    </div>
                    @if (footerFacet() || footerTemplate() || _footerTemplate()) {
                        <div>
                            <ng-content select="p-footer"></ng-content>
                            <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate()"></ng-container>
                        </div>
                    }

                    <span
                        #lastHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [attr.tabindex]="0"
                        (focus)="onLastHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                        [pBind]="ptm('lastHiddenFocusableEl')"
                    ></span>
                </div>
            </ng-template>
        </p-overlay>
    `,
    providers: [MULTISELECT_VALUE_ACCESSOR, MultiSelectStyle, { provide: MULTISELECT_INSTANCE, useExisting: MultiSelect }, { provide: PARENT_INSTANCE, useExisting: MultiSelect }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.id]': '_id()',
        '[attr.data-p]': 'containerDataP()',
        '(click)': 'onContainerClick($event)',
        '[class]': "cx('root')",
        '[style]': "sx('root')"
    }
})
export class MultiSelect extends BaseEditableHolder<MultiSelectPassThrough> {
    filterService = inject(FilterService);

    componentName = 'MultiSelect';

    /**
     * Unique identifier of the component
     * @group Props
     */
    id = input<string | undefined>();
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    ariaLabel = input<string | undefined>();
    /**
     * Inline style of the overlay panel.
     * @group Props
     */
    panelStyle = input<any>();
    /**
     * Style class of the overlay panel element.
     * @group Props
     */
    panelStyleClass = input<string | undefined>();
    /**
     * Identifier of the focus input to match a label defined for the component.
     * @group Props
     */
    inputId = input<string | undefined>();
    /**
     * When present, it specifies that the component cannot be edited.
     * @group Props
     */
    readonly = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether to display options as grouped when nested options are provided.
     * @group Props
     */
    group = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When specified, displays an input field to filter the items on keyup.
     * @group Props
     */
    filter = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Defines placeholder of the filter input.
     * @group Props
     */
    filterPlaceHolder = input<string | undefined>();
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    filterLocale = input<string | undefined>();
    /**
     * Specifies the visibility of the options panel.
     * @group Props
     */
    overlayVisible = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input<number | undefined, unknown>(0, { transform: numberAttribute });
    /**
     * A property to uniquely identify a value in options.
     * @group Props
     */
    dataKey = input<string | undefined>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>();
    /**
     * Whether to show labels of selected item labels or use default label.
     * @group Props
     * @defaultValue true
     */
    displaySelectedLabel = input<boolean>(true);
    /**
     * Decides how many selected item labels to show at most.
     * @group Props
     * @defaultValue 3
     */
    maxSelectedLabels = input<number | null | undefined>(3);
    /**
     * Maximum number of selectable items.
     * @group Props
     */
    selectionLimit = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Label to display after exceeding max selected labels e.g. ({0} items selected), defaults "ellipsis" keyword to indicate a text-overflow.
     * @group Props
     */
    selectedItemsLabel = input<string | undefined>();
    /**
     * Whether to show the checkbox at header to toggle all items at once.
     * @group Props
     */
    showToggleAll = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Text to display when filtering does not return any results.
     * @group Props
     */
    emptyFilterMessage = input<string>('');
    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    emptyMessage = input<string>('');
    /**
     * Clears the filter value when hiding the dropdown.
     * @group Props
     */
    resetFilterOnHide = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Icon class of the dropdown icon.
     * @group Props
     */
    dropdownIcon = input<string | undefined>();
    /**
     * Icon class of the chip icon.
     * @group Props
     */
    chipIcon = input<string | undefined>();
    /**
     * Name of the label field of an option.
     * @group Props
     */
    optionLabel = input<string | undefined>();
    /**
     * Name of the value field of an option.
     * @group Props
     */
    optionValue = input<string | undefined>();
    /**
     * Name of the disabled field of an option.
     * @group Props
     */
    optionDisabled = input<string | undefined>();
    /**
     * Name of the label field of an option group.
     * @group Props
     */
    optionGroupLabel = input<string | undefined>('label');
    /**
     * Name of the options field of an option group.
     * @group Props
     */
    optionGroupChildren = input<string>('items');
    /**
     * Whether to show the header.
     * @group Props
     */
    showHeader = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
     * @group Props
     */
    filterBy = input<string | undefined>();
    /**
     * Height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    scrollHeight = input<string>('200px');
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    lazy = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    virtualScroll = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether the multiselect is in loading state.
     * @group Props
     */
    loading = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * Height of an item in the list for VirtualScrolling.
     * @group Props
     */
    virtualScrollItemSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Icon to display in loading state.
     * @group Props
     */
    loadingIcon = input<string | undefined>();
    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    virtualScrollOptions = input<ScrollerOptions | undefined>();
    /**
     * Whether to use overlay API feature. The properties of overlay API can be used like an object in it.
     * @group Props
     */
    overlayOptions = input<OverlayOptions | undefined>();
    /**
     * Defines a string that labels the filter input.
     * @group Props
     */
    ariaFilterLabel = input<string | undefined>();
    /**
     * Defines how the items are filtered.
     * @group Props
     */
    filterMatchMode = input<'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte'>('contains');
    /**
     * Advisory information to display in a tooltip on hover.
     * @group Props
     */
    tooltip = input<string>('');
    /**
     * Position of the tooltip.
     * @group Props
     */
    tooltipPosition = input<'top' | 'left' | 'right' | 'bottom'>('right');
    /**
     * Type of CSS position.
     * @group Props
     */
    tooltipPositionStyle = input<string>('absolute');
    /**
     * Style class of the tooltip.
     * @group Props
     */
    tooltipStyleClass = input<string | undefined>();
    /**
     * Applies focus to the filter element when the overlay is shown.
     * @group Props
     */
    autofocusFilter = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Defines how the selected items are displayed.
     * @group Props
     */
    display = input<string | 'comma' | 'chip'>('comma');
    /**
     * Defines the autocomplete is active.
     * @group Props
     */
    autocomplete = input<string>('off');
    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    showClear = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Label to display when there are no selections.
     * @group Props
     */
    placeholder = input<string | undefined>();
    /**
     * An array of objects to display as the available options.
     * @group Props
     */
    options = input<any[] | undefined>();
    /**
     * When specified, filter displays with this value.
     * @group Props
     */
    filterValue = input<string | undefined | null>(null);
    /**
     * Whether all data is selected.
     * @group Props
     */
    selectAll = input<boolean | undefined | null>(null);
    /**
     * Indicates whether to focus on options when hovering over them, defaults to optionLabel.
     * @group Props
     */
    focusOnHover = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Determines if the option will be selected on focus.
     * @group Props
     */
    selectOnFocus = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether to focus on the first visible or selected element when the overlay panel is shown.
     * @group Props
     */
    autoOptionFocus = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the selected option will be add highlight class.
     * @group Props
     */
    highlightOnSelect = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Specifies the size of the component.
     * @defaultValue undefined
     * @group Props
     */
    size = input<'large' | 'small' | undefined>();
    /**
     * Specifies the input variant of the component.
     * @defaultValue undefined
     * @group Props
     */
    variant = input<'filled' | 'outlined' | undefined>();
    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);
    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);
    /**
     * Callback to invoke when value changes.
     * @param {MultiSelectChangeEvent} event - Custom change event.
     * @group Emits
     */
    readonly onChange = output<MultiSelectChangeEvent>();
    /**
     * Callback to invoke when data is filtered.
     * @param {MultiSelectFilterEvent} event - Custom filter event.
     * @group Emits
     */
    readonly onFilter = output<MultiSelectFilterEvent>();
    /**
     * Callback to invoke when multiselect receives focus.
     * @param {MultiSelectFocusEvent} event - Custom focus event.
     * @group Emits
     */
    readonly onFocus = output<MultiSelectFocusEvent>();
    /**
     * Callback to invoke when multiselect loses focus.
     * @param {MultiSelectBlurEvent} event - Custom blur event.
     * @group Emits
     */
    readonly onBlur = output<MultiSelectBlurEvent>();
    /**
     * Callback to invoke when component is clicked.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onClick = output<Event>();
    /**
     * Callback to invoke when input field is cleared.
     * @group Emits
     */
    readonly onClear = output<void>();
    /**
     * Callback to invoke when overlay panel becomes visible.
     * @param {AnimationEvent} event - Animation event.
     * @group Emits
     */
    readonly onPanelShow = output<AnimationEvent>();
    /**
     * Callback to invoke when overlay panel becomes hidden.
     * @param {AnimationEvent} event - Animation event.
     * @group Emits
     */
    readonly onPanelHide = output<AnimationEvent>();
    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {MultiSelectLazyLoadEvent} event - Lazy load event.
     * @group Emits
     */
    readonly onLazyLoad = output<MultiSelectLazyLoadEvent>();
    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {MultiSelectRemoveEvent} event - Remove event.
     * @group Emits
     */
    readonly onRemove = output<MultiSelectRemoveEvent>();
    /**
     * Callback to invoke when all data is selected.
     * @param {MultiSelectSelectAllChangeEvent} event - Custom select event.
     * @group Emits
     */
    readonly onSelectAllChange = output<MultiSelectSelectAllChangeEvent>();

    readonly overlayViewChild = viewChild.required<Overlay>('overlay');

    readonly filterInputChild = viewChild<Nullable<ElementRef>>('filterInput');

    readonly focusInputViewChild = viewChild.required<ElementRef>('focusInput');

    readonly itemsViewChild = viewChild<Nullable<ElementRef>>('items');

    readonly scroller = viewChild<Nullable<Scroller>>('scroller');

    readonly lastHiddenFocusableElementOnOverlay = viewChild<Nullable<ElementRef>>('lastHiddenFocusableEl');

    readonly firstHiddenFocusableElementOnOverlay = viewChild<Nullable<ElementRef>>('firstHiddenFocusableEl');

    readonly headerCheckboxViewChild = viewChild<Nullable<Checkbox>>('headerCheckbox');

    readonly footerFacet = contentChild(Footer);

    _componentStyle = inject(MultiSelectStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    searchValue = signal<Nullable<string>>(undefined);

    searchTimeout = signal<any>(undefined);

    _disableTooltip = signal<boolean>(false);

    value = signal<any[] | undefined>(undefined);

    /**
     * Custom item template.
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<MultiSelectItemTemplateContext>>('item', { descendants: false });

    /**
     * Custom group template.
     * @group Templates
     */
    readonly groupTemplate = contentChild<TemplateRef<MultiSelectGroupTemplateContext>>('group', { descendants: false });

    /**
     * Custom loader template.
     * @group Templates
     */
    readonly loaderTemplate = contentChild<TemplateRef<MultiSelectLoaderTemplateContext>>('loader', { descendants: false });

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Custom filter template.
     * @group Templates
     */
    readonly filterTemplate = contentChild<TemplateRef<MultiSelectFilterTemplateContext>>('filter', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });

    /**
     * Custom empty filter template.
     * @group Templates
     */
    readonly emptyFilterTemplate = contentChild<TemplateRef<void>>('emptyfilter', { descendants: false });

    /**
     * Custom empty template.
     * @group Templates
     */
    readonly emptyTemplate = contentChild<TemplateRef<void>>('empty', { descendants: false });

    /**
     * Custom selected items template.
     * @group Templates
     */
    readonly selectedItemsTemplate = contentChild<TemplateRef<MultiSelectSelectedItemsTemplateContext>>('selecteditems', { descendants: false });

    /**
     * Custom loading icon template.
     * @group Templates
     */
    readonly loadingIconTemplate = contentChild<TemplateRef<void>>('loadingicon', { descendants: false });

    /**
     * Custom filter icon template.
     * @group Templates
     */
    readonly filterIconTemplate = contentChild<TemplateRef<void>>('filtericon', { descendants: false });

    /**
     * Custom remove token icon template.
     * @group Templates
     */
    readonly removeTokenIconTemplate = contentChild<TemplateRef<MultiSelectChipIconTemplateContext>>('removetokenicon', { descendants: false });

    /**
     * Custom chip icon template.
     * @group Templates
     */
    readonly chipIconTemplate = contentChild<TemplateRef<MultiSelectChipIconTemplateContext>>('chipicon', { descendants: false });

    /**
     * Custom clear icon template.
     * @group Templates
     */
    readonly clearIconTemplate = contentChild<TemplateRef<void>>('clearicon', { descendants: false });

    /**
     * Custom dropdown icon template.
     * @group Templates
     */
    readonly dropdownIconTemplate = contentChild<TemplateRef<MultiSelectDropdownIconTemplateContext>>('dropdownicon', { descendants: false });

    /**
     * Custom item checkbox icon template.
     * @group Templates
     */
    readonly itemCheckboxIconTemplate = contentChild<TemplateRef<MultiSelectItemCheckboxIconTemplateContext>>('itemcheckboxicon', { descendants: false });

    /**
     * Custom header checkbox icon template.
     * @group Templates
     */
    readonly headerCheckboxIconTemplate = contentChild<TemplateRef<MultiSelectHeaderCheckboxIconTemplateContext>>('headercheckboxicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    readonly _itemTemplate = computed<TemplateRef<MultiSelectItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter(
                    (item) =>
                        ![
                            'group',
                            'selectedItems',
                            'selecteditems',
                            'header',
                            'filter',
                            'emptyfilter',
                            'empty',
                            'footer',
                            'loader',
                            'headercheckboxicon',
                            'loadingicon',
                            'filtericon',
                            'removetokenicon',
                            'clearicon',
                            'dropdownicon',
                            'itemcheckboxicon',
                            'chipicon'
                        ].includes(item.getType())
                )
                .at(-1)?.template
    );

    readonly _groupTemplate = computed<TemplateRef<MultiSelectGroupTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'group')
                .at(-1)?.template
    );

    readonly _loaderTemplate = computed<TemplateRef<MultiSelectLoaderTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'loader')
                .at(-1)?.template
    );

    readonly _headerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    readonly _filterTemplate = computed<TemplateRef<MultiSelectFilterTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'filter')
                .at(-1)?.template
    );

    readonly _footerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    readonly _emptyFilterTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'emptyfilter')
                .at(-1)?.template
    );

    readonly _emptyTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'empty')
                .at(-1)?.template
    );

    readonly _selectedItemsTemplate = computed<TemplateRef<MultiSelectSelectedItemsTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => ['selectedItems', 'selecteditems'].includes(item.getType()))
                .at(-1)?.template
    );

    readonly _loadingIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'loadingicon')
                .at(-1)?.template
    );

    readonly _filterIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'filtericon')
                .at(-1)?.template
    );

    readonly _removeTokenIconTemplate = computed<TemplateRef<MultiSelectChipIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'removetokenicon')
                .at(-1)?.template
    );

    readonly _chipIconTemplate = computed<TemplateRef<MultiSelectChipIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'chipicon')
                .at(-1)?.template
    );

    readonly _clearIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'clearicon')
                .at(-1)?.template
    );

    readonly _dropdownIconTemplate = computed<TemplateRef<MultiSelectDropdownIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'dropdownicon')
                .at(-1)?.template
    );

    readonly _itemCheckboxIconTemplate = computed<TemplateRef<MultiSelectItemCheckboxIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'itemcheckboxicon')
                .at(-1)?.template
    );

    readonly _headerCheckboxIconTemplate = computed<TemplateRef<MultiSelectHeaderCheckboxIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'headercheckboxicon')
                .at(-1)?.template
    );

    $variant = computed(() => this.variant() || this.config.inputStyle() || this.config.inputVariant());

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    $pcMultiSelect: MultiSelect | undefined = inject(MULTISELECT_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    hasFluid = computed(() => this.fluid() ?? !!this.pcFluid);

    filterOptions = computed<MultiSelectFilterOptions | undefined>(() =>
        this.filterBy()
            ? {
                  filter: (value) => this.onFilterInputChange(value),
                  reset: () => this.resetFilter()
              }
            : undefined
    );

    preventModelTouched = signal<boolean | undefined>(undefined);

    focused = signal<boolean>(false);

    itemsWrapper = signal<any>(undefined);

    modelValue = signal<any>(null);

    _filterValue = linkedSignal<any>(() => this.filterValue());

    _options = computed<any[]>(() => this.options() || [], { equal: deepEquals });

    _overlayVisible = linkedSignal<boolean | undefined>(() => this.overlayVisible());

    startRangeIndex = signal<number>(-1);

    focusedOptionIndex = signal<number>(-1);

    selectedOptions = linkedSignal<{ modelValue: any; options: any[]; optionValue: string | undefined; optionLabel: string | undefined }, any>({
        source: () => ({ modelValue: this.modelValue(), options: this.getAllVisibleAndNonVisibleOptions(), optionValue: this.optionValue(), optionLabel: this.optionLabel() }),
        computation: ({ modelValue, options, optionValue, optionLabel }, previous) => {
            if (options && isNotEmpty(options)) {
                if (optionValue && optionLabel && modelValue) {
                    return options.filter((option) => modelValue.includes(option[optionLabel]) || modelValue.includes(option[optionValue]));
                }
                return modelValue;
            }
            // an emptied model clears the selection even while there are no options
            if (!isNotEmpty(modelValue)) {
                return [];
            }
            return previous?.value;
        }
    });

    clickInProgress = signal<boolean>(false);

    translation = toSignal(this.config.translationObserver, { initialValue: this.config.translation });

    _id = computed(() => this.id() || uuid('pn_id_'));

    emptyMessageLabel = computed<string>(() => this.emptyMessage() || this.translation()[TranslationKeys.EMPTY_MESSAGE]);

    emptyFilterMessageLabel = computed<string>(() => this.emptyFilterMessage() || this.translation()[TranslationKeys.EMPTY_FILTER_MESSAGE]);

    isVisibleClearIcon = computed<boolean | undefined>(() => this.modelValue() != null && this.modelValue() !== '' && isNotEmpty(this.modelValue()) && this.showClear() && !this.$disabled() && !this.readonly() && this.$filled());

    toggleAllAriaLabel = computed(() => (this.translation().aria ? this.translation().aria[this.allSelected() ? 'selectAll' : 'unselectAll'] : undefined));

    listLabel = computed<string>(() => this.translation()[TranslationKeys.ARIA]['listLabel']);

    private getAllVisibleAndNonVisibleOptions = computed(() => (this.group() ? this.flatOptions(this._options()) : this._options() || []));

    visibleOptions = computed(() => {
        const options = this.getAllVisibleAndNonVisibleOptions();
        const isArrayOfObjects = isArray(options) && ObjectUtils.isObject(options[0]);

        if (this._filterValue()) {
            let filteredOptions;

            if (isArrayOfObjects) {
                filteredOptions = this.filterService.filter(options, this.searchFields(), this._filterValue(), this.filterMatchMode(), this.filterLocale());
            } else {
                filteredOptions = options.filter((option) => option.toString().toLocaleLowerCase().includes(this._filterValue().toLocaleLowerCase()));
            }

            if (this.group()) {
                const optionGroups = this._options() || [];
                const filtered: any[] = [];

                optionGroups.forEach((group) => {
                    const groupChildren = this.getOptionGroupChildren(group);
                    const filteredItems = groupChildren.filter((item) => filteredOptions.includes(item));

                    if (filteredItems.length > 0)
                        filtered.push({
                            ...group,
                            [typeof this.optionGroupChildren() === 'string' ? this.optionGroupChildren() : 'items']: [...filteredItems]
                        });
                });

                return this.flatOptions(filtered);
            }

            return filteredOptions;
        }
        return options;
    });

    label = computed(() => {
        let label;
        const modelValue = this.modelValue();

        if (modelValue && modelValue?.length && this.displaySelectedLabel()) {
            if (isNotEmpty(this.maxSelectedLabels()) && modelValue?.length > (this.maxSelectedLabels() || 0)) {
                return this.getSelectedItemsLabel();
            } else {
                // values without a matching option (unknown, or options not loaded yet) have no label to show
                label = modelValue
                    .map((value) => this.getLabelByValue(value))
                    .filter((optionLabel) => optionLabel !== null && optionLabel !== undefined)
                    .join(', ');
            }
        } else {
            label = this.placeholder() || '';
        }
        return label;
    });

    chipSelectedItems = computed(() => {
        return isNotEmpty(this.maxSelectedLabels()) && this.modelValue() && this.modelValue()?.length > (this.maxSelectedLabels() || 0) ? this.modelValue()?.slice(0, this.maxSelectedLabels()) : this.modelValue();
    });

    constructor() {
        super();
        afterNextRender(() => {
            if (this._overlayVisible()) {
                this.show();
            }
        });
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    onInit() {
        this.autoUpdateModel();
    }

    maxSelectionLimitReached = computed(() => this.selectionLimit() && this.modelValue() && this.modelValue().length === this.selectionLimit());

    flatOptions(options) {
        return (options || []).reduce((result, option, index) => {
            result.push({ optionGroup: option, group: true, index });

            const optionGroupChildren = this.getOptionGroupChildren(option);

            optionGroupChildren && optionGroupChildren.forEach((o) => result.push(o));

            return result;
        }, []);
    }

    autoUpdateModel() {
        if (this.selectOnFocus() && this.autoOptionFocus() && !this.hasSelectedOption()) {
            this.focusedOptionIndex.set(this.findFirstFocusedOptionIndex());
            const value = this.getOptionValue(this.visibleOptions()[this.focusedOptionIndex()]);
            this.onOptionSelect({ originalEvent: null, option: [value] });
        }
    }

    /**
     * Updates the model value.
     * @group Method
     */
    public updateModel(value, event?) {
        this.value.set(value);
        this.onModelChange(value);
        this.writeValue(value);
    }

    onInputClick(event) {
        event.stopPropagation();
        event.preventDefault();
        this.focusedOptionIndex.set(-1);
    }

    onOptionSelect(event, isFocus = false, index = -1) {
        const { originalEvent, option } = event;
        if (this.$disabled() || this.isOptionDisabled(option)) {
            return;
        }

        let selected = this.isSelected(option);
        let value: any[] = [];

        if (selected) {
            value = this.modelValue().filter((val) => !equals(val, this.getOptionValue(option), this.equalityKey() || ''));
        } else {
            value = [...(this.modelValue() || []), this.getOptionValue(option)];
        }

        this.updateModel(value, originalEvent);
        index !== -1 && this.focusedOptionIndex.set(index);

        isFocus && focus(this.focusInputViewChild().nativeElement);

        this.onChange.emit({
            originalEvent: event,
            value: value,
            itemValue: option
        });
    }

    findSelectedOptionIndex = computed(() => (this.hasSelectedOption() ? this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option)) : -1));

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

    searchFields = computed(() => (this.filterBy() || this.optionLabel() || 'label').split(','));

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

    findPrevSelectedOptionIndex(index) {
        const matchedOptionIndex = this.hasSelectedOption() && index > 0 ? findLastIndex(this.visibleOptions().slice(0, index), (option) => this.isValidSelectedOption(option)) : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex : -1;
    }

    findFirstFocusedOptionIndex = computed(() => {
        const selectedIndex = this.findFirstSelectedOptionIndex();

        return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    });

    findFirstOptionIndex = computed(() => this.visibleOptions().findIndex((option) => this.isValidOption(option)));

    findFirstSelectedOptionIndex = computed(() => (this.hasSelectedOption() ? this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option)) : -1));

    findNextSelectedOptionIndex(index) {
        const matchedOptionIndex =
            this.hasSelectedOption() && index < this.visibleOptions().length - 1
                ? this.visibleOptions()
                      .slice(index + 1)
                      .findIndex((option) => this.isValidSelectedOption(option))
                : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : -1;
    }

    equalityKey = computed(() => (this.optionValue() ? null : this.dataKey()));

    hasSelectedOption = computed(() => isNotEmpty(this.modelValue()));

    isValidSelectedOption(option) {
        return this.isValidOption(option) && this.isSelected(option);
    }

    isOptionGroup(option) {
        return option && (this.group() || this.optionGroupLabel()) && option.optionGroup && option.group;
    }

    isValidOption(option) {
        return option && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
    }

    isOptionDisabled(option: any) {
        if (this.maxSelectionLimitReached() && !this.isSelected(option)) {
            return true;
        }
        return this.optionDisabled() ? resolveFieldData(option, this.optionDisabled()) : option && option.disabled !== undefined ? option.disabled : false;
    }

    isSelected(option) {
        const optionValue = this.getOptionValue(option);
        return (this.modelValue() || []).some((value) => equals(value, optionValue, this.equalityKey() || ''));
    }

    isOptionMatched(option) {
        return this.isValidOption(option) && this.getOptionLabel(option).toString().toLocaleLowerCase(this.filterLocale()).startsWith(this.searchValue()?.toLocaleLowerCase(this.filterLocale()));
    }

    isEmpty = computed(() => !this._options() || (this.visibleOptions() && this.visibleOptions().length === 0));

    getOptionIndex(index, scrollerOptions) {
        return this.virtualScrollerDisabled() ? index : scrollerOptions && scrollerOptions.getItemOptions(index)['index'];
    }

    getAriaPosInset(index) {
        return (
            (this.optionGroupLabel()
                ? index -
                  this.visibleOptions()
                      .slice(0, index)
                      .filter((option) => this.isOptionGroup(option)).length
                : index) + 1
        );
    }

    ariaSetSize = computed(() => this.visibleOptions().filter((option) => !this.isOptionGroup(option)).length);

    getLabelByValue(value) {
        const options = this.group() ? this.flatOptions(this._options()) : this._options() || [];
        const matchedOption = options.find((option) => !this.isOptionGroup(option) && equals(this.getOptionValue(option), value, this.equalityKey() || ''));
        return matchedOption ? this.getOptionLabel(matchedOption) : null;
    }

    getSelectedItemsLabel = computed(() => {
        let pattern = /{(.*?)}/;
        let message = this.selectedItemsLabel() ? this.selectedItemsLabel() : this.translation()[TranslationKeys.SELECTION_MESSAGE];

        if (pattern.test(message)) {
            return message.replace(message.match(pattern)[0], this.modelValue().length + '');
        }

        return message;
    });

    getOptionLabel(option: any) {
        return this.optionLabel() ? resolveFieldData(option, this.optionLabel()) : option && option.label != undefined ? option.label : option;
    }

    getOptionValue(option: any) {
        return this.optionValue() ? resolveFieldData(option, this.optionValue()) : !this.optionLabel() && option && option.value !== undefined ? option.value : option;
    }

    getOptionGroupLabel(optionGroup: any) {
        return this.optionGroupLabel() ? resolveFieldData(optionGroup, this.optionGroupLabel()) : optionGroup && optionGroup.label != undefined ? optionGroup.label : optionGroup;
    }

    getOptionGroupChildren(optionGroup: any) {
        return optionGroup ? (this.optionGroupChildren() ? resolveFieldData(optionGroup, this.optionGroupChildren()) : optionGroup.items) : [];
    }

    onKeyDown(event: KeyboardEvent) {
        if (this.$disabled()) {
            event.preventDefault();
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
                this.onEnterKey(event);
                break;

            case 'Escape':
                this.onEscapeKey(event);
                break;

            case 'Tab':
                this.onTabKey(event);
                break;

            case 'ShiftLeft':
            case 'ShiftRight':
                this.onShiftKey();
                break;

            default:
                if (event.code === 'KeyA' && metaKey) {
                    const value = this.visibleOptions()
                        .filter((option) => this.isValidOption(option))
                        .map((option) => this.getOptionValue(option));

                    this.updateModel(value, event);

                    event.preventDefault();
                    break;
                }

                if (!metaKey && isPrintableCharacter(event.key)) {
                    !this._overlayVisible() && this.show();
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
                this.onArrowUpKey(event, true);
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
            case 'NumpadEnter':
                this.onEnterKey(event);
                break;

            case 'Escape':
                this.onEscapeKey(event);
                break;

            case 'Tab':
                this.onTabKey(event, true);
                break;

            default:
                break;
        }
    }

    onArrowLeftKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        pressedInInputText && this.focusedOptionIndex.set(-1);
    }

    onArrowDownKey(event) {
        const optionIndex = this.focusedOptionIndex() !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex()) : this.findFirstFocusedOptionIndex();

        if (event.shiftKey) {
            this.onOptionSelectRange(event, this.startRangeIndex(), optionIndex);
        }

        this.changeFocusedOptionIndex(event, optionIndex);
        !this._overlayVisible() && this.show();
        event.preventDefault();
        event.stopPropagation();
    }

    onArrowUpKey(event, pressedInInputText = false) {
        if (event.altKey && !pressedInInputText) {
            if (this.focusedOptionIndex() !== -1) {
                this.onOptionSelect(event, this.visibleOptions()[this.focusedOptionIndex()]);
            }

            this._overlayVisible() && this.hide();
            event.preventDefault();
        } else {
            const optionIndex = this.focusedOptionIndex() !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex()) : this.findLastFocusedOptionIndex();

            if (event.shiftKey) {
                this.onOptionSelectRange(event, optionIndex, this.startRangeIndex());
            }

            this.changeFocusedOptionIndex(event, optionIndex);

            !this._overlayVisible() && this.show();
            event.preventDefault();
        }
        event.stopPropagation();
    }

    onHomeKey(event, pressedInInputText = false) {
        const { currentTarget } = event;

        if (pressedInInputText) {
            const len = currentTarget.value.length;

            currentTarget.setSelectionRange(0, event.shiftKey ? len : 0);
            this.focusedOptionIndex.set(-1);
        } else {
            let metaKey = event.metaKey || event.ctrlKey;
            let optionIndex = this.findFirstOptionIndex();

            if (event.shiftKey && metaKey) {
                this.onOptionSelectRange(event, optionIndex, this.startRangeIndex());
            }

            this.changeFocusedOptionIndex(event, optionIndex);

            !this._overlayVisible() && this.show();
        }

        event.preventDefault();
    }

    onEndKey(event, pressedInInputText = false) {
        const { currentTarget } = event;

        if (pressedInInputText) {
            const len = currentTarget.value.length;
            currentTarget.setSelectionRange(event.shiftKey ? 0 : len, len);
            this.focusedOptionIndex.set(-1);
        } else {
            let metaKey = event.metaKey || event.ctrlKey;
            let optionIndex = this.findLastFocusedOptionIndex();

            if (event.shiftKey && metaKey) {
                this.onOptionSelectRange(event, this.startRangeIndex(), optionIndex);
            }

            this.changeFocusedOptionIndex(event, optionIndex);

            !this._overlayVisible() && this.show();
        }

        event.preventDefault();
    }

    onPageDownKey(event) {
        this.scrollInView(this.visibleOptions().length - 1);
        event.preventDefault();
    }

    onPageUpKey(event) {
        this.scrollInView(0);
        event.preventDefault();
    }

    onEnterKey(event) {
        if (!this._overlayVisible()) {
            this.onArrowDownKey(event);
        } else {
            if (this.focusedOptionIndex() !== -1) {
                if (event.shiftKey) {
                    this.onOptionSelectRange(event, this.focusedOptionIndex());
                } else {
                    this.onOptionSelect({ originalEvent: event, option: this.visibleOptions()[this.focusedOptionIndex()] });
                }
            }
        }

        event.preventDefault();
    }

    onEscapeKey(event: KeyboardEvent) {
        if (this._overlayVisible()) {
            this.hide(true);
            event.stopPropagation();
            event.preventDefault();
        }
    }

    onTabKey(event: KeyboardEvent, pressedInInputText = false) {
        if (!pressedInInputText) {
            if (this._overlayVisible() && this.hasFocusableElements()) {
                focus(event.shiftKey ? this.lastHiddenFocusableElementOnOverlay()?.nativeElement : this.firstHiddenFocusableElementOnOverlay()?.nativeElement);

                event.preventDefault();
            } else {
                this._overlayVisible() && this.hide(this.filter());
            }
        }
    }

    onShiftKey() {
        this.startRangeIndex.set(this.focusedOptionIndex());
    }

    onContainerClick(event: any) {
        const focusInputViewChild = this.focusInputViewChild();
        if (this.$disabled() || this.loading() || this.readonly() || event.target?.isSameNode?.(focusInputViewChild.nativeElement)) {
            return;
        }

        const overlayViewChild = this.overlayViewChild();
        if (!overlayViewChild.el.nativeElement.contains(event.target)) {
            if (this.clickInProgress()) {
                return;
            }

            this.clickInProgress.set(true);

            setTimeout(() => {
                this.clickInProgress.set(false);
            }, 150);

            this._overlayVisible() ? this.hide(true) : this.show(true);
        }
        focusInputViewChild.nativeElement.focus({ preventScroll: true });
        this.onClick.emit(event);
    }

    onFirstHiddenFocus(event) {
        const focusInputViewChild = this.focusInputViewChild();
        const focusableEl = event.relatedTarget === focusInputViewChild.nativeElement ? getFirstFocusableElement(this.overlayViewChild().overlayViewChild()?.nativeElement, ':not([data-p-hidden-focusable="true"])') : focusInputViewChild.nativeElement;

        focus(focusableEl);
    }

    onInputFocus(event: Event) {
        this.focused.set(true);
        const focusedOptionIndex = this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this._overlayVisible() && this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : -1;
        this.focusedOptionIndex.set(focusedOptionIndex);
        this._overlayVisible() && this.scrollInView(this.focusedOptionIndex());
        this.onFocus.emit({ originalEvent: event });
    }

    onInputBlur(event: Event) {
        this.focused.set(false);
        this.onBlur.emit({ originalEvent: event });

        if (!this.preventModelTouched()) {
            this.onModelTouched();
        }
        this.preventModelTouched.set(false);
    }

    onFilterInputChange(event: Event) {
        let value: string = (event.target as HTMLInputElement).value;
        this._filterValue.set(value);
        this.focusedOptionIndex.set(-1);
        this.onFilter.emit({ originalEvent: event, filter: this._filterValue() });

        !this.virtualScrollerDisabled() && this.scroller()?.scrollToIndex(0);
        setTimeout(() => {
            this.overlayViewChild().alignOverlay();
        });
    }

    onLastHiddenFocus(event) {
        const focusInputViewChild = this.focusInputViewChild();
        const focusableEl = event.relatedTarget === focusInputViewChild.nativeElement ? getLastFocusableElement(this.overlayViewChild().overlayViewChild()?.nativeElement, ':not([data-p-hidden-focusable="true"])') : focusInputViewChild.nativeElement;

        focus(focusableEl);
    }

    onOptionMouseEnter(event, index) {
        if (this.focusOnHover()) {
            this.changeFocusedOptionIndex(event, index, false);
        }
    }

    onFilterBlur(event) {
        this.focusedOptionIndex.set(-1);
    }

    onToggleAll(event) {
        if (this.$disabled() || this.readonly()) {
            return;
        }

        if (this.selectAll() != null) {
            this.onSelectAllChange.emit({
                originalEvent: event,
                checked: !this.allSelected()
            });
        } else {
            // pre-selected disabled options should always be selected.
            const selectedDisabledOptions = this.getAllVisibleAndNonVisibleOptions().filter(
                (option) => this.isSelected(option) && (this.optionDisabled() ? resolveFieldData(option, this.optionDisabled()) : option && option.disabled !== undefined ? option.disabled : false)
            );

            const visibleOptions = this.allSelected()
                ? this.visibleOptions().filter((option) => !this.isValidOption(option) && this.isSelected(option))
                : this.visibleOptions().filter((option) => this.isSelected(option) || this.isValidOption(option));

            const selectedOptionsBeforeSearch = this.filter() && !this.allSelected() ? this.getAllVisibleAndNonVisibleOptions().filter((option) => this.isSelected(option) && this.isValidOption(option)) : [];

            const optionValues = [...selectedOptionsBeforeSearch, ...selectedDisabledOptions, ...visibleOptions].map((option) => this.getOptionValue(option));
            const value = [...new Set(optionValues)];

            this.updateModel(value, event);

            // because onToggleAll could have been called during filtering, this additional test needs to be performed before calling onSelectAllChange.emit
            if (!value.length || value.length === this.getAllVisibleAndNonVisibleOptions().length) {
                this.onSelectAllChange.emit({
                    originalEvent: event,
                    checked: !!value.length
                });
            }
        }

        if (this.partialSelected()) {
            this.selectedOptions.set([]);
        }

        this.onChange.emit({ originalEvent: event, value: this.value() });
        DomHandler.focus(this.headerCheckboxViewChild()?.inputViewChild()?.nativeElement);

        event.originalEvent.preventDefault();
        event.originalEvent.stopPropagation();
    }

    changeFocusedOptionIndex(event, index, scroll = true) {
        if (this.focusedOptionIndex() !== index) {
            this.focusedOptionIndex.set(index);
            scroll && this.scrollInView();
        }
    }

    virtualScrollerDisabled = computed(() => !this.virtualScroll());

    scrollInView(index = -1) {
        const id = index !== -1 ? `${this._id()}_${index}` : this.focusedOptionId();
        const itemsViewChild = this.itemsViewChild();
        if (itemsViewChild && itemsViewChild.nativeElement) {
            const element = findSingle(itemsViewChild.nativeElement, `li[id="${id}"]`);
            if (element) {
                element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            } else if (!this.virtualScrollerDisabled()) {
                setTimeout(() => {
                    this.virtualScroll() && this.scroller()?.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex());
                }, 0);
            }
        }
    }

    focusedOptionId = computed(() => (this.focusedOptionIndex() !== -1 ? `${this._id()}_${this.focusedOptionIndex()}` : null));

    allSelected = computed(() => (this.selectAll() !== null ? this.selectAll() : isNotEmpty(this.visibleOptions()) && this.visibleOptions().every((option) => this.isOptionGroup(option) || this.isOptionDisabled(option) || this.isSelected(option))));

    partialSelected = computed(() => this.selectedOptions() && this.selectedOptions().length > 0 && this.selectedOptions().length < this.getAllVisibleAndNonVisibleOptions().filter((option) => !this.isOptionGroup(option)).length);

    /**
     * Displays the panel.
     * @group Method
     */
    public show(isFocus?) {
        this._overlayVisible.set(true);

        const focusedOptionIndex = this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : this.findSelectedOptionIndex();
        this.focusedOptionIndex.set(focusedOptionIndex);

        if (isFocus) {
            focus(this.focusInputViewChild().nativeElement);
        }
    }

    /**
     * Hides the panel.
     * @group Method
     */
    public hide(isFocus?) {
        this._overlayVisible.set(false);
        this.focusedOptionIndex.set(-1);

        if (this.filter() && this.resetFilterOnHide()) {
            this.resetFilter();
        }
        if (this.overlayOptions()?.mode === 'modal') {
            unblockBodyScroll();
        }

        isFocus && focus(this.focusInputViewChild().nativeElement);
    }

    onOverlayBeforeEnter(event: any) {
        this.itemsWrapper.set(<any>findSingle(this.overlayViewChild().overlayViewChild()?.nativeElement, this.virtualScroll() ? '[data-pc-name="virtualscroller"]' : '[data-pc-section="listcontainer"]'));
        this.virtualScroll() && this.scroller()?.setContentEl(this.itemsViewChild()?.nativeElement);

        if (this._options() && this._options().length) {
            if (this.virtualScroll()) {
                const selectedIndex = this.modelValue() ? this.focusedOptionIndex() : -1;
                if (selectedIndex !== -1) {
                    this.scroller()?.scrollToIndex(selectedIndex);
                }
            } else {
                let selectedListItem = findSingle(this.itemsWrapper(), '[data-pc-section="option"][data-p-selected="true"]');

                if (selectedListItem) {
                    selectedListItem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                }
            }
        }

        const filterInputChild = this.filterInputChild();
        if (filterInputChild && filterInputChild.nativeElement) {
            this.preventModelTouched.set(true);

            if (this.autofocusFilter()) {
                filterInputChild.nativeElement.focus();
            }
        }

        this.onPanelShow.emit(event);
    }

    onOverlayAfterLeave(event: any) {
        this.itemsWrapper.set(null);
        this.onModelTouched();
        this.onPanelHide.emit(event);
    }

    resetFilter() {
        const filterInputChild = this.filterInputChild();
        if (filterInputChild && filterInputChild.nativeElement) {
            filterInputChild.nativeElement.value = '';
        }

        this._filterValue.set(null);
    }

    onOverlayHide(event: any) {
        // Called when overlay completes its hide animation
        // Don't call hide() again to avoid recursive calls
        this.focusedOptionIndex.set(-1);
        if (this.filter() && this.resetFilterOnHide()) {
            this.resetFilter();
        }
    }

    close(event: Event) {
        this.hide();
        event.preventDefault();
        event.stopPropagation();
    }

    clear(event: Event) {
        this.value.set([]);
        this.updateModel(null, event);
        this.selectedOptions.set([]);
        this.onClear.emit();
        this._disableTooltip.set(true);

        event.stopPropagation();
    }

    labelContainerMouseLeave() {
        if (this._disableTooltip()) this._disableTooltip.set(false);
    }

    removeOption(optionValue, event) {
        let value = this.modelValue().filter((val) => !equals(val, optionValue, this.equalityKey() || ''));

        this.updateModel(value, event);
        this.onChange.emit({
            originalEvent: event,
            value: value,
            itemValue: optionValue
        });
        this.onRemove.emit({
            newValue: value,
            removed: optionValue
        });

        event && event.stopPropagation();
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

    findPrevOptionIndex(index) {
        const matchedOptionIndex = index > 0 ? findLastIndex(this.visibleOptions().slice(0, index), (option) => this.isValidOption(option)) : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    }

    findLastSelectedOptionIndex = computed(() => (this.hasSelectedOption() ? findLastIndex(this.visibleOptions(), (option) => this.isValidSelectedOption(option)) : -1));

    findLastFocusedOptionIndex = computed(() => {
        const selectedIndex = this.findLastSelectedOptionIndex();

        return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    });

    findLastOptionIndex = computed(() => findLastIndex(this.visibleOptions(), (option) => this.isValidOption(option)));

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

    hasFocusableElements() {
        return getFocusableElements(this.overlayViewChild().overlayViewChild()?.nativeElement, ':not([data-p-hidden-focusable="true"])').length > 0;
    }

    hasFilter = computed(() => this._filterValue() && this._filterValue().trim().length > 0);

    containerDataP = computed(() => {
        return this.cn({
            invalid: this.invalid(),
            disabled: this.$disabled(),
            focus: this.focused(),
            fluid: this.hasFluid(),
            filled: this.$variant() === 'filled',
            [this.size() as string]: this.size()
        });
    });

    labelDataP = computed(() => {
        const value = this.value();
        const maxSelectedLabels = this.maxSelectedLabels();
        return this.cn({
            placeholder: this.label() === this.placeholder(),
            clearable: this.showClear(),
            disabled: this.$disabled(),
            [this.size() as string]: this.size(),
            'has-chip': this.display() === 'chip' && value && value.length && (maxSelectedLabels ? value.length <= maxSelectedLabels : true),
            empty: !this.placeholder() && !this.$filled()
        });
    });

    dropdownIconDataP = computed(() => {
        return this.cn({
            [this.size() as string]: this.size()
        });
    });

    overlayDataP = computed(() => {
        return this.cn({
            ['overlay-' + this.$appendTo()]: 'overlay-' + this.$appendTo()
        });
    });

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        this.value.set(value);
        setModelValue(value);
    }

    getHeaderCheckboxPTOptions(key: string) {
        return this.ptm(key, {
            context: {
                selected: this.allSelected()
            }
        });
    }

    getPTOptions(option, itemOptions, index, key) {
        return this.ptm(key, {
            context: {
                selected: this.isSelected(option),
                focused: this.focusedOptionIndex() === this.getOptionIndex(index, itemOptions),
                disabled: this.isOptionDisabled(option)
            }
        });
    }
}

@NgModule({
    imports: [MultiSelect, SharedModule],
    exports: [MultiSelect, SharedModule]
})
export class MultiSelectModule {}
