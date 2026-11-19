import { ChangeDetectionStrategy, Component, PLATFORM_ID, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Draggable, DragDropModule, Droppable } from './dragdrop';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-basic-draggable',
    template: `
        <div pDraggable="products" class="draggable">
            <span class="content">Item</span>
        </div>
    `
})
class TestBasicDraggableComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-configured-draggable',
    template: `
        <div [pDraggable]="scope()" [dragEffect]="dragEffect()" [dragHandle]="dragHandle()" [pDraggableDisabled]="disabled()" class="draggable">
            <span class="handle">Handle</span>
            <span class="content">Item</span>
        </div>
    `
})
class TestConfiguredDraggableComponent {
    scope = signal<string | undefined>('products');
    dragEffect = signal<'none' | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | 'uninitialized' | undefined>(undefined);
    dragHandle = signal<string | undefined>(undefined);
    disabled = signal(false);
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-basic-droppable',
    template: `
        <div pDroppable="products" class="droppable">
            <span class="content">Drop zone</span>
        </div>
    `
})
class TestBasicDroppableComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-configured-droppable',
    template: `
        <div [pDroppable]="scope()" [dropEffect]="dropEffect()" [pDroppableDisabled]="disabled()" class="droppable">
            <span class="content">Drop zone</span>
        </div>
    `
})
class TestConfiguredDroppableComponent {
    scope = signal<string | string[] | undefined>('products');
    dropEffect = signal<'none' | 'copy' | 'link' | 'move' | undefined>(undefined);
    disabled = signal(false);
}

function createDataTransfer(): DataTransfer {
    const data: Record<string, string> = {};
    return {
        effectAllowed: 'uninitialized',
        dropEffect: 'none',
        setData: (format: string, value: string) => {
            data[format] = value;
        },
        getData: (format: string) => data[format] ?? ''
    } as unknown as DataTransfer;
}

function createDragEvent(type: string, init: DragEventInit = {}): DragEvent {
    const event = new DragEvent(type, { bubbles: true, cancelable: true, ...init });
    Object.defineProperty(event, 'dataTransfer', { value: createDataTransfer() });
    return event;
}

describe('DragDrop', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DragDropModule],
            declarations: [TestBasicDraggableComponent, TestConfiguredDraggableComponent, TestBasicDroppableComponent, TestConfiguredDroppableComponent],
            providers: [{ provide: PLATFORM_ID, useValue: 'browser' }, provideZonelessChangeDetection()]
        });
    });

    describe('Draggable', () => {
        describe('Initialization', () => {
            let fixture: ComponentFixture<TestBasicDraggableComponent>;
            let directive: Draggable;
            let element: HTMLElement;

            beforeEach(() => {
                fixture = TestBed.createComponent(TestBasicDraggableComponent);
                fixture.detectChanges();
                const debugElement = fixture.debugElement.query(By.directive(Draggable));
                directive = debugElement.injector.get(Draggable);
                element = debugElement.nativeElement;
            });

            it('should create the directive', () => {
                expect(directive).toBeTruthy();
            });

            it('should read the scope from the pDraggable attribute', () => {
                expect(directive.scope()).toBe('products');
            });

            it('should have default input values', () => {
                expect(directive.dragEffect()).toBeUndefined();
                expect(directive.dragHandle()).toBeUndefined();
                expect(directive.pDraggableDisabled()).toBe(false);
            });

            it('should make the host element draggable', () => {
                expect(element.draggable).toBe(true);
            });

            it('should bind the mouse listeners when enabled', () => {
                expect(directive.mouseDownListener()).toBeTruthy();
                expect(directive.mouseUpListener()).toBeTruthy();
                expect(directive.dragListener()).toBeFalsy();
            });

            it('should track the mousedown target as handle and clear it on mouseup', () => {
                const content = element.querySelector('.content') as HTMLElement;

                content.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                expect(directive.handle()).toBe(content);

                content.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                expect(directive.handle()).toBeNull();
            });
        });

        describe('Drag events', () => {
            let fixture: ComponentFixture<TestConfiguredDraggableComponent>;
            let component: TestConfiguredDraggableComponent;
            let directive: Draggable;
            let element: HTMLElement;

            beforeEach(() => {
                fixture = TestBed.createComponent(TestConfiguredDraggableComponent);
                component = fixture.componentInstance;
                fixture.detectChanges();
                const debugElement = fixture.debugElement.query(By.directive(Draggable));
                directive = debugElement.injector.get(Draggable);
                element = debugElement.nativeElement;
            });

            it('should emit onDragStart and write the scope into the dataTransfer', () => {
                const spy = vi.fn();
                directive.onDragStart.subscribe(spy);
                const event = createDragEvent('dragstart');

                element.dispatchEvent(event);

                expect(spy).toHaveBeenCalledWith(event);
                expect(event.defaultPrevented).toBe(false);
                expect(event.dataTransfer!.getData('text')).toBe('products');
            });

            it('should apply the dragEffect to the dataTransfer', () => {
                component.dragEffect.set('copy');
                fixture.detectChanges();
                const event = createDragEvent('dragstart');

                element.dispatchEvent(event);

                expect(event.dataTransfer!.effectAllowed).toBe('copy');
            });

            it('should leave effectAllowed untouched without dragEffect', () => {
                const event = createDragEvent('dragstart');

                element.dispatchEvent(event);

                expect(event.dataTransfer!.effectAllowed).toBe('uninitialized');
            });

            it('should bind the drag listener on dragstart and emit onDrag while dragging', () => {
                const spy = vi.fn();
                directive.onDrag.subscribe(spy);

                element.dispatchEvent(createDragEvent('dragstart'));
                expect(directive.dragListener()).toBeTruthy();

                const dragEvent = createDragEvent('drag');
                element.dispatchEvent(dragEvent);
                expect(spy).toHaveBeenCalledWith(dragEvent);
            });

            it('should emit onDragEnd and unbind the drag listener on dragend', () => {
                const dragSpy = vi.fn();
                const endSpy = vi.fn();
                directive.onDrag.subscribe(dragSpy);
                directive.onDragEnd.subscribe(endSpy);
                element.dispatchEvent(createDragEvent('dragstart'));

                const endEvent = createDragEvent('dragend');
                element.dispatchEvent(endEvent);

                expect(endSpy).toHaveBeenCalledWith(endEvent);
                expect(directive.dragListener()).toBeNull();

                element.dispatchEvent(createDragEvent('drag'));
                expect(dragSpy).not.toHaveBeenCalled();
            });

            it('should prevent dragstart and not emit when disabled', () => {
                const spy = vi.fn();
                directive.onDragStart.subscribe(spy);
                component.disabled.set(true);
                fixture.detectChanges();
                const event = createDragEvent('dragstart');

                element.dispatchEvent(event);

                expect(spy).not.toHaveBeenCalled();
                expect(event.defaultPrevented).toBe(true);
                expect(directive.dragListener()).toBeFalsy();
            });

            it('should unbind the mouse listeners when disabled and rebind them when enabled again', () => {
                expect(directive.mouseDownListener()).toBeTruthy();
                expect(directive.mouseUpListener()).toBeTruthy();

                component.disabled.set(true);
                fixture.detectChanges();
                expect(directive.pDraggableDisabled()).toBe(true);
                expect(directive.mouseDownListener()).toBeNull();
                expect(directive.mouseUpListener()).toBeNull();

                const content = element.querySelector('.content') as HTMLElement;
                content.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                expect(directive.handle()).toBeUndefined();

                component.disabled.set(false);
                fixture.detectChanges();
                expect(directive.pDraggableDisabled()).toBe(false);
                expect(directive.mouseDownListener()).toBeTruthy();
                expect(directive.mouseUpListener()).toBeTruthy();

                content.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                expect(directive.handle()).toBe(content);
            });

            it('should not duplicate the mouse listeners when the effect re-runs enabled', () => {
                const listenSpy = vi.spyOn(directive['renderer'], 'listen');

                component.scope.set('other');
                fixture.detectChanges();

                expect(listenSpy).not.toHaveBeenCalled();
            });

            it('should allow dragging from anywhere without dragHandle', () => {
                const content = element.querySelector('.content') as HTMLElement;
                content.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

                expect(directive.allowDrag()).toBe(true);
            });

            it('should only allow dragging from the dragHandle when set', () => {
                const spy = vi.fn();
                directive.onDragStart.subscribe(spy);
                component.dragHandle.set('.handle');
                fixture.detectChanges();
                const content = element.querySelector('.content') as HTMLElement;
                const handle = element.querySelector('.handle') as HTMLElement;

                content.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                expect(directive.allowDrag()).toBe(false);
                const blockedEvent = createDragEvent('dragstart');
                element.dispatchEvent(blockedEvent);
                expect(blockedEvent.defaultPrevented).toBe(true);
                expect(spy).not.toHaveBeenCalled();
                content.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                expect(directive.allowDrag()).toBe(true);
                const allowedEvent = createDragEvent('dragstart');
                element.dispatchEvent(allowedEvent);
                expect(allowedEvent.defaultPrevented).toBe(false);
                expect(spy).toHaveBeenCalledWith(allowedEvent);
            });

            it('should recompute allowDrag when dragHandle changes', () => {
                const content = element.querySelector('.content') as HTMLElement;
                content.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                expect(directive.allowDrag()).toBe(true);

                component.dragHandle.set('.handle');
                fixture.detectChanges();
                expect(directive.allowDrag()).toBe(false);

                component.dragHandle.set('.content');
                fixture.detectChanges();
                expect(directive.allowDrag()).toBe(true);
            });

            it('should unbind every listener on destroy', () => {
                element.dispatchEvent(createDragEvent('dragstart'));
                expect(directive.dragListener()).toBeTruthy();

                fixture.destroy();

                expect(directive.dragListener()).toBeNull();
                expect(directive.mouseDownListener()).toBeNull();
                expect(directive.mouseUpListener()).toBeNull();
            });
        });
    });

    describe('Droppable', () => {
        describe('Initialization', () => {
            let fixture: ComponentFixture<TestBasicDroppableComponent>;
            let directive: Droppable;
            let element: HTMLElement;

            beforeEach(() => {
                fixture = TestBed.createComponent(TestBasicDroppableComponent);
                fixture.detectChanges();
                const debugElement = fixture.debugElement.query(By.directive(Droppable));
                directive = debugElement.injector.get(Droppable);
                element = debugElement.nativeElement;
            });

            it('should create the directive', () => {
                expect(directive).toBeTruthy();
            });

            it('should read the scope from the pDroppable attribute', () => {
                expect(directive.scope()).toBe('products');
            });

            it('should have default input values', () => {
                expect(directive.dropEffect()).toBeUndefined();
                expect(directive.pDroppableDisabled()).toBe(false);
            });

            it('should bind the dragover listener and prevent the default dragover behavior', () => {
                expect(directive.dragOverListener()).toBeTruthy();
                const event = createDragEvent('dragover');

                element.dispatchEvent(event);

                expect(event.defaultPrevented).toBe(true);
            });
        });

        describe('Drop events', () => {
            let fixture: ComponentFixture<TestConfiguredDroppableComponent>;
            let component: TestConfiguredDroppableComponent;
            let directive: Droppable;
            let element: HTMLElement;

            beforeEach(() => {
                fixture = TestBed.createComponent(TestConfiguredDroppableComponent);
                component = fixture.componentInstance;
                fixture.detectChanges();
                const debugElement = fixture.debugElement.query(By.directive(Droppable));
                directive = debugElement.injector.get(Droppable);
                element = debugElement.nativeElement;
            });

            function createDropEvent(type: string, dragScope: string, init: DragEventInit = {}): DragEvent {
                const event = createDragEvent(type, init);
                event.dataTransfer!.setData('text', dragScope);
                return event;
            }

            it('should add the p-draggable-enter class and emit onDragEnter on dragenter', () => {
                const spy = vi.fn();
                directive.onDragEnter.subscribe(spy);
                const event = createDragEvent('dragenter');

                element.dispatchEvent(event);

                expect(event.defaultPrevented).toBe(true);
                expect(element.classList.contains('p-draggable-enter')).toBe(true);
                expect(spy).toHaveBeenCalledWith(event);
            });

            it('should apply the dropEffect to the dataTransfer on dragenter', () => {
                component.dropEffect.set('move');
                fixture.detectChanges();
                const event = createDragEvent('dragenter');

                element.dispatchEvent(event);

                expect(event.dataTransfer!.dropEffect).toBe('move');
            });

            it('should leave dropEffect untouched without dropEffect input', () => {
                const event = createDragEvent('dragenter');

                element.dispatchEvent(event);

                expect(event.dataTransfer!.dropEffect).toBe('none');
            });

            it('should remove the class and emit onDragLeave when leaving the element', () => {
                const spy = vi.fn();
                directive.onDragLeave.subscribe(spy);
                element.dispatchEvent(createDragEvent('dragenter'));
                const event = createDragEvent('dragleave', { relatedTarget: document.body });

                element.dispatchEvent(event);

                expect(event.defaultPrevented).toBe(true);
                expect(element.classList.contains('p-draggable-enter')).toBe(false);
                expect(spy).toHaveBeenCalledWith(event);
            });

            it('should ignore dragleave towards a child element', () => {
                const spy = vi.fn();
                directive.onDragLeave.subscribe(spy);
                element.dispatchEvent(createDragEvent('dragenter'));
                const content = element.querySelector('.content') as HTMLElement;

                element.dispatchEvent(createDragEvent('dragleave', { relatedTarget: content }));

                expect(element.classList.contains('p-draggable-enter')).toBe(true);
                expect(spy).not.toHaveBeenCalled();
            });

            it('should emit onDrop and remove the class for a matching scope', () => {
                const spy = vi.fn();
                directive.onDrop.subscribe(spy);
                element.dispatchEvent(createDragEvent('dragenter'));
                const event = createDropEvent('drop', 'products');

                element.dispatchEvent(event);

                expect(event.defaultPrevented).toBe(true);
                expect(element.classList.contains('p-draggable-enter')).toBe(false);
                expect(spy).toHaveBeenCalledWith(event);
            });

            it('should not emit onDrop for a non matching scope', () => {
                const spy = vi.fn();
                directive.onDrop.subscribe(spy);
                const event = createDropEvent('drop', 'other');

                element.dispatchEvent(event);

                expect(event.defaultPrevented).toBe(false);
                expect(spy).not.toHaveBeenCalled();
            });

            it('should accept any scope of an array scope', () => {
                component.scope.set(['items', 'products']);
                fixture.detectChanges();
                expect(directive.scope()).toEqual(['items', 'products']);

                expect(directive.allowDrop(createDropEvent('drop', 'items'))).toBe(true);
                expect(directive.allowDrop(createDropEvent('drop', 'products'))).toBe(true);
                expect(directive.allowDrop(createDropEvent('drop', 'other'))).toBe(false);
            });

            it('should reject every drop without scope', () => {
                component.scope.set(undefined);
                fixture.detectChanges();

                expect(directive.allowDrop(createDropEvent('drop', 'products'))).toBe(false);
                expect(directive.allowDrop(createDropEvent('drop', ''))).toBe(false);
            });

            it('should unbind the dragover listener when disabled and rebind it when enabled again', () => {
                expect(directive.dragOverListener()).toBeTruthy();

                component.disabled.set(true);
                fixture.detectChanges();
                expect(directive.pDroppableDisabled()).toBe(true);
                expect(directive.dragOverListener()).toBeNull();
                const blockedEvent = createDragEvent('dragover');
                element.dispatchEvent(blockedEvent);
                expect(blockedEvent.defaultPrevented).toBe(false);

                component.disabled.set(false);
                fixture.detectChanges();
                expect(directive.pDroppableDisabled()).toBe(false);
                expect(directive.dragOverListener()).toBeTruthy();
                const allowedEvent = createDragEvent('dragover');
                element.dispatchEvent(allowedEvent);
                expect(allowedEvent.defaultPrevented).toBe(true);
            });

            it('should not duplicate the dragover listener when the effect re-runs enabled', () => {
                const listenSpy = vi.spyOn(directive['renderer'], 'listen');

                component.scope.set('other');
                fixture.detectChanges();

                expect(listenSpy).not.toHaveBeenCalled();
            });

            it('should unbind the dragover listener on destroy', () => {
                fixture.destroy();

                expect(directive.dragOverListener()).toBeNull();
            });
        });
    });
});
