import { CommonModule } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, model, NgModule, TemplateRef, ViewEncapsulation, contentChild, contentChildren, output } from '@angular/core';
import { PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TimesIcon } from '@exhaustive-ui/core/icons';
import { Ripple } from '@exhaustive-ui/core/ripple';
import { InplaceContentTemplateContext, InplacePassThrough } from '@exhaustive-ui/core/types/inplace';
import { InplaceStyle } from './style/inplacestyle';

/**
 * Inplace provides an easy to do editing and display at the same time where clicking the output displays the actual content.
 * @group Components
 */
@Component({
    selector: 'p-inplace',
    imports: [CommonModule, ButtonModule, TimesIcon, SharedModule, Ripple, Bind],
    template: `
        @if (!active()) {
            <div [class]="cx('display')" [pBind]="ptm('display')" (click)="onActivateClick($event)" tabindex="0" role="button" (keydown)="onKeydown($event)" [attr.data-p-disabled]="disabled()">
                <ng-content select="[pInplaceDisplay]"></ng-content>
                <ng-container *ngTemplateOutlet="displayTemplate() || _displayTemplate()"></ng-container>
            </div>
        }
        @if (active()) {
            <div [class]="cx('content')" [pBind]="ptm('content')">
                <ng-content select="[pInplaceContent]"></ng-content>
                <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate(); context: { closeCallback: onDeactivateClick.bind(this) }"></ng-container>
                @if (closable()) {
                    @if (closeIcon()) {
                        <p-button [pt]="ptm('pcButton')" type="button" [icon]="closeIcon()" pRipple (click)="onDeactivateClick($event)" [attr.aria-label]="closeAriaLabel()"></p-button>
                    }
                    @if (!closeIcon()) {
                        <p-button [pt]="ptm('pcButton')" type="button" pRipple (click)="onDeactivateClick($event)" [attr.aria-label]="closeAriaLabel()">
                            <ng-template #icon>
                                @if (!closeIconTemplate() && !_closeIconTemplate()) {
                                    <svg data-p-icon="times" />
                                }
                            </ng-template>
                            <ng-template *ngTemplateOutlet="closeIconTemplate() || _closeIconTemplate()"></ng-template>
                        </p-button>
                    }
                }
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [InplaceStyle, { provide: PARENT_INSTANCE, useExisting: Inplace }],
    host: {
        '[attr.aria-live]': "'polite'",
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class Inplace extends BaseComponent<InplacePassThrough> {
    componentName = 'Inplace';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
    }

    /**
     * Whether the content is displayed or not, supports one or two-way binding as well.
     * Emits `activeChange` with the new value when the content is activated or deactivated.
     * @group Props
     */
    readonly active = model<boolean | undefined>(false);
    /**
     * Displays a button to switch back to display mode.
     * @deprecated since v20.0.0, use `closeCallback` within content template.
     * @group Props
     */
    readonly closable = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    readonly disabled = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * Allows to prevent clicking.
     * @group Props
     */
    readonly preventClick = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Icon to display in the close button.
     * @deprecated since v20.0.0, use the `closeicon` template instead.
     * @group Props
     */
    readonly closeIcon = input<string | undefined>();
    /**
     * Establishes a string value that labels the close button.
     * @group Props
     */
    readonly closeAriaLabel = input<string | undefined>();
    /**
     * Callback to invoke when inplace is opened.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onActivate = output<Event | undefined>();
    /**
     * Callback to invoke when inplace is closed.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onDeactivate = output<Event | undefined>();

    /**
     * Custom display template.
     * @group Templates
     */
    readonly displayTemplate = contentChild<TemplateRef<void>>('display', { descendants: false });
    /**
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<InplaceContentTemplateContext>>('content', { descendants: false });
    /**
     * Custom close icon template.
     * @group Templates
     */
    readonly closeIconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });

    _componentStyle = inject(InplaceStyle);

    onActivateClick(event: MouseEvent) {
        if (!this.preventClick()) this.activate(event);
    }

    onDeactivateClick(event: MouseEvent) {
        if (!this.preventClick()) this.deactivate(event);
    }
    /**
     * Activates the content.
     * @param {Event} event - Browser event.
     * @group Method
     */
    activate(event?: Event) {
        if (!this.disabled()) {
            this.active.set(true);
            this.onActivate.emit(event);
        }
    }
    /**
     * Deactivates the content.
     * @param {Event} event - Browser event.
     * @group Method
     */
    deactivate(event?: Event) {
        if (!this.disabled()) {
            this.active.set(false);
            this.onDeactivate.emit(event);
        }
    }

    onKeydown(event: KeyboardEvent) {
        if (event.code === 'Enter') {
            this.activate(event);
            event.preventDefault();
        }
    }

    readonly templates = contentChildren(PrimeTemplate);

    readonly _displayTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'display')
                .at(-1)?.template
    );

    readonly _closeIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'closeicon')
                .at(-1)?.template
    );

    readonly _contentTemplate = computed<TemplateRef<InplaceContentTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'content')
                .at(-1)?.template
    );
}

@NgModule({
    imports: [Inplace, SharedModule],
    exports: [Inplace, SharedModule]
})
export class InplaceModule {}
