# Angular Inplace Component

Inplace provides an easy to do editing and display at the same time where clicking the output displays the actual content.

## Basic

Inplace component requires display and content templates to define the content of each state.

```typescript
import { Component } from '@angular/core';
import { InplaceModule } from '@exhaustive-ui/core/inplace';

@Component({
    template: `
        <div class="card">
            <p-inplace>
                <ng-template #display>
                    <span>View Content</span>
                </ng-template>
                <ng-template #content>
                    <p class="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </ng-template>
            </p-inplace>
        </div>
    `,
    standalone: true,
    imports: [InplaceModule]
})
export class InplaceBasicDemo {
}
```

## Input

The closeCallback switches the state back to display mode when called from an event.

```typescript
import { Component } from '@angular/core';
import { InplaceModule } from '@exhaustive-ui/core/inplace';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { AutoFocusModule } from '@exhaustive-ui/core/autofocus';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <div class="card">
            <p-inplace>
                <ng-template #display>
                    <span>Click to Edit</span>
                </ng-template>
                <ng-template #content let-closeCallback="closeCallback">
                    <span class="inline-flex gap-2">
                        <input type="text" pInputText [pAutoFocus]="true" />
                        <button type="button" pButton (click)="closeCallback($event)" text severity="danger">
                            <i class="pi pi-times" pButtonIcon></i>
                        </button>
                    </span>
                </ng-template>
            </p-inplace>
        </div>
    `,
    standalone: true,
    imports: [InplaceModule, InputTextModule, AutoFocusModule, ButtonModule]
})
export class InplaceInputDemo {
}
```

## Image

Any content such as an image can be placed inside an Inplace.

```typescript
import { Component } from '@angular/core';
import { InplaceModule } from '@exhaustive-ui/core/inplace';

@Component({
    template: `
        <div class="card">
            <p-inplace>
                <ng-template #display>
                    <span class="inline-flex items-center gap-2">
                        <span class="pi pi-image" style="vertical-align: middle"></span>
                        <span class="ml-2">View Photo</span>
                    </span>
                </ng-template>
                <ng-template #content>
                    <img class="w-full sm:w-80 shadow-md" src="https://exhaustive-ui.com/demo/galleria/galleria5.jpg" alt="Nature" />
                </ng-template>
            </p-inplace>
        </div>
    `,
    standalone: true,
    imports: [InplaceModule]
})
export class InplaceImageDemo {
}
```

## Lazy

Using the onActivate event, data can be loaded in a lazy manner before displaying it in a table.

```typescript
import { Component, inject } from '@angular/core';
import { InplaceModule } from '@exhaustive-ui/core/inplace';
import { TableModule } from '@exhaustive-ui/core/table';
import { Product } from '@/domain/product';
import { ProductService } from '@/service/productservice';

@Component({
    template: `
        <div class="card">
            <p-inplace (onActivate)="loadData()">
                <ng-template #display>
                    <span>View Data</span>
                </ng-template>
                <ng-template #content>
                    <p-table [value]="products">
                        <ng-template #header>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Quantity</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-product>
                            <tr>
                                <td>{{ product.code }}</td>
                                <td>{{ product.name }}</td>
                                <td>{{ product.category }}</td>
                                <td>{{ product.quantity }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </ng-template>
            </p-inplace>
        </div>
    `,
    standalone: true,
    imports: [InplaceModule, TableModule],
    providers: [ProductService]
})
export class InplaceLazyDemo {
    private productService = inject(ProductService);

    products: Product[] | undefined;

    loadData() {
        this.productService.getProductsMini().then((products) => (this.products = products));
    }
}
```

## Accessibility

Screen Reader Inplace component defines aria-live as "polite" by default, since any valid attribute is passed to the main container aria roles and attributes of the root element can be customized easily. Display element uses button role in view mode. Closable inplace components display a close button whose aria-label is defined with the closeAriaLabel property. View Mode Keyboard Support Key Function enter Switches to content. Close Button Keyboard Support Key Function enter Switches to display. space Switches to display.

## Inplace

Inplace provides an easy to do editing and display at the same time where clicking the output displays the actual content.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | InplacePassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| active | boolean | false | Whether the content is displayed or not, supports one or two-way binding as well. Emits  `activeChange`  with the new value when the content is activated or deactivated. |
| closable | boolean | false | Displays a button to switch back to display mode. **(Deprecated)** |
| disabled | boolean | false | When present, it specifies that the element should be disabled. |
| preventClick | boolean | - | Allows to prevent clicking. |
| closeIcon | string | - | Icon to display in the close button. **(Deprecated)** |
| closeAriaLabel | string | - | Establishes a string value that labels the close button. |

### Emits

| Name | Parameters | Description |
|------|------------|-------------|
| onActivate | event: Event | Callback to invoke when inplace is opened. |
| onDeactivate | event: Event | Callback to invoke when inplace is closed. |

### Templates

| Name | Type | Description |
|------|------|-------------|
| display | TemplateRef<void> | Custom display template. |
| content | TemplateRef<InplaceContentTemplateContext> | Custom content template. |
| closeicon | TemplateRef<void> | Custom close icon template. |

### Methods

| Name | Parameters | Return Type | Description |
|------|------------|-------------|-------------|
| activate | event: Event | void | Activates the content. |
| deactivate | event: Event | void | Deactivates the content. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| host | PassThroughOption<HTMLElement, I> | Used to pass attributes to the host's DOM element. |
| root | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the root's DOM element. |
| display | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the display's DOM element. |
| content | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the content's DOM element. |
| pcButton | ButtonPassThrough | Used to pass attributes to the Button component. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-inplace | Class name of the root element |
| p-inplace-display | Class name of the display element |
| p-inplace-content | Class name of the content element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| inplace.padding | --p-inplace-padding | Padding of root |
| inplace.border.radius | --p-inplace-border-radius | Border radius of root |
| inplace.focus.ring.width | --p-inplace-focus-ring-width | Focus ring width of root |
| inplace.focus.ring.style | --p-inplace-focus-ring-style | Focus ring style of root |
| inplace.focus.ring.color | --p-inplace-focus-ring-color | Focus ring color of root |
| inplace.focus.ring.offset | --p-inplace-focus-ring-offset | Focus ring offset of root |
| inplace.focus.ring.shadow | --p-inplace-focus-ring-shadow | Focus ring shadow of root |
| inplace.transition.duration | --p-inplace-transition-duration | Transition duration of root |
| inplace.display.hover.background | --p-inplace-display-hover-background | Hover background of display |
| inplace.display.hover.color | --p-inplace-display-hover-color | Hover color of display |

