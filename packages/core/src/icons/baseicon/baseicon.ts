import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { cn } from '@exhaustive-ui/utils';
import { BaseComponent } from '@exhaustive-ui/core/basecomponent';
import { BaseIconStyle } from './style/baseiconstyle';

@Component({
    template: ` <ng-content></ng-content> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [BaseIconStyle],
    host: {
        width: '14',
        height: '14',
        viewBox: '0 0 14 14',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        '[class]': 'getClassNames()'
    }
})
export class BaseIcon extends BaseComponent {
    readonly spin = input<boolean, unknown>(false, { transform: booleanAttribute });

    _componentStyle = inject(BaseIconStyle);

    readonly getClassNames = computed(() =>
        cn('p-icon', {
            'p-icon-spin': this.spin()
        })
    );
}
