import { computed, Directive, signal } from '@angular/core';
import { isNotEmpty } from '@exhaustive-ui/utils';
import { BaseComponent } from '@exhaustive-ui/core/basecomponent';

@Directive({ standalone: true })
export class BaseModelHolder<PT = any> extends BaseComponent<PT> {
    modelValue = signal<string | string[] | any | undefined>(undefined);

    $filled = computed(() => isNotEmpty(this.modelValue()));

    writeModelValue(value: any) {
        this.modelValue.set(value);
    }
}
