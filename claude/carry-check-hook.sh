#!/bin/bash
# PreToolUse Agent|Task carry-check (0204). The check lives in carry-check-hook.mjs: a spawn prompt needs
# real JSON parsing (0204 brief, caveat 4). What a green check means: the .mjs header.

# Run as bash "<path>" (ADR-017 rule 2). The .mjs is found beside this file, so prove-red's copies run
# their own .mjs.

# Fail OPEN when node is missing (0204 plan, ruling Q3). stdin is not read here: exec passes it on.
set -u

here="$(cd "$(dirname "$0")" && pwd)"

if ! command -v node >/dev/null 2>&1; then
  echo 'carry-check-hook: node not found — carry check SKIPPED (fail-open)' >&2
  exit 0
fi

exec node "$here/carry-check-hook.mjs"
