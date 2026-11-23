import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AnimateOnScroll } from '@exhaustive-ui/core/animateonscroll';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';
import { SelectButton } from '@exhaustive-ui/core/selectbutton';
import { Tag } from '@exhaustive-ui/core/tag';

interface NewComponent {
    id: string;
    name: string;
    route: string;
    since: string;
    summary: string;
    highlights: string[];
}

/**
 * The components ExhaustiveUI added on top of the PrimeNG v21 set, newest first. The landing page shows the six most recent ones; each needs
 * a live demo in the `@switch` of the template.
 */
const NEW_COMPONENTS: NewComponent[] = [
    {
        id: 'fileinput',
        name: 'FileInput',
        route: '/fileinput',
        since: '22.2',
        summary: 'Select, validate and upload files, from the file picker, by drag and drop, folders included, or by pasting a screenshot. Each file gets its own request, progress, cancel and retry.',
        highlights: ['List, images and avatar variants', 'Size, type and count validation', 'Template, reactive and Signal Forms', 'Files already on the server']
    }
];

@Component({
    selector: 'new-components-section',
    standalone: true,
    imports: [FormsModule, RouterModule, AnimateOnScroll, FileInputModule, SelectButton, Tag],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <section class="landing-new-components py-20">
            <h2 class="section-header">New Components</h2>
            <p class="section-detail">Built for ExhaustiveUI on top of the PrimeNG v21 set, with the same theming, accessibility and Signals API.</p>
            <div class="new-components-container mt-16 px-8 lg:px-20">
                @for (component of components; track component.id) {
                    <article class="box new-component p-6 lg:p-8 animate-duration-500" [class.new-component-single]="components.length === 1" pAnimateOnScroll enterClass="animate-fadein">
                        <div class="new-component-text">
                            <div class="flex items-center gap-3 mb-4">
                                <h3 class="m-0 text-2xl font-semibold">{{ component.name }}</h3>
                                <p-tag [value]="'New in ' + component.since" severity="success" [rounded]="true" />
                            </div>
                            <p class="mt-0 mb-6 text-surface-600 dark:text-surface-300 font-medium leading-normal">{{ component.summary }}</p>
                            <ul class="list-none p-0 mt-0 mb-8 flex flex-col gap-3">
                                @for (highlight of component.highlights; track highlight) {
                                    <li class="flex items-center gap-2 font-medium"><i class="pi pi-check-circle text-primary" aria-hidden="true"></i>{{ highlight }}</li>
                                }
                            </ul>
                            <a [routerLink]="component.route" class="new-component-link font-semibold">Read the {{ component.name }} docs <i class="pi pi-arrow-right" aria-hidden="true"></i></a>
                        </div>
                        <div class="new-component-demo">
                            @switch (component.id) {
                                @case ('fileinput') {
                                    <p-select-button [options]="fileInputVariants" [(ngModel)]="fileInputVariant" optionLabel="label" optionValue="value" [allowEmpty]="false" ariaLabel="FileInput variant" class="mb-6" />
                                    @switch (fileInputVariant()) {
                                        @case ('images') {
                                            <p-file-input variant="images" accept="image/*" [maxFiles]="6" hint="Up to 6 images" />
                                        }
                                        @case ('avatar') {
                                            <div class="flex justify-center">
                                                <p-file-input variant="avatar" accept="image/*" />
                                            </div>
                                        }
                                        @default {
                                            <p-file-input [maxFileSize]="5000000" hint="Any file, 5 MB max" />
                                        }
                                    }
                                    <p class="mb-0 mt-4 text-sm text-surface-600 dark:text-surface-300">Nothing leaves your browser: this demo has no upload URL.</p>
                                }
                            }
                        </div>
                    </article>
                }
            </div>
        </section>
    `
})
export class NewComponentsSectionComponent {
    readonly components = NEW_COMPONENTS.slice(0, 6);

    readonly fileInputVariants = [
        { label: 'List', value: 'list' },
        { label: 'Images', value: 'images' },
        { label: 'Avatar', value: 'avatar' }
    ];

    readonly fileInputVariant = signal<'list' | 'images' | 'avatar'>('list');
}
