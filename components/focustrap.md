# Angular Focus Trap Component

Focus Trap keeps focus within a certain DOM element while tabbing.

## Basic

FocusTrap is applied to a container element with the pFocusTrap directive.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoFocusModule } from '@exhaustive-ui/core/autofocus';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { CheckboxModule } from '@exhaustive-ui/core/checkbox';
import { FocusTrapModule } from '@exhaustive-ui/core/focustrap';
import { IconFieldModule } from '@exhaustive-ui/core/iconfield';
import { InputIconModule } from '@exhaustive-ui/core/inputicon';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex justify-center">
            <div pFocusTrap class="w-full sm:w-80 flex flex-col gap-6">
                <p-icon-field>
                    <p-input-icon>
                        <i class="pi pi-user"></i>
                    </p-input-icon>
                    <input type="text" pInputText id="input" [(ngModel)]="name" type="text" placeholder="Name" [pAutoFocus]="true" [fluid]="true" />
                </p-icon-field>
                <p-icon-field>
                    <p-input-icon>
                        <i class="pi pi-envelope"> </i>
                    </p-input-icon>
                    <input type="text" pInputText id="email" [(ngModel)]="email" type="email" placeholder="Email" [fluid]="true" />
                </p-icon-field>
                <div class="flex items-center gap-2">
                    <p-checkbox inputId="accept" [(ngModel)]="accept" name="accept" value="Accept" />
                    <label for="accept">I agree to the terms and conditions.</label>
                </div>
                <p-button type="submit" label="Submit" class="mt-2" styleClass="w-full" />
            </div>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, AutoFocusModule, ButtonModule, CheckboxModule, FocusTrapModule, IconFieldModule, InputIconModule, InputTextModule]
})
export class FocustrapBasicDemo {
    name: string = '';

    email: string = '';

    accept: boolean = false;
}
```

## Focus Trap

Focus Trap keeps focus within a certain DOM element while tabbing.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | any | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| pFocusTrapDisabled | boolean | false | When set as true, focus wouldn't be managed. |

