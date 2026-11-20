import { ChangeDetectionStrategy, Component, DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RouterTestingModule } from '@angular/router/testing';
import { MenuItem, SharedModule } from '@exhaustive-ui/core/api';
import { Menubar, MenubarSub } from './menubar';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-menubar
            [model]="model"
            [class]="styleClass"
            [autoDisplay]="autoDisplay"
            [autoHide]="autoHide"
            [autoHideDelay]="autoHideDelay"
            [breakpoint]="breakpoint"
            [id]="id"
            [ariaLabel]="ariaLabel"
            [ariaLabelledBy]="ariaLabelledBy"
            (onFocus)="onFocus($event)"
            (onBlur)="onBlur($event)"
        >
        </p-menubar>
    `
})
class TestBasicMenubarComponent {
    model: MenuItem[] | undefined = [{ label: 'File', icon: 'pi pi-file' }, { label: 'Edit', icon: 'pi pi-pencil' }, { separator: true }, { label: 'Settings', icon: 'pi pi-cog' }];
    styleClass: string | undefined;
    autoDisplay: boolean | undefined = true;
    autoHide: boolean | undefined;
    autoHideDelay: number = 100;
    breakpoint: string = '960px';
    id: string | undefined;
    ariaLabel: string | undefined;
    ariaLabelledBy: string | undefined;

    focusEvent: any;
    blurEvent: any;

    onFocus(event: any) {
        this.focusEvent = event;
    }

    onBlur(event: any) {
        this.blurEvent = event;
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-nested-menubar',
    template: ` <p-menubar [model]="nestedModel"> </p-menubar> `
})
class TestNestedMenubarComponent {
    nestedModel: MenuItem[] = [
        {
            label: 'File',
            icon: 'pi pi-file',
            items: [{ label: 'New', icon: 'pi pi-plus' }, { label: 'Open', icon: 'pi pi-folder-open' }, { separator: true }, { label: 'Save', icon: 'pi pi-save' }]
        },
        {
            label: 'Edit',
            icon: 'pi pi-pencil',
            items: [
                { label: 'Copy', icon: 'pi pi-copy' },
                { label: 'Paste', icon: 'pi pi-clone' }
            ]
        }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-router-menubar',
    template: ` <p-menubar [model]="routerModel"> </p-menubar> `
})
class TestRouterMenubarComponent {
    routerModel: MenuItem[] = [
        { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
        { label: 'Products', icon: 'pi pi-box', routerLink: '/products' },
        {
            label: 'Services',
            icon: 'pi pi-briefcase',
            routerLink: ['/services'],
            queryParams: { tab: 'overview' }
        }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-menubar [model]="model">
            <ng-template #start>
                <div class="custom-start">Start Content</div>
            </ng-template>
            <ng-template #end>
                <div class="custom-end">End Content</div>
            </ng-template>
        </p-menubar>
    `
})
class TestTemplateMenubarComponent {
    model: MenuItem[] = [{ label: 'Item 1' }, { label: 'Item 2' }];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-menubar [model]="model">
            <ng-template #item let-item>
                <div class="custom-item">
                    @if (item.icon) {
                        <i [class]="item.icon"></i>
                    }
                    <span class="custom-label">{{ item.label }}</span>
                </div>
            </ng-template>
        </p-menubar>
    `
})
class TestItemTemplateMenubarComponent {
    model: MenuItem[] = [
        { label: 'Custom Item 1', icon: 'pi pi-file' },
        { label: 'Custom Item 2', icon: 'pi pi-pencil' }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-menubar [model]="model">
            <ng-template pTemplate="item" let-item>
                <span class="p-template-item">{{ item.label }}</span>
            </ng-template>
        </p-menubar>
    `
})
class TestPTemplateMenubarComponent {
    model: MenuItem[] = [{ label: 'PTemplate Item 1' }, { label: 'PTemplate Item 2' }];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-menubar [model]="model">
            <ng-template pTemplate="start">
                <span class="p-template-start">Start</span>
            </ng-template>
            <ng-template pTemplate="end">
                <span class="p-template-end">End</span>
            </ng-template>
            <ng-template pTemplate="menuicon">
                <i class="p-template-menuicon"></i>
            </ng-template>
            <ng-template pTemplate="submenuicon">
                <i class="p-template-submenuicon"></i>
            </ng-template>
            <ng-template pTemplate="whatever" let-item>
                <span class="p-template-fallback">{{ item.label }}</span>
            </ng-template>
        </p-menubar>
    `
})
class TestNamedPTemplatesMenubarComponent {
    model: MenuItem[] = [{ label: 'File', items: [{ label: 'New' }] }];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-menubar [model]="model">
            <ng-template #submenuicon>
                <i class="custom-submenu-icon pi pi-angle-down"></i>
            </ng-template>
        </p-menubar>
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
    template: `
        <p-menubar [model]="model">
            <ng-template #menuicon>
                <i class="custom-menu-icon pi pi-bars"></i>
            </ng-template>
        </p-menubar>
    `
})
class TestMenuIconTemplateComponent {
    model: MenuItem[] = [{ label: 'Item 1' }, { label: 'Item 2' }];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-disabled-items',
    template: ` <p-menubar [model]="disabledModel"> </p-menubar> `
})
class TestDisabledItemsComponent {
    disabledModel: MenuItem[] = [{ label: 'Enabled Item' }, { label: 'Disabled Item', disabled: true }, { separator: true }, { label: 'Another Enabled Item' }];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-styled-menubar',
    template: ` <p-menubar [class]="customStyleClass"> </p-menubar> `
})
class TestStyledMenubarComponent {
    customStyleClass = 'custom-menubar-class';
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-minimal-menubar',
    template: `<p-menubar></p-menubar>`
})
class TestMinimalMenubarComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-dynamic-menubar',
    template: ` <p-menubar [model]="dynamicModel"> </p-menubar> `
})
class TestDynamicMenubarComponent {
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
    selector: 'test-command-menubar',
    template: ` <p-menubar [model]="commandModel"> </p-menubar> `
})
class TestCommandMenubarComponent {
    commandExecuted: any;

    commandModel: MenuItem[] = [
        {
            label: 'Command Item',
            icon: 'pi pi-play',
            command: (event) => {
                this.commandExecuted = event;
            }
        }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-autohide-menubar',
    template: ` <p-menubar [model]="model" [autoHide]="autoHide" [autoHideDelay]="autoHideDelay"> </p-menubar> `
})
class TestAutoHideMenubarComponent {
    model: MenuItem[] = [{ label: 'Item 1' }, { label: 'Item 2' }];
    autoHide: boolean = true;
    autoHideDelay: number = 200;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    template: '<div>Target Page</div>'
})
class TestTargetComponent {}

describe('Menubar', () => {
    let component: TestBasicMenubarComponent;
    let fixture: ComponentFixture<TestBasicMenubarComponent>;
    let menubarElement: DebugElement;
    let menubarInstance: Menubar;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                TestBasicMenubarComponent,
                TestNestedMenubarComponent,
                TestRouterMenubarComponent,
                TestTemplateMenubarComponent,
                TestItemTemplateMenubarComponent,
                TestPTemplateMenubarComponent,
                TestNamedPTemplatesMenubarComponent,
                TestSubmenuIconTemplateComponent,
                TestMenuIconTemplateComponent,
                TestDisabledItemsComponent,
                TestStyledMenubarComponent,
                TestMinimalMenubarComponent,
                TestDynamicMenubarComponent,
                TestCommandMenubarComponent,
                TestAutoHideMenubarComponent
            ],
            imports: [
                Menubar,
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

        fixture = TestBed.createComponent(TestBasicMenubarComponent);
        component = fixture.componentInstance;
        menubarElement = fixture.debugElement.query(By.directive(Menubar));
        menubarInstance = menubarElement.componentInstance;
        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create the component', () => {
            expect(menubarInstance).toBeTruthy();
        });

        it('should have required dependencies injected', () => {
            expect(menubarInstance.el).toBeTruthy();
            expect(menubarInstance.renderer).toBeTruthy();
            expect(menubarInstance.cd).toBeTruthy();
            expect(menubarInstance._componentStyle).toBeTruthy();
        });

        it('should have default values', () => {
            const freshFixture = TestBed.createComponent(TestMinimalMenubarComponent);
            freshFixture.detectChanges();

            const freshMenubar = freshFixture.debugElement.query(By.directive(Menubar)).componentInstance;

            expect(freshMenubar.model()).toBeUndefined();
            expect(freshMenubar.autoDisplay()).toBe(true);
            expect(freshMenubar.autoHide()).toBeUndefined();
            expect(freshMenubar.breakpoint()).toBe('960px');
            expect(freshMenubar.autoHideDelay()).toBe(100);
            expect(freshMenubar.id()).toBeUndefined();
            expect(freshMenubar.ariaLabel()).toBeUndefined();
            expect(freshMenubar.ariaLabelledBy()).toBeUndefined();
        });

        it('should accept custom values', async () => {
            const testModel: MenuItem[] = [{ label: 'Test Item' }];
            component.model = testModel;
            component.autoDisplay = false;
            component.autoHide = true;
            component.breakpoint = '768px';
            component.styleClass = 'custom-menubar';
            component.ariaLabel = 'Custom Menu Bar';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(menubarInstance.model()).toBe(testModel);
            expect(menubarInstance.autoDisplay()).toBe(false);
            expect(menubarInstance.autoHide()).toBe(true);
            expect(menubarInstance.breakpoint()).toBe('768px');
            expect(menubarElement.nativeElement.classList.contains('custom-menubar')).toBe(true);
            expect(menubarInstance.ariaLabel()).toBe('Custom Menu Bar');
        });

        it('should initialize with generated id', () => {
            expect(menubarInstance.id()).toBeUndefined();
            expect(menubarInstance._id()).toBeTruthy();
            expect(typeof menubarInstance._id()).toBe('string');
            expect(menubarInstance._id()).toMatch(/^pn_id_/);
        });

        it('should use the provided id over the generated one', async () => {
            component.id = 'custom-menubar-id';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(menubarInstance.id()).toBe('custom-menubar-id');
            expect(menubarInstance._id()).toBe('custom-menubar-id');

            const rootMenu = fixture.debugElement.query(By.css('ul[pMenubarSub]'));
            expect(rootMenu.nativeElement.getAttribute('id')).toBe('custom-menubar-id');
        });

        it('should have onFocus and onBlur output emitters', () => {
            expect(menubarInstance.onFocus).toBeTruthy();
            expect(menubarInstance.onBlur).toBeTruthy();
        });

        it('should initialize signal states', () => {
            expect(typeof menubarInstance.activeItemPath).toBe('function');
            expect(typeof menubarInstance.focusedItemInfo).toBe('function');
            expect(menubarInstance.activeItemPath()).toEqual([]);
            expect(menubarInstance.focusedItemInfo().index).toBe(-1);
            expect(menubarInstance.focused()).toBe(false);
            expect(menubarInstance.dirty()).toBe(false);
            expect(menubarInstance.mobileActive()).toBeUndefined();
            expect(menubarInstance.searchValue()).toBe('');
            expect(menubarInstance.focusedItemId()).toBeNull();
        });
    });

    describe('Input Properties', () => {
        it('should update model input', async () => {
            const newModel = [{ label: 'New Item' }];
            component.model = newModel;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(menubarInstance.model()).toBe(newModel);
            expect(menubarInstance.processedItems()).toBeTruthy();
            expect(menubarInstance.processedItems().length).toBe(1);
            expect(menubarInstance.processedItems()[0].item).toBe(newModel[0]);
        });

        it('should re-render the items when the model changes', async () => {
            expect(fixture.debugElement.queryAll(By.css('li[data-pc-section="item"]')).length).toBe(3);

            component.model = [{ label: 'Only Item' }];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const menuItems = fixture.debugElement.queryAll(By.css('li[data-pc-section="item"]'));
            expect(menuItems.length).toBe(1);
            expect(menuItems[0].nativeElement.textContent).toContain('Only Item');
        });

        it('should update class on the host element', async () => {
            component.styleClass = 'test-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(menubarElement.nativeElement.classList.contains('test-class')).toBe(true);
            expect(menubarElement.nativeElement.classList.contains('p-menubar')).toBe(true);
        });

        it('should update autoDisplay with booleanAttribute transform', async () => {
            component.autoDisplay = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(menubarInstance.autoDisplay()).toBe(false);
            expect(menubarInstance.rootmenu().autoDisplay()).toBe(false);
        });

        it('should update autoHide with booleanAttribute transform', async () => {
            component.autoHide = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(menubarInstance.autoHide()).toBe(true);
        });

        it('should update autoHideDelay with numberAttribute transform', async () => {
            component.autoHideDelay = 300;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(menubarInstance.autoHideDelay()).toBe(300);
        });

        it('should push autoHide and autoHideDelay to the MenubarService', async () => {
            const menubarService = (menubarInstance as any).menubarService;
            expect(menubarService.autoHide).toBe(false);
            expect(menubarService.autoHideDelay).toBe(100);

            component.autoHide = true;
            component.autoHideDelay = 300;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(menubarService.autoHide).toBe(true);
            expect(menubarService.autoHideDelay).toBe(300);
        });

        it('should update breakpoint input', async () => {
            component.breakpoint = '768px';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(menubarInstance.breakpoint()).toBe('768px');
        });

        it('should update ariaLabel and ariaLabelledBy inputs', async () => {
            component.ariaLabel = 'Test Menubar';
            component.ariaLabelledBy = 'menubar-label';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(menubarInstance.ariaLabel()).toBe('Test Menubar');
            expect(menubarInstance.ariaLabelledBy()).toBe('menubar-label');
        });
    });

    describe('Menu Display Tests', () => {
        it('should render menu items', () => {
            const menuItems = fixture.debugElement.queryAll(By.css('li[data-pc-section="item"]'));

            // Should have 3 regular items (excluding separator)
            expect(menuItems.length).toBe(3);
        });

        it('should render separator items', () => {
            const separatorItems = fixture.debugElement.queryAll(By.css('li[data-pc-section="separator"]'));

            expect(separatorItems.length).toBe(1);
        });

        it('should display menu button on mobile', () => {
            menubarInstance.queryMatches.set(true);
            fixture.detectChanges();

            const menuButton = fixture.debugElement.query(By.css('a[data-pc-section="button"]'));
            expect(menuButton).toBeTruthy();
            expect(menubarElement.nativeElement.classList.contains('p-menubar-mobile')).toBe(true);
        });

        it('should toggle mobile menu on button click', () => {
            menubarInstance.queryMatches.set(true);
            fixture.detectChanges();

            const menuButton = fixture.debugElement.query(By.css('a[data-pc-section="button"]'));

            expect(menubarInstance.mobileActive()).toBeFalsy();
            expect(menuButton.nativeElement.getAttribute('aria-expanded')).toBeNull();

            menuButton.nativeElement.click();
            fixture.detectChanges();

            expect(menubarInstance.mobileActive()).toBe(true);
            expect(menuButton.nativeElement.getAttribute('aria-expanded')).toBe('true');
            expect(menubarElement.nativeElement.classList.contains('p-menubar-mobile-active')).toBe(true);
        });

        it('should show and hide menu programmatically', () => {
            menubarInstance.show();

            expect(menubarInstance.focusedItemInfo().index).not.toBe(-1);

            menubarInstance.hide();

            expect(menubarInstance.focusedItemInfo().index).toBe(-1);
            expect(menubarInstance.activeItemPath()).toEqual([]);
        });
    });

    describe('Item Interaction Tests', () => {
        it('should handle item click', () => {
            const firstItem = fixture.debugElement.query(By.css('li[data-pc-section="item"] div[data-pc-section="itemcontent"]'));

            vi.spyOn(menubarInstance, 'onItemClick').mockImplementation(() => {});

            firstItem.nativeElement.click();

            expect(menubarInstance.onItemClick).toHaveBeenCalled();
        });

        it('should execute command on item click', () => {
            const commandFixture = TestBed.createComponent(TestCommandMenubarComponent);
            const commandComponent = commandFixture.componentInstance;
            commandFixture.detectChanges();

            const itemElement = commandFixture.debugElement.query(By.css('li[data-pc-section="item"] div[data-pc-section="itemcontent"]'));
            itemElement.nativeElement.click();

            expect(commandComponent.commandExecuted).toBeDefined();
            expect(commandComponent.commandExecuted.item.label).toBe('Command Item');
        });

        it('should handle mouse enter on item', () => {
            const firstItemContent = fixture.debugElement.query(By.css('li[data-pc-section="item"] div[data-pc-section="itemcontent"]'));

            vi.spyOn(menubarInstance, 'onItemMouseEnter').mockImplementation(() => {});

            // Trigger mouseenter on the content div which has the actual handler
            firstItemContent.triggerEventHandler('mouseenter', new MouseEvent('mouseenter'));

            expect(menubarInstance.onItemMouseEnter).toHaveBeenCalled();
        });

        it('should handle nested menu items', () => {
            const nestedFixture = TestBed.createComponent(TestNestedMenubarComponent);
            nestedFixture.detectChanges();

            const nestedMenubar = nestedFixture.debugElement.query(By.directive(Menubar)).componentInstance;

            expect(nestedMenubar.processedItems()[0].items).toBeTruthy();
            expect(nestedMenubar.processedItems()[0].items.length).toBe(4); // 3 items + 1 separator
        });

        it('should highlight the active item and show its submenu when activeItemPath changes', () => {
            const nestedFixture = TestBed.createComponent(TestNestedMenubarComponent);
            nestedFixture.detectChanges();

            const nestedMenubar: Menubar = nestedFixture.debugElement.query(By.directive(Menubar)).componentInstance;
            const fileItem = nestedFixture.debugElement.query(By.css('ul[pMenubarSub] > li[data-pc-section="item"]'));
            const submenu = fileItem.query(By.css('ul[pMenubarSub]'));

            expect(fileItem.nativeElement.getAttribute('data-p-highlight')).toBe('false');
            expect(submenu.nativeElement.style.display).toBe('none');

            nestedMenubar.activeItemPath.set([nestedMenubar.processedItems()[0]]);
            nestedFixture.detectChanges();

            expect(fileItem.nativeElement.getAttribute('data-p-highlight')).toBe('true');
            expect(fileItem.nativeElement.getAttribute('aria-expanded')).toBe('true');
            expect(fileItem.nativeElement.classList.contains('p-menubar-item-active')).toBe(true);
            expect(submenu.nativeElement.style.display).toBe('flex');

            nestedMenubar.hide();
            nestedFixture.detectChanges();

            expect(fileItem.nativeElement.getAttribute('data-p-highlight')).toBe('false');
            expect(submenu.nativeElement.style.display).toBe('none');
        });
    });

    describe('Template Tests', () => {
        it('should handle #start and #end templates', async () => {
            const templateFixture = TestBed.createComponent(TestTemplateMenubarComponent);
            templateFixture.changeDetectorRef.markForCheck();
            await templateFixture.whenStable();

            const startContent = templateFixture.debugElement.query(By.css('.custom-start'));
            const endContent = templateFixture.debugElement.query(By.css('.custom-end'));

            expect(startContent).toBeTruthy();
            expect(startContent.nativeElement.textContent.trim()).toBe('Start Content');
            expect(endContent).toBeTruthy();
            expect(endContent.nativeElement.textContent.trim()).toBe('End Content');
        });

        it('should handle #item template processing', async () => {
            const itemTemplateFixture = TestBed.createComponent(TestItemTemplateMenubarComponent);
            itemTemplateFixture.changeDetectorRef.markForCheck();
            await itemTemplateFixture.whenStable();

            const itemTemplateMenubar = itemTemplateFixture.debugElement.query(By.directive(Menubar)).componentInstance;

            expect(itemTemplateMenubar.itemTemplate()).toBeTruthy();
            expect(itemTemplateMenubar._itemTemplate()).toBeUndefined();
            const customItems = itemTemplateFixture.debugElement.queryAll(By.css('.custom-item'));
            expect(customItems.length).toBe(2);
            expect(customItems[0].nativeElement.textContent).toContain('Custom Item 1');
        });

        it('should handle pTemplate processing', async () => {
            const pTemplateFixture = TestBed.createComponent(TestPTemplateMenubarComponent);
            pTemplateFixture.changeDetectorRef.markForCheck();
            await pTemplateFixture.whenStable();

            const pTemplateMenubar = pTemplateFixture.debugElement.query(By.directive(Menubar)).componentInstance;

            expect(pTemplateMenubar.templates().length).toBe(1);
            expect(pTemplateMenubar.itemTemplate()).toBeUndefined();
            expect(pTemplateMenubar._itemTemplate()).toBeTruthy();
            const pTemplateItems = pTemplateFixture.debugElement.queryAll(By.css('.p-template-item'));
            expect(pTemplateItems.length).toBe(2);
            expect(pTemplateItems[1].nativeElement.textContent).toContain('PTemplate Item 2');
        });

        it('should resolve named pTemplates and fall back to the item template for unknown types', async () => {
            const namedFixture = TestBed.createComponent(TestNamedPTemplatesMenubarComponent);
            namedFixture.changeDetectorRef.markForCheck();
            await namedFixture.whenStable();

            const namedMenubar: Menubar = namedFixture.debugElement.query(By.directive(Menubar)).componentInstance;
            namedMenubar.queryMatches.set(true);
            namedFixture.detectChanges();

            expect(namedMenubar._startTemplate()).toBeTruthy();
            expect(namedMenubar._endTemplate()).toBeTruthy();
            expect(namedMenubar._menuIconTemplate()).toBeTruthy();
            expect(namedMenubar._submenuIconTemplate()).toBeTruthy();
            expect(namedMenubar._itemTemplate()).toBeTruthy();

            expect(namedFixture.debugElement.query(By.css('.p-template-start'))).toBeTruthy();
            expect(namedFixture.debugElement.query(By.css('.p-template-end'))).toBeTruthy();
            expect(namedFixture.debugElement.query(By.css('.p-template-menuicon'))).toBeTruthy();
            expect(namedFixture.debugElement.query(By.css('svg[data-p-icon="bars"]'))).toBeNull();
            const fallbackItems = namedFixture.debugElement.queryAll(By.css('.p-template-fallback'));
            expect(fallbackItems.length).toBe(2);
            expect(fallbackItems[0].nativeElement.textContent).toContain('File');
        });

        it('should handle submenuicon template', async () => {
            const submenuTemplateFixture = TestBed.createComponent(TestSubmenuIconTemplateComponent);
            submenuTemplateFixture.changeDetectorRef.markForCheck();
            await submenuTemplateFixture.whenStable();

            const submenuMenubar = submenuTemplateFixture.debugElement.query(By.directive(Menubar)).componentInstance;

            expect(submenuMenubar.submenuIconTemplate()).toBeTruthy();
            expect(submenuMenubar.rootmenu().submenuiconTemplate()).toBe(submenuMenubar.submenuIconTemplate());
            expect(submenuTemplateFixture.debugElement.query(By.css('.custom-submenu-icon'))).toBeTruthy();
            expect(submenuTemplateFixture.debugElement.query(By.css('svg[data-p-icon="angle-down"]'))).toBeNull();
        });

        it('should handle menuicon template', async () => {
            const menuIconTemplateFixture = TestBed.createComponent(TestMenuIconTemplateComponent);
            menuIconTemplateFixture.changeDetectorRef.markForCheck();
            await menuIconTemplateFixture.whenStable();

            const menuIconMenubar = menuIconTemplateFixture.debugElement.query(By.directive(Menubar)).componentInstance;

            expect(menuIconMenubar.menuIconTemplate()).toBeTruthy();
            expect(menuIconTemplateFixture.debugElement.query(By.css('.custom-menu-icon'))).toBeTruthy();
            expect(menuIconTemplateFixture.debugElement.query(By.css('svg[data-p-icon="bars"]'))).toBeNull();
        });

        it('should handle missing templates gracefully', () => {
            expect(menubarInstance.templates().length).toBe(0);
            expect(menubarInstance._itemTemplate()).toBeUndefined();
            expect(menubarInstance._startTemplate()).toBeUndefined();
            expect(menubarInstance._endTemplate()).toBeUndefined();
            expect(menubarInstance._menuIconTemplate()).toBeUndefined();
            expect(menubarInstance._submenuIconTemplate()).toBeUndefined();
        });
    });

    describe('Keyboard Navigation Tests', () => {
        beforeEach(() => {
            menubarInstance.focused.set(true);
            menubarInstance.focusedItemInfo.set({ index: 0, level: 0, parentKey: '', item: null });

            // Mock the rootmenu property to prevent undefined errors
            (menubarInstance as any).rootmenu = () =>
                ({
                    el: {
                        nativeElement: document.createElement('ul')
                    }
                }) as any;
        });

        it('should handle arrow right key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'ArrowRight' });
            vi.spyOn(keyEvent, 'preventDefault').mockImplementation(() => {});

            vi.spyOn(menubarInstance, 'changeFocusedItemIndex').mockImplementation(() => {});

            menubarInstance.onKeyDown(keyEvent);

            expect(menubarInstance.changeFocusedItemIndex).toHaveBeenCalled();
        });

        it('should handle arrow left key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
            vi.spyOn(keyEvent, 'preventDefault').mockImplementation(() => {});

            vi.spyOn(menubarInstance, 'changeFocusedItemIndex').mockImplementation(() => {});

            menubarInstance.onKeyDown(keyEvent);

            expect(menubarInstance.changeFocusedItemIndex).toHaveBeenCalled();
        });

        it('should handle arrow down key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'ArrowDown' });

            vi.spyOn(menubarInstance, 'onArrowDownKey').mockImplementation(() => {});

            menubarInstance.onKeyDown(keyEvent);

            expect(menubarInstance.onArrowDownKey).toHaveBeenCalledWith(keyEvent);
        });

        it('should handle arrow up key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'ArrowUp' });

            vi.spyOn(menubarInstance, 'onArrowUpKey').mockImplementation(() => {});

            menubarInstance.onKeyDown(keyEvent);

            expect(menubarInstance.onArrowUpKey).toHaveBeenCalledWith(keyEvent);
        });

        it('should handle home key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'Home' });
            vi.spyOn(keyEvent, 'preventDefault').mockImplementation(() => {});

            vi.spyOn(menubarInstance, 'changeFocusedItemIndex').mockImplementation(() => {});

            menubarInstance.onKeyDown(keyEvent);

            expect(menubarInstance.changeFocusedItemIndex).toHaveBeenCalled();
            expect(keyEvent.preventDefault).toHaveBeenCalled();
        });

        it('should handle end key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'End' });
            vi.spyOn(keyEvent, 'preventDefault').mockImplementation(() => {});

            vi.spyOn(menubarInstance, 'changeFocusedItemIndex').mockImplementation(() => {});

            menubarInstance.onKeyDown(keyEvent);

            expect(menubarInstance.changeFocusedItemIndex).toHaveBeenCalled();
            expect(keyEvent.preventDefault).toHaveBeenCalled();
        });

        it('should move the focused item on arrow right and update the focused id', () => {
            expect(menubarInstance.focusedItemId()).toBe(`${menubarInstance._id()}_0`);

            menubarInstance.onKeyDown(new KeyboardEvent('keydown', { code: 'ArrowRight' }));

            expect(menubarInstance.focusedItemInfo().index).toBe(1);
            expect(menubarInstance.focusedItemId()).toBe(`${menubarInstance._id()}_1`);

            menubarInstance.onKeyDown(new KeyboardEvent('keydown', { code: 'End' }));

            // the separator at index 2 is skipped
            expect(menubarInstance.focusedItemInfo().index).toBe(3);
            expect(menubarInstance.focusedItemId()).toBe(`${menubarInstance._id()}_3`);
        });

        it('should handle enter key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'Enter' });
            vi.spyOn(keyEvent, 'preventDefault').mockImplementation(() => {});

            menubarInstance.onKeyDown(keyEvent);

            expect(keyEvent.preventDefault).toHaveBeenCalled();
        });

        it('should handle space key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'Space' });
            vi.spyOn(menubarInstance, 'onEnterKey').mockImplementation(() => {});

            menubarInstance.onKeyDown(keyEvent);

            expect(menubarInstance.onEnterKey).toHaveBeenCalledWith(keyEvent);
        });

        it('should handle escape key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'Escape' });
            vi.spyOn(menubarInstance, 'hide').mockImplementation(() => {});
            vi.spyOn(keyEvent, 'preventDefault').mockImplementation(() => {});

            menubarInstance.onKeyDown(keyEvent);

            expect(menubarInstance.hide).toHaveBeenCalledWith(keyEvent, true);
            expect(keyEvent.preventDefault).toHaveBeenCalled();
        });

        it('should refocus the first item after escape', () => {
            menubarInstance.focusedItemInfo.set({ index: 3, level: 0, parentKey: '', item: null });

            menubarInstance.onKeyDown(new KeyboardEvent('keydown', { code: 'Escape' }));

            expect(menubarInstance.activeItemPath()).toEqual([]);
            expect(menubarInstance.focusedItemInfo().index).toBe(0);
            expect(menubarInstance.focusedItemId()).toBe(`${menubarInstance._id()}_0`);
        });

        it('should handle tab key', () => {
            const keyEvent = new KeyboardEvent('keydown', { code: 'Tab' });
            vi.spyOn(menubarInstance, 'hide').mockImplementation(() => {});

            menubarInstance.onKeyDown(keyEvent);

            expect(menubarInstance.hide).toHaveBeenCalled();
        });

        it('should handle printable character search', () => {
            const keyEvent = new KeyboardEvent('keydown', { key: 'f' });
            vi.spyOn(menubarInstance, 'searchItems').mockImplementation((() => {}) as any);

            menubarInstance.onKeyDown(keyEvent);

            expect(menubarInstance.searchItems).toHaveBeenCalledWith(keyEvent, 'f');
        });

        it('should focus the matching item on search and reset the search value afterwards', () => {
            vi.useFakeTimers();
            try {
                const matched = menubarInstance.searchItems(new KeyboardEvent('keydown', { key: 's' }), 's');

                expect(matched).toBe(true);
                expect(menubarInstance.searchValue()).toBe('s');
                expect(menubarInstance.searchTimeout()).toBeTruthy();
                expect(menubarInstance.focusedItemInfo().index).toBe(3);
                expect(menubarInstance.focusedItemInfo().item.label).toBe('Settings');

                vi.advanceTimersByTime(500);

                expect(menubarInstance.searchValue()).toBe('');
                expect(menubarInstance.searchTimeout()).toBeNull();
            } finally {
                vi.useRealTimers();
            }
        });
    });

    describe('CSS Classes and Styling', () => {
        it('should apply class when provided', async () => {
            component.styleClass = 'custom-menubar-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const hostElement = menubarElement.nativeElement;
            expect(hostElement.classList.contains('custom-menubar-class')).toBe(true);
        });

        it('should merge a static class with the root class', () => {
            const styledFixture = TestBed.createComponent(TestStyledMenubarComponent);
            styledFixture.detectChanges();

            const hostElement = styledFixture.debugElement.query(By.directive(Menubar)).nativeElement;
            expect(hostElement.classList.contains('custom-menubar-class')).toBe(true);
            expect(hostElement.classList.contains('p-menubar')).toBe(true);
            expect(hostElement.classList.contains('p-component')).toBe(true);
        });

        it('should have proper data attributes', () => {
            const hostElement = menubarElement.nativeElement;

            expect(hostElement.getAttribute('data-pc-name')).toBe('menubar');
            expect(hostElement.getAttribute('data-pc-section')).toBe('root');
        });

        it('should have generated id on root menu', () => {
            const rootMenu = fixture.debugElement.query(By.css('ul[pMenubarSub]'));

            expect(rootMenu.nativeElement.getAttribute('id')).toBeTruthy();
            expect(rootMenu.nativeElement.getAttribute('id')).toMatch(/^pn_id_/);
            expect(rootMenu.nativeElement.getAttribute('id')).toBe(menubarInstance._id());
        });

        it('should toggle the mobile classes on the host', () => {
            const hostElement = menubarElement.nativeElement;
            menubarInstance.queryMatches.set(false);
            menubarInstance.mobileActive.set(false);
            fixture.detectChanges();

            expect(hostElement.classList.contains('p-menubar-mobile')).toBe(false);
            expect(hostElement.classList.contains('p-menubar-mobile-active')).toBe(false);

            menubarInstance.queryMatches.set(true);
            menubarInstance.mobileActive.set(true);
            fixture.detectChanges();

            expect(hostElement.classList.contains('p-menubar-mobile')).toBe(true);
            expect(hostElement.classList.contains('p-menubar-mobile-active')).toBe(true);
        });
    });

    describe('Accessibility Tests', () => {
        it('should have proper ARIA attributes on root menu', () => {
            const rootMenu = fixture.debugElement.query(By.css('ul[pMenubarSub]'));

            expect(rootMenu.nativeElement.getAttribute('role')).toBe('menubar');
            expect(rootMenu.nativeElement.hasAttribute('tabindex')).toBe(true);
        });

        it('should have proper ARIA attributes on menu items', () => {
            const menuItems = fixture.debugElement.queryAll(By.css('li[data-pc-section="item"]'));

            menuItems.forEach((item) => {
                expect(item.nativeElement.getAttribute('role')).toBe('menuitem');
                expect(item.nativeElement.hasAttribute('aria-label')).toBe(true);
            });
        });

        it('should handle focus and blur events', () => {
            const rootMenu = fixture.debugElement.query(By.css('ul[pMenubarSub]'));

            vi.spyOn(menubarInstance, 'onMenuFocus').mockImplementation(() => {});
            vi.spyOn(menubarInstance, 'onMenuBlur').mockImplementation(() => {});

            rootMenu.triggerEventHandler('focus', new FocusEvent('focus'));
            expect(menubarInstance.onMenuFocus).toHaveBeenCalled();

            rootMenu.triggerEventHandler('blur', new FocusEvent('blur'));
            expect(menubarInstance.onMenuBlur).toHaveBeenCalled();
        });

        it('should set aria-activedescendant when focused', () => {
            menubarInstance.focused.set(true);
            menubarInstance.focusedItemInfo.set({ index: 0, level: 0, parentKey: '', item: null });
            fixture.detectChanges();

            const rootMenu = fixture.debugElement.query(By.css('ul[pMenubarSub]'));

            // The template uses: [attr.aria-activedescendant]="focused() ? focusedItemId() : undefined"
            // Since both focused()=true and focusedItemId() exists, it should be set
            expect(rootMenu.nativeElement.getAttribute('aria-activedescendant')).toBe(menubarInstance.focusedItemId());
            expect(rootMenu.nativeElement.getAttribute('aria-activedescendant')).toBe(`${menubarInstance._id()}_0`);

            const firstItem = fixture.debugElement.query(By.css('li[data-pc-section="item"]'));
            expect(firstItem.nativeElement.getAttribute('data-p-focused')).toBe('true');
            expect(firstItem.nativeElement.classList.contains('p-focus')).toBe(true);

            menubarInstance.focused.set(false);
            fixture.detectChanges();

            expect(rootMenu.nativeElement.hasAttribute('aria-activedescendant')).toBe(false);
            expect(firstItem.nativeElement.getAttribute('data-p-focused')).toBe('false');
        });

        it('should emit onFocus and focus the first item when the root list receives focus', () => {
            const rootMenu = fixture.debugElement.query(By.css('ul[pMenubarSub]'));

            rootMenu.triggerEventHandler('focus', new FocusEvent('focus'));
            fixture.detectChanges();

            expect(menubarInstance.focused()).toBe(true);
            expect(menubarInstance.focusedItemInfo().index).toBe(0);
            expect(component.focusEvent).toBeTruthy();
            expect(rootMenu.nativeElement.getAttribute('aria-activedescendant')).toBe(`${menubarInstance._id()}_0`);
        });

        it('should update ariaLabel and ariaLabelledBy', async () => {
            component.ariaLabel = 'Main Navigation';
            component.ariaLabelledBy = 'nav-heading';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const rootMenu = fixture.debugElement.query(By.css('ul[pMenubarSub]'));
            expect(rootMenu.nativeElement.getAttribute('aria-label')).toBe('Main Navigation');
            expect(rootMenu.nativeElement.getAttribute('aria-labelledby')).toBe('nav-heading');
        });
    });

    describe('Router Integration Tests', () => {
        it('should work with router navigation', () => {
            const routerFixture = TestBed.createComponent(TestRouterMenubarComponent);
            routerFixture.detectChanges();

            const routerMenubar = routerFixture.debugElement.query(By.directive(Menubar)).componentInstance;

            expect(routerMenubar.model()[0].routerLink).toBe('/');
            expect(routerMenubar.model()[1].routerLink).toBe('/products');
            expect(routerMenubar.model()[2].queryParams).toEqual({ tab: 'overview' });
        });

        it('should handle router links in template', () => {
            const routerFixture = TestBed.createComponent(TestRouterMenubarComponent);
            routerFixture.detectChanges();

            // Router links might be rendered as href after processing
            const routerLinks = routerFixture.debugElement.queryAll(By.css('a[routerLink], a[href]'));
            expect(routerLinks.length).toBeGreaterThan(0);
        });
    });

    describe('Media Query and Responsive Tests', () => {
        it('should initialize queryMatches property', () => {
            expect(typeof menubarInstance.queryMatches()).toBe('boolean');
        });

        it('should bind match media listener on init', () => {
            vi.spyOn(menubarInstance, 'bindMatchMediaListener').mockImplementation(() => {});

            menubarInstance.ngOnInit();

            expect(menubarInstance.bindMatchMediaListener).toHaveBeenCalled();
        });

        it('should unbind match media listener on destroy', () => {
            vi.spyOn(menubarInstance, 'unbindMatchMediaListener').mockImplementation(() => {});

            menubarInstance.ngOnDestroy();

            expect(menubarInstance.unbindMatchMediaListener).toHaveBeenCalled();
        });

        it('should handle breakpoint changes', async () => {
            component.breakpoint = '768px';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(menubarInstance.breakpoint()).toBe('768px');
        });
    });

    describe('AutoHide Functionality', () => {
        it('should configure autoHide settings', async () => {
            const autoHideFixture = TestBed.createComponent(TestAutoHideMenubarComponent);
            autoHideFixture.changeDetectorRef.markForCheck();
            await autoHideFixture.whenStable();

            const autoHideMenubar = autoHideFixture.debugElement.query(By.directive(Menubar)).componentInstance;

            expect(autoHideMenubar.autoHide()).toBe(true);
            expect(autoHideMenubar.autoHideDelay()).toBe(200);
            expect(autoHideMenubar.menubarService.autoHide).toBe(true);
            expect(autoHideMenubar.menubarService.autoHideDelay).toBe(200);
        });

        it('should handle mouse leave with autoHide', () => {
            const rootMenu = fixture.debugElement.query(By.css('ul[pMenubarSub]'));

            vi.spyOn(menubarInstance, 'onMouseLeave').mockImplementation(() => {});

            rootMenu.triggerEventHandler('mouseleave', new MouseEvent('mouseleave'));

            expect(menubarInstance.onMouseLeave).toHaveBeenCalled();
        });
    });

    describe('AutoHide pointer return', () => {
        it('should not hide when the pointer comes back before the autoHide delay', async () => {
            const autoHideFixture = TestBed.createComponent(TestAutoHideMenubarComponent);
            autoHideFixture.componentInstance.model = [{ label: 'Projects', items: [{ label: 'Templates', items: [{ label: 'Apollo' }] }] }];
            autoHideFixture.detectChanges();
            await autoHideFixture.whenStable();

            const autoHideMenubar: Menubar = autoHideFixture.debugElement.query(By.directive(Menubar)).componentInstance;
            const hideSpy = vi.spyOn(autoHideMenubar, 'hide');
            const rootList = autoHideFixture.debugElement.query(By.css('ul[pMenubarSub]')).nativeElement as HTMLElement;

            rootList.dispatchEvent(new MouseEvent('mouseleave'));
            await new Promise((resolve) => setTimeout(resolve, 50));
            rootList.dispatchEvent(new MouseEvent('mouseenter'));
            await new Promise((resolve) => setTimeout(resolve, 600));

            expect(hideSpy).not.toHaveBeenCalled();
        });

        it('should still hide once the pointer has left', async () => {
            const autoHideFixture = TestBed.createComponent(TestAutoHideMenubarComponent);
            autoHideFixture.detectChanges();
            await autoHideFixture.whenStable();

            const autoHideMenubar: Menubar = autoHideFixture.debugElement.query(By.directive(Menubar)).componentInstance;
            const hideSpy = vi.spyOn(autoHideMenubar, 'hide');
            const rootList = autoHideFixture.debugElement.query(By.css('ul[pMenubarSub]')).nativeElement as HTMLElement;

            rootList.dispatchEvent(new MouseEvent('mouseleave'));
            await new Promise((resolve) => setTimeout(resolve, 600));

            expect(hideSpy).toHaveBeenCalled();
        });
    });

    describe('Edge Cases', () => {
        it('should handle null/undefined model', async () => {
            component.model = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(() => fixture.changeDetectorRef.markForCheck()).not.toThrow();
            expect(menubarInstance.model()).toBeUndefined();
            expect(menubarInstance.processedItems()).toEqual([]);
            expect(fixture.debugElement.queryAll(By.css('li[data-pc-section="item"]')).length).toBe(0);
            expect(fixture.debugElement.query(By.css('a[data-pc-section="button"]'))).toBeNull();
        });

        it('should handle empty model array', async () => {
            component.model = [];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(() => fixture.changeDetectorRef.markForCheck()).not.toThrow();
            expect(menubarInstance.model()).toEqual([]);
        });

        it('should handle items without labels', async () => {
            component.model = [{ icon: 'pi pi-file' }];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(() => fixture.changeDetectorRef.markForCheck()).not.toThrow();
            expect(menubarInstance.model()?.[0]?.icon).toBe('pi pi-file');
        });

        it('should handle disabled items', () => {
            const disabledFixture = TestBed.createComponent(TestDisabledItemsComponent);
            disabledFixture.detectChanges();

            const disabledMenubar = disabledFixture.debugElement.query(By.directive(Menubar)).componentInstance;
            const disabledItem = disabledMenubar.model()[1];

            expect(menubarInstance.isItemDisabled(disabledItem)).toBe(true);
        });

        it('should handle dynamic model changes', async () => {
            const dynamicFixture = TestBed.createComponent(TestDynamicMenubarComponent);
            const dynamicComponent = dynamicFixture.componentInstance;
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();

            const dynamicMenubar = dynamicFixture.debugElement.query(By.directive(Menubar)).componentInstance;

            expect(dynamicMenubar.model().length).toBe(0);

            // Add items dynamically
            dynamicComponent.addItem({ label: 'Dynamic 1', icon: 'pi pi-file' });
            dynamicComponent.addItem({ label: 'Dynamic 2', icon: 'pi pi-edit' });
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();

            expect(dynamicMenubar.model().length).toBe(2);

            // Clear items
            dynamicComponent.clearItems();
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();

            expect(dynamicMenubar.model().length).toBe(0);
        });

        it('should handle rapid show/hide calls', () => {
            expect(() => {
                menubarInstance.show();
                menubarInstance.hide();
                menubarInstance.show();
                menubarInstance.hide();
            }).not.toThrow();
        });

        it('should handle component destruction gracefully', () => {
            expect(() => {
                const tempFixture = TestBed.createComponent(TestBasicMenubarComponent);
                tempFixture.detectChanges();
                const tempInstance = tempFixture.debugElement.query(By.directive(Menubar)).componentInstance;
                expect(tempInstance).toBeTruthy();
                tempFixture.destroy();
            }).not.toThrow();
        });
    });

    describe('Public Methods', () => {
        it('should have show method', () => {
            expect(typeof menubarInstance.show).toBe('function');
        });

        it('should have hide method', () => {
            expect(typeof menubarInstance.hide).toBe('function');
        });

        it('should have toggle method', () => {
            expect(typeof menubarInstance.toggle).toBe('function');
        });

        it('should call show method programmatically', () => {
            vi.spyOn(menubarInstance, 'findFirstFocusedItemIndex').mockReturnValue(0);
            vi.spyOn(menubarInstance, 'findVisibleItem').mockReturnValue({ item: { label: 'Test' } });

            menubarInstance.show();

            expect(menubarInstance.focusedItemInfo().index).toBe(0);
        });

        it('should call hide method programmatically', () => {
            menubarInstance.activeItemPath.set([{ key: 'test' }]);
            menubarInstance.focusedItemInfo.set({ index: 0, level: 0, parentKey: '', item: null });
            menubarInstance.dirty.set(true);

            menubarInstance.hide();

            expect(menubarInstance.activeItemPath()).toEqual([]);
            expect(menubarInstance.focusedItemInfo().index).toBe(-1);
            expect(menubarInstance.dirty()).toBe(false);
        });

        it('should call toggle method programmatically', () => {
            const mockEvent = new MouseEvent('click');
            vi.spyOn(mockEvent, 'preventDefault').mockImplementation(() => {});

            expect(menubarInstance.mobileActive()).toBeFalsy();

            menubarInstance.toggle(mockEvent);
            expect(menubarInstance.mobileActive()).toBe(true);
            expect(mockEvent.preventDefault).toHaveBeenCalled();

            menubarInstance.toggle(mockEvent);
            expect(menubarInstance.mobileActive()).toBe(false);
        });

        it('should bind and unbind the document listeners with the active item path', () => {
            expect(menubarInstance.outsideClickListener()).toBeFalsy();
            expect(menubarInstance.resizeListener()).toBeFalsy();

            menubarInstance.activeItemPath.set([menubarInstance.processedItems()[0]]);
            fixture.detectChanges();

            expect(menubarInstance.outsideClickListener()).toBeTruthy();
            expect(menubarInstance.resizeListener()).toBeTruthy();

            menubarInstance.activeItemPath.set([]);
            fixture.detectChanges();

            expect(menubarInstance.outsideClickListener()).toBeNull();
            expect(menubarInstance.resizeListener()).toBeNull();
        });

        it('should compute visibleItems from the active item path', () => {
            const nestedFixture = TestBed.createComponent(TestNestedMenubarComponent);
            nestedFixture.detectChanges();

            const nestedMenubar: Menubar = nestedFixture.debugElement.query(By.directive(Menubar)).componentInstance;
            const fileItem = nestedMenubar.processedItems()[0];

            expect(nestedMenubar.visibleItems()).toBe(nestedMenubar.processedItems());

            nestedMenubar.activeItemPath.set([fileItem]);
            nestedMenubar.focusedItemInfo.set({ index: -1, level: 1, parentKey: fileItem.key, item: null });

            expect(nestedMenubar.visibleItems()).toBe(fileItem.items);
            expect(nestedMenubar.findFirstItemIndex()).toBe(0);
            expect(nestedMenubar.findLastItemIndex()).toBe(3);
        });

        it('should have utility methods', () => {
            expect(typeof menubarInstance.getItemProp).toBe('function');
            expect(typeof menubarInstance.isItemDisabled).toBe('function');
            expect(typeof menubarInstance.isItemSeparator).toBe('function');
            expect(typeof menubarInstance.createProcessedItems).toBe('function');
        });

        it('should handle item property retrieval', () => {
            const testItem = { label: 'Test Item', disabled: true, separator: false };
            const separatorItem = { separator: true };

            expect(menubarInstance.getItemProp(testItem, 'label')).toBe('Test Item');
            expect(menubarInstance.isItemDisabled(testItem)).toBe(true);
            expect(menubarInstance.isItemSeparator(testItem)).toBe(false);
            expect(menubarInstance.isItemSeparator(separatorItem)).toBe(true);
        });

        it('should create processed items correctly', () => {
            const items = [
                { label: 'Item 1' },
                {
                    label: 'Item 2',
                    items: [{ label: 'Subitem 1' }, { label: 'Subitem 2' }]
                }
            ];

            const processedItems = menubarInstance.createProcessedItems(items);

            expect(processedItems.length).toBe(2);
            expect(processedItems[0].key).toBe('0');
            expect(processedItems[1].key).toBe('1');
            expect(processedItems[1].items).toBeTruthy();
            expect(processedItems[1].items.length).toBe(2);
        });
    });

    describe('MenubarSub', () => {
        it('should receive its inputs from the Menubar', () => {
            const nestedFixture = TestBed.createComponent(TestNestedMenubarComponent);
            nestedFixture.detectChanges();

            const nestedMenubar: Menubar = nestedFixture.debugElement.query(By.directive(Menubar)).componentInstance;
            const rootSub = nestedMenubar.rootmenu();
            const nestedSub: MenubarSub = nestedFixture.debugElement.query(By.css('ul[pMenubarSub] ul[pMenubarSub]')).componentInstance;

            expect(rootSub.root()).toBe(true);
            expect(rootSub.level()).toBe(0);
            expect(rootSub.menuId()).toBe(nestedMenubar._id());
            expect(rootSub.items()).toBe(nestedMenubar.processedItems());
            expect(rootSub.activeItemPath()).toEqual([]);
            expect(rootSub.focusedItemId()).toBeUndefined();
            expect(rootSub.autoDisplay()).toBe(true);

            expect(nestedSub.root()).toBe(false);
            expect(nestedSub.level()).toBe(1);
            expect(nestedSub.menuId()).toBe(nestedMenubar._id());
            expect(nestedSub.items()).toBe(nestedMenubar.processedItems()[0].items);
            expect(nestedSub.inlineStyles()).toEqual({ display: 'none' });
            expect(nestedSub.getAriaSetSize()).toBe(3);
            expect(nestedSub.getAriaPosInset(3)).toBe(3);
        });

        it('should render the focused item from the focusedItemId input', () => {
            const nestedFixture = TestBed.createComponent(TestNestedMenubarComponent);
            nestedFixture.detectChanges();

            const nestedMenubar: Menubar = nestedFixture.debugElement.query(By.directive(Menubar)).componentInstance;
            const rootSub = nestedMenubar.rootmenu();
            const items: HTMLElement[] = Array.from(rootSub.el.nativeElement.querySelectorAll(':scope > li[data-pc-section="item"]'));

            nestedMenubar.focused.set(true);
            nestedMenubar.focusedItemInfo.set({ index: 1, level: 0, parentKey: '', item: null });
            nestedFixture.detectChanges();

            expect(rootSub.focusedItemId()).toBe(`${nestedMenubar._id()}_1`);
            expect(rootSub.isItemFocused(nestedMenubar.processedItems()[1])).toBe(true);
            expect(items.length).toBe(2);
            expect(items[0].getAttribute('data-p-focused')).toBe('false');
            expect(items[1].getAttribute('data-p-focused')).toBe('true');
            expect(items[1].classList.contains('p-focus')).toBe(true);
        });
    });

    describe('MenubarSub getPTOptions Method', () => {
        it('should call ptm with correct parameters', () => {
            const fixture = TestBed.createComponent(Menubar);
            const menubar = fixture.componentInstance;

            fixture.componentRef.setInput('model', [{ label: 'Test', items: [{ label: 'Subitem' }] }]);
            fixture.detectChanges();

            const menubarSub = menubar.rootmenu() as MenubarSub;
            const processedItem = {
                item: { label: 'Test Item', disabled: false },
                key: '0',
                index: 0
            };

            vi.spyOn(menubarSub, 'ptm');

            menubarSub.getPTOptions(processedItem, 0, 'item');

            expect(menubarSub.ptm).toHaveBeenCalledWith('item', {
                context: {
                    item: processedItem.item,
                    index: 0,
                    active: expect.any(Boolean),
                    focused: expect.any(Boolean),
                    disabled: expect.any(Boolean),
                    level: menubarSub.level()
                }
            });
        });

        it('should return value from ptm method', () => {
            const fixture = TestBed.createComponent(Menubar);
            const menubar = fixture.componentInstance;

            fixture.componentRef.setInput('model', [{ label: 'Test', items: [{ label: 'Subitem' }] }]);
            fixture.detectChanges();

            const menubarSub = menubar.rootmenu() as MenubarSub;
            const processedItem = {
                item: { label: 'Test Item' },
                key: '0',
                index: 0
            };

            const result = menubarSub.getPTOptions(processedItem, 0, 'item');

            expect(result).toBeDefined();
        });

        it('should determine active state correctly', () => {
            const fixture = TestBed.createComponent(Menubar);
            const menubar = fixture.componentInstance;

            fixture.componentRef.setInput('model', [{ label: 'Test', items: [{ label: 'Subitem' }] }]);
            fixture.detectChanges();

            const menubarSub = menubar.rootmenu() as MenubarSub;
            const processedItem = {
                item: { label: 'Test Item' },
                key: '0',
                index: 0
            };

            vi.spyOn(menubarSub, 'isItemActive').mockReturnValue(true);
            vi.spyOn(menubarSub, 'ptm');

            menubarSub.getPTOptions(processedItem, 0, 'item');

            expect(menubarSub.isItemActive).toHaveBeenCalledWith(processedItem);
            expect(menubarSub.ptm).toHaveBeenCalledWith('item', {
                context: expect.objectContaining({
                    active: true
                })
            });
        });

        it('should determine focused state correctly', () => {
            const fixture = TestBed.createComponent(Menubar);
            const menubar = fixture.componentInstance;

            fixture.componentRef.setInput('model', [{ label: 'Test', items: [{ label: 'Subitem' }] }]);
            fixture.detectChanges();

            const menubarSub = menubar.rootmenu() as MenubarSub;
            const processedItem = {
                item: { label: 'Test Item', id: 'test-item-0' },
                key: '0',
                index: 0
            };

            vi.spyOn(menubarSub, 'isItemFocused').mockReturnValue(true);
            vi.spyOn(menubarSub, 'ptm');

            menubarSub.getPTOptions(processedItem, 0, 'item');

            expect(menubarSub.isItemFocused).toHaveBeenCalledWith(processedItem);
            expect(menubarSub.ptm).toHaveBeenCalledWith('item', {
                context: expect.objectContaining({
                    focused: true
                })
            });
        });

        it('should determine disabled state correctly', () => {
            const fixture = TestBed.createComponent(Menubar);
            const menubar = fixture.componentInstance;

            fixture.componentRef.setInput('model', [{ label: 'Test', items: [{ label: 'Subitem', disabled: true }] }]);
            fixture.detectChanges();

            const menubarSub = menubar.rootmenu() as MenubarSub;
            const processedItem = {
                item: { label: 'Disabled Item', disabled: true },
                key: '0',
                index: 0
            };

            vi.spyOn(menubarSub, 'isItemDisabled').mockReturnValue(true);
            vi.spyOn(menubarSub, 'ptm');

            menubarSub.getPTOptions(processedItem, 0, 'item');

            expect(menubarSub.isItemDisabled).toHaveBeenCalledWith(processedItem);
            expect(menubarSub.ptm).toHaveBeenCalledWith('item', {
                context: expect.objectContaining({
                    disabled: true
                })
            });
        });

        it('should use correct PT key', () => {
            const fixture = TestBed.createComponent(Menubar);
            const menubar = fixture.componentInstance;

            fixture.componentRef.setInput('model', [{ label: 'Test', items: [{ label: 'Subitem' }] }]);
            fixture.detectChanges();

            const menubarSub = menubar.rootmenu() as MenubarSub;
            const processedItem = {
                item: { label: 'Test Item' },
                key: '0',
                index: 0
            };

            vi.spyOn(menubarSub, 'ptm');

            menubarSub.getPTOptions(processedItem, 0, 'itemLink');

            expect(menubarSub.ptm).toHaveBeenCalledWith('itemLink', expect.any(Object));
        });

        it('should include level in context', () => {
            const fixture = TestBed.createComponent(Menubar);
            const menubar = fixture.componentInstance;

            fixture.componentRef.setInput('model', [{ label: 'Test', items: [{ label: 'Subitem' }] }]);
            fixture.detectChanges();

            const menubarSub = menubar.rootmenu() as MenubarSub;
            const processedItem = {
                item: { label: 'Test Item' },
                key: '0',
                index: 0
            };

            vi.spyOn(menubarSub, 'ptm');

            menubarSub.getPTOptions(processedItem, 0, 'item');

            expect(menubarSub.ptm).toHaveBeenCalledWith('item', {
                context: expect.objectContaining({
                    level: menubarSub.level()
                })
            });
        });

        it('should pass correct index', () => {
            const fixture = TestBed.createComponent(Menubar);
            const menubar = fixture.componentInstance;

            fixture.componentRef.setInput('model', [{ label: 'Item 1' }, { label: 'Item 2' }, { label: 'Item 3' }]);
            fixture.detectChanges();

            const menubarSub = menubar.rootmenu() as MenubarSub;
            const processedItem = {
                item: { label: 'Item 2' },
                key: '1',
                index: 1
            };

            vi.spyOn(menubarSub, 'ptm');

            menubarSub.getPTOptions(processedItem, 1, 'item');

            expect(menubarSub.ptm).toHaveBeenCalledWith('item', {
                context: expect.objectContaining({
                    index: 1
                })
            });
        });
    });

    describe('PassThrough', () => {
        let fixture: ComponentFixture<Menubar>;
        let menubar: Menubar;

        beforeEach(() => {
            fixture = TestBed.createComponent(Menubar);
            menubar = fixture.componentInstance;
            fixture.componentRef.setInput('model', [
                { label: 'Item 1', icon: 'pi pi-home' },
                { label: 'Item 2', icon: 'pi pi-search', items: [{ label: 'Subitem' }] }
            ]);
        });

        it('Case 1: should apply simple string classes to PT sections', () => {
            fixture.componentRef.setInput('pt', {
                button: 'BUTTON_CLASS',
                buttonIcon: 'BUTTON_ICON_CLASS'
            });
            fixture.detectChanges();

            const buttonEl = fixture.nativeElement.querySelector('[class*="p-menubar-button"]');

            expect(buttonEl).toBeTruthy();
            if (buttonEl) {
                expect(buttonEl.classList.contains('BUTTON_CLASS')).toBe(true);
            }
        });

        it('Case 2: should apply PT as objects with class, style, and data attributes', () => {
            fixture.componentRef.setInput('pt', {
                button: {
                    class: 'CUSTOM_BUTTON',
                    style: 'background-color: red',
                    'data-test': 'button-test',
                    'aria-label': 'Custom Button'
                }
            });
            fixture.detectChanges();

            const buttonEl = fixture.nativeElement.querySelector('[class*="p-menubar-button"]');
            expect(buttonEl).toBeTruthy();
            if (buttonEl) {
                expect(buttonEl.classList.contains('CUSTOM_BUTTON')).toBe(true);
                expect(buttonEl.style.backgroundColor).toBe('red');
                expect(buttonEl.getAttribute('data-test')).toBe('button-test');
                expect(buttonEl.getAttribute('aria-label')).toBe('Custom Button');
            }
        });

        it('Case 3: should apply mixed object and string PT values', () => {
            fixture.componentRef.setInput('pt', {
                button: 'BUTTON_STR_CLASS',
                buttonIcon: { class: 'ICON_OBJ_CLASS' }
            });
            fixture.detectChanges();

            const buttonEl = fixture.nativeElement.querySelector('[class*="p-menubar-button"]');

            expect(buttonEl).toBeTruthy();
            if (buttonEl) {
                expect(buttonEl.classList.contains('BUTTON_STR_CLASS')).toBe(true);
            }
        });

        it('Case 4: should use instance variables in PT functions', () => {
            fixture.componentRef.setInput('pt', {
                button: ({ instance }) => ({
                    class: {
                        MOBILE_ACTIVE: instance.mobileActive()
                    }
                })
            });

            menubar.mobileActive.set(true);
            fixture.detectChanges();

            const buttonEl = fixture.nativeElement.querySelector('[class*="p-menubar-button"]');
            expect(buttonEl).toBeTruthy();
            if (buttonEl) {
                expect(buttonEl.classList.contains('MOBILE_ACTIVE')).toBe(true);
            }

            menubar.mobileActive.set(false);
            fixture.detectChanges();

            expect(buttonEl.classList.contains('MOBILE_ACTIVE')).toBe(false);
        });

        it('Case 5: should handle event binding in PT', () => {
            let clicked = false;
            fixture.componentRef.setInput('pt', {
                button: {
                    onclick: () => {
                        clicked = true;
                    }
                }
            });
            fixture.detectChanges();

            const buttonEl = fixture.nativeElement.querySelector('[class*="p-menubar-button"]');
            expect(buttonEl).toBeTruthy();
            if (buttonEl) {
                buttonEl.click();
                expect(clicked).toBe(true);
            }
        });

        it('Case 6: should apply inline PT object', () => {
            const testFixture = TestBed.createComponent(Menubar);
            testFixture.componentRef.setInput('model', [{ label: 'Test' }]);
            testFixture.componentRef.setInput('pt', { button: 'INLINE_CLASS' });
            testFixture.detectChanges();

            const buttonEl = testFixture.nativeElement.querySelector('[class*="p-menubar-button"]');
            expect(buttonEl).toBeTruthy();
            if (buttonEl) {
                expect(buttonEl.classList.contains('INLINE_CLASS')).toBe(true);
            }
        });

        it('Case 8: should execute PT hooks', () => {
            let hookCalled = false;
            fixture.componentRef.setInput('pt', {
                button: 'TEST',
                hooks: {
                    onInit: () => {
                        hookCalled = true;
                    }
                }
            });
            fixture.detectChanges();

            expect(hookCalled).toBe(true);
        });
    });
});

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [Menubar, SharedModule],
    template: ` <p-menubar [model]="model"> </p-menubar> `
})
class MenubarQueryApiHostComponent {
    model = [{ label: 'a' }];
}

describe('Menubar Signal Query API', () => {
    it('should resolve its signal-based view/content queries', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [MenubarQueryApiHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(MenubarQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const instance = fixture.debugElement.query(By.directive(Menubar)).componentInstance;

        expect(instance.menubutton()).toBeDefined();
        expect(instance.rootmenu()).toBeInstanceOf(MenubarSub);
    });
});
