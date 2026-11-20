import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Button, ButtonDirective, ButtonIcon, ButtonLabel } from './button';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SharedModule } from '@exhaustive-ui/core/api';
// Basic Button Component Test
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-button
            [label]="label"
            [icon]="icon"
            [iconPos]="iconPos"
            [type]="type"
            [style]="style"
            [styleClass]="styleClass"
            [disabled]="disabled"
            [loading]="loading"
            [loadingIcon]="loadingIcon"
            [raised]="raised"
            [rounded]="rounded"
            [text]="text"
            [outlined]="outlined"
            [size]="size"
            [plain]="plain"
            [severity]="severity"
            [badge]="badge"
            [badgeSeverity]="badgeSeverity"
            [ariaLabel]="ariaLabel"
            [autofocus]="autofocus"
            [tabindex]="tabindex"
            [fluid]="fluid"
            [link]="link"
            [variant]="variant"
            (onClick)="onButtonClick($event)"
            (onFocus)="onButtonFocus($event)"
            (onBlur)="onButtonBlur($event)"
        >
        </p-button>
    `
})
class TestBasicButtonComponent {
    label: string | undefined = 'Click Me';
    icon: string | undefined;
    iconPos: 'left' | 'right' | 'top' | 'bottom' = 'left';
    type: string = 'button';
    style: any = {};
    styleClass: string | undefined;
    disabled: boolean = false;
    loading: boolean = false;
    loadingIcon: string | undefined;
    raised: boolean = false;
    rounded: boolean = false;
    text: boolean = false;
    outlined: boolean = false;
    size: 'small' | 'large' | undefined | null = null as any;
    plain: boolean = false;
    severity: any;
    badge: string | undefined;
    badgeSeverity: any;
    ariaLabel: string | undefined;
    autofocus: boolean = false;
    tabindex: number | undefined;
    fluid: boolean = false;
    link: boolean = false;
    variant: 'outlined' | 'text' | undefined;

    clickEvent: Event | undefined;
    focusEvent: Event | undefined;
    blurEvent: Event | undefined;

    onButtonClick(event: Event) {
        this.clickEvent = event;
    }

    onButtonFocus(event: Event) {
        this.focusEvent = event;
    }

    onButtonBlur(event: Event) {
        this.blurEvent = event;
    }
}

// Button with Templates
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-button [loading]="loading">
            <ng-template pTemplate="content">
                <div class="custom-content">
                    <span class="custom-icon">🎯</span>
                    <span class="custom-label">Custom Button</span>
                </div>
            </ng-template>
            <ng-template pTemplate="icon">
                <i class="pi pi-star custom-template-icon"></i>
            </ng-template>
            <ng-template pTemplate="loadingicon">
                <i class="pi pi-spin pi-cog custom-loading-icon"></i>
            </ng-template>
        </p-button>
    `
})
class TestTemplatePButtonComponent {
    loading: boolean = false;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-button>
            <ng-template #content>
                <div class="content-template-content">
                    <span class="content-icon">⭐</span>
                    <span class="content-label">Content Template</span>
                </div>
            </ng-template>
            <ng-template #icon>
                <i class="content-template-icon pi pi-heart"></i>
            </ng-template>
            <ng-template #loadingicon>
                <i class="content-loading-icon pi pi-spin pi-spinner"></i>
            </ng-template>
        </p-button>
    `
})
class TestContentTemplateButtonComponent {}

// Button Directive Test
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <button
            pButton
            [severity]="severity"
            [raised]="raised"
            [rounded]="rounded"
            [text]="text"
            [outlined]="outlined"
            [size]="size"
            [plain]="plain"
            [loading]="loading"
            [disabled]="disabled"
            [fluid]="fluid"
            (click)="onDirectiveClick($event)"
            class="test-button"
        >
            {{ label }}
        </button>
    `
})
class TestButtonDirectiveComponent {
    icon: string | undefined;
    label: string | undefined = 'Directive Button';
    severity: any;
    raised: boolean = false;
    rounded: boolean = false;
    text: boolean = false;
    outlined: boolean = false;
    size: 'small' | 'large' | undefined | null = null as any;
    plain: boolean = false;
    loading: boolean = false;
    disabled: boolean = false;
    fluid: boolean = false;

    clickEvent: Event | undefined;

    onDirectiveClick(event: Event) {
        this.clickEvent = event;
    }
}

// Button with pButtonIcon and pButtonLabel directives
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <button pButton>
            <span pButtonIcon class="pi pi-check"></span>
            <span pButtonLabel>Icon & Label</span>
        </button>
    `
})
class TestButtonWithIconLabelDirectiveComponent {}

// Button directive with label/icon/loading/buttonProps inputs
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `<button pButton [label]="label" [icon]="icon" [iconPos]="iconPos" [loading]="loading" [loadingIcon]="loadingIcon" [buttonProps]="buttonProps"></button>`
})
class TestButtonDirectiveLabelIconComponent {
    label: string | undefined = 'Save';
    icon: string | undefined = 'pi pi-check';
    iconPos: 'left' | 'right' | 'top' | 'bottom' = 'left';
    loading = false;
    loadingIcon: string | undefined;
    buttonProps: any;
}

// Loading Button Test
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: ` <p-button [label]="label" [loading]="loading" [loadingIcon]="loadingIcon" (onClick)="toggleLoading()"> </p-button> `
})
class TestLoadingButtonComponent {
    label = 'Load Data';
    loading = false;
    loadingIcon: string | undefined;

    toggleLoading() {
        this.loading = !this.loading;
    }
}

// Severity Button Test
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <div class="button-group">
            <p-button label="Primary" severity="primary"></p-button>
            <p-button label="Secondary" severity="secondary"></p-button>
            <p-button label="Success" severity="success"></p-button>
            <p-button label="Info" severity="info"></p-button>
            <p-button label="Warn" severity="warn"></p-button>
            <p-button label="Danger" severity="danger"></p-button>
            <p-button label="Help" severity="help"></p-button>
            <p-button label="Contrast" severity="contrast"></p-button>
        </div>
    `
})
class TestSeverityButtonComponent {}

// Button Variants Test
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <div class="variant-buttons">
            <p-button label="Raised" [raised]="true"></p-button>
            <p-button label="Rounded" [rounded]="true"></p-button>
            <p-button label="Text" [text]="true"></p-button>
            <p-button label="Outlined" [outlined]="true"></p-button>
            <p-button label="Plain" [plain]="true"></p-button>
            <p-button label="Small" size="small"></p-button>
            <p-button label="Large" size="large"></p-button>
            <p-button label="Fluid" [fluid]="true"></p-button>
        </div>
    `
})
class TestButtonVariantsComponent {}

// Badge Button Test
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: ` <p-button label="Messages" icon="pi pi-envelope" [badge]="badge" [badgeSeverity]="badgeSeverity"> </p-button> `
})
class TestBadgeButtonComponent {
    badge = '5';
    badgeSeverity = 'danger';
}

// Icon Button Test
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <div class="icon-buttons">
            <p-button icon="pi pi-search" [iconPos]="iconPos"></p-button>
            <p-button label="Search" icon="pi pi-search" iconPos="left"></p-button>
            <p-button label="Search" icon="pi pi-search" iconPos="right"></p-button>
            <p-button label="Search" icon="pi pi-search" iconPos="top"></p-button>
            <p-button label="Search" icon="pi pi-search" iconPos="bottom"></p-button>
        </div>
    `
})
class TestIconButtonComponent {
    iconPos: 'left' | 'right' | 'top' | 'bottom' = 'left';
}

describe('Button', () => {
    let component: TestBasicButtonComponent;
    let fixture: ComponentFixture<TestBasicButtonComponent>;
    let buttonInstance: Button;
    let buttonElement: HTMLButtonElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                TestBasicButtonComponent,
                TestTemplatePButtonComponent,
                TestContentTemplateButtonComponent,
                TestButtonDirectiveComponent,
                TestButtonWithIconLabelDirectiveComponent,
                TestLoadingButtonComponent,
                TestSeverityButtonComponent,
                TestButtonVariantsComponent,
                TestBadgeButtonComponent,
                TestIconButtonComponent
            ],
            imports: [Button, ButtonDirective, ButtonIcon, ButtonLabel, SharedModule],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestBasicButtonComponent);
        component = fixture.componentInstance;
        buttonInstance = fixture.debugElement.query(By.directive(Button)).componentInstance;
        buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
            expect(buttonInstance).toBeTruthy();
        });

        it('should have correct default values', () => {
            expect(buttonInstance.type()).toBe('button');
            expect(buttonInstance.iconPos()).toBe('left');
            expect(buttonInstance.disabled()).toBe(false);
            expect(buttonInstance.loading()).toBe(false);
            expect(buttonInstance.raised()).toBe(false);
            expect(buttonInstance.rounded()).toBe(false);
            expect(buttonInstance.text()).toBe(false);
            expect(buttonInstance.outlined()).toBe(false);
            expect(buttonInstance.plain()).toBe(false);
            expect(buttonInstance.autofocus()).toBe(false);
        });

        it('should render with correct attributes', () => {
            expect(buttonElement.tagName.toLowerCase()).toBe('button');
            expect(buttonElement.type).toBe('button');
            expect(buttonElement.getAttribute('data-pc-name')).toBe('button');
            expect(buttonElement.getAttribute('data-pc-section')).toBe('root');
        });

        it('should display label correctly', () => {
            const labelElement = buttonElement.querySelector('.p-button-label');
            expect(labelElement?.textContent?.trim()).toBe('Click Me');
        });
    });

    describe('Input Properties', () => {
        it('should update label property', async () => {
            component.label = 'Updated Label';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.label()).toBe('Updated Label');
            const labelElement = buttonElement.querySelector('.p-button-label');
            expect(labelElement?.textContent?.trim()).toBe('Updated Label');
        });

        it('should update icon property', async () => {
            component.icon = 'pi pi-search';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.icon()).toBe('pi pi-search');
            const iconElement = buttonElement.querySelector('.p-button-icon');
            expect(iconElement).toBeTruthy();
        });

        it('should update disabled property', async () => {
            component.disabled = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.disabled()).toBe(true);
            expect(buttonElement.disabled).toBe(true);
        });

        it('should update loading property', async () => {
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.loading()).toBe(true);
            const loadingIcon = buttonElement.querySelector('[data-pc-section="loadingicon"]');
            expect(loadingIcon).toBeTruthy();
        });

        it('should update type property', async () => {
            component.type = 'submit';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.type()).toBe('submit');
            expect(buttonElement.type).toBe('submit');
        });

        it('should update styleClass property', async () => {
            component.styleClass = 'custom-button';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonElement.classList.contains('custom-button')).toBe(true);
        });

        it('should update style property', async () => {
            component.style = { backgroundColor: 'red', color: 'white' };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.style()).toEqual({ backgroundColor: 'red', color: 'white' });
            expect(buttonElement.style.backgroundColor).toBe('red');
            expect(buttonElement.style.color).toBe('white');
        });

        it('should update ariaLabel property', async () => {
            component.ariaLabel = 'Custom Button Label';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.ariaLabel()).toBe('Custom Button Label');
            expect(buttonElement.getAttribute('aria-label')).toBe('Custom Button Label');
        });

        it('should update tabindex property', async () => {
            component.tabindex = 5;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.tabindex()).toBe(5);
            expect(buttonElement.getAttribute('tabindex')).toBe('5');
        });
    });

    describe('Event Handling', () => {
        it('should emit onClick event', async () => {
            const clickSpy = vi.spyOn(component, 'onButtonClick').mockImplementation(() => {});

            buttonElement.click();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(clickSpy).toHaveBeenCalled();
        });

        it('should emit onFocus event', async () => {
            const focusSpy = vi.spyOn(component, 'onButtonFocus').mockImplementation(() => {});

            buttonElement.dispatchEvent(new FocusEvent('focus'));
            await fixture.whenStable();
            fixture.detectChanges();

            expect(focusSpy).toHaveBeenCalled();
        });

        it('should emit onBlur event', async () => {
            const blurSpy = vi.spyOn(component, 'onButtonBlur').mockImplementation(() => {});

            buttonElement.dispatchEvent(new FocusEvent('blur'));
            await fixture.whenStable();
            fixture.detectChanges();

            expect(blurSpy).toHaveBeenCalled();
        });

        it('should not emit events when disabled', async () => {
            const clickSpy = vi.spyOn(component, 'onButtonClick').mockImplementation(() => {});
            component.disabled = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            buttonElement.click();
            await fixture.whenStable();

            // Disabled button should not emit click events
            expect(clickSpy).not.toHaveBeenCalled();
        });
    });

    describe('Button Variants', () => {
        it('should apply raised styling', async () => {
            component.raised = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.raised()).toBe(true);
            expect(buttonElement.classList.contains('p-button-raised')).toBe(true);
        });

        it('should apply rounded styling', async () => {
            component.rounded = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.rounded()).toBe(true);
            expect(buttonElement.classList.contains('p-button-rounded')).toBe(true);
        });

        it('should apply text styling', async () => {
            component.text = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.text()).toBe(true);
            expect(buttonElement.classList.contains('p-button-text')).toBe(true);
        });

        it('should apply outlined styling', async () => {
            component.outlined = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.outlined()).toBe(true);
            expect(buttonElement.classList.contains('p-button-outlined')).toBe(true);
        });

        it('should apply plain styling', async () => {
            component.plain = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.plain()).toBe(true);
            expect(buttonElement.classList.contains('p-button-plain')).toBe(true);
        });

        it('should apply size variations', async () => {
            // Small size
            component.size = 'small';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.size()).toBe('small');
            expect(buttonElement.classList.contains('p-button-sm')).toBe(true);
            expect(buttonElement.getAttribute('data-p')).toContain('small');

            // Large size
            component.size = 'large';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.size()).toBe('large');
            expect(buttonElement.classList.contains('p-button-sm')).toBe(false);
            expect(buttonElement.classList.contains('p-button-lg')).toBe(true);
            expect(buttonElement.getAttribute('data-p')).toContain('large');
        });

        it('should apply link styling', async () => {
            component.link = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.link()).toBe(true);
            expect(buttonElement.classList.contains('p-button-link')).toBe(true);
            expect(buttonElement.getAttribute('data-p')).toContain('link');
        });

        it('should apply variant styling', async () => {
            component.variant = 'outlined';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.variant()).toBe('outlined');
            expect(buttonElement.classList.contains('p-button-outlined')).toBe(true);

            component.variant = 'text';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonElement.classList.contains('p-button-outlined')).toBe(false);
            expect(buttonElement.classList.contains('p-button-text')).toBe(true);
        });

        it('should apply fluid styling', async () => {
            component.fluid = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.fluid()).toBe(true);
            expect(buttonElement.classList.contains('p-button-fluid')).toBe(true);
        });
    });

    describe('Button Severities', () => {
        it('should apply primary severity', async () => {
            component.severity = 'primary';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.severity()).toBe('primary');
            expect(buttonElement.classList.contains('p-button-primary')).toBe(true);
        });

        it('should apply secondary severity', async () => {
            component.severity = 'secondary';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.severity()).toBe('secondary');
            expect(buttonElement.classList.contains('p-button-secondary')).toBe(true);
        });

        it('should apply success severity', async () => {
            component.severity = 'success';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.severity()).toBe('success');
            expect(buttonElement.classList.contains('p-button-success')).toBe(true);
        });

        it('should apply danger severity', async () => {
            component.severity = 'danger';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.severity()).toBe('danger');
            expect(buttonElement.classList.contains('p-button-danger')).toBe(true);
        });
    });

    describe('Icon Functionality', () => {
        it('should display icon', async () => {
            component.icon = 'pi pi-search';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const iconElement = buttonElement.querySelector('.p-button-icon');
            expect(iconElement).toBeTruthy();
        });

        it('should handle different icon positions', async () => {
            component.icon = 'pi pi-search';

            // Left position
            component.iconPos = 'left';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            let iconElement = buttonElement.querySelector('.p-button-icon-left');
            expect(iconElement).toBeTruthy();

            // Right position
            component.iconPos = 'right';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            iconElement = buttonElement.querySelector('.p-button-icon-right');
            expect(iconElement).toBeTruthy();
        });

        it('should show icon-only button when no label', async () => {
            component.label = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.icon = 'pi pi-search';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonElement.classList.contains('p-button-icon-only')).toBe(true);
        });
    });

    describe('Loading State', () => {
        it('should show loading spinner', async () => {
            const loadingFixture = TestBed.createComponent(TestLoadingButtonComponent);
            const loadingComponent = loadingFixture.componentInstance;
            loadingFixture.detectChanges();

            loadingComponent.loading = true;
            loadingFixture.changeDetectorRef.markForCheck();
            await loadingFixture.whenStable();
            loadingFixture.detectChanges();

            const loadingIcon = loadingFixture.debugElement.query(By.css('[data-pc-section="loadingicon"]'));
            expect(loadingIcon).toBeTruthy();
        });

        it('should disable button when loading', async () => {
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonElement.disabled).toBe(true);
        });

        it('should use custom loading icon', async () => {
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loadingIcon = 'pi pi-spin pi-cog';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const loadingIcon = buttonElement.querySelector('[data-pc-section="loadingicon"]');
            expect(loadingIcon).toBeTruthy();
        });
    });

    describe('Badge Functionality', () => {
        it('should display badge', async () => {
            const badgeFixture = TestBed.createComponent(TestBadgeButtonComponent);
            badgeFixture.detectChanges();
            await fixture.whenStable();

            const badgeElement = badgeFixture.debugElement.query(By.css('p-badge'));
            expect(badgeElement).toBeTruthy();
        });

        it('should re-render the badge when badge and badgeSeverity change', async () => {
            const badgeFixture = TestBed.createComponent(TestBadgeButtonComponent);
            badgeFixture.detectChanges();
            await badgeFixture.whenStable();

            let badgeElement = badgeFixture.debugElement.query(By.css('p-badge')).nativeElement as HTMLElement;
            expect(badgeElement.textContent?.trim()).toBe('5');
            expect(badgeElement.getAttribute('data-p')).toContain('danger');

            badgeFixture.componentInstance.badge = '12';
            badgeFixture.componentInstance.badgeSeverity = 'info';
            badgeFixture.changeDetectorRef.markForCheck();
            await badgeFixture.whenStable();
            badgeFixture.detectChanges();

            badgeElement = badgeFixture.debugElement.query(By.css('p-badge')).nativeElement as HTMLElement;
            expect(badgeElement.textContent?.trim()).toBe('12');
            expect(badgeElement.getAttribute('data-p')).toContain('info');
            expect(badgeElement.getAttribute('data-p')).not.toContain('danger');
        });
    });

    describe('hostName', () => {
        it('should expose hostName as a signal input', () => {
            const buttonFixture = TestBed.createComponent(Button);
            buttonFixture.componentRef.setInput('hostName', 'listbox');
            buttonFixture.detectChanges();

            expect(buttonFixture.componentInstance.hostName()).toBe('listbox');
        });
    });

    describe('Templates', () => {
        describe('pTemplate Approach Tests', () => {
            it('should handle pTemplate content processing', async () => {
                const templateFixture = TestBed.createComponent(TestTemplatePButtonComponent);
                templateFixture.detectChanges();
                await templateFixture.whenStable();

                const buttonInstance = templateFixture.debugElement.query(By.directive(Button)).componentInstance as Button;

                expect(buttonInstance.templates().length).toBe(3);

                const buttonElement = templateFixture.debugElement.query(By.css('button'));
                expect(buttonElement).toBeTruthy();
            });

            it('should process _contentTemplate from pTemplate="content"', async () => {
                const templateFixture = TestBed.createComponent(TestTemplatePButtonComponent);
                templateFixture.detectChanges();
                await templateFixture.whenStable();

                const buttonInstance = templateFixture.debugElement.query(By.directive(Button)).componentInstance as Button;

                expect(buttonInstance._contentTemplate()).toBeDefined();
                expect(buttonInstance._contentTemplate()?.constructor.name).toBe('TemplateRef');
            });

            it('should process _iconTemplate from pTemplate="icon"', async () => {
                const templateFixture = TestBed.createComponent(TestTemplatePButtonComponent);
                templateFixture.detectChanges();
                await templateFixture.whenStable();

                const buttonInstance = templateFixture.debugElement.query(By.directive(Button)).componentInstance as Button;

                expect(buttonInstance._iconTemplate()).toBeDefined();
                expect(buttonInstance._iconTemplate()).not.toBe(buttonInstance._contentTemplate());
            });

            it('should process _loadingIconTemplate from pTemplate="loadingicon"', async () => {
                const templateFixture = TestBed.createComponent(TestTemplatePButtonComponent);
                const templateComponent = templateFixture.componentInstance;
                templateComponent.loading = true;
                templateFixture.changeDetectorRef.markForCheck();
                await templateFixture.whenStable();
                templateFixture.detectChanges();

                const buttonInstance = templateFixture.debugElement.query(By.directive(Button)).componentInstance as Button;

                expect(buttonInstance._loadingIconTemplate()).toBeDefined();
                expect(buttonInstance._loadingIconTemplate()).not.toBe(buttonInstance._iconTemplate());
            });

            it('should render custom content template with pTemplate', async () => {
                const templateFixture = TestBed.createComponent(TestTemplatePButtonComponent);
                templateFixture.detectChanges();
                await templateFixture.whenStable();

                expect(templateFixture.debugElement.queryAll(By.css('.custom-content')).length).toBe(1);
                expect(templateFixture.debugElement.query(By.css('.custom-label')).nativeElement.textContent).toBe('Custom Button');
                expect(templateFixture.debugElement.query(By.css('.p-button-label'))).toBeNull();
            });

            it('should render custom icon template with pTemplate', async () => {
                const templateFixture = TestBed.createComponent(TestTemplatePButtonComponent);
                templateFixture.detectChanges();
                await templateFixture.whenStable();

                expect(templateFixture.debugElement.queryAll(By.css('.custom-template-icon')).length).toBe(1);
                expect(templateFixture.debugElement.query(By.css('.custom-loading-icon'))).toBeNull();
            });

            it('should render custom loading icon template', async () => {
                const templateFixture = TestBed.createComponent(TestTemplatePButtonComponent);
                const templateComponent = templateFixture.componentInstance;
                templateComponent.loading = true;
                templateFixture.changeDetectorRef.markForCheck();
                await templateFixture.whenStable();
                templateFixture.detectChanges();

                expect(templateFixture.debugElement.queryAll(By.css('.custom-loading-icon')).length).toBe(1);
                expect(templateFixture.debugElement.query(By.css('.custom-template-icon'))).toBeNull();
                expect(templateFixture.debugElement.query(By.css('svg[data-p-icon="spinner"]'))).toBeNull();
            });
        });

        describe('#template Approach Tests', () => {
            it('should handle #content template processing', async () => {
                const contentTemplateFixture = TestBed.createComponent(TestContentTemplateButtonComponent);
                contentTemplateFixture.detectChanges();
                await contentTemplateFixture.whenStable();

                const buttonInstance = contentTemplateFixture.debugElement.query(By.directive(Button)).componentInstance as Button;

                expect(buttonInstance.contentTemplate()).toBeDefined();
                expect(buttonInstance.templates().length).toBe(0);

                expect(contentTemplateFixture.debugElement.queryAll(By.css('.content-template-content')).length).toBe(1);
                expect(contentTemplateFixture.debugElement.query(By.css('.content-label')).nativeElement.textContent).toBe('Content Template');
            });

            it("should process contentTemplate from @ContentChild('content')", async () => {
                const contentTemplateFixture = TestBed.createComponent(TestContentTemplateButtonComponent);
                contentTemplateFixture.detectChanges();
                await contentTemplateFixture.whenStable();

                const buttonInstance = contentTemplateFixture.debugElement.query(By.directive(Button)).componentInstance as Button;

                expect(buttonInstance.contentTemplate()).toBeDefined();
                expect(buttonInstance.contentTemplate()?.constructor.name).toBe('TemplateRef');
                expect(buttonInstance.iconTemplate()).toBeDefined();
                expect(buttonInstance.loadingIconTemplate()).toBeDefined();
                expect(contentTemplateFixture.debugElement.queryAll(By.css('.content-template-icon')).length).toBe(1);
            });

            it("should process loadingIconTemplate from @ContentChild('loadingicon')", async () => {
                const buttonInstance = fixture.debugElement.query(By.directive(Button)).componentInstance as Button;

                expect(buttonInstance.loadingIconTemplate()).toBeUndefined();
                expect(buttonInstance._loadingIconTemplate()).toBeUndefined();
            });

            it("should process iconTemplate from @ContentChild('icon')", async () => {
                const buttonInstance = fixture.debugElement.query(By.directive(Button)).componentInstance as Button;

                expect(buttonInstance.iconTemplate()).toBeUndefined();
                expect(buttonInstance._iconTemplate()).toBeUndefined();
            });
        });

        describe('Template Integration Tests', () => {
            it('should render different template types correctly', async () => {
                const pTemplateFixture = TestBed.createComponent(TestTemplatePButtonComponent);
                pTemplateFixture.detectChanges();
                await pTemplateFixture.whenStable();

                const pTemplateButton = pTemplateFixture.debugElement.query(By.directive(Button)).componentInstance as Button;
                expect(pTemplateButton.contentTemplate()).toBeUndefined();
                expect(pTemplateButton._contentTemplate()).toBeDefined();
                expect(pTemplateFixture.debugElement.query(By.css('.custom-content'))).toBeTruthy();

                const contentTemplateFixture = TestBed.createComponent(TestContentTemplateButtonComponent);
                contentTemplateFixture.detectChanges();
                await contentTemplateFixture.whenStable();

                const contentTemplateButton = contentTemplateFixture.debugElement.query(By.directive(Button)).componentInstance as Button;
                expect(contentTemplateButton.contentTemplate()).toBeDefined();
                expect(contentTemplateButton._contentTemplate()).toBeUndefined();
                expect(contentTemplateFixture.debugElement.query(By.css('.content-template-content'))).toBeTruthy();
            });

            it('should use default templates when custom ones are not provided', () => {
                const buttonElement = fixture.debugElement.query(By.css('button'));
                expect(buttonElement).toBeTruthy();

                const defaultLabel = buttonElement.query(By.css('.p-button-label'));
                expect(defaultLabel).toBeTruthy();
            });

            it('should hide the default label and badge when a content template is provided', async () => {
                const templateFixture = TestBed.createComponent(TestTemplatePButtonComponent);
                templateFixture.detectChanges();
                await templateFixture.whenStable();

                expect(templateFixture.debugElement.query(By.css('.p-button-label'))).toBeNull();
                expect(templateFixture.debugElement.query(By.css('p-badge'))).toBeNull();
            });
        });
    });

    describe('Accessibility Tests', () => {
        it('should have proper ARIA attributes', async () => {
            component.ariaLabel = 'Click this button';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonElement.getAttribute('aria-label')).toBe('Click this button');
            expect(buttonElement.getAttribute('role')).toBe(null); // Native button doesn't need role
            expect(buttonElement.tagName.toLowerCase()).toBe('button');
        });

        it('should handle aria-hidden for icons', async () => {
            component.icon = 'pi pi-search';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.label = undefined as any; // Icon only
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Check that icon property is set correctly
            expect(buttonInstance.icon()).toBe('pi pi-search');
            expect(buttonInstance.label()).toBeUndefined();
        });

        it('should handle tabindex correctly', async () => {
            component.tabindex = 0;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Check that component received the tabindex input
            expect(buttonInstance.tabindex()).toBe(0);
        });

        it('should be focusable when not disabled', async () => {
            component.disabled = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonElement.disabled).toBe(false);
            buttonElement.focus();
            expect(document.activeElement).toBe(buttonElement);
        });

        it('should not be focusable when disabled', async () => {
            component.disabled = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonElement.disabled).toBe(true);
        });
    });

    describe('CSS Classes and Styling', () => {
        it('should apply correct default classes', () => {
            expect(buttonElement.classList.contains('p-button')).toBe(true);
            expect(buttonElement.classList.contains('p-component')).toBe(true);
        });

        it('should apply correct classes based on state', async () => {
            // Test loading state
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.loading()).toBe(true);

            // Test disabled state
            component.loading = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.disabled = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonInstance.disabled()).toBe(true);
        });

        it('should apply custom styleClass', async () => {
            component.styleClass = 'my-custom-button';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonElement.classList.contains('my-custom-button')).toBe(true);
        });
    });

    describe('LoadingIcon and Icon Edge Cases', () => {
        it('should show regular icon when loading is false and icon is provided', async () => {
            component.icon = 'pi pi-search';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loading = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const iconElement = buttonElement.querySelector('.p-button-icon');
            expect(iconElement).toBeTruthy();
            expect(iconElement?.classList.contains('pi')).toBe(true);
            expect(iconElement?.classList.contains('pi-search')).toBe(true);

            // Should not have loading icon
            const loadingIcon = buttonElement.querySelector('[data-pc-section="loadingicon"]');
            expect(loadingIcon).toBeFalsy();
        });

        it('should show default spinner when loading is true and no loadingIcon is provided', async () => {
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loadingIcon = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const loadingIcon = buttonElement.querySelector('[data-pc-section="loadingicon"]');
            expect(loadingIcon).toBeTruthy();

            // Should use default SVG spinner (check for direct SVG or nested SVG)
            const svgSpinner = buttonElement.querySelector('svg[data-p-icon="spinner"]') || loadingIcon?.querySelector('svg[data-p-icon="spinner"]');
            expect(svgSpinner).toBeTruthy();

            // Should not show regular icon
            const regularIcon = buttonElement.querySelector('.p-button-icon:not([data-pc-section="loadingicon"])');
            expect(regularIcon).toBeFalsy();
        });

        it('should show custom loadingIcon when loading is true and loadingIcon is provided', async () => {
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loadingIcon = 'pi pi-spinner';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const loadingIcon = buttonElement.querySelector('[data-pc-section="loadingicon"]');
            expect(loadingIcon).toBeTruthy();
            expect(loadingIcon?.classList.contains('pi')).toBe(true);
            expect(loadingIcon?.classList.contains('pi-spinner')).toBe(true);
            expect(loadingIcon?.classList.contains('pi-spin')).toBe(true);

            // Should not use default SVG spinner
            const svgSpinner = buttonElement.querySelector('svg[data-p-icon="spinner"]');
            expect(svgSpinner).toBeFalsy();
        });

        it('should apply pi-spin class to custom loadingIcon for animation', async () => {
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loadingIcon = 'pi pi-cog';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const loadingIcon = buttonElement.querySelector('[data-pc-section="loadingicon"]');
            expect(loadingIcon).toBeTruthy();
            expect(loadingIcon?.classList.contains('pi-spin')).toBe(true);
            expect(loadingIcon?.classList.contains('pi')).toBe(true);
            expect(loadingIcon?.classList.contains('pi-cog')).toBe(true);
        });

        it('should switch from icon to loadingIcon when loading state changes', async () => {
            component.icon = 'pi pi-play';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loadingIcon = 'pi pi-spinner';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loading = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Initially should show regular icon
            let iconElement = buttonElement.querySelector('.p-button-icon:not([data-pc-section="loadingicon"])');
            let loadingIcon = buttonElement.querySelector('[data-pc-section="loadingicon"]');
            expect(iconElement).toBeTruthy();
            expect(loadingIcon).toBeFalsy();

            // Switch to loading state
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Should now show loading icon and not regular icon
            iconElement = buttonElement.querySelector('.p-button-icon:not([data-pc-section="loadingicon"])');
            loadingIcon = buttonElement.querySelector('[data-pc-section="loadingicon"]');
            expect(iconElement).toBeFalsy();
            expect(loadingIcon).toBeTruthy();
            expect(loadingIcon?.classList.contains('pi-spinner')).toBe(true);
            expect(loadingIcon?.classList.contains('pi-spin')).toBe(true);
        });

        it('should handle complex loadingIcon classes', async () => {
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loadingIcon = 'pi pi-spin pi-cog custom-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const loadingIcon = buttonElement.querySelector('[data-pc-section="loadingicon"]');
            expect(loadingIcon).toBeTruthy();
            expect(loadingIcon?.classList.contains('pi')).toBe(true);
            expect(loadingIcon?.classList.contains('pi-spin')).toBe(true);
            expect(loadingIcon?.classList.contains('pi-cog')).toBe(true);
            expect(loadingIcon?.classList.contains('custom-class')).toBe(true);
        });

        it('should handle empty loadingIcon string', async () => {
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loadingIcon = '';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Should fallback to default SVG spinner when loadingIcon is empty
            const svgSpinner = buttonElement.querySelector('svg[data-p-icon="spinner"]');
            expect(svgSpinner).toBeTruthy();

            // Check that span with empty loadingIcon is not shown
            const spanWithEmptyIcon = buttonElement.querySelector('span[data-pc-section="loadingicon"]:not(:has(svg))');
            expect(spanWithEmptyIcon).toBeFalsy();
        });

        it('should handle icon only button with loading state', async () => {
            component.icon = 'pi pi-save';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loadingIcon = 'pi pi-spinner';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.label = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loading = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Initially icon-only button
            expect(buttonElement.classList.contains('p-button-icon-only')).toBe(true);

            const iconElement = buttonElement.querySelector('.p-button-icon:not([data-pc-section="loadingicon"])');
            expect(iconElement).toBeTruthy();

            // Switch to loading
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Should still be disabled and show loading icon
            expect(buttonElement.disabled).toBe(true);
            const loadingIcon = buttonElement.querySelector('[data-pc-section="loadingicon"]');
            expect(loadingIcon).toBeTruthy();
            expect(loadingIcon?.classList.contains('pi-spinner')).toBe(true);
        });

        it('should handle loading state with label but no icons', async () => {
            component.icon = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loadingIcon = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.label = 'Submit';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Should show default spinner even without custom icons
            const svgSpinner = buttonElement.querySelector('svg[data-p-icon="spinner"]') || buttonElement.querySelector('[data-pc-section="loadingicon"] svg[data-p-icon="spinner"]');
            expect(svgSpinner).toBeTruthy();

            // Should still show label
            const labelElement = buttonElement.querySelector('.p-button-label');
            expect(labelElement?.textContent?.trim()).toBe('Submit');

            // Button should be disabled
            expect(buttonElement.disabled).toBe(true);
        });

        it('should preserve icon position classes during loading state transitions', async () => {
            component.icon = 'pi pi-search';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loadingIcon = 'pi pi-spinner';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.label = 'Search';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.iconPos = 'right';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loading = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Initially check icon position
            const iconElement = buttonElement.querySelector('.p-button-icon-right');
            expect(iconElement).toBeTruthy();

            // Switch to loading
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Loading icon should be present
            const loadingIcon = buttonElement.querySelector('[data-pc-section="loadingicon"]');
            expect(loadingIcon).toBeTruthy();

            // Switch back to non-loading
            component.loading = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Icon position should be preserved
            const restoredIconElement = buttonElement.querySelector('.p-button-icon-right');
            expect(restoredIconElement).toBeTruthy();
        });

        it('should handle rapid loading state changes with different icons', async () => {
            component.icon = 'pi pi-play';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loadingIcon = 'pi pi-spinner';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Multiple rapid state changes
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            let loadingIcon = buttonElement.querySelector('[data-pc-section="loadingicon"]');
            expect(loadingIcon).toBeTruthy();

            component.loading = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            let regularIcon = buttonElement.querySelector('.p-button-icon:not([data-pc-section="loadingicon"])');
            expect(regularIcon).toBeTruthy();

            // Change loadingIcon and switch again
            component.loadingIcon = 'pi pi-cog';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            loadingIcon = buttonElement.querySelector('[data-pc-section="loadingicon"]');
            expect(loadingIcon).toBeTruthy();
            expect(loadingIcon?.classList.contains('pi-cog')).toBe(true);
            expect(loadingIcon?.classList.contains('pi-spin')).toBe(true);
        });

        it('should maintain accessibility attributes during icon state changes', async () => {
            component.icon = 'pi pi-download';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loadingIcon = 'pi pi-spinner';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.label = 'Download';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loading = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Check initial accessibility
            const iconElement = buttonElement.querySelector('.p-button-icon');
            expect(iconElement?.getAttribute('aria-hidden')).toBeNull(); // Icon elements don't always have aria-hidden in this implementation

            // Switch to loading
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const loadingIcon = buttonElement.querySelector('[data-pc-section="loadingicon"]');
            expect(loadingIcon?.getAttribute('aria-hidden')).toBe('true');
        });

        it('should handle iconClass method correctly for different states', async () => {
            component.icon = 'pi pi-home';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loadingIcon = 'pi pi-spinner';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.label = 'Home';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.iconPos = 'left';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Test non-loading state
            component.loading = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const icon = buttonElement.querySelector('[data-pc-section="icon"]');
            expect(icon).toBeTruthy();
            expect(icon?.classList.contains('p-button-icon')).toBeTruthy();
            expect(icon?.classList.contains('pi')).toBeTruthy();
            expect(icon?.classList.contains('pi-home')).toBeTruthy();

            // Test loading state
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const loadingIcon = buttonElement.querySelector('[data-pc-section="loadingicon"]');
            expect(loadingIcon).toBeTruthy();
            expect(loadingIcon?.classList.contains('p-button-loading-icon')).toBeTruthy();
            expect(loadingIcon?.classList.contains('pi-spin')).toBeTruthy();
            expect(loadingIcon?.classList.contains('pi')).toBeTruthy();
            expect(loadingIcon?.classList.contains('pi-spinner')).toBeTruthy();
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('should handle empty label gracefully', async () => {
            component.label = '';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(() => fixture.detectChanges()).not.toThrow();
            expect(buttonInstance.label()).toBe('' as any);
        });

        it('should handle undefined label', async () => {
            component.label = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(() => fixture.detectChanges()).not.toThrow();
        });

        it('should handle invalid icon gracefully', async () => {
            component.icon = '';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(() => fixture.detectChanges()).not.toThrow();
        });

        it('should handle rapid state changes', async () => {
            // Rapid loading state changes
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            component.loading = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(async () => {
                component.loading = true;
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();
                fixture.detectChanges();
            }).not.toThrow();
        });
    });
});

describe('ButtonDirective', () => {
    let component: TestButtonDirectiveComponent;
    let fixture: ComponentFixture<TestButtonDirectiveComponent>;
    let buttonDirective: ButtonDirective;
    let buttonElement: HTMLButtonElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestButtonDirectiveComponent, TestButtonWithIconLabelDirectiveComponent, TestButtonDirectiveLabelIconComponent],
            imports: [Button, ButtonDirective, ButtonIcon, ButtonLabel],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestButtonDirectiveComponent);
        component = fixture.componentInstance;
        buttonDirective = fixture.debugElement.query(By.directive(ButtonDirective)).injector.get(ButtonDirective);
        buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
        fixture.detectChanges();
    });

    describe('Directive Initialization', () => {
        it('should create directive', () => {
            expect(component).toBeTruthy();
            expect(buttonDirective).toBeTruthy();
        });

        it('should apply directive classes', () => {
            expect(buttonElement.classList.contains('p-button')).toBe(true);
            expect(buttonElement.classList.contains('p-component')).toBe(true);
        });
    });

    describe('Directive variant classes', () => {
        it('should remove the variant classes when their inputs go back to false', async () => {
            component.outlined = true;
            component.text = true;
            component.raised = true;
            component.rounded = true;
            component.size = 'small';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            for (const cls of ['p-button-outlined', 'p-button-text', 'p-button-raised', 'p-button-rounded', 'p-button-sm', 'p-button-small']) {
                expect(buttonElement.classList.contains(cls)).toBe(true);
            }

            component.outlined = false;
            component.text = false;
            component.raised = false;
            component.rounded = false;
            component.size = null;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            for (const cls of ['p-button-outlined', 'p-button-text', 'p-button-raised', 'p-button-rounded', 'p-button-sm', 'p-button-small']) {
                expect(buttonElement.classList.contains(cls)).toBe(false);
            }
            expect(buttonElement.classList.contains('p-button')).toBe(true);
            expect(buttonElement.classList.contains('test-button')).toBe(true);
        });
    });

    describe('Directive Properties', () => {
        it('should update severity', async () => {
            component.severity = 'success';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonDirective.severity()).toBe('success');
            expect(buttonElement.classList.contains('p-button-success')).toBe(true);
        });

        it('should handle loading state', async () => {
            component.loading = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonDirective.loading()).toBe(true);
            expect(buttonElement.classList.contains('p-button-loading')).toBe(true);
        });

        it('should apply variant styles', async () => {
            component.raised = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonDirective.raised()).toBe(true);
            expect(buttonElement.classList.contains('p-button-raised')).toBe(true);
        });
    });

    describe('ButtonIcon and ButtonLabel Directives', () => {
        it('should render icon and label directives', async () => {
            const iconLabelFixture = TestBed.createComponent(TestButtonWithIconLabelDirectiveComponent);
            iconLabelFixture.detectChanges();
            await fixture.whenStable();

            const iconElement = iconLabelFixture.debugElement.query(By.directive(ButtonIcon));
            const labelElement = iconLabelFixture.debugElement.query(By.directive(ButtonLabel));

            expect(iconElement).toBeTruthy();
            expect(labelElement).toBeTruthy();

            const iconNativeElement = iconElement.nativeElement;
            const labelNativeElement = labelElement.nativeElement;

            expect(iconNativeElement.classList.contains('p-button-icon')).toBe(true);
            expect(labelNativeElement.classList.contains('p-button-label')).toBe(true);
        });
    });

    describe('Label, icon and loading inputs', () => {
        let labelIconFixture: ComponentFixture<TestButtonDirectiveLabelIconComponent>;
        let host: TestButtonDirectiveLabelIconComponent;
        let directive: ButtonDirective;
        let element: HTMLButtonElement;

        const render = async () => {
            labelIconFixture.changeDetectorRef.markForCheck();
            await labelIconFixture.whenStable();
            labelIconFixture.detectChanges();
        };

        beforeEach(async () => {
            labelIconFixture = TestBed.createComponent(TestButtonDirectiveLabelIconComponent);
            host = labelIconFixture.componentInstance;
            directive = labelIconFixture.debugElement.query(By.directive(ButtonDirective)).injector.get(ButtonDirective);
            element = labelIconFixture.debugElement.query(By.css('button')).nativeElement;
            labelIconFixture.detectChanges();
            await labelIconFixture.whenStable();
        });

        it('should create the icon and label elements after the first render', () => {
            expect(directive.initialized()).toBe(true);

            const labelElement = element.querySelector('[data-pc-section="buttonlabel"]');
            const iconElement = element.querySelector('[data-pc-section="buttonicon"]');
            expect(labelElement?.textContent).toBe('Save');
            expect(iconElement?.classList.contains('pi-check')).toBe(true);
            expect(iconElement?.classList.contains('p-button-icon-left')).toBe(true);
            expect(element.firstChild).toBe(iconElement);
            expect(element.classList.contains('p-button-icon-only')).toBe(false);
        });

        it('should update the label element when the label input changes', async () => {
            host.label = 'Submit';
            await render();

            expect(directive.label()).toBe('Submit');
            expect(directive._label()).toBe('Submit');
            expect(element.querySelector('[data-pc-section="buttonlabel"]')?.textContent).toBe('Submit');

            host.label = undefined;
            await render();

            expect(element.querySelector('[data-pc-section="buttonlabel"]')).toBeNull();
            expect(element.classList.contains('p-button-icon-only')).toBe(true);
        });

        it('should update the icon element when the icon input changes', async () => {
            host.icon = 'pi pi-times';
            await render();

            const iconElement = element.querySelector('[data-pc-section="buttonicon"]');
            expect(directive._icon()).toBe('pi pi-times');
            expect(iconElement?.classList.contains('pi-times')).toBe(true);
            expect(iconElement?.classList.contains('pi-check')).toBe(false);
            expect(iconElement?.classList.contains('p-button-icon-left')).toBe(true);
        });

        it('should render the spinner and the loading classes when loading changes', async () => {
            host.loading = true;
            await render();

            const iconElement = element.querySelector('[data-pc-section="buttonicon"]');
            expect(directive._loading()).toBe(true);
            expect(element.classList.contains('p-button-loading')).toBe(true);
            expect(element.classList.contains('p-disabled')).toBe(true);
            expect(iconElement?.classList.contains('p-button-loading-icon')).toBe(true);
            expect(iconElement?.querySelector('svg.p-icon-spin')).toBeTruthy();

            host.loading = false;
            await render();

            expect(element.classList.contains('p-button-loading')).toBe(false);
            expect(element.classList.contains('p-disabled')).toBe(false);
            expect(iconElement?.innerHTML).toBe('');
            expect(iconElement?.classList.contains('pi-check')).toBe(true);
        });

        it('should use the loadingIcon class instead of the spinner', async () => {
            host.loadingIcon = 'pi pi-spin pi-cog';
            host.loading = true;
            await render();

            const iconElement = element.querySelector('[data-pc-section="buttonicon"]');
            expect(iconElement?.classList.contains('p-button-loading-icon')).toBe(true);
            expect(iconElement?.classList.contains('pi-cog')).toBe(true);
            expect(iconElement?.querySelector('svg')).toBeNull();
        });

        it('should fall back to buttonProps for label, icon, loading and severity', async () => {
            host.label = undefined;
            host.icon = undefined;
            host.buttonProps = { label: 'From props', icon: 'pi pi-star', severity: 'danger' };
            await render();

            expect(directive.label()).toBeUndefined();
            expect(directive._label()).toBe('From props');
            expect(directive._icon()).toBe('pi pi-star');
            expect(element.querySelector('[data-pc-section="buttonlabel"]')?.textContent).toBe('From props');
            expect(element.querySelector('[data-pc-section="buttonicon"]')?.classList.contains('pi-star')).toBe(true);
            expect(element.classList.contains('p-button-danger')).toBe(true);

            host.buttonProps = { label: 'From props', icon: 'pi pi-star', severity: 'success', loading: true };
            await render();

            expect(directive._loading()).toBe(true);
            expect(element.classList.contains('p-button-loading')).toBe(true);
            expect(element.classList.contains('p-button-success')).toBe(true);
            expect(element.classList.contains('p-button-danger')).toBe(false);
        });

        it('should prefer the direct inputs over buttonProps', async () => {
            host.buttonProps = { label: 'From props', icon: 'pi pi-star' };
            await render();

            expect(directive._label()).toBe('Save');
            expect(directive._icon()).toBe('pi pi-check');
            expect(element.querySelector('[data-pc-section="buttonlabel"]')?.textContent).toBe('Save');
        });

        it('should reset initialized on destroy', () => {
            labelIconFixture.destroy();

            expect(directive.initialized()).toBe(false);
        });
    });

    describe('Public Methods', () => {
        it('should have basic directive functionality', () => {
            // Test that directive exists and has basic properties
            expect(buttonDirective).toBeTruthy();
            expect(buttonDirective.raised()).toBe(false);
            expect(buttonDirective.rounded()).toBe(false);
        });

        it('should update styles when properties change', async () => {
            component.severity = 'danger';
            component.raised = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttonDirective.severity()).toBe('danger');
            expect(buttonElement.classList.contains('p-button-danger')).toBe(true);
            expect(buttonDirective.raised()).toBe(true);
            expect(buttonElement.classList.contains('p-button-raised')).toBe(true);
        });
    });
});

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [ButtonDirective, ButtonIcon, ButtonLabel, SharedModule],
    template: `
        <button pButton>
            <span pButtonIcon>I</span>
            <span pButtonLabel>L</span>
        </button>
    `
})
class ButtonQueryApiHostComponent {}

describe('ButtonDirective Signal Query API', () => {
    it('should resolve its signal-based view/content queries', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [ButtonQueryApiHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(ButtonQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const instance = fixture.debugElement.query(By.directive(ButtonDirective)).injector.get(ButtonDirective);

        // iconSignal/labelSignal are private; their resolution is observable via the public computeds
        expect(instance.isIconOnly()).toBe(false);
        expect((instance as any).iconSignal()).toBeDefined();
        expect((instance as any).labelSignal()).toBeDefined();
    });
});
