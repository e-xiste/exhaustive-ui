import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { SkeletonModule } from '@exhaustive-ui/core/skeleton';

@Component({
    selector: 'shapes-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, SkeletonModule],
    template: `
        <app-docsectiontext>
            <p>Various shapes and sizes can be created using styling properties like <i>shape</i>, <i>width</i>, <i>height</i>, <i>borderRadius</i> and <i>class</i>.</p>
        </app-docsectiontext>
        <div class="card">
            <div class="flex flex-wrap">
                <div class="w-full xl:w-6/12 p-4">
                    <div class="font-semibold mb-4">Rectangle</div>
                    <p-skeleton class="mb-2" />
                    <p-skeleton width="10rem" class="mb-2" />
                    <p-skeleton width="5rem" class="mb-2" />
                    <p-skeleton height="2rem" class="mb-2" />
                    <p-skeleton width="10rem" height="4rem" />
                </div>
                <div class="w-full xl:w-6/12 p-4">
                    <div class="font-semibold mb-4">Rounded</div>
                    <p-skeleton class="mb-2" borderRadius="16px" />
                    <p-skeleton width="10rem" class="mb-2" borderRadius="16px" />
                    <p-skeleton width="5rem" class="mb-2" borderRadius="16px" />
                    <p-skeleton height="2rem" class="mb-2" borderRadius="16px" />
                    <p-skeleton width="10rem" height="4rem" borderRadius="16px" />
                </div>
                <div class="w-full xl:w-6/12 p-4">
                    <div class="font-semibold mt-4 mb-4">Square</div>
                    <div class="flex items-end">
                        <p-skeleton size="2rem" class="mr-2" />
                        <p-skeleton size="3rem" class="mr-2" />
                        <p-skeleton size="4rem" class="mr-2" />
                        <p-skeleton size="5rem" />
                    </div>
                </div>
                <div class="field w-full xl:w-6/12 p-4">
                    <div class="font-semibold mt-4 mb-4">Circle</div>
                    <div class="flex items-end">
                        <p-skeleton shape="circle" size="2rem" class="mr-2" />
                        <p-skeleton shape="circle" size="3rem" class="mr-2" />
                        <p-skeleton shape="circle" size="4rem" class="mr-2" />
                        <p-skeleton shape="circle" size="5rem" />
                    </div>
                </div>
            </div>
        </div>
        <app-code></app-code>
    `
})
export class ShapesDoc {}
