#!/bin/sh
# fkit — set up the current project for the fkit agent team (idempotent) and launch a ROLE-LOCKED
# Claude Code session. This is the front door: `fkit` with no role shows a deterministic terminal
# menu (no LLM involved — picking a role is an if/else, not a judgment call), then execs the chosen
# role IN THIS SAME TAB.
#
#   fkit                    # menu → pick a role
#   fkit coder              # skip the menu, straight to the coder
#   fkit producer|architect|reviewer|wiki|adv|lead
#   fkit --resume           # any other arg is passed straight through to `claude`
#   fkit omnigent [...]     # the original Omnigent flavor
#   fkit update             # update fkit itself
#
# Every session is locked two ways:
#   * `--agent fkit-<role>`  — the role's system prompt and tool allowlist (harness-enforced)
#   * `--settings` with skillOverrides — every fkit-* skill the role does NOT own is turned "off":
#     hidden from the / menu AND unrunnable by name. That is what makes "the coder cannot run the
#     reviewer's procedure" a fact rather than a request.
#
# Want two roles at once? Open a terminal tab yourself and run `fkit` again. (We deliberately do not
# automate that: spawning terminals needs AppleScript/Accessibility permissions that fail in ways
# that are worse than pressing Cmd-T.)
#
# Env: FKIT_SETUP_ONLY=1 — set up but don't launch claude.
#      FKIT_NO_SELF_HOST=1 — never re-exec into a checkout's own claude/ (see below).
set -eu
here="$(cd "$(dirname "$0")" && pwd)"                  # .../claude
proj="$PWD"

# --- Self-hosting: dogfood the working tree, not the installed snapshot ------------------------
# `fkit` on PATH execs the INSTALLED copy under ~/.local/share/fkit/, so `here` points there — and
# setup copies agents/skills from `here` into the project's .claude/. Launched inside an fkit
# checkout, that silently overwrites the project with a snapshot of an older fkit: edits to
# claude/ never reach the agents, and no number of relaunches helps (the snapshot only moves on
# `fkit update`). Re-exec into the checkout's own script so the working tree is the source.
# The env guard makes the re-exec run exactly once; the path check is what identifies a checkout.
if [ "${FKIT_NO_SELF_HOST:-0}" != 1 ] \
   && [ -x "$proj/claude/fkit-claude.sh" ] \
   && [ "$proj/claude" != "$here" ]; then
  printf '\n  → self-hosting: running from %s (working tree), not the installed fkit.\n' "$proj/claude"
  FKIT_NO_SELF_HOST=1
  export FKIT_NO_SELF_HOST
  exec "$proj/claude/fkit-claude.sh" "$@"
fi

ROLES="producer coder architect reviewer adversarial-reviewer wiki lead"

case "${1:-}" in
  -h|--help)
    cat <<'EOF'
fkit — the fkit agent team, on Claude Code.

Usage: fkit [role] [claude-args…]

With no role you get a menu. Pick a role and it opens IN THIS TAB, locked to that role: it sees only
that role's skills and tools. For two roles at once, open another terminal tab and run `fkit` again.

Roles:
  producer     product & sprint planning, task briefs, task lifecycle
  coder        implementation — the only role that writes source
  architect    architecture, design specs, ADRs, feasibility
  reviewer     code review — its own pass + a Codex second opinion
  adv          adversarial reviewer — hostile pass, findings only
  wiki         the wiki — ingest / lint / sync (the exclusive write gateway)
  lead         the team room — routing help and wiki questions; does no work itself

Within a session, `@fkit-<role> <question>` asks another role and brings the answer back.

Other:
  fkit omnigent [...]   the original Omnigent flavor
  fkit update           update fkit itself
  FKIT_SETUP_ONLY=1     set the project up, then exit without launching

Anything that isn't a role is passed through to `claude` (e.g. `fkit --resume`).
EOF
    exit 0 ;;
esac

# An explicit role as the first bare word skips the menu.
role=""
case "${1:-}" in
  producer|coder|architect|reviewer|wiki|adversarial-reviewer|lead)
    role="$1"; shift ;;
  adv|adversarial)
    role="adversarial-reviewer"; shift ;;
esac

# ---------------------------------------------------------------------------
# Skill ownership — the single source of truth. A role sees ONLY these; every other fkit-* skill is
# turned off. Non-fkit skills (the project's own, the user's own) are never touched.
# ---------------------------------------------------------------------------
skills_for_role() {
  case "$1" in
    lead)      echo "fkit-team fkit-query" ;;
    producer)  echo "fkit-team fkit-query fkit-initiate-project fkit-task-done fkit-task-cancelled" ;;
    coder)     echo "fkit-team fkit-query fkit-plan-task fkit-process-review fkit-process-stateful-review" ;;
    architect) echo "fkit-team fkit-query fkit-survey-project fkit-inspect fkit-design-spec fkit-evaluate-approach fkit-record-decision" ;;
    reviewer)  echo "fkit-team fkit-query fkit-review fkit-stateful-review" ;;
    adversarial-reviewer) echo "fkit-team fkit-query fkit-adversarial-review" ;;
    wiki)      echo "fkit-team fkit-query fkit-wiki-ingest fkit-wiki-lint fkit-wiki-sync" ;;
    *)         echo "" ;;
  esac
}

# Writes the role's settings to a file and echoes its (relative) path. It goes in a FILE rather than
# inline on argv because a terminal with no title yet labels the tab with the command line — and a
# ~400-byte JSON blob makes every tab look identical. `--settings` takes a file or JSON; we take file.
build_settings() {   # → .fkit/settings/<role>.json containing {"skillOverrides":{"<not-owned>":"off",…}}
  allowed=" $(skills_for_role "$1") "
  body=""
  for d in "$proj"/.claude/skills/fkit-*/; do
    [ -d "$d" ] || continue
    s="$(basename "$d")"
    case "$allowed" in *" $s "*) continue ;; esac
    body="$body${body:+,}\"$s\":\"off\""
  done
  mkdir -p "$proj/.fkit/settings"
  printf '{"skillOverrides":{%s}}\n' "$body" > "$proj/.fkit/settings/$1.json"
  printf '.fkit/settings/%s.json' "$1"          # relative: we always exec from $proj (proj = $PWD)
}

# Name the tab for the role, so a wall of fkit tabs is readable. Claude Code overwrites this once the
# conversation has a topic (its own auto-title); until then this is what you see.
set_tab_title() {
  [ -t 1 ] || return 0
  printf '\033]0;fkit · %s — %s\007' "$1" "$(basename "$proj")"
}

# Setup runs every launch (idempotent), but stays QUIET on an already-set-up project — nobody wants
# a wall of "already present" on every single launch. A first-time setup prints its summary in full.
if [ -e "$proj/ai-agents" ] && [ -d "$proj/.claude/agents" ]; then
  "$here/fkit-claude-init.sh" "$proj" >/dev/null
else
  "$here/fkit-claude-init.sh" "$proj"
fi

[ "${FKIT_SETUP_ONLY:-0}" = 1 ] && exit 0

command -v claude >/dev/null 2>&1 || {
  echo >&2
  echo "⚠ Claude Code ('claude') is not installed / not on PATH." >&2
  echo "  Install it from https://claude.com/claude-code, then run:  claude" >&2
  exit 127
}

# --- Fresh project: skip the menu, go straight to the producer's cold start -------------------
pm="$proj/ai-agents/knowledge-base/PROJECT.md"
fresh=0
if [ ! -f "$pm" ] \
   || grep -q 'fkit:uninitialized' "$pm" 2>/dev/null \
   || grep -qF '# <Project name>' "$pm" 2>/dev/null; then
  fresh=1
fi
if [ "$fresh" = 1 ] && [ -z "$role" ]; then
  printf '\n  This project is not initiated yet — starting the producer to set it up.\n'
  role="producer"
  [ -x "$proj/.fkit/interview" ] && { "$proj/.fkit/interview" || true; }
  if [ -f "$proj/.fkit/intake.md" ]; then
    seed="This is a fresh fkit project. The owner just completed the intake questionnaire in .fkit/intake.md — READ THAT FILE FIRST and use it as the product brief. Then run your fkit-initiate-project procedure: do NOT re-ask what the intake already answers; only follow up on blank (—) or genuinely ambiguous items."
  else
    seed="This is a fresh fkit project — run your fkit-initiate-project procedure now: interview me about the product, have the fkit-architect agent survey the codebase, then write PROJECT.md and the architecture doc so we're ready to work."
  fi
  settings="$(build_settings producer)"
  set_tab_title producer
  exec claude --agent fkit-producer --settings "$settings" "$@" "$seed"
fi

# --- The menu (deterministic; no LLM) ----------------------------------------------------------
# Only when no role was named AND no other args were passed AND we have a terminal to ask on.
if [ -z "$role" ] && [ "$#" -eq 0 ] && { [ -t 0 ] || [ -r /dev/tty ]; }; then
  if [ -t 0 ]; then exec 3<&0; else exec 3</dev/tty; fi
  proj_name="$(basename "$proj")"
  branch="$(git -C "$proj" rev-parse --abbrev-ref HEAD 2>/dev/null || echo '-')"
  dirty=""
  git -C "$proj" diff --quiet 2>/dev/null || dirty=" · uncommitted changes"

  printf '\n  \033[1mfkit\033[0m — %s  (%s%s)\n\n' "$proj_name" "$branch" "$dirty"
  printf '   1) producer     product & sprint planning, task briefs\n'
  printf '   2) coder        implementation — the only role that writes source\n'
  printf '   3) architect    design specs, ADRs, feasibility\n'
  printf '   4) reviewer     code review (own pass + Codex second opinion)\n'
  printf '   5) adversarial  hostile pass, findings only\n'
  printf '   6) wiki         the wiki — ingest / lint / sync\n'
  printf '   7) team room    not sure who you need? ask here\n\n'
  printf '  Two roles at once? Open another terminal tab and run fkit again.\n\n'

  while [ -z "$role" ]; do
    printf '  role [1-7, q to quit]: '
    IFS= read -r pick <&3 || { echo; exit 0; }
    case "$pick" in
      1|producer)            role="producer" ;;
      2|coder)               role="coder" ;;
      3|architect)           role="architect" ;;
      4|reviewer)            role="reviewer" ;;
      5|adv|adversarial)     role="adversarial-reviewer" ;;
      6|wiki)                role="wiki" ;;
      7|lead|team|"team room") role="lead" ;;
      q|Q|quit|exit)         echo; exit 0 ;;
      "")                    : ;;
      *)                     printf '  ? "%s" is not one of 1-7.\n' "$pick" ;;
    esac
  done
  exec 3<&-
fi

# No role, not interactive (piped/CI, or extra args given) → the team room is the safe default.
[ -n "$role" ] || role="lead"

if [ "$role" = lead ]; then
  printf '\n  → team room. It routes and answers wiki questions; it does no work itself.\n\n'
else
  printf '\n  → %s session (locked: only the %s'"'"'s skills exist here).\n\n' "$role" "$role"
fi
settings="$(build_settings "$role")"
set_tab_title "$role"
exec claude --agent "fkit-$role" --settings "$settings" "$@"
