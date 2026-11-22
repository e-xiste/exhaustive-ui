import { CommonModule } from '@angular/common';
import {
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    forwardRef,
    HostListener,
    inject,
    InjectionToken,
    input,
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
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MotionOptions } from '@exhaustive-ui/motion';
import { equals, findLastIndex, findSingle, focus, getHiddenElementOuterWidth, getOffset, getOuterWidth, getViewport, isEmpty, isNotEmpty, isPrintableCharacter, resolveFieldData, uuid } from '@exhaustive-ui/utils';
import { OverlayOptions, OverlayService, PrimeTemplate, SharedModule, TranslationKeys } from '@exhaustive-ui/core/api';
import { AutoFocus } from '@exhaustive-ui/core/autofocus';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseEditableHolder } from '@exhaustive-ui/core/baseeditableholder';
import { Bind } from '@exhaustive-ui/core/bind';
import { Fluid } from '@exhaustive-ui/core/fluid';
import { AngleRightIcon, ChevronDownIcon, SpinnerIcon, TimesIcon } from '@exhaustive-ui/core/icons';
import { Overlay } from '@exhaustive-ui/core/overlay';
import { Ripple } from '@exhaustive-ui/core/ripple';
import { Nullable, VoidListener } from '@exhaustive-ui/core/ts-helpers';
import {
    CascadeSelectBeforeHideEvent,
    CascadeSelectBeforeShowEvent,
    CascadeSelectChangeEvent,
    CascadeSelectHideEvent,
    CascadeSelectOptionTemplateContext,
    CascadeSelectPassThrough,
    CascadeSelectShowEvent,
    CascadeSelectValueTemplateContext
} from '@exhaustive-ui/core/types/cascadeselect';
import { CascadeSelectStyle } from './style/cascadeselectstyle';

const CASCADESELECT_INSTANCE = new InjectionToken<CascadeSelect>('CASCADESELECT_INSTANCE');

export const CASCADESELECT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CascadeSelect),
    multi: true
};

/**
 * @internal Rendering detail of CascadeSelect, not part of the public API: it may change or stop being exported in a minor version.
 */
@Component({
    selector: 'ul[pCascadeSelectSub]',
    imports: [CommonModule, Ripple, AngleRightIcon, SharedModule, Bind],
    template: `
        @for (processedOption of options(); track processedOption; let i = $index) {
            <li
                [class]="cx('option', { processedOption })"
                role="treeitem"
                [attr.aria-level]="level() + 1"
                [attr.aria-setsize]="options().length"
                [pBind]="getPTOptions(processedOption, i, 'option')"
                [id]="getOptionId(processedOption)"
                [attr.aria-label]="getOptionLabelToRender(processedOption)"
                [attr.aria-selected]="isOptionGroup(processedOption) ? undefined : isOptionSelected(processedOption)"
                [attr.aria-posinset]="i + 1"
            >
                <div
                    [class]="cx('optionContent')"
                    (click)="onOptionClick($event, processedOption)"
                    (mouseenter)="onOptionMouseEnter($event, processedOption)"
                    (mousemove)="onOptionMouseMove($event, processedOption)"
                    pRipple
                    [pBind]="getPTOptions(processedOption, i, 'optionContent')"
                >
                    @if (optionTemplate()) {
                        <ng-container *ngTemplateOutlet="optionTemplate(); context: { $implicit: processedOption?.option, level: level() }"></ng-container>
                    } @else {
                        <span [class]="cx('optionText')" [pBind]="getPTOptions(processedOption, i, 'optionText')">{{ getOptionLabelToRender(processedOption) }}</span>
                    }
                    @if (isOptionGroup(processedOption)) {
                        <span [class]="cx('groupIcon')" [pBind]="getPTOptions(processedOption, i, 'groupIcon')">
                            @if (!groupicon()) {
                                <svg data-p-icon="angle-right" [pBind]="getPTOptions(processedOption, i, 'groupIcon')" />
                            }
                            <ng-template *ngTemplateOutlet="groupicon()"></ng-template>
                        </span>
                    }
                </div>
                @if (isOptionGroup(processedOption) && isOptionActive(processedOption)) {
                    <ul
                        pCascadeSelectSub
                        [attr.role]="'group'"
                        [class]="cx('optionList')"
                        [selectId]="selectId()"
                        [focusedOptionId]="focusedOptionId()"
                        [activeOptionPath]="activeOptionPath()"
                        [options]="getOptionGroupChildren(processedOption)"
                        [optionLabel]="optionLabel()"
                        [level]="level() + 1"
                        (onChange)="onChange.emit($event)"
                        (onFocusChange)="onFocusChange.emit($event)"
                        (onFocusEnterChange)="onFocusEnterChange.emit($event)"
                        [optionGroupLabel]="optionGroupLabel()"
                        [optionDisabled]="optionDisabled()"
                        [optionTemplate]="optionTemplate()"
                        [groupicon]="groupicon()"
                        [pBind]="ptm('optionList')"
                        [pt]="pt()"
                        [unstyled]="unstyled()"
                    ></ul>
                }
            </li>
        }
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CascadeSelectStyle, { provide: PARENT_INSTANCE, useExisting: CascadeSelectSub }]
})
export class CascadeSelectSub extends BaseComponent {
    hostName = 'CascadeSelect';

    cascadeselect = inject(CascadeSelect);

    selectId = input<string | undefined>();

    activeOptionPath = input.required<any[]>();

    optionDisabled = input<any[]>();

    focusedOptionId = input<string | undefined>();

    options = input<any[] | string[] | string | undefined | null>();

    optionTemplate = input<Nullable<TemplateRef<any>>>();

    groupicon = input<Nullable<TemplateRef<any>>>();

    level = input<number, unknown>(0, { transform: numberAttribute });

    optionLabel = input<string | undefined>();

    optionGroupLabel = input<string | undefined>();

    root = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly onChange = output<any>();

    readonly onFocusChange = output<any>();

    readonly onFocusEnterChange = output<any>();

    _componentStyle = inject(CascadeSelectStyle);

    getPTOptions(processedOption: any, index: number, key: string) {
        return this.ptm(key, {
            context: {
                option: processedOption,
                index,
                level: this.level(),
                optionGroup: this.isOptionGroup(processedOption),
                active: this.isOptionActive(processedOption),
                focused: this.isOptionFocused(processedOption),
                disabled: this.isOptionDisabled(processedOption)
            }
        });
    }

    constructor() {
        super();
        // the sublist is measured once it is rendered, next to its parent option
        afterNextRender(() => {
            if (!this.root()) {
                this.position();
            }
        });
    }

    onOptionClick(event, processedOption: any) {
        this.onChange.emit({
            originalEvent: event,
            processedOption,
            isFocus: true
        });
    }

    onOptionMouseEnter(event, processedOption) {
        this.onFocusEnterChange.emit({ originalEvent: event, processedOption });
    }

    onOptionMouseMove(event, processedOption) {
        this.onFocusChange.emit({ originalEvent: event, processedOption });
    }

    getOptionId(processedOption) {
        return `${this.selectId()}_${processedOption.key}`;
    }

    getOptionLabel(processedOption) {
        return this.optionLabel() ? resolveFieldData(processedOption.option, this.optionLabel()) : processedOption.option;
    }

    getOptionLabelToRender(processedOption) {
        return this.isOptionGroup(processedOption) ? this.getOptionGroupLabel(processedOption) : this.getOptionLabel(processedOption);
    }

    isOptionDisabled(processedOption) {
        return this.optionDisabled() ? resolveFieldData(processedOption.option, this.optionDisabled()) : false;
    }

    getOptionGroupLabel(processedOption) {
        return this.optionGroupLabel() ? resolveFieldData(processedOption.option, this.optionGroupLabel()) : null;
    }

    getOptionGroupChildren(processedOption) {
        return processedOption.children;
    }

    isOptionGroup(processedOption) {
        return isNotEmpty(processedOption.children);
    }

    isOptionSelected(processedOption) {
        return equals(this.cascadeselect?.modelValue(), processedOption?.option);
    }

    isOptionActive(processedOption) {
        return this.activeOptionPath().some((path) => path.key === processedOption.key);
    }

    isOptionFocused(processedOption) {
        return this.focusedOptionId() === this.getOptionId(processedOption);
    }

    position() {
        // the host is the sublist itself, opened next to the option (li) that holds it
        const sublist = this.el.nativeElement as HTMLElement;
        const parentItem = sublist.parentElement;
        if (!parentItem) {
            return;
        }

        const containerOffset = <any>getOffset(parentItem);
        const viewport = <any>getViewport();
        const sublistWidth = sublist.offsetParent ? sublist.offsetWidth : getHiddenElementOuterWidth(sublist);
        const itemOuterWidth = <any>getOuterWidth(parentItem.children[0]);
        if (parseInt(containerOffset.left, 10) + itemOuterWidth + sublistWidth > viewport.width) {
            // not enough room on the right: open the sublist on the left of its option
            sublist.style.left = 'auto';
            sublist.style.right = '100%';
        }
    }
}
/**
 * CascadeSelect is a form component to select a value from a nested structure of options.
 * @group Components
 */
@Component({
    selector: 'p-cascadeSelect, p-cascadeselect, p-cascade-select',
    imports: [CommonModule, Overlay, AutoFocus, CascadeSelectSub, ChevronDownIcon, SpinnerIcon, TimesIcon, SharedModule, Bind],
    template: `
        <div class="p-hidden-accessible" [pBind]="ptm('hiddenInputWrapper')">
            <input
                #focusInput
                readonly
                type="text"
                role="combobox"
                [attr.name]="name()"
                [attr.required]="required() ? '' : undefined"
                [attr.disabled]="$disabled() ? '' : undefined"
                [attr.placeholder]="placeholder()"
                [attr.tabindex]="!$disabled() ? tabindex() : -1"
                [attr.id]="inputId()"
                [attr.aria-label]="ariaLabel()"
                [attr.aria-labelledby]="ariaLabelledBy()"
                [attr.aria-haspopup]="'tree'"
                [attr.aria-expanded]="overlayVisible() ?? false"
                [attr.aria-controls]="overlayVisible() ? _id() + '_tree' : null"
                [attr.aria-activedescendant]="focused() ? focusedOptionId() : undefined"
                (focus)="onInputFocus($event)"
                (blur)="onInputBlur($event)"
                (keydown)="onInputKeyDown($event)"
                [pAutoFocus]="autofocus()"
                [pBind]="ptm('hiddenInput')"
            />
        </div>
        <span [class]="cx('label')" [pBind]="ptm('label')">
            @if (valueTemplate() || _valueTemplate()) {
                <ng-container *ngTemplateOutlet="valueTemplate() || _valueTemplate(); context: { $implicit: value(), placeholder: placeholder() }"></ng-container>
            } @else {
                {{ label() }}
            }
        </span>

        @if ($filled() && !$disabled() && showClear()) {
            @if (!clearIconTemplate() && !_clearIconTemplate()) {
                <svg data-p-icon="times" [class]="cx('clearIcon')" (click)="clear($event)" [pBind]="ptm('clearIcon')" [attr.aria-hidden]="true" />
            }
            @if (clearIconTemplate() || _clearIconTemplate()) {
                <span [class]="cx('clearIcon')" (click)="clear($event)" [pBind]="ptm('clearIcon')" [attr.aria-hidden]="true">
                    <ng-template *ngTemplateOutlet="clearIconTemplate() || _clearIconTemplate()"></ng-template>
                </span>
            }
        }

        <div [class]="cx('dropdown')" role="button" aria-haspopup="listbox" [attr.aria-expanded]="overlayVisible() ?? false" [pBind]="ptm('dropdown')" [attr.aria-hidden]="true">
            @if (loading()) {
                @if (loadingIconTemplate() || _loadingIconTemplate()) {
                    <ng-container *ngTemplateOutlet="loadingIconTemplate() || _loadingIconTemplate()"></ng-container>
                }
                @if (!loadingIconTemplate() && !_loadingIconTemplate()) {
                    @if (loadingIcon()) {
                        <span [class]="cn(cx('loadingIcon'), loadingIcon() + ' pi-spin')" aria-hidden="true" [pBind]="ptm('loadingIcon')"></span>
                    }
                    @if (!loadingIcon()) {
                        <svg data-p-icon="spinner" [class]="cx('loadingIcon')" [spin]="true" aria-hidden="true" [pBind]="ptm('loadingIcon')" />
                    }
                }
            } @else {
                @if (!triggerIconTemplate() && !_triggerIconTemplate()) {
                    <svg data-p-icon="chevron-down" [class]="cx('dropdownIcon')" [pBind]="ptm('dropdownIcon')" />
                }
                @if (triggerIconTemplate() || _triggerIconTemplate()) {
                    <span [class]="cx('dropdownIcon')" [pBind]="ptm('dropdownIcon')">
                        <ng-template *ngTemplateOutlet="triggerIconTemplate() || _triggerIconTemplate()"></ng-template>
                    </span>
                }
            }
        </div>
        <span role="status" aria-live="polite" class="p-hidden-accessible" [pBind]="ptm('hiddenSearchResult')">
            {{ searchResultMessageText() }}
        </span>
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
            (onAfterLeave)="onOverlayAfterLeave()"
            (onBeforeShow)="onBeforeShow.emit($event)"
            (onShow)="show($event)"
            (onBeforeHide)="onBeforeHide.emit($event)"
            (onHide)="hide($event)"
        >
            <ng-template #content>
                <div #panel [class]="cn(cx('overlay'), panelStyleClass())" [ngStyle]="panelStyle()" [pBind]="ptm('overlay')">
                    <ng-template *ngTemplateOutlet="headerTemplate() || _headerTemplate()"></ng-template>
                    <div [class]="cx('listContainer')" [pBind]="ptm('listContainer')">
                        <ul
                            pCascadeSelectSub
                            [class]="cx('list')"
                            [options]="processedOptions()"
                            [selectId]="_id()"
                            [focusedOptionId]="focused() ? focusedOptionId() : undefined"
                            [activeOptionPath]="activeOptionPath()"
                            [optionLabel]="optionLabel()"
                            [level]="0"
                            [optionTemplate]="optionTemplate() || _optionTemplate()"
                            [groupicon]="groupIconTemplate() || _groupIconTemplate()"
                            [optionGroupLabel]="optionGroupLabel()"
                            [optionDisabled]="optionDisabled()"
                            [root]="true"
                            (onChange)="onOptionClick($event)"
                            (onFocusChange)="onOptionMouseMove($event)"
                            (onFocusEnterChange)="onOptionMouseEnter($event)"
                            [attr.role]="'tree'"
                            [attr.aria-orientation]="'horizontal'"
                            [pBind]="ptm('list')"
                            [attr.aria-label]="listLabel()"
                            [pt]="pt()"
                            [unstyled]="unstyled()"
                        ></ul>
                    </div>
                    <span role="status" aria-live="polite" class="p-hidden-accessible" [pBind]="ptm('selectedMessageText')">
                        {{ selectedMessageText() }}
                    </span>
                    <ng-template *ngTemplateOutlet="footerTemplate() || _footerTemplate()"></ng-template>
                </div>
            </ng-template>
        </p-overlay>
    `,
    providers: [CASCADESELECT_VALUE_ACCESSOR, CascadeSelectStyle, { provide: PARENT_INSTANCE, useExisting: CascadeSelect }, { provide: CASCADESELECT_INSTANCE, useExisting: CascadeSelect }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[style]': "sx('root')"
    },
    hostDirectives: [Bind]
})
export class CascadeSelect extends BaseEditableHolder<CascadeSelectPassThrough> {
    overlayService = inject(OverlayService);

    componentName = 'CascadeSelect';

    $pcCascadeSelect: CascadeSelect | undefined = inject(CASCADESELECT_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Unique identifier of the component
     * @group Props
     */
    id = input<string | undefined>();
    /**
     * Text to display when the search is active. Defaults to global value in i18n translation configuration.
     * @group Props
     * @defaultValue '{0} results are available'
     */
    searchMessage = input<string | undefined>();
    /**
     * Text to be displayed in hidden accessible field when options are selected. Defaults to global value in i18n translation configuration.
     * @group Props
     * @defaultValue '{0} items selected'
     */
    selectionMessage = input<string | undefined>();
    /**
     * Text to display when filtering does not return any results. Defaults to value from Exhaustive locale configuration.
     * @group Props
     * @defaultValue 'No available options'
     */
    emptySearchMessage = input<string | undefined>();
    /**
     * Text to display when filtering does not return any results. Defaults to global value in i18n translation configuration.
     * @group Props
     * @defaultValue 'No selected item'
     */
    emptySelectionMessage = input<string | undefined>();
    /**
     * Locale to use in searching. The default locale is the host environment's current locale.
     * @group Props
     */
    searchLocale = input<string | undefined>();
    /**
     * Name of the disabled field of an option.
     * @group Props
     */
    optionDisabled = input<any>();
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
     * An array of selectitems to display as the available options.
     * @group Props
     */
    options = input<any[] | null | undefined>();
    /**
     * Property name or getter function to use as the label of an option.
     * @group Props
     */
    optionLabel = input<string | undefined>();
    /**
     * Property name or getter function to use as the value of an option, defaults to the option itself when not defined.
     * @group Props
     */
    optionValue = input<string | undefined>();
    /**
     * Property name or getter function to use as the label of an option group.
     * @group Props
     */
    optionGroupLabel = input<string | undefined>();
    /**
     * Property name or getter function to retrieve the items of a group.
     * @group Props
     */
    optionGroupChildren = input<string[] | string | undefined | null>();
    /**
     * Default text to display when no option is selected.
     * @group Props
     */
    placeholder = input<string | undefined>();
    /**
     * Selected value of the component.
     * @group Props
     */
    value = model<any>();
    /**
     * A property to uniquely identify an option.
     * @group Props
     */
    dataKey = input<string | undefined>();
    /**
     * Identifier of the underlying input element.
     * @group Props
     */
    inputId = input<string | undefined>();
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input<number | undefined, unknown>(0, { transform: numberAttribute });
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>();
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    ariaLabel = input<string | undefined>();
    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    showClear = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Style class of the overlay panel.
     * @group Props
     */
    panelStyleClass = input<string | undefined>();
    /**
     * Inline style of the overlay panel.
     * @group Props
     */
    panelStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Whether to use overlay API feature. The properties of overlay API can be used like an object in it.
     * @group Props
     */
    overlayOptions = input<OverlayOptions | undefined>();
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether the dropdown is in loading state.
     * @group Props
     */
    loading = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * Icon to display in loading state.
     * @group Props
     */
    loadingIcon = input<string | undefined>();
    /**
     * The breakpoint to define the maximum width boundary.
     * @group Props
     */
    breakpoint = input<string>('960px');
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
     * Callback to invoke on value change.
     * @param {CascadeSelectChangeEvent} event - Custom change event.
     * @group Emits
     */
    readonly onChange = output<CascadeSelectChangeEvent>();
    /**
     * Callback to invoke when a group changes.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onGroupChange = output<Event>();
    /**
     * Callback to invoke when the overlay is shown.
     * @param {CascadeSelectShowEvent} event - Custom overlay show event.
     * @group Emits
     */
    readonly onShow = output<CascadeSelectShowEvent>();
    /**
     * Callback to invoke when the overlay is hidden.
     * @param {CascadeSelectHideEvent} event - Custom overlay hide event.
     * @group Emits
     */
    readonly onHide = output<CascadeSelectHideEvent>();
    /**
     * Callback to invoke when the clear token is clicked.
     * @group Emits
     */
    readonly onClear = output<any>();
    /**
     * Callback to invoke before overlay is shown.
     * @param {CascadeSelectBeforeShowEvent} event - Custom overlay show event.
     * @group Emits
     */
    readonly onBeforeShow = output<CascadeSelectBeforeShowEvent>();
    /**
     * Callback to invoke before overlay is hidden.
     * @param {CascadeSelectBeforeHideEvent} event - Custom overlay hide event.
     * @group Emits
     */
    readonly onBeforeHide = output<CascadeSelectBeforeHideEvent>();
    /**
     * Callback to invoke when input receives focus.
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    readonly onFocus = output<FocusEvent>();
    /**
     * Callback to invoke when input loses focus.
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    readonly onBlur = output<FocusEvent>();

    readonly focusInputViewChild = viewChild.required<ElementRef>('focusInput');

    readonly panelViewChild = viewChild<Nullable<ElementRef>>('panel');

    readonly overlayViewChild = viewChild<Nullable<Overlay>>('overlay');
    /**
     * Custom value template.
     * @group Templates
     */
    readonly valueTemplate = contentChild<Nullable<TemplateRef<CascadeSelectValueTemplateContext>>>('value', { descendants: false });

    /**
     * Custom option template.
     * @group Templates
     */
    readonly optionTemplate = contentChild<Nullable<TemplateRef<CascadeSelectOptionTemplateContext>>>('option', { descendants: false });

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<Nullable<TemplateRef<void>>>('header', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    readonly footerTemplate = contentChild<Nullable<TemplateRef<void>>>('footer', { descendants: false });

    /**
     * Custom trigger icon template.
     * @group Templates
     */
    readonly triggerIconTemplate = contentChild<Nullable<TemplateRef<void>>>('triggericon', { descendants: false });

    /**
     * Custom loading icon template.
     * @group Templates
     */
    readonly loadingIconTemplate = contentChild<Nullable<TemplateRef<void>>>('loadingicon', { descendants: false });

    /**
     * Custom option group icon template.
     * @group Templates
     */
    readonly groupIconTemplate = contentChild<Nullable<TemplateRef<void>>>('optiongroupicon', { descendants: false });

    /**
     * Custom clear icon template.
     * @group Templates
     */
    readonly clearIconTemplate = contentChild<Nullable<TemplateRef<void>>>('clearicon', { descendants: false });

    _valueTemplate = computed<TemplateRef<CascadeSelectValueTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'value')
                .at(-1)?.template
    );

    _optionTemplate = computed<TemplateRef<CascadeSelectOptionTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'option')
                .at(-1)?.template
    );

    _headerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    _footerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    _triggerIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'triggericon')
                .at(-1)?.template
    );

    _loadingIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'loadingicon')
                .at(-1)?.template
    );

    _groupIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'optiongroupicon')
                .at(-1)?.template
    );

    _clearIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'clearicon')
                .at(-1)?.template
    );

    focused = signal<boolean>(false);

    overlayVisible = signal<boolean>(false);

    clicked = signal<boolean>(false);

    dirty = signal<boolean>(false);

    searchValue = signal<string | undefined>(undefined);

    searchTimeout = signal<any>(undefined);

    focusedOptionInfo = signal<any>({ index: -1, level: 0, parentKey: '' });

    activeOptionPath = signal<any>([]);

    processedOptions = computed<string[] | string | undefined>(() => this.createProcessedOptions(this.options() || []));

    _componentStyle = inject(CascadeSelectStyle);

    initialized = signal<boolean>(false);

    destroyRef = inject(DestroyRef);

    $variant = computed(() => this.variant() || this.config.inputVariant());

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    hasFluid = computed(() => this.fluid() ?? !!this.pcFluid);

    @HostListener('mousedown', ['$event'])
    onHostClick(event: MouseEvent) {
        this.onContainerClick(event);
    }

    translation = toSignal(this.config.translationObserver, { initialValue: this.config.translation });

    listLabel = computed<string>(() => this.translation()[TranslationKeys.ARIA]['listLabel']);

    _id = computed(() => this.id() || uuid('pn_id_'));

    focusedOptionId = computed(() => {
        const focusedOptionInfo = this.focusedOptionInfo();

        return focusedOptionInfo.index !== -1 ? `${this._id()}${isNotEmpty(focusedOptionInfo.parentKey) ? '_' + focusedOptionInfo.parentKey : ''}_${focusedOptionInfo.index}` : null;
    });

    searchResultMessageText = computed(() => (isNotEmpty(this.visibleOptions()) ? this.searchMessageText().replaceAll('{0}', this.visibleOptions().length) : this.emptySearchMessageText()));

    searchMessageText = computed(() => this.searchMessage() || this.translation().searchMessage || '');

    emptySearchMessageText = computed(() => this.emptySearchMessage() || this.translation().emptySearchMessage || '');

    selectionMessageText = computed(() => this.selectionMessage() || this.translation().selectionMessage || '');

    emptySelectionMessageText = computed(() => this.emptySelectionMessage() || this.translation().emptySelectionMessage || '');

    selectedMessageText = computed(() => (this.hasSelectedOption() ? this.selectionMessageText().replaceAll('{0}', '1') : this.emptySelectionMessageText()));

    visibleOptions = computed(() => {
        const processedOption = this.activeOptionPath().find((p) => p.key === this.focusedOptionInfo().parentKey);

        return processedOption ? processedOption.children : this.processedOptions();
    });

    label = computed(() => {
        const label = this.placeholder() || 'p-emptylabel';

        if (this.hasSelectedOption()) {
            const activeOptionPath = this.findOptionPathByValue(this.modelValue(), null);
            const processedOption = isNotEmpty(activeOptionPath) ? activeOptionPath[activeOptionPath.length - 1] : null;

            return processedOption ? this.getOptionLabel(processedOption.option) : label;
        }
        return label;
    });

    readonly templates = contentChildren(PrimeTemplate);

    hasSelectedOption = computed(() => isNotEmpty(this.modelValue()));

    createProcessedOptions(options, level = 0, parent = {}, parentKey = '') {
        const processedOptions: any[] = [];

        options &&
            options.forEach((option, index) => {
                const key = (parentKey !== '' ? parentKey + '_' : '') + index;
                const newOption = {
                    option,
                    index,
                    level,
                    key,
                    parent,
                    parentKey
                };

                newOption['children'] = this.createProcessedOptions(this.getOptionGroupChildren(option, level), level + 1, newOption, key);
                processedOptions.push(newOption);
            });

        return processedOptions;
    }

    onInputFocus(event: FocusEvent) {
        if (this.$disabled()) {
            // For screenreaders
            return;
        }

        this.focused.set(true);
        this.onFocus.emit(event);
    }

    onInputBlur(event: FocusEvent) {
        this.focused.set(false);
        this.focusedOptionInfo.set({ index: -1, level: 0, parentKey: '' });
        this.searchValue.set('');
        this.onModelTouched();
        this.onBlur.emit(event);
    }

    onInputKeyDown(event: KeyboardEvent) {
        if (this.$disabled() || this.loading()) {
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

            case 'ArrowLeft':
                this.onArrowLeftKey(event);
                break;

            case 'ArrowRight':
                this.onArrowRightKey(event);
                break;

            case 'Home':
                this.onHomeKey(event);
                break;

            case 'End':
                this.onEndKey(event);
                break;

            case 'Space':
                this.onSpaceKey(event);
                break;

            case 'Enter':
            case 'NumpadEnter':
                this.onEnterKey(event);
                break;

            case 'Escape':
                this.onEscapeKey(event);
                break;

            case 'Tab':
                this.onTabKey(event);
                break;

            case 'Backspace':
                this.onBackspaceKey(event);
                break;

            case 'PageDown':
            case 'PageUp':
            case 'ShiftLeft':
            case 'ShiftRight':
                //NOOP
                break;

            default:
                if (!metaKey && isPrintableCharacter(event.key)) {
                    !this.overlayVisible() && this.show();
                    this.searchOptions(event, event.key);
                }

                break;
        }

        this.clicked.set(false);
    }

    onArrowDownKey(event) {
        if (!this.overlayVisible()) {
            this.show();
        } else {
            const optionIndex = this.focusedOptionInfo().index !== -1 ? this.findNextOptionIndex(this.focusedOptionInfo().index) : this.clicked() ? this.findFirstOptionIndex() : this.findFirstFocusedOptionIndex();

            this.changeFocusedOptionIndex(event, optionIndex, true);
        }

        event.preventDefault();
    }

    onArrowUpKey(event) {
        if (event.altKey) {
            if (this.focusedOptionInfo().index !== -1) {
                const processedOption = this.visibleOptions()[this.focusedOptionInfo().index];
                const grouped = this.isProccessedOptionGroup(processedOption);

                !grouped && this.onOptionChange({ originalEvent: event, processedOption });
            }

            this.overlayVisible() && this.hide();
            event.preventDefault();
        } else {
            const optionIndex = this.focusedOptionInfo().index !== -1 ? this.findPrevOptionIndex(this.focusedOptionInfo().index) : this.clicked() ? this.findLastOptionIndex() : this.findLastFocusedOptionIndex();

            this.changeFocusedOptionIndex(event, optionIndex, true);

            !this.overlayVisible() && this.show();
            event.preventDefault();
        }
    }

    onArrowLeftKey(event) {
        if (this.overlayVisible()) {
            const processedOption = this.visibleOptions()[this.focusedOptionInfo().index];
            const parentOption = this.activeOptionPath().find((p) => p.key === processedOption.parentKey);
            const matched = this.focusedOptionInfo().parentKey === '' || (parentOption && parentOption.key === this.focusedOptionInfo().parentKey);
            const root = isEmpty(processedOption.parent);

            if (matched) {
                const activeOptionPath = this.activeOptionPath().filter((p) => p.parentKey !== this.focusedOptionInfo().parentKey);
                this.activeOptionPath.set(activeOptionPath);
            }

            if (!root) {
                this.focusedOptionInfo.set({ index: -1, parentKey: parentOption ? parentOption.parentKey : '' });
                this.searchValue.set('');
                this.onArrowDownKey(event);
            }

            event.preventDefault();
        }
    }

    onArrowRightKey(event) {
        if (this.overlayVisible()) {
            const processedOption = this.visibleOptions()[this.focusedOptionInfo().index];
            const grouped = this.isProccessedOptionGroup(processedOption);

            if (grouped) {
                const matched = this.activeOptionPath().some((p) => processedOption.key === p.key);

                if (matched) {
                    this.focusedOptionInfo.set({ index: -1, parentKey: processedOption.key });
                    this.searchValue.set('');
                    this.onArrowDownKey(event);
                } else {
                    this.onOptionChange({ originalEvent: event, processedOption });
                }
            }

            event.preventDefault();
        }
    }

    onHomeKey(event) {
        this.changeFocusedOptionIndex(event, this.findFirstOptionIndex());

        !this.overlayVisible() && this.show();
        event.preventDefault();
    }

    onEndKey(event) {
        this.changeFocusedOptionIndex(event, this.findLastOptionIndex());

        !this.overlayVisible() && this.show();
        event.preventDefault();
    }

    onEnterKey(event) {
        if (!this.overlayVisible()) {
            this.focusedOptionInfo.set({ ...this.focusedOptionInfo(), index: -1 }); // reset
            this.onArrowDownKey(event);
        } else {
            if (this.focusedOptionInfo().index !== -1) {
                const processedOption = this.visibleOptions()[this.focusedOptionInfo().index];
                const grouped = this.isProccessedOptionGroup(processedOption);

                this.onOptionClick({ originalEvent: event, processedOption });
                !grouped && this.hide();
            }
        }

        event.preventDefault();
    }

    onSpaceKey(event) {
        this.onEnterKey(event);
    }

    onEscapeKey(event) {
        this.overlayVisible() && this.hide(event, true);
        event.preventDefault();
    }

    onTabKey(event) {
        if (this.focusedOptionInfo().index !== -1) {
            const processedOption = this.visibleOptions()[this.focusedOptionInfo().index];
            const grouped = this.isProccessedOptionGroup(processedOption);

            !grouped && this.onOptionChange({ originalEvent: event, processedOption });
        }

        this.overlayVisible() && this.hide();
    }

    onBackspaceKey(event) {
        if (isNotEmpty(this.modelValue()) && this.showClear()) {
            this.clear();
        }

        event.stopPropagation();
    }

    equalityKey = computed(() => (this.optionValue() ? undefined : this.dataKey()));

    updateModel(value, event?) {
        this.value.set(value);
        this.onModelChange(value);
        this.writeModelValue(value);

        if (this.initialized()) {
            this.onChange.emit({
                originalEvent: event,
                value: value
            });
        }
    }

    autoUpdateModel() {
        if (this.selectOnFocus() && this.autoOptionFocus() && !this.hasSelectedOption()) {
            this.focusedOptionInfo.set({ ...this.focusedOptionInfo(), index: this.findFirstFocusedOptionIndex() });
            this.onOptionChange({
                originalEvent: null,
                processedOption: this.visibleOptions()[this.focusedOptionInfo().index],
                isHide: false
            });

            !this.overlayVisible() && this.focusedOptionInfo.set({ index: -1, level: 0, parentKey: '' });
        }
    }

    scrollInView(index = -1) {
        const id = index !== -1 ? `${this._id()}_${index}` : this.focusedOptionId();
        const element = findSingle(this.panelViewChild()?.nativeElement, `li[id="${id}"]`);

        if (element) {
            element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'start' });
        }
    }

    changeFocusedOptionIndex(event, index, preventSelection?: boolean) {
        const focusedOptionInfo = this.focusedOptionInfo();

        if (focusedOptionInfo.index !== index) {
            this.focusedOptionInfo.set({ ...focusedOptionInfo, index });
            this.scrollInView();

            if (this.focusOnHover()) {
                this.onOptionClick({ originalEvent: event, processedOption: this.visibleOptions()[index], isHide: false, preventSelection });
            }

            if (this.selectOnFocus()) {
                this.onOptionChange({ originalEvent: event, processedOption: this.visibleOptions()[index], isHide: false });
            }
        }
    }
    matchMediaListener = signal<VoidListener>(undefined);

    onOptionSelect(event) {
        const { originalEvent, value, isHide } = event;
        const newValue = this.getOptionValue(value);

        const activeOptionPath = this.activeOptionPath();
        activeOptionPath.forEach((p) => (p.selected = true));

        this.activeOptionPath.set(activeOptionPath);
        this.updateModel(newValue, originalEvent);
        isHide && this.hide(event, true);
    }

    onOptionGroupSelect(event) {
        this.dirty.set(true);
        this.onGroupChange.emit(event);
    }

    onContainerClick(event: MouseEvent) {
        if (this.$disabled() || this.loading()) {
            return;
        }

        if (!this.overlayViewChild()?.el?.nativeElement?.contains(event.target)) {
            if (this.overlayVisible()) {
                this.hide();
            } else {
                this.show();
            }

            this.focusInputViewChild().nativeElement.focus();
        }

        this.clicked.set(true);
    }

    isOptionMatched(processedOption) {
        return this.isValidOption(processedOption) && this.getProccessedOptionLabel(processedOption).toLocaleLowerCase(this.searchLocale()).startsWith(this.searchValue()?.toLocaleLowerCase(this.searchLocale()));
    }

    isOptionDisabled(option) {
        return this.optionDisabled() ? resolveFieldData(option, this.optionDisabled()) : false;
    }

    isValidOption(processedOption) {
        return !!processedOption && !this.isOptionDisabled(processedOption.option);
    }

    isValidSelectedOption(processedOption) {
        return this.isValidOption(processedOption) && this.isSelected(processedOption);
    }

    isSelected(processedOption) {
        return this.activeOptionPath().some((p) => p.key === processedOption.key);
    }

    findOptionPathByValue(value, processedOptions?, level = 0) {
        processedOptions = processedOptions || (level === 0 && this.processedOptions());

        if (!processedOptions) return null;
        if (isEmpty(value)) return [];

        for (let i = 0; i < processedOptions.length; i++) {
            const processedOption = processedOptions[i];

            if (equals(value, this.getOptionValue(processedOption.option), this.equalityKey())) {
                return [processedOption];
            }

            const matchedOptions = this.findOptionPathByValue(value, processedOption.children, level + 1);

            if (matchedOptions) {
                matchedOptions.unshift(processedOption);

                return matchedOptions;
            }
        }
    }

    findFirstOptionIndex() {
        return this.visibleOptions().findIndex((processedOption) => this.isValidOption(processedOption));
    }

    findLastOptionIndex() {
        return findLastIndex(this.visibleOptions(), (processedOption) => this.isValidOption(processedOption));
    }

    findNextOptionIndex(index) {
        const matchedOptionIndex =
            index < this.visibleOptions().length - 1
                ? this.visibleOptions()
                      .slice(index + 1)
                      .findIndex((processedOption) => this.isValidOption(processedOption))
                : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index;
    }

    findPrevOptionIndex(index) {
        const matchedOptionIndex = index > 0 ? findLastIndex(this.visibleOptions().slice(0, index), (processedOption) => this.isValidOption(processedOption)) : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    }

    findSelectedOptionIndex() {
        return this.visibleOptions().findIndex((processedOption) => this.isValidSelectedOption(processedOption));
    }

    findFirstFocusedOptionIndex() {
        const selectedIndex = this.findSelectedOptionIndex();

        return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    }

    findLastFocusedOptionIndex() {
        const selectedIndex = this.findSelectedOptionIndex();

        return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    }

    searchOptions(event, char) {
        this.searchValue.set((this.searchValue() || '') + char);

        let optionIndex = -1;
        let matched = false;
        const focusedOptionInfo = this.focusedOptionInfo();

        if (focusedOptionInfo.index !== -1) {
            optionIndex = this.visibleOptions()
                .slice(focusedOptionInfo.index)
                .findIndex((processedOption) => this.isOptionMatched(processedOption));
            optionIndex =
                optionIndex === -1
                    ? this.visibleOptions()
                          .slice(0, focusedOptionInfo.index)
                          .findIndex((processedOption) => this.isOptionMatched(processedOption))
                    : optionIndex + focusedOptionInfo.index;
        } else {
            optionIndex = this.visibleOptions().findIndex((processedOption) => this.isOptionMatched(processedOption));
        }

        if (optionIndex !== -1) {
            matched = true;
        }

        if (optionIndex === -1 && focusedOptionInfo.index === -1) {
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

    hide(event?, isFocus = false) {
        const _hide = () => {
            this.overlayVisible.set(false);
            this.clicked.set(false);
            this.activeOptionPath.set([]);
            this.focusedOptionInfo.set({ index: -1, level: 0, parentKey: '' });

            isFocus && focus(this.focusInputViewChild().nativeElement);
            this.onHide.emit(event);
        };

        setTimeout(() => {
            !this.destroyRef.destroyed && _hide();
        }, 0); // For ScreenReaders
    }

    show(event?, isFocus = false) {
        this.onShow.emit(event);
        this.overlayVisible.set(true);
        const activeOptionPath = this.hasSelectedOption() ? this.findOptionPathByValue(this.modelValue()) : this.activeOptionPath();
        this.activeOptionPath.set(activeOptionPath);
        let focusedOptionInfo;

        if (this.hasSelectedOption() && isNotEmpty(this.activeOptionPath())) {
            const processedOption = this.activeOptionPath()[this.activeOptionPath().length - 1];

            focusedOptionInfo = {
                index: processedOption.index,
                level: processedOption.level,
                parentKey: processedOption.parentKey
            };
        } else {
            focusedOptionInfo = { index: this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : this.findSelectedOptionIndex(), level: 0, parentKey: '' };
        }

        this.focusedOptionInfo.set(focusedOptionInfo);

        isFocus && focus(this.focusInputViewChild().nativeElement);
    }

    clear(event?: MouseEvent) {
        if (isNotEmpty(this.modelValue()) && this.showClear()) {
            this.updateModel(null);
            this.focusedOptionInfo.set({ index: -1, level: 0, parentKey: '' });
            this.activeOptionPath.set([]);
            this.onClear.emit(event);
        }

        event && event.stopPropagation();
    }

    getOptionLabel(option) {
        return this.optionLabel() ? resolveFieldData(option, this.optionLabel()) : option;
    }

    getOptionValue(option) {
        return this.optionValue() ? resolveFieldData(option, this.optionValue()) : option;
    }

    getOptionGroupLabel(optionGroup) {
        return this.optionGroupLabel() ? resolveFieldData(optionGroup, this.optionGroupLabel()) : null;
    }

    getOptionGroupChildren(optionGroup, level) {
        return resolveFieldData(optionGroup, this.optionGroupChildren()?.[level]);
    }

    isOptionGroup(option, level) {
        return Object.prototype.hasOwnProperty.call(option, this.optionGroupChildren()?.[level]);
    }

    isProccessedOptionGroup(processedOption) {
        return isNotEmpty(processedOption?.children);
    }

    getProccessedOptionLabel(processedOption) {
        const grouped = this.isProccessedOptionGroup(processedOption);

        return grouped ? this.getOptionGroupLabel(processedOption.option) : this.getOptionLabel(processedOption.option);
    }

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));

        let optionsBound = false;
        effect(() => {
            this.options();

            if (optionsBound) {
                untracked(() => this.updateModel(null));
            }
            optionsBound = true;
        });

        effect(() => {
            const activeOptionPath = this.activeOptionPath();
            if (isNotEmpty(activeOptionPath)) {
                this.overlayViewChild()?.alignOverlay();
            }
        });
    }
    query = signal<any>(undefined);
    queryMatches = signal<boolean>(false);

    onOptionChange(event) {
        const { processedOption, type } = event;

        if (isEmpty(processedOption)) return;

        const { index, key, level, parentKey, children } = processedOption;
        const grouped = isNotEmpty(children);
        const activeOptionPath = this.activeOptionPath().filter((p) => p.parentKey !== parentKey && p.parentKey !== key);

        this.focusedOptionInfo.set({ index, level, parentKey });

        if (type == 'hover' && this.queryMatches()) {
            return;
        }

        if (grouped) {
            activeOptionPath.push(processedOption);
        }

        this.activeOptionPath.set([...activeOptionPath]);
    }

    onOptionClick(event) {
        const { originalEvent, processedOption, isFocus, isHide, preventSelection } = event;
        const { index, key, level, parentKey } = processedOption;
        const grouped = this.isProccessedOptionGroup(processedOption);
        const selected = this.isSelected(processedOption);

        if (selected) {
            const activeOptionPath = this.activeOptionPath().filter((p) => key !== p.key && key.startsWith(p.key));
            this.activeOptionPath.set([...activeOptionPath]);
            this.focusedOptionInfo.set({ index, level, parentKey });
        } else {
            if (grouped) {
                this.onOptionChange(event);
                this.onOptionGroupSelect({ originalEvent, value: processedOption.option, isFocus: false });
            } else {
                const activeOptionPath = this.activeOptionPath().filter((p) => p.parentKey !== parentKey);

                activeOptionPath.push(processedOption);

                this.focusedOptionInfo.set({ index, level, parentKey });

                if (!preventSelection || processedOption?.children.length !== 0) {
                    this.activeOptionPath.set([...activeOptionPath]);
                    this.onOptionSelect({ originalEvent, value: processedOption.option, isHide: isFocus });
                }
            }
        }

        isFocus && focus(this.focusInputViewChild().nativeElement);
    }

    onOptionMouseEnter(event) {
        if (this.focusOnHover()) {
            if (this.dirty() || (!this.dirty() && isNotEmpty(this.modelValue()))) {
                this.onOptionChange({ ...event, type: 'hover' });
            } else if (!this.dirty() && event.processedOption.level === 0) {
                this.onOptionClick({ ...event, type: 'hover' });
            }
        }
    }

    onOptionMouseMove(event) {
        if (this.focused() && this.focusOnHover()) {
            this.changeFocusedOptionIndex(event, event.processedOption.index);
        }
    }

    onInit() {
        this.autoUpdateModel();
        this.bindMatchMediaListener();
    }

    onAfterViewInit() {
        this.initialized.set(true);
    }

    bindMatchMediaListener() {
        if (!this.matchMediaListener()) {
            const window: Window | null = this.document.defaultView;
            if (window && window.matchMedia) {
                const query = window.matchMedia(`(max-width: ${this.breakpoint()})`);
                this.query.set(query);
                this.queryMatches.set(query?.matches);

                this.matchMediaListener.set(() => {
                    this.queryMatches.set(query?.matches);
                });

                this.query().addEventListener('change', this.matchMediaListener());
            }
        }
    }

    unbindMatchMediaListener() {
        if (this.matchMediaListener()) {
            this.query().removeEventListener('change', this.matchMediaListener());
            this.matchMediaListener.set(null);
        }
    }

    onOverlayAfterLeave() {
        this.dirty.set(false);
    }

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

    onDestroy() {
        if (this.matchMediaListener()) {
            this.unbindMatchMediaListener();
        }

        if (this.searchTimeout()) {
            clearTimeout(this.searchTimeout());
        }
    }
}

@NgModule({
    imports: [CascadeSelect, SharedModule],
    exports: [CascadeSelect, SharedModule]
})
export class CascadeSelectModule {}
