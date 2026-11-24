import { EXISTE_URL, GITHUB_DISCUSSIONS_URL, GITHUB_REPO_URL } from '@/utils/constants';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AnalyticsService } from '@/service/analyticsservice';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'footer-section',
    standalone: true,
    imports: [CommonModule, RouterModule, NgOptimizedImage],
    template: `
        <footer class="landing-footer pt-20 px-8 lg:px-20">
            <div class="landing-footer-container">
                <div class="flex flex-wrap z-10">
                    <div class="w-6/12 lg:w-3/12 flex">
                        <ul class="list-none p-0 m-0">
                            <li class="font-bold mb-8">General</li>
                            <li class="mb-6">
                                <a [routerLink]="['installation']" class="text-surface-500 dark:text-surface-400 font-medium hover:text-primary rounded-sm transition-all duration-300"> Get Started </a>
                            </li>
                        </ul>
                    </div>
                    <div class="w-6/12 lg:w-3/12 flex">
                        <ul class="list-none p-0 m-0">
                            <li class="font-bold mb-8">Support</li>
                            <li class="mb-6">
                                <a [href]="githubDiscussionsUrl" target="_blank" rel="noopener noreferrer" class="text-surface-500 dark:text-surface-400 font-medium hover:text-primary rounded-sm transition-all duration-300">GitHub Discussions</a>
                            </li>
                        </ul>
                    </div>
                    <div class="w-6/12 lg:w-3/12 flex">
                        <ul class="list-none p-0 m-0">
                            <li class="font-bold mt-8 lg:mt-0 mb-8">Theming</li>
                            <li class="mb-6">
                                <a [routerLink]="'/theming'" class="text-surface-500 dark:text-surface-400 font-medium hover:text-primary rounded-sm transition-all duration-300">Styled Mode</a>
                            </li>
                        </ul>
                    </div>
                    <div class="w-6/12 lg:w-3/12 flex">
                        <ul class="list-none p-0 m-0">
                            <li class="font-bold mt-8 lg:mt-0 mb-8">Resources</li>
                            <li class="mb-6">
                                <a [href]="githubRepoUrl" target="_blank" rel="noopener noreferrer" class="text-surface-500 dark:text-surface-400 font-medium hover:text-primary rounded-sm transition-all duration-300">Source Code</a>
                            </li>
                            <li class="mb-6">
                                <a [href]="existeUrl" target="_blank" rel="noopener noreferrer" class="text-surface-500 dark:text-surface-400 font-medium hover:text-primary rounded-sm transition-all duration-300">e-xiste</a>
                            </li>
                            <li class="mb-6">
                                <button type="button" class="layout-consent-link text-surface-500 dark:text-surface-400 font-medium hover:text-primary rounded-sm transition-all duration-300" (click)="analytics.reset()">Cookie settings</button>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr class="section-divider" />

                <div class="landing-announcement">
                    <span class="landing-announcement-text">ExhaustiveUI is a community MIT licensed fork of PrimeNG, now closed source and using a commercial license.</span>
                    <a href="https://primeui.dev/nextchapter" target="_blank" rel="noopener noreferrer" class="landing-announcement-link">Read their announcement</a>
                    <span class="landing-announcement-version">ExhaustiveUI v22 supports Angular v22</span>
                </div>

                <div class="flex flex-wrap justify-between py-12 gap-8">
                    <img ngSrc="logo.svg" height="40" width="200" alt="" class="dark:invert" />
                    <div class="flex items-center gap-2">
                        <a [href]="githubRepoUrl" target="_blank" rel="noopener noreferrer" aria-label="ExhaustiveUI on GitHub" class="linkbox linkbox-icon">
                            <i class="pi pi-github"></i>
                        </a>
                        <a [href]="githubDiscussionsUrl" aria-label="GitHub Discussions" class="linkbox linkbox-icon">
                            <i class="pi pi-comments"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    `
})
export class FooterSectionComponent {
    readonly analytics = inject(AnalyticsService);

    readonly githubRepoUrl = GITHUB_REPO_URL;
    readonly githubDiscussionsUrl = GITHUB_DISCUSSIONS_URL;
    readonly existeUrl = EXISTE_URL;
}
