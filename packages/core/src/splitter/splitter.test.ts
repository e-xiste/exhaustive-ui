import { ChangeDetectionStrategy, Component, DebugElement, Input, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Splitter } from './splitter';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SharedModule } from '@exhaustive-ui/core/api';
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-splitter
            [panelSizes]="panelSizes"
            [layout]="layout"
            [gutterSize]="gutterSize"
            [minSizes]="minSizes"
            [stateKey]="stateKey"
            [stateStorage]="stateStorage"
            [step]="step"
            [panelStyleClass]="panelStyleClass"
            [panelStyle]="panelStyle"
            [class]="styleClass"
            (onResizeStart)="onResizeStart($event)"
            (onResizeEnd)="onResizeEnd($event)"
        >
            <ng-template #panel>
                <div class="panel1">Panel 1</div>
            </ng-template>
            <ng-template #panel>
                <div class="panel2">Panel 2</div>
            </ng-template>
        </p-splitter>
    `
})
class TestSplitterComponent {
    panelSizes: number[] = [50, 50];
    layout = 'horizontal';
    gutterSize = 4;
    minSizes: number[] = [];
    stateKey: string | null = null as any;
    stateStorage = 'session';
    step = 5;
    panelStyleClass?: string;
    panelStyle?: any;
    styleClass?: string;

    resizeStartEvent: any;
    resizeEndEvent: any;

    onResizeStart(event: any) {
        this.resizeStartEvent = event;
    }

    onResizeEnd(event: any) {
        this.resizeEndEvent = event;
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-splitter>
            <ng-template #panel>
                <div>Panel 1</div>
            </ng-template>
            <ng-template #panel>
                <div>Panel 2</div>
            </ng-template>
            <ng-template #panel>
                <div>Panel 3</div>
            </ng-template>
        </p-splitter>
    `
})
class TestThreePanelComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-splitter [panelSizes]="[20, 80]">
            <ng-template #panel>
                <div>Panel 1</div>
            </ng-template>
            <ng-template #panel>
                <p-splitter layout="vertical" [panelSizes]="[30, 70]">
                    <ng-template #panel>
                        <div>Nested Panel 1</div>
                    </ng-template>
                    <ng-template #panel>
                        <div>Nested Panel 2</div>
                    </ng-template>
                </p-splitter>
            </ng-template>
        </p-splitter>
    `
})
class TestNestedSplitterComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-splitter [pt]="pt" [layout]="layout">
            <ng-template #panel>
                <div>PT Test Panel 1</div>
            </ng-template>
            <ng-template #panel>
                <div>PT Test Panel 2</div>
            </ng-template>
        </p-splitter>
    `
})
class TestPTSplitterComponent {
    @Input() pt: any;
    layout = 'horizontal';
}

describe('Splitter', () => {
    let testFixture: ComponentFixture<TestSplitterComponent>;
    let testComponent: TestSplitterComponent;
    let splitterEl: DebugElement;
    let splitterInstance: Splitter;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [Splitter],
            declarations: [TestSplitterComponent, TestThreePanelComponent, TestNestedSplitterComponent, TestPTSplitterComponent],
            providers: [provideZonelessChangeDetection()]
        });

        testFixture = TestBed.createComponent(TestSplitterComponent);
        testComponent = testFixture.componentInstance;
        testFixture.detectChanges();

        splitterEl = testFixture.debugElement.query(By.directive(Splitter));
        splitterInstance = splitterEl.componentInstance;
    });

    afterEach(() => {
        if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.clear();
        }
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.clear();
        }
    });

    describe('Component Initialization', () => {
        it('should create the component', () => {
            expect(splitterInstance).toBeTruthy();
        });

        it('should have default values', () => {
            const fixture = TestBed.createComponent(Splitter);
            const splitter = fixture.componentInstance;

            expect(splitter.layout()).toBe('horizontal');
            expect(splitter.gutterSize()).toBe(4);
            expect(splitter.step()).toBe(5);
            expect(splitter.stateStorage()).toBe('session');
            expect(splitter.stateKey()).toBeNull();
            expect(splitter.minSizes()).toEqual([]);
        });

        it('should accept custom values', async () => {
            testComponent.layout = 'vertical';
            testComponent.gutterSize = 8;
            testComponent.step = 10;
            testComponent.minSizes = [20, 30];
            testComponent.stateKey = 'test-splitter';
            testComponent.stateStorage = 'local';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.layout()).toBe('vertical');
            expect(splitterInstance.gutterSize()).toBe(8);
            expect(splitterInstance.step()).toBe(10);
            expect(splitterInstance.minSizes()).toEqual([20, 30]);
            expect(splitterInstance.stateKey()).toBe('test-splitter');
            expect(splitterInstance.stateStorage()).toBe('local');
        });
    });

    describe('Panel Rendering', () => {
        it('should render two panels by default', () => {
            const panels = testFixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            expect(panels.length).toBe(2);
        });

        it('should render panel content', () => {
            const panel1 = testFixture.debugElement.query(By.css('.panel1'));
            const panel2 = testFixture.debugElement.query(By.css('.panel2'));

            expect(panel1.nativeElement.textContent).toContain('Panel 1');
            expect(panel2.nativeElement.textContent).toContain('Panel 2');
        });

        it('should apply panel styles', async () => {
            testComponent.panelStyleClass = 'custom-panel-class';
            testComponent.panelStyle = { backgroundColor: 'red' };
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const panels = testFixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            expect(panels[0].nativeElement.className).toContain('custom-panel-class');
        });

        it('should render three panels', () => {
            const fixture = TestBed.createComponent(TestThreePanelComponent);
            fixture.detectChanges();

            const panels = fixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            const gutters = fixture.debugElement.queryAll(By.css('.p-splitter-gutter'));

            expect(panels.length).toBe(3);
            expect(gutters.length).toBe(2); // 3 panels = 2 gutters
        });
    });

    describe('Gutter Functionality', () => {
        it('should render gutter between panels', () => {
            const gutters = testFixture.debugElement.queryAll(By.css('.p-splitter-gutter'));
            expect(gutters.length).toBe(1);
        });

        it('should render gutter handle', () => {
            const handle = testFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));
            expect(handle).toBeTruthy();
        });

        it('should set gutter size', async () => {
            testComponent.gutterSize = 10;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const style = splitterInstance.gutterStyle();
            expect(style).toEqual({ width: '10px' });
        });

        it('should set gutter size for vertical layout', async () => {
            testComponent.layout = 'vertical';
            testComponent.gutterSize = 8;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const style = splitterInstance.gutterStyle();
            expect(style).toEqual({ height: '8px' });
        });

        it('should have proper ARIA attributes', () => {
            const handle = testFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));
            expect(handle.nativeElement.getAttribute('aria-orientation')).toBe('horizontal');
            expect(handle.nativeElement.getAttribute('tabindex')).toBe('0');
        });
    });

    describe('Panel Sizes with Different Units', () => {
        it('should handle numeric values as percentages', async () => {
            testComponent.panelSizes = [30, 70];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance._panelSizes()).toEqual([30, 70]);
        });

        it('should handle custom percentage values', async () => {
            testComponent.panelSizes = [25, 75];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance._panelSizes()).toEqual([25, 75]);
        });

        it('should split equally when no sizes provided', async () => {
            const fixture = TestBed.createComponent(TestThreePanelComponent);
            fixture.detectChanges();
            await fixture.whenStable();

            const splitter: Splitter = fixture.debugElement.query(By.directive(Splitter)).componentInstance;
            const panels = fixture.debugElement.queryAll(By.css('.p-splitterpanel'));

            // When no sizes provided, should split equally
            expect(splitter._panelSizes()).toEqual([100 / 3, 100 / 3, 100 / 3]);
            expect(panels[0].nativeElement.style.flexBasis).toMatch(/^calc\(33\.333\d*% - 8px\)$/);
        });
    });

    describe('Mouse Resize Operations', () => {
        it('should start resize on mouse down', () => {
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));
            const mouseEvent = new MouseEvent('mousedown');
            Object.defineProperty(mouseEvent, 'pageX', { value: 100, writable: true });
            Object.defineProperty(mouseEvent, 'pageY', { value: 100, writable: true });

            vi.spyOn(splitterInstance, 'resizeStart').mockImplementation(() => {});
            gutter.nativeElement.dispatchEvent(mouseEvent);

            expect(splitterInstance.resizeStart).toHaveBeenCalled();
        });

        it('should emit onResizeStart event', () => {
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));
            const mouseEvent = new MouseEvent('mousedown');
            Object.defineProperty(mouseEvent, 'pageX', { value: 100, writable: true });
            Object.defineProperty(mouseEvent, 'pageY', { value: 100, writable: true });
            Object.defineProperty(mouseEvent, 'currentTarget', { value: gutter.nativeElement, writable: true });

            splitterInstance.resizeStart(mouseEvent, 0);

            expect(testComponent.resizeStartEvent).toBeDefined();
            expect(testComponent.resizeStartEvent.originalEvent).toBe(mouseEvent);
            expect(testComponent.resizeStartEvent.sizes).toEqual(splitterInstance._panelSizes());
        });

        it('should emit onResizeEnd event', () => {
            const mouseEvent = new MouseEvent('mouseup');
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));
            splitterInstance.gutterElement.set(gutter.nativeElement);

            splitterInstance.resizeEnd(mouseEvent);

            expect(testComponent.resizeEndEvent).toBeDefined();
            expect(testComponent.resizeEndEvent.originalEvent).toBe(mouseEvent);
        });

        it('should validate resize with minSizes', async () => {
            testComponent.minSizes = [20, 30];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.validateResize(25, 35)).toBe(true);
            expect(splitterInstance.validateResize(15, 35)).toBe(false);
            expect(splitterInstance.validateResize(25, 25)).toBe(false);
        });
    });

    describe('Touch Resize Operations', () => {
        it('should handle touch start', () => {
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));

            vi.spyOn(splitterInstance, 'onGutterTouchStart').mockImplementation(() => {});

            const touchEvent = new TouchEvent('touchstart', { cancelable: true });
            gutter.nativeElement.dispatchEvent(touchEvent);

            expect(splitterInstance.onGutterTouchStart).toHaveBeenCalled();
        });

        it('should handle touch move', () => {
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));

            vi.spyOn(splitterInstance, 'onGutterTouchMove').mockImplementation(() => {});

            const touchEvent = new TouchEvent('touchmove', { cancelable: true });
            gutter.nativeElement.dispatchEvent(touchEvent);

            expect(splitterInstance.onGutterTouchMove).toHaveBeenCalled();
        });

        it('should handle touch end', () => {
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));

            vi.spyOn(splitterInstance, 'onGutterTouchEnd').mockImplementation(() => {});

            const touchEvent = new TouchEvent('touchend', { cancelable: true });
            gutter.nativeElement.dispatchEvent(touchEvent);

            expect(splitterInstance.onGutterTouchEnd).toHaveBeenCalled();
        });
    });

    describe('Keyboard Navigation', () => {
        let gutterHandle: DebugElement;

        beforeEach(() => {
            gutterHandle = testFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));
        });

        describe('Horizontal Layout', () => {
            beforeEach(async () => {
                testComponent.layout = 'horizontal';
                testFixture.changeDetectorRef.markForCheck();
                await testFixture.whenStable();
                testFixture.detectChanges();
            });

            it('should handle left arrow key', async () => {
                const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
                vi.spyOn(splitterInstance, 'setTimer').mockImplementation(() => {});

                gutterHandle.nativeElement.dispatchEvent(event);

                expect(splitterInstance.setTimer).toHaveBeenCalledWith(event, 0, -5);
            });

            it('should handle right arrow key', async () => {
                const event = new KeyboardEvent('keydown', { code: 'ArrowRight' });
                vi.spyOn(splitterInstance, 'setTimer').mockImplementation(() => {});

                gutterHandle.nativeElement.dispatchEvent(event);

                expect(splitterInstance.setTimer).toHaveBeenCalledWith(event, 0, 5);
            });

            it('should not handle up/down arrows in horizontal mode', () => {
                const upEvent = new KeyboardEvent('keydown', { code: 'ArrowUp' });
                const downEvent = new KeyboardEvent('keydown', { code: 'ArrowDown' });
                vi.spyOn(splitterInstance, 'setTimer').mockImplementation(() => {});

                gutterHandle.nativeElement.dispatchEvent(upEvent);
                gutterHandle.nativeElement.dispatchEvent(downEvent);

                expect(splitterInstance.setTimer).not.toHaveBeenCalled();
            });

            it('should use custom step value', async () => {
                testComponent.step = 10;
                testFixture.changeDetectorRef.markForCheck();
                await testFixture.whenStable();
                testFixture.detectChanges();

                const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
                vi.spyOn(splitterInstance, 'setTimer').mockImplementation(() => {});

                gutterHandle.nativeElement.dispatchEvent(event);

                expect(splitterInstance.setTimer).toHaveBeenCalledWith(event, 0, -10);
            });
        });

        describe('Vertical Layout', () => {
            beforeEach(async () => {
                testComponent.layout = 'vertical';
                testFixture.changeDetectorRef.markForCheck();
                await testFixture.whenStable();
                testFixture.detectChanges();
            });

            it('should handle up arrow key', async () => {
                const event = new KeyboardEvent('keydown', { code: 'ArrowUp' });
                vi.spyOn(splitterInstance, 'setTimer').mockImplementation(() => {});

                gutterHandle.nativeElement.dispatchEvent(event);

                expect(splitterInstance.setTimer).toHaveBeenCalledWith(event, 0, 5);
            });

            it('should handle down arrow key', async () => {
                const event = new KeyboardEvent('keydown', { code: 'ArrowDown' });
                vi.spyOn(splitterInstance, 'setTimer').mockImplementation(() => {});

                gutterHandle.nativeElement.dispatchEvent(event);

                expect(splitterInstance.setTimer).toHaveBeenCalledWith(event, 0, -5);
            });

            it('should not handle left/right arrows in vertical mode', () => {
                const leftEvent = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
                const rightEvent = new KeyboardEvent('keydown', { code: 'ArrowRight' });
                vi.spyOn(splitterInstance, 'setTimer').mockImplementation(() => {});

                gutterHandle.nativeElement.dispatchEvent(leftEvent);
                gutterHandle.nativeElement.dispatchEvent(rightEvent);

                expect(splitterInstance.setTimer).not.toHaveBeenCalled();
            });
        });

        it('should clear timer on key up', () => {
            const event = new KeyboardEvent('keyup');
            vi.spyOn(splitterInstance, 'clearTimer').mockImplementation(() => {});
            vi.spyOn(splitterInstance, 'resizeEnd').mockImplementation(() => {});

            gutterHandle.nativeElement.dispatchEvent(event);

            expect(splitterInstance.clearTimer).toHaveBeenCalled();
            expect(splitterInstance.resizeEnd).toHaveBeenCalled();
        });
    });

    describe('State Management', () => {
        it('should save state to sessionStorage', async () => {
            testComponent.stateKey = 'test-splitter';
            testComponent.panelSizes = [40, 60];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            splitterInstance.saveState();

            const savedState = window.sessionStorage.getItem('test-splitter');
            expect(savedState).toBe(JSON.stringify([40, 60]));
        });

        it('should save state with custom sizes', async () => {
            testComponent.stateKey = 'test-splitter-custom';
            testComponent.panelSizes = [30, 70];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            splitterInstance.saveState();

            const savedState = window.sessionStorage.getItem('test-splitter-custom');
            expect(savedState).toBe(JSON.stringify([30, 70]));
        });

        it('should restore state from sessionStorage', async () => {
            window.sessionStorage.setItem('test-restore', JSON.stringify([25, 75]));

            testComponent.stateKey = 'test-restore';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const restored = splitterInstance.restoreState();
            expect(restored).toBe(true);
            expect(splitterInstance._panelSizes()).toEqual([25, 75]);
        });

        it('should restore state from localStorage', async () => {
            window.localStorage.setItem('test-local', JSON.stringify([20, 80]));

            testComponent.stateKey = 'test-local';
            testComponent.stateStorage = 'local';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const restored = splitterInstance.restoreState();
            expect(restored).toBe(true);
            expect(splitterInstance._panelSizes()).toEqual([20, 80]);
        });

        it('should return false when no state exists', async () => {
            testComponent.stateKey = 'non-existent';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const restored = splitterInstance.restoreState();
            expect(restored).toBe(false);
        });

        it('should check if splitter is stateful', async () => {
            expect(splitterInstance.isStateful()).toBe(false);

            testComponent.stateKey = 'test-key';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.isStateful()).toBe(true);
        });

        it('should throw error for invalid stateStorage', async () => {
            testComponent.stateStorage = 'invalid' as any;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(() => splitterInstance.getStorage()).toThrowError();
        });
    });

    describe('Nested Splitters', () => {
        it('should render nested splitters', () => {
            const fixture = TestBed.createComponent(TestNestedSplitterComponent);
            fixture.detectChanges();

            const splitters = fixture.debugElement.queryAll(By.directive(Splitter));
            expect(splitters.length).toBe(2);

            const horizontalSplitter = splitters[0].componentInstance;
            const verticalSplitter = splitters[1].componentInstance;

            expect(horizontalSplitter.layout()).toBe('horizontal');
            expect(verticalSplitter.layout()).toBe('vertical');
        });
    });

    describe('Helper Methods', () => {
        it('should correctly identify horizontal layout', async () => {
            testComponent.layout = 'horizontal';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.horizontal()).toBe(true);
        });

        it('should correctly identify vertical layout', async () => {
            testComponent.layout = 'vertical';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.horizontal()).toBe(false);
        });
    });

    describe('CSS Classes and Styling', () => {
        it('should apply custom class', async () => {
            testComponent.styleClass = 'custom-splitter-class';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const splitterElement = testFixture.debugElement.query(By.css('p-splitter'));
            expect(splitterElement.nativeElement.className).toContain('custom-splitter-class');
        });

        it('should apply custom panel styles', async () => {
            testComponent.panelStyle = { border: '2px solid red', padding: '10px' };
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const panelElements = testFixture.debugElement.queryAll(By.css('.p-splitterpanel'));

            // Check that splitter component received the style input
            const panelStyle = splitterInstance.panelStyle();
            expect(panelStyle).toEqual({ border: '2px solid red', padding: '10px' });

            const element = panelElements[0].nativeElement;

            // Verify the ngStyle binding applied the styles to the panel
            expect(element.style.border).toBe('2px solid red');
            expect(element.style.padding).toBe('10px');

            // Also verify the template binding
            expect(panelStyle).toBeTruthy();
            expect(Object.keys(panelStyle!)).toContain('border');
            expect(Object.keys(panelStyle!)).toContain('padding');
        });

        it('should apply resizing classes during resize', () => {
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));
            const mouseEvent = new MouseEvent('mousedown');
            Object.defineProperty(mouseEvent, 'pageX', { value: 100, writable: true });
            Object.defineProperty(mouseEvent, 'pageY', { value: 100, writable: true });
            Object.defineProperty(mouseEvent, 'currentTarget', { value: gutter.nativeElement, writable: true });

            splitterInstance.resizeStart(mouseEvent, 0);
            expect(splitterInstance.el.nativeElement.className).toContain('p-splitter-resizing');

            splitterInstance.resizeEnd(mouseEvent);
            expect(splitterInstance.el.nativeElement.className).not.toContain('p-splitter-resizing');
        });
    });

    describe('Accessibility', () => {
        it('should have separator role on gutter', () => {
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));
            expect(gutter.nativeElement.getAttribute('role')).toBe('separator');
        });

        it('should set aria-orientation on handle', async () => {
            const handle = testFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));

            testComponent.layout = 'horizontal';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();
            expect(handle.nativeElement.getAttribute('aria-orientation')).toBe('horizontal');

            testComponent.layout = 'vertical';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();
            expect(handle.nativeElement.getAttribute('aria-orientation')).toBe('vertical');
        });

        it('should be keyboard navigable', () => {
            const handle = testFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));
            expect(handle.nativeElement.getAttribute('tabindex')).toBe('0');
        });

        it('should update aria-valuenow during resize', async () => {
            const handle = testFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));

            testComponent.panelSizes = [30, 70];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            // After component initialization, prevSize should be set
            expect(handle.nativeElement.getAttribute('aria-valuenow')).toBeTruthy();
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty panelSizes array', async () => {
            testComponent.panelSizes = [];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance._panelSizes()).toBeDefined();
        });

        it('should handle invalid minSizes gracefully', async () => {
            testComponent.minSizes = [];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.validateResize(50, 50)).toBe(true);
        });

        it('should handle rapid mouse events', () => {
            const gutter = testFixture.debugElement.query(By.css('.p-splitter-gutter'));
            const mouseEvent1 = new MouseEvent('mousedown');

            Object.defineProperty(mouseEvent1, 'pageX', { value: 100, writable: true });
            Object.defineProperty(mouseEvent1, 'pageY', { value: 100, writable: true });
            Object.defineProperty(mouseEvent1, 'currentTarget', { value: gutter.nativeElement, writable: true });

            // First event should work
            splitterInstance.onGutterMouseDown(mouseEvent1, 0);
            expect(splitterInstance.dragging()).toBe(true);

            // Reset for next test
            splitterInstance.clear();
        });

        it('should handle resize with zero panel sizes', async () => {
            testComponent.panelSizes = [0, 100];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.validateResize(0, 100)).toBeTruthy();
        });

        it('should handle complex nested structure cleanup', () => {
            splitterInstance.dragging.set(true);
            splitterInstance.size.set(100);
            splitterInstance.startPos.set(50);
            splitterInstance.prevPanelElement.set(document.createElement('div'));
            splitterInstance.nextPanelElement.set(document.createElement('div'));

            splitterInstance.clear();

            expect(splitterInstance.dragging()).toBe(false);
            expect(splitterInstance.size()).toBeNull();
            expect(splitterInstance.startPos()).toBeNull();
            expect(splitterInstance.prevPanelElement()).toBeNull();
            expect(splitterInstance.nextPanelElement()).toBeNull();
        });

        it('should handle invalid layout values', async () => {
            testComponent.layout = 'invalid' as any;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.horizontal()).toBe(false);
        });

        it('should handle resize validation properly', async () => {
            testComponent.minSizes = [10, 10];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.validateResize(20, 20)).toBe(true);
            expect(splitterInstance.validateResize(5, 20)).toBe(false);
        });

        it('should prevent resize beyond boundaries', async () => {
            testComponent.minSizes = [10, 10];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            // Try to resize below minimum
            const isValid = splitterInstance.validateResize(5, 15);
            expect(isValid).toBe(false);
        });

        it('should work with different storage types', async () => {
            testComponent.stateKey = 'test-key';
            testComponent.stateStorage = 'local';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(splitterInstance.stateStorage()).toBe('local');
            expect(() => splitterInstance.getStorage()).not.toThrow();
        });
    });

    describe('Memory Management', () => {
        it('should cleanup mouse listeners on destroy', () => {
            splitterInstance.bindMouseListeners();

            expect(splitterInstance.mouseMoveListener()).toBeTruthy();
            expect(splitterInstance.mouseUpListener()).toBeTruthy();

            splitterInstance.unbindMouseListeners();

            expect(splitterInstance.mouseMoveListener()).toBeNull();
            expect(splitterInstance.mouseUpListener()).toBeNull();
        });

        it('should cleanup touch listeners on destroy', () => {
            splitterInstance.bindTouchListeners();

            expect(splitterInstance.touchMoveListener()).toBeTruthy();
            expect(splitterInstance.touchEndListener()).toBeTruthy();

            splitterInstance.unbindTouchListeners();

            expect(splitterInstance.touchMoveListener()).toBeNull();
            expect(splitterInstance.touchEndListener()).toBeNull();
        });

        it('should clear timers properly', () => {
            // Set a timer
            const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
            splitterInstance.setTimer(event, 0, 5);

            expect(splitterInstance.timer()).toBeTruthy();

            // clearTimer calls clearTimeout but doesn't set timer to undefined
            const timerBeforeClear = splitterInstance.timer();
            splitterInstance.clearTimer();

            // Timer value remains but timeout is cleared
            expect(typeof timerBeforeClear).toBe('number');
        });

        it('should handle multiple timer clears', () => {
            splitterInstance.timer.set(null);

            expect(() => {
                splitterInstance.clearTimer();
                splitterInstance.clearTimer();
            }).not.toThrow();
        });
    });

    describe('PassThrough', () => {
        let ptFixture: ComponentFixture<TestPTSplitterComponent>;
        let ptComponent: TestPTSplitterComponent;
        let ptSplitter: Splitter;

        beforeEach(() => {
            ptFixture = TestBed.createComponent(TestPTSplitterComponent);
            ptComponent = ptFixture.componentInstance;
        });

        it('should apply simple string classes to PT sections', async () => {
            ptComponent.pt = {
                host: 'HOST_CLASS',
                root: 'ROOT_CLASS',
                panel: 'PANEL_CLASS',
                gutter: 'GUTTER_CLASS',
                gutterHandle: 'GUTTER_HANDLE_CLASS'
            };
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();
            ptFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await ptFixture.whenStable();

            const hostEl = ptFixture.debugElement.query(By.css('p-splitter'));
            const panels = ptFixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            const gutter = ptFixture.debugElement.query(By.css('.p-splitter-gutter'));
            const gutterHandle = ptFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));

            expect(hostEl.nativeElement.className).toContain('HOST_CLASS');
            expect(hostEl.nativeElement.className).toContain('ROOT_CLASS');
            expect(panels[0].nativeElement.className).toContain('PANEL_CLASS');
            expect(panels[1].nativeElement.className).toContain('PANEL_CLASS');
            expect(gutter.nativeElement.className).toContain('GUTTER_CLASS');
            expect(gutterHandle.nativeElement.className).toContain('GUTTER_HANDLE_CLASS');
        });

        it('should apply object-based PT options with class and attributes', async () => {
            ptComponent.pt = {
                root: {
                    class: 'ROOT_OBJECT_CLASS',
                    'data-test': 'root-test',
                    'aria-label': 'ROOT_ARIA_LABEL'
                },
                panel: {
                    class: 'PANEL_OBJECT_CLASS',
                    'data-test': 'panel-test'
                },
                gutter: {
                    class: 'GUTTER_OBJECT_CLASS',
                    'data-role': 'custom-gutter'
                },
                gutterHandle: {
                    class: 'HANDLE_OBJECT_CLASS',
                    'aria-label': 'HANDLE_ARIA_LABEL'
                }
            };
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();
            ptFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await ptFixture.whenStable();

            const hostEl = ptFixture.debugElement.query(By.css('p-splitter'));
            const panels = ptFixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            const gutter = ptFixture.debugElement.query(By.css('.p-splitter-gutter'));
            const gutterHandle = ptFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));

            expect(hostEl.nativeElement.className).toContain('ROOT_OBJECT_CLASS');
            expect(hostEl.nativeElement.getAttribute('data-test')).toBe('root-test');
            expect(hostEl.nativeElement.getAttribute('aria-label')).toBe('ROOT_ARIA_LABEL');
            expect(panels[0].nativeElement.className).toContain('PANEL_OBJECT_CLASS');
            expect(panels[0].nativeElement.getAttribute('data-test')).toBe('panel-test');
            expect(gutter.nativeElement.className).toContain('GUTTER_OBJECT_CLASS');
            expect(gutter.nativeElement.getAttribute('data-role')).toBe('custom-gutter');
            expect(gutterHandle.nativeElement.className).toContain('HANDLE_OBJECT_CLASS');
            expect(gutterHandle.nativeElement.getAttribute('aria-label')).toBe('HANDLE_ARIA_LABEL');
        });

        it('should apply mixed object and string PT values', async () => {
            ptComponent.pt = {
                root: {
                    class: 'MIXED_ROOT_CLASS'
                },
                panel: 'MIXED_PANEL_CLASS',
                gutter: {
                    class: 'MIXED_GUTTER_CLASS'
                },
                gutterHandle: 'MIXED_HANDLE_CLASS'
            };
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();
            ptFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await ptFixture.whenStable();

            const hostEl = ptFixture.debugElement.query(By.css('p-splitter'));
            const panels = ptFixture.debugElement.queryAll(By.css('.p-splitterpanel'));
            const gutter = ptFixture.debugElement.query(By.css('.p-splitter-gutter'));
            const gutterHandle = ptFixture.debugElement.query(By.css('.p-splitter-gutter-handle'));

            expect(hostEl.nativeElement.className).toContain('MIXED_ROOT_CLASS');
            expect(panels[0].nativeElement.className).toContain('MIXED_PANEL_CLASS');
            expect(gutter.nativeElement.className).toContain('MIXED_GUTTER_CLASS');
            expect(gutterHandle.nativeElement.className).toContain('MIXED_HANDLE_CLASS');
        });

        it('should use instance variables in PT functions', async () => {
            ptSplitter = ptFixture.debugElement.query(By.directive(Splitter)).componentInstance;
            ptComponent.layout = 'vertical';
            ptSplitter.dragging.set(true);

            ptComponent.pt = {
                root: ({ instance }) => ({
                    class: instance?.dragging() ? 'DRAGGING' : 'NOT_DRAGGING'
                }),
                gutter: ({ instance }) => ({
                    class: 'GUTTER_INSTANCE',
                    'data-layout': instance?.layout()
                })
            };
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();
            ptFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await ptFixture.whenStable();

            const hostEl = ptFixture.debugElement.query(By.css('p-splitter'));
            const gutter = ptFixture.debugElement.query(By.css('.p-splitter-gutter'));

            expect(hostEl.nativeElement.className).toContain('DRAGGING');
            expect(gutter.nativeElement.className).toContain('GUTTER_INSTANCE');
            expect(gutter.nativeElement.getAttribute('data-layout')).toBe('vertical');
        });

        it('should handle event binding in PT options', async () => {
            let clicked = false;
            ptComponent.pt = {
                panel: {
                    onclick: () => {
                        clicked = true;
                    }
                }
            };
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();
            ptFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await ptFixture.whenStable();

            const panel = ptFixture.debugElement.query(By.css('.p-splitterpanel'));
            panel.nativeElement.click();
            await new Promise((resolve) => setTimeout(resolve, 50));
            await ptFixture.whenStable();

            expect(clicked).toBe(true);
        });

        it('should apply PT options using setInput', async () => {
            ptFixture.componentRef.setInput('pt', {
                root: 'SET_INPUT_CLASS',
                gutter: { class: 'GUTTER_SET_INPUT' }
            });
            ptFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await ptFixture.whenStable();

            const hostEl = ptFixture.debugElement.query(By.css('p-splitter'));
            const gutter = ptFixture.debugElement.query(By.css('.p-splitter-gutter'));

            expect(hostEl.nativeElement.className).toContain('SET_INPUT_CLASS');
            expect(gutter.nativeElement.className).toContain('GUTTER_SET_INPUT');
        });
    });
});

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [Splitter, SharedModule],
    template: `
        <p-splitter>
            <ng-template pTemplate="panel">
                <p-splitter>
                    <ng-template pTemplate="panel">inner</ng-template>
                </p-splitter>
            </ng-template>
        </p-splitter>
    `
})
class SplitterQueryApiHostComponent {}

describe('Splitter Signal Query API', () => {
    it('should collect panel templates and detect a nested splitter', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [SplitterQueryApiHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(SplitterQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const splitters = fixture.debugElement.queryAll(By.directive(Splitter));
        expect(splitters.length).toBe(2);
        const outer = splitters[0].componentInstance;
        const inner = splitters[1].componentInstance;
        expect(outer.templates().some((t: any) => t.getType() === 'panel')).toBe(true);
        expect(inner.splitter()).toBeUndefined();
        expect(inner.nestedState()).toBeUndefined();
    });
});

// ---------------------------------------------------------------------------
// OnPush rendering
// ---------------------------------------------------------------------------

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Splitter],
    template: `
        <p-splitter
            [panelSizes]="panelSizes()"
            [layout]="layout()"
            [gutterSize]="gutterSize()"
            [minSizes]="minSizes()"
            [stateKey]="stateKey()"
            [stateStorage]="stateStorage()"
            [step]="step()"
            [panelStyleClass]="panelStyleClass()"
            [panelStyle]="panelStyle()"
            [class]="styleClass()"
            style="width: 400px; height: 300px"
        >
            <ng-template #panel>
                <div class="panel1">Panel 1</div>
            </ng-template>
            <ng-template #panel>
                <div class="panel2">Panel 2</div>
            </ng-template>
        </p-splitter>
    `
})
class TestOnPushSplitterComponent {
    panelSizes = signal<number[]>([30, 70]);
    layout = signal('horizontal');
    gutterSize = signal(4);
    minSizes = signal<number[]>([]);
    stateKey = signal<string | null>(null);
    stateStorage = signal('session');
    step = signal(5);
    panelStyleClass = signal<string | undefined>(undefined);
    panelStyle = signal<{ [klass: string]: any } | undefined>(undefined);
    styleClass = signal<string | undefined>(undefined);
}

describe('Splitter OnPush Rendering', () => {
    let fixture: ComponentFixture<TestOnPushSplitterComponent>;
    let component: TestOnPushSplitterComponent;
    let splitterInstance: Splitter;
    let hostEl: HTMLElement;

    const panelEl = (index: number): HTMLElement => fixture.debugElement.queryAll(By.css('.p-splitterpanel'))[index].nativeElement;
    const gutterHandleEl = (): HTMLElement => fixture.debugElement.query(By.css('.p-splitter-gutter-handle')).nativeElement;

    beforeEach(async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [TestOnPushSplitterComponent],
            providers: [provideZonelessChangeDetection()]
        });
        fixture = TestBed.createComponent(TestOnPushSplitterComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();

        const splitterEl = fixture.debugElement.query(By.directive(Splitter));
        splitterInstance = splitterEl.componentInstance;
        hostEl = splitterEl.nativeElement;
    });

    afterEach(() => {
        window.sessionStorage.clear();
        window.localStorage.clear();
    });

    it('should apply the initial panel sizes after the first render', () => {
        expect(splitterInstance._panelSizes()).toEqual([30, 70]);
        expect(panelEl(0).style.flexBasis).toBe('calc(30% - 4px)');
        expect(panelEl(1).style.flexBasis).toBe('calc(70% - 4px)');
        expect(splitterInstance.prevSize()).toBe('30.0000');
        expect(gutterHandleEl().getAttribute('aria-valuenow')).toBe('30.0000');
    });

    it('should re-render when layout changes', async () => {
        expect(hostEl.classList.contains('p-splitter-horizontal')).toBe(true);
        expect(hostEl.getAttribute('data-p')).toBe('horizontal');
        expect(gutterHandleEl().getAttribute('aria-orientation')).toBe('horizontal');
        expect(gutterHandleEl().style.width).toBe('4px');

        component.layout.set('vertical');
        await fixture.whenStable();

        expect(splitterInstance.horizontal()).toBe(false);
        expect(hostEl.classList.contains('p-splitter-vertical')).toBe(true);
        expect(hostEl.classList.contains('p-splitter-horizontal')).toBe(false);
        expect(hostEl.getAttribute('data-p')).toBe('vertical');
        expect(gutterHandleEl().getAttribute('aria-orientation')).toBe('vertical');
        expect(gutterHandleEl().style.height).toBe('4px');
        expect(gutterHandleEl().style.width).toBe('');
    });

    it('should re-render when gutterSize changes', async () => {
        expect(gutterHandleEl().style.width).toBe('4px');

        component.gutterSize.set(10);
        await fixture.whenStable();

        expect(splitterInstance.gutterStyle()).toEqual({ width: '10px' });
        expect(gutterHandleEl().style.width).toBe('10px');
    });

    it('should re-render when panelStyleClass and panelStyle change', async () => {
        expect(panelEl(0).classList.contains('custom-panel')).toBe(false);

        component.panelStyleClass.set('custom-panel');
        component.panelStyle.set({ backgroundColor: 'red' });
        await fixture.whenStable();

        expect(panelEl(0).classList.contains('custom-panel')).toBe(true);
        expect(panelEl(1).classList.contains('custom-panel')).toBe(true);
        expect(panelEl(0).style.backgroundColor).toBe('red');
        expect(panelEl(1).style.backgroundColor).toBe('red');
    });

    it('should keep the root classes when the host class changes', async () => {
        component.styleClass.set('custom-splitter');
        await fixture.whenStable();

        expect(hostEl.classList.contains('custom-splitter')).toBe(true);
        expect(hostEl.classList.contains('p-splitter')).toBe(true);
        expect(hostEl.classList.contains('p-component')).toBe(true);
    });

    it('should reset the panel sizes when panelSizes changes and keep a restored state until then', async () => {
        window.sessionStorage.setItem('onpush-restore', JSON.stringify([40, 60]));
        component.stateKey.set('onpush-restore');
        await fixture.whenStable();

        expect(splitterInstance.isStateful()).toBe(true);
        expect(splitterInstance.restoreState()).toBe(true);
        expect(splitterInstance._panelSizes()).toEqual([40, 60]);
        expect(panelEl(0).style.flexBasis).toBe('calc(40% - 4px)');

        component.gutterSize.set(8);
        await fixture.whenStable();
        expect(splitterInstance._panelSizes()).toEqual([40, 60]);

        component.panelSizes.set([20, 80]);
        await fixture.whenStable();

        expect(splitterInstance._panelSizes()).toEqual([20, 80]);
        expect(panelEl(0).style.flexBasis).toBe('calc(20% - 8px)');
        expect(panelEl(1).style.flexBasis).toBe('calc(80% - 8px)');
    });

    it('should split the panels equally when panelSizes becomes empty', async () => {
        component.panelSizes.set([]);
        await fixture.whenStable();

        expect(splitterInstance._panelSizes()).toEqual([]);
        expect(panelEl(0).style.flexBasis).toBe('calc(50% - 4px)');
        expect(panelEl(1).style.flexBasis).toBe('calc(50% - 4px)');
    });

    it('should restore a stored state on the first render', async () => {
        window.sessionStorage.setItem('onpush-initial', JSON.stringify([25, 75]));
        const restoredFixture = TestBed.createComponent(TestOnPushSplitterComponent);
        restoredFixture.componentInstance.stateKey.set('onpush-initial');
        await restoredFixture.whenStable();

        const restoredSplitter: Splitter = restoredFixture.debugElement.query(By.directive(Splitter)).componentInstance;
        const panels = restoredFixture.debugElement.queryAll(By.css('.p-splitterpanel'));

        expect(restoredSplitter._panelSizes()).toEqual([25, 75]);
        expect(panels[0].nativeElement.style.flexBasis).toBe('calc(25% - 4px)');
        expect(panels[1].nativeElement.style.flexBasis).toBe('calc(75% - 4px)');
    });

    it('should save the state in the storage selected by stateStorage', async () => {
        expect(splitterInstance.isStateful()).toBe(false);

        component.stateKey.set('onpush-save');
        component.stateStorage.set('local');
        await fixture.whenStable();

        expect(splitterInstance.isStateful()).toBe(true);
        splitterInstance.saveState();

        expect(window.localStorage.getItem('onpush-save')).toBe(JSON.stringify([30, 70]));
        expect(window.sessionStorage.getItem('onpush-save')).toBeNull();
    });

    it('should use the current step and layout on keyboard resize', async () => {
        const setTimerSpy = vi.spyOn(splitterInstance, 'setTimer').mockImplementation(() => {});

        component.step.set(10);
        await fixture.whenStable();

        const leftEvent = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
        gutterHandleEl().dispatchEvent(leftEvent);
        expect(setTimerSpy).toHaveBeenCalledWith(leftEvent, 0, -10);

        component.layout.set('vertical');
        await fixture.whenStable();
        setTimerSpy.mockClear();

        gutterHandleEl().dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));
        expect(setTimerSpy).not.toHaveBeenCalled();

        const upEvent = new KeyboardEvent('keydown', { code: 'ArrowUp' });
        gutterHandleEl().dispatchEvent(upEvent);
        expect(setTimerSpy).toHaveBeenCalledWith(upEvent, 0, 10);
    });

    it('should validate a resize against the current minSizes', async () => {
        expect(splitterInstance.validateResize(15, 85)).toBe(true);

        component.minSizes.set([20, 30]);
        await fixture.whenStable();

        expect(splitterInstance.validateResize(15, 85)).toBe(false);
        expect(splitterInstance.validateResize(25, 25)).toBe(false);
        expect(splitterInstance.validateResize(25, 35)).toBe(true);
    });

    it('should update the panel sizes and aria-valuenow on resize', async () => {
        const gutter = fixture.debugElement.query(By.css('.p-splitter-gutter')).nativeElement;
        const mouseDown = new MouseEvent('mousedown');
        Object.defineProperty(mouseDown, 'pageX', { value: 100 });
        Object.defineProperty(mouseDown, 'currentTarget', { value: gutter });

        splitterInstance.resizeStart(mouseDown, 0);
        expect(splitterInstance.dragging()).toBe(true);
        expect(splitterInstance.size()).toBe(400);
        expect(hostEl.classList.contains('p-splitter-resizing')).toBe(true);
        const prevPanelSize = splitterInstance.prevPanelSize() as number;
        const nextPanelSize = splitterInstance.nextPanelSize() as number;

        const mouseMove = new MouseEvent('mousemove');
        Object.defineProperty(mouseMove, 'pageX', { value: 140 });
        splitterInstance.onResize(mouseMove);

        const [prev, next] = splitterInstance._panelSizes();
        expect(prev).toBeCloseTo(prevPanelSize + 10, 5);
        expect(next).toBeCloseTo(nextPanelSize - 10, 5);
        expect(parseFloat(panelEl(0).style.flexBasis.replace('calc(', ''))).toBeCloseTo(prev, 3);
        expect(parseFloat(panelEl(1).style.flexBasis.replace('calc(', ''))).toBeCloseTo(next, 3);

        await fixture.whenStable();
        expect(gutterHandleEl().getAttribute('aria-valuenow')).toBe(parseFloat(prev as any).toFixed(4));

        const mouseUp = new MouseEvent('mouseup');
        splitterInstance.resizeEnd(mouseUp);

        expect(splitterInstance.dragging()).toBe(false);
        expect(splitterInstance.gutterElement()).toBeNull();
        expect(hostEl.classList.contains('p-splitter-resizing')).toBe(false);
        expect(splitterInstance._panelSizes()).toEqual([prev, next]);
    });
});
