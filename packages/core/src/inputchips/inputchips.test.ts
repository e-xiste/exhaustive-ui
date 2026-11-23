import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, FormField, maxLength, minLength } from '@angular/forms/signals';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import { IconField } from '@exhaustive-ui/core/iconfield';
import { InputIcon } from '@exhaustive-ui/core/inputicon';
import { FloatLabel } from '@exhaustive-ui/core/floatlabel';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { Base } from '@exhaustive-ui/core/base';
import { Theme } from '@exhaustive-ui/styled';
import Aura from '@exhaustive-ui/themes/aura';
import { InputChips } from './inputchips';

@Component({
    standalone: true,
    imports: [InputChips, FormsModule],
    template: `<p-input-chips [(ngModel)]="tags" name="tags" [disabled]="disabled()" />`
})
class NgModelHost {
    tags = signal<string[] | null>(['angular']);
    disabled = signal(false);
}

@Component({
    standalone: true,
    imports: [InputChips, ReactiveFormsModule],
    template: `<p-input-chips [formControl]="control" />`
})
class ReactiveHost {
    control = new FormControl<string[]>([], { nonNullable: true, validators: Validators.required });
}

@Component({
    standalone: true,
    imports: [InputChips, FormField],
    template: `<p-input-chips [formField]="f.tags" />`
})
class SignalFormsHost {
    model = signal<{ tags: string[] }>({ tags: [] });
    f = form(this.model, (p) => {
        minLength(p.tags, 1);
        maxLength(p.tags, 3);
    });
}

@Component({
    standalone: true,
    imports: [InputChips],
    template: `
        <p-input-chips>
            <ng-template #chip let-value let-index="index" let-remove="remove" let-focused="focused">
                <span class="custom-chip" [class.is-focused]="focused">{{ index }}:{{ value }}</span>
                <button type="button" class="custom-remove" (click)="remove($event)">x</button>
            </ng-template>
        </p-input-chips>
    `
})
class ChipTemplateHost {}

@Component({
    standalone: true,
    imports: [InputChips],
    template: `
        <p-input-chips>
            <ng-template #removeicon let-value let-class="class">
                <i class="custom-remove-icon" [class]="class" [attr.data-value]="value"></i>
            </ng-template>
        </p-input-chips>
    `
})
class RemoveIconHost {}

@Component({
    standalone: true,
    imports: [InputChips, FloatLabel, IconField, InputIcon],
    template: `
        <p-floatlabel variant="in">
            <p-input-chips inputId="fl" />
            <label for="fl">Tags</label>
        </p-floatlabel>
        <p-iconfield>
            <p-inputicon class="pi pi-tag" />
            <p-input-chips class="with-icon" />
        </p-iconfield>
    `
})
class LabelsHost {}

describe('InputChips', () => {
    let fixture: ComponentFixture<InputChips>;
    let component: InputChips;
    let host: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InputChips, NgModelHost, ReactiveHost, SignalFormsHost, ChipTemplateHost, RemoveIconHost, LabelsHost],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(InputChips);
        component = fixture.componentInstance;
        host = fixture.nativeElement;
        document.body.appendChild(host);
        fixture.detectChanges();
    });

    afterEach(() => {
        host.remove();
    });

    const render = async () => {
        await fixture.whenStable();
        fixture.detectChanges();
    };

    const input = () => host.querySelector('input') as HTMLInputElement;
    const items = () => Array.from(host.querySelectorAll<HTMLLIElement>('li[role=option]'));
    const labels = () => items().map((li) => li.textContent!.trim());
    const live = () => host.querySelector('[aria-live]')!.textContent!.trim();

    const key = (target: Element, k: string, init: KeyboardEventInit = {}) => {
        const event = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...init });
        target.dispatchEvent(event);
        return event;
    };

    const type = async (text: string) => {
        const el = input();
        el.focus();
        el.value = text;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        await render();
    };

    const enter = async (text: string) => {
        await type(text);
        const event = key(input(), 'Enter');
        await render();
        return event;
    };

    const paste = async (text: string) => {
        const el = input();
        el.focus();
        const data = new DataTransfer();
        data.setData('text/plain', text);
        const event = new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true });
        el.dispatchEvent(event);
        await render();
        return event;
    };

    const setValue = async (value: string[]) => {
        component.writeValue(value);
        await render();
    };

    describe('Rendering', () => {
        it('should render the root, the field box and a text input', () => {
            expect(host.classList).toContain('p-inputchips');
            expect(host.classList).toContain('p-inputwrapper');
            expect(host.querySelector('.p-inputchips-input')).toBeTruthy();
            expect(input().classList).toContain('p-inputchips-input-field');
            expect(input().type).toBe('text');
            expect(host.querySelector('[role=listbox]')).toBeNull();
        });

        it('should render the chips with the Chip component', async () => {
            await setValue(['angular', 'signals']);
            expect(labels()).toEqual(['angular', 'signals']);
            expect(host.querySelectorAll('p-chip.p-chip.p-inputchips-chip').length).toBe(2);
            expect(host.querySelectorAll('.p-inputchips-chip-icon').length).toBe(2);
            expect(host.classList).toContain('p-inputwrapper-filled');
        });

        it('should show the placeholder only while there is no chip', async () => {
            fixture.componentRef.setInput('placeholder', 'Add a tag');
            await render();
            expect(input().getAttribute('placeholder')).toBe('Add a tag');
            await setValue(['a']);
            expect(input().hasAttribute('placeholder')).toBe(false);
        });

        it('should pass the input id, tabindex and aria attributes to the input', async () => {
            fixture.componentRef.setInput('inputId', 'tags');
            fixture.componentRef.setInput('ariaLabelledBy', 'tags-label');
            fixture.componentRef.setInput('tabindex', 2);
            fixture.componentRef.setInput('invalid', true);
            fixture.componentRef.setInput('required', true);
            await render();
            expect(input().id).toBe('tags');
            expect(input().getAttribute('aria-labelledby')).toBe('tags-label');
            expect(input().getAttribute('tabindex')).toBe('2');
            expect(input().getAttribute('aria-invalid')).toBe('true');
            expect(input().getAttribute('aria-required')).toBe('true');
            expect(host.classList).toContain('p-invalid');
        });

        it('should apply the size, variant and fluid classes', async () => {
            fixture.componentRef.setInput('size', 'small');
            fixture.componentRef.setInput('variant', 'filled');
            fixture.componentRef.setInput('fluid', true);
            await render();
            const box = host.querySelector('.p-inputchips-input')!;
            expect(box.classList).toContain('p-inputchips-input-sm');
            expect(box.classList).toContain('p-inputfield-sm');
            expect(box.classList).toContain('p-variant-filled');
            expect(host.classList).toContain('p-inputchips-fluid');
            fixture.componentRef.setInput('size', 'large');
            await render();
            expect(box.classList).toContain('p-inputchips-input-lg');
        });

        it('should expose its state in data-p', async () => {
            fixture.componentRef.setInput('invalid', true);
            fixture.componentRef.setInput('size', 'small');
            await setValue(['a']);
            const dataP = host.getAttribute('data-p')!;
            expect(dataP).toContain('invalid');
            expect(dataP).toContain('filled');
            expect(dataP).toContain('small');
        });
    });

    describe('Adding', () => {
        it('should add a chip on Enter, clear the input and announce it', async () => {
            const event = await enter('  angular  ');
            expect(labels()).toEqual(['angular']);
            expect(input().value).toBe('');
            expect(event.defaultPrevented).toBe(true);
            expect(live()).toBe('angular added');
        });

        it('should not prevent Enter on an empty input, so that the form is submitted', async () => {
            const event = await enter('   ');
            expect(event.defaultPrevented).toBe(false);
            expect(labels()).toEqual([]);
        });

        it('should ignore Enter while an IME composition is in progress', async () => {
            await type('日本');
            key(input(), 'Enter', { isComposing: true } as KeyboardEventInit);
            await render();
            expect(labels()).toEqual([]);
        });

        it('should emit onAdd once per chip with its index', async () => {
            const added: any[] = [];
            component.onAdd.subscribe((e) => added.push({ value: e.value, index: e.index }));
            await enter('a');
            await paste('b\nc');
            expect(added).toEqual([
                { value: 'a', index: 0 },
                { value: 'b', index: 1 },
                { value: 'c', index: 2 }
            ]);
        });

        it('should split typed text on a string separator and keep the rest in the input', async () => {
            fixture.componentRef.setInput('separator', ',');
            await render();
            await type('one,two,thr');
            expect(labels()).toEqual(['one', 'two']);
            expect(input().value).toBe('thr');
            await enter('thr');
            expect(labels()).toEqual(['one', 'two', 'thr']);
        });

        it('should split on a RegExp separator', async () => {
            fixture.componentRef.setInput('separator', /[,;]/);
            await render();
            await type('a;b,c;');
            expect(labels()).toEqual(['a', 'b', 'c']);
            expect(input().value).toBe('');
        });

        it('should split pasted text on the separator and on new lines', async () => {
            fixture.componentRef.setInput('separator', ',');
            await render();
            const event = await paste('red, green\nblue,,');
            expect(event.defaultPrevented).toBe(true);
            expect(labels()).toEqual(['red', 'green', 'blue']);
            expect(live()).toBe('3 values added');
        });

        it('should merge pasted text with the text around the caret', async () => {
            fixture.componentRef.setInput('separator', ',');
            await render();
            await type('pre');
            input().setSelectionRange(3, 3);
            await paste('fix,next');
            expect(labels()).toEqual(['prefix', 'next']);
        });

        it('should let a single pasted value be pasted natively', async () => {
            fixture.componentRef.setInput('separator', ',');
            await render();
            const event = await paste('single');
            expect(event.defaultPrevented).toBe(false);
            expect(labels()).toEqual([]);
        });

        it('should add the text on blur when addOnBlur is set', async () => {
            fixture.componentRef.setInput('addOnBlur', true);
            await render();
            await type('blurred');
            input().blur();
            await render();
            expect(labels()).toEqual(['blurred']);
        });

        it('should keep the text on blur by default', async () => {
            await type('kept');
            input().blur();
            await render();
            expect(labels()).toEqual([]);
            expect(input().value).toBe('kept');
            expect(host.classList).toContain('p-inputwrapper-filled');
        });

        it('should add the text on Tab when addOnTab is set, without blocking the focus move', async () => {
            fixture.componentRef.setInput('addOnTab', true);
            await render();
            await type('tabbed');
            const event = key(input(), 'Tab');
            await render();
            expect(labels()).toEqual(['tabbed']);
            expect(event.defaultPrevented).toBe(false);
        });

        it('should ignore Tab by default', async () => {
            await type('x');
            key(input(), 'Tab');
            await render();
            expect(labels()).toEqual([]);
        });

        it('should add values through the add method', async () => {
            component.add(['x', 'y']);
            component.add('z');
            await render();
            expect(labels()).toEqual(['x', 'y', 'z']);
        });
    });

    describe('Rules', () => {
        it('should reject duplicates by default, keep the text and announce it', async () => {
            const rejected: any[] = [];
            component.onReject.subscribe((e) => rejected.push(e));
            await enter('a');
            await enter('a');
            expect(labels()).toEqual(['a']);
            expect(input().value).toBe('a');
            expect(rejected[0].reason).toBe('duplicate');
            expect(live()).toBe('a is already in the list');
        });

        it('should accept duplicates when allowDuplicate is set', async () => {
            fixture.componentRef.setInput('allowDuplicate', true);
            await render();
            await enter('a');
            await enter('a');
            expect(labels()).toEqual(['a', 'a']);
        });

        it('should stop adding at max and announce the limit', async () => {
            fixture.componentRef.setInput('max', 2);
            await render();
            const rejected: any[] = [];
            component.onReject.subscribe((e) => rejected.push(e.reason));
            await enter('a');
            await enter('b');
            expect(live()).toBe('b added. Maximum of 2 reached');
            await enter('c');
            expect(labels()).toEqual(['a', 'b']);
            expect(rejected).toEqual(['max']);
            expect(live()).toContain('Maximum of 2 reached');
        });

        it('should add pasted values up to max only', async () => {
            fixture.componentRef.setInput('max', 2);
            await render();
            await paste('a\nb\nc\nd');
            expect(labels()).toEqual(['a', 'b']);
        });

        it('should reject values longer than maxChipLength', async () => {
            fixture.componentRef.setInput('maxChipLength', 3);
            await render();
            await enter('abcd');
            expect(labels()).toEqual([]);
            expect(live()).toBe('Too long, 3 characters maximum');
            await enter('abc');
            expect(labels()).toEqual(['abc']);
        });

        it('should transform values and drop the ones it empties', async () => {
            fixture.componentRef.setInput('transform', (v: string) => (v === 'drop' ? '' : v.toLowerCase()));
            await render();
            await enter('Angular');
            await enter('ANGULAR');
            await enter('drop');
            expect(labels()).toEqual(['angular']);
        });

        it('should reject values refused by validate', async () => {
            fixture.componentRef.setInput('validate', (v: string, values: readonly string[]) => v.includes('@') && values.length < 5);
            await render();
            await enter('not-an-email');
            await enter('a@b.c');
            expect(labels()).toEqual(['a@b.c']);
            await enter('nope');
            expect(live()).toBe('nope is not valid');
            expect(input().value).toBe('nope');
        });

        it('should coerce string limits and treat null as no limit', async () => {
            fixture.componentRef.setInput('max', '1');
            await render();
            expect(component.max()).toBe(1);
            fixture.componentRef.setInput('max', null);
            await render();
            expect(component.max()).toBeUndefined();
        });
    });

    describe('Removing', () => {
        it('should remove a chip with the remove icon, emit onRemove and announce it', async () => {
            await setValue(['a', 'b']);
            const removed: any[] = [];
            component.onRemove.subscribe((e) => removed.push({ value: e.value, index: e.index }));
            (host.querySelectorAll('.p-inputchips-chip-icon')[0] as HTMLElement).click();
            await render();
            expect(labels()).toEqual(['b']);
            expect(removed).toEqual([{ value: 'a', index: 0 }]);
            expect(live()).toBe('a removed');
            expect(document.activeElement).toBe(input());
        });

        it('should hide the remove icon from assistive technologies', async () => {
            await setValue(['a']);
            const icon = host.querySelector('.p-inputchips-chip-icon')!;
            expect(icon.getAttribute('aria-hidden')).toBe('true');
            expect(icon.hasAttribute('tabindex')).toBe(false);
        });

        it('should not emit onChipClick when the remove icon is clicked', async () => {
            await setValue(['a']);
            const spy = vi.fn();
            component.onChipClick.subscribe(spy);
            (host.querySelector('.p-inputchips-chip-icon') as HTMLElement).click();
            expect(spy).not.toHaveBeenCalled();
        });

        it('should remove and clear through the methods', async () => {
            await setValue(['a', 'b', 'c']);
            component.remove(1);
            await render();
            expect(labels()).toEqual(['a', 'c']);
            component.remove(5);
            component.clear();
            await render();
            expect(labels()).toEqual([]);
        });
    });

    describe('Keyboard', () => {
        beforeEach(async () => {
            await setValue(['a', 'b', 'c']);
        });

        it('should focus the last chip with Backspace on an empty input', async () => {
            input().focus();
            const event = key(input(), 'Backspace');
            await render();
            expect(event.defaultPrevented).toBe(true);
            expect(document.activeElement).toBe(items()[2]);
            expect(items()[2].classList).toContain('p-focus');
            expect(labels()).toEqual(['a', 'b', 'c']);
        });

        it('should focus a chip added by the previous key once it is rendered', async () => {
            input().focus();
            component.add('d');
            key(input(), 'Backspace');
            await render();
            expect(document.activeElement).toBe(items()[3]);
            expect(document.activeElement!.textContent).toContain('d');
        });

        it('should keep Backspace native while the input has text', async () => {
            await type('x');
            const event = key(input(), 'Backspace');
            expect(event.defaultPrevented).toBe(false);
            expect(document.activeElement).toBe(input());
        });

        it('should focus the last chip with ArrowLeft at the start of the input', async () => {
            await type('xy');
            input().setSelectionRange(1, 1);
            key(input(), 'ArrowLeft');
            expect(document.activeElement).toBe(input());
            input().setSelectionRange(0, 0);
            key(input(), 'ArrowLeft');
            expect(document.activeElement).toBe(items()[2]);
        });

        it('should move between the chips and back to the input with the arrows', async () => {
            items()[2].focus();
            key(items()[2], 'ArrowLeft');
            expect(document.activeElement).toBe(items()[1]);
            key(items()[1], 'ArrowLeft');
            key(items()[0], 'ArrowLeft');
            expect(document.activeElement).toBe(items()[0]);
            key(items()[0], 'ArrowRight');
            key(items()[1], 'ArrowRight');
            key(items()[2], 'ArrowRight');
            expect(document.activeElement).toBe(input());
        });

        it('should go to the first and last chips with Home and End', async () => {
            items()[1].focus();
            key(items()[1], 'Home');
            expect(document.activeElement).toBe(items()[0]);
            key(items()[0], 'End');
            expect(document.activeElement).toBe(items()[2]);
        });

        it('should return to the input with Escape', async () => {
            items()[0].focus();
            key(items()[0], 'Escape');
            expect(document.activeElement).toBe(input());
        });

        it('should remove the focused chip with Backspace and focus the previous one', async () => {
            items()[1].focus();
            key(items()[1], 'Backspace');
            await render();
            expect(labels()).toEqual(['a', 'c']);
            expect(document.activeElement).toBe(items()[0]);
            expect(live()).toBe('b removed');
        });

        it('should remove the focused chip with Delete and focus the next one', async () => {
            items()[1].focus();
            key(items()[1], 'Delete');
            await render();
            expect(labels()).toEqual(['a', 'c']);
            expect(document.activeElement).toBe(items()[1]);
            expect(document.activeElement!.textContent).toContain('c');
        });

        it('should focus the previous chip when the last one is deleted, and the input when none is left', async () => {
            items()[2].focus();
            key(items()[2], 'Delete');
            await render();
            expect(document.activeElement).toBe(items()[1]);
            key(items()[1], 'Delete');
            await render();
            key(items()[0], 'Backspace');
            await render();
            expect(labels()).toEqual([]);
            expect(document.activeElement).toBe(input());
        });

        it('should keep the focus inside the component while removing chips', async () => {
            const blur = vi.fn();
            component.onBlur.subscribe(blur);
            items()[2].focus();
            key(items()[2], 'Backspace');
            await render();
            key(items()[1], 'Backspace');
            await render();
            expect(blur).not.toHaveBeenCalled();
            expect(component.focused()).toBe(true);
        });

        it('should emit onChipClick with Enter on a chip and with a click', async () => {
            const clicks: any[] = [];
            component.onChipClick.subscribe((e) => clicks.push(e.value));
            items()[0].focus();
            key(items()[0], 'Enter');
            items()[1].click();
            expect(clicks).toEqual(['a', 'b']);
        });

        it('should send printable keys to the input', async () => {
            items()[0].focus();
            const event = key(items()[0], 'x');
            expect(event.defaultPrevented).toBe(false);
            expect(document.activeElement).toBe(input());
        });

        it('should mirror the arrows in a right-to-left layout', async () => {
            host.setAttribute('dir', 'rtl');
            input().focus();
            key(input(), 'ArrowRight');
            expect(document.activeElement).toBe(items()[2]);
            key(items()[2], 'ArrowRight');
            expect(document.activeElement).toBe(items()[1]);
            key(items()[1], 'ArrowLeft');
            key(items()[2], 'ArrowLeft');
            expect(document.activeElement).toBe(input());
        });

        it('should focus the input when the empty part of the field is clicked', async () => {
            (host.querySelector('.p-inputchips-input') as HTMLElement).click();
            expect(document.activeElement).toBe(input());
        });
    });

    describe('Accessibility', () => {
        it('should render the chips as options of a labelled horizontal listbox', async () => {
            await setValue(['a', 'b']);
            const list = host.querySelector('[role=listbox]')!;
            expect(list.getAttribute('aria-orientation')).toBe('horizontal');
            expect(list.getAttribute('aria-label')).toBe('Values');
            const [first, second] = items();
            expect(first.getAttribute('aria-posinset')).toBe('1');
            expect(second.getAttribute('aria-setsize')).toBe('2');
            expect(first.getAttribute('aria-selected')).toBe('true');
            expect(first.getAttribute('tabindex')).toBe('-1');
            expect(first.id).not.toBe(second.id);
        });

        it('should describe the removal keys and label the list with ariaLabel or ariaLabelledBy', async () => {
            await setValue(['a']);
            fixture.componentRef.setInput('ariaLabel', 'Tags');
            await render();
            const list = host.querySelector('[role=listbox]')!;
            expect(list.getAttribute('aria-label')).toBe('Tags');
            const hint = document.getElementById(list.getAttribute('aria-describedby')!)!;
            expect(hint.textContent).toContain('Delete or Backspace');
            fixture.componentRef.setInput('ariaLabelledBy', 'tags-label');
            await render();
            expect(list.hasAttribute('aria-label')).toBe(false);
            expect(list.getAttribute('aria-labelledby')).toBe('tags-label');
            expect(input().getAttribute('aria-label')).toBe('Tags');
        });

        it('should merge custom labels with the defaults', async () => {
            fixture.componentRef.setInput('labels', { addedMessage: '{0} ajouté', listLabel: 'Étiquettes' });
            await render();
            await enter('a');
            expect(live()).toBe('a ajouté');
            expect(host.querySelector('[role=listbox]')!.getAttribute('aria-label')).toBe('Étiquettes');
            expect(component.labelOf('removedMessage')).toBe('{0} removed');
        });

        it('should announce a repeated message again', async () => {
            fixture.componentRef.setInput('max', 0);
            await render();
            await enter('a');
            const first = host.querySelector('[aria-live]')!.textContent;
            await enter('a');
            expect(host.querySelector('[aria-live]')!.textContent).not.toBe(first);
        });
    });

    describe('Disabled and readonly', () => {
        it('should disable the input, the chips and the removal when disabled', async () => {
            await setValue(['a']);
            fixture.componentRef.setInput('disabled', true);
            await render();
            expect(input().disabled).toBe(true);
            expect(items()[0].hasAttribute('tabindex')).toBe(false);
            expect(host.querySelector('.p-inputchips-chip-icon')).toBeNull();
            expect(host.querySelector('.p-inputchips-input')!.classList).toContain('p-disabled');
            component.add('b');
            component.remove(0);
            await render();
            expect(labels()).toEqual(['a']);
        });

        it('should keep the chips navigable but not editable when readonly', async () => {
            await setValue(['a', 'b']);
            fixture.componentRef.setInput('readonly', true);
            await render();
            expect(input().readOnly).toBe(true);
            expect(host.querySelector('.p-inputchips-chip-icon')).toBeNull();
            expect(host.querySelector('[role=listbox]')!.hasAttribute('aria-describedby')).toBe(false);
            items()[1].focus();
            key(items()[1], 'Delete');
            await render();
            expect(labels()).toEqual(['a', 'b']);
            await enter('c');
            expect(labels()).toEqual(['a', 'b']);
        });
    });

    describe('Focus events', () => {
        it('should emit onFocus and onBlur once for the whole component', async () => {
            await setValue(['a']);
            const focus = vi.fn();
            const blur = vi.fn();
            component.onFocus.subscribe(focus);
            component.onBlur.subscribe(blur);
            input().focus();
            items()[0].focus();
            input().focus();
            await render();
            expect(focus).toHaveBeenCalledTimes(1);
            expect(host.classList).toContain('p-focus');
            expect(host.classList).toContain('p-inputwrapper-focus');
            input().blur();
            await render();
            expect(blur).toHaveBeenCalledTimes(1);
            expect(host.classList).not.toContain('p-focus');
        });
    });

    describe('Forms', () => {
        it('should work with ngModel', async () => {
            const f = TestBed.createComponent(NgModelHost);
            f.detectChanges();
            await f.whenStable();
            f.detectChanges();
            const el: HTMLElement = f.nativeElement;
            expect(el.querySelectorAll('li[role=option]').length).toBe(1);
            const chips = f.debugElement.children[0].componentInstance as InputChips;
            chips.add('signals');
            await f.whenStable();
            expect(f.componentInstance.tags()).toEqual(['angular', 'signals']);
            f.componentInstance.tags.set(null);
            await f.whenStable();
            f.detectChanges();
            expect(chips.chips()).toEqual([]);
            expect(el.querySelectorAll('li[role=option]').length).toBe(0);
        });

        it('should mark the control touched on blur and follow its disabled state', async () => {
            const f = TestBed.createComponent(ReactiveHost);
            f.detectChanges();
            await f.whenStable();
            const el: HTMLElement = f.nativeElement;
            document.body.appendChild(el);
            const field = el.querySelector('input') as HTMLInputElement;
            expect(f.componentInstance.control.valid).toBe(false);
            field.focus();
            field.value = 'one';
            field.dispatchEvent(new Event('input'));
            field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
            field.blur();
            await f.whenStable();
            expect(f.componentInstance.control.value).toEqual(['one']);
            expect(f.componentInstance.control.valid).toBe(true);
            expect(f.componentInstance.control.touched).toBe(true);
            f.componentInstance.control.disable();
            await f.whenStable();
            f.detectChanges();
            expect(field.disabled).toBe(true);
            f.componentInstance.control.setValue(['x', 'y']);
            await f.whenStable();
            f.detectChanges();
            expect(el.querySelectorAll('li[role=option]').length).toBe(2);
            el.remove();
        });

        it('should drop the text not added yet when the form is reset', async () => {
            const f = TestBed.createComponent(ReactiveHost);
            f.detectChanges();
            await f.whenStable();
            const el: HTMLElement = f.nativeElement;
            const chips = f.debugElement.children[0].componentInstance as InputChips;
            const field = el.querySelector('input') as HTMLInputElement;
            chips.add('one');
            field.value = 'pending';
            field.dispatchEvent(new Event('input'));
            await f.whenStable();
            f.detectChanges();
            expect(el.querySelector('p-input-chips')!.classList).toContain('p-inputwrapper-filled');
            f.componentInstance.control.reset();
            await f.whenStable();
            f.detectChanges();
            expect(chips.chips()).toEqual([]);
            expect(field.value).toBe('');
            expect(el.querySelector('p-input-chips')!.classList).not.toContain('p-inputwrapper-filled');

            field.value = 'kept';
            field.dispatchEvent(new Event('input'));
            f.componentInstance.control.setValue(['x']);
            await f.whenStable();
            expect(field.value).toBe('kept');
            f.componentInstance.control.reset([]);
            await f.whenStable();
            expect(field.value).toBe('');
        });

        it('should keep the text being typed when the model echoes the value', async () => {
            fixture.componentRef.setInput('separator', ',');
            await type('a,b');
            expect(labels()).toEqual(['a']);
            component.writeValue(['a']);
            await render();
            expect(input().value).toBe('b');
        });

        it('should work with Signal Forms without taking the array maxLength as a chip length', async () => {
            const f = TestBed.createComponent(SignalFormsHost);
            f.detectChanges();
            await f.whenStable();
            f.detectChanges();
            const chips = f.debugElement.children[0].componentInstance as InputChips;
            expect(f.componentInstance.f.tags().invalid()).toBe(true);
            chips.add(['first-long-value', 'b']);
            await f.whenStable();
            expect(f.componentInstance.model().tags).toEqual(['first-long-value', 'b']);
            expect(f.componentInstance.f.tags().invalid()).toBe(false);
            f.componentInstance.model.set({ tags: ['z'] });
            await f.whenStable();
            f.detectChanges();
            expect(chips.chips()).toEqual(['z']);
        });
    });

    describe('Templates', () => {
        it('should render the chip template with its context', async () => {
            const f = TestBed.createComponent(ChipTemplateHost);
            f.detectChanges();
            const chips = f.debugElement.children[0].componentInstance as InputChips;
            chips.writeValue(['a', 'b']);
            await f.whenStable();
            f.detectChanges();
            const el: HTMLElement = f.nativeElement;
            expect(Array.from(el.querySelectorAll('.custom-chip')).map((n) => n.textContent)).toEqual(['0:a', '1:b']);
            expect(el.querySelector('p-chip')).toBeNull();
            (el.querySelector('.custom-remove') as HTMLElement).click();
            await f.whenStable();
            f.detectChanges();
            expect(chips.chips()).toEqual(['b']);
        });

        it('should not emit onChipClick for the next chip when the template removes a chip with a click', async () => {
            const f = TestBed.createComponent(ChipTemplateHost);
            const el: HTMLElement = f.nativeElement;
            document.body.appendChild(el);
            f.detectChanges();
            const chips = f.debugElement.children[0].componentInstance as InputChips;
            chips.writeValue(['a', 'b']);
            await f.whenStable();
            f.detectChanges();
            const clicked = vi.fn();
            const removed = vi.fn();
            chips.onChipClick.subscribe(clicked);
            chips.onRemove.subscribe((e) => removed(e.value));
            (el.querySelector('.custom-remove') as HTMLElement).click();
            await f.whenStable();
            f.detectChanges();
            expect(chips.chips()).toEqual(['b']);
            expect(removed).toHaveBeenCalledExactlyOnceWith('a');
            expect(clicked).not.toHaveBeenCalled();
            expect(document.activeElement).toBe(el.querySelector('input'));
            el.remove();
        });

        it('should render the remove icon template', async () => {
            const f = TestBed.createComponent(RemoveIconHost);
            f.detectChanges();
            const chips = f.debugElement.children[0].componentInstance as InputChips;
            chips.writeValue(['a']);
            await f.whenStable();
            f.detectChanges();
            const icon = f.nativeElement.querySelector('.custom-remove-icon') as HTMLElement;
            expect(icon.getAttribute('data-value')).toBe('a');
            expect(icon.classList).toContain('p-inputchips-chip-icon');
            (icon.parentElement as HTMLElement).click();
            await f.whenStable();
            expect(chips.chips()).toEqual([]);
        });
    });

    describe('FloatLabel and IconField', () => {
        it('should float the label when the component has the focus or a value', async () => {
            const f = TestBed.createComponent(LabelsHost);
            f.detectChanges();
            await f.whenStable();
            const el: HTMLElement = f.nativeElement;
            const chips = el.querySelector('p-input-chips')!;
            expect(chips.classList).toContain('p-inputwrapper');
            expect(el.querySelector('#fl')).toBeTruthy();
            expect(el.querySelector('label')!.getAttribute('for')).toBe('fl');
        });
    });

    describe('PassThrough', () => {
        it('should apply pass-through attributes', async () => {
            fixture.componentRef.setInput('pt', {
                root: { 'data-test': 'root' },
                container: { 'data-test': 'container' },
                input: { 'data-test': 'input' },
                list: { 'data-test': 'list' },
                chipItem: { 'data-test': 'item' },
                chipLabel: { 'data-test': 'label' },
                chipIcon: { 'data-test': 'icon' }
            });
            await setValue(['a']);
            expect(host.getAttribute('data-test')).toBe('root');
            expect(host.querySelector('.p-inputchips-input')!.getAttribute('data-test')).toBe('container');
            expect(input().getAttribute('data-test')).toBe('input');
            expect(host.querySelector('[role=listbox]')!.getAttribute('data-test')).toBe('list');
            expect(items()[0].getAttribute('data-test')).toBe('item');
            expect(host.querySelector('.p-inputchips-chip-label')!.getAttribute('data-test')).toBe('label');
            expect(host.querySelector('.p-inputchips-chip-icon')!.getAttribute('data-test')).toBe('icon');
        });

        it('should drop the style classes when unstyled', async () => {
            fixture.componentRef.setInput('unstyled', true);
            await setValue(['a']);
            expect(host.classList).not.toContain('p-inputchips');
            expect(input().classList).not.toContain('p-inputchips-input-field');
            expect(labels()).toEqual(['a']);
        });
    });
});

describe('InputChips global pass-through', () => {
    it('should read the inputChips key of the global pass-through', async () => {
        await TestBed.configureTestingModule({
            imports: [InputChips],
            providers: [provideZonelessChangeDetection(), provideExhaustive({ pt: { inputChips: { root: { 'data-global': 'yes' } } } })]
        }).compileComponents();
        const fixture = TestBed.createComponent(InputChips);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(fixture.nativeElement.getAttribute('data-global')).toBe('yes');
    });
});

@Component({
    standalone: true,
    imports: [InputChips, InputText, FormsModule],
    template: `
        @for (size of sizes; track size) {
            <div [attr.id]="size ?? 'normal'">
                <input pInputText [pSize]="size" />
                <p-input-chips [size]="size" placeholder="Empty" />
                <p-input-chips [size]="size" [ngModel]="['chip']" />
            </div>
        }
    `
})
class SizesHost {
    sizes = ['small', undefined, 'large'] as const;
}

describe('InputChips with a theme', () => {
    afterEach(() => {
        Theme._theme = undefined;
        Theme._tokens = {};
        Theme.clearLoadedStyleNames();
        Base.clearLoadedStyleNames();
        document.head.querySelectorAll('style[data-exhaustive-style-id]').forEach((style) => style.remove());
    });

    it('should have the height of an InputText of the same size, with or without chips', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [SizesHost],
            providers: [provideZonelessChangeDetection(), provideExhaustive({ theme: { preset: Aura } })]
        });
        const fixture = TestBed.createComponent(SizesHost);
        const el: HTMLElement = fixture.nativeElement;
        document.body.appendChild(el);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const height = (node: Element) => Math.round(node.getBoundingClientRect().height * 4) / 4;
        for (const id of ['small', 'normal', 'large']) {
            const row = el.querySelector(`#${id}`)!;
            const fields = row.querySelectorAll('.p-inputchips-input');
            expect(row.querySelector('.p-chip')).toBeTruthy();
            const expected = height(row.querySelector('input[pInputText]')!);
            expect([id, height(fields[0]), height(fields[1])]).toEqual([id, expected, expected]);
        }
        el.remove();
    });

    it('should show the focus ring on a chip rendered by the chip template', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [ChipTemplateHost],
            providers: [provideZonelessChangeDetection(), provideExhaustive({ theme: { preset: Aura } })]
        });
        const fixture = TestBed.createComponent(ChipTemplateHost);
        const el: HTMLElement = fixture.nativeElement;
        document.body.appendChild(el);
        fixture.detectChanges();
        const chips = fixture.debugElement.children[0].componentInstance as InputChips;
        chips.writeValue(['a']);
        await fixture.whenStable();
        fixture.detectChanges();
        const field = el.querySelector('input') as HTMLInputElement;
        field.focus();
        field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true }));
        const item = el.querySelector('li[role=option]') as HTMLElement;
        expect(document.activeElement).toBe(item);
        expect(item.matches(':focus-visible')).toBe(true);
        expect(getComputedStyle(item).outlineStyle).not.toBe('none');
        el.remove();
    });
});
