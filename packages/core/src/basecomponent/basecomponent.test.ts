import { Base } from '@exhaustive-ui/core/base';
import { Theme } from '@exhaustive-ui/styled';
import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, ViewEncapsulation } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import { Button } from '@exhaustive-ui/core/button';
import { TableModule } from '@exhaustive-ui/core/table';
import Aura from '@exhaustive-ui/themes/aura';

// Tests that load a theme preset change the global Theme state and add <style> tags to the document,
// which every test file shares: reset them after each test (the styles are added again on demand)
// so the following files keep their layout.
afterEach(() => {
    Theme._theme = undefined;
    Theme._tokens = {};
    Theme.clearLoadedStyleNames();
    Base.clearLoadedStyleNames();
    document.head.querySelectorAll('style[data-exhaustive-style-id]').forEach((style) => style.remove());
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TableModule],
    template: `
        <p-table [value]="rows">
            <ng-template #body let-row>
                <tr>
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
        </p-table>
    `
})
class TestGlobalPTTableComponent {
    rows = [{ name: 'Row 1' }];
}

describe('BaseComponent global PassThrough', () => {
    it('applies the global table PT to the Table sections (optimus-ui#25)', async () => {
        TestBed.configureTestingModule({
            imports: [TestGlobalPTTableComponent],
            providers: [provideZonelessChangeDetection(), provideExhaustive({ pt: { table: { tableContainer: { style: { border: '3px solid red' } }, table: { 'data-test': 'table' } } } })]
        });
        const fixture = TestBed.createComponent(TestGlobalPTTableComponent);
        await fixture.whenStable();

        const container = fixture.nativeElement.querySelector('.p-datatable-table-container') as HTMLElement;
        const table = fixture.nativeElement.querySelector('table') as HTMLTableElement;

        expect(container.style.border).toBe('3px solid red');
        expect(table.hasAttribute('tablecontainer')).toBe(false);
        expect(table.getAttribute('data-test')).toBe('table');
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Button],
    template: `<p-button label="Save" [dt]="dt" />`
})
class TestScopedTokensComponent {
    dt = {
        root: { borderRadius: '2px' },
        css: () => '.optimus-ui-633 { border-width: 3px; }'
    };
}

describe('BaseComponent scoped design tokens', () => {
    const hasRule = () => Array.from(document.head.querySelectorAll('style')).some((style) => style.textContent?.includes('.optimus-ui-633'));

    it('loads the css function of a component-level dt (optimus-ui#633)', async () => {
        TestBed.configureTestingModule({
            imports: [TestScopedTokensComponent],
            providers: [provideZonelessChangeDetection(), provideExhaustive({ theme: { preset: Aura } })]
        });
        const fixture = TestBed.createComponent(TestScopedTokensComponent);
        await fixture.whenStable();

        expect(hasRule()).toBe(true);

        fixture.destroy();

        expect(hasRule()).toBe(false);
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [Button],
    template: `<p-button label="Save" />`
})
class TestShadowDomHostComponent {}

describe('BaseComponent inside a ViewEncapsulation.ShadowDom host', () => {
    it('adds the component styles to the shadow root (optimus-ui#802)', async () => {
        TestBed.configureTestingModule({
            imports: [TestShadowDomHostComponent],
            providers: [provideZonelessChangeDetection(), provideExhaustive({ theme: { preset: Aura } })]
        });
        const fixture = TestBed.createComponent(TestShadowDomHostComponent);
        await fixture.whenStable();

        const shadowRoot = (fixture.nativeElement as HTMLElement).shadowRoot as ShadowRoot;
        const button = shadowRoot.querySelector('button') as HTMLButtonElement;
        const names = (root: Document | ShadowRoot) => Array.from(root.querySelectorAll('style[data-exhaustive-style-id]')).map((style) => style.getAttribute('data-exhaustive-style-id'));

        expect(names(document)).toContain('button-style');
        expect(names(shadowRoot)).toEqual(names(document));
        expect(getComputedStyle(button).display).toBe('inline-flex');
    });
});
