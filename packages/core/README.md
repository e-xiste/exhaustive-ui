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

Please note that ExhaustiveUI requires **Angular 21+**. 

`ng add` only sets up new projects — on a workspace that already uses PrimeNG it makes no changes
and points you to the migration schematic below.

## Migrating from PrimeNG

ExhaustiveUI is API-compatible with PrimeNG v21. On a PrimeNG v21 workspace, run the dedicated
migration schematic:

```bash
ng generate @exhaustive-ui/core@1:migrate-from-primeng          # options: --skip-install, --force
```

This replaces `primeng` and `@primeuix/*` dependencies with their `@exhaustive-ui` counterparts, rewrites
TypeScript imports (`primeng/button` → `@exhaustive-ui/core/button`, `@primeuix/themes/aura` →
`@exhaustive-ui/themes/aura`), and renames the config API (`providePrimeNG` → `provideExhaustive`,
`PrimeNG` → `Exhaustive`, `PrimeNGConfigType` → `ExhaustiveConfigType`). Anything it cannot migrate is
listed as a warning for manual review.

Projects on PrimeNG v20 or older: upgrade to PrimeNG v21 first, then migrate.


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
