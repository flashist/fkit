#!/bin/bash
# carry-check-hook.sh — the PreToolUse/Agent carry-check gate (task 0204; `0162` §10 row 3, §6 F3).
#
# A thin wrapper: the check itself is carry-check-hook.mjs, beside this file, because a spawn prompt is
# a long, multi-line, escape-bearing JSON string value and needs REAL JSON parsing — the siblings'
# jq-free quoted-run (`[^"]*`-style) extraction — fine for their identifier-shaped fields — mis-extracts
# it (brief caveat 4).
# `node` is already a runtime requirement of this repo (ADR-014: zero devDeps, nothing new installed).
#
# Registered by build_settings() (fkit-claude.sh) as `bash "<path>"` on matcher "Agent|Task" — the same
# form as the siblings (ADR-017 rule 2: the exec bit is not guaranteed to survive install/copy). The
# .mjs is resolved beside THIS file, so a copied claude/ tree (test/prove-red.sh's mutant copies) runs
# the copy's .mjs, never the real one — same trick skill-ownership-hook.sh uses to source
# skills-for-role.sh.
#
# ⚠️ WHAT GREEN MEANS — read the .mjs header before trusting this: it checks a carry-fidelity PROXY for
# the coder's condition (b), never (b) itself (a green check does not mean the marker held); it is
# time-of-check only (TOCTOU); it covers launcher sessions only (.fkit/settings/<role>.json).
#
# FAIL-OPEN on infrastructure faults (owner ruling Q3, 2026-08-25): no `node` on PATH → allow, one loud
# stderr line. stdin is NOT consumed here — it passes straight through to the .mjs via exec.
set -u

here="$(cd "$(dirname "$0")" && pwd)"

if ! command -v node >/dev/null 2>&1; then
  echo 'carry-check-hook: node not found — carry check SKIPPED (fail-open)' >&2
  exit 0
fi

exec node "$here/carry-check-hook.mjs"
