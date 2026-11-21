import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Badge } from '@exhaustive-ui/core/badge';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@exhaustive-ui/core/tabs';
import Aura from '@exhaustive-ui/themes/aura';
import { OverlayBadge, OverlayBadgeModule } from './overlaybadge';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [OverlayBadge, Tabs, TabList, Tab, TabPanels, TabPanel],
    template: `
        <p-tabs value="1" style="width: 500px">
            <p-tablist>
                <p-tab value="0" class="tab-0">Header I</p-tab>
                <p-overlaybadge value="2">
                    <p-tab value="1" class="tab-1">Header II</p-tab>
                </p-overlaybadge>
                <p-tab value="2" class="tab-2">Header III</p-tab>
            </p-tablist>
            <p-tabpanels>
                <p-tabpanel value="0">Content I</p-tabpanel>
                <p-tabpanel value="1">Content II</p-tabpanel>
                <p-tabpanel value="2">Content III</p-tabpanel>
            </p-tabpanels>
        </p-tabs>
    `
})
class TestOverlayBadgeTabComponent {}

describe('OverlayBadge wrapping a Tab (optimus-ui#241)', () => {
    it('should keep the wrapped tab aligned with the other tabs', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [TestOverlayBadgeTabComponent],
            providers: [provideZonelessChangeDetection(), provideExhaustive({ theme: { preset: Aura } })]
        });
        const fixture = TestBed.createComponent(TestOverlayBadgeTabComponent);
        await fixture.whenStable();
        await new Promise((resolve) => setTimeout(resolve, 50));

        const host = fixture.nativeElement as HTMLElement;
        const rect = (selector: string) => host.querySelector(selector)!.getBoundingClientRect();
        const [first, wrapped, last] = [rect('.tab-0'), rect('.tab-1'), rect('.tab-2')];
        const list = rect('.p-tablist-tab-list');
        const bar = rect('.p-tablist-active-bar');

        expect(wrapped.top).toBeCloseTo(first.top, 0);
        expect(wrapped.bottom).toBeCloseTo(first.bottom, 0);
        expect(wrapped.left).toBeCloseTo(first.right, 0);
        expect(last.left).toBeCloseTo(wrapped.right, 0);
        // the tabs overlap the bottom border of the list by their own bottom border
        expect(wrapped.bottom).toBeCloseTo(list.bottom, 0);
        // the active bar sits under the wrapped (active) tab only
        expect(bar.left).toBeCloseTo(wrapped.left, 0);
        expect(bar.width).toBeCloseTo(wrapped.width, 0);
        expect(bar.bottom).toBeCloseTo(wrapped.bottom, 0);
        fixture.destroy();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [OverlayBadge],
    template: `
        <p-overlay-badge [styleClass]="styleClass()" [style]="style()" [badgeSize]="badgeSize()" [severity]="severity()" [value]="value()" [badgeDisabled]="badgeDisabled()">
            <span class="target">Target</span>
        </p-overlay-badge>
    `
})
class TestOverlayBadgeComponent {
    styleClass = signal<string | undefined>(undefined);
    style = signal<{ [klass: string]: any } | null | undefined>(undefined);
    badgeSize = signal<'small' | 'large' | 'xlarge' | null | undefined>(undefined);
    severity = signal<'success' | 'info' | 'warn' | 'danger' | null | undefined>(undefined);
    value = signal<string | number | null | undefined>(undefined);
    badgeDisabled = signal<boolean | undefined>(false);
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [OverlayBadgeModule],
    template: `
        <p-overlayBadge class="alias-camel"></p-overlayBadge>
        <p-overlaybadge class="alias-lower"></p-overlaybadge>
    `
})
class TestOverlayBadgeAliasesComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [OverlayBadge],
    template: `<p-overlaybadge value="2" [dt]="dt" [unstyled]="true"></p-overlaybadge>`
})
class TestOverlayBadgeTokensComponent {
    dt = { sm: { fontSize: '20px' }, contrast: { background: 'red' } };
}

describe('OverlayBadge', () => {
    let fixture: ComponentFixture<TestOverlayBadgeComponent>;
    let host: TestOverlayBadgeComponent;
    let overlayBadge: OverlayBadge;
    let element: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestOverlayBadgeComponent, TestOverlayBadgeAliasesComponent, TestOverlayBadgeTokensComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestOverlayBadgeComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();

        const debugElement = fixture.debugElement.query(By.directive(OverlayBadge));
        overlayBadge = debugElement.componentInstance;
        element = debugElement.nativeElement;
    });

    async function update(changes: {
        styleClass?: string;
        style?: { [klass: string]: any } | null;
        badgeSize?: 'small' | 'large' | 'xlarge' | null;
        severity?: 'success' | 'info' | 'warn' | 'danger' | null;
        value?: string | number | null;
        badgeDisabled?: boolean;
    }) {
        if ('styleClass' in changes) host.styleClass.set(changes.styleClass);
        if ('style' in changes) host.style.set(changes.style);
        if ('badgeSize' in changes) host.badgeSize.set(changes.badgeSize);
        if ('severity' in changes) host.severity.set(changes.severity);
        if ('value' in changes) host.value.set(changes.value);
        if ('badgeDisabled' in changes) host.badgeDisabled.set(changes.badgeDisabled);
        fixture.detectChanges();
        await fixture.whenStable();
    }

    it('should create', () => {
        expect(overlayBadge).toBeTruthy();
    });

    it('should have default input values', () => {
        expect(overlayBadge.styleClass()).toBeUndefined();
        expect(overlayBadge.style()).toBeUndefined();
        expect(overlayBadge.badgeSize()).toBeUndefined();
        expect(overlayBadge.severity()).toBeUndefined();
        expect(overlayBadge.value()).toBeUndefined();
        expect(overlayBadge.badgeDisabled()).toBe(false);
    });

    it('should render the root class on the inner wrapper', () => {
        expect(element.querySelector('div')?.classList.contains('p-overlaybadge')).toBe(true);
    });

    it('should project content', () => {
        expect(element.querySelector('.target')).toBeTruthy();
    });

    it('should render a nested p-badge', () => {
        expect(element.querySelector('p-badge')).toBeTruthy();
    });

    it('should forward styleClass to the inner badge', async () => {
        await update({ styleClass: 'custom-class' });

        const badge = element.querySelector('p-badge');
        expect(badge?.classList.contains('custom-class')).toBe(true);
    });

    it('should forward style to the inner badge', async () => {
        await update({ style: { 'margin-top': '4px' } });

        const badge = element.querySelector('p-badge') as HTMLElement;
        expect(badge.style.marginTop).toBe('4px');
    });

    it('should forward value and severity to the inner badge', async () => {
        await update({ value: '2', severity: 'danger' });

        const badge = element.querySelector('p-badge');
        expect(badge?.textContent).toContain('2');
        expect(badge?.classList.contains('p-badge-danger')).toBe(true);
    });

    it('should forward badgeSize to the inner badge', async () => {
        await update({ badgeSize: 'large' });

        const badge = element.querySelector('p-badge');
        expect(badge?.classList.contains('p-badge-lg')).toBe(true);
    });

    it('should forward badgeDisabled to the inner badge', async () => {
        await update({ badgeDisabled: true });

        const badge = element.querySelector('p-badge') as HTMLElement;
        expect(badge.style.display).toBe('none');
    });

    it('should render through every selector alias', async () => {
        const aliasFixture = TestBed.createComponent(TestOverlayBadgeAliasesComponent);
        aliasFixture.detectChanges();
        await aliasFixture.whenStable();

        const badges = aliasFixture.debugElement.queryAll(By.directive(OverlayBadge));

        expect(badges.length).toBe(2);
        badges.forEach((badge) => expect(badge.nativeElement.querySelector('div')?.classList.contains('p-overlaybadge')).toBe(true));
    });

    it('should forward dt and unstyled to the inner badge', async () => {
        const tokensFixture = TestBed.createComponent(TestOverlayBadgeTokensComponent);
        tokensFixture.detectChanges();
        await tokensFixture.whenStable();

        const badge = tokensFixture.debugElement.query(By.directive(Badge)).componentInstance as Badge;

        expect(badge.dt()).toEqual(tokensFixture.componentInstance.dt);
        expect(badge.unstyled()).toBe(true);
    });
});
