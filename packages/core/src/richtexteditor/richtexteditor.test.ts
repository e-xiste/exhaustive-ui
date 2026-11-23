import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { Extension } from '@tiptap/core';
import type { Editor } from '@tiptap/core';
import { normalizeRichTextEditorLink, RICHTEXTEDITOR_DEFAULT_TOOLBAR, RichTextEditor } from './richtexteditor';

const flush = () => new Promise((resolve) => setTimeout(resolve));

const waitFor = async (predicate: () => unknown, timeout = 3000) => {
    const start = Date.now();
    while (!predicate()) {
        if (Date.now() - start > timeout) {
            throw new Error('waitFor timed out');
        }
        await new Promise((resolve) => setTimeout(resolve, 10));
    }
};

const key = (target: Element, name: string) => target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }));

@Component({
    standalone: true,
    imports: [RichTextEditor, FormsModule],
    template: `<p-rich-text-editor [(ngModel)]="html" name="body" />`
})
class NgModelHost {
    html: string | null = '<p>Hello <strong>world</strong></p>';
}

@Component({
    standalone: true,
    imports: [RichTextEditor, ReactiveFormsModule],
    template: `<p-richtexteditor [formControl]="control" />`
})
class ReactiveHost {
    control = new FormControl<string | null>(null, Validators.required);
}

@Component({
    standalone: true,
    imports: [RichTextEditor, FormField],
    template: `<p-rich-text-editor [formField]="f.body" />`
})
class SignalFormsHost {
    model = signal<{ body: string | null }>({ body: '<p>Draft</p>' });
    f = form(this.model, (p) => {
        required(p.body);
    });
}

@Component({
    standalone: true,
    imports: [RichTextEditor],
    template: `
        <p-rich-text-editor>
            <ng-template #toolbar let-editor let-isActive="isActive" let-disabled="disabled">
                <button type="button" class="custom-bold" [attr.aria-pressed]="isActive('bold')" [disabled]="disabled" (click)="editor?.chain().focus().toggleBold().run()">B</button>
            </ng-template>
        </p-rich-text-editor>
    `
})
class TemplateHost {}

describe('RichTextEditor', () => {
    let fixture: ComponentFixture<RichTextEditor>;
    let component: RichTextEditor;
    let host: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RichTextEditor, NgModelHost, ReactiveHost, SignalFormsHost, TemplateHost],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(RichTextEditor);
        component = fixture.componentInstance;
        host = fixture.nativeElement;
        document.body.appendChild(host);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        host.remove();
    });

    const render = async () => {
        await fixture.whenStable();
        fixture.detectChanges();
    };

    const ready = async () => {
        await waitFor(() => component.editor());
        await render();
        return component.editor()!;
    };

    const editable = () => host.querySelector('.ProseMirror') as HTMLElement;

    const buttons = () => Array.from(host.querySelectorAll<HTMLButtonElement>('.p-richtexteditor-button'));

    const button = (name: string) => host.querySelector<HTMLButtonElement>(`button[data-item="${name}"]`)!;

    describe('Rendering', () => {
        it('renders the root with its classes', () => {
            expect(host.classList).toContain('p-richtexteditor');
            expect(host.classList).toContain('p-component');
            expect(host.classList).toContain('p-richtexteditor-empty');
        });

        it('renders a read only placeholder textbox until Tiptap is loaded', () => {
            const preview = host.querySelector('.p-richtexteditor-editor')!;
            expect(component.ready()).toBe(false);
            expect(preview.getAttribute('role')).toBe('textbox');
            expect(preview.getAttribute('aria-busy')).toBe('true');
            expect(preview.getAttribute('aria-readonly')).toBe('true');
        });

        it('creates the Tiptap editor and emits onInit', async () => {
            const spy = vi.fn();
            fixture.destroy();
            fixture = TestBed.createComponent(RichTextEditor);
            component = fixture.componentInstance;
            host = fixture.nativeElement;
            document.body.appendChild(host);
            component.onEditorInit.subscribe(spy);
            fixture.detectChanges();
            const editor = await ready();
            expect(spy).toHaveBeenCalledWith({ editor });
            expect(component.getEditor()).toBe(editor);
            expect(editable()).toBeTruthy();
            expect(host.querySelectorAll('.p-richtexteditor-editor').length).toBe(1);
        });

        it('renders the default toolbar', async () => {
            await ready();
            const toolbar = host.querySelector('[role="toolbar"]')!;
            expect(toolbar.getAttribute('aria-label')).toBe('Formatting');
            expect(buttons().map((b) => b.dataset['item'])).toEqual(RICHTEXTEDITOR_DEFAULT_TOOLBAR.filter((item) => item !== '|'));
            expect(host.querySelectorAll('[role="separator"]').length).toBe(4);
            expect(toolbar.getAttribute('aria-controls')).toBe(editable().id);
        });

        it('injects no Tiptap stylesheet in styled mode', async () => {
            const editor = await ready();
            expect(editor.options.injectCSS).toBe(false);
        });
    });

    describe('Editable area', () => {
        it('is a multiline textbox with its accessible name', async () => {
            fixture.componentRef.setInput('ariaLabelledBy', 'label-id');
            fixture.componentRef.setInput('ariaDescribedBy', 'hint-id');
            fixture.componentRef.setInput('inputId', 'body');
            await ready();
            await render();
            const el = editable();
            expect(el.getAttribute('role')).toBe('textbox');
            expect(el.getAttribute('aria-multiline')).toBe('true');
            expect(el.getAttribute('aria-labelledby')).toBe('label-id');
            expect(el.getAttribute('aria-describedby')).toBe('hint-id');
            expect(el.id).toBe('body');
            expect(el.classList).toContain('p-richtexteditor-editor');
        });

        it('sets aria-label and updates it', async () => {
            fixture.componentRef.setInput('ariaLabel', 'Message');
            await ready();
            expect(editable().getAttribute('aria-label')).toBe('Message');
            fixture.componentRef.setInput('ariaLabel', 'Answer');
            await render();
            expect(editable().getAttribute('aria-label')).toBe('Answer');
        });

        it('shows the placeholder on the empty first block', async () => {
            fixture.componentRef.setInput('placeholder', 'Write something');
            await ready();
            await render();
            const first = editable().firstElementChild as HTMLElement;
            expect(first.classList).toContain('p-richtexteditor-placeholder');
            expect(first.dataset['placeholder']).toBe('Write something');
            expect(editable().getAttribute('aria-placeholder')).toBe('Write something');
            component.editor()!.commands.insertContent('Hi');
            await render();
            expect(editable().querySelector('.p-richtexteditor-placeholder')).toBeNull();
        });

        it('applies minHeight and maxHeight to the content', async () => {
            fixture.componentRef.setInput('minHeight', '200px');
            fixture.componentRef.setInput('maxHeight', '400px');
            await render();
            const content = host.querySelector('.p-richtexteditor-content') as HTMLElement;
            expect(content.style.minHeight).toBe('200px');
            expect(content.style.maxHeight).toBe('400px');
        });

        it('takes the focus when autofocus is set', async () => {
            fixture.destroy();
            fixture = TestBed.createComponent(RichTextEditor);
            component = fixture.componentInstance;
            host = fixture.nativeElement;
            document.body.appendChild(host);
            fixture.componentRef.setInput('autofocus', true);
            fixture.detectChanges();
            await ready();
            await waitFor(() => document.activeElement === editable());
            expect(component.focused()).toBe(true);
            expect(host.classList).toContain('p-richtexteditor-focus');
        });
    });

    describe('Value', () => {
        it('writes an HTML value', async () => {
            const editor = await ready();
            component.writeValue('<h2>Title</h2><p>Text</p>');
            expect(editor.getHTML()).toBe('<h2>Title</h2><p>Text</p>');
            expect(component.modelValue()).toBe('<h2>Title</h2><p>Text</p>');
        });

        it('keeps a value written before Tiptap is loaded', async () => {
            component.writeValue('<p>Early</p>');
            const editor = await ready();
            expect(editor.getHTML()).toBe('<p>Early</p>');
        });

        it('emits the HTML on change and null when emptied', async () => {
            const change = vi.fn();
            component.registerOnChange(change);
            const editor = await ready();
            editor.commands.insertContent('Hi');
            expect(change).toHaveBeenLastCalledWith('<p>Hi</p>');
            editor.commands.clearContent(true);
            expect(change).toHaveBeenLastCalledWith(null);
            expect(component.empty()).toBe(true);
        });

        it('does not emit for a value written by the form', async () => {
            const change = vi.fn();
            component.registerOnChange(change);
            await ready();
            component.writeValue('<p>From the form</p>');
            expect(change).not.toHaveBeenCalled();
        });

        it('treats an empty string as empty', async () => {
            const editor = await ready();
            component.writeValue('<p>x</p>');
            component.writeValue('');
            expect(editor.isEmpty).toBe(true);
            expect(component.modelValue()).toBeNull();
        });

        it('uses Tiptap JSON with format json', async () => {
            fixture.componentRef.setInput('format', 'json');
            const change = vi.fn();
            component.registerOnChange(change);
            const editor = await ready();
            const doc = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Json' }] }] };
            component.writeValue(doc);
            expect(editor.getText()).toBe('Json');
            component.writeValue({ ...doc });
            editor.commands.insertContent('!');
            const value = change.mock.lastCall![0];
            expect(value.type).toBe('doc');
            expect(value.content[0].content[0].text).toContain('!');
        });

        it('emits onTextChange with html, text and json', async () => {
            const spy = vi.fn();
            component.onTextChange.subscribe(spy);
            const editor = await ready();
            editor.commands.insertContent('Text');
            const event = spy.mock.lastCall![0];
            expect(event.htmlValue).toBe('<p>Text</p>');
            expect(event.textValue).toBe('Text');
            expect(event.jsonValue.type).toBe('doc');
            expect(event.editor).toBe(editor);
        });

        it('emits onSelectionChange', async () => {
            const spy = vi.fn();
            component.onSelectionChange.subscribe(spy);
            const editor = await ready();
            component.writeValue('<p>Select me</p>');
            editor.commands.setTextSelection({ from: 1, to: 7 });
            expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({ from: 1, to: 7, empty: false }));
        });

        it('emits onFocus and onBlur and marks the control touched', async () => {
            const focus = vi.fn();
            const blur = vi.fn();
            const touched = vi.fn();
            component.onFocus.subscribe(focus);
            component.onBlur.subscribe(blur);
            component.registerOnTouched(touched);
            await ready();
            editable().focus();
            await waitFor(() => focus.mock.calls.length);
            editable().blur();
            await waitFor(() => blur.mock.calls.length);
            expect(touched).toHaveBeenCalled();
            expect(focus.mock.lastCall![0].originalEvent).toBeInstanceOf(FocusEvent);
        });
    });

    describe('Toolbar', () => {
        it('toggles bold and reports aria-pressed', async () => {
            const editor = await ready();
            component.writeValue('<p>Bold me</p>');
            editor.commands.setTextSelection({ from: 1, to: 5 });
            await render();
            expect(button('bold').getAttribute('aria-pressed')).toBe('false');
            button('bold').click();
            await render();
            expect(editor.getHTML()).toBe('<p><strong>Bold</strong> me</p>');
            expect(button('bold').getAttribute('aria-pressed')).toBe('true');
            expect(button('bold').classList).toContain('p-richtexteditor-button-active');
        });

        it('runs every block command', async () => {
            fixture.componentRef.setInput('toolbar', ['heading1', 'heading2', 'heading3', 'bulletList', 'orderedList', 'blockquote', 'codeBlock', 'textAlign', 'clear', 'underline', 'strike', 'code', 'italic']);
            const editor = await ready();
            component.writeValue('<p>Line</p>');
            editor.commands.setTextSelection(2);
            await render();
            button('heading2').click();
            expect(editor.isActive('heading', { level: 2 })).toBe(true);
            button('heading2').click();
            expect(editor.isActive('paragraph')).toBe(true);
            button('heading3').click();
            expect(editor.isActive('heading', { level: 3 })).toBe(true);
            button('heading1').click();
            expect(editor.getHTML()).toBe('<h1>Line</h1>');
            await render();
            expect(button('bulletList').getAttribute('aria-disabled')).toBe('true');
            button('heading1').click();
            button('bulletList').click();
            expect(editor.isActive('bulletList')).toBe(true);
            button('orderedList').click();
            expect(editor.isActive('orderedList')).toBe(true);
            button('orderedList').click();
            button('blockquote').click();
            expect(editor.isActive('blockquote')).toBe(true);
            button('blockquote').click();
            button('alignCenter').click();
            await render();
            expect(button('alignCenter').getAttribute('aria-pressed')).toBe('true');
            expect(editor.getHTML()).toContain('text-align: center');
            button('alignCenter').click();
            expect(editor.getHTML()).not.toContain('text-align');
            button('alignJustify').click();
            expect(editor.getHTML()).toContain('text-align: justify');
            button('codeBlock').click();
            expect(editor.isActive('codeBlock')).toBe(true);
            button('codeBlock').click();
            editor.commands.selectAll();
            button('italic').click();
            button('underline').click();
            button('strike').click();
            expect(editor.isActive('italic') && editor.isActive('underline') && editor.isActive('strike')).toBe(true);
            button('clear').click();
            expect(editor.isActive('italic') || editor.isActive('underline') || editor.isActive('strike') || editor.isActive('heading')).toBe(false);
            button('code').click();
            expect(editor.isActive('code')).toBe(true);
        });

        it('disables undo and redo until there is something to undo', async () => {
            const editor = await ready();
            expect(button('undo').getAttribute('aria-disabled')).toBe('true');
            editor.commands.insertContent('Typed');
            await render();
            expect(button('undo').getAttribute('aria-disabled')).toBeNull();
            button('undo').click();
            expect(editor.isEmpty).toBe(true);
            await render();
            expect(button('redo').getAttribute('aria-disabled')).toBeNull();
            button('redo').click();
            expect(editor.getText()).toBe('Typed');
        });

        it('expands textAlign, drops duplicates and stray separators', async () => {
            fixture.componentRef.setInput('toolbar', ['|', 'bold', 'bold', '|', '|', 'textAlign', 'unknown' as any, '|']);
            await ready();
            expect(buttons().map((b) => b.dataset['item'])).toEqual(['bold', 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify']);
            expect(host.querySelectorAll('[role="separator"]').length).toBe(1);
        });

        it('hides the toolbar with an empty list', async () => {
            fixture.componentRef.setInput('toolbar', []);
            await ready();
            expect(host.querySelector('[role="toolbar"]')).toBeNull();
        });

        it('labels the buttons with their shortcut', async () => {
            await ready();
            expect(button('bold').getAttribute('aria-label')).toBe('Bold');
            expect(button('bold').getAttribute('title')).toMatch(/^Bold \((Ctrl\+B|⌘B)\)$/);
            expect(button('bold').getAttribute('aria-keyshortcuts')).toMatch(/^(Control|Meta)\+B$/);
            expect(button('link').getAttribute('aria-haspopup')).toBe('dialog');
            expect(button('link').getAttribute('aria-expanded')).toBe('false');
            expect(button('undo').hasAttribute('aria-pressed')).toBe(false);
        });

        it('replaces the texts with labels', async () => {
            fixture.componentRef.setInput('labels', { toolbar: 'Mise en forme', bold: 'Gras' });
            await ready();
            expect(host.querySelector('[role="toolbar"]')!.getAttribute('aria-label')).toBe('Mise en forme');
            expect(button('bold').getAttribute('aria-label')).toBe('Gras');
            expect(button('italic').getAttribute('aria-label')).toBe('Italic');
        });

        it('keeps the selection when a button is pressed with the mouse', async () => {
            await ready();
            const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
            button('bold').dispatchEvent(event);
            expect(event.defaultPrevented).toBe(true);
        });

        it('renders a toolbar template with the editor in its context', async () => {
            const hostFixture = TestBed.createComponent(TemplateHost);
            document.body.appendChild(hostFixture.nativeElement);
            hostFixture.detectChanges();
            const rte = hostFixture.debugElement.children[0].componentInstance as RichTextEditor;
            await waitFor(() => rte.editor());
            await hostFixture.whenStable();
            hostFixture.detectChanges();
            const custom = hostFixture.nativeElement.querySelector('.custom-bold') as HTMLButtonElement;
            expect(hostFixture.nativeElement.querySelector('[role="toolbar"]')).toBeNull();
            rte.writeValue('<p>abc</p>');
            rte.editor()!.commands.selectAll();
            custom.click();
            await hostFixture.whenStable();
            hostFixture.detectChanges();
            expect(rte.editor()!.getHTML()).toBe('<p><strong>abc</strong></p>');
            expect(custom.getAttribute('aria-pressed')).toBe('true');
            hostFixture.destroy();
        });
    });

    describe('Keyboard', () => {
        it('uses a roving tabindex', async () => {
            await ready();
            const all = buttons();
            expect(all.filter((b) => b.tabIndex === 0).length).toBe(1);
            expect(all[0].tabIndex).toBe(0);
        });

        it('moves between buttons with the arrow keys, Home and End', async () => {
            await ready();
            const all = buttons();
            all[0].focus();
            key(all[0], 'ArrowRight');
            expect(document.activeElement).toBe(all[1]);
            await render();
            expect(all[1].tabIndex).toBe(0);
            expect(all[0].tabIndex).toBe(-1);
            key(all[1], 'ArrowLeft');
            expect(document.activeElement).toBe(all[0]);
            key(all[0], 'ArrowLeft');
            expect(document.activeElement).toBe(all.at(-1));
            key(all.at(-1)!, 'ArrowRight');
            expect(document.activeElement).toBe(all[0]);
            key(all[0], 'End');
            expect(document.activeElement).toBe(all.at(-1));
            key(all.at(-1)!, 'Home');
            expect(document.activeElement).toBe(all[0]);
        });

        it('reverses the arrow keys in right-to-left', async () => {
            host.setAttribute('dir', 'rtl');
            await ready();
            const all = buttons();
            all[0].focus();
            key(all[0], 'ArrowLeft');
            expect(document.activeElement).toBe(all[1]);
        });

        it('returns to the editable area with Escape', async () => {
            await ready();
            buttons()[0].focus();
            key(buttons()[0], 'Escape');
            await waitFor(() => document.activeElement === editable());
        });

        it('keeps the focus on a button activated from the keyboard', async () => {
            const editor = await ready();
            component.writeValue('<p>Key</p>');
            editor.commands.selectAll();
            button('italic').focus();
            button('italic').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }));
            expect(editor.isActive('italic')).toBe(true);
            expect(document.activeElement).toBe(button('italic'));
        });

        it('moves to the toolbar with Alt+F10', async () => {
            await ready();
            editable().focus();
            editable().dispatchEvent(new KeyboardEvent('keydown', { key: 'F10', code: 'F10', altKey: true, bubbles: true, cancelable: true }));
            expect(document.activeElement).toBe(buttons()[0]);
        });

        it('opens the link panel with Mod+K', async () => {
            await ready();
            editable().focus();
            const mac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
            editable().dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: !mac, metaKey: mac, bubbles: true, cancelable: true }));
            await render();
            expect(component.linkOpen()).toBe(true);
        });
    });

    describe('Link', () => {
        const openPanel = async () => {
            const editor = await ready();
            component.writeValue('<p>Visit the site</p>');
            editor.commands.setTextSelection({ from: 11, to: 15 });
            button('link').click();
            await render();
            await waitFor(() => document.activeElement === host.querySelector('.p-richtexteditor-link-input'));
            return editor;
        };

        const type = (value: string) => {
            const input = host.querySelector('.p-richtexteditor-link-input') as HTMLInputElement;
            input.value = value;
            input.dispatchEvent(new Event('input'));
            return input;
        };

        it('opens a labelled dialog with the focus in the URL field', async () => {
            await openPanel();
            const panel = host.querySelector('[role="dialog"]')!;
            expect(panel.getAttribute('aria-label')).toBe('Link');
            const input = panel.querySelector('input')!;
            expect(panel.querySelector(`label[for="${input.id}"]`)).toBeTruthy();
            expect(button('link').getAttribute('aria-expanded')).toBe('true');
        });

        it('applies a link with Enter, adding https', async () => {
            const editor = await openPanel();
            const input = type('example.com');
            key(input, 'Enter');
            await render();
            expect(editor.getHTML()).toBe('<p>Visit the <a rel="noopener noreferrer nofollow" href="https://example.com">site</a></p>');
            expect(component.linkOpen()).toBe(false);
        });

        it('rejects an unsafe URL', async () => {
            const editor = await openPanel();
            type('javascript:alert(1)');
            (host.querySelector('.p-richtexteditor-link-apply') as HTMLButtonElement).click();
            await render();
            const input = host.querySelector('.p-richtexteditor-link-input')!;
            expect(input.getAttribute('aria-invalid')).toBe('true');
            expect(host.querySelector(`#${input.getAttribute('aria-describedby')}`)!.textContent).toContain('valid URL');
            expect(editor.getHTML()).not.toContain('<a');
            type('https://ok.dev');
            await render();
            expect(input.getAttribute('aria-invalid')).toBeNull();
        });

        it('edits and removes an existing link', async () => {
            const editor = await ready();
            component.writeValue('<p><a href="https://a.dev">link</a></p>');
            editor.commands.setTextSelection(2);
            component.openLink();
            await render();
            const input = host.querySelector('.p-richtexteditor-link-input') as HTMLInputElement;
            expect(input.value).toBe('https://a.dev');
            (host.querySelector('.p-richtexteditor-link-remove') as HTMLButtonElement).click();
            await render();
            expect(editor.getHTML()).toBe('<p>link</p>');
        });

        it('inserts the URL as text when nothing is selected', async () => {
            const editor = await ready();
            component.writeValue('<p></p>');
            editor.commands.focus('end');
            component.openLink();
            await render();
            type('mail@example.com');
            component.applyLink();
            expect(editor.getHTML()).toContain('<a rel="noopener noreferrer nofollow" href="mailto:mail@example.com">mail@example.com</a>');
        });

        it('closes with Escape and returns the focus to the editable area', async () => {
            await openPanel();
            key(host.querySelector('.p-richtexteditor-link-input')!, 'Escape');
            await render();
            expect(host.querySelector('[role="dialog"]')).toBeNull();
            await waitFor(() => document.activeElement === editable());
        });

        it('closes when the focus leaves the panel', async () => {
            await openPanel();
            const outside = document.createElement('button');
            document.body.appendChild(outside);
            outside.focus();
            await render();
            expect(component.linkOpen()).toBe(false);
            outside.remove();
        });

        it('removes the link when the URL is emptied', async () => {
            const editor = await ready();
            component.writeValue('<p><a href="https://a.dev">link</a></p>');
            editor.commands.setTextSelection(2);
            component.openLink();
            await render();
            type('  ');
            component.applyLink();
            expect(editor.getHTML()).toBe('<p>link</p>');
        });

        it('normalizes the typed URL', () => {
            expect(normalizeRichTextEditorLink('https://a.dev/x?y#z')).toBe('https://a.dev/x?y#z');
            expect(normalizeRichTextEditorLink('a.dev')).toBe('https://a.dev');
            expect(normalizeRichTextEditorLink('www.a.dev/path')).toBe('https://www.a.dev/path');
            expect(normalizeRichTextEditorLink('me@a.dev')).toBe('mailto:me@a.dev');
            expect(normalizeRichTextEditorLink('mailto:me@a.dev')).toBe('mailto:me@a.dev');
            expect(normalizeRichTextEditorLink('tel:+33123')).toBe('tel:+33123');
            expect(normalizeRichTextEditorLink('/docs')).toBe('/docs');
            expect(normalizeRichTextEditorLink('#top')).toBe('#top');
            expect(normalizeRichTextEditorLink('javascript:alert(1)')).toBeNull();
            expect(normalizeRichTextEditorLink('JavaScript:alert(1)')).toBeNull();
            expect(normalizeRichTextEditorLink('data:text/html,x')).toBeNull();
            expect(normalizeRichTextEditorLink('vbscript:x')).toBeNull();
            expect(normalizeRichTextEditorLink('not a url')).toBeNull();
            expect(normalizeRichTextEditorLink('word')).toBeNull();
            expect(normalizeRichTextEditorLink('https:')).toBeNull();
        });
    });

    describe('States', () => {
        it('is read only', async () => {
            fixture.componentRef.setInput('readonly', true);
            const editor = await ready();
            await render();
            expect(editor.isEditable).toBe(false);
            expect(editable().getAttribute('contenteditable')).toBe('false');
            expect(editable().getAttribute('aria-readonly')).toBe('true');
            expect(editable().getAttribute('tabindex')).toBe('0');
            expect(host.querySelector('[role="toolbar"]')).toBeNull();
            expect(host.classList).toContain('p-richtexteditor-readonly');
        });

        it('is disabled', async () => {
            fixture.componentRef.setInput('disabled', true);
            const editor = await ready();
            await render();
            expect(editor.isEditable).toBe(false);
            expect(editable().getAttribute('aria-disabled')).toBe('true');
            expect(editable().hasAttribute('tabindex')).toBe(false);
            expect(host.classList).toContain('p-disabled');
            expect(host.querySelector('[role="toolbar"]')!.getAttribute('aria-disabled')).toBe('true');
            component.openLink();
            expect(component.linkOpen()).toBe(false);
        });

        it('becomes editable again', async () => {
            fixture.componentRef.setInput('disabled', true);
            const editor = await ready();
            fixture.componentRef.setInput('disabled', false);
            await render();
            expect(editor.isEditable).toBe(true);
            expect(buttons().some((b) => b.disabled)).toBe(false);
        });

        it('is invalid and required', async () => {
            fixture.componentRef.setInput('invalid', true);
            fixture.componentRef.setInput('required', true);
            await ready();
            await render();
            expect(host.classList).toContain('p-invalid');
            expect(editable().getAttribute('aria-invalid')).toBe('true');
            expect(editable().getAttribute('aria-required')).toBe('true');
        });

        it('is fluid, filled, small and large', async () => {
            fixture.componentRef.setInput('fluid', true);
            fixture.componentRef.setInput('variant', 'filled');
            fixture.componentRef.setInput('size', 'small');
            await render();
            expect(host.classList).toContain('p-richtexteditor-fluid');
            expect(host.classList).toContain('p-richtexteditor-filled');
            expect(host.classList).toContain('p-richtexteditor-sm');
            fixture.componentRef.setInput('size', 'large');
            await render();
            expect(host.classList).toContain('p-richtexteditor-lg');
            expect(host.getAttribute('data-p')).toContain('large');
        });
    });

    describe('Character limit', () => {
        it('stops typing at maxLength and announces it', async () => {
            fixture.componentRef.setInput('maxLength', 5);
            fixture.componentRef.setInput('showCount', true);
            const editor = await ready();
            editor.commands.insertContent('abc');
            editor.commands.insertContent('def');
            expect(editor.getText()).toBe('abc');
            editor.commands.insertContent('de');
            await render();
            expect(editor.getText()).toBe('abcde');
            const count = host.querySelector('.p-richtexteditor-count')!;
            expect(count.textContent!.trim()).toBe('5 / 5');
            expect(count.classList).toContain('p-richtexteditor-count-limit');
            expect(editable().getAttribute('aria-describedby')).toBe(count.id);
            editor.commands.insertContent('x');
            await waitFor(() => host.querySelector('[aria-live="polite"]')!.textContent!.includes('Limit of 5'));
        });

        it('trims a paste to the limit', async () => {
            fixture.componentRef.setInput('maxLength', 4);
            const editor = await ready();
            editor.view.dispatch(editor.state.tr.insertText('123456').setMeta('paste', true));
            expect(editor.getText()).toBe('1234');
        });

        it('lets the form write a longer value and allows deleting', async () => {
            fixture.componentRef.setInput('maxLength', 3);
            const editor = await ready();
            component.writeValue('<p>abcdef</p>');
            expect(editor.getText()).toBe('abcdef');
            editor.commands.deleteRange({ from: 1, to: 2 });
            expect(editor.getText()).toBe('bcdef');
        });

        it('counts without a limit', async () => {
            fixture.componentRef.setInput('showCount', true);
            const editor = await ready();
            editor.commands.insertContent('hello');
            await render();
            expect(host.querySelector('.p-richtexteditor-count')!.textContent!.trim()).toBe('5 characters');
        });
    });

    describe('Extensions', () => {
        it('adds custom Tiptap extensions', async () => {
            const custom = Extension.create({ name: 'custom', addStorage: () => ({ ok: true }) });
            fixture.componentRef.setInput('extensions', [custom]);
            const editor = await ready();
            expect(editor.extensionManager.extensions.some((extension) => extension.name === 'custom')).toBe(true);
        });

        it('includes StarterKit, links and text alignment', async () => {
            const editor = await ready();
            const names = editor.extensionManager.extensions.map((extension) => extension.name);
            ['bold', 'italic', 'underline', 'strike', 'code', 'heading', 'bulletList', 'orderedList', 'blockquote', 'codeBlock', 'link', 'textAlign', 'undoRedo'].forEach((name) => expect(names).toContain(name));
        });
    });

    describe('Forms', () => {
        it('works with ngModel', async () => {
            const hostFixture = TestBed.createComponent(NgModelHost);
            document.body.appendChild(hostFixture.nativeElement);
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            const rte = hostFixture.debugElement.children[0].componentInstance as RichTextEditor;
            await waitFor(() => rte.editor());
            const editor = rte.editor()!;
            expect(editor.getHTML()).toBe('<p>Hello <strong>world</strong></p>');
            editor.commands.setContent('<p>Changed</p>', { emitUpdate: true });
            expect(hostFixture.componentInstance.html).toBe('<p>Changed</p>');
            hostFixture.componentInstance.html = '<p>From model</p>';
            hostFixture.changeDetectorRef.markForCheck();
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            expect(editor.getHTML()).toBe('<p>From model</p>');
            hostFixture.destroy();
        });

        it('works with reactive forms', async () => {
            const hostFixture = TestBed.createComponent(ReactiveHost);
            document.body.appendChild(hostFixture.nativeElement);
            hostFixture.detectChanges();
            const rte = hostFixture.debugElement.children[0].componentInstance as RichTextEditor;
            await waitFor(() => rte.editor());
            const control = hostFixture.componentInstance.control;
            expect(control.valid).toBe(false);
            rte.editor()!.commands.insertContent('Body');
            expect(control.value).toBe('<p>Body</p>');
            expect(control.valid).toBe(true);
            control.disable();
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            expect(rte.editor()!.isEditable).toBe(false);
            control.enable();
            control.setValue('<p>Set</p>');
            expect(rte.editor()!.getHTML()).toBe('<p>Set</p>');
            hostFixture.destroy();
        });

        it('works with Signal Forms', async () => {
            const hostFixture = TestBed.createComponent(SignalFormsHost);
            document.body.appendChild(hostFixture.nativeElement);
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            const rte = hostFixture.debugElement.children[0].componentInstance as RichTextEditor;
            await waitFor(() => rte.editor());
            const editor = rte.editor()!;
            expect(editor.getHTML()).toBe('<p>Draft</p>');
            editor.commands.clearContent(true);
            expect(hostFixture.componentInstance.model().body).toBeNull();
            expect(hostFixture.componentInstance.f.body().invalid()).toBe(true);
            editor.commands.insertContent('Final');
            expect(hostFixture.componentInstance.model().body).toBe('<p>Final</p>');
            expect(hostFixture.componentInstance.f.body().valid()).toBe(true);
            hostFixture.componentInstance.model.set({ body: '<p>Reset</p>' });
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            await flush();
            expect(editor.getHTML()).toBe('<p>Reset</p>');
            hostFixture.destroy();
        });
    });

    describe('Pass-through and unstyled', () => {
        it('passes attributes through pt', async () => {
            fixture.componentRef.setInput('pt', { root: { 'data-test': 'root' }, toolbar: { 'data-test': 'toolbar' }, button: { 'data-test': 'button' }, content: { 'data-test': 'content' } });
            await ready();
            await render();
            expect(host.getAttribute('data-test')).toBe('root');
            expect(host.querySelector('.p-richtexteditor-toolbar')!.getAttribute('data-test')).toBe('toolbar');
            expect(buttons()[0].getAttribute('data-test')).toBe('button');
            expect(host.querySelector('.p-richtexteditor-content')!.getAttribute('data-test')).toBe('content');
        });

        it('renders without classes when unstyled and lets Tiptap inject its base styles', async () => {
            fixture.destroy();
            fixture = TestBed.createComponent(RichTextEditor);
            component = fixture.componentInstance;
            host = fixture.nativeElement;
            document.body.appendChild(host);
            fixture.componentRef.setInput('unstyled', true);
            fixture.detectChanges();
            const editor = await ready();
            expect(host.classList).not.toContain('p-richtexteditor');
            expect(host.querySelector('.p-richtexteditor-button')).toBeNull();
            expect(host.querySelectorAll('button[data-item]').length).toBeGreaterThan(0);
            expect(editor.options.injectCSS).toBe(true);
        });
    });

    describe('Lifecycle', () => {
        it('destroys the editor with the component', async () => {
            const editor: Editor = await ready();
            fixture.destroy();
            expect(editor.isDestroyed).toBe(true);
        });

        it('does not create the editor after an early destroy', async () => {
            const early = TestBed.createComponent(RichTextEditor);
            early.detectChanges();
            const instance = early.componentInstance;
            early.destroy();
            await flush();
            await new Promise((resolve) => setTimeout(resolve, 100));
            expect(instance.editor()).toBeUndefined();
        });
    });
});
