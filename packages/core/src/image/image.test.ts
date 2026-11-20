import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SharedModule } from '@exhaustive-ui/core/api';
import { Image, ImageModule } from './image';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
// Using image paths from photoservice.ts to ensure consistency
const mockImageSrc = 'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg';
const mockPreviewImageSrc = 'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-image [src]="src" [alt]="alt" [width]="width" [height]="height" [srcSet]="srcSet" [sizes]="sizes" [loading]="loading" [imageClass]="imageClass" [imageStyle]="imageStyle" [class]="styleClass" (onImageError)="onImageError($event)">
        </p-image>
    `
})
class TestBasicImageComponent {
    src: string = mockImageSrc;
    alt: string = 'Test Image';
    width: string = '250';
    height: string = '200';
    srcSet: string = '';
    sizes: string = '';
    loading: 'lazy' | 'eager' | undefined = 'lazy';
    imageClass: string = 'test-image-class';
    imageStyle: any = { border: '1px solid red' };
    styleClass: string = 'test-style-class';
    imageErrorEvent: Event | null = null as any;

    onImageError(event: Event) {
        this.imageErrorEvent = event;
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-image [src]="src" [alt]="alt" [width]="width" [preview]="true" [previewImageSrc]="previewImageSrc" [previewImageSrcSet]="previewImageSrcSet" [previewImageSizes]="previewImageSizes" (onShow)="onShow($event)" (onHide)="onHide($event)">
        </p-image>
    `
})
class TestPreviewImageComponent {
    src: string = mockImageSrc;
    alt: string = 'Preview Test Image';
    width: string = '250';
    previewImageSrc: string = mockPreviewImageSrc;
    previewImageSrcSet: string = '';
    previewImageSizes: string = '';
    showEvent: any = null as any;
    hideEvent: any = null as any;

    onShow(event: any) {
        this.showEvent = event;
    }

    onHide(event: any) {
        this.hideEvent = event;
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-image [src]="src" [alt]="alt" [width]="width" [preview]="true">
            <ng-template #indicator>
                <i class="pi pi-search custom-indicator"></i>
            </ng-template>
            <ng-template #image>
                <img [src]="src" [alt]="alt" class="custom-image" />
            </ng-template>
            <ng-template #preview let-style="style" let-previewCallback="previewCallback">
                <img [src]="previewImageSrc" [alt]="alt" [style]="style" (click)="previewCallback()" class="custom-preview" />
            </ng-template>
            <ng-template #rotaterighticon>
                <i class="pi pi-refresh custom-rotate-right"></i>
            </ng-template>
            <ng-template #rotatelefticon>
                <i class="pi pi-undo custom-rotate-left"></i>
            </ng-template>
            <ng-template #zoomouticon>
                <i class="pi pi-minus custom-zoom-out"></i>
            </ng-template>
            <ng-template #zoominicon>
                <i class="pi pi-plus custom-zoom-in"></i>
            </ng-template>
            <ng-template #closeicon>
                <i class="pi pi-times custom-close"></i>
            </ng-template>
        </p-image>
    `
})
class TestTemplateImageComponent {
    src: string = mockImageSrc;
    alt: string = 'Template Test Image';
    width: string = '250';
    previewImageSrc: string = mockPreviewImageSrc;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-image [src]="src" [alt]="alt" [width]="width" [preview]="true">
            <ng-template pTemplate="indicator">
                <i class="pi pi-eye ptemplate-indicator"></i>
            </ng-template>
            <ng-template pTemplate="image">
                <img [src]="src" [alt]="alt" class="ptemplate-image" />
            </ng-template>
            <ng-template pTemplate="preview" let-style="style" let-previewCallback="previewCallback">
                <img [src]="previewImageSrc" [alt]="alt" [style]="style" (click)="previewCallback()" class="ptemplate-preview" />
            </ng-template>
            <ng-template pTemplate="rotaterighticon">
                <i class="pi pi-refresh ptemplate-rotate-right"></i>
            </ng-template>
            <ng-template pTemplate="rotatelefticon">
                <i class="pi pi-undo ptemplate-rotate-left"></i>
            </ng-template>
            <ng-template pTemplate="zoomouticon">
                <i class="pi pi-minus ptemplate-zoom-out"></i>
            </ng-template>
            <ng-template pTemplate="zoominicon">
                <i class="pi pi-plus ptemplate-zoom-in"></i>
            </ng-template>
            <ng-template pTemplate="closeicon">
                <i class="pi pi-times ptemplate-close"></i>
            </ng-template>
        </p-image>
    `
})
class TestPTemplateImageComponent {
    src: string = mockImageSrc;
    alt: string = 'PTemplate Test Image';
    width: string = '250';
    previewImageSrc: string = mockPreviewImageSrc;
}

describe('Image', () => {
    let component: Image;
    let fixture: ComponentFixture<Image>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImageModule, SharedModule],
            declarations: [TestBasicImageComponent, TestPreviewImageComponent, TestTemplateImageComponent, TestPTemplateImageComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(Image);
        component = fixture.componentInstance;
    });

    describe('Component Initialization', () => {
        it('should create the component', () => {
            expect(component).toBeTruthy();
        });

        it('should have default values', () => {
            expect(component.preview()).toBe(false);
            expect(component.maskVisible()).toBe(false);
            expect(component.previewVisible()).toBe(false);
            expect(component.rotate()).toBe(0);
            expect(component.scale()).toBe(1);
            expect(component.previewClick()).toBe(false);
            expect(component.renderMask()).toBe(false);
            expect(component.renderPreview()).toBe(false);
            expect(component.appendTo()).toBeUndefined();
            expect(component.motionOptions()).toBeUndefined();
            expect(component.maskMotionOptions()).toBeUndefined();
        });

        it('should accept custom input values', () => {
            const testFixture = TestBed.createComponent(TestBasicImageComponent);
            const testComponent = testFixture.componentInstance;
            testFixture.detectChanges();

            const imageElement = testFixture.debugElement.query(By.css('img'));
            expect(imageElement.nativeElement.src).toContain(mockImageSrc);
            expect(imageElement.nativeElement.alt).toBe('Test Image');
            expect(imageElement.nativeElement.width).toBeGreaterThan(240);
            expect(imageElement.nativeElement.height).toBeGreaterThan(190);
        });

        it('should render image element with proper attributes', () => {
            fixture.componentRef.setInput('src', mockImageSrc);
            fixture.componentRef.setInput('alt', 'Test Image');
            fixture.componentRef.setInput('width', '300');
            fixture.componentRef.setInput('height', '200');
            fixture.detectChanges();

            const imageElement = fixture.debugElement.query(By.css('img'));
            expect(imageElement).toBeTruthy();
            expect(imageElement.nativeElement.src).toContain(mockImageSrc);
            expect(imageElement.nativeElement.alt).toBe('Test Image');
            expect(imageElement.nativeElement.width).toBe(300);
            expect(imageElement.nativeElement.height).toBe(200);
        });
    });

    describe('Preview Functionality', () => {
        let testFixture: ComponentFixture<TestPreviewImageComponent>;
        let testComponent: TestPreviewImageComponent;
        let imageInstance: Image;

        beforeEach(() => {
            testFixture = TestBed.createComponent(TestPreviewImageComponent);
            testComponent = testFixture.componentInstance;
            testFixture.detectChanges();
            imageInstance = testFixture.debugElement.query(By.directive(Image)).componentInstance;
        });

        it('should render preview button when preview is enabled', () => {
            const previewButton = testFixture.debugElement.query(By.css('button'));
            expect(previewButton).toBeTruthy();
            expect(previewButton.nativeElement.getAttribute('aria-label')).toBeTruthy();
        });

        it('should open preview on button click', async () => {
            const previewButton = testFixture.debugElement.query(By.css('button'));
            previewButton.nativeElement.click();
            await testFixture.whenStable();

            expect(imageInstance.maskVisible()).toBe(true);
            expect(imageInstance.previewVisible()).toBe(true);
        });

        it('should show mask overlay when preview is opened', async () => {
            imageInstance.onImageClick();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const maskElement = testFixture.debugElement.query(By.css('.p-image-mask, [class*="mask"]'));
            expect(maskElement).toBeTruthy();
        });

        it('should give the preview dialog an accessible name', async () => {
            imageInstance.onImageClick();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const dialog = document.querySelector('.p-image-mask[role="dialog"]') as HTMLElement;
            expect(dialog).toBeTruthy();
            expect(dialog.getAttribute('aria-label')).toBe('Preview Test Image');
        });

        it('should close preview when clicking outside', async () => {
            imageInstance.onImageClick();
            await testFixture.whenStable();
            testFixture.detectChanges();

            imageInstance.onMaskClick();
            expect(imageInstance.previewVisible()).toBe(false);
        });

        it('should close preview on Escape key', async () => {
            imageInstance.onImageClick();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const escapeEvent = new KeyboardEvent('keydown', { code: 'Escape' });
            imageInstance.onMaskKeydown(escapeEvent);
            expect(imageInstance.previewVisible()).toBe(false);
        });
    });

    describe('Image Transformation', () => {
        let testFixture: ComponentFixture<TestPreviewImageComponent>;
        let imageInstance: Image;

        beforeEach(() => {
            testFixture = TestBed.createComponent(TestPreviewImageComponent);
            testFixture.detectChanges();
            imageInstance = testFixture.debugElement.query(By.directive(Image)).componentInstance;
        });

        it('should rotate right', () => {
            const initialRotate = imageInstance.rotate();
            imageInstance.rotateRight();
            expect(imageInstance.rotate()).toBe(initialRotate + 90);
            expect(imageInstance.previewClick()).toBe(true);
        });

        it('should rotate left', () => {
            const initialRotate = imageInstance.rotate();
            imageInstance.rotateLeft();
            expect(imageInstance.rotate()).toBe(initialRotate - 90);
            expect(imageInstance.previewClick()).toBe(true);
        });

        it('should zoom in', () => {
            const initialScale = imageInstance.scale();
            imageInstance.zoomIn();
            expect(imageInstance.scale()).toBe(initialScale + 0.1);
            expect(imageInstance.previewClick()).toBe(true);
        });

        it('should zoom out', () => {
            const initialScale = imageInstance.scale();
            imageInstance.zoomOut();
            expect(imageInstance.scale()).toBe(initialScale - 0.1);
            expect(imageInstance.previewClick()).toBe(true);
        });

        it('should disable zoom out at minimum scale', () => {
            imageInstance.scale.set(0.5); // minimum scale
            expect(imageInstance.isZoomOutDisabled()).toBe(true);
        });

        it('should disable zoom in at maximum scale', () => {
            imageInstance.scale.set(1.5); // maximum scale
            expect(imageInstance.isZoomInDisabled()).toBe(true);
        });

        it('should calculate image preview style correctly', () => {
            imageInstance.rotate.set(90);
            imageInstance.scale.set(1.2);
            const style = imageInstance.imagePreviewStyle();
            expect(style.transform).toBe('rotate(90deg) scale(1.2)');
        });
    });

    describe('Template Content Projection', () => {
        it('should render custom indicator template with #template approach', () => {
            const testFixture = TestBed.createComponent(TestTemplateImageComponent);
            testFixture.detectChanges();

            const customIndicator = testFixture.debugElement.query(By.css('.custom-indicator'));
            expect(customIndicator).toBeTruthy();
        });

        it('should render custom image template with #template approach', () => {
            const testFixture = TestBed.createComponent(TestTemplateImageComponent);
            testFixture.detectChanges();

            const customImage = testFixture.debugElement.query(By.css('.custom-image'));
            expect(customImage).toBeTruthy();
        });

        it('should render custom templates with pTemplate approach', () => {
            const testFixture = TestBed.createComponent(TestPTemplateImageComponent);
            testFixture.detectChanges();

            const pTemplateIndicator = testFixture.debugElement.query(By.css('.ptemplate-indicator'));
            const pTemplateImage = testFixture.debugElement.query(By.css('.ptemplate-image'));

            expect(pTemplateIndicator).toBeTruthy();
            expect(pTemplateImage).toBeTruthy();
        });
    });

    describe('Event Handling', () => {
        let testFixture: ComponentFixture<TestPreviewImageComponent>;
        let testComponent: TestPreviewImageComponent;
        let imageInstance: Image;

        beforeEach(() => {
            testFixture = TestBed.createComponent(TestPreviewImageComponent);
            testComponent = testFixture.componentInstance;
            testFixture.detectChanges();
            imageInstance = testFixture.debugElement.query(By.directive(Image)).componentInstance;
        });

        it('should emit onShow event when preview is opened', () => {
            vi.spyOn(imageInstance.onShow, 'emit').mockImplementation(() => {});

            // onShow is now emitted in onAnimationStart, not onAnimationEnd
            const mockElement = document.createElement('div');
            const mockParent = document.createElement('div');
            mockParent.appendChild(mockElement);
            imageInstance.onAnimationStart({ element: mockElement } as any);

            expect(imageInstance.onShow.emit).toHaveBeenCalled();
        });

        it('should emit onHide event when preview is closed', () => {
            vi.spyOn(imageInstance.onHide, 'emit').mockImplementation(() => {});

            imageInstance.previewVisible.set(false);
            imageInstance.wrapper.set(document.createElement('div'));
            // onHide is now emitted in onMaskAfterLeave, not onAnimationEnd
            imageInstance.onMaskAfterLeave();
            expect(imageInstance.onHide.emit).toHaveBeenCalled();
        });

        it('should emit onImageError event on image error', () => {
            const testFixture = TestBed.createComponent(TestBasicImageComponent);
            const testComponent = testFixture.componentInstance;
            testFixture.detectChanges();

            const imageElement = testFixture.debugElement.query(By.css('img'));
            const errorEvent = new Event('error');

            imageElement.nativeElement.dispatchEvent(errorEvent);
            testFixture.detectChanges();

            expect(testComponent.imageErrorEvent).toBeTruthy();
        });

        it('should handle toolbar click', () => {
            const mockEvent = new MouseEvent('click');
            vi.spyOn(mockEvent, 'stopPropagation').mockImplementation(() => {});

            imageInstance.handleToolbarClick(mockEvent);
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });

        it('should handle preview image click', () => {
            imageInstance.onPreviewImageClick();
            expect(imageInstance.previewClick()).toBe(true);
        });
    });

    describe('Accessibility', () => {
        let testFixture: ComponentFixture<TestPreviewImageComponent>;
        let imageInstance: Image;

        beforeEach(() => {
            testFixture = TestBed.createComponent(TestPreviewImageComponent);
            testFixture.detectChanges();
            imageInstance = testFixture.debugElement.query(By.directive(Image)).componentInstance;
        });

        it('should have proper aria label methods', () => {
            // Test that aria label methods exist and return values
            expect(imageInstance.rightAriaLabel()).toBeDefined();
            expect(imageInstance.leftAriaLabel()).toBeDefined();
            expect(imageInstance.zoomInAriaLabel()).toBeDefined();
            expect(imageInstance.zoomOutAriaLabel()).toBeDefined();
            expect(imageInstance.closeAriaLabel()).toBeDefined();
        });

        it('should have zoom image aria label', () => {
            expect(imageInstance.zoomImageAriaLabel).toBeDefined();
        });

        it('should have right arrow aria label', () => {
            expect(imageInstance.rightAriaLabel()).toBeDefined();
        });

        it('should have left arrow aria label', () => {
            expect(imageInstance.leftAriaLabel()).toBeDefined();
        });

        it('should have zoom in aria label', () => {
            expect(imageInstance.zoomInAriaLabel()).toBeDefined();
        });

        it('should have zoom out aria label', () => {
            expect(imageInstance.zoomOutAriaLabel()).toBeDefined();
        });

        it('should have close aria label', () => {
            expect(imageInstance.closeAriaLabel()).toBeDefined();
        });
    });

    describe('Component Lifecycle', () => {
        it('should resolve the pTemplate fallbacks from the projected templates', () => {
            const testFixture = TestBed.createComponent(TestPTemplateImageComponent);
            testFixture.detectChanges();
            const imageInstance: Image = testFixture.debugElement.query(By.directive(Image)).componentInstance;

            expect(imageInstance._indicatorTemplate()).toBeInstanceOf(TemplateRef);
            expect(imageInstance._imageTemplate()).toBeInstanceOf(TemplateRef);
            expect(imageInstance._previewTemplate()).toBeInstanceOf(TemplateRef);
            expect(imageInstance._rotateRightIconTemplate()).toBeInstanceOf(TemplateRef);
            expect(imageInstance._rotateLeftIconTemplate()).toBeInstanceOf(TemplateRef);
            expect(imageInstance._zoomOutIconTemplate()).toBeInstanceOf(TemplateRef);
            expect(imageInstance._zoomInIconTemplate()).toBeInstanceOf(TemplateRef);
            expect(imageInstance._closeIconTemplate()).toBeInstanceOf(TemplateRef);

            expect(imageInstance.indicatorTemplate()).toBeUndefined();
            expect(imageInstance.imageTemplate()).toBeUndefined();
            expect(imageInstance.previewTemplate()).toBeUndefined();
        });

        it('should leave the pTemplate fallbacks empty when templates use the #reference approach', () => {
            const testFixture = TestBed.createComponent(TestTemplateImageComponent);
            testFixture.detectChanges();
            const imageInstance: Image = testFixture.debugElement.query(By.directive(Image)).componentInstance;

            expect(imageInstance._indicatorTemplate()).toBeUndefined();
            expect(imageInstance._imageTemplate()).toBeUndefined();
            expect(imageInstance._previewTemplate()).toBeUndefined();
            expect(imageInstance._rotateRightIconTemplate()).toBeUndefined();
            expect(imageInstance._rotateLeftIconTemplate()).toBeUndefined();
            expect(imageInstance._zoomOutIconTemplate()).toBeUndefined();
            expect(imageInstance._zoomInIconTemplate()).toBeUndefined();
            expect(imageInstance._closeIconTemplate()).toBeUndefined();

            expect(imageInstance.indicatorTemplate()).toBeInstanceOf(TemplateRef);
            expect(imageInstance.imageTemplate()).toBeInstanceOf(TemplateRef);
            expect(imageInstance.previewTemplate()).toBeInstanceOf(TemplateRef);
            expect(imageInstance.rotateRightIconTemplate()).toBeInstanceOf(TemplateRef);
            expect(imageInstance.rotateLeftIconTemplate()).toBeInstanceOf(TemplateRef);
            expect(imageInstance.zoomOutIconTemplate()).toBeInstanceOf(TemplateRef);
            expect(imageInstance.zoomInIconTemplate()).toBeInstanceOf(TemplateRef);
            expect(imageInstance.closeIconTemplate()).toBeInstanceOf(TemplateRef);
        });

        it('should use a pTemplate of an unknown type as the indicator fallback', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `
                    <p-image [src]="src" [preview]="true">
                        <ng-template pTemplate="custom">
                            <i class="pi pi-star custom-fallback-indicator"></i>
                        </ng-template>
                    </p-image>
                `
            })
            class TestUnknownTemplateComponent {
                src = mockImageSrc;
            }

            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                imports: [ImageModule, SharedModule],
                declarations: [TestUnknownTemplateComponent],
                providers: [provideZonelessChangeDetection()]
            });

            const testFixture = TestBed.createComponent(TestUnknownTemplateComponent);
            testFixture.detectChanges();
            const imageInstance: Image = testFixture.debugElement.query(By.directive(Image)).componentInstance;

            expect(imageInstance._indicatorTemplate()).toBeInstanceOf(TemplateRef);
            expect(testFixture.debugElement.query(By.css('.custom-fallback-indicator'))).toBeTruthy();
        });
    });

    describe('Public Methods', () => {
        let testFixture: ComponentFixture<TestPreviewImageComponent>;
        let imageInstance: Image;

        beforeEach(() => {
            testFixture = TestBed.createComponent(TestPreviewImageComponent);
            testFixture.detectChanges();
            imageInstance = testFixture.debugElement.query(By.directive(Image)).componentInstance;
        });

        it('should close preview and reset values', () => {
            imageInstance.rotate.set(90);
            imageInstance.scale.set(1.2);
            imageInstance.previewVisible.set(true);
            imageInstance.wrapper.set(document.createElement('div'));

            // closePreview only sets previewVisible to false
            imageInstance.closePreview();
            expect(imageInstance.previewVisible()).toBe(false);

            // rotate and scale are reset in onMaskAfterLeave (after animation completes)
            imageInstance.onMaskAfterLeave();
            expect(imageInstance.rotate()).toBe(0);
            expect(imageInstance.scale()).toBe(1);
        });

        it('should handle image error', () => {
            const errorEvent = new Event('error');
            vi.spyOn(imageInstance.onImageError, 'emit').mockImplementation(() => {});

            imageInstance.imageError(errorEvent);

            expect(imageInstance.onImageError.emit).toHaveBeenCalledWith(errorEvent);
        });

        it('should move overlay to top with proper z-index', () => {
            const mockWrapper = document.createElement('div');
            imageInstance.wrapper.set(mockWrapper);

            imageInstance.moveOnTop();

            // The method should call ZIndexUtils.set
            expect(imageInstance.moveOnTop).toBeDefined();
        });

        it('should append container to specified target', () => {
            const mockWrapper = document.createElement('div');
            imageInstance.wrapper.set(mockWrapper);

            // Mock the appendTo computed signal
            vi.spyOn(imageInstance, '$appendTo').mockReturnValue('body');

            imageInstance.appendContainer();

            expect(imageInstance.appendContainer).toBeDefined();
        });
    });

    describe('Keyboard Events', () => {
        let testFixture: ComponentFixture<TestPreviewImageComponent>;
        let imageInstance: Image;

        beforeEach(() => {
            testFixture = TestBed.createComponent(TestPreviewImageComponent);
            testFixture.detectChanges();
            imageInstance = testFixture.debugElement.query(By.directive(Image)).componentInstance;
        });

        it('should close preview on document escape key', () => {
            imageInstance.previewVisible.set(true);
            vi.spyOn(imageInstance, 'closePreview').mockImplementation(() => {});

            imageInstance.onKeydownHandler();

            expect(imageInstance.closePreview).toHaveBeenCalled();
        });

        it('should not close preview on escape if not visible', () => {
            imageInstance.previewVisible.set(false);
            vi.spyOn(imageInstance, 'closePreview').mockImplementation(() => {});

            imageInstance.onKeydownHandler();

            expect(imageInstance.closePreview).not.toHaveBeenCalled();
        });
    });

    describe('CSS Classes and Styling', () => {
        let testFixture: ComponentFixture<TestBasicImageComponent>;

        beforeEach(() => {
            testFixture = TestBed.createComponent(TestBasicImageComponent);
            testFixture.detectChanges();
        });

        it('should apply image class and style', () => {
            const imageElement = testFixture.debugElement.query(By.css('img'));
            expect(imageElement.nativeElement.classList.contains('test-image-class')).toBe(true);
            expect(imageElement.nativeElement.style.border).toBe('1px solid red');
        });

        it('should apply component style class', () => {
            const imageComponent = testFixture.debugElement.query(By.directive(Image));
            expect(imageComponent.nativeElement.classList.contains('test-style-class')).toBe(true);
        });
    });

    describe('Error Handling', () => {
        it('should handle missing templates gracefully', () => {
            const testFixture = TestBed.createComponent(Image);
            testFixture.detectChanges();

            expect(() => testFixture.detectChanges()).not.toThrow();
        });

        it('should handle animation events gracefully', () => {
            const testFixture = TestBed.createComponent(Image);
            const imageInstance = testFixture.componentInstance;
            testFixture.detectChanges();

            // Test that the method exists and can be called
            expect(imageInstance.onAnimationStart).toBeDefined();
            expect(imageInstance.onAnimationEnd).toBeDefined();
        });
    });

    describe('OnPush Rendering', () => {
        let directFixture: ComponentFixture<Image>;

        const img = () => directFixture.nativeElement.querySelector('img') as HTMLImageElement | null;
        const mask = () => directFixture.nativeElement.querySelector('[role="dialog"]') as HTMLDivElement | null;
        const original = () => directFixture.nativeElement.querySelector('.p-image-original') as HTMLImageElement | null;

        const openPreview = async () => {
            directFixture.componentInstance.onImageClick();
            await directFixture.whenStable();
            directFixture.detectChanges();
        };

        beforeEach(() => {
            directFixture = TestBed.createComponent(Image);
            directFixture.componentRef.setInput('src', mockImageSrc);
            directFixture.componentRef.setInput('appendTo', 'self');
            directFixture.detectChanges();
        });

        it('should re-render the image attributes when their inputs change', () => {
            expect(img()!.getAttribute('src')).toBe(mockImageSrc);
            expect(img()!.hasAttribute('alt')).toBe(false);

            directFixture.componentRef.setInput('src', mockPreviewImageSrc);
            directFixture.componentRef.setInput('alt', 'Updated alt');
            directFixture.componentRef.setInput('width', '320');
            directFixture.componentRef.setInput('height', '240');
            directFixture.componentRef.setInput('loading', 'lazy');
            directFixture.componentRef.setInput('srcSet', `${mockImageSrc} 1x, ${mockPreviewImageSrc} 2x`);
            directFixture.componentRef.setInput('sizes', '(max-width: 600px) 100vw, 50vw');
            directFixture.detectChanges();

            expect(img()!.getAttribute('src')).toBe(mockPreviewImageSrc);
            expect(img()!.getAttribute('alt')).toBe('Updated alt');
            expect(img()!.getAttribute('width')).toBe('320');
            expect(img()!.getAttribute('height')).toBe('240');
            expect(img()!.getAttribute('loading')).toBe('lazy');
            expect(img()!.getAttribute('srcset')).toBe(`${mockImageSrc} 1x, ${mockPreviewImageSrc} 2x`);
            expect(img()!.getAttribute('sizes')).toBe('(max-width: 600px) 100vw, 50vw');
        });

        it('should re-render imageClass and imageStyle when they change', () => {
            directFixture.componentRef.setInput('imageClass', 'first-class');
            directFixture.componentRef.setInput('imageStyle', { border: '1px solid red' });
            directFixture.detectChanges();
            expect(img()!.classList.contains('first-class')).toBe(true);
            expect(img()!.style.border).toBe('1px solid red');

            directFixture.componentRef.setInput('imageClass', 'second-class');
            directFixture.componentRef.setInput('imageStyle', { opacity: '0.5' });
            directFixture.detectChanges();
            expect(img()!.classList.contains('first-class')).toBe(false);
            expect(img()!.classList.contains('second-class')).toBe(true);
            expect(img()!.style.border).toBe('');
            expect(img()!.style.opacity).toBe('0.5');
        });

        it('should render the preview button and root preview class when preview is toggled', () => {
            expect(directFixture.nativeElement.querySelector('button')).toBeNull();
            expect(directFixture.nativeElement.classList.contains('p-image-preview')).toBe(false);

            directFixture.componentRef.setInput('preview', true);
            directFixture.componentRef.setInput('width', '250');
            directFixture.componentRef.setInput('height', '200');
            directFixture.detectChanges();

            const previewButton = directFixture.nativeElement.querySelector('button') as HTMLButtonElement;
            expect(previewButton).toBeTruthy();
            expect(previewButton.classList.contains('p-image-preview-mask')).toBe(true);
            expect(previewButton.style.width).toBe('250px');
            expect(previewButton.style.height).toBe('200px');
            expect(directFixture.nativeElement.classList.contains('p-image-preview')).toBe(true);

            directFixture.componentRef.setInput('preview', false);
            directFixture.detectChanges();
            expect(directFixture.nativeElement.querySelector('button')).toBeNull();
            expect(directFixture.nativeElement.classList.contains('p-image-preview')).toBe(false);
        });

        it('should render the mask and the preview image once the preview is opened', async () => {
            directFixture.componentRef.setInput('preview', true);
            directFixture.componentRef.setInput('previewImageSrc', mockPreviewImageSrc);
            directFixture.detectChanges();
            expect(mask()).toBeNull();

            await openPreview();

            expect(mask()).toBeTruthy();
            expect(mask()!.getAttribute('aria-modal')).toBe('true');
            expect(original()).toBeTruthy();
            expect(original()!.getAttribute('src')).toBe(mockPreviewImageSrc);
            expect(original()!.style.transform).toBe('rotate(0deg) scale(1)');

            directFixture.componentRef.setInput('previewImageSrc', undefined);
            directFixture.detectChanges();
            expect(original()!.getAttribute('src')).toBe(mockImageSrc);
        });

        it('should re-render the preview transform when rotating and zooming', async () => {
            directFixture.componentRef.setInput('preview', true);
            directFixture.detectChanges();
            await openPreview();

            directFixture.componentInstance.rotateRight();
            directFixture.componentInstance.zoomIn();
            directFixture.detectChanges();
            expect(original()!.style.transform).toBe('rotate(90deg) scale(1.1)');

            directFixture.componentInstance.rotateLeft();
            directFixture.componentInstance.rotateLeft();
            directFixture.componentInstance.zoomOut();
            directFixture.componentInstance.zoomOut();
            directFixture.detectChanges();
            expect(original()!.style.transform).toBe('rotate(-90deg) scale(0.9)');
        });

        it('should disable the zoom buttons at the scale limits', async () => {
            directFixture.componentRef.setInput('preview', true);
            directFixture.detectChanges();
            await openPreview();

            const zoomIn = () => mask()!.querySelector('.p-image-zoom-in-button') as HTMLButtonElement;
            const zoomOut = () => mask()!.querySelector('.p-image-zoom-out-button') as HTMLButtonElement;
            expect(zoomIn().disabled).toBe(false);
            expect(zoomOut().disabled).toBe(false);

            directFixture.componentInstance.scale.set(1.5);
            directFixture.detectChanges();
            expect(zoomIn().disabled).toBe(true);
            expect(zoomIn().classList.contains('p-disabled')).toBe(true);
            expect(zoomOut().disabled).toBe(false);

            directFixture.componentInstance.scale.set(0.5);
            directFixture.detectChanges();
            expect(zoomIn().disabled).toBe(false);
            expect(zoomOut().disabled).toBe(true);
            expect(zoomOut().classList.contains('p-disabled')).toBe(true);
        });

        it('should drop aria-modal when the mask starts leaving', async () => {
            directFixture.componentRef.setInput('preview', true);
            directFixture.detectChanges();
            await openPreview();
            expect(mask()!.getAttribute('aria-modal')).toBe('true');

            directFixture.componentInstance.onBeforeLeave();
            directFixture.detectChanges();
            expect(mask()!.getAttribute('aria-modal')).toBe('false');
        });
    });

    describe('Pass Through (PT)', () => {
        describe('Case 1: Simple string classes', () => {
            beforeEach(async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    imports: [ImageModule, SharedModule],
                    providers: [provideZonelessChangeDetection()]
                }).compileComponents();
            });

            it('should apply PT string classes to all sections', () => {
                const testFixture = TestBed.createComponent(Image);

                const pt = {
                    root: 'ROOT_CLASS',
                    image: 'IMAGE_CLASS',
                    previewMask: 'PREVIEW_MASK_CLASS',
                    previewIcon: 'PREVIEW_ICON_CLASS'
                };

                testFixture.componentRef.setInput('src', mockImageSrc);
                testFixture.componentRef.setInput('preview', true);
                testFixture.componentRef.setInput('pt', pt);
                testFixture.detectChanges();

                const imageElement = testFixture.debugElement.query(By.css('img'));
                const previewButton = testFixture.debugElement.query(By.css('button'));

                expect(testFixture.nativeElement.classList.contains('ROOT_CLASS')).toBe(true);
                expect(imageElement.nativeElement.classList.contains('IMAGE_CLASS')).toBe(true);
                expect(previewButton.nativeElement.classList.contains('PREVIEW_MASK_CLASS')).toBe(true);
            });
        });

        describe('Case 2: Objects with class, style, data attributes, and aria-label', () => {
            beforeEach(async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    imports: [ImageModule, SharedModule],
                    providers: [provideZonelessChangeDetection()]
                }).compileComponents();
            });

            it('should apply PT object properties to root', () => {
                const testFixture = TestBed.createComponent(Image);
                const pt = {
                    root: {
                        class: 'COLLAPSED',
                        style: { 'background-color': 'red' },
                        'data-p-TEST': true,
                        'aria-label': 'TEST ARIA LABEL'
                    }
                };

                testFixture.componentRef.setInput('src', mockImageSrc);
                testFixture.componentRef.setInput('pt', pt);
                testFixture.detectChanges();

                expect(testFixture.nativeElement.classList.contains('COLLAPSED')).toBe(true);
                expect(testFixture.nativeElement.style.backgroundColor).toBe('red');
                expect(testFixture.nativeElement.getAttribute('data-p-TEST')).toBe('true');
                expect(testFixture.nativeElement.getAttribute('aria-label')).toBe('TEST ARIA LABEL');
            });

            it('should apply PT object properties to image', () => {
                const testFixture = TestBed.createComponent(Image);
                const pt = {
                    image: {
                        class: 'IMAGE_CUSTOM',
                        style: { border: '2px solid blue' },
                        'data-test-image': 'test-value'
                    }
                };

                testFixture.componentRef.setInput('src', mockImageSrc);
                testFixture.componentRef.setInput('pt', pt);
                testFixture.detectChanges();

                const imageElement = testFixture.debugElement.query(By.css('img'));
                expect(imageElement.nativeElement.classList.contains('IMAGE_CUSTOM')).toBe(true);
                expect(imageElement.nativeElement.style.border).toBe('2px solid blue');
                expect(imageElement.nativeElement.getAttribute('data-test-image')).toBe('test-value');
            });

            it('should apply PT object properties to previewMask', () => {
                const testFixture = TestBed.createComponent(Image);
                const pt = {
                    previewMask: {
                        class: 'PREVIEW_CUSTOM',
                        style: { opacity: '0.8' },
                        'aria-label': 'CUSTOM_PREVIEW_LABEL'
                    }
                };

                testFixture.componentRef.setInput('src', mockImageSrc);
                testFixture.componentRef.setInput('preview', true);
                testFixture.componentRef.setInput('pt', pt);
                testFixture.detectChanges();

                const previewButton = testFixture.debugElement.query(By.css('button'));
                expect(previewButton.nativeElement.classList.contains('PREVIEW_CUSTOM')).toBe(true);
                expect(previewButton.nativeElement.style.opacity).toBe('0.8');
                expect(previewButton.nativeElement.getAttribute('aria-label')).toBe('CUSTOM_PREVIEW_LABEL');
            });
        });

        describe('Case 3: Mixed object and string values', () => {
            beforeEach(async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    imports: [ImageModule, SharedModule],
                    providers: [provideZonelessChangeDetection()]
                }).compileComponents();
            });

            it('should handle mixed PT values', () => {
                const testFixture = TestBed.createComponent(Image);
                const pt = {
                    root: {
                        class: 'ROOT_OBJECT_CLASS'
                    },
                    image: 'IMAGE_STRING_CLASS',
                    previewMask: {
                        class: 'PREVIEW_OBJECT_CLASS'
                    }
                };

                testFixture.componentRef.setInput('src', mockImageSrc);
                testFixture.componentRef.setInput('preview', true);
                testFixture.componentRef.setInput('pt', pt);
                testFixture.detectChanges();

                const imageElement = testFixture.debugElement.query(By.css('img'));
                const previewButton = testFixture.debugElement.query(By.css('button'));

                expect(testFixture.nativeElement.classList.contains('ROOT_OBJECT_CLASS')).toBe(true);
                expect(imageElement.nativeElement.classList.contains('IMAGE_STRING_CLASS')).toBe(true);
                expect(previewButton.nativeElement.classList.contains('PREVIEW_OBJECT_CLASS')).toBe(true);
            });
        });

        describe('Case 4: Use variables from instance', () => {
            beforeEach(async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    imports: [ImageModule, SharedModule],
                    providers: [provideZonelessChangeDetection()]
                }).compileComponents();
            });

            it('should accept PT functions with instance parameter', () => {
                const testFixture = TestBed.createComponent(Image);
                let instanceReceived = false;
                const pt = {
                    root: ({ instance }: any) => {
                        if (instance) {
                            instanceReceived = true;
                        }
                        return { class: 'PT_FUNCTION_CLASS' };
                    }
                };

                testFixture.componentRef.setInput('src', mockImageSrc);
                testFixture.componentRef.setInput('pt', pt);
                testFixture.detectChanges();

                expect(instanceReceived).toBe(true);
                expect(testFixture.nativeElement.classList.contains('PT_FUNCTION_CLASS')).toBe(true);
            });
        });

        describe('Case 5: Event binding', () => {
            beforeEach(async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    imports: [ImageModule, SharedModule],
                    providers: [provideZonelessChangeDetection()]
                }).compileComponents();
            });

            it('should handle onclick event in PT', async () => {
                const testFixture = TestBed.createComponent(Image);
                let clicked = false;
                const pt = {
                    image: {
                        onclick: () => {
                            clicked = true;
                        }
                    }
                };

                testFixture.componentRef.setInput('src', mockImageSrc);
                testFixture.componentRef.setInput('pt', pt);
                testFixture.detectChanges();

                const imageElement = testFixture.debugElement.query(By.css('img'));
                imageElement.nativeElement.click();
                await testFixture.whenStable();

                expect(clicked).toBe(true);
            });

            it('should handle onclick with instance access', async () => {
                const testFixture = TestBed.createComponent(Image);
                const testComponent = testFixture.componentInstance;
                const pt = {
                    previewMask: ({ instance }: any) => {
                        return {
                            onclick: () => {
                                instance.scale.set(2.0);
                            }
                        };
                    }
                };

                testFixture.componentRef.setInput('src', mockImageSrc);
                testFixture.componentRef.setInput('preview', true);
                testFixture.componentRef.setInput('pt', pt);
                testFixture.detectChanges();

                const previewButton = testFixture.debugElement.query(By.css('button'));
                previewButton.nativeElement.click();
                await testFixture.whenStable();

                expect(testComponent.scale()).toBe(2.0);
            });
        });

        describe('Case 6: Test emitters', () => {
            beforeEach(async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    imports: [ImageModule, SharedModule],
                    providers: [provideZonelessChangeDetection()]
                }).compileComponents();
            });

            it('should access emitters through instance in PT', async () => {
                const testFixture = TestBed.createComponent(Image);
                const testComponent = testFixture.componentInstance;
                let emitterCalled = false;
                const pt = {
                    root: ({ instance }: any) => {
                        if (instance?.onShow) {
                            instance.onShow.subscribe(() => {
                                emitterCalled = true;
                            });
                        }
                        return {};
                    }
                };

                testFixture.componentRef.setInput('src', mockImageSrc);
                testFixture.componentRef.setInput('preview', true);
                testFixture.componentRef.setInput('pt', pt);
                testFixture.detectChanges();
                await testFixture.whenStable();

                testComponent.onImageClick();
                await testFixture.whenStable();
                testFixture.detectChanges();

                // onShow is now emitted in onAnimationStart, not onAnimationEnd
                const mockElement = document.createElement('div');
                const mockParent = document.createElement('div');
                mockParent.appendChild(mockElement);
                testComponent.onAnimationStart({ element: mockElement } as any);
                await testFixture.whenStable();

                expect(emitterCalled).toBe(true);
            });
        });

        describe('Case 7: Inline test', () => {
            beforeEach(() => {
                TestBed.resetTestingModule();
            });

            it('should accept inline PT with string class', () => {
                @Component({
                    changeDetection: ChangeDetectionStrategy.Eager,
                    standalone: false,
                    template: `<p-image [src]="src" [pt]="{ root: 'TEST_INLINE_CLASS' }" />`
                })
                class TestInlineComponent {
                    src = mockImageSrc;
                }

                TestBed.configureTestingModule({
                    imports: [ImageModule],
                    declarations: [TestInlineComponent],
                    providers: [provideZonelessChangeDetection()]
                });

                const testFixture = TestBed.createComponent(TestInlineComponent);
                testFixture.detectChanges();

                const rootElement = testFixture.debugElement.query(By.directive(Image));
                expect(rootElement.nativeElement.classList.contains('TEST_INLINE_CLASS')).toBe(true);
            });

            it('should accept inline PT with object class', () => {
                @Component({
                    changeDetection: ChangeDetectionStrategy.Eager,
                    standalone: false,
                    template: `<p-image [src]="src" [pt]="{ root: { class: 'TEST_INLINE_OBJECT_CLASS' } }" />`
                })
                class TestInlineObjectComponent {
                    src = mockImageSrc;
                }

                TestBed.configureTestingModule({
                    imports: [ImageModule],
                    declarations: [TestInlineObjectComponent],
                    providers: [provideZonelessChangeDetection()]
                });

                const testFixture = TestBed.createComponent(TestInlineObjectComponent);
                testFixture.detectChanges();

                const rootElement = testFixture.debugElement.query(By.directive(Image));
                expect(rootElement.nativeElement.classList.contains('TEST_INLINE_OBJECT_CLASS')).toBe(true);
            });
        });

        describe('Case 8: Test from ExhaustiveConfig', () => {
            beforeEach(() => {
                TestBed.resetTestingModule();
            });

            it('should apply global PT configuration from ExhaustiveConfig', async () => {
                const { provideExhaustive } = await import('@exhaustive-ui/core/config');

                @Component({
                    changeDetection: ChangeDetectionStrategy.Eager,
                    standalone: false,
                    template: `
                        <p-image [src]="src1" />
                        <p-image [src]="src2" />
                    `
                })
                class TestGlobalPTComponent {
                    src1 = mockImageSrc;
                    src2 = mockImageSrc;
                }

                await TestBed.configureTestingModule({
                    imports: [ImageModule],
                    declarations: [TestGlobalPTComponent],
                    providers: [
                        provideZonelessChangeDetection(),
                        provideExhaustive({
                            pt: {
                                image: {
                                    root: {
                                        class: 'GLOBAL_ROOT_CLASS',
                                        'aria-label': 'TEST_GLOBAL_ARIA_LABEL'
                                    }
                                }
                            }
                        })
                    ]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestGlobalPTComponent);
                testFixture.detectChanges();

                const imageComponents = testFixture.debugElement.queryAll(By.directive(Image));
                expect(imageComponents.length).toBe(2);

                imageComponents.forEach((imgComp) => {
                    expect(imgComp.nativeElement.getAttribute('aria-label')).toBe('TEST_GLOBAL_ARIA_LABEL');
                    expect(imgComp.nativeElement.classList.contains('GLOBAL_ROOT_CLASS')).toBe(true);
                });
            });
        });

        describe('Case 9: Additional PT sections', () => {
            beforeEach(async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    imports: [ImageModule, SharedModule],
                    providers: [provideZonelessChangeDetection()]
                }).compileComponents();
            });

            it('should accept PT for all available sections', () => {
                const testFixture = TestBed.createComponent(Image);
                const pt = {
                    root: 'ROOT_PT',
                    image: 'IMAGE_PT',
                    previewMask: 'PREVIEW_MASK_PT',
                    mask: 'MASK_PT',
                    toolbar: 'TOOLBAR_PT',
                    rotateRightButton: 'ROTATE_RIGHT_PT',
                    rotateLeftButton: 'ROTATE_LEFT_PT',
                    zoomInButton: 'ZOOM_IN_PT',
                    zoomOutButton: 'ZOOM_OUT_PT',
                    closeButton: 'CLOSE_PT',
                    original: 'ORIGINAL_PT'
                };

                testFixture.componentRef.setInput('src', mockImageSrc);
                testFixture.componentRef.setInput('preview', true);
                testFixture.componentRef.setInput('pt', pt);
                testFixture.detectChanges();

                // Verify basic PT sections are applied
                expect(testFixture.nativeElement.classList.contains('ROOT_PT')).toBe(true);
                const imageElement = testFixture.debugElement.query(By.css('img'));
                expect(imageElement.nativeElement.classList.contains('IMAGE_PT')).toBe(true);
            });
        });
    });
});

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [Image, SharedModule],
    template: ` <p-image src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" [preview]="true"> </p-image> `
})
class ImageQueryApiHostComponent {}

describe('Image Signal Query API', () => {
    it('should resolve its signal-based view/content queries', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [ImageQueryApiHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(ImageQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const instance = fixture.debugElement.query(By.directive(Image)).componentInstance;

        expect(instance.previewButton()).toBeDefined();
        expect(instance.closeButton()).toBeUndefined();
    });
});
