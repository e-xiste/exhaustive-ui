# Angular Stepper Component

The Stepper component displays a wizard-like workflow by guiding users through the multi-step progression.

## Horizontal

Stepper consists of a combination of StepList , Step , StepPanels and StepPanel components. The value property is essential for associating Step and StepPanel with each other.

```typescript
import { Component } from '@angular/core';
import { StepperModule } from '@exhaustive-ui/core/stepper';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-stepper [value]="1" class="basis-200">
                <p-step-list>
                    <p-step [value]="1">Header I</p-step>
                    <p-step [value]="2">Header II</p-step>
                    <p-step [value]="3">Header II</p-step>
                </p-step-list>
                <p-step-panels>
                    <p-step-panel [value]="1">
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-sm bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content I</div>
                            </div>
                            <div class="flex pt-6 justify-end">
                                <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="activateCallback(2)" />
                            </div>
                        </ng-template>
                    </p-step-panel>
                    <p-step-panel [value]="2">
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-sm bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content II</div>
                            </div>
                            <div class="flex pt-6 justify-between">
                                <p-button label="Back" severity="secondary" icon="pi pi-arrow-left" (onClick)="activateCallback(1)" />
                                <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="activateCallback(3)" />
                            </div>
                        </ng-template>
                    </p-step-panel>
                    <p-step-panel [value]="3">
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-sm bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content III</div>
                            </div>
                            <div class="flex pt-6 justify-start">
                                <p-button label="Back" icon="pi pi-arrow-left" iconPos="right" (onClick)="activateCallback(2)" />
                            </div>
                        </ng-template>
                    </p-step-panel>
                </p-step-panels>
            </p-stepper>
        </div>
    `,
    standalone: true,
    imports: [StepperModule, ButtonModule]
})
export class StepperBasicDemo {
}
```

## Vertical

Vertical layout requires StepItem as a wrapper of Step and StepPanel components.

```typescript
import { Component } from '@angular/core';
import { StepperModule } from '@exhaustive-ui/core/stepper';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <div class="card">
            <p-stepper [value]="1">
                <p-step-item [value]="1">
                    <p-step>Header I</p-step>
                    <p-step-panel>
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-sm bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content I</div>
                            </div>
                            <div class="py-6">
                                <p-button label="Next" (onClick)="activateCallback(2)" />
                            </div>
                        </ng-template>
                    </p-step-panel>
                </p-step-item>
                <p-step-item [value]="2">
                    <p-step>Header II</p-step>
                    <p-step-panel>
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-sm bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content II</div>
                            </div>
                            <div class="flex py-6 gap-2">
                                <p-button label="Back" severity="secondary" (onClick)="activateCallback(1)" />
                                <p-button label="Next" (onClick)="activateCallback(3)" />
                            </div>
                        </ng-template>
                    </p-step-panel>
                </p-step-item>
                <p-step-item [value]="3">
                    <p-step>Header III</p-step>
                    <p-step-panel>
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-sm bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content III</div>
                            </div>
                            <div class="py-6">
                                <p-button label="Back" severity="secondary" (onClick)="activateCallback(2)" />
                            </div>
                        </ng-template>
                    </p-step-panel>
                </p-step-item>
            </p-stepper>
        </div>
    `,
    standalone: true,
    imports: [StepperModule, ButtonModule]
})
export class StepperVerticalDemo {
}
```

## Linear

When linear property is set to true, current step must be completed in order to move to the next step.

```typescript
import { Component } from '@angular/core';
import { StepperModule } from '@exhaustive-ui/core/stepper';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-stepper [value]="1" class="basis-200" [linear]="true">
                <p-step-list>
                    <p-step [value]="1">Header I</p-step>
                    <p-step [value]="2">Header II</p-step>
                    <p-step [value]="3">Header II</p-step>
                </p-step-list>
                <p-step-panels>
                    <p-step-panel [value]="1">
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-sm bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content I</div>
                            </div>
                            <div class="flex pt-6 justify-end">
                                <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="activateCallback(2)" />
                            </div>
                        </ng-template>
                    </p-step-panel>
                    <p-step-panel [value]="2">
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-sm bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content II</div>
                            </div>
                            <div class="flex pt-6 justify-between">
                                <p-button label="Back" severity="secondary" icon="pi pi-arrow-left" (onClick)="activateCallback(1)" />
                                <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="activateCallback(3)" />
                            </div>
                        </ng-template>
                    </p-step-panel>
                    <p-step-panel [value]="3">
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-sm bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content III</div>
                            </div>
                            <div class="flex pt-6 justify-start">
                                <p-button label="Back" icon="pi pi-arrow-left" iconPos="right" (onClick)="activateCallback(2)" />
                            </div>
                        </ng-template>
                    </p-step-panel>
                </p-step-panels>
            </p-stepper>
        </div>
    `,
    standalone: true,
    imports: [StepperModule, ButtonModule]
})
export class StepperLinearDemo {
}
```

## Steps Only

Use Stepper with a StepList only for custom requirements where a progress indicator is needed.

## Template

Stepper provides various templating options to customize the default UI design.

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StepperModule } from '@exhaustive-ui/core/stepper';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { PasswordModule } from '@exhaustive-ui/core/password';
import { ToggleButtonModule } from '@exhaustive-ui/core/togglebutton';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-stepper [(value)]="activeStep" class="basis-160">
                <p-step-list>
                    <p-step [value]="1" class="flex flex-row flex-auto gap-2">
                        <ng-template #content let-activateCallback="activateCallback" let-value="value">
                            <button class="bg-transparent border-0 inline-flex flex-col gap-2" aria-label="Account" (click)="activateCallback()">
                                <span
                                    class="rounded-full border-2 w-12 h-12 inline-flex items-center justify-center"
                                    [ngClass]="{
                                        'bg-primary text-primary-contrast border-primary': value <= activeStep,
                                        'border-surface': value > activeStep
                                    }"
                                >
                                    <i class="pi pi-user"></i>
                                </span>
                            </button>
                        </ng-template>
                    </p-step>
                    <p-step [value]="2" class="flex flex-row flex-auto gap-2">
                        <ng-template #content let-activateCallback="activateCallback" let-value="value">
                            <button class="bg-transparent border-0 inline-flex flex-col gap-2" aria-label="Interests" (click)="activateCallback()">
                                <span
                                    class="rounded-full border-2 w-12 h-12 inline-flex items-center justify-center"
                                    [ngClass]="{
                                        'bg-primary text-primary-contrast border-primary': value <= activeStep,
                                        'border-surface': value > activeStep
                                    }"
                                >
                                    <i class="pi pi-star"></i>
                                </span>
                            </button>
                        </ng-template>
                    </p-step>
                    <p-step [value]="3" class="flex flex-row flex-auto gap-2">
                        <ng-template #content let-activateCallback="activateCallback" let-value="value">
                            <button class="bg-transparent border-0 inline-flex flex-col gap-2" aria-label="Confirmation" (click)="activateCallback()">
                                <span
                                    class="rounded-full border-2 w-12 h-12 inline-flex items-center justify-center"
                                    [ngClass]="{
                                        'bg-primary text-primary-contrast border-primary': value <= activeStep,
                                        'border-surface': value > activeStep
                                    }"
                                >
                                    <i class="pi pi-id-card"></i>
                                </span>
                            </button>
                        </ng-template>
                    </p-step>
                </p-step-list>
                <p-step-panels>
                    <p-step-panel [value]="1">
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                                <div class="text-center mt-4 mb-4 text-xl font-semibold">Create your account</div>
                                <div class="field">
                                    <input [(ngModel)]="name" pInputText id="input" type="text" placeholder="Name" fluid />
                                </div>
                                <div class="field">
                                    <input [(ngModel)]="email" pInputText id="email" type="email" placeholder="Email" fluid />
                                </div>
                                <div class="field">
                                    <p-password [(ngModel)]="password" placeholder="Password" fluid />
                                </div>
                            </div>
                            <div class="flex pt-6 justify-end">
                                <p-button (onClick)="activateCallback(2)" label="Next" icon="pi pi-arrow-right" iconPos="right" />
                            </div>
                        </ng-template>
                    </p-step-panel>
                    <p-step-panel [value]="2">
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
                                <div class="text-center mt-4 mb-4 text-xl font-semibold">Choose your interests</div>
                                <div class="flex flex-wrap justify-center gap-4">
                                    <p-toggle-button [(ngModel)]="option1" onLabel="Nature" offLabel="Nature" />
                                    <p-toggle-button [(ngModel)]="option2" onLabel="Art" offLabel="Art" />
                                    <p-toggle-button [(ngModel)]="option3" onLabel="Music" offLabel="Music" />
                                    <p-toggle-button [(ngModel)]="option4" onLabel="Design" offLabel="Design" />
                                    <p-toggle-button [(ngModel)]="option5" onLabel="Photography" offLabel="Photography" />
                                    <p-toggle-button [(ngModel)]="option6" onLabel="Movies" offLabel="Movies" />
                                    <p-toggle-button [(ngModel)]="option7" onLabel="Sports" offLabel="Sports" />
                                    <p-toggle-button [(ngModel)]="option8" onLabel="Gaming" offLabel="Gaming" />
                                    <p-toggle-button [(ngModel)]="option9" onLabel="Traveling" offLabel="Traveling" />
                                    <p-toggle-button [(ngModel)]="option10" onLabel="Dancing" offLabel="Dancing" />
                                </div>
                            </div>
                            <div class="flex pt-6 justify-between">
                                <p-button (onClick)="activateCallback(1)" label="Back" severity="secondary" icon="pi pi-arrow-left" />
                                <p-button (onClick)="activateCallback(3)" label="Next" icon="pi pi-arrow-right" iconPos="right" />
                            </div>
                        </ng-template>
                    </p-step-panel>
                    <p-step-panel [value]="3">
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col items-center gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
                                <div class="text-center mt-4 mb-4 text-xl font-semibold">Account created successfully</div>
                                <div class="text-center">
                                    <img alt="logo" src="https://exhaustive-ui.com/demo/stepper/content.svg" />
                                </div>
                            </div>
                            <div class="flex pt-6 justify-start">
                                <p-button (onClick)="activateCallback(2)" label="Back" severity="secondary" icon="pi pi-arrow-left" />
                            </div>
                        </ng-template>
                    </p-step-panel>
                </p-step-panels>
            </p-stepper>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, FormsModule, StepperModule, ButtonModule, PasswordModule, ToggleButtonModule, InputTextModule]
})
export class StepperTemplateDemo {
    activeStep: number = 1;

    name: string | undefined = null;

    email: string | undefined = null;

    password: string | undefined = null;

    option1: boolean | undefined = false;

    option2: boolean | undefined = false;

    option3: boolean | undefined = false;

    option4: boolean | undefined = false;

    option5: boolean | undefined = false;

    option6: boolean | undefined = false;

    option7: boolean | undefined = false;

    option8: boolean | undefined = false;

    option9: boolean | undefined = false;

    option10: boolean | undefined = false;
}
```

## Accessibility

Screen Reader Stepper container is defined with the tablist role, as any attribute is passed to the container element aria-labelledby can be optionally used to specify an element to describe the Stepper. Each stepper header has a tab role and aria-controls to refer to the corresponding stepper content element. The content element of each stepper has tabpanel role, an id to match the aria-controls of the header and aria-labelledby reference to the header as the accessible name. Tab Header Keyboard Support Key Function tab Moves focus through the header. enter Activates the focused stepper header. space Activates the focused stepper header.

## Stepper

Stepper is a component that streamlines a wizard-like workflow, organizing content into coherent steps and visually guiding users through a numbered progression in a multistep process.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | StepperPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| value | number | undefined | A model that can hold a numeric value or be undefined. |
| linear | any | false | A boolean variable that captures user input. |
| motionOptions | MotionOptions | - | The motion options. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| root | PassThroughOption<HTMLElement, I> | Used to pass attributes to the root's DOM element. |
| motion | MotionOptions | Used to pass options to the motion component/directive. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-stepper | Class name of the root element |
| p-stepper-separator | Class name of the separator element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| stepper.transition.duration | --p-stepper-transition-duration | Transition duration of root |
| stepper.separator.background | --p-stepper-separator-background | Background of separator |
| stepper.separator.active.background | --p-stepper-separator-active-background | Active background of separator |
| stepper.separator.margin | --p-stepper-separator-margin | Margin of separator |
| stepper.separator.size | --p-stepper-separator-size | Size of separator |
| stepper.step.padding | --p-stepper-step-padding | Padding of step |
| stepper.step.gap | --p-stepper-step-gap | Gap of step |
| stepper.step.header.padding | --p-stepper-step-header-padding | Padding of step header |
| stepper.step.header.border.radius | --p-stepper-step-header-border-radius | Border radius of step header |
| stepper.step.header.focus.ring.width | --p-stepper-step-header-focus-ring-width | Focus ring width of step header |
| stepper.step.header.focus.ring.style | --p-stepper-step-header-focus-ring-style | Focus ring style of step header |
| stepper.step.header.focus.ring.color | --p-stepper-step-header-focus-ring-color | Focus ring color of step header |
| stepper.step.header.focus.ring.offset | --p-stepper-step-header-focus-ring-offset | Focus ring offset of step header |
| stepper.step.header.focus.ring.shadow | --p-stepper-step-header-focus-ring-shadow | Focus ring shadow of step header |
| stepper.step.header.gap | --p-stepper-step-header-gap | Gap of step header |
| stepper.step.title.color | --p-stepper-step-title-color | Color of step title |
| stepper.step.title.active.color | --p-stepper-step-title-active-color | Active color of step title |
| stepper.step.title.font.weight | --p-stepper-step-title-font-weight | Font weight of step title |
| stepper.step.number.background | --p-stepper-step-number-background | Background of step number |
| stepper.step.number.active.background | --p-stepper-step-number-active-background | Active background of step number |
| stepper.step.number.border.color | --p-stepper-step-number-border-color | Border color of step number |
| stepper.step.number.active.border.color | --p-stepper-step-number-active-border-color | Active border color of step number |
| stepper.step.number.color | --p-stepper-step-number-color | Color of step number |
| stepper.step.number.active.color | --p-stepper-step-number-active-color | Active color of step number |
| stepper.step.number.size | --p-stepper-step-number-size | Size of step number |
| stepper.step.number.font.size | --p-stepper-step-number-font-size | Font size of step number |
| stepper.step.number.font.weight | --p-stepper-step-number-font-weight | Font weight of step number |
| stepper.step.number.border.radius | --p-stepper-step-number-border-radius | Border radius of step number |
| stepper.step.number.shadow | --p-stepper-step-number-shadow | Shadow of step number |
| stepper.steppanels.padding | --p-stepper-steppanels-padding | Padding of steppanels |
| stepper.steppanel.background | --p-stepper-steppanel-background | Background of steppanel |
| stepper.steppanel.color | --p-stepper-steppanel-color | Color of steppanel |
| stepper.steppanel.padding | --p-stepper-steppanel-padding | Padding of steppanel |
| stepper.steppanel.indent | --p-stepper-steppanel-indent | Indent of steppanel |

