import { CommonModule } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    HostListener,
    inject,
    input,
    NgModule,
    signal,
    TemplateRef,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { MotionEvent, MotionOptions } from '@exhaustive-ui/motion';
import { appendChild, focus } from '@exhaustive-ui/utils';
import { PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { blockBodyScroll, unblockBodyScroll } from '@exhaustive-ui/core/dom';
import { FocusTrap } from '@exhaustive-ui/core/focustrap';
import { EyeIcon, RefreshIcon, SearchMinusIcon, SearchPlusIcon, TimesIcon, UndoIcon } from '@exhaustive-ui/core/icons';
import { MotionModule } from '@exhaustive-ui/core/motion';
import { Nullable } from '@exhaustive-ui/core/ts-helpers';
import { ImageImageTemplateContext, ImagePassThrough, ImagePreviewTemplateContext } from '@exhaustive-ui/core/types/image';
import { ZIndexUtils } from '@exhaustive-ui/core/utils';
import { ImageStyle } from './style/imagestyle';

/**
 * Displays an image with preview and tranformation options. For multiple image, see Galleria.
 * @group Components
 */
@Component({
    selector: 'p-image',
    imports: [CommonModule, RefreshIcon, EyeIcon, UndoIcon, SearchMinusIcon, SearchPlusIcon, TimesIcon, FocusTrap, SharedModule, BindModule, MotionModule],
    template: `
        @if (!imageTemplate() && !_imageTemplate()) {
            <img
                [attr.src]="src()"
                [attr.srcset]="srcSet()"
                [attr.sizes]="sizes()"
                [attr.alt]="alt()"
                [attr.width]="width()"
                [attr.height]="height()"
                [attr.loading]="loading()"
                [ngStyle]="imageStyle()"
                [class]="imageClass()"
                (error)="imageError($event)"
                [pBind]="ptm('image')"
            />
        }

        <ng-container *ngTemplateOutlet="imageTemplate() || _imageTemplate(); context: { errorCallback: imageError.bind(this) }"></ng-container>

        @if (preview()) {
            <button [attr.aria-label]="zoomImageAriaLabel" type="button" [class]="cx('previewMask')" (click)="onImageClick()" #previewButton [ngStyle]="{ height: height() + 'px', width: width() + 'px' }" [pBind]="ptm('previewMask')">
                @if (indicatorTemplate() || _indicatorTemplate()) {
                    <ng-container *ngTemplateOutlet="indicatorTemplate() || _indicatorTemplate()"></ng-container>
                } @else {
                    <svg data-p-icon="eye" [class]="cx('previewIcon')" [pBind]="ptm('previewIcon')" />
                }
            </button>
        }
        @if (renderMask()) {
            <div
                #mask
                [class]="cx('mask')"
                [attr.aria-modal]="maskVisible()"
                role="dialog"
                (click)="onMaskClick()"
                (keydown)="onMaskKeydown($event)"
                pFocusTrap
                [pBind]="ptm('mask')"
                [pMotion]="maskVisible()"
                [pMotionAppear]="true"
                [pMotionEnterActiveClass]="'p-overlay-mask-enter-active'"
                [pMotionLeaveActiveClass]="'p-overlay-mask-leave-active'"
                [pMotionOptions]="computedMaskMotionOptions()"
                (pMotionOnAfterLeave)="onMaskAfterLeave()"
            >
                <div [class]="cx('toolbar')" (click)="handleToolbarClick($event)" [pBind]="ptm('toolbar')">
                    <button [class]="cx('rotateRightButton')" (click)="rotateRight()" type="button" [attr.aria-label]="rightAriaLabel()" [pBind]="ptm('rotateRightButton')">
                        @if (!rotateRightIconTemplate() && !_rotateRightIconTemplate()) {
                            <svg data-p-icon="refresh" />
                        }
                        <ng-template *ngTemplateOutlet="rotateRightIconTemplate() || _rotateRightIconTemplate()"></ng-template>
                    </button>
                    <button [class]="cx('rotateLeftButton')" (click)="rotateLeft()" type="button" [attr.aria-label]="leftAriaLabel()" [pBind]="ptm('rotateLeftButton')">
                        @if (!rotateLeftIconTemplate() && !_rotateLeftIconTemplate()) {
                            <svg data-p-icon="undo" />
                        }
                        <ng-template *ngTemplateOutlet="rotateLeftIconTemplate() || _rotateLeftIconTemplate()"></ng-template>
                    </button>
                    <button [class]="cx('zoomOutButton')" (click)="zoomOut()" type="button" [disabled]="isZoomOutDisabled()" [attr.aria-label]="zoomOutAriaLabel()" [pBind]="ptm('zoomOutButton')">
                        @if (!zoomOutIconTemplate() && !_zoomOutIconTemplate()) {
                            <svg data-p-icon="search-minus" />
                        }
                        <ng-template *ngTemplateOutlet="zoomOutIconTemplate() || _zoomOutIconTemplate()"></ng-template>
                    </button>
                    <button [class]="cx('zoomInButton')" (click)="zoomIn()" type="button" [disabled]="isZoomInDisabled()" [attr.aria-label]="zoomInAriaLabel()" [pBind]="ptm('zoomInButton')">
                        @if (!zoomInIconTemplate() && !_zoomInIconTemplate()) {
                            <svg data-p-icon="search-plus" />
                        }
                        <ng-template *ngTemplateOutlet="zoomInIconTemplate() || _zoomInIconTemplate()"></ng-template>
                    </button>
                    <button [class]="cx('closeButton')" type="button" (click)="closePreview()" [attr.aria-label]="closeAriaLabel()" #closeButton [pBind]="ptm('closeButton')">
                        @if (!closeIconTemplate() && !_closeIconTemplate()) {
                            <svg data-p-icon="times" />
                        }
                        <ng-template *ngTemplateOutlet="closeIconTemplate() || _closeIconTemplate()"></ng-template>
                    </button>
                </div>
                @if (renderPreview()) {
                    <p-motion
                        [visible]="previewVisible()"
                        name="p-image-original"
                        [appear]="true"
                        [options]="computedMotionOptions()"
                        (onBeforeEnter)="onAnimationStart($event)"
                        (onBeforeLeave)="onBeforeLeave()"
                        (onAfterLeave)="onAnimationEnd($event)"
                    >
                        @if (!previewTemplate() && !_previewTemplate()) {
                            <img
                                [attr.src]="previewImageSrc() ? previewImageSrc() : src()"
                                [attr.srcset]="previewImageSrcSet()"
                                [attr.sizes]="previewImageSizes()"
                                [class]="cx('original')"
                                [ngStyle]="imagePreviewStyle()"
                                (click)="onPreviewImageClick()"
                                [pBind]="ptm('original')"
                            />
                        }
                        <ng-container
                            *ngTemplateOutlet="
                                previewTemplate() || _previewTemplate();
                                context: {
                                    class: cx('original'),
                                    style: imagePreviewStyle(),
                                    previewCallback: onPreviewImageClick.bind(this)
                                }
                            "
                        >
                        </ng-container>
                    </p-motion>
                }
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ImageStyle, { provide: PARENT_INSTANCE, useExisting: Image }],
    host: {
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class Image extends BaseComponent<ImagePassThrough> {
    componentName = 'Image';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }
    /**
     * Style class of the image element.
     * @group Props
     */
    imageClass = input<string | undefined>(undefined);
    /**
     * Inline style of the image element.
     * @group Props
     */
    imageStyle = input<{ [klass: string]: any } | null | undefined>(undefined);
    /**
     * The source path for the main image.
     * @group Props
     */
    src = input<string | SafeUrl | undefined>(undefined);
    /**
     * The srcset definition for the main image.
     * @group Props
     */
    srcSet = input<string | SafeUrl | undefined>(undefined);
    /**
     * The sizes definition for the main image.
     * @group Props
     */
    sizes = input<string | undefined>(undefined);
    /**
     * The source path for the preview image.
     * @group Props
     */
    previewImageSrc = input<string | SafeUrl | undefined>(undefined);
    /**
     * The srcset definition for the preview image.
     * @group Props
     */
    previewImageSrcSet = input<string | SafeUrl | undefined>(undefined);
    /**
     * The sizes definition for the preview image.
     * @group Props
     */
    previewImageSizes = input<string | undefined>(undefined);
    /**
     * Attribute of the preview image element.
     * @group Props
     */
    alt = input<string | undefined>(undefined);
    /**
     * Attribute of the image element.
     * @group Props
     */
    width = input<string | undefined>(undefined);
    /**
     * Attribute of the image element.
     * @group Props
     */
    height = input<string | undefined>(undefined);
    /**
     * Attribute of the image element.
     * @group Props
     */
    loading = input<'lazy' | 'eager' | undefined>(undefined);
    /**
     * Controls the preview functionality.
     * @group Props
     */
    preview = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);
    /**
     * The motion options for the mask.
     * @group Props
     */
    maskMotionOptions = input<MotionOptions | undefined>(undefined);

    computedMaskMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('maskMotion'),
            ...this.maskMotionOptions()
        };
    });
    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });
    /**
     * Triggered when the preview overlay is shown.
     * @group Emits
     */
    readonly onShow = output<any>();
    /**
     * Triggered when the preview overlay is hidden.
     * @group Emits
     */
    readonly onHide = output<any>();
    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onImageError = output<Event>();

    readonly previewButton = viewChild<ElementRef>('previewButton');

    readonly closeButton = viewChild<ElementRef>('closeButton');

    /**
     * Custom indicator template.
     * @group Templates
     */
    readonly indicatorTemplate = contentChild<TemplateRef<void>>('indicator', { descendants: false });

    /**
     * Custom rotate right icon template.
     * @group Templates
     */
    readonly rotateRightIconTemplate = contentChild<TemplateRef<void>>('rotaterighticon', { descendants: false });

    /**
     * Custom rotate left icon template.
     * @group Templates
     */
    readonly rotateLeftIconTemplate = contentChild<TemplateRef<void>>('rotatelefticon', { descendants: false });

    /**
     * Custom zoom out icon template.
     * @group Templates
     */
    readonly zoomOutIconTemplate = contentChild<TemplateRef<void>>('zoomouticon', { descendants: false });

    /**
     * Custom zoom in icon template.
     * @group Templates
     */
    readonly zoomInIconTemplate = contentChild<TemplateRef<void>>('zoominicon', { descendants: false });

    /**
     * Custom close icon template.
     * @group Templates
     */
    readonly closeIconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });

    /**
     * Custom preview template.
     * @group Templates
     */
    readonly previewTemplate = contentChild<TemplateRef<ImagePreviewTemplateContext>>('preview', { descendants: false });

    /**
     * Custom image template.
     * @group Templates
     */
    readonly imageTemplate = contentChild<TemplateRef<ImageImageTemplateContext>>('image', { descendants: false });

    renderMask = signal<boolean>(false);

    renderPreview = signal<boolean>(false);

    maskVisible = signal<boolean>(false);

    previewVisible = signal<boolean>(false);

    rotate = signal<number>(0);

    scale = signal<number>(1);

    previewClick = signal<boolean>(false);

    container = signal<Nullable<HTMLElement>>(undefined);

    wrapper = signal<Nullable<HTMLElement>>(undefined);

    _componentStyle = inject(ImageStyle);

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    public isZoomOutDisabled = computed<boolean>(() => this.scale() - this.zoomSettings.step <= this.zoomSettings.min);

    public isZoomInDisabled = computed<boolean>(() => this.scale() + this.zoomSettings.step >= this.zoomSettings.max);

    private zoomSettings = {
        default: 1,
        step: 0.1,
        max: 1.5,
        min: 0.5
    };

    readonly templates = contentChildren(PrimeTemplate);

    readonly _indicatorTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => !['rotaterighticon', 'rotatelefticon', 'zoomouticon', 'zoominicon', 'closeicon', 'image', 'preview'].includes(item.getType()))
                .at(-1)?.template
    );

    readonly _rotateRightIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'rotaterighticon')
                .at(-1)?.template
    );

    readonly _rotateLeftIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'rotatelefticon')
                .at(-1)?.template
    );

    readonly _zoomOutIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'zoomouticon')
                .at(-1)?.template
    );

    readonly _zoomInIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'zoominicon')
                .at(-1)?.template
    );

    readonly _closeIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'closeicon')
                .at(-1)?.template
    );

    readonly _imageTemplate = computed<TemplateRef<ImageImageTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'image')
                .at(-1)?.template
    );

    readonly _previewTemplate = computed<TemplateRef<ImagePreviewTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'preview')
                .at(-1)?.template
    );

    onImageClick() {
        if (this.preview()) {
            this.maskVisible.set(true);
            this.previewVisible.set(true);
            this.renderMask.set(true);
            this.renderPreview.set(true);
            blockBodyScroll();
        }
    }

    onMaskClick() {
        if (!this.previewClick()) {
            this.closePreview();
        }

        this.previewClick.set(false);
    }

    onMaskKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Escape':
                this.onMaskClick();
                setTimeout(() => {
                    focus(this.previewButton()?.nativeElement);
                }, 25);
                event.preventDefault();

                break;

            default:
                break;
        }
    }

    onPreviewImageClick() {
        this.previewClick.set(true);
    }

    rotateRight() {
        this.rotate.update((rotate) => rotate + 90);
        this.previewClick.set(true);
    }

    rotateLeft() {
        this.rotate.update((rotate) => rotate - 90);
        this.previewClick.set(true);
    }

    zoomIn() {
        this.scale.update((scale) => scale + this.zoomSettings.step);
        this.previewClick.set(true);
    }

    zoomOut() {
        this.scale.update((scale) => scale - this.zoomSettings.step);
        this.previewClick.set(true);
    }

    onAnimationStart(event: MotionEvent) {
        this.container.set(event.element as HTMLDivElement);
        this.wrapper.set(this.container()?.parentElement);
        this.$attrSelector && this.wrapper()?.setAttribute(this.$attrSelector, '');
        this.appendContainer();
        this.moveOnTop();
        this.onShow.emit({});
        setTimeout(() => {
            focus(this.closeButton()?.nativeElement);
        }, 25);
    }

    onBeforeLeave() {
        this.maskVisible.set(false);
    }

    onAnimationEnd() {
        this.renderPreview.set(false);
    }

    onMaskAfterLeave() {
        if (!this.renderPreview()) {
            this.renderMask.set(false);
        }
        ZIndexUtils.clear(this.wrapper());
        this.container.set(null);
        this.wrapper.set(null);
        this.rotate.set(0);
        this.scale.set(this.zoomSettings.default);
        unblockBodyScroll();
        this.onHide.emit({});
    }

    moveOnTop() {
        ZIndexUtils.set('modal', this.wrapper(), this.config.zIndex.modal);
    }

    appendContainer() {
        const wrapper = this.wrapper();
        if (this.$appendTo() && this.$appendTo() !== 'self') {
            if (this.$appendTo() === 'body' && wrapper) {
                this.document.body.appendChild(wrapper as HTMLElement);
            } else if (wrapper) {
                appendChild(this.$appendTo(), wrapper);
            }
        }
    }

    imagePreviewStyle = computed(() => {
        return { transform: 'rotate(' + this.rotate() + 'deg) scale(' + this.scale() + ')' };
    });

    get zoomImageAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.zoomImage : undefined;
    }

    handleToolbarClick(event: MouseEvent): void {
        event.stopPropagation();
    }

    closePreview(): void {
        this.previewVisible.set(false);
    }

    imageError(event: Event) {
        this.onImageError.emit(event);
    }

    rightAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.rotateRight : undefined;
    }

    leftAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.rotateLeft : undefined;
    }

    zoomInAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.zoomIn : undefined;
    }

    zoomOutAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.zoomOut : undefined;
    }

    closeAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.close : undefined;
    }

    @HostListener('document:keydown.escape') onKeydownHandler() {
        if (this.previewVisible()) {
            this.closePreview();
        }
    }
}

@NgModule({
    imports: [Image, SharedModule],
    exports: [Image, SharedModule]
})
export class ImageModule {}
