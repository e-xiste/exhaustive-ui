# Angular MeterGroup Component

MeterGroup displays scalar measurements within a known range.

## Basic

MeterGroup requires a value as the data to display where each item in the collection should be a type of MeterItem .

```typescript
import { Component } from '@angular/core';
import { MeterGroupModule } from '@exhaustive-ui/core/metergroup';

@Component({
    template: `
        <div class="card">
            <p-meter-group [value]="value" aria-label="Storage usage" />
        </div>
    `,
    standalone: true,
    imports: [MeterGroupModule]
})
export class MetergroupBasicDemo {
    value = [{ label: 'Space used', value: 15, color: 'var(--p-primary-color)' }];
}
```

## Multiple

Adding more items to the array displays the meters in a group.

```typescript
import { Component } from '@angular/core';
import { MeterGroupModule } from '@exhaustive-ui/core/metergroup';

@Component({
    template: `
        <div class="card">
            <p-meter-group [value]="value" aria-label="Storage usage" />
        </div>
    `,
    standalone: true,
    imports: [MeterGroupModule]
})
export class MetergroupMultipleDemo {
    value = [
        { label: 'Apps', color: '#34d399', value: 16 },
        { label: 'Messages', color: '#fbbf24', value: 8 },
        { label: 'Media', color: '#60a5fa', value: 24 },
        { label: 'System', color: '#c084fc', value: 10 }
    ];
}
```

## Icon

Icons can be displayed next to the labels instead of the default marker.

```typescript
import { Component } from '@angular/core';
import { MeterGroupModule } from '@exhaustive-ui/core/metergroup';

@Component({
    template: `
        <div class="card">
            <p-meter-group [value]="value" aria-label="Storage usage" />
        </div>
    `,
    standalone: true,
    imports: [MeterGroupModule]
})
export class MetergroupIconDemo {
    value = [
        { label: 'Apps', color: '#34d399', value: 16, icon: 'pi pi-table' },
        { label: 'Messages', color: '#fbbf24', value: 8, icon: 'pi pi-inbox' },
        { label: 'Media', color: '#60a5fa', value: 24, icon: 'pi pi-image' },
        { label: 'System', color: '#c084fc', value: 10, icon: 'pi pi-cog' }
    ];
}
```

## Label

The position of the labels relative to the meters is defined using the labelPosition property. The default orientation of the labels is horizontal, and the vertical alternative is available through the labelOrientation option.

```typescript
import { Component } from '@angular/core';
import { MeterGroupModule } from '@exhaustive-ui/core/metergroup';

@Component({
    template: `
        <div class="card">
            <p-meter-group [value]="value" aria-label="Storage usage" labelPosition="start" labelOrientation="vertical" />
        </div>
    `,
    standalone: true,
    imports: [MeterGroupModule]
})
export class MetergroupLabelDemo {
    value = [
        { label: 'Apps', color: '#34d399', value: 16 },
        { label: 'Messages', color: '#fbbf24', value: 8 },
        { label: 'Media', color: '#60a5fa', value: 24 },
        { label: 'System', color: '#c084fc', value: 10 }
    ];
}
```

## Vertical

Layout of the MeterGroup is configured with the orientation property that accepts either horizontal or vertical as available options.

```typescript
import { Component } from '@angular/core';
import { MeterGroupModule } from '@exhaustive-ui/core/metergroup';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-meter-group [value]="value" aria-label="Storage usage" orientation="vertical" labelOrientation="vertical" [style]="{ height: '300px' }" />
        </div>
    `,
    standalone: true,
    imports: [MeterGroupModule]
})
export class MetergroupVerticalDemo {
    value = [
        { label: 'Apps', color: '#34d399', value: 16 },
        { label: 'Messages', color: '#fbbf24', value: 8 },
        { label: 'Media', color: '#60a5fa', value: 24 },
        { label: 'System', color: '#c084fc', value: 10 }
    ];
}
```

## Min Max

Boundaries are configured with the min and max values whose defaults are 0 and 100 respectively.

```typescript
import { Component } from '@angular/core';
import { MeterGroupModule } from '@exhaustive-ui/core/metergroup';

@Component({
    template: `
        <div class="card">
            <p-meter-group [value]="value" aria-label="Storage usage" [max]="200" />
        </div>
    `,
    standalone: true,
    imports: [MeterGroupModule]
})
export class MetergroupMinmaxDemo {
    value = [
        { label: 'Apps', color: '#34d399', value: 16 },
        { label: 'Messages', color: '#fbbf24', value: 8 },
        { label: 'Media', color: '#60a5fa', value: 24 },
        { label: 'System', color: '#c084fc', value: 10 }
    ];
}
```

## Template

MeterGroup provides templating support for labels, meter items, and content around the meters.

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeterGroupModule } from '@exhaustive-ui/core/metergroup';
import { CardModule } from '@exhaustive-ui/core/card';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <div class="card">
            <p-meter-group [value]="value" aria-label="Storage usage" labelPosition="start">
                <ng-template #label>
                    <div class="flex flex-wrap gap-4">
                        <ng-container *ngFor="let meterItem of value; let index = index">
                            <p-card class="flex-1 border border-surface shadow-none">
                                <div class="flex justify-between gap-8">
                                    <div class="flex flex-col gap-1">
                                        <span class="text-surface-500 dark:text-surface-400 text-sm">{{ meterItem.label }}</span>
                                        <span class="font-bold text-lg">{{ meterItem.value }}%</span>
                                    </div>
                                    <span class="w-8 h-8 rounded-full inline-flex justify-center items-center text-center" [style]="{ 'background-color': meterItem.color1, color: '#ffffff' }">
                                        <i [class]="meterItem.icon"></i>
                                    </span>
                                </div>
                            </p-card>
                        </ng-container>
                    </div>
                </ng-template>
                <ng-template #meter let-value let-class="class" let-width="size">
                    <span [class]="class" [style]="{ background: 'linear-gradient(to right, ' + value.color1 + ', ' + value.color2 + ')', width: width }"></span>
                </ng-template>
                <ng-template #start let-totalPercent="totalPercent">
                    <div class="flex justify-between mt-4 mb-2 relative">
                        <span>Storage</span>
                        <span [style]="{ width: totalPercent + '%' }" class="absolute text-right">{{ totalPercent }}%</span>
                        <span class="font-medium">1TB</span>
                    </div>
                </ng-template>
                <ng-template #end>
                    <div class="flex justify-between mt-4">
                        <p-button label="Manage Storage" [outlined]="true" size="small" />
                        <p-button label="Update Plan" size="small" />
                    </div>
                </ng-template>
            </p-meter-group>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, MeterGroupModule, CardModule, ButtonModule]
})
export class MetergroupTemplateDemo {
    value = [
        { label: 'Apps', color1: '#34d399', color2: '#fbbf24', value: 25, icon: 'pi pi-table' },
        { label: 'Messages', color1: '#fbbf24', color2: '#60a5fa', value: 15, icon: 'pi pi-inbox' },
        { label: 'Media', color1: '#60a5fa', color2: '#c084fc', value: 20, icon: 'pi pi-image' },
        { label: 'System', color1: '#c084fc', color2: '#c084fc', value: 10, icon: 'pi pi-cog' }
    ];
}
```

## Accessibility

Screen Reader MeterGroup component uses meter role in addition to the aria-valuemin , aria-valuemax and aria-valuenow attributes. Value to describe the component can be defined using aria-labelledby prop. Keyboard Support Component does not include any interactive elements.

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| host | PassThroughOption<HTMLElement, I> | Used to pass attributes to the host's DOM element. |
| root | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the root's DOM element. |
| meters | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the meters' DOM element. |
| meter | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the meter's DOM element. |
| labelList | PassThroughOption<HTMLOListElement, I> | Used to pass attributes to the label list's DOM element. |
| label | PassThroughOption<HTMLLIElement, I> | Used to pass attributes to the label's DOM element. |
| labelIcon | PassThroughOption<HTMLElement, I> | Used to pass attributes to the label icon's DOM element. |
| labelMarker | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the label marker's DOM element. |
| labelText | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the label text's DOM element. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-metergroup | Class name of the root element |
| p-metergroup-meters | Class name of the meters element |
| p-metergroup-meter | Class name of the meter element |
| p-metergroup-label-list | Class name of the label list element |
| p-metergroup-label | Class name of the label element |
| p-metergroup-label-icon | Class name of the label icon element |
| p-metergroup-label-marker | Class name of the label marker element |
| p-metergroup-label-text | Class name of the label text element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| metergroup.border.radius | --p-metergroup-border-radius | Border radius of root |
| metergroup.gap | --p-metergroup-gap | Gap of root |
| metergroup.meters.background | --p-metergroup-meters-background | Background of meters |
| metergroup.meters.size | --p-metergroup-meters-size | Size of meters |
| metergroup.label.gap | --p-metergroup-label-gap | Gap of label |
| metergroup.label.marker.size | --p-metergroup-label-marker-size | Size of label marker |
| metergroup.label.icon.size | --p-metergroup-label-icon-size | Size of label icon |
| metergroup.label.list.vertical.gap | --p-metergroup-label-list-vertical-gap | Vertical gap of label list |
| metergroup.label.list.horizontal.gap | --p-metergroup-label-list-horizontal-gap | Horizontal gap of label list |

