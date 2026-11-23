import { AnalyticsService } from '@/service/analyticsservice';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { Button } from '@exhaustive-ui/core/button';

/** Asks once for consent to Google Analytics; accepting and refusing are equally easy. */
@Component({
    selector: 'app-consent',
    standalone: true,
    imports: [Button],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (visible()) {
            <section class="layout-consent" role="region" aria-labelledby="consent-title">
                <div class="layout-consent-text">
                    <h2 id="consent-title" class="layout-consent-title">Cookies</h2>
                    <p>With your consent, we use Google Analytics to count visits and see which pages help. Nothing is loaded or stored before you choose, and you can change your mind with <i>Cookie settings</i> at the bottom of every page.</p>
                </div>
                <div class="layout-consent-actions">
                    <p-button label="Refuse" severity="secondary" (onClick)="analytics.refuse()" />
                    <p-button label="Accept" (onClick)="analytics.accept()" />
                </div>
            </section>
        }
    `
})
export class AppConsentComponent {
    readonly analytics = inject(AnalyticsService);

    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    readonly visible = computed(() => this.isBrowser && this.analytics.consent() === null);
}
