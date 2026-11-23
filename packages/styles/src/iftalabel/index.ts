export const style = /*css*/ `
    .p-iftalabel {
        display: block;
        position: relative;
    }

    .p-iftalabel label {
        position: absolute;
        pointer-events: none;
        top: dt('iftalabel.top');
        transition-property: all;
        transition-timing-function: ease;
        line-height: 1;
        font-size: dt('iftalabel.font.size');
        font-weight: dt('iftalabel.font.weight');
        inset-inline-start: dt('iftalabel.position.x');
        color: dt('iftalabel.color');
        transition-duration: dt('iftalabel.transition.duration');
    }

    .p-iftalabel .p-inputtext,
    .p-iftalabel .p-textarea,
    .p-iftalabel .p-select-label,
    .p-iftalabel .p-multiselect-label,
    .p-iftalabel .p-multiselect-label:has(.p-chip),
    .p-iftalabel .p-autocomplete-input-multiple,
    .p-iftalabel .p-inputchips-input,
    .p-iftalabel .p-cascadeselect-label,
    .p-iftalabel .p-treeselect-label {
        padding-block-start: dt('iftalabel.input.padding.top');
        padding-block-end: dt('iftalabel.input.padding.bottom');
    }

    .p-iftalabel:has(.p-invalid) label {
        color: dt('iftalabel.invalid.color');
    }

    .p-iftalabel:has(input:focus) label,
    .p-iftalabel:has(input:-webkit-autofill) label,
    .p-iftalabel:has(textarea:focus) label,
    .p-iftalabel:has(.p-inputwrapper-focus) label {
        color: dt('iftalabel.focus.color');
    }

    .p-iftalabel .p-inputicon {
        top: dt('iftalabel.input.padding.top');
        transform: translateY(25%);
        margin-top: 0;
    }

    /* Sizes: the selectors stay more specific than the size rules of the fields (e.g. .p-select-sm .p-select-label) */
    .p-iftalabel:has(.p-inputfield-sm) label {
        top: dt('iftalabel.sm.top');
        font-size: dt('iftalabel.sm.font.size');
        inset-inline-start: dt('iftalabel.sm.position.x');
    }

    .p-iftalabel :is(
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
        padding-block-start: dt('iftalabel.input.sm.padding.top');
        padding-block-end: dt('iftalabel.input.sm.padding.bottom');
    }

    .p-iftalabel:has(.p-inputfield-sm) .p-inputicon {
        top: dt('iftalabel.input.sm.padding.top');
    }

    /* Sizes: the selectors stay more specific than the size rules of the fields (e.g. .p-select-lg .p-select-label) */
    .p-iftalabel:has(.p-inputfield-lg) label {
        top: dt('iftalabel.lg.top');
        font-size: dt('iftalabel.lg.font.size');
        inset-inline-start: dt('iftalabel.lg.position.x');
    }

    .p-iftalabel :is(
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
        padding-block-start: dt('iftalabel.input.lg.padding.top');
        padding-block-end: dt('iftalabel.input.lg.padding.bottom');
    }

    .p-iftalabel:has(.p-inputfield-lg) .p-inputicon {
        top: dt('iftalabel.input.lg.padding.top');
    }
`;
