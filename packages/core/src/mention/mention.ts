import { isPlatformBrowser, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    effect,
    ElementRef,
    forwardRef,
    inject,
    input,
    NgModule,
    numberAttribute,
    output,
    signal,
    TemplateRef,
    untracked,
    viewChild,
    ViewEncapsulation
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { OverlayOptions, ScrollerOptions, SharedModule, TranslationKeys } from '@exhaustive-ui/core/api';
import { PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseInput } from '@exhaustive-ui/core/baseinput';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { SpinnerIcon } from '@exhaustive-ui/core/icons';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { Overlay } from '@exhaustive-ui/core/overlay';
import { Scroller } from '@exhaustive-ui/core/scroller';
import { Textarea } from '@exhaustive-ui/core/textarea';
import type { MentionItemTemplateContext, MentionPanelTemplateContext, MentionPassThrough, MentionPosition, MentionSearchEvent, MentionSelectEvent } from '@exhaustive-ui/core/types/mention';
import { MotionOptions } from '@exhaustive-ui/motion';
import { resolveFieldData, uuid } from '@exhaustive-ui/utils';
import { MentionStyle } from './style/mentionstyle';

export const MENTION_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Mention),
    multi: true
};

/**
 * The mention being typed: a trigger at the start of a word, followed by the query up to the caret.
 */
interface MentionContext {
    trigger: string;
    query: string;
    /** Index of the trigger in the value. */
    start: number;
    /** Index of the caret in the value. */
    caret: number;
}

/** Computed styles copied to the mirror element that measures the caret position. */
const MIRRORED_PROPERTIES = [
    'direction',
    'boxSizing',
    'width',
    'overflowX',
    'overflowY',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderStyle',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',
    'fontFeatureSettings',
    'textAlign',
    'textTransform',
    'textIndent',
    'letterSpacing',
    'wordSpacing',
    'tabSize'
] as const;

/**
 * Mention suggests users, tags or commands while a trigger such as @ or # is typed in a textarea or an input, and inserts the chosen suggestion in the text. Its value is the plain text, and it works with template-driven forms, reactive forms and Signal Forms.
 * @group Components
 */
@Component({
    selector: 'p-mention',
    standalone: true,
    imports: [NgTemplateOutlet, NgStyle, Overlay, Scroller, Textarea, InputText, SpinnerIcon, SharedModule, BindModule],
    template: `
        @if (multiline()) {
            <textarea
                #field
                pTextarea
                [pTextareaPT]="ptm('pcTextarea')"
                [pTextareaUnstyled]="unstyled()"
                [class]="cn(cx('pcTextarea'), inputStyleClass())"
                [ngStyle]="inputStyle()"
                [autoResize]="autoResize()"
                [pSize]="size()"
                [variant]="$variant()"
                [fluid]="hasFluid"
                [invalid]="$invalid()"
                [value]="inputValue()"
                [disabled]="$disabled()"
                [attr.id]="inputId()"
                [attr.name]="name()"
                [attr.rows]="rows()"
                [attr.cols]="cols()"
                [attr.placeholder]="placeholder()"
                [attr.maxlength]="maxlength()"
                [attr.minlength]="minlength()"
                [attr.required]="required() ? '' : undefined"
                [attr.readonly]="readonly() ? '' : undefined"
                [attr.tabindex]="$disabled() ? -1 : tabindex()"
                [attr.aria-label]="ariaLabel()"
                [attr.aria-labelledby]="ariaLabelledBy()"
                [attr.aria-describedby]="ariaDescribedBy()"
                [attr.aria-required]="required() || undefined"
                [attr.aria-invalid]="$invalid() || undefined"
                aria-autocomplete="list"
                [attr.aria-controls]="listVisible() ? listId() : undefined"
                [attr.aria-activedescendant]="listVisible() ? focusedOptionId() : undefined"
                autocomplete="off"
                (input)="onInput($event)"
                (keydown)="onKeyDown($event)"
                (keyup)="onKeyUp($event)"
                (click)="onClick($event)"
                (focus)="onInputFocus($event)"
                (blur)="onInputBlur($event)"
            ></textarea>
        } @else {
            <input
                #field
                type="text"
                pInputText
                [pInputTextPT]="ptm('pcInputText')"
                [pInputTextUnstyled]="unstyled()"
                [class]="cn(cx('pcInputText'), inputStyleClass())"
                [ngStyle]="inputStyle()"
                [pSize]="size()"
                [variant]="$variant()"
                [fluid]="hasFluid"
                [invalid]="$invalid()"
                [value]="inputValue()"
                [disabled]="$disabled()"
                [attr.id]="inputId()"
                [attr.name]="name()"
                [attr.placeholder]="placeholder()"
                [attr.maxlength]="maxlength()"
                [attr.minlength]="minlength()"
                [attr.required]="required() ? '' : undefined"
                [attr.readonly]="readonly() ? '' : undefined"
                [attr.tabindex]="$disabled() ? -1 : tabindex()"
                [attr.aria-label]="ariaLabel()"
                [attr.aria-labelledby]="ariaLabelledBy()"
                [attr.aria-describedby]="ariaDescribedBy()"
                [attr.aria-required]="required() || undefined"
                [attr.aria-invalid]="$invalid() || undefined"
                role="combobox"
                aria-autocomplete="list"
                [attr.aria-expanded]="overlayVisible()"
                [attr.aria-controls]="listVisible() ? listId() : undefined"
                [attr.aria-activedescendant]="listVisible() ? focusedOptionId() : undefined"
                autocomplete="off"
                (input)="onInput($event)"
                (keydown)="onKeyDown($event)"
                (keyup)="onKeyUp($event)"
                (click)="onClick($event)"
                (focus)="onInputFocus($event)"
                (blur)="onInputBlur($event)"
            />
        }
        <span #anchor [class]="cx('anchor')" [style]="sx('anchor')" [pBind]="ptm('anchor')">
            <p-overlay
                #overlay
                [hostAttrSelector]="$attrSelector"
                [(visible)]="overlayVisible"
                [options]="$overlayOptions()"
                target="@parent"
                [appendTo]="$appendTo()"
                [unstyled]="unstyled()"
                [pt]="ptm('pcOverlay')"
                [motionOptions]="motionOptions()"
                (onBeforeEnter)="onOverlayBeforeEnter()"
                (onHide)="hide()"
            >
                <ng-template #content>
                    <div [pBind]="ptm('overlay')" [class]="cn(cx('overlay'), panelStyleClass())" [ngStyle]="panelStyle()" style="pointer-events: auto" (mousedown)="onOverlayMouseDown($event)">
                        @if (headerTemplate()) {
                            <ng-container *ngTemplateOutlet="headerTemplate()!; context: panelContext()" />
                        }
                        <div [pBind]="ptm('listContainer')" [class]="cx('listContainer')" [style.max-height]="virtualScroll() ? 'auto' : scrollHeight()">
                            @if (suggestionList().length) {
                                @if (virtualScroll()) {
                                    <p-scroller
                                        #scroller
                                        [tabindex]="-1"
                                        [pt]="ptm('pcScroller')"
                                        [items]="suggestionList()"
                                        [style]="{ height: scrollHeight() }"
                                        [itemSize]="virtualScrollItemSize()!"
                                        [autoSize]="true"
                                        [options]="virtualScrollOptions()"
                                    >
                                        <ng-template #content let-items let-scrollerOptions="options">
                                            <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: items, options: scrollerOptions }" />
                                        </ng-template>
                                    </p-scroller>
                                } @else {
                                    <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: suggestionList(), options: {} }" />
                                }
                            } @else if (loading()) {
                                <div [pBind]="ptm('loader')" [class]="cx('loader')">
                                    <svg data-p-icon="spinner" [class]="cx('loaderIcon')" [spin]="true" aria-hidden="true" />
                                    <span>{{ loadingMessageText() }}</span>
                                </div>
                            } @else {
                                <div [pBind]="ptm('emptyMessage')" [class]="cx('emptyMessage')">
                                    @if (emptyTemplate()) {
                                        <ng-container *ngTemplateOutlet="emptyTemplate()!; context: panelContext()" />
                                    } @else {
                                        {{ emptyMessageText() }}
                                    }
                                </div>
                            }
                        </div>

                        <ng-template #buildInItems let-items let-scrollerOptions="options">
                            <ul #items [pBind]="ptm('list')" [class]="cn(cx('list'), scrollerOptions.contentStyleClass)" [style]="scrollerOptions.contentStyle" role="listbox" [attr.id]="listId()" [attr.aria-label]="listLabel()">
                                @for (option of items; track $index; let i = $index) {
                                    @let index = getOptionIndex(i, scrollerOptions);
                                    <li
                                        [pBind]="getPTOptions(option, index)"
                                        [class]="cx('option', { index })"
                                        [style.height.px]="scrollerOptions.itemSize"
                                        [attr.id]="optionId(index)"
                                        role="option"
                                        tabindex="-1"
                                        [attr.aria-selected]="focusedOptionIndex() === index"
                                        [attr.aria-setsize]="suggestionList().length"
                                        [attr.aria-posinset]="index + 1"
                                        [attr.data-p-focused]="focusedOptionIndex() === index"
                                        (click)="onOptionClick($event, option)"
                                        (mousemove)="onOptionMouseMove($event, index)"
                                    >
                                        @if (itemTemplate()) {
                                            <ng-container *ngTemplateOutlet="itemTemplate()!; context: itemContext(option, index)" />
                                        } @else {
                                            <span [class]="cx('optionLabel')">{{ getOptionLabel(option) }}</span>
                                        }
                                    </li>
                                }
                            </ul>
                        </ng-template>

                        @if (footerTemplate()) {
                            <ng-container *ngTemplateOutlet="footerTemplate()!; context: panelContext()" />
                        }
                    </div>
                </ng-template>
            </p-overlay>
        </span>
        <span role="status" aria-live="polite" aria-atomic="true" class="p-hidden-accessible">{{ liveMessage() }}</span>
    `,
    providers: [MENTION_VALUE_ACCESSOR, MentionStyle, { provide: PARENT_INSTANCE, useExisting: Mention }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[style]': "sx('root')",
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class Mention<T = any> extends BaseInput<MentionPassThrough> {
    componentName = 'Mention';

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(MentionStyle);

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));

        // New suggestions highlight their first entry, open or close the panel and realign it.
        effect(() => {
            const list = this.suggestionList();
            untracked(() => {
                this.focusedOptionIndex.set(list.length && this.autoHighlight() ? 0 : -1);
                this.syncVisibility();
                if (this.overlayVisible()) {
                    afterNextRender(() => this.overlayViewChild()?.alignOverlay(), { injector: this.injector });
                }
            });
        });
    }

    /******************** Inputs ********************/

    /**
     * The suggestions to show for the current trigger and query, usually set in the onSearch handler. An array of strings, or of objects with optionLabel.
     * @group Props
     */
    readonly suggestions = input<T[] | null | undefined>();
    /**
     * The characters that start a mention when typed at the start of a word, such as `@` for users and `#` for tags. A trigger can have several characters, `/` for commands for instance.
     * @defaultValue ['@']
     * @group Props
     */
    readonly triggers = input<string[], string | string[]>(['@'], { transform: (value) => (Array.isArray(value) ? value : [value]) });
    /**
     * Property name or getter function of the text inserted for an object suggestion. It also labels the default option.
     * @group Props
     */
    readonly optionLabel = input<string | ((item: T) => string) | undefined>();
    /**
     * Minimum number of characters typed after the trigger before a search.
     * @defaultValue 0
     * @group Props
     */
    readonly minQueryLength = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * Delay in milliseconds between the last keystroke and the onSearch event.
     * @defaultValue 0
     * @group Props
     */
    readonly delay = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * Whether the suggestions are being loaded. While there are no suggestions yet, the panel shows a loader instead of the empty message.
     * @defaultValue false
     * @group Props
     */
    readonly loading = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the field is a textarea. When false, a single-line input is rendered.
     * @defaultValue true
     * @group Props
     */
    readonly multiline = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether the textarea grows with its content.
     * @defaultValue false
     * @group Props
     */
    readonly autoResize = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Number of visible lines of the textarea.
     * @group Props
     */
    readonly rows = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Visible width of the textarea in characters.
     * @group Props
     */
    readonly cols = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Placeholder of the field.
     * @group Props
     */
    readonly placeholder = input<string | undefined>();
    /**
     * Whether the text can be selected but not changed. No suggestion opens.
     * @defaultValue false
     * @group Props
     */
    readonly readonly = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Identifier of the textarea or input, to link a label to it.
     * @group Props
     */
    readonly inputId = input<string | undefined>();
    /**
     * Inline style of the textarea or input.
     * @group Props
     */
    readonly inputStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the textarea or input.
     * @group Props
     */
    readonly inputStyleClass = input<string | undefined>();
    /**
     * Index of the field in the tab order.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Accessible name of the field, when there is no visible label.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();
    /**
     * Identifier of the element that labels the field.
     * @group Props
     */
    readonly ariaLabelledBy = input<string | undefined>();
    /**
     * Identifier of the element that describes the field, a hint for instance.
     * @group Props
     */
    readonly ariaDescribedBy = input<string | undefined>();
    /**
     * Where the suggestion panel opens: under the line of the trigger, or under the whole field.
     * @defaultValue 'caret'
     * @group Props
     */
    readonly position = input<MentionPosition>('caret');
    /**
     * Whether a space is added after the inserted suggestion, unless the text after it already starts with a space.
     * @defaultValue true
     * @group Props
     */
    readonly appendSpace = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether the first suggestion is highlighted, so that Enter or Tab inserts it right away.
     * @defaultValue true
     * @group Props
     */
    readonly autoHighlight = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether the panel opens with the empty message when there is no suggestion. When false, it only opens with suggestions.
     * @defaultValue true
     * @group Props
     */
    readonly showEmptyMessage = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Text shown when there is no suggestion. Defaults to the emptySearchMessage of the translation.
     * @group Props
     */
    readonly emptyMessage = input<string | undefined>();
    /**
     * Text announced to screen readers when suggestions are shown, `{0}` being their number. Defaults to the searchMessage of the translation.
     * @group Props
     */
    readonly searchMessage = input<string | undefined>();
    /**
     * Text shown and announced while loading.
     * @defaultValue 'Loading...'
     * @group Props
     */
    readonly loadingMessage = input<string | undefined>();
    /**
     * Maximum height of the suggestion list.
     * @defaultValue '200px'
     * @group Props
     */
    readonly scrollHeight = input<string>('200px');
    /**
     * Whether the suggestion list is rendered with a virtual scroll, for long lists. Requires virtualScrollItemSize.
     * @defaultValue false
     * @group Props
     */
    readonly virtualScroll = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Height of a suggestion in pixels, for the virtual scroll.
     * @group Props
     */
    readonly virtualScrollItemSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Options of the virtual scroller.
     * @group Props
     */
    readonly virtualScrollOptions = input<ScrollerOptions | undefined>();
    /**
     * Inline style of the panel.
     * @group Props
     */
    readonly panelStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the panel.
     * @group Props
     */
    readonly panelStyleClass = input<string | undefined>();
    /**
     * Target element to attach the panel to, "body" or a template variable of another element. Defaults to the overlayAppendTo of the global configuration, 'self'.
     * @group Props
     */
    readonly appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);
    /**
     * Options of the overlay.
     * @group Props
     */
    readonly overlayOptions = input<OverlayOptions | undefined>();
    /**
     * The motion options of the panel.
     * @group Props
     */
    readonly motionOptions = input<MotionOptions | undefined>(undefined);

    /******************** Outputs ********************/

    /**
     * Emitted when a trigger and a query are typed. Answer it by setting suggestions, at once or after a request.
     * @param {MentionSearchEvent} event - Custom search event.
     * @group Emits
     */
    readonly onSearch = output<MentionSearchEvent>();
    /**
     * Emitted when a suggestion is inserted in the text.
     * @param {MentionSelectEvent} event - Custom select event.
     * @group Emits
     */
    readonly onSelect = output<MentionSelectEvent<T>>();
    /**
     * Emitted when the suggestion panel opens.
     * @group Emits
     */
    readonly onShow = output<void>();
    /**
     * Emitted when the suggestion panel closes.
     * @group Emits
     */
    readonly onHide = output<void>();
    /**
     * Emitted when the field receives the focus.
     * @param {FocusEvent} event - Browser event.
     * @group Emits
     */
    readonly onFocus = output<FocusEvent>();
    /**
     * Emitted when the field loses the focus.
     * @param {FocusEvent} event - Browser event.
     * @group Emits
     */
    readonly onBlur = output<FocusEvent>();

    /******************** Templates ********************/

    /**
     * Custom suggestion, with the trigger in its context to render users and tags differently.
     * @param {MentionItemTemplateContext} context - item context.
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<MentionItemTemplateContext<T>>>('item', { descendants: false });
    /**
     * Custom content shown when there is no suggestion.
     * @param {MentionPanelTemplateContext} context - panel context.
     * @group Templates
     */
    readonly emptyTemplate = contentChild<TemplateRef<MentionPanelTemplateContext>>('empty', { descendants: false });
    /**
     * Custom content above the suggestions.
     * @param {MentionPanelTemplateContext} context - panel context.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<MentionPanelTemplateContext>>('header', { descendants: false });
    /**
     * Custom content below the suggestions.
     * @param {MentionPanelTemplateContext} context - panel context.
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<MentionPanelTemplateContext>>('footer', { descendants: false });

    /******************** View ********************/

    readonly fieldViewChild = viewChild<ElementRef<HTMLTextAreaElement | HTMLInputElement>>('field');

    readonly anchorViewChild = viewChild<ElementRef<HTMLSpanElement>>('anchor');

    readonly overlayViewChild = viewChild<Overlay>('overlay');

    readonly itemsViewChild = viewChild<ElementRef<HTMLUListElement>>('items');

    readonly scroller = viewChild<Scroller>('scroller');

    /******************** State ********************/

    /** Whether the suggestion panel is open. */
    readonly overlayVisible = signal<boolean>(false);

    /** Index of the highlighted suggestion, -1 when none. */
    readonly focusedOptionIndex = signal<number>(-1);

    /** Whether the field has the focus. */
    readonly focused = signal<boolean>(false);

    /** The mention being typed, null when the caret is not in one. */
    readonly context = signal<MentionContext | null>(null);

    private searchTimeout: ReturnType<typeof setTimeout> | undefined;

    private lastSearchKey: string | null = null;

    /** Start of a mention closed with Escape: it stays closed until the caret leaves it. */
    private dismissedStart = -1;

    private opened = false;

    /** Last pointer position, to tell a real mouse move from one caused by the panel opening under the pointer. */
    private pointer: [number, number] | null = null;

    readonly translation = toSignal(this.config.translationObserver, { initialValue: this.config.translation });

    readonly _id = uuid('pn_id_');

    readonly listId = computed(() => `${this.inputId() || this._id}_list`);

    readonly $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    readonly $invalid = computed(() => !!this.invalid());

    readonly suggestionList = computed<T[]>(() => this.suggestions() || []);

    readonly listVisible = computed(() => this.overlayVisible() && this.suggestionList().length > 0);

    readonly inputValue = computed(() => this.modelValue() ?? '');

    readonly focusedOptionId = computed(() => (this.focusedOptionIndex() !== -1 ? this.optionId(this.focusedOptionIndex()) : undefined));

    readonly listLabel = computed<string | undefined>(() => this.translation()?.[TranslationKeys.ARIA]?.['listLabel']);

    readonly emptyMessageText = computed(() => this.emptyMessage() || this.translation()?.emptySearchMessage || 'No results found');

    readonly loadingMessageText = computed(() => this.loadingMessage() || 'Loading...');

    readonly liveMessage = computed(() => {
        if (!this.overlayVisible()) {
            return '';
        }
        const count = this.suggestionList().length;
        if (count) {
            const text = this.searchMessage() || this.translation()?.searchMessage || '{0} results are available';
            return text.includes('{0}') ? text.replaceAll('{0}', String(count)) : `${text} (${count})`;
        }
        return this.loading() ? this.loadingMessageText() : this.emptyMessageText();
    });

    readonly panelContext = computed<MentionPanelTemplateContext>(() => ({ trigger: this.context()?.trigger ?? '', query: this.context()?.query ?? '' }));

    readonly $overlayOptions = computed<OverlayOptions>(() => {
        const options = this.overlayOptions();
        return {
            ...options,
            listener: (event: Event, listenerOptions: any) => {
                // A click in the field moves the caret: the field decides whether the mention is still open.
                if (listenerOptions?.type === 'outside' && this.el.nativeElement.contains(event.target as Node)) {
                    return false;
                }
                return options?.listener ? options.listener(event, listenerOptions) : listenerOptions?.valid;
            }
        };
    });

    readonly virtualScrollerDisabled = computed(() => !this.virtualScroll());

    readonly dataP = computed(() =>
        this.cn({
            fluid: this.hasFluid,
            invalid: this.$invalid(),
            disabled: this.$disabled(),
            open: this.overlayVisible(),
            [this.size() as string]: this.size()
        })
    );

    /******************** Public API ********************/

    /**
     * Closes the suggestion panel.
     * @group Method
     */
    hide() {
        this.overlayVisible.set(false);
        clearTimeout(this.searchTimeout);
        if (this.opened) {
            this.opened = false;
            this.onHide.emit();
        }
    }

    /**
     * Inserts a suggestion in place of the mention being typed, as if it had been chosen in the panel.
     * @param {T} option - The suggestion.
     * @param {Event} event - Browser event.
     * @group Method
     */
    select(option: T, event: Event = new Event('select')) {
        const ctx = this.context();
        const field = this.fieldViewChild()?.nativeElement;
        if (!ctx || !field) {
            return;
        }
        const value = field.value;
        let end = ctx.caret;
        while (end < value.length && !/\s/.test(value[end])) {
            end++;
        }
        const after = value.slice(end);
        const text = ctx.trigger + this.getOptionLabel(option);
        const hasSpace = /^\s/.test(after);
        const space = this.appendSpace() && !hasSpace ? ' ' : '';
        const newValue = value.slice(0, ctx.start) + text + space + after;
        const caret = ctx.start + text.length + (this.appendSpace() ? 1 : 0);

        field.value = newValue;
        this.writeModelValue(newValue);
        this.onModelChange(newValue);
        field.setSelectionRange(caret, caret);
        this.lastSearchKey = null;
        this.context.set(null);
        this.hide();
        this.onSelect.emit({ originalEvent: event, value: option, trigger: ctx.trigger, query: ctx.query, text });
    }

    /**
     * Gives the focus to the field.
     * @group Method
     */
    focus() {
        this.fieldViewChild()?.nativeElement.focus();
    }

    /******************** Template helpers ********************/

    getOptionLabel(option: T): string {
        const optionLabel = this.optionLabel();
        const label = optionLabel ? resolveFieldData(option, optionLabel) : option && typeof option === 'object' && (option as any).label != null ? (option as any).label : option;
        return label == null ? '' : String(label);
    }

    optionId(index: number) {
        return `${this.listId()}_${index}`;
    }

    getOptionIndex(index: number, scrollerOptions: any): number {
        return this.virtualScrollerDisabled() ? index : (scrollerOptions?.getItemOptions?.(index)?.index ?? index);
    }

    itemContext(option: T, index: number): MentionItemTemplateContext<T> {
        const ctx = this.context();
        return { $implicit: option, index, trigger: ctx?.trigger ?? '', query: ctx?.query ?? '', focused: this.focusedOptionIndex() === index };
    }

    getPTOptions(option: T, index: number) {
        return this.ptm('option', { context: { option, index, focused: this.focusedOptionIndex() === index } });
    }

    /******************** Events ********************/

    onInput(event: Event) {
        const value = (event.target as HTMLTextAreaElement).value;
        this.writeModelValue(value);
        this.onModelChange(value);
        this.evaluate(event);
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.isComposing || !this.overlayVisible()) {
            return;
        }
        const count = this.suggestionList().length;
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (count) this.changeFocusedOptionIndex(Math.min(this.focusedOptionIndex() + 1, count - 1));
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (count) this.changeFocusedOptionIndex(Math.max(this.focusedOptionIndex() - 1, 0));
                break;
            case 'PageDown':
                if (count) {
                    event.preventDefault();
                    this.changeFocusedOptionIndex(count - 1);
                }
                break;
            case 'PageUp':
                if (count) {
                    event.preventDefault();
                    this.changeFocusedOptionIndex(0);
                }
                break;
            case 'Enter':
            case 'Tab': {
                const option = this.suggestionList()[this.focusedOptionIndex()];
                if (option !== undefined && !event.shiftKey) {
                    event.preventDefault();
                    this.select(option, event);
                } else if (event.key === 'Tab') {
                    this.hide();
                }
                break;
            }
            case 'Escape':
                event.preventDefault();
                event.stopPropagation();
                this.dismissedStart = this.context()?.start ?? -1;
                this.hide();
                break;
        }
    }

    onKeyUp(event: KeyboardEvent) {
        // Moving the caret can enter or leave a mention.
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && !this.overlayVisible())) {
            this.evaluate(event);
        }
    }

    onClick(event: MouseEvent) {
        this.pointer = [event.clientX, event.clientY];
        this.evaluate(event);
    }

    onInputFocus(event: FocusEvent) {
        this.focused.set(true);
        this.onFocus.emit(event);
    }

    onInputBlur(event: FocusEvent) {
        this.focused.set(false);
        this.hide();
        this.context.set(null);
        this.lastSearchKey = null;
        this.dismissedStart = -1;
        this.onModelTouched();
        this.onBlur.emit(event);
    }

    onOverlayMouseDown(event: MouseEvent) {
        // Keeps the focus and the caret in the field while an option is clicked.
        event.preventDefault();
    }

    onOptionClick(event: MouseEvent, option: T) {
        this.select(option, event);
        this.focus();
    }

    onOptionMouseMove(event: MouseEvent, index: number) {
        // Browsers send a mousemove when the panel opens under a still pointer: only a real move highlights an option.
        const moved = !this.pointer || this.pointer[0] !== event.clientX || this.pointer[1] !== event.clientY;
        this.pointer = [event.clientX, event.clientY];
        if (moved && this.focusedOptionIndex() !== index) {
            this.focusedOptionIndex.set(index);
        }
    }

    onOverlayBeforeEnter() {
        const scroller = this.scroller();
        if (this.virtualScroll() && scroller) {
            scroller.setContentEl(this.itemsViewChild()?.nativeElement);
            scroller.viewInit();
        }
    }

    /******************** Forms ********************/

    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        setModelValue(value ?? '');
        this.hide();
        this.context.set(null);
    }

    onDestroy() {
        clearTimeout(this.searchTimeout);
    }

    /******************** Internals ********************/

    private changeFocusedOptionIndex(index: number) {
        this.focusedOptionIndex.set(index);
        this.scrollInView(index);
    }

    private scrollInView(index: number) {
        const list = this.itemsViewChild()?.nativeElement;
        const element = list?.querySelector(`[id="${this.optionId(index)}"]`) as HTMLElement | null;
        if (element) {
            element.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
        } else if (this.virtualScroll()) {
            this.scroller()?.scrollToIndex(index);
        }
    }

    /**
     * Finds the mention around the caret and opens, updates or closes the panel.
     */
    private evaluate(event: Event) {
        const field = this.fieldViewChild()?.nativeElement;
        if (!field || this.$disabled() || this.readonly()) {
            this.hide();
            return;
        }
        const ctx = this.findContext(field.value, field.selectionStart ?? 0, field.selectionEnd ?? 0);
        if (!ctx) {
            this.context.set(null);
            this.lastSearchKey = null;
            this.dismissedStart = -1;
            this.hide();
            return;
        }
        const previous = this.context();
        this.context.set(ctx);
        if (ctx.start !== this.dismissedStart) {
            this.dismissedStart = -1;
        }
        if (this.dismissedStart !== -1 || ctx.query.length < this.minQueryLength()) {
            this.lastSearchKey = null;
            this.hide();
            return;
        }
        const key = `${ctx.start}\u0000${ctx.trigger}\u0000${ctx.query}`;
        if (key !== this.lastSearchKey) {
            this.lastSearchKey = key;
            this.search(event, ctx);
        }
        if (!previous || previous.start !== ctx.start || !this.overlayVisible()) {
            this.positionAnchor(ctx);
            if (this.overlayVisible()) {
                this.overlayViewChild()?.alignOverlay();
            }
        }
        this.syncVisibility();
    }

    private search(event: Event, ctx: MentionContext) {
        clearTimeout(this.searchTimeout);
        const emit = () => this.onSearch.emit({ originalEvent: event, trigger: ctx.trigger, query: ctx.query });
        if (this.delay() > 0) {
            this.searchTimeout = setTimeout(emit, this.delay());
        } else {
            emit();
        }
    }

    /**
     * Opens the panel when a mention is typed and there is something to show, closes it otherwise.
     */
    private syncVisibility() {
        const ctx = this.context();
        const active = !!ctx && this.focused() && this.dismissedStart === -1 && ctx.query.length >= this.minQueryLength() && !this.$disabled() && !this.readonly();
        const show = active && (this.suggestionList().length > 0 || this.loading() || this.showEmptyMessage());
        if (show) {
            this.overlayVisible.set(true);
            if (!this.opened) {
                this.opened = true;
                this.onShow.emit();
            }
        } else if (this.overlayVisible() || this.opened) {
            this.hide();
        }
    }

    private findContext(value: string, selectionStart: number, selectionEnd: number): MentionContext | null {
        if (selectionStart !== selectionEnd) {
            return null;
        }
        const caret = selectionStart;
        let start = caret;
        while (start > 0 && !/\s/.test(value[start - 1])) {
            start--;
        }
        const word = value.slice(start, caret);
        const trigger = [...this.triggers()]
            .filter(Boolean)
            .sort((a, b) => b.length - a.length)
            .find((t) => word.startsWith(t));
        return trigger ? { trigger, query: word.slice(trigger.length), start, caret } : null;
    }

    /**
     * Moves the invisible anchor the panel is aligned with under the line of the trigger, or over the whole field.
     */
    private positionAnchor(ctx: MentionContext) {
        const field = this.fieldViewChild()?.nativeElement;
        const anchor = this.anchorViewChild()?.nativeElement;
        if (!field || !anchor || !isPlatformBrowser(this.platformId)) {
            return;
        }
        const style = anchor.style;
        if (this.position() === 'field') {
            style.top = `${field.offsetTop}px`;
            style.left = `${field.offsetLeft}px`;
            style.width = `${field.offsetWidth}px`;
            style.height = `${field.offsetHeight}px`;
            return;
        }
        const caret = this.caretCoordinates(field, ctx.start);
        const top = Math.max(0, Math.min(caret.top, field.offsetHeight - caret.height));
        style.width = '';
        style.top = `${field.offsetTop + top}px`;
        style.height = `${caret.height}px`;
        const width = anchor.offsetWidth;
        const left = Math.max(0, Math.min(caret.rtl ? caret.left - width : caret.left, field.offsetWidth - width));
        style.left = `${field.offsetLeft + left}px`;
    }

    /**
     * Position of a character of the field relative to its border box, measured on a hidden copy of the field: the
     * left edge of the character, its right edge in a right-to-left field, the top and the height of its line.
     */
    private caretCoordinates(field: HTMLTextAreaElement | HTMLInputElement, position: number) {
        const doc = this.document;
        const computed = doc.defaultView!.getComputedStyle(field);
        const mirror = doc.createElement('div');
        const mirrorStyle = mirror.style as any;
        MIRRORED_PROPERTIES.forEach((property) => (mirrorStyle[property] = (computed as any)[property]));
        mirrorStyle.position = 'absolute';
        mirrorStyle.visibility = 'hidden';
        mirrorStyle.top = '0';
        mirrorStyle.left = '-9999px';
        mirrorStyle.overflow = 'hidden';
        const multiline = field.tagName === 'TEXTAREA';
        mirrorStyle.whiteSpace = multiline ? 'pre-wrap' : 'pre';
        mirrorStyle.overflowWrap = multiline ? 'break-word' : 'normal';
        if (multiline && field.scrollHeight > field.clientHeight) {
            mirrorStyle.overflowY = 'scroll';
        }

        const value = field.value;
        mirror.textContent = value.slice(0, position);
        const marker = doc.createElement('span');
        marker.textContent = value.slice(position, position + 1) || '.';
        mirror.appendChild(marker);
        mirror.appendChild(doc.createTextNode(value.slice(position + 1)));
        doc.body.appendChild(mirror);

        const rtl = computed.direction === 'rtl';
        const borderTop = parseFloat(computed.borderTopWidth) || 0;
        const borderLeft = parseFloat(computed.borderLeftWidth) || 0;
        const lineHeight = parseFloat(computed.lineHeight) || marker.offsetHeight;
        const result = {
            top: marker.offsetTop + borderTop - field.scrollTop,
            left: marker.offsetLeft + (rtl ? marker.offsetWidth : 0) + borderLeft - field.scrollLeft,
            height: lineHeight,
            rtl
        };
        doc.body.removeChild(mirror);
        return result;
    }
}

@NgModule({
    imports: [Mention, SharedModule],
    exports: [Mention, SharedModule]
})
export class MentionModule {}
