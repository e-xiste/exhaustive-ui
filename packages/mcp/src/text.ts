/** Lower-case, dash-separated form of a name, route or title ("Angular Button Component" -> "angular-button-component"). */
export function slugify(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/** Letters and digits only ("Angular CLI" -> "angularcli"); used to compare environment names and selectors loosely. */
export function compact(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '');
}

export function unique<T>(values: Iterable<T>): T[] {
    return [...new Set(values)];
}

const STOP_WORDS = new Set(['a', 'an', 'and', 'as', 'by', 'for', 'from', 'how', 'i', 'in', 'is', 'of', 'on', 'or', 'the', 'to', 'use', 'with']);

/** Significant search terms of a query. */
export function tokenize(value: string): string[] {
    return unique(
        slugify(value)
            .split('-')
            .filter((term) => term.length > 1 && !STOP_WORDS.has(term))
    );
}

const SYNONYMS: Record<string, string[]> = {
    board: ['kanban'],
    busy: ['loading', 'spinner'],
    calendar: ['datepicker', 'date'],
    chips: ['autocomplete', 'multiple'],
    danger: ['severity', 'error'],
    date: ['datepicker', 'calendar'],
    datatable: ['table'],
    dialog: ['modal', 'popup'],
    drag: ['dragdrop', 'kanban', 'orderlist', 'picklist'],
    dropdown: ['select'],
    dropzone: ['fileinput', 'upload'],
    error: ['danger', 'severity', 'invalid'],
    file: ['fileinput', 'fileupload', 'upload'],
    files: ['file'],
    filter: ['filtering', 'filters', 'filtered', 'search'],
    filtering: ['filter'],
    filters: ['filter'],
    form: ['forms', 'ngmodel', 'reactive'],
    forms: ['form'],
    icon: ['icons'],
    icons: ['icon'],
    inputswitch: ['toggleswitch'],
    kanban: ['board', 'task'],
    lazy: ['virtual', 'scroller', 'loading'],
    load: ['loading'],
    loading: ['load', 'spinner', 'busy'],
    menu: ['menubar', 'tieredmenu', 'contextmenu', 'panelmenu'],
    modal: ['dialog'],
    notification: ['toast', 'message'],
    overlaypanel: ['popover'],
    page: ['paginator', 'pagination', 'pages'],
    pages: ['paginator', 'pagination'],
    paginate: ['paginator', 'pagination'],
    pagination: ['paginator', 'page'],
    paginator: ['pagination', 'page'],
    popup: ['popover', 'dialog', 'overlay'],
    pt: ['passthrough', 'pass'],
    passthrough: ['pt'],
    select: ['selection', 'selected', 'dropdown'],
    selected: ['selection', 'select'],
    selection: ['select', 'selected'],
    severity: ['danger', 'error', 'success', 'warn', 'info'],
    sidebar: ['drawer'],
    sort: ['sorting', 'sortable', 'sorted'],
    sortable: ['sort'],
    sorting: ['sort'],
    spinner: ['loading', 'progressspinner'],
    switch: ['toggleswitch'],
    tab: ['tabs'],
    tabview: ['tabs'],
    task: ['kanban'],
    tasks: ['task'],
    template: ['templates', 'templating', 'ng-template'],
    templates: ['template'],
    templating: ['template'],
    theme: ['theming', 'themes', 'tokens', 'preset'],
    themes: ['theme'],
    theming: ['theme'],
    toggle: ['togglebutton', 'toggleswitch'],
    token: ['tokens', 'theming'],
    tokens: ['token', 'theming'],
    tooltip: ['tooltips'],
    trello: ['kanban'],
    upload: ['fileinput', 'fileupload', 'file'],
    validation: ['invalid', 'forms'],
    virtual: ['scroller', 'virtualscroll', 'lazy']
};

/** Crude English stemmer, good enough to match "sorting" against "sortable". */
export function stem(term: string): string {
    return term
        .replace(/(?:ing|ers|er|ed|es|s)$/i, '')
        .replace(/(?:tion|ions)$/i, 't')
        .replace(/(?:able)$/i, '');
}

/** A term together with its synonyms and stem; every entry is at least two characters long. */
export function expandTerm(term: string): string[] {
    const base = slugify(term);
    const variants = new Set<string>([base]);

    for (const synonym of SYNONYMS[base] ?? []) {
        variants.add(synonym);
    }

    const stemmed = stem(base);

    if (stemmed !== base) {
        variants.add(stemmed);
    }

    return [...variants].filter((variant) => variant.length > 1);
}

/** Whether one of the (expanded) terms occurs in the text; prefix matches count for terms longer than three characters. */
export function matchesTerm(term: string, lowerText: string, textTerms: readonly string[]): boolean {
    return expandTerm(term).some((variant) => lowerText.includes(variant) || textTerms.includes(variant) || textTerms.some((textTerm) => variant.length > 3 && textTerm.length > 3 && (textTerm.startsWith(variant) || variant.startsWith(textTerm))));
}

/** Up to five short excerpts around the occurrences of the needle. */
export function snippets(text: string, needle: string, limit = 5): string[] {
    const lower = text.toLowerCase();
    const target = needle.toLowerCase();
    const results: string[] = [];
    let index = lower.indexOf(target);

    while (index !== -1 && results.length < limit) {
        const start = Math.max(0, index - 45);
        const end = Math.min(text.length, index + target.length + 45);

        results.push(text.slice(start, end).replace(/\s+/g, ' ').trim());
        index = lower.indexOf(target, index + target.length);
    }

    return results;
}

/** The best snippets for a term, trying its synonyms when the term itself does not occur. */
export function snippetsForTerm(text: string, term: string): string[] {
    for (const variant of expandTerm(term)) {
        const found = snippets(text, variant);

        if (found.length > 0) {
            return found;
        }
    }

    return [];
}

/** Human readable title without the "Angular ... Component" wrapper of the generated docs ("Angular Button Component" -> "Button"). */
export function shortTitle(title: string): string {
    return title.replace(/^Angular\s+/i, '').replace(/\s+(Component|Directive|API)$/i, '');
}
