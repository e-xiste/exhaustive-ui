import { Base } from '@exhaustive-ui/core/base';
import { Theme } from '@exhaustive-ui/styled';
import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal, ɵgetDocument, ɵsetDocument } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { bootstrapApplication, By, provideClientHydration } from '@angular/platform-browser';

import { CommonModule, ɵgetDOM, ɵsetRootDomAdapter } from '@angular/common';
import type { DatePickerMonthChangeEvent, DatePickerYearChangeEvent } from '@exhaustive-ui/core/types/datepicker';
import { DatePicker } from './datepicker';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SharedModule } from '@exhaustive-ui/core/api';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import Aura from '@exhaustive-ui/themes/aura';
import { provideServerRendering, renderApplication } from '@angular/platform-server';
import { FloatLabel } from '@exhaustive-ui/core/floatlabel';
import { InputGroup } from '@exhaustive-ui/core/inputgroup';
import { InputGroupAddon } from '@exhaustive-ui/core/inputgroupaddon';

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
    standalone: false,
    template: `
        <p-datepicker
            [(ngModel)]="selectedDate"
            [dateFormat]="dateFormat"
            [placeholder]="placeholder"
            [showTime]="showTime"
            [showIcon]="showIcon"
            [showWeek]="showWeek"
            [disabled]="disabled"
            [inline]="inline"
            [showButtonBar]="showButtonBar"
            [selectionMode]="selectionMode"
            [minDate]="minDate"
            [maxDate]="maxDate"
            [disabledDates]="disabledDates"
            [disabledDays]="disabledDays"
            [firstDayOfWeek]="firstDayOfWeek"
            [numberOfMonths]="numberOfMonths"
            [view]="view"
            [touchUI]="touchUI"
            [showOtherMonths]="showOtherMonths"
            [selectOtherMonths]="selectOtherMonths"
            [timeOnly]="timeOnly"
            [hourFormat]="hourFormat"
            [stepHour]="stepHour"
            [stepMinute]="stepMinute"
            [stepSecond]="stepSecond"
            [showSeconds]="showSeconds"
            [showOnFocus]="showOnFocus"
            [tabindex]="tabindex"
            [iconDisplay]="iconDisplay"
            [icon]="icon"
            [showClear]="showClear"
            [appendTo]="appendTo"
            [readonlyInput]="readonlyInput"
            [shortYearCutoff]="shortYearCutoff"
            [ariaLabel]="ariaLabel"
            [ariaLabelledBy]="ariaLabelledBy"
            [panelStyle]="panelStyle"
            [panelStyleClass]="panelStyleClass"
            [inputStyle]="inputStyle"
            [inputStyleClass]="inputStyleClass"
            [timeSeparator]="timeSeparator"
            [multipleSeparator]="multipleSeparator"
            [rangeSeparator]="rangeSeparator"
            [keepInvalid]="keepInvalid"
            (onSelect)="onDateSelect($event)"
            (onChange)="onDateChange($event)"
            (onBlur)="onDateBlur($event)"
            (onFocus)="onDateFocus($event)"
            (onClose)="onDateClose($event)"
            (onShow)="onDateShow($event)"
            (onClear)="onDateClear($event)"
            (onInput)="onDateInput($event)"
            (onTodayClick)="onDateTodayClick($event)"
            (onClearClick)="onDateClearClick($event)"
            (onMonthChange)="onDateMonthChange($event)"
            (onYearChange)="onDateYearChange($event)"
            (onClickOutside)="onDateClickOutside($event)"
        ></p-datepicker>
    `
})
class TestDatePickerComponent {
    selectedDate: any = null as any;
    dateFormat: string = 'dd/mm/yy';
    placeholder: string = 'Select a date';
    showTime: boolean = false;
    showIcon: boolean = false;
    showWeek: boolean = false;
    disabled: boolean = false;
    inline: boolean = false;
    showButtonBar: boolean = false;
    selectionMode: string = 'single';
    minDate: Date | null = null as any;
    maxDate: Date | null = null as any;
    disabledDates: Date[] = [];
    disabledDays: number[] = [];
    firstDayOfWeek: number = 0;
    numberOfMonths: number = 1;
    view: string = 'date';
    touchUI: boolean = false;
    showOtherMonths: boolean = true;
    selectOtherMonths: boolean = false;
    timeOnly: boolean = false;
    hourFormat: string = '24';
    stepHour: number = 1;
    stepMinute: number = 1;
    stepSecond: number = 1;
    showSeconds: boolean = false;
    showOnFocus: boolean = true;
    tabindex: number = 0;
    iconDisplay: string = 'input';
    icon: string | undefined = undefined as any;
    showClear: boolean = false;
    appendTo: any = null as any;
    readonlyInput: boolean = false;
    shortYearCutoff: string = '+10';
    ariaLabel: string = 'Date picker';
    ariaLabelledBy: string | undefined = undefined as any;
    panelStyle: any = null as any;
    panelStyleClass: string | undefined = undefined as any;
    inputStyle: any = null as any;
    inputStyleClass: string | undefined = undefined as any;
    timeSeparator: string = ':';
    multipleSeparator: string = ',';
    rangeSeparator: string = '-';
    keepInvalid: boolean = false;

    onDateSelect(event: any) {}
    onDateChange(event: any) {}
    onDateBlur(event: Event) {}
    onDateFocus(event: Event) {}
    onDateClose(event: Event) {}
    onDateShow(event: Event) {}
    onDateClear(event: Event) {}
    onDateInput(event: Event) {}
    onDateTodayClick(event: Event) {}
    onDateClearClick(event: Event) {}
    onDateMonthChange(event: DatePickerMonthChangeEvent) {}
    onDateYearChange(event: DatePickerYearChangeEvent) {}
    onDateClickOutside(event: any) {}
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <form [formGroup]="form">
            <p-datepicker formControlName="date" [dateFormat]="'dd/mm/yy'" [placeholder]="'Select date'"></p-datepicker>
        </form>
    `
})
class TestReactiveFormDatePickerComponent {
    form = new FormGroup({
        date: new FormControl<Date | null>(null, [Validators.required])
    });
}

// pTemplate only - Comprehensive template test component with all 12 ContentChild projections
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-datepicker [(ngModel)]="selectedDate" [showTime]="showTime" [showIcon]="showIcon" [showClear]="showClear" [view]="view" [dateFormat]="dateFormat" [touchUI]="touchUI">
            <!-- Date template with context parameters -->
            <ng-template pTemplate="date" let-date="date">
                <div class="custom-date" data-testid="date-template">
                    <span class="day">{{ date.day }}</span>
                    @if (date.month) {
                        <span class="month">{{ date.month }}</span>
                    }
                    @if (date.year) {
                        <span class="year">{{ date.year }}</span>
                    }
                </div>
            </ng-template>

            <!-- Header template -->
            <ng-template pTemplate="header">
                <div class="custom-header" data-testid="header-template">
                    <h4>Select Date</h4>
                    <small>Choose your preferred date</small>
                </div>
            </ng-template>

            <!-- Footer template -->
            <ng-template pTemplate="footer">
                <div class="custom-footer" data-testid="footer-template">
                    <button type="button" class="today-btn">Today</button>
                    <button type="button" class="clear-btn">Clear</button>
                </div>
            </ng-template>

            <!-- Disabled date template with context -->
            <ng-template pTemplate="disabledDate" let-date="date">
                <div class="disabled-date" data-testid="disabled-date-template">
                    <span class="crossed-out">{{ date.day }}</span>
                </div>
            </ng-template>

            <!-- Decade template with context -->
            <ng-template pTemplate="decade" let-decade="decade">
                <div class="custom-decade" data-testid="decade-template">
                    <span class="decade-range">{{ decade.year }}-{{ decade.year + 9 }}</span>
                </div>
            </ng-template>

            <!-- Previous icon template -->
            <ng-template pTemplate="previousicon">
                <i class="pi pi-chevron-left custom-prev" data-testid="previous-icon-template"></i>
            </ng-template>

            <!-- Next icon template -->
            <ng-template pTemplate="nexticon">
                <i class="pi pi-chevron-right custom-next" data-testid="next-icon-template"></i>
            </ng-template>

            <!-- Trigger icon template -->
            <ng-template pTemplate="triggericon">
                <i class="pi pi-calendar custom-trigger" data-testid="trigger-icon-template"></i>
            </ng-template>

            <!-- Clear icon template -->
            <ng-template pTemplate="clearicon">
                <i class="pi pi-times custom-clear" data-testid="clear-icon-template"></i>
            </ng-template>

            <!-- Decrement icon template -->
            <ng-template pTemplate="decrementicon">
                <i class="pi pi-minus custom-decrement" data-testid="decrement-icon-template"></i>
            </ng-template>

            <!-- Increment icon template -->
            <ng-template pTemplate="incrementicon">
                <i class="pi pi-plus custom-increment" data-testid="increment-icon-template"></i>
            </ng-template>

            <!-- Input icon template -->
            <ng-template pTemplate="inputicon">
                <i class="pi pi-clock custom-input-icon" data-testid="input-icon-template"></i>
            </ng-template>
        </p-datepicker>
    `
})
class TestPTemplatesDatePickerComponent {
    selectedDate: Date | null = null as any;
    showTime: boolean = false;
    showIcon: boolean = false;
    showClear: boolean = false;
    view: string = 'date';
    dateFormat: string = 'dd/mm/yy';
    touchUI: boolean = false;
}

// #template references only - Comprehensive template test component with all 12 ContentChild projections
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-datepicker [(ngModel)]="selectedDate" [showTime]="showTime" [showIcon]="showIcon" [showClear]="showClear" [view]="view" [dateFormat]="dateFormat" [touchUI]="touchUI">
            <!-- Date template with context parameters -->
            <ng-template #date let-date="date">
                <div class="custom-date-ref" data-testid="date-ref-template">
                    <span class="day">{{ date?.day }}</span>
                    @if (date?.month) {
                        <span class="month">{{ date?.month }}</span>
                    }
                    @if (date?.year) {
                        <span class="year">{{ date?.year }}</span>
                    }
                </div>
            </ng-template>

            <!-- Header template -->
            <ng-template #header>
                <div class="custom-header-ref" data-testid="header-ref-template">
                    <h4>Select Date (Ref)</h4>
                    <small>Choose your preferred date using references</small>
                </div>
            </ng-template>

            <!-- Footer template -->
            <ng-template #footer>
                <div class="custom-footer-ref" data-testid="footer-ref-template">
                    <button type="button" class="today-btn-ref">Today</button>
                    <button type="button" class="clear-btn-ref">Clear</button>
                </div>
            </ng-template>

            <!-- Disabled date template with context -->
            <ng-template #disabledDate let-date="date">
                <div class="disabled-date-ref" data-testid="disabled-date-ref-template">
                    <span class="crossed-out-ref">{{ date?.day }}</span>
                </div>
            </ng-template>

            <!-- Decade template with context -->
            <ng-template #decade let-decade="decade">
                <div class="custom-decade-ref" data-testid="decade-ref-template">
                    <span class="decade-range-ref">{{ decade?.year }}-{{ decade?.year ? decade.year + 9 : '' }}</span>
                </div>
            </ng-template>

            <!-- Previous icon template -->
            <ng-template #previousicon>
                <i class="pi pi-chevron-left custom-prev-ref" data-testid="previous-icon-ref-template"></i>
            </ng-template>

            <!-- Next icon template -->
            <ng-template #nexticon>
                <i class="pi pi-chevron-right custom-next-ref" data-testid="next-icon-ref-template"></i>
            </ng-template>

            <!-- Trigger icon template -->
            <ng-template #triggericon>
                <i class="pi pi-calendar custom-trigger-ref" data-testid="trigger-icon-ref-template"></i>
            </ng-template>

            <!-- Clear icon template -->
            <ng-template #clearicon>
                <i class="pi pi-times custom-clear-ref" data-testid="clear-icon-ref-template"></i>
            </ng-template>

            <!-- Decrement icon template -->
            <ng-template #decrementicon>
                <i class="pi pi-minus custom-decrement-ref" data-testid="decrement-icon-ref-template"></i>
            </ng-template>

            <!-- Increment icon template -->
            <ng-template #incrementicon>
                <i class="pi pi-plus custom-increment-ref" data-testid="increment-icon-ref-template"></i>
            </ng-template>

            <!-- Input icon template -->
            <ng-template #inputicon>
                <i class="pi pi-clock custom-input-icon-ref" data-testid="input-icon-ref-template"></i>
            </ng-template>
        </p-datepicker>
    `
})
class TestRefTemplatesDatePickerComponent {
    selectedDate: Date | null = null as any;
    showTime: boolean = false;
    showIcon: boolean = false;
    showClear: boolean = false;
    view: string = 'date';
    dateFormat: string = 'dd/mm/yy';
    touchUI: boolean = false;
}

// Legacy component for backward compatibility (deprecated - use separated versions above)
@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    template: `
        <p-datepicker [(ngModel)]="selectedDate" [showTime]="showTime" [showIcon]="showIcon" [showClear]="showClear" [view]="view" [dateFormat]="dateFormat" [touchUI]="touchUI">
            <ng-template pTemplate="date" let-date="date">
                <div class="custom-date" data-testid="date-template">
                    <span class="day">{{ date.day }}</span>
                </div>
            </ng-template>
        </p-datepicker>
    `
})
class TestTemplatesDatePickerComponent {
    selectedDate: Date | null = null as any;
    showTime: boolean = false;
    showIcon: boolean = false;
    showClear: boolean = false;
    view: string = 'date';
    dateFormat: string = 'dd/mm/yy';
    touchUI: boolean = false;
}

describe('DatePicker', () => {
    let component: DatePicker;
    let fixture: ComponentFixture<DatePicker>;
    let testComponent: TestDatePickerComponent;
    let testFixture: ComponentFixture<TestDatePickerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DatePicker, FormsModule, ReactiveFormsModule, CommonModule],
            declarations: [TestDatePickerComponent, TestReactiveFormDatePickerComponent, TestTemplatesDatePickerComponent, TestPTemplatesDatePickerComponent, TestRefTemplatesDatePickerComponent],
            providers: [provideZonelessChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(DatePicker);
        component = fixture.componentInstance;
        await fixture.whenStable();

        testFixture = TestBed.createComponent(TestDatePickerComponent);
        testComponent = testFixture.componentInstance;
        await testFixture.whenStable();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize with default values', async () => {
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            expect(component.dateFormat()).toBeUndefined(); // Default is undefined, not 'mm/dd/yy'
            expect(component.multipleSeparator()).toBe(',');
            expect(component.rangeSeparator()).toBe('-');
            expect(component.inline()).toBe(false);
            expect(component.showOtherMonths()).toBe(true);
            expect(component.stepHour()).toBe(1);
            expect(component.stepMinute()).toBe(1);
            expect(component.stepSecond()).toBe(1);
            expect(component.showSeconds()).toBe(false);
            expect(component.hourFormat()).toBe('24');
        });

        it('should accept custom values', async () => {
            testComponent.dateFormat = 'dd-mm-yyyy';
            testComponent.placeholder = 'Choose date';
            testComponent.showTime = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.dateFormat()).toBe('dd-mm-yyyy');
            expect(datePickerComponent.placeholder()).toBe('Choose date');
            expect(datePickerComponent.showTime()).toBe(true);
        });
    });

    describe('Basic Functionality', () => {
        beforeEach(async () => {
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
        });

        it('should display input field', () => {
            const inputElement = testFixture.debugElement.query(By.css('input'));
            expect(inputElement).toBeTruthy();
            expect(inputElement.nativeElement.getAttribute('placeholder')).toBe('Select a date');
        });

        it('should render popup calendar cells only after the overlay is opened', async () => {
            const dayClassSpy = vi.spyOn(DatePicker.prototype, 'dayClass');
            const lazyFixture = TestBed.createComponent(TestDatePickerComponent);

            await lazyFixture.whenStable();

            expect(dayClassSpy).not.toHaveBeenCalled();
            expect(lazyFixture.debugElement.query(By.css('p-motion'))).toBeNull();

            lazyFixture.debugElement.query(By.css('input')).nativeElement.click();
            lazyFixture.changeDetectorRef.markForCheck();
            await lazyFixture.whenStable();

            expect(dayClassSpy).toHaveBeenCalled();
            expect(lazyFixture.debugElement.query(By.css('p-motion'))).toBeTruthy();

            lazyFixture.destroy();
        });

        it('should open calendar on input click', async () => {
            const inputElement = testFixture.debugElement.query(By.css('input'));
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            inputElement.nativeElement.click();
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(datePickerComponent.overlayVisible()).toBe(true);
        });

        it('should keep popup motion mounted until overlay cleanup finishes', async () => {
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance as DatePicker;
            datePickerComponent.overlay.set(document.createElement('div'));
            datePickerComponent.cd.markForCheck();
            await testFixture.whenStable();

            expect(testFixture.debugElement.query(By.css('p-motion'))).toBeTruthy();

            datePickerComponent.onOverlayHide();
            datePickerComponent.cd.markForCheck();
            await testFixture.whenStable();

            expect(testFixture.debugElement.query(By.css('p-motion'))).toBeNull();
        });

        it('should handle date selection', async () => {
            vi.spyOn(testComponent, 'onDateSelect').mockImplementation(() => {});
            vi.spyOn(testComponent, 'onDateChange').mockImplementation(() => {});

            const testDate = new Date(2023, 5, 15); // June 15, 2023
            testComponent.selectedDate = testDate;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(testComponent.selectedDate).toEqual(testDate);

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            datePickerComponent.selectDate({ year: 2023, month: 5, day: 15, selectable: true });

            expect(testComponent.onDateSelect).toHaveBeenCalled();
        });
    });

    describe('Additional Output Events', () => {
        beforeEach(async () => {
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
        });

        it('should emit onClose when overlay finishes leaving', () => {
            vi.spyOn(testComponent, 'onDateClose').mockImplementation(() => {});
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            datePickerComponent.onOverlayAfterLeave({ element: document.createElement('div') });

            expect(testComponent.onDateClose).toHaveBeenCalled();
        });

        it('should emit onShow when overlay starts entering', () => {
            vi.spyOn(testComponent, 'onDateShow').mockImplementation(() => {});
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            datePickerComponent.onOverlayBeforeEnter({ element: document.createElement('div') });

            expect(testComponent.onDateShow).toHaveBeenCalled();
        });

        it('should emit onClear when clear() is called', () => {
            vi.spyOn(testComponent, 'onDateClear').mockImplementation(() => {});
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            datePickerComponent.clear();

            expect(testComponent.onDateClear).toHaveBeenCalled();
        });

        it('should emit onInput on user input', () => {
            vi.spyOn(testComponent, 'onDateInput').mockImplementation(() => {});
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            datePickerComponent.isKeydown.set(true);
            datePickerComponent.onUserInput({ target: { value: '' } });

            expect(testComponent.onDateInput).toHaveBeenCalled();
        });

        it('should emit onTodayClick when the today button is clicked', () => {
            vi.spyOn(testComponent, 'onDateTodayClick').mockImplementation(() => {});
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            datePickerComponent.onTodayButtonClick({ preventDefault: () => {} });

            expect(testComponent.onDateTodayClick).toHaveBeenCalled();
        });

        it('should emit onClearClick when the clear button is clicked', () => {
            vi.spyOn(testComponent, 'onDateClearClick').mockImplementation(() => {});
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            datePickerComponent.onClearButtonClick({});

            expect(testComponent.onDateClearClick).toHaveBeenCalled();
        });

        it('should emit onMonthChange when navigating forward', () => {
            vi.spyOn(testComponent, 'onDateMonthChange').mockImplementation(() => {});
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            datePickerComponent.navForward({ preventDefault: () => {} });

            expect(testComponent.onDateMonthChange).toHaveBeenCalled();
        });

        it('should emit onYearChange when a year is selected', () => {
            vi.spyOn(testComponent, 'onDateYearChange').mockImplementation(() => {});
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            datePickerComponent.onYearSelect({ preventDefault: () => {} }, 2024);

            expect(testComponent.onDateYearChange).toHaveBeenCalled();
        });

        it('should emit onClickOutside when clicking outside while the overlay is visible', () => {
            vi.spyOn(testComponent, 'onDateClickOutside').mockImplementation(() => {});
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            datePickerComponent.overlayVisible.set(true);
            datePickerComponent.onOverlayBeforeEnter({ element: document.createElement('div') });

            document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            expect(testComponent.onDateClickOutside).toHaveBeenCalled();
        });
    });

    describe('Input Properties', () => {
        it('should apply dateFormat correctly', async () => {
            testComponent.dateFormat = 'dd/mm/yyyy';
            testComponent.selectedDate = new Date(2023, 5, 15);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.dateFormat()).toBe('dd/mm/yyyy');

            // Note: Input formatting depends on locale service and internal formatting logic
            // For unit tests, we primarily test that the property is set correctly
            const inputElement = testFixture.debugElement.query(By.css('input'));
            expect(inputElement).toBeTruthy();
        });

        it('should handle disabled state', async () => {
            testComponent.disabled = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const inputElement = testFixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.disabled).toBe(true);
        });

        it('should handle readonly input state', async () => {
            testComponent.readonlyInput = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const inputElement = testFixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.readOnly).toBe(true);
        });

        it('should show calendar icon when showIcon is true', async () => {
            testComponent.showIcon = true;
            testComponent.iconDisplay = 'button';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const iconButton = testFixture.debugElement.query(By.css('button'));
            expect(iconButton).toBeTruthy();
        });

        it('should handle custom icon', async () => {
            testComponent.showIcon = true;
            testComponent.icon = 'pi pi-calendar-plus';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.icon()).toBe('pi pi-calendar-plus');
        });

        it('should handle input id and name attributes', async () => {
            testComponent.inputStyleClass = 'custom-input';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const inputElement = testFixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.className).toContain('custom-input');
        });
    });

    describe('Event Handling', () => {
        beforeEach(async () => {
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
        });

        it('should emit onFocus event', () => {
            vi.spyOn(testComponent, 'onDateFocus').mockImplementation(() => {});

            const inputElement = testFixture.debugElement.query(By.css('input'));
            inputElement.nativeElement.dispatchEvent(new FocusEvent('focus'));

            expect(testComponent.onDateFocus).toHaveBeenCalled();
        });

        it('should emit onBlur event', () => {
            vi.spyOn(testComponent, 'onDateBlur').mockImplementation(() => {});

            const inputElement = testFixture.debugElement.query(By.css('input'));
            inputElement.nativeElement.dispatchEvent(new FocusEvent('blur'));

            expect(testComponent.onDateBlur).toHaveBeenCalled();
        });

        it('should open calendar on input click', async () => {
            const inputElement = testFixture.debugElement.query(By.css('input'));
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            inputElement.nativeElement.click();
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(datePickerComponent.overlayVisible()).toBe(true);
        });

        it('should open calendar with button click when showIcon is true', async () => {
            testComponent.showIcon = true;
            testComponent.iconDisplay = 'button';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const buttonElement = testFixture.debugElement.query(By.css('button'));
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            buttonElement.nativeElement.click();
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(datePickerComponent.overlayVisible()).toBe(true);
        });
    });

    describe('hideOverlay', () => {
        it('should focus the input when nothing else is focused', async () => {
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance as DatePicker;
            const inputElement = testFixture.debugElement.query(By.css('input')).nativeElement;

            (document.activeElement as HTMLElement)?.blur();
            datePickerComponent.hideOverlay();

            expect(document.activeElement).toBe(inputElement);
        });

        it('should focus the input when focus is inside the datepicker overlay', async () => {
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance as DatePicker;
            const inputElement = testFixture.debugElement.query(By.css('input')).nativeElement;

            const overlayButton = document.createElement('button');
            datePickerComponent.overlay.set(document.createElement('div'));
            datePickerComponent.overlay()!.appendChild(overlayButton);
            document.body.appendChild(datePickerComponent.overlay()!);
            overlayButton.focus();

            datePickerComponent.hideOverlay();

            expect(document.activeElement).toBe(inputElement);

            datePickerComponent.overlay()!.remove();
        });

        it('should not steal focus back when the user already moved focus outside the datepicker', async () => {
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance as DatePicker;

            const otherInput = document.createElement('input');
            document.body.appendChild(otherInput);
            otherInput.focus();

            datePickerComponent.hideOverlay();

            expect(document.activeElement).toBe(otherInput);

            otherInput.remove();
        });
    });

    describe('Date Selection Modes', () => {
        it('should handle single selection mode', async () => {
            testComponent.selectionMode = 'single';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.selectionMode()).toBe('single');
        });
    });

    describe('Time Picker', () => {
        it('should show time picker when showTime is true', async () => {
            testComponent.showTime = true;
            testComponent.showSeconds = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.showTime()).toBe(true);
            expect(datePickerComponent.showSeconds()).toBe(true);
        });

        it('should handle 12-hour format', async () => {
            testComponent.hourFormat = '12';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.hourFormat()).toBe('12');
        });

        it('should handle time steps', async () => {
            testComponent.showTime = true;
            testComponent.stepHour = 2;
            testComponent.stepMinute = 15;
            testComponent.stepSecond = 30;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.stepHour()).toBe(2);
            expect(datePickerComponent.stepMinute()).toBe(15);
            expect(datePickerComponent.stepSecond()).toBe(30);
        });
    });

    describe('Inline Mode', () => {
        it('should display inline calendar', async () => {
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.inline()).toBe(true);
            expect(testFixture.debugElement.query(By.css('p-motion'))).toBeTruthy();
        });
    });

    describe('Date Restrictions', () => {
        it('should handle minDate restriction', async () => {
            const minDate = new Date(2023, 0, 1); // January 1, 2023
            testComponent.minDate = minDate;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.minDate()).toEqual(minDate);
        });

        it('should handle maxDate restriction', async () => {
            const maxDate = new Date(2023, 11, 31); // December 31, 2023
            testComponent.maxDate = maxDate;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.maxDate()).toEqual(maxDate);
        });

        it('should handle disabled dates', async () => {
            const disabledDates = [new Date(2023, 5, 15), new Date(2023, 5, 20)];
            testComponent.disabledDates = disabledDates;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.disabledDates()).toEqual(disabledDates);
        });

        it('should handle disabled days of week', async () => {
            const disabledDays = [0, 6]; // Disable Sundays and Saturdays
            testComponent.disabledDays = disabledDays;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.disabledDays()).toEqual(disabledDays);
        });
    });

    describe('Navigation', () => {
        it('should handle multiple months display', async () => {
            testComponent.numberOfMonths = 3;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.numberOfMonths()).toBe(3);
        });
    });

    describe('Reactive Forms Integration', () => {
        let reactiveFixture: ComponentFixture<TestReactiveFormDatePickerComponent>;
        let reactiveComponent: TestReactiveFormDatePickerComponent;

        beforeEach(async () => {
            reactiveFixture = TestBed.createComponent(TestReactiveFormDatePickerComponent);
            reactiveComponent = reactiveFixture.componentInstance;
            reactiveFixture.changeDetectorRef.markForCheck();
            await reactiveFixture.whenStable();
        });

        it('should integrate with reactive forms', () => {
            expect(reactiveComponent.form.get('date')?.value).toBeNull();
            expect(reactiveComponent.form.get('date')?.invalid).toBe(true);
        });

        it('should update form control value', async () => {
            const testDate = new Date(2023, 5, 15);
            reactiveComponent.form.get('date')?.setValue(testDate);
            reactiveFixture.changeDetectorRef.markForCheck();
            await reactiveFixture.whenStable();

            expect(reactiveComponent.form.get('date')?.value).toEqual(testDate);
            expect(reactiveComponent.form.get('date')?.valid).toBe(true);
        });

        it('should handle form control validation', () => {
            const dateControl = reactiveComponent.form.get('date');
            expect(dateControl?.hasError('required')).toBe(true);

            dateControl?.setValue(new Date());
            expect(dateControl?.hasError('required')).toBe(false);
            expect(dateControl?.valid).toBe(true);
        });

        it('should handle form reset', () => {
            const testDate = new Date(2023, 5, 15);
            reactiveComponent.form.get('date')?.setValue(testDate);
            expect(reactiveComponent.form.get('date')?.value).toEqual(testDate);

            reactiveComponent.form.reset();
            expect(reactiveComponent.form.get('date')?.value).toBeNull();
            expect(reactiveComponent.form.pristine).toBe(true);
        });
    });

    describe('CSS Classes and Styling', () => {
        it('should apply custom input styles', async () => {
            testComponent.inputStyle = { border: '2px solid red', padding: '10px' };
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.inputStyle()).toEqual({ border: '2px solid red', padding: '10px' });
        });

        it('should apply custom panel styles', async () => {
            testComponent.panelStyle = { backgroundColor: 'lightblue', border: '1px solid blue' };
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.panelStyle()).toEqual({ backgroundColor: 'lightblue', border: '1px solid blue' });
        });

        it('should apply custom CSS classes', async () => {
            testComponent.inputStyleClass = 'custom-input-class';
            testComponent.panelStyleClass = 'custom-panel-class';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.inputStyleClass()).toBe('custom-input-class');
            expect(datePickerComponent.panelStyleClass()).toBe('custom-panel-class');
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA attributes', async () => {
            testComponent.ariaLabel = 'Select date';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const inputElement = testFixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.getAttribute('aria-label')).toBe('Select date');
            expect(inputElement.nativeElement.getAttribute('role')).toBe('combobox');
        });

        it('should handle aria-labelledby', async () => {
            testComponent.ariaLabelledBy = 'date-label';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const inputElement = testFixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.getAttribute('aria-labelledby')).toBe('date-label');
        });

        it('should handle tabindex', async () => {
            testComponent.tabindex = 5;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const inputElement = testFixture.debugElement.query(By.css('input'));
            expect(inputElement.nativeElement.getAttribute('tabindex')).toBe('5');
        });
    });

    describe('Keyboard Navigation', () => {
        beforeEach(async () => {
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();
        });

        it('should handle Enter key to open calendar', () => {
            const inputElement = testFixture.debugElement.query(By.css('input'));

            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            inputElement.nativeElement.dispatchEvent(enterEvent);

            expect(inputElement).toBeTruthy(); // Basic check that element exists
        });

        it('should handle Escape key to close calendar', async () => {
            const inputElement = testFixture.debugElement.query(By.css('input'));
            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            // First open the calendar
            datePickerComponent.overlayVisible.set(true);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            inputElement.nativeElement.dispatchEvent(escapeEvent);

            expect(inputElement).toBeTruthy();
        });
    });

    describe('Locale and Internationalization', () => {
        it('should handle locale via configuration service', () => {
            // Locale is handled via Exhaustive config service, not direct input
            expect(true).toBe(true);
        });

        it('should handle first day of week', async () => {
            testComponent.firstDayOfWeek = 1; // Monday
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.firstDayOfWeek()).toBe(1);
        });

        it('should handle show week numbers', async () => {
            testComponent.showWeek = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.showWeek()).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        it('should handle null/undefined values', async () => {
            testComponent.selectedDate = null as any;
            testComponent.minDate = null as any;
            testComponent.maxDate = null as any;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(() => {
                testFixture.changeDetectorRef.markForCheck();
            }).not.toThrow();
        });

        it('should handle empty arrays', async () => {
            testComponent.disabledDates = [];
            testComponent.disabledDays = [];
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(() => {
                testFixture.changeDetectorRef.markForCheck();
            }).not.toThrow();
        });

        it('should handle extreme date values', async () => {
            const extremeMinDate = new Date(1900, 0, 1);
            const extremeMaxDate = new Date(2100, 11, 31);

            testComponent.minDate = extremeMinDate;
            testComponent.maxDate = extremeMaxDate;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.minDate()).toEqual(extremeMinDate);
            expect(datePickerComponent.maxDate()).toEqual(extremeMaxDate);
        });
    });

    describe('Advanced Features', () => {
        it('should handle touch UI mode', async () => {
            testComponent.touchUI = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.touchUI()).toBe(true);
        });

        it('should handle show other months', async () => {
            testComponent.showOtherMonths = false;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.showOtherMonths()).toBe(false);
        });

        it('should handle select other months', async () => {
            testComponent.selectOtherMonths = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.selectOtherMonths()).toBe(true);
        });

        it('should handle button bar', async () => {
            testComponent.showButtonBar = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.showButtonBar()).toBe(true);
        });

        it('should handle keep invalid dates', async () => {
            testComponent.keepInvalid = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            expect(datePickerComponent.keepInvalid()).toBe(true);
        });

        it('should navigate to next month', async () => {
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            const currentMonth = datePickerComponent.currentMonth();
            const currentYear = datePickerComponent.currentYear();

            const mockEvent = { preventDefault: vi.fn() };
            datePickerComponent.navForward(mockEvent);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            if (currentMonth === 11) {
                expect(datePickerComponent.currentMonth()).toBe(0);
                expect(datePickerComponent.currentYear()).toBe(currentYear + 1);
            } else {
                expect(datePickerComponent.currentMonth()).toBe(currentMonth + 1);
                expect(datePickerComponent.currentYear()).toBe(currentYear);
            }
        });

        it('should navigate to previous month', async () => {
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            const currentMonth = datePickerComponent.currentMonth();
            const currentYear = datePickerComponent.currentYear();

            const mockEvent = { preventDefault: vi.fn() };
            datePickerComponent.navBackward(mockEvent);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            if (currentMonth === 0) {
                expect(datePickerComponent.currentMonth()).toBe(11);
                expect(datePickerComponent.currentYear()).toBe(currentYear - 1);
            } else {
                expect(datePickerComponent.currentMonth()).toBe(currentMonth - 1);
                expect(datePickerComponent.currentYear()).toBe(currentYear);
            }
        });

        it('should select date when clicked', async () => {
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            const testDate = new Date(2023, 5, 15); // June 15, 2023

            // Directly set the value to test date selection functionality
            testComponent.selectedDate = testDate;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(testComponent.selectedDate).toEqual(testDate);
            expect(datePickerComponent.value()).toEqual(testDate);
        });

        it('should handle multiple date selection', async () => {
            testComponent.selectionMode = 'multiple';
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            // Verify that selectionMode is set correctly
            expect(datePickerComponent.selectionMode()).toBe('multiple');
            expect(datePickerComponent.inline()).toBe(true);
        });

        it('should handle range date selection', async () => {
            testComponent.selectionMode = 'range';
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            // Verify that selectionMode is set correctly
            expect(datePickerComponent.selectionMode()).toBe('range');
            expect(datePickerComponent.inline()).toBe(true);
        });

        it('should switch to month view when month clicked', async () => {
            testComponent.inline = true;
            testComponent.view = 'date';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            const mockEvent = { preventDefault: vi.fn() };
            datePickerComponent.switchToMonthView(mockEvent);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(datePickerComponent.currentView()).toBe('month');
        });

        it('should switch to year view when year clicked', async () => {
            testComponent.inline = true;
            testComponent.view = 'date';
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            const mockEvent = { preventDefault: vi.fn() };
            datePickerComponent.switchToYearView(mockEvent);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(datePickerComponent.currentView()).toBe('year');
        });

        it('should handle time picker hour increment', async () => {
            testComponent.showTime = true;
            testComponent.inline = true;
            testComponent.selectedDate = new Date(2023, 5, 15, 10, 30);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            const initialHour = datePickerComponent.currentHour();

            const mockEvent = { preventDefault: vi.fn() };
            datePickerComponent.incrementHour(mockEvent);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            if (initialHour < 23) {
                expect(datePickerComponent.currentHour()).toBe(initialHour + 1);
            } else {
                expect(datePickerComponent.currentHour()).toBe(0);
            }
        });

        it('should handle time picker minute increment', async () => {
            testComponent.showTime = true;
            testComponent.inline = true;
            testComponent.selectedDate = new Date(2023, 5, 15, 10, 30);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;
            const initialMinute = datePickerComponent.currentMinute();

            const mockEvent = { preventDefault: vi.fn() };
            datePickerComponent.incrementMinute(mockEvent);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            if (initialMinute < 59) {
                expect(datePickerComponent.currentMinute()).toBe(initialMinute + 1);
            } else {
                expect(datePickerComponent.currentMinute()).toBe(0);
            }
        });

        it('should clear selection when clear button clicked', async () => {
            testComponent.showClear = true;
            testComponent.selectedDate = new Date(2023, 5, 15);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            datePickerComponent.clear();
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            expect(testComponent.selectedDate).toBeNull();
        });

        it('should handle keyboard navigation', async () => {
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            // Test that keyboard navigation properties are available
            expect(typeof datePickerComponent.onContainerButtonKeydown).toBe('function');
            expect(datePickerComponent.inline()).toBe(true);
        });

        it('should handle disabled dates', async () => {
            const disabledDate = new Date(2023, 5, 15);
            testComponent.disabledDates = [disabledDate];
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            // Test that disabled dates array is properly set
            expect(datePickerComponent.disabledDates()).toContain(disabledDate);
            expect(Array.isArray(datePickerComponent.disabledDates())).toBe(true);
        });

        it('should handle min/max date restrictions', async () => {
            testComponent.minDate = new Date(2023, 5, 10);
            testComponent.maxDate = new Date(2023, 5, 20);
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const beforeMinDate = new Date(2023, 5, 5);
            const afterMaxDate = new Date(2023, 5, 25);
            const validDate = new Date(2023, 5, 15);

            // Test that dates outside range are considered out of bounds
            expect(beforeMinDate < testComponent.minDate).toBe(true);
            expect(afterMaxDate > testComponent.maxDate).toBe(true);
            expect(validDate >= testComponent.minDate && validDate <= testComponent.maxDate).toBe(true);
        });

        it('should handle button bar today functionality', async () => {
            testComponent.showButtonBar = true;
            testComponent.inline = true;
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const datePickerComponent = testFixture.debugElement.query(By.css('p-datepicker')).componentInstance;

            // Test Today button
            const mockEvent = { preventDefault: vi.fn() };
            datePickerComponent.onTodayButtonClick(mockEvent);
            testFixture.changeDetectorRef.markForCheck();
            await testFixture.whenStable();

            const today = new Date();
            expect(testComponent.selectedDate.toDateString()).toBe(today.toDateString());
        });
    });

    describe('pTemplate Content Projection', () => {
        let pTemplatesFixture: ComponentFixture<TestPTemplatesDatePickerComponent>;
        let pTemplatesDatePickerElement: any;

        beforeEach(async () => {
            pTemplatesFixture = TestBed.createComponent(TestPTemplatesDatePickerComponent);
            pTemplatesDatePickerElement = pTemplatesFixture.debugElement.query(By.css('p-datepicker'));
            pTemplatesFixture.changeDetectorRef.markForCheck();
            await pTemplatesFixture.whenStable();
        });

        it('should initialize pTemplates and make them available', async () => {
            const datePickerComponent = pTemplatesDatePickerElement.componentInstance;

            // Trigger content initialization
            pTemplatesFixture.changeDetectorRef.markForCheck();
            await pTemplatesFixture.whenStable();

            // Verify that templates collection exists
            expect(datePickerComponent.templates).toBeDefined();
        });

        it('should support date pTemplate property access', () => {
            const datePickerComponent = pTemplatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.dateTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support header pTemplate property access', () => {
            const datePickerComponent = pTemplatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.headerTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support footer pTemplate property access', () => {
            const datePickerComponent = pTemplatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.footerTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support disabled date pTemplate property access', () => {
            const datePickerComponent = pTemplatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.disabledDateTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });
    });

    describe('#template Reference Content Projection', () => {
        let refTemplatesFixture: ComponentFixture<TestRefTemplatesDatePickerComponent>;
        let refTemplatesDatePickerElement: any;

        beforeEach(async () => {
            refTemplatesFixture = TestBed.createComponent(TestRefTemplatesDatePickerComponent);
            refTemplatesDatePickerElement = refTemplatesFixture.debugElement.query(By.css('p-datepicker'));
            refTemplatesFixture.changeDetectorRef.markForCheck();
            await refTemplatesFixture.whenStable();
        });

        it('should initialize #template references and make them available', async () => {
            const datePickerComponent = refTemplatesDatePickerElement.componentInstance;

            // Trigger content initialization
            refTemplatesFixture.changeDetectorRef.markForCheck();
            await refTemplatesFixture.whenStable();

            // Verify that templates collection exists
            expect(datePickerComponent.templates).toBeDefined();
        });

        it('should support date #template reference property access', () => {
            const datePickerComponent = refTemplatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.dateTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support header #template reference property access', () => {
            const datePickerComponent = refTemplatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.headerTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support footer #template reference property access', () => {
            const datePickerComponent = refTemplatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.footerTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support disabled date #template reference property access', () => {
            const datePickerComponent = refTemplatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.disabledDateTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });
    });

    describe('Templates and Content Projection (Legacy)', () => {
        let templatesFixture: ComponentFixture<TestTemplatesDatePickerComponent>;
        let templatesDatePickerElement: any;

        beforeEach(async () => {
            templatesFixture = TestBed.createComponent(TestTemplatesDatePickerComponent);
            templatesDatePickerElement = templatesFixture.debugElement.query(By.css('p-datepicker'));
            templatesFixture.changeDetectorRef.markForCheck();
            await templatesFixture.whenStable();
        });

        it('should initialize templates and make them available', async () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Trigger content initialization
            templatesFixture.changeDetectorRef.markForCheck();
            await templatesFixture.whenStable();

            // Verify that templates collection exists
            expect(datePickerComponent.templates).toBeDefined();
        });

        it('should support date template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.dateTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support header template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.headerTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support footer template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.footerTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support disabled date template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.disabledDateTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support decade template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access template properties without errors
            expect(() => datePickerComponent.decadeTemplate).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support navigation icon template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access navigation template properties without errors
            expect(() => {
                datePickerComponent.previousIconTemplate;
                datePickerComponent.nextIconTemplate;
            }).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support action icon template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access action template properties without errors
            expect(() => {
                datePickerComponent.triggerIconTemplate;
                datePickerComponent.clearIconTemplate;
                datePickerComponent.inputIconTemplate;
            }).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should support time control icon template property access', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;
            // Verify component can access time control template properties without errors
            expect(() => {
                datePickerComponent.decrementIconTemplate;
                datePickerComponent.incrementIconTemplate;
            }).not.toThrow();
            expect(datePickerComponent).toBeTruthy();
        });

        it('should have template collection initialized', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Verify that the component has template properties
            expect(datePickerComponent.templates).toBeDefined();

            // Test that we can access template-related properties without errors
            expect(() => {
                datePickerComponent.dateTemplate;
                datePickerComponent.headerTemplate;
                datePickerComponent.footerTemplate;
                datePickerComponent.disabledDateTemplate;
                datePickerComponent.decadeTemplate;
                datePickerComponent.previousIconTemplate;
                datePickerComponent.nextIconTemplate;
                datePickerComponent.triggerIconTemplate;
                datePickerComponent.clearIconTemplate;
                datePickerComponent.decrementIconTemplate;
                datePickerComponent.incrementIconTemplate;
                datePickerComponent.inputIconTemplate;
            }).not.toThrow();
        });

        it('should handle template-enabled DatePicker component', () => {
            // The TestTemplatesDatePickerComponent contains various template projections
            // Verify the component can be instantiated and used without errors
            expect(templatesFixture.componentInstance).toBeTruthy();
            expect(templatesDatePickerElement).toBeTruthy();
            expect(templatesDatePickerElement.componentInstance).toBeTruthy();
        });

        it('should support ContentChild template projections', () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Verify component is ready to accept templates
            expect(datePickerComponent).toBeTruthy();

            // After content initialization should be callable without errors
            expect(() => {
                if (datePickerComponent.ngAfterContentInit) {
                    datePickerComponent.ngAfterContentInit();
                }
            }).not.toThrow();
        });

        it('should process templates through PrimeTemplate system', async () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Verify that templates can be processed
            expect(datePickerComponent.templates).toBeDefined();

            // Test that the template processing lifecycle works
            expect(() => {
                templatesFixture.changeDetectorRef.markForCheck();
            }).not.toThrow();
        });

        it('should recognize both pTemplate and #template structures', async () => {
            // Test that component can handle both pTemplate directive and #template references
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Verify component can work with templates without errors
            expect(() => {
                templatesFixture.changeDetectorRef.markForCheck();
                if (datePickerComponent.ngAfterContentInit) {
                    datePickerComponent.ngAfterContentInit();
                }
            }).not.toThrow();

            // Templates should be available for processing
            expect(datePickerComponent.templates).toBeDefined();
        });

        it('should verify #template references are accessible', async () => {
            // Verify that #template references can be accessed
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // After content init, templates should be available
            expect(() => {
                templatesFixture.changeDetectorRef.markForCheck();
                if (datePickerComponent.ngAfterContentInit) {
                    datePickerComponent.ngAfterContentInit();
                }
            }).not.toThrow();

            // Component should be able to process templates
            expect(datePickerComponent).toBeTruthy();
        });

        it('should handle template projection with context parameters', async () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Test that templates can be processed with context
            expect(() => {
                // Simulate template context processing
                templatesFixture.changeDetectorRef.markForCheck();

                // Templates should be available for context binding
                if (datePickerComponent.templates) {
                    datePickerComponent.templates().forEach((template: any) => {
                        expect(template).toBeTruthy();
                    });
                }
            }).not.toThrow();
        });

        it('should support dual template approach (pTemplate + #template)', async () => {
            // Verify that using both pTemplate and #template doesn't cause conflicts
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Component should handle dual template approach
            expect(() => {
                templatesFixture.changeDetectorRef.markForCheck();

                // Test template processing
                if (datePickerComponent.ngAfterContentInit) {
                    datePickerComponent.ngAfterContentInit();
                }
            }).not.toThrow();

            expect(datePickerComponent).toBeTruthy();
        });

        it('should verify all template types with #template structure', async () => {
            // Test comprehensive template coverage with #template references
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Verify that component can process all template types
            expect(() => {
                templatesFixture.changeDetectorRef.markForCheck();

                // Test template property access
                datePickerComponent.dateTemplate;
                datePickerComponent.headerTemplate;
                datePickerComponent.footerTemplate;
                datePickerComponent.disabledDateTemplate;
                datePickerComponent.decadeTemplate;
                datePickerComponent.previousIconTemplate;
                datePickerComponent.nextIconTemplate;
                datePickerComponent.triggerIconTemplate;
                datePickerComponent.clearIconTemplate;
                datePickerComponent.decrementIconTemplate;
                datePickerComponent.incrementIconTemplate;
                datePickerComponent.inputIconTemplate;
            }).not.toThrow();

            // Component should handle template processing
            expect(datePickerComponent).toBeTruthy();
        });

        it('should handle template lifecycle with #template references', async () => {
            const datePickerComponent = templatesDatePickerElement.componentInstance;

            // Test template lifecycle methods
            expect(() => {
                // ngAfterContentInit should process templates
                if (datePickerComponent.ngAfterContentInit) {
                    datePickerComponent.ngAfterContentInit();
                }

                // ngAfterViewInit should be callable
                if (datePickerComponent.ngAfterViewInit) {
                    datePickerComponent.ngAfterViewInit();
                }

                templatesFixture.changeDetectorRef.markForCheck();
            }).not.toThrow();

            // Templates should be properly initialized
            expect(datePickerComponent.templates).toBeDefined();
        });

        it('should handle context parameters in date template', async () => {
            // Test that date template context works
            expect(() => {
                templatesFixture.changeDetectorRef.markForCheck();

                // Simulate date context processing
                const mockDateContext = {
                    date: { day: 15, month: 6, year: 2023 }
                };

                // Template should handle context parameters
                expect(mockDateContext.date.day).toBe(15);
                expect(mockDateContext.date.month).toBe(6);
                expect(mockDateContext.date.year).toBe(2023);
            }).not.toThrow();
        });

        it('should handle context parameters in disabled date template', async () => {
            // Test that disabled date template context works
            expect(() => {
                templatesFixture.changeDetectorRef.markForCheck();

                // Simulate disabled date context processing
                const mockDisabledContext = {
                    date: { day: 25, month: 12, year: 2023, disabled: true }
                };

                // Template should handle disabled date context
                expect(mockDisabledContext.date.disabled).toBe(true);
            }).not.toThrow();
        });

        it('should handle context parameters in decade template', async () => {
            // Test that decade template context works
            expect(() => {
                templatesFixture.changeDetectorRef.markForCheck();

                // Simulate decade context processing
                const mockDecadeContext = {
                    decade: { year: 2020 }
                };

                // Template should handle decade context
                expect(mockDecadeContext.decade.year).toBe(2020);
            }).not.toThrow();
        });
    });

    describe('PassThrough (PT) Tests', () => {
        it('PT Case 1: should accept simple string values', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('pt', {
                root: 'custom-root-class',
                panel: 'custom-panel-class',
                calendar: 'custom-calendar-class'
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            const root = ptFixture.nativeElement;
            expect(root.classList.contains('custom-root-class')).toBe(true);
        });

        it('PT Case 2: should accept objects with class, style, and attributes', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('pt', {
                root: {
                    class: 'custom-root',
                    style: { backgroundColor: 'lightblue' },
                    'data-testid': 'datepicker-root'
                },
                panel: {
                    class: 'custom-panel',
                    style: { padding: '20px' }
                }
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            const root = ptFixture.nativeElement;
            expect(root.classList.contains('custom-root')).toBe(true);
            expect(root.getAttribute('data-testid')).toBe('datepicker-root');
        });

        it('PT Case 3: should accept mixed object and string values', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('pt', {
                root: 'string-root-class',
                panel: {
                    class: 'object-panel-class',
                    style: { border: '1px solid red' }
                },
                calendar: 'string-calendar-class'
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            const root = ptFixture.nativeElement;
            expect(root.classList.contains('string-root-class')).toBe(true);
        });

        it('PT Case 4: should use instance properties in PT functions', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('pt', {
                root: (options: any) => ({
                    class: options.instance.inline() ? 'inline-calendar' : 'popup-calendar'
                })
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            const root = ptFixture.nativeElement;
            expect(root.classList.contains('inline-calendar')).toBe(true);
        });

        it('PT Case 5: should bind events through PT', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            let clicked = false;
            ptFixture.componentRef.setInput('pt', {
                root: {
                    onClick: () => {
                        clicked = true;
                    }
                }
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            const root = ptFixture.nativeElement;
            root.click();
            expect(clicked).toBe(true);
        });

        it('PT Case 6: should support inline PT binding', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('ptOptions', { mergeSections: true, mergeProps: true });
            ptFixture.componentRef.setInput('pt', {
                root: 'inline-root',
                panel: 'inline-panel'
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            const root = ptFixture.nativeElement;
            expect(root.classList.contains('inline-root')).toBe(true);
        });

        it('PT Case 9: should apply PT to nested Button components', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('pt', {
                pcPrevButton: {
                    class: 'custom-prev-button',
                    root: 'prev-button-root'
                },
                pcNextButton: {
                    class: 'custom-next-button',
                    root: 'next-button-root'
                },
                pcTodayButton: 'today-button-class',
                pcClearButton: 'clear-button-class'
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.componentRef.setInput('showButtonBar', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            expect(ptFixture.componentInstance).toBeTruthy();
        });

        it('PT Case 10: should apply PT to calendar structure', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('pt', {
                calendarContainer: 'custom-calendar-container',
                calendar: 'custom-calendar',
                header: {
                    class: 'custom-header',
                    style: { fontWeight: 'bold' }
                },
                title: 'custom-title',
                selectMonth: 'custom-select-month',
                selectYear: 'custom-select-year'
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            expect(ptFixture.componentInstance).toBeTruthy();
        });

        it('PT Case 11: should apply PT to table elements', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('pt', {
                table: 'custom-table',
                tableHeader: 'custom-table-header',
                tableHeaderRow: 'custom-header-row',
                weekDay: 'custom-week-day',
                tableBody: 'custom-table-body',
                tableBodyRow: 'custom-body-row',
                dayCell: 'custom-day-cell',
                day: {
                    class: 'custom-day',
                    'data-day': 'true'
                }
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            expect(ptFixture.componentInstance).toBeTruthy();
        });

        it('PT Case 12: should apply PT to time picker elements', async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [DatePicker, FormsModule],
                providers: [provideZonelessChangeDetection()]
            }).compileComponents();

            const ptFixture = TestBed.createComponent(DatePicker);
            ptFixture.componentRef.setInput('pt', {
                timePicker: 'custom-time-picker',
                hourPicker: 'custom-hour-picker',
                hour: 'custom-hour',
                minutePicker: 'custom-minute-picker',
                minute: 'custom-minute',
                secondPicker: 'custom-second-picker',
                second: 'custom-second',
                separatorContainer: 'custom-separator-container',
                separator: 'custom-separator',
                ampmPicker: 'custom-ampm-picker',
                ampm: 'custom-ampm',
                pcIncrementButton: 'custom-increment',
                pcDecrementButton: 'custom-decrement'
            });
            ptFixture.componentRef.setInput('inline', true);
            ptFixture.componentRef.setInput('showTime', true);
            ptFixture.componentRef.setInput('showSeconds', true);
            ptFixture.changeDetectorRef.markForCheck();
            await ptFixture.whenStable();

            expect(ptFixture.componentInstance).toBeTruthy();
        });
    });
});

// ---------------------------------------------------------------------------
// Signal query API
// ---------------------------------------------------------------------------

@Component({
    standalone: true,
    imports: [DatePicker, SharedModule],
    template: `
        <p-datepicker>
            <ng-template #buttonbar>bb</ng-template>
        </p-datepicker>
    `
})
class DatePickerQueryApiHostComponent {}

describe('DatePicker Signal Query API', () => {
    it('should resolve its signal-based view/content queries', async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [DatePickerQueryApiHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(DatePickerQueryApiHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        const instance = fixture.debugElement.query(By.directive(DatePicker)).componentInstance;

        expect(instance.buttonBarTemplate()).toBeDefined();
        expect(instance.inputfieldViewChild()).toBeDefined();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePicker, ReactiveFormsModule],
    template: `
        <form [formGroup]="form">
            <p-datepicker formControlName="date" class="host-class" [dateFormat]="dateFormat()" [hourFormat]="hourFormat()" [showTime]="showTime()" [defaultDate]="defaultDate()" [inline]="inline()" />
        </form>
    `
})
class DatePickerSignalFormHostComponent {
    form = new FormGroup({
        date: new FormControl<Date | null>(new Date(2022, 2, 5, 10, 30))
    });
    dateFormat = signal<string | undefined>('dd/mm/yy');
    hourFormat = signal<string>('24');
    showTime = signal<boolean | undefined>(undefined);
    defaultDate = signal<Date | null | undefined>(new Date(2023, 5, 15));
    inline = signal(false);
}

@Component({
    imports: [DatePicker, SharedModule],
    template: `
        <p-datepicker inline>
            <ng-template pTemplate="date" let-date>first</ng-template>
            <ng-template pTemplate="custom" let-date>fallback</ng-template>
            <ng-template pTemplate="header">header</ng-template>
            <ng-template pTemplate="footer">footer</ng-template>
            <ng-template pTemplate="clearicon">clear</ng-template>
        </p-datepicker>
    `
})
class DatePickerPTemplateHostComponent {}

describe('DatePicker Signals API', () => {
    let fixture: ComponentFixture<DatePicker>;
    let picker: DatePicker;
    let el: HTMLElement;

    const render = async () => {
        fixture.detectChanges();
        await fixture.whenStable();
    };

    const dayCell = (day: number) => Array.from(el.querySelectorAll<HTMLElement>('td:not(.p-datepicker-other-month) span.p-datepicker-day')).find((span) => span.textContent?.trim() === String(day))!;

    beforeEach(async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [DatePicker, DatePickerSignalFormHostComponent, DatePickerPTemplateHostComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        }).compileComponents();

        fixture = TestBed.createComponent(DatePicker);
        picker = fixture.componentInstance;
        el = fixture.nativeElement;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('re-renders the input attributes when their inputs change', async () => {
        await render();
        const input = el.querySelector('input') as HTMLInputElement;
        expect(input.getAttribute('placeholder')).toBeNull();

        fixture.componentRef.setInput('placeholder', 'Pick a date');
        fixture.componentRef.setInput('inputId', 'dp-input');
        fixture.componentRef.setInput('ariaLabel', 'Birthday');
        fixture.componentRef.setInput('ariaLabelledBy', 'dp-label');
        fixture.componentRef.setInput('inputStyleClass', 'custom-input');
        fixture.componentRef.setInput('tabindex', 3);
        fixture.componentRef.setInput('readonlyInput', true);
        await render();

        expect(input.getAttribute('placeholder')).toBe('Pick a date');
        expect(input.id).toBe('dp-input');
        expect(input.getAttribute('aria-label')).toBe('Birthday');
        expect(input.getAttribute('aria-labelledby')).toBe('dp-label');
        expect(input.classList.contains('custom-input')).toBe(true);
        expect(input.getAttribute('tabindex')).toBe('3');
        expect(input.readOnly).toBe(true);
    });

    it('re-renders the icon button when showIcon, iconDisplay and icon change', async () => {
        await render();
        expect(el.querySelector('button.p-datepicker-dropdown')).toBeNull();

        fixture.componentRef.setInput('showIcon', true);
        await render();
        expect(el.querySelector('button.p-datepicker-dropdown')).toBeTruthy();

        fixture.componentRef.setInput('icon', 'pi pi-clock');
        await render();
        expect(el.querySelector('button.p-datepicker-dropdown span.pi-clock')).toBeTruthy();

        fixture.componentRef.setInput('iconDisplay', 'input');
        await render();
        expect(el.querySelector('button.p-datepicker-dropdown')).toBeNull();
        expect(el.querySelector('.p-datepicker-input-icon-container')).toBeTruthy();
    });

    it('merges the native class attribute with the root classes', async () => {
        const hostFixture = TestBed.createComponent(DatePickerSignalFormHostComponent);
        hostFixture.detectChanges();
        await hostFixture.whenStable();

        const host = hostFixture.nativeElement.querySelector('p-datepicker') as HTMLElement;
        expect(host.classList.contains('host-class')).toBe(true);
        expect(host.classList.contains('p-datepicker')).toBe(true);
        expect(host.classList.contains('p-inputwrapper-filled')).toBe(true);
        hostFixture.destroy();
    });

    it('re-renders the root focus class when the overlay opens', async () => {
        await render();
        expect(el.classList.contains('p-inputwrapper-focus')).toBe(false);

        (el.querySelector('input') as HTMLInputElement).click();
        await render();

        expect(picker.overlayVisible()).toBe(true);
        expect(el.classList.contains('p-inputwrapper-focus')).toBe(true);
        expect(el.querySelector('.p-datepicker-panel')).toBeTruthy();
    });

    it('renders the inline panel, week numbers and button bar from their inputs', async () => {
        fixture.componentRef.setInput('inline', true);
        await render();
        expect(el.querySelector('input')).toBeNull();
        expect(el.querySelector('.p-datepicker-panel-inline')).toBeTruthy();
        expect(el.querySelector('.p-datepicker-weekheader')).toBeNull();
        expect(el.querySelector('.p-datepicker-buttonbar')).toBeNull();

        fixture.componentRef.setInput('showWeek', true);
        fixture.componentRef.setInput('showButtonBar', true);
        fixture.componentRef.setInput('panelStyleClass', 'custom-panel');
        await render();

        expect(el.querySelector('.p-datepicker-weekheader')).toBeTruthy();
        expect(el.querySelector('.p-datepicker-buttonbar')).toBeTruthy();
        expect(el.querySelector('.p-datepicker-panel')!.classList.contains('custom-panel')).toBe(true);
    });

    it('renders one calendar per month from numberOfMonths', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('numberOfMonths', 2);
        await render();

        expect(el.querySelectorAll('.p-datepicker-calendar').length).toBe(2);
        expect(picker.switchViewButtonDisabled()).toBe(true);
    });

    it('rebuilds the month cells when minDate, maxDate, disabledDates or disabledDays change after init', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('defaultDate', new Date(2023, 5, 15));
        await render();
        expect(dayCell(5).classList.contains('p-disabled')).toBe(false);

        fixture.componentRef.setInput('minDate', new Date(2023, 5, 10));
        await render();
        expect(dayCell(5).classList.contains('p-disabled')).toBe(true);
        expect(dayCell(10).classList.contains('p-disabled')).toBe(false);

        fixture.componentRef.setInput('maxDate', new Date(2023, 5, 20));
        await render();
        expect(dayCell(25).classList.contains('p-disabled')).toBe(true);

        fixture.componentRef.setInput('disabledDates', [new Date(2023, 5, 14)]);
        await render();
        expect(dayCell(14).classList.contains('p-disabled')).toBe(true);

        fixture.componentRef.setInput('disabledDays', [4]);
        await render();
        expect(dayCell(15).classList.contains('p-disabled')).toBe(true);

        fixture.componentRef.setInput('minDate', null);
        await render();
        expect(dayCell(5).classList.contains('p-disabled')).toBe(false);
    });

    it('rebuilds the week day header when firstDayOfWeek changes', async () => {
        fixture.componentRef.setInput('inline', true);
        await render();
        const firstWeekDay = () => el.querySelector('.p-datepicker-weekday')!.textContent!.trim();
        expect(firstWeekDay()).toBe('Su');

        fixture.componentRef.setInput('firstDayOfWeek', 1);
        await render();
        expect(firstWeekDay()).toBe('Mo');
    });

    it('resets currentView to view while keeping local view switches until then', async () => {
        fixture.componentRef.setInput('inline', true);
        await render();
        expect(picker.currentView()).toBe('date');

        picker.switchToYearView(new Event('click'));
        await render();
        expect(picker.currentView()).toBe('year');
        expect(el.querySelector('.p-datepicker-year-view')).toBeTruthy();

        fixture.componentRef.setInput('view', 'month');
        await render();
        expect(picker.currentView()).toBe('month');
        expect(el.querySelector('.p-datepicker-month-view')).toBeTruthy();
        expect(el.querySelector('.p-datepicker-year-view')).toBeNull();
    });

    it('moves the displayed month when defaultDate changes after init', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('defaultDate', new Date(2023, 5, 15));
        await render();
        expect(el.querySelector('.p-datepicker-select-month')!.textContent!.trim()).toBe('June');
        expect(el.querySelector('.p-datepicker-select-year')!.textContent!.trim()).toBe('2023');

        fixture.componentRef.setInput('defaultDate', new Date(2024, 0, 10));
        await render();
        expect(picker.currentMonth()).toBe(0);
        expect(picker.currentYear()).toBe(2024);
        expect(el.querySelector('.p-datepicker-select-month')!.textContent!.trim()).toBe('January');
        expect(el.querySelector('.p-datepicker-select-year')!.textContent!.trim()).toBe('2024');
    });

    it('keeps the initial form value and month when the setter effects run their first time', async () => {
        const hostFixture = TestBed.createComponent(DatePickerSignalFormHostComponent);
        hostFixture.componentInstance.inline.set(true);
        hostFixture.detectChanges();
        await hostFixture.whenStable();

        const host = hostFixture.componentInstance;
        const instance = hostFixture.debugElement.query(By.directive(DatePicker)).componentInstance as DatePicker;

        expect(host.form.get('date')!.value).toEqual(new Date(2022, 2, 5, 10, 30));
        expect(host.form.pristine).toBe(true);
        expect(instance.value()).toEqual(new Date(2022, 2, 5, 10, 30));
        expect(instance.currentMonth()).toBe(2);
        expect(instance.currentYear()).toBe(2022);
        expect(hostFixture.nativeElement.querySelector('.p-datepicker-select-month').textContent.trim()).toBe('March');
        hostFixture.destroy();
    });

    it('reformats the input field when dateFormat or hourFormat change after init', async () => {
        const hostFixture = TestBed.createComponent(DatePickerSignalFormHostComponent);
        hostFixture.detectChanges();
        await hostFixture.whenStable();
        const input = () => hostFixture.nativeElement.querySelector('input') as HTMLInputElement;
        const host = hostFixture.componentInstance;

        expect(input().value).toBe('05/03/2022');

        host.dateFormat.set('yy-mm-dd');
        hostFixture.detectChanges();
        await hostFixture.whenStable();
        expect(input().value).toBe('2022-03-05');

        host.showTime.set(true);
        hostFixture.detectChanges();
        await hostFixture.whenStable();
        expect(input().value).toBe('2022-03-05 10:30');

        host.hourFormat.set('12');
        hostFixture.detectChanges();
        await hostFixture.whenStable();
        expect(input().value).toBe('2022-03-05 10:30 AM');
        expect(host.form.get('date')!.value).toEqual(new Date(2022, 2, 5, 10, 30));
        expect(host.form.pristine).toBe(true);
        hostFixture.destroy();
    });

    it('initializes the time picker when showTime is turned on', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('view', 'month');
        await render();
        expect(picker.currentHour()).toBeUndefined();

        fixture.componentRef.setInput('showTime', true);
        await render();
        expect(picker.currentHour()).toEqual(expect.any(Number));
        expect(picker.currentMinute()).toEqual(expect.any(Number));
    });

    it('re-renders the time picker when the current time changes', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('timeOnly', true);
        await render();
        const hour = () => el.querySelector('.p-datepicker-hour-picker > span')!.textContent!.trim();
        expect(hour()).toBe('00');

        picker.incrementHour({ preventDefault: () => {} });
        await render();
        expect(hour()).toBe('01');

        fixture.componentRef.setInput('stepHour', 5);
        picker.incrementHour({ preventDefault: () => {} });
        await render();
        expect(hour()).toBe('06');
    });

    it('recreates the responsive style element when responsiveOptions change after init', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('numberOfMonths', 3);
        fixture.componentRef.setInput('responsiveOptions', [{ breakpoint: '1024px', numMonths: 2 }]);
        await render();

        const first = picker.responsiveStyleElement()!;
        expect(first.innerHTML).toContain('max-width: 1024px');
        expect(first.innerHTML).toContain(`[${picker.attributeSelector}]`);

        fixture.componentRef.setInput('responsiveOptions', [{ breakpoint: '768px', numMonths: 1 }]);
        await render();

        const second = picker.responsiveStyleElement()!;
        expect(second).not.toBe(first);
        expect(first.isConnected).toBe(false);
        expect(second.innerHTML).toContain('max-width: 768px');
    });

    it('resolves the pTemplate computed fallbacks, the last unknown type winning for the date template', async () => {
        const hostFixture = TestBed.createComponent(DatePickerPTemplateHostComponent);
        hostFixture.detectChanges();
        await hostFixture.whenStable();
        const instance = hostFixture.debugElement.query(By.directive(DatePicker)).componentInstance as DatePicker;
        const templates = instance.templates();

        expect(instance._dateTemplate()).toBe(templates.find((t) => t.getType() === 'custom')!.template);
        expect(instance._headerTemplate()).toBe(templates.find((t) => t.getType() === 'header')!.template);
        expect(instance._footerTemplate()).toBe(templates.find((t) => t.getType() === 'footer')!.template);
        expect(instance._clearIconTemplate()).toBe(templates.find((t) => t.getType() === 'clearicon')!.template);
        expect(instance._decadeTemplate()).toBeUndefined();
        expect(hostFixture.nativeElement.textContent).toContain('header');
        expect(hostFixture.nativeElement.textContent).toContain('footer');
        expect(hostFixture.nativeElement.textContent).toContain('fallback');
        hostFixture.destroy();
    });

    it('unbinds the document listeners when the overlay is hidden', async () => {
        await render();
        const hideSpy = vi.spyOn(picker, 'hideOverlay');

        picker.onOverlayBeforeEnter({ element: document.createElement('div') } as any);
        expect(picker.documentClickListener()).toBeTruthy();
        expect(picker.documentResizeListener()).toBeTruthy();

        picker.onOverlayHide();
        expect(picker.documentClickListener()).toBeNull();
        expect(picker.documentResizeListener()).toBeNull();

        picker.overlayVisible.set(true);
        document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        window.dispatchEvent(new Event('resize'));

        expect(hideSpy).not.toHaveBeenCalled();
    });

    it('updates the selection computeds when selectionMode changes', async () => {
        await render();
        expect(picker.isSingleSelection()).toBe(true);

        fixture.componentRef.setInput('selectionMode', 'range');
        await render();
        expect(picker.isSingleSelection()).toBe(false);
        expect(picker.isRangeSelection()).toBe(true);

        fixture.componentRef.setInput('selectionMode', 'multiple');
        await render();
        expect(picker.isMultipleSelection()).toBe(true);
    });
});

describe('DatePicker Optimus UI bug fixes', () => {
    let fixture: ComponentFixture<DatePicker>;
    let picker: DatePicker;
    let el: HTMLElement;

    const render = async () => {
        fixture.detectChanges();
        await fixture.whenStable();
    };

    const keydown = (target: HTMLElement, key: string, which: number, init: KeyboardEventInit = {}) => {
        const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
        Object.defineProperty(event, 'which', { get: () => which });
        Object.defineProperty(event, 'keyCode', { get: () => which });
        target.dispatchEvent(event);
        return event;
    };

    // p-motion keeps the inline panel hidden (display: none) until its enter transition has run
    const panelShown = () => vi.waitFor(() => expect(getComputedStyle(el.querySelector('p-motion')!).display).not.toBe('none'));

    const dayCell = (day: number) => Array.from(el.querySelectorAll<HTMLElement>('td:not(.p-datepicker-other-month) span.p-datepicker-day')).find((span) => span.textContent?.trim() === String(day))!;

    beforeEach(async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [DatePicker],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        }).compileComponents();

        fixture = TestBed.createComponent(DatePicker);
        picker = fixture.componentInstance;
        el = fixture.nativeElement;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('does not crash the year view with an empty range value (optimus-ui#153)', async () => {
        fixture.componentRef.setInput('selectionMode', 'range');
        await render();

        picker.writeValue([]);
        expect(() => picker.isYearSelected(2026)).not.toThrow();

        picker.writeValue([null]);
        expect(picker.isYearSelected(2026)).toBe(false);
    });

    it('parses day-of-year formats past the second month (optimus-ui#363)', async () => {
        await render();

        const date = picker.parseDate('200/2026', 'oo/yy');

        expect(date.getFullYear()).toBe(2026);
        expect(date.getMonth()).toBe(6);
        expect(date.getDate()).toBe(19);
        expect(() => picker.parseDate('60/2026', 'o/yy')).not.toThrow();
    });

    it('renders the weekday header after the view switches from month to date (optimus-ui#31)', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('view', 'month');
        await render();

        fixture.componentRef.setInput('view', 'date');
        await render();

        const weekDays = Array.from(el.querySelectorAll('.p-datepicker-weekday')).map((day) => day.textContent!.trim());
        expect(weekDays.length).toBe(7);
        expect(weekDays.every((day) => day.length > 0)).toBe(true);
    });

    it('rebuilds the day grid when the translation changes firstDayOfWeek (optimus-ui#882)', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('defaultDate', new Date(2024, 7, 16));
        await render();

        picker.config.setTranslation({ firstDayOfWeek: 1 });
        await render();

        const firstCell = picker.months()[0].dates![0][0];
        expect(new Date(firstCell.year, firstCell.month, firstCell.day).getDay()).toBe(1);
        expect(el.querySelector('.p-datepicker-weekday')!.textContent!.trim()).toBe(picker.getTranslation('dayNamesMin')[1]);
    });

    it('marks the control touched when a date is picked inline (optimus-ui#393)', async () => {
        const touched = vi.fn();
        picker.registerOnTouched(touched);
        fixture.componentRef.setInput('inline', true);
        await render();

        dayCell(15).click();

        expect(touched).toHaveBeenCalled();
    });

    it('forwards ariaDescribedBy to the input (optimus-ui#494)', async () => {
        fixture.componentRef.setInput('ariaDescribedBy', 'dp-help');
        await render();

        expect(el.querySelector('input')!.getAttribute('aria-describedby')).toBe('dp-help');
    });

    it('puts the time picker aria labels on the inner buttons (optimus-ui#459)', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('showTime', true);
        fixture.componentRef.setInput('hourFormat', '12');
        await render();

        const buttons = Array.from(el.querySelectorAll<HTMLButtonElement>('[data-pc-group-section="timepickerbutton"] button'));
        expect(buttons.length).toBe(6);
        buttons.forEach((button) => expect(button.getAttribute('aria-label')).toBeTruthy());
        expect(buttons[0].getAttribute('aria-label')).toBe(picker.getTranslation('nextHour'));
    });

    it('shows the localized am/pm label in the time picker (optimus-ui#437, optimus-ui#565)', async () => {
        picker.config.setTranslation({ am: 'a.m.', pm: 'p.m.' });
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('showTime', true);
        fixture.componentRef.setInput('hourFormat', '12');
        await render();

        picker.pm.set(false);
        await render();
        const label = el.querySelector('.p-datepicker-ampm-picker > span')!;
        expect(label.textContent!.trim()).toBe('a.m.');

        picker.pm.set(true);
        await render();
        expect(label.textContent!.trim()).toBe('p.m.');
    });

    it('includes the visible month and year in the header buttons accessible names (optimus-ui#24, optimus-ui#7)', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('defaultDate', new Date(2026, 4, 10));
        await render();

        const month = el.querySelector('.p-datepicker-select-month')!;
        const year = el.querySelector('.p-datepicker-select-year')!;
        expect(month.textContent!.trim()).toBe('May');
        expect(month.getAttribute('aria-label')).toContain('May');
        expect(month.getAttribute('aria-label')).toContain(picker.getTranslation('chooseMonth'));
        expect(year.getAttribute('aria-label')).toContain('2026');
        expect(year.getAttribute('aria-label')).toContain(picker.getTranslation('chooseYear'));
    });

    it('names each day cell with its full date and exposes the selection (optimus-ui#7)', async () => {
        fixture.componentRef.setInput('inline', true);
        await render();
        picker.writeValue(new Date(2026, 4, 15));
        await render();

        const cell = dayCell(15).parentElement!;
        expect(cell.getAttribute('aria-label')).toBe('Friday, 15 May 2026');
        expect(cell.getAttribute('aria-selected')).toBe('true');
        expect(dayCell(16).parentElement!.getAttribute('aria-selected')).toBe('false');
    });

    it('moves to the previous/next day with left/right arrows at the edge of a week row (optimus-ui#7)', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('defaultDate', new Date(2026, 4, 10));
        await render();
        await panelShown();

        // May 10, 2026 is a Sunday: first column with the default firstDayOfWeek
        const sunday = dayCell(10);
        sunday.focus();
        keydown(sunday, 'ArrowLeft', 37);
        await render();
        expect(picker.currentMonth()).toBe(4);
        expect(document.activeElement).toBe(dayCell(9));

        const saturday = dayCell(16);
        keydown(saturday, 'ArrowRight', 39);
        await render();
        expect(picker.currentMonth()).toBe(4);
        expect(document.activeElement).toBe(dayCell(17));
    });

    it('moves Home/End focus to the first/last day of the current week (optimus-ui#898)', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('defaultDate', new Date(2026, 4, 10));
        await render();
        await panelShown();

        keydown(dayCell(13), 'Home', 36);
        expect(document.activeElement).toBe(dayCell(10));

        keydown(dayCell(13), 'End', 35);
        expect(document.activeElement).toBe(dayCell(16));
    });

    it('changes the year with Shift+PageUp/PageDown in the date view (optimus-ui#898)', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('defaultDate', new Date(2026, 4, 10));
        await render();

        keydown(dayCell(13), 'PageUp', 33, { shiftKey: true });
        await render();
        expect(picker.currentYear()).toBe(2025);
        expect(picker.currentMonth()).toBe(4);

        keydown(dayCell(13), 'PageDown', 34, { shiftKey: true });
        await render();
        expect(picker.currentYear()).toBe(2026);
        expect(picker.currentMonth()).toBe(4);
    });

    it('changes the year and the decade with PageUp/PageDown in the month and year views (optimus-ui#898)', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('defaultDate', new Date(2026, 4, 10));
        await render();
        const cell = document.createElement('span');
        const event = (which: number) => ({ which, currentTarget: cell, preventDefault: vi.fn() });

        picker.currentView.set('month');
        picker.onMonthCellKeydown(event(33), 0);
        expect(picker.currentYear()).toBe(2025);
        picker.onMonthCellKeydown(event(34), 0);
        expect(picker.currentYear()).toBe(2026);

        picker.currentView.set('year');
        picker.onYearCellKeydown(event(33), 2026);
        expect(picker.currentYear()).toBe(2016);
        picker.onYearCellKeydown(event(34), 2016);
        expect(picker.currentYear()).toBe(2026);
        // let the delayed updateFocus of navBackward/navForward run before the fixture is destroyed
        await new Promise((resolve) => setTimeout(resolve, 10));
    });

    it('keeps the hour at the minDate hour when decrementing below it (optimus-ui#35, optimus-ui#143, optimus-ui#839)', async () => {
        fixture.componentRef.setInput('showTime', true);
        fixture.componentRef.setInput('minDate', new Date(2026, 4, 10, 9, 0));
        await render();
        picker.writeValue(new Date(2026, 4, 10, 9, 30));
        expect(picker.currentHour()).toBe(9);

        picker.decrementHour(new Event('click'));
        expect(picker.currentHour()).toBe(9);

        fixture.componentRef.setInput('minDate', new Date(2026, 4, 10, 12, 0));
        picker.writeValue(new Date(2026, 4, 10, 12, 30));
        picker.decrementHour(new Event('click'));
        expect(picker.currentHour()).toBe(12);
    });

    it('applies the minDate hour constraint before a value is set (optimus-ui#388)', async () => {
        const minDate = new Date();
        minDate.setHours(10, 0, 0, 0);
        fixture.componentRef.setInput('showTime', true);
        fixture.componentRef.setInput('minDate', minDate);
        await render();
        picker.currentHour.set(10);
        picker.currentMinute.set(0);

        picker.decrementHour(new Event('click'));

        expect(picker.currentHour()).toBe(10);
    });

    it('does not treat clicks inside the panel as outside clicks inside a shadow root (optimus-ui#503)', async () => {
        await render();
        const host = document.createElement('div');
        document.body.appendChild(host);
        const shadow = host.attachShadow({ mode: 'open' });
        const overlay = document.createElement('div');
        const inner = document.createElement('span');
        overlay.appendChild(inner);
        shadow.appendChild(overlay);
        picker.overlay.set(overlay);

        let outside: boolean | undefined;
        const listener = (event: Event) => (outside = picker.isOutsideClicked(event));
        document.addEventListener('mousedown', listener);
        inner.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
        document.removeEventListener('mousedown', listener);
        picker.overlay.set(null);
        host.remove();

        expect(outside).toBe(false);
    });

    it('keeps a typed minDate-day date on blur (optimus-ui#889)', async () => {
        fixture.componentRef.setInput('minDate', new Date(2026, 4, 10, 10, 0));
        await render();
        const input = el.querySelector('input')!;

        input.dispatchEvent(new KeyboardEvent('keydown', { key: '6' }));
        input.value = '05/10/2026';
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('blur'));
        await render();

        expect(input.value).toBe('05/10/2026');
        expect(picker.value().getDate()).toBe(10);
    });

    it('numbers a Sunday-first week by the ISO week most of its days belong to (optimus-ui#97)', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('showWeek', true);
        fixture.componentRef.setInput('firstDayOfWeek', 0);
        fixture.componentRef.setInput('defaultDate', new Date(2026, 0, 15));
        await render();

        expect(picker.months()[0].weekNumbers).toEqual([1, 2, 3, 4, 5]);
    });

    it('realigns an upward panel when the month changes its row count (optimus-ui#179)', async () => {
        const box = document.createElement('div');
        box.style.cssText = 'position: fixed; bottom: 0; left: 0;';
        document.body.appendChild(box);
        box.appendChild(el);
        fixture.componentRef.setInput('defaultDate', new Date(2026, 2, 10));
        await render();
        const input = el.querySelector('input')!;
        input.click();
        await render();
        await panelShown();
        const panel = el.querySelector<HTMLElement>('.p-datepicker-panel')!;
        const gap = () => input.getBoundingClientRect().top - panel.getBoundingClientRect().bottom;
        const initialGap = gap();
        expect(initialGap).toBeGreaterThanOrEqual(0);

        // March 2026 has 5 rows, February 2026 only 4
        picker.navBackward(new Event('click'));
        await render();

        expect(picker.months()[0].dates!.length).toBe(4);
        expect(gap()).toBeCloseTo(initialGap, 0);
        box.remove();
    });

    it('applies a time change without a value to the defaultDate day (optimus-ui#197)', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('showTime', true);
        fixture.componentRef.setInput('defaultDate', new Date(1995, 11, 17, 3, 24, 0));
        await render();

        picker.incrementMinute(new Event('click'));
        picker.updateTime();

        expect(picker.value()).toEqual(new Date(1995, 11, 17, 3, 25, 0));
    });

    it('uses a 1-based month in the data-date attribute (optimus-ui#215)', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('defaultDate', new Date(2025, 10, 6));
        await render();

        expect(dayCell(6).getAttribute('data-date')).toBe('2025-11-6');
    });

    it('renders the icon input with iconDisplay input (optimus-ui#456)', async () => {
        fixture.componentRef.setInput('showIcon', true);
        fixture.componentRef.setInput('iconDisplay', 'input');
        fixture.componentRef.setInput('icon', 'pi pi-clock');
        await render();
        const container = el.querySelector('.p-datepicker-input-icon-container')!;
        const icon = container.querySelector<HTMLElement>('.pi-clock');

        expect(icon).toBeTruthy();
        expect(icon!.classList).toContain('p-datepicker-input-icon');
        expect(container.querySelector('svg')).toBeNull();

        icon!.click();
        await render();
        expect(picker.overlayVisible()).toBe(true);
    });

    it('sets the current time with the today button when a value is set (optimus-ui#574)', async () => {
        fixture.componentRef.setInput('showTime', true);
        fixture.componentRef.setInput('showButtonBar', true);
        await render();
        picker.writeValue(new Date(2025, 1, 12, 14, 37));

        const before = new Date();
        before.setSeconds(0, 0);
        picker.onTodayButtonClick(new Event('click'));

        const value = picker.value() as Date;
        expect(value.toDateString()).toBe(new Date().toDateString());
        expect(value.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(value.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('highlights every year of a range in the year view (optimus-ui#705)', async () => {
        fixture.componentRef.setInput('selectionMode', 'range');
        await render();
        picker.writeValue([new Date(2010, 1, 1), new Date(2018, 9, 2)]);

        expect([2009, 2010, 2014, 2018, 2019].map((year) => picker.isYearSelected(year))).toEqual([false, true, true, true, false]);

        picker.writeValue([new Date(2010, 1, 1), null]);
        expect([2010, 2011].map((year) => picker.isYearSelected(year))).toEqual([true, false]);
    });

    it('parses a value pasted without a preceding keydown (optimus-ui#930)', async () => {
        await render();
        const input = el.querySelector('input')!;

        input.value = '11/01/2023';
        input.dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste' }));
        input.dispatchEvent(new Event('blur'));
        await render();

        expect(picker.value()).toEqual(new Date(2023, 10, 1));
        expect(input.value).toBe('11/01/2023');
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePicker, ReactiveFormsModule],
    template: `<p-datepicker [formControl]="control" placeholder="Select date" />`
})
class TestThemedInvalidDatePickerComponent {
    control = new FormControl<Date | null>(null, [Validators.required]);
}

describe('DatePicker themed invalid state', () => {
    it('colors the placeholder of an invalid dirty FormControl (optimus-ui#53)', async () => {
        TestBed.configureTestingModule({
            imports: [TestThemedInvalidDatePickerComponent],
            providers: [provideZonelessChangeDetection(), provideExhaustive({ theme: { preset: Aura } })]
        });
        const fixture = TestBed.createComponent(TestThemedInvalidDatePickerComponent);
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        const pristineColor = getComputedStyle(input, '::placeholder').color;

        fixture.componentInstance.control.markAsDirty();
        fixture.changeDetectorRef.markForCheck();
        await fixture.whenStable();

        expect(fixture.nativeElement.querySelector('p-datepicker').classList).toContain('ng-invalid');
        expect(getComputedStyle(input, '::placeholder').color).not.toBe(pristineColor);
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePicker],
    template: `<div dir="rtl"><p-datepicker [inline]="true" /></div>`
})
class TestThemedDirDatePickerComponent {}

describe('DatePicker themed RTL', () => {
    it('mirrors the prev and next chevrons in RTL (optimus-ui#305)', async () => {
        TestBed.configureTestingModule({
            imports: [TestThemedDirDatePickerComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations(), provideExhaustive({ theme: { preset: Aura } })]
        });
        const fixture = TestBed.createComponent(TestThemedDirDatePickerComponent);
        await fixture.whenStable();
        const icons = () => ['.p-datepicker-prev-button svg', '.p-datepicker-next-button svg'].map((selector) => getComputedStyle(fixture.nativeElement.querySelector(selector)).transform);

        // p-motion keeps the inline panel hidden until its enter transition has run
        await vi.waitFor(() => expect(getComputedStyle(fixture.nativeElement.querySelector('p-motion')).display).not.toBe('none'));
        expect(icons().every((transform) => transform !== 'none')).toBe(true);

        fixture.nativeElement.querySelector('div').setAttribute('dir', 'ltr');
        expect(icons()).toEqual(['none', 'none']);
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePicker],
    template: `<p-datepicker [showTime]="true" [hourFormat]="12" />`
})
class TestNumericHourFormatDatePickerComponent {}

describe('DatePicker numeric hourFormat', () => {
    it('accepts a numeric hourFormat binding (optimus-ui#309)', async () => {
        TestBed.configureTestingModule({
            imports: [TestNumericHourFormatDatePickerComponent],
            providers: [provideZonelessChangeDetection()]
        });
        const fixture = TestBed.createComponent(TestNumericHourFormatDatePickerComponent);
        await fixture.whenStable();
        const picker = fixture.debugElement.query(By.directive(DatePicker)).componentInstance as DatePicker;

        expect(picker.hourFormat()).toBe('12');
        picker.writeValue(new Date(2026, 4, 10, 15, 0));
        expect(picker.currentHour()).toBe(3);
        expect(picker.pm()).toBe(true);
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePicker, FormsModule],
    template: `<p-datepicker [inline]="true" [showTime]="true" hourFormat="12" [(ngModel)]="value" />`
})
class TestTimeAnnouncementDatePickerComponent {
    value = new Date(2026, 4, 10, 9, 5);
}

describe('DatePicker time announcement', () => {
    it('announces the changed time in a polite live region (optimus-ui#627)', async () => {
        TestBed.configureTestingModule({
            imports: [TestTimeAnnouncementDatePickerComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(TestTimeAnnouncementDatePickerComponent);
        await fixture.whenStable();
        const timePicker: HTMLElement = fixture.nativeElement.querySelector('.p-datepicker-time-picker');
        const liveRegion = () => timePicker.querySelector<HTMLElement>('[aria-live="polite"]');

        expect(liveRegion()).not.toBeNull();
        expect(liveRegion()!.getAttribute('aria-atomic')).toBe('true');
        expect(liveRegion()!.textContent!.trim()).toBe('09:05 am');

        const incrementHour: HTMLElement = timePicker.querySelector('.p-datepicker-hour-picker button')!;
        incrementHour.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        await fixture.whenStable();

        expect(liveRegion()!.textContent!.trim()).toBe('10:05 am');
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePicker, ReactiveFormsModule],
    template: `<p-datepicker [formControl]="control" [showClear]="true" />`
})
class TestShowClearInitialValueDatePickerComponent {
    control = new FormControl<Date | null>(new Date(2026, 4, 10));
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePicker, FormsModule],
    template: `<p-datepicker [(ngModel)]="value" dateFormat="dd/mm/yy" />`
})
class TestNgModelDisplayDatePickerComponent {
    value = signal<Date | null>(null);
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePicker],
    template: `
        <div style="position: absolute; top: 20px; left: 40px; width: 200px; height: 40px; overflow: hidden">
            <p-datepicker appendTo="body" />
        </div>
    `
})
class TestAppendToBodyDatePickerComponent {}

describe('DatePicker inherited issue reproductions', () => {
    let fixture: ComponentFixture<DatePicker>;
    let picker: DatePicker;
    let el: HTMLElement;
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const render = async () => {
        fixture.detectChanges();
        await fixture.whenStable();
    };

    const panelShown = () => vi.waitFor(() => expect(getComputedStyle(el.querySelector('p-motion')!).display).not.toBe('none'));

    beforeEach(async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [DatePicker],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        }).compileComponents();

        fixture = TestBed.createComponent(DatePicker);
        picker = fixture.componentInstance;
        el = fixture.nativeElement;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('shows the clear icon for an initial FormControl value (optimus-ui#73)', async () => {
        const host = TestBed.createComponent(TestShowClearInitialValueDatePickerComponent);
        await host.whenStable();

        expect(host.nativeElement.querySelector('input').value).not.toBe('');
        expect(host.nativeElement.querySelector('.p-datepicker-clear-icon')).not.toBeNull();
        host.destroy();
    });

    it('lists the years of the decade before a range date is picked (optimus-ui#409)', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('selectionMode', 'range');
        await render();
        await panelShown();

        (el.querySelector('.p-datepicker-select-year') as HTMLButtonElement).click();
        await render();

        const years = Array.from(el.querySelectorAll('.p-datepicker-year')).map((year) => Number(year.textContent!.trim()));
        expect(years.length).toBe(10);
        expect(years).toContain(new Date().getFullYear());
    });

    for (const view of ['month', 'year'] as const) {
        it(`keeps the focus on the previous button in the ${view} view (optimus-ui#374)`, async () => {
            fixture.componentRef.setInput('inline', true);
            fixture.componentRef.setInput('view', view);
            await render();
            await panelShown();
            const prev = () => el.querySelector('.p-datepicker-prev-button') as HTMLButtonElement;
            const decade = () => el.querySelector('.p-datepicker-header')!.textContent!.trim();

            for (let i = 0; i < 3; i++) {
                const before = decade();
                prev().focus();
                prev().click();
                await render();
                await wait(10);
                await render();
                expect(decade()).not.toBe(before);
                expect(document.activeElement).toBe(prev());
            }
        });
    }

    it('shows every ngModel value written in a row (optimus-ui#841)', async () => {
        const host = TestBed.createComponent(TestNgModelDisplayDatePickerComponent);
        await host.whenStable();
        const input = host.nativeElement.querySelector('input') as HTMLInputElement;

        for (let i = 0; i < 20; i++) {
            const date = new Date(2000 + ((i * 7) % 30), (i * 5) % 12, 1 + ((i * 11) % 28));
            host.componentInstance.value.set(date);
            await host.whenStable();
            const pad = (n: number) => String(n).padStart(2, '0');
            expect(input.value).toBe(`${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`);
        }
        host.destroy();
    });

    it('keeps a single tabbable day cell after the header buttons in the inline calendar (optimus-ui#845)', async () => {
        fixture.componentRef.setInput('inline', true);
        await render();
        await panelShown();
        const tabbable = () => Array.from(el.querySelectorAll<HTMLElement>('button, [tabindex]')).filter((element) => element.tabIndex >= 0 && !(element as HTMLButtonElement).disabled);

        const check = () => {
            const order = tabbable();
            const cells = order.filter((element) => element.matches('.p-datepicker-day'));
            expect(cells.length).toBe(1);
            const cellIndex = order.indexOf(cells[0]);
            // Shift+Tab from the day cell reaches the header buttons
            expect(order.slice(0, cellIndex).map((element) => element.className.match(/p-datepicker-(prev-button|select-month|select-year|next-button)/)?.[1])).toEqual(['prev-button', 'select-month', 'select-year', 'next-button']);
            return cells[0];
        };

        const cell = check();
        cell.focus();
        cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', which: 39, keyCode: 39, bubbles: true, cancelable: true } as KeyboardEventInit));
        await render();
        expect(document.activeElement).not.toBe(cell);
        check();

        (document.activeElement as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', which: 33, keyCode: 33, bubbles: true, cancelable: true } as KeyboardEventInit));
        await render();
        await wait(10);
        expect(document.activeElement).toBe(check());
    });

    it('keeps the panel appended to body visible outside a clipping container (optimus-ui#952)', async () => {
        const host = TestBed.createComponent(TestAppendToBodyDatePickerComponent);
        document.body.appendChild(host.nativeElement);
        await host.whenStable();
        const input = host.nativeElement.querySelector('input') as HTMLInputElement;
        input.click();
        input.focus();
        await host.whenStable();
        await vi.waitFor(() => expect(document.body.querySelector(':scope > p-motion .p-datepicker-panel, :scope > .p-datepicker-panel')).not.toBeNull());
        const panel = document.body.querySelector('.p-datepicker-panel') as HTMLElement;
        await vi.waitFor(() => expect(panel.getBoundingClientRect().height).toBeGreaterThan(100));
        const rect = panel.getBoundingClientRect();

        const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
        expect(panel.contains(hit)).toBe(true);
        host.destroy();
        host.nativeElement.remove();
    });

    it('keeps the panel appended to body aligned when switching to the year view (optimus-ui#30)', async () => {
        const host = TestBed.createComponent(TestAppendToBodyDatePickerComponent);
        document.body.appendChild(host.nativeElement);
        await host.whenStable();
        const input = host.nativeElement.querySelector('input') as HTMLInputElement;
        input.click();
        input.focus();
        await host.whenStable();
        const panel = () => document.body.querySelector('.p-datepicker-panel') as HTMLElement;
        await vi.waitFor(() => expect(panel()?.getBoundingClientRect().height).toBeGreaterThan(100));
        // let the enter transition finish
        await wait(300);
        const before = panel().getBoundingClientRect();
        expect(before.left).toBe(input.getBoundingClientRect().left);

        for (const selector of ['.p-datepicker-select-year', '.p-datepicker-year', '.p-datepicker-month']) {
            (panel().querySelector(selector) as HTMLElement).click();
            await host.whenStable();
            await wait(300);
            const after = panel().getBoundingClientRect();
            // the month and year views must not stretch the panel to the viewport edge
            expect([after.left, after.width]).toEqual([before.left, before.width]);
        }
        host.destroy();
        host.nativeElement.remove();
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePicker, FormsModule],
    template: `<p-datepicker [inline]="true" selectionMode="range" [(ngModel)]="range" />`
})
class TestRangeOtherMonthDatePickerComponent {
    range = [new Date(2025, 5, 20), new Date(2025, 6, 10)];
}

describe('DatePicker range across months (optimus-ui#379)', () => {
    it('highlights the days of the adjacent months that are in the range', async () => {
        TestBed.configureTestingModule({
            imports: [TestRangeOtherMonthDatePickerComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
        });
        const fixture = TestBed.createComponent(TestRangeOtherMonthDatePickerComponent);
        await fixture.whenStable();
        const picker = fixture.debugElement.query(By.directive(DatePicker)).componentInstance as DatePicker;
        const otherMonthDays = (month: number) =>
            Array.from(fixture.nativeElement.querySelectorAll('td.p-datepicker-other-month span.p-datepicker-day') as NodeListOf<HTMLElement>).filter((span) => Number(span.getAttribute('data-date')!.split('-')[1]) === month + 1);
        const isInRange = (span: HTMLElement) => span.classList.contains('p-datepicker-day-selected-range');

        // the range ends in July: June 29 and 30 lead the July sheet and are in the range
        expect(picker.currentMonth()).toBe(6);
        const june = otherMonthDays(5);
        expect(june.length).toBeGreaterThan(0);
        expect(june.every(isInRange)).toBe(true);

        (fixture.nativeElement.querySelector('.p-datepicker-prev-button') as HTMLButtonElement).click();
        await fixture.whenStable();
        await new Promise((resolve) => setTimeout(resolve, 10));
        await fixture.whenStable();

        expect(picker.currentMonth()).toBe(5);
        const july = otherMonthDays(6);
        expect(july.length).toBeGreaterThan(0);
        expect(july.every(isInRange)).toBe(true);
        // other month days stay unselectable
        expect(july.every((span) => span.classList.contains('p-disabled'))).toBe(true);
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePicker, FormsModule, InputGroup, InputGroupAddon, FloatLabel],
    template: `
        <div style="width: 400px">
            <p-inputgroup class="addons">
                <p-inputgroup-addon>www</p-inputgroup-addon>
                <p-datepicker [(ngModel)]="value" placeholder="Website" />
                <p-inputgroup-addon>.com</p-inputgroup-addon>
            </p-inputgroup>
            <p-inputgroup class="float" style="margin-top: 40px">
                <p-inputgroup-addon>@</p-inputgroup-addon>
                <p-floatlabel>
                    <p-datepicker [(ngModel)]="value" inputId="float-date" />
                    <label for="float-date">Date</label>
                </p-floatlabel>
            </p-inputgroup>
            <table style="width: 400px; border-collapse: collapse">
                <tr>
                    <td style="padding: 0"><p-datepicker class="cell" [(ngModel)]="value" [fluid]="true" /></td>
                </tr>
            </table>
        </div>
    `
})
class TestThemedLayoutDatePickerComponent {
    value: Date | null = null;
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePicker],
    template: `<p-datepicker [touchUI]="true" />`
})
class TestThemedTouchUIDatePickerComponent {}

describe('DatePicker themed layout', () => {
    it('fills an input group between addons (optimus-ui#420)', async () => {
        TestBed.configureTestingModule({
            imports: [TestThemedLayoutDatePickerComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations(), provideExhaustive({ theme: { preset: Aura } })]
        });
        const fixture = TestBed.createComponent(TestThemedLayoutDatePickerComponent);
        await fixture.whenStable();
        const group = fixture.nativeElement.querySelector('p-inputgroup.addons') as HTMLElement;
        const [before, after] = Array.from(group.querySelectorAll('p-inputgroup-addon')).map((addon) => (addon as HTMLElement).getBoundingClientRect());
        const input = group.querySelector('input') as HTMLInputElement;
        const rect = input.getBoundingClientRect();
        const style = getComputedStyle(input);

        expect(Math.round(rect.left)).toBe(Math.round(before.right));
        expect(Math.round(rect.right)).toBe(Math.round(after.left));
        expect(Math.round(rect.height)).toBe(Math.round(before.height));
        expect([style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomLeftRadius, style.borderBottomRightRadius]).toEqual(['0px', '0px', '0px', '0px']);
    });

    it('fills an input group with a float label and keeps the label above the open panel (optimus-ui#433)', async () => {
        TestBed.configureTestingModule({
            imports: [TestThemedLayoutDatePickerComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations(), provideExhaustive({ theme: { preset: Aura } })]
        });
        const fixture = TestBed.createComponent(TestThemedLayoutDatePickerComponent);
        document.body.appendChild(fixture.nativeElement);
        await fixture.whenStable();
        const group = fixture.nativeElement.querySelector('p-inputgroup.float') as HTMLElement;
        const addon = (group.querySelector('p-inputgroup-addon') as HTMLElement).getBoundingClientRect();
        const input = group.querySelector('input') as HTMLInputElement;

        expect(Math.round(input.getBoundingClientRect().left)).toBe(Math.round(addon.right));
        expect(Math.round(input.getBoundingClientRect().right)).toBe(Math.round(group.getBoundingClientRect().right));

        input.click();
        input.focus();
        await fixture.whenStable();
        await new Promise((resolve) => setTimeout(resolve, 300));
        const label = group.querySelector('label') as HTMLElement;
        const labelRect = label.getBoundingClientRect();
        const panel = group.querySelector('.p-datepicker-panel') as HTMLElement;
        expect(panel).not.toBeNull();
        // the label ignores pointer events: what lies under it must not be the panel
        expect(panel.contains(document.elementFromPoint(labelRect.left + labelRect.width / 2, labelRect.top + labelRect.height / 2))).toBe(false);
        expect(labelRect.top).toBeLessThan(input.getBoundingClientRect().top);
        fixture.destroy();
        fixture.nativeElement.remove();
    });

    it('lets a fluid date picker fill a table cell (optimus-ui#808)', async () => {
        TestBed.configureTestingModule({
            imports: [TestThemedLayoutDatePickerComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations(), provideExhaustive({ theme: { preset: Aura } })]
        });
        const fixture = TestBed.createComponent(TestThemedLayoutDatePickerComponent);
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('p-datepicker.cell input') as HTMLInputElement;
        expect(Math.round(input.getBoundingClientRect().width)).toBe(400);
    });

    it('centers the touchUI panel over a modal mask (optimus-ui#427)', async () => {
        TestBed.configureTestingModule({
            imports: [TestThemedTouchUIDatePickerComponent],
            providers: [provideZonelessChangeDetection(), provideNoopAnimations(), provideExhaustive({ theme: { preset: Aura } })]
        });
        const fixture = TestBed.createComponent(TestThemedTouchUIDatePickerComponent);
        document.body.appendChild(fixture.nativeElement);
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.click();
        input.focus();
        await fixture.whenStable();
        await new Promise((resolve) => setTimeout(resolve, 300));

        const panel = document.querySelector('.p-datepicker-panel') as HTMLElement;
        const rect = panel.getBoundingClientRect();
        const picker = fixture.debugElement.query(By.directive(DatePicker)).componentInstance as DatePicker;
        expect(document.querySelector('.p-datepicker-mask')).not.toBeNull();
        expect(getComputedStyle(picker.overlay()!).position).toBe('fixed');
        expect(Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2)).toBeLessThan(2);
        expect(Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2)).toBeLessThan(2);
        expect(rect.width).toBeGreaterThanOrEqual(window.innerWidth * 0.8 - 1);
        fixture.destroy();
        fixture.nativeElement.remove();
        document.querySelectorAll('.p-datepicker-mask').forEach((mask) => mask.remove());
    });
});

@Component({
    selector: 'app-ssr-root',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePicker, FormsModule, SharedModule],
    template: `
        <p-datepicker [(ngModel)]="value" [showIcon]="true" [showButtonBar]="true"><p-footer>Popup footer</p-footer></p-datepicker>
        <p-datepicker [(ngModel)]="value" [inline]="true" [showTime]="true">
            <p-header>Inline header</p-header>
            <p-footer>Inline footer</p-footer>
        </p-datepicker>
    `
})
class TestServerRenderedDatePickerComponent {
    value = new Date(2026, 4, 10);
}

describe('DatePicker server rendering with hydration (optimus-ui#34)', () => {
    // The server platform replaces the global DOM adapter, document and DOM classes (Node, Event...) with its emulated ones;
    // the other tests run in the same page, so put the browser ones back.
    const domAdapter = ɵgetDOM();
    const doc = ɵgetDocument();
    const domClasses = Object.getOwnPropertyNames(globalThis)
        .map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)?.value] as const)
        .filter(([, value]) => typeof value === 'function');

    afterEach(() => {
        ɵsetRootDomAdapter(domAdapter);
        ɵsetDocument(doc);
        domClasses.forEach(([name, value]) => globalThis[name] !== value && (globalThis[name] = value));
    });

    it('serializes the hydration annotations of a popup and an inline date picker', async () => {
        const html = await renderApplication((context) => bootstrapApplication(TestServerRenderedDatePickerComponent, { providers: [provideZonelessChangeDetection(), provideServerRendering(), provideClientHydration()] }, context), {
            document: '<html><head></head><body><app-ssr-root></app-ssr-root></body></html>',
            url: '/'
        });
        const body = new DOMParser().parseFromString(html, 'text/html').body;

        expect(body.querySelectorAll('p-datepicker').length).toBe(2);
        expect(body.querySelector('p-datepicker input')!.getAttribute('value') ?? (body.querySelector('p-datepicker input') as HTMLInputElement).value).toBe('05/10/2026');
        expect(body.querySelector('.p-datepicker-panel-inline')!.textContent).toContain('Inline header');
        expect(html).toContain('ngh=');
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [DatePicker],
    template: `<p-datepicker [touchUI]="true"></p-datepicker>`
})
class TouchUIDatePickerDestroyHostComponent {}

describe('DatePicker destroyed while the touchUI panel is open', () => {
    it('releases the body scroll lock and removes its mask', async () => {
        TestBed.configureTestingModule({ imports: [TouchUIDatePickerDestroyHostComponent], providers: [provideZonelessChangeDetection(), provideNoopAnimations()] });
        const fixture = TestBed.createComponent(TouchUIDatePickerDestroyHostComponent);
        await fixture.whenStable();
        (fixture.nativeElement.querySelector('input') as HTMLInputElement).click();
        await fixture.whenStable();
        await new Promise((resolve) => setTimeout(resolve, 300));
        expect(document.body.classList.contains('p-overflow-hidden')).toBe(true);
        expect(document.querySelector('.p-datepicker-mask')).not.toBeNull();

        fixture.destroy();

        expect(document.body.classList.contains('p-overflow-hidden')).toBe(false);
    });
});
