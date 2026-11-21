import { Base } from '@exhaustive-ui/core/base';
import { definePreset, Theme, ThemeService } from '@exhaustive-ui/styled';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ɵgetDOM, ɵsetRootDomAdapter } from '@angular/common';
import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, ViewEncapsulation, ɵgetDocument, ɵsetDocument } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering, renderApplication } from '@angular/platform-server';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import { Button } from '@exhaustive-ui/core/button';
import { Fieldset } from '@exhaustive-ui/core/fieldset';
import { Carousel } from '@exhaustive-ui/core/carousel';
import { Dialog } from '@exhaustive-ui/core/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
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

    it('applies the global PT together with the local PT when the class names are minified (optimus-ui#103)', async () => {
        // a production build renames the component classes: the global PT must not be looked up by class name
        const originalName = Object.getOwnPropertyDescriptor(Button, 'name')!;
        Object.defineProperty(Button, 'name', { value: 'e', configurable: true });

        try {
            TestBed.configureTestingModule({
                imports: [TestGlobalAndLocalPTButtonComponent],
                providers: [provideZonelessChangeDetection(), provideExhaustive({ pt: { button: { root: { 'data-global': 'root' }, label: { class: 'global-label' } } } })]
            });
            const fixture = TestBed.createComponent(TestGlobalAndLocalPTButtonComponent);
            await fixture.whenStable();

            const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
            const label = button.querySelector('.p-button-label') as HTMLElement;

            expect(Button.name).toBe('e');
            expect(button.getAttribute('data-global')).toBe('root');
            expect(button.getAttribute('data-local')).toBe('root');
            expect(label.classList).toContain('global-label');
        } finally {
            Object.defineProperty(Button, 'name', originalName);
        }
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Button],
    template: `<p-button label="Save" [pt]="{ root: { 'data-local': 'root' } }" />`
})
class TestGlobalAndLocalPTButtonComponent {}

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
    imports: [Button, Tag, Carousel, Dialog, TableModule],
    template: `
        <p-button label="Save" />
        <p-tag value="New" />
        <p-carousel [value]="items" [numVisible]="2" [responsiveOptions]="responsiveOptions">
            <ng-template #item let-item>{{ item }}</ng-template>
        </p-carousel>
        <p-table [value]="rows" responsiveLayout="stack">
            <ng-template #body let-row>
                <tr>
                    <td>{{ row.name }}</td>
                </tr>
            </ng-template>
        </p-table>
        <p-dialog header="Dialog" [visible]="true" [breakpoints]="{ '960px': '75vw' }">Content</p-dialog>
    `
})
class TestCspNonceComponent {
    items = ['A', 'B', 'C'];
    rows = [{ name: 'Row 1' }];
    responsiveOptions = [{ breakpoint: '768px', numVisible: 1, numScroll: 1 }];
}

describe('BaseComponent with a CSP nonce', () => {
    it('adds no style element without the nonce and no inline style attribute (optimus-ui#141)', async () => {
        const added: HTMLStyleElement[] = [];
        const observer = new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => node instanceof HTMLStyleElement && added.push(node))));
        observer.observe(document.head, { childList: true });
        const setAttribute = vi.spyOn(Element.prototype, 'setAttribute');

        TestBed.configureTestingModule({
            imports: [TestCspNonceComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations(), provideExhaustive({ theme: { preset: Aura }, csp: { nonce: 'test-nonce' } })]
        });
        const fixture = TestBed.createComponent(TestCspNonceComponent);
        await fixture.whenStable();
        await new Promise((resolve) => setTimeout(resolve, 50));
        observer.disconnect();
        const styleAttributeCalls = setAttribute.mock.calls.filter(([name]) => name.toLowerCase() === 'style');
        fixture.destroy();

        // CSP blocks <style> elements without the nonce and `style` attributes, but not the CSSOM (element.style)
        expect(added.length).toBeGreaterThan(0);
        expect(added.filter((style) => style.nonce !== 'test-nonce').map((style) => style.getAttribute('data-exhaustive-style-id') ?? style.textContent?.slice(0, 80))).toEqual([]);
        expect(styleAttributeCalls).toEqual([]);
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Button],
    template: `<p-button label="Home" />`
})
class TestCustomPresetHomePage {}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Tag],
    template: `<p-tag value="New" />`
})
class TestCustomPresetTagPage {}

describe('BaseComponent with a custom preset across route changes', () => {
    it('renders the components of the new page with the custom preset colors from their first frame (optimus-ui#164)', async () => {
        const preset = definePreset(Aura, {
            semantic: {
                primary: Object.fromEntries([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => [shade, `{indigo.${shade}}`]))
            }
        });
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection(), provideExhaustive({ theme: { preset } }), provideRouter([{ path: '', component: TestCustomPresetHomePage }, { path: 'tag', component: TestCustomPresetTagPage }])]
        });
        const harness = await RouterTestingHarness.create('/');
        const themeChange = vi.fn();
        ThemeService.on('theme:change', themeChange);

        const probe = document.body.appendChild(document.createElement('div'));
        probe.style.background = 'var(--p-indigo-100)';
        const indigo100 = getComputedStyle(probe).backgroundColor;
        probe.remove();

        // the color of the tag at the moment it is inserted, before the browser paints it
        let firstColor: string | undefined;
        const observer = new MutationObserver(() => {
            const tag = harness.routeNativeElement?.querySelector('.p-tag');
            if (tag && firstColor === undefined) firstColor = getComputedStyle(tag).backgroundColor;
        });
        observer.observe(harness.fixture.nativeElement, { childList: true, subtree: true });

        await harness.navigateByUrl('/tag');
        await harness.fixture.whenStable();
        observer.disconnect();
        ThemeService.off('theme:change', themeChange);

        expect(indigo100).not.toBe('rgba(0, 0, 0, 0)');
        expect(firstColor).toBe(indigo100);
        expect(getComputedStyle(harness.routeNativeElement!.querySelector('.p-tag')!).backgroundColor).toBe(indigo100);
        expect(themeChange).not.toHaveBeenCalled();
    });
});

@Component({
    selector: 'app-mfe-shell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Button],
    template: `<p-button label="Shell" />`
})
class TestMicroFrontendShellComponent {}

@Component({
    selector: 'app-mfe-remote',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Fieldset],
    template: `<p-fieldset legend="Remote">Content</p-fieldset>`
})
class TestMicroFrontendRemoteComponent {}

describe('BaseComponent in micro frontends sharing the library', () => {
    it('loads the styles of a component that only a second application renders (optimus-ui#717, optimus-ui#850)', async () => {
        const shellHost = document.body.appendChild(document.createElement('app-mfe-shell'));
        const remoteHost = document.body.appendChild(document.createElement('app-mfe-remote'));
        const shell = await bootstrapApplication(TestMicroFrontendShellComponent, { providers: [provideZonelessChangeDetection(), provideExhaustive({ theme: { preset: Aura } })] });
        await shell.whenStable();
        const styleIds = () => Array.from(document.head.querySelectorAll('style[data-exhaustive-style-id]')).map((style) => style.getAttribute('data-exhaustive-style-id'));

        expect(styleIds()).not.toContain('fieldset-style');

        // the remote application has its own injector and does not configure the theme again
        const remote = await bootstrapApplication(TestMicroFrontendRemoteComponent, { providers: [provideZonelessChangeDetection()] });
        await remote.whenStable();

        try {
            expect(styleIds()).toEqual(expect.arrayContaining(['fieldset-style', 'fieldset-variables']));
            const legend = remoteHost.querySelector('.p-fieldset-legend') as HTMLElement;
            expect(getComputedStyle(remoteHost.querySelector('.p-fieldset')!).borderStyle).toBe('solid');
            expect(parseFloat(getComputedStyle(legend).paddingLeft)).toBeGreaterThan(0);
        } finally {
            remote.destroy();
            shell.destroy();
            shellHost.remove();
            remoteHost.remove();
        }
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
