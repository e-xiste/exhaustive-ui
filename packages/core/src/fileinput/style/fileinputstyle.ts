import { Injectable } from '@angular/core';
import { style as fileinput_style } from '@exhaustive-ui/styles/fileinput';
import { BaseStyle } from '@exhaustive-ui/core/base';

const classes = {
    root: ({ instance }) => [
        'p-fileinput p-component',
        {
            'p-fileinput-images': instance.variant() === 'images',
            'p-fileinput-avatar-variant': instance.variant() === 'avatar',
            'p-fileinput-sm': instance.size() === 'small',
            'p-fileinput-lg': instance.size() === 'large',
            'p-fileinput-invalid': instance.$invalid(),
            'p-fileinput-disabled': instance.$disabled()
        }
    ],
    input: 'p-fileinput-input',
    dropzone: ({ instance }) => ['p-fileinput-dropzone', { 'p-fileinput-dropzone-active': instance.dragActive() }],
    dropzoneIcon: 'p-fileinput-dropzone-icon',
    label: 'p-fileinput-label',
    browse: 'p-fileinput-browse',
    hint: 'p-fileinput-hint',
    summary: 'p-fileinput-summary',
    progress: 'p-fileinput-progress',
    progressValue: 'p-fileinput-progress-value',
    list: 'p-fileinput-list',
    item: ({ item }) => ['p-fileinput-item', { 'p-fileinput-item-error': item.status === 'invalid' || item.status === 'failed' }],
    thumbnail: 'p-fileinput-thumbnail',
    info: 'p-fileinput-info',
    name: 'p-fileinput-name',
    path: 'p-fileinput-path',
    meta: 'p-fileinput-meta',
    status: ({ item }) => ['p-fileinput-status', { 'p-fileinput-status-done': item.status === 'uploaded', 'p-fileinput-error': item.status === 'invalid' || item.status === 'failed' }],
    actions: 'p-fileinput-actions',
    action: 'p-fileinput-action',
    actionIcon: 'p-fileinput-action-icon',
    grid: 'p-fileinput-grid',
    tile: ({ item }) => ['p-fileinput-tile', { 'p-fileinput-tile-error': item.status === 'invalid' || item.status === 'failed' }],
    tileOverlay: 'p-fileinput-tile-overlay',
    tileActions: 'p-fileinput-tile-actions',
    tileDone: 'p-fileinput-tile-done',
    cover: 'p-fileinput-cover',
    add: ({ instance }) => ['p-fileinput-add', { 'p-fileinput-dropzone-active': instance.dragActive() }],
    avatar: ({ instance }) => [
        'p-fileinput-avatar',
        {
            'p-fileinput-avatar-square': instance.avatarShape() === 'square',
            'p-fileinput-avatar-filled': !!instance.avatarSrc(),
            'p-fileinput-avatar-uploading': instance.avatarItem()?.status === 'uploading'
        }
    ],
    avatarIcon: 'p-fileinput-avatar-icon',
    avatarOverlay: 'p-fileinput-avatar-overlay',
    avatarError: 'p-fileinput-avatar-error'
};

@Injectable()
export class FileInputStyle extends BaseStyle {
    name = 'fileinput';

    style = fileinput_style;

    classes = classes;
}

/**
 *
 * FileInput selects files by drag and drop, paste or the file picker, validates them and uploads them with a progress per file.
 *
 * [Live Demo](https://exhaustive-ui.com/fileinput/)
 *
 * @module fileinputstyle
 *
 */
export enum FileInputClasses {
    /**
     * Class name of the root element
     */
    root = 'p-fileinput',
    /**
     * Class name of the hidden file input
     */
    input = 'p-fileinput-input',
    /**
     * Class name of the dropzone
     */
    dropzone = 'p-fileinput-dropzone',
    /**
     * Class name of the dropzone icon
     */
    dropzoneIcon = 'p-fileinput-dropzone-icon',
    /**
     * Class name of the dropzone label
     */
    label = 'p-fileinput-label',
    /**
     * Class name of the hint
     */
    hint = 'p-fileinput-hint',
    /**
     * Class name of the upload summary
     */
    summary = 'p-fileinput-summary',
    /**
     * Class name of a progress bar
     */
    progress = 'p-fileinput-progress',
    /**
     * Class name of the file list
     */
    list = 'p-fileinput-list',
    /**
     * Class name of a file row
     */
    item = 'p-fileinput-item',
    /**
     * Class name of a thumbnail
     */
    thumbnail = 'p-fileinput-thumbnail',
    /**
     * Class name of a file name
     */
    name = 'p-fileinput-name',
    /**
     * Class name of the size and status line
     */
    meta = 'p-fileinput-meta',
    /**
     * Class name of an action button
     */
    action = 'p-fileinput-action',
    /**
     * Class name of the image grid
     */
    grid = 'p-fileinput-grid',
    /**
     * Class name of an image tile
     */
    tile = 'p-fileinput-tile',
    /**
     * Class name of the add tile
     */
    add = 'p-fileinput-add',
    /**
     * Class name of the avatar
     */
    avatar = 'p-fileinput-avatar'
}

export interface FileInputStyle extends BaseStyle {}
