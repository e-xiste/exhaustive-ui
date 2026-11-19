import { isPlatformBrowser } from '@angular/common';
import { afterEveryRender, afterNextRender, booleanAttribute, ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, NgModule, NgZone, signal, untracked, ViewEncapsulation, output } from '@angular/core';
import Chart from 'chart.js/auto';
import { SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent } from '@exhaustive-ui/core/basecomponent';
import { ChartStyle } from './style/chartstyle';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import type { ChartPassThrough } from '@exhaustive-ui/core/types/chart';

/**
 * Chart groups a collection of contents in tabs.
 * @group Components
 */
@Component({
    selector: 'p-chart',
    imports: [SharedModule, BindModule],
    template: `
        <canvas
            role="img"
            [attr.aria-label]="ariaLabel()"
            [attr.aria-labelledby]="ariaLabelledBy()"
            [attr.width]="responsive() && !width() ? null : width()"
            [attr.height]="responsive() && !height() ? null : height()"
            (click)="onCanvasClick($event)"
            [pBind]="ptm('canvas')"
        ></canvas>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cx('root')",
        '[style]': "sx('root')"
    },
    providers: [ChartStyle],
    hostDirectives: [Bind]
})
export class UIChart extends BaseComponent<ChartPassThrough> {
    el = inject(ElementRef);
    private zone = inject(NgZone);

    componentName = 'Chart';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
        effect(() => {
            this.data();
            this.options();
            untracked(() => this.reinit());
        });
        afterNextRender(() => {
            this.initChart();
            this.initialized.set(true);
        });
    }

    /**
     * Type of the chart.
     * @group Props
     */
    readonly type = input<'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar' | undefined>();
    /**
     * Array of per-chart plugins to customize the chart behaviour.
     * @group Props
     */
    readonly plugins = input<any[]>([]);
    /**
     * Width of the chart.
     * @group Props
     */
    readonly width = input<string | undefined>();
    /**
     * Height of the chart.
     * @group Props
     */
    readonly height = input<string | undefined>();
    /**
     * Whether the chart is redrawn on screen size change.
     * @group Props
     */
    readonly responsive = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    readonly ariaLabel = input<string | undefined>();
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    readonly ariaLabelledBy = input<string | undefined>();
    /**
     * Data to display.
     * @group Props
     */
    readonly data = input<any>();
    /**
     * Options to customize the chart.
     * @group Props
     */
    readonly options = input<any>({});
    /**
     * Callback to execute when an element on chart is clicked.
     * @group Emits
     */
    readonly onDataSelect = output<any>();

    initialized = signal<boolean | undefined>(undefined);

    chart = signal<any>(undefined);

    _componentStyle = inject(ChartStyle);

    onCanvasClick(event: Event) {
        const chart = this.chart();
        if (chart) {
            const element = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
            const dataset = chart.getElementsAtEventForMode(event, 'dataset', { intersect: true }, false);

            if (element && element[0] && dataset) {
                this.onDataSelect.emit({ originalEvent: event, element: element[0], dataset: dataset });
            }
        }
    }

    initChart() {
        if (isPlatformBrowser(this.platformId)) {
            let opts = this.options() || {};
            opts.responsive = this.responsive();

            // allows chart to resize in responsive mode
            if (opts.responsive && (this.height() || this.width())) {
                opts.maintainAspectRatio = false;
            }

            this.zone.runOutsideAngular(() => {
                this.chart.set(
                    new Chart(this.el.nativeElement.children[0], {
                        type: this.type(),
                        data: this.data(),
                        options: this.options(),
                        plugins: this.plugins()
                    })
                );
            });
        }
    }

    getCanvas() {
        return this.el.nativeElement.children[0];
    }

    getBase64Image() {
        return this.chart().toBase64Image();
    }

    generateLegend() {
        const chart = this.chart();
        if (chart) {
            return chart.generateLegend();
        }
    }

    refresh() {
        const chart = this.chart();
        if (chart) {
            chart.update();
        }
    }

    reinit() {
        const chart = this.chart();
        if (chart) {
            chart.destroy();
            this.initChart();
        }
    }

    onDestroy() {
        const chart = this.chart();
        if (chart) {
            chart.destroy();
            this.initialized.set(false);
            this.chart.set(null);
        }
    }
}

@NgModule({
    imports: [UIChart, SharedModule],
    exports: [UIChart, SharedModule]
})
export class ChartModule {}
