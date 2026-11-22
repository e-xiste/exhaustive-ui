import { compact } from './text';

/**
 * Inputs and outputs removed or renamed in ExhaustiveUI v22, keyed by component tag (`p-` prefix,
 * case and hyphens ignored). Mirrors the `ng update` migrations of @exhaustive-ui/core
 * (styleclass-to-class, renamed-inputs, renamed-outputs, remove-dead-inputs, remove-dead-outputs) so that
 * validate_usage can name the replacement instead of only reporting an unknown binding.
 */

export const STYLE_CLASS_REMOVED: readonly string[] = [
    'accordion',
    'autocomplete',
    'avatar',
    'badge',
    'blockui',
    'card',
    'carousel',
    'cascadeselect',
    'checkbox',
    'chip',
    'colorpicker',
    'dataview',
    'datepicker',
    'divider',
    'dock',
    'editor',
    'iconfield',
    'image',
    'inplace',
    'inputgroup',
    'inputicon',
    'inputnumber',
    'knob',
    'listbox',
    'megamenu',
    'menubar',
    'message',
    'metergroup',
    'multiselect',
    'orderlist',
    'organizationchart',
    'paginator',
    'panel',
    'panelmenu',
    'password',
    'progressbar',
    'progressspinner',
    'radiobutton',
    'scrollpanel',
    'select',
    'skeleton',
    'slider',
    'splitbutton',
    'splitter',
    'table',
    'tag',
    'terminal',
    'timeline',
    'toast',
    'togglebutton',
    'toggleswitch',
    'toolbar',
    'tree',
    'treetable'
];

export const RENAMED: Record<string, Record<string, string>> = {
    drawer: { showcloseicon: 'closable', ariacloselabel: 'closeAriaLabel' },
    paginator: { dropdownappendto: 'appendTo' },
    dialog: { content: 'headerTemplate' },
    autocomplete: { minlength: 'minQueryLength' },
    treeselect: { containerstyleclass: 'class', containerstyle: 'style' },
    treetable: { virtualrowheight: 'virtualScrollItemSize' },
    // attribute directives, keyed by their attribute selector
    pbutton: { ptbuttondirective: 'pButtonPT' },
    pbuttonlabel: { ptbuttonlabel: 'pButtonLabelPT' },
    pbuttonicon: { ptbuttonicon: 'pButtonIconPT' },
    pbadge: { ptbadgedirective: 'pBadgePT', size: 'badgeSize' },
    pinputtext: { ptinputtext: 'pInputTextPT' },
    ptooltip: { pttooltip: 'pTooltipPT' }
};

export const DEAD_INPUTS: Record<string, readonly string[]> = {
    toast: ['showTransformOptions', 'hideTransformOptions', 'showTransitionOptions', 'hideTransitionOptions'],
    toastitem: ['showTransformOptions', 'hideTransformOptions', 'showTransitionOptions', 'hideTransitionOptions'],
    message: ['showTransitionOptions', 'hideTransitionOptions'],
    overlay: ['showTransitionOptions', 'hideTransitionOptions'],
    colorpicker: ['showTransitionOptions', 'hideTransitionOptions'],
    overlaybadge: ['size'],
    fieldset: ['transitionOptions'],
    panel: ['transitionOptions'],
    accordion: ['transitionOptions'],
    scrolltop: ['showTransitionOptions', 'hideTransitionOptions'],
    togglebutton: ['inputId'],
    popover: ['showTransitionOptions', 'hideTransitionOptions', 'ariaCloseLabel'],
    image: ['showTransitionOptions', 'hideTransitionOptions', 'modalEnterAnimation', 'modalLeaveAnimation'],
    drawer: ['transitionOptions'],
    menu: ['showTransitionOptions', 'hideTransitionOptions'],
    splitbutton: ['showTransitionOptions', 'hideTransitionOptions', 'plain'],
    password: ['showTransitionOptions', 'hideTransitionOptions'],
    button: ['badgeClass'],
    contextmenusub: ['autoZIndex', 'baseZIndex', 'popup'],
    tieredmenu: ['showTransitionOptions', 'hideTransitionOptions'],
    menubar: ['autoZIndex', 'baseZIndex'],
    menubarsub: ['autoZIndex', 'baseZIndex', 'mobileActive', 'ariaLabel', 'ariaLabelledBy'],
    panelmenu: ['transitionOptions', 'tabindex'],
    megamenusub: ['disabled', 'queryMatches'],
    galleria: ['showTransitionOptions', 'hideTransitionOptions', 'containerClass'],
    fileupload: ['removeStyleClass'],
    cascadeselect: ['inputLabel', 'emptyMessage'],
    datepicker: ['showTransitionOptions', 'hideTransitionOptions'],
    dialog: ['transitionOptions', 'rtl'],
    confirmdialog: ['closeAriaLabel', 'acceptAriaLabel', 'rejectAriaLabel', 'rtl', 'transitionOptions', 'focusTrap', 'defaultFocus'],
    treenode: ['rowNode', 'root', 'firstChild', 'lastChild'],
    selectitem: ['visible', 'itemSize'],
    table: ['frozenColumns', 'frozenWidth'],
    autocomplete: ['autoZIndex', 'baseZIndex', 'showTransitionOptions', 'hideTransitionOptions', 'autoHighlight'],
    multiselect: ['filterFields'],
    stepper: ['transitionOptions'],
    listbox: ['searchLocale'],
    dataview: ['gridStyleClass', 'trackBy'],
    orderlist: ['trackBy', 'header'],
    picklist: ['trackBy', 'sourceTrackBy', 'targetTrackBy'],
    toggleswitch: ['size'],
    selectbutton: ['tabindex'],
    confirmpopup: ['showTransitionOptions', 'hideTransitionOptions', 'baseZIndex'],
    treetablesorticon: ['ariaLabelAsc', 'ariaLabelDesc']
};

export const RENAMED_OUTPUTS: Record<string, Record<string, string>> = {
    orderlist: { onFilterEvent: 'onFilter' },
    table: { selectAllChange: 'onSelectAllChange' },
    multiselect: { onPanelShow: 'onShow', onPanelHide: 'onHide' }
};

export const DEAD_OUTPUTS: Record<string, readonly string[]> = {
    overlay: ['onAnimationStart', 'onAnimationDone'],
    menubarsub: ['menuFocus', 'menuBlur', 'menuKeydown']
};

function tagKey(tag: string): string {
    return compact(tag.replace(/^p-/i, ''));
}

function has(list: readonly string[] | undefined, name: string): boolean {
    return !!list?.some((entry) => entry.toLowerCase() === name.toLowerCase());
}

/**
 * Replacement guidance for an input that no longer exists on `tag` (an element name, or an attribute
 * directive selector such as `[pTooltip]`), or undefined when it was not removed in v22.
 */
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
    const key = tagKey(tag);
    const renamed = RENAMED_OUTPUTS[key]?.[name];

    if (renamed) {
        return { message: `${name} was renamed to ${renamed} in v22, with the same event payload (ng update applies the renamed-outputs migration).`, suggestion: renamed };
    }

    if (!has(DEAD_OUTPUTS[key], name)) {
        return undefined;
    }

    const replacement = key === 'overlay' ? 'use onOverlayBeforeEnter/onOverlayAfterEnter (show) or onOverlayBeforeLeave/onOverlayAfterLeave (hide) instead' : 'it never fired, bind the native focus/blur/keydown events of the element instead';

    return { message: `${name} was removed in v22: ${replacement} (ng update applies the remove-dead-outputs migration).` };
}
