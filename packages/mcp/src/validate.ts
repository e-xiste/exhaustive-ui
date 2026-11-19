import { COMPONENT_ALIASES, attributeSelectorName, splitSelectors } from './catalog';
import { isInterpolated, literalOfBinding, scanElements, scanImports, type TemplateElement } from './template';
import { compact, slugify } from './text';
import type { Catalog, ComponentEntry, ManifestDeclaration, ManifestInput } from './types';

export type IssueSeverity = 'error' | 'warning';

export interface UsageIssue {
    kind: string;
    severity: IssueSeverity;
    name?: string;
    message: string;
    allowedProps?: string;
    allowedValues?: string;
    allowedEvents?: string;
    suggestion?: string;
}

/** Attributes any element may carry; never reported as unknown inputs. */
const GLOBAL_ATTRIBUTES = new Set([
    'id',
    'class',
    'style',
    'title',
    'hidden',
    'tabindex',
    'role',
    'lang',
    'dir',
    'slot',
    'part',
    'autofocus',
    'draggable',
    'contenteditable',
    'spellcheck',
    'translate',
    'accesskey',
    'inert',
    'popover',
    'ngmodel',
    'ngclass',
    'ngstyle',
    'ngmodeloptions',
    'formcontrol',
    'formcontrolname',
    'formgroup',
    'formgroupname',
    'formarrayname',
    'ngmodelgroup',
    'ngform',
    'ngnativevalidate',
    'ngnonbindable',
    'ngtemplateoutlet',
    'ngtemplateoutletcontext',
    'ngcomponentoutlet',
    'ngprojectas',
    'routerlink',
    'routerlinkactive',
    'routerlinkactiveoptions',
    'queryparams',
    'cdkdrag',
    'cdkdroplist',
    'ptooltip'
]);

/** Attributes and properties of native elements a directive like pButton or pInputText is applied to. */
const NATIVE_ATTRIBUTES = new Set([
    'type',
    'name',
    'value',
    'placeholder',
    'disabled',
    'readonly',
    'required',
    'checked',
    'selected',
    'multiple',
    'min',
    'max',
    'step',
    'minlength',
    'maxlength',
    'pattern',
    'size',
    'rows',
    'cols',
    'wrap',
    'autocomplete',
    'inputmode',
    'enterkeyhint',
    'src',
    'srcset',
    'alt',
    'href',
    'target',
    'rel',
    'download',
    'for',
    'form',
    'list',
    'label',
    'width',
    'height',
    'loading',
    'innerhtml',
    'innertext',
    'textcontent',
    'scrolltop',
    'scrollleft'
]);

const LEGACY_IMPORT_PATTERN = /^(?:primeng(?:\/.*)?|@primeng\/.*|@openng\/optimus-ui(?:\/.*)?|optimus-ui(?:\/.*)?)$/;

interface SelectorIndex {
    /** Lower-cased element selector -> declaration. */
    elements: Map<string, DeclarationRef>;
    /** Lower-cased attribute selector name -> declaration. */
    attributes: Map<string, DeclarationRef>;
}

interface DeclarationRef {
    component: ComponentEntry;
    declaration: ManifestDeclaration;
}

const selectorIndexes = new WeakMap<Catalog, SelectorIndex>();

function selectorIndex(catalog: Catalog): SelectorIndex {
    let index = selectorIndexes.get(catalog);

    if (!index) {
        index = { elements: new Map(), attributes: new Map() };

        for (const component of catalog.components) {
            for (const declaration of component.declarations) {
                for (const selector of splitSelectors(declaration.selector)) {
                    const attribute = attributeSelectorName(selector);

                    if (attribute) {
                        index.attributes.set(attribute.toLowerCase(), { component, declaration });
                    } else if (/^[a-z][\w-]*$/i.test(selector)) {
                        index.elements.set(selector.toLowerCase(), { component, declaration });
                    }
                }
            }
        }

        selectorIndexes.set(catalog, index);
    }

    return index;
}

/** Validate a template or component source against the generated API of one component. */
export function validateComponentUsage(catalog: Catalog, component: ComponentEntry, code: string): UsageIssue[] {
    const issues: UsageIssue[] = [...checkImports(component, code)];

    if (component.declarations.length === 0) {
        issues.push({
            kind: 'api-unavailable',
            severity: 'warning',
            name: component.name,
            message: `No compiled API metadata is available for ${component.title}; bindings could not be checked.`
        });

        return issues;
    }

    const index = selectorIndex(catalog);
    const ownSelectors = new Set(component.selectors.map((selector) => (attributeSelectorName(selector) ?? selector).toLowerCase()));
    const elements = scanElements(code);
    const usages = elements.map((element) => ({ element, matches: declarationsOn(element, index) })).filter(({ matches }) => matches.some((ref) => ref.component === component));

    if (usages.length === 0) {
        issues.push(...checkSelectorMismatch(component, elements, index));

        if (!issues.some((issue) => issue.kind === 'selector-mismatch' || issue.kind === 'unknown-selector')) {
            issues.push({
                kind: 'selector-not-found',
                severity: 'warning',
                name: component.name,
                message: `The code does not use ${component.title}: none of its selectors (${component.selectors.join(', ')}) appear in it.`
            });
        }

        return issues;
    }

    for (const { element, matches } of usages) {
        issues.push(...checkElement(component, element, matches, ownSelectors.has(element.name.toLowerCase())));
    }

    return dedupe(issues);
}

function checkImports(component: ComponentEntry, code: string): UsageIssue[] {
    const issues: UsageIssue[] = [];

    for (const statement of scanImports(code)) {
        if (LEGACY_IMPORT_PATTERN.test(statement.source)) {
            const target = statement.source.split('/').slice(1).join('/');
            const suggestion = target && target === component.name ? component.import : target ? `@exhaustive-ui/core/${target}` : '@exhaustive-ui/core';

            issues.push({
                kind: 'import-mismatch',
                severity: 'error',
                name: statement.source,
                message: `"${statement.source}" is a PrimeNG / Optimus UI import; ExhaustiveUI components are imported from @exhaustive-ui/core.`,
                suggestion: suggestion ? `import { ${statement.names.join(', ') || component.modules[0] || component.declarations[0]?.className || ''} } from '${suggestion}';` : undefined
            });
        }
    }

    return issues;
}

function declarationsOn(element: TemplateElement, index: SelectorIndex): DeclarationRef[] {
    const refs: DeclarationRef[] = [];
    const byElement = index.elements.get(element.name.toLowerCase());

    if (byElement) {
        refs.push(byElement);
    }

    for (const attribute of element.attributes) {
        if (attribute.kind !== 'static' && attribute.kind !== 'property') {
            continue;
        }

        const byAttribute = index.attributes.get(attribute.name.toLowerCase());

        if (byAttribute && !refs.includes(byAttribute)) {
            refs.push(byAttribute);
        }
    }

    return refs;
}

function checkSelectorMismatch(component: ComponentEntry, elements: TemplateElement[], index: SelectorIndex): UsageIssue[] {
    const issues: UsageIssue[] = [];
    const names = new Set([component.name, ...component.declarations.map((declaration) => compact(declaration.className))]);

    for (const element of elements) {
        const tag = element.name;
        const key = compact(tag.replace(/^p-/i, ''));
        const aliasTarget = COMPONENT_ALIASES[slugify(tag.replace(/^p-/i, ''))];

        if (/^[A-Z]/.test(tag) && names.has(compact(tag))) {
            issues.push({
                kind: 'selector-mismatch',
                severity: 'error',
                name: tag,
                message: `ExhaustiveUI ${component.title} is used through its selector (${component.selectors.join(', ')}), not the PascalCase <${tag}> tag.`,
                suggestion: component.selectors[0]
            });
        } else if (/^p-/i.test(tag) && !index.elements.has(tag.toLowerCase())) {
            const renamed = aliasTarget === component.name;
            const related = renamed || names.has(key) || slugify(tag).startsWith(`p-${component.name}`);

            issues.push({
                kind: 'unknown-selector',
                severity: 'error',
                name: tag,
                message: renamed
                    ? `<${tag}> is the PrimeNG name of this component; in ExhaustiveUI ${component.title} uses ${component.selectors.join(' or ')}.`
                    : `<${tag}> is not a selector of any ExhaustiveUI component${related ? '' : ` (expected ${component.title} here)`}; use ${component.selectors.join(' or ')}.`,
                suggestion: component.selectors[0]
            });
        }
    }

    return issues;
}

function checkElement(component: ComponentEntry, element: TemplateElement, matches: DeclarationRef[], isOwnElement: boolean): UsageIssue[] {
    const issues: UsageIssue[] = [];
    const own = matches.filter((ref) => ref.component === component).map((ref) => ref.declaration);
    const inputs = new Map<string, ManifestInput>();
    const outputs = new Set<string>();
    const everyInput = new Set<string>();

    for (const ref of matches) {
        // The attribute that applies a directive (pButton, pTooltip...) is a selector, not an input.
        for (const selector of splitSelectors(ref.declaration.selector)) {
            const attribute = attributeSelectorName(selector);

            if (attribute) {
                everyInput.add(attribute.toLowerCase());
            }
        }

        for (const input of ref.declaration.inputs ?? []) {
            everyInput.add(input.name.toLowerCase());

            if (ref.component === component) {
                inputs.set(input.name.toLowerCase(), input);
            }
        }

        for (const output of ref.declaration.outputs ?? []) {
            outputs.add(output.name);
        }
    }

    const allowedProps = [...inputs.keys()].sort().join(', ');
    const allowedEvents = [...outputs].sort().join(', ');
    const supportsForms = own.some((declaration) => declaration.forms);
    const label = own[0]?.className ?? component.title;

    for (const attribute of element.attributes) {
        const lowerName = attribute.name.toLowerCase();

        switch (attribute.kind) {
            case 'static':
            case 'property': {
                if (everyInput.has(lowerName) && !inputs.has(lowerName)) {
                    // Belongs to another ExhaustiveUI directive on the same element (e.g. pTooltip on a p-button).
                    break;
                }

                const input = inputs.get(lowerName);

                if (!input) {
                    if (GLOBAL_ATTRIBUTES.has(lowerName) || lowerName.startsWith('aria-') || lowerName.startsWith('data-') || lowerName.startsWith('ng') || (!isOwnElement && NATIVE_ATTRIBUTES.has(lowerName))) {
                        break;
                    }

                    issues.push({
                        kind: 'unknown-prop',
                        severity: 'error',
                        name: attribute.name,
                        message: `"${attribute.name}" is not an input of ${label}.`,
                        allowedProps
                    });
                    break;
                }

                if (input.deprecated) {
                    issues.push({
                        kind: 'deprecated-prop',
                        severity: 'warning',
                        name: input.name,
                        message: `Input "${input.name}" of ${label} is deprecated: ${input.deprecated}`
                    });
                }

                const literal = attribute.kind === 'static' ? (isInterpolated(attribute.value) ? undefined : attribute.value) : literalOfBinding(attribute.value);

                if (literal !== undefined && input.values && input.values.length > 0 && !input.values.includes(literal)) {
                    issues.push({
                        kind: 'invalid-enum-value',
                        severity: 'error',
                        name: input.name,
                        message: `"${literal}" is not an allowed value of ${label} input "${input.name}".`,
                        allowedValues: input.values.join(', ')
                    });
                }

                break;
            }
            case 'event': {
                if (outputs.has(attribute.name)) {
                    break;
                }

                const input = inputs.get(lowerName.replace(/change$/, ''));

                if (input?.twoWay && /change$/i.test(attribute.name)) {
                    break;
                }

                if (/^on[A-Z]/.test(attribute.name)) {
                    issues.push({
                        kind: 'unknown-output',
                        severity: 'error',
                        name: attribute.name,
                        message: `"${attribute.name}" is not an output of ${label}.`,
                        allowedEvents
                    });
                }

                break;
            }
            case 'twoWay': {
                if (lowerName === 'ngmodel') {
                    if (isOwnElement && !supportsForms && !inputs.has('ngmodel')) {
                        issues.push({
                            kind: 'forms-unsupported',
                            severity: 'warning',
                            name: 'ngModel',
                            message: `${label} does not implement ControlValueAccessor, so [(ngModel)] has no effect on it.`
                        });
                    }

                    break;
                }

                const input = inputs.get(lowerName);

                if (!input) {
                    if (everyInput.has(lowerName) || GLOBAL_ATTRIBUTES.has(lowerName)) {
                        break;
                    }

                    issues.push({
                        kind: 'unknown-prop',
                        severity: 'error',
                        name: attribute.name,
                        message: `"${attribute.name}" is not an input of ${label}, so it cannot be bound two-way.`,
                        allowedProps
                    });
                } else if (!input.twoWay && !outputs.has(`${input.name}Change`)) {
                    issues.push({
                        kind: 'two-way-binding-unsupported',
                        severity: 'error',
                        name: input.name,
                        message: `Input "${input.name}" of ${label} has no "${input.name}Change" output; bind it one-way with [${input.name}].`
                    });
                }

                break;
            }
            default:
                break;
        }
    }

    return issues;
}

function dedupe(issues: UsageIssue[]): UsageIssue[] {
    const seen = new Set<string>();

    return issues.filter((issue) => {
        const key = `${issue.kind}:${issue.name ?? ''}:${issue.message}`;

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);

        return true;
    });
}

export function formatIssues(componentTitle: string, issues: UsageIssue[]): string {
    const lines = issues.map((issue) => {
        const extras = [
            issue.allowedProps ? ` Allowed inputs: ${issue.allowedProps}.` : '',
            issue.allowedValues ? ` Allowed values: ${issue.allowedValues}.` : '',
            issue.allowedEvents ? ` Allowed outputs: ${issue.allowedEvents}.` : '',
            issue.suggestion ? ` Suggestion: ${issue.suggestion}` : ''
        ].join('');

        return `- [${issue.severity}] ${issue.kind}${issue.name ? ` ${issue.name}` : ''}: ${issue.message}${extras}`;
    });

    return [`Usage has ${issues.length} validation issue${issues.length === 1 ? '' : 's'} for ${componentTitle}.`, ...lines].join('\n');
}
