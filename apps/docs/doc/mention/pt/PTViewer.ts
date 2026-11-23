import { AppDocPtViewer } from '@/components/doc/app.docptviewer';
import { getPTOptions } from '@/components/doc/app.docptviewer';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';

@Component({
    selector: 'mention-pt-viewer',
    standalone: true,
    imports: [AppDocPtViewer, FormsModule, MentionModule],
    template: `
        <app-docptviewer [docs]="docs">
            <p-mention [(ngModel)]="text" [suggestions]="suggestions" (onSearch)="search($event)" [rows]="3" class="w-full" fluid placeholder="Type @ to mention someone" ariaLabel="Comment" />
        </app-docptviewer>
    `
})
export class PTViewer {
    text = '';

    users = ['amyelsner', 'annafali', 'bernardodominic', 'ionibowcher'];

    suggestions: string[] = [];

    search(event: MentionSearchEvent) {
        this.suggestions = this.users.filter((user) => user.startsWith(event.query.toLowerCase()));
    }

    docs = [{ data: getPTOptions('Mention'), key: 'Mention' }];
}
