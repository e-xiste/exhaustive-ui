export const style = /*css*/ `
    .p-selectbutton {
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        outline-color: transparent;
        border-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton .p-togglebutton {
        border-radius: 0;
        border-width: 1px;
    }

    .p-selectbutton .p-togglebutton + .p-togglebutton {
        margin-inline-start: -1px;
    }

    .p-selectbutton .p-togglebutton-checked {
        z-index: 1;
    }

    .p-selectbutton .p-togglebutton:focus-visible {
        position: relative;
        z-index: 2;
    }

    .p-selectbutton .p-togglebutton:first-child {
        border-start-start-radius: dt('selectbutton.border.radius');
        border-end-start-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton .p-togglebutton:last-child {
        border-start-end-radius: dt('selectbutton.border.radius');
        border-end-end-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton.p-invalid {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }

    .p-selectbutton-fluid {
        width: 100%;
    }
    
    .p-selectbutton-fluid .p-togglebutton {
        flex: 1 1 0;
    }
`;
