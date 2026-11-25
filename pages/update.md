# Update ExhaustiveUI

Updating with ng update, Angular version compatibility, and a summary of what changes in v22.

## Overview

All `@exhaustive-ui/core` packages — the components, themes, locale definitions, Tailwind CSS plugin and their internal dependencies — are versioned and released together, so an update always moves the whole suite to a single
new version. ExhaustiveUI supports `ng update`, the Angular CLI's own update mechanism, which bumps every installed ExhaustiveUI package in one step and runs any automated code migrations shipped with the new version.

Major versions follow Angular's: when a new Angular major ships, a matching ExhaustiveUI major is released for it. Minor and patch releases stay within the same Angular major and are drop-in updates.

This page is about updating a project that already uses ExhaustiveUI. To move an existing workspace across, see the guides for
[PrimeNG](https://exhaustive-ui.com/migration/primeng) and [Optimus UI](https://exhaustive-ui.com/migration/optimus) instead.

## Updating

Run `ng update` without arguments at any time to list the updates available in your workspace, ExhaustiveUI included.

```bash
ng update
```

To update within the current major, pass the main package. The Angular CLI resolves the rest: `@exhaustive-ui/core` declares all its companion packages as a group, so every installed `@exhaustive-ui/*` package —
themes, locale, Tailwind CSS plugin and the internal runtime packages — is updated together and the suite cannot end up on mixed versions.

```bash
ng update @exhaustive-ui/core
```

Like any `ng update` run, the command expects a clean git working tree so its changes can be reviewed or reverted in isolation — commit or stash your work first.

## Angular Version Compatibility

Each ExhaustiveUI major targets a single Angular major.

To move to a new major, update Angular first — the [Angular update guide](https://angular.dev/update-guide) covers that step — then update ExhaustiveUI to the matching major by
passing the target version. For example, once Angular v23 and ExhaustiveUI v23 are out, from v22:

```bash
ng update @angular/core@23 @angular/cli@23
ng update @exhaustive-ui/core@23
```

Review the release notes of the target version for breaking changes before you start.

## Updating to v22

ExhaustiveUI v22 is the first major of the fork. It requires Angular 22 and moves the whole library to the Angular Signals API. Templates keep working as before; code that reaches into a component instance reads inputs with a call and
writes two-way properties with `.set()`, and components use OnPush change detection. `ng update` applies nine migrations to templates and code and reports what it left for review.

```bash
ng update @angular/core@22 @angular/cli@22
ng update @exhaustive-ui/core@22
```

The [migration guide to v22](https://exhaustive-ui.com/migration/v22) covers the update steps from an ExhaustiveUI prerelease, PrimeNG v21 or Optimus UI, each migration and its report, the code changes, and the behavior
and type changes.

## Release Notes

Every version is published with its notes on the [GitHub releases page](https://github.com/e-xiste/exhaustive-ui/releases), covering new features, fixes and any breaking changes or
manual steps a release requires. Check the notes for the target version before a major update.

