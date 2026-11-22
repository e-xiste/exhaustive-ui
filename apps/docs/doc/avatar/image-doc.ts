import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { AvatarModule } from '@exhaustive-ui/core/avatar';
import { OverlayBadgeModule } from '@exhaustive-ui/core/overlaybadge';

@Component({
    selector: 'image-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, AvatarModule, OverlayBadgeModule],
    template: `
        <app-docsectiontext>
            <p>Use the <i>image</i> property to display an image as an Avatar.</p>
        </app-docsectiontext>
        <div class="card">
            <div class="flex flex-wrap gap-8">
                <div class="flex-auto">
                    <div class="font-semibold mb-4">Image</div>
                    <p-avatar image="https://exhaustive-ui.com/demo/avatar/amyelsner.png" ariaLabel="Amy Elsner" class="mr-2" size="xlarge" shape="circle" />
                    <p-avatar image="https://exhaustive-ui.com/demo/avatar/asiyajavayant.png" ariaLabel="Asiya Javayant" class="mr-2" size="large" shape="circle" />
                    <p-avatar image="https://exhaustive-ui.com/demo/avatar/onyamalimba.png" ariaLabel="Onyama Limba" shape="circle" />
                </div>

                <div class="flex-auto">
                    <div class="font-semibold mb-4">Badge</div>
                    <p-overlay-badge value="4" severity="danger" class="inline-flex">
                        <p-avatar class="p-overlay-badge" image="https://exhaustive-ui.com/demo/avatar/walter.jpg" ariaLabel="Walter" size="xlarge" />
                    </p-overlay-badge>
                </div>

                <div class="flex-auto">
                    <div class="font-semibold mb-4">Gravatar</div>
                    <p-avatar image="https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp" ariaLabel="User avatar" class="flex items-center justify-center mr-2" size="xlarge" />
                </div>
            </div>
        </div>
        <app-code></app-code>
    `
})
export class ImageDoc {}
