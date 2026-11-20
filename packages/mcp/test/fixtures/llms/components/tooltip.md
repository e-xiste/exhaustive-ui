# Angular Tooltip Component

Tooltip directive provides advisory information for a component. Tooltip is integrated within various ExhaustiveUI components.

## Accessibility

Screen Reader Tooltip component uses tooltip role and when it becomes visible the generated id of the tooltip is defined as the aria-describedby of the target. Keyboard Support Key Function escape Closes the tooltip when focus is on the target.

## Auto Hide

Tooltip is hidden when mouse leaves the target element, in cases where tooltip needs to be interacted with, set autoHide to false to change the default behavior.

```typescript
import { Component } from '@angular/core';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { TooltipModule } from '@exhaustive-ui/core/tooltip';

@Component({
    template: `
        <div class="card flex flex-wrap justify-center gap-2">
            <input type="text" pInputText pTooltip="Enter your username" [autoHide]="false" placeholder="autoHide: false" />
            <input type="text" pInputText pTooltip="Enter your username" placeholder="autoHide: true" />
        </div>
    `,
    standalone: true,
    imports: [InputTextModule, TooltipModule]
})
export class TooltipAutohideDemo {}
```

## Custom

Tooltip can use either a string or a TemplateRef .

```typescript
import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TooltipModule } from '@exhaustive-ui/core/tooltip';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-button [pTooltip]="tooltipContent" severity="secondary" tooltipPosition="bottom" label="Button" />
            <ng-template #tooltipContent>
                <div class="flex items-center">
                    <img src="https://exhaustive-ui.com/logo-icon.svg" alt="ExhaustiveUI" width="32" height="32" class="mr-2" />
                    <span> <b>ExhaustiveUI</b> rocks! </span>
                </div>
            </ng-template>
        </div>
    `,
    standalone: true,
    imports: [ButtonModule, TooltipModule]
})
export class TooltipCustomDemo {}
```

## Delay

Adding delays to the show and hide events are defined with showDelay and hideDelay options respectively.
