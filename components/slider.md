# Angular Slider Component

Slider is a component to provide input with a drag handle.

## Accessibility

Screen Reader Slider element component uses slider role on the handle in addition to the aria-orientation , aria-valuemin , aria-valuemax and aria-valuenow attributes. Value to describe the component can be defined using ariaLabelledBy and ariaLabel props.

## Basic

Two-way binding is defined using the standard ngModel directive.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderModule } from '@exhaustive-ui/core/slider';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-slider [(ngModel)]="value" class="w-56" ariaLabel="Volume" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, SliderModule]
})
export class SliderBasicDemo {
    value!: number;
}
```

## Filter

Image filter implementation using multiple sliders.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderModule } from '@exhaustive-ui/core/slider';
import { SelectButtonModule } from '@exhaustive-ui/core/selectbutton';

@Component({
    template: `
        <div class="card flex justify-center">
            <div class="flex flex-col items-center">
                <img alt="user header" class="w-full md:w-80 rounded-sm mb-6" src="https://exhaustive-ui.com/demo/card-vue.jpg" [style]="filterStyle" />
                <p-select-button [(ngModel)]="filter" [options]="filterOptions" optionLabel="label" optionValue="value" class="mb-4" />
                <p-slider [(ngModel)]="filterValues[filter]" class="w-56" [min]="0" [max]="200" ariaLabel="Filter intensity" />
            </div>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, SliderModule, SelectButtonModule]
})
export class SliderFilterDemo {
    filter: number = 0;

    filterValues: number[] = [100, 100, 0];

    filterOptions: any = [
        { label: 'Contrast', value: 0 },
        { label: 'Brightness', value: 1 },
        { label: 'Sepia', value: 2 }
    ];

    get filterStyle() {
        return {
            filter: `contrast(${this.filterValues[0]}%) brightness(${this.filterValues[1]}%) sepia(${this.filterValues[2]}%)`
        };
    }
}
```

## Input

Slider is connected to an input field using two-way binding.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderModule } from '@exhaustive-ui/core/slider';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex justify-center">
            <div>
                <input type="text" pInputText [(ngModel)]="value" class="w-full mb-4" aria-label="Volume" />
                <p-slider [(ngModel)]="value" class="w-full" ariaLabel="Volume" />
            </div>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, SliderModule, InputTextModule]
})
export class SliderInputDemo {
    value: number = 50;
}
```

## Range

When range property is present, slider provides two handles to define two values. In range mode, value should be an array instead of a single value.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderModule } from '@exhaustive-ui/core/slider';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-slider [(ngModel)]="rangeValues" [range]="true" class="w-56" ariaLabel="Range" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, SliderModule]
})
export class SliderRangeDemo {
    rangeValues: number[] = [20, 80];
}
```

## reactiveforms-doc

Slider can also be used with reactive forms. In this case, the formControlName property is used to bind the component to a form control.

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '@exhaustive-ui/core/api';
import { SliderModule } from '@exhaustive-ui/core/slider';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                <div class="flex flex-col gap-4">
                    <p-slider formControlName="value" class="w-56" ariaLabel="Volume" />
                    @if (isInvalid('value')) {
                        <p-message severity="error" size="small" variant="simple">Must be greater than 25.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SliderModule, ToastModule, MessageModule, ButtonModule],
    providers: [MessageService]
})
export class SliderReactiveformsDemo {
    private fb = inject(FormBuilder);

    messageService = inject(MessageService);

    exampleForm: FormGroup | undefined;

    formSubmitted: boolean = false;

    constructor() {
        this.exampleForm = this.fb.group({
            value: ['', Validators.required]
        });
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm.reset();
            this.formSubmitted = false;
        }
    }

    isInvalid(controlName: string) {
        const control = this.exampleForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
    }
}
```

## Signal Forms

Slider can also be used with Angular Signal Forms , the @angular/forms/signals API of Angular 21 and newer. The form model is a signal, form() declares its validators and the [formField] directive binds the component to a field. The field also sets the invalid and touched states of the component, so it is styled as invalid once the field is touched or the form is submitted, like the messages below.

```typescript
import { Component, inject, signal } from '@angular/core';
import { form, FormField, submit, validate } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { SliderModule } from '@exhaustive-ui/core/slider';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-4">
                    <p-slider [formField]="exampleForm.value" class="w-56" ariaLabel="Volume" />
                    @let value = exampleForm.value();
                    @if (value.invalid() && value.touched()) {
                        <p-message severity="error" size="small" variant="simple">Must be greater than 25.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormField, SliderModule, ButtonModule, ToastModule, MessageModule],
    providers: [MessageService]
})
export class SliderSignalformsDemo {
    messageService = inject(MessageService);

    model = signal({ value: 0 });

    exampleForm = form(this.model, (f) => {
        // min() would also set the start of the slider range, so the lower bound is checked by a validator
        validate(f.value, ({ value }) => (value() > 25 ? null : { kind: 'min' }));
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.exampleForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm().reset({ value: 0 });
        });
    }
}
```

## Step

Size of each movement is defined with the step property.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderModule } from '@exhaustive-ui/core/slider';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-slider [(ngModel)]="value" [step]="20" class="w-56" ariaLabel="Volume" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, SliderModule]
})
export class SliderStepDemo {
    value: number = 20;
}
```

## templatedrivenforms-doc

```typescript
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '@exhaustive-ui/core/api';
import { SliderModule } from '@exhaustive-ui/core/slider';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex justify-center flex-col gap-4">
                <div class="flex flex-col gap-4">
                    <p-slider #model="ngModel" [(ngModel)]="value" class="w-56" required [invalid]="model.invalid && (model.touched || exampleForm.submitted)" name="slider" ariaLabel="Volume" />
                    @if (model.invalid && (model.touched || exampleForm.submitted)) {
                        <p-message severity="error" size="small" variant="simple">Must be greater than 25.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, SliderModule, ToastModule, MessageModule, ButtonModule],
    providers: [MessageService]
})
export class SliderTemplatedrivenformsDemo {
    messageService = inject(MessageService);

    value: any;

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
```

## Vertical

Default layout of slider is horizontal , use orientation property for the alternative vertical mode.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderModule } from '@exhaustive-ui/core/slider';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-slider [(ngModel)]="value" orientation="vertical" class="h-56" ariaLabel="Volume" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, SliderModule]
})
export class SliderVerticalDemo {
    value: number = 50;
}
```

## Slider

Slider is a component to provide input with a drag handle.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | SliderPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| required | boolean | false | There must be a value (if set). |
| invalid | boolean | false | When present, it specifies that the component should have invalid state style. |
| touched | boolean | undefined | Whether the field has been touched. Signal Forms sets it through  `[formField]` : the invalid style and  `aria-invalid`  then wait until the field is touched, or the form is submitted, like the error messages. Left unset,  `invalid`  applies at once. |
| $invalid | Signal<boolean> | - | The invalid state shown by the component:  `invalid` , once the field is touched when  `touched`  is set; undefined when  `invalid`  is unset. |
| disabled | boolean | false | When present, it specifies that the component should have disabled state style. |
| name | string | undefined | When present, it specifies that the name of the input. |
| animate | boolean | - | When enabled, displays an animation on click of the slider bar. |
| min | number | 0 | Mininum boundary value. |
| max | number | 100 | Maximum boundary value. |
| orientation | "vertical" \| "horizontal" | 'horizontal' | Orientation of the slider. |
| step | number | - | Step factor to increment/decrement the value. |
| range | boolean | - | When specified, allows two boundary values to be picked. |
| ariaLabel | string | - | Defines a string that labels the input for accessibility. |
| ariaLabelledBy | string | - | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| tabindex | number | 0 | Index of the element in tabbing order. |
| autofocus | boolean | - | When present, it specifies that the component should automatically get focus on load. |

### Emits

| Name | Parameters | Description |
|------|------------|-------------|
| onChange | event: SliderChangeEvent | Callback to invoke on value change. |
| onSlideEnd | event: SliderSlideEndEvent | Callback to invoke when slide ended. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| root | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the root's DOM element. |
| range | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the range's DOM element. |
| handle | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the handle's DOM element. |
| startHandler | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the start handler's DOM element. |
| endHandler | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the end handler's DOM element. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-slider | Class name of the root element |
| p-slider-range | Class name of the range element |
| p-slider-handle | Class name of the handle element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| slider.transition.duration | --p-slider-transition-duration | Transition duration of root |
| slider.track.background | --p-slider-track-background | Background of track |
| slider.track.border.radius | --p-slider-track-border-radius | Border radius of track |
| slider.track.size | --p-slider-track-size | Size of track |
| slider.range.background | --p-slider-range-background | Background of range |
| slider.handle.width | --p-slider-handle-width | Width of handle |
| slider.handle.height | --p-slider-handle-height | Height of handle |
| slider.handle.border.radius | --p-slider-handle-border-radius | Border radius of handle |
| slider.handle.background | --p-slider-handle-background | Background of handle |
| slider.handle.hover.background | --p-slider-handle-hover-background | Hover background of handle |
| slider.handle.content.border.radius | --p-slider-handle-content-border-radius | Content border radius of handle |
| slider.handle.content.background | --p-slider-handle-content-background | Background of handle |
| slider.handle.content.hover.background | --p-slider-handle-content-hover-background | Content hover background of handle |
| slider.handle.content.width | --p-slider-handle-content-width | Content width of handle |
| slider.handle.content.height | --p-slider-handle-content-height | Content height of handle |
| slider.handle.content.shadow | --p-slider-handle-content-shadow | Content shadow of handle |
| slider.handle.focus.ring.width | --p-slider-handle-focus-ring-width | Focus ring width of handle |
| slider.handle.focus.ring.style | --p-slider-handle-focus-ring-style | Focus ring style of handle |
| slider.handle.focus.ring.color | --p-slider-handle-focus-ring-color | Focus ring color of handle |
| slider.handle.focus.ring.offset | --p-slider-handle-focus-ring-offset | Focus ring offset of handle |
| slider.handle.focus.ring.shadow | --p-slider-handle-focus-ring-shadow | Focus ring shadow of handle |

