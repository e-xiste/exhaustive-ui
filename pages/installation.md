# Installation

Setting up ExhaustiveUI in an Angular CLI project.

## Prerequisites

ExhaustiveUI v22 targets Angular v22. Any workspace created with the Angular CLI works, standalone or NgModule based.

- Angular v22, including `@angular/cdk`, `@angular/forms` and `@angular/router`; the form components work with template-driven forms, reactive forms and Signal Forms (`@angular/forms/signals`)
- RxJS v7.8.1 or newer
- A package manager of your choice — npm, yarn or pnpm

Already using PrimeNG? Do not follow this page. The [migration guide](https://exhaustive-ui.com/migration/primeng) covers moving an existing PrimeNG v21 workspace, once updated to Angular v22, across with the
`migrate-from-primeng` schematic, which is a separate command from the `ng add` below. On Optimus UI v2, follow the [Optimus UI migration guide](https://exhaustive-ui.com/migration/optimus) and its
`migrate-from-optimus` schematic instead.

## Angular Version Compatibility

Each ExhaustiveUI major targets a single Angular major. Install the version matching your workspace, and see the [update guide](https://exhaustive-ui.com/migration/update) when moving to a newer one.

## Install

The recommended way to add ExhaustiveUI to an Angular CLI workspace is a single command.

```bash
ng add @exhaustive-ui/core
```

The schematic asks which theme preset you want and which AI coding tools you use, if any, and then does the rest:

- adds `@exhaustive-ui/core` and `@exhaustive-ui/themes` to your dependencies
- wires `provideExhaustive` into your root providers with the chosen preset, in `app.config.ts` or your root NgModule
- for the AI coding tools you picked, adds the [MCP server](https://exhaustive-ui.com/llms) to their configuration and a section pointing to the ExhaustiveUI guide to their instructions, without touching what the files already contain
- installs the packages

Pass the answers up front to skip the prompts, or skip the install step if you want to run it yourself:

```bash
# Choose the preset without the prompt — Aura, Lara, Material or Nora
ng add @exhaustive-ui/core --theme=Lara

# Set up AI tools without the prompt — claude-code, cursor, gemini-cli, open-ai-codex, vscode or none
ng add @exhaustive-ui/core --ai=claude-code --ai=cursor

# Wire everything up but do not run the package install
ng add @exhaustive-ui/core --skip-install

# Target a specific project in a multi-project workspace
ng add @exhaustive-ui/core --project=admin
```

To start from an application that is already set up, with the instructions and the MCP server for coding agents, copy the template:

```bash
npx tiged e-xiste/exhaustive-ui/templates/angular my-app
cd my-app
npm install
npm start
```

If the schematic cannot find a providers array to update it prints the three manual steps instead of guessing, so nothing in your workspace is rewritten unexpectedly. If it detects an existing `primeng` or
`@openng/optimus-ui` dependency it changes nothing and fails with an error rather than reporting success, and points you at the `migrate-from-primeng` or `migrate-from-optimus` schematic, described in the
[PrimeNG](https://exhaustive-ui.com/migration/primeng) and [Optimus UI](https://exhaustive-ui.com/migration/optimus) migration guides. It does not run that schematic for you. The Angular CLI installs
`@exhaustive-ui/core` before the schematic runs, so the dependency stays in your `package.json` — the migration schematic needs it there.

## Download

Prefer to wire things up yourself? Install the packages from the [npm registry](https://www.npmjs.com/package/@exhaustive-ui/core) directly. The next section covers the provider
setup that `ng add` would have written for you.

```bash
# Using npm
npm install @exhaustive-ui/core @exhaustive-ui/themes

# Using yarn
yarn add @exhaustive-ui/core @exhaustive-ui/themes

# Using pnpm
pnpm add @exhaustive-ui/core @exhaustive-ui/themes
```

## Provider

Add `provideExhaustive` to the list of providers in your `app.config.ts` and use the `theme` property to configure a theme such as Aura.

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import Aura from '@exhaustive-ui/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [
        provideExhaustive({
            theme: {
                preset: Aura
            }
        })
    ]
};
```

## Icons

ExhaustiveUI components ship their own SVG icons, so an icon library is optional: install one only for the icons you add yourself, through an `icon` input or a template. Every example in this documentation uses the
`pi pi-{icon}` classes from [OpenNG Icons](https://exhaustive-ui.com/icons); install it if you want the demos to look the way they do here.

```bash
npm install @openng/icons
```

Then import the stylesheet, either from your global stylesheet or from the `styles` array in `angular.json`.

```scss
@import "@openng/icons/openng-icons.css";
```

## Verify

Verify your setup by adding a component such as Button. Each component can be imported and registered individually so that you only include what you use for bundle optimization. Import path is available in the documentation of the
corresponding component.

## Examples

Every example in this documentation opens in StackBlitz from the code toolbar above each demo, already wired up with the current version. The
[source repository](https://github.com/e-xiste/exhaustive-ui) is the reference for how the library itself is built and consumed.

## Next Steps

Once you have ExhaustiveUI up and running, we recommend exploring the following resources to gain a deeper understanding of the library.

- [Global configuration](https://exhaustive-ui.com/configuration)
- [Styled mode](https://exhaustive-ui.com/theming/styled) and [unstyled mode](https://exhaustive-ui.com/theming/unstyled)
- [Tailwind CSS integration](https://exhaustive-ui.com/tailwind)
- [Pass Through](https://exhaustive-ui.com/passthrough) for direct access to the underlying elements
- [Philosophy](https://exhaustive-ui.com/philosophy) — what this project promises, and what it does not
- [FAQ](https://exhaustive-ui.com/faq)

