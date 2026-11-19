#!/usr/bin/env bash
# Port one or more upstream (openng-org/optimus-ui) commits onto the current branch, rebranded.
# Usage: scripts/port-upstream.sh <sha> [<sha>...]
set -euo pipefail

if [ "$#" -eq 0 ]; then
    echo "usage: $0 <upstream-sha> [<upstream-sha>...]" >&2
    exit 1
fi

root="$(git rev-parse --show-toplevel)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

for sha in "$@"; do
    git -C "$root" format-patch -1 --stdout "$sha" > "$tmp/upstream.patch"
    node "$root/scripts/rebrand/rebrand.mjs" --stdin < "$tmp/upstream.patch" > "$tmp/rebranded.patch"
    if ! git -C "$root" am -3 --keep-non-patch "$tmp/rebranded.patch"; then
        echo "port-upstream: $sha did not apply cleanly; resolve, then 'git am --continue' (or --skip / --abort)" >&2
        exit 1
    fi
    git -C "$root" commit --amend --no-edit --trailer "Upstream-Commit: $(git -C "$root" rev-parse "$sha")" --quiet
    echo "port-upstream: ported $sha"
done
