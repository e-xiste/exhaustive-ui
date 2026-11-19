import { ChangeDetectionStrategy, Component, DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { provideExhaustive } from '@exhaustive-ui/core/config';
import { Terminal } from './terminal';
import { TerminalService } from './terminalservice';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: ` <p-terminal [welcomeMessage]="welcomeMessage" [prompt]="prompt" [class]="customClass" [style]="style" [response]="response"> </p-terminal> `
})
class TestBasicTerminalComponent {
    welcomeMessage: string | undefined = 'Welcome to Exhaustive Terminal';
    prompt: string | undefined = 'prime$ ';
    customClass: string | undefined;
    style: { [key: string]: any } | undefined;
    response: string | undefined;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: ` <p-terminal welcomeMessage="System Ready" prompt="system> "> </p-terminal> `
})
class TestStaticPropsTerminalComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: ` <p-terminal [style]="customStyle" class="custom-terminal"> </p-terminal> `
})
class TestStyledTerminalComponent {
    customStyle = {
        border: '2px solid blue',
        backgroundColor: '#000',
        color: '#fff'
    };
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: ` <p-terminal></p-terminal> `
})
class TestMinimalTerminalComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: ` <p-terminal welcomeMessage="Interactive Terminal" prompt="cmd> "> </p-terminal> `
})
class TestInteractiveTerminalComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: ` <p-terminal [welcomeMessage]="message" [prompt]="commandPrompt"> </p-terminal> `
})
class TestDynamicTerminalComponent {
    message = 'Dynamic Welcome';
    commandPrompt = 'dynamic$ ';
}

describe('Terminal', () => {
    let component: TestBasicTerminalComponent;
    let fixture: ComponentFixture<TestBasicTerminalComponent>;
    let terminalElement: DebugElement;
    let terminalInstance: Terminal;
    let terminalService: TerminalService;

    const welcomeMessageElement = (f: ComponentFixture<unknown> = fixture) => f.debugElement.query(By.css('.p-terminal-welcome-message'));
    const promptLabelElements = (f: ComponentFixture<unknown> = fixture) => f.debugElement.queryAll(By.css('.p-terminal-prompt-label'));
    const commandElements = (f: ComponentFixture<unknown> = fixture) => f.debugElement.queryAll(By.css('.p-terminal-command'));
    const commandResponseElements = (f: ComponentFixture<unknown> = fixture) => f.debugElement.queryAll(By.css('.p-terminal-command-response'));

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestBasicTerminalComponent, TestStaticPropsTerminalComponent, TestStyledTerminalComponent, TestMinimalTerminalComponent, TestInteractiveTerminalComponent, TestDynamicTerminalComponent],
            imports: [Terminal, FormsModule],
            providers: [TerminalService, provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestBasicTerminalComponent);
        component = fixture.componentInstance;
        terminalElement = fixture.debugElement.query(By.directive(Terminal));
        terminalInstance = terminalElement.componentInstance;
        terminalService = TestBed.inject(TerminalService);
        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create the component', () => {
            expect(terminalInstance).toBeTruthy();
        });

        it('should have required dependencies injected', () => {
            expect(terminalInstance.terminalService).toBeTruthy();
            expect(terminalInstance._componentStyle).toBeTruthy();
            expect(terminalInstance).toBeInstanceOf(Terminal);
        });

        it('should have default values', () => {
            const freshFixture = TestBed.createComponent(TestMinimalTerminalComponent);
            freshFixture.detectChanges();

            const freshTerminal = freshFixture.debugElement.query(By.directive(Terminal)).componentInstance as Terminal;

            expect(freshTerminal.welcomeMessage()).toBeUndefined();
            expect(freshTerminal.prompt()).toBeUndefined();
            expect(freshTerminal.response()).toBeUndefined();
            expect(freshTerminal.commands()).toEqual([]);
            expect(freshTerminal.command()).toBeUndefined();
            expect(freshTerminal.commandProcessed()).toBeUndefined();
            expect(freshTerminal.container).toBe(freshFixture.debugElement.query(By.directive(Terminal)).nativeElement);
        });

        it('should accept custom values', async () => {
            component.welcomeMessage = 'Custom Welcome';
            component.prompt = 'custom$ ';
            component.customClass = 'custom-class';
            component.style = { color: 'red' };
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(terminalInstance.welcomeMessage()).toBe('Custom Welcome');
            expect(terminalInstance.prompt()).toBe('custom$ ');
            expect(terminalElement.nativeElement.classList.contains('custom-class')).toBe(true);
        });

        it('should initialize commands array', () => {
            expect(terminalInstance.commands()).toBeDefined();
            expect(Array.isArray(terminalInstance.commands())).toBe(true);
            expect(terminalInstance.commands().length).toBe(0);
        });

        it('should stop handling service responses once destroyed', () => {
            terminalInstance.commands.set([{ text: 'test command' }]);
            fixture.destroy();

            expect(() => terminalService.sendResponse('Late response')).not.toThrow();
            expect(terminalInstance.commands()[0].response).toBeUndefined();
            expect(terminalInstance.commandProcessed()).toBeUndefined();
        });

        it('should have input reference after view init', () => {
            expect(terminalInstance.inputRef()).toBeTruthy();
            expect(terminalInstance.inputRef().nativeElement.tagName.toLowerCase()).toBe('input');
        });
    });

    describe('Input Properties', () => {
        it('should update welcomeMessage input', async () => {
            component.welcomeMessage = 'Updated Welcome';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();
            expect(terminalInstance.welcomeMessage()).toBe('Updated Welcome');
        });

        it('should update prompt input', async () => {
            component.prompt = 'new> ';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();
            expect(terminalInstance.prompt()).toBe('new> ');
        });

        it('should update the host class when the class binding changes', async () => {
            component.customClass = 'test-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();
            expect(terminalElement.nativeElement.classList.contains('test-class')).toBe(true);
            expect(terminalElement.nativeElement.classList.contains('p-terminal')).toBe(true);

            component.customClass = 'other-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();
            expect(terminalElement.nativeElement.classList.contains('other-class')).toBe(true);
            expect(terminalElement.nativeElement.classList.contains('test-class')).toBe(false);
            expect(terminalElement.nativeElement.classList.contains('p-terminal')).toBe(true);
        });

        it('should handle undefined inputs', async () => {
            component.welcomeMessage = undefined as any;
            component.prompt = undefined as any;
            component.customClass = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(terminalInstance.welcomeMessage()).toBeUndefined();
            expect(terminalInstance.prompt()).toBeUndefined();
            expect(terminalElement.nativeElement.classList.contains('p-terminal')).toBe(true);
        });

        it('should handle empty string inputs', async () => {
            component.welcomeMessage = '';
            component.prompt = '';
            component.customClass = '';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(terminalInstance.welcomeMessage()).toBe('' as any);
            expect(terminalInstance.prompt()).toBe('' as any);
            expect(terminalElement.nativeElement.classList.contains('p-terminal')).toBe(true);
        });
    });

    describe('Welcome Message Display', () => {
        it('should display welcome message when provided', async () => {
            component.welcomeMessage = 'Test Welcome Message';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(welcomeMessageElement()).toBeTruthy();
            expect(welcomeMessageElement().nativeElement.textContent.trim()).toBe('Test Welcome Message');
        });

        it('should not display welcome message element when not provided', async () => {
            component.welcomeMessage = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(welcomeMessageElement()).toBeNull();
            const welcomeElements = fixture.debugElement.queryAll(By.css('div'));
            const hasWelcomeMessage = welcomeElements.some((el) => el.nativeElement.textContent && el.nativeElement.textContent.includes('Welcome'));
            expect(hasWelcomeMessage).toBe(false);
        });

        it('should update welcome message when changed', async () => {
            component.welcomeMessage = 'Initial Message';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();
            expect(terminalInstance.welcomeMessage()).toBe('Initial Message');
            expect(welcomeMessageElement().nativeElement.textContent.trim()).toBe('Initial Message');

            component.welcomeMessage = 'Updated Message';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();
            expect(terminalInstance.welcomeMessage()).toBe('Updated Message');
            expect(welcomeMessageElement().nativeElement.textContent.trim()).toBe('Updated Message');
        });

        it('should handle special characters in welcome message', async () => {
            const specialMessage = 'Welcome! @#$%^&*()_+{}:"<>?[]\\;\',./ 🚀';
            component.welcomeMessage = specialMessage;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(terminalInstance.welcomeMessage()).toBe(specialMessage);
            expect(welcomeMessageElement().nativeElement.textContent.trim()).toBe(specialMessage);
        });
    });

    describe('Prompt Display', () => {
        it('should display prompt in command line', async () => {
            component.prompt = 'test> ';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const promptElement = promptLabelElements().at(-1);
            expect(promptElement).toBeTruthy();
            expect(promptElement!.nativeElement.textContent.trim()).toBe('test>');
        });

        it('should handle empty prompt', async () => {
            component.prompt = '';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();
            expect(terminalInstance.prompt()).toBe('' as any);
            expect(promptLabelElements().at(-1)!.nativeElement.textContent.trim()).toBe('');
        });

        it('should handle undefined prompt', async () => {
            component.prompt = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();
            expect(terminalInstance.prompt()).toBeUndefined();
            expect(promptLabelElements().at(-1)!.nativeElement.textContent.trim()).toBe('');
        });

        it('should update prompt when changed', async () => {
            component.prompt = 'initial$ ';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();
            expect(terminalInstance.prompt()).toBe('initial$ ');
            expect(promptLabelElements().at(-1)!.nativeElement.textContent.trim()).toBe('initial$');

            component.prompt = 'updated> ';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();
            expect(terminalInstance.prompt()).toBe('updated> ');
            expect(promptLabelElements().at(-1)!.nativeElement.textContent.trim()).toBe('updated>');
        });
    });

    describe('Command Handling Tests', () => {
        it('should handle Enter key press', () => {
            vi.spyOn(terminalInstance, 'handleCommand');
            vi.spyOn(terminalService, 'sendCommand').mockImplementation(() => {});

            const inputElement = fixture.debugElement.query(By.css('input'));
            terminalInstance.command.set('test command');

            const enterEvent = new KeyboardEvent('keydown', { keyCode: 13 });
            inputElement.nativeElement.dispatchEvent(enterEvent);

            expect(terminalInstance.handleCommand).toHaveBeenCalled();
        });

        it('should add command to commands array on Enter', () => {
            vi.spyOn(terminalService, 'sendCommand').mockImplementation(() => {});

            terminalInstance.command.set('ls -la');
            const enterEvent = new KeyboardEvent('keydown', { keyCode: 13 });
            terminalInstance.handleCommand(enterEvent);

            expect(terminalInstance.commands().length).toBe(1);
            expect(terminalInstance.commands()[0].text).toBe('ls -la');
        });

        it('should render the executed command on Enter', async () => {
            vi.spyOn(terminalService, 'sendCommand').mockImplementation(() => {});

            terminalInstance.command.set('ls -la');
            terminalInstance.handleCommand(new KeyboardEvent('keydown', { keyCode: 13 }));
            await fixture.whenStable();

            expect(commandElements().length).toBe(1);
            expect(commandElements()[0].query(By.css('.p-terminal-command-value')).nativeElement.textContent).toBe('ls -la');
        });

        it('should send command to terminal service', () => {
            vi.spyOn(terminalService, 'sendCommand').mockImplementation(() => {});

            terminalInstance.command.set('pwd');
            const enterEvent = new KeyboardEvent('keydown', { keyCode: 13 });
            terminalInstance.handleCommand(enterEvent);

            expect(terminalService.sendCommand).toHaveBeenCalledWith('pwd');
        });

        it('should clear command input after Enter', async () => {
            vi.spyOn(terminalService, 'sendCommand').mockImplementation(() => {});

            terminalInstance.command.set('clear');
            const enterEvent = new KeyboardEvent('keydown', { keyCode: 13 });
            terminalInstance.handleCommand(enterEvent);

            expect(terminalInstance.command()).toBe('' as any);
            await fixture.whenStable();
            expect(terminalInstance.inputRef().nativeElement.value).toBe('');
        });

        it('should not process command on other key press', () => {
            vi.spyOn(terminalService, 'sendCommand').mockImplementation(() => {});
            const initialCommandsLength = terminalInstance.commands().length;

            terminalInstance.command.set('test');
            const escapeEvent = new KeyboardEvent('keydown', { keyCode: 27 }); // Escape key
            terminalInstance.handleCommand(escapeEvent);

            expect(terminalService.sendCommand).not.toHaveBeenCalled();
            expect(terminalInstance.commands().length).toBe(initialCommandsLength);
            expect(terminalInstance.command()).toBe('test'); // Should not be cleared
        });

        it('should handle empty command', () => {
            vi.spyOn(terminalService, 'sendCommand').mockImplementation(() => {});

            terminalInstance.command.set('');
            const enterEvent = new KeyboardEvent('keydown', { keyCode: 13 });
            terminalInstance.handleCommand(enterEvent);

            expect(terminalInstance.commands().length).toBe(1);
            expect(terminalInstance.commands()[0].text).toBe('' as any);
            expect(terminalService.sendCommand).toHaveBeenCalledWith('');
        });

        it('should handle multiple commands', () => {
            vi.spyOn(terminalService, 'sendCommand').mockImplementation(() => {});

            // First command
            terminalInstance.command.set('command1');
            let enterEvent = new KeyboardEvent('keydown', { keyCode: 13 });
            terminalInstance.handleCommand(enterEvent);

            // Second command
            terminalInstance.command.set('command2');
            enterEvent = new KeyboardEvent('keydown', { keyCode: 13 });
            terminalInstance.handleCommand(enterEvent);

            expect(terminalInstance.commands().length).toBe(2);
            expect(terminalInstance.commands()[0].text).toBe('command1');
            expect(terminalInstance.commands()[1].text).toBe('command2');
            expect(terminalService.sendCommand).toHaveBeenCalledTimes(2);
        });

        it('should sync the typed value from the input into command', async () => {
            const inputElement = terminalInstance.inputRef().nativeElement;
            inputElement.value = 'typed command';
            inputElement.dispatchEvent(new Event('input'));
            await fixture.whenStable();

            expect(terminalInstance.command()).toBe('typed command');
        });
    });

    describe('Terminal Service Integration', () => {
        it('should handle response from service', async () => {
            // Add a command first
            terminalInstance.commands.update((commands) => [...commands, { text: 'test command' }]);

            // Send response
            terminalService.sendResponse('Command output');

            expect(terminalInstance.commands()[0].response).toBe('Command output');
            expect(terminalInstance.commandProcessed()).toBe(true);

            await fixture.whenStable();
            expect(commandResponseElements()[0].nativeElement.textContent).toBe('Command output');
        });

        it('should handle multiple responses', async () => {
            // Add commands
            terminalInstance.commands.update((commands) => [...commands, { text: 'command1' }]);
            terminalInstance.commands.update((commands) => [...commands, { text: 'command2' }]);

            // Send first response
            terminalService.sendResponse('Response 1');
            await fixture.whenStable();
            expect(terminalInstance.commands()[1].response).toBe('Response 1');
            expect(commandResponseElements()[1].nativeElement.textContent).toBe('Response 1');

            // Add another command and send response
            terminalInstance.commands.update((commands) => [...commands, { text: 'command3' }]);
            terminalService.sendResponse('Response 2');
            await fixture.whenStable();
            expect(terminalInstance.commands()[2].response).toBe('Response 2');
            expect(commandResponseElements()[2].nativeElement.textContent).toBe('Response 2');
        });

        it('should set response via the response input', async () => {
            terminalInstance.commands.update((commands) => [...commands, { text: 'test' }]);

            component.response = 'Direct response';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(terminalInstance.response()).toBe('Direct response');
            expect(terminalInstance.commands()[0].response).toBe('Direct response');
            expect(terminalInstance.commandProcessed()).toBe(false);
            expect(commandResponseElements()[0].nativeElement.textContent).toBe('Direct response');
        });

        it('should not set response when value is empty', async () => {
            terminalInstance.commands.update((commands) => [...commands, { text: 'test' }]);
            terminalInstance.commandProcessed.set(false);

            component.response = '';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(terminalInstance.commands()[0].response).toBeUndefined();
            expect(terminalInstance.commandProcessed()).toBe(false);
        });
    });

    describe('Focus Management', () => {
        it('should have focus method', () => {
            expect(typeof terminalInstance.focus).toBe('function');
        });

        it('should focus input element', () => {
            const inputElement = terminalInstance.inputRef().nativeElement;
            vi.spyOn(inputElement, 'focus').mockImplementation(() => {});

            terminalInstance.focus(inputElement);

            expect(inputElement.focus).toHaveBeenCalled();
        });

        it('should focus on host click', () => {
            vi.spyOn(terminalInstance, 'focus').mockImplementation(() => {});

            terminalElement.nativeElement.click();

            expect(terminalInstance.focus).toHaveBeenCalledWith(terminalInstance.inputRef().nativeElement);
        });

        it('should handle focus when input ref is null', () => {
            const mockElement = document.createElement('input');
            vi.spyOn(mockElement, 'focus').mockImplementation(() => {});

            terminalInstance.focus(mockElement);

            expect(mockElement.focus).toHaveBeenCalled();
        });
    });

    describe('Lifecycle Methods', () => {
        it('should use the host element as the scroll container', () => {
            expect(terminalInstance.container).toBe(terminalElement.nativeElement);
        });

        it('should scroll to bottom after command processed', async () => {
            // Mock container and scrolling
            const mockContainer = {
                scrollTop: 0,
                scrollHeight: 1000
            };
            terminalInstance.container = mockContainer as any;
            terminalInstance.commandProcessed.set(true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(mockContainer.scrollTop).toBe(1000);
            expect(terminalInstance.commandProcessed()).toBe(false);
        });

        it('should not scroll when command not processed', async () => {
            const mockContainer = {
                scrollTop: 0,
                scrollHeight: 1000
            };
            terminalInstance.container = mockContainer as any;
            terminalInstance.commandProcessed.set(false);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(mockContainer.scrollTop).toBe(0);
            expect(terminalInstance.commandProcessed()).toBe(false);
        });

        it('should scroll to bottom after a service response is rendered', async () => {
            const mockContainer = {
                scrollTop: 0,
                scrollHeight: 1000
            };
            terminalInstance.container = mockContainer as any;
            terminalInstance.commands.set([{ text: 'ls' }]);

            terminalService.sendResponse('file1.txt');
            await fixture.whenStable();

            expect(mockContainer.scrollTop).toBe(1000);
            expect(terminalInstance.commandProcessed()).toBe(false);
        });
    });

    describe('CSS Classes and Styling', () => {
        it('should apply a custom class to root element', async () => {
            component.customClass = 'custom-terminal-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const rootElement = fixture.debugElement.query(By.directive(Terminal));
            expect(rootElement.nativeElement.classList.contains('custom-terminal-class')).toBe(true);
            expect(rootElement.nativeElement.classList.contains('p-terminal')).toBe(true);
            expect(rootElement.nativeElement.classList.contains('p-component')).toBe(true);
        });

        it('should apply custom styles', () => {
            const styleFixture = TestBed.createComponent(TestStyledTerminalComponent);
            const styleComponent = styleFixture.componentInstance;
            styleFixture.detectChanges();

            const element = styleFixture.debugElement.query(By.directive(Terminal)).nativeElement;

            expect(styleComponent.customStyle).toEqual({
                border: '2px solid blue',
                backgroundColor: '#000',
                color: '#fff'
            });

            // Simulate ngStyle behavior
            if (styleComponent.customStyle) {
                Object.keys(styleComponent.customStyle).forEach((key) => {
                    element.style[key] = styleComponent.customStyle[key];
                });
            }

            expect(element.style.border).toBe('2px solid blue');
            // CSS colors are often converted to rgb format in test environment
            expect(element.style.backgroundColor).toMatch(/(#000|rgb\(0, 0, 0\))/);
            expect(element.style.color).toMatch(/(#fff|rgb\(255, 255, 255\))/);
        });

        it('should combine multiple CSS classes correctly', async () => {
            component.customClass = 'class1 class2';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const rootElement = fixture.debugElement.query(By.directive(Terminal));
            expect(rootElement.nativeElement.classList.contains('class1')).toBe(true);
            expect(rootElement.nativeElement.classList.contains('class2')).toBe(true);
        });

        it('should have input element with correct attributes', () => {
            const inputElement = fixture.debugElement.query(By.css('input'));

            expect(inputElement).toBeTruthy();
            expect(inputElement.nativeElement.type).toBe('text');
            expect(inputElement.nativeElement.getAttribute('autocomplete')).toBe('off');
            expect(inputElement.nativeElement.hasAttribute('autofocus')).toBe(true);
        });

        it('should render command list container', async () => {
            // Add some commands
            terminalInstance.commands.set([
                { text: 'ls', response: 'file1.txt file2.txt' },
                { text: 'pwd', response: '/home/user' }
            ]);
            await fixture.whenStable();

            expect(fixture.debugElement.query(By.css('.p-terminal-command-list'))).toBeTruthy();
            expect(commandElements().length).toBe(2);
        });
    });

    describe('Command History Display', () => {
        it('should display executed commands', async () => {
            terminalInstance.commands.set([
                { text: 'ls', response: 'file1.txt' },
                { text: 'pwd', response: '/home/user' }
            ]);
            component.prompt = '$ ';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Verify commands are in the component
            expect(terminalInstance.commands().length).toBe(2);
            expect(terminalInstance.commands()[0].text).toBe('ls');
            expect(terminalInstance.commands()[0].response).toBe('file1.txt');

            const rendered = commandElements();
            expect(rendered.length).toBe(2);
            expect(rendered[0].query(By.css('.p-terminal-prompt-label')).nativeElement.textContent).toBe('$ ');
            expect(rendered[0].query(By.css('.p-terminal-command-value')).nativeElement.textContent).toBe('ls');
            expect(rendered[1].query(By.css('.p-terminal-command-value')).nativeElement.textContent).toBe('pwd');
        });

        it('should display command responses', async () => {
            terminalInstance.commands.set([{ text: 'echo hello', response: 'hello' }]);
            await fixture.whenStable();

            expect(terminalInstance.commands()[0].response).toBe('hello');
            expect(commandResponseElements()[0].nativeElement.textContent).toBe('hello');
        });

        it('should handle commands without responses', async () => {
            terminalInstance.commands.set([{ text: 'command without response' }]);
            await fixture.whenStable();

            expect(terminalInstance.commands()[0].response).toBeUndefined();
            expect(commandResponseElements()[0].nativeElement.textContent).toBe('');
        });

        it('should display multiple command responses correctly', async () => {
            terminalInstance.commands.set([
                { text: 'echo first', response: 'first output' },
                { text: 'echo second', response: 'second output' },
                { text: 'echo third', response: 'third output' }
            ]);
            await fixture.whenStable();

            expect(terminalInstance.commands()[0].response).toBe('first output');
            expect(terminalInstance.commands()[1].response).toBe('second output');
            expect(terminalInstance.commands()[2].response).toBe('third output');
            expect(commandResponseElements().map((el) => el.nativeElement.textContent)).toEqual(['first output', 'second output', 'third output']);
        });
    });

    describe('Edge Cases', () => {
        it('should handle null/undefined commands', () => {
            terminalInstance.command.set(null as any);
            const enterEvent = new KeyboardEvent('keydown', { keyCode: 13 });

            expect(() => terminalInstance.handleCommand(enterEvent)).not.toThrow();
        });

        it('should handle very long commands', () => {
            const longCommand = 'a'.repeat(10000);
            terminalInstance.command.set(longCommand);
            const enterEvent = new KeyboardEvent('keydown', { keyCode: 13 });

            vi.spyOn(terminalService, 'sendCommand').mockImplementation(() => {});
            terminalInstance.handleCommand(enterEvent);

            expect(terminalInstance.commands()[0].text).toBe(longCommand);
            expect(terminalService.sendCommand).toHaveBeenCalledWith(longCommand);
        });

        it('should handle special characters in commands', () => {
            const specialCommand = 'echo "Hello @#$%^&*()[]{}|\\:";\'<>?,./`~';
            terminalInstance.command.set(specialCommand);
            const enterEvent = new KeyboardEvent('keydown', { keyCode: 13 });

            vi.spyOn(terminalService, 'sendCommand').mockImplementation(() => {});
            terminalInstance.handleCommand(enterEvent);

            expect(terminalInstance.commands()[0].text).toBe(specialCommand);
            expect(terminalService.sendCommand).toHaveBeenCalledWith(specialCommand);
        });

        it('should handle rapid command execution', () => {
            vi.spyOn(terminalService, 'sendCommand').mockImplementation(() => {});

            for (let i = 0; i < 10; i++) {
                terminalInstance.command.set(`command${i}`);
                const enterEvent = new KeyboardEvent('keydown', { keyCode: 13 });
                terminalInstance.handleCommand(enterEvent);
            }

            expect(terminalInstance.commands().length).toBe(10);
            expect(terminalService.sendCommand).toHaveBeenCalledTimes(10);
        });

        it('should ignore a service response when no command was sent', () => {
            expect(() => terminalService.sendResponse('orphan response')).not.toThrow();

            expect(terminalInstance.commands()).toEqual([]);
        });

        it('should handle component creation and destruction gracefully', () => {
            expect(() => {
                const tempFixture = TestBed.createComponent(TestBasicTerminalComponent);
                tempFixture.detectChanges();
                const tempInstance = tempFixture.debugElement.query(By.directive(Terminal)).componentInstance;
                expect(tempInstance).toBeTruthy();
                tempFixture.destroy();
            }).not.toThrow();
        });

        it('should handle multiple instances independently', async () => {
            const fixture1 = TestBed.createComponent(TestBasicTerminalComponent);
            const fixture2 = TestBed.createComponent(TestBasicTerminalComponent);

            fixture1.componentInstance.welcomeMessage = 'Terminal 1';
            fixture1.componentInstance.prompt = '1> ';
            fixture1.changeDetectorRef.markForCheck();
            await fixture1.whenStable();
            fixture1.detectChanges();

            fixture2.componentInstance.welcomeMessage = 'Terminal 2';
            fixture2.componentInstance.prompt = '2> ';
            fixture2.changeDetectorRef.markForCheck();
            await fixture2.whenStable();
            fixture2.detectChanges();

            const instance1 = fixture1.debugElement.query(By.directive(Terminal)).componentInstance as Terminal;
            const instance2 = fixture2.debugElement.query(By.directive(Terminal)).componentInstance as Terminal;

            expect(instance1.welcomeMessage()).toBe('Terminal 1');
            expect(instance1.prompt()).toBe('1> ');
            expect(instance2.welcomeMessage()).toBe('Terminal 2');
            expect(instance2.prompt()).toBe('2> ');
            expect(instance1).not.toBe(instance2);
            expect(welcomeMessageElement(fixture1).nativeElement.textContent.trim()).toBe('Terminal 1');
            expect(welcomeMessageElement(fixture2).nativeElement.textContent.trim()).toBe('Terminal 2');
        });
    });

    describe('Integration Tests', () => {
        it('should work with static properties', () => {
            const staticFixture = TestBed.createComponent(TestStaticPropsTerminalComponent);
            staticFixture.detectChanges();

            const staticTerminal = staticFixture.debugElement.query(By.directive(Terminal)).componentInstance as Terminal;

            expect(staticTerminal.welcomeMessage()).toBe('System Ready');
            expect(staticTerminal.prompt()).toBe('system> ');
            expect(welcomeMessageElement(staticFixture).nativeElement.textContent.trim()).toBe('System Ready');
            expect(promptLabelElements(staticFixture).at(-1)!.nativeElement.textContent).toBe('system> ');
        });

        it('should work with styled component', () => {
            const styleFixture = TestBed.createComponent(TestStyledTerminalComponent);
            styleFixture.detectChanges();

            const rootElement = styleFixture.debugElement.query(By.directive(Terminal));

            expect(rootElement.nativeElement.classList.contains('custom-terminal')).toBe(true);
            expect(rootElement.nativeElement.classList.contains('p-terminal')).toBe(true);
        });

        it('should maintain state across property changes', async () => {
            component.welcomeMessage = 'Initial';
            component.prompt = 'init> ';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(terminalInstance.welcomeMessage()).toBe('Initial');
            expect(terminalInstance.prompt()).toBe('init> ');

            component.welcomeMessage = 'Updated';
            component.prompt = 'update> ';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(terminalInstance.welcomeMessage()).toBe('Updated');
            expect(terminalInstance.prompt()).toBe('update> ');
        });

        it('should work with dynamic properties', async () => {
            const dynamicFixture = TestBed.createComponent(TestDynamicTerminalComponent);
            const dynamicComponent = dynamicFixture.componentInstance;
            dynamicFixture.detectChanges();

            const dynamicTerminal = dynamicFixture.debugElement.query(By.directive(Terminal)).componentInstance as Terminal;

            expect(dynamicTerminal.welcomeMessage()).toBe('Dynamic Welcome');
            expect(dynamicTerminal.prompt()).toBe('dynamic$ ');
            expect(welcomeMessageElement(dynamicFixture).nativeElement.textContent.trim()).toBe('Dynamic Welcome');

            // Update properties dynamically
            dynamicComponent.message = 'Changed Welcome';
            dynamicComponent.commandPrompt = 'changed> ';
            dynamicFixture.changeDetectorRef.markForCheck();
            await dynamicFixture.whenStable();
            dynamicFixture.detectChanges();

            expect(dynamicTerminal.welcomeMessage()).toBe('Changed Welcome');
            expect(dynamicTerminal.prompt()).toBe('changed> ');
            expect(welcomeMessageElement(dynamicFixture).nativeElement.textContent.trim()).toBe('Changed Welcome');
            expect(promptLabelElements(dynamicFixture).at(-1)!.nativeElement.textContent).toBe('changed> ');
        });

        it('should handle complete workflow', async () => {
            vi.spyOn(terminalService, 'sendCommand');

            // Set up terminal
            component.welcomeMessage = 'Test Terminal';
            component.prompt = 'test> ';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            // Execute command
            terminalInstance.command.set('ls -la');
            const enterEvent = new KeyboardEvent('keydown', { keyCode: 13 });
            terminalInstance.handleCommand(enterEvent);

            expect(terminalInstance.commands().length).toBe(1);
            expect(terminalInstance.commands()[0].text).toBe('ls -la');

            // Simulate response
            terminalService.sendResponse('total 8\ndrwxr-xr-x  2 user user 4096 Jan  1 12:00 .\ndrwxr-xr-x  3 user user 4096 Jan  1 12:00 ..');

            expect(terminalInstance.commands()[0].response).toBe('total 8\ndrwxr-xr-x  2 user user 4096 Jan  1 12:00 .\ndrwxr-xr-x  3 user user 4096 Jan  1 12:00 ..');
            expect(terminalInstance.commandProcessed()).toBe(true);

            await fixture.whenStable();
            expect(commandElements().length).toBe(1);
            expect(commandElements()[0].query(By.css('.p-terminal-prompt-label')).nativeElement.textContent).toBe('test> ');
            expect(commandElements()[0].query(By.css('.p-terminal-command-value')).nativeElement.textContent).toBe('ls -la');
            expect(commandResponseElements()[0].nativeElement.textContent).toBe('total 8\ndrwxr-xr-x  2 user user 4096 Jan  1 12:00 .\ndrwxr-xr-x  3 user user 4096 Jan  1 12:00 ..');
            expect(terminalInstance.commandProcessed()).toBe(false);
        });
    });

    describe('Public Methods', () => {
        it('should have handleCommand method', () => {
            expect(typeof terminalInstance.handleCommand).toBe('function');
        });

        it('should have focus method', () => {
            expect(typeof terminalInstance.focus).toBe('function');
        });

        it('should call handleCommand programmatically', () => {
            vi.spyOn(terminalService, 'sendCommand').mockImplementation(() => {});

            terminalInstance.command.set('programmatic command');
            const mockEvent = new KeyboardEvent('keydown', { keyCode: 13 });
            terminalInstance.handleCommand(mockEvent);

            expect(terminalService.sendCommand).toHaveBeenCalledWith('programmatic command');
            expect(terminalInstance.commands().length).toBe(1);
        });

        it('should call focus method programmatically', () => {
            const mockElement = document.createElement('input');
            vi.spyOn(mockElement, 'focus').mockImplementation(() => {});

            terminalInstance.focus(mockElement);

            expect(mockElement.focus).toHaveBeenCalled();
        });

        it('should apply a changed response input to the latest command only', async () => {
            terminalInstance.commands.set([{ text: 'first' }, { text: 'second' }]);

            component.response = 'Test Response';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(terminalInstance.commands()[0].response).toBeUndefined();
            expect(terminalInstance.commands()[1].response).toBe('Test Response');
            expect(commandResponseElements().map((el) => el.nativeElement.textContent)).toEqual(['', 'Test Response']);

            component.response = 'Second Response';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(terminalInstance.commands()[1].response).toBe('Second Response');
            expect(commandResponseElements()[1].nativeElement.textContent).toBe('Second Response');
        });
    });

    describe('PT (PassThrough) Tests', () => {
        describe('Case 1: Simple string classes', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `<p-terminal [pt]="pt" welcomeMessage="Welcome" prompt="$ "></p-terminal>`
            })
            class TestPTCase1Component {
                pt = {
                    host: 'HOST_CLASS',
                    root: 'ROOT_CLASS',
                    welcomeMessage: 'WELCOME_CLASS',
                    commandList: 'COMMANDLIST_CLASS',
                    command: 'COMMAND_CLASS',
                    promptLabel: 'PROMPTLABEL_CLASS',
                    commandValue: 'COMMANDVALUE_CLASS',
                    commandResponse: 'COMMANDRESPONSE_CLASS',
                    prompt: 'PROMPT_CLASS',
                    promptValue: 'PROMPTVALUE_CLASS'
                };
            }

            it('should apply simple string classes to all PT sections', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase1Component],
                    imports: [Terminal, FormsModule],
                    providers: [TerminalService, provideZonelessChangeDetection()]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase1Component);
                testFixture.detectChanges();

                const hostElement = testFixture.debugElement.query(By.directive(Terminal)).nativeElement;
                expect(hostElement.classList.contains('HOST_CLASS')).toBe(true);
                expect(hostElement.classList.contains('ROOT_CLASS')).toBe(true);

                const welcomeMessage = testFixture.debugElement.query(By.css('[data-pc-section="welcomeMessage"]'));
                if (welcomeMessage) {
                    expect(welcomeMessage.nativeElement.classList.contains('WELCOME_CLASS')).toBe(true);
                }

                const commandList = testFixture.debugElement.query(By.css('[data-pc-section="commandList"]'));
                if (commandList) {
                    expect(commandList.nativeElement.classList.contains('COMMANDLIST_CLASS')).toBe(true);
                }

                const prompt = testFixture.debugElement.query(By.css('[data-pc-section="prompt"]'));
                if (prompt) {
                    expect(prompt.nativeElement.classList.contains('PROMPT_CLASS')).toBe(true);
                }

                const promptValue = testFixture.debugElement.query(By.css('[data-pc-section="promptValue"]'));
                if (promptValue) {
                    expect(promptValue.nativeElement.classList.contains('PROMPTVALUE_CLASS')).toBe(true);
                }
            });
        });

        describe('Case 2: Objects with class, style, data attributes and aria-label', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `<p-terminal [pt]="pt" welcomeMessage="Welcome" prompt="$ "></p-terminal>`
            })
            class TestPTCase2Component {
                pt = {
                    root: {
                        class: 'ROOT_OBJECT_CLASS',
                        style: { 'background-color': 'red' },
                        'data-p-test': true,
                        'aria-label': 'TEST_ARIA_LABEL'
                    },
                    welcomeMessage: {
                        class: 'WELCOME_OBJECT_CLASS',
                        style: { color: 'blue' },
                        'data-p-welcome': true
                    },
                    prompt: {
                        class: 'PROMPT_OBJECT_CLASS',
                        style: { padding: '10px' }
                    }
                };
            }

            it('should apply object properties (class, style, data attributes) to PT sections', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase2Component],
                    imports: [Terminal, FormsModule],
                    providers: [TerminalService, provideZonelessChangeDetection()]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase2Component);
                testFixture.detectChanges();

                const hostElement = testFixture.debugElement.query(By.directive(Terminal)).nativeElement;
                expect(hostElement.classList.contains('ROOT_OBJECT_CLASS')).toBe(true);
                expect(hostElement.style.backgroundColor).toBe('red');
                expect(hostElement.getAttribute('data-p-test')).toBe('true');
                expect(hostElement.getAttribute('aria-label')).toBe('TEST_ARIA_LABEL');

                const welcomeMessage = testFixture.debugElement.query(By.css('[data-pc-section="welcomeMessage"]'));
                if (welcomeMessage) {
                    expect(welcomeMessage.nativeElement.classList.contains('WELCOME_OBJECT_CLASS')).toBe(true);
                    expect(welcomeMessage.nativeElement.style.color).toBe('blue');
                    expect(welcomeMessage.nativeElement.getAttribute('data-p-welcome')).toBe('true');
                }

                const prompt = testFixture.debugElement.query(By.css('[data-pc-section="prompt"]'));
                if (prompt) {
                    expect(prompt.nativeElement.classList.contains('PROMPT_OBJECT_CLASS')).toBe(true);
                    expect(prompt.nativeElement.style.padding).toBe('10px');
                }
            });
        });

        describe('Case 3: Mixed object and string values', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `<p-terminal [pt]="pt" welcomeMessage="Welcome" prompt="$ "></p-terminal>`
            })
            class TestPTCase3Component {
                pt = {
                    root: {
                        class: 'ROOT_MIXED_CLASS'
                    },
                    welcomeMessage: 'WELCOME_STRING_CLASS',
                    prompt: {
                        class: 'PROMPT_MIXED_CLASS'
                    },
                    promptValue: 'PROMPTVALUE_STRING_CLASS'
                };
            }

            it('should apply mixed object and string values correctly', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase3Component],
                    imports: [Terminal, FormsModule],
                    providers: [TerminalService, provideZonelessChangeDetection()]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase3Component);
                testFixture.detectChanges();

                const hostElement = testFixture.debugElement.query(By.directive(Terminal)).nativeElement;
                expect(hostElement.classList.contains('ROOT_MIXED_CLASS')).toBe(true);

                const welcomeMessage = testFixture.debugElement.query(By.css('[data-pc-section="welcomeMessage"]'));
                if (welcomeMessage) {
                    expect(welcomeMessage.nativeElement.classList.contains('WELCOME_STRING_CLASS')).toBe(true);
                }

                const prompt = testFixture.debugElement.query(By.css('[data-pc-section="prompt"]'));
                if (prompt) {
                    expect(prompt.nativeElement.classList.contains('PROMPT_MIXED_CLASS')).toBe(true);
                }

                const promptValue = testFixture.debugElement.query(By.css('[data-pc-section="promptValue"]'));
                if (promptValue) {
                    expect(promptValue.nativeElement.classList.contains('PROMPTVALUE_STRING_CLASS')).toBe(true);
                }
            });
        });

        describe('Case 4: Use variables from instance', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `<p-terminal [pt]="pt" [welcomeMessage]="welcomeMsg" [prompt]="promptText"></p-terminal>`
            })
            class TestPTCase4Component {
                welcomeMsg = 'Instance Welcome';
                promptText = 'cmd> ';
                pt = {
                    root: ({ instance }: any) => {
                        return {
                            class: instance?.welcomeMessage() ? 'HAS-WELCOME' : 'NO-WELCOME'
                        };
                    },
                    welcomeMessage: ({ instance }: any) => {
                        return {
                            style: {
                                'background-color': instance?.welcomeMessage() ? 'yellow' : 'transparent'
                            }
                        };
                    },
                    prompt: ({ instance }: any) => {
                        return {
                            class: instance?.prompt() ? 'HAS_PROMPT_CLASS' : 'NO_PROMPT_CLASS'
                        };
                    }
                };
            }

            it('should use instance variables in PT functions', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase4Component],
                    imports: [Terminal, FormsModule],
                    providers: [TerminalService, provideZonelessChangeDetection()]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase4Component);
                testFixture.detectChanges();

                const hostElement = testFixture.debugElement.query(By.directive(Terminal)).nativeElement;
                expect(hostElement.classList.contains('HAS-WELCOME')).toBe(true);

                const welcomeMessage = testFixture.debugElement.query(By.css('[data-pc-section="welcomeMessage"]'));
                if (welcomeMessage) {
                    expect(welcomeMessage.nativeElement.style.backgroundColor).toBe('yellow');
                }

                const prompt = testFixture.debugElement.query(By.css('[data-pc-section="prompt"]'));
                if (prompt) {
                    expect(prompt.nativeElement.classList.contains('HAS_PROMPT_CLASS')).toBe(true);
                }
            });
        });

        describe('Case 5: Event binding', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `<p-terminal [pt]="pt" welcomeMessage="Welcome" prompt="$ "></p-terminal>`
            })
            class TestPTCase5Component {
                clickedSection: string = '';
                pt = {
                    welcomeMessage: {
                        onclick: () => {
                            this.clickedSection = 'welcomeMessage';
                        }
                    },
                    prompt: {
                        onclick: () => {
                            this.clickedSection = 'prompt';
                        }
                    }
                };
            }

            it('should bind click events through PT', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase5Component],
                    imports: [Terminal, FormsModule],
                    providers: [TerminalService, provideZonelessChangeDetection()]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase5Component);
                const component = testFixture.componentInstance;
                testFixture.detectChanges();

                const welcomeMessage = testFixture.debugElement.query(By.css('[data-pc-section="welcomeMessage"]'));
                if (welcomeMessage) {
                    welcomeMessage.nativeElement.click();
                    expect(component.clickedSection).toBe('welcomeMessage');
                }

                const prompt = testFixture.debugElement.query(By.css('[data-pc-section="prompt"]'));
                if (prompt) {
                    prompt.nativeElement.click();
                    expect(component.clickedSection).toBe('prompt');
                }
            });
        });

        describe('Case 6: Inline test', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `<p-terminal [pt]="{ root: 'INLINE_ROOT_CLASS', welcomeMessage: 'INLINE_WELCOME_CLASS' }" welcomeMessage="Welcome" prompt="$ "></p-terminal>`
            })
            class TestPTCase6InlineComponent {}

            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `<p-terminal [pt]="{ root: { class: 'INLINE_ROOT_OBJECT_CLASS' }, prompt: { class: 'INLINE_PROMPT_CLASS' } }" prompt="$ "></p-terminal>`
            })
            class TestPTCase6InlineObjectComponent {}

            it('should apply inline PT string classes', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase6InlineComponent],
                    imports: [Terminal, FormsModule],
                    providers: [TerminalService, provideZonelessChangeDetection()]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase6InlineComponent);
                testFixture.detectChanges();

                const hostElement = testFixture.debugElement.query(By.directive(Terminal)).nativeElement;
                expect(hostElement.classList.contains('INLINE_ROOT_CLASS')).toBe(true);

                const welcomeMessage = testFixture.debugElement.query(By.css('[data-pc-section="welcomeMessage"]'));
                if (welcomeMessage) {
                    expect(welcomeMessage.nativeElement.classList.contains('INLINE_WELCOME_CLASS')).toBe(true);
                }
            });

            it('should apply inline PT object classes', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase6InlineObjectComponent],
                    imports: [Terminal, FormsModule],
                    providers: [TerminalService, provideZonelessChangeDetection()]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase6InlineObjectComponent);
                testFixture.detectChanges();

                const hostElement = testFixture.debugElement.query(By.directive(Terminal)).nativeElement;
                expect(hostElement.classList.contains('INLINE_ROOT_OBJECT_CLASS')).toBe(true);

                const prompt = testFixture.debugElement.query(By.css('[data-pc-section="prompt"]'));
                if (prompt) {
                    expect(prompt.nativeElement.classList.contains('INLINE_PROMPT_CLASS')).toBe(true);
                }
            });
        });

        describe('Case 7: Test from ExhaustiveConfig', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `
                    <p-terminal welcomeMessage="Terminal 1" prompt="1$ "></p-terminal>
                    <p-terminal welcomeMessage="Terminal 2" prompt="2$ "></p-terminal>
                `
            })
            class TestPTCase7GlobalComponent {}

            it('should apply global PT configuration from ExhaustiveConfig to multiple instances', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase7GlobalComponent],
                    imports: [Terminal, FormsModule],
                    providers: [
                        TerminalService,
                        provideZonelessChangeDetection(),
                        provideExhaustive({
                            pt: {
                                terminal: {
                                    host: { 'aria-label': 'TEST_GLOBAL_ARIA_LABEL' },
                                    root: { class: 'GLOBAL_ROOT_CLASS' },
                                    welcomeMessage: { class: 'GLOBAL_WELCOME_CLASS' }
                                }
                            }
                        })
                    ]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase7GlobalComponent);
                testFixture.detectChanges();

                const terminals = testFixture.debugElement.queryAll(By.directive(Terminal));
                expect(terminals.length).toBe(2);

                terminals.forEach((terminalDebug) => {
                    const hostElement = terminalDebug.nativeElement;
                    expect(hostElement.getAttribute('aria-label')).toBe('TEST_GLOBAL_ARIA_LABEL');
                    expect(hostElement.classList.contains('GLOBAL_ROOT_CLASS')).toBe(true);

                    const welcomeMessage = terminalDebug.query(By.css('[data-pc-section="welcomeMessage"]'));
                    if (welcomeMessage) {
                        expect(welcomeMessage.nativeElement.classList.contains('GLOBAL_WELCOME_CLASS')).toBe(true);
                    }
                });
            });
        });

        describe('Case 8: Test hooks', () => {
            @Component({
                changeDetection: ChangeDetectionStrategy.Eager,
                standalone: false,
                template: `<p-terminal [pt]="pt" welcomeMessage="Welcome" prompt="$ "></p-terminal>`
            })
            class TestPTCase8HooksComponent {
                afterViewInitCalled = false;
                afterViewCheckedCalled = false;
                onDestroyCalled = false;

                pt = {
                    root: 'HOOK_TEST_CLASS',
                    hooks: {
                        onAfterViewInit: () => {
                            this.afterViewInitCalled = true;
                        },
                        onAfterViewChecked: () => {
                            this.afterViewCheckedCalled = true;
                        },
                        onDestroy: () => {
                            this.onDestroyCalled = true;
                        }
                    }
                };
            }

            it('should call PT hooks on Angular lifecycle events', async () => {
                TestBed.resetTestingModule();
                await TestBed.configureTestingModule({
                    declarations: [TestPTCase8HooksComponent],
                    imports: [Terminal, FormsModule],
                    providers: [TerminalService, provideZonelessChangeDetection()]
                }).compileComponents();

                const testFixture = TestBed.createComponent(TestPTCase8HooksComponent);
                const component = testFixture.componentInstance;

                testFixture.detectChanges();

                expect(component.afterViewInitCalled).toBe(true);
                expect(component.afterViewCheckedCalled).toBe(true);

                testFixture.destroy();
                expect(component.onDestroyCalled).toBe(true);
            });
        });
    });
});
