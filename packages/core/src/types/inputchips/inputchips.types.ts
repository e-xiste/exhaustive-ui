import { TemplateRef } from '@angular/core';
import { PassThrough, PassThroughOption } from '@exhaustive-ui/core/api';
import type { ChipPassThrough } from '@exhaustive-ui/core/types/chip';

/**
 * Custom passthrough(pt) options.
 * @template I Type of instance.
 *
 * @see {@link InputChips.pt}
 * @group Interface
 */
export interface InputChipsPassThroughOptions<I = unknown> {
    /**
     * Used to pass attributes to the host's DOM element.
     */
    host?: PassThroughOption<HTMLElement, I>;
    /**
     * Used to pass attributes to the root's DOM element.
     */
    root?: PassThroughOption<HTMLElement, I>;
    /**
     * Used to pass attributes to the field box that holds the chips and the text input.
     */
    container?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the list of chips.
     */
    list?: PassThroughOption<HTMLUListElement, I>;
    /**
     * Used to pass attributes to the list item of a chip.
     */
    chipItem?: PassThroughOption<HTMLLIElement, I>;
    /**
     * Used to pass attributes to the Chip component.
     * @see {@link ChipPassThrough}
     */
    pcChip?: ChipPassThrough;
    /**
     * Used to pass attributes to the label of a chip.
     */
    chipLabel?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the remove icon of a chip.
     */
    chipIcon?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the text input's DOM element.
     */
    input?: PassThroughOption<HTMLInputElement, I>;
}

/**
 * Defines valid pass-through options in InputChips component.
 * @see {@link InputChipsPassThroughOptions}
 *
 * @template I Type of instance.
 */
export type InputChipsPassThrough<I = unknown> = PassThrough<I, InputChipsPassThroughOptions<I>>;

/**
 * Why a value was not added.
 * - `empty`: the value is empty once trimmed and transformed.
 * - `duplicate`: the value is already a chip and allowDuplicate is false.
 * - `max`: the maximum number of chips is reached.
 * - `maxChipLength`: the value is longer than maxChipLength.
 * - `invalid`: the validate function rejected the value.
 * @group Types
 */
export type InputChipsRejectReason = 'empty' | 'duplicate' | 'max' | 'maxChipLength' | 'invalid';

/**
 * Turns a typed or pasted value into the text of a chip, for example to lowercase it. The value is already trimmed. Return an empty string, null or undefined to drop it.
 * @group Types
 */
export type InputChipsTransform = (value: string) => string | null | undefined;

/**
 * Tells whether a value can be added as a chip. Receives the transformed value and the current chips.
 * @group Types
 */
export type InputChipsValidate = (value: string, values: readonly string[]) => boolean;

/**
 * Texts of InputChips, mostly read by screen readers. In the messages, `{0}` is replaced by the value or the number given in the description.
 * @group Interface
 */
export interface InputChipsLabels {
    /** Accessible name of the list of chips when neither ariaLabel nor ariaLabelledBy is set. */
    listLabel: string;
    /** Instructions read when a chip gets the focus. */
    removeHint: string;
    /** Announced when a chip is added; {0} is the chip. */
    addedMessage: string;
    /** Announced when several chips are added at once; {0} is their number. */
    addedManyMessage: string;
    /** Announced when a chip is removed; {0} is the chip. */
    removedMessage: string;
    /** Announced when a value is already a chip; {0} is the value. */
    duplicateMessage: string;
    /** Announced when the maximum number of chips is reached; {0} is the maximum. */
    maxMessage: string;
    /** Announced when a value is too long; {0} is the maximum length. */
    maxChipLengthMessage: string;
    /** Announced when the validate function rejects a value; {0} is the value. */
    invalidMessage: string;
}

/**
 * Custom add event.
 * @see {@link InputChips.onAdd}
 * @group Events
 */
export interface InputChipsAddEvent {
    /**
     * Browser event, if any.
     */
    originalEvent?: Event;
    /**
     * The added chip.
     */
    value: string;
    /**
     * Index of the added chip.
     */
    index: number;
}

/**
 * Custom remove event.
 * @see {@link InputChips.onRemove}
 * @group Events
 */
export interface InputChipsRemoveEvent {
    /**
     * Browser event, if any.
     */
    originalEvent?: Event;
    /**
     * The removed chip.
     */
    value: string;
    /**
     * Index the chip had.
     */
    index: number;
}

/**
 * Custom chip click event.
 * @see {@link InputChips.onChipClick}
 * @group Events
 */
export interface InputChipsChipClickEvent {
    /**
     * Browser event.
     */
    originalEvent: Event;
    /**
     * The clicked chip.
     */
    value: string;
    /**
     * Index of the chip.
     */
    index: number;
}

/**
 * Custom reject event.
 * @see {@link InputChips.onReject}
 * @group Events
 */
export interface InputChipsRejectEvent {
    /**
     * Browser event, if any.
     */
    originalEvent?: Event;
    /**
     * The value that was not added, trimmed and transformed.
     */
    value: string;
    /**
     * Why it was not added.
     */
    reason: InputChipsRejectReason;
}

/**
 * Context of the chip template.
 * @group Interface
 */
export interface InputChipsChipTemplateContext {
    /**
     * Text of the chip.
     */
    $implicit: string;
    /**
     * Index of the chip.
     */
    index: number;
    /**
     * Whether the chip has the keyboard focus.
     */
    focused: boolean;
    /**
     * Whether the chip can be removed: false when the component is disabled or readonly.
     */
    removable: boolean;
    /**
     * Removes the chip. Pass the click event so that it does not also emit onChipClick and the focus goes back to the input, as with the default remove icon.
     */
    remove: (event?: Event) => void;
}

/**
 * Context of the remove icon template.
 * @group Interface
 */
export interface InputChipsRemoveIconTemplateContext {
    /**
     * Text of the chip.
     */
    $implicit: string;
    /**
     * Index of the chip.
     */
    index: number;
    /**
     * Style class of the icon.
     */
    class: string;
}

/**
 * Defines valid templates in InputChips.
 * @group Templates
 */
export interface InputChipsTemplates {
    /**
     * Custom content of a chip.
     * @param {InputChipsChipTemplateContext} context - chip context.
     */
    chip(context: InputChipsChipTemplateContext): TemplateRef<InputChipsChipTemplateContext>;
    /**
     * Custom remove icon of a chip.
     * @param {InputChipsRemoveIconTemplateContext} context - remove icon context.
     */
    removeicon(context: InputChipsRemoveIconTemplateContext): TemplateRef<InputChipsRemoveIconTemplateContext>;
}
