import { describe, expect, it } from 'vitest';
import { removedInputHint, removedOutputHint } from '../src/v22';

describe('v22 removed and renamed bindings', () => {
    it('points styleClass to the native class attribute on the components that dropped it', () => {
        expect(removedInputHint('p-tag', 'styleClass')).toMatchObject({ suggestion: 'class' });
        expect(removedInputHint('p-toggle-switch', 'styleClass')).toMatchObject({ suggestion: 'class' });
        expect(removedInputHint('p-button', 'styleClass')).toBeUndefined();
    });

    it('names the replacement of renamed inputs, whatever the selector spelling', () => {
        expect(removedInputHint('p-drawer', 'showCloseIcon')).toMatchObject({ suggestion: 'closable' });
        expect(removedInputHint('p-treeTable', 'virtualRowHeight')).toMatchObject({ suggestion: 'virtualScrollItemSize' });
        expect(removedInputHint('p-tree-select', 'containerStyleClass')).toMatchObject({ suggestion: 'class' });
        expect(removedInputHint('p-auto-complete', 'minLength')).toMatchObject({ suggestion: 'minQueryLength' });
    });

    it('reports dead inputs only on the components that lost them', () => {
        expect(removedInputHint('p-toast', 'showTransitionOptions')?.message).toContain('remove-dead-inputs');
        expect(removedInputHint('p-overlay-badge', 'size')?.message).toContain('removed in v22');
        expect(removedInputHint('p-button', 'size')).toBeUndefined();
        expect(removedInputHint('p-toggle-switch', 'size')?.message).toContain('remove-dead-inputs');
    });

    it('names the replacement of the deprecated pass-through aliases of attribute directives', () => {
        expect(removedInputHint('[pTooltip]', 'ptTooltip')).toMatchObject({ suggestion: 'pTooltipPT' });
        expect(removedInputHint('[pButton]', 'ptButtonDirective')).toMatchObject({ suggestion: 'pButtonPT' });
        expect(removedInputHint('[pBadge]', 'size')).toMatchObject({ suggestion: 'badgeSize' });
    });

    it('names the replacement of renamed outputs', () => {
        expect(removedOutputHint('p-multiSelect', 'onPanelShow')).toMatchObject({ suggestion: 'onShow' });
        expect(removedOutputHint('p-table', 'selectAllChange')?.message).toContain('renamed-outputs');
        expect(removedOutputHint('p-order-list', 'onFilterEvent')).toMatchObject({ suggestion: 'onFilter' });
        expect(removedOutputHint('p-select', 'onPanelShow')).toBeUndefined();
        expect(removedInputHint('p-drawer', 'ariaCloseLabel')).toMatchObject({ suggestion: 'closeAriaLabel' });
    });

    it('points the removed Overlay animation outputs to the overlay lifecycle outputs', () => {
        expect(removedOutputHint('p-overlay', 'onAnimationStart')?.message).toContain('onOverlayBeforeEnter');
        expect(removedOutputHint('p-select', 'onAnimationStart')).toBeUndefined();
    });
});
