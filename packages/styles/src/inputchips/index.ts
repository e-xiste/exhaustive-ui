export const style = /*css*/ `
    .p-inputchips {
        display: inline-flex;
        position: relative;
        max-width: 100%;
    }

    .p-inputchips-fluid {
        display: flex;
        width: 100%;
    }

    .p-inputchips-input {
        cursor: text;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        min-width: 0;
        width: 100%;
        padding: calc(dt('inputchips.padding.y') / 2) dt('inputchips.padding.x');
        gap: calc(dt('inputchips.padding.y') / 2);
        color: dt('inputchips.color');
        background: dt('inputchips.background');
        border: 1px solid dt('inputchips.border.color');
        border-radius: dt('inputchips.border.radius');
        box-shadow: dt('inputchips.shadow');
        transition:
            background dt('inputchips.transition.duration'),
            color dt('inputchips.transition.duration'),
            border-color dt('inputchips.transition.duration'),
            outline-color dt('inputchips.transition.duration'),
            box-shadow dt('inputchips.transition.duration');
        outline-color: transparent;
    }

    .p-inputchips-input:has(.p-inputchips-chip) {
        padding-inline-start: calc(dt('inputchips.padding.y') / 2);
        padding-inline-end: calc(dt('inputchips.padding.y') / 2);
    }

    .p-inputchips-input:not(.p-disabled):hover {
        border-color: dt('inputchips.hover.border.color');
    }

    .p-inputchips.p-focus .p-inputchips-input:not(.p-disabled) {
        border-color: dt('inputchips.focus.border.color');
        box-shadow: dt('inputchips.focus.ring.shadow');
        outline: dt('inputchips.focus.ring.width') dt('inputchips.focus.ring.style') dt('inputchips.focus.ring.color');
        outline-offset: dt('inputchips.focus.ring.offset');
    }

    .p-inputchips.p-invalid .p-inputchips-input {
        border-color: dt('inputchips.invalid.border.color');
    }

    .p-inputchips-input.p-variant-filled {
        background: dt('inputchips.filled.background');
    }

    .p-inputchips-input.p-variant-filled:not(.p-disabled):hover {
        background: dt('inputchips.filled.hover.background');
    }

    .p-inputchips.p-focus .p-inputchips-input.p-variant-filled:not(.p-disabled) {
        background: dt('inputchips.filled.focus.background');
    }

    .p-inputchips-input.p-disabled {
        cursor: default;
        opacity: 1;
        background: dt('inputchips.disabled.background');
        color: dt('inputchips.disabled.color');
    }

    .p-inputchips-list {
        display: contents;
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    .p-inputchips-chip-item {
        display: inline-flex;
        min-width: 0;
        max-width: 100%;
        border-radius: dt('inputchips.chip.border.radius');
        outline: 0 none;
    }

    .p-inputchips-chip.p-chip {
        min-width: 0;
        max-width: 100%;
        padding-block-start: calc(dt('inputchips.padding.y') / 2);
        padding-block-end: calc(dt('inputchips.padding.y') / 2);
        border-radius: dt('inputchips.chip.border.radius');
        cursor: default;
    }

    .p-inputchips-chip .p-inputchips-chip-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .p-inputchips-chip-item.p-focus .p-inputchips-chip {
        background: dt('inputchips.chip.focus.background');
        color: dt('inputchips.chip.focus.color');
    }

    .p-inputchips-chip-item:focus-visible .p-inputchips-chip {
        outline: dt('focus.ring.width') dt('focus.ring.style') dt('focus.ring.color');
        outline-offset: -1px;
    }

    .p-inputchips-chip-icon {
        display: inline-flex;
        flex-shrink: 0;
    }

    .p-inputchips-input-field {
        flex: 1 1 4rem;
        min-width: 4rem;
        border: 0 none;
        outline: 0 none;
        background: transparent;
        margin: 0;
        padding-block: calc(dt('inputchips.padding.y') / 2);
        padding-inline: 0;
        box-shadow: none;
        border-radius: 0;
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: inherit;
    }

    .p-inputchips-input:has(.p-inputchips-chip) .p-inputchips-input-field {
        padding-inline-start: calc(dt('inputchips.padding.x') - (dt('inputchips.padding.y') / 2));
    }

    .p-inputchips-input-field::placeholder {
        color: dt('inputchips.placeholder.color');
    }

    .p-inputchips.p-invalid .p-inputchips-input-field::placeholder {
        color: dt('inputchips.invalid.placeholder.color');
    }

    .p-inputchips-input-field:disabled {
        cursor: default;
    }

    .p-inputchips-input-sm {
        font-size: dt('form.field.sm.font.size');
        padding-block: calc(dt('form.field.sm.padding.y') / 2);
        padding-inline: dt('form.field.sm.padding.x');
    }

    .p-inputchips-input-sm .p-inputchips-input-field {
        font-size: dt('form.field.sm.font.size');
    }

    .p-inputchips-input-lg {
        font-size: dt('form.field.lg.font.size');
        padding-block: calc(dt('form.field.lg.padding.y') / 2);
        padding-inline: dt('form.field.lg.padding.x');
    }

    .p-inputchips-input-lg .p-inputchips-input-field {
        font-size: dt('form.field.lg.font.size');
    }

    .p-iconfield .p-inputchips:not(:first-child) .p-inputchips-input {
        padding-inline-start: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield .p-inputchips:not(:last-child) .p-inputchips-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }
`;
