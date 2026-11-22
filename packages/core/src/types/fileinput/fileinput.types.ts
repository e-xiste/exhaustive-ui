import { TemplateRef } from '@angular/core';
import { PassThrough, PassThroughOption } from '@exhaustive-ui/core/api';

/**
 * Custom passthrough(pt) options.
 * @template I Type of instance.
 *
 * @see {@link FileInput.pt}
 * @group Interface
 */
export interface FileInputPassThroughOptions<I = unknown> {
    /**
     * Used to pass attributes to the root's DOM element.
     */
    root?: PassThroughOption<HTMLElement, I>;
    /**
     * Used to pass attributes to the hidden file input's DOM element.
     */
    input?: PassThroughOption<HTMLInputElement, I>;
    /**
     * Used to pass attributes to the dropzone's DOM element.
     */
    dropzone?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the dropzone icon's DOM element.
     */
    dropzoneIcon?: PassThroughOption<SVGElement, I>;
    /**
     * Used to pass attributes to the dropzone label's DOM element.
     */
    label?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the hint's DOM element.
     */
    hint?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the upload summary's DOM element.
     */
    summary?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the file list's DOM element.
     */
    list?: PassThroughOption<HTMLUListElement, I>;
    /**
     * Used to pass attributes to a file row's DOM element.
     */
    item?: PassThroughOption<HTMLLIElement, I>;
    /**
     * Used to pass attributes to a thumbnail's DOM element.
     */
    thumbnail?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to a file name's DOM element.
     */
    name?: PassThroughOption<HTMLSpanElement, I>;
    /**
     * Used to pass attributes to the size and status line's DOM element.
     */
    meta?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to a progress bar's DOM element.
     */
    progress?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to the actions container of a row or tile.
     */
    actions?: PassThroughOption<HTMLDivElement, I>;
    /**
     * Used to pass attributes to an action button's DOM element.
     */
    action?: PassThroughOption<HTMLButtonElement | HTMLAnchorElement, I>;
    /**
     * Used to pass attributes to the image grid's DOM element.
     */
    grid?: PassThroughOption<HTMLUListElement, I>;
    /**
     * Used to pass attributes to an image tile's DOM element.
     */
    tile?: PassThroughOption<HTMLLIElement, I>;
    /**
     * Used to pass attributes to the add tile's DOM element.
     */
    add?: PassThroughOption<HTMLButtonElement, I>;
    /**
     * Used to pass attributes to the avatar's DOM element.
     */
    avatar?: PassThroughOption<HTMLDivElement, I>;
}

/**
 * Defines valid pass-through options in FileInput component.
 * @see {@link FileInputPassThroughOptions}
 *
 * @template I Type of instance.
 */
export type FileInputPassThrough<I = unknown> = PassThrough<I, FileInputPassThroughOptions<I>>;

/**
 * Layout of the component.
 * - `list`: a dropzone above a list of files.
 * - `images`: a grid of square thumbnails with an add tile.
 * - `avatar`: a single clickable image, for a profile picture or a logo.
 * @group Types
 */
export type FileInputVariant = 'list' | 'images' | 'avatar';

/**
 * Status of a file.
 * - `selected`: accepted, no upload configured.
 * - `queued`: waiting for a free upload slot.
 * - `uploading`: being uploaded.
 * - `uploaded`: uploaded.
 * - `failed`: the upload failed; it can be retried.
 * - `canceled`: the upload was canceled; it can be retried.
 * - `invalid`: rejected by a validation rule; it is not part of the value.
 * - `existing`: a file already stored on the server, passed through the `existing` input.
 * @group Types
 */
export type FileInputStatus = 'selected' | 'queued' | 'uploading' | 'uploaded' | 'failed' | 'canceled' | 'invalid' | 'existing';

/**
 * Validation rule a file broke, or `upload` when the upload failed.
 * @group Types
 */
export type FileInputErrorCode = 'type' | 'maxFileSize' | 'minFileSize' | 'maxFiles' | 'maxTotalSize' | 'upload';

/**
 * A file shown by the component.
 * @group Interface
 */
export interface FileInputItem {
    /**
     * Unique identifier of the item.
     */
    id: string;
    /**
     * The selected file. Undefined for an existing file.
     */
    file?: File;
    /**
     * File name.
     */
    name: string;
    /**
     * Folder of the file relative to a dropped folder, ending with a slash. Empty when the file was not in a folder.
     */
    path: string;
    /**
     * Size in bytes, when known.
     */
    size?: number;
    /**
     * MIME type, when known.
     */
    type: string;
    /**
     * Current status.
     */
    status: FileInputStatus;
    /**
     * Upload progress, from 0 to 100.
     */
    progress: number;
    /**
     * Rule the file broke, or `upload` when the upload failed.
     */
    errorCode?: FileInputErrorCode;
    /**
     * Message shown for the error.
     */
    error?: string;
    /**
     * Response returned by the upload.
     */
    response?: any;
    /**
     * URL of the image preview, for images.
     */
    previewUrl?: string;
    /**
     * The existing file this item stands for, when status is `existing`.
     */
    existing?: FileInputExistingFile;
}

/**
 * A file already stored on the server.
 * @group Interface
 */
export interface FileInputExistingFile {
    /**
     * Identifier of the file on the server.
     */
    id?: any;
    /**
     * File name.
     */
    name: string;
    /**
     * Size in bytes.
     */
    size?: number;
    /**
     * MIME type.
     */
    type?: string;
    /**
     * Download URL. When set, a download button is shown.
     */
    url?: string;
    /**
     * Thumbnail URL, for images. Falls back to `url` for image types.
     */
    thumbnail?: string;
}

/**
 * Context passed to an upload handler.
 * @group Interface
 */
export interface FileInputUploadContext {
    /**
     * Signal aborted when the user cancels the upload or removes the file.
     */
    signal: AbortSignal;
    /**
     * Reports the progress of the upload, from 0 to 100.
     */
    progress: (percent: number) => void;
    /**
     * The item being uploaded.
     */
    item: FileInputItem;
}

/**
 * Function that uploads one file. Resolve with the server response, reject to mark the upload as failed.
 * @group Types
 */
export type FileInputUploadHandler = (file: File, context: FileInputUploadContext) => Promise<any>;

/**
 * Texts of the component. Placeholders such as `{0}` are replaced with values.
 * @group Interface
 */
export interface FileInputLabels {
    /** Dropzone text before the browse link. */
    dropzone: string;
    /** Browse link of the dropzone. */
    browse: string;
    /** Add tile of the images variant. */
    add: string;
    /** Avatar overlay when there is no image. */
    avatarAdd: string;
    /** Avatar overlay when there is an image. */
    avatarChange: string;
    /** Badge of the first image in the images variant. */
    cover: string;
    /** Remove button. */
    remove: string;
    /** Cancel button of an upload. */
    cancel: string;
    /** Retry button of a failed or canceled upload. */
    retry: string;
    /** Download button of an existing file. */
    download: string;
    /** Delete button of an existing file. */
    delete: string;
    /** Status of a queued file. */
    queued: string;
    /** Status of an uploaded file. */
    uploaded: string;
    /** Status of a canceled upload. */
    canceled: string;
    /** Summary of the uploads: `{0}` uploaded files, `{1}` files, `{2}` uploaded size, `{3}` total size. */
    summary: string;
    /** Error of a file type that is not accepted. */
    typeError: string;
    /** Error of a file that is too large: `{0}` file size, `{1}` maximum. */
    maxFileSizeError: string;
    /** Error of a file that is too small: `{0}` file size, `{1}` minimum. */
    minFileSizeError: string;
    /** Error when the file limit is reached: `{0}` limit. */
    maxFilesError: string;
    /** Error when the total size limit is exceeded: `{0}` limit. */
    maxTotalSizeError: string;
    /** Error of a failed upload. */
    uploadError: string;
    /** Announcement when files are added: `{0}` count. */
    addedMessage: string;
    /** Announcement when files are rejected: `{0}` count. */
    rejectedMessage: string;
    /** Announcement when a file is uploaded: `{0}` name. */
    uploadedMessage: string;
    /** Announcement when an upload fails: `{0}` name. */
    failedMessage: string;
    /** Announcement when a file is removed: `{0}` name. */
    removedMessage: string;
    /** Accessible label of the file list. */
    listLabel: string;
}

/**
 * Custom select event.
 * @see {@link FileInput.onSelect}
 * @group Events
 */
export interface FileInputSelectEvent {
    /**
     * Browser event.
     */
    originalEvent?: Event;
    /**
     * Items added, including the invalid ones.
     */
    items: FileInputItem[];
}

/**
 * Custom item event.
 * @see {@link FileInput.onRemove}
 * @see {@link FileInput.onCancel}
 * @group Events
 */
export interface FileInputItemEvent {
    /**
     * The item.
     */
    item: FileInputItem;
}

/**
 * Custom upload event.
 * @see {@link FileInput.onUpload}
 * @group Events
 */
export interface FileInputUploadEvent {
    /**
     * The uploaded item.
     */
    item: FileInputItem;
    /**
     * Response of the upload.
     */
    response: any;
}

/**
 * Custom error event.
 * @see {@link FileInput.onError}
 * @group Events
 */
export interface FileInputErrorEvent {
    /**
     * The item that failed.
     */
    item: FileInputItem;
    /**
     * The error raised by the upload.
     */
    error: any;
}

/**
 * Custom complete event, emitted when the last upload of a batch ends.
 * @see {@link FileInput.onComplete}
 * @group Events
 */
export interface FileInputCompleteEvent {
    /**
     * Uploaded items.
     */
    uploaded: FileInputItem[];
    /**
     * Failed items.
     */
    failed: FileInputItem[];
}

/**
 * Custom remove existing event.
 * @see {@link FileInput.onRemoveExisting}
 * @group Events
 */
export interface FileInputRemoveExistingEvent {
    /**
     * The existing file the user removed.
     */
    file: FileInputExistingFile;
}

/**
 * Context of the dropzone template.
 * @group Interface
 */
export interface FileInputDropzoneTemplateContext {
    /**
     * Opens the file picker.
     */
    open: () => void;
    /**
     * Whether files are dragged over the dropzone.
     */
    active: boolean;
}

/**
 * Context of the item template.
 * @group Interface
 */
export interface FileInputItemTemplateContext {
    /**
     * The item.
     */
    $implicit: FileInputItem;
    /**
     * Removes the item.
     */
    remove: () => void;
    /**
     * Retries the upload of the item.
     */
    retry: () => void;
    /**
     * Cancels the upload of the item.
     */
    cancel: () => void;
}

/**
 * Defines valid templates in FileInput.
 * @group Templates
 */
export interface FileInputTemplates {
    /**
     * Custom content of the dropzone.
     * @param {FileInputDropzoneTemplateContext} context - dropzone context.
     */
    dropzone(context: FileInputDropzoneTemplateContext): TemplateRef<FileInputDropzoneTemplateContext>;
    /**
     * Custom row of the list variant.
     * @param {FileInputItemTemplateContext} context - item context.
     */
    item(context: FileInputItemTemplateContext): TemplateRef<FileInputItemTemplateContext>;
}
