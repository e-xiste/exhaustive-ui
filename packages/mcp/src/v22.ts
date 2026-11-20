import { compact } from './text';

/**
 * Inputs and outputs removed or renamed in ExhaustiveUI v22, keyed by component tag (`p-` prefix,
 * case and hyphens ignored). Mirrors the `ng update` migrations of @exhaustive-ui/core
 * (styleclass-to-class, renamed-inputs, remove-dead-inputs, remove-dead-outputs) so that
 * validate_usage can name the replacement instead of only reporting an unknown binding.
 */

const STYLE_CLASS_REMOVED = ['toast', 'message', 'tag', 'skeleton', 'card', 'radiobutton', 'progressbar', 'divider', 'progressspinner', 'timeline', 'toolbar', 'avatar', 'chip', 'inputgroup', 'iconfield', 'inputicon', 'toggleswitch'];

const RENAMED: Record<string, Record<string, string>> = {
    drawer: { showcloseicon: 'closable' },
    paginator: { dropdownappendto: 'appendTo' },
    autocomplete: { minlength: 'minQueryLength' },
    treeselect: { containerstyleclass: 'class', containerstyle: 'style' },
    treetable: { virtualrowheight: 'virtualScrollItemSize' }
};

const TRANSITIONS = ['showTransitionOptions', 'hideTransitionOptions'];

const DEAD_INPUTS: Record<string, string[]> = {
    toast: ['showTransformOptions', 'hideTransformOptions', ...TRANSITIONS],
    message: TRANSITIONS,
    overlay: TRANSITIONS,
    colorpicker: TRANSITIONS,
    overlaybadge: ['size'],
    fieldset: ['transitionOptions'],
    panel: ['transitionOptions'],
    accordion: ['transitionOptions'],
    scrolltop: TRANSITIONS,
    confirmpopup: TRANSITIONS,
    togglebutton: ['inputId'],
    popover: [...TRANSITIONS, 'ariaCloseLabel'],
    image: [...TRANSITIONS, 'modalEnterAnimation', 'modalLeaveAnimation'],
    drawer: ['transitionOptions'],
    menu: TRANSITIONS,
    splitbutton: [...TRANSITIONS, 'plain'],
    password: TRANSITIONS,
    button: ['badgeClass'],
    tieredmenu: TRANSITIONS,
    menubar: ['autoZIndex', 'baseZIndex'],
    panelmenu: ['transitionOptions', 'tabindex']
};

const DEAD_OUTPUTS: Record<string, string[]> = {
    overlay: ['onAnimationStart', 'onAnimationDone']
};

function tagKey(tag: string): string {
    return compact(tag.replace(/^p-/i, ''));
}

function has(list: readonly string[] | undefined, name: string): boolean {
    return !!list?.some((entry) => entry.toLowerCase() === name.toLowerCase());
}

/** Replacement guidance for an input that no longer exists on `tag`, or undefined when it was not removed in v22. */
export function removedInputHint(tag: string, name: string): { message: string; suggestion?: string } | undefined {
    const key = tagKey(tag);
    const lower = name.toLowerCase();

    if (lower === 'styleclass' && STYLE_CLASS_REMOVED.includes(key)) {
        return { message: 'styleClass was removed in v22: use the native class attribute (ng update applies the styleclass-to-class migration).', suggestion: 'class' };
    }

    const renamed = RENAMED[key]?.[lower];

    if (renamed) {
        return { message: `${name} was renamed to ${renamed} in v22 (ng update applies the renamed-inputs migration).`, suggestion: renamed };
    }

    if (has(DEAD_INPUTS[key], name)) {
        return { message: `${name} was removed in v22: it had no effect anymore, delete the binding (ng update applies the remove-dead-inputs migration).` };
    }

    return undefined;
}

/** Replacement guidance for an output that no longer exists on `tag`, or undefined when it was not removed in v22. */
export function removedOutputHint(tag: string, name: string): { message: string; suggestion?: string } | undefined {
    if (has(DEAD_OUTPUTS[tagKey(tag)], name)) {
        return {
            message: `${name} was removed in v22: use onOverlayBeforeEnter/onOverlayAfterEnter (show) or onOverlayBeforeLeave/onOverlayAfterLeave (hide) instead (ng update applies the remove-dead-outputs migration).`
        };
    }

    return undefined;
}
