---
name: exhaustive-ui
description: Write, review, theme or migrate Angular code that uses ExhaustiveUI (@exhaustive-ui/core). Use for any p-* element or p* directive (p-button, p-table, p-select, p-dialog, pTooltip), imports from @exhaustive-ui/core or @exhaustive-ui/themes, design tokens and presets, and migrations from PrimeNG or Optimus UI to ExhaustiveUI.
---

# ExhaustiveUI

ExhaustiveUI is an MIT licensed Angular component library: 80+ accessible components built on Signals, forked from PrimeNG v21 by way of Optimus UI. Its majors follow Angular's: version 22 requires Angular 22. Its API is close to PrimeNG's, but not the same: look the API up instead of writing it from memory of PrimeNG.

Check first that the project uses it: `@exhaustive-ui/core` in `package.json`. A project that uses `primeng` or `@openng/optimus-ui` has another API; do not rewrite it to ExhaustiveUI unless the user asks for the migration.

## Where to read the API

Use the first source that is available:

1. **The installed package**, which matches the version of the project: read `node_modules/@exhaustive-ui/core/AGENTS.md`, then the card of each component in `node_modules/@exhaustive-ui/core/llms/cards/<name>.md` (import, tag, inputs, outputs, templates with their context, one example).
2. **The MCP server** `exhaustive-ui` (`npx -y @exhaustive-ui/mcp`): `search`, `get_component`, `get_example`, `get_guide`, `validate_usage`.
3. **The site**: `https://exhaustive-ui.com/llms/cards/<name>.md` for a card, `https://exhaustive-ui.com/llms/components/<name>.md` for every example and the full API, `https://exhaustive-ui.com/llms.txt` for the index and the guides.

Component names are the lowercase name without separators: `datepicker`, `inputnumber`, `treetable`.

## Rules

- Import from the entry point of the component, `import { Select } from '@exhaustive-ui/core/select'`, and add it to the `imports` of the standalone component. Never import from `primeng`.
- Write the kebab-case tags: `<p-date-picker>`, `<p-toggle-switch>`, `<p-auto-complete>`.
- Templates are `<ng-template #name let-item>` inside the component, with the exact name of the card (case sensitive).
- Inputs are signals: on a component instance in TypeScript, read `table.first()` and write a two-way property with `.set()`.
- Components use `OnPush`, except Table, TreeTable and DynamicDialog: bind new arrays and objects, or signals, instead of mutating them.
- `styleClass` is gone on most components: use `class`. Style with `class`, design tokens (`dt`) or pass through (`pt`).
- Configure the library once: `provideExhaustive({ theme: { preset: Aura } })` from `@exhaustive-ui/core/config`, with `Aura` from `@exhaustive-ui/themes/aura`.

## Tasks

- **New project**: `ng add @exhaustive-ui/core`.
- **From PrimeNG v21**, on Angular 22: `npm install @exhaustive-ui/core --legacy-peer-deps` (npm refuses the install otherwise, while `primeng` is there), then `ng generate @exhaustive-ui/core:migrate-from-primeng`, and work through its report. Guide: `https://exhaustive-ui.com/migration/primeng.md`.
- **From Optimus UI v2**: `ng generate @exhaustive-ui/core:migrate-from-optimus`. Guide: `https://exhaustive-ui.com/migration/optimus.md`.
- **Update**: `ng update @exhaustive-ui/core`. Guide: `https://exhaustive-ui.com/migration/update.md`.

After writing or changing templates, run `npx -y @exhaustive-ui/mcp check` and fix what it reports.
