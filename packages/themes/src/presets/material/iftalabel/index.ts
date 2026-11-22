import type { IftaLabelDesignTokens, IftaLabelTokenSections } from '@exhaustive-ui/themes/types/iftalabel';

export const root: IftaLabelTokenSections.Root = {
    color: '{form.field.float.label.color}',
    focusColor: '{form.field.float.label.focus.color}',
    invalidColor: '{form.field.float.label.invalid.color}',
    transitionDuration: '0.2s',
    positionX: '{form.field.padding.x}',
    top: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: '400',
    sm: {
        positionX: '{form.field.sm.padding.x}',
        top: '0.375rem',
        fontSize: '0.6875rem'
    },
    lg: {
        positionX: '{form.field.lg.padding.x}',
        top: '0.625rem',
        fontSize: '0.8125rem'
    }
};

export const input: IftaLabelTokenSections.Input = {
    paddingTop: '1.5rem',
    paddingBottom: '0.5rem',
    sm: {
        paddingTop: '1.25rem',
        paddingBottom: '0.375rem'
    },
    lg: {
        paddingTop: '1.6875rem',
        paddingBottom: '0.625rem'
    }
};

export const css: IftaLabelTokenSections.CSS = /*css*/ ``;

export default {
    root,
    input,
    css
} satisfies IftaLabelDesignTokens;
