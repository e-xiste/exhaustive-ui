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
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SharedModule } from '@exhaustive-ui/core/api';
import { PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseEditableHolder } from '@exhaustive-ui/core/baseeditableholder';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { Fluid } from '@exhaustive-ui/core/fluid';
import type {
    RichTextEditorFocusEvent,
    RichTextEditorFormat,
    RichTextEditorInitEvent,
    RichTextEditorLabels,
    RichTextEditorPassThrough,
    RichTextEditorSelectionChangeEvent,
    RichTextEditorTextChangeEvent,
    RichTextEditorToolbar,
    RichTextEditorToolbarItem,
    RichTextEditorToolbarTemplateContext
} from '@exhaustive-ui/core/types/richtexteditor';
import { uuid } from '@exhaustive-ui/utils';
import type { AnyExtension, Editor as TiptapEditor } from '@tiptap/core';
import { RichTextEditorStyle } from './style/richtexteditorstyle';

export const RICHTEXTEDITOR_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RichTextEditor),
    multi: true
};

/**
 * Default texts of RichTextEditor.
 * @group Constants
 */
export const RICHTEXTEDITOR_DEFAULT_LABELS: RichTextEditorLabels = {
    toolbar: 'Formatting',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    strike: 'Strikethrough',
    code: 'Code',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    bulletList: 'Bullet list',
    orderedList: 'Numbered list',
    blockquote: 'Quote',
    codeBlock: 'Code block',
    link: 'Link',
    alignLeft: 'Align left',
    alignCenter: 'Align center',
    alignRight: 'Align right',
    alignJustify: 'Justify',
    undo: 'Undo',
    redo: 'Redo',
    clear: 'Clear formatting',
    linkUrl: 'URL',
    linkApply: 'Apply',
    linkRemove: 'Remove link',
    linkCancel: 'Cancel',
    linkInvalid: 'Enter a valid URL, such as https://example.com',
    count: '{0} / {1}',
    countNoLimit: '{0} characters',
    limitReached: 'Limit of {0} characters reached'
};

/**
 * Toolbar of RichTextEditor when the toolbar input is not set.
 * @group Constants
 */
export const RICHTEXTEDITOR_DEFAULT_TOOLBAR: RichTextEditorToolbar = ['bold', 'italic', 'underline', 'strike', '|', 'heading1', 'heading2', 'heading3', '|', 'bulletList', 'orderedList', 'blockquote', 'codeBlock', '|', 'link', '|', 'undo', 'redo'];

type ButtonName = Exclude<RichTextEditorToolbarItem, 'textAlign'>;

interface ToolbarEntry {
    key: string;
    name: ButtonName | '|';
    index: number;
    toggle: boolean;
}

const TOGGLES = new Set<string>(['bold', 'italic', 'underline', 'strike', 'code', 'heading1', 'heading2', 'heading3', 'bulletList', 'orderedList', 'blockquote', 'codeBlock', 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify']);

const BUTTONS = new Set<string>([...TOGGLES, 'link', 'undo', 'redo', 'clear']);

const GLYPHS: Partial<Record<ButtonName, string>> = {
    bold: 'B',
    italic: 'I',
    underline: 'U',
    strike: 'S'
};

const ICONS: Partial<Record<ButtonName, string>> = {
    heading1: 'M3 6v12M11 6v12M3 12h8M16 10l3-2v10',
    heading2: 'M3 6v12M11 6v12M3 12h8M15.5 10.5c.4-1.4 1.5-2.2 2.7-2.2 1.4 0 2.5 1 2.5 2.4 0 2.6-5.2 3.9-5.2 7.3h5.4',
    heading3: 'M3 6v12M11 6v12M3 12h8M15.5 9.2c.5-.6 1.3-1 2.3-1 1.5 0 2.6.9 2.6 2.2 0 1.3-1.1 2.1-2.6 2.1 1.7 0 2.9.9 2.9 2.4 0 1.4-1.2 2.4-2.9 2.4-1.1 0-2-.4-2.5-1.1',
    code: 'M8 7l-5 5 5 5M16 7l5 5-5 5',
    bulletList: 'M9 6h12M9 12h12M9 18h12M3 6a1 1 0 1 0 2 0a1 1 0 1 0-2 0M3 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0M3 18a1 1 0 1 0 2 0a1 1 0 1 0-2 0',
    orderedList: 'M10 7h11M10 17h11M3.5 5l1.5-1v6M3 14.6c.3-.9 1-1.4 1.8-1.4.9 0 1.5.6 1.5 1.4 0 1.5-3.3 2.5-3.3 4.4h3.4',
    blockquote: 'M4 5v14M9 7h11M9 12h11M9 17h7',
    codeBlock: 'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM10 9l-3 3 3 3M14 9l3 3-3 3',
    link: 'M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1',
    alignLeft: 'M3 6h18M3 10h12M3 14h18M3 18h12',
    alignCenter: 'M3 6h18M6 10h12M3 14h18M6 18h12',
    alignRight: 'M3 6h18M9 10h12M3 14h18M9 18h12',
    alignJustify: 'M3 6h18M3 10h18M3 14h18M3 18h18',
    undo: 'M9 4L4 9l5 5M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
    redo: 'M15 4l5 5-5 5M20 9H9.5a5.5 5.5 0 0 0 0 11H13',
    clear: 'M4 7V5h12v2M10 5l-3 14M5 19h5M15 13l6 6M21 13l-6 6'
};

const SHORTCUTS: Partial<Record<ButtonName, string>> = {
    bold: 'Mod+B',
    italic: 'Mod+I',
    underline: 'Mod+U',
    strike: 'Mod+Shift+S',
    code: 'Mod+E',
    heading1: 'Mod+Alt+1',
    heading2: 'Mod+Alt+2',
    heading3: 'Mod+Alt+3',
    bulletList: 'Mod+Shift+8',
    orderedList: 'Mod+Shift+7',
    blockquote: 'Mod+Shift+B',
    codeBlock: 'Mod+Alt+C',
    link: 'Mod+K',
    alignLeft: 'Mod+Shift+L',
    alignCenter: 'Mod+Shift+E',
    alignRight: 'Mod+Shift+R',
    alignJustify: 'Mod+Shift+J',
    undo: 'Mod+Z',
    redo: 'Mod+Shift+Z'
};

const ALIGNMENTS: Partial<Record<ButtonName, string>> = { alignLeft: 'left', alignCenter: 'center', alignRight: 'right', alignJustify: 'justify' };

const format = (text: string, ...values: (string | number)[]) => values.reduce<string>((acc, value, index) => acc.replace(`{${index}}`, String(value)), text);

/**
 * Turns the text typed in the link panel into a safe href, or null when it is not a valid link.
 */
export function normalizeRichTextEditorLink(value: string): string | null {
    const url = value.trim();
    if (!url || /\s/.test(url)) {
        return null;
    }
    if (/^(\/|#|\?|\.\/|\.\.\/)/.test(url)) {
        return url;
    }
    const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(url)?.[1]?.toLowerCase();
    if (scheme) {
        return ['http', 'https', 'mailto', 'tel'].includes(scheme) && url.length > scheme.length + 1 ? url : null;
    }
    if (/^[^@/]+@[^@/]+\.[^@/]+$/.test(url)) {
        return `mailto:${url}`;
    }
    return /^[^/:]+\.[^/:]{2,}(:\d+)?([/?#].*)?$/.test(url) ? `https://${url}` : null;
}

/**
 * RichTextEditor is a rich text editor built on Tiptap and ProseMirror, with a themed and accessible toolbar. Its value is HTML or Tiptap JSON, and it works with template-driven forms, reactive forms and Signal Forms.
 * @group Components
 */
@Component({
    selector: 'p-rich-text-editor, p-richtexteditor',
    standalone: true,
    imports: [NgTemplateOutlet, SharedModule, BindModule],
    template: `
        @if (toolbarTemplate()) {
            <div [class]="cx('toolbar')" [pBind]="ptm('toolbar')">
                <ng-container *ngTemplateOutlet="toolbarTemplate()!; context: toolbarContext()" />
            </div>
        } @else if (toolbarEntries().length && !readonly()) {
            <div
                #toolbarEl
                [class]="cx('toolbar')"
                role="toolbar"
                [attr.aria-label]="labelOf('toolbar')"
                [attr.aria-controls]="editorId()"
                [attr.aria-disabled]="controlsDisabled() || undefined"
                (keydown)="onToolbarKeydown($event)"
                [pBind]="ptm('toolbar')"
            >
                @for (entry of toolbarEntries(); track entry.key) {
                    @if (entry.name === '|') {
                        <span [class]="cx('separator')" role="separator" aria-orientation="vertical" [pBind]="ptm('separator')"></span>
                    } @else {
                        <button
                            type="button"
                            [class]="cx('button', { active: entry.toggle && isItemActive(entry.name) })"
                            [attr.data-item]="entry.name"
                            [attr.tabindex]="entry.index === focusIndex() ? 0 : -1"
                            [attr.aria-label]="labelOf(entry.name)"
                            [attr.title]="titleOf(entry.name)"
                            [attr.aria-keyshortcuts]="keyShortcutOf(entry.name)"
                            [attr.aria-pressed]="entry.toggle ? isItemActive(entry.name) : undefined"
                            [attr.aria-haspopup]="entry.name === 'link' ? 'dialog' : undefined"
                            [attr.aria-expanded]="entry.name === 'link' ? linkOpen() : undefined"
                            [attr.aria-disabled]="!controlsDisabled() && !canRun(entry.name) ? true : undefined"
                            [disabled]="controlsDisabled()"
                            (mousedown)="onButtonMouseDown($event)"
                            (click)="onButtonClick(entry, $event)"
                            (focus)="focusIndex.set(entry.index)"
                            [pBind]="ptm('button')"
                        >
                            @if (glyphOf(entry.name); as glyph) {
                                <span [class]="cx('buttonIcon', { name: entry.name })" aria-hidden="true" [pBind]="ptm('buttonIcon')">{{ glyph }}</span>
                            } @else {
                                <svg
                                    [class]="cx('buttonIcon', { name: entry.name })"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    aria-hidden="true"
                                    focusable="false"
                                    [pBind]="ptm('buttonIcon')"
                                >
                                    <path [attr.d]="iconOf(entry.name)" />
                                </svg>
                            }
                        </button>
                    }
                }
            </div>
        }

        <div #content [class]="cx('content')" [style.min-height]="minHeight()" [style.max-height]="maxHeight()" (mousedown)="onContentMouseDown($event)" [pBind]="ptm('content')">
            @if (!ready()) {
                <div
                    [class]="cx('editor')"
                    [attr.id]="editorId()"
                    role="textbox"
                    aria-multiline="true"
                    aria-readonly="true"
                    aria-busy="true"
                    [attr.aria-label]="ariaLabel()"
                    [attr.aria-labelledby]="ariaLabelledBy()"
                    [attr.data-placeholder]="$filled() ? undefined : placeholder()"
                ></div>
            }
        </div>

        @if (linkOpen()) {
            <div
                #linkPanel
                [class]="cx('linkPanel')"
                role="dialog"
                [attr.aria-label]="labelOf('link')"
                [style.top.px]="linkPosition().top"
                [style.left.px]="linkPosition().left"
                (keydown)="onLinkKeydown($event)"
                (focusout)="onLinkFocusOut($event)"
                [pBind]="ptm('linkPanel')"
            >
                <label [class]="cx('linkLabel')" [attr.for]="linkInputId">{{ labelOf('linkUrl') }}</label>
                <input
                    #linkInput
                    [class]="cx('linkInput')"
                    type="url"
                    inputmode="url"
                    autocomplete="url"
                    placeholder="https://"
                    [attr.id]="linkInputId"
                    [value]="linkUrl()"
                    [attr.aria-invalid]="linkError() || undefined"
                    [attr.aria-describedby]="linkError() ? linkErrorId : undefined"
                    (input)="onLinkInput($event)"
                    [pBind]="ptm('linkInput')"
                />
                @if (linkError()) {
                    <span [class]="cx('linkError')" [attr.id]="linkErrorId">{{ labelOf('linkInvalid') }}</span>
                }
                <div [class]="cx('linkActions')">
                    @if (linkActive()) {
                        <button type="button" [class]="cx('linkButton', { kind: 'remove' })" (click)="removeLink()" [pBind]="ptm('linkButton')">{{ labelOf('linkRemove') }}</button>
                    }
                    <button type="button" [class]="cx('linkButton', { kind: 'cancel' })" (click)="closeLink(true)" [pBind]="ptm('linkButton')">{{ labelOf('linkCancel') }}</button>
                    <button type="button" [class]="cx('linkButton', { kind: 'apply' })" (click)="applyLink()" [pBind]="ptm('linkButton')">{{ labelOf('linkApply') }}</button>
                </div>
            </div>
        }

        @if (showCount()) {
            <div [class]="cx('footer')" [pBind]="ptm('footer')">
                <span [class]="cx('count')" [attr.id]="countId" [pBind]="ptm('count')">{{ countText() }}</span>
            </div>
        }

        <span class="p-hidden-accessible" aria-live="polite">{{ announcement() }}</span>
    `,
    providers: [RICHTEXTEDITOR_VALUE_ACCESSOR, RichTextEditorStyle, { provide: PARENT_INSTANCE, useExisting: RichTextEditor }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class RichTextEditor extends BaseEditableHolder<RichTextEditorPassThrough> {
    componentName = 'RichTextEditor';

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(RichTextEditorStyle);

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    /******************** Inputs ********************/

    /**
     * Format of the value: an HTML string, or the JSON document of Tiptap.
     * @defaultValue 'html'
     * @group Props
     */
    readonly format = input<RichTextEditorFormat>('html');
    /**
     * Buttons of the toolbar, in order, `'|'` adds a separator. An empty array hides the toolbar.
     * @defaultValue RICHTEXTEDITOR_DEFAULT_TOOLBAR
     * @group Props
     */
    readonly toolbar = input<RichTextEditorToolbar | null | undefined>();
    /**
     * Tiptap extensions added to the StarterKit, the text alignment and the extensions of the component.
     * @group Props
     */
    readonly extensions = input<AnyExtension[] | undefined>();
    /**
     * Text shown while the editor is empty.
     * @group Props
     */
    readonly placeholder = input<string | undefined>();
    /**
     * Whether the content can be read and selected but not changed. The default toolbar is hidden.
     * @defaultValue false
     * @group Props
     */
    readonly readonly = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the editor takes the focus once it is loaded.
     * @defaultValue false
     * @group Props
     */
    readonly autofocus = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Maximum number of characters of the text, formatting excluded. Typing and pasting stop at the limit.
     * @group Props
     */
    readonly maxLength = input<number | undefined, unknown>(undefined, { transform: (value: unknown) => (value === null || value === undefined || value === '' ? undefined : numberAttribute(value)) });
    /**
     * Whether to show the number of characters under the editor, with the maximum when maxLength is set.
     * @defaultValue false
     * @group Props
     */
    readonly showCount = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Minimum height of the editable area, as a CSS length.
     * @group Props
     */
    readonly minHeight = input<string | undefined>();
    /**
     * Maximum height of the editable area, as a CSS length. The content scrolls beyond it.
     * @group Props
     */
    readonly maxHeight = input<string | undefined>();
    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    readonly fluid = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Specifies the input variant of the component.
     * @defaultValue 'outlined'
     * @group Props
     */
    readonly variant = input<'filled' | 'outlined' | undefined>();
    /**
     * Size of the component.
     * @group Props
     */
    readonly size = input<'small' | 'large' | undefined>();
    /**
     * Texts of the component, merged with the English defaults.
     * @group Props
     */
    readonly labels = input<Partial<RichTextEditorLabels> | undefined>();
    /**
     * Identifier of the editable element.
     * @group Props
     */
    readonly inputId = input<string | undefined>();
    /**
     * Accessible label of the editable element.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();
    /**
     * Identifier of the element that labels the editable element.
     * @group Props
     */
    readonly ariaLabelledBy = input<string | undefined>();
    /**
     * Identifier of the element that describes the editable element, such as a hint or an error message.
     * @group Props
     */
    readonly ariaDescribedBy = input<string | undefined>();

    /******************** Outputs ********************/

    /**
     * Callback to invoke once Tiptap is loaded and the editor is created, bound as `(onInit)`.
     * @param {RichTextEditorInitEvent} event - Custom init event.
     * @group Emits
     */
    readonly onEditorInit = output<RichTextEditorInitEvent<TiptapEditor>>({ alias: 'onInit' });
    /**
     * Callback to invoke when the user changes the content.
     * @param {RichTextEditorTextChangeEvent} event - Custom text change event.
     * @group Emits
     */
    readonly onTextChange = output<RichTextEditorTextChangeEvent<TiptapEditor>>();
    /**
     * Callback to invoke when the selection changes.
     * @param {RichTextEditorSelectionChangeEvent} event - Custom selection change event.
     * @group Emits
     */
    readonly onSelectionChange = output<RichTextEditorSelectionChangeEvent<TiptapEditor>>();
    /**
     * Callback to invoke when the editable area receives the focus.
     * @param {RichTextEditorFocusEvent} event - Custom focus event.
     * @group Emits
     */
    readonly onFocus = output<RichTextEditorFocusEvent<TiptapEditor>>();
    /**
     * Callback to invoke when the editable area loses the focus.
     * @param {RichTextEditorFocusEvent} event - Custom blur event.
     * @group Emits
     */
    readonly onBlur = output<RichTextEditorFocusEvent<TiptapEditor>>();

    /******************** Templates ********************/

    /**
     * Custom toolbar, replaces the default one.
     * @param {RichTextEditorToolbarTemplateContext} context - toolbar context.
     * @group Templates
     */
    readonly toolbarTemplate = contentChild<TemplateRef<RichTextEditorToolbarTemplateContext<TiptapEditor>>>('toolbar', { descendants: false });

    readonly contentEl = viewChild<ElementRef<HTMLDivElement>>('content');

    readonly toolbarEl = viewChild<ElementRef<HTMLDivElement>>('toolbarEl');

    readonly linkInputEl = viewChild<ElementRef<HTMLInputElement>>('linkInput');

    /******************** State ********************/

    /**
     * The Tiptap editor, undefined until Tiptap is loaded in the browser.
     */
    readonly editor = signal<TiptapEditor | undefined>(undefined);

    readonly ready = computed(() => !!this.editor());

    /**
     * Incremented on every transaction, so that the toolbar state is computed again.
     */
    readonly revision = signal(0);

    readonly focused = signal(false);

    readonly empty = signal(true);

    readonly characters = signal(0);

    readonly focusIndex = signal(0);

    readonly linkOpen = signal(false);

    readonly linkUrl = signal('');

    readonly linkError = signal(false);

    readonly linkActive = signal(false);

    readonly linkPosition = signal({ top: 0, left: 0 });

    readonly announcement = signal('');

    readonly uid = uuid('pn_id_');

    readonly linkInputId = `${this.uid}_link`;

    readonly linkErrorId = `${this.uid}_link_error`;

    readonly countId = `${this.uid}_count`;

    readonly editorId = computed(() => this.inputId() || `${this.uid}_editor`);

    readonly controlsDisabled = computed(() => this.$disabled() || this.readonly());

    readonly mergedLabels = computed<RichTextEditorLabels>(() => ({ ...RICHTEXTEDITOR_DEFAULT_LABELS, ...(this.labels() ?? {}) }));

    readonly toolbarEntries = computed<ToolbarEntry[]>(() => {
        const items = this.toolbar() ?? RICHTEXTEDITOR_DEFAULT_TOOLBAR;
        const entries: ToolbarEntry[] = [];
        const seen = new Set<string>();
        let index = 0;
        const push = (name: ButtonName) => {
            if (!seen.has(name)) {
                seen.add(name);
                entries.push({ key: name, name, index: index++, toggle: TOGGLES.has(name) });
            }
        };
        items.forEach((item, position) => {
            if (item === '|') {
                if (entries.length && entries.at(-1)!.name !== '|') {
                    entries.push({ key: `separator_${position}`, name: '|', index: -1, toggle: false });
                }
            } else if (item === 'textAlign') {
                (['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'] as ButtonName[]).forEach(push);
            } else if (BUTTONS.has(item)) {
                push(item);
            }
        });
        if (entries.at(-1)?.name === '|') {
            entries.pop();
        }
        return entries;
    });

    readonly buttonCount = computed(() => this.toolbarEntries().filter((entry) => entry.name !== '|').length);

    readonly toolbarContext = computed<RichTextEditorToolbarTemplateContext<TiptapEditor>>(() => {
        this.revision();
        const editor = this.editor();
        return {
            $implicit: editor,
            editor,
            isActive: (name: string | Record<string, any>, attributes?: Record<string, any>) => !!editor && (typeof name === 'string' ? editor.isActive(name, attributes) : editor.isActive(name)),
            disabled: this.controlsDisabled(),
            openLink: () => this.openLink()
        };
    });

    readonly countText = computed(() => {
        const max = this.maxLength();
        return max ? format(this.labelOf('count'), this.characters(), max) : format(this.labelOf('countNoLimit'), this.characters());
    });

    readonly dataP = computed(() =>
        this.cn({
            invalid: this.$invalid(),
            disabled: this.$disabled(),
            readonly: this.readonly(),
            focus: this.focused(),
            empty: this.empty(),
            fluid: this.hasFluid,
            filled: this.$variant() === 'filled',
            [this.size() as string]: !!this.size()
        })
    );

    readonly $variant = computed(() => this.variant() || this.config.inputVariant());

    get hasFluid() {
        return this.fluid() ?? !!this.pcFluid;
    }

    private pendingValue: any = null;

    private lastValue: any = undefined;

    private isMac = false;

    private destroyed = false;

    private limitAnnounced = false;

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));

        effect(() => {
            const editable = !this.controlsDisabled();
            const editor = this.editor();
            if (editor && editor.isEditable !== editable) {
                editor.setEditable(editable, false);
                if (!editable) {
                    untracked(() => this.closeLink(false));
                }
            }
        });

        effect(() => {
            const attributes = this.editorAttributes();
            const editor = this.editor();
            if (editor && !editor.isDestroyed) {
                editor.setOptions({ editorProps: { ...editor.options.editorProps, attributes } });
            }
        });

        effect(() => {
            this.placeholder();
            const editor = this.editor();
            if (editor && !editor.isDestroyed) {
                editor.view.dispatch(editor.state.tr.setMeta('addToHistory', false));
            }
        });

        effect(() => {
            const count = this.buttonCount();
            if (untracked(() => this.focusIndex()) >= count) {
                this.focusIndex.set(Math.max(0, count - 1));
            }
        });

        afterNextRender(() => {
            this.isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
            this.cd.markForCheck();
            this.createEditor();
        });
    }

    /******************** Public methods ********************/

    /**
     * Returns the Tiptap editor, undefined until it is loaded.
     * @group Method
     */
    getEditor(): TiptapEditor | undefined {
        return this.editor();
    }

    /**
     * Moves the focus to the editable area.
     * @group Method
     */
    focus() {
        this.editor()?.commands.focus();
    }

    /**
     * Opens the link panel for the selection.
     * @group Method
     */
    openLink() {
        const editor = this.editor();
        if (!editor || this.controlsDisabled()) {
            return;
        }
        const href = editor.getAttributes('link')['href'] ?? '';
        this.linkActive.set(editor.isActive('link'));
        this.linkUrl.set(href);
        this.linkError.set(false);
        this.linkPosition.set(this.computeLinkPosition(editor));
        this.linkOpen.set(true);
        this.cd.markForCheck();
        afterNextRender(
            () => {
                const input = this.linkInputEl()?.nativeElement;
                input?.focus();
                input?.select();
            },
            { injector: this.injector }
        );
    }

    /**
     * Closes the link panel.
     * @param {boolean} restoreFocus - Whether to move the focus back to the editable area.
     * @group Method
     */
    closeLink(restoreFocus = true) {
        if (!this.linkOpen()) {
            return;
        }
        this.linkOpen.set(false);
        if (restoreFocus) {
            this.editor()?.commands.focus();
        }
    }

    /**
     * Applies the URL of the link panel to the selection, or inserts it as a link when nothing is selected.
     * @group Method
     */
    applyLink() {
        const editor = this.editor();
        if (!editor) {
            return;
        }
        if (!this.linkUrl().trim()) {
            this.removeLink();
            return;
        }
        const href = normalizeRichTextEditorLink(this.linkUrl());
        if (!href) {
            this.linkError.set(true);
            this.linkInputEl()?.nativeElement.focus();
            return;
        }
        const { empty } = editor.state.selection;
        if (empty && !editor.isActive('link')) {
            editor
                .chain()
                .focus()
                .insertContent({ type: 'text', text: href.replace(/^mailto:/, ''), marks: [{ type: 'link', attrs: { href } }] })
                .run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
        }
        this.linkOpen.set(false);
    }

    /**
     * Removes the link at the selection.
     * @group Method
     */
    removeLink() {
        this.editor()?.chain().focus().extendMarkRange('link').unsetLink().run();
        this.linkOpen.set(false);
    }

    /******************** Template helpers ********************/

    labelOf(key: keyof RichTextEditorLabels): string {
        return this.mergedLabels()[key];
    }

    glyphOf(name: ButtonName): string | undefined {
        return GLYPHS[name];
    }

    iconOf(name: ButtonName): string | undefined {
        return ICONS[name];
    }

    keyShortcutOf(name: ButtonName): string | undefined {
        const shortcut = SHORTCUTS[name];
        return shortcut ? shortcut.replace('Mod', this.isMac ? 'Meta' : 'Control') : undefined;
    }

    titleOf(name: ButtonName): string {
        const shortcut = SHORTCUTS[name];
        if (!shortcut) {
            return this.labelOf(name);
        }
        const keys = this.isMac ? shortcut.replace('Mod+', '⌘').replace('Shift+', '⇧').replace('Alt+', '⌥') : shortcut.replace('Mod', 'Ctrl');
        return `${this.labelOf(name)} (${keys})`;
    }

    isItemActive(name: ButtonName): boolean {
        this.revision();
        const editor = this.editor();
        if (!editor) {
            return false;
        }
        if (name.startsWith('heading')) {
            return editor.isActive('heading', { level: Number(name.slice(-1)) });
        }
        const alignment = ALIGNMENTS[name];
        if (alignment) {
            return editor.isActive({ textAlign: alignment });
        }
        return editor.isActive(name);
    }

    canRun(name: ButtonName): boolean {
        this.revision();
        const editor = this.editor();
        if (!editor) {
            return false;
        }
        const can = editor.can().chain() as any;
        switch (name) {
            case 'undo':
                return can.undo().run();
            case 'redo':
                return can.redo().run();
            case 'link':
                return true;
            case 'clear':
                return can.unsetAllMarks().clearNodes().run();
            default:
                return this.command(can, name).run();
        }
    }

    onButtonMouseDown(event: MouseEvent) {
        // Keep the selection of the editable area while a button is pressed.
        event.preventDefault();
    }

    onButtonClick(entry: ToolbarEntry, event: MouseEvent) {
        this.focusIndex.set(entry.index);
        const name = entry.name as ButtonName;
        if (this.controlsDisabled() || !this.canRun(name)) {
            return;
        }
        if (name === 'link') {
            if (this.linkOpen()) {
                this.closeLink(true);
            } else {
                this.openLink();
            }
            return;
        }
        const editor = this.editor()!;
        this.command(editor.chain().focus() as any, name).run();
        if (event.detail === 0) {
            // Activated from the keyboard: keep the focus on the button.
            (event.currentTarget as HTMLElement)?.focus();
        }
    }

    onToolbarKeydown(event: KeyboardEvent) {
        const buttons = this.toolbarButtons();
        if (!buttons.length) {
            return;
        }
        const current = buttons.indexOf(event.target as HTMLButtonElement);
        const rtl = getComputedStyle(this.el.nativeElement).direction === 'rtl';
        let next = -1;
        switch (event.key) {
            case 'ArrowRight':
                next = rtl ? current - 1 : current + 1;
                break;
            case 'ArrowLeft':
                next = rtl ? current + 1 : current - 1;
                break;
            case 'Home':
                next = 0;
                break;
            case 'End':
                next = buttons.length - 1;
                break;
            case 'Escape':
                if (this.ready()) {
                    event.preventDefault();
                    this.editor()!.commands.focus();
                }
                return;
            default:
                return;
        }
        event.preventDefault();
        next = (next + buttons.length) % buttons.length;
        this.focusIndex.set(next);
        buttons[next].focus();
    }

    onContentMouseDown(event: MouseEvent) {
        // A click in the padding around the editable area places the caret at the end.
        if (event.target === this.contentEl()?.nativeElement && this.ready()) {
            event.preventDefault();
            this.editor()!.commands.focus('end');
        }
    }

    onLinkInput(event: Event) {
        this.linkUrl.set((event.target as HTMLInputElement).value);
        this.linkError.set(false);
    }

    onLinkKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            this.closeLink(true);
        } else if (event.key === 'Enter' && event.target === this.linkInputEl()?.nativeElement) {
            event.preventDefault();
            this.applyLink();
        }
    }

    onLinkFocusOut(event: FocusEvent) {
        const panel = event.currentTarget as HTMLElement;
        const next = event.relatedTarget as Node | null;
        if (next && !panel.contains(next)) {
            this.linkOpen.set(false);
        }
    }

    /******************** Forms ********************/

    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        const normalized = value === undefined || value === '' ? null : value;
        this.pendingValue = normalized;
        setModelValue(normalized);
        const editor = this.editor();
        if (editor && !editor.isDestroyed && !this.sameAsLast(normalized)) {
            this.lastValue = normalized;
            this.replaceContent(editor, normalized);
            this.syncState(editor);
        }
    }

    onDestroy() {
        this.destroyed = true;
        this.editor()?.destroy();
    }

    /******************** Internals ********************/

    readonly editorAttributes = computed(() => {
        const attributes: Record<string, string> = {
            id: this.editorId(),
            role: 'textbox',
            'aria-multiline': 'true'
        };
        const set = (name: string, value: string | undefined | null | false) => {
            if (value !== undefined && value !== null && value !== false && value !== '') {
                attributes[name] = value;
            }
        };
        set('class', this.cx('editor'));
        set('aria-label', this.ariaLabel());
        set('aria-labelledby', this.ariaLabelledBy());
        set('aria-describedby', [this.ariaDescribedBy(), this.showCount() ? this.countId : undefined].filter(Boolean).join(' '));
        set('aria-placeholder', this.placeholder());
        set('aria-invalid', this.$invalid() && 'true');
        set('aria-required', this.required() && 'true');
        set('aria-readonly', this.readonly() && 'true');
        set('aria-disabled', this.$disabled() && 'true');
        set('tabindex', this.readonly() && !this.$disabled() ? '0' : undefined);
        return attributes;
    });

    private command(chain: any, name: ButtonName): any {
        switch (name) {
            case 'bold':
                return chain.toggleBold();
            case 'italic':
                return chain.toggleItalic();
            case 'underline':
                return chain.toggleUnderline();
            case 'strike':
                return chain.toggleStrike();
            case 'code':
                return chain.toggleCode();
            case 'heading1':
            case 'heading2':
            case 'heading3':
                return chain.toggleHeading({ level: Number(name.slice(-1)) });
            case 'bulletList':
                return chain.toggleBulletList();
            case 'orderedList':
                return chain.toggleOrderedList();
            case 'blockquote':
                return chain.toggleBlockquote();
            case 'codeBlock':
                return chain.toggleCodeBlock();
            case 'alignLeft':
            case 'alignCenter':
            case 'alignRight':
            case 'alignJustify':
                return this.isItemActive(name) && name !== 'alignLeft' ? chain.unsetTextAlign() : chain.setTextAlign(ALIGNMENTS[name]);
            case 'undo':
                return chain.undo();
            case 'redo':
                return chain.redo();
            case 'clear':
                return chain.unsetAllMarks().clearNodes();
            default:
                return chain;
        }
    }

    private toolbarButtons(): HTMLButtonElement[] {
        return Array.from(this.toolbarEl()?.nativeElement.querySelectorAll<HTMLButtonElement>('button[data-item]') ?? []);
    }

    private computeLinkPosition(editor: TiptapEditor) {
        const root = this.el.nativeElement as HTMLElement;
        const rootRect = root.getBoundingClientRect();
        let top = (this.contentEl()?.nativeElement.offsetTop ?? 0) + 8;
        let left = 8;
        try {
            const coords = editor.view.coordsAtPos(editor.state.selection.from);
            top = coords.bottom - rootRect.top + 6;
            left = coords.left - rootRect.left;
        } catch {
            // The view is not laid out yet, keep the default position.
        }
        const panelWidth = Math.min(352, rootRect.width);
        left = Math.max(0, Math.min(left, rootRect.width - panelWidth));
        return { top: Math.max(0, top), left };
    }

    private sameAsLast(value: any): boolean {
        if (value === this.lastValue) {
            return true;
        }
        if (this.format() === 'json' && value && this.lastValue && typeof value === 'object') {
            return JSON.stringify(value) === JSON.stringify(this.lastValue);
        }
        return false;
    }

    /**
     * Replaces the content with a value written by the form, out of the undo history, so that undo cannot bring back the previous value.
     */
    private replaceContent(editor: TiptapEditor, value: any) {
        editor
            .chain()
            .setMeta('addToHistory', false)
            .setContent(value ?? '', { emitUpdate: false })
            .run();
    }

    private currentValue(editor: TiptapEditor): any {
        if (editor.isEmpty) {
            return null;
        }
        return this.format() === 'json' ? editor.getJSON() : editor.getHTML();
    }

    private countCharacters(editor: TiptapEditor): number {
        const doc = editor.state.doc;
        return doc.textBetween(0, doc.content.size, undefined, ' ').length;
    }

    private syncState(editor: TiptapEditor) {
        this.empty.set(editor.isEmpty);
        this.characters.set(this.countCharacters(editor));
        this.revision.update((value) => value + 1);
    }

    private announce(message: string) {
        this.announcement.set('');
        setTimeout(() => this.announcement.set(message));
    }

    private async createEditor() {
        if (!isPlatformBrowser(this.platformId) || this.editor()) {
            return;
        }
        let modules: [typeof import('@tiptap/core'), typeof import('@tiptap/starter-kit'), typeof import('@tiptap/extension-text-align'), typeof import('@tiptap/pm/state'), typeof import('@tiptap/pm/view')];
        try {
            modules = await Promise.all([import('@tiptap/core'), import('@tiptap/starter-kit'), import('@tiptap/extension-text-align'), import('@tiptap/pm/state'), import('@tiptap/pm/view')]);
        } catch (error: any) {
            console.error(`RichTextEditor could not load Tiptap. Install its optional peer dependencies, all MIT licensed: npm install @tiptap/core @tiptap/pm @tiptap/starter-kit @tiptap/extension-text-align (${error?.message ?? error})`);
            return;
        }
        const element = this.contentEl()?.nativeElement;
        if (this.destroyed || !element) {
            return;
        }
        const [{ Editor, Extension }, { StarterKit }, { TextAlign }, { Plugin, PluginKey }, { Decoration, DecorationSet }] = modules;

        const component = this;
        const countOf = (doc: any) => doc.textBetween(0, doc.content.size, undefined, ' ').length;

        const ComponentExtension = Extension.create({
            name: 'exhaustiveRichTextEditor',
            addKeyboardShortcuts() {
                return {
                    'Mod-k': () => {
                        if (component.toolbarEntries().some((entry) => entry.name === 'link')) {
                            component.openLink();
                            return true;
                        }
                        return false;
                    },
                    'Alt-F10': () => {
                        const buttons = component.toolbarButtons();
                        const button = buttons[component.focusIndex()] ?? buttons[0];
                        if (button) {
                            button.focus();
                            return true;
                        }
                        return false;
                    }
                };
            },
            addProseMirrorPlugins() {
                return [
                    new Plugin({
                        key: new PluginKey('exhaustiveRichTextEditorPlaceholder'),
                        props: {
                            decorations: (state) => {
                                const placeholder = component.placeholder();
                                const { doc } = state;
                                const first = doc.firstChild;
                                if (!placeholder || doc.childCount !== 1 || !first || !first.isTextblock || first.content.size) {
                                    return null;
                                }
                                return DecorationSet.create(doc, [Decoration.node(0, first.nodeSize, { class: 'p-richtexteditor-placeholder', 'data-placeholder': placeholder })]);
                            }
                        }
                    }),
                    new Plugin({
                        key: new PluginKey('exhaustiveRichTextEditorLimit'),
                        filterTransaction: (transaction, state) => {
                            const limit = component.maxLength();
                            if (!limit || !transaction.docChanged || transaction.getMeta('preventUpdate')) {
                                return true;
                            }
                            const size = countOf(transaction.doc);
                            if (size <= limit || size <= countOf(state.doc)) {
                                return true;
                            }
                            if (transaction.getMeta('paste') || transaction.getMeta('uiEvent') === 'paste') {
                                // Cut the end of the pasted content, block boundaries included, until the text fits.
                                const start = transaction.mapping.map(state.selection.from, -1);
                                let extra = 0;
                                for (let guard = 0; guard < 200; guard++) {
                                    const count = countOf(transaction.doc);
                                    if (count <= limit) {
                                        break;
                                    }
                                    const end = transaction.selection.$head.pos;
                                    const from = Math.max(start, end - (count - limit) - extra);
                                    if (from >= end) {
                                        break;
                                    }
                                    transaction.deleteRange(from, end);
                                    extra = countOf(transaction.doc) < count ? 0 : extra + 1;
                                }
                                if (countOf(transaction.doc) <= limit) {
                                    component.limitReached(limit);
                                    return true;
                                }
                            }
                            component.limitReached(limit);
                            return false;
                        }
                    })
                ];
            }
        });

        const initial = this.pendingValue;
        this.lastValue = initial;

        const editor = new Editor({
            element,
            content: initial ?? '',
            editable: !this.controlsDisabled(),
            autofocus: this.autofocus() ? 'end' : false,
            injectCSS: this.$unstyled(),
            injectNonce: this.config?.csp?.()?.nonce,
            extensions: [
                StarterKit.configure({
                    trailingNode: false,
                    link: {
                        openOnClick: false,
                        autolink: true,
                        defaultProtocol: 'https',
                        HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: null }
                    }
                }),
                TextAlign.configure({ types: ['heading', 'paragraph'] }),
                ComponentExtension,
                ...(this.extensions() ?? [])
            ],
            editorProps: {
                attributes: this.editorAttributes()
            },
            onTransaction: () => this.revision.update((value) => value + 1),
            onUpdate: ({ editor: instance }) => {
                const value = this.currentValue(instance);
                this.lastValue = value;
                this.pendingValue = value;
                this.syncState(instance);
                if (!this.maxLength() || this.characters() < this.maxLength()!) {
                    this.limitAnnounced = false;
                }
                this.writeModelValue(value);
                this.onModelChange(value);
                this.onTextChange.emit({
                    htmlValue: instance.isEmpty ? null : instance.getHTML(),
                    textValue: instance.getText(),
                    jsonValue: instance.getJSON(),
                    editor: instance
                });
            },
            onSelectionUpdate: ({ editor: instance }) => {
                const { from, to, empty } = instance.state.selection;
                this.onSelectionChange.emit({ from, to, empty, editor: instance });
            },
            onFocus: ({ editor: instance, event }) => {
                this.focused.set(true);
                this.onFocus.emit({ originalEvent: event, editor: instance });
            },
            onBlur: ({ editor: instance, event }) => {
                this.focused.set(false);
                this.onModelTouched();
                this.onBlur.emit({ originalEvent: event, editor: instance });
            }
        });

        // A value written while Tiptap was loading.
        if (!this.sameAsLast(this.pendingValue)) {
            this.lastValue = this.pendingValue;
            this.replaceContent(editor, this.pendingValue);
        }

        this.editor.set(editor);
        this.syncState(editor);
        this.cd.markForCheck();
        this.onEditorInit.emit({ editor });
    }

    limitReached(limit: number) {
        if (!this.limitAnnounced) {
            this.limitAnnounced = true;
            this.announce(format(this.labelOf('limitReached'), limit));
        }
    }
}

@NgModule({
    imports: [RichTextEditor, SharedModule],
    exports: [RichTextEditor, SharedModule]
})
export class RichTextEditorModule {}
