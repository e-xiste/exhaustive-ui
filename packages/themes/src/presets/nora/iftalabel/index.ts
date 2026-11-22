import type { IftaLabelDesignTokens, IftaLabelTokenSections } from '@exhaustive-ui/themes/types/iftalabel';

export const root: IftaLabelTokenSections.Root = {
    color: '{form.field.float.label.color}',
    focusColor: '{form.field.float.label.focus.color}',
    invalidColor: '{form.field.float.label.invalid.color}',
    transitionDuration: '0.2s',
    positionX: '{form.field.padding.x}',
    top: '{form.field.padding.y}',
    fontSize: '0.75rem',
    fontWeight: '400',
    sm: {
        positionX: '{form.field.sm.padding.x}',
        top: '{form.field.sm.padding.y}',
        fontSize: '0.6875rem'
    },
    lg: {
        positionX: '{form.field.lg.padding.x}',
        top: '{form.field.lg.padding.y}',
        fontSize: '0.8125rem'
    }
};

export const input: IftaLabelTokenSections.Input = {
    paddingTop: '1.5rem',
    paddingBottom: '{form.field.padding.y}',
    sm: {
        paddingTop: '1.25rem',
        paddingBottom: '{form.field.sm.padding.y}'
    },
    lg: {
        paddingTop: '1.6875rem',
        paddingBottom: '{form.field.lg.padding.y}'
    }
};

export default {
    root,
    input
} satisfies IftaLabelDesignTokens;
