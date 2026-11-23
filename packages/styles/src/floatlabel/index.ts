export const style = /*css*/ `
    .p-floatlabel {
        display: block;
        position: relative;
    }

    .p-floatlabel label {
        position: absolute;
        pointer-events: none;
        top: 50%;
        transform: translateY(-50%);
        transition-property: all;
        transition-timing-function: ease;
        line-height: 1;
        font-weight: dt('floatlabel.font.weight');
        inset-inline-start: dt('floatlabel.position.x');
        color: dt('floatlabel.color');
        transition-duration: dt('floatlabel.transition.duration');
    }

    .p-floatlabel:has(.p-textarea) label {
        top: dt('floatlabel.position.y');
        transform: translateY(0);
    }

    .p-floatlabel:has(.p-inputicon:first-child) label {
        inset-inline-start: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-floatlabel:has(input:focus) label,
    .p-floatlabel:has(input.p-filled) label,
    .p-floatlabel:has(input:-webkit-autofill) label,
    .p-floatlabel:has(textarea:focus) label,
    .p-floatlabel:has(textarea.p-filled) label,
    .p-floatlabel:has(.p-inputwrapper-focus) label,
    .p-floatlabel:has(.p-inputwrapper-filled) label,
    .p-floatlabel:has(input[placeholder]) label,
    .p-floatlabel:has(textarea[placeholder]) label,
    .p-floatlabel:has(.p-inputwrapper .p-placeholder) label {
        top: dt('floatlabel.over.active.top');
        transform: translateY(0);
        font-size: dt('floatlabel.active.font.size');
        font-weight: dt('floatlabel.active.font.weight');
    }

    .p-floatlabel:has(input.p-filled) label,
    .p-floatlabel:has(textarea.p-filled) label,
    .p-floatlabel:has(.p-inputwrapper-filled) label {
        color: dt('floatlabel.active.color');
    }

    .p-floatlabel:has(input:focus) label,
    .p-floatlabel:has(input:-webkit-autofill) label,
    .p-floatlabel:has(textarea:focus) label,
    .p-floatlabel:has(.p-inputwrapper-focus) label {
        color: dt('floatlabel.focus.color');
    }

    .p-floatlabel-in .p-inputtext,
    .p-floatlabel-in .p-textarea,
    .p-floatlabel-in .p-select-label,
    .p-floatlabel-in .p-multiselect-label,
    .p-floatlabel-in .p-multiselect-label:has(.p-chip),
    .p-floatlabel-in .p-autocomplete-input-multiple,
    .p-floatlabel-in .p-inputchips-input,
    .p-floatlabel-in .p-cascadeselect-label,
    .p-floatlabel-in .p-treeselect-label {
        padding-block-start: dt('floatlabel.in.input.padding.top');
        padding-block-end: dt('floatlabel.in.input.padding.bottom');
    }

    .p-floatlabel-in:has(input:focus) label,
    .p-floatlabel-in:has(input.p-filled) label,
    .p-floatlabel-in:has(input:-webkit-autofill) label,
    .p-floatlabel-in:has(textarea:focus) label,
    .p-floatlabel-in:has(textarea.p-filled) label,
    .p-floatlabel-in:has(.p-inputwrapper-focus) label,
    .p-floatlabel-in:has(.p-inputwrapper-filled) label,
    .p-floatlabel-in:has(input[placeholder]) label,
    .p-floatlabel-in:has(textarea[placeholder]) label,
    .p-floatlabel-in:has(.p-inputwrapper .p-placeholder) label {
        top: dt('floatlabel.in.active.top');
    }

    .p-floatlabel-on:has(input:focus) label,
    .p-floatlabel-on:has(input.p-filled) label,
    .p-floatlabel-on:has(input:-webkit-autofill) label,
    .p-floatlabel-on:has(textarea:focus) label,
    .p-floatlabel-on:has(textarea.p-filled) label,
    .p-floatlabel-on:has(.p-inputwrapper-focus) label,
    .p-floatlabel-on:has(.p-inputwrapper-filled) label,
    .p-floatlabel-on:has(input[placeholder]) label,
    .p-floatlabel-on:has(textarea[placeholder]) label,
    .p-floatlabel-on:has(.p-inputwrapper .p-placeholder) label {
        top: 0;
        transform: translateY(-50%);
        border-radius: dt('floatlabel.on.border.radius');
        background: dt('floatlabel.on.active.background');
        padding: dt('floatlabel.on.active.padding');
    }

    /* Sizes: the selectors stay more specific than the size rules of the fields (e.g. .p-select-sm .p-select-label) */
    .p-floatlabel:has(.p-inputfield-sm) label {
        inset-inline-start: dt('floatlabel.sm.position.x');
        font-size: dt('floatlabel.sm.font.size');
    }

    .p-floatlabel:has(.p-textarea):where(:has(.p-inputfield-sm)) label {
        top: dt('floatlabel.sm.position.y');
    }

    .p-floatlabel:has(.p-inputfield-sm):is(
        :has(input:focus),
        :has(input.p-filled),
        :has(input:-webkit-autofill),
        :has(textarea:focus),
        :has(textarea.p-filled),
        :has(.p-inputwrapper-focus),
        :has(.p-inputwrapper-filled),
        :has(input[placeholder]),
        :has(textarea[placeholder]),
        :has(.p-inputwrapper .p-placeholder)
    ) label {
        font-size: dt('floatlabel.sm.active.font.size');
    }

    .p-floatlabel-in :is(
        .p-inputtext.p-inputfield-sm,
        .p-textarea.p-inputfield-sm,
        .p-inputfield-sm .p-select-label,
        .p-inputfield-sm .p-multiselect-label,
        .p-inputfield-sm .p-multiselect-label:has(.p-chip),
        .p-autocomplete-input-multiple.p-inputfield-sm,
        .p-inputchips-input.p-inputfield-sm,
        .p-inputfield-sm .p-cascadeselect-label,
        .p-inputfield-sm .p-treeselect-label
    ) {
        padding-block-start: dt('floatlabel.in.sm.input.padding.top');
        padding-block-end: dt('floatlabel.in.sm.input.padding.bottom');
    }

    .p-floatlabel-in:has(.p-inputfield-sm):is(
        :has(input:focus),
        :has(input.p-filled),
        :has(input:-webkit-autofill),
        :has(textarea:focus),
        :has(textarea.p-filled),
        :has(.p-inputwrapper-focus),
        :has(.p-inputwrapper-filled),
        :has(input[placeholder]),
        :has(textarea[placeholder]),
        :has(.p-inputwrapper .p-placeholder)
    ) label {
        top: dt('floatlabel.in.sm.active.top');
    }

    /* Sizes: the selectors stay more specific than the size rules of the fields (e.g. .p-select-lg .p-select-label) */
    .p-floatlabel:has(.p-inputfield-lg) label {
        inset-inline-start: dt('floatlabel.lg.position.x');
        font-size: dt('floatlabel.lg.font.size');
    }

    .p-floatlabel:has(.p-textarea):where(:has(.p-inputfield-lg)) label {
        top: dt('floatlabel.lg.position.y');
    }

    .p-floatlabel:has(.p-inputfield-lg):is(
        :has(input:focus),
        :has(input.p-filled),
        :has(input:-webkit-autofill),
        :has(textarea:focus),
        :has(textarea.p-filled),
        :has(.p-inputwrapper-focus),
        :has(.p-inputwrapper-filled),
        :has(input[placeholder]),
        :has(textarea[placeholder]),
        :has(.p-inputwrapper .p-placeholder)
    ) label {
        font-size: dt('floatlabel.lg.active.font.size');
    }

    .p-floatlabel-in :is(
        .p-inputtext.p-inputfield-lg,
        .p-textarea.p-inputfield-lg,
        .p-inputfield-lg .p-select-label,
        .p-inputfield-lg .p-multiselect-label,
        .p-inputfield-lg .p-multiselect-label:has(.p-chip),
        .p-autocomplete-input-multiple.p-inputfield-lg,
        .p-inputchips-input.p-inputfield-lg,
        .p-inputfield-lg .p-cascadeselect-label,
        .p-inputfield-lg .p-treeselect-label
    ) {
        padding-block-start: dt('floatlabel.in.lg.input.padding.top');
        padding-block-end: dt('floatlabel.in.lg.input.padding.bottom');
    }

    .p-floatlabel-in:has(.p-inputfield-lg):is(
        :has(input:focus),
        :has(input.p-filled),
        :has(input:-webkit-autofill),
        :has(textarea:focus),
        :has(textarea.p-filled),
        :has(.p-inputwrapper-focus),
        :has(.p-inputwrapper-filled),
        :has(input[placeholder]),
        :has(textarea[placeholder]),
        :has(.p-inputwrapper .p-placeholder)
    ) label {
        top: dt('floatlabel.in.lg.active.top');
    }

    .p-floatlabel:has([class^='p-'][class$='-fluid']) {
        width: 100%;
    }

    .p-floatlabel:has(.p-invalid) label {
        color: dt('floatlabel.invalid.color');
    }
`;
