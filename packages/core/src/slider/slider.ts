import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    forwardRef,
    HostListener,
    inject,
    InjectionToken,
    input,
    NgModule,
    NgZone,
    numberAttribute,
    signal,
    untracked,
    ViewEncapsulation,
    viewChild,
    output
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { addClass, getWindowScrollLeft, getWindowScrollTop, isRTL, removeClass } from '@exhaustive-ui/utils';
import { SharedModule } from '@exhaustive-ui/core/api';
import { AutoFocus } from '@exhaustive-ui/core/autofocus';
import { PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseEditableHolder } from '@exhaustive-ui/core/baseeditableholder';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { Nullable, VoidListener } from '@exhaustive-ui/core/ts-helpers';
import type { SliderChangeEvent, SliderSlideEndEvent } from '@exhaustive-ui/core/types/slider';
import { SliderPassThrough } from '@exhaustive-ui/core/types/slider';
import { SliderStyle } from './style/sliderstyle';

const SLIDER_INSTANCE = new InjectionToken<Slider>('SLIDER_INSTANCE');

export const SLIDER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Slider),
    multi: true
};
/**
 * Slider is a component to provide input with a drag handle.
 * @group Components
 */
@Component({
    selector: 'p-slider',
    imports: [CommonModule, AutoFocus, SharedModule, BindModule],
    template: `
        @if (range() && orientation() == 'horizontal') {
            <span
                [class]="cx('range')"
                [ngStyle]="{
                    'inset-inline-start': offset() !== null && offset() !== undefined ? offset() + '%' : handleValues()[0] + '%',
                    width: diff() ? diff() + '%' : handleValues()[1] - handleValues()[0] + '%'
                }"
                [style]="sx('range')"
                [attr.data-pc-section]="'range'"
                [attr.data-p]="dataP()"
                [pBind]="ptm('range')"
            ></span>
        }
        @if (range() && orientation() == 'vertical') {
            <span
                [class]="cx('range')"
                [ngStyle]="{
                    bottom: offset() !== null && offset() !== undefined ? offset() + '%' : handleValues()[0] + '%',
                    height: diff() ? diff() + '%' : handleValues()[1] - handleValues()[0] + '%'
                }"
                [style]="sx('range')"
                [attr.data-pc-section]="'range'"
                [attr.data-p]="dataP()"
                [pBind]="ptm('range')"
            ></span>
        }
        @if (!range() && orientation() == 'vertical') {
            <span [class]="cx('range')" [attr.data-pc-section]="'range'" [style]="sx('range')" [ngStyle]="{ height: handleValue() + '%' }" [pBind]="ptm('range')"></span>
        }
        @if (!range() && orientation() == 'horizontal') {
            <span [class]="cx('range')" [attr.data-pc-section]="'range'" [style]="sx('range')" [ngStyle]="{ width: handleValue() + '%' }" [pBind]="ptm('range')"></span>
        }
        @if (!range()) {
            <span
                #sliderHandle
                [class]="cx('handle')"
                [style.transition]="dragging() ? 'none' : null"
                [ngStyle]="{
                    'inset-inline-start': orientation() == 'horizontal' ? handleValue() + '%' : null,
                    bottom: orientation() == 'vertical' ? handleValue() + '%' : null
                }"
                [style]="sx('handle')"
                (touchstart)="onDragStart($event)"
                (touchmove)="onDrag($event)"
                (touchend)="onDragEnd($event)"
                (mousedown)="onMouseDown($event)"
                (keydown)="onKeyDown($event)"
                [attr.tabindex]="$disabled() ? null : tabindex()"
                role="slider"
                [attr.aria-valuemin]="min()"
                [attr.aria-valuenow]="value()"
                [attr.aria-valuemax]="max()"
                [attr.aria-labelledby]="ariaLabelledBy()"
                [attr.aria-label]="ariaLabel()"
                [attr.aria-orientation]="orientation()"
                [attr.data-pc-section]="'handle'"
                [pAutoFocus]="autofocus()"
                [pBind]="ptm('handle')"
                [attr.data-p]="dataP()"
            ></span>
        }
        @if (range()) {
            <span
                #sliderHandleStart
                [style.transition]="dragging() ? 'none' : null"
                [class]="cn(cx('handle'), handleIndex() == 0 && 'p-slider-handle-active')"
                [style]="sx('handle')"
                [ngStyle]="{ 'inset-inline-start': rangeStartLeft(), bottom: rangeStartBottom() }"
                (keydown)="onKeyDown($event, 0)"
                (mousedown)="onMouseDown($event, 0)"
                (touchstart)="onDragStart($event, 0)"
                (touchmove)="onDrag($event)"
                (touchend)="onDragEnd($event)"
                [attr.tabindex]="$disabled() ? null : tabindex()"
                role="slider"
                [attr.aria-valuemin]="min()"
                [attr.aria-valuenow]="value() ? value()[0] : null"
                [attr.aria-valuemax]="max()"
                [attr.aria-labelledby]="ariaLabelledBy()"
                [attr.aria-label]="ariaLabel()"
                [attr.aria-orientation]="orientation()"
                [attr.data-pc-section]="'startHandler'"
                [pAutoFocus]="autofocus()"
                [pBind]="ptm('startHandler')"
                [attr.data-p]="dataP()"
            ></span>
        }
        @if (range()) {
            <span
                #sliderHandleEnd
                [style.transition]="dragging() ? 'none' : null"
                [class]="cn(cx('handle'), handleIndex() == 1 && 'p-slider-handle-active')"
                [ngStyle]="{ 'inset-inline-start': rangeEndLeft(), bottom: rangeEndBottom() }"
                [style]="sx('handle')"
                (keydown)="onKeyDown($event, 1)"
                (mousedown)="onMouseDown($event, 1)"
                (touchstart)="onDragStart($event, 1)"
                (touchmove)="onDrag($event)"
                (touchend)="onDragEnd($event)"
                [attr.tabindex]="$disabled() ? null : tabindex()"
                role="slider"
                [attr.aria-valuemin]="min()"
                [attr.aria-valuenow]="value() ? value()[1] : null"
                [attr.aria-valuemax]="max()"
                [attr.aria-labelledby]="ariaLabelledBy()"
                [attr.aria-label]="ariaLabel()"
                [attr.aria-orientation]="orientation()"
                [attr.data-pc-section]="'endHandler'"
                [pBind]="ptm('endHandler')"
                [attr.data-p]="dataP()"
            ></span>
        }
    `,
    providers: [SLIDER_VALUE_ACCESSOR, SliderStyle, { provide: SLIDER_INSTANCE, useExisting: Slider }, { provide: PARENT_INSTANCE, useExisting: Slider }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.data-pc-name]': "'slider'",
        '[attr.data-pc-section]': "'root'",
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP()',
        '[attr.data-p-sliding]': 'false'
    },
    hostDirectives: [Bind]
})
export class Slider extends BaseEditableHolder<SliderPassThrough> {
    componentName = 'Slider';
    $pcSlider: Slider | undefined = inject(SLIDER_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
        effect(() => {
            this.min();
            this.max();
            untracked(() => {
                if (this.range() ? this.values() : this.value() != null) {
                    this.updateHandleValue();
                }
            });
        });
    }

    /**
     * When enabled, displays an animation on click of the slider bar.
     * @group Props
     */
    readonly animate = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Mininum boundary value.
     * @group Props
     */
    readonly min = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * Maximum boundary value.
     * @group Props
     */
    readonly max = input<number, unknown>(100, { transform: numberAttribute });
    /**
     * Orientation of the slider.
     * @group Props
     */
    readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
    /**
     * Step factor to increment/decrement the value.
     * @group Props
     */
    readonly step = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * When specified, allows two boundary values to be picked.
     * @group Props
     */
    readonly range = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string | undefined>();
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Callback to invoke on value change.
     * @param {SliderChangeEvent} event - Custom value change event.
     * @group Emits
     */
    readonly onChange = output<SliderChangeEvent>();
    /**
     * Callback to invoke when slide ended.
     * @param {SliderSlideEndEvent} event - Custom slide end event.
     * @group Emits
     */
    readonly onSlideEnd = output<SliderSlideEndEvent>();

    readonly sliderHandle = viewChild<Nullable<ElementRef>>('sliderHandle');

    readonly sliderHandleStart = viewChild<Nullable<ElementRef>>('sliderHandleStart');

    readonly sliderHandleEnd = viewChild<Nullable<ElementRef>>('sliderHandleEnd');

    _componentStyle = inject(SliderStyle);

    public value = signal<Nullable<number>>(undefined);

    public values = signal<Nullable<number[]>>(undefined);

    public handleValue = signal<Nullable<number>>(undefined);

    public handleValues = signal<number[]>([]);

    diff = computed(() => this.getDiff());

    offset = computed(() => this.getOffset());

    public dragging = signal<Nullable<boolean>>(undefined);

    public dragListener = signal<VoidListener>(undefined);

    public mouseupListener = signal<VoidListener>(undefined);

    public initX = signal<Nullable<number>>(undefined);

    public initY = signal<Nullable<number>>(undefined);

    public barWidth = signal<Nullable<number>>(undefined);

    public barHeight = signal<Nullable<number>>(undefined);

    public sliderHandleClick = signal<Nullable<boolean>>(undefined);

    public handleIndex = signal<number>(0);

    public startHandleValue = signal<any>(undefined);

    public startx = signal<Nullable<number>>(undefined);

    public starty = signal<Nullable<number>>(undefined);

    private ngZone = inject(NgZone);

    @HostListener('click', ['$event'])
    onHostClick(event: MouseEvent) {
        this.onBarClick(event);
    }

    onMouseDown(event: Event, index?: number) {
        if (this.$disabled()) {
            return;
        }

        this.dragging.set(true);
        this.updateDomData();
        this.sliderHandleClick.set(true);
        if (this.range() && this.handleValues() && this.handleValues()[0] === this.max()) {
            this.handleIndex.set(0);
        } else {
            this.handleIndex.set(index as number);
        }

        this.bindDragListeners();
        (event.target as HTMLInputElement).focus();
        event.preventDefault();

        if (this.animate()) {
            removeClass(this.el.nativeElement, 'p-slider-animate');
        }
    }

    onDragStart(event: TouchEvent, index?: number) {
        if (this.$disabled()) {
            return;
        }

        this.el.nativeElement.setAttribute('data-p-sliding', true);

        var touchobj = event.changedTouches[0];
        this.startHandleValue.set(this.range() ? this.handleValues()[index as number] : this.handleValue());
        this.dragging.set(true);
        if (this.range() && this.handleValues() && this.handleValues()[0] === this.max()) {
            this.handleIndex.set(0);
        } else {
            this.handleIndex.set(index as number);
        }

        if (this.orientation() === 'horizontal') {
            this.startx.set(parseInt((touchobj as any).clientX, 10));
            this.barWidth.set(this.el.nativeElement.offsetWidth);
        } else {
            this.starty.set(parseInt((touchobj as any).clientY, 10));
            this.barHeight.set(this.el.nativeElement.offsetHeight);
        }

        if (this.animate()) {
            removeClass(this.el.nativeElement, 'p-slider-animate');
        }

        event.preventDefault();
    }

    onDrag(event: TouchEvent) {
        if (this.$disabled()) {
            return;
        }

        var touchobj = event.changedTouches[0],
            handleValue = 0;

        if (this.orientation() === 'horizontal') {
            handleValue = Math.floor(((parseInt((touchobj as any).clientX, 10) - (this.startx() as number)) * 100) / (this.barWidth() as number)) + this.startHandleValue();
        } else {
            handleValue = Math.floor((((this.starty() as number) - parseInt((touchobj as any).clientY, 10)) * 100) / (this.barHeight() as number)) + this.startHandleValue();
        }

        this.setValueFromHandle(event, handleValue);

        event.preventDefault();
    }

    onDragEnd(event: TouchEvent) {
        if (this.$disabled()) {
            return;
        }

        this.dragging.set(false);
        this.el.nativeElement.setAttribute('data-p-sliding', false);

        if (this.range()) this.onSlideEnd.emit({ originalEvent: event, values: this.values() as number[] });
        else this.onSlideEnd.emit({ originalEvent: event, value: this.value() as number });

        if (this.animate()) {
            addClass(this.el.nativeElement, 'p-slider-animate');
        }

        event.preventDefault();
    }

    onBarClick(event: Event) {
        if (this.$disabled()) {
            return;
        }

        if (!this.sliderHandleClick()) {
            this.updateDomData();
            this.handleChange(event);

            if (this.range()) this.onSlideEnd.emit({ originalEvent: event, values: this.values() as number[] });
            else this.onSlideEnd.emit({ originalEvent: event, value: this.value() as number });
        }

        this.sliderHandleClick.set(false);
    }

    onKeyDown(event: any, index?) {
        this.handleIndex.set(index);

        switch (event.code) {
            case 'ArrowDown':
            case 'ArrowLeft':
                this.decrementValue(event, index);
                event.preventDefault();
                break;

            case 'ArrowUp':
            case 'ArrowRight':
                this.incrementValue(event, index);
                event.preventDefault();
                break;

            case 'PageDown':
                this.decrementValue(event, index, true);
                event.preventDefault();
                break;

            case 'PageUp':
                this.incrementValue(event, index, true);
                event.preventDefault();
                break;

            case 'Home':
                this.updateValue(this.min(), event);
                event.preventDefault();
                break;

            case 'End':
                this.updateValue(this.max(), event);
                event.preventDefault();
                break;

            default:
                break;
        }
    }

    decrementValue(event, index, pageKey = false) {
        let newValue;

        if (this.range()) {
            if (this.step()) newValue = (this.values()?.[index] ?? 0) - this.step()!;
            else newValue = (this.values()?.[index] ?? 0) - 1;
        } else {
            if (this.step()) newValue = this.value()! - this.step()!;
            else if (!this.step() && pageKey) newValue = this.value()! - 10;
            else newValue = this.value()! - 1;
        }

        this.updateValue(newValue, event);
        event.preventDefault();
    }

    incrementValue(event, index, pageKey = false) {
        let newValue;

        if (this.range()) {
            if (this.step()) newValue = (this.values()?.[index] ?? 0) + this.step()!;
            else newValue = (this.values()?.[index] ?? 0) + 1;
        } else {
            if (this.step()) newValue = this.value()! + this.step()!;
            else if (!this.step() && pageKey) newValue = this.value()! + 10;
            else newValue = this.value()! + 1;
        }

        this.updateValue(newValue, event);
        event.preventDefault();
    }

    handleChange(event: Event) {
        let handleValue = this.calculateHandleValue(event);
        this.setValueFromHandle(event, handleValue);
    }

    bindDragListeners() {
        if (isPlatformBrowser(this.platformId)) {
            this.ngZone.runOutsideAngular(() => {
                const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : this.document;

                if (!this.dragListener()) {
                    this.dragListener.set(
                        this.renderer.listen(documentTarget, 'mousemove', (event) => {
                            if (this.dragging()) {
                                this.el.nativeElement.setAttribute('data-p-sliding', true);
                                this.ngZone.run(() => {
                                    this.handleChange(event);
                                });
                            }
                        })
                    );
                }

                if (!this.mouseupListener()) {
                    this.mouseupListener.set(
                        this.renderer.listen(documentTarget, 'mouseup', (event) => {
                            if (this.dragging()) {
                                this.dragging.set(false);
                                this.el.nativeElement.setAttribute('data-p-sliding', false);
                                this.ngZone.run(() => {
                                    if (this.range()) this.onSlideEnd.emit({ originalEvent: event, values: this.values() as number[] });
                                    else this.onSlideEnd.emit({ originalEvent: event, value: this.value() as number });

                                    if (this.animate()) {
                                        addClass(this.el.nativeElement, 'p-slider-animate');
                                    }
                                });
                            }
                        })
                    );
                }
            });
        }
    }

    unbindDragListeners() {
        const dragListener = this.dragListener();
        if (dragListener) {
            dragListener();
            this.dragListener.set(null);
        }

        const mouseupListener = this.mouseupListener();
        if (mouseupListener) {
            mouseupListener();
            this.mouseupListener.set(null);
        }
    }

    setValueFromHandle(event: Event, handleValue: any) {
        let newValue = this.getValueFromHandle(handleValue);

        if (this.range()) {
            if (this.step()) {
                this.handleStepChange(newValue, (this.values() as any)[this.handleIndex()]);
            } else {
                this.handleValues.update((handleValues) => {
                    const _handleValues = [...handleValues];
                    _handleValues[this.handleIndex()] = handleValue;
                    return _handleValues;
                });
                this.updateValue(newValue, event);
            }
        } else {
            if (this.step()) {
                this.handleStepChange(newValue, this.value() as any);
            } else {
                this.handleValue.set(handleValue);
                this.updateValue(newValue, event);
            }
        }
    }

    handleStepChange(newValue: number, oldValue: number) {
        let diff = newValue - oldValue;
        let val = oldValue;
        let _step = this.step() as number;

        if (diff < 0) {
            val = oldValue + Math.ceil(newValue / _step - oldValue / _step) * _step;
        } else if (diff > 0) {
            val = oldValue + Math.floor(newValue / _step - oldValue / _step) * _step;
        }

        this.updateValue(val);
        this.updateHandleValue();
    }

    rangeStartLeft = computed(() => {
        if (!this.isVertical()) return this.handleValues()[0] > 100 ? 100 + '%' : this.handleValues()[0] + '%';
        return null;
    });

    rangeStartBottom = computed(() => (this.isVertical() ? this.handleValues()[0] + '%' : 'auto'));

    rangeEndLeft = computed(() => (this.isVertical() ? null : this.handleValues()[1] + '%'));

    rangeEndBottom = computed(() => (this.isVertical() ? this.handleValues()[1] + '%' : 'auto'));

    isVertical = computed<boolean>(() => this.orientation() === 'vertical');

    updateDomData(): void {
        let rect = this.el.nativeElement.getBoundingClientRect();
        this.initX.set(rect.left + getWindowScrollLeft());
        this.initY.set(rect.top + getWindowScrollTop());
        this.barWidth.set(this.el.nativeElement.offsetWidth);
        this.barHeight.set(this.el.nativeElement.offsetHeight);
    }

    calculateHandleValue(event: Event): number {
        if (this.orientation() === 'horizontal') {
            if (isRTL(this.el.nativeElement)) {
                return (((this.initX() as number) + (this.barWidth() as number) - (event as MouseEvent).pageX) * 100) / (this.barWidth() as number);
            } else {
                return (((event as MouseEvent).pageX - (this.initX() as number)) * 100) / (this.barWidth() as number);
            }
        } else {
            return (((this.initY() as number) + (this.barHeight() as number) - (event as MouseEvent).pageY) * 100) / (this.barHeight() as number);
        }
    }

    updateHandleValue(): void {
        if (this.range()) {
            const values = this.values() as number[];
            this.handleValues.set([((values[0] < this.min() ? 0 : values[0] - this.min()) * 100) / (this.max() - this.min()), ((values[1] > this.max() ? 100 : values[1] - this.min()) * 100) / (this.max() - this.min())]);
        } else {
            if ((this.value() as number) < this.min()) this.handleValue.set(0);
            else if ((this.value() as number) > this.max()) this.handleValue.set(100);
            else this.handleValue.set((((this.value() as number) - this.min()) * 100) / (this.max() - this.min()));
        }
    }

    getDiff = computed<number>(() => Math.abs(this.handleValues()[0] - this.handleValues()[1]));

    getOffset = computed<number>(() => Math.min(this.handleValues()[0], this.handleValues()[1]));

    updateValue(val: number, event?: Event): void {
        if (this.range()) {
            let value = val;

            if (this.handleIndex() == 0) {
                if (value < this.min()) {
                    value = this.min();
                    this.handleValues.update((handleValues) => [0, handleValues[1]]);
                } else if (value > (this.values() as number[])[1]) {
                    if (value > this.max()) {
                        value = this.max();
                        this.handleValues.update((handleValues) => [100, handleValues[1]]);
                    }
                }
                this.sliderHandleStart()?.nativeElement.focus();
            } else {
                if (value > this.max()) {
                    value = this.max();
                    this.handleValues.update((handleValues) => [handleValues[0], 100]);
                } else if (value < this.min()) {
                    value = this.min();
                    this.handleValues.update((handleValues) => [handleValues[0], 0]);
                }
                this.sliderHandleEnd()?.nativeElement.focus();
            }

            if (this.step()) {
                this.updateHandleValue();
            }

            this.values.update((values) => {
                const _values = [...(values as number[])];
                _values[this.handleIndex()] = this.getNormalizedValue(value);
                return _values;
            });
            let newValues = [this.minVal(), this.maxVal()];
            this.onModelChange(newValues);
            this.onChange.emit({ event: event as Event, values: this.values() as number[] });
        } else {
            if (val < this.min()) {
                val = this.min();
                this.handleValue.set(0);
            } else if (val > this.max()) {
                val = this.max();
                this.handleValue.set(100);
            }

            this.value.set(this.getNormalizedValue(val));

            this.onModelChange(this.value());
            this.onChange.emit({ event: event as Event, value: this.value() as number });
            this.sliderHandle()?.nativeElement.focus();
        }
        this.updateHandleValue();
    }

    getValueFromHandle(handleValue: number): number {
        return (this.max() - this.min()) * (handleValue / 100) + this.min();
    }

    getDecimalsCount(value: number): number {
        if (value && Math.floor(value) !== value) return value.toString().split('.')[1].length || 0;
        return 0;
    }

    getNormalizedValue(val: number): number {
        let decimalsCount = this.getDecimalsCount(this.step() as number);
        if (decimalsCount > 0) {
            return +parseFloat(val.toString()).toFixed(decimalsCount);
        } else {
            return Math.floor(val);
        }
    }

    onDestroy() {
        this.unbindDragListeners();
    }

    minVal = computed(() => Math.min((this.values() as number[])[1], (this.values() as number[])[0]));

    maxVal = computed(() => Math.max((this.values() as number[])[1], (this.values() as number[])[0]));

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any): void {
        if (this.range()) this.values.set(value || [0, 0]);
        else this.value.set(value || 0);

        this.updateHandleValue();
    }

    dataP = computed(() =>
        this.cn({
            [this.orientation() as string]: this.orientation()
        })
    );
}

@NgModule({
    imports: [Slider, SharedModule],
    exports: [Slider, SharedModule]
})
export class SliderModule {}
