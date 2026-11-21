import { ChangeDetectionStrategy, Component, DebugElement, PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import type { ChartDataSelectEvent } from '@exhaustive-ui/core/types/chart';
import { ChartModule, UIChart } from './chart';

const basicData = () => ({
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{ label: 'Sales', data: [540, 325, 702, 620] }]
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-basic-chart',
    template: `<p-chart [type]="type" [data]="data" [options]="options" [plugins]="plugins" (onDataSelect)="onDataSelect($event)"></p-chart>`
})
class TestBasicChartComponent {
    type: 'bar' | 'line' | 'pie' = 'bar';
    data: any = basicData();
    options: any = { animation: false };
    plugins: any[] = [];
    selected: any;

    onDataSelect(event: any) {
        this.selected = event;
    }
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-chart-dimensions',
    template: `<p-chart type="bar" [data]="data" [options]="options" [width]="width" [height]="height" [responsive]="responsive" [ariaLabel]="ariaLabel" [ariaLabelledBy]="ariaLabelledBy"></p-chart>`
})
class TestChartDimensionsComponent {
    data: any = basicData();
    options: any = { animation: false };
    width: string | undefined = '300px';
    height: string | undefined = '150px';
    responsive = false;
    ariaLabel: string | undefined = 'Sales chart';
    ariaLabelledBy: string | undefined = 'sales-title';
}

describe('UIChart', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ChartModule],
            declarations: [TestBasicChartComponent, TestChartDimensionsComponent],
            providers: [provideZonelessChangeDetection()]
        });
    });

    describe('Component Initialization', () => {
        let fixture: ComponentFixture<TestBasicChartComponent>;
        let component: TestBasicChartComponent;
        let chart: UIChart;
        let debugElement: DebugElement;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestBasicChartComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            await fixture.whenStable();

            debugElement = fixture.debugElement.query(By.directive(UIChart));
            chart = debugElement.componentInstance;
        });

        it('should create the component', () => {
            expect(chart).toBeTruthy();
        });

        it('should have default values', () => {
            const newChart = TestBed.createComponent(UIChart).componentInstance;

            expect(newChart.type()).toBeUndefined();
            expect(newChart.plugins()).toEqual([]);
            expect(newChart.options()).toEqual({});
            expect(newChart.data()).toBeUndefined();
            expect(newChart.width()).toBeUndefined();
            expect(newChart.height()).toBeUndefined();
            expect(newChart.responsive()).toBe(true);
            expect(newChart.ariaLabel()).toBeUndefined();
            expect(newChart.ariaLabelledBy()).toBeUndefined();
            expect(newChart.initialized()).toBeUndefined();
            expect(newChart.chart()).toBeUndefined();
        });

        it('should accept custom values', () => {
            expect(chart.type()).toBe('bar');
            expect(chart.data()).toBe(component.data);
            expect(chart.options()).toBe(component.options);
            expect(chart.plugins()).toBe(component.plugins);
        });

        it('should extend BaseComponent', () => {
            expect(chart.cx).toBeDefined();
            expect(chart.cd).toBeDefined();
        });

        it('should inject component style', () => {
            expect(chart._componentStyle).toBeDefined();
        });

        it('should initialize the chart.js instance after the first render', () => {
            expect(chart.initialized()).toBe(true);
            expect(chart.chart()).toBeTruthy();
            expect(chart.chart().canvas).toBe(chart.getCanvas());
            expect(chart.chart().config.type).toBe('bar');
            expect(chart.chart().data.labels).toEqual(['Q1', 'Q2', 'Q3', 'Q4']);
        });

        it('should create the chart exactly once on first render', async () => {
            const newFixture = TestBed.createComponent(TestBasicChartComponent);
            const newChart = newFixture.debugElement.query(By.directive(UIChart)).componentInstance as UIChart;
            const initSpy = vi.spyOn(newChart, 'initChart');
            const reinitSpy = vi.spyOn(newChart, 'reinit');

            newFixture.detectChanges();
            await newFixture.whenStable();

            expect(reinitSpy).toHaveBeenCalledTimes(1);
            expect(initSpy).toHaveBeenCalledTimes(1);
            expect(newChart.chart()).toBeTruthy();
            expect(newChart.initialized()).toBe(true);
        });

        it('should apply root class and inline styles on the host', () => {
            const host = debugElement.nativeElement as HTMLElement;

            expect(host.classList.contains('p-chart')).toBe(true);
            expect(host.style.display).toBe('block');
            expect(host.style.position).toBe('relative');
        });

        it('should render a canvas with img role', () => {
            const canvas = debugElement.query(By.css('canvas')).nativeElement as HTMLCanvasElement;

            expect(canvas.getAttribute('role')).toBe('img');
            expect(canvas.getAttribute('aria-label')).toBeNull();
            expect(canvas.getAttribute('aria-labelledby')).toBeNull();
        });

        it('should set responsive on the options passed to chart.js', () => {
            expect(component.options.responsive).toBe(true);
            expect(component.options.maintainAspectRatio).toBeUndefined();
            expect(chart.chart().options.responsive).toBe(true);
        });
    });

    describe('Canvas attribute bindings', () => {
        let fixture: ComponentFixture<UIChart>;
        let canvas: HTMLCanvasElement;
        let initSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            initSpy = vi.spyOn(UIChart.prototype, 'initChart').mockImplementation(() => undefined);
            fixture = TestBed.createComponent(UIChart);
            fixture.componentRef.setInput('type', 'bar');
            fixture.componentRef.setInput('data', basicData());
            fixture.detectChanges();
            canvas = fixture.debugElement.query(By.css('canvas')).nativeElement;
        });

        afterEach(() => {
            initSpy.mockRestore();
        });

        it('should not bind width and height when responsive without dimensions', () => {
            expect(fixture.componentInstance.chart()).toBeUndefined();
            expect(canvas.getAttribute('width')).toBeNull();
            expect(canvas.getAttribute('height')).toBeNull();
        });

        it('should bind width and height when responsive with explicit dimensions', () => {
            fixture.componentRef.setInput('width', '300px');
            fixture.componentRef.setInput('height', '150px');
            fixture.detectChanges();

            expect(canvas.getAttribute('width')).toBe('300px');
            expect(canvas.getAttribute('height')).toBe('150px');
        });

        it('should bind width and height when not responsive', () => {
            fixture.componentRef.setInput('responsive', false);
            fixture.componentRef.setInput('width', '300px');
            fixture.componentRef.setInput('height', '150px');
            fixture.detectChanges();

            expect(canvas.getAttribute('width')).toBe('300px');
            expect(canvas.getAttribute('height')).toBe('150px');

            fixture.componentRef.setInput('width', undefined);
            fixture.componentRef.setInput('height', undefined);
            fixture.detectChanges();

            expect(canvas.getAttribute('width')).toBeNull();
            expect(canvas.getAttribute('height')).toBeNull();
        });

        it('should coerce the responsive attribute string', () => {
            fixture.componentRef.setInput('responsive', 'false');
            fixture.detectChanges();
            expect(fixture.componentInstance.responsive()).toBe(false);

            fixture.componentRef.setInput('responsive', '');
            fixture.detectChanges();
            expect(fixture.componentInstance.responsive()).toBe(true);
        });
    });

    describe('Dimensions and Accessibility', () => {
        let fixture: ComponentFixture<TestChartDimensionsComponent>;
        let component: TestChartDimensionsComponent;
        let chart: UIChart;
        let host: HTMLElement;
        let canvas: HTMLCanvasElement;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestChartDimensionsComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            await fixture.whenStable();

            const debugElement = fixture.debugElement.query(By.directive(UIChart));
            chart = debugElement.componentInstance;
            host = debugElement.nativeElement;
            canvas = debugElement.query(By.css('canvas')).nativeElement;
        });

        it('should bind aria attributes on the canvas', () => {
            expect(canvas.getAttribute('aria-label')).toBe('Sales chart');
            expect(canvas.getAttribute('aria-labelledby')).toBe('sales-title');
        });

        it('should apply width and height to the host inline style', () => {
            expect(chart.width()).toBe('300px');
            expect(chart.height()).toBe('150px');
            expect(host.style.width).toBe('300px');
            expect(host.style.height).toBe('150px');
        });

        it('should keep maintainAspectRatio when not responsive', () => {
            expect(chart.responsive()).toBe(false);
            expect(component.options.responsive).toBe(false);
            expect(component.options.maintainAspectRatio).toBeUndefined();
            expect(chart.chart().options.responsive).toBe(false);
        });

        it('should disable maintainAspectRatio when responsive with explicit dimensions', async () => {
            const options: any = { animation: false };
            component.options = options;
            component.responsive = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(chart.responsive()).toBe(true);
            expect(options.responsive).toBe(true);
            expect(options.maintainAspectRatio).toBe(false);
            expect(chart.chart().options.maintainAspectRatio).toBe(false);
        });

        it('should update aria attributes and host style dynamically', async () => {
            component.ariaLabel = 'Revenue chart';
            component.ariaLabelledBy = undefined;
            component.width = '400px';
            component.height = undefined;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(canvas.getAttribute('aria-label')).toBe('Revenue chart');
            expect(canvas.getAttribute('aria-labelledby')).toBeNull();
            expect(host.style.width).toBe('400px');
            expect(host.style.height).toBe('');
        });
    });

    describe('Reactivity to data and options', () => {
        let fixture: ComponentFixture<TestBasicChartComponent>;
        let component: TestBasicChartComponent;
        let chart: UIChart;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestBasicChartComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            await fixture.whenStable();

            chart = fixture.debugElement.query(By.directive(UIChart)).componentInstance;
        });

        it('should recreate the chart when data changes', async () => {
            const firstChart = chart.chart();
            const destroySpy = vi.spyOn(firstChart, 'destroy');

            component.data = { labels: ['X', 'Y'], datasets: [{ label: 'Changed', data: [5, 6] }] };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(destroySpy).toHaveBeenCalledTimes(1);
            expect(chart.chart()).toBeTruthy();
            expect(chart.chart()).not.toBe(firstChart);
            expect(chart.chart().data.labels).toEqual(['X', 'Y']);
            expect(chart.data().labels).toEqual(['X', 'Y']);
        });

        it('should recreate the chart when options change', async () => {
            const firstChart = chart.chart();
            const destroySpy = vi.spyOn(firstChart, 'destroy');
            const options = { animation: false, plugins: { legend: { display: false } } };

            component.options = options;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(destroySpy).toHaveBeenCalledTimes(1);
            expect(chart.chart()).not.toBe(firstChart);
            expect(chart.options()).toBe(options);
            expect(chart.chart().options.plugins.legend.display).toBe(false);
        });

        it('should recreate the chart once when both data and options change', async () => {
            const firstChart = chart.chart();
            const initSpy = vi.spyOn(chart, 'initChart');

            component.data = { labels: ['X'], datasets: [{ data: [1] }] };
            component.options = { animation: false };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(initSpy).toHaveBeenCalledTimes(1);
            expect(chart.chart()).not.toBe(firstChart);
        });

        it('should not recreate the chart when type or plugins change', async () => {
            const firstChart = chart.chart();
            const initSpy = vi.spyOn(chart, 'initChart');

            component.type = 'line';
            component.plugins = [{ id: 'noop' }];
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(chart.type()).toBe('line');
            expect(initSpy).not.toHaveBeenCalled();
            expect(chart.chart()).toBe(firstChart);
        });

        it('should not recreate the chart when it is only refreshed', () => {
            const firstChart = chart.chart();
            const updateSpy = vi.spyOn(firstChart, 'update');

            chart.refresh();

            expect(updateSpy).toHaveBeenCalledTimes(1);
            expect(chart.chart()).toBe(firstChart);
        });

        it('should recreate the chart on reinit', () => {
            const firstChart = chart.chart();
            const destroySpy = vi.spyOn(firstChart, 'destroy');

            chart.reinit();

            expect(destroySpy).toHaveBeenCalledTimes(1);
            expect(chart.chart()).not.toBe(firstChart);
            expect(chart.chart().data.labels).toEqual(['Q1', 'Q2', 'Q3', 'Q4']);
        });

        it('should reuse the same canvas after reinit', async () => {
            component.data = { labels: ['X'], datasets: [{ data: [1] }] };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const canvas = fixture.debugElement.query(By.css('canvas')).nativeElement as HTMLCanvasElement;
            expect(chart.getCanvas()).toBe(canvas);
            expect(chart.chart().canvas).toBe(canvas);
        });
    });

    describe('Methods', () => {
        let fixture: ComponentFixture<TestBasicChartComponent>;
        let chart: UIChart;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestBasicChartComponent);
            fixture.detectChanges();
            await fixture.whenStable();

            chart = fixture.debugElement.query(By.directive(UIChart)).componentInstance;
        });

        it('should expose the canvas through getCanvas', () => {
            const canvas = fixture.debugElement.query(By.css('canvas')).nativeElement;

            expect(chart.getCanvas()).toBe(canvas);
            expect(chart.getCanvas().tagName).toBe('CANVAS');
        });

        it('should return a base64 image', () => {
            const image = chart.getBase64Image();

            expect(typeof image).toBe('string');
            // a canvas not laid out yet (busy test run) encodes as 'data:,'; the method only has to delegate to toDataURL
            expect(image).toBe(chart.getCanvas().toDataURL());
            expect(image.startsWith('data:')).toBe(true);
        });

        it('should delegate refresh to chart.update', () => {
            const updateSpy = vi.spyOn(chart.chart(), 'update');

            chart.refresh();

            expect(updateSpy).toHaveBeenCalledTimes(1);
        });

        it('should not throw on refresh, reinit and generateLegend without a chart', () => {
            const newChart = TestBed.createComponent(UIChart).componentInstance;

            expect(newChart.chart()).toBeUndefined();
            expect(() => newChart.refresh()).not.toThrow();
            expect(() => newChart.reinit()).not.toThrow();
            expect(newChart.generateLegend()).toBeUndefined();
            expect(newChart.chart()).toBeUndefined();
        });

        it('should delegate generateLegend to the chart instance', () => {
            chart.chart().generateLegend = vi.fn().mockReturnValue('<ul></ul>');

            expect(chart.generateLegend()).toBe('<ul></ul>');
        });
    });

    describe('Events', () => {
        let fixture: ComponentFixture<TestBasicChartComponent>;
        let component: TestBasicChartComponent;
        let chart: UIChart;
        let canvas: HTMLCanvasElement;

        beforeEach(async () => {
            fixture = TestBed.createComponent(TestBasicChartComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            await fixture.whenStable();

            chart = fixture.debugElement.query(By.directive(UIChart)).componentInstance;
            canvas = fixture.debugElement.query(By.css('canvas')).nativeElement;
        });

        it('should emit onDataSelect when an element is hit', () => {
            const element = { datasetIndex: 0, index: 1 };
            const dataset = [{ datasetIndex: 0, index: 0 }, element];
            vi.spyOn(chart.chart(), 'getElementsAtEventForMode').mockImplementation((_event: Event, mode: string) => (mode === 'nearest' ? [element] : dataset));

            const emitSpy = vi.fn();
            chart.onDataSelect.subscribe(emitSpy);

            canvas.click();

            expect(emitSpy).toHaveBeenCalledTimes(1);
            expect(emitSpy.mock.calls[0][0].element).toBe(element);
            expect(emitSpy.mock.calls[0][0].dataset).toBe(dataset);
            expect(emitSpy.mock.calls[0][0].originalEvent).toBeInstanceOf(Event);
            expect(component.selected.element).toBe(element);
        });

        it('should emit a typed ChartDataSelectEvent (optimus-ui#394)', () => {
            const element = { datasetIndex: 0, index: 1 };
            vi.spyOn(chart.chart(), 'getElementsAtEventForMode').mockReturnValue([element]);

            let selected: ChartDataSelectEvent | undefined;
            chart.onDataSelect.subscribe((event: ChartDataSelectEvent) => (selected = event));
            // @ts-expect-error the event is typed, its element is not a string
            chart.onDataSelect.subscribe((event: { element: string }) => event);

            canvas.click();

            expect(selected?.element.index).toBe(1);
            expect(selected?.dataset[0].datasetIndex).toBe(0);
        });

        it('should not emit onDataSelect when nothing is hit', () => {
            vi.spyOn(chart.chart(), 'getElementsAtEventForMode').mockReturnValue([]);
            const emitSpy = vi.fn();
            chart.onDataSelect.subscribe(emitSpy);

            canvas.click();

            expect(emitSpy).not.toHaveBeenCalled();
            expect(component.selected).toBeUndefined();
        });

        it('should ignore canvas clicks before the chart exists', () => {
            const newChart = TestBed.createComponent(UIChart).componentInstance;
            const emitSpy = vi.fn();
            newChart.onDataSelect.subscribe(emitSpy);

            expect(() => newChart.onCanvasClick(new MouseEvent('click'))).not.toThrow();
            expect(emitSpy).not.toHaveBeenCalled();
        });
    });

    describe('Lifecycle', () => {
        it('should destroy the chart on component destroy', async () => {
            const fixture = TestBed.createComponent(TestBasicChartComponent);
            fixture.detectChanges();
            await fixture.whenStable();
            const chart = fixture.debugElement.query(By.directive(UIChart)).componentInstance as UIChart;
            const instance = chart.chart();
            const destroySpy = vi.spyOn(instance, 'destroy');

            fixture.destroy();

            expect(destroySpy).toHaveBeenCalledTimes(1);
            expect(chart.chart()).toBeNull();
            expect(chart.initialized()).toBe(false);
        });

        it('should not create a chart on server platform', async () => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                imports: [ChartModule],
                declarations: [TestBasicChartComponent],
                providers: [provideZonelessChangeDetection(), { provide: PLATFORM_ID, useValue: 'server' }]
            });

            const serverFixture = TestBed.createComponent(TestBasicChartComponent);
            serverFixture.detectChanges();
            await serverFixture.whenStable();
            const serverChart = serverFixture.debugElement.query(By.directive(UIChart)).componentInstance as UIChart;

            serverChart.initChart();

            expect(serverChart.chart()).toBeUndefined();
            expect(() => serverFixture.destroy()).not.toThrow();
        });
    });

    describe('OnPush Rendering', () => {
        let directFixture: ComponentFixture<UIChart>;
        let host: HTMLElement;
        let canvas: HTMLCanvasElement;

        beforeEach(async () => {
            directFixture = TestBed.createComponent(UIChart);
            directFixture.componentRef.setInput('type', 'bar');
            directFixture.componentRef.setInput('data', basicData());
            directFixture.componentRef.setInput('options', { animation: false });
            directFixture.detectChanges();
            await directFixture.whenStable();

            host = directFixture.nativeElement;
            canvas = directFixture.debugElement.query(By.css('canvas')).nativeElement;
        });

        it('should render the chart with host class', () => {
            expect(directFixture.componentInstance.chart()).toBeTruthy();
            expect(host.classList.contains('p-chart')).toBe(true);
        });

        it('should re-render when ariaLabel changes', () => {
            directFixture.componentRef.setInput('ariaLabel', 'First');
            directFixture.detectChanges();
            expect(canvas.getAttribute('aria-label')).toBe('First');

            directFixture.componentRef.setInput('ariaLabel', 'Second');
            directFixture.detectChanges();
            expect(canvas.getAttribute('aria-label')).toBe('Second');
        });

        it('should re-render when ariaLabelledBy changes', () => {
            directFixture.componentRef.setInput('ariaLabelledBy', 'title-1');
            directFixture.detectChanges();
            expect(canvas.getAttribute('aria-labelledby')).toBe('title-1');

            directFixture.componentRef.setInput('ariaLabelledBy', 'title-2');
            directFixture.detectChanges();
            expect(canvas.getAttribute('aria-labelledby')).toBe('title-2');
        });

        it('should re-render when width changes', () => {
            directFixture.componentRef.setInput('width', '200px');
            directFixture.detectChanges();
            expect(canvas.getAttribute('width')).toBe('200px');
            expect(host.style.width).toBe('200px');

            directFixture.componentRef.setInput('width', '400px');
            directFixture.detectChanges();
            expect(canvas.getAttribute('width')).toBe('400px');
            expect(host.style.width).toBe('400px');
        });

        it('should re-render when height changes', () => {
            directFixture.componentRef.setInput('height', '100px');
            directFixture.detectChanges();
            expect(canvas.getAttribute('height')).toBe('100px');
            expect(host.style.height).toBe('100px');

            directFixture.componentRef.setInput('height', '300px');
            directFixture.detectChanges();
            expect(canvas.getAttribute('height')).toBe('300px');
            expect(host.style.height).toBe('300px');
        });

        it('should re-render when responsive changes', () => {
            directFixture.componentRef.setInput('responsive', false);
            directFixture.detectChanges();
            expect(directFixture.componentInstance.responsive()).toBe(false);

            directFixture.componentRef.setInput('width', '250px');
            directFixture.detectChanges();
            expect(canvas.getAttribute('width')).toBe('250px');

            directFixture.componentRef.setInput('responsive', true);
            directFixture.componentRef.setInput('width', undefined);
            directFixture.detectChanges();
            expect(canvas.getAttribute('width')).not.toBe('250px');
        });

        it('should re-render the chart when data changes', async () => {
            const firstChart = directFixture.componentInstance.chart();

            directFixture.componentRef.setInput('data', { labels: ['A', 'B'], datasets: [{ data: [1, 2] }] });
            directFixture.detectChanges();
            await directFixture.whenStable();

            expect(directFixture.componentInstance.chart()).not.toBe(firstChart);
            expect(directFixture.componentInstance.chart().data.labels).toEqual(['A', 'B']);
            expect(directFixture.componentInstance.chart().canvas).toBe(canvas);
        });

        it('should re-render the chart when options change', async () => {
            const firstChart = directFixture.componentInstance.chart();

            directFixture.componentRef.setInput('options', { animation: false, plugins: { legend: { display: false } } });
            directFixture.detectChanges();
            await directFixture.whenStable();

            expect(directFixture.componentInstance.chart()).not.toBe(firstChart);
            expect(directFixture.componentInstance.chart().options.plugins.legend.display).toBe(false);
        });

        it('should pass type and plugins to the new chart.js instance on reinit', async () => {
            const plugin = { id: 'test-plugin' };
            directFixture.componentRef.setInput('type', 'line');
            directFixture.componentRef.setInput('plugins', [plugin]);
            directFixture.componentRef.setInput('data', basicData());
            directFixture.detectChanges();
            await directFixture.whenStable();

            expect(directFixture.componentInstance.chart().config.type).toBe('line');
            expect(directFixture.componentInstance.chart().config.plugins).toEqual([plugin]);
        });
    });
});
