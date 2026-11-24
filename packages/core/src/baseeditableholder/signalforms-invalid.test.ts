import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField, required } from '@angular/forms/signals';
import { Checkbox } from '@exhaustive-ui/core/checkbox';
import { InputChips } from '@exhaustive-ui/core/inputchips';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { Select } from '@exhaustive-ui/core/select';
import { Textarea } from '@exhaustive-ui/core/textarea';

// Signal Forms write the field's validity to the `invalid` input of the control, whatever the template binds, and
// its touched state to `touched`. The controls must not look invalid before the user has touched the field.
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FormField, InputText, Textarea, Select, Checkbox, InputChips],
    template: `
        <input id="text" pInputText [formField]="profile.name" />
        <textarea id="area" pTextarea [formField]="profile.bio"></textarea>
        <p-select id="select" [formField]="profile.city" [options]="cities" />
        <p-checkbox id="check" [formField]="profile.terms" [binary]="true" />
        <p-input-chips id="chips" [formField]="profile.tags" />
    `
})
class SignalFormsInvalidHostComponent {
    cities = ['Rome', 'Paris'];
    model = signal({ name: '', bio: '', city: null as string | null, terms: false, tags: null as string[] | null });
    profile = form(this.model, (path) => {
        required(path.name);
        required(path.bio);
        required(path.city);
        required(path.terms);
        required(path.tags);
    });
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [InputText, Select],
    template: `
        <input id="text" pInputText [invalid]="true" />
        <p-select id="select" [invalid]="true" [options]="['Rome']" />
    `
})
class PlainInvalidHostComponent {}

const settle = async (fixture: { detectChanges(): void; whenStable(): Promise<unknown> }) => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
};

describe('Invalid style with Signal Forms', () => {
    const ids = ['text', 'area', 'select', 'check', 'chips'] as const;
    // the element that carries p-invalid for each control
    const invalidElement = (root: HTMLElement, id: (typeof ids)[number]) => {
        const host = root.querySelector(`#${id}`) as HTMLElement;
        if (id === 'check') return host.querySelector('.p-checkbox-box')?.closest('.p-checkbox') as HTMLElement;
        return host;
    };
    const isInvalid = (root: HTMLElement, id: (typeof ids)[number]) => invalidElement(root, id).classList.contains('p-invalid');

    beforeEach(async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [SignalFormsInvalidHostComponent, PlainInvalidHostComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();
    });

    it('waits until the field is touched, and clears again on reset', async () => {
        const fixture = TestBed.createComponent(SignalFormsInvalidHostComponent);
        await settle(fixture);
        const root = fixture.nativeElement as HTMLElement;
        const profile = fixture.componentInstance.profile;

        for (const id of ids) {
            expect(isInvalid(root, id), `${id} before touch`).toBe(false);
        }
        expect(profile.name().invalid()).toBe(true);
        expect(root.querySelector('#chips input')!.hasAttribute('aria-invalid')).toBe(false);

        profile.name().markAsTouched();
        profile.bio().markAsTouched();
        profile.city().markAsTouched();
        profile.terms().markAsTouched();
        profile.tags().markAsTouched();
        await settle(fixture);
        for (const id of ids) {
            expect(isInvalid(root, id), `${id} after touch`).toBe(true);
        }
        expect(root.querySelector('#chips input')!.getAttribute('aria-invalid')).toBe('true');

        profile().reset();
        await settle(fixture);
        for (const id of ids) {
            expect(isInvalid(root, id), `${id} after reset`).toBe(false);
        }
    });

    it('applies a bound [invalid] at once without a form', async () => {
        const fixture = TestBed.createComponent(PlainInvalidHostComponent);
        await settle(fixture);
        const root = fixture.nativeElement as HTMLElement;
        expect(root.querySelector('#text')!.classList.contains('p-invalid')).toBe(true);
        expect(root.querySelector('#select')!.classList.contains('p-invalid')).toBe(true);
    });
});
