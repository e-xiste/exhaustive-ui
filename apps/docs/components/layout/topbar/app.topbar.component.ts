import Versions from '@/assets/data/versions.json';
import { AppConfiguratorComponent } from '@/components/layout/configurator/app.configurator.component';
import { AppConfigService } from '@/service/appconfigservice';
import { GITHUB_DISCUSSIONS_URL, GITHUB_REPO_URL } from '@/utils/constants';
import { CommonModule, DOCUMENT, NgOptimizedImage } from '@angular/common';
import { afterNextRender, booleanAttribute, Component, computed, ElementRef, Inject, Input, OnDestroy, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DomHandler } from '@exhaustive-ui/core/dom';
import { StyleClass } from '@exhaustive-ui/core/styleclass';
import { SelectModule } from '@exhaustive-ui/core/select';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [CommonModule, FormsModule, StyleClass, RouterModule, AppConfiguratorComponent, SelectModule, NgOptimizedImage],
    template: `<div class="layout-topbar">
        <div class="layout-topbar-inner">
            <div class="layout-topbar-logo-container">
                <a [routerLink]="['/']" class="layout-topbar-logo" aria-label="ExhaustiveUI Logo">
                    <img ngSrc="logo.svg" height="40" width="200" class="dark:invert" alt="" />
                </a>
                <a [routerLink]="['/']" class="layout-topbar-icon" aria-label="ExhaustiveUI Logo">
                    <img ngSrc="logo-icon.svg" height="32" width="32" class="dark:invert" alt="" />
                </a>
            </div>

            <ul class="topbar-items">
                <li class="topbar-desktop-item">
                    <a [href]="githubRepoUrl" target="_blank" rel="noopener noreferrer" class="topbar-item" aria-label="GitHub repository">
                        <i class="pi pi-github text-surface-700 dark:text-surface-100"></i>
                    </a>
                </li>
                <li class="topbar-desktop-item">
                    <a [href]="githubDiscussionsUrl" target="_blank" rel="noopener noreferrer" class="topbar-item" aria-label="GitHub discussions">
                        <i class="pi pi-comments text-surface-700 dark:text-surface-100"></i>
                    </a>
                </li>
                <li class="topbar-desktop-item">
                    <button type="button" class="topbar-item" (click)="toggleDarkMode()" [attr.aria-label]="isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'">
                        <i class="pi" [ngClass]="{ 'pi-moon': isDarkMode(), 'pi-sun': !isDarkMode() }"></i>
                    </button>
                </li>
                <li *ngIf="showConfigurator" class="relative topbar-desktop-item">
                    <button
                        type="button"
                        class="topbar-item config-item"
                        aria-label="Theme configurator"
                        enterActiveClass="px-overlay-enter-active"
                        enterFromClass="hidden"
                        leaveActiveClass="px-overlay-leave-active"
                        leaveToClass="hidden"
                        pStyleClass="@next"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </li>
                <li class="topbar-desktop-item">
                    <p-select
                        [(ngModel)]="selectedVersion"
                        [options]="versions"
                        [group]="true"
                        ariaLabel="Documentation version"
                        (onChange)="onVersionChange($event)"
                        [pt]="{
                            optionGroup: {
                                class: 'version-group'
                            }
                        }"
                    >
                    </p-select>
                </li>
                <li *ngIf="showMenuButton" class="menu-button">
                    <button type="button" class="topbar-item menu-button" (click)="toggleMenu()" aria-label="Menu">
                        <i class="pi pi-bars"></i>
                    </button>
                </li>
            </ul>
        </div>
    </div>`
})
export class AppTopBarComponent implements OnDestroy {
    readonly githubRepoUrl = GITHUB_REPO_URL;
    readonly githubDiscussionsUrl = GITHUB_DISCUSSIONS_URL;
    @Input({ transform: booleanAttribute }) showConfigurator = true;

    @Input({ transform: booleanAttribute }) showMenuButton = true;

    versions: any[] = Versions;
    selectedVersion = this.versions[0].items[0].value;

    scrollListener: VoidFunction | null;

    private window: Window;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private el: ElementRef,
        private renderer: Renderer2,
        private configService: AppConfigService
    ) {
        this.window = this.document.defaultView as Window;

        afterNextRender(() => {
            this.bindScrollListener();
        });
    }

    isDarkMode = computed(() => this.configService.appState().darkTheme);

    isMenuActive = computed(() => this.configService.appState().menuActive);

    toggleMenu() {
        if (this.isMenuActive()) {
            this.configService.hideMenu();
            DomHandler.unblockBodyScroll('blocked-scroll');
        } else {
            this.configService.showMenu();
            DomHandler.blockBodyScroll('blocked-scroll');
        }
    }

    toggleDarkMode() {
        this.configService.appState.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    bindScrollListener() {
        if (!this.scrollListener) {
            this.scrollListener = this.renderer.listen(this.window, 'scroll', () => {
                if (this.window.scrollY > 0) {
                    this.el.nativeElement.children[0].classList.add('layout-topbar-sticky');
                } else {
                    this.el.nativeElement.children[0].classList.remove('layout-topbar-sticky');
                }
            });
        }
    }

    unbindScrollListener() {
        if (this.scrollListener) {
            this.scrollListener();
            this.scrollListener = null;
        }
    }

    ngOnDestroy() {
        this.unbindScrollListener();
    }

    onVersionChange(event: any) {
        if (event?.value && event.value.startsWith('http')) {
            window.location.href = event.value;
        }
    }
}
