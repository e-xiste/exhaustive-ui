import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'singleline-doc',
    standalone: true,
    imports: [FormsModule, MentionModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>With <i>multiline</i> set to false, Mention renders a single-line input instead of a textarea. The panel opens under the trigger by default; <i>position="field"</i> opens it under the whole field, like an AutoComplete.</p>
        </app-docsectiontext>
        <div class="card flex flex-col gap-4">
            <p-mention [(ngModel)]="title" [multiline]="false" [suggestions]="suggestions" (onSearch)="search($event)" placeholder="Task title, @ to assign" ariaLabel="Task title" fluid />
            <p-mention [(ngModel)]="subtitle" [multiline]="false" position="field" [suggestions]="suggestions" (onSearch)="search($event)" placeholder="Panel under the field" ariaLabel="Task subtitle" fluid />
        </div>
        <app-code></app-code>
    `
})
export class SingleLineDoc {
    title = '';

    subtitle = '';

    users = ['amyelsner', 'annafali', 'asiyajavayant', 'bernardodominic', 'elwinsharvill', 'ionibowcher', 'onyamalimba', 'xuxuefeng'];

    suggestions: string[] = [];

    search(event: MentionSearchEvent) {
        this.suggestions = this.users.filter((user) => user.startsWith(event.query.toLowerCase()));
    }
}
