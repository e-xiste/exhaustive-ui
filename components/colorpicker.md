# Angular ColorPicker Component

ColorPicker is an input component to select a color.

## Basic

ColorPicker is used as a controlled input with ngModel property.

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from '@exhaustive-ui/core/colorpicker';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-color-picker [(ngModel)]="color" />
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, ColorPickerModule]
})
export class ColorpickerBasicDemo {
    color: string | undefined;
}
```

## Inline

ColorPicker is displayed as a popup by default, add inline property to customize this behavior.

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from '@exhaustive-ui/core/colorpicker';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-color-picker [(ngModel)]="color" [inline]="true" />
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, ColorPickerModule]
})
export class ColorpickerInlineDemo {
    color: string | undefined;
}
```

## Format

Default color format to use in value binding is hex and other possible values can be rgb and hsb using the format property.

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from '@exhaustive-ui/core/colorpicker';

@Component({
    template: `
        <div class="card flex flex-wrap gap-4">
            <div class="flex-1 flex flex-col items-center">
                <label for="cp-hex" class="font-bold block mb-2"> HEX </label>
                <p-color-picker [(ngModel)]="color" inputId="cp-hex" class="mb-4" />
                <span>{{ color }}</span>
            </div>
            <div class="flex-1 flex flex-col items-center">
                <label for="cp-rgb" class="font-bold block mb-2"> RGB </label>
                <p-color-picker [(ngModel)]="colorRGB" format="rgb" inputId="cp-rgb" class="mb-4" />
                <span>{{ 'r:' + colorRGB.r + ' g:' + colorRGB.g + ' b:' + colorRGB.b }}</span>
            </div>
            <div class="flex-1 flex flex-col items-center">
                <label for="cp-hsb" class="font-bold block mb-2"> HSB </label>
                <p-color-picker [(ngModel)]="colorHSB" format="hsb" inputId="cp-hsb" class="mb-4" />
                <span>{{ 'h:' + colorHSB.h + ' s:' + colorHSB.s + ' b:' + colorHSB.b }}</span>
            </div>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, ColorPickerModule]
})
export class ColorpickerFormatDemo {
    color: string = '#6466f1';

    colorRGB: any = { r: 100, g: 102, b: 241 };

    colorHSB: any = { h: 239, s: 59, b: 95 };
}
```

## Forms: Template Driven

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { ColorPickerModule } from '@exhaustive-ui/core/colorpicker';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ToastModule } from '@exhaustive-ui/core/toast';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-toast />
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex flex-col gap-4">
                <div class="flex flex-col items-center gap-2">
                    <p-color-picker name="color" [(ngModel)]="color" #colorModel="ngModel" required defaultColor="989898" />
                    @if (colorModel.invalid && (colorModel.touched || exampleForm.submitted)) {
                        <p-message severity="error" size="small" variant="simple">Color is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, ColorPickerModule, ButtonModule, MessageModule, ToastModule],
    providers: [MessageService]
})
export class ColorpickerTemplatedrivenformsDemo {
    messageService = inject(MessageService);

    color: string | undefined;

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            form.resetForm();
        }
    }
}
```

## Reactive Forms

ColorPicker can also be used with reactive forms. In this case, the formControlName property is used to bind the component to a form control.

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { ColorPickerModule } from '@exhaustive-ui/core/colorpicker';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ToastModule } from '@exhaustive-ui/core/toast';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-toast />
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                <div class="flex flex-col items-center gap-2">
                    <p-color-picker formControlName="color" defaultColor="989898" />
                    @if (isInvalid('color')) {
                        <p-message severity="error" size="small" variant="simple">Color is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ColorPickerModule, ButtonModule, MessageModule, ToastModule],
    providers: [MessageService]
})
export class ColorpickerReactiveformsDemo {
    private fb = inject(FormBuilder);

    messageService = inject(MessageService);

    exampleForm: FormGroup;

    formSubmitted = false;

    constructor() {
        this.exampleForm = this.fb.group({
            color: ['', Validators.required]
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
        return control?.invalid && this.formSubmitted;
    }
}
```

## Signal Forms

ColorPicker can also be used with Angular Signal Forms , the @angular/forms/signals API of Angular 21 and newer. The form model is a signal, form() declares its validators and the [formField] directive binds the component to a field. The field also sets the invalid and touched states of the component, so it is styled as invalid once the field is touched or the form is submitted, like the messages below.

```typescript
import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { ColorPickerModule } from '@exhaustive-ui/core/colorpicker';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4">
                <div class="flex flex-col items-center gap-2">
                    <p-color-picker [formField]="exampleForm.color" defaultColor="989898" />
                    @let color = exampleForm.color();
                    @if (color.invalid() && color.touched()) {
                        <p-message severity="error" size="small" variant="simple">Color is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormField, ColorPickerModule, ButtonModule, ToastModule, MessageModule],
    providers: [MessageService]
})
export class ColorpickerSignalformsDemo {
    messageService = inject(MessageService);

    model = signal({ color: '' });

    exampleForm = form(this.model, (f) => {
        required(f.color);
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.exampleForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm().reset({ color: '' });
        });
    }
}
```

## Disabled

When disabled is present, the element cannot be edited and focused.

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from '@exhaustive-ui/core/colorpicker';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-color-picker [(ngModel)]="color" [disabled]="true" />
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, ColorPickerModule]
})
export class ColorpickerDisabledDemo {
    color: string | undefined;
}
```

## Accessibility

Screen Reader Specification does not cover a color picker yet and using a semantic native color picker is not consistent across browsers so currently component is not compatible with screen readers. In the upcoming versions, text fields will be introduced below the slider section to be able to pick a color using accessible text boxes in hsl, rgba and hex formats.

## Color Picker

ColorPicker groups a collection of contents in tabs.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | ColorPickerPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| required | boolean | false | There must be a value (if set). |
| invalid | boolean | false | When present, it specifies that the component should have invalid state style. |
| touched | boolean | undefined | Whether the field has been touched. Signal Forms sets it through  `[formField]` : the invalid style and  `aria-invalid`  then wait until the field is touched, or the form is submitted, like the error messages. Left unset,  `invalid`  applies at once. |
| $invalid | Signal<boolean> | - | The invalid state shown by the component:  `invalid` , once the field is touched when  `touched`  is set; undefined when  `invalid`  is unset. |
| disabled | boolean | false | When present, it specifies that the component should have disabled state style. |
| name | string | undefined | When present, it specifies that the name of the input. |
| inline | boolean | - | Whether to display as an overlay or not. |
| format | "hex" \| "rgb" \| "hsb" | 'hex' | Format to use in value binding. |
| tabindex | string | - | Index of the element in tabbing order. |
| inputId | string | - | Identifier of the focus input to match a label defined for the dropdown. |
| autoZIndex | boolean | true | Whether to automatically manage layering. |
| autofocus | boolean | - | When present, it specifies that the component should automatically get focus on load. |
| defaultColor | string | 'ff0000' | Default color to display initially when model value is not present. |
| appendTo | any | 'self' | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| overlayOptions | OverlayOptions | - | Whether to use overlay API feature. The properties of overlay API can be used like an object in it. |
| motionOptions | MotionOptions | - | The motion options. |

### Emits

| Name | Parameters | Description |
|------|------------|-------------|
| onChange | event: ColorPickerChangeEvent | Callback to invoke on value change. |
| onShow | value: any | Callback to invoke on panel is shown. |
| onHide | value: any | Callback to invoke on panel is hidden. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| host | PassThroughOption<HTMLElement, I> | Used to pass attributes to the host's DOM element. |
| root | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the root's DOM element. |
| preview | PassThroughOption<HTMLInputElement, I> | Used to pass attributes to the preview input's DOM element. |
| panel | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the panel's DOM element. |
| content | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the content's DOM element. |
| colorSelector | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the color selector's DOM element. |
| colorBackground | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the color background's DOM element. |
| colorHandle | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the color handle's DOM element. |
| hue | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the hue's DOM element. |
| hueHandle | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the hue handle's DOM element. |
| motion | MotionOptions | Used to pass options to the motion component/directive. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-colorpicker | Class name of the root element |
| p-colorpicker-preview | Class name of the preview element |
| p-colorpicker-panel | Class name of the panel element |
| p-colorpicker-color-selector | Class name of the color selector element |
| p-colorpicker-color-background | Class name of the color background element |
| p-colorpicker-color-handle | Class name of the color handle element |
| p-colorpicker-hue | Class name of the hue element |
| p-colorpicker-hue-handle | Class name of the hue handle element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| colorpicker.transition.duration | --p-colorpicker-transition-duration | Transition duration of root |
| colorpicker.preview.width | --p-colorpicker-preview-width | Width of preview |
| colorpicker.preview.height | --p-colorpicker-preview-height | Height of preview |
| colorpicker.preview.border.radius | --p-colorpicker-preview-border-radius | Border radius of preview |
| colorpicker.preview.focus.ring.width | --p-colorpicker-preview-focus-ring-width | Focus ring width of preview |
| colorpicker.preview.focus.ring.style | --p-colorpicker-preview-focus-ring-style | Focus ring style of preview |
| colorpicker.preview.focus.ring.color | --p-colorpicker-preview-focus-ring-color | Focus ring color of preview |
| colorpicker.preview.focus.ring.offset | --p-colorpicker-preview-focus-ring-offset | Focus ring offset of preview |
| colorpicker.preview.focus.ring.shadow | --p-colorpicker-preview-focus-ring-shadow | Focus ring shadow of preview |
| colorpicker.panel.shadow | --p-colorpicker-panel-shadow | Shadow of panel |
| colorpicker.panel.border.radius | --p-colorpicker-panel-border-radius | Border radius of panel |
| colorpicker.panel.background | --p-colorpicker-panel-background | Background of panel |
| colorpicker.panel.border.color | --p-colorpicker-panel-border-color | Border color of panel |
| colorpicker.handle.color | --p-colorpicker-handle-color | Color of handle |

