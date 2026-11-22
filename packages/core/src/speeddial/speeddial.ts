import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterNextRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    input,
    model,
    NgModule,
    numberAttribute,
    signal,
    TemplateRef,
    untracked,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { find, findSingle, focus, hasClass, uuid } from '@exhaustive-ui/utils';
import { MenuItem, PrimeTemplate, SharedModule, TooltipOptions } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { ButtonModule, ButtonProps } from '@exhaustive-ui/core/button';
import { PlusIcon } from '@exhaustive-ui/core/icons';
import { Ripple } from '@exhaustive-ui/core/ripple';
import { TooltipModule } from '@exhaustive-ui/core/tooltip';
import { SpeedDialButtonTemplateContext, SpeedDialItemTemplateContext, SpeedDialPassThrough } from '@exhaustive-ui/core/types/speeddial';
import { asapScheduler } from 'rxjs';
import { SpeedDialStyle } from './style/speeddialstyle';

/**
 * When pressed, a floating action button can display multiple primary actions that can be performed on a page.
 * @group Components
 */
@Component({
    selector: 'p-speed-dial, p-speeddial, p-speedDial',
    imports: [CommonModule, ButtonModule, Ripple, TooltipModule, RouterModule, PlusIcon, SharedModule, Bind],
    template: `
        <div #container [pBind]="ptm('root')" [class]="cn(cx('root'), className())" [style]="style()" [ngStyle]="sx('root')">
            @if (!buttonTemplate() && !_buttonTemplate()) {
                <button
                    type="button"
                    pButton
                    pRipple
                    [style]="buttonStyle()"
                    [icon]="buttonIconClass()"
                    [class]="cn(cx('pcButton'), buttonClassName())"
                    [disabled]="disabled()"
                    [attr.aria-expanded]="visible()"
                    [attr.aria-haspopup]="true"
                    [attr.aria-controls]="_id() + '_list'"
                    [attr.aria-label]="ariaLabel()"
                    [attr.aria-labelledby]="ariaLabelledBy()"
                    (click)="onButtonClick($event)"
                    (keydown)="onTogglerKeydown($event)"
                    [buttonProps]="buttonProps()"
                    [pt]="ptm('pcButton')"
                    [unstyled]="unstyled()"
                >
                    @if (!buttonIconClass() && !iconTemplate() && !_iconTemplate()) {
                        <svg data-p-icon="plus" pButtonIcon [pt]="ptm('pcButton')['icon']" />
                    }
                    <ng-container *ngTemplateOutlet="iconTemplate() || _iconTemplate()"></ng-container>
                </button>
            }
            @if (buttonTemplate() || _buttonTemplate()) {
                <ng-container *ngTemplateOutlet="buttonTemplate() || _buttonTemplate(); context: { toggleCallback: onButtonClick.bind(this) }"></ng-container>
            }
            <ul
                #list
                [pBind]="ptm('list')"
                [class]="cx('list')"
                role="menu"
                [id]="_id() + '_list'"
                (focus)="onFocus($event)"
                (focusout)="onBlur($event)"
                (keydown)="onKeyDown($event)"
                [attr.aria-activedescendant]="focused() ? focusedOptionId() : undefined"
                [tabindex]="-1"
                [ngStyle]="sx('list')"
            >
                @for (item of model(); track item; let i = $index) {
                    <li
                        [pBind]="getPTOptions(_id() + '_' + i, 'item')"
                        [ngStyle]="getItemStyle(i)"
                        [class]="cx('item', { item, i })"
                        pTooltip
                        [pTooltipUnstyled]="unstyled()"
                        [tooltipOptions]="item.tooltipOptions || getTooltipOptions(item)"
                        [id]="_id() + '_' + i"
                        [attr.aria-controls]="_id() + '_item'"
                        role="menuitem"
                        [attr.data-p-active]="isItemActive(_id() + '_' + i)"
                    >
                        @if (itemTemplate() || _itemTemplate()) {
                            <ng-container *ngTemplateOutlet="itemTemplate() || _itemTemplate(); context: { $implicit: item, index: i, toggleCallback: onItemClick.bind(this) }"></ng-container>
                        }
                        @if (!itemTemplate() && !_itemTemplate()) {
                            <button
                                type="button"
                                pButton
                                pRipple
                                [class]="cx('pcAction')"
                                severity="secondary"
                                [rounded]="true"
                                size="small"
                                role="menuitem"
                                (click)="onItemClick($event, item)"
                                [disabled]="item?.disabled"
                                (keydown.enter)="onItemClick($event, item)"
                                [attr.aria-label]="item.label"
                                [attr.tabindex]="item.disabled || !visible() ? null : item.tabindex ? item.tabindex : '0'"
                                [pt]="getPTOptions(_id() + '_' + i, 'pcAction')"
                                [unstyled]="unstyled()"
                            >
                                @if (item.icon) {
                                    <span pButtonIcon [pt]="getPTOptions(_id() + '_' + i, 'actionIcon')" [class]="item.icon"></span>
                                }
                            </button>
                        }
                    </li>
                }
            </ul>
        </div>
        @if (mask() && visible()) {
            <div [pBind]="ptm('mask')" [class]="cn(cx('mask'), maskClassName())" [ngStyle]="maskStyle()" animate.enter="p-overlay-mask-enter-active" animate.leave="p-overlay-mask-leave-active"></div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [SpeedDialStyle, { provide: PARENT_INSTANCE, useExisting: SpeedDial }],
    hostDirectives: [Bind]
})
export class SpeedDial extends BaseComponent<SpeedDialPassThrough> {
    componentName = 'SpeedDial';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        effect(() => {
            const visible = this.visible();

            untracked(() => (visible ? this.bindDocumentClickListener() : this.unbindDocumentClickListener()));
        });
        afterNextRender(() => {
            if (this.type() !== 'linear') {
                const button = <any>findSingle(this.container().nativeElement, '[data-pc-name="pcbutton"]');
                const list = this.list();
                const firstItem = <any>findSingle(list.nativeElement, '[data-pc-section="item"]');

                if (button && firstItem) {
                    const wDiff = Math.abs(button.offsetWidth - firstItem.offsetWidth);
                    const hDiff = Math.abs(button.offsetHeight - firstItem.offsetHeight);
                    list?.nativeElement.style.setProperty('--item-diff-x', `${wDiff / 2}px`);
                    list?.nativeElement.style.setProperty('--item-diff-y', `${hDiff / 2}px`);
                }
            }
        });
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptm('host'));
    }

    /**
     * List of items id.
     * @group Props
     */
    readonly id = input<string | undefined>();

    readonly _id = computed(() => this.id() || uuid('pn_id_'));
    /**
     * MenuModel instance to define the action items.
     * @group Props
     */
    readonly model = input<MenuItem[] | null>(null);
    /**
     * Specifies the visibility of the overlay, supports one or two-way binding as well.
     * Emits `visibleChange` with the new value when the visibility of element changed.
     * @defaultValue false
     * @group Props
     */
    readonly visible = model<boolean>(false);
    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the element.
     * @group Props
     */
    readonly className = input<string | undefined>();
    /**
     * Specifies the opening direction of actions.
     * @group Props
     */
    readonly direction = input<'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right' | undefined>('up');
    /**
     * Transition delay step for each action item.
     * @group Props
     */
    readonly transitionDelay = input<number, unknown>(30, { transform: numberAttribute });
    /**
     * Specifies the opening type of actions.
     * @group Props
     */
    readonly type = input<'linear' | 'circle' | 'semi-circle' | 'quarter-circle' | undefined>('linear');
    /**
     * Radius for *circle types.
     * @group Props
     */
    readonly radius = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * Whether to show a mask element behind the speeddial.
     * @group Props
     */
    readonly mask = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the component is disabled.
     * @group Props
     */
    readonly disabled = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the actions close when clicked outside.
     * @group Props
     */
    readonly hideOnClickOutside = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Inline style of the button element.
     * @group Props
     */
    readonly buttonStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the button element.
     * @group Props
     */
    readonly buttonClassName = input<string | undefined>();
    /**
     * Inline style of the mask element.
     * @group Props
     */
    readonly maskStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Style class of the mask element.
     * @group Props
     */
    readonly maskClassName = input<string | undefined>();
    /**
     * Show icon of the button element.
     * @group Props
     */
    readonly showIcon = input<string | undefined>();
    /**
     * Hide icon of the button element.
     * @group Props
     */
    readonly hideIcon = input<string | undefined>();
    /**
     * Defined to rotate showIcon when hideIcon is not present.
     * @group Props
     */
    readonly rotateAnimation = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Defines a string value that labels an interactive element.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();
    /**
     * Identifier of the underlying input element.
     * @group Props
     */
    readonly ariaLabelledBy = input<string | undefined>();
    /**
     * Whether to display the tooltip on items. The modifiers of Tooltip can be used like an object in it. Valid keys are 'event' and 'position'.
     * @group Props
     */
    readonly tooltipOptions = input<TooltipOptions>();
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly buttonProps = input<ButtonProps>();
    /**
     * Fired when the visibility of element changed.
     * @param {boolean} boolean - Visibility value.
     * @group Emits
     */
    readonly onVisibleChange = output<boolean>();
    /**
     * Fired when the button element clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onClick = output<MouseEvent>();
    /**
     * Fired when the actions are visible.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onShow = output<Event | undefined>();
    /**
     * Fired when the actions are hidden.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onHide = output<Event | undefined>();

    readonly container = viewChild.required<ElementRef>('container');

    readonly list = viewChild.required<ElementRef>('list');
    /**
     * Custom button template.
     * @param {SpeedDialButtonTemplateContext} context - button context.
     * @see {@link SpeedDialButtonTemplateContext}
     * @group Templates
     */
    readonly buttonTemplate = contentChild<TemplateRef<SpeedDialButtonTemplateContext>>('button', { descendants: false });
    /**
     * Custom item template.
     * @param {SpeedDialItemTemplateContext} context - item context.
     * @see {@link SpeedDialItemTemplateContext}
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<SpeedDialItemTemplateContext>>('item', { descendants: false });
    /**
     * Custom icon template.
     * @group Templates
     */
    readonly iconTemplate = contentChild<TemplateRef<void>>('icon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    readonly _buttonTemplate = computed<TemplateRef<SpeedDialButtonTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'button')
                .at(-1)?.template
    );

    readonly _itemTemplate = computed<TemplateRef<SpeedDialItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'item')
                .at(-1)?.template
    );

    readonly _iconTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'icon')
                .at(-1)?.template
    );

    isItemClicked = signal<boolean>(false);

    documentClickListener = signal<any>(undefined);

    focusedOptionIndex = signal<any>(null);

    focused = signal<boolean>(false);

    _componentStyle = inject(SpeedDialStyle);

    readonly focusedOptionId = computed(() => (this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : null));

    getTooltipOptions(item: MenuItem) {
        return { ...this.tooltipOptions(), tooltipLabel: item.label, disabled: !this.tooltipOptions() };
    }

    getPTOptions(id: string, key: string) {
        return this.ptm(key, {
            context: {
                active: this.isItemActive(id),
                hidden: !this.visible()
            }
        });
    }

    isItemActive(id: string) {
        return id === this.focusedOptionId();
    }

    show() {
        this.onVisibleChange.emit(true);
        this.visible.set(true);
        this.onShow.emit(undefined);
        this.bindDocumentClickListener();
    }

    hide() {
        this.onVisibleChange.emit(false);
        this.visible.set(false);
        this.onHide.emit(undefined);
        this.unbindDocumentClickListener();
    }

    onButtonClick(event: MouseEvent) {
        this.visible() ? this.hide() : this.show();
        this.onClick.emit(event);
        this.isItemClicked.set(true);
    }

    onItemClick(e: Event, item: MenuItem) {
        if (item.command) {
            item.command({ originalEvent: e, item });
        }

        this.hide();

        this.isItemClicked.set(true);
    }

    onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDown(event);
                break;

            case 'ArrowUp':
                this.onArrowUp(event);
                break;

            case 'ArrowLeft':
                this.onArrowLeft(event);
                break;

            case 'ArrowRight':
                this.onArrowRight(event);
                break;

            case 'Enter':
            case 'Space':
                this.onEnterKey(event);
                break;

            case 'Escape':
                this.onEscapeKey(event);
                break;

            case 'Home':
                this.onHomeKey(event);
                break;

            case 'End':
                this.onEndKey(event);
                break;

            default:
                break;
        }
    }

    onFocus(event) {
        this.focused.set(true);
    }

    onBlur(event) {
        this.focused.set(false);
        asapScheduler.schedule(() => this.focusedOptionIndex.set(-1));
    }

    onArrowUp(event) {
        if (this.direction() === 'up') {
            this.navigateNextItem(event);
        } else if (this.direction() === 'down') {
            this.navigatePrevItem(event);
        } else {
            this.navigateNextItem(event);
        }
    }

    onArrowDown(event) {
        if (this.direction() === 'up') {
            this.navigatePrevItem(event);
        } else if (this.direction() === 'down') {
            this.navigateNextItem(event);
        } else {
            this.navigatePrevItem(event);
        }
    }

    onArrowLeft(event) {
        const leftValidDirections = ['left', 'up-right', 'down-left'];
        const rightValidDirections = ['right', 'up-left', 'down-right'];

        if (leftValidDirections.includes(this.direction() || '')) {
            this.navigateNextItem(event);
        } else if (rightValidDirections.includes(this.direction() || '')) {
            this.navigatePrevItem(event);
        } else {
            this.navigatePrevItem(event);
        }
    }

    onArrowRight(event) {
        const leftValidDirections = ['left', 'up-right', 'down-left'];
        const rightValidDirections = ['right', 'up-left', 'down-right'];

        if (leftValidDirections.includes(this.direction() || '')) {
            this.navigatePrevItem(event);
        } else if (rightValidDirections.includes(this.direction() || '')) {
            this.navigateNextItem(event);
        } else {
            this.navigateNextItem(event);
        }
    }

    onEndKey(event: any) {
        event.preventDefault();

        this.focusedOptionIndex.set(-1);
        this.navigatePrevItem(event);
    }

    onHomeKey(event: any) {
        event.preventDefault();

        this.focusedOptionIndex.set(-1);
        this.navigateNextItem(event);
    }

    onEnterKey(event: any) {
        const container = this.container();
        const items = find(container.nativeElement, '[data-pc-section="item"]');
        const itemIndex = [...items].findIndex((item) => item.id === this.focusedOptionIndex());
        const model = this.model();

        if (itemIndex !== -1 && model && model[itemIndex]) {
            this.onItemClick(event, model[itemIndex]);
        }
        this.onBlur(event);

        const buttonEl = <any>findSingle(container?.nativeElement, 'button');

        buttonEl && focus(buttonEl);
    }

    onEscapeKey(event: KeyboardEvent) {
        this.hide();

        const buttonEl = <any>findSingle(this.container().nativeElement, 'button');

        buttonEl && focus(buttonEl);
    }

    onTogglerKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowDown':
            case 'ArrowLeft':
                this.onTogglerArrowDown(event);

                break;

            case 'ArrowUp':
            case 'ArrowRight':
                this.onTogglerArrowUp(event);

                break;

            case 'Escape':
                this.onEscapeKey(event);

                break;

            default:
                break;
        }
    }

    onTogglerArrowUp(event) {
        this.focused.set(true);
        focus(this.list().nativeElement);

        this.show();
        this.navigatePrevItem(event);

        event.preventDefault();
    }

    onTogglerArrowDown(event) {
        this.focused.set(true);
        focus(this.list().nativeElement);

        this.show();
        this.navigateNextItem(event);

        event.preventDefault();
    }

    navigateNextItem(event) {
        const optionIndex = this.findNextOptionIndex(this.focusedOptionIndex());

        this.changeFocusedOptionIndex(optionIndex);

        event.preventDefault();
    }

    navigatePrevItem(event) {
        const optionIndex = this.findPrevOptionIndex(this.focusedOptionIndex());

        this.changeFocusedOptionIndex(optionIndex);

        event.preventDefault();
    }

    findPrevOptionIndex(index) {
        const items = find(this.container().nativeElement, '[data-pc-section="item"]');

        const filteredItems = [...items].filter((item) => !hasClass(findSingle(item, 'a')!, 'p-disabled'));
        const newIndex = index === -1 ? filteredItems[filteredItems.length - 1].id : index;
        let matchedOptionIndex = filteredItems.findIndex((link) => link.getAttribute('id') === newIndex);

        matchedOptionIndex = index === -1 ? filteredItems.length - 1 : matchedOptionIndex - 1;

        return matchedOptionIndex;
    }

    findNextOptionIndex(index) {
        const items = find(this.container().nativeElement, '[data-pc-section="item"]');
        const filteredItems = [...items].filter((item) => !hasClass(findSingle(item, 'a')!, 'p-disabled'));
        const newIndex = index === -1 ? filteredItems[0].id : index;
        let matchedOptionIndex = filteredItems.findIndex((link) => link.getAttribute('id') === newIndex);

        matchedOptionIndex = index === -1 ? 0 : matchedOptionIndex + 1;

        return matchedOptionIndex;
    }

    changeFocusedOptionIndex(index) {
        const items = find(this.container().nativeElement, '[data-pc-section="item"]');
        const filteredItems = [...items].filter((item) => !hasClass(findSingle(item, 'a')!, 'p-disabled'));

        if (filteredItems[index]) {
            this.focusedOptionIndex.set(filteredItems[index].getAttribute('id'));
        }
    }

    calculatePointStyle(index: number) {
        const type = this.type();

        if (type !== 'linear') {
            const length = (this.model() as MenuItem[]).length;
            const radius = this.radius() || length * 20;

            if (type === 'circle') {
                const step = (2 * Math.PI) / length;

                return {
                    left: `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`,
                    top: `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`
                };
            } else if (type === 'semi-circle') {
                const direction = this.direction();
                const step = Math.PI / (length - 1);
                const x = `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`;
                const y = `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`;
                if (direction === 'up') {
                    return { left: x, bottom: y };
                } else if (direction === 'down') {
                    return { left: x, top: y };
                } else if (direction === 'left') {
                    return { right: y, top: x };
                } else if (direction === 'right') {
                    return { left: y, top: x };
                }
            } else if (type === 'quarter-circle') {
                const direction = this.direction();
                const step = Math.PI / (2 * (length - 1));
                const x = `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`;
                const y = `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`;
                if (direction === 'up-left') {
                    return { right: x, bottom: y };
                } else if (direction === 'up-right') {
                    return { left: x, bottom: y };
                } else if (direction === 'down-left') {
                    return { right: y, top: x };
                } else if (direction === 'down-right') {
                    return { left: y, top: x };
                }
            }
        }

        return {};
    }

    calculateTransitionDelay(index: number) {
        const length = (this.model() as MenuItem[]).length;

        return (this.visible() ? index : length - index - 1) * this.transitionDelay();
    }

    readonly buttonIconClass = computed(() => {
        if (!this.visible() && this.showIcon()) {
            return this.showIcon();
        }
        if (this.visible() && this.hideIcon()) {
            return this.hideIcon();
        }
        return this.showIcon();
    });

    getItemStyle(index: number) {
        const transitionDelay = this.calculateTransitionDelay(index);
        const pointStyle = this.calculatePointStyle(index);
        return {
            transitionDelay: `${transitionDelay}ms`,
            ...pointStyle
        };
    }

    isClickableRouterLink(item: MenuItem) {
        return item.routerLink && !this.disabled() && !item.disabled;
    }

    isOutsideClicked(event: Event) {
        const container = this.container();
        return !(container.nativeElement.isSameNode(event.target) || container.nativeElement.contains(event.target) || this.isItemClicked());
    }

    bindDocumentClickListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentClickListener() && this.hideOnClickOutside()) {
                this.documentClickListener.set(
                    this.renderer.listen(this.document, 'click', (event) => {
                        if (this.visible() && this.isOutsideClicked(event)) {
                            this.hide();
                        }

                        this.isItemClicked.set(false);
                    })
                );
            }
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener()) {
            this.documentClickListener()();
            this.documentClickListener.set(null);
        }
    }

    onDestroy() {
        this.unbindDocumentClickListener();
    }
}

@NgModule({
    imports: [SpeedDial, SharedModule],
    exports: [SpeedDial, SharedModule]
})
export class SpeedDialModule {}
