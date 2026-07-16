#!/bin/sh
# prove-red.sh — the hard gate for the launcher-contract suite (task 23 / ADR-014).
#
# "A test that has never failed has not been tested." This script proves the suite is load-bearing:
# it makes deliberately-wrong copies of the launcher and confirms the suite goes RED against each —
# and, crucially, red at the SPECIFIC assertion the mutation should trip, not merely "some failure."
# It NEVER edits the real launcher — every mutation is a throwaway copy, pointed at via FKIT_LAUNCHER
# (the suite's harness honors that env var). The real claude/fkit-claude.sh is never touched.
#
# ⚠️ Two subtleties this script exists to get right:
#   * The mutant launcher must live inside a FULL copy of claude/, not a bare file — the launcher's
#     setup runs `$here/fkit-claude-init.sh`, which needs the whole tree (scaffold/, agents/, skills/).
#     A launcher copied ALONE fails setup, and then the suite goes red because makeProject() throws in
#     `before()` — RED FOR THE WRONG REASON, proving nothing. Step 0b (unmutated copy must be green)
#     is what certifies a later red isolates to the mutation, not to broken setup.
#   * A copied launcher's install root ($share) is NOT a source checkout, so its `fkit update` would
#     reach the real `curl | sh` network installer. We drop a package.json marker in $work so the
#     copies read as source checkouts (belt-and-braces; the harness also stubs curl to a no-op).
#
# Two mutations, each caught by a NAMED assertion:
#   1. Break a skills_for_role() entry             → the matrix test for that (role, skill) pair in
#      skill-ownership-hook.test.js must go red (task 43 / ADR-018 — role↔skill correctness moved
#      out of the launcher-contract suite into that file's own exhaustive matrix; round-1 review R2).
#   2. Restore the pre-task-18 --resume passthrough → Group A assertion 2 must go red
#      (proof the suite would have caught the exact bug task 18 removed).
#
# Exit 0 only if: real launcher green, unmutated copy green, AND each mutation reds its NAMED assertion.
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$here/.." && pwd)"
launcher="$repo/claude/fkit-claude.sh"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
# Make every copy under $work read as a source checkout → its `fkit update` exits before the network
# installer (matches the real launcher's behavior; the harness curl-stub is the second line of defense).
: > "$work/package.json"

# Run the suite against a launcher path; echo "green"/"red" AND capture output to $out for inspection.
out="$work/suite-output.txt"
run_suite() {   # <launcher-path>
  if FKIT_LAUNCHER="$1" node --test "$repo"/test/*.test.js >"$out" 2>&1; then
    echo green
  else
    echo red
  fi
}

# Run ONLY the skill-ownership-hook suite against a hook-script path; same green/red + $out contract.
# Separate from run_suite() because that file is redirected via FKIT_SKILL_OWNERSHIP_HOOK, not
# FKIT_LAUNCHER — it tests a standalone script, not the launcher (task 43 / ADR-018; round-1 review R2).
run_hook_suite() {   # <hook-script-path>
  if FKIT_SKILL_OWNERSHIP_HOOK="$1" node --test "$repo/test/skill-ownership-hook.test.js" >"$out" 2>&1; then
    echo green
  else
    echo red
  fi
}

# A full, independent copy of claude/ whose launcher we can mutate. $1 = name; echoes the launcher path.
make_claude_copy() {
  dst="$work/$1"
  cp -R "$repo/claude" "$dst"
  echo "$dst/fkit-claude.sh"
}

fail=0

# --- 0a. Baseline: the REAL launcher must be green (todo-only) ------------------------------------
printf '0a. baseline — real launcher should be green ... '
base="$(run_suite "$launcher")"; echo "$base"
[ "$base" = green ] || { echo "   ✗ baseline is not green; fix the suite before trusting the gate."; fail=1; }

# --- 0b. An UNMUTATED full copy must ALSO be green (proves setup works from a copy) ---------------
clean_copy="$(make_claude_copy claude-clean)"
printf '0b. unmutated full copy should be green (rules out red-via-setup-failure) ... '
cc="$(run_suite "$clean_copy")"; echo "$cc"
[ "$cc" = green ] || { echo "   ✗ an UNMUTATED copy is red — the reds below would be false (setup, not the assertion)."; fail=1; }

# --- 0c. An UNMUTATED copy's hook-ownership-matrix suite must ALSO be green (same reasoning as 0b,
#     for run_hook_suite() rather than run_suite() — task 43 / ADR-018; round-1 review R2) -----------
clean_hook="$(dirname "$clean_copy")/skill-ownership-hook.sh"
printf '0c. unmutated copy hook-matrix suite should be green ... '
hc="$(run_hook_suite "$clean_hook")"; echo "$hc"
[ "$hc" = green ] || { echo "   ✗ an UNMUTATED copy's hook suite is red — mutation 1 below would be false."; fail=1; }

# --- Mutation 1: break the reviewer's skill ownership → the reviewer × fkit-review matrix test red -
# skills_for_role() moved to skills-for-role.sh (task 43) — the mutation targets THAT file now, not
# fkit-claude.sh, and is checked via skill-ownership-hook.test.js's own exhaustive matrix (which now
# owns role↔skill correctness), not the retired launcher-contract Group B assertion 8.
m1="$(make_claude_copy claude-mutant-skills)"
m1_lib="$(dirname "$m1")/skills-for-role.sh"
sed -i.bak 's/reviewer)  echo "fkit-team fkit-query fkit-review fkit-stateful-review"/reviewer)  echo "fkit-team fkit-query fkit-stateful-review"/' "$m1_lib"
m1_hook="$(dirname "$m1")/skill-ownership-hook.sh"
printf '1. broke skills_for_role(reviewer) — matrix "reviewer × fkit-review" should go RED ... '
r1="$(run_hook_suite "$m1_hook")"; echo "$r1"
if [ "$r1" != red ]; then
  echo "   ✗ the suite did NOT catch a broken lockdown matrix."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*reviewer × fkit-review' "$out"; then
  echo "   ✗ suite went red but NOT at the reviewer × fkit-review matrix assertion — red for the wrong reason."; fail=1
fi

# --- Mutation 2: restore the --resume passthrough → assertion 2 red -------------------------------
m2="$(make_claude_copy claude-mutant-resume)"
sed -i.bak 's/^  exit 2$/  : # mutation: passthrough restored (was: exit 2)/' "$m2"
printf '2. restored --resume passthrough — assertion 2 (--resume) should go RED ... '
r2="$(run_suite "$m2")"; echo "$r2"
if [ "$r2" != red ]; then
  echo "   ✗ the suite did NOT catch the --resume passthrough regression (task 18)."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*2\. .*--resume' "$out"; then
  echo "   ✗ suite went red but NOT at assertion 2 (--resume) — red for the wrong reason."; fail=1
fi

echo
if [ "$fail" = 0 ]; then
  echo "✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion."
  exit 0
fi
echo "✗ hard gate FAILED — see above."
exit 1
