import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { FilterService } from './filterservice';

describe('FilterService', () => {
    it('dateAfter does not modify the row date (#373)', () => {
        const service = TestBed.inject(FilterService);
        const value = new Date(2026, 10, 20, 15, 30, 45);
        const filter = new Date(2026, 10, 19);

        expect(service.filters.dateAfter(value, filter)).toBe(true);
        expect(value.getHours()).toBe(15);
        expect(value.getMinutes()).toBe(30);
        expect(value.getSeconds()).toBe(45);
    });

    it('dateAfter still compares by day', () => {
        const service = TestBed.inject(FilterService);

        expect(service.filters.dateAfter(new Date(2026, 10, 20, 23, 0), new Date(2026, 10, 20))).toBe(false);
        expect(service.filters.dateAfter(new Date(2026, 10, 21, 0, 1), new Date(2026, 10, 20))).toBe(true);
    });
});
