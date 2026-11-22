import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, FormField, minLength } from '@angular/forms/signals';
import type { FileInputItem, FileInputUploadContext } from '@exhaustive-ui/core/types/fileinput';
import { FileInput } from './fileinput';

const file = (name: string, size = 1000, type = '') => new File([new Uint8Array(size)], name, { type });

const flush = () => new Promise((resolve) => setTimeout(resolve));

const deferred = () => {
    let resolve!: (value: any) => void;
    let reject!: (error: any) => void;
    const promise = new Promise<any>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
};

@Component({
    standalone: true,
    imports: [FileInput, FormsModule],
    template: `<p-file [(ngModel)]="files" [multiple]="multiple()" name="files" />`
})
class NgModelHost {
    files: File[] | File | null = [];
    multiple = signal(true);
}

@Component({
    standalone: true,
    imports: [FileInput, ReactiveFormsModule],
    template: `<p-file [formControl]="control" />`
})
class ReactiveHost {
    control = new FormControl<File[]>([], { nonNullable: true, validators: Validators.required });
}

@Component({
    standalone: true,
    imports: [FileInput, FormField],
    template: `<p-file [formField]="f.receipts" />`
})
class SignalFormsHost {
    model = signal<{ receipts: File[] }>({ receipts: [] });
    f = form(this.model, (p) => {
        minLength(p.receipts, 1);
    });
}

@Component({
    standalone: true,
    imports: [FileInput],
    template: `
        <p-file>
            <ng-template #item let-item let-remove="remove">
                <span class="custom-item">{{ item.name }}</span>
                <button class="custom-remove" (click)="remove()">x</button>
            </ng-template>
        </p-file>
    `
})
class TemplateHost {}

describe('FileInput', () => {
    let fixture: ComponentFixture<FileInput>;
    let component: FileInput;
    let host: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FileInput, NgModelHost, ReactiveHost, SignalFormsHost, TemplateHost],
            providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
        }).compileComponents();

        fixture = TestBed.createComponent(FileInput);
        component = fixture.componentInstance;
        host = fixture.nativeElement;
        fixture.detectChanges();
    });

    const render = async () => {
        await fixture.whenStable();
        fixture.detectChanges();
    };

    describe('Rendering', () => {
        it('should render a focusable dropzone with the default label', () => {
            const dropzone = host.querySelector('.p-fileinput-dropzone') as HTMLElement;
            expect(host.classList).toContain('p-fileinput');
            expect(dropzone.getAttribute('role')).toBe('button');
            expect(dropzone.getAttribute('tabindex')).toBe('0');
            expect(dropzone.textContent).toContain('Drop files here or');
            expect(host.querySelector('input[type=file]')?.hasAttribute('multiple')).toBe(true);
        });

        it('should render the hint and link it to the dropzone', async () => {
            fixture.componentRef.setInput('hint', 'PDF only, 5 MB maximum');
            await render();
            const hint = host.querySelector('.p-fileinput-hint') as HTMLElement;
            expect(hint.textContent).toContain('PDF only');
            expect(host.querySelector('.p-fileinput-dropzone')?.getAttribute('aria-describedby')).toBe(hint.id);
        });

        it('should merge custom labels with the defaults', async () => {
            fixture.componentRef.setInput('labels', { dropzone: 'Déposez vos fichiers ou', browse: 'parcourez' });
            await render();
            expect(host.querySelector('.p-fileinput-dropzone')?.textContent).toContain('Déposez vos fichiers ou');
            expect(component.labelOf('remove')).toBe('Remove');
        });

        it('should pass accept, capture and directory to the file input', async () => {
            fixture.componentRef.setInput('accept', 'image/*');
            fixture.componentRef.setInput('capture', 'environment');
            fixture.componentRef.setInput('directory', true);
            await render();
            const input = host.querySelector('input[type=file]') as HTMLInputElement;
            expect(input.getAttribute('accept')).toBe('image/*');
            expect(input.getAttribute('capture')).toBe('environment');
            expect(input.hasAttribute('webkitdirectory')).toBe(true);
        });

        it('should apply the size classes', async () => {
            fixture.componentRef.setInput('size', 'small');
            await render();
            expect(host.classList).toContain('p-fileinput-sm');
        });
    });

    describe('Selection', () => {
        it('should list added files with their size', async () => {
            component.addFiles([file('report.pdf', 2048, 'application/pdf'), file('notes.txt', 10)]);
            await render();
            const rows = host.querySelectorAll('.p-fileinput-item');
            expect(rows.length).toBe(2);
            expect(rows[0].textContent).toContain('report.pdf');
            expect(rows[0].textContent).toContain('2 KB');
            expect(rows[0].querySelector('.p-fileinput-thumbnail')?.textContent?.trim()).toBe('pdf');
        });

        it('should open the file picker from the keyboard', () => {
            const input = host.querySelector('input[type=file]') as HTMLInputElement;
            const click = vi.spyOn(input, 'click').mockImplementation(() => {});
            const dropzone = host.querySelector('.p-fileinput-dropzone') as HTMLElement;
            dropzone.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            dropzone.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
            expect(click).toHaveBeenCalledTimes(2);
        });

        it('should add the files chosen in the file picker', async () => {
            const input = host.querySelector('input[type=file]') as HTMLInputElement;
            const transfer = new DataTransfer();
            transfer.items.add(file('a.txt'));
            input.files = transfer.files;
            input.dispatchEvent(new Event('change'));
            await render();
            expect(component.items().map((item) => item.name)).toEqual(['a.txt']);
        });

        it('should add dropped files and highlight the dropzone while dragging', async () => {
            const dropzone = host.querySelector('.p-fileinput-dropzone') as HTMLElement;
            const transfer = new DataTransfer();
            transfer.items.add(file('dropped.txt'));
            dropzone.dispatchEvent(new DragEvent('dragenter', { dataTransfer: transfer, bubbles: true, cancelable: true }));
            await render();
            expect(dropzone.classList).toContain('p-fileinput-dropzone-active');
            dropzone.dispatchEvent(new DragEvent('drop', { dataTransfer: transfer, bubbles: true, cancelable: true }));
            await flush();
            await render();
            expect(dropzone.classList).not.toContain('p-fileinput-dropzone-active');
            expect(component.items().map((item) => item.name)).toEqual(['dropped.txt']);
        });

        it('should add pasted files and name generic clipboard images', async () => {
            const transfer = new DataTransfer();
            transfer.items.add(file('image.png', 10, 'image/png'));
            const event = new ClipboardEvent('paste', { clipboardData: transfer, bubbles: true, cancelable: true });
            host.dispatchEvent(event);
            await render();
            expect(event.defaultPrevented).toBe(true);
            expect(component.items()[0].name).toMatch(/^paste-\d{14}\.png$/);
        });

        it('should emit onSelect with the added items', () => {
            const spy = vi.fn();
            component.onSelect.subscribe(spy);
            component.addFiles([file('a.txt')]);
            expect(spy).toHaveBeenCalledWith(expect.objectContaining({ items: [expect.objectContaining({ name: 'a.txt', status: 'selected' })] }));
        });

        it('should announce added and rejected files', async () => {
            fixture.componentRef.setInput('accept', '.pdf');
            await render();
            component.addFiles([file('a.pdf'), file('b.exe')]);
            await render();
            expect(host.querySelector('[aria-live]')?.textContent).toContain('2 file(s) added, 1 rejected');
        });

        it('should keep only one file when multiple is false', async () => {
            fixture.componentRef.setInput('multiple', false);
            await render();
            component.addFiles([file('a.txt')]);
            component.addFiles([file('b.txt'), file('c.txt')]);
            expect(component.items().map((item) => item.name)).toEqual(['b.txt']);
            expect(component.modelValue()).toBe(component.items()[0].file);
        });

        it('should not add files when disabled', async () => {
            fixture.componentRef.setInput('disabled', true);
            await render();
            component.addFiles([file('a.txt')]);
            expect(component.items().length).toBe(0);
            expect(host.querySelector('.p-fileinput-dropzone')?.getAttribute('tabindex')).toBe('-1');
        });

        it('should remove a file and announce it', async () => {
            const spy = vi.fn();
            component.onRemove.subscribe(spy);
            component.addFiles([file('a.txt'), file('b.txt')]);
            await render();
            (host.querySelector('.p-fileinput-action[aria-label="Remove a.txt"]') as HTMLButtonElement).click();
            await render();
            expect(component.items().map((item) => item.name)).toEqual(['b.txt']);
            expect(spy).toHaveBeenCalledWith({ item: expect.objectContaining({ name: 'a.txt' }) });
            expect(host.querySelector('[aria-live]')?.textContent).toContain('a.txt removed');
        });

        it('should clear the files', () => {
            component.addFiles([file('a.txt'), file('b.txt')]);
            component.clear();
            expect(component.items().length).toBe(0);
            expect(component.modelValue()).toEqual([]);
        });
    });

    describe('Validation', () => {
        it('should reject a file type that is not accepted', async () => {
            fixture.componentRef.setInput('accept', 'image/*,.pdf');
            await render();
            component.addFiles([file('photo.jpg', 10, 'image/jpeg'), file('doc.PDF'), file('movie.mov', 10, 'video/quicktime')]);
            expect(component.items().map((item) => item.status)).toEqual(['selected', 'selected', 'invalid']);
            expect(component.items()[2].errorCode).toBe('type');
        });

        it('should reject files that are too large or too small', async () => {
            fixture.componentRef.setInput('maxFileSize', 1500);
            fixture.componentRef.setInput('minFileSize', 100);
            await render();
            component.addFiles([file('big.bin', 2000), file('tiny.bin', 10), file('ok.bin', 500)]);
            expect(component.items().map((item) => item.errorCode)).toEqual(['maxFileSize', 'minFileSize', undefined]);
            await render();
            expect(host.querySelector('.p-fileinput-item-error')?.textContent).toContain('Too large');
        });

        it('should reject files over the file limit, counting existing files', async () => {
            fixture.componentRef.setInput('maxFiles', 2);
            fixture.componentRef.setInput('existing', [{ id: 1, name: 'contract.pdf' }]);
            await render();
            component.addFiles([file('a.txt'), file('b.txt')]);
            expect(component.items().map((item) => item.errorCode)).toEqual([undefined, 'maxFiles']);
        });

        it('should reject files over the total size limit', async () => {
            fixture.componentRef.setInput('maxTotalSize', 1500);
            await render();
            component.addFiles([file('a.bin', 1000), file('b.bin', 1000), file('c.bin', 400)]);
            expect(component.items().map((item) => item.errorCode)).toEqual([undefined, 'maxTotalSize', undefined]);
        });

        it('should leave invalid files out of the value', () => {
            fixture.componentRef.setInput('maxFileSize', 100);
            component.addFiles([file('ok.bin', 10), file('big.bin', 1000)]);
            expect((component.modelValue() as File[]).map((f) => f.name)).toEqual(['ok.bin']);
        });

        it('should show the invalid state', async () => {
            fixture.componentRef.setInput('invalid', true);
            await render();
            expect(host.classList).toContain('p-fileinput-invalid');
            expect(host.querySelector('.p-fileinput-dropzone')?.getAttribute('aria-invalid')).toBe('true');
        });
    });

    describe('Upload', () => {
        it('should upload with the handler and report progress', async () => {
            const pending = deferred();
            let context!: FileInputUploadContext;
            fixture.componentRef.setInput('uploadHandler', (_file: File, ctx: FileInputUploadContext) => {
                context = ctx;
                return pending.promise;
            });
            const uploaded = vi.fn();
            const complete = vi.fn();
            component.onUpload.subscribe(uploaded);
            component.onComplete.subscribe(complete);
            await render();

            component.addFiles([file('a.txt', 1000)]);
            expect(component.items()[0].status).toBe('uploading');
            context.progress(40);
            await render();
            expect(host.querySelector('.p-fileinput-item [role=progressbar]')?.getAttribute('aria-valuenow')).toBe('40');
            expect(host.querySelector('.p-fileinput-summary')?.textContent).toContain('0 of 1 uploaded');

            pending.resolve({ id: 42 });
            await flush();
            expect(component.items()[0]).toEqual(expect.objectContaining({ status: 'uploaded', progress: 100, response: { id: 42 } }));
            expect(uploaded).toHaveBeenCalledWith(expect.objectContaining({ response: { id: 42 } }));
            expect(complete).toHaveBeenCalledWith({ uploaded: [expect.objectContaining({ name: 'a.txt' })], failed: [] });
            await render();
            expect(host.querySelector('.p-fileinput-summary')).toBeNull();
            expect(host.querySelector('.p-fileinput-status-done')?.textContent).toContain('Uploaded');
        });

        it('should upload at most `concurrency` files at a time', async () => {
            const calls: ReturnType<typeof deferred>[] = [];
            fixture.componentRef.setInput('concurrency', 2);
            fixture.componentRef.setInput('uploadHandler', () => {
                const d = deferred();
                calls.push(d);
                return d.promise;
            });
            await render();
            component.addFiles([file('a'), file('b'), file('c')]);
            expect(component.items().map((item) => item.status)).toEqual(['uploading', 'uploading', 'queued']);
            calls[0].resolve(null);
            await flush();
            expect(component.items().map((item) => item.status)).toEqual(['uploaded', 'uploading', 'uploading']);
        });

        it('should mark a failed upload and retry it', async () => {
            let attempt = 0;
            fixture.componentRef.setInput('uploadHandler', () => (++attempt === 1 ? Promise.reject(new Error('500')) : Promise.resolve('ok')));
            const errors = vi.fn();
            component.onError.subscribe(errors);
            await render();
            component.addFiles([file('a.txt')]);
            await flush();
            expect(component.items()[0]).toEqual(expect.objectContaining({ status: 'failed', errorCode: 'upload', error: 'Upload failed' }));
            expect(errors).toHaveBeenCalled();
            await render();
            (host.querySelector('.p-fileinput-action[aria-label="Retry a.txt"]') as HTMLButtonElement).click();
            await flush();
            expect(component.items()[0].status).toBe('uploaded');
        });

        it('should abort a canceled upload', async () => {
            let signal!: AbortSignal;
            fixture.componentRef.setInput('uploadHandler', (_f: File, ctx: FileInputUploadContext) => {
                signal = ctx.signal;
                return new Promise(() => {});
            });
            await render();
            component.addFiles([file('a.txt')]);
            await render();
            (host.querySelector('.p-fileinput-action[aria-label="Cancel upload a.txt"]') as HTMLButtonElement).click();
            expect(signal.aborted).toBe(true);
            expect(component.items()[0].status).toBe('canceled');
        });

        it('should wait for upload() when auto is false', async () => {
            const handler = vi.fn(() => Promise.resolve(null));
            fixture.componentRef.setInput('uploadHandler', handler);
            fixture.componentRef.setInput('auto', false);
            await render();
            component.addFiles([file('a.txt')]);
            expect(component.items()[0].status).toBe('selected');
            component.upload();
            expect(handler).toHaveBeenCalledTimes(1);
        });

        it('should post each file to the url with HttpClient', async () => {
            const httpMock = TestBed.inject(HttpTestingController);
            fixture.componentRef.setInput('url', '/api/upload');
            fixture.componentRef.setInput('fieldName', 'document');
            await render();
            component.addFiles([file('a.txt')]);
            const request = httpMock.expectOne('/api/upload');
            expect(request.request.method).toBe('POST');
            expect((request.request.body as FormData).get('document')).toBeInstanceOf(File);
            request.flush({ ok: true });
            expect(component.items()[0]).toEqual(expect.objectContaining({ status: 'uploaded', response: { ok: true } }));
            httpMock.verify();
        });
    });

    describe('Existing files', () => {
        it('should show existing files with download and delete buttons', async () => {
            const removed = vi.fn();
            component.onRemoveExisting.subscribe(removed);
            fixture.componentRef.setInput('existing', [{ id: 7, name: 'contract.pdf', size: 2048, url: '/files/7' }]);
            await render();
            const row = host.querySelector('.p-fileinput-item') as HTMLElement;
            expect(row.getAttribute('data-p-status')).toBe('existing');
            expect(row.querySelector('a.p-fileinput-action')?.getAttribute('href')).toBe('/files/7');
            (row.querySelector('.p-fileinput-action[aria-label="Delete contract.pdf"]') as HTMLButtonElement).click();
            await render();
            expect(removed).toHaveBeenCalledWith({ file: expect.objectContaining({ id: 7 }) });
            expect(host.querySelector('.p-fileinput-item')).toBeNull();
        });
    });

    describe('Images variant', () => {
        beforeEach(async () => {
            fixture.componentRef.setInput('variant', 'images');
            fixture.componentRef.setInput('maxFiles', 2);
            await render();
        });

        it('should render a grid with an add tile and no dropzone', () => {
            expect(host.querySelector('.p-fileinput-dropzone')).toBeNull();
            expect(host.querySelector('.p-fileinput-grid .p-fileinput-add')).not.toBeNull();
        });

        it('should mark the first image as cover and hide the add tile at the limit', async () => {
            component.addFiles([file('a.png', 10, 'image/png'), file('b.png', 10, 'image/png')]);
            await render();
            const tiles = host.querySelectorAll('.p-fileinput-tile');
            expect(tiles.length).toBe(2);
            expect(tiles[0].querySelector('.p-fileinput-cover')?.textContent).toContain('Cover');
            expect(tiles[1].querySelector('.p-fileinput-cover')).toBeNull();
            expect(tiles[0].querySelector('img')?.getAttribute('src')).toMatch(/^blob:/);
            expect(host.querySelector('.p-fileinput-add')).toBeNull();
        });
    });

    describe('Avatar variant', () => {
        beforeEach(async () => {
            fixture.componentRef.setInput('variant', 'avatar');
            await render();
        });

        it('should render a single-file avatar button', () => {
            const avatar = host.querySelector('.p-fileinput-avatar') as HTMLElement;
            expect(avatar.getAttribute('role')).toBe('button');
            expect(avatar.getAttribute('aria-label')).toBe('Add');
            expect(host.querySelector('input[type=file]')?.hasAttribute('multiple')).toBe(false);
        });

        it('should preview the chosen image and replace it', async () => {
            component.addFiles([file('me.png', 10, 'image/png')]);
            component.addFiles([file('me2.png', 10, 'image/png')]);
            await render();
            expect(component.items().length).toBe(1);
            expect(host.querySelector('.p-fileinput-avatar img')?.getAttribute('src')).toMatch(/^blob:/);
            expect(host.querySelector('.p-fileinput-avatar')?.getAttribute('aria-label')).toBe('Change');
            expect(component.modelValue()).toBeInstanceOf(File);
        });

        it('should use the existing image when no file is chosen', async () => {
            fixture.componentRef.setInput('existing', [{ name: 'avatar.jpg', url: '/me.jpg' }]);
            await render();
            expect(host.querySelector('.p-fileinput-avatar img')?.getAttribute('src')).toBe('/me.jpg');
        });
    });

    describe('Forms', () => {
        it('should update ngModel and clear on reset', async () => {
            const hostFixture = TestBed.createComponent(NgModelHost);
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            const input = hostFixture.debugElement.children[0].componentInstance as FileInput;
            input.addFiles([file('a.txt')]);
            expect((hostFixture.componentInstance.files as File[]).map((f) => f.name)).toEqual(['a.txt']);

            hostFixture.componentInstance.files = [];
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            expect(input.items().length).toBe(0);
        });

        it('should show files written by the model', async () => {
            const hostFixture = TestBed.createComponent(NgModelHost);
            hostFixture.componentInstance.files = [file('from-model.txt')];
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            hostFixture.detectChanges();
            expect(hostFixture.nativeElement.querySelector('.p-fileinput-item')?.textContent).toContain('from-model.txt');
        });

        it('should work with a required reactive control', async () => {
            const hostFixture = TestBed.createComponent(ReactiveHost);
            hostFixture.detectChanges();
            const control = hostFixture.componentInstance.control;
            expect(control.valid).toBe(false);
            const input = hostFixture.debugElement.children[0].componentInstance as FileInput;
            input.addFiles([file('a.txt')]);
            expect(control.valid).toBe(true);
            expect(control.touched).toBe(true);
            control.disable();
            hostFixture.detectChanges();
            expect(input.$disabled()).toBe(true);
        });

        it('should work with Signal Forms', async () => {
            const hostFixture = TestBed.createComponent(SignalFormsHost);
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            const field = hostFixture.componentInstance.f.receipts;
            expect(field().invalid()).toBe(true);
            const input = hostFixture.debugElement.children[0].componentInstance as FileInput;
            input.addFiles([file('a.txt')]);
            expect(hostFixture.componentInstance.model().receipts.map((f) => f.name)).toEqual(['a.txt']);
            expect(field().invalid()).toBe(false);
        });
    });

    describe('Templates', () => {
        it('should render the item template with a working remove callback', async () => {
            const hostFixture = TestBed.createComponent(TemplateHost);
            hostFixture.detectChanges();
            const input = hostFixture.debugElement.children[0].componentInstance as FileInput;
            input.addFiles([file('custom.txt')]);
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            hostFixture.detectChanges();
            expect(hostFixture.nativeElement.querySelector('.custom-item')?.textContent).toBe('custom.txt');
            (hostFixture.nativeElement.querySelector('.custom-remove') as HTMLButtonElement).click();
            expect(input.items().length).toBe(0);
        });
    });

    describe('Cleanup', () => {
        it('should revoke previews and abort uploads on destroy', async () => {
            let signal!: AbortSignal;
            fixture.componentRef.setInput('uploadHandler', (_f: File, ctx: FileInputUploadContext) => {
                signal = ctx.signal;
                return new Promise(() => {});
            });
            await render();
            const revoke = vi.spyOn(URL, 'revokeObjectURL');
            component.addFiles([file('a.png', 10, 'image/png')]);
            const preview = (component.items()[0] as FileInputItem).previewUrl;
            fixture.destroy();
            expect(signal.aborted).toBe(true);
            expect(revoke).toHaveBeenCalledWith(preview);
        });
    });
});
