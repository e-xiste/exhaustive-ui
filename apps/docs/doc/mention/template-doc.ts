import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from '@exhaustive-ui/core/avatar';
import { MentionModule, MentionSearchEvent } from '@exhaustive-ui/core/mention';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

interface User {
    name: string;
    username: string;
    image: string;
}

@Component({
    selector: 'template-doc',
    standalone: true,
    imports: [FormsModule, AvatarModule, MentionModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Suggestions can be objects: <i>optionLabel</i> names the property that is inserted in the text. The <i>item</i> template renders each suggestion, with an avatar for instance, and <i>header</i>, <i>footer</i> and <i>empty</i> templates
                customize the panel. With <i>autoResize</i>, the textarea grows with its content.
            </p>
        </app-docsectiontext>
        <div class="card">
            <p-mention [(ngModel)]="text" [suggestions]="suggestions" optionLabel="username" (onSearch)="search($event)" [rows]="3" autoResize placeholder="Write a reply, type @ to mention someone" ariaLabel="Reply" fluid>
                <ng-template #header>
                    <div class="font-medium px-3 pt-2 pb-1 text-sm">People in this conversation</div>
                </ng-template>
                <ng-template #item let-user>
                    <p-avatar [image]="'https://exhaustive-ui.com/demo/avatar/' + user.image" shape="circle" size="normal" aria-hidden="true" />
                    <div class="flex flex-col">
                        <span class="font-medium">{{ user.name }}</span>
                        <span class="text-sm text-muted-color">&#64;{{ user.username }}</span>
                    </div>
                </ng-template>
                <ng-template #empty let-query="query">Nobody matches "{{ query }}"</ng-template>
            </p-mention>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDoc {
    text = '';

    users: User[] = [
        { name: 'Amy Elsner', username: 'amy', image: 'amyelsner.png' },
        { name: 'Anna Fali', username: 'anna', image: 'annafali.png' },
        { name: 'Asiya Javayant', username: 'asiya', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', username: 'bernardo', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', username: 'elwin', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', username: 'ioni', image: 'ionibowcher.png' },
        { name: 'Onyama Limba', username: 'onyama', image: 'onyamalimba.png' },
        { name: 'Xuxue Feng', username: 'xuxue', image: 'xuxuefeng.png' }
    ];

    suggestions: User[] = [];

    search(event: MentionSearchEvent) {
        const query = event.query.toLowerCase();
        this.suggestions = this.users.filter((user) => user.username.startsWith(query) || user.name.toLowerCase().includes(query));
    }
}
