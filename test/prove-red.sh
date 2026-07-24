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

# Run ONLY the turn-completion-hook suite against a hook-script path (task 0127 / ADR-030); redirected
# via FKIT_TURN_COMPLETION_HOOK, its own standalone-script seam (same pattern as run_hook_suite).
run_turn_hook_suite() {   # <hook-script-path>
  if FKIT_TURN_COMPLETION_HOOK="$1" node --test "$repo/test/turn-completion-hook.test.js" >"$out" 2>&1; then
    echo green
  else
    echo red
  fi
}

# Run ONLY the AskUserQuestion-marker-hook suite against a hook-script path (task 0127 / ADR-030 path 2);
# redirected via FKIT_ASKUQ_MARKER_HOOK, its own standalone-script seam.
run_marker_hook_suite() {   # <hook-script-path>
  if FKIT_ASKUQ_MARKER_HOOK="$1" node --test "$repo/test/askuserquestion-marker-hook.test.js" >"$out" 2>&1; then
    echo green
  else
    echo red
  fi
}

# Run ONLY the ship-loop-marker-hook suite against a hook-script path (task 0129); redirected via
# FKIT_SHIPLOOP_MARKER_HOOK, its own standalone-script seam.
run_shiploop_marker_suite() {   # <hook-script-path>
  if FKIT_SHIPLOOP_MARKER_HOOK="$1" node --test "$repo/test/shiploop-marker-hook.test.js" >"$out" 2>&1; then
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

# --- 0d. An UNMUTATED copy's turn-completion-hook suite must ALSO be green (task 0127 / ADR-030;
#     same reasoning as 0c, for run_turn_hook_suite()) -----------------------------------------------
clean_turn_hook="$(dirname "$clean_copy")/turn-completion-hook.sh"
printf '0d. unmutated copy turn-completion-hook suite should be green ... '
tc="$(run_turn_hook_suite "$clean_turn_hook")"; echo "$tc"
[ "$tc" = green ] || { echo "   ✗ an UNMUTATED copy's turn-completion suite is red — mutation 3 below would be false."; fail=1; }

# --- 0e. An UNMUTATED copy's AskUserQuestion-marker-hook suite must ALSO be green (task 0127 path 2) --
clean_marker_hook="$(dirname "$clean_copy")/askuserquestion-marker-hook.sh"
printf '0e. unmutated copy marker-hook suite should be green ... '
mc="$(run_marker_hook_suite "$clean_marker_hook")"; echo "$mc"
[ "$mc" = green ] || { echo "   ✗ an UNMUTATED copy's marker-hook suite is red — mutation 5 below would be false."; fail=1; }

# --- 0f. An UNMUTATED copy's ship-loop-marker-hook suite must ALSO be green (task 0129) --------------
clean_shiploop_hook="$(dirname "$clean_copy")/shiploop-marker-hook.sh"
printf '0f. unmutated copy ship-loop-marker-hook suite should be green ... '
sc="$(run_shiploop_marker_suite "$clean_shiploop_hook")"; echo "$sc"
[ "$sc" = green ] || { echo "   ✗ an UNMUTATED copy's ship-loop-marker suite is red — mutation 7 below would be false."; fail=1; }

# --- Mutation 1: break the reviewer's skill ownership → the reviewer × fkit-review matrix test red -
# skills_for_role() moved to skills-for-role.sh (task 43) — the mutation targets THAT file now, not
# fkit-claude.sh, and is checked via skill-ownership-hook.test.js's own exhaustive matrix (which now
# owns role↔skill correctness), not the retired launcher-contract Group B assertion 8.
#
# ⚠️ THE MUTATION IS ROSTER-INDEPENDENT ON PURPOSE, AND THIS IS PAID FOR BY A REAL FAILURE.
# It used to match the reviewer's ENTIRE skill list byte-for-byte. Task 70 added one skill to that
# line, the `sed` silently stopped matching, and the "mutant" became identical to the original — so
# mutation 1 tested nothing. It failed loudly (`✗ hard gate FAILED`), but ONLY to whoever ran this
# script, and `npm test` did not run it. A green suite hid a disarmed hard gate.
#
# So: anchor on the `reviewer)` arm and delete ONLY the `fkit-review` token from it. Adding, removing
# or reordering any other skill cannot break this. The post-condition below is the real guard —
# it FAILS THE RUN if the mutation was a no-op, so this can never again silently prove nothing.
m1="$(make_claude_copy claude-mutant-skills)"
m1_lib="$(dirname "$m1")/skills-for-role.sh"
cp "$m1_lib" "$m1_lib.orig"
# Strip the standalone `fkit-review` token from the reviewer arm only. The trailing-space alternation
# keeps `fkit-review` from matching inside `fkit-review-something` and leaves `fkit-stateful-review`
# untouched (different token, and not a suffix match because we anchor on the space/quote boundary).
sed -i.bak -E 's/^([ \t]*reviewer\)[ \t]*echo "[^"]*)fkit-review ([^"]*")/\1\2/' "$m1_lib"
if cmp -s "$m1_lib" "$m1_lib.orig"; then
  echo "1. broke skills_for_role(reviewer) ... ✗ MUTATION WAS A NO-OP — the sed no longer matches."
  echo "   This gate is disarmed: it would report success while proving nothing. Fix the mutation in"
  echo "   test/prove-red.sh before trusting any result below."
  fail=1
fi
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

# --- Mutation 3: disable check B (force "What's next?" always-present) → the "B missing -> block"
#     assertion in turn-completion-hook.test.js must go red (task 0127 / ADR-030). Proves the Stop
#     hook's primary, EXACT check is actually enforced by the suite, not merely present. -------------
m3="$(make_claude_copy claude-mutant-checkb)"
m3_hook="$(dirname "$m3")/turn-completion-hook.sh"
cp "$m3_hook" "$m3_hook.orig"
# Initialise the "missing" flag to 0 instead of 1: the heading-present case only ever sets it to 0, so
# with a 0 default check B can never fire — every reply reads as if it closed with "What's next?".
sed -i.bak 's/^whats_next_missing=1$/whats_next_missing=0/' "$m3_hook"
if cmp -s "$m3_hook" "$m3_hook.orig"; then
  echo "3. disabled check B ... ✗ MUTATION WAS A NO-OP — the sed no longer matches."
  echo "   This gate is disarmed: it would report success while proving nothing. Fix the mutation in"
  echo "   test/prove-red.sh before trusting any result below."
  fail=1
fi
printf '3. disabled check B — turn-completion "B: message with no ..." should go RED ... '
r3="$(run_turn_hook_suite "$m3_hook")"; echo "$r3"
if [ "$r3" != red ]; then
  echo "   ✗ the suite did NOT catch a disabled check B."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*B: message with no' "$out"; then
  echo "   ✗ suite went red but NOT at the check-B assertion — red for the wrong reason."; fail=1
fi

# --- Mutation 4: a present marker no longer suppresses check A → the R1-regression assertion in
#     turn-completion-hook.test.js must go red (task 0127 / ADR-030 path 2). This is THE defect the
#     path-2 rework fixed (a turn that used AskUserQuestion was being false-blocked) — pin that the
#     suite actually catches its return. ---------------------------------------------------------------
m4="$(make_claude_copy claude-mutant-marker)"
m4_hook="$(dirname "$m4")/turn-completion-hook.sh"
cp "$m4_hook" "$m4_hook.orig"
# Neutralise the marker read: had_marker can never become 1, so a present marker stops suppressing A.
sed -i.bak 's/had_marker=1/had_marker=0/' "$m4_hook"
if cmp -s "$m4_hook" "$m4_hook.orig"; then
  echo "4. marker no longer suppresses A ... ✗ MUTATION WAS A NO-OP — the sed no longer matches."
  echo "   Fix the mutation in test/prove-red.sh before trusting any result below."
  fail=1
fi
printf '4. marker stops suppressing A — turn-completion "A/R1 regression: marker present" should go RED ... '
r4="$(run_turn_hook_suite "$m4_hook")"; echo "$r4"
if [ "$r4" != red ]; then
  echo "   ✗ the suite did NOT catch the R1 regression returning."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*A/R1 regression: marker present' "$out"; then
  echo "   ✗ suite went red but NOT at the R1-regression assertion — red for the wrong reason."; fail=1
fi

# --- Mutation 5: the marker hook records for EVERY tool, not just AskUserQuestion → the
#     "non-AskUserQuestion tool → writes NO marker" assertion must go red (task 0127 path 2). Proves the
#     tool gate is actually enforced by the suite. --------------------------------------------------
m5="$(make_claude_copy claude-mutant-markergate)"
m5_hook="$(dirname "$m5")/askuserquestion-marker-hook.sh"
cp "$m5_hook" "$m5_hook.orig"
# Drop the early-exit on a non-AskUserQuestion tool: `|| allow` → `|| :`, so any tool falls through and
# writes the marker.
sed -i.bak 's/"AskUserQuestion" ] || allow/"AskUserQuestion" ] || :/' "$m5_hook"
if cmp -s "$m5_hook" "$m5_hook.orig"; then
  echo "5. marker gate removed ... ✗ MUTATION WAS A NO-OP — the sed no longer matches."
  echo "   Fix the mutation in test/prove-red.sh before trusting any result below."
  fail=1
fi
printf '5. marker records for any tool — marker-hook "a non-AskUserQuestion tool" should go RED ... '
r5="$(run_marker_hook_suite "$m5_hook")"; echo "$r5"
if [ "$r5" != red ]; then
  echo "   ✗ the suite did NOT catch a removed tool gate."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*a non-AskUserQuestion tool' "$out"; then
  echo "   ✗ suite went red but NOT at the tool-gate assertion — red for the wrong reason."; fail=1
fi

# --- Mutation 6: disable the transcript-independent ship-loop marker read (SKIP 3) → the
#     "SKIP: a ship-loop session marker present" test must go red (task 0129). Proves the marker-based
#     skip is actually enforced by the suite, not merely present. ---------------------------------------
m6="$(make_claude_copy claude-mutant-shiploop)"
m6_hook="$(dirname "$m6")/turn-completion-hook.sh"
cp "$m6_hook" "$m6_hook.orig"
# Neutralise the marker existence check so the ship-loop skip can never fire.
sed -i.bak 's#\[ -e "$cwd/.fkit/state/shiploop-$session_id" \]#false#' "$m6_hook"
if cmp -s "$m6_hook" "$m6_hook.orig"; then
  echo "6. disabled the ship-loop marker read ... ✗ MUTATION WAS A NO-OP — the sed no longer matches."
  echo "   Fix the mutation in test/prove-red.sh before trusting any result below."
  fail=1
fi
printf '6. ship-loop marker read disabled — turn-completion "SKIP: a ship-loop session marker present" should go RED ... '
r6="$(run_turn_hook_suite "$m6_hook")"; echo "$r6"
if [ "$r6" != red ]; then
  echo "   ✗ the suite did NOT catch a disabled ship-loop marker skip."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*SKIP: a ship-loop session marker present' "$out"; then
  echo "   ✗ suite went red but NOT at the ship-loop marker-skip assertion — red for the wrong reason."; fail=1
fi

# --- Mutation 7: remove the ship-loop-marker hook's command_name gate (writes the marker for ANY
#     command) → the "a NON-ship-loop command → writes nothing" assertion must go red (task 0129 review
#     R3). Proves the WRITER's self-filter — which IS the R8 fix — is load-bearing, not just the reader. -
m7="$(make_claude_copy claude-mutant-shiploopgate)"
m7_hook="$(dirname "$m7")/shiploop-marker-hook.sh"
cp "$m7_hook" "$m7_hook.orig"
# Drop the default arm's early-exit: `*) allow ;;` → `*) : ;;`, so any command_name falls through and
# writes the marker.
sed -i.bak 's/^  \*) allow ;;/  *) : ;;/' "$m7_hook"
if cmp -s "$m7_hook" "$m7_hook.orig"; then
  echo "7. ship-loop marker gate removed ... ✗ MUTATION WAS A NO-OP — the sed no longer matches."
  echo "   Fix the mutation in test/prove-red.sh before trusting any result below."
  fail=1
fi
printf '7. ship-loop marker records for any command — marker-hook "a NON-ship-loop command" should go RED ... '
r7="$(run_shiploop_marker_suite "$m7_hook")"; echo "$r7"
if [ "$r7" != red ]; then
  echo "   ✗ the suite did NOT catch a removed command_name gate (the R8 fix is not mutation-covered)."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*a NON-ship-loop command' "$out"; then
  echo "   ✗ suite went red but NOT at the command-gate assertion — red for the wrong reason."; fail=1
fi

echo
if [ "$fail" = 0 ]; then
  echo "✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion."
  exit 0
fi
echo "✗ hard gate FAILED — see above."
exit 1
