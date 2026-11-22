/**
 * AGENTS.md for the users of @exhaustive-ui/core: what an AI coding agent must know before writing code with the
 * library, the PrimeNG habits to drop, and the index of the component cards.
 *
 * Rendered twice: in the npm package (links to the cards next to it, so they match the installed version) and on the
 * docs site (absolute links).
 */

/** PrimeNG tags that no longer exist, with the ExhaustiveUI replacement. Every replacement is checked against the manifest. */
export const PRIMENG_RENAMES = [
    { from: '<p-dropdown>', to: '<p-select>', check: ['p-select'] },
    { from: '<p-calendar>', to: '<p-date-picker>', check: ['p-date-picker'] },
    { from: '<p-inputSwitch>', to: '<p-toggle-switch>', check: ['p-toggle-switch'] },
    { from: '<p-overlayPanel>', to: '<p-popover>', check: ['p-popover'] },
    { from: '<p-sidebar>', to: '<p-drawer>', check: ['p-drawer'] },
    { from: '<p-chips>', to: '<p-auto-complete [multiple]="true" [typeahead]="false">', check: ['p-auto-complete'] },
    {
        from: '<p-tabView> and <p-tabPanel header="…">',
        to: '<p-tabs value="0"> with <p-tab-list><p-tab value="0">…</p-tab></p-tab-list> and <p-tab-panels><p-tab-panel value="0">…</p-tab-panel></p-tab-panels>',
        check: ['p-tabs', 'p-tab-list', 'p-tab', 'p-tab-panels', 'p-tab-panel']
    },
    {
        from: '<p-accordionTab header="…">',
        to: '<p-accordion-panel value="0"> with <p-accordion-header>…</p-accordion-header> and <p-accordion-content>…</p-accordion-content>',
        check: ['p-accordion-panel', 'p-accordion-header', 'p-accordion-content']
    },
    { from: '<p-messages>', to: '<p-message>', note: 'one per message', check: ['p-message'] }
];

/** Throws when a replacement tag is not a selector of the library, so the guide never names a tag that does not exist. */
export function checkRenames(manifest) {
    const selectors = new Set(manifest.entryPoints.flatMap((e) => (e.declarations ?? []).flatMap((d) => d.selector.split(',').map((s) => s.trim()))));
    const missing = PRIMENG_RENAMES.flatMap((r) => r.check).filter((s) => !selectors.has(s));
    if (missing.length) throw new Error(`AGENTS.md names selectors that do not exist: ${missing.join(', ')}`);
}

/**
 * @param {{ version: string, cards: { name: string, title: string, description: string }[], cardLink: (name: string) => string, docsLink: (path: string) => string }} options
 */
export function renderAgentsMd({ version, cards, cardLink, docsLink }) {
    const major = version.split('.')[0];
    const lines = [
        `# ExhaustiveUI ${version}: guide for AI coding agents`,
        '',
        `This project uses ExhaustiveUI (\`@exhaustive-ui/core\` ${version}), an Angular ${major} component library forked from PrimeNG v21. Its API is close to PrimeNG but not the same: read this file, then the card of each component you use, before writing code.`,
        '',
        '## Rules',
        '',
        `1. **Read the component card first.** Each card (index below) gives the import, the tag, the inputs, the outputs and every template with the exact context it receives, for the installed version. Do not rely on what you remember of PrimeNG.`,
        "2. **Imports come from `@exhaustive-ui/core/<entry>`**, one entry point per component: `import { Select } from '@exhaustive-ui/core/select';`. Never `primeng/...`. Components are standalone: add them to the `imports` of your component.",
        '3. **Write the canonical kebab-case tag**: `<p-date-picker>`, `<p-toggle-switch>`, `<p-auto-complete>`. The camelCase spellings (`<p-datePicker>`) still work but are legacy. Directives are attributes: `pButton`, `pInputText`, `pTooltip`.',
        '4. **Templates are `<ng-template #name let-…>` inside the component**, with the name exactly as the card lists it (case sensitive). `$implicit` is read with a bare `let-x`, the other keys with `let-x="key"`. `pTemplate="name"` still works but is legacy.',
        '5. **Inputs are signals.** In templates nothing changes. In TypeScript, on a component instance, read an input with a call (`table.first()`), and write a two-way property with `.set()`.',
        '6. **Components use OnPush** (except Table, TreeTable and DynamicDialog): give them new arrays and objects, or signals, instead of mutating the bound data.',
        '7. **`styleClass` is gone** on most components: use `class`. Styling goes through `class`, design tokens (`dt`) or pass through (`pt`).',
        '8. **Check your code** with `npx -y @exhaustive-ui/mcp check` (all templates under `src/`) after writing or changing templates, and fix what it reports: unknown inputs and outputs, PrimeNG tags and imports, removed v22 inputs.',
        '',
        '## Setup',
        '',
        '```typescript',
        '// app.config.ts',
        "import { provideExhaustive } from '@exhaustive-ui/core/config';",
        "import Aura from '@exhaustive-ui/themes/aura';",
        '',
        'export const appConfig: ApplicationConfig = {',
        '    providers: [provideExhaustive({ theme: { preset: Aura } })]',
        '};',
        '```',
        '',
        'Icons: the `pi pi-*` classes, from `@openng/icons/openng-icons.css` (not `primeicons`). Themes come from `@exhaustive-ui/themes` (not `@primeuix/themes`).',
        '',
        '## If you know PrimeNG',
        '',
        '| PrimeNG | ExhaustiveUI |',
        '| --- | --- |',
        "| `import … from 'primeng/button'` | `import … from '@exhaustive-ui/core/button'` |",
        '| `providePrimeNG()`, `PrimeNG` service, `PrimeIcons` | `provideExhaustive()`, `Exhaustive`, `OpenngIcons` |',
        '| `@primeuix/themes/aura` | `@exhaustive-ui/themes/aura` |',
        '| `styleClass="…"` | `class="…"` |',
        ...PRIMENG_RENAMES.map((r) => `| \`${r.from}\` | \`${r.to}\`${r.note ? `, ${r.note}` : ''} |`),
        '',
        '## Tools',
        '',
        '- **MCP server**: `npx -y @exhaustive-ui/mcp` (for Claude Code: `claude mcp add exhaustive-ui -- npx -y @exhaustive-ui/mcp`). Search, component cards, complete examples and `validate_usage`.',
        `- **Full documentation** of a component, with every example: ${docsLink('llms/components/<name>.md')}. Guides and index: ${docsLink('llms/llms.txt')}.`,
        '',
        '## Components',
        '',
        ...cards.map((c) => `- [${c.title.replace(/^Angular\s+|\s+(Component|Directive)$/g, '')}](${cardLink(c.name)}): ${c.description}`),
        ''
    ];
    return lines.join('\n');
}
