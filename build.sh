#!/usr/bin/env bash
# Updates the `public` branch with the website files from `master`.
set -euo pipefail

export GIT_INDEX_FILE=$(mktemp -u)
git read-tree master
git rm -r -q --cached --ignore-unmatch old nginx.conf build.sh
tree=$(git write-tree)
rm "$GIT_INDEX_FILE"

commit=$(git commit-tree "$tree" -p public -m "Publish master @ $(git rev-parse --short master)")
git branch -f public "$commit"
