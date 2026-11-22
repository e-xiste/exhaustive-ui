import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, NgModule, TemplateRef, inject, input } from '@angular/core';

/**
 * Header content projected into the components that have a header slot.
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'p-header',
    template: '<ng-content></ng-content>',
    standalone: false
})
export class Header {}

/**
 * Footer content projected into the components that have a footer slot.
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'p-footer',
    template: '<ng-content></ng-content>',
    standalone: false
})
export class Footer {}

/**
 * Legacy way to name a template: `<ng-template pTemplate="header">`. Prefer a template reference, `<ng-template #header>`, which every component reads; Tree and OrganizationChart still use pTemplate to pick a template by node type.
 */
@Directive({
    selector: '[pTemplate]'
})
export class PrimeTemplate {
    template = inject<TemplateRef<any>>(TemplateRef);

    readonly name = input<string | undefined>(undefined, { alias: 'pTemplate' });

    getType(): string {
        return this.name()!;
    }
}

@NgModule({
    imports: [CommonModule, PrimeTemplate],
    exports: [Header, Footer, PrimeTemplate],
    declarations: [Header, Footer]
})
export class SharedModule {}
