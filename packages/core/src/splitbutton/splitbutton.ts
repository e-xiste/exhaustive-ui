import { CommonModule } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    InjectionToken,
    input,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { MotionOptions } from '@exhaustive-ui/motion';
import { uuid } from '@exhaustive-ui/utils';
import { MenuItem, PrimeTemplate, SharedModule, TooltipOptions } from '@exhaustive-ui/core/api';
import { AutoFocus } from '@exhaustive-ui/core/autofocus';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { ButtonDirective } from '@exhaustive-ui/core/button';
import { ChevronDownIcon } from '@exhaustive-ui/core/icons';
import { Ripple } from '@exhaustive-ui/core/ripple';
import { TieredMenu } from '@exhaustive-ui/core/tieredmenu';
import { TooltipModule } from '@exhaustive-ui/core/tooltip';
import type { ButtonSeverity } from '@exhaustive-ui/core/types/button';
import { ButtonProps, MenuButtonProps, SplitButtonPassThrough } from '@exhaustive-ui/core/types/splitbutton';
import { SplitButtonStyle } from './style/splitbuttonstyle';

const SPLITBUTTON_INSTANCE = new InjectionToken<SplitButton>('SPLITBUTTON_INSTANCE');

type SplitButtonIconPosition = 'left' | 'right';
/**
 * SplitButton groups a set of commands in an overlay with a default command.
 * @group Components
 */
@Component({
    selector: 'p-splitbutton, p-splitButton, p-split-button',
    imports: [CommonModule, ButtonDirective, TieredMenu, AutoFocus, ChevronDownIcon, Ripple, TooltipModule, SharedModule],
    template: `
        @if (contentTemplate() || _contentTemplate()) {
            <button
                [class]="cx('pcButton')"
                type="button"
                pButton
                pRipple
                [severity]="severity()"
                [text]="text()"
                [outlined]="outlined()"
                [size]="size()"
                [icon]="icon()"
                [iconPos]="iconPos()"
                (click)="onDefaultButtonClick($event)"
                [disabled]="disabled()"
                [attr.tabindex]="tabindex()"
                [attr.aria-label]="buttonProps()?.['ariaLabel'] || label()"
                [pAutoFocus]="autofocus()"
                [pTooltip]="tooltip()"
                [pTooltipUnstyled]="unstyled()"
                [tooltipOptions]="tooltipOptions()"
                [pt]="ptm('pcButton')"
                [unstyled]="unstyled()"
            >
                <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate()"></ng-container>
            </button>
        } @else {
            <button
                #defaultbtn
                [class]="cx('pcButton')"
                type="button"
                pButton
                pRipple
                [severity]="severity()"
                [text]="text()"
                [outlined]="outlined()"
                [size]="size()"
                [icon]="icon()"
                [iconPos]="iconPos()"
                [label]="label()"
                (click)="onDefaultButtonClick($event)"
                [disabled]="$buttonDisabled()"
                [attr.tabindex]="tabindex()"
                [attr.aria-label]="buttonProps()?.['ariaLabel']"
                [pAutoFocus]="autofocus()"
                [pTooltip]="tooltip()"
                [pTooltipUnstyled]="unstyled()"
                [tooltipOptions]="tooltipOptions()"
                [pt]="ptm('pcButton')"
                [unstyled]="unstyled()"
            ></button>
        }
        <button
            type="button"
            pButton
            pRipple
            [size]="size()"
            [severity]="severity()"
            [text]="text()"
            [outlined]="outlined()"
            [class]="cx('pcDropdown')"
            (click)="onDropdownButtonClick($event)"
            (keydown)="onDropdownButtonKeydown($event)"
            [disabled]="$menuButtonDisabled()"
            [attr.aria-label]="menuButtonProps()?.['ariaLabel'] || expandAriaLabel()"
            [attr.aria-haspopup]="menuButtonProps()?.['ariaHasPopup'] || true"
            [attr.aria-expanded]="menuButtonProps()?.['ariaExpanded'] || isExpanded()"
            [attr.aria-controls]="menuButtonProps()?.['ariaControls'] || ariaId"
            [pt]="ptm('pcDropdown')"
            [unstyled]="unstyled()"
        >
            @if (dropdownIcon()) {
                <span [class]="dropdownIcon()"></span>
            }
            @if (!dropdownIcon()) {
                @if (!dropdownIconTemplate() && !_dropdownIconTemplate()) {
                    <svg data-p-icon="chevron-down" />
                }
                <ng-template *ngTemplateOutlet="dropdownIconTemplate() || _dropdownIconTemplate()"></ng-template>
            }
        </button>
        <p-tieredmenu
            [id]="ariaId"
            #menu
            [popup]="true"
            [model]="model()"
            [style]="menuStyle()"
            [styleClass]="menuStyleClass()"
            [appendTo]="$appendTo()"
            [motionOptions]="computedMotionOptions()"
            (onHide)="onHide()"
            (onShow)="onShow()"
            [pt]="ptm('pcMenu')"
            [unstyled]="unstyled()"
        ></p-tieredmenu>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SplitButtonStyle, { provide: SPLITBUTTON_INSTANCE, useExisting: SplitButton }, { provide: PARENT_INSTANCE, useExisting: SplitButton }],
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[attr.data-p-severity]': 'severity()'
    },
    hostDirectives: [Bind]
})
export class SplitButton extends BaseComponent<SplitButtonPassThrough> {
    componentName = 'SplitButton';
    $pcSplitButton: SplitButton | undefined = inject(SPLITBUTTON_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }
    /**
     * MenuModel instance to define the overlay items.
     * @group Props
     */
    readonly model = input<MenuItem[] | undefined>();
    /**
     * Defines the style of the button.
     * @group Props
     */
    readonly severity = input<ButtonSeverity>();
    /**
     * Add a shadow to indicate elevation.
     * @group Props
     */
    readonly raised = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Add a circular border radius to the button.
     * @group Props
     */
    readonly rounded = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Add a textual class to the button without a background initially.
     * @group Props
     */
    readonly text = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Add a border class without a background initially.
     * @group Props
     */
    readonly outlined = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Defines the size of the button.
     * @group Props
     */
    readonly size = input<'small' | 'large' | undefined | null>(null);
    /**
     * Name of the icon.
     * @group Props
     */
    readonly icon = input<string | undefined>();
    /**
     * Position of the icon.
     * @group Props
     */
    readonly iconPos = input<SplitButtonIconPosition>('left');
    /**
     * Text of the button.
     * @group Props
     */
    readonly label = input<string | undefined>();
    /**
     * Tooltip for the main button.
     * @group Props
     */
    readonly tooltip = input<string | undefined>();
    /**
     * Tooltip options for the main button.
     * @group Props
     */
    readonly tooltipOptions = input<TooltipOptions | undefined>();
    /**
     * Inline style of the overlay menu.
     * @group Props
     */
    readonly menuStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the overlay menu.
     * @group Props
     */
    readonly menuStyleClass = input<string | undefined>();
    /**
     * Name of the dropdown icon.
     * @group Props
     */
    readonly dropdownIcon = input<string | undefined>();
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'body'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>('body');
    /**
     * Defines a string that labels the expand button for accessibility.
     * @group Props
     */
    readonly expandAriaLabel = input<string | undefined>();
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
     * Button Props
     */
    readonly buttonProps = input<ButtonProps | undefined>();
    /**
     * Menu Button Props
     */
    readonly menuButtonProps = input<MenuButtonProps | undefined>();
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    readonly autofocus = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    /**
     * When present, it specifies that the menu button element should be disabled.
     * @group Props
     */
    readonly menuButtonDisabled = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * When present, it specifies that the button element should be disabled.
     * @group Props
     */
    readonly buttonDisabled = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly $buttonDisabled = computed(() => this.disabled() || this.buttonDisabled());

    readonly $menuButtonDisabled = computed(() => this.disabled() || this.menuButtonDisabled());
    /**
     * Callback to invoke when default command button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onClick = output<MouseEvent>();
    /**
     * Callback to invoke when overlay menu is hidden.
     * @group Emits
     */
    readonly onMenuHide = output<any>();
    /**
     * Callback to invoke when overlay menu is shown.
     * @group Emits
     */
    readonly onMenuShow = output<any>();
    /**
     * Callback to invoke when dropdown button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onDropdownClick = output<MouseEvent | undefined>();

    readonly menu = viewChild.required<TieredMenu>('menu');
    /**
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });
    /**
     * Custom dropdown icon template.
     * @group Templates
     **/
    readonly dropdownIconTemplate = contentChild<TemplateRef<void>>('dropdownicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    ariaId = uuid('pn_id_');

    isExpanded = signal<boolean>(false);

    _componentStyle = inject(SplitButtonStyle);

    readonly _contentTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() !== 'dropdownicon')
                .at(-1)?.template
    );

    readonly _dropdownIconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'dropdownicon')
                .at(-1)?.template
    );

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    onDefaultButtonClick(event: MouseEvent) {
        this.onClick?.emit(event);
        this.menu().hide();
    }

    onDropdownButtonClick(event?: MouseEvent) {
        this.onDropdownClick.emit(event);
        this.menu().toggle({ currentTarget: this.el?.nativeElement, relativeAlign: this.$appendTo() == 'self' });
    }

    onDropdownButtonKeydown(event: KeyboardEvent) {
        if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
            this.onDropdownButtonClick();
            event.preventDefault();
        }
    }

    onHide() {
        this.isExpanded.set(false);
        this.onMenuHide.emit(undefined);
    }

    onShow() {
        this.isExpanded.set(true);
        this.onMenuShow.emit(undefined);
    }
}

@NgModule({
    imports: [SplitButton, SharedModule],
    exports: [SplitButton, SharedModule]
})
export class SplitButtonModule {}
