# Angular RadioButton Component

RadioButton is an extension to standard radio button element with theming.

## Group

RadioButton is used as a controlled input with value and ngModel properties.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from '@exhaustive-ui/core/radiobutton';

@Component({
    template: `
        <div class="card flex justify-center">
            <div class="flex flex-wrap gap-4">
                <div class="flex items-center">
                    <p-radio-button name="pizza" value="Cheese" [(ngModel)]="ingredient" inputId="ingredient1" />
                    <label for="ingredient1" class="ml-2">Cheese</label>
                </div>
                <div class="flex items-center">
                    <p-radio-button name="pizza" value="Mushroom" [(ngModel)]="ingredient" inputId="ingredient2" />
                    <label for="ingredient2" class="ml-2">Mushroom</label>
                </div>
                <div class="flex items-center">
                    <p-radio-button name="pizza" value="Pepper" [(ngModel)]="ingredient" inputId="ingredient3" />
                    <label for="ingredient3" class="ml-2">Pepper</label>
                </div>
                <div class="flex items-center">
                    <p-radio-button name="pizza" value="Onion" [(ngModel)]="ingredient" inputId="ingredient4" />
                    <label for="ingredient4" class="ml-2">Onion</label>
                </div>
            </div>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RadioButtonModule]
})
export class RadiobuttonGroupDemo {
    ingredient!: string;
}
```

## Dynamic

RadioButtons can be generated using a list of values.

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from '@exhaustive-ui/core/radiobutton';

@Component({
    template: `
        <div class="card flex justify-center">
            <div class="flex flex-col gap-4">
                <div *ngFor="let category of categories" class="field-checkbox">
                    <p-radio-button [inputId]="category.key" name="category" [value]="category" [(ngModel)]="selectedCategory" />
                    <label [for]="category.key" class="ml-2">{{ category.name }}</label>
                </div>
            </div>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, RadioButtonModule]
})
export class RadiobuttonDynamicDemo implements OnInit {
    selectedCategory: any = null;

    categories: any[] = [
        { name: 'Accounting', key: 'A' },
        { name: 'Marketing', key: 'M' },
        { name: 'Production', key: 'P' },
        { name: 'Research', key: 'R' }
    ];

    ngOnInit() {
        this.selectedCategory = this.categories[1];
    }
}
```

## Filled

Specify the variant property as filled to display the component with a higher visual emphasis than the default outlined style.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from '@exhaustive-ui/core/radiobutton';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-radio-button [(ngModel)]="checked" variant="filled" ariaLabel="Option" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RadioButtonModule]
})
export class RadiobuttonFilledDemo {
    checked: boolean = false;
}
```

## Sizes

RadioButton provides small and large sizes as alternatives to the base.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from '@exhaustive-ui/core/radiobutton';

@Component({
    template: `
        <div class="card flex justify-center">
            <div class="flex flex-wrap gap-4">
                <div class="flex items-center gap-2">
                    <p-radio-button [(ngModel)]="size" inputId="size_small" name="size" value="Small" size="small" />
                    <label for="size_small" class="text-sm">Small</label>
                </div>
                <div class="flex items-center gap-2">
                    <p-radio-button [(ngModel)]="size" inputId="size_normal" name="size" value="Normal" />
                    <label for="size_normal">Normal</label>
                </div>
                <div class="flex items-center gap-2">
                    <p-radio-button [(ngModel)]="size" inputId="size_large" name="size" value="Large" size="large" />
                    <label for="size_large" class="text-lg">Large</label>
                </div>
            </div>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RadioButtonModule]
})
export class RadiobuttonSizesDemo {
    size: any = false;
}
```

## Disabled

When disabled is present, the element cannot be edited and focused.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from '@exhaustive-ui/core/radiobutton';

@Component({
    template: `
        <div class="card flex justify-center gap-2">
            <p-radio-button [(ngModel)]="value" [value]="1" [disabled]="true" ariaLabel="Option 1" />
            <p-radio-button [(ngModel)]="value" [value]="2" [disabled]="true" ariaLabel="Option 2" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RadioButtonModule]
})
export class RadiobuttonDisabledDemo {
    value: number = 2;
}
```

## Invalid

The invalid state is applied using the ⁠invalid property to indicate failed validation, which can be integrated with Angular Forms.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from '@exhaustive-ui/core/radiobutton';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-radio-button [(ngModel)]="value" [invalid]="!value" ariaLabel="Option" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RadioButtonModule]
})
export class RadiobuttonInvalidDemo {
    value: boolean = false;
}
```

## Forms: Template Driven

```typescript
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '@exhaustive-ui/core/api';
import { RadioButtonModule } from '@exhaustive-ui/core/radiobutton';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex flex-col gap-4">
                <div class="flex flex-wrap gap-4">
                    @for (category of categories; track category.name) {
                        <div class="flex items-center gap-2">
                            <p-radio-button [(ngModel)]="ingredient" [inputId]="category.key" [value]="category" [invalid]="isInvalid(exampleForm)" name="ingredient" />
                            <label [for]="category.key"> {{ category.name }} </label>
                        </div>
                    }
                </div>
                @if (isInvalid(exampleForm)) {
                    <p-message severity="error" size="small" variant="simple"> At least one ingredient must be selected. </p-message>
                }
                <button pButton severity="secondary" type="submit">
                    <span pButtonLabel>Submit</span>
                </button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RadioButtonModule, ButtonModule, ToastModule, MessageModule, CommonModule],
    providers: [MessageService]
})
export class RadiobuttonTemplatedrivenformsDemo {
    messageService = inject(MessageService);

    formSubmitted: boolean = false;

    ingredient!: any;

    categories: any[] = [
        { name: 'Cheese', key: 'C' },
        { name: 'Mushroom', key: 'M' },
        { name: 'Pepper', key: 'P' },
        { name: 'Onion', key: 'O' }
    ];

    isInvalid(form: NgForm) {
        return !this.ingredient && form.submitted;
    }

    onSubmit(form: NgForm) {
        if (!this.isInvalid(form)) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
```

## Reactive Forms

RadioButton can also be used with reactive forms. In this case, the formControlName property is used to bind the component to a form control.

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '@exhaustive-ui/core/api';
import { RadioButtonModule } from '@exhaustive-ui/core/radiobutton';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                <div class="flex flex-wrap gap-4">
                    @for (category of categories; track category.key) {
                        <div class="flex items-center gap-2">
                            <p-radio-button formControlName="selectedCategory" name="selectedCategory" [inputId]="category.key" [value]="category" [invalid]="isInvalid('selectedCategory')" />
                            <label [for]="category.key"> {{ category.name }} </label>
                        </div>
                    }
                </div>
                @if (isInvalid('selectedCategory')) {
                    <p-message severity="error" size="small" variant="simple"> At least one ingredient must be selected. </p-message>
                }
                <button pButton severity="secondary" type="submit">
                    <span pButtonLabel>Submit</span>
                </button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [ReactiveFormsModule, RadioButtonModule, ButtonModule, ToastModule, MessageModule, CommonModule],
    providers: [MessageService]
})
export class RadiobuttonReactiveformsDemo {
    private fb = inject(FormBuilder);

    messageService = inject(MessageService);

    formSubmitted: boolean = false;

    exampleForm: FormGroup;

    categories: any[] = [
        { name: 'Cheese', key: 'C' },
        { name: 'Mushroom', key: 'M' },
        { name: 'Pepper', key: 'P' },
        { name: 'Onion', key: 'O' }
    ];

    constructor() {
        this.exampleForm = this.fb.group({
            selectedCategory: ['', Validators.required]
        });
    }

    isInvalid(controlName: string) {
        const control = this.exampleForm.get(controlName);
        return control?.invalid && this.formSubmitted;
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

            this.exampleForm.reset();

            this.formSubmitted = false;
        }
    }
}
```

## Signal Forms

RadioButton can also be used with Angular Signal Forms , the @angular/forms/signals API of Angular 21 and newer. The form model is a signal, form() declares its validators and the [formField] directive binds the component to a field. The field also sets the invalid and touched states of the component, so it is styled as invalid once the field is touched or the form is submitted, like the messages below.

```typescript
import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { RadioButtonModule } from '@exhaustive-ui/core/radiobutton';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

interface Category {
    name: string;
    key: string;
}

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4">
                <div class="flex flex-wrap gap-4">
                    @for (category of categories; track category.key) {
                        <div class="flex items-center gap-2">
                            <p-radio-button [formField]="exampleForm.selectedCategory" [inputId]="category.key" [value]="category" />
                            <label [for]="category.key"> {{ category.name }} </label>
                        </div>
                    }
                </div>
                @let selectedCategory = exampleForm.selectedCategory();
                @if (selectedCategory.invalid() && selectedCategory.touched()) {
                    <p-message severity="error" size="small" variant="simple"> At least one ingredient must be selected. </p-message>
                }
                <button pButton severity="secondary" type="submit"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormField, RadioButtonModule, ButtonModule, ToastModule, MessageModule],
    providers: [MessageService]
})
export class RadiobuttonSignalformsDemo {
    messageService = inject(MessageService);

    categories: Category[] = [
        { name: 'Cheese', key: 'C' },
        { name: 'Mushroom', key: 'M' },
        { name: 'Pepper', key: 'P' },
        { name: 'Onion', key: 'O' }
    ];

    model = signal<{ selectedCategory: Category | null }>({ selectedCategory: null });

    exampleForm = form(this.model, (f) => {
        required(f.selectedCategory);
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.exampleForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm().reset({ selectedCategory: null });
        });
    }
}
```

## Accessibility

Screen Reader RadioButton component uses a hidden native radio button element internally that is only visible to screen readers. Value to describe the component can either be provided via label tag combined with inputId prop or using ariaLabelledBy , ariaLabel props.

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| root | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the root's DOM element. |
| input | PassThroughOption<HTMLInputElement, I> | Used to pass attributes to the input's DOM element. |
| box | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the box's DOM element. |
| icon | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the icon's DOM element. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-radiobutton | Class name of the root element |
| p-radiobutton-box | Class name of the box element |
| p-radiobutton-input | Class name of the input element |
| p-radiobutton-icon | Class name of the icon element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| radiobutton.width | --p-radiobutton-width | Width of root |
| radiobutton.height | --p-radiobutton-height | Height of root |
| radiobutton.background | --p-radiobutton-background | Background of root |
| radiobutton.checked.background | --p-radiobutton-checked-background | Checked background of root |
| radiobutton.checked.hover.background | --p-radiobutton-checked-hover-background | Checked hover background of root |
| radiobutton.disabled.background | --p-radiobutton-disabled-background | Disabled background of root |
| radiobutton.filled.background | --p-radiobutton-filled-background | Filled background of root |
| radiobutton.border.color | --p-radiobutton-border-color | Border color of root |
| radiobutton.hover.border.color | --p-radiobutton-hover-border-color | Hover border color of root |
| radiobutton.focus.border.color | --p-radiobutton-focus-border-color | Focus border color of root |
| radiobutton.checked.border.color | --p-radiobutton-checked-border-color | Checked border color of root |
| radiobutton.checked.hover.border.color | --p-radiobutton-checked-hover-border-color | Checked hover border color of root |
| radiobutton.checked.focus.border.color | --p-radiobutton-checked-focus-border-color | Checked focus border color of root |
| radiobutton.checked.disabled.border.color | --p-radiobutton-checked-disabled-border-color | Checked disabled border color of root |
| radiobutton.invalid.border.color | --p-radiobutton-invalid-border-color | Invalid border color of root |
| radiobutton.shadow | --p-radiobutton-shadow | Shadow of root |
| radiobutton.focus.ring.width | --p-radiobutton-focus-ring-width | Focus ring width of root |
| radiobutton.focus.ring.style | --p-radiobutton-focus-ring-style | Focus ring style of root |
| radiobutton.focus.ring.color | --p-radiobutton-focus-ring-color | Focus ring color of root |
| radiobutton.focus.ring.offset | --p-radiobutton-focus-ring-offset | Focus ring offset of root |
| radiobutton.focus.ring.shadow | --p-radiobutton-focus-ring-shadow | Focus ring shadow of root |
| radiobutton.transition.duration | --p-radiobutton-transition-duration | Transition duration of root |
| radiobutton.sm.width | --p-radiobutton-sm-width | Sm width of root |
| radiobutton.sm.height | --p-radiobutton-sm-height | Sm height of root |
| radiobutton.lg.width | --p-radiobutton-lg-width | Lg width of root |
| radiobutton.lg.height | --p-radiobutton-lg-height | Lg height of root |
| radiobutton.icon.size | --p-radiobutton-icon-size | Size of icon |
| radiobutton.icon.checked.color | --p-radiobutton-icon-checked-color | Checked color of icon |
| radiobutton.icon.checked.hover.color | --p-radiobutton-icon-checked-hover-color | Checked hover color of icon |
| radiobutton.icon.disabled.color | --p-radiobutton-icon-disabled-color | Disabled color of icon |
| radiobutton.icon.sm.size | --p-radiobutton-icon-sm-size | Sm size of icon |
| radiobutton.icon.lg.size | --p-radiobutton-icon-lg-size | Lg size of icon |

