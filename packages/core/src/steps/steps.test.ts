import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { MenuItem } from '@exhaustive-ui/core/api';
import { Steps } from './steps';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [Steps],
    template: ` <p-steps [model]="model" [readonly]="readonly" [(activeIndex)]="activeIndex" [styleClass]="customClass" [style]="customStyle"></p-steps> `
})
class StepsHostComponent {
    model: MenuItem[] = [{ label: 'Personal' }, { label: 'Seat' }, { label: 'Payment' }];
    readonly = false;
    activeIndex = 0;
    customClass: string | undefined;
    customStyle: { [klass: string]: any } | null | undefined;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [Steps],
    template: ` <p-steps [model]="model" [readonly]="false"></p-steps> `
})
class StepsQueryApiHostComponent {
    model = [{ label: 'One' }, { label: 'Two' }];
}

@Component({ template: '' })
class RouteStubComponent {}

function itemLinks(fixture: ComponentFixture<unknown>): HTMLAnchorElement[] {
    return fixture.debugElement.queryAll(By.css('[data-pc-section="menuitem"] > a')).map((link) => link.nativeElement);
}

function root(fixture: ComponentFixture<unknown>): HTMLElement {
    return fixture.debugElement.query(By.css('nav')).nativeElement;
}

function items(fixture: ComponentFixture<unknown>): HTMLElement[] {
    return fixture.debugElement.queryAll(By.css('[data-pc-section="menuitem"]')).map((item) => item.nativeElement);
}

describe('Steps', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [Steps, StepsHostComponent, StepsQueryApiHostComponent],
            providers: [
                provideRouter([
                    { path: 'personal', component: RouteStubComponent },
                    { path: 'seat', component: RouteStubComponent }
                ]),
                provideZonelessChangeDetection(),
                provideNoopAnimations()
            ]
        });
    });

    describe('standalone component', () => {
        let fixture: ComponentFixture<Steps>;
        let steps: Steps;

        beforeEach(() => {
            fixture = TestBed.createComponent(Steps);
            steps = fixture.componentInstance;
        });

        it('should have default values', () => {
            fixture.detectChanges();

            expect(steps.activeIndex()).toBe(0);
            expect(steps.model()).toBeUndefined();
            expect(steps.readonly()).toBe(true);
            expect(steps.style()).toBeUndefined();
            expect(steps.styleClass()).toBeUndefined();
            expect(steps.exact()).toBe(true);
        });

        it('should render the root and list classes on the nav element', () => {
            fixture.detectChanges();

            const nav = root(fixture);
            expect(nav.classList.contains('p-steps')).toBe(true);
            expect(nav.classList.contains('p-component')).toBe(true);
            expect(nav.classList.contains('p-readonly')).toBe(true);
            expect(nav.getAttribute('data-pc-name')).toBe('steps');
            expect(nav.querySelector('ul')?.classList.contains('p-steps-list')).toBe(true);
        });

        it('should re-render the root class when styleClass changes', () => {
            fixture.componentRef.setInput('styleClass', 'custom-steps');
            fixture.detectChanges();

            expect(root(fixture).classList.contains('custom-steps')).toBe(true);
            expect(root(fixture).classList.contains('p-steps')).toBe(true);

            fixture.componentRef.setInput('styleClass', 'other-steps');
            fixture.detectChanges();

            expect(root(fixture).classList.contains('custom-steps')).toBe(false);
            expect(root(fixture).classList.contains('other-steps')).toBe(true);
        });

        it('should render one item per visible model entry', () => {
            fixture.componentRef.setInput('model', [{ label: 'One' }, { label: 'Hidden', visible: false }, { label: 'Three' }]);
            fixture.detectChanges();

            const rendered = items(fixture);
            expect(rendered.length).toBe(2);
            expect(rendered[0].querySelector('.p-steps-item-number')?.textContent).toBe('1');
            expect(rendered[0].querySelector('.p-steps-item-label')?.textContent).toBe('One');
            expect(rendered[1].querySelector('.p-steps-item-number')?.textContent).toBe('3');
            expect(rendered[1].querySelector('.p-steps-item-label')?.textContent).toBe('Three');
        });

        it('should re-render when the model changes', () => {
            fixture.componentRef.setInput('model', [{ label: 'One' }]);
            fixture.detectChanges();
            expect(items(fixture).length).toBe(1);

            fixture.componentRef.setInput('model', [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }]);
            fixture.detectChanges();
            expect(items(fixture).length).toBe(3);
            expect(items(fixture)[2].textContent).toContain('Three');
        });

        it('should re-render the active item when activeIndex changes', () => {
            fixture.componentRef.setInput('model', [{ label: 'One' }, { label: 'Two' }]);
            fixture.detectChanges();

            expect(items(fixture)[0].classList.contains('p-steps-item-active')).toBe(true);
            expect(items(fixture)[0].getAttribute('aria-current')).toBe('step');
            expect(items(fixture)[1].classList.contains('p-steps-item-active')).toBe(false);
            expect(itemLinks(fixture)[0].getAttribute('aria-expanded')).toBe('true');
            expect(itemLinks(fixture)[0].getAttribute('tabindex')).toBe('0');
            expect(itemLinks(fixture)[1].getAttribute('tabindex')).toBe('-1');

            fixture.componentRef.setInput('activeIndex', 1);
            fixture.detectChanges();

            expect(steps.activeIndex()).toBe(1);
            expect(items(fixture)[0].classList.contains('p-steps-item-active')).toBe(false);
            expect(items(fixture)[0].getAttribute('aria-current')).toBeNull();
            expect(items(fixture)[1].classList.contains('p-steps-item-active')).toBe(true);
            expect(itemLinks(fixture)[1].getAttribute('aria-expanded')).toBe('true');
            expect(itemLinks(fixture)[1].getAttribute('tabindex')).toBe('0');
        });

        it('should re-render the readonly state when readonly changes', () => {
            fixture.componentRef.setInput('model', [{ label: 'One' }, { label: 'Two' }]);
            fixture.detectChanges();

            expect(root(fixture).classList.contains('p-readonly')).toBe(true);
            expect(items(fixture)[1].classList.contains('p-disabled')).toBe(true);
            expect(itemLinks(fixture)[1].getAttribute('aria-disabled')).toBe('true');

            fixture.componentRef.setInput('readonly', false);
            fixture.detectChanges();

            expect(steps.readonly()).toBe(false);
            expect(root(fixture).classList.contains('p-readonly')).toBe(false);
            expect(items(fixture)[1].classList.contains('p-disabled')).toBe(false);
            expect(itemLinks(fixture)[1].getAttribute('aria-disabled')).toBe('false');
        });

        it('should coerce the readonly and exact attributes', () => {
            fixture.componentRef.setInput('readonly', 'false');
            fixture.componentRef.setInput('exact', 'false');
            fixture.detectChanges();

            expect(steps.readonly()).toBe(false);
            expect(steps.exact()).toBe(false);
        });

        it('should apply the style input on the nav element', () => {
            fixture.componentRef.setInput('style', { marginTop: '7px' });
            fixture.detectChanges();

            expect(root(fixture).style.marginTop).toBe('7px');

            fixture.componentRef.setInput('style', { marginTop: '11px' });
            fixture.detectChanges();

            expect(root(fixture).style.marginTop).toBe('11px');
        });

        it('should re-render the ariaCurrentWhenActive attribute when exact changes', () => {
            fixture.componentRef.setInput('model', [{ label: 'One' }]);
            fixture.componentRef.setInput('readonly', false);
            fixture.detectChanges();

            expect(itemLinks(fixture)[0].getAttribute('ariaCurrentWhenActive')).toBe('step');

            fixture.componentRef.setInput('exact', false);
            fixture.detectChanges();

            expect(itemLinks(fixture)[0].getAttribute('ariaCurrentWhenActive')).toBeNull();
        });

        it('should mark a disabled item as disabled regardless of readonly', () => {
            fixture.componentRef.setInput('model', [{ label: 'One' }, { label: 'Two', disabled: true }]);
            fixture.componentRef.setInput('readonly', false);
            fixture.detectChanges();

            expect(items(fixture)[1].classList.contains('p-disabled')).toBe(true);
            expect(itemLinks(fixture)[1].getAttribute('aria-disabled')).toBe('true');
            expect(itemLinks(fixture)[1].getAttribute('tabindex')).toBe('-1');
        });

        it('should render the label as html when escape is false', () => {
            fixture.componentRef.setInput('model', [{ label: '<b>Bold</b>', escape: false }, { label: '<i>Plain</i>' }]);
            fixture.detectChanges();

            const labels = fixture.debugElement.queryAll(By.css('.p-steps-item-label')).map((label) => label.nativeElement as HTMLElement);
            expect(labels[0].querySelector('b')?.textContent).toBe('Bold');
            expect(labels[1].querySelector('i')).toBeNull();
            expect(labels[1].textContent).toBe('<i>Plain</i>');
        });

        describe('item selection', () => {
            beforeEach(() => {
                fixture.componentRef.setInput('model', [{ label: 'One' }, { label: 'Two' }, { label: 'Three', disabled: true }]);
                fixture.componentRef.setInput('readonly', false);
                fixture.detectChanges();
            });

            it('should set activeIndex and emit activeIndexChange on click', () => {
                const emitted: number[] = [];
                steps.activeIndex.subscribe((index) => emitted.push(index));

                itemLinks(fixture)[1].click();
                fixture.detectChanges();

                expect(steps.activeIndex()).toBe(1);
                expect(emitted).toEqual([1]);
                expect(items(fixture)[1].classList.contains('p-steps-item-active')).toBe(true);
                expect(items(fixture)[0].classList.contains('p-steps-item-active')).toBe(false);
            });

            it('should invoke the item command with the event, item and index', () => {
                const command = vi.fn();
                const model = steps.model() as MenuItem[];
                model[1].command = command;

                const event = new MouseEvent('click', { cancelable: true });
                steps.onItemClick(event, model[1], 1);

                expect(command).toHaveBeenCalledWith({ originalEvent: event, item: model[1], index: 1 });
                expect(event.defaultPrevented).toBe(true);
            });

            it('should not prevent the default when the item has a url', () => {
                const model = steps.model() as MenuItem[];
                model[1].url = 'https://example.com';

                const event = new MouseEvent('click', { cancelable: true });
                steps.onItemClick(event, model[1], 1);

                expect(steps.activeIndex()).toBe(1);
                expect(event.defaultPrevented).toBe(false);
            });

            it('should ignore clicks on a disabled item', () => {
                const emitted: number[] = [];
                steps.activeIndex.subscribe((index) => emitted.push(index));

                const event = new MouseEvent('click', { cancelable: true });
                steps.onItemClick(event, (steps.model() as MenuItem[])[2], 2);

                expect(steps.activeIndex()).toBe(0);
                expect(emitted).toEqual([]);
                expect(event.defaultPrevented).toBe(true);
            });

            it('should ignore clicks when readonly', () => {
                fixture.componentRef.setInput('readonly', true);
                fixture.detectChanges();
                const emitted: number[] = [];
                steps.activeIndex.subscribe((index) => emitted.push(index));

                const event = new MouseEvent('click', { cancelable: true });
                steps.onItemClick(event, (steps.model() as MenuItem[])[1], 1);

                expect(steps.activeIndex()).toBe(0);
                expect(emitted).toEqual([]);
                expect(event.defaultPrevented).toBe(true);
            });

            it('should select the item on Enter and Space', () => {
                const links = itemLinks(fixture);

                links[1].dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', cancelable: true }));
                fixture.detectChanges();
                expect(steps.activeIndex()).toBe(1);

                links[0].dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', cancelable: true }));
                fixture.detectChanges();
                expect(steps.activeIndex()).toBe(0);
            });
        });

        describe('keyboard navigation', () => {
            beforeEach(() => {
                fixture.componentRef.setInput('model', [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }]);
                fixture.componentRef.setInput('readonly', false);
                fixture.detectChanges();
            });

            it('should move the focus with ArrowRight and ArrowLeft', () => {
                const links = itemLinks(fixture);

                links[0].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight', cancelable: true }));
                expect(document.activeElement).toBe(links[1]);
                expect(links[0].tabIndex).toBe(-1);
                expect(links[1].tabIndex).toBe(0);

                links[1].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft', cancelable: true }));
                expect(document.activeElement).toBe(links[0]);
                expect(links[1].tabIndex).toBe(-1);
                expect(links[0].tabIndex).toBe(0);
            });

            it('should move the focus with Home and End', () => {
                const links = itemLinks(fixture);

                links[1].dispatchEvent(new KeyboardEvent('keydown', { code: 'End', cancelable: true }));
                expect(document.activeElement).toBe(links[2]);

                links[2].dispatchEvent(new KeyboardEvent('keydown', { code: 'Home', cancelable: true }));
                expect(document.activeElement).toBe(links[0]);
            });

            it('should keep the focus on the last item when navigating past the end', () => {
                const links = itemLinks(fixture);
                links[2].focus();

                links[2].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight', cancelable: true }));

                expect(document.activeElement).toBe(links[2]);
            });

            it('should restore the active item tabindex on Tab from another item', () => {
                const links = itemLinks(fixture);
                links[0].tabIndex = -1;
                links[1].tabIndex = 0;

                links[1].dispatchEvent(new KeyboardEvent('keydown', { code: 'Tab', cancelable: true }));

                expect(links[1].tabIndex).toBe(-1);
                expect(links[0].tabIndex).toBe(0);
            });
        });

        describe('router links', () => {
            it('should render a routerLink anchor for a clickable router item', () => {
                fixture.componentRef.setInput('model', [
                    { label: 'Personal', routerLink: '/personal' },
                    { label: 'Seat', routerLink: '/seat' }
                ]);
                fixture.componentRef.setInput('readonly', false);
                fixture.detectChanges();

                const links = itemLinks(fixture);
                expect(links[0].getAttribute('href')).toBe('/personal');
                expect(links[1].getAttribute('href')).toBe('/seat');
            });

            it('should render a plain anchor for a router item when readonly', () => {
                fixture.componentRef.setInput('model', [{ label: 'Personal', routerLink: '/personal' }]);
                fixture.detectChanges();

                expect(steps.isClickableRouterLink({ label: 'Personal', routerLink: '/personal' })).toBe(false);
                expect(itemLinks(fixture)[0].getAttribute('href')).toBeNull();
            });

            it('should mark the item matching the current route as active after navigation', async () => {
                fixture.componentRef.setInput('model', [
                    { label: 'Personal', routerLink: '/personal' },
                    { label: 'Seat', routerLink: '/seat' }
                ]);
                fixture.componentRef.setInput('readonly', false);
                fixture.detectChanges();

                const router = TestBed.inject(Router);
                await router.navigateByUrl('/seat');
                await fixture.whenStable();
                fixture.detectChanges();

                expect(items(fixture)[0].classList.contains('p-steps-item-active')).toBe(false);
                expect(items(fixture)[1].classList.contains('p-steps-item-active')).toBe(true);
                expect(items(fixture)[1].getAttribute('aria-current')).toBe('step');

                await router.navigateByUrl('/personal');
                await fixture.whenStable();
                fixture.detectChanges();

                expect(items(fixture)[0].classList.contains('p-steps-item-active')).toBe(true);
                expect(items(fixture)[1].classList.contains('p-steps-item-active')).toBe(false);
            });
        });
    });

    describe('two-way binding host', () => {
        let fixture: ComponentFixture<StepsHostComponent>;
        let host: StepsHostComponent;
        let steps: Steps;

        beforeEach(() => {
            fixture = TestBed.createComponent(StepsHostComponent);
            host = fixture.componentInstance;
            steps = fixture.debugElement.query(By.directive(Steps)).componentInstance;
            fixture.detectChanges();
        });

        it('should write the clicked index back to the host through [(activeIndex)]', () => {
            itemLinks(fixture)[2].click();
            fixture.detectChanges();

            expect(host.activeIndex).toBe(2);
            expect(steps.activeIndex()).toBe(2);
            expect(items(fixture)[2].classList.contains('p-steps-item-active')).toBe(true);
        });

        it('should follow the host activeIndex', async () => {
            host.activeIndex = 1;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(steps.activeIndex()).toBe(1);
            expect(items(fixture)[1].classList.contains('p-steps-item-active')).toBe(true);
        });

        it('should merge styleClass with the root classes on the nav element', async () => {
            host.customClass = 'custom-steps';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(steps.styleClass()).toBe('custom-steps');
            expect(root(fixture).classList.contains('custom-steps')).toBe(true);
            expect(root(fixture).classList.contains('p-steps')).toBe(true);
            expect(root(fixture).classList.contains('p-readonly')).toBe(false);
        });

        it('should apply the style binding on the nav element', async () => {
            host.customStyle = { padding: '3px' };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(root(fixture).style.padding).toBe('3px');
        });
    });
});

describe('Steps Signal Query API', () => {
    it('should resolve the list viewChild after render', async () => {
        TestBed.configureTestingModule({
            imports: [StepsQueryApiHostComponent],
            providers: [provideRouter([]), provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(StepsQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const instance = fixture.debugElement.query(By.directive(Steps)).componentInstance;
        expect(instance.listViewChild().nativeElement).toBeDefined();
    });
});
