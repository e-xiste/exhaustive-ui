import { CommonModule } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    forwardRef,
    HostListener,
    inject,
    InjectionToken,
    input,
    NgModule,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MotionOptions } from '@exhaustive-ui/motion';
import { focus, getFirstFocusableElement, getFocusableElements, getLastFocusableElement, isNotEmpty, uuid } from '@exhaustive-ui/utils';
import { OverlayOptions, PrimeTemplate, ScrollerOptions, SharedModule, TreeNode } from '@exhaustive-ui/core/api';
import { AutoFocus } from '@exhaustive-ui/core/autofocus';
import { PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseEditableHolder } from '@exhaustive-ui/core/baseeditableholder';
import { Bind } from '@exhaustive-ui/core/bind';
import { Chip } from '@exhaustive-ui/core/chip';
import { Fluid } from '@exhaustive-ui/core/fluid';
import { ChevronDownIcon, TimesIcon } from '@exhaustive-ui/core/icons';
import { Overlay } from '@exhaustive-ui/core/overlay';
import { Tree, TreeFilterEvent, TreeNodeSelectEvent, TreeNodeUnSelectEvent } from '@exhaustive-ui/core/tree';
import { Nullable } from '@exhaustive-ui/core/ts-helpers';
import {
    TreeSelectHeaderTemplateContext,
    TreeSelectItemCheckboxIconTemplateContext,
    TreeSelectItemTogglerIconTemplateContext,
    TreeSelectNodeCollapseEvent,
    TreeSelectNodeExpandEvent,
    TreeSelectPassThrough,
    TreeSelectValueTemplateContext
} from '@exhaustive-ui/core/types/treeselect';
import { TreeSelectStyle } from './style/treeselectstyle';

export const TREESELECT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TreeSelect),
    multi: true
};

const TREESELECT_INSTANCE = new InjectionToken<TreeSelect>('TREESELECT_INSTANCE');

/**
 * TreeSelect is a form component to choose from hierarchical data.
 * @group Components
 */
@Component({
    selector: 'p-treeSelect, p-treeselect, p-tree-select',
    imports: [CommonModule, Overlay, SharedModule, Tree, AutoFocus, TimesIcon, ChevronDownIcon, Chip, Bind],
    hostDirectives: [Bind],
    template: `
        <div class="p-hidden-accessible" [pBind]="ptm('hiddenInputContainer')" [attr.data-p-hidden-accessible]="true">
            <input
                #focusInput
                type="text"
                role="combobox"
                [attr.id]="inputId()"
                readonly
                [attr.disabled]="$disabled() ? '' : undefined"
                (focus)="onInputFocus($event)"
                (blur)="onInputBlur($event)"
                (keydown)="onKeyDown($event)"
                [attr.tabindex]="!$disabled() ? tabindex() : -1"
                [attr.aria-controls]="overlayVisible() ? listId : null"
                [attr.aria-haspopup]="'tree'"
                [attr.aria-expanded]="overlayVisible() ?? false"
                [attr.aria-labelledby]="ariaLabelledBy()"
                [attr.aria-label]="ariaLabel() || (label() === 'p-emptylabel' ? undefined : label())"
                [pAutoFocus]="autofocus()"
                [pBind]="ptm('hiddenInput')"
            />
        </div>
        <div [class]="cx('labelContainer')" [pBind]="ptm('labelContainer')">
            <div [class]="cn(cx('label'), labelStyleClass())" [ngStyle]="labelStyle()" [pBind]="ptm('label')">
                @if (valueTemplate() || _valueTemplate()) {
                    <ng-container *ngTemplateOutlet="valueTemplate() || _valueTemplate(); context: { $implicit: value(), placeholder: placeholder() }"></ng-container>
                } @else {
                    @if (display() === 'comma') {
                        {{ label() || 'empty' }}
                    } @else {
                        @for (node of value(); track node) {
                            <div [class]="cx('chipItem')" [pBind]="ptm('chipItem')">
                                <p-chip [unstyled]="unstyled()" [label]="node.label" [class]="cx('pcChip')" [pt]="ptm('pcChip')" />
                            </div>
                        }
                        @if (emptyValue()) {
                            {{ placeholder() || 'empty' }}
                        }
                    }
                }
            </div>
        </div>
        @if (checkValue() && !$disabled() && showClear()) {
            @if (!clearIconTemplate() && !_clearIconTemplate()) {
                <svg data-p-icon="times" [class]="cx('clearIcon')" (click)="clear($event)" [pBind]="ptm('clearIcon')" />
            }
            @if (clearIconTemplate() || _clearIconTemplate()) {
                <span [class]="cx('clearIcon')" (click)="clear($event)" [pBind]="ptm('clearIcon')">
                    <ng-template *ngTemplateOutlet="clearIconTemplate() || _clearIconTemplate()"></ng-template>
                </span>
            }
        }
        <div [class]="cx('dropdown')" role="button" aria-haspopup="tree" [attr.aria-expanded]="overlayVisible() ?? false" [attr.aria-label]="'treeselect trigger'" [pBind]="ptm('dropdown')">
            @if (!triggerIconTemplate() && !_triggerIconTemplate() && !dropdownIconTemplate() && !_dropdownIconTemplate()) {
                <svg data-p-icon="chevron-down" [class]="cx('dropdownIcon')" [pBind]="ptm('dropdownIcon')" />
            }
            @if (triggerIconTemplate() || _triggerIconTemplate() || dropdownIconTemplate() || _dropdownIconTemplate()) {
                <span [class]="cx('dropdownIcon')" [pBind]="ptm('dropdownIcon')">
                    <ng-template *ngTemplateOutlet="triggerIconTemplate() || _triggerIconTemplate() || dropdownIconTemplate() || _dropdownIconTemplate()"></ng-template>
                </span>
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
            (onBeforeEnter)="onOverlayBeforeEnter()"
            (onBeforeHide)="onOverlayBeforeHide()"
            (onShow)="onShow.emit($event)"
            (onHide)="hide($event)"
        >
            <ng-template #content>
                <div #panel [attr.id]="listId" [class]="cn(cx('panel'), panelStyleClass(), panelClass())" [ngStyle]="panelStyle()" [pBind]="ptm('panel')">
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
                    <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate(); context: { $implicit: value(), options: options() }"></ng-container>
                    <div [class]="cx('treeContainer')" [ngStyle]="{ 'max-height': scrollHeight() }" [pBind]="ptm('treeContainer')">
                        <p-tree
                            #tree
                            [value]="options()"
                            [propagateSelectionDown]="propagateSelectionDown()"
                            [propagateSelectionUp]="propagateSelectionUp()"
                            [selectionMode]="selectionMode()"
                            (selectionChange)="onSelectionChange($event)"
                            [selection]="value()"
                            [metaKeySelection]="metaKeySelection()"
                            (onNodeExpand)="nodeExpand($event)"
                            (onNodeCollapse)="nodeCollapse($event)"
                            (onNodeSelect)="onSelect($event)"
                            [emptyMessage]="emptyMessage()"
                            (onNodeUnselect)="onUnselect($event)"
                            [filter]="filter()"
                            [filterBy]="filterBy()"
                            [filterMode]="filterMode()"
                            [filterPlaceholder]="filterPlaceholder()"
                            [filterLocale]="filterLocale()"
                            [filteredNodes]="filteredNodes()"
                            [virtualScroll]="virtualScroll()"
                            [virtualScrollItemSize]="virtualScrollItemSize()"
                            [virtualScrollOptions]="virtualScrollOptions()"
                            [_templateMap]="templateMap()"
                            [loading]="loading()"
                            [filterInputAutoFocus]="filterInputAutoFocus()"
                            [loadingMode]="loadingMode()"
                            [pt]="ptm('pcTree')"
                            [unstyled]="unstyled()"
                        >
                            @if (emptyTemplate() || _emptyTemplate()) {
                                <ng-template #empty>
                                    <ng-container *ngTemplateOutlet="emptyTemplate() || _emptyTemplate()"></ng-container>
                                </ng-template>
                            }
                            @if (itemTogglerIconTemplate() || _itemTogglerIconTemplate(); as expanded) {
                                <ng-template #togglericon let-expanded>
                                    <ng-container *ngTemplateOutlet="itemTogglerIconTemplate() || _itemTogglerIconTemplate(); context: { $implicit: expanded }"></ng-container>
                                </ng-template>
                            }
                            <ng-template #checkboxicon let-selected let-partialSelected="partialSelected" *ngIf="itemCheckboxIconTemplate() || _itemCheckboxIconTemplate()">
                                <ng-container *ngTemplateOutlet="itemCheckboxIconTemplate() || _itemCheckboxIconTemplate(); context: { $implicit: selected, partialSelected: partialSelected }"></ng-container>
                            </ng-template>
                            @if (itemLoadingIconTemplate() || _itemLoadingIconTemplate()) {
                                <ng-template #loadingicon>
                                    <ng-container *ngTemplateOutlet="itemLoadingIconTemplate() || _itemLoadingIconTemplate()"></ng-container>
                                </ng-template>
                            }
                            @if (filterIconTemplate() || _filterIconTemplate()) {
                                <ng-template #filtericon>
                                    <ng-container *ngTemplateOutlet="filterIconTemplate() || _filterIconTemplate()"></ng-container>
                                </ng-template>
                            }
                        </p-tree>
                    </div>
                    <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate(); context: { $implicit: value(), options: options() }"></ng-container>
                    <span
                        #lastHiddenFocusableEl
                        role="presentation"
                        class="p-hidden-accessible p-hidden-focusable"
                        [attr.tabindex]="0"
                        (focus)="onLastHiddenFocus($event)"
                        [attr.data-p-hidden-accessible]="true"
                        [attr.data-p-hidden-focusable]="true"
                        [pBind]="ptm('hiddenLastFocusableEl')"
                    ></span>
                </div>
            </ng-template>
        </p-overlay>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        TREESELECT_VALUE_ACCESSOR,
        TreeSelectStyle,
        {
            provide: TREESELECT_INSTANCE,
            useExisting: TreeSelect
        },
        {
            provide: PARENT_INSTANCE,
            useExisting: TreeSelect
        }
    ],
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[style]': "sx('root')"
    }
})
export class TreeSelect extends BaseEditableHolder<TreeSelectPassThrough> {
    componentName = 'TreeSelect';

    $pcTreeSelect: TreeSelect | undefined = inject(TREESELECT_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TreeSelectStyle);

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
        effect(() => {
            this.options();
            untracked(() => this.updateTreeState());
        });
    }

    /**
     * Identifier of the underlying input element.
     * @group Props
     */
    inputId = input<string | undefined>();
    /**
     * Height of the viewport, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    scrollHeight = input<string>('400px');
    /**
     * Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    metaKeySelection = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Defines how the selected items are displayed.
     * @group Props
     */
    display = input<'comma' | 'chip'>('comma');
    /**
     * Defines the selection mode.
     * @group Props
     */
    selectionMode = input<'single' | 'multiple' | 'checkbox'>('single');
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input<string | undefined>('0');
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    ariaLabel = input<string | undefined>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>();
    /**
     * Label to display when there are no selections.
     * @group Props
     */
    placeholder = input<string | undefined>();
    /**
     * Style class of the overlay panel.
     * @group Props
     */
    panelClass = input<string | string[] | Set<string> | { [klass: string]: any } | undefined>();
    /**
     * Inline style of the panel element.
     * @group Props
     */
    panelStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the panel element.
     * @group Props
     */
    panelStyleClass = input<string | undefined>();
    /**
     * Inline style of the label element.
     * @group Props
     */
    labelStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the label element.
     * @group Props
     */
    labelStyleClass = input<string | undefined>();
    /**
     * Specifies the options for the overlay.
     * @group Props
     */
    overlayOptions = input<OverlayOptions | undefined>();
    /**
     * Text to display when there are no options available. Defaults to value from Exhaustive locale configuration.
     * @group Props
     */
    emptyMessage = input<string>('');
    /**
     * When specified, displays an input field to filter the items.
     * @group Props
     */
    filter = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
     * @group Props
     */
    filterBy = input<string>('label');
    /**
     * Mode for filtering valid values are "lenient" and "strict". Default is lenient.
     * @group Props
     */
    filterMode = input<string>('lenient');
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
     * Determines whether the filter input should be automatically focused when the component is rendered.
     * @group Props
     */
    filterInputAutoFocus = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether checkbox selections propagate to descendant nodes.
     * @group Props
     */
    propagateSelectionDown = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether checkbox selections propagate to ancestor nodes.
     * @group Props
     */
    propagateSelectionUp = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    showClear = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Clears the filter value when hiding the dropdown.
     * @group Props
     */
    resetFilterOnHide = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    virtualScroll = input<boolean | undefined>();
    /**
     * Height of an item in the list for VirtualScrolling.
     * @group Props
     */
    virtualScrollItemSize = input<number | undefined>();
    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    virtualScrollOptions = input<ScrollerOptions | undefined>();
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * An array of treenodes.
     * @defaultValue undefined
     * @group Props
     */
    options = input<TreeNode[] | undefined>();
    /**
     * Displays a loader to indicate data load is in progress.
     * @group Props
     */
    loading = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Loading mode display.
     * @group Props
     */
    loadingMode = input<'mask' | 'icon'>('mask');
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
     * Callback to invoke when a node is expanded.
     * @param {TreeSelectNodeExpandEvent} event - Custom node expand event.
     * @group Emits
     */
    readonly onNodeExpand = output<TreeSelectNodeExpandEvent>();
    /**
     * Callback to invoke when a node is collapsed.
     * @param {TreeSelectNodeCollapseEvent} event - Custom node collapse event.
     * @group Emits
     */
    readonly onNodeCollapse = output<TreeSelectNodeCollapseEvent>();
    /**
     * Callback to invoke when the overlay is shown.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onShow = output<any>();
    /**
     * Callback to invoke when the overlay is hidden.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onHide = output<Event>();
    /**
     * Callback to invoke when input field is cleared.
     * @group Emits
     */
    readonly onClear = output<any>();
    /**
     * Callback to invoke when data is filtered.
     * @group Emits
     */
    readonly onFilter = output<TreeFilterEvent>();
    /**
     * Callback to invoke when treeselect gets focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onFocus = output<Event>();
    /**
     * Callback to invoke when treeselect loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onBlur = output<Event>();
    /**
     * Callback to invoke when a node is unselected.
     * @param {TreeNodeUnSelectEvent} event - node unselect event.
     * @group Emits
     */
    readonly onNodeUnselect = output<TreeNodeUnSelectEvent>();
    /**
     * Callback to invoke when a node is selected.
     * @param {TreeNodeSelectEvent} event - node select event.
     * @group Emits
     */
    readonly onNodeSelect = output<TreeNodeSelectEvent>();

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    readonly focusInput = viewChild.required<ElementRef>('focusInput');

    readonly filterViewChild = viewChild<Nullable<ElementRef>>('filter');

    readonly treeViewChild = viewChild<Nullable<Tree>>('tree');

    readonly panelEl = viewChild<Nullable<ElementRef>>('panel');

    readonly overlayViewChild = viewChild.required<Overlay>('overlay');

    readonly firstHiddenFocusableElementOnOverlay = viewChild<Nullable<ElementRef>>('firstHiddenFocusableEl');

    readonly lastHiddenFocusableElementOnOverlay = viewChild<Nullable<ElementRef>>('lastHiddenFocusableEl');

    $variant = computed(() => this.variant() || this.config.inputStyle() || this.config.inputVariant());

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    hasFluid = computed(() => this.fluid() ?? !!this.pcFluid);

    public filteredNodes = signal<TreeNode[] | undefined | null>(undefined);

    filterValue = signal<Nullable<string>>(null);
    /**
     * Custom value template.
     * @param {TreeSelectValueTemplateContext} context - value context.
     * @see {@link TreeSelectValueTemplateContext}
     * @group Templates
     */
    readonly valueTemplate = contentChild<Nullable<TemplateRef<TreeSelectValueTemplateContext>>>('value', { descendants: false });

    /**
     * Custom header template.
     * @param {TreeSelectHeaderTemplateContext} context - header context.
     * @see {@link TreeSelectHeaderTemplateContext}
     * @group Templates
     */
    readonly headerTemplate = contentChild<Nullable<TemplateRef<TreeSelectHeaderTemplateContext>>>('header', { descendants: false });

    /**
     * Custom empty message template.
     * @group Templates
     */
    readonly emptyTemplate = contentChild<Nullable<TemplateRef<void>>>('empty', { descendants: false });

    /**
     * Custom footer template.
     * @param {TreeSelectHeaderTemplateContext} context - footer context.
     * @see {@link TreeSelectHeaderTemplateContext}
     * @group Templates
     */
    readonly footerTemplate = contentChild<Nullable<TemplateRef<TreeSelectHeaderTemplateContext>>>('footer', { descendants: false });

    /**
     * Custom clear icon template.
     * @group Templates
     */
    readonly clearIconTemplate = contentChild<Nullable<TemplateRef<void>>>('clearicon', { descendants: false });

    /**
     * Custom trigger icon template.
     * @group Templates
     */
    readonly triggerIconTemplate = contentChild<Nullable<TemplateRef<void>>>('triggericon', { descendants: false });

    /**
     * Custom dropdown icon template.
     * @group Templates
     */
    readonly dropdownIconTemplate = contentChild<Nullable<TemplateRef<void>>>('dropdownicon', { descendants: false });

    /**
     * Custom filter icon template.
     * @group Templates
     */
    readonly filterIconTemplate = contentChild<Nullable<TemplateRef<void>>>('filtericon', { descendants: false });

    /**
     * Custom item toggler icon template.
     * @param {TreeSelectItemTogglerIconTemplateContext} context - toggler icon context.
     * @see {@link TreeSelectItemTogglerIconTemplateContext}
     * @group Templates
     */
    readonly itemTogglerIconTemplate = contentChild<Nullable<TemplateRef<TreeSelectItemTogglerIconTemplateContext>>>('itemtogglericon', { descendants: false });

    /**
     * Custom item checkbox icon template.
     * @param {TreeSelectItemCheckboxIconTemplateContext} context - checkbox icon context.
     * @see {@link TreeSelectItemCheckboxIconTemplateContext}
     * @group Templates
     */
    readonly itemCheckboxIconTemplate = contentChild<Nullable<TemplateRef<TreeSelectItemCheckboxIconTemplateContext>>>('itemcheckboxicon', { descendants: false });

    /**
     * Custom item loading icon template.
     * @group Templates
     */
    readonly itemLoadingIconTemplate = contentChild<Nullable<TemplateRef<void>>>('itemloadingicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    _valueTemplate = computed<TemplateRef<TreeSelectValueTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'value' || !item.name())
                .at(-1)?.template
    );

    _headerTemplate = computed<TemplateRef<TreeSelectHeaderTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    _emptyTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'empty')
                .at(-1)?.template
    );

    _footerTemplate = computed<TemplateRef<TreeSelectHeaderTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    _clearIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'clearicon')
                .at(-1)?.template
    );

    _triggerIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'triggericon')
                .at(-1)?.template
    );

    _filterIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'filtericon')
                .at(-1)?.template
    );

    _itemTogglerIconTemplate = computed<TemplateRef<TreeSelectItemTogglerIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'itemtogglericon')
                .at(-1)?.template
    );

    _itemCheckboxIconTemplate = computed<TemplateRef<TreeSelectItemCheckboxIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'itemcheckboxicon')
                .at(-1)?.template
    );

    _itemLoadingIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'itemloadingicon')
                .at(-1)?.template
    );

    _dropdownIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'dropdownicon')
                .at(-1)?.template
    );

    focused = signal<Nullable<boolean>>(undefined);

    overlayVisible = signal<Nullable<boolean>>(undefined);

    value = signal<any | undefined>(undefined);

    expandedNodes = signal<any[]>([]);

    public templateMap = computed<any>(() => {
        const templates = this.templates();

        if (!templates.length) {
            return undefined;
        }

        const templateMap = {};
        templates.forEach((item) => {
            if (item.name() && !['value', 'header', 'empty', 'footer', 'clearicon', 'triggericon', 'filtericon', 'closeicon', 'itemtogglericon', 'itemcheckboxicon', 'dropdownicon', 'itemloadingicon'].includes(item.getType())) {
                templateMap[item.name()!] = item.template;
            }
        });

        return templateMap;
    });

    listId: string = uuid('pn_id_') + '_list';

    @HostListener('mousedown', ['$event'])
    onHostClick(event: MouseEvent) {
        this.onClick(event);
    }

    onOverlayBeforeEnter() {
        if (this.filter()) {
            isNotEmpty(this.filterValue()) && this.treeViewChild()?._filter(<any>this.filterValue());
            this.filterInputAutoFocus() && this.filterViewChild()?.nativeElement.focus();
        } else {
            let focusableElements = <any>getFocusableElements(this.panelEl()?.nativeElement!);

            if (focusableElements && focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
        const panelElement = this.panelEl()?.nativeElement;
        if (this.virtualScroll() && panelElement) {
            let lastHeight = panelElement.offsetHeight;
            const virtualScrollResizeObserver = new ResizeObserver((entries) => {
                const newHeight = entries[0].contentRect.height;
                if (newHeight !== lastHeight) {
                    lastHeight = newHeight;
                    this.overlayViewChild().alignOverlay();
                }
            });
            virtualScrollResizeObserver.observe(panelElement);

            // clean up when overlay closes, not after first callback
            const onHideSubscription = this.overlayViewChild()?.onHide.subscribe(() => {
                virtualScrollResizeObserver.disconnect();
                onHideSubscription?.unsubscribe();
            });
        }
    }

    onOverlayBeforeHide() {
        let focusableElements = <any>getFocusableElements(this.el.nativeElement);

        if (focusableElements && focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    onSelectionChange(event: any) {
        this.value.set(event);
        this.onModelChange(this.value());
    }

    onClick(event: any) {
        if (this.$disabled()) {
            return;
        }
        const section = event.target?.getAttribute?.('data-pc-section');
        if (!this.overlayViewChild().el?.nativeElement?.contains(event.target) && section !== 'box' && section !== 'icon') {
            if (this.overlayVisible()) {
                this.hide();
            } else {
                this.show();
            }

            this.focusInput().nativeElement.focus();
        }
    }

    onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            //down
            case 'ArrowDown':
                if (!this.overlayVisible()) {
                    this.show();
                    event.preventDefault();
                }
                this.onArrowDown(event);
                event.preventDefault();
                break;

            //space
            case 'Space':
            case 'Enter':
                if (!this.overlayVisible()) {
                    this.show();
                    event.preventDefault();
                }
                break;

            //escape
            case 'Escape':
                if (this.overlayVisible()) {
                    this.hide();
                    this.focusInput().nativeElement.focus();
                    event.preventDefault();
                }
                break;

            //tab
            case 'Tab':
                this.onTabKey(event);
                break;

            default:
                break;
        }
    }

    onFilterInput(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.filterValue.set(filterValue);
        const treeViewChild = this.treeViewChild();
        treeViewChild?._filter(filterValue);
        this.onFilter.emit({
            filter: filterValue,
            filteredValue: treeViewChild?.filteredNodes()
        });
        setTimeout(() => {
            this.overlayViewChild().alignOverlay();
        });
    }

    onArrowDown(event: KeyboardEvent) {
        const panelEl = this.panelEl();
        if (this.overlayVisible() && panelEl?.nativeElement) {
            let focusableElements = <any>getFocusableElements(panelEl.nativeElement, '[data-pc-section="node"]');
            if (focusableElements && focusableElements.length > 0) {
                focusableElements[0].focus();
            }

            event.preventDefault();
        }
    }

    onFirstHiddenFocus(event) {
        const focusInput = this.focusInput();
        const focusableEl = event.relatedTarget === focusInput.nativeElement ? getFirstFocusableElement(this.overlayViewChild().overlayViewChild()?.nativeElement, ':not([data-p-hidden-focusable="true"])') : focusInput.nativeElement;

        focus(focusableEl);
    }

    onLastHiddenFocus(event) {
        const focusInput = this.focusInput();
        const focusableEl = event.relatedTarget === focusInput.nativeElement ? getLastFocusableElement(this.overlayViewChild().overlayViewChild()?.nativeElement, ':not([data-p-hidden-focusable="true"])') : focusInput.nativeElement;

        focus(focusableEl);
    }

    show() {
        this.overlayVisible.set(true);
    }

    hide(event?: any) {
        this.overlayVisible.set(false);
        this.resetFilter();

        this.onHide.emit(event);
    }

    clear(event: Event) {
        this.value.set(null);
        this.resetExpandedNodes();
        this.resetPartialSelected();
        this.onModelChange(this.value());
        this.onClear.emit(undefined);

        event.stopPropagation();
    }

    checkValue = computed(() => this.value() !== null && isNotEmpty(this.value()));

    onTabKey(event, pressedInInputText = false) {
        if (!pressedInInputText) {
            if (this.overlayVisible() && this.hasFocusableElements()) {
                focus(event.shiftKey ? this.lastHiddenFocusableElementOnOverlay()?.nativeElement : this.firstHiddenFocusableElementOnOverlay()?.nativeElement);

                event.preventDefault();
            } else {
                this.overlayVisible() && this.hide(this.filter());
            }
        }
    }

    hasFocusableElements() {
        return getFocusableElements(this.overlayViewChild().overlayViewChild()?.nativeElement, ':not([data-p-hidden-focusable="true"])').length > 0;
    }

    resetFilter() {
        if (this.filter() && !this.resetFilterOnHide()) {
            const treeViewChild = this.treeViewChild();
            this.filteredNodes.set(treeViewChild?.filteredNodes());
            treeViewChild?.resetFilter();
        } else {
            this.filterValue.set(null);
        }
    }

    updateTreeState() {
        const value = this.value();
        if (value) {
            let selectedNodes = this.selectionMode() === 'single' ? [value] : [...value];
            this.resetExpandedNodes();
            this.resetPartialSelected();
            if (selectedNodes && this.options()) {
                this.updateTreeBranchState(null, null, selectedNodes);
            }
        }
    }

    updateTreeBranchState(node: TreeNode | null, path: any, selectedNodes: TreeNode[]) {
        if (node) {
            if (this.isSelected(node)) {
                this.expandPath(path);
                selectedNodes.splice(selectedNodes.indexOf(node), 1);
            }

            if (selectedNodes.length > 0 && node.children) {
                for (let childNode of node.children) {
                    this.updateTreeBranchState(childNode, [...path, node], selectedNodes);
                }
            }
        } else {
            for (let childNode of this.options() as TreeNode[]) {
                this.updateTreeBranchState(childNode, [], selectedNodes);
            }
        }
    }

    expandPath(expandedNodes: TreeNode[]) {
        for (let node of expandedNodes) {
            node.expanded = true;
        }

        this.expandedNodes.set([...expandedNodes]);
    }

    nodeExpand(event: { originalEvent: Event; node: TreeNode }) {
        this.onNodeExpand.emit(event);
        this.expandedNodes.update((nodes) => [...nodes, event.node]);
        setTimeout(() => {
            this.overlayViewChild().alignOverlay();
        });
    }

    nodeCollapse(event: { originalEvent: Event; node: TreeNode }) {
        this.onNodeCollapse.emit(event);
        this.expandedNodes.update((nodes) => {
            const expandedNodes = [...nodes];
            expandedNodes.splice(expandedNodes.indexOf(event.node), 1);
            return expandedNodes;
        });
        setTimeout(() => {
            this.overlayViewChild().alignOverlay();
        });
    }

    resetExpandedNodes() {
        for (let node of this.expandedNodes()) {
            node.expanded = false;
        }

        this.expandedNodes.set([]);
    }

    resetPartialSelected(nodes = this.options()): void {
        if (!nodes) {
            return;
        }

        for (let node of nodes) {
            node.partialSelected = false;

            if (node.children && node.children?.length > 0) {
                this.resetPartialSelected(node.children);
            }
        }
    }

    isSelected(node: TreeNode) {
        return this.findIndexInSelection(node) != -1;
    }

    findIndexInSelection(node: TreeNode) {
        let index: number = -1;
        const value = this.value();

        if (value) {
            if (this.selectionMode() === 'single') {
                let areNodesEqual = (value.key && value.key === node.key) || value == node;
                index = areNodesEqual ? 0 : -1;
            } else {
                for (let i = 0; i < value.length; i++) {
                    let selectedNode = value[i];
                    let areNodesEqual = (selectedNode.key && selectedNode.key === node.key) || selectedNode == node;
                    if (areNodesEqual) {
                        index = i;
                        break;
                    }
                }
            }
        }

        return index;
    }

    onSelect(event: TreeNodeSelectEvent) {
        this.onNodeSelect.emit(event);

        if (this.selectionMode() === 'single') {
            this.hide();
            this.focusInput().nativeElement.focus();
        }
    }

    onUnselect(event: TreeNodeUnSelectEvent) {
        this.onNodeUnselect.emit(event);
    }

    onInputFocus(event: Event) {
        if (this.$disabled()) {
            // For ScreenReaders
            return;
        }

        this.focused.set(true);
        this.onFocus.emit(event);
    }

    onInputBlur(event: Event) {
        this.focused.set(false);
        this.onBlur.emit(event);
        this.onModelTouched();
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any): void {
        this.value.set(value);
        this.updateTreeState();
    }

    emptyValue = computed(() => !this.value() || Object.keys(this.value()).length === 0);

    label = computed(() => {
        let value = this.value() || [];
        return value.length ? value.map((node: TreeNode) => node.label).join(', ') : this.selectionMode() === 'single' && this.value() ? value.label : this.placeholder();
    });
}

@NgModule({
    imports: [TreeSelect, SharedModule],
    exports: [TreeSelect, SharedModule]
})
export class TreeSelectModule {}
