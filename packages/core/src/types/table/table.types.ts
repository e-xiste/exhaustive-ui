import { TemplateRef } from '@angular/core';
import type { FilterMetadata, LazyLoadMeta, PassThrough, PassThroughOption } from '@exhaustive-ui/core/api';
import type { ButtonPassThrough, ButtonProps } from '@exhaustive-ui/core/types/button';
import type { CheckboxPassThrough } from '@exhaustive-ui/core/types/checkbox';
import type { PaginatorDropdownItemTemplateContext, PaginatorPassThrough, PaginatorTemplateContext } from '@exhaustive-ui/core/types/paginator';
import type { VirtualScrollerPassThrough } from '@exhaustive-ui/core/types/scroller';
import type { InputTextPassThrough } from '@exhaustive-ui/core/types/inputtext';
import type { SelectPassThrough } from '@exhaustive-ui/core/types/select';
import type { InputNumberPassThrough } from '@exhaustive-ui/core/types/inputnumber';
import type { DatePickerPassThrough } from '@exhaustive-ui/core/types/datepicker';
import type { MotionOptions } from '@exhaustive-ui/motion';

/**
 * Custom pass-through(pt) options for ColumnFilter.
 * @template I Type of instance.
 *
 * @group Interface
 */
export interface ColumnFilterPassThroughOptions<I = unknown> {
    /**
     * Used to pass attributes to the filter container element.
     */
    filter?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the column filter button component.
     */
    pcColumnFilterButton?: ButtonPassThrough;
    /**
     * Used to pass attributes to the filter overlay element.
     */
    filterOverlay?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the filter constraint list element.
     */
    filterConstraintList?: PassThroughOption<HTMLUListElement, I>;
    /**
     * Used to pass attributes to the filter constraint element.
     */
    filterConstraint?: PassThroughOption<HTMLLIElement, I>;
    /**
     * Used to pass attributes to the filter constraint separator element.
     */
    filterConstraintSeparator?: PassThroughOption<HTMLLIElement, I>;
    /**
     * Used to pass attributes to the empty filter label element.
     */
    emtpyFilterLabel?: PassThroughOption<HTMLLIElement, I>;
    /**
     * Used to pass attributes to the filter operator element.
     */
    filterOperator?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the filter operator dropdown component.
     */
    pcFilterOperatorDropdown?: SelectPassThrough;
    /**
     * Used to pass attributes to the filter rule list element.
     */
    filterRuleList?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the filter rule element.
     */
    filterRule?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the filter constraint dropdown component.
     */
    pcFilterConstraintDropdown?: SelectPassThrough;
    /**
     * Used to pass attributes to the filter remove rule button component.
     */
    pcFilterRemoveRuleButton?: ButtonPassThrough;
    /**
     * Used to pass attributes to the add rule button label.
     */
    pcAddRuleButtonLabel?: ButtonPassThrough;
    /**
     * Used to pass attributes to the filter button bar element.
     */
    filterButtonBar?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the filter clear button component.
     */
    pcFilterClearButton?: ButtonPassThrough;
    /**
     * Used to pass attributes to the filter apply button component.
     */
    pcFilterApplyButton?: ButtonPassThrough;
    /**
     * Used to pass attributes to the filter input text component.
     */
    pcFilterInputText?: InputTextPassThrough;
    /**
     * Used to pass attributes to the filter input number component.
     */
    pcFilterInputNumber?: InputNumberPassThrough;
    /**
     * Used to pass attributes to the filter checkbox component.
     */
    pcFilterCheckbox?: CheckboxPassThrough;
    /**
     * Used to pass attributes to the filter datepicker component.
     */
    pcFilterDatePicker?: DatePickerPassThrough;
    /**
     * Used to pass options to the motion component/directive.
     */
    motion?: MotionOptions;
}

/**
 * Defines valid pass-through options in ColumnFilter.
 * @see {@link ColumnFilterPassThroughOptions}
 *
 * @template I Type of instance.
 */
export type ColumnFilterPassThrough<I = unknown> = PassThrough<I, ColumnFilterPassThroughOptions<I>>;

/**
 * Custom pass-through(pt) options.
 * @template I Type of instance.
 *
 * @see {@link TableProps.pt}
 * @group Interface
 */
export interface TablePassThroughOptions<I = unknown> {
    /**
     * Used to pass attributes to the host's DOM element.
     */
    host?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the root's DOM element.
     */
    root?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the loading mask element.
     */
    mask?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the loading icon element.
     */
    loadingIcon?: PassThroughOption<HTMLElement, I>;
    /**
     * Used to pass attributes to the header (caption) element.
     */
    header?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the paginator component.
     */
    pcPaginator?: PaginatorPassThrough;
    /**
     * Used to pass attributes to the table container element.
     */
    tableContainer?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the virtual scroller component.
     */
    virtualScroller?: VirtualScrollerPassThrough;
    /**
     * Used to pass attributes to the table element.
     */
    table?: PassThroughOption<HTMLTableElement, I>;
    /**
     * Used to pass attributes to the thead element.
     */
    thead?: PassThroughOption<HTMLTableSectionElement, I>;
    /**
     * Used to pass attributes to the tbody element.
     */
    tbody?: PassThroughOption<HTMLTableSectionElement, I>;
    /**
     * Used to pass attributes to the virtual scroller spacer element.
     */
    virtualScrollerSpacer?: PassThroughOption<HTMLTableSectionElement, I>;
    /**
     * Used to pass attributes to the tfoot element.
     */
    tfoot?: PassThroughOption<HTMLTableSectionElement, I>;
    /**
     * Used to pass attributes to the footer element.
     */
    footer?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the column resize indicator element.
     */
    columnResizeIndicator?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the row reorder indicator up element.
     */
    rowReorderIndicatorUp?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the row reorder indicator down element.
     */
    rowReorderIndicatorDown?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the reorderable row element.
     */
    reorderableRow?: PassThroughOption<HTMLTableRowElement, I>;
    /**
     * Used to pass attributes to the reorderable row handle element.
     */
    reorderableRowHandle?: PassThroughOption<HTMLElement, I>;
    /**
     * Used to pass attributes to the header checkbox component.
     */
    headerCheckbox?: CheckboxPassThrough;
    /**
     * Used to pass attributes to the checkbox component.
     */
    pcCheckbox?: CheckboxPassThrough;
    /**
     * Used to pass attributes to the column filter component.
     */
    columnFilter?: ColumnFilterPassThroughOptions<I>;
    /**
     * Used to pass attributes to the column filter form element component.
     */
    columnFilterFormElement?: PassThroughOption<HTMLElement, I>;
}

/**
 * Defines valid pass-through options in Table.
 * @see {@link TablePassThroughOptions}
 *
 * @template I Type of instance.
 */
export type TablePassThrough<I = unknown> = PassThrough<I, TablePassThroughOptions<I>>;
/**
 * Custom select event.
 * @see {@link Table.onRowSelect}
 * @extends {LazyLoadMeta}
 * @group Events
 */
export interface TableRowSelectEvent<RowData = any> {
    /**
     * Browser event.
     */
    originalEvent?: Event;
    /**
     * Row data.
     */
    data?: RowData | RowData[];
    /**
     * Selection type.
     */
    type?: string;
    /**
     * Index of the selected row.
     */
    index?: number;
}
/**
 * Custom unselect event.
 * @see {@link Table.onRowUnselect}
 * @extends {TableRowSelectEvent}
 * @group Events
 */
export interface TableRowUnSelectEvent<RowData> extends TableRowSelectEvent<RowData> {}
/**
 * Custom page event.
 * @see {@link Table.onPage}
 */
export interface TablePageEvent {
    /**
     * Index of the first element.
     */
    first: number;
    /**
     * Row count.
     */
    rows: number;
}
/**
 * Custom filter event.
 * @see {@link Table.onFilter}
 * @group Events
 */
export interface TableFilterEvent {
    /**
     * Filter meta.
     */
    filters?: { [s: string]: FilterMetadata | FilterMetadata[] | undefined };
    /**
     * Value after filter.
     */
    filteredValue?: any[] | any;
}
/**
 * Custom lazy load event.
 * @see {@link Table.onLazyLoad}
 * @extends {LazyLoadMeta}
 * @group Events
 */
export interface TableLazyLoadEvent extends LazyLoadMeta {
    /**
     * First element in viewport.
     */
    first?: number;
    /**
     * Last element in viewport.
     */
    last?: number;
}
/**
 * Custom row expand event.
 * @see {@link Table.onRowExpand}
 * @group Events
 */
export interface TableRowExpandEvent<RowData = any> {
    /**
     * Browser event.
     */
    originalEvent: Event;
    /**
     * Row data.
     */
    data: RowData;
}
/**
 * Custom row collapse event.
 * @see {@link Table.onRowCollapse}
 * @extends {TableRowExpandEvent}
 * @group Events
 */
export interface TableRowCollapseEvent extends TableRowExpandEvent {}
/**
 * Custom context menu select event.
 * @see {@link Table.onContextMenuSelect}
 * @group Events
 */
export interface TableContextMenuSelectEvent<RowData = any> {
    /**
     * Browser event.
     */
    originalEvent: Event;
    /**
     * Row data.
     */
    data: RowData;
    /**
     * Row index.
     */
    index: number;
}
/**
 * Custom context menu selection change event.
 * @see {@link Table.contextMenuSelectionChange}
 * @group Events
 */
export interface TableContextMenuSelectionChangeEvent<RowData = any> {
    /**
     * Row data.
     */
    data: RowData;
}
/**
 * Custom column resize event.
 * @see {@link Table.onColResize}
 * @group Events
 */
export interface TableColResizeEvent {
    /**
     * Instance of resized column.
     */
    element: HTMLElement;
    /**
     * Position.
     */
    delta: number;
}
/**
 * Custom column reorder event.
 * @see {@link Table.onColReorder}
 * @group Events
 */
export interface TableColumnReorderEvent {
    /**
     * Index of the dragged item.
     */
    dragIndex?: number;
    /**
     * Index of the drop position.
     */
    dropIndex?: number;
    /**
     * Columns after reorder.
     */
    columns?: any[];
}
/**
 * Custom row reorder event.
 * @see {@link Table.onRowReorder}
 * @group Events
 */
export interface TableRowReorderEvent {
    /**
     * Index of the dragged item.
     */
    dragIndex?: number;
    /**
     * Index of the drop position.
     */
    dropIndex?: number;
}
/**
 * Custom edit event.
 * @group Events
 */
export interface TableEditEvent<RowData = any> {
    /**
     * Field to be edited.
     */
    field?: string;
    /**
     * New value.
     */
    data?: RowData;
}
/**
 * Custom edit init event.
 * @see {@link Table.onEditInit}
 * @group Events
 */
export interface TableEditInitEvent extends TableEditEvent {
    /**
     * Edited element index.
     */
    index: number;
}
/**
 * Custom edit cancel event.
 * @see {@link Table.onEditCancel}
 * @group Events
 */
export interface TableEditCancelEvent extends TableEditEvent {
    /**
     * Browser event.
     */
    originalEvent?: Event;
    /**
     * Edited element index.
     */
    index?: number;
}
/**
 * Custom edit complete event.
 * @see {@link Table.onEditComplete}
 * @group Events
 */
export interface TableEditCompleteEvent extends TableEditCancelEvent {}
/**
 * Custom checkbox toggle event.
 * @see {@link Table.onHeaderCheckboxToggle}
 * @group Events
 */
export interface TableHeaderCheckboxToggleEvent {
    /**
     * Browser event.
     */
    originalEvent: Event;
    /**
     * Checked state.
     */
    checked: boolean;
}
/**
 * Custom all selection change event.
 * @see {@link Table.onSelectAllChange}
 * @group Events
 */
export interface TableSelectAllChangeEvent {
    /**
     * Browser event.
     */
    originalEvent: Event;
    /**
     * Checked state.
     */
    checked: boolean;
}
/**
 * Custom table filter popover button props options.
 */
export interface TableFilterButtonPopoverPropsOptions {
    /**
     * Add rule button props
     */
    addRule: ButtonProps | undefined;
    /**
     * Remove rule button props
     */
    removeRule: ButtonProps | undefined;
    /**
     * Apply button props
     */
    apply: ButtonProps | undefined;
    /**
     * Apply button props
     */
    clear: ButtonProps | undefined;
}
/**
 * Custom table filter inline button props options.
 */
export interface TableFilterButtonInlinePropsOptions {
    /**
     * Apply button props
     */
    clear: ButtonProps | undefined;
}
/**
 * Custom table filter buttons' props options.
 */
export interface TableFilterButtonPropsOptions {
    /**
     * Filter button props
     */
    filter: ButtonProps | undefined;
    /**
     * Inline filter buttons' options
     */
    inline: TableFilterButtonInlinePropsOptions | undefined;
    /**
     * Popover filter buttons' options
     */
    popover: TableFilterButtonPopoverPropsOptions | undefined;
}
/**
 * Custom CSV export options.
 */
export interface ExportCSVOptions {
    /**
     * Boolean value determining whether to export all selected values.
     */
    selectionOnly?: boolean;
    /**
     * Boolean value determining whether to export all values.
     */
    allValues?: boolean;
}
/**
 * Context of the templates that receive the columns: header, headergrouped, footer, footergrouped and colgroup.
 * @group Interface
 */
export interface TableColumnsTemplateContext {
    /**
     * Columns of the table, the value of the columns property.
     */
    $implicit: any[] | undefined;
}

/**
 * Context of the body and frozenbody templates, rendered once per row.
 * @group Interface
 */
export interface TableBodyTemplateContext<T = any> {
    /**
     * Data of the row.
     */
    $implicit: T;
    /**
     * Index of the row in the whole data set, including the rows of the previous pages.
     */
    rowIndex: number;
    /**
     * Columns of the table.
     */
    columns: any[] | undefined;
    /**
     * Whether the row is being edited, with editMode set to row.
     */
    editing: boolean;
    /**
     * Whether the row belongs to the frozen part of the table.
     */
    frozen: boolean;
    /**
     * Whether the row is expanded. Only passed when an expandedrow template is defined.
     */
    expanded?: boolean;
    /**
     * Whether this row starts a group. Only passed with rowGroupMode set to rowspan.
     */
    rowgroup?: boolean;
    /**
     * Number of rows of the group this row starts. Only passed with rowGroupMode set to rowspan.
     */
    rowspan?: number;
}

/**
 * Context of the groupheader and groupfooter templates, with rowGroupMode set to subheader.
 * @group Interface
 */
export interface TableRowGroupTemplateContext<T = any> {
    /**
     * Data of the first row of the group for a header, of the last row for a footer.
     */
    $implicit: T;
    /**
     * Index of that row in the whole data set.
     */
    rowIndex: number;
    /**
     * Columns of the table.
     */
    columns: any[] | undefined;
    /**
     * Whether that row is being edited, with editMode set to row.
     */
    editing: boolean;
    /**
     * Whether the group belongs to the frozen part of the table.
     */
    frozen: boolean;
    /**
     * Whether that row is expanded. Only passed when an expandedrow template is defined.
     */
    expanded?: boolean;
}

/**
 * Context of the expandedrow and frozenexpandedrow templates.
 * @group Interface
 */
export interface TableExpandedRowTemplateContext<T = any> {
    /**
     * Data of the expanded row.
     */
    $implicit: T;
    /**
     * Index of the row in the whole data set.
     */
    rowIndex: number;
    /**
     * Columns of the table.
     */
    columns: any[] | undefined;
    /**
     * Whether the row belongs to the frozen part of the table.
     */
    frozen: boolean;
}

/**
 * Context of the loadingbody template. While the table is loading, the template is rendered once with the columns as $implicit.
 * With lazy virtual scrolling, it is also rendered for each row not loaded yet, with the same context as the body template and an undefined $implicit.
 * @group Interface
 */
export interface TableLoadingBodyTemplateContext {
    /**
     * Columns while the table is loading, undefined for a row not loaded yet.
     */
    $implicit: any;
    /**
     * Whether the rows belong to the frozen part of the table.
     */
    frozen: boolean;
    /**
     * Index of the row not loaded yet.
     */
    rowIndex?: number;
    /**
     * Columns of the table, for a row not loaded yet.
     */
    columns?: any[];
    /**
     * Always false for a row not loaded yet.
     */
    editing?: boolean;
    /**
     * Whether the row is expanded.
     */
    expanded?: boolean;
    /**
     * Whether this row starts a group, with rowGroupMode set to rowspan.
     */
    rowgroup?: boolean;
    /**
     * Size of the group, with rowGroupMode set to rowspan.
     */
    rowspan?: number;
}

/**
 * Context of the emptymessage template.
 * @group Interface
 */
export interface TableEmptyMessageTemplateContext {
    /**
     * Columns of the table.
     */
    $implicit: any[] | undefined;
    /**
     * Whether the message is rendered in the frozen part of the table.
     */
    frozen: boolean;
}

/**
 * Context of the sorticon template.
 * @group Interface
 */
export interface TableSortIconTemplateContext {
    /**
     * Sort order of the column: 1 ascending, -1 descending, 0 unsorted.
     */
    $implicit: number;
}

/**
 * Context of the checkboxicon and headercheckboxicon templates.
 * @group Interface
 */
export interface TableCheckboxIconTemplateContext {
    /**
     * Whether the checkbox is checked.
     */
    $implicit: boolean;
}

/**
 * Context of the header and footer templates of a column filter.
 * @group Interface
 */
export interface ColumnFilterFieldTemplateContext {
    /**
     * Field of the column.
     */
    $implicit: string | undefined;
}

/**
 * Context of the filter template of a column filter.
 * @group Interface
 */
export interface ColumnFilterTemplateContext {
    /**
     * Current value of the filter constraint.
     */
    $implicit: any;
    /**
     * Applies a new value to the filter: call it with the value.
     */
    filterCallback: (value: any) => void;
    /**
     * Type of the filter: text, numeric, date or boolean.
     */
    type: string | undefined;
    /**
     * Field of the column.
     */
    field: string | undefined;
    /**
     * Filter constraint being edited.
     */
    filterConstraint: FilterMetadata | undefined;
    /**
     * Placeholder of the filter.
     */
    placeholder: string | undefined;
    /**
     * Minimum fraction digits of a numeric filter.
     */
    minFractionDigits: number | undefined;
    /**
     * Maximum fraction digits of a numeric filter.
     */
    maxFractionDigits: number | undefined;
    /**
     * Prefix of a numeric filter.
     */
    prefix: string | undefined;
    /**
     * Suffix of a numeric filter.
     */
    suffix: string | undefined;
    /**
     * Locale of a numeric filter.
     */
    locale: string | undefined;
    /**
     * Locale matching algorithm of a numeric filter.
     */
    localeMatcher: any;
    /**
     * Currency of a numeric filter.
     */
    currency: string | undefined;
    /**
     * Currency display of a numeric filter.
     */
    currencyDisplay: string | undefined;
    /**
     * Whether a numeric filter uses grouping separators.
     */
    useGrouping: boolean;
    /**
     * Whether a numeric filter shows buttons.
     */
    showButtons: boolean;
}

/**
 * Context of the filtericon template of a column filter.
 * @group Interface
 */
export interface ColumnFilterIconTemplateContext {
    /**
     * Whether the column has an active filter.
     */
    hasFilter: boolean;
}

/**
 * Defines valid templates in Table.
 * @group Templates
 */
export interface TableTemplates {
    /**
     * Custom caption, rendered above the table.
     */
    caption(): TemplateRef<void>;
    /**
     * Custom header rows, rendered in the thead.
     * @param {Object} context - header template context.
     */
    header(context: TableColumnsTemplateContext): TemplateRef<TableColumnsTemplateContext>;
    /**
     * Custom grouped header rows, used in place of the header template.
     * @param {Object} context - headergrouped template context.
     */
    headergrouped(context: TableColumnsTemplateContext): TemplateRef<TableColumnsTemplateContext>;
    /**
     * Custom row, rendered for each row of data.
     * @param {Object} context - body template context.
     */
    body(context: TableBodyTemplateContext): TemplateRef<TableBodyTemplateContext>;
    /**
     * Custom content while the table is loading, and for each row not loaded yet with lazy virtual scrolling.
     * @param {Object} context - loadingbody template context.
     */
    loadingbody(context: TableLoadingBodyTemplateContext): TemplateRef<TableLoadingBodyTemplateContext>;
    /**
     * Custom footer rows, rendered in the tfoot.
     * @param {Object} context - footer template context.
     */
    footer(context: TableColumnsTemplateContext): TemplateRef<TableColumnsTemplateContext>;
    /**
     * Custom grouped footer rows, used in place of the footer template.
     * @param {Object} context - footergrouped template context.
     */
    footergrouped(context: TableColumnsTemplateContext): TemplateRef<TableColumnsTemplateContext>;
    /**
     * Custom colgroup element.
     * @param {Object} context - colgroup template context.
     */
    colgroup(context: TableColumnsTemplateContext): TemplateRef<TableColumnsTemplateContext>;
    /**
     * Custom summary, rendered below the table.
     */
    summary(): TemplateRef<void>;
    /**
     * Custom content of an expanded row.
     * @param {Object} context - expandedrow template context.
     */
    expandedrow(context: TableExpandedRowTemplateContext): TemplateRef<TableExpandedRowTemplateContext>;
    /**
     * Custom row group header, with rowGroupMode set to subheader.
     * @param {Object} context - groupheader template context.
     */
    groupheader(context: TableRowGroupTemplateContext): TemplateRef<TableRowGroupTemplateContext>;
    /**
     * Custom row group footer, with rowGroupMode set to subheader.
     * @param {Object} context - groupfooter template context.
     */
    groupfooter(context: TableRowGroupTemplateContext): TemplateRef<TableRowGroupTemplateContext>;
    /**
     * Custom row of the frozen rows.
     * @param {Object} context - frozenbody template context.
     */
    frozenbody(context: TableBodyTemplateContext): TemplateRef<TableBodyTemplateContext>;
    /**
     * Custom content of an expanded frozen row.
     * @param {Object} context - frozenexpandedrow template context.
     */
    frozenexpandedrow(context: TableExpandedRowTemplateContext): TemplateRef<TableExpandedRowTemplateContext>;
    /**
     * Custom content when there is no data.
     * @param {Object} context - emptymessage template context.
     */
    emptymessage(context: TableEmptyMessageTemplateContext): TemplateRef<TableEmptyMessageTemplateContext>;
    /**
     * Custom content on the left of the paginator.
     * @param {Object} context - paginatorleft template context.
     */
    paginatorleft(context: PaginatorTemplateContext): TemplateRef<PaginatorTemplateContext>;
    /**
     * Custom content on the right of the paginator.
     * @param {Object} context - paginatorright template context.
     */
    paginatorright(context: PaginatorTemplateContext): TemplateRef<PaginatorTemplateContext>;
    /**
     * Custom item of the rows per page dropdown of the paginator.
     * @param {Object} context - paginatordropdownitem template context.
     */
    paginatordropdownitem(context: PaginatorDropdownItemTemplateContext): TemplateRef<PaginatorDropdownItemTemplateContext>;
    /**
     * Custom loading icon.
     */
    loadingicon(): TemplateRef<void>;
    /**
     * Custom icon of the upper column reorder indicator.
     */
    reorderindicatorupicon(): TemplateRef<void>;
    /**
     * Custom icon of the lower column reorder indicator.
     */
    reorderindicatordownicon(): TemplateRef<void>;
    /**
     * Custom sort icon of a sortable column.
     * @param {Object} context - sorticon template context.
     */
    sorticon(context: TableSortIconTemplateContext): TemplateRef<TableSortIconTemplateContext>;
    /**
     * Custom icon of the row checkboxes.
     * @param {Object} context - checkboxicon template context.
     */
    checkboxicon(context: TableCheckboxIconTemplateContext): TemplateRef<TableCheckboxIconTemplateContext>;
    /**
     * Custom icon of the header checkbox.
     * @param {Object} context - headercheckboxicon template context.
     */
    headercheckboxicon(context: TableCheckboxIconTemplateContext): TemplateRef<TableCheckboxIconTemplateContext>;
    /**
     * Custom dropdown icon of the paginator.
     */
    paginatordropdownicon(): TemplateRef<void>;
    /**
     * Custom icon of the first page button of the paginator.
     */
    paginatorfirstpagelinkicon(): TemplateRef<void>;
    /**
     * Custom icon of the last page button of the paginator.
     */
    paginatorlastpagelinkicon(): TemplateRef<void>;
    /**
     * Custom icon of the previous page button of the paginator.
     */
    paginatorpreviouspagelinkicon(): TemplateRef<void>;
    /**
     * Custom icon of the next page button of the paginator.
     */
    paginatornextpagelinkicon(): TemplateRef<void>;
}
