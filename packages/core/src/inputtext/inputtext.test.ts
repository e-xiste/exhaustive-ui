import { Base } from '@exhaustive-ui/core/base';
import { Theme } from '@exhaustive-ui/styled';
import { ChangeDetectionStrategy, Component, DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import Aura from '@exhaustive-ui/themes/aura';
import { InputText } from './inputtext';

// Tests that load a theme preset change the global Theme state and add <style> tags to the document,
// which every test file shares: reset them after each test (the styles are added again on demand)
// so the following files keep their layout.
afterEach(() => {
    Theme._theme = undefined;
    Theme._tokens = {};
    Theme.clearLoadedStyleNames();
    Base.clearLoadedStyleNames();
    document.head.querySelectorAll('style[data-exhaustive-style-id]').forEach((style) => style.remove());
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [InputText, FormsModule],
    template: ` <input type="text" pInputText [(ngModel)]="value" placeholder="Enter text" /> `
})
class TestBasicInputTextComponent {
    value: string = '';
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [InputText, FormsModule],
    template: ` <input type="text" pInputText [(ngModel)]="content" [pSize]="size" [variant]="variant" [fluid]="fluid" [invalid]="invalid" placeholder="Advanced input" /> `
})
class TestAdvancedInputTextComponent {
    content: string = '';
    size: 'large' | 'small' | undefined = undefined as any;
    variant: 'filled' | 'outlined' | undefined = undefined as any;
    fluid: boolean | undefined = undefined as any;
    invalid: boolean | undefined = undefined as any;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [InputText, ReactiveFormsModule],
    template: ` <input type="email" pInputText [formControl]="emailControl" /> `
})
class TestReactiveFormInputTextComponent {
    emailControl = new FormControl('');
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [InputText, FormsModule],
    template: ` <input type="password" pInputText [(ngModel)]="password" /> `
})
class TestPasswordInputComponent {
    password: string = '';
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [InputText, FormsModule],
    template: ` <input type="text" pInputText [pt]="pt" [invalid]="invalid" [fluid]="fluid" [variant]="variant" [(ngModel)]="value" /> `
})
class TestPTInputTextComponent {
    value: string = '';
    pt: any = {};
    invalid: boolean | undefined = undefined;
    fluid: boolean | undefined = undefined;
    variant: 'filled' | 'outlined' | undefined = undefined;
}

describe('InputText', () => {
    describe('Basic Functionality', () => {
        let component: TestBasicInputTextComponent;
        let fixture: ComponentFixture<TestBasicInputTextComponent>;
        let inputEl: DebugElement;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestBasicInputTextComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestBasicInputTextComponent);
            component = fixture.componentInstance;
            inputEl = fixture.debugElement.query(By.directive(InputText));
            fixture.detectChanges();
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should apply pInputText directive', () => {
            expect(inputEl).toBeTruthy();
            expect(inputEl.nativeElement.tagName.toLowerCase()).toBe('input');
            expect(inputEl.nativeElement.type).toBe('text');
        });

        it('should have input element with directive applied', () => {
            expect(inputEl.nativeElement.hasAttribute('pInputText')).toBe(true);
        });

        it('should handle placeholder', () => {
            expect(inputEl.nativeElement.placeholder).toBe('Enter text');
        });

        it('should update model value when input changes', async () => {
            const input = inputEl.nativeElement;
            input.value = 'test input';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(component.value).toBe('test input');
        });

        it('should update input value when model changes', async () => {
            component.value = 'new value';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputEl.nativeElement.value).toBe('new value');
        });
    });

    describe('Advanced Features', () => {
        let component: TestAdvancedInputTextComponent;
        let fixture: ComponentFixture<TestAdvancedInputTextComponent>;
        let inputEl: DebugElement;
        let inputDirective: InputText;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestAdvancedInputTextComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestAdvancedInputTextComponent);
            component = fixture.componentInstance;
            inputEl = fixture.debugElement.query(By.directive(InputText));
            inputDirective = inputEl.injector.get(InputText);
            fixture.detectChanges();
        });

        it('should apply size variants', async () => {
            component.size = 'large';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputDirective.pSize()).toBe('large');
            expect(inputEl.nativeElement.classList.contains('p-inputtext-lg')).toBe(true);
            expect(inputEl.nativeElement.classList.contains('p-inputfield-lg')).toBe(true);
            expect(inputEl.nativeElement.getAttribute('data-p')).toContain('large');

            component.size = 'small';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputDirective.pSize()).toBe('small');
            expect(inputEl.nativeElement.classList.contains('p-inputtext-sm')).toBe(true);
            expect(inputEl.nativeElement.classList.contains('p-inputfield-sm')).toBe(true);
            expect(inputEl.nativeElement.classList.contains('p-inputtext-lg')).toBe(false);
            expect(inputEl.nativeElement.getAttribute('data-p')).toContain('small');
        });

        it('should apply variant styles', async () => {
            component.variant = 'filled';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputDirective.variant()).toBe('filled');
            expect(inputEl.nativeElement.classList.contains('p-variant-filled')).toBe(true);

            component.variant = 'outlined';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputDirective.variant()).toBe('outlined');
            expect(inputEl.nativeElement.classList.contains('p-variant-filled')).toBe(false);
        });

        it('should apply fluid styling', async () => {
            component.fluid = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputDirective.fluid()).toBe(true);
            expect(inputDirective.hasFluid()).toBe(true);
            expect(inputEl.nativeElement.classList.contains('p-inputtext-fluid')).toBe(true);

            component.fluid = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputDirective.fluid()).toBe(false);
            expect(inputDirective.hasFluid()).toBe(false);
            expect(inputEl.nativeElement.classList.contains('p-inputtext-fluid')).toBe(false);
        });

        it('should apply invalid state', async () => {
            component.invalid = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputDirective.invalid()).toBe(true);
            expect(inputEl.nativeElement.classList.contains('p-invalid')).toBe(true);

            component.invalid = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputDirective.invalid()).toBe(false);
            expect(inputEl.nativeElement.classList.contains('p-invalid')).toBe(false);
        });
    });

    describe('Reactive Forms', () => {
        let component: TestReactiveFormInputTextComponent;
        let fixture: ComponentFixture<TestReactiveFormInputTextComponent>;
        let inputEl: DebugElement;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestReactiveFormInputTextComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestReactiveFormInputTextComponent);
            component = fixture.componentInstance;
            inputEl = fixture.debugElement.query(By.directive(InputText));
            fixture.detectChanges();
        });

        it('should work with reactive forms', async () => {
            component.emailControl.setValue('test@example.com');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputEl.nativeElement.value).toBe('test@example.com');
        });

        it('should update form control when input changes', async () => {
            const input = inputEl.nativeElement;
            input.value = 'user@test.com';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(component.emailControl.value).toBe('user@test.com');
        });

        it('should handle form control validation', async () => {
            component.emailControl.setErrors({ email: true });
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(component.emailControl.invalid).toBe(true);
            expect(component.emailControl.errors?.['email']).toBe(true);
        });

        it('should handle disabled state', async () => {
            component.emailControl.disable();
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputEl.nativeElement.disabled).toBe(true);
            expect(component.emailControl.disabled).toBe(true);
        });
    });

    describe('Input Types', () => {
        let component: TestPasswordInputComponent;
        let fixture: ComponentFixture<TestPasswordInputComponent>;
        let inputEl: DebugElement;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestPasswordInputComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestPasswordInputComponent);
            component = fixture.componentInstance;
            inputEl = fixture.debugElement.query(By.directive(InputText));
            fixture.detectChanges();
        });

        it('should work with password input type', () => {
            expect(inputEl.nativeElement.type).toBe('password');
        });

        it('should handle password value changes', async () => {
            const input = inputEl.nativeElement;
            input.value = 'secret123';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(component.password).toBe('secret123');
        });
    });

    describe('Edge Cases', () => {
        let component: TestBasicInputTextComponent;
        let fixture: ComponentFixture<TestBasicInputTextComponent>;
        let inputEl: DebugElement;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestBasicInputTextComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestBasicInputTextComponent);
            component = fixture.componentInstance;
            inputEl = fixture.debugElement.query(By.directive(InputText));
            fixture.detectChanges();
        });

        it('should handle empty string values', async () => {
            component.value = '';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputEl.nativeElement.value).toBe('' as any);
        });

        it('should handle null/undefined values', async () => {
            component.value = null as any;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputEl.nativeElement.value).toBe('' as any);
        });

        it('should handle special characters', async () => {
            const specialText = 'Hello! @#$%^&*()_+ 123';
            component.value = specialText;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputEl.nativeElement.value).toBe(specialText);
        });

        it('should handle whitespace values', async () => {
            component.value = '   spaces   ';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(inputEl.nativeElement.value).toBe('   spaces   ');
        });
    });

    describe('Input Events', () => {
        let component: TestBasicInputTextComponent;
        let fixture: ComponentFixture<TestBasicInputTextComponent>;
        let inputEl: DebugElement;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestBasicInputTextComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestBasicInputTextComponent);
            component = fixture.componentInstance;
            inputEl = fixture.debugElement.query(By.directive(InputText));
            fixture.detectChanges();
        });

        it('should respond to input events', async () => {
            const input = inputEl.nativeElement;

            input.value = 'a';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(component.value).toBe('a');

            input.value = 'ab';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(component.value).toBe('ab');

            input.value = 'abc';
            input.dispatchEvent(new Event('input'));
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(component.value).toBe('abc');
        });

        it('should handle focus and blur events', () => {
            const input = inputEl.nativeElement;

            // Test that focus event can be dispatched without errors
            expect(() => {
                input.dispatchEvent(new Event('focus'));
                fixture.detectChanges();
            }).not.toThrow();

            // Test that blur event can be dispatched without errors
            expect(() => {
                input.dispatchEvent(new Event('blur'));
                fixture.detectChanges();
            }).not.toThrow();
        });
    });

    describe('PassThrough (PT) Tests', () => {
        let component: TestPTInputTextComponent;
        let fixture: ComponentFixture<TestPTInputTextComponent>;
        let inputEl: HTMLInputElement;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestPTInputTextComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestPTInputTextComponent);
            component = fixture.componentInstance;
            const debugEl = fixture.debugElement.query(By.directive(InputText));
            inputEl = debugEl.nativeElement;
            fixture.detectChanges();
        });

        describe('Case 1: Simple string classes', () => {
            it('should apply root class from pt', async () => {
                component.pt = { root: 'ROOT_CLASS' };
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();

                expect(inputEl.classList.contains('ROOT_CLASS')).toBe(true);
            });
        });

        describe('Case 2: Objects', () => {
            it('should apply root object with class, style, data attributes, and aria-label', async () => {
                component.pt = {
                    root: {
                        class: 'ROOT_OBJECT_CLASS',
                        style: { 'border-color': 'red' },
                        'data-p-test': true,
                        'aria-label': 'TEST_ARIA_LABEL'
                    }
                };
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();

                expect(inputEl.classList.contains('ROOT_OBJECT_CLASS')).toBe(true);
                expect(inputEl.style.borderColor).toBe('red');
                expect(inputEl.getAttribute('data-p-test')).toBe('true');
                expect(inputEl.getAttribute('aria-label')).toBe('TEST_ARIA_LABEL');
            });
        });

        describe('Case 3: Use variables from instance', () => {
            it('should apply pt function that accesses instance', async () => {
                component.invalid = true;
                component.pt = {
                    root: ({ instance }) => ({
                        class: 'INSTANCE_ACCESSED',
                        'data-invalid': instance?.invalid()
                    })
                };
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();

                expect(inputEl.classList.contains('INSTANCE_ACCESSED')).toBe(true);
                expect(inputEl.getAttribute('data-invalid')).toBe('true');
            });

            it('should apply pt style based on instance fluid state', async () => {
                component.fluid = true;
                component.pt = {
                    root: ({ instance }) => ({
                        style: {
                            width: instance?.hasFluid() ? '100%' : 'auto'
                        }
                    })
                };
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();

                expect(inputEl.style.width).toBe('100%');
            });

            it('should apply pt based on instance variant', async () => {
                component.variant = 'filled';
                component.pt = {
                    root: ({ instance }) => ({
                        'data-variant': instance?.variant()
                    })
                };
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();

                expect(inputEl.getAttribute('data-variant')).toBe('filled');
            });
        });

        describe('Case 4: Event binding', () => {
            it('should handle onclick event from pt', async () => {
                let clicked = false;
                component.pt = {
                    root: {
                        onclick: () => {
                            clicked = true;
                        }
                    }
                };
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();

                inputEl.click();
                expect(clicked).toBe(true);
            });

            it('should handle onfocus event from pt', async () => {
                let focused = false;
                component.pt = {
                    root: {
                        onfocus: () => {
                            focused = true;
                        }
                    }
                };
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();

                inputEl.dispatchEvent(new Event('focus'));
                expect(focused).toBe(true);
            });

            it('should handle onblur event from pt', async () => {
                let blurred = false;
                component.pt = {
                    root: {
                        onblur: () => {
                            blurred = true;
                        }
                    }
                };
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();

                inputEl.dispatchEvent(new Event('blur'));
                expect(blurred).toBe(true);
            });
        });

        describe('Case 5: Inline test', () => {
            it('should apply inline pt with string class', async () => {
                component.pt = { root: 'INLINE_CLASS' };
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();

                expect(inputEl.classList.contains('INLINE_CLASS')).toBe(true);
            });

            it('should apply inline pt with object class', async () => {
                component.pt = { root: { class: 'INLINE_OBJECT_CLASS' } };
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();

                expect(inputEl.classList.contains('INLINE_OBJECT_CLASS')).toBe(true);
            });
        });

        describe('Combined PT scenarios', () => {
            it('should apply complex pt with functions and objects', async () => {
                component.fluid = true;
                component.pt = {
                    root: ({ instance }) => ({
                        class: 'COMPLEX_CLASS',
                        style: {
                            border: '1px solid green'
                        },
                        'data-fluid': instance?.hasFluid()
                    })
                };
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();

                expect(inputEl.classList.contains('COMPLEX_CLASS')).toBe(true);
                expect(inputEl.style.border).toBe('1px solid green');
                expect(inputEl.getAttribute('data-fluid')).toBe('true');
            });

            it('should handle PT with placeholder and aria attributes', async () => {
                component.pt = {
                    root: {
                        'aria-required': 'true',
                        'aria-describedby': 'help-text',
                        class: 'custom-input'
                    }
                };
                fixture.changeDetectorRef.markForCheck();
                await fixture.whenStable();

                expect(inputEl.getAttribute('aria-required')).toBe('true');
                expect(inputEl.getAttribute('aria-describedby')).toBe('help-text');
                expect(inputEl.classList.contains('custom-input')).toBe(true);
            });
        });
    });
});

@Component({
    standalone: true,
    imports: [InputText, ReactiveFormsModule],
    template: `
        <input id="auto" pInputText [formControl]="auto" />
        <input id="bound" pInputText [formControl]="bound" [invalid]="bound.invalid && bound.touched" />
        <input id="valid" pInputText />
    `
})
class InputTextInvalidBindingHostComponent {
    auto = new FormControl('', Validators.required);
    bound = new FormControl('', Validators.required);
}

describe('InputText invalid input over ng-invalid (optimus-ui#372)', () => {
    it('should let a bound [invalid] decide the invalid style of a dirty invalid control', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [InputTextInvalidBindingHostComponent],
            providers: [provideZonelessChangeDetection(), provideExhaustive({ theme: { preset: Aura } })]
        });
        const fixture = TestBed.createComponent(InputTextInvalidBindingHostComponent);
        fixture.componentInstance.auto.markAsDirty();
        fixture.componentInstance.bound.markAsDirty();
        fixture.detectChanges();
        await fixture.whenStable();

        const host = fixture.nativeElement as HTMLElement;
        const borderColor = (id: string) => getComputedStyle(host.querySelector(`#${id}`)!).borderTopColor;
        expect(host.querySelector('#bound')!.classList.contains('ng-invalid')).toBe(true);
        // without [invalid] the ng-invalid.ng-dirty fallback still applies
        expect(borderColor('auto')).not.toBe(borderColor('valid'));
        // with [invalid] bound to false, the control is not shown as invalid
        expect(borderColor('bound')).toBe(borderColor('valid'));
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [InputText],
    template: `
        @for (index of inputs; track index) {
            <input pInputText [value]="index" />
        }
    `
})
class TestManyInputTextComponent {
    inputs = Array.from({ length: 1500 }, (_, i) => i);
}

describe('InputText - many instances at once (optimus-ui#154)', () => {
    afterEach(() => {
        Theme._theme = undefined;
        Theme._tokens = {};
        Theme.clearLoadedStyleNames();
        Base.clearLoadedStyleNames();
        document.head.querySelectorAll('style[data-exhaustive-style-id]').forEach((style) => style.remove());
    });

    it('renders 1500 inputs in one pass without overflowing the call stack', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [TestManyInputTextComponent],
            providers: [provideZonelessChangeDetection(), provideExhaustive({ theme: { preset: Aura } })]
        }).compileComponents();
        const fixture = TestBed.createComponent(TestManyInputTextComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const inputs = fixture.nativeElement.querySelectorAll('input.p-inputtext');
        expect(inputs.length).toBe(1500);
        expect(document.head.querySelectorAll('style[data-exhaustive-style-id="inputtext"]').length).toBeLessThanOrEqual(1);
    });
});
