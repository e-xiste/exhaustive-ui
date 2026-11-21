import { CommonModule } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    forwardRef,
    HostListener,
    inject,
    InjectionToken,
    input,
    model,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    contentChild,
    viewChild,
    contentChildren,
    output
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { find, findSingle, focus, getOuterHeight, getOuterWidth, removeAccents, resolveFieldData } from '@exhaustive-ui/utils';
import { BlockableUI, PrimeTemplate, ScrollerOptions, SharedModule, TranslationKeys, TreeDragDropService, TreeNode } from '@exhaustive-ui/core/api';
import { AutoFocusModule } from '@exhaustive-ui/core/autofocus';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { Checkbox } from '@exhaustive-ui/core/checkbox';
import { IconField } from '@exhaustive-ui/core/iconfield';
import { ChevronDownIcon, ChevronRightIcon, SearchIcon, SpinnerIcon } from '@exhaustive-ui/core/icons';
import { InputIcon } from '@exhaustive-ui/core/inputicon';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { Ripple } from '@exhaustive-ui/core/ripple';
import { Scroller } from '@exhaustive-ui/core/scroller';
import { Nullable } from '@exhaustive-ui/core/ts-helpers';
import {
    TreeCheckboxIconTemplateContext,
    TreeFilterEvent,
    TreeFilterTemplateContext,
    TreeLazyLoadEvent,
    TreeLoaderTemplateContext,
    TreeNodeCollapseEvent,
    TreeNodeContextMenuSelectEvent,
    TreeNodeDoubleClickEvent,
    TreeNodeDropEvent,
    TreeNodeExpandEvent,
    TreeNodeSelectEvent,
    TreeNodeUnSelectEvent,
    TreePassThrough,
    TreeScrollEvent,
    TreeScrollIndexChangeEvent,
    TreeTogglerIconTemplateContext
} from '@exhaustive-ui/core/types/tree';
import { Subscription } from 'rxjs';
import { TreeStyle } from './style/treestyle';

const TREE_INSTANCE = new InjectionToken<Tree>('TREE_INSTANCE');
const TREENODE_INSTANCE = new InjectionToken<UITreeNode>('TREENODE_INSTANCE');

@Component({
    selector: 'p-treeNode',
    imports: [CommonModule, Ripple, Checkbox, FormsModule, ChevronRightIcon, ChevronDownIcon, SpinnerIcon, SharedModule, BindModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (node()) {
            <li
                [class]="cn(cx('node'), node()!.styleClass)"
                [ngStyle]="{ height: itemSize() + 'px' }"
                [style]="node()!.style"
                [attr.aria-label]="node()!.label"
                [attr.aria-checked]="checked()"
                [attr.aria-setsize]="node()!.children ? node()!.children!.length : 0"
                [attr.aria-selected]="selected()"
                [attr.aria-expanded]="node()!.expanded"
                [attr.aria-posinset]="index()! + 1"
                [attr.aria-level]="level()! + 1"
                [attr.tabindex]="index() === 0 ? 0 : -1"
                [attr.data-id]="node()!.key"
                role="treeitem"
                (keydown)="onKeyDown($event)"
                (contextmenu)="onNodeRightClick($event)"
                [pBind]="getPTOptions('node')"
            >
                @if (isPrevDropPointActive()) {
                    <div [class]="cx('dropPoint')" [attr.aria-hidden]="true" [pBind]="getPTOptions('dropPoint')"></div>
                }
                <div
                    [class]="cx('nodeContent')"
                    [style.marginLeft]="level()! * indentation()! + 'rem'"
                    (click)="onNodeClick($event)"
                    (dblclick)="onNodeDblClick($event)"
                    (touchend)="onNodeTouchEnd()"
                    (drop)="onNodeDrop($event)"
                    (dragstart)="onNodeDragStart($event)"
                    (dragover)="onNodeDragOver($event)"
                    (dragleave)="onNodeDragLeave($event)"
                    (dragend)="onNodeDragEnd($event)"
                    [draggable]="tree.draggableNodes()"
                    [pBind]="getPTOptions('nodeContent')"
                >
                    <button type="button" [class]="cx('nodeToggleButton')" (click)="toggle($event)" pRipple tabindex="-1" [attr.aria-label]="tree.togglerAriaLabel()" [pBind]="getPTOptions('nodeToggleButton')">
                        @if (!tree.togglerIconTemplate() && !tree._togglerIconTemplate()) {
                            @if (!node()!.loading) {
                                @if (!node()!.expanded) {
                                    <svg data-p-icon="chevron-right" [class]="cx('nodeToggleIcon')" [pBind]="getPTOptions('nodeToggleIcon')" />
                                }
                                @if (node()!.expanded) {
                                    <svg data-p-icon="chevron-down" [class]="cx('nodeToggleIcon')" [pBind]="getPTOptions('nodeToggleIcon')" />
                                }
                            }
                            @if (loadingMode() === 'icon' && node()!.loading) {
                                <svg data-p-icon="spinner" [class]="cx('nodeToggleIcon')" spin [pBind]="getPTOptions('nodeToggleIcon')" />
                            }
                        }
                        @if (tree.togglerIconTemplate() || tree._togglerIconTemplate()) {
                            <span [class]="cx('nodeToggleIcon')" [pBind]="getPTOptions('nodeToggleIcon')">
                                <ng-template *ngTemplateOutlet="tree.togglerIconTemplate() || tree._togglerIconTemplate(); context: { $implicit: node()!.expanded, loading: node()!.loading }"></ng-template>
                            </span>
                        }
                    </button>

                    @if (tree.selectionMode() == 'checkbox') {
                        <p-checkbox
                            [ngModel]="isSelected()"
                            [ngModelOptions]="{ standalone: true }"
                            [class]="cx('nodeCheckbox')"
                            [binary]="true"
                            [indeterminate]="node()!.partialSelected"
                            [disabled]="node()!.selectable === false"
                            [variant]="tree?.config.inputStyle() === 'filled' || tree?.config.inputVariant() === 'filled' ? 'filled' : 'outlined'"
                            [attr.data-p-partialchecked]="node()!.partialSelected"
                            [tabindex]="-1"
                            (click)="$event.preventDefault()"
                            [pt]="getPTOptions('pcNodeCheckbox')"
                            [unstyled]="unstyled()"
                        >
                            @if (tree.checkboxIconTemplate() || tree._checkboxIconTemplate()) {
                                <ng-template #icon>
                                    <ng-template
                                        *ngTemplateOutlet="
                                            tree.checkboxIconTemplate() || tree._checkboxIconTemplate();
                                            context: {
                                                $implicit: isSelected(),
                                                partialSelected: node()!.partialSelected,
                                                class: cx('nodeCheckbox')
                                            }
                                        "
                                    ></ng-template>
                                </ng-template>
                            }
                        </p-checkbox>
                    }

                    @if (node()!.icon || node()!.expandedIcon || node()!.collapsedIcon) {
                        <span [class]="getIcon()" [pBind]="getPTOptions('nodeIcon')"></span>
                    }
                    <span [class]="cx('nodeLabel')" [pBind]="getPTOptions('nodeLabel')">
                        @if (!tree.getTemplateForNode(node()!)) {
                            <span>{{ node()!.label }}</span>
                        }
                        @if (tree.getTemplateForNode(node()!)) {
                            <span>
                                <ng-container *ngTemplateOutlet="tree.getTemplateForNode(node()!); context: { $implicit: node() }"></ng-container>
                            </span>
                        }
                    </span>
                </div>
                @if (isNextDropPointActive()) {
                    <div [class]="cx('dropPoint', { next: true })" [attr.aria-hidden]="true" [pBind]="getPTOptions('dropPoint')"></div>
                }
                @if (!tree.virtualScroll() && node()!.children && node()!.expanded) {
                    <ul [class]="cx('nodeChildren')" role="group" [pBind]="ptm('nodeChildren')">
                        @for (childNode of node()!.children; track tree.trackBy().bind(this)(index, childNode); let index = $index) {
                            <p-treeNode [node]="childNode" [parentNode]="node()" [index]="index" [itemSize]="itemSize()" [level]="level()! + 1" [loadingMode]="loadingMode()" [pt]="pt()" [unstyled]="unstyled()"></p-treeNode>
                        }
                    </ul>
                }
            </li>
        }
    `,
    encapsulation: ViewEncapsulation.None,
    providers: [TreeStyle, { provide: TREENODE_INSTANCE, useExisting: UITreeNode }, { provide: PARENT_INSTANCE, useExisting: UITreeNode }]
})
export class UITreeNode extends BaseComponent<TreePassThrough> {
    $pcTreeNode: UITreeNode | undefined = inject(TREENODE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    static ICON_CLASS: string = 'p-tree-node-icon ';

    node = input<TreeNode<any> | undefined>();

    parentNode = input<TreeNode<any> | undefined>();

    index = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    level = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    indentation = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    itemSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });

    loadingMode = input<string>();

    tree: Tree = inject(forwardRef(() => Tree));

    isPrevDropPointHovered = signal<boolean>(false);

    isNextDropPointHovered = signal<boolean>(false);

    isNodeDropHovered = signal<boolean>(false);

    isPrevDropPointActive = computed(() => this.isPrevDropPointHovered() && this.isDroppable());

    isNextDropPointActive = computed(() => this.isNextDropPointHovered() && this.isDroppable());

    isNodeDropActive = computed(() => this.isNodeDropHovered() && this.isNodeDroppable());

    dropPosition = computed(() => (this.isPrevDropPointActive() ? -1 : this.isNextDropPointActive() ? 1 : 0));

    _componentStyle = inject(TreeStyle);

    /**
     * Computed signal that reactively tracks selection state.
     */
    private _selected = computed(() => {
        // Reading selection() makes this computed reactive to selection changes
        this.tree.selection();
        return this.tree.isSelected(<TreeNode>this.node());
    });

    /**
     * Computed signal that reactively tracks context menu selection state.
     */
    private _contextMenuSelected = computed(() => {
        const selection = this.tree.contextMenuSelection();
        const node = this.node();
        if (!selection || !node) {
            return false;
        }
        return selection === node || (selection.key && selection.key === node.key);
    });

    selected = computed(() => (this.tree.selectionMode() === 'single' || this.tree.selectionMode() === 'multiple' ? this._selected() : undefined));

    checked = computed(() => (this.tree.selectionMode() === 'checkbox' ? this._selected() : undefined));

    selectable = computed(() => (this.node()?.selectable === false ? false : this.tree?.selectionMode() != null));

    get subNodes(): TreeNode[] | undefined {
        const node = this.node();
        return node?.parent ? node.parent.children : this.tree.value();
    }

    getPTOptions(key: string) {
        return this.ptm(key, {
            context: {
                node: this.node(),
                index: this.index(),
                expanded: this.node()?.expanded,
                selected: this.selected(),
                checked: this.checked(),
                partialChecked: this.node()?.partialSelected,
                leaf: this.isLeaf()
            }
        });
    }

    onInit() {
        const parentNode = this.parentNode();
        (<TreeNode>this.node()).parent = parentNode;
        const nativeElement = this.tree.el.nativeElement;
        const pDialogWrapper = nativeElement.closest('p-dialog');
        if (parentNode && !pDialogWrapper) {
            this.setAllNodesTabIndexes();
            this.tree.syncNodeOption(<TreeNode>this.node(), <TreeNode<any>[]>this.tree.value(), 'parent', this.tree.getNodeWithKey(<string>parentNode.key, <TreeNode<any>[]>this.tree.value()));
        }
    }

    getIcon() {
        const node = <TreeNode>this.node();
        let icon: string | undefined;

        if (node.icon) icon = node.icon as string;
        else icon = node.expanded && node.children && node.children?.length ? node.expandedIcon : node.collapsedIcon;

        return UITreeNode.ICON_CLASS + ' ' + icon + ' p-tree-node-icon';
    }

    isLeaf() {
        return this.tree.isNodeLeaf(<TreeNode>this.node());
    }

    isSelected = computed(() => this._selected());

    isContextMenuSelected = computed(() => this._contextMenuSelected());

    isSameNode(event) {
        return event.currentTarget && (event.currentTarget.isSameNode(event.target) || event.currentTarget.isSameNode(event.target.closest('[role="treeitem"]')));
    }

    isDraggable = computed(() => this.tree.draggableNodes());

    isDroppable() {
        return this.tree.droppableNodes() && this.tree.allowDrop(<TreeNode>this.tree.dragNode(), <TreeNode>this.node(), this.tree.dragNodeScope());
    }

    isNodeDroppable() {
        return (<TreeNode>this.node())?.droppable !== false && this.isDroppable();
    }

    isNodeDraggable() {
        return (<TreeNode>this.node())?.draggable !== false && this.isDraggable();
    }

    toggle(event: Event) {
        if ((<TreeNode>this.node()).expanded) this.collapse(event);
        else this.expand(event);

        event.stopPropagation();
    }

    expand(event: Event) {
        (<TreeNode>this.node()).expanded = true;
        if (this.tree.virtualScroll()) {
            this.tree.updateSerializedValue();
            this.focusVirtualNode();
        }
        this.tree.onNodeExpand.emit({ originalEvent: event, node: <TreeNode>this.node() });
    }

    collapse(event: Event) {
        (<TreeNode>this.node()).expanded = false;
        if (this.tree.virtualScroll()) {
            this.tree.updateSerializedValue();
        }
        this.tree.onNodeCollapse.emit({ originalEvent: event, node: <TreeNode>this.node() });
        this.focusVirtualNode();
    }

    onNodeClick(event: MouseEvent) {
        this.tree.onNodeClick(event, <TreeNode>this.node());
    }

    onNodeTouchEnd() {
        this.tree.onNodeTouchEnd();
    }

    onNodeRightClick(event: MouseEvent) {
        // Bound on the focusable treeitem so the keyboard (menu key, Shift+F10) can open it; ignore events bubbling up from child nodes.
        if ((<Element>event.target).closest('[role="treeitem"]') !== event.currentTarget) {
            return;
        }

        this.tree.onNodeRightClick(event, <TreeNode>this.node());
    }

    onNodeDblClick(event: MouseEvent) {
        this.tree.onNodeDblClick(event, <TreeNode>this.node());
    }

    insertNodeOnDrop() {
        const dragNode = this.tree.dragNode();
        const dragNodeIndex = this.tree.dragNodeIndex();
        const dragNodeSubNodes = this.tree.dragNodeSubNodes();
        const node = this.node();

        if (!node || dragNodeIndex == null || !dragNode || !dragNodeSubNodes) {
            return;
        }

        const position = this.dropPosition();
        const subNodes = this.subNodes || [];
        const index = this.index() || 0;
        const dropIndex = dragNodeSubNodes === subNodes ? (dragNodeIndex > index ? index : index - 1) : index;

        dragNodeSubNodes.splice(dragNodeIndex, 1);

        if (position < 0) {
            // insert before a Node
            subNodes.splice(dropIndex, 0, dragNode);
        } else if (position > 0) {
            // insert after a Node
            subNodes.splice(dropIndex + 1, 0, dragNode);
        } else {
            // insert as child of a Node
            node.children = node.children || [];
            node.children.push(dragNode);
        }

        this.tree.dragDropService?.stopDrag({
            node: dragNode,
            subNodes,
            index: dragNodeIndex
        });
    }

    onNodeDrop(event: any) {
        event.preventDefault();
        event.stopPropagation();

        if (this.isDroppable()) {
            const dragNode = this.tree.dragNode();
            const position = this.dropPosition();
            const isValidDrop = position !== 0 || (position === 0 && this.isNodeDroppable());

            if (isValidDrop) {
                if (this.tree.validateDrop()) {
                    this.tree.onNodeDrop.emit({
                        originalEvent: event,
                        dragNode: dragNode,
                        dropNode: this.node(),
                        index: this.index(),
                        accept: () => {
                            this.insertNodeOnDrop();
                        }
                    });
                } else {
                    this.insertNodeOnDrop();
                    this.tree.onNodeDrop.emit({
                        originalEvent: event,
                        dragNode: dragNode,
                        dropNode: this.node(),
                        index: this.index()
                    });
                }
            }
        }

        this.isPrevDropPointHovered.set(false);
        this.isNextDropPointHovered.set(false);
        this.isNodeDropHovered.set(false);
    }

    onNodeDragStart(event: any) {
        if (this.isNodeDraggable()) {
            event.dataTransfer.effectAllowed = 'all';
            event.dataTransfer?.setData('text', 'data');

            const target = event.currentTarget as HTMLElement;
            const dragEl = target.cloneNode(true) as HTMLElement;
            const toggler = <HTMLElement>dragEl.querySelector('[data-pc-section="nodetogglebutton"]');
            const checkbox = <HTMLElement>dragEl.querySelector('[data-pc-name="pcnodecheckbox"]');

            target.setAttribute('data-p-dragging', 'true');
            dragEl.style.width = getOuterWidth(target) + 'px';
            dragEl.style.height = getOuterHeight(target) + 'px';
            dragEl.setAttribute('data-pc-section', 'drag-image');
            toggler.style.visibility = 'hidden';
            checkbox?.remove();
            document.body.appendChild(dragEl);

            event.dataTransfer?.setDragImage(dragEl, 0, 0);

            setTimeout(() => document.body.removeChild(dragEl), 0);

            this.tree.dragDropService?.startDrag({
                tree: this,
                node: this.node(),
                subNodes: this.subNodes,
                index: this.index(),
                scope: this.tree.draggableScope()
            });
        } else {
            event.preventDefault();
        }
    }

    onNodeDragOver(event: any) {
        if (this.isDroppable()) {
            event.dataTransfer.dropEffect = 'copy';

            const nodeElement = event.currentTarget as HTMLElement;
            const rect = nodeElement.getBoundingClientRect();
            const y = event.clientY - parseInt(rect.top as any);

            this.isPrevDropPointHovered.set(false);
            this.isNextDropPointHovered.set(false);
            this.isNodeDropHovered.set(false);

            if (y < rect.height * 0.25) {
                this.isPrevDropPointHovered.set(true);
            } else if (y > rect.height * 0.75) {
                this.isNextDropPointHovered.set(true);
            } else if (this.isNodeDroppable()) {
                this.isNodeDropHovered.set(true);
            }
        } else {
            event.dataTransfer.dropEffect = 'none';
        }

        if (this.tree.droppableNodes()) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    onNodeDragLeave() {
        this.isPrevDropPointHovered.set(false);
        this.isNextDropPointHovered.set(false);
        this.isNodeDropHovered.set(false);
    }

    onNodeDragEnd(event: any) {
        event.currentTarget?.removeAttribute('data-p-dragging');

        this.tree.dragDropService?.stopDrag({
            node: this.node(),
            subNodes: this.subNodes,
            index: this.index()
        });
    }

    onKeyDown(event: KeyboardEvent) {
        if (!this.isSameNode(event) || this.tree.contextMenu()?.visible?.()) {
            return;
        }

        switch (event.code) {
            //down arrow
            case 'ArrowDown':
                this.onArrowDown(event);
                break;

            //up arrow
            case 'ArrowUp':
                this.onArrowUp(event);
                break;

            //right arrow
            case 'ArrowRight':
                this.onArrowRight(event);
                break;

            //left arrow
            case 'ArrowLeft':
                this.onArrowLeft(event);
                break;

            //enter
            case 'Enter':
            case 'Space':
            case 'NumpadEnter':
                this.onEnter(event);
                break;
            //tab
            case 'Tab':
                this.setAllNodesTabIndexes();
                break;

            default:
                //no op
                break;
        }
    }

    onArrowUp(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement>event.target).getAttribute('data-pc-section') === 'nodetogglebutton' ? (<HTMLDivElement>event.target).closest('[role="treeitem"]') : (<HTMLDivElement>event.target).parentElement;

        if (nodeElement?.previousElementSibling) {
            this.focusRowChange(nodeElement, nodeElement.previousElementSibling, this.findLastVisibleDescendant(nodeElement.previousElementSibling));
        } else {
            let parentNodeElement = this.getParentNodeElement(nodeElement!);

            if (parentNodeElement) {
                this.focusRowChange(nodeElement, parentNodeElement);
            }
        }

        event.preventDefault();
    }

    onArrowDown(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement>event.target).getAttribute('data-pc-section') === 'nodetogglebutton' ? (<HTMLDivElement>event.target).closest('[role="treeitem"]') : <HTMLDivElement>event.target;
        const listElement = nodeElement?.children[1];

        if (listElement && listElement.children.length > 0) {
            this.focusRowChange(nodeElement, listElement.children[0]);
        } else {
            if (nodeElement?.parentElement?.nextElementSibling) {
                this.focusRowChange(nodeElement, nodeElement.parentElement.nextElementSibling);
            } else {
                let nextSiblingAncestor = this.findNextSiblingOfAncestor(nodeElement?.parentElement!);

                if (nextSiblingAncestor) {
                    this.focusRowChange(nodeElement, nextSiblingAncestor);
                }
            }
        }
        event.preventDefault();
    }

    onArrowRight(event: KeyboardEvent) {
        if (!this.node()?.expanded && !this.tree.isNodeLeaf(<TreeNode>this.node())) {
            const nodeElement = <HTMLDivElement>event.currentTarget;
            this.expand(event);

            setTimeout(() => {
                // a lazy node has no children until they are loaded: keep the focus on it rather than on the next sibling
                if (this.node()?.children?.length) {
                    nodeElement.tabIndex = -1;
                    this.onArrowDown(event);
                }
            }, 1);
        }
        event.preventDefault();
    }

    onArrowLeft(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement>event.target).getAttribute('data-pc-section') === 'nodetogglebutton' ? (<HTMLDivElement>event.target).closest('[role="treeitem"]') : <HTMLDivElement>event.target;

        if (this.level() === 0 && !this.node()?.expanded) {
            return false;
        }

        if (this.node()?.expanded) {
            this.collapse(event);
            return;
        }

        let parentNodeElement = this.getParentNodeElement(nodeElement?.parentElement!);

        if (parentNodeElement) {
            this.focusRowChange(event.currentTarget, parentNodeElement);
        }

        event.preventDefault();
    }

    onEnter(event: KeyboardEvent) {
        this.tree.onNodeClick(event, <TreeNode>this.node());
        this.setTabIndexForSelectionMode(event, this.tree.nodeTouched());
        event.preventDefault();
    }

    setAllNodesTabIndexes() {
        const nodes = <any>find(this.tree.el.nativeElement, '[data-pc-section="node"]');

        const hasSelectedNode = [...nodes].some((node) => node.getAttribute('aria-selected') === 'true' || node.getAttribute('aria-checked') === 'true');

        [...nodes].forEach((node) => {
            node.tabIndex = -1;
        });

        if (hasSelectedNode) {
            const selectedNodes = [...nodes].filter((node) => node.getAttribute('aria-selected') === 'true' || node.getAttribute('aria-checked') === 'true');

            selectedNodes[0].tabIndex = 0;

            return;
        }

        if (nodes.length) {
            ([...nodes][0] as any).tabIndex = 0;
        }
    }

    setTabIndexForSelectionMode(event, nodeTouched) {
        if (this.tree.selectionMode() !== null) {
            const elements = [...find(this.tree.el.nativeElement, '[role="treeitem"]')];

            event.currentTarget.tabIndex = nodeTouched === false ? -1 : 0;

            if (elements.every((element: any) => element.tabIndex === -1)) {
                (elements[0] as any).tabIndex = 0;
            }
        }
    }

    findNextSiblingOfAncestor(nodeElement: any): any {
        let parentNodeElement = this.getParentNodeElement(nodeElement);

        if (parentNodeElement) {
            if (parentNodeElement.nextElementSibling) return parentNodeElement.nextElementSibling;
            else return this.findNextSiblingOfAncestor(parentNodeElement);
        } else {
            return null;
        }
    }

    findLastVisibleDescendant(nodeElement: any): any {
        const listElement = <HTMLElement>Array.from(nodeElement.children).find((el: any) => el.getAttribute('data-pc-section') === 'node');
        const childrenListElement = listElement?.children[1];
        if (childrenListElement && childrenListElement.children.length > 0) {
            const lastChildElement = childrenListElement.children[childrenListElement.children.length - 1];

            return this.findLastVisibleDescendant(lastChildElement);
        } else {
            return nodeElement;
        }
    }

    getParentNodeElement(nodeElement: HTMLElement | Element) {
        const parentNodeElement = nodeElement.parentElement?.parentElement?.parentElement;

        return parentNodeElement?.tagName === 'P-TREENODE' ? parentNodeElement : null;
    }

    focusNode(element: any) {
        (element.children[0] as HTMLElement).focus();
    }

    focusRowChange(firstFocusableRow, currentFocusedRow, lastVisibleDescendant?) {
        firstFocusableRow.tabIndex = '-1';
        currentFocusedRow.children[0].tabIndex = '0';

        this.focusNode(lastVisibleDescendant || currentFocusedRow);
    }

    focusVirtualNode() {
        setTimeout(() => {
            let node = <any>findSingle(this.tree?.contentViewChild()?.nativeElement, `[data-id="${<TreeNode>this.node()?.key ?? <TreeNode>this.node()?.data}"]`);
            focus(node);
        }, 1);
    }
}
/**
 * Tree is used to display hierarchical data.
 * @group Components
 */
@Component({
    selector: 'p-tree',
    imports: [CommonModule, Scroller, SharedModule, SearchIcon, SpinnerIcon, InputText, FormsModule, IconField, InputIcon, UITreeNode, AutoFocusModule, Bind],
    template: `
        @if (loading() && loadingMode() === 'mask') {
            <div [class]="cx('mask')" [pBind]="ptm('mask')" animate.enter="p-overlay-mask-enter-active" animate.leave="p-overlay-mask-leave-active">
                @if (loadingIcon()) {
                    <i [class]="cn(cx('loadingIcon'), 'pi-spin' + loadingIcon())" [pBind]="ptm('loadingIcon')"></i>
                }
                @if (!loadingIcon()) {
                    @if (!loadingIconTemplate() && !_loadingIconTemplate()) {
                        <svg data-p-icon="spinner" spin [class]="cx('loadingIcon')" [pBind]="ptm('loadingIcon')" />
                    }
                    @if (loadingIconTemplate() || _loadingIconTemplate()) {
                        <span [class]="cx('loadingIcon')" [pBind]="ptm('loadingIcon')">
                            <ng-template *ngTemplateOutlet="loadingIconTemplate() || _loadingIconTemplate()"></ng-template>
                        </span>
                    }
                }
            </div>
        }
        <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate()"></ng-container>
        @if (filterTemplate() || _filterTemplate()) {
            <ng-container *ngTemplateOutlet="filterTemplate() || _filterTemplate(); context: { $implicit: _filterOptions() }"></ng-container>
        } @else {
            @if (filter()) {
                <p-iconfield [class]="cx('pcFilterContainer')" [pt]="ptm('pcFilterContainer')" [unstyled]="unstyled()">
                    <input
                        #filter
                        [pAutoFocus]="filterInputAutoFocus()"
                        pInputText
                        type="search"
                        autocomplete="off"
                        [class]="cx('pcFilterInput')"
                        [attr.placeholder]="filterPlaceholder()"
                        (keydown.enter)="$event.preventDefault()"
                        (input)="_filter($event.target?.value)"
                        [pt]="ptm('pcFilterInput')"
                        [unstyled]="unstyled()"
                    />
                    <p-inputicon [pt]="ptm('pcFilterIconContainer')" [unstyled]="unstyled()">
                        @if (!filterIconTemplate() && !_filterIconTemplate()) {
                            <svg data-p-icon="search" [class]="cx('filterIcon')" [pBind]="ptm('filterIcon')" />
                        }
                        @if (filterIconTemplate() || _filterIconTemplate()) {
                            <span [class]="cx('filterIcon')" [pBind]="ptm('filterIcon')">
                                <ng-template *ngTemplateOutlet="filterIconTemplate() || _filterIconTemplate()"></ng-template>
                            </span>
                        }
                    </p-inputicon>
                </p-iconfield>
            }
        }

        @if (getRootNode()?.length) {
            @if (virtualScroll()) {
                <p-scroller
                    #scroller
                    [items]="serializedValue()"
                    [tabindex]="-1"
                    [styleClass]="cx('wrapper')"
                    [style]="{ height: scrollHeight() !== 'flex' ? scrollHeight() : undefined }"
                    [scrollHeight]="scrollHeight() !== 'flex' ? undefined : '100%'"
                    [itemSize]="virtualScrollItemSize()"
                    [lazy]="lazy()"
                    (onScroll)="onScroll.emit($event)"
                    (onScrollIndexChange)="onScrollIndexChange.emit($event)"
                    (onLazyLoad)="onLazyLoad.emit($event)"
                    [options]="virtualScrollOptions()"
                    [pt]="ptm('virtualScroller')"
                    hostName="tree"
                    [attr.data-p]="wrapperDataP()"
                >
                    <ng-template #content let-items let-scrollerOptions="options">
                        @if (items) {
                            <ul
                                #content
                                [class]="cx('rootChildren')"
                                [ngClass]="scrollerOptions.contentStyleClass"
                                [style]="scrollerOptions.contentStyle"
                                role="tree"
                                [attr.aria-label]="ariaLabel()"
                                [attr.aria-labelledby]="ariaLabelledBy()"
                                [pBind]="ptm('rootChildren')"
                            >
                                @for (rowNode of items; track trackBy().bind(this)(index, rowNode); let index = $index) {
                                    <p-treeNode
                                        #treeNode
                                        [level]="rowNode.level"
                                        [node]="rowNode.node"
                                        [parentNode]="rowNode.parent"
                                        [index]="getIndex(scrollerOptions, index)"
                                        [itemSize]="scrollerOptions.itemSize"
                                        [indentation]="indentation()"
                                        [loadingMode]="loadingMode()"
                                        [pt]="pt()"
                                        [unstyled]="unstyled()"
                                    ></p-treeNode>
                                }
                            </ul>
                        }
                    </ng-template>
                    @if (loaderTemplate() || _loaderTemplate()) {
                        <ng-template #loader let-scrollerOptions="options">
                            <ng-container *ngTemplateOutlet="loaderTemplate() || _loaderTemplate(); context: { options: scrollerOptions }"></ng-container>
                        </ng-template>
                    }
                </p-scroller>
            }
            @if (!virtualScroll()) {
                <div #wrapper [class]="cx('wrapper')" [style.max-height]="scrollHeight()" [pBind]="ptm('wrapper')" [attr.data-p]="wrapperDataP()">
                    @if (getRootNode()) {
                        <ul #content [class]="cx('rootChildren')" role="tree" [attr.aria-label]="ariaLabel()" [attr.aria-labelledby]="ariaLabelledBy()" [pBind]="ptm('rootChildren')">
                            @for (node of getRootNode(); track trackBy().bind(this)(index, node); let index = $index) {
                                <p-treeNode [node]="node" [index]="index" [level]="0" [loadingMode]="loadingMode()" [pt]="pt()" [unstyled]="unstyled()"></p-treeNode>
                            }
                        </ul>
                    }
                </div>
            }
        }

        @if (!loading() && (getRootNode() == null || getRootNode().length === 0)) {
            <div [class]="cx('emptyMessage')" [pBind]="ptm('emptyMessage')">
                @if (!emptyTemplate() && !_emptyTemplate()) {
                    {{ emptyMessageLabel() }}
                } @else {
                    <ng-container *ngTemplateOutlet="emptyTemplate() || _emptyTemplate()"></ng-container>
                }
            </div>
        }
        <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate()"></ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TreeStyle, { provide: TREE_INSTANCE, useExisting: Tree }, { provide: PARENT_INSTANCE, useExisting: Tree }],
    host: {
        '[class]': "cx('root')",
        '[attr.data-p]': 'containerDataP()'
    },
    hostDirectives: [Bind]
})
export class Tree extends BaseComponent<TreePassThrough> implements BlockableUI {
    dragDropService = inject(TreeDragDropService, { optional: true });

    componentName = 'Tree';

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcTree: Tree | undefined = inject(TREE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
        effect(() => {
            this.value();
            untracked(() => {
                this.updateSerializedValue();
                if (this.hasFilterActive()) {
                    this._filter(this.filterViewChild()?.nativeElement?.value);
                }
            });
        });
    }
    /**
     * An array of treenodes.
     * @group Props
     */
    value = model<TreeNode<any> | TreeNode<any>[] | any[] | any>();
    /**
     * Defines the selection mode.
     * @group Props
     */
    selectionMode = input<'single' | 'multiple' | 'checkbox' | null | undefined>();
    /**
     * Loading mode display.
     * @group Props
     */
    loadingMode = input<'mask' | 'icon'>('mask');
    /**
     * A single treenode instance or an array to refer to the selections.
     * @group Props
     */
    selection = model<TreeNode<any> | TreeNode<any>[] | null | undefined>(null);
    /**
     * Context menu instance.
     * @group Props
     */
    contextMenu = input<any>();
    /**
     * Defines the behavior of context menu selection, in "separate" mode context menu updates contextMenuSelection property whereas in joint mode selection property is used instead so that when row selection is enabled, both row selection and context menu selection use the same property.
     * @group Props
     */
    contextMenuSelectionMode = input<'separate' | 'joint'>('joint');
    /**
     * Selected node with a context menu.
     * @group Props
     */
    contextMenuSelection = model<TreeNode<any> | null>(null);
    /**
     * Scope of the draggable nodes to match a droppableScope.
     * @group Props
     */
    draggableScope = input<any>();
    /**
     * Scope of the droppable nodes to match a draggableScope.
     * @group Props
     */
    droppableScope = input<any>();
    /**
     * Whether the nodes are draggable.
     * @group Props
     */
    draggableNodes = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether the nodes are droppable.
     * @group Props
     */
    droppableNodes = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    metaKeySelection = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether checkbox selections propagate to ancestor nodes.
     * @group Props
     */
    propagateSelectionUp = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether checkbox selections propagate to descendant nodes.
     * @group Props
     */
    propagateSelectionDown = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Displays a loader to indicate data load is in progress.
     * @group Props
     */
    loading = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * The icon to show while indicating data load is in progress.
     * @group Props
     */
    loadingIcon = input<string | undefined>();
    /**
     * Text to display when there is no data.
     * @group Props
     */
    emptyMessage = input<string>('');
    /**
     * Used to define a string that labels the tree.
     * @group Props
     */
    ariaLabel = input<string | undefined>();
    /**
     * Defines a string that labels the toggler icon for accessibility.
     * @group Props
     */
    togglerAriaLabel = input<string | undefined>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>();
    /**
     * When enabled, drop can be accepted or rejected based on condition defined at onNodeDrop.
     * @group Props
     */
    validateDrop = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When specified, displays an input field to filter the items.
     * @group Props
     */
    filter = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Determines whether the filter input should be automatically focused when the component is rendered.
     * @group Props
     */
    filterInputAutoFocus = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
     * @group Props
     */
    filterBy = input<string>('label');
    /**
     * Mode for filtering valid values are "lenient" and "strict". Default is lenient.
     * @group Props
     */
    filterMode = input<string>('lenient');
    /**
     * Mode for filtering valid values are "lenient" and "strict". Default is lenient.
     * @group Props
     */
    filterOptions = input<any>();
    /**
     * Placeholder text to show when filter input is empty.
     * @group Props
     */
    filterPlaceholder = input<string | undefined>();
    /**
     * Values after the tree nodes are filtered.
     * @group Props
     */
    filteredNodes = model<TreeNode<any>[] | undefined | null>();
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    filterLocale = input<string | undefined>();
    /**
     * Height of the scrollable viewport.
     * @group Props
     */
    scrollHeight = input<string | undefined>();
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    lazy = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    virtualScroll = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Height of an item in the list for VirtualScrolling.
     * @group Props
     */
    virtualScrollItemSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    virtualScrollOptions = input<ScrollerOptions | undefined>();
    /**
     * Indentation factor for spacing of the nested node when virtual scrolling is enabled.
     * @group Props
     */
    indentation = input<number, unknown>(1.5, { transform: numberAttribute });
    /**
     * Custom templates of the component.
     * @group Props
     */
    _templateMap = input<any>();
    /**
     * Function to optimize the node list rendering, default algorithm checks for object identity.
     * @group Props
     */
    trackBy = input<Function>((index: number, item: any) => item);
    /**
     * Highlights the node on select.
     * @group Props
     */
    highlightOnSelect = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Callback to invoke when a node is selected.
     * @param {TreeNodeSelectEvent} event - Node select event.
     * @group Emits
     */
    readonly onNodeSelect = output<TreeNodeSelectEvent>();
    /**
     * Callback to invoke when a node is unselected.
     * @param {TreeNodeUnSelectEvent} event - Node unselect event.
     * @group Emits
     */
    readonly onNodeUnselect = output<TreeNodeUnSelectEvent>();
    /**
     * Callback to invoke when a node is expanded.
     * @param {TreeNodeExpandEvent} event - Node expand event.
     * @group Emits
     */
    readonly onNodeExpand = output<TreeNodeExpandEvent>();
    /**
     * Callback to invoke when a node is collapsed.
     * @param {TreeNodeCollapseEvent} event - Node collapse event.
     * @group Emits
     */
    readonly onNodeCollapse = output<TreeNodeCollapseEvent>();
    /**
     * Callback to invoke when a node is selected with right click.
     * @param {onNodeContextMenuSelect} event - Node context menu select event.
     * @group Emits
     */
    readonly onNodeContextMenuSelect = output<TreeNodeContextMenuSelectEvent>();
    /**
     * Callback to invoke when a node is double clicked.
     * @param {TreeNodeDoubleClickEvent} event - Node double click event.
     * @group Emits
     */
    readonly onNodeDoubleClick = output<TreeNodeDoubleClickEvent>();
    /**
     * Callback to invoke when a node is dropped.
     * @param {TreeNodeDropEvent} event - Node drop event.
     * @group Emits
     */
    readonly onNodeDrop = output<TreeNodeDropEvent>();
    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {TreeLazyLoadEvent} event - Custom lazy load event.
     * @group Emits
     */
    readonly onLazyLoad = output<TreeLazyLoadEvent>();
    /**
     * Callback to invoke in virtual scroll mode when scroll position changes.
     * @param {TreeScrollEvent} event - Custom scroll event.
     * @group Emits
     */
    readonly onScroll = output<TreeScrollEvent>();
    /**
     * Callback to invoke in virtual scroll mode when scroll position and item's range in view changes.
     * @param {TreeScrollIndexChangeEvent} event - Scroll index change event.
     * @group Emits
     */
    readonly onScrollIndexChange = output<TreeScrollIndexChangeEvent>();
    /**
     * Callback to invoke when data is filtered.
     * @param {TreeFilterEvent} event - Custom filter event.
     * @group Emits
     */
    readonly onFilter = output<TreeFilterEvent>();
    /**
     * Custom filter template.
     * @param {TreeFilterTemplateContext} context - filter context.
     * @see {@link TreeFilterTemplateContext}
     * @group Templates
     */
    readonly filterTemplate = contentChild<TemplateRef<TreeFilterTemplateContext>>('filter', { descendants: false });
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
     * Custom loader template.
     * @param {TreeLoaderTemplateContext} context - loader context.
     * @see {@link TreeLoaderTemplateContext}
     * @group Templates
     */
    readonly loaderTemplate = contentChild<TemplateRef<TreeLoaderTemplateContext>>('loader', { descendants: false });
    /**
     * Custom empty message template.
     * @group Templates
     */
    readonly emptyTemplate = contentChild<TemplateRef<void>>('empty', { descendants: false });
    /**
     * Custom toggler icon template.
     * @param {TreeTogglerIconTemplateContext} context - toggler icon context.
     * @see {@link TreeTogglerIconTemplateContext}
     * @group Templates
     */
    readonly togglerIconTemplate = contentChild<TemplateRef<TreeTogglerIconTemplateContext>>('togglericon', { descendants: false });
    /**
     * Custom checkbox icon template.
     * @param {TreeCheckboxIconTemplateContext} context - checkbox icon context.
     * @see {@link TreeCheckboxIconTemplateContext}
     * @group Templates
     */
    readonly checkboxIconTemplate = contentChild<TemplateRef<TreeCheckboxIconTemplateContext>>('checkboxicon', { descendants: false });
    /**
     * Custom loading icon template.
     * @group Templates
     */
    readonly loadingIconTemplate = contentChild<TemplateRef<void>>('loadingicon', { descendants: false });
    /**
     * Custom filter icon template.
     * @group Templates
     */
    readonly filterIconTemplate = contentChild<TemplateRef<void>>('filtericon', { descendants: false });

    readonly filterViewChild = viewChild<Nullable<ElementRef>>('filter');

    readonly scroller = viewChild<Nullable<Scroller>>('scroller');

    readonly wrapperViewChild = viewChild<Nullable<ElementRef>>('wrapper');

    readonly contentViewChild = viewChild<Nullable<ElementRef>>('content');

    private readonly templates = contentChildren(PrimeTemplate);

    _headerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    _emptyTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'empty')
                .at(-1)?.template
    );

    _footerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    _loaderTemplate = computed<TemplateRef<TreeLoaderTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'loader')
                .at(-1)?.template
    );

    _togglerIconTemplate = computed<TemplateRef<TreeTogglerIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'togglericon')
                .at(-1)?.template
    );

    _checkboxIconTemplate = computed<TemplateRef<TreeCheckboxIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'checkboxicon')
                .at(-1)?.template
    );

    _loadingIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'loadingicon')
                .at(-1)?.template
    );

    _filterIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'filtericon')
                .at(-1)?.template
    );

    _filterTemplate = computed<TemplateRef<TreeFilterTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'filter')
                .at(-1)?.template
    );

    $templateMap = computed<any>(() => {
        const templates = this.templates();

        if (!templates.length) {
            return this._templateMap();
        }

        const templateMap = {};
        templates.forEach((item) => {
            if (!['header', 'empty', 'footer', 'loader', 'togglericon', 'checkboxicon', 'loadingicon', 'filtericon', 'filter'].includes(item.getType())) {
                templateMap[<any>item.name()] = item.template;
            }
        });

        return templateMap;
    });

    serializedValue = signal<Nullable<TreeNode<any>[]>>(undefined);

    public nodeTouched = signal<boolean | undefined | null>(undefined);

    public dragNode = signal<TreeNode<any> | undefined | null>(undefined);

    public dragNodeSubNodes = signal<TreeNode<any>[] | undefined | null>(undefined);

    public dragNodeIndex = signal<number | undefined | null>(undefined);

    public dragNodeScope = signal<any>(undefined);

    public dragHover = signal<boolean | undefined | null>(undefined);

    public dragStartSubscription = signal<Subscription | undefined | null>(undefined);

    public dragStopSubscription = signal<Subscription | undefined | null>(undefined);

    _componentStyle = inject(TreeStyle);

    @HostListener('drop', ['$event'])
    handleDropEvent(event: DragEvent) {
        this.onDrop(event);
    }

    @HostListener('dragover', ['$event'])
    handleDragOverEvent(event: DragEvent) {
        this.onDragOver(event);
    }

    @HostListener('dragenter')
    handleDragEnterEvent() {
        this.onDragEnter();
    }

    @HostListener('dragleave', ['$event'])
    handleDragLeaveEvent(event: DragEvent) {
        this.onDragLeave(event);
    }

    _filterOptions = computed<any>(() =>
        this.filterBy()
            ? {
                  filter: (value) => this._filter(value),
                  reset: () => this.resetFilter()
              }
            : this.filterOptions()
    );

    onInit() {
        if (this.droppableNodes()) {
            this.dragStartSubscription.set(
                this.dragDropService?.dragStart$.subscribe((event) => {
                    this.dragNode.set(event.node);
                    this.dragNodeSubNodes.set(event.subNodes);
                    this.dragNodeIndex.set(event.index);
                    this.dragNodeScope.set(event.scope);
                })
            );

            this.dragStopSubscription.set(
                this.dragDropService?.dragStop$.subscribe((event) => {
                    this.dragNode.set(null);
                    this.dragNodeSubNodes.set(null);
                    this.dragNodeIndex.set(null);
                    this.dragNodeScope.set(null);
                    this.dragHover.set(false);
                })
            );
        }
    }

    translation = toSignal(this.config.translationObserver, { initialValue: this.config.translation });

    emptyMessageLabel = computed<string>(() => this.emptyMessage() || this.translation()[TranslationKeys.EMPTY_MESSAGE]);

    onDoCheck() {
        // nodes expanded or collapsed programmatically (node.expanded mutated in place) must be re-serialized for the virtual scroller
        if (this.virtualScroll() && this.isSerializedValueStale()) {
            this.updateSerializedValue();
        }
    }

    isSerializedValueStale() {
        const rows = (this.serializedValue() as any[]) || [];

        return rows.some((row, i) => !!(row.node.expanded && row.node.children?.length) !== (rows[i + 1]?.parent === row.node));
    }

    updateSerializedValue() {
        this.serializedValue.set([]);
        this.serializeNodes(null, this.getRootNode(), 0, true);
    }

    serializeNodes(parent: TreeNode<any> | null, nodes: TreeNode<any>[] | any, level: number, visible: boolean) {
        if (nodes && nodes.length) {
            for (let node of nodes) {
                node.parent = parent;
                const rowNode = {
                    node: node,
                    parent: parent,
                    level: level,
                    visible: visible && (parent ? parent.expanded : true)
                };
                (this.serializedValue() as TreeNode<any>[]).push(<TreeNode>rowNode);

                if (rowNode.visible && node.expanded) {
                    this.serializeNodes(node, node.children, level + 1, rowNode.visible);
                }
            }
        }
    }

    onNodeClick(event: Event, node: TreeNode) {
        let eventTarget = <Element>event.target;
        const section = eventTarget?.getAttribute?.('data-pc-section');
        if (section === 'nodetogglebutton' || section === 'nodetoggleicon') {
            return;
        }

        if (this.selectionMode()) {
            if (node.selectable === false) {
                node.style = '--p-focus-ring-color: none;';
                return;
            } else {
                if (!node.style?.includes('--p-focus-ring-color')) {
                    node.style = node.style ? `${node.style}--p-focus-ring-color: var(--primary-color)` : '--p-focus-ring-color: var(--primary-color)';
                }
            }

            if (this.hasFilteredNodes()) {
                if (this.isCheckboxSelectionMode()) {
                    // checkbox propagation must walk the full tree, not only the children left visible by the filter
                    this.linkParentNodes(<TreeNode<any>[]>this.value(), undefined);
                    node = this.getNodeWithKey(<string>node.key, <TreeNode<any>[]>this.value()) as TreeNode;
                } else {
                    node = this.getNodeWithKey(<string>node.key, <TreeNode<any>[]>this.filteredNodes()) as TreeNode;
                }
                if (!node) {
                    return;
                }
            }

            let index = this.findIndexInSelection(node);
            let selected = index >= 0;
            const currentSelection = this.selection();

            if (this.isCheckboxSelectionMode()) {
                if (selected) {
                    if (this.propagateSelectionDown()) this.propagateDown(node, false);
                    else this.selection.set((currentSelection as TreeNode[]).filter((_val: TreeNode, i: number) => i != index));

                    if (this.propagateSelectionUp() && node.parent) {
                        this.propagateUp(node.parent, false);
                    }

                    this.onNodeUnselect.emit({ originalEvent: event, node: node });
                } else {
                    if (this.propagateSelectionDown()) this.propagateDown(node, true);
                    else this.selection.set([...((currentSelection as TreeNode[]) || []), node]);

                    if (this.propagateSelectionUp() && node.parent) {
                        this.propagateUp(node.parent, true);
                    }

                    this.onNodeSelect.emit({ originalEvent: event, node: node });
                }
            } else {
                let metaSelection = this.nodeTouched() ? false : this.metaKeySelection();

                if (metaSelection) {
                    let metaKey = (<KeyboardEvent>event).metaKey || (<KeyboardEvent>event).ctrlKey;

                    if (selected && metaKey) {
                        if (this.isSingleSelectionMode()) {
                            this.selection.set(null);
                        } else {
                            this.selection.set((currentSelection as TreeNode[]).filter((_val: TreeNode, i: number) => i != index));
                        }

                        this.onNodeUnselect.emit({ originalEvent: event, node: node });
                    } else {
                        if (this.isSingleSelectionMode()) {
                            this.selection.set(node);
                        } else if (this.isMultipleSelectionMode()) {
                            const base = !metaKey ? [] : (currentSelection as TreeNode[]) || [];
                            this.selection.set([...base, node]);
                        }

                        this.onNodeSelect.emit({ originalEvent: event, node: node });
                    }
                } else {
                    if (this.isSingleSelectionMode()) {
                        if (selected) {
                            this.selection.set(null);
                            this.onNodeUnselect.emit({ originalEvent: event, node: node });
                        } else {
                            this.selection.set(node);
                            setTimeout(() => {
                                this.onNodeSelect.emit({ originalEvent: event, node: node });
                            });
                        }
                    } else {
                        if (selected) {
                            this.selection.set((currentSelection as TreeNode[]).filter((_val: TreeNode, i: number) => i != index));
                            this.onNodeUnselect.emit({ originalEvent: event, node: node });
                        } else {
                            this.selection.set([...((currentSelection as TreeNode[]) || []), node]);
                            setTimeout(() => {
                                this.onNodeSelect.emit({ originalEvent: event, node: node });
                            });
                        }
                    }
                }
            }
        }

        this.nodeTouched.set(false);
    }

    onNodeTouchEnd() {
        this.nodeTouched.set(true);
    }

    onNodeRightClick(event: MouseEvent, node: TreeNode<any>) {
        if (this.contextMenu()) {
            let eventTarget = <Element>event.target;
            const section = eventTarget.getAttribute('data-pc-section');

            if (section === 'nodetogglebutton' || section === 'nodetoggleicon') {
                return;
            }

            let index = this.findIndexInSelection(node);
            let isNodeSelected = index >= 0;

            const onContextMenuCallback = () => {
                this.contextMenu().show(event);
                this.contextMenu().hideCallback.set(() => {
                    this.contextMenuSelection.set(null);
                });

                this.onNodeContextMenuSelect.emit({ originalEvent: event, node: node });
            };

            if (this.contextMenuSelectionMode() === 'separate') {
                // In 'separate' mode: Update contextMenuSelection with clicked node, don't modify selection
                this.contextMenuSelection.set(node);
                onContextMenuCallback();
            } else if (this.contextMenuSelectionMode() === 'joint') {
                // In 'joint' mode: Update only selection, don't touch contextMenuSelection
                if (!isNodeSelected) {
                    if (this.isSingleSelectionMode()) {
                        this.selection.set(node);
                    } else {
                        this.selection.set([node]);
                    }
                }
                // If already selected, keep current selection as is

                onContextMenuCallback();
            }
        }
    }

    onNodeDblClick(event: MouseEvent, node: TreeNode<any>) {
        this.onNodeDoubleClick.emit({ originalEvent: event, node: node });
    }

    findIndexInSelection(node: TreeNode) {
        let index: number = -1;
        const currentSelection = this.selection();
        if (this.selectionMode() && currentSelection) {
            if (this.isSingleSelectionMode()) {
                const sel = currentSelection as TreeNode;
                let areNodesEqual = (sel.key && sel.key === node.key) || sel == node;
                index = areNodesEqual ? 0 : -1;
            } else {
                const selArray = currentSelection as TreeNode[];
                for (let i = 0; i < selArray.length; i++) {
                    let selectedNode = selArray[i];
                    let areNodesEqual = (selectedNode.key && selectedNode.key === node.key) || selectedNode == node;
                    if (areNodesEqual) {
                        index = i;
                        break;
                    }
                }
            }
        }

        return index;
    }

    syncNodeOption(node: TreeNode, parentNodes: TreeNode<any>[], option: any, value?: any) {
        // to synchronize the node option between the filtered nodes and the original nodes(this.value())
        const _node = this.hasFilteredNodes() ? this.getNodeWithKey(<string>node.key, parentNodes) : null;
        if (_node) {
            (<any>_node)[option] = value || (<any>node)[option];
        }
    }

    hasFilteredNodes = computed(() => this.filter() && this.filteredNodes() && this.filteredNodes()!.length);

    hasFilterActive() {
        return this.filter() && this.filterViewChild()?.nativeElement?.value.length > 0;
    }

    getNodeWithKey(key: string, nodes: TreeNode<any>[]): TreeNode<any> | undefined {
        for (let node of nodes) {
            if (node.key === key) {
                return node;
            }

            if (node.children) {
                let matchedNode = this.getNodeWithKey(key, node.children);
                if (matchedNode) {
                    return matchedNode;
                }
            }
        }
    }

    linkParentNodes(nodes: TreeNode<any>[] | undefined, parent: TreeNode<any> | undefined) {
        if (nodes) {
            for (let node of nodes) {
                node.parent = parent;
                this.linkParentNodes(node.children, node);
            }
        }
    }

    propagateUp(node: TreeNode, select: boolean) {
        if (node.children && node.children.length) {
            let selectedCount: number = 0;
            let childPartialSelected: boolean = false;
            for (let child of node.children) {
                if (this.isSelected(child)) {
                    selectedCount++;
                } else if (child.partialSelected) {
                    childPartialSelected = true;
                }
            }

            const currentSelection = (this.selection() as TreeNode[]) || [];
            if (select && selectedCount == node.children.length) {
                if (!this.isSelected(node)) this.selection.set([...currentSelection, node]);
                node.partialSelected = false;
            } else {
                if (!select) {
                    let index = this.findIndexInSelection(node);
                    if (index >= 0) {
                        this.selection.set(currentSelection.filter((_val: TreeNode, i: number) => i != index));
                    }
                }

                if (childPartialSelected || (selectedCount > 0 && selectedCount != node.children.length)) node.partialSelected = true;
                else node.partialSelected = false;
            }

            this.syncNodeOption(node, <TreeNode<any>[]>this.filteredNodes(), 'partialSelected');
        }

        let parent = node.parent;
        if (parent) {
            this.propagateUp(parent, select);
        }
    }

    propagateDown(node: TreeNode, select: boolean) {
        let index = this.findIndexInSelection(node);
        const currentSelection = (this.selection() as TreeNode[]) || [];

        if (select && index == -1) {
            this.selection.set([...currentSelection, node]);
        } else if (!select && index > -1) {
            this.selection.set(currentSelection.filter((_val: TreeNode, i: number) => i != index));
        }

        node.partialSelected = false;

        this.syncNodeOption(node, <TreeNode<any>[]>this.filteredNodes(), 'partialSelected');

        if (node.children && node.children.length) {
            for (let child of node.children) {
                this.propagateDown(child, select);
            }
        }
    }

    isSelected(node: TreeNode) {
        return this.findIndexInSelection(node) != -1;
    }

    isSingleSelectionMode = computed(() => this.selectionMode() && this.selectionMode() == 'single');

    isMultipleSelectionMode = computed(() => this.selectionMode() && this.selectionMode() == 'multiple');

    isCheckboxSelectionMode = computed(() => this.selectionMode() && this.selectionMode() == 'checkbox');

    isNodeLeaf(node: TreeNode): boolean {
        return node.leaf == false ? false : !(node.children && node.children.length);
    }

    getRootNode = computed(() => (this.filteredNodes() ? this.filteredNodes() : this.value()));

    getTemplateForNode(node: TreeNode): TemplateRef<any> | null {
        const templateMap = this.$templateMap();
        if (templateMap) return node.type ? templateMap[node.type] : templateMap['default'];
        else return null;
    }

    onDragOver(event: DragEvent) {
        if (this.droppableNodes() && this.allowDrop(<TreeNode>this.dragNode(), null, this.dragNodeScope())) {
            (<any>event).dataTransfer.dropEffect = 'copy';
            event.preventDefault();
        }
    }

    onDrop(event: DragEvent) {
        if (this.droppableNodes()) {
            event.preventDefault();
            let dragNode = this.dragNode() as TreeNode;

            if (this.isSameTreeScope(this.dragNodeScope())) {
                return;
            }

            if (this.allowDrop(dragNode, null, this.dragNodeScope())) {
                let dragNodeIndex = <number>this.dragNodeIndex();
                this.value.set(this.value() || []);

                if (this.validateDrop()) {
                    this.onNodeDrop.emit({
                        originalEvent: event,
                        dragNode: dragNode,
                        dropNode: null,
                        index: dragNodeIndex,
                        accept: () => {
                            this.processTreeDrop(dragNode, dragNodeIndex);
                        }
                    });
                } else {
                    this.onNodeDrop.emit({
                        originalEvent: event,
                        dragNode: dragNode,
                        dropNode: null,
                        index: dragNodeIndex
                    });

                    this.processTreeDrop(dragNode, dragNodeIndex);
                }
            }
        }
    }

    processTreeDrop(dragNode: TreeNode, dragNodeIndex: number) {
        (<TreeNode<any>[]>this.dragNodeSubNodes()).splice(dragNodeIndex, 1);
        (this.value() as TreeNode<any>[]).push(dragNode);
        this.dragDropService?.stopDrag({
            node: dragNode
        });
    }

    onDragEnter() {
        if (this.droppableNodes() && this.allowDrop(<TreeNode>this.dragNode(), null, this.dragNodeScope())) {
            this.dragHover.set(true);
        }
    }

    onDragLeave(event: DragEvent) {
        if (this.droppableNodes()) {
            let rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            if (event.x > parseInt(rect.left as any) + rect.width || event.x < parseInt(rect.left as any) || event.y > parseInt(rect.top as any) + rect.height || event.y < parseInt(rect.top as any)) {
                this.dragHover.set(false);
            }
        }
    }

    allowDrop(dragNode: TreeNode, dropNode: TreeNode<any> | null, dragNodeScope: any): boolean {
        if (!dragNode) {
            //prevent random html elements to be dragged
            return false;
        } else if (this.isValidDragScope(dragNodeScope)) {
            let allow: boolean = true;
            if (dropNode) {
                if (dragNode === dropNode) {
                    allow = false;
                } else {
                    let parent = dropNode.parent;
                    while (parent != null) {
                        if (parent === dragNode) {
                            allow = false;
                            break;
                        }
                        parent = parent.parent;
                    }
                }
            }

            return allow;
        } else {
            return false;
        }
    }

    hasCommonScope(dragScope: any, dropScope: any): boolean {
        if (typeof dropScope === 'string') {
            if (typeof dragScope === 'string') return dropScope === dragScope;
            else if (Array.isArray(dragScope)) return (<Array<any>>dragScope).indexOf(dropScope) != -1;
        } else if (Array.isArray(dropScope)) {
            if (typeof dragScope === 'string') {
                return (<Array<any>>dropScope).indexOf(dragScope) != -1;
            } else if (Array.isArray(dragScope)) {
                for (let s of dropScope) {
                    for (let ds of dragScope) {
                        if (s === ds) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    isSameTreeScope(dragScope: any): boolean {
        return this.hasCommonScope(dragScope, this.draggableScope());
    }

    isValidDragScope(dragScope: any): boolean {
        let dropScope = this.droppableScope();

        if (dropScope) {
            return this.hasCommonScope(dragScope, dropScope);
        } else {
            return true;
        }
    }

    public _filter(value: string) {
        let filterValue = value;
        if (filterValue === '') {
            this.filteredNodes.set(null);
        } else {
            const filteredNodes: TreeNode<any>[] = [];
            const searchFields: string[] = this.filterBy().split(',');
            const filterText = removeAccents(filterValue).toLocaleLowerCase(this.filterLocale());
            const isStrictMode = this.filterMode() === 'strict';
            for (let node of <TreeNode<any>[]>this.value()) {
                let copyNode = { ...node };
                let paramsWithoutNode = { searchFields, filterText, isStrictMode };
                if (
                    (isStrictMode && (this.findFilteredNodes(copyNode, paramsWithoutNode) || this.isFilterMatched(copyNode, paramsWithoutNode))) ||
                    (!isStrictMode && (this.isFilterMatched(copyNode, paramsWithoutNode) || this.findFilteredNodes(copyNode, paramsWithoutNode)))
                ) {
                    filteredNodes.push(copyNode);
                }
            }
            this.filteredNodes.set(filteredNodes);
        }

        this.updateSerializedValue();
        this.onFilter.emit({
            filter: filterValue,
            filteredValue: this.filteredNodes()
        });
    }

    /**
     * Resets filter.
     * @group Method
     */
    public resetFilter() {
        this.filteredNodes.set(null);

        const filterViewChild = this.filterViewChild();
        if (filterViewChild && filterViewChild.nativeElement) {
            filterViewChild.nativeElement.value = '';
        }
    }
    /**
     * Scrolls to virtual index.
     * @param {number} number - Index to be scrolled.
     * @group Method
     */
    public scrollToVirtualIndex(index: number) {
        this.virtualScroll() && this.scroller()?.scrollToIndex(index);
    }
    /**
     * Scrolls to virtual index.
     * @param {ScrollToOptions} options - Scroll options.
     * @group Method
     */
    public scrollTo(options: any) {
        const wrapperViewChild = this.wrapperViewChild();
        if (this.virtualScroll()) {
            this.scroller()?.scrollTo(options);
        } else if (wrapperViewChild && wrapperViewChild.nativeElement) {
            if (wrapperViewChild.nativeElement.scrollTo) {
                wrapperViewChild.nativeElement.scrollTo(options);
            } else {
                wrapperViewChild.nativeElement.scrollLeft = options.left;
                wrapperViewChild.nativeElement.scrollTop = options.top;
            }
        }
    }

    findFilteredNodes(node: TreeNode, paramsWithoutNode: any) {
        if (node) {
            let matched = false;
            if (node.children) {
                let childNodes = [...node.children];
                node.children = [];
                for (let childNode of childNodes) {
                    let copyChildNode = { ...childNode };
                    if (this.isFilterMatched(copyChildNode, paramsWithoutNode)) {
                        matched = true;
                        node.children.push(copyChildNode);
                    }
                }
            }

            if (matched) {
                node.expanded = true;
                return true;
            }
        }
    }

    isFilterMatched(node: TreeNode, params: any) {
        let { searchFields, filterText, isStrictMode } = params;
        let matched = false;
        for (let field of searchFields) {
            let fieldValue = removeAccents(String(resolveFieldData(node, field))).toLocaleLowerCase(this.filterLocale());
            if (fieldValue.indexOf(filterText) > -1) {
                matched = true;
            }
        }

        if (!matched || (isStrictMode && !this.isNodeLeaf(node))) {
            matched = this.findFilteredNodes(node, { searchFields, filterText, isStrictMode }) || matched;
        }

        return matched;
    }

    getIndex(options: any, index: number) {
        const getItemOptions = options['getItemOptions'];
        return getItemOptions ? getItemOptions(index).index : index;
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    onDestroy() {
        const dragStartSubscription = this.dragStartSubscription();
        if (dragStartSubscription) {
            dragStartSubscription.unsubscribe();
        }

        const dragStopSubscription = this.dragStopSubscription();
        if (dragStopSubscription) {
            dragStopSubscription.unsubscribe();
        }
    }

    containerDataP = computed(() =>
        this.cn({
            loading: this.loading(),
            scrollable: this.scrollHeight() === 'flex'
        })
    );

    wrapperDataP = computed(() =>
        this.cn({
            scrollable: this.scrollHeight() === 'flex'
        })
    );
}
@NgModule({
    imports: [Tree, SharedModule],
    exports: [Tree, SharedModule]
})
export class TreeModule {}
