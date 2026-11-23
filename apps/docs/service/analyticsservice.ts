import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

/** Google Analytics 4 measurement ID of exhaustive-ui.com. */
export const GA_MEASUREMENT_ID = 'G-CDNEG6EXJ0';

export type AnalyticsConsent = 'granted' | 'denied';

const STORAGE_KEY = 'exhaustive-ui-docs-analytics-consent';

/**
 * Google Analytics behind an explicit opt-in.
 *
 * Nothing from Google is loaded before the visitor accepts: no script, no cookie, no request. Refusing is as easy as accepting, the choice is
 * remembered in localStorage, and `reset()` (the "Cookie settings" footer link) asks again. Page views of the single page application are sent
 * by GA4 enhanced measurement, which follows browser history changes.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
    private readonly document = inject(DOCUMENT);

    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    /** The stored choice, or null while the visitor has not answered (and always on the server). */
    readonly consent = signal<AnalyticsConsent | null>(null);

    private loaded = false;

    init() {
        if (!this.isBrowser) return;
        const stored = this.read();
        this.consent.set(stored);
        if (stored === 'granted') this.load();
    }

    accept() {
        this.save('granted');
        this.load();
    }

    refuse() {
        this.save('denied');
        if (this.loaded) {
            this.gtag('consent', 'update', { analytics_storage: 'denied' });
            this.clearCookies();
        }
    }

    /** Forgets the choice so the banner asks again. */
    reset() {
        if (!this.isBrowser) return;
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // storage unavailable: nothing was stored
        }
        this.consent.set(null);
    }

    private load() {
        if (this.loaded || !this.isBrowser) return;
        this.loaded = true;
        const win = this.document.defaultView as any;
        win.dataLayer = win.dataLayer || [];
        win.gtag = function () {
            // gtag.js reads the arguments object, not an array
            // eslint-disable-next-line prefer-rest-params
            win.dataLayer.push(arguments);
        };
        this.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
        this.gtag('js', new Date());
        this.gtag('config', GA_MEASUREMENT_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
        const script = this.document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        this.document.head.appendChild(script);
    }

    private gtag(...args: unknown[]) {
        (this.document.defaultView as any)?.gtag?.(...args);
    }

    /** Removes the _ga cookies once consent is withdrawn. */
    private clearCookies() {
        const host = this.document.location.hostname;
        for (const cookie of this.document.cookie.split(';')) {
            const name = cookie.split('=')[0].trim();
            if (!name.startsWith('_ga')) continue;
            for (const domain of ['', `; domain=${host}`, `; domain=.${host.replace(/^www\./, '')}`]) {
                this.document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
            }
        }
    }

    private read(): AnalyticsConsent | null {
        try {
            const value = localStorage.getItem(STORAGE_KEY);
            return value === 'granted' || value === 'denied' ? value : null;
        } catch {
            return null;
        }
    }

    private save(value: AnalyticsConsent) {
        this.consent.set(value);
        try {
            localStorage.setItem(STORAGE_KEY, value);
        } catch {
            // storage unavailable: the choice lasts for this visit only
        }
    }
}
