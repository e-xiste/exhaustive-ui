import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'invalid-doc',
    standalone: true,
    imports: [FormsModule, MentionModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>The invalid state is applied using the <i>invalid</i> property to indicate failed validation, here until someone is mentioned.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-mention [(ngModel)]="text" [invalid]="!text.includes('@')" [suggestions]="suggestions" (onSearch)="search($event)" [rows]="3" [cols]="40" placeholder="Mention a reviewer" ariaLabel="Review request" />
        </div>
        <app-code></app-code>
    `
})
export class InvalidDoc {
    text = '';

    users = ['amyelsner', 'annafali', 'bernardodominic', 'ionibowcher'];

    suggestions: string[] = [];

    search(event: MentionSearchEvent) {
        this.suggestions = this.users.filter((user) => user.startsWith(event.query.toLowerCase()));
    }
}
