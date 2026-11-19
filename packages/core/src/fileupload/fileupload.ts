import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import {
    afterEveryRender,
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    InjectionToken,
    input,
    NgModule,
    NgZone,
    numberAttribute,
    output,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    contentChild,
    viewChild,
    contentChildren
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { addClass, removeClass } from '@exhaustive-ui/utils';
import { BlockableUI, PrimeTemplate, SharedModule, TranslationKeys } from '@exhaustive-ui/core/api';
import { Badge } from '@exhaustive-ui/core/badge';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { Button, ButtonProps } from '@exhaustive-ui/core/button';
import { PlusIcon, TimesIcon, UploadIcon } from '@exhaustive-ui/core/icons';
import { Message } from '@exhaustive-ui/core/message';
import { ProgressBar } from '@exhaustive-ui/core/progressbar';
import { VoidListener } from '@exhaustive-ui/core/ts-helpers';
import type { BadgeSeverity } from '@exhaustive-ui/core/types/badge';
import {
    FileBeforeUploadEvent,
    FileProgressEvent,
    FileRemoveEvent,
    FileSelectEvent,
    FileSendEvent,
    FileUploadContentTemplateContext,
    FileUploadErrorEvent,
    FileUploadEvent,
    FileUploadFileLabelTemplateContext,
    FileUploadHandlerEvent,
    FileUploadHeaderTemplateContext,
    FileUploadPassThrough,
    RemoveUploadedFileEvent
} from '@exhaustive-ui/core/types/fileupload';
import { FileUploadStyle } from './style/fileuploadstyle';

const FILEUPLOAD_INSTANCE = new InjectionToken<FileUpload>('FILEUPLOAD_INSTANCE');

@Component({
    selector: '[pFileContent]',
    template: `@for (file of files(); track file?.name + '-' + $index; let index = $index) {
        <div [class]="cx('file')" [pBind]="$pcFileUpload.ptm('file')">
            <img role="presentation" [class]="cx('fileThumbnail')" [attr.alt]="file.name" [src]="file.objectURL" [width]="previewWidth()" [pBind]="$pcFileUpload.ptm('fileThumbnail')" />
            <div [class]="cx('fileInfo')" [pBind]="$pcFileUpload.ptm('fileInfo')">
                <div [class]="cx('fileName')" [pBind]="$pcFileUpload.ptm('fileName')">{{ file.name }}</div>
                <span [class]="cx('fileSize')" [pBind]="$pcFileUpload.ptm('fileSize')">{{ formatSize(file.size) }}</span>
            </div>
            <p-badge [value]="badgeValue()" [severity]="badgeSeverity()" [class]="cx('pcFileBadge')" [pt]="$pcFileUpload.ptm('pcFileBadge')" [unstyled]="unstyled()" />
            <div [class]="cx('fileActions')" [pBind]="$pcFileUpload.ptm('fileActions')">
                <p-button (onClick)="onRemoveClick($event, index)" [styleClass]="cx('pcFileRemoveButton')" text rounded severity="danger" [pt]="$pcFileUpload.ptm('pcFileRemoveButton')" [unstyled]="unstyled()">
                    <ng-template #icon let-iconClass="class">
                        @if (fileRemoveIconTemplate()) {
                            <ng-template *ngTemplateOutlet="fileRemoveIconTemplate(); context: { class: iconClass, file: file, index: index }"></ng-template>
                        } @else {
                            <svg data-p-icon="times" [class]="iconClass" [attr.aria-hidden]="true" />
                        }
                    </ng-template>
                </p-button>
            </div>
        </div>
    }`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FileUploadStyle],
    imports: [CommonModule, Badge, Button, TimesIcon, Bind]
})
export class FileContent extends BaseComponent {
    _componentStyle = inject(FileUploadStyle);

    $pcFileUpload = inject(FILEUPLOAD_INSTANCE);

    onRemove = output<any>();

    files = input<any>();

    badgeSeverity = input<BadgeSeverity>('warn');

    badgeValue = input<string>();

    previewWidth = input<number>(50);

    fileRemoveIconTemplate = input<any>();

    onRemoveClick(event: any, index: number) {
        this.onRemove.emit({ event, index });
    }

    formatSize(bytes: number) {
        const k = 1024;
        const dm = 3;
        const sizes = this.config.getTranslation(TranslationKeys.FILE_SIZE_TYPES);

        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = (bytes / Math.pow(k, i)).toFixed(dm);

        return `${formattedSize} ${sizes[i]}`;
    }
}
/**
 * FileUpload is an advanced uploader with dragdrop support, multi file uploads, auto uploading, progress tracking and validations.
 * @group Components
 */
@Component({
    selector: 'p-fileupload, p-fileUpload',
    imports: [CommonModule, Button, ProgressBar, Message, PlusIcon, UploadIcon, TimesIcon, SharedModule, FileContent, Bind],
    template: `
        <div [class]="cn(cx('root'), styleClass())" [ngStyle]="style()" *ngIf="mode() === 'advanced'" [pBind]="ptm('root')">
            <input
                [attr.aria-label]="browseFilesLabel()"
                #advancedfileinput
                type="file"
                (change)="onFileSelect($event)"
                [multiple]="multiple()"
                [accept]="accept()"
                [disabled]="disabled() || isChooseDisabled()"
                [attr.title]="''"
                [pBind]="ptm('input')"
            />
            <div [class]="cx('header')" [pBind]="ptm('header')">
                <ng-container *ngIf="!headerTemplate() && !_headerTemplate()">
                    <p-button
                        [styleClass]="cn(cx('pcChooseButton'), chooseStyleClass())"
                        [disabled]="disabled() || isChooseDisabled()"
                        (focus)="onFocus()"
                        [label]="chooseButtonLabel()"
                        (blur)="onBlur()"
                        (onClick)="choose()"
                        (keydown.enter)="choose()"
                        [buttonProps]="chooseButtonProps()"
                        [pt]="ptm('pcChooseButton')"
                        [unstyled]="unstyled()"
                    >
                        <input
                            [attr.aria-label]="browseFilesLabel()"
                            #advancedfileinput
                            type="file"
                            (change)="onFileSelect($event)"
                            [multiple]="multiple()"
                            [accept]="accept()"
                            [disabled]="disabled() || isChooseDisabled()"
                            [attr.title]="''"
                            [pBind]="ptm('input')"
                        />
                        <ng-template #icon>
                            <span *ngIf="chooseIcon()" [class]="chooseIcon()" [attr.aria-label]="true" [pBind]="ptm('pcChooseButton')?.icon"></span>
                            <ng-container *ngIf="!chooseIcon()">
                                <svg data-p-icon="plus" *ngIf="!chooseIconTemplate() && !_chooseIconTemplate()" [attr.aria-label]="true" [pBind]="ptm('pcChooseButton')?.icon" />
                                <span *ngIf="chooseIconTemplate() || _chooseIconTemplate()" [attr.aria-label]="true" [pBind]="ptm('pcChooseButton')?.icon">
                                    <ng-template *ngTemplateOutlet="chooseIconTemplate() || _chooseIconTemplate()"></ng-template>
                                </span>
                            </ng-container>
                        </ng-template>
                    </p-button>

                    <p-button
                        *ngIf="!auto() && showUploadButton()"
                        [label]="uploadButtonLabel()"
                        (onClick)="upload()"
                        [disabled]="!hasFiles() || isFileLimitExceeded()"
                        [styleClass]="cn(cx('pcUploadButton'), uploadStyleClass())"
                        [buttonProps]="uploadButtonProps()"
                        [pt]="ptm('pcUploadButton')"
                        [unstyled]="unstyled()"
                    >
                        <ng-template #icon>
                            <span *ngIf="uploadIcon()" [ngClass]="uploadIcon()" [attr.aria-hidden]="true" [pBind]="ptm('pcUploadButton')?.icon"></span>
                            <ng-container *ngIf="!uploadIcon()">
                                <svg data-p-icon="upload" *ngIf="!uploadIconTemplate() && !_uploadIconTemplate()" [pBind]="ptm('pcUploadButton')?.icon" />
                                <span *ngIf="uploadIconTemplate() || _uploadIconTemplate()" [attr.aria-hidden]="true" [pBind]="ptm('pcUploadButton')?.icon">
                                    <ng-template *ngTemplateOutlet="uploadIconTemplate() || _uploadIconTemplate()"></ng-template>
                                </span>
                            </ng-container>
                        </ng-template>
                    </p-button>
                    <p-button
                        *ngIf="!auto() && showCancelButton()"
                        [label]="cancelButtonLabel()"
                        (onClick)="clear()"
                        [disabled]="!hasFiles() || uploading()"
                        [styleClass]="cn(cx('pcCancelButton'), cancelStyleClass())"
                        [buttonProps]="cancelButtonProps()"
                        [pt]="ptm('pcCancelButton')"
                        [unstyled]="unstyled()"
                    >
                        <ng-template #icon>
                            <span *ngIf="cancelIcon()" [ngClass]="cancelIcon()"></span>
                            <ng-container *ngIf="!cancelIcon()">
                                <svg data-p-icon="times" *ngIf="!cancelIconTemplate() && !_cancelIconTemplate()" [attr.aria-hidden]="true" />
                                <span *ngIf="cancelIconTemplate() || _cancelIconTemplate()" [attr.aria-hidden]="true">
                                    <ng-template *ngTemplateOutlet="cancelIconTemplate() || _cancelIconTemplate()"></ng-template>
                                </span>
                            </ng-container>
                        </ng-template>
                    </p-button>
                </ng-container>
                <ng-container
                    *ngTemplateOutlet="
                        headerTemplate() || _headerTemplate();
                        context: {
                            $implicit: _files(),
                            uploadedFiles: uploadedFiles(),
                            chooseCallback: choose.bind(this),
                            clearCallback: clear.bind(this),
                            uploadCallback: upload.bind(this)
                        }
                    "
                ></ng-container>
                <ng-container *ngTemplateOutlet="toolbarTemplate() || _toolbarTemplate()"></ng-container>
            </div>
            <div #content [class]="cx('content')" (dragenter)="onDragEnter($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)" [pBind]="ptm('content')">
                @if (contentTemplate() || _contentTemplate()) {
                    <ng-container
                        *ngTemplateOutlet="
                            contentTemplate() || _contentTemplate();
                            context: {
                                $implicit: _files(),
                                uploadedFiles: uploadedFiles(),
                                chooseCallback: choose.bind(this),
                                clearCallback: clear.bind(this),
                                removeUploadedFileCallback: removeUploadedFile.bind(this),
                                removeFileCallback: remove.bind(this),
                                progress: progress(),
                                messages: msgs()
                            }
                        "
                    ></ng-container>
                } @else {
                    <p-progressbar [value]="progress()" [showValue]="false" *ngIf="hasFiles()" [pt]="ptm('pcProgressBar')"></p-progressbar>
                    @for (message of msgs(); track message) {
                        <p-message [severity]="message.severity" [text]="message.text" [pt]="ptm('pcMessage')" [unstyled]="unstyled()"></p-message>
                    }

                    @if (hasFiles()) {
                        <div [class]="cx('fileList')" [pBind]="ptm('fileList')">
                            <ng-template ngFor [ngForOf]="_files()" [ngForTemplate]="fileTemplate() || _fileTemplate()"></ng-template>
                            @if (!fileTemplate() && !_fileTemplate()) {
                                <div
                                    pFileContent
                                    [unstyled]="unstyled()"
                                    [files]="_files()"
                                    (onRemove)="onRemoveClick($event)"
                                    [badgeValue]="pendingLabel()"
                                    [previewWidth]="previewWidth()"
                                    [fileRemoveIconTemplate]="cancelIconTemplate() || _cancelIconTemplate()"
                                ></div>
                            }
                        </div>
                    }
                    @if (hasUploadedFiles()) {
                        <div [class]="cx('fileList')" [pBind]="ptm('fileList')">
                            <ng-template ngFor [ngForOf]="uploadedFiles()" [ngForTemplate]="fileTemplate() || _fileTemplate()"></ng-template>
                            @if (!fileTemplate() && !_fileTemplate()) {
                                <div
                                    pFileContent
                                    [unstyled]="unstyled()"
                                    [files]="uploadedFiles()"
                                    (onRemove)="onRemoveUploadedFileClick($event)"
                                    [badgeValue]="completedLabel()"
                                    badgeSeverity="success"
                                    [previewWidth]="previewWidth()"
                                    [fileRemoveIconTemplate]="cancelIconTemplate() || _cancelIconTemplate()"
                                ></div>
                            }
                        </div>
                    }
                }
                @if ((emptyTemplate() || _emptyTemplate()) && !hasFiles() && !hasUploadedFiles()) {
                    <ng-container *ngTemplateOutlet="emptyTemplate() || _emptyTemplate()" [pBind]="ptm('empty')"></ng-container>
                }
            </div>
        </div>
        <div [class]="cn(cx('root'), styleClass())" *ngIf="mode() === 'basic'" [pBind]="ptm('root')">
            @for (message of msgs(); track message) {
                <p-message [severity]="message.severity" [text]="message.text" [pt]="ptm('pcMessage')" [unstyled]="unstyled()"></p-message>
            }

            <div [class]="cx('basicContent')" [pBind]="ptm('basicContent')">
                <p-button
                    [styleClass]="cn(cx('pcChooseButton'), chooseStyleClass())"
                    [disabled]="disabled()"
                    [label]="chooseButtonLabel()"
                    [style]="style()"
                    (onClick)="onBasicUploaderClick()"
                    (keydown)="onBasicKeydown($event)"
                    [buttonProps]="chooseButtonProps()"
                    [pt]="ptm('pcChooseButton')"
                    [unstyled]="unstyled()"
                >
                    <ng-template #icon>
                        @if (hasFiles() && !auto()) {
                            <span *ngIf="uploadIcon()" class="p-button-icon p-button-icon-left" [ngClass]="uploadIcon()" [pBind]="ptm('pcChooseButton')?.icon"></span>
                            <ng-container *ngIf="!uploadIcon()">
                                <svg data-p-icon="upload" *ngIf="!uploadIconTemplate() && !_uploadIconTemplate()" [class]="'p-button-icon p-button-icon-left'" [pBind]="ptm('pcChooseButton')?.icon" />
                                <span *ngIf="_uploadIconTemplate() || uploadIconTemplate()" class="p-button-icon p-button-icon-left" [pBind]="ptm('pcChooseButton')?.icon">
                                    <ng-template *ngTemplateOutlet="_uploadIconTemplate() || uploadIconTemplate()"></ng-template>
                                </span>
                            </ng-container>
                        } @else {
                            <span *ngIf="chooseIcon()" class="p-button-icon p-button-icon-left pi" [ngClass]="chooseIcon()" [pBind]="ptm('pcChooseButton')?.icon"></span>
                            <ng-container *ngIf="!chooseIcon()">
                                <svg data-p-icon="plus" *ngIf="!chooseIconTemplate() && !_chooseIconTemplate()" [pBind]="ptm('pcChooseButton')?.icon" />
                                <ng-template *ngTemplateOutlet="chooseIconTemplate() || _chooseIconTemplate()"></ng-template>
                            </ng-container>
                        }
                    </ng-template>
                    <input
                        [attr.aria-label]="browseFilesLabel()"
                        #basicfileinput
                        type="file"
                        [accept]="accept()"
                        [multiple]="multiple()"
                        [disabled]="disabled()"
                        (change)="onFileSelect($event)"
                        (focus)="onFocus()"
                        (blur)="onBlur()"
                        [pBind]="ptm('input')"
                    />
                </p-button>
                @if (!auto()) {
                    @if (!fileLabelTemplate() && !_fileLabelTemplate()) {
                        <span>
                            {{ basicFileChosenLabel() }}
                        </span>
                    } @else {
                        <ng-container *ngTemplateOutlet="fileLabelTemplate() || _fileLabelTemplate(); context: { $implicit: _files() }"></ng-container>
                    }
                }
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [FileUploadStyle, { provide: FILEUPLOAD_INSTANCE, useExisting: FileUpload }, { provide: PARENT_INSTANCE, useExisting: FileUpload }],
    hostDirectives: [Bind]
})
export class FileUpload extends BaseComponent<FileUploadPassThrough> implements BlockableUI {
    componentName = 'FileUpload';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptm('host')));
        afterNextRender(() => {
            if (isPlatformBrowser(this.platformId)) {
                if (this.mode() === 'advanced') {
                    this.zone.runOutsideAngular(() => {
                        const content = this.content();
                        if (content) {
                            this.dragOverListener.set(this.renderer.listen(content.nativeElement, 'dragover', this.onDragOver.bind(this)));
                        }
                    });
                }
            }
        });
        effect(() => {
            const files = this.files();
            if (files !== undefined) {
                untracked(() => {
                    const validFiles: File[] = [];

                    for (let i = 0; i < files.length; i++) {
                        let file = files[i];

                        if (this.validate(file)) {
                            if (this.isImage(file)) {
                                (<any>file).objectURL = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(files[i]));
                            }

                            validFiles.push(files[i]);
                        }
                    }

                    this._files.set(validFiles);
                });
            }
        });
    }

    /**
     * Name of the request parameter to identify the files at backend.
     * @group Props
     */
    readonly name = input<string | undefined>();
    /**
     * Remote url to upload the files.
     * @group Props
     */
    readonly url = input<string | undefined>();
    /**
     * HTTP method to send the files to the url such as "post" and "put".
     * @group Props
     */
    readonly method = input<'post' | 'put' | undefined>('post');
    /**
     * Used to select multiple files at once from file dialog.
     * @group Props
     */
    readonly multiple = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Comma-separated list of pattern to restrict the allowed file types. Can be any combination of either the MIME types (such as "image/*") or the file extensions (such as ".jpg").
     * @group Props
     */
    readonly accept = input<string | undefined>();
    /**
     * Disables the upload functionality.
     * @group Props
     */
    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When enabled, upload begins automatically after selection is completed.
     * @group Props
     */
    readonly auto = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates.
     * @group Props
     */
    readonly withCredentials = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Maximum file size allowed in bytes.
     * @group Props
     */
    readonly maxFileSize = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * Summary message of the invalid file size.
     * @group Props
     */
    readonly invalidFileSizeMessageSummary = input<string>('{0}: Invalid file size, ');
    /**
     * Detail message of the invalid file size.
     * @group Props
     */
    readonly invalidFileSizeMessageDetail = input<string>('maximum upload size is {0}.');
    /**
     * Summary message of the invalid file type.
     * @group Props
     */
    readonly invalidFileTypeMessageSummary = input<string>('{0}: Invalid file type, ');
    /**
     * Detail message of the invalid file type.
     * @group Props
     */
    readonly invalidFileTypeMessageDetail = input<string>('allowed file types: {0}.');
    /**
     * Detail message of the invalid file type.
     * @group Props
     */
    readonly invalidFileLimitMessageDetail = input<string>('limit is {0} at most.');
    /**
     * Summary message of the invalid file type.
     * @group Props
     */
    readonly invalidFileLimitMessageSummary = input<string>('Maximum number of files exceeded, ');
    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Class of the element.
     * @group Props
     */
    readonly styleClass = input<string | undefined>();
    /**
     * Width of the image thumbnail in pixels.
     * @group Props
     */
    readonly previewWidth = input<number, unknown>(50, { transform: numberAttribute });
    /**
     * Label of the choose button. Defaults to Exhaustive Locale configuration.
     * @group Props
     */
    readonly chooseLabel = input<string | undefined>();
    /**
     * Label of the upload button. Defaults to Exhaustive Locale configuration.
     * @group Props
     */
    readonly uploadLabel = input<string | undefined>();
    /**
     * Label of the cancel button. Defaults to Exhaustive Locale configuration.
     * @group Props
     */
    readonly cancelLabel = input<string | undefined>();
    /**
     * Icon of the choose button.
     * @group Props
     */
    readonly chooseIcon = input<string | undefined>();
    /**
     * Icon of the upload button.
     * @group Props
     */
    readonly uploadIcon = input<string | undefined>();
    /**
     * Icon of the cancel button.
     * @group Props
     */
    readonly cancelIcon = input<string | undefined>();
    /**
     * Whether to show the upload button.
     * @group Props
     */
    readonly showUploadButton = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether to show the cancel button.
     * @group Props
     */
    readonly showCancelButton = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Defines the UI of the component.
     * @group Props
     */
    readonly mode = input<'advanced' | 'basic' | undefined>('advanced');
    /**
     * HttpHeaders class represents the header configuration options for an HTTP request.
     * @group Props
     */
    readonly headers = input<HttpHeaders | undefined>();
    /**
     * Whether to use the default upload or a manual implementation defined in uploadHandler callback. Defaults to Exhaustive Locale configuration.
     * @group Props
     */
    readonly customUpload = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Maximum number of files that can be uploaded.
     * @group Props
     */
    readonly fileLimit = input<number | undefined, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });
    /**
     * Style class of the upload button.
     * @group Props
     */
    readonly uploadStyleClass = input<string | undefined>();
    /**
     * Style class of the cancel button.
     * @group Props
     */
    readonly cancelStyleClass = input<string | undefined>();
    /**
     * Style class of the choose button.
     * @group Props
     */
    readonly chooseStyleClass = input<string | undefined>();
    /**
     * Used to pass all properties of the ButtonProps to the choose button inside the component.
     * @group Props
     */
    readonly chooseButtonProps = input<ButtonProps>();
    /**
     * Used to pass all properties of the ButtonProps to the upload button inside the component.
     * @group Props
     */
    readonly uploadButtonProps = input<ButtonProps>({ severity: 'secondary' });
    /**
     * Used to pass all properties of the ButtonProps to the cancel button inside the component.
     * @group Props
     */
    readonly cancelButtonProps = input<ButtonProps>({ severity: 'secondary' });
    /**
     * Callback to invoke before file upload is initialized.
     * @param {FileBeforeUploadEvent} event - Custom upload event.
     * @group Emits
     */
    readonly onBeforeUpload = output<FileBeforeUploadEvent>();
    /**
     * An event indicating that the request was sent to the server. Useful when a request may be retried multiple times, to distinguish between retries on the final event stream.
     * @param {FileSendEvent} event - Custom send event.
     * @group Emits
     */
    readonly onSend = output<FileSendEvent>();
    /**
     * Callback to invoke when file upload is complete.
     * @param {FileUploadEvent} event - Custom upload event.
     * @group Emits
     */
    readonly onUpload = output<FileUploadEvent>();
    /**
     * Callback to invoke if file upload fails.
     * @param {FileUploadErrorEvent} event - Custom error event.
     * @group Emits
     */
    readonly onError = output<FileUploadErrorEvent>();
    /**
     * Callback to invoke when files in queue are removed without uploading using clear all button.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onClear = output<Event | undefined>();
    /**
     * Callback to invoke when a file is removed without uploading using clear button of a file.
     * @param {FileRemoveEvent} event - Remove event.
     * @group Emits
     */
    readonly onRemove = output<FileRemoveEvent>();
    /**
     * Callback to invoke when files are selected.
     * @param {FileSelectEvent} event - Select event.
     * @group Emits
     */
    readonly onSelect = output<FileSelectEvent>();
    /**
     * Callback to invoke when files are being uploaded.
     * @param {FileProgressEvent} event - Progress event.
     * @group Emits
     */
    readonly onProgress = output<FileProgressEvent>();
    /**
     * Callback to invoke in custom upload mode to upload the files manually.
     * @param {FileUploadHandlerEvent} event - Upload handler event.
     * @group Emits
     */
    readonly uploadHandler = output<FileUploadHandlerEvent>();
    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onImageError = output<Event>();
    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {RemoveUploadedFileEvent} event - Remove event.
     * @group Emits
     */
    readonly onRemoveUploadedFile = output<RemoveUploadedFileEvent>();

    /**
     * Custom file template.
     * @group Templates
     */
    readonly fileTemplate = contentChild<TemplateRef<void>>('file', { descendants: false });

    /**
     * Custom header template.
     * @param {FileUploadHeaderTemplateContext} context - header template context.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<FileUploadHeaderTemplateContext>>('header', { descendants: false });

    /**
     * Custom content template.
     * @param {FileUploadContentTemplateContext} context - content template context.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<FileUploadContentTemplateContext>>('content', { descendants: false });

    /**
     * Custom toolbar template.
     * @group Templates
     */
    readonly toolbarTemplate = contentChild<TemplateRef<void>>('toolbar', { descendants: false });

    /**
     * Custom choose icon template.
     * @group Templates
     */
    readonly chooseIconTemplate = contentChild<TemplateRef<void>>('chooseicon', { descendants: false });

    /**
     * Custom file label template.
     * @param {FileUploadFileLabelTemplateContext} context - file label template context.
     * @group Templates
     */
    readonly fileLabelTemplate = contentChild<TemplateRef<FileUploadFileLabelTemplateContext>>('filelabel', { descendants: false });

    /**
     * Custom upload icon template.
     * @group Templates
     */
    readonly uploadIconTemplate = contentChild<TemplateRef<void>>('uploadicon', { descendants: false });

    /**
     * Custom cancel icon template.
     * @group Templates
     */
    readonly cancelIconTemplate = contentChild<TemplateRef<void>>('cancelicon', { descendants: false });

    /**
     * Custom empty state template.
     * @group Templates
     */
    readonly emptyTemplate = contentChild<TemplateRef<void>>('empty', { descendants: false });

    readonly advancedFileInput = viewChild<ElementRef | any>('advancedfileinput');

    readonly basicFileInput = viewChild<ElementRef>('basicfileinput');

    readonly content = viewChild<ElementRef>('content');

    readonly files = input<File[]>();

    public _files = signal<File[]>([]);

    public progress = signal<number>(0);

    public msgs = signal<any[] | undefined>(undefined);

    public uploadedFileCount = signal<number>(0);

    focus = signal<boolean | undefined>(undefined);

    uploading = signal<boolean | undefined>(undefined);

    translation = toSignal(this.config.translationObserver, { initialValue: this.config.translation });

    dragOverListener = signal<VoidListener>(undefined);

    public uploadedFiles = signal<File[]>([]);

    sanitizer: DomSanitizer = inject(DomSanitizer);

    zone: NgZone = inject(NgZone);

    http: HttpClient = inject(HttpClient);

    _componentStyle = inject(FileUploadStyle);

    readonly _headerTemplate = computed<TemplateRef<FileUploadHeaderTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    readonly _contentTemplate = computed<TemplateRef<FileUploadContentTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'content')
                .at(-1)?.template
    );

    readonly _toolbarTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'toolbar')
                .at(-1)?.template
    );

    readonly _chooseIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'chooseicon')
                .at(-1)?.template
    );

    readonly _uploadIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'uploadicon')
                .at(-1)?.template
    );

    readonly _cancelIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'cancelicon')
                .at(-1)?.template
    );

    readonly _emptyTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'empty')
                .at(-1)?.template
    );

    readonly _fileTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => !['header', 'content', 'toolbar', 'chooseicon', 'uploadicon', 'cancelicon', 'empty', 'filelabel'].includes(item.getType()))
                .at(-1)?.template
    );

    readonly _fileLabelTemplate = computed<TemplateRef<FileUploadFileLabelTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'filelabel')
                .at(-1)?.template
    );

    readonly templates = contentChildren(PrimeTemplate);

    basicFileChosenLabel = computed(() => {
        if (this.auto()) return this.chooseButtonLabel();
        else if (this.hasFiles()) {
            if (this._files() && this._files().length === 1) return this._files()[0].name;

            return this.translation()['fileChosenMessage']?.replace('{0}', this._files().length);
        }

        return this.translation()['noFileChosenMessage'] || '';
    });

    completedLabel = computed(() => this.translation()['completed'] || '');

    getTranslation(option: string) {
        return this.config.getTranslation(option);
    }

    choose() {
        this.advancedFileInput()?.nativeElement.click();
    }

    onFileSelect(event: any) {
        if (!this.multiple()) {
            this._files.set([]);
        }

        this.msgs.set([]);
        let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;

        for (let i = 0; i < files.length; i++) {
            let file = files[i];

            if (!this.isFileSelected(file)) {
                if (this.validate(file)) {
                    if (this.isImage(file)) {
                        file.objectURL = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(files[i]));
                    }

                    this._files.update((currentFiles) => [...currentFiles, files[i]]);
                }
            }
        }

        this.onSelect.emit({ originalEvent: event, files: files, currentFiles: this._files() });

        // this will check the fileLimit with the uploaded files
        this.checkFileLimit(files);

        if (this.hasFiles() && this.auto() && (this.mode() !== 'advanced' || !this.isFileLimitExceeded())) {
            this.upload();
        }

        this.clearInputElement();
    }

    isFileSelected(file: File): boolean {
        for (let sFile of this._files()) {
            if (sFile.name + sFile.type + sFile.size === file.name + file.type + file.size) {
                return true;
            }
        }

        return false;
    }

    validate(file: File): boolean {
        this.msgs.update((msgs) => msgs || []);
        const accept = this.accept();
        if (accept && !this.isFileTypeValid(file)) {
            const text = `${this.invalidFileTypeMessageSummary().replace('{0}', file.name)} ${this.invalidFileTypeMessageDetail().replace('{0}', accept)}`;
            this.msgs.update((msgs) => [
                ...msgs!,
                {
                    severity: 'error',
                    text: text
                }
            ]);
            return false;
        }

        const maxFileSize = this.maxFileSize();
        if (maxFileSize && file.size > maxFileSize) {
            const text = `${this.invalidFileSizeMessageSummary().replace('{0}', file.name)} ${this.invalidFileSizeMessageDetail().replace('{0}', this.formatSize(maxFileSize))}`;
            this.msgs.update((msgs) => [
                ...msgs!,
                {
                    severity: 'error',
                    text: text
                }
            ]);
            return false;
        }

        return true;
    }

    private isFileTypeValid(file: File): boolean {
        let acceptableTypes = this.accept()
            ?.split(',')
            .map((type) => type.trim());
        for (let type of acceptableTypes!) {
            let acceptable = this.isWildcard(type) ? this.getTypeClass(file.type) === this.getTypeClass(type) : file.type == type || this.getFileExtension(file).toLowerCase() === type.toLowerCase();

            if (acceptable) {
                return true;
            }
        }

        return false;
    }

    getTypeClass(fileType: string): string {
        return fileType.substring(0, fileType.indexOf('/'));
    }

    isWildcard(fileType: string): boolean {
        return fileType.indexOf('*') !== -1;
    }

    getFileExtension(file: File): string {
        return '.' + file.name.split('.').pop();
    }

    isImage(file: File): boolean {
        return /^image\//.test(file.type);
    }

    /**
     * Uploads the selected files.
     * @group Method
     */
    uploader() {
        if (this.customUpload()) {
            if (this.fileLimit()) {
                this.uploadedFileCount.update((count) => count + this._files().length);
            }

            this.uploadHandler.emit({
                files: this._files()
            });
        } else {
            this.uploading.set(true);
            this.msgs.set([]);
            let formData = new FormData();

            this.onBeforeUpload.emit({
                formData: formData
            });

            for (let i = 0; i < this._files().length; i++) {
                formData.append(this.name()!, this._files()[i], this._files()[i].name);
            }

            this.http
                .request(<string>this.method(), this.url() as string, {
                    body: formData,
                    headers: this.headers(),
                    reportProgress: true,
                    observe: 'events',
                    withCredentials: this.withCredentials()
                })
                .subscribe(
                    (event: HttpEvent<any>) => {
                        switch (event.type) {
                            case HttpEventType.Sent:
                                this.onSend.emit({
                                    originalEvent: event,
                                    formData: formData
                                });
                                break;
                            case HttpEventType.Response:
                                this.uploading.set(false);
                                this.progress.set(0);

                                if (event['status'] >= 200 && event['status'] < 300) {
                                    if (this.fileLimit()) {
                                        this.uploadedFileCount.update((count) => count + this._files().length);
                                    }

                                    this.onUpload.emit({ originalEvent: event, files: this._files() });
                                } else {
                                    this.onError.emit({ files: this._files() });
                                }
                                this.uploadedFiles.update((uploadedFiles) => [...uploadedFiles, ...this._files()]);
                                this.clear();
                                break;
                            case HttpEventType.UploadProgress: {
                                if (event['loaded']) {
                                    this.progress.set(Math.round((event['loaded'] * 100) / event['total']!));
                                }

                                this.onProgress.emit({ originalEvent: event, progress: this.progress() });
                                break;
                            }
                        }
                    },
                    (error: ErrorEvent) => {
                        this.uploading.set(false);
                        this.onError.emit({ files: this._files(), error: error });
                    }
                );
        }
    }
    onRemoveClick(e: any) {
        const { event, index } = e;
        if (this.hasFiles()) {
            this.remove(event, index);
        }
    }
    onRemoveUploadedFileClick(e: any) {
        const { index } = e;
        if (this.hasUploadedFiles()) {
            this.removeUploadedFile(index);
        }
    }
    /**
     * Clears the files list.
     * @group Method
     */
    clear() {
        this._files.set([]);
        this.onClear.emit(undefined);
        this.clearInputElement();
        this.msgs.set([]);
    }
    /**
     * Removes a single file.
     * @param {Event} event - Browser event.
     * @param {Number} index - Index of the file.
     * @group Method
     */
    remove(event: Event, index: number) {
        this.clearInputElement();
        this.onRemove.emit({ originalEvent: event, file: this._files()[index] });
        this._files.update((files) => files.filter((_, i) => i !== index));
        this.checkFileLimit(this._files());
    }
    /**
     * Removes uploaded file.
     * @param {Number} index - Index of the file to be removed.
     * @group Method
     */
    removeUploadedFile(index: number) {
        let removedFile = this.uploadedFiles()[index];
        this.uploadedFiles.update((uploadedFiles) => uploadedFiles.filter((_, i) => i !== index));
        this.onRemoveUploadedFile.emit({ file: removedFile, files: this.uploadedFiles() });
    }

    isFileLimitExceeded = computed(() => {
        const isAutoMode = this.auto();
        const totalFileCount = isAutoMode ? this._files().length : this._files().length + this.uploadedFileCount();
        const fileLimit = this.fileLimit();

        return fileLimit && fileLimit < totalFileCount;
    });

    isChooseDisabled = computed(() => {
        const fileLimit = this.fileLimit();
        if (this.auto()) {
            return fileLimit && fileLimit <= this._files().length;
        } else {
            return fileLimit && fileLimit <= this._files().length + this.uploadedFileCount();
        }
    });

    checkFileLimit(files: File[]) {
        this.msgs.update((msgs) => msgs ?? []);
        const fileLimit = this.fileLimit();
        const hasExistingValidationMessages = this.msgs()!.length > 0 && fileLimit && fileLimit < files.length;

        if (this.isFileLimitExceeded() || hasExistingValidationMessages) {
            const text = `${this.invalidFileLimitMessageSummary().replace('{0}', (fileLimit as number).toString())} ${this.invalidFileLimitMessageDetail().replace('{0}', (fileLimit as number).toString())}`;
            this.msgs.update((msgs) => [
                ...msgs!,
                {
                    severity: 'error',
                    text: text
                }
            ]);
        } else {
            this.msgs.update((msgs) => msgs!.filter((msg) => !msg.text.includes(this.invalidFileLimitMessageSummary())));
        }
    }

    clearInputElement() {
        const advancedFileInput = this.advancedFileInput();
        if (advancedFileInput && advancedFileInput.nativeElement) {
            advancedFileInput.nativeElement.value = '';
        }

        const basicFileInput = this.basicFileInput();
        if (basicFileInput && basicFileInput.nativeElement) {
            basicFileInput.nativeElement.value = '';
        }
    }

    hasFiles = computed<boolean>(() => this._files() && this._files().length > 0);

    hasUploadedFiles = computed(() => this.uploadedFiles() && this.uploadedFiles().length > 0);

    onDragEnter(e: DragEvent) {
        if (!this.disabled()) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    onDragOver(e: DragEvent) {
        if (!this.disabled()) {
            !this.$unstyled() && addClass(this.content()?.nativeElement, 'p-fileupload-highlight');
            this.content()?.nativeElement.setAttribute('data-p-highlight', true);
            e.stopPropagation();
            e.preventDefault();
        }
    }

    onDragLeave(event: DragEvent) {
        if (!this.disabled()) {
            !this.$unstyled() && removeClass(this.content()?.nativeElement, 'p-fileupload-highlight');
            this.content()?.nativeElement.setAttribute('data-p-highlight', false);
        }
    }

    onDrop(event: any) {
        if (!this.disabled()) {
            !this.$unstyled() && removeClass(this.content()?.nativeElement, 'p-fileupload-highlight');
            this.content()?.nativeElement.setAttribute('data-p-highlight', false);
            event.stopPropagation();
            event.preventDefault();

            let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
            let allowDrop = this.multiple() || (files && files.length === 1);

            if (allowDrop) {
                this.onFileSelect(event);
            }
        }
    }

    onFocus() {
        this.focus.set(true);
    }

    onBlur() {
        this.focus.set(false);
    }

    formatSize(bytes: number) {
        const k = 1024;
        const dm = 3;
        const sizes = this.getTranslation(TranslationKeys.FILE_SIZE_TYPES);

        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = (bytes / Math.pow(k, i)).toFixed(dm);

        return `${formattedSize} ${sizes[i]}`;
    }

    upload() {
        if (this.hasFiles()) this.uploader();
    }

    onBasicUploaderClick() {
        this.basicFileInput()?.nativeElement.click();
    }

    onBasicKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Space':
            case 'Enter':
                this.onBasicUploaderClick();

                event.preventDefault();
                break;
        }
    }

    imageError(event: Event) {
        this.onImageError.emit(event);
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    chooseButtonLabel = computed<string>(() => this.chooseLabel() || this.translation()[TranslationKeys.CHOOSE]);

    uploadButtonLabel = computed<string>(() => this.uploadLabel() || this.translation()[TranslationKeys.UPLOAD]);

    cancelButtonLabel = computed<string>(() => this.cancelLabel() || this.translation()[TranslationKeys.CANCEL]);

    browseFilesLabel = computed<string>(() => this.translation()[TranslationKeys.ARIA][TranslationKeys.BROWSE_FILES]);

    pendingLabel = computed(() => this.translation()[TranslationKeys.PENDING]);

    onDestroy() {
        const content = this.content();
        if (content && content.nativeElement) {
            const dragOverListener = this.dragOverListener();
            if (dragOverListener) {
                dragOverListener();
                this.dragOverListener.set(null);
            }
        }
    }
}

@NgModule({
    imports: [FileUpload, SharedModule],
    exports: [FileUpload, SharedModule]
})
export class FileUploadModule {}
