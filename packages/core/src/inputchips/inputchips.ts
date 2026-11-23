import { NgTemplateOutlet } from '@angular/common';
import {
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    ElementRef,
    forwardRef,
    inject,
    input,
    NgModule,
    numberAttribute,
    output,
    signal,
    TemplateRef,
    viewChild,
    viewChildren,
    ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SharedModule } from '@exhaustive-ui/core/api';
import { PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseEditableHolder } from '@exhaustive-ui/core/baseeditableholder';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { Chip } from '@exhaustive-ui/core/chip';
import { Fluid } from '@exhaustive-ui/core/fluid';
import { TimesCircleIcon } from '@exhaustive-ui/core/icons';
import type {
    InputChipsAddEvent,
    InputChipsChipClickEvent,
    InputChipsChipTemplateContext,
    InputChipsLabels,
    InputChipsPassThrough,
    InputChipsRejectEvent,
    InputChipsRejectReason,
    InputChipsRemoveEvent,
    InputChipsRemoveIconTemplateContext,
    InputChipsTransform,
    InputChipsValidate
} from '@exhaustive-ui/core/types/inputchips';
import { uuid } from '@exhaustive-ui/utils';
import { InputChipsStyle } from './style/inputchipsstyle';

export const INPUTCHIPS_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputChips),
    multi: true
};

/**
 * Default texts of InputChips.
 * @group Constants
 */
export const INPUTCHIPS_DEFAULT_LABELS: InputChipsLabels = {
    listLabel: 'Values',
    removeHint: 'Press Delete or Backspace to remove',
    addedMessage: '{0} added',
    addedManyMessage: '{0} values added',
    removedMessage: '{0} removed',
    duplicateMessage: '{0} is already in the list',
    maxMessage: 'Maximum of {0} reached',
    maxChipLengthMessage: 'Too long, {0} characters maximum',
    invalidMessage: '{0} is not valid'
};

const format = (text: string, ...values: (string | number)[]) => values.reduce<string>((acc, value, index) => acc.replace(`{${index}}`, String(value)), text);

/**
 * Signal Forms set the constraint inputs to null when the field has no such rule.
 */
const toLimit = (value: unknown): number | undefined => {
    if (value === null || value === undefined || value === '') {
        return undefined;
    }
    const limit = numberAttribute(value, NaN);
    return isNaN(limit) ? undefined : limit;
};

/**
 * InputChips enters several free-text values, such as tags or email addresses, each shown as a removable chip. It works with template-driven forms, reactive forms and Signal Forms.
 * @group Components
 */
@Component({
    selector: 'p-inputchips, p-input-chips',
    standalone: true,
    imports: [NgTemplateOutlet, SharedModule, BindModule, Chip, TimesCircleIcon],
    template: `
        <div [class]="cx('container')" (click)="onContainerClick($event)" [pBind]="ptm('container')">
            @if (chips().length) {
                <ul
                    [class]="cx('list')"
                    role="listbox"
                    aria-orientation="horizontal"
                    aria-multiselectable="true"
                    [attr.aria-label]="ariaLabelledBy() ? undefined : ariaLabel() || labelOf('listLabel')"
                    [attr.aria-labelledby]="ariaLabelledBy()"
                    [attr.aria-describedby]="removable() ? hintId : undefined"
                    [attr.aria-disabled]="$disabled() || undefined"
                    [pBind]="ptm('list')"
                >
                    @for (chip of chips(); track $index; let i = $index) {
                        <li
                            #chipItem
                            [class]="cx('chipItem', { index: i })"
                            [attr.id]="chipId(i)"
                            role="option"
                            aria-selected="true"
                            [attr.aria-setsize]="chips().length"
                            [attr.aria-posinset]="i + 1"
                            [attr.tabindex]="$disabled() ? undefined : -1"
                            (focus)="onChipFocus(i)"
                            (blur)="onChipBlur(i)"
                            (keydown)="onChipKeydown($event, i)"
                            (click)="onChipClickEvent($event, i)"
                            [pBind]="ptm('chipItem')"
                        >
                            @if (chipTemplate()) {
                                <ng-container *ngTemplateOutlet="chipTemplate()!; context: chipContext(chip, i)" />
                            } @else {
                                <p-chip [class]="cx('pcChip')" [pt]="ptm('pcChip')" [unstyled]="unstyled()">
                                    <span [class]="cx('chipLabel')" [pBind]="ptm('chipLabel')">{{ chip }}</span>
                                    @if (removable()) {
                                        <span [class]="cx('chipIcon')" aria-hidden="true" (mousedown)="$event.preventDefault()" (click)="onRemoveClick($event, i)" [pBind]="ptm('chipIcon')">
                                            @if (removeIconTemplate()) {
                                                <ng-container *ngTemplateOutlet="removeIconTemplate()!; context: removeIconContext(chip, i)" />
                                            } @else {
                                                <svg data-p-icon="times-circle" />
                                            }
                                        </span>
                                    }
                                </p-chip>
                            }
                        </li>
                    }
                </ul>
            }
            <input
                #input
                type="text"
                [class]="cx('input')"
                [attr.id]="inputId()"
                [attr.placeholder]="chips().length ? undefined : placeholder()"
                [attr.tabindex]="tabindex()"
                [disabled]="$disabled()"
                [readOnly]="readonly()"
                autocomplete="off"
                [attr.aria-label]="ariaLabel()"
                [attr.aria-labelledby]="ariaLabelledBy()"
                [attr.aria-invalid]="$invalid() || undefined"
                [attr.aria-required]="required() || undefined"
                (input)="onInput($event)"
                (keydown)="onInputKeydown($event)"
                (paste)="onPaste($event)"
                [pBind]="ptm('input')"
            />
        </div>
        @if (chips().length && removable()) {
            <span class="p-hidden-accessible" [attr.id]="hintId">{{ labelOf('removeHint') }}</span>
        }
        <span class="p-hidden-accessible" aria-live="polite" aria-atomic="true">{{ announcement() }}</span>
    `,
    providers: [INPUTCHIPS_VALUE_ACCESSOR, InputChipsStyle, { provide: PARENT_INSTANCE, useExisting: InputChips }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP()',
        '(focusin)': 'onFocusIn($event)',
        '(focusout)': 'onFocusOut($event)'
    },
    hostDirectives: [Bind]
})
export class InputChips extends BaseEditableHolder<InputChipsPassThrough> {
    componentName = 'InputChips';

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(InputChipsStyle);

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
    }

    /******************** Inputs ********************/

    /**
     * Splits typed and pasted text into several chips, for example `,` or `/[,;]/`. Enter always adds a chip. Use a RegExp without capture groups.
     * @group Props
     */
    readonly separator = input<string | RegExp | undefined>();
    /**
     * Whether the text left in the input becomes a chip when the component loses the focus.
     * @defaultValue false
     * @group Props
     */
    readonly addOnBlur = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the Tab key turns the text in the input into a chip before moving the focus.
     * @defaultValue false
     * @group Props
     */
    readonly addOnTab = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the same value can be added more than once.
     * @defaultValue false
     * @group Props
     */
    readonly allowDuplicate = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Maximum number of chips. Further values are not added and the limit is announced.
     * @group Props
     */
    readonly max = input<number | undefined, unknown>(undefined, { transform: toLimit });
    /**
     * Maximum number of characters of a chip.
     * @group Props
     */
    readonly maxChipLength = input<number | undefined, unknown>(undefined, { transform: toLimit });
    /**
     * Turns each value into the text of its chip, after trimming, for example to lowercase it. Returning an empty value drops it.
     * @group Props
     */
    readonly transform = input<InputChipsTransform | undefined>();
    /**
     * Tells whether a value can be added. A rejected value emits onReject and stays in the input.
     * @group Props
     */
    readonly validate = input<InputChipsValidate | undefined>();
    /**
     * Placeholder of the input, shown while there is no chip.
     * @group Props
     */
    readonly placeholder = input<string | undefined>();
    /**
     * When present, the chips can be read but not added or removed.
     * @defaultValue false
     * @group Props
     */
    readonly readonly = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue false
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
     * Specifies the size of the component.
     * @group Props
     */
    readonly size = input<'large' | 'small' | undefined>();
    /**
     * Identifier of the text input, for a label element.
     * @group Props
     */
    readonly inputId = input<string | undefined>();
    /**
     * Index of the text input in the tab order.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(undefined, { transform: toLimit });
    /**
     * Accessible label of the input and of the list of chips.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();
    /**
     * Identifier of the element that labels the input and the list of chips.
     * @group Props
     */
    readonly ariaLabelledBy = input<string | undefined>();
    /**
     * Texts of the component, merged with the English defaults.
     * @group Props
     */
    readonly labels = input<Partial<InputChipsLabels> | undefined>();

    /******************** Outputs ********************/

    /**
     * Callback to invoke when a chip is added, once per chip.
     * @param {InputChipsAddEvent} event - Custom add event.
     * @group Emits
     */
    readonly onAdd = output<InputChipsAddEvent>();
    /**
     * Callback to invoke when a chip is removed.
     * @param {InputChipsRemoveEvent} event - Custom remove event.
     * @group Emits
     */
    readonly onRemove = output<InputChipsRemoveEvent>();
    /**
     * Callback to invoke when a value is not added: duplicate, maximum reached, too long or rejected by validate.
     * @param {InputChipsRejectEvent} event - Custom reject event.
     * @group Emits
     */
    readonly onReject = output<InputChipsRejectEvent>();
    /**
     * Callback to invoke when a chip is clicked, or Enter is pressed on it.
     * @param {InputChipsChipClickEvent} event - Custom chip click event.
     * @group Emits
     */
    readonly onChipClick = output<InputChipsChipClickEvent>();
    /**
     * Callback to invoke when the component receives the focus.
     * @param {FocusEvent} event - Browser event.
     * @group Emits
     */
    readonly onFocus = output<FocusEvent>();
    /**
     * Callback to invoke when the component loses the focus.
     * @param {FocusEvent} event - Browser event.
     * @group Emits
     */
    readonly onBlur = output<FocusEvent>();

    /******************** Templates ********************/

    /**
     * Custom content of a chip.
     * @param {InputChipsChipTemplateContext} context - chip context.
     * @group Templates
     */
    readonly chipTemplate = contentChild<TemplateRef<InputChipsChipTemplateContext>>('chip', { descendants: false });
    /**
     * Custom remove icon of a chip.
     * @param {InputChipsRemoveIconTemplateContext} context - remove icon context.
     * @group Templates
     */
    readonly removeIconTemplate = contentChild<TemplateRef<InputChipsRemoveIconTemplateContext>>('removeicon', { descendants: false });

    readonly inputViewChild = viewChild<ElementRef<HTMLInputElement>>('input');

    readonly chipItems = viewChildren<ElementRef<HTMLLIElement>>('chipItem');

    /******************** State ********************/

    readonly focused = signal(false);

    readonly focusedIndex = signal(-1);

    readonly inputValue = signal('');

    readonly announcement = signal('');

    readonly uid = uuid('pn_id_');

    readonly hintId = `${this.uid}_hint`;

    readonly chips = computed<string[]>(() => {
        const value = this.modelValue();
        return Array.isArray(value) ? value : [];
    });

    readonly $invalid = computed(() => !!this.invalid());

    readonly $variant = computed(() => this.variant() || this.config.inputVariant());

    readonly removable = computed(() => !this.$disabled() && !this.readonly());

    readonly mergedLabels = computed<InputChipsLabels>(() => ({ ...INPUTCHIPS_DEFAULT_LABELS, ...(this.labels() ?? {}) }));

    readonly dataP = computed(() =>
        this.cn({
            invalid: this.$invalid(),
            disabled: this.$disabled(),
            focus: this.focused(),
            filled: this.$filled(),
            fluid: this.hasFluid,
            [this.size() as string]: !!this.size()
        })
    );

    get hasFluid() {
        return this.fluid() ?? !!this.pcFluid;
    }

    /******************** Public methods ********************/

    /**
     * Adds values as if the user had typed them. They go through the same trimming, transform and validation.
     * @param {string | string[]} values - Value or values to add.
     * @group Method
     */
    add(values: string | string[], event?: Event) {
        this.addValues(Array.isArray(values) ? values : [values], event);
    }

    /**
     * Removes the chip at an index.
     * @param {number} index - Index of the chip.
     * @group Method
     */
    remove(index: number, event?: Event) {
        const values = this.chips();
        if (!this.removable() || index < 0 || index >= values.length) {
            return;
        }
        const value = values[index];
        this.updateValue(values.filter((_, i) => i !== index));
        this.onRemove.emit({ originalEvent: event, value, index });
        this.announce(format(this.labelOf('removedMessage'), value));
    }

    /**
     * Removes all the chips.
     * @group Method
     */
    clear() {
        if (!this.removable() || !this.chips().length) {
            return;
        }
        this.updateValue([]);
    }

    /**
     * Moves the focus to the text input.
     * @group Method
     */
    focus() {
        this.inputViewChild()?.nativeElement.focus();
    }

    /******************** Template helpers ********************/

    labelOf(key: keyof InputChipsLabels): string {
        return this.mergedLabels()[key];
    }

    chipId(index: number): string {
        return `${this.uid}_chip_${index}`;
    }

    chipContext(value: string, index: number): InputChipsChipTemplateContext {
        return {
            $implicit: value,
            index,
            focused: this.focusedIndex() === index,
            removable: this.removable(),
            remove: (event?: Event) => this.removeAndRefocus(index, event)
        };
    }

    removeIconContext(value: string, index: number): InputChipsRemoveIconTemplateContext {
        return { $implicit: value, index, class: this.cx('chipIcon') ?? '' };
    }

    /******************** Event handlers ********************/

    onFocusIn(event: FocusEvent) {
        if (!this.focused()) {
            this.focused.set(true);
            this.onFocus.emit(event);
        }
    }

    onFocusOut(event: FocusEvent) {
        const next = event.relatedTarget as Node | null;
        if (next && (this.el.nativeElement as HTMLElement).contains(next)) {
            return;
        }
        this.focused.set(false);
        if (this.addOnBlur()) {
            this.commit(event);
        }
        this.onModelTouched();
        this.onBlur.emit(event);
    }

    onContainerClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (this.$disabled() || target.closest('li')) {
            return;
        }
        this.focus();
    }

    onInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const separator = this.separator();
        if (separator) {
            const parts = input.value.split(separator).filter((part) => part !== undefined);
            if (parts.length > 1) {
                const tail = parts.pop() ?? '';
                const kept = this.addValues(parts, event);
                input.value = kept && !tail ? kept : tail;
            }
        }
        this.inputValue.set(input.value);
    }

    onInputKeydown(event: KeyboardEvent) {
        if (event.isComposing) {
            return;
        }
        const input = event.target as HTMLInputElement;
        const atStart = input.selectionStart === 0 && input.selectionEnd === 0;
        const count = this.chips().length;
        switch (event.key) {
            case 'Enter':
                if (input.value.trim()) {
                    event.preventDefault();
                    this.commit(event);
                }
                break;
            case 'Tab':
                if (this.addOnTab() && !event.shiftKey && input.value.trim()) {
                    this.commit(event);
                }
                break;
            case 'Backspace':
                if (!input.value && count) {
                    event.preventDefault();
                    this.focusChip(count - 1);
                }
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
                if (atStart && count && event.key === (this.isRtl() ? 'ArrowRight' : 'ArrowLeft')) {
                    event.preventDefault();
                    this.focusChip(count - 1);
                }
                break;
        }
    }

    onPaste(event: ClipboardEvent) {
        const text = event.clipboardData?.getData('text') ?? '';
        const separator = this.separator();
        const lines = text.split(/\r?\n/);
        const parts = separator ? lines.flatMap((line) => line.split(separator)) : lines;
        if (parts.filter((part) => part && part.trim()).length < 2 || this.readonly() || this.$disabled()) {
            return;
        }
        event.preventDefault();
        const input = event.target as HTMLInputElement;
        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? input.value.length;
        const before = input.value.slice(0, start);
        const after = input.value.slice(end);
        parts[0] = before + parts[0];
        parts[parts.length - 1] = parts[parts.length - 1] + after;
        this.addValues(parts, event);
        input.value = '';
        this.inputValue.set('');
    }

    onChipFocus(index: number) {
        this.focusedIndex.set(index);
    }

    onChipBlur(index: number) {
        if (this.focusedIndex() === index) {
            this.focusedIndex.set(-1);
        }
    }

    onChipKeydown(event: KeyboardEvent, index: number) {
        const count = this.chips().length;
        const rtl = this.isRtl();
        const previous = rtl ? 'ArrowRight' : 'ArrowLeft';
        const next = rtl ? 'ArrowLeft' : 'ArrowRight';
        switch (event.key) {
            case previous:
                event.preventDefault();
                this.focusChip(Math.max(index - 1, 0));
                break;
            case next:
                event.preventDefault();
                if (index < count - 1) {
                    this.focusChip(index + 1);
                } else {
                    this.focus();
                }
                break;
            case 'Home':
                event.preventDefault();
                this.focusChip(0);
                break;
            case 'End':
                event.preventDefault();
                this.focusChip(count - 1);
                break;
            case 'Backspace':
            case 'Delete':
                event.preventDefault();
                if (this.removable()) {
                    this.removeAndRefocus(index, event, event.key === 'Backspace' ? 'previous' : 'next');
                }
                break;
            case 'Escape':
                event.preventDefault();
                this.focus();
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                this.onChipClick.emit({ originalEvent: event, value: this.chips()[index], index });
                break;
            default:
                if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && !this.readonly()) {
                    // The character is typed in the input, which gets the focus before the key is processed.
                    this.focus();
                }
        }
    }

    onChipClickEvent(event: MouseEvent, index: number) {
        if (this.$disabled()) {
            return;
        }
        this.onChipClick.emit({ originalEvent: event, value: this.chips()[index], index });
    }

    onRemoveClick(event: MouseEvent, index: number) {
        event.stopPropagation();
        if (!this.removable()) {
            return;
        }
        this.remove(index, event);
        this.focus();
    }

    /******************** Forms ********************/

    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        setModelValue(Array.isArray(value) ? [...value] : []);
    }

    /******************** Internals ********************/

    /**
     * Removes a chip and moves the focus to a chip that stays, before the list is rendered again, so that the focus never leaves the component.
     */
    private removeAndRefocus(index: number, event?: Event, direction: 'previous' | 'next' = 'next') {
        const count = this.chips().length;
        if (!this.removable() || index < 0 || index >= count) {
            return;
        }
        const remaining = count - 1;
        if (!remaining) {
            this.focus();
        } else {
            // The list tracks the chips by index: the items up to remaining - 1 stay and show the next chips.
            const target = direction === 'previous' ? Math.max(index - 1, 0) : index;
            if (target < remaining) {
                this.focusChip(target);
            } else {
                this.focusChip(remaining - 1);
            }
        }
        this.remove(index, event);
    }

    private commit(event?: Event) {
        const input = this.inputViewChild()?.nativeElement;
        if (!input || !input.value.trim()) {
            return;
        }
        const separator = this.separator();
        const kept = this.addValues(separator ? input.value.split(separator) : [input.value], event);
        input.value = kept;
        this.inputValue.set(kept);
    }

    /**
     * Adds the values that pass the rules and returns the text to keep in the input: the value itself when a single value was rejected.
     */
    private addValues(raw: string[], event?: Event): string {
        if (this.$disabled() || this.readonly()) {
            return '';
        }
        const values = [...this.chips()];
        const added: { value: string; index: number }[] = [];
        let rejected: { value: string; reason: InputChipsRejectReason } | undefined;
        let rejectedCount = 0;

        for (const part of raw) {
            const trimmed = (part ?? '').trim();
            if (!trimmed) {
                continue;
            }
            const transform = this.transform();
            const value = (transform ? transform(trimmed) : trimmed)?.trim() ?? '';
            const reason = this.check(value, values);
            if (reason) {
                rejectedCount++;
                rejected = { value: value || trimmed, reason };
                this.onReject.emit({ originalEvent: event, value: value || trimmed, reason });
                continue;
            }
            values.push(value);
            added.push({ value, index: values.length - 1 });
        }

        if (added.length) {
            this.updateValue(values);
            added.forEach(({ value, index }) => this.onAdd.emit({ originalEvent: event, value, index }));
        }

        const messages: string[] = [];
        if (added.length === 1) {
            messages.push(format(this.labelOf('addedMessage'), added[0].value));
        } else if (added.length > 1) {
            messages.push(format(this.labelOf('addedManyMessage'), added.length));
        }
        const rejectMessage = rejected ? this.rejectMessage(rejected.value, rejected.reason) : '';
        if (rejectMessage) {
            messages.push(rejectMessage);
        } else if (!rejected && added.length && this.max() !== undefined && values.length >= this.max()!) {
            messages.push(format(this.labelOf('maxMessage'), this.max()!));
        }
        if (messages.length) {
            this.announce(messages.join('. '));
        }

        const nonEmpty = raw.filter((part) => part && part.trim());
        return nonEmpty.length === 1 && rejectedCount === 1 && rejected?.reason !== 'empty' ? nonEmpty[0].trim() : '';
    }

    private check(value: string, values: readonly string[]): InputChipsRejectReason | undefined {
        if (!value) return 'empty';
        const max = this.max();
        if (max !== undefined && values.length >= max) return 'max';
        const maxChipLength = this.maxChipLength();
        if (maxChipLength !== undefined && value.length > maxChipLength) return 'maxChipLength';
        if (!this.allowDuplicate() && values.includes(value)) return 'duplicate';
        const validate = this.validate();
        if (validate && !validate(value, values)) return 'invalid';
        return undefined;
    }

    private rejectMessage(value: string, reason: InputChipsRejectReason): string {
        switch (reason) {
            case 'max':
                return format(this.labelOf('maxMessage'), this.max()!);
            case 'maxChipLength':
                return format(this.labelOf('maxChipLengthMessage'), this.maxChipLength()!);
            case 'duplicate':
                return format(this.labelOf('duplicateMessage'), value);
            case 'invalid':
                return format(this.labelOf('invalidMessage'), value);
            default:
                return '';
        }
    }

    private updateValue(values: string[]) {
        this.writeModelValue(values);
        this.onModelChange(values);
    }

    private focusChip(index: number) {
        const item = this.chipItems()[index];
        if (item) {
            item.nativeElement.focus();
        } else if (index >= 0 && index < this.chips().length) {
            // A chip added by the previous key is not rendered yet.
            afterNextRender(() => this.chipItems()[index]?.nativeElement.focus(), { injector: this.injector });
        }
    }

    private isRtl(): boolean {
        const view = this.document.defaultView;
        return !!view && view.getComputedStyle(this.el.nativeElement).direction === 'rtl';
    }

    private announce(message: string) {
        // A repeated message is changed slightly so that screen readers read it again.
        this.announcement.set(message === this.announcement() ? message + ' ' : message);
    }
}

@NgModule({
    imports: [InputChips, SharedModule],
    exports: [InputChips, SharedModule]
})
export class InputChipsModule {}
