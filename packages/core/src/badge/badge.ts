import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, computed, Directive, effect, inject, input, NgModule, signal, untracked, ViewEncapsulation } from '@angular/core';
import { addClass, createElement, hasClass, removeClass, uuid } from '@exhaustive-ui/utils';
import { SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import type { BadgePassThrough, BadgeSeverity } from '@exhaustive-ui/core/types/badge';
import { BadgeStyle } from './style/badgestyle';

/**
 * Badge Directive is directive usage of badge component.
 * @group Components
 */
@Directive({
    selector: '[pBadge]',
    providers: [BadgeStyle, { provide: PARENT_INSTANCE, useExisting: BadgeDirective }]
})
export class BadgeDirective extends BaseComponent {
    /**
     * Used to pass attributes to DOM elements inside the Badge component.
     * @defaultValue undefined
     * @deprecated use pBadgePT instead.
     * @group Props
     */
    ptBadgeDirective = input<BadgePassThrough | undefined>();
    /**
     * Used to pass attributes to DOM elements inside the Badge component.
     * @defaultValue undefined
     * @group Props
     */
    pBadgePT = input<BadgePassThrough | undefined>();
    /**
     * Indicates whether the component should be rendered without styles.
     * @defaultValue undefined
     * @group Props
     */
    pBadgeUnstyled = input<boolean | undefined>();
    /**
     * When specified, disables the component.
     * @group Props
     */
    readonly disabled = input<boolean | undefined>(undefined, { alias: 'badgeDisabled' });
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    readonly badgeSize = input<'large' | 'xlarge' | 'small' | null | undefined>();
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     * @deprecated use badgeSize instead.
     */
    readonly size = input<'large' | 'xlarge' | 'small' | null | undefined>();
    /**
     * Severity type of the badge.
     * @group Props
     */
    readonly severity = input<BadgeSeverity | null | undefined>();
    /**
     * Value to display inside the badge.
     * @group Props
     */
    readonly value = input<string | number>();
    /**
     * Inline style of the element.
     * @group Props
     */
    readonly badgeStyle = input<{ [klass: string]: any } | null | undefined>();
    /**
     * Class of the element.
     * @group Props
     */
    readonly badgeStyleClass = input<string>();

    private id = uuid('pn_id_') + '_badge';

    badgeEl = signal<HTMLElement | undefined>(undefined);

    _componentStyle = inject(BadgeStyle);

    private get activeElement(): HTMLElement {
        return this.el.nativeElement.nodeName.indexOf('-') != -1 ? this.el.nativeElement.firstChild : this.el.nativeElement;
    }

    constructor() {
        super();
        effect(() => {
            const pt = this.ptBadgeDirective() || this.pBadgePT();
            pt && this.directivePT.set(pt);
        });

        effect(() => {
            this.pBadgeUnstyled() && this.directiveUnstyled.set(this.pBadgeUnstyled());
        });

        effect(() => {
            this.disabled();
            untracked(() => this.toggleDisableState());
        });

        let previousSeverity: BadgeSeverity | null | undefined;
        effect(() => {
            const severity = this.severity();
            untracked(() => this.setSeverity(previousSeverity));
            previousSeverity = severity;
        });

        effect(() => {
            if (this.size() !== undefined) {
                console.log('size property is deprecated and will removed in v18, use badgeSize instead.');
            }
        });

        effect(() => {
            this.badgeSize();
            this.size();
            untracked(() => this.setSizeClasses());
        });

        effect(() => {
            this.value();
            untracked(() => this.setValue());
        });

        effect(() => {
            this.badgeStyle();
            this.badgeStyleClass();
            untracked(() => this.applyStyles());
        });
    }

    private setValue(element?: HTMLElement): void {
        const badge = element ?? this.document.getElementById(this.id);

        if (!badge) {
            return;
        }

        if (this.value() != null) {
            if (hasClass(badge, 'p-badge-dot')) {
                removeClass(badge, 'p-badge-dot');
            }

            if (this.value() && String(this.value()).length === 1) {
                addClass(badge, 'p-badge-circle');
            } else {
                removeClass(badge, 'p-badge-circle');
            }
        } else {
            if (!hasClass(badge, 'p-badge-dot')) {
                addClass(badge, 'p-badge-dot');
            }

            removeClass(badge, 'p-badge-circle');
        }

        badge.textContent = '';
        const badgeValue = this.value() != null ? String(this.value()) : '';
        this.renderer.appendChild(badge, this.document.createTextNode(badgeValue));
    }

    private setSizeClasses(element?: HTMLElement): void {
        const badge = element ?? this.document.getElementById(this.id);

        if (!badge) {
            return;
        }

        if (this.badgeSize()) {
            if (this.badgeSize() === 'large') {
                addClass(badge, 'p-badge-lg');
                removeClass(badge, 'p-badge-xl');
            }

            if (this.badgeSize() === 'xlarge') {
                addClass(badge, 'p-badge-xl');
                removeClass(badge, 'p-badge-lg');
            }
        } else if (this.size() && !this.badgeSize()) {
            if (this.size() === 'large') {
                addClass(badge, 'p-badge-lg');
                removeClass(badge, 'p-badge-xl');
            }

            if (this.size() === 'xlarge') {
                addClass(badge, 'p-badge-xl');
                removeClass(badge, 'p-badge-lg');
            }
        } else {
            removeClass(badge, 'p-badge-lg');
            removeClass(badge, 'p-badge-xl');
        }
    }

    private renderBadgeContent(): void {
        if (this.disabled()) {
            return;
        }

        const el = this.activeElement;
        const badge = <HTMLElement>createElement('span', { class: this.cx('root'), id: this.id, 'p-bind': this.ptm('root') });
        this.setSeverity(null, badge);
        this.setSizeClasses(badge);
        this.setValue(badge);
        addClass(el, 'p-overlay-badge');
        this.renderer.appendChild(el, badge);
        this.badgeEl.set(badge);
        this.applyStyles();
    }

    private applyStyles(): void {
        const badgeEl = this.badgeEl();
        const badgeStyle = this.badgeStyle();
        const badgeStyleClass = this.badgeStyleClass();

        if (badgeEl && badgeStyle && typeof badgeStyle === 'object') {
            for (const [key, value] of Object.entries(badgeStyle)) {
                this.renderer.setStyle(badgeEl, key, value);
            }
        }
        if (badgeEl && badgeStyleClass) {
            badgeEl.classList.add(...badgeStyleClass.split(' '));
        }
    }

    private setSeverity(oldSeverity?: BadgeSeverity | null, element?: HTMLElement): void {
        const badge = element ?? this.document.getElementById(this.id);

        if (!badge) {
            return;
        }

        if (this.severity()) {
            addClass(badge, `p-badge-${this.severity()}`);
        }

        if (oldSeverity) {
            removeClass(badge, `p-badge-${oldSeverity}`);
        }
    }

    private toggleDisableState(): void {
        if (this.disabled()) {
            const badge = this.activeElement?.querySelector(`#${this.id}`);

            if (badge) {
                this.renderer.removeChild(this.activeElement, badge);
            }
        } else {
            this.renderBadgeContent();
        }
    }
}
/**
 * Badge is a small status indicator for another element.
 * @group Components
 */
@Component({
    selector: 'p-badge',
    template: `{{ value() }}`,
    imports: [SharedModule, BindModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [BadgeStyle, { provide: PARENT_INSTANCE, useExisting: Badge }],
    host: {
        '[class]': "cx('root')",
        '[style.display]': 'badgeDisabled() ? "none" : null',
        '[attr.data-p]': 'dataP()'
    },
    hostDirectives: [Bind]
})
export class Badge extends BaseComponent<BadgePassThrough> {
    componentName = 'Badge';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    badgeSize = input<'small' | 'large' | 'xlarge' | null>();
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    size = input<'small' | 'large' | 'xlarge' | null>();
    /**
     * Severity type of the badge.
     * @group Props
     */
    severity = input<BadgeSeverity | null>();
    /**
     * Value to display inside the badge.
     * @group Props
     */
    value = input<string | number | null>();
    /**
     * When specified, disables the component.
     * @group Props
     */
    badgeDisabled = input<boolean, boolean>(false, { transform: booleanAttribute });

    _componentStyle = inject(BadgeStyle);

    readonly dataP = computed(() =>
        this.cn({
            circle: this.value() != null && String(this.value()).length === 1,
            empty: this.value() == null,
            disabled: this.badgeDisabled(),
            [this.severity() as string]: this.severity(),
            [this.size() as string]: this.size()
        })
    );
}

@NgModule({
    imports: [Badge, BadgeDirective, SharedModule],
    exports: [Badge, BadgeDirective, SharedModule]
})
export class BadgeModule {}
