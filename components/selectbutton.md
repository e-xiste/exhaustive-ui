# Angular SelectButton Component

SelectButton is used to choose single or multiple items from a list using buttons.

## Accessibility

Screen Reader The container element that wraps the buttons has a group role whereas each button element uses button role and aria-pressed is updated depending on selection state. Value to describe an option is automatically set as its aria-label from the label of the option resolved with optionLabel so it is still suggested to define a label even the option display consists of presentational content like icons only.

## Basic

SelectButton requires a value to bind and a collection of options.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from '@exhaustive-ui/core/selectbutton';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-select-button [options]="stateOptions" [(ngModel)]="value" optionLabel="label" optionValue="value" aria-labelledby="basic" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, SelectButtonModule]
})
export class SelectbuttonBasicDemo {
    stateOptions: any[] = [
        { label: 'One-Way', value: 'one-way' },
        { label: 'Return', value: 'return' }
    ];

    value: string = 'one-way';
}
```

## Disabled

When disabled is present, the element cannot be edited and focused entirely. Certain options can also be disabled using the optionDisabled property.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from '@exhaustive-ui/core/selectbutton';

@Component({
    template: `
        <div class="card flex justify-center flex-wrap gap-4">
            <p-select-button [options]="stateOptions" [(ngModel)]="value1" optionLabel="label" optionValue="value" [disabled]="true" />
            <p-select-button [options]="stateOptions2" [(ngModel)]="value2" optionLabel="label" optionValue="value" optionDisabled="constant" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, SelectButtonModule]
})
export class SelectbuttonDisabledDemo {
    stateOptions: any[] = [
        { label: 'Off', value: 'off' },
        { label: 'On', value: 'on' }
    ];

    stateOptions2: any[] = [
        { label: 'Option 1', value: 'Option 1' },
        { label: 'Option 2', value: 'Option 2', constant: true }
    ];

    value1: string = 'off';

    value2: string = 'Option 1';
}
```

## Fluid

The fluid prop makes the component take up the full width of its container when set to true.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from '@exhaustive-ui/core/selectbutton';

@Component({
    template: `
        <div class="card">
            <p-select-button [options]="stateOptions" [(ngModel)]="value" optionLabel="label" optionValue="value" fluid />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, SelectButtonModule]
})
export class SelectbuttonFluidDemo {
    stateOptions: any[] = [
        { label: 'One-Way', value: 'one-way' },
        { label: 'Return', value: 'return' }
    ];

    value: string = 'one-way';
}
```

## Invalid

The invalid state is applied using the ⁠invalid property to indicate failed validation, which can be integrated with Angular Forms.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from '@exhaustive-ui/core/selectbutton';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-select-button [options]="stateOptions" [(ngModel)]="value" optionLabel="label" optionValue="value" [invalid]="value === undefined" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, SelectButtonModule]
})
export class SelectbuttonInvalidDemo {
    stateOptions: any[] = [
        { label: 'One-Way', value: 'one-way' },
        { label: 'Return', value: 'return' }
    ];

    value: string | undefined;
}
```

## Multiple

SelectButton allows selecting only one item by default and setting multiple option enables choosing more than one item. In multiple case, model property should be an array.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from '@exhaustive-ui/core/selectbutton';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-select-button [options]="paymentOptions" [(ngModel)]="value" [multiple]="true" optionLabel="name" optionValue="value" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, SelectButtonModule]
})
export class SelectbuttonMultipleDemo {
    paymentOptions: any[] = [
        { name: 'Option 1', value: 1 },
        { name: 'Option 2', value: 2 },
        { name: 'Option 3', value: 3 }
    ];

    value!: number;
}
```

## reactiveforms-doc

SelectButton can also be used with reactive forms. In this case, the formControlName property is used to bind the component to a form control.

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '@exhaustive-ui/core/api';
import { SelectButtonModule } from '@exhaustive-ui/core/selectbutton';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <p-select-button [options]="stateOptions" formControlName="value" [invalid]="isInvalid('value')" optionLabel="label" optionValue="value" />
                    @if (isInvalid('value')) {
                        <p-message severity="error" size="small" variant="simple">Selection is required</p-message>
                    }
                </div>
                <button pButton type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [ReactiveFormsModule, SelectButtonModule, ToastModule, ButtonModule, MessageModule, CommonModule],
    providers: [MessageService]
})
export class SelectbuttonReactiveformsDemo {
    private fb = inject(FormBuilder);

    messageService = inject(MessageService);

    exampleForm: FormGroup | undefined;

    formSubmitted: boolean = false;

    stateOptions: any[] = [
        { label: 'One-Way', value: 'one-way' },
        { label: 'Return', value: 'return' }
    ];

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

SelectButton can also be used with Angular Signal Forms , the @angular/forms/signals API of Angular 21 and newer. The form model is a signal, form() declares its validators and the [formField] directive binds the component to a field. The field also sets the invalid and touched states of the component, so it is styled as invalid once the field is touched or the form is submitted, like the messages below.

```typescript
import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { SelectButtonModule } from '@exhaustive-ui/core/selectbutton';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <p-select-button [options]="stateOptions" [formField]="exampleForm.value" optionLabel="label" optionValue="value" />
                    @let value = exampleForm.value();
                    @if (value.invalid() && value.touched()) {
                        <p-message severity="error" size="small" variant="simple">Selection is required</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormField, SelectButtonModule, ButtonModule, ToastModule, MessageModule],
    providers: [MessageService]
})
export class SelectbuttonSignalformsDemo {
    messageService = inject(MessageService);

    stateOptions: any[] = [
        { label: 'One-Way', value: 'one-way' },
        { label: 'Return', value: 'return' }
    ];

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

SelectButton provides small and large sizes as alternatives to the base.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from '@exhaustive-ui/core/selectbutton';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-4">
            <p-select-button [(ngModel)]="value1" [options]="options" size="small" />
            <p-select-button [(ngModel)]="value2" [options]="options" />
            <p-select-button [(ngModel)]="value3" [options]="options" size="large" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, SelectButton]
})
export class SelectbuttonSizesDemo {
    value1!: string;

    value2: string = 'Beginner';

    value3: string = 'Expert';

    options: any[] = [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Expert', value: 'Expert' }
    ];
}
```

## Template

For custom content support define a template named item where the default local template variable refers to an option.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from '@exhaustive-ui/core/selectbutton';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-select-button [options]="justifyOptions" [(ngModel)]="value" optionLabel="justify">
                <ng-template #item let-item>
                    <i [class]="item.icon"></i>
                </ng-template>
            </p-select-button>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, SelectButton]
})
export class SelectbuttonTemplateDemo {
    value: any;

    justifyOptions: any[] = [
        { icon: 'pi pi-align-left', justify: 'Left' },
        { icon: 'pi pi-align-right', justify: 'Right' },
        { icon: 'pi pi-align-center', justify: 'Center' },
        { icon: 'pi pi-align-justify', justify: 'Justify' }
    ];
}
```

## templatedrivenforms-doc

```typescript
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '@exhaustive-ui/core/api';
import { SelectButton } from '@exhaustive-ui/core/selectbutton';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex justify-center flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <p-select-button #model="ngModel" [(ngModel)]="value" [options]="stateOptions" optionLabel="label" optionValue="value" [invalid]="model.invalid && (model.touched || exampleForm.submitted)" required name="value" />
                    @if (model.invalid && (model.touched || exampleForm.submitted)) {
                        <p-message severity="error" size="small" variant="simple">Selection is required.</p-message>
                    }
                </div>
                <button pButton type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, SelectButton, ToastModule, ButtonModule, MessageModule, CommonModule],
    providers: [MessageService]
})
export class SelectbuttonTemplatedrivenformsDemo {
    messageService = inject(MessageService);

    value: any;

    stateOptions: any[] = [
        { label: 'One-Way', value: 'one-way' },
        { label: 'Return', value: 'return' }
    ];

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
```

## Select Button

SelectButton is used to choose single or multiple items from a list using buttons.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | SelectButtonPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| required | boolean | false | There must be a value (if set). |
| invalid | boolean | false | When present, it specifies that the component should have invalid state style. |
| touched | boolean | undefined | Whether the field has been touched. Signal Forms sets it through  `[formField]` : the invalid style and  `aria-invalid`  then wait until the field is touched, or the form is submitted, like the error messages. Left unset,  `invalid`  applies at once. |
| $invalid | Signal<boolean> | - | The invalid state shown by the component:  `invalid` , once the field is touched when  `touched`  is set; undefined when  `invalid`  is unset. |
| disabled | boolean | false | When present, it specifies that the component should have disabled state style. |
| name | string | undefined | When present, it specifies that the name of the input. |
| options | any[] | - | An array of selectitems to display as the available options. |
| optionLabel | string | - | Name of the label field of an option. |
| optionValue | string | - | Name of the value field of an option. |
| optionDisabled | string | - | Name of the disabled field of an option. |
| unselectable | boolean | false | Whether selection can be cleared. |
| multiple | boolean | - | When specified, allows selecting multiple values. |
| allowEmpty | boolean | true | Whether selection can not be cleared. |
| styleClass | string | - | Style class of the component. |
| ariaLabelledBy | string | - | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| dataKey | string | - | A property to uniquely identify a value in options. |
| autofocus | boolean | - | When present, it specifies that the component should automatically get focus on load. |
| size | "small" \| "large" | undefined | Specifies the size of the component. |
| fluid | boolean | undefined | Spans 100% width of the container when enabled. |

### Emits

| Name | Parameters | Description |
|------|------------|-------------|
| onOptionClick | event: SelectButtonOptionClickEvent | Callback to invoke on input click. |
| onChange | event: SelectButtonChangeEvent | Callback to invoke on selection change. |

### Templates

| Name | Type | Description |
|------|------|-------------|
| item | TemplateRef<SelectButtonItemTemplateContext> | Custom item template. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| host | PassThroughOption<HTMLElement, I> | Used to pass attributes to the host's DOM element. |
| root | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the root's DOM element. |
| pcToggleButton | ToggleButtonPassThrough | Used to pass attributes to the ToggleButton component. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-selectbutton | Class name of the root element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| selectbutton.border.radius | --p-selectbutton-border-radius | Border radius of root |
| selectbutton.invalid.border.color | --p-selectbutton-invalid-border-color | Invalid border color of root |

