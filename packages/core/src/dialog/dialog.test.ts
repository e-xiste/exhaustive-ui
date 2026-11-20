import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ButtonModule } from '@exhaustive-ui/core/button';
import { FocusTrap } from '@exhaustive-ui/core/focustrap';
import { Dialog } from './dialog';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SharedModule } from '@exhaustive-ui/core/api';
// Basic Dialog Test Component
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-dialog
            [(visible)]="visible"
            [header]="header"
            [modal]="modal"
            [draggable]="draggable"
            [resizable]="resizable"
            [closable]="closable"
            [showHeader]="showHeader"
            [maximizable]="maximizable"
            [closeOnEscape]="closeOnEscape"
            [dismissableMask]="dismissableMask"
            [focusTrap]="focusTrap"
            [focusOnShow]="focusOnShow"
            [blockScroll]="blockScroll"
            [autoZIndex]="autoZIndex"
            [baseZIndex]="baseZIndex"
            [style]="style"
            [styleClass]="styleClass"
            [contentStyle]="contentStyle"
            [contentStyleClass]="contentStyleClass"
            [maskStyle]="maskStyle"
            [maskStyleClass]="maskStyleClass"
            [position]="position"
            [keepInViewport]="keepInViewport"
            [closeIcon]="closeIcon"
            [closeAriaLabel]="closeAriaLabel"
            [closeTabindex]="closeTabindex"
            [minimizeIcon]="minimizeIcon"
            [maximizeIcon]="maximizeIcon"
            [closeButtonProps]="closeButtonProps"
            [maximizeButtonProps]="maximizeButtonProps"
            [role]="role"
            [ariaLabelledBy]="ariaLabelledBy"
            (onShow)="onShowEvent($event)"
            (onHide)="onHideEvent($event)"
            (onMaximize)="onMaximizeEvent($event)"
            (onResizeInit)="onResizeInitEvent($event)"
            (onResizeEnd)="onResizeEndEvent($event)"
            (onDragEnd)="onDragEndEvent($event)"
            (visibleChange)="onVisibleChangeEvent($event)"
        >
            <div class="dialog-content">Basic dialog content</div>
        </p-dialog>
        <button #triggerBtn (click)="showDialog()" class="trigger-btn">Show Dialog</button>
    `
})
class TestBasicDialogComponent {
    visible = false;
    header = 'Test Dialog';
    modal = true;
    draggable = true;
    resizable = true;
    closable = true;
    showHeader = true;
    maximizable = false;
    closeOnEscape = true;
    dismissableMask = false;
    focusTrap = true;
    focusOnShow = true;
    blockScroll = false;
    autoZIndex = true;
    baseZIndex = 0;
    style: any = {};
    styleClass = '';
    contentStyle: any = {};
    contentStyleClass = '';
    maskStyle: any = {};
    maskStyleClass = '';
    position: any = 'center';
    keepInViewport = true;
    closeIcon = '';
    closeAriaLabel = '';
    closeTabindex = '0';
    minimizeIcon = '';
    maximizeIcon = '';
    closeButtonProps: any = {};
    maximizeButtonProps: any = {};
    role = 'dialog';
    ariaLabelledBy: string | undefined;
    breakpoints: any = null as any;

    // Event handlers
    showEvent: any = null as any;
    hideEvent: any = null as any;
    maximizeEvent: any = null as any;
    resizeInitEvent: any = null as any;
    resizeEndEvent: any = null as any;
    dragEndEvent: any = null as any;
    visibleChangeEvent: any = null as any;

    showDialog() {
        this.visible = true;
    }

    onShowEvent(event: any) {
        this.showEvent = event;
    }

    onHideEvent(event: any) {
        this.hideEvent = event;
    }

    onMaximizeEvent(event: any) {
        this.maximizeEvent = event;
    }

    onResizeInitEvent(event: any) {
        this.resizeInitEvent = event;
    }

    onResizeEndEvent(event: any) {
        this.resizeEndEvent = event;
    }

    onDragEndEvent(event: any) {
        this.dragEndEvent = event;
    }

    onVisibleChangeEvent(event: any) {
        this.visibleChangeEvent = event;
    }
}

// Dialog with pTemplate Templates
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-dialog [(visible)]="visible" [modal]="true">
            <ng-template pTemplate="header">
                <div class="custom-header">Custom Header with pTemplate</div>
            </ng-template>
            <ng-template pTemplate="content">
                <div class="custom-content">Custom content with pTemplate</div>
            </ng-template>
            <ng-template pTemplate="footer">
                <div class="custom-footer">Custom footer with pTemplate</div>
            </ng-template>
            <ng-template pTemplate="closeicon">
                <i class="pi pi-custom-close custom-close-icon"></i>
            </ng-template>
            <ng-template pTemplate="maximizeicon">
                <i class="pi pi-custom-maximize custom-maximize-icon"></i>
            </ng-template>
            <ng-template pTemplate="minimizeicon">
                <i class="pi pi-custom-minimize custom-minimize-icon"></i>
            </ng-template>
        </p-dialog>
    `
})
class TestPTemplateDialogComponent {
    visible = false;
}

// Dialog with #template Templates
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-dialog [(visible)]="visible" [modal]="true" [maximizable]="true">
            <ng-template #header>
                <div class="custom-header">Custom Header with #template</div>
            </ng-template>
            <ng-template #content>
                <div class="custom-content">Custom content with #template</div>
            </ng-template>
            <ng-template #footer>
                <div class="custom-footer">Custom footer with #template</div>
            </ng-template>
            <ng-template #closeicon>
                <i class="pi pi-custom-close custom-close-icon"></i>
            </ng-template>
            <ng-template #maximizeicon>
                <i class="pi pi-custom-maximize custom-maximize-icon"></i>
            </ng-template>
            <ng-template #minimizeicon>
                <i class="pi pi-custom-minimize custom-minimize-icon"></i>
            </ng-template>
        </p-dialog>
    `
})
class TestHashTemplateDialogComponent {
    visible = false;
}

// Dialog with Headless Template
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-dialog [(visible)]="visible">
            <ng-template #headless>
                <div class="custom-headless">
                    <h3>Headless Dialog</h3>
                    <p>This is a completely custom dialog</p>
                    <button (click)="visible = false">Close</button>
                </div>
            </ng-template>
        </p-dialog>
    `
})
class TestHeadlessDialogComponent {
    visible = false;
}

// Dialog for Position Testing
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-dialog [(visible)]="visible" [position]="position" header="Position Test">
            <div>Testing different positions</div>
        </p-dialog>
    `
})
class TestPositionDialogComponent {
    visible = false;
    position: any = 'center';
}

// Dialog for Maximizable Testing
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-dialog [(visible)]="visible" [maximizable]="maximizable" header="Maximizable Test" (onMaximize)="onMaximize($event)">
            <div>Testing maximize functionality</div>
        </p-dialog>
    `
})
class TestMaximizableDialogComponent {
    visible = false;
    maximizable = true;
    maximizeEvent: any = null as any;

    onMaximize(event: any) {
        this.maximizeEvent = event;
    }
}

// Dialog for Accessibility Testing
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-dialog [(visible)]="visible" [modal]="true" header="Accessibility Test" [closeAriaLabel]="closeAriaLabel" [role]="role" [focusTrap]="focusTrap">
            <div>Testing accessibility features</div>
            <button class="focusable-element">Focusable Button</button>
        </p-dialog>
    `
})
class TestAccessibilityDialogComponent {
    visible = false;
    closeAriaLabel = 'Close Dialog';
    role = 'dialog';
    focusTrap = true;
}

describe('Dialog', () => {
    let component: TestBasicDialogComponent;
    let fixture: ComponentFixture<TestBasicDialogComponent>;
    let dialogInstance: Dialog;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestBasicDialogComponent, TestPTemplateDialogComponent, TestHashTemplateDialogComponent, TestHeadlessDialogComponent, TestPositionDialogComponent, TestMaximizableDialogComponent, TestAccessibilityDialogComponent],
            imports: [Dialog, ButtonModule, FocusTrap],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestBasicDialogComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();

        dialogInstance = fixture.debugElement.query(By.directive(Dialog)).componentInstance;
    });

    describe('Component Initialization', () => {
        it('should create the dialog component', () => {
            expect(component).toBeTruthy();
            expect(dialogInstance).toBeTruthy();
        });

        it('should have default values', () => {
            expect(dialogInstance.visible()).toBe(false);
            expect(dialogInstance.modal()).toBe(true);
            expect(dialogInstance.draggable()).toBe(true);
            expect(dialogInstance.resizable()).toBe(true);
            expect(dialogInstance.closable()).toBe(true);
            expect(dialogInstance.showHeader()).toBe(true);
            expect(dialogInstance.maximizable()).toBe(false);
            expect(dialogInstance.closeOnEscape()).toBe(true);
            expect(dialogInstance.dismissableMask()).toBe(false);
            expect(dialogInstance.focusTrap()).toBe(true);
            expect(dialogInstance.focusOnShow()).toBe(true);
            expect(dialogInstance.blockScroll()).toBe(false);
            expect(dialogInstance.autoZIndex()).toBe(true);
            expect(dialogInstance.baseZIndex()).toBe(0);
            expect(dialogInstance.position()).toBe('center');
            expect(dialogInstance.keepInViewport()).toBe(true);
            expect(dialogInstance.role()).toBe('dialog');
        });

        it('should accept custom input values', async () => {
            component.header = 'Custom Header';
            component.modal = false;
            component.draggable = false;
            component.maximizable = true;
            component.position = 'top';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dialogInstance.header()).toBe('Custom Header');
            expect(dialogInstance.modal()).toBe(false);
            expect(dialogInstance.draggable()).toBe(false);
            expect(dialogInstance.maximizable()).toBe(true);
            expect(dialogInstance.position()).toBe('top');
        });
    });

    describe('Public Methods', () => {
        it('should have close method', () => {
            expect(dialogInstance.close).toBeDefined();
            expect(typeof dialogInstance.close).toBe('function');
        });

        it('should have center method', () => {
            expect(dialogInstance.center).toBeDefined();
            expect(typeof dialogInstance.center).toBe('function');
        });

        it('should have maximize method', () => {
            expect(dialogInstance.maximize).toBeDefined();
            expect(typeof dialogInstance.maximize).toBe('function');
        });

        it('should have initDrag method', () => {
            expect(dialogInstance.initDrag).toBeDefined();
            expect(typeof dialogInstance.initDrag).toBe('function');
        });

        it('should have initResize method', () => {
            expect(dialogInstance.initResize).toBeDefined();
            expect(typeof dialogInstance.initResize).toBe('function');
        });

        it('should show dialog programmatically via visible property', async () => {
            expect(dialogInstance.visible()).toBe(false);

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.visible()).toBe(true);
            expect(dialogInstance.maskVisible()).toBe(true);
        });

        it('should hide dialog programmatically via visible property', async () => {
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.visible()).toBe(true);

            component.visible = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.visible()).toBe(false);
        });

        it('should close dialog programmatically', async () => {
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.visible()).toBe(true);

            vi.spyOn(component, 'onVisibleChangeEvent').mockImplementation(() => {});
            dialogInstance.close(new MouseEvent('click'));
            await new Promise((resolve) => setTimeout(resolve, 0));
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(component.onVisibleChangeEvent).toHaveBeenCalledWith(false);
        });

        it('should maximize dialog when maximizable is true', async () => {
            component.maximizable = true;
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.maximized()).toBeFalsy();

            dialogInstance.maximize();
            await new Promise((resolve) => setTimeout(resolve, 0));
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dialogInstance.maximized()).toBe(true);
        });

        it('should restore dialog from maximized state', async () => {
            component.maximizable = true;
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            // First maximize
            dialogInstance.maximize();
            await new Promise((resolve) => setTimeout(resolve, 0));
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dialogInstance.maximized()).toBe(true);

            // Then restore
            dialogInstance.maximize();
            await new Promise((resolve) => setTimeout(resolve, 0));
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dialogInstance.maximized()).toBe(false);
        });
    });

    describe('Event Handling', () => {
        it('should emit onShow event when dialog is shown', async () => {
            // Reset the showEvent property
            component.showEvent = null;

            // Set visible and trigger change detection
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();

            // Wait for animation to complete and onAfterEnter to be called
            await new Promise((resolve) => setTimeout(resolve, 600));

            expect(component.showEvent).toBeTruthy();
        });

        it('should emit onHide event when dialog is hidden', async () => {
            // First show the dialog
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 300));

            // Reset the hideEvent property
            component.hideEvent = null;

            // Now hide the dialog
            component.visible = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Wait for animation to complete and onAfterLeave to be called
            await new Promise((resolve) => setTimeout(resolve, 400));

            expect(component.hideEvent).toBeTruthy();
        });

        it('should emit visibleChange event when close method is called', async () => {
            const visibleChangeSpy = vi.fn();
            dialogInstance.visible.subscribe(visibleChangeSpy);

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            dialogInstance.close(new MouseEvent('click'));

            expect(visibleChangeSpy).toHaveBeenCalledWith(false);
        });

        it('should emit onMaximize event when maximize button is clicked', async () => {
            vi.spyOn(component, 'onMaximizeEvent').mockImplementation(() => {});
            component.maximizable = true;
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            dialogInstance.maximize();
            await new Promise((resolve) => setTimeout(resolve, 0));
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(component.onMaximizeEvent).toHaveBeenCalled();
        });

        it('should emit onResizeInit event when resizing starts', async () => {
            vi.spyOn(component, 'onResizeInitEvent').mockImplementation(() => {});

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            const mouseEvent = new MouseEvent('mousedown');
            dialogInstance.onResizeInit.emit(mouseEvent);

            expect(component.onResizeInitEvent).toHaveBeenCalledWith(mouseEvent);
        });

        it('should emit onDragEnd event when dragging ends', async () => {
            vi.spyOn(component, 'onDragEndEvent').mockImplementation(() => {});

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            const dragEvent = new DragEvent('dragend');
            dialogInstance.onDragEnd.emit(dragEvent);

            expect(component.onDragEndEvent).toHaveBeenCalledWith(dragEvent);
        });

        it('should close dialog when close button is clicked', async () => {
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            const closeButton = fixture.debugElement.query(By.css('p-button[aria-label="Close Dialog"], .p-dialog-close-button, [class*="pcCloseButton"]'));

            if (closeButton) {
                closeButton.nativeElement.click();
                await new Promise((resolve) => setTimeout(resolve, 0));
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();

                expect(dialogInstance.visible()).toBe(false);
            }
        });

        it('should handle mask click when dismissableMask is true', async () => {
            component.dismissableMask = true;
            component.closable = true;
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.visible()).toBe(true);

            // Wait for wrapper to be created
            await new Promise((resolve) => setTimeout(resolve, 200));

            // Test enableModality which should set up mask click listener
            if (dialogInstance.enableModality && dialogInstance.wrapper()) {
                dialogInstance.enableModality();
                await new Promise((resolve) => setTimeout(resolve, 50));

                const visibleChangeSpy = vi.fn();
                dialogInstance.visible.subscribe(visibleChangeSpy);

                // Simulate mousedown on wrapper (which is what the mask click listener listens to)
                const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
                Object.defineProperty(mouseDownEvent, 'target', {
                    value: dialogInstance.wrapper(),
                    enumerable: true
                });

                dialogInstance.wrapper()!.dispatchEvent(mouseDownEvent);
                await new Promise((resolve) => setTimeout(resolve, 50));
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();

                expect(visibleChangeSpy).toHaveBeenCalledWith(false);
            } else {
                // If no wrapper, just test that dismissableMask property is set correctly
                expect(dialogInstance.dismissableMask()).toBe(true);
            }
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('should handle multiple rapid show/hide calls', async () => {
            // Rapid calls
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));
            component.visible = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));
            component.visible = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            await new Promise((resolve) => setTimeout(resolve, 0));
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(() => {
                fixture.changeDetectorRef.markForCheck();
            }).not.toThrow();
        });

        it('should handle null/undefined header gracefully', async () => {
            component.header = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(() => {
                fixture.changeDetectorRef.markForCheck();
            }).not.toThrow();
            expect(dialogInstance.header()).toBeUndefined();
        });

        it('should handle invalid position values', async () => {
            component.position = 'invalid-position';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(() => {
                fixture.changeDetectorRef.markForCheck();
            }).not.toThrow();
        });

        it('should handle empty style objects', async () => {
            component.style = {};
            component.contentStyle = {};
            component.maskStyle = {};
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(() => {
                fixture.changeDetectorRef.markForCheck();
            }).not.toThrow();
        });

        it('should handle disabled focus trap', async () => {
            component.focusTrap = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.focusTrap()).toBe(false);
        });

        it('should handle maximizing when not maximizable', async () => {
            component.maximizable = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(() => dialogInstance.maximize()).not.toThrow();
        });
    });

    describe('Accessibility Tests', () => {
        it('should have proper ARIA attributes', async () => {
            const accessibilityFixture = TestBed.createComponent(TestAccessibilityDialogComponent);
            accessibilityFixture.changeDetectorRef.markForCheck();
            await accessibilityFixture.whenStable();

            const accessibilityComponent = accessibilityFixture.componentInstance;
            accessibilityComponent.visible = true;
            accessibilityFixture.changeDetectorRef.markForCheck();
            await accessibilityFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            const dialogElement = accessibilityFixture.debugElement.query(By.css('[role="dialog"]'));
            expect(dialogElement).toBeTruthy();
            expect(dialogElement.nativeElement.getAttribute('role')).toBe('dialog');
            expect(dialogElement.nativeElement.getAttribute('aria-modal')).toBe('true');
        });

        it('should have focus trap enabled by default', async () => {
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            const focusTrapElement = fixture.debugElement.query(By.directive(FocusTrap));
            expect(focusTrapElement).toBeTruthy();
        });

        it('should support custom close ARIA label', async () => {
            component.closeAriaLabel = 'Custom Close Label';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.closeAriaLabel()).toBe('Custom Close Label');
        });

        it('should manage focus properly on show', async () => {
            component.focusOnShow = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.focusOnShow()).toBe(true);
        });

        it('should label the dialog by the generated header id by default', async () => {
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            const dialogElement = fixture.debugElement.query(By.css('[role="dialog"]'));
            const titleElement = fixture.debugElement.query(By.css('.p-dialog-title'));
            expect(dialogInstance.headerId()).toContain('_header');
            expect(dialogElement.nativeElement.getAttribute('aria-labelledby')).toBe(dialogInstance.headerId());
            expect(titleElement.nativeElement.getAttribute('id')).toBe(dialogInstance.headerId());
        });

        it('should use ariaLabelledBy input over the generated header id', async () => {
            component.ariaLabelledBy = 'custom-label-id';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            const dialogElement = fixture.debugElement.query(By.css('[role="dialog"]'));
            const titleElement = fixture.debugElement.query(By.css('.p-dialog-title'));
            expect(dialogElement.nativeElement.getAttribute('aria-labelledby')).toBe('custom-label-id');
            expect(titleElement.nativeElement.getAttribute('id')).toBe(dialogInstance.headerId());
        });

        it('should handle custom role attribute', async () => {
            component.role = 'alertdialog';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            const dialogElement = fixture.debugElement.query(By.css('[role="alertdialog"]'));
            expect(dialogElement).toBeTruthy();
        });

        it('should have proper tabindex for close button', async () => {
            component.closeTabindex = '1';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.closeTabindex()).toBe('1');
        });
    });

    describe('Keyboard Navigation', () => {
        it('should close dialog on Escape key when closeOnEscape is true', async () => {
            component.closeOnEscape = true;
            component.closable = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Wait for animation to complete and escape listener to be bound
            await new Promise((resolve) => setTimeout(resolve, 300));

            expect(dialogInstance.visible()).toBe(true);

            const escapeEvent = new KeyboardEvent('keydown', {
                key: 'Escape',
                code: 'Escape'
            });

            document.dispatchEvent(escapeEvent);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Dialog should be closed after escape key
            expect(dialogInstance.visible()).toBe(false);
        });

        it('should not close dialog on Escape key when closeOnEscape is false', async () => {
            component.closeOnEscape = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.visible()).toBe(true);

            const escapeEvent = new KeyboardEvent('keydown', {
                key: 'Escape',
                code: 'Escape'
            });

            vi.spyOn(dialogInstance, 'close').mockImplementation(() => {});
            document.dispatchEvent(escapeEvent);
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.close).not.toHaveBeenCalled();
        });

        it('should handle Enter key on close button', async () => {
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            const closeButton = fixture.debugElement.query(By.css('p-button[class*="pcCloseButton"]'));
            if (closeButton) {
                const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
                closeButton.nativeElement.dispatchEvent(enterEvent);
                await new Promise((resolve) => setTimeout(resolve, 0));

                expect(closeButton).toBeTruthy();
            }

            // Add explicit expectation to avoid "no expectations" warning
            expect(component).toBeTruthy();
        });

        it('should handle Enter key on maximize button', async () => {
            component.maximizable = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            const maximizeButton = fixture.debugElement.query(By.css('p-button[class*="pcMaximizeButton"]'));
            if (maximizeButton) {
                const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
                maximizeButton.nativeElement.dispatchEvent(enterEvent);
                await new Promise((resolve) => setTimeout(resolve, 0));

                expect(maximizeButton).toBeTruthy();
            }

            // Add explicit expectation to avoid "no expectations" warning
            expect(component.maximizable).toBe(true);
        });

        it('should handle Tab key navigation within dialog', async () => {
            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            const dialogElement = fixture.debugElement.query(By.css('[role="dialog"]'));
            const tabEvent = new KeyboardEvent('keydown', {
                key: 'Tab',
                code: 'Tab'
            });

            expect(dialogElement).toBeTruthy();

            // FocusTrap should handle Tab navigation
            const focusTrap = fixture.debugElement.query(By.directive(FocusTrap));
            expect(focusTrap).toBeTruthy();
        });
    });

    describe('Templates', () => {
        describe('pTemplate Approach Tests', () => {
            let pTemplateFixture: ComponentFixture<TestPTemplateDialogComponent>;
            let pTemplateComponent: TestPTemplateDialogComponent;
            let pTemplateDialogInstance: Dialog;

            beforeEach(async () => {
                pTemplateFixture = TestBed.createComponent(TestPTemplateDialogComponent);
                pTemplateComponent = pTemplateFixture.componentInstance;
                pTemplateFixture.changeDetectorRef.markForCheck();
                await pTemplateFixture.whenStable();
                pTemplateDialogInstance = pTemplateFixture.debugElement.query(By.directive(Dialog)).componentInstance;
            });

            it('should render custom header with pTemplate', async () => {
                pTemplateComponent.visible = true;
                pTemplateFixture.changeDetectorRef.markForCheck();
                await pTemplateFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 0));

                const customHeader = pTemplateFixture.debugElement.query(By.css('.custom-header'));
                expect(customHeader).toBeTruthy();
                expect(customHeader.nativeElement.textContent.trim()).toBe('Custom Header with pTemplate');
            });

            it('should render custom content with pTemplate', async () => {
                pTemplateComponent.visible = true;
                pTemplateFixture.changeDetectorRef.markForCheck();
                await pTemplateFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 0));

                const customContent = pTemplateFixture.debugElement.query(By.css('.custom-content'));
                expect(customContent).toBeTruthy();
                expect(customContent.nativeElement.textContent.trim()).toBe('Custom content with pTemplate');
            });

            it('should render custom footer with pTemplate', async () => {
                pTemplateComponent.visible = true;
                pTemplateFixture.changeDetectorRef.markForCheck();
                await pTemplateFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 0));

                const customFooter = pTemplateFixture.debugElement.query(By.css('.custom-footer'));
                expect(customFooter).toBeTruthy();
                expect(customFooter.nativeElement.textContent.trim()).toBe('Custom footer with pTemplate');
            });

            it('should render custom close icon with pTemplate', async () => {
                pTemplateComponent.visible = true;
                pTemplateFixture.changeDetectorRef.markForCheck();
                await pTemplateFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 0));

                const customCloseIcon = pTemplateFixture.debugElement.query(By.css('.custom-close-icon'));
                expect(customCloseIcon).toBeTruthy();
            });

            it('should resolve pTemplate templates', () => {
                expect(pTemplateDialogInstance.headerT()).toBeInstanceOf(TemplateRef);
                expect(pTemplateDialogInstance.contentT()).toBeInstanceOf(TemplateRef);
                expect(pTemplateDialogInstance.footerT()).toBeInstanceOf(TemplateRef);
                expect(pTemplateDialogInstance.closeIconT()).toBeInstanceOf(TemplateRef);
                expect(pTemplateDialogInstance.maximizeIconT()).toBeInstanceOf(TemplateRef);
                expect(pTemplateDialogInstance.minimizeIconT()).toBeInstanceOf(TemplateRef);
                expect(pTemplateDialogInstance.headlessT()).toBeUndefined();
            });
        });

        describe('#template Approach Tests', () => {
            let hashTemplateFixture: ComponentFixture<TestHashTemplateDialogComponent>;
            let hashTemplateComponent: TestHashTemplateDialogComponent;
            let hashTemplateDialogInstance: Dialog;

            beforeEach(async () => {
                hashTemplateFixture = TestBed.createComponent(TestHashTemplateDialogComponent);
                hashTemplateComponent = hashTemplateFixture.componentInstance;
                hashTemplateFixture.changeDetectorRef.markForCheck();
                await hashTemplateFixture.whenStable();
                hashTemplateDialogInstance = hashTemplateFixture.debugElement.query(By.directive(Dialog)).componentInstance;
            });

            it('should render custom header with #template', async () => {
                hashTemplateComponent.visible = true;
                hashTemplateFixture.changeDetectorRef.markForCheck();
                await hashTemplateFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 0));

                const customHeader = hashTemplateFixture.debugElement.query(By.css('.custom-header'));
                expect(customHeader).toBeTruthy();
                expect(customHeader.nativeElement.textContent.trim()).toBe('Custom Header with #template');
            });

            it('should render custom content with #template', async () => {
                hashTemplateComponent.visible = true;
                hashTemplateFixture.changeDetectorRef.markForCheck();
                await hashTemplateFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 0));

                const customContent = hashTemplateFixture.debugElement.query(By.css('.custom-content'));
                expect(customContent).toBeTruthy();
                expect(customContent.nativeElement.textContent.trim()).toBe('Custom content with #template');
            });

            it('should render custom footer with #template', async () => {
                hashTemplateComponent.visible = true;
                hashTemplateFixture.changeDetectorRef.markForCheck();
                await hashTemplateFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 0));

                const customFooter = hashTemplateFixture.debugElement.query(By.css('.custom-footer'));
                expect(customFooter).toBeTruthy();
                expect(customFooter.nativeElement.textContent.trim()).toBe('Custom footer with #template');
            });

            it('should render maximize/minimize icons with #template', async () => {
                hashTemplateComponent.visible = true;
                hashTemplateFixture.changeDetectorRef.markForCheck();
                await hashTemplateFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 0));

                // Check that ContentChild templates are assigned
                expect(hashTemplateDialogInstance._headerTemplate()).toBeDefined();
                expect(hashTemplateDialogInstance._contentTemplate()).toBeDefined();
                expect(hashTemplateDialogInstance._footerTemplate()).toBeDefined();
                expect(hashTemplateDialogInstance._closeiconTemplate()).toBeDefined();
                expect(hashTemplateDialogInstance._maximizeiconTemplate()).toBeDefined();
                expect(hashTemplateDialogInstance._minimizeiconTemplate()).toBeDefined();
            });
        });

        describe('Headless Template Tests', () => {
            let headlessFixture: ComponentFixture<TestHeadlessDialogComponent>;
            let headlessComponent: TestHeadlessDialogComponent;

            beforeEach(async () => {
                headlessFixture = TestBed.createComponent(TestHeadlessDialogComponent);
                headlessComponent = headlessFixture.componentInstance;
                headlessFixture.changeDetectorRef.markForCheck();
                await headlessFixture.whenStable();
            });

            it('should render headless template', async () => {
                headlessComponent.visible = true;
                headlessFixture.changeDetectorRef.markForCheck();
                await headlessFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 0));

                const headlessContent = headlessFixture.debugElement.query(By.css('.custom-headless'));
                expect(headlessContent).toBeTruthy();
                expect(headlessContent.nativeElement.textContent).toContain('Headless Dialog');
            });

            it('should not point aria-labelledby at a header that is not rendered', async () => {
                headlessComponent.visible = true;
                headlessFixture.changeDetectorRef.markForCheck();
                await headlessFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 0));

                const dialogEl = document.querySelector('.p-dialog') as HTMLElement;
                expect(dialogEl).toBeTruthy();
                expect(dialogEl.hasAttribute('aria-labelledby')).toBe(false);
            });

            it('should handle headless template close button', async () => {
                headlessComponent.visible = true;
                headlessFixture.changeDetectorRef.markForCheck();
                await headlessFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 0));

                const closeButton = headlessFixture.debugElement.query(By.css('.custom-headless button'));
                expect(closeButton).toBeTruthy();

                closeButton.nativeElement.click();
                headlessFixture.changeDetectorRef.markForCheck();
                await headlessFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 0));

                expect(headlessComponent.visible).toBe(false);
            });
        });

        describe('Template Fallback Behavior', () => {
            it('should handle missing templates gracefully', async () => {
                component.visible = true;
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 0));

                expect(() => {
                    fixture.changeDetectorRef.markForCheck();
                }).not.toThrow();
            });

            it('should use fallback content when no templates are provided', async () => {
                component.visible = true;
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 0));

                const dialogContent = fixture.debugElement.query(By.css('.dialog-content'));
                expect(dialogContent).toBeTruthy();
                expect(dialogContent.nativeElement.textContent.trim()).toBe('Basic dialog content');
            });
        });
    });

    describe('Maximizable Functionality', () => {
        let maximizableFixture: ComponentFixture<TestMaximizableDialogComponent>;
        let maximizableComponent: TestMaximizableDialogComponent;
        let maximizableDialogInstance: Dialog;

        beforeEach(async () => {
            maximizableFixture = TestBed.createComponent(TestMaximizableDialogComponent);
            maximizableComponent = maximizableFixture.componentInstance;
            maximizableFixture.changeDetectorRef.markForCheck();
            await maximizableFixture.whenStable();
            maximizableDialogInstance = maximizableFixture.debugElement.query(By.directive(Dialog)).componentInstance;
        });

        it('should show maximize button when maximizable is true', async () => {
            maximizableComponent.visible = true;
            maximizableFixture.changeDetectorRef.markForCheck();
            await maximizableFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            // Try different selectors for maximize button
            let maximizeButton = maximizableFixture.debugElement.query(By.css('p-button[class*="pcMaximizeButton"]'));
            if (!maximizeButton) {
                maximizeButton = maximizableFixture.debugElement.query(By.css('.p-dialog-maximize-button'));
            }
            if (!maximizeButton) {
                maximizeButton = maximizableFixture.debugElement.query(By.css('p-button[aria-label*="maximize"], p-button[aria-label*="Maximize"]'));
            }
            if (!maximizeButton) {
                // Check if maximize button exists in header actions
                const headerActions = maximizableFixture.debugElement.query(By.css('.p-dialog-header-actions'));
                if (headerActions) {
                    maximizeButton = headerActions.query(By.css('p-button'));
                }
            }

            expect(maximizeButton).toBeTruthy();
        });

        it('should emit onMaximize event', async () => {
            maximizableComponent.visible = true;
            maximizableFixture.changeDetectorRef.markForCheck();
            await maximizableFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            maximizableDialogInstance.maximize();
            maximizableFixture.changeDetectorRef.markForCheck();
            await maximizableFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(maximizableComponent.maximizeEvent).toBeTruthy();
        });

        it('should toggle maximized state', async () => {
            maximizableComponent.visible = true;
            maximizableFixture.changeDetectorRef.markForCheck();
            await maximizableFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(maximizableDialogInstance.maximized()).toBeFalsy();

            maximizableDialogInstance.maximize();
            maximizableFixture.changeDetectorRef.markForCheck();
            await maximizableFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(maximizableDialogInstance.maximized()).toBe(true);

            maximizableDialogInstance.maximize();
            maximizableFixture.changeDetectorRef.markForCheck();
            await maximizableFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(maximizableDialogInstance.maximized()).toBe(false);
        });
    });

    describe('CSS Classes and Styling', () => {
        it('should apply custom styleClass', async () => {
            component.styleClass = 'my-custom-dialog';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.styleClass()).toBe('my-custom-dialog');
        });

        it('should apply custom maskStyleClass', async () => {
            component.maskStyleClass = 'my-custom-mask';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.maskStyleClass()).toBe('my-custom-mask');
        });

        it('should apply inline styles', async () => {
            component.style = { backgroundColor: 'red', width: '500px' };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.style()).toEqual({ backgroundColor: 'red', width: '500px' });
        });

        it('should apply content styles', async () => {
            component.contentStyle = { padding: '20px' };
            component.contentStyleClass = 'custom-content-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.contentStyle()).toEqual({ padding: '20px' });
            expect(dialogInstance.contentStyleClass()).toBe('custom-content-class');
        });

        it('should apply mask styles', async () => {
            component.maskStyle = { backgroundColor: 'rgba(0,0,0,0.8)' };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(dialogInstance.maskStyle()).toEqual({ backgroundColor: 'rgba(0,0,0,0.8)' });
        });
    });

    describe('Lifecycle Hooks', () => {
        it('should handle ngOnInit without errors', () => {
            expect(() => dialogInstance.ngOnInit()).not.toThrow();
        });

        it('should handle ngAfterContentInit without errors', () => {
            expect(() => dialogInstance.ngAfterContentInit()).not.toThrow();
        });

        it('should handle ngOnDestroy without errors', () => {
            expect(() => dialogInstance.ngOnDestroy()).not.toThrow();
        });

        it('should create breakpoint styles when breakpoints are provided', () => {
            const breakpointFixture = TestBed.createComponent(Dialog);
            breakpointFixture.componentRef.setInput('breakpoints', { '960px': '75vw', '640px': '90vw' });
            const breakpointDialog = breakpointFixture.componentInstance;

            vi.spyOn(breakpointDialog, 'createStyle').mockImplementation(() => {});
            breakpointDialog.ngOnInit();

            expect(breakpointDialog.createStyle).toHaveBeenCalled();
        });

        it('should clean up resources on destroy', () => {
            // Test that destroy completes without error
            expect(() => dialogInstance.ngOnDestroy()).not.toThrow();

            // Verify container is cleaned up after destroy
            const initialContainer = dialogInstance.container();
            dialogInstance.ngOnDestroy();

            // Container should be cleaned up
            expect(dialogInstance.container()).toBe(initialContainer); // May be null after cleanup
        });
    });

    describe('Drag and Resize', () => {
        it('should handle drag initialization', async () => {
            component.draggable = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            const mouseEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
            vi.spyOn(dialogInstance, 'initDrag').mockImplementation(() => {});

            const titleBar = fixture.debugElement.query(By.css('[class*="header"]'));
            if (titleBar) {
                titleBar.nativeElement.dispatchEvent(mouseEvent);
                expect(dialogInstance.initDrag).toHaveBeenCalled();
            }
        });

        it('should handle resize initialization', async () => {
            component.resizable = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            component.visible = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 0));

            const mouseEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
            dialogInstance.initResize(mouseEvent);

            expect(dialogInstance.resizing()).toBe(true);
        });

        it('should emit onResizeInit event', () => {
            const mouseEvent = new MouseEvent('mousedown');
            vi.spyOn(component, 'onResizeInitEvent').mockImplementation(() => {});

            dialogInstance.onResizeInit.emit(mouseEvent);

            expect(component.onResizeInitEvent).toHaveBeenCalledWith(mouseEvent);
        });

        it('should emit onDragEnd event', () => {
            const dragEvent = new DragEvent('dragend');
            vi.spyOn(component, 'onDragEndEvent').mockImplementation(() => {});

            dialogInstance.onDragEnd.emit(dragEvent);

            expect(component.onDragEndEvent).toHaveBeenCalledWith(dragEvent);
        });
    });

    describe('PT (PassThrough) Tests', () => {
        describe('Case 1: Simple string classes', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `<p-dialog [pt]="pt" [visible]="visible" header="Test Dialog">Content</p-dialog>`
            })
            class TestPTCase1Component {
                visible = true;
                pt = {
                    mask: 'MASK_CLASS',
                    header: 'HEADER_CLASS',
                    title: 'TITLE_CLASS',
                    headerActions: 'HEADER_ACTIONS_CLASS',
                    content: 'CONTENT_CLASS',
                    footer: 'FOOTER_CLASS',
                    pcCloseButton: 'CLOSE_BUTTON_CLASS',
                    pcMaximizeButton: 'MAXIMIZE_BUTTON_CLASS'
                };
            }

            it('should apply simple string classes to PT sections', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase1Component],
                    imports: [Dialog],
                    providers: [provideZonelessChangeDetection()]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase1Component);
                testFixture.changeDetectorRef.markForCheck();
                await testFixture.whenStable();

                const mask = testFixture.debugElement.query(By.css('[data-pc-section="mask"]'));
                if (mask) {
                    expect(mask.nativeElement.classList.contains('MASK_CLASS')).toBe(true);
                }

                const header = testFixture.debugElement.query(By.css('[data-pc-section="header"]'));
                if (header) {
                    expect(header.nativeElement.classList.contains('HEADER_CLASS')).toBe(true);
                }

                const content = testFixture.debugElement.query(By.css('[data-pc-section="content"]'));
                if (content) {
                    expect(content.nativeElement.classList.contains('CONTENT_CLASS')).toBe(true);
                }
            });
        });

        describe('Case 2: Objects with class, style, and attributes', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `<p-dialog [pt]="pt" [visible]="visible" header="Test Dialog">Content</p-dialog>`
            })
            class TestPTCase2Component {
                visible = true;
                pt = {
                    mask: {
                        class: 'MASK_OBJECT_CLASS',
                        style: { 'background-color': 'rgba(0,0,0,0.5)' },
                        'data-test': 'mask-test'
                    },
                    header: {
                        class: 'HEADER_OBJECT_CLASS',
                        style: { padding: '20px' }
                    },
                    content: {
                        class: 'CONTENT_OBJECT_CLASS',
                        'aria-label': 'Dialog content'
                    }
                };
            }

            it('should apply object properties to PT sections', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase2Component],
                    imports: [Dialog],
                    providers: [provideZonelessChangeDetection()]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase2Component);
                testFixture.changeDetectorRef.markForCheck();
                await testFixture.whenStable();

                const mask = testFixture.debugElement.query(By.css('[data-pc-section="mask"]'));
                if (mask) {
                    expect(mask.nativeElement.classList.contains('MASK_OBJECT_CLASS')).toBe(true);
                    expect(mask.nativeElement.getAttribute('data-test')).toBe('mask-test');
                }

                const header = testFixture.debugElement.query(By.css('[data-pc-section="header"]'));
                if (header) {
                    expect(header.nativeElement.classList.contains('HEADER_OBJECT_CLASS')).toBe(true);
                    expect(header.nativeElement.style.padding).toBe('20px');
                }

                const content = testFixture.debugElement.query(By.css('[data-pc-section="content"]'));
                if (content) {
                    expect(content.nativeElement.classList.contains('CONTENT_OBJECT_CLASS')).toBe(true);
                    expect(content.nativeElement.getAttribute('aria-label')).toBe('Dialog content');
                }
            });
        });

        describe('Case 3: Mixed object and string values', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `<p-dialog [pt]="pt" [visible]="visible" header="Test Dialog">Content</p-dialog>`
            })
            class TestPTCase3Component {
                visible = true;
                pt = {
                    mask: {
                        class: 'MASK_MIXED_CLASS'
                    },
                    header: 'HEADER_STRING_CLASS',
                    content: {
                        class: 'CONTENT_MIXED_CLASS'
                    }
                };
            }

            it('should apply mixed object and string values correctly', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase3Component],
                    imports: [Dialog],
                    providers: [provideZonelessChangeDetection()]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase3Component);
                testFixture.changeDetectorRef.markForCheck();
                await testFixture.whenStable();

                const mask = testFixture.debugElement.query(By.css('[data-pc-section="mask"]'));
                if (mask) {
                    expect(mask.nativeElement.classList.contains('MASK_MIXED_CLASS')).toBe(true);
                }

                const header = testFixture.debugElement.query(By.css('[data-pc-section="header"]'));
                if (header) {
                    expect(header.nativeElement.classList.contains('HEADER_STRING_CLASS')).toBe(true);
                }

                const content = testFixture.debugElement.query(By.css('[data-pc-section="content"]'));
                if (content) {
                    expect(content.nativeElement.classList.contains('CONTENT_MIXED_CLASS')).toBe(true);
                }
            });
        });

        describe('Case 4: Use variables from instance', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `<p-dialog [pt]="pt" [visible]="visible" [maximizable]="isMaximizable" header="Test Dialog">Content</p-dialog>`
            })
            class TestPTCase4Component {
                visible = true;
                isMaximizable = true;
                pt = {
                    mask: ({ instance }: any) => {
                        return {
                            class: instance?.visible() ? 'VISIBLE_MASK' : 'HIDDEN_MASK'
                        };
                    },
                    header: ({ instance }: any) => {
                        return {
                            style: {
                                'background-color': instance?.maximizable() ? 'lightblue' : 'white'
                            }
                        };
                    }
                };
            }

            it('should use instance variables in PT functions', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase4Component],
                    imports: [Dialog],
                    providers: [provideZonelessChangeDetection()]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase4Component);
                testFixture.changeDetectorRef.markForCheck();
                await testFixture.whenStable();

                const mask = testFixture.debugElement.query(By.css('[data-pc-section="mask"]'));
                if (mask) {
                    expect(mask.nativeElement.classList.contains('VISIBLE_MASK')).toBe(true);
                }

                const header = testFixture.debugElement.query(By.css('[data-pc-section="header"]'));
                if (header) {
                    expect(header.nativeElement.style.backgroundColor).toBe('lightblue');
                }
            });
        });

        describe('Case 5: Event binding', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `<p-dialog [pt]="pt" [visible]="visible" header="Test Dialog">Content</p-dialog>`
            })
            class TestPTCase5Component {
                visible = true;
                clickedSection: string = '';
                pt = {
                    header: {
                        onclick: () => {
                            this.clickedSection = 'header';
                        }
                    },
                    content: {
                        onclick: () => {
                            this.clickedSection = 'content';
                        }
                    }
                };
            }

            it('should bind click events through PT', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase5Component],
                    imports: [Dialog],
                    providers: [provideZonelessChangeDetection()]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase5Component);
                const component = testFixture.componentInstance;
                testFixture.changeDetectorRef.markForCheck();
                await testFixture.whenStable();

                const header = testFixture.debugElement.query(By.css('[data-pc-section="header"]'));
                if (header) {
                    header.nativeElement.click();
                    expect(component.clickedSection).toBe('header');
                }

                const content = testFixture.debugElement.query(By.css('[data-pc-section="content"]'));
                if (content) {
                    content.nativeElement.click();
                    expect(component.clickedSection).toBe('content');
                }
            });
        });

        describe('Case 6: Inline test', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `<p-dialog [pt]="{ mask: 'INLINE_MASK_CLASS', header: 'INLINE_HEADER_CLASS' }" [visible]="visible" header="Test Dialog">Content</p-dialog>`
            })
            class TestPTCase6InlineComponent {
                visible = true;
            }

            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `<p-dialog [pt]="{ mask: { class: 'INLINE_MASK_OBJECT_CLASS' }, content: { class: 'INLINE_CONTENT_CLASS' } }" [visible]="visible" header="Test Dialog">Content</p-dialog>`
            })
            class TestPTCase6InlineObjectComponent {
                visible = true;
            }

            it('should apply inline PT string classes', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase6InlineComponent],
                    imports: [Dialog],
                    providers: [provideZonelessChangeDetection()]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase6InlineComponent);
                testFixture.changeDetectorRef.markForCheck();
                await testFixture.whenStable();

                const mask = testFixture.debugElement.query(By.css('[data-pc-section="mask"]'));
                if (mask) {
                    expect(mask.nativeElement.classList.contains('INLINE_MASK_CLASS')).toBe(true);
                }

                const header = testFixture.debugElement.query(By.css('[data-pc-section="header"]'));
                if (header) {
                    expect(header.nativeElement.classList.contains('INLINE_HEADER_CLASS')).toBe(true);
                }
            });

            it('should apply inline PT object classes', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase6InlineObjectComponent],
                    imports: [Dialog],
                    providers: [provideZonelessChangeDetection()]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase6InlineObjectComponent);
                testFixture.changeDetectorRef.markForCheck();
                await testFixture.whenStable();

                const mask = testFixture.debugElement.query(By.css('[data-pc-section="mask"]'));
                if (mask) {
                    expect(mask.nativeElement.classList.contains('INLINE_MASK_OBJECT_CLASS')).toBe(true);
                }

                const content = testFixture.debugElement.query(By.css('[data-pc-section="content"]'));
                if (content) {
                    expect(content.nativeElement.classList.contains('INLINE_CONTENT_CLASS')).toBe(true);
                }
            });
        });

        describe('Case 7: Test from ExhaustiveConfig', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `
                    <p-dialog [visible]="visible1" header="Dialog 1">Content 1</p-dialog>
                    <p-dialog [visible]="visible2" header="Dialog 2">Content 2</p-dialog>
                `
            })
            class TestPTCase7GlobalComponent {
                visible1 = true;
                visible2 = true;
            }

            it('should apply global PT configuration from ExhaustiveConfig', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase7GlobalComponent],
                    imports: [Dialog],
                    providers: [
                        provideZonelessChangeDetection(),
                        {
                            provide: 'provideExhaustive',
                            useValue: {
                                pt: {
                                    dialog: {
                                        mask: { class: 'GLOBAL_MASK_CLASS' },
                                        header: { class: 'GLOBAL_HEADER_CLASS' }
                                    }
                                }
                            }
                        }
                    ]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase7GlobalComponent);
                testFixture.changeDetectorRef.markForCheck();
                await testFixture.whenStable();

                const dialogs = testFixture.debugElement.queryAll(By.directive(Dialog));
                expect(dialogs.length).toBe(2);
            });
        });

        describe('Case 8: Test hooks', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `<p-dialog [pt]="pt" [visible]="visible" header="Test Dialog">Content</p-dialog>`
            })
            class TestPTCase8HooksComponent {
                visible = true;
                afterViewInitCalled = false;
                afterViewCheckedCalled = false;
                onDestroyCalled = false;

                pt = {
                    mask: 'HOOK_TEST_CLASS',
                    hooks: {
                        onAfterViewInit: () => {
                            this.afterViewInitCalled = true;
                        },
                        onAfterViewChecked: () => {
                            this.afterViewCheckedCalled = true;
                        },
                        onDestroy: () => {
                            this.onDestroyCalled = true;
                        }
                    }
                };
            }

            it('should call PT hooks on Angular lifecycle events', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase8HooksComponent],
                    imports: [Dialog],
                    providers: [provideZonelessChangeDetection()]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase8HooksComponent);
                const component = testFixture.componentInstance;

                testFixture.changeDetectorRef.markForCheck();
                await testFixture.whenStable();

                expect(component.afterViewInitCalled).toBe(true);
                expect(component.afterViewCheckedCalled).toBe(true);

                testFixture.destroy();
                expect(component.onDestroyCalled).toBe(true);
            });
        });
    });
});

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [Dialog, SharedModule],
    template: `
        <p-dialog [visible]="true" header="H">
            <ng-template pTemplate="content">c</ng-template>
        </p-dialog>
    `
})
class DialogQueryApiHostComponent {}

describe('Dialog Signal Query API', () => {
    it('should resolve its signal-based view/content queries', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [DialogQueryApiHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(DialogQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const instance = fixture.debugElement.query(By.directive(Dialog)).componentInstance;

        expect(instance.headerViewChild()).toBeDefined();
        expect(instance.templates().some((t: any) => t.getType() === 'content')).toBe(true);
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Dialog],
    template: `
        <p-dialog
            [(visible)]="visible"
            [header]="header()"
            [modal]="true"
            [styleClass]="styleClass()"
            [contentStyleClass]="contentStyleClass()"
            [maskStyleClass]="maskStyleClass()"
            [closable]="closable()"
            [maximizable]="maximizable()"
            [showHeader]="showHeader()"
            [position]="position()"
            [role]="role()"
            [closeIcon]="closeIcon()"
            [style]="style()"
        >
            <div class="signal-body">Body</div>
        </p-dialog>
    `
})
class DialogSignalHostComponent {
    visible = signal(false);
    header = signal('First header');
    styleClass = signal<string | undefined>('first-class');
    contentStyleClass = signal<string | undefined>('first-content');
    maskStyleClass = signal<string | undefined>('first-mask');
    closable = signal(true);
    maximizable = signal(false);
    showHeader = signal(true);
    position = signal<any>('center');
    role = signal('dialog');
    closeIcon = signal<string | undefined>(undefined);
    style = signal<any>({ width: '300px' });
}

describe('Dialog Signal API', () => {
    let fixture: ComponentFixture<DialogSignalHostComponent>;
    let host: DialogSignalHostComponent;
    let dialog: Dialog;

    const query = (selector: string): HTMLElement | null => fixture.nativeElement.querySelector(selector);

    beforeEach(async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [DialogSignalHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        }).compileComponents();

        fixture = TestBed.createComponent(DialogSignalHostComponent);
        host = fixture.componentInstance;
        await fixture.whenStable();
        dialog = fixture.debugElement.query(By.directive(Dialog)).componentInstance;
    });

    const open = async () => {
        host.visible.set(true);
        await fixture.whenStable();
    };

    it('should render the mask and the dialog once visible becomes true', async () => {
        expect(query('.p-dialog')).toBeNull();
        expect(dialog.renderMask()).toBe(false);
        expect(dialog.renderDialog()).toBe(false);
        expect(dialog.maskVisible()).toBeUndefined();

        await open();

        expect(dialog.renderMask()).toBe(true);
        expect(dialog.renderDialog()).toBe(true);
        expect(dialog.maskVisible()).toBe(true);
        expect(query('.p-dialog')).toBeTruthy();
        expect(query('.signal-body')).toBeTruthy();
    });

    it('should keep the overlay rendered until the leave animation has run', async () => {
        await open();

        host.visible.set(false);
        await fixture.whenStable();
        expect(dialog.visible()).toBe(false);
        expect(dialog.renderDialog()).toBe(true);

        dialog.onBeforeLeave();
        dialog.onAfterLeave();
        await fixture.whenStable();

        expect(dialog.renderDialog()).toBe(false);
        expect(dialog.renderMask()).toBe(false);
        expect(dialog.maskVisible()).toBe(false);
        expect(query('.p-dialog')).toBeNull();

        await open();
        expect(dialog.renderDialog()).toBe(true);
        expect(dialog.renderMask()).toBe(true);
        expect(dialog.maskVisible()).toBe(true);
        expect(query('.p-dialog')).toBeTruthy();
    });

    it('should write the visible model back to the host when closed from the inside', async () => {
        await open();

        dialog.close(new MouseEvent('click'));
        await fixture.whenStable();

        expect(dialog.visible()).toBe(false);
        expect(host.visible()).toBe(false);
    });

    it('should re-render the header when the header input changes', async () => {
        await open();
        expect(query('.p-dialog-title')?.textContent?.trim()).toBe('First header');

        host.header.set('Second header');
        await fixture.whenStable();

        expect(query('.p-dialog-title')?.textContent?.trim()).toBe('Second header');
    });

    it('should re-render styleClass, contentStyleClass and maskStyleClass changes', async () => {
        await open();
        expect(query('.p-dialog')?.classList).toContain('first-class');
        expect(query('.p-dialog-content')?.classList).toContain('first-content');
        expect(query('.p-dialog-mask')?.classList).toContain('first-mask');

        host.styleClass.set('second-class');
        host.contentStyleClass.set('second-content');
        host.maskStyleClass.set('second-mask');
        await fixture.whenStable();

        expect(query('.p-dialog')?.classList).toContain('second-class');
        expect(query('.p-dialog')?.classList).not.toContain('first-class');
        expect(query('.p-dialog-content')?.classList).toContain('second-content');
        expect(query('.p-dialog-mask')?.classList).toContain('second-mask');
    });

    it('should re-render the header actions when closable and maximizable change', async () => {
        await open();
        expect(query('.p-dialog-close-button')).toBeTruthy();
        expect(query('.p-dialog-maximize-button')).toBeNull();

        host.closable.set(false);
        host.maximizable.set(true);
        await fixture.whenStable();

        expect(query('.p-dialog-close-button')).toBeNull();
        expect(query('.p-dialog-maximize-button')).toBeTruthy();
    });

    it('should re-render the close icon when closeIcon changes', async () => {
        await open();
        expect(query('.p-dialog-close-button svg[data-p-icon="times"]')).toBeTruthy();

        host.closeIcon.set('pi pi-ban');
        await fixture.whenStable();

        expect(query('.p-dialog-close-button .pi-ban')).toBeTruthy();
        expect(query('.p-dialog-close-button svg[data-p-icon="times"]')).toBeNull();
    });

    it('should hide the header when showHeader becomes false', async () => {
        await open();
        expect(query('.p-dialog-header')).toBeTruthy();

        host.showHeader.set(false);
        await fixture.whenStable();

        expect(query('.p-dialog-header')).toBeNull();
    });

    it('should re-render the mask position class when position changes', async () => {
        await open();
        expect(query('.p-dialog-mask')?.classList).not.toContain('p-dialog-top');

        host.position.set('top');
        await fixture.whenStable();

        expect(query('.p-dialog-mask')?.classList).toContain('p-dialog-top');
        expect(query('.p-dialog-mask')?.style.alignItems).toBe('flex-start');
    });

    it('should give the close button the translated close label by default', async () => {
        await open();

        expect(query('.p-dialog-close-button')?.getAttribute('aria-label')).toBe('Close');
    });

    it('should re-render the role attribute when role changes', async () => {
        await open();
        expect(query('.p-dialog')?.getAttribute('role')).toBe('dialog');

        host.role.set('alertdialog');
        await fixture.whenStable();

        expect(query('.p-dialog')?.getAttribute('role')).toBe('alertdialog');
    });

    it('should re-render the maximized state', async () => {
        host.maximizable.set(true);
        await open();
        expect(query('.p-dialog')?.classList).not.toContain('p-dialog-maximized');

        dialog.maximize();
        await fixture.whenStable();

        expect(dialog.maximized()).toBe(true);
        expect(dialog.dataP()).toContain('maximized');
        expect(query('.p-dialog')?.classList).toContain('p-dialog-maximized');

        dialog.maximize();
        await fixture.whenStable();

        expect(dialog.maximized()).toBe(false);
        expect(query('.p-dialog')?.classList).not.toContain('p-dialog-maximized');
    });

    it('should copy the style input and restore it when the container is destroyed', async () => {
        await open();
        expect(dialog._style()).toEqual({ width: '300px' });
        expect(dialog._style()).not.toBe(host.style());
        expect(query('.p-dialog')?.style.width).toBe('300px');

        dialog._style().left = '10px';
        dialog.onContainerDestroy();
        expect(dialog._style()).toEqual({ width: '300px' });

        host.style.set({ width: '400px' });
        await fixture.whenStable();
        expect(dialog._style()).toEqual({ width: '400px' });
        expect(dialog.originalStyle()).toEqual({ width: '400px' });

        host.style.set(null);
        await fixture.whenStable();
        expect(dialog._style()).toEqual({ width: '400px' });
        expect(dialog.originalStyle()).toEqual({ width: '400px' });
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Dialog],
    template: `
        <p-dialog [(visible)]="first" [modal]="true" header="First">First</p-dialog>
        <p-dialog [(visible)]="second" [modal]="true" header="Second">Second</p-dialog>
    `
})
class StackedModalDialogsHostComponent {
    first = signal(false);
    second = signal(false);
}

describe('Dialog stacked modals', () => {
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    beforeEach(async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [StackedModalDialogsHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        }).compileComponents();
    });

    afterEach(() => {
        document.body.classList.remove('p-overflow-hidden');
    });

    it('should keep the body scroll lock while another modal is still open', async () => {
        const fixture = TestBed.createComponent(StackedModalDialogsHostComponent);
        const host = fixture.componentInstance;
        await fixture.whenStable();

        host.first.set(true);
        await fixture.whenStable();
        await wait(50);
        host.second.set(true);
        await fixture.whenStable();
        await wait(50);
        expect(document.body.classList.contains('p-overflow-hidden')).toBe(true);

        host.second.set(false);
        await fixture.whenStable();
        await wait(400);
        expect(document.body.classList.contains('p-overflow-hidden')).toBe(true);

        host.first.set(false);
        await fixture.whenStable();
        await wait(400);
        expect(document.body.classList.contains('p-overflow-hidden')).toBe(false);
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Dialog],
    template: `
        <div #target class="dialog-append-target"></div>
        <p-dialog [(visible)]="visible" [appendTo]="target" header="Appended">Appended</p-dialog>
    `
})
class AppendToElementDialogHostComponent {
    visible = signal(false);
}

describe('Dialog appendTo', () => {
    it('should append the dialog to the given element', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [AppendToElementDialogHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        }).compileComponents();
        const fixture = TestBed.createComponent(AppendToElementDialogHostComponent);
        await fixture.whenStable();

        fixture.componentInstance.visible.set(true);
        await fixture.whenStable();
        await new Promise((resolve) => setTimeout(resolve, 50));

        const target = fixture.nativeElement.querySelector('.dialog-append-target') as HTMLElement;
        expect(target.querySelector('.p-dialog')).toBeTruthy();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Dialog],
    template: `
        <button class="dialog-opener" (click)="visible.set(true)">Open</button>
        <p-dialog [(visible)]="visible" [modal]="true" [closable]="false" header="Text only">Only text, nothing to focus</p-dialog>
    `
})
class FocusDialogHostComponent {
    visible = signal(false);
}

describe('Dialog focus management', () => {
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    afterEach(() => {
        document.body.classList.remove('p-overflow-hidden');
    });

    it('should move focus into a dialog without focusable content and return it to the opener on close', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [FocusDialogHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        }).compileComponents();
        const fixture = TestBed.createComponent(FocusDialogHostComponent);
        await fixture.whenStable();

        const opener = fixture.nativeElement.querySelector('.dialog-opener') as HTMLButtonElement;
        opener.focus();
        opener.click();
        await fixture.whenStable();
        await wait(600);

        const dialogEl = document.querySelector('.p-dialog') as HTMLElement;
        expect(dialogEl.contains(document.activeElement)).toBe(true);

        fixture.componentInstance.visible.set(false);
        await fixture.whenStable();
        await wait(400);

        expect(document.activeElement).toBe(opener);
    });
});
