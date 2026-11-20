# Changelog

All notable changes to the `@exhaustive-ui/*` packages. They are released together under a single version. The major version follows the Angular major it supports.

Each version also has a [GitHub release](https://github.com/e-xiste/exhaustive-ui/releases). The [update guide](https://exhaustive-ui.com/migration/update) explains how to move between versions.

## 22.0.0 (in progress)

ExhaustiveUI v22 is the first major of the fork. It requires Angular 22 and moves the whole library to the Angular Signals API. The alphas below lead up to it. This section sums them up.

### Upgrade

```bash
ng update @angular/core@22 @angular/cli@22
ng update @exhaustive-ui/core --next
```

`ng update` rewrites your templates with five migrations. It reports anything it cannot rewrite safely, such as programmatic access or conflicting bindings, with the file and line.

- `styleclass-to-class`: `styleClass`/`[styleClass]` becomes `class`/`[class]` on the ~60 components whose deprecated `styleClass` was removed. These include Tag, Card, Select, Table, DatePicker and Panel.
- `renamed-inputs`: renames deprecated input aliases.
  - Drawer: `showCloseIcon` becomes `closable`.
  - Paginator: `dropdownAppendTo` becomes `appendTo`.
  - Password: `maxLength` becomes `maxlength`.
  - AutoComplete: `minLength` becomes `minQueryLength`.
  - TreeSelect: `containerStyleClass` and `containerStyle` become `class` and `style`.
  - TreeTable: `virtualRowHeight` becomes `virtualScrollItemSize`.
- `remove-dead-inputs`: removes bindings of about sixty inputs that had already stopped doing anything. Examples are the old `*TransitionOptions`, `autoZIndex`/`baseZIndex` on sub menus, Table `frozenColumns`/`frozenWidth` and the ConfirmDialog aria labels.
- `remove-dead-outputs`: removes Overlay `onAnimationStart`/`onAnimationDone` and MenubarSub `menuFocus`/`menuBlur`/`menuKeydown`.
- `config-overlay-options-signal`: `Exhaustive.overlayOptions` is a signal. Assignments become `.set()` and reads become calls.

A workspace that just switched from PrimeNG (`migrate-from-primeng`) or from Optimus UI did not go through `ng update`. It runs the same migrations with:

```bash
ng update @exhaustive-ui/core --migrate-only --from=3.0.0
```

### Breaking changes

- **Angular 22 is required.** The peer dependencies are `^22.0.0`.
- **Signals API.** Every component and directive now uses `input()`, `model()`, `output()`, `computed()` and signal queries. No `@Input`, `@Output`, `@ViewChild` or `@ContentChild` decorator is left. Templates bind as before, but code holding a component instance must change:
  - Read inputs by calling them: `table.first()`, not `table.first`.
  - Write two-way properties with `.set()`: `drawer.visible.set(true)`.
  - Value plus change-event pairs became `model()`. This covers `first`, `rows` and `selection` on Table and TreeTable, and `visible` on Dialog and Galleria, among others. `[(x)]` keeps working.
- **OnPush change detection** for every component except Table, TreeTable and DynamicDialog. Those three stay Eager on purpose, because they render consumer objects mutated in place. Give OnPush components new arrays and objects, or signals, instead of mutating bound data.
- **Removed inputs and outputs**: see the migrations above.
- **TreeTable**: the selection change can fire once per intermediate step while a checkbox propagates.
- **ConfirmPopup**: an `accepticon`/`rejecticon` template now replaces the confirmation's `acceptIcon`/`rejectIcon` class instead of rendering next to it, as ConfirmDialog already did.

### Changes

- Built-in `@if` / `@for` / `@switch` control flow everywhere. No `*ngIf`, `*ngFor` or `ngSwitch` is left.
- Rows are reused instead of recreated when data is replaced, and the library no longer triggers any NG0955/NG0956 dev warning. This covers:
  - the option rows of Select, MultiSelect, Listbox and AutoComplete;
  - the menu items of TieredMenu, ContextMenu, Menubar, MegaMenu, PanelMenu, Menu and Breadcrumb;
  - the page links of Paginator;
  - the day, month and year cells of DatePicker.

### Fixes

- Galleria:
  - `pTemplate="item"` renders the main item.
  - `#ref` templates work alongside `pTemplate`s.
  - Thumbnail swipe works.
  - Autoplay stops on destroy.
- PickList: the "Move Bottom" label and icon are fixed, and `keepSelection` works when moving items left.
- OrderList: the filter is wired to the inner Listbox, so `onFilterEvent`, `filterMatchMode`, `ariaFilterLabel` and `resetFilter()` work.
- ConfirmDialog: `breakpoints` works.
- PanelMenu: Home/End keyboard navigation works.
- ContextMenu: the mobile class is applied.
- CascadeSelect:
  - `optionDisabled` and the group icon work in nested levels.
  - No hide timer runs after destroy.
- ToggleButton: `autofocus` works, and blur marks the control as touched.
- SelectButton: `autofocus` focuses the first option.
- Table: header cells of resizable columns can be dragged again to reorder columns, and reordering after a resize keeps every column's width instead of collapsing one to 0 (optimus-ui#187, #178).
- AutoFocus: the native `autofocus` attribute is only rendered when autofocus is on; p-button and the other components no longer carry it by default (optimus-ui#251).
- FilterService: the "Date is after" constraint no longer erases the time of the row's Date (optimus-ui#373).
- InputOtp: Tab, Enter and the other named keys keep working, so focus can leave the field and Enter submits the form (optimus-ui#340).
- Accordion: arrow, Home and End keys work again in inputs and textareas placed inside a panel (optimus-ui#608).
- Textarea: no longer crashes with an `NgControl` that has no `valueChanges`, as provided by Angular Signal Forms (optimus-ui#203).

### Tooling and documentation

- New package: `@exhaustive-ui/mcp`, an MCP server for coding agents. It serves the component API, the guides and the examples from the live documentation site. Its `validate_usage` tool checks templates and names the replacement of every input removed or renamed in v22. Its prompts include `update_to_v22`.
- The `exhaustive-ui` agent skill (`npx skills add https://exhaustive-ui.com`) describes the v22 conventions and bundles the update guide.
- The documentation moved to https://exhaustive-ui.com. The old exhaustive-ui.e-xiste.com redirects there.
- Packages are published with npm trusted publishing and carry provenance attestations.

## 22.0.0-alpha.9 (2026-11-20)

### Fixes

- Table: header cells of resizable columns can be dragged again to reorder columns, and reordering after a resize keeps every column's width instead of collapsing one to 0 (optimus-ui#187, #178).
- AutoFocus: the native `autofocus` attribute is only rendered when autofocus is on; p-button and the other components no longer carry it by default (optimus-ui#251).
- FilterService: the "Date is after" constraint no longer erases the time of the row's Date (optimus-ui#373).
- InputOtp: Tab, Enter and the other named keys keep working, so focus can leave the field and Enter submits the form (optimus-ui#340).
- Accordion: arrow, Home and End keys work again in inputs and textareas placed inside a panel (optimus-ui#608).
- Textarea: no longer crashes with an `NgControl` that has no `valueChanges`, as provided by Angular Signal Forms (optimus-ui#203).

## 22.0.0-alpha.8 (2026-11-20)

- `CONTRIBUTING.md` updated for v22: the v22 code conventions (signals only, OnPush, built-in control flow, migrations for removed or renamed inputs), what a user-visible change must update, the schematics, MCP and docs commands, and how releases are cut.

## 22.0.0-alpha.7 (2026-11-20)

- New `CHANGELOG.md` at the repository root, linked from the README: a summary of 22.0.0 and an entry for every published version.

## 22.0.0-alpha.6 (2026-11-20)

- MCP: `validate_usage` covers every input removed in v22: `styleClass` on all ~60 components and every dead input. A test checks the lists against the `ng update` migrations.
- READMEs updated for v22. The `@exhaustive-ui/core` README no longer pins `migrate-from-primeng` to `@1`.
- Documented `ng update @exhaustive-ui/core --migrate-only --from=3.0.0` for workspaces coming from PrimeNG or Optimus UI.

## 22.0.0-alpha.5 (2026-11-20)

- The agent skill describes v22: Angular 22, the Signals API, OnPush, built-in control flow and the removed inputs. It bundles the update guide.

## 22.0.0-alpha.4 (2026-11-20)

- MCP:
  - `validate_usage` names the replacement of inputs and outputs removed or renamed in v22.
  - New `update_to_v22` prompt.
  - `migrate_from_primeng` states the Angular 22 requirement.
- The update guide is published in the LLM docs (`get_guide("update")`).

## 22.0.0-alpha.3 (2026-11-20)

- The documentation site covers v22:
  - Angular 22 prerequisites;
  - an "Updating to v22" section in the update guide;
  - a new roadmap.
- `DynamicDialogConfig`: the deprecations of the two properties that had no effect are dated v22.0.0 instead of v3.0.0.

## 22.0.0-alpha.2 (2026-11-20)

- Breadcrumb, Menu and Paginator reuse their rows instead of recreating them. No NG0955/NG0956 warning is left in the library.

## 22.0.0-alpha.1 (2026-11-20)

- The documentation moved to https://exhaustive-ui.com, which `@exhaustive-ui/mcp` now reads by default.
- First release published with npm trusted publishing, with provenance attestations.

## 22.0.0-alpha.0 (2026-11-20)

- New version numbering: the ExhaustiveUI major matches the Angular major. This release succeeds 3.0.0-alpha.1. The 3.0.0 alphas are deprecated on npm.
- Peer dependencies accept every Angular 22 release (`^22.0.0`).
- Built-in control flow in the last 15 components that still used `*ngIf`/`*ngFor`.
- The icons, Inplace, Motion and `p-header`/`p-footer` are OnPush.
- Option rows, menu items and DatePicker cells are reused instead of recreated.
- ConfirmPopup icon templates take priority over the icon classes.

## 3.0.0-alpha.1 (2026-11-20, deprecated)

- The whole library runs on the Angular Signals API.
- New `renamed-inputs` migration.
- Galleria, PickList, OrderList, ConfirmDialog, PanelMenu, ContextMenu, CascadeSelect, ToggleButton and SelectButton fixes.
- New `@exhaustive-ui/mcp` package.

## 3.0.0-alpha.0 (2026-11-19, deprecated)

- First release of the fork: Optimus UI's `next` branch rebranded as ExhaustiveUI, published as `@exhaustive-ui/*`.
