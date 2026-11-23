import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface Repository {
    name: string;
    stars: number;
}

@Component({
    selector: 'async-doc',
    standalone: true,
    imports: [FormsModule, MentionModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                The search handler can answer later, after a request. <i>delay</i> waits for a pause in typing before <i>onSearch</i> and <i>minQueryLength</i> for a few characters, and <i>loading</i> shows a loader until the suggestions arrive. Here
                a fake server answers after 600 milliseconds; the handler keeps only the latest answer.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-mention
                [(ngModel)]="text"
                [rows]="3"
                [triggers]="['/']"
                [suggestions]="suggestions()"
                [loading]="loading()"
                [delay]="250"
                [minQueryLength]="1"
                optionLabel="name"
                (onSearch)="search($event)"
                placeholder="Type / and the name of a repository"
                ariaLabel="Repository"
                fluid
            >
                <ng-template #item let-repository>
                    <i class="pi pi-book" aria-hidden="true"></i>
                    <span class="flex-1">{{ repository.name }}</span>
                    <span class="text-sm text-muted-color">{{ repository.stars }} stars</span>
                </ng-template>
            </p-mention>
        </div>
        <app-code></app-code>
    `
})
export class AsyncDoc {
    text = '';

    suggestions = signal<Repository[]>([]);

    loading = signal(false);

    private repositories: Repository[] = [
        { name: 'exhaustive-ui', stars: 1280 },
        { name: 'exhaustive-ui-docs', stars: 312 },
        { name: 'exhaustive-ui-themes', stars: 245 },
        { name: 'angular', stars: 96000 },
        { name: 'angular-cli', stars: 26800 },
        { name: 'components', stars: 24500 },
        { name: 'tailwindcss', stars: 84000 },
        { name: 'vitest', stars: 13200 }
    ];

    private request = 0;

    search(event: MentionSearchEvent) {
        const request = ++this.request;
        this.suggestions.set([]);
        this.loading.set(true);
        setTimeout(() => {
            // An older answer arriving after a newer request is ignored.
            if (request === this.request) {
                this.suggestions.set(this.repositories.filter((repository) => repository.name.includes(event.query.toLowerCase())));
                this.loading.set(false);
            }
        }, 600);
    }
}
