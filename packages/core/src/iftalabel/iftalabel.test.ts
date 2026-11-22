import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Base } from '@exhaustive-ui/core/base';
import { DatePicker } from '@exhaustive-ui/core/datepicker';
import { InputText } from '@exhaustive-ui/core/inputtext';
import { Select } from '@exhaustive-ui/core/select';
import { Textarea } from '@exhaustive-ui/core/textarea';
import { Theme } from '@exhaustive-ui/styled';
import Aura from '@exhaustive-ui/themes/aura';
import { IftaLabel } from './iftalabel';
import { provideExhaustive } from '@exhaustive-ui/core/config';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [IftaLabel, FormsModule],
    template: `
        <p-iftalabel>
            <input id="username" [(ngModel)]="value" />
            <label for="username">Username</label>
        </p-iftalabel>
    `
})
class TestBasicIftaLabelComponent {
    value: string = '';
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [IftaLabel, FormsModule],
    template: `
        <p-iftalabel>
            <input id="email" type="email" [(ngModel)]="email" />
            <label for="email">Email Address</label>
        </p-iftalabel>
    `
})
class TestEmailIftaLabelComponent {
    email: string = '';
}

describe('IftaLabel', () => {
    describe('Basic Functionality', () => {
        let component: TestBasicIftaLabelComponent;
        let fixture: ComponentFixture<TestBasicIftaLabelComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestBasicIftaLabelComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestBasicIftaLabelComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
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
            const iftaLabelElement = fixture.debugElement.query(By.directive(IftaLabel));
            expect(iftaLabelElement.nativeElement.classList.contains('p-iftalabel')).toBe(true);
        });
    });

    describe('Form Integration', () => {
        let component: TestEmailIftaLabelComponent;
        let fixture: ComponentFixture<TestEmailIftaLabelComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestEmailIftaLabelComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestEmailIftaLabelComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should work with email input type', () => {
            const inputElement = fixture.debugElement.query(By.css('input'));
            const labelElement = fixture.debugElement.query(By.css('label'));

            expect(inputElement.nativeElement.type).toBe('email');
            expect(labelElement.nativeElement.textContent.trim()).toBe('Email Address');
        });

        it('should update input value when model changes', async () => {
            component.email = 'test@example.com';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const inputElement = fixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.value).toBe('test@example.com');
        });
    });

    describe('Edge Cases', () => {
        let component: TestBasicIftaLabelComponent;
        let fixture: ComponentFixture<TestBasicIftaLabelComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestBasicIftaLabelComponent],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            fixture = TestBed.createComponent(TestBasicIftaLabelComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should work without input value', () => {
            const inputElement = fixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.value).toBe('' as any);
        });

        it('should handle empty string model', async () => {
            component.value = '';
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();

            const inputElement = fixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.value).toBe('' as any);
        });
    });
});

describe('IftaLabel PassThrough Tests', () => {
    let fixture: ComponentFixture<IftaLabel>;
    let component: IftaLabel;
    let hostElement: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IftaLabel, FormsModule],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(IftaLabel);
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
    });

    describe('PT Case 2: Objects with properties', () => {
        it('should apply object with class to root', () => {
            fixture.componentRef.setInput('pt', {
                root: {
                    class: 'PT_ROOT_CLASS',
                    style: { color: 'blue' },
                    'data-testid': 'iftalabel'
                }
            });
            fixture.detectChanges();

            expect(hostElement.classList.contains('PT_ROOT_CLASS')).toBe(true);
            expect(hostElement.style.color).toBe('blue');
            expect(hostElement.getAttribute('data-testid')).toBe('iftalabel');
        });
    });

    describe('PT Case 3: Instance variables', () => {
        it('should access instance variables in PT function', () => {
            fixture.componentRef.setInput('pt', {
                root: ({ instance }: any) => ({
                    class: instance ? 'HAS_INSTANCE' : ''
                })
            });
            fixture.detectChanges();

            expect(hostElement.classList.contains('HAS_INSTANCE')).toBe(true);
        });
    });

    describe('PT Case 4: Event binding', () => {
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
    });

    describe('PT Case 5: Global PT from ExhaustiveConfig', () => {
        it('should apply global PT configuration', async () => {
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [IftaLabel, FormsModule],
                providers: [
                    provideZonelessChangeDetection(),
                    provideExhaustive({
                        pt: {
                            iftaLabel: {
                                host: { 'aria-label': 'GLOBAL_LABEL' },
                                root: 'GLOBAL_CLASS'
                            }
                        }
                    })
                ]
            }).compileComponents();

            const globalFixture = TestBed.createComponent(IftaLabel);
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
                imports: [IftaLabel, FormsModule],
                providers: [
                    provideZonelessChangeDetection(),
                    provideExhaustive({
                        pt: {
                            iftaLabel: {
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

            const hookFixture = TestBed.createComponent(IftaLabel);
            hookFixture.detectChanges();

            expect(hooksCalled).toContain('onInit');
            expect(hooksCalled).toContain('onAfterViewChecked');

            hookFixture.destroy();

            expect(hooksCalled).toContain('onDestroy');
        });
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [IftaLabel, InputText, Select, DatePicker, Textarea, FormsModule],
    template: `
        <div style="width: 300px">
            <p-iftalabel>
                @switch (family) {
                    @case ('inputtext') {
                        <input pInputText id="field" [pSize]="size" [ngModel]="'Value'" />
                    }
                    @case ('select') {
                        <p-select [options]="options" [size]="size" inputId="field" [ngModel]="'Value'" />
                    }
                    @case ('datepicker') {
                        <p-datepicker [size]="size" inputId="field" [ngModel]="date" />
                    }
                    @case ('textarea') {
                        <textarea pTextarea id="field" [pSize]="size" rows="2" [ngModel]="'Value'"></textarea>
                    }
                }
                <label for="field">Label</label>
            </p-iftalabel>
        </div>
    `
})
class IftaLabelSizeHostComponent {
    size: 'small' | 'large' | undefined = undefined;
    family = 'inputtext';
    options = ['Value', 'Other'];
    date = new Date(2026, 0, 15);
}

describe('IftaLabel sizes (Aura)', () => {
    // Tests that load a theme preset change the global Theme state and add <style> tags to the document:
    // reset them so the following tests keep their layout.
    afterEach(() => {
        Theme._theme = undefined;
        Theme._tokens = {};
        Theme.clearLoadedStyleNames();
        Base.clearLoadedStyleNames();
        document.head.querySelectorAll('style[data-exhaustive-style-id]').forEach((style) => style.remove());
    });

    // Layout of the default size before the size support: it stays pixel-identical.
    const defaultHeights = { inputtext: 52, select: 52, datepicker: 52, textarea: 70 };
    const sizes = {
        small: { labelFontSize: 11, height: 44 },
        default: { labelFontSize: 12, height: 52 },
        large: { labelFontSize: 13, height: 60 }
    };

    for (const size of [undefined, 'small', 'large'] as const) {
        for (const family of ['inputtext', 'select', 'datepicker', 'textarea'] as const) {
            it(`${size ?? 'default'} / ${family}: the label follows the size of the field`, async () => {
                TestBed.resetTestingModule();
                TestBed.configureTestingModule({
                    imports: [IftaLabelSizeHostComponent],
                    providers: [provideZonelessChangeDetection(), provideExhaustive({ theme: { preset: Aura } })]
                });
                const fixture = TestBed.createComponent(IftaLabelSizeHostComponent);
                Object.assign(fixture.componentInstance, { size, family });
                fixture.detectChanges();
                await fixture.whenStable();
                fixture.detectChanges();

                const host = fixture.nativeElement as HTMLElement;
                const field = host.querySelector('.p-select, .p-textarea, .p-inputtext') as HTMLElement;
                const text = host.querySelector('.p-select-label, textarea, input') as HTMLElement;
                const label = host.querySelector('label') as HTMLElement;
                const fieldBox = field.getBoundingClientRect();
                const textBox = text.getBoundingClientRect();
                const labelBox = label.getBoundingClientRect();
                const textStyle = getComputedStyle(text);
                const textLeft = textBox.left + parseFloat(textStyle.borderLeftWidth) + parseFloat(textStyle.paddingLeft) - fieldBox.left;
                const textTop = textBox.top + parseFloat(textStyle.borderTopWidth) + parseFloat(textStyle.paddingTop) - fieldBox.top;
                const expected = sizes[size ?? 'default'];

                expect(Math.abs(labelBox.left - fieldBox.left - textLeft)).toBeLessThanOrEqual(1);
                expect(parseFloat(getComputedStyle(label).fontSize)).toBe(expected.labelFontSize);
                expect(labelBox.top).toBeGreaterThan(fieldBox.top);
                expect(labelBox.bottom - fieldBox.top).toBeLessThanOrEqual(textTop);
                if (!size) {
                    expect(fieldBox.height).toBe(defaultHeights[family]);
                    expect(labelBox.top - fieldBox.top).toBe(8);
                    expect(labelBox.left - fieldBox.left).toBe(12);
                } else if (family !== 'textarea') {
                    expect(fieldBox.height).toBe(expected.height);
                }

                fixture.destroy();
            });
        }
    }
});
