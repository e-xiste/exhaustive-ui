import type { PassThrough, PassThroughOption } from '@exhaustive-ui/core/api';
import type { ButtonPassThrough } from '@exhaustive-ui/core/types/button';
import { TemplateRef } from '@angular/core';
import type { MotionOptions } from '@exhaustive-ui/motion';

/**
 * Custom pass-through(pt) options.
 * @template I Type of instance.
 *
 * @see {@link Dialog.pt}
 * @group Interface
 */
export interface DialogPassThroughOptions<I = unknown> {
    /**
     * Used to pass attributes to the host's DOM element.
     */
    host?: PassThroughOption<HTMLElement, I>;
    /**
     * Used to pass attributes to the root's DOM element.
     */
    root?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the mask's DOM element.
     */
    mask?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the resize handle's DOM element.
     */
    resizeHandle?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the header's DOM element.
     */
    header?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the title's DOM element.
     */
    title?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the header actions' DOM element.
     */
    headerActions?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the maximize Button component.
     * @see {@link ButtonPassThrough}
     */
    pcMaximizeButton?: ButtonPassThrough;
    /**
     * Used to pass attributes to the close Button component.
     * @see {@link ButtonPassThrough}
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
     * Used to pass options to the motion component/directive.
     */
    motion?: MotionOptions;
}

/**
 * Defines valid pass-through options in Dialog.
 * @see {@link DialogPassThroughOptions}
 *
 * @template I Type of instance.
 */
export type DialogPassThrough<I = unknown> = PassThrough<I, DialogPassThroughOptions<I>>;

/**
 * Context of the header template.
 * @group Interface
 */
export interface DialogHeaderTemplateContext {
    /**
     * Id of the element that labels the dialog: put it on your title so that screen readers announce it.
     */
    ariaLabelledBy: string | null | undefined;
}

/**
 * Defines valid templates in Dialog.
 * @group Templates
 */
export interface DialogTemplates {
    /**
     * Custom template of header.
     */
    header(context: DialogHeaderTemplateContext): TemplateRef<DialogHeaderTemplateContext>;
    /**
     * Custom template of content.
     */
    content(): TemplateRef<void>;
    /**
     * Custom template of footer.
     */
    footer(): TemplateRef<void>;
    /**
     * Custom template of closeicon.
     */
    closeicon(): TemplateRef<void>;
    /**
     * Custom template of maximizeicon.
     */
    maximizeicon(): TemplateRef<void>;
    /**
     * Custom template of minimizeicon.
     */
    minimizeicon(): TemplateRef<void>;
    /**
     * Custom headless template to replace the entire dialog content.
     */
    headless(): TemplateRef<void>;
}
