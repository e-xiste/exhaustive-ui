import { CommonModule } from '@angular/common';
import {
    afterEveryRender,
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    input,
    NgModule,
    NgZone,
    numberAttribute,
    signal,
    TemplateRef,
    ViewEncapsulation,
    viewChild,
    contentChild,
    contentChildren
} from '@angular/core';
import { addClass, getHeight, removeClass, uuid } from '@exhaustive-ui/utils';
import { PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { Nullable } from '@exhaustive-ui/core/ts-helpers';
import { ScrollPanelPassThrough } from '@exhaustive-ui/core/types/scrollpanel';
import { ScrollPanelStyle } from './style/scrollpanelstyle';

/**
 * ScrollPanel is a cross browser, lightweight and themable alternative to native browser scrollbar.
 * @group Components
 */
@Component({
    selector: 'p-scroll-panel, p-scrollPanel, p-scrollpanel',
    imports: [CommonModule, SharedModule, BindModule],
    template: `
        <div [pBind]="ptm('contentContainer')" [class]="cx('contentContainer')">
            <div #content [pBind]="ptm('content')" [class]="cx('content')" (mouseenter)="moveBar()" (scroll)="onScroll($event)">
                @if (!contentTemplate() && !_contentTemplate()) {
                    <ng-content></ng-content>
                }
                <ng-container *ngTemplateOutlet="contentTemplate() || _contentTemplate()"></ng-container>
            </div>
        </div>
        <div
            #xBar
            [pBind]="ptm('barX')"
            [class]="cx('barX')"
            tabindex="0"
            role="scrollbar"
            [attr.aria-orientation]="'horizontal'"
            [attr.aria-valuenow]="lastScrollLeft()"
            [attr.aria-controls]="contentId"
            [attr.data-pc-group-section]="'bar'"
            (mousedown)="onXBarMouseDown($event)"
            (keydown)="onKeyDown($event)"
            (keyup)="onKeyUp()"
            (focus)="onFocus($event)"
            (blur)="onBlur()"
        ></div>
        <div
            #yBar
            [pBind]="ptm('barY')"
            [class]="cx('barY')"
            tabindex="0"
            role="scrollbar"
            [attr.aria-orientation]="'vertical'"
            [attr.aria-valuenow]="lastScrollTop()"
            [attr.aria-controls]="contentId"
            (mousedown)="onYBarMouseDown($event)"
            (keydown)="onKeyDown($event)"
            (keyup)="onKeyUp()"
            (focus)="onFocus($event)"
            [attr.data-pc-group-section]="'bar'"
        ></div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ScrollPanelStyle, { provide: PARENT_INSTANCE, useExisting: ScrollPanel }],
    host: {
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class ScrollPanel extends BaseComponent<ScrollPanelPassThrough> {
    componentName = 'ScrollPanel';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterNextRender(() => {
            this.zone.runOutsideAngular(() => {
                this.moveBar();

                this.windowResizeListener.set(this.renderer.listen(window, 'resize', this.moveBar.bind(this)));
                this.contentScrollListener.set(this.renderer.listen((this.contentViewChild() as ElementRef).nativeElement, 'scroll', this.moveBar.bind(this)));
                this.mouseEnterListener.set(this.renderer.listen((this.contentViewChild() as ElementRef).nativeElement, 'mouseenter', this.moveBar.bind(this)));
                this.xBarMouseDownListener.set(this.renderer.listen((this.xBarViewChild() as ElementRef).nativeElement, 'mousedown', this.onXBarMouseDown.bind(this)));
                this.yBarMouseDownListener.set(this.renderer.listen((this.yBarViewChild() as ElementRef).nativeElement, 'mousedown', this.onYBarMouseDown.bind(this)));
                this.calculateContainerHeight();

                this.initialized.set(true);
            });
        });
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
    }
    /**
     * Step factor to scroll the content while pressing the arrow keys.
     * @group Props
     */
    readonly step = input<number, unknown>(5, { transform: numberAttribute });

    readonly contentViewChild = viewChild.required<ElementRef>('content');

    readonly xBarViewChild = viewChild.required<ElementRef>('xBar');

    readonly yBarViewChild = viewChild.required<ElementRef>('yBar');
    /**
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    readonly _contentTemplate = computed<TemplateRef<void> | undefined>(() => this.templates().at(-1)?.template);

    scrollYRatio = signal<number | undefined>(undefined);

    scrollXRatio = signal<number | undefined>(undefined);

    timeoutFrame: any = (fn: VoidFunction) => setTimeout(fn, 0);

    initialized = signal<boolean>(false);

    lastPageY = signal<number | undefined>(undefined);

    lastPageX = signal<number | undefined>(undefined);

    isXBarClicked = signal<boolean>(false);

    isYBarClicked = signal<boolean>(false);

    lastScrollLeft = signal<number>(0);

    lastScrollTop = signal<number>(0);

    orientation = signal<string>('vertical');

    timer = signal<any>(undefined);

    contentId = uuid('pn_id_') + '_content';

    windowResizeListener = signal<VoidFunction | null | undefined>(undefined);

    contentScrollListener = signal<VoidFunction | null | undefined>(undefined);

    mouseEnterListener = signal<VoidFunction | null | undefined>(undefined);

    xBarMouseDownListener = signal<VoidFunction | null | undefined>(undefined);

    yBarMouseDownListener = signal<VoidFunction | null | undefined>(undefined);

    documentMouseMoveListener = signal<Nullable<(event?: any) => void>>(undefined);

    documentMouseUpListener = signal<Nullable<(event?: any) => void>>(undefined);

    _componentStyle = inject(ScrollPanelStyle);

    zone: NgZone = inject(NgZone);

    calculateContainerHeight() {
        let container = (this.el as ElementRef).nativeElement;
        let content = (this.contentViewChild() as ElementRef).nativeElement;
        let xBar = (this.xBarViewChild() as ElementRef).nativeElement;
        const window = this.document.defaultView as Window;

        let containerStyles: { [klass: string]: any } = window.getComputedStyle(container),
            xBarStyles = window.getComputedStyle(xBar),
            pureContainerHeight = getHeight(container) - parseInt(xBarStyles['height'], 10);

        if (containerStyles['max-height'] != 'none' && pureContainerHeight == 0) {
            if (content.offsetHeight + parseInt(xBarStyles['height'], 10) > parseInt(containerStyles['max-height'], 10)) {
                container.style.height = containerStyles['max-height'];
            } else {
                container.style.height = content.offsetHeight + parseFloat(containerStyles.paddingTop) + parseFloat(containerStyles.paddingBottom) + parseFloat(containerStyles.borderTopWidth) + parseFloat(containerStyles.borderBottomWidth) + 'px';
            }
        }
    }

    moveBar() {
        let container = (this.el as ElementRef).nativeElement;
        let content = (this.contentViewChild() as ElementRef).nativeElement;

        /* horizontal scroll */
        let xBar = (this.xBarViewChild() as ElementRef).nativeElement;
        let totalWidth = content.scrollWidth;
        let ownWidth = content.clientWidth;
        let bottom = (container.clientHeight - xBar.clientHeight) * -1;

        this.scrollXRatio.set(ownWidth / totalWidth);

        /* vertical scroll */
        let yBar = (this.yBarViewChild() as ElementRef).nativeElement;
        let totalHeight = content.scrollHeight;
        let ownHeight = content.clientHeight;
        let right = (container.clientWidth - yBar.clientWidth) * -1;

        this.scrollYRatio.set(ownHeight / totalHeight);

        this.requestAnimationFrame(() => {
            if ((this.scrollXRatio() as number) >= 1) {
                xBar.setAttribute('data-p-scrollpanel-hidden', 'true');
                !this.$unstyled() && addClass(xBar, 'p-scrollpanel-hidden');
            } else {
                xBar.setAttribute('data-p-scrollpanel-hidden', 'false');
                !this.$unstyled() && removeClass(xBar, 'p-scrollpanel-hidden');
                const xBarWidth = Math.max((this.scrollXRatio() as number) * 100, 10);
                const xBarLeft = Math.abs((content.scrollLeft * (100 - xBarWidth)) / (totalWidth - ownWidth));
                xBar.style.cssText = 'width:' + xBarWidth + '%; inset-inline-start:' + xBarLeft + '%;bottom:' + bottom + 'px;';
            }

            if ((this.scrollYRatio() as number) >= 1) {
                yBar.setAttribute('data-p-scrollpanel-hidden', 'true');
                !this.$unstyled() && addClass(yBar, 'p-scrollpanel-hidden');
            } else {
                yBar.setAttribute('data-p-scrollpanel-hidden', 'false');
                !this.$unstyled() && removeClass(yBar, 'p-scrollpanel-hidden');
                const yBarHeight = Math.max((this.scrollYRatio() as number) * 100, 10);
                const yBarTop = (content.scrollTop * (100 - yBarHeight)) / (totalHeight - ownHeight);
                yBar.style.cssText = 'height:' + yBarHeight + '%; top: calc(' + yBarTop + '% - ' + xBar.clientHeight + 'px); inset-inline-end:' + right + 'px;';
            }
        });
    }

    onScroll(event) {
        if (this.lastScrollLeft() !== event.target.scrollLeft) {
            this.lastScrollLeft.set(event.target.scrollLeft);
            this.orientation.set('horizontal');
        } else if (this.lastScrollTop() !== event.target.scrollTop) {
            this.lastScrollTop.set(event.target.scrollTop);
            this.orientation.set('vertical');
        }

        this.moveBar();
    }

    onKeyDown(event) {
        if (this.orientation() === 'vertical') {
            switch (event.code) {
                case 'ArrowDown': {
                    this.setTimer('scrollTop', this.step());
                    event.preventDefault();
                    break;
                }

                case 'ArrowUp': {
                    this.setTimer('scrollTop', this.step() * -1);
                    event.preventDefault();
                    break;
                }

                case 'ArrowLeft':

                case 'ArrowRight': {
                    event.preventDefault();
                    break;
                }

                default:
                    //no op
                    break;
            }
        } else if (this.orientation() === 'horizontal') {
            switch (event.code) {
                case 'ArrowRight': {
                    this.setTimer('scrollLeft', this.step());
                    event.preventDefault();
                    break;
                }

                case 'ArrowLeft': {
                    this.setTimer('scrollLeft', this.step() * -1);
                    event.preventDefault();
                    break;
                }

                case 'ArrowDown':

                case 'ArrowUp': {
                    event.preventDefault();
                    break;
                }

                default:
                    //no op
                    break;
            }
        }
    }

    onKeyUp() {
        this.clearTimer();
    }

    repeat(bar, step) {
        const contentViewChild = this.contentViewChild();
        contentViewChild.nativeElement[bar] += step;
        this.moveBar();
    }

    setTimer(bar, step) {
        this.clearTimer();
        this.timer.set(
            setTimeout(() => {
                this.repeat(bar, step);
            }, 40)
        );
    }

    clearTimer() {
        if (this.timer()) {
            clearTimeout(this.timer());
        }
    }

    bindDocumentMouseListeners(): void {
        if (!this.documentMouseMoveListener()) {
            const documentMouseMoveListener = (e) => {
                this.onDocumentMouseMove(e);
            };
            this.documentMouseMoveListener.set(documentMouseMoveListener);
            this.document.addEventListener('mousemove', documentMouseMoveListener);
        }

        if (!this.documentMouseUpListener()) {
            const documentMouseUpListener = (e) => {
                this.onDocumentMouseUp(e);
            };
            this.documentMouseUpListener.set(documentMouseUpListener);
            this.document.addEventListener('mouseup', documentMouseUpListener);
        }
    }

    unbindDocumentMouseListeners(): void {
        const documentMouseMoveListener = this.documentMouseMoveListener();
        if (documentMouseMoveListener) {
            this.document.removeEventListener('mousemove', documentMouseMoveListener);
            this.documentMouseMoveListener.set(null);
        }

        const documentMouseUpListener = this.documentMouseUpListener();
        if (documentMouseUpListener) {
            document.removeEventListener('mouseup', documentMouseUpListener);
            this.documentMouseUpListener.set(null);
        }
    }

    onYBarMouseDown(e: MouseEvent) {
        this.isYBarClicked.set(true);
        const yBarViewChild = this.yBarViewChild();
        yBarViewChild.nativeElement.focus();
        this.lastPageY.set(e.pageY);

        yBarViewChild.nativeElement.setAttribute('data-p-scrollpanel-grabbed', 'true');
        !this.$unstyled() && addClass((yBarViewChild as ElementRef).nativeElement, 'p-scrollpanel-grabbed');

        this.document.body.setAttribute('data-p-scrollpanel-grabbed', 'true');
        !this.$unstyled() && addClass(this.document.body, 'p-scrollpanel-grabbed');
        this.bindDocumentMouseListeners();
        e.preventDefault();
    }

    onXBarMouseDown(e: MouseEvent) {
        this.isXBarClicked.set(true);
        const xBarViewChild = this.xBarViewChild();
        xBarViewChild.nativeElement.focus();
        this.lastPageX.set(e.pageX);

        xBarViewChild.nativeElement.setAttribute('data-p-scrollpanel-grabbed', 'false');
        !this.$unstyled() && addClass((xBarViewChild as ElementRef).nativeElement, 'p-scrollpanel-grabbed');

        this.document.body.setAttribute('data-p-scrollpanel-grabbed', 'false');
        !this.$unstyled() && addClass(this.document.body, 'p-scrollpanel-grabbed');

        this.bindDocumentMouseListeners();
        e.preventDefault();
    }

    onDocumentMouseMove(e: MouseEvent) {
        if (this.isXBarClicked()) {
            this.onMouseMoveForXBar(e);
        } else if (this.isYBarClicked()) {
            this.onMouseMoveForYBar(e);
        } else {
            this.onMouseMoveForXBar(e);
            this.onMouseMoveForYBar(e);
        }
    }

    onMouseMoveForXBar(e: MouseEvent) {
        let deltaX = e.pageX - (this.lastPageX() as number);
        this.lastPageX.set(e.pageX);

        this.requestAnimationFrame(() => {
            (this.contentViewChild() as ElementRef).nativeElement.scrollLeft += deltaX / (this.scrollXRatio() as number);
        });
    }

    onMouseMoveForYBar(e: MouseEvent) {
        let deltaY = e.pageY - (this.lastPageY() as number);
        this.lastPageY.set(e.pageY);

        this.requestAnimationFrame(() => {
            (this.contentViewChild() as ElementRef).nativeElement.scrollTop += deltaY / (this.scrollYRatio() as number);
        });
    }
    /**
     * Scrolls the top location to the given value.
     * @param scrollTop
     * @group Method
     */
    scrollTop(scrollTop: number) {
        let scrollableHeight = (this.contentViewChild() as ElementRef).nativeElement.scrollHeight - (this.contentViewChild() as ElementRef).nativeElement.clientHeight;
        scrollTop = scrollTop > scrollableHeight ? scrollableHeight : scrollTop > 0 ? scrollTop : 0;
        (this.contentViewChild() as ElementRef).nativeElement.scrollTop = scrollTop;
    }

    onFocus(event) {
        if (this.xBarViewChild().nativeElement?.isSameNode(event.target)) {
            this.orientation.set('horizontal');
        } else if (this.yBarViewChild().nativeElement?.isSameNode(event.target)) {
            this.orientation.set('vertical');
        }
    }

    onBlur() {
        if (this.orientation() === 'horizontal') {
            this.orientation.set('vertical');
        }
    }

    onDocumentMouseUp(e: Event) {
        const yBarViewChild = this.yBarViewChild();
        yBarViewChild.nativeElement.setAttribute('data-p-scrollpanel-grabbed', 'false');
        !this.$unstyled() && removeClass((yBarViewChild as ElementRef).nativeElement, 'p-scrollpanel-grabbed');
        const xBarViewChild = this.xBarViewChild();
        xBarViewChild.nativeElement.setAttribute('data-p-scrollpanel-grabbed', 'false');
        !this.$unstyled() && removeClass((xBarViewChild as ElementRef).nativeElement, 'p-scrollpanel-grabbed');
        this.document.body.setAttribute('data-p-scrollpanel-grabbed', 'false');
        !this.$unstyled() && removeClass(this.document.body, 'p-scrollpanel-grabbed');

        this.unbindDocumentMouseListeners();
        this.isXBarClicked.set(false);
        this.isYBarClicked.set(false);
    }

    requestAnimationFrame(f: VoidFunction) {
        let frame = window.requestAnimationFrame || this.timeoutFrame;
        frame(f);
    }

    unbindListeners() {
        const windowResizeListener = this.windowResizeListener();
        if (windowResizeListener) {
            windowResizeListener();
            this.windowResizeListener.set(null);
        }

        const contentScrollListener = this.contentScrollListener();
        if (contentScrollListener) {
            contentScrollListener();
            this.contentScrollListener.set(null);
        }

        const mouseEnterListener = this.mouseEnterListener();
        if (mouseEnterListener) {
            mouseEnterListener();
            this.mouseEnterListener.set(null);
        }

        const xBarMouseDownListener = this.xBarMouseDownListener();
        if (xBarMouseDownListener) {
            xBarMouseDownListener();
            this.xBarMouseDownListener.set(null);
        }

        const yBarMouseDownListener = this.yBarMouseDownListener();
        if (yBarMouseDownListener) {
            yBarMouseDownListener();
            this.yBarMouseDownListener.set(null);
        }
    }

    onDestroy() {
        if (this.initialized()) {
            this.unbindListeners();
        }
    }
    /**
     * Refreshes the position and size of the scrollbar.
     * @group Method
     */
    refresh() {
        this.moveBar();
    }
}

@NgModule({
    imports: [ScrollPanel, SharedModule, BindModule],
    exports: [ScrollPanel, SharedModule, BindModule]
})
export class ScrollPanelModule {}
