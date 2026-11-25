# Moving a PrimeNG 21 application to Angular 22

A real migration, with its numbers: sakai-ng, an admin template of 24 routes, from PrimeNG 21 to ExhaustiveUI 22 and Angular 22.

## The application

PrimeNG 22 is [no longer open source](https://primeui.dev/nextchapter). PrimeNG 21 stays MIT and still receives security fixes, but it declares Angular 21 as its
peer dependency. An application on PrimeNG 21 that wants Angular 22 can buy PrimeNG 22 or use its [Community license](https://primeui.dev/licenses/community) under
its conditions, move to [Optimus UI](https://github.com/openng-org/optimus-ui), the community fork, or move to ExhaustiveUI. The
[comparison](https://exhaustive-ui.com/comparison) helps to choose; this page shows the last one.

The application is [sakai-ng](https://github.com/primefaces/sakai-ng) 21.0.0, the MIT licensed admin template of PrimeTek: 77 source files, about 18,700 lines, 81
different `p-*` tags, and 37 files that mention PrimeNG. It was migrated on 2026-11-25 to ExhaustiveUI 22.9.0. ExhaustiveUI is our library, so check what matters to you.

## The commands

Start from a clean working tree, with a build that passes.

```bash
ng update @angular/core@22 @angular/cli@22 --force
npm install @exhaustive-ui/core@22 --legacy-peer-deps
ng generate @exhaustive-ui/core:migrate-from-primeng
ng update @exhaustive-ui/core --migrate-only --from=3.0.0
```

`--force` and `--legacy-peer-deps` are there for the same reason: PrimeNG 21 wants Angular 21, and it is still installed at that point. The third command removes it. The
[migration guide](https://exhaustive-ui.com/migration/primeng) details each step; it lacked the second flag until this migration.

## What happened

- **migrate-from-primeng** changed 38 files: imports, `providePrimeNG`, the theme import, the Tailwind CSS plugin, the icon font.
- **Its report** listed 32 references in 11 files to review: links to the images of PrimeTek, file names and texts that say PrimeNG, and one variable name. None had to change for the build.
- **The v22 migrations** changed 7 files: 28 `styleClass` became `class`.
- **The build failed once**, and not because of the library: TypeScript 6, which comes with Angular 22, stops on the `baseUrl` option. One line in `tsconfig.json` fixed it.

Both versions were then built, and their 24 routes opened in Chrome. The visible text has the same length on every route, the heights of the pages differ by one pixel at most, and the console shows no JavaScript error. The select, the
multi select, the autocomplete, the date picker, the column filter, and the create and delete dialogs of the CRUD page give the same results.

The initial bundle went from 1.75 MB to 1.85 MB, uncompressed. That includes the move to Angular 22, so the part of the library is not known.

## What another application may have to change

sakai-ng calls methods on its component instances, such as `dt.filterGlobal()`, but reads and writes none of their inputs. An application that does has more to change.

Component instances have signals. A template binds as before; code that holds an instance does not:

```typescript
// Before
this.table.first = 0;

// After, with a viewChild() query
this.table().first.set(0);
```

Components are OnPush, except Table, TreeTable and DynamicDialog. A list changed in place is no longer seen:

```typescript
// Before
this.options.push(option);

// After
this.options = [...this.options, option];
```

The paths of the modules in mocks, such as `vi.mock('primeng/button')`, are in the report. The [guide to v22](https://exhaustive-ui.com/migration/v22) lists the rest.

## Checking the templates

```bash
npx -y @exhaustive-ui/mcp check
```

On sakai-ng, it found two mistakes that the PrimeNG version already had: a `display` attribute that AutoComplete does not have, and an `#option` template that OrderList ignores. It also reported six inputs of
`routerLink` by mistake, which is fixed in 22.9.1.

