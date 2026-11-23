import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputChipsModule } from '@exhaustive-ui/core/inputchips';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'template-doc',
    standalone: true,
    imports: [FormsModule, InputChipsModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                The <i>chip</i> template replaces the content of a chip; its context gives the value, its <i>index</i>, whether it is <i>focused</i> or <i>removable</i>, and a <i>remove</i> function. The <i>removeicon</i> template only replaces the
                remove icon.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-4">
            <p-inputchips [(ngModel)]="languages" ariaLabel="Languages" class="w-full md:w-[30rem]">
                <ng-template #chip let-value let-remove="remove" let-removable="removable">
                    <span class="inline-flex items-center gap-2 rounded-border px-2 py-1 bg-primary text-primary-contrast">
                        <i class="pi pi-code text-xs" aria-hidden="true"></i>
                        {{ value }}
                        @if (removable) {
                            <i class="pi pi-times text-xs cursor-pointer" aria-hidden="true" (click)="remove($event)"></i>
                        }
                    </span>
                </ng-template>
            </p-inputchips>
            <p-inputchips [(ngModel)]="topics" ariaLabel="Topics" class="w-full md:w-[30rem]">
                <ng-template #removeicon let-class="class">
                    <i [class]="class + ' pi pi-trash'" aria-hidden="true"></i>
                </ng-template>
            </p-inputchips>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDoc {
    languages: string[] = ['TypeScript', 'Rust'];

    topics: string[] = ['forms', 'accessibility'];
}
