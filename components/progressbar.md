# Angular ProgressBar Component

ProgressBar is a process status indicator.

## Basic

ProgressBar is used with the value property.

```typescript
import { Component } from '@angular/core';
import { ProgressBarModule } from '@exhaustive-ui/core/progressbar';

@Component({
    template: `
        <div class="card">
            <p-progress-bar aria-label="Task progress" [value]="50" />
        </div>
    `,
    standalone: true,
    imports: [ProgressBarModule]
})
export class ProgressbarBasicDemo {
}
```

## Dynamic

Value is reactive so updating it dynamically changes the bar as well.

```typescript
import { Component, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from '@exhaustive-ui/core/api';
import { ProgressBarModule } from '@exhaustive-ui/core/progressbar';
import { ToastModule } from '@exhaustive-ui/core/toast';

@Component({
    template: `
        <div class="card">
            <p-toast />
            <p-progress-bar aria-label="Task progress" [value]="value" />
        </div>
    `,
    standalone: true,
    imports: [ProgressBarModule, ToastModule],
    providers: [MessageService]
})
export class ProgressbarDynamicDemo implements OnInit, OnDestroy {
    private messageService = inject(MessageService);
    private ngZone = inject(NgZone);

    value: number = 0;

    interval: any;

    ngOnInit() {
        this.ngZone.runOutsideAngular(() => {
            this.interval = setInterval(() => {
                this.ngZone.run(() => {
                    this.value = this.value + Math.floor(Math.random() * 10) + 1;
                    if (this.value >= 100) {
                        this.value = 100;
                        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Process Completed' });
                        clearInterval(this.interval);
                    }
                });
            }, 2000);
        });
    }

    ngOnDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}
```

## Template

content template allows displaying custom content inside the progressbar.

```typescript
import { Component } from '@angular/core';
import { ProgressBarModule } from '@exhaustive-ui/core/progressbar';

@Component({
    template: `
        <div class="card">
            <p-progress-bar aria-label="Task progress" [value]="50">
                <ng-template #content let-value>
                    <span>{{ value }}/100</span>
                </ng-template>
            </p-progress-bar>
        </div>
    `,
    standalone: true,
    imports: [ProgressBarModule]
})
export class ProgressbarTemplateDemo {
}
```

## Indeterminate

For progresses with no value to track, set the mode property to indeterminate .

```typescript
import { Component } from '@angular/core';
import { MessageService } from '@exhaustive-ui/core/api';
import { ProgressBarModule } from '@exhaustive-ui/core/progressbar';

@Component({
    template: `
        <div class="card">
            <p-progress-bar aria-label="Loading" mode="indeterminate" [style]="{ height: '6px' }" />
        </div>
    `,
    standalone: true,
    imports: [ProgressBarModule],
    providers: [MessageService]
})
export class ProgressbarIndeterminateDemo {
}
```

## Accessibility

Screen Reader ProgressBar components uses progressbar role along with aria-valuemin , aria-valuemax and aria-valuenow attributes. Value to describe the component can be defined using aria-labelledby and aria-label props.

## Progress Bar

ProgressBar is a process status indicator.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | ProgressBarPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| value | number | - | Current value of the progress. |
| showValue | boolean | true | Whether to display the progress bar value. |
| valueStyleClass | string | - | Style class of the value element. |
| unit | string | '%' | Unit sign appended to the value. |
| mode | "indeterminate" \| "determinate" | 'determinate' | Defines the mode of the progress |
| color | string | - | Color for the background of the progress. |
| ariaLabel | string | - | Defines a string that labels the progress bar. |
| ariaLabelledBy | string | - | Establishes relationships between the progress bar and label(s) where its value should be one or more element IDs. |

### Templates

| Name | Type | Description |
|------|------|-------------|
| content | TemplateRef<ProgressBarContentTemplateContext> | Template of the content. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| host | PassThroughOption<HTMLElement, I> | Used to pass attributes to the host's DOM element. |
| root | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the root's DOM element. |
| value | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the value's DOM element. |
| label | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the label's DOM element. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-progressbar | Class name of the root element |
| p-progressbar-value | Class name of the value element |
| p-progressbar-label | Class name of the label element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| progressbar.background | --p-progressbar-background | Background of root |
| progressbar.border.radius | --p-progressbar-border-radius | Border radius of root |
| progressbar.height | --p-progressbar-height | Height of root |
| progressbar.value.background | --p-progressbar-value-background | Background of value |
| progressbar.label.color | --p-progressbar-label-color | Color of label |
| progressbar.label.font.size | --p-progressbar-label-font-size | Font size of label |
| progressbar.label.font.weight | --p-progressbar-label-font-weight | Font weight of label |

