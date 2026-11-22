<div align="center">
  <img src="https://exhaustive-ui.com/large-icon.svg" alt="ExhaustiveUI" width="140" />

  <h1>ExhaustiveUI</h1>
  <p><strong>A rich set of open-source UI Components for Angular</strong></p>

  <p>
    <a href="https://www.npmjs.com/package/@exhaustive-ui/core">
      <img src="https://img.shields.io/npm/v/@exhaustive-ui/core.svg" alt="npm version">
    </a>
    <a href="https://www.npmjs.com/package/@exhaustive-ui/core">
      <img src="https://img.shields.io/npm/dm/@exhaustive-ui/core.svg" alt="npm downloads">
    </a>
    <a href="https://github.com/e-xiste/exhaustive-ui/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/@exhaustive-ui/core.svg" alt="License">
    </a>
  </p>
</div>

---

ExhaustiveUI is a comprehensive library of open-source UI Components for Angular applications. Designed for flexibility and enterprise-readiness, it provides a powerful foundation for building modern web interfaces.

## 📦 Installation

ExhaustiveUI provides an Angular CLI schematic for quick and easy installation in a new project. Run:

```bash
ng add @exhaustive-ui/core
```

This installs the library and wires `provideExhaustive({ theme: { preset: Aura } })` into your
application config (pick a different preset with `--theme Lara|Material|Nora`).

ExhaustiveUI v22 requires **Angular 22**: its major versions follow Angular's.

`ng add` only sets up new projects — on a workspace that already uses PrimeNG it makes no changes
and points you to the migration schematic below.

## Migrating from PrimeNG

ExhaustiveUI is API-compatible with PrimeNG v21. On a PrimeNG v21 workspace updated to Angular 22, run the
dedicated migration schematic:

```bash
npm install @exhaustive-ui/core
ng generate @exhaustive-ui/core:migrate-from-primeng          # options: --skip-install, --force
ng update @exhaustive-ui/core --migrate-only --from=3.0.0      # apply the v22 migrations below
```

This replaces `primeng` and `@primeuix/*` dependencies with their `@exhaustive-ui` counterparts, rewrites
TypeScript imports (`primeng/button` → `@exhaustive-ui/core/button`, `@primeuix/themes/aura` →
`@exhaustive-ui/themes/aura`), and renames the config API (`providePrimeNG` → `provideExhaustive`,
`PrimeNG` → `Exhaustive`, `PrimeNGConfigType` → `ExhaustiveConfigType`). Anything it cannot migrate is
listed as a warning for manual review.

Projects on PrimeNG v20 or older: upgrade to PrimeNG v21 first, then migrate. The [PrimeNG migration guide](https://exhaustive-ui.com/migration/primeng) covers each step; Optimus UI v2 projects follow the [Optimus UI migration guide](https://exhaustive-ui.com/migration/optimus).

## Updating to v22

v22 moves the library to the Angular Signals API. Templates bind as before, but code holding a component
instance reads inputs as signals (`table.selection()`) and writes two-way properties with `.set()`
(`drawer.visible.set(true)`). Components use `OnPush` change detection (except Table, TreeTable and
DynamicDialog), and inputs that were deprecated or had no effect are removed: `styleClass` becomes the
native `class` attribute on most components, Drawer's `showCloseIcon` becomes `closable`, and so on.

```bash
ng update @angular/core@22 @angular/cli@22
ng update @exhaustive-ui/core@22
```

`ng update` rewrites the affected templates and lists what it left for review. See the
[migration guide to v22](https://exhaustive-ui.com/migration/v22).


## 🚀 Quick Start

ExhaustiveUI components can be imported as standalone components or via their respective modules. Here is a quick example demonstrating how to use the `Button` component:

1. Import the component module in your application:

```typescript
import { Component } from '@angular/core';
import { ButtonModule } from '@exhaustive-ui/core/button';

@Component({
  selector: 'app-root',
  imports: [ButtonModule],
  template: `<p-button label="Click Me!" />`
})
export class AppComponent {}
```

## 📖 Documentation

For detailed documentation, interactive component demos, theming guides, and more, please visit the official website:

**[ExhaustiveUI Documentation](https://exhaustive-ui.com/)**


## 🤝 Contributing

We welcome and appreciate contributions from the community! If you're interested in helping improve ExhaustiveUI, please take a look at our [Contributing Guide](https://github.com/e-xiste/exhaustive-ui/blob/main/CONTRIBUTING.md) for instructions on how to get started.

## 📄 License

ExhaustiveUI is licensed under the [MIT License](https://github.com/e-xiste/exhaustive-ui/blob/main/LICENSE.md).
