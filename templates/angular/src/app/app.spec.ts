import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('lists the tasks and adds one', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('tbody tr').length).toBe(3);

    const input = element.querySelector<HTMLInputElement>('input[name="title"]')!;
    input.value = 'Write a test';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    expect(element.querySelectorAll('tbody tr').length).toBe(4);
    expect(element.querySelector('tbody')!.textContent).toContain('Write a test');
  });
});
