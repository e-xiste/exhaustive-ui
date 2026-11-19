import { CommonModule } from '@angular/common';
import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, NgModule, numberAttribute, signal, TemplateRef, ViewEncapsulation, contentChild, contentChildren, output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { equals, resolveFieldData } from '@exhaustive-ui/utils';
import { PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseEditableHolder } from '@exhaustive-ui/core/baseeditableholder';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { ToggleButton } from '@exhaustive-ui/core/togglebutton';
import { SelectButtonChangeEvent, SelectButtonItemTemplateContext, SelectButtonOptionClickEvent, SelectButtonPassThrough } from '@exhaustive-ui/core/types/selectbutton';
import { SelectButtonStyle } from './style/selectbuttonstyle';

export const SELECTBUTTON_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectButton),
    multi: true
};
/**
 * SelectButton is used to choose single or multiple items from a list using buttons.
 * @group Components
 */
@Component({
    selector: 'p-selectButton, p-selectbutton, p-select-button',
    imports: [ToggleButton, FormsModule, CommonModule, SharedModule, BindModule],
    template: `
        @for (option of options(); track getOptionLabel(option); let i = $index) {
            <p-togglebutton
                [autofocus]="autofocus()"
                [class]="styleClass()"
                [ngModel]="isSelected(option)"
                [ngModelOptions]="{ standalone: true }"
                [onLabel]="this.getOptionLabel(option)"
                [offLabel]="this.getOptionLabel(option)"
                [disabled]="$disabled() || isOptionDisabled(option)"
                (onChange)="onOptionSelect($event, option, i)"
                [allowEmpty]="getAllowEmpty()"
                [size]="size()"
                [fluid]="fluid()"
                [pt]="ptm('pcToggleButton')"
                [unstyled]="unstyled()"
            >
                @if (itemTemplate() || _itemTemplate()) {
                    <ng-template #content>
                        <ng-container *ngTemplateOutlet="itemTemplate() || _itemTemplate(); context: { $implicit: option, index: i }"></ng-container>
                    </ng-template>
                }
            </p-togglebutton>
        }
    `,
    providers: [SELECTBUTTON_VALUE_ACCESSOR, SelectButtonStyle, { provide: PARENT_INSTANCE, useExisting: SelectButton }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[attr.role]': '"group"',
        '[attr.aria-labelledby]': 'ariaLabelledBy()',
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class SelectButton extends BaseEditableHolder<SelectButtonPassThrough> {
    componentName = 'SelectButton';
    /**
     * An array of selectitems to display as the available options.
     * @group Props
     */
    readonly options = input<any[] | undefined>();
    /**
     * Name of the label field of an option.
     * @group Props
     */
    readonly optionLabel = input<string | undefined>();
    /**
     * Name of the value field of an option.
     * @group Props
     */
    readonly optionValue = input<string | undefined>();
    /**
     * Name of the disabled field of an option.
     * @group Props
     */
    readonly optionDisabled = input<string | undefined>();
    /**
     * Whether selection can be cleared.
     * @group Props
     */
    readonly unselectable = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * When specified, allows selecting multiple values.
     * @group Props
     */
    readonly multiple = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether selection can not be cleared.
     * @group Props
     */
    readonly allowEmpty = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Style class of the component.
     * @group Props
     */
    readonly styleClass = input<string | undefined>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string | undefined>();
    /**
     * A property to uniquely identify a value in options.
     * @group Props
     */
    readonly dataKey = input<string | undefined>();
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Specifies the size of the component.
     * @defaultValue undefined
     * @group Props
     */
    size = input<'large' | 'small' | undefined>();
    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });
    /**
     * Callback to invoke on input click.
     * @param {SelectButtonOptionClickEvent} event - Custom click event.
     * @group Emits
     */
    readonly onOptionClick = output<SelectButtonOptionClickEvent>();
    /**
     * Callback to invoke on selection change.
     * @param {SelectButtonChangeEvent} event - Custom change event.
     * @group Emits
     */
    readonly onChange = output<SelectButtonChangeEvent>();
    /**
     * Custom item template.
     * @param {SelectButtonItemTemplateContext} context - item context.
     * @see {@link SelectButtonItemTemplateContext}
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<SelectButtonItemTemplateContext>>('item', { descendants: false });

    readonly _itemTemplate = computed<TemplateRef<SelectButtonItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'item')
                .at(-1)?.template
    );

    readonly equalityKey = computed(() => (this.optionValue() ? null : this.dataKey()));

    value = signal<any>(undefined);

    focusedIndex = signal<number>(0);

    _componentStyle = inject(SelectButtonStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }

    readonly getAllowEmpty = computed(() => {
        const allowEmpty = this.unselectable() ? false : this.allowEmpty();
        if (this.multiple()) {
            return allowEmpty || this.value()?.length !== 1;
        }
        return allowEmpty;
    });

    getOptionLabel(option: any) {
        return this.optionLabel() ? resolveFieldData(option, this.optionLabel()) : option.label != undefined ? option.label : option;
    }

    getOptionValue(option: any) {
        return this.optionValue() ? resolveFieldData(option, this.optionValue()) : this.optionLabel() || option.value === undefined ? option : option.value;
    }

    isOptionDisabled(option: any) {
        return this.optionDisabled() ? resolveFieldData(option, this.optionDisabled()) : option.disabled !== undefined ? option.disabled : false;
    }

    onOptionSelect(event, option, index) {
        if (this.$disabled() || this.isOptionDisabled(option)) {
            return;
        }

        let selected = this.isSelected(option);

        if (selected && this.unselectable()) {
            return;
        }

        let optionValue = this.getOptionValue(option);
        let newValue;

        if (this.multiple()) {
            if (selected) newValue = this.value().filter((val) => !equals(val, optionValue, this.equalityKey() || undefined));
            else newValue = this.value() ? [...this.value(), optionValue] : [optionValue];
        } else {
            if (selected && !this.allowEmpty()) {
                return;
            }
            newValue = selected ? null : optionValue;
        }

        this.focusedIndex.set(index);
        this.value.set(newValue);
        this.writeModelValue(this.value());
        this.onModelChange(this.value());

        this.onChange.emit({
            originalEvent: event,
            value: this.value()
        });

        this.onOptionClick.emit({
            originalEvent: event,
            option: option,
            index: index
        });
    }

    changeTabIndexes(event, direction) {
        let firstTabableChild, index;

        for (let i = 0; i <= this.el.nativeElement.children.length - 1; i++) {
            if (this.el.nativeElement.children[i].getAttribute('tabindex') === '0') firstTabableChild = { elem: this.el.nativeElement.children[i], index: i };
        }

        if (direction === 'prev') {
            if (firstTabableChild.index === 0) index = this.el.nativeElement.children.length - 1;
            else index = firstTabableChild.index - 1;
        } else {
            if (firstTabableChild.index === this.el.nativeElement.children.length - 1) index = 0;
            else index = firstTabableChild.index + 1;
        }

        this.focusedIndex.set(index);
        this.el.nativeElement.children[index].focus();
    }

    onFocus(event: Event, index: number) {
        this.focusedIndex.set(index);
    }

    onBlur() {
        this.onModelTouched();
    }

    removeOption(option: any): void {
        this.value.set(this.value().filter((val: any) => !equals(val, this.getOptionValue(option), this.dataKey())));
    }

    isSelected(option: any) {
        let selected = false;
        const optionValue = this.getOptionValue(option);

        if (this.multiple()) {
            if (this.value() && Array.isArray(this.value())) {
                for (let val of this.value()) {
                    if (equals(val, optionValue, this.dataKey())) {
                        selected = true;
                        break;
                    }
                }
            }
        } else {
            selected = equals(this.getOptionValue(option), this.value(), this.equalityKey() || undefined);
        }

        return selected;
    }

    readonly templates = contentChildren(PrimeTemplate);

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        this.value.set(value);
        setModelValue(this.value());
    }

    readonly dataP = computed(() =>
        this.cn({
            invalid: this.invalid()
        })
    );
}

@NgModule({
    imports: [SelectButton, SharedModule],
    exports: [SelectButton, SharedModule]
})
export class SelectButtonModule {}
