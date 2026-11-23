import { TemplateRef } from '@angular/core';
import type { PassThrough, PassThroughOption } from '@exhaustive-ui/core/api';
import type { InputTextPassThrough } from '@exhaustive-ui/core/types/inputtext';
import type { OverlayPassThrough } from '@exhaustive-ui/core/types/overlay';
import type { VirtualScrollerPassThrough } from '@exhaustive-ui/core/types/scroller';
import type { TextareaPassThrough } from '@exhaustive-ui/core/types/textarea';

/**
 * Custom pass-through(pt) options.
 * @template I Type of instance.
 *
 * @see {@link Mention.pt}
 * @group Interface
 */
export interface MentionPassThroughOptions<I = unknown> {
    /**
     * Used to pass attributes to the host's DOM element.
     */
    host?: PassThroughOption<HTMLElement, I>;
    /**
     * Used to pass attributes to the root's DOM element.
     */
    root?: PassThroughOption<HTMLElement, I>;
    /**
     * Used to pass attributes to the Textarea of the multiline mode.
     * @see {@link TextareaPassThrough}
     */
    pcTextarea?: TextareaPassThrough;
    /**
     * Used to pass attributes to the InputText of the single-line mode.
     * @see {@link InputTextPassThrough}
     */
    pcInputText?: InputTextPassThrough;
    /**
     * Used to pass attributes to the invisible element the panel is aligned with, moved under the line of the trigger.
     */
    anchor?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the Overlay component.
     * @see {@link OverlayPassThrough}
     */
    pcOverlay?: OverlayPassThrough;
    /**
     * Used to pass attributes to the overlay's DOM element.
     */
    overlay?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the list container's DOM element.
     */
    listContainer?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the Scroller component of the virtual scroll.
     * @see {@link VirtualScrollerPassThrough}
     */
    pcScroller?: VirtualScrollerPassThrough;
    /**
     * Used to pass attributes to the list's DOM element.
     */
    list?: PassThroughOption<HTMLUListElement, I>;
    /**
     * Used to pass attributes to the option's DOM element.
     */
    option?: PassThroughOption<HTMLLIElement, I>;
    /**
     * Used to pass attributes to the empty message's DOM element.
     */
    emptyMessage?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the loader's DOM element, shown while loading.
     */
    loader?: PassThroughOption<HTMLDivElement, I>;
}

/**
 * Defines valid pass-through options in Mention.
 * @see {@link MentionPassThroughOptions}
 *
 * @template I Type of instance.
 */
export type MentionPassThrough<I = unknown> = PassThrough<I, MentionPassThroughOptions<I>>;

/**
 * Where the suggestion panel opens.
 * - `caret`: under the line of the trigger, aligned with it.
 * - `field`: under the whole field, like an AutoComplete.
 * @group Types
 */
export type MentionPosition = 'caret' | 'field';

/**
 * Custom search event, emitted when the user types a trigger followed by a query.
 * @see {@link Mention.onSearch}
 * @group Events
 */
export interface MentionSearchEvent {
    /**
     * Browser event.
     */
    originalEvent: Event;
    /**
     * The trigger that was typed, `@` for instance.
     */
    trigger: string;
    /**
     * The text typed after the trigger, without it.
     */
    query: string;
}

/**
 * Custom select event, emitted when a suggestion is inserted.
 * @see {@link Mention.onSelect}
 * @group Events
 */
export interface MentionSelectEvent<T = any> {
    /**
     * Browser event.
     */
    originalEvent: Event;
    /**
     * The selected suggestion.
     */
    value: T;
    /**
     * The trigger of the mention.
     */
    trigger: string;
    /**
     * The query the suggestion replaced.
     */
    query: string;
    /**
     * The text inserted in the field, trigger included.
     */
    text: string;
}

/**
 * Context of the item template.
 * @group Interface
 */
export interface MentionItemTemplateContext<T = any> {
    /**
     * The suggestion.
     */
    $implicit: T;
    /**
     * Index of the suggestion.
     */
    index: number;
    /**
     * The trigger being completed, to render users and tags differently.
     */
    trigger: string;
    /**
     * The current query.
     */
    query: string;
    /**
     * Whether the suggestion is highlighted by the keyboard or the mouse.
     */
    focused: boolean;
}

/**
 * Context of the empty, header and footer templates.
 * @group Interface
 */
export interface MentionPanelTemplateContext {
    /**
     * The trigger being completed.
     */
    trigger: string;
    /**
     * The current query.
     */
    query: string;
}

/**
 * Defines valid templates in Mention.
 * @group Templates
 */
export interface MentionTemplates<T = any> {
    /**
     * Custom suggestion.
     * @param {MentionItemTemplateContext} context - item context.
     */
    item(context: MentionItemTemplateContext<T>): TemplateRef<MentionItemTemplateContext<T>>;
    /**
     * Custom content shown when there is no suggestion.
     * @param {MentionPanelTemplateContext} context - panel context.
     */
    empty(context: MentionPanelTemplateContext): TemplateRef<MentionPanelTemplateContext>;
    /**
     * Custom content above the suggestions.
     * @param {MentionPanelTemplateContext} context - panel context.
     */
    header(context: MentionPanelTemplateContext): TemplateRef<MentionPanelTemplateContext>;
    /**
     * Custom content below the suggestions.
     * @param {MentionPanelTemplateContext} context - panel context.
     */
    footer(context: MentionPanelTemplateContext): TemplateRef<MentionPanelTemplateContext>;
}
