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
# TWENTY-TWO mutations, each caught by a NAMED assertion. ⚠️ KEEP THIS LIST IN STEP WHEN YOU ADD ONE — it
# read "Two mutations" while seven more sat below it (task 0136 round-1 review R5), in the one file
# whose entire thesis is that an unexercised gate hides drift. Each mutation's own `--- Mutation N:`
# block below is the authority on what it does and why; this is the index.
#   1. Break a skills_for_role() entry             → the matrix test for that (role, skill) pair in
#      skill-ownership-hook.test.js must go red (task 43 / ADR-018 — role↔skill correctness moved
#      out of the launcher-contract suite into that file's own exhaustive matrix; round-1 review R2).
#   2. Restore the pre-task-18 --resume passthrough → Group A assertion 2 must go red
#      (proof the suite would have caught the exact bug task 18 removed).
#   3. Disable the Stop hook's check B              → "B: message with no ..."            (task 0127)
#   4. A present marker stops suppressing check A   → "A/R1 regression: marker present"   (task 0127)
#   5. Remove the marker hook's tool gate           → "a non-AskUserQuestion tool"        (task 0127)
#   6. Disable the ship-loop marker read            → "SKIP: a ship-loop session marker"  (task 0129)
#   7. Remove the ship-loop marker's command gate   → "a NON-ship-loop command"           (task 0129)
#   8. One `description: >-` back to a plain scalar → "live corpus: every skill SKILL"    (task 0136)
#   9. De-indent a description continuation line    → "live corpus: every skill SKILL"    (task 0136)
#  10. Delete a scaffold copy of a dual-homed file  → "present in BOTH homes"             (task 0133)
#  11. Add a scaffold file with no live counterpart → "present in BOTH homes"             (task 0133)
#  12. Append one byte to a scaffold copy           → "byte-identical"                    (task 0133)
#  13. Co-present file under a prune point          → "no prune point hides a file"       (task 0133)
#  14. Revert dashboard.sh's move-target extractor  → "0210/A"                            (task 0210)
#  15. Remove the launcher's structure_notice call  → "0247/drifted"                      (task 0247)
#  16. Neuter the update banner's version guard     → "0257/equal-versions"                (task 0257)
#  17. Restore the banner's ${rver:-?} placeholder  → "0257/no-curl"                       (task 0257)
#  18. Make the --no-tag summary branch unreachable → "0288/no-tag"                        (task 0288)
#  19. tagOnOrigin → the naive `doTag && doPush`    → "0288/local-only-tag"                (task 0288)
#  20. Peel comparison → a plain existence check    → "0288/stale-origin-tag"              (task 0288)
#  21. Strip the verify command's speaking tail     → "0288/failure-speaks"                (task 0288)
#  22. Make the ✓ Released headline unreachable     → "0288/default-released"              (task 0288)
#
# ⚠️ MUTATIONS 18-22 ARE THE FIRST TO TARGET `bin/`, NOT A COPIED LAUNCHER TREE (task 0288). Their seam
# is FKIT_RELEASE_MJS — a SINGLE-FILE redirect (the FKIT_LAUNCHER pattern, not the whole-tree
# FKIT_FRONTMATTER_ROOT one), because test/release-summary.test.js copies the script into a throwaway
# git fixture of its own and runs it there, so a mutant needs no surrounding tree. The real
# bin/release.mjs is never touched — every mutation edits a bare copy under $work.
#
# ⚠️ MUTATION 18 IS SCOPED TO THE SUMMARY BLOCK ON PURPOSE, and that is not fussiness: the string
# `} else if (!doTag) {` occurs TWICE in bin/release.mjs — once in the EXECUTE section (the skip-tag
# step) and once in the summary. A plain `sed` hits the execute one, mutating the tag logic that task
# 0288 is fenced away from and proving nothing about the summary. The awk below only fires after the
# `// --- summary ---` marker line. The other four anchors were verified unique before being used.
#
# ⚠️ MUTATION 14 REACHES ITS TARGET WITHOUT AN ENV SEAM, and that is deliberate — it is the one
# exception to the "pointed at via FKIT_LAUNCHER" phrasing above. dashboard-contract.test.js resolves
# the script under test as `join(REPO, 'claude', 'skills', 'fkit-status', 'dashboard.sh')`, and
# harness.mjs derives REPO as the parent of its OWN directory. So copying `claude/` AND `test/` into one
# throwaway root and running the COPIED test file makes the copied test hit the copied script — no env
# var, no edit to either file. 0210's plan recorded the opposite (that covering this "requires
# introducing a `dashboard.sh` path override into both the suite and prove-red.sh — a test-architecture
# change"); its round-1 review refuted that by execution, and this mutation is the correction. The
# never-touch-the-real-file invariant is untouched: the mutation still only ever edits a copy under
# $work.
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

# Run ONLY the skill-frontmatter suite against a COPY of claude/ (task 0136); redirected via
# FKIT_FRONTMATTER_ROOT, its own tree seam. Unlike the hook seams above this points at a whole
# directory, not one script — the suite audits every skills/*/SKILL.md and agents/*.md under it.
run_frontmatter_suite() {   # <claude-tree-root>
  if FKIT_FRONTMATTER_ROOT="$1" node --test "$repo/test/skill-frontmatter.test.js" >"$out" 2>&1; then
    echo green
  else
    echo red
  fi
}

# Run ONLY the dual-home-parity suite against a copy of the SCAFFOLD home (task 0133); redirected via
# FKIT_PARITY_SCAFFOLD_ROOT, its own tree seam. Like run_frontmatter_suite() this points at a whole
# directory, not one script — the suite walks it against the real, untouched `ai-agents/` live home.
# ⚠️ SCAFFOLD-SIDE ONLY, ON PURPOSE. All four parity mutations are expressible by editing the scaffold
# copy (delete / add / alter / plant-under-a-prune-point), so the live tree needs no seam at all and a
# stale env var can never redirect fkit's own working tree.
run_parity_suite() {   # <scaffold-home-root>
  if FKIT_PARITY_SCAFFOLD_ROOT="$1" node --test "$repo/test/dual-home-parity.test.js" >"$out" 2>&1; then
    echo green
  else
    echo red
  fi
}

# Run ONLY the dashboard-contract suite FROM a copied repo root (task 0210). ⚠️ THE ODD ONE OUT: it
# runs the COPY's test file, not this repo's, and passes NO env var at all. That is the whole seam —
# harness.mjs derives REPO from its own location, and dashboard-contract.test.js joins REPO with
# `claude/skills/fkit-status/dashboard.sh`, so a test file sitting in the copy resolves the copy's
# script by construction. Deliberately NOT exported: FKIT_LAUNCHER must stay unset here, or the copy's
# harness would announce and use some other launcher (harmless for this suite, misleading in the log).
run_dashboard_suite() {   # <repo-copy-root>
  if node --test "$1/test/dashboard-contract.test.js" >"$out" 2>&1; then
    echo green
  else
    echo red
  fi
}

# Run ONLY the update-banner suite against a copy of the claude/ tree (task 0257); redirected via
# FKIT_BANNER_ROOT, its own tree seam — the FKIT_FRONTMATTER_ROOT pattern (a whole directory, not one
# script), because that suite copies the tree into a fake INSTALL ROOT of its own rather than running
# the launcher in place.
# ⚠️ NOT run_suite(). Two reasons, and both matter: (1) the banner suite is the only file that must
# NOT inherit FKIT_NO_UPDATE_CHECK=1, so it builds its own fixture and ignores FKIT_LAUNCHER
# entirely — run_suite() would leave it testing the REAL launcher and report a false green; (2) it
# keeps `fkit update`'s network path out of this seam altogether.
# ⚠️ The `: > "$dst/package.json"` that make_claude_copy writes sits OUTSIDE the copied claude/ dir,
# so the banner suite's own install root never inherits that source-checkout marker — which is what
# it needs, since a source checkout skips the whole update check and would silence every case.
run_banner_suite() {   # <claude-tree-root>
  if FKIT_BANNER_ROOT="$1" node --test "$repo/test/update-banner.test.js" >"$out" 2>&1; then
    echo green
  else
    echo red
  fi
}

# Run ONLY the release-summary suite against a bin/release.mjs path (task 0288); redirected via
# FKIT_RELEASE_MJS, its own standalone-script seam — the run_hook_suite() pattern (ONE file, not a
# tree). ⚠️ NOT run_suite(): that file is about bin/release.mjs, not the launcher, and passing
# FKIT_LAUNCHER would leave it testing the real release.mjs and report a false green.
# ⚠️ Each run builds seven throwaway git fixtures (a bare origin + a working clone each), so it is the
# slowest seam here — ~25s. Six runs below (baseline + five mutants) is the cost the owner accepted.
run_release_suite() {   # <release.mjs path>
  if FKIT_RELEASE_MJS="$1" node --test "$repo/test/release-summary.test.js" >"$out" 2>&1; then
    echo green
  else
    echo red
  fi
}

# An independent copy of bin/release.mjs we can mutate. $1 = name; echoes the copy's path.
# ⚠️ A BARE FILE COPY IS CORRECT HERE, unlike make_claude_copy()'s whole-tree copy: release-summary's
# fixtures copy the script into a throwaway repo of their own and run it there, and release.mjs derives
# its KIT as `resolve(__dirname, "..")` — i.e. that fixture, never this repo. Nothing else is needed.
make_release_copy() {
  dst="$work/$1.mjs"
  cp "$repo/bin/release.mjs" "$dst"
  echo "$dst"
}

# An independent copy of the SCAFFOLD home we can mutate. $1 = name; echoes the copy's root.
make_scaffold_copy() {
  dst="$work/$1"
  cp -R "$repo/claude/scaffold/ai-agents" "$dst"
  echo "$dst"
}

# A full, independent copy of claude/ whose launcher we can mutate. $1 = name; echoes the launcher path.
#
# ⚠️ THE COPY IS NESTED AS $work/$1/claude — THE DIRECTORY NAME `claude` IS LOAD-BEARING (task 0247).
# The launcher derives its share as `$here/..`, and check.sh resolves the spec at
# `$share/claude/structure-spec.md` — a literal `claude` segment. The old flat layout
# ($work/$1/fkit-claude.sh) made every copy's share $work, which has no `claude/`, so the
# structure-notice pass silently self-disarmed (check.sh exit 2 → guard → silence) in every copied
# launcher: step 0b would red on the notice suite's drifted case, red-via-layout, proving nothing.
# make_repo_copy below already nests for the same reason. The per-copy package.json is the
# source-checkout marker for the copy's OWN share ($work/$1) — $work's marker no longer covers it.
make_claude_copy() {
  dst="$work/$1"
  mkdir -p "$dst"
  cp -R "$repo/claude" "$dst/claude"
  : > "$dst/package.json"
  echo "$dst/claude/fkit-claude.sh"
}

# A copy of BOTH `claude/` and `test/` under one root — the seam run_dashboard_suite() needs (task
# 0210). Copying `claude/` alone is not enough and copying `test/` alone is not enough: it is the two
# living under a common parent that makes the copied harness's REPO point at the copied script.
# $1 = name; echoes the copy root.
#
# ⚠️ THE package.json COPY IS LOAD-BEARING, NOT TIDINESS. $work carries an EMPTY package.json (the
# source-checkout marker written at the top of this script), and node resolves a `.js` file's module
# type from the NEAREST PARENT package.json. Without a valid one in the copy root, node walks up to
# that empty file and dies with ERR_INVALID_PACKAGE_CONFIG before loading anything — every test in the
# copy fails at import, so the suite is red no matter what the mutation did. Caught by step 0i on the
# first run of this mutation, which is exactly what 0i is for. The repo's own package.json is copied
# rather than a synthetic `{}` so the copy resolves modules identically to a real `npm test` run (no
# `"type"` field → node's syntax detection treats the ESM test files as ESM, same as here).
make_repo_copy() {
  dst="$work/$1"
  mkdir -p "$dst"
  cp -R "$repo/claude" "$dst/claude"
  cp -R "$repo/test" "$dst/test"
  cp "$repo/package.json" "$dst/package.json"
  echo "$dst"
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

# --- 0g. An UNMUTATED copy's skill-frontmatter suite must ALSO be green (task 0136; same reasoning
#     as 0b — without this, a red below could be red-via-setup and would prove nothing). The root is
#     the copied claude/ tree itself, which is what $clean_copy sits inside. -------------------------
clean_tree="$(dirname "$clean_copy")"
printf '0g. unmutated copy skill-frontmatter suite should be green ... '
fc="$(run_frontmatter_suite "$clean_tree")"; echo "$fc"
[ "$fc" = green ] || { echo "   ✗ an UNMUTATED copy's frontmatter suite is red — mutations 8/9 below would be false."; fail=1; }

# --- 0h. An UNMUTATED copy of the scaffold home must ALSO be green (task 0133; same reasoning as 0b
#     and 0g — without this, a red below could be red-because-the-copy-is-broken and would prove
#     nothing). Note this also proves `cp -R` of the scaffold home is faithful: if the copy dropped a
#     file, mutation 10's red would be indistinguishable from a copy artifact. -----------------------
clean_scaffold="$(make_scaffold_copy scaffold-clean)"
printf '0h. unmutated copy of the scaffold home should be green ... '
pc="$(run_parity_suite "$clean_scaffold")"; echo "$pc"
[ "$pc" = green ] || { echo "   ✗ an UNMUTATED scaffold copy is red — mutations 10-13 below would be false."; fail=1; }

# --- 0i. An UNMUTATED repo copy's dashboard suite must ALSO be green (task 0210; same reasoning as 0b
#     and 0h). This one carries EXTRA weight: it is the only proof that the copy-root seam works at
#     all. If `test/` and `claude/` did not land side by side, the copied test would resolve some other
#     path, and mutation 14's red would be red-because-the-copy-is-wrong. ---------------------------
clean_repo="$(make_repo_copy repo-clean)"
printf '0i. unmutated repo copy dashboard suite should be green ... '
dc="$(run_dashboard_suite "$clean_repo")"; echo "$dc"
[ "$dc" = green ] || { echo "   ✗ an UNMUTATED repo copy's dashboard suite is red — mutation 14 below would be false."; fail=1; }

# --- 0j. An UNMUTATED copy's update-banner suite must ALSO be green (task 0257; same reasoning as 0b
#     and 0g). The root is the copied claude/ tree — the same $clean_tree 0g uses. ------------------
printf '0j. unmutated copy update-banner suite should be green ... '
bc="$(run_banner_suite "$clean_tree")"; echo "$bc"
[ "$bc" = green ] || { echo "   ✗ an UNMUTATED copy's banner suite is red — mutations 16/17 below would be false."; fail=1; }

# --- 0k. An UNMUTATED copy of bin/release.mjs must ALSO be green (task 0288; same reasoning as 0b and
#     0h). This one carries the usual extra weight for a NEW seam: it is the only proof that
#     FKIT_RELEASE_MJS is honoured at all. If the env var were ignored, every mutation below would run
#     against the REAL release.mjs, all five would come back green, and the gate would report five
#     disarmed mutations as five failures to catch — or, worse, a later refactor could make them pass
#     for the wrong reason. ---------------------------------------------------------------------------
clean_release="$(make_release_copy release-clean)"
printf '0k. unmutated copy of bin/release.mjs should be green ... '
rlc="$(run_release_suite "$clean_release")"; echo "$rlc"
[ "$rlc" = green ] || { echo "   ✗ an UNMUTATED release.mjs copy is red — mutations 18-22 below would be false."; fail=1; }

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

# --- Mutation 8: turn one skill's `description: >-` back into a PLAIN scalar → the live-corpus skills
#     assertion in skill-frontmatter.test.js must go red (task 0136). This is the state ALL 25 skills
#     were in before 0136, and the shape 0123 broke by putting a colon on a continuation line. Proves
#     the STRUCTURAL rule (R5) is actually enforced by the suite rather than merely present. ---------
m8_tree="$work/claude-mutant-plainscalar"
cp -R "$repo/claude" "$m8_tree"
m8_file="$m8_tree/skills/fkit-team/SKILL.md"
cp "$m8_file" "$m8_file.orig"
# Splice the first content line up onto the key line and drop the `>-`, i.e. exactly the plain-scalar
# shape the conversion replaced. awk rather than sed because this is a two-line join.
awk '
  BEGIN { done = 0 }
  /^description: >-$/ && done == 0 {
    done = 1
    getline nxt
    sub(/^[ \t]+/, "", nxt)
    print "description: " nxt
    next
  }
  { print }
' "$m8_file.orig" > "$m8_file"
if cmp -s "$m8_file" "$m8_file.orig"; then
  echo "8. plain-scalar description ... ✗ MUTATION WAS A NO-OP — the awk no longer matches."
  echo "   This gate is disarmed: it would report success while proving nothing. Fix the mutation in"
  echo "   test/prove-red.sh before trusting any result below."
  fail=1
fi
printf '8. one description back to a PLAIN scalar — "live corpus: every skill SKILL" should go RED ... '
r8="$(run_frontmatter_suite "$m8_tree")"; echo "$r8"
if [ "$r8" != red ]; then
  echo "   ✗ the suite did NOT catch a plain-scalar description — the structural rule is not load-bearing."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*live corpus: every skill SKILL' "$out"; then
  echo "   ✗ suite went red but NOT at the live-corpus skills assertion — red for the wrong reason."; fail=1
fi

# --- Mutation 9: de-indent a continuation line of fkit-sprint-ship-loop's description → the SAME
#     named assertion must go red, by a DIFFERENT violation (task 0136). This is the one hazard a
#     block scalar does not absorb: a de-indented line still ends the scalar, silently truncating the
#     description. fkit-sprint-ship-loop is deliberately the target — it is the file 0123 broke. -----
m9_tree="$work/claude-mutant-deindent"
cp -R "$repo/claude" "$m9_tree"
m9_file="$m9_tree/skills/fkit-sprint-ship-loop/SKILL.md"
cp "$m9_file" "$m9_file.orig"
# Strip the indent from the SECOND content line of the block scalar (anchored on structure, not on the
# description's wording, so a future rewrap cannot silently disarm this).
awk '
  BEGIN { infold = 0; n = 0 }
  {
    if (infold == 1) {
      n++
      if (n == 2) { sub(/^[ \t]+/, ""); print; next }
    }
    if ($0 == "description: >-") { infold = 1 }
    print
  }
' "$m9_file.orig" > "$m9_file"
if cmp -s "$m9_file" "$m9_file.orig"; then
  echo "9. de-indented continuation line ... ✗ MUTATION WAS A NO-OP — the awk no longer matches."
  echo "   This gate is disarmed: it would report success while proving nothing. Fix the mutation in"
  echo "   test/prove-red.sh before trusting any result below."
  fail=1
fi
printf '9. de-indented continuation line — "live corpus: every skill SKILL" should go RED ... '
r9="$(run_frontmatter_suite "$m9_tree")"; echo "$r9"
if [ "$r9" != red ]; then
  echo "   ✗ the suite did NOT catch a de-indented continuation line. NOTE: if the de-indented line"
  echo "     now happens to read as \`word: value\`, it is indistinguishable from a real frontmatter"
  echo "     key — see skill-frontmatter.test.js's documented residual — and the mutation must move."
  fail=1
elif ! grep -Eq '(✖|not ok|fail).*live corpus: every skill SKILL' "$out"; then
  echo "   ✗ suite went red but NOT at the live-corpus skills assertion — red for the wrong reason."; fail=1
fi

# --- Mutation 10: DELETE a dual-homed file from the scaffold home → the presence assertion must go red
#     (task 0133). This is the `dependency-declaration-form.md` shape, which sat undetected for weeks:
#     a live file that was never shipped to the scaffold. A naive "for each scaffold file, compare to
#     live" loop is structurally blind to it — there is nothing in the scaffold to iterate over — so
#     this mutation is the one that proves the walk is over the UNION, not over one side. ------------
m10="$(make_scaffold_copy scaffold-mutant-missing)"
m10_file="$m10/tasks/README.md"
if [ ! -e "$m10_file" ]; then
  echo "10. deleted a scaffold copy ... ✗ MUTATION WAS A NO-OP — tasks/README.md is not in the copy."
  echo "   This gate is disarmed: it would report success while proving nothing. Point the mutation at"
  echo "   a file that IS on the enforced set (derive it: the union walk minus the exception list)."
  fail=1
fi
rm -f "$m10_file"
printf '10. deleted a dual-homed scaffold copy — parity "present in BOTH homes" should go RED ... '
r10="$(run_parity_suite "$m10")"; echo "$r10"
if [ "$r10" != red ]; then
  echo "   ✗ the suite did NOT catch a file missing from the scaffold — the union walk is not load-bearing."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*present in BOTH homes' "$out"; then
  echo "   ✗ suite went red but NOT at the presence assertion — red for the wrong reason."; fail=1
fi

# --- Mutation 11: ADD a scaffold file with no live counterpart → the SAME named assertion, by the
#     OPPOSITE violation (task 0133; brief verification step 3). Both directions matter: a file the
#     scaffold ships and the live tree does not have is one nobody here maintains and no test covers. -
m11="$(make_scaffold_copy scaffold-mutant-extra)"
m11_rel="knowledge-base/conventions/ghost-parity-probe.md"
if [ -e "$repo/ai-agents/$m11_rel" ]; then
  echo "11. added a scaffold-only file ... ✗ MUTATION WAS A NO-OP — a LIVE counterpart now exists at"
  echo "   ai-agents/$m11_rel, so this is no longer the scaffold-only case. Rename the probe file."
  fail=1
fi
printf 'a file the live tree does not have\n' > "$m11/$m11_rel"
printf '11. added a scaffold-only file — parity "present in BOTH homes" should go RED ... '
r11="$(run_parity_suite "$m11")"; echo "$r11"
if [ "$r11" != red ]; then
  echo "   ✗ the suite did NOT catch a scaffold-only file — the reverse direction is not enforced."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*present in BOTH homes' "$out"; then
  echo "   ✗ suite went red but NOT at the presence assertion — red for the wrong reason."; fail=1
fi

# --- Mutation 12: APPEND ONE BYTE to a dual-homed scaffold copy → the byte assertion must go red
#     (task 0133; brief verification step 4).
#
#     ⚠️ APPEND, NOT `sed`. An anchored `sed` on prose is exactly how mutation 1 silently disarmed
#     itself for a whole task: the file's wording changed, the pattern stopped matching, the "mutant"
#     became byte-identical to the original, and the gate reported success while proving nothing.
#     `>>` cannot stop matching — it has no pattern. The no-op guard below is still kept, because a
#     read-only or vanished file would make even an append a no-op. ---------------------------------
m12="$(make_scaffold_copy scaffold-mutant-drift)"
m12_file="$m12/knowledge-base/conventions/task-owner-vocabulary.md"
# ⚠️ THE EXISTENCE CHECK IS THE REAL GUARD HERE, and it is not redundant with the `cmp` below.
# `>>` CREATES a missing file. So if this path is ever renamed, the append silently manufactures a
# brand-new scaffold-only file instead of drifting an enforced one — the suite still goes red, but at
# the PRESENCE assertion, not the byte one, and the mutation has stopped testing what it claims to.
# Verified by disarming the probe by hand: without this check the run reported "red for the wrong
# reason" and never named the no-op.
if [ ! -e "$m12_file" ]; then
  echo "12. appended a byte ... ✗ MUTATION WAS A NO-OP — task-owner-vocabulary.md is not in the copy."
  echo "   \`>>\` would CREATE it, turning this into a scaffold-only-file mutation by accident. Point"
  echo "   the mutation at a file that IS on the enforced set."
  fail=1
fi
cp "$m12_file" "$m12_file.orig" 2>/dev/null || :
printf 'x' >> "$m12_file" 2>/dev/null || :
# ⚠️ THE `.orig` EXISTENCE TEST IS PART OF THE GUARD, not belt-and-braces (round-1 review R5). Both
# commands above swallow their own failure, and if the COPY is the one that failed there is no `.orig`
# to compare against: `cmp` then exits non-zero as an ERROR, so a bare `cmp -s` reads it as "not a
# no-op" and the run reports "red for the wrong reason" instead of naming the disarmed mutation.
if [ ! -e "$m12_file.orig" ] || cmp -s "$m12_file" "$m12_file.orig"; then
  echo "12. appended a byte ... ✗ MUTATION WAS A NO-OP — the append did not change the file, or the"
  echo "   \`.orig\` snapshot could not be written, so the mutation cannot be verified at all."
  echo "   Fix the mutation in test/prove-red.sh before trusting any result below."
  fail=1
fi
rm -f "$m12_file.orig"
printf '12. appended one byte to a dual-homed scaffold copy — parity "byte-identical" should go RED ... '
r12="$(run_parity_suite "$m12")"; echo "$r12"
if [ "$r12" != red ]; then
  echo "   ✗ the suite did NOT catch byte drift — the parity assertion is not load-bearing."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*byte-identical' "$out"; then
  echo "   ✗ suite went red but NOT at the byte-identical assertion — red for the wrong reason."; fail=1
fi

# --- Mutation 13: plant a CO-PRESENT file under a prune point → the tripwire must go red (task 0133,
#     from task 0132's hand-off note). The prune points are blankets: `knowledge-base/reports/` and
#     friends excuse everything beneath them so the bulk `Only in` noise is classifiable. The hole that
#     opens is a genuinely dual-homed file added under one of them LATER — silently exempt from
#     byte-parity instead of enforced by it.
#
#     The probe is 0132's OWN NAMED NEAR-MISS, not a synthetic name: `knowledge-base/reports/README.md`
#     is a folder-purpose doc of the same species as `tasks/README.md` (which IS dual-homed and IS
#     enforced). It exists live today and does not exist in the scaffold; ship it, and it lands under
#     the blanket. Copying it into the mutant scaffold makes exactly that future real, today. --------
m13="$(make_scaffold_copy scaffold-mutant-tripwire)"
m13_rel="knowledge-base/reports/README.md"
if [ ! -e "$repo/ai-agents/$m13_rel" ] || [ -e "$repo/claude/scaffold/ai-agents/$m13_rel" ]; then
  echo "13. planted a co-present file under a prune point ... ✗ MUTATION WAS A NO-OP — the probe needs"
  echo "   ai-agents/$m13_rel to exist and claude/scaffold/ai-agents/$m13_rel NOT to. If the file was"
  echo "   genuinely shipped to the scaffold, it is now really co-present under a blanket: that is a"
  echo "   LIVE tripwire hit, not a mutation — fix the exception list, then repoint this probe."
  fail=1
fi
cp "$repo/ai-agents/$m13_rel" "$m13/$m13_rel" 2>/dev/null || :
# ⚠️ THE POST-CONDITION, WHICH THE PRE-CHECK ABOVE CANNOT STAND IN FOR (round-1 review R2). The check
# above inspects the REPO; this one inspects the MUTANT COPY, and only this one can see that the `cp`
# above swallowed its own failure. `cp` fails when the destination directory is absent from the copy —
# e.g. `claude/scaffold/ai-agents/knowledge-base/reports/.gitkeep` is removed, so git stops tracking
# the directory and `make_scaffold_copy` has nothing to copy. Nothing would then be co-present, the
# suite would be RIGHTLY green, and the failure text below would accuse a WORKING test of not catching
# a file that was never planted. This is the same silent-disarm this script's own header records, with
# the sign reversed. (`cmp -s` reports non-zero for a missing destination too, which is the case here.)
if ! cmp -s "$repo/ai-agents/$m13_rel" "$m13/$m13_rel"; then
  echo "13. planted a co-present file under a prune point ... ✗ MUTATION WAS A NO-OP — the copy into"
  echo "   the mutant scaffold did not land at $m13_rel (is its parent directory missing from the"
  echo "   copy?). Nothing is co-present, so the result below proves nothing about the tripwire."
  fail=1
fi
printf '13. co-present file under a prune point — parity "no prune point hides a file" should go RED ... '
r13="$(run_parity_suite "$m13")"; echo "$r13"
if [ "$r13" != red ]; then
  echo "   ✗ the suite did NOT catch a dual-homed file hiding under a blanket directory exception —"
  echo "     0132's hand-off tripwire is not load-bearing."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*no prune point hides a file' "$out"; then
  echo "   ✗ suite went red but NOT at the tripwire assertion — red for the wrong reason."; fail=1
fi

# --- Mutation 14: revert dashboard.sh's ➡️ Moved target extractor to the PRE-0210 `Sprint`-only BRE →
#     the 0210/A assertion in dashboard-contract.test.js must go red (task 0210). This is the exact
#     state the file was in before 0210: `Backlog` was not in the vocabulary, so a correctly-written
#     reverse-move row resolved to NO target and was reported `moved-without-target`. It proves the six
#     0210 cases are load-bearing rather than merely present — the thing 0210's own plan said could not
#     be proven here without a test-architecture change. See the header note on this mutation's seam. --
m14="$(make_repo_copy repo-mutant-dashboard)"
m14_file="$m14/claude/skills/fkit-status/dashboard.sh"
cp "$m14_file" "$m14_file.orig"
# ⚠️ THE REPLACEMENT LINE COMES FROM A FILE, VIA getline — NOT from `awk -v`. awk processes escape
# sequences in a -v assignment, so `\[` and `\1` arrive stripped and the "mutation" is a mangled regex
# that breaks the script outright: every test reds, including ones the mutation has nothing to do with,
# and the named-assertion check below would still pass. Red for the wrong reason, disguised as success.
cat > "$work/m14-line.txt" <<'MUTANT_LINE'
    moved_target=$(printf '%s' "$st" | sed -n 's/.*Moved to \[*\(Sprint [0-9][0-9]*\).*/\1/p' | head -1)
MUTANT_LINE
awk -v repl="$work/m14-line.txt" '
  BEGIN { swapped = 0 }
  /moved_target=\$\(printf/ && swapped == 0 {
    while ((getline line < repl) > 0) print line
    close(repl)
    swapped = 1
    next
  }
  { print }
' "$m14_file.orig" > "$m14_file"
if cmp -s "$m14_file" "$m14_file.orig"; then
  echo "14. reverted move-target extractor ... ✗ MUTATION WAS A NO-OP — the awk no longer matches the"
  echo '   extractor line (has the `moved_target=$(printf` prefix been reworded?). This gate is'
  echo "   disarmed: it would report success while proving nothing. Fix the mutation in"
  echo "   test/prove-red.sh before trusting any result above."
  fail=1
fi
printf '14. move-target extractor reverted to Sprint-only — "0210/A" should go RED ... '
r14="$(run_dashboard_suite "$m14")"; echo "$r14"
if [ "$r14" != red ]; then
  echo "   ✗ the suite did NOT catch a dashboard.sh that cannot parse the reverse move — 0210's"
  echo "     reverse-move cases are not load-bearing."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*0210/A' "$out"; then
  echo "   ✗ suite went red but NOT at 0210/A — red for the wrong reason."; fail=1
fi

# --- Mutation 15: remove the launcher's structure_notice call → the 0247/drifted assertion in
#     structure-notice.test.js must go red (task 0247). The notice pass is launcher code — squarely
#     ADR-026 prove-red scope (unlike check.sh itself, whose 0245 suite recorded the opposite as a
#     stated assumption). The mutation removes the CALL, not the function: a launcher that still
#     defines structure_notice() but never runs it is exactly the silent regression this gate exists
#     to catch — every notice test's fixture would launch clean and quiet, green forever. ------------
m15="$(make_claude_copy claude-mutant-notice)"
cp "$m15" "$m15.orig"
sed -i.bak 's/^structure_notice || :$/: # mutation: structure notice pass removed (was: structure_notice || :)/' "$m15"
if cmp -s "$m15" "$m15.orig"; then
  echo "15. removed the structure_notice call ... ✗ MUTATION WAS A NO-OP — the sed no longer matches."
  echo "   This gate is disarmed: it would report success while proving nothing. Fix the mutation in"
  echo "   test/prove-red.sh before trusting any result above."
  fail=1
fi
printf '15. structure_notice call removed — "0247/drifted" should go RED ... '
r15="$(run_suite "$m15")"; echo "$r15"
if [ "$r15" != red ]; then
  echo "   ✗ the suite did NOT catch a launcher that never runs the structure notice."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*0247/drifted' "$out"; then
  echo "   ✗ suite went red but NOT at 0247/drifted — red for the wrong reason."; fail=1
fi

# --- Mutation 16: neuter the update banner's version-vs-version guard → the 0257/equal-versions
#     assertion in update-banner.test.js must go red (task 0257). `if : ; then` makes the vA → vB
#     branch unconditional, which is EXACTLY the pre-0257 launcher: a sha-triggered notice wearing a
#     version label, printing "v0.2.1 → v0.2.1 is available" whenever content moved without a bump. --
m16="$(make_claude_copy claude-mutant-banner-guard)"
cp "$m16" "$m16.orig"
sed -i.bak 's/^      if \[ -n "\$rver" \] && \[ -n "\$curver" \] && \[ "\$rver" != "\$curver" \]; then$/      if : ; then # mutation: banner guard neutered/' "$m16"
if cmp -s "$m16" "$m16.orig"; then
  echo "16. neutered the banner's version guard ... ✗ MUTATION WAS A NO-OP — the sed no longer matches."
  echo "   This gate is disarmed: it would report success while proving nothing. Fix the mutation in"
  echo "   test/prove-red.sh before trusting any result above."
  fail=1
fi
printf '16. banner version guard neutered — "0257/equal-versions" should go RED ... '
r16="$(run_banner_suite "$(dirname "$m16")")"; echo "$r16"
if [ "$r16" != red ]; then
  echo "   ✗ the suite did NOT catch a banner that claims an upgrade from a version to itself."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*0257/equal-versions' "$out"; then
  echo "   ✗ suite went red but NOT at 0257/equal-versions — red for the wrong reason."; fail=1
fi

# --- Mutation 17: restore the `${rver:-?}` placeholder in the banner's fallback branch → the
#     0257/no-curl assertion in update-banner.test.js must go red (task 0257). An install with no
#     curl can never learn the remote version (git ls-remote returns refs, not file content, and
#     GitHub refuses git archive --remote), so the old line rendered a literal "v?" at the reader.
#     This is the half of the defect the guard above does NOT cover: mutation 16 lives in the
#     condition, this one in the branch it falls through to. -----------------------------------------
m17="$(make_claude_copy claude-mutant-banner-placeholder)"
cp "$m17" "$m17.orig"
# ⚠️ THE REPLACEMENT LINE COMES FROM A FILE, VIA getline — the mutation-14 rule. awk processes escape
# sequences in a `-v` assignment, so the `\n`s in this printf format would arrive as real newlines and
# the "mutation" would be a broken launcher: every case reds, including ones this has nothing to do
# with, and the named-assertion check below would still pass. Red for the wrong reason, disguised as
# success. The three-line fallback branch is replaced by the single pre-0257 line.
cat > "$work/m17-line.txt" <<'MUTANT_LINE'
        printf '\n  ↑ fkit v%s → v%s is available. Run:  fkit update\n\n' "${curver:-?}" "${rver:-?}"
MUTANT_LINE
awk -v repl="$work/m17-line.txt" '
  BEGIN { swapped = 0; skip = 0 }
  skip > 0 { skip--; next }
  /newer content on %s/ && swapped == 0 {
    while ((getline line < repl) > 0) print line
    close(repl)
    swapped = 1
    skip = 2                 # drop the two continuation lines of the printf being replaced
    next
  }
  { print }
' "$m17.orig" > "$m17"
if cmp -s "$m17" "$m17.orig"; then
  echo "17. restored the v? placeholder ... ✗ MUTATION WAS A NO-OP — the awk no longer matches the"
  echo "   fallback printf (has the 'newer content on' wording changed?). This gate is disarmed: it"
  echo "   would report success while proving nothing. Fix the mutation in test/prove-red.sh."
  fail=1
elif grep -q 'newer content on' "$m17"; then
  echo "17. restored the v? placeholder ... ✗ MUTATION IS HALF-APPLIED — the fallback printf is still"
  echo "   in the mutant. The awk matched something else; the red below would prove nothing."
  fail=1
elif ! grep -q 'rver:-?' "$m17"; then
  echo "17. restored the v? placeholder ... ✗ MUTATION DID NOT LAND — no \${rver:-?} in the mutant."
  fail=1
fi
printf '17. v? placeholder restored — "0257/no-curl" should go RED ... '
r17="$(run_banner_suite "$(dirname "$m17")")"; echo "$r17"
if [ "$r17" != red ]; then
  echo "   ✗ the suite did NOT catch a banner that renders 'v?' at an install with no curl."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*0257/no-curl' "$out"; then
  echo "   ✗ suite went red but NOT at 0257/no-curl — red for the wrong reason."; fail=1
fi

# --- Mutation 18: make the `--no-tag` SUMMARY branch unreachable → the 0288/no-tag assertion in
#     release-summary.test.js must go red (task 0288). A `--no-tag` run then falls through to a branch
#     describing some other state, and the maintainer is told something untrue about a run that DID
#     publish commits. This is R1's publishing half — the case the original review missed.
#
#     ⚠️ SCOPED TO THE SUMMARY BLOCK. `} else if (!doTag) {` appears TWICE in the file; the first is the
#     execute section's skip-tag step, which 0288's fence puts out of bounds. The awk arms only after
#     the `// --- summary ---` marker. See the header note on this mutation. -------------------------
m18="$(make_release_copy release-mutant-notag)"
cp "$m18" "$m18.orig"
awk '
  BEGIN { insum = 0; done = 0 }
  /^\/\/ --- summary ---/ { insum = 1 }
  insum == 1 && done == 0 && /^} else if \(!doTag\) \{$/ {
    print "} else if (false) { // mutation: the --no-tag summary branch made unreachable"
    done = 1
    next
  }
  { print }
' "$m18.orig" > "$m18"
if cmp -s "$m18" "$m18.orig"; then
  echo "18. --no-tag summary branch disabled ... ✗ MUTATION WAS A NO-OP — the awk no longer matches."
  echo "   This gate is disarmed: it would report success while proving nothing. Fix the mutation in"
  echo "   test/prove-red.sh before trusting any result above."
  fail=1
elif ! grep -q 'the --no-tag summary branch made unreachable' "$m18"; then
  echo "18. --no-tag summary branch disabled ... ✗ MUTATION DID NOT LAND — marker absent from the mutant."
  fail=1
elif [ "$(grep -c '^} else if (!doTag) {$' "$m18")" != 1 ]; then
  echo "18. --no-tag summary branch disabled ... ✗ WRONG TARGET — the mutant should keep exactly ONE"
  echo "   \`} else if (!doTag) {\` (the EXECUTE section's). The awk hit the wrong occurrence, so the"
  echo "   red below would be about tag logic, not the summary. Fix the mutation in test/prove-red.sh."
  fail=1
fi
printf '18. --no-tag summary branch unreachable — "0288/no-tag" should go RED ... '
r18="$(run_release_suite "$m18")"; echo "$r18"
if [ "$r18" != red ]; then
  echo "   ✗ the suite did NOT catch a --no-tag run that misreports itself — R1's publishing case is"
  echo "     not load-bearing."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*0288/no-tag' "$out"; then
  echo "   ✗ suite went red but NOT at 0288/no-tag — red for the wrong reason."; fail=1
fi

# --- Mutation 19: replace `tagOnOrigin` with the naive `doTag && doPush` guard → the
#     0288/local-only-tag assertion must go red (task 0288). ⚠️ THIS IS THE MUTATION THE BRIEF ASKED
#     FOR BY NAME: both flags are TRUE in the local-tag-only state, so the naive guard falls through
#     and the summary reports the tag as already on origin when it is not there at all. It is the
#     precise trap the brief warned of — "a single guard may fix one and leave the other" — made
#     executable. N1 was found by reasoning; this is what stops it being re-lost by a refactor.
#
#     ⚠️ THE REPLACEMENT LINE COMES FROM A FILE, VIA getline — the mutation-14 rule, and it is not
#     optional here: the replacement contains `&&`, and in a `sed` replacement `&` means THE WHOLE
#     MATCH. A sed would splice the matched line into itself twice, producing a syntax error rather
#     than a mutant — every test reds, the named-assertion grep still passes, and the gate reports a
#     broken file as a successful catch. ------------------------------------------------------------
m19="$(make_release_copy release-mutant-naive-guard)"
cp "$m19" "$m19.orig"
cat > "$work/m19-line.txt" <<'MUTANT_LINE'
} else if (!(doTag && doPush)) { // mutation: tagOnOrigin replaced by the naive flag guard
MUTANT_LINE
awk -v repl="$work/m19-line.txt" '
  BEGIN { swapped = 0 }
  /^} else if \(!tagOnOrigin\) \{$/ && swapped == 0 {
    while ((getline line < repl) > 0) print line
    close(repl)
    swapped = 1
    next
  }
  { print }
' "$m19.orig" > "$m19"
if cmp -s "$m19" "$m19.orig"; then
  echo "19. tagOnOrigin → naive guard ... ✗ MUTATION WAS A NO-OP — the awk no longer matches"
  echo "   \`} else if (!tagOnOrigin) {\` (has the guard been renamed or reshaped?). This gate is"
  echo "   disarmed: it would report success while proving nothing. Fix it in test/prove-red.sh."
  fail=1
elif grep -q 'tagOnOrigin) {' "$m19"; then
  echo "19. tagOnOrigin → naive guard ... ✗ MUTATION IS HALF-APPLIED — the mutant still branches on"
  echo "   tagOnOrigin. The red below would prove nothing."
  fail=1
fi
printf '19. tagOnOrigin → the naive `doTag && doPush` — "0288/local-only-tag" should go RED ... '
r19="$(run_release_suite "$m19")"; echo "$r19"
if [ "$r19" != red ]; then
  echo "   ✗ the suite did NOT catch the naive two-flag guard — N1 is not load-bearing, and the exact"
  echo "     mistake the brief warned about would ship silently."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*0288/local-only-tag' "$out"; then
  echo "   ✗ suite went red but NOT at 0288/local-only-tag — red for the wrong reason."; fail=1
fi

# --- Mutation 20: replace the PEEL comparison with a plain existence check → the
#     0288/stale-origin-tag assertion must go red (task 0288). This is R2 restored exactly: an
#     existence check passes whether or not the tag names this release, and `git ls-remote` prints the
#     TAG OBJECT sha rather than the peeled commit, so a reader cannot tell by eye either. Replacement
#     via getline (mutation-14 rule) — the line carries backticks, `${tag}`, `^{}` and single quotes,
#     none of which survive a sed or an `awk -v` intact. ------------------------------------------
m20="$(make_release_copy release-mutant-existence-check)"
cp "$m20" "$m20.orig"
cat > "$work/m20-line.txt" <<'MUTANT_LINE'
  console.log(`  Which commit the tag names:   git ls-remote --exit-code --tags origin ${tag}`);
MUTANT_LINE
awk -v repl="$work/m20-line.txt" '
  BEGIN { swapped = 0 }
  /Which commit the tag names/ && swapped == 0 {
    while ((getline line < repl) > 0) print line
    close(repl)
    swapped = 1
    next
  }
  { print }
' "$m20.orig" > "$m20"
if cmp -s "$m20" "$m20.orig"; then
  echo "20. peel → existence check ... ✗ MUTATION WAS A NO-OP — the awk no longer matches the"
  echo "   'Which commit the tag names' line. Fix the mutation in test/prove-red.sh."
  fail=1
elif grep -q 'refs/tags/${tag}\^{}' "$m20"; then
  echo "20. peel → existence check ... ✗ MUTATION IS HALF-APPLIED — the peeled ref is still in the"
  echo "   mutant, so the printed command can still answer R2. The red below would prove nothing."
  fail=1
fi
printf '20. peel comparison → a plain existence check — "0288/stale-origin-tag" should go RED ... '
r20="$(run_release_suite "$m20")"; echo "$r20"
if [ "$r20" != red ]; then
  echo "   ✗ the suite did NOT catch a summary that prints an existence check for the stale-tag state —"
  echo "     R2's false green is not load-bearing."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*0288/stale-origin-tag' "$out"; then
  echo "   ✗ suite went red but NOT at 0288/stale-origin-tag — red for the wrong reason."; fail=1
fi

# --- Mutation 21: strip the speaking-failure tail from the printed verify command → the
#     0288/failure-speaks assertion must go red (task 0288). That restores R5 exactly: the check goes
#     back to printing NOTHING on either stream when the tag is absent. ⚠️ Note the mutant still exits
#     non-zero (git's own 2) — which is why 0288/failure-speaks asserts on OUTPUT, not just status. A
#     test that only checked `$?` would stay green here and prove nothing.
#
#     Two lines are replaced by one (the `+` continuation goes with the tail), so getline + skip —
#     the mutation-17 shape. ------------------------------------------------------------------------
m21="$(make_release_copy release-mutant-silent-fail)"
cp "$m21" "$m21.orig"
cat > "$work/m21-line.txt" <<'MUTANT_LINE'
    `  Verify tag on origin: git ls-remote --exit-code --tags origin ${tag}`,
MUTANT_LINE
awk -v repl="$work/m21-line.txt" '
  BEGIN { swapped = 0; skip = 0 }
  skip > 0 { skip--; next }
  /Verify tag on origin/ && swapped == 0 {
    while ((getline line < repl) > 0) print line
    close(repl)
    swapped = 1
    skip = 1                 # drop the ` || { echo …; false; }` continuation line
    next
  }
  { print }
' "$m21.orig" > "$m21"
if cmp -s "$m21" "$m21.orig"; then
  echo "21. stripped the speaking tail ... ✗ MUTATION WAS A NO-OP — the awk no longer matches the"
  echo "   'Verify tag on origin' line. Fix the mutation in test/prove-red.sh."
  fail=1
elif grep -q 'not confirmed on origin' "$m21"; then
  echo "21. stripped the speaking tail ... ✗ MUTATION IS HALF-APPLIED — the failure message is still"
  echo "   in the mutant, so the check can still speak. The red below would prove nothing."
  fail=1
fi
printf '21. verify command loses its speaking tail — "0288/failure-speaks" should go RED ... '
r21="$(run_release_suite "$m21")"; echo "$r21"
if [ "$r21" != red ]; then
  echo "   ✗ the suite did NOT catch a silently-failing verify command — R5 is not load-bearing."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*0288/failure-speaks' "$out"; then
  echo "   ✗ suite went red but NOT at 0288/failure-speaks — red for the wrong reason."; fail=1
fi

# --- Mutation 22: make the `✓ Released` headline unreachable → the 0288/default-released assertion
#     must go red (task 0288). ⚠️ THIS ONE GUARDS THE CONSTRAINT THE BRIEF SHOUTED LOUDEST — "the
#     default path is correct today, do not regress it". Every other mutation here proves a FIX is
#     load-bearing; this proves the thing that was already right cannot be broken silently. A default
#     release cut is the case a maintainer actually runs, and it is the one with no second chance.
#
#     ⚠️ IT ALSO REDS 0288/failure-speaks, and that is inherent, not sloppy: that assertion executes
#     the command the DEFAULT path printed, so a mutation stopping the default path printing it takes
#     both. The named-assertion check below is what this gate requires, and it holds. Mutations 18-21
#     each leave 0288/default-released GREEN — that isolation is itself evidence the default branch is
#     independent of the four fixes. -----------------------------------------------------------------
m22="$(make_release_copy release-mutant-no-headline)"
cp "$m22" "$m22.orig"
sed -i.bak 's/^} else if (tagCreated) {$/} else if (false) { \/\/ mutation: the released headline made unreachable/' "$m22"
if cmp -s "$m22" "$m22.orig"; then
  echo "22. released headline unreachable ... ✗ MUTATION WAS A NO-OP — the sed no longer matches"
  echo "   \`} else if (tagCreated) {\`. This gate is disarmed: it would report success while proving"
  echo "   nothing. Fix the mutation in test/prove-red.sh before trusting any result above."
  fail=1
fi
printf '22. ✓ Released headline unreachable — "0288/default-released" should go RED ... '
r22="$(run_release_suite "$m22")"; echo "$r22"
if [ "$r22" != red ]; then
  echo "   ✗ the suite did NOT catch a default path that stopped announcing the release — the one case"
  echo "     the brief forbids regressing is not covered."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*0288/default-released' "$out"; then
  echo "   ✗ suite went red but NOT at 0288/default-released — red for the wrong reason."; fail=1
fi

echo
if [ "$fail" = 0 ]; then
  echo "✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion."
  exit 0
fi
echo "✗ hard gate FAILED — see above."
exit 1
