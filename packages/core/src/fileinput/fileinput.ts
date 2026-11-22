import { NgTemplateOutlet } from '@angular/common';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, ElementRef, forwardRef, inject, input, NgModule, numberAttribute, output, signal, TemplateRef, viewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SharedModule, TranslationKeys } from '@exhaustive-ui/core/api';
import { PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseEditableHolder } from '@exhaustive-ui/core/baseeditableholder';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { ArrowDownIcon, BanIcon, CheckIcon, RefreshIcon, TimesIcon, TrashIcon, UploadIcon } from '@exhaustive-ui/core/icons';
import type {
    FileInputCompleteEvent,
    FileInputDropzoneTemplateContext,
    FileInputErrorCode,
    FileInputErrorEvent,
    FileInputExistingFile,
    FileInputItem,
    FileInputItemEvent,
    FileInputItemTemplateContext,
    FileInputLabels,
    FileInputPassThrough,
    FileInputRemoveExistingEvent,
    FileInputSelectEvent,
    FileInputUploadEvent,
    FileInputUploadHandler,
    FileInputVariant
} from '@exhaustive-ui/core/types/fileinput';
import { uuid } from '@exhaustive-ui/utils';
import { Subscription } from 'rxjs';
import { FileInputStyle } from './style/fileinputstyle';

export const FILEINPUT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FileInput),
    multi: true
};

/**
 * Default texts of FileInput.
 * @group Constants
 */
export const FILEINPUT_DEFAULT_LABELS: FileInputLabels = {
    dropzone: 'Drop files here or',
    browse: 'browse',
    add: 'Add',
    avatarAdd: 'Add',
    avatarChange: 'Change',
    cover: 'Cover',
    remove: 'Remove',
    cancel: 'Cancel upload',
    retry: 'Retry',
    download: 'Download',
    delete: 'Delete',
    queued: 'Queued',
    uploaded: 'Uploaded',
    canceled: 'Canceled',
    summary: '{0} of {1} uploaded · {2} of {3}',
    typeError: 'This file type is not accepted',
    maxFileSizeError: 'Too large: {0}, maximum {1}',
    minFileSizeError: 'Too small: {0}, minimum {1}',
    maxFilesError: 'Limit of {0} files reached',
    maxTotalSizeError: 'Exceeds the total limit of {0}',
    uploadError: 'Upload failed',
    addedMessage: '{0} file(s) added',
    rejectedMessage: '{0} rejected',
    uploadedMessage: '{0} uploaded',
    failedMessage: 'Upload of {0} failed',
    removedMessage: '{0} removed',
    listLabel: 'Selected files'
};

let fileInputItemId = 0;

const format = (text: string, ...values: (string | number)[]) => values.reduce<string>((acc, value, index) => acc.replace(`{${index}}`, String(value)), text);

/**
 * FileInput selects files by drag and drop, paste or the file picker, validates each file and uploads it with its own progress. It works with template-driven forms, reactive forms and Signal Forms.
 * @group Components
 */
@Component({
    selector: 'p-file-input, p-file, p-fileinput',
    standalone: true,
    imports: [NgTemplateOutlet, SharedModule, BindModule, UploadIcon, TimesIcon, RefreshIcon, TrashIcon, ArrowDownIcon, BanIcon, CheckIcon],
    template: `
        <input
            #fileInput
            type="file"
            [class]="cx('input')"
            [attr.id]="inputId()"
            [attr.name]="name()"
            [attr.accept]="accept()"
            [attr.capture]="capture()"
            [attr.webkitdirectory]="directory() ? '' : undefined"
            [multiple]="isMultiple()"
            [disabled]="$disabled()"
            tabindex="-1"
            aria-hidden="true"
            (change)="onFileInputChange($event)"
            [pBind]="ptm('input')"
        />

        @if (variant() === 'avatar') {
            <div
                [class]="cx('avatar')"
                role="button"
                [attr.tabindex]="$disabled() ? -1 : 0"
                [attr.aria-label]="ariaLabel() || (avatarSrc() ? labelOf('avatarChange') : labelOf('avatarAdd'))"
                [attr.aria-labelledby]="ariaLabelledBy()"
                [attr.aria-disabled]="$disabled()"
                [attr.aria-invalid]="$invalid() || undefined"
                (click)="open()"
                (keydown)="onTriggerKeydown($event)"
                (dragenter)="onDragEnter($event)"
                (dragover)="onDragOver($event)"
                (dragleave)="onDragLeave($event)"
                (drop)="onDrop($event)"
                [pBind]="ptm('avatar')"
            >
                @if (avatarSrc()) {
                    <img [src]="avatarSrc()" alt="" />
                } @else {
                    <svg data-p-icon="upload" [class]="cx('avatarIcon')" aria-hidden="true" />
                }
                <span [class]="cx('avatarOverlay')" aria-hidden="true">
                    @if (avatarItem()?.status === 'uploading') {
                        {{ avatarItem()!.progress }} %
                    } @else {
                        {{ avatarSrc() ? labelOf('avatarChange') : labelOf('avatarAdd') }}
                    }
                </span>
            </div>
            @if (avatarItem()?.error) {
                <span [class]="cx('avatarError')">{{ avatarItem()!.error }}</span>
            }
        } @else {
            @if (variant() === 'list') {
                <div
                    [class]="cx('dropzone')"
                    role="button"
                    [attr.tabindex]="$disabled() ? -1 : 0"
                    [attr.aria-label]="ariaLabel()"
                    [attr.aria-labelledby]="ariaLabelledBy()"
                    [attr.aria-describedby]="hint() ? hintId : undefined"
                    [attr.aria-disabled]="$disabled()"
                    [attr.aria-invalid]="$invalid() || undefined"
                    (click)="open()"
                    (keydown)="onTriggerKeydown($event)"
                    (dragenter)="onDragEnter($event)"
                    (dragover)="onDragOver($event)"
                    (dragleave)="onDragLeave($event)"
                    (drop)="onDrop($event)"
                    [pBind]="ptm('dropzone')"
                >
                    @if (dropzoneTemplate()) {
                        <ng-container *ngTemplateOutlet="dropzoneTemplate()!; context: { open: openFn, active: dragActive() }" />
                    } @else {
                        <svg data-p-icon="upload" [class]="cx('dropzoneIcon')" aria-hidden="true" [pBind]="ptm('dropzoneIcon')" />
                        <span [class]="cx('label')" [pBind]="ptm('label')"
                            >{{ labelOf('dropzone') }} <span [class]="cx('browse')">{{ labelOf('browse') }}</span></span
                        >
                        @if (hint()) {
                            <span [class]="cx('hint')" [attr.id]="hintId" [pBind]="ptm('hint')">{{ hint() }}</span>
                        }
                    }
                </div>
            }

            @if (showSummary() && summary(); as s) {
                <div [class]="cx('summary')" [pBind]="ptm('summary')">
                    <span>{{ s.text }}</span>
                    <div [class]="cx('progress')" role="progressbar" aria-valuemin="0" aria-valuemax="100" [attr.aria-valuenow]="s.percent" [attr.aria-label]="s.text" [pBind]="ptm('progress')">
                        <div [class]="cx('progressValue')" [style.width.%]="s.percent"></div>
                    </div>
                </div>
            }

            @if (variant() === 'list') {
                @if (displayItems().length) {
                    <ul [class]="cx('list')" [attr.aria-label]="labelOf('listLabel')" [pBind]="ptm('list')">
                        @for (item of displayItems(); track item.id) {
                            @if (itemTemplate()) {
                                <li [class]="cx('item', { item })" [pBind]="ptm('item')">
                                    <ng-container *ngTemplateOutlet="itemTemplate()!; context: itemContext(item)" />
                                </li>
                            } @else {
                                <li [class]="cx('item', { item })" [attr.data-p-status]="item.status" [pBind]="ptm('item')">
                                    <div [class]="cx('thumbnail')" aria-hidden="true" [pBind]="ptm('thumbnail')">
                                        @if (thumbnailOf(item); as src) {
                                            <img [src]="src" alt="" />
                                        } @else {
                                            {{ extensionOf(item) }}
                                        }
                                    </div>
                                    <div [class]="cx('info')">
                                        <span [class]="cx('name')" [attr.title]="item.path + item.name" [pBind]="ptm('name')">
                                            @if (item.path) {
                                                <span [class]="cx('path')">{{ item.path }}</span>
                                            }
                                            {{ item.name }}</span
                                        >
                                        <div [class]="cx('meta')" [pBind]="ptm('meta')">
                                            @if (item.status === 'uploading') {
                                                <span>{{ item.progress }} %</span>
                                                <div [class]="cx('progress')" role="progressbar" aria-valuemin="0" aria-valuemax="100" [attr.aria-valuenow]="item.progress" [attr.aria-label]="item.name" [pBind]="ptm('progress')">
                                                    <div [class]="cx('progressValue')" [style.width.%]="item.progress"></div>
                                                </div>
                                            } @else if (item.status === 'invalid' || item.status === 'failed') {
                                                <span [class]="cx('status', { item })">{{ item.error }}</span>
                                            } @else {
                                                @if (item.size !== undefined) {
                                                    <span>{{ formatSize(item.size) }}</span>
                                                }
                                                @if (statusLabel(item); as label) {
                                                    <span [class]="cx('status', { item })">· {{ label }}</span>
                                                }
                                            }
                                        </div>
                                    </div>
                                    <div [class]="cx('actions')" [pBind]="ptm('actions')">
                                        <ng-container *ngTemplateOutlet="actionsTemplate; context: { $implicit: item }" />
                                    </div>
                                </li>
                            }
                        }
                    </ul>
                }
            } @else {
                <ul [class]="cx('grid')" [attr.aria-label]="labelOf('listLabel')" [pBind]="ptm('grid')">
                    @for (item of displayItems(); track item.id; let index = $index) {
                        <li [class]="cx('tile', { item })" [attr.data-p-status]="item.status" [pBind]="ptm('tile')">
                            @if (thumbnailOf(item); as src) {
                                <img [src]="src" [attr.alt]="item.name" />
                            }
                            @if (item.status === 'uploading') {
                                <div [class]="cx('tileOverlay')">
                                    <span>{{ item.progress }} %</span>
                                    <div [class]="cx('progress')" role="progressbar" aria-valuemin="0" aria-valuemax="100" [attr.aria-valuenow]="item.progress" [attr.aria-label]="item.name">
                                        <div [class]="cx('progressValue')" [style.width.%]="item.progress"></div>
                                    </div>
                                </div>
                            } @else if (item.status === 'queued') {
                                <div [class]="cx('tileOverlay')">
                                    <span>{{ labelOf('queued') }}</span>
                                </div>
                            } @else if (item.status === 'invalid' || item.status === 'failed' || item.status === 'canceled') {
                                <div [class]="cx('tileOverlay')">
                                    <span>{{ item.error || labelOf('canceled') }}</span>
                                </div>
                            }
                            @if (item.id === coverId()) {
                                <span [class]="cx('cover')">{{ labelOf('cover') }}</span>
                            }
                            @if (item.status === 'uploaded') {
                                <span [class]="cx('tileDone')" [attr.aria-label]="labelOf('uploaded')" role="img"><svg data-p-icon="check" aria-hidden="true" /></span>
                            }
                            <div [class]="cx('tileActions')" [pBind]="ptm('actions')">
                                <ng-container *ngTemplateOutlet="actionsTemplate; context: { $implicit: item }" />
                            </div>
                        </li>
                    }
                    @if (canAdd()) {
                        <li>
                            <button
                                type="button"
                                [class]="cx('add')"
                                [attr.aria-label]="ariaLabel()"
                                [attr.aria-labelledby]="ariaLabelledBy()"
                                [attr.aria-invalid]="$invalid() || undefined"
                                (click)="open()"
                                (dragenter)="onDragEnter($event)"
                                (dragover)="onDragOver($event)"
                                (dragleave)="onDragLeave($event)"
                                (drop)="onDrop($event)"
                                [pBind]="ptm('add')"
                            >
                                <svg data-p-icon="upload" [class]="cx('dropzoneIcon')" aria-hidden="true" />
                                {{ labelOf('add') }}
                            </button>
                        </li>
                    }
                </ul>
            }
        }

        <ng-template #actionsTemplate let-item>
            @switch (item.status) {
                @case ('uploading') {
                    <button type="button" [class]="cx('action')" [attr.aria-label]="labelOf('cancel') + ' ' + item.name" [attr.title]="labelOf('cancel')" (click)="cancel(item)" [pBind]="ptm('action')">
                        <svg data-p-icon="ban" [class]="cx('actionIcon')" aria-hidden="true" />
                    </button>
                }
                @case ('existing') {
                    @if (item.existing?.url) {
                        <a [class]="cx('action')" [attr.href]="item.existing.url" target="_blank" rel="noopener" download [attr.aria-label]="labelOf('download') + ' ' + item.name" [attr.title]="labelOf('download')" [pBind]="ptm('action')">
                            <svg data-p-icon="arrow-down" [class]="cx('actionIcon')" aria-hidden="true" />
                        </a>
                    }
                    @if (!$disabled()) {
                        <button type="button" [class]="cx('action')" [attr.aria-label]="labelOf('delete') + ' ' + item.name" [attr.title]="labelOf('delete')" (click)="remove(item)" [pBind]="ptm('action')">
                            <svg data-p-icon="trash" [class]="cx('actionIcon')" aria-hidden="true" />
                        </button>
                    }
                }
                @default {
                    @if (!$disabled()) {
                        @if (item.status === 'failed' || item.status === 'canceled') {
                            <button type="button" [class]="cx('action')" [attr.aria-label]="labelOf('retry') + ' ' + item.name" [attr.title]="labelOf('retry')" (click)="retry(item)" [pBind]="ptm('action')">
                                <svg data-p-icon="refresh" [class]="cx('actionIcon')" aria-hidden="true" />
                            </button>
                        }
                        <button type="button" [class]="cx('action')" [attr.aria-label]="labelOf('remove') + ' ' + item.name" [attr.title]="labelOf('remove')" (click)="remove(item)" [pBind]="ptm('action')">
                            <svg data-p-icon="times" [class]="cx('actionIcon')" aria-hidden="true" />
                        </button>
                    }
                }
            }
        </ng-template>

        <span class="p-hidden-accessible" aria-live="polite">{{ announcement() }}</span>
    `,
    providers: [FILEINPUT_VALUE_ACCESSOR, FileInputStyle, { provide: PARENT_INSTANCE, useExisting: FileInput }],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP()',
        '(paste)': 'onPaste($event)'
    },
    hostDirectives: [Bind]
})
export class FileInput extends BaseEditableHolder<FileInputPassThrough> {
    componentName = 'FileInput';

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(FileInputStyle);

    private http = inject(HttpClient, { optional: true });

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
    }

    /******************** Inputs ********************/

    /**
     * Layout of the component: a dropzone with a list, a grid of images, or a single avatar.
     * @defaultValue 'list'
     * @group Props
     */
    readonly variant = input<FileInputVariant>('list');
    /**
     * Shape of the avatar variant.
     * @defaultValue 'circle'
     * @group Props
     */
    readonly avatarShape = input<'circle' | 'square'>('circle');
    /**
     * Whether several files can be selected. The value is then an array of files, otherwise a single file or null. Always false in the avatar variant.
     * @defaultValue true
     * @group Props
     */
    readonly multiple = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Accepted file types, as in the accept attribute of a file input: extensions such as `.pdf` and MIME types such as `image/*`.
     * @group Props
     */
    readonly accept = input<string | undefined>();
    /**
     * On mobile devices, opens the camera directly: `user` for the front camera, `environment` for the back camera.
     * @group Props
     */
    readonly capture = input<'user' | 'environment' | undefined>();
    /**
     * Makes the file picker select a whole folder. Dropped folders are always accepted.
     * @defaultValue false
     * @group Props
     */
    readonly directory = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Maximum size of a file, in bytes.
     * @group Props
     */
    readonly maxFileSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Minimum size of a file, in bytes.
     * @group Props
     */
    readonly minFileSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Maximum number of files, existing files included.
     * @group Props
     */
    readonly maxFiles = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Maximum size of all the files together, in bytes.
     * @group Props
     */
    readonly maxTotalSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * URL to upload each file to, in its own request. Requires provideHttpClient().
     * @group Props
     */
    readonly url = input<string | undefined>();
    /**
     * HTTP method of the upload requests.
     * @defaultValue 'post'
     * @group Props
     */
    readonly method = input<'post' | 'put'>('post');
    /**
     * Headers of the upload requests.
     * @group Props
     */
    readonly headers = input<HttpHeaders | undefined>();
    /**
     * Whether the upload requests send cookies and credentials.
     * @defaultValue false
     * @group Props
     */
    readonly withCredentials = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Name of the form data field that holds the file in an upload request.
     * @defaultValue 'file'
     * @group Props
     */
    readonly fieldName = input<string>('file');
    /**
     * Function that uploads one file, used instead of url: to upload straight to cloud storage, or through your own service.
     * @group Props
     */
    readonly uploadHandler = input<FileInputUploadHandler | undefined>();
    /**
     * Whether files start uploading as soon as they are added. When false, call upload().
     * @defaultValue true
     * @group Props
     */
    readonly auto = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Maximum number of files uploaded at the same time.
     * @defaultValue 3
     * @group Props
     */
    readonly concurrency = input<number, unknown>(3, { transform: numberAttribute });
    /**
     * Files already stored on the server, shown with a download and a delete button.
     * @group Props
     */
    readonly existing = input<FileInputExistingFile[] | undefined>();
    /**
     * Text under the dropzone label, such as the accepted types and sizes.
     * @group Props
     */
    readonly hint = input<string | undefined>();
    /**
     * Texts of the component, merged with the English defaults.
     * @group Props
     */
    readonly labels = input<Partial<FileInputLabels> | undefined>();
    /**
     * Whether to show the summary of the uploads in progress.
     * @defaultValue true
     * @group Props
     */
    readonly showSummary = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Size of the component.
     * @group Props
     */
    readonly size = input<'small' | 'large' | undefined>();
    /**
     * Identifier of the hidden file input.
     * @group Props
     */
    readonly inputId = input<string | undefined>();
    /**
     * Accessible label of the dropzone, the add tile or the avatar.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();
    /**
     * Identifier of the element that labels the dropzone, the add tile or the avatar.
     * @group Props
     */
    readonly ariaLabelledBy = input<string | undefined>();

    /******************** Outputs ********************/

    /**
     * Callback to invoke when files are added, including the ones rejected by validation.
     * @param {FileInputSelectEvent} event - Custom select event.
     * @group Emits
     */
    readonly onSelect = output<FileInputSelectEvent>();
    /**
     * Callback to invoke when the user removes a file.
     * @param {FileInputItemEvent} event - Custom item event.
     * @group Emits
     */
    readonly onRemove = output<FileInputItemEvent>();
    /**
     * Callback to invoke when the user cancels an upload.
     * @param {FileInputItemEvent} event - Custom item event.
     * @group Emits
     */
    readonly onCancel = output<FileInputItemEvent>();
    /**
     * Callback to invoke when a file is uploaded.
     * @param {FileInputUploadEvent} event - Custom upload event.
     * @group Emits
     */
    readonly onUpload = output<FileInputUploadEvent>();
    /**
     * Callback to invoke when an upload fails.
     * @param {FileInputErrorEvent} event - Custom error event.
     * @group Emits
     */
    readonly onError = output<FileInputErrorEvent>();
    /**
     * Callback to invoke when the last upload in progress ends.
     * @param {FileInputCompleteEvent} event - Custom complete event.
     * @group Emits
     */
    readonly onComplete = output<FileInputCompleteEvent>();
    /**
     * Callback to invoke when the user deletes an existing file. Delete it on the server from this callback.
     * @param {FileInputRemoveExistingEvent} event - Custom remove existing event.
     * @group Emits
     */
    readonly onRemoveExisting = output<FileInputRemoveExistingEvent>();

    /******************** Templates ********************/

    /**
     * Custom content of the dropzone.
     * @param {FileInputDropzoneTemplateContext} context - dropzone context.
     * @group Templates
     */
    readonly dropzoneTemplate = contentChild<TemplateRef<FileInputDropzoneTemplateContext>>('dropzone', { descendants: false });
    /**
     * Custom row of the list variant.
     * @param {FileInputItemTemplateContext} context - item context.
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<FileInputItemTemplateContext>>('item', { descendants: false });

    readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

    /******************** State ********************/

    /**
     * Files selected in this session, uploaded or not, including the invalid ones.
     */
    readonly items = signal<FileInputItem[]>([]);

    readonly removedExisting = signal<Set<any>>(new Set());

    readonly dragActive = signal(false);

    readonly announcement = signal('');

    readonly uid = uuid('pn_id_');

    readonly hintId = `${this.uid}_hint`;

    readonly openFn = () => this.open();

    private dragDepth = 0;

    private uploads = new Map<string, { abort: () => void }>();

    private batch: { uploaded: FileInputItem[]; failed: FileInputItem[] } | null = null;

    readonly isMultiple = computed(() => this.variant() !== 'avatar' && this.multiple());

    readonly $invalid = computed(() => !!this.invalid());

    readonly mergedLabels = computed<FileInputLabels>(() => ({ ...FILEINPUT_DEFAULT_LABELS, ...(this.labels() ?? {}) }));

    readonly existingItems = computed<FileInputItem[]>(() => {
        const removed = this.removedExisting();
        return (this.existing() ?? [])
            .filter((file) => !removed.has(file.id ?? file.name))
            .map((file) => ({
                id: `existing_${file.id ?? file.name}`,
                name: file.name,
                path: '',
                size: file.size,
                type: file.type ?? '',
                status: 'existing',
                progress: 100,
                existing: file
            }));
    });

    readonly displayItems = computed(() => [...this.existingItems(), ...this.items()]);

    readonly countedItems = computed(() => this.displayItems().filter((item) => item.status !== 'invalid'));

    readonly coverId = computed(() => this.countedItems()[0]?.id);

    readonly canAdd = computed(() => {
        const max = this.maxFiles();
        return !this.$disabled() && (max === undefined || this.countedItems().length < max);
    });

    readonly avatarItem = computed(() => this.items().at(-1));

    readonly avatarSrc = computed(() => {
        const item = this.avatarItem();
        if (item && item.status !== 'invalid') {
            return item.previewUrl;
        }
        const existing = this.existingItems()[0];
        return existing ? this.thumbnailOf(existing) : undefined;
    });

    readonly summary = computed(() => {
        const items = this.items().filter((item) => item.status === 'queued' || item.status === 'uploading' || item.status === 'uploaded');
        if (!items.some((item) => item.status !== 'uploaded')) {
            return null;
        }
        const total = items.reduce((sum, item) => sum + (item.size ?? 0), 0);
        const done = items.reduce((sum, item) => sum + (item.size ?? 0) * (item.status === 'uploaded' ? 1 : item.progress / 100), 0);
        const count = items.filter((item) => item.status === 'uploaded').length;
        return {
            percent: total ? Math.round((done / total) * 100) : 0,
            text: format(this.labelOf('summary'), count, items.length, this.formatSize(done), this.formatSize(total))
        };
    });

    readonly dataP = computed(() =>
        this.cn({
            [this.variant()]: true,
            invalid: this.$invalid(),
            disabled: this.$disabled(),
            [this.size() as string]: !!this.size()
        })
    );

    /******************** Public methods ********************/

    /**
     * Opens the file picker.
     * @group Method
     */
    open() {
        if (!this.$disabled()) {
            this.fileInput()?.nativeElement.click();
        }
    }

    /**
     * Adds files as if the user had selected them.
     * @param {File[]} files - Files to add.
     * @group Method
     */
    addFiles(files: File[], event?: Event) {
        this.add(
            files.map((file) => ({ file, path: '' })),
            event
        );
    }

    /**
     * Uploads the selected files that are not uploaded yet. Only needed when auto is false.
     * @group Method
     */
    upload() {
        this.items.update((items) => items.map((item) => (item.status === 'selected' ? { ...item, status: 'queued' } : item)));
        this.pump();
    }

    /**
     * Removes a file. For an existing file, emits onRemoveExisting.
     * @param {FileInputItem} item - The item to remove.
     * @group Method
     */
    remove(item: FileInputItem) {
        if (item.status === 'existing') {
            const file = item.existing!;
            this.removedExisting.update((set) => new Set(set).add(file.id ?? file.name));
            this.onRemoveExisting.emit({ file });
        } else {
            this.abort(item.id);
            this.revoke(item);
            this.items.update((items) => items.filter((it) => it.id !== item.id));
            this.onRemove.emit({ item });
            this.emitValue();
            this.pump();
        }
        this.announce(format(this.labelOf('removedMessage'), item.name));
        this.restoreFocus();
    }

    /**
     * Cancels the upload of a file.
     * @param {FileInputItem} item - The item to cancel.
     * @group Method
     */
    cancel(item: FileInputItem) {
        this.abort(item.id);
        this.patch(item.id, { status: 'canceled', progress: 0 });
        this.onCancel.emit({ item });
        this.pump();
    }

    /**
     * Retries the upload of a failed or canceled file.
     * @param {FileInputItem} item - The item to retry.
     * @group Method
     */
    retry(item: FileInputItem) {
        this.patch(item.id, { status: 'queued', progress: 0, error: undefined, errorCode: undefined });
        this.pump();
    }

    /**
     * Removes all the selected files and cancels their uploads. Existing files are kept.
     * @group Method
     */
    clear() {
        this.items().forEach((item) => {
            this.abort(item.id);
            this.revoke(item);
        });
        this.items.set([]);
        this.emitValue();
    }

    /******************** Template helpers ********************/

    labelOf(key: keyof FileInputLabels): string {
        return this.mergedLabels()[key];
    }

    /**
     * Formats a size in bytes with decimal units, so that 5000000 reads 5 MB.
     */
    formatSize(bytes: number): string {
        const units: string[] = this.config.getTranslation(TranslationKeys.FILE_SIZE_TYPES) ?? ['B', 'KB', 'MB', 'GB', 'TB'];
        if (!bytes) {
            return `0 ${units[0]}`;
        }
        const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1000)), units.length - 1);
        const value = bytes / Math.pow(1000, index);
        const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: index < 2 ? 0 : 1 }).format(value);
        return `${formatted} ${units[index]}`;
    }

    extensionOf(item: FileInputItem): string {
        const dot = item.name.lastIndexOf('.');
        return dot > 0 ? item.name.slice(dot + 1, dot + 5) : '';
    }

    thumbnailOf(item: FileInputItem): string | undefined {
        if (item.previewUrl) {
            return item.previewUrl;
        }
        const existing = item.existing;
        if (existing) {
            return existing.thumbnail ?? (this.isImage(existing.type ?? '', existing.name) ? existing.url : undefined);
        }
        return undefined;
    }

    statusLabel(item: FileInputItem): string | undefined {
        switch (item.status) {
            case 'queued':
                return this.labelOf('queued');
            case 'uploaded':
                return this.labelOf('uploaded');
            case 'canceled':
                return this.labelOf('canceled');
            default:
                return undefined;
        }
    }

    itemContext(item: FileInputItem): FileInputItemTemplateContext {
        return { $implicit: item, remove: () => this.remove(item), retry: () => this.retry(item), cancel: () => this.cancel(item) };
    }

    /******************** Event handlers ********************/

    onFileInputChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const files = Array.from(target.files ?? []);
        this.add(
            files.map((file) => ({ file, path: this.relativeFolder((file as any).webkitRelativePath) })),
            event
        );
        target.value = '';
    }

    onTriggerKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.open();
        }
    }

    onDragEnter(event: DragEvent) {
        if (this.$disabled() || !this.hasFiles(event)) {
            return;
        }
        event.preventDefault();
        this.dragDepth++;
        this.dragActive.set(true);
    }

    onDragOver(event: DragEvent) {
        if (this.$disabled() || !this.hasFiles(event)) {
            return;
        }
        event.preventDefault();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'copy';
        }
    }

    onDragLeave(event: DragEvent) {
        if (!this.dragActive()) {
            return;
        }
        this.dragDepth = Math.max(0, this.dragDepth - 1);
        if (this.dragDepth === 0) {
            this.dragActive.set(false);
        }
    }

    async onDrop(event: DragEvent) {
        event.preventDefault();
        this.dragDepth = 0;
        this.dragActive.set(false);
        if (this.$disabled() || !event.dataTransfer) {
            return;
        }
        const entries = Array.from(event.dataTransfer.items ?? [])
            .map((item) => (typeof item.webkitGetAsEntry === 'function' ? item.webkitGetAsEntry() : null))
            .filter((entry): entry is FileSystemEntry => !!entry);
        if (entries.length && entries.some((entry) => entry.isDirectory)) {
            const collected: { file: File; path: string }[] = [];
            await Promise.all(entries.map((entry) => this.walk(entry, '', collected)));
            this.add(collected, event);
        } else {
            this.add(
                Array.from(event.dataTransfer.files).map((file) => ({ file, path: '' })),
                event
            );
        }
    }

    onPaste(event: ClipboardEvent) {
        if (this.$disabled()) {
            return;
        }
        const files = Array.from(event.clipboardData?.files ?? []);
        if (!files.length) {
            return;
        }
        event.preventDefault();
        const stamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
        this.add(
            files.map((file, index) => {
                const generic = !file.name || /^image\.\w+$/.test(file.name);
                const extension = file.type.split('/')[1] ?? 'bin';
                const named = generic ? new File([file], `paste-${stamp}${index ? '-' + index : ''}.${extension}`, { type: file.type }) : file;
                return { file: named, path: '' };
            }),
            event
        );
    }

    /******************** Forms ********************/

    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        const files: File[] = value == null ? [] : Array.isArray(value) ? value : [value];
        const current = this.valueFiles();
        const same = files.length === current.length && files.every((file, index) => file === current[index]);
        if (!same) {
            this.items().forEach((item) => {
                this.abort(item.id);
                this.revoke(item);
            });
            this.items.set(files.filter((file) => typeof File !== 'undefined' && file instanceof File).map((file) => this.createItem(file, '', 'selected')));
        }
        setModelValue(value ?? (this.isMultiple() ? [] : null));
    }

    onDestroy() {
        this.uploads.forEach((upload) => upload.abort());
        this.uploads.clear();
        this.items().forEach((item) => this.revoke(item));
    }

    /******************** Internals ********************/

    private add(entries: { file: File; path: string }[], event?: Event) {
        if (this.$disabled() || !entries.length) {
            return;
        }
        if (!this.isMultiple()) {
            entries = entries.slice(0, 1);
            this.items().forEach((item) => {
                this.abort(item.id);
                this.revoke(item);
            });
            this.items.set([]);
        }

        const uploading = this.canUpload() && this.auto();
        const added: FileInputItem[] = [];
        let counted = this.countedItems().length;
        let total = this.countedItems().reduce((sum, item) => sum + (item.size ?? 0), 0);

        for (const { file, path } of entries) {
            const errorCode = this.validate(file, counted, total);
            const item = this.createItem(file, path, errorCode ? 'invalid' : uploading ? 'queued' : 'selected');
            if (errorCode) {
                item.errorCode = errorCode;
                item.error = this.errorMessage(errorCode, file);
            } else {
                counted++;
                total += file.size;
            }
            added.push(item);
        }

        this.items.update((items) => [...items, ...added]);
        const rejected = added.filter((item) => item.status === 'invalid').length;
        this.announce(format(this.labelOf('addedMessage'), added.length) + (rejected ? ', ' + format(this.labelOf('rejectedMessage'), rejected) : ''));
        this.onSelect.emit({ originalEvent: event, items: added });
        this.emitValue();
        this.onModelTouched();
        this.pump();
    }

    private validate(file: File, counted: number, total: number): FileInputErrorCode | undefined {
        if (!this.isAccepted(file)) return 'type';
        const max = this.maxFileSize();
        if (max !== undefined && file.size > max) return 'maxFileSize';
        const min = this.minFileSize();
        if (min !== undefined && file.size < min) return 'minFileSize';
        const maxFiles = this.maxFiles();
        if (this.isMultiple() && maxFiles !== undefined && counted >= maxFiles) return 'maxFiles';
        const maxTotal = this.maxTotalSize();
        if (maxTotal !== undefined && total + file.size > maxTotal) return 'maxTotalSize';
        return undefined;
    }

    private errorMessage(code: FileInputErrorCode, file: File): string {
        switch (code) {
            case 'maxFileSize':
                return format(this.labelOf('maxFileSizeError'), this.formatSize(file.size), this.formatSize(this.maxFileSize()!));
            case 'minFileSize':
                return format(this.labelOf('minFileSizeError'), this.formatSize(file.size), this.formatSize(this.minFileSize()!));
            case 'maxFiles':
                return format(this.labelOf('maxFilesError'), this.maxFiles()!);
            case 'maxTotalSize':
                return format(this.labelOf('maxTotalSizeError'), this.formatSize(this.maxTotalSize()!));
            case 'upload':
                return this.labelOf('uploadError');
            default:
                return this.labelOf('typeError');
        }
    }

    private isAccepted(file: File): boolean {
        const accept = this.accept();
        if (!accept) {
            return true;
        }
        const name = file.name.toLowerCase();
        const type = (file.type || '').toLowerCase();
        return accept
            .split(',')
            .map((rule) => rule.trim().toLowerCase())
            .filter(Boolean)
            .some((rule) => {
                if (rule.startsWith('.')) return name.endsWith(rule);
                if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
                return type === rule;
            });
    }

    private isImage(type: string, name: string): boolean {
        return type.startsWith('image/') || /\.(png|jpe?g|gif|webp|avif|svg|bmp)$/i.test(name);
    }

    private createItem(file: File, path: string, status: FileInputItem['status']): FileInputItem {
        const item: FileInputItem = {
            id: `${this.uid}_${++fileInputItemId}`,
            file,
            name: file.name,
            path,
            size: file.size,
            type: file.type || '',
            status,
            progress: 0
        };
        if (status !== 'invalid' && this.isImage(item.type, item.name) && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
            item.previewUrl = URL.createObjectURL(file);
        }
        return item;
    }

    private revoke(item: FileInputItem) {
        if (item.previewUrl && typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
            URL.revokeObjectURL(item.previewUrl);
        }
    }

    private valueFiles(): File[] {
        return this.items()
            .filter((item) => item.status !== 'invalid' && item.file)
            .map((item) => item.file!);
    }

    private emitValue() {
        const files = this.valueFiles();
        const value = this.isMultiple() ? files : (files.at(-1) ?? null);
        this.writeModelValue(value);
        this.onModelChange(value);
    }

    private canUpload(): boolean {
        return !!this.uploadHandler() || !!this.url();
    }

    private pump() {
        if (!this.canUpload()) {
            return;
        }
        const limit = Math.max(1, this.concurrency() || 1);
        let running = this.items().filter((item) => item.status === 'uploading').length;
        for (const item of this.items()) {
            if (running >= limit) break;
            if (item.status === 'queued') {
                running++;
                this.batch ??= { uploaded: [], failed: [] };
                this.patch(item.id, { status: 'uploading', progress: 0 });
                this.start(item);
            }
        }
    }

    private start(item: FileInputItem) {
        const handler = this.uploadHandler();
        if (handler) {
            const controller = new AbortController();
            this.uploads.set(item.id, { abort: () => controller.abort() });
            handler(item.file!, { signal: controller.signal, item, progress: (percent) => this.progress(item.id, percent) }).then(
                (response) => !controller.signal.aborted && this.succeed(item.id, response),
                (error) => !controller.signal.aborted && this.fail(item.id, error)
            );
            return;
        }

        if (!this.http) {
            this.fail(item.id, new Error('FileInput: the url input requires provideHttpClient().'));
            return;
        }
        const body = new FormData();
        body.append(this.fieldName(), item.file!, item.name);
        const subscription: Subscription = this.http.request(this.method(), this.url()!, { body, headers: this.headers(), reportProgress: true, observe: 'events', withCredentials: this.withCredentials() }).subscribe({
            next: (event) => {
                if (event.type === HttpEventType.UploadProgress && event.total) {
                    this.progress(item.id, (event.loaded / event.total) * 100);
                } else if (event.type === HttpEventType.Response) {
                    this.succeed(item.id, event.body);
                }
            },
            error: (error) => this.fail(item.id, error)
        });
        this.uploads.set(item.id, { abort: () => subscription.unsubscribe() });
    }

    private progress(id: string, percent: number) {
        const current = this.items().find((item) => item.id === id);
        if (current?.status === 'uploading') {
            this.patch(id, { progress: Math.min(99, Math.max(0, Math.round(percent))) });
        }
    }

    private succeed(id: string, response: any) {
        this.uploads.delete(id);
        const item = this.patch(id, { status: 'uploaded', progress: 100, response });
        if (item) {
            this.batch?.uploaded.push(item);
            this.onUpload.emit({ item, response });
            this.announce(format(this.labelOf('uploadedMessage'), item.name));
        }
        this.afterUpload();
    }

    private fail(id: string, error: any) {
        this.uploads.delete(id);
        const item = this.patch(id, { status: 'failed', progress: 0, errorCode: 'upload', error: this.labelOf('uploadError') });
        if (item) {
            this.batch?.failed.push(item);
            this.onError.emit({ item, error });
            this.announce(format(this.labelOf('failedMessage'), item.name));
        }
        this.afterUpload();
    }

    private afterUpload() {
        this.pump();
        const busy = this.items().some((item) => item.status === 'uploading' || item.status === 'queued');
        if (!busy && this.batch) {
            const batch = this.batch;
            this.batch = null;
            this.onComplete.emit(batch);
        }
    }

    private abort(id: string) {
        this.uploads.get(id)?.abort();
        this.uploads.delete(id);
    }

    private patch(id: string, changes: Partial<FileInputItem>): FileInputItem | undefined {
        let updated: FileInputItem | undefined;
        this.items.update((items) =>
            items.map((item) => {
                if (item.id !== id) return item;
                updated = { ...item, ...changes };
                return updated;
            })
        );
        return updated;
    }

    private announce(message: string) {
        this.announcement.set(message);
    }

    private restoreFocus() {
        setTimeout(() => {
            const host = this.el.nativeElement as HTMLElement;
            if (host.contains(this.document.activeElement) && this.document.activeElement !== this.document.body) {
                return;
            }
            const target = host.querySelector<HTMLElement>('.p-fileinput-action, .p-fileinput-add, .p-fileinput-dropzone, .p-fileinput-avatar');
            target?.focus();
        });
    }

    private hasFiles(event: DragEvent): boolean {
        return Array.from(event.dataTransfer?.types ?? []).includes('Files');
    }

    private relativeFolder(relativePath: string | undefined): string {
        if (!relativePath) return '';
        const index = relativePath.lastIndexOf('/');
        return index > 0 ? relativePath.slice(0, index + 1) : '';
    }

    private async walk(entry: FileSystemEntry, prefix: string, out: { file: File; path: string }[]): Promise<void> {
        if (entry.isFile) {
            await new Promise<void>((resolve) =>
                (entry as FileSystemFileEntry).file(
                    (file) => {
                        out.push({ file, path: prefix });
                        resolve();
                    },
                    () => resolve()
                )
            );
        } else if (entry.isDirectory) {
            const reader = (entry as FileSystemDirectoryEntry).createReader();
            let batch: FileSystemEntry[];
            do {
                batch = await new Promise<FileSystemEntry[]>((resolve) => reader.readEntries(resolve, () => resolve([])));
                await Promise.all(batch.map((child) => this.walk(child, `${prefix}${entry.name}/`, out)));
            } while (batch.length);
        }
    }
}

@NgModule({
    imports: [FileInput, SharedModule],
    exports: [FileInput, SharedModule]
})
export class FileInputModule {}
