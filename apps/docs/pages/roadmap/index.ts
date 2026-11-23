import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TagModule } from '@exhaustive-ui/core/tag';
import { TimelineModule } from '@exhaustive-ui/core/timeline';

@Component({
    standalone: true,
    imports: [CommonModule, TagModule, TimelineModule],
    template: `
        <div>
            <div class="doc-intro">
                <h1>Roadmap</h1>
                <p>
                    This community fork is meant to provide a MIT sustainable version of the now closed-source PrimeNG library. Priorities are fixing bugs and providing new versions to match major angular version compatibility. Feature requests will
                    be triaged but implemented only with the help of community contributions.
                </p>
            </div>

            <div class="card mt-8">
                <p-timeline [value]="events" align="alternate" class="customized-timeline">
                    <ng-template #content let-event>
                        <div class="p-4 mb-4 border rounded-xl shadow-xs bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-800">
                            <div class="flex items-center gap-2 mb-2">
                                <h3 class="text-xl font-semibold m-0">{{ event.title }}</h3>
                                <p-tag *ngIf="event.shipped" value="Shipped" severity="success" />
                            </div>
                            <p *ngIf="event.description" class="text-surface-600 dark:text-surface-400 m-0">{{ event.description }}</p>
                            <ul *ngIf="event.features" class="mt-2 mb-0 list-inside list-disc text-surface-600 dark:text-surface-400">
                                <li *ngFor="let feature of event.features" class="mb-1">{{ feature }}</li>
                            </ul>
                            <a *ngIf="event.link" [href]="event.link" target="_blank" rel="noopener" class="mt-3 inline-block text-primary hover:underline">View milestone</a>
                        </div>
                    </ng-template>
                </p-timeline>
            </div>
        </div>
    `
})
export class RoadmapDemo {
    events: any[];

    constructor(
        private titleService: Title,
        private metaService: Meta
    ) {
        this.titleService.setTitle('Roadmap - ExhaustiveUI');
        this.metaService.updateTag({ name: 'description', content: 'ExhaustiveUI Roadmap' });

        this.events = [
            {
                title: 'v22 alpha',
                shipped: true,
                features: [
                    'Forked from Optimus UI, rebranded as ExhaustiveUI',
                    'Angular v22, versions aligned on Angular majors',
                    'Whole library on the Signals API: signal inputs, model() and signal queries',
                    'OnPush change detection and built-in control flow',
                    'ng update migrations for removed and renamed inputs',
                    'npm packages published with provenance'
                ],
                link: 'https://github.com/e-xiste/exhaustive-ui/releases'
            },
            {
                title: 'v22 release candidate',
                shipped: true,
                features: [
                    'Fixes for the inherited high- and medium-severity bugs, each with a regression test',
                    'Fixes for 108 inherited low-severity bugs',
                    'Tailwind CSS v4 plugin, docs site and PrimeFlex migration',
                    'PassThrough attributes rendered on the server and styles inside Shadow DOM hosts',
                    'Every remaining inherited bug report reproduced in a real browser test: about 85 fixed',
                    'Public API cleaned up before the freeze, with ng update migrations',
                    'Small and large form fields inside FloatLabel and IftaLabel, Signal Forms examples'
                ],
                link: 'https://github.com/e-xiste/exhaustive-ui/releases'
            },
            {
                title: 'v22 stable',
                shipped: true,
                features: [
                    'ExhaustiveUI 22.0.0, the first stable release of the fork',
                    'Public API frozen for the v22 line: minor releases add features without breaking changes',
                    'Migration guide to v22, from an ExhaustiveUI prerelease, PrimeNG v21 or Optimus UI',
                    'Nine ng update migrations, each reporting what it leaves for review',
                    'Migration guides and schematics from PrimeNG v21 and from Optimus UI v2 (22.0.1)',
                    'Simpler SelectButton and ToggleButton design (22.1.0)'
                ],
                link: 'https://github.com/e-xiste/exhaustive-ui/releases/tag/v22.0.0'
            },
            {
                title: 'v22 minor releases',
                features: [
                    'FileInput, a new component to select, validate and upload files, with list, images and avatar variants',
                    'Tour, a new component for guided onboarding tours, with a spotlight on each step and an accessible card',
                    'InputChips, a new component to type free-text values as chips, with separators, limits and validation',
                    'Mention, a new component that suggests users, tags or commands after @, # or / in a textarea or an input',
                    'Scheduler, a free event calendar with month, week, day and agenda views, drag and drop and keyboard editing',
                    'RichTextEditor, a new rich text editor built on Tiptap, with an accessible themed toolbar, HTML or JSON values and a character limit',
                    'Kanban, a free task board with work in progress limits, drop rules and keyboard and screen reader dragging',
                    'Signal Forms: no invalid style before the user interacts with a field',
                    'The inherited bugs that need a redesign: virtual lists taller than the browser limit, TreeTable rows with frozen columns, overlay width with virtual scroll',
                    'Feedback and bug reports on 22.0.0',
                    'Documentation code modernization'
                ]
            },
            {
                title: 'v23',
                features: ['A matching major for Angular 23, with ng update migrations', 'Feature requests triaged with the community']
            }
        ];
    }
}
