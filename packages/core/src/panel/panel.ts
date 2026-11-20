import { CommonModule } from '@angular/common';
import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, model, NgModule, TemplateRef, ViewEncapsulation, contentChild, viewChild, contentChildren, output } from '@angular/core';
import { MotionEvent, MotionOptions } from '@exhaustive-ui/motion';
import { uuid } from '@exhaustive-ui/utils';
import { BlockableUI, Footer, PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { MinusIcon, PlusIcon } from '@exhaustive-ui/core/icons';
import { MotionModule } from '@exhaustive-ui/core/motion';
import type { PanelAfterToggleEvent, PanelBeforeToggleEvent, PanelHeaderIconsTemplateContext, PanelPassThrough } from '@exhaustive-ui/core/types/panel';
import { PanelStyle } from './style/panelstyle';

/**
 * Panel is a container with the optional content toggle feature.
 * @group Components
 */
@Component({
    selector: 'p-panel',
    imports: [CommonModule, PlusIcon, MinusIcon, ButtonModule, SharedModule, BindModule, MotionModule],
    template: `
        @if (showHeader()) {
            <div [pBind]="ptm('header')" [class]="cx('header')" (click)="onHeaderClick($event)" [attr.id]="id() + '-titlebar'" [attr.data-p]="dataP()">
                @if (_header()) {
                    <span [pBind]="ptm('title')" [class]="cx('title')" [attr.id]="id() + '_header'">{{ _header() }}</span>
                }
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate() || _headerTemplate()"></ng-container>
                <div [pBind]="ptm('headerActions')" [class]="cx('headerActions')">
                    <ng-template *ngTemplateOutlet="iconsTemplate() || _iconsTemplate()"></ng-template>
                    @if (toggleable()) {
                        <p-button
                            [attr.id]="id() + '_header'"
                            severity="secondary"
                            [text]="true"
                            [rounded]="true"
                            type="button"
                            [styleClass]="cx('pcToggleButton')"
                            [ariaLabel]="buttonAriaLabel()"
                            [ariaControls]="id() + '_content'"
                            [ariaExpanded]="!collapsed()"
                            (click)="onIconClick($event)"
                            (keydown)="onKeyDown($event)"
                            [buttonProps]="toggleButtonProps()"
                            [pt]="ptm('pcToggleButton')"
                            [unstyled]="unstyled()"
                        >
                            <ng-template #icon>
                                @if (!headerIconsTemplate() && !_headerIconsTemplate() && !toggleButtonProps()?.icon) {
                                    @if (!collapsed()) {
                                        <svg data-p-icon="minus" [pBind]="ptm('pcToggleButton.icon')" />
                                    }
                                    @if (collapsed()) {
                                        <svg data-p-icon="plus" [pBind]="ptm('pcToggleButton.icon')" />
                                    }
                                }
                                <ng-template *ngTemplateOutlet="headerIconsTemplate() || _headerIconsTemplate(); context: { $implicit: collapsed() }"></ng-template>
                            </ng-template>
                        </p-button>
                    }
                </div>
            </div>
        }
        <div
            [pBind]="ptm('contentContainer')"
            [pMotion]="!toggleable() || (toggleable() && !collapsed())"
            pMotionName="p-collapsible"
            [pMotionOptions]="computedMotionOptions()"
            [class]="cx('contentContainer')"
            [id]="id() + '_content'"
            role="region"
            [attr.aria-labelledby]="id() + '_header'"
            [attr.aria-hidden]="collapsed()"
            [attr.tabindex]="collapsed() ? '-1' : undefined"
            (pMotionOnAfterEnter)="onToggleDone($event)"
        >
            <div [pBind]="ptm('contentWrapper')" [class]="cx('contentWrapper')">
                <div [pBind]="ptm('content')" [class]="cx('content')" #contentWrapper>
                    <ng-content></ng-content>
                    <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate()"></ng-container>
                </div>

                @if (footerFacet() || footerTemplate() || _footerTemplate()) {
                    <div [pBind]="ptm('footer')" [class]="cx('footer')">
                        <ng-content select="p-footer"></ng-content>
                        <ng-container *ngTemplateOutlet="footerTemplate() || _footerTemplate()"></ng-container>
                    </div>
                }
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [PanelStyle, { provide: PARENT_INSTANCE, useExisting: Panel }],
    host: {
        '[id]': 'id()',
        '[class]': "cx('root')",
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class Panel extends BaseComponent<PanelPassThrough> implements BlockableUI {
    componentName = 'Panel';

    _componentStyle = inject(PanelStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }

    /**
     * Id of the component.
     */
    readonly id = input<string | undefined>(uuid('pn_id_'));
    /**
     * Defines if content of panel can be expanded and collapsed.
     * @group Props
     */
    readonly toggleable = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });

    /**
     * Header text of the panel.
     * @group Props
     */
    readonly _header = input<string | undefined>(undefined, { alias: 'header' });

    /**
     * Defines the initial state of panel content, supports one or two-way binding as well.
     * Emits `collapsedChange` with the new value when the collapsed state changes.
     * @group Props
     */
    readonly collapsed = model<boolean | undefined>();

    /**
     * Position of the icons.
     * @group Props
     */
    readonly iconPos = input<'start' | 'end' | 'center'>('end');

    /**
     * Specifies if header of panel cannot be displayed.
     * @group Props
     */
    readonly showHeader = input<boolean, unknown>(true, { transform: booleanAttribute });

    /**
     * Specifies the toggler element to toggle the panel content.
     * @group Props
     */
    readonly toggler = input<'icon' | 'header'>('icon');

    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly toggleButtonProps = input<any>();

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
     * Callback to invoke before panel toggle.
     * @param {PanelBeforeToggleEvent} event - Custom panel toggle event
     * @group Emits
     */
    readonly onBeforeToggle = output<PanelBeforeToggleEvent>();

    /**
     * Callback to invoke after panel toggle.
     * @param {PanelAfterToggleEvent} event - Custom panel toggle event
     * @group Emits
     */
    readonly onAfterToggle = output<PanelAfterToggleEvent>();

    readonly footerFacet = contentChild(Footer);
    /**
     * Defines template option for header.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });
    /**
     * Defines template option for icons.
     * @example
     * ```html
     * <ng-template #icons> </ng-template>
     * ```
     * @group Templates
     */
    readonly iconsTemplate = contentChild<TemplateRef<void>>('icons', { descendants: false });

    /**
     * Defines template option for content.
     * @example
     * ```html
     * <ng-template #content> </ng-template>
     * ```
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });

    /**
     * Defines template option for footer.
     * @example
     * ```html
     * <ng-template #footer> </ng-template>
     * ```
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });

    /**
     * Defines template option for headerIcon.
     * @param {PanelHeaderIconsTemplateContext} context - context of the template.
     * @example
     * ```html
     * <ng-template #headericons let-collapsed> </ng-template>
     * ```
     * @see {@link PanelHeaderIconsTemplateContext}
     * @group Templates
     */
    readonly headerIconsTemplate = contentChild<TemplateRef<PanelHeaderIconsTemplateContext>>('headericons', { descendants: false });

    readonly _headerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'header')
                .at(-1)?.template
    );

    readonly _iconsTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'icons')
                .at(-1)?.template
    );

    readonly _contentTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => !['header', 'footer', 'icons', 'headericons'].includes(item.getType()))
                .at(-1)?.template
    );

    readonly _footerTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'footer')
                .at(-1)?.template
    );

    readonly _headerIconsTemplate = computed<TemplateRef<PanelHeaderIconsTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'headericons')
                .at(-1)?.template
    );

    readonly contentWrapperViewChild = viewChild.required<ElementRef>('contentWrapper');

    readonly buttonAriaLabel = computed(() => this._header());

    onHeaderClick(event: MouseEvent) {
        if (this.toggler() === 'header') {
            this.toggle(event);
        }
    }

    onIconClick(event: MouseEvent) {
        if (this.toggler() === 'icon') {
            this.toggle(event);
        }
    }

    toggle(event: MouseEvent) {
        this.onBeforeToggle.emit({ originalEvent: event, collapsed: this.collapsed() });

        if (this.collapsed()) this.expand();
        else this.collapse();

        event.preventDefault();
    }

    expand() {
        this.collapsed.set(false);
        this.updateTabIndex();
    }

    collapse() {
        this.collapsed.set(true);
        this.updateTabIndex();
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement;
    }

    updateTabIndex() {
        const focusableElements = this.contentWrapperViewChild().nativeElement.querySelectorAll('input, button, select, a, textarea, [tabindex]');
        focusableElements.forEach((element: HTMLElement) => {
            if (this.collapsed()) {
                element.setAttribute('tabindex', '-1');
            } else {
                element.removeAttribute('tabindex');
            }
        });
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.code === 'Enter' || event.code === 'Space') {
            this.toggle(event as any);
            event.preventDefault();
        }
    }

    onToggleDone(event: MotionEvent) {
        this.onAfterToggle.emit({ originalEvent: event as any, collapsed: this.collapsed() });
    }

    readonly templates = contentChildren(PrimeTemplate);

    readonly dataP = computed(() =>
        this.cn({
            toggleable: this.toggleable()
        })
    );
}

@NgModule({
    imports: [Panel, SharedModule, BindModule],
    exports: [Panel, SharedModule, BindModule]
})
export class PanelModule {}
