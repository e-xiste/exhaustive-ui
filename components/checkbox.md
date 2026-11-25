# Angular Checkbox Component

Checkbox is an extension to standard checkbox element with theming.

## Accessibility

Screen Reader Checkbox component uses a hidden native checkbox element internally that is only visible to screen readers. Value to describe the component can either be provided via label tag combined with inputId prop or using ariaLabelledBy , ariaLabel props.

## Basic

Binary checkbox is used as a controlled input with ngModel and binary properties.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from '@exhaustive-ui/core/checkbox';

@Component({
    template: `
        <div class="card flex justify-center gap-4">
            <p-checkbox [(ngModel)]="checked" [binary]="true" ariaLabel="Accept" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, CheckboxModule]
})
export class CheckboxBasicDemo {
    checked: any = null;
}
```

## Disabled

When disabled is present, the element cannot be edited and focused.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from '@exhaustive-ui/core/checkbox';

@Component({
    template: `
        <div class="card flex justify-center gap-2">
            <p-checkbox [(ngModel)]="checked1" [binary]="true" ariaLabel="Unchecked option" [disabled]="true" />
            <p-checkbox [(ngModel)]="checked2" [binary]="true" ariaLabel="Checked option" [disabled]="true" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, CheckboxModule]
})
export class CheckboxDisabledDemo {
    checked1: boolean = false;

    checked2: boolean = true;
}
```

## Dynamic

Checkboxes can be generated using a list of values.

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from '@exhaustive-ui/core/checkbox';

@Component({
    template: `
        <div class="card flex justify-center">
            <div class="flex flex-col gap-4">
                <div *ngFor="let category of categories" class="flex items-center">
                    <p-checkbox [inputId]="category.key" name="group" [value]="category" [(ngModel)]="selectedCategories" />
                    <label [for]="category.key" class="ml-2"> {{ category.name }} </label>
                </div>
            </div>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, CheckboxModule]
})
export class CheckboxDynamicDemo {
    selectedCategories: any[] = [];

    categories: any[] = [
        { name: 'Accounting', key: 'A' },
        { name: 'Marketing', key: 'M' },
        { name: 'Production', key: 'P' },
        { name: 'Research', key: 'R' }
    ];

    ngOnInit() {
        this.selectedCategories = [this.categories[1]];
    }
}
```

## Filled

Specify the variant property as filled to display the component with a higher visual emphasis than the default outlined style.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from '@exhaustive-ui/core/checkbox';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-checkbox [(ngModel)]="checked" [binary]="true" variant="filled" ariaLabel="Accept" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, CheckboxModule]
})
export class CheckboxFilledDemo {
    checked: boolean = false;
}
```

## Indeterminate

The indeterminate state indicates that a checkbox is neither "on" or "off".

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from '@exhaustive-ui/core/checkbox';

@Component({
    template: `
        <div class="card flex justify-center gap-4">
            <p-checkbox [(ngModel)]="checked" [binary]="true" [indeterminate]="true" ariaLabel="Select all" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, CheckboxModule]
})
export class CheckboxIndeterminateDemo {
    checked: any = null;
}
```

## Invalid

The invalid state is applied using the ⁠invalid property to indicate failed validation, which can be integrated with Angular Forms.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from '@exhaustive-ui/core/checkbox';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-checkbox [(ngModel)]="checked" [binary]="true" [invalid]="!checked" ariaLabel="Accept" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, CheckboxModule]
})
export class CheckboxInvalidDemo {
    checked: boolean = false;
}
```

## multiple-doc

Multiple checkboxes can be grouped together.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from '@exhaustive-ui/core/checkbox';

@Component({
    template: `
        <div class="card flex flex-wrap justify-center gap-4">
            <div class="flex items-center">
                <p-checkbox inputId="ingredient1" name="pizza" value="Cheese" [(ngModel)]="pizza" />
                <label for="ingredient1" class="ml-2"> Cheese </label>
            </div>
            <div class="flex items-center">
                <p-checkbox inputId="ingredient2" name="pizza" value="Mushroom" [(ngModel)]="pizza" />
                <label for="ingredient2" class="ml-2"> Mushroom </label>
            </div>
            <div class="flex items-center">
                <p-checkbox inputId="ingredient3" name="pizza" value="Pepper" [(ngModel)]="pizza" />
                <label for="ingredient3" class="ml-2"> Pepper </label>
            </div>
            <div class="flex items-center">
                <p-checkbox inputId="ingredient4" name="pizza" value="Onion" [(ngModel)]="pizza" />
                <label for="ingredient4" class="ml-2"> Onion </label>
            </div>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, CheckboxModule]
})
export class CheckboxMultipleDemo {
    pizza: string[] = [];
}
```

## reactiveforms-doc

Checkbox can also be used with reactive forms. In this case, the formControlName property is used to bind the component to a form control.

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { CheckboxModule } from '@exhaustive-ui/core/checkbox';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                <div class="flex flex-wrap gap-4">
                    @for (item of formKeys; track item) {
                        <div class="flex items-center gap-2">
                            <p-checkbox [formControlName]="item" [binary]="true" [inputId]="item" [invalid]="isInvalid(item)" />
                            <label [for]="item"> {{ item | titlecase }} </label>
                        </div>
                    }
                </div>
                @if (hasAnyInvalid()) {
                    <p-message severity="error" size="small" variant="simple"> At least one ingredient must be selected. </p-message>
                }
                <button pButton severity="secondary" type="submit">
                    <span pButtonLabel>Submit</span>
                </button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, CheckboxModule, ButtonModule, ToastModule, MessageModule],
    providers: [MessageService]
})
export class CheckboxReactiveformsDemo {
    private fb = inject(FormBuilder);

    messageService = inject(MessageService);

    formSubmitted: boolean = false;

    exampleForm: FormGroup;

    constructor() {
        this.exampleForm = this.fb.group(
            {
                cheese: [false],
                mushroom: [false],
                pepper: [false],
                onion: [false]
            },
            { validators: this.atLeastOneSelectedValidator }
        );
    }

    get formKeys(): string[] {
        return Object.keys(this.exampleForm.controls);
    }

    atLeastOneSelectedValidator(group: FormGroup): { [key: string]: any } | null {
        const anySelected = Object.values(group.controls).some((control) => control.value === true);
        return anySelected ? null : { atLeastOneRequired: true };
    }

    hasAnyInvalid(): boolean {
        return this.formSubmitted && this.exampleForm.hasError('atLeastOneRequired');
    }

    isInvalid(controlName: string): boolean {
        const control = this.exampleForm.get(controlName);
        return this.formSubmitted && this.exampleForm.hasError('atLeastOneRequired') && control?.value === false;
    }

    onSubmit() {
        this.formSubmitted = true;

        if (this.exampleForm.valid) {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Form is submitted',
                life: 3000
            });

            this.exampleForm.reset({
                cheese: false,
                mushroom: false,
                pepper: false,
                onion: false
            });

            this.formSubmitted = false;
        }
    }
}
```

## Signal Forms

Checkbox can also be used with Angular Signal Forms , the @angular/forms/signals API of Angular 21 and newer. The form model is a signal, form() declares its validators and the [formField] directive binds the component to a field. The field also sets the invalid and touched states of the component, so it is styled as invalid once the field is touched or the form is submitted, like the messages below.

```typescript
import { Component, inject, signal } from '@angular/core';
import { form, FormField, submit, validate } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { CheckboxModule } from '@exhaustive-ui/core/checkbox';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

type Ingredient = 'cheese' | 'mushroom' | 'pepper' | 'onion';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4">
                <div class="flex flex-wrap gap-4">
                    @for (item of formKeys; track item) {
                        <div class="flex items-center gap-2">
                            <p-checkbox [formField]="exampleForm[item]" [binary]="true" [inputId]="item" />
                            <label [for]="item" class="capitalize"> {{ item }} </label>
                        </div>
                    }
                </div>
                @if (exampleForm().invalid() && exampleForm().touched()) {
                    <p-message severity="error" size="small" variant="simple"> At least one ingredient must be selected. </p-message>
                }
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormField, CheckboxModule, ButtonModule, ToastModule, MessageModule],
    providers: [MessageService]
})
export class CheckboxSignalformsDemo {
    messageService = inject(MessageService);

    formKeys: Ingredient[] = ['cheese', 'mushroom', 'pepper', 'onion'];

    model = signal({ cheese: false, mushroom: false, pepper: false, onion: false });

    exampleForm = form(this.model, (f) => {
        validate(f, ({ value }) => (Object.values(value()).some(Boolean) ? null : { kind: 'atLeastOneRequired' }));
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.exampleForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm().reset({ cheese: false, mushroom: false, pepper: false, onion: false });
        });
    }
}
```

## Sizes

Checkbox provides small and large sizes as alternatives to the base.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from '@exhaustive-ui/core/checkbox';

@Component({
    template: `
        <div class="card flex flex-wrap justify-center gap-4">
            <div class="flex items-center gap-2">
                <p-checkbox [(ngModel)]="size" inputId="size_small" name="size" value="Small" size="small" />
                <label for="size_small" class="text-sm">Small</label>
            </div>
            <div class="flex items-center gap-2">
                <p-checkbox [(ngModel)]="size" inputId="size_normal" name="size" value="Normal" />
                <label for="size_normal">Normal</label>
            </div>
            <div class="flex items-center gap-2">
                <p-checkbox [(ngModel)]="size" inputId="size_large" name="size" value="Large" size="large" />
                <label for="size_large" class="text-lg">Large</label>
            </div>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, CheckboxModule]
})
export class CheckboxSizesDemo {
    size: any = null;
}
```

## templatedrivenforms-doc

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { CheckboxModule } from '@exhaustive-ui/core/checkbox';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form #form="ngForm" (ngSubmit)="onSubmit(form)" class="flex flex-col gap-4">
                <div class="flex flex-wrap gap-4">
                    @for (item of formKeys; track item) {
                        <div class="flex items-center gap-2">
                            <p-checkbox [inputId]="item" [name]="item" [(ngModel)]="formModel[item]" [binary]="true" [invalid]="isInvalid()"></p-checkbox>
                            <label [for]="item">{{ item | titlecase }}</label>
                        </div>
                    }
                </div>
                @if (isInvalid()) {
                    <p-message severity="error" size="small" variant="simple"> At least one ingredient must be selected. </p-message>
                }
                <button pButton severity="secondary" type="submit">
                    <span pButtonLabel>Submit</span>
                </button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, CheckboxModule, ButtonModule, ToastModule, MessageModule],
    providers: [MessageService]
})
export class CheckboxTemplatedrivenformsDemo {
    messageService = inject(MessageService);

    formSubmitted: boolean = false;

    formModel = {
        cheese: false,
        mushroom: false,
        pepper: false,
        onion: false
    };

    get formKeys(): string[] {
        return Object.keys(this.formModel);
    }

    isInvalid(): boolean {
        return this.formSubmitted && !this.isAtLeastOneSelected();
    }

    isAtLeastOneSelected(): boolean {
        return Object.values(this.formModel).some((value) => value === true);
    }

    onSubmit(form: NgForm) {
        this.formSubmitted = true;

        if (this.isAtLeastOneSelected()) {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Form is submitted',
                life: 3000
            });

            this.formModel = {
                cheese: false,
                mushroom: false,
                pepper: false,
                onion: false
            };
            form.resetForm(this.formModel);

            this.formSubmitted = false;
        }
    }
}
```

## Checkbox

Checkbox is an extension to standard checkbox element with theming.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | CheckboxPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| required | boolean | false | There must be a value (if set). |
| invalid | boolean | false | When present, it specifies that the component should have invalid state style. |
| touched | boolean | undefined | Whether the field has been touched. Signal Forms sets it through  `[formField]` : the invalid style and  `aria-invalid`  then wait until the field is touched, or the form is submitted, like the error messages. Left unset,  `invalid`  applies at once. |
| $invalid | Signal<boolean> | - | The invalid state shown by the component:  `invalid` , once the field is touched when  `touched`  is set; undefined when  `invalid`  is unset. |
| disabled | boolean | false | When present, it specifies that the component should have disabled state style. |
| name | string | undefined | When present, it specifies that the name of the input. |
| value | any | - | Value of the checkbox. |
| binary | boolean | - | Allows to select a boolean value instead of multiple values. |
| ariaLabelledBy | string | - | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| ariaLabel | string | - | Used to define a string that labels the input element. |
| tabindex | number | - | Index of the element in tabbing order. |
| inputId | string | - | Identifier of the focus input to match a label defined for the component. |
| inputStyle | { [klass: string]: any } | - | Inline style of the input element. |
| inputClass | string | - | Style class of the input element. |
| indeterminate | boolean | false | When present, it specifies input state as indeterminate. |
| formControl | FormControl<any> | - | Form control value. |
| checkboxIcon | string | - | Icon class of the checkbox icon. |
| readonly | boolean | - | When present, it specifies that the component cannot be edited. |
| autofocus | boolean | - | When present, it specifies that the component should automatically get focus on load. |
| trueValue | any | true | Value in checked state. |
| falseValue | any | false | Value in unchecked state. |
| variant | "outlined" \| "filled" | undefined | Specifies the input variant of the component. |
| size | "small" \| "large" | undefined | Specifies the size of the component. |

### Emits

| Name | Parameters | Description |
|------|------------|-------------|
| onChange | event: CheckboxChangeEvent | Callback to invoke on value change. |
| onFocus | event: Event | Callback to invoke when the receives focus. |
| onBlur | event: Event | Callback to invoke when the loses focus. |

### Templates

| Name | Type | Description |
|------|------|-------------|
| icon | TemplateRef<CheckboxIconTemplateContext> | Custom checkbox icon template. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| root | PassThroughOption<HTMLElement, I> | Used to pass attributes to the root's DOM element. |
| input | PassThroughOption<HTMLInputElement, I> | Used to pass attributes to the input's DOM element. |
| box | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the box's DOM element. |
| icon | PassThroughOption<HTMLElement, I> | Used to pass attributes to the icon's DOM element. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-checkbox | Class name of the root element |
| p-checkbox-box | Class name of the box element |
| p-checkbox-input | Class name of the input element |
| p-checkbox-icon | Class name of the icon element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| checkbox.border.radius | --p-checkbox-border-radius | Border radius of root |
| checkbox.width | --p-checkbox-width | Width of root |
| checkbox.height | --p-checkbox-height | Height of root |
| checkbox.background | --p-checkbox-background | Background of root |
| checkbox.checked.background | --p-checkbox-checked-background | Checked background of root |
| checkbox.checked.hover.background | --p-checkbox-checked-hover-background | Checked hover background of root |
| checkbox.disabled.background | --p-checkbox-disabled-background | Disabled background of root |
| checkbox.filled.background | --p-checkbox-filled-background | Filled background of root |
| checkbox.border.color | --p-checkbox-border-color | Border color of root |
| checkbox.hover.border.color | --p-checkbox-hover-border-color | Hover border color of root |
| checkbox.focus.border.color | --p-checkbox-focus-border-color | Focus border color of root |
| checkbox.checked.border.color | --p-checkbox-checked-border-color | Checked border color of root |
| checkbox.checked.hover.border.color | --p-checkbox-checked-hover-border-color | Checked hover border color of root |
| checkbox.checked.focus.border.color | --p-checkbox-checked-focus-border-color | Checked focus border color of root |
| checkbox.checked.disabled.border.color | --p-checkbox-checked-disabled-border-color | Checked disabled border color of root |
| checkbox.invalid.border.color | --p-checkbox-invalid-border-color | Invalid border color of root |
| checkbox.shadow | --p-checkbox-shadow | Shadow of root |
| checkbox.focus.ring.width | --p-checkbox-focus-ring-width | Focus ring width of root |
| checkbox.focus.ring.style | --p-checkbox-focus-ring-style | Focus ring style of root |
| checkbox.focus.ring.color | --p-checkbox-focus-ring-color | Focus ring color of root |
| checkbox.focus.ring.offset | --p-checkbox-focus-ring-offset | Focus ring offset of root |
| checkbox.focus.ring.shadow | --p-checkbox-focus-ring-shadow | Focus ring shadow of root |
| checkbox.transition.duration | --p-checkbox-transition-duration | Transition duration of root |
| checkbox.sm.width | --p-checkbox-sm-width | Sm width of root |
| checkbox.sm.height | --p-checkbox-sm-height | Sm height of root |
| checkbox.lg.width | --p-checkbox-lg-width | Lg width of root |
| checkbox.lg.height | --p-checkbox-lg-height | Lg height of root |
| checkbox.icon.size | --p-checkbox-icon-size | Size of icon |
| checkbox.icon.color | --p-checkbox-icon-color | Color of icon |
| checkbox.icon.checked.color | --p-checkbox-icon-checked-color | Checked color of icon |
| checkbox.icon.checked.hover.color | --p-checkbox-icon-checked-hover-color | Checked hover color of icon |
| checkbox.icon.disabled.color | --p-checkbox-icon-disabled-color | Disabled color of icon |
| checkbox.icon.sm.size | --p-checkbox-icon-sm-size | Sm size of icon |
| checkbox.icon.lg.size | --p-checkbox-icon-lg-size | Lg size of icon |

