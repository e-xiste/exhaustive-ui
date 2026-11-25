<div align="center">

<img src="https://exhaustive-ui.com/large-icon.svg" alt="ExhaustiveUI" width="140" />

# ExhaustiveUI

**80+ accessible Angular UI components under the MIT license, rebuilt on Signals for Angular 22.**

A community-maintained continuation of PrimeNG & Optimus UI, built to stay open.

[![npm](https://img.shields.io/npm/v/@exhaustive-ui/core.svg?color=%23000)](https://www.npmjs.com/package/@exhaustive-ui/core)
[![license](https://img.shields.io/badge/license-MIT-black.svg)](LICENSE.md)
[![angular](https://img.shields.io/badge/angular-22-black.svg)](https://angular.dev)
[![CI](https://github.com/e-xiste/exhaustive-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/e-xiste/exhaustive-ui/actions/workflows/ci.yml)

[Documentation](https://exhaustive-ui.com) · [Getting started](https://exhaustive-ui.com/installation) · [Migrate from PrimeNG](https://exhaustive-ui.com/migration/primeng) · [Roadmap](https://exhaustive-ui.com/roadmap) · [FAQ](https://exhaustive-ui.com/faq)

</div>

---

## What ExhaustiveUI brings

ExhaustiveUI takes the last MIT-licensed PrimeNG codebase (v21, by way of Optimus UI) and keeps it alive on current Angular, in the open.

- **Angular 22, and every Angular major after it.** Each ExhaustiveUI major follows Angular's, and `ng update` migrates your code from one to the next.
- **Full Signals.** Every component and directive uses `input()`, `model()`, `output()`, `computed()` and signal queries. No `@Input`, `@Output` or `@ViewChild` is left, and the form components work with Signal Forms.
- **Modern Angular.** Standalone components, `OnPush` change detection and the built-in `@if` / `@for` control flow, tested without zone.js. Option lists, menus and paginators reuse their rows instead of recreating them.
- **Close to 400 inherited bugs fixed.** Bug reports carried over from PrimeNG v21 and Optimus UI were reproduced in a real browser and fixed, each code fix with a regression test. The suite runs about 8,800 unit tests on every change.
- **A cleaner API, migrated for you.** Inputs that were deprecated or did nothing are gone, names are consistent across components, and nine `ng update` migrations rewrite your templates and code, then list what they left for review.
- **One command to switch.** The `migrate-from-primeng` and `migrate-from-optimus` schematics swap the packages, rewrite the imports, the configuration API and the CSS layer, and report anything left.
- **Tailwind CSS 4**, alongside v3: theme colors and animation utilities from a single `@import`, and a `migrate-from-primeflex` schematic.
- **Built for coding agents.** An MCP server and an agent skill give Claude Code, Cursor or Codex the real ExhaustiveUI API instead of their memory of PrimeNG, with a validator that names the replacement of every removed input.
- **MIT, for good.** No paid tier, no license key, no telemetry. Packages are published with npm provenance.

## Quick start

ExhaustiveUI v22 requires Angular v22: its major versions follow Angular's (see the [version compatibility table](https://exhaustive-ui.com/migration/update#angular-compatibility)). In an Angular v22 workspace, run:

```bash
ng add @exhaustive-ui/core
```

The schematic asks which theme preset you want, adds the packages, wires `provideExhaustive` into your root providers and installs everything. It also offers to set up your AI coding tools with the MCP server and the library's guide.

```ts
import { Button } from '@exhaustive-ui/core/button';
```

```html
<p-button label="Check" />
```

Full setup, including the manual path and icons, is in the [getting started guide](https://exhaustive-ui.com/installation).

## Coming from PrimeNG or Optimus UI

Selectors, CSS classes, design tokens and theme presets are the same, so most applications switch with a schematic, then the v22 migrations.

From **PrimeNG v21** ([guide](https://exhaustive-ui.com/migration/primeng)):

```bash
ng update @angular/core@22 @angular/cli@22 --force   # PrimeNG v21 declares Angular 21 as a peer
npm install @exhaustive-ui/core --legacy-peer-deps   # npm refuses the Angular CDK 22 while primeng is installed
ng generate @exhaustive-ui/core:migrate-from-primeng
ng update @exhaustive-ui/core --migrate-only --from=3.0.0
```

From **Optimus UI v2** ([guide](https://exhaustive-ui.com/migration/optimus)):

```bash
npm install @exhaustive-ui/core
ng generate @exhaustive-ui/core:migrate-from-optimus
ng update @exhaustive-ui/core --migrate-only --from=3.0.0
```

Each schematic swaps the packages, rewrites the imports, the configuration API (`providePrimeNG`, `provideOptimus`...) and the CSS layer, then reports what it could not handle, with file and line numbers. `ng add` does not migrate: it sets up new projects only, and refuses a PrimeNG or Optimus UI workspace. On PrimeNG v20 or older, upgrade to v21 first.

## What changes in v22

Templates bind as before (`[name]`, `[(name)]`, `(name)`). What changes is code that reaches into a component instance, and data mutated in place:

- inputs are signal inputs and two-way properties are `model()` signals: code that holds a component instance reads `table.selection()` and writes `drawer.visible.set(true)` instead of assigning;
- components use `OnPush` change detection (except Table, TreeTable and DynamicDialog), so pass them new arrays and objects rather than mutating bound data;
- inputs that were deprecated or had no effect are gone: `styleClass` becomes the native `class` attribute on most components, and aliases such as Drawer's `showCloseIcon` (now `closable`) are removed.

The [migration guide to v22](https://exhaustive-ui.com/migration/v22) covers each change and each case the migrations report. Every change is listed in the [changelog](CHANGELOG.md).

## Packages

| Package | What it is |
| --- | --- |
| [`@exhaustive-ui/core`](packages/core) | The components, directives and services. The only package most applications install directly. |
| [`@exhaustive-ui/themes`](packages/themes) | Built-in theme presets — Aura, Material, Lara and Nora. |
| [`@exhaustive-ui/styled`](packages/styled) | The styled-mode theming engine that turns presets into CSS variables. |
| [`@exhaustive-ui/styles`](packages/styles) | Base styles shared by the components. |
| [`@exhaustive-ui/tailwindcss`](packages/tailwindcss) | Tailwind CSS plugin, for both v3 and v4. |
| [`@exhaustive-ui/locale`](packages/locale) | i18n locale definitions. |
| [`@exhaustive-ui/motion`](packages/motion) | Animation and transition utilities. |
| [`@exhaustive-ui/utils`](packages/utils) | Shared helpers used across the packages. |
| [`@exhaustive-ui/mcp`](packages/mcp) | MCP server that gives coding agents the documentation, the compiled API and a template validator. |

Components ship their own SVG icons. [`@openng/icons`](https://www.npmjs.com/package/@openng/icons) is optional: install it for the `pi pi-*` icon classes the documentation examples use.

## Coding agents

Several ways to give an agent (Claude Code, Cursor, Codex, ...) the real ExhaustiveUI API instead of its memory of PrimeNG:

- the MCP server: `npx @exhaustive-ui/mcp` (see [its README](packages/mcp));
- the agent skill, an offline copy of the docs: `npx skills add https://exhaustive-ui.com`;
- the Claude Code plugin, a short skill and the MCP server together: `/plugin marketplace add e-xiste/exhaustive-ui`, then `/plugin install exhaustive-ui@exhaustive-ui`;
- the documentation as Markdown: [`llms.txt`](https://exhaustive-ui.com/llms.txt), and `.md` after the address of any page.

To start a new application with all of it in place: `npx tiged e-xiste/exhaustive-ui/templates/angular my-app` (see [the template](templates/angular)).

## Why this exists

In June 2026 PrimeTek moved future major versions of PrimeNG, starting with v22, to a commercial license, and the repository of the MIT versions now receives security fixes only — [their announcement explains why](https://primeui.dev/nextchapter). [Optimus UI](https://github.com/openng-org/optimus-ui), maintained by OpenNG, picked up PrimeNG v21, the last MIT licensed version, and kept it open.

ExhaustiveUI is a fork of Optimus UI, maintained by [e-xiste](https://e-xiste.com) and the community. It exists to ship fixes and releases at a steadier pace, starting from Optimus UI's `next` branch and its migration of every component to the Angular Signals API. It stays MIT. There is no paid tier and none is planned.

It is not affiliated with, endorsed by, or sponsored by PrimeTek or OpenNG. The [philosophy page](https://exhaustive-ui.com/philosophy) sets out what the project commits to and — just as importantly — what it does not do.

## Requirements

- Angular v22
- RxJS v7.8.1 or newer

## Contributing

Issue triage, reproductions, pull requests and documentation fixes are all welcome, including contributions written with AI coding agents, on the same terms as any other: you understand the change, it is scoped, and it comes with tests. Fixes landed upstream in Optimus UI are ported here too; [CONTRIBUTING.md](CONTRIBUTING.md) explains how, with the rebranding script that keeps the two codebases in step.

```bash
pnpm install     # dependencies + git hooks
pnpm run dev     # run the documentation site locally
```

The [contribution guide](https://exhaustive-ui.com/contribution) covers the workflow, and the [roadmap](https://exhaustive-ui.com/roadmap) covers what is planned.

## Support

Community only — there is no SLA and no commercial support. [Issues](https://github.com/e-xiste/exhaustive-ui/issues) for bugs, [Discussions](https://github.com/e-xiste/exhaustive-ui/discussions) for questions.

## License

[MIT](LICENSE.md). Forked from Optimus UI, itself forked from PrimeNG v21, both published under the same license, with the original copyright notices intact. PrimeNG, PrimeFaces, PrimeReact, PrimeVue and PrimeFlex are trademarks of PrimeTek. Optimus UI and OpenNG are names of the OpenNG project.
