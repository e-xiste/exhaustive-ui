import { ApplicationRef, ChangeDetectionStrategy, Component, createComponent, createEnvironmentInjector, EnvironmentInjector, ErrorHandler, Injectable, provideZonelessChangeDetection, inject, input } from '@angular/core';
import { DialogService } from './dialogservice';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Dialog } from '@exhaustive-ui/core/dialog';
import { Subject } from 'rxjs';
import { DynamicDialog } from './dynamicdialog';
import { DynamicDialogConfig } from './dynamicdialog-config';
import { DynamicDialogRef } from './dynamicdialog-ref';

// Test components to be used in dynamic dialogs
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <div class="test-component">
            <h3>Test Component Content</h3>
            <p>Data: {{ data }}</p>
            <button class="test-button" (click)="closeDialog()">Close</button>
        </div>
    `
})
class TestDialogContentComponent {
    private dialogRef = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);

    data: any;

    constructor() {
        this.data = this.config.data;
    }

    closeDialog() {
        this.dialogRef.close('closed from component');
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <div class="nested-dialog-content">
            <h3>Nested Dialog</h3>
            <p>Level: {{ level }}</p>
            <button class="close-nested" (click)="closeDialog()">Close</button>
        </div>
    `
})
class NestedDialogContentComponent {
    private dialogRef = inject(DynamicDialogRef);
    private config = inject(DynamicDialogConfig);

    level: number;

    constructor() {
        this.level = this.config.data?.level || 1;
    }

    closeDialog() {
        this.dialogRef.close(`closed from level ${this.level}`);
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <div class="dialog-within-dialog-content">
            <h3>Dialog Within Dialog</h3>
            <button class="inner-dialog-trigger" (click)="closeDialog()">Close</button>
        </div>
    `
})
class DialogWithinDialogComponent {
    private dialogRef = inject(DynamicDialogRef);

    closeDialog() {
        this.dialogRef.close('inner dialog closed');
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <div class="maximizable-content">
            <h3>Maximizable Dialog</h3>
            <p>This dialog can be maximized</p>
            <div style="height: 200px; overflow-y: auto;">
                @for (item of items; track item) {
                    <p>{{ item }}</p>
                }
            </div>
        </div>
    `
})
class MaximizableDialogComponent {
    items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <div class="resizable-content">
            <h3>Resizable Dialog</h3>
            <p>This dialog can be resized</p>
            <textarea style="width: 100%; height: 150px;" placeholder="Resize me"></textarea>
        </div>
    `
})
class ResizableDialogComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <div class="draggable-content">
            <h3>Draggable Dialog</h3>
            <p>Drag me around using the header</p>
        </div>
    `
})
class DraggableDialogComponent {}

describe('DynamicDialog', () => {
    let mockDialogRef: Record<string, any>;
    let mockConfig: DynamicDialogConfig;

    beforeEach(async () => {
        // Create spy objects
        mockDialogRef = {
            close: vi.fn(),
            destroy: vi.fn(),
            dragStart: vi.fn(),
            dragEnd: vi.fn(),
            resizeInit: vi.fn(),
            resizeEnd: vi.fn(),
            maximize: vi.fn(),
            onClose: new Subject(),
            onDestroy: new Subject(),
            onDragStart: new Subject(),
            onDragEnd: new Subject(),
            onResizeInit: new Subject(),
            onResizeEnd: new Subject(),
            onMaximize: new Subject(),
            onChildComponentLoaded: new Subject()
        };

        mockConfig = new DynamicDialogConfig();

        await TestBed.configureTestingModule({
            imports: [DynamicDialog],
            declarations: [TestDialogContentComponent, NestedDialogContentComponent, DialogWithinDialogComponent, MaximizableDialogComponent, ResizableDialogComponent, DraggableDialogComponent],
            providers: [{ provide: DynamicDialogRef, useValue: mockDialogRef }, { provide: DynamicDialogConfig, useValue: mockConfig }, provideZonelessChangeDetection()]
        }).compileComponents();
    });

    afterEach(async () => {
        // Clean up any pending animations/timers
        await new Promise((resolve) => setTimeout(resolve, 0));
    });

    describe('Component Initialization', () => {
        let fixture: ComponentFixture<DynamicDialog>;
        let component: DynamicDialog;

        beforeEach(async () => {
            mockConfig.header = 'Test Dialog';
            mockConfig.width = '500px';
            mockConfig.height = '400px';

            fixture = TestBed.createComponent(DynamicDialog);
            component = fixture.componentInstance;
            component.childComponentType.set(TestDialogContentComponent);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
        });

        it('should create the component', () => {
            expect(component).toBeTruthy();
        });

        it('should have default values', () => {
            expect(component.visible()).toBe(true);
            expect(component.maximized()).toBeUndefined();
            expect(component.resizing()).toBeUndefined();
        });

        it('should initialize with config values', () => {
            expect(component.header).toBe('Test Dialog');
            expect(component.ddconfig.width).toBe('500px');
            expect(component.ddconfig.height).toBe('400px');
        });

        it('should generate unique dialog ID', () => {
            expect(component.dialogId).toBeTruthy();
            expect(component.id).toBeTruthy();
        });

        it('should open with a custom content template without failing to load the child component', async () => {
            const handleError = vi.spyOn(TestBed.inject(ErrorHandler), 'handleError');
            const loaded = vi.fn();
            mockDialogRef.onChildComponentLoaded.subscribe(loaded);
            fixture.destroy();
            mockConfig.templates = { content: TestDialogContentComponent };

            const templateFixture = TestBed.createComponent(DynamicDialog);
            templateFixture.componentInstance.childComponentType.set(TestDialogContentComponent);
            templateFixture.changeDetectorRef.markForCheck();
            await templateFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 50));

            expect(templateFixture.nativeElement.querySelectorAll('.test-component').length).toBe(1);
            expect(templateFixture.componentInstance.componentRef()).toBeFalsy();
            expect(loaded).not.toHaveBeenCalled();
            expect(handleError).not.toHaveBeenCalled();
            mockConfig.templates = undefined;
        });

        it('should label the dialog by the generated header title id', async () => {
            mockConfig.showHeader = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const dialogElement = fixture.debugElement.query(By.css('[role="dialog"]'));
            const titleElement = fixture.debugElement.query(By.css('.p-dialog-title'));

            expect(dialogElement.nativeElement.getAttribute('aria-labelledby')).toContain('_header');
            expect(dialogElement.nativeElement.getAttribute('aria-labelledby')).toBe(titleElement.nativeElement.getAttribute('id'));
        });

        it('should prioritize ariaLabelledBy from config even when the header is hidden', async () => {
            mockConfig.showHeader = false;
            mockConfig.ariaLabelledBy = 'custom-label-id';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const dialogElement = fixture.debugElement.query(By.css('[role="dialog"]'));
            expect(dialogElement.nativeElement.getAttribute('aria-labelledby')).toBe('custom-label-id');
        });

        it('should load the child component after the first render and notify the dialog ref', () => {
            expect(component.componentRef()?.instance).toBeInstanceOf(TestDialogContentComponent);
            expect(fixture.nativeElement.querySelector('.test-component')).toBeTruthy();
        });
    });

    describe('Child Component Loading', () => {
        @Component({
            changeDetection: ChangeDetectionStrategy.OnPush,
            template: `<span class="input-content">{{ label() }}</span>`
        })
        class InputDialogContentComponent {
            label = input<string>('none');
        }

        it('should set the inputValues on the loaded child component and emit onChildComponentLoaded', async () => {
            const handleError = vi.spyOn(TestBed.inject(ErrorHandler), 'handleError');
            const loaded = vi.fn();
            mockDialogRef.onChildComponentLoaded.subscribe(loaded);

            const fixture = TestBed.createComponent(DynamicDialog);
            const component = fixture.componentInstance;
            component.childComponentType.set(InputDialogContentComponent);
            component.inputValues.set({ label: 'From inputValues' });
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const instance = component.componentRef()?.instance;
            expect(instance).toBeInstanceOf(InputDialogContentComponent);
            expect(loaded).toHaveBeenCalledWith(instance);
            expect(fixture.nativeElement.querySelector('.input-content').textContent).toBe('From inputValues');
        });
    });

    describe('Dialog Display and Hide Behavior', () => {
        let fixture: ComponentFixture<DynamicDialog>;
        let component: DynamicDialog;

        beforeEach(async () => {
            mockConfig.header = 'Test Dialog';
            mockConfig.closable = true;
            mockConfig.showHeader = true;
            mockConfig.closeOnEscape = true;

            fixture = TestBed.createComponent(DynamicDialog);
            component = fixture.componentInstance;
            component.childComponentType.set(TestDialogContentComponent);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
        });

        it('should be visible by default', () => {
            expect(component.visible()).toBe(true);
        });

        it('should hide dialog when close is called', () => {
            component.hide();
            expect(mockDialogRef.close).toHaveBeenCalled();
        });

        it('should close dialog when close method is called', async () => {
            component.close();
            expect(component.visible()).toBe(false);

            await fixture.whenStable();
            const dialog = fixture.debugElement.query(By.directive(Dialog)).componentInstance as Dialog;
            expect(dialog.visible()).toBe(false);
        });

        it('should handle close button click', async () => {
            // Close button is now handled by Dialog component
            // Test onDialogHide which gets called when dialog closes

            // Simulate the onHide event from Dialog
            component.onDialogHide({});
            await new Promise((resolve) => setTimeout(resolve, 100));

            expect(mockDialogRef.destroy).toHaveBeenCalled();
        });

        it('should call close on dialogRef on close icon click', async () => {
            const closeButton = fixture.debugElement.query(By.css('.p-dialog-close-button'));
            closeButton.nativeElement.click();
            expect(mockDialogRef.close).toHaveBeenCalled();
            expect(component.visible()).toBe(false);
        });

        it('should call close on dialogRef on Escape key press', async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));

            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27 });
            document.dispatchEvent(escapeEvent);

            expect(mockDialogRef.close).toHaveBeenCalled();
            expect(component.visible()).toBe(false);
        });
    });

    describe('Drag and Resize Events', () => {
        let fixture: ComponentFixture<DynamicDialog>;
        let component: DynamicDialog;
        let dialog: Dialog;

        beforeEach(async () => {
            mockConfig.resizable = true;
            mockConfig.draggable = true;
            mockConfig.header = 'Resizable Dialog';

            fixture = TestBed.createComponent(DynamicDialog);
            component = fixture.componentInstance;
            component.childComponentType.set(ResizableDialogComponent);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            dialog = fixture.debugElement.query(By.directive(Dialog)).componentInstance;
        });

        it('should forward the dialog resize events to the dialog ref', () => {
            const initEvent = new MouseEvent('mousedown');
            dialog.onResizeInit.emit(initEvent);

            expect(component.resizing()).toBe(true);
            expect(mockDialogRef.resizeInit).toHaveBeenCalledWith(initEvent);

            const endEvent = new MouseEvent('mouseup');
            dialog.onResizeEnd.emit(endEvent);

            expect(component.resizing()).toBe(false);
            expect(mockDialogRef.resizeEnd).toHaveBeenCalledWith(endEvent);
        });

        it('should forward the dialog drag end event to the dialog ref', () => {
            const dragEvent = new DragEvent('dragend');
            dialog.onDragEnd.emit(dragEvent);

            expect(mockDialogRef.dragEnd).toHaveBeenCalledWith(dragEvent);
        });

        it('should pass the config drag and resize options to the dialog', async () => {
            expect(dialog.draggable()).toBe(true);
            expect(dialog.resizable()).toBe(true);

            mockConfig.draggable = false;
            mockConfig.resizable = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(dialog.draggable()).toBe(false);
            expect(dialog.resizable()).toBe(false);
        });
    });

    describe('Maximize and Minimize', () => {
        let fixture: ComponentFixture<DynamicDialog>;
        let component: DynamicDialog;

        beforeEach(async () => {
            mockConfig.maximizable = true;
            mockConfig.header = 'Maximizable Dialog';
            mockConfig.showHeader = true;

            fixture = TestBed.createComponent(DynamicDialog);
            component = fixture.componentInstance;
            component.childComponentType.set(MaximizableDialogComponent);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
        });

        it('should track the maximize state reported by the dialog', () => {
            expect(component.maximized()).toBeUndefined();

            component.onDialogMaximize({ maximized: true });

            expect(component.maximized()).toBe(true);
            expect(mockDialogRef.maximize).toHaveBeenCalledWith({ maximized: true });

            component.onDialogMaximize({ maximized: false });

            expect(component.maximized()).toBe(false);
            expect(mockDialogRef.maximize).toHaveBeenCalledWith({ maximized: false });
        });

        it('should handle maximize button click', async () => {
            const maximizeButton = fixture.debugElement.query(By.css('.p-dialog-maximize-button'));
            expect(maximizeButton).toBeTruthy();

            maximizeButton.nativeElement.click();
            await new Promise((resolve) => setTimeout(resolve, 100));

            expect(component.maximized()).toBe(true);
        });

        it('should apply maximized class when maximized', async () => {
            // Get the dialog element from Dialog component
            const dialogElement = fixture.debugElement.query(By.css('p-dialog'));
            expect(dialogElement).toBeTruthy();

            // Click the maximize button which is in the Dialog component
            const maximizeButton = fixture.debugElement.query(By.css('.p-dialog-maximize-button'));
            expect(maximizeButton).toBeTruthy();

            maximizeButton.nativeElement.click();
            await new Promise((resolve) => setTimeout(resolve, 100));
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Check that maximized state is set
            expect(component.maximized()).toBe(true);
            expect(fixture.nativeElement.querySelector('.p-dialog').classList).toContain('p-dialog-maximized');
        });
    });

    describe('Focus Management and Accessibility', () => {
        let fixture: ComponentFixture<DynamicDialog>;
        let component: DynamicDialog;

        beforeEach(async () => {
            mockConfig.focusOnShow = true;
            mockConfig.focusTrap = true;
            mockConfig.header = 'Accessible Dialog';
            mockConfig.closeAriaLabel = 'Close Dialog';

            fixture = TestBed.createComponent(DynamicDialog);
            component = fixture.componentInstance;
            component.childComponentType.set(TestDialogContentComponent);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
        });

        it('should have correct ARIA attributes', async () => {
            const dialogElement = fixture.debugElement.query(By.css('[role="dialog"]'));
            expect(dialogElement).toBeTruthy();
            expect(dialogElement.nativeElement.getAttribute('role')).toBe('dialog');
            expect(dialogElement.nativeElement.getAttribute('aria-modal')).toBe('true');
        });

        it('should pass ariaLabelledBy from config to the dialog', async () => {
            mockConfig.ariaLabelledBy = 'custom-label-id';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const dialogElement = fixture.debugElement.query(By.css('[role="dialog"]'));
            expect(dialogElement.nativeElement.getAttribute('aria-labelledby')).toBe('custom-label-id');
        });

        it('should pass closeAriaLabel from config to the close button', () => {
            const dialog = fixture.debugElement.query(By.directive(Dialog)).componentInstance as Dialog;
            expect(dialog.closeAriaLabel()).toBe('Close Dialog');
        });
    });

    describe('Modal and Mask Interaction', () => {
        let fixture: ComponentFixture<DynamicDialog>;
        let component: DynamicDialog;

        const createDialog = async () => {
            fixture = TestBed.createComponent(DynamicDialog);
            component = fixture.componentInstance;
            component.childComponentType.set(TestDialogContentComponent);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 300));
        };

        const clickMask = () => {
            const mask = fixture.nativeElement.querySelector('.p-dialog-mask') as HTMLElement;
            mask.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        };

        beforeEach(() => {
            mockConfig.modal = true;
            mockConfig.closable = true;
            mockConfig.header = 'Modal Dialog';
        });

        it('should close through the dialog ref when the mask is clicked and dismissableMask is true', async () => {
            mockConfig.dismissableMask = true;
            await createDialog();

            clickMask();

            expect(mockDialogRef.close).toHaveBeenCalled();
            expect(component.visible()).toBe(false);
        });

        it('should not close on mask click when dismissableMask is false', async () => {
            mockConfig.dismissableMask = false;
            await createDialog();

            clickMask();

            expect(mockDialogRef.close).not.toHaveBeenCalled();
            expect(component.visible()).toBe(true);
        });
    });

    describe('Template and Content Projection', () => {
        let fixture: ComponentFixture<DynamicDialog>;
        let component: DynamicDialog;

        beforeEach(async () => {
            mockConfig.header = 'Template Dialog';
            mockConfig.footer = 'Footer Content';
            mockConfig.showHeader = true;

            fixture = TestBed.createComponent(DynamicDialog);
            component = fixture.componentInstance;
            component.childComponentType.set(TestDialogContentComponent);
        });

        it('should load child component correctly', () => {
            const mockViewContainer = {
                clear: vi.fn(),
                createComponent: vi.fn(() => ({
                    setInput: vi.fn(),
                    instance: {
                        data: mockConfig.data,
                        closeDialog: vi.fn()
                    } as unknown as TestDialogContentComponent
                }))
            };

            (component as any).insertionPoint = () =>
                ({
                    viewContainerRef: mockViewContainer as any
                }) as any;

            component.loadChildComponent(TestDialogContentComponent);

            expect(mockViewContainer.clear).toHaveBeenCalled();
            expect(mockViewContainer.createComponent).toHaveBeenCalledWith(TestDialogContentComponent);
        });

        it('should display header content', async () => {
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const headerElement = fixture.debugElement.query(By.css('.p-dialog-title'));
            expect(headerElement).toBeTruthy();
            expect(headerElement.nativeElement.textContent.trim()).toBe('Template Dialog');
        });

        it('should re-render the header when the config header changes', async () => {
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            mockConfig.header = 'Updated Dialog';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const headerElement = fixture.debugElement.query(By.css('.p-dialog-title'));
            expect(headerElement.nativeElement.textContent.trim()).toBe('Updated Dialog');
        });

        it('should display footer content', async () => {
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Footer is rendered as a plain div, not with .p-dialog-footer class in dynamic dialog
            const dialogContent = fixture.nativeElement;
            expect(dialogContent.textContent).toContain('Footer Content');
        });

        it('should hide header when showHeader is false', async () => {
            mockConfig.showHeader = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const headerElement = fixture.debugElement.query(By.css('.p-dialog-header'));
            expect(headerElement).toBeFalsy();
        });
    });

    describe('Dialog Within Dialog Edge Cases', () => {
        let fixture: ComponentFixture<DynamicDialog>;
        let component: DynamicDialog;

        beforeEach(async () => {
            mockConfig.header = 'Container Dialog';

            fixture = TestBed.createComponent(DynamicDialog);
            component = fixture.componentInstance;
            component.childComponentType.set(DialogWithinDialogComponent);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
        });

        it('should handle dialog opened within another dialog component', async () => {
            // Simulate opening a dialog within the current dialog component
            const innerDialogRef = new DynamicDialogRef();
            const innerDialogSpy = vi.spyOn(innerDialogRef, 'close');

            expect(innerDialogRef).toBeTruthy();
            expect(innerDialogRef.onClose).toBeTruthy();

            // Close the inner dialog
            innerDialogRef.close('inner closed');

            expect(innerDialogSpy).toHaveBeenCalledWith('inner closed');

            await new Promise((resolve) => setTimeout(resolve, 100));
        });

        it('should maintain separate dialog contexts', () => {
            // Each dialog should have its own config and ref
            expect(component.ddconfig).toBe(mockConfig);
            expect(component.ddconfig).toBe(mockConfig);

            // Inner dialogs should have their own contexts
            const innerDialogRef = new DynamicDialogRef();
            const innerConfig = new DynamicDialogConfig();
            innerConfig.header = 'Inner Dialog';

            expect(innerDialogRef).not.toBe(mockDialogRef);
            expect(innerConfig).not.toBe(mockConfig);
        });
    });

    describe('Cleanup and Memory Leak Prevention', () => {
        let fixture: ComponentFixture<DynamicDialog>;
        let component: DynamicDialog;

        beforeEach(async () => {
            mockConfig.header = 'Test Dialog';

            fixture = TestBed.createComponent(DynamicDialog);
            component = fixture.componentInstance;
            component.childComponentType.set(TestDialogContentComponent);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
        });

        it('should destroy the child component on destroy', () => {
            const destroy = vi.fn();
            component.componentRef.set({ destroy } as any);

            component.ngOnDestroy();

            expect(destroy).toHaveBeenCalled();
        });
    });

    describe('Breakpoints and Responsive Design', () => {
        let fixture: ComponentFixture<DynamicDialog>;
        let component: DynamicDialog;

        beforeEach(async () => {
            mockConfig.breakpoints = {
                '960px': '75vw',
                '640px': '90vw'
            };

            fixture = TestBed.createComponent(DynamicDialog);
            component = fixture.componentInstance;
            component.childComponentType.set(TestDialogContentComponent);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
        });

        it('should pass the breakpoints to the dialog, which creates the responsive style element', () => {
            const dialog = fixture.debugElement.query(By.directive(Dialog)).componentInstance as Dialog;

            expect(dialog.breakpoints()).toEqual({ '960px': '75vw', '640px': '90vw' });
            expect(dialog.styleElement()).toBeTruthy();
            expect(dialog.styleElement().innerHTML).toContain('75vw');
            expect(dialog.styleElement().innerHTML).toContain('90vw');
        });
    });
});

@Injectable()
class FeatureService {
    name = 'feature-scoped';
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<span class="feature-dialog-content">{{ feature.name }}</span>`
})
class FeatureDialogContentComponent {
    feature = inject(FeatureService);
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<span>host</span>`,
    providers: [DialogService]
})
class FeatureHostComponent {
    dialogService = inject(DialogService);
}

describe('DialogService injector hierarchy', () => {
    it('should resolve providers of the environment injector the DialogService belongs to (optimus-ui#631, optimus-ui#759)', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
        // a lazy route / child module environment that provides FeatureService
        const featureInjector = createEnvironmentInjector([FeatureService], TestBed.inject(EnvironmentInjector));
        const appRef = TestBed.inject(ApplicationRef);
        const hostRef = createComponent(FeatureHostComponent, { environmentInjector: featureInjector });
        appRef.attachView(hostRef.hostView);
        await appRef.whenStable();
        expect(hostRef.injector.get(FeatureService).name).toBe('feature-scoped');

        const errors: any[] = [];
        let ref: DynamicDialogRef | null = null;
        try {
            ref = hostRef.instance.dialogService.open(FeatureDialogContentComponent, { header: 'Feature' });
            await appRef.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (e) {
            errors.push(e);
        }

        expect(errors).toEqual([]);
        expect(document.querySelector('.feature-dialog-content')?.textContent).toBe('feature-scoped');
        ref?.close();
        await new Promise((resolve) => setTimeout(resolve, 400));
        hostRef.destroy();
        featureInjector.destroy();
    });
});

describe('DynamicDialog style binding', () => {
    it('should pass the same style object to the Dialog across change detection cycles (optimus-ui#896)', async () => {
        TestBed.resetTestingModule();
        const config = new DynamicDialogConfig();
        config.style = { color: 'red' };
        config.width = '300px';
        TestBed.configureTestingModule({
            imports: [DynamicDialog],
            providers: [{ provide: DynamicDialogConfig, useValue: config }, { provide: DynamicDialogRef, useValue: new DynamicDialogRef() }, provideZonelessChangeDetection()]
        });
        const fixture = TestBed.createComponent(DynamicDialog);
        fixture.detectChanges();
        const dialog = fixture.debugElement.query(By.directive(Dialog)).componentInstance as Dialog;
        const first = dialog.style();
        expect(first).toEqual({ color: 'red', width: '300px' });

        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        expect(dialog.style()).toBe(first);
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<span class="zoneless-dialog-content">zoneless</span>`
})
class ZonelessDialogContentComponent {}

describe('DialogService in a zoneless application', () => {
    it('should open and close a dialog without motion errors (optimus-ui#70)', async () => {
        TestBed.resetTestingModule();
        const errors: any[] = [];
        const onRejection = (event: PromiseRejectionEvent) => errors.push(event.reason);
        window.addEventListener('unhandledrejection', onRejection);
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection(), DialogService, { provide: ErrorHandler, useValue: { handleError: (e: any) => errors.push(e) } }]
        });
        const appRef = TestBed.inject(ApplicationRef);
        const ref = TestBed.inject(DialogService).open(ZonelessDialogContentComponent, { header: 'Zoneless', modal: true });
        await appRef.whenStable();
        await new Promise((resolve) => setTimeout(resolve, 400));

        expect(document.querySelector('.zoneless-dialog-content')).toBeTruthy();
        const dialog = document.querySelector('.p-dialog') as HTMLElement;
        expect(dialog.style.display).not.toBe('none');

        ref?.close();
        await appRef.whenStable();
        await new Promise((resolve) => setTimeout(resolve, 400));
        window.removeEventListener('unhandledrejection', onRejection);

        expect(errors).toEqual([]);
        expect(document.querySelector('.zoneless-dialog-content')).toBeNull();
    });
});
