# Angular Mention Component

Mention suggests users, tags or commands while a trigger such as @ or # is typed in a textarea or an input, and inserts the chosen suggestion in the text. Its value is plain text, and it works with every kind of Angular form.

## Basic

Mention is bound with ngModel and its value is the plain text. Typing @ at the start of a word emits onSearch with the text typed after it as event.query ; the handler answers by setting suggestions . Choosing one with the mouse, enter or tab replaces the query with the trigger, the suggestion and a space. A mention typed right before a word keeps that word, while a suggestion chosen with the caret moved into an existing mention replaces the whole mention.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';

@Component({
    template: `
        <div class="card">
            <p-mention [(ngModel)]="text" [suggestions]="suggestions" (onSearch)="search($event)" [rows]="4" placeholder="Type @ to mention someone" ariaLabel="Comment" fluid />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, MentionModule]
})
export class MentionBasicDemo {
    text = '';

    users = ['amyelsner', 'annafali', 'asiyajavayant', 'bernardodominic', 'elwinsharvill', 'ionibowcher', 'ivanmagalhaes', 'onyamalimba', 'stephenshaw', 'xuxuefeng'];

    suggestions: string[] = [];

    search(event: MentionSearchEvent) {
        this.suggestions = this.users.filter((user) => user.startsWith(event.query.toLowerCase()));
    }
}
```

## Multiple Triggers

triggers lists the characters that start a mention, @ only by default. event.trigger tells the search handler which one was typed, here users for @ and tags for # , and the item template receives it as trigger . A trigger only counts at the start of a word, so an email address does not open the panel.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';

@Component({
    template: `
        <div class="card">
            <p-mention [(ngModel)]="text" [triggers]="['@', '#']" [suggestions]="suggestions" (onSearch)="search($event)" [rows]="4" placeholder="Mention a user with @ or add a tag with #" ariaLabel="Post" fluid>
                <ng-template #item let-option let-trigger="trigger">
                    @if (trigger === '#') {
                        <i class="pi pi-hashtag" aria-hidden="true"></i>
                    } @else {
                        <i class="pi pi-user" aria-hidden="true"></i>
                    }
                    <span>{{ option }}</span>
                </ng-template>
            </p-mention>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, MentionModule]
})
export class MentionTriggersDemo {
    text = '';

    users = ['amyelsner', 'annafali', 'asiyajavayant', 'bernardodominic', 'elwinsharvill', 'ionibowcher', 'onyamalimba', 'xuxuefeng'];

    tags = ['angular', 'accessibility', 'design', 'forms', 'performance', 'release', 'signals', 'theming'];

    suggestions: string[] = [];

    search(event: MentionSearchEvent) {
        const source = event.trigger === '#' ? this.tags : this.users;
        this.suggestions = source.filter((item) => item.startsWith(event.query.toLowerCase()));
    }
}
```

## Template

Suggestions can be objects: optionLabel names the property that is inserted in the text. The item template renders each suggestion, with an avatar for instance, and header , footer and empty templates customize the panel. With autoResize , the textarea grows with its content.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from '@exhaustive-ui/core/avatar';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';

interface User {
    name: string;
    username: string;
    image: string;
}

@Component({
    template: `
        <div class="card">
            <p-mention [(ngModel)]="text" [suggestions]="suggestions" optionLabel="username" (onSearch)="search($event)" [rows]="3" autoResize placeholder="Write a reply, type @ to mention someone" ariaLabel="Reply" fluid>
                <ng-template #header>
                    <div class="font-medium px-3 pt-2 pb-1 text-sm">People in this conversation</div>
                </ng-template>
                <ng-template #item let-user>
                    <p-avatar [image]="'https://exhaustive-ui.com/demo/avatar/' + user.image" shape="circle" size="normal" aria-hidden="true" />
                    <div class="flex flex-col">
                        <span class="font-medium">{{ user.name }}</span>
                        <span class="text-sm text-muted-color">&#64;{{ user.username }}</span>
                    </div>
                </ng-template>
                <ng-template #empty let-query="query">Nobody matches "{{ query }}"</ng-template>
            </p-mention>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, AvatarModule, MentionModule]
})
export class MentionTemplateDemo {
    text = '';

    users: User[] = [
        { name: 'Amy Elsner', username: 'amy', image: 'amyelsner.png' },
        { name: 'Anna Fali', username: 'anna', image: 'annafali.png' },
        { name: 'Asiya Javayant', username: 'asiya', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', username: 'bernardo', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', username: 'elwin', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', username: 'ioni', image: 'ionibowcher.png' },
        { name: 'Onyama Limba', username: 'onyama', image: 'onyamalimba.png' },
        { name: 'Xuxue Feng', username: 'xuxue', image: 'xuxuefeng.png' }
    ];

    suggestions: User[] = [];

    search(event: MentionSearchEvent) {
        const query = event.query.toLowerCase();
        this.suggestions = this.users.filter((user) => user.username.startsWith(query) || user.name.toLowerCase().includes(query));
    }
}
```

## Async Search

The search handler can answer later, after a request. delay waits for a pause in typing before onSearch and minQueryLength for a few characters, and loading shows a loader until the suggestions arrive. Here a fake server answers after 600 milliseconds; the handler keeps only the latest answer.

```typescript
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';

interface Repository {
    name: string;
    stars: number;
}

@Component({
    template: `
        <div class="card">
            <p-mention
                [(ngModel)]="text"
                [rows]="3"
                [triggers]="['/']"
                [suggestions]="suggestions()"
                [loading]="loading()"
                [delay]="250"
                [minQueryLength]="1"
                optionLabel="name"
                (onSearch)="search($event)"
                placeholder="Type / and the name of a repository"
                ariaLabel="Repository"
                fluid
            >
                <ng-template #item let-repository>
                    <i class="pi pi-book" aria-hidden="true"></i>
                    <span class="flex-1">{{ repository.name }}</span>
                    <span class="text-sm text-muted-color">{{ repository.stars }} stars</span>
                </ng-template>
            </p-mention>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, MentionModule]
})
export class MentionAsyncDemo {
    text = '';

    suggestions = signal<Repository[]>([]);

    loading = signal(false);

    private repositories: Repository[] = [
        { name: 'exhaustive-ui', stars: 1280 },
        { name: 'exhaustive-ui-docs', stars: 312 },
        { name: 'exhaustive-ui-themes', stars: 245 },
        { name: 'angular', stars: 96000 },
        { name: 'angular-cli', stars: 26800 },
        { name: 'components', stars: 24500 },
        { name: 'tailwindcss', stars: 84000 },
        { name: 'vitest', stars: 13200 }
    ];

    private request = 0;

    search(event: MentionSearchEvent) {
        const request = ++this.request;
        this.suggestions.set([]);
        this.loading.set(true);
        setTimeout(() => {
            // An older answer arriving after a newer request is ignored.
            if (request === this.request) {
                this.suggestions.set(this.repositories.filter((repository) => repository.name.includes(event.query.toLowerCase())));
                this.loading.set(false);
            }
        }, 600);
    }
}
```

## Single Line

With multiline set to false, Mention renders a single-line input instead of a textarea. The panel opens under the trigger by default; position="field" opens it under the whole field, like an AutoComplete.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';

@Component({
    template: `
        <div class="card flex flex-col gap-4">
            <p-mention [(ngModel)]="title" [multiline]="false" [suggestions]="suggestions" (onSearch)="search($event)" placeholder="Task title, @ to assign" ariaLabel="Task title" fluid />
            <p-mention [(ngModel)]="subtitle" [multiline]="false" position="field" [suggestions]="suggestions" (onSearch)="search($event)" placeholder="Panel under the field" ariaLabel="Task subtitle" fluid />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, MentionModule]
})
export class MentionSinglelineDemo {
    title = '';

    subtitle = '';

    users = ['amyelsner', 'annafali', 'asiyajavayant', 'bernardodominic', 'elwinsharvill', 'ionibowcher', 'onyamalimba', 'xuxuefeng'];

    suggestions: string[] = [];

    search(event: MentionSearchEvent) {
        this.suggestions = this.users.filter((user) => user.startsWith(event.query.toLowerCase()));
    }
}
```

## Filled

Specify the variant property as filled to display the component with a higher visual emphasis than the default outlined style.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-mention [(ngModel)]="text" variant="filled" [suggestions]="suggestions" (onSearch)="search($event)" [rows]="3" [cols]="40" placeholder="Type @ to mention someone" ariaLabel="Filled comment" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, MentionModule]
})
export class MentionFilledDemo {
    text = '';

    users = ['amyelsner', 'annafali', 'bernardodominic', 'ionibowcher'];

    suggestions: string[] = [];

    search(event: MentionSearchEvent) {
        this.suggestions = this.users.filter((user) => user.startsWith(event.query.toLowerCase()));
    }
}
```

## Sizes

Mention provides small and large sizes as alternatives to the default, like the other form fields.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-4">
            <p-mention [(ngModel)]="small" size="small" [multiline]="false" [suggestions]="suggestions" (onSearch)="search($event)" placeholder="Small" ariaLabel="Small" />
            <p-mention [(ngModel)]="normal" [multiline]="false" [suggestions]="suggestions" (onSearch)="search($event)" placeholder="Normal" ariaLabel="Normal" />
            <p-mention [(ngModel)]="large" size="large" [multiline]="false" [suggestions]="suggestions" (onSearch)="search($event)" placeholder="Large" ariaLabel="Large" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, MentionModule]
})
export class MentionSizesDemo {
    small = '';

    normal = '';

    large = '';

    users = ['amyelsner', 'annafali', 'bernardodominic', 'ionibowcher'];

    suggestions: string[] = [];

    search(event: MentionSearchEvent) {
        this.suggestions = this.users.filter((user) => user.startsWith(event.query.toLowerCase()));
    }
}
```

## Disabled

When disabled is present, the field cannot be edited or focused. With readonly , the text can be selected but not changed, and no panel opens.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule } from '@exhaustive-ui/core/mention';

@Component({
    template: `
        <div class="card flex flex-col items-center gap-4">
            <p-mention [(ngModel)]="text" disabled [rows]="2" [cols]="40" ariaLabel="Disabled comment" />
            <p-mention [(ngModel)]="text" readonly [rows]="2" [cols]="40" ariaLabel="Read-only comment" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, MentionModule]
})
export class MentionDisabledDemo {
    text = 'Thanks @amyelsner, merged in #release';
}
```

## Invalid

The invalid state is applied using the invalid property to indicate failed validation, here until someone is mentioned.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';

@Component({
    template: `
        <div class="card flex justify-center">
            <p-mention [(ngModel)]="text" [invalid]="!text.includes('@')" [suggestions]="suggestions" (onSearch)="search($event)" [rows]="3" [cols]="40" placeholder="Mention a reviewer" ariaLabel="Review request" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, MentionModule]
})
export class MentionInvalidDemo {
    text = '';

    users = ['amyelsner', 'annafali', 'bernardodominic', 'ionibowcher'];

    suggestions: string[] = [];

    search(event: MentionSearchEvent) {
        this.suggestions = this.users.filter((user) => user.startsWith(event.query.toLowerCase()));
    }
}
```

## Forms: Template Driven

The value is the plain text, so the usual validators such as required and maxlength work as on a textarea.

```typescript
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ToastModule } from '@exhaustive-ui/core/toast';

@Component({
    template: `
        <p-toast />
        <div class="card">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="td-comment" class="font-medium">Comment</label>
                    <p-mention #model="ngModel" [(ngModel)]="comment" name="comment" inputId="td-comment" [suggestions]="suggestions" (onSearch)="search($event)" [rows]="3" [invalid]="model.invalid && exampleForm.submitted" required fluid />
                    @if (model.invalid && exampleForm.submitted) {
                        <p-message severity="error" size="small" variant="simple">A comment is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit" class="self-start"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, MentionModule, ButtonModule, MessageModule, ToastModule],
    providers: [MessageService]
})
export class MentionTemplatedrivenformsDemo {
    messageService = inject(MessageService);

    comment = '';

    users = ['amyelsner', 'annafali', 'bernardodominic', 'ionibowcher', 'xuxuefeng'];

    suggestions: string[] = [];

    search(event: MentionSearchEvent) {
        this.suggestions = this.users.filter((user) => user.startsWith(event.query.toLowerCase()));
    }

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
```

## Reactive Forms

Mention can also be used with reactive forms. In this case, the formControlName property is used to bind the component to a form control.

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ToastModule } from '@exhaustive-ui/core/toast';

@Component({
    template: `
        <p-toast />
        <div class="card">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="rf-message" class="font-medium">Message</label>
                    <p-mention formControlName="message" inputId="rf-message" [suggestions]="suggestions" (onSearch)="search($event)" [rows]="3" [invalid]="isInvalid('message')" fluid />
                    @if (isInvalid('message')) {
                        <p-message severity="error" size="small" variant="simple">Mention at least one person.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit" class="self-start"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [ReactiveFormsModule, MentionModule, ButtonModule, MessageModule, ToastModule],
    providers: [MessageService]
})
export class MentionReactiveformsDemo {
    private fb = inject(FormBuilder);

    messageService = inject(MessageService);

    users = ['amyelsner', 'annafali', 'bernardodominic', 'ionibowcher', 'xuxuefeng'];

    suggestions: string[] = [];

    exampleForm: FormGroup;

    formSubmitted = false;

    constructor() {
        this.exampleForm = this.fb.group({
            message: ['', [Validators.required, Validators.pattern(/(^|\s)@\S+/)]]
        });
    }

    search(event: MentionSearchEvent) {
        this.suggestions = this.users.filter((user) => user.startsWith(event.query.toLowerCase()));
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm.reset({ message: '' });
            this.formSubmitted = false;
        }
    }

    isInvalid(controlName: string) {
        const control = this.exampleForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
    }
}
```

## Signal Forms

Mention can also be used with Angular Signal Forms . The [formField] directive binds the component to a field holding the text. The field also sets the invalid and touched states of the component, so it is styled as invalid once the field is touched or the form is submitted, like the message below.

```typescript
import { Component, inject, signal } from '@angular/core';
import { form, FormField, maxLength, required, submit } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ToastModule } from '@exhaustive-ui/core/toast';

@Component({
    template: `
        <p-toast />
        <div class="card">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="sf-note" class="font-medium">Note</label>
                    @let note = noteForm.note();
                    <p-mention [formField]="noteForm.note" inputId="sf-note" [suggestions]="suggestions()" (onSearch)="search($event)" [rows]="3" fluid />
                    @if (note.invalid() && note.touched()) {
                        <p-message severity="error" size="small" variant="simple">A note of at most 140 characters is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit" class="self-start"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormField, MentionModule, ButtonModule, MessageModule, ToastModule],
    providers: [MessageService]
})
export class MentionSignalformsDemo {
    messageService = inject(MessageService);

    users = ['amyelsner', 'annafali', 'bernardodominic', 'ionibowcher', 'xuxuefeng'];

    suggestions = signal<string[]>([]);

    model = signal<{ note: string }>({ note: '' });

    noteForm = form(this.model, (f) => {
        required(f.note);
        maxLength(f.note, 140);
    });

    search(event: MentionSearchEvent) {
        this.suggestions.set(this.users.filter((user) => user.startsWith(event.query.toLowerCase())));
    }

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.noteForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.noteForm().reset({ note: '' });
        });
    }
}
```

## Accessibility

Screen Reader The single-line input follows the combobox pattern with a listbox popup, while the focus stays in the field: it has the combobox role, aria-autocomplete="list" and aria-expanded , and while suggestions are shown aria-controls points to the listbox and aria-activedescendant to the highlighted option, which has aria-selected along with its position in the list ( aria-posinset , aria-setsize ). A textarea cannot take the combobox role in HTML, and aria-expanded is not allowed on a textbox, so the multiline field keeps its native textbox role. It has aria-autocomplete="list" and aria-haspopup="listbox" , and the same aria-controls and aria-activedescendant while suggestions are shown. Screen readers that follow aria-activedescendant on a textbox, such as NVDA and JAWS with Chrome, Edge or Firefox, read the highlighted option as the arrow keys move it. The field is never announced as expanded or collapsed: the live region below is what tells that suggestions appeared. Support for aria-activedescendant on a textbox is weaker in VoiceOver, which may not read the highlighted option; the live region and the inserted text are still announced. Set multiline to false when a single line is enough. A polite live region announces the number of suggestions, the empty message and the loading state. Its texts come from searchMessage , emptyMessage and loadingMessage , or from the searchMessage and emptySearchMessage keys of the translation configuration, and the listbox is labelled with the aria.listLabel key. Give the field a name with a label and inputId , ariaLabelledBy or ariaLabel , and describe it with ariaDescribedBy .

## Mention

Mention suggests users, tags or commands while a trigger such as @ or # is typed in a textarea or an input, and inserts the chosen suggestion in the text. Its value is the plain text, and it works with template-driven forms, reactive forms and Signal Forms.

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| dt | Object | undefined | Defines scoped design tokens of the component. |
| unstyled | boolean | undefined | Indicates whether the component should be rendered without styles. |
| pt | MentionPassThrough | undefined | Used to pass attributes to DOM elements inside the component. |
| ptOptions | PassThroughOptions | undefined | Used to configure passthrough(pt) options of the component. |
| required | boolean | false | There must be a value (if set). |
| invalid | boolean | false | When present, it specifies that the component should have invalid state style. |
| touched | boolean | undefined | Whether the field has been touched. Signal Forms sets it through  `[formField]` : the invalid style and  `aria-invalid`  then wait until the field is touched, or the form is submitted, like the error messages. Left unset,  `invalid`  applies at once. |
| $invalid | Signal<boolean> | - | The invalid state shown by the component:  `invalid` , once the field is touched when  `touched`  is set; undefined when  `invalid`  is unset. |
| disabled | boolean | false | When present, it specifies that the component should have disabled state style. |
| name | string | undefined | When present, it specifies that the name of the input. |
| fluid | boolean | false | Spans 100% width of the container when enabled. |
| variant | "outlined" \| "filled" | 'outlined' | Specifies the input variant of the component. |
| size | "small" \| "large" | undefined | Specifies the size of the component. |
| inputSize | number | undefined | Specifies the visible width of the input element in characters. |
| pattern | string | undefined | Specifies the value must match the pattern. |
| min | number | undefined | The value must be greater than or equal to the value. |
| max | number | undefined | The value must be less than or equal to the value. |
| step | number | undefined | Unless the step is set to the any literal, the value must be min + an integral multiple of the step. |
| minlength | number | undefined | The number of characters (code points) must not be less than the value of the attribute, if non-empty. |
| maxlength | number | undefined | The number of characters (code points) must not exceed the value of the attribute. |
| suggestions | T[] | - | The suggestions to show for the current trigger and query, usually set in the onSearch handler. An array of strings, or of objects with optionLabel. |
| triggers | string[] | ['@'] | The characters that start a mention when typed at the start of a word, such as  `@`  for users and  `#`  for tags. A trigger can have several characters,  `/`  for commands for instance. |
| optionLabel | string \| ((item: T) => string) | - | Property name or getter function of the text inserted for an object suggestion. It also labels the default option. |
| minQueryLength | number | 0 | Minimum number of characters typed after the trigger before a search. |
| delay | number | 0 | Delay in milliseconds between the last keystroke and the onSearch event. |
| loading | boolean | false | Whether the suggestions are being loaded. While there are no suggestions yet, the panel shows a loader instead of the empty message. |
| multiline | boolean | true | Whether the field is a textarea. When false, a single-line input is rendered. |
| autoResize | boolean | false | Whether the textarea grows with its content. |
| rows | number | - | Number of visible lines of the textarea. |
| cols | number | - | Visible width of the textarea in characters. |
| placeholder | string | - | Placeholder of the field. |
| readonly | boolean | false | Whether the text can be selected but not changed. No suggestion opens. |
| inputId | string | - | Identifier of the textarea or input, to link a label to it. |
| inputStyle | { [klass: string]: any } | - | Inline style of the textarea or input. |
| inputStyleClass | string | - | Style class of the textarea or input. |
| tabindex | number | - | Index of the field in the tab order. |
| ariaLabel | string | - | Accessible name of the field, when there is no visible label. |
| ariaLabelledBy | string | - | Identifier of the element that labels the field. |
| ariaDescribedBy | string | - | Identifier of the element that describes the field, a hint for instance. |
| position | MentionPosition | 'caret' | Where the suggestion panel opens: under the line of the trigger, or under the whole field. |
| appendSpace | boolean | true | Whether a space is added after the inserted suggestion, unless the text after it already starts with a space. |
| autoHighlight | boolean | true | Whether the first suggestion is highlighted, so that Enter or Tab inserts it right away. |
| showEmptyMessage | boolean | true | Whether the panel opens with the empty message when there is no suggestion. When false, it only opens with suggestions. |
| emptyMessage | string | - | Text shown when there is no suggestion. Defaults to the emptySearchMessage of the translation. |
| searchMessage | string | - | Text announced to screen readers when suggestions are shown,  `{0}`  being their number. Defaults to the searchMessage of the translation. |
| loadingMessage | string | 'Loading...' | Text shown and announced while loading. |
| scrollHeight | string | '200px' | Maximum height of the suggestion list. |
| virtualScroll | boolean | false | Whether the suggestion list is rendered with a virtual scroll, for long lists. Requires virtualScrollItemSize. |
| virtualScrollItemSize | number | - | Height of a suggestion in pixels, for the virtual scroll. |
| virtualScrollOptions | ScrollerOptions | - | Options of the virtual scroller. |
| panelStyle | { [klass: string]: any } | - | Inline style of the panel. |
| panelStyleClass | string | - | Style class of the panel. |
| appendTo | any | - | Target element to attach the panel to, "body" or a template variable of another element. Defaults to the overlayAppendTo of the global configuration, 'self'. |
| overlayOptions | OverlayOptions | - | Options of the overlay. |
| motionOptions | MotionOptions | - | The motion options of the panel. |

### Emits

| Name | Parameters | Description |
|------|------------|-------------|
| onSearch | event: MentionSearchEvent | Emitted when a trigger and a query are typed. Answer it by setting suggestions, at once or after a request. |
| onSelect | event: MentionSelectEvent<T | Emitted when a suggestion is inserted in the text. |
| onShow | value: void | Emitted when the suggestion panel opens. |
| onHide | value: void | Emitted when the suggestion panel closes. |
| onFocus | event: FocusEvent | Emitted when the field receives the focus. |
| onBlur | event: FocusEvent | Emitted when the field loses the focus. |

### Templates

| Name | Type | Description |
|------|------|-------------|
| item | TemplateRef<MentionItemTemplateContext<T>> | Custom suggestion, with the trigger in its context to render users and tags differently. |
| empty | TemplateRef<MentionPanelTemplateContext> | Custom content shown when there is no suggestion. |
| header | TemplateRef<MentionPanelTemplateContext> | Custom content above the suggestions. |
| footer | TemplateRef<MentionPanelTemplateContext> | Custom content below the suggestions. |

### Methods

| Name | Parameters | Return Type | Description |
|------|------------|-------------|-------------|
| hide |  | void | Closes the suggestion panel. |
| select | option: unknown, event: Event | void | Inserts a suggestion in place of the mention being typed, as if it had been chosen in the panel. |
| focus |  | void | Gives the focus to the field. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| host | PassThroughOption<HTMLElement, I> | Used to pass attributes to the host's DOM element. |
| root | PassThroughOption<HTMLElement, I> | Used to pass attributes to the root's DOM element. |
| pcTextarea | TextareaPassThrough | Used to pass attributes to the Textarea of the multiline mode. |
| pcInputText | InputTextPassThrough | Used to pass attributes to the InputText of the single-line mode. |
| anchor | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the invisible element the panel is aligned with, moved under the line of the trigger. |
| pcOverlay | OverlayPassThrough | Used to pass attributes to the Overlay component. |
| overlay | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the overlay's DOM element. |
| listContainer | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the list container's DOM element. |
| pcScroller | VirtualScrollerPassThrough | Used to pass attributes to the Scroller component of the virtual scroll. |
| list | PassThroughOption<HTMLUListElement, I> | Used to pass attributes to the list's DOM element. |
| option | PassThroughOption<HTMLLIElement, I> | Used to pass attributes to the option's DOM element. |
| emptyMessage | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the empty message's DOM element. |
| loader | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the loader's DOM element, shown while loading. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-mention | Class name of the root element |
| p-mention-input | Class name of the textarea or input element |
| p-mention-anchor | Class name of the invisible element the overlay is aligned with |
| p-mention-overlay | Class name of the overlay element |
| p-mention-list-container | Class name of the list container element |
| p-mention-list | Class name of the list element |
| p-mention-option | Class name of the option element |
| p-mention-option-label | Class name of the default option label |
| p-mention-empty-message | Class name of the empty message element |
| p-mention-loader | Class name of the loader element |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| mention.transition.duration | --p-mention-transition-duration | Transition duration of the options |
| mention.overlay.background | --p-mention-overlay-background | Background of overlay |
| mention.overlay.border.color | --p-mention-overlay-border-color | Border color of overlay |
| mention.overlay.border.radius | --p-mention-overlay-border-radius | Border radius of overlay |
| mention.overlay.color | --p-mention-overlay-color | Color of overlay |
| mention.overlay.shadow | --p-mention-overlay-shadow | Shadow of overlay |
| mention.overlay.width | --p-mention-overlay-width | Width of the overlay when it opens at the caret |
| mention.list.padding | --p-mention-list-padding | Padding of list |
| mention.list.gap | --p-mention-list-gap | Gap of list |
| mention.option.focus.background | --p-mention-option-focus-background | Focus background of option |
| mention.option.color | --p-mention-option-color | Color of option |
| mention.option.focus.color | --p-mention-option-focus-color | Focus color of option |
| mention.option.padding | --p-mention-option-padding | Padding of option |
| mention.option.border.radius | --p-mention-option-border-radius | Border radius of option |
| mention.option.gap | --p-mention-option-gap | Gap between the parts of an option, an avatar and a name for instance |
| mention.empty.message.padding | --p-mention-empty-message-padding | Padding of empty message and loader |
| mention.empty.message.color | --p-mention-empty-message-color | Color of empty message and loader |

