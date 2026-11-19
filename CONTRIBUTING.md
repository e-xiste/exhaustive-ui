# Contributing to ExhaustiveUI

ExhaustiveUI is a community fork of [Optimus UI](https://github.com/openng-org/optimus-ui), which itself continued PrimeNG v21 after PrimeTek moved PrimeNG to a commercial license. Any help is welcome, whether it's fixing bugs, adding features, improving docs, porting upstream fixes, or triaging issues.

## Relationship with Optimus UI

The two codebases differ by a mechanical rename (npm scope, identifiers, URLs, directory layout) plus whatever lands here first. Fixes merged upstream are ported here with their original author and message, and fixes made here are welcome to go upstream too.

- `scripts/rebrand/rules.mjs` is the rename, as an ordered list of regex rules.
- `scripts/port-upstream.sh <sha>` ports an upstream commit: `git format-patch`, rebrand, `git am -3`.
- [`scripts/rebrand/README.md`](scripts/rebrand/README.md) has the details and the list of things deliberately left unrenamed.

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
4. Push your branch and open a PR here.

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

Unit tests run in a headless Chromium through Playwright; install it once with `pnpm --filter @exhaustive-ui/core exec playwright install chromium`. To run a single component's tests: `pnpm --filter @exhaustive-ui/core test:unit --include <component>/<component>.test.ts`.

## Making a change

1. Fork this repo and create a branch from `main`.
2. Make your change, keeping it scoped — smaller, focused PRs are easier to review and merge.
3. Add or update unit tests for the affected component(s).
4. Run `pnpm run lint` and `pnpm run test:unit` before opening the PR.
5. Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages (`fix:`, `feat:`, `chore:`, ...) — this is enforced via commitlint.
6. Open a PR describing the change and, if it fixes a bug, the steps to reproduce it.

## Reporting issues

Open an issue with a clear description and, ideally, a minimal reproduction (StackBlitz, CodeSandbox, or a small repo). For bugs, include the ExhaustiveUI version, Angular version, and browser.

## Questions

If anything about the workflow is unclear, open a discussion or issue — improving this guide itself is a welcome contribution too.
