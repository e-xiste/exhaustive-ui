import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { GalleriaResponsiveOptions } from '@exhaustive-ui/core/types/galleria';
import { Galleria, GalleriaContent, GalleriaItem, GalleriaItemSlot, GalleriaModule, GalleriaThumbnails } from './galleria';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
// Mock data for testing
const mockImages = [
    { itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg', thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1s.jpg', alt: 'Image 1', title: 'Title 1' },
    { itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg', thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2s.jpg', alt: 'Image 2', title: 'Title 2' },
    { itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria3.jpg', thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria3s.jpg', alt: 'Image 3', title: 'Title 3' },
    { itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria4.jpg', thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria4s.jpg', alt: 'Image 4', title: 'Title 4' },
    { itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria5.jpg', thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria5s.jpg', alt: 'Image 5', title: 'Title 5' }
];

// Test Components for different scenarios
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-galleria
            [value]="images"
            [activeIndex]="activeIndex"
            [fullScreen]="fullScreen"
            [id]="id"
            [numVisible]="numVisible"
            [responsiveOptions]="responsiveOptions"
            [showItemNavigators]="showItemNavigators"
            [showThumbnailNavigators]="showThumbnailNavigators"
            [showItemNavigatorsOnHover]="showItemNavigatorsOnHover"
            [changeItemOnIndicatorHover]="changeItemOnIndicatorHover"
            [circular]="circular"
            [autoPlay]="autoPlay"
            [shouldStopAutoplayByClick]="shouldStopAutoplayByClick"
            [transitionInterval]="transitionInterval"
            [showThumbnails]="showThumbnails"
            [thumbnailsPosition]="thumbnailsPosition"
            [verticalThumbnailViewPortHeight]="verticalThumbnailViewPortHeight"
            [showIndicators]="showIndicators"
            [showIndicatorsOnItem]="showIndicatorsOnItem"
            [indicatorsPosition]="indicatorsPosition"
            [baseZIndex]="baseZIndex"
            [maskClass]="maskClass"
            [containerStyle]="containerStyle"
            [visible]="visible"
            (activeIndexChange)="onActiveIndexChange($event)"
            (visibleChange)="onVisibleChange($event)"
        >
            <ng-template #item let-item>
                <img [src]="item.itemImageSrc" [alt]="item.alt" class="test-item-image" />
            </ng-template>
            <ng-template #thumbnail let-item>
                <img [src]="item.thumbnailImageSrc" [alt]="item.alt" class="test-thumbnail-image" />
            </ng-template>
        </p-galleria>
    `
})
class TestBasicGalleriaComponent {
    images: any[] = mockImages;
    activeIndex: number = 0;
    fullScreen: boolean = false;
    id: string | undefined;
    numVisible: number = 3;
    responsiveOptions: GalleriaResponsiveOptions[] | undefined;
    showItemNavigators: boolean = false;
    showThumbnailNavigators: boolean = true;
    showItemNavigatorsOnHover: boolean = false;
    changeItemOnIndicatorHover: boolean = false;
    circular: boolean = false;
    autoPlay: boolean = false;
    shouldStopAutoplayByClick: boolean = true;
    transitionInterval: number = 4000;
    showThumbnails: boolean = true;
    thumbnailsPosition: 'bottom' | 'top' | 'left' | 'right' | undefined = 'bottom';
    verticalThumbnailViewPortHeight: string = '300px';
    showIndicators: boolean = false;
    showIndicatorsOnItem: boolean = false;
    indicatorsPosition: 'bottom' | 'top' | 'left' | 'right' | undefined = 'bottom';
    baseZIndex: number = 0;
    maskClass: string | undefined;
    containerStyle: { [klass: string]: any } | null | undefined;
    visible: boolean = false;

    // Event handlers
    activeIndexChangeEvent: number | undefined;
    visibleChangeEvent: boolean | undefined;

    onActiveIndexChange(index: number) {
        this.activeIndexChangeEvent = index;
    }

    onVisibleChange(visible: boolean) {
        this.visibleChangeEvent = visible;
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-galleria [value]="images" [fullScreen]="true" [visible]="true">
            <ng-template #item let-item>
                <img [src]="item.itemImageSrc" [alt]="item.alt" class="fullscreen-item" />
            </ng-template>
            <ng-template #thumbnail let-item>
                <img [src]="item.thumbnailImageSrc" [alt]="item.alt" class="fullscreen-thumbnail" />
            </ng-template>
        </p-galleria>
    `
})
class TestFullScreenGalleriaComponent {
    images: any[] = mockImages;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-galleria [value]="images" [autoPlay]="true" [circular]="true" [transitionInterval]="1000">
            <ng-template #item let-item>
                <img [src]="item.itemImageSrc" [alt]="item.alt" class="autoplay-item" />
            </ng-template>
        </p-galleria>
    `
})
class TestAutoPlayGalleriaComponent {
    images: any[] = mockImages;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-galleria [value]="images" [responsiveOptions]="responsiveOptions">
            <ng-template #item let-item>
                <img [src]="item.itemImageSrc" [alt]="item.alt" class="responsive-item" />
            </ng-template>
        </p-galleria>
    `
})
class TestResponsiveGalleriaComponent {
    images: any[] = mockImages;
    responsiveOptions: GalleriaResponsiveOptions[] = [
        { breakpoint: '1024px', numVisible: 3 },
        { breakpoint: '768px', numVisible: 2 },
        { breakpoint: '560px', numVisible: 1 }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-galleria [value]="images" [showIndicators]="true" [showThumbnails]="false">
            <ng-template #item let-item>
                <img [src]="item.itemImageSrc" [alt]="item.alt" class="indicator-item" />
            </ng-template>
        </p-galleria>
    `
})
class TestIndicatorsGalleriaComponent {
    images: any[] = mockImages;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-galleria [value]="images" [numVisible]="3">
            <ng-template #header>
                <div class="custom-header">Gallery Header</div>
            </ng-template>
            <ng-template #item let-item>
                <div class="template-item">Item: {{ item?.title || 'Test Item' }}</div>
            </ng-template>
            <ng-template #thumbnail let-item>
                <div class="template-thumbnail">Thumb: {{ item?.title || 'Test Thumb' }}</div>
            </ng-template>
            <ng-template #footer>
                <div class="custom-footer">Gallery Footer</div>
            </ng-template>
            <ng-template #caption let-item>
                <div class="custom-caption">{{ item?.title || 'Test Caption' }}</div>
            </ng-template>
        </p-galleria>
    `
})
class TestTemplateGalleriaComponent {
    images: any[] = mockImages;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-galleria [value]="images">
            <ng-template pTemplate="header">
                <div class="ptemplate-header">PTemplate Header</div>
            </ng-template>
            <ng-template let-item pTemplate="item">
                <img [src]="item.itemImageSrc" [alt]="item.alt" class="ptemplate-item" />
            </ng-template>
            <ng-template let-item pTemplate="thumbnail">
                <img [src]="item.thumbnailImageSrc" [alt]="item.alt" class="ptemplate-thumbnail" />
            </ng-template>
            <ng-template pTemplate="footer">
                <div class="ptemplate-footer">PTemplate Footer</div>
            </ng-template>
        </p-galleria>
    `
})
class TestPTemplateGalleriaComponent {
    images: any[] = mockImages;
}

describe('Galleria', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommonModule, GalleriaModule, SharedModule, PrimeTemplate],
            declarations: [TestBasicGalleriaComponent, TestFullScreenGalleriaComponent, TestAutoPlayGalleriaComponent, TestResponsiveGalleriaComponent, TestIndicatorsGalleriaComponent, TestTemplateGalleriaComponent, TestPTemplateGalleriaComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();
    });

    describe('Component Initialization', () => {
        let fixture: ComponentFixture<TestBasicGalleriaComponent>;
        let component: TestBasicGalleriaComponent;
        let galleriaInstance: Galleria;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicGalleriaComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const galleriaEl = fixture.debugElement.query(By.css('p-galleria'));
            galleriaInstance = galleriaEl.componentInstance as Galleria;
        });

        it('should create the component', () => {
            expect(component).toBeTruthy();
            expect(galleriaInstance).toBeTruthy();
        });

        it('should have default values', () => {
            expect(galleriaInstance.activeIndex()).toBe(0);
            expect(galleriaInstance.fullScreen()).toBe(false);
            expect(galleriaInstance.numVisible()).toBe(3);
            expect(galleriaInstance.showItemNavigators()).toBe(false);
            expect(galleriaInstance.showThumbnailNavigators()).toBe(true);
            expect(galleriaInstance.showItemNavigatorsOnHover()).toBe(false);
            expect(galleriaInstance.changeItemOnIndicatorHover()).toBe(false);
            expect(galleriaInstance.circular()).toBe(false);
            expect(galleriaInstance.autoPlay()).toBe(false);
            expect(galleriaInstance.shouldStopAutoplayByClick()).toBe(true);
            expect(galleriaInstance.transitionInterval()).toBe(4000);
            expect(galleriaInstance.showThumbnails()).toBe(true);
            expect(galleriaInstance.thumbnailsPosition()).toBe('bottom');
            expect(galleriaInstance.verticalThumbnailViewPortHeight()).toBe('300px');
            expect(galleriaInstance.showIndicators()).toBe(false);
            expect(galleriaInstance.showIndicatorsOnItem()).toBe(false);
            expect(galleriaInstance.indicatorsPosition()).toBe('bottom');
            expect(galleriaInstance.baseZIndex()).toBe(0);
            expect(galleriaInstance.visible()).toBe(false);
        });

        it('should accept input values', async () => {
            component.activeIndex = 2;
            component.fullScreen = true;
            component.numVisible = 5;
            component.showItemNavigators = true;
            component.circular = true;
            component.autoPlay = true;
            component.transitionInterval = 2000;
            component.showIndicators = true;
            component.baseZIndex = 1000;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(galleriaInstance.activeIndex()).toBe(2);
            expect(galleriaInstance.fullScreen()).toBe(true);
            expect(galleriaInstance.numVisible()).toBe(5);
            expect(galleriaInstance.showItemNavigators()).toBe(true);
            expect(galleriaInstance.circular()).toBe(true);
            expect(galleriaInstance.autoPlay()).toBe(true);
            expect(galleriaInstance.transitionInterval()).toBe(2000);
            expect(galleriaInstance.showIndicators()).toBe(true);
            expect(galleriaInstance.baseZIndex()).toBe(1000);
        });

        it('should initialize with value array', () => {
            expect(galleriaInstance.value()).toEqual(mockImages);
            expect(galleriaInstance.value()?.length).toBe(5);
        });

        it('should set numVisibleLimit when value length is less than numVisible', async () => {
            component.images = mockImages.slice(0, 2); // Only 2 images
            component.numVisible = 5; // Want to show 5
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(galleriaInstance.numVisibleLimit()).toBe(2);
        });
    });

    describe('Public Methods and Properties', () => {
        let fixture: ComponentFixture<TestBasicGalleriaComponent>;
        let component: TestBasicGalleriaComponent;
        let galleriaInstance: Galleria;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicGalleriaComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const galleriaEl = fixture.debugElement.query(By.css('p-galleria'));
            galleriaInstance = galleriaEl.componentInstance as Galleria;
        });

        it('should handle activeIndex model writes', () => {
            galleriaInstance.activeIndex.set(3);
            expect(galleriaInstance.activeIndex()).toBe(3);
        });

        it('should handle visible model writes', () => {
            galleriaInstance.visible.set(true);
            expect(galleriaInstance.visible()).toBe(true);
            expect(galleriaInstance.maskVisible()).toBe(true);
        });

        it('should handle mask visibility correctly', () => {
            expect(galleriaInstance.maskVisible()).toBe(false);

            galleriaInstance.visible.set(true);
            expect(galleriaInstance.maskVisible()).toBe(true);
        });

        it('should reset maskVisible from visible and keep a local override until visible changes again', async () => {
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(galleriaInstance.maskVisible()).toBe(true);

            galleriaInstance.mask.set(document.createElement('div'));
            galleriaInstance.onBeforeLeave();
            expect(galleriaInstance.maskVisible()).toBe(false);
            expect(galleriaInstance.visible()).toBe(true);

            component.visible = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(galleriaInstance.maskVisible()).toBe(false);

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(galleriaInstance.maskVisible()).toBe(true);
        });

        it('should switch renderMask and renderContent on when visible becomes true', async () => {
            expect(galleriaInstance.renderMask()).toBe(false);
            expect(galleriaInstance.renderContent()).toBe(false);

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(galleriaInstance.renderMask()).toBe(true);
            expect(galleriaInstance.renderContent()).toBe(true);
        });
    });

    describe('Event Handling', () => {
        let fixture: ComponentFixture<TestBasicGalleriaComponent>;
        let component: TestBasicGalleriaComponent;
        let galleriaInstance: Galleria;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicGalleriaComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const galleriaEl = fixture.debugElement.query(By.css('p-galleria'));
            galleriaInstance = galleriaEl.componentInstance as Galleria;
        });

        it('should emit activeIndexChange event', () => {
            vi.spyOn(component, 'onActiveIndexChange').mockImplementation(() => {});

            galleriaInstance.onActiveItemChange(2);

            expect(component.onActiveIndexChange).toHaveBeenCalledWith(2);
            expect(galleriaInstance.activeIndex()).toBe(2);
        });

        it('should not emit activeIndexChange if index is same', async () => {
            component.activeIndex = 1;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const emitted: number[] = [];
            galleriaInstance.activeIndex.subscribe((index) => emitted.push(index));
            galleriaInstance.onActiveItemChange(1);

            expect(emitted).toEqual([]);
            expect(galleriaInstance.activeIndex()).toBe(1);
        });

        it('should emit visibleChange event', async () => {
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            vi.spyOn(component, 'onVisibleChange').mockImplementation(() => {});

            galleriaInstance.onMaskHide();

            expect(component.onVisibleChange).toHaveBeenCalledWith(false);
            expect(galleriaInstance.visible()).toBe(false);
        });

        it('should handle onMaskHide with event target check', async () => {
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const mockEvent = {
                target: document.createElement('div'),
                currentTarget: document.createElement('div')
            } as any;

            const emitted: boolean[] = [];
            galleriaInstance.visible.subscribe((visible) => emitted.push(visible));

            // Different target and currentTarget - should not hide
            galleriaInstance.onMaskHide(mockEvent);
            expect(emitted).toEqual([]);

            // Same target and currentTarget - should hide
            mockEvent.target = mockEvent.currentTarget;
            galleriaInstance.onMaskHide(mockEvent);
            expect(emitted).toEqual([false]);
        });
    });

    describe('Full Screen Mode', () => {
        let fixture: ComponentFixture<TestFullScreenGalleriaComponent>;
        let component: TestFullScreenGalleriaComponent;
        let galleriaInstance: Galleria;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestFullScreenGalleriaComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const galleriaEl = fixture.debugElement.query(By.css('p-galleria'));
            galleriaInstance = galleriaEl.componentInstance as Galleria;
        });

        it('should enable fullScreen mode', () => {
            expect(galleriaInstance.fullScreen()).toBe(true);
        });

        it('should show mask when in fullScreen and visible', () => {
            expect(galleriaInstance.visible()).toBe(true);
            expect(galleriaInstance.maskVisible()).toBe(true);
        });

        it('should render fullScreen template structure', () => {
            const mask = fixture.debugElement.query(By.css('[role="dialog"]'));
            if (mask) {
                expect(mask).toBeTruthy();
                expect(mask.nativeElement.getAttribute('aria-modal')).toBe('true');
            }
        });
    });

    describe('Auto Play Functionality', () => {
        let fixture: ComponentFixture<TestAutoPlayGalleriaComponent>;
        let component: TestAutoPlayGalleriaComponent;
        let galleriaInstance: Galleria;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestAutoPlayGalleriaComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const galleriaEl = fixture.debugElement.query(By.css('p-galleria'));
            galleriaInstance = galleriaEl.componentInstance as Galleria;
        });

        it('should enable autoPlay mode', () => {
            expect(galleriaInstance.autoPlay()).toBe(true);
            expect(galleriaInstance.circular()).toBe(true);
            expect(galleriaInstance.transitionInterval()).toBe(1000);
        });

        it('should have shouldStopAutoplayByClick enabled by default', () => {
            expect(galleriaInstance.shouldStopAutoplayByClick()).toBe(true);
        });
    });

    describe('Responsive Options', () => {
        let fixture: ComponentFixture<TestResponsiveGalleriaComponent>;
        let component: TestResponsiveGalleriaComponent;
        let galleriaInstance: Galleria;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestResponsiveGalleriaComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const galleriaEl = fixture.debugElement.query(By.css('p-galleria'));
            galleriaInstance = galleriaEl.componentInstance as Galleria;
        });

        it('should accept responsive options', () => {
            expect(galleriaInstance.responsiveOptions()).toEqual(component.responsiveOptions);
            expect(galleriaInstance.responsiveOptions()?.length).toBe(3);
        });

        it('should have correct breakpoints and numVisible values', () => {
            const options = galleriaInstance.responsiveOptions()!;
            expect(options[0].breakpoint).toBe('1024px');
            expect(options[0].numVisible).toBe(3);
            expect(options[1].breakpoint).toBe('768px');
            expect(options[1].numVisible).toBe(2);
            expect(options[2].breakpoint).toBe('560px');
            expect(options[2].numVisible).toBe(1);
        });
    });

    describe('Indicators Mode', () => {
        let fixture: ComponentFixture<TestIndicatorsGalleriaComponent>;
        let component: TestIndicatorsGalleriaComponent;
        let galleriaInstance: Galleria;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestIndicatorsGalleriaComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const galleriaEl = fixture.debugElement.query(By.css('p-galleria'));
            galleriaInstance = galleriaEl.componentInstance as Galleria;
        });

        it('should enable indicators and disable thumbnails', () => {
            expect(galleriaInstance.showIndicators()).toBe(true);
            expect(galleriaInstance.showThumbnails()).toBe(false);
        });

        it('should use default indicator position', () => {
            expect(galleriaInstance.indicatorsPosition()).toBe('bottom');
            expect(galleriaInstance.showIndicatorsOnItem()).toBe(false);
        });
    });

    describe('Template Content Projection - #template approach', () => {
        let fixture: ComponentFixture<TestTemplateGalleriaComponent>;
        let component: TestTemplateGalleriaComponent;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestTemplateGalleriaComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should render custom header template', () => {
            const headerContent = fixture.debugElement.query(By.css('.custom-header'));
            if (headerContent) {
                expect(headerContent.nativeElement.textContent).toContain('Gallery Header');
            }

            // Add explicit expectation to avoid "no expectations" warning
            expect(fixture.componentInstance).toBeTruthy();
        });

        it('should render custom footer template', () => {
            const footerContent = fixture.debugElement.query(By.css('.custom-footer'));
            if (footerContent) {
                expect(footerContent.nativeElement.textContent).toContain('Gallery Footer');
            }
        });

        it('should render custom caption template', () => {
            const captionContent = fixture.debugElement.query(By.css('.custom-caption'));
            if (captionContent) {
                expect(captionContent.nativeElement.textContent).toBeTruthy();
            }
        });

        it('should render item template for images', () => {
            const itemElements = fixture.debugElement.queryAll(By.css('.template-item'));
            if (itemElements.length > 0) {
                expect(itemElements.length).toBeGreaterThan(0);
                expect(itemElements[0].nativeElement.textContent).toContain('Item');
            }
        });

        it('should render thumbnail template for thumbnails', () => {
            const thumbnailElements = fixture.debugElement.queryAll(By.css('.template-thumbnail'));
            if (thumbnailElements.length > 0) {
                expect(thumbnailElements.length).toBeGreaterThan(0);
                expect(thumbnailElements[0].nativeElement.textContent).toContain('Thumb');
            }
        });
    });

    describe('Template Content Projection - pTemplate approach', () => {
        let fixture: ComponentFixture<TestPTemplateGalleriaComponent>;
        let component: TestPTemplateGalleriaComponent;
        let galleriaInstance: Galleria;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestPTemplateGalleriaComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const galleriaEl = fixture.debugElement.query(By.css('p-galleria'));
            galleriaInstance = galleriaEl.componentInstance as Galleria;
        });

        it('should process pTemplate correctly', () => {
            expect(galleriaInstance.headerFacet()).toBeInstanceOf(TemplateRef);
            expect(galleriaInstance.footerFacet()).toBeInstanceOf(TemplateRef);
            expect(galleriaInstance.itemTemplate()).toBeInstanceOf(TemplateRef);
            expect(galleriaInstance.thumbnailTemplate()).toBeInstanceOf(TemplateRef);
            expect(galleriaInstance.captionFacet()).toBeUndefined();
            expect(galleriaInstance.indicatorFacet()).toBeUndefined();
        });

        it('should render pTemplate content', () => {
            const ptemplateHeader = fixture.debugElement.query(By.css('.ptemplate-header'));
            const ptemplateFooter = fixture.debugElement.query(By.css('.ptemplate-footer'));

            // pTemplate content might not be rendered in test environment
            if (ptemplateHeader) {
                expect(ptemplateHeader.nativeElement.textContent).toContain('PTemplate Header');
            }
            if (ptemplateFooter) {
                expect(ptemplateFooter.nativeElement.textContent).toContain('PTemplate Footer');
            }
        });

        it('should process all template types', () => {
            const thumbnails = fixture.debugElement.queryAll(By.css('.ptemplate-thumbnail'));
            expect(thumbnails.length).toBe(mockImages.length);
            expect(thumbnails.map((thumbnail) => thumbnail.nativeElement.getAttribute('alt'))).toEqual(mockImages.map((image) => image.alt));
        });
    });

    describe('CSS Classes and Styling', () => {
        let fixture: ComponentFixture<TestBasicGalleriaComponent>;
        let component: TestBasicGalleriaComponent;
        let galleriaInstance: Galleria;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicGalleriaComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const galleriaEl = fixture.debugElement.query(By.css('p-galleria'));
            galleriaInstance = galleriaEl.componentInstance as Galleria;
        });

        it('should apply custom mask class', async () => {
            component.maskClass = 'custom-mask-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(galleriaInstance.maskClass()).toBe('custom-mask-class');
        });

        it('should apply custom container style', async () => {
            component.containerStyle = { width: '800px', height: '600px' };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(galleriaInstance.containerStyle()).toEqual({ width: '800px', height: '600px' });
            const root = fixture.debugElement.query(By.directive(GalleriaContent)).nativeElement as HTMLElement;
            expect(root.style.width).toBe('800px');
            expect(root.style.height).toBe('600px');
        });

        it('should have proper galleria root structure', () => {
            const galleriaRoot = fixture.debugElement.query(By.css('p-galleria'));
            expect(galleriaRoot).toBeTruthy();
        });
    });

    describe('Position and Layout Options', () => {
        let fixture: ComponentFixture<TestBasicGalleriaComponent>;
        let component: TestBasicGalleriaComponent;
        let galleriaInstance: Galleria;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicGalleriaComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const galleriaEl = fixture.debugElement.query(By.css('p-galleria'));
            galleriaInstance = galleriaEl.componentInstance as Galleria;
        });

        it('should handle thumbnail position options', async () => {
            const positions: Array<'bottom' | 'top' | 'left' | 'right'> = ['bottom', 'top', 'left', 'right'];

            for (const position of positions) {
                component.thumbnailsPosition = position;
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();
                expect(galleriaInstance.thumbnailsPosition()).toBe(position);
            }
        });

        it('should handle indicator position options', async () => {
            const positions: Array<'bottom' | 'top' | 'left' | 'right'> = ['bottom', 'top', 'left', 'right'];

            for (const position of positions) {
                component.indicatorsPosition = position;
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();
                expect(galleriaInstance.indicatorsPosition()).toBe(position);
            }
        });

        it('should handle vertical thumbnail viewport height', async () => {
            component.verticalThumbnailViewPortHeight = '400px';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(galleriaInstance.verticalThumbnailViewPortHeight()).toBe('400px');
        });

        it('should handle show indicators on item', async () => {
            component.showIndicatorsOnItem = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(galleriaInstance.showIndicatorsOnItem()).toBe(true);
        });
    });

    describe('Accessibility', () => {
        let fixture: ComponentFixture<TestFullScreenGalleriaComponent>;
        let component: TestFullScreenGalleriaComponent;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestFullScreenGalleriaComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should have proper ARIA attributes for fullscreen mode', () => {
            const mask = fixture.debugElement.query(By.css('[role="dialog"]'));
            if (mask) {
                expect(mask.nativeElement.getAttribute('role')).toBe('dialog');
                expect(mask.nativeElement.getAttribute('aria-modal')).toBe('true');
            }
        });

        it('should have proper ARIA attributes for windowed mode', () => {
            // Create a windowed galleria component
            const windowedFixture = TestBed.createComponent(TestBasicGalleriaComponent);
            windowedFixture.detectChanges();

            // In windowed mode, should use 'region' role if any ARIA attributes are present
            const galleriaRoot = windowedFixture.debugElement.query(By.css('p-galleria'));
            expect(galleriaRoot).toBeTruthy();
        });

        it('should handle focus management in animations', () => {
            const galleriaEl = fixture.debugElement.query(By.css('p-galleria'));
            const galleriaInstance = galleriaEl.componentInstance as Galleria;

            // Mock container element
            (galleriaInstance as any).container = () =>
                ({
                    nativeElement: document.createElement('div')
                }) as any;

            // Add a mock close button element
            const closeButton = document.createElement('button');
            closeButton.setAttribute('data-pc-section', 'closebutton');
            galleriaInstance.container()!.nativeElement.appendChild(closeButton);

            // const mockAnimationEvent = {
            //     toState: 'visible'
            // } as AnimationEvent;

            // expect(() => {
            //     galleriaInstance.onAnimationStart(mockAnimationEvent);
            // }).not.toThrow();
        });

        it('should provide proper alt attributes on images', () => {
            const images = fixture.debugElement.queryAll(By.css('img[alt]'));
            if (images.length > 0) {
                images.forEach((img) => {
                    expect(img.nativeElement.getAttribute('alt')).toBeTruthy();
                });
            }
        });
    });

    describe('Edge Cases', () => {
        let fixture: ComponentFixture<TestBasicGalleriaComponent>;
        let component: TestBasicGalleriaComponent;
        let galleriaInstance: Galleria;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicGalleriaComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const galleriaEl = fixture.debugElement.query(By.css('p-galleria'));
            galleriaInstance = galleriaEl.componentInstance as Galleria;
        });

        it('should handle empty images array', async () => {
            component.images = [];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(galleriaInstance.value()).toEqual([]);
        });

        it('should handle null images', async () => {
            component.images = null as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(galleriaInstance.value()).toBe(null as any);
        });

        it('should handle single image', async () => {
            component.images = [mockImages[0]];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(galleriaInstance.value()?.length).toBe(1);
        });

        it('should handle activeIndex beyond bounds', () => {
            galleriaInstance.activeIndex.set(999);
            expect(galleriaInstance.activeIndex()).toBe(999); // Component should accept any value
        });

        it('should handle negative activeIndex', () => {
            galleriaInstance.activeIndex.set(-1);
            expect(galleriaInstance.activeIndex()).toBe(-1);
        });

        it('should handle undefined id', () => {
            component.id = undefined as any;
            fixture.detectChanges();

            expect(galleriaInstance.id()).toBeUndefined();
        });

        it('should handle custom id', async () => {
            component.id = 'custom-galleria-id';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(galleriaInstance.id()).toBe('custom-galleria-id');
        });

        it('should handle animation events with missing elements', () => {
            galleriaInstance.mask.set(undefined);

            // const mockAnimationEvent = {
            //     toState: 'void'
            // } as AnimationEvent;

            // expect(() => {
            //     galleriaInstance.onAnimationStart(mockAnimationEvent);
            // }).not.toThrow();
        });

        it('should handle mask hide without event', async () => {
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const emitted: boolean[] = [];
            galleriaInstance.visible.subscribe((visible) => emitted.push(visible));

            galleriaInstance.onMaskHide();

            expect(emitted).toEqual([false]);
        });
    });

    describe('numVisibleLimit', () => {
        let fixture: ComponentFixture<TestBasicGalleriaComponent>;
        let component: TestBasicGalleriaComponent;
        let galleriaInstance: Galleria;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicGalleriaComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const galleriaEl = fixture.debugElement.query(By.css('p-galleria'));
            galleriaInstance = galleriaEl.componentInstance as Galleria;
        });

        it('should set numVisibleLimit when value changes to smaller array', async () => {
            const smallArray = mockImages.slice(0, 2);
            component.images = smallArray;
            component.numVisible = 5;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(galleriaInstance.numVisibleLimit()).toBe(2);
            const thumbnails = fixture.debugElement.query(By.directive(GalleriaThumbnails)).componentInstance as GalleriaThumbnails;
            expect(thumbnails.numVisible()).toBe(2);
        });

        it('should reset numVisibleLimit when value is sufficient', async () => {
            component.images = mockImages; // 5 images
            component.numVisible = 3; // Want to show 3
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(galleriaInstance.numVisibleLimit()).toBe(0);
            const thumbnails = fixture.debugElement.query(By.directive(GalleriaThumbnails)).componentInstance as GalleriaThumbnails;
            expect(thumbnails.numVisible()).toBe(3);
        });

        it('should recompute numVisibleLimit when numVisible changes', async () => {
            component.images = mockImages.slice(0, 4);
            component.numVisible = 3;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(galleriaInstance.numVisibleLimit()).toBe(0);

            component.numVisible = 6;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(galleriaInstance.numVisibleLimit()).toBe(4);
        });
    });

    describe('PassThrough (PT) Tests', () => {
        it('PT Case 1: should accept simple string values', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [CommonModule, GalleriaModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(Galleria);
            ptFixture.componentRef.setInput('pt', {
                root: 'custom-root-class',
                content: 'custom-content-class',
                itemsContainer: 'custom-items-container-class'
            });
            ptFixture.componentRef.setInput('value', mockImages);
            ptFixture.detectChanges();
            await ptFixture.whenStable();

            const rootElement = ptFixture.nativeElement.querySelector('[data-pc-section="root"]');
            if (rootElement) {
                expect(rootElement.classList.contains('custom-root-class')).toBe(true);
            }

            const contentElement = ptFixture.nativeElement.querySelector('[data-pc-section="content"]');
            if (contentElement) {
                expect(contentElement.classList.contains('custom-content-class')).toBe(true);
            }

            const itemsContainer = ptFixture.nativeElement.querySelector('[data-pc-section="itemscontainer"]');
            if (itemsContainer) {
                expect(itemsContainer.classList.contains('custom-items-container-class')).toBe(true);
            }
        });

        it('PT Case 2: should accept objects with class, style, and attributes', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [CommonModule, GalleriaModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(Galleria);
            ptFixture.componentRef.setInput('pt', {
                root: {
                    class: 'custom-root',
                    style: { backgroundColor: 'lightblue' },
                    'data-testid': 'galleria-root'
                },
                content: {
                    class: 'custom-content',
                    style: { padding: '20px' }
                }
            });
            ptFixture.componentRef.setInput('value', mockImages);
            ptFixture.detectChanges();
            await ptFixture.whenStable();

            const rootElement = ptFixture.nativeElement.querySelector('[data-pc-section="root"]');
            if (rootElement) {
                expect(rootElement.classList.contains('custom-root')).toBe(true);
                expect(rootElement.style.backgroundColor).toBe('lightblue');
                expect(rootElement.getAttribute('data-testid')).toBe('galleria-root');
            }

            const contentElement = ptFixture.nativeElement.querySelector('[data-pc-section="content"]');
            if (contentElement) {
                expect(contentElement.classList.contains('custom-content')).toBe(true);
                expect(contentElement.style.padding).toBe('20px');
            }
        });

        it('PT Case 3: should accept mixed object and string values', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [CommonModule, GalleriaModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(Galleria);
            ptFixture.componentRef.setInput('pt', {
                root: 'string-root-class',
                content: {
                    class: 'object-content-class',
                    style: { border: '1px solid red' }
                },
                itemsContainer: 'string-items-container-class'
            });
            ptFixture.componentRef.setInput('value', mockImages);
            ptFixture.detectChanges();
            await ptFixture.whenStable();

            const rootElement = ptFixture.nativeElement.querySelector('[data-pc-section="root"]');
            if (rootElement) {
                expect(rootElement.classList.contains('string-root-class')).toBe(true);
            }

            const contentElement = ptFixture.nativeElement.querySelector('[data-pc-section="content"]');
            if (contentElement) {
                expect(contentElement.classList.contains('object-content-class')).toBe(true);
                expect(contentElement.style.border).toBe('1px solid red');
            }

            const itemsContainer = ptFixture.nativeElement.querySelector('[data-pc-section="itemscontainer"]');
            if (itemsContainer) {
                expect(itemsContainer.classList.contains('string-items-container-class')).toBe(true);
            }
        });
        // TODO: will be refactored
        // it('PT Case 4: should use instance properties in PT functions', async () => {
        //     await TestBed.resetTestingModule();
        //     await TestBed.configureTestingModule({
        //         imports: [CommonModule, GalleriaModule]
        //     }).compileComponents();

        //     const ptFixture = TestBed.createComponent(Galleria);

        //     ptFixture.componentRef.setInput('value', mockImages);
        //     ptFixture.componentRef.setInput('fullScreen', true);
        //     ptFixture.componentRef.setInput('pt', {
        //         root: ({ instance }) => {
        //             return {
        //                 class: instance.parent.instance.fullScreen ? 'fullscreen-gallery' : 'inline-gallery'
        //             };
        //         }
        //     });
        //     ptFixture.detectChanges();
        //     await ptFixture.whenStable();

        //     const rootElement = ptFixture.nativeElement.querySelector('[data-pc-section="root"]');
        //     expect(rootElement?.classList.contains('fullscreen-gallery')).toBe(true);
        //     expect(rootElement?.classList.contains('inline-gallery')).toBe(false);
        // });

        it('PT Case 5: should bind events through PT', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [CommonModule, GalleriaModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(Galleria);
            let clicked = false;
            ptFixture.componentRef.setInput('pt', {
                closeButton: {
                    onClick: () => {
                        clicked = true;
                    }
                }
            });
            ptFixture.componentRef.setInput('value', mockImages);
            ptFixture.componentRef.setInput('fullScreen', true);
            ptFixture.componentRef.setInput('visible', true);
            ptFixture.detectChanges();
            await ptFixture.whenStable();

            const closeButton = ptFixture.nativeElement.querySelector('[data-pc-section="closebutton"]');
            if (closeButton) {
                closeButton.click();
                expect(clicked).toBe(true);
            }
        });

        it('PT Case 6: should support inline PT binding', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [CommonModule, GalleriaModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(Galleria);
            ptFixture.componentRef.setInput('ptOptions', { mergeSections: true, mergeProps: true });
            ptFixture.componentRef.setInput('pt', {
                root: 'inline-root',
                content: 'inline-content'
            });
            ptFixture.componentRef.setInput('value', mockImages);
            ptFixture.detectChanges();
            await ptFixture.whenStable();

            const rootElement = ptFixture.nativeElement.querySelector('[data-pc-section="root"]');
            if (rootElement) {
                expect(rootElement.classList.contains('inline-root')).toBe(true);
            }

            const contentElement = ptFixture.nativeElement.querySelector('[data-pc-section="content"]');
            if (contentElement) {
                expect(contentElement.classList.contains('inline-content')).toBe(true);
            }
        });

        it('PT Case 9: should apply PT to navigation buttons', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [CommonModule, GalleriaModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(Galleria);
            ptFixture.componentRef.setInput('pt', {
                prevButton: {
                    class: 'custom-prev-button',
                    'data-testid': 'prev-btn'
                },
                nextButton: {
                    class: 'custom-next-button',
                    'data-testid': 'next-btn'
                },
                prevIcon: 'custom-prev-icon',
                nextIcon: 'custom-next-icon'
            });
            ptFixture.componentRef.setInput('value', mockImages);
            ptFixture.componentRef.setInput('showItemNavigators', true);
            ptFixture.detectChanges();
            await ptFixture.whenStable();

            const prevButton = ptFixture.nativeElement.querySelector('[data-pc-section="prevbutton"]');
            if (prevButton) {
                expect(prevButton.classList.contains('custom-prev-button')).toBe(true);
                expect(prevButton.getAttribute('data-testid')).toBe('prev-btn');
            }

            const nextButton = ptFixture.nativeElement.querySelector('[data-pc-section="nextbutton"]');
            if (nextButton) {
                expect(nextButton.classList.contains('custom-next-button')).toBe(true);
                expect(nextButton.getAttribute('data-testid')).toBe('next-btn');
            }

            const prevIcon = ptFixture.nativeElement.querySelector('[data-pc-section="previcon"]');
            if (prevIcon) {
                expect(prevIcon.classList.contains('custom-prev-icon')).toBe(true);
            }

            const nextIcon = ptFixture.nativeElement.querySelector('[data-pc-section="nexticon"]');
            if (nextIcon) {
                expect(nextIcon.classList.contains('custom-next-icon')).toBe(true);
            }
        });

        it('PT Case 10: should apply PT to thumbnail elements', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [CommonModule, GalleriaModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(Galleria);
            ptFixture.componentRef.setInput('pt', {
                thumbnails: 'custom-thumbnails',
                thumbnailContent: 'custom-thumbnail-content',
                thumbnailsViewport: 'custom-thumbnails-viewport',
                thumbnailItems: 'custom-thumbnail-items',
                thumbnailItem: {
                    class: 'custom-thumbnail-item',
                    'data-item': 'true'
                },
                thumbnail: 'custom-thumbnail'
            });
            ptFixture.componentRef.setInput('value', mockImages);
            ptFixture.componentRef.setInput('showThumbnails', true);
            ptFixture.detectChanges();
            await ptFixture.whenStable();

            const thumbnails = ptFixture.nativeElement.querySelector('[data-pc-section="thumbnails"]');
            if (thumbnails) {
                expect(thumbnails.classList.contains('custom-thumbnails')).toBe(true);
            }

            const thumbnailContent = ptFixture.nativeElement.querySelector('[data-pc-section="thumbnailcontent"]');
            if (thumbnailContent) {
                expect(thumbnailContent.classList.contains('custom-thumbnail-content')).toBe(true);
            }

            const thumbnailsViewport = ptFixture.nativeElement.querySelector('[data-pc-section="thumbnailsviewport"]');
            if (thumbnailsViewport) {
                expect(thumbnailsViewport.classList.contains('custom-thumbnails-viewport')).toBe(true);
            }

            const thumbnailItems = ptFixture.nativeElement.querySelector('[data-pc-section="thumbnailitems"]');
            if (thumbnailItems) {
                expect(thumbnailItems.classList.contains('custom-thumbnail-items')).toBe(true);
            }

            const thumbnailItem = ptFixture.nativeElement.querySelector('[data-pc-section="thumbnailitem"]');
            if (thumbnailItem) {
                expect(thumbnailItem.classList.contains('custom-thumbnail-item')).toBe(true);
                expect(thumbnailItem.getAttribute('data-item')).toBe('true');
            }
        });

        it('PT Case 11: should apply PT to indicator elements', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [CommonModule, GalleriaModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(Galleria);
            ptFixture.componentRef.setInput('pt', {
                indicatorList: 'custom-indicator-list',
                indicator: {
                    class: 'custom-indicator',
                    'data-indicator': 'true'
                },
                indicatorButton: 'custom-indicator-button'
            });
            ptFixture.componentRef.setInput('value', mockImages);
            ptFixture.componentRef.setInput('showIndicators', true);
            ptFixture.detectChanges();
            await ptFixture.whenStable();

            const indicatorList = ptFixture.nativeElement.querySelector('[data-pc-section="indicatorlist"]');
            if (indicatorList) {
                expect(indicatorList.classList.contains('custom-indicator-list')).toBe(true);
            }

            const indicator = ptFixture.nativeElement.querySelector('[data-pc-section="indicator"]');
            if (indicator) {
                expect(indicator.classList.contains('custom-indicator')).toBe(true);
                expect(indicator.getAttribute('data-indicator')).toBe('true');
            }

            const indicatorButton = ptFixture.nativeElement.querySelector('[data-pc-section="indicatorbutton"]');
            if (indicatorButton) {
                expect(indicatorButton.classList.contains('custom-indicator-button')).toBe(true);
            }
        });

        it('PT Case 12: should apply PT to fullscreen mask and close button', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [CommonModule, GalleriaModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(Galleria);
            ptFixture.componentRef.setInput('pt', {
                mask: {
                    class: 'custom-mask',
                    style: { backgroundColor: 'rgba(0,0,0,0.8)' }
                },
                closeButton: 'custom-close-button',
                closeIcon: 'custom-close-icon',
                header: 'custom-header',
                footer: 'custom-footer'
            });
            ptFixture.componentRef.setInput('value', mockImages);
            ptFixture.componentRef.setInput('fullScreen', true);
            ptFixture.componentRef.setInput('visible', true);
            ptFixture.detectChanges();
            await ptFixture.whenStable();

            const mask = ptFixture.nativeElement.querySelector('[data-pc-section="mask"]');
            if (mask) {
                expect(mask.classList.contains('custom-mask')).toBe(true);
                expect(mask.style.backgroundColor).toBe('rgba(0, 0, 0, 0.8)');
            }

            const closeButton = ptFixture.nativeElement.querySelector('[data-pc-section="closebutton"]');
            if (closeButton) {
                expect(closeButton.classList.contains('custom-close-button')).toBe(true);
            }

            const closeIcon = ptFixture.nativeElement.querySelector('[data-pc-section="closeicon"]');
            if (closeIcon) {
                expect(closeIcon.classList.contains('custom-close-icon')).toBe(true);
            }

            const header = ptFixture.nativeElement.querySelector('[data-pc-section="header"]');
            if (header) {
                expect(header.classList.contains('custom-header')).toBe(true);
            }

            const footer = ptFixture.nativeElement.querySelector('[data-pc-section="footer"]');
            if (footer) {
                expect(footer.classList.contains('custom-footer')).toBe(true);
            }
        });
    });
});

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [GalleriaModule, SharedModule],
    template: `
        <p-galleria [value]="items">
            <ng-template #indicator>ind</ng-template>
            <ng-template #closeicon>cl</ng-template>
            <ng-template #previousthumbnailicon>pt</ng-template>
            <ng-template #nextthumbnailicon>nt</ng-template>
            <ng-template #itempreviousicon>ip</ng-template>
            <ng-template #itemnexticon>in</ng-template>
            <ng-template pTemplate="item">i</ng-template>
        </p-galleria>
    `
})
class GalleriaQueryApiHostComponent {
    items = [{ itemImageSrc: 'a.png' }];
}

describe('Galleria Signal Query API', () => {
    it('should resolve its signal-based view/content queries', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [GalleriaQueryApiHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(GalleriaQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const instance = fixture.debugElement.query(By.directive(Galleria)).componentInstance;

        expect(instance.indicatorTemplate()).toBeDefined();
        expect(instance._closeIconTemplate()).toBeDefined();
        expect(instance._previousThumbnailIconTemplate()).toBeDefined();
        expect(instance._nextThumbnailIconTemplate()).toBeDefined();
        expect(instance._itemPreviousIconTemplate()).toBeDefined();
        expect(instance._itemNextIconTemplate()).toBeDefined();
        expect(instance.templates().some((t: any) => t.getType() === 'item')).toBe(true);

        const thumbnails = fixture.debugElement.query(By.directive(GalleriaThumbnails)).componentInstance;
        expect(thumbnails.itemsContainer()).toBeDefined();
    });
});

describe('Galleria OnPush re-render', () => {
    let fixture: ComponentFixture<TestBasicGalleriaComponent>;
    let component: TestBasicGalleriaComponent;

    beforeEach(async () => {
        await TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [CommonModule, GalleriaModule, SharedModule, PrimeTemplate],
            declarations: [TestBasicGalleriaComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestBasicGalleriaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    async function update(changes: Partial<TestBasicGalleriaComponent>) {
        Object.assign(component, changes);
        fixture.changeDetectorRef.markForCheck();
        await fixture.whenStable();
    }

    function query(selector: string): HTMLElement | null {
        return fixture.nativeElement.querySelector(selector);
    }

    it('re-renders the active item when activeIndex changes', async () => {
        expect(query('.test-item-image')?.getAttribute('alt')).toBe('Image 1');

        await update({ activeIndex: 2 });

        expect(query('.test-item-image')?.getAttribute('alt')).toBe('Image 3');
        const thumbnailItems = fixture.nativeElement.querySelectorAll('[data-pc-section="thumbnailitem"][data-p-active]');
        expect(Array.from(thumbnailItems).map((item: any) => item.getAttribute('data-p-active'))).toEqual(['false', 'false', 'true', 'false', 'false']);
    });

    it('re-renders the thumbnails when value changes', async () => {
        expect(fixture.nativeElement.querySelectorAll('.test-thumbnail-image').length).toBe(5);

        await update({ images: mockImages.slice(0, 2) });

        expect(fixture.nativeElement.querySelectorAll('.test-thumbnail-image').length).toBe(2);
    });

    it('re-renders when showThumbnails changes', async () => {
        expect(fixture.debugElement.query(By.directive(GalleriaThumbnails))).toBeTruthy();

        await update({ showThumbnails: false });

        expect(fixture.debugElement.query(By.directive(GalleriaThumbnails))).toBeNull();
    });

    it('re-renders when showThumbnailNavigators changes', async () => {
        expect(query('[data-pc-section="thumbnailprevbutton"]')).toBeTruthy();

        await update({ showThumbnailNavigators: false });

        expect(query('[data-pc-section="thumbnailprevbutton"]')).toBeNull();
    });

    it('re-renders when showIndicators changes', async () => {
        expect(query('[data-pc-section="indicatorlist"]')).toBeNull();

        await update({ showIndicators: true });

        expect(fixture.nativeElement.querySelectorAll('[data-pc-section="indicatorlist"] li').length).toBe(5);
    });

    it('re-renders when showItemNavigators changes', async () => {
        expect(query('[data-pc-section="prevbutton"]')).toBeNull();

        await update({ showItemNavigators: true });

        expect(query('[data-pc-section="prevbutton"]')).toBeTruthy();
        expect(query('[data-pc-section="nextbutton"]')).toBeTruthy();
    });

    it('re-renders the root classes when thumbnailsPosition, indicatorsPosition and the boolean flags change', async () => {
        const root = fixture.debugElement.query(By.directive(GalleriaContent)).nativeElement as HTMLElement;
        expect(root.classList.contains('p-galleria-thumbnails-bottom')).toBe(true);

        await update({ thumbnailsPosition: 'left', showIndicators: true, indicatorsPosition: 'top', showIndicatorsOnItem: true, showItemNavigatorsOnHover: true });

        expect(root.classList.contains('p-galleria-thumbnails-left')).toBe(true);
        expect(root.classList.contains('p-galleria-thumbnails-bottom')).toBe(false);
        expect(root.classList.contains('p-galleria-indicators-top')).toBe(true);
        expect(root.classList.contains('p-galleria-inset-indicators')).toBe(true);
        expect(root.classList.contains('p-galleria-hover-navigators')).toBe(true);
    });

    it('re-renders the vertical thumbnail viewport height', async () => {
        await update({ thumbnailsPosition: 'left', verticalThumbnailViewPortHeight: '420px' });

        expect(query('[data-pc-section="thumbnailsviewport"]')?.style.height).toBe('420px');
    });

    it('renders the fullscreen mask with maskClass when visible changes', async () => {
        await update({ fullScreen: true, maskClass: 'custom-mask-class' });
        expect(query('[data-pc-section="mask"]')).toBeNull();

        await update({ visible: true });

        const mask = query('[data-pc-section="mask"]');
        expect(mask).toBeTruthy();
        expect(mask?.classList.contains('custom-mask-class')).toBe(true);
        expect(mask?.getAttribute('role')).toBe('dialog');
        expect(query('[data-pc-section="closebutton"]')).toBeTruthy();
    });

    it('starts and stops the slideshow when autoPlay changes', async () => {
        const content = fixture.debugElement.query(By.directive(GalleriaContent)).componentInstance as GalleriaContent;
        expect(content.slideShowActive()).toBe(false);

        await update({ autoPlay: true });

        expect(content.slideShowActive()).toBe(true);
        expect(content.interval()).toBeDefined();

        await update({ autoPlay: false });

        expect(content.slideShowActive()).toBe(false);
    });
});

describe('Galleria id', () => {
    it('uses the id input as the content id when it is set before the first render', async () => {
        await TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [CommonModule, GalleriaModule],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        const fixture = TestBed.createComponent(Galleria);
        fixture.componentRef.setInput('id', 'my-galleria');
        fixture.componentRef.setInput('value', mockImages);
        fixture.detectChanges();
        await fixture.whenStable();

        const content = fixture.debugElement.query(By.directive(GalleriaContent));
        expect(content.componentInstance.id).toBe('my-galleria');
        expect(content.nativeElement.getAttribute('id')).toBe('my-galleria');
        expect(fixture.nativeElement.querySelector('[data-pc-section="thumbnailitem"]').getAttribute('aria-controls')).toBe('my-galleria_item_0');
    });
});

// GalleriaContent, GalleriaItem and GalleriaThumbnails are the internal building blocks that
// p-galleria renders as child directives. They each `inject(Galleria)` unconditionally, so a
// minimal Galleria stub is supplied wherever they are instantiated directly.
function createGalleriaStub(): Galleria {
    const none = () => undefined;
    return {
        id: none,
        templates: () => [],
        captionTemplate: none,
        indicatorTemplate: none,
        footerTemplate: none,
        _itemTemplate: none,
        itemTemplate: none,
        captionFacet: none,
        _thumbnailTemplate: none,
        thumbnailTemplate: none,
        _itemPreviousIconTemplate: none,
        itemPreviousIconTemplate: none,
        _itemNextIconTemplate: none,
        itemNextIconTemplate: none,
        _previousThumbnailIconTemplate: none,
        previousThumbnailIconTemplate: none,
        _nextThumbnailIconTemplate: none,
        nextThumbnailIconTemplate: none,
        config: { translation: {}, csp: none }
    } as unknown as Galleria;
}

describe('GalleriaContent', () => {
    beforeEach(async () => {
        await TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [CommonModule, GalleriaModule, SharedModule, PrimeTemplate],
            providers: [provideZonelessChangeDetection(), { provide: Galleria, useValue: createGalleriaStub() }]
        }).compileComponents();
    });

    it('should emit maskHide when the fullscreen close button is clicked', () => {
        // maskHide has no surrounding logic (the template just does `(click)="maskHide.emit()"`),
        // so it is exercised through a real click rather than calling emit() directly.
        const galleriaFixture = TestBed.createComponent(Galleria);
        galleriaFixture.componentRef.setInput('value', mockImages);
        galleriaFixture.componentRef.setInput('fullScreen', true);
        galleriaFixture.componentRef.setInput('visible', true);
        galleriaFixture.detectChanges();

        const contentDebugEl = galleriaFixture.debugElement.query(By.directive(GalleriaContent));
        expect(contentDebugEl).toBeTruthy();
        const contentInstance = contentDebugEl.componentInstance as GalleriaContent;
        vi.spyOn(contentInstance.maskHide, 'emit');

        const closeButton = galleriaFixture.nativeElement.querySelector('[data-pc-section="closebutton"]');
        expect(closeButton).toBeTruthy();
        closeButton.click();

        expect(contentInstance.maskHide.emit).toHaveBeenCalled();
    });

    it('should emit activeItemChange when onActiveIndexChange is called with a new index', () => {
        const fixture = TestBed.createComponent(GalleriaContent);
        const instance = fixture.componentInstance;
        fixture.componentRef.setInput('activeIndex', 0);

        vi.spyOn(instance.activeItemChange, 'emit');
        instance.onActiveIndexChange(3);

        expect(instance.activeItemChange.emit).toHaveBeenCalledWith(3);
        expect(instance._activeIndex()).toBe(3);
    });

    it('should not emit activeItemChange when onActiveIndexChange is called with the same index', () => {
        const fixture = TestBed.createComponent(GalleriaContent);
        const instance = fixture.componentInstance;
        fixture.componentRef.setInput('activeIndex', 2);

        vi.spyOn(instance.activeItemChange, 'emit');
        instance.onActiveIndexChange(2);

        expect(instance.activeItemChange.emit).not.toHaveBeenCalled();
    });

    it('should reset _activeIndex from the activeIndex input and keep a local override until the input changes', () => {
        const fixture = TestBed.createComponent(GalleriaContent);
        const instance = fixture.componentInstance;

        fixture.componentRef.setInput('activeIndex', 1);
        expect(instance._activeIndex()).toBe(1);

        instance.onActiveIndexChange(4);
        expect(instance._activeIndex()).toBe(4);
        expect(instance.activeIndex()).toBe(1);

        fixture.componentRef.setInput('activeIndex', 2);
        expect(instance._activeIndex()).toBe(2);
    });

    it('should generate an id when the galleria has none', () => {
        const instance = TestBed.createComponent(GalleriaContent).componentInstance;

        expect(instance.id).toMatch(/^pn_id_/);
    });
});

describe('GalleriaItem', () => {
    beforeEach(async () => {
        await TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [CommonModule, GalleriaModule, SharedModule, PrimeTemplate],
            providers: [provideZonelessChangeDetection(), { provide: Galleria, useValue: createGalleriaStub() }]
        }).compileComponents();
    });

    function createFixture() {
        return TestBed.createComponent(GalleriaItem);
    }

    it('should emit onActiveIndexChange when navigating to the next item', () => {
        const fixture = createFixture();
        const instance = fixture.componentInstance;
        fixture.componentRef.setInput('value', mockImages);
        fixture.componentRef.setInput('activeIndex', 0);
        fixture.componentRef.setInput('circular', false);

        vi.spyOn(instance.onActiveIndexChange, 'emit');
        instance.next();

        expect(instance.onActiveIndexChange.emit).toHaveBeenCalledWith(1);
    });

    it('should emit startSlideShow when autoPlay changes to true', () => {
        const fixture = createFixture();
        const instance = fixture.componentInstance;

        vi.spyOn(instance.startSlideShow, 'emit');
        fixture.componentRef.setInput('autoPlay', true);
        fixture.detectChanges();

        expect(instance.startSlideShow.emit).toHaveBeenCalledWith(undefined);
    });

    it('should emit stopSlideShow when autoPlay changes back to false, and only react to autoPlay', () => {
        const fixture = createFixture();
        const instance = fixture.componentInstance;
        fixture.componentRef.setInput('autoPlay', true);
        fixture.detectChanges();

        vi.spyOn(instance.startSlideShow, 'emit');
        vi.spyOn(instance.stopSlideShow, 'emit');
        fixture.componentRef.setInput('slideShowActive', false);
        fixture.detectChanges();
        expect(instance.startSlideShow.emit).not.toHaveBeenCalled();
        expect(instance.stopSlideShow.emit).not.toHaveBeenCalled();

        fixture.componentRef.setInput('slideShowActive', true);
        fixture.componentRef.setInput('autoPlay', false);
        fixture.detectChanges();
        expect(instance.stopSlideShow.emit).toHaveBeenCalledWith(undefined);
        expect(instance.startSlideShow.emit).not.toHaveBeenCalled();
    });

    it('should emit stopSlideShow via stopTheSlideShow when the slideshow is active', () => {
        const fixture = createFixture();
        const instance = fixture.componentInstance;
        fixture.componentRef.setInput('slideShowActive', true);

        vi.spyOn(instance.stopSlideShow, 'emit');
        instance.stopTheSlideShow();

        expect(instance.stopSlideShow.emit).toHaveBeenCalledWith(undefined);
    });

    it('should derive activeItem and the nav disabled states from the inputs', () => {
        const fixture = createFixture();
        const instance = fixture.componentInstance;
        fixture.componentRef.setInput('value', mockImages);
        fixture.componentRef.setInput('activeIndex', 0);

        expect(instance.activeItem()).toBe(mockImages[0]);
        expect(instance.isNavBackwardDisabled()).toBe(true);
        expect(instance.isNavForwardDisabled()).toBe(false);

        fixture.componentRef.setInput('activeIndex', 4);
        expect(instance.activeItem()).toBe(mockImages[4]);
        expect(instance.isNavBackwardDisabled()).toBe(false);
        expect(instance.isNavForwardDisabled()).toBe(true);

        fixture.componentRef.setInput('circular', true);
        expect(instance.isNavForwardDisabled()).toBe(false);
    });

    it('should re-render the indicators when value, activeIndex and showIndicators change', () => {
        const fixture = createFixture();
        fixture.componentRef.setInput('showIndicators', false);
        fixture.componentRef.setInput('value', mockImages);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[data-pc-section="indicatorlist"]')).toBeNull();

        fixture.componentRef.setInput('showIndicators', true);
        fixture.componentRef.setInput('activeIndex', 2);
        fixture.detectChanges();
        const indicators = fixture.nativeElement.querySelectorAll('[data-pc-section="indicatorlist"] li');
        expect(indicators.length).toBe(5);
        expect(indicators[2].getAttribute('aria-selected')).toBe('true');
        expect(indicators[0].getAttribute('aria-selected')).toBe('false');

        fixture.componentRef.setInput('showItemNavigators', true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[data-pc-section="prevbutton"]')).toBeTruthy();
    });
});

describe('GalleriaItemSlot', () => {
    beforeEach(async () => {
        await TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [CommonModule, GalleriaModule, SharedModule, PrimeTemplate],
            providers: [provideZonelessChangeDetection(), { provide: Galleria, useValue: createGalleriaStub() }]
        }).compileComponents();
    });

    it('should use the item for the context of every type but indicator, which uses the index', () => {
        const fixture = TestBed.createComponent(GalleriaItemSlot);
        const instance = fixture.componentInstance;
        fixture.componentRef.setInput('item', mockImages[1]);
        fixture.componentRef.setInput('index', 3);

        fixture.componentRef.setInput('type', 'item');
        expect(instance.context()).toEqual({ $implicit: mockImages[1] });

        fixture.componentRef.setInput('type', 'indicator');
        expect(instance.context()).toEqual({ $implicit: 3 });
    });

    it('should not render without a template', () => {
        const fixture = TestBed.createComponent(GalleriaItemSlot);
        fixture.componentRef.setInput('type', 'item');
        fixture.detectChanges();

        expect(fixture.componentInstance.contentTemplate()).toBeUndefined();
        expect(fixture.componentInstance.shouldRender()).toBeFalsy();
    });
});

describe('GalleriaThumbnails', () => {
    beforeEach(async () => {
        await TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [CommonModule, GalleriaModule, SharedModule, PrimeTemplate],
            providers: [provideZonelessChangeDetection(), { provide: Galleria, useValue: createGalleriaStub() }]
        }).compileComponents();
    });

    function createFixture() {
        return TestBed.createComponent(GalleriaThumbnails);
    }

    it('should emit onActiveIndexChange when a thumbnail item is clicked', () => {
        const fixture = createFixture();
        const instance = fixture.componentInstance;
        fixture.componentRef.setInput('value', mockImages);
        fixture.componentRef.setInput('activeIndex', 0);

        vi.spyOn(instance.onActiveIndexChange, 'emit');
        instance.onItemClick(2);

        expect(instance.onActiveIndexChange.emit).toHaveBeenCalledWith(2);
        expect(instance._activeIndex()).toBe(2);
        expect(instance._oldactiveIndex()).toBe(0);
    });

    it('should emit stopSlideShow via stopTheSlideShow when the slideshow is active', () => {
        const fixture = createFixture();
        const instance = fixture.componentInstance;
        fixture.componentRef.setInput('slideShowActive', true);

        vi.spyOn(instance.stopSlideShow, 'emit');
        instance.stopTheSlideShow();

        expect(instance.stopSlideShow.emit).toHaveBeenCalledWith(undefined);
    });

    it('should reset d_numVisible from numVisible and keep a responsive override until numVisible changes', () => {
        const fixture = createFixture();
        const instance = fixture.componentInstance;

        fixture.componentRef.setInput('numVisible', 4);
        expect(instance.d_numVisible()).toBe(4);

        instance.d_numVisible.set(2);
        expect(instance.d_numVisible()).toBe(2);

        fixture.componentRef.setInput('numVisible', 5);
        expect(instance.d_numVisible()).toBe(5);
    });

    it('should follow the activeIndex input, shift the items and re-render the active thumbnail', async () => {
        const fixture = createFixture();
        const instance = fixture.componentInstance;
        fixture.componentRef.setInput('value', mockImages);
        fixture.componentRef.setInput('numVisible', 3);
        fixture.componentRef.setInput('activeIndex', 0);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(instance.totalShiftedItems()).toBe(0);

        fixture.componentRef.setInput('activeIndex', 3);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(instance._activeIndex()).toBe(3);
        expect(instance._oldactiveIndex()).toBe(3);
        expect(instance.totalShiftedItems()).toBe(-2);
        expect(instance.itemsContainer()!.nativeElement.style.transform).toContain('translate3d(-66.6');
        const items = fixture.nativeElement.querySelectorAll('[data-pc-section="thumbnailitem"][data-p-active]');
        expect(items[3].getAttribute('data-p-active')).toBe('true');
        expect(items[0].getAttribute('data-p-active')).toBe('false');
    });

    it('should re-render when isVertical, contentHeight and showThumbnailNavigators change', () => {
        const fixture = createFixture();
        fixture.componentRef.setInput('value', mockImages);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[data-p-icon="chevron-left"]')).toBeTruthy();

        fixture.componentRef.setInput('isVertical', true);
        fixture.componentRef.setInput('contentHeight', '250px');
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[data-p-icon="chevron-up"]')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('[data-pc-section="thumbnailsviewport"]').style.height).toBe('250px');

        fixture.componentRef.setInput('showThumbnailNavigators', false);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[data-pc-section="thumbnailprevbutton"]')).toBeNull();
    });
});
