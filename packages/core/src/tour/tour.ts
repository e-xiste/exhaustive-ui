import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    effect,
    ElementRef,
    inject,
    input,
    model,
    NgModule,
    numberAttribute,
    output,
    signal,
    TemplateRef,
    untracked,
    viewChild,
    ViewEncapsulation
} from '@angular/core';
import { SharedModule, TranslationKeys } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { Button } from '@exhaustive-ui/core/button';
import { TimesIcon } from '@exhaustive-ui/core/icons';
import type { TourCloseEvent, TourCloseReason, TourFinishEvent, TourLabels, TourMissingTarget, TourPassThrough, TourPlacement, TourStep, TourStepChangeEvent, TourStepTemplateContext, TourTarget } from '@exhaustive-ui/core/types/tour';
import { ZIndexUtils } from '@exhaustive-ui/core/utils';
import { getFocusableElements, uuid } from '@exhaustive-ui/utils';
import { TourStyle } from './style/tourstyle';

/**
 * Default texts of Tour.
 * @group Constants
 */
export const TOUR_DEFAULT_LABELS: TourLabels = {
    next: 'Next',
    prev: 'Back',
    done: 'Done',
    close: 'Close',
    counter: '{0} / {1}',
    stepLabel: 'Step {0} of {1}',
    stepMessage: 'Step {0} of {1}: {2}'
};

type TourSide = 'top' | 'bottom' | 'left' | 'right' | 'center';

interface TourRect {
    top: number;
    left: number;
    width: number;
    height: number;
    radius: number;
}

/** Minimum distance between the card and the edges of the viewport. */
const VIEWPORT_MARGIN = 8;

/** Minimum distance between the arrow and the corners of the card. */
const ARROW_MARGIN = 18;

const OPPOSITE: Record<string, TourSide> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

const format = (text: string, ...values: (string | number)[]) => values.reduce<string>((acc, value, index) => acc.replace(`{${index}}`, String(value)), text);

const round = (value: number) => Math.round(value * 100) / 100;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

/**
 * Tour guides the user through the interface, one step at a time: a spotlight highlights an element and a card next to it explains it.
 * @group Components
 */
@Component({
    selector: 'p-tour',
    standalone: true,
    imports: [NgTemplateOutlet, SharedModule, BindModule, Button, TimesIcon],
    template: `
        @if (active()) {
            <div #container [class]="cx('root')" [attr.dir]="dir()" [attr.data-p]="dataP()" [pBind]="ptm('root')">
                @if (mask()) {
                    <svg [class]="cx('mask')" [attr.width]="viewport().width" [attr.height]="viewport().height" aria-hidden="true" [pBind]="ptm('mask')">
                        <path [class]="cx('maskPath')" fill-rule="evenodd" fill="rgba(0, 0, 0, 0.5)" [attr.d]="maskPath()" (click)="onMaskClick()" />
                    </svg>
                }
                @if (spotlightRect(); as rect) {
                    <div
                        [class]="cx('spotlight')"
                        [style.top.px]="rect.top"
                        [style.left.px]="rect.left"
                        [style.width.px]="rect.width"
                        [style.height.px]="rect.height"
                        [style.border-radius.px]="rect.radius"
                        aria-hidden="true"
                        [pBind]="ptm('spotlight')"
                    ></div>
                    @if (interactionDisabled()) {
                        <div [class]="cx('blocker')" [style.top.px]="rect.top" [style.left.px]="rect.left" [style.width.px]="rect.width" [style.height.px]="rect.height" aria-hidden="true" [pBind]="ptm('blocker')"></div>
                    }
                }
                @if (currentStep(); as step) {
                    <div
                        #card
                        [class]="cx('card')"
                        role="dialog"
                        tabindex="-1"
                        [attr.aria-modal]="mask()"
                        [attr.aria-labelledby]="hasTitle() ? titleId : undefined"
                        [attr.aria-label]="hasTitle() ? undefined : stepLabel()"
                        [attr.aria-describedby]="hasContent() ? contentId : undefined"
                        [attr.data-p-placement]="placement$()"
                        [style.top.px]="cardPosition().top"
                        [style.left.px]="cardPosition().left"
                        [style.opacity]="positioned() ? null : 0"
                        (keydown)="onCardKeydown($event)"
                        [pBind]="ptm('card')"
                    >
                        @if (placement$() !== 'center') {
                            <div [class]="cx('arrow')" [style.left.px]="arrowPosition().left" [style.top.px]="arrowPosition().top" aria-hidden="true" [pBind]="ptm('arrow')"></div>
                        }
                        @if (stepTemplate()) {
                            <ng-container *ngTemplateOutlet="stepTemplate()!; context: context()" />
                        } @else {
                            @if (hasTitle() || closable()) {
                                <div [class]="cx('header')" [pBind]="ptm('header')">
                                    @if (hasTitle()) {
                                        <div [class]="cx('title')" [attr.id]="titleId" [pBind]="ptm('title')">
                                            @if (headerTemplate()) {
                                                <ng-container *ngTemplateOutlet="headerTemplate()!; context: context()" />
                                            } @else {
                                                {{ step.title }}
                                            }
                                        </div>
                                    }
                                    @if (closable()) {
                                        <p-button [class]="cx('pcCloseButton')" severity="secondary" [text]="true" [rounded]="true" [ariaLabel]="labelOf('close')" (onClick)="close('close')" [pt]="ptm('pcCloseButton')" [unstyled]="unstyled()">
                                            <ng-template #icon>
                                                <svg data-p-icon="times" />
                                            </ng-template>
                                        </p-button>
                                    }
                                </div>
                            }
                            @if (hasContent()) {
                                <div [class]="cx('content')" [attr.id]="contentId" [pBind]="ptm('content')">
                                    @if (contentTemplate()) {
                                        <ng-container *ngTemplateOutlet="contentTemplate()!; context: context()" />
                                    } @else {
                                        {{ step.content }}
                                    }
                                </div>
                            }
                            <div [class]="cx('footer')" [pBind]="ptm('footer')">
                                @if (footerTemplate()) {
                                    <ng-container *ngTemplateOutlet="footerTemplate()!; context: context()" />
                                } @else {
                                    @if (showCounter() || showDots()) {
                                        <div [class]="cx('progress')" [pBind]="ptm('progress')">
                                            @if (showCounter()) {
                                                <span [class]="cx('counter')" [pBind]="ptm('counter')">
                                                    <span aria-hidden="true">{{ counterText() }}</span>
                                                    <span class="p-hidden-accessible">{{ stepLabel() }}</span>
                                                </span>
                                            }
                                            @if (showDots() && steps().length > 1) {
                                                <span [class]="cx('dots')" aria-hidden="true" [pBind]="ptm('dots')">
                                                    @for (item of steps(); track $index) {
                                                        <span [class]="cx('dot', { active: $index === currentIndex() })" [pBind]="ptm('dot')"></span>
                                                    }
                                                </span>
                                            }
                                        </div>
                                    }
                                    <div [class]="cx('actions')" [pBind]="ptm('actions')">
                                        @if (!isFirst()) {
                                            <p-button [class]="cx('pcPrevButton')" severity="secondary" [text]="true" size="small" [label]="labelOf('prev')" (onClick)="prev()" [pt]="ptm('pcPrevButton')" [unstyled]="unstyled()" />
                                        }
                                        <p-button [class]="cx('pcNextButton')" size="small" [label]="isLast() ? labelOf('done') : labelOf('next')" (onClick)="next()" [pt]="ptm('pcNextButton')" [unstyled]="unstyled()" />
                                    </div>
                                }
                            </div>
                        }
                    </div>
                }
                <span class="p-hidden-accessible" aria-live="polite" aria-atomic="true">{{ announcement() }}</span>
            </div>
        }
    `,
    providers: [TourStyle, { provide: PARENT_INSTANCE, useExisting: Tour }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [Bind]
})
export class Tour extends BaseComponent<TourPassThrough> {
    componentName = 'Tour';

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TourStyle);

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptm('host'));

        effect(() => {
            const visible = this.visible();
            const index = this.activeIndex();
            const steps = this.steps();
            untracked(() => this.sync(visible, index, steps));
        });

        effect(() => {
            const container = this.containerViewChild()?.nativeElement;
            untracked(() => this.attachContainer(container));
        });

        effect(() => {
            const card = this.cardViewChild()?.nativeElement;
            untracked(() => this.observeCard(card));
        });
    }

    /******************** Inputs ********************/

    /**
     * Steps of the tour. A step without target is displayed in the middle of the screen.
     * @group Props
     */
    readonly steps = input<TourStep[]>([]);
    /**
     * Whether the tour is running.
     * @defaultValue false
     * @group Props
     */
    readonly visible = model<boolean>(false);
    /**
     * Index of the current step.
     * @defaultValue 0
     * @group Props
     */
    readonly activeIndex = model<number>(0);
    /**
     * Whether a mask darkens the page around the target. The card is then a modal dialog that keeps the focus.
     * @defaultValue true
     * @group Props
     */
    readonly mask = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether a click on the mask closes the tour.
     * @defaultValue false
     * @group Props
     */
    readonly dismissableMask = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the Escape key closes the tour.
     * @defaultValue true
     * @group Props
     */
    readonly closeOnEscape = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether the card has a close button.
     * @defaultValue true
     * @group Props
     */
    readonly closable = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether the left and right arrow keys go to the previous and next steps while the card has the focus.
     * @defaultValue true
     * @group Props
     */
    readonly keyboardNavigation = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Default side of the target the card is displayed on.
     * @defaultValue 'bottom'
     * @group Props
     */
    readonly placement = input<TourPlacement>('bottom');
    /**
     * Default space between the target and the edge of the spotlight, in pixels.
     * @defaultValue 8
     * @group Props
     */
    readonly spotlightPadding = input<number, unknown>(8, { transform: numberAttribute });
    /**
     * Default corner radius of the spotlight, in pixels.
     * @defaultValue 8
     * @group Props
     */
    readonly spotlightRadius = input<number, unknown>(8, { transform: numberAttribute });
    /**
     * Space between the spotlight and the card, in pixels.
     * @defaultValue 12
     * @group Props
     */
    readonly offset = input<number, unknown>(12, { transform: numberAttribute });
    /**
     * Whether the target of a step is scrolled into view when the step starts.
     * @defaultValue true
     * @group Props
     */
    readonly scrollIntoView = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether clicks on the highlighted target are blocked.
     * @defaultValue false
     * @group Props
     */
    readonly disableInteraction = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * What to do with a step whose target is not found: show it in the middle of the screen, or skip it. A warning is logged in both cases.
     * @defaultValue 'center'
     * @group Props
     */
    readonly missingTarget = input<TourMissingTarget>('center');
    /**
     * Whether the step counter, such as "2 / 5", is displayed.
     * @defaultValue true
     * @group Props
     */
    readonly showCounter = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether the progress dots are displayed.
     * @defaultValue true
     * @group Props
     */
    readonly showDots = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Texts of the component. Missing keys keep their default.
     * @group Props
     */
    readonly labels = input<Partial<TourLabels> | undefined>();
    /**
     * Target element to attach the tour to, `body` by default, or `self` to keep it inside the component.
     * @defaultValue 'body'
     * @group Props
     */
    readonly appendTo = input<HTMLElement | ElementRef | 'body' | 'self' | undefined>('body');
    /**
     * Whether to automatically manage layering.
     * @defaultValue true
     * @group Props
     */
    readonly autoZIndex = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Base zIndex value to use in layering.
     * @defaultValue 0
     * @group Props
     */
    readonly baseZIndex = input<number, unknown>(0, { transform: numberAttribute });

    /******************** Outputs ********************/

    /**
     * Callback to invoke when another step is displayed.
     * @param {TourStepChangeEvent} event - Custom step change event.
     * @group Emits
     */
    readonly onStepChange = output<TourStepChangeEvent>();
    /**
     * Callback to invoke when the user completes the tour with the button of the last step.
     * @param {TourFinishEvent} event - Custom finish event.
     * @group Emits
     */
    readonly onFinish = output<TourFinishEvent>();
    /**
     * Callback to invoke when the tour is closed before its end: close button, Escape key, mask click or close() method.
     * @param {TourCloseEvent} event - Custom close event.
     * @group Emits
     */
    readonly onClose = output<TourCloseEvent>();

    /******************** Templates ********************/

    /**
     * Custom content of the whole card.
     * @param {TourStepTemplateContext} context - step context.
     * @group Templates
     */
    readonly stepTemplate = contentChild<TemplateRef<TourStepTemplateContext>>('step', { descendants: false });
    /**
     * Custom header of the card, in place of the title.
     * @param {TourStepTemplateContext} context - step context.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<TourStepTemplateContext>>('header', { descendants: false });
    /**
     * Custom content of the card, in place of the text of the step.
     * @param {TourStepTemplateContext} context - step context.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<TourStepTemplateContext>>('content', { descendants: false });
    /**
     * Custom footer of the card, in place of the counter and the buttons.
     * @param {TourStepTemplateContext} context - step context.
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<TourStepTemplateContext>>('footer', { descendants: false });

    readonly containerViewChild = viewChild<ElementRef<HTMLDivElement>>('container');

    readonly cardViewChild = viewChild<ElementRef<HTMLDivElement>>('card');

    /******************** State ********************/

    /**
     * Whether the tour is displayed. Always false on the server.
     */
    readonly active = signal(false);

    /**
     * Index of the displayed step, -1 when the tour is not displayed.
     */
    readonly currentIndex = signal(-1);

    readonly viewport = signal({ width: 0, height: 0 });

    readonly spotlightRect = signal<TourRect | null>(null);

    readonly cardPosition = signal({ top: 0, left: 0 });

    readonly arrowPosition = signal<{ top: number | null; left: number | null }>({ top: null, left: null });

    readonly placement$ = signal<TourSide>('center');

    readonly positioned = signal(false);

    readonly announcement = signal('');

    /**
     * Direction of the page around the component, copied on the tour since it is attached to the body.
     */
    readonly dir = signal<'ltr' | 'rtl'>('ltr');

    readonly uid = uuid('pn_id_');

    readonly titleId = `${this.uid}_title`;

    readonly contentId = `${this.uid}_content`;

    readonly currentStep = computed<TourStep | undefined>(() => this.steps()[this.currentIndex()]);

    readonly isFirst = computed(() => this.currentIndex() <= 0);

    readonly isLast = computed(() => this.currentIndex() >= this.steps().length - 1);

    readonly hasTitle = computed(() => !!this.currentStep()?.title || !!this.headerTemplate());

    readonly hasContent = computed(() => !!this.currentStep()?.content || !!this.contentTemplate());

    readonly interactionDisabled = computed(() => this.currentStep()?.disableInteraction ?? this.disableInteraction());

    readonly mergedLabels = computed<TourLabels>(() => {
        const aria = this.config.getTranslation(TranslationKeys.ARIA);
        return { ...TOUR_DEFAULT_LABELS, ...(aria?.close ? { close: aria.close } : {}), ...(this.labels() ?? {}) };
    });

    readonly counterText = computed(() => format(this.labelOf('counter'), this.currentIndex() + 1, this.steps().length));

    readonly stepLabel = computed(() => format(this.labelOf('stepLabel'), this.currentIndex() + 1, this.steps().length));

    readonly maskPath = computed(() => {
        const { width, height } = this.viewport();
        let d = `M0 0H${width}V${height}H0Z`;
        const rect = this.spotlightRect();
        if (rect) {
            const { top: y, left: x, width: w, height: h } = rect;
            const r = round(Math.max(0, Math.min(rect.radius, w / 2, h / 2)));
            d += `M${round(x + r)} ${y}H${round(x + w - r)}A${r} ${r} 0 0 1 ${round(x + w)} ${round(y + r)}V${round(y + h - r)}A${r} ${r} 0 0 1 ${round(x + w - r)} ${round(y + h)}H${round(x + r)}A${r} ${r} 0 0 1 ${x} ${round(y + h - r)}V${round(y + r)}A${r} ${r} 0 0 1 ${round(x + r)} ${y}Z`;
        }
        return d;
    });

    readonly context = computed<TourStepTemplateContext>(() => {
        const index = this.currentIndex();
        return {
            $implicit: this.currentStep()!,
            index,
            total: this.steps().length,
            first: this.isFirst(),
            last: this.isLast(),
            titleId: this.titleId,
            contentId: this.contentId,
            next: () => this.next(),
            prev: () => this.prev(),
            goTo: (i: number) => this.goTo(i),
            close: () => this.close('close')
        };
    });

    readonly dataP = computed(() =>
        this.cn({
            mask: this.mask(),
            [this.placement$()]: true
        })
    );

    private targetElement: HTMLElement | null = null;

    private lastSteps: TourStep[] | null = null;

    private previouslyFocused: HTMLElement | null = null;

    private containerElement: HTMLElement | null = null;

    private listeners: (() => void)[] = [];

    private resizeObserver: ResizeObserver | null = null;

    private observedCard: HTMLElement | null = null;

    private frame = 0;

    /******************** Public methods ********************/

    /**
     * Starts the tour.
     * @param {number} index - Index of the first step, 0 by default.
     * @group Method
     */
    start(index: number = 0) {
        this.activeIndex.set(index);
        this.visible.set(true);
        this.sync(true, index, this.steps());
    }

    /**
     * Goes to the next step, or finishes the tour on the last step.
     * @group Method
     */
    next() {
        if (!this.active()) return;
        if (this.isLast()) {
            this.finish();
        } else {
            this.show(this.currentIndex() + 1, 1);
        }
    }

    /**
     * Goes to the previous step.
     * @group Method
     */
    prev() {
        if (this.active() && !this.isFirst()) {
            this.show(this.currentIndex() - 1, -1);
        }
    }

    /**
     * Goes to a step.
     * @param {number} index - Index of the step.
     * @group Method
     */
    goTo(index: number) {
        if (this.active() && index !== this.currentIndex()) {
            this.show(index, index > this.currentIndex() ? 1 : -1);
        }
    }

    /**
     * Closes the tour before its end and emits onClose.
     * @param {TourCloseReason} reason - How the tour was closed, `api` by default.
     * @group Method
     */
    close(reason: TourCloseReason = 'api') {
        if (!this.active()) return;
        const index = this.currentIndex();
        this.onClose.emit({ index, step: this.steps()[index], reason });
        this.end();
    }

    /**
     * Ends the tour as completed and emits onFinish.
     * @group Method
     */
    finish() {
        if (!this.active()) return;
        const index = this.currentIndex();
        this.onFinish.emit({ index, step: this.steps()[index] });
        this.end();
    }

    /**
     * Recomputes the position of the spotlight and the card, after a layout change the component cannot observe.
     * @group Method
     */
    refresh() {
        if (this.active()) {
            this.reposition();
        }
    }

    /******************** Template helpers ********************/

    labelOf(key: keyof TourLabels): string {
        return this.mergedLabels()[key];
    }

    onMaskClick() {
        if (this.dismissableMask()) {
            this.close('mask');
        }
    }

    onCardKeydown(event: KeyboardEvent) {
        if (!this.keyboardNavigation() || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        const target = event.target as HTMLElement;
        if (target?.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
        const forward = (event.key === 'ArrowRight') !== this.isRtl();
        event.preventDefault();
        if (forward) {
            if (!this.isLast()) this.next();
        } else {
            this.prev();
        }
    }

    /******************** Internals ********************/

    private get isBrowser() {
        return isPlatformBrowser(this.platformId);
    }

    private get window(): Window | null {
        return this.document.defaultView;
    }

    private sync(visible: boolean, index: number, steps: TourStep[]) {
        if (!this.isBrowser) return;
        if (!visible) {
            if (this.active()) this.teardown();
            return;
        }
        if (!this.active()) {
            this.open();
        }
        if (index !== this.currentIndex() || steps !== this.lastSteps) {
            this.show(index, index >= this.currentIndex() ? 1 : -1);
        }
    }

    private open() {
        if (!this.steps().length) {
            console.warn('Tour: there are no steps to display.');
            this.visible.set(false);
            return;
        }
        const active = this.document.activeElement as HTMLElement | null;
        this.previouslyFocused = active && active !== this.document.body ? active : null;
        this.dir.set(this.isRtl() ? 'rtl' : 'ltr');
        this.active.set(true);
        this.bindListeners();
    }

    private show(requested: number, direction: 1 | -1) {
        const steps = this.steps();
        this.lastSteps = steps;
        if (!this.active()) return;
        if (!steps.length) {
            this.end();
            return;
        }

        let index = clamp(Math.trunc(requested) || 0, 0, steps.length - 1);
        let target = this.resolve(steps[index]);
        if (target === undefined) {
            const skip = this.missingTarget() === 'skip';
            console.warn(`Tour: the target of step ${index + 1} was not found${skip ? ', the step is skipped' : ', the step is centered'}.`);
            if (skip) {
                let next = index + direction;
                let found: HTMLElement | null | undefined = undefined;
                while (next >= 0 && next < steps.length) {
                    found = this.resolve(steps[next]);
                    if (found !== undefined) break;
                    console.warn(`Tour: the target of step ${next + 1} was not found, the step is skipped.`);
                    next += direction;
                }
                if (found !== undefined) {
                    index = next;
                    target = found;
                }
            }
        }

        const previousIndex = this.currentIndex();
        this.targetElement = target ?? null;
        this.currentIndex.set(index);
        if (this.activeIndex() !== index) {
            this.activeIndex.set(index);
        }

        const step = steps[index];
        this.announcement.set(step.title ? format(this.labelOf('stepMessage'), index + 1, steps.length, step.title) : this.stepLabel());

        if (previousIndex !== -1 && previousIndex !== index) {
            this.onStepChange.emit({ index, previousIndex, step });
        }

        this.observeTarget();
        this.reveal(step);

        afterNextRender(
            () => {
                this.reposition();
                this.focusCard();
            },
            { injector: this.injector }
        );
    }

    /**
     * Returns the element of a step, null for a step without target, undefined when the target is not found.
     */
    private resolve(step: TourStep | undefined): HTMLElement | null | undefined {
        const target: TourTarget | undefined = step?.target;
        if (target === undefined || target === null || target === '') return null;
        let element: HTMLElement | null | undefined = null;
        try {
            if (typeof target === 'string') {
                element = this.document.querySelector<HTMLElement>(target);
            } else if (typeof target === 'function') {
                element = target();
            } else {
                element = target;
            }
        } catch {
            element = null;
        }
        if (!element || !element.isConnected || element.getClientRects().length === 0) {
            return undefined;
        }
        return element;
    }

    private reveal(step: TourStep) {
        const target = this.targetElement;
        const win = this.window;
        if (!target || !win || !(step.scrollIntoView ?? this.scrollIntoView())) return;
        const rect = target.getBoundingClientRect();
        const width = this.document.documentElement.clientWidth || win.innerWidth;
        const height = this.document.documentElement.clientHeight || win.innerHeight;
        const inView = rect.top >= 0 && rect.left >= 0 && rect.bottom <= height && rect.right <= width;
        if (!inView && typeof target.scrollIntoView === 'function') {
            target.scrollIntoView({ block: 'center', inline: 'nearest', behavior: this.reducedMotion() ? 'auto' : 'smooth' });
        }
    }

    private reducedMotion(): boolean {
        return !!this.window?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    }

    private isRtl(): boolean {
        const element = this.el.nativeElement as HTMLElement;
        const win = this.window;
        return !!win && (win.getComputedStyle(element).direction === 'rtl' || this.document.documentElement.dir === 'rtl');
    }

    /**
     * Moves the focus to the card, unless it is already inside, on the next button for example: the live region then announces the new step.
     */
    private focusCard() {
        const card = this.cardViewChild()?.nativeElement;
        if (card && !card.contains(this.document.activeElement)) {
            card.focus({ preventScroll: true });
        }
    }

    private scheduleReposition = () => {
        const win = this.window;
        if (!win || this.frame) return;
        this.frame = win.requestAnimationFrame(() => {
            this.frame = 0;
            if (this.active()) this.reposition();
        });
    };

    /**
     * Places the spotlight around the target and the card next to it, in viewport coordinates.
     */
    reposition() {
        const win = this.window;
        const step = this.currentStep();
        if (!win || !step) return;

        const width = this.document.documentElement.clientWidth || win.innerWidth;
        const height = this.document.documentElement.clientHeight || win.innerHeight;
        this.viewport.set({ width, height });

        const target = this.targetElement && this.targetElement.isConnected ? this.targetElement : null;
        let spot: TourRect | null = null;
        if (target) {
            const rect = target.getBoundingClientRect();
            const padding = step.spotlightPadding ?? this.spotlightPadding();
            spot = {
                top: round(rect.top - padding),
                left: round(rect.left - padding),
                width: round(rect.width + padding * 2),
                height: round(rect.height + padding * 2),
                radius: step.spotlightRadius ?? this.spotlightRadius()
            };
        }
        this.spotlightRect.set(spot);

        const card = this.cardViewChild()?.nativeElement;
        const cardWidth = card?.offsetWidth ?? 0;
        const cardHeight = card?.offsetHeight ?? 0;
        let preferred: TourPlacement = step.placement ?? this.placement();

        if (!spot || preferred === 'center') {
            this.placement$.set('center');
            this.cardPosition.set({ top: round(Math.max(VIEWPORT_MARGIN, (height - cardHeight) / 2)), left: round(Math.max(VIEWPORT_MARGIN, (width - cardWidth) / 2)) });
            this.arrowPosition.set({ top: null, left: null });
            this.positioned.set(!!card);
            return;
        }

        if (this.isRtl() && (preferred === 'left' || preferred === 'right')) {
            preferred = OPPOSITE[preferred] as TourPlacement;
        }

        const gap = this.offset();
        const space: Record<string, number> = {
            top: spot.top,
            bottom: height - (spot.top + spot.height),
            left: spot.left,
            right: width - (spot.left + spot.width)
        };
        const need: Record<string, number> = {
            top: cardHeight + gap + VIEWPORT_MARGIN,
            bottom: cardHeight + gap + VIEWPORT_MARGIN,
            left: cardWidth + gap + VIEWPORT_MARGIN,
            right: cardWidth + gap + VIEWPORT_MARGIN
        };
        const sides: TourSide[] = ['bottom', 'top', 'right', 'left'];
        const fits = (side: TourSide) => space[side] >= need[side];
        let side: TourSide;
        if (preferred === 'auto') {
            side = [...sides].sort((a, b) => space[b] - need[b] - (space[a] - need[a]))[0];
        } else {
            const order: TourSide[] = [preferred, OPPOSITE[preferred], ...sides.filter((s) => s !== preferred && s !== OPPOSITE[preferred])];
            side = order.find(fits) ?? [...order].sort((a, b) => space[b] - need[b] - (space[a] - need[a]))[0];
        }

        const centerX = spot.left + spot.width / 2;
        const centerY = spot.top + spot.height / 2;
        let top: number;
        let left: number;
        switch (side) {
            case 'top':
                top = spot.top - gap - cardHeight;
                left = centerX - cardWidth / 2;
                break;
            case 'left':
                top = centerY - cardHeight / 2;
                left = spot.left - gap - cardWidth;
                break;
            case 'right':
                top = centerY - cardHeight / 2;
                left = spot.left + spot.width + gap;
                break;
            default:
                top = spot.top + spot.height + gap;
                left = centerX - cardWidth / 2;
        }
        top = clamp(top, VIEWPORT_MARGIN, height - cardHeight - VIEWPORT_MARGIN);
        left = clamp(left, VIEWPORT_MARGIN, width - cardWidth - VIEWPORT_MARGIN);

        this.placement$.set(side);
        this.cardPosition.set({ top: round(top), left: round(left) });
        this.arrowPosition.set(
            side === 'top' || side === 'bottom' ? { left: round(clamp(centerX - left, ARROW_MARGIN, cardWidth - ARROW_MARGIN)), top: null } : { top: round(clamp(centerY - top, ARROW_MARGIN, cardHeight - ARROW_MARGIN)), left: null }
        );
        this.positioned.set(!!card);
    }

    private attachContainer(container: HTMLDivElement | undefined) {
        if (!container || container === this.containerElement) return;
        this.containerElement = container;
        container.setAttribute(this.$attrSelector, '');
        const appendTo = this.appendTo();
        if (appendTo && appendTo !== 'self') {
            const parent = appendTo === 'body' ? this.document.body : appendTo instanceof ElementRef ? appendTo.nativeElement : appendTo;
            parent?.appendChild(container);
        }
        if (this.autoZIndex()) {
            ZIndexUtils.set('modal', container, this.baseZIndex() || this.config.zIndex.modal);
        }
    }

    private observeCard(card: HTMLDivElement | undefined) {
        if (this.observedCard && this.resizeObserver) {
            this.resizeObserver.unobserve(this.observedCard);
        }
        this.observedCard = card ?? null;
        if (card && this.resizeObserver) {
            this.resizeObserver.observe(card);
        }
    }

    private observeTarget() {
        if (!this.resizeObserver) return;
        this.resizeObserver.disconnect();
        this.resizeObserver.observe(this.document.documentElement);
        if (this.observedCard) this.resizeObserver.observe(this.observedCard);
        if (this.targetElement) this.resizeObserver.observe(this.targetElement);
    }

    private bindListeners() {
        const win = this.window;
        if (!win) return;
        const doc = this.document;
        const keydown = (event: KeyboardEvent) => this.onDocumentKeydown(event);
        doc.addEventListener('keydown', keydown, true);
        doc.addEventListener('scroll', this.scheduleReposition, { capture: true, passive: true });
        win.addEventListener('resize', this.scheduleReposition, { passive: true });
        this.listeners.push(
            () => doc.removeEventListener('keydown', keydown, true),
            () => doc.removeEventListener('scroll', this.scheduleReposition, { capture: true }),
            () => win.removeEventListener('resize', this.scheduleReposition)
        );
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(this.scheduleReposition);
        }
    }

    private onDocumentKeydown(event: KeyboardEvent) {
        if (!this.active()) return;
        if (event.key === 'Escape' && this.closeOnEscape()) {
            const container = this.containerElement;
            if (this.autoZIndex() && container && ZIndexUtils.get(container) !== ZIndexUtils.getCurrent()) return;
            event.preventDefault();
            event.stopPropagation();
            this.close('escape');
            return;
        }
        if (event.key === 'Tab' && this.mask()) {
            this.trapFocus(event);
        }
    }

    private trapFocus(event: KeyboardEvent) {
        const card = this.cardViewChild()?.nativeElement;
        if (!card) return;
        const focusables = getFocusableElements(card) as HTMLElement[];
        const current = this.document.activeElement as HTMLElement | null;
        const inside = !!current && card.contains(current);
        if (!focusables.length) {
            event.preventDefault();
            card.focus({ preventScroll: true });
            return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!inside) {
            event.preventDefault();
            (event.shiftKey ? last : first).focus();
        } else if (event.shiftKey && (current === first || current === card)) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && current === last) {
            event.preventDefault();
            first.focus();
        }
    }

    private end() {
        this.visible.set(false);
        this.teardown();
    }

    private teardown() {
        const card = this.cardViewChild()?.nativeElement;
        const focusInside = !!card && card.contains(this.document.activeElement);
        this.listeners.forEach((remove) => remove());
        this.listeners = [];
        this.resizeObserver?.disconnect();
        this.resizeObserver = null;
        this.observedCard = null;
        if (this.frame) {
            this.window?.cancelAnimationFrame(this.frame);
            this.frame = 0;
        }
        if (this.containerElement) {
            ZIndexUtils.clear(this.containerElement);
            this.containerElement = null;
        }
        this.active.set(false);
        this.currentIndex.set(-1);
        this.lastSteps = null;
        this.targetElement = null;
        this.positioned.set(false);
        this.spotlightRect.set(null);
        this.announcement.set('');

        const previous = this.previouslyFocused;
        this.previouslyFocused = null;
        const activeElement = this.document.activeElement;
        if (previous && previous.isConnected && (focusInside || !activeElement || activeElement === this.document.body)) {
            previous.focus({ preventScroll: true });
        }
    }

    onDestroy() {
        if (this.active()) {
            const container = this.containerElement;
            this.teardown();
            container?.remove();
        }
    }
}

@NgModule({
    imports: [Tour, SharedModule],
    exports: [Tour, SharedModule]
})
export class TourModule {}
