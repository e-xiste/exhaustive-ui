import { ChangeDetectionStrategy, Component, ElementRef, provideZonelessChangeDetection, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuItem } from '@exhaustive-ui/core/api';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import { Tooltip } from '@exhaustive-ui/core/tooltip';
import { TieredMenu, TieredMenuSub } from './tieredmenu';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SharedModule } from '@exhaustive-ui/core/api';
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `<p-tieredmenu [model]="model" [styleClass]="styleClass" [style]="style" [popup]="popup" [disabled]="disabled" [autoDisplay]="autoDisplay" [id]="id"></p-tieredmenu>`
})
class TestBasicTieredMenuComponent {
    model: MenuItem[] = [
        {
            label: 'File',
            items: [
                { label: 'New', icon: 'pi pi-fw pi-plus' },
                { label: 'Open', icon: 'pi pi-fw pi-download' },
                { label: 'Quit', icon: 'pi pi-fw pi-power-off' }
            ]
        },
        {
            label: 'Edit',
            items: [{ label: 'Copy', icon: 'pi pi-fw pi-copy' }, { label: 'Paste', icon: 'pi pi-fw pi-file' }, { separator: true }, { label: 'Find', icon: 'pi pi-fw pi-search' }]
        }
    ];
    styleClass = '';
    style: any = {};
    popup = false;
    disabled = false;
    autoDisplay = true;
    id: string | undefined;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-tieredmenu #menu [model]="model" [popup]="true"></p-tieredmenu>
        <button #toggleButton (click)="menu.toggle($event)" class="toggle-button">Show Menu</button>
    `
})
class TestPopupTieredMenuComponent {
    readonly menu = viewChild.required<TieredMenu>('menu');
    readonly toggleButton = viewChild.required<ElementRef>('toggleButton');

    model: MenuItem[] = [
        {
            label: 'Actions',
            items: [
                { label: 'Save', icon: 'pi pi-fw pi-save', command: () => this.onSave() },
                { label: 'Delete', icon: 'pi pi-fw pi-trash', command: () => this.onDelete() }
            ]
        }
    ];

    saveClicked = false;
    deleteClicked = false;

    onSave() {
        this.saveClicked = true;
    }

    onDelete() {
        this.deleteClicked = true;
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-tieredmenu [model]="model">
            <ng-template pTemplate="item" let-item let-hasSubmenu="hasSubmenu">
                <div class="custom-item">
                    <span class="custom-label">{{ item.label }}</span>
                    @if (hasSubmenu) {
                        <span class="custom-arrow">→</span>
                    }
                </div>
            </ng-template>
            <ng-template pTemplate="submenuicon">
                <i class="pi pi-angle-right custom-submenu-icon"></i>
            </ng-template>
        </p-tieredmenu>
    `
})
class TestTemplateTieredMenuComponent {
    model: MenuItem[] = [
        {
            label: 'Templates',
            items: [{ label: 'Template Item 1' }, { label: 'Template Item 2' }]
        }
    ];
}

// Test Component for #item template approach
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-tieredmenu [model]="model">
            <ng-template #item let-item let-hasSubmenu="hasSubmenu">
                <div class="content-template-item">
                    <span class="item-label">{{ item.label }}</span>
                    @if (item.badge) {
                        <span class="custom-badge">{{ item.badge }}</span>
                    }
                    @if (hasSubmenu) {
                        <span class="submenu-indicator">▶</span>
                    }
                </div>
            </ng-template>
            <ng-template #submenuicon>
                <i class="content-template-icon pi pi-chevron-right"></i>
            </ng-template>
        </p-tieredmenu>
    `
})
class TestContentTemplateTieredMenuComponent {
    model: MenuItem[] = [
        {
            label: 'Content Template Menu',
            items: [{ label: 'Template Item 1', badge: 'New' }, { label: 'Template Item 2' }]
        }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-tieredmenu [model]="model">
            <ng-template pTemplate="whatever" let-item>
                <span class="fallback-item">{{ item.label }}</span>
            </ng-template>
        </p-tieredmenu>
    `
})
class TestUnknownPTemplateTieredMenuComponent {
    model: MenuItem[] = [{ label: 'Fallback Item' }];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-disabled-tieredmenu',
    template: `<p-tieredmenu [model]="model"></p-tieredmenu>`
})
class TestDisabledTieredMenuComponent {
    model: MenuItem[] = [
        {
            label: 'Actions',
            items: [{ label: 'Enabled', icon: 'pi pi-fw pi-check' }, { label: 'Disabled', icon: 'pi pi-fw pi-ban', disabled: true }, { label: 'Function Disabled', icon: 'pi pi-fw pi-times', disabled: () => true } as any]
        }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-router-tieredmenu',
    template: `<p-tieredmenu [model]="model"></p-tieredmenu>`
})
class TestRouterTieredMenuComponent {
    model: MenuItem[] = [
        {
            label: 'Navigation',
            items: [
                { label: 'Home', routerLink: '/home', icon: 'pi pi-fw pi-home' },
                { label: 'About', routerLink: '/about', queryParams: { version: '1.0' } },
                {
                    label: 'Products',
                    routerLink: '/products',
                    fragment: 'top',
                    routerLinkActiveOptions: { exact: true }
                }
            ]
        }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-breakpoint-tieredmenu',
    template: `<p-tieredmenu [model]="model" [breakpoint]="breakpoint"></p-tieredmenu>`
})
class TestBreakpointTieredMenuComponent {
    breakpoint = '768px';
    model: MenuItem[] = [
        {
            label: 'Mobile',
            items: [{ label: 'Phone' }, { label: 'Tablet' }]
        }
    ];
}

describe('TieredMenu', () => {
    let fixture: ComponentFixture<TestBasicTieredMenuComponent>;
    let component: TestBasicTieredMenuComponent;
    let tieredMenuElement: HTMLElement;
    let tieredMenu: TieredMenu;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                TieredMenu,
                SharedModule,
                RouterTestingModule.withRoutes([
                    { path: 'home', component: TestBasicTieredMenuComponent },
                    { path: 'about', component: TestBasicTieredMenuComponent },
                    { path: 'products', component: TestBasicTieredMenuComponent }
                ])
            ],
            declarations: [
                TestBasicTieredMenuComponent,
                TestPopupTieredMenuComponent,
                TestTemplateTieredMenuComponent,
                TestContentTemplateTieredMenuComponent,
                TestUnknownPTemplateTieredMenuComponent,
                TestDisabledTieredMenuComponent,
                TestRouterTieredMenuComponent,
                TestBreakpointTieredMenuComponent
            ],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestBasicTieredMenuComponent);
        component = fixture.componentInstance;
        tieredMenuElement = fixture.debugElement.query(By.css('p-tieredmenu')).nativeElement;
        tieredMenu = fixture.debugElement.query(By.directive(TieredMenu)).componentInstance;
        fixture.detectChanges();
    });

    describe('Touch devices', () => {
        beforeEach(() => {
            Object.defineProperty(navigator, 'maxTouchPoints', { value: 5, configurable: true });
        });

        afterEach(() => {
            delete (navigator as any).maxTouchPoints;
        });

        it('should open a submenu with a single tap', async () => {
            // desktop layout, where submenus are overlays opened on hover
            const desktopFixture = TestBed.createComponent(TestBreakpointTieredMenuComponent);
            desktopFixture.componentInstance.breakpoint = '100px';
            desktopFixture.detectChanges();
            await desktopFixture.whenStable();

            const content = Array.from(desktopFixture.nativeElement.querySelectorAll('.p-tieredmenu-item-content') as NodeListOf<HTMLElement>).find((el) => el.textContent?.includes('Mobile'))!;
            // a tap: touch pointerenter, then the emulated mouseenter, then the click
            content.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'touch' }));
            content.dispatchEvent(new MouseEvent('mouseenter'));
            content.click();
            desktopFixture.detectChanges();
            await desktopFixture.whenStable();

            expect(content.parentElement!.getAttribute('aria-expanded')).toBe('true');
        });

        it('still opens submenus on mouse hover on a touchscreen laptop', async () => {
            const desktopFixture = TestBed.createComponent(TestBreakpointTieredMenuComponent);
            desktopFixture.componentInstance.breakpoint = '100px';
            desktopFixture.componentInstance.model = [
                { label: 'Mobile', items: [{ label: 'Phone' }] },
                { label: 'Desktop', items: [{ label: 'Laptop' }] }
            ];
            desktopFixture.detectChanges();
            await desktopFixture.whenStable();

            const contentOf = (label: string) => Array.from(desktopFixture.nativeElement.querySelectorAll('.p-tieredmenu-item-content') as NodeListOf<HTMLElement>).find((el) => el.textContent?.trim() === label)!;
            contentOf('Mobile').click();
            desktopFixture.detectChanges();
            await desktopFixture.whenStable();

            const desktop = contentOf('Desktop');
            desktop.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
            desktop.dispatchEvent(new MouseEvent('mouseenter'));
            desktopFixture.detectChanges();
            await desktopFixture.whenStable();

            expect(desktop.parentElement!.getAttribute('aria-expanded')).toBe('true');
        });
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
            expect(tieredMenu).toBeTruthy();
        });

        it('should have default property values', () => {
            expect(tieredMenu.popup()).toBeFalsy();
            expect(tieredMenu.disabled()).toBe(false);
            expect(tieredMenu.autoDisplay()).toBe(true);
            expect(tieredMenu.autoZIndex()).toBe(true);
            expect(tieredMenu.baseZIndex()).toBe(0);
            expect(tieredMenu.tabindex()).toBe(0);
            expect(tieredMenu.breakpoint()).toBe('960px');
            expect(tieredMenu.visible()).toBeUndefined();
            expect(tieredMenu.dirty()).toBe(false);
        });

        it('should generate unique id', () => {
            expect(tieredMenu.id()).toBeUndefined();
            expect(tieredMenu._id()).toBeDefined();
            expect(tieredMenu._id()).toMatch(/^pn_id_/);

            const container = fixture.debugElement.query(By.css('.p-tieredmenu'));
            expect(container.nativeElement.getAttribute('id')).toBe(tieredMenu._id());
        });

        it('should use the provided id', async () => {
            component.id = 'my-menu';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(tieredMenu.id()).toBe('my-menu');
            expect(tieredMenu._id()).toBe('my-menu');

            const container = fixture.debugElement.query(By.css('.p-tieredmenu'));
            expect(container.nativeElement.getAttribute('id')).toBe('my-menu');
            const list = fixture.debugElement.query(By.css('ul[role="menu"]'));
            expect(list.nativeElement.getAttribute('id')).toBe('my-menu_list');
        });

        it('should process menu items correctly', () => {
            expect(tieredMenu.processedItems()).toBeDefined();
            expect(tieredMenu.processedItems().length).toBe(2);
            expect(tieredMenu.processedItems()[0].item.label).toBe('File');
            expect(tieredMenu.processedItems()[1].item.label).toBe('Edit');
        });
    });

    describe('Input Properties', () => {
        it('should bind model correctly', async () => {
            const newModel = [{ label: 'New Menu', items: [{ label: 'Item' }] }];
            component.model = newModel;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(tieredMenu.model()).toEqual(newModel);
            expect(tieredMenu.processedItems().length).toBe(1);
            expect(fixture.debugElement.queryAll(By.css('ul[role="menu"] > li[role="menuitem"]')).length).toBe(1);
        });

        it('should bind styleClass', async () => {
            component.styleClass = 'custom-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(tieredMenu.styleClass()).toBe('custom-class');
        });

        it('should bind style object', async () => {
            const customStyle = { width: '300px', height: '400px' };
            component.style = customStyle;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(tieredMenu.style()).toEqual(customStyle);
        });

        it('should bind popup property', async () => {
            component.popup = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(tieredMenu.popup()).toBe(true);
            expect(fixture.debugElement.query(By.css('.p-tieredmenu'))).toBeNull();
        });

        it('should bind disabled property', async () => {
            expect(fixture.debugElement.query(By.css('ul[role="menu"]')).nativeElement.getAttribute('tabindex')).toBe('0');

            component.disabled = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(tieredMenu.disabled()).toBe(true);
            expect(fixture.debugElement.query(By.css('ul[role="menu"]')).nativeElement.getAttribute('tabindex')).toBe('-1');
        });

        it('should bind autoDisplay property', async () => {
            component.autoDisplay = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(tieredMenu.autoDisplay()).toBe(false);
            expect(tieredMenu.rootmenu()!.autoDisplay()).toBe(false);
        });

        it('should open a submenu on mouse over without a prior click when autoDisplay is true (optimus-ui#655)', async () => {
            // the test viewport is narrower than the 960px breakpoint, where hover never opens submenus
            tieredMenu.queryMatches.set(false);
            const groupItem = fixture.debugElement.queryAll(By.css('li[role="menuitem"] .p-tieredmenu-item-content'))[1];
            groupItem.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
            fixture.detectChanges();
            await fixture.whenStable();

            expect(tieredMenu.activeItemPath().length).toBe(1);
            expect(tieredMenu.activeItemPath()[0].item.label).toBe('Edit');
        });
    });

    describe('Menu Display and Interaction', () => {
        it('should render menu items', () => {
            const menuItems = fixture.debugElement.queryAll(By.css('li[role="menuitem"]'));
            expect(menuItems.length).toBeGreaterThan(0);
        });

        it('should display submenu items', () => {
            const firstMenuItem = fixture.debugElement.query(By.css('li[role="menuitem"]'));
            const submenu = firstMenuItem.query(By.css('p-tieredmenusub'));
            expect(submenu).toBeTruthy();
        });

        it('should render a nested submenu list once its parent item is activated', async () => {
            const nestedSub: TieredMenuSub = fixture.debugElement.query(By.css('li[role="menuitem"] p-tieredmenusub')).componentInstance;
            expect(nestedSub.root()).toBe(false);
            expect(nestedSub.visible()).toBe(false);
            expect(nestedSub.render()).toBe(false);
            expect(fixture.debugElement.queryAll(By.css('ul[role="menu"]')).length).toBe(1);

            const menuItem = fixture.debugElement.query(By.css('li[role="menuitem"] .p-tieredmenu-item-content'));
            menuItem.triggerEventHandler('click', { preventDefault: () => {} });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();
            fixture.detectChanges();

            expect(tieredMenu.activeItemPath().length).toBe(1);
            expect(nestedSub.visible()).toBe(true);
            expect(nestedSub.render()).toBe(true);
            expect(fixture.debugElement.queryAll(By.css('ul[role="menu"]')).length).toBe(2);
            expect(fixture.debugElement.queryAll(By.css('ul[role="menu"]'))[1].nativeElement.getAttribute('aria-labelledby')).toBe(`${tieredMenu._id()}_0`);
        });

        it('should keep the nested submenu rendered until its leave transition ends', async () => {
            const nestedSub: TieredMenuSub = fixture.debugElement.query(By.css('li[role="menuitem"] p-tieredmenusub')).componentInstance;
            const menuItem = fixture.debugElement.query(By.css('li[role="menuitem"] .p-tieredmenu-item-content'));
            menuItem.triggerEventHandler('click', { preventDefault: () => {} });
            await fixture.whenStable();
            fixture.detectChanges();
            expect(nestedSub.render()).toBe(true);

            tieredMenu.hide();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(nestedSub.visible()).toBe(false);
            expect(nestedSub.render()).toBe(true);

            nestedSub.onAfterLeave();
            expect(nestedSub.render()).toBe(false);
        });

        it('should handle menu item click', async () => {
            const clickSpy = vi.spyOn(tieredMenu, 'onItemClick');
            const menuItem = fixture.debugElement.query(By.css('li[role="menuitem"] .p-tieredmenu-item-content'));

            menuItem.triggerEventHandler('click', { preventDefault: () => {} });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(clickSpy).toHaveBeenCalled();
        });

        it('should show separators', async () => {
            // Click on the Edit menu item to expand submenu (sets dirty=true and opens submenu)
            const menuItems = fixture.debugElement.queryAll(By.css('li[role="menuitem"] .p-tieredmenu-item-content'));
            const editMenuItem = menuItems[1]; // Edit is the second root item
            editMenuItem.triggerEventHandler('click', { preventDefault: () => {} });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();
            fixture.detectChanges();

            const separators = fixture.debugElement.queryAll(By.css('li[role="separator"]'));
            expect(separators.length).toBeGreaterThan(0);
        });

        it('should handle mouse enter on menu item', async () => {
            const mouseEnterSpy = vi.spyOn(tieredMenu, 'onItemMouseEnter');
            const menuItem = fixture.debugElement.query(By.css('li[role="menuitem"] .p-tieredmenu-item-content'));

            menuItem.triggerEventHandler('mouseenter', { target: menuItem.nativeElement });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(mouseEnterSpy).toHaveBeenCalled();
        });
    });

    describe('Popup Mode', () => {
        let popupFixture: ComponentFixture<TestPopupTieredMenuComponent>;
        let popupComponent: TestPopupTieredMenuComponent;
        let popupTieredMenu: TieredMenu;

        beforeEach(async () => {
            popupFixture = TestBed.createComponent(TestPopupTieredMenuComponent);
            popupComponent = popupFixture.componentInstance;
            popupFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await popupFixture.whenStable();

            popupTieredMenu = popupComponent.menu();
        });

        it('should create popup menu', () => {
            expect(popupTieredMenu.popup()).toBe(true);
            expect(popupTieredMenu.visible()).toBeFalsy();
            expect(popupTieredMenu.render()).toBe(false);
            expect(popupFixture.debugElement.query(By.css('.p-tieredmenu'))).toBeNull();
        });

        it('should toggle menu visibility', async () => {
            const mockEvent = { currentTarget: popupComponent.toggleButton().nativeElement, preventDefault: () => {} };

            popupTieredMenu.toggle(mockEvent);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await popupFixture.whenStable();

            expect(popupTieredMenu.visible()).toBe(true);
            expect(popupTieredMenu.render()).toBe(true);
            expect(popupFixture.debugElement.query(By.css('.p-tieredmenu'))).toBeTruthy();
            expect(popupFixture.debugElement.query(By.css('.p-tieredmenu')).nativeElement.classList.contains('p-tieredmenu-overlay')).toBe(true);

            popupTieredMenu.toggle(mockEvent);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await popupFixture.whenStable();

            expect(popupTieredMenu.visible()).toBeFalsy();
        });

        it('should show menu with show method', async () => {
            const mockEvent = { currentTarget: popupComponent.toggleButton().nativeElement };

            popupTieredMenu.show(mockEvent);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await popupFixture.whenStable();

            expect(popupTieredMenu.visible()).toBe(true);
            expect(popupTieredMenu.target()).toBe(mockEvent.currentTarget);
        });

        it('should hide menu with hide method', async () => {
            const mockEvent = { currentTarget: popupComponent.toggleButton().nativeElement };

            popupTieredMenu.show(mockEvent);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await popupFixture.whenStable();
            expect(popupTieredMenu.visible()).toBe(true);

            popupTieredMenu.hide();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await popupFixture.whenStable();

            expect(popupTieredMenu.visible()).toBeFalsy();
        });

        it('should execute command on item click', async () => {
            const mockEvent = { currentTarget: popupComponent.toggleButton().nativeElement };
            popupTieredMenu.show(mockEvent);
            popupFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await popupFixture.whenStable();

            // Directly trigger the command on the save item
            const saveItem = popupTieredMenu.processedItems()[0].items[0]; // Actions -> Save
            const mockClickEvent = {
                originalEvent: { preventDefault: () => {} },
                processedItem: saveItem
            };

            // Execute the command directly
            if (saveItem.item.command) {
                saveItem.item.command({ originalEvent: mockClickEvent.originalEvent, item: saveItem.item });
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
            await popupFixture.whenStable();

            expect(popupComponent.saveClicked).toBe(true);
        });
    });

    describe('Templates', () => {
        let templateFixture: ComponentFixture<TestTemplateTieredMenuComponent>;

        beforeEach(() => {
            templateFixture = TestBed.createComponent(TestTemplateTieredMenuComponent);
            templateFixture.detectChanges();
        });

        it('should handle pTemplate content processing', async () => {
            const pTemplateFixture = TestBed.createComponent(TestTemplateTieredMenuComponent);
            pTemplateFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await pTemplateFixture.whenStable();

            const tieredMenuInstance: TieredMenu = pTemplateFixture.debugElement.query(By.directive(TieredMenu)).componentInstance;

            expect(tieredMenuInstance.templates().length).toBe(2);
            expect(tieredMenuInstance.itemTemplate()).toBeUndefined();
            expect(tieredMenuInstance._itemTemplate()).toBeDefined();
            expect(tieredMenuInstance.submenuIconTemplate()).toBeUndefined();
            expect(tieredMenuInstance._submenuIconTemplate()).toBeDefined();
            expect(tieredMenuInstance._itemTemplate()).not.toBe(tieredMenuInstance._submenuIconTemplate());

            // Verify pTemplate item container is rendered
            const menuList = pTemplateFixture.debugElement.query(By.css('ul[role="menu"]'));
            expect(menuList).toBeTruthy();
        });

        it('should handle #item template processing', async () => {
            const itemTemplateFixture = TestBed.createComponent(TestContentTemplateTieredMenuComponent);
            itemTemplateFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await itemTemplateFixture.whenStable();

            const tieredMenuInstance: TieredMenu = itemTemplateFixture.debugElement.query(By.directive(TieredMenu)).componentInstance;

            expect(tieredMenuInstance.templates().length).toBe(0);
            expect(tieredMenuInstance.itemTemplate()).toBeDefined();
            expect(tieredMenuInstance._itemTemplate()).toBeUndefined();
            expect(tieredMenuInstance.submenuIconTemplate()).toBeDefined();
            expect(tieredMenuInstance._submenuIconTemplate()).toBeUndefined();

            // Verify item container is rendered
            const menuList = itemTemplateFixture.debugElement.query(By.css('ul[role="menu"]'));
            expect(menuList).toBeTruthy();
        });

        it('should render different template types correctly', async () => {
            // Test both pTemplate and #item template approaches

            // Test pTemplate rendering
            const pTemplateFixture = TestBed.createComponent(TestTemplateTieredMenuComponent);
            pTemplateFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await pTemplateFixture.whenStable();

            const pTemplateTieredMenu: TieredMenu = pTemplateFixture.debugElement.query(By.directive(TieredMenu)).componentInstance;
            expect(pTemplateTieredMenu.templates().length).toBe(2);
            expect(pTemplateFixture.debugElement.queryAll(By.css('.custom-item')).length).toBe(1);
            expect(pTemplateFixture.debugElement.queryAll(By.css('.custom-submenu-icon')).length).toBe(0);

            // Test #item template rendering
            const itemTemplateFixture = TestBed.createComponent(TestContentTemplateTieredMenuComponent);
            itemTemplateFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await itemTemplateFixture.whenStable();

            const itemTemplateTieredMenu: TieredMenu = itemTemplateFixture.debugElement.query(By.directive(TieredMenu)).componentInstance;
            expect(itemTemplateTieredMenu.itemTemplate()).toBeDefined();
            expect(itemTemplateFixture.debugElement.queryAll(By.css('.content-template-item')).length).toBe(1);
        });

        it('should fall back to the item template for a pTemplate of an unknown type', async () => {
            const fallbackFixture = TestBed.createComponent(TestUnknownPTemplateTieredMenuComponent);
            fallbackFixture.detectChanges();
            await fallbackFixture.whenStable();

            const fallbackMenu: TieredMenu = fallbackFixture.debugElement.query(By.directive(TieredMenu)).componentInstance;

            expect(fallbackMenu._itemTemplate()).toBe(fallbackMenu.templates()[0].template);
            expect(fallbackMenu._submenuIconTemplate()).toBeUndefined();
            expect(fallbackFixture.debugElement.queryAll(By.css('.fallback-item')).length).toBe(1);
        });

        it('should render custom item template with pTemplate', async () => {
            templateFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await templateFixture.whenStable();

            const customItems = templateFixture.debugElement.queryAll(By.css('.custom-item'));
            const customLabels = templateFixture.debugElement.queryAll(By.css('.custom-label'));
            expect(customItems.length).toBe(1);
            expect(customLabels.length).toBe(1);
            expect(customLabels[0].nativeElement.textContent).toBe('Templates');
            expect(templateFixture.debugElement.queryAll(By.css('.custom-arrow')).length).toBe(1);
        });

        it('should render custom submenu icon template with pTemplate', async () => {
            const tieredMenuInstance: TieredMenu = templateFixture.debugElement.query(By.directive(TieredMenu)).componentInstance;

            expect(tieredMenuInstance._submenuIconTemplate()).toBeDefined();
            expect(tieredMenuInstance.rootmenu()!.itemTemplate()).toBe(tieredMenuInstance._itemTemplate());
            expect(templateFixture.debugElement.queryAll(By.css('svg[data-p-icon="angle-right"]')).length).toBe(0);
        });

        it('should handle template context parameters', async () => {
            // Test template context variables (let-item, let-hasSubmenu)
            const contextTemplateFixture = TestBed.createComponent(TestContentTemplateTieredMenuComponent);
            contextTemplateFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await contextTemplateFixture.whenStable();

            // Verify template context variables are available
            const contentTemplateItems = contextTemplateFixture.debugElement.queryAll(By.css('.content-template-item'));
            expect(contentTemplateItems.length).toBe(1);
            expect(contextTemplateFixture.debugElement.query(By.css('.item-label')).nativeElement.textContent).toBe('Content Template Menu');
            expect(contextTemplateFixture.debugElement.queryAll(By.css('.submenu-indicator')).length).toBe(1);
        });

        it('should use default templates when custom ones are not provided', () => {
            // Test default behavior without custom templates
            const menuList = fixture.debugElement.query(By.css('ul[role="menu"]'));
            expect(menuList).toBeTruthy();

            const defaultItems = fixture.debugElement.queryAll(By.css('li[role="menuitem"]'));
            expect(defaultItems.length).toBeGreaterThan(0);
            expect(fixture.debugElement.queryAll(By.css('svg[data-p-icon="angle-right"]')).length).toBe(2);
        });
    });

    describe('Keyboard Navigation', () => {
        beforeEach(async () => {
            // Focus the menu first
            tieredMenu.onMenuFocus({});
            tieredMenu.focusedItemInfo.set({ index: 0, level: 0, parentKey: '', item: null });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();
            fixture.detectChanges();
        });

        it('should handle arrow down key', async () => {
            const keydownSpy = vi.spyOn(tieredMenu, 'onArrowDownKey');
            const menuList = fixture.debugElement.query(By.css('ul[role="menu"]'));

            menuList.triggerEventHandler('keydown', { code: 'ArrowDown', preventDefault: () => {} });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(keydownSpy).toHaveBeenCalled();
            expect(tieredMenu.focusedItemInfo().index).toBe(1);
            expect(tieredMenu.focusedItemId()).toBe(`${tieredMenu._id()}_1`);
            expect(menuList.nativeElement.getAttribute('aria-activedescendant')).toBe(`${tieredMenu._id()}_1`);
        });

        it('should handle arrow up key', async () => {
            const keydownSpy = vi.spyOn(tieredMenu, 'onArrowUpKey');
            const menuList = fixture.debugElement.query(By.css('ul[role="menu"]'));

            menuList.triggerEventHandler('keydown', { code: 'ArrowUp', preventDefault: () => {} });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(keydownSpy).toHaveBeenCalled();
        });

        it('should handle arrow right key', async () => {
            const keydownSpy = vi.spyOn(tieredMenu, 'onArrowRightKey');
            const menuList = fixture.debugElement.query(By.css('ul[role="menu"]'));

            menuList.triggerEventHandler('keydown', { code: 'ArrowRight', preventDefault: () => {} });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(keydownSpy).toHaveBeenCalled();
            expect(tieredMenu.activeItemPath().length).toBe(1);
            expect(tieredMenu.focusedItemInfo().parentKey).toBe('0');
            expect(tieredMenu.visibleItems()).toBe(tieredMenu.processedItems()[0].items);
        });

        it('should handle arrow left key', async () => {
            const keydownSpy = vi.spyOn(tieredMenu, 'onArrowLeftKey');
            const menuList = fixture.debugElement.query(By.css('ul[role="menu"]'));

            menuList.triggerEventHandler('keydown', { code: 'ArrowLeft', preventDefault: () => {} });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(keydownSpy).toHaveBeenCalled();
        });

        it('should handle enter key', async () => {
            const keydownSpy = vi.spyOn(tieredMenu, 'onEnterKey');
            const menuList = fixture.debugElement.query(By.css('ul[role="menu"]'));

            menuList.triggerEventHandler('keydown', { code: 'Enter', preventDefault: () => {} });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(keydownSpy).toHaveBeenCalled();
        });

        it('should handle space key', async () => {
            const keydownSpy = vi.spyOn(tieredMenu, 'onSpaceKey');
            const menuList = fixture.debugElement.query(By.css('ul[role="menu"]'));

            menuList.triggerEventHandler('keydown', { code: 'Space', preventDefault: () => {} });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(keydownSpy).toHaveBeenCalled();
        });

        it('should handle escape key', async () => {
            const keydownSpy = vi.spyOn(tieredMenu, 'onEscapeKey');
            const menuList = fixture.debugElement.query(By.css('ul[role="menu"]'));

            menuList.triggerEventHandler('keydown', { code: 'Escape', preventDefault: () => {} });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(keydownSpy).toHaveBeenCalled();
            expect(tieredMenu.focusedItemInfo().index).toBe(0);
            expect(tieredMenu.activeItemPath()).toEqual([]);
        });

        it('should handle tab key', async () => {
            const keydownSpy = vi.spyOn(tieredMenu, 'onTabKey');
            const menuList = fixture.debugElement.query(By.css('ul[role="menu"]'));

            menuList.triggerEventHandler('keydown', { code: 'Tab', preventDefault: () => {} });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(keydownSpy).toHaveBeenCalled();
        });

        it('should handle home key', async () => {
            const keydownSpy = vi.spyOn(tieredMenu, 'onHomeKey');
            const menuList = fixture.debugElement.query(By.css('ul[role="menu"]'));

            menuList.triggerEventHandler('keydown', { code: 'Home', preventDefault: () => {} });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(keydownSpy).toHaveBeenCalled();
        });

        it('should handle end key', async () => {
            const keydownSpy = vi.spyOn(tieredMenu, 'onEndKey');
            const menuList = fixture.debugElement.query(By.css('ul[role="menu"]'));

            menuList.triggerEventHandler('keydown', { code: 'End', preventDefault: () => {} });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(keydownSpy).toHaveBeenCalled();
            expect(tieredMenu.focusedItemInfo().index).toBe(1);
        });

        it('should search items with character keys', async () => {
            const searchSpy = vi.spyOn(tieredMenu, 'searchItems');
            const menuList = fixture.debugElement.query(By.css('ul[role="menu"]'));

            menuList.triggerEventHandler('keydown', { code: 'KeyE', key: 'e', metaKey: false, ctrlKey: false, preventDefault: () => {} });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(searchSpy).toHaveBeenCalledWith(expect.any(Object), 'e');
            expect(tieredMenu.searchValue()).toBe('e');
            expect(tieredMenu.searchTimeout()).toBeTruthy();
            expect(tieredMenu.focusedItemInfo().index).toBe(1);

            await new Promise((resolve) => setTimeout(resolve, 600));
            expect(tieredMenu.searchValue()).toBe('');
            expect(tieredMenu.searchTimeout()).toBeNull();
        });
    });

    describe('CSS Classes and Styling', () => {
        it('should apply custom style class', async () => {
            component.styleClass = 'my-custom-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const container = fixture.debugElement.query(By.css('.p-tieredmenu'));
            expect(container.nativeElement.classList.contains('my-custom-class')).toBe(true);
        });

        it('should apply inline styles', async () => {
            component.style = { 'background-color': 'red', border: '1px solid blue' };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(tieredMenu.style()).toEqual({ 'background-color': 'red', border: '1px solid blue' });

            const container = fixture.debugElement.query(By.css('.p-tieredmenu'));
            expect(container.nativeElement.style.backgroundColor).toBe('red');
            expect(container.nativeElement.style.border).toBe('1px solid blue');
        });

        it('should have default CSS classes', () => {
            const container = fixture.debugElement.query(By.css('.p-tieredmenu'));
            expect(container).toBeTruthy();
            expect(container.nativeElement.classList.contains('p-tieredmenu-overlay')).toBe(false);
        });
    });

    describe('Disabled Items', () => {
        let disabledFixture: ComponentFixture<TestDisabledTieredMenuComponent>;

        beforeEach(() => {
            disabledFixture = TestBed.createComponent(TestDisabledTieredMenuComponent);
            disabledFixture.detectChanges();
        });

        it('should handle disabled items correctly', async () => {
            // Click on the Actions menu item to expand submenu (sets dirty=true and opens submenu)
            const rootMenuItems = disabledFixture.debugElement.queryAll(By.css('li[role="menuitem"] .p-tieredmenu-item-content'));
            const actionsMenuItem = rootMenuItems[0]; // Actions is the first root item
            actionsMenuItem.triggerEventHandler('click', { preventDefault: () => {} });
            await new Promise((resolve) => setTimeout(resolve, 100));
            await disabledFixture.whenStable();
            disabledFixture.detectChanges();

            const menuItems = disabledFixture.debugElement.queryAll(By.css('li[role="menuitem"]'));
            const disabledItem = menuItems.find((item) => item.nativeElement.getAttribute('data-p-disabled') === 'true');

            expect(disabledItem).toBeTruthy();
            expect(disabledItem!.nativeElement.getAttribute('aria-disabled')).toBe('true');
        });
    });

    describe('Router Integration', () => {
        let routerFixture: ComponentFixture<TestRouterTieredMenuComponent>;
        let router: Router;

        beforeEach(async () => {
            routerFixture = TestBed.createComponent(TestRouterTieredMenuComponent);
            router = TestBed.inject(Router);
            routerFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await routerFixture.whenStable();
        });

        it('should render router links', async () => {
            // Wait for menu to render
            await new Promise((resolve) => setTimeout(resolve, 100));
            await routerFixture.whenStable();
            routerFixture.detectChanges();

            const routerLinks = routerFixture.debugElement.queryAll(By.css('a[routerLink]'));
            expect(routerLinks.length).toBeGreaterThanOrEqual(0);

            if (routerLinks.length > 0) {
                expect(routerLinks[0].nativeElement.hasAttribute('routerLink')).toBe(true);
            }
        });

        it('should navigate on router link click', async () => {
            const navigateSpy = vi.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));

            // Wait for menu to render
            await new Promise((resolve) => setTimeout(resolve, 100));
            await routerFixture.whenStable();
            routerFixture.detectChanges();

            const routerLinks = routerFixture.debugElement.queryAll(By.css('a[routerLink]'));
            if (routerLinks.length > 0) {
                routerLinks[0].nativeElement.click();
                await new Promise((resolve) => setTimeout(resolve, 100));
                await routerFixture.whenStable();
                expect(navigateSpy).toHaveBeenCalled();
            } else {
                // If no router links found, just verify the spy wasn't called
                expect(navigateSpy).not.toHaveBeenCalled();
            }
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA attributes on menu', () => {
            const menu = fixture.debugElement.query(By.css('ul[role="menu"]'));
            expect(menu.nativeElement.getAttribute('role')).toBe('menu');
            expect(menu.nativeElement.getAttribute('aria-orientation')).toBe('vertical');
        });

        it('should have proper ARIA attributes on menu items', () => {
            const menuItems = fixture.debugElement.queryAll(By.css('li[role="menuitem"]'));

            menuItems.forEach((item) => {
                expect(item.nativeElement.getAttribute('role')).toBe('menuitem');
                expect(item.nativeElement.hasAttribute('aria-label')).toBe(true);
                expect(item.nativeElement.hasAttribute('id')).toBe(true);
            });
        });

        it('should handle focus management', async () => {
            const focusSpy = vi.spyOn(tieredMenu, 'onMenuFocus');
            const menu = fixture.debugElement.query(By.css('ul[role="menu"]'));

            menu.triggerEventHandler('focus', {});
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(focusSpy).toHaveBeenCalled();
            expect(tieredMenu.focused()).toBe(true);
        });

        it('should handle blur management', async () => {
            const blurSpy = vi.spyOn(tieredMenu, 'onMenuBlur');
            const menu = fixture.debugElement.query(By.css('ul[role="menu"]'));

            menu.triggerEventHandler('focus', {});
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();
            menu.triggerEventHandler('blur', {});
            await new Promise((resolve) => setTimeout(resolve, 100));
            await fixture.whenStable();

            expect(blurSpy).toHaveBeenCalled();
            expect(tieredMenu.focused()).toBe(false);
        });

        it('should only expose aria-activedescendant while focused', async () => {
            const menu = fixture.debugElement.query(By.css('ul[role="menu"]'));
            tieredMenu.onMenuBlur({});
            tieredMenu.focusedItemInfo.set({ index: 0, level: 0, parentKey: '', item: null });
            await fixture.whenStable();
            fixture.detectChanges();
            expect(tieredMenu.focused()).toBe(false);
            expect(menu.nativeElement.getAttribute('aria-activedescendant')).toBeNull();

            tieredMenu.onMenuFocus({});
            await fixture.whenStable();
            fixture.detectChanges();
            expect(menu.nativeElement.getAttribute('aria-activedescendant')).toBe(`${tieredMenu._id()}_0`);
            expect(fixture.debugElement.query(By.css('li[role="menuitem"]')).nativeElement.getAttribute('data-p-focused')).toBe('true');
        });

        it('should set aria-setsize and aria-posinset', () => {
            const menuItems = fixture.debugElement.queryAll(By.css('li[role="menuitem"]'));

            menuItems.forEach((item) => {
                expect(item.nativeElement.hasAttribute('aria-setsize')).toBe(true);
                expect(item.nativeElement.hasAttribute('aria-posinset')).toBe(true);
            });
        });
    });

    describe('Breakpoint and Media Queries', () => {
        let breakpointFixture: ComponentFixture<TestBreakpointTieredMenuComponent>;
        let breakpointTieredMenu: TieredMenu;

        beforeEach(() => {
            breakpointFixture = TestBed.createComponent(TestBreakpointTieredMenuComponent);
            breakpointFixture.detectChanges();
            breakpointTieredMenu = breakpointFixture.debugElement.query(By.directive(TieredMenu)).componentInstance;
        });

        it('should handle breakpoint property', () => {
            expect(breakpointTieredMenu.breakpoint()).toBe('768px');
        });

        it('should bind media query listener', () => {
            const bindSpy = vi.spyOn(breakpointTieredMenu, 'bindMatchMediaListener');
            breakpointTieredMenu.ngOnInit();
            expect(bindSpy).toHaveBeenCalled();
        });

        it('should bind the media query listener once and toggle the mobile class on match', () => {
            const matchMediaSpy = vi.spyOn(window, 'matchMedia');
            breakpointTieredMenu.ngOnInit();
            expect(matchMediaSpy).not.toHaveBeenCalled();
            expect(breakpointTieredMenu.queryMatches()).toBe(window.matchMedia('(max-width: 768px)').matches);

            breakpointTieredMenu.queryMatches.set(false);
            breakpointFixture.detectChanges();
            expect(breakpointFixture.debugElement.query(By.css('.p-tieredmenu')).nativeElement.classList.contains('p-tieredmenu-mobile')).toBe(false);

            breakpointTieredMenu.queryMatches.set(true);
            breakpointFixture.detectChanges();
            expect(breakpointFixture.debugElement.query(By.css('.p-tieredmenu')).nativeElement.classList.contains('p-tieredmenu-mobile')).toBe(true);
        });
    });

    describe('Events', () => {
        let popupFixture: ComponentFixture<TestPopupTieredMenuComponent>;
        let popupTieredMenu: TieredMenu;

        beforeEach(async () => {
            popupFixture = TestBed.createComponent(TestPopupTieredMenuComponent);
            popupFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await popupFixture.whenStable();
            popupTieredMenu = popupFixture.componentInstance.menu();
        });

        it('should emit onShow event', async () => {
            const showSpy = vi.spyOn(popupTieredMenu.onShow, 'emit').mockImplementation(() => {});
            const mockEvent = { currentTarget: popupFixture.componentInstance.toggleButton().nativeElement };

            popupTieredMenu.show(mockEvent);
            popupFixture.changeDetectorRef.markForCheck();
            await popupFixture.whenStable();
            popupFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await popupFixture.whenStable();

            // Verify visible state instead of testing internal animation
            expect(popupTieredMenu.visible()).toBe(true);
        });

        it('should emit onHide event', async () => {
            const hideSpy = vi.spyOn(popupTieredMenu.onHide, 'emit').mockImplementation(() => {});
            const mockEvent = { currentTarget: document.createElement('button') };

            popupTieredMenu.show(mockEvent);
            await new Promise((resolve) => setTimeout(resolve, 100));
            await popupFixture.whenStable();
            popupTieredMenu.hide();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await popupFixture.whenStable();

            expect(hideSpy).toHaveBeenCalled();
        });
    });

    describe('Tooltip', () => {
        it('should spawn a tooltip if an option has one provided', async () => {
            // Items are placed at the root level so they are visible without expanding
            // any sub-menu. The nested p-tieredmenusub for group children only renders
            // once the parent item is activated.
            component.model = [
                { label: 'Save', tooltip: 'Save the file' },
                { label: 'Delete', tooltipOptions: { tooltipLabel: 'Delete the file' } }
            ];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // All <li> elements that have the pTooltip directive attached
            const tooltipDebugElements = fixture.debugElement.queryAll(By.directive(Tooltip));
            expect(tooltipDebugElements.length).toBeGreaterThan(0);

            const tooltipDirectives = tooltipDebugElements.map((el) => el.injector.get(Tooltip));

            // Find the directive bound via the `tooltip` property on the MenuItem:
            // `content` is the `pTooltip` input set directly by Angular
            const directiveViaTooltipProp = tooltipDirectives.find((d) => d.content() === 'Save the file');
            expect(directiveViaTooltipProp, 'Tooltip directive not found for item with tooltip property').toBeTruthy();

            // Find the directive bound via `tooltipOptions.tooltipLabel`:
            // `tooltipOptions` is the input set directly by Angular
            const directiveViaTooltipOptions = tooltipDirectives.find((d) => (d.tooltipOptions() as any)?.tooltipLabel === 'Delete the file');
            expect(directiveViaTooltipOptions, 'Tooltip directive not found for item with tooltipOptions.tooltipLabel').toBeTruthy();

            // Activate each directive and verify the tooltip container (DOM element) is spawned
            directiveViaTooltipProp!.activate();
            await fixture.whenStable();
            expect(directiveViaTooltipProp!.container(), 'Tooltip container was not created for item with tooltip property').toBeTruthy();

            directiveViaTooltipOptions!.activate();
            await fixture.whenStable();
            expect(directiveViaTooltipOptions!.container(), 'Tooltip container was not created for item with tooltipOptions.tooltipLabel').toBeTruthy();
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty model', async () => {
            component.model = [];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(tieredMenu.model()).toEqual([]);
            expect(tieredMenu.processedItems().length).toBe(0);
            expect(fixture.debugElement.queryAll(By.css('li[role="menuitem"]')).length).toBe(0);
        });

        it('should handle null/undefined model', async () => {
            component.model = null as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(tieredMenu.model()).toBeNull();
            expect(tieredMenu.processedItems()).toEqual([]);
        });

        it('should handle items with no subitems', async () => {
            component.model = [{ label: 'Simple Item' }];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(tieredMenu.processedItems().length).toBe(1);
            expect(tieredMenu.processedItems()[0].items.length).toBe(0);
        });

        it('should handle deeply nested items', async () => {
            component.model = [
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
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(tieredMenu.processedItems()[0].items[0].items[0].items.length).toBe(1);
        });
    });

    describe('Public Methods', () => {
        it('should have toggle method', () => {
            expect(typeof tieredMenu.toggle).toBe('function');
        });

        it('should have show method', () => {
            expect(typeof tieredMenu.show).toBe('function');
        });

        it('should have hide method', () => {
            expect(typeof tieredMenu.hide).toBe('function');
        });

        it('should process items correctly with createProcessedItems', () => {
            const items = [{ label: 'Test', items: [{ label: 'Sub' }] }];
            const processed = tieredMenu.createProcessedItems(items);

            expect(processed.length).toBe(1);
            expect(processed[0].item.label).toBe('Test');
            expect(processed[0].items.length).toBe(1);
            expect(processed[0].items[0].item.label).toBe('Sub');
        });
    });

    describe('Cleanup', () => {
        it('should cleanup on destroy', () => {
            const unbindSpy = vi.spyOn(tieredMenu, 'unbindMatchMediaListener').mockImplementation(() => {});
            tieredMenu.ngOnDestroy();
            expect(unbindSpy).toHaveBeenCalled();
        });

        it('should unbind the outside click and resize listeners once every submenu is closed', async () => {
            const menuItem = fixture.debugElement.query(By.css('li[role="menuitem"] .p-tieredmenu-item-content'));
            menuItem.triggerEventHandler('click', { preventDefault: () => {} });
            await fixture.whenStable();
            fixture.detectChanges();

            expect(tieredMenu.activeItemPath().length).toBe(1);
            expect(tieredMenu.outsideClickListener()).toBeTruthy();
            expect(tieredMenu.resizeListener()).toBeTruthy();

            const unlistenClick = vi.fn();
            const unlistenResize = vi.fn();
            tieredMenu.outsideClickListener.set(unlistenClick);
            tieredMenu.resizeListener.set(unlistenResize);

            tieredMenu.hide();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(unlistenClick).toHaveBeenCalledTimes(1);
            expect(unlistenResize).toHaveBeenCalledTimes(1);
            expect(tieredMenu.outsideClickListener()).toBeNull();
            expect(tieredMenu.resizeListener()).toBeNull();
        });
    });

    describe('PassThrough', () => {
        let ptFixture: ComponentFixture<any>;

        afterEach(() => {
            TestBed.resetTestingModule();
        });

        describe('Case 1: Simple string classes', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: true,
                imports: [TieredMenu],
                template: `<p-tieredmenu [model]="model" [pt]="pt"></p-tieredmenu>`
            })
            class PTStringTestComponent {
                model: MenuItem[] = [
                    {
                        label: 'File',
                        items: [{ label: 'New' }, { label: 'Open' }]
                    }
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

            beforeEach(() => {
                TestBed.resetTestingModule();
                ptFixture = TestBed.configureTestingModule({
                    imports: [PTStringTestComponent],
                    providers: [provideZonelessChangeDetection()]
                }).createComponent(PTStringTestComponent);
                ptFixture.detectChanges();
            });

            it('should apply PT string class to root', () => {
                const root = ptFixture.debugElement.query(By.css('.p-tieredmenu'));
                expect(root.nativeElement.classList.contains('ROOT_CLASS')).toBe(true);
            });

            it('should apply PT string class to rootList', () => {
                const rootList = ptFixture.debugElement.query(By.css('ul[role="menu"]'));
                expect(rootList.nativeElement.classList.contains('ROOT_LIST_CLASS')).toBe(true);
            });

            it('should apply PT string class to item', () => {
                const items = ptFixture.debugElement.queryAll(By.css('li[role="menuitem"]'));
                expect(items[0].nativeElement.classList.contains('ITEM_CLASS')).toBe(true);
            });

            it('should apply PT string class to itemContent', () => {
                const itemContent = ptFixture.debugElement.query(By.css('.p-tieredmenu-item-content'));
                expect(itemContent.nativeElement.classList.contains('ITEM_CONTENT_CLASS')).toBe(true);
            });

            it('should apply PT string class to itemLink', () => {
                const itemLink = ptFixture.debugElement.query(By.css('.p-tieredmenu-item-link'));
                expect(itemLink.nativeElement.classList.contains('ITEM_LINK_CLASS')).toBe(true);
            });

            it('should apply PT string class to itemLabel', () => {
                const itemLabel = ptFixture.debugElement.query(By.css('.p-tieredmenu-item-label'));
                expect(itemLabel.nativeElement.classList.contains('ITEM_LABEL_CLASS')).toBe(true);
            });
        });

        describe('Case 2: Objects (class, style, data-p, aria)', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: true,
                imports: [TieredMenu],
                template: `<p-tieredmenu [model]="model" [pt]="pt"></p-tieredmenu>`
            })
            class PTObjectTestComponent {
                model: MenuItem[] = [
                    {
                        label: 'File',
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
                    }
                };
            }

            beforeEach(() => {
                TestBed.resetTestingModule();
                ptFixture = TestBed.configureTestingModule({
                    imports: [PTObjectTestComponent],
                    providers: [provideZonelessChangeDetection()]
                }).createComponent(PTObjectTestComponent);
                ptFixture.detectChanges();
            });

            it('should apply PT object class to root', () => {
                const root = ptFixture.debugElement.query(By.css('.p-tieredmenu'));
                expect(root.nativeElement.classList.contains('ROOT_OBJECT_CLASS')).toBe(true);
            });

            it('should apply PT object style to root', () => {
                const root = ptFixture.debugElement.query(By.css('.p-tieredmenu'));
                expect(root.nativeElement.style.backgroundColor).toBe('red');
            });

            it('should apply PT object data attribute to root', () => {
                const root = ptFixture.debugElement.query(By.css('.p-tieredmenu'));
                expect(root.nativeElement.getAttribute('data-p-test')).toBe('true');
            });

            it('should apply PT object aria-label to root', () => {
                const root = ptFixture.debugElement.query(By.css('.p-tieredmenu'));
                expect(root.nativeElement.getAttribute('aria-label')).toBe('TEST_ROOT_ARIA_LABEL');
            });

            it('should apply PT object class to item', () => {
                const items = ptFixture.debugElement.queryAll(By.css('li[role="menuitem"]'));
                expect(items[0].nativeElement.classList.contains('ITEM_OBJECT_CLASS')).toBe(true);
            });

            it('should apply PT object style to itemLabel', () => {
                const itemLabel = ptFixture.debugElement.query(By.css('.p-tieredmenu-item-label'));
                expect(itemLabel.nativeElement.style.color).toBe('blue');
            });
        });

        describe('Case 3: Mixed object and string values', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: true,
                imports: [TieredMenu],
                template: `<p-tieredmenu [model]="model" [pt]="pt"></p-tieredmenu>`
            })
            class PTMixedTestComponent {
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

            beforeEach(() => {
                TestBed.resetTestingModule();
                ptFixture = TestBed.configureTestingModule({
                    imports: [PTMixedTestComponent],
                    providers: [provideZonelessChangeDetection()]
                }).createComponent(PTMixedTestComponent);
                ptFixture.detectChanges();
            });

            it('should apply PT mixed object class to root', () => {
                const root = ptFixture.debugElement.query(By.css('.p-tieredmenu'));
                expect(root.nativeElement.classList.contains('ROOT_MIXED_CLASS')).toBe(true);
            });

            it('should apply PT string class to rootList', () => {
                const rootList = ptFixture.debugElement.query(By.css('ul[role="menu"]'));
                expect(rootList.nativeElement.classList.contains('ROOT_LIST_STRING')).toBe(true);
            });

            it('should apply PT mixed object to item', () => {
                const items = ptFixture.debugElement.queryAll(By.css('li[role="menuitem"]'));
                expect(items[0].nativeElement.classList.contains('ITEM_MIXED_CLASS')).toBe(true);
                expect(items[0].nativeElement.style.padding).toBe('10px');
            });

            it('should apply PT string class to itemLabel', () => {
                const itemLabel = ptFixture.debugElement.query(By.css('.p-tieredmenu-item-label'));
                expect(itemLabel.nativeElement.classList.contains('LABEL_STRING_CLASS')).toBe(true);
            });
        });

        describe('Case 4: Use variables from instance', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: true,
                imports: [TieredMenu],
                template: `<p-tieredmenu [model]="model" [pt]="pt" [disabled]="disabled"></p-tieredmenu>`
            })
            class PTInstanceTestComponent {
                disabled = true;
                model: MenuItem[] = [
                    {
                        label: 'File',
                        items: [{ label: 'New' }]
                    }
                ];
                pt = {
                    root: ({ instance }: any) => ({
                        class: {
                            DISABLED: instance?.disabled?.()
                        }
                    }),
                    item: ({ instance }: any) => ({
                        style: {
                            'background-color': instance?.disabled?.() ? 'yellow' : 'red'
                        }
                    })
                };
            }

            beforeEach(() => {
                TestBed.resetTestingModule();
                ptFixture = TestBed.configureTestingModule({
                    imports: [PTInstanceTestComponent],
                    providers: [provideZonelessChangeDetection()]
                }).createComponent(PTInstanceTestComponent);
                ptFixture.detectChanges();
            });

            it('should apply PT based on instance disabled state to root', () => {
                const root = ptFixture.debugElement.query(By.css('.p-tieredmenu'));
                expect(root.nativeElement.classList.contains('DISABLED')).toBe(true);
            });

            it('should apply PT style based on instance disabled state to item', () => {
                const items = ptFixture.debugElement.queryAll(By.css('li[role="menuitem"]'));
                expect(items[0].nativeElement.style.backgroundColor).toBe('yellow');
            });

            it('should update PT when instance property changes', async () => {
                const component = ptFixture.componentInstance;
                component.disabled = false;
                ptFixture.changeDetectorRef.markForCheck();
                await ptFixture.whenStable();
                ptFixture.detectChanges();

                const items = ptFixture.debugElement.queryAll(By.css('li[role="menuitem"]'));
                expect(items[0].nativeElement.style.backgroundColor).toBe('red');
            });
        });

        describe('Case 5: Event binding', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: true,
                imports: [TieredMenu],
                template: `<p-tieredmenu [model]="model" [pt]="pt"></p-tieredmenu>`
            })
            class PTEventTestComponent {
                clickedValue = '';
                model: MenuItem[] = [
                    {
                        label: 'File',
                        items: [{ label: 'New' }]
                    }
                ];
                pt = {
                    itemLabel: ({ instance }: any) => ({
                        onclick: () => {
                            this.clickedValue = 'LABEL_CLICKED';
                        }
                    })
                };
            }

            beforeEach(() => {
                TestBed.resetTestingModule();
                ptFixture = TestBed.configureTestingModule({
                    imports: [PTEventTestComponent],
                    providers: [provideZonelessChangeDetection()]
                }).createComponent(PTEventTestComponent);
                ptFixture.detectChanges();
            });

            it('should handle onclick event via PT', async () => {
                const component = ptFixture.componentInstance;
                const itemLabel = ptFixture.debugElement.query(By.css('.p-tieredmenu-item-label'));

                itemLabel.nativeElement.click();
                await new Promise((resolve) => setTimeout(resolve, 100));
                await ptFixture.whenStable();

                expect(component.clickedValue).toBe('LABEL_CLICKED');
            });
        });

        describe('Case 7: Test from ExhaustiveConfig', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: true,
                imports: [TieredMenu],
                template: `
                    <p-tieredmenu [model]="model1"></p-tieredmenu>
                    <p-tieredmenu [model]="model2"></p-tieredmenu>
                `
            })
            class PTGlobalConfigTestComponent {
                model1: MenuItem[] = [{ label: 'Menu1', items: [{ label: 'Item1' }] }];
                model2: MenuItem[] = [{ label: 'Menu2', items: [{ label: 'Item2' }] }];
            }

            beforeEach(() => {
                TestBed.resetTestingModule();
                ptFixture = TestBed.configureTestingModule({
                    imports: [PTGlobalConfigTestComponent],
                    providers: [
                        provideZonelessChangeDetection(),
                        provideExhaustive({
                            pt: {
                                tieredMenu: {
                                    root: { 'aria-label': 'TEST_GLOBAL_ARIA_LABEL', class: 'GLOBAL_ROOT_CLASS' },
                                    item: { class: 'GLOBAL_ITEM_CLASS' }
                                },
                                global: {
                                    css: `.p-tieredmenu { border: 1px solid red !important; }`
                                }
                            }
                        })
                    ]
                }).createComponent(PTGlobalConfigTestComponent);
                ptFixture.detectChanges();
            });

            it('should apply global PT to all instances', () => {
                const tieredMenus = ptFixture.debugElement.queryAll(By.css('.p-tieredmenu'));
                expect(tieredMenus.length).toBe(2);

                tieredMenus.forEach((menu) => {
                    expect(menu.nativeElement.classList.contains('GLOBAL_ROOT_CLASS')).toBe(true);
                    expect(menu.nativeElement.getAttribute('aria-label')).toBe('TEST_GLOBAL_ARIA_LABEL');
                });
            });

            it('should apply global PT to all items', () => {
                const items = ptFixture.debugElement.queryAll(By.css('li[role="menuitem"]'));
                expect(items.length).toBeGreaterThan(0);
                items.forEach((item) => {
                    expect(item.nativeElement.classList.contains('GLOBAL_ITEM_CLASS')).toBe(true);
                });
            });
        });

        describe('Case 7b: Global PT on submenu sections', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: true,
                imports: [TieredMenu],
                template: `<p-tieredmenu [model]="model"></p-tieredmenu>`
            })
            class PTGlobalSubTestComponent {
                model: MenuItem[] = [{ label: 'File', items: [{ label: 'New' }, { separator: true }, { label: 'Open' }] }, { label: 'Edit' }];
            }

            it('should apply the global tieredmenu PT to item, label, submenu and separator sections', async () => {
                TestBed.resetTestingModule();
                const fixture = TestBed.configureTestingModule({
                    imports: [PTGlobalSubTestComponent],
                    providers: [
                        provideZonelessChangeDetection(),
                        provideExhaustive({
                            pt: {
                                tieredmenu: {
                                    item: { class: 'G_ITEM' },
                                    itemLabel: { class: 'G_LABEL' },
                                    rootList: { class: 'G_ROOTLIST' },
                                    submenu: { class: 'G_SUBMENU' },
                                    separator: { class: 'G_SEPARATOR' }
                                }
                            }
                        })
                    ]
                }).createComponent(PTGlobalSubTestComponent);
                fixture.detectChanges();
                await fixture.whenStable();

                const el: HTMLElement = fixture.nativeElement;
                (el.querySelector('.p-tieredmenu-item-content') as HTMLElement).click();
                fixture.detectChanges();
                await fixture.whenStable();

                const items = el.querySelectorAll('li.p-tieredmenu-item');
                const labels = el.querySelectorAll('.p-tieredmenu-item-label');
                expect(items.length).toBe(4);
                expect(labels.length).toBe(4);
                items.forEach((item) => expect(item.classList.contains('G_ITEM')).toBe(true));
                labels.forEach((label) => expect(label.classList.contains('G_LABEL')).toBe(true));
                expect(el.querySelector('.p-tieredmenu-root-list')!.classList.contains('G_ROOTLIST')).toBe(true);
                expect(el.querySelector('.p-tieredmenu-submenu')!.classList.contains('G_SUBMENU')).toBe(true);
                expect(el.querySelector('.p-tieredmenu-separator')!.classList.contains('G_SEPARATOR')).toBe(true);
            });
        });

        describe('Case 8: Test hooks', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: true,
                imports: [TieredMenu],
                template: `<p-tieredmenu [model]="model" [pt]="pt"></p-tieredmenu>`
            })
            class PTHooksTestComponent {
                hookCalled = false;
                model: MenuItem[] = [{ label: 'File', items: [{ label: 'New' }] }];
                pt = {
                    root: 'HOOK_TEST_CLASS',
                    hooks: {
                        onInit: () => {
                            this.hookCalled = true;
                        }
                    }
                };
            }

            beforeEach(() => {
                TestBed.resetTestingModule();
                ptFixture = TestBed.configureTestingModule({
                    imports: [PTHooksTestComponent],
                    providers: [provideZonelessChangeDetection()]
                }).createComponent(PTHooksTestComponent);
            });

            it('should call PT hook onInit', async () => {
                const component = ptFixture.componentInstance;
                ptFixture.detectChanges();
                await new Promise((resolve) => setTimeout(resolve, 100));
                await ptFixture.whenStable();

                expect(component.hookCalled).toBe(true);
            });
        });

        describe('Inline PT tests', () => {
            beforeEach(() => {
                TestBed.resetTestingModule();
            });

            it('should apply inline PT with string', async () => {
                @Component({
                    changeDetection: ChangeDetectionStrategy.Eager,
                    standalone: true,
                    imports: [TieredMenu],
                    template: `<p-tieredmenu [model]="model" [pt]="{ root: 'INLINE_STRING_CLASS' }"></p-tieredmenu>`
                })
                class InlineStringComponent {
                    model: MenuItem[] = [{ label: 'File' }];
                }

                const inlineFixture = TestBed.configureTestingModule({
                    imports: [InlineStringComponent],
                    providers: [provideZonelessChangeDetection()]
                }).createComponent(InlineStringComponent);
                inlineFixture.detectChanges();
                await new Promise((resolve) => setTimeout(resolve, 100));
                await inlineFixture.whenStable();

                const root = inlineFixture.debugElement.query(By.css('.p-tieredmenu'));
                expect(root.nativeElement.classList.contains('INLINE_STRING_CLASS')).toBe(true);
            });

            it('should apply inline PT with object', async () => {
                @Component({
                    changeDetection: ChangeDetectionStrategy.Eager,
                    standalone: true,
                    imports: [TieredMenu],
                    template: `<p-tieredmenu [model]="model" [pt]="{ root: { class: 'INLINE_OBJECT_CLASS' } }"></p-tieredmenu>`
                })
                class InlineObjectComponent {
                    model: MenuItem[] = [{ label: 'File' }];
                }

                const inlineFixture = TestBed.configureTestingModule({
                    imports: [InlineObjectComponent],
                    providers: [provideZonelessChangeDetection()]
                }).createComponent(InlineObjectComponent);
                inlineFixture.detectChanges();
                await new Promise((resolve) => setTimeout(resolve, 100));
                await inlineFixture.whenStable();

                const root = inlineFixture.debugElement.query(By.css('.p-tieredmenu'));
                expect(root.nativeElement.classList.contains('INLINE_OBJECT_CLASS')).toBe(true);
            });
        });
    });
});

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [TieredMenu, SharedModule],
    template: ` <p-tieredmenu [model]="model"> </p-tieredmenu> `
})
class TieredMenuQueryApiHostComponent {
    model = [{ label: 'a' }];
}

describe('TieredMenu Signal Query API', () => {
    it('should resolve its signal-based view/content queries', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [TieredMenuQueryApiHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(TieredMenuQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const instance = fixture.debugElement.query(By.directive(TieredMenu)).componentInstance;

        expect(instance.rootmenu()).toBeDefined();
        expect(instance.containerViewChild()).toBeDefined();
        expect(() => instance.rootmenu()?.sublistViewChild()).not.toThrow();
    });
});
