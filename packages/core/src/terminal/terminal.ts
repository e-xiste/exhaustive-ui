import { afterEveryRender, ChangeDetectionStrategy, Component, effect, ElementRef, HostListener, inject, input, NgModule, signal, ViewEncapsulation, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind } from '@exhaustive-ui/core/bind';
import { TerminalPassThrough } from '@exhaustive-ui/core/types/terminal';
import { TerminalStyle } from './style/terminalstyle';
import { TerminalService } from './terminalservice';

/**
 * Terminal is a text based user interface.
 * @group Components
 */
@Component({
    selector: 'p-terminal',
    imports: [FormsModule, SharedModule, Bind],
    template: `
        @if (welcomeMessage()) {
            <div [class]="cx('welcomeMessage')" [pBind]="ptm('welcomeMessage')">{{ welcomeMessage() }}</div>
        }
        <div [class]="cx('commandList')" [pBind]="ptm('commandList')">
            @for (command of commands(); track command) {
                <div [class]="cx('command')" [pBind]="ptm('command')">
                    <span [class]="cx('promptLabel')" [pBind]="ptm('promptLabel')">{{ prompt() }}</span>
                    <span [class]="cx('commandValue')" [pBind]="ptm('commandValue')">{{ command.text }}</span>
                    <div [class]="cx('commandResponse')" [pBind]="ptm('commandResponse')" [attr.aria-live]="'polite'">{{ command.response }}</div>
                </div>
            }
        </div>
        <div [class]="cx('prompt')" [pBind]="ptm('prompt')">
            <span [class]="cx('promptLabel')" [pBind]="ptm('promptLabel')">{{ prompt() }}</span>
            <input #in type="text" [(ngModel)]="command" [ngModelOptions]="{ standalone: true }" [class]="cx('promptValue')" [pBind]="ptm('promptValue')" autocomplete="off" (keydown)="handleCommand($event)" autofocus />
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TerminalStyle, { provide: PARENT_INSTANCE, useExisting: Terminal }],
    host: {
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class Terminal extends BaseComponent<TerminalPassThrough> {
    terminalService = inject(TerminalService);

    componentName = 'Terminal';

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Initial text to display on terminal.
     * @group Props
     */
    readonly welcomeMessage = input<string | undefined>();
    /**
     * Prompt text for each command.
     * @group Props
     */
    readonly prompt = input<string | undefined>();

    commands = signal<any[]>([]);

    command = signal<string>(undefined!);

    container: Element = this.el.nativeElement;

    commandProcessed = signal<boolean>(undefined!);

    _componentStyle = inject(TerminalStyle);

    readonly inputRef = viewChild.required<ElementRef<HTMLInputElement>>('in');

    @HostListener('click')
    onHostClick() {
        this.focus(this.inputRef().nativeElement);
    }

    constructor() {
        super();
        this.terminalService.responseHandler.pipe(takeUntilDestroyed()).subscribe((response) => {
            this.commands.update((commands) => commands.map((command, index) => (index === commands.length - 1 ? { ...command, response } : command)));
            this.commandProcessed.set(true);
        });
        effect(() => {
            const value = this.response();
            if (value) {
                this.commands.update((commands) => commands.map((command, index) => (index === commands.length - 1 ? { ...command, response: value } : command)));
                this.commandProcessed.set(true);
            }
        });
        this.bindHostAttrs(this.bindDirectiveInstance, () => this.ptms(['host', 'root']));
        afterEveryRender(() => {
            if (this.commandProcessed()) {
                this.container.scrollTop = this.container.scrollHeight;
                this.commandProcessed.set(false);
            }
        });
    }

    readonly response = input<string>();

    handleCommand(event: KeyboardEvent) {
        if (event.keyCode == 13) {
            this.commands.update((commands) => [...commands, { text: this.command() }]);
            this.terminalService.sendCommand(this.command());
            this.command.set('');
        }
    }

    focus(element: HTMLElement) {
        element.focus();
    }
}

@NgModule({
    exports: [Terminal, SharedModule],
    imports: [Terminal, SharedModule]
})
export class TerminalModule {}
