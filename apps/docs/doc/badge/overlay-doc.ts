import { Component } from '@angular/core';
import { OverlayBadgeModule } from '@exhaustive-ui/core/overlaybadge';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'overlay-doc',
    standalone: true,
    imports: [OverlayBadgeModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>A badge can be added to any element by encapsulating the content with the <i>OverlayBadge</i> component.</p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center gap-6">
            <p-overlay-badge value="2">
                <i class="pi pi-bell" style="font-size: 2rem"></i>
            </p-overlay-badge>
            <p-overlay-badge value="4" severity="danger">
                <i class="pi pi-calendar" style="font-size: 2rem"></i>
            </p-overlay-badge>
            <p-overlay-badge severity="danger">
                <i class="pi pi-envelope" style="font-size: 2rem"></i>
            </p-overlay-badge>
        </div>
        <app-code></app-code>
    `
})
export class OverlayDoc {}
