import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    input,
    linkedSignal,
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
import { addClass, find, findSingle, getAttribute, removeClass, setAttribute, uuid } from '@exhaustive-ui/utils';
import { Footer, Header, PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { ButtonModule, ButtonProps } from '@exhaustive-ui/core/button';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from '@exhaustive-ui/core/icons';
import { CarouselItemTemplateContext, CarouselPageEvent, CarouselResponsiveOptions } from '@exhaustive-ui/core/types/carousel';
import { CarouselStyle } from './style/carouselstyle';

/**
 * Carousel is a content slider featuring various customization options.
 * @group Components
 */
@Component({
    selector: 'p-carousel',
    imports: [CommonModule, ChevronRightIcon, ButtonModule, ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon, SharedModule, BindModule],
    template: `
        @if (headerFacet() || headerTemplate() || _headerTemplate()) {
            <div [class]="cx('header')" [pBind]="ptm('header')">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate()"></ng-container>
            </div>
        }
        <div [class]="contentClass()" [ngClass]="cx('contentContainer')" [pBind]="ptm('contentContainer')">
            <div [class]="cx('content')" [attr.aria-live]="allowAutoplay() ? 'polite' : 'off'" [pBind]="ptm('content')">
                @if (showNavigators()) {
                    <p-button
                        [class]="cx('pcPrevButton')"
                        [attr.aria-label]="ariaPrevButtonLabel()"
                        (click)="navBackward($event)"
                        [text]="true"
                        [buttonProps]="prevButtonProps()"
                        [pt]="ptm('pcPrevButton')"
                        [unstyled]="unstyled()"
                        attr.data-pc-group-section="navigator"
                    >
                        <ng-template #icon>
                            @if (!previousIconTemplate() && !_previousIconTemplate() && !prevButtonProps()?.icon) {
                                @if (!isVertical()) {
                                    <svg data-p-icon="chevron-left" />
                                }
                                @if (isVertical()) {
                                    <svg data-p-icon="chevron-up" />
                                }
                            }
                            @if ((previousIconTemplate() || _previousIconTemplate()) && !prevButtonProps()?.icon) {
                                <ng-template *ngTemplateOutlet="previousIconTemplate() || _previousIconTemplate()"></ng-template>
                            }
                        </ng-template>
                    </p-button>
                }
                <div [class]="cx('viewport')" [ngStyle]="{ height: isVertical() ? verticalViewPortHeight() : 'auto' }" (touchend)="onTouchEnd($event)" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)" [pBind]="ptm('viewport')">
                    <div #itemsContainer [class]="cx('itemList')" (transitionend)="onTransitionEnd()" [pBind]="ptm('itemList')">
                        @for (item of clonedItemsForStarting(); track item; let index = $index) {
                            <div
                                [class]="cx('itemClone', { index })"
                                [attr.aria-hidden]="!(totalShiftedItems() * -1 === value().length)"
                                [attr.inert]="totalShiftedItems() * -1 === value().length ? null : ''"
                                [attr.aria-label]="ariaSlideNumber(index)"
                                [attr.aria-roledescription]="ariaSlideLabel()"
                                [attr.data-p-carousel-item-active]="totalShiftedItems() * -1 === value().length + _numVisible()"
                                [attr.data-p-carousel-item-start]="index === 0"
                                [attr.data-p-carousel-item-end]="clonedItemsForStarting().length - 1 === index"
                                [pBind]="ptm('itemClone')"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate() || _itemTemplate(); context: { $implicit: item }"></ng-container>
                            </div>
                        }
                        @for (item of value(); track item; let index = $index) {
                            <div
                                [class]="cx('item', { index })"
                                role="group"
                                [attr.aria-hidden]="!(firstIndex() <= index && lastIndex() >= index)"
                                [attr.inert]="firstIndex() <= index && lastIndex() >= index ? null : ''"
                                [attr.aria-label]="ariaSlideNumber(index)"
                                [attr.aria-roledescription]="ariaSlideLabel()"
                                [attr.data-p-carousel-item-active]="firstIndex() <= index && lastIndex() >= index"
                                [attr.data-p-carousel-item-start]="firstIndex() === index"
                                [attr.data-p-carousel-item-end]="lastIndex() === index"
                                [pBind]="getItemPTOptions('item', index)"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate() || _itemTemplate(); context: { $implicit: item }"></ng-container>
                            </div>
                        }
                        @for (item of clonedItemsForFinishing(); track item; let index = $index) {
                            <div [class]="cx('itemClone', { index })" [attr.data-p-carousel-item-active]="false" [attr.data-p-carousel-item-start]="false" [attr.data-p-carousel-item-end]="false" [pBind]="ptm('itemClone')">
                                <ng-container *ngTemplateOutlet="itemTemplate() || _itemTemplate(); context: { $implicit: item }"></ng-container>
                            </div>
                        }
                    </div>
                </div>
                @if (showNavigators()) {
                    <p-button
                        type="button"
                        [class]="cx('pcNextButton')"
                        (click)="navForward($event)"
                        [attr.aria-label]="ariaNextButtonLabel()"
                        [buttonProps]="nextButtonProps()"
                        [text]="true"
                        [pt]="ptm('pcNextButton')"
                        [unstyled]="unstyled()"
                        attr.data-pc-group-section="navigator"
                    >
                        <ng-template #icon>
                            @if (!nextIconTemplate() && !_nextIconTemplate() && !nextButtonProps()?.icon) {
                                @if (!isVertical()) {
                                    <svg data-p-icon="chevron-right" />
                                }
                                @if (isVertical()) {
                                    <svg data-p-icon="chevron-down" />
                                }
                            }
                            @if (nextIconTemplate() || (_nextIconTemplate() && !nextButtonProps()?.icon)) {
                                <span>
                                    <ng-template *ngTemplateOutlet="nextIconTemplate() || _nextIconTemplate()"></ng-template>
                                </span>
                            }
                        </ng-template>
                    </p-button>
                }
            </div>
            @if (showIndicators()) {
                <ul #indicatorContent [class]="cx('indicatorList')" [ngStyle]="indicatorsContentStyle()" (keydown)="onIndicatorKeydown($event)" [pBind]="ptm('indicatorList')">
                    @for (totalDot of totalDotsArray(); track $index; let i = $index) {
                        <li [class]="cx('indicator', { index: i })" [attr.data-p-active]="_page() === i" [pBind]="getIndicatorPTOptions('indicator', i)">
                            <button
                                type="button"
                                [class]="cx('indicatorButton')"
                                (click)="onDotClick($event, i)"
                                [ngStyle]="indicatorStyle()"
                                [attr.aria-label]="ariaPageLabel(i + 1)"
                                [attr.aria-current]="_page() === i ? 'page' : undefined"
                                [tabindex]="_page() === i ? 0 : -1"
                                [pBind]="getIndicatorPTOptions('indicatorButton', i)"
                            ></button>
                        </li>
                    }
                </ul>
            }
        </div>
        @if (footerFacet() || footerTemplate() || _footerTemplate()) {
            <div [class]="cx('footer')" [pBind]="ptm('footer')">
                <ng-content select="p-footer"></ng-content>
                <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate()"></ng-container>
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [CarouselStyle, { provide: PARENT_INSTANCE, useExisting: Carousel }],
    hostDirectives: [Bind],
    host: {
        '[attr.id]': 'id',
        '[attr.role]': "'region'",
        '[class]': "cx('root')"
    }
})
export class Carousel extends BaseComponent {
    componentName = 'Carousel';

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Index of the first item.
     * @defaultValue 0
     * @group Props
     */
    readonly page = input<number>(0);
    /**
     * Number of items per page.
     * @defaultValue 1
     * @group Props
     */
    readonly numVisible = input<number>(1);
    /**
     * Number of items to scroll.
     * @defaultValue 1
     * @group Props
     */
    readonly numScroll = input<number>(1);
    /**
     * An array of options for responsive design.
     * @see {CarouselResponsiveOptions}
     * @group Props
     */
    readonly responsiveOptions = input<CarouselResponsiveOptions[] | undefined>();
    /**
     * Specifies the layout of the component.
     * @group Props
     */
    readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
    /**
     * Height of the viewport in vertical layout.
     * @group Props
     */
    readonly verticalViewPortHeight = input<string>('300px');
    /**
     * Style class of main content.
     * @group Props
     */
    readonly contentClass = input<string>('');
    /**
     * Style class of the indicator items.
     * @group Props
     */
    readonly indicatorsContentClass = input<string>('');
    /**
     * Inline style of the indicator items.
     * @group Props
     */
    readonly indicatorsContentStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the indicators.
     * @group Props
     */
    readonly indicatorStyleClass = input<string>('');
    /**
     * Style of the indicators.
     * @group Props
     */
    readonly indicatorStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * An array of objects to display.
     * @defaultValue null
     * @group Props
     */
    readonly value = input<any[] | null | undefined>();
    /**
     * Defines if scrolling would be infinite.
     * @group Props
     */
    readonly circular = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether to display indicator container.
     * @group Props
     */
    readonly showIndicators = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether to display navigation buttons in container.
     * @group Props
     */
    readonly showNavigators = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Time in milliseconds to scroll items automatically.
     * @group Props
     */
    readonly autoplayInterval = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly prevButtonProps = input<ButtonProps>({
        severity: 'secondary',
        text: true,
        rounded: true
    });
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly nextButtonProps = input<ButtonProps>({
        severity: 'secondary',
        text: true,
        rounded: true
    });
    /**
     * Callback to invoke after scroll.
     * @param {CarouselPageEvent} event - Custom page event.
     * @group Emits
     */
    readonly onPage = output<CarouselPageEvent>();

    readonly itemsContainer = viewChild<ElementRef>('itemsContainer');

    readonly indicatorContent = viewChild<ElementRef>('indicatorContent');

    readonly headerFacet = contentChild(Header);

    readonly footerFacet = contentChild(Footer);

    _numVisible = linkedSignal<number>(() => this.numVisible());

    _numScroll = linkedSignal<number>(() => this.numScroll());

    prevState = signal<any>({
        numScroll: 0,
        numVisible: 0,
        value: []
    });

    readonly defaultNumScroll = computed<number>(() => this.numScroll());

    readonly defaultNumVisible = computed<number>(() => this.numVisible());

    _page = signal<number>(0);

    carouselStyle = signal<any>(undefined);

    id = uuid('pn_id_');

    totalShiftedItems = signal<number>(this._page() * this._numScroll() * -1);

    isRemainingItemsAdded = signal<boolean>(false);

    readonly remainingItems = computed<number>(() => {
        const value = this.value();

        return value ? (value.length - this._numVisible()) % this._numScroll() : 0;
    });

    startPos = signal<any>(undefined);

    documentResizeListener = signal<any>(undefined);

    readonly clonedItemsForStarting = computed<any[]>(() => {
        const value = this.value();

        return this.isCircular() && value ? value.slice(-1 * this._numVisible()) : [];
    });

    readonly clonedItemsForFinishing = computed<any[]>(() => {
        const value = this.value();

        return this.isCircular() && value ? value.slice(0, this._numVisible()) : [];
    });

    allowAutoplay = linkedSignal<boolean | undefined>(() => !!this.autoplayInterval());

    interval = signal<any>(undefined);

    isCreated = signal<boolean | undefined>(undefined);

    swipeThreshold: number = 20;

    /**
     * Custom item template.
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<CarouselItemTemplateContext>>('item', { descendants: false });

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });

    /**
     * Custom previous icon template.
     * @group Templates
     */
    readonly previousIconTemplate = contentChild<TemplateRef<void>>('previousicon', { descendants: false });

    /**
     * Custom next icon template.
     * @group Templates
     */
    readonly nextIconTemplate = contentChild<TemplateRef<void>>('nexticon', { descendants: false });

    readonly _itemTemplate = computed<TemplateRef<CarouselItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => !['header', 'footer', 'previousicon', 'nexticon'].includes(item.getType()))
                .at(-1)?.template
    );

    readonly _headerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    readonly _footerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    readonly _previousIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'previousicon')
                .at(-1)?.template
    );

    readonly _nextIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'nexticon')
                .at(-1)?.template
    );

    window: Window = this.document.defaultView as Window;

    _componentStyle = inject(CarouselStyle);

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
        effect(() => {
            const page = this.page();

            untracked(() => {
                if (this.isCreated() && page !== this._page()) {
                    if (this.autoplayInterval()) {
                        this.stopAutoplay();
                    }

                    if (page > this._page() && page <= this.totalDots() - 1) {
                        this.step(-1, page);
                    } else if (page < this._page()) {
                        this.step(1, page);
                    }
                }

                this._page.set(page);
            });
        });
        effect(() => {
            this.numVisible();

            untracked(() => {
                if (isPlatformBrowser(this.platformId)) {
                    this.createStyle();
                    this.calculatePosition();
                }
            });
        });
        effect(() => {
            const responsiveOptions = this.responsiveOptions();

            untracked(() => {
                if (responsiveOptions) {
                    this.bindDocumentListeners();
                }
            });
        });
        effect(() => {
            const value = this.value();
            const itemsContainer = this.itemsContainer();
            const _numScroll = this._numScroll();
            const _numVisible = this._numVisible();
            const isCircular = this.isCircular();
            let totalShiftedItems = this.totalShiftedItems();
            this._page();

            untracked(() => {
                if (isPlatformBrowser(this.platformId)) {
                    const prevState = this.prevState();

                    if (value && itemsContainer && (prevState.numScroll !== _numScroll || prevState.numVisible !== _numVisible || prevState.value.length !== value.length)) {
                        if (this.autoplayInterval()) {
                            this.stopAutoplay(false);
                        }

                        let page = this._page();
                        if (this.totalDots() !== 0 && page >= this.totalDots()) {
                            page = this.totalDots() - 1;
                            this._page.set(page);
                            this.onPage.emit({
                                page: this._page()
                            });
                        }

                        totalShiftedItems = page * _numScroll * -1;
                        if (isCircular) {
                            totalShiftedItems -= _numVisible;
                        }

                        if (page === this.totalDots() - 1 && this.remainingItems() > 0) {
                            totalShiftedItems += -1 * this.remainingItems() + _numScroll;
                            this.isRemainingItemsAdded.set(true);
                        } else {
                            this.isRemainingItemsAdded.set(false);
                        }

                        if (totalShiftedItems !== this.totalShiftedItems()) {
                            this.totalShiftedItems.set(totalShiftedItems);
                        }

                        this.prevState.set({
                            numScroll: _numScroll,
                            numVisible: _numVisible,
                            value: [...value]
                        });

                        if (this.totalDots() > 0 && itemsContainer.nativeElement) {
                            itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / _numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / _numVisible)}%, 0, 0)`;
                        }

                        this.isCreated.set(true);

                        if (this.autoplayInterval() && this.isAutoplay()) {
                            this.startAutoplay();
                        }
                    }

                    if (isCircular) {
                        if (this._page() === 0) {
                            totalShiftedItems = -1 * _numVisible;
                        } else if (totalShiftedItems === 0) {
                            totalShiftedItems = -1 * value!.length;
                            if (this.remainingItems() > 0) {
                                this.isRemainingItemsAdded.set(true);
                            }
                        }

                        if (totalShiftedItems !== this.totalShiftedItems()) {
                            this.totalShiftedItems.set(totalShiftedItems);
                        }
                    }
                }
            });
        });
    }

    readonly templates = contentChildren(PrimeTemplate);

    createStyle() {
        let carouselStyle = this.carouselStyle();
        if (!carouselStyle) {
            carouselStyle = this.renderer.createElement('style');
            carouselStyle.type = 'text/css';
            setAttribute(carouselStyle, 'nonce', this.config?.csp()?.nonce);
            this.renderer.appendChild(this.document.head, carouselStyle);
            setAttribute(carouselStyle, 'nonce', this.config?.csp()?.nonce);
            this.carouselStyle.set(carouselStyle);
        }

        let innerHTML = `
            #${this.id} .p-carousel-item {
				flex: 1 0 ${100 / this._numVisible()}%
			}
        `;

        const responsiveOptions = this.responsiveOptions();
        if (responsiveOptions && !this.$unstyled()) {
            responsiveOptions.sort((data1, data2) => {
                const value1 = data1.breakpoint;
                const value2 = data2.breakpoint;
                let result: number | null = null;

                if (value1 == null && value2 != null) result = -1;
                else if (value1 != null && value2 == null) result = 1;
                else if (value1 == null && value2 == null) result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2, undefined, { numeric: true });
                else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

                return -1 * result;
            });

            for (let i = 0; i < responsiveOptions.length; i++) {
                let res = responsiveOptions[i];

                innerHTML += `
                    @media screen and (max-width: ${res.breakpoint}) {
                        #${this.id} .p-carousel-item {
                            flex: 1 0 ${100 / res.numVisible}%
                        }
                    }
                `;
            }
        }

        carouselStyle.innerHTML = innerHTML;
    }

    calculatePosition() {
        const responsiveOptions = this.responsiveOptions();
        if (responsiveOptions) {
            let matchedResponsiveData = {
                numVisible: this.defaultNumVisible(),
                numScroll: this.defaultNumScroll()
            };

            if (typeof window !== 'undefined') {
                let windowWidth = window.innerWidth;
                for (let i = 0; i < responsiveOptions.length; i++) {
                    let res = responsiveOptions[i];

                    if (parseInt(res.breakpoint, 10) >= windowWidth) {
                        matchedResponsiveData = res;
                    }
                }
            }

            if (this._numScroll() !== matchedResponsiveData.numScroll) {
                let page = this._page();
                page = Math.floor((page * this._numScroll()) / matchedResponsiveData.numScroll);

                let totalShiftedItems = matchedResponsiveData.numScroll * this._page() * -1;

                if (this.isCircular()) {
                    totalShiftedItems -= matchedResponsiveData.numVisible;
                }

                this.totalShiftedItems.set(totalShiftedItems);
                this._numScroll.set(matchedResponsiveData.numScroll);

                this._page.set(page);
                this.onPage.emit({
                    page: this._page()
                });
            }

            if (this._numVisible() !== matchedResponsiveData.numVisible) {
                this._numVisible.set(matchedResponsiveData.numVisible);
            }
        }
    }

    readonly firstIndex = computed<number>(() => (this.isCircular() ? -1 * (this.totalShiftedItems() + this._numVisible()) : this.totalShiftedItems() * -1));

    readonly lastIndex = computed<number>(() => this.firstIndex() + this._numVisible() - 1);

    readonly totalDots = computed<number>(() => {
        const value = this.value();

        return value?.length ? Math.ceil((value.length - this._numVisible()) / this._numScroll()) + 1 : 0;
    });

    readonly totalDotsArray = computed<number[]>(() => {
        const totalDots = this.totalDots();
        return totalDots <= 0 ? [] : Array(totalDots).fill(0);
    });

    readonly isVertical = computed<boolean>(() => this.orientation() === 'vertical');

    readonly isCircular = computed<boolean>(() => {
        const value = this.value();

        return this.circular() && !!value && value.length >= this._numVisible();
    });

    readonly isAutoplay = computed(() => this.autoplayInterval() && this.allowAutoplay());

    readonly isForwardNavDisabled = computed<boolean>(() => this.isEmpty() || (this._page() >= this.totalDots() - 1 && !this.isCircular()));

    readonly isBackwardNavDisabled = computed<boolean>(() => this.isEmpty() || (this._page() <= 0 && !this.isCircular()));

    readonly isEmpty = computed<boolean>(() => {
        const value = this.value();

        return !value || value.length === 0;
    });

    navForward(e: MouseEvent | TouchEvent, index?: number) {
        if (this.isCircular() || this._page() < this.totalDots() - 1) {
            this.step(-1, index);
        }

        if (this.autoplayInterval()) {
            this.stopAutoplay();
        }

        if (e && e.cancelable) {
            e.preventDefault();
        }
    }

    navBackward(e: MouseEvent | TouchEvent, index?: number) {
        if (this.isCircular() || this._page() !== 0) {
            this.step(1, index);
        }

        if (this.autoplayInterval()) {
            this.stopAutoplay();
        }

        if (e && e.cancelable) {
            e.preventDefault();
        }
    }

    onDotClick(e: MouseEvent, index: number) {
        let page = this._page();

        if (this.autoplayInterval()) {
            this.stopAutoplay();
        }

        if (index > page) {
            this.navForward(e, index);
        } else if (index < page) {
            this.navBackward(e, index);
        }
    }

    onIndicatorKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowRight':
                this.onRightKey();
                break;

            case 'ArrowLeft':
                this.onLeftKey();
                break;
        }
    }

    onRightKey() {
        const indicators = [...find(this.indicatorContent()?.nativeElement, '[data-pc-section="indicator"]')];
        const activeIndex = this.findFocusedIndicatorIndex();

        this.changedFocusedIndicator(activeIndex, activeIndex + 1 === indicators.length ? indicators.length - 1 : activeIndex + 1);
    }

    onLeftKey() {
        const activeIndex = this.findFocusedIndicatorIndex();

        this.changedFocusedIndicator(activeIndex, activeIndex - 1 <= 0 ? 0 : activeIndex - 1);
    }

    onHomeKey() {
        const activeIndex = this.findFocusedIndicatorIndex();

        this.changedFocusedIndicator(activeIndex, 0);
    }

    onEndKey() {
        const indicators = [...find(this.indicatorContent()?.nativeElement, '[data-pc-section="indicator"]')];
        const activeIndex = this.findFocusedIndicatorIndex();

        this.changedFocusedIndicator(activeIndex, indicators.length - 1);
    }

    onTabKey() {
        const indicatorContent = this.indicatorContent();
        const indicators = <any>[...find(indicatorContent?.nativeElement, '[data-pc-section="indicator"]')];
        const highlightedIndex = indicators.findIndex((ind) => getAttribute(ind, 'data-p-highlight') === true);

        const activeIndicator = <any>findSingle(indicatorContent?.nativeElement, '[data-pc-section="indicator"] > button[tabindex="0"]');
        const activeIndex = indicators.findIndex((ind) => ind === activeIndicator.parentElement);

        indicators[activeIndex].children[0].tabIndex = '-1';
        indicators[highlightedIndex].children[0].tabIndex = '0';
    }

    findFocusedIndicatorIndex() {
        const indicatorContent = this.indicatorContent();
        const indicators = [...find(indicatorContent?.nativeElement, '[data-pc-section="indicator"]')];
        const activeIndicator = findSingle(indicatorContent?.nativeElement, '[data-pc-section="indicator"] > button[tabindex="0"]');

        return indicators.findIndex((ind) => ind === activeIndicator?.parentElement);
    }

    changedFocusedIndicator(prevInd, nextInd) {
        const indicators = <any>[...find(this.indicatorContent()?.nativeElement, '[data-pc-section="indicator"]')];

        indicators[prevInd].children[0].tabIndex = '-1';
        indicators[nextInd].children[0].tabIndex = '0';
        indicators[nextInd].children[0].focus();
    }

    step(dir: number, page?: number) {
        let totalShiftedItems = this.totalShiftedItems();
        const isCircular = this.isCircular();

        if (page != null) {
            totalShiftedItems = this._numScroll() * page * -1;

            if (isCircular) {
                totalShiftedItems -= this._numVisible();
            }

            this.isRemainingItemsAdded.set(false);
        } else {
            totalShiftedItems += this._numScroll() * dir;
            if (this.isRemainingItemsAdded()) {
                totalShiftedItems += this.remainingItems() - this._numScroll() * dir;
                this.isRemainingItemsAdded.set(false);
            }

            let originalShiftedItems = isCircular ? totalShiftedItems + this._numVisible() : totalShiftedItems;
            page = Math.abs(Math.floor(originalShiftedItems / this._numScroll()));
        }

        if (isCircular && this._page() === this.totalDots() - 1 && dir === -1) {
            totalShiftedItems = -1 * (this.value()!.length + this._numVisible());
            page = 0;
        } else if (isCircular && this._page() === 0 && dir === 1) {
            totalShiftedItems = 0;
            page = this.totalDots() - 1;
        } else if (page === this.totalDots() - 1 && this.remainingItems() > 0) {
            totalShiftedItems += this.remainingItems() * -1 - this._numScroll() * dir;
            this.isRemainingItemsAdded.set(true);
        }

        const itemsContainer = this.itemsContainer();
        if (itemsContainer) {
            !this.$unstyled() && removeClass(itemsContainer.nativeElement, 'p-items-hidden');
            itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this._numVisible())}%, 0)` : `translate3d(${totalShiftedItems * (100 / this._numVisible())}%, 0, 0)`;
            itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
        }

        this.totalShiftedItems.set(totalShiftedItems);
        this._page.set(page);
        this.onPage.emit({
            page: this._page()
        });
    }

    startAutoplay() {
        this.interval.set(
            setInterval(() => {
                // with a single page every item is already visible: nothing to scroll to
                if (this.totalDots() > 1) {
                    if (this._page() === this.totalDots() - 1) {
                        this.step(-1, 0);
                    } else {
                        this.step(-1, this._page() + 1);
                    }
                }
            }, this.autoplayInterval())
        );
        this.allowAutoplay.set(true);
    }

    stopAutoplay(changeAllow: boolean = true) {
        if (this.interval()) {
            clearInterval(this.interval());
            this.interval.set(undefined);
            if (changeAllow) {
                this.allowAutoplay.set(false);
            }
        }
    }

    readonly isPlaying = computed<boolean>(() => !!this.interval());

    onTransitionEnd() {
        const itemsContainer = this.itemsContainer();
        if (itemsContainer) {
            !this.$unstyled() && addClass(itemsContainer.nativeElement, 'p-items-hidden');
            itemsContainer.nativeElement.style.transition = '';

            if ((this._page() === 0 || this._page() === this.totalDots() - 1) && this.isCircular()) {
                itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${this.totalShiftedItems() * (100 / this._numVisible())}%, 0)` : `translate3d(${this.totalShiftedItems() * (100 / this._numVisible())}%, 0, 0)`;
            }
        }
    }

    onTouchStart(e: TouchEvent) {
        let touchobj = e.changedTouches[0];

        this.startPos.set({
            x: touchobj.pageX,
            y: touchobj.pageY
        });
    }

    onTouchMove(e: TouchEvent | MouseEvent) {
        if (e.cancelable) {
            e.preventDefault();
        }
    }

    onTouchEnd(e: TouchEvent) {
        let touchobj = e.changedTouches[0];

        if (this.isVertical()) {
            this.changePageOnTouch(e, touchobj.pageY - this.startPos().y);
        } else {
            this.changePageOnTouch(e, touchobj.pageX - this.startPos().x);
        }
    }

    changePageOnTouch(e: TouchEvent | MouseEvent, diff: number) {
        if (Math.abs(diff) > this.swipeThreshold) {
            if (diff < 0) {
                this.navForward(e);
            } else {
                this.navBackward(e);
            }
        }
    }

    ariaPrevButtonLabel() {
        return this.config.translation.aria ? this.config.translation.aria?.prevPageLabel : undefined;
    }

    ariaSlideLabel() {
        return this.config.translation.aria ? this.config.translation.aria?.slide : undefined;
    }

    ariaNextButtonLabel() {
        return this.config.translation.aria ? this.config.translation.aria?.nextPageLabel : undefined;
    }

    ariaSlideNumber(value) {
        return this.config.translation.aria ? this.config.translation.aria?.slideNumber?.replace(/{slideNumber}/g, value) : undefined;
    }

    ariaPageLabel(value) {
        return this.config.translation.aria ? this.config.translation.aria?.pageLabel?.replace(/{page}/g, value) : undefined;
    }

    getIndicatorPTOptions(key: string, index: number) {
        return this.ptm(key, {
            context: {
                highlighted: index === this._page()
            }
        });
    }

    getItemPTOptions(key: string, index: number) {
        return this.ptm(key, {
            context: {
                index,
                active: this.firstIndex() <= index && this.lastIndex() >= index,
                start: this.firstIndex() === index,
                end: this.lastIndex() === index
            }
        });
    }

    bindDocumentListeners() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentResizeListener()) {
                this.documentResizeListener.set(
                    this.renderer.listen(this.window, 'resize', (event) => {
                        this.calculatePosition();
                    })
                );
            }
        }
    }

    unbindDocumentListeners() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.documentResizeListener()) {
                this.documentResizeListener()();
                this.documentResizeListener.set(null);
            }
        }
    }

    onDestroy() {
        if (this.responsiveOptions()) {
            this.unbindDocumentListeners();
        }
        if (this.autoplayInterval()) {
            this.stopAutoplay();
        }
    }
}

@NgModule({
    imports: [Carousel, SharedModule],
    exports: [Carousel, SharedModule]
})
export class CarouselModule {}
