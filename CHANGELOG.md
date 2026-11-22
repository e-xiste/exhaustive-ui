# Changelog

All notable changes to the `@exhaustive-ui/*` packages. They are released together under a single version. The major version follows the Angular major it supports.

Each version also has a [GitHub release](https://github.com/e-xiste/exhaustive-ui/releases). The [update guide](https://exhaustive-ui.com/migration/update) explains how to move between versions.

## 22.5.0 (2026-11-22)

A guide for AI coding agents and component cards shipped in the package, and a `check` command for templates.

### Features

- **AI coding agents:** `@exhaustive-ui/core` ships `AGENTS.md`, a guide for AI coding agents (rules, setup, the PrimeNG habits to drop), and a card per component in `llms/cards/`: import, canonical tag, the inputs the examples use, outputs, every template with the context it receives, one example. Agents read them from `node_modules`, for the installed version. Both are also published at `/llms/AGENTS.md` and `/llms/cards/<name>.md`, and `llms.txt` links to the cards.
- **mcp:** `get_component` returns the component card first. The Agent Skill bundles the cards.
- **mcp:** new `npx @exhaustive-ui/mcp check` command: validates every template of a project, with file and line (PrimeNG imports and tags with their replacement, unknown, miscased or deprecated inputs, invalid values, inputs removed in v22, template names the component does not have, legacy `pTemplate`). Exits with 1 on errors.

### Bug Fixes

- **mcp:** `validate_usage` knows the components documented on another page (InputIcon, InputGroupAddon, OverlayBadge, AvatarGroup, ButtonGroup...) and the `pBind`, `p-motion` and `pTemplate` directives, accepts the Angular signal forms and validator directives (`formField`, `minlength`, `maxlength`, `email`) and `let-` variables, and reports inputs written with the wrong case (`datakey`), which Angular does not bind.
- **manifest:** the templates of CellEditor, TreeTableCellEditor, TabList and TabPanel are listed.

### Documentation

- Examples fixed by the new check: the PickList filter example used a `#option` template that does not exist (`#item`); the Galleria examples bound `[(value)]` without a `valueChange` output; RadioButton examples bound a `label` input it does not have; InputNumber `spinnerMode`, Password `type` and FileUpload `label` were not inputs; the Checkbox "label" section, not shown on the site, described a `label` input that does not exist and is removed. A CI test runs the check on every example.

## 22.4.0 (2026-11-22)

Template contexts checked against the code, with the wrong ones fixed.

### Documentation

- **templates:** the context of every template is checked against what the component passes. Fixed:
    - Dialog and ConfirmDialog `#header` receive `ariaLabelledBy`, the id to put on your title (`DialogHeaderTemplateContext`, `ConfirmDialogHeaderTemplateContext`).
    - FileUpload `#file` receives the file with `index`, `count`, `first`, `last`, `even` and `odd` (`FileUploadFileTemplateContext`).
    - TreeTable `#body` receives the row node as `$implicit` (`TreeTableRowNode`: `node`, `parent`, `level`, `visible`), not the tree node; `#frozenbody`, `#loader` and the paginator templates have their contexts.
    - The `#paginatordropdownitem` templates of Table, TreeTable and DataView receive the dropdown option (`label` and `value`), not a number, and the DataView paginator state includes `totalRecords`.
    - Table `#groupheader` and `#groupfooter` have their own context (`TableRowGroupTemplateContext`), without `rowgroup` and `rowspan`.
    - BlockUI `#content`, Editor `#header`, Tabs `#previcon` and `#nexticon` and TabPanel `#content` receive no context (`void` instead of `any`).
- **tests:** a new CI test compares, for each template, the keys the component passes with its context type.

## 22.3.0 (2026-11-22)

Kebab case names for every component, and a template API reference read from the code.

### Features

- **naming:** every component element now has a kebab case name, `p-` followed by the name of the component with a hyphen between words (`p-date-picker`, `p-input-icon`, `p-tree-table`, `p-tab-list`, `p-sort-icon`…), listed first in its selector. The other spellings (`p-datePicker`, `p-datepicker`…) keep working. The new Naming Conventions guide states the rules for components, directives and templates.

### Documentation

- **api:** the Templates section of the API reference now lists the name written in `<ng-template #name>`, read from the code. It was derived from the property name, which gave wrong names (`disableddate` for `#disabledDate` on DatePicker, `checkboxicon` for `#icon` on Checkbox, `sourceheader` for `#sourceHeader` on PickList, `template` for `#message` on Toast…).
- **table, treetable:** their 29 and 26 templates are documented, with typed contexts (`TableBodyTemplateContext`, `TableColumnsTemplateContext`, `TableExpandedRowTemplateContext`…). Splitter `#panel`, OrganizationChart `#togglericon` and the CellEditor `#input` and `#output` templates are documented too.
- **types:** the `<Component>Templates` interfaces no longer list templates the components do not read (Chip `content`, DataView `gridicon` and `listicon`, MegaMenu `menuicon`, OrderList `clearicon`, TreeSelect `closeicon`), and Table `#headergrouped` now works as an `ng-template` reference, not only as `pTemplate`.
- **examples:** all the examples use the kebab case element names. This fixed three demos that rendered nothing: the DatePicker template demo used `p-calendar`, and two TreeTable demos misspelled `p-treeTableSortIcon` and `p-treeTableCellEditor`.
- **tests:** the CI now checks that every template of every component is documented under its real name, and that component and directive names follow the conventions.

## 22.2.0 (2026-11-22)

A new FileInput component to select, validate and upload files.

### Features

- **fileinput:** new `FileInput` component (`p-file`), next to `FileUpload`, which stays available. Files are added from the file picker, by drag and drop, folders included, or by pasting them. Each file is validated (`accept`, `minFileSize`, `maxFileSize`, `maxFiles`, `maxTotalSize`) and uploaded in its own request with its own progress, to an `url` or through an `uploadHandler`, at most `concurrency` at a time, with cancel and retry. Three variants: `list`, `images` (a grid of thumbnails with a cover) and `avatar`. It works with template-driven forms, reactive forms and Signal Forms, shows the files already on the server (`existing`), has `small` and `large` sizes, `dropzone` and `item` templates, replaceable texts through `labels`, and announces changes to screen readers. Theming through the new `fileinput` design tokens in the four presets.

### Documentation

- **fileinput:** documentation page with 16 sections, the API reference and the pass-through options. The API generator now handles function type aliases.

## 22.1.0 (2026-11-22)

A simpler design for SelectButton and ToggleButton.

### Theming

- **selectbutton, togglebutton:** a simpler design in all four presets. Options sit in a single outlined group, like the other form fields, and the selected option is filled with the primary color. Aura drops its grey track and raised thumb; Lara, Nora and Material replace the tinted highlight. Inside a SelectButton, the selected option now shows its border on both sides. To keep the previous look, override the `togglebutton` tokens in your preset (`checkedBackground`, `checkedColor`, `checkedBorderColor`).

## 22.0.1 (2026-11-22)

New `migrate-from-optimus` schematic, and migration guides from PrimeNG and from Optimus UI.

### Features

- New `migrate-from-optimus` schematic: `ng generate @exhaustive-ui/core:migrate-from-optimus` moves an Optimus UI v2 workspace to ExhaustiveUI. It swaps the `@openng/optimus-ui*` packages for their `@exhaustive-ui/*` counterparts (`@openng/icons` stays), rewrites imports, dynamic imports, `require()`, stylesheets and `angular.json`, renames `provideOptimus`, `Optimus`, `OptimusConfigType` and `OPTIMUS_CONFIG`, renames the `optimus` CSS layer in the configuration and the stylesheets, and reports what is left with the file and line. It shares its engine with `migrate-from-primeng`.
- `ng add` refuses an Optimus UI workspace, as it does a PrimeNG one, and points to `migrate-from-optimus`.

### Fixes

- `migrate-from-primeng` and `migrate-from-optimus`: with `cssLayer: true`, or a `cssLayer` without a `name`, the library's default layer (`primeng`, `optimus`) is renamed `exhaustive` in your stylesheets too, as ExhaustiveUI's default layer is.
- `ng add` no longer tells PrimeNG users to run `@exhaustive-ui/core@1:migrate-from-primeng`, a version that was never published.

### Documentation

- New [PrimeNG migration guide](https://exhaustive-ui.com/migration/primeng): the steps from PrimeNG v21 (including the `--force` the Angular 22 update needs while `primeng` is installed), everything `migrate-from-primeng` changes, the manual checks, and what changes in v22. It replaces the link to Optimus UI's archived guide, on the home page, in the menu and in the installation, FAQ and update pages, and is the page the schematic's report points to.
- New [Optimus UI migration guide](https://exhaustive-ui.com/migration/optimus): the steps with `migrate-from-optimus`, what it changes (packages, imports, configuration API, CSS layer), then the v22 migrations.
- Both guides are in the LLM docs (`get_guide("primeng")`, `get_guide("optimus")`) and the agent skill; the `migrate_from_primeng` MCP prompt follows them.
- Home page: Angular 22, Full Signals, Modern Angular and Tailwind CSS 4 features, and a "Migrate from Optimus UI" link next to "Migrate from PrimeNG". The installation and FAQ pages cover Optimus UI. The contribution guide and `CONTRIBUTING.md` welcome contributions written with AI coding agents.

## 22.0.0 (2026-11-22)

ExhaustiveUI v22 is the first major of the fork, and its first stable release. It requires Angular 22 and moves the whole library to the Angular Signals API. The public API is frozen for the v22 line: minor releases add features and fixes without breaking changes. The alphas and release candidates below lead up to it. This section sums them up.

### Since 22.0.0-rc.3

- New [migration guide to v22](https://exhaustive-ui.com/migration/v22): update steps from an ExhaustiveUI prerelease, PrimeNG v21 or Optimus UI, every migration and the cases it reports, code that uses a component instance, OnPush, the removed API, and the behavior and type changes. It is also published in the LLM docs (`get_guide("v22")` in the MCP server) and bundled in the agent skill, and the `update_to_v22` MCP prompt follows it.
- `migrate-from-primeng` no longer warns that it is deprecated and tells you to install `@exhaustive-ui/core@1`, a version that was never published. The schematic is maintained on this line.
- LLM docs: guide pages keep their headings, lists, links and every code example, in the order of the documentation site.

### Upgrade

```bash
ng update @angular/core@22 @angular/cli@22
ng update @exhaustive-ui/core@22
```

The [migration guide to v22](https://exhaustive-ui.com/migration/v22) walks through the whole update.

`ng update` rewrites your templates and code with nine migrations. It reports anything it cannot rewrite safely, such as programmatic access or conflicting bindings, with the file and line.

- `styleclass-to-class`: `styleClass`/`[styleClass]` becomes `class`/`[class]` on the ~60 components whose deprecated `styleClass` was removed. These include Tag, Card, Select, Table, DatePicker and Panel.
- `renamed-inputs`: renames deprecated input aliases.
  - Drawer: `showCloseIcon` becomes `closable`.
  - Paginator: `dropdownAppendTo` becomes `appendTo`.
  - Password: `maxLength` becomes `maxlength`.
  - AutoComplete: `minLength` becomes `minQueryLength`.
  - TreeSelect: `containerStyleClass` and `containerStyle` become `class` and `style`.
  - TreeTable: `virtualRowHeight` becomes `virtualScrollItemSize`.
  - Listbox, MultiSelect: `filterPlaceHolder` becomes `filterPlaceholder`.
  - ImageCompare: `ariaLabelledby` becomes `ariaLabelledBy`.
  - Drawer: `ariaCloseLabel` becomes `closeAriaLabel`.
  - Dialog: `content`, the old public name of the header template, becomes `headerTemplate`.
  - pButton, pButtonLabel, pButtonIcon, pBadge, pInputText, pTooltip (on any element): the `pt*` pass-through aliases become `p*PT`, and pBadge `size` becomes `badgeSize`.
- `renamed-outputs`: renames outputs to the name the other components use. The payloads are unchanged.
  - OrderList: `onFilterEvent` becomes `onFilter`.
  - Table: `selectAllChange` becomes `onSelectAllChange`.
  - MultiSelect: `onPanelShow`/`onPanelHide` become `onShow`/`onHide`.
- `renamed-templates`: the MultiSelect `removetokenicon` template becomes `chipicon`.
- `remove-dead-inputs`: removes bindings of about eighty inputs that had already stopped doing anything. Examples are the old `*TransitionOptions`, `autoZIndex`/`baseZIndex` on sub menus, Table `frozenColumns`/`frozenWidth`, the ConfirmDialog aria labels and the `trackBy` inputs of DataView, OrderList and PickList.
- `remove-dead-outputs`: removes Overlay `onAnimationStart`/`onAnimationDone` and MenubarSub `menuFocus`/`menuBlur`/`menuKeydown`.
- `config-overlay-options-signal`: `Exhaustive.overlayOptions` is a signal. Assignments become `.set()` and reads become calls.
- `removed-exports`: `Password_VALUE_ACCESSOR` becomes `PASSWORD_VALUE_ACCESSOR`, and the removed `<p-inplacedisplay>`/`<p-inplacecontent>` wrappers become `<span>`.
- `config-input-style-to-variant`: the global `inputStyle` option becomes `inputVariant`, in `provideExhaustive()`/`setConfig()` objects and on the `Exhaustive` service.

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
- **Removed TypeScript API** (no migration, the compiler points at each use): `OverlayOptions.showTransitionOptions`/`hideTransitionOptions`, `DynamicDialogConfig.rtl`/`transitionOptions`, and the deprecated `classNames`, `createStyleAsString`, `createStyleTag`, `mergeKeys` utils and the theme service's `getDirective`.
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
- 170 medium-severity bugs inherited from Optimus UI, across Table, DatePicker, the tree, select, input, overlay and menu components and the theming engine: see 22.0.0-alpha.10.
- 108 low-severity bugs inherited from Optimus UI, plus a Splitter listener leak: see 22.0.0-alpha.11.

### Tooling and documentation

- Tailwind CSS v4 is the recommended version: the documentation site and its StackBlitz projects use it, the `@exhaustive-ui/tailwindcss` v4 stylesheet matches the v3 plugin, and `migrate-from-primeflex` produces v4 class names. The v3 plugin is still published.
- New package: `@exhaustive-ui/mcp`, an MCP server for coding agents. It serves the component API, the guides and the examples from the live documentation site. Its `validate_usage` tool checks templates and names the replacement of every input removed or renamed in v22. Its prompts include `update_to_v22`.
- The `exhaustive-ui` agent skill (`npx skills add https://exhaustive-ui.com`) describes the v22 conventions and bundles the update guide.
- The documentation moved to https://exhaustive-ui.com. The old exhaustive-ui.e-xiste.com redirects there.
- Packages are published with npm trusted publishing and carry provenance attestations.

## 22.0.0-rc.3 (2026-11-22)

Third release candidate of 22.0.0, and the last planned before the stable release: the public API is frozen for the v22 line. The 194 [Optimus UI](https://github.com/openng-org/optimus-ui/issues) bugs that could not be confirmed by reading the code, and the 50 remaining low-severity ones, were each turned into a test in a real browser. About 85 were still present and are fixed below; about 100 already worked and most keep their test as a regression test. The others are feature requests, need a browser or a screen reader the tests cannot drive (Firefox, Edge, iOS, NVDA, VoiceOver), or need a redesign: virtual lists taller than the browser's maximum element height (#176, #336), row heights of a TreeTable with frozen columns (#933, #731), the overlay width with virtual scroll (#158), Signal Forms showing invalid before interaction (#162, #202) and ToggleSwitch sizes (#86). The issue numbers are Optimus UI's.

### Breaking changes

API cleanup before the 22.0.0 freeze. `ng update` applies the migrations named below.

- Removed inputs that did nothing (`remove-dead-inputs` deletes their bindings): Stepper `transitionOptions`, AutoComplete `autoHighlight`, Listbox `searchLocale`, DataView `gridStyleClass` and `trackBy`, OrderList `trackBy` and `header` (use the `header` template), PickList `trackBy`, `sourceTrackBy` and `targetTrackBy`, ToggleSwitch `size`, SelectButton `tabindex`, ConfirmPopup `baseZIndex`, and the TreeTable sort icon's `ariaLabelAsc`/`ariaLabelDesc`.

- Renamed to the name the other components use (`renamed-inputs` and the new `renamed-outputs` migration rewrite the bindings):
  - Listbox, MultiSelect: `filterPlaceHolder` becomes `filterPlaceholder`.
  - ImageCompare: `ariaLabelledby` becomes `ariaLabelledBy`.
  - Drawer: `ariaCloseLabel` becomes `closeAriaLabel`.
  - OrderList: the `onFilterEvent` output becomes `onFilter`.
  - Table: the `selectAllChange` output becomes `onSelectAllChange`. A `[(selectAll)]` two-way binding is reported: bind `[selectAll]` and `(onSelectAllChange)="selectAll = $event.checked"`.
  - MultiSelect: the `onPanelShow`/`onPanelHide` outputs become `onShow`/`onHide`.

  The event payloads are unchanged, so handlers that read `$event` keep working.

- Configuration: the global `inputStyle` option (deprecated since v20) is removed, use `inputVariant` (same values). The new `config-input-style-to-variant` migration renames it in `provideExhaustive()`/`setConfig()` objects and on the `Exhaustive` service.
- TypeScript-only removals, with no migration (the compiler points at each use):
  - `OverlayOptions.showTransitionOptions`/`hideTransitionOptions` and `DynamicDialogConfig.rtl`/`transitionOptions`: nothing read them. Use `motionOptions`.
  - `@exhaustive-ui/utils`: `classNames` (use `cn`), `createStyleAsString` (use `createStyleMarkup`), `createStyleTag` (use `createStyleElement`), `mergeKeys` (use `deepMerge`).
  - `@exhaustive-ui/styled`: `getDirective` on the theme service (use `getComponent`).

- Directives: the deprecated pass-through aliases `ptButtonDirective`, `ptButtonLabel`, `ptButtonIcon`, `ptBadgeDirective`, `ptInputText` and `ptTooltip` are removed, use `pButtonPT`, `pButtonLabelPT`, `pButtonIconPT`, `pBadgePT`, `pInputTextPT` and `pTooltipPT`. pBadge's deprecated `size` is removed, use `badgeSize`. `renamed-inputs` now also matches attribute directives on any element and renames these bindings (`size` only on plain elements, where it sized the badge).

- MultiSelect: the deprecated `removetokenicon` template is removed, use `chipicon` (same context). The new `renamed-templates` migration renames `#removetokenicon` and `pTemplate="removetokenicon"` inside `p-multiselect`.

- Dialog: the header template input is public as `headerTemplate`, like `contentTemplate` and `footerTemplate`. It was exposed under the name `content`, so `[content]` set the header. `renamed-inputs` turns a `[content]` binding on `p-dialog` into `[headerTemplate]`.

- Exports (the new `removed-exports` migration updates the imports):
  - Password: `Password_VALUE_ACCESSOR` is renamed `PASSWORD_VALUE_ACCESSOR`, like the other value accessors. The unused `MapperPipe` is removed.
  - Inplace: the empty `InplaceDisplay`/`InplaceContent` wrapper components are removed. Inplace projects the `pInplaceDisplay`/`pInplaceContent` attributes; the migration turns `<p-inplacedisplay>`/`<p-inplacecontent>` into `<span>` and drops them from imports.
  - No longer exported from their entry point (imports are reported): the `SelectItem` option component of Select (the `SelectItem` interface of `@exhaustive-ui/core/api` is unchanged), Menu's `SafeHtmlPipe` (also dropped from `MenuModule`), `RadioControlRegistry` and `MenubarService`.
  - The sub components that render the inside of a component (`ContextMenuSub`, `TieredMenuSub`, `MenuItemContent`, `MultiSelectItem`, `ToastItem`, `TableBody`, `TTBody`, `UITreeNode`, the Galleria parts...), `PARENT_INSTANCE` and the pre-signals helpers of `@exhaustive-ui/core/utils` are tagged `@internal`: they stay exported in v22 but are not public API.

- AvatarGroup and InputGroupAddon: the `styleClass` input is removed, since `class` already worked on them. The `styleclass-to-class` migration now covers `p-avatar-group`/`p-avatarGroup`/`p-avatargroup` and `p-inputgroup-addon`/`p-inputGroupAddon`.

### Features

- InputMask: a backslash escapes a mask character, e.g. `+\9 999` (#911).
- Password: `mediumRegex` and `strongRegex` on the `pPassword` directive (#953).
- Tree: `onNodeDrop` reports `dropPosition` (`'before' | 'inside' | 'after'`) (#851).
- Accordion: `accordion.header.focus.background` token, used by the Material preset (#237).
- FloatLabel and IftaLabel follow the `small` and `large` sizes of the field they wrap (Select, MultiSelect, CascadeSelect, TreeSelect, DatePicker, InputNumber, AutoComplete, Password, InputMask, Textarea, `pInputText` with `pSize`): the label inset and font size match the text, and the `in` variant and IftaLabel resize their vertical padding. Before, a small Select under `variant="in"` lost the room for its floated label, which then overlapped the value. New `sm`/`lg` tokens in the floatlabel and iftalabel sets of the four presets; InputText and the multiple AutoComplete also set the `p-inputfield-sm`/`p-inputfield-lg` size classes. The default size is unchanged.

### Fixes

- Deprecation notes: OrganizationChart `preserveSpace` is no longer marked deprecated (it works and stays), Inplace `closeIcon` now points to the `closeicon` template instead of `class`, and the pButton directive's `buttonProps` note says that the `buttonProps` of p-button is not deprecated.
- Message: `[style]` reaches the host element. A `style` input that nothing read captured the binding and dropped it; the input is removed.
- PickList: `ariaSourceFilterLabel` and `ariaTargetFilterLabel` label the filter inputs. OrderList: `ariaLabelledBy` reaches the list, through a new Listbox `ariaLabelledBy` input. TreeTable: `virtualScrollDelay` is passed to the scroller in lazy mode, as Table does. The three inputs were ignored.
- Table:
  - virtual scroll: frozen rows stay sticky (#432), the header keeps its background (#281), a runtime scroll height is kept (#365), rows render in a container sized after the first render (#269), one group header per group with expandable row groups (#783);
  - frozen columns: body cells paint above the scrolled content (#232), cells after a frozen cell spanning several header rows are placed correctly (#711);
  - sticky row group headers follow the header height (#208); rows stay still while a column is dragged (#231); the column resize indicator stays within a table of fractional height (#95);
  - filters: the menu overlay is placed again when a rule is added or removed (#210), a typed text or number filter applies on blur (#862), a reused row no longer opens the editor of the edited cell (#537);
  - a lazy table no longer reloads when the app writes the sort it received back into `sortField`/`sortOrder` (#712);
  - stack layout hides the column titles above the breakpoint (#814); gridlines rules no longer leak into tables nested in a cell (#951).
- TreeTable: expanding or collapsing reuses the rendered rows (#539), nodes stay expanded across filtering and the expand events receive the original node (#250, #402, #942), a cell keeps editing while its overlay component is used (#194), a column resize finishes in a scrollable table without colgroup (#94).
- Tree and TreeSelect: a screen reader activating a treeitem selects it (#115), a custom-height drop point stays open while hovered (#77), parent checkboxes refresh in virtual scroll (#55, #923), the selection is written once per checkbox click (#836), selected nodes stay serializable in form values (#238, #674).
- Scroller (every virtual list):
  - the spacer ends at the last item instead of one viewport below (#1755);
  - the auto size is measured again after the new range renders and keeps the scroll position (#647, #182, #659), and shrinks to a list shorter than the viewport (#444, #656);
  - a lazy list requests every page up to the current one on the first request (#682) and the current pages when initialized again while scrolled (#686);
  - `scrollToIndex` reaches its index when called before the spacer or the viewport is laid out (#22);
  - items not loaded yet no longer log NG0955; a destroyed scroller no longer throws NG0205.
- Select, MultiSelect, Listbox: PageUp/PageDown move the focus by a page (#721, and the keys were swapped in Listbox); a selected option with a `null` value fills the Select (#156); MultiSelect option checkboxes leave the focus order (#382) and a group label click keeps the list scroll (#842); a Listbox flex list stays inside the listbox with a header (#72).
- CascadeSelect: `value` accepts any option value, not only strings, so a whole option object can be bound with strict templates and Signal Forms.
- CascadeSelect: a sublist opens on the left when it would leave the viewport (#328).
- AutoComplete: hovering an option no longer scrolls the list (#320); keys from virtual keyboards that send no code work (#369, #454).
- Angular Signal Forms: `[formField]` compiles with strict templates on every form component (#155); Slider marks the field touched on blur (#175).
- DatePicker: the panel keeps its width in the month and year views (#30), adjacent-month days of a range are highlighted (#379), the touchUI panel is centered (#427), the inline calendar keeps a tabbable day (#845), and destroying it with the touchUI panel open releases the body scroll lock.
- InputNumber: de-AT and other locales with a distinct currency group separator parse correctly (#15); deleting inside a value longer than `maxlength` keeps the caret (#356).
- InputMask restores the caret synchronously after an Android input (#370); InputOtp replaces the character of a filled box (#833); Textarea has no gap under it in an ifta or float label (#213).
- Dialog focuses the `autofocus` field on show (#455) and a modal destroyed while open releases the body scroll lock; DynamicDialog creates dialogs in the DialogService environment injector (#631, #759) and keeps a stable style object (#896); Image releases the scroll lock the same way.
- Overlay follows a fixed target when the page scrolls (#50); Popover keeps its arrow on the target when shifted (#122); Tooltip is placed against the inner element of p-button, p-scrolltop and similar hosts (#700).
- Motion drops a stale enter or leave (#571) and tolerates missing computed styles under jsdom (#479).
- BlockUI keeps its mask inside its target in a Dialog (#385).
- Toast draws its severity and close icons (#190) and Message its close icon, which were never imported.
- RadioButton renders without `ngModel` or a form control (#274).
- TieredMenu positions submenus against their parent item (#335, #421), computes `aria-setsize`/`aria-posinset` once per list (#504) and runs the item command when the menuitem element itself is clicked (#249).
- PanelMenu: the pressed item gets focus (#52), no browser list spacing (#59), ripple on links (#540), tooltips anchored to the item row (#827).
- ContextMenu opens at the pointer in a positioned or transformed container (#809) and at the touch point after a long press (#932), including on iPadOS (`isIOS` detects it).
- Tabs: the next scroll page starts with the tab the next button cut (#124). Stepper: inactive panels have no height with a theme preset loaded. Accordion: wide content scrolls instead of overflowing (#146). Panel restores the `tabindex` of its content when expanding (#612). OrderList move buttons work after a drag and drop (#5).
- Badge: a `[size]` on the component pBadge sits on no longer reaches the badge (#715). Carousel removes its responsive style element on destroy. Editor shows a value written while detached (#815). `DomHandler.getParents` crosses shadow roots (#172). Lara DataView radius matches its header and footer (#261).

### Documentation site

- `/templates`, the removed Templates page, now redirects permanently to the home page.
- Import sections show standalone imports (#353).
- The 23 form component pages have a Signal Forms example next to the Template Driven and Reactive Forms ones: the same form written with `form()`, the validators of `@angular/forms/signals` and `[formField]`, with its messages shown once the field is touched or the form submitted. The code shown and opened in StackBlitz imports the Signal Forms API.

### Tests

- The unit test files share one browser document: a setup file now resets the theme state, the DOM, the body scroll lock and the window scroll after each file, so the full suite passes reliably.

## 22.0.0-rc.2 (2026-11-21)

Second release candidate of 22.0.0. It fixes two crashes found by clicking through every demo of the documentation site with 22.0.0-rc.1.

### Fixes

- Badge: `pBadge` on a component whose template starts with a comment, such as `p-avatar`, no longer throws a `HierarchyRequestError` that left the avatar empty; the badge is attached to the component host.
- Menubar: an item command that navigates away no longer makes the destroyed menubar emit `onBlur` (NG0953).

### Documentation site

- The PrimeNG announcement moved from the banner above the home page to the home footer.
- The Sparked template is no longer showcased: the Templates page, its menu entry, the home page section and the footer links are removed.
- Every component page was opened in a browser with its demos clicked through; besides the two fixes above, this fixed the markdown links of Textarea, Drag and Drop, Focus Trap and ClassNames, the Textarea theming tab, and the missing home page screenshots on small screens.

## 22.0.0-rc.1 (2026-11-21)

First release candidate of 22.0.0. It fixes 14 of the 16 medium-severity [Optimus UI](https://github.com/openng-org/optimus-ui/issues) bugs set aside in 22.0.0-alpha.10. Each one has a regression test; the issue numbers are Optimus UI's. #593 (Popover in a Dialog with `appendTo`) was already fixed and now has tests. #731 (one table for screen readers in a scrollable TreeTable) needs a redesign of the scrollable TreeTable and stays open.

### Behaviour changes

- Overlays: the viewport size used to place overlays excludes the page scrollbars, so overlays at the right edge no longer go under the vertical scrollbar. TieredMenu, Menubar, ContextMenu and CascadeSelect submenus no longer subtract the scrollbar width a second time (#1926).
- Select: a Select inside a disabled `<fieldset>` is disabled, except inside the fieldset's first `<legend>`, as for native controls (#366).
- PickList: moving items sets `source` and `target` to new arrays and emits `sourceChange`/`targetChange`, so `[(source)]`/`[(target)]` bindings follow (#260).

### New translation keys

- `aria.columnMoved` and `aria.rowMoved` (default `Column moved to position {position} of {total}` and `Row moved to position {position} of {total}`), translated in the 62 languages of `@exhaustive-ui/locale`. Table announces them in a polite live region after a column or a row is moved with the keyboard. A custom `aria` translation without these keys falls back to the English text.

### Fixes

- Table: columns and rows can be reordered with the keyboard (Ctrl/Cmd + arrows) and rows with a touch on the handle; the caption names the table through `aria-labelledby`; frozen columns share one resize listener and one ResizeObserver, repositioned once per frame, instead of one per cell (#13, #960, #100, #387, #426, #784).
- TreeTable: frozen columns are laid out from the inline start in right-to-left pages (#417).
- DatePicker: time picker changes are announced to screen readers (#627).
- Forms: `writeValue` called from an effect no longer makes the effect track the component's internal signals (#480).
- Styles: components inside a `ViewEncapsulation.ShadowDom` host get their styles, which are copied into the shadow root and kept in step (#802).
- SSR: host and root PassThrough attributes (`data-pc-*`, `pt.root`, `pt.host`) are rendered on the server (#2083).
- PassThrough: the global `panelmenu` and `cascadeselect` options reach the items of PanelMenu sub lists and the options of CascadeSelect, as was done for MegaMenu (#32). TieredMenu was checked and already applied them; its test now opens a submenu.

## 22.0.0-alpha.12 (2026-11-21)

### Tailwind CSS v4

- The documentation site and its StackBlitz projects now use Tailwind CSS v4, through `@tailwindcss/postcss` and the CSS configuration (`@import 'tailwindcss'`, `@theme`, `@custom-variant`) instead of `tailwind.config.js`. Tailwind v4 is the version the docs recommend; the v3 plugin is still published and documented.
- `@exhaustive-ui/tailwindcss` (v4 stylesheet) now generates the same utilities as the v3 plugin. Checked by compiling all 681 plugin classes with both and comparing the declarations:
  - `animate-delay-*` produced invalid CSS (`75 ms`, with a space) and had no effect.
  - The animation utilities accept arbitrary values again: `animate-delay-[123ms]`, `animate-duration-[2s]`, `fade-in-[0.3]`, `zoom-in-[0.9]`, `spin-in-[-45deg]`, `slide-in-from-t-[10px]`.
  - `slide-in-from-*` and `slide-out-from-*` accept fractional steps (`0.5`), fractions (`1/2`), `px` and `full` again.
- `@exhaustive-ui/tailwindcss` exports `./v4` and `./v4/*`, so `@import '@exhaustive-ui/tailwindcss/v4/index.css'`, which the `migrate-from-primeng` schematic writes for `tailwindcss-primeui/v4/index.css`, resolves.
- `migrate-from-primeflex` produces Tailwind v4 class names when the workspace uses Tailwind v4 or does not have Tailwind yet: v4 renamed the shadow and border-radius scales one step down, so `shadow-1` now becomes `shadow-xs` and `border-round-sm` becomes `rounded-sm`. Workspaces on Tailwind v3 keep the v3 names. The new `tailwindVersion` option (3 or 4) overrides the detection.
- Docs: the Tailwind guide marks v4 as the recommended version and its v3 important-modifier example uses the v3 prefix syntax (`!p-8`). The PrimeFlex guide warns that `pf2tw` produces v3 class names. The agent skill describes the Tailwind setup.

## 22.0.0-alpha.11 (2026-11-21)

Fixes for 108 low-severity bugs reported on [Optimus UI](https://github.com/openng-org/optimus-ui/issues) that still affected ExhaustiveUI. Each one has a regression test, except documentation fixes, which are checked by the docs build. The issue numbers are Optimus UI's.

### Behaviour changes

- TieredMenu: with `autoDisplay`, submenus open on hover from the start, without a first click, as documented (#655). A tap on a touch screen still opens them on the click.
- ContextMenu: showing a context menu closes any other one that is open (#359).
- Select, MultiSelect and CascadeSelect use the SVG spinner of Button as their default loading icon, instead of the `pi-spin` icon class (#1600).
- InputText: when `[invalid]` is bound, it alone decides the invalid style; the automatic `ng-invalid.ng-dirty` border no longer applies on top of it (#372).
- InputNumber: a keystroke that would make the formatted value longer than `maxlength` is rejected instead of truncating the text (#362). The native `min`/`max` attributes are gone; the bounds stay in `aria-valuemin`/`aria-valuemax` (#326).
- DatePicker: the `data-date` attribute of day cells uses a 1-based month (#215).
- MeterGroup: meter widths use the exact percentage; labels keep the rounded value (#536).

### Type changes

- Table `onFilter`: `filters` is typed `FilterMetadata | FilterMetadata[]`, which is what the table emits (#56).
- TreeTable `TreeTableLazyLoadEvent`: `first` is a `number` and `last` an optional `number`, as in `TableLazyLoadEvent` (#931).
- CascadeSelect `options` is typed as an array (#277, #360).
- Dialog/ConfirmDialog `pt.root` is typed as the options of the root element (#91).
- New exported `ChartDataSelectEvent` type for Chart `onDataSelect` (#394).
- `Confirmation` accepts `draggable` (#60).

### New optional inputs

- Password `readonly` (#235), OrderList `focusOnHover` (#401), TreeSelect `togglerAriaLabel` (#624), Breadcrumb `ariaLabel` (#51). DatePicker `hourFormat` also accepts a number (#309).

### Fixes

- Table: empty message shown once with frozen rows, reorder cursor and indicators, filter menu clear button, active state and spacing, state saved when the selection is set from code, Trusted Types support for the generated column styles, frozen footer background (#121, #589, #132, #377, #222, #467, #542, #573, #327, #186).
- DatePicker: invalid placeholder colour, ISO week numbers, panel realigned when the month changes height, time change on the `defaultDate` day, RTL chevrons, the input icon, the Today button time, year ranges in the year view (#53, #97, #179, #197, #305, #456, #574, #705).
- InputNumber: paste no longer cancelled, decimal steps without floating point artefacts, no dirty state on a blur without edit, ".5" gives 0.5 (#8, #383, #428, #678).
- Select, MultiSelect: touched state while open, disabled option checkboxes, dropdown icon and empty toggle-all, Tab key, custom filter templates, focus after filtering, scroll to the selection with virtual scroll, overlay realigned when the options change (#724, #439, #111, #675, #331, #752, #22, #1841).
- AutoComplete, Listbox, PickList, Tree, TreeSelect, TreeTable: custom clear icon, separator key, `[object Object]` labels, `minQueryLength` with `completeOnFocus`, list and checkbox names, toggle button label, touched state, listener cleanup, virtual scroll indentation (#26, #267, #901, #921, #347, #389, #275, #624, #575, #474, #315).
- Overlays: ConfirmDialog `p-footer`, Drawer `maskStyle`, mask fade-out and close button, FileUpload basic mode icon and drag highlight, Popover flip state and Escape listener, ConfirmPopup `blockScroll` and `dir`, positioned Dialog header click, centered Toast with breakpoints (#290, #488, #69, #273, #123, #876, #398, #405, #557, #648, #447, #469).
- Menus and layout: Card layout, MegaMenu global pass-through, PanelMenu root items and separators, Tabs scroll into view and active bar, ContextMenu hidden icon focus, Menu hidden separators, Paginator "All" option, Fieldset labelling, Stepper as a BlockUI target (#28, #32, #183, #635, #199, #697, #323, #518, #703, #766, #885).
- Form inputs: icon-only ToggleButton, disabled ToggleSwitch tooltip and ARIA, Editor colour picker and toolbar tokens, pPassword strength bar, SelectButton RTL border, NG0955 warning and `p-fluid`, InputGroup button height, IconField `iconPosition="right"`, FloatLabel over a select placeholder, Slider passive touch events (#68, #90, #351, #834, #99, #954, #285, #301, #364, #505, #298, #477, #685, #867, #501, #787).
- Theming: OverlayBadge `dt` and `unstyled`, component-level `dt` css, Lara token references, nested ScrollPanel bars (#18, #633, #1874, #943).
- Splitter: a splitter destroyed during a resize removes its document listeners instead of throwing on the next mouse move (found while fixing the tests).
- Documentation: accessibility class name, setup examples without `provideAnimationsAsync`, Tree multiple selection value, Image in the LLM docs (and so in the MCP server), theme preferences kept across reloads on the docs site (#119, #147, #825, #1867, #1616).

## 22.0.0-alpha.10 (2026-11-20)

Fixes for 170 medium-severity bugs reported on [Optimus UI](https://github.com/openng-org/optimus-ui/issues) that still affected ExhaustiveUI. Each one has a regression test; the issue numbers are Optimus UI's.

### Behaviour changes

- Theming: a token overridden under `colorScheme.light` now wins over the preset's top-level token, as it does in dark mode (#1754). A top-level override passed to `definePreset`, `updatePreset` or `usePreset` still wins over the base preset's `colorScheme.light` value.
- Tooltip honours the global `overlayAppendTo` option (#48).
- A popup TieredMenu gives the focus back to its trigger when an item is picked, as SplitButton (#137).
- Stepper: the `tablist` role is on `p-step-list` (#2, #585). Splitter: the `separator` role is on the focusable gutter handle (#458). FocusTrap sentinels are no longer `aria-hidden` (#418). ConfirmDialog no longer puts `role` on the `p-dialog` host (#694).

### New optional inputs

- DatePicker `ariaDescribedBy` (#494), Splitter `maxSizes` (#615), Button `ariaExpanded` and `ariaControls` (#626), Image `previewAriaLabel` (#381), OrderList `optionLabel` (#443), TreeTable checkbox `ariaLabel` and `ariaLabelledBy` (#262), AutoComplete chip list `ariaLabel` and `ariaLabelledBy` (#348, #625).

### Fixes

- Table:
  - Filtering: negated global filters, menu filters that wait for Apply, constraints kept when filtering by code and recreated on reset, boolean filter clear button and aria label, the filter menu closes on outside clicks and keeps the focus inside (#910, #375, #352, #794, #722, #214, #149, #38, #135, #785, #350).
  - Sorting and paging: the bound array is no longer sorted in place, keyboard multi-sort with Ctrl/Cmd, the page is kept or moved back when the value changes, state without `first`/`rows` restored (#772, #33, #828, #396, #144).
  - Rows: `onRowCollapse` in single expand mode, `loadingbody` with expandable rows, group headers before their first row and with virtual scroll, selectable rows stay tabbable, editable cells reachable from the keyboard and restored on cancel (#378, #899, #517, #159, #604, #594, #248, #846).
  - Columns: frozen columns stay in place on reorder, offsets only count the frozen columns before them, RTL support for frozen columns and drops, widths measured on the last header row, `p-datatable-frozen-column-left` applied (#729, #151, #708, #150, #78).
  - Paginator position classes (#515); sortable headers keep a valid role (#392).
- DatePicker: crashes and parsing (empty range in the year view, day-of-year formats, pasted values), minDate time handling (#35, #143, #839, #388, #889), localized am/pm, the weekday header after a view switch, the day grid after a translation change, inline datepicker marked touched, outside clicks inside a shadow root, and keyboard and screen-reader support of the grid and header (#153, #363, #930, #437, #565, #31, #882, #393, #503, #7, #24, #459, #898).
- Tree, TreeSelect, TreeTable: keyboard context menu, lazy node focus, programmatic expand with virtual scroll, duplicate parents, `onFilter` and the filter text on reopen, partially checked parents on reset and preselection, custom multiple sort per level, checkbox events and updates with `selectionKeys`, keys typed in inputs inside rows (#36, #495, #547, #551, #400, #256, #138, #425, #509, #916, #85, #88, #586, #847, #549, #749).
- Select, MultiSelect, Listbox, AutoComplete, OrderList, PickList: keyboard clear icon, editable input name and focus, body scroll unlocked after a responsive overlay, grouped counts, "null" labels, emptied models, disabled options kept on toggle all, Enter in multiple AutoComplete, readonly chips, `size` in multiple mode, Space and Enter in item templates, double-click in PickList (#253, #462, #265, #306, #330, #857, #14, #824, #869, #908, #830, #294, #299, #559, #737, #915).
- Inputs: InputNumber and InputMask on soft keyboards and Android, InputMask pristine state and partial values, InputOtp on Android keyboards, KeyFilter at the caret, after dead keys and on Android, Slider after a min/max change, Password toggle from the keyboard, Textarea keeps the scroll position, RadioButton groups, SelectButton labels, Quill 2 lists in Editor (#62, #508, #892, #507, #941, #792, #868, #12, #687, #157, #853, #191, #584, #823, #646, #257, #572, #11, #300, #376).
- Overlays: BlockUI before the first block and during unblock, Toast clear all and breakpoints, Tooltip after a scroll, Dialog and Drawer scroll locks with nested modals, Drawer mask, Dialog `appendTo`, labels and focus, ConfirmDialog confirmations from callbacks, `defaultFocus` and `closeButtonProps`, Overlay reopened during its leave animation, Image preview name, Carousel autoplay and tab order, ConfirmPopup arrow, DynamicDialog with a content template (#37, #145, #818, #81, #116, #1934, #1922, #361, #329, #93, #1613, #246, #429, #709, #591, #341, #391, #521, #522, #1951, #381, #793, #324, #671, #84).
- Menus and layout: single tap on TieredMenu and Menubar on touch screens, while a mouse still opens submenus on hover (#2104), Menubar autoHide and submenus inside the viewport, ContextMenu submenus and Escape, Menu popup focus, PanelMenu sub-item badges and frozen models, Tabs keys, `#content` templates and scroll buttons, Accordion boolean attributes, Splitter `minSizes`, pButton variant classes, Panel toggle ARIA (#136, #152, #528, #534, #221, #2092, #61, #282, #619, #181, #255, #588, #445, #569, #626).
- Theming and shared code: component `extend` tokens deep-merged, element-scoped dark mode, global Table PassThrough, FilterService `startsWith`/`endsWith`/`notEquals`, scrollbar measuring, Paginator labels after `setTranslation`, ProgressBar ARIA, ScrollPanel focus ring, ScrollTop in a parent, Scroller `scrollToIndex`, shrinking items and loader, `pi-spin` with a custom Select/CascadeSelect loading icon, Button icon position classes (#163, #670, #25, #220, #316, #224, #634, #2080, #2088, #9, #577, #318, #47, #877).

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
