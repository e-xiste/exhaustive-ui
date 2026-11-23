import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'basic-doc',
    standalone: true,
    imports: [FormsModule, MentionModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Mention is bound with <i>ngModel</i> and its value is the plain text. Typing <i>&#64;</i> at the start of a word emits <i>onSearch</i> with the text typed after it as <i>event.query</i>; the handler answers by setting
                <i>suggestions</i>. Choosing one with the mouse, <i>enter</i> or <i>tab</i> replaces the query with the trigger, the suggestion and a space.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-mention [(ngModel)]="text" [suggestions]="suggestions" (onSearch)="search($event)" [rows]="4" placeholder="Type @ to mention someone" ariaLabel="Comment" fluid />
        </div>
        <app-code></app-code>
    `
})
export class BasicDoc {
    text = '';

    users = ['amyelsner', 'annafali', 'asiyajavayant', 'bernardodominic', 'elwinsharvill', 'ionibowcher', 'ivanmagalhaes', 'onyamalimba', 'stephenshaw', 'xuxuefeng'];

    suggestions: string[] = [];

    search(event: MentionSearchEvent) {
        this.suggestions = this.users.filter((user) => user.startsWith(event.query.toLowerCase()));
    }
}
