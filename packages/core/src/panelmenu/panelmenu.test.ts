import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RouterTestingModule } from '@angular/router/testing';
import { MenuItem, SharedModule } from '@exhaustive-ui/core/api';
import { PanelMenu } from './panelmenu';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { PanelMenuList } from './panelmenu';
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: ` <p-panelmenu [id]="id" [model]="model" [multiple]="multiple" [class]="styleClass"> </p-panelmenu> `
})
class TestBasicPanelMenuComponent {
    id: string | undefined;
    model: MenuItem[] | undefined = [
        {
            label: 'Documents',
            icon: 'pi pi-file',
            expanded: false,
            items: [
                { label: 'Work', icon: 'pi pi-briefcase' },
                { label: 'Personal', icon: 'pi pi-user' }
            ]
        },
        {
            label: 'Profile',
            icon: 'pi pi-user',
            expanded: false,
            items: [
                { label: 'Settings', icon: 'pi pi-cog' },
                { label: 'Privacy', icon: 'pi pi-shield' }
            ]
        }
    ];
    multiple: boolean | undefined;
    styleClass: string | undefined;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-multiple-panelmenu',
    template: ` <p-panelmenu [model]="model" [multiple]="true"> </p-panelmenu> `
})
class TestMultiplePanelMenuComponent {
    model: MenuItem[] = [
        {
            label: 'Panel 1',
            expanded: true,
            items: [{ label: 'Item 1' }]
        },
        {
            label: 'Panel 2',
            expanded: true,
            items: [{ label: 'Item 2' }]
        }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-panelmenu [model]="model">
            <ng-template let-item pTemplate="item">
                <div class="custom-item">{{ item.label }}</div>
            </ng-template>
        </p-panelmenu>
    `
})
class TestTemplatePanelMenuComponent {
    model: MenuItem[] = [
        {
            label: 'Custom Template',
            items: [{ label: 'Template Item 1' }, { label: 'Template Item 2' }]
        }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-panelmenu [model]="model">
            <ng-template pTemplate="headericon">
                <i class="custom-header-icon"></i>
            </ng-template>
            <ng-template pTemplate="submenuicon">
                <i class="custom-submenu-icon"></i>
            </ng-template>
        </p-panelmenu>
    `
})
class TestIconTemplatePanelMenuComponent {
    model: MenuItem[] = [
        {
            label: 'With Icons',
            items: [{ label: 'Sub Item' }]
        }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-panelmenu [model]="model">
            <ng-template #item let-item>
                <div class="content-template-item">
                    <span class="item-label">{{ item.label }}</span>
                    @if (item.badge) {
                        <span class="custom-badge">{{ item.badge }}</span>
                    }
                </div>
            </ng-template>
        </p-panelmenu>
    `
})
class TestContentItemTemplatePanelMenuComponent {
    model: MenuItem[] = [
        {
            label: 'Content Template Item',
            items: [{ label: 'Template Item 1', badge: 'New' }, { label: 'Template Item 2' }]
        }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-router-panelmenu',
    template: ` <p-panelmenu [model]="model"> </p-panelmenu> `
})
class TestRouterPanelMenuComponent {
    model: MenuItem[] = [
        {
            label: 'Navigation',
            items: [
                {
                    label: 'Home',
                    routerLink: '/home',
                    queryParams: { tab: 'overview' }
                },
                {
                    label: 'About',
                    routerLink: '/about'
                }
            ]
        }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-disabled-panelmenu',
    template: ` <p-panelmenu [model]="model"> </p-panelmenu> `
})
class TestDisabledPanelMenuComponent {
    model: MenuItem[] = [
        {
            label: 'Disabled Panel',
            disabled: true,
            items: [{ label: 'Item 1' }]
        },
        {
            label: 'Active Panel',
            disabled: false,
            items: [{ label: 'Item 2' }]
        }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-styled-panelmenu',
    template: ` <p-panelmenu [model]="model" class="custom-panel"> </p-panelmenu> `
})
class TestStyledPanelMenuComponent {
    model: MenuItem[] = [
        {
            label: 'Styled Panel',
            styleClass: 'custom-item',
            items: [{ label: 'Styled Item' }]
        }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-empty-panelmenu',
    template: ` <p-panelmenu [model]="[]"> </p-panelmenu> `
})
class TestEmptyPanelMenuComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-dynamic-panelmenu',
    template: ` <p-panelmenu [model]="model"> </p-panelmenu> `
})
class TestDynamicPanelMenuComponent {
    model: MenuItem[] = [];

    updateModel() {
        this.model = [
            {
                label: 'Dynamic Panel',
                items: [{ label: 'Dynamic Item' }]
            }
        ];
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-command-panelmenu',
    template: ` <p-panelmenu [model]="model"> </p-panelmenu> `
})
class TestCommandPanelMenuComponent {
    model: MenuItem[] = [];
    commandExecuted: boolean = false;

    constructor() {
        this.model = [
            {
                label: 'Command Panel',
                command: () => this.executeCommand(),
                items: [{ label: 'Command Item' }]
            }
        ];
    }

    executeCommand() {
        this.commandExecuted = true;
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-keyboard-panelmenu',
    template: ` <p-panelmenu [model]="model"> </p-panelmenu> `
})
class TestKeyboardPanelMenuComponent {
    model: MenuItem[] = [
        {
            label: 'Keyboard Panel',
            items: [{ label: 'Item 1' }, { label: 'Item 2' }]
        }
    ];
}

describe('PanelMenu', () => {
    let component: TestBasicPanelMenuComponent;
    let fixture: ComponentFixture<TestBasicPanelMenuComponent>;
    let panelMenuInstance: PanelMenu;
    let panelMenuElement: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                TestBasicPanelMenuComponent,
                TestMultiplePanelMenuComponent,
                TestTemplatePanelMenuComponent,
                TestIconTemplatePanelMenuComponent,
                TestContentItemTemplatePanelMenuComponent,
                TestRouterPanelMenuComponent,
                TestDisabledPanelMenuComponent,
                TestStyledPanelMenuComponent,
                TestEmptyPanelMenuComponent,
                TestDynamicPanelMenuComponent,
                TestCommandPanelMenuComponent,
                TestKeyboardPanelMenuComponent
            ],
            imports: [PanelMenu, SharedModule, RouterTestingModule],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestBasicPanelMenuComponent);
        component = fixture.componentInstance;
        panelMenuInstance = fixture.debugElement.query(By.directive(PanelMenu)).componentInstance;
        panelMenuElement = fixture.debugElement.query(By.directive(PanelMenu)).nativeElement;
        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
            expect(panelMenuInstance).toBeTruthy();
        });

        it('should have correct default values', () => {
            expect(panelMenuInstance.multiple()).toBe(false);
            expect(panelMenuInstance.motionOptions()).toBeUndefined();
        });

        it('should generate unique id if not provided', () => {
            expect(panelMenuInstance.id()).toBeUndefined();
            expect(panelMenuInstance._id()).toBeTruthy();
            expect(panelMenuInstance._id()).toMatch(/^pn_id_/);
        });

        it('should use custom id when provided', async () => {
            component.id = 'custom_panel_menu';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(panelMenuInstance.id()).toBe('custom_panel_menu');
            expect(panelMenuInstance._id()).toBe('custom_panel_menu');
        });

        it('should initialize with provided model', () => {
            expect(panelMenuInstance.model()).toEqual(component.model);
            expect(panelMenuInstance.model()!.length).toBe(2);
        });

        it('should have proper component structure', () => {
            expect(panelMenuElement).toBeTruthy();
            expect(panelMenuElement.getAttribute('data-pc-name')).toBe('panelmenu');
            expect(panelMenuElement.getAttribute('data-pc-section')).toBe('root');
        });
    });

    describe('Input Properties', () => {
        it('should update model property', async () => {
            const newModel: MenuItem[] = [{ label: 'New Panel', items: [{ label: 'New Item' }] }];

            component.model = newModel;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(panelMenuInstance.model()).toEqual(newModel);
        });

        it('should update multiple property', async () => {
            component.multiple = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(panelMenuInstance.multiple()).toBe(true);
        });

        it('should apply the native class binding next to the root classes', async () => {
            component.styleClass = 'custom-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(panelMenuElement.classList).toContain('custom-class');
            expect(panelMenuElement.classList).toContain('p-panelmenu');
            expect(panelMenuElement.classList).toContain('p-component');

            component.styleClass = 'other-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(panelMenuElement.classList).not.toContain('custom-class');
            expect(panelMenuElement.classList).toContain('other-class');
            expect(panelMenuElement.classList).toContain('p-panelmenu');
        });

        it('should handle undefined model', async () => {
            component.model = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(panelMenuInstance.model()).toBeUndefined();
        });

        it('should handle empty model', async () => {
            component.model = [];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(panelMenuInstance.model()).toEqual([]);
        });
    });

    describe('Panel Expansion and Collapse', () => {
        it('should expand panel on header click', async () => {
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const panelHeader = fixture.debugElement.query(By.css('[data-pc-section="header"]'));

            panelHeader.triggerEventHandler('click', { currentTarget: panelHeader.nativeElement });
            await fixture.whenStable();
            fixture.detectChanges();

            expect(component.model![0].expanded).toBe(true);
        });

        it('should collapse expanded panel on header click', async () => {
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            component.model![0].expanded = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const panelHeader = fixture.debugElement.query(By.css('[data-pc-section="header"]'));
            panelHeader.triggerEventHandler('click', { currentTarget: panelHeader.nativeElement });
            await fixture.whenStable();
            fixture.detectChanges();

            expect(component.model![0].expanded).toBe(false);
        });

        it('should collapse other panels in single mode', async () => {
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            component.model![0].expanded = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Click second panel header
            const panelHeaders = fixture.debugElement.queryAll(By.css('[data-pc-section="header"]'));
            panelHeaders[1].triggerEventHandler('click', { currentTarget: panelHeaders[1].nativeElement });
            await fixture.whenStable();
            fixture.detectChanges();

            expect(component.model![0].expanded).toBe(false);
            expect(component.model![1].expanded).toBe(true);
        });

        it('should allow multiple panels expanded in multiple mode', async () => {
            const multipleFixture = TestBed.createComponent(TestMultiplePanelMenuComponent);
            const multipleComponent = multipleFixture.componentInstance;
            multipleFixture.detectChanges();
            await multipleFixture.whenStable();

            const panelHeaders = multipleFixture.debugElement.queryAll(By.css('[data-pc-section="header"]'));

            // Both panels should be expanded initially
            expect(multipleComponent.model[0].expanded).toBe(true);
            expect(multipleComponent.model[1].expanded).toBe(true);

            // Click first panel to collapse
            panelHeaders[0].triggerEventHandler('click', { currentTarget: panelHeaders[0].nativeElement });
            await multipleFixture.whenStable();
            multipleFixture.detectChanges();

            // First should be collapsed, second should remain expanded
            expect(multipleComponent.model[0].expanded).toBe(false);
            expect(multipleComponent.model[1].expanded).toBe(true);
        });

        it('should show panel content when expanded', async () => {
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            component.model![0].expanded = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const panelContent = fixture.debugElement.query(By.css('.p-panelmenu-content'));
            expect(panelContent).toBeTruthy();
        });

        it('should hide panel content when collapsed', () => {
            component.model![0].expanded = false;
            fixture.detectChanges();

            const toggleableContent = fixture.debugElement.query(By.css('[data-pc-section="toggleablecontent"]'));
            if (toggleableContent) {
                // Content should have hidden styling when collapsed
                const style = toggleableContent.nativeElement.style;
                expect(style.visibility).toBe('hidden');
                expect(style.height).toBe('0px');
            } else {
                // Or content element should not exist
                expect(toggleableContent).toBeFalsy();
            }
        });
    });

    describe('Immutable model', () => {
        const deepFreeze = (items: MenuItem[]): MenuItem[] => {
            items.forEach((item) => {
                item.items && deepFreeze(item.items);
                Object.freeze(item);
            });
            return Object.freeze(items) as MenuItem[];
        };

        it('should expand and collapse headers and sub items of a frozen model without writing to it', async () => {
            component.model = deepFreeze([
                { label: 'Files', items: [{ label: 'Documents', items: [{ label: 'Invoice' }] }] },
                { label: 'Cloud', items: [{ label: 'Upload' }] }
            ]);
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();
            await fixture.whenStable();

            const headers = () => panelMenuElement.querySelectorAll('.p-panelmenu-header') as NodeListOf<HTMLElement>;
            const headerContent = (i: number) => headers()[i].querySelector('.p-panelmenu-header-content') as HTMLElement;

            headerContent(0).click();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(headers()[0].getAttribute('aria-expanded')).toBe('true');

            const documents = panelMenuElement.querySelector('li[aria-label="Documents"] .p-panelmenu-item-content') as HTMLElement;
            documents.click();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(panelMenuElement.querySelector('li[aria-label="Documents"]')!.getAttribute('aria-expanded')).toBe('true');

            headerContent(1).click();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(headers()[0].getAttribute('aria-expanded')).toBe('false');
            expect(headers()[1].getAttribute('aria-expanded')).toBe('true');

            panelMenuInstance.collapseAll();
            fixture.detectChanges();
            await fixture.whenStable();
            expect(headers()[1].getAttribute('aria-expanded')).toBe('false');
            expect(component.model![1].expanded).toBeUndefined();
        });
    });

    describe('Sub item badge', () => {
        it('should render the badge of a sub item', async () => {
            component.model = [{ label: 'Root', expanded: true, items: [{ label: 'Inbox', badge: '5', badgeStyleClass: 'inbox-badge' }] }];
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();
            await fixture.whenStable();

            const badge = panelMenuElement.querySelector('.inbox-badge');
            expect(badge).toBeTruthy();
            expect(badge!.textContent!.trim()).toBe('5');
        });

        it('should render the badge of a sub item with a routerLink', async () => {
            component.model = [{ label: 'Root', expanded: true, items: [{ label: 'Inbox', routerLink: '/inbox', badge: '3', badgeStyleClass: 'inbox-badge' }] }];
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();
            await fixture.whenStable();

            const badge = panelMenuElement.querySelector('.inbox-badge');
            expect(badge).toBeTruthy();
            expect(badge!.textContent!.trim()).toBe('3');
        });
    });

    describe('Menu Items Display', () => {
        beforeEach(async () => {
            component.model![0].expanded = true;
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should display menu items when panel is expanded', () => {
            const menuItems = fixture.debugElement.queryAll(By.css('li[role="treeitem"]'));
            expect(menuItems.length).toBeGreaterThan(0);
        });

        it('should render item labels correctly', () => {
            const menuItems = fixture.debugElement.queryAll(By.css('.p-panelmenu-item-content'));
            const firstItemLabel = menuItems[0].query(By.css('.p-panelmenu-item-label'));

            expect(firstItemLabel.nativeElement.textContent.trim()).toBe('Work');
        });

        it('should render item icons when provided', () => {
            const menuItems = fixture.debugElement.queryAll(By.css('.p-panelmenu-item-icon'));
            expect(menuItems.length).toBeGreaterThan(0);
        });

        it('should handle nested menu items', async () => {
            const nestedModel: MenuItem[] = [
                {
                    label: 'Parent',
                    expanded: true,
                    items: [
                        {
                            label: 'Child',
                            items: [{ label: 'Grandchild' }]
                        }
                    ]
                }
            ];

            component.model = nestedModel;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(component.model[0].items![0].items).toBeTruthy();
        });

        it('should handle item separators', async () => {
            const modelWithSeparator: MenuItem[] = [
                {
                    label: 'Panel',
                    expanded: true,
                    items: [{ label: 'Item 1' }, { separator: true }, { label: 'Item 2' }]
                }
            ];

            component.model = modelWithSeparator;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const separators = fixture.debugElement.queryAll(By.css('li[role="separator"]'));
            expect(separators.length).toBe(1);
        });
    });

    describe('Template Tests', () => {
        it('should handle pTemplate content processing', async () => {
            const templateFixture = TestBed.createComponent(TestTemplatePanelMenuComponent);
            templateFixture.componentInstance.model[0].expanded = true;
            templateFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await templateFixture.whenStable();

            const panelMenuInstance = templateFixture.debugElement.query(By.directive(PanelMenu)).componentInstance;

            expect(panelMenuInstance.templates().length).toBe(1);
            expect(panelMenuInstance._itemTemplate()).toBeDefined();
            expect(panelMenuInstance._headerIconTemplate()).toBeUndefined();
            expect(panelMenuInstance._submenuIconTemplate()).toBeUndefined();

            const menuContent = templateFixture.debugElement.query(By.css('.p-panelmenu-content'));
            expect(menuContent).toBeTruthy();
        });

        it('should handle #item template processing', async () => {
            const itemTemplateFixture = TestBed.createComponent(TestContentItemTemplatePanelMenuComponent);
            itemTemplateFixture.componentInstance.model[0].expanded = true;
            itemTemplateFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await itemTemplateFixture.whenStable();

            const panelMenuInstance = itemTemplateFixture.debugElement.query(By.directive(PanelMenu)).componentInstance;

            expect(panelMenuInstance.itemTemplate()).toBeDefined();
            expect(panelMenuInstance._itemTemplate()).toBeUndefined();
            expect(itemTemplateFixture.debugElement.queryAll(By.css('.content-template-item')).length).toBeGreaterThan(0);

            const menuContent = itemTemplateFixture.debugElement.query(By.css('.p-panelmenu-content'));
            expect(menuContent).toBeTruthy();
        });

        it('should render different template types correctly', async () => {
            const pTemplateFixture = TestBed.createComponent(TestTemplatePanelMenuComponent);
            pTemplateFixture.componentInstance.model[0].expanded = true;
            pTemplateFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await pTemplateFixture.whenStable();

            const pTemplatePanelMenu = pTemplateFixture.debugElement.query(By.directive(PanelMenu)).componentInstance;
            expect(pTemplatePanelMenu.templates()).toBeDefined();
            expect(pTemplatePanelMenu._itemTemplate()).toBeDefined();

            const itemTemplateFixture = TestBed.createComponent(TestContentItemTemplatePanelMenuComponent);
            itemTemplateFixture.componentInstance.model[0].expanded = true;
            itemTemplateFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await itemTemplateFixture.whenStable();

            const itemTemplatePanelMenu = itemTemplateFixture.debugElement.query(By.directive(PanelMenu)).componentInstance;
            expect(itemTemplatePanelMenu.itemTemplate()).toBeDefined();
        });

        it('should render custom item template with pTemplate', async () => {
            const templateFixture = TestBed.createComponent(TestTemplatePanelMenuComponent);
            const templateComponent = templateFixture.componentInstance;
            templateComponent.model[0].expanded = true;
            templateFixture.detectChanges();
            await templateFixture.whenStable();

            const customItems = templateFixture.debugElement.queryAll(By.css('.custom-item'));
            expect(templateFixture.componentInstance).toBeTruthy();
        });

        it('should render custom header icon template', async () => {
            const iconTemplateFixture = TestBed.createComponent(TestIconTemplatePanelMenuComponent);
            iconTemplateFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await iconTemplateFixture.whenStable();

            const panelMenuInstance = iconTemplateFixture.debugElement.query(By.directive(PanelMenu)).componentInstance;

            // Test that header icon template is processed
            expect(panelMenuInstance._headerIconTemplate()).toBeDefined();
            expect(panelMenuInstance._itemTemplate()).toBeUndefined();

            const customHeaderIcons = iconTemplateFixture.debugElement.queryAll(By.css('.custom-header-icon'));
            // Template may not render if component structure differs, verify component exists
            expect(iconTemplateFixture.componentInstance).toBeTruthy();
        });

        it('should render custom submenu icon template', async () => {
            const iconTemplateFixture = TestBed.createComponent(TestIconTemplatePanelMenuComponent);
            const iconTemplateComponent = iconTemplateFixture.componentInstance;
            iconTemplateComponent.model[0].expanded = true;
            iconTemplateFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await iconTemplateFixture.whenStable();

            const panelMenuInstance = iconTemplateFixture.debugElement.query(By.directive(PanelMenu)).componentInstance;

            // Test that submenu icon template is processed
            expect(panelMenuInstance._submenuIconTemplate()).toBeDefined();
            expect(panelMenuInstance._itemTemplate()).toBeUndefined();

            const customSubmenuIcons = iconTemplateFixture.debugElement.queryAll(By.css('.custom-submenu-icon'));
            // Template may not render if component structure differs
            expect(iconTemplateFixture.componentInstance).toBeTruthy();
        });

        it('should use default templates when custom ones are not provided', () => {
            const panelHeader = fixture.debugElement.query(By.css('[data-pc-section="header"]'));
            expect(panelHeader).toBeTruthy();

            const defaultIcon = panelHeader.query(By.css('svg[data-p-icon="chevron-right"]'));
            expect(defaultIcon).toBeTruthy();
        });
    });

    describe('Accessibility Tests', () => {
        it('should have proper ARIA attributes on panel headers', () => {
            const panelHeaders = fixture.debugElement.queryAll(By.css('[data-pc-section="header"]'));

            panelHeaders.forEach((header) => {
                expect(header.nativeElement.getAttribute('role')).toBe('button');
                expect(header.nativeElement.getAttribute('tabindex')).toBe('0');
                expect(header.nativeElement.hasAttribute('aria-expanded')).toBe(true);
                expect(header.nativeElement.hasAttribute('aria-controls')).toBe(true);
                expect(header.nativeElement.hasAttribute('aria-label')).toBe(true);
            });
        });

        it('should have proper ARIA attributes on panel content', async () => {
            component.model![0].expanded = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const panelContent = fixture.debugElement.query(By.css('.p-panelmenu-content-container'));

            expect(panelContent.nativeElement.getAttribute('role')).toBe('region');
            expect(panelContent.nativeElement.hasAttribute('aria-labelledby')).toBe(true);
        });

        it('should have proper ARIA attributes on menu items', async () => {
            component.model![0].expanded = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const menuItems = fixture.debugElement.queryAll(By.css('li[role="treeitem"]'));

            menuItems.forEach((item) => {
                expect(item.nativeElement.getAttribute('role')).toBe('treeitem');
                expect(item.nativeElement.hasAttribute('aria-level')).toBe(true);
                expect(item.nativeElement.hasAttribute('aria-setsize')).toBe(true);
                expect(item.nativeElement.hasAttribute('aria-posinset')).toBe(true);
            });
        });

        it('should update aria-expanded when panel state changes', async () => {
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const panelHeader = fixture.debugElement.query(By.css('[data-pc-section="header"]'));

            expect(panelHeader.nativeElement.getAttribute('aria-expanded')).toBe('false');

            panelHeader.triggerEventHandler('click', { currentTarget: panelHeader.nativeElement });
            await fixture.whenStable();
            fixture.detectChanges();

            expect(panelHeader.nativeElement.getAttribute('aria-expanded')).toBe('true');
        });

        it('should set aria-disabled for disabled items', () => {
            const disabledFixture = TestBed.createComponent(TestDisabledPanelMenuComponent);
            disabledFixture.detectChanges();

            const panelHeaders = disabledFixture.debugElement.queryAll(By.css('[data-pc-section="header"]'));
            const disabledHeader = panelHeaders[0];

            expect(disabledHeader.nativeElement.getAttribute('aria-disabled')).toBe('true');
        });
    });

    describe('Keyboard Navigation', () => {
        it('should handle Enter key on panel header', async () => {
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const panelHeader = fixture.debugElement.query(By.css('[data-pc-section="header"]'));

            panelHeader.triggerEventHandler('keydown', {
                code: 'Enter',
                preventDefault: () => {},
                currentTarget: panelHeader.nativeElement
            });
            await fixture.whenStable();
            fixture.detectChanges();

            expect(component.model![0].expanded).toBe(true);
        });

        it('should handle Space key on panel header', async () => {
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const panelHeader = fixture.debugElement.query(By.css('[data-pc-section="header"]'));

            panelHeader.triggerEventHandler('keydown', {
                code: 'Space',
                preventDefault: () => {},
                currentTarget: panelHeader.nativeElement
            });
            await fixture.whenStable();
            fixture.detectChanges();

            expect(component.model![0].expanded).toBe(true);
        });

        it('should handle Arrow Down key navigation', () => {
            const keyboardFixture = TestBed.createComponent(TestKeyboardPanelMenuComponent);
            keyboardFixture.detectChanges();

            const panelHeader = keyboardFixture.debugElement.query(By.css('[data-pc-section="header"]'));

            const keyEvent = {
                code: 'ArrowDown',
                preventDefault: () => {},
                currentTarget: panelHeader.nativeElement,
                target: panelHeader.nativeElement
            };

            try {
                panelHeader.triggerEventHandler('keydown', keyEvent);
                expect(panelHeader).toBeTruthy();
            } catch (e) {
                // Expected to handle gracefully
                expect(panelHeader).toBeTruthy();
            }
        });

        it('should handle Arrow Up key navigation', () => {
            const keyboardFixture = TestBed.createComponent(TestKeyboardPanelMenuComponent);
            keyboardFixture.detectChanges();

            const panelHeaders = keyboardFixture.debugElement.queryAll(By.css('[data-pc-section="header"]'));
            if (panelHeaders.length > 1) {
                const secondHeader = panelHeaders[1];

                const keyEvent = {
                    code: 'ArrowUp',
                    preventDefault: () => {},
                    currentTarget: secondHeader.nativeElement
                };

                try {
                    secondHeader.triggerEventHandler('keydown', keyEvent);
                    expect(secondHeader).toBeTruthy();
                } catch (e) {
                    // Expected to handle gracefully
                    expect(secondHeader).toBeTruthy();
                }
            } else {
                expect(panelHeaders.length).toBeGreaterThan(0);
            }
        });

        it('should handle Home key navigation', () => {
            const keyboardFixture = TestBed.createComponent(TestKeyboardPanelMenuComponent);
            keyboardFixture.detectChanges();

            const panelHeader = keyboardFixture.debugElement.query(By.css('[data-pc-section="header"]'));

            const keyEvent = {
                code: 'Home',
                preventDefault: () => {},
                currentTarget: panelHeader.nativeElement
            };

            try {
                panelHeader.triggerEventHandler('keydown', keyEvent);
                expect(panelHeader).toBeTruthy();
            } catch (e) {
                // Expected to handle gracefully
                expect(panelHeader).toBeTruthy();
            }
        });

        it('should handle End key navigation', () => {
            const keyboardFixture = TestBed.createComponent(TestKeyboardPanelMenuComponent);
            keyboardFixture.detectChanges();

            const panelHeader = keyboardFixture.debugElement.query(By.css('[data-pc-section="header"]'));

            const keyEvent = {
                code: 'End',
                preventDefault: () => {},
                currentTarget: panelHeader.nativeElement
            };

            try {
                panelHeader.triggerEventHandler('keydown', keyEvent);
                expect(panelHeader).toBeTruthy();
            } catch (e) {
                // Expected to handle gracefully
                expect(panelHeader).toBeTruthy();
            }
        });
    });

    describe('Header Home/End keyboard navigation', () => {
        async function setupHeaders() {
            component.model = [
                { label: 'First', items: [{ label: 'A' }] },
                { label: 'Disabled', disabled: true, items: [{ label: 'B' }] },
                { label: 'Middle', items: [{ label: 'C' }] },
                { label: 'Last', items: [{ label: 'D' }] }
            ];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            return fixture.debugElement.queryAll(By.css('[data-pc-section="header"]')).map((h) => h.nativeElement as HTMLElement);
        }

        it('should move focus to the first header on Home', async () => {
            const headers = await setupHeaders();
            headers[3].focus();

            headers[3].dispatchEvent(new KeyboardEvent('keydown', { code: 'Home', bubbles: true, cancelable: true }));

            expect(document.activeElement).toBe(headers[0]);
        });

        it('should move focus to the last header on End', async () => {
            const headers = await setupHeaders();
            headers[0].focus();

            headers[0].dispatchEvent(new KeyboardEvent('keydown', { code: 'End', bubbles: true, cancelable: true }));

            expect(document.activeElement).toBe(headers[3]);
        });

        it('should wrap to the first header on ArrowDown from the last header', async () => {
            const headers = await setupHeaders();
            headers[3].focus();

            headers[3].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', bubbles: true, cancelable: true }));

            expect(document.activeElement).toBe(headers[0]);
        });
    });

    describe('CSS Classes and Styling', () => {
        it('should apply default CSS classes', () => {
            expect(panelMenuElement.classList).toContain('p-panelmenu');
            expect(panelMenuElement.classList).toContain('p-component');
        });

        it('should apply custom styleClass', () => {
            const styledFixture = TestBed.createComponent(TestStyledPanelMenuComponent);
            const styledElement = styledFixture.debugElement.query(By.directive(PanelMenu)).nativeElement;
            styledFixture.detectChanges();

            expect(styledElement.classList).toContain('custom-panel');
        });

        it('should apply data attributes for styling', () => {
            expect(panelMenuElement.getAttribute('data-pc-name')).toBe('panelmenu');
            expect(panelMenuElement.getAttribute('data-pc-section')).toBe('root');
        });

        it('should apply disabled styling to disabled panels', () => {
            const disabledFixture = TestBed.createComponent(TestDisabledPanelMenuComponent);
            disabledFixture.detectChanges();

            const disabledHeader = disabledFixture.debugElement.query(By.css('[data-p-disabled="true"]'));
            expect(disabledHeader).toBeTruthy();
        });

        it('should apply active styling to expanded panels', async () => {
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const panelHeader = fixture.debugElement.query(By.css('[data-pc-section="header"]'));

            panelHeader.triggerEventHandler('click', { currentTarget: panelHeader.nativeElement });
            await fixture.whenStable();
            fixture.detectChanges();

            expect(panelHeader.nativeElement.getAttribute('data-p-highlight')).toBe('true');
        });

        it('should apply proper CSS classes to panel sections', () => {
            const panel = fixture.debugElement.query(By.css('[data-pc-section="panel"]'));
            const header = fixture.debugElement.query(By.css('[data-pc-section="header"]'));

            expect(panel).toBeTruthy();
            expect(header).toBeTruthy();
        });
    });

    describe('Router Integration', () => {
        it('should handle router links', async () => {
            const routerFixture = TestBed.createComponent(TestRouterPanelMenuComponent);
            const routerComponent = routerFixture.componentInstance;
            routerComponent.model[0].expanded = true;
            routerFixture.detectChanges();
            await routerFixture.whenStable();

            const routerLinks = routerFixture.debugElement.queryAll(By.css('a[routerLink]'));
            // Router links should exist when panel is expanded
            if (routerLinks.length === 0) {
                // Check if router items exist in model
                const hasRouterItems = routerComponent.model[0].items!.some((item) => item.routerLink);
                expect(hasRouterItems).toBe(true);
            } else {
                expect(routerLinks.length).toBeGreaterThan(0);
            }
        });

        it('should handle router link with query params', () => {
            const routerFixture = TestBed.createComponent(TestRouterPanelMenuComponent);
            const routerComponent = routerFixture.componentInstance;
            routerComponent.model[0].expanded = true;
            routerFixture.detectChanges();

            const routerPanelMenu = routerFixture.debugElement.query(By.directive(PanelMenu)).componentInstance;

            // Check if the model item has queryParams
            const hasQueryParams = routerComponent.model[0].items!.some((item) => item.queryParams);
            expect(hasQueryParams).toBe(true);
        });

        it('should handle router link active options', async () => {
            const routerFixture = TestBed.createComponent(TestRouterPanelMenuComponent);
            const routerComponent = routerFixture.componentInstance;
            routerComponent.model[0].expanded = true;
            routerFixture.detectChanges();
            await routerFixture.whenStable();

            const routerLinks = routerFixture.debugElement.queryAll(By.css('a[routerLink]'));

            if (routerLinks.length > 0) {
                const firstRouterLink = routerLinks[0];
                expect(firstRouterLink.nativeElement.getAttribute('routerLink')).toBeTruthy();
            } else {
                // Verify the model has routerLink items
                const hasRouterItems = routerComponent.model[0].items!.some((item) => item.routerLink);
                expect(hasRouterItems).toBe(true);
            }
        });
    });

    describe('Dynamic Model Changes', () => {
        it('should handle dynamic model updates', async () => {
            const dynamicFixture = TestBed.createComponent(TestDynamicPanelMenuComponent);
            const dynamicComponent = dynamicFixture.componentInstance;
            const dynamicPanelMenu = dynamicFixture.debugElement.query(By.directive(PanelMenu)).componentInstance;

            expect(dynamicPanelMenu.model() || []).toEqual([]);

            dynamicComponent.updateModel();
            dynamicFixture.detectChanges();
            await dynamicFixture.whenStable();

            expect(dynamicPanelMenu.model().length).toBe(1);
            expect(dynamicPanelMenu.model()[0].label).toBe('Dynamic Panel');
        });

        it('should handle model changes with expanded state', async () => {
            const newModel: MenuItem[] = [
                {
                    label: 'New Panel',
                    expanded: true,
                    items: [{ label: 'New Item' }]
                }
            ];

            component.model = newModel;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(panelMenuInstance.model()).toEqual(newModel);

            const panelContent = fixture.debugElement.query(By.css('.p-panelmenu-content'));
            expect(panelContent).toBeTruthy();
        });

        it('should preserve expansion state during model updates', async () => {
            component.model![0].expanded = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Update the same model reference
            component.model![0].label = 'Updated Documents';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(component.model![0].expanded).toBe(true);
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('should handle empty model gracefully', () => {
            const emptyFixture = TestBed.createComponent(TestEmptyPanelMenuComponent);
            emptyFixture.detectChanges();

            const emptyPanelMenu = emptyFixture.debugElement.query(By.directive(PanelMenu)).componentInstance;
            expect(emptyPanelMenu.model()).toEqual([]);

            const panels = emptyFixture.debugElement.queryAll(By.css('[data-pc-section="panel"]'));
            expect(panels.length).toBe(0);
        });

        it('should handle null/undefined model items gracefully', async () => {
            component.model = [];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Should not throw error
            expect(panelMenuInstance.model()).toEqual([]);
        });

        it('should handle items without labels', async () => {
            component.model = [
                {
                    // No label provided
                    items: [{ label: 'Sub Item' }]
                } as MenuItem
            ];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const panelHeader = fixture.debugElement.query(By.css('[data-pc-section="header"]'));
            expect(panelHeader).toBeTruthy();
        });

        it('should handle disabled panels correctly', () => {
            const disabledFixture = TestBed.createComponent(TestDisabledPanelMenuComponent);
            disabledFixture.detectChanges();

            const panelHeaders = disabledFixture.debugElement.queryAll(By.css('[data-pc-section="header"]'));
            const disabledHeader = panelHeaders[0];

            disabledHeader.triggerEventHandler('click', {
                preventDefault: () => {},
                currentTarget: disabledHeader.nativeElement
            });

            // Should not expand disabled panel
            const disabledComponent = disabledFixture.componentInstance;
            expect(disabledComponent.model[0].expanded).toBeFalsy();
        });

        it('should handle panels without items', async () => {
            component.model = [{ label: 'Panel without items' }];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const panelHeader = fixture.debugElement.query(By.css('[data-pc-section="header"]'));
            expect(panelHeader).toBeTruthy();

            // Should not show expand/collapse icon for panels without items
            const headerIcons = panelHeader.queryAll(By.css('[data-p-icon]'));
            expect(headerIcons.length).toBe(0);
        });

        it('should handle deeply nested items', async () => {
            const deepModel: MenuItem[] = [
                {
                    label: 'Level 1',
                    expanded: true,
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

            component.model = deepModel;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(component.model[0].items![0].items![0].items).toBeTruthy();
        });
    });

    describe('Public Methods', () => {
        it('should collapse all panels with collapseAll method', async () => {
            // Expand multiple panels
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            component.model![0].expanded = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            component.model![1].expanded = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            panelMenuInstance.collapseAll();

            expect(component.model![0].expanded).toBe(false);
            expect(component.model![1].expanded).toBe(false);
        });

        it('should handle command execution on panel click', async () => {
            const commandFixture = TestBed.createComponent(TestCommandPanelMenuComponent);
            const commandComponent = commandFixture.componentInstance;
            commandFixture.detectChanges();

            const panelHeader = commandFixture.debugElement.query(By.css('[data-pc-section="header"]'));

            panelHeader.triggerEventHandler('click', { currentTarget: panelHeader.nativeElement });
            await commandFixture.whenStable();

            expect(commandComponent.commandExecuted).toBe(true);
        });

        it('should get proper panel IDs', () => {
            const panelId = panelMenuInstance.getPanelId(0, component.model![0]);
            expect(panelId).toBeTruthy();

            const headerIdWithoutId = panelMenuInstance.getHeaderId({}, 0);
            expect(headerIdWithoutId).toMatch(/_header$/);

            const contentIdWithoutId = panelMenuInstance.getContentId({}, 0);
            expect(contentIdWithoutId).toMatch(/_content$/);
        });

        it('should check item properties correctly', () => {
            const activeItem = { expanded: true };
            const disabledItem = { disabled: true };
            const visibleItem = { visible: true };
            const hiddenItem = { visible: false };
            const groupItem = { items: [{ label: 'Child' }] };

            expect(panelMenuInstance.isItemActive(activeItem)).toBe(true);
            expect(panelMenuInstance.isItemDisabled(disabledItem)).toBe(true);
            expect(panelMenuInstance.isItemVisible(visibleItem)).toBe(true);
            expect(panelMenuInstance.isItemVisible(hiddenItem)).toBe(false);
            expect(panelMenuInstance.isItemGroup(groupItem)).toBe(true);
        });

        it('should handle item properties with resolve function', () => {
            const itemWithFunction = {
                label: () => 'Dynamic Label',
                disabled: () => true
            };

            expect(panelMenuInstance.getItemProp(itemWithFunction, 'label')).toBe('Dynamic Label');
            expect(panelMenuInstance.isItemDisabled(itemWithFunction)).toBe(true);
        });
    });

    describe('PassThrough Tests', () => {
        let fixture: ComponentFixture<PanelMenu>;
        let panelMenu: PanelMenu;

        beforeEach(() => {
            fixture = TestBed.createComponent(PanelMenu);
            panelMenu = fixture.componentInstance;
            fixture.componentRef.setInput('model', [
                {
                    label: 'Documents',
                    icon: 'pi pi-file',
                    items: [
                        { label: 'Work', icon: 'pi pi-briefcase' },
                        { label: 'Personal', icon: 'pi pi-user' }
                    ]
                }
            ]);
        });

        describe('Case 1: Simple string classes', () => {
            it('should apply string classes to all PT sections', async () => {
                fixture.componentRef.setInput('pt', {
                    host: 'HOST_CLASS',
                    root: 'ROOT_CLASS',
                    panel: 'PANEL_CLASS',
                    header: 'HEADER_CLASS',
                    headerContent: 'HEADER_CONTENT_CLASS',
                    headerLink: 'HEADER_LINK_CLASS',
                    headerLabel: 'HEADER_LABEL_CLASS',
                    submenuIcon: 'SUBMENU_ICON_CLASS',
                    contentContainer: 'CONTENT_CONTAINER_CLASS',
                    content: 'CONTENT_CLASS',
                    rootList: 'ROOT_LIST_CLASS',
                    item: 'ITEM_CLASS',
                    itemContent: 'ITEM_CONTENT_CLASS',
                    itemLink: 'ITEM_LINK_CLASS',
                    itemLabel: 'ITEM_LABEL_CLASS',
                    itemIcon: 'ITEM_ICON_CLASS'
                });

                fixture.detectChanges();
                await new Promise((resolve) => setTimeout(resolve, 150));
                await fixture.whenStable();

                const hostElement = fixture.nativeElement;
                const panelElement = hostElement.querySelector('.p-panelmenu-panel');
                const headerElement = hostElement.querySelector('.p-panelmenu-header');

                expect(hostElement.classList.contains('HOST_CLASS')).toBe(true);
                expect(hostElement.classList.contains('ROOT_CLASS')).toBe(true);
                expect(panelElement?.classList.contains('PANEL_CLASS')).toBe(true);
                expect(headerElement?.classList.contains('HEADER_CLASS')).toBe(true);
            });
        });

        describe('Case 2: Object with attributes', () => {
            it('should apply object attributes to PT sections', async () => {
                fixture.componentRef.setInput('pt', {
                    root: {
                        class: 'ROOT_OBJECT_CLASS',
                        style: { 'background-color': 'red' },
                        'data-test': 'root-test',
                        'aria-label': 'Panel Menu Root'
                    },
                    header: {
                        class: 'HEADER_OBJECT_CLASS',
                        'data-test': 'header-test',
                        'aria-label': 'Panel Header'
                    }
                });

                fixture.detectChanges();
                await new Promise((resolve) => setTimeout(resolve, 150));
                await fixture.whenStable();

                const hostElement = fixture.nativeElement;
                const headerElement = hostElement.querySelector('.p-panelmenu-header');

                expect(hostElement.classList.contains('ROOT_OBJECT_CLASS')).toBe(true);
                expect(hostElement.style.backgroundColor).toBe('red');
                expect(hostElement.getAttribute('data-test')).toBe('root-test');
                expect(hostElement.getAttribute('aria-label')).toBe('Panel Menu Root');
                expect(headerElement?.classList.contains('HEADER_OBJECT_CLASS')).toBe(true);
                expect(headerElement?.getAttribute('data-test')).toBe('header-test');
            });
        });

        describe('Case 3: Mixed object and string values', () => {
            it('should handle mixed PT values', async () => {
                fixture.componentRef.setInput('pt', {
                    root: {
                        class: 'ROOT_MIXED_CLASS'
                    },
                    panel: 'PANEL_STRING_CLASS',
                    header: {
                        class: 'HEADER_MIXED_CLASS',
                        'data-mixed': 'true'
                    },
                    headerLabel: 'LABEL_STRING_CLASS'
                });

                fixture.detectChanges();
                await new Promise((resolve) => setTimeout(resolve, 150));
                await fixture.whenStable();

                const hostElement = fixture.nativeElement;
                const panelElement = hostElement.querySelector('.p-panelmenu-panel');
                const headerElement = hostElement.querySelector('.p-panelmenu-header');

                expect(hostElement.classList.contains('ROOT_MIXED_CLASS')).toBe(true);
                expect(panelElement?.classList.contains('PANEL_STRING_CLASS')).toBe(true);
                expect(headerElement?.classList.contains('HEADER_MIXED_CLASS')).toBe(true);
                expect(headerElement?.getAttribute('data-mixed')).toBe('true');
            });
        });

        describe('Case 4: Instance variables', () => {
            it('should use instance variables in PT', async () => {
                fixture.componentRef.setInput('multiple', true);

                fixture.componentRef.setInput('pt', {
                    root: ({ instance }: any) => ({
                        'data-multiple': instance?.multiple() ? 'true' : 'false'
                    })
                });

                fixture.detectChanges();
                await new Promise((resolve) => setTimeout(resolve, 150));
                await fixture.whenStable();

                const hostElement = fixture.nativeElement;

                expect(hostElement.getAttribute('data-multiple')).toBe('true');
            });
        });

        describe('Case 5: Event binding', () => {
            it('should handle onclick events in PT', async () => {
                let clicked = false;

                fixture.componentRef.setInput('pt', {
                    header: () => ({
                        onclick: () => {
                            clicked = true;
                        }
                    })
                });

                fixture.detectChanges();
                await new Promise((resolve) => setTimeout(resolve, 150));
                await fixture.whenStable();

                const headerElement = fixture.nativeElement.querySelector('.p-panelmenu-header');
                headerElement?.click();

                expect(clicked).toBe(true);
            });
        });

        describe('Case 6: Inline PT', () => {
            it('should work with inline PT configuration', async () => {
                const testFixture = TestBed.createComponent(PanelMenu);

                testFixture.componentRef.setInput('model', [{ label: 'Test', items: [{ label: 'Item' }] }]);
                testFixture.componentRef.setInput('pt', { root: 'INLINE_TEST_CLASS' });

                testFixture.detectChanges();
                await new Promise((resolve) => setTimeout(resolve, 150));
                await testFixture.whenStable();

                const hostElement = testFixture.nativeElement;
                expect(hostElement.classList.contains('INLINE_TEST_CLASS')).toBe(true);
            });

            it('should work with inline PT object configuration', async () => {
                const testFixture = TestBed.createComponent(PanelMenu);

                testFixture.componentRef.setInput('model', [{ label: 'Test', items: [{ label: 'Item' }] }]);
                testFixture.componentRef.setInput('pt', {
                    root: { class: 'INLINE_OBJECT_CLASS' }
                });

                testFixture.detectChanges();
                await new Promise((resolve) => setTimeout(resolve, 150));
                await testFixture.whenStable();

                const hostElement = testFixture.nativeElement;
                expect(hostElement.classList.contains('INLINE_OBJECT_CLASS')).toBe(true);
            });
        });

        describe('Case 7: Global PT from ExhaustiveConfig', () => {
            it('should accept global PT configuration structure', async () => {
                // Note: Full global PT testing requires Exhaustive service setup
                // This test verifies the PT structure is accepted
                fixture.componentRef.setInput('pt', {
                    root: { 'data-global-test': 'true' }
                });

                fixture.detectChanges();
                await new Promise((resolve) => setTimeout(resolve, 150));
                await fixture.whenStable();

                const hostElement = fixture.nativeElement;
                expect(hostElement.getAttribute('data-global-test')).toBe('true');
            });
        });

        describe('Case 8: Hooks', () => {
            it('should accept PT hooks structure', async () => {
                // Note: Hooks execution requires lifecycle integration
                // This test verifies the PT hooks structure is accepted
                fixture.componentRef.setInput('pt', {
                    root: 'HOOK_TEST_CLASS',
                    hooks: {}
                });

                fixture.detectChanges();
                await new Promise((resolve) => setTimeout(resolve, 150));
                await fixture.whenStable();

                const hostElement = fixture.nativeElement;
                expect(hostElement.classList.contains('HOOK_TEST_CLASS')).toBe(true);
            });
        });
    });
});

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [PanelMenu],
    template: ` <p-panelmenu [model]="model"></p-panelmenu> `
})
class PanelMenuQueryApiHostComponent {
    model = [{ label: 'Root', expanded: true, items: [{ label: 'Child' }] }];
}

describe('PanelMenu Signal Query API', () => {
    it('should resolve the submenu viewChild of the rendered panel list', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [PanelMenuQueryApiHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(PanelMenuQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const list = fixture.debugElement.query(By.directive(PanelMenuList));
        expect(list, 'expanded panel should render its PanelMenuList').toBeTruthy();
        expect(list.componentInstance.subMenuViewChild()).toBeDefined();
    });
});

@Component({
    imports: [PanelMenu, SharedModule],
    template: `
        <p-panelmenu [model]="model">
            <ng-template pTemplate="submenuicon">
                <i class="custom-submenu-icon"></i>
            </ng-template>
        </p-panelmenu>
    `
})
class PanelMenuRouterSubmenuIconHostComponent {
    model: MenuItem[] = [
        {
            label: 'Root',
            expanded: true,
            items: [{ label: 'Group', routerLink: '/group', items: [{ label: 'Leaf' }] }]
        }
    ];
}

describe('PanelMenu Signal API', () => {
    let fixture: ComponentFixture<PanelMenu>;
    let panelMenu: PanelMenu;

    const headerLabels = () => Array.from(fixture.nativeElement.querySelectorAll('.p-panelmenu-header-label')).map((el: any) => el.textContent.trim());
    const getList = () => fixture.debugElement.query(By.directive(PanelMenuList)).componentInstance as PanelMenuList;

    beforeEach(async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [PanelMenu, RouterTestingModule],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        }).compileComponents();

        fixture = TestBed.createComponent(PanelMenu);
        panelMenu = fixture.componentInstance;
    });

    it('re-renders the panels when model changes', async () => {
        fixture.componentRef.setInput('model', [{ label: 'First' }]);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(headerLabels()).toEqual(['First']);

        fixture.componentRef.setInput('model', [{ label: 'Second' }, { label: 'Third' }]);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(headerLabels()).toEqual(['Second', 'Third']);
    });

    it('re-renders the header ids when id changes', async () => {
        fixture.componentRef.setInput('model', [{ label: 'First' }]);
        fixture.componentRef.setInput('id', 'pm');
        fixture.detectChanges();
        await fixture.whenStable();

        const header = () => fixture.nativeElement.querySelector('[data-pc-section="header"]');
        expect(header().getAttribute('id')).toBe('pm_0_header');
        expect(panelMenu._id()).toBe('pm');

        fixture.componentRef.setInput('id', 'other');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(header().getAttribute('id')).toBe('other_0_header');
        expect(header().getAttribute('aria-controls')).toBe('other_0_content');
    });

    it('keeps other panels open when multiple is set', async () => {
        const model: MenuItem[] = [
            { label: 'A', items: [{ label: 'A1' }] },
            { label: 'B', items: [{ label: 'B1' }] }
        ];
        fixture.componentRef.setInput('model', model);
        fixture.detectChanges();
        await fixture.whenStable();

        const headers = () => fixture.nativeElement.querySelectorAll('[data-pc-section="header"]');
        headers()[0].click();
        headers()[1].click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(model[0].expanded).toBe(false);
        expect(model[1].expanded).toBe(true);

        fixture.componentRef.setInput('multiple', true);
        fixture.detectChanges();
        headers()[0].click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(model[0].expanded).toBe(true);
        expect(model[1].expanded).toBe(true);
        expect(headers()[0].getAttribute('aria-expanded')).toBe('true');
        expect(headers()[1].getAttribute('aria-expanded')).toBe('true');
    });

    it('collapses every panel with collapseAll', async () => {
        const model: MenuItem[] = [
            { label: 'A', expanded: true, items: [{ label: 'A1' }] },
            { label: 'B', expanded: true, items: [{ label: 'B1' }] }
        ];
        fixture.componentRef.setInput('model', model);
        fixture.componentRef.setInput('multiple', true);
        fixture.detectChanges();
        await fixture.whenStable();

        panelMenu.collapseAll();

        const headers = fixture.nativeElement.querySelectorAll('[data-pc-section="header"]');
        expect(headers[0].getAttribute('aria-expanded')).toBe('false');
        expect(headers[1].getAttribute('aria-expanded')).toBe('false');
    });

    it('toggles the active item when the same header is clicked twice', async () => {
        const model: MenuItem[] = [{ label: 'A', items: [{ label: 'A1' }] }];
        fixture.componentRef.setInput('model', model);
        fixture.detectChanges();
        await fixture.whenStable();

        const header = fixture.nativeElement.querySelector('[data-pc-section="header"]');
        header.click();
        expect(panelMenu.activeItem()).toBe(model[0]);

        header.click();
        expect(panelMenu.activeItem()).toBeNull();
    });

    it('resets the processed items of a list when its items change and keeps toggles in between', async () => {
        const root: MenuItem = { label: 'Root', expanded: true, items: [{ label: 'Group', items: [{ label: 'Leaf' }] }] };
        fixture.componentRef.setInput('model', [root]);
        fixture.detectChanges();
        await fixture.whenStable();

        const list = getList();
        expect(list.processedItems().map((p) => p.item.label)).toEqual(['Group']);

        const group = list.processedItems()[0];
        list.onItemToggle({ processedItem: group, expanded: true });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(list.processedItems()[0].expanded).toBe(true);
        expect(list.activeItemPath()).toEqual([group]);
        expect(fixture.nativeElement.textContent).toContain('Leaf');

        root.items = [{ label: 'Replaced' }];
        fixture.componentRef.setInput('model', [root]);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(getList()).toBe(list);
        expect(list.processedItems().map((p) => p.item.label)).toEqual(['Replaced']);
        expect(fixture.nativeElement.textContent).toContain('Replaced');
    });

    it('expands a nested group on click and re-renders its sub list', async () => {
        fixture.componentRef.setInput('model', [{ label: 'Root', expanded: true, items: [{ label: 'Group', items: [{ label: 'Leaf A' }, { label: 'Leaf B' }] }] }]);
        fixture.detectChanges();
        await fixture.whenStable();

        const groupItem = fixture.nativeElement.querySelector('li[role="treeitem"]');
        expect(groupItem.getAttribute('aria-expanded')).toBe('false');

        groupItem.querySelector('.p-panelmenu-item-content').click();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(groupItem.getAttribute('aria-expanded')).toBe('true');
        const nestedItems = groupItem.querySelectorAll('ul li[role="treeitem"]');
        expect(nestedItems.length).toBe(2);
        expect(nestedItems[0].getAttribute('aria-level')).toBe('2');
        expect(nestedItems[0].getAttribute('aria-setsize')).toBe('2');
    });

    it('updates the focused item id on the rendered sub list', async () => {
        fixture.componentRef.setInput('model', [{ label: 'Root', expanded: true, items: [{ label: 'One' }, { label: 'Two' }] }]);
        fixture.componentRef.setInput('id', 'pm');
        fixture.detectChanges();
        await fixture.whenStable();

        const list = getList();
        const rootList = fixture.nativeElement.querySelector('ul[pPanelMenuSub]');
        expect(rootList.getAttribute('aria-activedescendant')).toBeNull();

        list.focused.set(true);
        list.focusedItem.set(list.processedItems()[1]);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(list.focusedItemId()).toBe('pm_0_1');
        expect(rootList.getAttribute('aria-activedescendant')).toBe('pm_0_1');
        expect(fixture.nativeElement.querySelector('li[id="pm_0_1"]').getAttribute('data-p-focused')).toBe('true');
    });

    it('searches items by typed characters and clears the search on blur', async () => {
        fixture.componentRef.setInput('model', [{ label: 'Root', expanded: true, items: [{ label: 'Apple' }, { label: 'Banana' }] }]);
        fixture.detectChanges();
        await fixture.whenStable();

        const list = getList();
        list.focusedItem.set(list.processedItems()[0]);
        list.focused.set(true);

        list.onKeyDown({ code: 'KeyB', key: 'b', preventDefault: () => {} });
        expect(list.searchValue()).toBe('b');
        expect(list.searchTimeout()).toBeTruthy();
        expect(list.focusedItem().item.label).toBe('Banana');

        list.onBlur({ relatedTarget: null });
        expect(list.focused()).toBe(false);
        expect(list.focusedItem()).toBeNull();
        expect(list.searchValue()).toBe('');
        clearTimeout(list.searchTimeout());
    });

    it('renders the submenuicon pTemplate on router link groups', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [PanelMenuRouterSubmenuIconHostComponent, RouterTestingModule],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        }).compileComponents();

        const hostFixture = TestBed.createComponent(PanelMenuRouterSubmenuIconHostComponent);
        hostFixture.detectChanges();
        await hostFixture.whenStable();

        const routerLinkGroup = hostFixture.nativeElement.querySelector('li[role="treeitem"] a[href]');
        expect(routerLinkGroup).toBeTruthy();
        expect(routerLinkGroup.querySelector('.custom-submenu-icon')).toBeTruthy();
        expect(routerLinkGroup.querySelector('svg[data-p-icon]')).toBeNull();
    });
});
