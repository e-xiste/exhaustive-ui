# Angular Otp Input Component

Input Otp is used to enter one time passwords.

## Basic

Two-way value binding is defined using ngModel . The number of characters is defined with the length property, which is set to 4 by default.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputOtpModule } from '@exhaustive-ui/core/inputotp';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-input-otp [(ngModel)]="value" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputOtpModule]
})
export class InputotpBasicDemo {
    value: any;
}
```

## Mask

Enable the mask option to hide the values in the input fields.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputOtpModule } from '@exhaustive-ui/core/inputotp';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-input-otp [(ngModel)]="value" [mask]="true" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputOtpModule]
})
export class InputotpMaskDemo {
    value: any;
}
```

## Integer Only

When integerOnly is present, only integers can be accepted as input.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputOtpModule } from '@exhaustive-ui/core/inputotp';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-input-otp [(ngModel)]="value" [integerOnly]="true" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputOtpModule]
})
export class InputotpIntegeronlyDemo {
    value: any;
}
```

## Sizes

InputOtp provides small and large sizes as alternatives to the base.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputOtpModule } from '@exhaustive-ui/core/inputotp';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-4">
            <p-input-otp [(ngModel)]="value1" size="small" />
            <p-input-otp [(ngModel)]="value2" />
            <p-input-otp [(ngModel)]="value3" size="large" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputOtpModule]
})
export class InputotpSizesDemo {
    value1: any;

    value2: any;

    value3: any;
}
```

## Template

Define a template with your own UI elements with bindings to the provided events and attributes to replace the default design.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputOtpModule } from '@exhaustive-ui/core/inputotp';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-input-otp [(ngModel)]="value">
                <ng-template #input let-token let-events="events" let-index="index">
                    <input class="custom-otp-input" (keydown)="events.keydown($event)" (input)="events.input($event)" type="text" [attr.value]="token" [maxLength]="1" [attr.aria-label]="'Digit ' + index" />
                </ng-template>
            </p-input-otp>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputOtpModule]
})
export class InputotpTemplateDemo {
    value: any;
}
```

## Forms: Template Driven

```typescript
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { InputOtpModule } from '@exhaustive-ui/core/inputotp';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <p-input-otp #otpModel="ngModel" [(ngModel)]="value" [invalid]="otpModel.invalid && (otpModel.touched || exampleForm.submitted)" name="value" required [minlength]="4" />
                    @if (otpModel.invalid && (otpModel.touched || exampleForm.submitted)) {
                        <p-message severity="error" size="small" variant="simple">Passcode is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputOtpModule, ButtonModule, ToastModule, MessageModule],
    providers: [MessageService]
})
export class InputotpTemplatedrivenformsDemo {
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

## Reactive Forms

InputOtp can also be used with reactive forms. In this case, the formControlName property is used to bind the component to a form control.

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { InputOtpModule } from '@exhaustive-ui/core/inputotp';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <p-input-otp formControlName="value" [invalid]="isInvalid('value')" />
                    @if (isInvalid('value')) {
                        <p-message severity="error" size="small" variant="simple">Passcode is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [ReactiveFormsModule, InputOtpModule, ButtonModule, ToastModule, MessageModule],
    providers: [MessageService]
})
export class InputotpReactiveformsDemo {
    private fb = inject(FormBuilder);

    messageService = inject(MessageService);

    exampleForm: FormGroup | undefined;

    formSubmitted: boolean = false;

    constructor() {
        this.exampleForm = this.fb.group({
            value: ['', [Validators.required, Validators.minLength(4)]]
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

InputOtp can also be used with Angular Signal Forms , the @angular/forms/signals API of Angular 21 and newer. The form model is a signal, form() declares its validators and the [formField] directive binds the component to a field. The field also sets the invalid and touched states of the component, so it is styled as invalid once the field is touched or the form is submitted, like the messages below.

```typescript
import { Component, inject, signal } from '@angular/core';
import { form, FormField, minLength, required, submit } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { InputOtpModule } from '@exhaustive-ui/core/inputotp';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <p-input-otp [formField]="exampleForm.value" />
                    @let value = exampleForm.value();
                    @if (value.invalid() && value.touched()) {
                        <p-message severity="error" size="small" variant="simple">Passcode is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormField, InputOtpModule, ButtonModule, ToastModule, MessageModule],
    providers: [MessageService]
})
export class InputotpSignalformsDemo {
    messageService = inject(MessageService);

    model = signal({ value: '' });

    exampleForm = form(this.model, (f) => {
        required(f.value);
        minLength(f.value, 4);
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

## Sample

A sample UI implementation with templating and additional elements.

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputOtpModule } from '@exhaustive-ui/core/inputotp';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <div class="card flex justify-center">
            <div class="flex flex-col items-center">
                <div class="font-bold text-xl mb-2">Authenticate Your Account</div>
                <p class="text-muted-color block mb-8">Please enter the code sent to your phone.</p>
                <p-input-otp [(ngModel)]="value" [length]="6">
                    <ng-template #input let-token let-events="events" let-index="index">
                        <input type="text" [maxLength]="1" (input)="events.input($event)" (keydown)="events.keydown($event)" [attr.value]="token" class="custom-otp-input" [attr.aria-label]="'Digit ' + index" />
                        <div *ngIf="index === 3" class="px-4">
                            <i class="pi pi-minus"></i>
                        </div>
                    </ng-template>
                </p-input-otp>
                <div class="flex justify-between mt-8 self-stretch">
                    <p-button label="Resend Code" [link]="true" class="p-0" />
                    <p-button label="Submit Code" />
                </div>
            </div>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, InputOtpModule, ButtonModule]
})
export class InputotpSampleDemo {
    value: any;
}
```

## Accessibility

Screen Reader Input OTP uses a set of InputText components, refer to the InputText component for more information about the screen reader support.

## Input Otp

Input Otp is used to enter one time passwords.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | InputOtpPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| required | boolean | false | There must be a value (if set). |
| invalid | boolean | false | When present, it specifies that the component should have invalid state style. |
| touched | boolean | undefined | Whether the field has been touched. Signal Forms sets it through  `[formField]` : the invalid style and  `aria-invalid`  then wait until the field is touched, or the form is submitted, like the error messages. Left unset,  `invalid`  applies at once. |
| $invalid | Signal<boolean> | - | The invalid state shown by the component:  `invalid` , once the field is touched when  `touched`  is set; undefined when  `invalid`  is unset. |
| disabled | boolean | false | When present, it specifies that the component should have disabled state style. |
| name | string | undefined | When present, it specifies that the name of the input. |
| readonly | boolean | - | When present, it specifies that an input field is read-only. |
| tabindex | number | - | Index of the element in tabbing order. |
| length | number | 4 | Number of characters to initiate. |
| styleClass | string | - | Style class of the input element. |
| mask | boolean | false | Mask pattern. |
| integerOnly | boolean | false | When present, it specifies that an input field is integer-only. |
| autofocus | boolean | - | When present, it specifies that the component should automatically get focus on load. |
| variant | "outlined" \| "filled" | undefined | Specifies the input variant of the component. |
| size | "small" \| "large" | undefined | Specifies the size of the component. |

### Emits

| Name | Parameters | Description |
|------|------------|-------------|
| onChange | event: InputOtpChangeEvent | Callback to invoke on value change. |
| onFocus | event: Event | Callback to invoke when the component receives focus. |
| onBlur | event: Event | Callback to invoke when the component loses focus. |

### Templates

| Name | Type | Description |
|------|------|-------------|
| input | TemplateRef<InputOtpInputTemplateContext> | Custom input template. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| host | PassThroughOption<HTMLElement, I> | Used to pass attributes to the host's DOM element. |
| root | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the root's DOM element. |
| pcInputText | InputTextPassThrough | Used to pass attributes to the InputText component. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-inputotp | Class name of the root element |
| p-inputotp-input | Class name of the input element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| inputotp.gap | --p-inputotp-gap | Gap of root |
| inputotp.input.width | --p-inputotp-input-width | Width of input |
| inputotp.input.sm.width | --p-inputotp-input-sm-width | Width of input in small screens |
| inputotp.input.lg.width | --p-inputotp-input-lg-width | Width of input in large screens |

