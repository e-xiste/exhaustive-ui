/**
 * Shapes of the machine-readable docs published by the ExhaustiveUI docs site under `/llms/`
 * (apps/docs/scripts/build-llm-docs.mjs and build-manifest.mjs), and the normalized catalog the server builds from them.
 */

// ---------------------------------------------------------------------------------------------------------------------
// /llms/components.json
// ---------------------------------------------------------------------------------------------------------------------

export interface RawApiProp {
    name: string;
    type?: string;
    default?: string;
    description?: string;
    deprecated?: string;
}

export interface RawApiParameter {
    name: string;
    type?: string;
}

export interface RawApiEmit {
    name: string;
    parameters?: RawApiParameter[];
    description?: string;
}

export interface RawApiTemplate {
    name: string;
    type?: string;
    description?: string;
}

export interface RawApiMethod {
    name: string;
    parameters?: RawApiParameter[];
    returnType?: string;
    description?: string;
}

export interface RawApiPassThrough {
    name: string;
    type?: string;
    description?: string;
}

export interface RawApiStyleClass {
    class: string;
    description?: string;
}

export interface RawApiToken {
    token: string;
    variable?: string;
    description?: string;
}

export interface RawComponentApi {
    props?: RawApiProp[];
    templates?: RawApiTemplate[];
    emits?: RawApiEmit[];
    methods?: RawApiMethod[];
    pt?: RawApiPassThrough[];
    styles?: RawApiStyleClass[];
    tokens?: RawApiToken[];
}

export interface RawSectionExamples {
    typescript?: string;
    html?: string;
    command?: string;
}

export interface RawSection {
    id: string;
    label: string;
    description?: string;
    examples?: RawSectionExamples | null;
}

export interface RawComponent {
    name: string;
    title: string;
    description?: string;
    sections: RawSection[];
    api?: RawComponentApi;
}

export interface RawPage {
    name: string;
    path: string;
    title: string;
    description?: string;
    sections: RawSection[];
}

export interface ComponentsJson {
    version: string;
    generatedAt: string;
    components: RawComponent[];
    pages: RawPage[];
}

// ---------------------------------------------------------------------------------------------------------------------
// /llms/manifest.json
// ---------------------------------------------------------------------------------------------------------------------

export interface ManifestInput {
    name: string;
    type?: string;
    description?: string;
    signal?: boolean;
    default?: string;
    transform?: string;
    deprecated?: string;
    twoWay?: boolean;
    /** Class property name when it differs from the binding name. */
    property?: string;
    /** Allowed literal values when the input type is a union of string literals. */
    values?: string[];
}

export interface ManifestOutput {
    name: string;
    payload?: string;
    description?: string;
}

export interface ManifestTemplate {
    name: string;
    context?: string;
    description?: string;
}

export interface ManifestPassThrough {
    name: string;
    type?: string;
    description?: string;
}

export interface ManifestMethod {
    name: string;
    description?: string;
}

export interface ManifestDeclaration {
    kind: 'component' | 'directive';
    className: string;
    selector?: string;
    standalone?: boolean;
    description?: string;
    inputs?: ManifestInput[];
    outputs?: ManifestOutput[];
    templates?: ManifestTemplate[];
    contentProjection?: string[];
    passThrough?: ManifestPassThrough[];
    /** A rendering detail of another component (`@internal`): exported, but not used directly in templates. */
    internal?: boolean;
    /** True when the declaration implements ControlValueAccessor (works with ngModel and reactive forms). */
    forms?: boolean;
    methods?: ManifestMethod[];
}

export interface ManifestEntryPoint {
    name: string;
    import: string;
    description?: string;
    modules?: string[];
    declarations?: ManifestDeclaration[];
    services?: string[];
    types?: unknown[];
    cssClasses?: { class: string; description?: string }[];
    classes?: unknown[];
}

export interface ManifestJson {
    schemaVersion: number;
    package: string;
    version: string;
    site: string;
    entryPoints: ManifestEntryPoint[];
}

// ---------------------------------------------------------------------------------------------------------------------
// Normalized catalog
// ---------------------------------------------------------------------------------------------------------------------

export type CodeLanguage = 'typescript' | 'html' | 'bash';

export interface SectionEntry {
    id: string;
    label: string;
    description?: string;
    hasCode: boolean;
    codeLanguage?: CodeLanguage;
    code?: string;
}

export interface ComponentEntry {
    kind: 'component';
    name: string;
    title: string;
    description: string;
    route: string;
    publicUrl: string;
    markdownUrl: string;
    docPath: string;
    /** Compact card: import, tag, key inputs, templates with their context, one example. */
    cardPath: string;
    cardUrl: string;
    resourceUri: string;
    apiResourceUri: string;
    import?: string;
    modules: string[];
    selectors: string[];
    declarations: ManifestDeclaration[];
    sections: SectionEntry[];
    api: RawComponentApi;
}

export interface GuideEntry {
    kind: 'guide';
    name: string;
    title: string;
    description: string;
    route: string;
    publicUrl: string;
    markdownUrl: string;
    docPath: string;
    resourceUri: string;
    sections: SectionEntry[];
}

export interface DirectiveEntry {
    className: string;
    selector: string;
    entryPoint: string;
    import: string;
    description?: string;
    /** Name of the catalog component whose docs cover this directive, when there is one. */
    component?: string;
}

export interface Catalog {
    libraryVersion: string;
    docsVersion: string;
    generatedAt: string;
    site: string;
    components: ComponentEntry[];
    /**
     * Entry points with selectors but no docs page of their own (InputIcon, OverlayBadge, Bind...): not listed or
     * searchable as components, but known to the usage validators so their tags and inputs are recognized.
     */
    parts: ComponentEntry[];
    guides: GuideEntry[];
    directives: DirectiveEntry[];
}
