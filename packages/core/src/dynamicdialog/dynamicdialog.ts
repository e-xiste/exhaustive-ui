import { CommonModule } from '@angular/common';
import { afterEveryRender, afterNextRender, ChangeDetectionStrategy, Component, ComponentRef, inject, InjectionToken, NgModule, signal, Type, ViewEncapsulation, viewChild } from '@angular/core';
import { uuid } from '@exhaustive-ui/utils';
import { SharedModule, TranslationKeys } from '@exhaustive-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@exhaustive-ui/core/basecomponent';
import { Bind, BindModule } from '@exhaustive-ui/core/bind';
import { Dialog, DialogPassThrough } from '@exhaustive-ui/core/dialog';
import { Nullable } from '@exhaustive-ui/core/ts-helpers';
import { DynamicDialogConfig } from './dynamicdialog-config';
import { DynamicDialogRef } from './dynamicdialog-ref';
import { DynamicDialogContent } from './dynamicdialogcontent';
import { DynamicDialogStyle } from './style/dynamicdialogstyle';

const DYNAMIC_DIALOG_INSTANCE = new InjectionToken<DynamicDialog>('DYNAMIC_DIALOG_INSTANCE');

@Component({
    selector: 'p-dynamicDialog, p-dynamicdialog, p-dynamic-dialog',
    imports: [CommonModule, SharedModule, DynamicDialogContent, Dialog, BindModule],
    template: `
        <p-dialog
            [(visible)]="visible"
            [header]="ddconfig?.header"
            [draggable]="ddconfig?.draggable !== false"
            [resizable]="ddconfig?.resizable !== false"
            [contentStyle]="ddconfig?.contentStyle"
            [modal]="ddconfig?.modal !== false"
            [closeOnEscape]="ddconfig?.closeOnEscape !== false"
            [dismissableMask]="ddconfig?.dismissableMask"
            [closable]="closable"
            [breakpoints]="breakpoints"
            [styleClass]="ddconfig?.styleClass"
            [maskStyleClass]="ddconfig?.maskStyleClass"
            [showHeader]="ddconfig?.showHeader !== false"
            [autoZIndex]="ddconfig?.autoZIndex !== false"
            [baseZIndex]="ddconfig?.baseZIndex || 0"
            [minX]="minX"
            [minY]="minY"
            [focusOnShow]="ddconfig?.focusOnShow !== false"
            [maximizable]="maximizable"
            [keepInViewport]="keepInViewport"
            [focusTrap]="ddconfig?.focusTrap !== false"
            [closeAriaLabel]="ddconfig?.closeAriaLabel || defaultCloseAriaLabel"
            [ariaLabelledBy]="ddconfig?.ariaLabelledBy"
            [minimizeIcon]="minimizeIcon"
            [maximizeIcon]="maximizeIcon"
            [closeButtonProps]="{ severity: 'secondary', variant: 'text', rounded: true }"
            [maximizeButtonProps]="{ severity: 'secondary', variant: 'text', rounded: true }"
            [style]="dialogStyle"
            [position]="position"
            (onHide)="onDialogHide($event)"
            (onMaximize)="onDialogMaximize($event)"
            (onResizeInit)="onDialogResizeInit($event)"
            (onResizeEnd)="onDialogResizeEnd($event)"
            (onDragEnd)="onDialogDragEnd($event)"
            (visibleChange)="onVisibleChange($event)"
            [pt]="ddconfig.pt"
            appendTo="self"
            hostName="DynamicDialog"
            [unstyled]="isUnstyled"
        >
            @if (headerTemplate) {
                <ng-template #header>
                    <ng-container *ngComponentOutlet="headerTemplate"></ng-container>
                </ng-template>
            }
            @if (contentTemplate) {
                <ng-template #content>
                    <ng-container *ngComponentOutlet="contentTemplate"></ng-container>
                </ng-template>
            }
            @if (footerTemplate) {
                <ng-template #footer>
                    <ng-container *ngComponentOutlet="footerTemplate"></ng-container>
                </ng-template>
            }
            @if (closeIconTemplate) {
                <ng-template #closeicon>
                    <ng-container *ngComponentOutlet="closeIconTemplate"></ng-container>
                </ng-template>
            }
            @if (maximizeIconTemplate) {
                <ng-template #maximizeicon>
                    <ng-container *ngComponentOutlet="maximizeIconTemplate"></ng-container>
                </ng-template>
            }
            @if (minimizeIconTemplate) {
                <ng-template #minimizeicon>
                    <ng-container *ngComponentOutlet="minimizeIconTemplate"></ng-container>
                </ng-template>
            }

            @if (!contentTemplate) {
                <ng-template pDynamicDialogContent></ng-template>
            }
            @if (ddconfig.footer && !footerTemplate) {
                <div>{{ ddconfig.footer }}</div>
            }
        </p-dialog>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    encapsulation: ViewEncapsulation.None,
    providers: [DynamicDialogStyle, { provide: DYNAMIC_DIALOG_INSTANCE, useExisting: DynamicDialog }, { provide: PARENT_INSTANCE, useExisting: DynamicDialog }],
    hostDirectives: [Bind]
})
export class DynamicDialog extends BaseComponent<DialogPassThrough> {
    ddconfig = inject(DynamicDialogConfig);
    private dialogRef = inject(DynamicDialogRef);

    componentName = 'Dialog';

    _componentStyle = inject(DynamicDialogStyle);

    $pcDynamicDialog: DynamicDialog | undefined = inject(DYNAMIC_DIALOG_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    constructor() {
        super();
        afterEveryRender(() => this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root'])));
        afterNextRender(() => {
            this.loadChildComponent(this.childComponentType()!);
            this.cd.detectChanges();
        });
    }

    visible = signal<boolean>(true);

    componentRef = signal<Nullable<ComponentRef<any>>>(undefined);

    id: string = uuid('pn_id_');

    readonly insertionPoint = viewChild(DynamicDialogContent);

    childComponentType = signal<Nullable<Type<any>>>(undefined);

    inputValues = signal<Record<string, any> | undefined>(undefined);

    get minX(): number {
        return this.ddconfig.minX ? this.ddconfig.minX : 0;
    }

    get minY(): number {
        return this.ddconfig.minY ? this.ddconfig.minY : 0;
    }

    get keepInViewport(): boolean {
        return this.ddconfig.keepInViewport!;
    }

    get maximizable(): boolean {
        return this.ddconfig.maximizable!;
    }

    get maximizeIcon(): string {
        return this.ddconfig.maximizeIcon!;
    }

    get minimizeIcon(): string {
        return this.ddconfig.minimizeIcon!;
    }

    get closable() {
        return this.ddconfig.closable!;
    }

    get position(): string {
        return this.ddconfig.position!;
    }

    get defaultCloseAriaLabel(): string {
        return this.config.getTranslation(TranslationKeys.ARIA)['close'];
    }

    get breakpoints() {
        return this.ddconfig.breakpoints;
    }

    get footerTemplate() {
        return this.ddconfig?.templates?.footer;
    }

    get headerTemplate() {
        return this.ddconfig?.templates?.header;
    }

    get contentTemplate() {
        return this.ddconfig?.templates?.content;
    }

    get minimizeIconTemplate(): any {
        return this.ddconfig?.templates?.minimizeicon;
    }

    get maximizeIconTemplate(): any {
        return this.ddconfig?.templates?.maximizeicon;
    }

    get closeIconTemplate() {
        return this.ddconfig?.templates?.closeicon;
    }

    get dialogStyle() {
        return {
            ...(this.ddconfig?.style || {}),
            ...(this.ddconfig?.width && { width: this.ddconfig.width }),
            ...(this.ddconfig?.height && { height: this.ddconfig.height })
        };
    }

    get header() {
        return this.ddconfig.header;
    }

    get data() {
        return this.ddconfig.data;
    }

    get dialogId() {
        return this.$attrSelector;
    }

    get isUnstyled() {
        return this.ddconfig.unstyled || this.$unstyled();
    }

    maximized = signal<boolean | undefined>(undefined);

    resizing = signal<boolean | undefined>(undefined);

    onVisibleChange(visible: boolean) {
        if (!visible) {
            this.dialogRef.close();
        }
    }

    loadChildComponent(componentType: Type<any>) {
        let viewContainerRef = this.insertionPoint()?.viewContainerRef;
        // a custom content template replaces the child component: there is no insertion point to load it into
        if (!viewContainerRef) {
            return;
        }

        viewContainerRef.clear();

        const componentRef = viewContainerRef.createComponent(componentType);
        this.componentRef.set(componentRef);

        const inputValues = this.inputValues();
        if (inputValues) {
            Object.entries(inputValues).forEach(([key, value]) => {
                componentRef.setInput(key, value);
            });
        }

        this.dialogRef.onChildComponentLoaded.next(componentRef.instance);
    }

    onDialogHide(event: any) {
        this.dialogRef.destroy();
    }

    onDialogMaximize(event: any) {
        this.maximized.set(event.maximized);
        this.dialogRef.maximize(event);
    }

    onDialogResizeInit(event: MouseEvent) {
        this.resizing.set(true);
        this.dialogRef.resizeInit(event);
    }

    onDialogResizeEnd(event: MouseEvent) {
        this.resizing.set(false);
        this.dialogRef.resizeEnd(event);
    }

    onDialogDragEnd(event: DragEvent) {
        this.dialogRef.dragEnd(event);
    }

    close() {
        this.visible.set(false);
    }

    hide() {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    onDestroy() {
        const componentRef = this.componentRef();
        if (componentRef && typeof componentRef.destroy === 'function') {
            componentRef.destroy();
        }
    }
}

@NgModule({
    imports: [DynamicDialog, SharedModule],
    exports: [DynamicDialog, SharedModule]
})
export class DynamicDialogModule {}
