/**
 * A deliberately small scanner for Angular templates and component sources: enough to find the elements a component
 * is used on and the bindings written on them, without pulling the Angular compiler into an MCP server.
 */

export type AttributeKind = 'static' | 'property' | 'event' | 'twoWay' | 'structural' | 'reference' | 'other';

export interface TemplateAttribute {
    raw: string;
    kind: AttributeKind;
    /** Binding target without its sigils: `[severity]` -> `severity`, `(onClick)` -> `onClick`. */
    name: string;
    value?: string;
}

export interface TemplateElement {
    name: string;
    attributes: TemplateAttribute[];
    raw: string;
}

export interface ImportStatement {
    source: string;
    names: string[];
}

const TAG_PATTERN = /<([A-Za-z][\w.-]*)((?:\s+(?:[^\s<>"'=/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'<>]+))?))*)\s*\/?>/g;
const ATTRIBUTE_PATTERN = /([^\s"'=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>]+)))?/g;
const IMPORT_PATTERN = /import\s+(?:type\s+)?(?:([\w$]+)\s*,?\s*)?(?:\{([^}]*)\}|\*\s+as\s+([\w$]+))?\s*from\s*['"]([^'"]+)['"]/g;

/** Every opening element of the template with its attributes. */
export function scanElements(code: string): TemplateElement[] {
    const elements: TemplateElement[] = [];

    for (const match of code.matchAll(TAG_PATTERN)) {
        const attributes: TemplateAttribute[] = [];

        for (const attribute of (match[2] ?? '').matchAll(ATTRIBUTE_PATTERN)) {
            const raw = attribute[1]!;
            const value = attribute[2] ?? attribute[3] ?? attribute[4];

            attributes.push({ raw, value, ...classifyAttribute(raw) });
        }

        elements.push({ name: match[1]!, attributes, raw: match[0] });
    }

    return elements;
}

export function classifyAttribute(raw: string): { kind: AttributeKind; name: string } {
    let match = /^\[\((.+)\)\]$/.exec(raw);

    if (match) {
        return { kind: 'twoWay', name: match[1]! };
    }

    match = /^bindon-(.+)$/.exec(raw);

    if (match) {
        return { kind: 'twoWay', name: match[1]! };
    }

    match = /^\[(.+)\]$/.exec(raw) ?? /^bind-(.+)$/.exec(raw);

    if (match) {
        const target = match[1]!;

        return /^(?:attr|class|style)\./.test(target) ? { kind: 'other', name: target } : { kind: 'property', name: target };
    }

    match = /^\((.+)\)$/.exec(raw) ?? /^on-(.+)$/.exec(raw);

    if (match) {
        return { kind: 'event', name: match[1]! };
    }

    if (raw.startsWith('*')) {
        return { kind: 'structural', name: raw.slice(1) };
    }

    if (raw.startsWith('let-')) {
        return { kind: 'other', name: raw };
    }

    if (raw.startsWith('#') || raw.startsWith('ref-')) {
        return { kind: 'reference', name: raw.replace(/^#|^ref-/, '') };
    }

    if (raw.startsWith('@') || raw.startsWith('i18n') || raw.includes('.')) {
        return { kind: 'other', name: raw };
    }

    return { kind: 'static', name: raw };
}

/** ES import statements of a component source. */
export function scanImports(code: string): ImportStatement[] {
    const imports: ImportStatement[] = [];

    for (const match of code.matchAll(IMPORT_PATTERN)) {
        const names = [
            match[1],
            match[3],
            ...(match[2] ?? '').split(',').map(
                (name) =>
                    name
                        .trim()
                        .split(/\s+as\s+/)
                        .pop() ?? ''
            )
        ].filter((name): name is string => !!name);

        imports.push({ source: match[4]!, names });
    }

    return imports;
}

/** Whether an attribute value is a template expression rather than a literal. */
export function isInterpolated(value: string | undefined): boolean {
    return value !== undefined && value.includes('{{');
}

/** The string literal a property binding assigns (`[severity]="'danger'"` -> `danger`), or undefined when it is an expression. */
export function literalOfBinding(value: string | undefined): string | undefined {
    const match = value === undefined ? null : /^\s*(?:'([^']*)'|"([^"]*)")\s*$/.exec(value);

    return match ? (match[1] ?? match[2]) : undefined;
}
