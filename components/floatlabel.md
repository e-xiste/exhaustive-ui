# Angular Float Label Component

FloatLabel appears on top of the input field when focused.

## Accessibility

Screen Reader FloatLabel does not require any roles and attributes. Keyboard Support Component does not include any interactive elements.

## Basic

FloatLabel is used by wrapping the input and its label.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from '@exhaustive-ui/core/floatlabel';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-float-label>
                <input id="username" pInputText [(ngModel)]="value" autocomplete="off" />
                <label for="username">Username</label>
            </p-float-label>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, FloatLabelModule, InputTextModule]
})
export class FloatlabelBasicDemo {
    value: string | undefined;
}
```

## Invalid

When the form element is invalid, the label is also highlighted.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from '@exhaustive-ui/core/floatlabel';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <p-float-label>
                <input pInputText id="value1" [(ngModel)]="value1" [invalid]="!value1" autocomplete="off" />
                <label for="value1">Username</label>
            </p-float-label>
            <p-float-label variant="in">
                <input pInputText id="value2" [(ngModel)]="value2" [invalid]="!value2" autocomplete="off" />
                <label for="value2">Username</label>
            </p-float-label>
            <p-float-label variant="on">
                <input pInputText id="value3" [(ngModel)]="value3" [invalid]="!value3" autocomplete="off" />
                <label for="value3">Username</label>
            </p-float-label>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, FloatLabelModule, InputTextModule]
})
export class FloatlabelInvalidDemo {
    value1: string | undefined;

    value2: string | undefined;

    value3: string | undefined;
}
```

## Sizes

The label follows the small and large sizes of the field it wraps, in every variant: its inset, its font size and, for the in variant, the vertical room left for it.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from '@exhaustive-ui/core/floatlabel';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { SelectModule } from '@exhaustive-ui/core/select';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-6">
            <div class="flex flex-wrap justify-center items-end gap-4">
                <p-float-label variant="in">
                    <input pInputText id="small_input" pSize="small" [(ngModel)]="value1" autocomplete="off" />
                    <label for="small_input">Small</label>
                </p-float-label>
                <p-float-label variant="in">
                    <input pInputText id="normal_input" [(ngModel)]="value2" autocomplete="off" />
                    <label for="normal_input">Normal</label>
                </p-float-label>
                <p-float-label variant="in">
                    <input pInputText id="large_input" pSize="large" [(ngModel)]="value3" autocomplete="off" />
                    <label for="large_input">Large</label>
                </p-float-label>
            </div>
            <div class="flex flex-wrap justify-center items-end gap-4">
                <p-float-label variant="on">
                    <p-select [(ngModel)]="city1" inputId="small_select" [options]="cities" size="small" class="w-56" />
                    <label for="small_select">Small</label>
                </p-float-label>
                <p-float-label variant="on">
                    <p-select [(ngModel)]="city2" inputId="normal_select" [options]="cities" class="w-56" />
                    <label for="normal_select">Normal</label>
                </p-float-label>
                <p-float-label variant="on">
                    <p-select [(ngModel)]="city3" inputId="large_select" [options]="cities" size="large" class="w-56" />
                    <label for="large_select">Large</label>
                </p-float-label>
            </div>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, FloatLabelModule, InputTextModule, SelectModule]
})
export class FloatlabelSizesDemo {
    value1: string | undefined;

    value2: string | undefined;

    value3: string | undefined;

    city1: string | undefined;

    city2: string | undefined;

    city3: string | undefined;

    cities = ['New York', 'Rome', 'London', 'Istanbul', 'Paris'];
}
```

## Variants

The variant property defines the position of the label. Default value is over , whereas in and on are the alternatives.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from '@exhaustive-ui/core/floatlabel';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <p-float-label variant="in">
                <input pInputText id="in_label" [(ngModel)]="value1" autocomplete="off" />
                <label for="in_label">In Label</label>
            </p-float-label>
            <p-float-label variant="on">
                <input pInputText id="on_label" [(ngModel)]="value2" autocomplete="off" />
                <label for="on_label">On Label</label>
            </p-float-label>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, FloatLabelModule, InputTextModule]
})
export class FloatlabelVariantsDemo {
    value1: string | undefined;

    value2: string | undefined;
}
```

## Float Label

FloatLabel appears on top of the input field when focused.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | FloatLabelPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| variant | "in" \| "on" \| "over" | 'over' | Defines the positioning of the label relative to the input. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| host | PassThroughOption<HTMLElement, I> | Used to pass attributes to the host's DOM element. |
| root | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the root's DOM element. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-floatlabel | Class name of the root element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| floatlabel.color | --p-floatlabel-color | Color of root |
| floatlabel.focus.color | --p-floatlabel-focus-color | Focus color of root |
| floatlabel.active.color | --p-floatlabel-active-color | Active color of root |
| floatlabel.invalid.color | --p-floatlabel-invalid-color | Invalid color of root |
| floatlabel.transition.duration | --p-floatlabel-transition-duration | Transition duration of root |
| floatlabel.position.x | --p-floatlabel-position-x | Position x of root |
| floatlabel.position.y | --p-floatlabel-position-y | Position y of root |
| floatlabel.font.weight | --p-floatlabel-font-weight | Font weight of root |
| floatlabel.active.font.size | --p-floatlabel-active-font-size | Active font size of root |
| floatlabel.active.font.weight | --p-floatlabel-active-font-weight | Active font weight of root |
| floatlabel.sm.position.x | --p-floatlabel-sm-position-x | Sm position x of root |
| floatlabel.sm.position.y | --p-floatlabel-sm-position-y | Sm position y of root |
| floatlabel.sm.font.size | --p-floatlabel-sm-font-size | Sm font size of root |
| floatlabel.sm.active.font.size | --p-floatlabel-sm-active-font-size | Sm active font size of root |
| floatlabel.lg.position.x | --p-floatlabel-lg-position-x | Lg position x of root |
| floatlabel.lg.position.y | --p-floatlabel-lg-position-y | Lg position y of root |
| floatlabel.lg.font.size | --p-floatlabel-lg-font-size | Lg font size of root |
| floatlabel.lg.active.font.size | --p-floatlabel-lg-active-font-size | Lg active font size of root |
| floatlabel.over.active.top | --p-floatlabel-over-active-top | Active top of over |
| floatlabel.in.input.padding.top | --p-floatlabel-in-input-padding-top | Input padding top of in |
| floatlabel.in.input.padding.bottom | --p-floatlabel-in-input-padding-bottom | Input padding bottom of in |
| floatlabel.in.active.top | --p-floatlabel-in-active-top | Active top of in |
| floatlabel.in.sm.input.padding.top | --p-floatlabel-in-sm-input-padding-top | Sm input padding top of in |
| floatlabel.in.sm.input.padding.bottom | --p-floatlabel-in-sm-input-padding-bottom | Sm input padding bottom of in |
| floatlabel.in.sm.active.top | --p-floatlabel-in-sm-active-top | Sm active top of in |
| floatlabel.in.lg.input.padding.top | --p-floatlabel-in-lg-input-padding-top | Lg input padding top of in |
| floatlabel.in.lg.input.padding.bottom | --p-floatlabel-in-lg-input-padding-bottom | Lg input padding bottom of in |
| floatlabel.in.lg.active.top | --p-floatlabel-in-lg-active-top | Lg active top of in |
| floatlabel.on.border.radius | --p-floatlabel-on-border-radius | Border radius of on |
| floatlabel.on.active.background | --p-floatlabel-on-active-background | Active background of on |
| floatlabel.on.active.padding | --p-floatlabel-on-active-padding | Active padding of on |

