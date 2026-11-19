import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PrimeTemplate, SharedModule } from './shared';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
    selector: 'test-prime-template',
    template: `
        <ng-template pTemplate="header"><span>Header</span></ng-template>
        <ng-template [pTemplate]="dynamicName"><span>Dynamic</span></ng-template>
        <ng-template pTemplate><span>Unnamed</span></ng-template>
    `
})
class TestPrimeTemplateComponent {
    dynamicName = 'item';
}

describe('PrimeTemplate', () => {
    let fixture: ComponentFixture<TestPrimeTemplateComponent>;
    let templates: PrimeTemplate[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule],
            declarations: [TestPrimeTemplateComponent],
            providers: [provideZonelessChangeDetection()]
        });

        fixture = TestBed.createComponent(TestPrimeTemplateComponent);
        fixture.detectChanges();
        templates = fixture.debugElement.queryAllNodes(By.directive(PrimeTemplate)).map((node) => node.injector.get(PrimeTemplate));
    });

    it('should expose the pTemplate value through name and getType', () => {
        expect(templates.length).toBe(3);
        expect(templates[0].name()).toBe('header');
        expect(templates[0].getType()).toBe('header');
    });

    it('should inject the host TemplateRef', () => {
        expect(templates[0].template).toBeInstanceOf(TemplateRef);
    });

    it('should update name when the bound pTemplate value changes', async () => {
        expect(templates[1].getType()).toBe('item');

        fixture.componentInstance.dynamicName = 'footer';
        fixture.changeDetectorRef.markForCheck();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(templates[1].name()).toBe('footer');
        expect(templates[1].getType()).toBe('footer');
    });

    it('should read a bare pTemplate attribute as an empty name', () => {
        expect(templates[2].name()).toBe('');
        expect(templates[2].getType()).toBe('');
    });
});
