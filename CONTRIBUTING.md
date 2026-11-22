# Contributing to ExhaustiveUI

ExhaustiveUI is a community fork of [Optimus UI](https://github.com/openng-org/optimus-ui), which itself continued PrimeNG v21 after PrimeTek moved PrimeNG to a commercial license. Any help is welcome, whether it's fixing bugs, adding features, improving docs, porting upstream fixes, or triaging issues.

The current major is **v22**: it targets Angular 22, and ExhaustiveUI majors follow Angular's. `main` is the v22 line.

## Relationship with Optimus UI

The two codebases differ by a mechanical rename (npm scope, identifiers, URLs, directory layout) plus whatever lands here first. Fixes merged upstream are ported here with their original author and message, and fixes made here are welcome to go upstream too.

- `scripts/rebrand/rules.mjs` is the rename, as an ordered list of regex rules.
- `scripts/port-upstream.sh <sha>` ports an upstream commit: `git format-patch`, rebrand, `git am -3`.
- [`scripts/rebrand/README.md`](scripts/rebrand/README.md) has the details and the list of things deliberately left unrenamed.

Upstream code may still use the pre-v22 APIs (`@Input`, `@Output`, `@ViewChild`, `*ngIf`, `styleClass`...). A ported change has to be adapted to the [v22 conventions](#v22-conventions) before it is merged; `git am -3` usually stops on those files, so expect to resolve them by hand.

```bash
git remote add upstream https://github.com/openng-org/optimus-ui.git
git fetch upstream
scripts/port-upstream.sh <upstream-sha>
```

## Bringing over a PR you already opened on PrimeNG or Optimus UI

If you had a pull request open on `primefaces/primeng` or `openng-org/optimus-ui` that wasn't merged, you can recreate it here with its original commits and history intact, instead of redoing the work from scratch.

1. Append `.patch` to your original PR URL, e.g. `https://github.com/openng-org/optimus-ui/pull/2103.patch`, and download the file.
2. Clone this repo and create a branch off `main`.
3. Rebrand and apply the patch:
   ```bash
   node scripts/rebrand/rebrand.mjs --stdin < 2103.patch > 2103.rebranded.patch
   git am -3 < 2103.rebranded.patch
   ```
4. Adapt the code to the [v22 conventions](#v22-conventions) — a PR written against PrimeNG v21 or Optimus UI uses the decorator API.
5. Push your branch and open a PR here.

If `git am` fails because the patch doesn't apply cleanly (files diverged), fall back to `git apply --reject 2103.rebranded.patch` to apply what it can, then manually resolve the `.rej` hunks.

## Development setup

This is a pnpm-based monorepo.

```bash
pnpm install     # install deps + git hooks (via lefthook)
pnpm run dev     # run the docs app locally
```

Useful scripts:

| Command | Purpose |
|---|---|
| `pnpm run build:lib` | Build the `@exhaustive-ui/core` package |
| `pnpm run lint` / `pnpm run lint:fix` | Lint |
| `pnpm run format` / `pnpm run format:check` | Prettier |
| `pnpm run test:unit` | Unit tests |
| `pnpm run test:coverage` | Unit tests with coverage |
| `pnpm --filter @exhaustive-ui/core test:schematics` | Tests of the `ng add`, `ng update` and migration schematics |
| `pnpm run test:mcp` | Type check and tests of the MCP server |
| `pnpm run build:docs` | Build the documentation site (also regenerates the LLM docs and the agent skill) |

Unit tests run in a headless Chromium through Playwright; install it once with `pnpm --filter @exhaustive-ui/core exec playwright install chromium`. To run a single component's tests: `pnpm --filter @exhaustive-ui/core test:unit --include <component>/<component>.test.ts`.

## v22 conventions

The whole library is on the Angular Signals API. New and changed code follows the same rules:

- **Signals only**: `input()`, `model()` for two-way properties, `output()`, `computed()`, `contentChild()` / `viewChild()` / `contentChildren()`. No `@Input`, `@Output`, `@ViewChild`, `@ContentChild` or `@HostBinding` decorators; bindings go in the `host` metadata.
- **OnPush** change detection on every component. Table, TreeTable and DynamicDialog are the only exceptions, on purpose: they render consumer objects that are mutated in place.
- **Built-in control flow**: `@if`, `@for`, `@switch`, never `*ngIf` / `*ngFor` / `ngSwitch`. Give every `@for` a `track` expression that is unique and stable: `track item.key` when the data has one, `track $index` for rows that are rebuilt from an input. A wrong track shows up as an NG0955/NG0956 warning in the unit test output — the suite currently prints none, keep it that way.
- **Removing or renaming a public input or output is a breaking change** and ships with its `ng update` migration in `packages/core/schematics/migrations/` (registered in `migrations.json` under the version that removes it, with tests in `packages/core/schematics/test/`). Prefer extending an existing migration (`renamed-inputs`, `renamed-outputs`, `renamed-templates`, `removed-exports`, `remove-dead-inputs`, `remove-dead-outputs`, `styleclass-to-class`) over writing a new one. The MCP server mirrors these lists in `packages/mcp/src/v22.ts`; `pnpm run test:mcp` fails until they match.
- Deprecations name the version: `@deprecated since v22.x.y. Use ...`.

## Keeping docs and tooling in step

A change that is visible to users updates, in the same PR:

- the documentation page of the component in `apps/docs/doc/<component>/`. The LLM docs, the MCP server's data and the agent skill are generated from it by the docs build, so they follow automatically;
- `CHANGELOG.md`, under the version being prepared;
- the update guide (`apps/docs/doc/migration/update/`) when users have to change their code.

## Making a change

1. Fork this repo and create a branch from `main`.
2. Make your change, keeping it scoped — smaller, focused PRs are easier to review and merge.
3. Add or update unit tests for the affected component(s).
4. Run `pnpm run lint`, `pnpm run format:check` and `pnpm run test:unit` before opening the PR (plus `test:schematics` / `test:mcp` when you touch those packages).
5. Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages (`fix:`, `feat:`, `chore:`, ...) — this is enforced via commitlint.
6. Open a PR describing the change and, if it fixes a bug, the steps to reproduce it.

## Releases

Releases are cut by the maintainers from `main` with the **Release** GitHub workflow: every `@exhaustive-ui/*` package is published together under one version, through npm trusted publishing (no token, provenance attestations), and gets a GitHub release with its notes. Versions follow Angular's major: `22.x.y` targets Angular 22. Contributors never need npm credentials.

## Reporting issues

Open an issue with a clear description and, ideally, a minimal reproduction (StackBlitz, CodeSandbox, or a small repo). For bugs, include the ExhaustiveUI version, Angular version (ExhaustiveUI v22 requires Angular 22), and browser.

## Questions

If anything about the workflow is unclear, open a discussion or issue — improving this guide itself is a welcome contribution too.
