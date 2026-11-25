import fs from 'fs';
import path from 'path';

/**
 * Compact component cards for LLMs: one short Markdown file per component (import, selectors, the inputs and outputs
 * the documentation examples use, every template with its context, one example). They are what an agent should read
 * first; the full documents (`components/<name>.md`) stay available for everything else.
 *
 * Built from the generated `manifest.json` (compiled API) and `components.json` (doc sections and examples).
 */

export const SITE_URL = 'https://exhaustive-ui.com';

/** Inputs every component and directive has, explained once at the end of the card. */
const COMMON_INPUTS = ['dt', 'pt', 'ptOptions', 'unstyled'];

/** Types with more properties than this are only named, not expanded. */
const MAX_TYPE_PROPERTIES = 8;

/** Longest example code kept when a shorter one exists. */
const MAX_EXAMPLE_LENGTH = 3000;

const EXAMPLE_SECTIONS = ['basic', 'usage', 'default', 'import'];

/** Sections whose example only shows a state of the component, without its data: the shortest, and the least useful. */
const STATE_SECTIONS = ['disabled', 'loading'];

/** Inputs worth detailing although no documentation example uses them, per entry point. */
const DETAILED_INPUTS = {
    datepicker: ['touchUI'],
    dialog: ['appendTo'],
    fileupload: ['customUpload'],
    image: ['previewImageSrc'],
    inputmask: ['mask', 'showClear'],
    toast: ['life'],
    treetable: ['customSort']
};

const oneLine = (text = '') =>
    text
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^(.{0,157}\S)\s.*$/, '$1…');

const firstSentence = (text = '') => {
    const line = text.replace(/\s+/g, ' ').trim();
    const end = line.search(/\.(\s|$)/);
    return end > 0 ? line.slice(0, end + 1) : oneLine(line);
};

/** Every attribute or binding name written in the example code (`[options]`, `(onChange)`, `[(visible)]`, `filter`). */
function usedNames(examples) {
    const names = new Set();
    for (const code of examples) {
        for (const tag of code.matchAll(/<[a-zA-Z][\w-]*\s([^<>]*?)\/?>/g)) {
            for (const attribute of tag[1].matchAll(/(?:^|\s)\[?\(?([a-zA-Z][\w.-]*)\)?\]?(?=\s*=|\s|$)/g)) names.add(attribute[1]);
        }
    }
    return names;
}

function typeIndex(manifest) {
    const types = new Map();
    for (const entryPoint of manifest.entryPoints) for (const type of entryPoint.types ?? []) if (!types.has(type.name)) types.set(type.name, type);
    return types;
}

/** `$implicit: T, rowIndex: number, …` of a template context type, or undefined when it is not a known interface. */
function contextKeys(types, context) {
    if (!context || context === 'void') return undefined;
    const type = types.get(context.replace(/<.*$/, ''));
    if (!type?.properties?.length) return undefined;
    return type.properties.map((property) => `${property.name}${property.optional ? '?' : ''}: ${property.type}`).join(', ');
}

/** `let-row let-rowIndex="rowIndex"`: how the context is read in a template. */
function letSyntax(types, context) {
    const type = context && types.get(context.replace(/<.*$/, ''));
    if (!type?.properties?.length) return '';
    return type.properties
        .slice(0, 3)
        .map((property) => (property.name === '$implicit' ? 'let-item' : `let-${property.name}="${property.name}"`))
        .join(' ');
}

const selectorsOf = (declaration) =>
    declaration.selector
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

function exampleOf(component) {
    const sections = component?.sections ?? [];
    const withCode = sections.filter((s) => s.examples?.typescript);
    const preferred = EXAMPLE_SECTIONS.map((id) => withCode.find((s) => s.id === id)).find(Boolean);
    // A long demo page drowns the card: fall back to the shortest example of the component.
    const [shortest] = withCode.toSorted((a, b) => STATE_SECTIONS.includes(a.id) - STATE_SECTIONS.includes(b.id) || a.examples.typescript.length - b.examples.typescript.length);
    const section = preferred && preferred.examples.typescript.length <= MAX_EXAMPLE_LENGTH ? preferred : shortest;
    return section ? { title: section.label, code: section.examples.typescript.trim() } : undefined;
}

function inputLine(input) {
    const type = input.type ? `: \`${input.type}\`` : '';
    const def = input.default !== undefined && input.default !== 'undefined' ? ` = \`${input.default}\`` : '';
    const twoWay = input.twoWay ? ' (two-way: `[(${input.name})]`)' : '';
    return `- \`${input.name}\`${type}${def}${twoWay}: ${firstSentence(input.description)}`;
}

/** @returns {string} the Markdown card of one entry point */
export function renderCard(entryPoint, component, types) {
    const declarations = (entryPoint.declarations ?? []).filter((d) => !d.internal);
    const own = (d) => selectorsOf(d).some((s) => s.replace(/[-[\]]/g, '').toLowerCase() === `p${entryPoint.name}`);
    const main = declarations.find(own) ?? declarations.find((d) => selectorsOf(d).some((s) => /^p-/.test(s))) ?? declarations[0];
    const examples = (component?.sections ?? []).map((s) => s.examples?.typescript).filter(Boolean);
    const used = usedNames(examples);
    for (const name of DETAILED_INPUTS[entryPoint.name] ?? []) used.add(name);
    const exports = [...new Set([...declarations.map((d) => d.className), ...(entryPoint.modules ?? [])])];
    const title = component?.title?.replace(/^Angular\s+|\s+(Component|Directive)$/g, '') ?? entryPoint.name;
    const lines = [];

    lines.push(`# ${title}`, '', firstSentence(entryPoint.description || component?.description), '');
    const modules = (entryPoint.modules ?? []).filter((m) => m !== main?.className);
    const importLine = `import { ${main?.className ?? entryPoint.services?.[0] ?? exports[0]} } from '${entryPoint.import}';`;
    lines.push('```typescript', main && modules.length ? `${importLine} // standalone; or ${modules.join(', ')} for all its parts` : importLine, '```', '');

    // A service-driven entry point (DynamicDialog): no element to write, the service and its classes are the API.
    if (!main) {
        for (const service of entryPoint.services ?? []) lines.push(`## Service \`${service}\``, '', 'Provide it (`providers: [' + service + ']`) and inject it; it renders the component for you.', '');
        for (const cls of entryPoint.classes ?? []) {
            const members = (cls.members ?? []).filter((m) => !['pt', 'unstyled'].includes(m.name));
            if (!members.length) continue;
            lines.push(`### \`${cls.name}\``, '');
            if (cls.description) lines.push(firstSentence(cls.description), '');
            lines.push(`- Members: ${members.map((m) => `\`${m.name}${m.kind === 'method' ? '()' : ''}\``).join(', ')}.`, '');
        }
    }

    for (const declaration of main ? [main, ...declarations.filter((d) => d !== main)] : []) {
        const selectors = selectorsOf(declaration);
        const isMain = declaration === main;
        const header = `${isMain ? '## ' : '### '}\`${selectors[0]}\`${
            selectors.length > 1
                ? ` (also ${selectors
                      .slice(1)
                      .map((s) => `\`${s}\``)
                      .join(', ')}, legacy)`
                : ''
        }: ${declaration.className}`;
        lines.push(header, '');
        if (!isMain && declaration.description) lines.push(firstSentence(declaration.description), '');
        if (declaration.forms) lines.push('Form control: use `[(ngModel)]`, `formControlName` or `[formControl]`.', '');

        const inputs = declaration.inputs ?? [];
        const outputs = declaration.outputs ?? [];
        const live = inputs.filter((i) => !i.deprecated && !COMMON_INPUTS.includes(i.name));
        // The main element details the inputs the documentation examples use; secondary parts only name theirs.
        const keyInputs = isMain ? live.filter((i) => used.has(i.name)) : [];
        const otherInputs = live.filter((i) => !keyInputs.includes(i));

        if (keyInputs.length) lines.push('Inputs:', ...keyInputs.map(inputLine));
        if (otherInputs.length) lines.push(`- ${keyInputs.length ? 'Other inputs' : 'Inputs'}: ${otherInputs.map((i) => `\`${i.name}\``).join(', ')}.`);
        if (outputs.length && isMain) lines.push('', 'Outputs:', ...outputs.map((o) => `- \`(${o.name})\`${o.payload ? `: \`${o.payload}\`` : ''}`));
        else if (outputs.length) lines.push(`- Outputs: ${outputs.map((o) => `\`(${o.name})\``).join(', ')}.`);
        if (live.length || outputs.length) lines.push('');

        const templates = declaration.templates ?? [];
        if (templates.length) {
            lines.push('Templates (`<ng-template #name let-…>` inside the element):');
            for (const template of templates) {
                const keys = contextKeys(types, template.context);
                const context = keys ? `context { ${keys} }` : 'no context';
                lines.push(`- \`#${template.name}\`: ${context}. ${firstSentence(template.description)}`);
            }
            const sample = templates.find((t) => contextKeys(types, t.context));
            if (sample) lines.push('', `Read a context with \`let-\`: \`<ng-template #${sample.name} ${letSyntax(types, sample.context)}>\` (\`$implicit\` is the bare \`let-x\`).`);
            lines.push('');
        }
    }

    // The library types the template contexts refer to (TreeTableRowNode, PaginatorState...), when they are short.
    const referenced = new Set();
    for (const declaration of declarations) {
        for (const template of declaration.templates ?? []) {
            const context = template.context && types.get(template.context.replace(/<.*$/, ''));
            for (const property of context?.properties ?? []) for (const word of property.type.match(/\b[A-Z]\w+/g) ?? []) referenced.add(word);
        }
    }
    const shortTypes = [...referenced].map((name) => types.get(name)).filter((type) => type?.properties?.length && type.properties.length <= MAX_TYPE_PROPERTIES && !type.name.endsWith('TemplateContext'));
    if (shortTypes.length) {
        lines.push('Types used in the contexts:', ...shortTypes.map((type) => `- \`${type.name}\`: { ${type.properties.map((p) => `${p.name}${p.optional ? '?' : ''}: ${p.type}`).join(', ')} }`), '');
    }

    const example = exampleOf(component);
    if (example) lines.push(`## Example: ${example.title}`, '', '```typescript', example.code, '```', '');

    lines.push('Every component and directive also accepts `pt` (pass through attributes), `ptOptions`, `dt` (design tokens) and `unstyled`.', '');
    lines.push(`Full documentation (every input, pass through, styling, all examples): ${SITE_URL}/llms/components/${component?.name ?? entryPoint.name}.md`, '');
    return lines.join('\n');
}

/**
 * Write `cards/<name>.md` for every documented component and return the list.
 * @param {{ manifestPath: string, componentsPath: string, outputDir: string }} options
 */
export function generateCards({ manifestPath, componentsPath, outputDir }) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const { components } = JSON.parse(fs.readFileSync(componentsPath, 'utf-8'));
    const types = typeIndex(manifest);
    const entryPoints = new Map(manifest.entryPoints.map((e) => [e.name, e]));
    const dir = path.join(outputDir, 'cards');
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const written = [];
    for (const component of components) {
        const entryPoint = entryPoints.get(component.name);
        if (!entryPoint?.declarations?.length) continue;
        const card = renderCard(entryPoint, component, types);
        fs.writeFileSync(path.join(dir, `${component.name}.md`), card, 'utf-8');
        written.push({ name: component.name, title: component.title, description: firstSentence(component.description), size: card.length });
    }
    fs.writeFileSync(
        path.join(dir, 'index.json'),
        JSON.stringify(
            written.map(({ name, title, description }) => ({ name, title, description })),
            null,
            2
        ),
        'utf-8'
    );
    return written;
}
