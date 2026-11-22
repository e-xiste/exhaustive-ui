import { Base } from '@exhaustive-ui/core/base';
import { Theme } from '@exhaustive-ui/styled';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DatePicker } from '@exhaustive-ui/core/datepicker';
import { IconField } from '@exhaustive-ui/core/iconfield';
import { InputIcon } from '@exhaustive-ui/core/inputicon';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { Select } from '@exhaustive-ui/core/select';
import { Textarea } from '@exhaustive-ui/core/textarea';
import Aura from '@exhaustive-ui/themes/aura';
import { FloatLabel } from './floatlabel';
import { provideExhaustive } from '@exhaustive-ui/core/config';

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
    imports: [FloatLabel, FormsModule],
    template: `
        <p-floatlabel>
            <input id="username" [(ngModel)]="value" />
            <label for="username">Username</label>
        </p-floatlabel>
    `
})
class TestBasicFloatLabelComponent {
    value: string = '';
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [FloatLabel, FormsModule],
    template: `
        <p-floatlabel [variant]="variant">
            <input id="test-input" [(ngModel)]="value" />
            <label for="test-input">Test Label</label>
        </p-floatlabel>
    `
})
class TestVariantFloatLabelComponent {
    value: string = '';
    variant: 'in' | 'over' | 'on' = 'over';
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [FloatLabel, FormsModule],
    template: `
        <p-floatlabel class="static-class" [class]="dynamicClass">
            <input id="class-input" [(ngModel)]="value" />
            <label for="class-input">Class Label</label>
        </p-floatlabel>
    `
})
class TestClassFloatLabelComponent {
    value: string = '';
    dynamicClass: string | undefined;
}

describe('FloatLabel', () => {
    describe('Basic Functionality', () => {
        let component: TestBasicFloatLabelComponent;
        let fixture: ComponentFixture<TestBasicFloatLabelComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestBasicFloatLabelComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestBasicFloatLabelComponent);
            component = fixture.componentInstance;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should render input and label content', () => {
            const inputElement = fixture.debugElement.query(By.css('input'));
            const labelElement = fixture.debugElement.query(By.css('label'));

            expect(inputElement).toBeTruthy();
            expect(labelElement).toBeTruthy();
            expect(labelElement.nativeElement.textContent.trim()).toBe('Username');
            expect(inputElement.nativeElement.id).toBe('username');
        });

        it('should have correct CSS class', () => {
            const floatLabelElement = fixture.debugElement.query(By.directive(FloatLabel));
            expect(floatLabelElement.nativeElement.classList.contains('p-floatlabel')).toBe(true);
        });
    });

    describe('Variant Tests', () => {
        let component: TestVariantFloatLabelComponent;
        let fixture: ComponentFixture<TestVariantFloatLabelComponent>;
        let floatLabelInstance: FloatLabel;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestVariantFloatLabelComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestVariantFloatLabelComponent);
            component = fixture.componentInstance;
            floatLabelInstance = fixture.debugElement.query(By.directive(FloatLabel)).componentInstance;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
        });

        it('should have default variant "over"', () => {
            expect(floatLabelInstance.variant()).toBe('over');
        });

        it('should apply variant "in"', async () => {
            component.variant = 'in';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(floatLabelInstance.variant()).toBe('in');
        });

        it('should apply variant "on"', async () => {
            component.variant = 'on';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(floatLabelInstance.variant()).toBe('on');
        });

        it('should have correct variant classes', async () => {
            const floatLabelElement = fixture.debugElement.query(By.directive(FloatLabel));

            // Test 'in' variant
            component.variant = 'in';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(floatLabelElement.nativeElement.classList.contains('p-floatlabel-in')).toBe(true);

            // Test 'on' variant
            component.variant = 'on';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(floatLabelElement.nativeElement.classList.contains('p-floatlabel-on')).toBe(true);

            // Test 'over' variant (default)
            component.variant = 'over';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(floatLabelElement.nativeElement.classList.contains('p-floatlabel-over')).toBe(true);
        });
    });

    describe('Class Attribute', () => {
        let component: TestClassFloatLabelComponent;
        let fixture: ComponentFixture<TestClassFloatLabelComponent>;
        let floatLabelElement: HTMLElement;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestClassFloatLabelComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestClassFloatLabelComponent);
            component = fixture.componentInstance;
            floatLabelElement = fixture.debugElement.query(By.directive(FloatLabel)).nativeElement;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
        });

        it('should keep the static class attribute alongside the root class', () => {
            expect(floatLabelElement.classList.contains('p-floatlabel')).toBe(true);
            expect(floatLabelElement.classList.contains('p-floatlabel-over')).toBe(true);
            expect(floatLabelElement.classList.contains('static-class')).toBe(true);
        });

        it('should re-render the bound class attribute when it changes', async () => {
            component.dynamicClass = 'dynamic-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(floatLabelElement.classList.contains('dynamic-class')).toBe(true);
            expect(floatLabelElement.classList.contains('static-class')).toBe(true);
            expect(floatLabelElement.classList.contains('p-floatlabel')).toBe(true);

            component.dynamicClass = 'other-class';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            expect(floatLabelElement.classList.contains('other-class')).toBe(true);
            expect(floatLabelElement.classList.contains('dynamic-class')).toBe(false);
            expect(floatLabelElement.classList.contains('p-floatlabel')).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        let component: TestBasicFloatLabelComponent;
        let fixture: ComponentFixture<TestBasicFloatLabelComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestBasicFloatLabelComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestBasicFloatLabelComponent);
            component = fixture.componentInstance;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
        });

        it('should work without input value', () => {
            const inputElement = fixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.value).toBe('' as any);
        });

        it('should update input value when model changes', async () => {
            component.value = 'test value';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const inputElement = fixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.value).toBe('test value');
        });
    });
});

describe('FloatLabel PassThrough Tests', () => {
    let fixture: ComponentFixture<FloatLabel>;
    let component: FloatLabel;
    let hostElement: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FloatLabel, FormsModule],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(FloatLabel);
        component = fixture.componentInstance;
        hostElement = fixture.nativeElement;
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

        it('should apply simple string classes to both host and root', () => {
            fixture.componentRef.setInput('pt', {
                host: 'HOST_CLASS',
                root: 'ROOT_CLASS'
            });
            fixture.detectChanges();

            expect(hostElement.classList.contains('HOST_CLASS')).toBe(true);
            expect(hostElement.classList.contains('ROOT_CLASS')).toBe(true);
        });
    });

    describe('PT Case 2: Objects with class, style, and attributes', () => {
        it('should apply object with class to root', () => {
            fixture.componentRef.setInput('pt', {
                root: {
                    class: 'PT_ROOT_OBJECT_CLASS'
                }
            });
            fixture.detectChanges();

            expect(hostElement.classList.contains('PT_ROOT_OBJECT_CLASS')).toBe(true);
        });

        it('should apply object with style to root', () => {
            fixture.componentRef.setInput('pt', {
                root: {
                    style: { 'background-color': 'red' }
                }
            });
            fixture.detectChanges();

            expect(hostElement.style.backgroundColor).toBe('red');
        });

        it('should apply object with data attributes to root', () => {
            fixture.componentRef.setInput('pt', {
                root: {
                    'data-p-test': 'true'
                }
            });
            fixture.detectChanges();

            expect(hostElement.getAttribute('data-p-test')).toBe('true');
        });

        it('should apply object with aria attributes to root', () => {
            fixture.componentRef.setInput('pt', {
                root: {
                    'aria-label': 'TEST_ARIA_LABEL'
                }
            });
            fixture.detectChanges();

            expect(hostElement.getAttribute('aria-label')).toBe('TEST_ARIA_LABEL');
        });

        it('should apply multiple properties at once', () => {
            fixture.componentRef.setInput('pt', {
                root: {
                    class: 'MULTI_CLASS',
                    style: { color: 'blue' },
                    'data-test': 'value',
                    'aria-label': 'MULTI_ARIA'
                }
            });
            fixture.detectChanges();

            expect(hostElement.classList.contains('MULTI_CLASS')).toBe(true);
            expect(hostElement.style.color).toBe('blue');
            expect(hostElement.getAttribute('data-test')).toBe('value');
            expect(hostElement.getAttribute('aria-label')).toBe('MULTI_ARIA');
        });
    });

    describe('PT Case 3: Mixed object and string values', () => {
        it('should apply mixed string and object PT options', () => {
            fixture.componentRef.setInput('pt', {
                host: 'HOST_STRING',
                root: {
                    class: 'ROOT_OBJECT_CLASS',
                    style: { 'border-color': 'green' }
                }
            });
            fixture.detectChanges();

            expect(hostElement.classList.contains('HOST_STRING')).toBe(true);
            expect(hostElement.classList.contains('ROOT_OBJECT_CLASS')).toBe(true);
            expect(hostElement.style.borderColor).toBe('green');
        });
    });

    describe('PT Case 4: Use variables from instance', () => {
        it('should access instance variables in PT function', () => {
            fixture.componentRef.setInput('variant', 'in');
            fixture.componentRef.setInput('pt', {
                root: ({ instance }: any) => ({
                    class: instance?.variant() === 'in' ? 'VARIANT_IN' : ''
                })
            });
            fixture.detectChanges();

            expect(hostElement.classList.contains('VARIANT_IN')).toBe(true);
        });

        it('should conditionally apply styles based on instance state', () => {
            fixture.componentRef.setInput('variant', 'over');
            fixture.componentRef.setInput('pt', {
                root: ({ instance }: any) => ({
                    style: {
                        'background-color': instance?.variant() === 'over' ? 'yellow' : 'red'
                    }
                })
            });
            fixture.detectChanges();

            expect(hostElement.style.backgroundColor).toBe('yellow');
        });
    });

    describe('PT Case 5: Event binding', () => {
        it('should handle onclick event through PT', async () => {
            let clicked = false;
            await new Promise<void>((resolve) => {
                fixture.componentRef.setInput('pt', {
                    root: {
                        onclick: () => {
                            clicked = true;
                            resolve();
                        }
                    }
                });
                fixture.detectChanges();

                hostElement.click();
            });

            expect(clicked).toBe(true);
        });

        it('should read instance state through a PT event handler', () => {
            let captured: string | undefined;
            fixture.componentRef.setInput('variant', 'on');
            fixture.componentRef.setInput('pt', {
                root: ({ instance }: any) => ({
                    onclick: () => {
                        captured = instance.variant();
                    }
                })
            });
            fixture.detectChanges();

            hostElement.click();
            expect(captured).toBe('on');
        });
    });

    describe('PT Case 6: Inline PT', () => {
        it('should work with inline string PT', () => {
            const inlineFixture = TestBed.createComponent(TestInlineStringPTComponent);
            inlineFixture.detectChanges();

            const inlineHostElement = inlineFixture.nativeElement.querySelector('p-floatlabel');
            expect(inlineHostElement.classList.contains('INLINE_STRING')).toBe(true);
        });

        it('should work with inline object PT', () => {
            const inlineFixture = TestBed.createComponent(TestInlineObjectPTComponent);
            inlineFixture.detectChanges();

            const inlineHostElement = inlineFixture.nativeElement.querySelector('p-floatlabel');
            expect(inlineHostElement.classList.contains('INLINE_OBJECT_CLASS')).toBe(true);
            expect(inlineHostElement.getAttribute('data-inline')).toBe('true');
        });
    });

    describe('PT Case 7: Global PT from ExhaustiveConfig', () => {
        it('should apply global PT configuration to all instances', async () => {
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [FloatLabel, FormsModule],
                providers: [
                    provideExhaustive({
                        pt: {
                            floatLabel: {
                                host: { 'aria-label': 'GLOBAL_ARIA_LABEL' },
                                root: 'GLOBAL_CLASS'
                            }
                        }
                    }),
                    provideZonelessChangeDetection()
                ]
            }).compileComponents();

            const globalFixture = TestBed.createComponent(FloatLabel);
            globalFixture.detectChanges();

            const globalHostElement = globalFixture.nativeElement;
            expect(globalHostElement.classList.contains('GLOBAL_CLASS')).toBe(true);
            expect(globalHostElement.getAttribute('aria-label')).toBe('GLOBAL_ARIA_LABEL');
        });

        it('should apply global PT to multiple component instances', async () => {
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [FloatLabel, FormsModule, TestMultipleInstancesComponent],
                providers: [
                    provideExhaustive({
                        pt: {
                            floatLabel: {
                                root: {
                                    class: 'MULTI_GLOBAL_CLASS',
                                    'data-global': 'true'
                                }
                            }
                        }
                    }),
                    provideZonelessChangeDetection()
                ]
            }).compileComponents();

            const multiFixture = TestBed.createComponent(TestMultipleInstancesComponent);
            multiFixture.detectChanges();

            const floatLabels = multiFixture.nativeElement.querySelectorAll('p-floatlabel');
            expect(floatLabels.length).toBe(2);

            floatLabels.forEach((fl: HTMLElement) => {
                expect(fl.classList.contains('MULTI_GLOBAL_CLASS')).toBe(true);
                expect(fl.getAttribute('data-global')).toBe('true');
            });
        });
    });

    describe('PT Case 8: Lifecycle hooks', () => {
        it('should support onInit hook', async () => {
            const hooksCalled: string[] = [];
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [FloatLabel, FormsModule],
                providers: [
                    provideExhaustive({
                        pt: {
                            floatLabel: {
                                hooks: {
                                    onInit: () => {
                                        hooksCalled.push('onInit');
                                    }
                                }
                            }
                        }
                    }),
                    provideZonelessChangeDetection()
                ]
            }).compileComponents();

            const hookFixture = TestBed.createComponent(FloatLabel);
            hookFixture.detectChanges();

            expect(hooksCalled).toContain('onInit');
        });

        it('should support onAfterViewInit hook', async () => {
            const hooksCalled: string[] = [];
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [FloatLabel, FormsModule],
                providers: [
                    provideExhaustive({
                        pt: {
                            floatLabel: {
                                hooks: {
                                    onAfterViewInit: () => {
                                        hooksCalled.push('onAfterViewInit');
                                    }
                                }
                            }
                        }
                    }),
                    provideZonelessChangeDetection()
                ]
            }).compileComponents();

            const hookFixture = TestBed.createComponent(FloatLabel);
            hookFixture.detectChanges();

            expect(hooksCalled).toContain('onAfterViewInit');
        });

        it('should support onAfterViewChecked hook', async () => {
            const hooksCalled: string[] = [];
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [FloatLabel, FormsModule],
                providers: [
                    provideExhaustive({
                        pt: {
                            floatLabel: {
                                hooks: {
                                    onAfterViewChecked: () => {
                                        if (!hooksCalled.includes('onAfterViewChecked')) {
                                            hooksCalled.push('onAfterViewChecked');
                                        }
                                    }
                                }
                            }
                        }
                    }),
                    provideZonelessChangeDetection()
                ]
            }).compileComponents();

            const hookFixture = TestBed.createComponent(FloatLabel);
            hookFixture.detectChanges();

            expect(hooksCalled).toContain('onAfterViewChecked');
        });

        it('should support onDestroy hook', async () => {
            const hooksCalled: string[] = [];
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [FloatLabel, FormsModule],
                providers: [
                    provideExhaustive({
                        pt: {
                            floatLabel: {
                                hooks: {
                                    onDestroy: () => {
                                        hooksCalled.push('onDestroy');
                                    }
                                }
                            }
                        }
                    }),
                    provideZonelessChangeDetection()
                ]
            }).compileComponents();

            const hookFixture = TestBed.createComponent(FloatLabel);
            hookFixture.detectChanges();

            hookFixture.destroy();

            expect(hooksCalled).toContain('onDestroy');
        });

        it('should support multiple lifecycle hooks', async () => {
            const hooksCalled: string[] = [];
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [FloatLabel, FormsModule],
                providers: [
                    provideExhaustive({
                        pt: {
                            floatLabel: {
                                hooks: {
                                    onInit: () => {
                                        hooksCalled.push('onInit');
                                    },
                                    onAfterViewInit: () => {
                                        hooksCalled.push('onAfterViewInit');
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
                    }),
                    provideZonelessChangeDetection()
                ]
            }).compileComponents();

            const hookFixture = TestBed.createComponent(FloatLabel);
            hookFixture.detectChanges();

            expect(hooksCalled).toContain('onInit');
            expect(hooksCalled).toContain('onAfterViewInit');
            expect(hooksCalled).toContain('onAfterViewChecked');

            hookFixture.destroy();

            expect(hooksCalled).toContain('onDestroy');
        });
    });
});

// Test components for inline PT tests
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [FloatLabel, FormsModule],
    template: `<p-floatlabel [pt]="{ root: 'INLINE_STRING' }"><input /></p-floatlabel>`
})
class TestInlineStringPTComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [FloatLabel, FormsModule],
    template: `<p-floatlabel [pt]="{ root: { class: 'INLINE_OBJECT_CLASS', 'data-inline': 'true' } }"><input /></p-floatlabel>`
})
class TestInlineObjectPTComponent {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [FloatLabel, FormsModule],
    template: `
        <p-floatlabel><input /></p-floatlabel>
        <p-floatlabel><input /></p-floatlabel>
    `
})
class TestMultipleInstancesComponent {}

@Component({
    standalone: true,
    imports: [FloatLabel, Select, InputText],
    template: `
        <p-floatlabel id="input">
            <input pInputText id="i" placeholder="Type" />
            <label for="i">Input</label>
        </p-floatlabel>
        <p-floatlabel id="select">
            <p-select [options]="options" placeholder="Pick one" inputId="s" />
            <label for="s">Select</label>
        </p-floatlabel>
        <p-floatlabel id="empty">
            <p-select [options]="options" inputId="e" />
            <label for="e">Empty</label>
        </p-floatlabel>
    `
})
class FloatLabelPlaceholderHostComponent {
    options = ['One', 'Two'];
}

describe('FloatLabel with a select placeholder (optimus-ui#501)', () => {
    it('should float the label above a select showing its placeholder, like an input with a placeholder', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [FloatLabelPlaceholderHostComponent],
            providers: [provideZonelessChangeDetection(), provideExhaustive({ theme: { preset: Aura } })]
        });
        const fixture = TestBed.createComponent(FloatLabelPlaceholderHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const host = fixture.nativeElement as HTMLElement;
        const top = (id: string) => getComputedStyle(host.querySelector(`#${id} label`)!).top;
        expect(host.querySelector('#select .p-placeholder')).toBeTruthy();
        expect(top('select')).toBe(top('input'));
        expect(top('empty')).not.toBe(top('input'));
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [FloatLabel, InputText, Select, DatePicker, Textarea, IconField, InputIcon, FormsModule],
    template: `
        @for (filled of [false, true]; track filled) {
            <div style="margin: 48px 0; width: 300px" [attr.data-state]="filled ? 'filled' : 'empty'">
                <p-floatlabel [variant]="variant">
                    @switch (family) {
                        @case ('inputtext') {
                            <input pInputText [id]="'f' + $index" [pSize]="size" [ngModel]="filled ? 'Value' : ''" />
                        }
                        @case ('select') {
                            <p-select [options]="options" [size]="size" [inputId]="'f' + $index" [ngModel]="filled ? 'Value' : null" />
                        }
                        @case ('datepicker') {
                            <p-datepicker [size]="size" [inputId]="'f' + $index" [ngModel]="filled ? date : null" />
                        }
                        @case ('textarea') {
                            <textarea pTextarea [id]="'f' + $index" [pSize]="size" rows="2" [ngModel]="filled ? 'Value' : ''"></textarea>
                        }
                        @case ('iconfield') {
                            <p-iconfield>
                                <p-inputicon class="pi pi-search" />
                                <input pInputText [id]="'f' + $index" [pSize]="size" [ngModel]="filled ? 'Value' : ''" />
                            </p-iconfield>
                        }
                    }
                    <label [for]="'f' + $index">Label</label>
                </p-floatlabel>
            </div>
        }
    `
})
class FloatLabelSizeHostComponent {
    variant: 'over' | 'in' | 'on' = 'over';
    size: 'small' | 'large' | undefined = undefined;
    family = 'inputtext';
    options = ['Value', 'Other'];
    date = new Date(2026, 0, 15);
}

interface LabelLayout {
    fieldHeight: number;
    textFontSize: number;
    textLeft: number;
    textTop: number;
    labelFontSize: number;
    labelLeft: number;
    labelTop: number;
    labelBottom: number;
}

// Positions are relative to the outer box of the field; textLeft/textTop locate the content box of the text.
function measureLabel(container: HTMLElement): LabelLayout {
    const field = container.querySelector('.p-select, .p-textarea, .p-inputtext') as HTMLElement;
    const text = container.querySelector('.p-select-label, textarea, input') as HTMLElement;
    const label = container.querySelector('label') as HTMLElement;
    const fieldBox = field.getBoundingClientRect();
    const textBox = text.getBoundingClientRect();
    const labelBox = label.getBoundingClientRect();
    const textStyle = getComputedStyle(text);

    return {
        fieldHeight: fieldBox.height,
        textFontSize: parseFloat(textStyle.fontSize),
        textLeft: textBox.left + parseFloat(textStyle.borderLeftWidth) + parseFloat(textStyle.paddingLeft) - fieldBox.left,
        textTop: textBox.top + parseFloat(textStyle.borderTopWidth) + parseFloat(textStyle.paddingTop) - fieldBox.top,
        labelFontSize: parseFloat(getComputedStyle(label).fontSize),
        labelLeft: labelBox.left - fieldBox.left,
        labelTop: labelBox.top - fieldBox.top,
        labelBottom: labelBox.bottom - fieldBox.top
    };
}

describe('FloatLabel sizes (Aura)', () => {
    async function render(variant: 'over' | 'in' | 'on', size: 'small' | 'large' | undefined, family: string) {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [FloatLabelSizeHostComponent],
            providers: [provideZonelessChangeDetection(), provideExhaustive({ theme: { preset: Aura } })]
        });
        const fixture = TestBed.createComponent(FloatLabelSizeHostComponent);
        Object.assign(fixture.componentInstance, { variant, size, family });
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        // let the label transition (0.2s) end
        await new Promise((resolve) => setTimeout(resolve, 300));
        const host = fixture.nativeElement as HTMLElement;

        return {
            fixture,
            empty: measureLabel(host.querySelector('[data-state="empty"]')!),
            filled: measureLabel(host.querySelector('[data-state="filled"]')!)
        };
    }

    // Layout of the default size before the size support: it stays pixel-identical.
    const defaults = {
        over: { inputtext: 36, select: 36, datepicker: 36, textarea: 54, floatedTop: -20 },
        in: { inputtext: 52, select: 52, datepicker: 52, textarea: 70, floatedTop: 8 },
        on: { inputtext: 36, select: 36, datepicker: 36, textarea: 54, floatedTop: -6 }
    };
    const inHeights = { small: 44, large: 60 };
    const floatedFontSizes = { small: 11, default: 12, large: 13 };

    for (const variant of ['over', 'in', 'on'] as const) {
        for (const size of [undefined, 'small', 'large'] as const) {
            for (const family of ['inputtext', 'select', 'datepicker', 'textarea'] as const) {
                it(`${variant} / ${size ?? 'default'} / ${family}: the label follows the size of the field`, async () => {
                    const { fixture, empty, filled } = await render(variant, size, family);

                    for (const layout of [empty, filled]) {
                        expect(Math.abs(layout.labelLeft - layout.textLeft)).toBeLessThanOrEqual(1);
                    }
                    expect(empty.labelFontSize).toBe(empty.textFontSize);
                    expect(filled.labelFontSize).toBe(floatedFontSizes[size ?? 'default']);
                    if (variant === 'over') {
                        expect(filled.labelBottom).toBeLessThanOrEqual(0);
                    } else {
                        expect(filled.labelBottom).toBeLessThanOrEqual(filled.textTop);
                    }

                    if (!size) {
                        expect(filled.fieldHeight).toBe(defaults[variant][family]);
                        expect(filled.labelTop).toBe(defaults[variant].floatedTop);
                        expect(filled.labelLeft).toBe(12);
                        expect(empty.labelFontSize).toBe(16);
                    } else if (variant === 'in' && family !== 'textarea') {
                        expect(filled.fieldHeight).toBe(inHeights[size]);
                    }

                    fixture.destroy();
                });
            }
        }
    }

    it('keeps the label after a left icon aligned with the text for every size', async () => {
        for (const size of [undefined, 'small', 'large'] as const) {
            const { fixture, empty, filled } = await render('in', size, 'iconfield');

            for (const layout of [empty, filled]) {
                expect(Math.abs(layout.labelLeft - layout.textLeft)).toBeLessThanOrEqual(1);
            }
            expect(filled.labelBottom).toBeLessThanOrEqual(filled.textTop);
            fixture.destroy();
        }
    });
});
