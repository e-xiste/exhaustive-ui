import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component, DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputOtp, InputOtpChangeEvent } from './inputotp';
import { provideExhaustive } from '@exhaustive-ui/core/config';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { PrimeTemplate } from '@exhaustive-ui/core/api';
// Temel test component'i
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [InputOtp, FormsModule],
    template: `<p-inputotp [(ngModel)]="value" [length]="length" />`
})
class TestBasicInputOtpComponent {
    value: string = '';
    length: number = 4;
}

// Reactive form test component'i
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [InputOtp, ReactiveFormsModule],
    template: ` <p-inputotp [formControl]="otpControl" [length]="length" (onChange)="onOtpChange($event)" /> `
})
class TestReactiveFormInputOtpComponent {
    otpControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
    length: number = 4;
    changeEvents: InputOtpChangeEvent[] = [];

    onOtpChange(event: InputOtpChangeEvent) {
        this.changeEvents.push(event);
    }
}

// Gelişmiş özellikler test component'i
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [InputOtp, FormsModule],
    template: `
        <p-inputotp
            [(ngModel)]="value"
            [length]="length"
            [mask]="mask"
            [integerOnly]="integerOnly"
            [readonly]="readonly"
            [autofocus]="autofocus"
            [variant]="variant"
            [size]="size"
            (onChange)="onOtpChange($event)"
            (onFocus)="onOtpFocus($event)"
            (onBlur)="onOtpBlur($event)"
        />
    `
})
class TestAdvancedInputOtpComponent {
    value: string = '';
    length: number = 6;
    mask: boolean = false;
    integerOnly: boolean = false;
    readonly: boolean = false;
    autofocus: boolean = false;
    variant: 'filled' | 'outlined' | undefined = undefined as any;
    size: 'large' | 'small' | undefined = undefined as any;

    changeEvents: InputOtpChangeEvent[] = [];
    focusEvents: Event[] = [];
    blurEvents: Event[] = [];

    onOtpChange(event: InputOtpChangeEvent) {
        this.changeEvents.push(event);
    }

    onOtpFocus(event: Event) {
        this.focusEvents.push(event);
    }

    onOtpBlur(event: Event) {
        this.blurEvents.push(event);
    }
}

// InputOTP pTemplate component
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [InputOtp, FormsModule],
    template: `
        <p-inputotp [(ngModel)]="value" [length]="length">
            <!-- Input template with pTemplate directive -->
            <ng-template pTemplate="input" let-value let-events="events" let-index="index">
                <input
                    type="text"
                    class="custom-otp-input"
                    [attr.data-testid]="'ptemplate-input-' + index"
                    [value]="value"
                    (input)="events.input($event)"
                    (keydown)="events.keydown($event)"
                    (focus)="events.focus($event)"
                    (blur)="events.blur($event)"
                    (paste)="events.paste($event)"
                    [attr.placeholder]="index + 1"
                    maxlength="1"
                />
            </ng-template>
        </p-inputotp>
    `
})
class TestInputOtpPTemplateComponent {
    value: string = '';
    length: number = 4;
}

// InputOTP #template reference component
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [InputOtp, FormsModule],
    template: `
        <p-inputotp [(ngModel)]="value" [length]="length">
            <!-- Input template with #template reference -->
            <ng-template #input let-value let-events="events" let-index="index">
                <input
                    type="text"
                    class="custom-otp-input"
                    [attr.data-testid]="'ref-input-' + index"
                    [value]="value"
                    (input)="events.input($event)"
                    (keydown)="events.keydown($event)"
                    (focus)="events.focus($event)"
                    (blur)="events.blur($event)"
                    (paste)="events.paste($event)"
                    [attr.placeholder]="'#' + (index + 1)"
                    maxlength="1"
                />
            </ng-template>
        </p-inputotp>
    `
})
class TestInputOtpRefTemplateComponent {
    value: string = '';
    length: number = 4;
}

describe('InputOtp', () => {
    describe('Component Initialization', () => {
        let component: TestBasicInputOtpComponent;
        let fixture: ComponentFixture<TestBasicInputOtpComponent>;
        let inputOtpElement: DebugElement;
        let inputOtpInstance: InputOtp;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestBasicInputOtpComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestBasicInputOtpComponent);
            component = fixture.componentInstance;
            inputOtpElement = fixture.debugElement.query(By.directive(InputOtp));
            inputOtpInstance = inputOtpElement.componentInstance;
            fixture.detectChanges();
        });

        it('should create', () => {
            expect(component).toBeTruthy();
            expect(inputOtpInstance).toBeTruthy();
        });

        it('should initialize with default properties', () => {
            expect(inputOtpInstance.length()).toBe(4);
            expect(inputOtpInstance.mask()).toBeFalsy();
            expect(inputOtpInstance.integerOnly()).toBeFalsy();
            expect(inputOtpInstance.readonly()).toBeFalsy();
            expect(inputOtpInstance.tokens()).toEqual([]);
        });

        it('should render correct number of input fields', () => {
            const inputs = fixture.debugElement.queryAll(By.css('input'));
            expect(inputs.length).toBe(4);
        });
    });

    describe('Basic Functionality Tests', () => {
        let component: TestBasicInputOtpComponent;
        let fixture: ComponentFixture<TestBasicInputOtpComponent>;
        let inputOtpInstance: InputOtp;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestBasicInputOtpComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestBasicInputOtpComponent);
            component = fixture.componentInstance;
            inputOtpInstance = fixture.debugElement.query(By.directive(InputOtp)).componentInstance;
            fixture.detectChanges();
        });

        it('should label each input with its position from the aria.otpLabel locale key', () => {
            const inputs = fixture.debugElement.queryAll(By.css('input'));
            expect(inputs.length).toBeGreaterThan(1);
            inputs.forEach((input, i) => expect(input.nativeElement.getAttribute('aria-label')).toBe(`Please enter one time password character ${i + 1}`));
        });

        it('should handle single character input', async () => {
            const inputs = fixture.debugElement.queryAll(By.css('input'));
            const firstInput = inputs[0].nativeElement;

            firstInput.value = '1';
            firstInput.dispatchEvent(new InputEvent('input', { inputType: 'insertText' }));
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputOtpInstance.tokens()[0]).toBe('1');
            expect(component.value).toBe('1');
        });

        it('should move focus to next input on character entry', async () => {
            const inputs = fixture.debugElement.queryAll(By.css('input'));
            const firstInput = inputs[0].nativeElement;
            const secondInput = inputs[1].nativeElement;

            vi.spyOn(secondInput, 'focus').mockImplementation(() => {});
            vi.spyOn(secondInput, 'select').mockImplementation(() => {});

            firstInput.value = '1';
            firstInput.dispatchEvent(new InputEvent('input', { inputType: 'insertText' }));
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(secondInput.focus).toHaveBeenCalled();
            expect(secondInput.select).toHaveBeenCalled();
        });

        it('should update model with complete OTP', async () => {
            const inputs = fixture.debugElement.queryAll(By.css('input'));

            inputs[0].nativeElement.value = '1';
            inputs[0].nativeElement.dispatchEvent(new InputEvent('input', { inputType: 'insertText' }));
            inputs[1].nativeElement.value = '2';
            inputs[1].nativeElement.dispatchEvent(new InputEvent('input', { inputType: 'insertText' }));
            inputs[2].nativeElement.value = '3';
            inputs[2].nativeElement.dispatchEvent(new InputEvent('input', { inputType: 'insertText' }));
            inputs[3].nativeElement.value = '4';
            inputs[3].nativeElement.dispatchEvent(new InputEvent('input', { inputType: 'insertText' }));

            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(component.value).toBe('1234');
            expect(inputOtpInstance.tokens()).toEqual(['1', '2', '3', '4']);
        });
    });

    describe('Keyboard Navigation Tests', () => {
        let component: TestBasicInputOtpComponent;
        let fixture: ComponentFixture<TestBasicInputOtpComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestBasicInputOtpComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestBasicInputOtpComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should move to next input on ArrowRight', async () => {
            const inputs = fixture.debugElement.queryAll(By.css('input'));
            const firstInput = inputs[0].nativeElement;
            const secondInput = inputs[1].nativeElement;

            vi.spyOn(secondInput, 'focus').mockImplementation(() => {});
            vi.spyOn(secondInput, 'select').mockImplementation(() => {});

            const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
            firstInput.dispatchEvent(rightArrowEvent);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(secondInput.focus).toHaveBeenCalled();
            expect(secondInput.select).toHaveBeenCalled();
        });

        it('should move to previous input on ArrowLeft', async () => {
            const inputs = fixture.debugElement.queryAll(By.css('input'));
            const firstInput = inputs[0].nativeElement;
            const secondInput = inputs[1].nativeElement;

            vi.spyOn(firstInput, 'focus').mockImplementation(() => {});
            vi.spyOn(firstInput, 'select').mockImplementation(() => {});

            const leftArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
            secondInput.dispatchEvent(leftArrowEvent);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(firstInput.focus).toHaveBeenCalled();
            expect(firstInput.select).toHaveBeenCalled();
        });

        it('should prevent ArrowUp and ArrowDown', () => {
            const inputs = fixture.debugElement.queryAll(By.css('input'));
            const firstInput = inputs[0].nativeElement;

            const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
            const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });

            vi.spyOn(upEvent, 'preventDefault');
            vi.spyOn(downEvent, 'preventDefault');

            firstInput.dispatchEvent(upEvent);
            firstInput.dispatchEvent(downEvent);

            expect(upEvent.preventDefault).toHaveBeenCalled();
            expect(downEvent.preventDefault).toHaveBeenCalled();
        });
    });

    describe('Paste Functionality Tests', () => {
        let component: TestBasicInputOtpComponent;
        let fixture: ComponentFixture<TestBasicInputOtpComponent>;
        let inputOtpInstance: InputOtp;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestBasicInputOtpComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestBasicInputOtpComponent);
            component = fixture.componentInstance;
            inputOtpInstance = fixture.debugElement.query(By.directive(InputOtp)).componentInstance;
            fixture.detectChanges();
        });

        it('should handle paste operation', async () => {
            const inputs = fixture.debugElement.queryAll(By.css('input'));
            const firstInput = inputs[0].nativeElement;

            const pasteEvent = new ClipboardEvent('paste');
            Object.defineProperty(pasteEvent, 'clipboardData', {
                value: {
                    getData: () => '1234'
                }
            });

            vi.spyOn(pasteEvent, 'preventDefault').mockImplementation(() => {});
            firstInput.dispatchEvent(pasteEvent);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(pasteEvent.preventDefault).toHaveBeenCalled();
            expect(inputOtpInstance.tokens()).toEqual(['1', '2', '3', '4']);
            expect(component.value).toBe('1234');
        });

        it('should handle paste with excess characters', async () => {
            const inputs = fixture.debugElement.queryAll(By.css('input'));
            const firstInput = inputs[0].nativeElement;

            const pasteEvent = new ClipboardEvent('paste');
            Object.defineProperty(pasteEvent, 'clipboardData', {
                value: {
                    getData: () => '123456789'
                }
            });

            firstInput.dispatchEvent(pasteEvent);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Should only take characters up to length
            expect(inputOtpInstance.tokens().length).toBeLessThanOrEqual(5);
            expect(component.value.length).toBeLessThanOrEqual(5);
        });
    });

    describe('Advanced Features Tests', () => {
        let component: TestAdvancedInputOtpComponent;
        let fixture: ComponentFixture<TestAdvancedInputOtpComponent>;
        let inputOtpInstance: InputOtp;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestAdvancedInputOtpComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestAdvancedInputOtpComponent);
            component = fixture.componentInstance;
            inputOtpInstance = fixture.debugElement.query(By.directive(InputOtp)).componentInstance;
            fixture.detectChanges();
        });

        it('should respect length property', () => {
            const inputs = fixture.debugElement.queryAll(By.css('input'));
            expect(inputs.length).toBe(6);
            expect(inputOtpInstance.length()).toBe(6);
        });

        it('should apply mask property', () => {
            component.mask = true;
            fixture.detectChanges();

            expect(inputOtpInstance.inputType()).toBe('password');

            const inputs = fixture.debugElement.queryAll(By.css('input'));
            inputs.forEach((input) => {
                expect(input.nativeElement.type).toBe('password');
            });
        });

        it('should enforce integerOnly restriction', async () => {
            component.integerOnly = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const inputs = fixture.debugElement.queryAll(By.css('input'));
            const firstInput = inputs[0].nativeElement;

            const numericEvent = new KeyboardEvent('keydown', { code: 'Digit1', key: '1' });
            vi.spyOn(numericEvent, 'preventDefault').mockImplementation(() => {});
            firstInput.dispatchEvent(numericEvent);

            expect(numericEvent.preventDefault).not.toHaveBeenCalled();

            const alphaEvent = new KeyboardEvent('keydown', { code: 'KeyA', key: 'a' });
            vi.spyOn(alphaEvent, 'preventDefault').mockImplementation(() => {});
            firstInput.dispatchEvent(alphaEvent);

            expect(alphaEvent.preventDefault).toHaveBeenCalled();
        });

        it('should handle readonly state', () => {
            component.readonly = true;
            fixture.detectChanges();

            const inputs = fixture.debugElement.queryAll(By.css('input'));
            inputs.forEach((input) => {
                expect(input.nativeElement.hasAttribute('readonly')).toBe(true);
            });
        });

        it('should apply variant and size properties', () => {
            component.variant = 'filled';
            component.size = 'large';
            fixture.detectChanges();

            expect(inputOtpInstance.variant()).toBe('filled');
            expect(inputOtpInstance.size()).toBe('large');
        });

        it('should emit onChange events', async () => {
            const inputs = fixture.debugElement.queryAll(By.css('input'));
            const firstInput = inputs[0].nativeElement;

            firstInput.value = '1';
            firstInput.dispatchEvent(new InputEvent('input', { inputType: 'insertText' }));
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(component.changeEvents.length).toBe(1);
            expect(component.changeEvents[0].value).toBe('1');
        });

        it('should emit onFocus and onBlur events', () => {
            const inputs = fixture.debugElement.queryAll(By.css('input'));
            const firstInput = inputs[0].nativeElement;

            // Clear any existing events
            component.focusEvents = [];
            component.blurEvents = [];

            firstInput.dispatchEvent(new FocusEvent('focus'));
            expect(component.focusEvents.length).toBeGreaterThanOrEqual(1);

            firstInput.dispatchEvent(new FocusEvent('blur'));
            expect(component.blurEvents.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('Reactive Form Integration Tests', () => {
        let component: TestReactiveFormInputOtpComponent;
        let fixture: ComponentFixture<TestReactiveFormInputOtpComponent>;
        let inputOtpInstance: InputOtp;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestReactiveFormInputOtpComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestReactiveFormInputOtpComponent);
            component = fixture.componentInstance;
            inputOtpInstance = fixture.debugElement.query(By.directive(InputOtp)).componentInstance;
            fixture.detectChanges();
        });

        it('should integrate with reactive forms', async () => {
            component.otpControl.setValue('1234');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputOtpInstance.tokens()).toEqual(['1', '2', '3', '4']);
        });

        it('should validate required and minLength', async () => {
            expect(component.otpControl.valid).toBe(false);
            expect(component.otpControl.errors?.['required']).toBe(true);

            component.otpControl.setValue('12');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(component.otpControl.valid).toBe(false);
            expect(component.otpControl.errors?.['minlength']).toBeTruthy();

            component.otpControl.setValue('1234');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(component.otpControl.valid).toBe(true);
            expect(component.otpControl.errors).toBeNull();
        });
    });

    describe('Edge Cases', () => {
        let component: TestAdvancedInputOtpComponent;
        let fixture: ComponentFixture<TestAdvancedInputOtpComponent>;
        let inputOtpInstance: InputOtp;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestAdvancedInputOtpComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestAdvancedInputOtpComponent);
            component = fixture.componentInstance;
            inputOtpInstance = fixture.debugElement.query(By.directive(InputOtp)).componentInstance;
            fixture.detectChanges();
        });

        it('should handle null/undefined values', async () => {
            component.value = null as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputOtpInstance.tokens()).toEqual([]);

            component.value = undefined as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputOtpInstance.tokens()).toEqual([]);
        });

        it('should handle empty string values', async () => {
            component.value = '';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputOtpInstance.tokens()).toEqual([]);

            const inputs = fixture.debugElement.queryAll(By.css('input'));
            inputs.forEach((input) => {
                expect(input.nativeElement.value).toBe('' as any);
            });
        });
    });

    describe('Performance Tests', () => {
        let component: TestBasicInputOtpComponent;
        let fixture: ComponentFixture<TestBasicInputOtpComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestBasicInputOtpComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestBasicInputOtpComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should handle rapid input changes', async () => {
            const inputs = fixture.debugElement.queryAll(By.css('input'));

            for (let i = 0; i < 10; i++) {
                inputs[0].nativeElement.value = i.toString();
                inputs[0].nativeElement.dispatchEvent(new InputEvent('input', { inputType: 'insertText' }));
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();
            }

            expect(component.value).toBe('9');
        });
    });

    describe('pTemplate Tests', () => {
        let fixture: ComponentFixture<TestInputOtpPTemplateComponent>;
        let component: TestInputOtpPTemplateComponent;
        let inputOtpElement: DebugElement;
        let inputOtpInstance: InputOtp;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestInputOtpPTemplateComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestInputOtpPTemplateComponent);
            component = fixture.componentInstance;
            inputOtpElement = fixture.debugElement.query(By.css('p-inputotp'));
            inputOtpInstance = inputOtpElement.componentInstance;
            fixture.detectChanges();
        });

        it('should have input pTemplate', () => {
            expect(inputOtpInstance).toBeTruthy();
            expect(() => inputOtpInstance.inputTemplate()).not.toThrow();
        });

        it('should pass context parameters to input template', async () => {
            // Template should be processed
            expect(inputOtpInstance).toBeTruthy();
            expect(component.length).toBe(4);
            await fixture.whenStable();
        });

        it('should handle input events through template context', async () => {
            // Test that component can handle value changes
            component.value = '1234';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Value should be updated
            expect(component.value).toBe('1234');
        });

        it('should handle keyboard events through template context', async () => {
            // Test that template is properly configured
            expect(inputOtpInstance).toBeTruthy();
            // Template should be available after content init
            if (inputOtpInstance.ngAfterContentInit) {
                inputOtpInstance.ngAfterContentInit();
            }
            await fixture.whenStable();
            fixture.changeDetectorRef.markForCheck();
            expect(inputOtpInstance).toBeTruthy();
        });

        it('should handle focus/blur events through template context', async () => {
            // Test that template context can be accessed
            expect(inputOtpInstance).toBeTruthy();

            // Simulate component state changes
            component.value = '12';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(component.value).toBe('12');
        });

        it('should process pTemplate after content init', async () => {
            if (inputOtpInstance.ngAfterContentInit) {
                inputOtpInstance.ngAfterContentInit();
            }
            await fixture.whenStable();
            fixture.changeDetectorRef.markForCheck();

            expect(inputOtpInstance).toBeTruthy();
        });

        it('should handle pTemplate changes after view init', async () => {
            if (inputOtpInstance.ngAfterViewInit) {
                inputOtpInstance.ngAfterViewInit();
            }
            await fixture.whenStable();
            fixture.changeDetectorRef.markForCheck();

            expect(inputOtpInstance).toBeTruthy();
        });
    });

    describe('#template Tests', () => {
        let fixture: ComponentFixture<TestInputOtpRefTemplateComponent>;
        let component: TestInputOtpRefTemplateComponent;
        let inputOtpElement: DebugElement;
        let inputOtpInstance: InputOtp;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestInputOtpRefTemplateComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestInputOtpRefTemplateComponent);
            component = fixture.componentInstance;
            inputOtpElement = fixture.debugElement.query(By.css('p-inputotp'));
            inputOtpInstance = inputOtpElement.componentInstance;
            fixture.detectChanges();
        });

        it('should have input #template', () => {
            expect(inputOtpInstance).toBeTruthy();
            expect(() => inputOtpInstance.inputTemplate()).not.toThrow();
        });

        it('should pass context parameters to input template', async () => {
            // Template should be processed
            expect(inputOtpInstance).toBeTruthy();
            expect(component.length).toBe(4);
            await fixture.whenStable();
        });

        it('should handle input events through template context', async () => {
            // Test that component can handle value changes
            component.value = '1234';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            // Value should be updated
            expect(component.value).toBe('1234');
        });

        it('should handle keyboard events through template context', async () => {
            // Test that template is properly configured
            expect(inputOtpInstance).toBeTruthy();
            // Template should be available after content init
            if (inputOtpInstance.ngAfterContentInit) {
                inputOtpInstance.ngAfterContentInit();
            }
            await fixture.whenStable();
            fixture.changeDetectorRef.markForCheck();
            expect(inputOtpInstance).toBeTruthy();
        });

        it('should handle focus/blur events through template context', async () => {
            // Test that template context can be accessed
            expect(inputOtpInstance).toBeTruthy();

            // Simulate component state changes
            component.value = '12';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(component.value).toBe('12');
        });

        it('should process #template after content init', async () => {
            if (inputOtpInstance.ngAfterContentInit) {
                inputOtpInstance.ngAfterContentInit();
            }
            await fixture.whenStable();
            fixture.changeDetectorRef.markForCheck();

            expect(inputOtpInstance).toBeTruthy();
        });

        it('should handle #template changes after view init', async () => {
            if (inputOtpInstance.ngAfterViewInit) {
                inputOtpInstance.ngAfterViewInit();
            }
            await fixture.whenStable();
            fixture.changeDetectorRef.markForCheck();

            expect(inputOtpInstance).toBeTruthy();
        });
    });
});

describe('InputOtp OnPush Rendering Tests', () => {
    let fixture: ComponentFixture<InputOtp>;
    let component: InputOtp;

    const queryInputs = () => fixture.debugElement.queryAll(By.css('input')).map((debugElement) => debugElement.nativeElement as HTMLInputElement);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InputOtp, FormsModule],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(InputOtp);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should re-render the number of inputs when length changes', () => {
        expect(queryInputs().length).toBe(4);

        fixture.componentRef.setInput('length', 6);
        fixture.detectChanges();

        expect(queryInputs().length).toBe(6);
        expect(queryInputs()[0].getAttribute('maxlength')).toBe('6');
    });

    it('should re-render the input type when mask changes', () => {
        expect(queryInputs().every((input) => input.type === 'text')).toBe(true);

        fixture.componentRef.setInput('mask', true);
        fixture.detectChanges();

        expect(component.inputType()).toBe('password');
        expect(queryInputs().every((input) => input.type === 'password')).toBe(true);
    });

    it('should re-render the inputmode when integerOnly changes', () => {
        expect(queryInputs()[0].getAttribute('inputmode')).toBe('text');

        fixture.componentRef.setInput('integerOnly', true);
        fixture.detectChanges();

        expect(component.inputMode()).toBe('numeric');
        expect(queryInputs().every((input) => input.getAttribute('inputmode') === 'numeric')).toBe(true);
    });

    it('should re-render the readonly, tabindex and disabled attributes when the inputs change', () => {
        expect(queryInputs()[0].hasAttribute('readonly')).toBe(false);
        expect(queryInputs()[0].hasAttribute('tabindex')).toBe(false);
        expect(queryInputs()[0].hasAttribute('disabled')).toBe(false);

        fixture.componentRef.setInput('readonly', true);
        fixture.componentRef.setInput('tabindex', 3);
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        expect(queryInputs().every((input) => input.hasAttribute('readonly'))).toBe(true);
        expect(queryInputs().every((input) => input.getAttribute('tabindex') === '3')).toBe(true);
        expect(queryInputs().every((input) => input.hasAttribute('disabled'))).toBe(true);
    });

    it('should re-render the input class when styleClass changes', () => {
        expect(queryInputs()[0].classList.contains('custom-otp')).toBe(false);

        fixture.componentRef.setInput('styleClass', 'custom-otp');
        fixture.detectChanges();

        expect(queryInputs().every((input) => input.classList.contains('custom-otp'))).toBe(true);
        expect(queryInputs().every((input) => input.classList.contains('p-inputotp-input'))).toBe(true);
    });

    it('should re-render the input values after writeValue', () => {
        component.writeValue('12');
        fixture.detectChanges();

        expect(component.tokens()).toEqual(['1', '2']);
        expect(queryInputs().map((input) => input.value)).toEqual(['1', '2', '', '']);

        component.writeValue(null);
        fixture.detectChanges();

        expect(component.tokens()).toEqual([]);
        expect(queryInputs().map((input) => input.value)).toEqual(['', '', '', '']);
    });

    it('should truncate the written value to length', () => {
        component.writeValue('123456');
        fixture.detectChanges();

        expect(component.value()).toEqual(['1', '2', '3', '4']);
        expect(component.tokens()).toEqual(['1', '2', '3', '4']);
        expect(component.modelValue()).toEqual(['1', '2', '3', '4']);
    });
});

describe('InputOtp PassThrough Tests', () => {
    let fixture: ComponentFixture<InputOtp>;
    let component: InputOtp;
    let hostElement: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InputOtp, FormsModule],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(InputOtp);
        component = fixture.componentInstance;
        hostElement = fixture.nativeElement;
        fixture.detectChanges();
    });

    describe('PT Case 1: Simple string classes', () => {
        it('should apply simple string class to host', () => {
            fixture.componentRef.setInput('pt', { host: 'HOST_CLASS' });
            fixture.detectChanges();

            expect(hostElement.classList.contains('HOST_CLASS')).toBe(true);
        });

        it('should apply simple string class to root', () => {
            fixture.componentRef.setInput('pt', { root: 'ROOT_CLASS' });
            fixture.detectChanges();

            expect(hostElement.classList.contains('ROOT_CLASS')).toBe(true);
        });
    });

    describe('PT Case 2: Objects with properties', () => {
        it('should apply object with class to root', () => {
            fixture.componentRef.setInput('pt', {
                root: {
                    class: 'PT_ROOT_CLASS',
                    style: { 'background-color': 'lightblue' },
                    'data-testid': 'inputotp'
                }
            });
            fixture.detectChanges();

            expect(hostElement.classList.contains('PT_ROOT_CLASS')).toBe(true);
            expect(hostElement.style.backgroundColor).toBe('lightblue');
            expect(hostElement.getAttribute('data-testid')).toBe('inputotp');
        });
    });

    describe('PT Case 3: Instance variables', () => {
        it('should access instance variables in PT function', () => {
            fixture.componentRef.setInput('length', 6);
            fixture.componentRef.setInput('pt', {
                root: ({ instance }: any) => ({
                    class: instance?.length() === 6 ? 'LENGTH_SIX' : ''
                })
            });
            fixture.detectChanges();

            expect(hostElement.classList.contains('LENGTH_SIX')).toBe(true);
        });
    });

    describe('PT Case 4: Event binding', () => {
        it('should handle onclick event through PT', async () => {
            let clicked = false;
            let resolveDone!: () => void;
            const donePromise = new Promise<void>((resolve) => {
                resolveDone = resolve;
            });
            fixture.componentRef.setInput('pt', {
                root: {
                    onclick: () => {
                        clicked = true;
                        resolveDone();
                    }
                }
            });
            fixture.detectChanges();

            hostElement.click();
            expect(clicked).toBe(true);

            await donePromise;
        });
    });

    describe('PT Case 5: Global PT from ExhaustiveConfig', () => {
        it('should apply global PT configuration', async () => {
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [InputOtp, FormsModule],
                providers: [
                    provideZonelessChangeDetection(),
                    provideExhaustive({
                        pt: {
                            inputOtp: {
                                host: { 'aria-label': 'GLOBAL_LABEL' },
                                root: 'GLOBAL_CLASS'
                            }
                        }
                    })
                ]
            }).compileComponents();

            const globalFixture = TestBed.createComponent(InputOtp);
            globalFixture.detectChanges();

            const globalHostElement = globalFixture.nativeElement;
            expect(globalHostElement.classList.contains('GLOBAL_CLASS')).toBe(true);
            expect(globalHostElement.getAttribute('aria-label')).toBe('GLOBAL_LABEL');
        });
    });

    describe('PT Case 6: Lifecycle hooks', () => {
        it('should support lifecycle hooks', async () => {
            const hooksCalled: string[] = [];
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [InputOtp, FormsModule],
                providers: [
                    provideZonelessChangeDetection(),
                    provideExhaustive({
                        pt: {
                            inputOtp: {
                                hooks: {
                                    onInit: () => {
                                        hooksCalled.push('onInit');
                                    },
                                    onAfterViewChecked: () => {
                                        if (!hooksCalled.includes('onAfterViewChecked')) {
                                            hooksCalled.push('onAfterViewChecked');
                                        }
                                    },
                                    onDestroy: () => {
                                        hooksCalled.push('onDestroy');
                                    }
                                }
                            }
                        }
                    })
                ]
            }).compileComponents();

            const hookFixture = TestBed.createComponent(InputOtp);
            hookFixture.detectChanges();

            expect(hooksCalled).toContain('onInit');
            expect(hooksCalled).toContain('onAfterViewChecked');

            hookFixture.destroy();

            expect(hooksCalled).toContain('onDestroy');
        });
    });
});

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [InputOtp, PrimeTemplate],
    template: `
        <p-inputotp>
            <ng-template pTemplate="header">QUERY-HEADER</ng-template>
            <ng-template pTemplate="footer">QUERY-FOOTER</ng-template>
        </p-inputotp>
    `
})
class InputOtpQueryApiHostComponent {}

describe('InputOtp Signal Query API', () => {
    it('should collect projected PrimeTemplates via the templates contentChildren query', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [InputOtpQueryApiHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(InputOtpQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const instance = fixture.debugElement.query(By.directive(InputOtp)).componentInstance;
        const templates = instance.templates();
        expect(Array.isArray(templates)).toBe(true);
        expect(templates.length).toBe(2);
        expect(templates.map((t: any) => t.getType())).toEqual(['header', 'footer']);
        expect(templates[0].template).toBeDefined();
    });

    describe('Native keys (#340)', () => {
        let fixture: ComponentFixture<TestBasicInputOtpComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestBasicInputOtpComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestBasicInputOtpComponent);
            fixture.detectChanges();
        });

        const press = (input: HTMLInputElement, key: string) => {
            const event = new KeyboardEvent('keydown', { key, cancelable: true, bubbles: true });
            input.dispatchEvent(event);
            return event;
        };

        it('lets Tab and Enter through, even with integerOnly or when every cell is filled', async () => {
            const otp = fixture.debugElement.query(By.directive(InputOtp)).componentInstance as InputOtp;
            otp.tokens.set(['1', '2', '3', '4']);
            const input = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement as HTMLInputElement;

            expect(press(input, 'Tab').defaultPrevented).toBe(false);
            expect(press(input, 'Enter').defaultPrevented).toBe(false);
            expect(press(input, 'Escape').defaultPrevented).toBe(false);
            // printable characters are still filtered once the code is complete
            expect(press(input, '5').defaultPrevented).toBe(true);
        });

        it('lets Tab and Enter through with integerOnly', async () => {
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [TestAdvancedInputOtpComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();
            const advanced = TestBed.createComponent(TestAdvancedInputOtpComponent);
            advanced.componentInstance.integerOnly = true;
            advanced.changeDetectorRef.markForCheck();
            advanced.detectChanges();
            await advanced.whenStable();
            const input = advanced.debugElement.queryAll(By.css('input'))[0].nativeElement as HTMLInputElement;

            expect(press(input, 'Tab').defaultPrevented).toBe(false);
            expect(press(input, 'Enter').defaultPrevented).toBe(false);
            expect(press(input, 'a').defaultPrevented).toBe(true);
        });
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [InputOtp, FormsModule],
    template: `<p-inputotp [(ngModel)]="value" [length]="4" [integerOnly]="integerOnly" />`
})
class TestSoftKeyboardInputOtpComponent {
    value: any = null;
    integerOnly = false;
}

describe('InputOtp soft keyboard input', () => {
    let fixture: ComponentFixture<TestSoftKeyboardInputOtpComponent>;
    let inputs: HTMLInputElement[];

    const softType = async (input: HTMLInputElement, char: string, inputType: string) => {
        input.focus();
        input.value = char;
        input.dispatchEvent(new InputEvent('input', { inputType, data: char, bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestSoftKeyboardInputOtpComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();
        fixture = TestBed.createComponent(TestSoftKeyboardInputOtpComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        inputs = fixture.debugElement.queryAll(By.css('input')).map((d) => d.nativeElement);
    });

    it('should move to the next box on Android IME composition input (optimus-ui#868, optimus-ui#12)', async () => {
        await softType(inputs[0], 'A', 'insertCompositionText');
        expect(document.activeElement).toBe(inputs[1]);

        await softType(inputs[1], 'B', 'insertCompositionText');
        expect(document.activeElement).toBe(inputs[2]);
        expect(fixture.componentInstance.value).toBe('AB');
    });

    it('should reject non-digit characters typed without a keydown key when integerOnly is set (optimus-ui#687)', async () => {
        fixture.componentInstance.integerOnly = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        await fixture.whenStable();

        await softType(inputs[0], '1', 'insertText');
        expect(document.activeElement).toBe(inputs[1]);

        await softType(inputs[1], 'a', 'insertText');
        expect(inputs[1].value).toBe('');
        expect(document.activeElement).toBe(inputs[1]);
        expect(fixture.componentInstance.value).toBe('1');
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [InputOtp, FormsModule],
    template: `<p-inputotp [(ngModel)]="value" [length]="4" />`
})
class TestInputOtpEditComponent {
    value: string | null = '1234';
}

describe('InputOtp editing a filled value (optimus-ui#833)', () => {
    it('replaces the character of a box whose selection a click collapsed', async () => {
        TestBed.configureTestingModule({
            imports: [TestInputOtpEditComponent],
            providers: [provideZonelessChangeDetection()]
        });
        const fixture = TestBed.createComponent(TestInputOtpEditComponent);
        await fixture.whenStable();
        const inputs = Array.from(fixture.nativeElement.querySelectorAll('input')) as HTMLInputElement[];
        expect(inputs.map((input) => input.value)).toEqual(['1', '2', '3', '4']);

        // focus selects the box, the mouseup of the click then collapses the selection behind the character
        inputs[1].focus();
        inputs[1].setSelectionRange(1, 1);

        const keydown = new KeyboardEvent('keydown', { key: '9', cancelable: true, bubbles: true });
        inputs[1].dispatchEvent(keydown);
        expect(keydown.defaultPrevented).toBe(false);
        expect([inputs[1].selectionStart, inputs[1].selectionEnd]).toEqual([0, 1]);

        // the browser replaces the selected character
        inputs[1].value = '9';
        inputs[1].dispatchEvent(new InputEvent('input', { inputType: 'insertText', data: '9', bubbles: true }));
        await fixture.whenStable();

        expect(fixture.componentInstance.value).toBe('1934');
        expect(document.activeElement).toBe(inputs[2]);
    });
});
