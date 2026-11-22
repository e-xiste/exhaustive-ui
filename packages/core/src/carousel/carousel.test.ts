import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import type { CarouselPageEvent, CarouselResponsiveOptions } from '@exhaustive-ui/core/types/carousel';
import { Carousel } from './carousel';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
// Mock data for testing
const mockProducts = [
    { id: '1', name: 'Product 1', image: 'product1.jpg', price: 100, inventoryStatus: 'INSTOCK' },
    { id: '2', name: 'Product 2', image: 'product2.jpg', price: 200, inventoryStatus: 'LOWSTOCK' },
    { id: '3', name: 'Product 3', image: 'product3.jpg', price: 300, inventoryStatus: 'OUTOFSTOCK' },
    { id: '4', name: 'Product 4', image: 'product4.jpg', price: 400, inventoryStatus: 'INSTOCK' },
    { id: '5', name: 'Product 5', image: 'product5.jpg', price: 500, inventoryStatus: 'LOWSTOCK' }
];

// Test Components for different scenarios
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-carousel
            [value]="products"
            [page]="page"
            [numVisible]="numVisible"
            [numScroll]="numScroll"
            [responsiveOptions]="responsiveOptions"
            [orientation]="orientation"
            [verticalViewPortHeight]="verticalViewPortHeight"
            [contentClass]="contentClass"
            [indicatorsContentClass]="indicatorsContentClass"
            [indicatorsContentStyle]="indicatorsContentStyle"
            [indicatorStyleClass]="indicatorStyleClass"
            [indicatorStyle]="indicatorStyle"
            [circular]="circular"
            [showIndicators]="showIndicators"
            [showNavigators]="showNavigators"
            [autoplayInterval]="autoplayInterval"
            [class]="styleClass"
            [prevButtonProps]="prevButtonProps"
            [nextButtonProps]="nextButtonProps"
            (onPage)="onPage($event)"
        >
            <ng-template let-product #item>
                <div class="product-item">
                    <h4>{{ product.name }}</h4>
                    <p>Price: {{ product.price }}</p>
                    <span class="status">{{ product.inventoryStatus }}</span>
                </div>
            </ng-template>
        </p-carousel>
    `
})
class TestBasicCarouselComponent {
    products: any[] = mockProducts;
    page: number = 0;
    numVisible: number = 3;
    numScroll: number = 1;
    responsiveOptions: CarouselResponsiveOptions[] | undefined = undefined as any;
    orientation: 'horizontal' | 'vertical' = 'horizontal';
    verticalViewPortHeight: string = '300px';
    contentClass: string = '';
    indicatorsContentClass: string = '';
    indicatorsContentStyle: { [klass: string]: any } | null | undefined;
    indicatorStyleClass: string = '';
    indicatorStyle: { [klass: string]: any } | null | undefined;
    circular: boolean = false;
    showIndicators: boolean = true;
    showNavigators: boolean = true;
    autoplayInterval: number = 0;
    styleClass: string | undefined;
    prevButtonProps: any = {};
    nextButtonProps: any = {};

    // Event handler
    pageEvent: CarouselPageEvent | undefined;

    onPage(event: CarouselPageEvent) {
        this.pageEvent = event;
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-carousel [value]="products" [numVisible]="3" [numScroll]="1" [circular]="true">
            <ng-template let-product #item>
                <div class="circular-item">{{ product.name }}</div>
            </ng-template>
        </p-carousel>
    `
})
class TestCircularCarouselComponent {
    products: any[] = mockProducts;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-carousel [value]="products" [orientation]="'vertical'" [verticalViewPortHeight]="'400px'">
            <ng-template let-product #item>
                <div class="vertical-item">{{ product.name }}</div>
            </ng-template>
        </p-carousel>
    `
})
class TestVerticalCarouselComponent {
    products: any[] = mockProducts;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-carousel [value]="products" [responsiveOptions]="responsiveOptions">
            <ng-template let-product #item>
                <div class="responsive-item">{{ product.name }}</div>
            </ng-template>
        </p-carousel>
    `
})
class TestResponsiveCarouselComponent {
    products: any[] = mockProducts;
    responsiveOptions: CarouselResponsiveOptions[] = [
        { breakpoint: '1024px', numVisible: 3, numScroll: 1 },
        { breakpoint: '768px', numVisible: 2, numScroll: 1 },
        { breakpoint: '560px', numVisible: 1, numScroll: 1 }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-carousel [value]="products" [autoplayInterval]="1000">
            <ng-template let-product #item>
                <div class="autoplay-item">{{ product.name }}</div>
            </ng-template>
        </p-carousel>
    `
})
class TestAutoplayCarouselComponent {
    products: any[] = mockProducts;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-carousel [value]="products" [numVisible]="3">
            <ng-template #header>
                <div class="custom-header">Header Content</div>
            </ng-template>
            <ng-template let-product #item>
                <div class="template-item">{{ product.name }}</div>
            </ng-template>
            <ng-template #footer>
                <div class="custom-footer">Footer Content</div>
            </ng-template>
        </p-carousel>
    `
})
class TestTemplateCarouselComponent {
    products: any[] = mockProducts;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-carousel [value]="products">
            <ng-template pTemplate="header">
                <div class="ptemplate-header">PTemplate Header</div>
            </ng-template>
            <ng-template let-product pTemplate="item">
                <div class="ptemplate-item">{{ product.name }}</div>
            </ng-template>
            <ng-template pTemplate="footer">
                <div class="ptemplate-footer">PTemplate Footer</div>
            </ng-template>
        </p-carousel>
    `
})
class TestPTemplateCarouselComponent {
    products: any[] = mockProducts;
}

describe('Carousel', () => {
    beforeEach(async () => {
        // Mock platform browser
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024
        });

        await TestBed.configureTestingModule({
            imports: [CommonModule, Carousel, SharedModule, PrimeTemplate, ButtonModule],
            declarations: [TestBasicCarouselComponent, TestCircularCarouselComponent, TestVerticalCarouselComponent, TestResponsiveCarouselComponent, TestAutoplayCarouselComponent, TestTemplateCarouselComponent, TestPTemplateCarouselComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();
    });

    describe('Component Initialization', () => {
        let fixture: ComponentFixture<TestBasicCarouselComponent>;
        let component: TestBasicCarouselComponent;
        let carouselInstance: Carousel;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestBasicCarouselComponent);
            component = fixture.componentInstance;
            await fixture.whenStable();

            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            carouselInstance = carouselEl.componentInstance as Carousel;
        });

        it('should create the component', () => {
            expect(component).toBeTruthy();
            expect(carouselInstance).toBeTruthy();
        });

        it('should have default values', () => {
            expect(carouselInstance.page()).toBe(0);
            expect(carouselInstance.numVisible()).toBe(3);
            expect(carouselInstance.numScroll()).toBe(1);
            expect(carouselInstance._numVisible()).toBe(3);
            expect(carouselInstance._numScroll()).toBe(1);
            expect(carouselInstance.orientation()).toBe('horizontal');
            expect(carouselInstance.verticalViewPortHeight()).toBe('300px');
            expect(carouselInstance.circular()).toBe(false);
            expect(carouselInstance.showIndicators()).toBe(true);
            expect(carouselInstance.showNavigators()).toBe(true);
            expect(carouselInstance.autoplayInterval()).toBe(0);
        });

        it('should accept input values', async () => {
            component.page = 1;
            component.numVisible = 2;
            component.numScroll = 2;
            component.circular = true;
            component.orientation = 'vertical';
            component.autoplayInterval = 2000;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(carouselInstance.page()).toBe(1);
            expect(carouselInstance.numVisible()).toBe(2);
            expect(carouselInstance.numScroll()).toBe(2);
            expect(carouselInstance.circular()).toBe(true);
            expect(carouselInstance.orientation()).toBe('vertical');
            expect(carouselInstance.autoplayInterval()).toBe(2000);
        });

        it('should initialize with value array', () => {
            expect(carouselInstance.value()).toEqual(mockProducts);
            expect(carouselInstance.value()?.length).toBe(5);
        });

        it('should generate unique id', () => {
            expect(carouselInstance.id).toBeDefined();
            expect(carouselInstance.id).toContain('pn_id_');
        });

        it('should mark the carousel as created once the items are laid out', () => {
            expect(carouselInstance.isCreated()).toBe(true);
            expect(carouselInstance.prevState()).toEqual({ numScroll: 1, numVisible: 3, value: mockProducts });
            expect(carouselInstance.itemsContainer()?.nativeElement.style.transform).toBe('translate3d(0%, 0px, 0px)');
        });
    });

    describe('Public Methods', () => {
        let fixture: ComponentFixture<TestBasicCarouselComponent>;
        let component: TestBasicCarouselComponent;
        let carouselInstance: Carousel;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestBasicCarouselComponent);
            component = fixture.componentInstance;
            await fixture.whenStable();

            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            carouselInstance = carouselEl.componentInstance as Carousel;
        });

        it('should calculate total dots correctly', () => {
            // With 5 items, numVisible=3, numScroll=1: Math.ceil((5-3)/1) + 1 = 3
            expect(carouselInstance.totalDots()).toBe(3);
            expect(carouselInstance.totalDotsArray()).toEqual([0, 0, 0]);
        });

        it('should check if carousel is vertical', async () => {
            expect(carouselInstance.isVertical()).toBe(false);

            component.orientation = 'vertical';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(carouselInstance.isVertical()).toBe(true);
        });

        it('should check if carousel is circular', async () => {
            expect(carouselInstance.isCircular()).toBe(false);

            component.circular = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(carouselInstance.isCircular()).toBe(true);
        });

        it('should check if autoplay is enabled', async () => {
            expect(carouselInstance.isAutoplay()).toBeFalsy();

            component.autoplayInterval = 1000;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            carouselInstance.allowAutoplay.set(true);
            expect(carouselInstance.isAutoplay()).toBeTruthy();
        });

        it('should check if carousel is empty', async () => {
            expect(carouselInstance.isEmpty()).toBe(false);

            component.products = [];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(carouselInstance.isEmpty()).toBe(true);

            component.products = null as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(carouselInstance.isEmpty()).toBe(true);
        });

        it('should calculate first and last index', () => {
            // Non-circular
            expect(carouselInstance.firstIndex()).toBe(0);
            expect(carouselInstance.lastIndex()).toBe(2);
        });

        it('should calculate remaining items', async () => {
            // (5 - 3) % 1 = 0
            expect(carouselInstance.remainingItems()).toBe(0);

            component.numScroll = 3;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            // (5 - 3) % 3 = 2
            expect(carouselInstance.remainingItems()).toBe(2);
        });

        it('should check navigation states', () => {
            // At first page with multiple pages available (numVisible=3, numScroll=1)
            expect(carouselInstance.isBackwardNavDisabled()).toBe(true);
            expect(carouselInstance.isForwardNavDisabled()).toBe(false); // Should be false since we have 3 total pages
        });
    });

    describe('Navigation', () => {
        let fixture: ComponentFixture<TestBasicCarouselComponent>;
        let component: TestBasicCarouselComponent;
        let carouselInstance: Carousel;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestBasicCarouselComponent);
            component = fixture.componentInstance;
            component.numVisible = 2; // Show 2 items to have multiple pages
            component.numScroll = 1;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            carouselInstance = carouselEl.componentInstance as Carousel;
        });

        it('should navigate forward', () => {
            const mockEvent = new MouseEvent('click');
            vi.spyOn(component, 'onPage').mockImplementation(() => {});

            carouselInstance.navForward(mockEvent);

            expect(component.onPage).toHaveBeenCalled();
            expect(carouselInstance._page()).toBe(1);
            expect(carouselInstance.totalShiftedItems()).toBe(-1);
        });

        it('should navigate backward', () => {
            const mockEvent = new MouseEvent('click');
            vi.spyOn(component, 'onPage').mockImplementation(() => {});

            // Move to page 1 first
            carouselInstance.navForward(mockEvent);
            carouselInstance.navBackward(mockEvent);

            expect(component.onPage).toHaveBeenCalledTimes(2);
            expect(carouselInstance._page()).toBe(0);
            expect(carouselInstance.totalShiftedItems()).toBe(0);
        });

        it('should handle dot click navigation', () => {
            const mockEvent = new MouseEvent('click');
            vi.spyOn(carouselInstance, 'navForward').mockImplementation(() => {});

            carouselInstance.onDotClick(mockEvent, 1);

            expect(carouselInstance.navForward).toHaveBeenCalledWith(mockEvent, 1);
        });

        it('should prevent default on navigation events', () => {
            const mockEvent = {
                preventDefault: vi.fn(),
                cancelable: true
            } as any;

            carouselInstance.navForward(mockEvent);

            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        it('should step to the bound page when the page input changes after creation', async () => {
            vi.spyOn(carouselInstance.onPage, 'emit');

            component.page = 2;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(carouselInstance._page()).toBe(2);
            expect(carouselInstance.totalShiftedItems()).toBe(-2);
            expect(carouselInstance.onPage.emit).toHaveBeenCalledWith({ page: 2 });
            expect(carouselInstance.itemsContainer()?.nativeElement.style.transform).toBe('translate3d(-100%, 0px, 0px)');

            component.page = 1;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(carouselInstance._page()).toBe(1);
            expect(carouselInstance.totalShiftedItems()).toBe(-1);
            expect(carouselInstance.onPage.emit).toHaveBeenCalledWith({ page: 1 });
            expect(carouselInstance.itemsContainer()?.nativeElement.style.transform).toBe('translate3d(-50%, 0px, 0px)');
        });

        it('should keep the page reached by navigation until the page input changes', async () => {
            carouselInstance.navForward(new MouseEvent('click'));
            await fixture.whenStable();
            expect(carouselInstance._page()).toBe(1);
            expect(carouselInstance.page()).toBe(0);

            component.page = 3;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(carouselInstance._page()).toBe(3);
        });
    });

    describe('Circular Mode', () => {
        let fixture: ComponentFixture<TestCircularCarouselComponent>;
        let component: TestCircularCarouselComponent;
        let carouselInstance: Carousel;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestCircularCarouselComponent);
            component = fixture.componentInstance;
            await fixture.whenStable();

            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            carouselInstance = carouselEl.componentInstance as Carousel;
        });

        it('should enable circular mode', () => {
            expect(carouselInstance.circular()).toBe(true);
            expect(carouselInstance.isCircular()).toBe(true);
        });

        it('should set clone items for circular mode', () => {
            expect(carouselInstance.clonedItemsForStarting()).toEqual(mockProducts.slice(-3));
            expect(carouselInstance.clonedItemsForFinishing()).toEqual(mockProducts.slice(0, 3));

            const clones = fixture.debugElement.queryAll(By.css('.p-carousel-item-clone'));
            expect(clones.length).toBe(6);
        });

        it('should recompute clone items when the value changes', async () => {
            component.products = mockProducts.slice(0, 4);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(carouselInstance.clonedItemsForStarting()).toEqual(mockProducts.slice(1, 4));
            expect(carouselInstance.clonedItemsForFinishing()).toEqual(mockProducts.slice(0, 3));
        });

        it('should shift the items by the leading clones', () => {
            expect(carouselInstance.totalShiftedItems()).toBe(-3);
            expect(carouselInstance.lastIndex()).toBe(2);
            expect(carouselInstance.itemsContainer()?.nativeElement.style.transform).toBe('translate3d(-100%, 0px, 0px)');

            const items = fixture.debugElement.queryAll(By.css('.p-carousel-item:not(.p-carousel-item-clone)'));
            expect(items[0].nativeElement.getAttribute('data-p-carousel-item-start')).toBe('true');
            expect(items[2].nativeElement.getAttribute('data-p-carousel-item-end')).toBe('true');
        });

        it('should handle circular navigation differently', () => {
            // In circular mode, navigation should always be possible
            expect(carouselInstance.isBackwardNavDisabled()).toBe(false);
            expect(carouselInstance.isForwardNavDisabled()).toBe(false);
        });

        it('should wrap to the last page when navigating backward from the first page', async () => {
            carouselInstance.navBackward(new MouseEvent('click'));

            expect(carouselInstance._page()).toBe(2);
            expect(carouselInstance.totalShiftedItems()).toBe(0);

            await fixture.whenStable();

            expect(carouselInstance.totalShiftedItems()).toBe(-5);
        });
    });

    describe('Vertical Orientation', () => {
        let fixture: ComponentFixture<TestVerticalCarouselComponent>;
        let component: TestVerticalCarouselComponent;
        let carouselInstance: Carousel;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestVerticalCarouselComponent);
            component = fixture.componentInstance;
            await fixture.whenStable();

            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            carouselInstance = carouselEl.componentInstance as Carousel;
        });

        it('should set vertical orientation', () => {
            expect(carouselInstance.orientation()).toBe('vertical');
            expect(carouselInstance.isVertical()).toBe(true);
            expect(fixture.debugElement.query(By.css('p-carousel')).nativeElement.classList).toContain('p-carousel-vertical');
        });

        it('should apply vertical viewport height', () => {
            expect(carouselInstance.verticalViewPortHeight()).toBe('400px');
            expect(fixture.debugElement.query(By.css('.p-carousel-viewport')).nativeElement.style.height).toBe('400px');
        });

        it('should render appropriate icons for vertical mode', () => {
            // Vertical mode should show chevron-up and chevron-down icons
            const prevButton = fixture.debugElement.query(By.css('svg[data-p-icon="chevron-up"]'));
            const nextButton = fixture.debugElement.query(By.css('svg[data-p-icon="chevron-down"]'));

            expect(prevButton).toBeTruthy();
            expect(nextButton).toBeTruthy();
            expect(fixture.debugElement.query(By.css('svg[data-p-icon="chevron-left"]'))).toBeNull();
        });

        it('should translate the items vertically', () => {
            carouselInstance.navForward(new MouseEvent('click'));

            expect(carouselInstance.itemsContainer()?.nativeElement.style.transform).toBe('translate3d(0px, -100%, 0px)');
        });
    });

    describe('Responsive Options', () => {
        let fixture: ComponentFixture<TestResponsiveCarouselComponent>;
        let component: TestResponsiveCarouselComponent;
        let carouselInstance: Carousel;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestResponsiveCarouselComponent);
            component = fixture.componentInstance;
            await fixture.whenStable();

            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            carouselInstance = carouselEl.componentInstance as Carousel;
        });

        it('should accept responsive options', () => {
            expect(carouselInstance.responsiveOptions()).toEqual(component.responsiveOptions);
            expect(carouselInstance.responsiveOptions()?.length).toBe(3);
        });

        it('should calculate position based on window size', () => {
            // Mock window width
            Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true });

            carouselInstance.calculatePosition();

            // Should use the smallest breakpoint settings
            expect(carouselInstance._numVisible()).toBe(1);
            expect(carouselInstance.numVisible()).toBe(1);
        });

        it('should write a style sheet with a media query per breakpoint', () => {
            const style = carouselInstance.carouselStyle();

            expect(style).toBeTruthy();
            expect(style.innerHTML).toContain(`#${carouselInstance.id} .p-carousel-item`);
            expect(style.innerHTML).toContain('@media screen and (max-width: 1024px)');
            expect(style.innerHTML).toContain('@media screen and (max-width: 560px)');
        });

        it('should bind document listeners for responsive mode', () => {
            expect(carouselInstance.documentResizeListener()).toBeTruthy();

            vi.spyOn(carouselInstance, 'calculatePosition');
            window.dispatchEvent(new Event('resize'));

            expect(carouselInstance.calculatePosition).toHaveBeenCalled();
        });
    });

    describe('Responsive state (linkedSignal)', () => {
        let fixture: ComponentFixture<TestBasicCarouselComponent>;
        let component: TestBasicCarouselComponent;
        let carouselInstance: Carousel;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestBasicCarouselComponent);
            component = fixture.componentInstance;
            await fixture.whenStable();

            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            carouselInstance = carouselEl.componentInstance as Carousel;
        });

        it('should keep the responsive override until the numVisible input changes', async () => {
            expect(carouselInstance._numVisible()).toBe(3);

            carouselInstance._numVisible.set(2);
            expect(carouselInstance._numVisible()).toBe(2);
            expect(carouselInstance.numVisible()).toBe(3);

            component.numVisible = 4;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(carouselInstance._numVisible()).toBe(4);
            expect(carouselInstance.defaultNumVisible()).toBe(4);
        });

        it('should keep the responsive override until the numScroll input changes', async () => {
            expect(carouselInstance._numScroll()).toBe(1);

            carouselInstance._numScroll.set(2);
            expect(carouselInstance._numScroll()).toBe(2);
            expect(carouselInstance.numScroll()).toBe(1);

            component.numScroll = 3;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(carouselInstance._numScroll()).toBe(3);
            expect(carouselInstance.defaultNumScroll()).toBe(3);
        });

        it('should apply the matching breakpoint when responsive options are provided', async () => {
            Object.defineProperty(window, 'innerWidth', { value: 700, configurable: true });
            component.responsiveOptions = [
                { breakpoint: '1024px', numVisible: 3, numScroll: 3 },
                { breakpoint: '768px', numVisible: 2, numScroll: 2 }
            ];
            component.numVisible = 4;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(carouselInstance._numVisible()).toBe(2);
            expect(carouselInstance._numScroll()).toBe(2);
            expect(carouselInstance.documentResizeListener()).toBeTruthy();
            expect(fixture.debugElement.queryAll(By.css('.p-carousel-indicator')).length).toBe(carouselInstance.totalDots());
        });
    });

    describe('Autoplay Functionality', () => {
        let fixture: ComponentFixture<TestAutoplayCarouselComponent>;
        let component: TestAutoplayCarouselComponent;
        let carouselInstance: Carousel;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestAutoplayCarouselComponent);
            component = fixture.componentInstance;
            await fixture.whenStable();

            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            carouselInstance = carouselEl.componentInstance as Carousel;
        });

        afterEach(() => {
            carouselInstance.stopAutoplay();
        });

        it('should enable autoplay with interval', () => {
            expect(carouselInstance.autoplayInterval()).toBe(1000);
            expect(carouselInstance.allowAutoplay()).toBe(true);
            expect(carouselInstance.isPlaying()).toBe(true);
            expect(fixture.debugElement.query(By.css('[aria-live]')).nativeElement.getAttribute('aria-live')).toBe('polite');
        });

        it('should start autoplay when conditions are met', async () => {
            carouselInstance.stopAutoplay();
            carouselInstance.allowAutoplay.set(true);
            carouselInstance.startAutoplay();

            expect(carouselInstance.isPlaying()).toBe(true);

            await new Promise((resolve) => setTimeout(resolve, 1001));

            expect(carouselInstance._page()).toBe(1);
            carouselInstance.stopAutoplay();
        });

        it('should stop autoplay', () => {
            carouselInstance.startAutoplay();
            carouselInstance.stopAutoplay();

            expect(carouselInstance.isPlaying()).toBe(false);
            expect(carouselInstance.allowAutoplay()).toBe(false);
        });

        it('should stop autoplay on manual navigation', async () => {
            carouselInstance.startAutoplay();
            const mockEvent = new MouseEvent('click');

            carouselInstance.navForward(mockEvent);

            expect(carouselInstance.isPlaying()).toBe(false);

            await fixture.whenStable();
            expect(fixture.debugElement.query(By.css('[aria-live]')).nativeElement.getAttribute('aria-live')).toBe('off');
        });
    });

    describe('Template Content Projection - #template approach', () => {
        let fixture: ComponentFixture<TestTemplateCarouselComponent>;
        let component: TestTemplateCarouselComponent;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestTemplateCarouselComponent);
            component = fixture.componentInstance;
            await fixture.whenStable();
        });

        it('should render custom header template', () => {
            const headerContent = fixture.debugElement.query(By.css('.custom-header'));
            expect(headerContent).toBeTruthy();
            expect(headerContent.nativeElement.textContent).toContain('Header Content');
        });

        it('should render custom footer template', () => {
            const footerContent = fixture.debugElement.query(By.css('.custom-footer'));
            expect(footerContent).toBeTruthy();
            expect(footerContent.nativeElement.textContent).toContain('Footer Content');
        });

        it('should render item template for each product', () => {
            const productItems = fixture.debugElement.queryAll(By.css('.template-item'));
            expect(productItems.length).toBe(5);
        });
    });

    describe('Template Content Projection - pTemplate approach', () => {
        let fixture: ComponentFixture<TestPTemplateCarouselComponent>;
        let component: TestPTemplateCarouselComponent;
        let carouselInstance: Carousel;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestPTemplateCarouselComponent);
            component = fixture.componentInstance;
            await fixture.whenStable();

            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            carouselInstance = carouselEl.componentInstance as Carousel;
        });

        it('should process pTemplate correctly', () => {
            expect(carouselInstance._headerTemplate()).toBeDefined();
            expect(carouselInstance._itemTemplate()).toBeDefined();
            expect(carouselInstance._footerTemplate()).toBeDefined();
            expect(carouselInstance._previousIconTemplate()).toBeUndefined();
            expect(carouselInstance._nextIconTemplate()).toBeUndefined();
        });

        it('should render pTemplate content', () => {
            const ptemplateHeader = fixture.debugElement.query(By.css('.ptemplate-header'));
            const ptemplateFooter = fixture.debugElement.query(By.css('.ptemplate-footer'));

            expect(ptemplateHeader.nativeElement.textContent).toContain('PTemplate Header');
            expect(ptemplateFooter.nativeElement.textContent).toContain('PTemplate Footer');
            expect(fixture.debugElement.queryAll(By.css('.ptemplate-item')).length).toBe(5);
        });
    });

    describe('Touch Events', () => {
        let fixture: ComponentFixture<TestBasicCarouselComponent>;
        let component: TestBasicCarouselComponent;
        let carouselInstance: Carousel;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestBasicCarouselComponent);
            component = fixture.componentInstance;
            await fixture.whenStable();

            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            carouselInstance = carouselEl.componentInstance as Carousel;
        });

        it('should handle touch start event', () => {
            const mockTouchEvent = {
                changedTouches: [{ pageX: 100, pageY: 50 }]
            } as any;

            carouselInstance.onTouchStart(mockTouchEvent);

            expect(carouselInstance.startPos()).toEqual({ x: 100, y: 50 });
        });

        it('should handle touch move event', () => {
            const mockTouchEvent = {
                cancelable: true,
                preventDefault: vi.fn()
            } as any;

            carouselInstance.onTouchMove(mockTouchEvent);

            expect(mockTouchEvent.preventDefault).toHaveBeenCalled();
        });

        it('should handle touch end with swipe detection', () => {
            carouselInstance.startPos.set({ x: 100, y: 50 });
            carouselInstance.swipeThreshold = 20;

            const mockTouchEvent = {
                changedTouches: [{ pageX: 50, pageY: 50 }]
            } as any;

            vi.spyOn(carouselInstance, 'changePageOnTouch').mockImplementation(() => {});

            carouselInstance.onTouchEnd(mockTouchEvent);

            // The difference is touchobj.pageX - startPos.x = 50 - 100 = -50 (negative)
            expect(carouselInstance.changePageOnTouch).toHaveBeenCalledWith(mockTouchEvent, -50);
        });

        it('should navigate forward on a swipe beyond the threshold', () => {
            carouselInstance.onTouchStart({ changedTouches: [{ pageX: 100, pageY: 50 }] } as any);
            carouselInstance.onTouchEnd({ changedTouches: [{ pageX: 50, pageY: 50 }] } as any);

            expect(carouselInstance._page()).toBe(1);
        });
    });

    describe('Keyboard Navigation', () => {
        let fixture: ComponentFixture<TestBasicCarouselComponent>;
        let component: TestBasicCarouselComponent;
        let carouselInstance: Carousel;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestBasicCarouselComponent);
            component = fixture.componentInstance;
            await fixture.whenStable();

            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            carouselInstance = carouselEl.componentInstance as Carousel;
        });

        it('should handle arrow key navigation', () => {
            const mockKeyboardEvent = {
                code: 'ArrowRight'
            } as KeyboardEvent;

            vi.spyOn(carouselInstance, 'onRightKey').mockImplementation(() => {});

            carouselInstance.onIndicatorKeydown(mockKeyboardEvent);

            expect(carouselInstance.onRightKey).toHaveBeenCalled();
        });

        it('should handle left arrow key', () => {
            const mockKeyboardEvent = {
                code: 'ArrowLeft'
            } as KeyboardEvent;

            vi.spyOn(carouselInstance, 'onLeftKey').mockImplementation(() => {});

            carouselInstance.onIndicatorKeydown(mockKeyboardEvent);

            expect(carouselInstance.onLeftKey).toHaveBeenCalled();
        });

        it('should move the focus to the next indicator on right arrow', () => {
            carouselInstance.onRightKey();

            const buttons = fixture.debugElement.queryAll(By.css('[data-pc-section="indicator"] > button'));
            expect(buttons[0].nativeElement.tabIndex).toBe(-1);
            expect(buttons[1].nativeElement.tabIndex).toBe(0);
        });
    });

    describe('CSS Classes and Styling', () => {
        let fixture: ComponentFixture<TestBasicCarouselComponent>;
        let component: TestBasicCarouselComponent;
        let carouselInstance: Carousel;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestBasicCarouselComponent);
            component = fixture.componentInstance;
            await fixture.whenStable();

            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            carouselInstance = carouselEl.componentInstance as Carousel;
        });

        it('should apply custom style classes', async () => {
            component.styleClass = 'custom-carousel-class';
            component.contentClass = 'custom-content-class';
            component.indicatorsContentClass = 'custom-indicators-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const root = fixture.debugElement.query(By.css('p-carousel')).nativeElement;
            expect(root.classList).toContain('custom-carousel-class');
            expect(root.classList).toContain('p-carousel');
            expect(carouselInstance.contentClass()).toBe('custom-content-class');
            expect(fixture.debugElement.query(By.css('.p-carousel-content-container')).nativeElement.classList).toContain('custom-content-class');
            expect(carouselInstance.indicatorsContentClass()).toBe('custom-indicators-class');
            expect(fixture.debugElement.query(By.css('.p-carousel-indicator-list')).nativeElement.classList).toContain('custom-indicators-class');
        });

        it('should apply custom styles', async () => {
            component.indicatorsContentStyle = { marginTop: '10px' };
            component.indicatorStyle = { backgroundColor: 'red' };
            component.indicatorStyleClass = 'custom-indicator-button';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(carouselInstance.indicatorsContentStyle()).toEqual({ marginTop: '10px' });
            expect(carouselInstance.indicatorStyle()).toEqual({ backgroundColor: 'red' });
            expect(fixture.debugElement.query(By.css('.p-carousel-indicator-list')).nativeElement.style.marginTop).toBe('10px');
            const indicatorButton = fixture.debugElement.query(By.css('.p-carousel-indicator-button')).nativeElement;
            expect(indicatorButton.style.backgroundColor).toBe('red');
            expect(indicatorButton.classList).toContain('custom-indicator-button');
        });

        it('should have proper CSS structure', () => {
            const carouselRoot = fixture.debugElement.query(By.css('p-carousel'));
            expect(carouselRoot).toBeTruthy();
            expect(carouselRoot.nativeElement.classList).toContain('p-carousel-horizontal');

            // Check for main structural elements
            const viewport = fixture.debugElement.query(By.css('.p-carousel-viewport'));
            const itemList = fixture.debugElement.query(By.css('.p-carousel-item-list'));

            expect(viewport).toBeTruthy();
            expect(itemList).toBeTruthy();
            expect(fixture.debugElement.queryAll(By.css('.p-carousel-item')).length).toBe(5);
        });
    });

    describe('View updates (OnPush)', () => {
        let fixture: ComponentFixture<TestBasicCarouselComponent>;
        let component: TestBasicCarouselComponent;
        let carouselInstance: Carousel;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestBasicCarouselComponent);
            component = fixture.componentInstance;
            await fixture.whenStable();

            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            carouselInstance = carouselEl.componentInstance as Carousel;
        });

        it('should re-render the items when value changes', async () => {
            expect(fixture.debugElement.queryAll(By.css('.product-item')).length).toBe(5);

            component.products = mockProducts.slice(0, 4);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(fixture.debugElement.queryAll(By.css('.product-item')).length).toBe(4);
            expect(fixture.debugElement.queryAll(By.css('.p-carousel-indicator')).length).toBe(2);
        });

        it('should re-render the indicators when numVisible or numScroll changes', async () => {
            expect(fixture.debugElement.queryAll(By.css('.p-carousel-indicator')).length).toBe(3);

            component.numVisible = 1;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(fixture.debugElement.queryAll(By.css('.p-carousel-indicator')).length).toBe(5);

            component.numScroll = 2;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(fixture.debugElement.queryAll(By.css('.p-carousel-indicator')).length).toBe(3);
        });

        it('should mark the active indicator when the page changes', async () => {
            const indicatorButtons = () => fixture.debugElement.queryAll(By.css('.p-carousel-indicator-button'));
            expect(indicatorButtons()[0].nativeElement.getAttribute('aria-current')).toBe('page');
            expect(fixture.debugElement.queryAll(By.css('.p-carousel-indicator'))[0].nativeElement.classList).toContain('p-carousel-indicator-active');

            component.page = 1;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(indicatorButtons()[0].nativeElement.getAttribute('aria-current')).toBeNull();
            expect(indicatorButtons()[1].nativeElement.getAttribute('aria-current')).toBe('page');
            expect(fixture.debugElement.queryAll(By.css('.p-carousel-indicator'))[1].nativeElement.classList).toContain('p-carousel-indicator-active');
            expect(fixture.debugElement.queryAll(By.css('.p-carousel-item'))[0].nativeElement.getAttribute('aria-hidden')).toBe('true');
            expect(fixture.debugElement.queryAll(By.css('.p-carousel-item'))[1].nativeElement.getAttribute('aria-hidden')).toBe('false');
        });

        it('should toggle the indicators and navigators', async () => {
            expect(fixture.debugElement.query(By.css('.p-carousel-indicator-list'))).toBeTruthy();
            expect(fixture.debugElement.queryAll(By.css('p-button')).length).toBe(2);

            component.showIndicators = false;
            component.showNavigators = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(fixture.debugElement.query(By.css('.p-carousel-indicator-list'))).toBeNull();
            expect(fixture.debugElement.queryAll(By.css('p-button')).length).toBe(0);
        });

        it('should re-render the orientation and the viewport height', async () => {
            const root = fixture.debugElement.query(By.css('p-carousel')).nativeElement;
            expect(root.classList).toContain('p-carousel-horizontal');
            expect(fixture.debugElement.query(By.css('.p-carousel-viewport')).nativeElement.style.height).toBe('auto');

            component.orientation = 'vertical';
            component.verticalViewPortHeight = '250px';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(root.classList).toContain('p-carousel-vertical');
            expect(fixture.debugElement.query(By.css('.p-carousel-viewport')).nativeElement.style.height).toBe('250px');
            expect(fixture.debugElement.query(By.css('svg[data-p-icon="chevron-up"]'))).toBeTruthy();
        });

        it('should re-render the aria-live region when autoplay is enabled', async () => {
            expect(fixture.debugElement.query(By.css('[aria-live]')).nativeElement.getAttribute('aria-live')).toBe('off');

            component.autoplayInterval = 5000;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(carouselInstance.allowAutoplay()).toBe(true);
            expect(fixture.debugElement.query(By.css('[aria-live]')).nativeElement.getAttribute('aria-live')).toBe('polite');
            carouselInstance.stopAutoplay();
        });

        it('should re-render the clones when circular is enabled', async () => {
            expect(fixture.debugElement.queryAll(By.css('.p-carousel-item-clone')).length).toBe(0);

            component.circular = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(fixture.debugElement.queryAll(By.css('.p-carousel-item-clone')).length).toBe(6);
        });

        it('should hide the default navigator icons when the button props define one', async () => {
            expect(fixture.debugElement.query(By.css('svg[data-p-icon="chevron-left"]'))).toBeTruthy();
            expect(fixture.debugElement.query(By.css('svg[data-p-icon="chevron-right"]'))).toBeTruthy();

            component.prevButtonProps = { icon: 'pi pi-custom-prev' };
            component.nextButtonProps = { icon: 'pi pi-custom-next' };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(carouselInstance.prevButtonProps()).toEqual({ icon: 'pi pi-custom-prev' });
            expect(fixture.debugElement.query(By.css('svg[data-p-icon="chevron-left"]'))).toBeNull();
            expect(fixture.debugElement.query(By.css('svg[data-p-icon="chevron-right"]'))).toBeNull();
        });
    });

    describe('Event Handling', () => {
        let fixture: ComponentFixture<TestBasicCarouselComponent>;
        let component: TestBasicCarouselComponent;
        let carouselInstance: Carousel;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestBasicCarouselComponent);
            component = fixture.componentInstance;
            component.numVisible = 2; // To enable pagination
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            carouselInstance = carouselEl.componentInstance as Carousel;
        });

        it('should emit onPage event when page changes', () => {
            vi.spyOn(component, 'onPage').mockImplementation(() => {});

            carouselInstance.onPage.emit({ page: 1 });

            expect(component.onPage).toHaveBeenCalledWith({ page: 1 });
        });

        it('should emit onPage event with correct parameters during navigation', () => {
            vi.spyOn(carouselInstance.onPage, 'emit').mockImplementation(() => {});

            carouselInstance.step(-1, 1);

            expect(carouselInstance.onPage.emit).toHaveBeenCalledWith({ page: 1 });
        });

        it('should navigate when the navigator buttons are clicked', async () => {
            const buttons = fixture.debugElement.queryAll(By.css('p-button button'));

            buttons[1].nativeElement.click();
            await fixture.whenStable();

            expect(carouselInstance._page()).toBe(1);
            expect(component.pageEvent).toEqual({ page: 1 });

            buttons[0].nativeElement.click();
            await fixture.whenStable();

            expect(carouselInstance._page()).toBe(0);
            expect(component.pageEvent).toEqual({ page: 0 });
        });

        it('should navigate when an indicator is clicked', async () => {
            fixture.debugElement.queryAll(By.css('.p-carousel-indicator-button'))[2].nativeElement.click();
            await fixture.whenStable();

            expect(carouselInstance._page()).toBe(2);
            expect(component.pageEvent).toEqual({ page: 2 });
        });
    });

    describe('Accessibility', () => {
        let fixture: ComponentFixture<TestBasicCarouselComponent>;
        let component: TestBasicCarouselComponent;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestBasicCarouselComponent);
            component = fixture.componentInstance;
            await fixture.whenStable();
        });

        it('should have proper ARIA attributes on root element', () => {
            const carouselRoot = fixture.debugElement.query(By.css('p-carousel'));
            const nativeElement = carouselRoot.nativeElement;

            expect(nativeElement.getAttribute('role')).toBe('region');
            expect(nativeElement.getAttribute('id')).toBeTruthy();
        });

        it('should put the navigation labels on the inner buttons, not on the p-button hosts', () => {
            const buttons = Array.from(fixture.nativeElement.querySelectorAll('p-button button')) as HTMLElement[];
            expect(buttons.length).toBe(2);
            buttons.forEach((button) => expect(button.getAttribute('aria-label')).toBeTruthy());
            expect(fixture.nativeElement.querySelector('p-button[aria-label]')).toBeNull();
        });

        it('should have proper ARIA attributes on indicators', () => {
            const indicators = fixture.debugElement.queryAll(By.css('button[aria-label]'));
            if (indicators.length > 0) {
                indicators.forEach((indicator) => {
                    expect(indicator.nativeElement.getAttribute('aria-label')).toBeTruthy();
                });
            }
        });

        it('should handle aria-live attribute correctly', () => {
            const content = fixture.debugElement.query(By.css('[aria-live]'));
            expect(content).toBeTruthy();
            expect(['polite', 'off']).toContain(content.nativeElement.getAttribute('aria-live'));
        });

        it('should provide ARIA labels through translation service', () => {
            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            const carouselInstance = carouselEl.componentInstance as Carousel;

            expect(carouselInstance.ariaPrevButtonLabel).toBeDefined();
            expect(carouselInstance.ariaNextButtonLabel).toBeDefined();
            expect(carouselInstance.ariaSlideLabel).toBeDefined();
        });
    });

    describe('Memory Management and Cleanup', () => {
        let fixture: ComponentFixture<TestResponsiveCarouselComponent>;
        let component: TestResponsiveCarouselComponent;
        let carouselInstance: Carousel;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestResponsiveCarouselComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            carouselInstance = carouselEl.componentInstance as Carousel;
        });

        it('should cleanup document listeners on destroy', () => {
            vi.spyOn(carouselInstance, 'unbindDocumentListeners').mockImplementation(() => {});

            carouselInstance.ngOnDestroy();

            expect(carouselInstance.unbindDocumentListeners).toHaveBeenCalled();
        });

        it('should unbind the resize listener on destroy', () => {
            expect(carouselInstance.documentResizeListener()).toBeTruthy();

            carouselInstance.ngOnDestroy();

            expect(carouselInstance.documentResizeListener()).toBeNull();
        });

        it('should stop autoplay on destroy', () => {
            const autoplayFixture = TestBed.createComponent(TestAutoplayCarouselComponent);
            autoplayFixture.detectChanges();
            const autoplayInstance = autoplayFixture.debugElement.query(By.css('p-carousel')).componentInstance as Carousel;

            vi.spyOn(autoplayInstance, 'stopAutoplay');

            autoplayInstance.ngOnDestroy();

            expect(autoplayInstance.stopAutoplay).toHaveBeenCalled();
            expect(autoplayInstance.isPlaying()).toBe(false);
        });

        it('should handle destroy when no responsive options', () => {
            const basicFixture = TestBed.createComponent(TestBasicCarouselComponent);
            basicFixture.detectChanges();
            const basicInstance = basicFixture.debugElement.query(By.css('p-carousel')).componentInstance as Carousel;

            expect(basicInstance.documentResizeListener()).toBeUndefined();
            expect(() => {
                basicInstance.ngOnDestroy();
            }).not.toThrow();
        });
    });

    describe('Edge Cases', () => {
        let fixture: ComponentFixture<TestBasicCarouselComponent>;
        let component: TestBasicCarouselComponent;
        let carouselInstance: Carousel;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicCarouselComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const carouselEl = fixture.debugElement.query(By.css('p-carousel'));
            carouselInstance = carouselEl.componentInstance as Carousel;
        });

        it('should handle empty products array', async () => {
            component.products = [];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(carouselInstance.isEmpty()).toBe(true);
            expect(carouselInstance.totalDots()).toBe(0);
            expect(fixture.debugElement.queryAll(By.css('.p-carousel-indicator')).length).toBe(0);
        });

        it('should handle null products', async () => {
            component.products = null as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(carouselInstance.isEmpty()).toBe(true);
            expect(fixture.debugElement.queryAll(By.css('.p-carousel-item')).length).toBe(0);
        });

        it('should handle single item', async () => {
            component.products = [mockProducts[0]];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // For single item: Math.ceil((1 - 3) / 1) + 1 = Math.ceil(-2) + 1 = -2 + 1 = -1
            // This is the actual behavior - component returns -1 for insufficient items
            expect(carouselInstance.totalDots()).toBe(-1);
        });

        it('should clamp the page to the last one when the value shrinks', async () => {
            component.page = 2;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(carouselInstance._page()).toBe(2);

            component.products = mockProducts.slice(0, 4);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(carouselInstance.totalDots()).toBe(2);
            expect(carouselInstance._page()).toBe(1);
            expect(component.pageEvent).toEqual({ page: 1 });
        });

        it('should handle page setter with invalid values', async () => {
            const initialPage = carouselInstance._page();
            expect(initialPage).toBe(0);
            vi.spyOn(carouselInstance, 'step');

            // Try to set page beyond bounds
            component.page = 999;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(carouselInstance.page()).toBe(999); // Should still set the value but not trigger navigation
            expect(carouselInstance._page()).toBe(999);
            expect(carouselInstance.step).not.toHaveBeenCalled();
        });

        it('should handle step with different directions', () => {
            vi.spyOn(carouselInstance.onPage, 'emit').mockImplementation(() => {});

            carouselInstance.step(1); // Backward
            expect(carouselInstance.onPage.emit).toHaveBeenCalled();

            carouselInstance.step(-1); // Forward
            expect(carouselInstance.onPage.emit).toHaveBeenCalled();
        });

        it('should handle button props configuration', async () => {
            component.prevButtonProps = { severity: 'primary', icon: 'pi-custom' };
            component.nextButtonProps = { severity: 'secondary', text: false };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(carouselInstance.prevButtonProps()).toEqual({ severity: 'primary', icon: 'pi-custom' });
            expect(carouselInstance.nextButtonProps()).toEqual({ severity: 'secondary', text: false });
        });
    });

    describe('PassThrough (PT) Tests', () => {
        describe('Case 1: Simple string classes', () => {
            let fixture: ComponentFixture<Carousel>;
            let carouselInstance: Carousel;

            beforeEach(() => {
                fixture = TestBed.createComponent(Carousel);
                carouselInstance = fixture.componentInstance;
                fixture.componentRef.setInput('value', mockProducts);
                fixture.componentRef.setInput('numVisible', 3);
                fixture.componentRef.setInput('numScroll', 1);
            });

            it('should accept string class PT for root', () => {
                fixture.componentRef.setInput('pt', { root: 'ROOT_CLASS' });
                fixture.detectChanges();

                expect(fixture.nativeElement.className).toContain('ROOT_CLASS');
            });

            it('should apply string class to header', () => {
                (carouselInstance as any).headerFacet = () => ({}) as any;
                fixture.componentRef.setInput('pt', { header: 'HEADER_CLASS' });
                fixture.detectChanges();

                const headerElement = fixture.debugElement.query(By.css('[class*="header"]'));
                expect(headerElement).toBeTruthy();
                expect(headerElement.nativeElement.className).toContain('HEADER_CLASS');
            });

            it('should apply string class to footer', () => {
                (carouselInstance as any).footerFacet = () => ({}) as any;
                fixture.componentRef.setInput('pt', { footer: 'FOOTER_CLASS' });
                fixture.detectChanges();

                const footerElement = fixture.debugElement.query(By.css('[class*="footer"]'));
                expect(footerElement).toBeTruthy();
                expect(footerElement.nativeElement.className).toContain('FOOTER_CLASS');
            });

            it('should apply string class to contentContainer', () => {
                fixture.componentRef.setInput('pt', { contentContainer: 'CONTENT_CONTAINER_CLASS' });
                fixture.detectChanges();

                const contentContainerElement = fixture.debugElement.query(By.css('.p-carousel-content-container'));
                expect(contentContainerElement.nativeElement.className).toContain('CONTENT_CONTAINER_CLASS');
            });

            it('should apply string class to content', () => {
                fixture.componentRef.setInput('pt', { content: 'CONTENT_CLASS' });
                fixture.detectChanges();

                const contentElement = fixture.debugElement.query(By.css('[aria-live]'));
                expect(contentElement.nativeElement.className).toContain('CONTENT_CLASS');
            });

            it('should apply string class to viewport', () => {
                fixture.componentRef.setInput('pt', { viewport: 'VIEWPORT_CLASS' });
                fixture.detectChanges();

                const viewportElement = fixture.debugElement.query(By.css('.p-carousel-viewport'));
                expect(viewportElement.nativeElement.className).toContain('VIEWPORT_CLASS');
            });

            it('should apply string class to itemList', () => {
                fixture.componentRef.setInput('pt', { itemList: 'ITEM_LIST_CLASS' });
                fixture.detectChanges();

                const itemListElement = fixture.debugElement.query(By.css('.p-carousel-item-list'));
                expect(itemListElement.nativeElement.className).toContain('ITEM_LIST_CLASS');
            });

            it('should apply string class to indicatorList', () => {
                fixture.componentRef.setInput('pt', { indicatorList: 'INDICATOR_LIST_CLASS' });
                fixture.detectChanges();

                const indicatorListElement = fixture.debugElement.query(By.css('ul'));
                expect(indicatorListElement.nativeElement.className).toContain('INDICATOR_LIST_CLASS');
            });
        });

        describe('Case 2: Objects with class, style, data attributes', () => {
            let fixture: ComponentFixture<Carousel>;
            let carouselInstance: Carousel;

            beforeEach(() => {
                fixture = TestBed.createComponent(Carousel);
                carouselInstance = fixture.componentInstance;
                fixture.componentRef.setInput('value', mockProducts);
                fixture.componentRef.setInput('numVisible', 3);
                fixture.componentRef.setInput('numScroll', 1);
            });

            it('should apply object with class, style, and data attributes to root', () => {
                fixture.componentRef.setInput('pt', {
                    root: {
                        class: 'ROOT_OBJECT_CLASS',
                        style: { 'background-color': 'red' },
                        'data-p-test': true,
                        'aria-label': 'TEST_ARIA_LABEL'
                    }
                });
                fixture.detectChanges();

                const rootElement = fixture.nativeElement;
                expect(rootElement.className).toContain('ROOT_OBJECT_CLASS');
                expect(rootElement.style.backgroundColor).toBe('red');
                expect(rootElement.getAttribute('data-p-test')).toBe('true');
                expect(rootElement.getAttribute('aria-label')).toBe('TEST_ARIA_LABEL');
            });

            it('should apply object with style to content', () => {
                fixture.componentRef.setInput('pt', {
                    content: {
                        style: { padding: '20px' }
                    }
                });
                fixture.detectChanges();

                const contentElement = fixture.debugElement.query(By.css('[aria-live]'));
                expect(contentElement.nativeElement.style.padding).toBe('20px');
            });

            it('should apply object attributes to viewport', () => {
                fixture.componentRef.setInput('pt', {
                    viewport: {
                        'data-testid': 'carousel-viewport'
                    }
                });
                fixture.detectChanges();

                const viewportElement = fixture.debugElement.query(By.css('.p-carousel-viewport'));
                expect(viewportElement.nativeElement.getAttribute('data-testid')).toBe('carousel-viewport');
            });
        });

        describe('Case 3: Mixed object and string values', () => {
            let fixture: ComponentFixture<Carousel>;
            let carouselInstance: Carousel;

            beforeEach(() => {
                fixture = TestBed.createComponent(Carousel);
                carouselInstance = fixture.componentInstance;
                fixture.componentRef.setInput('value', mockProducts);
                fixture.componentRef.setInput('numVisible', 3);
                fixture.componentRef.setInput('numScroll', 1);
            });

            it('should apply mixed PT values', () => {
                (carouselInstance as any).headerFacet = () => ({}) as any;
                fixture.componentRef.setInput('pt', {
                    root: {
                        class: 'ROOT_MIXED_CLASS'
                    },
                    header: 'HEADER_STRING_CLASS',
                    content: {
                        class: 'CONTENT_MIXED_CLASS',
                        style: { margin: '10px' }
                    }
                });
                fixture.detectChanges();

                const rootElement = fixture.nativeElement;
                expect(rootElement.className).toContain('ROOT_MIXED_CLASS');

                const headerElement = fixture.debugElement.query(By.css('[class*="header"]'));
                expect(headerElement.nativeElement.className).toContain('HEADER_STRING_CLASS');

                const contentElement = fixture.debugElement.query(By.css('[aria-live]'));
                expect(contentElement.nativeElement.className).toContain('CONTENT_MIXED_CLASS');
                expect(contentElement.nativeElement.style.margin).toBe('10px');
            });
        });

        describe('Case 4: Use variables from instance', () => {
            let fixture: ComponentFixture<Carousel>;
            let carouselInstance: Carousel;

            beforeEach(() => {
                fixture = TestBed.createComponent(Carousel);
                carouselInstance = fixture.componentInstance;
                fixture.componentRef.setInput('value', mockProducts);
                fixture.componentRef.setInput('numVisible', 3);
                fixture.componentRef.setInput('numScroll', 1);
            });

            it('should accept PT functions based on instance properties', () => {
                fixture.componentRef.setInput('circular', true);
                fixture.componentRef.setInput('pt', {
                    root: ({ instance }: any) => ({
                        class: {
                            CIRCULAR_MODE: instance?.circular()
                        }
                    }),
                    content: ({ instance }: any) => ({
                        style: {
                            'background-color': instance?.circular() ? 'yellow' : 'red'
                        }
                    })
                });
                fixture.detectChanges();

                expect(fixture.nativeElement.className).toContain('CIRCULAR_MODE');
                expect(fixture.debugElement.query(By.css('[aria-live]')).nativeElement.style.backgroundColor).toBe('yellow');
            });

            it('should accept PT configuration that reacts to instance changes', () => {
                fixture.componentRef.setInput('pt', {
                    root: ({ instance }: any) => ({
                        class: {
                            INDICATORS_SHOWN: instance?.showIndicators()
                        }
                    })
                });
                fixture.componentRef.setInput('showIndicators', true);
                fixture.detectChanges();

                expect(fixture.nativeElement.className).toContain('INDICATORS_SHOWN');

                fixture.componentRef.setInput('showIndicators', false);
                fixture.detectChanges();

                expect(fixture.nativeElement.className).not.toContain('INDICATORS_SHOWN');
            });
        });

        describe('Case 5: Event binding', () => {
            let fixture: ComponentFixture<Carousel>;
            let carouselInstance: Carousel;

            beforeEach(() => {
                fixture = TestBed.createComponent(Carousel);
                carouselInstance = fixture.componentInstance;
                fixture.componentRef.setInput('value', mockProducts);
                fixture.componentRef.setInput('numVisible', 3);
                fixture.componentRef.setInput('numScroll', 1);
            });

            it('should bind click event through PT', () => {
                let clicked = false;
                fixture.componentRef.setInput('pt', {
                    content: {
                        onclick: () => {
                            clicked = true;
                        }
                    }
                });
                fixture.detectChanges();

                const contentElement = fixture.debugElement.query(By.css('[aria-live]'));
                contentElement.nativeElement.click();
                expect(clicked).toBe(true);
            });

            it('should accept PT configuration with event handlers', () => {
                let capturedPage: number | undefined;
                fixture.componentRef.setInput('pt', {
                    root: ({ instance }: any) => ({
                        onclick: () => {
                            capturedPage = instance?._page();
                        }
                    })
                });
                fixture.detectChanges();
                carouselInstance._page.set(2);

                fixture.nativeElement.click();
                expect(capturedPage).toBe(2);
            });
        });

        describe('Case 7: Test from ExhaustiveConfig', () => {
            let fixture: ComponentFixture<Carousel>;
            let carouselInstance: Carousel;

            beforeEach(async () => {
                await TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    imports: [CommonModule, Carousel, SharedModule, PrimeTemplate, ButtonModule],
                    providers: [
                        provideZonelessChangeDetection(),
                        provideExhaustive({
                            pt: {
                                carousel: {
                                    root: { 'aria-label': 'TEST_GLOBAL_ARIA_LABEL', class: 'GLOBAL_CAROUSEL_CLASS' },
                                    content: { class: 'GLOBAL_CONTENT_CLASS' }
                                }
                            }
                        })
                    ]
                }).compileComponents();

                fixture = TestBed.createComponent(Carousel);
                carouselInstance = fixture.componentInstance;
                fixture.componentRef.setInput('value', mockProducts);
                fixture.componentRef.setInput('numVisible', 3);
                fixture.componentRef.setInput('numScroll', 1);
                fixture.detectChanges();
            });

            it('should apply global PT from ExhaustiveConfig', () => {
                const rootElement = fixture.nativeElement;
                expect(rootElement.getAttribute('aria-label')).toBe('TEST_GLOBAL_ARIA_LABEL');
                expect(rootElement.className).toContain('GLOBAL_CAROUSEL_CLASS');
            });

            it('should apply global PT to nested elements', () => {
                const contentElement = fixture.debugElement.query(By.css('[aria-live]'));
                expect(contentElement.nativeElement.className).toContain('GLOBAL_CONTENT_CLASS');
            });
        });

        describe('Case 8: Test hooks', () => {
            let fixture: ComponentFixture<Carousel>;
            let carouselInstance: Carousel;

            beforeEach(() => {
                fixture = TestBed.createComponent(Carousel);
                carouselInstance = fixture.componentInstance;
                fixture.componentRef.setInput('value', mockProducts);
                fixture.componentRef.setInput('numVisible', 3);
                fixture.componentRef.setInput('numScroll', 1);
            });

            it('should call PT hooks during lifecycle', () => {
                let afterViewInitCalled = false;

                fixture.componentRef.setInput('pt', {
                    root: 'MY_CAROUSEL',
                    hooks: {
                        onAfterViewInit: () => {
                            afterViewInitCalled = true;
                        }
                    }
                });

                fixture.detectChanges();

                expect(afterViewInitCalled).toBe(true);
                expect(fixture.nativeElement.className).toContain('MY_CAROUSEL');
            });
        });

        describe('PT with context - items and indicators', () => {
            let fixture: ComponentFixture<Carousel>;
            let carouselInstance: Carousel;

            beforeEach(() => {
                fixture = TestBed.createComponent(Carousel);
                carouselInstance = fixture.componentInstance;
                fixture.componentRef.setInput('value', mockProducts);
                fixture.componentRef.setInput('numVisible', 3);
                fixture.componentRef.setInput('numScroll', 1);
            });

            it('should apply PT to items with context', () => {
                fixture.componentRef.setInput('pt', {
                    item: ({ context }: any) => ({
                        class: {
                            ACTIVE_ITEM: context?.active,
                            START_ITEM: context?.start,
                            END_ITEM: context?.end
                        }
                    })
                });
                fixture.detectChanges();

                // Items with context should have appropriate classes
                const items = fixture.debugElement.queryAll(By.css('[role="group"]'));
                expect(items.length).toBe(5);
                expect(items[0].nativeElement.className).toContain('ACTIVE_ITEM');
                expect(items[0].nativeElement.className).toContain('START_ITEM');
                expect(items[2].nativeElement.className).toContain('END_ITEM');
                expect(items[3].nativeElement.className).not.toContain('ACTIVE_ITEM');
            });

            it('should apply PT to indicators with context', () => {
                fixture.componentRef.setInput('pt', {
                    indicator: ({ context }: any) => ({
                        class: {
                            HIGHLIGHTED_INDICATOR: context?.highlighted
                        }
                    })
                });
                fixture.detectChanges();

                const indicators = fixture.debugElement.queryAll(By.css('[data-pc-section="indicator"]'));
                expect(indicators.length).toBe(3);
                // The first indicator should be highlighted by default
                expect(indicators[0].nativeElement.className).toContain('HIGHLIGHTED_INDICATOR');
                expect(indicators[1].nativeElement.className).not.toContain('HIGHLIGHTED_INDICATOR');
            });
        });
    });
});

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [Carousel, SharedModule],
    template: `
        <p-carousel [value]="items" [numVisible]="1" [numScroll]="1">
            <ng-template #item let-item>{{ item }}</ng-template>
            <ng-template #previousicon>p</ng-template>
            <ng-template #nexticon>n</ng-template>
            <ng-template pTemplate="footer">f</ng-template>
        </p-carousel>
    `
})
class CarouselQueryApiHostComponent {
    items = [1, 2, 3];
}

describe('Carousel Signal Query API', () => {
    it('should resolve its signal-based view/content queries', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [CarouselQueryApiHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(CarouselQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const instance = fixture.debugElement.query(By.directive(Carousel)).componentInstance;

        expect(instance.previousIconTemplate()).toBeDefined();
        expect(instance.nextIconTemplate()).toBeDefined();
        expect(instance.templates().some((t: any) => t.getType() === 'footer')).toBe(true);
        expect(instance._footerTemplate()).toBeDefined();
        expect(instance.itemsContainer()).toBeDefined();
        expect(instance.indicatorContent()).toBeDefined();
    });
});

@Component({
    standalone: true,
    imports: [Carousel],
    template: `
        <p-carousel [value]="items" [numVisible]="3" [numScroll]="3" [circular]="true" [autoplayInterval]="50">
            <ng-template #item let-item>{{ item }}</ng-template>
        </p-carousel>
    `
})
class CarouselAllItemsVisibleHostComponent {
    items = [1, 2, 3];
}

describe('Carousel autoplay with every item visible', () => {
    it('should not scroll when all the items fit in one page', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [CarouselAllItemsVisibleHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(CarouselAllItemsVisibleHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const instance: Carousel = fixture.debugElement.query(By.directive(Carousel)).componentInstance;
        const stepSpy = vi.spyOn(instance, 'step');

        instance.startAutoplay();
        await new Promise((resolve) => setTimeout(resolve, 200));
        instance.stopAutoplay();

        expect(instance.totalDots()).toBe(1);
        expect(stepSpy).not.toHaveBeenCalled();
        expect(instance._page()).toBe(0);
    });
});

@Component({
    standalone: true,
    imports: [Carousel],
    template: `
        <p-carousel [value]="items" [numVisible]="1" [numScroll]="1">
            <ng-template #item let-item>
                <button class="slide-button">{{ item }}</button>
            </ng-template>
        </p-carousel>
    `
})
class CarouselFocusableItemsHostComponent {
    items = [1, 2, 3];
}

describe('Carousel off-page items', () => {
    it('should keep the content of off-page items out of the focus order', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [CarouselFocusableItemsHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(CarouselFocusableItemsHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const buttons = fixture.nativeElement.querySelectorAll('.p-carousel-item .slide-button') as NodeListOf<HTMLButtonElement>;
        expect(buttons.length).toBe(3);

        buttons[0].focus();
        expect(document.activeElement).toBe(buttons[0]);

        // tabbing into a hidden slide would scroll the viewport and desync the indicators
        buttons[1].focus();
        expect(document.activeElement).not.toBe(buttons[1]);
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Carousel],
    template: `
        <p-carousel [value]="items" [numVisible]="3" [numScroll]="3">
            <ng-template #item let-item>{{ item }}</ng-template>
        </p-carousel>
    `
})
class TestScreenReaderPagingCarouselComponent {
    items = ['A', 'B', 'C', 'D', 'E', 'F'];
}

describe('Carousel items exposed to screen readers after paging (optimus-ui#704)', () => {
    it('should expose the items of the new page and hide the others after a page change', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({ imports: [TestScreenReaderPagingCarouselComponent], providers: [provideZonelessChangeDetection(), provideNoopAnimations()] });
        const fixture = TestBed.createComponent(TestScreenReaderPagingCarouselComponent);
        await fixture.whenStable();

        const host = fixture.nativeElement as HTMLElement;
        // the items a screen reader can reach: not hidden from the accessibility tree and not inert
        const readable = () =>
            Array.from(host.querySelectorAll('.p-carousel-item-list > *'))
                .filter((item) => item.getAttribute('aria-hidden') !== 'true' && !item.hasAttribute('inert'))
                .map((item) => item.textContent?.trim());

        expect(readable()).toEqual(['A', 'B', 'C']);

        (host.querySelector('.p-carousel-next-button') as HTMLButtonElement).click();
        await fixture.whenStable();
        expect(readable()).toEqual(['D', 'E', 'F']);

        (host.querySelectorAll('.p-carousel-indicator-button')[0] as HTMLButtonElement).click();
        await fixture.whenStable();
        expect(readable()).toEqual(['A', 'B', 'C']);
        fixture.destroy();
    });
});

describe('Carousel destroyed', () => {
    it('removes its responsive style element from the head', async () => {
        TestBed.configureTestingModule({ imports: [Carousel], providers: [provideZonelessChangeDetection(), provideNoopAnimations()] });
        const fixture = TestBed.createComponent(Carousel);
        fixture.componentRef.setInput('value', [1, 2, 3, 4]);
        fixture.componentRef.setInput('responsiveOptions', [{ breakpoint: '768px', numVisible: 1, numScroll: 1 }]);
        await fixture.whenStable();
        const style = fixture.componentInstance.carouselStyle() as HTMLStyleElement;
        expect(style.isConnected).toBe(true);

        fixture.destroy();

        expect(style.isConnected).toBe(false);
    });
});
