# Angular FileInput Component

FileInput selects files by drag and drop, paste or the file picker, validates each file and uploads it with its own progress. It has a list, an images and an avatar variant, and works with every kind of Angular form.

## Accessibility

Screen Reader The dropzone, the add tile and the avatar are buttons that open the native file picker, which stays hidden. Describe them with ariaLabelledBy or ariaLabel ; the hint is linked to the dropzone with aria-describedby . The file list is labelled, every action button names its file, for example "Remove report.pdf", and progress bars use the progressbar role. A polite live region announces the files added and rejected, finished and failed uploads, and removed files.

## Avatar

The avatar variant is a single clickable image to replace a profile picture or a logo, round by default or square with avatarShape . It holds one file, so its value is a file or null. The image shown comes from the chosen file, otherwise from the first existing file. On mobile devices, capture opens the camera directly.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';

@Component({
    template: `
        <div class="card flex flex-wrap justify-center gap-12">
            <p-file-input variant="avatar" accept="image/*" capture="user" ariaLabel="Profile picture" [(ngModel)]="photo" />
            <p-file-input variant="avatar" avatarShape="square" accept="image/*" ariaLabel="Company logo" [(ngModel)]="logo" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, FileInputModule]
})
export class FileinputAvatarDemo {
    photo: File | null = null;

    logo: File | null = null;
}
```

## Basic

FileInput is bound with ngModel , and its value is the array of selected files. Files are added by clicking the dropzone, with the keyboard, by drag and drop, or by pasting them, a screenshot for example, while the component has the focus. Dropping a folder adds the files it contains and keeps their relative path. Without an url or an uploadHandler , nothing is uploaded: the files stay in the value, ready to be sent with the form.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';

@Component({
    template: `
        <div class="card">
            <p-file-input [(ngModel)]="files" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, FileInputModule]
})
export class FileinputBasicDemo {
    files: File[] = [];
}
```

## Disabled

When disabled is present, files can no longer be added or removed.

```typescript
import { Component } from '@angular/core';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';

@Component({
    template: `
        <div class="card">
            <p-file-input disabled />
        </div>
    `,
    standalone: true,
    imports: [FileInputModule]
})
export class FileinputDisabledDemo {
}
```

## Existing Files

When a form edits a record, pass the files already stored on the server to existing . They are listed before the new files, with a download button when they have a url and a delete button. Deleting one emits onRemoveExisting : delete the file on the server from there. Existing files count toward maxFiles and are not part of the value.

```typescript
import { Component, inject } from '@angular/core';
import { MessageService } from '@exhaustive-ui/core/api';
import { FileInputExistingFile, FileInputModule, FileInputRemoveExistingEvent } from '@exhaustive-ui/core/fileinput';
import { ToastModule } from '@exhaustive-ui/core/toast';

@Component({
    template: `
        <p-toast />
        <div class="card">
            <p-file-input [existing]="attachments" (onRemoveExisting)="onRemoveExisting($event)" />
        </div>
    `,
    standalone: true,
    imports: [FileInputModule, ToastModule],
    providers: [MessageService]
})
export class FileinputExistingDemo {
    messageService = inject(MessageService);

    attachments: FileInputExistingFile[] = [
        { id: 1, name: 'signed-contract.pdf', size: 1240000, type: 'application/pdf' },
        { id: 2, name: 'facade.jpg', size: 312000, type: 'image/jpeg', url: 'https://exhaustive-ui.com/demo/galleria/galleria1.jpg' }
    ];

    onRemoveExisting(event: FileInputRemoveExistingEvent) {
        this.messageService.add({ severity: 'info', summary: 'Delete on the server', detail: event.file.name, life: 3000 });
    }
}
```

## Images

The images variant shows the files as a grid of square thumbnails, for a gallery, a listing or a product page. The first image is marked as the cover, the progress of an upload is drawn over its thumbnail, and the add tile, which also accepts dropped files, stays at the end of the grid until maxFiles is reached.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileInputModule, FileInputUploadHandler } from '@exhaustive-ui/core/fileinput';

@Component({
    template: `
        <div class="card">
            <p-file-input variant="images" accept="image/*" [maxFiles]="6" [maxFileSize]="5000000" [uploadHandler]="upload" [(ngModel)]="photos" />
        </div>
    `,
    standalone: true,
    imports: [FormsModule, FileInputModule]
})
export class FileinputImagesDemo {
    photos: File[] = [];

    upload: FileInputUploadHandler = (file, { signal, progress }) =>
        new Promise((resolve) => {
            let percent = 0;
            const timer = setInterval(() => {
                percent += 8;
                progress(percent);
                if (percent >= 100) {
                    clearInterval(timer);
                    resolve({ name: file.name });
                }
            }, 120);
            signal.addEventListener('abort', () => clearInterval(timer));
        });
}
```

## Invalid

The invalid state is applied using the invalid property to indicate failed validation.

```typescript
import { Component } from '@angular/core';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';

@Component({
    template: `
        <div class="card">
            <p-file-input [invalid]="files.length === 0" (onSelect)="files = $event.items" />
        </div>
    `,
    standalone: true,
    imports: [FileInputModule]
})
export class FileinputInvalidDemo {
    files: unknown[] = [];
}
```

## Labels

Every text of the component, error messages and screen reader announcements included, can be replaced through labels . Missing keys keep their English default. Placeholders such as {{ '{0}' }} receive the values. Sizes use the fileSizeTypes units of the locale.

```typescript
import { Component } from '@angular/core';
import { FileInputLabels, FileInputModule } from '@exhaustive-ui/core/fileinput';

@Component({
    template: `
        <div class="card">
            <p-file-input [labels]="labels" [maxFileSize]="2000000" hint="2 Mo maximum par fichier" />
        </div>
    `,
    standalone: true,
    imports: [FileInputModule]
})
export class FileinputLabelsDemo {
    labels: Partial<FileInputLabels> = {
        dropzone: 'Déposez vos fichiers ici ou',
        browse: 'parcourez',
        remove: 'Retirer',
        maxFileSizeError: 'Trop lourd : {0}, maximum {1}',
        addedMessage: '{0} fichier(s) ajouté(s)',
        removedMessage: '{0} retiré',
        listLabel: 'Fichiers sélectionnés'
    };
}
```

## reactiveforms-doc

FileInput can also be used with reactive forms. In this case, the formControlName property is used to bind the component to a form control.

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <p-toast />
        <div class="card">
            <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label id="documents-label" class="font-medium">Documents</label>
                    <p-file-input formControlName="documents" ariaLabelledBy="documents-label" size="small" [maxFiles]="3" [invalid]="isInvalid('documents')" />
                    @if (isInvalid('documents')) {
                        <p-message severity="error" size="small" variant="simple">At least one document is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit" class="self-start"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [ReactiveFormsModule, FileInputModule, ToastModule, MessageModule, ButtonModule],
    providers: [MessageService]
})
export class FileinputReactiveformsDemo {
    private fb = inject(FormBuilder);

    messageService = inject(MessageService);

    exampleForm: FormGroup;

    formSubmitted: boolean = false;

    constructor() {
        this.exampleForm = this.fb.group({
            documents: [[], Validators.required]
        });
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.exampleForm.reset({ documents: [] });
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

FileInput can also be used with Angular Signal Forms . The [formField] directive binds the component to a field holding an array of files. Signal Forms' required does not treat an empty array as empty, so use minLength(field, 1) to require at least one file.

```typescript
import { Component, inject, signal } from '@angular/core';
import { form, FormField, minLength, submit } from '@angular/forms/signals';
import { MessageService } from '@exhaustive-ui/core/api';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';

@Component({
    template: `
        <p-toast />
        <div class="card">
            <form novalidate (submit)="onSubmit($event)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label id="photos-label" class="font-medium">Photos</label>
                    <p-file-input [formField]="listingForm.photos" variant="images" accept="image/*" [maxFiles]="4" ariaLabelledBy="photos-label" />
                    @let photos = listingForm.photos();
                    @if (photos.invalid() && photos.touched()) {
                        <p-message severity="error" size="small" variant="simple">Add at least one photo.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit" class="self-start"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormField, FileInputModule, ButtonModule, ToastModule, MessageModule],
    providers: [MessageService]
})
export class FileinputSignalformsDemo {
    messageService = inject(MessageService);

    model = signal<{ photos: File[] }>({ photos: [] });

    listingForm = form(this.model, (f) => {
        minLength(f.photos, 1);
    });

    onSubmit(event: Event) {
        event.preventDefault();
        submit(this.listingForm, async () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
            this.listingForm().reset({ photos: [] });
        });
    }
}
```

## Sizes

FileInput provides small and large sizes as alternatives to the default, like the other form fields.

```typescript
import { Component } from '@angular/core';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';

@Component({
    template: `
        <div class="card flex flex-col gap-4">
            <p-file-input size="small" />
            <p-file-input />
            <p-file-input size="large" />
        </div>
    `,
    standalone: true,
    imports: [FileInputModule]
})
export class FileinputSizesDemo {
}
```

## Template

The dropzone template replaces the content of the dropzone and receives an open function and an active flag, true while files are dragged over it. The item template replaces a row of the list and receives the item with its remove , retry and cancel functions.

```typescript
import { Component } from '@angular/core';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <div class="card">
            <p-file-input accept=".csv,.xlsx">
                <ng-template #dropzone let-active="active">
                    <i class="pi pi-file-excel !text-3xl text-muted-color"></i>
                    <span class="font-semibold">{{ active ? 'Release to import' : 'Import a spreadsheet' }}</span>
                    <span class="text-sm text-muted-color">CSV or Excel</span>
                </ng-template>
                <ng-template #item let-item let-remove="remove">
                    <i class="pi pi-table text-muted-color"></i>
                    <span class="flex-1 truncate">{{ item.name }}</span>
                    <p-button icon="pi pi-times" severity="secondary" text rounded [ariaLabel]="'Remove ' + item.name" (onClick)="remove()" />
                </ng-template>
            </p-file-input>
        </div>
    `,
    standalone: true,
    imports: [FileInputModule, ButtonModule]
})
export class FileinputTemplateDemo {
}
```

## templatedrivenforms-doc

The value is an array of files, empty when nothing is selected, so required works as on the other fields. Resetting the form clears the files.

```typescript
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@exhaustive-ui/core/api';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';
import { ToastModule } from '@exhaustive-ui/core/toast';
import { MessageModule } from '@exhaustive-ui/core/message';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    template: `
        <p-toast />
        <div class="card">
            <form #exampleForm="ngForm" (ngSubmit)="onSubmit(exampleForm)" class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label id="receipts-label" class="font-medium">Receipts</label>
                    <p-file-input #model="ngModel" [(ngModel)]="receipts" name="receipts" ariaLabelledBy="receipts-label" size="small" accept="image/*,.pdf" [invalid]="model.invalid && exampleForm.submitted" required />
                    @if (model.invalid && exampleForm.submitted) {
                        <p-message severity="error" size="small" variant="simple">At least one receipt is required.</p-message>
                    }
                </div>
                <button pButton severity="secondary" type="submit" class="self-start"><span pButtonLabel>Submit</span></button>
            </form>
        </div>
    `,
    standalone: true,
    imports: [FormsModule, FileInputModule, ToastModule, MessageModule, ButtonModule],
    providers: [MessageService]
})
export class FileinputTemplatedrivenformsDemo {
    messageService = inject(MessageService);

    receipts: File[] = [];

    onSubmit(form: any) {
        if (form.valid) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
            form.resetForm();
        }
    }
}
```

## Upload

Each file is uploaded in its own request, with its own progress bar, as soon as it is added. Set url to post the files with HttpClient , which requires provideHttpClient() , or pass an uploadHandler function to upload them yourself, straight to cloud storage for example. The handler receives the file, an AbortSignal and a progress callback, and returns a promise of the server response. At most concurrency files upload at the same time, 3 by default. An upload in progress can be canceled, and a failed or canceled upload can be retried. Set auto to false to start the uploads with the upload() method instead. The demo below simulates the server. Files with "error" in their name fail. Posting to an endpoint only needs its url. The form data field is named file , or the value of fieldName .

```typescript
import { Component, inject } from '@angular/core';
import { MessageService } from '@exhaustive-ui/core/api';
import { FileInputModule, FileInputUploadEvent, FileInputUploadHandler } from '@exhaustive-ui/core/fileinput';
import { ToastModule } from '@exhaustive-ui/core/toast';

@Component({
    template: `
        <p-toast />
        <div class="card">
            <p-file-input [uploadHandler]="upload" (onUpload)="onUpload($event)" />
        </div>
    `,
    standalone: true,
    imports: [FileInputModule, ToastModule],
    providers: [MessageService]
})
export class FileinputUploadDemo {
    messageService = inject(MessageService);

    upload: FileInputUploadHandler = (file, { signal, progress }) =>
        new Promise((resolve, reject) => {
            let percent = 0;
            const timer = setInterval(() => {
                percent += 100000 / Math.max(file.size, 200000);
                progress(percent);
                if (file.name.includes('error') && percent > 50) {
                    clearInterval(timer);
                    reject(new Error('The server answered 500'));
                } else if (percent >= 100) {
                    clearInterval(timer);
                    resolve({ name: file.name });
                }
            }, 150);
            signal.addEventListener('abort', () => clearInterval(timer));
        });

    onUpload(event: FileInputUploadEvent) {
        this.messageService.add({ severity: 'success', summary: 'Uploaded', detail: event.item.name, life: 2000 });
    }
}
```

## Validation

accept takes extensions such as .pdf and MIME types such as image/* . maxFileSize and minFileSize limit the size of each file, maxFiles the number of files, existing files included, and maxTotalSize the size of all the files together, in bytes. A rejected file stays in the list with the reason next to it until the user removes it, and it is not part of the value. Use hint to state the rules under the dropzone.

```typescript
import { Component } from '@angular/core';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';

@Component({
    template: `
        <div class="card">
            <p-file-input accept="image/*,.pdf" [maxFileSize]="5000000" [maxFiles]="5" [maxTotalSize]="15000000" hint="Images and PDF · 5 MB per file · 5 files and 15 MB in total" />
        </div>
    `,
    standalone: true,
    imports: [FileInputModule]
})
export class FileinputValidationDemo {
}
```

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| root | PassThroughOption<HTMLElement, I> | Used to pass attributes to the root's DOM element. |
| input | PassThroughOption<HTMLInputElement, I> | Used to pass attributes to the hidden file input's DOM element. |
| dropzone | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the dropzone's DOM element. |
| dropzoneIcon | PassThroughOption<SVGElement, I> | Used to pass attributes to the dropzone icon's DOM element. |
| label | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the dropzone label's DOM element. |
| hint | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to the hint's DOM element. |
| summary | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the upload summary's DOM element. |
| list | PassThroughOption<HTMLUListElement, I> | Used to pass attributes to the file list's DOM element. |
| item | PassThroughOption<HTMLLIElement, I> | Used to pass attributes to a file row's DOM element. |
| thumbnail | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to a thumbnail's DOM element. |
| name | PassThroughOption<HTMLSpanElement, I> | Used to pass attributes to a file name's DOM element. |
| meta | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the size and status line's DOM element. |
| progress | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to a progress bar's DOM element. |
| actions | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the actions container of a row or tile. |
| action | PassThroughOption<HTMLAnchorElement \| HTMLButtonElement, I> | Used to pass attributes to an action button's DOM element. |
| grid | PassThroughOption<HTMLUListElement, I> | Used to pass attributes to the image grid's DOM element. |
| tile | PassThroughOption<HTMLLIElement, I> | Used to pass attributes to an image tile's DOM element. |
| add | PassThroughOption<HTMLButtonElement, I> | Used to pass attributes to the add tile's DOM element. |
| avatar | PassThroughOption<HTMLDivElement, I> | Used to pass attributes to the avatar's DOM element. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-fileinput | Class name of the root element |
| p-fileinput-input | Class name of the hidden file input |
| p-fileinput-dropzone | Class name of the dropzone |
| p-fileinput-dropzone-icon | Class name of the dropzone icon |
| p-fileinput-label | Class name of the dropzone label |
| p-fileinput-hint | Class name of the hint |
| p-fileinput-summary | Class name of the upload summary |
| p-fileinput-progress | Class name of a progress bar |
| p-fileinput-list | Class name of the file list |
| p-fileinput-item | Class name of a file row |
| p-fileinput-thumbnail | Class name of a thumbnail |
| p-fileinput-name | Class name of a file name |
| p-fileinput-meta | Class name of the size and status line |
| p-fileinput-action | Class name of an action button |
| p-fileinput-grid | Class name of the image grid |
| p-fileinput-tile | Class name of an image tile |
| p-fileinput-add | Class name of the add tile |
| p-fileinput-avatar | Class name of the avatar |

### Design Tokens

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| fileinput.gap | --p-fileinput-gap | Gap between the dropzone, the summary and the file list |
| fileinput.transition.duration | --p-fileinput-transition-duration | Transition duration |
| fileinput.dropzone.background | --p-fileinput-dropzone-background | Background |
| fileinput.dropzone.border.color | --p-fileinput-dropzone-border-color | Border color |
| fileinput.dropzone.hover.border.color | --p-fileinput-dropzone-hover-border-color | Border color while hovered |
| fileinput.dropzone.active.border.color | --p-fileinput-dropzone-active-border-color | Border color while files are dragged over |
| fileinput.dropzone.active.background | --p-fileinput-dropzone-active-background | Background while files are dragged over |
| fileinput.dropzone.color | --p-fileinput-dropzone-color | Text color |
| fileinput.dropzone.invalid.border.color | --p-fileinput-dropzone-invalid-border-color | Border color in invalid state |
| fileinput.dropzone.disabled.background | --p-fileinput-dropzone-disabled-background | Background in disabled state |
| fileinput.dropzone.disabled.color | --p-fileinput-dropzone-disabled-color | Text color in disabled state |
| fileinput.dropzone.border.radius | --p-fileinput-dropzone-border-radius | Border radius |
| fileinput.dropzone.padding | --p-fileinput-dropzone-padding | Padding |
| fileinput.dropzone.gap | --p-fileinput-dropzone-gap | Gap between the icon, the label and the hint |
| fileinput.dropzone.font.weight | --p-fileinput-dropzone-font-weight | Font weight of the label |
| fileinput.dropzone.focus.ring.width | --p-fileinput-dropzone-focus-ring-width | Focus ring width of the dropzone |
| fileinput.dropzone.focus.ring.style | --p-fileinput-dropzone-focus-ring-style | Focus ring style of the dropzone |
| fileinput.dropzone.focus.ring.color | --p-fileinput-dropzone-focus-ring-color | Focus ring color of the dropzone |
| fileinput.dropzone.focus.ring.offset | --p-fileinput-dropzone-focus-ring-offset | Focus ring offset of the dropzone |
| fileinput.dropzone.focus.ring.shadow | --p-fileinput-dropzone-focus-ring-shadow | Focus ring shadow of the dropzone |
| fileinput.dropzone.sm.padding | --p-fileinput-dropzone-sm-padding | Padding of the small size |
| fileinput.dropzone.sm.font.size | --p-fileinput-dropzone-sm-font-size | Font size of the small size |
| fileinput.dropzone.lg.padding | --p-fileinput-dropzone-lg-padding | Padding of the large size |
| fileinput.dropzone.lg.font.size | --p-fileinput-dropzone-lg-font-size | Font size of the large size |
| fileinput.icon.color | --p-fileinput-icon-color | Color of the dropzone icon |
| fileinput.icon.size | --p-fileinput-icon-size | Size of the dropzone icon |
| fileinput.hint.color | --p-fileinput-hint-color | Color of the hint |
| fileinput.hint.font.size | --p-fileinput-hint-font-size | Font size of the hint |
| fileinput.list.border.color | --p-fileinput-list-border-color | Border color of the file list |
| fileinput.list.border.radius | --p-fileinput-list-border-radius | Border radius of the file list |
| fileinput.item.padding | --p-fileinput-item-padding | Padding of a file row |
| fileinput.item.gap | --p-fileinput-item-gap | Gap inside a file row |
| fileinput.item.border.color | --p-fileinput-item-border-color | Separator color between rows |
| fileinput.item.error.background | --p-fileinput-item-error-background | Background of a row in error |
| fileinput.thumbnail.size | --p-fileinput-thumbnail-size | Size of a thumbnail |
| fileinput.thumbnail.border.radius | --p-fileinput-thumbnail-border-radius | Border radius of a thumbnail |
| fileinput.thumbnail.background | --p-fileinput-thumbnail-background | Background of a thumbnail |
| fileinput.thumbnail.color | --p-fileinput-thumbnail-color | Color of the file extension shown in a thumbnail |
| fileinput.meta.color | --p-fileinput-meta-color | Color of the size and status line |
| fileinput.meta.font.size | --p-fileinput-meta-font-size | Font size of the size and status line |
| fileinput.meta.gap | --p-fileinput-meta-gap | Gap inside the size and status line |
| fileinput.progress.height | --p-fileinput-progress-height | Height of a progress bar |
| fileinput.progress.border.radius | --p-fileinput-progress-border-radius | Border radius of a progress bar |
| fileinput.progress.background | --p-fileinput-progress-background | Track color of a progress bar |
| fileinput.progress.value.background | --p-fileinput-progress-value-background | Value color of a progress bar |
| fileinput.status.success.color | --p-fileinput-status-success-color | Color of the uploaded status |
| fileinput.status.error.color | --p-fileinput-status-error-color | Color of error messages |
| fileinput.action.size | --p-fileinput-action-size | Size of a row action button |
| fileinput.action.border.radius | --p-fileinput-action-border-radius | Border radius of a row action button |
| fileinput.action.color | --p-fileinput-action-color | Color of a row action button |
| fileinput.action.hover.color | --p-fileinput-action-hover-color | Color of a hovered row action button |
| fileinput.action.hover.background | --p-fileinput-action-hover-background | Background of a hovered row action button |
| fileinput.action.focus.ring.width | --p-fileinput-action-focus-ring-width | Focus ring width of the action |
| fileinput.action.focus.ring.style | --p-fileinput-action-focus-ring-style | Focus ring style of the action |
| fileinput.action.focus.ring.color | --p-fileinput-action-focus-ring-color | Focus ring color of the action |
| fileinput.action.focus.ring.offset | --p-fileinput-action-focus-ring-offset | Focus ring offset of the action |
| fileinput.action.focus.ring.shadow | --p-fileinput-action-focus-ring-shadow | Focus ring shadow of the action |
| fileinput.summary.gap | --p-fileinput-summary-gap | Gap inside the upload summary |
| fileinput.summary.color | --p-fileinput-summary-color | Color of the upload summary |
| fileinput.summary.font.size | --p-fileinput-summary-font-size | Font size of the upload summary |
| fileinput.grid.gap | --p-fileinput-grid-gap | Gap between image tiles |
| fileinput.grid.item.min.width | --p-fileinput-grid-item-min-width | Minimum width of an image tile |
| fileinput.tile.border.radius | --p-fileinput-tile-border-radius | Border radius of an image tile |
| fileinput.tile.border.color | --p-fileinput-tile-border-color | Border color of an image tile |
| fileinput.tile.error.border.color | --p-fileinput-tile-error-border-color | Border color of an image tile in error |
| fileinput.tile.background | --p-fileinput-tile-background | Background of an image tile |
| fileinput.tile.overlay.background | --p-fileinput-tile-overlay-background | Background of the progress overlay |
| fileinput.tile.overlay.color | --p-fileinput-tile-overlay-color | Text color of the overlays |
| fileinput.tile.error.overlay.background | --p-fileinput-tile-error-overlay-background | Background of the error overlay |
| fileinput.tile.action.background | --p-fileinput-tile-action-background | Background of the tile action buttons and badge |
| fileinput.tile.action.color | --p-fileinput-tile-action-color | Color of the tile action buttons and badge |
| fileinput.avatar.size | --p-fileinput-avatar-size | Size of the avatar |
| fileinput.avatar.background | --p-fileinput-avatar-background | Background of the avatar |
| fileinput.avatar.border.color | --p-fileinput-avatar-border-color | Border color of the avatar |
| fileinput.avatar.color | --p-fileinput-avatar-color | Icon color of an empty avatar |
| fileinput.avatar.square.border.radius | --p-fileinput-avatar-square-border-radius | Border radius of the square avatar |
| fileinput.avatar.overlay.background | --p-fileinput-avatar-overlay-background | Background of the avatar overlay |
| fileinput.avatar.overlay.color | --p-fileinput-avatar-overlay-color | Text color of the avatar overlay |

