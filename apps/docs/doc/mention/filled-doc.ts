import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'filled-doc',
    standalone: true,
    imports: [FormsModule, MentionModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>Specify the <i>variant</i> property as <i>filled</i> to display the component with a higher visual emphasis than the default <i>outlined</i> style.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-mention [(ngModel)]="text" variant="filled" [suggestions]="suggestions" (onSearch)="search($event)" [rows]="3" [cols]="40" placeholder="Type @ to mention someone" ariaLabel="Filled comment" />
        </div>
        <app-code></app-code>
    `
})
export class FilledDoc {
    text = '';

    users = ['amyelsner', 'annafali', 'bernardodominic', 'ionibowcher'];

    suggestions: string[] = [];

    search(event: MentionSearchEvent) {
        this.suggestions = this.users.filter((user) => user.startsWith(event.query.toLowerCase()));
    }
}
