# Angular Ifta Label Component

IftaLabel is used to create infield top aligned labels.

## Accessibility

Screen Reader IftaLabel does not require any roles and attributes. Keyboard Support Component does not include any interactive elements.

## Basic

IftaLabel is used by wrapping the input and its label.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from '@exhaustive-ui/core/iftalabel';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-ifta-label>
                <input pInputText id="username" [(ngModel)]="value" autocomplete="off" />
                <label for="username">Username</label>
            </p-ifta-label>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, IftaLabelModule, InputTextModule]
})
export class IftalabelBasicDemo {
    value: string | undefined;
}
```

## Invalid

When the form element is invalid, the label is also highlighted.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from '@exhaustive-ui/core/iftalabel';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-ifta-label>
                <input pInputText id="username" [(ngModel)]="value" [invalid]="!value" autocomplete="off" />
                <label for="username">Username</label>
            </p-ifta-label>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, IftaLabelModule, InputTextModule]
})
export class IftalabelInvalidDemo {
    value: string | undefined;
}
```

## Sizes

The label follows the small and large sizes of the field it wraps: its inset, its font size and the vertical room left for it.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from '@exhaustive-ui/core/iftalabel';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { SelectModule } from '@exhaustive-ui/core/select';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-6">
            <div class="flex flex-wrap justify-center items-end gap-4">
                <p-ifta-label>
                    <input pInputText id="small_input" pSize="small" [(ngModel)]="value1" autocomplete="off" />
                    <label for="small_input">Small</label>
                </p-ifta-label>
                <p-ifta-label>
                    <input pInputText id="normal_input" [(ngModel)]="value2" autocomplete="off" />
                    <label for="normal_input">Normal</label>
                </p-ifta-label>
                <p-ifta-label>
                    <input pInputText id="large_input" pSize="large" [(ngModel)]="value3" autocomplete="off" />
                    <label for="large_input">Large</label>
                </p-ifta-label>
            </div>
            <div class="flex flex-wrap justify-center items-end gap-4">
                <p-ifta-label>
                    <p-select [(ngModel)]="city1" inputId="small_select" [options]="cities" size="small" class="w-56" />
                    <label for="small_select">Small</label>
                </p-ifta-label>
                <p-ifta-label>
                    <p-select [(ngModel)]="city2" inputId="normal_select" [options]="cities" class="w-56" />
                    <label for="normal_select">Normal</label>
                </p-ifta-label>
                <p-ifta-label>
                    <p-select [(ngModel)]="city3" inputId="large_select" [options]="cities" size="large" class="w-56" />
                    <label for="large_select">Large</label>
                </p-ifta-label>
            </div>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, IftaLabelModule, InputTextModule, SelectModule]
})
export class IftalabelSizesDemo {
    value1: string | undefined;

    value2: string | undefined;

    value3: string | undefined;

    city1: string | undefined;

    city2: string | undefined;

    city3: string | undefined;

    cities = ['New York', 'Rome', 'London', 'Istanbul', 'Paris'];
}
```

## Ifta Label

IftaLabel is used to create infield top aligned labels.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | IftaLabelPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| host | PassThroughOption<HTMLElement, I> | Used to pass attributes to the host's DOM element. |
| root | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the root's DOM element. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-iftalabel | Class name of the root element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| iftalabel.color | --p-iftalabel-color | Color of root |
| iftalabel.focus.color | --p-iftalabel-focus-color | Focus color of root |
| iftalabel.invalid.color | --p-iftalabel-invalid-color | Invalid color of root |
| iftalabel.transition.duration | --p-iftalabel-transition-duration | Transition duration of root |
| iftalabel.position.x | --p-iftalabel-position-x | Position x of root |
| iftalabel.top | --p-iftalabel-top | Top of root |
| iftalabel.font.size | --p-iftalabel-font-size | Font size of root |
| iftalabel.font.weight | --p-iftalabel-font-weight | Font weight of root |
| iftalabel.sm.position.x | --p-iftalabel-sm-position-x | Sm position x of root |
| iftalabel.sm.top | --p-iftalabel-sm-top | Sm top of root |
| iftalabel.sm.font.size | --p-iftalabel-sm-font-size | Sm font size of root |
| iftalabel.lg.position.x | --p-iftalabel-lg-position-x | Lg position x of root |
| iftalabel.lg.top | --p-iftalabel-lg-top | Lg top of root |
| iftalabel.lg.font.size | --p-iftalabel-lg-font-size | Lg font size of root |
| iftalabel.input.padding.top | --p-iftalabel-input-padding-top | Padding top of input |
| iftalabel.input.padding.bottom | --p-iftalabel-input-padding-bottom | Padding bottom of input |
| iftalabel.input.sm.padding.top | --p-iftalabel-input-sm-padding-top | Sm padding top of input |
| iftalabel.input.sm.padding.bottom | --p-iftalabel-input-sm-padding-bottom | Sm padding bottom of input |
| iftalabel.input.lg.padding.top | --p-iftalabel-input-lg-padding-top | Lg padding top of input |
| iftalabel.input.lg.padding.bottom | --p-iftalabel-input-lg-padding-bottom | Lg padding bottom of input |

