# Angular RichTextEditor Component

RichTextEditor is a rich text editor built on Tiptap and ProseMirror, with a themed toolbar that follows the WAI-ARIA toolbar pattern, inline link editing, HTML or JSON values and a character limit. It works with every kind of Angular form.

## Accessibility

Screen Reader The editable area has the textbox role with aria-multiline , and is named with ariaLabelledBy or ariaLabel ; ariaDescribedBy links a hint or an error message. It also reports aria-invalid , aria-required , aria-readonly , aria-disabled and the placeholder with aria-placeholder . The toolbar follows the WAI-ARIA toolbar pattern : it has the toolbar role, a label and aria-controls , and only one button is in the tab order. Every button has a label, its shortcut in aria-keyshortcuts , and the formatting buttons tell whether they apply to the selection with aria-pressed . A button that cannot apply, such as undo with nothing to undo, has aria-disabled . The link panel is a labelled dialog whose field has a visible label and an error message linked with aria-describedby . When showCount is set, the count describes the editable area and reaching maxLength is announced. Every text can be replaced through labels .

## Basic

RichTextEditor is bound with ngModel and its value is an HTML string, or null when the editor is empty. The usual shortcuts work: Ctrl+B for bold, Ctrl+I for italic, Ctrl+K for a link, and Markdown shortcuts such as # for a heading or - for a list. Label the editable area with ariaLabelledBy or ariaLabel .

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';

@Component({
    template: `
        <div class="card flex flex-col gap-2">
            <label id="basic-label" class="font-medium">Description</label>
            <p-rich-text-editor [(ngModel)]="html" ariaLabelledBy="basic-label" placeholder="Describe the product" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RichTextEditorModule]
})
export class RichtexteditorBasicDemo {
    html: string | null =
        '<h2>Release notes</h2><p>The editor supports <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strikethrough</s>, <code>inline code</code> and <a href="https://exhaustive-ui.com">links</a>.</p><ul><li><p>Bullet lists</p></li><li><p>and numbered lists</p></li></ul><blockquote><p>Quotes stand out from the text.</p></blockquote>';
}
```

## Disabled

When disabled is present, the editor and its toolbar cannot be focused or changed.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';

@Component({
    template: `
        <div class="card">
            <p-rich-text-editor [(ngModel)]="html" [disabled]="true" ariaLabel="Disabled editor" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RichTextEditorModule]
})
export class RichtexteditorDisabledDemo {
    html: string | null = '<p>This content is disabled.</p>';
}
```

## Editor vs RichTextEditor

ExhaustiveUI has two rich text editors. Editor wraps Quill and stays available unchanged for the applications that use it. RichTextEditor is built on Tiptap and ProseMirror and adds what Editor does not have: a toolbar that follows the WAI-ARIA toolbar pattern, with a single tab stop and the arrow keys, links edited in an inline panel that checks the URL, a value in HTML or in Tiptap JSON, a character limit with a count, and Tiptap extensions for your own content. Prefer RichTextEditor for new forms. Both values are HTML, but Quill and Tiptap do not write the same markup, lists for example, so check the stored content before moving an existing field from one to the other.

## Extensions

extensions adds Tiptap extensions to the StarterKit, the text alignment and the link support that the component already includes: your own nodes, marks and shortcuts, or any of the open source Tiptap extensions. The onInit event gives the Tiptap editor once it is created, to run commands from your own buttons. This example adds a highlight mark, toggled with Ctrl+Shift+H or the button.

```typescript
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorInitEvent, RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { Editor, Mark, mergeAttributes } from '@tiptap/core';

/**
 * A mark that renders <mark>, toggled with Ctrl+Shift+H.
 */
const Highlight = Mark.create({
    name: 'highlight',
    parseHTML: () => [{ tag: 'mark' }],
    renderHTML: ({ HTMLAttributes }) => ['mark', mergeAttributes(HTMLAttributes), 0],
    addKeyboardShortcuts() {
        return { 'Mod-Shift-h': () => this.editor.commands.toggleMark(this.name) };
    }
});

@Component({
    template: `
        <div class="card flex flex-col gap-4">
            <p-rich-text-editor [(ngModel)]="html" [extensions]="extensions" (onInit)="onInit($event)" ariaLabel="Notes" />
            <p-button label="Highlight the selection" severity="secondary" size="small" class="self-start" [disabled]="!editor()" (onClick)="toggleHighlight()" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RichTextEditorModule, ButtonModule]
})
export class RichtexteditorExtensionsDemo {
    extensions = [Highlight];

    editor = signal<Editor | undefined>(undefined);

    html: string | null = '<p>Select some words, then press <mark>Ctrl+Shift+H</mark> to highlight them.</p>';

    onInit(event: RichTextEditorInitEvent<Editor>) {
        this.editor.set(event.editor);
    }

    toggleHighlight() {
        this.editor()?.chain().focus().toggleMark('highlight').run();
    }
}
```

## Invalid

The invalid state is applied with the invalid property, which also sets aria-invalid on the editable area.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';

@Component({
    template: `
        <div class="card">
            <p-rich-text-editor [(ngModel)]="html" [invalid]="!html" ariaLabel="Comment" placeholder="A comment is required" minHeight="5rem" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RichTextEditorModule]
})
export class RichtexteditorInvalidDemo {
    html: string | null = null;
}
```

## JSON Output

With format="json" the value is the JSON document of Tiptap instead of HTML. It is easier to store, to validate and to render on another platform, and it keeps every attribute of the content. The onTextChange event gives the HTML, the plain text and the JSON whatever the format.

```typescript
import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';

@Component({
    template: `
        <div class="card flex flex-col gap-4">
            <p-rich-text-editor [(ngModel)]="doc" format="json" [toolbar]="['bold', 'italic', '|', 'bulletList', 'orderedList']" ariaLabel="Checklist" />
            <pre class="m-0 p-4 rounded-border bg-surface-100 dark:bg-surface-800 text-sm overflow-auto max-h-64" tabindex="0" aria-label="JSON value">{{ doc | json }}</pre>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, JsonPipe, RichTextEditorModule]
})
export class RichtexteditorJsonDemo {
    doc: Record<string, any> | null = {
        type: 'doc',
        content: [
            { type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Before the release' }] },
            {
                type: 'orderedList',
                attrs: { start: 1 },
                content: [
                    { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Run the tests' }] }] },
                    { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Update the changelog' }] }] }
                ]
            }
        ]
    };
}
```

## Character Limit

maxLength limits the number of characters of the text, the formatting is not counted. Typing stops at the limit and a longer paste is cut, while a longer value written by the form is kept. showCount displays the count under the editor, linked to the editable area with aria-describedby , and the limit is announced to screen readers once reached. minHeight and maxHeight size the editable area.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';

@Component({
    template: `
        <div class="card flex flex-col gap-2">
            <label id="bio-label" class="font-medium">Short bio</label>
            <p-rich-text-editor [(ngModel)]="html" [maxLength]="160" [showCount]="true" [toolbar]="['bold', 'italic', 'link']" ariaLabelledBy="bio-label" minHeight="5rem" maxHeight="12rem" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RichTextEditorModule]
})
export class RichtexteditorMaxlengthDemo {
    html: string | null = '<p>Front-end developer who writes <strong>accessible</strong> Angular components.</p>';
}
```

## reactiveforms-doc

RichTextEditor can also be used with reactive forms. In this case, the formControlName property is used to bind the component to a form control.

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <p-toast />
        <div class="card">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label id="rf-label" class="font-medium">Answer</label>
                    <p-rich-text-editor formControlName="answer" ariaLabelledBy="rf-label" [toolbar]="['bold', 'italic', 'bulletList', 'link']" minHeight="5rem" [invalid]="isInvalid('answer')" />
                    @if (isInvalid('answer')) {
                        <p-message severity="error" size="small" variant="simple">An answer is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit" class="self-start"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [ReactiveFormsModule, RichTextEditorModule, ToastModule, MessageModule, ButtonModule],
    providers: [MessageService]
})
export class RichtexteditorReactiveformsDemo {
    private fb = inject(FormBuilder);

    messageService = inject(MessageService);

    exampleForm: FormGroup;

    formSubmitted: boolean = false;

    constructor() {
        this.exampleForm = this.fb.group({
            answer: [null, Validators.required]
        });
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm.reset();
            this.formSubmitted = false;
        }
    }

    isInvalid(controlName: string) {
        const control = this.exampleForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
    }
}
```

## ReadOnly

When readonly is present, the content can be read, selected and copied but not changed. The toolbar is hidden and the editable area stays focusable for screen readers.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';

@Component({
    template: `
        <div class="card">
            <p-rich-text-editor [(ngModel)]="html" [readonly]="true" ariaLabel="Terms of service" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RichTextEditorModule]
})
export class RichtexteditorReadonlyDemo {
    html: string | null = '<h3>Terms of service</h3><p>By using the service you agree to these terms. They can be <strong>read and copied</strong> but not edited.</p>';
}
```

## Signal Forms

RichTextEditor can also be used with Angular Signal Forms . The [formField] directive binds the component to a field holding the HTML, null when empty, so required works. To limit the length, use the maxLength input of the component, which counts the characters of the text, rather than the maxLength validator, which would count the HTML tags.

```typescript
import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label id="sf-label" class="font-medium">Review</label>
                    @let review = reviewForm.review();
                    <p-rich-text-editor [formField]="reviewForm.review" ariaLabelledBy="sf-label" [toolbar]="['bold', 'italic', 'blockquote']" [maxLength]="280" [showCount]="true" minHeight="5rem" />
                    @if (review.invalid() && review.touched()) {
                        <p-message severity="error" size="small" variant="simple">A review is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit" class="self-start"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormField, RichTextEditorModule, ButtonModule, ToastModule, MessageModule],
    providers: [MessageService]
})
export class RichtexteditorSignalformsDemo {
    messageService = inject(MessageService);

    model = signal<{ review: string | null }>({ review: null });

    reviewForm = form(this.model, (f) => {
        required(f.review);
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.reviewForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.reviewForm().reset({ review: null });
        });
    }
}
```

## Template

The toolbar template replaces the whole toolbar. It receives the Tiptap editor , undefined while Tiptap loads, an isActive function, the disabled state and openLink to open the link panel. Use the Tiptap commands, such as editor.chain().focus().toggleBold().run() . A custom toolbar takes care of its own keyboard support.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <div class="card">
            <p-rich-text-editor [(ngModel)]="html" ariaLabel="Message">
                <ng-template #toolbar let-editor let-isActive="isActive" let-disabled="disabled" let-openLink="openLink">
                    <div class="flex gap-2 flex-wrap">
                        <button pButton type="button" size="small" [outlined]="!isActive('bold')" [attr.aria-pressed]="isActive('bold')" [disabled]="disabled" (click)="editor?.chain().focus().toggleBold().run()">
                            <span pButtonLabel>Bold</span>
                        </button>
                        <button pButton type="button" size="small" [outlined]="!isActive('blockquote')" [attr.aria-pressed]="isActive('blockquote')" [disabled]="disabled" (click)="editor?.chain().focus().toggleBlockquote().run()">
                            <span pButtonLabel>Quote</span>
                        </button>
                        <button pButton type="button" size="small" [outlined]="true" [disabled]="disabled" (click)="openLink()"><span pButtonLabel>Link</span></button>
                    </div>
                </ng-template>
            </p-rich-text-editor>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RichTextEditorModule, ButtonModule]
})
export class RichtexteditorTemplateDemo {
    html: string | null = '<p>A toolbar made of ExhaustiveUI buttons.</p>';
}
```

## templatedrivenforms-doc

The value is null while the editor is empty, so required works as on the other fields. The control is marked as touched when the editable area loses the focus.

```typescript
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { RichTextEditorModule } from '@exhaustive-ui/core/richtexteditor';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <p-toast />
        <div class="card">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label id="td-label" class="font-medium">Message</label>
                    <p-rich-text-editor
                        #model="ngModel"
                        [(ngModel)]="message"
                        name="message"
                        ariaLabelledBy="td-label"
                        [toolbar]="['bold', 'italic', 'link']"
                        minHeight="5rem"
                        [invalid]="model.invalid && (model.touched || exampleForm.submitted)"
                        required
                    />
                    @if (model.invalid && (model.touched || exampleForm.submitted)) {
                        <p-message severity="error" size="small" variant="simple">A message is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit" class="self-start"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RichTextEditorModule, ToastModule, MessageModule, ButtonModule],
    providers: [MessageService]
})
export class RichtexteditorTemplatedrivenformsDemo {
    messageService = inject(MessageService);

    message: string | null = null;

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
```

## Tiptap

RichTextEditor is built on Tiptap and ProseMirror. Install the four open source Tiptap packages it uses, all MIT licensed; no Tiptap account, key or paid extension is needed. They are optional peer dependencies of ExhaustiveUI, so only the applications that use RichTextEditor install them. Tiptap is loaded in the browser only, on first use: during server-side rendering the component renders an empty placeholder.

## Toolbar

The toolbar input lists the buttons in order, and '|' separates two groups. The buttons are bold , italic , underline , strike , code , heading1 , heading2 , heading3 , bulletList , orderedList , blockquote , codeBlock , link , alignLeft , alignCenter , alignRight , alignJustify , undo , redo and clear ; textAlign adds the four alignments. An empty array hides the toolbar, the shortcuts keep working.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule, RichTextEditorToolbar } from '@exhaustive-ui/core/richtexteditor';

@Component({
    template: `
        <div class="card flex flex-col gap-2">
            <label id="toolbar-label" class="font-medium">Announcement</label>
            <p-rich-text-editor [(ngModel)]="html" [toolbar]="toolbar" ariaLabelledBy="toolbar-label" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, RichTextEditorModule]
})
export class RichtexteditorToolbarDemo {
    toolbar: RichTextEditorToolbar = ['heading2', 'heading3', '|', 'bold', 'italic', 'code', '|', 'textAlign', '|', 'bulletList', 'codeBlock', '|', 'clear'];

    html: string | null = '<h2 style="text-align: center">A centered title</h2><p>Select text and use the toolbar: the alignment buttons apply to headings and paragraphs.</p>';
}
```

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| root | PassThroughOption<HTMLElement, I> | Used to pass attributes to the root's DOM element. |
| toolbar | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the toolbar's DOM element. |
| button | PassThroughOption<HTMLButtonElement, I> | Used to pass attributes to a toolbar button's DOM element. |
| buttonIcon | PassThroughOption<SVGElement \| HTMLSpanElement, I> | Used to pass attributes to a toolbar button icon's DOM element. |
| separator | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to a toolbar separator's DOM element. |
| content | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the content's DOM element, the container of the editable area. |
| linkPanel | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the link panel's DOM element. |
| linkInput | PassThroughOption<HTMLInputElement, I> | Used to pass attributes to the link input's DOM element. |
| linkButton | PassThroughOption<HTMLButtonElement, I> | Used to pass attributes to the buttons of the link panel. |
| footer | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the footer's DOM element. |
| count | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the character count's DOM element. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-richtexteditor | Class name of the root element |
| p-richtexteditor-toolbar | Class name of the toolbar element |
| p-richtexteditor-button | Class name of a toolbar button |
| p-richtexteditor-button-icon | Class name of a toolbar button icon |
| p-richtexteditor-separator | Class name of a toolbar separator |
| p-richtexteditor-content | Class name of the content element |
| p-richtexteditor-editor | Class name of the editable element |
| p-richtexteditor-link-panel | Class name of the link panel |
| p-richtexteditor-link-input | Class name of the link input |
| p-richtexteditor-link-button | Class name of a link panel button |
| p-richtexteditor-footer | Class name of the footer |
| p-richtexteditor-count | Class name of the character count |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| richtexteditor.background | --p-richtexteditor-background | Background |
| richtexteditor.disabled.background | --p-richtexteditor-disabled-background | Background in disabled state |
| richtexteditor.filled.background | --p-richtexteditor-filled-background | Background of the filled variant |
| richtexteditor.filled.focus.background | --p-richtexteditor-filled-focus-background | Background of the filled variant while focused |
| richtexteditor.border.color | --p-richtexteditor-border-color | Border color |
| richtexteditor.hover.border.color | --p-richtexteditor-hover-border-color | Border color while hovered |
| richtexteditor.focus.border.color | --p-richtexteditor-focus-border-color | Border color while the editable area is focused |
| richtexteditor.invalid.border.color | --p-richtexteditor-invalid-border-color | Border color in invalid state |
| richtexteditor.color | --p-richtexteditor-color | Text color |
| richtexteditor.disabled.color | --p-richtexteditor-disabled-color | Text color in disabled state |
| richtexteditor.shadow | --p-richtexteditor-shadow | Shadow |
| richtexteditor.border.radius | --p-richtexteditor-border-radius | Border radius |
| richtexteditor.transition.duration | --p-richtexteditor-transition-duration | Transition duration |
| richtexteditor.focus.ring.width | --p-richtexteditor-focus-ring-width | Focus ring width of the root while the editable area is focused |
| richtexteditor.focus.ring.style | --p-richtexteditor-focus-ring-style | Focus ring style of the root while the editable area is focused |
| richtexteditor.focus.ring.color | --p-richtexteditor-focus-ring-color | Focus ring color of the root while the editable area is focused |
| richtexteditor.focus.ring.offset | --p-richtexteditor-focus-ring-offset | Focus ring offset of the root while the editable area is focused |
| richtexteditor.focus.ring.shadow | --p-richtexteditor-focus-ring-shadow | Focus ring shadow of the root while the editable area is focused |
| richtexteditor.toolbar.background | --p-richtexteditor-toolbar-background | Background of the toolbar |
| richtexteditor.toolbar.border.color | --p-richtexteditor-toolbar-border-color | Border color between the toolbar and the content |
| richtexteditor.toolbar.padding | --p-richtexteditor-toolbar-padding | Padding of the toolbar |
| richtexteditor.toolbar.gap | --p-richtexteditor-toolbar-gap | Gap between the buttons of the toolbar |
| richtexteditor.separator.background | --p-richtexteditor-separator-background | Color of a separator |
| richtexteditor.separator.height | --p-richtexteditor-separator-height | Height of a separator |
| richtexteditor.separator.margin | --p-richtexteditor-separator-margin | Margin of a separator |
| richtexteditor.button.size | --p-richtexteditor-button-size | Size of a toolbar button |
| richtexteditor.button.border.radius | --p-richtexteditor-button-border-radius | Border radius of a toolbar button |
| richtexteditor.button.color | --p-richtexteditor-button-color | Color of a toolbar button |
| richtexteditor.button.hover.background | --p-richtexteditor-button-hover-background | Background of a hovered toolbar button |
| richtexteditor.button.hover.color | --p-richtexteditor-button-hover-color | Color of a hovered toolbar button |
| richtexteditor.button.active.background | --p-richtexteditor-button-active-background | Background of a pressed toolbar button |
| richtexteditor.button.active.color | --p-richtexteditor-button-active-color | Color of a pressed toolbar button |
| richtexteditor.button.icon.size | --p-richtexteditor-button-icon-size | Size of a toolbar button icon |
| richtexteditor.button.font.size | --p-richtexteditor-button-font-size | Font size of the letters of a toolbar button |
| richtexteditor.button.focus.ring.width | --p-richtexteditor-button-focus-ring-width | Focus ring width of a toolbar button |
| richtexteditor.button.focus.ring.style | --p-richtexteditor-button-focus-ring-style | Focus ring style of a toolbar button |
| richtexteditor.button.focus.ring.color | --p-richtexteditor-button-focus-ring-color | Focus ring color of a toolbar button |
| richtexteditor.button.focus.ring.offset | --p-richtexteditor-button-focus-ring-offset | Focus ring offset of a toolbar button |
| richtexteditor.button.focus.ring.shadow | --p-richtexteditor-button-focus-ring-shadow | Focus ring shadow of a toolbar button |
| richtexteditor.button.sm.size | --p-richtexteditor-button-sm-size | Size of a toolbar button in the small size |
| richtexteditor.button.lg.size | --p-richtexteditor-button-lg-size | Size of a toolbar button in the large size |
| richtexteditor.content.padding | --p-richtexteditor-content-padding | Padding of the editable area |
| richtexteditor.content.min.height | --p-richtexteditor-content-min-height | Minimum height of the editable area |
| richtexteditor.content.font.size | --p-richtexteditor-content-font-size | Font size of the editable area |
| richtexteditor.content.line.height | --p-richtexteditor-content-line-height | Line height of the editable area |
| richtexteditor.content.gap | --p-richtexteditor-content-gap | Space between two blocks of the content |
| richtexteditor.content.placeholder.color | --p-richtexteditor-content-placeholder-color | Color of the placeholder |
| richtexteditor.content.sm.font.size | --p-richtexteditor-content-sm-font-size | Font size of the small size |
| richtexteditor.content.sm.padding | --p-richtexteditor-content-sm-padding | Padding of the small size |
| richtexteditor.content.lg.font.size | --p-richtexteditor-content-lg-font-size | Font size of the large size |
| richtexteditor.content.lg.padding | --p-richtexteditor-content-lg-padding | Padding of the large size |
| richtexteditor.heading.color | --p-richtexteditor-heading-color | Color of the headings |
| richtexteditor.heading.font.weight | --p-richtexteditor-heading-font-weight | Font weight of the headings |
| richtexteditor.heading.line.height | --p-richtexteditor-heading-line-height | Line height of the headings |
| richtexteditor.heading.h1.font.size | --p-richtexteditor-heading-h1-font-size | Font size of a heading 1 |
| richtexteditor.heading.h2.font.size | --p-richtexteditor-heading-h2-font-size | Font size of a heading 2 |
| richtexteditor.heading.h3.font.size | --p-richtexteditor-heading-h3-font-size | Font size of a heading 3 |
| richtexteditor.link.color | --p-richtexteditor-link-color | Color of a link |
| richtexteditor.link.hover.color | --p-richtexteditor-link-hover-color | Color of a hovered link |
| richtexteditor.code.color | --p-richtexteditor-code-color | Color of inline code |
| richtexteditor.code.border.radius | --p-richtexteditor-code-border-radius | Border radius of inline code |
| richtexteditor.code.padding | --p-richtexteditor-code-padding | Padding of inline code |
| richtexteditor.code.font.size | --p-richtexteditor-code-font-size | Font size of inline code and code blocks |
| richtexteditor.code.background | --p-richtexteditor-code-background | Background of inline code |
| richtexteditor.code.block.border.radius | --p-richtexteditor-code-block-border-radius | Border radius of a code block |
| richtexteditor.code.block.padding | --p-richtexteditor-code-block-padding | Padding of a code block |
| richtexteditor.code.block.background | --p-richtexteditor-code-block-background | Background of a code block |
| richtexteditor.code.block.color | --p-richtexteditor-code-block-color | Text color of a code block |
| richtexteditor.blockquote.color | --p-richtexteditor-blockquote-color | Text color of a quote |
| richtexteditor.blockquote.border.width | --p-richtexteditor-blockquote-border-width | Width of the border of a quote |
| richtexteditor.blockquote.padding | --p-richtexteditor-blockquote-padding | Padding of a quote |
| richtexteditor.blockquote.border.color | --p-richtexteditor-blockquote-border-color | Border color of a quote |
| richtexteditor.link.panel.background | --p-richtexteditor-link-panel-background | Background of the link panel |
| richtexteditor.link.panel.border.color | --p-richtexteditor-link-panel-border-color | Border color of the link panel |
| richtexteditor.link.panel.color | --p-richtexteditor-link-panel-color | Text color of the link panel |
| richtexteditor.link.panel.border.radius | --p-richtexteditor-link-panel-border-radius | Border radius of the link panel |
| richtexteditor.link.panel.shadow | --p-richtexteditor-link-panel-shadow | Shadow of the link panel |
| richtexteditor.link.panel.padding | --p-richtexteditor-link-panel-padding | Padding of the link panel |
| richtexteditor.link.panel.gap | --p-richtexteditor-link-panel-gap | Gap between the elements of the link panel |
| richtexteditor.link.panel.width | --p-richtexteditor-link-panel-width | Width of the link panel |
| richtexteditor.link.panel.error.color | --p-richtexteditor-link-panel-error-color | Color of the error message of the link panel |
| richtexteditor.link.input.background | --p-richtexteditor-link-input-background | Background of the link input |
| richtexteditor.link.input.border.color | --p-richtexteditor-link-input-border-color | Border color of the link input |
| richtexteditor.link.input.focus.border.color | --p-richtexteditor-link-input-focus-border-color | Border color of the focused link input |
| richtexteditor.link.input.invalid.border.color | --p-richtexteditor-link-input-invalid-border-color | Border color of the link input in invalid state |
| richtexteditor.link.input.color | --p-richtexteditor-link-input-color | Text color of the link input |
| richtexteditor.link.input.placeholder.color | --p-richtexteditor-link-input-placeholder-color | Placeholder color of the link input |
| richtexteditor.link.input.border.radius | --p-richtexteditor-link-input-border-radius | Border radius of the link input |
| richtexteditor.link.input.padding | --p-richtexteditor-link-input-padding | Padding of the link input |
| richtexteditor.link.input.focus.ring.width | --p-richtexteditor-link-input-focus-ring-width | Focus ring width of the link input |
| richtexteditor.link.input.focus.ring.style | --p-richtexteditor-link-input-focus-ring-style | Focus ring style of the link input |
| richtexteditor.link.input.focus.ring.color | --p-richtexteditor-link-input-focus-ring-color | Focus ring color of the link input |
| richtexteditor.link.input.focus.ring.offset | --p-richtexteditor-link-input-focus-ring-offset | Focus ring offset of the link input |
| richtexteditor.link.input.focus.ring.shadow | --p-richtexteditor-link-input-focus-ring-shadow | Focus ring shadow of the link input |
| richtexteditor.link.button.padding | --p-richtexteditor-link-button-padding | Padding of a link panel button |
| richtexteditor.link.button.border.radius | --p-richtexteditor-link-button-border-radius | Border radius of a link panel button |
| richtexteditor.link.button.color | --p-richtexteditor-link-button-color | Color of a link panel button |
| richtexteditor.link.button.hover.background | --p-richtexteditor-link-button-hover-background | Background of a hovered link panel button |
| richtexteditor.link.button.apply.background | --p-richtexteditor-link-button-apply-background | Background of the apply button |
| richtexteditor.link.button.apply.hover.background | --p-richtexteditor-link-button-apply-hover-background | Background of the hovered apply button |
| richtexteditor.link.button.apply.color | --p-richtexteditor-link-button-apply-color | Color of the apply button |
| richtexteditor.link.button.font.weight | --p-richtexteditor-link-button-font-weight | Font weight of a link panel button |
| richtexteditor.link.button.focus.ring.width | --p-richtexteditor-link-button-focus-ring-width | Focus ring width of a link panel button |
| richtexteditor.link.button.focus.ring.style | --p-richtexteditor-link-button-focus-ring-style | Focus ring style of a link panel button |
| richtexteditor.link.button.focus.ring.color | --p-richtexteditor-link-button-focus-ring-color | Focus ring color of a link panel button |
| richtexteditor.link.button.focus.ring.offset | --p-richtexteditor-link-button-focus-ring-offset | Focus ring offset of a link panel button |
| richtexteditor.link.button.focus.ring.shadow | --p-richtexteditor-link-button-focus-ring-shadow | Focus ring shadow of a link panel button |
| richtexteditor.footer.padding | --p-richtexteditor-footer-padding | Padding of the footer |
| richtexteditor.footer.color | --p-richtexteditor-footer-color | Text color of the footer |
| richtexteditor.footer.font.size | --p-richtexteditor-footer-font-size | Font size of the footer |
| richtexteditor.footer.border.color | --p-richtexteditor-footer-border-color | Border color between the content and the footer |
| richtexteditor.footer.limit.color | --p-richtexteditor-footer-limit-color | Color of the count when the limit is reached |

