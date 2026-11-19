# Angular Button Component

Button is an extension to standard button element with icons and theming.

## Accessibility

Screen Reader Button component renders a native button element that implicitly includes any passed prop. Text to describe the button is defined with the aria-label prop, if not present label prop is used as the value. If the button is icon only or custom templating is used, it is recommended to use aria-label so that screen readers would be able to read the element properly.

## Badge

Buttons have built-in badge support with badge and badgeClass properties.

```typescript
import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <div class="card flex justify-center flex-wrap gap-4">
            <p-button label="Emails" badge="2" styleClass="m-0" />
            <p-button label="Messages" icon="pi pi-users" badge="2" badgeSeverity="contrast" styleClass="m-0" [outlined]="true" />
        </div>
    `,
    standalone: true,
    imports: [ButtonModule]
})
export class ButtonBadgeDemo {}
```

## Basic

Text to display on a button is defined with the label property.

```typescript
import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-button label="Submit" />
        </div>
    `,
    standalone: true,
    imports: [ButtonModule]
})
export class ButtonBasicDemo {}
```

## Button Group

Multiple buttons are grouped when wrapped inside an element with ButtonGroup component.

```typescript
import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <div class="card flex justify-center">
