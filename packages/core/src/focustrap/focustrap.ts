import { isPlatformBrowser } from '@angular/common';
import { booleanAttribute, Directive, effect, input, NgModule, signal, untracked } from '@angular/core';
import { createElement, focus, getFirstFocusableElement, getLastFocusableElement } from '@exhaustive-ui/utils';
import { BaseComponent } from '@exhaustive-ui/core/basecomponent';

/**
 * Focus Trap keeps focus within a certain DOM element while tabbing.
 * @group Components
 */
@Directive({
    selector: '[pFocusTrap]'
})
export class FocusTrap extends BaseComponent {
    /**
     * When set as true, focus wouldn't be managed.
     * @group Props
     */
    readonly pFocusTrapDisabled = input(false, { transform: booleanAttribute });

    firstHiddenFocusableElement = signal<HTMLElement | undefined>(undefined);

    lastHiddenFocusableElement = signal<HTMLElement | undefined>(undefined);

    constructor() {
        super();
        effect(() => {
            if (!isPlatformBrowser(this.platformId)) {
                return;
            }

            const disabled = this.pFocusTrapDisabled();

            untracked(() => {
                if (disabled) {
                    this.removeHiddenFocusableElements();
                } else {
                    this.createHiddenFocusableElements();
                }
            });
        });
    }

    removeHiddenFocusableElements() {
        const firstHiddenFocusableElement = this.firstHiddenFocusableElement();
        const lastHiddenFocusableElement = this.lastHiddenFocusableElement();

        if (firstHiddenFocusableElement && firstHiddenFocusableElement.parentNode) {
            firstHiddenFocusableElement.parentNode.removeChild(firstHiddenFocusableElement);
        }

        if (lastHiddenFocusableElement && lastHiddenFocusableElement.parentNode) {
            lastHiddenFocusableElement.parentNode.removeChild(lastHiddenFocusableElement);
        }
    }
    getComputedSelector(selector) {
        return `:not(.p-hidden-focusable):not([data-p-hidden-focusable="true"])${selector ?? ''}`;
    }

    createHiddenFocusableElements() {
        const tabindex = '0';

        const createFocusableElement = (onFocus) => {
            return createElement('span', {
                class: 'p-hidden-accessible p-hidden-focusable',
                tabindex,
                role: 'presentation',
                'aria-hidden': true,
                'data-p-hidden-accessible': true,
                'data-p-hidden-focusable': true,
                onFocus: onFocus?.bind(this)
            }) as HTMLElement;
        };

        const firstHiddenFocusableElement = createFocusableElement(this.onFirstHiddenElementFocus);
        const lastHiddenFocusableElement = createFocusableElement(this.onLastHiddenElementFocus);

        firstHiddenFocusableElement.setAttribute('data-pc-section', 'firstfocusableelement');
        lastHiddenFocusableElement.setAttribute('data-pc-section', 'lastfocusableelement');

        this.el.nativeElement.prepend(firstHiddenFocusableElement);
        this.el.nativeElement.append(lastHiddenFocusableElement);

        this.firstHiddenFocusableElement.set(firstHiddenFocusableElement);
        this.lastHiddenFocusableElement.set(lastHiddenFocusableElement);
    }

    onFirstHiddenElementFocus(event) {
        const { currentTarget, relatedTarget } = event;
        const lastHiddenFocusableElement = this.lastHiddenFocusableElement();
        const focusableElement = relatedTarget === lastHiddenFocusableElement || !this.el.nativeElement?.contains(relatedTarget) ? getFirstFocusableElement(currentTarget.parentElement, ':not(.p-hidden-focusable)') : lastHiddenFocusableElement;

        focus(focusableElement as any);
    }

    onLastHiddenElementFocus(event) {
        const { currentTarget, relatedTarget } = event;
        const firstHiddenFocusableElement = this.firstHiddenFocusableElement();
        const focusableElement = relatedTarget === firstHiddenFocusableElement || !this.el.nativeElement?.contains(relatedTarget) ? getLastFocusableElement(currentTarget.parentElement, ':not(.p-hidden-focusable)') : firstHiddenFocusableElement;

        focus(focusableElement as any);
    }
}

@NgModule({
    imports: [FocusTrap],
    exports: [FocusTrap]
})
export class FocusTrapModule {}
