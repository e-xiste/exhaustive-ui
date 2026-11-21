import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createMotion, getMotionMetadata } from '@exhaustive-ui/motion';
import { MotionModule } from './motion.module';

describe('Motion in environments without transition/animation styles (optimus-ui#479)', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should not throw when the computed style has no transition/animation properties (jsdom)', async () => {
        const element = document.createElement('div');
        document.body.appendChild(element);
        // jsdom's CSSStyleDeclaration does not implement transition-* / animation-* properties: they read as undefined
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({} as CSSStyleDeclaration);

        expect(getMotionMetadata(element).type).toBeUndefined();

        const onAfterEnter = vi.fn();
        const onAfterLeave = vi.fn();
        const motion = createMotion(element, { name: 'p-test', onAfterEnter, onAfterLeave });
        await motion.enter();
        await motion.leave();

        expect(onAfterEnter).toHaveBeenCalledTimes(1);
        expect(onAfterLeave).toHaveBeenCalledTimes(1);
        element.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MotionModule],
    template: `
        <div class="flicker-directive" [pMotion]="visible()" pMotionName="flicker" style="height: 40px">directive</div>
        <p-motion [visible]="visible()" name="flicker"><div class="flicker-component" style="height: 40px">component</div></p-motion>
    `
})
class MotionLeaveHostComponent {
    visible = signal(true);
}

describe('Motion leave end (optimus-ui#125)', () => {
    let styleEl: HTMLStyleElement;

    beforeEach(() => {
        styleEl = document.createElement('style');
        styleEl.textContent = '.flicker-leave-active { animation: flicker-out 80ms forwards } @keyframes flicker-out { to { opacity: 0 } }';
        document.head.appendChild(styleEl);
    });

    afterEach(() => {
        styleEl.remove();
    });

    it('should hide the element before the next frame after the leave animation ends', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({ imports: [MotionLeaveHostComponent], providers: [provideZonelessChangeDetection()] });
        const fixture = TestBed.createComponent(MotionLeaveHostComponent);
        await fixture.whenStable();
        await new Promise((resolve) => setTimeout(resolve, 100));

        const directiveEl = fixture.nativeElement.querySelector('.flicker-directive') as HTMLElement;
        const componentEl = fixture.nativeElement.querySelector('p-motion') as HTMLElement;
        // the first frame painted once the leave classes are removed must not show the element again at full opacity
        const firstFrameAfterLeave = (el: HTMLElement) =>
            new Promise<{ display: string; opacity: string; connected: boolean }>((resolve) => {
                let leaving = false;
                const observer = new MutationObserver(() => {
                    if (el.classList.contains('flicker-leave-active')) {
                        leaving = true;
                    } else if (leaving) {
                        observer.disconnect();
                        requestAnimationFrame(() => {
                            const style = getComputedStyle(el);
                            resolve({ display: style.display, opacity: style.opacity, connected: el.isConnected });
                        });
                    }
                });
                observer.observe(el, { attributes: true, attributeFilter: ['class'] });
            });
        const directiveFrame = firstFrameAfterLeave(directiveEl);
        const componentFrame = firstFrameAfterLeave(componentEl);

        fixture.componentInstance.visible.set(false);
        await fixture.whenStable();

        for (const frame of [await directiveFrame, await componentFrame]) {
            expect(!frame.connected || frame.display === 'none' || frame.opacity === '0').toBe(true);
        }
    });
});
