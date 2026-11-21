import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    afterNextRender,
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
    NgZone,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { findSingle, getHeight, getWidth, isTouchDevice, isVisible } from '@exhaustive-ui/utils';
import { PrimeTemplate, ScrollerOptions, SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { SpinnerIcon } from '@exhaustive-ui/core/icons';
import { Nullable, VoidListener } from '@exhaustive-ui/core/ts-helpers';
import {
    ScrollerContentTemplateContext,
    ScrollerItemTemplateContext,
    ScrollerLazyLoadEvent,
    ScrollerLoaderIconTemplateContext,
    ScrollerLoaderTemplateContext,
    ScrollerScrollEvent,
    ScrollerScrollIndexChangeEvent,
    ScrollerToType,
    VirtualScrollerPassThrough
} from '@exhaustive-ui/core/types/scroller';
import { ScrollerStyle } from './style/scrollerstyle';

const SCROLLER_INSTANCE = new InjectionToken<Scroller>('SCROLLER_INSTANCE');

/**
 * Scroller is a performance-approach to handle huge data efficiently.
 * @group Components
 */
@Component({
    selector: 'p-scroller, p-virtualscroller, p-virtual-scroller, p-virtualScroller',
    imports: [CommonModule, SpinnerIcon, SharedModule, Bind],
    template: `
        @if (!_disabled()) {
            <div #element [attr.id]="_id()" [attr.tabindex]="_tabindex()" [ngStyle]="_style()" [class]="cn(cx('root'), _styleClass())" (scroll)="onContainerScroll($event)" [pBind]="ptm('root')">
                @if (contentTemplate() || _contentTemplate()) {
                    <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate(); context: { $implicit: loadedItems(), options: getContentOptions() }"></ng-container>
                } @else {
                    <div #content [class]="cn(cx('content'), contentStyleClass())" [style]="contentStyle()" [pBind]="ptm('content')">
                        @for (item of loadedItems(); track _trackBy() ? _trackBy()($index, item) : item; let index = $index) {
                            <ng-container *ngTemplateOutlet="itemTemplate() || _itemTemplate(); context: { $implicit: item, options: getOptions(index) }"></ng-container>
                        }
                    </div>
                }
                @if (_showSpacer()) {
                    <div [class]="cx('spacer')" [ngStyle]="spacerStyle()" [pBind]="ptm('spacer')"></div>
                }
                @if (!_loaderDisabled() && _showLoader() && d_loading()) {
                    <div [class]="cx('loader')" [pBind]="ptm('loader')">
                        @if (loaderTemplate() || _loaderTemplate()) {
                            @for (item of loaderArr(); track item; let index = $index) {
                                <ng-container
                                    *ngTemplateOutlet="
                                        loaderTemplate() || _loaderTemplate();
                                        context: {
                                            options: getLoaderOptions(index, both() && { numCols: numItemsInViewport().cols })
                                        }
                                    "
                                ></ng-container>
                            }
                        } @else {
                            @if (loaderIconTemplate() || _loaderIconTemplate()) {
                                <ng-container *ngTemplateOutlet="loaderIconTemplate() || _loaderIconTemplate(); context: { options: { styleClass: 'p-virtualscroller-loading-icon' } }"></ng-container>
                            } @else {
                                <svg data-p-icon="spinner" [class]="cx('loadingIcon')" [spin]="true" [pBind]="ptm('loadingIcon')" />
                            }
                        }
                    </div>
                }
            </div>
        } @else {
            <ng-content></ng-content>
            @if (contentTemplate() || _contentTemplate()) {
                <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate(); context: { $implicit: _items(), options: { rows: _items(), columns: loadedColumns() } }"></ng-container>
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ScrollerStyle, { provide: SCROLLER_INSTANCE, useExisting: Scroller }, { provide: PARENT_INSTANCE, useExisting: Scroller }],
    host: {
        '[style.height]': 'height()'
    },
    hostDirectives: [Bind]
})
export class Scroller extends BaseComponent<VirtualScrollerPassThrough> {
    private zone = inject(NgZone);

    componentName = 'VirtualScroller';

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcScroller: Scroller | undefined = inject(SCROLLER_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    readonly hostName = input('');
    /**
     * Unique identifier of the element.
     * @group Props
     */
    readonly id = input<string | undefined>();
    /**
     * Inline style of the component.
     * @group Props
     */
    readonly style = input<any>();
    /**
     * Style class of the element.
     * @group Props
     */
    readonly styleClass = input<string | undefined>();
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number>(0);
    /**
     * An array of objects to display.
     * @group Props
     */
    readonly items = input<any[] | undefined | null>();
    /**
     * The height/width of item according to orientation.
     * @group Props
     */
    readonly itemSize = input<number[] | number>(0);
    /**
     * Height of the scroll viewport.
     * @group Props
     */
    readonly scrollHeight = input<string | undefined>();
    /**
     * Width of the scroll viewport.
     * @group Props
     */
    readonly scrollWidth = input<string | undefined>();
    /**
     * The orientation of scrollbar.
     * @group Props
     */
    readonly orientation = input<'vertical' | 'horizontal' | 'both'>('vertical');
    /**
     * Used to specify how many items to load in each load method in lazy mode.
     * @group Props
     */
    readonly step = input<number>(0);
    /**
     * Delay in scroll before new data is loaded.
     * @group Props
     */
    readonly delay = input<number>(0);
    /**
     * Delay after window's resize finishes.
     * @group Props
     */
    readonly resizeDelay = input<number>(10);
    /**
     * Used to append each loaded item to top without removing any items from the DOM. Using very large data may cause the browser to crash.
     * @group Props
     */
    readonly appendOnly = input<boolean>(false);
    /**
     * Specifies whether the scroller should be displayed inline or not.
     * @group Props
     */
    readonly inline = input<boolean>(false);
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    readonly lazy = input<boolean>(false);
    /**
     * If disabled, the scroller feature is eliminated and the content is displayed directly.
     * @group Props
     */
    readonly disabled = input<boolean>(false);
    /**
     * Used to implement a custom loader instead of using the loader feature in the scroller.
     * @group Props
     */
    readonly loaderDisabled = input<boolean>(false);
    /**
     * Columns to display.
     * @group Props
     */
    readonly columns = input<any[] | undefined | null>();
    /**
     * Used to implement a custom spacer instead of using the spacer feature in the scroller.
     * @group Props
     */
    readonly showSpacer = input<boolean>(true);
    /**
     * Defines whether to show loader.
     * @group Props
     */
    readonly showLoader = input<boolean>(false);
    /**
     * Determines how many additional elements to add to the DOM outside of the view. According to the scrolls made up and down, extra items are added in a certain algorithm in the form of multiples of this number. Default value is half the number of items shown in the view.
     * @group Props
     */
    readonly numToleratedItems = input<number>();
    /**
     * Defines whether the data is loaded.
     * @group Props
     */
    readonly loading = input<boolean | undefined>();
    /**
     * Defines whether to dynamically change the height or width of scrollable container.
     * @group Props
     */
    readonly autoSize = input<boolean>(false);
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algoritm checks for object identity.
     * @group Props
     */
    readonly trackBy = input<Function>();
    /**
     * Defines whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    readonly options = input<ScrollerOptions | undefined>();
    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {ScrollerLazyLoadEvent} event - Custom lazy load event.
     * @group Emits
     */
    readonly onLazyLoad = output<ScrollerLazyLoadEvent>();
    /**
     * Callback to invoke when scroll position changes.
     * @param {ScrollerScrollEvent} event - Custom scroll event.
     * @group Emits
     */
    readonly onScroll = output<ScrollerScrollEvent>();
    /**
     * Callback to invoke when scroll position and item's range in view changes.
     * @param {ScrollerScrollEvent} event - Custom scroll index change event.
     * @group Emits
     */
    readonly onScrollIndexChange = output<ScrollerScrollIndexChangeEvent>();

    readonly elementViewChild = viewChild<Nullable<ElementRef>>('element');

    readonly contentViewChild = viewChild<Nullable<ElementRef>>('content');

    readonly height = computed<string | undefined>(() => (this._scrollHeight() == '100%' ? '100%' : undefined));

    readonly _id = computed<string | undefined>(() => this.resolveOption('id', this.id()));

    readonly _style = computed<{ [klass: string]: any } | null | undefined>(() => this.resolveOption('style', this.style()));

    readonly _styleClass = computed<string | undefined>(() => this.resolveOption('styleClass', this.styleClass()));

    readonly _tabindex = computed<number>(() => this.resolveOption('tabindex', this.tabindex()));

    readonly _items = computed<any[] | undefined | null>(() => this.resolveOption('items', this.items()));

    readonly _itemSize = computed<number | number[]>(() => this.resolveOption('itemSize', this.itemSize()));

    readonly _scrollHeight = computed<string | undefined>(() => this.resolveOption('scrollHeight', this.scrollHeight()));

    readonly _scrollWidth = computed<string | undefined>(() => this.resolveOption('scrollWidth', this.scrollWidth()));

    readonly _orientation = computed<'vertical' | 'horizontal' | 'both'>(() => this.resolveOption('orientation', this.orientation()));

    readonly _step = computed<number>(() => this.resolveOption('step', this.step()));

    readonly _delay = computed<number>(() => this.resolveOption('delay', this.delay()));

    readonly _resizeDelay = computed<number>(() => this.resolveOption('resizeDelay', this.resizeDelay()));

    readonly _appendOnly = computed<boolean>(() => this.resolveOption('appendOnly', this.appendOnly()));

    readonly _inline = computed<boolean>(() => this.resolveOption('inline', this.inline()));

    readonly _lazy = computed<boolean>(() => this.resolveOption('lazy', this.lazy()));

    readonly _disabled = computed<boolean>(() => this.resolveOption('disabled', this.disabled()));

    readonly _loaderDisabled = computed<boolean>(() => this.resolveOption('loaderDisabled', this.loaderDisabled()));

    readonly _columns = computed<any[] | undefined | null>(() => this.resolveOption('columns', this.columns()));

    readonly _showSpacer = computed<boolean>(() => this.resolveOption('showSpacer', this.showSpacer()));

    readonly _showLoader = computed<boolean>(() => this.resolveOption('showLoader', this.showLoader()));

    readonly _numToleratedItems = computed<any>(() => this.resolveOption('numToleratedItems', this.numToleratedItems()));

    readonly _loading = computed<boolean | undefined>(() => this.resolveOption('loading', this.loading()));

    readonly _autoSize = computed<boolean>(() => this.resolveOption('autoSize', this.autoSize()));

    readonly _trackBy = computed<any>(() => this.resolveOption('trackBy', this.trackBy()));

    d_loading = linkedSignal<boolean | undefined, boolean>({
        source: () => this._loading(),
        computation: (loading, previous) => (previous === undefined ? false : untracked(() => this._lazy()) ? (loading as boolean) : previous.value)
    });

    d_numToleratedItems = linkedSignal<any>(() => this._numToleratedItems());

    contentEl = signal<any>(undefined);
    /**
     * Content template of the component.
     * @param {ScrollerContentTemplateContext} context - content context.
     * @see {@link ScrollerContentTemplateContext}
     * @group Templates
     */
    readonly contentTemplate = contentChild<Nullable<TemplateRef<ScrollerContentTemplateContext>>>('content', { descendants: false });

    /**
     * Item template of the component.
     * @param {ScrollerItemTemplateContext} context - item context.
     * @see {@link ScrollerItemTemplateContext}
     * @group Templates
     */
    readonly itemTemplate = contentChild<Nullable<TemplateRef<ScrollerItemTemplateContext>>>('item', { descendants: false });

    /**
     * Loader template of the component.
     * @param {ScrollerLoaderTemplateContext} context - loader context.
     * @see {@link ScrollerLoaderTemplateContext}
     * @group Templates
     */
    readonly loaderTemplate = contentChild<Nullable<TemplateRef<ScrollerLoaderTemplateContext>>>('loader', { descendants: false });

    /**
     * Loader icon template of the component.
     * @param {ScrollerLoaderIconTemplateContext} context - loader icon context.
     * @see {@link ScrollerLoaderIconTemplateContext}
     * @group Templates
     */
    readonly loaderIconTemplate = contentChild<Nullable<TemplateRef<ScrollerLoaderIconTemplateContext>>>('loadericon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    readonly _contentTemplate = computed<TemplateRef<ScrollerContentTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'content')
                .at(-1)?.template
    );

    readonly _itemTemplate = computed<TemplateRef<ScrollerItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => !['content', 'loader', 'loadericon'].includes(item.getType()))
                .at(-1)?.template
    );

    readonly _loaderTemplate = computed<TemplateRef<ScrollerLoaderTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'loader')
                .at(-1)?.template
    );

    readonly _loaderIconTemplate = computed<TemplateRef<ScrollerLoaderIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'loadericon')
                .at(-1)?.template
    );

    first = signal<any>(0);

    last = signal<any>(0);

    page = signal<number>(0);

    isRangeChanged = signal<boolean>(false);

    numItemsInViewport = signal<any>(0);

    lastScrollPos = linkedSignal<'vertical' | 'horizontal' | 'both', any>({
        source: () => this._orientation(),
        computation: (orientation) => (orientation === 'both' ? { top: 0, left: 0 } : 0)
    });

    lazyLoadState = signal<any>({});

    loaderArr = signal<any[]>([]);

    spacerStyle = signal<{ [klass: string]: any } | null | undefined>({});

    contentStyle = linkedSignal<{ [klass: string]: any } | null | undefined, { [klass: string]: any } | null | undefined>({
        source: () => this.resolveOption('contentStyle', undefined),
        computation: (contentStyle, previous) => (contentStyle !== undefined ? contentStyle : (previous?.value ?? {}))
    });

    scrollTimeout = signal<any>(undefined);

    resizeTimeout = signal<any>(undefined);

    initialized = signal<boolean>(false);

    windowResizeListener = signal<VoidListener>(undefined);

    defaultWidth = signal<number | undefined>(undefined);

    defaultHeight = signal<number | undefined>(undefined);

    defaultContentWidth = signal<number | undefined>(undefined);

    defaultContentHeight = signal<number | undefined>(undefined);

    readonly contentStyleClass = computed<any>(() => this.resolveOption('contentStyleClass', undefined));

    readonly vertical = computed(() => this._orientation() === 'vertical');

    readonly horizontal = computed(() => this._orientation() === 'horizontal');

    readonly both = computed(() => this._orientation() === 'both');

    readonly loadedItems = computed(() => {
        const items = this._items();
        if (items && !this.d_loading()) {
            if (this.both()) {
                return items.slice(this._appendOnly() ? 0 : this.first().rows, this.last().rows).map((item) => {
                    if (this._columns()) {
                        return item;
                    } else if (Array.isArray(item)) {
                        return item.slice(this._appendOnly() ? 0 : this.first().cols, this.last().cols);
                    } else {
                        return item;
                    }
                });
            } else if (this.horizontal() && this._columns()) return items;
            else return items.slice(this._appendOnly() ? 0 : this.first(), this.last());
        }

        return [];
    });

    readonly loadedRows = computed(() => (this.d_loading() ? (this._loaderDisabled() ? this.loaderArr() : []) : this.loadedItems()));

    readonly loadedColumns = computed(() => {
        const columns = this._columns();
        if (columns && (this.both() || this.horizontal())) {
            return this.d_loading() && this._loaderDisabled() ? (this.both() ? this.loaderArr()[0] : this.loaderArr()) : columns.slice(this.both() ? this.first().cols : this.first(), this.both() ? this.last().cols : this.last());
        }

        return columns;
    });

    _componentStyle = inject(ScrollerStyle);

    onInit() {
        this.setInitialState();
    }

    constructor() {
        super();

        let previousLayout: { itemsLength: number | undefined; itemSize: number | number[]; scrollHeight: string | undefined; scrollWidth: string | undefined; loading: boolean | undefined } | undefined;

        effect(() => {
            const layout = { itemsLength: this._items()?.length, itemSize: this._itemSize(), scrollHeight: this._scrollHeight(), scrollWidth: this._scrollWidth(), loading: this._loading() };

            untracked(() => {
                if (previousLayout && this.initialized()) {
                    const isLoadingChanged = this._lazy() && previousLayout.loading !== layout.loading;
                    const isChanged =
                        !isLoadingChanged &&
                        (previousLayout.itemsLength !== layout.itemsLength || previousLayout.itemSize !== layout.itemSize || previousLayout.scrollHeight !== layout.scrollHeight || previousLayout.scrollWidth !== layout.scrollWidth);

                    if (isChanged) {
                        const first = this.both() ? this.first().rows : this.first();

                        if (!this._lazy() && first > 0 && first >= (layout.itemsLength ?? 0)) {
                            // The list shrank below the rendered range: go back to the start, otherwise nothing is rendered.
                            this.first.set(this.both() ? { rows: 0, cols: 0 } : 0);
                            this.lastScrollPos.set(this.both() ? { top: 0, left: 0 } : 0);
                            this.scrollTo({ top: 0, left: 0 });
                        }

                        this.init();
                    }
                }

                previousLayout = layout;
            });
        });

        afterNextRender(() => {
            Promise.resolve().then(() => {
                this.viewInit();
            });
        });

        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptm('host'));

        afterEveryRender(() => {
            if (!this.initialized()) {
                this.viewInit();
            }
        });
    }

    onDestroy() {
        this.unbindResizeListener();

        this.contentEl.set(null);
        this.initialized.set(false);
    }

    viewInit() {
        if (isPlatformBrowser(this.platformId) && !this.initialized()) {
            const elementViewChild = this.elementViewChild();
            if (isVisible(elementViewChild?.nativeElement)) {
                this.setInitialState();
                this.setContentEl(this.contentEl());
                this.init();

                this.defaultWidth.set(getWidth(elementViewChild?.nativeElement));
                this.defaultHeight.set(getHeight(elementViewChild?.nativeElement));
                this.defaultContentWidth.set(getWidth(this.contentEl()));
                this.defaultContentHeight.set(getHeight(this.contentEl()));
                this.initialized.set(true);
            }
        }
    }

    init() {
        if (!this._disabled()) {
            this.bindResizeListener();

            // wait for the next tick
            setTimeout(() => {
                this.setSpacerSize();
                this.setSize();
                this.calculateOptions();
                this.calculateAutoSize();
                // the new range is rendered on the next change detection: measure it again then
                this._autoSize() && afterNextRender(() => this.calculateAutoSize(), { injector: this.injector });
            }, 1);
        }
    }

    setContentEl(el?: HTMLElement) {
        this.contentEl.set(el || this.contentViewChild()?.nativeElement || findSingle(this.elementViewChild()?.nativeElement, '.p-virtualscroller-content'));
    }
    setInitialState() {
        this.first.set(this.both() ? { rows: 0, cols: 0 } : 0);
        this.last.set(this.both() ? { rows: 0, cols: 0 } : 0);
        this.numItemsInViewport.set(this.both() ? { rows: 0, cols: 0 } : 0);
        this.lastScrollPos.set(this.both() ? { top: 0, left: 0 } : 0);
        if (this.d_loading() === undefined || this.d_loading() === false) {
            this.d_loading.set(this._loading() || false);
        }
        this.d_numToleratedItems.set(this._numToleratedItems());
        this.loaderArr.set(this.loaderArr().length > 0 ? this.loaderArr() : []);
    }

    getElementRef() {
        return this.elementViewChild();
    }

    getPageByFirst(first?: any) {
        return Math.floor(((first ?? this.first()) + this.d_numToleratedItems() * 4) / (this._step() || 1));
    }

    isPageChanged(first?: any) {
        return this._step() ? this.page() !== this.getPageByFirst(first ?? this.first()) : true;
    }

    scrollTo(options: ScrollToOptions) {
        this.elementViewChild()?.nativeElement?.scrollTo(options);
    }

    scrollToIndex(index: number | number[], behavior: ScrollBehavior = 'auto') {
        const valid = this.both() ? (index as number[]).every((i) => i > -1) : (index as number) > -1;

        if (valid) {
            const first = this.first();
            const { scrollTop = 0, scrollLeft = 0 } = this.elementViewChild()?.nativeElement;
            const { numToleratedItems } = this.calculateNumItems();
            const contentPos = this.getContentPosition();
            const itemSize = this._itemSize();
            const calculateFirst = (_index = 0, _numT) => (_index <= _numT ? 0 : _index);
            const calculateCoord = (_first, _size, _cpos) => _first * _size + _cpos;
            const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
            let newFirst = this.both() ? { rows: 0, cols: 0 } : 0;
            let isRangeChanged = false,
                isScrollChanged = false;

            if (this.both()) {
                newFirst = {
                    rows: calculateFirst(index[0], numToleratedItems[0]),
                    cols: calculateFirst(index[1], numToleratedItems[1])
                };
                scrollTo(calculateCoord(index[1], itemSize[1], contentPos.left), calculateCoord(index[0], itemSize[0], contentPos.top));
                isScrollChanged = this.lastScrollPos().top !== scrollTop || this.lastScrollPos().left !== scrollLeft;
                isRangeChanged = newFirst.rows !== first.rows || newFirst.cols !== first.cols;
            } else {
                newFirst = calculateFirst(index as number, numToleratedItems);
                this.horizontal() ? scrollTo(calculateCoord(index, itemSize, contentPos.left), scrollTop) : scrollTo(scrollLeft, calculateCoord(index, itemSize, contentPos.top));
                isScrollChanged = this.lastScrollPos() !== (this.horizontal() ? scrollLeft : scrollTop);
                isRangeChanged = newFirst !== first;
            }

            this.isRangeChanged.set(isRangeChanged);
            isScrollChanged && this.first.set(newFirst);
        }
    }

    scrollInView(index: number, to: ScrollerToType, behavior: ScrollBehavior = 'auto') {
        if (to) {
            const { first, viewport } = this.getRenderedRange();
            const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
            const isToStart = to === 'to-start';
            const isToEnd = to === 'to-end';
            const itemSize = this._itemSize();

            if (isToStart) {
                if (this.both()) {
                    if (viewport.first.rows - first.rows > (<any>index)[0]) {
                        scrollTo(viewport.first.cols * (<number[]>itemSize)[1], (viewport.first.rows - 1) * (<number[]>itemSize)[0]);
                    } else if (viewport.first.cols - first.cols > (<any>index)[1]) {
                        scrollTo((viewport.first.cols - 1) * (<number[]>itemSize)[1], viewport.first.rows * (<number[]>itemSize)[0]);
                    }
                } else {
                    if (viewport.first - first > index) {
                        const pos = (viewport.first - 1) * <number>itemSize;
                        this.horizontal() ? scrollTo(pos, 0) : scrollTo(0, pos);
                    }
                }
            } else if (isToEnd) {
                if (this.both()) {
                    if (viewport.last.rows - first.rows <= (<any>index)[0] + 1) {
                        scrollTo(viewport.first.cols * (<number[]>itemSize)[1], (viewport.first.rows + 1) * (<number[]>itemSize)[0]);
                    } else if (viewport.last.cols - first.cols <= (<any>index)[1] + 1) {
                        scrollTo((viewport.first.cols + 1) * (<number[]>itemSize)[1], viewport.first.rows * (<number[]>itemSize)[0]);
                    }
                } else {
                    if (viewport.last - first <= index + 1) {
                        const pos = (viewport.first + 1) * <number>itemSize;
                        this.horizontal() ? scrollTo(pos, 0) : scrollTo(0, pos);
                    }
                }
            }
        } else {
            this.scrollToIndex(index, behavior);
        }
    }

    getRenderedRange() {
        const calculateFirstInViewport = (_pos: number, _size: number) => (_size || _pos ? Math.floor(_pos / (_size || _pos)) : 0);

        let firstInViewport = this.first();
        let lastInViewport: any = 0;

        const elementViewChild = this.elementViewChild();
        if (elementViewChild?.nativeElement) {
            const { scrollTop, scrollLeft } = elementViewChild.nativeElement;

            if (this.both()) {
                firstInViewport = {
                    rows: calculateFirstInViewport(scrollTop, (<number[]>this._itemSize())[0]),
                    cols: calculateFirstInViewport(scrollLeft, (<number[]>this._itemSize())[1])
                };
                lastInViewport = {
                    rows: firstInViewport.rows + this.numItemsInViewport().rows,
                    cols: firstInViewport.cols + this.numItemsInViewport().cols
                };
            } else {
                const scrollPos = this.horizontal() ? scrollLeft : scrollTop;
                firstInViewport = calculateFirstInViewport(scrollPos, <number>this._itemSize());
                lastInViewport = firstInViewport + this.numItemsInViewport();
            }
        }

        return {
            first: this.first(),
            last: this.last(),
            viewport: {
                first: firstInViewport,
                last: lastInViewport
            }
        };
    }

    calculateNumItems() {
        const contentPos = this.getContentPosition();
        const elementViewChild = this.elementViewChild();
        const contentWidth = (elementViewChild?.nativeElement ? elementViewChild.nativeElement.offsetWidth - contentPos.left : 0) || 0;
        const elementViewChildValue = this.elementViewChild();
        const contentHeight = (elementViewChildValue?.nativeElement ? elementViewChildValue.nativeElement.offsetHeight - contentPos.top : 0) || 0;
        const calculateNumItemsInViewport = (_contentSize: number, _itemSize: number) => (_itemSize || _contentSize ? Math.ceil(_contentSize / (_itemSize || _contentSize)) : 0);
        const calculateNumToleratedItems = (_numItems: number) => Math.ceil(_numItems / 2);
        const numItemsInViewport: any = this.both()
            ? {
                  rows: calculateNumItemsInViewport(contentHeight, (<number[]>this._itemSize())[0]),
                  cols: calculateNumItemsInViewport(contentWidth, (<number[]>this._itemSize())[1])
              }
            : calculateNumItemsInViewport(this.horizontal() ? contentWidth : contentHeight, <number>this._itemSize());

        const numToleratedItems = this.d_numToleratedItems() || (this.both() ? [calculateNumToleratedItems(numItemsInViewport.rows), calculateNumToleratedItems(numItemsInViewport.cols)] : calculateNumToleratedItems(numItemsInViewport));

        return { numItemsInViewport, numToleratedItems };
    }

    calculateOptions() {
        const { numItemsInViewport, numToleratedItems } = this.calculateNumItems();
        const calculateLast = (_first: number, _num: number, _numT: number, _isCols: boolean = false) => this.getLast(_first + _num + (_first < _numT ? 2 : 3) * _numT, _isCols);
        const first = this.first();
        const last = this.both()
            ? {
                  rows: calculateLast(first.rows, numItemsInViewport.rows, numToleratedItems[0]),
                  cols: calculateLast(first.cols, numItemsInViewport.cols, numToleratedItems[1], true)
              }
            : calculateLast(first, numItemsInViewport, numToleratedItems);

        this.last.set(last);
        this.numItemsInViewport.set(numItemsInViewport);
        this.d_numToleratedItems.set(numToleratedItems);

        if (this._showLoader()) {
            this.loaderArr.set(this.both() ? Array.from({ length: numItemsInViewport.rows }).map(() => Array.from({ length: numItemsInViewport.cols })) : Array.from({ length: numItemsInViewport }));
        }

        if (this._lazy()) {
            Promise.resolve().then(() => {
                const step = this._step();
                // From the top, the current page (getPageByFirst looks ahead by the tolerated items) can already be past
                // the first one: request every page up to it, the scroll handlers only request the pages after it.
                const pages = step && !this.both() && first === 0 ? this.getPageByFirst(0) + 1 : 1;
                this.lazyLoadState.set({
                    first: step ? (this.both() ? { rows: 0, cols: first.cols } : 0) : first,
                    last: Math.min(step ? step * pages : this.last(), (<any[]>this._items()).length)
                });

                this.handleEvents('onLazyLoad', this.lazyLoadState());
            });
        }
    }

    calculateAutoSize() {
        if (this._autoSize() && !this.d_loading()) {
            Promise.resolve().then(() => {
                const contentEl = this.contentEl();
                if (contentEl) {
                    contentEl.style.minHeight = contentEl.style.minWidth = 'auto';
                    contentEl.style.position = 'relative';
                    (<ElementRef>this.elementViewChild()).nativeElement.style.contain = 'none';

                    const [contentWidth, contentHeight] = [getWidth(contentEl), getHeight(contentEl)];
                    const element = (<ElementRef>this.elementViewChild()).nativeElement;
                    // releasing the size below can shrink the viewport for a moment and clamp its scroll position
                    const { scrollTop, scrollLeft } = element;
                    // A list smaller than the viewport is measured even when its content has the size it had at init
                    // (one item on the first search): the default size is that of the content, not of the viewport.
                    const items = this._items() || [];
                    const itemSize = this._itemSize();
                    const listHeight = this.both() ? items.length * (<number[]>itemSize)[0] : this.vertical() ? items.length * <number>itemSize : Infinity;
                    const listWidth = this.both() ? (this._columns() || items[0] || []).length * (<number[]>itemSize)[1] : this.horizontal() ? (this._columns() || items).length * <number>itemSize : Infinity;
                    (contentWidth !== this.defaultContentWidth() || listWidth < getWidth(element)) && (element.style.width = '');
                    (contentHeight !== this.defaultContentHeight() || listHeight < getHeight(element)) && (element.style.height = '');

                    const [width, height] = [getWidth((<ElementRef>this.elementViewChild()).nativeElement), getHeight((<ElementRef>this.elementViewChild()).nativeElement)];
                    (this.both() || this.horizontal()) && ((<ElementRef>this.elementViewChild()).nativeElement.style.width = width < <number>this.defaultWidth() ? width + 'px' : this._scrollWidth() || this.defaultWidth() + 'px');
                    (this.both() || this.vertical()) && ((<ElementRef>this.elementViewChild()).nativeElement.style.height = height < <number>this.defaultHeight() ? height + 'px' : this._scrollHeight() || this.defaultHeight() + 'px');

                    contentEl.style.minHeight = contentEl.style.minWidth = '';
                    contentEl.style.position = '';
                    (<ElementRef>this.elementViewChild()).nativeElement.style.contain = '';
                    if (element.scrollTop !== scrollTop || element.scrollLeft !== scrollLeft) {
                        element.scrollTop = scrollTop;
                        element.scrollLeft = scrollLeft;
                    }
                }
            });
        }
    }

    getLast(last = 0, isCols = false) {
        const items = this._items();
        return items ? Math.min(isCols ? (this._columns() || items[0]).length : items.length, last) : 0;
    }

    getContentPosition() {
        const contentEl = this.contentEl();
        if (contentEl) {
            const style = getComputedStyle(contentEl);
            const left = parseFloat(style.paddingLeft) + Math.max(parseFloat(style.left) || 0, 0);
            const right = parseFloat(style.paddingRight) + Math.max(parseFloat(style.right) || 0, 0);
            const top = parseFloat(style.paddingTop) + Math.max(parseFloat(style.top) || 0, 0);
            const bottom = parseFloat(style.paddingBottom) + Math.max(parseFloat(style.bottom) || 0, 0);

            return { left, right, top, bottom, x: left + right, y: top + bottom };
        }

        return { left: 0, right: 0, top: 0, bottom: 0, x: 0, y: 0 };
    }

    setSize() {
        const elementViewChild = this.elementViewChild();
        if (elementViewChild?.nativeElement) {
            const nativeElement = elementViewChild.nativeElement;
            const parentElement = nativeElement.parentElement?.parentElement;

            const elementWidth = nativeElement.offsetWidth;
            const parentWidth = parentElement?.offsetWidth || 0;
            const width = this._scrollWidth() || `${elementWidth || parentWidth}px`;

            const elementHeight = nativeElement.offsetHeight;
            const parentHeight = parentElement?.offsetHeight || 0;
            const height = this._scrollHeight() || `${elementHeight || parentHeight}px`;

            const setProp = (_name: string, _value: any) => (nativeElement.style[_name] = _value);

            if (this.both() || this.horizontal()) {
                setProp('height', height);
                setProp('width', width);
            } else {
                setProp('height', height);
            }
        }
    }

    setSpacerSize() {
        const items = this._items();
        if (items) {
            const contentPos = this.getContentPosition();
            const setProp = (_name: string, _value: any, _size: number, _cpos: number = 0) =>
                this.spacerStyle.update((spacerStyle) => ({
                    ...spacerStyle,
                    ...{ [`${_name}`]: (_value || []).length * _size + _cpos + 'px' }
                }));

            if (this.both()) {
                setProp('height', items, (<number[]>this._itemSize())[0], contentPos.y);
                setProp('width', this._columns() || items[1], (<number[]>this._itemSize())[1], contentPos.x);
            } else {
                this.horizontal() ? setProp('width', this._columns() || items, <number>this._itemSize(), contentPos.x) : setProp('height', items, <number>this._itemSize(), contentPos.y);
            }
        }
    }

    setContentPosition(pos: any) {
        if (this.contentEl() && !this._appendOnly()) {
            const first = pos ? pos.first : this.first();
            const calculateTranslateVal = (_first: number, _size: number) => _first * _size;
            const setTransform = (_x = 0, _y = 0) => this.contentStyle.update((contentStyle) => ({ ...contentStyle, ...{ transform: `translate3d(${_x}px, ${_y}px, 0)` } }));

            if (this.both()) {
                setTransform(calculateTranslateVal(first.cols, (<number[]>this._itemSize())[1]), calculateTranslateVal(first.rows, (<number[]>this._itemSize())[0]));
            } else {
                const translateVal = calculateTranslateVal(first, <number>this._itemSize());
                this.horizontal() ? setTransform(translateVal, 0) : setTransform(0, translateVal);
            }
        }
    }

    onScrollPositionChange(event: Event) {
        const target = event.target;
        if (!target) {
            throw new Error('Event target is null');
        }
        const contentPos = this.getContentPosition();
        const calculateScrollPos = (_pos: number, _cpos: number) => (_pos ? (_pos > _cpos ? _pos - _cpos : _pos) : 0);
        const calculateCurrentIndex = (_pos: number, _size: number) => (_size || _pos ? Math.floor(_pos / (_size || _pos)) : 0);
        const calculateTriggerIndex = (_currentIndex: number, _first: number, _last: number, _num: number, _numT: number, _isScrollDownOrRight: any) => {
            return _currentIndex <= _numT ? _numT : _isScrollDownOrRight ? _last - _num - _numT : _first + _numT - 1;
        };
        const calculateFirst = (_currentIndex: number, _triggerIndex: number, _first: number, _last: number, _num: number, _numT: number, _isScrollDownOrRight: any) => {
            if (_currentIndex <= _numT) return 0;
            else return Math.max(0, _isScrollDownOrRight ? (_currentIndex < _triggerIndex ? _first : _currentIndex - _numT) : _currentIndex > _triggerIndex ? _first : _currentIndex - 2 * _numT);
        };
        const calculateLast = (_currentIndex: number, _first: number, _last: number, _num: number, _numT: number, _isCols = false) => {
            let lastValue = _first + _num + 2 * _numT;

            if (_currentIndex >= _numT) {
                lastValue += _numT + 1;
            }

            return this.getLast(lastValue, _isCols);
        };

        const scrollTop = calculateScrollPos((<HTMLElement>target).scrollTop, contentPos.top);
        const scrollLeft = calculateScrollPos((<HTMLElement>target).scrollLeft, contentPos.left);

        const first = this.first();
        const last = this.last();
        const numItemsInViewport = this.numItemsInViewport();
        const d_numToleratedItems = this.d_numToleratedItems();
        const lastScrollPos = this.lastScrollPos();

        let newFirst = this.both() ? { rows: 0, cols: 0 } : 0;
        let newLast = last;
        let isRangeChanged = false;
        let newScrollPos = lastScrollPos;

        if (this.both()) {
            const isScrollDown = lastScrollPos.top <= scrollTop;
            const isScrollRight = lastScrollPos.left <= scrollLeft;

            if (!this._appendOnly() || (this._appendOnly() && (isScrollDown || isScrollRight))) {
                const currentIndex = {
                    rows: calculateCurrentIndex(scrollTop, (<number[]>this._itemSize())[0]),
                    cols: calculateCurrentIndex(scrollLeft, (<number[]>this._itemSize())[1])
                };
                const triggerIndex = {
                    rows: calculateTriggerIndex(currentIndex.rows, first.rows, last.rows, numItemsInViewport.rows, d_numToleratedItems[0], isScrollDown),
                    cols: calculateTriggerIndex(currentIndex.cols, first.cols, last.cols, numItemsInViewport.cols, d_numToleratedItems[1], isScrollRight)
                };

                newFirst = {
                    rows: calculateFirst(currentIndex.rows, triggerIndex.rows, first.rows, last.rows, numItemsInViewport.rows, d_numToleratedItems[0], isScrollDown),
                    cols: calculateFirst(currentIndex.cols, triggerIndex.cols, first.cols, last.cols, numItemsInViewport.cols, d_numToleratedItems[1], isScrollRight)
                };
                newLast = {
                    rows: calculateLast(currentIndex.rows, newFirst.rows, last.rows, numItemsInViewport.rows, d_numToleratedItems[0]),
                    cols: calculateLast(currentIndex.cols, newFirst.cols, last.cols, numItemsInViewport.cols, d_numToleratedItems[1], true)
                };

                isRangeChanged = newFirst.rows !== first.rows || newLast.rows !== last.rows || newFirst.cols !== first.cols || newLast.cols !== last.cols || this.isRangeChanged();
                newScrollPos = { top: scrollTop, left: scrollLeft };
            }
        } else {
            const scrollPos = this.horizontal() ? scrollLeft : scrollTop;
            const isScrollDownOrRight = lastScrollPos <= scrollPos;

            if (!this._appendOnly() || (this._appendOnly() && isScrollDownOrRight)) {
                const currentIndex = calculateCurrentIndex(scrollPos, <number>this._itemSize());
                const triggerIndex = calculateTriggerIndex(currentIndex, first, last, numItemsInViewport, d_numToleratedItems, isScrollDownOrRight);

                newFirst = calculateFirst(currentIndex, triggerIndex, first, last, numItemsInViewport, d_numToleratedItems, isScrollDownOrRight);
                newLast = calculateLast(currentIndex, newFirst, last, numItemsInViewport, d_numToleratedItems);
                isRangeChanged = newFirst !== first || newLast !== last || this.isRangeChanged();
                newScrollPos = scrollPos;
            }
        }

        return {
            first: newFirst,
            last: newLast,
            isRangeChanged,
            scrollPos: newScrollPos
        };
    }

    onScrollChange(event: Event) {
        const { first, last, isRangeChanged, scrollPos } = this.onScrollPositionChange(event);

        if (isRangeChanged) {
            const newState = { first, last };

            this.setContentPosition(newState);

            // When the range moves anywhere other than one page forward (a backward scroll or a
            // multi-page jump), the page before the landing page can still be (partially) visible
            // through the tolerated items, so it must be included in the lazy load request.
            const currentPage = this.getPageByFirst(first);
            const previousPage = this.getPageByFirst(this.first());
            const loadPreviousPage = currentPage !== previousPage && currentPage !== previousPage + 1;

            this.first.set(first);
            this.last.set(last);
            this.lastScrollPos.set(scrollPos);

            this.handleEvents('onScrollIndexChange', newState);

            if (this._lazy() && this.isPageChanged(first)) {
                const step = this._step();
                const itemsLength = (<any[]>this._items()).length;
                const lazyLoadState = {
                    first: step ? Math.max(0, Math.min((currentPage - (loadPreviousPage ? 1 : 0)) * step, itemsLength - step)) : first,
                    last: Math.min(step ? (currentPage + 1) * step : last, itemsLength)
                };
                const isLazyStateChanged = lazyLoadState.first < this.lazyLoadState().first || lazyLoadState.last > this.lazyLoadState().last;

                isLazyStateChanged && this.handleEvents('onLazyLoad', lazyLoadState);
                this.lazyLoadState.set(lazyLoadState);
            }
        }
    }

    onContainerScroll(event: Event) {
        this.handleEvents('onScroll', { originalEvent: event });

        if (this._delay()) {
            if (this.scrollTimeout()) {
                clearTimeout(this.scrollTimeout());
            }

            if (!this.d_loading() && this._showLoader()) {
                const { isRangeChanged } = this.onScrollPositionChange(event);
                const changed = isRangeChanged || (this._step() ? this.isPageChanged() : false);

                if (changed) {
                    this.d_loading.set(true);
                }
            }

            this.scrollTimeout.set(
                setTimeout(() => {
                    const lazyLoadState = this.lazyLoadState();
                    this.onScrollChange(event);
                    // onScrollChange emits onLazyLoad only when the range goes beyond what was already requested.
                    const isLazyLoadRequested = this.lazyLoadState().first < lazyLoadState.first || this.lazyLoadState().last > lazyLoadState.last;

                    if (this.d_loading() && this._showLoader() && (!this._lazy() || this._loading() === undefined || !isLazyLoadRequested)) {
                        this.d_loading.set(false);
                        this.page.set(this.getPageByFirst());
                    }
                }, this._delay())
            );
        } else {
            !this.d_loading() && this.onScrollChange(event);
        }
    }

    bindResizeListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.windowResizeListener()) {
                this.zone.runOutsideAngular(() => {
                    const window = this.document.defaultView as Window;
                    const event = isTouchDevice() ? 'orientationchange' : 'resize';
                    this.windowResizeListener.set(this.renderer.listen(window, event, this.onWindowResize.bind(this)));
                });
            }
        }
    }

    unbindResizeListener() {
        const windowResizeListener = this.windowResizeListener();
        if (windowResizeListener) {
            windowResizeListener();
            this.windowResizeListener.set(null);
        }
    }

    onWindowResize() {
        if (this.resizeTimeout()) {
            clearTimeout(this.resizeTimeout());
        }

        this.resizeTimeout.set(
            setTimeout(() => {
                const elementViewChild = this.elementViewChild();
                if (isVisible(elementViewChild?.nativeElement)) {
                    const [width, height] = [getWidth(elementViewChild?.nativeElement), getHeight(elementViewChild?.nativeElement)];
                    const [isDiffWidth, isDiffHeight] = [width !== this.defaultWidth(), height !== this.defaultHeight()];
                    const reinit = this.both() ? isDiffWidth || isDiffHeight : this.horizontal() ? isDiffWidth : this.vertical() ? isDiffHeight : false;

                    reinit &&
                        this.zone.run(() => {
                            this.d_numToleratedItems.set(this._numToleratedItems());
                            this.defaultWidth.set(width);
                            this.defaultHeight.set(height);
                            this.defaultContentWidth.set(getWidth(this.contentEl()));
                            this.defaultContentHeight.set(getHeight(this.contentEl()));

                            this.init();
                        });
                }
            }, this._resizeDelay())
        );
    }

    handleEvents(name: string, params: any) {
        const options = this.options();
        //@ts-ignore
        return options && (<any>options)[name] ? (<any>options)[name](params) : this[name].emit(params);
    }

    private resolveOption(key: string, value: any) {
        const options = this.options();

        return options && typeof options === 'object' && Object.prototype.hasOwnProperty.call(options, key) ? (<any>options)[key] : value;
    }

    getContentOptions() {
        return {
            contentStyleClass: `p-virtualscroller-content ${this.d_loading() ? 'p-virtualscroller-loading' : ''}`,
            items: this.loadedItems(),
            getItemOptions: (index: number) => this.getOptions(index),
            loading: this.d_loading(),
            getLoaderOptions: (index: number, options?: any) => this.getLoaderOptions(index, options),
            itemSize: this._itemSize(),
            rows: this.loadedRows(),
            columns: this.loadedColumns(),
            spacerStyle: this.spacerStyle(),
            contentStyle: this.contentStyle(),
            vertical: this.vertical(),
            horizontal: this.horizontal(),
            both: this.both(),
            scrollTo: this.scrollTo.bind(this),
            scrollToIndex: this.scrollToIndex.bind(this),
            orientation: this._orientation(),
            scrollableElement: this.elementViewChild()?.nativeElement
        };
    }

    getOptions(renderedIndex: number) {
        const count = (this._items() || []).length;
        const index = this.both() ? this.first().rows + renderedIndex : this.first() + renderedIndex;

        return {
            index,
            count,
            first: index === 0,
            last: index === count - 1,
            even: index % 2 === 0,
            odd: index % 2 !== 0
        };
    }

    getLoaderOptions(index: number, extOptions: any) {
        const count = this.loaderArr().length;

        return {
            index,
            count,
            first: index === 0,
            last: index === count - 1,
            even: index % 2 === 0,
            odd: index % 2 !== 0,
            loading: this.d_loading(),
            ...extOptions
        };
    }
}

@NgModule({
    imports: [Scroller, SharedModule],
    exports: [Scroller, SharedModule]
})
export class ScrollerModule {}
