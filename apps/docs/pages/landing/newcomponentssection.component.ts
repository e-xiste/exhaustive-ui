import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AnimateOnScroll } from '@exhaustive-ui/core/animateonscroll';
import { Button } from '@exhaustive-ui/core/button';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { KanbanColumn, KanbanModule } from '@exhaustive-ui/core/kanban';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';
import { RichTextEditorModule, RichTextEditorToolbar } from '@exhaustive-ui/core/richtexteditor';
import { SchedulerEvent, SchedulerEventChangeEvent, SchedulerModule } from '@exhaustive-ui/core/scheduler';
import { TourModule, TourStep } from '@exhaustive-ui/core/tour';
import { SelectButton } from '@exhaustive-ui/core/selectbutton';
import { Tag } from '@exhaustive-ui/core/tag';

interface NewComponent {
    id: string;
    name: string;
    route: string;
    since: string;
    summary: string;
    highlights: string[];
    /** Spans the whole row, for demos that need the width. */
    wide?: boolean;
}

/**
 * The components ExhaustiveUI added on top of the PrimeNG v21 set, newest first. The landing page shows the six most recent ones; each needs
 * a live demo in the `@switch` of the template.
 */
const NEW_COMPONENTS: NewComponent[] = [
    {
        id: 'scheduler',
        name: 'Scheduler',
        route: '/scheduler',
        since: '22.8',
        wide: true,
        summary: 'A free, MIT event calendar: month, week, day and agenda views with drag and drop, and no calendar library underneath.',
        highlights: ['Month, week, day and agenda views', 'Drag to move and resize, or use the keyboard', 'Lazy loading per visible range', 'Readable text on any event color']
    },
    {
        id: 'richtexteditor',
        name: 'RichTextEditor',
        route: '/richtexteditor',
        since: '22.8',
        summary: 'A modern, accessible rich text editor built on Tiptap and ProseMirror, free and MIT.',
        highlights: ['HTML or JSON value', 'Accessible toolbar', 'Inline link editing', 'Character limit and custom extensions']
    },
    {
        id: 'mention',
        name: 'Mention',
        route: '/mention',
        since: '22.8',
        summary: '@users, #tags and /commands suggested while typing, in a textarea or a single-line input.',
        highlights: ['Several triggers: @, #, /', 'Panel under the caret', 'Async search with loader', 'Item templates with avatars']
    },
    {
        id: 'kanban',
        name: 'Kanban',
        route: '/kanban',
        since: '22.8',
        wide: true,
        summary: 'A free, accessible task board: drag cards between columns with the mouse, touch or keyboard, with WIP limits and drop rules.',
        highlights: ['WIP limits and canDrop rules', 'Keyboard and screen reader dragging', 'Collapsible and reorderable columns', 'Card, header, footer and empty templates']
    },
    {
        id: 'inputchips',
        name: 'InputChips',
        route: '/inputchips',
        since: '22.8',
        summary: 'Type tags, keywords or emails as chips, without suggestions, with separators, limits and validation built in.',
        highlights: ['Enter, separators and multi-line paste', 'Max count, length and duplicates', 'Keyboard-navigable chips', 'Template, reactive and Signal Forms']
    },
    {
        id: 'tour',
        name: 'Tour',
        route: '/tour',
        since: '22.8',
        summary: 'Guided onboarding tours: a spotlight on each step and an accessible card that explains it.',
        highlights: ['Spotlight that follows its target', 'Auto-flip placement, RTL aware', 'Custom step templates', 'Focus trap and live announcements']
    },
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
    imports: [FormsModule, RouterModule, AnimateOnScroll, Button, FileInputModule, InputChipsModule, InputText, KanbanModule, MentionModule, RichTextEditorModule, SchedulerModule, SelectButton, Tag, TourModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <section class="landing-new-components py-20">
            <h2 class="section-header">New Components</h2>
            <p class="section-detail">Built for ExhaustiveUI on top of the PrimeNG v21 set, with the same theming, accessibility and Signals API. Free and MIT, like everything else.</p>
            <div class="new-components-container mt-16 px-8 lg:px-20">
                @for (component of components; track component.id) {
                    <article class="box new-component p-6 lg:p-8 animate-duration-500" [class.new-component-single]="components.length === 1" [class.new-component-wide]="component.wide" pAnimateOnScroll enterClass="animate-fadein">
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
                                @case ('scheduler') {
                                    <p-scheduler [events]="events()" [editable]="true" view="week" [scrollToHour]="8" scrollHeight="26rem" (onEventChange)="moveEvent($event)" ariaLabel="Team calendar" />
                                }
                                @case ('kanban') {
                                    <p-kanban [(columns)]="columns" dataKey="id" ariaLabel="Release board" />
                                }
                                @case ('richtexteditor') {
                                    <p-rich-text-editor [(ngModel)]="html" ariaLabel="Release notes" [toolbar]="editorToolbar" minHeight="9rem" />
                                }
                                @case ('mention') {
                                    <p-mention
                                        [(ngModel)]="comment"
                                        [suggestions]="mentionSuggestions"
                                        (onSearch)="searchUsers($event)"
                                        [triggers]="['@', '#']"
                                        [rows]="4"
                                        placeholder="Type @ to mention someone, # for a tag"
                                        ariaLabel="Comment"
                                        fluid
                                    />
                                }
                                @case ('inputchips') {
                                    <p-input-chips [(ngModel)]="tags" separator="," [max]="8" placeholder="Add a tag" ariaLabel="Tags" fluid />
                                    <p class="mb-0 mt-4 text-sm text-surface-600 dark:text-surface-300">Press Enter or type a comma. Paste a list to add several tags at once.</p>
                                }
                                @case ('tour') {
                                    <div class="flex flex-wrap items-center gap-2 p-3 border border-surface rounded-border mb-4">
                                        <p-button id="landing-tour-new" label="New" icon="pi pi-plus" size="small" />
                                        <input id="landing-tour-search" pInputText placeholder="Search" aria-label="Search" class="flex-1 min-w-32" />
                                        <p-button id="landing-tour-settings" icon="pi pi-cog" severity="secondary" size="small" ariaLabel="Settings" />
                                    </div>
                                    <p-button label="Start the tour" icon="pi pi-play" (onClick)="tourVisible.set(true)" />
                                    <p-tour [steps]="tourSteps" [(visible)]="tourVisible" />
                                }
                                @case ('fileinput') {
                                    <p-select-button [options]="fileInputVariants" [(ngModel)]="fileInputVariant" optionLabel="label" optionValue="value" [allowEmpty]="false" class="mb-6" />
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

    readonly events = signal<SchedulerEvent[]>(createEvents());

    html: string | null = '<p>ExhaustiveUI <strong>22.8</strong> brings six new components, all <em>free</em> and MIT.</p><ul><li><p>Scheduler and RichTextEditor</p></li><li><p>Kanban, Mention, InputChips and Tour</p></li></ul>';

    readonly editorToolbar: RichTextEditorToolbar = ['bold', 'italic', 'underline', '|', 'bulletList', 'orderedList', '|', 'link', '|', 'undo', 'redo'];

    comment = '';

    mentionSuggestions: string[] = [];

    tags: string[] = ['angular', 'signals', 'mit'];

    columns: KanbanColumn<{ id: number; title: string }>[] = [
        {
            id: 'todo',
            title: 'To do',
            items: [
                { id: 1, title: 'Write the release notes' },
                { id: 2, title: 'Update the screenshots' }
            ]
        },
        {
            id: 'doing',
            title: 'In progress',
            limit: 2,
            items: [
                { id: 3, title: 'Fix the login redirect' },
                { id: 4, title: 'Translate the onboarding' }
            ]
        },
        { id: 'review', title: 'Review', items: [{ id: 5, title: 'Dark mode for the settings page' }] },
        { id: 'done', title: 'Done', items: [{ id: 6, title: 'Set up the staging server' }] }
    ];

    readonly tourVisible = signal(false);

    readonly tourSteps: TourStep[] = [
        { target: '#landing-tour-new', title: 'Create a document', content: 'Start a new document from a blank page or a template.' },
        { target: '#landing-tour-search', title: 'Search', content: 'Find any document by its name or its content.' },
        { target: '#landing-tour-settings', title: 'Settings', content: 'Change the language, the theme and your notifications.' }
    ];

    moveEvent(event: SchedulerEventChangeEvent) {
        this.events.update((events) => events.map((e) => (e.id === event.event.id ? { ...e, start: event.start, end: event.end } : e)));
    }

    searchUsers(event: MentionSearchEvent) {
        const values = event.trigger === '#' ? TAGS : USERS;
        this.mentionSuggestions = values.filter((value) => value.startsWith(event.query.toLowerCase()));
    }
}

const USERS = ['amyelsner', 'annafali', 'asiyajavayant', 'bernardodominic', 'elwinsharvill', 'ionibowcher', 'ivanmagalhaes', 'onyamalimba', 'stephenshaw', 'xuxuefeng'];

const TAGS = ['accessibility', 'angular', 'bug', 'design', 'docs', 'feature', 'release', 'signals'];

function createEvents(): SchedulerEvent[] {
    const today = new Date();
    const day = (offset: number, hour = 0, minute = 0) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset, hour, minute);
    return [
        { id: 1, title: 'Team standup', start: day(0, 9), end: day(0, 9, 30) },
        { id: 2, title: 'Design review', start: day(0, 11), end: day(0, 12), color: '#6366f1' },
        { id: 3, title: 'Lunch with Ana', start: day(1, 12, 30), end: day(1, 13, 30), color: '#fbbf24' },
        { id: 4, title: 'Release 22.8', start: day(1, 15), end: day(1, 16, 30), color: '#0f766e' },
        { id: 5, title: 'Workshop', start: day(-1, 10), end: day(-1, 12), color: '#e11d48' },
        { id: 6, title: 'Sprint planning', start: day(2, 9, 30), end: day(2, 11) },
        { id: 7, title: 'Conference', start: day(3), end: day(5), allDay: true, color: '#f472b6' }
    ];
}
