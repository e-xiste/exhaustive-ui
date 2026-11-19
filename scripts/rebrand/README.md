# Rebranding and porting upstream changes

ExhaustiveUI is a fork of [Optimus UI](https://github.com/openng-org/optimus-ui). The two codebases
differ by a mechanical rename (package scope, identifiers, URLs, directory layout) plus whatever lands
here first. `rules.mjs` holds that rename as an ordered list of regex rules, and `rebrand.mjs` applies
it to files or to a patch read from stdin, so an upstream commit can be ported without hand-editing
every renamed line.

## Port an upstream commit

```bash
git fetch upstream                      # https://github.com/openng-org/optimus-ui.git
scripts/port-upstream.sh <sha> [<sha>…] # format-patch -> rebrand -> git am -3
```

`port-upstream.sh` keeps the original author and message, appends an `Upstream-Commit:` trailer, and
stops on the first commit that does not apply cleanly so the conflict can be resolved with the usual
`git am --continue` / `--skip` / `--abort`.

## Re-run the rename on the whole tree

```bash
node scripts/rebrand/rebrand.mjs --all
```

Idempotent: running it on an already rebranded tree changes nothing. Directory moves are not part of
the script; they were done once with `git mv` (`packages/optimus-ui-*` → `packages/*`,
`packages/optimus-ui` → `packages/core`) and the path rules translate references to the old layout.

## What is deliberately not renamed

- `@openng/icons`, `OpenngIcons`, "OpenNG Icons": the icon set is OpenNG's and is consumed as a dependency.
- Copyright notices in `LICENSE.md` and `packages/*/LICENSE`.
- `v1.optimus.openng.org`: Optimus UI's v1 documentation, linked for the PrimeNG migration guide.
- Sparked, OpenNG's admin template, referenced as a showcase.
