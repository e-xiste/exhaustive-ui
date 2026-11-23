import { TemplateRef } from '@angular/core';
import type { PassThrough, PassThroughOption } from '@exhaustive-ui/core/api';
import type { ButtonPassThrough } from '@exhaustive-ui/core/types/button';

/**
 * Custom passthrough(pt) options.
 * @template I Type of instance.
 *
 * @see {@link Tour.pt}
 * @group Interface
 */
export interface TourPassThroughOptions<I = unknown> {
    /**
     * Used to pass attributes to the host's DOM element.
     */
    host?: PassThroughOption<HTMLElement, I>;
    /**
     * Used to pass attributes to the root's DOM element, the fixed layer that holds the mask and the card.
     */
    root?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the mask's SVG element.
     */
    mask?: PassThroughOption<SVGElement, I>;
    /**
     * Used to pass attributes to the spotlight's DOM element, the ring around the target.
     */
    spotlight?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the element that covers the target when interaction is disabled.
     */
    blocker?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the card's DOM element, the dialog.
     */
    card?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the arrow's DOM element.
     */
    arrow?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the header's DOM element.
     */
    header?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the title's DOM element.
     */
    title?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the close Button component.
     */
    pcCloseButton?: ButtonPassThrough;
    /**
     * Used to pass attributes to the content's DOM element.
     */
    content?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the footer's DOM element.
     */
    footer?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the progress's DOM element, which holds the counter and the dots.
     */
    progress?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the step counter's DOM element.
     */
    counter?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the dots container's DOM element.
     */
    dots?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to a dot's DOM element.
     */
    dot?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the actions container's DOM element.
     */
    actions?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the back Button component.
     */
    pcPrevButton?: ButtonPassThrough;
    /**
     * Used to pass attributes to the next and done Button component.
     */
    pcNextButton?: ButtonPassThrough;
}

/**
 * Defines valid pass-through options in Tour component.
 * @see {@link TourPassThroughOptions}
 *
 * @template I Type of instance.
 */
export type TourPassThrough<I = unknown> = PassThrough<I, TourPassThroughOptions<I>>;

/**
 * Side of the target the card is displayed on.
 * - `top`, `bottom`, `left`, `right`: that side, or the opposite side when it does not fit, or else the side with the most room. In right-to-left documents, `left` and `right` are swapped.
 * - `auto`: the side with the most room.
 * - `center`: the middle of the screen, as for a step without target.
 * @group Types
 */
export type TourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto';

/**
 * Element a step highlights: a CSS selector, an element, or a function that returns the element when the step starts.
 * @group Types
 */
export type TourTarget = string | HTMLElement | (() => HTMLElement | null | undefined);

/**
 * What to do with a step whose target is not found.
 * - `center`: show the step in the middle of the screen.
 * - `skip`: move on to the following step, in the direction of the navigation.
 * @group Types
 */
export type TourMissingTarget = 'center' | 'skip';

/**
 * How a tour was closed before its end.
 * - `close`: the close button.
 * - `escape`: the Escape key.
 * - `mask`: a click on the mask, with `dismissableMask`.
 * - `api`: the `close()` method.
 * @group Types
 */
export type TourCloseReason = 'close' | 'escape' | 'mask' | 'api';

/**
 * A step of the tour.
 * @group Interface
 */
export interface TourStep {
    /**
     * Element to highlight. Without target, the step is displayed in the middle of the screen.
     */
    target?: TourTarget;
    /**
     * Title of the card. It labels the dialog.
     */
    title?: string;
    /**
     * Text of the card. It describes the dialog.
     */
    content?: string;
    /**
     * Side of the target the card is displayed on. Defaults to the `placement` of the tour.
     */
    placement?: TourPlacement;
    /**
     * Space between the target and the edge of the spotlight, in pixels. Defaults to the `spotlightPadding` of the tour.
     */
    spotlightPadding?: number;
    /**
     * Corner radius of the spotlight, in pixels. Defaults to the `spotlightRadius` of the tour.
     */
    spotlightRadius?: number;
    /**
     * Whether the target is scrolled into view when the step starts. Defaults to the `scrollIntoView` of the tour.
     */
    scrollIntoView?: boolean;
    /**
     * Whether clicks on the highlighted target are blocked. Defaults to the `disableInteraction` of the tour.
     */
    disableInteraction?: boolean;
    /**
     * Any data, available in the templates.
     */
    data?: any;
}

/**
 * Texts of the component. Placeholders such as `{0}` are replaced with values.
 * @group Interface
 */
export interface TourLabels {
    /** Next button. */
    next: string;
    /** Back button. */
    prev: string;
    /** Button of the last step. */
    done: string;
    /** Label of the close button. Defaults to the `aria.close` text of the locale. */
    close: string;
    /** Visible step counter: `{0}` is the step number, `{1}` the number of steps. */
    counter: string;
    /** Step counter for screen readers, also the label of the dialog when the step has no title: `{0}` is the step number, `{1}` the number of steps. */
    stepLabel: string;
    /** Announcement of a new step: `{0}` is the step number, `{1}` the number of steps, `{2}` the title. */
    stepMessage: string;
}

/**
 * Custom step change event.
 * @see {@link Tour.onStepChange}
 * @group Events
 */
export interface TourStepChangeEvent {
    /**
     * Index of the new step.
     */
    index: number;
    /**
     * Index of the previous step.
     */
    previousIndex: number;
    /**
     * The new step.
     */
    step: TourStep;
}

/**
 * Custom finish event.
 * @see {@link Tour.onFinish}
 * @group Events
 */
export interface TourFinishEvent {
    /**
     * Index of the last step.
     */
    index: number;
    /**
     * The last step.
     */
    step: TourStep;
}

/**
 * Custom close event.
 * @see {@link Tour.onClose}
 * @group Events
 */
export interface TourCloseEvent {
    /**
     * Index of the step the tour was closed on.
     */
    index: number;
    /**
     * The step the tour was closed on.
     */
    step: TourStep;
    /**
     * How the tour was closed.
     */
    reason: TourCloseReason;
}

/**
 * Context of the step, header, content and footer templates.
 * @group Interface
 */
export interface TourStepTemplateContext {
    /**
     * The step.
     */
    $implicit: TourStep;
    /**
     * Index of the step.
     */
    index: number;
    /**
     * Number of steps.
     */
    total: number;
    /**
     * Whether it is the first step.
     */
    first: boolean;
    /**
     * Whether it is the last step.
     */
    last: boolean;
    /**
     * Id to give to the title element of a step template, so that it labels the dialog.
     */
    titleId: string;
    /**
     * Id to give to the text element of a step template, so that it describes the dialog.
     */
    contentId: string;
    /**
     * Goes to the next step, or finishes the tour on the last step.
     */
    next: () => void;
    /**
     * Goes to the previous step.
     */
    prev: () => void;
    /**
     * Goes to a step.
     */
    goTo: (index: number) => void;
    /**
     * Closes the tour.
     */
    close: () => void;
}

/**
 * Defines valid templates in Tour.
 * @group Templates
 */
export interface TourTemplates {
    /**
     * Custom content of the whole card.
     * @param {TourStepTemplateContext} context - step context.
     */
    step(context: TourStepTemplateContext): TemplateRef<TourStepTemplateContext>;
    /**
     * Custom header of the card.
     * @param {TourStepTemplateContext} context - step context.
     */
    header(context: TourStepTemplateContext): TemplateRef<TourStepTemplateContext>;
    /**
     * Custom content of the card, between the header and the footer.
     * @param {TourStepTemplateContext} context - step context.
     */
    content(context: TourStepTemplateContext): TemplateRef<TourStepTemplateContext>;
    /**
     * Custom footer of the card.
     * @param {TourStepTemplateContext} context - step context.
     */
    footer(context: TourStepTemplateContext): TemplateRef<TourStepTemplateContext>;
}
