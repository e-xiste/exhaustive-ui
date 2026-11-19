# Angular InputText Component

InputText is an extension to standard input element with theming and keyfiltering.

## Accessibility

Screen Reader InputText component renders a native input element that implicitly includes any passed prop. Value to describe the component can either be provided via label tag combined with id prop or using aria-labelledby , aria-label props.

## Basic

InputText is used as a controlled input with ngModel property.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex justify-center">
            <input type="text" pInputText [(ngModel)]="value" />
        </div>
    `,
    standalone: true,
    imports: [InputTextModule, FormsModule]
})
export class InputtextBasicDemo {
    value: string;
}
```

## Disabled

When disabled is present, the element cannot be edited and focused.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex justify-center">
            <input pInputText [disabled]="true" [(ngModel)]="value" />
        </div>
    `,
    standalone: true,
    imports: [InputTextModule, FormsModule]
})
export class InputtextDisabledDemo {
    value: string | undefined = 'Disabled';
}
```

## Filled

Specify the variant property as filled to display the component with a higher visual emphasis than the default outlined style.

```typescript
import { Component } from '@angular/core';
