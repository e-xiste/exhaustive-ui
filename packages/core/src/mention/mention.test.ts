import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import type { MentionSearchEvent, MentionSelectEvent } from '@exhaustive-ui/core/types/mention';
import { Mention } from './mention';

interface User {
    name: string;
    username: string;
}

const USERS: User[] = [
    { name: 'Amy Elsner', username: 'amy' },
    { name: 'Anna Fali', username: 'anna' },
    { name: 'Bernardo Dominic', username: 'bernardo' },
    { name: 'Ioni Bowcher', username: 'ioni' }
];

const TAGS = ['angular', 'accessibility', 'forms', 'signals'];

const flush = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

@Component({
    standalone: true,
    imports: [Mention, FormsModule],
    template: `
        <p-mention [(ngModel)]="text" [suggestions]="suggestions()" [triggers]="triggers" optionLabel="username" [delay]="delay" [minQueryLength]="minQueryLength" [multiline]="multiline()" (onSearch)="search($event)" (onSelect)="selected = $event">
            <ng-template #item let-user let-trigger="trigger" let-focused="focused">
                <span class="custom-item" [attr.data-trigger]="trigger" [attr.data-focused]="focused">{{ trigger === '#' ? user.username : user.name }}</span>
            </ng-template>
        </p-mention>
    `
})
class HostComponent {
    text = '';
    suggestions = signal<any[]>([]);
    triggers = ['@', '#'];
    delay = 0;
    minQueryLength = 0;
    multiline = signal(true);
    searches: MentionSearchEvent[] = [];
    selected: MentionSelectEvent | undefined;

    search(event: MentionSearchEvent) {
        this.searches.push(event);
        const query = event.query.toLowerCase();
        if (event.trigger === '#') {
            this.suggestions.set(TAGS.filter((tag) => tag.startsWith(query)).map((tag) => ({ username: tag })));
        } else {
            this.suggestions.set(USERS.filter((user) => user.username.startsWith(query) || user.name.toLowerCase().startsWith(query)));
        }
    }
}

@Component({
    standalone: true,
    imports: [Mention, ReactiveFormsModule],
    template: `<p-mention [formControl]="control" />`
})
class ReactiveHost {
    control = new FormControl<string>('Hello', { nonNullable: true, validators: Validators.required });
}

@Component({
    standalone: true,
    imports: [Mention, FormField],
    template: `<p-mention [formField]="f.message" />`
})
class SignalFormsHost {
    model = signal<{ message: string }>({ message: '' });
    f = form(this.model, (p) => {
        required(p.message);
    });
}

@Component({
    standalone: true,
    imports: [Mention],
    template: `
        <p-mention [suggestions]="[]" (onSearch)="(0)">
            <ng-template #empty let-query="query">
                <span class="custom-empty">Nobody named {{ query }}</span>
            </ng-template>
            <ng-template #header let-trigger="trigger"
                ><div class="custom-header">Header {{ trigger }}</div></ng-template
            >
            <ng-template #footer><div class="custom-footer">Footer</div></ng-template>
        </p-mention>
    `
})
class TemplatesHost {}

describe('Mention', () => {
    let fixture: ComponentFixture<HostComponent>;
    let host: HostComponent;
    let mention: Mention;
    let root: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent, ReactiveHost, SignalFormsHost, TemplatesHost],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
        mention = fixture.debugElement.children[0].componentInstance as Mention;
        root = fixture.nativeElement.querySelector('p-mention');
    });

    afterEach(() => {
        fixture.destroy();
    });

    const render = async (f: ComponentFixture<any> = fixture) => {
        f.detectChanges();
        await f.whenStable();
        f.detectChanges();
    };

    const field = (el: HTMLElement = root) => el.querySelector('.p-mention-input') as HTMLTextAreaElement;

    const focus = (el: HTMLTextAreaElement) => {
        el.focus();
        if (document.activeElement !== el) {
            el.dispatchEvent(new FocusEvent('focus'));
        }
    };

    /** Types text at the caret, or replaces the whole value when `replace` is set. */
    const type = async (text: string, { replace = false, f = fixture as ComponentFixture<any>, el = field() }: { replace?: boolean; f?: ComponentFixture<any>; el?: HTMLTextAreaElement } = {}) => {
        focus(el);
        const caret = el.selectionStart ?? el.value.length;
        el.value = replace ? text : el.value.slice(0, caret) + text + el.value.slice(caret);
        const position = replace ? text.length : caret + text.length;
        el.setSelectionRange(position, position);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        await render(f);
    };

    const key = async (name: string, options: KeyboardEventInit = {}) => {
        const event = new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true, ...options });
        field().dispatchEvent(event);
        field().dispatchEvent(new KeyboardEvent('keyup', { key: name, bubbles: true }));
        await render();
        return event;
    };

    const options = () => Array.from(document.querySelectorAll('.p-mention-option')) as HTMLElement[];

    const overlay = () => document.querySelector('.p-mention-overlay') as HTMLElement | null;

    describe('Rendering', () => {
        it('should render a textarea by default', () => {
            expect(root.classList).toContain('p-mention');
            expect(field().tagName).toBe('TEXTAREA');
            expect(field().classList).toContain('p-textarea');
            expect(field().getAttribute('aria-autocomplete')).toBe('list');
            expect(field().getAttribute('autocomplete')).toBe('off');
        });

        it('should render a single-line combobox input when multiline is false', async () => {
            host.multiline.set(false);
            await render();
            const input = field() as unknown as HTMLInputElement;
            expect(input.tagName).toBe('INPUT');
            expect(input.type).toBe('text');
            expect(input.classList).toContain('p-inputtext');
            expect(input.getAttribute('role')).toBe('combobox');
            expect(input.getAttribute('aria-expanded')).toBe('false');
        });

        it('should pass rows, cols, placeholder, name and inputId to the textarea', async () => {
            const f = TestBed.createComponent(Mention);
            f.componentRef.setInput('rows', 4);
            f.componentRef.setInput('cols', 30);
            f.componentRef.setInput('placeholder', 'Write a comment');
            f.componentRef.setInput('name', 'comment');
            f.componentRef.setInput('inputId', 'comment-field');
            f.componentRef.setInput('maxlength', 280);
            await render(f);
            const textarea = field(f.nativeElement);
            expect(textarea.getAttribute('rows')).toBe('4');
            expect(textarea.getAttribute('cols')).toBe('30');
            expect(textarea.getAttribute('placeholder')).toBe('Write a comment');
            expect(textarea.getAttribute('name')).toBe('comment');
            expect(textarea.id).toBe('comment-field');
            expect(textarea.getAttribute('maxlength')).toBe('280');
            f.destroy();
        });

        it('should apply the size, variant, fluid and invalid states', async () => {
            const f = TestBed.createComponent(Mention);
            f.componentRef.setInput('size', 'small');
            f.componentRef.setInput('variant', 'filled');
            f.componentRef.setInput('fluid', true);
            f.componentRef.setInput('invalid', true);
            await render(f);
            const textarea = field(f.nativeElement);
            expect(textarea.classList).toContain('p-textarea-sm');
            expect(textarea.classList).toContain('p-variant-filled');
            expect(textarea.classList).toContain('p-textarea-fluid');
            expect(textarea.classList).toContain('p-invalid');
            expect(textarea.getAttribute('aria-invalid')).toBe('true');
            expect(f.nativeElement.classList).toContain('p-mention-fluid');
            expect(f.nativeElement.classList).toContain('p-invalid');
            f.destroy();
        });

        it('should auto resize the textarea when autoResize is set', async () => {
            const f = TestBed.createComponent(Mention);
            f.componentRef.setInput('autoResize', true);
            await render(f);
            expect(field(f.nativeElement).classList).toContain('p-textarea-resizable');
            f.destroy();
        });

        it('should render disabled and readonly fields', async () => {
            const f = TestBed.createComponent(Mention);
            f.componentRef.setInput('disabled', true);
            await render(f);
            expect(field(f.nativeElement).disabled).toBe(true);
            expect(f.nativeElement.classList).toContain('p-disabled');
            f.componentRef.setInput('disabled', false);
            f.componentRef.setInput('readonly', true);
            await render(f);
            expect(field(f.nativeElement).hasAttribute('readonly')).toBe(true);
            f.destroy();
        });
    });

    describe('Triggers and search', () => {
        it('should emit onSearch and open the panel when the trigger is typed', async () => {
            await type('Hello @');
            expect(host.searches.at(-1)).toMatchObject({ trigger: '@', query: '' });
            expect(mention.overlayVisible()).toBe(true);
            expect(options().length).toBe(4);
        });

        it('should search with the query typed after the trigger', async () => {
            await type('@a');
            await type('n');
            expect(host.searches.map((s) => s.query)).toEqual(['a', 'an']);
            expect(options().length).toBe(1);
            expect(options()[0].textContent).toContain('Anna Fali');
        });

        it('should only trigger at the start of a word', async () => {
            await type('mail@example');
            expect(host.searches.length).toBe(0);
            expect(mention.overlayVisible()).toBe(false);
        });

        it('should support several triggers and pass the trigger to the item template', async () => {
            await type('#a');
            expect(host.searches.at(-1)).toMatchObject({ trigger: '#', query: 'a' });
            const items = Array.from(document.querySelectorAll('.custom-item'));
            expect(items.map((item) => item.textContent?.trim())).toEqual(['angular', 'accessibility']);
            expect(options().length).toBe(2);
            expect(options()[0].querySelector('.custom-item')?.getAttribute('data-trigger')).toBe('#');
        });

        it('should support multi-character triggers', async () => {
            const f = TestBed.createComponent(Mention);
            f.componentRef.setInput('triggers', ['::', ':']);
            f.componentRef.setInput('suggestions', ['smile']);
            await render(f);
            const searches: MentionSearchEvent[] = [];
            f.componentInstance.onSearch.subscribe((event) => searches.push(event));
            await type('Hi ::smi', { f, el: field(f.nativeElement) });
            expect(searches.at(-1)).toMatchObject({ trigger: '::', query: 'smi' });
            f.componentInstance.select('smile');
            await render(f);
            expect(field(f.nativeElement).value).toBe('Hi ::smile ');
            f.destroy();
        });

        it('should accept a single trigger string', async () => {
            const f = TestBed.createComponent(Mention);
            f.componentRef.setInput('triggers', '/');
            await render(f);
            expect(f.componentInstance.triggers()).toEqual(['/']);
            f.destroy();
        });

        it('should close the panel when a space ends the mention', async () => {
            await type('@amy');
            expect(mention.overlayVisible()).toBe(true);
            await type(' ');
            expect(mention.overlayVisible()).toBe(false);
        });

        it('should wait for minQueryLength characters', async () => {
            host.minQueryLength = 2;
            await render();
            await type('@a');
            expect(host.searches.length).toBe(0);
            expect(mention.overlayVisible()).toBe(false);
            await type('m');
            expect(host.searches.at(-1)?.query).toBe('am');
            expect(mention.overlayVisible()).toBe(true);
        });

        it('should debounce the search with delay', async () => {
            host.delay = 30;
            await render();
            await type('@a');
            await type('m');
            expect(host.searches.length).toBe(0);
            await flush(50);
            await render();
            expect(host.searches.map((s) => s.query)).toEqual(['am']);
        });

        it('should not search again when the caret moves inside the same mention', async () => {
            await type('@am');
            const count = host.searches.length;
            field().dispatchEvent(new MouseEvent('click', { bubbles: true }));
            await render();
            expect(host.searches.length).toBe(count);
        });

        it('should open the panel again when the caret moves back into a mention', async () => {
            await type('@amy and more');
            expect(mention.overlayVisible()).toBe(false);
            field().setSelectionRange(3, 3);
            field().dispatchEvent(new MouseEvent('click', { bubbles: true }));
            await render();
            expect(host.searches.at(-1)).toMatchObject({ trigger: '@', query: 'am' });
            expect(mention.overlayVisible()).toBe(true);
        });

        it('should not open when disabled or readonly', async () => {
            const f = TestBed.createComponent(Mention);
            f.componentRef.setInput('readonly', true);
            f.componentRef.setInput('suggestions', ['a']);
            await render(f);
            const instance = f.componentInstance;
            let searched = false;
            instance.onSearch.subscribe(() => (searched = true));
            await type('@a', { f, el: field(f.nativeElement) });
            expect(searched).toBe(false);
            expect(instance.overlayVisible()).toBe(false);
            f.destroy();
        });
    });

    describe('Selection', () => {
        it('should insert the trigger, the label and a space in place of the query', async () => {
            await type('Hi @an');
            options()[0].click();
            await render();
            expect(field().value).toBe('Hi @anna ');
            expect(host.text).toBe('Hi @anna ');
            expect(field().selectionStart).toBe(9);
            expect(host.selected).toMatchObject({ trigger: '@', query: 'an', text: '@anna', value: USERS[1] });
            expect(mention.overlayVisible()).toBe(false);
        });

        it('should replace the whole word around the caret and keep the following text', async () => {
            await type('Hi @anxx, welcome', { replace: true });
            field().setSelectionRange(6, 6);
            field().dispatchEvent(new MouseEvent('click', { bubbles: true }));
            await render();
            expect(host.searches.at(-1)?.query).toBe('an');
            mention.select(USERS[1]);
            await render();
            expect(field().value).toBe('Hi @anna welcome');
        });

        it('should not add a second space when the text after already starts with one', async () => {
            await type('@am tail', { replace: true });
            field().setSelectionRange(3, 3);
            field().dispatchEvent(new MouseEvent('click', { bubbles: true }));
            await render();
            mention.select(USERS[0]);
            await render();
            expect(field().value).toBe('@amy tail');
            expect(field().selectionStart).toBe(5);
        });

        it('should not add a space when appendSpace is false', async () => {
            const f = TestBed.createComponent(Mention);
            f.componentRef.setInput('appendSpace', false);
            f.componentRef.setInput('suggestions', ['amy']);
            await render(f);
            await type('@a', { f, el: field(f.nativeElement) });
            f.componentInstance.select('amy');
            await render(f);
            expect(field(f.nativeElement).value).toBe('@amy');
            f.destroy();
        });

        it('should use the label of string suggestions and of objects with a label property', async () => {
            const f = TestBed.createComponent(Mention);
            const instance = f.componentInstance;
            expect(instance.getOptionLabel('plain' as any)).toBe('plain');
            expect(instance.getOptionLabel({ label: 'Labelled' } as any)).toBe('Labelled');
            f.componentRef.setInput('optionLabel', (item: any) => item.id);
            await render(f);
            expect(instance.getOptionLabel({ id: 'fn' } as any)).toBe('fn');
            f.destroy();
        });
    });

    describe('Keyboard', () => {
        it('should highlight the first suggestion and move with the arrow keys', async () => {
            await type('@');
            expect(mention.focusedOptionIndex()).toBe(0);
            expect(options()[0].classList).toContain('p-focus');
            const down = await key('ArrowDown');
            expect(down.defaultPrevented).toBe(true);
            expect(mention.focusedOptionIndex()).toBe(1);
            await key('ArrowDown');
            await key('ArrowDown');
            await key('ArrowDown');
            expect(mention.focusedOptionIndex()).toBe(3);
            await key('ArrowUp');
            expect(mention.focusedOptionIndex()).toBe(2);
            await key('PageUp');
            expect(mention.focusedOptionIndex()).toBe(0);
            await key('PageDown');
            expect(mention.focusedOptionIndex()).toBe(3);
        });

        it('should select the highlighted suggestion with Enter', async () => {
            await type('@');
            await key('ArrowDown');
            const enter = await key('Enter');
            expect(enter.defaultPrevented).toBe(true);
            expect(field().value).toBe('@anna ');
        });

        it('should select the highlighted suggestion with Tab', async () => {
            await type('@b');
            const tab = await key('Tab');
            expect(tab.defaultPrevented).toBe(true);
            expect(field().value).toBe('@bernardo ');
        });

        it('should let Enter insert a new line when the panel is closed or empty', async () => {
            const closed = await key('Enter');
            expect(closed.defaultPrevented).toBe(false);
            await type('@zzz');
            expect(options().length).toBe(0);
            expect(mention.overlayVisible()).toBe(true);
            const enter = await key('Enter');
            expect(enter.defaultPrevented).toBe(false);
        });

        it('should close with Escape and stay closed while typing in the same mention', async () => {
            await type('@a');
            const escape = await key('Escape');
            expect(escape.defaultPrevented).toBe(true);
            expect(mention.overlayVisible()).toBe(false);
            await type('m');
            expect(mention.overlayVisible()).toBe(false);
            await type(' @');
            expect(mention.overlayVisible()).toBe(true);
        });

        it('should not prevent Home, End and the horizontal arrows', async () => {
            await type('@a');
            for (const name of ['Home', 'End', 'ArrowLeft', 'ArrowRight']) {
                const event = new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true });
                field().dispatchEvent(event);
                expect(event.defaultPrevented).toBe(false);
            }
        });

        it('should close when the caret leaves the mention with Home', async () => {
            await type('text @a', { replace: true });
            expect(mention.overlayVisible()).toBe(true);
            field().setSelectionRange(0, 0);
            await key('Home');
            expect(mention.overlayVisible()).toBe(false);
        });

        it('should close on blur', async () => {
            await type('@a');
            field().dispatchEvent(new FocusEvent('blur'));
            await render();
            expect(mention.overlayVisible()).toBe(false);
        });

        it('should keep the focus in the field when an option is pressed', async () => {
            await type('@');
            const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
            options()[1].dispatchEvent(event);
            expect(event.defaultPrevented).toBe(true);
        });

        it('should highlight the option under the mouse', async () => {
            await type('@');
            options()[2].dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 10, clientY: 10 }));
            await render();
            expect(mention.focusedOptionIndex()).toBe(2);
        });

        it('should ignore a mousemove sent while the pointer did not move', async () => {
            await type('@');
            field().dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 20, clientY: 30 }));
            await render();
            options()[2].dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 20, clientY: 30 }));
            await render();
            expect(mention.focusedOptionIndex()).toBe(0);
        });
    });

    describe('Accessibility', () => {
        it('should link the textarea to the listbox and its active option', async () => {
            expect(field().hasAttribute('aria-controls')).toBe(false);
            await type('@');
            const list = document.querySelector('.p-mention-list') as HTMLElement;
            expect(list.getAttribute('role')).toBe('listbox');
            expect(field().getAttribute('aria-controls')).toBe(list.id);
            expect(field().getAttribute('aria-activedescendant')).toBe(options()[0].id);
            await key('ArrowDown');
            expect(field().getAttribute('aria-activedescendant')).toBe(options()[1].id);
            expect(options()[1].getAttribute('aria-selected')).toBe('true');
            expect(options()[0].getAttribute('aria-selected')).toBe('false');
            expect(options()[1].getAttribute('aria-posinset')).toBe('2');
            expect(options()[1].getAttribute('aria-setsize')).toBe('4');
        });

        it('should set aria-expanded on the single-line combobox', async () => {
            host.multiline.set(false);
            await render();
            await type('@');
            expect(field().getAttribute('aria-expanded')).toBe('true');
            await key('Escape');
            expect(field().getAttribute('aria-expanded')).toBe('false');
        });

        it('should announce the number of results and the empty state', async () => {
            const status = root.querySelector('[role="status"]') as HTMLElement;
            expect(status.getAttribute('aria-live')).toBe('polite');
            await type('@a');
            expect(status.textContent).toContain('2');
            await type('zz');
            expect(status.textContent?.trim()).toBe('No results found');
        });

        it('should use a custom search message', async () => {
            const f = TestBed.createComponent(Mention);
            f.componentRef.setInput('searchMessage', '{0} people found');
            f.componentRef.setInput('suggestions', ['amy', 'anna']);
            await render(f);
            await type('@', { f, el: field(f.nativeElement) });
            expect(f.nativeElement.querySelector('[role="status"]').textContent.trim()).toBe('2 people found');
            f.destroy();
        });

        it('should pass the accessible name and description to the field', async () => {
            const f = TestBed.createComponent(Mention);
            f.componentRef.setInput('ariaLabel', 'Comment');
            f.componentRef.setInput('ariaDescribedBy', 'hint');
            await render(f);
            expect(field(f.nativeElement).getAttribute('aria-label')).toBe('Comment');
            expect(field(f.nativeElement).getAttribute('aria-describedby')).toBe('hint');
            f.destroy();
        });
    });

    describe('Panel', () => {
        it('should show the empty message, or nothing when showEmptyMessage is false', async () => {
            await type('@zzz');
            expect(document.querySelector('.p-mention-empty-message')?.textContent?.trim()).toBe('No results found');
            const f = TestBed.createComponent(Mention);
            f.componentRef.setInput('showEmptyMessage', false);
            f.componentRef.setInput('suggestions', []);
            await render(f);
            await type('@z', { f, el: field(f.nativeElement) });
            expect(f.componentInstance.overlayVisible()).toBe(false);
            f.componentRef.setInput('suggestions', ['zoe']);
            await render(f);
            expect(f.componentInstance.overlayVisible()).toBe(true);
            f.destroy();
        });

        it('should show a loader while loading', async () => {
            const f = TestBed.createComponent(Mention);
            f.componentRef.setInput('loading', true);
            f.componentRef.setInput('suggestions', []);
            await render(f);
            await type('@a', { f, el: field(f.nativeElement) });
            expect(f.nativeElement.querySelector('.p-mention-loader')?.textContent).toContain('Loading...');
            expect(f.nativeElement.querySelector('[role="status"]').textContent.trim()).toBe('Loading...');
            f.componentRef.setInput('loading', false);
            f.componentRef.setInput('suggestions', ['amy']);
            await render(f);
            expect(f.nativeElement.querySelector('.p-mention-loader')).toBeNull();
            expect(f.nativeElement.querySelectorAll('.p-mention-option').length).toBe(1);
            f.destroy();
        });

        it('should render the empty, header and footer templates', async () => {
            const f = TestBed.createComponent(TemplatesHost);
            await render(f);
            const el = f.nativeElement.querySelector('p-mention');
            await type('@zoe', { f, el: field(el) });
            expect(el.querySelector('.custom-empty')?.textContent).toContain('Nobody named zoe');
            expect(el.querySelector('.custom-header')?.textContent).toContain('Header @');
            expect(el.querySelector('.custom-footer')).not.toBeNull();
            f.destroy();
        });

        it('should apply the scroll height to the list container', async () => {
            await type('@');
            expect((document.querySelector('.p-mention-list-container') as HTMLElement).style.maxHeight).toBe('200px');
        });

        it('should position the panel anchor under the line of the trigger', async () => {
            await type('first line\nsecond @', { replace: true });
            const anchor = root.querySelector('.p-mention-anchor') as HTMLElement;
            const fieldEl = field();
            expect(parseFloat(anchor.style.top)).toBeGreaterThan(fieldEl.offsetTop);
            expect(parseFloat(anchor.style.left)).toBeGreaterThan(fieldEl.offsetLeft);
            expect(overlay()).not.toBeNull();
        });

        it('should align the panel with the whole field when position is field', async () => {
            const f = TestBed.createComponent(Mention);
            f.componentRef.setInput('position', 'field');
            f.componentRef.setInput('suggestions', ['amy']);
            await render(f);
            await type('text @', { f, el: field(f.nativeElement) });
            const anchor = f.nativeElement.querySelector('.p-mention-anchor') as HTMLElement;
            expect(anchor.style.width).toBe(`${field(f.nativeElement).offsetWidth}px`);
            expect(anchor.style.top).toBe(`${field(f.nativeElement).offsetTop}px`);
            f.destroy();
        });

        it('should emit onShow and onHide once', async () => {
            let shown = 0;
            let hidden = 0;
            mention.onShow.subscribe(() => shown++);
            mention.onHide.subscribe(() => hidden++);
            await type('@a');
            await type('m');
            await key('Escape');
            expect(shown).toBe(1);
            expect(hidden).toBe(1);
        });

        it('should render the suggestions with a virtual scroll', async () => {
            const f = TestBed.createComponent(Mention);
            f.componentRef.setInput('virtualScroll', true);
            f.componentRef.setInput('virtualScrollItemSize', 36);
            f.componentRef.setInput(
                'suggestions',
                Array.from({ length: 500 }, (_, i) => `user${i}`)
            );
            await render(f);
            await type('@', { f, el: field(f.nativeElement) });
            await flush(20);
            await render(f);
            const rendered = f.nativeElement.querySelectorAll('.p-mention-option').length;
            expect(rendered).toBeGreaterThan(0);
            expect(rendered).toBeLessThan(500);
            f.destroy();
        });
    });

    describe('Forms', () => {
        it('should work with ngModel', async () => {
            host.text = 'Initial @amy';
            fixture.componentRef.changeDetectorRef.markForCheck();
            await render();
            await render();
            expect(field().value).toBe('Initial @amy');
            await type('Changed', { replace: true });
            expect(host.text).toBe('Changed');
        });

        it('should work with reactive forms', async () => {
            const f = TestBed.createComponent(ReactiveHost);
            await render(f);
            const el = f.nativeElement.querySelector('p-mention');
            expect(field(el).value).toBe('Hello');
            await type(' world', { f, el: field(el) });
            expect(f.componentInstance.control.value).toBe('Hello world');
            f.componentInstance.control.setValue('');
            await render(f);
            expect(field(el).value).toBe('');
            expect(f.componentInstance.control.invalid).toBe(true);
            f.componentInstance.control.disable();
            await render(f);
            expect(field(el).disabled).toBe(true);
            f.destroy();
        });

        it('should mark the control as touched on blur', async () => {
            const f = TestBed.createComponent(ReactiveHost);
            await render(f);
            const el = f.nativeElement.querySelector('p-mention');
            field(el).dispatchEvent(new FocusEvent('blur'));
            expect(f.componentInstance.control.touched).toBe(true);
            f.destroy();
        });

        it('should work with Signal Forms', async () => {
            const f = TestBed.createComponent(SignalFormsHost);
            await render(f);
            const field_ = f.componentInstance.f.message;
            expect(field_().invalid()).toBe(true);
            const el = f.nativeElement.querySelector('p-mention');
            await type('Hello @amy', { f, el: field(el) });
            expect(f.componentInstance.model().message).toBe('Hello @amy');
            expect(field_().invalid()).toBe(false);
            f.componentInstance.model.set({ message: 'Reset' });
            await render(f);
            expect(field(el).value).toBe('Reset');
            f.destroy();
        });
    });

    describe('Pass through and unstyled', () => {
        it('should apply pass-through attributes', async () => {
            const f = TestBed.createComponent(Mention);
            f.componentRef.setInput('pt', {
                root: { 'data-test': 'root' },
                pcTextarea: { root: { 'data-test': 'textarea' } },
                list: { 'data-test': 'list' },
                option: ({ context }: any) => ({ 'data-index': context.index })
            });
            f.componentRef.setInput('suggestions', ['amy', 'anna']);
            await render(f);
            expect(f.nativeElement.getAttribute('data-test')).toBe('root');
            expect(field(f.nativeElement).getAttribute('data-test')).toBe('textarea');
            await type('@', { f, el: field(f.nativeElement) });
            expect(f.nativeElement.querySelector('.p-mention-list').getAttribute('data-test')).toBe('list');
            expect(f.nativeElement.querySelectorAll('.p-mention-option')[1].getAttribute('data-index')).toBe('1');
            f.destroy();
        });

        it('should render without classes when unstyled', async () => {
            const f = TestBed.createComponent(Mention);
            f.componentRef.setInput('unstyled', true);
            f.componentRef.setInput('suggestions', ['amy']);
            await render(f);
            expect(f.nativeElement.classList).not.toContain('p-mention');
            const textarea = f.nativeElement.querySelector('textarea');
            expect(textarea.classList).not.toContain('p-textarea');
            f.componentInstance.focused.set(true);
            textarea.focus();
            textarea.value = '@';
            textarea.setSelectionRange(1, 1);
            textarea.dispatchEvent(new Event('input'));
            await render(f);
            expect(f.nativeElement.querySelector('[role="listbox"]')).not.toBeNull();
            expect(f.nativeElement.querySelector('.p-mention-option')).toBeNull();
            f.destroy();
        });
    });
});
