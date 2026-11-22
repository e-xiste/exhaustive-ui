import { ChangeDetectionStrategy, Component, inject, NgModule, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '@exhaustive-ui/core/basecomponent';
import { ButtonGroupStyle } from './style/buttongroupstyle';

@Component({
    selector: 'p-button-group, p-buttonGroup, p-buttongroup',
    standalone: true,
    imports: [],
    template: `
        <span class="p-buttongroup p-component" role="group">
            <ng-content></ng-content>
        </span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ButtonGroupStyle]
})
export class ButtonGroup extends BaseComponent {
    componentName = 'ButtonGroup';

    _componentStyle = inject(ButtonGroupStyle);
}

@NgModule({
    imports: [ButtonGroup],
    exports: [ButtonGroup]
})
export class ButtonGroupModule {}
