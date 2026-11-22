import { CommonModule } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, NgModule, TemplateRef, ViewEncapsulation, contentChild, contentChildren } from '@angular/core';
import { getOuterHeight } from '@exhaustive-ui/utils';
import { PrimeTemplate, SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { MeterGroupIconTemplateContext, MeterGroupLabelTemplateContext, MeterGroupMeterTemplateContext, MeterGroupPassThrough, MeterItem } from '@exhaustive-ui/core/types/metergroup';
import { MeterGroupStyle } from './style/metergroupstyle';

/**
 * @internal Rendering detail of MeterGroup, not part of the public API: it may change or stop being exported in a minor version.
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'p-meterGroupLabel, p-metergrouplabel',
    imports: [CommonModule, SharedModule, Bind],
    template: `
        <ol [class]="cx('labelList')" [pBind]="ptm('labelList')" [attr.data-p]="dataP()">
            @for (labelItem of value(); track parentInstance.trackByFn(index); let index = $index) {
                <li [class]="cx('label')" [pBind]="ptm('label')">
                    @if (!iconTemplate()) {
                        @if (labelItem.icon) {
                            <i [class]="labelItem.icon" [ngClass]="cx('labelIcon')" [pBind]="ptm('labelIcon')" [ngStyle]="{ color: labelItem.color }"></i>
                        }
                        @if (!labelItem.icon) {
                            <span [class]="cx('labelMarker')" [pBind]="ptm('labelMarker')" [ngStyle]="{ backgroundColor: labelItem.color }"></span>
                        }
                    }
                    <ng-container *ngTemplateOutlet="iconTemplate(); context: { $implicit: labelItem, icon: labelItem.icon }"></ng-container>
                    <span [class]="cx('labelText')" [pBind]="ptm('labelText')">{{ labelItem.label }} ({{ parentInstance.percentValue(labelItem.value) }})</span>
                </li>
            }
        </ol>
    `
})
export class MeterGroupLabel extends BaseComponent<MeterGroupPassThrough> {
    readonly value = input<any[]>([]);

    readonly labelPosition = input<'start' | 'end'>('end');

    readonly labelOrientation = input<'horizontal' | 'vertical'>('horizontal');

    readonly min = input<number>();

    readonly max = input<number>();

    readonly iconTemplate = input<TemplateRef<MeterGroupIconTemplateContext> | undefined>();

    parentInstance: MeterGroup = inject(forwardRef(() => MeterGroup));

    _componentStyle = inject(MeterGroupStyle);

    readonly dataP = computed(() =>
        this.cn({
            [this.labelOrientation()]: this.labelOrientation()
        })
    );
}
/**
 * MeterGroup displays scalar measurements within a known range.
 * @group Components
 */
@Component({
    selector: 'p-meterGroup, p-metergroup, p-meter-group',
    imports: [CommonModule, MeterGroupLabel, SharedModule, Bind],
    template: `
        @if (labelPosition() === 'start') {
            @if (!labelTemplate() && !_labelTemplate()) {
                <p-meterGroupLabel [value]="value()" [labelPosition]="labelPosition()" [labelOrientation]="labelOrientation()" [min]="min()" [max]="max()" [iconTemplate]="iconTemplate() || _iconTemplate()" [pt]="pt()" [unstyled]="unstyled()" />
            }
            <ng-container *ngTemplateOutlet="labelTemplate() || _labelTemplate(); context: { $implicit: value(), totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
        }
        <ng-container *ngTemplateOutlet="startTemplate() || _startTemplate(); context: { $implicit: value(), totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
        <div [class]="cx('meters')" [pBind]="ptm('meters')" [attr.data-p]="dataP()">
            @for (meterItem of value(); track trackByFn(index); let index = $index) {
                <ng-container
                    *ngTemplateOutlet="
                        meterTemplate() || _meterTemplate();
                        context: {
                            $implicit: meterItem,
                            index: index,
                            orientation: orientation(),
                            class: cx('meter'),
                            size: percentValue(meterItem.value),
                            totalPercent: totalPercent(),
                            dataP: dataP()
                        }
                    "
                >
                </ng-container>
                @if (!meterTemplate() && !_meterTemplate() && meterItem.value > 0) {
                    <span [class]="cx('meter')" [attr.data-p]="dataP()" [pBind]="ptm('meter')" [ngStyle]="meterStyle(meterItem)"></span>
                }
            }
        </div>
        <ng-container *ngTemplateOutlet="endTemplate() || _endTemplate(); context: { $implicit: value(), totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
        @if (labelPosition() === 'end') {
            @if (!labelTemplate() && !_labelTemplate()) {
                <p-meterGroupLabel [value]="value()" [labelPosition]="labelPosition()" [labelOrientation]="labelOrientation()" [min]="min()" [max]="max()" [iconTemplate]="iconTemplate() || _iconTemplate()" [pt]="pt()" [unstyled]="unstyled()" />
            }
            <ng-container *ngTemplateOutlet="labelTemplate() || _labelTemplate(); context: { $implicit: value(), totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [MeterGroupStyle, { provide: PARENT_INSTANCE, useExisting: MeterGroup }],
    host: {
        '[attr.aria-valuemin]': 'min()',
        '[attr.role]': '"meter"',
        '[attr.aria-valuemax]': 'max()',
        '[attr.aria-valuenow]': 'totalPercent()',
        '[attr.data-p]': 'dataP()',
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class MeterGroup extends BaseComponent<MeterGroupPassThrough> {
    componentName = 'MeterGroup';

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterNextRender(() => {
            const _container = this.el.nativeElement;
            const height = getOuterHeight(_container);
            this.vertical() && (_container.style.height = height + 'px');
        });
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
    }
    /**
     * Current value of the metergroup.
     * @group Props
     */
    readonly value = input<MeterItem[] | undefined>();
    /**
     * Mininum boundary value.
     * @group Props
     */
    readonly min = input<number>(0);
    /**
     * Maximum boundary value.
     * @group Props
     */
    readonly max = input<number>(100);
    /**
     * Specifies the layout of the component, valid values are 'horizontal' and 'vertical'.
     * @group Props
     */
    readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
    /**
     * Specifies the label position of the component, valid values are 'start' and 'end'.
     * @group Props
     */
    readonly labelPosition = input<'start' | 'end'>('end');
    /**
     * Specifies the label orientation of the component, valid values are 'horizontal' and 'vertical'.
     * @group Props
     */
    readonly labelOrientation = input<'horizontal' | 'vertical' | undefined>('horizontal');

    readonly vertical = computed(() => this.orientation() === 'vertical');

    /**
     * Custom label template.
     * @param {MeterGroupLabelTemplateContext} context - label context.
     * @see {@link MeterGroupLabelTemplateContext}
     * @group Templates
     */
    readonly labelTemplate = contentChild<TemplateRef<MeterGroupLabelTemplateContext>>('label', { descendants: false });

    /**
     * Custom meter template.
     * @param {MeterGroupMeterTemplateContext} context - meter context.
     * @see {@link MeterGroupMeterTemplateContext}
     * @group Templates
     */
    readonly meterTemplate = contentChild<TemplateRef<MeterGroupMeterTemplateContext>>('meter', { descendants: false });

    /**
     * Custom end template.
     * @param {MeterGroupLabelTemplateContext} context - end context.
     * @see {@link MeterGroupLabelTemplateContext}
     * @group Templates
     */
    readonly endTemplate = contentChild<TemplateRef<MeterGroupLabelTemplateContext>>('end', { descendants: false });

    /**
     * Custom start template.
     * @param {MeterGroupLabelTemplateContext} context - start context.
     * @see {@link MeterGroupLabelTemplateContext}
     * @group Templates
     */
    readonly startTemplate = contentChild<TemplateRef<MeterGroupLabelTemplateContext>>('start', { descendants: false });

    /**
     * Custom icon template.
     * @param {MeterGroupIconTemplateContext} context - icon context.
     * @see {@link MeterGroupIconTemplateContext}
     * @group Templates
     */
    readonly iconTemplate = contentChild<TemplateRef<MeterGroupIconTemplateContext>>('icon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    readonly _labelTemplate = computed<TemplateRef<MeterGroupLabelTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'label')
                .at(-1)?.template
    );

    readonly _meterTemplate = computed<TemplateRef<MeterGroupMeterTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'meter')
                .at(-1)?.template
    );

    readonly _endTemplate = computed<TemplateRef<MeterGroupLabelTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'end')
                .at(-1)?.template
    );

    readonly _startTemplate = computed<TemplateRef<MeterGroupLabelTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'start')
                .at(-1)?.template
    );

    readonly _iconTemplate = computed<TemplateRef<MeterGroupIconTemplateContext> | undefined>(
        () =>
            this.templates()
                .filter((item) => item.getType() === 'icon')
                .at(-1)?.template
    );

    _componentStyle = inject(MeterGroupStyle);

    percent(meter = 0, round = true) {
        if (this.max() === this.min()) {
            return 100; // When min = max, any value should be 100%
        }
        const percentOfItem = Math.max(0, Math.min(100, ((meter - this.min()) / (this.max() - this.min())) * 100));

        return round ? Math.round(percentOfItem) : percentOfItem;
    }

    percentValue(meter: number) {
        return this.percent(meter) + '%';
    }

    meterStyle(val: MeterItem) {
        return {
            backgroundColor: val.color,
            width: this.orientation() === 'horizontal' && this.percent(val.value || 0, false) + '%',
            height: this.orientation() === 'vertical' && this.percent(val.value || 0, false) + '%'
        };
    }

    readonly totalPercent = computed(() => {
        const value = this.value();
        if (!value) {
            return 0;
        }
        return this.percent(value.reduce((total, val) => total + (val.value || 0), 0));
    });

    readonly percentages = computed(() => {
        const value = this.value();
        if (!value) {
            return [];
        }

        let sum = 0;
        const sumsArray: number[] = [];

        value.forEach((item) => {
            sum += item.value || 0;
            sumsArray.push(sum);
        });

        return sumsArray;
    });

    trackByFn(index: number): number {
        return index;
    }

    readonly dataP = computed(() =>
        this.cn({
            [this.orientation()]: this.orientation()
        })
    );
}

@NgModule({
    imports: [MeterGroup, SharedModule],
    exports: [MeterGroup, SharedModule]
})
export class MeterGroupModule {}
