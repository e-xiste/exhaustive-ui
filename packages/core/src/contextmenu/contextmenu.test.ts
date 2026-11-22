import { Theme } from '@exhaustive-ui/styled';
import { Base } from '@exhaustive-ui/core/base';
import { ChangeDetectionStrategy, Component, DebugElement, provideZonelessChangeDetection, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuItem, SharedModule } from '@exhaustive-ui/core/api';
import { isIOS } from '@exhaustive-ui/utils';
import { ContextMenu, ContextMenuSub } from './contextmenu';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-contextmenu
            [model]="model"
            [target]="target"
            [global]="global"
            [style]="style"
            [styleClass]="styleClass"
            [autoZIndex]="autoZIndex"
            [baseZIndex]="baseZIndex"
            [breakpoint]="breakpoint"
            [ariaLabel]="ariaLabel"
            [ariaLabelledBy]="ariaLabelledBy"
            [pressDelay]="pressDelay"
            [triggerEvent]="triggerEvent"
            (onShow)="onShow($event)"
            (onHide)="onHide($event)"
        >
        </p-contextmenu>
    `
})
class TestBasicContextMenuComponent {
    model: MenuItem[] | undefined = [{ label: 'File', icon: 'pi pi-file' }, { label: 'Edit', icon: 'pi pi-pencil' }, { separator: true }, { label: 'Settings', icon: 'pi pi-cog' }];
    target: HTMLElement | string | undefined;
    global: boolean = false;
    style: { [klass: string]: any } | null | undefined;
    styleClass: string | undefined;
    autoZIndex: boolean = true;
    baseZIndex: number = 0;
    breakpoint: string = '960px';
    ariaLabel: string | undefined;
    ariaLabelledBy: string | undefined;
    pressDelay: number = 500;
    triggerEvent: string = 'contextmenu';

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
    selector: 'test-target-contextmenu',
    template: `
        <div #targetDiv id="target-div">Target Element</div>
        <p-contextmenu [model]="model" target="targetDiv"></p-contextmenu>
    `
})
class TestTargetContextMenuComponent {
    readonly targetDiv = viewChild<any>('targetDiv');

    model: MenuItem[] = [
        { label: 'Copy', icon: 'pi pi-copy' },
        { label: 'Paste', icon: 'pi pi-clone' }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-global-contextmenu',
    template: ` <p-contextmenu [model]="model" [global]="true"></p-contextmenu> `
})
class TestGlobalContextMenuComponent {
    model: MenuItem[] = [{ label: 'Global Item 1' }, { label: 'Global Item 2' }];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-contextmenu [model]="nestedModel">
            <ng-template #item let-item>
                <div class="custom-item">
                    @if (item.icon) {
                        <i [class]="item.icon"></i>
                    }
                    <span class="custom-label">{{ item.label }}</span>
                </div>
            </ng-template>
        </p-contextmenu>
    `
})
class TestItemTemplateContextMenuComponent {
    nestedModel: MenuItem[] = [
        {
            label: 'File',
            icon: 'pi pi-file',
            items: [
                { label: 'New', icon: 'pi pi-plus' },
                { label: 'Open', icon: 'pi pi-folder-open' }
            ]
        },
        { label: 'Edit', icon: 'pi pi-pencil' }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-contextmenu [model]="model">
            <ng-template pTemplate="item" let-item>
                <span class="p-template-item">{{ item.label }}</span>
            </ng-template>
        </p-contextmenu>
    `
})
class TestPTemplateContextMenuComponent {
    model: MenuItem[] = [{ label: 'PTemplate Item 1' }, { label: 'PTemplate Item 2' }];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-contextmenu [model]="model">
            <ng-template pTemplate="submenuicon">
                <i class="p-template-submenu-icon pi pi-angle-right"></i>
            </ng-template>
            <ng-template pTemplate="item" let-item>
                <span class="p-template-item">{{ item.label }}</span>
            </ng-template>
        </p-contextmenu>
    `
})
class TestPTemplateSubmenuIconComponent {
    model: MenuItem[] = [
        {
            label: 'File',
            items: [{ label: 'New' }, { label: 'Open' }]
        }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-contextmenu [model]="model">
            <ng-template #submenuicon>
                <i class="custom-submenu-icon pi pi-angle-right"></i>
            </ng-template>
        </p-contextmenu>
    `
})
class TestSubmenuIconTemplateComponent {
    model: MenuItem[] = [
        {
            label: 'File',
            items: [{ label: 'New' }, { label: 'Open' }]
        }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-router-contextmenu',
    template: ` <p-contextmenu [model]="routerModel"></p-contextmenu> `
})
class TestRouterContextMenuComponent {
    routerModel: MenuItem[] = [
        { label: 'Home', routerLink: '/' },
        { label: 'Products', routerLink: '/products' },
        {
            label: 'Services',
            routerLink: ['/services'],
            queryParams: { tab: 'overview' }
        }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-styled-contextmenu',
    template: ` <p-contextmenu [style]="customStyle" styleClass="custom-contextmenu"></p-contextmenu> `
})
class TestStyledContextMenuComponent {
    customStyle = {
        border: '2px solid #007bff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    };
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-minimal-contextmenu',
    template: `<p-contextmenu></p-contextmenu>`
})
class TestMinimalContextMenuComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-dynamic-contextmenu',
    template: ` <p-contextmenu [model]="dynamicModel"></p-contextmenu> `
})
class TestDynamicContextMenuComponent {
    dynamicModel: MenuItem[] = [];

    addItem(item: MenuItem) {
        this.dynamicModel.push(item);
    }

    clearItems() {
        this.dynamicModel = [];
    }

    removeItem(index: number) {
        this.dynamicModel.splice(index, 1);
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-disabled-items-contextmenu',
    template: ` <p-contextmenu [model]="disabledModel"></p-contextmenu> `
})
class TestDisabledItemsComponent {
    disabledModel: MenuItem[] = [{ label: 'Enabled Item' }, { label: 'Disabled Item', disabled: true }, { separator: true }, { label: 'Another Enabled Item' }];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    selector: 'test-target-component',
    template: '<div>Target Page</div>'
})
class TestTargetComponent {}

describe('ContextMenu', () => {
    let component: TestBasicContextMenuComponent;
    let fixture: ComponentFixture<TestBasicContextMenuComponent>;
    let contextMenuElement: DebugElement;
    let contextMenuInstance: ContextMenu;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                TestBasicContextMenuComponent,
                TestTargetContextMenuComponent,
                TestGlobalContextMenuComponent,
                TestItemTemplateContextMenuComponent,
                TestPTemplateContextMenuComponent,
                TestPTemplateSubmenuIconComponent,
                TestSubmenuIconTemplateComponent,
                TestRouterContextMenuComponent,
                TestStyledContextMenuComponent,
                TestMinimalContextMenuComponent,
                TestDynamicContextMenuComponent,
                TestDisabledItemsComponent
            ],
            imports: [
                ContextMenu,
                TestTargetComponent,

                SharedModule,
                RouterTestingModule.withRoutes([
                    { path: '', component: TestTargetComponent },
                    { path: 'products', component: TestTargetComponent },
                    { path: 'services', component: TestTargetComponent }
                ])
            ],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestBasicContextMenuComponent);
        component = fixture.componentInstance;
        contextMenuElement = fixture.debugElement.query(By.directive(ContextMenu));
        contextMenuInstance = contextMenuElement.componentInstance;
        await fixture.whenStable();
    });

    describe('Component Initialization', () => {
        it('should create the component', () => {
            expect(contextMenuInstance).toBeTruthy();
        });

        it('should have required dependencies injected', () => {
            expect(contextMenuInstance.overlayService).toBeTruthy();
            expect(contextMenuInstance._componentStyle).toBeTruthy();
            expect(contextMenuInstance).toBeInstanceOf(ContextMenu);
        });

        it('should have default values', async () => {
            const freshFixture = TestBed.createComponent(TestMinimalContextMenuComponent);
            await freshFixture.whenStable();

            const freshContextMenu = freshFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;

            expect(freshContextMenu.model()).toBeUndefined();
            expect(freshContextMenu.target()).toBeUndefined();
            expect(freshContextMenu.global()).toBeFalsy();
            expect(freshContextMenu.triggerEvent()).toBe('contextmenu');
            expect(freshContextMenu.autoZIndex()).toBe(true);
            expect(freshContextMenu.baseZIndex()).toBe(0);
            expect(freshContextMenu.breakpoint()).toBe('960px');
            expect(freshContextMenu.pressDelay()).toBe(500);
            expect(freshContextMenu.styleClass()).toBeUndefined();
            expect(freshContextMenu.style()).toBeUndefined();
            expect(freshContextMenu.id()).toBeUndefined();
        });

        it('should accept custom values', async () => {
            const testModel: MenuItem[] = [{ label: 'Test Item' }];
            component.model = testModel;
            component.global = true;
            component.triggerEvent = 'click';
            component.autoZIndex = false;
            component.baseZIndex = 100;
            component.styleClass = 'custom-contextmenu';
            component.ariaLabel = 'Custom Context Menu';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(contextMenuInstance.model()).toBe(testModel);
            expect(contextMenuInstance.global()).toBe(true);
            expect(contextMenuInstance.triggerEvent()).toBe('click');
            expect(contextMenuInstance.autoZIndex()).toBe(false);
            expect(contextMenuInstance.baseZIndex()).toBe(100);
            expect(contextMenuInstance.styleClass()).toBe('custom-contextmenu');
            expect(contextMenuInstance.ariaLabel()).toBe('Custom Context Menu');
        });

        it('should initialize with generated id', () => {
            expect(contextMenuInstance.id()).toBeUndefined();
            expect(contextMenuInstance._id()).toBeTruthy();
            expect(typeof contextMenuInstance._id()).toBe('string');
            expect(contextMenuInstance._id()).toMatch(/^pn_id_/);
            expect(contextMenuInstance._id()).toBe(contextMenuInstance._id());
        });

        it('should have onShow and onHide output emitters', () => {
            expect(contextMenuInstance.onShow).toBeTruthy();
            expect(contextMenuInstance.onHide).toBeTruthy();
        });

        it('should initialize signal states', () => {
            expect(contextMenuInstance.visible()).toBe(false);
            expect(contextMenuInstance.focused()).toBe(false);
            expect(contextMenuInstance.submenuVisible()).toBe(false);
            expect(contextMenuInstance.activeItemPath()).toEqual([]);
        });
    });

    describe('Input Properties', () => {
        it('should update model input', async () => {
            const newModel = [{ label: 'New Item' }];
            component.model = newModel;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(contextMenuInstance.model()).toBe(newModel);
            expect(contextMenuInstance.processedItems().length).toBe(1);
            expect(contextMenuInstance.processedItems()[0].item).toBe(newModel[0]);
        });

        it('should update target input', async () => {
            const targetElement = document.createElement('div');
            component.target = targetElement;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(contextMenuInstance.target()).toBe(targetElement);
        });

        it('should update global input with booleanAttribute transform', async () => {
            component.global = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(contextMenuInstance.global()).toBe(true);

            component.global = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(contextMenuInstance.global()).toBe(false);
        });

        it('should update triggerEvent input', async () => {
            component.triggerEvent = 'click';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(contextMenuInstance.triggerEvent()).toBe('click');
        });

        it('should update style and styleClass inputs', async () => {
            const customStyle = { color: 'red' };
            component.style = customStyle;
            component.styleClass = 'test-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(contextMenuInstance.style()).toBe(customStyle);
            expect(contextMenuInstance.styleClass()).toBe('test-class');
        });

        it('should update autoZIndex with booleanAttribute transform', async () => {
            component.autoZIndex = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(contextMenuInstance.autoZIndex()).toBe(false);
        });

        it('should update baseZIndex with numberAttribute transform', async () => {
            component.baseZIndex = 1000;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(contextMenuInstance.baseZIndex()).toBe(1000);
        });

        it('should update breakpoint input', async () => {
            component.breakpoint = '768px';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(contextMenuInstance.breakpoint()).toBe('768px');
        });

        it('should update ariaLabel and ariaLabelledBy inputs', async () => {
            component.ariaLabel = 'Test Menu';
            component.ariaLabelledBy = 'menu-label';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(contextMenuInstance.ariaLabel()).toBe('Test Menu');
            expect(contextMenuInstance.ariaLabelledBy()).toBe('menu-label');
        });

        it('should update pressDelay with numberAttribute transform', async () => {
            component.pressDelay = 1000;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(contextMenuInstance.pressDelay()).toBe(1000);
        });
    });

    describe('Context Menu Display Tests', () => {
        it('should not be visible initially', () => {
            expect(contextMenuInstance.visible()).toBe(false);
        });

        it('should show context menu on show() call', () => {
            const mockEvent = {
                pageX: 100,
                pageY: 150,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn()
            };

            contextMenuInstance.show(mockEvent);

            expect(contextMenuInstance.visible()).toBe(true);
            expect(contextMenuInstance.render()).toBe(true);
            expect(contextMenuInstance.pageX()).toBe(100);
            expect(contextMenuInstance.pageY()).toBe(150);
        });

        it('should hide context menu on hide() call', () => {
            contextMenuInstance.visible.set(true);

            contextMenuInstance.hide();

            expect(contextMenuInstance.visible()).toBe(false);
            expect(contextMenuInstance.activeItemPath()).toEqual([]);
        });

        it('should run and keep the hideCallback on hide', () => {
            const hideCallback = vi.fn();
            contextMenuInstance.hideCallback.set(hideCallback);
            contextMenuInstance.visible.set(true);

            contextMenuInstance.hide();

            expect(hideCallback).toHaveBeenCalledTimes(1);
            expect(contextMenuInstance.hideCallback()).toBe(hideCallback);
            expect(contextMenuInstance.focusedItemInfo()).toEqual({ index: -1, level: 0, parentKey: '', item: null });
        });

        it('should toggle context menu visibility', () => {
            const mockEvent = {
                pageX: 100,
                pageY: 150,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn()
            };

            expect(contextMenuInstance.visible()).toBe(false);

            contextMenuInstance.toggle(mockEvent);
            expect(contextMenuInstance.visible()).toBe(true);

            contextMenuInstance.toggle();
            expect(contextMenuInstance.visible()).toBe(false);
        });

        it('should emit onShow when showing', () => {
            vi.spyOn(contextMenuInstance.onShow, 'emit').mockImplementation(() => {});

            const mockEvent = {
                pageX: 100,
                pageY: 150,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn()
            };

            contextMenuInstance.show(mockEvent);

            expect(contextMenuInstance.onShow.emit).toHaveBeenCalled();
        });

        it('should emit onHide when hiding', () => {
            vi.spyOn(contextMenuInstance.onHide, 'emit').mockImplementation(() => {});
            contextMenuInstance.visible.set(true);

            contextMenuInstance.hide();

            expect(contextMenuInstance.onHide.emit).toHaveBeenCalled();
        });

        it('should handle show event stopPropagation and preventDefault', () => {
            const mockEvent = {
                pageX: 100,
                pageY: 150,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn()
            };

            contextMenuInstance.show(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });
    });

    describe('Target and Global Context Menu Tests', () => {
        it('should work with target element', async () => {
            const targetFixture = TestBed.createComponent(TestTargetContextMenuComponent);
            const targetComponent = targetFixture.componentInstance;

            const targetContextMenu = targetFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;

            // Mock the bindTriggerEventListener BEFORE detecting changes
            vi.spyOn(targetContextMenu, 'bindTriggerEventListener').mockImplementation(() => {});

            // Now detect changes to trigger ngOnInit
            await targetFixture.whenStable();

            // Test the properties
            expect(targetContextMenu.target()).toBe('targetDiv');
            expect(targetContextMenu.global()).toBeFalsy();
            expect(targetContextMenu.bindTriggerEventListener).toHaveBeenCalled();
        });

        it('should work in global mode', async () => {
            const globalFixture = TestBed.createComponent(TestGlobalContextMenuComponent);
            await globalFixture.whenStable();

            const globalContextMenu = globalFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;
            expect(globalContextMenu.global()).toBe(true);
        });

        it('should bind trigger event listener on init', async () => {
            vi.spyOn(contextMenuInstance, 'bindTriggerEventListener').mockImplementation(() => {});

            // Set up a proper target before calling ngOnInit
            const mockTarget = document.createElement('div');
            component.target = mockTarget;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            contextMenuInstance.ngOnInit();

            expect(contextMenuInstance.bindTriggerEventListener).toHaveBeenCalled();
        });

        it('should handle mobile device detection', () => {
            expect(typeof contextMenuInstance.isMobile).toBe('function');

            const isMobile = contextMenuInstance.isMobile();
            expect(typeof isMobile).toBe('boolean');
        });
    });

    describe('Template Tests', () => {
        const showEvent = () => ({ pageX: 10, pageY: 10, stopPropagation: vi.fn(), preventDefault: vi.fn() });

        it('should handle #item template processing', async () => {
            const itemTemplateFixture = TestBed.createComponent(TestItemTemplateContextMenuComponent);
            await itemTemplateFixture.whenStable();

            const itemTemplateContextMenu = itemTemplateFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;

            expect(itemTemplateContextMenu.itemTemplate()).toBeTruthy();
            expect(itemTemplateContextMenu._itemTemplate()).toBeUndefined();
            expect(itemTemplateContextMenu._submenuIconTemplate()).toBeUndefined();
        });

        it('should handle pTemplate processing', async () => {
            const pTemplateFixture = TestBed.createComponent(TestPTemplateContextMenuComponent);
            await pTemplateFixture.whenStable();

            const pTemplateContextMenu = pTemplateFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;

            expect(pTemplateContextMenu.templates().length).toBe(1);
            expect(pTemplateContextMenu.itemTemplate()).toBeUndefined();
            expect(pTemplateContextMenu._itemTemplate()).toBe(pTemplateContextMenu.templates()[0].template);
            expect(pTemplateContextMenu._submenuIconTemplate()).toBeUndefined();
        });

        it('should handle submenuicon template', async () => {
            const submenuTemplateFixture = TestBed.createComponent(TestSubmenuIconTemplateComponent);
            await submenuTemplateFixture.whenStable();

            const submenuContextMenu = submenuTemplateFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;

            expect(submenuContextMenu.submenuIconTemplate()).toBeTruthy();
            expect(submenuContextMenu._submenuIconTemplate()).toBeUndefined();
        });

        it('should process PrimeTemplate types correctly', async () => {
            const pTemplateFixture = TestBed.createComponent(TestPTemplateSubmenuIconComponent);
            await pTemplateFixture.whenStable();

            const pTemplateContextMenu = pTemplateFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;

            expect(pTemplateContextMenu.templates().length).toBe(2);
            expect(pTemplateContextMenu._submenuIconTemplate()).toBe(pTemplateContextMenu.templates()[0].template);
            expect(pTemplateContextMenu._itemTemplate()).toBe(pTemplateContextMenu.templates()[1].template);
        });

        it('should render the pTemplate item for every item', async () => {
            const pTemplateFixture = TestBed.createComponent(TestPTemplateContextMenuComponent);
            await pTemplateFixture.whenStable();

            const pTemplateContextMenu = pTemplateFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;
            pTemplateContextMenu.show(showEvent());
            pTemplateFixture.changeDetectorRef.markForCheck();
            await pTemplateFixture.whenStable();

            const customItems = pTemplateFixture.debugElement.queryAll(By.css('.p-template-item'));
            expect(customItems.length).toBe(2);
            expect(customItems[0].nativeElement.textContent.trim()).toBe('PTemplate Item 1');
            expect(pTemplateFixture.debugElement.queryAll(By.css('.p-contextmenu-item-link')).length).toBe(0);
        });

        it('should prioritize itemTemplate over _itemTemplate', async () => {
            const itemTemplateFixture = TestBed.createComponent(TestItemTemplateContextMenuComponent);
            await itemTemplateFixture.whenStable();

            const contextMenuComp = itemTemplateFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;
            contextMenuComp.show(showEvent());
            itemTemplateFixture.changeDetectorRef.markForCheck();
            await itemTemplateFixture.whenStable();

            const rootmenu: ContextMenuSub = contextMenuComp.rootmenu();
            expect(rootmenu.itemTemplate()).toBe(contextMenuComp.itemTemplate());
            const customLabels = itemTemplateFixture.debugElement.queryAll(By.css('.custom-label'));
            expect(customLabels.length).toBe(2);
            expect(customLabels[1].nativeElement.textContent).toBe('Edit');
        });

        it('should handle missing templates gracefully', () => {
            expect(contextMenuInstance.templates()).toEqual([]);
            expect(contextMenuInstance.itemTemplate()).toBeUndefined();
            expect(contextMenuInstance.submenuIconTemplate()).toBeUndefined();
            expect(contextMenuInstance._itemTemplate()).toBeUndefined();
            expect(contextMenuInstance._submenuIconTemplate()).toBeUndefined();
        });
    });

    describe('Menu Items and Model Tests', () => {
        it('should process menu items correctly', async () => {
            const model = [
                { label: 'Item 1' },
                {
                    label: 'Item 2',
                    items: [{ label: 'Subitem 1' }, { label: 'Subitem 2' }]
                }
            ];

            component.model = model;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(contextMenuInstance.processedItems()).toBeTruthy();
            expect(contextMenuInstance.processedItems().length).toBe(2);
            expect(contextMenuInstance.processedItems()[1].items).toBeTruthy();
            expect(contextMenuInstance.processedItems()[1].items.length).toBe(2);
        });

        it('should handle empty model', async () => {
            component.model = [];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(contextMenuInstance.processedItems()).toEqual([]);
        });

        it('should handle undefined model', async () => {
            component.model = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(contextMenuInstance.model()).toBeUndefined();
            expect(contextMenuInstance.processedItems()).toEqual([]);
        });

        it('should handle items with separators', async () => {
            const modelWithSeparator = [{ label: 'Item 1' }, { separator: true }, { label: 'Item 2' }];

            component.model = modelWithSeparator;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(contextMenuInstance.processedItems().length).toBe(3);
            expect(contextMenuInstance.isItemSeparator(modelWithSeparator[1])).toBe(true);
        });

        it('should handle disabled items', async () => {
            const disabledFixture = TestBed.createComponent(TestDisabledItemsComponent);
            await disabledFixture.whenStable();

            const disabledContextMenu = disabledFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;
            const disabledItem = disabledContextMenu.model()[1];

            expect(contextMenuInstance.isItemDisabled(disabledItem)).toBe(true);
        });
    });

    describe('Keyboard Navigation Tests', () => {
        beforeEach(() => {
            contextMenuInstance.visible.set(true);
            contextMenuInstance.focusedItemInfo.set({ index: 0, level: 0, parentKey: '', item: null });

            // Mock the rootmenu property to prevent undefined errors
            (contextMenuInstance as any).rootmenu = () =>
                ({
                    el: {
                        nativeElement: document.createElement('div')
                    }
                }) as any;

            // Create mock menu items structure
            const mockMenuDiv = document.createElement('div');
            mockMenuDiv.innerHTML = '<ul><li data-pc-section="menuitem" id="item_0"></li></ul>';
            contextMenuInstance.rootmenu()!.el!.nativeElement.appendChild(mockMenuDiv);
        });

        it('should handle arrow down key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'ArrowDown' });
            vi.spyOn(keyEvent, 'preventDefault').mockImplementation(() => {});

            // Mock the changeFocusedItemIndex method to prevent rootmenu access errors
            vi.spyOn(contextMenuInstance, 'changeFocusedItemIndex').mockImplementation(() => {});

            contextMenuInstance.onKeyDown(keyEvent);

            expect(keyEvent.preventDefault).toHaveBeenCalled();
        });

        it('should handle arrow up key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'ArrowUp' });
            vi.spyOn(keyEvent, 'preventDefault').mockImplementation(() => {});

            contextMenuInstance.onKeyDown(keyEvent);

            expect(keyEvent.preventDefault).toHaveBeenCalled();
        });

        it('should handle escape key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'Escape' });
            vi.spyOn(contextMenuInstance, 'hide').mockImplementation(() => {});
            vi.spyOn(keyEvent, 'preventDefault').mockImplementation(() => {});

            contextMenuInstance.onKeyDown(keyEvent);

            expect(contextMenuInstance.hide).toHaveBeenCalled();
            expect(keyEvent.preventDefault).toHaveBeenCalled();
        });

        it('should handle enter key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'Enter' });
            vi.spyOn(keyEvent, 'preventDefault').mockImplementation(() => {});

            // Mock the onEnterKey method to prevent rootmenu access errors
            vi.spyOn(contextMenuInstance, 'onEnterKey').mockImplementation(() => {});

            contextMenuInstance.onKeyDown(keyEvent);

            expect(contextMenuInstance.onEnterKey).toHaveBeenCalledWith(keyEvent);
        });

        it('should handle space key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'Space' });
            vi.spyOn(contextMenuInstance, 'onEnterKey').mockImplementation(() => {});

            contextMenuInstance.onKeyDown(keyEvent);

            expect(contextMenuInstance.onEnterKey).toHaveBeenCalledWith(keyEvent);
        });

        it('should handle home key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'Home' });
            vi.spyOn(keyEvent, 'preventDefault').mockImplementation(() => {});

            contextMenuInstance.onKeyDown(keyEvent);

            expect(keyEvent.preventDefault).toHaveBeenCalled();
        });

        it('should handle end key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'End' });
            vi.spyOn(keyEvent, 'preventDefault').mockImplementation(() => {});

            // Mock the onEndKey method to prevent rootmenu access errors
            vi.spyOn(contextMenuInstance, 'onEndKey').mockImplementation(() => {});

            contextMenuInstance.onKeyDown(keyEvent);

            expect(contextMenuInstance.onEndKey).toHaveBeenCalledWith(keyEvent);
        });

        it('should handle tab key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'Tab' });
            vi.spyOn(contextMenuInstance, 'hide').mockImplementation(() => {});

            contextMenuInstance.onKeyDown(keyEvent);

            expect(contextMenuInstance.hide).toHaveBeenCalled();
        });

        it('should handle printable character search', () => {
            const keyEvent = new KeyboardEvent('keydown', { key: 'f' });
            vi.spyOn(contextMenuInstance, 'searchItems').mockImplementation((() => {}) as any);

            contextMenuInstance.onKeyDown(keyEvent);

            expect(contextMenuInstance.searchItems).toHaveBeenCalledWith(keyEvent, 'f');
        });
    });

    describe('CSS Classes and Styling', () => {
        it('should apply styleClass when visible', async () => {
            component.styleClass = 'custom-contextmenu-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            contextMenuInstance.show({ pageX: 10, pageY: 10, stopPropagation: vi.fn(), preventDefault: vi.fn() });
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const containerElement = fixture.debugElement.query(By.css('[data-pc-name="contextmenu"]'));
            expect(containerElement).toBeTruthy();
            expect(containerElement.nativeElement.classList.contains('custom-contextmenu-class')).toBe(true);
            expect(containerElement.nativeElement.classList.contains('p-contextmenu')).toBe(true);
        });

        it('should toggle the mobile class on the root element when the breakpoint query matches', async () => {
            contextMenuInstance.show({ pageX: 10, pageY: 10, stopPropagation: vi.fn(), preventDefault: vi.fn() });
            contextMenuInstance.queryMatches.set(false);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const root = fixture.debugElement.query(By.css('[data-pc-name="contextmenu"]')).nativeElement as HTMLElement;
            expect(root.classList.contains('p-contextmenu-mobile')).toBe(false);

            contextMenuInstance.queryMatches.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(root.classList.contains('p-contextmenu-mobile')).toBe(true);
            // The mobile class belongs on the root only (the theme uses `.p-contextmenu-mobile .p-contextmenu-submenu`).
            expect(fixture.debugElement.queryAll(By.css('.p-contextmenu-item.p-contextmenu-mobile')).length).toBe(0);

            contextMenuInstance.queryMatches.set(false);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(root.classList.contains('p-contextmenu-mobile')).toBe(false);
        });

        it('should apply custom styles when visible', async () => {
            const styleFixture = TestBed.createComponent(TestStyledContextMenuComponent);
            const styleComponent = styleFixture.componentInstance;
            await styleFixture.whenStable();

            const styledContextMenu = styleFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;
            styledContextMenu.visible.set(true);
            styleFixture.changeDetectorRef.markForCheck();
            await styleFixture.whenStable();

            expect(styleComponent.customStyle).toEqual({
                border: '2px solid #007bff',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            });
        });

        it('should have proper data attributes when visible', async () => {
            contextMenuInstance.visible.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const containerElement = fixture.debugElement.query(By.css('[data-pc-name="contextmenu"]'));
            if (containerElement) {
                expect(containerElement.nativeElement.getAttribute('data-pc-name')).toBe('contextmenu');
                expect(containerElement.nativeElement.getAttribute('data-pc-section')).toBe('root');
            }
        });

        it('should have generated id on container when visible', async () => {
            contextMenuInstance.visible.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const containerElement = fixture.debugElement.query(By.css('[data-pc-name="contextmenu"]'));
            if (containerElement) {
                expect(containerElement.nativeElement.getAttribute('id')).toBeTruthy();
            }
        });
    });

    describe('OnPush rendering', () => {
        const show = async () => {
            contextMenuInstance.show({ pageX: 10, pageY: 10, stopPropagation: vi.fn(), preventDefault: vi.fn() });
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
        };

        const rerender = async () => {
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
        };

        it('should re-render the root class when styleClass changes', async () => {
            await show();
            const root = fixture.debugElement.query(By.css('.p-contextmenu')).nativeElement as HTMLElement;
            expect(root.classList.contains('first-class')).toBe(false);

            component.styleClass = 'first-class';
            await rerender();
            expect(root.classList.contains('first-class')).toBe(true);

            component.styleClass = 'second-class';
            await rerender();
            expect(root.classList.contains('first-class')).toBe(false);
            expect(root.classList.contains('second-class')).toBe(true);
        });

        it('should re-render the inline style when style changes', async () => {
            await show();
            const root = fixture.debugElement.query(By.css('.p-contextmenu')).nativeElement as HTMLElement;

            component.style = { color: 'red' };
            await rerender();
            expect(root.style.color).toBe('red');

            component.style = { color: 'blue' };
            await rerender();
            expect(root.style.color).toBe('blue');
        });

        it('should re-render the aria attributes of the root list when ariaLabel and ariaLabelledBy change', async () => {
            await show();
            const list = fixture.debugElement.query(By.css('.p-contextmenu-root-list')).nativeElement as HTMLElement;
            expect(list.getAttribute('aria-label')).toBeNull();

            component.ariaLabel = 'Actions';
            component.ariaLabelledBy = 'actions-title';
            await rerender();
            expect(list.getAttribute('aria-label')).toBe('Actions');
            expect(list.getAttribute('aria-labelledby')).toBe('actions-title');
        });

        it('should re-render the items when model changes', async () => {
            await show();
            expect(fixture.debugElement.queryAll(By.css('[role="menuitem"]')).length).toBe(3);
            expect(fixture.debugElement.queryAll(By.css('[role="separator"]')).length).toBe(1);

            component.model = [{ label: 'Only' }];
            await rerender();
            const items = fixture.debugElement.queryAll(By.css('[role="menuitem"]'));
            expect(items.length).toBe(1);
            expect(items[0].nativeElement.textContent.trim()).toBe('Only');
            expect(fixture.debugElement.queryAll(By.css('[role="separator"]')).length).toBe(0);
        });

        it('should render the generated id on the container and the root list', async () => {
            await show();
            const root = fixture.debugElement.query(By.css('.p-contextmenu')).nativeElement as HTMLElement;
            const list = fixture.debugElement.query(By.css('.p-contextmenu-root-list')).nativeElement as HTMLElement;

            expect(root.getAttribute('id')).toBe(contextMenuInstance._id());
            expect(list.getAttribute('id')).toBe(`${contextMenuInstance._id()}_list`);
            expect(fixture.debugElement.queryAll(By.css('[role="menuitem"]'))[0].nativeElement.getAttribute('id')).toBe(`${contextMenuInstance._id()}_0`);
        });

        it('should reflect the focused item through aria-activedescendant', async () => {
            await show();
            const list = fixture.debugElement.query(By.css('.p-contextmenu-root-list')).nativeElement as HTMLElement;

            contextMenuInstance.onMenuFocus(new FocusEvent('focus'));
            contextMenuInstance.focusedItemInfo.set({ index: 1, level: 0, parentKey: '', item: null });
            await rerender();
            expect(contextMenuInstance.focusedItemId()).toBe(`${contextMenuInstance._id()}_1`);
            expect(list.getAttribute('aria-activedescendant')).toBe(`${contextMenuInstance._id()}_1`);
            expect(fixture.debugElement.queryAll(By.css('[role="menuitem"]'))[1].nativeElement.getAttribute('data-p-focused')).toBe('true');

            contextMenuInstance.onMenuBlur(new FocusEvent('blur'));
            await rerender();
            expect(list.getAttribute('aria-activedescendant')).toBeNull();
        });

        it('should remove the overlay from the DOM after hide', async () => {
            await show();
            expect(fixture.debugElement.query(By.css('.p-contextmenu'))).toBeTruthy();

            contextMenuInstance.hide();
            contextMenuInstance.onAfterLeave();
            await rerender();
            expect(contextMenuInstance.render()).toBe(false);
            expect(fixture.debugElement.query(By.css('.p-contextmenu'))).toBeNull();
        });
    });

    describe('Accessibility Tests', () => {
        it('should have proper ARIA attributes', async () => {
            component.ariaLabel = 'Context menu';
            component.ariaLabelledBy = 'menu-title';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(contextMenuInstance.ariaLabel()).toBe('Context menu');
            expect(contextMenuInstance.ariaLabelledBy()).toBe('menu-title');
        });

        it('should handle focus and blur events', () => {
            const focusEvent = new FocusEvent('focus');
            const blurEvent = new FocusEvent('blur');

            contextMenuInstance.onMenuFocus(focusEvent);
            expect(contextMenuInstance.focused()).toBe(true);

            contextMenuInstance.onMenuBlur(blurEvent);
            expect(contextMenuInstance.focused()).toBe(false);
            expect(contextMenuInstance.searchValue()).toBe('');
        });

        it('should have proper tabindex when not disabled', async () => {
            contextMenuInstance.visible.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Check that tabindex is handled correctly in template
            expect(contextMenuInstance.visible()).toBe(true);
        });

        it('should not let the aria-hidden item icon take focus (optimus-ui#323)', async () => {
            contextMenuInstance.show({ pageX: 100, pageY: 150, stopPropagation: vi.fn(), preventDefault: vi.fn() });
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const icon = document.querySelector('.p-contextmenu-item-icon') as HTMLElement;
            expect(icon).toBeTruthy();
            expect(icon.getAttribute('aria-hidden')).toBe('true');

            icon.focus();
            expect(document.activeElement).not.toBe(icon);
        });

        it('should update focused item info correctly', () => {
            const focusedItemInfo = { index: 1, level: 0, parentKey: '', item: null };

            contextMenuInstance.focusedItemInfo.set(focusedItemInfo);

            expect(contextMenuInstance.focusedItemInfo()).toEqual(focusedItemInfo);
        });

        it('should handle role attributes correctly', async () => {
            contextMenuInstance.visible.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Menu should have role="menu" attributes in template
            expect(contextMenuInstance.visible()).toBe(true);
        });
    });

    describe('Escape with only disabled items', () => {
        it('should hide without throwing when no item can be focused', async () => {
            component.model = [
                { label: 'Copy', disabled: true },
                { label: 'Paste', disabled: true }
            ];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            contextMenuInstance.visible.set(true);
            await fixture.whenStable();

            const escape = new KeyboardEvent('keydown', { code: 'Escape' });
            expect(() => contextMenuInstance.onEscapeKey(escape)).not.toThrow();
            expect(contextMenuInstance.visible()).toBe(false);
            expect(contextMenuInstance.focusedItemInfo().item).toBeUndefined();
        });
    });

    describe('Positioning Tests', () => {
        it('should position menu correctly', async () => {
            // First show the menu to make rootmenu available
            contextMenuInstance.visible.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Set page coordinates
            contextMenuInstance.pageX.set(100);
            contextMenuInstance.pageY.set(150);

            // Position should not throw when menu is visible
            expect(() => contextMenuInstance.position()).not.toThrow();
        });

        it('should handle viewport boundaries', async () => {
            // First show the menu
            contextMenuInstance.visible.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Set position near edge
            contextMenuInstance.pageX.set(window.innerWidth - 50);
            contextMenuInstance.pageY.set(window.innerHeight - 50);

            expect(() => contextMenuInstance.position()).not.toThrow();
        });

        it('should store page coordinates on show', () => {
            const mockEvent = {
                pageX: 250,
                pageY: 300,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn()
            };

            contextMenuInstance.show(mockEvent);

            expect(contextMenuInstance.pageX()).toBe(250);
            expect(contextMenuInstance.pageY()).toBe(300);
        });
    });

    describe('Edge Cases', () => {
        it('should handle null/undefined model', async () => {
            component.model = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(async () => {
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();
            }).not.toThrow();
            expect(contextMenuInstance.model()).toBeUndefined();
        });

        it('should handle empty model array', async () => {
            component.model = [];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(async () => {
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();
            }).not.toThrow();
            expect(contextMenuInstance.model()).toEqual([]);
        });

        it('should handle items without labels', async () => {
            component.model = [{ icon: 'pi pi-file' }];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(async () => {
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();
            }).not.toThrow();
            expect(contextMenuInstance.model()?.[0]?.icon).toBe('pi pi-file');
        });

        it('should handle deeply nested menu items', async () => {
            const deeplyNestedModel = [
                {
                    label: 'Level 1',
                    items: [
                        {
                            label: 'Level 2',
                            items: [
                                {
                                    label: 'Level 3',
                                    items: [{ label: 'Level 4' }]
                                }
                            ]
                        }
                    ]
                }
            ];

            component.model = deeplyNestedModel;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(contextMenuInstance.processedItems().length).toBe(1);
            expect(contextMenuInstance.processedItems()[0].items[0].items[0].items.length).toBe(1);
        });

        it('should handle rapid show/hide calls', () => {
            const mockEvent = {
                pageX: 100,
                pageY: 150,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn()
            };

            expect(() => {
                contextMenuInstance.show(mockEvent);
                contextMenuInstance.hide();
                contextMenuInstance.show(mockEvent);
                contextMenuInstance.hide();
            }).not.toThrow();
        });

        it('should handle component creation and destruction gracefully', async () => {
            await (async () => {
                const tempFixture = TestBed.createComponent(TestBasicContextMenuComponent);
                await tempFixture.whenStable();
                const tempInstance = tempFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;
                expect(tempInstance).toBeTruthy();
                tempFixture.destroy();
            })();
        });

        it('should handle multiple instances independently', async () => {
            const fixture1 = TestBed.createComponent(TestBasicContextMenuComponent);
            const fixture2 = TestBed.createComponent(TestBasicContextMenuComponent);

            fixture1.componentInstance.model = [{ label: 'Menu 1' }];
            fixture1.componentInstance.styleClass = 'menu-1';
            fixture1.changeDetectorRef.markForCheck();
            await fixture1.whenStable();

            fixture2.componentInstance.model = [{ label: 'Menu 2' }];
            fixture2.componentInstance.styleClass = 'menu-2';
            fixture2.changeDetectorRef.markForCheck();
            await fixture2.whenStable();

            const instance1 = fixture1.debugElement.query(By.directive(ContextMenu)).componentInstance;
            const instance2 = fixture2.debugElement.query(By.directive(ContextMenu)).componentInstance;

            expect(instance1.model()?.[0]?.label).toBe('Menu 1');
            expect(instance1.styleClass()).toBe('menu-1');
            expect(instance2.model()?.[0]?.label).toBe('Menu 2');
            expect(instance2.styleClass()).toBe('menu-2');
            expect(instance1).not.toBe(instance2);
        });
    });

    describe('Integration Tests', () => {
        it('should work with router navigation', async () => {
            const routerFixture = TestBed.createComponent(TestRouterContextMenuComponent);
            await routerFixture.whenStable();

            const routerContextMenu = routerFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;

            expect(routerContextMenu.model()[0].routerLink).toBe('/');
            expect(routerContextMenu.model()[1].routerLink).toBe('/products');
            expect(routerContextMenu.model()[2].queryParams).toEqual({ tab: 'overview' });
        });

        it('should mark the router link of the active route', async () => {
            const routerFixture = TestBed.createComponent(TestRouterContextMenuComponent);
            await routerFixture.whenStable();
            await TestBed.inject(Router).navigateByUrl('/products');

            const routerContextMenu = routerFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;
            routerContextMenu.show({ pageX: 10, pageY: 10, stopPropagation: vi.fn(), preventDefault: vi.fn() });
            routerFixture.changeDetectorRef.markForCheck();
            await routerFixture.whenStable();

            const links = routerFixture.debugElement.queryAll(By.css('a.p-contextmenu-item-link'));
            const active = links.filter((l) => l.nativeElement.classList.contains('p-contextmenu-item-link-active'));
            // routerLinkActiveOptions defaults to { exact: false }: '/' is active on /products too
            expect(active.map((l) => l.nativeElement.textContent.trim())).toEqual(['Home', 'Products']);
        });

        it('should work with styled component', async () => {
            const styleFixture = TestBed.createComponent(TestStyledContextMenuComponent);
            await styleFixture.whenStable();

            const styledContextMenu = styleFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;
            expect(styledContextMenu.styleClass()).toBe('custom-contextmenu');
        });

        it('should work with dynamic content changes', async () => {
            const dynamicFixture = TestBed.createComponent(TestDynamicContextMenuComponent);
            const dynamicComponent = dynamicFixture.componentInstance;
            await dynamicFixture.whenStable();

            const dynamicContextMenu = dynamicFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;

            expect(dynamicContextMenu.model().length).toBe(0);

            // Add items dynamically
            dynamicComponent.addItem({ label: 'Dynamic 1', icon: 'pi pi-file' });
            dynamicComponent.addItem({ label: 'Dynamic 2', icon: 'pi pi-edit' });
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();

            expect(dynamicContextMenu.model().length).toBe(2);
            expect(dynamicContextMenu.model()[0].label).toBe('Dynamic 1');

            // Clear items
            dynamicComponent.clearItems();
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();

            expect(dynamicContextMenu.model().length).toBe(0);
            expect(dynamicContextMenu.processedItems()).toEqual([]);
        });

        it('should handle complete workflow with templates', async () => {
            const templateFixture = TestBed.createComponent(TestItemTemplateContextMenuComponent);
            await templateFixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 100));

            const templateContextMenu = templateFixture.debugElement.query(By.directive(ContextMenu)).componentInstance;

            expect(templateContextMenu.itemTemplate()).toBeTruthy();
            expect(templateContextMenu.model()).toBeTruthy();
            expect(templateContextMenu.model().length).toBeGreaterThan(0);
        });

        it('should maintain state across property changes', async () => {
            component.model = [{ label: 'Initial' }];
            component.styleClass = 'initial-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(contextMenuInstance.model()?.[0]?.label).toBe('Initial');
            expect(contextMenuInstance.styleClass()).toBe('initial-class');

            component.model = [{ label: 'Updated' }];
            component.styleClass = 'updated-class';
            component.autoZIndex = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(contextMenuInstance.model()?.[0]?.label).toBe('Updated');
            expect(contextMenuInstance.styleClass()).toBe('updated-class');
            expect(contextMenuInstance.autoZIndex()).toBe(false);
        });
    });

    describe('Public Methods', () => {
        it('should have show method', () => {
            expect(typeof contextMenuInstance.show).toBe('function');
        });

        it('should have hide method', () => {
            expect(typeof contextMenuInstance.hide).toBe('function');
        });

        it('should have toggle method', () => {
            expect(typeof contextMenuInstance.toggle).toBe('function');
        });

        it('should call show method programmatically', () => {
            vi.spyOn(contextMenuInstance.onShow, 'emit').mockImplementation(() => {});

            const mockEvent = {
                pageX: 200,
                pageY: 250,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn()
            };

            contextMenuInstance.show(mockEvent);

            expect(contextMenuInstance.visible()).toBe(true);
            expect(contextMenuInstance.onShow.emit).toHaveBeenCalled();
        });

        it('should call hide method programmatically', () => {
            vi.spyOn(contextMenuInstance.onHide, 'emit').mockImplementation(() => {});
            contextMenuInstance.visible.set(true);

            contextMenuInstance.hide();

            expect(contextMenuInstance.visible()).toBe(false);
            expect(contextMenuInstance.onHide.emit).toHaveBeenCalled();
        });

        it('should call toggle method programmatically', () => {
            const mockEvent = {
                pageX: 150,
                pageY: 200,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn()
            };

            expect(contextMenuInstance.visible()).toBe(false);

            contextMenuInstance.toggle(mockEvent);
            expect(contextMenuInstance.visible()).toBe(true);

            contextMenuInstance.toggle();
            expect(contextMenuInstance.visible()).toBe(false);
        });

        it('should have ngOnInit method', () => {
            expect(typeof contextMenuInstance.ngOnInit).toBe('function');
        });

        it('should call ngOnInit programmatically', () => {
            expect(() => contextMenuInstance.ngOnInit()).not.toThrow();
        });

        it('should have ngOnDestroy method', () => {
            expect(typeof contextMenuInstance.ngOnDestroy).toBe('function');
        });

        it('should call ngOnDestroy programmatically', () => {
            expect(() => contextMenuInstance.ngOnDestroy()).not.toThrow();
        });

        it('should have utility methods', () => {
            expect(typeof contextMenuInstance.isItemDisabled).toBe('function');
            expect(typeof contextMenuInstance.isItemSeparator).toBe('function');
            expect(typeof contextMenuInstance.getItemProp).toBe('function');
            expect(typeof contextMenuInstance.getItemLabel).toBe('function');
        });

        it('should handle item property retrieval', () => {
            const testItem = { label: 'Test Item', disabled: true, separator: false };
            const separatorItem = { separator: true };

            expect(contextMenuInstance.getItemLabel(testItem)).toBe('Test Item');
            expect(contextMenuInstance.isItemDisabled(testItem)).toBe(true);
            expect(contextMenuInstance.isItemSeparator(testItem)).toBe(false);
            expect(contextMenuInstance.isItemSeparator(separatorItem)).toBe(true);
        });
    });

    describe('PassThrough', () => {
        let ptFixture: ComponentFixture<any>;

        afterEach(() => {
            TestBed.resetTestingModule();
        });

        describe('Case 1: Basic PT - Root and RootList', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: true,
                imports: [ContextMenu],
                template: `<p-contextmenu #cm [model]="model" [pt]="pt" [global]="true"></p-contextmenu>`
            })
            class PTStringTestComponent {
                readonly contextMenu = viewChild.required<ContextMenu>('cm');
                model: MenuItem[] = [
                    {
                        label: 'File',
                        items: [{ label: 'New' }, { label: 'Open' }]
                    },
                    { separator: true },
                    { label: 'Edit', icon: 'pi pi-pencil' }
                ];
                pt = {
                    root: 'ROOT_CLASS',
                    rootList: 'ROOT_LIST_CLASS',
                    submenu: 'SUBMENU_CLASS',
                    item: 'ITEM_CLASS',
                    itemContent: 'ITEM_CONTENT_CLASS',
                    itemLink: 'ITEM_LINK_CLASS',
                    itemIcon: 'ITEM_ICON_CLASS',
                    itemLabel: 'ITEM_LABEL_CLASS',
                    submenuIcon: 'SUBMENU_ICON_CLASS',
                    separator: 'SEPARATOR_CLASS'
                };
            }

            beforeEach(async () => {
                TestBed.resetTestingModule();
                ptFixture = TestBed.configureTestingModule({
                    imports: [PTStringTestComponent],
                    providers: [provideZonelessChangeDetection()]
                }).createComponent(PTStringTestComponent);
                await ptFixture.whenStable();

                // Trigger context menu to show
                const event = new MouseEvent('contextmenu', { bubbles: true });
                document.dispatchEvent(event);
                ptFixture.changeDetectorRef.markForCheck();
                await ptFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 300));
            });

            it('should apply PT string class to root', () => {
                const root = ptFixture.debugElement.query(By.css('.p-contextmenu'));
                expect(root).toBeTruthy();
                expect(root.nativeElement.classList.contains('ROOT_CLASS')).toBe(true);
            });
        });

        describe('Case 2: PT with Objects - Root only', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: true,
                imports: [ContextMenu],
                template: `<p-contextmenu #cm [model]="model" [pt]="pt" [global]="true"></p-contextmenu>`
            })
            class PTObjectTestComponent {
                readonly contextMenu = viewChild.required<ContextMenu>('cm');
                model: MenuItem[] = [
                    {
                        label: 'File',
                        icon: 'pi pi-file',
                        items: [{ label: 'New' }]
                    }
                ];
                pt = {
                    root: {
                        class: 'ROOT_OBJECT_CLASS',
                        style: { 'background-color': 'red' },
                        'data-p-test': 'true',
                        'aria-label': 'TEST_ROOT_ARIA_LABEL'
                    },
                    item: {
                        class: 'ITEM_OBJECT_CLASS',
                        'data-p-custom': 'item-data'
                    },
                    itemLabel: {
                        style: { color: 'blue' },
                        'aria-label': 'TEST_LABEL_ARIA'
                    },
                    itemIcon: {
                        class: 'ICON_OBJECT_CLASS'
                    }
                };
            }

            beforeEach(async () => {
                TestBed.resetTestingModule();
                ptFixture = TestBed.configureTestingModule({
                    imports: [PTObjectTestComponent],
                    providers: [provideZonelessChangeDetection()]
                }).createComponent(PTObjectTestComponent);
                await ptFixture.whenStable();

                // Trigger context menu to show
                const event = new MouseEvent('contextmenu', { bubbles: true });
                document.dispatchEvent(event);
                ptFixture.changeDetectorRef.markForCheck();
                await ptFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 300));
            });

            it('should apply PT object class to root', () => {
                const root = ptFixture.debugElement.query(By.css('.p-contextmenu'));
                expect(root.nativeElement.classList.contains('ROOT_OBJECT_CLASS')).toBe(true);
            });

            it('should apply PT object style to root', () => {
                const root = ptFixture.debugElement.query(By.css('.p-contextmenu'));
                expect(root.nativeElement.style.backgroundColor).toBe('red');
            });

            it('should apply PT object data attribute to root', () => {
                const root = ptFixture.debugElement.query(By.css('.p-contextmenu'));
                expect(root.nativeElement.getAttribute('data-p-test')).toBe('true');
            });

            it('should apply PT object aria-label to root', () => {
                const root = ptFixture.debugElement.query(By.css('.p-contextmenu'));
                expect(root).toBeTruthy();
                expect(root.nativeElement.getAttribute('aria-label')).toBe('TEST_ROOT_ARIA_LABEL');
            });
        });

        describe('Case 3: PT Mixed - Root only', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: true,
                imports: [ContextMenu],
                template: `<p-contextmenu #cm [model]="model" [pt]="pt" [global]="true"></p-contextmenu>`
            })
            class PTMixedTestComponent {
                readonly contextMenu = viewChild.required<ContextMenu>('cm');
                model: MenuItem[] = [
                    {
                        label: 'File',
                        items: [{ label: 'New' }]
                    }
                ];
                pt = {
                    root: {
                        class: 'ROOT_MIXED_CLASS'
                    },
                    rootList: 'ROOT_LIST_STRING',
                    item: {
                        class: 'ITEM_MIXED_CLASS',
                        style: 'padding: 10px'
                    },
                    itemLabel: 'LABEL_STRING_CLASS'
                };
            }

            beforeEach(async () => {
                TestBed.resetTestingModule();
                ptFixture = TestBed.configureTestingModule({
                    imports: [PTMixedTestComponent],
                    providers: [provideZonelessChangeDetection()]
                }).createComponent(PTMixedTestComponent);
                await ptFixture.whenStable();

                // Trigger context menu to show
                const event = new MouseEvent('contextmenu', { bubbles: true });
                document.dispatchEvent(event);
                ptFixture.changeDetectorRef.markForCheck();
                await ptFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 300));
            });

            it('should apply PT mixed object class to root', () => {
                const root = ptFixture.debugElement.query(By.css('.p-contextmenu'));
                expect(root).toBeTruthy();
                expect(root.nativeElement.classList.contains('ROOT_MIXED_CLASS')).toBe(true);
            });
        });

        describe('Case 4: ContextMenuSub getPTOptions - Basic String PT Test', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: true,
                imports: [ContextMenu],
                template: `<p-contextmenu #cm [model]="model" [pt]="pt" [global]="true"></p-contextmenu>`
            })
            class PTBasicStringTestComponent {
                readonly contextMenu = viewChild.required<ContextMenu>('cm');
                model: MenuItem[] = [
                    { label: 'Item 1', icon: 'pi pi-file' },
                    { label: 'Item 2', icon: 'pi pi-pencil', disabled: true }
                ];
                pt = {
                    item: 'custom-item-class',
                    itemContent: 'custom-content-class',
                    itemLink: 'custom-link-class',
                    itemIcon: 'custom-icon-class',
                    itemLabel: 'custom-label-class'
                };
            }

            beforeEach(async () => {
                TestBed.resetTestingModule();
                ptFixture = TestBed.configureTestingModule({
                    imports: [PTBasicStringTestComponent],
                    providers: [provideZonelessChangeDetection()]
                }).createComponent(PTBasicStringTestComponent);
                await ptFixture.whenStable();

                // Trigger context menu to show
                const event = new MouseEvent('contextmenu', { bubbles: true });
                document.dispatchEvent(event);
                ptFixture.changeDetectorRef.markForCheck();
                await ptFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 300));
            });

            it('should apply string PT class to item elements', () => {
                const items = ptFixture.debugElement.queryAll(By.css('[role="menuitem"]'));
                expect(items.length).toBeGreaterThan(0);
                expect(items[0].nativeElement.classList.contains('custom-item-class')).toBe(true);
            });

            it('should apply string PT class to itemContent elements', () => {
                const contents = ptFixture.debugElement.queryAll(By.css('.p-contextmenu-item-content'));
                expect(contents.length).toBeGreaterThan(0);
                expect(contents[0].nativeElement.classList.contains('custom-content-class')).toBe(true);
            });

            it('should apply string PT class to itemLink elements', () => {
                const links = ptFixture.debugElement.queryAll(By.css('.p-contextmenu-item-link'));
                expect(links.length).toBeGreaterThan(0);
                expect(links[0].nativeElement.classList.contains('custom-link-class')).toBe(true);
            });

            it('should apply string PT class to itemIcon elements', () => {
                const icons = ptFixture.debugElement.queryAll(By.css('.p-contextmenu-item-icon'));
                expect(icons.length).toBeGreaterThan(0);
                expect(icons[0].nativeElement.classList.contains('custom-icon-class')).toBe(true);
            });

            it('should apply string PT class to itemLabel elements', () => {
                const labels = ptFixture.debugElement.queryAll(By.css('.p-contextmenu-item-label'));
                expect(labels.length).toBeGreaterThan(0);
                expect(labels[0].nativeElement.classList.contains('custom-label-class')).toBe(true);
            });
        });

        describe('Case 5: ContextMenuSub getPTOptions - Object PT with Context', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: true,
                imports: [ContextMenu],
                template: `<p-contextmenu #cm [model]="model" [pt]="pt" [global]="true"></p-contextmenu>`
            })
            class PTObjectContextTestComponent {
                readonly contextMenu = viewChild.required<ContextMenu>('cm');
                model: MenuItem[] = [
                    { label: 'Item 0', icon: 'pi pi-file' },
                    { label: 'Disabled Item', icon: 'pi pi-ban', disabled: true },
                    {
                        label: 'Parent Item',
                        icon: 'pi pi-folder',
                        items: [{ label: 'Child 1' }]
                    }
                ];

                pt = {
                    item: {
                        class: 'custom-item-pt',
                        'data-pt-test': 'item'
                    },
                    itemContent: {
                        class: 'custom-content-pt',
                        'data-pt-test': 'content'
                    },
                    itemLink: {
                        class: 'custom-link-pt',
                        'data-pt-test': 'link'
                    },
                    itemIcon: {
                        class: 'custom-icon-pt',
                        'data-pt-test': 'icon'
                    },
                    itemLabel: {
                        class: 'custom-label-pt',
                        'data-pt-test': 'label'
                    },
                    submenuIcon: {
                        class: 'custom-submenu-icon-pt',
                        'data-pt-test': 'submenuicon'
                    }
                };
            }

            beforeEach(async () => {
                TestBed.resetTestingModule();
                ptFixture = TestBed.configureTestingModule({
                    imports: [PTObjectContextTestComponent],
                    providers: [provideZonelessChangeDetection()]
                }).createComponent(PTObjectContextTestComponent);
                await ptFixture.whenStable();

                // Trigger context menu to show
                const event = new MouseEvent('contextmenu', { bubbles: true });
                document.dispatchEvent(event);
                ptFixture.changeDetectorRef.markForCheck();
                await ptFixture.whenStable();
                await new Promise((resolve) => setTimeout(resolve, 300));
            });

            it('should apply PT object to all item elements', () => {
                const items = ptFixture.debugElement.queryAll(By.css('[role="menuitem"]'));
                expect(items.length).toBeGreaterThan(0);

                items.forEach((item) => {
                    expect(item.nativeElement.classList.contains('custom-item-pt')).toBe(true);
                    expect(item.nativeElement.getAttribute('data-pt-test')).toBe('item');
                });
            });

            it('should apply PT object to all itemContent elements', () => {
                const contents = ptFixture.debugElement.queryAll(By.css('.p-contextmenu-item-content'));
                expect(contents.length).toBeGreaterThan(0);

                contents.forEach((content) => {
                    expect(content.nativeElement.classList.contains('custom-content-pt')).toBe(true);
                    expect(content.nativeElement.getAttribute('data-pt-test')).toBe('content');
                });
            });

            it('should apply PT object to all itemLink elements', () => {
                const links = ptFixture.debugElement.queryAll(By.css('.p-contextmenu-item-link'));
                expect(links.length).toBeGreaterThan(0);

                links.forEach((link) => {
                    expect(link.nativeElement.classList.contains('custom-link-pt')).toBe(true);
                    expect(link.nativeElement.getAttribute('data-pt-test')).toBe('link');
                });
            });

            it('should apply PT object to all itemIcon elements', () => {
                const icons = ptFixture.debugElement.queryAll(By.css('.p-contextmenu-item-icon'));
                expect(icons.length).toBeGreaterThan(0);

                icons.forEach((icon) => {
                    expect(icon.nativeElement.classList.contains('custom-icon-pt')).toBe(true);
                    expect(icon.nativeElement.getAttribute('data-pt-test')).toBe('icon');
                });
            });

            it('should apply PT object to all itemLabel elements', () => {
                const labels = ptFixture.debugElement.queryAll(By.css('.p-contextmenu-item-label'));
                expect(labels.length).toBeGreaterThan(0);

                labels.forEach((label) => {
                    expect(label.nativeElement.classList.contains('custom-label-pt')).toBe(true);
                    expect(label.nativeElement.getAttribute('data-pt-test')).toBe('label');
                });
            });

            it('should apply PT object to submenuIcon elements for items with children', () => {
                const submenuIcons = ptFixture.debugElement.queryAll(By.css('.p-contextmenu-submenu-icon'));

                if (submenuIcons.length > 0) {
                    submenuIcons.forEach((icon) => {
                        expect(icon.nativeElement.classList.contains('custom-submenu-icon-pt')).toBe(true);
                        expect(icon.nativeElement.getAttribute('data-pt-test')).toBe('submenuicon');
                    });
                }
            });
        });
    });
});

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [ContextMenu, SharedModule],
    template: ` <p-contextmenu [model]="model"> </p-contextmenu> `
})
class ContextMenuQueryApiHostComponent {
    model = [{ label: 'a' }];
}

describe('ContextMenu Signal Query API', () => {
    it('should resolve its signal-based view/content queries', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [ContextMenuQueryApiHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(ContextMenuQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const instance = fixture.debugElement.query(By.directive(ContextMenu)).componentInstance;

        expect(() => instance.rootmenu()?.sublistViewChild()).not.toThrow();
    });
});

describe('ContextMenuSub', () => {
    let fixture: ComponentFixture<ContextMenuSub>;
    let instance: ContextMenuSub;
    let contextMenu: { handleSubmenuAfterLeave: ReturnType<typeof signal<(() => void) | null>> };

    beforeEach(async () => {
        contextMenu = { handleSubmenuAfterLeave: signal<(() => void) | null>(null) };
        await TestBed.configureTestingModule({
            imports: [ContextMenuSub],
            providers: [provideZonelessChangeDetection(), { provide: ContextMenu, useValue: contextMenu }]
        }).compileComponents();

        fixture = TestBed.createComponent(ContextMenuSub);
        instance = fixture.componentInstance;
        fixture.componentRef.setInput('items', []);
        fixture.componentRef.setInput('visible', true);
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(instance).toBeTruthy();
    });

    describe('submenu position', () => {
        let parentItem: HTMLLIElement;
        let sublist: HTMLUListElement;

        const createSubmenu = (top: number, height: number) => {
            parentItem = document.createElement('li');
            parentItem.style.cssText = `position: fixed; top: ${top}px; left: 10px; width: 100px;`;
            const content = document.createElement('div');
            content.style.height = '30px';
            const host = document.createElement('div');
            sublist = document.createElement('ul');
            sublist.style.cssText = `position: absolute; margin: 0; width: 100px; height: ${height}px;`;
            host.appendChild(sublist);
            parentItem.append(content, host);
            document.body.appendChild(parentItem);
        };

        afterEach(() => parentItem.remove());

        it('should open the submenu downwards when it fits in the viewport', () => {
            createSubmenu(10, 100);
            instance.position(sublist);
            expect(sublist.style.top).toBe('0px');
        });

        it('should move the submenu up when it would overflow the bottom of the viewport', () => {
            createSubmenu(window.innerHeight - 40, 200);
            instance.position(sublist);
            expect(sublist.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight);
            expect(sublist.getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
        });
    });

    it('should have default input values', () => {
        expect(instance.root()).toBe(false);
        expect(instance.level()).toBe(0);
        expect(instance.tabindex()).toBe(0);
        expect(instance.itemTemplate()).toBeUndefined();
        expect(instance.menuId()).toBeUndefined();
        expect(instance.focusedItemId()).toBeUndefined();
        expect(instance.activeItemPath()).toBeUndefined();
    });

    it('should render the list while visible and keep it rendered until the leave animation ends', async () => {
        expect(instance.render()).toBe(true);
        expect(fixture.debugElement.query(By.css('ul'))).toBeTruthy();

        fixture.componentRef.setInput('visible', false);
        await fixture.whenStable();
        expect(instance.render()).toBe(true);
        expect(fixture.debugElement.query(By.css('ul'))).toBeTruthy();

        instance.onAfterLeave();
        await fixture.whenStable();
        expect(instance.render()).toBe(false);
        expect(fixture.debugElement.query(By.css('ul'))).toBeNull();

        fixture.componentRef.setInput('visible', true);
        await fixture.whenStable();
        expect(instance.render()).toBe(true);
        expect(fixture.debugElement.query(By.css('ul'))).toBeTruthy();
    });

    it('should render the root list regardless of visible', async () => {
        fixture.componentRef.setInput('visible', false);
        await fixture.whenStable();
        instance.onAfterLeave();
        await fixture.whenStable();
        expect(instance.render()).toBe(false);

        fixture.componentRef.setInput('root', true);
        await fixture.whenStable();
        expect(instance.render()).toBe(true);
        expect(fixture.debugElement.query(By.css('ul')).nativeElement.classList.contains('p-contextmenu-root-list')).toBe(true);
    });

    it('should register itself on the parent and close its root list when the parent overlay leaves', () => {
        const handleSubmenuAfterLeave = contextMenu.handleSubmenuAfterLeave();
        expect(handleSubmenuAfterLeave).toBeTruthy();

        handleSubmenuAfterLeave!();
        expect(instance.render()).toBe(true);

        fixture.componentRef.setInput('root', true);
        handleSubmenuAfterLeave!();
        expect(instance.render()).toBe(false);
    });

    it('should re-render list attributes when menuId, tabindex and ariaLabel change', async () => {
        const listEl: HTMLElement = fixture.debugElement.query(By.css('ul')).nativeElement;

        fixture.componentRef.setInput('menuId', 'cm');
        fixture.componentRef.setInput('tabindex', 2);
        fixture.componentRef.setInput('ariaLabel', 'Sub menu');
        fixture.componentRef.setInput('ariaLabelledBy', 'sub-title');
        fixture.componentRef.setInput('focusedItemId', 'cm_1');
        await fixture.whenStable();

        expect(listEl.getAttribute('id')).toBe('cm_list');
        expect(listEl.getAttribute('tabindex')).toBe('2');
        expect(listEl.getAttribute('aria-label')).toBe('Sub menu');
        expect(listEl.getAttribute('aria-labelledby')).toBe('sub-title');
        expect(listEl.getAttribute('aria-activedescendant')).toBe('cm_1');
    });

    it('should render items from the items input and reflect activeItemPath, focusedItemId and level', async () => {
        const items = [
            { key: '0', item: { label: 'First' }, items: [] },
            { key: '1', item: { separator: true }, items: [] },
            { key: '2', item: { label: 'Second', disabled: true }, items: [] }
        ];
        fixture.componentRef.setInput('menuId', 'cm');
        fixture.componentRef.setInput('items', items);
        fixture.componentRef.setInput('level', 1);
        await fixture.whenStable();

        let menuItems = fixture.debugElement.queryAll(By.css('[role="menuitem"]'));
        expect(menuItems.length).toBe(2);
        expect(fixture.debugElement.queryAll(By.css('[role="separator"]')).length).toBe(1);
        expect(menuItems[0].nativeElement.getAttribute('id')).toBe('cm_0');
        expect(menuItems[0].nativeElement.getAttribute('aria-level')).toBe('2');
        expect(menuItems[0].nativeElement.getAttribute('aria-setsize')).toBe('2');
        expect(menuItems[1].nativeElement.getAttribute('aria-posinset')).toBe('2');
        expect(menuItems[1].nativeElement.getAttribute('data-p-disabled')).toBe('true');
        expect(instance.isItemActive(items[0])).toBeUndefined();

        fixture.componentRef.setInput('activeItemPath', [{ key: '0' }]);
        fixture.componentRef.setInput('focusedItemId', 'cm_2');
        await fixture.whenStable();
        menuItems = fixture.debugElement.queryAll(By.css('[role="menuitem"]'));
        expect(instance.isItemActive(items[0])).toBe(true);
        expect(instance.isItemFocused(items[2])).toBe(true);
        expect(menuItems[0].nativeElement.getAttribute('data-p-highlight')).toBe('true');
        expect(menuItems[1].nativeElement.getAttribute('data-p-focused')).toBe('true');

        fixture.componentRef.setInput('items', [items[0]]);
        await fixture.whenStable();
        expect(fixture.debugElement.queryAll(By.css('[role="menuitem"]')).length).toBe(1);
    });

    it('should emit itemMouseEnter when onItemMouseEnter is called', () => {
        vi.spyOn(instance.itemMouseEnter, 'emit');
        const event = new MouseEvent('mouseenter');
        const processedItem = { item: { label: 'Item' } };

        instance.onItemMouseEnter({ event, processedItem });

        expect(instance.itemMouseEnter.emit).toHaveBeenCalledWith({ originalEvent: event, processedItem });
    });

    it('should emit itemClick when onItemClick is called', () => {
        vi.spyOn(instance.itemClick, 'emit');
        const event = new MouseEvent('click');
        const processedItem = { item: { label: 'Item' } };

        instance.onItemClick(event, processedItem);

        expect(instance.itemClick.emit).toHaveBeenCalledWith({ originalEvent: event, processedItem, isFocus: true });
    });

    it('should emit menuKeydown when the root list receives a keydown event', () => {
        vi.spyOn(instance.menuKeydown, 'emit');
        const listEl: HTMLElement = fixture.debugElement.query(By.css('ul')).nativeElement;
        const keyEvent = new KeyboardEvent('keydown', { code: 'ArrowDown' });

        listEl.dispatchEvent(keyEvent);

        expect(instance.menuKeydown.emit).toHaveBeenCalledWith(keyEvent);
    });

    it('should emit menuFocus when the root list receives a focus event', () => {
        vi.spyOn(instance.menuFocus, 'emit');
        const listEl: HTMLElement = fixture.debugElement.query(By.css('ul')).nativeElement;
        const focusEvent = new FocusEvent('focus');

        listEl.dispatchEvent(focusEvent);

        expect(instance.menuFocus.emit).toHaveBeenCalledWith(focusEvent);
    });

    it('should emit menuBlur when the root list receives a blur event', () => {
        vi.spyOn(instance.menuBlur, 'emit');
        const listEl: HTMLElement = fixture.debugElement.query(By.css('ul')).nativeElement;
        const blurEvent = new FocusEvent('blur');

        listEl.dispatchEvent(blurEvent);

        expect(instance.menuBlur.emit).toHaveBeenCalledWith(blurEvent);
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ContextMenu],
    template: `
        <div #zoneA class="zone-a" style="width: 100px; height: 50px">A</div>
        <div #zoneB class="zone-b" style="width: 100px; height: 50px">B</div>
        <p-contextmenu #menuA [target]="zoneA" [model]="model" triggerEvent="click" />
        <p-contextmenu #menuB [target]="zoneB" [model]="model" triggerEvent="click" />
    `
})
class TestMultipleClickContextMenuComponent {
    model: MenuItem[] = [{ label: 'Action' }];

    menuA = viewChild.required<ContextMenu>('menuA');

    menuB = viewChild.required<ContextMenu>('menuB');
}

describe('ContextMenu with several click-triggered instances (optimus-ui#359)', () => {
    it('should close the open menu when another one is opened', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [TestMultipleClickContextMenuComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(TestMultipleClickContextMenuComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const host = fixture.componentInstance;
        fixture.nativeElement.querySelector('.zone-a').click();
        fixture.detectChanges();
        await fixture.whenStable();
        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(host.menuA().visible()).toBe(true);

        fixture.nativeElement.querySelector('.zone-b').click();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(host.menuB().visible()).toBe(true);
        expect(host.menuA().visible()).toBe(false);
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ContextMenu],
    template: `
        <div #zone class="touch-zone" style="position: absolute; left: 0; top: 0; width: 300px; height: 300px">Zone</div>
        <p-contextmenu #cm [target]="zone" [model]="model" [pressDelay]="10" />
    `
})
class TestTouchContextMenuComponent {
    model: MenuItem[] = [{ label: 'Copy' }, { label: 'Paste' }];

    cm = viewChild.required<ContextMenu>('cm');
}

describe('ContextMenu long press on touch devices (optimus-ui#932)', () => {
    // Other test files share this document and may remove the component <style> tags at any time:
    // forget which styles were loaded so these layout checks get them injected again.
    beforeEach(() => {
        Theme.clearLoadedStyleNames();
        Base.clearLoadedStyleNames();
    });

    afterEach(() => vi.restoreAllMocks());

    it('opens at the touch point after a long press', async () => {
        vi.spyOn(ContextMenu.prototype, 'isMobile').mockReturnValue(true);
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [TestTouchContextMenuComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(TestTouchContextMenuComponent);
        document.body.appendChild(fixture.nativeElement);
        fixture.detectChanges();
        await fixture.whenStable();

        const zone = fixture.nativeElement.querySelector('.touch-zone') as HTMLElement;
        const touch = new Touch({ identifier: 1, target: zone, clientX: 120, clientY: 80, pageX: 120, pageY: 80 });
        zone.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true, touches: [touch], targetTouches: [touch], changedTouches: [touch] }));
        await new Promise((resolve) => setTimeout(resolve, 50));
        fixture.detectChanges();
        await fixture.whenStable();

        const cm = fixture.componentInstance.cm();
        expect(cm.visible()).toBe(true);
        expect(cm.pageX()).toBe(120);
        expect(cm.pageY()).toBe(80);
        const container = document.querySelector('.p-contextmenu') as HTMLElement;
        expect(container.style.left).toBe('121px');
        expect(container.style.top).toBe('81px');

        cm.hide();
        fixture.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ContextMenu],
    template: `
        <div class="drawer-like" style="position: fixed; left: 100px; top: 200px; width: 400px; height: 300px; transform: translate3d(0px, 0px, 0px)">
            <div #zone class="cm-zone" style="width: 400px; height: 300px">Zone</div>
            <p-contextmenu #cm [target]="zone" [model]="model" />
        </div>
    `
})
class TestContextMenuInTransformedParentComponent {
    model: MenuItem[] = [{ label: 'Copy' }, { label: 'Paste' }];

    cm = viewChild.required<ContextMenu>('cm');
}

describe('ContextMenu inside a positioned or transformed container (optimus-ui#809)', () => {
    // Other test files share this document and may remove the component <style> tags at any time:
    // forget which styles were loaded so these layout checks get them injected again.
    beforeEach(() => {
        Theme.clearLoadedStyleNames();
        Base.clearLoadedStyleNames();
    });

    it('opens at the pointer, not offset by the container position', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [TestContextMenuInTransformedParentComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(TestContextMenuInTransformedParentComponent);
        document.body.appendChild(fixture.nativeElement);
        fixture.detectChanges();
        await fixture.whenStable();

        const zone = fixture.nativeElement.querySelector('.cm-zone') as HTMLElement;
        zone.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 150, clientY: 250 }));
        fixture.detectChanges();
        await fixture.whenStable();
        await new Promise((resolve) => setTimeout(resolve, 50));

        const container = fixture.nativeElement.querySelector('.p-contextmenu') as HTMLElement;
        expect(container).toBeTruthy();
        // offsetLeft/Top ignore the scale of the enter animation
        const parentRect = (container.offsetParent as HTMLElement).getBoundingClientRect();
        expect(Math.round(parentRect.left + container.offsetLeft)).toBe(151);
        expect(Math.round(parentRect.top + container.offsetTop)).toBe(251);

        fixture.componentInstance.cm().hide();
        fixture.nativeElement.remove();
    });
});

describe('ContextMenu long press on an iPad', () => {
    afterEach(() => vi.restoreAllMocks());

    // iPadOS Safari reports the user agent and platform of a desktop Mac, with touch points
    const fakeDevice = (platform: string, maxTouchPoints: number) => {
        vi.spyOn(Navigator.prototype, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15');
        vi.spyOn(Navigator.prototype, 'platform', 'get').mockReturnValue(platform);
        vi.spyOn(Navigator.prototype, 'maxTouchPoints', 'get').mockReturnValue(maxTouchPoints);
    };

    it('opens the menu after a long press', async () => {
        fakeDevice('MacIntel', 5);
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [TestTouchContextMenuComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(TestTouchContextMenuComponent);
        document.body.appendChild(fixture.nativeElement);
        fixture.detectChanges();
        await fixture.whenStable();

        const zone = fixture.nativeElement.querySelector('.touch-zone') as HTMLElement;
        const touch = new Touch({ identifier: 1, target: zone, clientX: 120, clientY: 80, pageX: 120, pageY: 80 });
        zone.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true, touches: [touch], targetTouches: [touch], changedTouches: [touch] }));
        await new Promise((resolve) => setTimeout(resolve, 50));
        fixture.detectChanges();
        await fixture.whenStable();

        const cm = fixture.componentInstance.cm();
        expect(cm.isMobile()).toBe(true);
        expect(cm.visible()).toBe(true);

        cm.hide();
        fixture.nativeElement.remove();
    });

    it('still treats a Mac without touch as a desktop', () => {
        fakeDevice('MacIntel', 0);
        expect(isIOS()).toBe(false);
    });
});
