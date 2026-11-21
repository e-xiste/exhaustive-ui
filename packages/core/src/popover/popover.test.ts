import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, provideZonelessChangeDetection, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { Mock } from 'vitest';

import { MotionEvent } from '@exhaustive-ui/motion';
import { OverlayService, PrimeTemplate } from '@exhaustive-ui/core/api';
import { ZIndexUtils } from '@exhaustive-ui/core/utils';
import { Dialog } from '@exhaustive-ui/core/dialog';
import { Popover } from './popover';

import { provideNoopAnimations } from '@angular/platform-browser/animations';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <button #targetButton (click)="popover.toggle($event)">Toggle</button>
        <p-popover
            #popover
            [dismissable]="dismissable"
            [style]="style"
            [styleClass]="styleClass"
            [appendTo]="appendTo"
            [autoZIndex]="autoZIndex"
            [baseZIndex]="baseZIndex"
            [focusOnShow]="focusOnShow"
            [ariaLabel]="ariaLabel"
            [ariaLabelledBy]="ariaLabelledBy"
            (onShow)="onShow($event)"
            (onHide)="onHide($event)"
        >
            <div class="test-content">Basic content</div>
        </p-popover>
    `
})
class TestBasicPopoverComponent {
    readonly popover = viewChild.required<Popover>('popover');
    readonly targetButton = viewChild.required('targetButton', { read: ElementRef });

    dismissable = true;
    style: { [klass: string]: any } | null = null as any;
    styleClass: string | undefined;
    appendTo: any = 'body';
    autoZIndex = true;
    baseZIndex = 0;
    focusOnShow = true;
    ariaLabel: string | undefined;
    ariaLabelledBy: string | undefined;

    showEvent: any;
    hideEvent: any;

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
        <button #targetButton (click)="popover.toggle($event)">Toggle</button>
        <p-popover #popover>
            <ng-template #content let-closeCallback="closeCallback">
                <div class="template-content">
                    Template content
                    <button class="close-button" (click)="closeCallback()">Close</button>
                </div>
            </ng-template>
        </p-popover>
    `
})
class TestTemplatePopoverComponent {
    readonly popover = viewChild.required<Popover>('popover');
    readonly targetButton = viewChild.required('targetButton', { read: ElementRef });
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <button #targetButton (click)="popover.toggle($event)">Toggle</button>
        <p-popover #popover>
            <ng-template pTemplate="content" let-closeCallback="closeCallback">
                <div class="ptemplate-content">
                    PTemplate content
                    <button class="close-button" (click)="closeCallback()">Close</button>
                </div>
            </ng-template>
        </p-popover>
    `
})
class TestPTemplatePopoverComponent {
    readonly popover = viewChild.required<Popover>('popover');
    readonly targetButton = viewChild.required('targetButton', { read: ElementRef });
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <button #targetButton (click)="popover.toggle($event)">Toggle</button>
        <p-popover #popover [focusOnShow]="true" [ariaLabel]="ariaLabel" [ariaLabelledBy]="ariaLabelledBy">
            <input autofocus type="text" class="focus-input" />
            <button tabindex="0">Button</button>
            <div tabindex="0">Focusable div</div>
        </p-popover>
    `
})
class TestKeyboardNavigationComponent {
    readonly popover = viewChild.required<Popover>('popover');
    readonly targetButton = viewChild.required('targetButton', { read: ElementRef });

    ariaLabel: string | undefined;
    ariaLabelledBy: string | undefined;
}

describe('Popover', () => {
    let overlayService: { add: Mock };

    beforeEach(async () => {
        const overlayServiceSpy = {
            add: vi.fn(),
            clickObservable: { subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) }
        };

        await TestBed.configureTestingModule({
            imports: [CommonModule, Popover, PrimeTemplate],
            declarations: [TestBasicPopoverComponent, TestTemplatePopoverComponent, TestPTemplatePopoverComponent, TestKeyboardNavigationComponent],
            providers: [provideZonelessChangeDetection(), { provide: OverlayService, useValue: overlayServiceSpy }]
        }).compileComponents();

        overlayService = TestBed.inject(OverlayService) as unknown as { add: Mock };
    });

    describe('Component Initialization', () => {
        let fixture: ComponentFixture<TestBasicPopoverComponent>;
        let component: TestBasicPopoverComponent;
        let popoverInstance: Popover;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicPopoverComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            popoverInstance = component.popover();
        });

        it('should create the component', () => {
            expect(popoverInstance).toBeTruthy();
        });

        it('should have default values', () => {
            expect(popoverInstance.dismissable()).toBe(true);
            // appendTo can be a function or string, check if it's truthy
            expect(popoverInstance.appendTo()).toBeTruthy();
            expect(popoverInstance.autoZIndex()).toBe(true);
            expect(popoverInstance.baseZIndex()).toBe(0);
            expect(popoverInstance.focusOnShow()).toBe(true);
            expect(popoverInstance.motionOptions()).toBeUndefined();
            expect(popoverInstance.overlayVisible()).toBe(false);
            expect(popoverInstance.render()).toBe(false);
        });

        it('should accept custom values', async () => {
            component.dismissable = false;
            component.baseZIndex = 1000;
            component.focusOnShow = false;
            component.ariaLabel = 'Custom popover';
            component.styleClass = 'custom-class';
            component.style = { width: '300px', height: '200px' };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(popoverInstance.dismissable()).toBe(false);
            expect(popoverInstance.baseZIndex()).toBe(1000);
            expect(popoverInstance.focusOnShow()).toBe(false);
            expect(popoverInstance.ariaLabel()).toBe('Custom popover');
            expect(popoverInstance.styleClass()).toBe('custom-class');
            expect(popoverInstance.style()).toEqual({ width: '300px', height: '200px' });
        });
    });

    describe('Public Methods', () => {
        let fixture: ComponentFixture<TestBasicPopoverComponent>;
        let component: TestBasicPopoverComponent;
        let popoverInstance: Popover;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicPopoverComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            popoverInstance = component.popover();
        });

        it('should show popover programmatically', async () => {
            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;

            popoverInstance.show(mockEvent, target);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(popoverInstance.overlayVisible()).toBe(true);
            expect(popoverInstance.render()).toBe(true);
            expect(popoverInstance.target()).toBe(target);
        });

        it('should hide popover programmatically', async () => {
            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;

            popoverInstance.show(mockEvent, target);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            popoverInstance.hide();

            expect(popoverInstance.overlayVisible()).toBe(false);
        });

        it('should toggle popover visibility', async () => {
            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;

            expect(popoverInstance.overlayVisible()).toBe(false);

            popoverInstance.toggle(mockEvent, target);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();
            expect(popoverInstance.overlayVisible()).toBe(true);

            popoverInstance.toggle(mockEvent, target);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();
            expect(popoverInstance.overlayVisible()).toBe(false);
        });

        it('should prevent toggle when animation is in progress', async () => {
            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;

            // First toggle to start animation
            popoverInstance.toggle(mockEvent, target);
            await new Promise((resolve) => setTimeout(resolve, 10));

            // Second toggle should work in zoneless (no animation blocking)
            popoverInstance.toggle(mockEvent, target);

            // In zoneless mode, toggle works immediately
            expect(popoverInstance.overlayVisible()).toBe(false);
        });

        it('should handle target change in toggle', async () => {
            const mockEvent = new MouseEvent('click');
            const target1 = component.targetButton().nativeElement;
            const target2 = document.createElement('button');

            popoverInstance.show(mockEvent, target1);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            vi.spyOn(popoverInstance, 'hasTargetChanged').mockReturnValue(true);
            popoverInstance.toggle(mockEvent, target2);

            expect(popoverInstance.destroyCallback()).toBeTruthy();
        });
    });

    describe('Event Handling', () => {
        let fixture: ComponentFixture<TestBasicPopoverComponent>;
        let component: TestBasicPopoverComponent;
        let popoverInstance: Popover;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicPopoverComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            popoverInstance = component.popover();
        });

        it('should emit onShow event', async () => {
            vi.spyOn(component, 'onShow').mockImplementation(() => {});
            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;

            popoverInstance.show(mockEvent, target);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(component.showEvent).toBeUndefined();
        });

        it('should emit onHide event', async () => {
            vi.spyOn(component, 'onHide').mockImplementation(() => {});
            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;

            popoverInstance.show(mockEvent, target);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            popoverInstance.hide();

            expect(component.hideEvent).toBeUndefined();
        });

        it('should emit onShow when the enter motion starts and onHide when the leave motion ends', async () => {
            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;

            popoverInstance.show(mockEvent, target);
            await fixture.whenStable();

            const dialog = fixture.debugElement.query(By.css('[role="dialog"]')).nativeElement as HTMLDivElement;
            popoverInstance.onAnimationStart({ element: dialog } as MotionEvent);
            expect(component.showEvent).toBeNull();

            popoverInstance.hide();
            popoverInstance.onAnimationEnd();
            expect(component.hideEvent).toEqual({});
            expect(popoverInstance.render()).toBe(false);
            expect(popoverInstance.container()).toBeNull();
        });
    });

    describe('Template Content Projection', () => {
        describe('#content template approach', () => {
            let fixture: ComponentFixture<TestTemplatePopoverComponent>;
            let component: TestTemplatePopoverComponent;
            let popoverInstance: Popover;

            beforeEach(() => {
                fixture = TestBed.createComponent(TestTemplatePopoverComponent);
                component = fixture.componentInstance;
                fixture.detectChanges();
                popoverInstance = component.popover();
            });

            it('should project content template correctly', async () => {
                const mockEvent = new MouseEvent('click');
                const target = component.targetButton().nativeElement;

                popoverInstance.show(mockEvent, target);
                await new Promise((resolve) => setTimeout(resolve, 100));
                await fixture.whenStable();

                expect(popoverInstance.contentTemplate()).toBeTruthy();
            });

            it('should provide closeCallback context to template', async () => {
                const mockEvent = new MouseEvent('click');
                const target = component.targetButton().nativeElement;

                popoverInstance.show(mockEvent, target);
                await new Promise((resolve) => setTimeout(resolve, 100));
                await fixture.whenStable();
                fixture.detectChanges();

                const templateContent = fixture.debugElement.query(By.css('.template-content'));
                expect(templateContent).toBeTruthy();

                const closeButton = fixture.debugElement.query(By.css('.close-button'));
                expect(closeButton).toBeTruthy();

                // Test close callback - simulate with proper event
                const mockCloseEvent = new MouseEvent('click');
                vi.spyOn(mockCloseEvent, 'preventDefault').mockImplementation(() => {});
                popoverInstance.onCloseClick(mockCloseEvent);
                expect(popoverInstance.overlayVisible()).toBe(false);
                expect(mockCloseEvent.preventDefault).toHaveBeenCalled();
            });
        });

        describe('pTemplate approach', () => {
            let fixture: ComponentFixture<TestPTemplatePopoverComponent>;
            let component: TestPTemplatePopoverComponent;
            let popoverInstance: Popover;

            beforeEach(() => {
                fixture = TestBed.createComponent(TestPTemplatePopoverComponent);
                component = fixture.componentInstance;
                fixture.detectChanges();
                popoverInstance = component.popover();
            });

            it('should resolve the pTemplate content into _contentTemplate', () => {
                expect(popoverInstance.contentTemplate()).toBeUndefined();
                expect(popoverInstance._contentTemplate()).toBeTruthy();
                expect(popoverInstance._contentTemplate()).toBe(popoverInstance.templates()[0].template);
            });

            it('should render pTemplate content correctly', async () => {
                const mockEvent = new MouseEvent('click');
                const target = component.targetButton().nativeElement;

                popoverInstance.show(mockEvent, target);
                await new Promise((resolve) => setTimeout(resolve, 100));
                await fixture.whenStable();
                fixture.detectChanges();

                const templateContent = fixture.debugElement.query(By.css('.ptemplate-content'));
                expect(templateContent).toBeTruthy();
            });
        });
    });

    describe('Keyboard Navigation and Accessibility', () => {
        let fixture: ComponentFixture<TestKeyboardNavigationComponent>;
        let component: TestKeyboardNavigationComponent;
        let popoverInstance: Popover;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestKeyboardNavigationComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            popoverInstance = component.popover();
        });

        it('should have correct ARIA attributes', async () => {
            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;

            component.ariaLabel = 'Test popover';
            component.ariaLabelledBy = 'test-label';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            popoverInstance.show(mockEvent, target);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();
            fixture.detectChanges();

            const popoverElement = fixture.debugElement.query(By.css('[role="dialog"]'));
            expect(popoverElement).toBeTruthy();
            expect(popoverElement.nativeElement.getAttribute('role')).toBe('dialog');
            expect(popoverElement.nativeElement.getAttribute('aria-label')).toBe('Test popover');
            expect(popoverElement.nativeElement.getAttribute('aria-labelledBy')).toBe('test-label');
            expect(popoverElement.nativeElement.getAttribute('aria-modal')).toBe('true');
        });

        it('should focus autofocus element when focusOnShow is true', async () => {
            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;

            popoverInstance.show(mockEvent, target);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            // Create container and set up focus test
            const container = document.createElement('div');
            const focusableInput = document.createElement('input');
            focusableInput.setAttribute('autofocus', '');
            container.appendChild(focusableInput);
            popoverInstance.container.set(container);

            vi.spyOn(focusableInput, 'focus').mockImplementation(() => {});
            popoverInstance.focus();
            await new Promise((resolve) => setTimeout(resolve, 10));
            await fixture.whenStable();

            expect(focusableInput.focus).toHaveBeenCalled();
        });

        it('should hide popover on Escape key', async () => {
            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;

            popoverInstance.show(mockEvent, target);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            popoverInstance.onEscapeKeydown(escapeEvent);

            expect(popoverInstance.overlayVisible()).toBe(false);
        });

        it('should not listen to Escape on the document while hidden (optimus-ui#405)', async () => {
            const escapeSpy = vi.spyOn(popoverInstance, 'onEscapeKeydown');

            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            expect(escapeSpy).not.toHaveBeenCalled();

            popoverInstance.show(new MouseEvent('click'), component.targetButton().nativeElement);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            expect(popoverInstance.overlayVisible()).toBe(false);
        });

        it('should drop the flipped state when a later align() places the popover below its target (optimus-ui#398)', async () => {
            const target = component.targetButton().nativeElement;
            // keep the target at the top of the viewport, whatever earlier tests left in the page, so there is room below it
            Object.assign(target.style, { position: 'fixed', top: '10px', left: '10px' });

            popoverInstance.show(new MouseEvent('click'), target);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            const container = popoverInstance.container() as HTMLDivElement;
            // left over from a previous position above the target
            container.setAttribute('data-p-popover-flipped', 'true');
            container.classList.add('p-popover-flipped');

            popoverInstance.align();

            expect(container.getBoundingClientRect().top).toBeGreaterThan(target.getBoundingClientRect().top);
            expect(container.hasAttribute('data-p-popover-flipped')).toBe(false);
            expect(container.classList).not.toContain('p-popover-flipped');
        });
    });

    describe('CSS Classes and Styling', () => {
        let fixture: ComponentFixture<TestBasicPopoverComponent>;
        let component: TestBasicPopoverComponent;
        let popoverInstance: Popover;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicPopoverComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            popoverInstance = component.popover();
        });

        it('should apply styleClass correctly', async () => {
            component.styleClass = 'custom-popover-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;

            popoverInstance.show(mockEvent, target);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();
            fixture.detectChanges();

            const popoverElement = fixture.debugElement.query(By.css('.custom-popover-class'));
            expect(popoverElement).toBeTruthy();
        });

        it('should apply custom styles', async () => {
            component.style = { border: '2px solid red', padding: '10px' };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(popoverInstance.style()).toEqual({ border: '2px solid red', padding: '10px' });

            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;

            popoverInstance.show(mockEvent, target);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();
            fixture.detectChanges();

            const popoverElement = fixture.debugElement.query(By.css('[role="dialog"]'));
            expect(popoverElement).toBeTruthy();
            expect(popoverElement.nativeElement.style.border).toBe('2px solid red');
            expect(popoverElement.nativeElement.style.padding).toBe('10px');
        });
    });

    describe('Edge Cases and Animation', () => {
        let fixture: ComponentFixture<TestBasicPopoverComponent>;
        let component: TestBasicPopoverComponent;
        let popoverInstance: Popover;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicPopoverComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            popoverInstance = component.popover();
        });

        it('should handle rapid toggle clicks during animation', async () => {
            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;

            // First click
            popoverInstance.toggle(mockEvent, target);

            // Second click during animation should be ignored
            const result = popoverInstance.toggle(mockEvent, target);
            expect(result).toBeUndefined();
        });

        it('should handle null/undefined target values', async () => {
            const mockEvent = new MouseEvent('click');

            expect(() => {
                popoverInstance.show(mockEvent, null);
            }).not.toThrow();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(() => {
                popoverInstance.show(mockEvent, undefined);
            }).not.toThrow();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();
        });

        it('should run and clear the destroy callback when the leave motion ends', async () => {
            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;
            const mockCallback = vi.fn();

            popoverInstance.show(mockEvent, target);
            await fixture.whenStable();
            popoverInstance.destroyCallback.set(mockCallback);

            popoverInstance.onAnimationEnd();
            expect(mockCallback).not.toHaveBeenCalled();
            expect(popoverInstance.destroyCallback()).toBe(mockCallback);

            popoverInstance.hide();
            popoverInstance.onAnimationEnd();
            expect(mockCallback).toHaveBeenCalled();
            expect(popoverInstance.destroyCallback()).toBeNull();
        });
    });

    describe('Document Click and Resize Listeners', () => {
        let fixture: ComponentFixture<TestBasicPopoverComponent>;
        let component: TestBasicPopoverComponent;
        let popoverInstance: Popover;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicPopoverComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            popoverInstance = component.popover();
        });

        it('should bind document click listener when shown', async () => {
            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;

            popoverInstance.show(mockEvent, target);
            await fixture.whenStable();

            const dialog = fixture.debugElement.query(By.css('[role="dialog"]')).nativeElement as HTMLDivElement;
            popoverInstance.onAnimationStart({ element: dialog } as MotionEvent);

            expect(popoverInstance.overlayVisible()).toBe(true);
            expect(popoverInstance.documentClickListener()).toBeTruthy();
            expect(popoverInstance.documentResizeListener()).toBeTruthy();
            expect(popoverInstance.scrollHandler()).toBeTruthy();

            document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            expect(popoverInstance.overlayVisible()).toBe(false);
        });

        it('should not hide on outside click when dismissable is false', async () => {
            component.dismissable = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;

            popoverInstance.show(mockEvent, target);
            await fixture.whenStable();

            const dialog = fixture.debugElement.query(By.css('[role="dialog"]')).nativeElement as HTMLDivElement;
            popoverInstance.onAnimationStart({ element: dialog } as MotionEvent);

            document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            expect(popoverInstance.overlayVisible()).toBe(true);
        });

        it('should unbind listeners on container destroy', () => {
            vi.spyOn(popoverInstance, 'unbindDocumentClickListener').mockImplementation(() => {});
            vi.spyOn(popoverInstance, 'unbindDocumentResizeListener').mockImplementation(() => {});
            vi.spyOn(popoverInstance, 'unbindScrollListener').mockImplementation(() => {});

            popoverInstance.onContainerDestroy();

            expect(popoverInstance.unbindDocumentClickListener).toHaveBeenCalled();
            expect(popoverInstance.unbindDocumentResizeListener).toHaveBeenCalled();
            expect(popoverInstance.unbindScrollListener).toHaveBeenCalled();
        });

        it('should hide on window resize for non-touch devices', async () => {
            const mockEvent = new MouseEvent('click');
            const target = component.targetButton().nativeElement;

            popoverInstance.show(mockEvent, target);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            popoverInstance.onWindowResize();
            expect(popoverInstance.overlayVisible()).toBe(false);
        });

        it('should handle overlay clicks correctly', () => {
            const mockEvent = new MouseEvent('click');

            popoverInstance.onOverlayClick(mockEvent);
            expect(overlayService.add).toHaveBeenCalledWith({
                originalEvent: mockEvent,
                target: popoverInstance.el.nativeElement
            });
            expect(popoverInstance.selfClick()).toBe(true);
        });

        it('should handle content clicks correctly', () => {
            const mockEvent = {
                target: { clientWidth: 100, clientHeight: 100 },
                offsetX: 50,
                offsetY: 50
            } as any;

            popoverInstance.onContentClick(mockEvent);
            expect(popoverInstance.selfClick()).toBe(true);

            // Test click outside content bounds
            const outsideEvent = {
                target: { clientWidth: 100, clientHeight: 100 },
                offsetX: 150,
                offsetY: 150
            } as any;

            popoverInstance.onContentClick(outsideEvent);
            expect(popoverInstance.selfClick()).toBe(false);
        });

        it('should detect target changes correctly', () => {
            const target1 = document.createElement('button');
            const target2 = document.createElement('button');
            const mockEvent = { currentTarget: target2 };

            popoverInstance.target.set(target1);

            expect(popoverInstance.hasTargetChanged(mockEvent, null)).toBe(true);
            expect(popoverInstance.hasTargetChanged(mockEvent, target1)).toBe(false);
            expect(popoverInstance.hasTargetChanged(mockEvent, target2)).toBe(true);
        });
    });

    describe('ngOnDestroy', () => {
        let fixture: ComponentFixture<TestBasicPopoverComponent>;
        let component: TestBasicPopoverComponent;
        let popoverInstance: Popover;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestBasicPopoverComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            popoverInstance = component.popover();
        });

        it('should cleanup resources on destroy', () => {
            vi.spyOn(popoverInstance, 'restoreAppend').mockImplementation(() => {});
            vi.spyOn(popoverInstance, 'onContainerDestroy').mockImplementation(() => {});

            const mockScrollHandler = {
                destroy: vi.fn(),
                unbindScrollListener: vi.fn()
            };
            popoverInstance.scrollHandler.set(mockScrollHandler as any);

            const mockSubscription = {
                unsubscribe: vi.fn()
            };
            popoverInstance.overlaySubscription.set(mockSubscription as any);

            popoverInstance.container.set(document.createElement('div'));
            expect(popoverInstance.autoZIndex()).toBe(true);

            popoverInstance.ngOnDestroy();

            expect(mockScrollHandler.destroy).toHaveBeenCalled();
            expect(popoverInstance.scrollHandler()).toBeNull();
            expect(popoverInstance.target()).toBeNull();
            expect(popoverInstance.destroyCallback()).toBeNull();
            expect(popoverInstance.restoreAppend).toHaveBeenCalled();
            expect(popoverInstance.onContainerDestroy).toHaveBeenCalled();
            expect(mockSubscription.unsubscribe).toHaveBeenCalled();
        });
    });

    describe('OnPush Rendering', () => {
        let directFixture: ComponentFixture<Popover>;
        let target: HTMLButtonElement;

        const dialog = () => directFixture.nativeElement.querySelector('[role="dialog"]') as HTMLDivElement | null;

        const open = () => {
            directFixture.componentInstance.show(null, target);
            directFixture.detectChanges();
        };

        beforeEach(() => {
            target = document.createElement('button');
            document.body.appendChild(target);

            directFixture = TestBed.createComponent(Popover);
            directFixture.componentRef.setInput('appendTo', 'self');
            directFixture.detectChanges();
        });

        afterEach(() => {
            target.remove();
        });

        it('should render the overlay once shown and remove it after the leave motion ends', () => {
            expect(dialog()).toBeNull();

            open();
            expect(dialog()).toBeTruthy();
            expect(dialog()!.getAttribute('aria-modal')).toBe('true');
            expect(dialog()!.classList.contains('p-popover')).toBe(true);

            directFixture.componentInstance.hide();
            directFixture.detectChanges();
            expect(dialog()!.getAttribute('aria-modal')).toBe('false');

            directFixture.componentInstance.onAnimationEnd();
            directFixture.detectChanges();
            expect(dialog()).toBeNull();
        });

        it('should re-render when ariaLabel changes', () => {
            open();
            expect(dialog()!.hasAttribute('aria-label')).toBe(false);

            directFixture.componentRef.setInput('ariaLabel', 'First');
            directFixture.detectChanges();
            expect(dialog()!.getAttribute('aria-label')).toBe('First');

            directFixture.componentRef.setInput('ariaLabel', 'Second');
            directFixture.detectChanges();
            expect(dialog()!.getAttribute('aria-label')).toBe('Second');
        });

        it('should re-render when ariaLabelledBy changes', () => {
            open();
            directFixture.componentRef.setInput('ariaLabelledBy', 'label-1');
            directFixture.detectChanges();
            expect(dialog()!.getAttribute('aria-labelledBy')).toBe('label-1');

            directFixture.componentRef.setInput('ariaLabelledBy', 'label-2');
            directFixture.detectChanges();
            expect(dialog()!.getAttribute('aria-labelledBy')).toBe('label-2');
        });

        it('should re-render when styleClass changes', () => {
            open();
            directFixture.componentRef.setInput('styleClass', 'first-class');
            directFixture.detectChanges();
            expect(dialog()!.classList.contains('first-class')).toBe(true);
            expect(dialog()!.classList.contains('p-popover')).toBe(true);

            directFixture.componentRef.setInput('styleClass', 'second-class');
            directFixture.detectChanges();
            expect(dialog()!.classList.contains('first-class')).toBe(false);
            expect(dialog()!.classList.contains('second-class')).toBe(true);
        });

        it('should re-render when style changes', () => {
            open();
            directFixture.componentRef.setInput('style', { width: '300px' });
            directFixture.detectChanges();
            expect(dialog()!.style.width).toBe('300px');

            directFixture.componentRef.setInput('style', { width: '400px', padding: '10px' });
            directFixture.detectChanges();
            expect(dialog()!.style.width).toBe('400px');
            expect(dialog()!.style.padding).toBe('10px');
        });

        it('should layer the container from baseZIndex when autoZIndex is enabled', () => {
            const setSpy = vi.spyOn(ZIndexUtils, 'set');
            directFixture.componentRef.setInput('baseZIndex', 2000);
            open();

            directFixture.componentInstance.onAnimationStart({ element: dialog()! } as MotionEvent);
            expect(setSpy).toHaveBeenCalledWith('overlay', dialog(), 2000 + directFixture.componentInstance.config.zIndex.overlay);
            expect(dialog()!.style.zIndex).not.toBe('');
        });

        it('should not layer the container when autoZIndex is disabled', () => {
            const setSpy = vi.spyOn(ZIndexUtils, 'set');
            directFixture.componentRef.setInput('autoZIndex', false);
            open();

            directFixture.componentInstance.onAnimationStart({ element: dialog()! } as MotionEvent);
            expect(setSpy).not.toHaveBeenCalled();
            expect(dialog()!.style.zIndex).toBe('');
        });

        it('should skip focusing when focusOnShow is disabled', () => {
            open();
            const focusSpy = vi.spyOn(directFixture.componentInstance, 'focus');

            directFixture.componentRef.setInput('focusOnShow', false);
            directFixture.detectChanges();
            directFixture.componentInstance.onAnimationStart({ element: dialog()! } as MotionEvent);
            expect(focusSpy).not.toHaveBeenCalled();

            directFixture.componentRef.setInput('focusOnShow', true);
            directFixture.detectChanges();
            directFixture.componentInstance.onAnimationStart({ element: dialog()! } as MotionEvent);
            expect(focusSpy).toHaveBeenCalled();
        });
    });
});

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    imports: [Popover, PrimeTemplate],
    template: `
        <p-popover>
            <ng-template pTemplate="header">QUERY-HEADER</ng-template>
            <ng-template pTemplate="footer">QUERY-FOOTER</ng-template>
        </p-popover>
    `
})
class PopoverQueryApiHostComponent {}

describe('Popover Signal Query API', () => {
    it('should collect projected PrimeTemplates via the templates contentChildren query', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [PopoverQueryApiHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(PopoverQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const instance = fixture.debugElement.query(By.directive(Popover)).componentInstance;
        const templates = instance.templates();
        expect(Array.isArray(templates)).toBe(true);
        expect(templates.length).toBe(2);
        expect(templates.map((t: any) => t.getType())).toEqual(['header', 'footer']);
        expect(templates[0].template).toBeDefined();
        expect(instance._contentTemplate()).toBeUndefined();
    });
});

// ---------------------------------------------------------------------------
// Positioning with a local appendTo inside a dialog (optimus-ui#593)
// ---------------------------------------------------------------------------

@Component({
    imports: [Popover, Dialog],
    template: `
        <p-dialog header="Dialog" [visible]="true" [style]="{ width: '25rem' }">
            <div style="display: flex" #container>
                <button #targetButton style="margin-left: 40px" (click)="popover.toggle($event)">Open</button>
                <p-popover #popover [appendTo]="container">Popover</p-popover>
            </div>
        </p-dialog>
    `
})
class PopoverInDialogHostComponent {
    popover = viewChild.required<Popover>('popover');
    targetButton = viewChild.required('targetButton', { read: ElementRef });
}

@Component({
    imports: [Popover],
    template: `<p-popover #popover>Popover</p-popover>`
})
class PopoverAlignHostComponent {
    popover = viewChild.required<Popover>('popover');
}

describe('Popover positioning in a dialog with a local appendTo (optimus-ui#593)', () => {
    let host: HTMLElement | undefined;

    beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [PopoverInDialogHostComponent, PopoverAlignHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
    });

    afterEach(() => host?.remove());

    it('should align under the target when its containing block is a transformed, non-positioned dialog', () => {
        // Same layout as p-dialog: a fixed full-screen mask centering a dialog that has a transform, which makes the
        // dialog (not the mask) the containing block of the absolutely positioned popover.
        host = document.createElement('div');
        host.innerHTML = `
            <div style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center">
                <div style="transform: scale(1); width: 400px; height: 300px; padding: 40px; box-sizing: border-box">
                    <div class="local-container" style="display: flex">
                        <button class="target" style="width: 100px; height: 30px; margin-left: 60px; padding: 0; border: 0">Open</button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(host);

        const fixture = TestBed.createComponent(PopoverAlignHostComponent);
        fixture.detectChanges();
        const popover = fixture.componentInstance.popover();
        const target = host.querySelector('.target') as HTMLElement;
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position: absolute; width: 150px; height: 80px; border-radius: 0';
        host.querySelector('.local-container')!.appendChild(overlay);

        popover.target.set(target);
        popover.container.set(overlay as HTMLDivElement);
        popover.align();

        const targetRect = target.getBoundingClientRect();
        const overlayRect = overlay.getBoundingClientRect();

        expect(overlayRect.top).toBeCloseTo(targetRect.bottom, 0);
        expect(overlayRect.left).toBeCloseTo(targetRect.left, 0);
    });

    it('should open under its target when appended to a local container inside a p-dialog', async () => {
        const fixture = TestBed.createComponent(PopoverInDialogHostComponent);
        fixture.detectChanges();
        await new Promise((resolve) => setTimeout(resolve, 400));
        await fixture.whenStable();

        const target = fixture.componentInstance.targetButton().nativeElement as HTMLElement;
        target.click();
        fixture.detectChanges();
        await new Promise((resolve) => setTimeout(resolve, 400));
        await fixture.whenStable();

        const overlay = fixture.componentInstance.popover().container() as HTMLElement;
        expect(overlay).toBeTruthy();
        expect(overlay.parentElement).toBe(target.parentElement);

        const targetRect = target.getBoundingClientRect();
        const overlayRect = overlay.getBoundingClientRect();
        const gutter = parseFloat(getComputedStyle(overlay).marginTop) || 0;

        expect(overlayRect.top - gutter).toBeCloseTo(targetRect.bottom, 0);
        expect(overlayRect.left).toBeCloseTo(targetRect.left, 0);
        fixture.destroy();
    });
});

describe('Popover arrow position when the popover is shifted to fit the viewport (optimus-ui#122)', () => {
    let host: HTMLElement | undefined;

    beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [PopoverAlignHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
    });

    afterEach(() => host?.remove());

    // The arrow is centered at `arrow.offset` (1.25rem) + `--p-popover-arrow-left` from the left edge of the popover.
    const arrowCenter = (overlay: HTMLElement) => overlay.getBoundingClientRect().left + 20 + parseFloat(overlay.style.getPropertyValue('--p-popover-arrow-left'));

    const align = (targetStyle: string) => {
        host = document.createElement('div');
        host.innerHTML = `<button class="target" style="position: fixed; top: 10px; ${targetStyle}; width: 40px; height: 30px; padding: 0; border: 0">!</button>`;
        document.body.appendChild(host);

        const fixture = TestBed.createComponent(PopoverAlignHostComponent);
        fixture.detectChanges();
        const popover = fixture.componentInstance.popover();
        const target = host.querySelector('.target') as HTMLElement;
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position: absolute; width: 300px; height: 80px; border-radius: 12px';
        host.appendChild(overlay);

        popover.target.set(target);
        popover.container.set(overlay as HTMLDivElement);
        popover.align();

        return { target, overlay };
    };

    it('should point the arrow 1.25rem from the left of the target when the popover is not shifted', () => {
        const { target, overlay } = align('left: 10px');

        expect(overlay.getBoundingClientRect().left).toBeCloseTo(target.getBoundingClientRect().left, 0);
        expect(arrowCenter(overlay) - target.getBoundingClientRect().left).toBeCloseTo(20, 0);
    });

    it('should keep the arrow at the same place of a target at the right edge of the viewport', () => {
        const { target, overlay } = align('right: 0');
        const targetRect = target.getBoundingClientRect();

        // the popover is shifted to the left to stay in the viewport
        expect(overlay.getBoundingClientRect().left).toBeLessThan(targetRect.left);
        expect(arrowCenter(overlay) - targetRect.left).toBeCloseTo(20, 0);
    });
});
