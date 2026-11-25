# Angular Skeleton Component

Skeleton is a placeholder to display instead of the actual content.

## Accessibility

Screen Reader Skeleton uses aria-hidden as "true" so that it gets ignored by screen readers, any valid attribute is passed to the root element so you may customize it further if required. If multiple skeletons are grouped inside a container, you may use aria-busy on the container element as well to indicate the loading process.

## Card

Sample Card implementation using different Skeleton components and Tailwind CSS utilities.

```typescript
import { Component } from '@angular/core';
import { SkeletonModule } from '@exhaustive-ui/core/skeleton';

@Component({
    template: `
        <div class="card">
            <div class="rounded-sm border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900">
                <div class="flex mb-4">
                    <p-skeleton shape="circle" size="4rem" class="mr-2" />
                    <div>
                        <p-skeleton width="10rem" class="mb-2" />
                        <p-skeleton width="5rem" class="mb-2" />
                        <p-skeleton height=".5rem" />
                    </div>
                </div>
                <p-skeleton width="100%" height="150px" />
                <div class="flex justify-between mt-4">
                    <p-skeleton width="4rem" height="2rem" />
                    <p-skeleton width="4rem" height="2rem" />
                </div>
            </div>
        </div>
    `,
    standalone: true,
    imports: [SkeletonModule]
})
export class SkeletonCardDemo {
}
```

## DataTable

Sample DataTable implementation using different Skeleton components and Tailwind CSS utilities.

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from '@exhaustive-ui/core/skeleton';
import { TableModule } from '@exhaustive-ui/core/table';

@Component({
    template: `
        <div class="card">
            <p-table [value]="products" [tableStyle]="{ 'min-width': '50rem' }">
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
                        <td><p-skeleton /></td>
                        <td><p-skeleton /></td>
                        <td><p-skeleton /></td>
                        <td><p-skeleton /></td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    standalone: true,
    imports: [SkeletonModule, TableModule, CommonModule]
})
export class SkeletonDatatableDemo implements OnInit {
    products: any[] | undefined;

    ngOnInit() {
        this.products = Array.from({ length: 5 }).map((_, i) => `Item #${i}`);
    }
}
```

## List

Sample List implementation using different Skeleton components and Tailwind CSS utilities.

```typescript
import { Component } from '@angular/core';
import { SkeletonModule } from '@exhaustive-ui/core/skeleton';

@Component({
    template: `
        <div class="card">
            <div class="rounded-sm border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900">
                <ul class="m-0 p-0 list-none">
                    <li class="mb-4">
                        <div class="flex">
                            <p-skeleton shape="circle" size="4rem" class="mr-2" />
                            <div class="self-center" style="flex: 1">
                                <p-skeleton width="100%" class="mb-2" />
                                <p-skeleton width="75%" />
                            </div>
                        </div>
                    </li>
                    <li class="mb-4">
                        <div class="flex">
                            <p-skeleton shape="circle" size="4rem" class="mr-2" />
                            <div class="self-center" style="flex: 1">
                                <p-skeleton width="100%" class="mb-2" />
                                <p-skeleton width="75%" />
                            </div>
                        </div>
                    </li>
                    <li class="mb-4">
                        <div class="flex">
                            <p-skeleton shape="circle" size="4rem" class="mr-2" />
                            <div class="self-center" style="flex: 1">
                                <p-skeleton width="100%" class="mb-2" />
                                <p-skeleton width="75%" />
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="flex">
                            <p-skeleton shape="circle" size="4rem" class="mr-2" />
                            <div class="self-center" style="flex: 1">
                                <p-skeleton width="100%" class="mb-2" />
                                <p-skeleton width="75%" />
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    `,
    standalone: true,
    imports: [SkeletonModule]
})
export class SkeletonListDemo {
}
```

## Shapes

Various shapes and sizes can be created using styling properties like shape , width , height , borderRadius and class .

```typescript
import { Component } from '@angular/core';
import { SkeletonModule } from '@exhaustive-ui/core/skeleton';

@Component({
    template: `
        <div class="card">
            <div class="flex flex-wrap">
                <div class="w-full xl:w-6/12 p-4">
                    <div class="font-semibold mb-4">Rectangle</div>
                    <p-skeleton class="mb-2" />
                    <p-skeleton width="10rem" class="mb-2" />
                    <p-skeleton width="5rem" class="mb-2" />
                    <p-skeleton height="2rem" class="mb-2" />
                    <p-skeleton width="10rem" height="4rem" />
                </div>
                <div class="w-full xl:w-6/12 p-4">
                    <div class="font-semibold mb-4">Rounded</div>
                    <p-skeleton class="mb-2" borderRadius="16px" />
                    <p-skeleton width="10rem" class="mb-2" borderRadius="16px" />
                    <p-skeleton width="5rem" class="mb-2" borderRadius="16px" />
                    <p-skeleton height="2rem" class="mb-2" borderRadius="16px" />
                    <p-skeleton width="10rem" height="4rem" borderRadius="16px" />
                </div>
                <div class="w-full xl:w-6/12 p-4">
                    <div class="font-semibold mt-4 mb-4">Square</div>
                    <div class="flex items-end">
                        <p-skeleton size="2rem" class="mr-2" />
                        <p-skeleton size="3rem" class="mr-2" />
                        <p-skeleton size="4rem" class="mr-2" />
                        <p-skeleton size="5rem" />
                    </div>
                </div>
                <div class="field w-full xl:w-6/12 p-4">
                    <div class="font-semibold mt-4 mb-4">Circle</div>
                    <div class="flex items-end">
                        <p-skeleton shape="circle" size="2rem" class="mr-2" />
                        <p-skeleton shape="circle" size="3rem" class="mr-2" />
                        <p-skeleton shape="circle" size="4rem" class="mr-2" />
                        <p-skeleton shape="circle" size="5rem" />
                    </div>
                </div>
            </div>
        </div>
    `,
    standalone: true,
    imports: [SkeletonModule]
})
export class SkeletonShapesDemo {
}
```

## Skeleton

Skeleton is a placeholder to display instead of the actual content.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | SkeletonPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| shape | string | 'rectangle' | Shape of the element. |
| animation | string | 'wave' | Type of the animation. |
| borderRadius | string | - | Border radius of the element, defaults to value from theme. |
| size | string | - | Size of the skeleton. |
| width | string | '100%' | Width of the element. |
| height | string | '1rem' | Height of the element. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| host | PassThroughOption<HTMLElement, I> | Used to pass attributes to the host's DOM element. |
| root | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the root's DOM element. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-skeleton | Class name of the root element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| skeleton.border.radius | --p-skeleton-border-radius | Border radius of root |
| skeleton.background | --p-skeleton-background | Background of root |
| skeleton.animation.background | --p-skeleton-animation-background | Animation background of root |

