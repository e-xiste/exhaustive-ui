import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    Directive,
    effect,
    ElementRef,
    HostListener,
    inject,
    Injectable,
    InjectionToken,
    input,
    linkedSignal,
    model,
    NgModule,
    NgZone,
    numberAttribute,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    viewChild,
    contentChildren,
    contentChild,
    output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MotionEvent, MotionOptions } from '@exhaustive-ui/motion';
import { absolutePosition, addStyle, appendChild, find, findSingle, getAttribute, isClickable, setAttribute } from '@exhaustive-ui/utils';
import { BlockableUI, FilterMatchMode, FilterMetadata, FilterOperator, FilterService, LazyLoadMeta, OverlayService, PrimeTemplate, ScrollerOptions, SelectItem, SharedModule, SortMeta, TableState, TranslationKeys } from '@exhaustive-ui/core/api';
import { BadgeModule } from '@exhaustive-ui/core/badge';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { Button, ButtonModule } from '@exhaustive-ui/core/button';
import { CheckboxChangeEvent, CheckboxModule } from '@exhaustive-ui/core/checkbox';
import { DatePickerModule } from '@exhaustive-ui/core/datepicker';
import { ConnectedOverlayScrollHandler, DomHandler } from '@exhaustive-ui/core/dom';
import { ArrowDownIcon } from '@exhaustive-ui/core/icons/arrowdown';
import { ArrowUpIcon } from '@exhaustive-ui/core/icons/arrowup';
import { FilterIcon } from '@exhaustive-ui/core/icons/filter';
import { FilterFillIcon } from '@exhaustive-ui/core/icons/filterfill';
import { FilterSlashIcon } from '@exhaustive-ui/core/icons/filterslash';
import { PlusIcon } from '@exhaustive-ui/core/icons/plus';
import { SortAltIcon } from '@exhaustive-ui/core/icons/sortalt';
import { SortAmountDownIcon } from '@exhaustive-ui/core/icons/sortamountdown';
import { SortAmountUpAltIcon } from '@exhaustive-ui/core/icons/sortamountupalt';
import { SpinnerIcon } from '@exhaustive-ui/core/icons/spinner';
import { TrashIcon } from '@exhaustive-ui/core/icons/trash';
import { InputNumberModule } from '@exhaustive-ui/core/inputnumber';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { MotionModule } from '@exhaustive-ui/core/motion';
import { PaginatorModule } from '@exhaustive-ui/core/paginator';
import type { PaginatorDropdownItemTemplateContext, PaginatorTemplateContext } from '@exhaustive-ui/core/types/paginator';
import { RadioButton, RadioButtonClickEvent, RadioButtonModule } from '@exhaustive-ui/core/radiobutton';
import { Scroller, ScrollerModule } from '@exhaustive-ui/core/scroller';
import { SelectModule } from '@exhaustive-ui/core/select';
import { SelectButtonModule } from '@exhaustive-ui/core/selectbutton';
import { Nullable, VoidListener } from '@exhaustive-ui/core/ts-helpers';
import {
    ColumnFilterFieldTemplateContext,
    ColumnFilterIconTemplateContext,
    ColumnFilterPassThrough,
    ColumnFilterTemplateContext,
    ExportCSVOptions,
    TableBodyTemplateContext,
    TableCheckboxIconTemplateContext,
    TableColResizeEvent,
    TableColumnReorderEvent,
    TableColumnsTemplateContext,
    TableContextMenuSelectEvent,
    TableEditCancelEvent,
    TableEditCompleteEvent,
    TableEditInitEvent,
    TableEmptyMessageTemplateContext,
    TableExpandedRowTemplateContext,
    TableFilterButtonPropsOptions,
    TableFilterEvent,
    TableHeaderCheckboxToggleEvent,
    TableLazyLoadEvent,
    TableLoadingBodyTemplateContext,
    TableRowGroupTemplateContext,
    TablePageEvent,
    TablePassThrough,
    TableRowCollapseEvent,
    TableRowExpandEvent,
    TableRowReorderEvent,
    TableRowSelectEvent,
    TableRowUnSelectEvent,
    TableSelectAllChangeEvent,
    TableSortIconTemplateContext
} from '@exhaustive-ui/core/types/table';
import { ObjectUtils, UniqueComponentId, ZIndexUtils } from '@exhaustive-ui/core/utils';
import { Subject, Subscription } from 'rxjs';
import { TableStyle } from './style/tablestyle';

const TABLE_INSTANCE = new InjectionToken<Table>('TABLE_INSTANCE');

@Injectable()
export class TableService {
    private sortSource = new Subject<SortMeta | SortMeta[] | null>();
    private selectionSource = new Subject();
    private contextMenuSource = new Subject<any>();
    private valueSource = new Subject<any>();
    private columnsSource = new Subject();

    sortSource$ = this.sortSource.asObservable();
    selectionSource$ = this.selectionSource.asObservable();
    contextMenuSource$ = this.contextMenuSource.asObservable();
    valueSource$ = this.valueSource.asObservable();
    columnsSource$ = this.columnsSource.asObservable();

    onSort(sortMeta: SortMeta | SortMeta[] | null) {
        this.sortSource.next(sortMeta);
    }

    onSelectionChange() {
        this.selectionSource.next(null);
    }

    onContextMenu(data: any) {
        this.contextMenuSource.next(data);
    }

    onValueChange(value: any) {
        this.valueSource.next(value);
    }

    onColumnsChange(columns: any[]) {
        this.columnsSource.next(columns);
    }
}
/**
 * Table displays data in tabular format.
 * @group Components
 */
@Component({
    selector: 'p-table',
    standalone: false,
    template: `
        @if (loading() && showLoader()) {
            <div [class]="cx('mask')" [pBind]="ptm('mask')" animate.enter="p-overlay-mask-enter-active" animate.leave="p-overlay-mask-leave-active">
                @if (loadingIcon()) {
                    <i [class]="cn(cx('loadingIcon'), loadingIcon())" [pBind]="ptm('loadingIcon')"></i>
                }
                @if (!loadingIcon()) {
                    @if (!loadingIconTemplate() && !_loadingIconTemplate()) {
                        <svg data-p-icon="spinner" [spin]="true" [class]="cx('loadingIcon')" [pBind]="ptm('loadingIcon')" />
                    }
                    @if (loadingIconTemplate() || _loadingIconTemplate()) {
                        <span [class]="cx('loadingIcon')" [pBind]="ptm('loadingIcon')">
                            <ng-template *ngTemplateOutlet="loadingIconTemplate() || _loadingIconTemplate()"></ng-template>
                        </span>
                    }
                }
            </div>
        }
        @if (captionTemplate() || _captionTemplate()) {
            <div [class]="cx('header')" [pBind]="ptm('header')" [attr.id]="id + '-caption'">
                <ng-container *ngTemplateOutlet="captionTemplate() || _captionTemplate()"></ng-container>
            </div>
        }
        @if (paginator() && (paginatorPosition() === 'top' || paginatorPosition() == 'both')) {
            <p-paginator
                [rows]="rows()"
                [first]="first()"
                [totalRecords]="_totalRecords()"
                [pageLinkSize]="pageLinks()"
                [alwaysShow]="alwaysShowPaginator()"
                (onPageChange)="onPageChange($event)"
                [rowsPerPageOptions]="rowsPerPageOptions()"
                [templateLeft]="paginatorLeftTemplate() || _paginatorLeftTemplate()"
                [templateRight]="paginatorRightTemplate() || _paginatorRightTemplate()"
                [appendTo]="paginatorDropdownAppendTo()"
                [dropdownScrollHeight]="paginatorDropdownScrollHeight()"
                [currentPageReportTemplate]="currentPageReportTemplate()"
                [showFirstLastIcon]="showFirstLastIcon()"
                [dropdownItemTemplate]="paginatorDropdownItemTemplate() || _paginatorDropdownItemTemplate()"
                [showCurrentPageReport]="showCurrentPageReport()"
                [showJumpToPageDropdown]="showJumpToPageDropdown()"
                [showJumpToPageInput]="showJumpToPageInput()"
                [showPageLinks]="showPageLinks()"
                [class]="cn(cx('pcPaginator', { position: 'top' }), paginatorStyleClass())"
                [locale]="paginatorLocale()"
                [pt]="ptm('pcPaginator')"
                [unstyled]="unstyled()"
            >
                @if (paginatorDropdownIconTemplate() || _paginatorDropdownIconTemplate()) {
                    <ng-template pTemplate="dropdownicon">
                        <ng-container *ngTemplateOutlet="paginatorDropdownIconTemplate() || _paginatorDropdownIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if (paginatorFirstPageLinkIconTemplate() || _paginatorFirstPageLinkIconTemplate()) {
                    <ng-template pTemplate="firstpagelinkicon">
                        <ng-container *ngTemplateOutlet="paginatorFirstPageLinkIconTemplate() || _paginatorFirstPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if (paginatorPreviousPageLinkIconTemplate() || _paginatorPreviousPageLinkIconTemplate()) {
                    <ng-template pTemplate="previouspagelinkicon">
                        <ng-container *ngTemplateOutlet="paginatorPreviousPageLinkIconTemplate() || _paginatorPreviousPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if (paginatorLastPageLinkIconTemplate() || _paginatorLastPageLinkIconTemplate()) {
                    <ng-template pTemplate="lastpagelinkicon">
                        <ng-container *ngTemplateOutlet="paginatorLastPageLinkIconTemplate() || _paginatorLastPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if (paginatorNextPageLinkIconTemplate() || _paginatorNextPageLinkIconTemplate()) {
                    <ng-template pTemplate="nextpagelinkicon">
                        <ng-container *ngTemplateOutlet="paginatorNextPageLinkIconTemplate() || _paginatorNextPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
            </p-paginator>
        }

        <div #wrapper [class]="cx('tableContainer')" [ngStyle]="sx('tableContainer')" [pBind]="ptm('tableContainer')" [attr.data-p]="dataP()">
            @if (virtualScroll()) {
                <p-scroller
                    #scroller
                    [items]="processedData()"
                    [columns]="_columns()"
                    [style]="{
                        height: scrollHeight() !== 'flex' ? scrollHeight() : undefined
                    }"
                    [scrollHeight]="scrollHeight() !== 'flex' ? scrollHeight() : '100%'"
                    [itemSize]="virtualScrollItemSize()"
                    [step]="rows()"
                    [delay]="lazy() ? virtualScrollDelay() : 0"
                    [inline]="true"
                    [autoSize]="true"
                    [lazy]="lazy()"
                    (onLazyLoad)="onLazyItemLoad($event)"
                    [loaderDisabled]="true"
                    [showSpacer]="false"
                    [showLoader]="loadingBodyTemplate() || _loadingBodyTemplate()"
                    [options]="virtualScrollOptions()"
                    [pt]="ptm('virtualScroller')"
                >
                    <ng-template #content let-items let-scrollerOptions="options">
                        <ng-container
                            *ngTemplateOutlet="
                                buildInTable;
                                context: {
                                    $implicit: items,
                                    options: scrollerOptions
                                }
                            "
                        ></ng-container>
                    </ng-template>
                </p-scroller>
            }
            @if (!virtualScroll()) {
                <ng-container
                    *ngTemplateOutlet="
                        buildInTable;
                        context: {
                            $implicit: processedData(),
                            options: { columns: _columns() }
                        }
                    "
                ></ng-container>
            }

            <ng-template #buildInTable let-items let-scrollerOptions="options">
                <table #table role="table" [class]="cn(cx('table'), tableStyleClass())" [pBind]="ptm('table')" [style]="tableStyle()" [attr.id]="id + '-table'" [attr.aria-labelledby]="captionTemplate() || _captionTemplate() ? id + '-caption' : null">
                    <ng-container *ngTemplateOutlet="colGroupTemplate() || _colGroupTemplate(); context: { $implicit: scrollerOptions.columns }"></ng-container>
                    <thead role="rowgroup" #thead [class]="cx('thead')" [ngStyle]="sx('thead')" [pBind]="ptm('thead')">
                        <ng-container
                            *ngTemplateOutlet="
                                headerGroupedTemplate() || _headerGroupedTemplate() || headerTemplate() || _headerTemplate();
                                context: {
                                    $implicit: scrollerOptions.columns
                                }
                            "
                        ></ng-container>
                    </thead>
                    @if (frozenValue() || frozenBodyTemplate() || _frozenBodyTemplate()) {
                        <tbody
                            role="rowgroup"
                            [class]="cx('tbody', { frozen: true })"
                            [pBind]="ptm('tbody')"
                            [value]="frozenValue()"
                            [frozenRows]="true"
                            [pTableBody]="scrollerOptions.columns"
                            [pTableBodyTemplate]="frozenBodyTemplate() || _frozenBodyTemplate()"
                            [unstyled]="unstyled()"
                            [frozen]="true"
                            [attr.data-p-virtualscroll]="virtualScroll()"
                        ></tbody>
                    }
                    <tbody
                        role="rowgroup"
                        [class]="cx('tbody', scrollerOptions.contentStyleClass)"
                        [pBind]="ptm('tbody')"
                        [style]="scrollerOptions.contentStyle"
                        [value]="dataToRender(scrollerOptions.rows)"
                        [pTableBody]="scrollerOptions.columns"
                        [pTableBodyTemplate]="bodyTemplate() || _bodyTemplate()"
                        [scrollerOptions]="scrollerOptions"
                        [unstyled]="unstyled()"
                        [attr.data-p-virtualscroll]="virtualScroll()"
                    ></tbody>
                    @if (scrollerOptions.spacerStyle) {
                        <tbody
                            role="rowgroup"
                            [style]="'height: calc(' + scrollerOptions.spacerStyle.height + ' - ' + scrollerOptions.rows.length * scrollerOptions.itemSize + 'px);'"
                            [class]="cx('virtualScrollerSpacer')"
                            [pBind]="ptm('virtualScrollerSpacer')"
                        ></tbody>
                    }
                    @if (footerGroupedTemplate() || footerTemplate() || _footerTemplate() || _footerGroupedTemplate()) {
                        <tfoot role="rowgroup" #tfoot [ngClass]="cx('footer')" [ngStyle]="sx('tfoot')" [pBind]="ptm('tfoot')">
                            <ng-container
                                *ngTemplateOutlet="
                                    footerGroupedTemplate() || footerTemplate() || _footerTemplate() || _footerGroupedTemplate();
                                    context: {
                                        $implicit: scrollerOptions.columns
                                    }
                                "
                            ></ng-container>
                        </tfoot>
                    }
                </table>
            </ng-template>
        </div>

        @if (paginator() && (paginatorPosition() === 'bottom' || paginatorPosition() == 'both')) {
            <p-paginator
                [rows]="rows()"
                [first]="first()"
                [totalRecords]="_totalRecords()"
                [pageLinkSize]="pageLinks()"
                [alwaysShow]="alwaysShowPaginator()"
                (onPageChange)="onPageChange($event)"
                [rowsPerPageOptions]="rowsPerPageOptions()"
                [templateLeft]="paginatorLeftTemplate() || _paginatorLeftTemplate()"
                [templateRight]="paginatorRightTemplate() || _paginatorRightTemplate()"
                [appendTo]="paginatorDropdownAppendTo()"
                [dropdownScrollHeight]="paginatorDropdownScrollHeight()"
                [currentPageReportTemplate]="currentPageReportTemplate()"
                [showFirstLastIcon]="showFirstLastIcon()"
                [dropdownItemTemplate]="paginatorDropdownItemTemplate() || _paginatorDropdownItemTemplate()"
                [showCurrentPageReport]="showCurrentPageReport()"
                [showJumpToPageDropdown]="showJumpToPageDropdown()"
                [showJumpToPageInput]="showJumpToPageInput()"
                [showPageLinks]="showPageLinks()"
                [class]="cn(cx('pcPaginator', { position: 'bottom' }), paginatorStyleClass())"
                [locale]="paginatorLocale()"
                [pt]="ptm('pcPaginator')"
                [unstyled]="unstyled()"
            >
                @if (paginatorDropdownIconTemplate() || _paginatorDropdownIconTemplate()) {
                    <ng-template pTemplate="dropdownicon">
                        <ng-container *ngTemplateOutlet="paginatorDropdownIconTemplate() || _paginatorDropdownIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if (paginatorFirstPageLinkIconTemplate() || _paginatorFirstPageLinkIconTemplate()) {
                    <ng-template pTemplate="firstpagelinkicon">
                        <ng-container *ngTemplateOutlet="paginatorFirstPageLinkIconTemplate() || _paginatorFirstPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if (paginatorPreviousPageLinkIconTemplate() || _paginatorPreviousPageLinkIconTemplate()) {
                    <ng-template pTemplate="previouspagelinkicon">
                        <ng-container *ngTemplateOutlet="paginatorPreviousPageLinkIconTemplate() || _paginatorPreviousPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if (paginatorLastPageLinkIconTemplate() || _paginatorLastPageLinkIconTemplate()) {
                    <ng-template pTemplate="lastpagelinkicon">
                        <ng-container *ngTemplateOutlet="paginatorLastPageLinkIconTemplate() || _paginatorLastPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
                @if (paginatorNextPageLinkIconTemplate() || _paginatorNextPageLinkIconTemplate()) {
                    <ng-template pTemplate="nextpagelinkicon">
                        <ng-container *ngTemplateOutlet="paginatorNextPageLinkIconTemplate() || _paginatorNextPageLinkIconTemplate()"></ng-container>
                    </ng-template>
                }
            </p-paginator>
        }

        @if (summaryTemplate() || _summaryTemplate()) {
            <div [ngClass]="cx('footer')" [pBind]="ptm('footer')">
                <ng-container *ngTemplateOutlet="summaryTemplate() || _summaryTemplate()"></ng-container>
            </div>
        }

        @if (resizableColumns()) {
            <div #resizeHelper [ngClass]="cx('columnResizeIndicator')" [pBind]="ptm('columnResizeIndicator')" [style.display]="'none'"></div>
        }
        <span class="p-hidden-accessible" aria-live="polite" aria-atomic="true" [attr.data-pc-section]="'reorderannouncement'">{{ reorderAnnouncement() }}</span>
        @if (reorderableColumns()) {
            <span #reorderIndicatorUp [ngClass]="cx('rowReorderIndicatorUp')" [pBind]="ptm('rowReorderIndicatorUp')" [style.display]="'none'">
                @if (!reorderIndicatorUpIconTemplate() && !_reorderIndicatorUpIconTemplate()) {
                    <svg data-p-icon="arrow-down" [pBind]="ptm('rowReorderIndicatorUp')['icon']" />
                }
                <ng-template *ngTemplateOutlet="reorderIndicatorUpIconTemplate() || _reorderIndicatorUpIconTemplate()"></ng-template>
            </span>
        }
        @if (reorderableColumns()) {
            <span #reorderIndicatorDown [ngClass]="cx('rowReorderIndicatorDown')" [pBind]="ptm('rowReorderIndicatorDown')" [style.display]="'none'">
                @if (!reorderIndicatorDownIconTemplate() && !_reorderIndicatorDownIconTemplate()) {
                    <svg data-p-icon="arrow-up" [pBind]="ptm('rowReorderIndicatorDown')['icon']" />
                }
                <ng-template *ngTemplateOutlet="reorderIndicatorDownIconTemplate() || _reorderIndicatorDownIconTemplate()"></ng-template>
            </span>
        }
    `,
    providers: [TableService, TableStyle, { provide: TABLE_INSTANCE, useExisting: Table }, { provide: PARENT_INSTANCE, useExisting: Table }],
    changeDetection: ChangeDetectionStrategy.Eager,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[style.height]': 'virtualScrollViewportHeight()',
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class Table<RowData = any> extends BaseComponent<TablePassThrough> implements BlockableUI {
    componentName = 'DataTable';
    /**
     * An array of objects to display as frozen.
     * @group Props
     */
    readonly frozenValue = input<any[] | undefined>();
    /**
     * Inline style of the table.
     * @group Props
     */
    readonly tableStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the table.
     * @group Props
     */
    readonly tableStyleClass = input<string | undefined>();
    /**
     * When specified as true, enables the pagination.
     * @group Props
     */
    readonly paginator = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Number of page links to display in paginator.
     * @group Props
     */
    readonly pageLinks = input<number, unknown>(5, { transform: numberAttribute });
    /**
     * Array of integer/object values to display inside rows per page dropdown of paginator
     * @group Props
     */
    readonly rowsPerPageOptions = input<any[] | undefined>();
    /**
     * Whether to show it even there is only one page.
     * @group Props
     */
    readonly alwaysShowPaginator = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Position of the paginator, options are "top", "bottom" or "both".
     * @group Props
     */
    readonly paginatorPosition = input<'top' | 'bottom' | 'both'>('bottom');
    /**
     * Custom style class for paginator
     * @group Props
     */
    readonly paginatorStyleClass = input<string | undefined>();
    /**
     * Target element to attach the paginator dropdown overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    readonly paginatorDropdownAppendTo = input<HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any>();
    /**
     * Paginator dropdown height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    readonly paginatorDropdownScrollHeight = input<string>('200px');
    /**
     * Template of the current page report element. Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords}
     * @group Props
     */
    readonly currentPageReportTemplate = input<string>('{currentPage} of {totalPages}');
    /**
     * Whether to display current page report.
     * @group Props
     */
    readonly showCurrentPageReport = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether to display a dropdown to navigate to any page.
     * @group Props
     */
    readonly showJumpToPageDropdown = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether to display a input to navigate to any page.
     * @group Props
     */
    readonly showJumpToPageInput = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When enabled, icons are displayed on paginator to go first and last page.
     * @group Props
     */
    readonly showFirstLastIcon = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether to show page links.
     * @group Props
     */
    readonly showPageLinks = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Sort order to use when an unsorted column gets sorted by user interaction.
     * @group Props
     */
    readonly defaultSortOrder = input<number, unknown>(1, { transform: numberAttribute });
    /**
     * Defines whether sorting works on single column or on multiple columns.
     * @group Props
     */
    readonly sortMode = input<'single' | 'multiple'>('single');
    /**
     * When true, resets paginator to first page after sorting. Available only when sortMode is set to single.
     * @group Props
     */
    readonly resetPageOnSort = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Specifies the selection mode, valid values are "single" and "multiple".
     * @group Props
     */
    readonly selectionMode = input<'single' | 'multiple' | undefined | null>();
    /**
     * When enabled with paginator and checkbox selection mode, the select all checkbox in the header will select all rows on the current page.
     * @group Props
     */
    readonly selectionPageOnly = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Selected row with a context menu, supports one or two-way binding.
     * Emits `contextMenuSelectionChange` with the row data on context menu selection change.
     * @group Props
     */
    readonly contextMenuSelection = model<any>();
    /**
     *  Defines the behavior of context menu selection, in "separate" mode context menu updates contextMenuSelection property whereas in joint mode selection property is used instead so that when row selection is enabled, both row selection and context menu selection use the same property.
     * @group Props
     */
    readonly contextMenuSelectionMode = input<string>('separate');
    /**
     * A property to uniquely identify a record in data.
     * @group Props
     */
    readonly dataKey = input<string | undefined>();
    /**
     * Defines whether metaKey should be considered for the selection. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    readonly metaKeySelection = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * Defines if the row is selectable.
     * @group Props
     */
    readonly rowSelectable = input<(row: { data: any; index: number }) => boolean | undefined>();
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity.
     * @group Props
     */
    readonly rowTrackBy = input<Function>((index: number, item: any) => item);
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    readonly lazy = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether to call lazy loading on initialization.
     * @group Props
     */
    readonly lazyLoadOnInit = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Algorithm to define if a row is selected, valid values are "equals" that compares by reference and "deepEquals" that compares all fields.
     * @group Props
     */
    readonly compareSelectionBy = input<'equals' | 'deepEquals'>('deepEquals');
    /**
     * Character to use as the csv separator.
     * @group Props
     */
    readonly csvSeparator = input<string>(',');
    /**
     * Name of the exported file.
     * @group Props
     */
    readonly exportFilename = input<string>('download');
    /**
     * An array of FilterMetadata objects to provide external filters.
     * @group Props
     */
    readonly filters = input<{ [s: string]: FilterMetadata | FilterMetadata[] }>({});
    /**
     * An array of fields as string to use in global filtering.
     * @group Props
     */
    readonly globalFilterFields = input<string[] | undefined>();
    /**
     * Delay in milliseconds before filtering the data.
     * @group Props
     */
    readonly filterDelay = input<number, unknown>(300, { transform: numberAttribute });
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    readonly filterLocale = input<string | undefined>();
    /**
     * Map instance to keep the expanded rows where key of the map is the data key of the row.
     * @group Props
     */
    readonly expandedRowKeys = input<{ [s: string]: boolean }>({});
    /**
     * Map instance to keep the rows being edited where key of the map is the data key of the row.
     * @group Props
     */
    readonly editingRowKeys = input<{ [s: string]: boolean }>({});
    /**
     * Whether multiple rows can be expanded at any time. Valid values are "multiple" and "single".
     * @group Props
     */
    readonly rowExpandMode = input<'multiple' | 'single'>('multiple');
    /**
     * Enables scrollable tables.
     * @group Props
     */
    readonly scrollable = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Type of the row grouping, valid values are "subheader" and "rowspan".
     * @group Props
     */
    readonly rowGroupMode = input<'subheader' | 'rowspan' | undefined>();
    /**
     * Height of the scroll viewport in fixed pixels or the "flex" keyword for a dynamic size.
     * @group Props
     */
    readonly scrollHeight = input<string | undefined>();

    readonly virtualScrollViewportHeight = computed<string | null>(() => {
        const height = this.scrollHeight();
        return this.virtualScroll() && height != null && height !== 'flex' ? height : null;
    });
    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    readonly virtualScroll = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Height of a row to use in calculations of virtual scrolling.
     * @group Props
     */
    readonly virtualScrollItemSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    readonly virtualScrollOptions = input<ScrollerOptions | undefined>();
    /**
     * Threshold in milliseconds to delay lazy loading during scrolling.
     * @group Props
     */
    readonly virtualScrollDelay = input<number, unknown>(250, { transform: numberAttribute });
    /**
     * Local ng-template varilable of a ContextMenu.
     * @group Props
     */
    readonly contextMenu = input<any>();
    /**
     * When enabled, columns can be resized using drag and drop.
     * @group Props
     */
    readonly resizableColumns = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Defines whether the overall table width should change on column resize, valid values are "fit" and "expand".
     * @group Props
     */
    readonly columnResizeMode = input<string>('fit');
    /**
     * When enabled, columns can be reordered using drag and drop.
     * @group Props
     */
    readonly reorderableColumns = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Displays a loader to indicate data load is in progress.
     * @group Props
     */
    readonly loading = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * The icon to show while indicating data load is in progress.
     * @group Props
     */
    readonly loadingIcon = input<string | undefined>();
    /**
     * Whether to show the loading mask when loading property is true.
     * @group Props
     */
    readonly showLoader = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Adds hover effect to rows without the need for selectionMode. Note that tr elements that can be hovered need to have "p-selectable-row" class for rowHover to work.
     * @group Props
     */
    readonly rowHover = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether to use the default sorting or a custom one using sortFunction.
     * @group Props
     */
    readonly customSort = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether to use the initial sort badge or not.
     * @group Props
     */
    readonly showInitialSortBadge = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Export function.
     * @group Props
     */
    readonly exportFunction = input<Function | undefined>();
    /**
     * Custom export header of the column to be exported as CSV.
     * @group Props
     */
    readonly exportHeader = input<string | undefined>();
    /**
     * Unique identifier of a stateful table to use in state storage.
     * @group Props
     */
    readonly stateKey = input<string | undefined>();
    /**
     * Defines where a stateful table keeps its state, valid values are "session" for sessionStorage and "local" for localStorage.
     * @group Props
     */
    readonly stateStorage = input<'session' | 'local'>('session');
    /**
     * Defines the editing mode, valid values are "cell" and "row".
     * @group Props
     */
    readonly editMode = input<'cell' | 'row'>('cell');
    /**
     * Field name to use in row grouping.
     * @group Props
     */
    readonly groupRowsBy = input<any>();
    /**
     * Defines the size of the table.
     * @group Props
     */
    readonly size = input<'small' | 'large' | undefined>();
    /**
     * Whether to show grid lines between cells.
     * @group Props
     */
    readonly showGridlines = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether to display rows with alternating colors.
     * @group Props
     */
    readonly stripedRows = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Order to sort when default row grouping is enabled.
     * @group Props
     */
    readonly groupRowsByOrder = input<number, unknown>(1, { transform: numberAttribute });
    /**
     * Defines the responsive mode, valid options are "stack" and "scroll".
     * @deprecated since v20.0.0, always defaults to scroll, stack mode needs custom implementation
     * @group Props
     */
    readonly responsiveLayout = input<string>('scroll');
    /**
     * The breakpoint to define the maximum width boundary when using stack responsive layout.
     * @group Props
     */
    readonly breakpoint = input<string>('960px');
    /**
     * Locale to be used in paginator formatting.
     * @group Props
     */
    readonly paginatorLocale = input<string | undefined>();
    /**
     * An array of objects to display.
     * @group Props
     */
    readonly value = input<RowData[]>([]);
    /**
     * An array of objects to represent dynamic columns.
     * @group Props
     */
    readonly columns = input<any[] | undefined>();
    /**
     * Index of the first row to be displayed, supports one or two-way binding.
     * Emits `firstChange` with the first element on pagination.
     * @group Props
     */
    readonly first = model<number | null | undefined>(0);
    /**
     * Number of rows to display per page, supports one or two-way binding.
     * Emits `rowsChange` with the row count on rows change.
     * @group Props
     */
    readonly rows = model<number | undefined>();
    /**
     * Number of total records, defaults to length of value when not defined.
     * @group Props
     */
    readonly totalRecords = input<number>(0);

    /**
     * Name of the field to sort data by default.
     * @group Props
     */
    readonly sortField = input<string | undefined | null>();
    /**
     * Order to sort when default sorting is enabled.
     * @group Props
     */
    readonly sortOrder = input<number>(1);
    /**
     * An array of SortMeta objects to sort the data by default in multiple sort mode.
     * @group Props
     */
    readonly multiSortMeta = input<SortMeta[] | undefined | null>();
    /**
     * Selected row in single mode or an array of values in multiple mode, supports one or two-way binding.
     * Emits `selectionChange` with the selected data on selection change.
     * @group Props
     */
    readonly selection = model<any>();
    /**
     * Whether all data is selected.
     * @group Props
     */
    readonly selectAll = input<boolean | null>(null);
    /**
     * Emits when the all of the items selected or unselected.
     * @param {TableSelectAllChangeEvent} event - custom  all selection change event.
     * @group Emits
     */
    readonly onSelectAllChange = output<TableSelectAllChangeEvent>();
    /**
     * Callback to invoke when a row is selected.
     * @param {TableRowSelectEvent} event - custom select event.
     * @group Emits
     */
    readonly onRowSelect = output<TableRowSelectEvent<RowData>>();
    /**
     * Callback to invoke when a row is unselected.
     * @param {TableRowUnSelectEvent} event - custom unselect event.
     * @group Emits
     */
    readonly onRowUnselect = output<TableRowUnSelectEvent<RowData>>();
    /**
     * Callback to invoke when pagination occurs.
     * @param {TablePageEvent} event - custom pagination event.
     * @group Emits
     */
    readonly onPage = output<TablePageEvent>();
    /**
     * Callback to invoke when a column gets sorted.
     * @param {Object} object - sort meta.
     * @group Emits
     */
    readonly onSort = output<
        | {
              multisortmeta: SortMeta[];
          }
        | any
    >();
    /**
     * Callback to invoke when data is filtered.
     * @param {TableFilterEvent} event - custom filtering event.
     * @group Emits
     */
    readonly onFilter = output<TableFilterEvent>();
    /**
     * Callback to invoke when paging, sorting or filtering happens in lazy mode.
     * @param {TableLazyLoadEvent} event - custom lazy loading event.
     * @group Emits
     */
    readonly onLazyLoad = output<TableLazyLoadEvent>();
    /**
     * Callback to invoke when a row is expanded.
     * @param {TableRowExpandEvent} event - custom row expand event.
     * @group Emits
     */
    readonly onRowExpand = output<TableRowExpandEvent<RowData>>();
    /**
     * Callback to invoke when a row is collapsed.
     * @param {TableRowCollapseEvent} event - custom row collapse event.
     * @group Emits
     */
    readonly onRowCollapse = output<TableRowCollapseEvent>();
    /**
     * Callback to invoke when a row is selected with right click.
     * @param {TableContextMenuSelectEvent} event - custom context menu select event.
     * @group Emits
     */
    readonly onContextMenuSelect = output<TableContextMenuSelectEvent<RowData>>();
    /**
     * Callback to invoke when a column is resized.
     * @param {TableColResizeEvent} event - custom column resize event.
     * @group Emits
     */
    readonly onColResize = output<TableColResizeEvent>();
    /**
     * Callback to invoke when a column is reordered.
     * @param {TableColumnReorderEvent} event - custom column reorder event.
     * @group Emits
     */
    readonly onColReorder = output<TableColumnReorderEvent>();
    /**
     * Callback to invoke when a row is reordered.
     * @param {TableRowReorderEvent} event - custom row reorder event.
     * @group Emits
     */
    readonly onRowReorder = output<TableRowReorderEvent>();
    /**
     * Callback to invoke when a cell switches to edit mode.
     * @param {TableEditInitEvent} event - custom edit init event.
     * @group Emits
     */
    readonly onEditInit = output<TableEditInitEvent>();
    /**
     * Callback to invoke when cell edit is completed.
     * @param {TableEditCompleteEvent} event - custom edit complete event.
     * @group Emits
     */
    readonly onEditComplete = output<TableEditCompleteEvent>();
    /**
     * Callback to invoke when cell edit is cancelled with escape key.
     * @param {TableEditCancelEvent} event - custom edit cancel event.
     * @group Emits
     */
    readonly onEditCancel = output<TableEditCancelEvent>();
    /**
     * Callback to invoke when state of header checkbox changes.
     * @param {TableHeaderCheckboxToggleEvent} event - custom header checkbox event.
     * @group Emits
     */
    readonly onHeaderCheckboxToggle = output<TableHeaderCheckboxToggleEvent>();
    /**
     * A function to implement custom sorting, refer to sorting section for details.
     * @param {any} any - sort meta.
     * @group Emits
     */
    readonly sortFunction = output<any>();
    /**
     * Callback to invoke table state is saved.
     * @param {TableState} object - table state.
     * @group Emits
     */
    readonly onStateSave = output<TableState>();
    /**
     * Callback to invoke table state is restored.
     * @param {TableState} object - table state.
     * @group Emits
     */
    readonly onStateRestore = output<TableState>();

    readonly resizeHelperViewChild = viewChild<Nullable<ElementRef>>('resizeHelper');

    readonly reorderIndicatorUpViewChild = viewChild<Nullable<ElementRef>>('reorderIndicatorUp');

    readonly reorderIndicatorDownViewChild = viewChild<Nullable<ElementRef>>('reorderIndicatorDown');

    readonly wrapperViewChild = viewChild.required<ElementRef>('wrapper');

    readonly tableViewChild = viewChild<Nullable<ElementRef>>('table');

    readonly scroller = viewChild<Nullable<Scroller>>('scroller');

    readonly _templates = contentChildren(PrimeTemplate);

    _value = linkedSignal<RowData[]>(() => this.value());

    _columns = linkedSignal<any[] | undefined>(() => this.columns());

    _totalRecords = linkedSignal<number>(() => {
        const totalRecords = this.totalRecords();
        const value = this.value();

        if (this.lazy()) {
            return totalRecords;
        }

        return totalRecords === 0 && value ? value.length : (totalRecords ?? 0);
    });

    _filters = linkedSignal<{ [s: string]: FilterMetadata | FilterMetadata[] }>(() => this.filters());

    _expandedRowKeys = linkedSignal<{ [s: string]: boolean }>(() => this.expandedRowKeys());

    filteredValue = signal<any[] | undefined | null>(undefined);

    /**
     * Custom header rows, rendered in the thead.
     * @param context - header template context.
     * @group Templates
     */
    readonly _headerTemplate = contentChild<TemplateRef<TableColumnsTemplateContext>>('header', { descendants: false });
    readonly headerTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    /**
     * Custom grouped header rows, used in place of the header template.
     * @param context - headergrouped template context.
     * @group Templates
     */
    readonly _headerGroupedTemplate = contentChild<TemplateRef<TableColumnsTemplateContext>>('headergrouped', { descendants: false });
    readonly headerGroupedTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'headergrouped')
                .at(-1)?.template
    );

    /**
     * Custom row, rendered for each row of data.
     * @param context - body template context.
     * @group Templates
     */
    readonly _bodyTemplate = contentChild<TemplateRef<TableBodyTemplateContext>>('body', { descendants: false });
    readonly bodyTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'body')
                .at(-1)?.template
    );

    /**
     * Custom content while the table is loading, and for each row not loaded yet with lazy virtual scrolling.
     * @param context - loadingbody template context.
     * @group Templates
     */
    readonly _loadingBodyTemplate = contentChild<TemplateRef<TableLoadingBodyTemplateContext>>('loadingbody', { descendants: false });
    readonly loadingBodyTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'loadingbody')
                .at(-1)?.template
    );

    /**
     * Custom caption, rendered above the table.
     * @group Templates
     */
    readonly _captionTemplate = contentChild<TemplateRef<void>>('caption', { descendants: false });
    readonly captionTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'caption')
                .at(-1)?.template
    );

    /**
     * Custom footer rows, rendered in the tfoot.
     * @param context - footer template context.
     * @group Templates
     */
    readonly _footerTemplate = contentChild<TemplateRef<TableColumnsTemplateContext>>('footer', { descendants: false });
    readonly footerTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    /**
     * Custom grouped footer rows, used in place of the footer template.
     * @param context - footergrouped template context.
     * @group Templates
     */
    readonly _footerGroupedTemplate = contentChild<TemplateRef<TableColumnsTemplateContext>>('footergrouped', { descendants: false });
    readonly footerGroupedTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'footergrouped')
                .at(-1)?.template
    );

    /**
     * Custom summary, rendered below the table.
     * @group Templates
     */
    readonly _summaryTemplate = contentChild<TemplateRef<void>>('summary', { descendants: false });
    readonly summaryTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'summary')
                .at(-1)?.template
    );

    /**
     * Custom colgroup element.
     * @param context - colgroup template context.
     * @group Templates
     */
    readonly _colGroupTemplate = contentChild<TemplateRef<TableColumnsTemplateContext>>('colgroup', { descendants: false });
    readonly colGroupTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'colgroup')
                .at(-1)?.template
    );

    /**
     * Custom content of an expanded row.
     * @param context - expandedrow template context.
     * @group Templates
     */
    readonly _expandedRowTemplate = contentChild<TemplateRef<TableExpandedRowTemplateContext>>('expandedrow', { descendants: false });
    readonly expandedRowTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'expandedrow')
                .at(-1)?.template
    );

    /**
     * Custom row group header, with rowGroupMode set to subheader.
     * @param context - groupheader template context.
     * @group Templates
     */
    readonly _groupHeaderTemplate = contentChild<TemplateRef<TableRowGroupTemplateContext>>('groupheader', { descendants: false });
    readonly groupHeaderTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'groupheader')
                .at(-1)?.template
    );

    /**
     * Custom row group footer, with rowGroupMode set to subheader.
     * @param context - groupfooter template context.
     * @group Templates
     */
    readonly _groupFooterTemplate = contentChild<TemplateRef<TableRowGroupTemplateContext>>('groupfooter', { descendants: false });
    readonly groupFooterTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'groupfooter')
                .at(-1)?.template
    );

    /**
     * Custom content of an expanded frozen row.
     * @param context - frozenexpandedrow template context.
     * @group Templates
     */
    readonly _frozenExpandedRowTemplate = contentChild<TemplateRef<TableExpandedRowTemplateContext>>('frozenexpandedrow', { descendants: false });
    readonly frozenExpandedRowTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'frozenexpandedrow')
                .at(-1)?.template
    );

    /**
     * Custom row of the frozen rows.
     * @param context - frozenbody template context.
     * @group Templates
     */
    readonly _frozenBodyTemplate = contentChild<TemplateRef<TableBodyTemplateContext>>('frozenbody', { descendants: false });
    readonly frozenBodyTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'frozenbody')
                .at(-1)?.template
    );

    /**
     * Custom content when there is no data.
     * @param context - emptymessage template context.
     * @group Templates
     */
    readonly _emptyMessageTemplate = contentChild<TemplateRef<TableEmptyMessageTemplateContext>>('emptymessage', { descendants: false });
    readonly emptyMessageTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'emptymessage')
                .at(-1)?.template
    );

    /**
     * Custom content on the left of the paginator.
     * @param context - paginatorleft template context.
     * @group Templates
     */
    readonly _paginatorLeftTemplate = contentChild<TemplateRef<PaginatorTemplateContext>>('paginatorleft', { descendants: false });
    readonly paginatorLeftTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'paginatorleft')
                .at(-1)?.template
    );

    /**
     * Custom content on the right of the paginator.
     * @param context - paginatorright template context.
     * @group Templates
     */
    readonly _paginatorRightTemplate = contentChild<TemplateRef<PaginatorTemplateContext>>('paginatorright', { descendants: false });
    readonly paginatorRightTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'paginatorright')
                .at(-1)?.template
    );

    /**
     * Custom item of the rows per page dropdown of the paginator.
     * @param context - paginatordropdownitem template context.
     * @group Templates
     */
    readonly _paginatorDropdownItemTemplate = contentChild<TemplateRef<PaginatorDropdownItemTemplateContext>>('paginatordropdownitem', { descendants: false });
    readonly paginatorDropdownItemTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'paginatordropdownitem')
                .at(-1)?.template
    );

    /**
     * Custom loading icon.
     * @group Templates
     */
    readonly _loadingIconTemplate = contentChild<TemplateRef<void>>('loadingicon', { descendants: false });
    readonly loadingIconTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'loadingicon')
                .at(-1)?.template
    );

    /**
     * Custom icon of the upper column reorder indicator.
     * @group Templates
     */
    readonly _reorderIndicatorUpIconTemplate = contentChild<TemplateRef<void>>('reorderindicatorupicon', { descendants: false });
    readonly reorderIndicatorUpIconTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'reorderindicatorupicon')
                .at(-1)?.template
    );

    /**
     * Custom icon of the lower column reorder indicator.
     * @group Templates
     */
    readonly _reorderIndicatorDownIconTemplate = contentChild<TemplateRef<void>>('reorderindicatordownicon', { descendants: false });
    readonly reorderIndicatorDownIconTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'reorderindicatordownicon')
                .at(-1)?.template
    );

    /**
     * Custom sort icon of a sortable column.
     * @param context - sorticon template context.
     * @group Templates
     */
    readonly _sortIconTemplate = contentChild<TemplateRef<TableSortIconTemplateContext>>('sorticon', { descendants: false });
    readonly sortIconTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'sorticon')
                .at(-1)?.template
    );

    /**
     * Custom icon of the row checkboxes.
     * @param context - checkboxicon template context.
     * @group Templates
     */
    readonly _checkboxIconTemplate = contentChild<TemplateRef<TableCheckboxIconTemplateContext>>('checkboxicon', { descendants: false });
    readonly checkboxIconTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'checkboxicon')
                .at(-1)?.template
    );

    /**
     * Custom icon of the header checkbox.
     * @param context - headercheckboxicon template context.
     * @group Templates
     */
    readonly _headerCheckboxIconTemplate = contentChild<TemplateRef<TableCheckboxIconTemplateContext>>('headercheckboxicon', { descendants: false });
    readonly headerCheckboxIconTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'headercheckboxicon')
                .at(-1)?.template
    );

    /**
     * Custom dropdown icon of the paginator.
     * @group Templates
     */
    readonly _paginatorDropdownIconTemplate = contentChild<TemplateRef<void>>('paginatordropdownicon', { descendants: false });
    readonly paginatorDropdownIconTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'paginatordropdownicon')
                .at(-1)?.template
    );

    /**
     * Custom icon of the first page button of the paginator.
     * @group Templates
     */
    readonly _paginatorFirstPageLinkIconTemplate = contentChild<TemplateRef<void>>('paginatorfirstpagelinkicon', { descendants: false });
    readonly paginatorFirstPageLinkIconTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'paginatorfirstpagelinkicon')
                .at(-1)?.template
    );

    /**
     * Custom icon of the last page button of the paginator.
     * @group Templates
     */
    readonly _paginatorLastPageLinkIconTemplate = contentChild<TemplateRef<void>>('paginatorlastpagelinkicon', { descendants: false });
    readonly paginatorLastPageLinkIconTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'paginatorlastpagelinkicon')
                .at(-1)?.template
    );

    /**
     * Custom icon of the previous page button of the paginator.
     * @group Templates
     */
    readonly _paginatorPreviousPageLinkIconTemplate = contentChild<TemplateRef<void>>('paginatorpreviouspagelinkicon', { descendants: false });
    readonly paginatorPreviousPageLinkIconTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'paginatorpreviouspagelinkicon')
                .at(-1)?.template
    );

    /**
     * Custom icon of the next page button of the paginator.
     * @group Templates
     */
    readonly _paginatorNextPageLinkIconTemplate = contentChild<TemplateRef<void>>('paginatornextpagelinkicon', { descendants: false });
    readonly paginatorNextPageLinkIconTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'paginatornextpagelinkicon')
                .at(-1)?.template
    );

    selectionKeys = signal<any>({});

    lastResizerHelperX = signal<number | undefined>(undefined);

    reorderIconWidth = signal<number | undefined>(undefined);

    reorderIconHeight = signal<number | undefined>(undefined);

    draggedColumn = signal<any>(undefined);

    draggedRowIndex = signal<number | undefined | null>(undefined);

    droppedRowIndex = signal<number | undefined | null>(undefined);

    rowDragging = signal<boolean | undefined | null>(undefined);

    dropPosition = signal<number | undefined | null>(undefined);

    editingCell = signal<Element | undefined | null>(undefined);

    editingCellData = signal<any>(undefined);

    editingCellField = signal<any>(undefined);

    editingCellRowIndex = signal<number | undefined | null>(undefined);

    /** Value of the edited field when the cell editor opened, restored when the edit is cancelled. */
    editingCellOriginalValue = signal<any>(undefined);

    selfClick = signal<boolean | undefined | null>(undefined);

    documentEditListener = signal<any>(undefined);

    _multiSortMeta = linkedSignal<SortMeta[] | undefined | null>(() => this.multiSortMeta());

    _sortField = linkedSignal<string | undefined | null>(() => this.sortField());

    _sortOrder = linkedSignal<number>(() => this.sortOrder());

    /** Field and order of the last single sort, to ignore a sortField/sortOrder binding that only mirrors it. */
    private lastSingleSort: SortMeta | null = null;

    preventSelectionSetterPropagation = signal<boolean | undefined>(undefined);

    anchorRowIndex = signal<number | undefined | null>(undefined);

    rangeRowIndex = signal<number | undefined>(undefined);

    filterTimeout = signal<any>(undefined);

    initialized = signal<boolean | undefined | null>(undefined);

    rowTouched = signal<boolean | undefined>(undefined);

    restoringSort = signal<boolean | undefined>(undefined);

    restoringFilter = signal<boolean | undefined>(undefined);

    stateRestored = signal<boolean | undefined>(undefined);

    columnOrderStateRestored = signal<boolean | undefined>(undefined);

    columnWidthsState = signal<string | undefined>(undefined);

    tableWidthState = signal<string | undefined>(undefined);

    overlaySubscription = signal<Subscription | undefined>(undefined);

    resizeColumnElement = signal<HTMLElement | undefined>(undefined);

    columnResizing = signal<boolean>(false);

    rowGroupHeaderStyleObject: any = {};

    /**
     * Sticky top of the row group headers: the height of the header above the rows.
     * @group Interface
     */
    readonly rowGroupHeaderTop = signal<string>('');

    id: string = UniqueComponentId();

    styleElement = signal<any>(undefined);

    responsiveStyleElement = signal<any>(undefined);

    overlayService = inject(OverlayService);

    filterService = inject(FilterService);

    tableService = inject(TableService);

    zone = inject(NgZone);

    _componentStyle = inject(TableStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
        afterNextRender(() => {
            if (isPlatformBrowser(this.platformId)) {
                if (this.isStateful() && this.resizableColumns()) {
                    this.restoreColumnWidths();
                }

                this.observeContainerSize();
            }

            this.initialized.set(true);
        });
        effect(() => {
            const value = this.value();

            untracked(() => {
                if (this.isStateful() && !this.stateRestored() && isPlatformBrowser(this.platformId)) {
                    this.restoreState();
                }

                if (!this.lazy()) {
                    // re-applying the filters to a new value must not move back to the first page
                    const first = this.first();

                    if (this.sortMode() == 'single' && (this._sortField() || this.groupRowsBy())) this.sortSingle();
                    else if (this.sortMode() == 'multiple' && (this._multiSortMeta() || this.groupRowsBy())) this.sortMultiple();
                    else if (this.hasFilter())
                        //sort already filters
                        this._filter();

                    if (this.hasFilter()) {
                        this.first.set(first);
                    }

                    // a shorter value can leave the current page empty: move back to the last page
                    const rows = this.rows();
                    const totalRecords = this._totalRecords();
                    if (this.paginator() && rows && totalRecords > 0 && (this.first() ?? 0) >= totalRecords) {
                        this.first.set(Math.floor((totalRecords - 1) / rows) * rows);
                    }
                }

                this.tableService.onValueChange(value);
            });
        });
        effect(() => {
            const columns = this.columns();

            untracked(() => {
                if (!this.isStateful()) {
                    this.tableService.onColumnsChange(columns as any[]);
                }

                if (this._columns() && this.isStateful() && this.reorderableColumns() && !this.columnOrderStateRestored()) {
                    this.restoreColumnOrder();

                    this.tableService.onColumnsChange(this._columns() as any[]);
                }
            });
        });
        effect(() => {
            const sortField = this.sortField();
            this.groupRowsBy();
            const sortOrder = this.sortOrder();
            this.groupRowsByOrder();

            untracked(() => {
                // a consumer writing back the sort it received in onLazyLoad must not load the data again
                const mirrorsLastSort = this.lazy() && this.lastSingleSort?.field === sortField && this.lastSingleSort?.order === sortOrder;
                if (!mirrorsLastSort) this.lastSingleSort = null;

                //avoid triggering lazy load prior to lazy initialization at onInit
                if ((!this.lazy() || this.initialized()) && !mirrorsLastSort) {
                    if (this.sortMode() === 'single') {
                        this.sortSingle();
                    }
                }
            });
        });
        effect(() => {
            this.multiSortMeta();

            untracked(() => {
                if (this.sortMode() === 'multiple' && (this.initialized() || (!this.lazy() && !this.virtualScroll()))) {
                    this.sortMultiple();
                }
            });
        });
        let selectionInitialized = false;
        effect(() => {
            this.selection();

            untracked(() => {
                if (!this.preventSelectionSetterPropagation()) {
                    this.updateSelectionKeys();
                    this.tableService.onSelectionChange();

                    // a selection set from outside is saved like one made by clicking a row
                    if (selectionInitialized && this.isStateful()) {
                        this.saveState();
                    }
                }
                selectionInitialized = true;
                this.preventSelectionSetterPropagation.set(false);
            });
        });
        let selectAllInitialized = false;
        effect(() => {
            const selectAll = this.selectAll();

            untracked(() => {
                if (!selectAllInitialized) {
                    selectAllInitialized = true;

                    if (selectAll === null) {
                        return;
                    }
                }

                if (!this.preventSelectionSetterPropagation()) {
                    this.updateSelectionKeys();
                    this.tableService.onSelectionChange();

                    if (this.isStateful()) {
                        this.saveState();
                    }
                }
                this.preventSelectionSetterPropagation.set(false);
            });
        });
    }

    onInit() {
        if (this.isStateful() && !this.stateRestored() && isPlatformBrowser(this.platformId)) {
            this.restoreState();
        }

        if (this.lazy() && this.lazyLoadOnInit()) {
            if (!this.virtualScroll()) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            }

            if (this.restoringFilter()) {
                this.restoringFilter.set(false);
            }
        }

        if (this.responsiveLayout() === 'stack') {
            this.createResponsiveStyle();
        }
    }

    readonly processedData = computed(() => this.filteredValue() || this._value() || []);

    private _initialColWidths = signal<number[] | undefined>(undefined);

    dataToRender(data: any) {
        const _data = data || this.processedData();

        if (_data && this.paginator()) {
            const first = this.lazy() ? 0 : this.first();
            return _data.slice(first, <number>first + <number>this.rows());
        }

        return _data;
    }

    updateSelectionKeys() {
        if (this.dataKey() && this.selection()) {
            this.selectionKeys.set({});
            if (Array.isArray(this.selection())) {
                for (let data of this.selection()) {
                    this.selectionKeys()[String(ObjectUtils.resolveFieldData(data, this.dataKey()))] = 1;
                }
            } else {
                this.selectionKeys()[String(ObjectUtils.resolveFieldData(this.selection(), this.dataKey()))] = 1;
            }
        }
    }

    onPageChange(event: TablePageEvent) {
        this.first.set(event.first);
        this.rows.set(event.rows);

        this.onPage.emit({
            first: <number>this.first(),
            rows: <number>this.rows()
        });

        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }

        this.tableService.onValueChange(this._value());

        if (this.isStateful()) {
            this.saveState();
        }

        this.anchorRowIndex.set(null);

        if (this.scrollable()) {
            this.resetScrollTop();
        }
    }

    sort(event: any) {
        let originalEvent = event.originalEvent;

        if (this.sortMode() === 'single') {
            this._sortOrder.set(this._sortField() === event.field ? this._sortOrder() * -1 : this.defaultSortOrder());
            this._sortField.set(event.field);

            if (this.resetPageOnSort()) {
                this.first.set(0);

                if (this.scrollable()) {
                    this.resetScrollTop();
                }
            }

            this.sortSingle();
        }
        if (this.sortMode() === 'multiple') {
            let metaKey = (<KeyboardEvent>originalEvent).metaKey || (<KeyboardEvent>originalEvent).ctrlKey;
            let sortMeta = this.getSortMeta(<string>event.field);

            if (sortMeta) {
                if (!metaKey) {
                    this._multiSortMeta.set([
                        {
                            field: <string>event.field,
                            order: sortMeta.order * -1
                        }
                    ]);

                    if (this.resetPageOnSort()) {
                        this.first.set(0);

                        if (this.scrollable()) {
                            this.resetScrollTop();
                        }
                    }
                } else {
                    sortMeta.order = sortMeta.order * -1;
                }
            } else {
                if (!metaKey || !this._multiSortMeta()) {
                    this._multiSortMeta.set([]);

                    if (this.resetPageOnSort()) {
                        this.first.set(0);
                    }
                }
                (<SortMeta[]>this._multiSortMeta()).push({
                    field: <string>event.field,
                    order: this.defaultSortOrder()
                });
            }

            this.sortMultiple();
        }

        if (this.isStateful()) {
            this.saveState();
        }

        this.anchorRowIndex.set(null);
    }

    sortSingle() {
        let field = this._sortField() || this.groupRowsBy();
        let order = this._sortField() ? this._sortOrder() : this.groupRowsByOrder();
        if (this.groupRowsBy() && this._sortField() && this.groupRowsBy() !== this._sortField()) {
            this._multiSortMeta.set([this.getGroupRowsMeta(), { field: this._sortField(), order: this._sortOrder() }]);
            this.sortMultiple();
            return;
        }

        if (field && order) {
            if (this.restoringSort()) {
                this.restoringSort.set(false);
            }

            if (this.lazy()) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            } else if (this._value()) {
                if (this.customSort()) {
                    this.sortFunction.emit({
                        data: this._value(),
                        mode: this.sortMode(),
                        field: field,
                        order: order
                    });
                } else {
                    const sortedValue = [...this._value()].sort((data1, data2) => {
                        let value1 = ObjectUtils.resolveFieldData(data1, field);
                        let value2 = ObjectUtils.resolveFieldData(data2, field);
                        let result: any = null;

                        if (value1 == null && value2 != null) result = -1;
                        else if (value1 != null && value2 == null) result = 1;
                        else if (value1 == null && value2 == null) result = 0;
                        else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
                        else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

                        return order * (result || 0);
                    });

                    this._value.set(sortedValue);
                }

                if (this.hasFilter()) {
                    this._filter();
                }
            }

            let sortMeta: SortMeta = {
                field: field,
                order: order
            };
            this.lastSingleSort = sortMeta;

            this.onSort.emit(sortMeta);
            this.tableService.onSort(sortMeta);
        }
    }

    sortMultiple() {
        if (this.groupRowsBy()) {
            const multiSortMeta = this._multiSortMeta();
            if (!multiSortMeta || !multiSortMeta.length) this._multiSortMeta.set([this.getGroupRowsMeta()]);
            else if (multiSortMeta[0].field !== this.groupRowsBy()) this._multiSortMeta.set([this.getGroupRowsMeta(), ...multiSortMeta]);
        }
        if (this._multiSortMeta() && this._multiSortMeta()!.length > 0) {
            if (this.lazy()) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            } else if (this._value()) {
                if (this.customSort()) {
                    this.sortFunction.emit({
                        data: this._value(),
                        mode: this.sortMode(),
                        multiSortMeta: this._multiSortMeta()
                    });
                } else {
                    this._value.set(
                        [...this._value()].sort((data1, data2) => {
                            return this.multisortField(data1, data2, <SortMeta[]>this._multiSortMeta(), 0);
                        })
                    );
                }

                if (this.hasFilter()) {
                    this._filter();
                }
            }

            this.onSort.emit({
                multisortmeta: <SortMeta[]>this._multiSortMeta()
            });
            this.tableService.onSort(<SortMeta[]>this._multiSortMeta());
        }
    }

    multisortField(data1: any, data2: any, multiSortMeta: SortMeta[], index: number): any {
        const value1 = ObjectUtils.resolveFieldData(data1, multiSortMeta[index].field);
        const value2 = ObjectUtils.resolveFieldData(data2, multiSortMeta[index].field);
        if (ObjectUtils.compare(value1, value2, this.filterLocale()) === 0) {
            return multiSortMeta.length - 1 > index ? this.multisortField(data1, data2, multiSortMeta, index + 1) : 0;
        }
        return this.compareValuesOnSort(value1, value2, multiSortMeta[index].order);
    }

    compareValuesOnSort(value1: any, value2: any, order: any) {
        return ObjectUtils.sort(value1, value2, order, this.filterLocale(), this._sortOrder());
    }

    getSortMeta(field: string) {
        const multiSortMeta = this._multiSortMeta();
        if (multiSortMeta && multiSortMeta.length) {
            for (let i = 0; i < multiSortMeta.length; i++) {
                if (multiSortMeta[i].field === field) {
                    return multiSortMeta[i];
                }
            }
        }

        return null;
    }

    isSorted(field: string) {
        if (this.sortMode() === 'single') {
            return this._sortField() && this._sortField() === field;
        } else if (this.sortMode() === 'multiple') {
            let sorted = false;
            const multiSortMeta = this._multiSortMeta();
            if (multiSortMeta) {
                for (let i = 0; i < multiSortMeta.length; i++) {
                    if (multiSortMeta[i].field == field) {
                        sorted = true;
                        break;
                    }
                }
            }
            return sorted;
        }
    }

    handleRowClick(event: any) {
        let target = <HTMLElement>event.originalEvent.target;
        let targetNode = target.nodeName;
        let parentNode = target.parentElement && target.parentElement.nodeName;
        if (targetNode == 'INPUT' || targetNode == 'BUTTON' || targetNode == 'A' || parentNode == 'INPUT' || parentNode == 'BUTTON' || parentNode == 'A' || isClickable(event.originalEvent.target)) {
            return;
        }

        if (this.selectionMode()) {
            let rowData = event.rowData;
            let rowIndex = event.rowIndex;

            this.preventSelectionSetterPropagation.set(true);
            if (this.isMultipleSelectionMode() && event.originalEvent.shiftKey && this.anchorRowIndex() != null) {
                DomHandler.clearSelection();
                if (this.rangeRowIndex() != null) {
                    this.clearSelectionRange(event.originalEvent);
                }

                this.rangeRowIndex.set(rowIndex);
                this.selectRange(event.originalEvent, rowIndex);
            } else {
                let selected = this.isSelected(rowData);

                if (!selected && !this.isRowSelectable(rowData, rowIndex)) {
                    return;
                }

                let metaSelection = this.rowTouched() ? false : this.metaKeySelection();
                let dataKeyValue = this.dataKey() ? String(ObjectUtils.resolveFieldData(rowData, this.dataKey())) : null;
                this.anchorRowIndex.set(rowIndex);
                this.rangeRowIndex.set(rowIndex);

                if (metaSelection) {
                    let metaKey = event.originalEvent.metaKey || event.originalEvent.ctrlKey;

                    if (selected && metaKey) {
                        if (this.isSingleSelectionMode()) {
                            this.selection.set(null);
                            this.selectionKeys.set({});
                        } else {
                            let selectionIndex = this.findIndexInSelection(rowData);
                            this.selection.set(this.selection().filter((val: any, i: number) => i != selectionIndex));
                            if (dataKeyValue) {
                                delete this.selectionKeys()[dataKeyValue];
                            }
                        }

                        this.onRowUnselect.emit({
                            originalEvent: event.originalEvent,
                            data: rowData,
                            type: 'row'
                        });
                    } else {
                        if (this.isSingleSelectionMode()) {
                            this.selection.set(rowData);
                            if (dataKeyValue) {
                                this.selectionKeys.set({});
                                this.selectionKeys()[dataKeyValue] = 1;
                            }
                        } else if (this.isMultipleSelectionMode()) {
                            let selection;
                            if (metaKey) {
                                selection = this.selection() || [];
                            } else {
                                selection = [];
                                this.selectionKeys.set({});
                            }

                            this.selection.set([...selection, rowData]);
                            if (dataKeyValue) {
                                this.selectionKeys()[dataKeyValue] = 1;
                            }
                        }

                        this.onRowSelect.emit({
                            originalEvent: event.originalEvent,
                            data: rowData,
                            type: 'row',
                            index: rowIndex
                        });
                    }
                } else {
                    if (this.selectionMode() === 'single') {
                        if (selected) {
                            this.selection.set(null);
                            this.selectionKeys.set({});
                            this.onRowUnselect.emit({
                                originalEvent: event.originalEvent,
                                data: rowData,
                                type: 'row',
                                index: rowIndex
                            });
                        } else {
                            this.selection.set(rowData);
                            this.onRowSelect.emit({
                                originalEvent: event.originalEvent,
                                data: rowData,
                                type: 'row',
                                index: rowIndex
                            });
                            if (dataKeyValue) {
                                this.selectionKeys.set({});
                                this.selectionKeys()[dataKeyValue] = 1;
                            }
                        }
                    } else if (this.selectionMode() === 'multiple') {
                        if (selected) {
                            let selectionIndex = this.findIndexInSelection(rowData);
                            this.selection.set(this.selection().filter((val: any, i: number) => i != selectionIndex));
                            this.onRowUnselect.emit({
                                originalEvent: event.originalEvent,
                                data: rowData,
                                type: 'row',
                                index: rowIndex
                            });
                            if (dataKeyValue) {
                                delete this.selectionKeys()[dataKeyValue];
                            }
                        } else {
                            this.selection.set(this.selection() ? [...this.selection(), rowData] : [rowData]);
                            this.onRowSelect.emit({
                                originalEvent: event.originalEvent,
                                data: rowData,
                                type: 'row',
                                index: rowIndex
                            });
                            if (dataKeyValue) {
                                this.selectionKeys()[dataKeyValue] = 1;
                            }
                        }
                    }
                }
            }

            this.tableService.onSelectionChange();

            if (this.isStateful()) {
                this.saveState();
            }
        }

        this.rowTouched.set(false);
    }

    handleRowTouchEnd(event: Event) {
        this.rowTouched.set(true);
    }

    handleRowRightClick(event: any) {
        if (this.contextMenu()) {
            const rowData = event.rowData;
            const rowIndex = event.rowIndex;

            const showContextMenu = () => {
                this.contextMenu().show(event.originalEvent);
                this.contextMenu().hideCallback.set(() => {
                    this.contextMenuSelection.set(null);
                    this.tableService.onContextMenu(null);
                });
            };

            if (this.contextMenuSelectionMode() === 'separate') {
                this.contextMenuSelection.set(rowData);
                this.tableService.onContextMenu(rowData);
                showContextMenu();
                this.onContextMenuSelect.emit({
                    originalEvent: event.originalEvent,
                    data: rowData,
                    index: event.rowIndex
                });
            } else if (this.contextMenuSelectionMode() === 'joint') {
                this.preventSelectionSetterPropagation.set(true);
                let selected = this.isSelected(rowData);
                let dataKeyValue = this.dataKey() ? String(ObjectUtils.resolveFieldData(rowData, this.dataKey())) : null;

                if (!selected) {
                    if (!this.isRowSelectable(rowData, rowIndex)) {
                        return;
                    }

                    if (this.isSingleSelectionMode()) {
                        this.selection.set(rowData);

                        if (dataKeyValue) {
                            this.selectionKeys.set({});
                            this.selectionKeys()[dataKeyValue] = 1;
                        }
                    } else if (this.isMultipleSelectionMode()) {
                        this.selection.set(this.selection() ? [...this.selection(), rowData] : [rowData]);

                        if (dataKeyValue) {
                            this.selectionKeys()[dataKeyValue] = 1;
                        }
                    }
                }

                // Also update contextMenuSelection in joint mode
                this.contextMenuSelection.set(rowData);
                this.tableService.onContextMenu(rowData);

                this.tableService.onSelectionChange();
                showContextMenu();
                this.onContextMenuSelect.emit({
                    originalEvent: event,
                    data: rowData,
                    index: event.rowIndex
                });
            }
        }
    }

    selectRange(event: MouseEvent | KeyboardEvent, rowIndex: number, isMetaKeySelection?: boolean | undefined) {
        let rangeStart, rangeEnd;

        if (<number>this.anchorRowIndex() > rowIndex) {
            rangeStart = rowIndex;
            rangeEnd = this.anchorRowIndex();
        } else if (<number>this.anchorRowIndex() < rowIndex) {
            rangeStart = this.anchorRowIndex();
            rangeEnd = rowIndex;
        } else {
            rangeStart = rowIndex;
            rangeEnd = rowIndex;
        }

        if (this.lazy() && this.paginator()) {
            (rangeStart as number) -= <number>this.first();
            (rangeEnd as number) -= <number>this.first();
        }

        let rangeRowsData: RowData[] = [];
        let selection = this.selection();
        for (let i = <number>rangeStart; i <= <number>rangeEnd; i++) {
            let rangeRowData = this.filteredValue() ? this.filteredValue()![i] : this._value()[i];
            if (!this.isSelected(rangeRowData) && !isMetaKeySelection) {
                if (!this.isRowSelectable(rangeRowData, rowIndex)) {
                    continue;
                }

                rangeRowsData.push(rangeRowData);
                selection = [...selection, rangeRowData];
                let dataKeyValue = this.dataKey() ? String(ObjectUtils.resolveFieldData(rangeRowData, this.dataKey())) : null;
                if (dataKeyValue) {
                    this.selectionKeys()[dataKeyValue] = 1;
                }
            }
        }
        this.selection.set(selection);
        this.onRowSelect.emit({
            originalEvent: event,
            data: rangeRowsData,
            type: 'row'
        });
    }

    clearSelectionRange(event: MouseEvent | KeyboardEvent) {
        let rangeStart, rangeEnd;
        let rangeRowIndex = <number>this.rangeRowIndex();
        let anchorRowIndex = <number>this.anchorRowIndex();

        if (rangeRowIndex > anchorRowIndex) {
            rangeStart = this.anchorRowIndex();
            rangeEnd = this.rangeRowIndex();
        } else if (rangeRowIndex < anchorRowIndex) {
            rangeStart = this.rangeRowIndex();
            rangeEnd = this.anchorRowIndex();
        } else {
            rangeStart = this.rangeRowIndex();
            rangeEnd = this.rangeRowIndex();
        }

        let selection = this.selection();
        for (let i = <number>rangeStart; i <= <number>rangeEnd; i++) {
            let rangeRowData = this._value()[i];
            let selectionIndex = selection && selection.length ? selection.findIndex((val: any) => this.equals(rangeRowData, val)) : -1;
            selection = selection.filter((val: any, i: number) => i != selectionIndex);
            let dataKeyValue = this.dataKey() ? String(ObjectUtils.resolveFieldData(rangeRowData, this.dataKey())) : null;
            if (dataKeyValue) {
                delete this.selectionKeys()[dataKeyValue];
            }
            this.onRowUnselect.emit({
                originalEvent: event,
                data: rangeRowData,
                type: 'row'
            });
        }
        this.selection.set(selection);
    }

    isSelected(rowData: any) {
        if (rowData && this.selection()) {
            if (this.dataKey()) {
                return this.selectionKeys()[ObjectUtils.resolveFieldData(rowData, this.dataKey())] !== undefined;
            } else {
                if (Array.isArray(this.selection())) return this.findIndexInSelection(rowData) > -1;
                else return this.equals(rowData, this.selection());
            }
        }

        return false;
    }

    findIndexInSelection(rowData: any) {
        let index: number = -1;
        if (this.selection() && this.selection().length) {
            for (let i = 0; i < this.selection().length; i++) {
                if (this.equals(rowData, this.selection()[i])) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    isRowSelectable(data: any, index: number) {
        if (this.rowSelectable() && !this.rowSelectable()!({ data, index })) {
            return false;
        }

        return true;
    }

    toggleRowWithRadio(event: any, rowData: any) {
        this.preventSelectionSetterPropagation.set(true);

        if (this.selection() != rowData) {
            if (!this.isRowSelectable(rowData, event.rowIndex)) {
                return;
            }

            this.selection.set(rowData);
            this.onRowSelect.emit({
                originalEvent: event.originalEvent,
                index: event.rowIndex,
                data: rowData,
                type: 'radiobutton'
            });

            if (this.dataKey()) {
                this.selectionKeys.set({});
                this.selectionKeys()[String(ObjectUtils.resolveFieldData(rowData, this.dataKey()))] = 1;
            }
        } else {
            this.selection.set(null);
            this.onRowUnselect.emit({
                originalEvent: event.originalEvent,
                index: event.rowIndex,
                data: rowData,
                type: 'radiobutton'
            });
        }

        this.tableService.onSelectionChange();

        if (this.isStateful()) {
            this.saveState();
        }
    }

    toggleRowWithCheckbox(event: { originalEvent: Event; rowIndex: number }, rowData: any) {
        let selected = this.isSelected(rowData);
        let dataKeyValue = this.dataKey() ? String(ObjectUtils.resolveFieldData(rowData, this.dataKey())) : null;
        this.preventSelectionSetterPropagation.set(true);

        if (selected) {
            let selectionIndex = this.findIndexInSelection(rowData);
            this.selection.set(this.selection().filter((val: any, i: number) => i != selectionIndex));
            this.onRowUnselect.emit({
                originalEvent: event.originalEvent,
                index: event.rowIndex,
                data: rowData,
                type: 'checkbox'
            });
            if (dataKeyValue) {
                delete this.selectionKeys()[dataKeyValue];
            }
        } else {
            if (!this.isRowSelectable(rowData, event.rowIndex)) {
                return;
            }

            this.selection.set(this.selection() ? [...this.selection(), rowData] : [rowData]);
            this.onRowSelect.emit({
                originalEvent: event.originalEvent,
                index: event.rowIndex,
                data: rowData,
                type: 'checkbox'
            });
            if (dataKeyValue) {
                this.selectionKeys()[dataKeyValue] = 1;
            }
        }

        this.tableService.onSelectionChange();

        if (this.isStateful()) {
            this.saveState();
        }
    }

    toggleRowsWithCheckbox({ originalEvent }: CheckboxChangeEvent, check: boolean) {
        if (this.selectAll() !== null) {
            this.onSelectAllChange.emit({ originalEvent: originalEvent!, checked: check });
        } else {
            const data = this.selectionPageOnly() ? this.dataToRender(this.processedData()) : this.processedData();
            let selection = this.selectionPageOnly() && this.selection() ? this.selection().filter((s: any) => !data.some((d: any) => this.equals(s, d))) : [];

            if (check) {
                selection = this.frozenValue() ? [...selection, ...this.frozenValue()!, ...data] : [...selection, ...data];
                selection = this.rowSelectable() ? selection.filter((data: any, index: number) => this.rowSelectable()!({ data, index })) : selection;
            }

            this.selection.set(selection);
            this.preventSelectionSetterPropagation.set(true);
            this.updateSelectionKeys();
            this.tableService.onSelectionChange();
            this.onHeaderCheckboxToggle.emit({
                originalEvent: originalEvent!,
                checked: check
            });

            if (this.isStateful()) {
                this.saveState();
            }
        }
    }

    equals(data1: any, data2: any) {
        return this.compareSelectionBy() === 'equals' ? data1 === data2 : ObjectUtils.equals(data1, data2, this.dataKey());
    }

    /* Legacy Filtering for custom elements */
    filter(value: any, field: string, matchMode: string) {
        if (this.filterTimeout()) {
            clearTimeout(this.filterTimeout());
        }
        const fieldFilter = this._filters()[field];

        if (Array.isArray(fieldFilter)) {
            // a menu p-columnFilter owns this field and reads its filter as a list of constraints
            this._filters()[field] = [{ value: this.isFilterBlank(value) ? null : value, matchMode: matchMode, operator: fieldFilter[0]?.operator ?? FilterOperator.AND }];
        } else if (!this.isFilterBlank(value)) {
            this._filters()[field] = { value: value, matchMode: matchMode };
        } else if (fieldFilter) {
            delete this._filters()[field];
        }

        this.filterTimeout.set(
            setTimeout(() => {
                this._filter();
                this.filterTimeout.set(null);
            }, this.filterDelay())
        );

        this.anchorRowIndex.set(null);
    }

    filterGlobal(value: any, matchMode: string) {
        this.filter(value, 'global', matchMode);
    }

    isFilterBlank(filter: any): boolean {
        if (filter !== null && filter !== undefined) {
            if ((typeof filter === 'string' && filter.trim().length == 0) || (Array.isArray(filter) && filter.length == 0)) return true;
            else return false;
        }
        return true;
    }

    _filter() {
        if (!this.restoringFilter()) {
            this.first.set(0);
        }

        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        } else {
            if (!this._value()) {
                return;
            }
            if (!this.hasFilter()) {
                this.filteredValue.set(null);
                if (this.paginator()) {
                    this._totalRecords.set(this.totalRecords() === 0 && this._value() ? this._value().length : this.totalRecords());
                }
            } else {
                let globalFilterFieldsArray;
                if (this._filters()['global']) {
                    if (!this._columns() && !this.globalFilterFields()) throw new Error('Global filtering requires dynamic columns or globalFilterFields to be defined.');
                    else globalFilterFieldsArray = this.globalFilterFields() || this._columns();
                }

                let filteredValue: any[] | null = [];

                for (let i = 0; i < this._value().length; i++) {
                    let localMatch = true;
                    let globalMatch = false;
                    let localFiltered = false;

                    for (let prop in this._filters()) {
                        if (this._filters().hasOwnProperty(prop) && prop !== 'global') {
                            localFiltered = true;
                            let filterField = prop;
                            let filterMeta = this._filters()[filterField];

                            if (Array.isArray(filterMeta)) {
                                for (let meta of filterMeta) {
                                    localMatch = this.executeLocalFilter(filterField, this._value()[i], meta);

                                    if ((meta.operator === FilterOperator.OR && localMatch) || (meta.operator === FilterOperator.AND && !localMatch)) {
                                        break;
                                    }
                                }
                            } else {
                                localMatch = this.executeLocalFilter(filterField, this._value()[i], <any>filterMeta);
                            }

                            if (!localMatch) {
                                break;
                            }
                        }
                    }

                    if (this._filters()['global'] && !globalMatch && globalFilterFieldsArray) {
                        // a negated match mode only matches when no field contains the term
                        const globalMatchMode = (<FilterMetadata>this._filters()['global']).matchMode;
                        const negated = globalMatchMode === FilterMatchMode.NOT_CONTAINS || globalMatchMode === FilterMatchMode.NOT_EQUALS;

                        for (let j = 0; j < globalFilterFieldsArray.length; j++) {
                            let globalFilterField = globalFilterFieldsArray[j].field || globalFilterFieldsArray[j];
                            globalMatch = (<any>this.filterService).filters[(<any>this._filters()['global']).matchMode](
                                ObjectUtils.resolveFieldData(this._value()[i], globalFilterField),
                                (<FilterMetadata>this._filters()['global']).value,
                                this.filterLocale()
                            );

                            if (negated ? !globalMatch : globalMatch) {
                                break;
                            }
                        }
                    }

                    let matches: boolean;
                    if (this._filters()['global']) {
                        matches = localFiltered ? localFiltered && localMatch && globalMatch : globalMatch;
                    } else {
                        matches = localFiltered && localMatch;
                    }

                    if (matches) {
                        filteredValue.push(this._value()[i]);
                    }
                }

                if (filteredValue.length === this._value().length) {
                    filteredValue = null;
                }

                this.filteredValue.set(filteredValue);

                if (this.paginator()) {
                    this._totalRecords.set(filteredValue ? filteredValue.length : this.totalRecords() === 0 && this._value() ? this._value().length : (this.totalRecords() ?? 0));
                }
            }
        }

        this.onFilter.emit({
            filters: this._filters(),
            filteredValue: this.filteredValue() || this._value()
        });

        this.tableService.onValueChange(this._value());

        if (this.isStateful() && !this.restoringFilter()) {
            this.saveState();
        }

        if (this.restoringFilter()) {
            this.restoringFilter.set(false);
        }

        if (this.scrollable()) {
            this.resetScrollTop();
        }
    }

    executeLocalFilter(field: string, rowData: any, filterMeta: FilterMetadata): boolean {
        let filterValue = filterMeta.value;
        let filterMatchMode = filterMeta.matchMode || FilterMatchMode.STARTS_WITH;
        let dataFieldValue = ObjectUtils.resolveFieldData(rowData, field);
        let filterConstraint = (<any>this.filterService).filters[filterMatchMode];

        return filterConstraint(dataFieldValue, filterValue, this.filterLocale());
    }

    hasFilter() {
        let empty = true;
        for (let prop in this._filters()) {
            if (this._filters().hasOwnProperty(prop)) {
                empty = false;
                break;
            }
        }

        return !empty;
    }

    createLazyLoadMetadata(): any {
        return {
            first: this.first(),
            rows: this.rows(),
            sortField: this._sortField(),
            sortOrder: this._sortOrder(),
            filters: this._filters(),
            globalFilter: this._filters() && this._filters()['global'] ? (<FilterMetadata>this._filters()['global']).value : null,
            multiSortMeta: this._multiSortMeta(),
            forceUpdate: () => this.cd.detectChanges()
        };
    }

    public clear() {
        this._sortField.set(null);
        this._sortOrder.set(this.defaultSortOrder());
        this._multiSortMeta.set(null);
        this.tableService.onSort(null);

        this.clearFilterValues();

        this.filteredValue.set(null);

        this.first.set(0);

        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        } else {
            this._totalRecords.set(this.totalRecords() === 0 && this._value() ? this._value().length : (this.totalRecords() ?? 0));
        }
    }

    clearFilterValues() {
        for (const [, filterMetadata] of Object.entries(this._filters())) {
            if (Array.isArray(filterMetadata)) {
                for (let filter of filterMetadata) {
                    filter.value = null;
                }
            } else if (filterMetadata) {
                filterMetadata.value = null;
            }
        }
    }

    reset() {
        this.clear();
    }

    getExportHeader(column: any) {
        return column[<string>this.exportHeader()] || column.header || column.field;
    }
    /**
     * Data export method.
     * @param {ExportCSVOptions} object - Export options.
     * @group Method
     */
    public exportCSV(options?: ExportCSVOptions) {
        let data;
        let csv = '';
        let columns = this._columns();

        if (options && options.selectionOnly) {
            data = this.selection() || [];
        } else if (options && options.allValues) {
            data = this._value() || [];
        } else {
            data = this.filteredValue() || this._value();

            if (this.frozenValue()) {
                data = data ? [...this.frozenValue()!, ...data] : this.frozenValue();
            }
        }

        const exportableColumns: any[] = (<any[]>columns).filter((column) => column.exportable !== false && column.field);

        //headers
        csv += exportableColumns.map((column) => '"' + this.getExportHeader(column) + '"').join(this.csvSeparator());

        //body
        const body = data
            .map((record: any) =>
                exportableColumns
                    .map((column) => {
                        let cellData = ObjectUtils.resolveFieldData(record, column.field);

                        if (cellData != null) {
                            if (this.exportFunction()) {
                                cellData = this.exportFunction()!({
                                    data: cellData,
                                    field: column.field
                                });
                            } else cellData = String(cellData).replace(/"/g, '""');
                        } else cellData = '';

                        return '"' + cellData + '"';
                    })
                    .join(this.csvSeparator())
            )
            .join('\n');

        if (body.length) {
            csv += '\n' + body;
        }

        let blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], {
            type: 'text/csv;charset=utf-8;'
        });

        let link = this.renderer.createElement('a');
        link.style.display = 'none';
        this.renderer.appendChild(this.document.body, link);
        if (link.download !== undefined) {
            link.setAttribute('href', URL.createObjectURL(blob));
            link.setAttribute('download', this.exportFilename() + '.csv');
            link.click();
        } else {
            csv = 'data:text/csv;charset=utf-8,' + csv;
            this.document.defaultView?.open(encodeURI(csv));
        }
        this.renderer.removeChild(this.document.body, link);
    }

    onLazyItemLoad(event: LazyLoadMeta) {
        this.onLazyLoad.emit({
            ...this.createLazyLoadMetadata(),
            ...event,
            rows: <number>event.last - <number>event.first
        });
    }
    /**
     * Resets scroll to top.
     * @group Method
     */
    public resetScrollTop() {
        if (this.virtualScroll()) this.scrollToVirtualIndex(0);
        else this.scrollTo({ top: 0 });
    }
    /**
     * Scrolls to given index when using virtual scroll.
     * @param {number} index - index of the element.
     * @group Method
     */
    public scrollToVirtualIndex(index: number) {
        const scroller = this.scroller();
        scroller && scroller.scrollToIndex(index);
    }
    /**
     * Scrolls to given index.
     * @param {ScrollToOptions} options - scroll options.
     * @group Method
     */
    public scrollTo(options: any) {
        const wrapperViewChild = this.wrapperViewChild();
        if (this.virtualScroll()) {
            this.scroller()?.scrollTo(options);
        } else {
            if (wrapperViewChild.nativeElement.scrollTo) {
                wrapperViewChild.nativeElement.scrollTo(options);
            } else {
                wrapperViewChild.nativeElement.scrollLeft = options.left;
                wrapperViewChild.nativeElement.scrollTop = options.top;
            }
        }
    }

    updateEditingCell(cell: any, data: any, field: string, index: number) {
        this.editingCell.set(cell);
        this.editingCellData.set(data);
        this.editingCellField.set(field);
        this.editingCellRowIndex.set(index);
        this.bindDocumentEditListener();
    }

    isEditingCellValid() {
        return this.editingCell() && DomHandler.find(this.editingCell(), '.ng-invalid.ng-dirty').length === 0;
    }

    bindDocumentEditListener() {
        if (!this.documentEditListener()) {
            this.documentEditListener.set(
                this.renderer.listen(this.document, 'click', (event) => {
                    if (this.editingCell() && !this.selfClick() && this.isEditingCellValid()) {
                        !this.$unstyled() && DomHandler.removeClass(this.editingCell(), 'p-cell-editing');
                        setAttribute(this.editingCell() as HTMLElement, 'data-p-cell-editing', 'false');
                        this.editingCell.set(null);
                        this.onEditComplete.emit({
                            field: this.editingCellField(),
                            data: this.editingCellData(),
                            originalEvent: event,
                            index: <number>this.editingCellRowIndex()
                        });
                        this.editingCellField.set(null);
                        this.editingCellData.set(null);
                        this.editingCellRowIndex.set(null);
                        this.unbindDocumentEditListener();

                        if (this.overlaySubscription()) {
                            this.overlaySubscription()!.unsubscribe();
                        }
                    }

                    this.selfClick.set(false);
                })
            );
        }
    }

    unbindDocumentEditListener() {
        if (this.documentEditListener()) {
            this.documentEditListener()();
            this.documentEditListener.set(null);
        }
    }

    initRowEdit(rowData: any) {
        let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey()));
        this.editingRowKeys()[dataKeyValue] = true;
    }

    saveRowEdit(rowData: any, rowElement: HTMLTableRowElement) {
        if (DomHandler.find(rowElement, '.ng-invalid.ng-dirty').length === 0) {
            let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey()));
            delete this.editingRowKeys()[dataKeyValue];
        }
    }

    cancelRowEdit(rowData: any) {
        let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey()));
        delete this.editingRowKeys()[dataKeyValue];
    }

    toggleRow(rowData: any, event?: Event) {
        if (!this.dataKey() && !this.groupRowsBy()) {
            throw new Error('dataKey or groupRowsBy must be defined to use row expansion');
        }

        let dataKeyValue = this.groupRowsBy() ? String(ObjectUtils.resolveFieldData(rowData, this.groupRowsBy())) : String(ObjectUtils.resolveFieldData(rowData, this.dataKey()));

        if (this._expandedRowKeys()[dataKeyValue] != null) {
            delete this._expandedRowKeys()[dataKeyValue];
            this.onRowCollapse.emit({
                originalEvent: <Event>event,
                data: rowData
            });
        } else {
            if (this.rowExpandMode() === 'single') {
                const expandedKeys = Object.keys(this._expandedRowKeys());
                this._expandedRowKeys.set({});

                for (const expandedKey of expandedKeys) {
                    const collapsedRowData = (this._value() || []).find((data) => String(ObjectUtils.resolveFieldData(data, this.groupRowsBy() ? this.groupRowsBy() : this.dataKey())) === expandedKey);

                    if (collapsedRowData) {
                        this.onRowCollapse.emit({
                            originalEvent: <Event>event,
                            data: collapsedRowData
                        });
                    }
                }
            }

            this._expandedRowKeys()[dataKeyValue] = true;
            this.onRowExpand.emit({
                originalEvent: <Event>event,
                data: rowData
            });
        }

        if (event) {
            event.preventDefault();
        }

        if (this.isStateful()) {
            this.saveState();
        }
    }

    isRowExpanded(rowData: any): boolean {
        return this.groupRowsBy() ? this._expandedRowKeys()[String(ObjectUtils.resolveFieldData(rowData, this.groupRowsBy()))] === true : this._expandedRowKeys()[String(ObjectUtils.resolveFieldData(rowData, this.dataKey()))] === true;
    }

    isRowEditing(rowData: any): boolean {
        return this.editingRowKeys()[String(ObjectUtils.resolveFieldData(rowData, this.dataKey()))] === true;
    }

    isSingleSelectionMode() {
        return this.selectionMode() === 'single';
    }

    isMultipleSelectionMode() {
        return this.selectionMode() === 'multiple';
    }

    onColumnResizeBegin(event: any) {
        let containerLeft = DomHandler.getOffset(this.el?.nativeElement).left;
        this.resizeColumnElement.set(event.target.closest('th'));
        this.columnResizing.set(true);
        if (event.type == 'touchstart') {
            this.lastResizerHelperX.set(event.changedTouches[0].clientX - containerLeft + this.el?.nativeElement.scrollLeft);
        } else {
            this.lastResizerHelperX.set(event.pageX - containerLeft + this.el?.nativeElement.scrollLeft);
        }
        this.onColumnResize(event);
        event.preventDefault();
    }

    onColumnResize(event: any) {
        let containerLeft = DomHandler.getOffset(this.el?.nativeElement).left;
        !this.$unstyled() && DomHandler.addClass(this.el?.nativeElement, 'p-unselectable-text');
        // offsetHeight rounds a fractional height up, which made the indicator overflow the container of the table
        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.height = this.el?.nativeElement.getBoundingClientRect().height + 'px';
        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.top = 0 + 'px';
        if (event.type == 'touchmove') {
            (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.left = event.changedTouches[0].clientX - containerLeft + this.el?.nativeElement.scrollLeft + 'px';
        } else {
            (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.left = event.pageX - containerLeft + this.el?.nativeElement.scrollLeft + 'px';
        }
        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.display = 'block';
    }

    onColumnResizeEnd() {
        const isRTL = getComputedStyle(this.el?.nativeElement ?? document.documentElement).direction === 'rtl';
        const resizeHelperViewChild = this.resizeHelperViewChild();
        const rawDelta = resizeHelperViewChild?.nativeElement.offsetLeft - <number>this.lastResizerHelperX();
        const delta = isRTL ? -rawDelta : rawDelta;
        const resizeColumnElement = <HTMLElement>this.resizeColumnElement();
        const columnWidth = resizeColumnElement.offsetWidth;
        const newColumnWidth = columnWidth + delta;
        const elementMinWidth = resizeColumnElement.style.minWidth.replace(/[^\d.]/g, '');
        const minWidth = elementMinWidth ? parseFloat(elementMinWidth) : 15;

        if (newColumnWidth >= minWidth) {
            if (this.columnResizeMode() === 'fit') {
                const nextColumn = resizeColumnElement.nextElementSibling as HTMLElement;
                const nextColumnWidth = nextColumn.offsetWidth - delta;

                if (newColumnWidth > 15 && nextColumnWidth > 15) {
                    this.resizeTableCells(newColumnWidth, nextColumnWidth);
                }
            } else if (this.columnResizeMode() === 'expand') {
                this._initialColWidths.set(this._totalTableWidth());
                const tableWidth = this.tableViewChild()?.nativeElement.offsetWidth + delta;

                this.setResizeTableWidth(tableWidth + 'px');
                this.resizeTableCells(newColumnWidth, null);
            }

            this.onColResize.emit({
                element: resizeColumnElement,
                delta: delta
            });

            if (this.isStateful()) {
                this.saveState();
            }
        }

        (<ElementRef>resizeHelperViewChild).nativeElement.style.display = 'none';
        DomHandler.removeClass(this.el?.nativeElement, 'p-unselectable-text');
    }

    private _totalTableWidth(): number[] {
        let widths = [];
        const tableHead = DomHandler.findSingle(this.el.nativeElement, '[data-pc-section="thead"]');
        // only the last header row holds one cell per column: the rows above it may group columns (colspan)
        let headers = DomHandler.find(tableHead, 'tr:last-child > th');
        headers.forEach((header) => (widths as any[]).push(DomHandler.getOuterWidth(header)));

        return widths;
    }

    onColumnDragStart(event: any, columnElement: any) {
        this.reorderIconWidth.set(DomHandler.getHiddenElementOuterWidth(this.reorderIndicatorUpViewChild()?.nativeElement));
        this.reorderIconHeight.set(DomHandler.getHiddenElementOuterHeight(this.reorderIndicatorDownViewChild()?.nativeElement));
        this.draggedColumn.set(columnElement);
        event.dataTransfer.setData('text', 'b'); // For firefox
        this.bindColumnDragScrollLock();
    }

    private columnDragScrollListener: VoidListener;

    // the browser scrolls a container when a dragged pointer comes near its edge, and the sticky header is at the top
    // edge of the rows: keep the rows still while a column is dragged, a column moves sideways only
    bindColumnDragScrollLock() {
        const container = this.virtualScroll() ? this.scroller()?.getElementRef()?.nativeElement : this.wrapperViewChild()?.nativeElement;

        if (container && !this.columnDragScrollListener) {
            const scrollTop = container.scrollTop;
            this.columnDragScrollListener = this.renderer.listen(container, 'scroll', () => {
                if (!this.draggedColumn()) {
                    this.unbindColumnDragScrollLock();
                } else if (container.scrollTop !== scrollTop) {
                    container.scrollTop = scrollTop;
                }
            });
        }
    }

    unbindColumnDragScrollLock() {
        if (this.columnDragScrollListener) {
            this.columnDragScrollListener();
            this.columnDragScrollListener = null;
        }
    }

    onColumnDragEnter(event: any, dropHeader: any) {
        if (this.reorderableColumns() && this.draggedColumn() && dropHeader) {
            event.preventDefault();
            let containerOffset = DomHandler.getOffset(this.el?.nativeElement);
            let dropHeaderOffset = DomHandler.getOffset(dropHeader);

            if (this.draggedColumn() != dropHeader) {
                let dragIndex = DomHandler.indexWithinGroup(this.draggedColumn(), 'preorderablecolumn');
                let dropIndex = DomHandler.indexWithinGroup(dropHeader, 'preorderablecolumn');
                let targetLeft = dropHeaderOffset.left - containerOffset.left;
                let targetTop = containerOffset.top - dropHeaderOffset.top;
                let columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;
                // in RTL the next column is on the left: the left half drops after, the right half before
                const isRTL = getComputedStyle(this.el?.nativeElement ?? document.documentElement).direction === 'rtl';

                (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.top = dropHeaderOffset.top - containerOffset.top - (<number>this.reorderIconHeight() - 1) + 'px';
                (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.top = dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight + 'px';

                if (event.pageX > columnCenter) {
                    (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(<number>this.reorderIconWidth() / 2) + 'px';
                    (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(<number>this.reorderIconWidth() / 2) + 'px';
                    this.dropPosition.set(isRTL ? -1 : 1);
                } else {
                    (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.left = targetLeft - Math.ceil(<number>this.reorderIconWidth() / 2) + 'px';
                    (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.left = targetLeft - Math.ceil(<number>this.reorderIconWidth() / 2) + 'px';
                    this.dropPosition.set(isRTL ? 1 : -1);
                }
                (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.display = 'block';
                (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.display = 'block';
            } else {
                event.dataTransfer.dropEffect = 'none';
            }
        }
    }

    onColumnDragLeave(event: Event) {
        if (this.reorderableColumns() && this.draggedColumn()) {
            event.preventDefault();
        }
    }

    onColumnDrop(event: Event, dropColumn: any) {
        event.preventDefault();
        if (this.draggedColumn()) {
            // when the header row has one cell per column, index the cells themselves so that the
            // non-reorderable columns (e.g. frozen ones) keep their place in _columns
            const headerCells = this.draggedColumn().parentElement ? DomHandler.find(this.draggedColumn().parentElement, ':scope > th') : [];
            const indexByCell = !!this._columns() && this._columns()!.length === headerCells.length;
            let dragIndex = indexByCell ? DomHandler.index(this.draggedColumn()) : DomHandler.indexWithinGroup(this.draggedColumn(), 'preorderablecolumn');
            let dropIndex = indexByCell ? DomHandler.index(dropColumn) : DomHandler.indexWithinGroup(dropColumn, 'preorderablecolumn');
            let allowDrop = dragIndex != dropIndex;
            if (allowDrop && ((dropIndex - dragIndex == 1 && this.dropPosition() === -1) || (dragIndex - dropIndex == 1 && this.dropPosition() === 1))) {
                allowDrop = false;
            }

            if (allowDrop && dropIndex < dragIndex && this.dropPosition() === 1) {
                dropIndex = dropIndex + 1;
            }

            if (allowDrop && dropIndex > dragIndex && this.dropPosition() === -1) {
                dropIndex = dropIndex - 1;
            }

            if (allowDrop) {
                ObjectUtils.reorderArray(<any[]>this._columns(), dragIndex, dropIndex);

                this.onColReorder.emit({
                    dragIndex: dragIndex,
                    dropIndex: dropIndex,
                    columns: this._columns()
                });

                if (this.isStateful()) {
                    this.zone.runOutsideAngular(() => {
                        setTimeout(() => {
                            this.saveState();
                        });
                    });
                }
            }

            if (allowDrop && this.resizableColumns() && this.resizeColumnElement()) {
                // The widths are indexed by header cell, the drag/drop indexes by reorderable column only.
                const offset = DomHandler.index(this.draggedColumn()) - dragIndex;
                const width = [...((this.columnResizeMode() === 'expand' ? this._initialColWidths() : undefined) ?? this._totalTableWidth())];
                ObjectUtils.reorderArray(width, dragIndex + offset, dropIndex + offset);
                if (this.columnResizeMode() === 'expand') {
                    this._initialColWidths.set(width);
                }
                // Keep every width as measured: no column is resized by a reorder.
                this.updateStyleElement(width, -1, 0, null);
            }

            (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.display = 'none';
            (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.display = 'none';
            this.draggedColumn().draggable = false;
            this.draggedColumn.set(null);
            this.dropPosition.set(null);
        }

        this.unbindColumnDragScrollLock();
    }

    // keyboard alternative to the drag and drop: move the column one place towards the given direction
    onColumnKeyboardReorder(event: KeyboardEvent, columnElement: any) {
        const isRTL = getComputedStyle(this.el?.nativeElement ?? document.documentElement).direction === 'rtl';
        const forward = (event.code === 'ArrowRight') !== isRTL;
        const dropColumn = forward ? columnElement.nextElementSibling : columnElement.previousElementSibling;

        if (this.reorderableColumns() && dropColumn?.hasAttribute('preorderablecolumn')) {
            this.draggedColumn.set(columnElement);
            this.dropPosition.set(forward ? 1 : -1);
            this.onColumnDrop(event, dropColumn);
            // re-rendering the header can move the focused cell: keep the focus on it and announce its new place
            setTimeout(() => {
                if (columnElement.isConnected) {
                    columnElement.focus();
                    const cells = Array.from<Element>(columnElement.parentElement?.children ?? []);
                    this.announceReorder('columnMoved', cells.indexOf(columnElement) + 1, cells.length);
                }
            });
        }
    }

    /**
     * Text of the live region that tells screen readers where a column or a row moved with the keyboard.
     * @group Interface
     */
    readonly reorderAnnouncement = signal<string>('');

    announceReorder(key: 'columnMoved' | 'rowMoved', position: number, total: number) {
        const fallback = key === 'columnMoved' ? 'Column moved to position {position} of {total}' : 'Row moved to position {position} of {total}';
        const template = this.config.translation?.aria?.[key] ?? fallback;
        this.reorderAnnouncement.set(template.replace('{position}', String(position)).replace('{total}', String(total)));
    }

    onColumnDragEnd() {
        // a drop outside a header fires no drop event: clear the drag state here
        if (this.draggedColumn()) {
            (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.display = 'none';
            (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.display = 'none';
            this.draggedColumn().draggable = false;
            this.draggedColumn.set(null);
            this.dropPosition.set(null);
        }

        this.unbindColumnDragScrollLock();
    }

    resizeTableCells(newColumnWidth: number, nextColumnWidth: number | null) {
        let colIndex = DomHandler.index(this.resizeColumnElement());
        let width = this.columnResizeMode() === 'expand' ? <number[]>this._initialColWidths() : this._totalTableWidth();
        this.updateStyleElement(width, colIndex, newColumnWidth, nextColumnWidth);
    }

    updateStyleElement(width: number[], colIndex: number, newColumnWidth: number, nextColumnWidth: number | null) {
        this.destroyStyleElement();
        this.createStyleElement();

        let innerHTML = '';
        width.forEach((width, index) => {
            let colWidth = index === colIndex ? newColumnWidth : nextColumnWidth && index === colIndex + 1 ? nextColumnWidth : width;
            let style = `width: ${colWidth}px !important; max-width: ${colWidth}px !important;`;
            innerHTML += `
                #${this.id}-table > .p-datatable-thead > tr > th:nth-child(${index + 1}),
                #${this.id}-table > .p-datatable-tbody > tr > td:nth-child(${index + 1}),
                #${this.id}-table > .p-datatable-tfoot > tr > td:nth-child(${index + 1}) {
                    ${style}
                }
            `;
        });
        this.renderer.setProperty(this.styleElement(), 'textContent', innerHTML);
    }

    onRowDragStart(event: any, index: number) {
        this.rowDragging.set(true);
        this.draggedRowIndex.set(index);
        event.dataTransfer.setData('text', 'b'); // For firefox
    }

    onRowDragOver(event: MouseEvent, index: number, rowElement: any) {
        if (this.rowDragging() && this.draggedRowIndex() !== index) {
            let rowY = DomHandler.getOffset(rowElement).top;
            let pageY = event.pageY;
            let rowMidY = rowY + DomHandler.getOuterHeight(rowElement) / 2;
            let prevRowElement = rowElement.previousElementSibling;

            if (pageY < rowMidY) {
                DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-bottom');

                this.droppedRowIndex.set(index);
                if (prevRowElement && !this.$unstyled()) DomHandler.addClass(prevRowElement, 'p-datatable-dragpoint-bottom');
                else !this.$unstyled() && DomHandler.addClass(rowElement, 'p-datatable-dragpoint-top');
            } else {
                if (prevRowElement && !this.$unstyled()) DomHandler.removeClass(prevRowElement, 'p-datatable-dragpoint-bottom');
                else !this.$unstyled() && DomHandler.addClass(rowElement, 'p-datatable-dragpoint-top');

                this.droppedRowIndex.set(index + 1);
                !this.$unstyled() && DomHandler.addClass(rowElement, 'p-datatable-dragpoint-bottom');
            }
        }
    }

    onRowDragLeave(event: Event, rowElement: any) {
        let prevRowElement = rowElement.previousElementSibling;
        if (prevRowElement) {
            !this.$unstyled() && DomHandler.removeClass(prevRowElement, 'p-datatable-dragpoint-bottom');
        }

        !this.$unstyled() && DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-bottom');
        !this.$unstyled() && DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-top');
    }

    onRowDragEnd(event: Event) {
        this.rowDragging.set(false);
        this.draggedRowIndex.set(null);
        this.droppedRowIndex.set(null);
    }

    onRowDrop(event: Event, rowElement: any) {
        if (this.droppedRowIndex() != null) {
            const droppedRowIndex = <number>this.droppedRowIndex();
            let dropIndex = <number>this.draggedRowIndex() > droppedRowIndex ? droppedRowIndex : droppedRowIndex === 0 ? 0 : droppedRowIndex - 1;
            ObjectUtils.reorderArray(this._value(), <number>this.draggedRowIndex(), dropIndex);

            if (this.virtualScroll()) {
                // TODO: Check
                this._value.set([...this._value()]);
            }

            this.onRowReorder.emit({
                dragIndex: <number>this.draggedRowIndex(),
                dropIndex: dropIndex
            });
        }
        //cleanup
        this.onRowDragLeave(event, rowElement);
        this.onRowDragEnd(event);
    }

    // keyboard alternative to the drag and drop: move the row one place up (-1) or down (1)
    onRowKeyboardReorder(event: KeyboardEvent, index: number, offset: number) {
        const value = this._value();
        const dropIndex = index + offset;

        if (value && dropIndex >= 0 && dropIndex < value.length) {
            event.preventDefault();
            ObjectUtils.reorderArray(value, index, dropIndex);

            if (this.virtualScroll()) {
                this._value.set([...value]);
            }

            this.onRowReorder.emit({
                dragIndex: index,
                dropIndex: dropIndex
            });
            this.announceReorder('rowMoved', dropIndex + 1, value.length);
        }
    }

    readonly isEmpty = computed(() => {
        let data = this.filteredValue() || this._value();
        return data == null || data.length == 0;
    });

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    getStorage() {
        if (isPlatformBrowser(this.platformId)) {
            switch (this.stateStorage()) {
                case 'local':
                    return window.localStorage;

                case 'session':
                    return window.sessionStorage;

                default:
                    throw new Error(this.stateStorage() + ' is not a valid value for the state storage, supported values are "local" and "session".');
            }
        } else {
            throw new Error('Browser storage is not available in the server side.');
        }
    }

    isStateful() {
        return this.stateKey() != null;
    }

    saveState() {
        const storage = this.getStorage();
        let state: TableState = {};

        if (this.paginator()) {
            state.first = <number>this.first();
            state.rows = this.rows();
        }

        if (this._sortField()) {
            state.sortField = <string>this._sortField();
            state.sortOrder = this._sortOrder();
        }

        if (this._multiSortMeta()) {
            state.multiSortMeta = <SortMeta[]>this._multiSortMeta();
        }

        if (this.hasFilter()) {
            state.filters = this._filters();
        }

        if (this.resizableColumns()) {
            this.saveColumnWidths(state);
        }

        if (this.reorderableColumns()) {
            this.saveColumnOrder(state);
        }

        if (this.selection()) {
            state.selection = this.selection();
        }

        if (Object.keys(this._expandedRowKeys()).length) {
            state.expandedRowKeys = this._expandedRowKeys();
        }

        storage.setItem(<string>this.stateKey(), JSON.stringify(state));
        this.onStateSave.emit(state);
    }

    clearState() {
        const storage = this.getStorage();

        if (this.stateKey()) {
            storage.removeItem(<string>this.stateKey());
        }
    }

    restoreState() {
        const storage = this.getStorage();
        const stateString = storage.getItem(<string>this.stateKey());
        const dateFormat = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
        const reviver = function (key: any, value: any) {
            if (typeof value === 'string' && dateFormat.test(value)) {
                return new Date(value);
            }

            return value;
        };

        if (stateString) {
            let state: TableState = JSON.parse(stateString, reviver);

            if (this.paginator()) {
                if (this.first() !== undefined && state.first !== undefined) {
                    this.first.set(state.first);
                }

                if (this.rows() !== undefined && state.rows !== undefined) {
                    this.rows.set(state.rows);
                }
            }

            if (state.sortField) {
                this.restoringSort.set(true);
                this._sortField.set(state.sortField);
                this._sortOrder.set(<number>state.sortOrder);
            }

            if (state.multiSortMeta) {
                this.restoringSort.set(true);
                this._multiSortMeta.set(state.multiSortMeta);
            }

            if (state.filters) {
                this.restoringFilter.set(true);
                this._filters.set(state.filters);
            }

            if (this.resizableColumns()) {
                this.columnWidthsState.set(state.columnWidths);
                this.tableWidthState.set(state.tableWidth);
            }

            if (state.expandedRowKeys) {
                this._expandedRowKeys.set(state.expandedRowKeys);
            }

            if (state.selection) {
                Promise.resolve(null).then(() => this.selection.set(state.selection));
            }

            this.stateRestored.set(true);

            this.onStateRestore.emit(state);
        }
    }

    saveColumnWidths(state: any) {
        let widths: any[] = [];
        let headers: any[] = [];

        const container = this.el?.nativeElement;

        if (container) {
            headers = DomHandler.find(container, '[data-pc-section="thead"] > tr > th');
        }

        headers.forEach((header) => (widths as any[]).push(DomHandler.getOuterWidth(header)));
        state.columnWidths = widths.join(',');

        const tableViewChild = this.tableViewChild();
        if (this.columnResizeMode() === 'expand' && tableViewChild) {
            state.tableWidth = DomHandler.getOuterWidth(tableViewChild.nativeElement);
        }
    }

    setResizeTableWidth(width: string) {
        (<ElementRef>this.tableViewChild()).nativeElement.style.width = width;
        (<ElementRef>this.tableViewChild()).nativeElement.style.minWidth = width;
    }

    restoreColumnWidths() {
        if (this.columnWidthsState()) {
            let widths = (<string>this.columnWidthsState()).split(',');

            if (this.columnResizeMode() === 'expand' && this.tableWidthState()) {
                this.setResizeTableWidth(this.tableWidthState() + 'px');
            }

            if (ObjectUtils.isNotEmpty(widths)) {
                this.createStyleElement();

                let innerHTML = '';
                widths.forEach((width, index) => {
                    let style = `width: ${width}px !important; max-width: ${width}px !important`;

                    innerHTML += `
                        #${this.id}-table > .p-datatable-thead > tr > th:nth-child(${index + 1}),
                        #${this.id}-table > .p-datatable-tbody > tr > td:nth-child(${index + 1}),
                        #${this.id}-table > .p-datatable-tfoot > tr > td:nth-child(${index + 1}) {
                            ${style}
                        }
                    `;
                });

                this.styleElement().textContent = innerHTML;
            }
        }
    }

    saveColumnOrder(state: any) {
        if (this._columns()) {
            let columnOrder: string[] = [];
            this._columns()!.map((column) => {
                columnOrder.push(column.field || column.key);
            });

            state.columnOrder = columnOrder;
        }
    }

    restoreColumnOrder() {
        const storage = this.getStorage();
        const stateString = storage.getItem(<string>this.stateKey());
        if (stateString) {
            let state: TableState = JSON.parse(stateString);
            let columnOrder = state.columnOrder;

            if (columnOrder) {
                let reorderedColumns: any[] = [];

                columnOrder.map((key) => {
                    let col = this.findColumnByKey(key);
                    if (col) {
                        reorderedColumns.push(col);
                    }
                });
                this.columnOrderStateRestored.set(true);
                this._columns.set(reorderedColumns);
            }
        }
    }

    findColumnByKey(key: any) {
        if (this._columns()) {
            for (let col of this._columns()!) {
                if (col.key === key || col.field === key) return col;
                else continue;
            }
        } else {
            return null;
        }
    }

    createStyleElement() {
        this.styleElement.set(this.renderer.createElement('style'));
        this.styleElement().type = 'text/css';
        DomHandler.setAttribute(this.styleElement(), 'nonce', this.config?.csp()?.nonce);
        this.renderer.appendChild(this.document.head, this.styleElement());
        DomHandler.setAttribute(this.styleElement(), 'nonce', this.config?.csp()?.nonce);
    }

    getGroupRowsMeta() {
        return { field: this.groupRowsBy(), order: this.groupRowsByOrder() };
    }

    createResponsiveStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.responsiveStyleElement()) {
                this.responsiveStyleElement.set(this.renderer.createElement('style'));
                this.responsiveStyleElement().type = 'text/css';
                DomHandler.setAttribute(this.responsiveStyleElement(), 'nonce', this.config?.csp()?.nonce);
                this.renderer.appendChild(this.document.head, this.responsiveStyleElement());

                let innerHTML = `
    #${this.id}-table > .p-datatable-tbody > tr > td > .p-datatable-column-title {
        display: none;
    }

    @media screen and (max-width: ${this.breakpoint()}) {
        #${this.id}-table > .p-datatable-thead > tr > th,
        #${this.id}-table > .p-datatable-tfoot > tr > td {
            display: none !important;
        }

        #${this.id}-table > .p-datatable-tbody > tr > td {
            display: flex;
            width: 100% !important;
            align-items: center;
            justify-content: space-between;
        }

        #${this.id}-table > .p-datatable-tbody > tr > td:not(:last-child) {
            border: 0 none;
        }

        .p-datatable-gridlines #${this.id}-table > .p-datatable-tbody > tr > td:last-child {
            border-top: 0;
            border-right: 0;
            border-left: 0;
        }

        #${this.id}-table > .p-datatable-tbody > tr > td > .p-datatable-column-title {
            display: block;
        }
    }
    `;
                this.renderer.setProperty(this.responsiveStyleElement(), 'textContent', innerHTML);
                DomHandler.setAttribute(this.responsiveStyleElement(), 'nonce', this.config?.csp()?.nonce);
            }
        }
    }

    destroyResponsiveStyle() {
        if (this.responsiveStyleElement()) {
            this.renderer.removeChild(this.document.head, this.responsiveStyleElement());
            this.responsiveStyleElement.set(null);
        }
    }

    destroyStyleElement() {
        if (this.styleElement()) {
            this.renderer.removeChild(this.document.head, this.styleElement());
            this.styleElement.set(null);
        }
    }

    private containerResizeObserver: ResizeObserver | undefined;

    // the virtual scroller measures its viewport on its first render and on window resizes only: a container sized
    // later (a dialog opening, a flex layout settling) left it with no rows, so tell it when the container size changes
    observeContainerSize() {
        const ResizeObserverType = this.document.defaultView?.ResizeObserver;
        const wrapper = this.wrapperViewChild()?.nativeElement;

        if (ResizeObserverType && wrapper && !this.containerResizeObserver) {
            this.containerResizeObserver = new ResizeObserverType(() => {
                if (this.virtualScroll()) {
                    this.scroller()?.onWindowResize();
                }
            });
            this.containerResizeObserver.observe(wrapper);
        }
    }

    onDestroy() {
        this.unbindDocumentEditListener();
        this.editingCell.set(null);
        this.initialized.set(null);
        this.containerResizeObserver?.disconnect();
        this.unbindColumnDragScrollLock();

        this.destroyStyleElement();
        this.destroyResponsiveStyle();
    }

    readonly dataP = computed(() => {
        return this.cn({
            scrollable: this.scrollable(),
            'flex-scrollable': this.scrollable() && this.scrollHeight() === 'flex',
            [this.size() as string]: this.size(),
            loading: this.loading(),
            empty: this.isEmpty()
        });
    });
}

/**
 * @internal Rendering detail of Table, not part of the public API: it may change or stop being exported in a minor version.
 */
@Component({
    selector: '[pTableBody]',
    standalone: false,
    template: `
        @if (!dataTable.expandedRowTemplate() && !dataTable._expandedRowTemplate()) {
            @for (rowData of value(); track dataTable.rowTrackBy()(rowIndex, rowData); let rowIndex = $index) {
                @if ((dataTable.groupHeaderTemplate() || dataTable._groupHeaderTemplate()) && rowData && dataTable.rowGroupMode() === 'subheader' && shouldRenderRowGroupHeader(value(), rowData, getGroupRowIndex(rowIndex))) {
                    <ng-container role="row">
                        <ng-container
                            *ngTemplateOutlet="
                                dataTable.groupHeaderTemplate() || dataTable._groupHeaderTemplate();
                                context: {
                                    $implicit: rowData,
                                    rowIndex: getRowIndex(rowIndex),
                                    columns: columns(),
                                    editing: dataTable.editMode() === 'row' && dataTable.isRowEditing(rowData),
                                    frozen: frozen()
                                }
                            "
                        ></ng-container>
                    </ng-container>
                }
                @if (dataTable.rowGroupMode() !== 'rowspan') {
                    <ng-container
                        *ngTemplateOutlet="
                            rowData ? template() : dataTable.loadingBodyTemplate() || dataTable._loadingBodyTemplate();
                            context: {
                                $implicit: rowData,
                                rowIndex: getRowIndex(rowIndex),
                                columns: columns(),
                                editing: dataTable.editMode() === 'row' && dataTable.isRowEditing(rowData),
                                frozen: frozen()
                            }
                        "
                    ></ng-container>
                }
                @if (dataTable.rowGroupMode() === 'rowspan') {
                    <ng-container
                        *ngTemplateOutlet="
                            rowData ? template() : dataTable.loadingBodyTemplate() || dataTable._loadingBodyTemplate();
                            context: {
                                $implicit: rowData,
                                rowIndex: getRowIndex(rowIndex),
                                columns: columns(),
                                editing: dataTable.editMode() === 'row' && dataTable.isRowEditing(rowData),
                                frozen: frozen(),
                                rowgroup: shouldRenderRowspan(value(), rowData, rowIndex),
                                rowspan: calculateRowGroupSize(value(), rowData, rowIndex)
                            }
                        "
                    ></ng-container>
                }
                @if ((dataTable.groupFooterTemplate() || dataTable._groupFooterTemplate()) && rowData && dataTable.rowGroupMode() === 'subheader' && shouldRenderRowGroupFooter(value(), rowData, getGroupRowIndex(rowIndex))) {
                    <ng-container role="row">
                        <ng-container
                            *ngTemplateOutlet="
                                dataTable.groupFooterTemplate() || dataTable._groupFooterTemplate();
                                context: {
                                    $implicit: rowData,
                                    rowIndex: getRowIndex(rowIndex),
                                    columns: columns(),
                                    editing: dataTable.editMode() === 'row' && dataTable.isRowEditing(rowData),
                                    frozen: frozen()
                                }
                            "
                        ></ng-container>
                    </ng-container>
                }
            }
        }
        @if ((dataTable.expandedRowTemplate() || dataTable._expandedRowTemplate()) && !(frozen() && (dataTable.frozenExpandedRowTemplate() || dataTable._frozenExpandedRowTemplate()))) {
            @for (rowData of value(); track dataTable.rowTrackBy()(rowIndex, rowData); let rowIndex = $index) {
                @if ((dataTable.groupHeaderTemplate() || dataTable._groupHeaderTemplate()) && dataTable.rowGroupMode() === 'subheader' && shouldRenderRowGroupHeader(value(), rowData, getGroupRowIndex(rowIndex))) {
                    <ng-container role="row">
                        <ng-container
                            *ngTemplateOutlet="
                                dataTable.groupHeaderTemplate() || dataTable._groupHeaderTemplate();
                                context: {
                                    $implicit: rowData,
                                    rowIndex: getRowIndex(rowIndex),
                                    columns: columns(),
                                    expanded: dataTable.isRowExpanded(rowData),
                                    editing: dataTable.editMode() === 'row' && dataTable.isRowEditing(rowData),
                                    frozen: frozen()
                                }
                            "
                        ></ng-container>
                    </ng-container>
                }
                @if (!(dataTable.groupHeaderTemplate() && dataTable._groupHeaderTemplate())) {
                    <ng-container
                        *ngTemplateOutlet="
                            rowData ? template() : dataTable.loadingBodyTemplate() || dataTable._loadingBodyTemplate();
                            context: {
                                $implicit: rowData,
                                rowIndex: getRowIndex(rowIndex),
                                columns: columns(),
                                expanded: dataTable.isRowExpanded(rowData),
                                editing: dataTable.editMode() === 'row' && dataTable.isRowEditing(rowData),
                                frozen: frozen()
                            }
                        "
                    ></ng-container>
                }
                @if (dataTable.isRowExpanded(rowData)) {
                    <ng-container
                        *ngTemplateOutlet="
                            dataTable.expandedRowTemplate() || dataTable._expandedRowTemplate();
                            context: {
                                $implicit: rowData,
                                rowIndex: getRowIndex(rowIndex),
                                columns: columns(),
                                frozen: frozen()
                            }
                        "
                    ></ng-container>
                    @if ((dataTable.groupFooterTemplate() || dataTable._groupFooterTemplate()) && dataTable.rowGroupMode() === 'subheader' && shouldRenderRowGroupFooter(value(), rowData, getGroupRowIndex(rowIndex))) {
                        <ng-container role="row">
                            <ng-container
                                *ngTemplateOutlet="
                                    dataTable.groupFooterTemplate() || dataTable._groupFooterTemplate();
                                    context: {
                                        $implicit: rowData,
                                        rowIndex: getRowIndex(rowIndex),
                                        columns: columns(),
                                        expanded: dataTable.isRowExpanded(rowData),
                                        editing: dataTable.editMode() === 'row' && dataTable.isRowEditing(rowData),
                                        frozen: frozen()
                                    }
                                "
                            ></ng-container>
                        </ng-container>
                    }
                }
            }
        }
        @if ((dataTable.frozenExpandedRowTemplate() || dataTable._frozenExpandedRowTemplate()) && frozen()) {
            @for (rowData of value(); track dataTable.rowTrackBy()(rowIndex, rowData); let rowIndex = $index) {
                <ng-container
                    *ngTemplateOutlet="
                        template();
                        context: {
                            $implicit: rowData,
                            rowIndex: getRowIndex(rowIndex),
                            columns: columns(),
                            expanded: dataTable.isRowExpanded(rowData),
                            editing: dataTable.editMode() === 'row' && dataTable.isRowEditing(rowData),
                            frozen: frozen()
                        }
                    "
                ></ng-container>
                @if (dataTable.isRowExpanded(rowData)) {
                    <ng-container
                        *ngTemplateOutlet="
                            dataTable.frozenExpandedRowTemplate() || dataTable._frozenExpandedRowTemplate();
                            context: {
                                $implicit: rowData,
                                rowIndex: getRowIndex(rowIndex),
                                columns: columns(),
                                frozen: frozen()
                            }
                        "
                    ></ng-container>
                }
            }
        }
        @if (dataTable.loading()) {
            <ng-container *ngTemplateOutlet="dataTable.loadingBodyTemplate() || dataTable._loadingBodyTemplate(); context: { $implicit: columns(), frozen: frozen() }"></ng-container>
        }
        @if (dataTable.isEmpty() && !dataTable.loading() && !frozenRows()) {
            <ng-container *ngTemplateOutlet="dataTable.emptyMessageTemplate() || dataTable._emptyMessageTemplate(); context: { $implicit: columns(), frozen: frozen() }"></ng-container>
        }
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.data-p]': 'dataP()'
    }
})
export class TableBody extends BaseComponent {
    dataTable = inject(Table);
    tableService = inject(TableService);

    hostName = 'Table';

    readonly columns = input<any[] | undefined>(undefined, { alias: 'pTableBody' });

    readonly template = input<Nullable<TemplateRef<any>>>(undefined, { alias: 'pTableBodyTemplate' });

    readonly value = input<any[] | undefined>();

    readonly frozen = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly frozenRows = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly scrollerOptions = input<any>();

    subscription: Subscription = this.dataTable.tableService.valueSource$.subscribe(() => {
        if (this.dataTable.virtualScroll()) {
            this.cd.detectChanges();
        }
    });

    private headerResizeObserver: ResizeObserver | undefined;

    constructor() {
        super();
        afterNextRender(() => {
            if (this.frozenRows()) {
                this.updateFrozenRowStickyPosition();
            }

            if (this.dataTable.scrollable() && this.dataTable.rowGroupMode() === 'subheader') {
                this.updateFrozenRowGroupHeaderStickyPosition();
            }

            this.observeHeaderSize();
        });
        effect(() => {
            this.value();

            untracked(() => {
                if (this.frozenRows()) {
                    this.updateFrozenRowStickyPosition();
                }

                if (this.dataTable.scrollable() && this.dataTable.rowGroupMode() === 'subheader') {
                    this.updateFrozenRowGroupHeaderStickyPosition();
                }
            });
        });
    }

    shouldRenderRowGroupHeader(value: any, rowData: any, i: number) {
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.dataTable?.groupRowsBy() || '');
        let prevRowData = value[i - (this.dataTable?.first() || 0) - 1];
        if (prevRowData) {
            let previousRowFieldData = ObjectUtils.resolveFieldData(prevRowData, this.dataTable?.groupRowsBy() || '');
            return currentRowFieldData !== previousRowFieldData;
        } else {
            return true;
        }
    }

    shouldRenderRowGroupFooter(value: any, rowData: any, i: number) {
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.dataTable?.groupRowsBy() || '');
        let nextRowData = value[i - (this.dataTable?.first() || 0) + 1];
        if (nextRowData) {
            let nextRowFieldData = ObjectUtils.resolveFieldData(nextRowData, this.dataTable?.groupRowsBy() || '');
            return currentRowFieldData !== nextRowFieldData;
        } else {
            return true;
        }
    }

    shouldRenderRowspan(value: any, rowData: any, i: number) {
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.dataTable?.groupRowsBy()!);
        let prevRowData = value[i - 1];
        if (prevRowData) {
            let previousRowFieldData = ObjectUtils.resolveFieldData(prevRowData, this.dataTable?.groupRowsBy() || '');
            return currentRowFieldData !== previousRowFieldData;
        } else {
            return true;
        }
    }

    calculateRowGroupSize(value: any, rowData: any, index: number) {
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.dataTable?.groupRowsBy()!);
        let nextRowFieldData = currentRowFieldData;
        let groupRowSpan = 0;

        while (currentRowFieldData === nextRowFieldData) {
            groupRowSpan++;
            let nextRowData = value[++index];
            if (nextRowData) {
                nextRowFieldData = ObjectUtils.resolveFieldData(nextRowData, this.dataTable?.groupRowsBy() || '');
            } else {
                break;
            }
        }

        return groupRowSpan === 1 ? null : groupRowSpan;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.headerResizeObserver?.disconnect();
    }

    // the sticky rows are placed under the header, whose height can change after the first render (a component
    // or an image in it, a wrapped title): follow its size instead of measuring it once
    observeHeaderSize() {
        const header = this.el.nativeElement.previousElementSibling;
        const ResizeObserverType = this.document.defaultView?.ResizeObserver;
        const isSticky = this.frozenRows() || (this.dataTable.scrollable() && this.dataTable.rowGroupMode() === 'subheader');

        if (isPlatformBrowser(this.platformId) && header && ResizeObserverType && isSticky && !this.headerResizeObserver) {
            this.headerResizeObserver = new ResizeObserverType(() => {
                if (this.frozenRows()) {
                    this.updateFrozenRowStickyPosition();
                }

                if (this.dataTable.scrollable() && this.dataTable.rowGroupMode() === 'subheader') {
                    this.updateFrozenRowGroupHeaderStickyPosition();
                }
            });
            this.headerResizeObserver.observe(header);
        }
    }

    updateFrozenRowStickyPosition() {
        this.el.nativeElement.style.top = DomHandler.getOuterHeight(this.el.nativeElement.previousElementSibling) + 'px';
    }

    updateFrozenRowGroupHeaderStickyPosition() {
        if (this.el.nativeElement.previousElementSibling) {
            let tableHeaderHeight = DomHandler.getOuterHeight(this.el.nativeElement.previousElementSibling);
            this.dataTable.rowGroupHeaderStyleObject.top = tableHeaderHeight + 'px';
            // a signal: the row group headers bind it, and a plain object changed after their check threw NG0100
            this.dataTable.rowGroupHeaderTop.set(tableHeaderHeight + 'px');
        }
    }

    getScrollerOption(option: any, options?: any) {
        if (this.dataTable.virtualScroll()) {
            options = options || this.scrollerOptions();
            return options ? options[option] : null;
        }

        return null;
    }

    getRowIndex(rowIndex: number) {
        const index = this.dataTable.paginator() ? <number>this.dataTable.first() + rowIndex : rowIndex;
        const getItemOptions = this.getScrollerOption('getItemOptions');
        return getItemOptions ? getItemOptions(index).index : index;
    }

    // the group header/footer checks compare a row with its neighbours in value(); with virtual scroll
    // value() only holds the rendered slice, so the index must stay relative to that slice
    getGroupRowIndex(rowIndex: number) {
        return this.dataTable.virtualScroll() ? rowIndex + (this.dataTable.first() || 0) : this.getRowIndex(rowIndex);
    }

    readonly dataP = computed(() => {
        return this.cn({
            hoverable: this.dataTable.rowHover() || this.dataTable.selectionMode(),
            frozen: this.frozen()
        });
    });
}

/**
 * Styles a row as a row group header, with rowGroupMode set to subheader, and keeps it in place while scrolling.
 */
@Directive({
    selector: '[pRowGroupHeader]',
    standalone: false,
    host: {
        '[class]': 'cx("rowGroupHeader")',
        '[style]': 'sx("rowGroupHeader")'
    },
    providers: [TableStyle]
})
export class RowGroupHeader extends BaseComponent {
    dataTable = inject(Table);

    _componentStyle = inject(TableStyle);

    get getFrozenRowGroupHeaderStickyPosition() {
        return this.dataTable.rowGroupHeaderTop();
    }
}

/**
 * Keeps a column in place while the table scrolls horizontally. frozen toggles it and alignFrozen sticks it to the left or the right.
 */
@Directive({
    selector: '[pFrozenColumn]',
    standalone: false,
    host: {
        '[class]': 'cx("frozenColumn")',
        '[attr.data-p-frozen-column]': 'frozen()'
    },
    providers: [TableStyle]
})
export class FrozenColumn extends BaseComponent {
    /**
     * Whether the column is frozen.
     * @group Props
     */
    readonly frozen = input<boolean>(true);

    /**
     * Side the frozen column sticks to.
     * @group Props
     */
    readonly alignFrozen = input<string>('left');

    resizeListener = signal<VoidListener>(undefined);

    _componentStyle = inject(TableStyle);

    constructor() {
        super();
        effect(() => {
            this.frozen();

            untracked(() => Promise.resolve(null).then(() => this.updateStickyPosition()));
        });
        afterNextRender(() => this.bindResizeListener());
    }

    // every frozen cell of the page shares one window resize listener and one ResizeObserver
    bindResizeListener() {
        if (isPlatformBrowser(this.platformId) && !this.resizeListener()) {
            const tracker = FrozenColumnTracker.get(this.document.defaultView!);
            tracker.add(this);
            this.resizeListener.set(() => tracker.remove(this));
        }
    }

    unbindResizeListener() {
        if (this.resizeListener()) {
            this.resizeListener()!();
            this.resizeListener.set(null);
        }
    }

    observeChanges() {
        this.bindResizeListener();
    }

    recalculateColumns() {
        if (isPlatformBrowser(this.platformId)) {
            FrozenColumnTracker.get(this.document.defaultView!).schedule();
        }
    }

    updateStickyPosition() {
        if (this.frozen() && isPlatformBrowser(this.platformId)) {
            // alignFrozen is logical: in RTL the start (left alignment) is the physical right side
            const isRTL = this.document.defaultView?.getComputedStyle(this.el.nativeElement).direction === 'rtl';
            const startSide = isRTL ? 'right' : 'left';
            const endSide = isRTL ? 'left' : 'right';

            const spannedOffset = this.getSpannedRowsOffset();

            if (this.alignFrozen() === 'right') {
                let end = 0;
                if (spannedOffset) {
                    end = spannedOffset.end;
                } else {
                    let sibling = this.el.nativeElement.nextElementSibling;
                    while (sibling) {
                        end += this.getFrozenWidth(sibling);
                        sibling = sibling.nextElementSibling;
                    }
                }
                this.el.nativeElement.style[endSide] = end + 'px';
                this.el.nativeElement.style[startSide] = '';
            } else {
                let start = 0;
                if (spannedOffset) {
                    start = spannedOffset.start;
                } else {
                    let sibling = this.el.nativeElement.previousElementSibling;
                    while (sibling) {
                        start += this.getFrozenWidth(sibling);
                        sibling = sibling.previousElementSibling;
                    }
                }
                this.el.nativeElement.style[startSide] = start + 'px';
                this.el.nativeElement.style[endSide] = '';
            }

            const filterRow = this.el.nativeElement?.parentElement?.nextElementSibling;
            if (filterRow) {
                let index = DomHandler.index(this.el.nativeElement);
                if (filterRow.children && filterRow.children[index]) {
                    filterRow.children[index].style.left = this.el.nativeElement.style.left;
                    filterRow.children[index].style.right = this.el.nativeElement.style.right;
                }
            }
        }
    }

    /**
     * In a header or footer of several rows, the frozen cells before or after this one can be in a previous row and span down
     * to this one (rowspan): place the cells on the column grid of the section to find them. Null when no cell spans rows.
     */
    private getSpannedRowsOffset(): { start: number; end: number } | null {
        const cell = this.el.nativeElement as HTMLTableCellElement;
        const section = cell.parentElement?.parentElement as HTMLTableSectionElement | null | undefined;

        if (!section || (section.tagName !== 'THEAD' && section.tagName !== 'TFOOT')) {
            return null;
        }

        const rows = Array.from(section.rows);
        if (!rows.some((row) => Array.from(row.cells).some((c) => c.rowSpan !== 1))) {
            return null;
        }

        const placed: { cell: HTMLTableCellElement; row: number; col: number; rowSpan: number; colSpan: number }[] = [];
        const taken: boolean[][] = [];
        rows.forEach((row, rowIndex) => {
            let col = 0;
            for (const c of Array.from(row.cells)) {
                while (taken[rowIndex]?.[col]) col++;
                const rowSpan = c.rowSpan === 0 ? rows.length - rowIndex : c.rowSpan;
                const colSpan = c.colSpan || 1;
                placed.push({ cell: c, row: rowIndex, col, rowSpan, colSpan });
                for (let i = 0; i < rowSpan; i++) for (let j = 0; j < colSpan; j++) (taken[rowIndex + i] ??= [])[col + j] = true;
                col += colSpan;
            }
        });

        const self = placed.find((p) => p.cell === cell);
        if (!self) {
            return null;
        }

        let start = 0;
        let end = 0;
        for (const p of placed) {
            if (p.cell !== cell && p.row <= self.row && self.row < p.row + p.rowSpan) {
                if (p.col + p.colSpan <= self.col) start += this.getFrozenWidth(p.cell);
                else if (p.col >= self.col + self.colSpan) end += this.getFrozenWidth(p.cell);
            }
        }

        return { start, end };
    }

    // only the frozen (sticky) cells stay between a frozen cell and the edge: the others scroll away
    private getFrozenWidth(cell: HTMLElement): number {
        return cell.getAttribute('data-p-frozen-column') === 'true' ? DomHandler.getOuterWidth(cell) : 0;
    }

    onDestroy() {
        this.unbindResizeListener();
    }
}

/**
 * Recalculates the sticky positions of all the frozen cells of a window once per frame on a window resize or a size change of
 * any of them. A listener and an observer per cell made a resize or a page of many frozen cells block the page for seconds.
 */
class FrozenColumnTracker {
    private static trackers = new WeakMap<Window, FrozenColumnTracker>();

    private columns = new Set<FrozenColumn>();

    private observer: ResizeObserver;

    private frame: number | null = null;

    private onResize = () => this.schedule();

    static get(window: Window): FrozenColumnTracker {
        let tracker = this.trackers.get(window);
        if (!tracker) {
            tracker = new FrozenColumnTracker(window);
            this.trackers.set(window, tracker);
        }
        return tracker;
    }

    private constructor(private window: Window) {
        this.observer = new (window as any).ResizeObserver(this.onResize);
    }

    add(column: FrozenColumn) {
        if (!this.columns.size) {
            this.window.addEventListener('resize', this.onResize);
        }
        this.columns.add(column);
        this.observer.observe(column.el.nativeElement);
    }

    remove(column: FrozenColumn) {
        this.columns.delete(column);
        this.observer.unobserve(column.el.nativeElement);
        if (!this.columns.size) {
            this.window.removeEventListener('resize', this.onResize);
            this.frame !== null && this.window.cancelAnimationFrame(this.frame);
            this.frame = null;
        }
    }

    schedule() {
        if (this.frame === null && this.columns.size) {
            this.frame = this.window.requestAnimationFrame(() => {
                this.frame = null;
                this.columns.forEach((column) => column.updateStickyPosition());
            });
        }
    }
}
/**
 * Sorts the table by a field when the header cell is clicked or activated with the keyboard: `[pSortableColumn]="'name'"`.
 */
@Directive({
    selector: '[pSortableColumn]',
    standalone: false,
    host: {
        '[class]': "cx('sortableColumn')",
        '[tabindex]': 'isEnabled() ? "0" : null',
        '[attr.role]': 'role',
        '[attr.aria-sort]': 'sortOrder()'
    },
    providers: [TableStyle]
})
export class SortableColumn extends BaseComponent {
    dataTable = inject(Table);

    readonly field = input<string | undefined>(undefined, { alias: 'pSortableColumn' });

    readonly pSortableColumnDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    role = this.el.nativeElement?.tagName !== 'TH' ? 'columnheader' : null;

    readonly sorted = signal<boolean | undefined>(undefined);

    readonly sortOrder = signal<string | undefined>(undefined);

    subscription: Subscription | undefined;

    _componentStyle = inject(TableStyle);

    constructor() {
        super();
        if (this.isEnabled()) {
            this.subscription = this.dataTable.tableService.sortSource$.subscribe(() => {
                this.updateSortState();
            });
        }
    }

    onInit() {
        if (this.isEnabled()) {
            this.updateSortState();
        }
    }

    updateSortState() {
        let sorted = false;
        let sortOrder = 0;

        if (this.dataTable.sortMode() === 'single') {
            sorted = this.dataTable.isSorted(<string>this.field()) as boolean;
            sortOrder = this.dataTable._sortOrder();
        } else if (this.dataTable.sortMode() === 'multiple') {
            const sortMeta = this.dataTable.getSortMeta(<string>this.field());
            sorted = !!sortMeta;
            sortOrder = sortMeta ? sortMeta.order : 0;
        }

        this.sorted.set(sorted);
        this.sortOrder.set(sorted ? (sortOrder === 1 ? 'ascending' : 'descending') : 'none');
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        if (this.isEnabled() && !this.isFilterElement(<HTMLElement>event.target)) {
            this.updateSortState();
            this.dataTable.sort({
                originalEvent: event,
                field: this.field()
            });

            DomHandler.clearSelection();
        }
    }

    @HostListener('keydown.space', ['$event'])
    @HostListener('keydown.enter', ['$event'])
    // with a modifier the key adds the column to a multi-sort, like a meta/ctrl click
    @HostListener('keydown.meta.space', ['$event'])
    @HostListener('keydown.meta.enter', ['$event'])
    @HostListener('keydown.control.space', ['$event'])
    @HostListener('keydown.control.enter', ['$event'])
    onEnterKey(event: MouseEvent) {
        this.onClick(event);

        event.preventDefault();
    }

    isEnabled() {
        return this.pSortableColumnDisabled() !== true;
    }

    isFilterElement(element: HTMLElement) {
        return this.isFilterElementIconOrButton(element) || this.isFilterElementIconOrButton(element?.parentElement?.parentElement!);
    }

    private isFilterElementIconOrButton(element: HTMLElement) {
        return getAttribute(element, '[data-pc-name="pccolumnfilterbutton"]') || getAttribute(element, '[data-pc-section="columnfilterbuttonicon"]');
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

/**
 * Shows the sort state of a column. Place it in a header cell with pSortableColumn, with the same field.
 */
@Component({
    selector: 'p-sort-icon, p-sortIcon',
    standalone: false,
    template: `
        @if (!(dataTable.sortIconTemplate() || dataTable._sortIconTemplate())) {
            @if (sortOrder() === 0) {
                <svg data-p-icon="sort-alt" [class]="cx('sortableColumnIcon')" aria-hidden="true" />
            }
            @if (sortOrder() === 1) {
                <svg data-p-icon="sort-amount-up-alt" [class]="cx('sortableColumnIcon')" aria-hidden="true" />
            }
            @if (sortOrder() === -1) {
                <svg data-p-icon="sort-amount-down" [class]="cx('sortableColumnIcon')" aria-hidden="true" />
            }
        }
        @if (dataTable.sortIconTemplate() || dataTable._sortIconTemplate()) {
            <span [class]="cx('sortableColumnIcon')">
                <ng-template *ngTemplateOutlet="dataTable.sortIconTemplate() || dataTable._sortIconTemplate(); context: { $implicit: sortOrder() }"></ng-template>
            </span>
        }
        @if (isMultiSorted()) {
            <p-badge [class]="cx('sortableColumnBadge')" [value]="getBadgeValue()" size="small"></p-badge>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TableStyle]
})
export class SortIcon extends BaseComponent {
    dataTable = inject(Table);

    readonly field = input<string | undefined>();

    subscription: Subscription | undefined;

    readonly sortOrder = signal<number | undefined>(undefined);

    _componentStyle = inject(TableStyle);

    constructor() {
        super();
        this.subscription = this.dataTable.tableService.sortSource$.subscribe(() => {
            this.updateSortState();
        });
    }

    onInit() {
        this.updateSortState();
    }

    onClick(event: Event) {
        event.preventDefault();
    }

    updateSortState() {
        if (this.dataTable.sortMode() === 'single') {
            this.sortOrder.set(this.dataTable.isSorted(<string>this.field()) ? this.dataTable._sortOrder() : 0);
        } else if (this.dataTable.sortMode() === 'multiple') {
            let sortMeta = this.dataTable.getSortMeta(<string>this.field());
            this.sortOrder.set(sortMeta ? sortMeta.order : 0);
        }
    }

    getMultiSortMetaIndex() {
        let multiSortMeta = this.dataTable._multiSortMeta();
        let index = -1;

        if (multiSortMeta && this.dataTable.sortMode() === 'multiple' && this.dataTable.showInitialSortBadge() && multiSortMeta.length > 1) {
            for (let i = 0; i < multiSortMeta.length; i++) {
                let meta = multiSortMeta[i];
                if (meta.field === this.field()) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    getBadgeValue() {
        let index = this.getMultiSortMetaIndex();

        return (this.dataTable?.groupRowsBy() || '') && index > -1 ? index : index + 1;
    }

    isMultiSorted() {
        return this.dataTable.sortMode() === 'multiple' && this.getMultiSortMetaIndex() > -1;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

/**
 * Selects its row when clicked or activated with the keyboard, according to the selectionMode of the table. Bind the row data: `[pSelectableRow]="rowData"`, with pSelectableRowIndex.
 */
@Directive({
    selector: '[pSelectableRow]',
    standalone: false,
    host: {
        '[class]': "cx('selectableRow')",
        '[tabindex]': 'setRowTabIndex()',
        '[attr.data-p-selectable-row]': 'true'
    },
    providers: [TableStyle]
})
export class SelectableRow extends BaseComponent {
    dataTable = inject(Table);
    tableService = inject(TableService);

    readonly data = input<any>(undefined, { alias: 'pSelectableRow' });

    readonly index = input<number | undefined>(undefined, { alias: 'pSelectableRowIndex' });

    readonly pSelectableRowDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly selected = signal<boolean | undefined>(undefined);

    subscription: Subscription | undefined;

    _componentStyle = inject(TableStyle);

    constructor() {
        super();
        if (this.isEnabled()) {
            this.subscription = this.dataTable.tableService.selectionSource$.subscribe(() => {
                this.selected.set(this.dataTable.isSelected(this.data()));
            });
        }
    }

    setRowTabIndex() {
        if (this.dataTable.selectionMode() === 'single' || this.dataTable.selectionMode() === 'multiple') {
            // sort, filter and page changes reset the anchor row to null: keep the rows reachable by Tab
            return !this.dataTable.selection() || this.dataTable.anchorRowIndex() == null ? 0 : this.dataTable.anchorRowIndex() === this.index() ? 0 : -1;
        }
    }

    onInit() {
        if (this.isEnabled()) {
            this.selected.set(this.dataTable.isSelected(this.data()));
        }
    }

    @HostListener('click', ['$event'])
    onClick(event: Event) {
        if (this.isEnabled()) {
            this.dataTable.handleRowClick({
                originalEvent: event,
                rowData: this.data(),
                rowIndex: this.index()
            });
        }
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(event: Event) {
        if (this.isEnabled()) {
            this.dataTable.handleRowTouchEnd(event);
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
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

            case 'Space':
                this.onSpaceKey(event);
                break;

            case 'Enter':
                this.onEnterKey(event);
                break;

            default:
                if (event.code === 'KeyA' && (event.metaKey || event.ctrlKey) && this.dataTable.selectionMode() === 'multiple') {
                    const data = this.dataTable.dataToRender(this.dataTable.processedData());
                    this.dataTable.selection.set([...data]);
                    this.dataTable.selectRange(event, data.length - 1, true);

                    event.preventDefault();
                }
                break;
        }
    }

    onArrowDownKey(event: KeyboardEvent) {
        if (!this.isEnabled()) {
            return;
        }

        const row = <HTMLTableRowElement>event.currentTarget;
        const nextRow = this.findNextSelectableRow(row);

        if (nextRow) {
            nextRow.focus();
        }

        event.preventDefault();
    }

    onArrowUpKey(event: KeyboardEvent) {
        if (!this.isEnabled()) {
            return;
        }

        const row = <HTMLTableRowElement>event.currentTarget;
        const prevRow = this.findPrevSelectableRow(row);

        if (prevRow) {
            prevRow.focus();
        }

        event.preventDefault();
    }

    onEnterKey(event: KeyboardEvent) {
        if (!this.isEnabled()) {
            return;
        }

        this.dataTable.handleRowClick({
            originalEvent: event,
            rowData: this.data(),
            rowIndex: this.index()
        });
    }

    onEndKey(event: KeyboardEvent) {
        const lastRow = this.findLastSelectableRow();
        lastRow && this.focusRowChange(this.el.nativeElement, lastRow);

        if (event.ctrlKey && event.shiftKey) {
            const data = this.dataTable.dataToRender(this.dataTable.rows());
            const lastSelectableRowIndex = DomHandler.getAttribute(lastRow, 'index');

            this.dataTable.anchorRowIndex.set(lastSelectableRowIndex);
            this.dataTable.selection.set(data.slice(this.index() || 0, data.length));
            this.dataTable.selectRange(event, this.index() || 0);
        }
        event.preventDefault();
    }

    onHomeKey(event: KeyboardEvent) {
        const firstRow = this.findFirstSelectableRow();

        firstRow && this.focusRowChange(this.el.nativeElement, firstRow);

        if (event.ctrlKey && event.shiftKey) {
            const data = this.dataTable.dataToRender(this.dataTable.rows());
            const firstSelectableRowIndex = DomHandler.getAttribute(firstRow, 'index');

            this.dataTable.anchorRowIndex.set(this.dataTable.anchorRowIndex() || firstSelectableRowIndex || 0);
            this.dataTable.selection.set(data.slice(0, (this.index() || 0) + 1));
            this.dataTable.selectRange(event, this.index() || 0);
        }
        event.preventDefault();
    }

    onSpaceKey(event) {
        const isInput = event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement;
        if (isInput) {
            return;
        } else {
            this.onEnterKey(event);

            if (event.shiftKey && this.dataTable.selection() !== null) {
                const data = this.dataTable.dataToRender(this.dataTable.rows());
                let index;

                if (ObjectUtils.isNotEmpty(this.dataTable.selection()) && this.dataTable.selection().length > 0) {
                    let firstSelectedRowIndex, lastSelectedRowIndex;
                    firstSelectedRowIndex = ObjectUtils.findIndexInList(this.dataTable.selection()[0], data);
                    lastSelectedRowIndex = ObjectUtils.findIndexInList(this.dataTable.selection()[this.dataTable.selection().length - 1], data);

                    index = (this.index() || 0) <= firstSelectedRowIndex ? lastSelectedRowIndex : firstSelectedRowIndex;
                } else {
                    index = ObjectUtils.findIndexInList(this.dataTable.selection(), data);
                }

                this.dataTable.anchorRowIndex.set(index || 0);
                this.dataTable.selection.set(index !== this.index() ? data.slice(Math.min(index || 0, this.index() || 0), Math.max(index || 0, this.index() || 0) + 1) : [this.data()]);
                this.dataTable.selectRange(event, this.index() || 0);
            }

            event.preventDefault();
        }
    }

    focusRowChange(firstFocusableRow, currentFocusedRow) {
        firstFocusableRow.tabIndex = '-1';
        currentFocusedRow.tabIndex = '0';
        DomHandler.focus(currentFocusedRow);
    }

    findLastSelectableRow() {
        const rows = DomHandler.find(this.dataTable.el.nativeElement, '[data-p-selectable-row="true"]');

        return rows ? rows[rows.length - 1] : null;
    }

    findFirstSelectableRow() {
        const firstRow = DomHandler.findSingle(this.dataTable.el.nativeElement, '[data-p-selectable-row="true"]');

        return firstRow;
    }

    findNextSelectableRow(row: HTMLTableRowElement): HTMLTableRowElement | null {
        let nextRow = <HTMLTableRowElement>row.nextElementSibling;

        if (nextRow) {
            if (find(nextRow, '[data-p-selectable-row="true"]')) return nextRow;
            else return this.findNextSelectableRow(nextRow);
        } else {
            return null;
        }
    }

    findPrevSelectableRow(row: HTMLTableRowElement): HTMLTableRowElement | null {
        let prevRow = <HTMLTableRowElement>row.previousElementSibling;
        if (prevRow) {
            if (find(prevRow, '[data-p-selectable-row="true"]')) return prevRow;
            else return this.findPrevSelectableRow(prevRow);
        } else {
            return null;
        }
    }

    isEnabled() {
        return this.pSelectableRowDisabled() !== true;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

/**
 * Selects its row when double clicked. Bind the row data: `[pSelectableRowDblClick]="rowData"`.
 */
@Directive({
    selector: '[pSelectableRowDblClick]',
    standalone: false,
    host: {
        '[class]': 'cx("selectableRow")'
    },
    providers: [TableStyle]
})
export class SelectableRowDblClick extends BaseComponent {
    dataTable = inject(Table);
    tableService = inject(TableService);

    readonly data = input<any>(undefined, { alias: 'pSelectableRowDblClick' });

    readonly index = input<number | undefined>(undefined, { alias: 'pSelectableRowIndex' });

    readonly pSelectableRowDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly selected = signal<boolean | undefined>(undefined);

    subscription: Subscription | undefined;

    _componentStyle = inject(TableStyle);

    constructor() {
        super();
        if (this.isEnabled()) {
            this.subscription = this.dataTable.tableService.selectionSource$.subscribe(() => {
                this.selected.set(this.dataTable.isSelected(this.data()));
            });
        }
    }

    onInit() {
        if (this.isEnabled()) {
            this.selected.set(this.dataTable.isSelected(this.data()));
        }
    }

    @HostListener('dblclick', ['$event'])
    onClick(event: Event) {
        if (this.isEnabled()) {
            this.dataTable.handleRowClick({
                originalEvent: event,
                rowData: this.data(),
                rowIndex: this.index()
            });
        }
    }

    isEnabled() {
        return this.pSelectableRowDisabled() !== true;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

/**
 * Opens the context menu of the table when the row is right clicked, and sets the row as contextMenuSelection. Bind the row data: `[pContextMenuRow]="rowData"`.
 */
@Directive({
    selector: '[pContextMenuRow]',
    standalone: false,
    host: {
        '[class]': 'cx("contextMenuRowSelected")',
        '[attr.tabindex]': 'isEnabled() ? 0 : undefined'
    },
    providers: [TableStyle]
})
export class ContextMenuRow extends BaseComponent {
    dataTable = inject(Table);
    tableService = inject(TableService);

    readonly data = input<any>(undefined, { alias: 'pContextMenuRow' });

    readonly index = input<number | undefined>(undefined, { alias: 'pContextMenuRowIndex' });

    readonly pContextMenuRowDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly selected = signal<boolean | undefined>(undefined);

    subscription: Subscription | undefined;

    _componentStyle = inject(TableStyle);

    constructor() {
        super();
        if (this.isEnabled()) {
            this.subscription = this.dataTable.tableService.contextMenuSource$.subscribe((data) => {
                this.selected.set(data ? this.dataTable.equals(this.data(), data) : false);
            });
        }
    }

    @HostListener('contextmenu', ['$event'])
    onContextMenu(event: Event) {
        if (this.isEnabled()) {
            this.dataTable.handleRowRightClick({
                originalEvent: event,
                rowData: this.data(),
                rowIndex: this.index()
            });

            this.el.nativeElement.focus();
            event.preventDefault();
        }
    }

    isEnabled() {
        return this.pContextMenuRowDisabled() !== true;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

/**
 * Expands or collapses its row when clicked. Bind the row data: `[pRowToggler]="rowData"`; the table needs a dataKey and an `#expandedrow` template.
 */
@Directive({
    selector: '[pRowToggler]',
    standalone: false
})
export class RowToggler extends BaseComponent {
    dataTable = inject(Table);

    readonly data = input<any>(undefined, { alias: 'pRowToggler' });

    readonly pRowTogglerDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    @HostListener('click', ['$event'])
    onClick(event: Event) {
        if (this.isEnabled()) {
            this.dataTable.toggleRow(this.data(), event);
            event.preventDefault();
        }
    }

    isEnabled() {
        return this.pRowTogglerDisabled() !== true;
    }
}

/**
 * Adds a resizer to a header cell, with resizableColumns enabled on the table.
 */
@Directive({
    selector: '[pResizableColumn]',
    standalone: false,
    host: {
        '[class]': "cx('resizableColumn')"
    },
    providers: [TableStyle]
})
export class ResizableColumn extends BaseComponent {
    dataTable = inject(Table);
    zone = inject(NgZone);

    readonly pResizableColumnDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    resizer = signal<HTMLSpanElement | undefined>(undefined);

    resizerMouseDownListener = signal<VoidListener>(undefined);

    resizerTouchStartListener = signal<VoidListener>(undefined);

    resizerTouchMoveListener = signal<VoidListener>(undefined);

    resizerTouchEndListener = signal<VoidListener>(undefined);

    documentMouseMoveListener = signal<VoidListener>(undefined);

    documentMouseUpListener = signal<VoidListener>(undefined);

    _componentStyle = inject(TableStyle);

    constructor() {
        super();
        afterNextRender(() => {
            if (isPlatformBrowser(this.platformId)) {
                if (this.isEnabled()) {
                    const resizer: HTMLSpanElement = this.renderer.createElement('span');
                    this.resizer.set(resizer);
                    setAttribute(resizer, 'data-pc-column-resizer', 'true');
                    !this.$unstyled() && this.renderer.addClass(resizer, 'p-datatable-column-resizer');
                    this.renderer.appendChild(this.el.nativeElement, resizer);

                    this.zone.runOutsideAngular(() => {
                        this.resizerMouseDownListener.set(this.renderer.listen(resizer, 'mousedown', this.onMouseDown.bind(this)));
                        this.resizerTouchStartListener.set(this.renderer.listen(resizer, 'touchstart', this.onTouchStart.bind(this)));
                    });
                }
            }
        });
    }

    bindDocumentEvents() {
        this.zone.runOutsideAngular(() => {
            this.documentMouseMoveListener.set(this.renderer.listen(this.document, 'mousemove', this.onDocumentMouseMove.bind(this)));
            this.documentMouseUpListener.set(this.renderer.listen(this.document, 'mouseup', this.onDocumentMouseUp.bind(this)));
            this.resizerTouchMoveListener.set(this.renderer.listen(this.resizer(), 'touchmove', this.onTouchMove.bind(this)));
            this.resizerTouchEndListener.set(this.renderer.listen(this.resizer(), 'touchend', this.onTouchEnd.bind(this)));
        });
    }

    unbindDocumentEvents() {
        if (this.documentMouseMoveListener()) {
            this.documentMouseMoveListener()!();
            this.documentMouseMoveListener.set(null);
        }

        if (this.documentMouseUpListener()) {
            this.documentMouseUpListener()!();
            this.documentMouseUpListener.set(null);
        }
        if (this.resizerTouchMoveListener()) {
            this.resizerTouchMoveListener()!();
            this.resizerTouchMoveListener.set(null);
        }

        if (this.resizerTouchEndListener()) {
            this.resizerTouchEndListener()!();
            this.resizerTouchEndListener.set(null);
        }
    }

    onMouseDown(event: MouseEvent) {
        this.dataTable.onColumnResizeBegin(event);
        this.bindDocumentEvents();
    }

    onTouchStart(event: TouchEvent) {
        this.dataTable.onColumnResizeBegin(event);
        this.bindDocumentEvents();
    }

    onTouchMove(event: TouchEvent) {
        this.dataTable.onColumnResize(event);
    }
    onDocumentMouseMove(event: MouseEvent) {
        this.dataTable.onColumnResize(event);
    }

    onDocumentMouseUp(event: MouseEvent) {
        this.dataTable.onColumnResizeEnd();
        this.unbindDocumentEvents();
    }

    onTouchEnd(event: TouchEvent) {
        this.dataTable.onColumnResizeEnd();
        this.unbindDocumentEvents();
    }

    isEnabled() {
        return this.pResizableColumnDisabled() !== true;
    }

    onDestroy() {
        if (this.resizerMouseDownListener()) {
            this.resizerMouseDownListener()!();
            this.resizerMouseDownListener.set(null);
        }

        this.unbindDocumentEvents();
    }
}

/**
 * Lets a header cell be dragged to reorder the columns, with reorderableColumns enabled on the table.
 */
@Directive({
    selector: '[pReorderableColumn]',
    standalone: false,
    host: {
        '[class]': "cx('reorderableColumn')",
        '[attr.tabindex]': 'isEnabled() && dataTable.reorderableColumns() ? "0" : null',
        '[attr.aria-keyshortcuts]': 'isEnabled() && dataTable.reorderableColumns() ? "Control+ArrowLeft Control+ArrowRight Meta+ArrowLeft Meta+ArrowRight" : null'
    },
    providers: [TableStyle]
})
export class ReorderableColumn extends BaseComponent {
    dataTable = inject(Table);
    el = inject(ElementRef);
    zone = inject(NgZone);

    readonly pReorderableColumnDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    dragStartListener = signal<VoidListener>(undefined);

    dragOverListener = signal<VoidListener>(undefined);

    dragEnterListener = signal<VoidListener>(undefined);

    dragLeaveListener = signal<VoidListener>(undefined);

    dragEndListener = signal<VoidListener>(undefined);

    mouseDownListener = signal<VoidListener>(undefined);

    _componentStyle = inject(TableStyle);

    constructor() {
        super();
        afterNextRender(() => {
            if (this.isEnabled()) {
                this.bindEvents();
            }
        });
    }

    bindEvents() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.mouseDownListener.set(this.renderer.listen(this.el.nativeElement, 'mousedown', this.onMouseDown.bind(this)));

                this.dragStartListener.set(this.renderer.listen(this.el.nativeElement, 'dragstart', this.onDragStart.bind(this)));

                this.dragOverListener.set(this.renderer.listen(this.el.nativeElement, 'dragover', this.onDragOver.bind(this)));

                this.dragEnterListener.set(this.renderer.listen(this.el.nativeElement, 'dragenter', this.onDragEnter.bind(this)));

                this.dragLeaveListener.set(this.renderer.listen(this.el.nativeElement, 'dragleave', this.onDragLeave.bind(this)));

                this.dragEndListener.set(this.renderer.listen(this.el.nativeElement, 'dragend', this.onDragEnd.bind(this)));
            });
        }
    }

    unbindEvents() {
        if (this.mouseDownListener()) {
            this.mouseDownListener()!();
            this.mouseDownListener.set(null);
        }

        if (this.dragStartListener()) {
            this.dragStartListener()!();
            this.dragStartListener.set(null);
        }

        if (this.dragOverListener()) {
            this.dragOverListener()!();
            this.dragOverListener.set(null);
        }

        if (this.dragEnterListener()) {
            this.dragEnterListener()!();
            this.dragEnterListener.set(null);
        }

        if (this.dragLeaveListener()) {
            this.dragLeaveListener()!();
            this.dragLeaveListener.set(null);
        }

        if (this.dragEndListener()) {
            this.dragEndListener()!();
            this.dragEndListener.set(null);
        }
    }

    onMouseDown(event: any) {
        if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA' || event.target.closest?.('[data-pc-column-resizer="true"]')) this.el.nativeElement.draggable = false;
        else this.el.nativeElement.draggable = true;
    }

    onDragStart(event: any) {
        this.dataTable.onColumnDragStart(event, this.el.nativeElement);
    }

    onDragOver(event: any) {
        event.preventDefault();
    }

    onDragEnter(event: any) {
        this.dataTable.onColumnDragEnter(event, this.el.nativeElement);
    }

    onDragLeave(event: any) {
        this.dataTable.onColumnDragLeave(event);
    }

    onDragEnd() {
        this.dataTable.onColumnDragEnd();
    }

    @HostListener('drop', ['$event'])
    onDrop(event: any) {
        if (this.isEnabled()) {
            this.dataTable.onColumnDrop(event, this.el.nativeElement);
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // Ctrl/Cmd + Left/Right on the header cell itself, not on an input or a button inside it
        if (this.isEnabled() && (event.ctrlKey || event.metaKey) && (event.code === 'ArrowLeft' || event.code === 'ArrowRight') && event.target === this.el.nativeElement) {
            event.preventDefault();
            this.dataTable.onColumnKeyboardReorder(event, this.el.nativeElement);
        }
    }

    isEnabled() {
        return this.pReorderableColumnDisabled() !== true;
    }

    onDestroy() {
        this.unbindEvents();
    }
}

/**
 * Makes a cell editable with editMode set to cell: clicking it shows the `#input` template of its p-cell-editor. Bind the row data: `[pEditableColumn]="rowData"`, with pEditableColumnField.
 */
@Directive({
    selector: '[pEditableColumn]',
    standalone: false,
    host: {
        '[attr.data-p-editable-column]': 'true',
        '[attr.tabindex]': 'isEnabled() ? "0" : null'
    }
})
export class EditableColumn extends BaseComponent {
    dataTable = inject(Table);
    zone = inject(NgZone);

    readonly data = input<any>(undefined, { alias: 'pEditableColumn' });

    readonly field = input<any>(undefined, { alias: 'pEditableColumnField' });

    readonly rowIndex = input<number | undefined>(undefined, { alias: 'pEditableColumnRowIndex' });

    readonly pEditableColumnDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    readonly pFocusCellSelector = input<string | undefined>();

    overlayEventListener = signal<any>(undefined);

    constructor() {
        super();
        let initialized = false;
        effect(() => {
            const data = this.data();
            const field = this.field();
            const rowIndex = this.rowIndex();

            untracked(() => {
                if (!initialized) {
                    initialized = true;
                    return;
                }

                // only the cell being edited follows its new data: a row reused for other data (e.g. after filtering) is not edited
                if (this.el.nativeElement && this.dataTable.editingCell() === this.el.nativeElement) {
                    this.dataTable.updateEditingCell(this.el.nativeElement, data, field, <number>rowIndex);
                }
            });
        });
        afterNextRender(() => {
            if (this.isEnabled()) {
                !this.$unstyled() && DomHandler.addClass(this.el.nativeElement, 'p-editable-column');
            }
        });
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        if (this.isEnabled()) {
            this.dataTable.selfClick.set(true);

            if (this.dataTable.editingCell()) {
                if (this.dataTable.editingCell() !== this.el.nativeElement) {
                    if (!this.dataTable.isEditingCellValid()) {
                        return;
                    }

                    this.closeEditingCell(true, event);
                    this.openCell();
                }
            } else {
                this.openCell();
            }
        }
    }

    openCell() {
        this.dataTable.updateEditingCell(this.el.nativeElement, this.data(), this.field(), <number>this.rowIndex());
        this.dataTable.editingCellOriginalValue.set(ObjectUtils.resolveFieldData(this.data(), this.field()));
        !this.$unstyled() && DomHandler.addClass(this.el.nativeElement, 'p-cell-editing');
        setAttribute(this.el.nativeElement, 'data-p-cell-editing', 'true');

        this.dataTable.onEditInit.emit({
            field: this.field(),
            data: this.data(),
            index: <number>this.rowIndex()
        });
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                let focusCellSelector = this.pFocusCellSelector() || 'input, textarea, select';
                let focusableElement = DomHandler.findSingle(this.el.nativeElement, focusCellSelector);

                if (focusableElement) {
                    focusableElement.focus();
                }
            }, 50);
        });

        this.overlayEventListener.set((e: any) => {
            if (this.el && this.el.nativeElement.contains(e.target)) {
                this.dataTable.selfClick.set(true);
            }
        });

        this.dataTable.overlaySubscription.set(this.dataTable.overlayService.clickObservable.subscribe(this.overlayEventListener()));
    }

    closeEditingCell(completed: any, event: Event) {
        if (!completed && this.dataTable.editingCellData() && this.dataTable.editingCellField()) {
            this.dataTable.editingCellData()[this.dataTable.editingCellField()] = this.dataTable.editingCellOriginalValue();
        }

        const eventData = {
            field: <string>this.dataTable.editingCellField(),
            data: <any>this.dataTable.editingCellData(),
            originalEvent: <Event>event,
            index: <number>this.dataTable.editingCellRowIndex()
        };

        if (completed) {
            this.dataTable.onEditComplete.emit(eventData);
        } else {
            this.dataTable.onEditCancel.emit(eventData);
        }

        !this.$unstyled() && DomHandler.removeClass(this.dataTable.editingCell(), 'p-cell-editing');
        setAttribute(this.el.nativeElement, 'data-p-cell-editing', 'false');
        this.dataTable.editingCell.set(null);
        this.dataTable.editingCellData.set(null);
        this.dataTable.editingCellField.set(null);
        this.dataTable.unbindDocumentEditListener();

        if (this.dataTable.overlaySubscription()) {
            this.dataTable.overlaySubscription()!.unsubscribe();
        }
    }

    @HostListener('keydown.enter', ['$event'])
    onEnterKeyDown(event: KeyboardEvent) {
        if (this.isEnabled() && !event.shiftKey) {
            if (!this.dataTable.editingCell()) {
                // keyboard alternative to the click that opens the editor of a focused cell
                this.openCell();
            } else if (this.dataTable.isEditingCellValid()) {
                this.closeEditingCell(true, event);
                this.el.nativeElement.focus();
            }

            event.preventDefault();
        }
    }

    @HostListener('keydown.tab', ['$event'])
    onTabKeyDown(event: KeyboardEvent) {
        if (this.isEnabled()) {
            if (this.dataTable.isEditingCellValid()) {
                this.closeEditingCell(true, event);
            }

            event.preventDefault();
        }
    }

    @HostListener('keydown.escape', ['$event'])
    onEscapeKeyDown(event: KeyboardEvent) {
        if (this.isEnabled()) {
            if (this.dataTable.isEditingCellValid()) {
                this.closeEditingCell(false, event);
                this.el.nativeElement.focus();
            }

            event.preventDefault();
        }
    }

    @HostListener('keydown.tab', ['$event'])
    @HostListener('keydown.shift.tab', ['$event'])
    @HostListener('keydown.meta.tab', ['$event'])
    onShiftKeyDown(event: KeyboardEvent) {
        if (this.isEnabled()) {
            if (event.shiftKey) this.moveToPreviousCell(event);
            else {
                this.moveToNextCell(event);
            }
        }
    }
    @HostListener('keydown.arrowdown', ['$event'])
    onArrowDown(event: KeyboardEvent) {
        if (this.isEnabled()) {
            let currentCell = this.findCell(event.target);
            if (currentCell) {
                let cellIndex = DomHandler.index(currentCell);
                let targetCell = this.findNextEditableColumnByIndex(currentCell, cellIndex);

                if (targetCell) {
                    if (this.dataTable.isEditingCellValid()) {
                        this.closeEditingCell(true, event);
                    }

                    DomHandler.invokeElementMethod(event.target, 'blur');
                    DomHandler.invokeElementMethod(targetCell, 'click');
                }

                event.preventDefault();
            }
        }
    }

    @HostListener('keydown.arrowup', ['$event'])
    onArrowUp(event: KeyboardEvent) {
        if (this.isEnabled()) {
            let currentCell = this.findCell(event.target);
            if (currentCell) {
                let cellIndex = DomHandler.index(currentCell);
                let targetCell = this.findPrevEditableColumnByIndex(currentCell, cellIndex);

                if (targetCell) {
                    if (this.dataTable.isEditingCellValid()) {
                        this.closeEditingCell(true, event);
                    }

                    DomHandler.invokeElementMethod(event.target, 'blur');
                    DomHandler.invokeElementMethod(targetCell, 'click');
                }

                event.preventDefault();
            }
        }
    }

    @HostListener('keydown.arrowleft', ['$event'])
    onArrowLeft(event: KeyboardEvent) {
        if (this.isEnabled()) {
            this.moveToPreviousCell(event);
        }
    }

    @HostListener('keydown.arrowright', ['$event'])
    onArrowRight(event: KeyboardEvent) {
        if (this.isEnabled()) {
            this.moveToNextCell(event);
        }
    }

    findCell(element: any) {
        if (element) {
            let cell = element;
            while (cell && !findSingle(cell as HTMLElement, '[data-p-cell-editing="true"]')) {
                cell = cell.parentElement;
            }

            return cell;
        } else {
            return null;
        }
    }

    moveToPreviousCell(event: KeyboardEvent) {
        let currentCell = this.findCell(event.target);
        if (currentCell) {
            let targetCell = this.findPreviousEditableColumn(currentCell);

            if (targetCell) {
                if (this.dataTable.isEditingCellValid()) {
                    this.closeEditingCell(true, event);
                }

                DomHandler.invokeElementMethod(event.target, 'blur');
                DomHandler.invokeElementMethod(targetCell, 'click');
                event.preventDefault();
            }
        }
    }

    moveToNextCell(event: KeyboardEvent) {
        let currentCell = this.findCell(event.target);
        if (currentCell) {
            let targetCell = this.findNextEditableColumn(currentCell);

            if (targetCell) {
                if (this.dataTable.isEditingCellValid()) {
                    this.closeEditingCell(true, event);
                }

                DomHandler.invokeElementMethod(event.target, 'blur');
                DomHandler.invokeElementMethod(targetCell, 'click');
                event.preventDefault();
            } else {
                if (this.dataTable.isEditingCellValid()) {
                    this.closeEditingCell(true, event);
                }
            }
        }
    }

    findPreviousEditableColumn(cell: any): HTMLTableCellElement | null {
        let prevCell = cell.previousElementSibling;

        if (!prevCell) {
            let previousRow = cell.parentElement?.previousElementSibling;
            if (previousRow) {
                prevCell = previousRow.lastElementChild;
            }
        }

        if (prevCell) {
            if (findSingle(prevCell, '[data-p-editable-column="true"]')) return prevCell;
            else return this.findPreviousEditableColumn(prevCell);
        } else {
            return null;
        }
    }

    findNextEditableColumn(cell: any): HTMLTableCellElement | null {
        let nextCell = cell.nextElementSibling;

        if (!nextCell) {
            let nextRow = cell.parentElement?.nextElementSibling;
            if (nextRow) {
                nextCell = nextRow.firstElementChild;
            }
        }

        if (nextCell) {
            if (findSingle(nextCell, '[data-p-editable-column="true"]')) return nextCell;
            else return this.findNextEditableColumn(nextCell);
        } else {
            return null;
        }
    }

    findNextEditableColumnByIndex(cell: Element, index: number) {
        let nextRow = cell.parentElement?.nextElementSibling;

        if (nextRow) {
            let nextCell = nextRow.children[index];

            if (nextCell && findSingle(nextCell, '[data-p-editable-column="true"]')) {
                return nextCell;
            }

            return null;
        } else {
            return null;
        }
    }

    findPrevEditableColumnByIndex(cell: Element, index: number) {
        let prevRow = cell.parentElement?.previousElementSibling;

        if (prevRow) {
            let prevCell = prevRow.children[index];

            if (prevCell && findSingle(prevCell, '[data-p-editable-column="true"]')) {
                return prevCell;
            }

            return null;
        } else {
            return null;
        }
    }

    isEnabled() {
        return this.pEditableColumnDisabled() !== true;
    }

    onDestroy() {
        if (this.dataTable.overlaySubscription()) {
            this.dataTable.overlaySubscription()!.unsubscribe();
        }
    }
}

/**
 * Marks a row as editable, with editMode set to row. Bind the row data: `[pEditableRow]="rowData"`.
 */
@Directive({
    selector: '[pEditableRow]',
    standalone: false
})
export class EditableRow extends BaseComponent {
    readonly data = input<any>(undefined, { alias: 'pEditableRow' });

    readonly pEditableRowDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    isEnabled() {
        return this.pEditableRowDisabled() !== true;
    }
}

/**
 * Starts the edit of its row when clicked, with editMode set to row. Place it on a button inside a row with pEditableRow.
 */
@Directive({
    selector: '[pInitEditableRow]',
    standalone: false,
    host: {
        class: 'p-datatable-row-editor-init'
    }
})
export class InitEditableRow extends BaseComponent {
    dataTable = inject(Table);
    editableRow = inject(EditableRow);

    @HostListener('click', ['$event'])
    onClick(event: Event) {
        this.dataTable.initRowEdit(this.editableRow.data());
        event.preventDefault();
    }
}

/**
 * Saves the edit of its row when clicked, with editMode set to row. Place it on a button inside a row with pEditableRow.
 */
@Directive({
    selector: '[pSaveEditableRow]',
    standalone: false,
    host: {
        class: 'p-datatable-row-editor-save'
    }
})
export class SaveEditableRow extends BaseComponent {
    dataTable = inject(Table);
    editableRow = inject(EditableRow);

    @HostListener('click', ['$event'])
    onClick(event: Event) {
        this.dataTable.saveRowEdit(this.editableRow.data(), this.editableRow.el.nativeElement);
        event.preventDefault();
    }
}

/**
 * Cancels the edit of its row when clicked, with editMode set to row. Place it on a button inside a row with pEditableRow.
 */
@Directive({
    selector: '[pCancelEditableRow]',
    standalone: false,
    host: {
        '[class]': "cx('rowEditorCancel')"
    },
    providers: [TableStyle]
})
export class CancelEditableRow extends BaseComponent {
    dataTable = inject(Table);
    editableRow = inject(EditableRow);
    _componentStyle = inject(TableStyle);
    @HostListener('click', ['$event'])
    onClick(event: Event) {
        this.dataTable.cancelRowEdit(this.editableRow.data());
        event.preventDefault();
    }
}

/**
 * Content of an editable cell: the `#input` template shows while the cell or the row is edited, the `#output` template otherwise.
 */
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'p-cell-editor, p-cellEditor',
    standalone: false,
    template: `
        @if (editing) {
            <ng-container *ngTemplateOutlet="inputTemplate() || _inputTemplate()"></ng-container>
        }
        @if (!editing) {
            <ng-container *ngTemplateOutlet="outputTemplate() || _outputTemplate()"></ng-container>
        }
    `,
    encapsulation: ViewEncapsulation.None
})
export class CellEditor extends BaseComponent {
    dataTable = inject(Table);
    editableColumn = inject(EditableColumn, { optional: true });
    editableRow = inject(EditableRow, { optional: true });

    readonly _templates = contentChildren(PrimeTemplate);

    /**
     * Content of the cell in edit mode, usually an input.
     * @group Templates
     */
    readonly _inputTemplate = contentChild<TemplateRef<void>>('input');

    /**
     * Content of the cell when it is not edited.
     * @group Templates
     */
    readonly _outputTemplate = contentChild<TemplateRef<void>>('output');

    readonly inputTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'input')
                .at(-1)?.template
    );

    readonly outputTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'output')
                .at(-1)?.template
    );

    // Stays a getter: isRowEditing() reads editingRowKeys, which the consumer owns and Table mutates in place.
    get editing(): boolean {
        return !!(
            (this.dataTable.editingCell() && this.editableColumn && this.dataTable.editingCell() === this.editableColumn.el.nativeElement) ||
            (this.editableRow && this.dataTable.editMode() === 'row' && this.dataTable.isRowEditing(this.editableRow.data()))
        );
    }
}

/**
 * Radio button that selects its row, for single selection. Bind the row data: `[value]="rowData"`.
 */
@Component({
    selector: 'p-table-radio-button, p-tableRadioButton',
    standalone: false,
    template: `<p-radioButton
        #rb
        [(ngModel)]="checked"
        [ngModelOptions]="{ standalone: true }"
        [disabled]="disabled()"
        [inputId]="inputId()"
        [name]="name()"
        [ariaLabel]="_ariaLabel()"
        [binary]="true"
        [value]="value()"
        (onClick)="onClick($event)"
        [unstyled]="unstyled()"
    /> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class TableRadioButton extends BaseComponent {
    dataTable = inject(Table);

    readonly value = input<any>();

    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    readonly index = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    readonly inputId = input<string | undefined>();
    readonly name = input<string | undefined>();

    readonly ariaLabel = input<string | undefined>();

    readonly _ariaLabel = linkedSignal(() => this.ariaLabel());

    readonly inputViewChild = viewChild.required<RadioButton>('rb');

    readonly checked = signal<boolean | undefined>(undefined);

    subscription: Subscription;

    constructor() {
        super();
        this.subscription = this.dataTable.tableService.selectionSource$.subscribe(() => {
            this.checked.set(this.dataTable.isSelected(this.value()));

            this._ariaLabel.set(this._ariaLabel() || (this.dataTable.config.translation.aria ? (this.checked() ? this.dataTable.config.translation.aria.selectRow : this.dataTable.config.translation.aria.unselectRow) : undefined));
        });
    }

    onInit() {
        this.checked.set(this.dataTable.isSelected(this.value()));
    }

    onClick(event: RadioButtonClickEvent) {
        if (!this.disabled()) {
            this.dataTable.toggleRowWithRadio(
                {
                    originalEvent: event.originalEvent,
                    rowIndex: this.index()
                },
                this.value()
            );

            this.inputViewChild().inputViewChild().nativeElement?.focus();
        }
        DomHandler.clearSelection();
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

/**
 * Checkbox that selects its row, for multiple selection. Bind the row data: `[value]="rowData"`.
 */
@Component({
    selector: 'p-table-checkbox, p-tableCheckbox',
    standalone: false,
    template: `
        <p-checkbox
            [(ngModel)]="checked"
            [ngModelOptions]="{ standalone: true }"
            [binary]="true"
            (onChange)="onClick($event)"
            [required]="required()"
            [disabled]="disabled()"
            [inputId]="inputId()"
            [name]="name()"
            [ariaLabel]="_ariaLabel()"
            [unstyled]="unstyled()"
        >
            @if (dataTable.checkboxIconTemplate() || dataTable._checkboxIconTemplate(); as template) {
                <ng-template pTemplate="icon">
                    <ng-template *ngTemplateOutlet="template; context: { $implicit: checked() }" />
                </ng-template>
            }
        </p-checkbox>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class TableCheckbox extends BaseComponent {
    dataTable = inject(Table);
    tableService = inject(TableService);

    readonly value = input<any>();

    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    readonly required = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    readonly index = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    readonly inputId = input<string | undefined>();
    readonly name = input<string | undefined>();

    readonly ariaLabel = input<string | undefined>();

    readonly _ariaLabel = linkedSignal(() => this.ariaLabel());

    readonly checked = signal<boolean | undefined>(undefined);

    subscription: Subscription;

    constructor() {
        super();
        this.subscription = this.dataTable.tableService.selectionSource$.subscribe(() => {
            this.checked.set(this.dataTable.isSelected(this.value()));
            this._ariaLabel.set(this._ariaLabel() || (this.dataTable.config.translation.aria ? (this.checked() ? this.dataTable.config.translation.aria.selectRow : this.dataTable.config.translation.aria.unselectRow) : undefined));
        });
    }

    onInit() {
        this.checked.set(this.dataTable.isSelected(this.value()));
    }

    onClick({ originalEvent }: CheckboxChangeEvent) {
        if (!this.disabled()) {
            this.dataTable.toggleRowWithCheckbox(
                {
                    originalEvent: originalEvent!,
                    rowIndex: this.index() || 0
                },
                this.value()
            );
        }
        DomHandler.clearSelection();
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

/**
 * Checkbox in the header that selects or unselects all the rows.
 */
@Component({
    selector: 'p-table-header-checkbox, p-tableHeaderCheckbox',
    standalone: false,
    template: `
        <p-checkbox
            [pt]="ptm('pcCheckbox')"
            [(ngModel)]="checked"
            [ngModelOptions]="{ standalone: true }"
            (onChange)="onClick($event)"
            [binary]="true"
            [disabled]="isDisabled()"
            [inputId]="inputId()"
            [name]="name()"
            [ariaLabel]="_ariaLabel()"
            [unstyled]="unstyled()"
        >
            @if (dataTable.headerCheckboxIconTemplate() || dataTable._headerCheckboxIconTemplate(); as template) {
                <ng-template pTemplate="icon">
                    <ng-template *ngTemplateOutlet="template; context: { $implicit: checked() }" />
                </ng-template>
            }
        </p-checkbox>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [Bind]
})
export class TableHeaderCheckbox extends BaseComponent {
    dataTable = inject(Table);
    tableService = inject(TableService);

    hostName = 'Table';

    bindDirectiveInstance = inject(Bind, { self: true });

    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    readonly inputId = input<string | undefined>();
    readonly name = input<string | undefined>();

    readonly ariaLabel = input<string | undefined>();

    readonly _ariaLabel = linkedSignal(() => this.ariaLabel());

    readonly checked = signal<boolean | null | undefined>(undefined);

    selectionChangeSubscription: Subscription;

    valueChangeSubscription: Subscription;

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptm('headerCheckbox'));
        this.valueChangeSubscription = this.dataTable.tableService.valueSource$.subscribe(() => {
            this.checked.set(this.updateCheckedState());
            this._ariaLabel.set(this._ariaLabel() || (this.dataTable.config.translation.aria ? (this.checked() ? this.dataTable.config.translation.aria.selectAll : this.dataTable.config.translation.aria.unselectAll) : undefined));
        });

        this.selectionChangeSubscription = this.dataTable.tableService.selectionSource$.subscribe(() => {
            this.checked.set(this.updateCheckedState());
        });
    }

    onInit() {
        this.checked.set(this.updateCheckedState());
    }

    onClick(event: CheckboxChangeEvent) {
        if (!this.disabled()) {
            if (this.dataTable._value() && this.dataTable._value().length > 0) {
                this.dataTable.toggleRowsWithCheckbox(event, this.checked() || false);
            }
        }

        DomHandler.clearSelection();
    }

    isDisabled() {
        return this.disabled() || !this.dataTable._value() || !this.dataTable._value().length;
    }

    onDestroy() {
        if (this.selectionChangeSubscription) {
            this.selectionChangeSubscription.unsubscribe();
        }

        if (this.valueChangeSubscription) {
            this.valueChangeSubscription.unsubscribe();
        }
    }

    updateCheckedState() {
        if (this.dataTable.selectAll() !== null) {
            return this.dataTable.selectAll();
        } else {
            const data = this.dataTable.selectionPageOnly() ? this.dataTable.dataToRender(this.dataTable.processedData()) : this.dataTable.processedData();
            const val = this.dataTable.frozenValue() ? [...this.dataTable.frozenValue()!, ...data] : data;
            const selectableVal = this.dataTable.rowSelectable() ? val.filter((data: any, index: number) => this.dataTable.rowSelectable()!({ data, index })) : val;

            return ObjectUtils.isNotEmpty(selectableVal) && ObjectUtils.isNotEmpty(this.dataTable.selection()) && selectableVal.every((v: any) => this.dataTable.selection().some((s: any) => this.dataTable.equals(v, s)));
        }
    }
}

/**
 * Handle that starts dragging its row, inside a row with pReorderableRow.
 */
@Directive({
    selector: '[pReorderableRowHandle]',
    standalone: false,
    host: {
        '[class]': "cx('reorderableRowHandle')",
        '[attr.tabindex]': 'row?.isEnabled() ? "0" : null',
        '[attr.aria-keyshortcuts]': 'row?.isEnabled() ? "Control+ArrowUp Control+ArrowDown Meta+ArrowUp Meta+ArrowDown" : null',
        '[style.touch-action]': 'row?.isEnabled() ? "none" : null'
    },
    providers: [TableStyle],
    hostDirectives: [Bind]
})
export class ReorderableRowHandle extends BaseComponent {
    el = inject(ElementRef);

    row = inject(ReorderableRow, { optional: true });

    hostName = 'Table';

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TableStyle);

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptm('reorderableRowHandle'));
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // Ctrl/Cmd + Up/Down moves the row; stop it there so a selectable row does not move the focus too
        if (this.row?.isEnabled() && (event.ctrlKey || event.metaKey) && (event.code === 'ArrowUp' || event.code === 'ArrowDown')) {
            event.stopPropagation();
            this.row.dataTable.onRowKeyboardReorder(event, <number>this.row.index(), event.code === 'ArrowUp' ? -1 : 1);
            // re-rendering the body moves the row: keep the focus on the handle
            const handle = this.el.nativeElement;
            setTimeout(() => handle.isConnected && handle.focus());
        }
    }
}

// the reorderable row directives by row element, to find the row under a touch pointer
const reorderableRowElements = new WeakMap<HTMLElement, ReorderableRow>();

/**
 * Makes a row a drop target when reordering rows. Bind the row index: `[pReorderableRow]="rowIndex"`.
 */
@Directive({
    selector: '[pReorderableRow]',
    standalone: false,
    hostDirectives: [Bind]
})
export class ReorderableRow extends BaseComponent {
    dataTable = inject(Table);
    zone = inject(NgZone);

    hostName = 'Table';

    bindDirectiveInstance = inject(Bind, { self: true });

    readonly index = input<number | undefined>(undefined, { alias: 'pReorderableRow' });

    readonly pReorderableRowDisabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    mouseDownListener = signal<VoidListener>(undefined);

    dragStartListener = signal<VoidListener>(undefined);

    dragEndListener = signal<VoidListener>(undefined);

    dragOverListener = signal<VoidListener>(undefined);

    dragLeaveListener = signal<VoidListener>(undefined);

    dropListener = signal<VoidListener>(undefined);

    pointerDownListener = signal<VoidListener>(undefined);

    private documentPointerListeners: (() => void)[] = [];

    private pointerDropRow: HTMLElement | null = null;

    constructor() {
        super();
        reorderableRowElements.set(this.el.nativeElement, this);
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptm('reorderableRow'));
        afterNextRender(() => {
            if (this.isEnabled()) {
                this.el.nativeElement.droppable = true;
                this.bindEvents();
            }
        });
    }

    bindEvents() {
        this.zone.runOutsideAngular(() => {
            this.mouseDownListener.set(this.renderer.listen(this.el.nativeElement, 'mousedown', this.onMouseDown.bind(this)));

            this.dragStartListener.set(this.renderer.listen(this.el.nativeElement, 'dragstart', this.onDragStart.bind(this)));

            this.dragEndListener.set(this.renderer.listen(this.el.nativeElement, 'dragend', this.onDragEnd.bind(this)));

            this.dragOverListener.set(this.renderer.listen(this.el.nativeElement, 'dragover', this.onDragOver.bind(this)));

            this.dragLeaveListener.set(this.renderer.listen(this.el.nativeElement, 'dragleave', this.onDragLeave.bind(this)));

            this.pointerDownListener.set(this.renderer.listen(this.el.nativeElement, 'pointerdown', this.onPointerDown.bind(this)));
        });
    }

    unbindEvents() {
        if (this.mouseDownListener()) {
            this.mouseDownListener()!();
            this.mouseDownListener.set(null);
        }

        if (this.dragStartListener()) {
            this.dragStartListener()!();
            this.dragStartListener.set(null);
        }

        if (this.dragEndListener()) {
            this.dragEndListener()!();
            this.dragEndListener.set(null);
        }

        if (this.dragOverListener()) {
            this.dragOverListener()!();
            this.dragOverListener.set(null);
        }

        if (this.dragLeaveListener()) {
            this.dragLeaveListener()!();
            this.dragLeaveListener.set(null);
        }

        if (this.pointerDownListener()) {
            this.pointerDownListener()!();
            this.pointerDownListener.set(null);
        }

        this.unbindDocumentPointerListeners();
    }

    // a touch or a pen on the handle does not start an HTML5 drag on mobile browsers: follow the pointer instead
    onPointerDown(event: PointerEvent) {
        if (event.pointerType === 'mouse' || !this.isHandleElement(event.target as HTMLElement)) {
            return;
        }

        event.preventDefault();
        this.unbindDocumentPointerListeners();
        this.dataTable.rowDragging.set(true);
        this.dataTable.draggedRowIndex.set(<number>this.index());
        this.pointerDropRow = null;
        this.documentPointerListeners = [
            this.renderer.listen(this.document, 'pointermove', this.onPointerMove.bind(this)),
            this.renderer.listen(this.document, 'pointerup', this.onPointerUp.bind(this)),
            this.renderer.listen(this.document, 'pointercancel', this.onPointerUp.bind(this))
        ];
    }

    onPointerMove(event: PointerEvent) {
        const rowElement = this.document.elementFromPoint(event.clientX, event.clientY)?.closest('tr') as HTMLElement | null;
        const row = rowElement ? reorderableRowElements.get(rowElement) : undefined;

        if (row && row.dataTable === this.dataTable && row.isEnabled()) {
            if (this.pointerDropRow && this.pointerDropRow !== rowElement) {
                this.dataTable.onRowDragLeave(event, this.pointerDropRow);
            }

            this.pointerDropRow = rowElement;
            this.dataTable.onRowDragOver(event, <number>row.index(), rowElement);
        }

        event.preventDefault();
    }

    onPointerUp(event: PointerEvent) {
        this.unbindDocumentPointerListeners();

        if (event.type === 'pointerup' && this.pointerDropRow) {
            const rowElement = this.pointerDropRow;
            this.zone.run(() => this.dataTable.onRowDrop(event, rowElement));
        } else {
            this.pointerDropRow && this.dataTable.onRowDragLeave(event, this.pointerDropRow);
            this.dataTable.onRowDragEnd(event);
        }

        this.pointerDropRow = null;
    }

    unbindDocumentPointerListeners() {
        this.documentPointerListeners.forEach((unlisten) => unlisten());
        this.documentPointerListeners = [];
    }

    onMouseDown(event: Event) {
        const targetElement = event.target as HTMLElement;
        const isHandleClicked = this.isHandleElement(targetElement);
        this.el.nativeElement.draggable = isHandleClicked;
    }

    isHandleElement(element: HTMLElement): boolean {
        if (element?.classList.contains('p-datatable-reorderable-row-handle')) {
            return true;
        }

        if (element?.parentElement && !['TD', 'TR'].includes(element?.parentElement?.tagName)) {
            return this.isHandleElement(element?.parentElement);
        }

        return false;
    }

    onDragStart(event: DragEvent) {
        this.dataTable.onRowDragStart(event, <number>this.index());
    }

    onDragEnd(event: DragEvent) {
        this.dataTable.onRowDragEnd(event);
        this.el.nativeElement.draggable = false;
    }

    onDragOver(event: DragEvent) {
        this.dataTable.onRowDragOver(event, <number>this.index(), this.el.nativeElement);
        event.preventDefault();
    }

    onDragLeave(event: DragEvent) {
        this.dataTable.onRowDragLeave(event, this.el.nativeElement);
    }

    isEnabled() {
        return this.pReorderableRowDisabled() !== true;
    }

    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        if (this.isEnabled() && this.dataTable.rowDragging()) {
            this.dataTable.onRowDrop(event, this.el.nativeElement);
        }

        event.preventDefault();
    }

    onDestroy() {
        this.unbindEvents();
    }
}
/**
 * Column Filter Component.
 * @group Components
 */
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'p-column-filter, p-columnFilter, p-columnfilter',
    standalone: false,
    template: `
        <div [class]="cx('filter')">
            @if (display() === 'row') {
                <p-columnFilterFormElement
                    class="p-fluid"
                    [type]="type()"
                    [field]="field()"
                    [ariaLabel]="ariaLabel()"
                    [filterConstraint]="dataTable._filters()[field()]"
                    [filterTemplate]="filterTemplate() || _filterTemplate()"
                    [placeholder]="placeholder()"
                    [minFractionDigits]="minFractionDigits()"
                    [maxFractionDigits]="maxFractionDigits()"
                    [prefix]="prefix()"
                    [suffix]="suffix()"
                    [locale]="locale()"
                    [localeMatcher]="localeMatcher()"
                    [currency]="currency()"
                    [currencyDisplay]="currencyDisplay()"
                    [useGrouping]="useGrouping()"
                    [filterOn]="filterOn()"
                    [pt]="pt()"
                    [unstyled]="unstyled()"
                ></p-columnFilterFormElement>
            }
            @if (showMenuButton()) {
                <p-button
                    [styleClass]="cx('pcColumnFilterButton')"
                    [pt]="ptm('pcColumnFilterButton')"
                    [ariaLabel]="filterMenuButtonAriaLabel"
                    (click)="toggleMenu($event)"
                    (keydown)="onToggleButtonKeyDown($event)"
                    [buttonProps]="filterButtonProps()?.filter"
                    #menuButton
                    [unstyled]="unstyled()"
                >
                    <ng-template #icon>
                        <ng-container>
                            @if (!filterIconTemplate() && !_filterIconTemplate() && !hasFilter) {
                                <svg data-p-icon="filter" [pBind]="ptm('pcColumnFilterButton')['icon']" />
                            }
                            @if (!filterIconTemplate() && !_filterIconTemplate() && hasFilter) {
                                <svg data-p-icon="filter-fill" [pBind]="ptm('pcColumnFilterButton')['icon']" />
                            }
                            @if (filterIconTemplate() || _filterIconTemplate()) {
                                <span [pBind]="ptm('pcColumnFilterButton')['icon']" [attr.data-pc-section]="'columnfilterbuttonicon'">
                                    <ng-template *ngTemplateOutlet="filterIconTemplate() || _filterIconTemplate(); context: { hasFilter: hasFilter }"></ng-template>
                                </span>
                            }
                        </ng-container>
                    </ng-template>
                </p-button>
            }
            @if (showClearButton() && display() === 'row' && type() === 'boolean' && hasFilter) {
                <p-button [styleClass]="cx('pcColumnFilterClearButton')" [ariaLabel]="clearButtonLabel" (click)="clearFilter()" [buttonProps]="filterButtonProps()?.inline?.clear" [unstyled]="unstyled()">
                    <ng-template #icon>
                        <svg data-p-icon="filter-slash" />
                    </ng-template>
                </p-button>
            }
            @if (renderOverlay()) {
                <div
                    [pMotion]="showMenu() && overlayVisible()"
                    [pMotionAppear]="true"
                    pMotionName="p-anchored-overlay"
                    (pMotionOnBeforeEnter)="onOverlayBeforeEnter($event)"
                    (pMotionOnAfterLeave)="onOverlayAnimationAfterLeave($event)"
                    [pMotionOptions]="computedMotionOptions()"
                    [class]="cx('filterOverlay')"
                    [pBind]="ptm('filterOverlay')"
                    [id]="overlayId()"
                    [attr.aria-modal]="true"
                    role="dialog"
                    (click)="onContentClick()"
                    (keydown.escape)="onEscape()"
                    (keydown.tab)="onOverlayTabKeyDown($event)"
                    (keydown.shift.tab)="onOverlayTabKeyDown($event)"
                >
                    <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate(); context: { $implicit: field() }"></ng-container>
                    @if (display() === 'row') {
                        <ul [class]="cx('filterConstraintList')" [pBind]="ptm('filterConstraintList')">
                            @for (matchMode of matchModes(); track matchMode; let i = $index) {
                                <li
                                    (click)="onRowMatchModeChange(matchMode.value)"
                                    (keydown)="onRowMatchModeKeyDown($event)"
                                    (keydown.enter)="onRowMatchModeChange(matchMode.value)"
                                    [class]="cx('filterConstraint')"
                                    [pBind]="ptm('filterConstraint', ptmFilterConstraintOptions(matchMode))"
                                    [class.p-datatable-filter-constraint-selected]="isRowMatchModeSelected(matchMode.value)"
                                    [attr.tabindex]="i === 0 ? '0' : null"
                                >
                                    {{ matchMode.label }}
                                </li>
                            }
                            <li [class]="cx('filterConstraintSeparator')" [pBind]="ptm('filterConstraintSeparator', { context: { index: i } })"></li>
                            <li [class]="cx('filterConstraint')" [pBind]="ptm('emtpyFilterLabel')" (click)="onRowClearItemClick()" (keydown)="onRowMatchModeKeyDown($event)" (keydown.enter)="onRowClearItemClick()">
                                {{ noFilterLabel }}
                            </li>
                        </ul>
                    } @else {
                        @if (isShowOperator()) {
                            <div [class]="cx('filterOperator')" [pBind]="ptm('filterOperator')">
                                <p-select
                                    [options]="operatorOptions()"
                                    [pt]="ptm('pcFilterOperatorDropdown')"
                                    [ngModel]="_operator()"
                                    [ngModelOptions]="{ standalone: true }"
                                    (ngModelChange)="onOperatorChange($event)"
                                    [class]="cx('pcFilterOperatorDropdown')"
                                    [unstyled]="unstyled()"
                                ></p-select>
                            </div>
                        }
                        <div [class]="cx('filterRuleList')" [pBind]="ptm('filterRuleList')">
                            @for (fieldConstraint of fieldConstraints; track fieldConstraint; let i = $index) {
                                <div [ngClass]="cx('filterRule')" [pBind]="ptm('filterRule')">
                                    @if (showMatchModes() && matchModes()) {
                                        <p-select
                                            [options]="matchModes()"
                                            [ngModel]="fieldConstraint.matchMode"
                                            [ngModelOptions]="{ standalone: true }"
                                            (ngModelChange)="onMenuMatchModeChange($event, fieldConstraint)"
                                            [class]="cx('pcFilterConstraintDropdown')"
                                            [pt]="ptm('pcFilterConstraintDropdown')"
                                            [unstyled]="unstyled()"
                                        ></p-select>
                                    }
                                    <p-columnFilterFormElement
                                        [type]="type()"
                                        [field]="field()"
                                        [ariaLabel]="ariaLabel()"
                                        [filterConstraint]="fieldConstraint"
                                        [filterTemplate]="filterTemplate() || _filterTemplate()"
                                        [placeholder]="placeholder()"
                                        [minFractionDigits]="minFractionDigits()"
                                        [maxFractionDigits]="maxFractionDigits()"
                                        [prefix]="prefix()"
                                        [suffix]="suffix()"
                                        [locale]="locale()"
                                        [localeMatcher]="localeMatcher()"
                                        [currency]="currency()"
                                        [currencyDisplay]="currencyDisplay()"
                                        [useGrouping]="useGrouping()"
                                        [filterOn]="filterOn()"
                                        [pt]="pt()"
                                        [unstyled]="unstyled()"
                                    ></p-columnFilterFormElement>
                                    @if (showRemoveIcon) {
                                        <div>
                                            <p-button
                                                [styleClass]="cx('pcFilterRemoveRuleButton')"
                                                [pt]="ptm('pcFilterRemoveRuleButton')"
                                                [text]="true"
                                                severity="danger"
                                                size="small"
                                                (onClick)="removeConstraint(fieldConstraint)"
                                                [ariaLabel]="removeRuleButtonLabel"
                                                [label]="removeRuleButtonLabel"
                                                [buttonProps]="filterButtonProps()?.popover?.removeRule"
                                                [unstyled]="unstyled()"
                                            >
                                                <ng-template #icon>
                                                    @if (!removeRuleIconTemplate() && !_removeRuleIconTemplate()) {
                                                        <svg data-p-icon="trash" [pBind]="ptm('pcFilterRemoveRuleButton')['icon']" />
                                                    }
                                                    <ng-template *ngTemplateOutlet="removeRuleIconTemplate() || _removeRuleIconTemplate()"></ng-template>
                                                </ng-template>
                                            </p-button>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                        @if (isShowAddConstraint) {
                            <p-button
                                type="button"
                                [pt]="ptm('pcAddRuleButtonLabel')"
                                [label]="addRuleButtonLabel"
                                [attr.aria-label]="addRuleButtonLabel"
                                [styleClass]="cx('pcFilterAddRuleButton')"
                                [text]="true"
                                size="small"
                                (onClick)="addConstraint()"
                                [buttonProps]="filterButtonProps()?.popover?.addRule"
                                [unstyled]="unstyled()"
                            >
                                <ng-template #icon>
                                    @if (!addRuleIconTemplate() && !_addRuleIconTemplate()) {
                                        <svg data-p-icon="plus" [pBind]="ptm('pcAddRuleButtonLabel')['icon']" />
                                    }
                                    <ng-template *ngTemplateOutlet="addRuleIconTemplate() || _addRuleIconTemplate()"></ng-template>
                                </ng-template>
                            </p-button>
                        }
                        @if (showClearButton() || showApplyButton()) {
                            <div [class]="cx('filterButtonbar')" [pBind]="ptm('filterButtonBar')">
                                @if (showClearButton()) {
                                    <p-button
                                        #clearBtn
                                        [outlined]="filterButtonProps()?.popover?.clear?.outlined ?? true"
                                        (onClick)="clearFilter()"
                                        [attr.aria-label]="clearButtonLabel"
                                        [label]="clearButtonLabel"
                                        [buttonProps]="filterButtonProps()?.popover?.clear"
                                        [pt]="ptm('pcFilterClearButton')"
                                        [unstyled]="unstyled()"
                                    />
                                }
                                @if (showApplyButton()) {
                                    <p-button
                                        (onClick)="applyFilter()"
                                        size="small"
                                        [label]="applyButtonLabel"
                                        [attr.aria-label]="applyButtonLabel"
                                        [buttonProps]="filterButtonProps()?.popover?.apply"
                                        [pt]="ptm('pcFilterApplyButton')"
                                        [unstyled]="unstyled()"
                                    />
                                }
                            </div>
                        }
                    }
                    <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate(); context: { $implicit: field() }"></ng-container>
                </div>
            }
        </div>
    `,
    providers: [TableStyle],
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [Bind]
})
export class ColumnFilter extends BaseComponent {
    hostName = 'Table';

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TableStyle);

    constructor() {
        super();
        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptm('columnFilter'));
            this.updateMenuButtonAria();
        });
        // the table filters can be replaced at any time (e.g. reset to {}): recreate the default constraint
        effect(() => {
            const filters = this.dataTable._filters();

            untracked(() => {
                if (filters && !filters[<string>this.field()]) {
                    this.initFieldFilterConstraint();
                }
            });
        });
    }

    // the popup state belongs to the focusable <button>, not to the p-button host (which has no role)
    updateMenuButtonAria() {
        const button = this.showMenuButton() ? (<HTMLElement | undefined>this.icon()?.nativeElement)?.querySelector('button') : null;

        if (button) {
            button.setAttribute('aria-haspopup', 'true');
            button.setAttribute('aria-expanded', String(this.overlayVisible() ?? false));

            if (this.overlayVisible()) {
                button.setAttribute('aria-controls', this.overlayId());
            } else {
                button.removeAttribute('aria-controls');
            }
        }
    }

    ptmFilterConstraintOptions(matchMode) {
        return {
            context: {
                highlighted: matchMode && this.isRowMatchModeSelected(matchMode.value)
            }
        };
    }
    /**
     * Property represented by the column.
     * @group Props
     */
    readonly field = input<string | undefined>();
    /**
     * Type of the input.
     * @group Props
     */
    readonly type = input<string>('text');
    /**
     * Filter display.
     * @group Props
     */
    readonly display = input<string>('row');
    /**
     * Decides whether to display filter menu popup.
     * @group Props
     */
    readonly showMenu = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Filter match mode.
     * @group Props
     */
    readonly matchMode = input<string | undefined>();
    /**
     * Filter operator.
     * @defaultValue 'AND'
     * @group Props
     */
    readonly operator = input<string>(FilterOperator.AND);

    readonly _operator = linkedSignal(() => this.operator());
    /**
     * Decides whether to display filter operator.
     * @group Props
     */
    readonly showOperator = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Decides whether to display clear filter button when display is menu.
     * @defaultValue true
     * @group Props
     */
    readonly showClearButton = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Decides whether to display apply filter button when display is menu.
     * @group Props
     */
    readonly showApplyButton = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Decides whether to display filter match modes when display is menu.
     * @group Props
     */
    readonly showMatchModes = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Decides whether to display add filter button when display is menu.
     * @group Props
     */
    readonly showAddButton = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Decides whether to close popup on clear button click.
     * @group Props
     */
    readonly hideOnClear = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Filter placeholder.
     * @group Props
     */
    readonly placeholder = input<string | undefined>();
    /**
     * Filter match mode options.
     * @group Props
     */
    readonly matchModeOptions = input<SelectItem[] | undefined>();
    /**
     * Defines maximum amount of constraints.
     * @group Props
     */
    readonly maxConstraints = input<number, unknown>(2, { transform: numberAttribute });
    /**
     * Defines minimum fraction of digits.
     * @group Props
     */
    readonly minFractionDigits = input<number | undefined, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });
    /**
     * Defines maximum fraction of digits.
     * @group Props
     */
    readonly maxFractionDigits = input<number | undefined, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });
    /**
     * Defines prefix of the filter.
     * @group Props
     */
    readonly prefix = input<string | undefined>();
    /**
     * Defines suffix of the filter.
     * @group Props
     */
    readonly suffix = input<string | undefined>();
    /**
     * Defines filter locale.
     * @group Props
     */
    readonly locale = input<string | undefined>();
    /**
     * Defines filter locale matcher.
     * @group Props
     */
    readonly localeMatcher = input<string | undefined>();
    /**
     * Enables currency input.
     * @group Props
     */
    readonly currency = input<string | undefined>();
    /**
     * Defines the display of the currency input.
     * @group Props
     */
    readonly currencyDisplay = input<string | undefined>();
    /**
     * Default trigger to run filtering on built-in text and numeric filters, valid values are 'enter' and 'input'.
     * @defaultValue enter
     * @group Props
     */
    readonly filterOn = input<string | undefined>('enter');
    /**
     * Defines if filter grouping will be enabled.
     * @group Props
     */
    readonly useGrouping = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Defines the visibility of buttons.
     * @group Props
     */
    readonly showButtons = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Defines the aria-label of the form element.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();
    /**
     * Used to pass all filter button property object
     * @defaultValue {
     filter: { severity: 'secondary', text: true, rounded: true },
     inline: {
        clear: { severity: 'secondary', text: true, rounded: true }
     },
     popover: {
         addRule: { severity: 'info', text: true, size: 'small' },
         removeRule: { severity: 'danger', text: true, size: 'small' },
         apply: { size: 'small' },
         clear: { outlined: true, size: 'small' }
        }
     }
     @group Props
     */
    readonly filterButtonProps = input<TableFilterButtonPropsOptions>({
        filter: { severity: 'secondary', text: true, rounded: true },
        inline: {
            clear: { severity: 'secondary', text: true, rounded: true }
        },
        popover: {
            addRule: { severity: 'info', text: true, size: 'small' },
            removeRule: { severity: 'danger', text: true, size: 'small' },
            apply: { size: 'small' },
            clear: { outlined: true, size: 'small' }
        }
    });
    motionOptions = input<MotionOptions | undefined>(undefined);

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });
    /**
     * Callback to invoke on overlay is shown.
     * @param {AnimationEvent} originalEvent - animation event.
     * @group Emits
     */
    readonly onShow = output<{
        originalEvent: AnimationEvent;
    }>();
    /**
     * Callback to invoke on overlay is hidden.
     * @param {AnimationEvent} originalEvent - animation event.
     * @group Emits
     */
    readonly onHide = output<{
        originalEvent: AnimationEvent;
    }>();

    readonly icon = viewChild(Button, { read: ElementRef });

    readonly clearButtonViewChild = viewChild<Nullable<ElementRef>>('clearBtn');

    readonly _templates = contentChildren(PrimeTemplate);

    overlaySubscription: Subscription | undefined;

    renderOverlay = signal<boolean>(false);

    /**
     * Custom header of the filter overlay.
     * @param context - header template context.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<ColumnFilterFieldTemplateContext>>('header', { descendants: false });
    readonly _headerTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    /**
     * Custom filter input.
     * @param context - filter template context.
     * @group Templates
     */
    readonly filterTemplate = contentChild<TemplateRef<ColumnFilterTemplateContext>>('filter', { descendants: false });
    readonly _filterTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'filter' || !ColumnFilter.KNOWN_TEMPLATE_TYPES.includes(item.getType()))
                .at(-1)?.template
    );

    /**
     * Custom footer of the filter overlay.
     * @param context - footer template context.
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<ColumnFilterFieldTemplateContext>>('footer', { descendants: false });
    readonly _footerTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );
    /**
     * Custom filter icon.
     * @param context - filtericon template context.
     * @group Templates
     */
    readonly filterIconTemplate = contentChild<TemplateRef<ColumnFilterIconTemplateContext>>('filtericon', { descendants: false });
    readonly _filterIconTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'filtericon')
                .at(-1)?.template
    );

    /**
     * Custom icon of the remove rule button.
     * @group Templates
     */
    readonly removeRuleIconTemplate = contentChild<TemplateRef<void>>('removeruleicon', { descendants: false });
    readonly _removeRuleIconTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'removeruleicon')
                .at(-1)?.template
    );

    /**
     * Custom icon of the add rule button.
     * @group Templates
     */
    readonly addRuleIconTemplate = contentChild<TemplateRef<void>>('addruleicon', { descendants: false });
    readonly _addRuleIconTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'addruleicon')
                .at(-1)?.template
    );

    readonly _clearFilterIconTemplate = computed<Nullable<TemplateRef<any>>>(
        () =>
            this._templates()
                .filter((item) => item.getType() === 'clearfiltericon')
                .at(-1)?.template
    );

    // pTemplate types that are not routed to the filter template.
    private static readonly KNOWN_TEMPLATE_TYPES = ['header', 'footer', 'filtericon', 'clearfiltericon', 'removeruleicon', 'addruleicon'];

    readonly operatorOptions = signal<any[] | undefined>(undefined);

    readonly overlayVisible = signal<boolean | undefined>(undefined);

    readonly overlay = signal<HTMLElement | undefined | null>(undefined);

    readonly scrollHandler = signal<ConnectedOverlayScrollHandler | null | undefined>(undefined);

    readonly documentClickListener = signal<VoidListener>(undefined);

    readonly documentResizeListener = signal<VoidListener>(undefined);

    readonly matchModes = signal<SelectItem[] | undefined>(undefined);

    translationSubscription: Subscription | undefined;

    resetSubscription: Subscription | undefined;

    readonly selfClick = signal<boolean | undefined>(undefined);

    readonly overlayEventListener = signal<any>(undefined);

    readonly overlayId = signal<any>(undefined);

    // fieldConstraints, showRemoveIcon, isShowAddConstraint and hasFilter stay getters: they read the
    // table's filter metadata, which is mutated in place (constraints pushed/removed, values typed in).
    get fieldConstraints(): FilterMetadata[] | undefined | null {
        return this.dataTable._filters() ? <FilterMetadata[]>this.dataTable._filters()[<string>this.field()] : null;
    }

    get showRemoveIcon(): boolean {
        return this.fieldConstraints ? this.fieldConstraints.length > 1 : false;
    }

    readonly showMenuButton = computed<boolean>(() => this.showMenu() && (this.display() === 'row' ? this.type() !== 'boolean' : true));

    readonly isShowOperator = computed<boolean>(() => this.showOperator() && this.type() !== 'boolean');

    get isShowAddConstraint(): boolean | undefined | null {
        return this.showAddButton() && this.type() !== 'boolean' && this.fieldConstraints && this.fieldConstraints.length < this.maxConstraints();
    }

    get showMenuButtonLabel() {
        return this.config.getTranslation(TranslationKeys.SHOW_FILTER_MENU);
    }

    get applyButtonLabel(): string {
        return this.config.getTranslation(TranslationKeys.APPLY);
    }

    get clearButtonLabel(): string {
        return this.config.getTranslation(TranslationKeys.CLEAR);
    }

    get addRuleButtonLabel(): string {
        return this.config.getTranslation(TranslationKeys.ADD_RULE);
    }

    get removeRuleButtonLabel(): string {
        return this.config.getTranslation(TranslationKeys.REMOVE_RULE);
    }

    get noFilterLabel(): string {
        return this.config.getTranslation(TranslationKeys.NO_FILTER);
    }

    get filterMenuButtonAriaLabel() {
        return this.config?.translation ? (this.overlayVisible() ? this.config?.translation?.aria?.hideFilterMenu : this.config?.translation?.aria?.showFilterMenu) : undefined;
    }

    get removeRuleButtonAriaLabel() {
        return this.config?.translation ? this.config?.translation?.removeRule : undefined;
    }

    get filterOperatorAriaLabel() {
        return this.config?.translation ? this.config?.translation?.aria?.filterOperator : undefined;
    }

    get filterConstraintAriaLabel() {
        return this.config?.translation ? this.config?.translation?.aria?.filterConstraint : undefined;
    }

    dataTable = inject(Table);

    overlayService = inject(OverlayService);

    onInit() {
        this.overlayId.set(UniqueComponentId());
        if (!this.dataTable._filters()[<string>this.field()]) {
            this.initFieldFilterConstraint();
        }

        this.translationSubscription = this.config.translationObserver.subscribe(() => {
            this.generateMatchModeOptions();
            this.generateOperatorOptions();
        });

        this.generateMatchModeOptions();
        this.generateOperatorOptions();
    }

    generateMatchModeOptions() {
        this.matchModes.set(
            this.matchModeOptions() ||
                (this.config as any).filterMatchModeOptions[this.type()]?.map((key: any) => {
                    return {
                        label: this.config.getTranslation(key),
                        value: key
                    };
                })
        );
    }

    generateOperatorOptions() {
        this.operatorOptions.set([
            {
                label: this.config.getTranslation(TranslationKeys.MATCH_ALL),
                value: FilterOperator.AND
            },
            {
                label: this.config.getTranslation(TranslationKeys.MATCH_ANY),
                value: FilterOperator.OR
            }
        ]);
    }

    initFieldFilterConstraint() {
        let defaultMatchMode = this.getDefaultMatchMode();
        this.dataTable._filters()[<string>this.field()] =
            this.display() == 'row'
                ? { value: null, matchMode: defaultMatchMode }
                : [
                      {
                          value: null,
                          matchMode: defaultMatchMode,
                          operator: this._operator()
                      }
                  ];
    }

    onMenuMatchModeChange(value: any, filterMeta: FilterMetadata) {
        filterMeta.matchMode = value;

        if (!this.showApplyButton()) {
            this.dataTable._filter();
        }
    }

    onRowMatchModeChange(matchMode: string) {
        const fieldFilter = <FilterMetadata>this.dataTable._filters()[<string>this.field()];
        fieldFilter.matchMode = matchMode;

        if (fieldFilter.value) {
            this.dataTable._filter();
        }

        this.hide();
    }

    onRowMatchModeKeyDown(event: KeyboardEvent) {
        let item = <HTMLLIElement>event.target;

        switch (event.key) {
            case 'ArrowDown':
                var nextItem = this.findNextItem(item);
                if (nextItem) {
                    item.removeAttribute('tabindex');
                    nextItem.tabIndex = '0';
                    nextItem.focus();
                }

                event.preventDefault();
                break;

            case 'ArrowUp':
                var prevItem = this.findPrevItem(item);
                if (prevItem) {
                    item.removeAttribute('tabindex');
                    prevItem.tabIndex = '0';
                    prevItem.focus();
                }

                event.preventDefault();
                break;
        }
    }

    onRowClearItemClick() {
        this.clearFilter();
        this.hide();
    }

    isRowMatchModeSelected(matchMode: string) {
        return (<FilterMetadata>this.dataTable._filters()[<string>this.field()]).matchMode === matchMode;
    }

    addConstraint() {
        (<FilterMetadata[]>this.dataTable._filters()[<string>this.field()]).push({
            value: null,
            matchMode: this.getDefaultMatchMode(),
            operator: this.getDefaultOperator()
        });
        DomHandler.focus(this.clearButtonViewChild()?.nativeElement);
        this.realignOverlayAfterRender();
    }

    removeConstraint(filterMeta: FilterMetadata) {
        this.dataTable._filters()[<string>this.field()] = (<FilterMetadata[]>this.dataTable._filters()[<string>this.field()]).filter((meta) => meta !== filterMeta);
        if (!this.showApplyButton()) {
            this.dataTable._filter();
        }
        DomHandler.focus(this.clearButtonViewChild()?.nativeElement);
        this.realignOverlayAfterRender();
    }

    // the overlay is positioned when it opens: a rule added or removed changes its height, so place it again for the
    // new height, above the button when it no longer fits below
    realignOverlayAfterRender() {
        afterNextRender(
            () => {
                const overlay = this.overlay();
                const buttonEl = <HTMLButtonElement>findSingle(this.el.nativeElement, '[data-pc-name="pccolumnfilterbutton"]');
                if (overlay?.isConnected && buttonEl && overlay.parentElement === this.document.body) {
                    absolutePosition(overlay, buttonEl);
                }
            },
            { injector: this.injector }
        );
    }

    onOperatorChange(value: any) {
        (<FilterMetadata[]>this.dataTable._filters()[<string>this.field()]).forEach((filterMeta) => {
            filterMeta.operator = value;
            this._operator.set(value);
        });

        if (!this.showApplyButton()) {
            this.dataTable._filter();
        }
    }

    toggleMenu(event: Event) {
        if (this.overlayVisible()) {
            this.hide();
        } else {
            this.show();
        }
        event.stopPropagation();
    }

    onToggleButtonKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Escape':
            case 'Tab':
                this.hide();
                break;

            case 'ArrowDown':
                if (this.overlayVisible()) {
                    let focusable = DomHandler.getFocusableElements(<HTMLElement>this.overlay());
                    if (focusable) {
                        focusable[0].focus();
                    }
                    event.preventDefault();
                } else if (event.altKey) {
                    this.overlayVisible.set(true);
                    event.preventDefault();
                }
                break;
            case 'Enter':
                this.toggleMenu(event);
                event.preventDefault();
                break;
        }
    }

    onEscape() {
        this.hide();
        this.icon()?.nativeElement.focus();
    }

    // the menu is a modal dialog (aria-modal): Tab and Shift+Tab cycle through its own controls
    onOverlayTabKeyDown(event: KeyboardEvent) {
        const focusable = DomHandler.getFocusableElements(<HTMLElement>this.overlay());

        if (focusable && focusable.length) {
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = this.document.activeElement;

            if (event.shiftKey && active === first) {
                last.focus();
                event.preventDefault();
            } else if (!event.shiftKey && active === last) {
                first.focus();
                event.preventDefault();
            }
        }
    }

    findNextItem(item: HTMLLIElement): any {
        let nextItem = <HTMLLIElement>item.nextElementSibling;

        if (nextItem) return find(nextItem, '[data-pc-section="filterconstraintseparator"]') ? this.findNextItem(nextItem) : nextItem;
        else return item.parentElement?.firstElementChild;
    }

    findPrevItem(item: HTMLLIElement): any {
        let prevItem = <HTMLLIElement>item.previousElementSibling;

        if (prevItem) return find(prevItem, '[data-pc-section="filterconstraintseparator"]') ? this.findPrevItem(prevItem) : prevItem;
        else return item.parentElement?.lastElementChild;
    }

    onContentClick() {
        this.selfClick.set(true);
    }

    onOverlayBeforeEnter(event: MotionEvent) {
        const overlay = event.element as HTMLElement;
        this.overlay.set(overlay);
        if (overlay && overlay.parentElement !== this.document.body) {
            const buttonEl = <HTMLButtonElement>findSingle(this.el.nativeElement, '[data-pc-name="pccolumnfilterbutton"]');
            appendChild(this.document.body, overlay);
            addStyle(overlay, { position: 'absolute', top: '0' });
            absolutePosition(overlay, buttonEl);
            ZIndexUtils.set('overlay', overlay, this.config.zIndex.overlay);
        }

        this.bindDocumentClickListener();
        this.bindDocumentResizeListener();
        this.bindScrollListener();

        this.overlayEventListener.set((e: any) => {
            if (this.overlay()?.contains(e.target)) {
                this.selfClick.set(true);
            }
        });

        this.overlaySubscription = this.overlayService.clickObservable.subscribe(this.overlayEventListener());

        this.onShow.emit({ originalEvent: event as any });
        this.focusOnFirstElement();
    }

    onOverlayAnimationAfterLeave(event: MotionEvent) {
        this.restoreOverlayAppend();
        ZIndexUtils.clear(this.overlay());
        this.onOverlayHide();
        this.renderOverlay.set(false);
        if (this.overlaySubscription) {
            this.overlaySubscription.unsubscribe();
        }

        this.onHide.emit({ originalEvent: event as any });
    }

    restoreOverlayAppend() {
        const overlay = this.overlay();
        if (overlay) {
            this.el.nativeElement.appendChild(overlay);
        }
    }

    focusOnFirstElement() {
        const overlay = this.overlay();
        if (overlay) {
            DomHandler.focus(DomHandler.getFirstFocusableElement(overlay, ''));
        }
    }

    getDefaultMatchMode(): string {
        const matchMode = this.matchMode();
        if (matchMode) {
            return matchMode;
        } else {
            if (this.type() === 'text') return FilterMatchMode.STARTS_WITH;
            else if (this.type() === 'numeric') return FilterMatchMode.EQUALS;
            else if (this.type() === 'date') return FilterMatchMode.DATE_IS;
            else return FilterMatchMode.CONTAINS;
        }
    }

    getDefaultOperator(): string | undefined {
        return this.dataTable._filters() ? (<FilterMetadata[]>this.dataTable._filters()[<string>(<string>this.field())])[0].operator : this._operator();
    }

    hasRowFilter() {
        return this.dataTable._filters()[<string>this.field()] && !this.dataTable.isFilterBlank((<FilterMetadata>this.dataTable._filters()[<string>this.field()]).value);
    }

    get hasFilter(): boolean {
        let fieldFilter = this.dataTable._filters()[<string>this.field()];
        if (fieldFilter) {
            if (Array.isArray(fieldFilter)) return (<FilterMetadata[]>fieldFilter).some((meta) => !this.dataTable.isFilterBlank(meta.value));
            else return !this.dataTable.isFilterBlank(fieldFilter.value);
        }

        return false;
    }

    isOutsideClicked(event: any): boolean {
        const icon = this.icon();
        return !(
            findSingle((this.overlay() as HTMLElement).nextElementSibling!, '[data-pc-section="filteroverlay"]') ||
            findSingle((this.overlay() as HTMLElement).nextElementSibling!, '[data-pc-name="popover"]') ||
            this.overlay()?.isSameNode(event.target) ||
            this.overlay()?.contains(event.target) ||
            icon?.nativeElement.isSameNode(event.target) ||
            icon?.nativeElement.contains(event.target) ||
            findSingle(event.target, '[data-pc-name="pcaddrulebuttonlabel"]') ||
            findSingle(event.target.parentElement, '[data-pc-name="pcaddrulebuttonlabel"]') ||
            findSingle(event.target, '[data-pc-name="pcfilterremoverulebutton"]') ||
            findSingle(event.target.parentElement, '[data-pc-name="pcfilterremoverulebutton"]')
        );
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener()) {
            const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : 'document';

            this.documentClickListener.set(
                // a click, not a mousedown: the overlays of the menu (select, datepicker), even appended to body,
                // report their clicks through OverlayService before the click reaches the document (selfClick)
                this.renderer.listen(documentTarget, 'click', (event) => {
                    if (this.overlayVisible() && !this.selfClick() && this.isOutsideClicked(event)) {
                        this.hide();
                    }

                    this.selfClick.set(false);
                })
            );
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener()) {
            this.documentClickListener()!();
            this.documentClickListener.set(null);
            this.selfClick.set(false);
        }
    }

    bindDocumentResizeListener() {
        if (!this.documentResizeListener()) {
            this.documentResizeListener.set(
                this.renderer.listen(this.document.defaultView, 'resize', () => {
                    if (this.overlayVisible() && !DomHandler.isTouchDevice()) {
                        this.hide();
                    }
                })
            );
        }
    }

    unbindDocumentResizeListener() {
        if (this.documentResizeListener()) {
            this.documentResizeListener()!();
            this.documentResizeListener.set(null);
        }
    }

    bindScrollListener() {
        if (!this.scrollHandler()) {
            this.scrollHandler.set(
                new ConnectedOverlayScrollHandler(this.icon()?.nativeElement, () => {
                    if (this.overlayVisible()) {
                        this.hide();
                    }
                })
            );
        }

        this.scrollHandler()!.bindScrollListener();
    }

    unbindScrollListener() {
        this.scrollHandler()?.unbindScrollListener();
    }

    show() {
        this.renderOverlay.set(true);
        this.overlayVisible.set(true);
    }

    hide() {
        this.overlayVisible.set(false);
    }

    onOverlayHide() {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
        this.overlay.set(null);
    }

    clearFilter() {
        this.initFieldFilterConstraint();
        this.dataTable._filter();
        if (this.hideOnClear()) this.hide();
    }

    applyFilter() {
        this.dataTable._filter();
        this.hide();
    }

    onDestroy() {
        if (this.overlay()) {
            this.restoreOverlayAppend();
            ZIndexUtils.clear(this.overlay());
            this.onOverlayHide();
        }

        if (this.translationSubscription) {
            this.translationSubscription.unsubscribe();
        }

        if (this.resetSubscription) {
            this.resetSubscription.unsubscribe();
        }

        if (this.overlaySubscription) {
            this.overlaySubscription.unsubscribe();
        }
    }
}

/**
 * @internal Rendering detail of ColumnFilter, not part of the public API: it may change or stop being exported in a minor version.
 */
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'p-column-filter-form-element, p-columnFilterFormElement',
    standalone: false,
    template: `
        @if (filterTemplate()) {
            <ng-container
                *ngTemplateOutlet="
                    filterTemplate();
                    context: {
                        $implicit: filterConstraint().value,
                        filterCallback: filterCallback,
                        type: type(),
                        field: field(),
                        filterConstraint: filterConstraint(),
                        placeholder: placeholder(),
                        minFractionDigits: minFractionDigits(),
                        maxFractionDigits: maxFractionDigits(),
                        prefix: prefix(),
                        suffix: suffix(),
                        locale: locale(),
                        localeMatcher: localeMatcher(),
                        currency: currency(),
                        currencyDisplay: currencyDisplay(),
                        useGrouping: useGrouping(),
                        showButtons: showButtons()
                    }
                "
            ></ng-container>
        } @else {
            @switch (type()) {
                @case ('text') {
                    <input
                        type="text"
                        [ariaLabel]="ariaLabel()"
                        pInputText
                        [pt]="ptm('pcFilterInputText')"
                        [value]="filterConstraint()?.value"
                        (input)="onModelChange($event.target.value)"
                        (keydown.enter)="onTextInputEnterKeyDown($event)"
                        (blur)="onInputBlur()"
                        [attr.placeholder]="placeholder()"
                        [unstyled]="unstyled()"
                    />
                }
                @case ('numeric') {
                    <p-inputNumber
                        [ngModel]="filterConstraint()?.value"
                        [ngModelOptions]="{ standalone: true }"
                        (ngModelChange)="onModelChange($event)"
                        (onKeyDown)="onNumericInputKeyDown($event)"
                        (onBlur)="onInputBlur()"
                        [showButtons]="showButtons()"
                        [minFractionDigits]="minFractionDigits()"
                        [maxFractionDigits]="maxFractionDigits()"
                        [ariaLabel]="ariaLabel()"
                        [prefix]="prefix()"
                        [suffix]="suffix()"
                        [placeholder]="placeholder()"
                        [mode]="currency() ? 'currency' : 'decimal'"
                        [locale]="locale()"
                        [localeMatcher]="localeMatcher()"
                        [currency]="currency()"
                        [currencyDisplay]="currencyDisplay()"
                        [useGrouping]="useGrouping()"
                        [pt]="ptm('pcFilterInputNumber')"
                        [unstyled]="unstyled()"
                    ></p-inputNumber>
                }
                @case ('boolean') {
                    <p-checkbox
                        [pt]="ptm('pcFilterCheckbox')"
                        [indeterminate]="filterConstraint()?.value === null"
                        [binary]="true"
                        [ariaLabel]="ariaLabel()"
                        [ngModel]="filterConstraint()?.value"
                        [ngModelOptions]="{ standalone: true }"
                        (ngModelChange)="onModelChange($event)"
                        [unstyled]="unstyled()"
                    />
                }
                @case ('date') {
                    <p-datepicker
                        [pt]="ptm('pcFilterDatePicker')"
                        [ariaLabel]="ariaLabel()"
                        [placeholder]="placeholder()"
                        [ngModel]="filterConstraint()?.value"
                        [ngModelOptions]="{ standalone: true }"
                        (ngModelChange)="onModelChange($event)"
                        appendTo="body"
                        [unstyled]="unstyled()"
                    ></p-datepicker>
                }
            }
        }
    `,
    providers: [TableStyle],
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [Bind]
})
export class ColumnFilterFormElement extends BaseComponent<ColumnFilterPassThrough> {
    dataTable = inject(Table);
    private colFilter = inject(ColumnFilter);

    hostName = 'Table';

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TableStyle);

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptm('columnFilterFormElement'));
    }

    readonly field = input<string | undefined>();

    readonly type = input<string | undefined>();

    readonly filterConstraint = input<FilterMetadata | undefined>();

    readonly filterTemplate = input<Nullable<TemplateRef<any>>>();

    readonly placeholder = input<string | undefined>();

    readonly minFractionDigits = input<number | undefined, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });

    readonly maxFractionDigits = input<number | undefined, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });

    readonly prefix = input<string | undefined>();

    readonly suffix = input<string | undefined>();

    readonly locale = input<string | undefined>();

    readonly localeMatcher = input<string | undefined>();

    readonly currency = input<string | undefined>();

    readonly currencyDisplay = input<string | undefined>();

    readonly useGrouping = input<boolean, unknown>(true, { transform: booleanAttribute });

    readonly ariaLabel = input<string | undefined>();

    readonly filterOn = input<string | undefined>();

    readonly showButtons = computed<boolean>(() => this.colFilter.showButtons());

    filterCallback = (value: any) => {
        (<any>this.filterConstraint()).value = value;
        this.dataTable._filter();
    };

    /** A value typed in the input and not applied yet: leaving the input applies it, like Enter. */
    private pendingValue = false;

    onModelChange(value: any) {
        (<any>this.filterConstraint()).value = value;

        // a menu with an Apply button only filters on Apply (or Enter)
        const applyOnButton = this.isAppliedOnButton();
        if (((this.type() === 'date' || this.type() === 'boolean' || !value) && !applyOnButton) || ((this.type() === 'text' || this.type() === 'numeric') && this.filterOn() === 'input')) {
            this.pendingValue = false;
            this.dataTable._filter();
        } else {
            this.pendingValue = true;
        }
    }

    onTextInputEnterKeyDown(event: KeyboardEvent) {
        this.pendingValue = false;
        this.dataTable._filter();
        event.preventDefault();
    }

    onNumericInputKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.pendingValue = false;
            this.dataTable._filter();
            event.preventDefault();
        }
    }

    onInputBlur() {
        if (this.pendingValue && !this.isAppliedOnButton()) {
            this.pendingValue = false;
            this.dataTable._filter();
        }
    }

    private isAppliedOnButton() {
        return this.colFilter.display() === 'menu' && this.colFilter.showApplyButton();
    }
}

@NgModule({
    imports: [
        CommonModule,
        PaginatorModule,
        InputTextModule,
        SelectModule,
        FormsModule,
        ButtonModule,
        SelectButtonModule,
        DatePickerModule,
        InputNumberModule,
        BadgeModule,
        CheckboxModule,
        ScrollerModule,
        ArrowDownIcon,
        ArrowUpIcon,
        SpinnerIcon,
        SortAltIcon,
        SortAmountUpAltIcon,
        SortAmountDownIcon,
        FilterIcon,
        FilterFillIcon,
        FilterSlashIcon,
        PlusIcon,
        TrashIcon,
        RadioButtonModule,
        BindModule,
        MotionModule
    ],
    exports: [
        Table,
        SharedModule,
        SortableColumn,
        FrozenColumn,
        RowGroupHeader,
        SelectableRow,
        RowToggler,
        ContextMenuRow,
        ResizableColumn,
        ReorderableColumn,
        EditableColumn,
        CellEditor,
        SortIcon,
        TableRadioButton,
        TableCheckbox,
        TableHeaderCheckbox,
        ReorderableRowHandle,
        ReorderableRow,
        SelectableRowDblClick,
        EditableRow,
        InitEditableRow,
        SaveEditableRow,
        CancelEditableRow,
        ColumnFilter,
        ColumnFilterFormElement,
        ScrollerModule
    ],
    declarations: [
        Table,
        SortableColumn,
        FrozenColumn,
        RowGroupHeader,
        SelectableRow,
        RowToggler,
        ContextMenuRow,
        ResizableColumn,
        ReorderableColumn,
        EditableColumn,
        CellEditor,
        TableBody,
        SortIcon,
        TableRadioButton,
        TableCheckbox,
        TableHeaderCheckbox,
        ReorderableRowHandle,
        ReorderableRow,
        SelectableRowDblClick,
        EditableRow,
        InitEditableRow,
        SaveEditableRow,
        CancelEditableRow,
        ColumnFilter,
        ColumnFilterFormElement
    ],
    providers: [TableStyle]
})
export class TableModule {}
