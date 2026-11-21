import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, InjectionToken, input, NgModule, signal, TemplateRef, ViewEncapsulation, contentChild, contentChildren } from '@angular/core';
import { PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { ImageComparePassThrough } from '@exhaustive-ui/core/types/imagecompare';
import { ImageCompareStyle } from './style/imagecomparestyle';

const IMAGECOMPARE_INSTANCE = new InjectionToken<ImageCompare>('IMAGECOMPARE_INSTANCE');

/**
 * Compare two images side by side with a slider.
 * @group Components
 */
@Component({
    selector: 'p-imageCompare, p-imagecompare, p-image-compare',
    imports: [CommonModule, SharedModule, BindModule],
    template: `
        <ng-template *ngTemplateOutlet="leftTemplate() || _leftTemplate()"></ng-template>
        <ng-template *ngTemplateOutlet="rightTemplate() || _rightTemplate()"></ng-template>

        <input type="range" min="0" max="100" value="50" (input)="onSlide($event)" [class]="cx('slider')" [pBind]="ptm('slider')" />
    `,
    host: {
        '[class]': "cx('root')",
        '[attr.tabindex]': 'tabindex()',
        '[attr.aria-labelledby]': 'ariaLabelledby()',
        '[attr.aria-label]': 'ariaLabel()'
    },
    hostDirectives: [Bind],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ImageCompareStyle, { provide: IMAGECOMPARE_INSTANCE, useExisting: ImageCompare }, { provide: PARENT_INSTANCE, useExisting: ImageCompare }]
})
export class ImageCompare extends BaseComponent<ImageComparePassThrough> {
    componentName = 'ImageCompare';

    $pcImageCompare: ImageCompare | undefined = inject(IMAGECOMPARE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
    }
    /**
     * Index of the element in tabbing order.
     * @defaultValue 0
     * @group Props
     */
    readonly tabindex = input<number | undefined>();
    /**
     * Defines a string value that labels an interactive element.
     * @group Props
     */
    readonly ariaLabelledby = input<string | undefined>();
    /**
     * Identifier of the underlying input element.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();

    /**
     * Custom left side template.
     * @group Templates
     */
    readonly leftTemplate = contentChild<TemplateRef<void>>('left', { descendants: false });

    /**
     * Custom right side template.
     * @group Templates
     */
    readonly rightTemplate = contentChild<TemplateRef<void>>('right', { descendants: false });

    readonly _leftTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'left')
                .at(-1)?.template
    );

    readonly _rightTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'right')
                .at(-1)?.template
    );

    readonly templates = contentChildren(PrimeTemplate);

    _componentStyle = inject(ImageCompareStyle);

    mutationObserver = signal<MutationObserver | undefined>(undefined);

    isRTL = signal<boolean>(false);

    onInit() {
        this.updateDirection();
        this.observeDirectionChanges();
    }

    onSlide(event) {
        const value = event.target.value;
        const image = event.target.previousElementSibling;

        if (this.isRTL()) {
            image.style.clipPath = `polygon(${100 - value}% 0, 100% 0, 100% 100%, ${100 - value}% 100%)`;
        } else {
            image.style.clipPath = `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`;
        }
    }

    updateDirection() {
        this.isRTL.set(!!this.el.nativeElement.closest('[dir="rtl"]'));
    }

    observeDirectionChanges() {
        if (isPlatformBrowser(this.platformId)) {
            const targetNode = document?.documentElement;
            const config = { attributes: true, attributeFilter: ['dir'] };

            this.mutationObserver.set(
                new MutationObserver(() => {
                    this.updateDirection();
                })
            );

            this.mutationObserver()?.observe(targetNode, config);
        }
    }

    onDestroy() {
        this.mutationObserver()?.disconnect();
    }
}

@NgModule({
    imports: [ImageCompare, SharedModule],
    exports: [ImageCompare, SharedModule]
})
export class ImageCompareModule {}
