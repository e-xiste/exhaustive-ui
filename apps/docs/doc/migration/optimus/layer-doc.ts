import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'optimus-layer-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                When the theme enables <i>cssLayer</i> without naming the layer, the styles go to a layer named <i>exhaustive</i> instead of <i>optimus</i>. Rename the layer in your stylesheets, in the ordering statement and in the blocks that
                override the components, or the overrides fall out of the configured order.
            </p>
            <p>A layer named explicitly in the configuration, with <i>cssLayer: &#123; name: 'optimus', order: '...' &#125;</i>, keeps its name: nothing changes until you rename it on both sides.</p>
            <p>The CSS classes (<i>p-button</i>...), the design tokens (<i>--p-primary-color</i>...) and the icon classes (<i>pi pi-check</i>...) do not change.</p>
        </app-docsectiontext>
    `
})
export class OptimusLayerDoc {}
