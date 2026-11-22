import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'optimus-layer-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Optimus UI puts its styles in a CSS cascade layer named <i>optimus</i> when the theme enables <i>cssLayer</i>; ExhaustiveUI names it <i>exhaustive</i>. The schematic renames the <i>optimus</i> token in the <i>cssLayer</i>
                <i>name</i> and <i>order</i> of your configuration, then the matching <i>&#64;layer</i> declarations and <i>&#64;import ... layer()</i> clauses in your stylesheets, so your overrides keep their place in the layer order. With
                <i>cssLayer: true</i>, the configuration does not change, and only the stylesheets are renamed.
            </p>
            <p>A layer of your own, with another name, is left as it is. The CSS classes (<i>p-button</i>...), the design tokens (<i>--p-primary-color</i>...) and the icon classes (<i>pi pi-check</i>...) do not change.</p>
        </app-docsectiontext>
    `
})
export class OptimusLayerDoc {}
