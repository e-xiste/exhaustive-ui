<div align="center">

<img src="https://exhaustive-ui.com/large-icon.svg" alt="ExhaustiveUI" width="140" />

# ExhaustiveUI

**A community-maintained, MIT licensed suite of 80+ accessible Angular UI components.**

[![npm](https://img.shields.io/npm/v/@exhaustive-ui/core.svg?color=%23000)](https://www.npmjs.com/package/@exhaustive-ui/core)
[![license](https://img.shields.io/badge/license-MIT-black.svg)](LICENSE.md)
[![angular](https://img.shields.io/badge/angular-%3E%3D22-black.svg)](https://angular.dev)

[Documentation](https://exhaustive-ui.com) · [Getting started](https://exhaustive-ui.com/installation) · [Philosophy](https://exhaustive-ui.com/philosophy) · [FAQ](https://exhaustive-ui.com/faq)

</div>

---

## Why this exists

In June 2026 PrimeTek archived the PrimeNG repository and moved future major versions, starting with v22, to a commercial license — [their announcement explains why](https://primeui.dev/nextchapter). [Optimus UI](https://github.com/openng-org/optimus-ui), maintained by OpenNG, picked up PrimeNG v21, the last MIT licensed version, and kept it open.

ExhaustiveUI is a fork of Optimus UI, maintained by [e-xiste](https://e-xiste.com) and the community. It exists to ship fixes and releases at a steadier pace, starting from Optimus UI's `next` branch and its migration of every component to the Angular Signals API. It stays MIT. There is no paid tier and none is planned.

It is not affiliated with, endorsed by, or sponsored by PrimeTek or OpenNG. The [philosophy page](https://exhaustive-ui.com/philosophy) sets out what the project commits to and — just as importantly — what it does not do.

## Quick start

Check which Angular versions each ExhaustiveUI release supports in the [Angular version compatibility table](https://exhaustive-ui.com/installation#compatibility), then run:

```bash
ng add @exhaustive-ui/core
```

The schematic asks which theme preset you want, adds the packages, wires `provideExhaustive` into your root providers and installs everything.

```ts
import { Button } from '@exhaustive-ui/core/button';
```

```html
<p-button label="Check" />
```

Full setup, including the manual path and icons, is in the [getting started guide](https://exhaustive-ui.com/installation).

## Migrating from Optimus UI

The component selectors, inputs, CSS classes and theme presets are the same. Swap the packages and rewrite the imports:

| Optimus UI | ExhaustiveUI |
| --- | --- |
| `@openng/optimus-ui` | `@exhaustive-ui/core` |
| `@openng/optimus-ui-themes` | `@exhaustive-ui/themes` |
| `@openng/optimus-ui-styled` | `@exhaustive-ui/styled` |
| `@openng/optimus-ui-styles` | `@exhaustive-ui/styles` |
| `@openng/optimus-ui-tailwindcss` | `@exhaustive-ui/tailwindcss` |
| `@openng/optimus-ui-locale` | `@exhaustive-ui/locale` |
| `@openng/optimus-ui-motion` | `@exhaustive-ui/motion` |
| `@openng/optimus-ui-utils` | `@exhaustive-ui/utils` |

Then rename `provideOptimus` to `provideExhaustive`, the `Optimus` config service to `Exhaustive`, and `OptimusConfigType` to `ExhaustiveConfigType`. The default CSS cascade layer is named `exhaustive` instead of `optimus`; pass `cssLayer: { name: 'optimus' }` to the theme options if your stylesheets depend on the old name. `@openng/icons` is unchanged.

## Migrating from PrimeNG

`ng add` does not migrate an existing workspace. It sets up new projects only, and when it detects a `primeng` dependency it leaves your code untouched and fails with an error rather than reporting success. Use the `migrate-from-primeng` schematic instead: install the package so the Angular CLI can resolve it, then run the schematic. Packages are swapped, imports are rewritten, and you get a report of anything it could not handle automatically, with file and line numbers.

```bash
npm install @exhaustive-ui/core
ng generate @exhaustive-ui/core:migrate-from-primeng
```

Optimus UI's [migration guide](https://v1.optimus.openng.org/migration/primeng) covers the prerequisites and the manual cases; it applies as-is, with `@openng/optimus-ui` read as `@exhaustive-ui/core`. If you are on PrimeNG v20 or older, upgrade to v21 first.

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

Icons live in [`@openng/icons`](https://www.npmjs.com/package/@openng/icons) and are optional — components accept any icon through templating, but the documentation examples use the `pi pi-*` classes.

## Requirements

- Angular v22 or newer
- RxJS v7.8.1 or newer

## Contributing

Issue triage, reproductions, pull requests and documentation fixes are all welcome. Fixes landed upstream in Optimus UI are ported here too; [CONTRIBUTING.md](CONTRIBUTING.md) explains how, with the rebranding script that keeps the two codebases in step.

```bash
pnpm install     # dependencies + git hooks
pnpm run dev     # run the documentation site locally
```

The [contribution guide](https://exhaustive-ui.com/contribution) covers the workflow, and the [roadmap](https://exhaustive-ui.com/roadmap) covers what is planned.

## Support

Community only — there is no SLA and no commercial support. [Issues](https://github.com/e-xiste/exhaustive-ui/issues) for bugs, [Discussions](https://github.com/e-xiste/exhaustive-ui/discussions) for questions.

## License

[MIT](LICENSE.md). Forked from Optimus UI, itself forked from PrimeNG v21, both published under the same license, with the original copyright notices intact. PrimeNG, PrimeFaces, PrimeReact, PrimeVue and PrimeFlex are trademarks of PrimeTek. Optimus UI and OpenNG are names of the OpenNG project.
