import { Component } from '@angular/core';
import { ImageCompareModule } from '@exhaustive-ui/core/imagecompare';
import { AppCodeModule } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCodeModule, ImageCompareModule],
    template: `
        <app-docsectiontext>
            <p>Images are defined using templating with <i>left</i> and <i>right</i> templates. Use the <i>style</i> or <i>class</i> properties to define the size of the container.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-image-compare class="shadow-lg rounded-2xl">
                <ng-template #left>
                    <img src="https://exhaustive-ui.com/demo/compare/island1.jpg" alt="Island, before" />
                </ng-template>
                <ng-template #right>
                    <img src="https://exhaustive-ui.com/demo/compare/island2.jpg" alt="Island, after" />
                </ng-template>
            </p-image-compare>
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {}
