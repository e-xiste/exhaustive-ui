import { Component, PLATFORM_ID, provideZonelessChangeDetection, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Exhaustive } from '@exhaustive-ui/core/config';
import type { TourCloseEvent, TourFinishEvent, TourLabels, TourMissingTarget, TourPlacement, TourStep, TourStepChangeEvent } from '@exhaustive-ui/core/types/tour';
import { Tour } from './tour';

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));

@Component({
    standalone: true,
    imports: [Tour],
    template: `
        <div [attr.dir]="dir()" style="padding: 200px 300px">
            <button id="trigger" (click)="tour.start()">Start</button>
            <button id="first" style="width: 120px; height: 40px">First</button>
            <button id="second" style="width: 120px; height: 40px">Second</button>
            <p-tour
                #tour
                [steps]="steps()"
                [(visible)]="visible"
                [(activeIndex)]="activeIndex"
                [mask]="mask()"
                [dismissableMask]="dismissableMask()"
                [placement]="placement()"
                [missingTarget]="missingTarget()"
                [disableInteraction]="disableInteraction()"
                [labels]="labels()"
                [appendTo]="appendTo()"
                (onStepChange)="changes.push($event)"
                (onFinish)="finished.push($event)"
                (onClose)="closed.push($event)"
            />
        </div>
    `
})
class TourHost {
    tour = viewChild.required<Tour>('tour');
    dir = signal<'ltr' | 'rtl'>('ltr');
    steps = signal<TourStep[]>([
        { target: '#first', title: 'First step', content: 'The first button.' },
        { target: '#second', title: 'Second step', content: 'The second button.' },
        { title: 'All set', content: 'A centered step.' }
    ]);
    visible = signal(false);
    activeIndex = signal(0);
    mask = signal(true);
    dismissableMask = signal(false);
    placement = signal<TourPlacement>('bottom');
    missingTarget = signal<TourMissingTarget>('center');
    disableInteraction = signal(false);
    labels = signal<Partial<TourLabels> | undefined>(undefined);
    appendTo = signal<'body' | 'self'>('body');
    changes: TourStepChangeEvent[] = [];
    finished: TourFinishEvent[] = [];
    closed: TourCloseEvent[] = [];
}

@Component({
    standalone: true,
    imports: [Tour],
    template: `
        <button id="target">Target</button>
        <p-tour [steps]="steps" [(visible)]="visible">
            <ng-template #header let-step let-index="index">
                <span class="custom-header">{{ index + 1 }}. {{ step.title }}</span>
            </ng-template>
            <ng-template #content let-step>
                <em class="custom-content">{{ step.data.note }}</em>
            </ng-template>
            <ng-template #footer let-next="next" let-last="last">
                <button class="custom-next" (click)="next()">{{ last ? 'Finish' : 'Continue' }}</button>
            </ng-template>
        </p-tour>
    `
})
class PartsTemplateHost {
    visible = true;
    steps: TourStep[] = [
        { target: '#target', title: 'One', data: { note: 'first note' } },
        { title: 'Two', data: { note: 'second note' } }
    ];
}

@Component({
    standalone: true,
    imports: [Tour],
    template: `
        <p-tour [steps]="steps" [(visible)]="visible">
            <ng-template #step let-step let-index="index" let-total="total" let-titleId="titleId" let-close="close">
                <h2 class="custom-title" [id]="titleId">{{ step.title }} {{ index + 1 }}/{{ total }}</h2>
                <button class="custom-close" (click)="close()">Got it</button>
            </ng-template>
        </p-tour>
    `
})
class StepTemplateHost {
    visible = true;
    steps: TourStep[] = [{ title: 'Welcome' }];
}

describe('Tour', () => {
    let fixture: ComponentFixture<TourHost>;
    let host: TourHost;

    const card = () => document.querySelector<HTMLElement>('.p-tour-card');
    const root = () => document.querySelector<HTMLElement>('.p-tour');
    const buttons = () => Array.from(card()?.querySelectorAll<HTMLButtonElement>('.p-tour-footer button') ?? []);
    const nextButton = () => card()!.querySelector<HTMLButtonElement>('.p-tour-next-button button')!;
    const prevButton = () => card()?.querySelector<HTMLButtonElement>('.p-tour-prev-button button') ?? null;
    const closeButton = () => card()!.querySelector<HTMLButtonElement>('.p-tour-close-button button')!;

    const settle = async () => {
        await fixture.whenStable();
        await frame();
        await fixture.whenStable();
    };

    const start = async (index?: number) => {
        host.tour().start(index);
        await settle();
    };

    const key = (target: EventTarget, keyName: string, init: KeyboardEventInit = {}) => {
        const event = new KeyboardEvent('keydown', { key: keyName, bubbles: true, cancelable: true, ...init });
        target.dispatchEvent(event);
        return event;
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TourHost, PartsTemplateHost, StepTemplateHost],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TourHost);
        host = fixture.componentInstance;
        document.body.appendChild(fixture.nativeElement);
        if (!document.getElementById('tour-test-style')) {
            const style = document.createElement('style');
            style.id = 'tour-test-style';
            style.textContent = '.p-tour-card { width: 160px; }';
            document.head.appendChild(style);
        }
        await fixture.whenStable();
    });

    afterEach(() => {
        fixture.destroy();
        fixture.nativeElement.remove();
        document.querySelectorAll('.p-tour').forEach((element) => element.remove());
    });

    describe('rendering', () => {
        it('renders nothing until it starts', () => {
            expect(root()).toBeNull();
        });

        it('renders the card of the first step in the body', async () => {
            await start();
            expect(root()).not.toBeNull();
            expect(root()!.parentElement).toBe(document.body);
            expect(card()!.querySelector('.p-tour-title')!.textContent!.trim()).toBe('First step');
            expect(card()!.querySelector('.p-tour-content')!.textContent!.trim()).toBe('The first button.');
            expect(host.visible()).toBe(true);
        });

        it('shows the counter and the progress dots', async () => {
            await start();
            expect(card()!.querySelector('.p-tour-counter [aria-hidden]')!.textContent).toBe('1 / 3');
            const dots = card()!.querySelectorAll('.p-tour-dot');
            expect(dots.length).toBe(3);
            expect(dots[0].classList).toContain('p-tour-dot-active');
            expect(dots[1].classList).not.toContain('p-tour-dot-active');
        });

        it('hides the back button on the first step and shows done on the last one', async () => {
            await start();
            expect(prevButton()).toBeNull();
            expect(nextButton().textContent!.trim()).toBe('Next');
            await start(2);
            expect(prevButton()).not.toBeNull();
            expect(prevButton()!.textContent!.trim()).toBe('Back');
            expect(nextButton().textContent!.trim()).toBe('Done');
        });

        it('keeps the tour inside the component with appendTo self', async () => {
            host.appendTo.set('self');
            await fixture.whenStable();
            await start();
            expect(fixture.nativeElement.querySelector('p-tour .p-tour')).not.toBeNull();
        });

        it('renders nothing and warns without steps', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            host.steps.set([]);
            await fixture.whenStable();
            await start();
            expect(root()).toBeNull();
            expect(host.visible()).toBe(false);
            expect(warn).toHaveBeenCalled();
            warn.mockRestore();
        });
    });

    describe('navigation', () => {
        it('goes to the next and previous steps with the buttons', async () => {
            await start();
            nextButton().click();
            await settle();
            expect(card()!.querySelector('.p-tour-title')!.textContent!.trim()).toBe('Second step');
            expect(host.activeIndex()).toBe(1);
            expect(host.changes).toEqual([{ index: 1, previousIndex: 0, step: host.steps()[1] }]);
            prevButton()!.click();
            await settle();
            expect(host.activeIndex()).toBe(0);
            expect(host.changes[1]).toEqual({ index: 0, previousIndex: 1, step: host.steps()[0] });
        });

        it('finishes the tour on the last step', async () => {
            await start(2);
            nextButton().click();
            await settle();
            expect(host.finished).toEqual([{ index: 2, step: host.steps()[2] }]);
            expect(host.closed.length).toBe(0);
            expect(host.visible()).toBe(false);
            expect(root()).toBeNull();
        });

        it('exposes next, prev, goTo, close and refresh', async () => {
            const tour = host.tour();
            await start();
            tour.next();
            await settle();
            expect(tour.currentIndex()).toBe(1);
            tour.prev();
            await settle();
            expect(tour.currentIndex()).toBe(0);
            tour.goTo(2);
            await settle();
            expect(tour.currentIndex()).toBe(2);
            tour.refresh();
            tour.close();
            await settle();
            expect(host.closed[0].reason).toBe('api');
            expect(host.closed[0].index).toBe(2);
        });

        it('follows activeIndex changes from outside', async () => {
            await start();
            host.activeIndex.set(1);
            await settle();
            expect(host.tour().currentIndex()).toBe(1);
            expect(card()!.querySelector('.p-tour-title')!.textContent!.trim()).toBe('Second step');
        });

        it('starts and stops with the visible model', async () => {
            host.activeIndex.set(1);
            host.visible.set(true);
            await settle();
            expect(card()!.querySelector('.p-tour-title')!.textContent!.trim()).toBe('Second step');
            host.visible.set(false);
            await settle();
            expect(root()).toBeNull();
            expect(host.closed.length).toBe(0);
        });

        it('does not emit onStepChange when the tour starts', async () => {
            await start();
            expect(host.changes.length).toBe(0);
        });

        it('renders the new steps when they change while the tour runs', async () => {
            await start();
            host.steps.set([{ title: 'Replaced', content: 'New step' }]);
            await settle();
            expect(card()!.querySelector('.p-tour-title')!.textContent!.trim()).toBe('Replaced');
            expect(card()!.querySelectorAll('.p-tour-dot').length).toBe(0);
        });

        it('clamps an out of range index', async () => {
            await start(10);
            expect(host.tour().currentIndex()).toBe(2);
            expect(host.activeIndex()).toBe(2);
        });
    });

    describe('closing', () => {
        it('closes with the close button', async () => {
            await start();
            closeButton().click();
            await settle();
            expect(host.closed).toEqual([{ index: 0, step: host.steps()[0], reason: 'close' }]);
            expect(host.visible()).toBe(false);
            expect(root()).toBeNull();
        });

        it('closes with Escape', async () => {
            await start(1);
            key(document.activeElement ?? document.body, 'Escape');
            await settle();
            expect(host.closed[0]).toEqual({ index: 1, step: host.steps()[1], reason: 'escape' });
        });

        it('only closes on a mask click with dismissableMask', async () => {
            await start();
            const path = () => document.querySelector<SVGPathElement>('.p-tour-mask-path')!;
            path().dispatchEvent(new MouseEvent('click', { bubbles: true }));
            await settle();
            expect(root()).not.toBeNull();
            host.dismissableMask.set(true);
            await settle();
            path().dispatchEvent(new MouseEvent('click', { bubbles: true }));
            await settle();
            expect(host.closed[0].reason).toBe('mask');
            expect(root()).toBeNull();
        });
    });

    describe('spotlight and placement', () => {
        it('cuts the spotlight around the target with its padding', async () => {
            await start();
            const rect = document.querySelector('#first')!.getBoundingClientRect();
            const spotlight = document.querySelector<HTMLElement>('.p-tour-spotlight')!.getBoundingClientRect();
            expect(spotlight.left).toBeCloseTo(rect.left - 8, 0);
            expect(spotlight.top).toBeCloseTo(rect.top - 8, 0);
            expect(spotlight.width).toBeCloseTo(rect.width + 16, 0);
            const d = document.querySelector('.p-tour-mask-path')!.getAttribute('d')!;
            expect(d.match(/M/g)!.length).toBe(2);
        });

        it('places the card below the target by default, with an arrow', async () => {
            await start();
            const target = document.querySelector('#first')!.getBoundingClientRect();
            const box = card()!.getBoundingClientRect();
            expect(card()!.getAttribute('data-p-placement')).toBe('bottom');
            expect(box.top).toBeGreaterThan(target.bottom);
            expect(card()!.querySelector('.p-tour-arrow')).not.toBeNull();
        });

        it('honors the placement of a step', async () => {
            host.steps.set([{ target: '#first', title: 'Right', placement: 'right' }]);
            await fixture.whenStable();
            const first = document.querySelector<HTMLElement>('#first')!;
            first.style.position = 'fixed';
            first.style.top = '200px';
            first.style.left = '8px';
            await start();
            const target = document.querySelector('#first')!.getBoundingClientRect();
            expect(card()!.getAttribute('data-p-placement')).toBe('right');
            expect(card()!.getBoundingClientRect().left).toBeGreaterThan(target.right);
        });

        it('flips to the opposite side when there is no room', async () => {
            host.steps.set([{ target: '#first', title: 'Top', placement: 'top' }]);
            await fixture.whenStable();
            window.scrollTo(0, 0);
            const target = document.querySelector<HTMLElement>('#first')!;
            target.style.position = 'fixed';
            target.style.top = '4px';
            await start();
            expect(card()!.getAttribute('data-p-placement')).toBe('bottom');
        });

        it('picks the side with the most room with auto', async () => {
            host.steps.set([{ target: '#first', title: 'Auto', placement: 'auto' }]);
            await fixture.whenStable();
            const target = document.querySelector<HTMLElement>('#first')!;
            target.style.position = 'fixed';
            target.style.top = '8px';
            target.style.left = '8px';
            await start();
            const placement = card()!.getAttribute('data-p-placement');
            expect(['bottom', 'right']).toContain(placement);
            const box = card()!.getBoundingClientRect();
            expect(box.left).toBeGreaterThanOrEqual(8);
            expect(box.top).toBeGreaterThanOrEqual(8);
        });

        it('points the arrow at the target', async () => {
            await start();
            const target = document.querySelector('#first')!.getBoundingClientRect();
            const arrow = card()!.querySelector<HTMLElement>('.p-tour-arrow')!;
            const left = card()!.getBoundingClientRect().left + parseFloat(arrow.style.left);
            expect(Math.abs(left - (target.left + target.width / 2))).toBeLessThan(2);
        });

        it('swaps left and right in right-to-left documents', async () => {
            host.dir.set('rtl');
            host.steps.set([{ target: '#first', title: 'Right', placement: 'right' }]);
            await fixture.whenStable();
            const target = document.querySelector<HTMLElement>('#first')!;
            target.style.position = 'fixed';
            target.style.top = '200px';
            target.style.right = '8px';
            await start();
            expect(card()!.getAttribute('data-p-placement')).toBe('left');
            expect(root()!.getAttribute('dir')).toBe('rtl');
        });

        it('centers a step without target, without spotlight nor arrow', async () => {
            await start(2);
            expect(card()!.getAttribute('data-p-placement')).toBe('center');
            expect(document.querySelector('.p-tour-spotlight')).toBeNull();
            expect(card()!.querySelector('.p-tour-arrow')).toBeNull();
            const box = card()!.getBoundingClientRect();
            const viewport = document.documentElement.clientWidth;
            expect(Math.abs(box.left + box.width / 2 - viewport / 2)).toBeLessThan(2);
        });

        it('follows the target when the page scrolls', async () => {
            const spacer = document.createElement('div');
            spacer.style.height = '3000px';
            document.body.appendChild(spacer);
            window.scrollTo(0, 0);
            await start();
            const before = document.querySelector<HTMLElement>('.p-tour-spotlight')!.getBoundingClientRect().top;
            window.scrollTo(0, 50);
            window.dispatchEvent(new Event('scroll'));
            document.dispatchEvent(new Event('scroll'));
            await settle();
            await settle();
            const after = document.querySelector<HTMLElement>('.p-tour-spotlight')!.getBoundingClientRect().top;
            expect(Math.round(before - after)).toBe(50);
            window.scrollTo(0, 0);
            spacer.remove();
        });

        it('blocks the target when interaction is disabled', async () => {
            await start();
            expect(document.querySelector('.p-tour-blocker')).toBeNull();
            host.disableInteraction.set(true);
            await settle();
            expect(document.querySelector('.p-tour-blocker')).not.toBeNull();
        });

        it('renders no mask and a non modal dialog without mask', async () => {
            host.mask.set(false);
            await fixture.whenStable();
            await start();
            expect(document.querySelector('.p-tour-mask')).toBeNull();
            expect(card()!.getAttribute('aria-modal')).toBe('false');
            expect(document.querySelector('.p-tour-spotlight')).not.toBeNull();
        });
    });

    describe('missing targets', () => {
        it('centers a step whose target is missing, with a warning', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            host.steps.set([
                { target: '#nothing', title: 'Missing' },
                { target: '#second', title: 'Second' }
            ]);
            await fixture.whenStable();
            await start();
            expect(card()!.getAttribute('data-p-placement')).toBe('center');
            expect(warn).toHaveBeenCalledWith(expect.stringContaining('step 1'));
            warn.mockRestore();
        });

        it('skips a step whose target is missing', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            host.missingTarget.set('skip');
            host.steps.set([
                { target: '#first', title: 'First' },
                { target: () => null, title: 'Missing' },
                { target: '#second', title: 'Second' }
            ]);
            await fixture.whenStable();
            await start();
            nextButton().click();
            await settle();
            expect(host.tour().currentIndex()).toBe(2);
            expect(host.activeIndex()).toBe(2);
            prevButton()!.click();
            await settle();
            expect(host.tour().currentIndex()).toBe(0);
            warn.mockRestore();
        });

        it('accepts an element and a function as target', async () => {
            const second = document.querySelector<HTMLElement>('#second')!;
            host.steps.set([
                { target: second, title: 'Element' },
                { target: () => document.querySelector<HTMLElement>('#first'), title: 'Function' }
            ]);
            await fixture.whenStable();
            await start();
            expect(card()!.getAttribute('data-p-placement')).not.toBe('center');
            host.tour().next();
            await settle();
            expect(card()!.getAttribute('data-p-placement')).not.toBe('center');
        });

        it('does not crash on an invalid selector', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            host.steps.set([{ target: '##', title: 'Invalid' }]);
            await fixture.whenStable();
            await start();
            expect(card()).not.toBeNull();
            warn.mockRestore();
        });
    });

    describe('accessibility', () => {
        it('is a labelled and described modal dialog', async () => {
            await start();
            const dialog = card()!;
            expect(dialog.getAttribute('role')).toBe('dialog');
            expect(dialog.getAttribute('aria-modal')).toBe('true');
            expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)!.textContent!.trim()).toBe('First step');
            expect(document.getElementById(dialog.getAttribute('aria-describedby')!)!.textContent!.trim()).toBe('The first button.');
            expect(dialog.querySelector('.p-tour-counter .p-hidden-accessible')!.textContent).toBe('Step 1 of 3');
            expect(closeButton().getAttribute('aria-label')).toBe('Close');
        });

        it('labels a step without title with the step counter', async () => {
            host.steps.set([{ content: 'No title here' }]);
            await fixture.whenStable();
            await start();
            expect(card()!.getAttribute('aria-labelledby')).toBeNull();
            expect(card()!.getAttribute('aria-label')).toBe('Step 1 of 1');
        });

        it('moves the focus into the card and back to the trigger at the end', async () => {
            const trigger = document.querySelector<HTMLButtonElement>('#trigger')!;
            trigger.focus();
            trigger.click();
            await settle();
            expect(document.activeElement).toBe(card());
            closeButton().click();
            await settle();
            expect(document.activeElement).toBe(trigger);
        });

        it('keeps the focus on the next button from step to step', async () => {
            await start();
            nextButton().focus();
            nextButton().click();
            await settle();
            expect(document.activeElement).toBe(nextButton());
        });

        it('traps the focus in the card while the mask is displayed', async () => {
            await start(1);
            const focusables = [closeButton(), ...buttons()];
            focusables[focusables.length - 1].focus();
            const event = key(document.activeElement!, 'Tab');
            expect(event.defaultPrevented).toBe(true);
            expect(document.activeElement).toBe(focusables[0]);
            const back = key(document.activeElement!, 'Tab', { shiftKey: true });
            expect(back.defaultPrevented).toBe(true);
            expect(document.activeElement).toBe(focusables[focusables.length - 1]);
            document.querySelector<HTMLButtonElement>('#trigger')!.focus();
            key(document.activeElement!, 'Tab');
            expect(card()!.contains(document.activeElement)).toBe(true);
        });

        it('does not trap the focus without mask', async () => {
            host.mask.set(false);
            await fixture.whenStable();
            await start(1);
            buttons()[buttons().length - 1].focus();
            const event = key(document.activeElement!, 'Tab');
            expect(event.defaultPrevented).toBe(false);
        });

        it('navigates with the arrow keys', async () => {
            await start();
            key(card()!, 'ArrowRight');
            await settle();
            expect(host.tour().currentIndex()).toBe(1);
            key(card()!, 'ArrowLeft');
            await settle();
            expect(host.tour().currentIndex()).toBe(0);
        });

        it('does not finish the tour with the arrow keys', async () => {
            await start(2);
            key(card()!, 'ArrowRight');
            await settle();
            expect(host.visible()).toBe(true);
            expect(host.finished.length).toBe(0);
        });

        it('swaps the arrow keys in right-to-left documents', async () => {
            host.dir.set('rtl');
            document.documentElement.dir = 'rtl';
            await fixture.whenStable();
            await start();
            key(card()!, 'ArrowLeft');
            await settle();
            expect(host.tour().currentIndex()).toBe(1);
            document.documentElement.dir = '';
        });

        it('announces the steps in a live region', async () => {
            await start();
            const region = root()!.querySelector('[aria-live="polite"]')!;
            expect(region.textContent).toBe('Step 1 of 3: First step');
            nextButton().click();
            await settle();
            expect(region.textContent).toBe('Step 2 of 3: Second step');
        });
    });

    describe('templates', () => {
        it('renders the header, content and footer templates', async () => {
            const templateFixture = TestBed.createComponent(PartsTemplateHost);
            await templateFixture.whenStable();
            await frame();
            await templateFixture.whenStable();
            const dialog = document.querySelector<HTMLElement>('.p-tour-card')!;
            expect(dialog.querySelector('.custom-header')!.textContent).toBe('1. One');
            expect(dialog.querySelector('.custom-content')!.textContent).toBe('first note');
            expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)!.textContent).toContain('1. One');
            expect(dialog.querySelector('.p-tour-next-button')).toBeNull();
            dialog.querySelector<HTMLButtonElement>('.custom-next')!.click();
            await templateFixture.whenStable();
            expect(dialog.querySelector('.custom-next')!.textContent).toBe('Finish');
            dialog.querySelector<HTMLButtonElement>('.custom-next')!.click();
            await templateFixture.whenStable();
            expect(templateFixture.componentInstance.visible).toBe(false);
            templateFixture.destroy();
        });

        it('replaces the whole card with the step template', async () => {
            const templateFixture = TestBed.createComponent(StepTemplateHost);
            await templateFixture.whenStable();
            await frame();
            await templateFixture.whenStable();
            const dialog = document.querySelector<HTMLElement>('.p-tour-card')!;
            expect(dialog.querySelector('.p-tour-footer')).toBeNull();
            expect(dialog.querySelector('.custom-title')!.textContent!.trim()).toBe('Welcome 1/1');
            expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)!.classList).toContain('custom-title');
            dialog.querySelector<HTMLButtonElement>('.custom-close')!.click();
            await templateFixture.whenStable();
            expect(templateFixture.componentInstance.visible).toBe(false);
            templateFixture.destroy();
        });
    });

    describe('labels', () => {
        it('replaces the texts with labels', async () => {
            host.labels.set({ next: 'Suivant', prev: 'Retour', done: 'Terminer', close: 'Fermer', counter: '{0} sur {1}', stepLabel: 'Étape {0} sur {1}', stepMessage: 'Étape {0} : {2}' });
            await fixture.whenStable();
            await start(1);
            expect(nextButton().textContent!.trim()).toBe('Suivant');
            expect(prevButton()!.textContent!.trim()).toBe('Retour');
            expect(closeButton().getAttribute('aria-label')).toBe('Fermer');
            expect(card()!.querySelector('.p-tour-counter [aria-hidden]')!.textContent).toBe('2 sur 3');
            expect(root()!.querySelector('[aria-live]')!.textContent).toBe('Étape 2 : Second step');
            host.tour().next();
            await settle();
            expect(nextButton().textContent!.trim()).toBe('Terminer');
        });

        it('uses the aria close text of the locale', async () => {
            TestBed.inject(Exhaustive).setTranslation({ aria: { close: 'Schließen' } });
            await start();
            expect(closeButton().getAttribute('aria-label')).toBe('Schließen');
            TestBed.inject(Exhaustive).setTranslation({ aria: { close: 'Close' } });
        });
    });

    describe('pass through and unstyled', () => {
        it('passes attributes to the card', async () => {
            const tourFixture = TestBed.createComponent(Tour);
            tourFixture.componentRef.setInput('steps', [{ title: 'PT' }]);
            tourFixture.componentRef.setInput('pt', { card: { 'data-test': 'card' }, root: { class: 'custom-root' } });
            await tourFixture.whenStable();
            tourFixture.componentInstance.start();
            await tourFixture.whenStable();
            await frame();
            expect(document.querySelector('.p-tour-card')!.getAttribute('data-test')).toBe('card');
            expect(document.querySelector('.p-tour')!.classList).toContain('custom-root');
            tourFixture.destroy();
            expect(document.querySelector('.p-tour')).toBeNull();
        });

        it('renders no class in unstyled mode', async () => {
            const tourFixture = TestBed.createComponent(Tour);
            tourFixture.componentRef.setInput('steps', [{ title: 'Unstyled' }]);
            tourFixture.componentRef.setInput('unstyled', true);
            tourFixture.componentInstance.start();
            await tourFixture.whenStable();
            await frame();
            const dialog = document.querySelector('[role="dialog"]')!;
            expect(dialog).not.toBeNull();
            expect(dialog.classList).not.toContain('p-tour-card');
            tourFixture.destroy();
        });
    });

    describe('server', () => {
        it('renders nothing on the server', async () => {
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [Tour],
                providers: [provideZonelessChangeDetection(), { provide: PLATFORM_ID, useValue: 'server' }]
            }).compileComponents();
            const serverFixture = TestBed.createComponent(Tour);
            serverFixture.componentRef.setInput('steps', [{ title: 'Server' }]);
            serverFixture.componentRef.setInput('visible', true);
            await serverFixture.whenStable();
            expect(serverFixture.componentInstance.active()).toBe(false);
            expect(serverFixture.nativeElement.querySelector('.p-tour')).toBeNull();
            serverFixture.destroy();
        });
    });
});
