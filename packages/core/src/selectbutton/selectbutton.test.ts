import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { SharedModule } from '@exhaustive-ui/core/api';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import { ToggleButton } from '@exhaustive-ui/core/togglebutton';
import { SelectButton, SelectButtonModule } from './selectbutton';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { PrimeTemplate } from '@exhaustive-ui/core/api';
describe('SelectButton', () => {
    let component: SelectButton;
    let fixture: ComponentFixture<SelectButton>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SelectButton, SelectButtonModule, FormsModule, ReactiveFormsModule, CommonModule, SharedModule, TestSelectButtonPTemplateComponent, TestSelectButtonRefTemplateComponent],
            declarations: [TestFormSelectButtonComponent, TestPrimeTemplateSelectButtonComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(SelectButton);
        component = fixture.componentInstance;
    });

    describe('Component Initialization', () => {
        it('should create the component', () => {
            expect(component).toBeTruthy();
        });

        it('should have default values', () => {
            expect(component.multiple()).toBeUndefined();
            expect(component.allowEmpty()).toBe(true);
            expect(component.tabindex()).toBe(0);
            expect(component.focusedIndex()).toBe(0);
            expect(component.unselectable()).toBe(false);
        });

        it('should accept custom values', async () => {
            fixture.componentRef.setInput('options', [{ label: 'Option 1', value: 'opt1' }]);
            fixture.componentRef.setInput('multiple', true);
            fixture.componentRef.setInput('allowEmpty', false);
            fixture.componentRef.setInput('styleClass', 'custom-class');

            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(component.options()?.length).toBe(1);
            expect(component.multiple()).toBe(true);
            expect(component.allowEmpty()).toBe(false);
            expect(component.styleClass()).toBe('custom-class');
        });

        it('should set unselectable property correctly', () => {
            fixture.componentRef.setInput('unselectable', true);
            expect(component.unselectable()).toBe(true);
            expect(component.getAllowEmpty()).toBe(false);

            fixture.componentRef.setInput('unselectable', false);
            expect(component.unselectable()).toBe(false);
            expect(component.getAllowEmpty()).toBe(true);
        });
    });

    describe('Public Methods', () => {
        beforeEach(async () => {
            fixture.componentRef.setInput('options', [
                { label: 'Option 1', value: 'opt1' },
                { label: 'Option 2', value: 'opt2' },
                { label: 'Option 3', value: 'opt3', disabled: true }
            ]);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();
        });

        it('should get option label correctly', () => {
            expect(component.getOptionLabel(component.options()![0])).toBe('Option 1');

            fixture.componentRef.setInput('optionLabel', 'label');
            expect(component.getOptionLabel({ label: 'Custom Label' })).toBe('Custom Label');

            // Test with object that has no label property - should return the object itself
            fixture.componentRef.setInput('optionLabel', undefined);
            const objectOption = { name: 'Test Object', id: 1 };
            const result = component.getOptionLabel(objectOption);
            expect(result).toEqual(objectOption);
        });

        it('should get option value correctly', () => {
            expect(component.getOptionValue(component.options()![0])).toBe('opt1');

            fixture.componentRef.setInput('optionValue', 'value');
            expect(component.getOptionValue({ value: 'custom-value' })).toBe('custom-value');

            fixture.componentRef.setInput('optionValue', undefined);
            fixture.componentRef.setInput('optionLabel', undefined);
            expect(component.getOptionValue({ id: 1, name: 'Test' })).toEqual({ id: 1, name: 'Test' });
        });

        it('should check if option is disabled', () => {
            expect(component.isOptionDisabled(component.options()![0])).toBe(false);
            expect(component.isOptionDisabled(component.options()![2])).toBe(true);

            fixture.componentRef.setInput('optionDisabled', 'disabled');
            expect(component.isOptionDisabled({ disabled: true })).toBe(true);
            expect(component.isOptionDisabled({ disabled: false })).toBe(false);
        });

        it('should check if option is selected in single mode', () => {
            component.value.set('opt1');
            expect(component.isSelected(component.options()![0])).toBe(true);
            expect(component.isSelected(component.options()![1])).toBe(false);
        });

        it('should check if option is selected in multiple mode', () => {
            fixture.componentRef.setInput('multiple', true);
            component.value.set(['opt1', 'opt2']);

            expect(component.isSelected(component.options()![0])).toBe(true);
            expect(component.isSelected(component.options()![1])).toBe(true);
            expect(component.isSelected(component.options()![2])).toBe(false);
        });

        it('should remove option from value array', () => {
            fixture.componentRef.setInput('multiple', true);
            component.value.set(['opt1', 'opt2']);

            component.removeOption(component.options()![0]);

            expect(component.value()).toEqual(['opt2']);
        });

        it('should get correct allow empty value for single mode', () => {
            fixture.componentRef.setInput('allowEmpty', true);
            expect(component.getAllowEmpty()).toBe(true);

            fixture.componentRef.setInput('allowEmpty', false);
            expect(component.getAllowEmpty()).toBe(false);
        });

        it('should get correct allow empty value for multiple mode', () => {
            fixture.componentRef.setInput('multiple', true);
            fixture.componentRef.setInput('allowEmpty', false);
            component.value.set(['opt1']);

            expect(component.getAllowEmpty()).toBe(false);

            component.value.set(['opt1', 'opt2']);
            expect(component.getAllowEmpty()).toBe(true);
        });

        it('should handle option selection in single mode', () => {
            const mockEvent = new Event('click');
            component.onOptionSelect(mockEvent, component.options()![0], 0);

            expect(component.value()).toBe('opt1');
            expect(component.focusedIndex()).toBe(0);
        });

        it('should handle option selection in multiple mode', () => {
            fixture.componentRef.setInput('multiple', true);
            const mockEvent = new Event('click');

            component.onOptionSelect(mockEvent, component.options()![0], 0);
            expect(component.value()).toEqual(['opt1']);

            component.onOptionSelect(mockEvent, component.options()![1], 1);
            expect(component.value()).toEqual(['opt1', 'opt2']);
        });

        it('should handle deselection in multiple mode', () => {
            fixture.componentRef.setInput('multiple', true);
            component.value.set(['opt1', 'opt2']);
            const mockEvent = new Event('click');

            component.onOptionSelect(mockEvent, component.options()![0], 0);
            expect(component.value()).toEqual(['opt2']);
        });

        it('should remove disabled options from the tab order', () => {
            const buttons = fixture.debugElement.queryAll(By.css('p-togglebutton'));

            expect(buttons.map((button) => button.nativeElement.getAttribute('tabindex'))).toEqual(['0', '0', '-1']);
        });

        it('should not select disabled options', () => {
            const mockEvent = new Event('click');
            component.onOptionSelect(mockEvent, component.options()![2], 2);

            expect(component.value()).toBeUndefined();
        });

        it('should emit onChange and onOptionClick events', () => {
            vi.spyOn(component.onChange, 'emit').mockImplementation(() => {});
            vi.spyOn(component.onOptionClick, 'emit').mockImplementation(() => {});

            const mockEvent = new Event('click');
            component.onOptionSelect(mockEvent, component.options()![0], 0);

            expect(component.onChange.emit).toHaveBeenCalledWith({
                originalEvent: mockEvent,
                value: component.value()
            });

            expect(component.onOptionClick.emit).toHaveBeenCalledWith({
                originalEvent: mockEvent,
                option: component.options()![0],
                index: 0
            });
        });
    });

    describe('Form Integration', () => {
        let formTestComponent: TestFormSelectButtonComponent;
        let formTestFixture: ComponentFixture<TestFormSelectButtonComponent>;

        beforeEach(() => {
            formTestFixture = TestBed.createComponent(TestFormSelectButtonComponent);
            formTestComponent = formTestFixture.componentInstance;
            formTestFixture.detectChanges();
        });

        it('should work with reactive forms', async () => {
            formTestComponent.form.patchValue({ selectedValue: 'option2' });
            formTestFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await formTestFixture.whenStable();

            expect(formTestComponent.form.value.selectedValue).toBe('option2' as any);
        });

        it('should validate required field', async () => {
            expect(formTestComponent.form.invalid).toBe(true);

            formTestComponent.form.patchValue({ selectedValue: 'option1' });
            formTestFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await formTestFixture.whenStable();

            expect(formTestComponent.form.valid).toBe(true);
        });

        it('should handle form reset', async () => {
            formTestComponent.form.patchValue({ selectedValue: 'option1' });
            formTestFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await formTestFixture.whenStable();

            formTestComponent.form.reset();
            formTestFixture.detectChanges();
            await new Promise((resolve) => setTimeout(resolve, 100));
            await formTestFixture.whenStable();

            expect(formTestComponent.form.pristine).toBe(true);
        });
    });

    describe('Template and Content Projection', () => {
        it('should resolve the item pTemplate through the templates query', async () => {
            const templateComponent = TestBed.createComponent(TestPrimeTemplateSelectButtonComponent);
            const selectButtonInstance = templateComponent.debugElement.query(By.css('p-selectbutton')).componentInstance as SelectButton;

            templateComponent.detectChanges();
            await templateComponent.whenStable();
            templateComponent.detectChanges();

            expect(selectButtonInstance._itemTemplate()).toBeDefined();
            expect(templateComponent.nativeElement.querySelectorAll('.prime-template-content').length).toBe(2);
            expect(templateComponent.nativeElement.textContent).toContain('Prime: Option B');
        });
    });

    describe('Edge Cases', () => {
        it('should handle null/undefined options', () => {
            fixture.componentRef.setInput('options', null);
            expect(() => fixture.detectChanges()).not.toThrow();

            fixture.componentRef.setInput('options', undefined);
            expect(() => fixture.detectChanges()).not.toThrow();
        });

        it('should handle empty options array', () => {
            fixture.componentRef.setInput('options', []);
            expect(() => fixture.detectChanges()).not.toThrow();
        });

        it('should handle options with missing properties', () => {
            fixture.componentRef.setInput('options', [{ value: 'opt1' }, { label: 'Option 2' }, {}]);

            expect(() => fixture.detectChanges()).not.toThrow();
            expect(component.getOptionLabel(component.options()![0])).toBe(component.options()![0]);
            expect(component.getOptionValue(component.options()![1])).toBe(component.options()![1]);
        });

        it('should handle selection with dataKey', async () => {
            fixture.componentRef.setInput('dataKey', 'id');
            fixture.componentRef.setInput('options', [
                { id: 1, label: 'Option 1' },
                { id: 2, label: 'Option 2' }
            ]);
            component.value.set({ id: 1, label: 'Option 1' });

            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(component.isSelected(component.options()![0])).toBe(true);
            expect(component.isSelected(component.options()![1])).toBe(false);
        });

        it('should handle rapid selection changes', async () => {
            fixture.componentRef.setInput('options', [
                { label: 'Option 1', value: 'opt1' },
                { label: 'Option 2', value: 'opt2' }
            ]);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            for (let i = 0; i < 5; i++) {
                const optionIndex = i % 2;
                component.onOptionSelect(new Event('click'), component.options()![optionIndex], optionIndex);
                await new Promise((resolve) => setTimeout(resolve, 10));
                await fixture.whenStable();
            }

            expect(component.value()).toBeDefined();
        });

        it('should handle unselectable option correctly', () => {
            fixture.componentRef.setInput('options', [
                { label: 'Option 1', value: 'opt1' },
                { label: 'Option 2', value: 'opt2' }
            ]);
            fixture.componentRef.setInput('unselectable', false);
            fixture.componentRef.setInput('allowEmpty', false);
            component.value.set('opt1');

            const mockEvent = new Event('click');
            component.onOptionSelect(mockEvent, component.options()![0], 0);

            expect(component.value()).toBe('opt1');
        });

        it('should handle disabled component', async () => {
            fixture.componentRef.setInput('options', [
                { label: 'Option 1', value: 'opt1' },
                { label: 'Option 2', value: 'opt2' }
            ]);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            // Mock the disabled state by creating a spy
            vi.spyOn(component, '$disabled').mockReturnValue(true);
            const mockEvent = new Event('click');
            const initialValue = component.value();

            component.onOptionSelect(mockEvent, component.options()![0], 0);

            expect(component.value()).toBe(initialValue);
        });
    });

    describe('Accessibility and Events', () => {
        it('should handle focus events', () => {
            component.onFocus(new Event('focus'), 1);
            expect(component.focusedIndex()).toBe(1);
        });

        it('should handle blur events', () => {
            expect(() => component.onBlur()).not.toThrow();
        });

        it('should change tab indexes correctly', async () => {
            fixture.componentRef.setInput('options', [
                { label: 'Option 1', value: 'opt1' },
                { label: 'Option 2', value: 'opt2' },
                { label: 'Option 3', value: 'opt3' }
            ]);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            const mockEvent = new Event('keydown');
            expect(() => component.changeTabIndexes(mockEvent, 'next')).not.toThrow();
            expect(() => component.changeTabIndexes(mockEvent, 'prev')).not.toThrow();
        });

        it('should have correct equalityKey', () => {
            // Initially equalityKey getter returns null when no dataKey is set
            expect(component.equalityKey()).toBeFalsy();

            fixture.componentRef.setInput('dataKey', 'id');
            expect(component.equalityKey()).toBe('id');

            fixture.componentRef.setInput('optionValue', 'value');
            fixture.componentRef.setInput('dataKey', undefined);
            expect(component.equalityKey()).toBeFalsy();
        });
    });

    describe('Input Properties', () => {
        it('should autofocus only the first option when autofocus is set', async () => {
            document.body.appendChild(fixture.nativeElement);
            fixture.componentRef.setInput('options', [
                { label: 'One', value: 1 },
                { label: 'Two', value: 2 },
                { label: 'Three', value: 3 }
            ]);
            fixture.componentRef.setInput('autofocus', true);
            fixture.detectChanges();
            await fixture.whenStable();

            const buttons = fixture.nativeElement.querySelectorAll('p-togglebutton');
            expect(buttons.length).toBe(3);
            expect(document.activeElement).toBe(buttons[0]);
            fixture.nativeElement.remove();
        });

        it('should handle size input', () => {
            // For input signals, we can't set them directly in tests
            // Instead, we test that the component accepts the input
            expect(component.size).toBeDefined();
            expect(typeof component.size).toBe('function');
        });

        it('should handle fluid input', () => {
            // For input signals, we can't set them directly in tests
            // Instead, we test that the component accepts the input
            expect(component.fluid).toBeDefined();
            expect(typeof component.fluid).toBe('function');
        });

        it('should handle styleClass input', () => {
            fixture.componentRef.setInput('styleClass', 'custom-class');
            expect(component.styleClass()).toBe('custom-class');
        });

        it('should handle ariaLabelledBy input', () => {
            fixture.componentRef.setInput('ariaLabelledBy', 'test-label');
            expect(component.ariaLabelledBy()).toBe('test-label');
        });

        it('should re-render the toggle buttons when options change', async () => {
            fixture.componentRef.setInput('options', ['One', 'Two']);
            fixture.detectChanges();
            await fixture.whenStable();

            expect(fixture.nativeElement.querySelectorAll('p-togglebutton').length).toBe(2);

            fixture.componentRef.setInput('options', ['One', 'Two', 'Three']);
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const buttons = fixture.nativeElement.querySelectorAll('p-togglebutton');
            expect(buttons.length).toBe(3);
            expect(buttons[2].textContent).toContain('Three');
        });

        it('should re-render the toggle button classes when styleClass changes', async () => {
            fixture.componentRef.setInput('options', ['One', 'Two']);
            fixture.componentRef.setInput('styleClass', 'first-class');
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const buttons = fixture.nativeElement.querySelectorAll('p-togglebutton');
            expect(buttons[0].classList.contains('first-class')).toBe(true);
            expect(buttons[0].classList.contains('p-togglebutton')).toBe(true);

            fixture.componentRef.setInput('styleClass', 'second-class');
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttons[0].classList.contains('second-class')).toBe(true);
            expect(buttons[0].classList.contains('first-class')).toBe(false);
            expect(buttons[0].classList.contains('p-togglebutton')).toBe(true);
        });

        it('should re-render the aria-labelledby host attribute when ariaLabelledBy changes', () => {
            fixture.componentRef.setInput('ariaLabelledBy', 'first-label');
            fixture.detectChanges();

            expect(fixture.nativeElement.getAttribute('aria-labelledby')).toBe('first-label');

            fixture.componentRef.setInput('ariaLabelledBy', 'second-label');
            fixture.detectChanges();

            expect(fixture.nativeElement.getAttribute('aria-labelledby')).toBe('second-label');
        });

        it('should re-render the size classes of the toggle buttons when size changes', async () => {
            fixture.componentRef.setInput('options', ['One', 'Two']);
            fixture.componentRef.setInput('size', 'large');
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const buttons = fixture.nativeElement.querySelectorAll('p-togglebutton');
            expect(buttons[0].classList.contains('p-togglebutton-lg')).toBe(true);

            fixture.componentRef.setInput('size', 'small');
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttons[0].classList.contains('p-togglebutton-lg')).toBe(false);
            expect(buttons[0].classList.contains('p-togglebutton-sm')).toBe(true);
        });

        it('should re-render the fluid host class when fluid changes', () => {
            fixture.detectChanges();
            expect(fixture.nativeElement.classList.contains('p-selectbutton-fluid')).toBe(false);

            fixture.componentRef.setInput('fluid', true);
            fixture.detectChanges();

            expect(fixture.nativeElement.classList.contains('p-selectbutton-fluid')).toBe(true);
        });

        it('should re-render the invalid state when invalid changes', () => {
            fixture.detectChanges();
            expect(fixture.nativeElement.classList.contains('p-invalid')).toBe(false);

            fixture.componentRef.setInput('invalid', true);
            fixture.detectChanges();

            expect(fixture.nativeElement.classList.contains('p-invalid')).toBe(true);
            expect(fixture.nativeElement.getAttribute('data-p')).toContain('invalid');
        });

        it('should re-render the checked toggle button after writeValue', async () => {
            fixture.componentRef.setInput('options', ['One', 'Two']);
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const buttons = fixture.nativeElement.querySelectorAll('p-togglebutton');
            expect(buttons[1].getAttribute('aria-pressed')).toBe('false');

            component.writeValue('Two');
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
            expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
            expect(buttons[1].classList.contains('p-togglebutton-checked')).toBe(true);
        });

        it('should re-render the allowEmpty state of the toggle buttons when unselectable changes', async () => {
            fixture.componentRef.setInput('options', ['One', 'Two']);
            fixture.detectChanges();
            await fixture.whenStable();

            const toggleButton = fixture.debugElement.query(By.directive(ToggleButton)).componentInstance as ToggleButton;
            expect(toggleButton.allowEmpty()).toBe(true);

            fixture.componentRef.setInput('unselectable', true);
            fixture.detectChanges();

            expect(toggleButton.allowEmpty()).toBe(false);
        });
    });
});

// Test Components
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <form [formGroup]="form">
            <p-selectbutton [options]="options" formControlName="selectedValue"> </p-selectbutton>
        </form>
    `
})
class TestFormSelectButtonComponent {
    form = new FormGroup({
        selectedValue: new FormControl<string | null>(null, Validators.required)
    });

    options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
    ];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-selectbutton [options]="options">
            <ng-template pTemplate="item" let-option let-index="index">
                <div class="prime-template-content">Prime: {{ option.label }}</div>
            </ng-template>
        </p-selectbutton>
    `
})
class TestPrimeTemplateSelectButtonComponent {
    options = [
        { label: 'Option A', value: 'optionA' },
        { label: 'Option B', value: 'optionB' }
    ];
}

// SelectButton pTemplate component
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [SelectButton, FormsModule, SharedModule],
    template: `
        <p-selectbutton [(ngModel)]="selectedValue" [options]="options">
            <!-- Item template with pTemplate -->
            <ng-template pTemplate="item" let-option let-index="index">
                <span class="custom-template-item" [attr.data-testid]="'ptemplate-item-' + index" [title]="'Template item: ' + option.label + ' at index ' + index">
                    <i class="pi pi-star"></i>
                    {{ option.label }} ({{ option.value }})
                </span>
            </ng-template>
        </p-selectbutton>
    `
})
class TestSelectButtonPTemplateComponent {
    selectedValue: string | undefined;
    options = [
        { label: 'Option One', value: 'opt1' },
        { label: 'Option Two', value: 'opt2' },
        { label: 'Option Three', value: 'opt3' }
    ];
}

// SelectButton #template reference component
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [SelectButton, FormsModule, SharedModule],
    template: `
        <p-selectbutton [(ngModel)]="selectedValue" [options]="options">
            <!-- Item template with #template reference -->
            <ng-template #item let-option let-index="index">
                <span class="custom-ref-item" [attr.data-testid]="'ref-item-' + index" [title]="'Reference item: ' + option.label + ' at index ' + index">
                    <i class="pi pi-heart"></i>
                    {{ option.label }} [{{ option.value }}]
                </span>
            </ng-template>
        </p-selectbutton>
    `
})
class TestSelectButtonRefTemplateComponent {
    selectedValue: string | undefined;
    options = [
        { label: 'Item One', value: 'item1' },
        { label: 'Item Two', value: 'item2' },
        { label: 'Item Three', value: 'item3' }
    ];
}

describe('SelectButton pTemplate Tests', () => {
    let component: TestSelectButtonPTemplateComponent;
    let fixture: ComponentFixture<TestSelectButtonPTemplateComponent>;
    let selectButtonInstance: SelectButton;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestSelectButtonPTemplateComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestSelectButtonPTemplateComponent);
        component = fixture.componentInstance;
        selectButtonInstance = fixture.debugElement.query(By.directive(SelectButton)).componentInstance;
        fixture.detectChanges();
    });

    it('should create component with pTemplate templates', async () => {
        expect(component).toBeTruthy();
        expect(selectButtonInstance).toBeTruthy();
        expect(() => selectButtonInstance.itemTemplate()).not.toThrow();
    });

    it('should pass context parameters to item template', async () => {
        // Verify that the select button component is working with options
        expect(selectButtonInstance.options()).toBeDefined();
        expect(selectButtonInstance.options()?.length).toBe(3);
        expect(component.options.length).toBe(3);
    });

    it('should render templates with correct context', async () => {
        // Test with different selected values
        component.selectedValue = 'opt1';
        fixture.detectChanges();
        await new Promise((resolve) => setTimeout(resolve, 100));
        await fixture.whenStable();

        expect(selectButtonInstance.value()).toBe('opt1');
        expect(component.selectedValue).toBe('opt1');
    });

    it('should update templates when selection changes', async () => {
        // Initially no selection
        expect(selectButtonInstance.value()).toBeUndefined();

        // Select option
        component.selectedValue = 'opt2';
        fixture.detectChanges();
        await new Promise((resolve) => setTimeout(resolve, 100));
        await fixture.whenStable();

        expect(selectButtonInstance.value()).toBe('opt2');
    });

    it('should apply context to templates correctly', async () => {
        component.selectedValue = 'opt3';
        fixture.detectChanges();
        await new Promise((resolve) => setTimeout(resolve, 100));
        await fixture.whenStable();

        // Verify that the select button component works correctly
        expect(selectButtonInstance.value()).toBe('opt3');
        expect(selectButtonInstance.isSelected(component.options![2])).toBe(true);
    });

    it('should render the item pTemplate for every option', async () => {
        await fixture.whenStable();
        fixture.detectChanges();

        expect(selectButtonInstance._itemTemplate()).toBeDefined();
        expect(fixture.nativeElement.querySelectorAll('.custom-template-item').length).toBe(3);
        expect(fixture.nativeElement.querySelector('[data-testid="ptemplate-item-1"]').textContent).toContain('Option Two (opt2)');
    });
});

describe('SelectButton #template Reference Tests', () => {
    let component: TestSelectButtonRefTemplateComponent;
    let fixture: ComponentFixture<TestSelectButtonRefTemplateComponent>;
    let selectButtonInstance: SelectButton;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestSelectButtonRefTemplateComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestSelectButtonRefTemplateComponent);
        component = fixture.componentInstance;
        selectButtonInstance = fixture.debugElement.query(By.directive(SelectButton)).componentInstance;
        fixture.detectChanges();
    });

    it('should create component with #template references', async () => {
        expect(component).toBeTruthy();
        expect(selectButtonInstance).toBeTruthy();
        expect(() => selectButtonInstance.itemTemplate()).not.toThrow();
    });

    it('should pass context parameters to item template', async () => {
        // Verify that the select button component is working with options
        expect(selectButtonInstance.options()).toBeDefined();
        expect(selectButtonInstance.options()?.length).toBe(3);
        expect(component.options.length).toBe(3);
    });

    it('should render templates with correct context', async () => {
        // Test with different selected values
        component.selectedValue = 'item1';
        fixture.detectChanges();
        await new Promise((resolve) => setTimeout(resolve, 100));
        await fixture.whenStable();

        expect(selectButtonInstance.value()).toBe('item1');
        expect(component.selectedValue).toBe('item1');
    });

    it('should update templates when selection changes', async () => {
        // Initially no selection
        expect(selectButtonInstance.value()).toBeUndefined();

        // Select option
        component.selectedValue = 'item2';
        fixture.detectChanges();
        await new Promise((resolve) => setTimeout(resolve, 100));
        await fixture.whenStable();

        expect(selectButtonInstance.value()).toBe('item2');
    });

    it('should apply context to templates correctly', async () => {
        component.selectedValue = 'item3';
        fixture.detectChanges();
        await new Promise((resolve) => setTimeout(resolve, 100));
        await fixture.whenStable();

        // Verify that the select button component works correctly
        expect(selectButtonInstance.value()).toBe('item3');
        expect(selectButtonInstance.isSelected(component.options![2])).toBe(true);
    });

    it('should render the #item template for every option', async () => {
        await fixture.whenStable();
        fixture.detectChanges();

        expect(selectButtonInstance.itemTemplate()).toBeDefined();
        expect(fixture.nativeElement.querySelectorAll('.custom-ref-item').length).toBe(3);
        expect(fixture.nativeElement.querySelector('[data-testid="ref-item-1"]').textContent).toContain('Item Two [item2]');
    });
});

describe('SelectButton PassThrough Tests', () => {
    let fixture: ComponentFixture<SelectButton>;
    let component: SelectButton;
    let hostElement: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SelectButton, SelectButtonModule, FormsModule, CommonModule],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(SelectButton);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('options', ['One-Way', 'Return']);
        fixture.changeDetectorRef.markForCheck();
        await fixture.whenStable();
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
        it('should access instance variables in PT function', async () => {
            component.value.set('One-Way');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.componentRef.setInput('pt', {
                root: ({ instance }: any) => ({
                    class: instance?.value() ? 'HAS_VALUE' : ''
                })
            });
            fixture.detectChanges();

            expect(hostElement.classList.contains('HAS_VALUE')).toBe(true);
        });

        it('should conditionally apply styles based on instance state', async () => {
            component.value.set('Return');
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.componentRef.setInput('pt', {
                root: ({ instance }: any) => ({
                    style: {
                        'background-color': instance?.value() === 'Return' ? 'yellow' : 'red'
                    }
                })
            });
            fixture.detectChanges();

            expect(hostElement.style.backgroundColor).toBe('yellow');
        });

        it('should access multiple instance properties', async () => {
            component.value.set('One-Way');
            fixture.componentRef.setInput('multiple', true);
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.componentRef.setInput('pt', {
                root: ({ instance }: any) => ({
                    class: (instance?.multiple() ? 'MULTIPLE_MODE ' : '') + (instance?.value() ? 'HAS_SELECTION' : '')
                })
            });
            fixture.detectChanges();

            expect(hostElement.classList.contains('MULTIPLE_MODE')).toBe(true);
            expect(hostElement.classList.contains('HAS_SELECTION')).toBe(true);
        });
    });

    describe('PT Case 5: Event binding', () => {
        it('should handle onclick event through PT', async () => {
            let clicked = false;
            let resolveDone: () => void;
            const done = new Promise<void>((resolve) => {
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
            await done;
            expect(clicked).toBe(true);
        });

        it('should modify instance through PT event', () => {
            fixture.componentRef.setInput('pt', {
                root: ({ instance }: any) => ({
                    onclick: () => {
                        instance.value.set('MODIFIED');
                    }
                })
            });
            fixture.detectChanges();

            hostElement.click();
            expect(component.value()).toBe('MODIFIED');
        });
    });

    describe('PT Case 6: Inline PT', () => {
        it('should work with inline string PT', () => {
            const inlineFixture = TestBed.createComponent(TestInlineStringPTComponent);
            inlineFixture.detectChanges();

            const inlineHostElement = inlineFixture.nativeElement.querySelector('p-selectbutton');
            expect(inlineHostElement.classList.contains('INLINE_STRING')).toBe(true);
        });

        it('should work with inline object PT', () => {
            const inlineFixture = TestBed.createComponent(TestInlineObjectPTComponent);
            inlineFixture.detectChanges();

            const inlineHostElement = inlineFixture.nativeElement.querySelector('p-selectbutton');
            expect(inlineHostElement.classList.contains('INLINE_OBJECT_CLASS')).toBe(true);
            expect(inlineHostElement.getAttribute('data-inline')).toBe('true');
        });
    });

    describe('PT Case 7: Global PT from ExhaustiveConfig', () => {
        it('should apply global PT configuration to all instances', async () => {
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [SelectButton, SelectButtonModule, FormsModule, CommonModule],
                providers: [
                    provideZonelessChangeDetection(),
                    provideExhaustive({
                        pt: {
                            selectButton: {
                                host: { 'aria-label': 'GLOBAL_ARIA_LABEL' },
                                root: 'GLOBAL_CLASS'
                            }
                        }
                    })
                ]
            }).compileComponents();

            const globalFixture = TestBed.createComponent(SelectButton);
            const globalComponent = globalFixture.componentInstance;
            globalFixture.componentRef.setInput('options', ['One', 'Two']);
            globalFixture.changeDetectorRef.markForCheck();
            await globalFixture.whenStable();
            globalFixture.detectChanges();

            const globalHostElement = globalFixture.nativeElement;
            expect(globalHostElement.classList.contains('GLOBAL_CLASS')).toBe(true);
            expect(globalHostElement.getAttribute('aria-label')).toBe('GLOBAL_ARIA_LABEL');
        });

        it('should apply global PT to multiple component instances', async () => {
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [SelectButton, SelectButtonModule, FormsModule, CommonModule, TestMultipleInstancesComponent],
                providers: [
                    provideZonelessChangeDetection(),
                    provideExhaustive({
                        pt: {
                            selectButton: {
                                root: {
                                    class: 'MULTI_GLOBAL_CLASS',
                                    'data-global': 'true'
                                }
                            }
                        }
                    })
                ]
            }).compileComponents();

            const multiFixture = TestBed.createComponent(TestMultipleInstancesComponent);
            multiFixture.detectChanges();

            const selectButtons = multiFixture.nativeElement.querySelectorAll('p-selectbutton');
            expect(selectButtons.length).toBe(2);

            selectButtons.forEach((btn: HTMLElement) => {
                expect(btn.classList.contains('MULTI_GLOBAL_CLASS')).toBe(true);
                expect(btn.getAttribute('data-global')).toBe('true');
            });
        });
    });

    describe('PT Case 8: Lifecycle hooks', () => {
        it('should support onInit hook', async () => {
            const hooksCalled: string[] = [];
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [SelectButton, SelectButtonModule, FormsModule, CommonModule],
                providers: [
                    provideZonelessChangeDetection(),
                    provideExhaustive({
                        pt: {
                            selectButton: {
                                hooks: {
                                    onInit: () => {
                                        hooksCalled.push('onInit');
                                    }
                                }
                            }
                        }
                    })
                ]
            }).compileComponents();

            const hookFixture = TestBed.createComponent(SelectButton);
            const hookComponent = hookFixture.componentInstance;
            hookFixture.componentRef.setInput('options', ['A', 'B']);
            hookFixture.changeDetectorRef.markForCheck();
            await hookFixture.whenStable();
            hookFixture.detectChanges();

            expect(hooksCalled).toContain('onInit');
        });

        it('should support onAfterViewInit hook', async () => {
            const hooksCalled: string[] = [];
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [SelectButton, SelectButtonModule, FormsModule, CommonModule],
                providers: [
                    provideZonelessChangeDetection(),
                    provideExhaustive({
                        pt: {
                            selectButton: {
                                hooks: {
                                    onAfterViewInit: () => {
                                        hooksCalled.push('onAfterViewInit');
                                    }
                                }
                            }
                        }
                    })
                ]
            }).compileComponents();

            const hookFixture = TestBed.createComponent(SelectButton);
            const hookComponent = hookFixture.componentInstance;
            hookFixture.componentRef.setInput('options', ['X', 'Y']);
            hookFixture.changeDetectorRef.markForCheck();
            await hookFixture.whenStable();
            hookFixture.detectChanges();

            expect(hooksCalled).toContain('onAfterViewInit');
        });

        it('should support onAfterViewChecked hook', async () => {
            const hooksCalled: string[] = [];
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [SelectButton, SelectButtonModule, FormsModule, CommonModule],
                providers: [
                    provideZonelessChangeDetection(),
                    provideExhaustive({
                        pt: {
                            selectButton: {
                                hooks: {
                                    onAfterViewChecked: () => {
                                        if (!hooksCalled.includes('onAfterViewChecked')) {
                                            hooksCalled.push('onAfterViewChecked');
                                        }
                                    }
                                }
                            }
                        }
                    })
                ]
            }).compileComponents();

            const hookFixture = TestBed.createComponent(SelectButton);
            const hookComponent = hookFixture.componentInstance;
            hookFixture.componentRef.setInput('options', ['M', 'N']);
            hookFixture.changeDetectorRef.markForCheck();
            await hookFixture.whenStable();
            hookFixture.detectChanges();

            expect(hooksCalled).toContain('onAfterViewChecked');
        });

        it('should support onDestroy hook', async () => {
            const hooksCalled: string[] = [];
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [SelectButton, SelectButtonModule, FormsModule, CommonModule],
                providers: [
                    provideZonelessChangeDetection(),
                    provideExhaustive({
                        pt: {
                            selectButton: {
                                hooks: {
                                    onDestroy: () => {
                                        hooksCalled.push('onDestroy');
                                    }
                                }
                            }
                        }
                    })
                ]
            }).compileComponents();

            const hookFixture = TestBed.createComponent(SelectButton);
            const hookComponent = hookFixture.componentInstance;
            hookFixture.componentRef.setInput('options', ['P', 'Q']);
            hookFixture.changeDetectorRef.markForCheck();
            await hookFixture.whenStable();
            hookFixture.detectChanges();

            hookFixture.destroy();

            expect(hooksCalled).toContain('onDestroy');
        });

        it('should support multiple lifecycle hooks', async () => {
            const hooksCalled: string[] = [];
            TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [SelectButton, SelectButtonModule, FormsModule, CommonModule],
                providers: [
                    provideZonelessChangeDetection(),
                    provideExhaustive({
                        pt: {
                            selectButton: {
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
                    })
                ]
            }).compileComponents();

            const hookFixture = TestBed.createComponent(SelectButton);
            const hookComponent = hookFixture.componentInstance;
            hookFixture.componentRef.setInput('options', ['R', 'S']);
            hookFixture.changeDetectorRef.markForCheck();
            await hookFixture.whenStable();
            hookFixture.detectChanges();

            expect(hooksCalled).toContain('onInit');
            expect(hooksCalled).toContain('onAfterViewInit');
            expect(hooksCalled).toContain('onAfterViewChecked');

            hookFixture.destroy();

            expect(hooksCalled).toContain('onDestroy');
        });
    });

    describe('PT Case 9: pcToggleButton passthrough', () => {
        it('should pass PT options to child ToggleButton component', () => {
            fixture.componentRef.setInput('pt', {
                pcToggleButton: {
                    root: 'TOGGLE_BUTTON_CLASS'
                }
            });
            fixture.detectChanges();

            const toggleButtons = hostElement.querySelectorAll('p-togglebutton');
            expect(toggleButtons.length).toBeGreaterThan(0);
        });

        it('should pass complex PT options to ToggleButton', () => {
            fixture.componentRef.setInput('pt', {
                pcToggleButton: {
                    root: {
                        class: 'TOGGLE_ROOT_CLASS',
                        'data-toggle': 'true'
                    }
                }
            });
            fixture.detectChanges();

            const toggleButtons = hostElement.querySelectorAll('p-togglebutton');
            expect(toggleButtons.length).toBeGreaterThan(0);
        });
    });
});

// Test components for inline PT tests
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [SelectButton, FormsModule],
    template: `<p-selectbutton [options]="options" [pt]="{ root: 'INLINE_STRING' }" />`
})
class TestInlineStringPTComponent {
    options = ['One', 'Two'];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [SelectButton, FormsModule],
    template: `<p-selectbutton [options]="options" [pt]="{ root: { class: 'INLINE_OBJECT_CLASS', 'data-inline': 'true' } }" />`
})
class TestInlineObjectPTComponent {
    options = ['One', 'Two'];
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [SelectButton, FormsModule],
    template: `
        <p-selectbutton [options]="options1" />
        <p-selectbutton [options]="options2" />
    `
})
class TestMultipleInstancesComponent {
    options1 = ['A', 'B'];
    options2 = ['X', 'Y'];
}

describe('SelectButton inside a parent form', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();
    });

    it('should not register its internal ngModel with the parent form', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const isolationFixture = TestBed.createComponent(TestFormIsolationSelectButtonComponent);
        isolationFixture.detectChanges();
        await isolationFixture.whenStable();

        const internalNgModels = isolationFixture.debugElement.queryAll(By.directive(NgModel)).map((debugElement) => debugElement.injector.get(NgModel));
        expect(internalNgModels.length).toBeGreaterThan(0);
        expect(internalNgModels.every((ngModel) => ngModel.options?.standalone === true)).toBe(true);

        // NG01354 is only reported by Angular 22.1.3 and up
        expect(warnSpy.mock.calls.flat().join('\n')).not.toContain('NG01354');
        expect(Object.keys(isolationFixture.componentInstance.form.controls)).toEqual(['value']);
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [SelectButton, ReactiveFormsModule],
    template: `
        <form [formGroup]="form">
            <p-selectbutton [options]="options" formControlName="value" />
        </form>
    `
})
class TestFormIsolationSelectButtonComponent {
    form = new FormGroup({ value: new FormControl('A') });
    options = ['A', 'B'];
}

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [SelectButton, PrimeTemplate],
    template: `
        <p-selectbutton>
            <ng-template pTemplate="header">QUERY-HEADER</ng-template>
            <ng-template pTemplate="footer">QUERY-FOOTER</ng-template>
        </p-selectbutton>
    `
})
class SelectButtonQueryApiHostComponent {}

describe('SelectButton Signal Query API', () => {
    it('should collect projected PrimeTemplates via the templates contentChildren query', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [SelectButtonQueryApiHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(SelectButtonQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();

        const instance = fixture.debugElement.query(By.directive(SelectButton)).componentInstance;
        const templates = instance.templates();
        expect(Array.isArray(templates)).toBe(true);
        expect(templates.length).toBe(2);
        expect(templates.map((t: any) => t.getType())).toEqual(['header', 'footer']);
        expect(templates[0].template).toBeDefined();
    });
});

describe('SelectButton accessibility (optimus-ui#11)', () => {
    it('should set the option label as aria-label of each toggle button', async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [SelectButton],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();
        const fixture = TestBed.createComponent(SelectButton);
        fixture.componentRef.setInput('options', [
            { label: 'Option 1', value: 'opt1' },
            { label: 'Option 2', value: 'opt2' }
        ]);
        fixture.detectChanges();
        await fixture.whenStable();

        const buttons = fixture.debugElement.queryAll(By.directive(ToggleButton));
        expect(buttons.map((b) => b.nativeElement.getAttribute('aria-label'))).toEqual(['Option 1', 'Option 2']);
    });
});

describe('SelectButton RTL borders (optimus-ui#285)', () => {
    it('should give the last button an inline-end border in RTL', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [SelectButton],
            providers: [provideZonelessChangeDetection()]
        });
        const fixture = TestBed.createComponent(SelectButton);
        fixture.componentRef.setInput('options', [
            { label: 'One', value: 1 },
            { label: 'Two', value: 2 },
            { label: 'Three', value: 3 }
        ]);
        (fixture.nativeElement as HTMLElement).setAttribute('dir', 'rtl');
        fixture.detectChanges();
        await fixture.whenStable();

        const buttons = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('p-togglebutton')) as HTMLElement[];
        // the test runs without a theme, so give the borders a style for their widths to compute
        buttons.forEach((button) => (button.style.borderStyle = 'solid'));
        const first = getComputedStyle(buttons[0]);
        const last = getComputedStyle(buttons[buttons.length - 1]);
        // RTL: inline-start is the right side, inline-end the left side
        expect(first.borderRightWidth).toBe(first.borderTopWidth);
        expect(last.borderLeftWidth).toBe(last.borderTopWidth);
        expect(last.borderTopWidth).not.toBe('0px');
    });
});

describe('SelectButton duplicate labels (optimus-ui#301)', () => {
    it('should render options sharing a label without duplicate track keys', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [SelectButton],
            providers: [provideZonelessChangeDetection()]
        });
        const warn = vi.spyOn(console, 'warn');
        const error = vi.spyOn(console, 'error');
        const fixture = TestBed.createComponent(SelectButton);
        fixture.componentRef.setInput('options', [
            { label: '', value: 1, icon: 'pi pi-align-left' },
            { label: '', value: 2, icon: 'pi pi-align-right' },
            { label: 'Same', value: 3 },
            { label: 'Same', value: 4 }
        ]);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.componentRef.setInput('options', [...fixture.componentInstance.options()!]);
        fixture.detectChanges();
        await fixture.whenStable();

        const messages = [...warn.mock.calls, ...error.mock.calls].map((args) => String(args[0]));
        warn.mockRestore();
        error.mockRestore();
        expect(messages.filter((message) => message.includes('NG0955'))).toEqual([]);
        expect((fixture.nativeElement as HTMLElement).querySelectorAll('p-togglebutton').length).toBe(4);
    });
});
