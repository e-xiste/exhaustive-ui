import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'sizes-doc',
    standalone: true,
    imports: [FormsModule, MentionModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Mention provides <i>small</i> and <i>large</i> sizes as alternatives to the default, like the other form fields.</p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-4">
            <p-mention [(ngModel)]="small" size="small" [multiline]="false" [suggestions]="suggestions" (onSearch)="search($event)" placeholder="Small" ariaLabel="Small" />
            <p-mention [(ngModel)]="normal" [multiline]="false" [suggestions]="suggestions" (onSearch)="search($event)" placeholder="Normal" ariaLabel="Normal" />
            <p-mention [(ngModel)]="large" size="large" [multiline]="false" [suggestions]="suggestions" (onSearch)="search($event)" placeholder="Large" ariaLabel="Large" />
        </div>
        <app-code></app-code>
    `
})
export class SizesDoc {
    small = '';

    normal = '';

    large = '';

    users = ['amyelsner', 'annafali', 'bernardodominic', 'ionibowcher'];

    suggestions: string[] = [];

    search(event: MentionSearchEvent) {
        this.suggestions = this.users.filter((user) => user.startsWith(event.query.toLowerCase()));
    }
}
