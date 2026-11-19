import { shortTitle, slugify, snippets, snippetsForTerm, matchesTerm, tokenize, unique } from './text';
import type { Catalog, ComponentEntry, GuideEntry } from './types';

export type SearchScope = 'all' | 'components' | 'guides' | 'api' | 'examples';

interface IndexedField {
    text: string;
    lower: string;
    terms: readonly string[];
    weight: number;
}

interface IndexEntry {
    scope: Exclude<SearchScope, 'all'>;
    result: Record<string, unknown>;
    fields: IndexedField[];
}

export interface SearchHit extends Record<string, unknown> {
    type: string;
    score: number;
    matchedTerms: string[];
    matches: string[];
}

const indexes = new WeakMap<Catalog, IndexEntry[]>();

/** Search components, guides, API members and examples of the catalog. Results are sorted by relevance. */
export function searchCatalog(catalog: Catalog, query: string, scope: SearchScope = 'all'): SearchHit[] {
    const phrase = query.trim().toLowerCase();
    const terms = tokenize(query);
    const entries = indexFor(catalog).filter((entry) => (scope === 'all' ? entry.scope === 'components' || entry.scope === 'guides' : entry.scope === scope));
    const hits: SearchHit[] = [];

    for (const entry of entries) {
        const match = scoreEntry(entry.fields, phrase, terms);

        if (match) {
            hits.push({ ...entry.result, type: String(entry.result.type), score: match.score, matchedTerms: match.matchedTerms, matches: match.matches });
        }
    }

    return hits.sort((a, b) => b.score - a.score || b.matchedTerms.length - a.matchedTerms.length || String(a.title ?? a.name).localeCompare(String(b.title ?? b.name)));
}

function scoreEntry(fields: IndexedField[], phrase: string, terms: string[]): { score: number; matchedTerms: string[]; matches: string[] } | undefined {
    const matchedTerms = new Set<string>();
    const matches: string[] = [];
    let score = 0;
    let phraseMatched = false;

    for (const field of fields) {
        if (!field.text) {
            continue;
        }

        if (phrase && field.lower.includes(phrase)) {
            phraseMatched = true;
            score += 100 * field.weight;
            matches.push(...snippets(field.text, phrase));
        }

        for (const term of terms) {
            if (matchesTerm(term, field.lower, field.terms)) {
                matchedTerms.add(term);
                score += field.weight;
                matches.push(...snippetsForTerm(field.text, term));
            }
        }
    }

    const required = terms.length <= 2 ? 1 : Math.max(2, Math.ceil(terms.length * 0.4));

    if (!phraseMatched && matchedTerms.size < required) {
        return undefined;
    }

    return { score, matchedTerms: [...matchedTerms], matches: unique(matches).slice(0, 5) };
}

function indexFor(catalog: Catalog): IndexEntry[] {
    let index = indexes.get(catalog);

    if (!index) {
        index = buildIndex(catalog);
        indexes.set(catalog, index);
    }

    return index;
}

function buildIndex(catalog: Catalog): IndexEntry[] {
    const entries: IndexEntry[] = [];

    for (const component of catalog.components) {
        entries.push(componentEntry(component));
        entries.push(...apiEntries(component));
        entries.push(...exampleEntries(component));
    }

    for (const guide of catalog.guides) {
        entries.push(guideEntry(guide));
    }

    return entries;
}

function componentEntry(component: ComponentEntry): IndexEntry {
    const api = component.api;
    const apiText = [...(api.props ?? []), ...(api.emits ?? []), ...(api.templates ?? []), ...(api.methods ?? []), ...(api.pt ?? [])].map((member) => `${member.name} ${member.description ?? ''}`).join(' ');
    const sectionsText = component.sections.map((section) => `${section.label} ${section.description ?? ''}`).join(' ');
    const codeText = component.sections.map((section) => section.code ?? '').join('\n');

    return {
        scope: 'components',
        result: {
            type: 'component',
            name: component.name,
            title: component.title,
            description: component.description,
            selectors: component.selectors,
            import: component.import,
            resourceUri: component.resourceUri,
            publicUrl: component.publicUrl,
            nextCall: { tool: 'get_component', arguments: { component: component.name } }
        },
        fields: [
            field([component.name, shortTitle(component.title), ...component.selectors, component.import ?? '', ...component.declarations.map((declaration) => declaration.className)].join(' '), 8),
            field(component.description, 4),
            field(sectionsText, 3),
            field(apiText, 3),
            field(codeText, 1)
        ]
    };
}

function guideEntry(guide: GuideEntry): IndexEntry {
    return {
        scope: 'guides',
        result: {
            type: 'guide',
            name: guide.name,
            title: guide.title,
            description: guide.description,
            route: guide.route,
            resourceUri: guide.resourceUri,
            publicUrl: guide.publicUrl,
            nextCall: { tool: 'get_guide', arguments: { guide: guide.name } }
        },
        fields: [
            field([guide.name, guide.route, guide.title].join(' '), 8),
            field(guide.description, 4),
            field(guide.sections.map((section) => `${section.label} ${section.description ?? ''}`).join(' '), 3),
            field(guide.sections.map((section) => section.code ?? '').join('\n'), 1)
        ]
    };
}

function apiEntries(component: ComponentEntry): IndexEntry[] {
    const api = component.api;
    const members: { member: string; name: string; type?: string; description?: string }[] = [
        ...(api.props ?? []).map((prop) => ({ member: 'prop', name: prop.name, type: prop.type, description: prop.description })),
        ...(api.emits ?? []).map((emit) => ({ member: 'emit', name: emit.name, type: emit.parameters?.map((parameter) => `${parameter.name}: ${parameter.type ?? 'unknown'}`).join(', '), description: emit.description })),
        ...(api.templates ?? []).map((template) => ({ member: 'template', name: template.name, type: template.type, description: template.description })),
        ...(api.methods ?? []).map((method) => ({ member: 'method', name: method.name, type: method.returnType, description: method.description })),
        ...(api.pt ?? []).map((pt) => ({ member: 'pt', name: pt.name, type: pt.type, description: pt.description })),
        ...(api.styles ?? []).map((style) => ({ member: 'style', name: style.class, description: style.description })),
        ...(api.tokens ?? []).map((token) => ({ member: 'token', name: token.token, type: token.variable, description: token.description }))
    ];

    return members.map((member) => ({
        scope: 'api',
        result: {
            type: 'api',
            component: component.name,
            member: member.member,
            name: member.name,
            memberType: member.type,
            description: member.description,
            apiResourceUri: component.apiResourceUri,
            nextCall: { tool: 'get_component', arguments: { component: component.name, includeApi: true } }
        },
        fields: [field(`${component.name} ${member.name} ${slugify(member.name).replace(/-/g, ' ')}`, 8), field(`${member.type ?? ''} ${member.description ?? ''}`, 3)]
    }));
}

function exampleEntries(component: ComponentEntry): IndexEntry[] {
    return component.sections
        .filter((section) => section.hasCode)
        .map((section) => ({
            scope: 'examples',
            result: {
                type: 'example',
                component: component.name,
                section: section.id,
                title: section.label,
                description: section.description,
                codeLanguage: section.codeLanguage,
                resourceUri: component.resourceUri,
                nextCall: { tool: 'get_example', arguments: { component: component.name, section: section.id } }
            },
            fields: [field(`${component.name} ${section.label} ${section.id}`, 8), field(section.description ?? '', 3), field(section.code ?? '', 1)]
        }));
}

function field(text: string | undefined, weight: number): IndexedField {
    const value = text ?? '';

    return { text: value, lower: value.toLowerCase(), terms: tokenize(value), weight };
}
