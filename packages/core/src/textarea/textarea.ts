import { afterEveryRender, booleanAttribute, computed, DestroyRef, Directive, effect, HostListener, inject, input, NgModule, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { BaseModelHolder } from '@exhaustive-ui/core/basemodelholder';
import { Bind } from '@exhaustive-ui/core/bind';
import { Fluid } from '@exhaustive-ui/core/fluid';
import { TextareaPassThrough } from '@exhaustive-ui/core/types/textarea';
import { TextareaStyle } from './style/textareastyle';

/**
 * Textarea adds styling and autoResize functionality to standard textarea element.
 * @group Components
 */
@Directive({
    selector: '[pTextarea], [pInputTextarea]',
    host: {
        '[class]': "cx('root')"
    },
    providers: [TextareaStyle, { provide: PARENT_INSTANCE, useExisting: Textarea }],
    hostDirectives: [Bind]
})
export class Textarea extends BaseModelHolder<TextareaPassThrough> {
    componentName = 'Textarea';

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Used to pass attributes to DOM elements inside the Textarea component.
     * @defaultValue undefined
     * @group Props
     */
    pTextareaPT = input<TextareaPassThrough>();
    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    pTextareaUnstyled = input<boolean | undefined>();

    /**
     * When present, textarea size changes as being typed.
     * @group Props
     */
    readonly autoResize = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Defines the size of the component.
     * @group Props
     */
    readonly pSize = input<'large' | 'small' | undefined>();
    /**
     * Specifies the input variant of the component.
     * @defaultValue undefined
     * @group Props
     */
    variant = input<'filled' | 'outlined' | undefined>();
    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });
    /**
     * When present, it specifies that the component should have invalid state style.
     * @defaultValue false
     * @group Props
     */
    invalid = input(undefined, { transform: booleanAttribute });

    $variant = computed(() => this.variant() || this.config.inputStyle() || this.config.inputVariant());
    /**
     * Callback to invoke on textarea resize.
     * @param {(Event | {})} event - Custom resize event.
     * @group Emits
     */
    readonly onResize = output<Event | {}>();

    destroyRef = inject(DestroyRef);

    _componentStyle = inject(TextareaStyle);

    ngControl = inject(NgControl, { optional: true, self: true });

    pcFluid: Fluid | null = inject(Fluid, { optional: true, host: true, skipSelf: true });

    readonly hasFluid = computed(() => this.fluid() ?? !!this.pcFluid);

    constructor() {
        super();
        effect(() => {
            const pt = this.pTextareaPT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pTextareaUnstyled() && this.directiveUnstyled.set(this.pTextareaUnstyled());
        });

        afterEveryRender(() => {
            this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
        });
    }

    onInit() {
        if (this.ngControl) {
            (this.ngControl as any).valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                this.updateState();
            });
        }
    }

    onDoCheck() {
        this.writeModelValue(this.ngControl?.value ?? this.el.nativeElement.value);
    }

    onAfterViewChecked() {
        if (this.autoResize()) {
            this.resize();
        }
    }

    @HostListener('input', ['$event'])
    onInput(e: Event) {
        this.writeModelValue((e.target as HTMLTextAreaElement)?.value);
        this.updateState();
    }

    resize(event?: Event) {
        this.el.nativeElement.style.height = 'auto';
        this.el.nativeElement.style.height = this.el.nativeElement.scrollHeight + 'px';

        if (parseFloat(this.el.nativeElement.style.height) >= parseFloat(this.el.nativeElement.style.maxHeight)) {
            this.el.nativeElement.style.overflowY = 'scroll';
            this.el.nativeElement.style.height = this.el.nativeElement.style.maxHeight;
        } else {
            this.el.nativeElement.style.overflow = 'hidden';
        }

        this.onResize.emit(event || {});
    }

    updateState() {
        if (this.autoResize()) {
            this.resize();
        }
    }
}

@NgModule({
    imports: [Textarea],
    exports: [Textarea]
})
export class TextareaModule {}
