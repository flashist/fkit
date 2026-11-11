#!/bin/sh
set -eu
here="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
if [ -f "$PWD/opencode/setup.mjs" ] && [ "$PWD/opencode" != "$here" ]; then
  exec sh "$PWD/opencode/fkit-opencode.sh" "$@"
fi
case "${1:-}" in
  --help|-h) printf '%s\n' 'Usage: fkit opencode [lead|producer|coder|architect|reviewer|adversarial-reviewer|wiki|init|board] [--no-plan-review|--plan-review] [OpenCode flags]'; exit 0 ;;
  board) shift; exec node "$here/../bin/fkit-board.mjs" "$@" ;;
esac
command -v node >/dev/null 2>&1 || { echo 'fkit opencode requires Node.js' >&2; exit 127; }
plan_review=1
plan_on=0
plan_off=0
literal=0
value=0
# Preserve OpenCode option values and everything after --; only FKit switches belong to this parser.
for arg do
  shift
  if [ "$literal" = 1 ] || [ "$value" = 1 ]; then
    set -- "$@" "$arg"
    value=0
    continue
  fi
  case "$arg" in
    --) literal=1; set -- "$@" "$arg" ;;
    --no-plan-review) plan_off=1; plan_review=0 ;;
    --plan-review) plan_on=1 ;;
    --prompt|--model|-m|--server|--session|-s|--log-level)
      set -- "$@" "$arg"; value=1 ;;
    *) set -- "$@" "$arg" ;;
  esac
done
if [ "$plan_on" = 1 ] && [ "$plan_off" = 1 ]; then
  echo 'Choose --plan-review or --no-plan-review, not both.' >&2
  exit 2
fi
role="${1:-lead}"
case "$role" in
  lead|producer|coder|architect|reviewer|adversarial-reviewer|wiki|init) [ "$#" -eq 0 ] || shift ;;
  -*) role=lead ;;
  *) echo "Unknown fkit role: $role" >&2; exit 2 ;;
esac
FKIT_OPENCODE_PLAN_REVIEW="$plan_review" FKIT_OPENCODE_ROLE="$role" node "$here/setup.mjs" "$PWD"
[ "$role" != init ] || exit 0
command -v opencode >/dev/null 2>&1 || { echo 'Install OpenCode: https://opencode.ai/docs/' >&2; exit 127; }
# OpenCode merges this dedicated source with the consuming project's own configuration.
OPENCODE_CONFIG="${OPENCODE_CONFIG:-$PWD/.opencode/fkit.json}"
export OPENCODE_CONFIG
pm=ai-agents/knowledge-base/PROJECT.md
if [ "$role" = lead ] && { [ ! -f "$pm" ] || grep -q 'fkit:uninitialized\|# <Project name>' "$pm"; }; then
  exec opencode mini --agent fkit-lead --prompt 'Use fkit-producer to check whether PROJECT.md is a placeholder. If so run fkit-initiate-project; otherwise continue with the requested role.' "$@"
fi
exec opencode mini --agent "fkit-$role" "$@"
