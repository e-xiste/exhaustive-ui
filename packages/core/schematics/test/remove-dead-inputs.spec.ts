import { describe, expect, it } from 'vitest';
import { createAppTree, createMigrationRunner } from './helpers';

describe('remove-dead-inputs', () => {
    it('removes showTransformOptions/hideTransformOptions/showTransitionOptions/hideTransitionOptions from p-toast', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toast showTransformOptions="translateY(100%)" [hideTransformOptions]="hideTf" showTransitionOptions="300ms" hideTransitionOptions="250ms" [life]="3000"></p-toast>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransformOptions');
        expect(html).not.toContain('TransitionOptions');
        expect(html).toBe(`<p-toast [life]="3000"></p-toast>\n`);
    });

    it('removes the same inputs from p-toastItem', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-toastItem [showTransformOptions]="a" [hideTransformOptions]="b" [message]="msg"></p-toastItem>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toastItem [message]="msg"></p-toastItem>\n`);
    });

    it('removes showTransitionOptions/hideTransitionOptions from p-message', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-message showTransitionOptions="300ms" [hideTransitionOptions]="hideTf" [severity]="'info'"></p-message>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransitionOptions');
        expect(html).toBe(`<p-message [severity]="'info'"></p-message>\n`);
    });

    it('removes showTransitionOptions/hideTransitionOptions from p-overlay', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-overlay [(visible)]="visible" showTransitionOptions=".12s ease" [hideTransitionOptions]="hideTf"></p-overlay>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransitionOptions');
        expect(html).toBe(`<p-overlay [(visible)]="visible"></p-overlay>\n`);
    });

    it('removes showTransitionOptions/hideTransitionOptions from p-colorpicker and its aliases', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-colorpicker [(ngModel)]="color" showTransitionOptions=".12s ease" [hideTransitionOptions]="hideTf"></p-colorpicker>\n<p-colorPicker [showTransitionOptions]="showTf" [inline]="true"></p-colorPicker>\n<p-color-picker hideTransitionOptions=".1s linear" format="rgb"></p-color-picker>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransitionOptions');
        expect(html).toBe(`<p-colorpicker [(ngModel)]="color"></p-colorpicker>\n<p-colorPicker [inline]="true"></p-colorPicker>\n<p-color-picker format="rgb"></p-color-picker>\n`);
    });

    it('removes showTransitionOptions/hideTransitionOptions from p-scrolltop and its aliases', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-scrolltop showTransitionOptions=".3s" [hideTransitionOptions]="hideTf" [threshold]="200"></p-scrolltop>\n<p-scrollTop [showTransitionOptions]="showTf" target="parent"></p-scrollTop>\n<p-scroll-top hideTransitionOptions=".1s linear" icon="pi pi-arrow-up"></p-scroll-top>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransitionOptions');
        expect(html).toBe(`<p-scrolltop [threshold]="200"></p-scrolltop>\n<p-scrollTop target="parent"></p-scrollTop>\n<p-scroll-top icon="pi pi-arrow-up"></p-scroll-top>\n`);
    });

    it('removes showTransitionOptions/hideTransitionOptions from p-confirmpopup while keeping motionOptions', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-confirmpopup key="delete" showTransitionOptions=".12s cubic-bezier(0, 0, 0.2, 1)" [hideTransitionOptions]="hideTf" [motionOptions]="motion"></p-confirmpopup>\n<p-confirmpopup [showTransitionOptions]="showTf" defaultFocus="reject"></p-confirmpopup>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransitionOptions');
        expect(html).toBe(`<p-confirmpopup key="delete" [motionOptions]="motion"></p-confirmpopup>\n<p-confirmpopup defaultFocus="reject"></p-confirmpopup>\n`);
    });

    it('removes the deprecated transitionOptions and the dead rtl from p-dialog while keeping motionOptions', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-dialog header="Edit" [(visible)]="visible" transitionOptions="150ms cubic-bezier(0, 0, 0.2, 1)" [motionOptions]="motion" [rtl]="true"></p-dialog>\n<p-dialog [transitionOptions]="transition" rtl [modal]="true"></p-dialog>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('transitionOptions');
        expect(html).not.toContain('rtl');
        expect(html).toBe(`<p-dialog header="Edit" [(visible)]="visible" [motionOptions]="motion"></p-dialog>\n<p-dialog [modal]="true"></p-dialog>\n`);
    });

    it('removes the never-read inputs from every p-confirmdialog selector while keeping the live ones', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html':
                `<p-confirmdialog key="delete" closeAriaLabel="Close" acceptAriaLabel="Yes" [rejectAriaLabel]="noLabel" [rtl]="true" header="Confirm"></p-confirmdialog>\n` +
                `<p-confirmDialog transitionOptions="150ms ease" [focusTrap]="false" defaultFocus="reject" [visible]="visible"></p-confirmDialog>\n` +
                `<p-confirm-dialog rtl focusTrap [closable]="false"></p-confirm-dialog>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-confirmdialog key="delete" header="Confirm"></p-confirmdialog>\n<p-confirmDialog [visible]="visible"></p-confirmDialog>\n<p-confirm-dialog [closable]="false"></p-confirm-dialog>\n`);
    });

    it('keeps closeAriaLabel and focusTrap on p-dialog and defaultFocus on p-confirmpopup', async () => {
        const runner = createMigrationRunner();
        const content = `<p-dialog closeAriaLabel="Close" [focusTrap]="false"></p-dialog>\n<p-confirmpopup defaultFocus="reject"></p-confirmpopup>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('does not report a programmatic closeAriaLabel, focusTrap or defaultFocus access as a leftover', async () => {
        const runner = createMigrationRunner();
        const content = `export class Foo {\n    read(dialog: { closeAriaLabel: string; focusTrap: boolean; defaultFocus: string }) {\n        return [dialog.closeAriaLabel, dialog.focusTrap, dialog.defaultFocus];\n    }\n}\n`;
        const tree = createAppTree({ '/src/app/foo.ts': content });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });

        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/foo.ts')).toBe(content);
        expect(warnings).toEqual([]);
    });

    it('removes the deprecated transitionOptions from p-drawer while keeping motionOptions and ariaCloseLabel', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-drawer [(visible)]="visible" transitionOptions="150ms cubic-bezier(0, 0, 0.2, 1)" [motionOptions]="motion" ariaCloseLabel="Close"></p-drawer>\n<p-drawer [transitionOptions]="transition" position="right"></p-drawer>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('transitionOptions');
        expect(html).toBe(`<p-drawer [(visible)]="visible" [motionOptions]="motion" ariaCloseLabel="Close"></p-drawer>\n<p-drawer position="right"></p-drawer>\n`);
    });

    it('removes showTransitionOptions/hideTransitionOptions and plain from p-splitbutton while keeping motionOptions and dir', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-splitbutton label="Save" [model]="items" showTransitionOptions=".12s cubic-bezier(0, 0, 0.2, 1)" [hideTransitionOptions]="hideTf" [plain]="true" [motionOptions]="motion" dir="rtl"></p-splitbutton>\n<p-splitButton [model]="items" plain [showTransitionOptions]="showTf"></p-splitButton>\n<p-split-button [model]="items" [dir]="direction" hideTransitionOptions=".1s linear"></p-split-button>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransitionOptions');
        expect(html).not.toContain('plain');
        expect(html).toBe(`<p-splitbutton label="Save" [model]="items" [motionOptions]="motion" dir="rtl"></p-splitbutton>\n<p-splitButton [model]="items"></p-splitButton>\n<p-split-button [model]="items" [dir]="direction"></p-split-button>\n`);
    });

    it('removes the deprecated showTransitionOptions/hideTransitionOptions from p-password while keeping motionOptions', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-password [(ngModel)]="value" showTransitionOptions=".12s cubic-bezier(0, 0, 0.2, 1)" [hideTransitionOptions]="hideTf" [motionOptions]="motion" [toggleMask]="true"></p-password>\n<p-password [showTransitionOptions]="showTf" [feedback]="false"></p-password>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransitionOptions');
        expect(html).toBe(`<p-password [(ngModel)]="value" [motionOptions]="motion" [toggleMask]="true"></p-password>\n<p-password [feedback]="false"></p-password>\n`);
    });

    it('removes the deprecated showTransitionOptions/hideTransitionOptions from p-datepicker, p-datePicker and p-date-picker while keeping motionOptions', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-datepicker [(ngModel)]="date" showTransitionOptions=".12s cubic-bezier(0, 0, 0.2, 1)" [hideTransitionOptions]="hideTf" [motionOptions]="motion" [showIcon]="true"></p-datepicker>\n<p-datePicker [showTransitionOptions]="showTf" inline></p-datePicker>\n<p-date-picker hideTransitionOptions=".1s linear" [touchUI]="true"></p-date-picker>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransitionOptions');
        expect(html).toBe(`<p-datepicker [(ngModel)]="date" [motionOptions]="motion" [showIcon]="true"></p-datepicker>\n<p-datePicker inline></p-datePicker>\n<p-date-picker [touchUI]="true"></p-date-picker>\n`);
    });

    it('removes the deprecated size from p-overlayBadge while keeping badgeSize', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-overlayBadge size="large" badgeSize="large" severity="danger"><i class="pi pi-bell"></i></p-overlayBadge>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-overlayBadge badgeSize="large" severity="danger"><i class="pi pi-bell"></i></p-overlayBadge>\n`);
    });

    it('removes a bound [size] from p-overlay-badge', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-overlay-badge [size]="badgeSize" [value]="count"></p-overlay-badge>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-overlay-badge [value]="count"></p-overlay-badge>\n`);
    });

    it('removes the deprecated size from p-overlaybadge', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-overlaybadge value="2" size="xlarge"></p-overlaybadge>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-overlaybadge value="2"></p-overlaybadge>\n`);
    });

    it('removes the deprecated transitionOptions from p-fieldset while keeping motionOptions', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-fieldset legend="Header" [toggleable]="true" transitionOptions="200ms ease-in" [motionOptions]="motion"></p-fieldset>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-fieldset legend="Header" [toggleable]="true" [motionOptions]="motion"></p-fieldset>\n`);
    });

    it('removes a bound [transitionOptions] from p-fieldset', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-fieldset [transitionOptions]="transition" [(collapsed)]="collapsed"></p-fieldset>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-fieldset [(collapsed)]="collapsed"></p-fieldset>\n`);
    });

    it('removes the deprecated transitionOptions from p-panel while keeping motionOptions', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-panel header="Header" [toggleable]="true" transitionOptions="200ms ease-in" [motionOptions]="motion"></p-panel>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-panel header="Header" [toggleable]="true" [motionOptions]="motion"></p-panel>\n`);
    });

    it('removes a bound [transitionOptions] from p-panel', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-panel [transitionOptions]="transition" [(collapsed)]="collapsed"></p-panel>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-panel [(collapsed)]="collapsed"></p-panel>\n`);
    });

    it('does not remove transitionOptions from p-stepper', async () => {
        const runner = createMigrationRunner();
        const content = `<p-stepper transitionOptions="200ms ease-in"></p-stepper>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('removes the deprecated transitionOptions from p-accordion while keeping motionOptions', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-accordion value="0" transitionOptions="200ms ease-in" [motionOptions]="motion"></p-accordion>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-accordion value="0" [motionOptions]="motion"></p-accordion>\n`);
    });

    it('removes a bound [transitionOptions] from p-accordion', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-accordion [transitionOptions]="transition" [(value)]="active" [multiple]="true"></p-accordion>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-accordion [(value)]="active" [multiple]="true"></p-accordion>\n`);
    });

    it('removes inputId from p-togglebutton and its aliases', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-togglebutton [(ngModel)]="checked" inputId="tb1" onLabel="Yes"></p-togglebutton>\n<p-toggleButton [inputId]="id" [onLabel]="on"></p-toggleButton>\n<p-toggle-button inputId="tb3"></p-toggle-button>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-togglebutton [(ngModel)]="checked" onLabel="Yes"></p-togglebutton>\n<p-toggleButton [onLabel]="on"></p-toggleButton>\n<p-toggle-button></p-toggle-button>\n`);
    });

    it('keeps inputId on form components that still read it', async () => {
        const runner = createMigrationRunner();
        const content = `<p-toggleswitch inputId="ts1"></p-toggleswitch>\n<p-checkbox [inputId]="id"></p-checkbox>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('removes the deprecated showTransitionOptions/hideTransitionOptions and ariaCloseLabel from p-popover while keeping motionOptions', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-popover #op showTransitionOptions=".12s ease" [hideTransitionOptions]="hideTf" ariaCloseLabel="Close" [motionOptions]="motion" [dismissable]="false"></p-popover>\n<p-popover [ariaCloseLabel]="closeLabel" [appendTo]="'body'"></p-popover>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransitionOptions');
        expect(html).not.toContain('ariaCloseLabel');
        expect(html).toBe(`<p-popover #op [motionOptions]="motion" [dismissable]="false"></p-popover>\n<p-popover [appendTo]="'body'"></p-popover>\n`);
    });

    it('removes the deprecated showTransitionOptions/hideTransitionOptions and modalEnterAnimation/modalLeaveAnimation from p-image while keeping motionOptions', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-image src="image.jpg" [preview]="true" showTransitionOptions=".12s ease" [hideTransitionOptions]="hideTf" modalEnterAnimation="my-enter" [modalLeaveAnimation]="leave" [motionOptions]="motion"></p-image>\n<p-image [src]="src" [modalEnterAnimation]="enter" [imageClass]="cls"></p-image>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransitionOptions');
        expect(html).not.toContain('Animation');
        expect(html).toBe(`<p-image src="image.jpg" [preview]="true" [motionOptions]="motion"></p-image>\n<p-image [src]="src" [imageClass]="cls"></p-image>\n`);
    });

    it('removes the deprecated showTransitionOptions/hideTransitionOptions from p-menu while keeping motionOptions and styleClass', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-menu #menu [model]="items" [popup]="true" showTransitionOptions=".12s ease" [hideTransitionOptions]="hideTf" [motionOptions]="motion" styleClass="w-full"></p-menu>\n<p-menu [model]="items" [showTransitionOptions]="showTf" [appendTo]="'body'"></p-menu>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransitionOptions');
        expect(html).toBe(`<p-menu #menu [model]="items" [popup]="true" [motionOptions]="motion" styleClass="w-full"></p-menu>\n<p-menu [model]="items" [appendTo]="'body'"></p-menu>\n`);
    });

    it('removes the deprecated badgeClass from p-button while keeping badge and badgeSeverity', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-button label="Emails" badge="2" badgeClass="p-badge-danger"></p-button>\n<p-button [label]="label" [badge]="count" [badgeClass]="badgeClass" badgeSeverity="contrast"></p-button>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('badgeClass');
        expect(html).toBe(`<p-button label="Emails" badge="2"></p-button>\n<p-button [label]="label" [badge]="count" badgeSeverity="contrast"></p-button>\n`);
    });

    it('removes autoZIndex/baseZIndex/popup from p-contextmenu-sub and p-contextMenuSub while keeping them on p-contextmenu', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-contextmenu-sub [items]="items" [autoZIndex]="false" baseZIndex="100" [popup]="true" [root]="true"></p-contextmenu-sub>\n<p-contextMenuSub [items]="items" autoZIndex="false" [baseZIndex]="zIndex" popup="true"></p-contextMenuSub>\n<p-contextmenu [model]="items" [autoZIndex]="false" [baseZIndex]="100"></p-contextmenu>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).toBe(`<p-contextmenu-sub [items]="items" [root]="true"></p-contextmenu-sub>\n<p-contextMenuSub [items]="items"></p-contextMenuSub>\n<p-contextmenu [model]="items" [autoZIndex]="false" [baseZIndex]="100"></p-contextmenu>\n`);
    });

    it('removes the deprecated transitionOptions and the dead tabindex from p-panelmenu while keeping motionOptions', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-panelmenu [model]="items" transitionOptions="400ms ease" [tabindex]="0" [motionOptions]="motion"></p-panelmenu>\n<p-panelMenu [model]="items" [transitionOptions]="transition" tabindex="1"></p-panelMenu>\n<p-panel-menu [model]="items" [multiple]="true" tabindex="2"></p-panel-menu>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).toBe(`<p-panelmenu [model]="items" [motionOptions]="motion"></p-panelmenu>\n<p-panelMenu [model]="items"></p-panelMenu>\n<p-panel-menu [model]="items" [multiple]="true"></p-panel-menu>\n`);
    });

    it('keeps tabindex on other components and does not report a programmatic tabindex access as a leftover', async () => {
        const runner = createMigrationRunner();
        const html = `<p-menu [model]="items" [tabindex]="0"></p-menu>\n<div tabindex="-1"></div>\n`;
        const ts = `export class Foo {\n    focusable(menu: { tabindex: number }) {\n        return menu.tabindex >= 0;\n    }\n}\n`;
        const tree = createAppTree({ '/src/app/app.html': html, '/src/app/foo.ts': ts });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(html);
        expect(result.readContent('/src/app/foo.ts')).toBe(ts);
        expect(warnings.join('\n')).not.toContain('tabindex');
    });

    it('removes disabled/queryMatches from p-megamenu-sub and p-megaMenuSub while keeping them on p-megamenu', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-megamenu-sub [items]="items" [disabled]="true" queryMatches="true" [root]="true"></p-megamenu-sub>\n<p-megaMenuSub [items]="items" disabled [queryMatches]="matches"></p-megaMenuSub>\n<p-megamenu [model]="items" [disabled]="true"></p-megamenu>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).toBe(`<p-megamenu-sub [items]="items" [root]="true"></p-megamenu-sub>\n<p-megaMenuSub [items]="items"></p-megaMenuSub>\n<p-megamenu [model]="items" [disabled]="true"></p-megamenu>\n`);
    });

    it('does not report a programmatic disabled or queryMatches access as a leftover', async () => {
        const runner = createMigrationRunner();
        const content = `export class Foo {\n    check(menu: { disabled: boolean; queryMatches: () => boolean }) {\n        return menu.disabled || menu.queryMatches();\n    }\n}\n`;
        const tree = createAppTree({ '/src/app/foo.ts': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/foo.ts')).toBe(content);
    });

    it('does not report a programmatic autoZIndex or popup access as a leftover', async () => {
        const runner = createMigrationRunner();
        const content = `export class Foo {\n    layer(menu: { autoZIndex: boolean; popup: boolean }) {\n        return menu.autoZIndex && menu.popup;\n    }\n}\n`;
        const tree = createAppTree({ '/src/app/foo.ts': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/foo.ts')).toBe(content);
    });

    it('removes the deprecated showTransitionOptions/hideTransitionOptions from every p-tieredmenu selector while keeping motionOptions and styleClass', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-tieredmenu #menu [model]="items" [popup]="true" showTransitionOptions=".12s ease" [hideTransitionOptions]="hideTf" [motionOptions]="motion" styleClass="w-full"></p-tieredmenu>\n<p-tieredMenu [model]="items" [showTransitionOptions]="showTf" [appendTo]="'body'"></p-tieredMenu>\n<p-tiered-menu [model]="items" hideTransitionOptions=".1s linear" [breakpoint]="'768px'"></p-tiered-menu>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('TransitionOptions');
        expect(html).toBe(
            `<p-tieredmenu #menu [model]="items" [popup]="true" [motionOptions]="motion" styleClass="w-full"></p-tieredmenu>\n<p-tieredMenu [model]="items" [appendTo]="'body'"></p-tieredMenu>\n<p-tiered-menu [model]="items" [breakpoint]="'768px'"></p-tiered-menu>\n`
        );
    });

    it('removes the never-read autoZIndex/baseZIndex from p-menubar and the never-read inputs of p-menubarSub while keeping the live ones', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-menubar [model]="items" [autoZIndex]="false" baseZIndex="100" [autoDisplay]="false" ariaLabel="Main"></p-menubar>\n<p-menubarSub [items]="items" [autoZIndex]="true" [baseZIndex]="10" [mobileActive]="mobile" ariaLabel="Menu" [ariaLabelledBy]="labelId" [level]="1"></p-menubarSub>\n<p-menubarsub [items]="items" mobileActive [autoDisplay]="true"></p-menubarsub>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('ZIndex');
        expect(html).not.toContain('mobileActive');
        expect(html).toBe(`<p-menubar [model]="items" [autoDisplay]="false" ariaLabel="Main"></p-menubar>\n<p-menubarSub [items]="items" [level]="1"></p-menubarSub>\n<p-menubarsub [items]="items" [autoDisplay]="true"></p-menubarsub>\n`);
    });

    it('removes the never-read inputLabel/emptyMessage from every p-cascadeselect selector while keeping the live inputs', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-cascadeselect [(ngModel)]="city" [options]="countries" inputLabel="City" emptyMessage="Nothing" ariaLabel="City"></p-cascadeselect>\n<p-cascadeSelect [options]="countries" [inputLabel]="label" placeholder="Pick"></p-cascadeSelect>\n<p-cascade-select [options]="countries" [emptyMessage]="empty" [showClear]="true"></p-cascade-select>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('inputLabel');
        expect(html).not.toContain('emptyMessage');
        expect(html).toBe(
            `<p-cascadeselect [(ngModel)]="city" [options]="countries" ariaLabel="City"></p-cascadeselect>\n<p-cascadeSelect [options]="countries" placeholder="Pick"></p-cascadeSelect>\n<p-cascade-select [options]="countries" [showClear]="true"></p-cascade-select>\n`
        );
    });

    it('keeps emptyMessage on components that still read it and does not report its programmatic access', async () => {
        const runner = createMigrationRunner();
        const html = `<p-select [options]="items" emptyMessage="Nothing"></p-select>\n<p-listbox [options]="items" [emptyMessage]="empty"></p-listbox>\n`;
        const ts = `export class Foo {\n    empty(table: { emptyMessage: string }) {\n        return table.emptyMessage;\n    }\n}\n`;
        const tree = createAppTree({ '/src/app/app.html': html, '/src/app/foo.ts': ts });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });

        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(html);
        expect(result.readContent('/src/app/foo.ts')).toBe(ts);
        expect(warnings).toEqual([]);
    });

    it('keeps autoZIndex/baseZIndex and ariaLabel on components that still read them', async () => {
        const runner = createMigrationRunner();
        const content = `<p-menu [model]="items" [autoZIndex]="false" baseZIndex="100" ariaLabel="Menu"></p-menu>\n<p-menu [model]="items" [popup]="true" [ariaLabelledBy]="labelId"></p-menu>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('does not report a programmatic autoZIndex or ariaLabel access as a leftover', async () => {
        const runner = createMigrationRunner();
        const content = `export class Foo {\n    layer(menu: { autoZIndex: boolean; ariaLabel: string }) {\n        return menu.autoZIndex ? menu.ariaLabel : '';\n    }\n}\n`;
        const tree = createAppTree({ '/src/app/foo.ts': content });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });

        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/foo.ts')).toBe(content);
        expect(warnings).toEqual([]);
    });

    it('keeps ariaCloseLabel on components that still read it', async () => {
        const runner = createMigrationRunner();
        const content = `<p-drawer ariaCloseLabel="Close drawer"></p-drawer>\n<p-dialog [ariaCloseLabel]="closeLabel"></p-dialog>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('does not report a programmatic ariaCloseLabel access as a leftover', async () => {
        const runner = createMigrationRunner();
        const content = `export class Foo {\n    label(dialog: { ariaCloseLabel: string }) {\n        return dialog.ariaCloseLabel;\n    }\n}\n`;
        const tree = createAppTree({ '/src/app/foo.ts': content });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });

        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/foo.ts')).toBe(content);
        expect(warnings).toEqual([]);
    });

    it('does not report a programmatic transitionOptions access as a leftover', async () => {
        const runner = createMigrationRunner();
        const content = `export class Foo {\n    read(panel: { transitionOptions: string }) {\n        return panel.transitionOptions;\n    }\n}\n`;
        const tree = createAppTree({ '/src/app/foo.ts': content });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });

        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/foo.ts')).toBe(content);
        expect(warnings).toEqual([]);
    });

    it('does not report a programmatic inputId access as a leftover', async () => {
        const runner = createMigrationRunner();
        const content = `export class Foo {\n    label(control: { inputId: string }) {\n        return control.inputId;\n    }\n}\n`;
        const tree = createAppTree({ '/src/app/foo.ts': content });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });

        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/foo.ts')).toBe(content);
        expect(warnings).toEqual([]);
    });

    it('does not report a programmatic plain access as a leftover', async () => {
        const runner = createMigrationRunner();
        const content = `export class Foo {\n    isPlain(button: { plain: boolean }) {\n        return button.plain;\n    }\n}\n`;
        const tree = createAppTree({ '/src/app/foo.ts': content });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });

        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/foo.ts')).toBe(content);
        expect(warnings).toEqual([]);
    });

    it('does not report a programmatic size access as a leftover', async () => {
        const runner = createMigrationRunner();
        const content = `export class Foo {\n    count() {\n        return new Map().size;\n    }\n}\n`;
        const tree = createAppTree({ '/src/app/foo.ts': content });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });

        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/foo.ts')).toBe(content);
        expect(warnings).toEqual([]);
    });

    it('does not remove a similarly-named attribute on an unrelated selector', async () => {
        const runner = createMigrationRunner();
        const content = `<p-other showTransformOptions="x"></p-other>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('does not remove a bare attribute name that only shares a suffix (data-showTransformOptions)', async () => {
        const runner = createMigrationRunner();
        const content = `<p-toast data-showTransformOptions="x" [life]="3000"></p-toast>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('does not corrupt a dead input name that only appears as text inside a different attribute value', async () => {
        const runner = createMigrationRunner();
        const content = `<p-toast [tooltip]="'toggle the showTransformOptions flag'" [life]="3000"></p-toast>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(content);
    });

    it('removes an unquoted bare-value attribute (showTransformOptions=translateY)', async () => {
        const runner = createMigrationRunner();
        const content = `<p-toast showTransformOptions=translateY [life]="3000"></p-toast>\n`;
        const tree = createAppTree({ '/src/app/app.html': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(`<p-toast [life]="3000"></p-toast>\n`);
    });

    it('removes the bindings inside an inline component template', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/card.component.ts':
                `import { Component } from '@angular/core';\n` +
                '@Component({\n' +
                "    selector: 'app-card',\n" +
                '    template: `<p-toast showTransformOptions="translateY(100%)" [life]="3000"></p-toast>`\n' +
                '})\n' +
                `export class CardComponent {}\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const ts = result.readContent('/src/app/card.component.ts');
        expect(ts).not.toContain('showTransformOptions');
        expect(ts).toContain('<p-toast [life]="3000"></p-toast>');
    });

    it('reports a leftover for a programmatic property access, without modifying the file', async () => {
        const runner = createMigrationRunner();
        const content =
            `import { Component, ViewChild } from '@angular/core';\n` +
            `import { Toast } from '@exhaustive-ui/core/toast';\n\n` +
            `@Component({ selector: 'app-x', template: '' })\n` +
            `export class XComponent {\n` +
            `    @ViewChild(Toast) toast!: Toast;\n\n` +
            `    ngAfterViewInit() {\n` +
            `        console.log(this.toast.showTransformOptions);\n` +
            `    }\n` +
            `}\n`;
        const tree = createAppTree({ '/src/app/x.component.ts': content });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });

        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/x.component.ts')).toBe(content);
        const combined = warnings.join('\n');
        expect(combined).toContain('showTransformOptions');
        expect(combined).toContain('/src/app/x.component.ts:9');
    });

    it('does not rewrite non-template string literals in TypeScript', async () => {
        const runner = createMigrationRunner();
        const content = `export const label = '<p-toast showTransformOptions="x"></p-toast>';\n`;
        const tree = createAppTree({ '/src/app/config.ts': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/config.ts')).toBe(content);
    });

    it('removes a dead input inside a double-quoted inline template whose HTML attributes need escaped quotes', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/card.component.ts':
                `import { Component } from '@angular/core';\n` +
                '@Component({\n' +
                "    selector: 'app-card',\n" +
                '    template: "<p-toast showTransformOptions=\\"translateY(100%)\\" [life]=\\"3000\\"></p-toast>"\n' +
                '})\n' +
                `export class CardComponent {}\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const ts = result.readContent('/src/app/card.component.ts');
        expect(ts).not.toContain('showTransformOptions');
        expect(ts).toContain('template: "<p-toast [life]=\\"3000\\"></p-toast>"');
    });

    it('does not rewrite a `template` property nested inside providers metadata', async () => {
        const runner = createMigrationRunner();
        const content =
            `import { Component } from '@angular/core';\n` +
            '@Component({\n' +
            "    selector: 'app-card',\n" +
            '    template: \'<p-toast [life]="3000"></p-toast>\',\n' +
            "    providers: [{ provide: 'TPL', useValue: { template: '<p-toast showTransformOptions=\"x\"></p-toast>' } }]\n" +
            '})\n' +
            `export class CardComponent {}\n`;
        const tree = createAppTree({ '/src/app/card.component.ts': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/card.component.ts')).toBe(content);
    });

    it('does not rewrite a `template` property belonging to a non-Component decorator', async () => {
        const runner = createMigrationRunner();
        const content = `function CustomDecorator(config: { template: string }) {\n` + '    return () => {};\n' + '}\n\n' + '@CustomDecorator({ template: \'<p-toast showTransformOptions="x"></p-toast>\' })\n' + `export class NotAComponent {}\n`;
        const tree = createAppTree({ '/src/app/not-a-component.ts': content });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/not-a-component.ts')).toBe(content);
    });

    it('does not touch node_modules or dist', async () => {
        const runner = createMigrationRunner();
        const content = `<p-toast showTransformOptions="x"></p-toast>\n`;
        const tree = createAppTree({
            '/node_modules/pkg/tpl.html': content,
            '/dist/app/tpl.html': content
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/node_modules/pkg/tpl.html')).toBe(content);
        expect(result.readContent('/dist/app/tpl.html')).toBe(content);
    });

    it('reports nothing on a workspace with no usage of the removed inputs', async () => {
        const runner = createMigrationRunner();
        const infos: string[] = [];
        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'info') {
                infos.push(entry.message);
            } else if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });
        await runner.runSchematic('remove-dead-inputs', {}, createAppTree());
        expect(infos.join('\n')).toContain('No bindings for the removed inputs were found to remove.');
        expect(warnings.join('\n')).toBe('');
    });

    it('removes the deprecated showTransitionOptions/hideTransitionOptions and the dead containerClass from p-galleria while keeping its live inputs', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-galleria [value]="images" showTransitionOptions=".12s ease" [hideTransitionOptions]="hideTf" containerClass="gallery" [containerStyle]="{ width: '640px' }" [maskClass]="mask" [motionOptions]="motion"></p-galleria>\n<p-galleria [value]="images" [containerClass]="cls" [(visible)]="visible" [fullScreen]="true"></p-galleria>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/app.html')).toBe(
            `<p-galleria [value]="images" [containerStyle]="{ width: '640px' }" [maskClass]="mask" [motionOptions]="motion"></p-galleria>\n<p-galleria [value]="images" [(visible)]="visible" [fullScreen]="true"></p-galleria>\n`
        );
    });

    it('reports a programmatic containerClass access on a galleria as a leftover', async () => {
        const runner = createMigrationRunner();
        const content = `export class Foo {\n    read(galleria: { containerClass: string }) {\n        return galleria.containerClass;\n    }\n}\n`;
        const tree = createAppTree({ '/src/app/foo.ts': content });

        const warnings: string[] = [];
        runner.logger.subscribe((entry) => {
            if (entry.level === 'warn') {
                warnings.push(entry.message);
            }
        });

        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        expect(result.readContent('/src/app/foo.ts')).toBe(content);
        expect(warnings.join('\n')).toContain('/src/app/foo.ts:3');
    });

    it('removes removeStyleClass from p-fileupload and p-fileUpload while keeping the other style classes', async () => {
        const runner = createMigrationRunner();
        const tree = createAppTree({
            '/src/app/app.html': `<p-fileupload name="demo[]" removeStyleClass="p-button-danger" chooseStyleClass="choose"></p-fileupload>\n<p-fileUpload [removeStyleClass]="removeClass" [uploadStyleClass]="uploadClass" styleClass="w-full"></p-fileUpload>\n`
        });
        const result = await runner.runSchematic('remove-dead-inputs', {}, tree);
        const html = result.readContent('/src/app/app.html');
        expect(html).not.toContain('removeStyleClass');
        expect(html).toBe(`<p-fileupload name="demo[]" chooseStyleClass="choose"></p-fileupload>\n<p-fileUpload [uploadStyleClass]="uploadClass" styleClass="w-full"></p-fileUpload>\n`);
    });
});
