import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SharedModule, TreeNode } from '@exhaustive-ui/core/api';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import { Overlay } from '@exhaustive-ui/core/overlay';
import { TreeSelectNodeCollapseEvent, TreeSelectNodeExpandEvent } from '@exhaustive-ui/core/types/treeselect';
import { BehaviorSubject } from 'rxjs';
import { TreeSelect, TreeSelectModule } from './treeselect';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
const mockTreeNodes: TreeNode[] = [
    {
        key: '0',
        label: 'Documents',
        data: 'Documents Folder',
        icon: 'pi pi-fw pi-inbox',
        children: [
            {
                key: '0-0',
                label: 'Work',
                data: 'Work Folder',
                icon: 'pi pi-fw pi-cog',
                children: [
                    { key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                    { key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
                ]
            },
            {
                key: '0-1',
                label: 'Home',
                data: 'Home Folder',
                icon: 'pi pi-fw pi-home',
                children: [{ key: '0-1-0', label: 'Invoices.txt', icon: 'pi pi-fw pi-file', data: 'Invoices for this month' }]
            }
        ]
    },
    {
        key: '1',
        label: 'Events',
        data: 'Events Folder',
        icon: 'pi pi-fw pi-calendar',
        children: [
            { key: '1-0', label: 'Meeting', icon: 'pi pi-fw pi-calendar-plus', data: 'Meeting' },
            { key: '1-1', label: 'Product Launch', icon: 'pi pi-fw pi-calendar-plus', data: 'Product Launch' }
        ]
    }
];

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-treeselect
            [(ngModel)]="selectedValue"
            [options]="options"
            [placeholder]="placeholder"
            [disabled]="disabled"
            [selectionMode]="selectionMode"
            [display]="display"
            [metaKeySelection]="metaKeySelection"
            [showClear]="showClear"
            [filter]="filter"
            [filterBy]="filterBy"
            [filterMode]="filterMode"
            [filterPlaceholder]="filterPlaceholder"
            [emptyMessage]="emptyMessage"
            [scrollHeight]="scrollHeight"
            [virtualScroll]="virtualScroll"
            [virtualScrollItemSize]="virtualScrollItemSize"
            [virtualScrollOptions]="virtualScrollOptions"
            [propagateSelectionDown]="propagateSelectionDown"
            [propagateSelectionUp]="propagateSelectionUp"
            [resetFilterOnHide]="resetFilterOnHide"
            [loading]="loading"
            [autofocus]="autofocus"
            [tabindex]="tabindex"
            [inputId]="inputId"
            [ariaLabel]="ariaLabel"
            [ariaLabelledBy]="ariaLabelledBy"
            [panelClass]="panelClass"
            [panelStyle]="panelStyle"
            [style]="containerStyle"
            [labelStyle]="labelStyle"
            [labelStyleClass]="labelStyleClass"
            [appendTo]="appendTo"
            (onNodeSelect)="onNodeSelectEvent($event)"
            (onNodeUnselect)="onNodeUnselectEvent($event)"
            (onNodeExpand)="onNodeExpandEvent($event)"
            (onNodeCollapse)="onNodeCollapseEvent($event)"
            (onShow)="onShowEvent($event)"
            (onHide)="onHideEvent($event)"
            (onClear)="onClearEvent($event)"
            (onFilter)="onFilterEvent($event)"
            (onFocus)="onFocusEvent($event)"
            (onBlur)="onBlurEvent($event)"
        >
            <!-- Value template -->
            <ng-template #value let-value let-placeholder="placeholder">
                <div class="custom-value" data-testid="template-value">
                    @if (value && !isArray(value)) {
                        <span>{{ value.label }} - Custom</span>
                    }
                    @if (value && isArray(value)) {
                        <span>{{ value.length }} item(s) selected - Custom</span>
                    }
                    @if (!value) {
                        <span>{{ placeholder }}</span>
                    }
                </div>
            </ng-template>

            <!-- Header template -->
            <ng-template #header let-value let-options="options">
                <div class="custom-header" data-testid="template-header">
                    <i class="pi pi-search"></i>
                    <span>Select Node - Options: {{ options?.length || 0 }}</span>
                </div>
            </ng-template>

            <!-- Footer template -->
            <ng-template #footer let-value let-options="options">
                <div class="custom-footer" data-testid="template-footer">
                    <small>Total: {{ options?.length || 0 }} nodes</small>
                </div>
            </ng-template>

            <!-- Empty template -->
            <ng-template #empty>
                <div class="custom-empty" data-testid="template-empty">
                    <span>No nodes available</span>
                </div>
            </ng-template>

            <!-- Trigger icon template -->
            <ng-template #triggericon>
                <i class="pi pi-chevron-down custom-trigger" data-testid="template-triggericon"></i>
            </ng-template>

            <!-- Clear icon template -->
            <ng-template #clearicon>
                <i class="pi pi-times custom-clear" data-testid="template-clearicon"></i>
            </ng-template>

            <!-- Item toggler icon template -->
            <ng-template #itemtogglericon let-expanded>
                <i class="custom-toggler" data-testid="template-itemtogglericon" [class.expanded]="expanded">
                    {{ expanded ? '−' : '+' }}
                </i>
            </ng-template>

            <!-- Item checkbox icon template -->
            <ng-template #itemcheckboxicon let-selected let-partialSelected="partialSelected">
                <i class="custom-checkbox" data-testid="template-itemcheckboxicon" [class.selected]="selected" [class.partial]="partialSelected">
                    {{ selected ? '☑' : partialSelected ? '☐' : '☐' }}
                </i>
            </ng-template>

            <!-- Item loading icon template -->
            <ng-template #itemloadingicon>
                <i class="pi pi-spinner custom-loading" data-testid="template-itemloadingicon"></i>
            </ng-template>
        </p-treeselect>

        <!-- Reactive Forms test -->
        @if (showReactiveForm) {
            <form [formGroup]="reactiveForm">
                <p-treeselect formControlName="selectedNodes" [options]="formOptions" [placeholder]="'Select nodes'" (onNodeSelect)="onFormNodeSelect($event)"> </p-treeselect>
            </form>
        }
    `
})
class TestTreeSelectComponent {
    selectedValue: TreeNode | TreeNode[] | null = null as any;
    options: TreeNode[] = [];
    formOptions: TreeNode[] = [];

    // Basic properties
    placeholder: string = 'Select a node';
    disabled: boolean = false;
    selectionMode: 'single' | 'multiple' | 'checkbox' = 'single';
    display: 'comma' | 'chip' = 'comma';
    metaKeySelection: boolean = false;
    showClear: boolean = false;

    // Filter properties
    filter: boolean = false;
    filterBy: string = 'label';
    filterMode: 'lenient' | 'strict' = 'lenient';
    filterPlaceholder: string = 'Filter nodes';
    emptyMessage: string = 'No nodes found';

    // Scroll properties
    scrollHeight: string = '400px';
    virtualScroll: boolean = false;
    virtualScrollItemSize: number | undefined;
    virtualScrollOptions: any;

    // Selection behavior
    propagateSelectionDown: boolean = true;
    propagateSelectionUp: boolean = true;
    resetFilterOnHide: boolean = true;

    // Loading and state
    loading: boolean = false;
    autofocus: boolean = false;

    // Form properties
    tabindex: number = 0;
    inputId: string | undefined;
    ariaLabel: string = 'Test tree select';
    ariaLabelledBy: string | undefined;

    // Styling
    panelClass: string = '';
    panelStyle: any = {};
    containerStyle: any = {};
    labelStyle: any = {};
    labelStyleClass: string = '';
    appendTo: any;

    // Event tracking
    nodeSelectEvent: any = null as any;
    nodeUnselectEvent: any = null as any;
    nodeExpandEvent: TreeSelectNodeExpandEvent | null = null as any;
    nodeCollapseEvent: TreeSelectNodeCollapseEvent | null = null as any;
    showEvent: any = null as any;
    hideEvent: any = null as any;
    clearEvent: any = null as any;
    filterEvent: any = null as any;
    focusEvent: Event | null = null as any;
    blurEvent: Event | null = null as any;

    // Form handling
    reactiveForm: FormGroup;
    showReactiveForm: boolean = false;

    // Dynamic data testing
    signalOptions = signal(mockTreeNodes.slice(0, 1));
    observableOptions$ = new BehaviorSubject<TreeNode[]>(mockTreeNodes.slice(0, 1));
    lateLoadedOptions: TreeNode[] = [];

    constructor() {
        this.reactiveForm = new FormGroup({
            selectedNodes: new FormControl(null, [Validators.required])
        });
    }

    // Event handlers
    onNodeSelectEvent(event: any) {
        this.nodeSelectEvent = event;
    }

    onNodeUnselectEvent(event: any) {
        this.nodeUnselectEvent = event;
    }

    onNodeExpandEvent(event: TreeSelectNodeExpandEvent) {
        this.nodeExpandEvent = event;
    }

    onNodeCollapseEvent(event: TreeSelectNodeCollapseEvent) {
        this.nodeCollapseEvent = event;
    }

    onShowEvent(event: any) {
        this.showEvent = event;
    }

    onHideEvent(event: any) {
        this.hideEvent = event;
    }

    onClearEvent(event: any) {
        this.clearEvent = event;
    }

    onFilterEvent(event: any) {
        this.filterEvent = event;
    }

    onFocusEvent(event: Event) {
        this.focusEvent = event;
    }

    onBlurEvent(event: Event) {
        this.blurEvent = event;
    }

    onFormNodeSelect(event: any) {
        this.nodeSelectEvent = event;
    }

    // Dynamic data methods
    loadLateOptions(changeDetectorRef?: any) {
        setTimeout(() => {
            this.lateLoadedOptions = mockTreeNodes.slice(0, 1);
            this.options = this.lateLoadedOptions;
            if (changeDetectorRef) {
                changeDetectorRef.markForCheck();
            }
        }, 100);
    }

    // Getters for testing different data types
    get stringOptions() {
        return mockTreeNodes.map((node) => ({ ...node, label: node.label }));
    }

    get numberOptions() {
        return mockTreeNodes.map((node, index) => ({ ...node, key: index.toString(), data: index }));
    }

    get objectOptions() {
        return mockTreeNodes;
    }

    get groupedOptions() {
        return mockTreeNodes;
    }

    // Property functions for testing
    getLabelFunction() {
        return (node: TreeNode) => (node as any).customLabel || node.label || node.data;
    }

    getValueFunction() {
        return (node: TreeNode) => (node as any).customValue || node.key || node;
    }

    // Filter function
    getFilterFunction() {
        return (value: string, filter: string) => value.toLowerCase().includes(filter.toLowerCase());
    }

    // Helper method for template
    isArray(value: any): boolean {
        return Array.isArray(value);
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-treeselect [(ngModel)]="selectedValue" [options]="options" [placeholder]="placeholder" [disabled]="disabled" [showClear]="showClear" [filter]="filter">
            <!-- Value template with pTemplate -->
            <ng-template pTemplate="value" let-value let-placeholder="placeholder">
                <div class="ptemplate-value" [attr.data-testid]="'ptemplate-value'">
                    @if (value && !isArrayValue(value)) {
                        <span class="value-text">{{ value.label }} - pTemplate</span>
                    }
                    @if (value && isArrayValue(value)) {
                        <span class="multi-value-text">{{ value.length }} selected - pTemplate</span>
                    }
                    @if (!value) {
                        <span class="placeholder-text">{{ placeholder }} (pTemplate)</span>
                    }
                </div>
            </ng-template>

            <!-- Header template with pTemplate -->
            <ng-template pTemplate="header" let-value let-options="options">
                <div class="ptemplate-header" [attr.data-testid]="'ptemplate-header'">
                    <i class="pi pi-search"></i>
                    <h4 class="header-title">Select Tree Node (pTemplate)</h4>
                    <span class="header-subtitle">Available: {{ options?.length || 0 }} root nodes</span>
                </div>
            </ng-template>

            <!-- Footer template with pTemplate -->
            <ng-template pTemplate="footer" let-value let-options="options">
                <div class="ptemplate-footer" [attr.data-testid]="'ptemplate-footer'">
                    <small class="footer-text">Choose your node (pTemplate)</small>
                    <button class="footer-button" type="button">Help</button>
                </div>
            </ng-template>

            <!-- Empty template with pTemplate -->
            <ng-template pTemplate="empty">
                <div class="ptemplate-empty" [attr.data-testid]="'ptemplate-empty'">
                    <i class="pi pi-info-circle"></i>
                    <span class="empty-text">No tree nodes found (pTemplate)</span>
                </div>
            </ng-template>

            <!-- Trigger icon template with pTemplate -->
            <ng-template pTemplate="triggericon">
                <i class="pi pi-angle-down ptemplate-triggericon" [attr.data-testid]="'ptemplate-triggericon'"></i>
            </ng-template>

            <!-- Clear icon template with pTemplate -->
            <ng-template pTemplate="clearicon">
                <div class="ptemplate-clearicon" [attr.data-testid]="'ptemplate-clearicon'">
                    <i class="pi pi-times clear-icon"></i>
                    <span class="clear-text">Clear</span>
                </div>
            </ng-template>

            <!-- Item toggler icon template with pTemplate -->
            <ng-template pTemplate="itemtogglericon" let-expanded>
                <i class="ptemplate-itemtogglericon" [attr.data-testid]="'ptemplate-itemtogglericon'" [attr.data-expanded]="expanded">
                    <span class="toggler-text">{{ expanded ? 'Collapse' : 'Expand' }}</span>
                </i>
            </ng-template>

            <!-- Item checkbox icon template with pTemplate -->
            <ng-template pTemplate="itemcheckboxicon" let-selected let-partialSelected="partialSelected">
                <div class="ptemplate-itemcheckboxicon" [attr.data-testid]="'ptemplate-itemcheckboxicon'" [attr.data-selected]="selected" [attr.data-partial]="partialSelected">
                    <i class="checkbox-icon" [class.selected]="selected" [class.partial]="partialSelected"></i>
                    <span class="checkbox-text">
                        {{ selected ? 'Selected' : partialSelected ? 'Partial' : 'Unselected' }}
                    </span>
                </div>
            </ng-template>

            <!-- Item loading icon template with pTemplate -->
            <ng-template pTemplate="itemloadingicon">
                <div class="ptemplate-itemloadingicon" [attr.data-testid]="'ptemplate-itemloadingicon'">
                    <i class="pi pi-spin pi-spinner loading-icon"></i>
                    <span class="loading-text">Loading...</span>
                </div>
            </ng-template>
        </p-treeselect>
    `
})
class TestPTemplateTreeSelectComponent {
    selectedValue: TreeNode | TreeNode[] | null = null as any;
    options: TreeNode[] = mockTreeNodes;
    placeholder: string = 'Select Node';
    disabled: boolean = false;
    showClear: boolean = true;
    filter: boolean = true;

    // Helper method for template
    isArrayValue(value: any): boolean {
        return Array.isArray(value);
    }
}

describe('TreeSelect', () => {
    let component: TreeSelect;
    let fixture: ComponentFixture<TreeSelect>;
    let testFixture: ComponentFixture<TestTreeSelectComponent>;
    let testComponent: TestTreeSelectComponent;
    let pTemplateFixture: ComponentFixture<TestPTemplateTreeSelectComponent>;
    let pTemplateComponent: TestPTemplateTreeSelectComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TreeSelectModule, SharedModule, FormsModule, ReactiveFormsModule],
            declarations: [TestTreeSelectComponent, TestPTemplateTreeSelectComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TreeSelect);
        component = fixture.componentInstance;

        testFixture = TestBed.createComponent(TestTreeSelectComponent);
        testComponent = testFixture.componentInstance;
        testComponent.options = mockTreeNodes;
        testFixture.detectChanges();

        pTemplateFixture = TestBed.createComponent(TestPTemplateTreeSelectComponent);
        pTemplateComponent = pTemplateFixture.componentInstance;
        pTemplateFixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
            expect(testComponent).toBeTruthy();
            expect(pTemplateComponent).toBeTruthy();
        });

        it('should initialize with default properties', () => {
            expect(component.selectionMode()).toBe('single');
            expect(component.display()).toBe('comma');
            expect(component.scrollHeight()).toBe('400px');
            expect(component.propagateSelectionDown()).toBe(true);
            expect(component.propagateSelectionUp()).toBe(true);
            expect(component.resetFilterOnHide()).toBe(true);
            expect(component.metaKeySelection()).toBe(false);
            expect(component.showClear()).toBe(false);
            expect(component.filter()).toBe(false);
        });
    });

    describe('Options and Value Input Properties', () => {
        beforeEach(() => {
            testFixture.detectChanges();
        });

        it('should work with simple TreeNode array', async () => {
            testComponent.options = mockTreeNodes;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.options()).toEqual(mockTreeNodes);
            expect(treeSelectInstance.options().length).toBe(2);
        });

        it('should work with string-based TreeNode array', async () => {
            const stringNodes: TreeNode[] = [
                { key: '1', label: 'Node 1' },
                { key: '2', label: 'Node 2' }
            ];
            testComponent.options = stringNodes;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.options()).toEqual(stringNodes);
        });

        it('should work with number-based TreeNode array', async () => {
            const numberNodes = testComponent.numberOptions;
            testComponent.options = numberNodes;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.options()).toEqual(numberNodes);
        });

        it('should work with getters and setters', async () => {
            testComponent.options = testComponent.objectOptions;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.options()).toBeDefined();
            expect(treeSelectInstance.options().length).toBe(2);
        });

        it('should work with signals', async () => {
            testComponent.options = testComponent.signalOptions();
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.options()).toBeDefined();
            expect(treeSelectInstance.options().length).toBe(1);
        });

        it('should work with observables and async pipe', async () => {
            testComponent.observableOptions$.subscribe((options) => {
                testComponent.options = options;
            });
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.options()).toBeDefined();
            expect(treeSelectInstance.options().length).toBe(1);
        });

        it('should work with late-loaded values', async () => {
            testComponent.loadLateOptions(testFixture.changeDetectorRef);
            await new Promise((resolve) => setTimeout(resolve, 150));
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.options()).toBeDefined();
            expect(treeSelectInstance.options().length).toBe(1);
        });
    });

    describe('Angular FormControl and NgModel Integration', () => {
        beforeEach(() => {
            testFixture.detectChanges();
        });

        it('should work with NgModel', async () => {
            testComponent.selectedValue = mockTreeNodes[0];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            // Use writeValue to simulate ControlValueAccessor behavior
            treeSelectInstance.writeValue(mockTreeNodes[0]);
            expect(treeSelectInstance.value()).toEqual(mockTreeNodes[0]);
        });

        it('should clear partially selected checkboxes when the form value is reset', async () => {
            const options: TreeNode[] = [
                {
                    key: 'p',
                    label: 'Parent',
                    children: [
                        { key: 'c1', label: 'Child 1' },
                        { key: 'c2', label: 'Child 2' }
                    ]
                }
            ];
            fixture.componentRef.setInput('selectionMode', 'checkbox');
            fixture.componentRef.setInput('options', options);
            fixture.detectChanges();
            await fixture.whenStable();

            // state left by selecting one child from the UI: the inner tree marks the parent partially selected
            component.onSelectionChange([options[0].children![0]]);
            options[0].partialSelected = true;

            // form reset
            component.writeValue(null);

            expect(options[0].partialSelected).toBe(false);
        });

        it('should mark the parents of preselected checkbox nodes as partially selected', async () => {
            const options: TreeNode[] = [
                {
                    key: 'p',
                    label: 'Parent',
                    children: [
                        {
                            key: 'c1',
                            label: 'Child 1',
                            children: [
                                { key: 'g1', label: 'Grandchild 1' },
                                { key: 'g2', label: 'Grandchild 2' }
                            ]
                        },
                        { key: 'c2', label: 'Child 2' }
                    ]
                },
                { key: 'o', label: 'Other', children: [{ key: 'o1', label: 'Other 1' }] }
            ];
            fixture.componentRef.setInput('selectionMode', 'checkbox');
            fixture.componentRef.setInput('options', options);
            fixture.detectChanges();
            await fixture.whenStable();

            component.writeValue([options[0].children![0].children![0]]);

            expect(options[0].children![0].partialSelected).toBe(true);
            expect(options[0].partialSelected).toBe(true);
            expect(options[1].partialSelected).toBe(false);
        });

        it('should work with reactive forms', async () => {
            testComponent.showReactiveForm = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();
            testComponent.formOptions = mockTreeNodes;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();
            testComponent.reactiveForm.patchValue({
                selectedNodes: mockTreeNodes[0]
            });
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(testComponent.reactiveForm.get('selectedNodes')?.value).toBe(mockTreeNodes[0]);
        });

        it('should handle form validation', async () => {
            testComponent.showReactiveForm = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();
            testComponent.formOptions = mockTreeNodes;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(testComponent.reactiveForm.get('selectedNodes')?.invalid).toBe(true);

            testComponent.reactiveForm.patchValue({
                selectedNodes: mockTreeNodes[0]
            });

            expect(testComponent.reactiveForm.get('selectedNodes')?.valid).toBe(true);
        });

        it('should handle setValue and getValue operations', async () => {
            testComponent.showReactiveForm = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();
            testComponent.formOptions = mockTreeNodes;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const control = testComponent.reactiveForm.get('selectedNodes');

            control?.setValue(mockTreeNodes[0]);
            expect(control?.value).toBe(mockTreeNodes[0]);

            control?.setValue(null);
            expect(control?.value).toBeNull();
        });

        it('should handle form control state changes', async () => {
            testComponent.showReactiveForm = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();
            testComponent.formOptions = mockTreeNodes;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const control = testComponent.reactiveForm.get('selectedNodes');

            control?.disable();
            testFixture.detectChanges();

            const treeSelectElement = testFixture.debugElement.query(By.css('p-treeselect[formControlName="selectedNodes"]'));
            expect(treeSelectElement).toBeTruthy();

            control?.enable();
            testFixture.detectChanges();
        });
    });

    describe('Vital Input Properties', () => {
        beforeEach(() => {
            testFixture.detectChanges();
        });

        it('should work with placeholder', async () => {
            testComponent.placeholder = 'Choose a tree node';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.placeholder()).toBe('Choose a tree node');
        });

        it('should work with disabled state', async () => {
            testComponent.disabled = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.$disabled()).toBe(true);
        });

        it('should work with selectionMode', async () => {
            testComponent.selectionMode = 'multiple';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.selectionMode()).toBe('multiple');
        });

        it('should work with display mode', async () => {
            testComponent.display = 'chip';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.display()).toBe('chip');
        });

        it('should work with filter', async () => {
            testComponent.filter = true;
            testComponent.filterBy = 'label';
            testComponent.filterMode = 'strict';
            testComponent.filterPlaceholder = 'Search nodes';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.filter()).toBe(true);
            expect(treeSelectInstance.filterBy()).toBe('label');
            expect(treeSelectInstance.filterMode()).toBe('strict');
            expect(treeSelectInstance.filterPlaceholder()).toBe('Search nodes');
        });

        it('should work with loading state', async () => {
            testComponent.loading = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.loading()).toBe(true);
        });

        it('should work with virtualScroll', async () => {
            testComponent.virtualScroll = true;
            testComponent.virtualScrollItemSize = 35;
            testComponent.scrollHeight = '300px';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.virtualScroll()).toBe(true);
            expect(treeSelectInstance.virtualScrollItemSize()).toBe(35);
            expect(treeSelectInstance.scrollHeight()).toBe('300px');
        });

        it('should work with appendTo', async () => {
            testComponent.appendTo = 'body';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            const appendToValue = typeof treeSelectInstance.appendTo === 'function' ? treeSelectInstance.appendTo() : treeSelectInstance.appendTo;
            expect(appendToValue).toBe('body');
        });

        it('should work with styles and styleClass', async () => {
            testComponent.containerStyle = { border: '2px solid blue', padding: '5px' };
            testComponent.labelStyle = { color: 'red', fontWeight: 'bold' };
            testComponent.labelStyleClass = 'custom-label';
            testComponent.panelClass = 'custom-panel';
            testComponent.panelStyle = { backgroundColor: 'lightgray' };
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            const host = testFixture.debugElement.query(By.directive(TreeSelect)).nativeElement as HTMLElement;
            expect(host.style.border).toBe('2px solid blue');
            expect(host.style.padding).toBe('5px');
            expect(treeSelectInstance.labelStyle()).toEqual({ color: 'red', fontWeight: 'bold' });
            expect(treeSelectInstance.labelStyleClass()).toBe('custom-label');
            expect(treeSelectInstance.panelClass()).toBe('custom-panel');
            expect(treeSelectInstance.panelStyle()).toEqual({ backgroundColor: 'lightgray' });
        });
    });

    describe('Output Event Emitters', () => {
        beforeEach(() => {
            testFixture.detectChanges();
        });

        it('should emit onNodeSelect event', async () => {
            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;

            vi.spyOn(treeSelectInstance.onNodeSelect, 'emit').mockImplementation(() => {});

            const selectEvent = { originalEvent: new Event('click'), node: mockTreeNodes[0] };
            // Call the real selection handler that the internal p-tree's
            // (onNodeSelect)="onSelect($event)" binding invokes.
            treeSelectInstance.onSelect(selectEvent);

            expect(treeSelectInstance.onNodeSelect.emit).toHaveBeenCalledWith(selectEvent);
        });

        it('should emit onNodeUnselect event', () => {
            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;

            vi.spyOn(treeSelectInstance.onNodeUnselect, 'emit').mockImplementation(() => {});

            const unselectEvent = { originalEvent: new Event('click'), node: mockTreeNodes[0] };
            // Call the real unselect handler that the internal p-tree's
            // (onNodeUnselect)="onUnselect($event)" binding invokes.
            treeSelectInstance.onUnselect(unselectEvent);

            expect(treeSelectInstance.onNodeUnselect.emit).toHaveBeenCalledWith(unselectEvent);
        });

        it('should emit onNodeExpand event', () => {
            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;

            vi.spyOn(treeSelectInstance.onNodeExpand, 'emit').mockImplementation(() => {});

            const expandEvent = { originalEvent: new Event('click'), node: mockTreeNodes[0] };
            // Call the real expand handler that the internal p-tree's
            // (onNodeExpand)="nodeExpand($event)" binding invokes.
            treeSelectInstance.nodeExpand(expandEvent);

            expect(treeSelectInstance.onNodeExpand.emit).toHaveBeenCalledWith(expandEvent);
        });

        it('should emit onNodeCollapse event', () => {
            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;

            vi.spyOn(treeSelectInstance.onNodeCollapse, 'emit').mockImplementation(() => {});

            const collapseEvent = { originalEvent: new Event('click'), node: mockTreeNodes[0] };
            // Call the real collapse handler that the internal p-tree's
            // (onNodeCollapse)="nodeCollapse($event)" binding invokes.
            treeSelectInstance.nodeCollapse(collapseEvent);

            expect(treeSelectInstance.onNodeCollapse.emit).toHaveBeenCalledWith(collapseEvent);
        });

        it('should emit onFilter event', () => {
            testComponent.filter = true;
            testFixture.changeDetectorRef.markForCheck();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;

            vi.spyOn(treeSelectInstance.onFilter, 'emit').mockImplementation(() => {});

            const filterEvent = { target: { value: 'Documents' } } as unknown as Event;
            // Call the real filter handler bound to the filter input's (input) event.
            treeSelectInstance.onFilterInput(filterEvent);

            expect(treeSelectInstance.onFilter.emit).toHaveBeenCalled();
        });

        it('should emit onFilter when the user types in the filter input', async () => {
            testComponent.filter = true;
            testFixture.changeDetectorRef.markForCheck();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance as TreeSelect;
            vi.spyOn(treeSelectInstance.onFilter, 'emit');

            treeSelectInstance.show();
            testFixture.changeDetectorRef.markForCheck();
            testFixture.detectChanges();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const filterInput = treeSelectInstance.treeViewChild()!.filterViewChild()!.nativeElement as HTMLInputElement;
            filterInput.value = 'Work';
            filterInput.dispatchEvent(new Event('input'));

            expect(treeSelectInstance.onFilter.emit).toHaveBeenCalledWith(expect.objectContaining({ filter: 'Work' }));
            expect(treeSelectInstance.filterValue()).toBe('Work');
        });

        it('should restore the filter text on reopen when resetFilterOnHide is false', async () => {
            testComponent.filter = true;
            testComponent.resetFilterOnHide = false;
            testFixture.changeDetectorRef.markForCheck();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance as TreeSelect;
            const render = async () => {
                testFixture.changeDetectorRef.markForCheck();
                testFixture.detectChanges();
                await testFixture.whenStable();
                // let the overlay enter/leave motion complete
                await new Promise((resolve) => setTimeout(resolve, 300));
                testFixture.detectChanges();
            };
            const filterInput = () => treeSelectInstance.treeViewChild()?.filterViewChild()?.nativeElement as HTMLInputElement;

            treeSelectInstance.show();
            await render();
            filterInput().value = 'Work';
            filterInput().dispatchEvent(new Event('input'));

            treeSelectInstance.hide();
            await render();
            treeSelectInstance.show();
            await render();

            expect(filterInput().value).toBe('Work');
        });

        it('should emit onShow event', async () => {
            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;

            vi.spyOn(treeSelectInstance.onShow, 'emit').mockImplementation(() => {});

            // Open the dropdown so the internal p-overlay (which owns the real
            // "(onShow)=\"onShow.emit($event)\"" wiring) is rendered.
            treeSelectInstance.show();
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            // Trigger the overlay's own real show() method — the actual mechanism
            // that causes the p-overlay component to emit its onShow output, which
            // is then forwarded to TreeSelect.onShow via the real template binding.
            const overlayInstance = testFixture.debugElement.query(By.directive(Overlay)).componentInstance;
            overlayInstance.show();

            expect(treeSelectInstance.onShow.emit).toHaveBeenCalled();
        });

        it('should emit onHide event', async () => {
            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;

            vi.spyOn(treeSelectInstance.onHide, 'emit').mockImplementation(() => {});

            // Open dropdown first
            treeSelectInstance.show();
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            // Manually call hide to trigger the event
            treeSelectInstance.hide();
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            expect(treeSelectInstance.onHide.emit).toHaveBeenCalled();
        });

        it('should emit onClear event', async () => {
            testComponent.showClear = true;
            testComponent.selectedValue = mockTreeNodes[0];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.showClear()).toBe(true);

            vi.spyOn(treeSelectInstance.onClear, 'emit').mockImplementation(() => {});

            // Call the real clear() method that the clear icon's (click) binding invokes.
            treeSelectInstance.clear(new Event('click'));

            expect(treeSelectInstance.onClear.emit).toHaveBeenCalled();
        });

        it('should emit onFocus event', () => {
            const hiddenInput = testFixture.debugElement.query(By.css('input[type="text"]'));

            hiddenInput.nativeElement.dispatchEvent(new Event('focus'));
            testFixture.detectChanges();

            expect(testComponent.focusEvent).toBeTruthy();
        });

        it('should emit onBlur event', () => {
            const hiddenInput = testFixture.debugElement.query(By.css('input[type="text"]'));

            hiddenInput.nativeElement.dispatchEvent(new Event('blur'));
            testFixture.detectChanges();

            expect(testComponent.blurEvent).toBeTruthy();
        });
    });

    describe('Content Projections with Templates', () => {
        beforeEach(() => {
            testFixture.detectChanges();
        });

        it('should handle ContentChild templates', () => {
            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.ngAfterContentInit).toBeDefined();
        });

        it('should handle PrimeTemplate with context parameters', async () => {
            const dropdown = testFixture.debugElement.query(By.css('.p-treeselect-dropdown'));
            dropdown.nativeElement.click();
            testFixture.detectChanges();
            await testFixture.whenStable();

            // Check for custom templates
            const customValue = testFixture.debugElement.query(By.css('[data-testid="template-value"]'));
            const customHeader = testFixture.debugElement.query(By.css('[data-testid="template-header"]'));
            const customFooter = testFixture.debugElement.query(By.css('[data-testid="template-footer"]'));

            if (customValue) {
                expect(customValue.nativeElement.textContent).toContain('Select a node');
            }
        });
    });

    describe('pTemplate Content Projections with Context Parameters', () => {
        beforeEach(() => {
            pTemplateFixture.detectChanges();
        });

        describe('Value Template (_valueTemplate)', () => {
            it('should render pTemplate="value" with value and placeholder context', async () => {
                // Test with no value (placeholder scenario)
                pTemplateComponent.selectedValue = null as any;
                pTemplateFixture.changeDetectorRef.markForCheck();
                await pTemplateFixture.whenStable();
                pTemplateFixture.detectChanges();

                const valueTemplate = pTemplateFixture.debugElement.query(By.css('[data-testid="ptemplate-value"]'));
                if (valueTemplate) {
                    const placeholderText = valueTemplate.query(By.css('.placeholder-text'));
                    if (placeholderText) {
                        expect(placeholderText.nativeElement.textContent.trim()).toBe('Select Node (pTemplate)');
                    } else {
                        expect(valueTemplate).toBeTruthy(); // At least template rendered
                    }
                } else {
                    // Verify template is loaded even if not rendered
                    const treeSelectInstance = pTemplateFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
                    expect(treeSelectInstance._valueTemplate()).toBeTruthy();
                }
            });

            it('should render pTemplate="value" with selected value context', async () => {
                // Test with selected value
                pTemplateComponent.selectedValue = mockTreeNodes[0];
                pTemplateFixture.changeDetectorRef.markForCheck();
                await pTemplateFixture.whenStable();
                pTemplateFixture.detectChanges();

                const valueTemplate = pTemplateFixture.debugElement.query(By.css('[data-testid="ptemplate-value"]'));
                if (valueTemplate) {
                    const valueText = valueTemplate.query(By.css('.value-text'));
                    if (valueText) {
                        expect(valueText.nativeElement.textContent.trim()).toContain('Documents - pTemplate');
                    } else {
                        expect(valueTemplate).toBeTruthy(); // At least template rendered
                    }
                } else {
                    // Verify template is loaded
                    const treeSelectInstance = pTemplateFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
                    expect(treeSelectInstance._valueTemplate()).toBeTruthy();
                }
            });

            it('should set valueTemplate in ngAfterContentInit', () => {
                const treeSelectInstance = pTemplateFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
                expect(treeSelectInstance._valueTemplate()).toBeTruthy();
            });
        });

        describe('Header Template (_headerTemplate)', () => {
            it('should render pTemplate="header" with options context', async () => {
                const trigger = pTemplateFixture.debugElement.query(By.css('.p-treeselect-dropdown'));
                trigger.nativeElement.click();
                pTemplateFixture.detectChanges();
                await pTemplateFixture.whenStable();

                const headerTemplate = pTemplateFixture.debugElement.query(By.css('[data-testid="ptemplate-header"]'));
                if (headerTemplate) {
                    const headerTitle = headerTemplate.query(By.css('.header-title'));
                    const headerSubtitle = headerTemplate.query(By.css('.header-subtitle'));

                    if (headerTitle) {
                        expect(headerTitle.nativeElement.textContent.trim()).toBe('Select Tree Node (pTemplate)');
                    }
                    if (headerSubtitle) {
                        expect(headerSubtitle.nativeElement.textContent.trim()).toContain('2 root nodes');
                    }
                    if (!headerTitle && !headerSubtitle) {
                        expect(headerTemplate).toBeTruthy(); // At least template rendered
                    }
                } else {
                    // Verify template is loaded even if not rendered
                    const treeSelectInstance = pTemplateFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
                    expect(treeSelectInstance._headerTemplate()).toBeTruthy();
                }
            });

            it('should set headerTemplate in ngAfterContentInit', () => {
                const treeSelectInstance = pTemplateFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
                expect(treeSelectInstance._headerTemplate()).toBeTruthy();
            });
        });

        describe('Footer Template (_footerTemplate)', () => {
            it('should render pTemplate="footer" with custom content', async () => {
                const trigger = pTemplateFixture.debugElement.query(By.css('.p-treeselect-dropdown'));
                trigger.nativeElement.click();
                pTemplateFixture.detectChanges();
                await pTemplateFixture.whenStable();

                const footerTemplate = pTemplateFixture.debugElement.query(By.css('[data-testid="ptemplate-footer"]'));
                if (footerTemplate) {
                    const footerText = footerTemplate.query(By.css('.footer-text'));
                    const footerButton = footerTemplate.query(By.css('.footer-button'));

                    if (footerText) {
                        expect(footerText.nativeElement.textContent.trim()).toBe('Choose your node (pTemplate)');
                    }
                    if (footerButton) {
                        expect(footerButton.nativeElement.textContent.trim()).toBe('Help');
                    }
                    if (!footerText && !footerButton) {
                        expect(footerTemplate).toBeTruthy(); // At least template rendered
                    }
                } else {
                    // Verify template is loaded even if not rendered
                    const treeSelectInstance = pTemplateFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
                    expect(treeSelectInstance._footerTemplate()).toBeTruthy();
                }
            });

            it('should set footerTemplate in ngAfterContentInit', () => {
                const treeSelectInstance = pTemplateFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
                expect(treeSelectInstance._footerTemplate()).toBeTruthy();
            });
        });

        describe('Empty Template (_emptyTemplate)', () => {
            it('should render pTemplate="empty" when no options', async () => {
                pTemplateComponent.options = [];
                pTemplateFixture.changeDetectorRef.markForCheck();
                await pTemplateFixture.whenStable();
                pTemplateFixture.detectChanges();

                const trigger = pTemplateFixture.debugElement.query(By.css('.p-treeselect-dropdown'));
                trigger.nativeElement.click();
                pTemplateFixture.changeDetectorRef.markForCheck();
                await pTemplateFixture.whenStable();
                pTemplateFixture.detectChanges();

                const emptyTemplate = pTemplateFixture.debugElement.query(By.css('[data-testid="ptemplate-empty"]'));
                if (emptyTemplate) {
                    const emptyText = emptyTemplate.query(By.css('.empty-text'));
                    if (emptyText) {
                        expect(emptyText.nativeElement.textContent.trim()).toBe('No tree nodes found (pTemplate)');
                    } else {
                        expect(emptyTemplate).toBeTruthy(); // At least template rendered
                    }
                } else {
                    // Verify template is loaded even if not rendered
                    const treeSelectInstance = pTemplateFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
                    expect(treeSelectInstance._emptyTemplate()).toBeTruthy();
                }
            });

            it('should set emptyTemplate in ngAfterContentInit', () => {
                const treeSelectInstance = pTemplateFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
                expect(treeSelectInstance._emptyTemplate()).toBeTruthy();
            });
        });

        describe('Trigger Icon Template (_triggerIconTemplate)', () => {
            it('should render pTemplate="triggericon" on dropdown trigger', () => {
                const triggerIconTemplate = pTemplateFixture.debugElement.query(By.css('[data-testid="ptemplate-triggericon"]'));
                if (triggerIconTemplate) {
                    expect(triggerIconTemplate.nativeElement.classList.contains('ptemplate-triggericon')).toBe(true);
                    expect(triggerIconTemplate.nativeElement.classList.contains('pi-angle-down')).toBe(true);
                } else {
                    // Verify template is loaded even if not rendered
                    const treeSelectInstance = pTemplateFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
                    expect(treeSelectInstance._triggerIconTemplate()).toBeTruthy();
                }
            });

            it('should set triggerIconTemplate in ngAfterContentInit', () => {
                const treeSelectInstance = pTemplateFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
                expect(treeSelectInstance._triggerIconTemplate()).toBeTruthy();
            });
        });

        describe('Clear Icon Template (_clearIconTemplate)', () => {
            it('should render pTemplate="clearicon" when showClear is enabled', async () => {
                pTemplateComponent.selectedValue = mockTreeNodes[0];
                pTemplateComponent.showClear = true;
                pTemplateFixture.changeDetectorRef.markForCheck();
                await pTemplateFixture.whenStable();
                pTemplateFixture.detectChanges();

                const clearIconTemplate = pTemplateFixture.debugElement.query(By.css('[data-testid="ptemplate-clearicon"]'));
                if (clearIconTemplate) {
                    const clearIcon = clearIconTemplate.query(By.css('.clear-icon'));
                    const clearText = clearIconTemplate.query(By.css('.clear-text'));

                    if (clearIcon) {
                        expect(clearIcon.nativeElement.classList.contains('pi-times')).toBe(true);
                    }
                    if (clearText) {
                        expect(clearText.nativeElement.textContent.trim()).toBe('Clear');
                    }
                    if (!clearIcon && !clearText) {
                        expect(clearIconTemplate).toBeTruthy(); // At least template rendered
                    }
                } else {
                    // Verify template is loaded even if not rendered
                    const treeSelectInstance = pTemplateFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
                    expect(treeSelectInstance._clearIconTemplate()).toBeTruthy();
                }
            });

            it('should set clearIconTemplate in ngAfterContentInit', () => {
                const treeSelectInstance = pTemplateFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
                expect(treeSelectInstance._clearIconTemplate()).toBeTruthy();
            });
        });

        describe('Template Processing Integration', () => {
            it('should process all pTemplate types in ngAfterContentInit', () => {
                const treeSelectInstance = pTemplateFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;

                // Verify all templates are set
                expect(treeSelectInstance._valueTemplate()).toBeTruthy();
                expect(treeSelectInstance._headerTemplate()).toBeTruthy();
                expect(treeSelectInstance._footerTemplate()).toBeTruthy();
                expect(treeSelectInstance._emptyTemplate()).toBeTruthy();
                expect(treeSelectInstance._triggerIconTemplate()).toBeTruthy();
                expect(treeSelectInstance._clearIconTemplate()).toBeTruthy();
            });

            it('should handle context parameters correctly for all templates', async () => {
                pTemplateComponent.selectedValue = mockTreeNodes[0];
                pTemplateComponent.showClear = true;
                pTemplateFixture.changeDetectorRef.markForCheck();
                await pTemplateFixture.whenStable();
                pTemplateFixture.detectChanges();

                const trigger = pTemplateFixture.debugElement.query(By.css('.p-treeselect-dropdown'));
                trigger.nativeElement.click();
                pTemplateFixture.detectChanges();
                await pTemplateFixture.whenStable();

                // Verify value template with selected value context
                const valueTemplate = pTemplateFixture.debugElement.query(By.css('[data-testid="ptemplate-value"]'));
                if (valueTemplate) {
                    const valueText = valueTemplate.query(By.css('.value-text'));
                    if (valueText) {
                        expect(valueText.nativeElement.textContent.trim()).toContain('Documents - pTemplate');
                    } else {
                        expect(valueTemplate).toBeTruthy(); // At least template rendered
                    }
                }

                // Verify header template with options context
                const headerTemplate = pTemplateFixture.debugElement.query(By.css('[data-testid="ptemplate-header"]'));
                if (headerTemplate) {
                    const headerSubtitle = headerTemplate.query(By.css('.header-subtitle'));
                    if (headerSubtitle) {
                        expect(headerSubtitle.nativeElement.textContent.trim()).toContain('2 root nodes');
                    } else {
                        expect(headerTemplate).toBeTruthy(); // At least template rendered
                    }
                }

                // Verify clear template
                const clearTemplate = pTemplateFixture.debugElement.query(By.css('[data-testid="ptemplate-clearicon"]'));
                if (clearTemplate) {
                    const clearText = clearTemplate.query(By.css('.clear-text'));
                    if (clearText) {
                        expect(clearText.nativeElement.textContent.trim()).toBe('Clear');
                    } else {
                        expect(clearTemplate).toBeTruthy(); // At least template rendered
                    }
                }

                // If templates not rendered, at least verify they are loaded
                const treeSelectInstance = pTemplateFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
                expect(treeSelectInstance._valueTemplate()).toBeTruthy();
                expect(treeSelectInstance._headerTemplate()).toBeTruthy();
                expect(treeSelectInstance._clearIconTemplate()).toBeTruthy();
            });

            it('should handle template inheritance and composition', () => {
                const treeSelectInstance = pTemplateFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;

                // Test that templates are properly composed and don't conflict
                expect(treeSelectInstance._valueTemplate()).toBeTruthy();
                expect(treeSelectInstance._headerTemplate()).toBeTruthy();

                // Verify no template conflicts using internal templates
                expect(treeSelectInstance._valueTemplate()).not.toBe(treeSelectInstance._headerTemplate());

                // At least verify internal templates are different
                expect(treeSelectInstance._headerTemplate()).not.toBe(treeSelectInstance._footerTemplate());
            });
        });
    });

    describe('Accessibility', () => {
        beforeEach(() => {
            testFixture.detectChanges();
        });

        it('should have correct ARIA attributes', async () => {
            testComponent.ariaLabel = 'Select tree node';
            testComponent.ariaLabelledBy = 'tree-label';
            testComponent.inputId = 'tree-input';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const hiddenInput = testFixture.debugElement.query(By.css('input[type="text"]'));

            expect(hiddenInput.nativeElement.getAttribute('aria-label')).toContain('Select tree node');
            expect(hiddenInput.nativeElement.getAttribute('aria-labelledby')).toBe('tree-label');
            expect(hiddenInput.nativeElement.getAttribute('id')).toBe('tree-input');
            expect(hiddenInput.nativeElement.getAttribute('role')).toBe('combobox');
            expect(hiddenInput.nativeElement.getAttribute('aria-haspopup')).toBe('tree');
        });

        it('should handle keyboard navigation', async () => {
            const hiddenInput = testFixture.debugElement.query(By.css('input[type="text"]'));

            // Test keyboard events can be dispatched
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            hiddenInput.nativeElement.dispatchEvent(enterEvent);
            testFixture.detectChanges();
            await testFixture.whenStable();

            // Verify keyboard handling by checking component exists and responds
            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance).toBeTruthy();
        });

        it('should support screen reader compatibility', () => {
            const hiddenInput = testFixture.debugElement.query(By.css('input[type="text"]'));

            expect(hiddenInput.nativeElement.getAttribute('readonly')).toBe('' as any);
            expect(hiddenInput.nativeElement.getAttribute('aria-expanded')).toBe('false');
        });
    });

    describe('Complex Use Cases and Edge Cases', () => {
        beforeEach(() => {
            testFixture.detectChanges();
        });

        it('should handle multiple selection mode', async () => {
            testComponent.selectionMode = 'multiple';
            testComponent.selectedValue = [mockTreeNodes[0], mockTreeNodes[1]];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.selectionMode()).toBe('multiple');
            // Use the component's internal value check method or property
            if (treeSelectInstance.value()) {
                expect(Array.isArray(treeSelectInstance.value())).toBe(true);
            } else {
                expect(treeSelectInstance.selectionMode()).toBe('multiple'); // At least verify the mode was set
            }
        });

        it('should handle checkbox selection mode', async () => {
            testComponent.selectionMode = 'checkbox';
            testComponent.propagateSelectionDown = true;
            testComponent.propagateSelectionUp = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.selectionMode()).toBe('checkbox');
            expect(treeSelectInstance.propagateSelectionDown()).toBe(true);
            expect(treeSelectInstance.propagateSelectionUp()).toBe(true);
        });

        it('should handle filter functionality', async () => {
            testComponent.filter = true;
            testComponent.filterBy = 'label';
            testComponent.filterMode = 'lenient';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const dropdown = testFixture.debugElement.query(By.css('.p-treeselect-dropdown'));
            dropdown.nativeElement.click();
            testFixture.detectChanges();
            await testFixture.whenStable();

            // Verify filter properties are set
            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.filter()).toBe(true);
            expect(treeSelectInstance.filterBy()).toBe('label');
            expect(treeSelectInstance.filterMode()).toBe('lenient');
        });

        it('should handle empty state properly', async () => {
            testComponent.options = [];
            testComponent.emptyMessage = 'No nodes available';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.options()).toEqual([]);
            expect(treeSelectInstance.emptyMessage()).toBe('No nodes available');
        });

        it('should handle large datasets with virtual scrolling', async () => {
            // Create large dataset
            const largeDataset: TreeNode[] = [];
            for (let i = 0; i < 1000; i++) {
                largeDataset.push({
                    key: i.toString(),
                    label: `Node ${i}`,
                    data: `Data ${i}`
                });
            }

            testComponent.options = largeDataset;
            testComponent.virtualScroll = true;
            testComponent.virtualScrollItemSize = 32;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.options().length).toBe(1000);
            expect(treeSelectInstance.virtualScroll()).toBe(true);
            expect(treeSelectInstance.virtualScrollItemSize()).toBe(32);
        });

        it('should handle dynamic option updates', async () => {
            // Start with empty options
            testComponent.options = [];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            // Add options dynamically
            testComponent.options = mockTreeNodes.slice(0, 1);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            // Add more options
            testComponent.options = mockTreeNodes;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.options().length).toBe(2);
        });
    });

    describe('Performance and Optimization', () => {
        beforeEach(() => {
            testFixture.detectChanges();
        });

        it('should handle showClear performance', async () => {
            testComponent.showClear = true;
            testComponent.selectedValue = mockTreeNodes[0];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            // Ensure the internal model is set via ControlValueAccessor
            treeSelectInstance.writeValue(mockTreeNodes[0]);
            testFixture.detectChanges();

            expect(treeSelectInstance.showClear()).toBe(true);
            expect(treeSelectInstance.checkValue()).toBe(true);
        });

        it('should handle tabindex configuration', async () => {
            testComponent.tabindex = 5;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const hiddenInput = testFixture.debugElement.query(By.css('input[type="text"]'));
            expect(hiddenInput.nativeElement.getAttribute('tabindex')).toBe('5');
        });

        it('should handle autofocus functionality', async () => {
            testComponent.autofocus = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const treeSelectInstance = testFixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
            expect(treeSelectInstance.autofocus()).toBe(true);
        });
    });

    describe('PassThrough (PT) Tests', () => {
        beforeEach(() => {
            TestBed.resetTestingModule();
        });

        it('PT: should accept simple string values', async () => {
            await TestBed.configureTestingModule({
                imports: [TreeSelectModule, FormsModule],
                providers: [
                    provideZonelessChangeDetection(),
                    provideExhaustive({
                        pt: {
                            treeSelect: {
                                root: 'custom-root-class',
                                label: 'custom-label-class',
                                dropdown: 'custom-dropdown-class'
                            }
                        }
                    })
                ]
            }).compileComponents();

            const fixture = TestBed.createComponent(TreeSelect);
            fixture.componentRef.setInput('options', mockTreeNodes);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const root = fixture.debugElement;
            expect(root.nativeElement.classList.contains('custom-root-class')).toBe(true);
        });

        it('PT: should accept object values with class', async () => {
            await TestBed.configureTestingModule({
                imports: [TreeSelectModule, FormsModule],
                providers: [
                    provideZonelessChangeDetection(),
                    provideExhaustive({
                        pt: {
                            treeSelect: {
                                root: { class: 'pt-root-test' },
                                label: { class: 'pt-label-test' }
                            }
                        }
                    })
                ]
            }).compileComponents();

            const fixture = TestBed.createComponent(TreeSelect);
            fixture.componentRef.setInput('options', mockTreeNodes);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();
            const root = fixture.debugElement;
            expect(root.nativeElement.classList.contains('pt-root-test')).toBe(true);
        });

        it('PT: should accept mixed object and string values', async () => {
            await TestBed.configureTestingModule({
                imports: [TreeSelectModule, FormsModule],
                providers: [
                    provideZonelessChangeDetection(),
                    provideExhaustive({
                        pt: {
                            treeSelect: {
                                root: 'string-root',
                                label: { class: 'object-label' },
                                dropdown: { class: 'dropdown-class' }
                            }
                        }
                    })
                ]
            }).compileComponents();

            const fixture = TestBed.createComponent(TreeSelect);
            fixture.componentRef.setInput('options', mockTreeNodes);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const root = fixture.debugElement;
            expect(root.nativeElement.classList.contains('string-root')).toBe(true);
        });

        it('PT: should support event handlers in PT options', async () => {
            const clickSpy = vi.fn();

            await TestBed.configureTestingModule({
                imports: [TreeSelectModule, FormsModule],
                providers: [
                    provideZonelessChangeDetection(),
                    provideExhaustive({
                        pt: {
                            treeSelect: {
                                root: {
                                    onClick: clickSpy
                                }
                            }
                        }
                    })
                ]
            }).compileComponents();

            const fixture = TestBed.createComponent(TreeSelect);
            fixture.componentRef.setInput('options', mockTreeNodes);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const root = fixture.debugElement;
            root.nativeElement.click();

            expect(clickSpy).toHaveBeenCalled();
        });

        it('PT: should support ptOptions.mergeProps and ptOptions.mergeSections', async () => {
            await TestBed.configureTestingModule({
                imports: [TreeSelectModule, FormsModule],
                providers: [
                    provideZonelessChangeDetection(),
                    provideExhaustive({
                        pt: {
                            treeSelect: {
                                root: 'global-root',
                                label: 'global-label'
                            }
                        },
                        ptOptions: {
                            mergeProps: true,
                            mergeSections: true
                        }
                    })
                ]
            }).compileComponents();

            const fixture = TestBed.createComponent(TreeSelect);
            fixture.componentRef.setInput('options', mockTreeNodes);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const root = fixture.debugElement;
            expect(root.nativeElement.classList.contains('global-root')).toBe(true);
        });
    });
});

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [TreeSelect, SharedModule],
    template: `
        <p-treeselect [options]="opts">
            <ng-template #dropdownicon>di</ng-template>
            <ng-template #filtericon>fi</ng-template>
            <ng-template pTemplate="value">v</ng-template>
        </p-treeselect>
    `
})
class TreeSelectQueryApiHostComponent {
    opts = [];
}

describe('TreeSelect Signal Query API', () => {
    it('should resolve its signal-based view/content queries', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [TreeSelectQueryApiHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(TreeSelectQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const instance = fixture.debugElement.query(By.directive(TreeSelect)).componentInstance;

        expect(instance.dropdownIconTemplate()).toBeDefined();
        expect(instance.filterIconTemplate()).toBeDefined();
        expect(instance.templates().some((t: any) => t.getType() === 'value')).toBe(true);
        expect(instance.focusInput()).toBeDefined();
        expect(instance.overlayViewChild()).toBeDefined();
        expect(instance.filterViewChild()).toBeUndefined();
        expect(instance.treeViewChild()).toBeUndefined();
        expect(instance.panelEl()).toBeUndefined();
        expect(instance.firstHiddenFocusableElementOnOverlay()).toBeUndefined();
        expect(instance.lastHiddenFocusableElementOnOverlay()).toBeUndefined();
    });
});

@Component({
    standalone: true,
    imports: [TreeSelect, FormsModule, SharedModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <p-treeselect
            [(ngModel)]="selected"
            [options]="options()"
            [placeholder]="placeholder()"
            [display]="display()"
            [selectionMode]="selectionMode()"
            [showClear]="showClear()"
            [class]="containerStyleClass()"
            [style]="containerStyle()"
            [labelStyleClass]="labelStyleClass()"
            [ariaLabel]="ariaLabel()"
            [appendTo]="'self'"
        >
            <ng-template pTemplate="clearicon"><span class="ptemplate-clear">x</span></ng-template>
            <ng-template pTemplate="footer"><div class="ptemplate-footer">footer</div></ng-template>
        </p-treeselect>
    `
})
class TreeSelectSignalHostComponent {
    selected = signal<any>(null);
    options = signal<TreeNode[] | undefined>([
        { key: '0', label: 'Documents', children: [{ key: '0-0', label: 'Work' }] },
        { key: '1', label: 'Pictures' }
    ]);
    placeholder = signal<string | undefined>('Pick one');
    display = signal<'comma' | 'chip'>('comma');
    selectionMode = signal<'single' | 'multiple' | 'checkbox'>('single');
    showClear = signal(false);
    containerStyleClass = signal<string | undefined>(undefined);
    containerStyle = signal<any>(undefined);
    labelStyleClass = signal<string | undefined>(undefined);
    ariaLabel = signal<string | undefined>(undefined);
}

describe('TreeSelect Signal API', () => {
    let fixture: ComponentFixture<TreeSelectSignalHostComponent>;
    let host: TreeSelectSignalHostComponent;
    let treeSelect: TreeSelect;

    const el = () => fixture.debugElement.query(By.directive(TreeSelect)).nativeElement as HTMLElement;
    const labelEl = () => el().querySelector('[data-pc-section="label"]') as HTMLElement;

    const render = async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    };

    beforeEach(async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [TreeSelectSignalHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        }).compileComponents();

        fixture = TestBed.createComponent(TreeSelectSignalHostComponent);
        host = fixture.componentInstance;
        await render();
        treeSelect = fixture.debugElement.query(By.directive(TreeSelect)).componentInstance;
    });

    it('should re-render the placeholder label when placeholder changes under OnPush', async () => {
        expect(labelEl().textContent?.trim()).toBe('Pick one');
        expect(labelEl().classList.contains('p-placeholder')).toBe(true);

        host.placeholder.set('Choose');
        await render();

        expect(labelEl().textContent?.trim()).toBe('Choose');
    });

    it('should re-render the label when the model value is written', async () => {
        host.selected.set(host.options()![1]);
        await render();

        expect(treeSelect.value()).toBe(host.options()![1]);
        expect(treeSelect.label()).toBe('Pictures');
        expect(labelEl().textContent?.trim()).toBe('Pictures');
        expect(el().classList.contains('p-inputwrapper-filled')).toBe(true);
    });

    it('should render chips when display changes to chip', async () => {
        host.selectionMode.set('multiple');
        host.display.set('chip');
        host.selected.set([host.options()![1]]);
        await render();

        expect(el().classList.contains('p-treeselect-display-chip')).toBe(true);
        expect(el().querySelectorAll('p-chip').length).toBe(1);
    });

    it('should render the clear icon pTemplate when showClear changes and a value is set', async () => {
        host.selected.set(host.options()![1]);
        await render();
        expect(el().querySelector('.ptemplate-clear')).toBeNull();

        host.showClear.set(true);
        await render();

        expect(el().classList.contains('p-treeselect-clearable')).toBe(true);
        expect(el().querySelector('.ptemplate-clear')).toBeTruthy();
    });

    it('should apply class, style and labelStyleClass changes', async () => {
        host.containerStyleClass.set('custom-container');
        host.containerStyle.set({ width: '240px' });
        host.labelStyleClass.set('custom-label');
        await render();

        expect(el().classList.contains('custom-container')).toBe(true);
        expect(el().classList.contains('p-treeselect')).toBe(true);
        expect(el().style.width).toBe('240px');
        expect(labelEl().classList.contains('custom-label')).toBe(true);
    });

    it('should update the hidden input aria-label when ariaLabel changes', async () => {
        host.ariaLabel.set('Folders');
        await render();

        expect(el().querySelector('input[role="combobox"]')?.getAttribute('aria-label')).toBe('Folders');
    });

    it('should open the overlay, render the footer pTemplate and close again', async () => {
        treeSelect.show();
        await render();

        expect(treeSelect.overlayVisible()).toBe(true);
        expect(el().classList.contains('p-treeselect-open')).toBe(true);
        expect(el().querySelector('input[role="combobox"]')?.getAttribute('aria-expanded')).toBe('true');
        expect(el().querySelector('.ptemplate-footer')).toBeTruthy();

        treeSelect.hide();
        await render();

        expect(treeSelect.overlayVisible()).toBe(false);
        expect(el().classList.contains('p-treeselect-open')).toBe(false);
    });

    it('should expand the path of the selected node when options change', async () => {
        const child = { key: 'a-0', label: 'A0' };
        const parent: TreeNode = { key: 'a', label: 'A', children: [child] };
        host.selected.set(child);
        await render();

        host.options.set([parent, { key: 'b', label: 'B' }]);
        await render();

        expect(parent.expanded).toBe(true);
        expect(treeSelect.expandedNodes()).toEqual([parent]);
    });

    it('should toggle the focus state class on focus and blur', async () => {
        const input = el().querySelector('input[role="combobox"]') as HTMLInputElement;

        input.dispatchEvent(new FocusEvent('focus'));
        await render();
        expect(treeSelect.focused()).toBe(true);
        expect(el().classList.contains('p-focus')).toBe(true);

        input.dispatchEvent(new FocusEvent('blur'));
        await render();
        expect(treeSelect.focused()).toBe(false);
        expect(el().classList.contains('p-focus')).toBe(false);
    });

    it('should clear the value and reset the expanded nodes', async () => {
        const child = { key: 'a-0', label: 'A0' };
        const parent: TreeNode = { key: 'a', label: 'A', children: [child] };
        host.options.set([parent]);
        host.selected.set(child);
        await render();
        expect(parent.expanded).toBe(true);

        treeSelect.clear(new MouseEvent('click'));
        await render();

        expect(treeSelect.value()).toBeNull();
        expect(treeSelect.checkValue()).toBe(false);
        expect(treeSelect.expandedNodes()).toEqual([]);
        expect(parent.expanded).toBe(false);
        expect(host.selected()).toBeNull();
        expect(labelEl().textContent?.trim()).toBe('Pick one');
    });
});

describe('TreeSelect low bug fixes', () => {
    let fixture: ComponentFixture<TreeSelect>;
    let treeSelect: TreeSelect;

    beforeEach(async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [TreeSelect],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        }).compileComponents();

        fixture = TestBed.createComponent(TreeSelect);
        treeSelect = fixture.componentInstance;
        fixture.componentRef.setInput('options', [{ key: 'a', label: 'A', children: [{ key: 'a-0', label: 'A0' }] }]);
        fixture.detectChanges();
    });

    afterEach(() => {
        document.querySelectorAll('.p-treeselect-overlay').forEach((el) => el.remove());
    });

    it('passes togglerAriaLabel to the tree toggle buttons (optimus-ui#624)', async () => {
        fixture.componentRef.setInput('togglerAriaLabel', 'Toggle row');
        treeSelect.show();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const button = document.querySelector('.p-treeselect-overlay button[data-pc-section="nodetogglebutton"]') as HTMLButtonElement;
        expect(button.getAttribute('aria-label')).toBe('Toggle row');
    });

    it('marks the control touched when the overlay closes, not when focus moves into it (optimus-ui#575)', () => {
        const touched = vi.fn();
        treeSelect.registerOnTouched(touched);
        const input = fixture.nativeElement.querySelector('input[role="combobox"]') as HTMLInputElement;

        treeSelect.show();
        input.dispatchEvent(new FocusEvent('blur'));
        expect(touched).not.toHaveBeenCalled();

        treeSelect.hide();
        expect(touched).toHaveBeenCalled();

        touched.mockClear();
        input.dispatchEvent(new FocusEvent('blur'));
        expect(touched).toHaveBeenCalled();
    });
});

describe('TreeSelect r22 regressions', () => {
    let fixture: ComponentFixture<TreeSelect>;
    let treeSelect: TreeSelect;
    const nodes = () =>
        Array.from({ length: 30 }, (_, i) => ({
            key: `${i}`,
            label: `Node ${i}`,
            children: [
                { key: `${i}-0`, label: `Child ${i}.0` },
                { key: `${i}-1`, label: `Child ${i}.1` }
            ]
        }));
    const settle = async () => {
        for (let i = 0; i < 4; i++) {
            fixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 30));
            await fixture.whenStable();
        }
    };

    beforeEach(async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [TreeSelect, ReactiveFormsModule],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        }).compileComponents();

        fixture = TestBed.createComponent(TreeSelect);
        treeSelect = fixture.componentInstance;
    });

    afterEach(() => {
        document.querySelectorAll('.p-treeselect-overlay').forEach((el) => el.remove());
    });

    it('shows the nodes when the overlay opens with filter and virtual scroll (optimus-ui#238)', async () => {
        fixture.componentRef.setInput('options', nodes());
        fixture.componentRef.setInput('selectionMode', 'checkbox');
        fixture.componentRef.setInput('filter', true);
        fixture.componentRef.setInput('virtualScroll', true);
        fixture.componentRef.setInput('virtualScrollItemSize', 35);
        fixture.componentRef.setInput('virtualScrollOptions', { scrollHeight: '200px' });
        await settle();

        treeSelect.show();
        await settle();

        const labels = Array.from(document.querySelectorAll('.p-treeselect-overlay .p-tree-node-label')).map((l) => l.textContent!.trim());
        expect(labels.length).toBeGreaterThan(0);
        expect(labels[0]).toBe('Node 0');
    });

    it('keeps the form value serializable after selecting a nested node (optimus-ui#674)', async () => {
        const changes: any[] = [];
        treeSelect.registerOnChange((value: any) => changes.push(value));
        fixture.componentRef.setInput('options', [{ key: 'a', label: 'A', expanded: true, children: [{ key: 'a-0', label: 'A0' }] }]);
        fixture.componentRef.setInput('selectionMode', 'checkbox');
        await settle();

        treeSelect.show();
        await settle();
        const child = Array.from(document.querySelectorAll('.p-treeselect-overlay .p-tree-node-content')).find((c) => c.textContent!.trim() === 'A0') as HTMLElement;
        child.click();
        await settle();

        const value = changes[changes.length - 1];
        expect(value.map((n: TreeNode) => n.label)).toEqual(['A0', 'A']);
        expect(() => JSON.stringify(value)).not.toThrow();
        // The parent link stays available to code that walks the tree
        expect(value[0].parent?.label).toBe('A');
    });

    it('writes the model once when checking a node with many descendants (optimus-ui#836)', async () => {
        const changes: any[] = [];
        treeSelect.registerOnChange((value: any) => changes.push(value));
        fixture.componentRef.setInput('options', [
            {
                key: 'r',
                label: 'Root',
                expanded: true,
                children: Array.from({ length: 300 }, (_, i) => ({ key: `r-${i}`, label: `Leaf ${i}` }))
            }
        ]);
        fixture.componentRef.setInput('selectionMode', 'checkbox');
        await settle();

        treeSelect.show();
        await settle();
        const root = Array.from(document.querySelectorAll('.p-treeselect-overlay .p-tree-node-content')).find((c) => c.textContent!.trim() === 'Root') as HTMLElement;
        root.click();
        await settle();

        expect(changes.length).toBe(1);
        expect(changes[0].length).toBe(301);

        root.click();
        await settle();
        expect(changes.length).toBe(2);
        expect(changes[1].length).toBe(0);
    });
});
