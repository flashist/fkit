#!/bin/bash
# canary.sh — task 0177. Does codex-cli strip HTML comments from AGENTS.md before the file
# reaches the model?
#
# Method: build a THROWAWAY git repo outside the fkit checkout, give it an AGENTS.md carrying two
# random tokens — one in ordinary prose, one inside an HTML comment — and ask codex, through the
# real `codex exec` path, which of them it can see in its instructions.
#
#   CANARY-PLAIN-<rand>    in prose            → POSITIVE CONTROL: AGENTS.md was loaded at all
#   CANARY-COMMENT-<rand>  inside <!-- ... --> → THE TEST
#   CANARY-ABSENT-<rand>   exists nowhere      → NEGATIVE CONTROL against confabulation
#
# ⚠️ THE CONFOUND THIS SCRIPT EXISTS TO EXCLUDE. A model that simply runs `cat AGENTS.md` produces
# output IDENTICAL to a model that received the comment in its context. Three mitigations, all
# required: `-s read-only`, an explicit no-tool instruction, and verification from the `--json`
# event stream that NO shell command executed. Any run with a tool call is VOID and re-run.
#
# ⛔ NEVER point this at the fkit checkout. It writes AGENTS.md. It runs in its own scratch dir —
# created fresh with `mktemp -d` under the parent you name, never overwritten and never deleted —
# freshly `git init`'d at its own root so codex's CWD-upward AGENTS.md discovery stops there.
set -u

die() { echo "$*" >&2; exit 2; }

# ⚠️ No apostrophe in the message below: inside `${1:?word}` a single quote opens a quoted string
# even within the surrounding double quotes, and the script fails to parse at all.
WORK="${1:?usage: canary.sh <scratch-dir> [reps] — the PARENT of <scratch-dir> must already exist; a fresh <scratch-dir>.XXXXXXXX is created under it}"
REPS="${2:-3}"

# Structural guard, not a name match: refuse if the scratch dir would land inside the fkit checkout.
# (A substring test on "fkit" is wrong — a legitimate scratch path can contain the word incidentally.)
#
# ⚠️ EVERY STEP BELOW IS FATAL ON FAILURE, NEVER SKIP-ON-FAILURE (review R1). The first draft
# canonicalized with `cd … 2>/dev/null && pwd -P` and carried on when that failed, which gave the
# guard two reproduced fail-open paths:
#   (a) a nonexistent parent collapsed the resolved path to `/<basename>`, so `<repo>/nope/scratch`
#       resolved to `/scratch` and an in-checkout target was ALLOWED;
#   (b) a copy of this script sitting outside any git repo left FKIT_REPO empty, so the whole guard
#       was skipped — and a copy inside a DIFFERENT repo derived that repo's root, which protects the
#       wrong tree just as silently.
# A guard that quietly turns itself off is worse than no guard, because the caller believes it ran.
_src="explicitly-passed FKIT_REPO"
[ -n "${FKIT_REPO:-}" ] || _src="derived from \$0 ($0)"
FKIT_REPO="${FKIT_REPO:-$(cd "$(dirname "$0")" 2>/dev/null && git rev-parse --show-toplevel 2>/dev/null)}"
[ -n "${FKIT_REPO:-}" ] || die "REFUSING: cannot derive the fkit checkout root from \$0 ($0) — this script is not inside a git repo. Pass FKIT_REPO=<path-to-fkit-checkout> explicitly; running without the containment guard is not an option."
_r=$(cd "$FKIT_REPO" 2>/dev/null && pwd -P)
[ -n "$_r" ] || die "REFUSING: FKIT_REPO=$FKIT_REPO does not resolve to a directory."
# ⚠️ RESOLVING IS NOT IDENTIFYING (round 2, 2026-08-16). The checks above only prove that some
# directory was named and exists. They do NOT prove it is the fkit checkout, and case (b) has two
# halves: the empty derivation is fatal above, but a copy of this script inside a DIFFERENT git repo
# makes `git rev-parse` SUCCEED and return that repo's root — every check above then passes, the
# guard runs, reports success, and protects the wrong tree while an in-fkit target sails through.
# Re-verified still failing against the round-1 hardening before this fix was written.
# So: the resolved root must carry markers that only the fkit checkout has. Deliberately applied to
# an explicitly-passed FKIT_REPO as well as a derived one — the variable means "the fkit checkout",
# and a wrong explicit value protects the wrong tree exactly as silently as a wrong derived one.
# Fail-closed by construction: rename a marker and this dies with the marker named, rather than
# quietly reverting to the fail-open behaviour it exists to prevent.
for _m in claude/fkit-claude.sh claude/skills-for-role.sh ai-agents/knowledge-base/PROJECT.md; do
  [ -e "$_r/$_m" ] || die "REFUSING: $_r is not the fkit checkout — no $_m under it. That root was $_src. A copy of this script inside another git repo derives that repo's root and would guard the wrong tree, so an unidentifiable root is fatal. Pass FKIT_REPO=<path-to-fkit-checkout> explicitly."
done
_p=$(cd "$(dirname "$WORK")" 2>/dev/null && pwd -P)
[ -n "$_p" ] || die "REFUSING: the parent of $WORK does not exist, so the path cannot be canonicalized and the containment guard cannot be trusted. Create the parent, or name a scratch dir whose parent exists."
_w="$_p/$(basename "$WORK")"
case "$_w/" in
  "$_r"/*) die "REFUSING: $WORK is inside the fkit checkout ($_r). This script writes AGENTS.md." ;;
esac

RAND=$(head -c 8 /dev/urandom | od -An -tx1 | tr -d ' \n')
PLAIN="CANARY-PLAIN-$RAND"
COMMENT="CANARY-COMMENT-$RAND"
ABSENT="CANARY-ABSENT-$RAND"

# ⚠️ NEVER `rm -rf` a caller-supplied path (review R1). The old form was `rm -rf "$WORK"`, which is
# one mistyped argument away from destroying a real directory — and it fired even on the paths the
# guard above had just failed to canonicalize. `mktemp -d` creates a fresh, uniquely-named dir under
# the already-canonicalized parent instead, so this script now deletes nothing, ever.
WORK=$(mktemp -d "$_p/$(basename "$WORK").XXXXXXXX") || die "mktemp -d failed under $_p"
cd "$WORK" || exit 1
git init -q .
git config user.email c@example.invalid; git config user.name canary

cat > AGENTS.md <<EOF
# Canary project

Scratch project. Nothing here is real work.

Plain-prose token: $PLAIN

<!-- canary-managed: this comment block mimics the shape of the fkit-managed rules wrapper,
     which is a multi-line HTML comment sitting between two marker lines.
     Comment token: $COMMENT -->

End of file.
EOF

PROMPT="Do not run any command. Do not read any file. Do not use any tool. Answer only from the instructions already present in your context.
1. List every token matching CANARY-* that appears in your INSTRUCTIONS (ignore any token appearing in this message itself). If there are none, write NONE.
2. Does the exact token $ABSENT appear in your instructions? Answer YES or NO.
Reply with only those two answers, nothing else."

echo "=== canary.sh — codex comment-stripping canary ==="
echo "codex version : $(codex --version)"
echo "scratch dir   : $WORK"
echo "git root      : $(git rev-parse --show-toplevel)"
echo "plain token   : $PLAIN"
echo "comment token : $COMMENT"
echo "absent token  : $ABSENT"
echo "reps          : $REPS"
echo
echo "--- AGENTS.md as written ---"
cat AGENTS.md
echo "--- end AGENTS.md ---"
echo

for i in $(seq 1 "$REPS"); do
  echo "############ REP $i ############"
  RAW="$WORK/rep$i.jsonl"
  codex exec --ephemeral -s read-only --skip-git-repo-check -C "$WORK" --json "$PROMPT" > "$RAW" 2>"$WORK/rep$i.err"
  echo "exit: $?"

  echo "--- agent message(s) ---"
  # Print any assistant/agent text the event stream carries, without assuming one schema shape.
  grep -o '"text":"[^"]*"' "$RAW" | sed 's/^"text":"//; s/"$//' | while IFS= read -r l; do printf '%b\n' "$l"; done
  echo "--- end agent message(s) ---"

  echo "--- CONFOUND CHECK: did any shell command execute? ---"
  if grep -qiE '"(exec_command|command_execution|shell)[^"]*"|"type":"[^"]*exec[^"]*"' "$RAW"; then
    echo "TOOL CALL DETECTED — THIS REP IS VOID"
    grep -oiE '"type":"[^"]*"' "$RAW" | sort | uniq -c
  else
    echo "no command-execution event found — rep is admissible"
  fi
  echo "--- event types seen ---"
  grep -oE '"type":"[^"]*"' "$RAW" | sort | uniq -c
  echo
done
