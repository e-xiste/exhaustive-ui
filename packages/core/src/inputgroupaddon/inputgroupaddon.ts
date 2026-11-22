import { ChangeDetectionStrategy, Component, inject, input, NgModule } from '@angular/core';
import { SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { InputGroupAddonPassThrough } from '@exhaustive-ui/core/types/inputgroupaddon';
import { InputGroupAddonStyle } from './style/inputgroupaddonstyle';

/**
 * InputGroupAddon displays text, icon, buttons and other content can be grouped next to an input.
 * @group Components
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'p-input-group-addon, p-inputgroup-addon, p-inputGroupAddon',
    template: ` <ng-content></ng-content> `,
    imports: [BindModule],
    host: {
        '[class]': "cx('root')",
        '[style]': 'style()'
    },
    providers: [InputGroupAddonStyle, { provide: PARENT_INSTANCE, useExisting: InputGroupAddon }],
    hostDirectives: [Bind]
})
export class InputGroupAddon extends BaseComponent<InputGroupAddonPassThrough> {
    componentName = 'InputGroupAddon';

    _componentStyle = inject(InputGroupAddonStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
    }

    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{ [klass: string]: any } | null | undefined>();
}

@NgModule({
    imports: [InputGroupAddon, SharedModule],
    exports: [InputGroupAddon, SharedModule]
})
export class InputGroupAddonModule {}
