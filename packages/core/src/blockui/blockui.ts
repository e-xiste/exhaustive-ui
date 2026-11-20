import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    input,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    contentChild,
    contentChildren
} from '@angular/core';
import { blockBodyScroll, unblockBodyScroll } from '@exhaustive-ui/utils';
import { PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { BlockUIPassThrough } from '@exhaustive-ui/core/types/blockui';
import { ZIndexUtils } from '@exhaustive-ui/core/utils';
import { BlockUiStyle } from './style/blockuistyle';

/**
 * BlockUI can either block other components or the whole page.
 * @group Components
 */
@Component({
    selector: 'p-blockUI, p-blockui, p-block-ui',
    imports: [CommonModule, SharedModule],
    template: `
        <ng-content></ng-content>
        <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate()"></ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [BlockUiStyle, { provide: PARENT_INSTANCE, useExisting: BlockUI }],
    host: {
        '[attr.aria-busy]': '_blocked()',
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class BlockUI extends BaseComponent<BlockUIPassThrough> {
    componentName = 'BlockUI';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
        effect(() => {
            const blocked = this.blocked();
            untracked(() => {
                if (blocked) {
                    this.block();
                } else if (this._blocked()) {
                    // Only unblock if currently blocked
                    this.unblock();
                } else if (!this.animationEndListener()) {
                    // Keep the mask and its content hidden until the first block
                    this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
                }
            });
        });
    }
    /**
     * Name of the local ng-template variable referring to another component.
     * @group Props
     */
    readonly target = input<any>();
    /**
     * Whether to automatically manage layering.
     * @group Props
     */
    readonly autoZIndex = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    readonly baseZIndex = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * Current blocked state as a boolean.
     * @group Props
     */
    readonly blocked = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * template of the content
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<any>>('content', { descendants: false });

    _blocked = signal<boolean>(false);

    animationEndListener = signal<VoidFunction | null | undefined>(undefined);

    _componentStyle = inject(BlockUiStyle);

    onAfterViewInit() {
        const target = this.target();
        if (target && !target.getBlockableElement) {
            throw 'Target of BlockUI must implement BlockableUI interface';
        }
    }

    readonly templates = contentChildren(PrimeTemplate);

    readonly _contentTemplate = computed<TemplateRef<any> | undefined>(() => this.templates().at(-1)?.template);

    block() {
        if (isPlatformBrowser(this.platformId)) {
            // Cancel a pending unblock so its animationend does not tear down this block
            this.unbindAnimationEndListener();
            this.renderer.removeClass(this.el.nativeElement, 'p-overlay-mask-leave-active');
            this._blocked.set(true);
            (this.el as ElementRef).nativeElement.style.display = 'flex';

            const target = this.target();
            if (target) {
                target.getBlockableElement().appendChild((this.el as ElementRef).nativeElement);
                target.getBlockableElement().style.position = 'relative';
            } else {
                this.renderer.appendChild(this.document.body, (this.el as ElementRef).nativeElement);
                //@ts-ignore
                blockBodyScroll();
            }

            if (this.autoZIndex()) {
                ZIndexUtils.set('modal', (this.el as ElementRef).nativeElement, this.baseZIndex() + this.config.zIndex.modal);
            }

            this.renderer.addClass(this.el.nativeElement, 'p-overlay-mask');
            this.renderer.addClass(this.el.nativeElement, 'p-overlay-mask-enter-active');
        }
    }

    unblock() {
        if (isPlatformBrowser(this.platformId) && this.el && this._blocked()) {
            this._blocked.set(false);
            if (!this.animationEndListener()) {
                this.animationEndListener.set(this.renderer.listen(this.el.nativeElement, 'animationend', this.destroyModal.bind(this)));
            }
            this.renderer.removeClass(this.el.nativeElement, 'p-overlay-mask-enter-active');
            this.renderer.addClass(this.el.nativeElement, 'p-overlay-mask-leave-active');
        }
    }

    destroyModal() {
        this._blocked.set(false);
        if (this.el && isPlatformBrowser(this.platformId)) {
            this.el.nativeElement.style.display = 'none';
            this.renderer.removeClass(this.el.nativeElement, 'p-overlay-mask');
            this.renderer.removeClass(this.el.nativeElement, 'p-overlay-mask-leave-active');
            ZIndexUtils.clear(this.el.nativeElement);

            if (!this.target()) {
                this.document.body.removeChild(this.el.nativeElement);
                //@ts-ignore
                unblockBodyScroll();
            }
        }
        this.unbindAnimationEndListener();
    }

    unbindAnimationEndListener() {
        const animationEndListener = this.animationEndListener();
        if (animationEndListener && this.el) {
            animationEndListener();
            this.animationEndListener.set(null);
        }
    }

    onDestroy() {
        if (this._blocked()) {
            // Skip animation on destroy, just cleanup
            this._blocked.set(false);
            if (this.el && isPlatformBrowser(this.platformId)) {
                ZIndexUtils.clear(this.el.nativeElement);
                if (!this.target()) {
                    //@ts-ignore
                    unblockBodyScroll();
                }
            }
            this.unbindAnimationEndListener();
        }
    }
}

@NgModule({
    imports: [BlockUI, SharedModule],
    exports: [BlockUI, SharedModule]
})
export class BlockUIModule {}
