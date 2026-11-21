import { CommonModule } from '@angular/common';
import {
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    InjectionToken,
    input,
    linkedSignal,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    contentChild,
    output
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { resolveFieldData } from '@exhaustive-ui/utils';
import { BlockableUI, FilterService, Footer, Header, SharedModule, TranslationKeys } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { SpinnerIcon } from '@exhaustive-ui/core/icons';
import { PaginatorModule } from '@exhaustive-ui/core/paginator';
import { Nullable } from '@exhaustive-ui/core/ts-helpers';
import {
    DataViewGridTemplateContext,
    DataViewLayoutChangeEvent,
    DataViewLazyLoadEvent,
    DataViewListTemplateContext,
    DataViewPageEvent,
    DataViewPaginatorDropdownItemTemplateContext,
    DataViewPaginatorLeftTemplateContext,
    DataViewPaginatorRightTemplateContext,
    DataViewPaginatorState,
    DataViewPassThrough,
    DataViewSortEvent
} from '@exhaustive-ui/core/types/dataview';
import { DataViewStyle } from './style/dataviewstyle';

const DATAVIEW_INSTANCE = new InjectionToken<DataView>('DATAVIEW_INSTANCE');

/**
 * DataView displays data in grid or list layout with pagination and sorting features.
 * @group Components
 */
@Component({
    selector: 'p-dataView, p-dataview, p-data-view',
    imports: [CommonModule, PaginatorModule, SpinnerIcon, SharedModule, Bind],
    template: `
        @if (loading()) {
            <div [pBind]="ptm('loading')" [class]="cx('loading')">
                <div [pBind]="ptm('loadingOverlay')" [class]="cx('loadingOverlay')">
                    @if (loadingIcon()) {
                        <i [class]="cn(cx('loadingIcon'), 'pi-spin' + loadingIcon())"></i>
                    } @else {
                        <ng-container>
                            <svg [pBind]="ptm('loadingIcon')" data-p-icon="spinner" [spin]="true" [class]="cx('loadingIcon')" />
                            <ng-template *ngTemplateOutlet="loadingicon()"></ng-template>
                        </ng-container>
                    }
                </div>
            </div>
        }
        @if (header() || headerTemplate()) {
            <div [pBind]="ptm('header')" [class]="cx('header')">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate()"></ng-container>
            </div>
        }
        @if (paginator() && (paginatorPosition() === 'top' || paginatorPosition() == 'both')) {
            <p-paginator
                [rows]="_rows()"
                [first]="_first()"
                [totalRecords]="_totalRecords()"
                [pageLinkSize]="pageLinks()"
                [alwaysShow]="alwaysShowPaginator()"
                (onPageChange)="paginate($event)"
                [rowsPerPageOptions]="rowsPerPageOptions()"
                [appendTo]="paginatorDropdownAppendTo()"
                [dropdownScrollHeight]="paginatorDropdownScrollHeight()"
                [templateLeft]="paginatorleft()"
                [templateRight]="paginatorright()"
                [currentPageReportTemplate]="currentPageReportTemplate()"
                [showFirstLastIcon]="showFirstLastIcon()"
                [dropdownItemTemplate]="paginatordropdownitem()"
                [showCurrentPageReport]="showCurrentPageReport()"
                [showJumpToPageDropdown]="showJumpToPageDropdown()"
                [showPageLinks]="showPageLinks()"
                [class]="cn(cx('pcPaginator', { position: 'top' }), paginatorStyleClass())"
                [pt]="ptm('pcPaginator')"
                [unstyled]="unstyled()"
            ></p-paginator>
        }
        <div [pBind]="ptm('content')" [class]="cx('content')">
            @if (layout() === 'list') {
                <ng-container
                    *ngTemplateOutlet="
                        listTemplate();
                        context: {
                            $implicit: paginator() ? (filteredValue() || value() | slice: (lazy() ? 0 : _first()) : (lazy() ? 0 : _first()) + _rows()) : filteredValue() || value()
                        }
                    "
                ></ng-container>
            }
            @if (layout() === 'grid') {
                <ng-container
                    *ngTemplateOutlet="
                        gridTemplate();
                        context: {
                            $implicit: paginator() ? (filteredValue() || value() | slice: (lazy() ? 0 : _first()) : (lazy() ? 0 : _first()) + _rows()) : filteredValue() || value()
                        }
                    "
                ></ng-container>
            }
            @if (isEmpty() && !loading()) {
                <div [pBind]="ptm('emptyMessage')" [class]="cx('emptyMessage')">
                    @if (!emptymessageTemplate()) {
                        {{ emptyMessageLabel() }}
                    } @else {
                        <ng-template [ngTemplateOutlet]="empty"></ng-template>
                    }
                    <ng-container #empty *ngTemplateOutlet="emptymessageTemplate()"></ng-container>
                </div>
            }
        </div>
        @if (paginator() && (paginatorPosition() === 'bottom' || paginatorPosition() == 'both')) {
            <p-paginator
                [rows]="_rows()"
                [first]="_first()"
                [totalRecords]="_totalRecords()"
                [pageLinkSize]="pageLinks()"
                [alwaysShow]="alwaysShowPaginator()"
                (onPageChange)="paginate($event)"
                [rowsPerPageOptions]="rowsPerPageOptions()"
                [appendTo]="paginatorDropdownAppendTo()"
                [dropdownScrollHeight]="paginatorDropdownScrollHeight()"
                [templateLeft]="paginatorleft()"
                [templateRight]="paginatorright()"
                [currentPageReportTemplate]="currentPageReportTemplate()"
                [showFirstLastIcon]="showFirstLastIcon()"
                [dropdownItemTemplate]="paginatordropdownitem()"
                [showCurrentPageReport]="showCurrentPageReport()"
                [showJumpToPageDropdown]="showJumpToPageDropdown()"
                [showPageLinks]="showPageLinks()"
                [class]="cn(cx('pcPaginator', { position: 'bottom' }), paginatorStyleClass())"
                [pt]="ptm('pcPaginator')"
                [unstyled]="unstyled()"
            ></p-paginator>
        }
        @if (footer() || footerTemplate()) {
            <div [pBind]="ptm('footer')" [class]="cx('footer')">
                <ng-content select="p-footer"></ng-content>
                <ng-container *ngTemplateOutlet="footerTemplate()"></ng-container>
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [DataViewStyle, { provide: DATAVIEW_INSTANCE, useExisting: DataView }, { provide: PARENT_INSTANCE, useExisting: DataView }],
    host: {
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class DataView extends BaseComponent<DataViewPassThrough> implements BlockableUI {
    componentName = 'DataView';

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcDataView: DataView | undefined = inject(DATAVIEW_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
        afterNextRender(() => this.initialized.set(true));
        effect(() => {
            const layout = this.layout();

            untracked(() => {
                if (this.initialized()) {
                    this.onChangeLayout.emit({ layout });
                }
            });
        });
        effect(() => {
            this.value();

            untracked(() => {
                if (!this.lazy() && this.hasFilter()) {
                    this.filter(this.filterValue() as string);
                }
            });
        });
        effect(() => {
            const sortField = this.sortField();
            const sortOrder = this.sortOrder();

            untracked(() => {
                //avoid triggering lazy load prior to lazy initialization at onInit
                if (this.initialized() || (!this.lazy() && (sortField !== undefined || sortOrder !== undefined))) {
                    this.sort();
                }
            });
        });
    }

    /**
     * When specified as true, enables the pagination.
     * @group Props
     */
    readonly paginator = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Number of rows to display per page.
     * @group Props
     */
    readonly rows = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Number of total records, defaults to length of value when not defined.
     * @group Props
     */
    readonly totalRecords = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Number of page links to display in paginator.
     * @group Props
     */
    readonly pageLinks = input<number, unknown>(5, { transform: numberAttribute });
    /**
     * Array of integer/object values to display inside rows per page dropdown of paginator
     * @group Props
     */
    readonly rowsPerPageOptions = input<number[] | any[] | undefined>();
    /**
     * Position of the paginator.
     * @group Props
     */
    readonly paginatorPosition = input<'top' | 'bottom' | 'both'>('bottom');
    /**
     * Custom style class for paginator
     * @group Props
     */
    readonly paginatorStyleClass = input<string | undefined>();
    /**
     * Whether to show it even there is only one page.
     * @group Props
     */
    readonly alwaysShowPaginator = input<boolean, unknown>(true, { transform: booleanAttribute });
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
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    readonly lazy = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether to call lazy loading on initialization.
     * @group Props
     */
    readonly lazyLoadOnInit = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    readonly emptyMessage = input<string>('');
    /**
     * Style class of the grid.
     * @group Props
     */
    readonly gridStyleClass = input<string>('');
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity.
     * @group Props
     */
    readonly trackBy = input<Function>((index: number, item: any) => item);
    /**
     * Comma separated list of fields in the object graph to search against.
     * @group Props
     */
    readonly filterBy = input<string | undefined>();
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    readonly filterLocale = input<string | undefined>();
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
     * Index of the first row to be displayed.
     * @group Props
     */
    readonly first = input<number | undefined, unknown>(0, { transform: numberAttribute });
    /**
     * Property name of data to use in sorting by default.
     * @group Props
     */
    readonly sortField = input<string | undefined>();
    /**
     * Order to sort the data by default.
     * @group Props
     */
    readonly sortOrder = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * An array of objects to display.
     * @group Props
     */
    readonly value = input<any[] | undefined>();
    /**
     * Defines the layout mode.
     * @group Props
     */
    readonly layout = input<'list' | 'grid'>('list');
    /**
     * Callback to invoke when paging, sorting or filtering happens in lazy mode.
     * @param {DataViewLazyLoadEvent} event - Custom lazy load event.
     * @group Emits
     */
    readonly onLazyLoad = output<DataViewLazyLoadEvent>();
    /**
     * Callback to invoke when pagination occurs.
     * @param {DataViewPageEvent} event - Custom page event.
     * @group Emits
     */
    readonly onPage = output<DataViewPageEvent>();
    /**
     * Callback to invoke when sorting occurs.
     * @param {DataViewSortEvent} event - Custom sort event.
     * @group Emits
     */
    readonly onSort = output<DataViewSortEvent>();
    /**
     * Callback to invoke when changing layout.
     * @param {DataViewLayoutChangeEvent} event - Custom layout change event.
     * @group Emits
     */
    readonly onChangeLayout = output<DataViewLayoutChangeEvent>();
    /**
     * Template for the list layout.
     * @param {DataViewListTemplateContext} context - list template context.
     * @group Templates
     */
    readonly listTemplate = contentChild<Nullable<TemplateRef<DataViewListTemplateContext>>>('list');
    /**
     * Template for grid layout.
     * @param {DataViewGridTemplateContext} context - grid template context.
     * @group Templates
     */
    readonly gridTemplate = contentChild<TemplateRef<DataViewGridTemplateContext>>('grid');
    /**
     * Template for the header section.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<void>>('header');
    /**
     * Template for the empty message section.
     * @group Templates
     */
    readonly emptymessageTemplate = contentChild<TemplateRef<void>>('emptymessage');
    /**
     * Template for the footer section.
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<void>>('footer');
    /**
     * Template for the left side of paginator.
     * @param {DataViewPaginatorLeftTemplateContext} context - paginator left template context.
     * @group Templates
     */
    readonly paginatorleft = contentChild<TemplateRef<DataViewPaginatorLeftTemplateContext>>('paginatorleft');
    /**
     * Template for the right side of paginator.
     * @param {DataViewPaginatorRightTemplateContext} context - paginator right template context.
     * @group Templates
     */
    readonly paginatorright = contentChild<TemplateRef<DataViewPaginatorRightTemplateContext>>('paginatorright');
    /**
     * Template for items in paginator dropdown.
     * @param {DataViewPaginatorDropdownItemTemplateContext} context - paginator dropdown item template context.
     * @group Templates
     */
    readonly paginatordropdownitem = contentChild<TemplateRef<DataViewPaginatorDropdownItemTemplateContext>>('paginatordropdownitem');
    /**
     * Template for loading icon.
     * @group Templates
     */
    readonly loadingicon = contentChild<TemplateRef<void>>('loadingicon');
    readonly header = contentChild(Header);

    readonly footer = contentChild(Footer);

    filteredValue = signal<Nullable<any[]>>(undefined);

    filterValue = signal<Nullable<string>>(undefined);

    initialized = signal<Nullable<boolean>>(undefined);

    _first = linkedSignal<number | undefined>(() => this.first());

    _rows = linkedSignal<number | undefined>(() => this.rows());

    _totalRecords = linkedSignal<number | undefined>(() => {
        const totalRecords = this.totalRecords();
        const value = this.value();

        if (this.lazy() || (totalRecords != null && !Number.isNaN(totalRecords))) {
            return totalRecords;
        }

        return value ? value.length : 0;
    });

    translation = toSignal(this.config.translationObserver, { initialValue: this.config.translation });

    _componentStyle = inject(DataViewStyle);

    readonly emptyMessageLabel = computed<string>(() => this.emptyMessage() || this.translation()[TranslationKeys.EMPTY_MESSAGE]);

    filterService = inject(FilterService);

    onInit() {
        if (this.lazy() && this.lazyLoadOnInit()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
    }

    updateTotalRecords() {
        const value = this.value();

        this._totalRecords.set(this.lazy() ? this._totalRecords() : value ? value.length : 0);
    }

    paginate(event: DataViewPaginatorState) {
        this._first.set(event.first);
        this._rows.set(event.rows);

        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }

        this.onPage.emit({
            first: <number>this._first(),
            rows: <number>this._rows()
        });
    }

    sort() {
        this._first.set(0);

        const value = this.value();

        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        } else if (value) {
            const sortField = this.sortField();
            const sortOrder = this.sortOrder();

            value.sort((data1, data2) => {
                let value1 = resolveFieldData(data1, sortField);
                let value2 = resolveFieldData(data2, sortField);
                let result: number;

                if (value1 == null && value2 != null) result = -1;
                else if (value1 != null && value2 == null) result = 1;
                else if (value1 == null && value2 == null) result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
                else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

                return (sortOrder as number) * result;
            });

            if (this.hasFilter()) {
                this.filter(this.filterValue() as string);
            }
        }

        this.onSort.emit({
            sortField: <string>this.sortField(),
            sortOrder: <number>this.sortOrder()
        });
    }

    readonly isEmpty = computed(() => {
        let data = this.filteredValue() || this.value();
        return data == null || data.length == 0;
    });

    createLazyLoadMetadata(): DataViewLazyLoadEvent {
        return {
            first: <number>this._first(),
            rows: <number>this._rows(),
            sortField: <string>this.sortField(),
            sortOrder: <number>this.sortOrder()
        };
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    filter(filter: string, filterMatchMode: string = 'contains') {
        this.filterValue.set(filter);

        const value = this.value();

        if (value && value.length) {
            let searchFields = (this.filterBy() as string).split(',');
            let filteredValue: Nullable<any[]> = this.filterService.filter(value, searchFields, filter, filterMatchMode, this.filterLocale());

            if (filteredValue.length === value.length) {
                filteredValue = null;
            }

            this.filteredValue.set(filteredValue);

            if (this.paginator()) {
                this._first.set(0);
                this._totalRecords.set(filteredValue ? filteredValue.length : value ? value.length : 0);
            }
        }
    }

    readonly hasFilter = computed(() => this.filterValue() && (this.filterValue() as string).trim().length > 0);
}

@NgModule({
    imports: [DataView, SharedModule],
    exports: [DataView, SharedModule]
})
export class DataViewModule {}
