import { AccessibilityDoc } from '@/doc/inputchips/accessibility-doc';
import { AddOnBlurDoc } from '@/doc/inputchips/addonblur-doc';
import { BasicDoc } from '@/doc/inputchips/basic-doc';
import { DisabledDoc } from '@/doc/inputchips/disabled-doc';
import { FilledDoc } from '@/doc/inputchips/filled-doc';
import { FloatLabelDoc } from '@/doc/inputchips/floatlabel-doc';
import { FluidDoc } from '@/doc/inputchips/fluid-doc';
import { IconFieldDoc } from '@/doc/inputchips/iconfield-doc';
import { IftaLabelDoc } from '@/doc/inputchips/iftalabel-doc';
import { ImportDoc } from '@/doc/inputchips/import-doc';
import { InvalidDoc } from '@/doc/inputchips/invalid-doc';
import { LimitsDoc } from '@/doc/inputchips/limits-doc';
import { ReactiveFormsDoc } from '@/doc/inputchips/reactiveforms-doc';
import { SeparatorDoc } from '@/doc/inputchips/separator-doc';
import { SignalFormsDoc } from '@/doc/inputchips/signalforms-doc';
import { SizesDoc } from '@/doc/inputchips/sizes-doc';
import { TemplateDoc } from '@/doc/inputchips/template-doc';
import { TemplateDrivenFormsDoc } from '@/doc/inputchips/templatedrivenforms-doc';
import { ValidationDoc } from '@/doc/inputchips/validation-doc';
import { PTComponent } from '@/doc/inputchips/pt/PTComponent';
import { Component } from '@angular/core';
import { AppDoc } from '@/components/doc/app.doc';

@Component({
    template: `<app-doc
        docTitle="Angular InputChips Component - ExhaustiveUI"
        header="InputChips"
        description="InputChips enters several free-text values, such as tags, keywords or email addresses, each shown as a removable chip. Values are added with Enter, a separator or a paste, checked against limits and your own rules, and the component works with every kind of Angular form."
        [docs]="docs"
        [apiDocs]="['InputChips']"
        [ptDocs]="ptComponent"
        themeDocs="inputchips"
    ></app-doc>`,
    standalone: true,
    imports: [AppDoc]
})
export class InputChipsDemo {
    ptComponent = PTComponent;
    docs = [
        { id: 'import', label: 'Import', component: ImportDoc },
        { id: 'basic', label: 'Basic', component: BasicDoc },
        { id: 'separator', label: 'Separator', component: SeparatorDoc },
        { id: 'addonblur', label: 'Add on Blur and Tab', component: AddOnBlurDoc },
        { id: 'limits', label: 'Limits', component: LimitsDoc },
        { id: 'validation', label: 'Validation', component: ValidationDoc },
        { id: 'template', label: 'Template', component: TemplateDoc },
        { id: 'floatlabel', label: 'Float Label', component: FloatLabelDoc },
        { id: 'iftalabel', label: 'Ifta Label', component: IftaLabelDoc },
        { id: 'iconfield', label: 'Icon', component: IconFieldDoc },
        { id: 'sizes', label: 'Sizes', component: SizesDoc },
        { id: 'filled', label: 'Filled', component: FilledDoc },
        { id: 'fluid', label: 'Fluid', component: FluidDoc },
        { id: 'disabled', label: 'Disabled', component: DisabledDoc },
        { id: 'invalid', label: 'Invalid', component: InvalidDoc },
        {
            id: 'forms',
            label: 'Forms',
            children: [
                { id: 'templatedriven', label: 'Template Driven', component: TemplateDrivenFormsDoc },
                { id: 'reactive', label: 'Reactive Forms', component: ReactiveFormsDoc },
                { id: 'signalforms', label: 'Signal Forms', component: SignalFormsDoc }
            ]
        },
        { id: 'accessibility', label: 'Accessibility', component: AccessibilityDoc }
    ];
}
