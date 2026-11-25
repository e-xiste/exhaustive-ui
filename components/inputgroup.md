# Angular InputGroup Component

Text, icon, buttons and other content can be grouped next to an input.

## Basic

A group is created by wrapping the input and add-ons with the p-input-group component. Each add-on element is defined as a child of p-input-group-addon component.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from '@exhaustive-ui/core/inputgroup';
import { InputGroupAddonModule } from '@exhaustive-ui/core/inputgroupaddon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { InputNumberModule } from '@exhaustive-ui/core/inputnumber';
import { SelectModule } from '@exhaustive-ui/core/select';

interface City {
    name: string;
    code: string;
}

@Component({
    template: `
        <div class="card grid grid-cols-1 md:grid-cols-2 gap-4">
            <p-input-group>
                <p-input-group-addon>
                    <i class="pi pi-user"></i>
                </p-input-group-addon>
                <input pInputText [(ngModel)]="text1" placeholder="Username" />
            </p-input-group>
            <p-input-group>
                <p-input-group-addon>$</p-input-group-addon>
                <p-input-number [(ngModel)]="number" placeholder="Price" />
                <p-input-group-addon>.00</p-input-group-addon>
            </p-input-group>
            <p-input-group>
                <p-input-group-addon>www</p-input-group-addon>
                <input pInputText [(ngModel)]="text2" placeholder="Website" />
            </p-input-group>
            <p-input-group>
                <p-input-group-addon>
                    <i class="pi pi-map"></i>
                </p-input-group-addon>
                <p-select [(ngModel)]="selectedCity" [options]="cities" optionLabel="name" placeholder="City" />
            </p-input-group>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputGroupModule, InputGroupAddonModule, InputTextModule, InputNumberModule, SelectModule]
})
export class InputgroupBasicDemo {
    text1: string | undefined;

    text2: string | undefined;

    number: string | undefined;

    selectedCity: City | undefined;

    cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
}
```

## Multiple

Multiple add-ons can be placed inside the same group.

```typescript
import { Component } from '@angular/core';
import { InputGroupModule } from '@exhaustive-ui/core/inputgroup';
import { InputGroupAddonModule } from '@exhaustive-ui/core/inputgroupaddon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-input-group class="w-full md:w-120!">
                <p-input-group-addon>
                    <i class="pi pi-clock"></i>
                </p-input-group-addon>
                <p-input-group-addon>
                    <i class="pi pi-star-fill"></i>
                </p-input-group-addon>
                <input type="text" pInputText placeholder="Price" />
                <p-input-group-addon>$</p-input-group-addon>
                <p-input-group-addon>.00</p-input-group-addon>
            </p-input-group>
        </div>
    `,
    standalone: true,
    imports: [InputGroupModule, InputGroupAddonModule, InputTextModule]
})
export class InputgroupMultipleDemo {
}
```

## Button

Buttons can be placed at either side of an input element.

```typescript
import { Component } from '@angular/core';
import { MenuItem } from '@exhaustive-ui/core/api';
import { InputGroupModule } from '@exhaustive-ui/core/inputgroup';
import { InputGroupAddonModule } from '@exhaustive-ui/core/inputgroupaddon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { MenuModule } from '@exhaustive-ui/core/menu';

@Component({
    template: `
        <div class="card flex flex-col md:flex-row gap-4">
            <p-input-group>
                <p-button label="Search" />
                <input pInputText placeholder="Keyword" />
            </p-input-group>
            <p-input-group>
                <input pInputText placeholder="Keyword" />
                <p-input-group-addon>
                    <p-button icon="pi pi-search" ariaLabel="Search options" severity="secondary" variant="text" (click)="menu.toggle($event)" />
                </p-input-group-addon>
            </p-input-group>
            <p-menu #menu [model]="items" popup styleClass="min-w-fit!" />
            <p-input-group>
                <p-input-group-addon>
                    <p-button icon="pi pi-check" ariaLabel="Vote yes" severity="secondary" />
                </p-input-group-addon>
                <input pInputText placeholder="Vote" />
                <p-input-group-addon>
                    <p-button icon="pi pi-times" ariaLabel="Vote no" severity="secondary" />
                </p-input-group-addon>
            </p-input-group>
        </div>
    `,
    standalone: true,
    imports: [InputGroupModule, InputGroupAddonModule, InputTextModule, ButtonModule, MenuModule]
})
export class InputgroupButtonDemo {
    items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [{ label: 'Web Search' }, { label: 'AI Assistant' }, { label: 'History' }];
    }
}
```

## Checkbox & Radio

Checkbox and RadioButton components can be combined with an input element under the same group.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from '@exhaustive-ui/core/inputgroup';
import { InputGroupAddonModule } from '@exhaustive-ui/core/inputgroupaddon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { CheckboxModule } from '@exhaustive-ui/core/checkbox';
import { RadioButtonModule } from '@exhaustive-ui/core/radiobutton';

@Component({
    template: `
        <div class="card flex flex-col md:flex-row gap-4">
            <p-input-group>
                <input type="text" pInputText placeholder="Price" />
                <p-input-group-addon><p-radio-button [(ngModel)]="radioValue1" name="rb1" value="rb1" ariaLabel="Select price" /></p-input-group-addon>
            </p-input-group>
            <p-input-group>
                <p-input-group-addon><p-checkbox [(ngModel)]="checked1" [binary]="true" ariaLabel="Enable username" /></p-input-group-addon>
                <input type="text" pInputText placeholder="Username" />
            </p-input-group>
            <p-input-group>
                <p-input-group-addon><p-checkbox [(ngModel)]="checked2" [binary]="true" ariaLabel="Enable website" /></p-input-group-addon>
                <input type="text" pInputText placeholder="Website" />
                <p-input-group-addon><p-radio-button name="rb2" value="rb2" [(ngModel)]="category" ariaLabel="Select website" /></p-input-group-addon>
            </p-input-group>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, InputGroupModule, InputGroupAddonModule, InputTextModule, CheckboxModule, RadioButtonModule]
})
export class InputgroupCheckboxDemo {
    radioValue1: boolean = false;

    checked1: boolean = false;

    checked2: boolean = false;

    category: string | undefined;
}
```

## Float Label

FloatLabel visually integrates a label with its form element. Visit FloatLabel documentation for more information.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputGroupModule } from '@exhaustive-ui/core/inputgroup';
import { InputGroupAddonModule } from '@exhaustive-ui/core/inputgroupaddon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { FloatLabelModule } from '@exhaustive-ui/core/floatlabel';

@Component({
    template: `
        <div class="card flex flex-col md:items-end md:flex-row gap-4">
            <p-input-group>
                <p-input-group-addon>
                    <i class="pi pi-user"></i>
                </p-input-group-addon>
                <p-float-label>
                    <input pInputText id="over_label" [(ngModel)]="value1" />
                    <label for="over_label">Over Label</label>
                </p-float-label>
            </p-input-group>
            <p-input-group>
                <p-input-group-addon>$</p-input-group-addon>
                <p-float-label variant="in">
                    <input pInputText id="in_label" [(ngModel)]="value2" />
                    <label for="in_label">In Label</label>
                </p-float-label>
                <p-input-group-addon>.00</p-input-group-addon>
            </p-input-group>
            <p-input-group>
                <p-input-group-addon>www</p-input-group-addon>
                <p-float-label variant="on">
                    <input pInputText id="on_label" [(ngModel)]="value3" />
                    <label for="on_label">On Label</label>
                </p-float-label>
            </p-input-group>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RouterModule, InputGroupModule, InputGroupAddonModule, InputTextModule, FloatLabelModule]
})
export class InputgroupFloatlabelDemo {
    value1: string | undefined;

    value2: string | undefined;

    value3: string | undefined;
}
```

## Ifta Label

IftaLabel is used to create infield top aligned labels. Visit IftaLabel documentation for more information.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputGroupModule } from '@exhaustive-ui/core/inputgroup';
import { InputGroupAddonModule } from '@exhaustive-ui/core/inputgroupaddon';
import { InputNumberModule } from '@exhaustive-ui/core/inputnumber';
import { IftaLabelModule } from '@exhaustive-ui/core/iftalabel';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-input-group class="md:w-80!">
                <p-input-group-addon>
                    <i class="pi pi-shopping-cart"></i>
                </p-input-group-addon>
                <p-ifta-label>
                    <p-input-number [(ngModel)]="value" inputId="price" mode="currency" currency="USD" locale="en-US" />
                    <label for="price">Price</label>
                </p-ifta-label>
            </p-input-group>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RouterModule, InputGroupModule, InputGroupAddonModule, InputNumberModule, IftaLabelModule]
})
export class InputgroupIftalabelDemo {
    value: number = 10;
}
```

## Accessibility

Screen Reader InputGroup and InputGroupAddon does not require any roles and attributes. Keyboard Support Component does not include any interactive elements.

## Input Group

InputGroup displays text, icon, buttons and other content can be grouped next to an input.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | InputGroupPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| host | PassThroughOption<HTMLElement, I> | Used to pass attributes to the host's DOM element. |
| root | PassThroughOption<HTMLElement, I> | Used to pass attributes to the root's DOM element. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-inputgroup | Class name of the root element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| inputgroup.addon.background | --p-inputgroup-addon-background | Background of addon |
| inputgroup.addon.border.color | --p-inputgroup-addon-border-color | Border color of addon |
| inputgroup.addon.color | --p-inputgroup-addon-color | Color of addon |
| inputgroup.addon.border.radius | --p-inputgroup-addon-border-radius | Border radius of addon |
| inputgroup.addon.padding | --p-inputgroup-addon-padding | Padding of addon |
| inputgroup.addon.min.width | --p-inputgroup-addon-min-width | Min width of addon |

