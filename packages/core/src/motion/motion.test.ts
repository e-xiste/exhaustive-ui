import { createMotion, getMotionMetadata } from '@exhaustive-ui/motion';

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
