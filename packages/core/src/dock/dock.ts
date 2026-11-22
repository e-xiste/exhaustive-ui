import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, NgModule, signal, TemplateRef, ViewEncapsulation, viewChild, contentChild, contentChildren, output } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { find, findSingle, resolve, uuid } from '@exhaustive-ui/utils';
import { MenuItem, PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { Badge } from '@exhaustive-ui/core/badge';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { Ripple } from '@exhaustive-ui/core/ripple';
import { TooltipModule } from '@exhaustive-ui/core/tooltip';
import { DockItemTemplateContext, DockPassThrough } from '@exhaustive-ui/core/types/dock';
import { DockStyle } from './style/dockstyle';

/**
 * Dock is a navigation component consisting of menuitems.
 * @group Components
 */
@Component({
    selector: 'p-dock',
    imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, Ripple, TooltipModule, SharedModule, Bind, Badge],
    template: `
        <div [class]="cx('listContainer')" [pBind]="ptm('listContainer')">
            <ul
                #list
                [attr.id]="_id()"
                [class]="cx('list')"
                role="menu"
                [attr.aria-orientation]="position() === 'bottom' || position() === 'top' ? 'horizontal' : 'vertical'"
                [attr.aria-activedescendant]="focused() ? focusedOptionId() : undefined"
                [tabindex]="tabindex"
                [attr.aria-label]="ariaLabel()"
                [attr.aria-labelledby]="ariaLabelledBy()"
                (focus)="onListFocus($event)"
                (blur)="onListBlur($event)"
                (keydown)="onListKeyDown($event)"
                (mouseleave)="onListMouseLeave()"
                [pBind]="ptm('list')"
            >
                @for (item of model(); track item.label; let i = $index) {
                    @if (item.visible !== false) {
                        <li
                            [attr.id]="getItemId(item, i)"
                            [class]="cn(cx('item', { item, id: getItemId(item, i) }), item?.styleClass)"
                            [ngStyle]="item.style"
                            role="menuitem"
                            [attr.aria-label]="item.label"
                            [attr.aria-disabled]="disabled(item) || false"
                            (click)="onItemClick($event, item)"
                            (mouseenter)="onItemMouseEnter(i)"
                            [pBind]="getPTOptions(item, i, 'item')"
                            [attr.data-p-focused]="isItemActive(getItemId(item, i))"
                            [attr.data-p-disabled]="disabled(item) || false"
                        >
                            <div [class]="cx('itemContent')" [pBind]="getPTOptions(item, i, 'itemContent')">
                                @if (isClickableRouterLink(item)) {
                                    <a
                                        pRipple
                                        [routerLink]="item.routerLink"
                                        [queryParams]="item.queryParams"
                                        [class]="cn(cx('itemLink'), item?.linkClass)"
                                        [ngStyle]="item?.linkStyle"
                                        routerLinkActive="router-link-active"
                                        [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                                        [target]="item.target"
                                        [attr.title]="item.title"
                                        [attr.data-automationid]="item.automationId"
                                        [attr.tabindex]="item.disabled ? null : item.tabindex ? item.tabindex : '-1'"
                                        pTooltip
                                        [tooltipOptions]="item.tooltipOptions"
                                        [pTooltipUnstyled]="unstyled()"
                                        [fragment]="item.fragment"
                                        [queryParamsHandling]="item.queryParamsHandling"
                                        [preserveFragment]="item.preserveFragment"
                                        [skipLocationChange]="item.skipLocationChange"
                                        [replaceUrl]="item.replaceUrl"
                                        [state]="item.state"
                                        [attr.aria-hidden]="true"
                                        [pBind]="getPTOptions(item, i, 'itemLink')"
                                    >
                                        @if (item.icon && !itemTemplate() && !_itemTemplate()) {
                                            <span [class]="cn(cx('itemIcon'), item.icon, item.iconClass)" [ngStyle]="item.iconStyle" [pBind]="getPTOptions(item, i, 'itemIcon')"></span>
                                        }
                                        <ng-container *ngTemplateOutlet="itemTemplate() || _itemTemplate(); context: { $implicit: item }"></ng-container>
                                        @if (item.badge) {
                                            <p-badge [class]="item.badgeStyleClass" [value]="item.badge" [pt]="getPTOptions(item, i, 'pcBadge')" [unstyled]="unstyled()" />
                                        }
                                    </a>
                                } @else {
                                    <a
                                        [tooltipPosition]="item.tooltipPosition"
                                        [attr.href]="item.url || null"
                                        [class]="cn(cx('itemLink'), item?.linkClass)"
                                        [ngStyle]="item?.linkStyle"
                                        pRipple
                                        pTooltip
                                        [tooltipOptions]="item.tooltipOptions"
                                        [pTooltipUnstyled]="unstyled()"
                                        [target]="item.target"
                                        [attr.title]="item.title"
                                        [attr.data-automationid]="item.automationId"
                                        [attr.tabindex]="item.disabled ? null : item.tabindex ? item.tabindex : '-1'"
                                        [attr.aria-hidden]="true"
                                        [pBind]="getPTOptions(item, i, 'itemLink')"
                                    >
                                        @if (item.icon && !itemTemplate() && !_itemTemplate()) {
                                            <span [class]="cn(cx('itemIcon'), item.icon, item.iconClass)" [ngStyle]="item.iconStyle" [pBind]="getPTOptions(item, i, 'itemIcon')"></span>
                                        }
                                        <ng-container *ngTemplateOutlet="itemTemplate() || _itemTemplate(); context: { $implicit: item }"></ng-container>
                                        @if (item.badge) {
                                            <p-badge [class]="item.badgeStyleClass" [value]="item.badge" [pt]="getPTOptions(item, i, 'pcBadge')" [unstyled]="unstyled()" />
                                        }
                                    </a>
                                }
                            </div>
                        </li>
                    }
                }
            </ul>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [DockStyle, { provide: PARENT_INSTANCE, useExisting: Dock }],
    host: {
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class Dock extends BaseComponent<DockPassThrough> {
    componentName = 'Dock';

    /**
     * Current id state as a string.
     * @group Props
     */
    readonly id = input<string | undefined>();

    readonly _id = computed(() => this.id() || uuid('pn_id_'));
    /**
     * MenuModel instance to define the action items.
     * @group Props
     */
    readonly model = input<MenuItem[] | undefined | null>(null);
    /**
     * Position of element.
     * @group Props
     */
    readonly position = input<'bottom' | 'top' | 'left' | 'right'>('bottom');
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();
    /**
     * The breakpoint to define the maximum width boundary.
     * @defaultValue 960px
     * @group Props
     */
    readonly breakpoint = input<string | undefined>('960px');
    /**
     * Defines a string that labels the dropdown button for accessibility.
     * @group Props
     */
    readonly ariaLabelledBy = input<string | undefined>();
    /**
     * Callback to execute when button is focused.
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    readonly onFocus = output<FocusEvent>();
    /**
     * Callback to invoke when the component loses focus.
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    readonly onBlur = output<FocusEvent>();

    readonly listViewChild = viewChild.required<ElementRef>('list');

    currentIndex = signal<number>(-3);

    tabindex: number = 0;

    focused = signal<boolean>(false);

    focusedOptionIndex = signal<string | number>(-1);

    _componentStyle = inject(DockStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    matchMediaListener = signal<any>(undefined);

    query = signal<any>(undefined);

    queryMatches = signal<boolean>(false);

    mobileActive = signal<boolean>(false);

    readonly focusedOptionId = computed(() => {
        const focusedOptionIndex = this.focusedOptionIndex();

        return focusedOptionIndex !== -1 && focusedOptionIndex !== '-1' ? String(focusedOptionIndex) : null;
    });

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
    }

    onInit() {
        this.bindMatchMediaListener();
    }

    onDestroy() {
        this.unbindMatchMediaListener();
    }

    /**
     * Custom item template.
     * @param {DockItemTemplateContext} context - item template context.
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<DockItemTemplateContext>>('item');

    readonly _itemTemplate = computed<TemplateRef<DockItemTemplateContext> | undefined>(() => this.templates().at(-1)?.template);

    getItemId(item, index) {
        return item && item?.id ? item.id : `${index}`;
    }

    getItemProp(processedItem, name) {
        return processedItem && processedItem.item ? resolve(processedItem.item[name]) : undefined;
    }

    disabled(item) {
        return typeof item.disabled === 'function' ? item.disabled() : item.disabled || false;
    }

    isItemActive(id) {
        return String(id) === String(this.focusedOptionIndex());
    }

    onListMouseLeave() {
        this.currentIndex.set(-3);
    }

    onItemMouseEnter(index: number) {
        this.currentIndex.set(index);
    }

    onItemClick(e: Event, item: MenuItem) {
        if (item.command) {
            item.command({ originalEvent: e, item });
        }
    }

    onListFocus(event) {
        this.focused.set(true);
        this.changeFocusedOptionIndex(0);
        this.onFocus.emit(event);
    }

    onListBlur(event) {
        this.focused.set(false);
        this.focusedOptionIndex.set(-1);
        this.onBlur.emit(event);
    }

    onListKeyDown(event) {
        switch (event.code) {
            case 'ArrowDown': {
                if (this.position() === 'left' || this.position() === 'right') this.onArrowDownKey();
                event.preventDefault();
                break;
            }

            case 'ArrowUp': {
                if (this.position() === 'left' || this.position() === 'right') this.onArrowUpKey();
                event.preventDefault();
                break;
            }

            case 'ArrowRight': {
                if (this.position() === 'top' || this.position() === 'bottom') this.onArrowDownKey();
                event.preventDefault();
                break;
            }

            case 'ArrowLeft': {
                if (this.position() === 'top' || this.position() === 'bottom') this.onArrowUpKey();
                event.preventDefault();
                break;
            }

            case 'Home': {
                this.onHomeKey();
                event.preventDefault();
                break;
            }

            case 'End': {
                this.onEndKey();
                event.preventDefault();
                break;
            }

            case 'Enter':

            case 'Space': {
                this.onSpaceKey();
                event.preventDefault();
                break;
            }

            default:
                break;
        }
    }

    onArrowDownKey() {
        const optionIndex = this.findNextOptionIndex(this.focusedOptionIndex());

        this.changeFocusedOptionIndex(optionIndex);
    }

    onArrowUpKey() {
        const optionIndex = this.findPrevOptionIndex(this.focusedOptionIndex());

        this.changeFocusedOptionIndex(optionIndex);
    }

    onHomeKey() {
        this.changeFocusedOptionIndex(0);
    }

    onEndKey() {
        this.changeFocusedOptionIndex(find(this.listViewChild().nativeElement, 'li[data-pc-section="item"][data-p-disabled="false"]').length - 1);
    }

    onSpaceKey() {
        const element = <HTMLElement>findSingle(this.listViewChild().nativeElement, `li[id="${`${this.focusedOptionIndex()}`}"]`);
        const anchorElement = element && <HTMLElement>findSingle(element, 'a,button');

        anchorElement ? anchorElement.click() : element && element.click();
    }

    findNextOptionIndex(index) {
        const menuitems = find(this.listViewChild().nativeElement, 'li[data-pc-section="item"][data-p-disabled="false"]');
        const matchedOptionIndex = [...menuitems].findIndex((link) => link.id === index);

        return matchedOptionIndex > -1 ? matchedOptionIndex + 1 : 0;
    }

    changeFocusedOptionIndex(index) {
        const menuitems = <any>find(this.listViewChild().nativeElement, 'li[data-pc-section="item"][data-p-disabled="false"]');

        let order = index >= menuitems.length ? menuitems.length - 1 : index < 0 ? 0 : index;

        this.focusedOptionIndex.set(menuitems[order]?.getAttribute('id'));
    }

    findPrevOptionIndex(index) {
        const menuitems = find(this.listViewChild().nativeElement, 'li[data-pc-section="item"][data-p-disabled="false"]');
        const matchedOptionIndex = [...menuitems].findIndex((link) => link.id === index);

        return matchedOptionIndex > -1 ? matchedOptionIndex - 1 : 0;
    }

    isClickableRouterLink(item: any) {
        return !!item.routerLink && !this.disabled(item);
    }

    readonly templates = contentChildren(PrimeTemplate);

    getPTOptions(item: MenuItem, index: number, key: string) {
        return this.ptm(key, {
            context: {
                item,
                index
            }
        });
    }

    bindMatchMediaListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.matchMediaListener()) {
                const query = window.matchMedia(`(max-width: ${this.breakpoint()})`);
                this.query.set(query);
                this.queryMatches.set(query.matches);

                const matchMediaListener = () => {
                    this.queryMatches.set(query.matches);
                    this.mobileActive.set(false);
                };
                this.matchMediaListener.set(matchMediaListener);

                query.addEventListener('change', matchMediaListener);
            }
        }
    }

    unbindMatchMediaListener() {
        const matchMediaListener = this.matchMediaListener();
        if (matchMediaListener) {
            this.query()?.removeEventListener('change', matchMediaListener);
            this.matchMediaListener.set(null);
            this.query.set(null);
        }
    }
}

@NgModule({
    imports: [Dock, SharedModule],
    exports: [Dock, SharedModule]
})
export class DockModule {}
