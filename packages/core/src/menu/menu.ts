import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    afterEveryRender,
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    input,
    NgModule,
    numberAttribute,
    Pipe,
    PipeTransform,
    PLATFORM_ID,
    signal,
    TemplateRef,
    viewChild,
    ViewEncapsulation,
    ViewRef,
    contentChild,
    contentChildren,
    output
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MotionEvent, MotionOptions } from '@exhaustive-ui/motion';
import { absolutePosition, addStyle, appendChild, find, findSingle, focus, isTouchDevice, uuid } from '@exhaustive-ui/utils';
import { MenuItem, OverlayService, PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { BadgeModule } from '@exhaustive-ui/core/badge';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { ConnectedOverlayScrollHandler } from '@exhaustive-ui/core/dom';
import { MotionModule } from '@exhaustive-ui/core/motion';
import { Ripple } from '@exhaustive-ui/core/ripple';
import { TooltipModule } from '@exhaustive-ui/core/tooltip';
import { VoidListener } from '@exhaustive-ui/core/ts-helpers';
import { MenuItemTemplateContext, MenuPassThrough, MenuSubmenuHeaderTemplateContext } from '@exhaustive-ui/core/types/menu';
import { ZIndexUtils } from '@exhaustive-ui/core/utils';
import { MenuStyle } from './style/menustyle';

@Pipe({
    name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly sanitizer = inject(DomSanitizer);

    public transform(value: string): SafeHtml {
        if (!value || !isPlatformBrowser(this.platformId)) {
            return value;
        }

        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: '[pMenuItemContent]',
    imports: [CommonModule, RouterModule, Ripple, TooltipModule, BadgeModule, SharedModule, SafeHtmlPipe, BindModule],
    template: ` <div [class]="cx('itemContent')" (click)="onItemClick($event, item())" [attr.data-pc-section]="'content'" [pBind]="getPTOptions('itemContent')">
        @if (!itemTemplate()) {
            @if (!item()?.routerLink) {
                <a
                    [attr.title]="item().title"
                    [attr.href]="item().url || null"
                    [attr.data-automationid]="item().automationId"
                    [attr.tabindex]="-1"
                    [class]="cn(cx('itemLink'), item()?.linkClass)"
                    [ngStyle]="item()?.linkStyle"
                    [target]="item().target"
                    [pBind]="getPTOptions('itemLink')"
                    pRipple
                >
                    <ng-container *ngTemplateOutlet="itemContent; context: { $implicit: item() }"></ng-container>
                </a>
            }
            @if (item()?.routerLink) {
                <a
                    [routerLink]="item().routerLink"
                    [attr.data-automationid]="item().automationId"
                    [attr.tabindex]="-1"
                    [attr.title]="item().title"
                    [queryParams]="item().queryParams"
                    routerLinkActive="p-menu-item-link-active"
                    [routerLinkActiveOptions]="item().routerLinkActiveOptions || { exact: false }"
                    [class]="cn(cx('itemLink'), item()?.linkClass)"
                    [ngStyle]="item()?.linkStyle"
                    [target]="item().target"
                    [fragment]="item().fragment"
                    [queryParamsHandling]="item().queryParamsHandling"
                    [preserveFragment]="item().preserveFragment"
                    [skipLocationChange]="item().skipLocationChange"
                    [replaceUrl]="item().replaceUrl"
                    [state]="item().state"
                    [pBind]="getPTOptions('itemLink')"
                    pRipple
                >
                    <ng-container *ngTemplateOutlet="itemContent; context: { $implicit: item() }"></ng-container>
                </a>
            }
        }

        @if (itemTemplate()) {
            <ng-template *ngTemplateOutlet="itemTemplate(); context: { $implicit: item() }"></ng-template>
        }

        <ng-template #itemContent>
            @if (item().icon) {
                <span [class]="cn(cx('itemIcon', { item: item() }), item().iconClass)" [pBind]="getPTOptions('itemIcon')" [ngStyle]="item().iconStyle" [attr.data-pc-section]="'itemicon'"></span>
            }
            @if (item().escape !== false) {
                <span [class]="cn(cx('itemLabel'), item().labelClass)" [ngStyle]="item().labelStyle" [pBind]="getPTOptions('itemLabel')" [attr.data-pc-section]="'itemlabel'">{{ item().label }}</span>
            } @else {
                <span [class]="cn(cx('itemLabel'), item().labelClass)" [ngStyle]="item().labelStyle" [attr.data-pc-section]="'itemlabel'" [innerHTML]="item().label | safeHtml" [pBind]="getPTOptions('itemLabel')"></span>
            }
            @if (item().badge) {
                <p-badge [class]="item().badgeStyleClass" [value]="item().badge" [pt]="getPTOptions('pcBadge')" [unstyled]="unstyled()" />
            }
        </ng-template>
    </div>`,
    encapsulation: ViewEncapsulation.None,
    providers: [MenuStyle]
})
export class MenuItemContent extends BaseComponent {
    item = input<MenuItem | undefined>(undefined, { alias: 'pMenuItemContent' });

    itemTemplate = input<any | undefined>(undefined);

    menuitemId = input<string>('');

    idx = input<number>(0);

    readonly onMenuItemClick = output<any>();

    menu = inject(Menu);

    _componentStyle = inject(MenuStyle);

    hostName = 'Menu';

    onItemClick(event, item) {
        this.onMenuItemClick.emit({ originalEvent: event, item });
    }

    getPTOptions(key: string) {
        return this.menu.getPTOptions(key, this.item(), this.idx(), this.menuitemId());
    }
}
/**
 * Menu is a navigation / command component that supports dynamic and static positioning.
 * @group Components
 */
@Component({
    selector: 'p-menu',
    imports: [CommonModule, RouterModule, MenuItemContent, TooltipModule, BadgeModule, SharedModule, SafeHtmlPipe, BindModule, MotionModule],
    template: `
        @if (!popup() || overlayVisible()) {
            <div
                #container
                [class]="cn(cx('root'), styleClass())"
                [style]="sx('root')"
                [ngStyle]="style()"
                (click)="onOverlayClick($event)"
                [attr.id]="_id()"
                [pBind]="ptm('root')"
                [attr.data-p]="dataP()"
                [pMotion]="visible() || !popup()"
                [pMotionName]="'p-anchored-overlay'"
                [pMotionAppear]="!!popup()"
                [pMotionDisabled]="!popup()"
                [pMotionOptions]="computedMotionOptions()"
                (pMotionOnBeforeEnter)="onOverlayBeforeEnter($event)"
                (pMotionOnAfterLeave)="onOverlayAfterLeave()"
            >
                @if (startTemplate() ?? _startTemplate()) {
                    <div [class]="cx('start')" [pBind]="ptm('start')" [attr.data-pc-section]="'start'">
                        <ng-container *ngTemplateOutlet="startTemplate() ?? _startTemplate()"></ng-container>
                    </div>
                }
                <ul
                    #list
                    [class]="cx('list')"
                    [pBind]="ptm('list')"
                    role="menu"
                    [attr.id]="_id() + '_list'"
                    [attr.tabindex]="getTabIndexValue()"
                    [attr.data-pc-section]="'menu'"
                    [attr.aria-activedescendant]="activedescendant()"
                    [attr.aria-label]="ariaLabel()"
                    [attr.aria-labelledBy]="ariaLabelledBy()"
                    (focus)="onListFocus($event)"
                    (blur)="onListBlur($event)"
                    (keydown)="onListKeyDown($event)"
                >
                    @if (hasSubMenu()) {
                        @for (submenu of model(); track submenu; let i = $index) {
                            @if (submenu.visible !== false) {
                                @if (submenu.separator) {
                                    <li [class]="cx('separator')" [pBind]="ptm('separator')" role="separator" [attr.data-pc-section]="'separator'"></li>
                                } @else {
                                    <li
                                        [class]="cx('submenuLabel')"
                                        [pBind]="ptm('submenuLabel')"
                                        [attr.data-automationid]="submenu.automationId"
                                        pTooltip
                                        [tooltipOptions]="submenu.tooltipOptions"
                                        [pTooltipUnstyled]="unstyled()"
                                        role="none"
                                        [attr.id]="menuitemId(submenu, _id(), i)"
                                        [attr.data-pc-section]="'submenulabel'"
                                    >
                                        @let submenuHeader = submenuHeaderTemplate() ?? _submenuHeaderTemplate();
                                        @if (submenuHeader) {
                                            <ng-container *ngTemplateOutlet="submenuHeader; context: { $implicit: submenu }"></ng-container>
                                        } @else {
                                            @if (submenu.escape !== false) {
                                                <span>{{ submenu.label }}</span>
                                            } @else {
                                                <span [innerHTML]="submenu.label ?? '' | safeHtml"></span>
                                            }
                                        }
                                    </li>
                                }
                            }
                            @for (item of submenu.items; track item; let j = $index) {
                                @if (item.separator && (item.visible !== false || submenu.visible !== false)) {
                                    <li [class]="cx('separator')" [pBind]="ptm('separator')" role="separator" [attr.data-pc-section]="'separator'"></li>
                                }
                                @if (!item.separator && item.visible !== false && (item.visible !== undefined || submenu.visible !== false)) {
                                    <li
                                        [class]="cn(cx('item', { item, id: menuitemId(item, _id(), i, j) }), item?.styleClass)"
                                        [pBind]="ptm('item')"
                                        [pMenuItemContent]="item"
                                        [itemTemplate]="itemTemplate() ?? _itemTemplate()"
                                        [idx]="j"
                                        [menuitemId]="menuitemId(item, _id(), i, j)"
                                        [style]="item.style"
                                        (onMenuItemClick)="itemClick($event, menuitemId(item, _id(), i, j))"
                                        pTooltip
                                        [tooltipOptions]="item.tooltipOptions"
                                        [pTooltipUnstyled]="unstyled()"
                                        [unstyled]="unstyled()"
                                        role="menuitem"
                                        [attr.aria-label]="label(item.label)"
                                        [attr.data-p-focused]="isItemFocused(menuitemId(item, _id(), i, j))"
                                        [attr.data-p-disabled]="disabled(item.disabled)"
                                        [attr.aria-disabled]="disabled(item.disabled)"
                                        [attr.id]="menuitemId(item, _id(), i, j)"
                                    ></li>
                                }
                            }
                        }
                    }
                    @if (!hasSubMenu()) {
                        @for (item of model(); track item; let i = $index) {
                            @if (item.separator && item.visible !== false) {
                                <li [class]="cx('separator')" [pBind]="ptm('separator')" role="separator" [attr.data-pc-section]="'separator'"></li>
                            }
                            @if (!item.separator && item.visible !== false) {
                                <li
                                    [class]="cn(cx('item', { item, id: menuitemId(item, _id(), i) }), item?.styleClass)"
                                    [pBind]="ptm('item')"
                                    [pMenuItemContent]="item"
                                    [itemTemplate]="itemTemplate() ?? _itemTemplate()"
                                    [idx]="i"
                                    [menuitemId]="menuitemId(item, _id(), i)"
                                    [ngStyle]="item.style"
                                    (onMenuItemClick)="itemClick($event, menuitemId(item, _id(), i))"
                                    pTooltip
                                    [tooltipOptions]="item.tooltipOptions"
                                    [unstyled]="unstyled()"
                                    [pTooltipUnstyled]="unstyled()"
                                    role="menuitem"
                                    [attr.aria-label]="label(item.label)"
                                    [attr.data-p-focused]="isItemFocused(menuitemId(item, _id(), i))"
                                    [attr.data-p-disabled]="disabled(item.disabled)"
                                    [attr.aria-disabled]="disabled(item.disabled)"
                                    [attr.id]="menuitemId(item, _id(), i)"
                                ></li>
                            }
                        }
                    }
                </ul>
                @if (endTemplate() ?? _endTemplate()) {
                    <div [class]="cx('end')" [pBind]="ptm('end')" [attr.data-pc-section]="'end'">
                        <ng-container *ngTemplateOutlet="endTemplate() ?? _endTemplate()"></ng-container>
                    </div>
                }
            </div>
        }
    `,

    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [MenuStyle, { provide: PARENT_INSTANCE, useExisting: Menu }],
    hostDirectives: [Bind]
})
export class Menu extends BaseComponent<MenuPassThrough> {
    overlayService = inject(OverlayService);

    componentName = 'Menu';

    /**
     * An array of menuitems.
     * @group Props
     */
    model = input<MenuItem[] | undefined>(undefined);
    /**
     * Defines if menu would displayed as a popup.
     * @group Props
     */
    popup = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Inline style of the component.
     * @group Props
     */
    style = input<{ [klass: string]: any } | null | undefined>(undefined);
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass = input<string | undefined>(undefined);
    /**
     * Whether to automatically manage layering.
     * @group Props
     */
    autoZIndex = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    baseZIndex = input<number, unknown>(0, { transform: numberAttribute });

    /**
     * Defines a string value that labels an interactive element.
     * @group Props
     */
    ariaLabel = input<string | undefined>(undefined);
    /**
     * Identifier of the underlying input element.
     * @group Props
     */
    ariaLabelledBy = input<string | undefined>(undefined);
    /**
     * Current id state as a string.
     * @group Props
     */
    id = input<string | undefined>(undefined);

    _id = computed(() => this.id() || uuid('pn_id_'));
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);
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
     * Callback to invoke when overlay menu is shown.
     * @group Emits
     */
    readonly onShow = output<any>();
    /**
     * Callback to invoke when overlay menu is hidden.
     * @group Emits
     */
    readonly onHide = output<any>();
    /**
     * Callback to invoke when the list loses focus.
     * @param {Event} event - blur event.
     * @group Emits
     */
    readonly onBlur = output<Event>();
    /**
     * Callback to invoke when the list receives focus.
     * @param {Event} event - focus event.
     * @group Emits
     */
    readonly onFocus = output<Event>();

    listViewChild = viewChild<ElementRef>('list');

    containerViewChild = viewChild<ElementRef>('container');

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    container = signal<any>(undefined);

    scrollHandler = signal<ConnectedOverlayScrollHandler | null | undefined>(undefined);

    documentClickListener = signal<VoidListener>(undefined);

    documentResizeListener = signal<VoidListener>(undefined);

    preventDocumentDefault = signal<boolean | undefined>(undefined);

    target = signal<any>(undefined);

    visible = signal<boolean | undefined>(undefined);

    focusedOptionId = computed(() => {
        return this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : null;
    });

    public focusedOptionIndex: any = signal<any>(-1);

    public selectedOptionIndex: any = signal<any>(-1);

    public focused = signal<boolean | undefined>(false);

    public overlayVisible = signal<boolean | undefined>(false);

    _componentStyle = inject(MenuStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptm('host')));
    }

    getPTOptions(key: string, item: any, index: number, id: string) {
        return this.ptm(key, {
            context: {
                item: item,
                index: index,
                focused: this.isItemFocused(id),
                disabled: this.disabled(item.disabled)
            }
        });
    }
    /**
     * Toggles the visibility of the popup menu.
     * @param {Event} event - Browser event.
     * @group Method
     */
    public toggle(event: Event) {
        if (this.visible()) this.hide();
        else this.show(event);

        this.preventDocumentDefault.set(true);
    }
    /**
     * Displays the popup menu.
     * @param {Event} event - Browser event.
     * @group Method
     */
    public show(event: any) {
        // Clear container if exists but overlay is not currently visible (fast toggle case)
        if (this.container() && !this.overlayVisible()) {
            this.container.set(undefined);
        }

        this.target.set(event.currentTarget);
        this.visible.set(true);
        this.preventDocumentDefault.set(true);
        this.overlayVisible.set(true);
    }

    onInit() {
        if (!this.popup()) {
            this.bindDocumentClickListener();
        }
    }

    /**
     * Defines template option for start.
     * @group Templates
     */
    readonly startTemplate = contentChild<TemplateRef<void>>('start', { descendants: false });
    readonly _startTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'start')
                .at(-1)?.template
    );

    /**
     * Defines template option for end.
     * @group Templates
     */
    readonly endTemplate = contentChild<TemplateRef<void>>('end', { descendants: false });
    readonly _endTemplate = computed<TemplateRef<void> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'end')
                .at(-1)?.template
    );

    /**
     * Custom item template.
     * @param {MenuItemTemplateContext} context - item context.
     * @see {@link MenuItemTemplateContext}
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<MenuItemTemplateContext>>('item', { descendants: false });
    readonly _itemTemplate = computed<TemplateRef<MenuItemTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => !['start', 'end', 'submenuheader'].includes(item.getType()))
                .at(-1)?.template
    );

    /**
     * Custom submenu header template.
     * @param {MenuSubmenuHeaderTemplateContext} context - submenu header context.
     * @see {@link MenuSubmenuHeaderTemplateContext}
     * @group Templates
     */
    readonly submenuHeaderTemplate = contentChild<TemplateRef<MenuSubmenuHeaderTemplateContext>>('submenuheader', { descendants: false });
    readonly _submenuHeaderTemplate = computed<TemplateRef<MenuSubmenuHeaderTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'submenuheader')
                .at(-1)?.template
    );

    readonly templates = contentChildren(PrimeTemplate);

    getTabIndexValue = computed<string | null>(() => (this.tabindex() !== undefined ? this.tabindex().toString() : null));

    onOverlayBeforeEnter(event: MotionEvent) {
        this.container.set(event.element as HTMLElement);
        const container = this.container();

        if (container) {
            addStyle(container, { position: 'absolute', top: '0' });
            this.appendOverlay();
            this.moveOnTop();

            this.$attrSelector && container.setAttribute(this.$attrSelector, '');
            this.bindDocumentClickListener();
            this.bindDocumentResizeListener();
            this.bindScrollListener();
            absolutePosition(container, this.target());
            focus(this.listViewChild()?.nativeElement);
            this.onShow.emit({});
        }
    }

    onOverlayAfterLeave() {
        this.restoreOverlayAppend();
        this.onOverlayHide();
        this.overlayVisible.set(false);
        this.onHide.emit({});
    }

    appendOverlay() {
        if (this.$appendTo() && this.$appendTo() !== 'self') {
            if (this.$appendTo() === 'body') {
                appendChild(this.document.body, this.container()!);
            } else {
                appendChild(this.$appendTo(), this.container()!);
            }
        }
    }

    restoreOverlayAppend() {
        const container = this.container();
        if (container && this.$appendTo() !== 'self') {
            appendChild(this.el.nativeElement, container);
        }
    }

    moveOnTop() {
        if (this.autoZIndex()) {
            ZIndexUtils.set('menu', this.container(), this.baseZIndex() + this.config.zIndex.menu);
        }
    }
    /**
     * Hides the popup menu.
     * @group Method
     */
    public hide() {
        this.visible.set(false);
    }

    onWindowResize() {
        if (this.visible() && !isTouchDevice()) {
            this.hide();
        }
    }

    menuitemId(item: MenuItem, id: string | any, index?: string | number, childIndex?: string | number) {
        return item?.id ?? `${id}_${index}${childIndex !== undefined ? '_' + childIndex : ''}`;
    }

    isItemFocused(id) {
        return this.focusedOptionId() === id;
    }

    label(label: any) {
        return typeof label === 'function' ? label() : label;
    }

    disabled(disabled: any) {
        return typeof disabled === 'function' ? disabled() : typeof disabled === 'undefined' ? false : disabled;
    }

    activedescendant = computed(() => (this.focused() ? this.focusedOptionId() : undefined));

    onListFocus(event: Event) {
        if (!this.focused()) {
            this.focused.set(true);
            !this.popup() && this.changeFocusedOptionIndex(0);
            this.onFocus.emit(event);
        }
    }

    onListBlur(event: FocusEvent | MouseEvent) {
        if (this.focused()) {
            this.focused.set(false);
            this.changeFocusedOptionIndex(-1);
            this.selectedOptionIndex.set(-1);
            this.focusedOptionIndex.set(-1);
            this.onBlur.emit(event);
        }
    }

    onListKeyDown(event) {
        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onArrowUpKey(event);
                break;

            case 'Home':
                this.onHomeKey(event);
                break;

            case 'End':
                this.onEndKey(event);
                break;

            case 'Enter':
                this.onEnterKey(event);
                break;

            case 'NumpadEnter':
                this.onEnterKey(event);
                break;

            case 'Space':
                this.onSpaceKey(event);
                break;

            case 'Escape':
            case 'Tab':
                if (this.popup()) {
                    focus(this.target());
                    this.hide();
                }
                this.overlayVisible() && this.hide();
                break;

            default:
                break;
        }
    }

    onArrowDownKey(event) {
        const optionIndex = this.findNextOptionIndex(this.focusedOptionIndex());
        this.changeFocusedOptionIndex(optionIndex);
        event.preventDefault();
    }

    onArrowUpKey(event) {
        if (event.altKey && this.popup()) {
            focus(this.target());
            this.hide();
            event.preventDefault();
        } else {
            const optionIndex = this.findPrevOptionIndex(this.focusedOptionIndex());

            this.changeFocusedOptionIndex(optionIndex);
            event.preventDefault();
        }
    }

    onHomeKey(event) {
        this.changeFocusedOptionIndex(0);
        event.preventDefault();
    }

    onEndKey(event) {
        this.changeFocusedOptionIndex(find(this.containerViewChild()?.nativeElement, 'li[data-pc-section="item"][data-p-disabled="false"]').length - 1);
        event.preventDefault();
    }

    onEnterKey(event) {
        const element = <any>findSingle(this.containerViewChild()?.nativeElement, `li[id="${`${this.focusedOptionIndex()}`}"]`);
        const anchorElement = element && (<any>findSingle(element, '[data-pc-section="itemlink"]') || findSingle(element, 'a,button'));

        this.popup() && focus(this.target());
        anchorElement ? anchorElement.click() : element && element.click();

        event.preventDefault();
    }

    onSpaceKey(event) {
        this.onEnterKey(event);
    }

    findNextOptionIndex(index) {
        const links = find(this.containerViewChild()?.nativeElement, 'li[data-pc-section="item"][data-p-disabled="false"]');
        const matchedOptionIndex = [...links].findIndex((link) => link.id === index);

        return matchedOptionIndex > -1 ? matchedOptionIndex + 1 : 0;
    }

    findPrevOptionIndex(index) {
        const links = find(this.containerViewChild()?.nativeElement, 'li[data-pc-section="item"][data-p-disabled="false"]');
        const matchedOptionIndex = [...links].findIndex((link) => link.id === index);

        return matchedOptionIndex > -1 ? matchedOptionIndex - 1 : 0;
    }

    changeFocusedOptionIndex(index) {
        const links = find(this.containerViewChild()?.nativeElement, 'li[data-pc-section="item"][data-p-disabled="false"]');
        if (links.length > 0) {
            let order = index >= links.length ? links.length - 1 : index < 0 ? 0 : index;
            order > -1 && this.focusedOptionIndex.set(links[order].getAttribute('id'));
        }
    }

    itemClick(event: any, id: string) {
        const { originalEvent, item } = event;

        if (!this.focused()) {
            this.focused.set(true);
            this.onFocus.emit(originalEvent);
        }

        if (item.disabled) {
            originalEvent.preventDefault();
            return;
        }

        if (!item.url && !item.routerLink) {
            originalEvent.preventDefault();
        }

        if (item.command) {
            item.command({
                originalEvent: originalEvent,
                item: item
            });
        }

        if (this.popup()) {
            this.hide();
        }

        if (!this.popup() && this.focusedOptionIndex() !== id) {
            this.focusedOptionIndex.set(id);
        }
    }

    onOverlayClick(event: Event) {
        if (this.popup()) {
            this.overlayService.add({
                originalEvent: event,
                target: this.el.nativeElement
            });
        }

        this.preventDocumentDefault.set(true);
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener() && isPlatformBrowser(this.platformId)) {
            const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : 'document';

            this.documentClickListener.set(
                this.renderer.listen(documentTarget, 'click', (event) => {
                    const target = this.target();
                    const isOutsideContainer = this.containerViewChild()?.nativeElement && !this.containerViewChild()?.nativeElement.contains(event.target);
                    const isOutsideTarget = !(target && (target === event.target || target.contains(event.target)));
                    if (!this.popup() && isOutsideContainer && isOutsideTarget) {
                        this.onListBlur(event);
                    }
                    if (this.preventDocumentDefault() && this.overlayVisible() && isOutsideContainer && isOutsideTarget) {
                        this.hide();
                        this.preventDocumentDefault.set(false);
                    }
                })
            );
        }
    }

    unbindDocumentClickListener() {
        const documentClickListener = this.documentClickListener();
        if (documentClickListener) {
            documentClickListener();
            this.documentClickListener.set(null);
        }
    }

    bindDocumentResizeListener() {
        if (!this.documentResizeListener() && isPlatformBrowser(this.platformId)) {
            const window = this.document.defaultView;
            this.documentResizeListener.set(this.renderer.listen(window, 'resize', this.onWindowResize.bind(this)));
        }
    }

    unbindDocumentResizeListener() {
        const documentResizeListener = this.documentResizeListener();
        if (documentResizeListener) {
            documentResizeListener();
            this.documentResizeListener.set(null);
        }
    }

    bindScrollListener() {
        if (!this.scrollHandler() && isPlatformBrowser(this.platformId)) {
            this.scrollHandler.set(
                new ConnectedOverlayScrollHandler(this.target(), () => {
                    if (this.visible()) {
                        this.hide();
                    }
                })
            );
        }

        this.scrollHandler()?.bindScrollListener();
    }

    unbindScrollListener() {
        const scrollHandler = this.scrollHandler();
        if (scrollHandler) {
            scrollHandler.unbindScrollListener();
            this.scrollHandler.set(null);
        }
    }

    onOverlayHide() {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
        this.preventDocumentDefault.set(false);

        if (!(this.cd as ViewRef).destroyed) {
            this.target.set(null);
        }
        const container = this.container();
        if (container) {
            if (this.autoZIndex()) {
                ZIndexUtils.clear(container);
            }
            this.container.set(undefined);
        }
    }

    onDestroy() {
        if (this.popup()) {
            const scrollHandler = this.scrollHandler();
            if (scrollHandler) {
                scrollHandler.destroy();
                this.scrollHandler.set(null);
            }

            const container = this.container();
            if (container) {
                if (this.autoZIndex()) {
                    ZIndexUtils.clear(container);
                }
                this.container.set(undefined);
            }

            this.restoreOverlayAppend();
            this.onOverlayHide();
        }

        if (!this.popup()) {
            this.unbindDocumentClickListener();
        }
    }

    hasSubMenu = computed<boolean>(() => this.model()?.some((item) => item.items) ?? false);

    dataP = computed(() => {
        return this.cn({
            popup: this.popup()
        });
    });
}

@NgModule({
    imports: [Menu, SharedModule, SafeHtmlPipe],
    exports: [Menu, SharedModule, SafeHtmlPipe]
})
export class MenuModule {}
