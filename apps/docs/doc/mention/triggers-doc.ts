import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'triggers-doc',
    standalone: true,
    imports: [FormsModule, MentionModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                <i>triggers</i> lists the characters that start a mention, <i>&#64;</i> only by default. <i>event.trigger</i> tells the search handler which one was typed, here users for <i>&#64;</i> and tags for <i>#</i>, and the item template
                receives it as <i>trigger</i>. A trigger only counts at the start of a word, so an email address does not open the panel.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-mention [(ngModel)]="text" [triggers]="['@', '#']" [suggestions]="suggestions" (onSearch)="search($event)" [rows]="4" placeholder="Mention a user with @ or add a tag with #" ariaLabel="Post" fluid>
                <ng-template #item let-option let-trigger="trigger">
                    @if (trigger === '#') {
                        <i class="pi pi-hashtag" aria-hidden="true"></i>
                    } @else {
                        <i class="pi pi-user" aria-hidden="true"></i>
                    }
                    <span>{{ option }}</span>
                </ng-template>
            </p-mention>
        </div>
        <app-code></app-code>
    `
})
export class TriggersDoc {
    text = '';

    users = ['amyelsner', 'annafali', 'asiyajavayant', 'bernardodominic', 'elwinsharvill', 'ionibowcher', 'onyamalimba', 'xuxuefeng'];

    tags = ['angular', 'accessibility', 'design', 'forms', 'performance', 'release', 'signals', 'theming'];

    suggestions: string[] = [];

    search(event: MentionSearchEvent) {
        const source = event.trigger === '#' ? this.tags : this.users;
        this.suggestions = source.filter((item) => item.startsWith(event.query.toLowerCase()));
    }
}
