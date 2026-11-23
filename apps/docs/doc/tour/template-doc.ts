import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { TourModule, TourStep } from '@exhaustive-ui/core/tour';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    selector: 'template-doc',
    standalone: true,
    imports: [TourModule, ButtonModule, AppCode, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                The <i>step</i> template replaces the whole card. It receives the step, its <i>index</i>, the <i>total</i>, <i>first</i> and <i>last</i> flags, the <i>next</i>, <i>prev</i>, <i>goTo</i> and <i>close</i> functions, and the
                <i>titleId</i> and <i>contentId</i> to give to the title and the text so that they label and describe the dialog. The <i>header</i>, <i>content</i> and <i>footer</i> templates replace one part of the card only and receive the same
                context. Use the <i>data</i> of a step for anything else the template needs.
            </p>
        </app-docsectiontext>
        <div class="card flex flex-col items-center gap-6">
            <div class="flex gap-2">
                <p-button id="tour-template-inbox" label="Inbox" icon="pi pi-inbox" severity="secondary" />
                <p-button id="tour-template-calendar" label="Calendar" icon="pi pi-calendar" severity="secondary" />
            </div>
            <p-button label="Start the tour" icon="pi pi-play" (onClick)="visible = true" />
            <p-tour [steps]="steps" [(visible)]="visible">
                <ng-template #step let-step let-index="index" let-total="total" let-first="first" let-last="last" let-next="next" let-prev="prev" let-close="close" let-titleId="titleId" let-contentId="contentId">
                    <div class="flex items-center gap-3">
                        <span class="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-contrast">
                            <i [class]="step.data.icon" aria-hidden="true"></i>
                        </span>
                        <div class="flex flex-col">
                            <span class="text-sm text-muted-color">Step {{ index + 1 }} of {{ total }}</span>
                            <span [id]="titleId" class="font-semibold text-lg">{{ step.title }}</span>
                        </div>
                    </div>
                    <p [id]="contentId" class="m-0 leading-normal">{{ step.content }}</p>
                    <div class="flex justify-between gap-2">
                        <p-button label="Skip" severity="secondary" [text]="true" size="small" (onClick)="close()" />
                        <div class="flex gap-2">
                            @if (!first) {
                                <p-button icon="pi pi-arrow-left" severity="secondary" [outlined]="true" size="small" ariaLabel="Back" (onClick)="prev()" />
                            }
                            <p-button [label]="last ? 'Start working' : 'Continue'" size="small" (onClick)="next()" />
                        </div>
                    </div>
                </ng-template>
            </p-tour>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDoc {
    visible = false;

    steps: TourStep[] = [
        { target: '#tour-template-inbox', title: 'Your inbox', content: 'Messages from your team and your clients land here.', data: { icon: 'pi pi-inbox' } },
        { target: '#tour-template-calendar', title: 'Your calendar', content: 'Meetings and deadlines, synchronized with your agenda.', data: { icon: 'pi pi-calendar' } }
    ];
}
