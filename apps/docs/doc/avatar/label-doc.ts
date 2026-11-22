import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { AvatarModule } from '@exhaustive-ui/core/avatar';
import { OverlayBadgeModule } from '@exhaustive-ui/core/overlaybadge';

@Component({
    selector: 'label-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode, AvatarModule, OverlayBadgeModule],
    template: `
        <app-docsectiontext>
            <p>A letter Avatar is defined with the <i>label</i> property.</p>
        </app-docsectiontext>
        <div class="card">
            <div class="flex flex-wrap gap-8">
                <div class="flex-auto">
                    <div class="font-semibold mb-4">Label</div>
                    <p-avatar label="P" class="mr-2" size="xlarge" />
                    <p-avatar label="V" class="mr-2" size="large" [style]="{ 'background-color': '#ece9fc', color: '#2a1261' }" />
                    <p-avatar label="U" class="mr-2" [style]="{ 'background-color': '#dee9fc', color: '#1a2551' }" />
                </div>
                <div class="flex-auto">
                    <div class="font-semibold mb-4">Circle</div>
                    <p-avatar label="P" class="mr-2" size="xlarge" shape="circle" />
                    <p-avatar label="V" class="mr-2" size="large" [style]="{ 'background-color': '#ece9fc', color: '#2a1261' }" shape="circle" />
                    <p-avatar label="U" class="mr-2" [style]="{ 'background-color': '#dee9fc', color: '#1a2551' }" shape="circle" />
                </div>
                <div class="flex-auto">
                    <div class="font-semibold mb-4">Badge</div>
                    <p-overlay-badge value="4" severity="danger" class="inline-flex">
                        <p-avatar label="U" size="xlarge" />
                    </p-overlay-badge>
                </div>
            </div>
        </div>
        <app-code></app-code>
    `
})
export class LabelDoc {}
