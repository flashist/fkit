#!/bin/sh
# prove-red.sh — the mutation lane for the launcher and the skill-ownership hook (ADR-014; cut to four
# cases by ADR-057 §D3).
#
# "A test that has never failed has not been tested." This script proves the kept suites are
# load-bearing: it makes deliberately-wrong copies of claude/ and confirms the suite goes RED against
# each — and, crucially, red at the SPECIFIC assertion the mutation should trip, not merely "some
# failure." It NEVER edits the real files — every mutation is a throwaway copy, pointed at via
# FKIT_LAUNCHER or FKIT_SKILL_OWNERSHIP_HOOK. Each case runs ONLY its own test file. Not part of
# `npm test`; run it with `npm run test:prove-red`.
#
# ⚠️ Two subtleties this script exists to get right:
#   * The mutant launcher must live inside a FULL copy of claude/, not a bare file — the launcher's
#     setup runs `$here/fkit-claude-init.sh`, which needs the whole tree (scaffold/, agents/, skills/).
#     A launcher copied ALONE fails setup, and then the suite goes red because makeProject() throws in
#     `before()` — RED FOR THE WRONG REASON, proving nothing. Steps 0b / 0c (unmutated copy must be
#     green) are what certify a later red isolates to the mutation, not to broken setup.
#   * A copied launcher's install root ($share) is NOT a source checkout, so its `fkit update` would
#     reach the real `curl | sh` network installer. We drop a package.json marker in each copy so it
#     reads as a source checkout (belt-and-braces; the harness also stubs curl to a no-op).
#
# FOUR mutations, each caught by a NAMED assertion. Each mutation's own `--- Mutation N:` block below
# is the authority on what it does and why; this is the index. The numbers are kept from before the
# cut because ADR-057 and CONTRIBUTING.md cite them.
#   1. Break a skills_for_role() entry             → "reviewer × fkit-review" in
#      skill-ownership-hook.test.js                                              (task 43 / ADR-018)
#   2. Restore the pre-task-18 --resume passthrough → launcher-contract assertion 2      (task 18)
#  30. Put `exec` back on the cold start            → "12. fresh project ... then the lead" (task 0379)
#  31. The same, but on the INTAKE path ONLY        → "12b. fresh project with a completed intake" (0379)
#
# HOW TO READ A RED (task 0477). Every step block starts with `step <label>` (its printed label: 0b,
# 0c, 1, 2, 30, 31), which points $out at that step's OWN output file. When a step fails, the next
# `step` call copies its output to a `fkit-prove-red-kept.XXXXXX` dir under $TMPDIR (outside $work and
# outside the repo — the trap deletes $work, and evidence must survive it) and prints `↳ kept this
# step's output: <path>`. The final ✗ line names every failed step and the kept dir. An abnormal exit
# keeps the running step's output as `<label>-aborted.txt`. A green run creates no kept dir at all.
# ⚠️ ADDING A STEP? Give its block its own `step <label>` line FIRST, before any copy or no-op guard
# (those can set fail=1). Forget it and the run_*() guard echoes "reused", failing the step loudly.
#
# Exit 0 only if: both unmutated-copy baselines green, AND each mutation reds its NAMED assertion.
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
repo="$(cd "$here/.." && pwd)"
work="$(mktemp -d)"
# Per-step bookkeeping (task 0477) — see "HOW TO READ A RED" in the header. Set BEFORE the trap so
# `set -u` can never trip inside it.
keep=""           # the kept-output dir; created on the FIRST failure only, so a green run leaves nothing
cur_step=""       # the label of the step now running
failed_steps=""   # the labels of every step that failed, in order
any_fail=0        # the run's verdict; `fail` is reset per step, so the end reads THIS
out="$work/out/none.txt"
mkdir "$work/out"

# Copy a step's suite output OUT of $work (which the trap deletes) and say where it went. <label> <file>
# ⚠️ OUTSIDE THE REPO ON PURPOSE: keeping evidence must never itself be a write into the ai-agents/
# tree the suite under test reads (that concurrent-write race is what task 0477 was about).
keep_output() {
  if [ -z "$keep" ]; then
    tmp="${TMPDIR:-/tmp}"
    keep="$(mktemp -d "${tmp%/}/fkit-prove-red-kept.XXXXXX")"
  fi
  cp "$2" "$keep/$1.txt"
  echo "   ↳ kept this step's output: $keep/$1.txt"
}

# Start step <label>: finish the previous one (keep its output if it failed), then point $out at this
# step's OWN file. ⚠️ The `fail=0` reset is what lets a SECOND failing step be recognised — before task
# 0477 `fail` only ever went 0→1 and every step overwrote one shared output file.
step() {   # <label>
  if [ "$fail" != 0 ]; then
    if [ -e "$out" ]; then
      keep_output "${cur_step:-setup}" "$out"
    else
      echo "   ↳ step ${cur_step:-setup} failed before its suite ran — there is no suite output to keep."
    fi
    failed_steps="${failed_steps:+$failed_steps }${cur_step:-setup}"
    any_fail=1
    fail=0
  fi
  cur_step="$1"
  out="$work/out/$1.txt"
}

# On ANY non-zero exit (a `set -e` abort mid-step included), keep the current step's output if it has
# one — as <label>-aborted.txt — before $work is removed. A normal red ends after `step end`, whose
# output file never exists, so nothing is kept twice.
on_exit() {
  rc=$?
  if [ "$rc" != 0 ] && [ -n "$cur_step" ] && [ -e "$out" ]; then
    keep_output "$cur_step-aborted" "$out" || true
  fi
  rm -rf "$work"
}
trap on_exit EXIT
fail=0
# Make every copy under $work read as a source checkout → its `fkit update` exits before the network
# installer (matches the real launcher's behavior; the harness curl-stub is the second line of defense).
: > "$work/package.json"

# Every run_*() below echoes "green"/"red" AND captures the suite's output to $out — the CURRENT step's
# own file. ⚠️ Each first refuses to overwrite an existing $out and echoes "reused" instead (task 0477):
# a future step added WITHOUT its own `step` call would otherwise silently overwrite another step's
# evidence. "reused" is neither green nor red, so every baseline AND every mutation check fails loudly.
run_launcher_suite() {   # <launcher-path>
  [ ! -e "$out" ] || { echo reused; return 0; }
  if FKIT_LAUNCHER="$1" node --test "$repo/test/launcher-contract.test.js" >"$out" 2>&1; then
    echo green
  else
    echo red
  fi
}

# Run ONLY the skill-ownership-hook suite against a hook-script path; same green/red + $out contract.
# That file is redirected via FKIT_SKILL_OWNERSHIP_HOOK, not FKIT_LAUNCHER — it tests a standalone
# script, not the launcher (task 43 / ADR-018).
run_hook_suite() {   # <hook-script-path>
  [ ! -e "$out" ] || { echo reused; return 0; }
  if FKIT_SKILL_OWNERSHIP_HOOK="$1" node --test "$repo/test/skill-ownership-hook.test.js" >"$out" 2>&1; then
    echo green
  else
    echo red
  fi
}

# A full, independent copy of claude/ whose launcher we can mutate. $1 = name; echoes the launcher path.
#
# ⚠️ THE COPY IS NESTED AS $work/$1/claude — THE DIRECTORY NAME `claude` IS LOAD-BEARING (task 0247).
# The launcher derives its share as `$here/..`, and check.sh resolves the spec at
# `$share/claude/structure-spec.md` — a literal `claude` segment. A flat copy ($work/$1/fkit-claude.sh)
# makes the share $work, which has no `claude/`, so the launcher's structure-notice pass silently
# self-disarms in every copy. The per-copy package.json is the source-checkout marker for the copy's
# OWN share ($work/$1) — $work's marker does not cover it.
make_claude_copy() {
  dst="$work/$1"
  mkdir -p "$dst"
  cp -R "$repo/claude" "$dst/claude"
  : > "$dst/package.json"
  echo "$dst/claude/fkit-claude.sh"
}

fail=0

# --- 0b. An UNMUTATED full copy must be green (proves setup works from a copy) --------------------
step 0b
clean_copy="$(make_claude_copy claude-clean)"
printf '0b. unmutated full copy — launcher-contract should be green (rules out red-via-setup-failure) ... '
cc="$(run_launcher_suite "$clean_copy")"; echo "$cc"
[ "$cc" = green ] || { echo "   ✗ an UNMUTATED copy is red — mutations 2, 30 and 31 below would be false (setup, not the assertion)."; fail=1; }

# --- 0c. An UNMUTATED copy's hook-ownership-matrix suite must ALSO be green (same reasoning as 0b,
#     for run_hook_suite() rather than run_launcher_suite() — task 43 / ADR-018; round-1 review R2) -----------
step 0c
clean_hook="$(dirname "$clean_copy")/skill-ownership-hook.sh"
printf '0c. unmutated copy hook-matrix suite should be green ... '
hc="$(run_hook_suite "$clean_hook")"; echo "$hc"
[ "$hc" = green ] || { echo "   ✗ an UNMUTATED copy's hook suite is red — mutation 1 below would be false."; fail=1; }

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
step 1
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
step 2
m2="$(make_claude_copy claude-mutant-resume)"
sed -i.bak 's/^  exit 2$/  : # mutation: passthrough restored (was: exit 2)/' "$m2"
printf '2. restored --resume passthrough — assertion 2 (--resume) should go RED ... '
r2="$(run_launcher_suite "$m2")"; echo "$r2"
if [ "$r2" != red ]; then
  echo "   ✗ the suite did NOT catch the --resume passthrough regression (task 18)."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*2\. .*--resume' "$out"; then
  echo "   ✗ suite went red but NOT at assertion 2 (--resume) — red for the wrong reason."; fail=1
fi

# --- Mutation 30: put `exec` back in front of the fresh-project cold start, i.e. restore the
#     pre-0379 launcher exactly — the producer replaces the shell and the lead hand-off can never
#     happen → assertion 12 in launcher-contract.test.js must go red (task 0379). This is the whole
#     regression in one word: `exec` is invisible in a diff read quickly, costs nothing at runtime,
#     and silently deletes the second phase. Note the mutant keeps the producer phase byte-identical,
#     so 12b/12c/12d stay GREEN — only the "then the lead" assertion moves, which is what makes this
#     a proof about the hand-off rather than about the cold start in general. ---------------------
step 30
m30="$(make_claude_copy claude-mutant-coldstart-exec)"
cp "$m30" "$m30.orig"
# Anchored on the whole line so a partial match cannot land on the tail's `exec claude --agent
# "fkit-$role"`, which is a DIFFERENT exec and must not be touched. ⚠️ `%` is the delimiter, not the
# usual `/` or `|`: the target line ENDS in `|| cold_rc=$?`, and a `|`-delimited s/// would terminate
# on it. The line carries no `%`.
sed -i.bak 's%^  claude --agent fkit-producer --settings "\$settings" "\$@" "\$seed" || cold_rc=\$?$%  exec claude --agent fkit-producer --settings "$settings" "$@" "$seed" # mutation: cold start execs the producer (pre-0379)%' "$m30"
rm -f "$m30.bak"
if cmp -s "$m30" "$m30.orig"; then
  echo "30. the cold start execs the producer again ... ✗ MUTATION WAS A NO-OP — the sed no longer matches"
  echo "   the cold-start run line (has it been reworded or re-indented?). This gate is disarmed: it"
  echo "   would report success while proving nothing. Fix the mutation in test/prove-red.sh before"
  echo "   trusting any result above."
  fail=1
elif [ "$(diff "$m30.orig" "$m30" | grep -c '^>')" != 1 ]; then
  echo "30. the cold start execs the producer again ... ✗ WRONG TARGET — the sed changed more than one"
  echo "   line; it must not touch the launcher's own tail exec."; fail=1
fi
printf '30. cold start execs the producer — "12. fresh project ... then the lead" should go RED ... '
r30="$(run_launcher_suite "$m30")"; echo "$r30"
if [ "$r30" != red ]; then
  echo "   ✗ the suite did NOT catch a cold start that execs the producer and never opens the lead —"
  echo "     the fresh-project hand-off is not pinned, and 0379 could regress silently."
  fail=1
elif ! grep -Eq '(✖|not ok|fail).*12\. fresh project' "$out"; then
  echo "   ✗ suite went red but NOT at assertion 12 — red for the wrong reason."; fail=1
elif grep -Eq '(✖|not ok|fail).*12(c|d)\.' "$out"; then
  echo "   ✗ 12c/12d also went red — the mutation is broader than the hand-off it is meant to"
  echo "     prove, so a red here would not be evidence about the lead hand-off specifically."; fail=1
fi
# ⚠️ 12b IS EXPECTED TO RED HERE and is deliberately absent from the narrowness check above. It pins
# the same hand-off as 12 (on the intake-present path), so an UNCONDITIONAL `exec` must take both
# down; requiring 12b to stay green would be requiring the hole mutation 31 exists to close. 12c/12d
# are about the GATE, not the hand-off, and must still be green — they stay in the check.

# --- Mutation 31: restore `exec` on the INTAKE-PRESENT branch ONLY — the escaping mutant. It deletes
#     the lead hand-off for every owner who completes the terminal intake (i.e. every human at a real
#     terminal) and for nobody else → assertion 12b must go red (task 0379).
#
#     ⚠️ WHY THIS EXISTS ON TOP OF MUTATION 30. Mutation 30 is caught by test 12, which runs HEADLESS:
#     no tty → .fkit/interview writes no intake.md → the no-intake branch. That is the CI path, not the
#     path a person walks. This mutation is the one mutation 30 cannot see, and it was not hypothetical:
#     while 12b asserted only argvs[0], this exact mutant passed the whole launcher suite 43/43 GREEN.
#     A gate that only proves the headless path pins the hand-off proves it where nobody lives.
#
#     Its narrowness is the mirror of 30's: 12 / 12c / 12d must stay GREEN (they never create an
#     intake.md, so they run the unmutated branch), and ONLY 12b moves. -------------------------------
step 31
m31="$(make_claude_copy claude-mutant-coldstart-exec-intake)"
cp "$m31" "$m31.orig"
# One line replaced by one line, so the >1-line check below stays meaningful. Anchored on the whole
# line for the same reason as mutation 30 — it must not land on the tail's own `exec claude --agent
# "fkit-$role"`. Same `%` delimiter, and for the same reason: the line ends in `|| cold_rc=$?`.
sed -i.bak 's%^  claude --agent fkit-producer --settings "\$settings" "\$@" "\$seed" || cold_rc=\$?$%  if [ -f "$proj/.fkit/intake.md" ]; then exec claude --agent fkit-producer --settings "$settings" "$@" "$seed"; fi; claude --agent fkit-producer --settings "$settings" "$@" "$seed" || cold_rc=$? # mutation: exec on the intake path only%' "$m31"
rm -f "$m31.bak"
if cmp -s "$m31" "$m31.orig"; then
  echo "31. the cold start execs the producer on the intake path ... ✗ MUTATION WAS A NO-OP — the sed no"
  echo "   longer matches the cold-start run line (has it been reworded or re-indented?). This gate is"
  echo "   disarmed: it would report success while proving nothing. Fix the mutation in test/prove-red.sh"
  echo "   before trusting any result above."
  fail=1
elif [ "$(diff "$m31.orig" "$m31" | grep -c '^>')" != 1 ]; then
  echo "31. the cold start execs the producer on the intake path ... ✗ WRONG TARGET — the sed changed more"
  echo "   than one line; it must not touch the launcher's own tail exec."; fail=1
fi
printf '31. exec on the intake path only — "12b. fresh project with a completed intake" should go RED ... '
r31="$(run_launcher_suite "$m31")"; echo "$r31"
if [ "$r31" != red ]; then
  echo "   ✗ the suite did NOT catch a cold start that skips the lead hand-off for every owner who"
  echo "     completes the intake — the hand-off is pinned only on the headless path, which is the one"
  echo "     path no human takes. This is exactly the hole 0379's review found green at 43/43."
  fail=1
elif ! grep -Eq '(✖|not ok|fail).*12b\.' "$out"; then
  echo "   ✗ suite went red but NOT at assertion 12b — red for the wrong reason."; fail=1
elif grep -Eq '(✖|not ok|fail).*12(c|d)\.' "$out" || grep -Eq '(✖|not ok|fail).*12\. fresh project' "$out"; then
  echo "   ✗ 12 / 12c / 12d also went red — the mutation is meant to touch ONLY the intake-present"
  echo "     branch, so a red elsewhere means it is not isolating the path it claims to."; fail=1
fi

step end   # finishes step 31: keeps its output if it failed; `end` itself runs nothing

echo
if [ "$any_fail" = 0 ]; then
  echo "✓ hard gate PASSED — unmutated copies green; each mutation reds its NAMED assertion."
  exit 0
fi
echo "✗ hard gate FAILED — see above. Failed step(s): $failed_steps"
if [ -n "$keep" ]; then
  echo "   each failed step's own suite output is kept in: $keep"
fi
exit 1
