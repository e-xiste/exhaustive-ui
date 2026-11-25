# Angular InputMask Component

InputMask component is used to enter input in a certain format such as numeric, date, currency and phone.

## Accessibility

Screen Reader InputMask directive is used with a native input element that implicitly includes any passed attribute. Value to describe the component can either be provided via label tag combined with id attribute or using aria-labelledby , aria-label attributes.

## Basic

InputMask is used as a controlled input with ngModel properties.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from '@exhaustive-ui/core/inputmask';
import { InputText } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex justify-center">
            <input pInputText pInputMask="99-999999" [(ngModel)]="value" placeholder="99-999999" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputMaskModule, InputText]
})
export class InputmaskBasicDemo {
    value: string | undefined;
}
```

## clearicon-doc

When showClear is enabled, a clear icon is displayed to clear the value.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from '@exhaustive-ui/core/inputmask';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-input-mask mask="99-999999" [(ngModel)]="value" placeholder="99-999999" [showClear]="true" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputMaskModule]
})
export class InputmaskCleariconDemo {
    value: string | undefined;
}
```

## Disabled

When disabled is present, the element cannot be edited and focused.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from '@exhaustive-ui/core/inputmask';
import { InputText } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex justify-center">
            <input pInputText pInputMask="999-99-9999" [(ngModel)]="value" disabled aria-label="SSN" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputMaskModule, InputText]
})
export class InputmaskDisabledDemo {
    value: string | undefined;
}
```

## Filled

Specify the variant property as filled to display the component with a higher visual emphasis than the default outlined style.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from '@exhaustive-ui/core/inputmask';
import { InputText } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex justify-center">
            <input pInputText pInputMask="99-999999" [(ngModel)]="value" variant="filled" placeholder="99-999999" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputMaskModule, InputText]
})
export class InputmaskFilledDemo {
    value: string | undefined;
}
```

## Float Label

FloatLabel visually integrates a label with its form element. Visit FloatLabel documentation for more information.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputMaskModule } from '@exhaustive-ui/core/inputmask';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { FloatLabelModule } from '@exhaustive-ui/core/floatlabel';

@Component({
    template: `
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <p-float-label>
                <input pInputText id="over_label" [(ngModel)]="value1" pInputMask="999-99-9999" />
                <label for="over_label">Over Label</label>
            </p-float-label>
            <p-float-label variant="in">
                <input pInputText id="in_label" [(ngModel)]="value2" pInputMask="999-99-9999" />
                <label for="in_label">In Label</label>
            </p-float-label>
            <p-float-label variant="on">
                <input pInputText id="on_label" [(ngModel)]="value3" pInputMask="999-99-9999" />
                <label for="on_label">On Label</label>
            </p-float-label>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RouterModule, InputMaskModule, InputText, FloatLabelModule]
})
export class InputmaskFloatlabelDemo {
    value1: string | undefined;

    value2: string | undefined;

    value3: string | undefined;
}
```

## Fluid

The fluid prop makes the component take up the full width of its container when set to true.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from '@exhaustive-ui/core/inputmask';
import { InputText } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card">
            <input pInputText pInputMask="99-999999" [(ngModel)]="value" placeholder="99-999999" fluid />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputMaskModule, InputText]
})
export class InputmaskFluidDemo {
    value: string | undefined;
}
```

## Ifta Label

IftaLabel is used to create infield top aligned labels. Visit IftaLabel documentation for more information.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputMaskModule } from '@exhaustive-ui/core/inputmask';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { IftaLabelModule } from '@exhaustive-ui/core/iftalabel';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-ifta-label>
                <input pInputText id="ssn" [(ngModel)]="value" pInputMask="999-99-9999" autocomplete="off" />
                <label for="ssn">SSN</label>
            </p-ifta-label>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RouterModule, InputMaskModule, InputText, IftaLabelModule]
})
export class InputmaskIftalabelDemo {
    value: string | undefined;
}
```

## Invalid

The invalid state is applied using the ⁠invalid property to indicate failed validation, which can be integrated with Angular Forms.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from '@exhaustive-ui/core/inputmask';
import { InputText } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex flex-wrap justify-center gap-4">
            <input pInputText [(ngModel)]="value1" pInputMask="99-999999" placeholder="Serial Key" [invalid]="!value1" />
            <input pInputText [(ngModel)]="value2" pInputMask="99-999999" placeholder="Serial Key" [invalid]="!value2" variant="filled" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputMaskModule, InputText]
})
export class InputmaskInvalidDemo {
    value1: string | undefined;

    value2: string | undefined;
}
```

## Mask

Mask format can be a combination of the following definitions; a for alphabetic characters, 9 for numeric characters and * for alphanumberic characters. In addition, formatting characters like ( , ) , - are also accepted.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from '@exhaustive-ui/core/inputmask';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { FluidModule } from '@exhaustive-ui/core/fluid';

@Component({
    template: `
        <p-fluid class="card flex flex-wrap gap-4">
            <div class="flex-auto">
                <span class="font-bold block mb-2">SSN</span>
                <input pInputText pInputMask="999-99-9999" [(ngModel)]="value1" placeholder="999-99-9999" />
            </div>
            <div class="flex-auto">
                <span class="font-bold block mb-2">Phone</span>
                <input pInputText pInputMask="(999) 999-9999" [(ngModel)]="value2" placeholder="(999) 999-9999" />
            </div>
            <div class="flex-auto">
                <span class="font-bold block mb-2">Serial Number</span>
                <input pInputText pInputMask="a*-999-a999" [(ngModel)]="value3" placeholder="a*-999-a999" />
            </div>
        </p-fluid>
    `,
    standalone: true,
    imports: [FormsModule, InputMaskModule, InputText, FluidModule]
})
export class InputmaskMaskDemo {
    value1: string | undefined;

    value2: string | undefined;

    value3: string | undefined;
}
```

## Optional

When the input does not complete the mask definition, it is cleared by default. Use autoClear property to control this behavior. In addition, ? is used to mark anything after the question mark optional.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from '@exhaustive-ui/core/inputmask';
import { InputText } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex justify-center">
            <input pInputText pInputMask="(999) 999-9999? x99999" [(ngModel)]="value" placeholder="(999) 999-9999? x99999" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputMaskModule, InputText]
})
export class InputmaskOptionalDemo {
    value: string | undefined;
}
```

## reactiveforms-doc

InputMask can also be used with reactive forms. In this case, the formControlName property is used to bind the component to a form control.

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { InputMaskModule } from '@exhaustive-ui/core/inputmask';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { FluidModule } from '@exhaustive-ui/core/fluid';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 sm:w-56">
                <div class="flex flex-col gap-1">
                    <input pInputText pInputMask="99-999999" formControlName="value" placeholder="99-999999" [invalid]="isInvalid('value')" fluid />
                    @if (isInvalid('value')) {
                        <p-message severity="error" size="small" variant="simple">Serial number is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [ReactiveFormsModule, InputMaskModule, InputText, ButtonModule, ToastModule, MessageModule, FluidModule],
    providers: [MessageService]
})
export class InputmaskReactiveformsDemo {
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

InputMask can also be used with Angular Signal Forms , the @angular/forms/signals API of Angular 21 and newer. The form model is a signal, form() declares its validators and the [formField] directive binds the component to a field. The field also sets the invalid and touched states of the component, so it is styled as invalid once the field is touched or the form is submitted, like the messages below.

```typescript
import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { InputMaskModule } from '@exhaustive-ui/core/inputmask';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4 sm:w-56">
                <div class="flex flex-col gap-1">
                    <input pInputText pInputMask="99-999999" [formField]="exampleForm.value" placeholder="99-999999" fluid />
                    @let value = exampleForm.value();
                    @if (value.invalid() && value.touched()) {
                        <p-message severity="error" size="small" variant="simple">Serial number is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormField, InputMaskModule, InputTextModule, ButtonModule, ToastModule, MessageModule],
    providers: [MessageService]
})
export class InputmaskSignalformsDemo {
    messageService = inject(MessageService);

    model = signal({ value: '' });

    exampleForm = form(this.model, (f) => {
        required(f.value);
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.exampleForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm().reset({ value: '' });
        });
    }
}
```

## Sizes

InputMask provides small and large sizes as alternatives to the base.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from '@exhaustive-ui/core/inputmask';
import { InputText } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-4">
            <input pInputText [(ngModel)]="value1" placeholder="Small" pSize="small" pInputMask="99-999999" />
            <input pInputText [(ngModel)]="value2" placeholder="Normal" pInputMask="99-999999" />
            <input pInputText [(ngModel)]="value3" placeholder="Large" pSize="large" pInputMask="99-999999" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputMaskModule, InputText]
})
export class InputmaskSizesDemo {
    value1: string | undefined;

    value2: string | undefined;

    value3: string | undefined;
}
```

## SlotChar

Default placeholder for a mask is underscore that can be customized using slotChar property.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from '@exhaustive-ui/core/inputmask';
import { InputText } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex justify-center">
            <input pInputText [(ngModel)]="value" pInputMask="99/99/9999" placeholder="99/99/9999" slotChar="mm/dd/yyyy" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputMaskModule, InputText]
})
export class InputmaskSlotcharDemo {
    value: string | undefined;
}
```

## templatedrivenforms-doc

```typescript
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { FluidModule } from '@exhaustive-ui/core/fluid';
import { InputMaskModule } from '@exhaustive-ui/core/inputmask';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ToastModule } from '@exhaustive-ui/core/toast';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex justify-center flex-col gap-4 md:w-56">
                <div class="flex flex-col gap-1">
                    <input pInputText name="serial" pInputMask="99-999999" #serialNumber="ngModel" [(ngModel)]="value" placeholder="99-999999" [invalid]="serialNumber.invalid && (serialNumber.touched || exampleForm.submitted)" required fluid />
                    @if (serialNumber.invalid && (serialNumber.touched || exampleForm.submitted)) {
                        <p-message severity="error" size="small" variant="simple">Serial number is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputMaskModule, InputText, ButtonModule, ToastModule, MessageModule, FluidModule],
    providers: [MessageService]
})
export class InputmaskTemplatedrivenformsDemo {
    messageService = inject(MessageService);

    items: any[] = [];

    value: any;

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
```

## Input Mask

InputMask component is used to enter input in a certain format such as numeric, date, currency, email and phone.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | InputMaskPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| required | boolean | false | There must be a value (if set). |
| invalid | boolean | false | When present, it specifies that the component should have invalid state style. |
| touched | boolean | undefined | Whether the field has been touched. Signal Forms sets it through  `[formField]` : the invalid style and  `aria-invalid`  then wait until the field is touched, or the form is submitted, like the error messages. Left unset,  `invalid`  applies at once. |
| $invalid | Signal<boolean> | - | The invalid state shown by the component:  `invalid` , once the field is touched when  `touched`  is set; undefined when  `invalid`  is unset. |
| disabled | boolean | false | When present, it specifies that the component should have disabled state style. |
| name | string | undefined | When present, it specifies that the name of the input. |
| fluid | boolean | false | Spans 100% width of the container when enabled. |
| variant | "outlined" \| "filled" | 'outlined' | Specifies the input variant of the component. |
| size | "small" \| "large" | undefined | Specifies the size of the component. |
| inputSize | number | undefined | Specifies the visible width of the input element in characters. |
| pattern | string | undefined | Specifies the value must match the pattern. |
| min | number | undefined | The value must be greater than or equal to the value. |
| max | number | undefined | The value must be less than or equal to the value. |
| step | number | undefined | Unless the step is set to the any literal, the value must be min + an integral multiple of the step. |
| minlength | number | undefined | The number of characters (code points) must not be less than the value of the attribute, if non-empty. |
| maxlength | number | undefined | The number of characters (code points) must not exceed the value of the attribute. |
| type | string | 'text' | HTML5 input type. |
| slotChar | string | '_' | Placeholder character in mask, default is underscore. |
| autoClear | boolean | true | Clears the incomplete value on blur. |
| showClear | boolean | false | When enabled, a clear icon is displayed to clear the value. |
| style | { [klass: string]: any } | - | Inline style of the input field. |
| inputId | string | - | Identifier of the focus input to match a label defined for the component. |
| styleClass | string | - | Style class of the input field. |
| placeholder | string | - | Advisory information to display on input. |
| tabindex | string | - | Specifies tab order of the element. |
| title | string | - | Title text of the input text. |
| ariaLabel | string | - | Used to define a string that labels the input element. |
| ariaLabelledBy | string | - | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| ariaRequired | boolean | - | Used to indicate that user input is required on an element before a form can be submitted. |
| readonly | boolean | - | When present, it specifies that an input field is read-only. |
| unmask | boolean | - | Defines if ngModel sets the raw unmasked value to bound value or the formatted mask value. |
| characterPattern | string | '[A-Za-z]' | Regex pattern for alpha characters |
| autofocus | boolean | - | When present, the input gets a focus automatically on load. |
| autocomplete | string | - | Used to define a string that autocomplete attribute the current element. |
| keepBuffer | boolean | false | When present, it specifies that whether to clean buffer value from model. |
| mask | string | - | Mask pattern. A backslash makes the next character a literal, e.g. mask="+\9 999" for a fixed '+9' prefix. |

### Emits

| Name | Parameters | Description |
|------|------------|-------------|
| onComplete | value: void | Callback to invoke when the mask is completed. |
| onFocus | event: Event | Callback to invoke when the component receives focus. |
| onBlur | event: Event | Callback to invoke when the component loses focus. |
| onInput | event: Event | Callback to invoke on input. |
| onKeydown | event: Event | Callback to invoke on input key press. |
| onClear | value: void | Callback to invoke when input field is cleared. |

### Templates

| Name | Type | Description |
|------|------|-------------|
| clearicon | TemplateRef<void> | Custom clear icon template. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| host | PassThroughOption<HTMLInputElement, I> | Used to pass attributes to the host's DOM element. |
| root | PassThroughOption<HTMLInputElement, I> | Used to pass attributes to the root's DOM element. |
| pcInputText | InputTextPassThrough | Used to pass attributes to the InputText component. |
| clearIcon | PassThroughOption<HTMLElement, I> | Used to pass attributes to the clear icon's DOM element. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-inputmask | Class name of the root element |
| p-inputmask-clear-icon | Class name of the clear icon element |

