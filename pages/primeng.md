# Migrating from PrimeNG

Moving a PrimeNG v21 application to ExhaustiveUI: the migrate-from-primeng schematic, what it changes (packages, imports, configuration API, icons, CSS layer), the manual checks and the v22 migrations.

## PrimeNG license change: your options

PrimeNG v21 is the last version published under the MIT license. From v22, PrimeTek distributes PrimeNG under its own commercial license, with a free Community tier for individuals and non-profits; see
[their announcement](https://primeui.dev/nextchapter) for the terms. Releases already published under MIT stay MIT.

An application on PrimeNG v21 has three ways forward:

- **Stay on PrimeNG v21.** Nothing to do today, but no more open source fixes, and no support for Angular 22 and later.
- **Move to PrimeNG v22 or later** under PrimeTek's license, if your organisation qualifies for the Community tier or buys a commercial license.
- **Move to an MIT fork of v21.** [Optimus UI](https://github.com/openng-org/optimus-ui) is the community fork; ExhaustiveUI forks Optimus UI and ships for Angular 22, with the components on Signals and close to 400 inherited bugs fixed. This guide covers the move to ExhaustiveUI; from Optimus UI, follow the [Optimus UI guide](https://exhaustive-ui.com/migration/optimus) instead.

## Overview

ExhaustiveUI is an MIT fork of PrimeNG v21, the last PrimeNG release published under the MIT license, by way of Optimus UI. The components, their selectors, the `p-*` CSS classes, the design tokens and the `pi pi-*` icon
classes are the same, so a PrimeNG v21 application moves across in two parts:

1. **The switch**: other package names, a configuration API named after ExhaustiveUI, another icon package and another default CSS layer name. The `migrate-from-primeng` schematic does it.
2. **The v22 changes**: Angular 22, the Signals API, OnPush and the API cleanup of ExhaustiveUI v22. The `ng update` migrations do most of it, and the [migration guide to v22](https://exhaustive-ui.com/migration/v22) covers the rest.

No license is needed. A PrimeTek license or subscription for PrimeNG, its templates or its theme designer does not carry over, and is not required.

## Before you start

- **PrimeNG v21.** ExhaustiveUI shares its API. On v20 or older, upgrade to v21 first with PrimeNG's own update guides; the schematic checks the installed version and stops otherwise. On PrimeNG v22, the schematic runs, but the features PrimeNG added after v21 have no ExhaustiveUI equivalent: check the compiler errors and the report.
- **A clean git working tree**, so every change can be reviewed and reverted on its own, and a build and test run that passes before you start.
- **PrimeFlex**, if the project uses it, is not migrated by this schematic. Run `migrate-from-primeflex` afterwards to move its classes to Tailwind CSS; the schematic reminds you when it finds PrimeFlex.

## Migration steps

1. Update Angular to 22. PrimeNG v21 declares Angular 21 as its peer dependency, so the Angular CLI refuses the update while `primeng` is installed: pass `--force`. The next step removes `primeng`.
2. Install ExhaustiveUI and run the `migrate-from-primeng` schematic. It rewrites the workspace, then installs the new dependencies.
3. Run the v22 migrations. The workspace did not go through `ng update`, so they are run explicitly, from the version before v22.
4. Read both reports, fix the compiler errors, then build and run your tests.

```bash
ng update @angular/core@22 @angular/cli@22 --force
npm install @exhaustive-ui/core@22
ng generate @exhaustive-ui/core:migrate-from-primeng
ng update @exhaustive-ui/core --migrate-only --from=3.0.0
```

The schematic takes two options: `--skip-install` leaves the install to you, and `--force` skips the PrimeNG version check.

## What the schematic changes

The schematic visits every file of the workspace except `node_modules`, build output and the files your `.gitignore` excludes.

### Dependencies

In every `package.json` of the workspace, including `overrides` and `resolutions`, each package is replaced by its counterpart:

- `primeng` becomes `@exhaustive-ui/core`
- `@primeuix/themes`, `@primeuix/styled`, `@primeuix/styles`, `@primeuix/utils` and `@primeuix/motion` become `@exhaustive-ui/themes`, `@exhaustive-ui/styled`, `@exhaustive-ui/styles`, `@exhaustive-ui/utils` and `@exhaustive-ui/motion`
- `tailwindcss-primeui` becomes `@exhaustive-ui/tailwindcss`
- `primelocale` becomes `@exhaustive-ui/locale`
- `primeicons` becomes `@openng/icons`

### TypeScript

Imports, dynamic imports and `require()` calls are rewritten, subpaths included (`primeng/button` becomes `@exhaustive-ui/core/button`, `@primeuix/themes/aura` becomes
`@exhaustive-ui/themes/aura`), and so is the Tailwind CSS configuration file. The configuration API is renamed where it is imported: `providePrimeNG` becomes `provideExhaustive`, the `PrimeNG` service becomes
`Exhaustive`, `PrimeNGConfigType` becomes `ExhaustiveConfigType`, and the `PrimeIcons` constants become `OpenngIcons`.

```typescript
// Before
import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [providePrimeNG({ theme: { preset: Aura } })]
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
`primeicons/primeicons.css` becomes `@openng/icons/openng-icons.css`; the `pi pi-*` classes in templates do not change.

### CSS cascade layer

When the theme sets `cssLayer`, the `primeng` layer becomes `exhaustive` in its `name` and `order`, `primeng-overwrites` becomes `exhaustive-overwrites`, and the matching
`@layer` declarations in your stylesheets are renamed too, so your overrides keep their place in the layer order. With `cssLayer: true`, the configuration does not change, and only the stylesheets are renamed.

### The report

The schematic ends with the places that still mention `primeng`, `primeicons`, `@primeuix`, `tailwindcss-primeui` or `primelocale`, with the file and line: templates, Markdown, JSON or code it does not
rewrite. Lockfiles are left out of the report, since the install regenerates them.

## Manual checks

Besides the places listed in the report, check these by hand:

- **The icon font name.** A stylesheet that names the font directly, as in `font-family: 'primeicons'`, now needs `'openng-icons'`. The schematic does not touch declaration values.
- **Local variables named after PrimeNG**, such as `primeng = inject(PrimeNG)`: the type is renamed, the variable name is yours to keep or change.
- **Module paths passed to other functions**, such as `jest.mock('primeng/button')` or `vi.mock()`: only imports, dynamic imports and `require()` are rewritten. These appear in the report.
- **Build and deployment files** outside the TypeScript sources and stylesheets: Dockerfiles, CI scripts, CDN links to PrimeNG or PrimeIcons.
- **PrimeTek products** such as templates or the theme designer are not part of ExhaustiveUI. A preset built with them is a plain `definePreset()` object and keeps working once its imports point to `@exhaustive-ui/themes`.

## What changes in v22

After the switch, the application runs on ExhaustiveUI v22, which differs from PrimeNG v21 in ways the compiler and your tests will show. The [migration guide to v22](https://exhaustive-ui.com/migration/v22)
details each of them:

- Inputs, two-way properties, outputs and queries are signals: code holding a component instance reads inputs with a call and writes two-way properties with `.set()`.
- Components use OnPush change detection, except Table, TreeTable and DynamicDialog: give them new arrays and objects, or signals, rather than mutating bound data.
- Deprecated and inactive inputs are removed or renamed, `styleClass` becomes `class` on most components; the v22 migrations rewrite these bindings and report the rest.
- Hundreds of bugs inherited from PrimeNG v21 are fixed, each with a regression test; a few of them change a visible behavior.

## Checklist

- Angular 22 installed, and no `primeng`, `@primeuix/*`, `primeicons`, `tailwindcss-primeui` or `primelocale` left in any `package.json`.
- The report of `migrate-from-primeng` handled, then the report of the v22 migrations.
- Icons render: the stylesheet is `@openng/icons/openng-icons.css` and nothing names the `primeicons` font.
- With a CSS layer configured, your overrides still apply: the `@layer` names match the theme's `cssLayer` order.
- The application compiles and its tests pass, after the code changes of the migration guide to v22.
- PrimeFlex, if used, migrated with `migrate-from-primeflex`.

