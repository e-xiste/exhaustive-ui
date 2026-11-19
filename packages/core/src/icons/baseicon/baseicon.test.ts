import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CheckIcon } from '@exhaustive-ui/core/icons/check';
import { BaseIcon } from './baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-icon-bound-spin',
    template: `<svg data-p-icon="check" [spin]="spin"></svg>`
})
class TestIconBoundSpinComponent {
    spin = false;
}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-icon-attribute-spin',
    template: `<svg data-p-icon="check" spin></svg>`
})
class TestIconAttributeSpinComponent {}

describe('BaseIcon', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CheckIcon],
            declarations: [TestIconBoundSpinComponent, TestIconAttributeSpinComponent],
            providers: [provideZonelessChangeDetection()]
        });
    });

    describe('spin input', () => {
        let fixture: ComponentFixture<TestIconBoundSpinComponent>;
        let icon: BaseIcon;
        let svg: SVGElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestIconBoundSpinComponent);
            fixture.detectChanges();
            const debugElement = fixture.debugElement.query(By.directive(CheckIcon));
            icon = debugElement.componentInstance;
            svg = debugElement.nativeElement;
        });

        it('should default to false and render the base class only', () => {
            expect(icon.spin()).toBe(false);
            expect(svg.classList.contains('p-icon')).toBe(true);
            expect(svg.classList.contains('p-icon-spin')).toBe(false);
        });

        it('should re-render the spin class when the bound value changes', async () => {
            fixture.componentInstance.spin = true;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(icon.spin()).toBe(true);
            expect(svg.classList.contains('p-icon-spin')).toBe(true);

            fixture.componentInstance.spin = false;
            fixture.changeDetectorRef.markForCheck();
            await fixture.whenStable();
            fixture.detectChanges();

            expect(icon.spin()).toBe(false);
            expect(svg.classList.contains('p-icon-spin')).toBe(false);
        });

        it('should coerce the bare spin attribute to true', () => {
            const attributeFixture = TestBed.createComponent(TestIconAttributeSpinComponent);
            attributeFixture.detectChanges();
            const debugElement = attributeFixture.debugElement.query(By.directive(CheckIcon));

            expect((debugElement.componentInstance as BaseIcon).spin()).toBe(true);
            expect((debugElement.nativeElement as SVGElement).classList.contains('p-icon-spin')).toBe(true);
        });
    });
});
