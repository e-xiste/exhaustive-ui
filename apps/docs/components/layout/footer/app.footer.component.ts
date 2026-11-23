import { GITHUB_DISCUSSIONS_URL, GITHUB_REPO_URL } from '@/utils/constants';
import { Component, inject } from '@angular/core';
import { AnalyticsService } from '@/service/analyticsservice';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterModule],
    template: `
        <div class="layout-footer">
            <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <span>ExhaustiveUI {{ version }} by <a [href]="exhaustiveUrl" target="_blank" rel="noopener noreferrer">e-xiste</a></span>
                <a [routerLink]="'/philosophy'">Philosophy</a>
                <a [routerLink]="'/faq'">FAQ</a>
                <a [routerLink]="'/contribution'">Contribute</a>
                <a [href]="githubRepoUrl" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a [href]="githubDiscussionsUrl" target="_blank" rel="noopener noreferrer">Discussions</a>
                <a [href]="licenseUrl" target="_blank" rel="noopener noreferrer">MIT License</a>
                <button type="button" class="layout-consent-link" (click)="analytics.reset()">Cookie settings</button>
            </div>
        </div>
    `
})
export class AppFooterComponent {
    readonly analytics = inject(AnalyticsService);

    readonly exhaustiveUrl = 'https://e-xiste.com';

    readonly githubRepoUrl = GITHUB_REPO_URL;

    readonly githubDiscussionsUrl = GITHUB_DISCUSSIONS_URL;

    readonly licenseUrl = `${GITHUB_REPO_URL}/blob/main/LICENSE.md`;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    readonly version = require('@/package.json').version;
}
