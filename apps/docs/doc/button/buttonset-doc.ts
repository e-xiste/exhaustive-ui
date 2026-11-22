import { Component } from '@angular/core';
import { AppCode } from '@/components/doc/app.code';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
    selector: 'buttonset-doc',
    standalone: true,
    imports: [AppCode, AppDocSectionText, ButtonModule],
    template: `
        <app-docsectiontext>
            <p>Multiple buttons are grouped when wrapped inside an element with <i>p-buttonset</i> class.</p>
        </app-docsectiontext>
        <div class="card flex justify-center">
            <span class="p-buttonset">
                <button pButton pRipple>
                    <i class="pi pi-check" pButtonIcon></i>
                    <span pButtonLabel>Save</span>
                </button>
                <button pButton pRipple>
                    <i class="pi pi-trash" pButtonIcon></i>
                    <span pButtonLabel>Delete</span>
                </button>
                <button pButton pRipple>
                    <i class="pi pi-times" pButtonIcon></i>
                    <span pButtonLabel>Cancel</span>
                </button>
            </span>
        </div>
        <app-code></app-code>
    `
})
export class ButtonsetDoc {}
