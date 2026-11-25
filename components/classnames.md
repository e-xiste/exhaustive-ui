# Angular ClassNames Directive

ClassNames provides extended class binding functionality that is not possible with the native Angular directives.

## Examples

pClass directive accepts a string , array , object or any combination of these types with support for nesting. Angular's native class directive does not support combining multiple types with a single directive, nor white-space separated values in a single string. Note: For Tailwind Users, it is recommended to use the classAttributes configuration for intellisense support.

```typescript
import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ClassNamesModule } from '@exhaustive-ui/core/classnames';

@Component({
    template: `
        <div class="card">
            <div class="flex justify-between gap-4">
                <div class="flex flex-col gap-4">
                    <div class="font-semibold">pClass Directive</div>
                    <div class="flex flex-wrap items-center gap-4">
                        <div pClass="py-4 px-8 border border-surface rounded-lg">String</div>
                        <div [pClass]="['py-4', 'px-8', 'bg-primary text-primary-contrast', 'font-semibold', 'rounded-lg']">Array</div>
                        <div [pClass]="['p-4 rounded-lg', ['cursor-pointer', 'select-none', 'border'], { 'bg-primary text-primary-contrast border-primary': active1() }]" (click)="toggle1()">Combined</div>
                        <div [pClass]="nestedClasses()" (click)="toggle2()">Nested</div>
                    </div>
                </div>
                <div class="flex flex-col gap-4">
                    <div class="font-semibold">Native Class Directive</div>
                    <div class="flex flex-wrap items-center gap-4">
                        <div class="py-4 px-8 border border-surface rounded-lg">String</div>
                        <div [class]="['py-4', 'px-8', 'bg-primary', 'text-primary-contrast', 'font-semibold', 'rounded-lg']">Array</div>
                        <div
                            class="p-4 rounded-lg"
                            [class]="['cursor-pointer', 'select-none', 'border']"
                            [class.bg-primary]="active1()"
                            [class.text-primary-contrast]="active1()"
                            [class.border-surface]="active1()"
                            [class.border-primary]="active1()"
                            (click)="toggle1()"
                        >
                            Combined
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    standalone: true,
    imports: [ClassNamesModule, CommonModule]
})
export class ClassnamesExamplesDemo {
    active1 = signal<boolean>(false);

    active2 = signal<boolean>(false);

    nestedClasses = computed(() => [
        'p-4',
        'rounded-lg',
        {
            'bg-primary text-primary-contrast': this.active2()
        },
        [
            'cursor-pointer select-none',
            'border',
            {
                'bg-primary-100 text-primary-800': !this.active2()
            },
            ['shadow-xs hover:shadow-lg', 'transition-all']
        ]
    ]);

    toggle1() {
        this.active1.set(!this.active1());
    }

    toggle2() {
        this.active2.set(!this.active2());
    }
}
```

## Class Names

PClass directive provides extends class binding functionality.
Supports strings, arrays, objects, and mixed combinations.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| classNames | any | - | Class value(s) to be applied. Can be a string, array, object, or combination. |

