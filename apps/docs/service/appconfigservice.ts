import { AppState } from '@/domain/appstate';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    appState = signal<AppState>({
        preset: 'Aura',
        primary: 'noir',
        surface: null,
        darkTheme: false,
        menuActive: false,
        RTL: false
    });

    newsActive = signal(false);

    document = inject(DOCUMENT);

    platformId = inject(PLATFORM_ID);

    transitionComplete = signal<boolean>(false);

    darkMode = computed(() => this.appState().darkTheme);

    primaryPalette = computed(() => this.appState().primary);

    surfacePalette = computed(() => this.appState().surface);

    /** True when the theme preferences of a previous visit were restored from localStorage. */
    restoredState = false;

    private readonly STORAGE_KEY = 'exhaustive-ui-docs-app-state';

    constructor() {
        this.loadAppState();

        effect(() => {
            const { preset, primary, surface, darkTheme } = this.appState();

            this.saveAppState({ preset, primary, surface, darkTheme });
        });

        effect(() => {
            const isDarkMode = this.darkMode();
            const currentPrimaryPalette = this.primaryPalette();
            const currentSurfacePalette = this.surfacePalette();

            this.toggleDarkMode(isDarkMode);
            this.onTransitionEnd();
        });
    }

    private loadAppState() {
        if (!isPlatformBrowser(this.platformId)) return;

        try {
            const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEY) ?? 'null');

            if (stored) {
                const { preset, primary, surface, darkTheme } = stored;

                this.appState.update((state) => ({ ...state, preset, primary, surface, darkTheme }));
                this.restoredState = true;
            }
        } catch {
            // storage unavailable or corrupted: keep the defaults
        }
    }

    private saveAppState(state: AppState) {
        if (!isPlatformBrowser(this.platformId)) return;

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
        } catch {
            // storage unavailable: preferences are not kept
        }
    }

    private toggleDarkMode(darkMode: boolean): void {
        if (darkMode) {
            this.document.documentElement.classList.add('p-dark');
        } else {
            this.document.documentElement.classList.remove('p-dark');
        }
    }

    private onTransitionEnd() {
        this.transitionComplete.set(true);
        setTimeout(() => {
            this.transitionComplete.set(false);
        });
    }

    hideMenu() {
        this.appState.update((state) => ({
            ...state,
            menuActive: false
        }));
    }

    showMenu() {
        this.appState.update((state) => ({
            ...state,
            menuActive: true
        }));
    }

    hideNews() {
        this.newsActive.set(false);
    }

    showNews() {
        this.newsActive.set(true);
    }
}
