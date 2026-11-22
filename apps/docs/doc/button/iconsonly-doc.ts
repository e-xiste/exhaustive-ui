import { Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    selector: 'iconsonly-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>Buttons can have icons without labels.</p>
        </app-docsectiontext>
        <div class="card">
            <div class="flex justify-center flex-wrap gap-4 mb-6">
                <p-button icon="pi pi-check" ariaLabel="Confirm" />
                <p-button icon="pi pi-bookmark" ariaLabel="Bookmark" severity="secondary" />
                <p-button icon="pi pi-search" ariaLabel="Search" severity="success" />
                <p-button icon="pi pi-user" ariaLabel="Profile" severity="info" />
                <p-button icon="pi pi-bell" ariaLabel="Notifications" severity="warn" />
                <p-button icon="pi pi-heart" ariaLabel="Add to favorites" severity="help" />
                <p-button icon="pi pi-times" ariaLabel="Cancel" severity="danger" />
            </div>
            <div class="flex justify-center flex-wrap gap-4 mb-6">
                <p-button icon="pi pi-check" ariaLabel="Confirm" [rounded]="true" />
                <p-button icon="pi pi-bookmark" ariaLabel="Bookmark" [rounded]="true" severity="secondary" />
                <p-button icon="pi pi-search" ariaLabel="Search" [rounded]="true" severity="success" />
                <p-button icon="pi pi-user" ariaLabel="Profile" [rounded]="true" severity="info" />
                <p-button icon="pi pi-bell" ariaLabel="Notifications" [rounded]="true" severity="warn" />
                <p-button icon="pi pi-heart" ariaLabel="Add to favorites" [rounded]="true" severity="help" />
                <p-button icon="pi pi-times" ariaLabel="Cancel" [rounded]="true" severity="danger" />
            </div>
            <div class="flex justify-center flex-wrap gap-4 mb-6">
                <p-button icon="pi pi-check" ariaLabel="Confirm" [rounded]="true" [outlined]="true" />
                <p-button icon="pi pi-bookmark" ariaLabel="Bookmark" [rounded]="true" severity="secondary" [outlined]="true" />
                <p-button icon="pi pi-search" ariaLabel="Search" [rounded]="true" severity="success" [outlined]="true" />
                <p-button icon="pi pi-user" ariaLabel="Profile" [rounded]="true" severity="info" [outlined]="true" />
                <p-button icon="pi pi-bell" ariaLabel="Notifications" [rounded]="true" severity="warn" [outlined]="true" />
                <p-button icon="pi pi-heart" ariaLabel="Add to favorites" [rounded]="true" severity="help" [outlined]="true" />
                <p-button icon="pi pi-times" ariaLabel="Cancel" [rounded]="true" severity="danger" [outlined]="true" />
            </div>
            <div class="flex justify-center flex-wrap gap-4 mb-6">
                <p-button icon="pi pi-check" ariaLabel="Confirm" [rounded]="true" [text]="true" [raised]="true" />
                <p-button icon="pi pi-bookmark" ariaLabel="Bookmark" [rounded]="true" [text]="true" [raised]="true" severity="secondary" />
                <p-button icon="pi pi-search" ariaLabel="Search" [rounded]="true" [text]="true" [raised]="true" severity="success" />
                <p-button icon="pi pi-user" ariaLabel="Profile" [rounded]="true" [text]="true" [raised]="true" severity="info" />
                <p-button icon="pi pi-bell" ariaLabel="Notifications" [rounded]="true" [text]="true" [raised]="true" severity="warn" />
                <p-button icon="pi pi-heart" ariaLabel="Add to favorites" [rounded]="true" [text]="true" [raised]="true" severity="help" />
                <p-button icon="pi pi-times" ariaLabel="Cancel" [rounded]="true" [text]="true" [raised]="true" severity="danger" />
            </div>
            <div class="flex justify-center flex-wrap gap-4 mb-6">
                <p-button icon="pi pi-check" ariaLabel="Confirm" [rounded]="true" [text]="true" />
                <p-button icon="pi pi-bookmark" ariaLabel="Bookmark" [rounded]="true" [text]="true" severity="secondary" />
                <p-button icon="pi pi-search" ariaLabel="Search" [rounded]="true" [text]="true" severity="success" />
                <p-button icon="pi pi-user" ariaLabel="Profile" [rounded]="true" [text]="true" severity="info" />
                <p-button icon="pi pi-bell" ariaLabel="Notifications" [rounded]="true" [text]="true" severity="warn" />
                <p-button icon="pi pi-heart" ariaLabel="Add to favorites" [rounded]="true" [text]="true" severity="help" />
                <p-button icon="pi pi-times" ariaLabel="Cancel" [rounded]="true" [text]="true" severity="danger" />
            </div>
        </div>
        <app-code></app-code>
    `
})
export class IconOnlyDoc {}
