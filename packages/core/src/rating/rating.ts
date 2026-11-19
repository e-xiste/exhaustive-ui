import { CommonModule } from '@angular/common';
import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, NgModule, numberAttribute, signal, TemplateRef, ViewEncapsulation, contentChild, contentChildren, output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { focus, getFirstFocusableElement, uuid } from '@exhaustive-ui/utils';
import { PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { AutoFocus } from '@exhaustive-ui/core/autofocus';
import { PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseEditableHolder } from '@exhaustive-ui/core/baseeditableholder';
import { Bind } from '@exhaustive-ui/core/bind';
import { BindModule } from '@exhaustive-ui/core/bind';
import { StarFillIcon, StarIcon } from '@exhaustive-ui/core/icons';
import { Nullable } from '@exhaustive-ui/core/ts-helpers';
import { RatingIconTemplateContext, RatingPassThrough } from '@exhaustive-ui/core/types/rating';
import type { RatingRateEvent } from '@exhaustive-ui/core/types/rating';
import { RatingStyle } from './style/ratingstyle';

export const RATING_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Rating),
    multi: true
};
/**
 * Rating is an extension to standard radio button element with theming.
 * @group Components
 */
@Component({
    selector: 'p-rating',
    imports: [CommonModule, AutoFocus, StarFillIcon, StarIcon, SharedModule, BindModule],
    template: `
        @for (star of starsArray(); track star; let i = $index) {
            <div [class]="cx('option', { star, value: value() })" (click)="onOptionClick($event, star + 1)" [pBind]="ptm('option')">
                <span class="p-hidden-accessible" [attr.data-p-hidden-accessible]="true" [pBind]="ptm('hiddenOptionInputContainer')">
                    <input
                        type="radio"
                        [value]="star + 1"
                        [attr.name]="name() || nameattr + '_name'"
                        [attr.value]="modelValue()"
                        [attr.required]="required() ? '' : undefined"
                        [attr.readonly]="readonly() ? '' : undefined"
                        [attr.disabled]="$disabled() ? '' : undefined"
                        [checked]="value() === star + 1"
                        [attr.aria-label]="starAriaLabel(star + 1)"
                        (focus)="onInputFocus($event, star + 1)"
                        (blur)="onInputBlur($event)"
                        (change)="onChange($event, star + 1)"
                        [pAutoFocus]="autofocus()"
                        [pBind]="ptm('hiddenOptionInput')"
                    />
                </span>
                @if (star + 1 <= value()) {
                    @if (onIconTemplate() || _onIconTemplate()) {
                        <ng-container *ngTemplateOutlet="onIconTemplate() || _onIconTemplate(); context: { $implicit: star + 1, class: cx('onIcon') }"></ng-container>
                    } @else {
                        @if (iconOnClass()) {
                            <span [class]="cx('onIcon')" [ngStyle]="iconOnStyle()" [ngClass]="iconOnClass()" [pBind]="ptm('onIcon')"></span>
                        }
                        @if (!iconOnClass()) {
                            <svg data-p-icon="star-fill" [ngStyle]="iconOnStyle()" [class]="cx('onIcon')" [pBind]="ptm('onIcon')" />
                        }
                    }
                } @else {
                    @if (offIconTemplate() || _offIconTemplate()) {
                        <ng-container *ngTemplateOutlet="offIconTemplate() || _offIconTemplate(); context: { $implicit: star + 1, class: cx('offIcon') }"></ng-container>
                    } @else {
                        @if (iconOffClass()) {
                            <span [class]="cx('offIcon')" [ngStyle]="iconOffStyle()" [ngClass]="iconOffClass()" [pBind]="ptm('offIcon')"></span>
                        }
                        @if (!iconOffClass()) {
                            <svg data-p-icon="star" [ngStyle]="iconOffStyle()" [class]="cx('offIcon')" [pBind]="ptm('offIcon')" />
                        }
                    }
                }
            </div>
        }
    `,
    providers: [RATING_VALUE_ACCESSOR, RatingStyle, { provide: PARENT_INSTANCE, useExisting: Rating }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class Rating extends BaseEditableHolder<RatingPassThrough> {
    componentName = 'Rating';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }

    /**
     * When present, changing the value is not possible.
     * @group Props
     */
    readonly readonly = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Number of stars.
     * @group Props
     */
    readonly stars = input<number, unknown>(5, { transform: numberAttribute });
    /**
     * Style class of the on icon.
     * @group Props
     */
    readonly iconOnClass = input<string | undefined>();
    /**
     * Inline style of the on icon.
     * @group Props
     */
    readonly iconOnStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the off icon.
     * @group Props
     */
    readonly iconOffClass = input<string | undefined>();
    /**
     * Inline style of the off icon.
     * @group Props
     */
    readonly iconOffStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Emitted on value change.
     * @param {RatingRateEvent} value - Custom rate event.
     * @group Emits
     */
    readonly onRate = output<RatingRateEvent>();
    /**
     * Emitted when the rating receives focus.
     * @param {Event} value - Browser event.
     * @group Emits
     */
    readonly onFocus = output<FocusEvent>();
    /**
     * Emitted when the rating loses focus.
     * @param {Event} value - Browser event.
     * @group Emits
     */
    readonly onBlur = output<FocusEvent>();
    /**
     * Custom on icon template.
     * @param {RatingIconTemplateContext} context - icon context.
     * @see {@link RatingIconTemplateContext}
     * @group Templates
     */
    readonly onIconTemplate = contentChild<Nullable<TemplateRef<RatingIconTemplateContext>>>('onicon', { descendants: false });
    /**
     * Custom off icon template.
     * @param {RatingIconTemplateContext} context - icon context.
     * @see {@link RatingIconTemplateContext}
     * @group Templates
     */
    readonly offIconTemplate = contentChild<Nullable<TemplateRef<RatingIconTemplateContext>>>('officon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    value = signal<Nullable<number>>(undefined);

    public starsArray = computed<Nullable<number[]>>(() => Array.from({ length: this.stars() }, (_, i) => i));

    isFocusVisibleItem = signal<boolean>(true);

    focusedOptionIndex = signal<number>(-1);

    nameattr = uuid('pn_id_');

    _componentStyle = inject(RatingStyle);

    readonly _onIconTemplate = computed<TemplateRef<RatingIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'onicon')
                .at(-1)?.template
    );

    readonly _offIconTemplate = computed<TemplateRef<RatingIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'officon')
                .at(-1)?.template
    );

    onOptionClick(event, value) {
        if (!this.readonly() && !this.$disabled()) {
            this.onOptionSelect(event, value);
            this.isFocusVisibleItem.set(false);
            const firstFocusableEl = <any>getFirstFocusableElement(event.currentTarget, '');

            firstFocusableEl && focus(firstFocusableEl);
        }
    }

    onOptionSelect(event, value) {
        if (!this.readonly() && !this.$disabled()) {
            if (this.focusedOptionIndex() === value || value === this.value()) {
                this.focusedOptionIndex.set(-1);
                this.updateModel(event, null);
            } else {
                this.focusedOptionIndex.set(value);
                this.updateModel(event, value || null);
            }
        }
    }

    onChange(event, value) {
        this.onOptionSelect(event, value);
        this.isFocusVisibleItem.set(true);
    }

    onInputBlur(event) {
        this.focusedOptionIndex.set(-1);
        this.onBlur.emit(event);
    }

    onInputFocus(event, value) {
        if (!this.readonly() && !this.$disabled()) {
            this.focusedOptionIndex.set(value);
            this.isFocusVisibleItem.set(event.sourceCapabilities?.firesTouchEvents === false);

            this.onFocus.emit(event);
        }
    }

    updateModel(event, value) {
        this.writeValue(value);
        this.onModelChange(this.value());
        this.onModelTouched();

        this.onRate.emit({
            originalEvent: event,
            value
        });
    }

    starAriaLabel(value) {
        return value === 1 ? this.config.translation.aria?.star : this.config.translation.aria?.stars?.replace(/{star}/g, value);
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        this.value.set(value);
        setModelValue(value);
    }

    readonly dataP = computed(() =>
        this.cn({
            readonly: this.readonly(),
            disabled: this.$disabled()
        })
    );
}

@NgModule({
    imports: [Rating, SharedModule],
    exports: [Rating, SharedModule]
})
export class RatingModule {}
