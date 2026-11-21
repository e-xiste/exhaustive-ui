import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
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
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MotionOptions } from '@exhaustive-ui/motion';
import { deepEquals, equals, findLastIndex, findSingle, focus, getFirstFocusableElement, getFocusableElements, getLastFocusableElement, isEmpty, isNotEmpty, isPrintableCharacter, resolveFieldData, scrollInView, uuid } from '@exhaustive-ui/utils';
import { FilterService, OverlayOptions, PrimeTemplate, ScrollerOptions, SharedModule, TranslationKeys } from '@exhaustive-ui/core/api';
import { AutoFocus } from '@exhaustive-ui/core/autofocus';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseInput } from '@exhaustive-ui/core/baseinput';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { unblockBodyScroll } from '@exhaustive-ui/core/dom';
import { IconField } from '@exhaustive-ui/core/iconfield';
import { BlankIcon, CheckIcon, ChevronDownIcon, SearchIcon, SpinnerIcon, TimesIcon } from '@exhaustive-ui/core/icons';
import { InputIcon } from '@exhaustive-ui/core/inputicon';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { Overlay } from '@exhaustive-ui/core/overlay';
import { Ripple } from '@exhaustive-ui/core/ripple';
import { Scroller } from '@exhaustive-ui/core/scroller';
import { Tooltip } from '@exhaustive-ui/core/tooltip';
import { Nullable } from '@exhaustive-ui/core/ts-helpers';
import {
    SelectChangeEvent,
    SelectFilterEvent,
    SelectFilterOptions,
    SelectFilterTemplateContext,
    SelectGroupTemplateContext,
    SelectIconTemplateContext,
    SelectItemTemplateContext,
    SelectLazyLoadEvent,
    SelectLoaderTemplateContext,
    SelectPassThrough,
    SelectSelectedItemTemplateContext
} from '@exhaustive-ui/core/types/select';
import { SelectStyle } from './style/selectstyle';

const SELECT_INSTANCE = new InjectionToken<Select>('SELECT_INSTANCE');
const SELECT_ITEM_INSTANCE = new InjectionToken<SelectItem>('SELECT_ITEM_INSTANCE');

export const SELECT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Select),
    multi: true
};

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'p-selectItem',
    imports: [CommonModule, SharedModule, Ripple, CheckIcon, BlankIcon, BindModule],
    template: `
        <li
            [id]="id()"
            [pBind]="getPTOptions()"
            (click)="onOptionClick($event)"
            (mouseenter)="onOptionMouseEnter($event)"
            role="option"
            pRipple
            [attr.aria-label]="label()"
            [attr.aria-setsize]="ariaSetSize()"
            [attr.aria-posinset]="ariaPosInset()"
            [attr.aria-selected]="selected()"
            [attr.data-p-focused]="focused()"
            [attr.data-p-highlight]="selected()"
            [attr.data-p-selected]="selected()"
            [attr.data-p-disabled]="disabled()"
            [ngStyle]="{ height: scrollerOptions()?.itemSize + 'px' }"
            [class]="cx('option')"
        >
            @if (checkmark()) {
                @if (selected()) {
                    <svg data-p-icon="check" [class]="cx('optionCheckIcon')" [pBind]="$pcSelect?.ptm('optionCheckIcon')" />
                }
                @if (!selected()) {
                    <svg data-p-icon="blank" [class]="cx('optionBlankIcon')" [pBind]="$pcSelect?.ptm('optionBlankIcon')" />
                }
            }
            @if (!template()) {
                <span [pBind]="$pcSelect?.ptm('optionLabel')">{{ label() ?? 'empty' }}</span>
            }
            <ng-container *ngTemplateOutlet="template(); context: { $implicit: option() }"></ng-container>
        </li>
    `,
    providers: [SelectStyle, { provide: PARENT_INSTANCE, useExisting: SelectItem }]
})
export class SelectItem extends BaseComponent {
    hostName = 'select';

    $pcSelectItem: SelectItem | undefined = inject(SELECT_ITEM_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    $pcSelect: Select | undefined = inject(SELECT_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    id = input<string | undefined>();

    option = input<any>();

    selected = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    focused = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    label = input<string | undefined>();

    disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    ariaPosInset = input<string | undefined>();

    ariaSetSize = input<string | undefined>();

    template = input<TemplateRef<any> | undefined>();

    checkmark = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    index = input<number | undefined>();

    scrollerOptions = input<any>();

    readonly onClick = output<any>();

    readonly onMouseEnter = output<any>();

    _componentStyle = inject(SelectStyle);

    onOptionClick(event: Event) {
        this.onClick.emit(event);
    }

    onOptionMouseEnter(event: Event) {
        this.onMouseEnter.emit(event);
    }

    getPTOptions() {
        return (
            this.$pcSelect?.getPTItemOptions?.(this.option(), this.scrollerOptions(), this.index() ?? 0, 'option') ??
            this.$pcSelect?.ptm('option', {
                context: {
                    option: this.option(),
                    selected: this.selected(),
                    focused: this.focused(),
                    disabled: this.disabled()
                }
            })
        );
    }
}

/**
 * Select is used to choose an item from a collection of options.
 * @group Components
 */

@Component({
    selector: 'p-select',
    imports: [CommonModule, SelectItem, Overlay, Tooltip, AutoFocus, TimesIcon, ChevronDownIcon, SearchIcon, SpinnerIcon, InputText, IconField, InputIcon, Scroller, SharedModule, BindModule],
    template: `
        @if (!editable()) {
            <span
                #focusInput
                [class]="cx('label')"
                [pBind]="ptm('label')"
                [pTooltip]="tooltip()"
                [pTooltipUnstyled]="unstyled()"
                [tooltipPosition]="tooltipPosition()"
                [positionStyle]="tooltipPositionStyle()"
                [tooltipStyleClass]="tooltipStyleClass()"
                [attr.aria-disabled]="$disabled()"
                [attr.id]="inputId()"
                role="combobox"
                [attr.aria-label]="ariaLabel() || (label() === 'p-emptylabel' ? undefined : label())"
                [attr.aria-labelledby]="ariaLabelledBy()"
                [attr.aria-haspopup]="'listbox'"
                [attr.aria-expanded]="overlayVisible() ?? false"
                [attr.aria-controls]="overlayVisible() ? _id() + '_list' : null"
                [attr.tabindex]="!$disabled() ? tabindex() : -1"
                [pAutoFocus]="autofocus()"
                [attr.aria-activedescendant]="focused() ? focusedOptionId() : undefined"
                (focus)="onInputFocus($event)"
                (blur)="onInputBlur($event)"
                (keydown)="onKeyDown($event)"
                [attr.aria-required]="required()"
                [attr.required]="required() ? '' : undefined"
                [attr.disabled]="$disabled() ? '' : undefined"
                [attr.data-p]="labelDataP()"
            >
                @if (!selectedItemTemplate() && !_selectedItemTemplate()) {
                    <ng-container>{{ label() === 'p-emptylabel' ? '&nbsp;' : label() }}</ng-container>
                } @else {
                    @if (isSelectedOptionEmpty()) {
                        <span>{{ label() === 'p-emptylabel' ? '&nbsp;' : label() }}</span>
                    }
                }
                @if ((selectedItemTemplate() || _selectedItemTemplate()) && !isSelectedOptionEmpty()) {
                    <ng-container [ngTemplateOutlet]="selectedItemTemplate() || _selectedItemTemplate()" [ngTemplateOutletContext]="{ $implicit: selectedOption() }"></ng-container>
                }
            </span>
        }
        @if (editable()) {
            <input
                #editableInput
                type="text"
                [attr.id]="inputId()"
                [class]="cx('label')"
                [pBind]="ptm('label')"
                [attr.aria-haspopup]="'listbox'"
                [attr.placeholder]="modelValue() === undefined || modelValue() === null ? _placeholder() : undefined"
                [attr.aria-label]="ariaLabel()"
                [attr.aria-labelledby]="ariaLabelledBy()"
                (input)="onEditableInput($event)"
                (keydown)="onKeyDown($event)"
                [pAutoFocus]="autofocus()"
                [attr.aria-activedescendant]="focused() ? focusedOptionId() : undefined"
                (focus)="onInputFocus($event)"
                (blur)="onInputBlur($event)"
                [attr.name]="name()"
                [attr.minlength]="minlength()"
                [attr.min]="min()"
                [attr.max]="max()"
                [attr.pattern]="pattern()"
                [attr.size]="inputSize()"
                [attr.maxlength]="maxlength()"
                [attr.required]="required() ? '' : undefined"
                [attr.readonly]="readonly() ? '' : undefined"
                [attr.disabled]="$disabled() ? '' : undefined"
                [attr.data-p]="labelDataP()"
            />
        }
        @if (isVisibleClearIcon()) {
            @if (!clearIconTemplate() && !_clearIconTemplate()) {
                <svg
                    data-p-icon="times"
                    [class]="cx('clearIcon')"
                    [pBind]="ptm('clearIcon')"
                    (click)="clear($event)"
                    (keydown)="onClearIconKeyDown($event)"
                    role="button"
                    tabindex="0"
                    [attr.aria-label]="clearAriaLabel()"
                    [attr.data-pc-section]="'clearicon'"
                />
            }
            @if (clearIconTemplate() || _clearIconTemplate()) {
                <span [class]="cx('clearIcon')" [pBind]="ptm('clearIcon')" (click)="clear($event)" (keydown)="onClearIconKeyDown($event)" role="button" tabindex="0" [attr.aria-label]="clearAriaLabel()" [attr.data-pc-section]="'clearicon'">
                    <ng-template *ngTemplateOutlet="clearIconTemplate() || _clearIconTemplate(); context: { class: cx('clearIcon') }"></ng-template>
                </span>
            }
        }

        <div [class]="cx('dropdown')" [pBind]="ptm('dropdown')" role="button" aria-label="dropdown trigger" aria-haspopup="listbox" [attr.aria-expanded]="overlayVisible() ?? false" [attr.data-pc-section]="'trigger'">
            @if (loading()) {
                @if (loadingIconTemplate() || _loadingIconTemplate()) {
                    <ng-container *ngTemplateOutlet="loadingIconTemplate() || _loadingIconTemplate()"></ng-container>
                }
                @if (!loadingIconTemplate() && !_loadingIconTemplate()) {
                    @if (loadingIcon()) {
                        <span [class]="cn(cx('loadingIcon'), 'pi-spin ' + loadingIcon())" [pBind]="ptm('loadingIcon')" aria-hidden="true"></span>
                    }
                    @if (!loadingIcon()) {
                        <svg data-p-icon="spinner" [class]="cx('loadingIcon')" [pBind]="ptm('loadingIcon')" [spin]="true" aria-hidden="true" />
                    }
                }
            } @else {
                @if (!dropdownIconTemplate() && !_dropdownIconTemplate()) {
                    @if (dropdownIcon()) {
                        <span [class]="cn(cx('dropdownIcon'), dropdownIcon())" [pBind]="ptm('dropdownIcon')" aria-hidden="true"></span>
                    }
                    @if (!dropdownIcon()) {
                        <svg data-p-icon="chevron-down" [class]="cx('dropdownIcon')" [pBind]="ptm('dropdownIcon')" aria-hidden="true" />
                    }
                }
                @if (dropdownIconTemplate() || _dropdownIconTemplate()) {
                    <span [class]="cx('dropdownIcon')" [pBind]="ptm('dropdownIcon')" aria-hidden="true">
                        <ng-template *ngTemplateOutlet="dropdownIconTemplate() || _dropdownIconTemplate(); context: { class: cx('dropdownIcon') }"></ng-template>
                    </span>
                }
            }
        </div>

        <p-overlay
            #overlay
            [hostAttrSelector]="$attrSelector"
            [(visible)]="overlayVisible"
            [options]="overlayOptions()"
            [target]="'@parent'"
            [appendTo]="$appendTo()"
            [unstyled]="unstyled()"
            [pt]="ptm('pcOverlay')"
            [motionOptions]="motionOptions()"
            (onBeforeEnter)="onOverlayBeforeEnter($event)"
            (onAfterLeave)="onOverlayAfterLeave($event)"
            (onHide)="hide()"
        >
            <ng-template #content>
                <div [class]="cn(cx('overlay'), panelStyleClass())" [ngStyle]="panelStyle()" [pBind]="ptm('overlay')" [attr.data-p]="overlayDataP()">
                    <span
                        #firstHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [attr.tabindex]="0"
                        (focus)="onFirstHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                        [pBind]="ptm('hiddenFirstFocusableEl')"
                    >
                    </span>
                    <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate()"></ng-container>
                    @if (filter()) {
                        <div [class]="cx('header')" (click)="$event.stopPropagation()" (keydown)="onFilterTemplateKeyDown($event)" [pBind]="ptm('header')">
                            @if (filterTemplate() || _filterTemplate()) {
                                <ng-container *ngTemplateOutlet="filterTemplate() || _filterTemplate(); context: { options: filterOptions() }"></ng-container>
                            } @else {
                                <p-iconfield [pt]="ptm('pcFilterContainer')" [unstyled]="unstyled()">
                                    <input
                                        #filter
                                        pInputText
                                        [pSize]="size()"
                                        type="text"
                                        role="searchbox"
                                        autocomplete="off"
                                        [value]="_filterValue() || ''"
                                        [class]="cx('pcFilter')"
                                        [variant]="$variant()"
                                        [attr.placeholder]="filterPlaceholder()"
                                        [attr.aria-owns]="_id() + '_list'"
                                        (input)="onFilterInputChange($event)"
                                        [attr.aria-label]="ariaFilterLabel()"
                                        [attr.aria-activedescendant]="focusedOptionId()"
                                        (keydown)="onFilterKeyDown($event)"
                                        (blur)="onFilterBlur($event)"
                                        [pt]="ptm('pcFilter')"
                                        [unstyled]="unstyled()"
                                    />
                                    <p-inputicon [pt]="ptm('pcFilterIconContainer')" [unstyled]="unstyled()">
                                        @if (!filterIconTemplate() && !_filterIconTemplate()) {
                                            <svg data-p-icon="search" [pBind]="ptm('filterIcon')" />
                                        }
                                        @if (filterIconTemplate() || _filterIconTemplate()) {
                                            <span [pBind]="ptm('filterIcon')">
                                                <ng-template *ngTemplateOutlet="filterIconTemplate() || _filterIconTemplate()"></ng-template>
                                            </span>
                                        }
                                    </p-inputicon>
                                </p-iconfield>
                            }
                        </div>
                    }
                    <div [class]="cx('listContainer')" [style.max-height]="virtualScroll() ? 'auto' : scrollHeight() || 'auto'" [pBind]="ptm('listContainer')">
                        @if (virtualScroll()) {
                            <p-scroller
                                hostName="select"
                                #scroller
                                [items]="visibleOptions()"
                                [style]="{ height: scrollHeight() }"
                                [itemSize]="virtualScrollItemSize()"
                                [autoSize]="true"
                                [lazy]="lazy()"
                                (onLazyLoad)="onLazyLoad.emit($event)"
                                [options]="virtualScrollOptions()"
                                [pt]="ptm('virtualScroller')"
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
                            <ul #items [attr.id]="_id() + '_list'" [attr.aria-label]="listLabel()" [class]="cn(cx('list'), scrollerOptions.contentStyleClass)" [style]="scrollerOptions.contentStyle" role="listbox" [pBind]="ptm('list')">
                                @for (option of items; track $index; let i = $index) {
                                    @if (isOptionGroup(option)) {
                                        <li [class]="cx('optionGroup')" [attr.id]="_id() + '_' + getOptionIndex(i, scrollerOptions)" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option" [pBind]="ptm('optionGroup')">
                                            @if (!groupTemplate() && !_groupTemplate()) {
                                                <span [class]="cx('optionGroupLabel')" [pBind]="ptm('optionGroupLabel')">{{ getOptionGroupLabel(option.optionGroup) }}</span>
                                            }
                                            <ng-container *ngTemplateOutlet="groupTemplate() || _groupTemplate(); context: { $implicit: option.optionGroup }"></ng-container>
                                        </li>
                                    }
                                    @if (!isOptionGroup(option)) {
                                        <p-selectItem
                                            [id]="_id() + '_' + getOptionIndex(i, scrollerOptions)"
                                            [option]="option"
                                            [checkmark]="checkmark()"
                                            [selected]="isSelected(option)"
                                            [label]="getOptionLabel(option)"
                                            [disabled]="isOptionDisabled(option)"
                                            [template]="itemTemplate() || _itemTemplate()"
                                            [focused]="focusedOptionIndex() === getOptionIndex(i, scrollerOptions)"
                                            [ariaPosInset]="getAriaPosInset(getOptionIndex(i, scrollerOptions))"
                                            [ariaSetSize]="ariaSetSize()"
                                            [index]="i"
                                            [unstyled]="unstyled()"
                                            [scrollerOptions]="scrollerOptions"
                                            (onClick)="onOptionSelect($event, option)"
                                            (onMouseEnter)="onOptionMouseEnter($event, getOptionIndex(i, scrollerOptions))"
                                        ></p-selectItem>
                                    }
                                }
                                @if (_filterValue() && isEmpty()) {
                                    <li [class]="cx('emptyMessage')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option" [pBind]="ptm('emptyMessage')">
                                        @if (!emptyFilterTemplate() && !_emptyFilterTemplate() && !emptyTemplate()) {
                                            {{ emptyFilterMessageLabel() }}
                                        } @else {
                                            <ng-container #emptyFilter *ngTemplateOutlet="emptyFilterTemplate() || _emptyFilterTemplate() || emptyTemplate() || _emptyTemplate()"></ng-container>
                                        }
                                    </li>
                                }
                                @if (!_filterValue() && isEmpty()) {
                                    <li [class]="cx('emptyMessage')" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }" role="option" [pBind]="ptm('emptyMessage')">
                                        @if (!emptyTemplate() && !_emptyTemplate()) {
                                            {{ emptyMessageLabel() || emptyFilterMessageLabel() }}
                                        } @else {
                                            <ng-container #empty *ngTemplateOutlet="emptyTemplate() || _emptyTemplate()"></ng-container>
                                        }
                                    </li>
                                }
                            </ul>
                        </ng-template>
                    </div>
                    <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate()"></ng-container>
                    <span
                        #lastHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [pBind]="ptm('hiddenLastFocusableEl')"
                        [attr.tabindex]="0"
                        (focus)="onLastHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                    ></span>
                </div>
            </ng-template>
        </p-overlay>
    `,
    host: {
        '[class]': "cx('root')",
        '[attr.id]': '_id()',
        '[attr.data-p]': 'containerDataP()',
        '(click)': 'onContainerClick($event)'
    },
    providers: [SELECT_VALUE_ACCESSOR, SelectStyle, { provide: SELECT_INSTANCE, useExisting: Select }, { provide: PARENT_INSTANCE, useExisting: Select }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [Bind]
})
export class Select extends BaseInput<SelectPassThrough> {
    filterService = inject(FilterService);

    componentName = 'Select';

    bindDirectiveInstance = inject(Bind, { self: true });
    /**
     * Unique identifier of the component
     * @group Props
     */
    id = input<string | undefined>();
    /**
     * Height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    scrollHeight = input<string>('200px');
    /**
     * When specified, displays an input field to filter the items on keyup.
     * @group Props
     */
    filter = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Inline style of the overlay panel element.
     * @group Props
     */
    panelStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the overlay panel element.
     * @group Props
     */
    panelStyleClass = input<string | undefined>();
    /**
     * When present, it specifies that the component cannot be edited.
     * @group Props
     */
    readonly = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When present, custom value instead of predefined options can be entered using the editable input field.
     * @group Props
     */
    editable = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input<number | undefined, unknown>(0, { transform: numberAttribute });
    /**
     * Default text to display when no option is selected.
     * @group Props
     */
    placeholder = input<string | undefined>();
    /**
     * Icon to display in loading state.
     * @group Props
     */
    loadingIcon = input<string | undefined>();
    /**
     * Placeholder text to show when filter input is empty.
     * @group Props
     */
    filterPlaceholder = input<string | undefined>();
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    filterLocale = input<string | undefined>();
    /**
     * Identifier of the accessible input element.
     * @group Props
     */
    inputId = input<string | undefined>();
    /**
     * A property to uniquely identify a value in options.
     * @group Props
     */
    dataKey = input<string | undefined>();
    /**
     * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
     * @group Props
     */
    filterBy = input<string | undefined>();
    /**
     * Fields used when filtering the options, defaults to optionLabel.
     * @group Props
     */
    filterFields = input<any[] | undefined>();
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Clears the filter value when hiding the select.
     * @group Props
     */
    resetFilterOnHide = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the selected option will be shown with a check mark.
     * @group Props
     */
    checkmark = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Icon class of the select icon.
     * @group Props
     */
    dropdownIcon = input<string | undefined>();
    /**
     * Whether the select is in loading state.
     * @group Props
     */
    loading = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
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
     * Whether to display options as grouped when nested options are provided.
     * @group Props
     */
    group = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    showClear = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Text to display when filtering does not return any results. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    emptyFilterMessage = input<string>('');
    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    emptyMessage = input<string>('');
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
     * Height of an item in the list for VirtualScrolling.
     * @group Props
     */
    virtualScrollItemSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
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
     * Used to define a aria label attribute the current element.
     * @group Props
     */
    ariaLabel = input<string | undefined>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>();
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
     * Fields used when filtering the options, defaults to optionLabel.
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
     * Applies focus to the filter element when the overlay is shown.
     * @group Props
     */
    autofocusFilter = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * When specified, filter displays with this value.
     * @group Props
     */
    filterValue = input<string | undefined | null>(null);
    /**
     * An array of objects to display as the available options.
     * @group Props
     */
    options = input<any[] | null | undefined>();
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
     * Callback to invoke when value of select changes.
     * @param {SelectChangeEvent} event - custom change event.
     * @group Emits
     */
    readonly onChange = output<SelectChangeEvent>();
    /**
     * Callback to invoke when data is filtered.
     * @param {SelectFilterEvent} event - custom filter event.
     * @group Emits
     */
    readonly onFilter = output<SelectFilterEvent>();
    /**
     * Callback to invoke when select gets focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onFocus = output<Event>();
    /**
     * Callback to invoke when select loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onBlur = output<Event>();
    /**
     * Callback to invoke when component is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onClick = output<MouseEvent>();
    /**
     * Callback to invoke when select overlay gets visible.
     * @param {AnimationEvent} event - Animation event.
     * @group Emits
     */
    readonly onShow = output<AnimationEvent>();
    /**
     * Callback to invoke when select overlay gets hidden.
     * @param {AnimationEvent} event - Animation event.
     * @group Emits
     */
    readonly onHide = output<AnimationEvent>();
    /**
     * Callback to invoke when select clears the value.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onClear = output<Event | undefined>();
    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {SelectLazyLoadEvent} event - Lazy load event.
     * @group Emits
     */
    readonly onLazyLoad = output<SelectLazyLoadEvent>();

    _componentStyle = inject(SelectStyle);

    readonly filterViewChild = viewChild<Nullable<ElementRef>>('filter');

    readonly focusInputViewChild = viewChild<Nullable<ElementRef>>('focusInput');

    readonly editableInputViewChild = viewChild<Nullable<ElementRef>>('editableInput');

    readonly itemsViewChild = viewChild<Nullable<ElementRef>>('items');

    readonly scroller = viewChild<Nullable<Scroller>>('scroller');

    readonly overlayViewChild = viewChild.required<Overlay>('overlay');

    readonly firstHiddenFocusableElementOnOverlay = viewChild<Nullable<ElementRef>>('firstHiddenFocusableEl');

    readonly lastHiddenFocusableElementOnOverlay = viewChild<Nullable<ElementRef>>('lastHiddenFocusableEl');

    itemsWrapper = signal<Nullable<HTMLDivElement>>(undefined);

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    /**
     * Custom item template.
     * @group Templates
     */
    readonly itemTemplate = contentChild<Nullable<TemplateRef<SelectItemTemplateContext>>>('item', { descendants: false });

    /**
     * Custom group template.
     * @group Templates
     */
    readonly groupTemplate = contentChild<Nullable<TemplateRef<SelectGroupTemplateContext>>>('group', { descendants: false });

    /**
     * Custom loader template.
     * @group Templates
     */
    readonly loaderTemplate = contentChild<Nullable<TemplateRef<SelectLoaderTemplateContext>>>('loader', { descendants: false });

    /**
     * Custom selected item template.
     * @group Templates
     */
    readonly selectedItemTemplate = contentChild<Nullable<TemplateRef<SelectSelectedItemTemplateContext>>>('selectedItem', { descendants: false });

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<Nullable<TemplateRef<void>>>('header', { descendants: false });

    /**
     * Custom filter template.
     * @group Templates
     */
    readonly filterTemplate = contentChild<Nullable<TemplateRef<SelectFilterTemplateContext>>>('filter', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    readonly footerTemplate = contentChild<Nullable<TemplateRef<void>>>('footer', { descendants: false });

    /**
     * Custom empty filter template.
     * @group Templates
     */
    readonly emptyFilterTemplate = contentChild<Nullable<TemplateRef<void>>>('emptyfilter', { descendants: false });

    /**
     * Custom empty template.
     * @group Templates
     */
    readonly emptyTemplate = contentChild<Nullable<TemplateRef<void>>>('empty', { descendants: false });

    /**
     * Custom dropdown icon template.
     * @group Templates
     */
    readonly dropdownIconTemplate = contentChild<Nullable<TemplateRef<SelectIconTemplateContext>>>('dropdownicon', { descendants: false });

    /**
     * Custom loading icon template.
     * @group Templates
     */
    readonly loadingIconTemplate = contentChild<Nullable<TemplateRef<void>>>('loadingicon', { descendants: false });

    /**
     * Custom clear icon template.
     * @group Templates
     */
    readonly clearIconTemplate = contentChild<Nullable<TemplateRef<SelectIconTemplateContext>>>('clearicon', { descendants: false });

    /**
     * Custom filter icon template.
     * @group Templates
     */
    readonly filterIconTemplate = contentChild<Nullable<TemplateRef<void>>>('filtericon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    readonly _itemTemplate = computed<TemplateRef<SelectItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => !['selectedItem', 'header', 'filter', 'footer', 'emptyfilter', 'empty', 'group', 'loader', 'dropdownicon', 'loadingicon', 'clearicon', 'filtericon', 'cancelicon', 'onicon', 'officon'].includes(item.getType()))
                .at(-1)?.template
    );

    readonly _selectedItemTemplate = computed<TemplateRef<SelectSelectedItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'selectedItem')
                .at(-1)?.template
    );

    readonly _headerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    readonly _filterTemplate = computed<TemplateRef<SelectFilterTemplateContext> | undefined>(
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

    readonly _groupTemplate = computed<TemplateRef<SelectGroupTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'group')
                .at(-1)?.template
    );

    readonly _loaderTemplate = computed<TemplateRef<SelectLoaderTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'loader')
                .at(-1)?.template
    );

    readonly _dropdownIconTemplate = computed<TemplateRef<SelectIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'dropdownicon')
                .at(-1)?.template
    );

    readonly _loadingIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'loadingicon')
                .at(-1)?.template
    );

    readonly _clearIconTemplate = computed<TemplateRef<SelectIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'clearicon')
                .at(-1)?.template
    );

    readonly _filterIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'filtericon')
                .at(-1)?.template
    );

    filterOptions = computed<SelectFilterOptions | undefined>(() =>
        this.filterBy()
            ? {
                  filter: (value) => this.onFilterInputChange(value),
                  reset: () => this.resetFilter()
              }
            : undefined
    );

    _options = computed<any[] | null | undefined>(() => this.options(), { equal: deepEquals });

    _placeholder = linkedSignal<string | undefined>(() => this.placeholder());

    value = signal<any>(undefined);

    focused = signal<Nullable<boolean>>(undefined);

    overlayVisible = signal<Nullable<boolean>>(undefined);

    selectedOptionUpdated = signal<Nullable<boolean>>(undefined);

    _filterValue = linkedSignal<any>(() => this.filterValue());

    searchValue = signal<Nullable<string>>(undefined);

    searchTimeout = signal<any>(undefined);

    preventModelTouched = signal<Nullable<boolean>>(undefined);

    focusedOptionIndex = signal<number>(-1);

    clicked = signal<boolean>(false);

    translation = toSignal(this.config.translationObserver, { initialValue: this.config.translation });

    _id = computed(() => this.id() || uuid('pn_id_'));

    emptyMessageLabel = computed<string>(() => this.emptyMessage() || this.translation()[TranslationKeys.EMPTY_MESSAGE]);

    emptyFilterMessageLabel = computed<string>(() => this.emptyFilterMessage() || this.translation()[TranslationKeys.EMPTY_FILTER_MESSAGE]);

    /**
     * Whether an ancestor `<fieldset disabled>` disables the component, as it does native form controls.
     */
    private fieldsetDisabled = signal<boolean>(false);

    private fieldsetObserver: MutationObserver | undefined;

    $disabled = computed(() => this.disabled() || this._disabled() || this.fieldsetDisabled());

    isVisibleClearIcon = computed<boolean | undefined>(() => this.modelValue() != null && this.hasSelectedOption() && this.showClear() && !this.$disabled());

    listLabel = computed<string>(() => this.translation()[TranslationKeys.ARIA]['listLabel']);

    clearAriaLabel = computed<string>(() => this.translation()[TranslationKeys.CLEAR]);

    focusedOptionId = computed(() => (this.focusedOptionIndex() !== -1 ? `${this._id()}_${this.focusedOptionIndex()}` : null));

    visibleOptions = computed(() => {
        const options = this.getAllVisibleAndNonVisibleOptions();

        if (this._filterValue()) {
            const _filterBy = this.filterBy() || this.optionLabel();

            const filteredOptions =
                !_filterBy && !this.filterFields() && !this.optionValue()
                    ? this._options()?.filter((option) => {
                          if (option.label) {
                              return option.label.toString().toLowerCase().indexOf(this._filterValue().toLowerCase().trim()) !== -1;
                          }
                          return option.toString().toLowerCase().indexOf(this._filterValue().toLowerCase().trim()) !== -1;
                      })
                    : this.filterService.filter(options, this.searchFields(), this._filterValue().trim(), this.filterMatchMode(), this.filterLocale());

            if (this.group()) {
                const optionGroups = this._options() || [];
                const filtered: any[] = [];

                optionGroups.forEach((group) => {
                    const groupChildren = this.getOptionGroupChildren(group);
                    const filteredItems = groupChildren.filter((item) => filteredOptions?.includes(item));

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
        // use  getAllVisibleAndNonVisibleOptions verses just visible options
        // this will find the selected option whether or not the user is currently filtering  because the filtered (i.e. visible) options, are a subset of all the options
        const options = this.getAllVisibleAndNonVisibleOptions();

        // use isOptionEqualsModelValue for the use case where the dropdown is initalized with a disabled option
        const selectedOptionIndex = options.findIndex((option) => {
            const isEqual = this.isOptionValueEqualsModelValue(option);
            return isEqual;
        });

        if (selectedOptionIndex !== -1) {
            const selectedOption = options[selectedOptionIndex];
            // Always show the label for selected options, even if disabled
            return this.getOptionLabel(selectedOption);
        }

        return this._placeholder() || 'p-emptylabel';
    });

    selectedOption = linkedSignal<{ modelValue: any; visibleOptions: any[] }, any>({
        source: () => ({ modelValue: this.modelValue(), visibleOptions: this.visibleOptions() }),
        computation: ({ modelValue, visibleOptions }, previous) => {
            let selectedOption = previous?.value;

            if (visibleOptions && isNotEmpty(visibleOptions)) {
                const selectedOptionIndex = this.findSelectedOptionIndex();

                if (selectedOptionIndex !== -1 || modelValue === undefined || (typeof modelValue === 'string' && modelValue.length === 0) || this.isModelValueNotSet(selectedOption) || this.editable()) {
                    selectedOption = visibleOptions[selectedOptionIndex];
                } else {
                    // If no valid selected option found but we have a model value,
                    // try to find the option including disabled ones for template display
                    const disabledSelectedIndex = visibleOptions.findIndex((option) => this.isSelected(option));
                    if (disabledSelectedIndex !== -1) {
                        selectedOption = visibleOptions[disabledSelectedIndex];
                    }
                }
            }

            if (isEmpty(visibleOptions) && (modelValue === undefined || this.isModelValueNotSet(selectedOption)) && isNotEmpty(selectedOption)) {
                selectedOption = null;
            }

            return selectedOption;
        }
    });

    constructor() {
        super();
        effect(() => {
            if (this.modelValue() !== undefined && this.editable()) {
                this.updateEditableLabel();
            }
        });
        afterNextRender(() => {
            if (this.editable()) {
                this.updateEditableLabel();
            }
            this.updatePlaceHolderForFloatingLabel();
        });
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));

            const itemsWrapper = this.itemsWrapper();
            if (this.selectedOptionUpdated() && itemsWrapper) {
                let selectedItem = <any>findSingle(this.overlayViewChild().overlayViewChild()?.nativeElement, 'li[data-p-selected="true"]');
                if (selectedItem) {
                    scrollInView(itemsWrapper, selectedItem);
                }
                this.selectedOptionUpdated.set(false);
            }
        });
    }

    private isModelValueNotSet(selectedOption: any): boolean {
        return this.modelValue() === null && !this.isOptionValueEqualsModelValue(selectedOption);
    }

    private getAllVisibleAndNonVisibleOptions = computed(() => (this.group() ? this.flatOptions(this._options()) : this._options() || []));

    onInit() {
        this.autoUpdateModel();
    }

    onAfterViewInit() {
        this.bindFieldsetObserver();
    }

    onDestroy() {
        this.fieldsetObserver?.disconnect();
        this.fieldsetObserver = undefined;
    }

    private bindFieldsetObserver() {
        if (!isPlatformBrowser(this.platformId) || typeof MutationObserver === 'undefined') {
            return;
        }

        const host = this.el.nativeElement as HTMLElement;
        const fieldsets: HTMLFieldSetElement[] = [];
        let fieldset = host.parentElement?.closest('fieldset');
        while (fieldset) {
            fieldsets.push(fieldset);
            fieldset = fieldset.parentElement?.closest('fieldset');
        }

        if (fieldsets.length) {
            // A control inside the first <legend> of a disabled fieldset stays enabled, like native controls.
            const update = () => this.fieldsetDisabled.set(fieldsets.some((f) => f.disabled && !f.querySelector(':scope > legend')?.contains(host)));
            this.fieldsetObserver = new MutationObserver(update);
            fieldsets.forEach((f) => this.fieldsetObserver!.observe(f, { attributes: true, attributeFilter: ['disabled'] }));
            update();
        }
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
        if (this.selectOnFocus() && this.autoOptionFocus() && !this.hasSelectedOption()) {
            this.focusedOptionIndex.set(this.findFirstFocusedOptionIndex());
            this.onOptionSelect(null, this.visibleOptions()[this.focusedOptionIndex()], false);
        }
    }

    onOptionSelect(event, option, isHide = true, preventChange = false) {
        // Check if option is disabled before proceeding
        if (this.isOptionDisabled(option)) {
            return;
        }

        if (!this.isSelected(option)) {
            const value = this.getOptionValue(option);
            this.updateModel(value, event);
            this.focusedOptionIndex.set(this.findSelectedOptionIndex());
            preventChange === false && this.onChange.emit({ originalEvent: event, value: value });
        }
        if (isHide) {
            this.hide(true);
        }
    }

    onOptionMouseEnter(event, index) {
        if (this.focusOnHover()) {
            this.changeFocusedOptionIndex(event, index, false);
        }
    }

    updateModel(value, event?) {
        this.value.set(value);
        this.onModelChange(value);
        this.writeModelValue(value);
        this.selectedOptionUpdated.set(true);
    }

    isSelected(option) {
        return this.isOptionValueEqualsModelValue(option);
    }

    private isOptionValueEqualsModelValue(option: any) {
        // Don't check isValidOption here since we need to match disabled options too
        return option !== undefined && option !== null && !this.isOptionGroup(option) && equals(this.modelValue(), this.getOptionValue(option), this.equalityKey());
    }

    updatePlaceHolderForFloatingLabel(): void {
        const parentElement = this.el.nativeElement.parentElement;
        const isInFloatingLabel = parentElement?.classList.contains('p-float-label');
        if (parentElement && isInFloatingLabel && !this.selectedOption()) {
            const label = parentElement.querySelector('label');
            if (label) {
                this._placeholder.set(label.textContent);
            }
        }
    }

    updateEditableLabel(): void {
        const editableInputViewChild = this.editableInputViewChild();
        if (editableInputViewChild) {
            editableInputViewChild.nativeElement.value = this.getOptionLabel(this.selectedOption()) || this.modelValue() || '';
        }
    }

    clearEditableLabel(): void {
        const editableInputViewChild = this.editableInputViewChild();
        if (editableInputViewChild) {
            editableInputViewChild.nativeElement.value = '';
        }
    }

    getOptionIndex(index, scrollerOptions) {
        return this.virtualScrollerDisabled() ? index : scrollerOptions && scrollerOptions.getItemOptions(index)['index'];
    }

    getOptionLabel(option: any) {
        return this.optionLabel() !== undefined && this.optionLabel() !== null ? resolveFieldData(option, this.optionLabel()) : option && option.label !== undefined ? option.label : option;
    }

    getOptionValue(option: any) {
        return this.optionValue() && this.optionValue() !== null ? resolveFieldData(option, this.optionValue()) : !this.optionLabel() && option && option.value !== undefined ? option.value : option;
    }

    getPTItemOptions(option: any, itemOptions: any, index: number, key: string) {
        return this.ptm(key, {
            context: {
                option,
                index,
                selected: this.isSelected(option),
                focused: this.focusedOptionIndex() === this.getOptionIndex(index, itemOptions),
                disabled: this.isOptionDisabled(option)
            }
        });
    }

    isSelectedOptionEmpty = computed(() => isEmpty(this.selectedOption()));

    isOptionDisabled(option: any) {
        return this.optionDisabled() ? resolveFieldData(option, this.optionDisabled()) : option && option.disabled !== undefined ? option.disabled : false;
    }

    getOptionGroupLabel(optionGroup: any) {
        return this.optionGroupLabel() !== undefined && this.optionGroupLabel() !== null ? resolveFieldData(optionGroup, this.optionGroupLabel()) : optionGroup && optionGroup.label !== undefined ? optionGroup.label : optionGroup;
    }

    getOptionGroupChildren(optionGroup: any) {
        return this.optionGroupChildren() !== undefined && this.optionGroupChildren() !== null ? resolveFieldData(optionGroup, this.optionGroupChildren()) : optionGroup.items;
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

    /**
     * Callback to invoke on filter reset.
     * @group Method
     */
    public resetFilter(): void {
        this._filterValue.set(null);

        const filterViewChild = this.filterViewChild();
        if (filterViewChild && filterViewChild.nativeElement) {
            filterViewChild.nativeElement.value = '';
        }
    }

    onContainerClick(event: any) {
        if (this.$disabled() || this.readonly() || this.loading()) {
            return;
        }

        const overlayViewChild = this.overlayViewChild();
        if (event.target.tagName === 'INPUT' || event.target.getAttribute('data-pc-section') === 'clearicon' || event.target.closest('[data-pc-section="clearicon"]')) {
            return;
        } else if (!overlayViewChild.el.nativeElement.contains(event.target)) {
            this.overlayVisible() ? this.hide(true) : this.show(true);
        }

        this.focusInputViewChild()?.nativeElement.focus({ preventScroll: true });
        this.onClick.emit(event);
        this.clicked.set(true);
    }

    isEmpty = computed(() => !this._options() || (this.visibleOptions() && this.visibleOptions().length === 0));

    onEditableInput(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.searchValue.set('');
        const matched = this.searchOptions(event, value);
        !matched && this.focusedOptionIndex.set(-1);

        this.onModelChange(value);
        this.updateModel(value || null, event);
        setTimeout(() => {
            this.onChange.emit({ originalEvent: event, value: value });
        }, 1);

        !this.overlayVisible() && isNotEmpty(value) && this.show();
    }
    /**
     * Displays the panel.
     * @group Method
     */
    public show(isFocus?) {
        this.overlayVisible.set(true);

        this.focusedOptionIndex.set(this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : this.editable() ? -1 : this.findSelectedOptionIndex());

        if (isFocus) {
            focus(this.focusInputViewChild()?.nativeElement);
        }
    }

    onOverlayBeforeEnter(event: any) {
        this.itemsWrapper.set(<any>findSingle(this.overlayViewChild().overlayViewChild()?.nativeElement, this.virtualScroll() ? '[data-pc-name="virtualscroller"]' : '[data-pc-section="listcontainer"]'));
        this.virtualScroll() && this.scroller()?.setContentEl(this.itemsViewChild()?.nativeElement);

        if (this._options()?.length) {
            if (this.virtualScroll()) {
                const selectedIndex = this.modelValue() ? this.focusedOptionIndex() : -1;
                if (selectedIndex !== -1) {
                    setTimeout(() => {
                        this.scroller()?.scrollToIndex(selectedIndex);
                    }, 10);
                }
            } else {
                let selectedListItem = findSingle(this.itemsWrapper() as HTMLElement, '[data-p-selected="true"]');
                if (selectedListItem) {
                    selectedListItem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                }
            }
        }

        const filterViewChild = this.filterViewChild();
        if (filterViewChild && filterViewChild.nativeElement) {
            this.preventModelTouched.set(true);

            if (this.autofocusFilter() && !this.editable()) {
                filterViewChild.nativeElement.focus();
            }
        }
        this.onShow.emit(event);
    }

    onOverlayAfterLeave(event: any) {
        this.itemsWrapper.set(null);
        this.onModelTouched();
        this.onHide.emit(event);
    }
    /**
     * Hides the panel.
     * @group Method
     */
    public hide(isFocus?) {
        this.overlayVisible.set(false);
        this.focusedOptionIndex.set(-1);
        this.clicked.set(false);
        this.searchValue.set('');

        // the overlay is also modal when a responsive breakpoint (input or global config) matches
        if (this.overlayOptions()?.mode === 'modal' || this.overlayViewChild()?.modal) {
            unblockBodyScroll();
        }
        if (this.filter() && this.resetFilterOnHide()) {
            this.resetFilter();
        }
        if (isFocus) {
            const focusInputViewChild = this.focusInputViewChild();
            if (focusInputViewChild) {
                focus(focusInputViewChild?.nativeElement);
            }
            const editableInputViewChild = this.editableInputViewChild();
            if (this.editable() && editableInputViewChild) {
                focus(editableInputViewChild?.nativeElement);
            }
        }
    }

    onInputFocus(event: Event) {
        if (this.$disabled()) {
            // For ScreenReaders
            return;
        }

        this.focused.set(true);
        const focusedOptionIndex = this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.overlayVisible() && this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : -1;
        this.focusedOptionIndex.set(focusedOptionIndex);
        this.overlayVisible() && this.scrollInView(this.focusedOptionIndex());

        this.onFocus.emit(event);
    }

    onInputBlur(event: Event) {
        this.focused.set(false);
        this.onBlur.emit(event);

        if (!this.preventModelTouched() && !this.overlayVisible()) {
            this.onModelTouched();
        }
        this.preventModelTouched.set(false);
    }

    onKeyDown(event: KeyboardEvent, search: boolean = false) {
        if (this.$disabled() || this.readonly() || this.loading()) {
            return;
        }

        switch (event.code) {
            //down
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            //up
            case 'ArrowUp':
                this.onArrowUpKey(event, this.editable());
                break;

            case 'ArrowLeft':
            case 'ArrowRight':
                this.onArrowLeftKey(event, this.editable());
                break;

            case 'Delete':
                this.onDeleteKey(event);
                break;

            case 'Home':
                this.onHomeKey(event, this.editable());
                break;

            case 'End':
                this.onEndKey(event, this.editable());
                break;

            case 'PageDown':
                this.onPageDownKey(event);
                break;

            case 'PageUp':
                this.onPageUpKey(event);
                break;

            //space
            case 'Space':
                this.onSpaceKey(event, search);
                break;

            //enter
            case 'Enter':
            case 'NumpadEnter':
                this.onEnterKey(event);
                break;

            //escape and tab
            case 'Escape':
                this.onEscapeKey(event);
                break;

            case 'Tab':
                this.onTabKey(event);
                break;

            case 'Backspace':
                this.onBackspaceKey(event, this.editable());
                break;

            case 'ShiftLeft':
            case 'ShiftRight':
                //NOOP
                break;

            default:
                if (!event.metaKey && isPrintableCharacter(event.key)) {
                    !this.overlayVisible() && this.show();
                    !this.editable() && this.searchOptions(event, event.key);
                }

                break;
        }

        this.clicked.set(false);
    }

    onFilterKeyDown(event) {
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
                this.onEnterKey(event, true);
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

    onFilterTemplateKeyDown(event: KeyboardEvent) {
        // a custom filter template has no keydown wiring of its own, so give its input the keyboard navigation of the built-in filter
        if ((this.filterTemplate() || this._filterTemplate()) && (event.target as HTMLElement)?.tagName === 'INPUT') {
            this.onFilterKeyDown(event);
        }
    }

    onFilterBlur(event) {
        this.focusedOptionIndex.set(-1);
    }

    onArrowDownKey(event: KeyboardEvent) {
        if (!this.overlayVisible()) {
            this.show();
            this.editable() && this.changeFocusedOptionIndex(event, this.findSelectedOptionIndex());
        } else {
            const optionIndex = this.focusedOptionIndex() !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex()) : this.clicked() ? this.findFirstOptionIndex() : this.findFirstFocusedOptionIndex();

            this.changeFocusedOptionIndex(event, optionIndex);
        }
        event.preventDefault();
        event.stopPropagation();
    }

    changeFocusedOptionIndex(event, index, scroll = true) {
        if (this.focusedOptionIndex() !== index) {
            this.focusedOptionIndex.set(index);
            scroll && this.scrollInView();

            if (this.selectOnFocus()) {
                const option = this.visibleOptions()[index];
                this.onOptionSelect(event, option, false);
            }
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

    hasSelectedOption = computed(() => this.modelValue() !== undefined);

    isValidSelectedOption(option) {
        return this.isValidOption(option) && this.isSelected(option);
    }

    equalityKey = computed(() => (this.optionValue() ? undefined : this.dataKey()));

    findFirstFocusedOptionIndex = computed(() => {
        const selectedIndex = this.findSelectedOptionIndex();
        return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    });

    findFirstOptionIndex = computed(() => this.visibleOptions().findIndex((option) => this.isValidOption(option)));

    findSelectedOptionIndex = computed(() => (this.hasSelectedOption() ? this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option)) : -1));

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

    findLastOptionIndex = computed(() => findLastIndex(this.visibleOptions(), (option) => this.isValidOption(option)));

    findLastFocusedOptionIndex = computed(() => {
        const selectedIndex = this.findSelectedOptionIndex();

        return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    });

    isValidOption(option) {
        return option !== undefined && option !== null && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
    }

    isOptionGroup(option) {
        return this.optionGroupLabel() !== undefined && this.optionGroupLabel() !== null && option.optionGroup !== undefined && option.optionGroup !== null && option.group;
    }

    onArrowUpKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        if (event.altKey && !pressedInInputText) {
            if (this.focusedOptionIndex() !== -1) {
                const option = this.visibleOptions()[this.focusedOptionIndex()];
                this.onOptionSelect(event, option);
            }

            this.overlayVisible() && this.hide();
        } else {
            const optionIndex = this.focusedOptionIndex() !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex()) : this.clicked() ? this.findLastOptionIndex() : this.findLastFocusedOptionIndex();

            this.changeFocusedOptionIndex(event, optionIndex);

            !this.overlayVisible() && this.show();
        }
        event.preventDefault();
        event.stopPropagation();
    }

    onArrowLeftKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        pressedInInputText && this.focusedOptionIndex.set(-1);
    }

    onDeleteKey(event: KeyboardEvent) {
        if (this.showClear()) {
            this.clear(event);
            event.preventDefault();
        }
    }

    onHomeKey(event: any, pressedInInputText: boolean = false) {
        if (pressedInInputText && event.currentTarget && event.currentTarget.setSelectionRange) {
            const target = event.currentTarget;
            if (event.shiftKey) {
                target.setSelectionRange(0, target.value.length);
            } else {
                target.setSelectionRange(0, 0);
                this.focusedOptionIndex.set(-1);
            }
        } else {
            this.changeFocusedOptionIndex(event, this.findFirstOptionIndex());

            !this.overlayVisible() && this.show();
        }

        event.preventDefault();
    }

    onEndKey(event: any, pressedInInputText = false) {
        if (pressedInInputText && event.currentTarget && event.currentTarget.setSelectionRange) {
            const target = event.currentTarget;

            if (event.shiftKey) {
                target.setSelectionRange(0, target.value.length);
            } else {
                const len = target.value.length;

                target.setSelectionRange(len, len);
                this.focusedOptionIndex.set(-1);
            }
        } else {
            this.changeFocusedOptionIndex(event, this.findLastOptionIndex());

            !this.overlayVisible() && this.show();
        }

        event.preventDefault();
    }

    onPageDownKey(event: KeyboardEvent) {
        this.scrollInView(this.visibleOptions().length - 1);
        event.preventDefault();
    }

    onPageUpKey(event: KeyboardEvent) {
        this.scrollInView(0);
        event.preventDefault();
    }

    onSpaceKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        !this.editable() && !pressedInInputText && this.onEnterKey(event);
    }

    onEnterKey(event, pressedInInput = false) {
        if (!this.overlayVisible()) {
            this.focusedOptionIndex.set(-1);
            this.onArrowDownKey(event);
        } else {
            if (this.focusedOptionIndex() !== -1) {
                const option = this.visibleOptions()[this.focusedOptionIndex()];
                this.onOptionSelect(event, option);
            }

            !pressedInInput && this.hide();
        }

        event.preventDefault();
    }

    onEscapeKey(event: KeyboardEvent) {
        if (this.overlayVisible()) {
            this.hide(true);
            event.preventDefault();
            event.stopPropagation();
        }
    }

    onTabKey(event, pressedInInputText = false) {
        if (!pressedInInputText) {
            if (this.overlayVisible() && this.hasFocusableElements()) {
                focus(event.shiftKey ? this.lastHiddenFocusableElementOnOverlay()?.nativeElement : this.firstHiddenFocusableElementOnOverlay()?.nativeElement);
                event.preventDefault();
                event.stopPropagation();
            } else {
                if (this.focusedOptionIndex() !== -1 && this.overlayVisible()) {
                    const option = this.visibleOptions()[this.focusedOptionIndex()];
                    this.onOptionSelect(event, option);
                }
                this.overlayVisible() && this.hide(this.filter());
            }
        }
    }

    onFirstHiddenFocus(event) {
        const focusInputViewChild = this.focusInputViewChild();
        const focusableEl = event.relatedTarget === focusInputViewChild?.nativeElement ? getFirstFocusableElement(this.overlayViewChild().el?.nativeElement, ':not([data-p-hidden-focusable="true"])') : focusInputViewChild?.nativeElement;
        focus(focusableEl);
    }

    onLastHiddenFocus(event) {
        const focusInputViewChild = this.focusInputViewChild();
        const focusableEl =
            event.relatedTarget === focusInputViewChild?.nativeElement ? getLastFocusableElement(this.overlayViewChild().overlayViewChild()?.nativeElement, ':not([data-p-hidden-focusable="true"])') : focusInputViewChild?.nativeElement;

        focus(focusableEl);
    }

    hasFocusableElements() {
        return getFocusableElements(this.overlayViewChild().overlayViewChild()?.nativeElement, ':not([data-p-hidden-focusable="true"])').length > 0;
    }

    onBackspaceKey(event: KeyboardEvent, pressedInInputText = false) {
        if (pressedInInputText) {
            !this.overlayVisible() && this.show();
        }
    }

    searchFields = computed(() => this.filterBy()?.split(',') || this.filterFields() || [this.optionLabel()]);

    searchOptions(event, char) {
        this.searchValue.set((this.searchValue() || '') + char);

        let optionIndex = -1;
        let matched = false;

        optionIndex = this.visibleOptions().findIndex((option) => this.isOptionMatched(option));

        if (optionIndex !== -1) {
            matched = true;
        }

        // an editable Select keeps unmatched text as its value, so it must not fall back to an option
        if (optionIndex === -1 && this.focusedOptionIndex() === -1 && !this.editable()) {
            optionIndex = this.findFirstFocusedOptionIndex();
        }

        if (optionIndex !== -1) {
            setTimeout(() => {
                this.changeFocusedOptionIndex(event, optionIndex);
            });
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
        return this.isValidOption(option) && this.getOptionLabel(option).toString().toLocaleLowerCase(this.filterLocale()).startsWith(this.searchValue()?.toLocaleLowerCase(this.filterLocale()));
    }

    onFilterInputChange(event: Event | any): void {
        let value: string = (event.target as HTMLInputElement).value;
        this._filterValue.set(value);
        this.focusedOptionIndex.set(-1);
        this.onFilter.emit({ originalEvent: event, filter: this._filterValue() });
        !this.virtualScrollerDisabled() && this.scroller()?.scrollToIndex(0);
        setTimeout(() => {
            this.overlayViewChild().alignOverlay();
        });
    }

    applyFocus(): void {
        if (this.editable()) (findSingle(this.el.nativeElement, '[data-pc-section="label"]') as any).focus();
        else focus(this.focusInputViewChild()?.nativeElement);
    }
    /**
     * Applies focus.
     * @group Method
     */
    public focus(): void {
        this.applyFocus();
    }
    onClearIconKeyDown(event: KeyboardEvent) {
        if (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Space') {
            event.preventDefault();
            this.clear(event);
            this.applyFocus();
        }
    }
    /**
     * Clears the model.
     * @group Method
     */
    public clear(event?: Event) {
        this.updateModel(null, event);
        this.clearEditableLabel();
        this.onModelTouched();
        this.onChange.emit({ originalEvent: event, value: this.value() });
        this.onClear.emit(event);
        this.resetFilter();
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        if (this.filter()) {
            this.resetFilter();
        }

        this.value.set(value);
        setModelValue(this.value());
        this.updateEditableLabel();
    }

    containerDataP = computed(() =>
        this.cn({
            invalid: this.invalid(),
            disabled: this.$disabled(),
            focus: this.focused(),
            fluid: this.hasFluid,
            filled: this.$variant() === 'filled',
            [this.size() as string]: this.size()
        })
    );

    labelDataP = computed(() =>
        this.cn({
            placeholder: this._placeholder() && this.label() === this._placeholder(),
            clearable: this.showClear(),
            disabled: this.$disabled(),
            [this.size() as string]: this.size(),
            empty: !this.editable() && !this.selectedItemTemplate() && (!this.label?.() || this.label() === 'p-emptylabel' || this.label()?.length === 0)
        })
    );

    overlayDataP = computed(() =>
        this.cn({
            ['overlay-' + this.$appendTo()]: 'overlay-' + this.$appendTo()
        })
    );
}

@NgModule({
    imports: [Select, SharedModule],
    exports: [Select, SharedModule]
})
export class SelectModule {}
