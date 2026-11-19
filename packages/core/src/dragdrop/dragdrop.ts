import { computed, Directive, effect, ElementRef, HostListener, inject, input, NgModule, NgZone, OnDestroy, output, Renderer2, signal, untracked } from '@angular/core';
import { addClass, removeClass } from '@exhaustive-ui/utils';
import { DomHandler } from '@exhaustive-ui/core/dom';
import { VoidListener } from '@exhaustive-ui/core/ts-helpers';

/**
 * pDraggable directive apply draggable behavior to any element.
 * @group Components
 */
@Directive({
    selector: '[pDraggable]'
})
export class Draggable implements OnDestroy {
    el = inject(ElementRef);
    zone = inject(NgZone);
    private renderer = inject(Renderer2);

    scope = input<string | undefined>(undefined, { alias: 'pDraggable' });
    /**
     * Defines the cursor style.
     * @group Props
     */
    dragEffect = input<'none' | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | 'uninitialized' | undefined>();
    /**
     * Selector to define the drag handle, by default anywhere on the target element is a drag handle to start dragging.
     * @group Props
     */
    dragHandle = input<string | undefined>();
    /**
     * Callback to invoke when drag begins.
     * @param {DragEvent} event - Drag event.
     * @group Emits
     */
    readonly onDragStart = output<DragEvent>();
    /**
     * Callback to invoke when drag ends.
     * @param {DragEvent} event - Drag event.
     * @group Emits
     */
    readonly onDragEnd = output<DragEvent>();
    /**
     * Callback to invoke on dragging.
     * @param {DragEvent} event - Drag event.
     * @group Emits
     */
    readonly onDrag = output<DragEvent>();

    handle = signal<any>(undefined);

    dragListener = signal<VoidListener>(undefined);

    mouseDownListener = signal<VoidListener>(undefined);

    mouseUpListener = signal<VoidListener>(undefined);

    pDraggableDisabled = input<boolean>(false);

    constructor() {
        effect(() => {
            const disabled = this.pDraggableDisabled();

            untracked(() => {
                if (disabled) {
                    this.unbindMouseListeners();
                } else {
                    this.el.nativeElement.draggable = true;
                    this.bindMouseListeners();
                }
            });
        });
    }

    bindDragListener() {
        if (!this.dragListener()) {
            this.zone.runOutsideAngular(() => {
                this.dragListener.set(this.renderer.listen(this.el.nativeElement, 'drag', this.drag.bind(this)));
            });
        }
    }

    unbindDragListener() {
        const dragListener = this.dragListener();
        if (dragListener) {
            this.zone.runOutsideAngular(() => {
                dragListener();
                this.dragListener.set(null);
            });
        }
    }

    bindMouseListeners() {
        if (!this.mouseDownListener() && !this.mouseUpListener()) {
            this.zone.runOutsideAngular(() => {
                this.mouseDownListener.set(this.renderer.listen(this.el.nativeElement, 'mousedown', this.mousedown.bind(this)));
                this.mouseUpListener.set(this.renderer.listen(this.el.nativeElement, 'mouseup', this.mouseup.bind(this)));
            });
        }
    }

    unbindMouseListeners() {
        const mouseDownListener = this.mouseDownListener();
        const mouseUpListener = this.mouseUpListener();
        if (mouseDownListener && mouseUpListener) {
            this.zone.runOutsideAngular(() => {
                mouseDownListener();
                mouseUpListener();
                this.mouseDownListener.set(null);
                this.mouseUpListener.set(null);
            });
        }
    }

    drag(event: DragEvent) {
        this.onDrag.emit(event);
    }

    @HostListener('dragstart', ['$event'])
    dragStart(event: DragEvent) {
        if (this.allowDrag() && !this.pDraggableDisabled()) {
            const dragEffect = this.dragEffect();
            if (dragEffect) {
                (event.dataTransfer as DataTransfer).effectAllowed = dragEffect;
            }
            (event.dataTransfer as DataTransfer).setData('text', this.scope()!);

            this.onDragStart.emit(event);

            this.bindDragListener();
        } else {
            event.preventDefault();
        }
    }

    @HostListener('dragend', ['$event'])
    dragEnd(event: DragEvent) {
        this.onDragEnd.emit(event);
        this.unbindDragListener();
    }

    mousedown(event: MouseEvent) {
        this.handle.set(event.target);
    }

    mouseup(event: MouseEvent) {
        this.handle.set(null);
    }

    allowDrag = computed<boolean>(() => {
        const dragHandle = this.dragHandle();
        const handle = this.handle();
        if (dragHandle && handle) return DomHandler.matches(handle, dragHandle);
        else return true;
    });

    ngOnDestroy() {
        this.unbindDragListener();
        this.unbindMouseListeners();
    }
}
/**
 * pDroppable directive apply droppable behavior to any element.
 * @group Components
 */
@Directive({
    selector: '[pDroppable]'
})
export class Droppable implements OnDestroy {
    el = inject(ElementRef);
    zone = inject(NgZone);
    private renderer = inject(Renderer2);

    scope = input<string | string[] | undefined>(undefined, { alias: 'pDroppable' });
    /**
     * Whether the element is droppable, useful for conditional cases.
     * @group Props
     */
    pDroppableDisabled = input<boolean>(false);
    /**
     * Defines the cursor style, valid values are none, copy, move, link, copyMove, copyLink, linkMove and all.
     * @group Props
     */
    dropEffect = input<'none' | 'copy' | 'link' | 'move' | undefined>();
    /**
     * Callback to invoke when a draggable enters drop area.
     * @group Emits
     */
    readonly onDragEnter = output<DragEvent>();
    /**
     * Callback to invoke when a draggable leave drop area.
     * @group Emits
     */
    readonly onDragLeave = output<DragEvent>();
    /**
     * Callback to invoke when a draggable is dropped onto drop area.
     * @group Emits
     */
    readonly onDrop = output<DragEvent>();

    dragOverListener = signal<VoidListener>(undefined);

    constructor() {
        effect(() => {
            const disabled = this.pDroppableDisabled();

            untracked(() => {
                if (disabled) {
                    this.unbindDragOverListener();
                } else {
                    this.bindDragOverListener();
                }
            });
        });
    }

    bindDragOverListener() {
        if (!this.dragOverListener()) {
            this.zone.runOutsideAngular(() => {
                this.dragOverListener.set(this.renderer.listen(this.el.nativeElement, 'dragover', this.dragOver.bind(this)));
            });
        }
    }

    unbindDragOverListener() {
        const dragOverListener = this.dragOverListener();
        if (dragOverListener) {
            this.zone.runOutsideAngular(() => {
                dragOverListener();
                this.dragOverListener.set(null);
            });
        }
    }

    dragOver(event: DragEvent) {
        event.preventDefault();
    }

    @HostListener('drop', ['$event'])
    drop(event: DragEvent) {
        if (this.allowDrop(event)) {
            removeClass(this.el.nativeElement, 'p-draggable-enter');
            event.preventDefault();
            this.onDrop.emit(event);
        }
    }

    @HostListener('dragenter', ['$event'])
    dragEnter(event: DragEvent) {
        event.preventDefault();

        const dropEffect = this.dropEffect();
        if (dropEffect) {
            (event.dataTransfer as DataTransfer).dropEffect = dropEffect;
        }

        addClass(this.el.nativeElement, 'p-draggable-enter');
        this.onDragEnter.emit(event);
    }

    @HostListener('dragleave', ['$event'])
    dragLeave(event: DragEvent) {
        event.preventDefault();

        if (!this.el.nativeElement.contains(event.relatedTarget)) {
            removeClass(this.el.nativeElement, 'p-draggable-enter');
            this.onDragLeave.emit(event);
        }
    }

    allowDrop(event: DragEvent): boolean {
        let dragScope = (event.dataTransfer as DataTransfer).getData('text');
        const scope = this.scope();
        if (typeof scope == 'string' && dragScope == scope) {
            return true;
        } else if (Array.isArray(scope)) {
            for (let j = 0; j < scope.length; j++) {
                if (dragScope == scope[j]) {
                    return true;
                }
            }
        }
        return false;
    }

    ngOnDestroy() {
        this.unbindDragOverListener();
    }
}

@NgModule({
    imports: [Draggable, Droppable],
    exports: [Draggable, Droppable]
})
export class DragDropModule {}
