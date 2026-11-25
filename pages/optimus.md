# Migrating from Optimus UI

Moving an Optimus UI v2 application to ExhaustiveUI: package and configuration API renames, the CSS layer name, then the v22 migrations.

## Overview

ExhaustiveUI is a fork of Optimus UI, itself the MIT continuation of PrimeNG v21. An Optimus UI v2 application already runs on Angular 22 and uses the same components, selectors, CSS classes, design tokens and
`@openng/icons` icons. Moving it across takes two steps:

1. **The rename**: the `@openng/optimus-ui*` packages become `@exhaustive-ui/*`, and the four names of the configuration API change. The `migrate-from-optimus` schematic does it.
2. **The v22 changes**: the Signals API everywhere, OnPush and the API cleanup of ExhaustiveUI v22. The `ng update` migrations do most of it, and the [migration guide to v22](https://exhaustive-ui.com/migration/v22) covers the rest.

## Before you start

- **Optimus UI v2 on Angular 22.** An application still on Optimus UI v1 updates to v2 first, following Optimus UI's documentation.
- **A clean git working tree**, so the rename and the migrations can be reviewed on their own, and a build and test run that passes before you start.

## Migration steps

1. Install ExhaustiveUI and run the `migrate-from-optimus` schematic. It rewrites the workspace, then installs the new dependencies.
2. Run the v22 migrations. The workspace did not go through `ng update`, so they are run explicitly, from the version before v22.
3. Read both reports, fix the compiler errors, then build and run your tests.

```bash
npm install @exhaustive-ui/core@22
ng generate @exhaustive-ui/core:migrate-from-optimus
ng update @exhaustive-ui/core --migrate-only --from=3.0.0
```

The schematic checks that `@openng/optimus-ui` v2 is installed. It takes two options: `--skip-install` leaves the install to you, and `--force` skips the version check. Like `ng update`, run it on a clean
working tree so its changes can be reviewed with `git diff`.

## What the schematic changes

The schematic visits every file of the workspace except `node_modules`, build output and the files your `.gitignore` excludes.

### Dependencies

In every `package.json` of the workspace, each package is replaced by its counterpart, which has the same content and the same subpaths:

- `@openng/optimus-ui` becomes `@exhaustive-ui/core`
- `@openng/optimus-ui-themes`, `-tailwindcss`, `-locale`, `-styled`, `-styles`, `-utils` and `-motion` become `@exhaustive-ui/themes`, `tailwindcss`, `locale`, `styled`, `styles`, `utils` and `motion`
- `@openng/icons` stays: ExhaustiveUI uses the same icon set.

### TypeScript

Imports, dynamic imports and `require()` calls are rewritten, subpaths included (`@openng/optimus-ui/button` becomes `@exhaustive-ui/core/button`), and so is the Tailwind CSS configuration file. The
configuration API is renamed where it is imported from Optimus UI, along with every use in the file: `provideOptimus` becomes `provideExhaustive`, the `Optimus` service becomes `Exhaustive`,
`OptimusConfigType` becomes `ExhaustiveConfigType` and `OPTIMUS_CONFIG` becomes `EXHAUSTIVE_CONFIG`. A class of your own that happens to be named `Optimus` is left alone.

```typescript
// Before
import { ApplicationConfig } from '@angular/core';
import { provideOptimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [provideOptimus({ theme: { preset: Aura } })]
};

// After
import { ApplicationConfig } from '@angular/core';
import { provideExhaustive } from '@exhaustive-ui/core/config';
import Aura from '@exhaustive-ui/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [provideExhaustive({ theme: { preset: Aura } })]
};
```

### Stylesheets and angular.json

`@import`, `@use`, `@plugin` and `url()` references in stylesheets, and the `styles` and `scripts` entries of `angular.json` and `project.json`, follow the new package names.

### The report

The schematic ends with the places that still mention `optimus-ui`, `Optimus`, `provideOptimus`, `OptimusConfigType` or `OPTIMUS_CONFIG`, with the file and line: templates, Markdown, comments, or module paths
passed to other functions, such as `jest.mock()`. Lockfiles are left out, since the install regenerates them.

## CSS layer

Optimus UI puts its styles in a CSS cascade layer named `optimus` when the theme enables `cssLayer`; ExhaustiveUI names it `exhaustive`. The schematic renames the `optimus` token in the `cssLayer`
`name` and `order` of your configuration, then the matching `@layer` declarations and `@import ... layer()` clauses in your stylesheets, so your overrides keep their place in the layer order. With
`cssLayer: true`, the configuration does not change, and only the stylesheets are renamed.

A layer of your own, with another name, is left as it is. The CSS classes (`p-button`...), the design tokens (`--p-primary-color`...) and the icon classes (`pi pi-check`...) do not change.

## v22 migrations

After `migrate-from-optimus`, run the v22 migrations. The workspace did not go through `ng update`, so they are run explicitly, from the version before v22:

```bash
ng update @exhaustive-ui/core --migrate-only --from=3.0.0
```

They rewrite the templates and code for the inputs, outputs and templates removed or renamed in v22, and for the configuration options that became signals or changed name, such as `inputStyle`, now `inputVariant`. They
report what they cannot rewrite. The [migration guide to v22](https://exhaustive-ui.com/migration/v22) then covers the code changes: signal inputs, `model()` and signal queries in every component, OnPush change
detection, and the behavior and type changes.

## Checklist

- No `@openng/optimus-ui*` package left in any `package.json`, and the report of `migrate-from-optimus` handled.
- `provideExhaustive`, `Exhaustive`, `ExhaustiveConfigType` and `EXHAUSTIVE_CONFIG` in place of the Optimus names.
- With a CSS layer configured, your overrides still apply.
- The v22 migrations run and their report handled.
- The application compiles and its tests pass, after the code changes of the migration guide to v22.

