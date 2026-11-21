import { Base } from '@exhaustive-ui/core/base';
import { Theme } from '@exhaustive-ui/styled';
import { ɵgetDOM, ɵsetRootDomAdapter } from '@angular/common';
import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, ViewEncapsulation, ɵgetDocument, ɵsetDocument } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering, renderApplication } from '@angular/platform-server';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import { Button } from '@exhaustive-ui/core/button';
import { Fieldset } from '@exhaustive-ui/core/fieldset';
import { TableModule } from '@exhaustive-ui/core/table';
import { Tag } from '@exhaustive-ui/core/tag';
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

@Component({
    selector: 'app-ssr-root',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Tag, Fieldset],
    template: `
        <p-tag value="New" [pt]="{ root: { 'aria-label': 'status', class: 'pt-root-class' } }" />
        <p-fieldset legend="Info" [pt]="{ host: { 'data-test': 'fieldset-host' } }">Content</p-fieldset>
    `
})
class TestServerRenderedPTComponent {}

describe('BaseComponent host PassThrough on the server', () => {
    // The server platform replaces the global DOM adapter, document and DOM classes (Node, Event...) with its emulated ones;
    // the other test files run in the same page, so put the browser ones back.
    const domAdapter = ɵgetDOM();
    const doc = ɵgetDocument();
    const domClasses = Object.getOwnPropertyNames(globalThis)
        .map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)?.value] as const)
        .filter(([, value]) => typeof value === 'function');

    afterEach(() => {
        ɵsetRootDomAdapter(domAdapter);
        ɵsetDocument(doc);
        domClasses.forEach(([name, value]) => globalThis[name] !== value && (globalThis[name] = value));
    });

    it('renders the host and root PT attributes in the server output (optimus-ui#2083)', async () => {
        const html = await renderApplication((context) => bootstrapApplication(TestServerRenderedPTComponent, { providers: [provideZonelessChangeDetection(), provideServerRendering()] }, context), {
            document: '<html><head></head><body><app-ssr-root></app-ssr-root></body></html>',
            url: '/'
        });
        const body = new DOMParser().parseFromString(html, 'text/html').body;
        const tag = body.querySelector('p-tag') as HTMLElement;
        const fieldset = body.querySelector('p-fieldset') as HTMLElement;

        expect(tag.getAttribute('data-pc-name')).toBe('tag');
        expect(tag.getAttribute('data-pc-section')).toBe('root');
        expect(tag.getAttribute('aria-label')).toBe('status');
        expect(tag.classList).toContain('pt-root-class');
        expect(tag.classList).toContain('p-tag');
        expect(fieldset.getAttribute('data-test')).toBe('fieldset-host');
        expect(fieldset.getAttribute('data-pc-section')).toBe('host');
    });
});
