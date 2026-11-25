# Angular Rating Component

Rating component is a star based selection input.

## Accessibility

Screen Reader Rating component internally uses radio buttons that are only visible to screen readers. The value to read for item is retrieved from the locale API via star and stars of the aria property.

## Basic

Two-way value binding is defined using ngModel .

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from '@exhaustive-ui/core/rating';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-rating [(ngModel)]="value" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RatingModule]
})
export class RatingBasicDemo {
    value!: number;
}
```

## Disabled

When disabled is present, a visual hint is applied to indicate that the Knob cannot be interacted with.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from '@exhaustive-ui/core/rating';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-rating [(ngModel)]="value" [disabled]="true" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RatingModule]
})
export class RatingDisabledDemo {
    value: number = 5;
}
```

## Number of Stars

Number of stars to display is defined with stars property.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from '@exhaustive-ui/core/rating';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-rating [(ngModel)]="value" [stars]="10" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RatingModule]
})
export class RatingNumberofstarsDemo {
    value: number = 5;
}
```

## reactiveforms-doc

Rating can also be used with reactive forms. In this case, the formControlName property is used to bind the component to a form control.

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '@exhaustive-ui/core/api';
import { RatingModule } from '@exhaustive-ui/core/rating';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 w-40">
                <div class="flex flex-col items-center gap-2">
                    <p-rating formControlName="ratingValue" [invalid]="isInvalid('ratingValue')" />
                    @if (isInvalid('ratingValue')) {
                        <p-message severity="error" size="small" variant="simple">Value is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [ReactiveFormsModule, RatingModule, ButtonModule, ToastModule, MessageModule, CommonModule],
    providers: [MessageService]
})
export class RatingReactiveformsDemo {
    private fb = inject(FormBuilder);

    messageService = inject(MessageService);

    exampleForm: FormGroup | undefined;

    formSubmitted = false;

    constructor() {
        this.exampleForm = this.fb.group({
            ratingValue: [undefined, Validators.required]
        });
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
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

## Readonly

When readonly present, value cannot be edited.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from '@exhaustive-ui/core/rating';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-rating [(ngModel)]="value" [readonly]="true" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RatingModule]
})
export class RatingReadonlyDemo {
    value: number = 3;
}
```

## Signal Forms

Rating can also be used with Angular Signal Forms , the @angular/forms/signals API of Angular 21 and newer. The form model is a signal, form() declares its validators and the [formField] directive binds the component to a field. The field also sets the invalid and touched states of the component, so it is styled as invalid once the field is touched or the form is submitted, like the messages below.

```typescript
import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { RatingModule } from '@exhaustive-ui/core/rating';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4 w-40">
                <div class="flex flex-col items-center gap-2">
                    <p-rating [formField]="exampleForm.ratingValue" />
                    @let ratingValue = exampleForm.ratingValue();
                    @if (ratingValue.invalid() && ratingValue.touched()) {
                        <p-message severity="error" size="small" variant="simple">Value is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormField, RatingModule, ButtonModule, ToastModule, MessageModule],
    providers: [MessageService]
})
export class RatingSignalformsDemo {
    messageService = inject(MessageService);

    model = signal<{ ratingValue: number | null }>({ ratingValue: null });

    exampleForm = form(this.model, (f) => {
        required(f.ratingValue);
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.exampleForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm().reset({ ratingValue: null });
        });
    }
}
```

## Template

Templating allows customizing the content where the icon instance is available as the implicit variable.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from '@exhaustive-ui/core/rating';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-rating [(ngModel)]="value">
                <ng-template #onicon>
                    <img src="https://exhaustive-ui.com/demo/rating/custom-icon-active.png" alt="" height="24" width="24" />
                </ng-template>
                <ng-template #officon>
                    <img src="https://exhaustive-ui.com/demo/rating/custom-icon.png" alt="" height="24" width="24" />
                </ng-template>
            </p-rating>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RatingModule]
})
export class RatingTemplateDemo {
    value!: number;
}
```

## templatedrivenforms-doc

```typescript
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '@exhaustive-ui/core/api';
import { RatingModule } from '@exhaustive-ui/core/rating';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex flex-col gap-4 w-40">
                <div class="flex flex-col items-center gap-2">
                    <p-rating #ratingValue="ngModel" [(ngModel)]="value" required name="ratingValue" [invalid]="ratingValue.invalid && (ratingValue.touched || exampleForm.submitted)" />
                    @if (ratingValue.invalid && (ratingValue.touched || exampleForm.submitted)) {
                        <p-message severity="error" size="small" variant="simple">Value is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RatingModule, ButtonModule, ToastModule, MessageModule, CommonModule],
    providers: [MessageService]
})
export class RatingTemplatedrivenformsDemo {
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

## Rating

Rating is an extension to standard radio button element with theming.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | RatingPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| required | boolean | false | There must be a value (if set). |
| invalid | boolean | false | When present, it specifies that the component should have invalid state style. |
| touched | boolean | undefined | Whether the field has been touched. Signal Forms sets it through  `[formField]` : the invalid style and  `aria-invalid`  then wait until the field is touched, or the form is submitted, like the error messages. Left unset,  `invalid`  applies at once. |
| $invalid | Signal<boolean> | - | The invalid state shown by the component:  `invalid` , once the field is touched when  `touched`  is set; undefined when  `invalid`  is unset. |
| disabled | boolean | false | When present, it specifies that the component should have disabled state style. |
| name | string | undefined | When present, it specifies that the name of the input. |
| readonly | boolean | - | When present, changing the value is not possible. |
| stars | number | 5 | Number of stars. |
| iconOnClass | string | - | Style class of the on icon. |
| iconOnStyle | { [klass: string]: any } | - | Inline style of the on icon. |
| iconOffClass | string | - | Style class of the off icon. |
| iconOffStyle | { [klass: string]: any } | - | Inline style of the off icon. |
| autofocus | boolean | - | When present, it specifies that the component should automatically get focus on load. |

### Emits

| Name | Parameters | Description |
|------|------------|-------------|
| onRate | event: RatingRateEvent | Emitted on value change. |
| onFocus | event: FocusEvent | Emitted when the rating receives focus. |
| onBlur | event: FocusEvent | Emitted when the rating loses focus. |

### Templates

| Name | Type | Description |
|------|------|-------------|
| onicon | TemplateRef<RatingIconTemplateContext> | Custom on icon template. |
| officon | TemplateRef<RatingIconTemplateContext> | Custom off icon template. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| host | PassThroughOption<HTMLElement, I> | Used to pass attributes to the host's DOM element. |
| root | PassThroughOption<HTMLElement, I> | Used to pass attributes to the root's DOM element. |
| option | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the option's DOM element. |
| onIcon | PassThroughOption<HTMLElement, I> | Used to pass attributes to the on icon's DOM element. |
| offIcon | PassThroughOption<HTMLElement, I> | Used to pass attributes to the off icon's DOM element. |
| hiddenOptionInputContainer | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the hidden option input container's DOM element. |
| hiddenOptionInput | PassThroughOption<HTMLInputElement, I> | Used to pass attributes to the hidden option input's DOM element. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-rating | Class name of the root element |
| p-rating-option | Class name of the option element |
| p-rating-on-icon | Class name of the on icon element |
| p-rating-off-icon | Class name of the off icon element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| rating.gap | --p-rating-gap | Gap of root |
| rating.transition.duration | --p-rating-transition-duration | Transition duration of root |
| rating.focus.ring.width | --p-rating-focus-ring-width | Focus ring width of root |
| rating.focus.ring.style | --p-rating-focus-ring-style | Focus ring style of root |
| rating.focus.ring.color | --p-rating-focus-ring-color | Focus ring color of root |
| rating.focus.ring.offset | --p-rating-focus-ring-offset | Focus ring offset of root |
| rating.focus.ring.shadow | --p-rating-focus-ring-shadow | Focus ring shadow of root |
| rating.icon.size | --p-rating-icon-size | Size of icon |
| rating.icon.color | --p-rating-icon-color | Color of icon |
| rating.icon.hover.color | --p-rating-icon-hover-color | Hover color of icon |
| rating.icon.active.color | --p-rating-icon-active-color | Active color of icon |

