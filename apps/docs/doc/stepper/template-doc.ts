import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';
import { StepperModule } from '@exhaustive-ui/core/stepper';
import { ButtonModule } from '@exhaustive-ui/core/button';
import { PasswordModule } from '@exhaustive-ui/core/password';
import { ToggleButtonModule } from '@exhaustive-ui/core/togglebutton';
import { InputTextModule } from '@exhaustive-ui/core/inputtext';

@Component({
    selector: 'template-doc',
    standalone: true,
    imports: [CommonModule, FormsModule, AppDocSectionText, AppCode, StepperModule, ButtonModule, PasswordModule, ToggleButtonModule, InputTextModule],
    template: `
        <app-docsectiontext>
            <p>Stepper provides various templating options to customize the default UI design.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <p-stepper [(value)]="activeStep" class="basis-160">
                <p-step-list>
                    <p-step [value]="1" class="flex flex-row flex-auto gap-2">
                        <ng-template #content let-activateCallback="activateCallback" let-value="value">
                            <button class="bg-transparent border-0 inline-flex flex-col gap-2" (click)="activateCallback()">
                                <span
                                    class="rounded-full border-2 w-12 h-12 inline-flex items-center justify-center"
                                    [ngClass]="{
                                        'bg-primary text-primary-contrast border-primary': value <= activeStep,
                                        'border-surface': value > activeStep
                                    }"
                                >
                                    <i class="pi pi-user"></i>
                                </span>
                            </button>
                        </ng-template>
                    </p-step>

                    <p-step [value]="2" class="flex flex-row flex-auto gap-2">
                        <ng-template #content let-activateCallback="activateCallback" let-value="value">
                            <button class="bg-transparent border-0 inline-flex flex-col gap-2" (click)="activateCallback()">
                                <span
                                    class="rounded-full border-2 w-12 h-12 inline-flex items-center justify-center"
                                    [ngClass]="{
                                        'bg-primary text-primary-contrast border-primary': value <= activeStep,
                                        'border-surface': value > activeStep
                                    }"
                                >
                                    <i class="pi pi-star"></i>
                                </span>
                            </button>
                        </ng-template>
                    </p-step>

                    <p-step [value]="3" class="flex flex-row flex-auto gap-2">
                        <ng-template #content let-activateCallback="activateCallback" let-value="value">
                            <button class="bg-transparent border-0 inline-flex flex-col gap-2" (click)="activateCallback()">
                                <span
                                    class="rounded-full border-2 w-12 h-12 inline-flex items-center justify-center"
                                    [ngClass]="{
                                        'bg-primary text-primary-contrast border-primary': value <= activeStep,
                                        'border-surface': value > activeStep
                                    }"
                                >
                                    <i class="pi pi-id-card"></i>
                                </span>
                            </button>
                        </ng-template>
                    </p-step>
                </p-step-list>

                <p-step-panels>
                    <p-step-panel [value]="1">
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                                <div class="text-center mt-4 mb-4 text-xl font-semibold">Create your account</div>
                                <div class="field">
                                    <input [(ngModel)]="name" pInputText id="input" type="text" placeholder="Name" fluid />
                                </div>
                                <div class="field">
                                    <input [(ngModel)]="email" pInputText id="email" type="email" placeholder="Email" fluid />
                                </div>
                                <div class="field">
                                    <p-password [(ngModel)]="password" placeholder="Password" fluid />
                                </div>
                            </div>
                            <div class="flex pt-6 justify-end">
                                <p-button (onClick)="activateCallback(2)" label="Next" icon="pi pi-arrow-right" iconPos="right" />
                            </div>
                        </ng-template>
                    </p-step-panel>

                    <p-step-panel [value]="2">
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
                                <div class="text-center mt-4 mb-4 text-xl font-semibold">Choose your interests</div>
                                <div class="flex flex-wrap justify-center gap-4">
                                    <p-toggle-button [(ngModel)]="option1" onLabel="Nature" offLabel="Nature" />
                                    <p-toggle-button [(ngModel)]="option2" onLabel="Art" offLabel="Art" />
                                    <p-toggle-button [(ngModel)]="option3" onLabel="Music" offLabel="Music" />
                                    <p-toggle-button [(ngModel)]="option4" onLabel="Design" offLabel="Design" />
                                    <p-toggle-button [(ngModel)]="option5" onLabel="Photography" offLabel="Photography" />
                                    <p-toggle-button [(ngModel)]="option6" onLabel="Movies" offLabel="Movies" />
                                    <p-toggle-button [(ngModel)]="option7" onLabel="Sports" offLabel="Sports" />
                                    <p-toggle-button [(ngModel)]="option8" onLabel="Gaming" offLabel="Gaming" />
                                    <p-toggle-button [(ngModel)]="option9" onLabel="Traveling" offLabel="Traveling" />
                                    <p-toggle-button [(ngModel)]="option10" onLabel="Dancing" offLabel="Dancing" />
                                </div>
                            </div>
                            <div class="flex pt-6 justify-between">
                                <p-button (onClick)="activateCallback(1)" label="Back" severity="secondary" icon="pi pi-arrow-left" />
                                <p-button (onClick)="activateCallback(3)" label="Next" icon="pi pi-arrow-right" iconPos="right" />
                            </div>
                        </ng-template>
                    </p-step-panel>

                    <p-step-panel [value]="3">
                        <ng-template #content let-activateCallback="activateCallback">
                            <div class="flex flex-col items-center gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
                                <div class="text-center mt-4 mb-4 text-xl font-semibold">Account created successfully</div>
                                <div class="text-center">
                                    <img alt="logo" src="https://exhaustive-ui.com/demo/stepper/content.svg" />
                                </div>
                            </div>
                            <div class="flex pt-6 justify-start">
                                <p-button (onClick)="activateCallback(2)" label="Back" severity="secondary" icon="pi pi-arrow-left" />
                            </div>
                        </ng-template>
                    </p-step-panel>
                </p-step-panels>
            </p-stepper>
        </div>
        <app-code></app-code>
    `
})
export class TemplateDoc {
    activeStep: number = 1;

    name: string | undefined = null;

    email: string | undefined = null;

    password: string | undefined = null;

    option1: boolean | undefined = false;

    option2: boolean | undefined = false;

    option3: boolean | undefined = false;

    option4: boolean | undefined = false;

    option5: boolean | undefined = false;

    option6: boolean | undefined = false;

    option7: boolean | undefined = false;

    option8: boolean | undefined = false;

    option9: boolean | undefined = false;

    option10: boolean | undefined = false;
}
