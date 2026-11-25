# Angular InputChips Component

InputChips enters several free-text values, such as tags, keywords or email addresses, each shown as a removable chip. Values are added with Enter, a separator or a paste, checked against limits and your own rules, and the component works with every kind of Angular form.

## Basic

InputChips is bound with ngModel and its value is an array of strings. Type a value and press Enter to add it as a chip; the text is trimmed and a value that is already in the list is not added twice. Click the icon of a chip, or press Backspace in the empty input and then Backspace again, to remove it.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-input-chips [(ngModel)]="tags" ariaLabel="Tags" placeholder="Add a tag" class="w-full md:w-[30rem]" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputChipsModule]
})
export class InputchipsBasicDemo {
    tags: string[] = ['angular', 'signals'];
}
```

## Separator

A separator , a string or a regular expression, splits the text into several chips as it is typed or pasted. Pasting several lines always adds one chip per line. Try pasting red, green, blue below.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-4">
            <p-input-chips [(ngModel)]="colors" separator="," ariaLabel="Colors" placeholder="Comma separated" class="w-full md:w-[30rem]" />
            <p-input-chips [(ngModel)]="emails" [separator]="pattern" ariaLabel="Recipients" placeholder="Comma, semicolon or space" class="w-full md:w-[30rem]" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputChipsModule]
})
export class InputchipsSeparatorDemo {
    colors: string[] = [];

    emails: string[] = [];

    pattern = /[,;\s]/;
}
```

## Add on Blur and Tab

With addOnBlur , the text left in the input becomes a chip when the component loses the focus. With addOnTab , the Tab key adds it before moving the focus to the next field.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-4">
            <p-input-chips [(ngModel)]="blurValues" addOnBlur ariaLabel="Add on blur" placeholder="Type and click outside" class="w-full md:w-[30rem]" />
            <p-input-chips [(ngModel)]="tabValues" addOnTab ariaLabel="Add on tab" placeholder="Type and press Tab" class="w-full md:w-[30rem]" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputChipsModule]
})
export class InputchipsAddonblurDemo {
    blurValues: string[] = [];

    tabValues: string[] = [];
}
```

## Limits

max limits the number of chips and maxChipLength the length of each chip; values beyond the limits are not added and screen readers hear why. Set allowDuplicate to accept the same value more than once.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-4">
            <p-input-chips [(ngModel)]="keywords" [max]="3" [maxChipLength]="12" ariaLabel="Keywords" placeholder="Up to 3 keywords of 12 characters" class="w-full md:w-[30rem]" />
            <p-input-chips [(ngModel)]="votes" allowDuplicate ariaLabel="Votes" class="w-full md:w-[30rem]" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputChipsModule]
})
export class InputchipsLimitsDemo {
    keywords: string[] = ['design'];

    votes: string[] = ['yes', 'yes', 'no'];
}
```

## Validation

transform turns each value into the text of its chip, here in lowercase, and validate decides whether it can be added. A rejected value stays in the input so that it can be corrected, and onReject tells why.

```typescript
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule, InputChipsRejectEvent } from '@exhaustive-ui/core/inputchips';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-2">
            <label for="recipients" class="font-medium self-start md:self-center">Recipients</label>
            <p-input-chips [(ngModel)]="recipients" inputId="recipients" separator="," [transform]="lowercase" [validate]="isEmail" [invalid]="!!error()" (onReject)="onReject($event)" (onAdd)="error.set('')" class="w-full md:w-[30rem]" />
            @if (error()) {
                <p-message severity="error" size="small" variant="simple">{{ error() }}</p-message>
            }
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputChipsModule, MessageModule]
})
export class InputchipsValidationDemo {
    recipients: string[] = ['ada@example.com'];

    error = signal('');

    lowercase = (value: string) => value.toLowerCase();

    isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    onReject(event: InputChipsRejectEvent) {
        this.error.set(event.reason === 'duplicate' ? `${event.value} is already a recipient.` : `${event.value} is not an email address.`);
    }
}
```

## Template

The chip template replaces the content of a chip; its context gives the value, its index , whether it is focused or removable , and a remove function. The removeicon template only replaces the remove icon.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-4">
            <p-input-chips [(ngModel)]="languages" ariaLabel="Languages" class="w-full md:w-[30rem]">
                <ng-template #chip let-value let-remove="remove" let-removable="removable">
                    <span class="inline-flex items-center gap-2 rounded-border px-2 py-1 bg-primary text-primary-contrast">
                        <i class="pi pi-code text-xs" aria-hidden="true"></i>
                        {{ value }}
                        @if (removable) {
                            <i class="pi pi-times text-xs cursor-pointer" aria-hidden="true" (click)="remove($event)"></i>
                        }
                    </span>
                </ng-template>
            </p-input-chips>
            <p-input-chips [(ngModel)]="topics" ariaLabel="Topics" class="w-full md:w-[30rem]">
                <ng-template #removeicon let-class="class">
                    <i [class]="class + ' pi pi-trash'" aria-hidden="true"></i>
                </ng-template>
            </p-input-chips>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputChipsModule]
})
export class InputchipsTemplateDemo {
    languages: string[] = ['TypeScript', 'Rust'];

    topics: string[] = ['forms', 'accessibility'];
}
```

## Float Label

A floating label appears on top of the input field when focused. Visit FloatLabel documentation for more information.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { FloatLabelModule } from '@exhaustive-ui/core/floatlabel';

@Component({
    template: `
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <p-float-label>
                <p-input-chips [(ngModel)]="value1" inputId="over_label" class="w-60" />
                <label for="over_label">Over Label</label>
            </p-float-label>
            <p-float-label variant="in">
                <p-input-chips [(ngModel)]="value2" inputId="in_label" class="w-60" />
                <label for="in_label">In Label</label>
            </p-float-label>
            <p-float-label variant="on">
                <p-input-chips [(ngModel)]="value3" inputId="on_label" class="w-60" />
                <label for="on_label">On Label</label>
            </p-float-label>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputChipsModule, FloatLabelModule, RouterModule]
})
export class InputchipsFloatlabelDemo {
    value1: string[] = [];

    value2: string[] = [];

    value3: string[] = [];
}
```

## Ifta Label

IftaLabel is used to create infield top aligned labels. Visit IftaLabel documentation for more information.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { IftaLabelModule } from '@exhaustive-ui/core/iftalabel';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-ifta-label>
                <p-input-chips [(ngModel)]="value" inputId="skills" class="w-72" />
                <label for="skills">Skills</label>
            </p-ifta-label>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputChipsModule, IftaLabelModule, RouterModule]
})
export class InputchipsIftalabelDemo {
    value: string[] = ['Angular'];
}
```

## Icon

InputChips works with IconField and InputIcon to show an icon at the start of the field.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { IconFieldModule } from '@exhaustive-ui/core/iconfield';
import { InputIconModule } from '@exhaustive-ui/core/inputicon';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-icon-field class="w-full md:w-[30rem]">
                <p-input-icon class="pi pi-tag" />
                <p-input-chips [(ngModel)]="value" ariaLabel="Labels" placeholder="Labels" fluid />
            </p-icon-field>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputChipsModule, IconFieldModule, InputIconModule, RouterModule]
})
export class InputchipsIconfieldDemo {
    value: string[] = [];
}
```

## Sizes

InputChips provides small and large sizes as alternatives to the base.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-4">
            <p-input-chips [(ngModel)]="value1" size="small" ariaLabel="Small" placeholder="Small" />
            <p-input-chips [(ngModel)]="value2" ariaLabel="Normal" placeholder="Normal" />
            <p-input-chips [(ngModel)]="value3" size="large" ariaLabel="Large" placeholder="Large" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputChipsModule]
})
export class InputchipsSizesDemo {
    value1: string[] = ['small'];

    value2: string[] = ['normal'];

    value3: string[] = ['large'];
}
```

## Filled

Specify the variant property as filled to display the component with a higher visual emphasis than the default outlined style.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-input-chips [(ngModel)]="value" variant="filled" ariaLabel="Filled" placeholder="Add a tag" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputChipsModule]
})
export class InputchipsFilledDemo {
    value: string[] = [];
}
```

## Fluid

The fluid prop makes the component take up the full width of its container when set to true.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';

@Component({
    template: `
        <div class="card">
            <p-input-chips [(ngModel)]="value" fluid ariaLabel="Fluid" placeholder="Add a tag" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputChipsModule]
})
export class InputchipsFluidDemo {
    value: string[] = [];
}
```

## Disabled

When disabled is present, the element cannot be edited and focused. With readonly , the chips can still be focused and read, but not added or removed.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-4">
            <p-input-chips [(ngModel)]="value1" disabled ariaLabel="Disabled" />
            <p-input-chips [(ngModel)]="value2" readonly ariaLabel="Readonly" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputChipsModule]
})
export class InputchipsDisabledDemo {
    value1: string[] = ['disabled'];

    value2: string[] = ['readonly'];
}
```

## Invalid

The invalid state is applied using the invalid property to indicate failed validation.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';

@Component({
    template: `
        <div class="card flex flex-wrap justify-center gap-4">
            <p-input-chips [(ngModel)]="value1" [invalid]="value1.length === 0" ariaLabel="Tags" placeholder="Tags" />
            <p-input-chips [(ngModel)]="value2" [invalid]="value2.length === 0" variant="filled" ariaLabel="Tags" placeholder="Tags" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputChipsModule]
})
export class InputchipsInvalidDemo {
    value1: string[] = [];

    value2: string[] = [];
}
```

## Forms: Template Driven

The value is an array of strings, empty when there is no chip, so required works as on the other fields. Enter adds a chip and does not submit the form; on an empty input, it submits the form as usual.

```typescript
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex flex-col gap-4 w-full md:w-[30rem]">
                <div class="flex flex-col gap-2">
                    <label for="tags-td" class="font-medium">Tags</label>
                    <p-input-chips #model="ngModel" [(ngModel)]="tags" name="tags" inputId="tags-td" fluid [invalid]="model.invalid && (model.touched || exampleForm.submitted)" required />
                    @if (model.invalid && (model.touched || exampleForm.submitted)) {
                        <p-message severity="error" size="small" variant="simple">At least one tag is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit" class="self-start"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputChipsModule, ToastModule, MessageModule, ButtonModule],
    providers: [MessageService]
})
export class InputchipsTemplatedrivenformsDemo {
    messageService = inject(MessageService);

    tags: string[] = [];

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
```

## Reactive Forms

InputChips can also be used with reactive forms. In this case, the formControlName property is used to bind the component to a form control.

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 w-full md:w-[30rem]">
                <div class="flex flex-col gap-2">
                    <label for="skills-rf" class="font-medium">Skills</label>
                    <p-input-chips formControlName="skills" inputId="skills-rf" separator="," [max]="5" fluid [invalid]="isInvalid('skills')" />
                    @if (isInvalid('skills')) {
                        <p-message severity="error" size="small" variant="simple">At least one skill is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit" class="self-start"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [ReactiveFormsModule, InputChipsModule, ToastModule, MessageModule, ButtonModule],
    providers: [MessageService]
})
export class InputchipsReactiveformsDemo {
    private fb = inject(FormBuilder);

    messageService = inject(MessageService);

    exampleForm: FormGroup;

    formSubmitted: boolean = false;

    constructor() {
        this.exampleForm = this.fb.group({
            skills: [[], Validators.required]
        });
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm.reset({ skills: [] });
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

InputChips can also be used with Angular Signal Forms . The [formField] directive binds the component to a field holding an array of strings. Signal Forms' required does not treat an empty array as empty, so use minLength(field, 1) to require a chip; maxLength on the field makes more chips invalid without blocking them (use the max input to stop adding), while maxChipLength limits the length of each chip. The field also sets the invalid and touched states of the component, so it is styled as invalid once the field is touched or the form is submitted, like the message below.

```typescript
import { Component, inject, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, submit } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card flex justify-center">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4 w-full md:w-[30rem]">
                <div class="flex flex-col gap-2">
                    <label for="topics-sf" class="font-medium">Topics</label>
                    <p-input-chips [formField]="articleForm.topics" inputId="topics-sf" [maxChipLength]="20" fluid />
                    @let topics = articleForm.topics();
                    @if (topics.invalid() && topics.touched()) {
                        <p-message severity="error" size="small" variant="simple">Add between one and three topics.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit" class="self-start"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormField, InputChipsModule, ButtonModule, ToastModule, MessageModule],
    providers: [MessageService]
})
export class InputchipsSignalformsDemo {
    messageService = inject(MessageService);

    model = signal<{ topics: string[] }>({ topics: [] });

    articleForm = form(this.model, (f) => {
        minLength(f.topics, 1);
        maxLength(f.topics, 3);
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.articleForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.articleForm().reset({ topics: [] });
        });
    }
}
```

## Accessibility

Screen Reader The chips are the options of a horizontal listbox , followed by a text input. Label the component with a label element pointing at inputId , with ariaLabelledBy or with ariaLabel : the input and the list get the same name (the list falls back to the listLabel text). Each chip reports its position in the list, and the list is described by the keys that remove a chip. The remove icon is hidden from screen readers, since the keyboard removes the focused chip. A polite live region announces the chips added and removed, duplicates, rejected values and the max limit. All these texts can be replaced, or translated, with the labels input.

## Input Chips

InputChips enters several free-text values, such as tags or email addresses, each shown as a removable chip. It works with template-driven forms, reactive forms and Signal Forms.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | InputChipsPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| required | boolean | false | There must be a value (if set). |
| invalid | boolean | false | When present, it specifies that the component should have invalid state style. |
| touched | boolean | undefined | Whether the field has been touched. Signal Forms sets it through  `[formField]` : the invalid style and  `aria-invalid`  then wait until the field is touched, or the form is submitted, like the error messages. Left unset,  `invalid`  applies at once. |
| $invalid | Signal<boolean> | - | The invalid state shown by the component:  `invalid` , once the field is touched when  `touched`  is set; undefined when  `invalid`  is unset. |
| disabled | boolean | false | When present, it specifies that the component should have disabled state style. |
| name | string | undefined | When present, it specifies that the name of the input. |
| separator | string \| RegExp | - | Splits typed and pasted text into several chips, for example  `,`  or  `/[,;]/` . Enter always adds a chip. Use a RegExp without capture groups. |
| addOnBlur | boolean | false | Whether the text left in the input becomes a chip when the component loses the focus. |
| addOnTab | boolean | false | Whether the Tab key turns the text in the input into a chip before moving the focus. |
| allowDuplicate | boolean | false | Whether the same value can be added more than once. |
| max | number | - | Maximum number of chips. Further values are not added and the limit is announced. |
| maxChipLength | number | - | Maximum number of characters of a chip. |
| transform | InputChipsTransform | - | Turns each value into the text of its chip, after trimming, for example to lowercase it. Returning an empty value drops it. |
| validate | InputChipsValidate | - | Tells whether a value can be added. A rejected value emits onReject and stays in the input. |
| placeholder | string | - | Placeholder of the input, shown while there is no chip. |
| readonly | boolean | false | When present, the chips can be read but not added or removed. |
| fluid | boolean | false | Spans 100% width of the container when enabled. |
| variant | "outlined" \| "filled" | 'outlined' | Specifies the input variant of the component. |
| size | "small" \| "large" | - | Specifies the size of the component. |
| inputId | string | - | Identifier of the text input, for a label element. |
| tabindex | number | - | Index of the text input in the tab order. |
| ariaLabel | string | - | Accessible label of the input and of the list of chips. |
| ariaLabelledBy | string | - | Identifier of the element that labels the input and the list of chips. |
| labels | Partial<InputChipsLabels> | - | Texts of the component, merged with the English defaults. |

### Emits

| Name | Parameters | Description |
|------|------------|-------------|
| onAdd | event: InputChipsAddEvent | Callback to invoke when a chip is added, once per chip. |
| onRemove | event: InputChipsRemoveEvent | Callback to invoke when a chip is removed. |
| onReject | event: InputChipsRejectEvent | Callback to invoke when a value is not added: duplicate, maximum reached, too long or rejected by validate. |
| onChipClick | event: InputChipsChipClickEvent | Callback to invoke when a chip is clicked, or Enter is pressed on it. |
| onFocus | event: FocusEvent | Callback to invoke when the component receives the focus. |
| onBlur | event: FocusEvent | Callback to invoke when the component loses the focus. |

### Templates

| Name | Type | Description |
|------|------|-------------|
| chip | TemplateRef<InputChipsChipTemplateContext> | Custom content of a chip. |
| removeicon | TemplateRef<InputChipsRemoveIconTemplateContext> | Custom remove icon of a chip. |

### Methods

| Name | Parameters | Return Type | Description |
|------|------------|-------------|-------------|
| add | values: string \| string[], event: Event | void | Adds values as if the user had typed them. They go through the same trimming, transform and validation. |
| remove | index: number, event: Event | void | Removes the chip at an index. |
| clear |  | void | Removes all the chips. |
| focus |  | void | Moves the focus to the text input. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| host | PassThroughOption<HTMLElement, I> | Used to pass attributes to the host's DOM element. |
| root | PassThroughOption<HTMLElement, I> | Used to pass attributes to the root's DOM element. |
| container | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the field box that holds the chips and the text input. |
| list | PassThroughOption<HTMLUListElement, I> | Used to pass attributes to the list of chips. |
| chipItem | PassThroughOption<HTMLLIElement, I> | Used to pass attributes to the list item of a chip. |
| pcChip | ChipPassThrough | Used to pass attributes to the Chip component. |
| chipLabel | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the label of a chip. |
| chipIcon | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the remove icon of a chip. |
| input | PassThroughOption<HTMLInputElement, I> | Used to pass attributes to the text input's DOM element. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-inputchips | Class name of the root element |
| p-inputchips-input | Class name of the field box that holds the chips and the text input |
| p-inputchips-list | Class name of the list of chips |
| p-inputchips-chip-item | Class name of the list item of a chip |
| p-inputchips-chip | Class name of a chip |
| p-inputchips-chip-label | Class name of the label of a chip |
| p-inputchips-chip-icon | Class name of the remove icon of a chip |
| p-inputchips-input-field | Class name of the text input |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| inputchips.background | --p-inputchips-background | Background of root |
| inputchips.disabled.background | --p-inputchips-disabled-background | Disabled background of root |
| inputchips.filled.background | --p-inputchips-filled-background | Filled background of root |
| inputchips.filled.hover.background | --p-inputchips-filled-hover-background | Filled hover background of root |
| inputchips.filled.focus.background | --p-inputchips-filled-focus-background | Filled focus background of root |
| inputchips.border.color | --p-inputchips-border-color | Border color of root |
| inputchips.hover.border.color | --p-inputchips-hover-border-color | Hover border color of root |
| inputchips.focus.border.color | --p-inputchips-focus-border-color | Focus border color of root |
| inputchips.invalid.border.color | --p-inputchips-invalid-border-color | Invalid border color of root |
| inputchips.color | --p-inputchips-color | Color of root |
| inputchips.disabled.color | --p-inputchips-disabled-color | Disabled color of root |
| inputchips.placeholder.color | --p-inputchips-placeholder-color | Placeholder color of root |
| inputchips.invalid.placeholder.color | --p-inputchips-invalid-placeholder-color | Invalid placeholder color of root |
| inputchips.shadow | --p-inputchips-shadow | Shadow of root |
| inputchips.padding.x | --p-inputchips-padding-x | Padding x of root |
| inputchips.padding.y | --p-inputchips-padding-y | Padding y of root |
| inputchips.border.radius | --p-inputchips-border-radius | Border radius of root |
| inputchips.focus.ring.width | --p-inputchips-focus-ring-width | Focus ring width of root |
| inputchips.focus.ring.style | --p-inputchips-focus-ring-style | Focus ring style of root |
| inputchips.focus.ring.color | --p-inputchips-focus-ring-color | Focus ring color of root |
| inputchips.focus.ring.offset | --p-inputchips-focus-ring-offset | Focus ring offset of root |
| inputchips.focus.ring.shadow | --p-inputchips-focus-ring-shadow | Focus ring shadow of root |
| inputchips.transition.duration | --p-inputchips-transition-duration | Transition duration of root |
| inputchips.chip.border.radius | --p-inputchips-chip-border-radius | Border radius of chip |
| inputchips.chip.focus.background | --p-inputchips-chip-focus-background | Focus background of chip |
| inputchips.chip.focus.color | --p-inputchips-chip-focus-color | Focus color of chip |
| inputchips.chip.color | --p-inputchips-chip-color | Color of chip |

