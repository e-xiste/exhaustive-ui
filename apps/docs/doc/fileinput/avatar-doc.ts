import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileInputModule } from '@exhaustive-ui/core/fileinput';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'avatar-doc',
    standalone: true,
    imports: [FormsModule, FileInputModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                The <i>avatar</i> variant is a single clickable image to replace a profile picture or a logo, round by default or square with <i>avatarShape</i>. It holds one file, so its value is a file or null. The image shown comes from the chosen
                file, otherwise from the first <i>existing</i> file. On mobile devices, <i>capture</i> opens the camera directly.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-wrap justify-center gap-12">
            <p-file variant="avatar" accept="image/*" capture="user" ariaLabel="Profile picture" [(ngModel)]="photo" />
            <p-file variant="avatar" avatarShape="square" accept="image/*" ariaLabel="Company logo" [(ngModel)]="logo" />
        </div>
        <app-code></app-code>
    `
})
export class AvatarDoc {
    photo: File | null = null;

    logo: File | null = null;
}
