# Angular Tour Component

Tour guides the user through the interface, one step at a time: a spotlight highlights an element and a card next to it explains it, with a step counter and back and next buttons. It is an accessible dialog that follows its target when the page scrolls or the layout changes.

## Basic

A tour is a list of steps . Each step highlights its target , a CSS selector, an element or a function that returns one, and explains it in a card with a title and a text. The visible property starts and stops the tour; the card has a step counter, progress dots, back, next and close buttons. The mask darkens the page around a spotlight that follows the target when the page scrolls or the layout changes.

```typescript
import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { TourModule, TourStep } from '@exhaustive-ui/core/tour';

@Component({
    template: `
        <div class="card flex flex-col gap-6">
            <div class="flex flex-wrap items-center gap-2 p-3 border border-surface rounded-border">
                <p-button id="tour-basic-new" label="New" icon="pi pi-plus" size="small" />
                <input id="tour-basic-search" pInputText placeholder="Search" aria-label="Search" class="flex-1 min-w-40" />
                <p-button id="tour-basic-settings" icon="pi pi-cog" severity="secondary" size="small" ariaLabel="Settings" />
            </div>
            <div class="flex justify-center">
                <p-button label="Start the tour" icon="pi pi-play" (onClick)="visible = true" />
            </div>
            <p-tour [steps]="steps" [(visible)]="visible" />
        </div>
    `,
    standalone: true,
    imports: [TourModule, ButtonModule, InputTextModule]
})
export class TourBasicDemo {
    visible = false;

    steps: TourStep[] = [
        { target: '#tour-basic-new', title: 'Create a document', content: 'Start a new document from a blank page or a template.' },
        { target: '#tour-basic-search', title: 'Search', content: 'Find any document by its name or its content.' },
        { target: '#tour-basic-settings', title: 'Settings', content: 'Change the language, the theme and your notifications.' }
    ];
}
```

## Placement

The card is displayed below the target by default. The placement of the tour, or of a step, puts it on another side: top , right , bottom , left , auto for the side with the most room, or center . When the card does not fit, it flips to the opposite side, then to the side with the most room, and it always stays inside the screen. In right-to-left documents, left and right are swapped.

```typescript
import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TourModule, TourStep } from '@exhaustive-ui/core/tour';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-6">
            <div id="tour-placement-target" class="flex items-center justify-center w-40 h-24 rounded-border bg-primary text-primary-contrast font-semibold">Target</div>
            <p-button label="Show the placements" icon="pi pi-play" (onClick)="visible = true" />
            <p-tour [steps]="steps" [(visible)]="visible" />
        </div>
    `,
    standalone: true,
    imports: [TourModule, ButtonModule]
})
export class TourPlacementDemo {
    visible = false;

    steps: TourStep[] = [
        { target: '#tour-placement-target', placement: 'top', title: 'Top', content: 'The card is above the target.' },
        { target: '#tour-placement-target', placement: 'right', title: 'Right', content: 'The card is on the right of the target.' },
        { target: '#tour-placement-target', placement: 'bottom', title: 'Bottom', content: 'The card is below the target.' },
        { target: '#tour-placement-target', placement: 'left', title: 'Left', content: 'The card is on the left of the target.' },
        { target: '#tour-placement-target', placement: 'auto', title: 'Auto', content: 'The card is on the side with the most room.' }
    ];
}
```

## Centered Step

A step without target is displayed in the middle of the screen, for a welcome or a closing message. A step whose target is not found, an element that is not rendered yet for example, is centered too and a warning is logged; with missingTarget set to skip , the tour moves on to the following step instead.

```typescript
import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TourModule, TourStep } from '@exhaustive-ui/core/tour';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-6">
            <p-button id="tour-centered-profile" label="Your profile" icon="pi pi-user" severity="secondary" />
            <p-button label="Start the tour" icon="pi pi-play" (onClick)="visible = true" />
            <p-tour [steps]="steps" [(visible)]="visible" />
        </div>
    `,
    standalone: true,
    imports: [TourModule, ButtonModule]
})
export class TourCenteredDemo {
    visible = false;

    steps: TourStep[] = [
        { title: 'Welcome aboard', content: 'This short tour shows you around. It takes less than a minute.' },
        { target: '#tour-centered-profile', title: 'Your profile', content: 'Add a picture and tell your team what you work on.' },
        { target: '#tour-centered-not-rendered', title: 'Missing target', content: 'This target does not exist, so the step is centered.' },
        { title: 'You are all set', content: 'Restart the tour at any time from the help menu.' }
    ];
}
```

## Template

The step template replaces the whole card. It receives the step, its index , the total , first and last flags, the next , prev , goTo and close functions, and the titleId and contentId to give to the title and the text so that they label and describe the dialog. The header , content and footer templates replace one part of the card only and receive the same context. Use the data of a step for anything else the template needs.

```typescript
import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TourModule, TourStep } from '@exhaustive-ui/core/tour';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-6">
            <div class="flex gap-2">
                <p-button id="tour-template-inbox" label="Inbox" icon="pi pi-inbox" severity="secondary" />
                <p-button id="tour-template-calendar" label="Calendar" icon="pi pi-calendar" severity="secondary" />
            </div>
            <p-button label="Start the tour" icon="pi pi-play" (onClick)="visible = true" />
            <p-tour [steps]="steps" [(visible)]="visible">
                <ng-template #step let-step let-index="index" let-total="total" let-first="first" let-last="last" let-next="next" let-prev="prev" let-close="close" let-titleId="titleId" let-contentId="contentId">
                    <div class="flex items-center gap-3">
                        <span class="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-contrast">
                            <i [class]="step.data.icon" aria-hidden="true"></i>
                        </span>
                        <div class="flex flex-col">
                            <span class="text-sm text-muted-color">Step {{ index + 1 }} of {{ total }}</span>
                            <span [id]="titleId" class="font-semibold text-lg">{{ step.title }}</span>
                        </div>
                    </div>
                    <p [id]="contentId" class="m-0 leading-normal">{{ step.content }}</p>
                    <div class="flex justify-between gap-2">
                        <p-button label="Skip" severity="secondary" [text]="true" size="small" (onClick)="close()" />
                        <div class="flex gap-2">
                            @if (!first) {
                                <p-button icon="pi pi-arrow-left" severity="secondary" [outlined]="true" size="small" ariaLabel="Back" (onClick)="prev()" />
                            }
                            <p-button [label]="last ? 'Start working' : 'Continue'" size="small" (onClick)="next()" />
                        </div>
                    </div>
                </ng-template>
            </p-tour>
        </div>
    `,
    standalone: true,
    imports: [TourModule, ButtonModule]
})
export class TourTemplateDemo {
    visible = false;

    steps: TourStep[] = [
        { target: '#tour-template-inbox', title: 'Your inbox', content: 'Messages from your team and your clients land here.', data: { icon: 'pi pi-inbox' } },
        { target: '#tour-template-calendar', title: 'Your calendar', content: 'Meetings and deadlines, synchronized with your agenda.', data: { icon: 'pi pi-calendar' } }
    ];
}
```

## Controlled

The current step is the two-way activeIndex property: set it to start the tour at a given step or to move it from outside. onStepChange is emitted on every new step, onFinish when the user completes the tour and onClose , with its reason, when the tour is closed before its end. The component also has start(index) , next() , prev() , goTo(index) , close() , finish() and refresh() methods.

```typescript
import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TourModule, TourStep, TourStepChangeEvent } from '@exhaustive-ui/core/tour';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-6">
            <div class="flex flex-wrap justify-center gap-2">
                @for (step of steps; track step.title; let i = $index) {
                    <p-button [id]="'tour-controlled-' + i" [label]="'Start at step ' + (i + 1)" severity="secondary" (onClick)="startAt(i)" />
                }
            </div>
            <div class="text-muted-color" aria-live="polite">{{ status }}</div>
            <p-tour [steps]="steps" [(visible)]="visible" [(activeIndex)]="activeIndex" (onStepChange)="onStepChange($event)" (onFinish)="status = 'Tour completed'" (onClose)="status = 'Tour closed (' + $event.reason + ')'" />
        </div>
    `,
    standalone: true,
    imports: [TourModule, ButtonModule]
})
export class TourControlledDemo {
    visible = false;

    activeIndex = 0;

    status = 'Not started';

    steps: TourStep[] = [
        { target: '#tour-controlled-0', title: 'Step 1', content: 'The first button starts the tour here.' },
        { target: '#tour-controlled-1', title: 'Step 2', content: 'The second button starts the tour here.' },
        { target: '#tour-controlled-2', title: 'Step 3', content: 'The third button starts the tour here.' }
    ];

    startAt(index: number) {
        this.activeIndex = index;
        this.visible = true;
        this.status = `Step ${index + 1}`;
    }

    onStepChange(event: TourStepChangeEvent) {
        this.status = `Step ${event.index + 1}, coming from step ${event.previousIndex + 1}`;
    }
}
```

## Without Mask

With mask set to false, the page stays usable while the tour runs: the target keeps its ring, the card is a non-modal dialog and the focus is not trapped in it. Use it for hints the user follows while working, here filling a field.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';
import { TourModule, TourStep } from '@exhaustive-ui/core/tour';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-6">
            <input id="tour-nomask-name" pInputText [(ngModel)]="name" placeholder="Project name" aria-label="Project name" />
            <p-button label="Show the hint" icon="pi pi-play" (onClick)="visible = true" />
            <p-tour [steps]="steps" [(visible)]="visible" [mask]="false" />
        </div>
    `,
    standalone: true,
    imports: [TourModule, ButtonModule, InputTextModule, FormsModule]
})
export class TourWithoutmaskDemo {
    visible = false;

    name = '';

    steps: TourStep[] = [{ target: '#tour-nomask-name', placement: 'right', title: 'Name your project', content: 'You can type in the field while this hint is open.' }];
}
```

## Spotlight

spotlightPadding and spotlightRadius size the cut-out around the target, in pixels, for the whole tour or for one step. The highlighted target stays clickable unless disableInteraction is set. A click on the mask closes the tour with dismissableMask , and closeOnEscape controls the Escape key.

```typescript
import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TourModule, TourStep } from '@exhaustive-ui/core/tour';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-6">
            <div class="flex gap-6 items-center">
                <p-button id="tour-spotlight-round" icon="pi pi-heart" [rounded]="true" ariaLabel="Favorite" />
                <p-button id="tour-spotlight-locked" label="Delete account" severity="danger" (onClick)="deleted = deleted + 1" />
            </div>
            <p-button label="Start the tour" icon="pi pi-play" (onClick)="visible = true" />
            <p-tour [steps]="steps" [(visible)]="visible" [dismissableMask]="true" />
        </div>
    `,
    standalone: true,
    imports: [TourModule, ButtonModule]
})
export class TourSpotlightDemo {
    visible = false;

    deleted = 0;

    steps: TourStep[] = [
        { target: '#tour-spotlight-round', spotlightPadding: 6, spotlightRadius: 999, title: 'Round spotlight', content: 'The cut-out follows the shape of the button.' },
        { target: '#tour-spotlight-locked', disableInteraction: true, title: 'Not clickable', content: 'This button cannot be clicked while the step is displayed. Click the mask to close the tour.' }
    ];
}
```

## Labels

Every text of the component, screen reader announcements included, can be replaced through labels . Missing keys keep their English default; the close button uses the aria.close text of the locale. Placeholders such as {{ '{0}' }} receive the values. showCounter and showDots hide the counter and the dots.

```typescript
import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TourLabels, TourModule, TourStep } from '@exhaustive-ui/core/tour';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-6">
            <p-button id="tour-labels-share" label="Partager" icon="pi pi-share-alt" severity="secondary" />
            <p-button label="Lancer la visite" icon="pi pi-play" (onClick)="visible = true" />
            <p-tour [steps]="steps" [(visible)]="visible" [labels]="labels" />
        </div>
    `,
    standalone: true,
    imports: [TourModule, ButtonModule]
})
export class TourLabelsDemo {
    visible = false;

    labels: Partial<TourLabels> = {
        next: 'Suivant',
        prev: 'Retour',
        done: 'Terminer',
        close: 'Fermer',
        counter: '{0} sur {1}',
        stepLabel: 'Étape {0} sur {1}',
        stepMessage: 'Étape {0} sur {1} : {2}'
    };

    steps: TourStep[] = [
        { title: 'Bienvenue', content: 'Découvrez les nouveautés en deux étapes.' },
        { target: '#tour-labels-share', title: 'Partager', content: 'Invitez vos collègues à modifier le document.' }
    ];
}
```

## Accessibility

Screen Reader The card is an element with the dialog role, labelled by the title of the step with aria-labelledby and described by its text with aria-describedby ; a step without title is labelled by its counter, for example "Step 2 of 5". With the mask, the dialog is modal, aria-modal is true and the focus stays in the card; without mask, it is a non-modal dialog. The mask, the spotlight, the arrow and the progress dots are hidden from assistive technologies, and the visible "2 / 5" counter is read as "Step 2 of 5". A polite live region announces each new step with its title. Every text can be translated through labels . When the tour starts, the focus moves into the card; when a step changes, it stays on the button the user pressed, or moves to the card. When the tour ends, the focus returns to the element that had it before, usually the button that started the tour. A custom step template gives titleId and contentId to its title and text to keep the dialog labelled. The transitions of the spotlight and the card are disabled, and the target is scrolled into view without smooth scrolling, when the user prefers reduced motion.

## Tour

Tour guides the user through the interface, one step at a time: a spotlight highlights an element and a card next to it explains it.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | TourPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| steps | TourStep[] | [] | Steps of the tour. A step without target is displayed in the middle of the screen. |
| visible | boolean | false | Whether the tour is running. |
| activeIndex | number | 0 | Index of the current step. |
| mask | boolean | true | Whether a mask darkens the page around the target. The card is then a modal dialog that keeps the focus. |
| dismissableMask | boolean | false | Whether a click on the mask closes the tour. |
| closeOnEscape | boolean | true | Whether the Escape key closes the tour. |
| closable | boolean | true | Whether the card has a close button. |
| keyboardNavigation | boolean | true | Whether the left and right arrow keys go to the previous and next steps while the card has the focus. |
| placement | TourPlacement | 'bottom' | Default side of the target the card is displayed on. |
| spotlightPadding | number | 8 | Default space between the target and the edge of the spotlight, in pixels. |
| spotlightRadius | number | 8 | Default corner radius of the spotlight, in pixels. |
| offset | number | 12 | Space between the spotlight and the card, in pixels. |
| scrollIntoView | boolean | true | Whether the target of a step is scrolled into view when the step starts. |
| disableInteraction | boolean | false | Whether clicks on the highlighted target are blocked. |
| missingTarget | TourMissingTarget | 'center' | What to do with a step whose target is not found: show it in the middle of the screen, or skip it. A warning is logged in both cases. |
| showCounter | boolean | true | Whether the step counter, such as "2 / 5", is displayed. |
| showDots | boolean | true | Whether the progress dots are displayed. |
| labels | Partial<TourLabels> | - | Texts of the component. Missing keys keep their default. |
| appendTo | HTMLElement \| "body" \| "self" \| ElementRef<any> | 'body' | Target element to attach the tour to,  `body`  by default, or  `self`  to keep it inside the component. |
| autoZIndex | boolean | true | Whether to automatically manage layering. |
| baseZIndex | number | 0 | Base zIndex value to use in layering. |

### Emits

| Name | Parameters | Description |
|------|------------|-------------|
| onStepChange | event: TourStepChangeEvent | Callback to invoke when another step is displayed. |
| onFinish | event: TourFinishEvent | Callback to invoke when the user completes the tour with the button of the last step. |
| onClose | event: TourCloseEvent | Callback to invoke when the tour is closed before its end: close button, Escape key, mask click or close() method. |

### Templates

| Name | Type | Description |
|------|------|-------------|
| step | TemplateRef<TourStepTemplateContext> | Custom content of the whole card. |
| header | TemplateRef<TourStepTemplateContext> | Custom header of the card, in place of the title. |
| content | TemplateRef<TourStepTemplateContext> | Custom content of the card, in place of the text of the step. |
| footer | TemplateRef<TourStepTemplateContext> | Custom footer of the card, in place of the counter and the buttons. |

### Methods

| Name | Parameters | Return Type | Description |
|------|------------|-------------|-------------|
| start | index: number | void | Starts the tour. |
| next |  | void | Goes to the next step, or finishes the tour on the last step. |
| prev |  | void | Goes to the previous step. |
| goTo | index: number | void | Goes to a step. |
| close | reason: TourCloseReason | void | Closes the tour before its end and emits onClose. |
| finish |  | void | Ends the tour as completed and emits onFinish. |
| refresh |  | void | Recomputes the position of the spotlight and the card, after a layout change the component cannot observe. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| host | PassThroughOption<HTMLElement, I> | Used to pass attributes to the host's DOM element. |
| root | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the root's DOM element, the fixed layer that holds the mask and the card. |
| mask | PassThroughOption<SVGElement, I> | Used to pass attributes to the mask's SVG element. |
| spotlight | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the spotlight's DOM element, the ring around the target. |
| blocker | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the element that covers the target when interaction is disabled. |
| card | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the card's DOM element, the dialog. |
| arrow | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the arrow's DOM element. |
| header | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the header's DOM element. |
| title | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the title's DOM element. |
| pcCloseButton | ButtonPassThrough | Used to pass attributes to the close Button component. |
| content | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the content's DOM element. |
| footer | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the footer's DOM element. |
| progress | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the progress's DOM element, which holds the counter and the dots. |
| counter | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the step counter's DOM element. |
| dots | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the dots container's DOM element. |
| dot | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to a dot's DOM element. |
| actions | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the actions container's DOM element. |
| pcPrevButton | ButtonPassThrough | Used to pass attributes to the back Button component. |
| pcNextButton | ButtonPassThrough | Used to pass attributes to the next and done Button component. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-tour | Class name of the root element |
| p-tour-mask | Class name of the mask |
| p-tour-spotlight | Class name of the spotlight ring |
| p-tour-blocker | Class name of the element that covers the target when interaction is disabled |
| p-tour-card | Class name of the card |
| p-tour-arrow | Class name of the arrow |
| p-tour-header | Class name of the header |
| p-tour-title | Class name of the title |
| p-tour-close-button | Class name of the close button |
| p-tour-content | Class name of the content |
| p-tour-footer | Class name of the footer |
| p-tour-progress | Class name of the progress |
| p-tour-counter | Class name of the step counter |
| p-tour-dots | Class name of the dots |
| p-tour-dot | Class name of a dot |
| p-tour-actions | Class name of the actions |
| p-tour-prev-button | Class name of the back button |
| p-tour-next-button | Class name of the next button |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| tour.transition.duration | --p-tour-transition-duration | Transition duration of root |
| tour.mask.background | --p-tour-mask-background | Background of mask |
| tour.spotlight.shadow | --p-tour-spotlight-shadow | Shadow of spotlight |
| tour.card.background | --p-tour-card-background | Background of card |
| tour.card.border.color | --p-tour-card-border-color | Border color of card |
| tour.card.color | --p-tour-card-color | Color of card |
| tour.card.border.radius | --p-tour-card-border-radius | Border radius of card |
| tour.card.shadow | --p-tour-card-shadow | Shadow of card |
| tour.card.padding | --p-tour-card-padding | Padding of card |
| tour.card.width | --p-tour-card-width | Width of card |
| tour.card.gap | --p-tour-card-gap | Gap of card |
| tour.card.focus.ring.width | --p-tour-card-focus-ring-width | Focus ring width of card |
| tour.card.focus.ring.style | --p-tour-card-focus-ring-style | Focus ring style of card |
| tour.card.focus.ring.color | --p-tour-card-focus-ring-color | Focus ring color of card |
| tour.card.focus.ring.offset | --p-tour-card-focus-ring-offset | Focus ring offset of card |
| tour.arrow.size | --p-tour-arrow-size | Size of arrow |
| tour.header.gap | --p-tour-header-gap | Gap of header |
| tour.title.font.size | --p-tour-title-font-size | Font size of title |
| tour.title.font.weight | --p-tour-title-font-weight | Font weight of title |
| tour.footer.gap | --p-tour-footer-gap | Gap of footer |
| tour.counter.color | --p-tour-counter-color | Color of counter |
| tour.counter.font.size | --p-tour-counter-font-size | Font size of counter |
| tour.dot.size | --p-tour-dot-size | Size of dot |
| tour.dot.gap | --p-tour-dot-gap | Gap of dot |
| tour.dot.background | --p-tour-dot-background | Background of dot |
| tour.dot.active.background | --p-tour-dot-active-background | Active background of dot |
| tour.dot.active.width | --p-tour-dot-active-width | Active width of dot |
| tour.actions.gap | --p-tour-actions-gap | Gap of actions |

